// Extend Window interface for webkit audio context
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

import { Howl, Howler } from "howler";

// Audio configuration constants
const AUDIO_CONFIG = {
  MASTER_VOLUME: 0.8,
  SFX_VOLUME: 0.7,
  AMBIENT_VOLUME: 0.4,
  MUSIC_VOLUME: 0.6,
  FADE_DURATION: 1000,
  MAX_CONCURRENT_SOUNDS: 8,
} as const;

// Korean martial arts sound effect mappings
export type SoundEffectId =
  | "menu_hover"
  | "menu_select"
  | "menu_back"
  | "match_start"
  | "match_end"
  | "victory"
  | "defeat"
  | "countdown"
  | "stance_change"
  | "attack_light"
  | "attack_medium"
  | "attack_heavy"
  | "attack_critical"
  | "block_success"
  | "block_break"
  | "hit_light"
  | "hit_medium"
  | "hit_heavy"
  | "hit_critical"
  | "footstep"
  | "dodge"
  | "ki_charge"
  | "ki_release"
  | "combo_buildup"
  | "combo_finish"
  | "health_low"
  | "stamina_depleted"
  | "perfect_strike"
  | "dojang_ambience"
  | "wind_effect"
  | "energy_pulse";

export type MusicTrackId =
  | "intro_theme"
  | "menu_theme"
  | "combat_theme"
  | "victory_theme"
  | "training_theme"
  | "meditation_theme";

// Sound effect definitions with Korean martial arts context
const SOUND_EFFECTS: Record<
  SoundEffectId,
  {
    src: string[];
    volume: number;
    sprite?: Record<string, [number, number]>;
    loop?: boolean;
    preload?: boolean;
    description: string;
  }
