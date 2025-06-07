// Extend Window interface for webkit audio context
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

import { Howl, Howler } from "howler";
import type {
  IAudioManager,
  AudioAsset,
  AudioAssetRegistry,
  AudioState,
  SoundEffectId,
  MusicTrackId,
  AudioPlaybackOptions,
} from "../types/audio";
import { AudioUtils } from "./AudioUtils";
import { createPlaceholderAudioAssets } from "./AudioAssetRegistry";

// Placeholder for a simple event emitter if not using a library
class SimpleEventEmitter {
  private listeners: Record<string, Array<(...args: any[]) => void>> = {};
  on(event: string, callback: (...args: any[]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  emit(event: string, ...args: any[]) {
    this.listeners[event]?.forEach((callback) => callback(...args));
  }
}

const DEFAULT_AUDIO_CONFIG = {
  MASTER_VOLUME: 0.7,
  SFX_VOLUME: 0.8,
  MUSIC_VOLUME: 0.5,
  AMBIENT_VOLUME: 0.6,
  FADE_DURATION: 1000, // Default fade duration in ms
  MAX_CONCURRENT_SOUNDS: 10, // Max simultaneous sounds
};

// Define DEFAULT_AUDIO_STATE based on AudioState interface and DEFAULT_AUDIO_CONFIG
const DEFAULT_AUDIO_STATE: AudioState = {
  masterVolume: DEFAULT_AUDIO_CONFIG.MASTER_VOLUME,
  sfxVolume: DEFAULT_AUDIO_CONFIG.SFX_VOLUME,
  musicVolume: DEFAULT_AUDIO_CONFIG.MUSIC_VOLUME,
  muted: false,
  currentMusicTrack: null,
  isInitialized: false,
  fallbackMode: false,
};

export class AudioManager implements IAudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  public isInitialized: boolean = false;
  private audioState: AudioState;
  private assetRegistry: AudioAssetRegistry;
  private activeSounds: Record<number, Howl> = {};
  private activeMusic: {
    id: MusicTrackId;
    howl: Howl;
    soundId: number;
  } | null = null;
  private config = DEFAULT_AUDIO_CONFIG;
  private eventEmitter = new SimpleEventEmitter();

  constructor(
    assetRegistry?: AudioAssetRegistry,
    initialAudioState?: Partial<AudioState>
  ) {
    // Use provided registry or create placeholder registry with all required assets
    this.assetRegistry = assetRegistry || createPlaceholderAudioAssets();
    this.audioState = {
      ...DEFAULT_AUDIO_STATE,
      ...(initialAudioState || {}),
      masterVolume:
        initialAudioState?.masterVolume ?? DEFAULT_AUDIO_CONFIG.MASTER_VOLUME,
      sfxVolume:
        initialAudioState?.sfxVolume ?? DEFAULT_AUDIO_CONFIG.SFX_VOLUME,
      musicVolume:
        initialAudioState?.musicVolume ?? DEFAULT_AUDIO_CONFIG.MUSIC_VOLUME,
    };
    // Initialize Howler global volume if Howler is used directly for some sounds
    if (typeof Howler !== "undefined") {
      Howler.volume(this.audioState.masterVolume);
    }
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();
      this.musicGain = this.audioContext.createGain();

      this.masterGain.connect(this.audioContext.destination);
      this.sfxGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);

      this.setMasterVolume(this.audioState.masterVolume);
      this.setSFXVolume(this.audioState.sfxVolume);
      this.setMusicVolume(this.audioState.musicVolume);
      this.setMuted(this.audioState.muted);

      // Resume context if suspended (e.g., due to browser autoplay policies)
      if (this.audioContext.state === "suspended") {
        console.log(
          "AudioContext is initially suspended. Waiting for user interaction."
        );
        // Try to resume on first user interaction
        const resumeContext = async () => {
          if (this.audioContext && this.audioContext.state === "suspended") {
            await this.audioContext.resume();
            console.log("AudioContext resumed on user interaction.");
          }
          document.removeEventListener("click", resumeContext);
          document.removeEventListener("keydown", resumeContext);
        };
        document.addEventListener("click", resumeContext, { once: true });
        document.addEventListener("keydown", resumeContext, { once: true });
      }

      // Preload assets marked for preload
      await this.preloadAssets();

      this.isInitialized = true;
      this.audioState.isInitialized = true;
      console.log("Audio Manager initialized successfully.");
      this.eventEmitter.emit("initialized");
    } catch (error) {
      console.error("Error initializing Audio Manager:", error);
      this.audioState.fallbackMode = true; // Enter fallback mode if Web Audio API fails
      this.isInitialized = true; // Still mark as initialized to prevent re-attempts
      this.audioState.isInitialized = true;
      this.eventEmitter.emit("error", error);
    }
  }

  private async preloadAssets(): Promise<void> {
    const sfxAssets = Object.values(this.assetRegistry.sfx).filter(Boolean);
    const musicAssets = Object.values(this.assetRegistry.music).filter(Boolean);
    const assetsToLoad = [...sfxAssets, ...musicAssets].filter(
      (asset) => asset.preload
    );

    for (const asset of assetsToLoad) {
      await this.loadAudioAsset(asset);
    }
  }

  public async loadAudioAsset(asset: AudioAsset): Promise<void> {
    return new Promise((resolve, reject) => {
      new Howl({
        src: AudioUtils.getPreferredFormat(asset.formats, asset.url),
        volume: asset.volume,
        loop: asset.loop ?? false,
        preload: true,
        onload: () => {
          console.log(`Loaded audio asset: ${asset.id}`);
          resolve();
        },
        onloaderror: (_id, err) => {
          console.error(`Error loading audio asset ${asset.id}:`, err);
          reject(err);
        },
      });
    });
  }

  public playSFX(
    id: SoundEffectId,
    options?: AudioPlaybackOptions
  ): number | null {
    if (!this.isInitialized && !this.audioState.fallbackMode) {
      console.warn("AudioManager not initialized. Cannot play SFX:", id);
      return null;
    }

    const sfxAsset = this.assetRegistry.sfx[id];
    if (!sfxAsset) {
      console.warn(`SFX asset not found: ${id}`);
      return null;
    }

    const finalVolume =
      (options?.volume ?? sfxAsset.volume) *
      this.audioState.sfxVolume *
      this.audioState.masterVolume;
    if (this.audioState.muted) return null;

    let soundToPlay: Howl | undefined = new Howl({
      src: AudioUtils.getPreferredFormat(sfxAsset.formats, sfxAsset.url),
      volume: finalVolume,
      loop: options?.loop ?? sfxAsset.loop ?? false,
      rate: options?.rate ?? 1.0,
    });

    const soundId = soundToPlay.play();

    if (soundToPlay && soundId !== undefined) {
      if (options?.rate) soundToPlay.rate(options.rate, soundId);

      this.activeSounds[soundId] = soundToPlay;

      soundToPlay.once(
        "end",
        () => {
          if (this.activeSounds[soundId]) {
            delete this.activeSounds[soundId];
          }
          this.eventEmitter.emit("sfxEnded", id, soundId);
        },
        soundId
      );
      this.eventEmitter.emit("sfxPlayed", id, soundId);
      return soundId;
    }
    return null;
  }

  public playMusic(
    id: MusicTrackId,
    options?: AudioPlaybackOptions
  ): number | null {
    if (!this.isInitialized && !this.audioState.fallbackMode) {
      console.warn("AudioManager not initialized. Cannot play music:", id);
      return null;
    }
    if (this.activeMusic && this.activeMusic.id === id) {
      return this.activeMusic.soundId;
    }

    this.stopMusic();

    const musicAsset = this.assetRegistry.music[id];
    if (!musicAsset) {
      console.warn(`Music asset not found: ${id}`);
      return null;
    }

    const finalVolume =
      (options?.volume ?? musicAsset.volume) *
      this.audioState.musicVolume *
      this.audioState.masterVolume;
    if (this.audioState.muted) return null;

    let soundToPlay: Howl | undefined = new Howl({
      src: AudioUtils.getPreferredFormat(musicAsset.formats, musicAsset.url),
      volume: finalVolume,
      loop: options?.loop ?? musicAsset.loop ?? true,
      rate: options?.rate ?? 1.0,
      html5: true,
      onload: () => {
        this.eventEmitter.emit("musicLoaded", id);
      },
      onplayerror: (soundId, error) => {
        console.error(
          `Error playing music ${id} (soundId: ${soundId}):`,
          error
        );
        this.eventEmitter.emit("musicPlayError", id, error);
        if (this.activeMusic && this.activeMusic.soundId === soundId) {
          this.activeMusic = null;
        }
      },
      onfade: (soundId) => {
        const currentVolume = soundToPlay?.volume(soundId) as
          | number
          | undefined;
        if (
          this.activeMusic &&
          this.activeMusic.soundId === soundId &&
          currentVolume === 0
        ) {
          soundToPlay?.stop(soundId);
          this.activeMusic = null;
        }
      },
    });

    const soundId = soundToPlay.play();

    if (soundToPlay && soundId !== undefined) {
      if (options?.fadeIn && options.fadeIn > 0) {
        soundToPlay.volume(0, soundId);
        soundToPlay.fade(0, finalVolume, options.fadeIn, soundId);
      } else {
        soundToPlay.volume(finalVolume, soundId);
      }

      this.activeMusic = { id, howl: soundToPlay, soundId };
      this.audioState.currentMusicTrack = id;
      this.eventEmitter.emit("musicPlayed", id, soundId);
      return soundId;
    }
    return null;
  }

  public stopMusic(id?: MusicTrackId, fadeOutDuration?: number): void {
    const soundInstanceToStop = id
      ? this.activeMusic?.id === id
        ? this.activeMusic
        : null
      : this.activeMusic;

    if (
      soundInstanceToStop &&
      soundInstanceToStop.howl &&
      soundInstanceToStop.soundId !== undefined
    ) {
      const duration = fadeOutDuration ?? this.config.FADE_DURATION;
      const currentVolume = soundInstanceToStop.howl.volume(
        soundInstanceToStop.soundId
      ) as number;
      if (duration > 0) {
        soundInstanceToStop.howl.fade(
          currentVolume,
          0,
          duration,
          soundInstanceToStop.soundId
        );
        setTimeout(() => {
          if (
            this.activeMusic &&
            this.activeMusic.soundId === soundInstanceToStop.soundId
          ) {
            soundInstanceToStop.howl.stop(soundInstanceToStop.soundId);
            this.activeMusic = null;
            this.audioState.currentMusicTrack = null;
            this.eventEmitter.emit("musicStopped", soundInstanceToStop.id);
          }
        }, duration + 50);
      } else {
        soundInstanceToStop.howl.stop(soundInstanceToStop.soundId);
        this.activeMusic = null;
        this.audioState.currentMusicTrack = null;
        this.eventEmitter.emit("musicStopped", soundInstanceToStop.id);
      }
    } else if (!id && this.activeMusic) {
      this.stopMusic(this.activeMusic.id, fadeOutDuration);
    }
  }

  public stopAllMusic(fadeOutDuration?: number): void {
    if (this.activeMusic) {
      this.stopMusic(this.activeMusic.id, fadeOutDuration);
    }
  }

  public setMasterVolume(volume: number): void {
    this.audioState.masterVolume = AudioUtils.clampVolume(volume);
    Howler.volume(this.audioState.masterVolume);
    this.eventEmitter.emit("masterVolumeChanged", this.audioState.masterVolume);
  }

  public setSFXVolume(volume: number): void {
    this.audioState.sfxVolume = AudioUtils.clampVolume(volume);
    this.eventEmitter.emit("sfxVolumeChanged", this.audioState.sfxVolume);
  }

  public setMusicVolume(volume: number): void {
    this.audioState.musicVolume = AudioUtils.clampVolume(volume);
    if (
      this.activeMusic &&
      this.activeMusic.howl &&
      this.activeMusic.soundId !== undefined
    ) {
      const musicAsset = this.assetRegistry.music[this.activeMusic.id];
      if (musicAsset) {
        const newVol =
          musicAsset.volume *
          this.audioState.musicVolume *
          this.audioState.masterVolume;
        this.activeMusic.howl.volume(newVol, this.activeMusic.soundId);
      }
    }
    this.eventEmitter.emit("musicVolumeChanged", this.audioState.musicVolume);
  }

  public setMuted(muted: boolean): void {
    this.audioState.muted = muted;
    Howler.mute(muted);
    this.eventEmitter.emit("muted", muted);
  }

  public getState(): AudioState {
    return { ...this.audioState };
  }

  // Korean martial arts specific methods
  public playAttackSound(damage: number): void {
    if (damage > 50) this.playSFX("attack_heavy");
    else if (damage > 20) this.playSFX("attack_medium");
    else this.playSFX("attack_light");
  }

  public playHitSound(damage: number, isVitalPoint?: boolean): void {
    if (isVitalPoint) this.playSFX("critical_hit");
    else if (damage > 50) this.playSFX("hit_heavy");
    else if (damage > 20) this.playSFX("hit_medium");
    else this.playSFX("hit_light");
  }

  public playTechniqueSound(koreanName: string): void {
    console.log(`Playing sound for technique: ${koreanName}`);
    this.playSFX("technique_execute");
  }

  public playStanceChangeSound(): void {
    this.playSFX("stance_change");
  }

  public playBlockSound(): void {
    this.playSFX("block_success");
  }

  public stopAllSounds(): void {
    Howler.stop();
    this.activeSounds = {};
    if (this.activeMusic) {
      this.activeMusic = null;
    }
    this.audioState.currentMusicTrack = null;
    this.eventEmitter.emit("allSoundsStopped");
  }

  public isMusicPlaying(id?: MusicTrackId): boolean {
    if (id) {
      return (
        this.activeMusic?.id === id &&
        (this.activeMusic?.howl?.playing(this.activeMusic.soundId) ?? false)
      );
    }
    return (
      this.activeMusic !== null &&
      (this.activeMusic?.howl?.playing(this.activeMusic.soundId) ?? false)
    );
  }
}
