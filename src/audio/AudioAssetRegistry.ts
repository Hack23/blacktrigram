/**
 * Audio Asset Registry for Black Trigram Korean Martial Arts
 * Manages all audio assets including Korean martial arts specific sounds
 */

import type {
  AudioAssetRegistry as IAudioAssetRegistry,
  SoundEffect,
  MusicTrack,
  VoiceLine,
  CombatAudioMap,
  SoundEffectId,
  MusicTrackId,
  VoiceLineId,
} from "../types/audio";

// Fix: Use class implementation instead of interface merging
export class AudioAssetRegistry {
  private sfxMap = new Map<SoundEffectId, SoundEffect>();
  private musicMap = new Map<MusicTrackId, MusicTrack>();
  private voiceMap = new Map<VoiceLineId, VoiceLine>();

  // Fix: Implement required combat property with proper stances
  public combat: CombatAudioMap = {
    attacks: {},
    impacts: {},
    stances: {
      geon: "stance_geon_sfx",
      tae: "stance_tae_sfx",
      li: "stance_li_sfx",
      jin: "stance_jin_sfx",
      son: "stance_son_sfx",
      gam: "stance_gam_sfx",
      gan: "stance_gan_sfx",
      gon: "stance_gon_sfx",
    },
    environments: {},
    ui: {},
  };

  public sfx: Record<SoundEffectId, SoundEffect> = {};
  public music: Record<MusicTrackId, MusicTrack> = {};
  public voice: Record<VoiceLineId, VoiceLine> = {};

  constructor() {
    this.initializeDefaultAssets();
  }

  private initializeDefaultAssets(): void {
    // Initialize with placeholder Korean martial arts sound effects
    this.registerSFX("hit_light", {
      id: "hit_light",
      type: "sound",
      name: "Light Hit", // Fix: Use simple string instead of KoreanText object
      category: "sfx", // Fix: Use string literal instead of enum
      url: "placeholder://hit_light",
      formats: ["audio/wav", "audio/mp3"],
      loaded: false,
      volume: 1.0,
      variations: [],
    });

    this.registerMusic("combat_theme", {
      id: "combat_theme",
      type: "music",
      name: "Combat Theme", // Fix: Use simple string instead of KoreanText object
      title: { korean: "전투 테마", english: "Combat Theme" },
      category: "music", // Fix: Use string literal instead of enum
      url: "placeholder://combat_theme",
      formats: ["audio/wav", "audio/mp3"],
      loaded: false,
      volume: 0.7,
      loop: true,
    });

    // Add intro_theme music with both mp3 and webm for intro screen
    this.registerMusic("intro_theme", {
      id: "intro_theme",
      type: "music",
      name: "Black Trigram Theme",
      title: { korean: "흑괘 테마", english: "Black Trigram Theme" },
      category: "music",
      url: "/assets/audio/music/intro_theme.mp3",
      formats: ["audio/mp3", "audio/webm"],
      loaded: false,
      volume: 0.7,
      loop: true,
      variations: [
        "/assets/audio/music/intro_theme.mp3",
        "/assets/audio/music/intro_theme.webm",
      ],
      bpm: 90,
      fadeInTime: 3000,
      fadeOutTime: 3000,
    });
  }

  public registerSFX(id: SoundEffectId, effect: SoundEffect): void {
    this.sfxMap.set(id, effect);
    this.sfx[id] = effect;
  }

  public registerMusic(id: MusicTrackId, track: MusicTrack): void {
    this.musicMap.set(id, track);
    this.music[id] = track;
  }

  public registerVoice(id: VoiceLineId, voice: VoiceLine): void {
    this.voiceMap.set(id, voice);
    this.voice[id] = voice;
  }

  public getSFX(id: SoundEffectId): SoundEffect | undefined {
    return this.sfxMap.get(id);
  }

  public getMusic(id: MusicTrackId): MusicTrack | undefined {
    return this.musicMap.get(id);
  }

  public getVoice(id: VoiceLineId): VoiceLine | undefined {
    return this.voiceMap.get(id);
  }

  public getAll(): IAudioAssetRegistry {
    return {
      sfx: this.sfx,
      music: this.music,
      voice: this.voice,
      combat: this.combat,
    };
  }