> = {
  // Menu sounds with traditional Korean instruments inspiration
  menu_hover: {
    src: [
      "./assets/audio/sfx/menu_hover.webm",
      "./assets/audio/sfx/menu_hover.mp3",
    ],
    volume: 0.3,
    preload: true,
    description: "Subtle wood block tap - traditional Korean percussion",
  },
  menu_select: {
    src: [
      "./assets/audio/sfx/menu_select.webm",
      "./assets/audio/sfx/menu_select.mp3",
    ],
    volume: 0.5,
    preload: true,
    description: "Bamboo flute note - decisive selection",
  },
  menu_back: {
    src: [
      "./assets/audio/sfx/menu_back.webm",
      "./assets/audio/sfx/menu_back.mp3",
    ],
    volume: 0.4,
    preload: true,
    description: "Soft gong resonance - returning to previous state",
  },

  // Match flow sounds
  match_start: {
    src: [
      "./assets/audio/sfx/match_start.webm",
      "./assets/audio/sfx/match_start.mp3",
    ],
    volume: 0.8,
    preload: true,
    description: "Temple bell strike - beginning of combat",
  },
  match_end: {
    src: [
      "./assets/audio/sfx/match_end.webm",
      "./assets/audio/sfx/match_end.mp3",
    ],
    volume: 0.7,
    preload: true,
    description: "Ceremonial gong - end of combat",
  },
  victory: {
    src: ["./assets/audio/sfx/victory.webm", "./assets/audio/sfx/victory.mp3"],
    volume: 0.9,
    preload: true,
    description: "Triumphant Korean traditional music chord",
  },
  defeat: {
    src: ["./assets/audio/sfx/defeat.webm", "./assets/audio/sfx/defeat.mp3"],
    volume: 0.6,
    preload: true,
    description: "Somber traditional melody - learning from defeat",
  },
  countdown: {
    src: [
      "./assets/audio/sfx/countdown.webm",
      "./assets/audio/sfx/countdown.mp3",
    ],
    volume: 0.6,
    preload: true,
    description: "Rhythmic drum beat - building tension",
  },

  // Combat stance and movement sounds
  stance_change: {
    src: [
      "./assets/audio/sfx/stance_change.webm",
      "./assets/audio/sfx/stance_change.mp3",
    ],
    volume: 0.4,
    preload: true,
    description: "Fabric rustle - changing trigram stance",
  },
  footstep: {
    src: [
      "./assets/audio/sfx/footstep.webm",
      "./assets/audio/sfx/footstep.mp3",
    ],
    volume: 0.3,
    preload: true,
    description: "Soft dojang floor contact",
  },
  dodge: {
    src: ["./assets/audio/sfx/dodge.webm", "./assets/audio/sfx/dodge.mp3"],
    volume: 0.4,
    preload: true,
    description: "Quick air displacement - evasive movement",
  },

  // Attack sounds - varying intensity based on trigram philosophy
  attack_light: {
    src: [
      "./assets/audio/sfx/attack_light.webm",
      "./assets/audio/sfx/attack_light.mp3",
    ],
    volume: 0.5,
    preload: true,
    description: "Swift air cut - precise light strike",
  },
  attack_medium: {
    src: [
      "./assets/audio/sfx/attack_medium.webm",
      "./assets/audio/sfx/attack_medium.mp3",
    ],
    volume: 0.6,
    preload: true,
    description: "Focused energy release - medium power",
  },
  attack_heavy: {
    src: [
      "./assets/audio/sfx/attack_heavy.webm",
      "./assets/audio/sfx/attack_heavy.mp3",
    ],
    volume: 0.8,
    preload: true,
    description: "Thunderous impact - maximum force",
  },
  attack_critical: {
    src: [
      "./assets/audio/sfx/attack_critical.webm",
      "./assets/audio/sfx/attack_critical.mp3",
    ],
    volume: 0.9,
    preload: true,
    description: "Perfect vital point strike - devastating precision",
  },

  // Blocking and defensive sounds
  block_success: {
    src: [
      "./assets/audio/sfx/block_success.webm",
      "./assets/audio/sfx/block_success.mp3",
    ],
    volume: 0.6,
    preload: true,
    description: "Solid defensive contact - successful block",
  },
  block_break: {
    src: [
      "./assets/audio/sfx/block_break.webm",
      "./assets/audio/sfx/block_break.mp3",
    ],
    volume: 0.7,
    preload: true,
    description: "Defense shattered - guard broken",
  },

  // Hit impact sounds
  hit_light: {
    src: [
      "./assets/audio/sfx/hit_light.webm",
      "./assets/audio/sfx/hit_light.mp3",
    ],
    volume: 0.5,
    preload: true,
    description: "Light contact - glancing blow",
  },
  hit_medium: {
    src: [
      "./assets/audio/sfx/hit_medium.webm",
      "./assets/audio/sfx/hit_medium.mp3",
    ],
    volume: 0.6,
    preload: true,
    description: "Solid impact - effective strike",
  },
  hit_heavy: {
    src: [
      "./assets/audio/sfx/hit_heavy.webm",
      "./assets/audio/sfx/hit_heavy.mp3",
    ],
    volume: 0.8,
    preload: true,
    description: "Devastating blow - severe damage",
  },
  hit_critical: {
    src: [
      "./assets/audio/sfx/hit_critical.webm",
      "./assets/audio/sfx/hit_critical.mp3",
    ],
    volume: 0.9,
    preload: true,
    description: "Vital point struck - critical damage",
  },

  // Energy and ki effects
  ki_charge: {
    src: [
      "./assets/audio/sfx/ki_charge.webm",
      "./assets/audio/sfx/ki_charge.mp3",
    ],
    volume: 0.5,
    loop: true,
    preload: true,
    description: "Building internal energy - ki accumulation",
  },
  ki_release: {
    src: [
      "./assets/audio/sfx/ki_release.webm",
      "./assets/audio/sfx/ki_release.mp3",
    ],
    volume: 0.7,
    preload: true,
    description: "Explosive energy release - ki burst",
  },
  energy_pulse: {
    src: [
      "./assets/audio/sfx/energy_pulse.webm",
      "./assets/audio/sfx/energy_pulse.mp3",
    ],
    volume: 0.4,
    preload: true,
    description: "Rhythmic energy wave - trigram power",
  },

  // Combo and special effects
  combo_buildup: {
    src: [
      "./assets/audio/sfx/combo_buildup.webm",
      "./assets/audio/sfx/combo_buildup.mp3",
    ],
    volume: 0.6,
    preload: true,
    description: "Rising tension - combo building",
  },
  combo_finish: {
    src: [
      "./assets/audio/sfx/combo_finish.webm",
      "./assets/audio/sfx/combo_finish.mp3",
    ],
    volume: 0.8,
    preload: true,
    description: "Explosive finale - combo completion",
  },
  perfect_strike: {
    src: [
      "./assets/audio/sfx/perfect_strike.webm",
      "./assets/audio/sfx/perfect_strike.mp3",
    ],
    volume: 0.9,
    preload: true,
    description: "Flawless technique - perfect execution",
  },

  // Status and warning sounds
  health_low: {
    src: [
      "./assets/audio/sfx/health_low.webm",
      "./assets/audio/sfx/health_low.mp3",
    ],
    volume: 0.5,
    loop: true,
    preload: true,
    description: "Heartbeat intensifying - low health warning",
  },
  stamina_depleted: {
    src: [
      "./assets/audio/sfx/stamina_depleted.webm",
      "./assets/audio/sfx/stamina_depleted.mp3",
    ],
    volume: 0.4,
    preload: true,
    description: "Heavy breathing - exhaustion",
  },

  // Environmental and ambient effects
  dojang_ambience: {
    src: [
      "./assets/audio/sfx/dojang_ambience.webm",
      "./assets/audio/sfx/dojang_ambience.mp3",
    ],
    volume: 0.3,
    loop: true,
    preload: true,
    description: "Peaceful dojang atmosphere - meditation space",
  },
  wind_effect: {
    src: [
      "./assets/audio/sfx/wind_effect.webm",
      "./assets/audio/sfx/wind_effect.mp3",
    ],
    volume: 0.2,
    loop: true,
    preload: true,
    description: "Gentle wind through dojang - natural harmony",
  },
};

