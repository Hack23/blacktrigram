import type {
  AudioAsset,
  AudioConfig,
  AudioManager as IAudioManager,
  SoundEffectId,
  MusicTrackId,
} from "../types/audio";

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

  constructor(config?: Partial<AudioConfig>) {
    if (config) {
      this._masterVolume = config.masterVolume ?? 1.0;
      this._musicVolume = config.musicVolume ?? 0.7;
      this._sfxVolume = config.sfxVolume ?? 0.8;
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
      new (window.AudioContext || (window as any).webkitAudioContext)();
      this._isInitialized = true;
      this._fallbackMode = false;

      if (config) {
        this._masterVolume = config.masterVolume ?? this._masterVolume;
        this._musicVolume = config.musicVolume ?? this._musicVolume;
        this._sfxVolume = config.sfxVolume ?? this._sfxVolume;
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

  async loadAsset(asset: AudioAsset): Promise<void> {
    try {
      const audio = new Audio(asset.url);
      audio.volume = asset.volume || 1.0;
      audio.preload = "auto";
      this.soundCache.set(asset.id, audio);
    } catch (error) {
      console.warn(`Failed to load audio asset ${asset.id}:`, error);
    }
  }

  async playSoundEffect(id: SoundEffectId): Promise<void> {
    if (this._muted) return;

    const audio = this.soundCache.get(id);
    if (audio) {
      try {
        audio.currentTime = 0;
        audio.volume = this._sfxVolume * this._masterVolume;
        await audio.play();
      } catch (error) {
        console.warn(`Failed to play sound effect ${id}:`, error);
      }
    }
  }

  // Alias for playSoundEffect to match interface
  async playSFX(id: SoundEffectId, volume?: number): Promise<void> {
    if (this._muted) return;

    const audio = this.soundCache.get(id);
    if (audio) {
      try {
        audio.currentTime = 0;
        audio.volume = (volume ?? this._sfxVolume) * this._masterVolume;
        await audio.play();
      } catch (error) {
        console.warn(`Failed to play sound effect ${id}:`, error);
      }
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

    return new Promise((resolve) => {
      const startVolume = this.currentMusic!.volume;
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
}

export default AudioManager;
