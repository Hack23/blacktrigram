import { AudioAssetLoader, LoadOptions } from "./AudioAssetLoader";
import {
  AudioFPSImpact,
  AudioMemoryStats,
  AudioMonitor,
  AudioPerformanceStats,
  MemoryWarning,
} from "./AudioMonitor";
import { AudioElementPool, PoolStatistics } from "./AudioPool";
import {
  AudioAsset,
  AudioConfig,
  IAudioManager,
  MusicTrackId,
  SoundEffectId,
} from "./types";

// Estimated average size per audio asset in MB (based on typical compressed audio file sizes)
const ESTIMATED_ASSET_SIZE_MB = 0.5;

export class AudioManager implements IAudioManager {
  private _masterVolume: number = 1.0;
  private _musicVolume: number = 0.7;
  private _sfxVolume: number = 0.8;
  private _muted: boolean = false;
  private _currentMusicTrack: string | null = null;
  private _fallbackMode: boolean = false;
  private currentMusic: HTMLAudioElement | null = null;
  private soundCache: Map<string, HTMLAudioElement> = new Map();
  private _isInitialized: boolean = false;

  // New optimized components
  private assetLoader: AudioAssetLoader;
  private audioPool: AudioElementPool;
  private monitor: AudioMonitor;
  private frequentSounds: Set<string> = new Set([
    "hit_light",
    "attack_light",
    "stance_change",
  ]);

  constructor(config?: Partial<AudioConfig>) {
    if (config) {
      this._masterVolume = config.masterVolume ?? 1.0;
      this._musicVolume = config.musicVolume ?? 0.7;
      this._sfxVolume = config.sfxVolume ?? 0.8;
    }

    // Initialize new components
    this.assetLoader = new AudioAssetLoader();
    this.audioPool = new AudioElementPool();
    this.monitor = new AudioMonitor();
  }

  /**
   * Helper method to release pooled audio back to the pool after playback
   * @param id - Asset ID
   * @param audio - Audio element to release
   */
  private releasePooledAudio(id: string, audio: HTMLAudioElement): void {
    if (!audio.paused) {
      audio.addEventListener(
        "ended",
        () => {
          this.audioPool.release(id, audio);
        },
        { once: true }
      );
    } else {
      this.audioPool.release(id, audio);
    }
  }

  // Interface getters
  get isInitialized(): boolean {
    return this._isInitialized;
  }

  get fallbackMode(): boolean {
    return this._fallbackMode;
  }

  get currentMusicTrack(): string | null {
    return this._currentMusicTrack;
  }

  get masterVolume(): number {
    return this._masterVolume;
  }

  get sfxVolume(): number {
    return this._sfxVolume;
  }

  get musicVolume(): number {
    return this._musicVolume;
  }

  get muted(): boolean {
    return this._muted;
  }

  async initialize(config?: AudioConfig): Promise<void> {
    try {
      // Remove unused audioContext variable
      new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      this._isInitialized = true;
      this._fallbackMode = false;

      if (config) {
        this._masterVolume = config.masterVolume ?? this._masterVolume;
        this._musicVolume = config.musicVolume ?? this._musicVolume;
        this._sfxVolume = config.sfxVolume ?? this._sfxVolume;
      }

      // Set memory threshold if configured
      if (config?.maxSimultaneousSounds) {
        const estimatedMemoryMB =
          config.maxSimultaneousSounds * ESTIMATED_ASSET_SIZE_MB;
        this.monitor.setMemoryThreshold(estimatedMemoryMB);
      }
    } catch (error) {
      console.warn(
        "AudioContext initialization failed, using fallback mode:",
        error
      );
      this._isInitialized = true;
      this._fallbackMode = true;
    }
  }