// Music track definitions
const MUSIC_TRACKS: Record<
  MusicTrackId,
  {
    src: string[];
    volume: number;
    loop: boolean;
    preload: boolean;
    description: string;
  }
> = {
  intro_theme: {
    src: [
      "./assets/audio/music/intro_theme.webm",
      "./assets/audio/music/intro_theme.mp3",
    ],
    volume: 0.6,
    loop: true,
    preload: true,
    description:
      "Contemplative Korean traditional music - setting the philosophical mood",
  },
  menu_theme: {
    src: [
      "./assets/audio/music/menu_theme.webm",
      "./assets/audio/music/menu_theme.mp3",
    ],
    volume: 0.5,
    loop: true,
    preload: true,
    description: "Traditional Korean melody - menu ambiance",
  },
  combat_theme: {
    src: [
      "./assets/audio/music/combat_theme.webm",
      "./assets/audio/music/combat_theme.mp3",
    ],
    volume: 0.5,
    loop: true,
    preload: true,
    description: "Intense rhythmic composition - driving combat energy",
  },
  victory_theme: {
    src: [
      "./assets/audio/music/victory_theme.webm",
      "./assets/audio/music/victory_theme.mp3",
    ],
    volume: 0.7,
    loop: false,
    preload: true,
    description: "Triumphant melody - celebrating martial mastery",
  },
  training_theme: {
    src: [
      "./assets/audio/music/training_theme.webm",
      "./assets/audio/music/training_theme.mp3",
    ],
    volume: 0.4,
    loop: true,
    preload: true,
    description: "Focused meditation music - disciplined practice",
  },
  meditation_theme: {
    src: [
      "./assets/audio/music/meditation_theme.webm",
      "./assets/audio/music/meditation_theme.mp3",
    ],
    volume: 0.3,
    loop: true,
    preload: true,
    description: "Deep contemplative sounds - inner harmony",
  },
};

// Audio context and state management
interface AudioState {
  readonly masterVolume: number;
  readonly sfxVolume: number;
  readonly musicVolume: number;
  readonly muted: boolean;
  readonly currentMusicTrack: MusicTrackId | null;
  readonly isInitialized: boolean;
}

class AudioManager {
  private static instance: AudioManager;
  private sounds: Map<SoundEffectId, Howl> = new Map();
  private music: Map<MusicTrackId, Howl> = new Map();
  private currentMusic: Howl | null = null;
  private useFallbackSounds: boolean = false;
  private state: AudioState = {
    masterVolume: AUDIO_CONFIG.MASTER_VOLUME,
    sfxVolume: AUDIO_CONFIG.SFX_VOLUME,
    musicVolume: AUDIO_CONFIG.MUSIC_VOLUME,
    muted: false,
    currentMusicTrack: null,
    isInitialized: false,
  };