  // Korean martial arts sound effects registry
  private readonly soundEffects: Map<SoundEffectId, SoundEffect> = new Map([
    [
      "attack_light",
      {
        id: "attack_light",
        name: "Light Attack", // Fix: Use string instead of KoreanText object
        type: "sound",
        url: "/assets/audio/sfx/attack_light.mp3",
        formats: ["audio/mp3", "audio/wav"],
        loaded: false,
        volume: 0.8,
        category: "sfx", // Fix: Use string literal instead of enum
        pitch: 1.0,
        variations: ["attack_light_1.mp3", "attack_light_2.mp3"],
      },
    ],
    [
      "stance_change",
      {
        id: "stance_change",
        name: "Stance Change", // Fix: Use string instead of KoreanText object
        type: "sound",
        url: "/assets/audio/sfx/stance_change.mp3",
        formats: ["audio/mp3", "audio/wav"],
        loaded: false,
        volume: 0.6,
        category: "sfx", // Fix: Use string literal instead of enum
        pitch: 1.2,
      },
    ],
    [
      "vital_hit_critical",
      {
        id: "vital_hit_critical",
        name: "Critical Vital Point Hit", // Fix: Use string instead of KoreanText object
        type: "sound",
        url: "/assets/audio/sfx/vital_hit_critical.mp3",
        formats: ["audio/mp3", "audio/wav"],
        loaded: false,
        volume: 0.9,
        category: "sfx", // Fix: Use string literal instead of enum
        pitch: 0.8,
      },
    ],
    [
      "hit_light",
      {
        id: "hit_light",
        name: "Light Hit", // Fix: Use simple string instead of KoreanText object
        type: "sound",
        url: "/assets/audio/sfx/hit_light.mp3",
        formats: ["audio/mp3", "audio/wav"],
        loaded: false,
        volume: 0.7,
        category: "sfx", // Fix: Use string literal instead of enum
        pitch: 1.0,
        variations: [
          "/assets/audio/sfx/hit_light_1.mp3",
          "/assets/audio/sfx/hit_light_2.mp3",
        ],
      },
    ],
  ] as unknown as ReadonlyArray<[SoundEffectId, SoundEffect]>);

  // Korean martial arts music tracks
  private readonly musicTracks: Map<MusicTrackId, MusicTrack> = new Map([
    [
      "intro_theme",
      {
        id: "intro_theme",
        name: "Black Trigram Theme", // Fix: Use simple string instead of KoreanText object
        type: "music",
        url: "/assets/audio/music/intro_theme.mp3",
        formats: ["audio/mp3", "audio/webm"],
        loaded: false,
        volume: 0.7,
        loop: true,
        category: "music", // Fix: Use string literal instead of enum
        variations: [
          "/assets/audio/music/intro_theme.mp3",
          "/assets/audio/music/intro_theme.webm",
        ],
        bpm: 90,
        fadeInTime: 3000,
        fadeOutTime: 3000,
      },
    ],
    [
      "combat_theme",
      {
        id: "combat_theme",
        name: "Combat Music", // Fix: Use string instead of KoreanText object
        type: "music",
        url: "/assets/audio/music/combat_theme.mp3",
        formats: ["audio/mp3", "audio/webm"],
        loaded: false,
        title: { korean: "전투 음악", english: "Combat Music" },
        volume: 0.8,
        loop: true,
        category: "music", // Fix: Use string literal instead of enum
        bpm: 140,
        fadeInTime: 1000,
        fadeOutTime: 2000,
      },
    ],
    [
      "dojang_ambience",
      {
        id: "dojang_ambience",
        name: "Dojang Atmosphere", // Fix: Use string instead of KoreanText object
        type: "music",
        url: "/assets/audio/music/dojang_ambience.mp3",
        formats: ["audio/mp3", "audio/wav"],
        loaded: false,
        title: { korean: "도장 분위기", english: "Dojang Atmosphere" },
        volume: 0.4,
        loop: true,
        category: "music", // Fix: Use string literal instead of enum
        bpm: 60,
        fadeInTime: 3000,
        fadeOutTime: 3000,
      },
    ],
  ] as unknown as ReadonlyArray<[MusicTrackId, MusicTrack]>);

  // Fix: Remove unused destructured variables
  public loadSoundEffects(): void {
    // Process sound effects without unused variables
    this.soundEffects.forEach((effect) => {
      console.log(`Loading sound effect: ${effect.id}`);
    });
  }

  public loadMusicTracks(): void {
    // Process music tracks without unused variables
    this.musicTracks.forEach((track) => {
      console.log(`Loading music track: ${track.id}`);
    });
  }

  // Fix: Remove Map.find usage - Maps don't have find method
  public findSoundEffectByName(name: string): SoundEffect | undefined {
    for (const [_, effect] of this.soundEffects) {
      if (effect.name === name) {
        return effect;
      }
    }
    return undefined;
  }

  public findMusicTrackByName(name: string): MusicTrack | undefined {
    for (const [_, track] of this.musicTracks) {
      if (track.name === name) {
        return track;
      }
    }
    return undefined;
  }

  // Fix: Add getSoundEffect method
  public getSoundEffect(id: SoundEffectId): SoundEffect | undefined {
    return this.soundEffects.get(id);
  }

  // Fix: Add getMusicTrack method
  public getMusicTrack(id: MusicTrackId): MusicTrack | undefined {
    return this.musicTracks.get(id);
  }

  // Fix: Remove unused lightHitEffect and use string for name
  public getPlaceholderEffect(): SoundEffect {
    return {
      id: "placeholder_hit",
      name: "Placeholder Hit", // Fix: Use string instead of KoreanText object
      type: "sound",
      url: "/placeholder/hit.mp3",
      formats: ["audio/mp3"],
      loaded: false,
      volume: 0.5,
      category: "sfx", // Fix: Use string literal instead of enum
      pitch: 1.0,
    };
  }

  // Add missing loadAssets method
  public async loadAssets(): Promise<void> {
    console.log("Loading audio assets...");
    // Implementation would preload audio files
  }
}

// Export singleton instance
export const audioAssetRegistry = new AudioAssetRegistry();

// Default export
export default audioAssetRegistry;