  async loadAsset(asset: AudioAsset, options?: LoadOptions): Promise<void> {
    const startTime = performance.now();

    try {
      // Use faster timeouts for testing environment
      // Safely check for Node.js environment to avoid runtime errors in browsers
      const isTest =
        typeof process !== "undefined" && process?.env?.NODE_ENV === "test";
      const loadOptions: LoadOptions = {
        timeout: isTest ? 100 : 10000,
        maxRetries: isTest ? 1 : 3,
        retryDelay: isTest ? 10 : 1000,
        ...options,
      };

      // Use AudioAssetLoader with retry and fallback
      const result = await this.assetLoader.loadAsset(asset, loadOptions);

      if (result.success && result.audio) {
        result.audio.volume = asset.volume ?? 1.0;
        this.soundCache.set(asset.id, result.audio);

        // Track performance and memory
        const loadTime = performance.now() - startTime;
        this.monitor.recordLoad(asset.id, loadTime, ESTIMATED_ASSET_SIZE_MB);

        // Create pool for frequently used sounds
        if (this.frequentSounds.has(asset.id)) {
          this.audioPool.createPool(asset.id, asset.url, {
            initialSize: 3,
            maxSize: 10,
            autoExpand: true,
          });
        }
      } else {
        // Record failure
        const error = result.error ?? new Error("Unknown load error");
        this.monitor.recordLoadFailure(asset.id, error);

        // Still cache the placeholder audio
        if (result.audio) {
          this.soundCache.set(asset.id, result.audio);
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.warn(`Failed to load audio asset ${asset.id}:`, err);
      this.monitor.recordLoadFailure(asset.id, err);
    }
  }

  async playSoundEffect(id: SoundEffectId): Promise<void> {
    if (this._muted) return;

    const playbackStart = performance.now();

    try {
      // Use pool for frequently played sounds
      if (this.frequentSounds.has(id) && this.audioPool.hasPool(id)) {
        const audio = this.audioPool.acquire(id);
        if (audio) {
          audio.volume = this._sfxVolume * this._masterVolume;
          await audio.play();

          // Release back to pool after playback (non-blocking)
          this.releasePooledAudio(id, audio);

          const latency = performance.now() - playbackStart;
          this.monitor.recordPlaybackLatency(latency);
          return;
        }
      }

      // Fallback to cached audio
      const audio = this.soundCache.get(id);
      if (audio) {
        audio.currentTime = 0;
        audio.volume = this._sfxVolume * this._masterVolume;
        await audio.play();

        const latency = performance.now() - playbackStart;
        this.monitor.recordPlaybackLatency(latency);
      }
    } catch (error) {
      console.warn(`Failed to play sound effect ${id}:`, error);
    }
  }

  // Alias for playSoundEffect to match interface
  async playSFX(id: SoundEffectId, volume?: number): Promise<void> {
    if (this._muted) return;

    const playbackStart = performance.now();

    try {
      // Use pool for frequently played sounds
      if (this.frequentSounds.has(id) && this.audioPool.hasPool(id)) {
        const audio = this.audioPool.acquire(id);
        if (audio) {
          audio.volume = (volume ?? this._sfxVolume) * this._masterVolume;
          await audio.play();

          // Release back to pool after playback (non-blocking)
          this.releasePooledAudio(id, audio);

          const latency = performance.now() - playbackStart;
          this.monitor.recordPlaybackLatency(latency);
          return;
        }
      }

      // Fallback to cached audio
      const audio = this.soundCache.get(id);
      if (audio) {
        audio.currentTime = 0;
        audio.volume = (volume ?? this._sfxVolume) * this._masterVolume;
        await audio.play();

        const latency = performance.now() - playbackStart;
        this.monitor.recordPlaybackLatency(latency);
      }
    } catch (error) {
      console.warn(`Failed to play sound effect ${id}:`, error);
    }
  }

  async playMusic(id: MusicTrackId, volume?: number): Promise<void> {
    if (this._muted) return;

    this.stopMusic();

    const audio = this.soundCache.get(id);
    if (audio) {
      try {
        audio.currentTime = 0;
        audio.volume = (volume ?? this._musicVolume) * this._masterVolume;
        audio.loop = true;
        this.currentMusic = audio;
        this._currentMusicTrack = id;
        await audio.play();
      } catch (error) {
        console.warn(`Failed to play music ${id}:`, error);
      }
    }
  }

  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
      this._currentMusicTrack = null;
    }
  }