  private constructor() {
    this.initializeAudioSystem();
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private async initializeAudioSystem(): Promise<void> {
    try {
      // Initialize Howler with optimal settings
      Howler.autoUnlock = true;
      Howler.html5PoolSize = AUDIO_CONFIG.MAX_CONCURRENT_SOUNDS;

      // Set initial volumes
      Howler.volume(this.state.masterVolume);

      // Initialize sound effects and music
      this.initializeSoundEffects();
      this.initializeMusicTracks();

      this.state = { ...this.state, isInitialized: true };
      console.log("🎵 AudioManager initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize AudioManager:", error);
      this.useFallbackSounds = true;
    }
  }

  private initializeSoundEffects(): void {
    Object.entries(SOUND_EFFECTS).forEach(([id, config]) => {
      const sound = new Howl({
        src: config.src,
        volume: config.volume * this.state.sfxVolume,
        loop: config.loop || false,
        preload: config.preload || false,
        sprite: config.sprite,
        onload: () =>
          console.log(`🎵 Loaded SFX: ${id} - ${config.description}`),
        onloaderror: (id, error) => {
          console.warn(
            `⚠️ Failed to load SFX ${id}, using fallback sounds:`,
            error
          );
          this.useFallbackSounds = true;
        },
      });

      this.sounds.set(id as SoundEffectId, sound);
    });
  }

  private initializeMusicTracks(): void {
    Object.entries(MUSIC_TRACKS).forEach(([id, config]) => {
      const music = new Howl({
        src: config.src,
        volume: config.volume * this.state.musicVolume,
        loop: config.loop,
        preload: config.preload,
        onload: () =>
          console.log(`🎶 Loaded Music: ${id} - ${config.description}`),
        onloaderror: (id, error) => {
          console.warn(`⚠️ Failed to load music ${id}:`, error);
        },
      });

      this.music.set(id as MusicTrackId, music);
    });
  }

  // Single playSFX implementation with fallback support
  public playSFX(
    id: SoundEffectId,
    options?: {
      volume?: number;
      rate?: number;
      delay?: number;
    }
  ): number | null {
    if (this.state.muted || !this.state.isInitialized) return null;

    // Use fallback sounds if original files failed to load
    if (this.useFallbackSounds) {
      this.playFallbackSound(id);
      return null;
    }

    const sound = this.sounds.get(id);
    if (!sound) {
      console.warn(`🔇 Sound effect not found: ${id}, using fallback`);
      this.playFallbackSound(id);
      return null;
    }

    try {
      const soundId = sound.play();

      if (options?.volume !== undefined) {
        sound.volume(options.volume * this.state.sfxVolume, soundId);
      }

      if (options?.rate !== undefined) {
        sound.rate(options.rate, soundId);
      }

      if (options?.delay !== undefined) {
        setTimeout(() => {
          if (sound.playing(soundId)) {
            sound.seek(0, soundId);
          }
        }, options.delay);
      }

      return soundId;
    } catch (error) {
      console.error(`❌ Failed to play sound ${id}:`, error);
      this.playFallbackSound(id);
      return null;
    }
  }

  private async playFallbackSound(id: SoundEffectId): Promise<void> {
    if (this.state.muted) return;

    try {
      // Dynamic import to avoid unused import error
      const { defaultSoundGenerator } = await import("./DefaultSoundGenerator");

      switch (id) {
        case "menu_hover":
        case "menu_select":
        case "menu_back":
          await defaultSoundGenerator.playMenuSound();
          break;
        case "match_start":
          await defaultSoundGenerator.playMatchStartSound();
          break;
        case "victory":
          await defaultSoundGenerator.playVictorySound();
          break;
        case "stance_change":
          await defaultSoundGenerator.playStanceChangeSound();
          break;
        case "attack_light":
        case "attack_medium":
        case "attack_heavy":
        case "attack_critical":
          const damage =
            id === "attack_critical"
              ? 40
              : id === "attack_heavy"
              ? 30
              : id === "attack_medium"
              ? 20
              : 10;
          await defaultSoundGenerator.playAttackSound(damage);
          break;
        case "hit_light":
        case "hit_medium":
        case "hit_heavy":
        case "hit_critical":
          const hitDamage =
            id === "hit_critical"
              ? 40
              : id === "hit_heavy"
              ? 30
              : id === "hit_medium"
              ? 20
              : 10;
          const isVital = id === "hit_critical";
          await defaultSoundGenerator.playHitSound(hitDamage, isVital);
          break;
        case "combo_buildup":
        case "combo_finish":
          const comboLevel = id === "combo_finish" ? 5 : 3;
          await defaultSoundGenerator.playComboSound(comboLevel);
          break;
        default:
          // Generic fallback
          await defaultSoundGenerator.playMenuSound();
      }
    } catch (error) {
      console.warn(`Failed to play fallback sound for ${id}:`, error);
    }
  }

  // Specialized sound methods for game events
  public playAttackSound(damage: number): void {
    if (this.useFallbackSounds) {
      // Dynamic import for fallback
      import("./DefaultSoundGenerator")
        .then(({ defaultSoundGenerator }) => {
          defaultSoundGenerator.playAttackSound(damage);
        })
        .catch((error) => {
          console.warn("Failed to load fallback sound generator:", error);
        });
      return;
    }

    if (damage >= 35) {
      this.playSFX("attack_critical");
    } else if (damage >= 25) {
      this.playSFX("attack_heavy");
    } else if (damage >= 15) {
      this.playSFX("attack_medium");
    } else {
      this.playSFX("attack_light");
    }
  }

  public playHitSound(damage: number, isVitalPoint: boolean = false): void {
    if (this.useFallbackSounds) {
      // Dynamic import for fallback
      import("./DefaultSoundGenerator")
        .then(({ defaultSoundGenerator }) => {
          defaultSoundGenerator.playHitSound(damage, isVitalPoint);
        })
        .catch((error) => {
          console.warn("Failed to load fallback sound generator:", error);
        });
      return;
    }

    if (isVitalPoint) {
      this.playSFX("hit_critical");
      this.playSFX("perfect_strike", { delay: 100 });
    } else if (damage >= 30) {
      this.playSFX("hit_heavy");
    } else if (damage >= 20) {
      this.playSFX("hit_medium");
    } else {
      this.playSFX("hit_light");
    }
  }

  public playStanceChangeSound(): void {
    if (this.useFallbackSounds) {
      // Dynamic import for fallback
      import("./DefaultSoundGenerator")
        .then(({ defaultSoundGenerator }) => {
          defaultSoundGenerator.playStanceChangeSound();
        })
        .catch((error) => {
          console.warn("Failed to load fallback sound generator:", error);
        });
      return;
    }

    this.playSFX("stance_change");
    // Add slight delay for energy pulse based on trigram
    setTimeout(() => {
      this.playSFX("energy_pulse", { volume: 0.3 });
    }, 150);
  }

  public playComboSound(comboCount: number): void {
    if (this.useFallbackSounds) {
      // Dynamic import for fallback
      import("./DefaultSoundGenerator")
        .then(({ defaultSoundGenerator }) => {
          defaultSoundGenerator.playComboSound(comboCount);
        })
        .catch((error) => {
          console.warn("Failed to load fallback sound generator:", error);
        });
      return;
    }

    if (comboCount >= 5) {
      this.playSFX("combo_finish");
    } else if (comboCount >= 2) {
      this.playSFX("combo_buildup", { rate: 1 + comboCount * 0.1 });
    }
  }

  // Music management
  public playMusic(id: MusicTrackId, fadeIn: boolean = true): void {
    if (this.state.muted) return;

    // Stop current music if playing
    if (this.currentMusic) {
      this.stopMusic(fadeIn);
    }

    const music = this.music.get(id);
    if (!music) {
      console.warn(`🔇 Music track not found: ${id}`);
      return;
    }

    try {
      if (fadeIn) {
        music.volume(0);
        const musicId = music.play();
        music.fade(
          0,
          this.state.musicVolume,
          AUDIO_CONFIG.FADE_DURATION,
          musicId
        );
      } else {
        music.volume(this.state.musicVolume);
        music.play();
      }

      this.currentMusic = music;
      this.state = { ...this.state, currentMusicTrack: id };
    } catch (error) {
      console.error(`❌ Failed to play music ${id}:`, error);
    }
  }

  public stopMusic(fadeOut: boolean = true): void {
    if (!this.currentMusic) return;

    try {
      if (fadeOut) {
        this.currentMusic.fade(
          this.state.musicVolume,
          0,
          AUDIO_CONFIG.FADE_DURATION
        );
        setTimeout(() => {
          this.currentMusic?.stop();
          this.currentMusic = null;
          this.state = { ...this.state, currentMusicTrack: null };
        }, AUDIO_CONFIG.FADE_DURATION);
      } else {
        this.currentMusic.stop();
        this.currentMusic = null;
        this.state = { ...this.state, currentMusicTrack: null };
      }
    } catch (error) {
      console.error("❌ Failed to stop music:", error);
    }
  }

  // Volume and state management
  public setMasterVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.state = { ...this.state, masterVolume: clampedVolume };
    Howler.volume(clampedVolume);
  }

  public setSFXVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.state = { ...this.state, sfxVolume: clampedVolume };

    // Update all loaded sound effects
    this.sounds.forEach((sound) => {
      sound.volume(clampedVolume);
    });
  }

  public setMusicVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.state = { ...this.state, musicVolume: clampedVolume };

    // Update current music if playing
    if (this.currentMusic) {
      this.currentMusic.volume(clampedVolume);
    }
  }

  public toggleMute(): void {
    this.state = { ...this.state, muted: !this.state.muted };
    Howler.mute(this.state.muted);
  }

  public getState(): AudioState {
    return { ...this.state };
  }

  // Cleanup
  public cleanup(): void {
    this.stopMusic(false);
    this.sounds.forEach((sound) => sound.unload());
    this.music.forEach((music) => music.unload());
    this.sounds.clear();
    this.music.clear();
  }
}

// Export singleton instance
export const audioManager = AudioManager.getInstance();

// React hook for audio management
export function useAudio(): AudioManager {
  return audioManager;
}