  stopAll(): void {
    this.stopMusic();
    this.soundCache.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }

  setVolume(type: "master" | "sfx" | "music" | "voice", volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));

    switch (type) {
      case "master":
        this._masterVolume = clampedVolume;
        break;
      case "sfx":
        this._sfxVolume = clampedVolume;
        break;
      case "music":
        this._musicVolume = clampedVolume;
        if (this.currentMusic) {
          this.currentMusic.volume = this._musicVolume * this._masterVolume;
        }
        break;
      case "voice":
        // Handle voice volume if needed
        break;
    }
  }

  mute(): void {
    this._muted = true;
    if (this.currentMusic) {
      this.currentMusic.volume = 0;
    }
  }

  unmute(): void {
    this._muted = false;
    if (this.currentMusic) {
      this.currentMusic.volume = this._musicVolume * this._masterVolume;
    }
  }

  async fadeOut(duration: number = 1000): Promise<void> {
    if (!this.currentMusic) return;

    const musicElement = this.currentMusic;
    return new Promise((resolve) => {
      const startVolume = musicElement.volume;
      const fadeStep = startVolume / (duration / 50);

      const fadeInterval = setInterval(() => {
        if (this.currentMusic && this.currentMusic.volume > 0) {
          this.currentMusic.volume = Math.max(
            0,
            this.currentMusic.volume - fadeStep
          );
        } else {
          clearInterval(fadeInterval);
          this.stopMusic();
          resolve();
        }
      }, 50);
    });
  }

  async fadeIn(trackId: MusicTrackId, duration: number = 1000): Promise<void> {
    await this.playMusic(trackId, 0);

    if (!this.currentMusic) return;

    return new Promise((resolve) => {
      const targetVolume = this._musicVolume * this._masterVolume;
      const fadeStep = targetVolume / (duration / 50);

      const fadeInterval = setInterval(() => {
        if (this.currentMusic && this.currentMusic.volume < targetVolume) {
          this.currentMusic.volume = Math.min(
            targetVolume,
            this.currentMusic.volume + fadeStep
          );
        } else {
          clearInterval(fadeInterval);
          resolve();
        }
      }, 50);
    });
  }

  async crossfade(
    fromTrackId: MusicTrackId,
    toTrackId: MusicTrackId,
    duration: number = 1000
  ): Promise<void> {
    // Fix: Remove unused fromTrackId parameter or use it properly
    const fadeOutPromise = this.fadeOut(duration);
    await fadeOutPromise;
    await this.fadeIn(toTrackId, duration);
    console.log(`Crossfaded from ${fromTrackId} to ${toTrackId}`);
  }

  getLoadedAssets(): ReadonlyMap<string, HTMLAudioElement> {
    return new Map(this.soundCache);
  }

  // Additional methods to match interface
  async playVoice(id: string): Promise<void> {
    return this.playSoundEffect(id);
  }

  async playKoreanTechniqueSound(
    techniqueId: string,
    archetype: string
  ): Promise<void> {
    const soundId = `${archetype}_${techniqueId}`;
    return this.playSoundEffect(soundId);
  }

  async playTrigramStanceSound(stance: string): Promise<void> {
    const soundId = `stance_${stance}`;
    return this.playSoundEffect(soundId);
  }

  async playVitalPointHitSound(severity: string): Promise<void> {
    const soundId = `vital_point_${severity}`;
    return this.playSoundEffect(soundId);
  }

  async playDojiangAmbience(): Promise<void> {
    return this.playMusic("dojang_ambience");
  }

  // Legacy getters for backward compatibility
  getMasterVolume(): number {
    return this._masterVolume;
  }

  getMusicVolume(): number {
    return this._musicVolume;
  }

  getSfxVolume(): number {
    return this._sfxVolume;
  }

  get initialized(): boolean {
    return this._isInitialized;
  }

  // New optimized methods

  /**
   * Batch load multiple assets with progress tracking
   * @param assets - Array of audio assets to load
   * @param options - Optional load configuration (timeout, retries, etc.)
   * @param onProgress - Optional callback for progress updates with loaded and total counts
   * @returns Promise that resolves when all assets are processed
   */
  async batchLoadAssets(
    assets: readonly AudioAsset[],
    options?: LoadOptions,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> {
    const results = await this.assetLoader.batchLoad(
      assets,
      options,
      (progress) => {
        onProgress?.(progress.loaded, progress.total);
      }
    );

    // Process results
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const asset = assets[i];

      if (result.success && result.audio) {
        result.audio.volume = asset.volume ?? 1.0;
        this.soundCache.set(asset.id, result.audio);

        // Create pool for frequently used sounds
        if (this.frequentSounds.has(asset.id)) {
          this.audioPool.createPool(asset.id, asset.url, {
            initialSize: 3,
            maxSize: 10,
            autoExpand: true,
          });
        }
      }
    }
  }

  /**
   * Unload an asset to free memory
   * @param assetId - ID of the asset to unload
   * @returns true if asset was unloaded, false if asset was not found
   */
  unloadAsset(assetId: string): boolean {
    // Remove from cache
    const audio = this.soundCache.get(assetId);
    if (audio) {
      audio.pause();
      audio.src = "";
      this.soundCache.delete(assetId);
    }

    // Remove from loader cache
    const unloaded = this.assetLoader.unloadAsset(assetId);

    // Remove pool if exists
    if (this.audioPool.hasPool(assetId)) {
      this.audioPool.removePool(assetId);
    }

    // Unregister from monitor
    this.monitor.unregisterAsset(assetId);

    return unloaded || audio !== undefined;
  }

  /**
   * Get memory statistics including total loaded MB, asset count, and warnings
   * @returns Memory statistics object
   */
  getMemoryStats(): AudioMemoryStats {
    return this.monitor.getMemoryStats();
  }

  /**
   * Get performance statistics including load times and playback latency
   * @returns Performance statistics object
   */
  getPerformanceStats(): AudioPerformanceStats {
    return this.monitor.getPerformanceStats();
  }

  /**
   * Get FPS impact analysis showing baseline vs current FPS and detected drops
   * @returns FPS impact analysis object
   */
  getFPSImpact(): AudioFPSImpact {
    return this.monitor.getFPSImpact();
  }

  /**
   * Update FPS measurement for monitoring
   * @param fps - Current frames per second measurement
   */
  updateFPS(fps: number): void {
    this.monitor.updateFPS(fps);
  }

  /**
   * Get comprehensive monitoring report including memory, performance, FPS, and warnings
   * @returns Comprehensive monitoring report object
   */
  getMonitoringReport(): {
    readonly memory: AudioMemoryStats;
    readonly performance: AudioPerformanceStats;
    readonly fps: AudioFPSImpact;
    readonly warnings: readonly MemoryWarning[];
  } {
    return this.monitor.getReport();
  }

  /**
   * Get all memory warnings
   * @returns Array of memory warnings
   */
  getMemoryWarnings(): readonly MemoryWarning[] {
    return this.monitor.getWarnings();
  }

  /**
   * Clear memory warnings
   */
  clearMemoryWarnings(): void {
    this.monitor.clearWarnings();
  }

  /**
   * Get pool statistics for a specific asset or all pools
   * @param assetId - Optional asset ID to get specific pool stats
   * @returns Pool statistics for the specified asset or all pools
   */
  getPoolStatistics(
    assetId?: string
  ): PoolStatistics | Map<string, PoolStatistics> | undefined {
    if (assetId) {
      return this.audioPool.getPoolStatistics(assetId);
    }
    return this.audioPool.getAllStatistics();
  }

  /**
   * Get loader statistics including cached assets and loading state
   * @returns Loader statistics object
   */
  getLoaderStatistics(): {
    readonly cached: number;
    readonly loading: number;
    readonly totalAttempts: number;
  } {
    return this.assetLoader.getStatistics();
  }
}

export default AudioManager;
