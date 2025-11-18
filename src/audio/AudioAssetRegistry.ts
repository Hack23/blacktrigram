/**
 * Audio Asset Registry for Black Trigram Korean Martial Arts
 * Manages all audio assets including Korean martial arts specific sounds
 */

import type { AudioAsset } from "./types";
import {
  AudioCategory,
  CombatAudioMap,
  MusicTrack,
  MusicTrackId,
  SoundEffect,
  SoundEffectId,
  VoiceLine,
  VoiceLineId,
} from "./types";

export type LoadPriority = "critical" | "high" | "normal" | "low";

// Estimated average size per audio asset in MB (based on typical compressed audio file sizes)
const ESTIMATED_ASSET_SIZE_MB = 0.5;

export interface IAudioAssetRegistry {
  readonly music: Record<string, MusicTrack>;
  readonly sfx: Record<string, SoundEffect>;
  readonly voice: Record<string, VoiceLine>;
  readonly combat: CombatAudioMap;
}

export interface EnhancedAudioAsset {
  readonly id: string;
  readonly type: "sound" | "music" | "voice";
  readonly url: string;
  readonly formats: readonly string[];
  readonly loaded: boolean;
  volume?: number;
  readonly loop?: boolean;
  category?: AudioCategory;
  readonly metadata?: {
    readonly duration: number;
    readonly bitrate?: number;
    readonly channels?: number;
    readonly sampleRate?: number;
  };
  readonly preloadPriority?: LoadPriority;
  readonly streaming?: boolean;
  readonly compressionOptions?: {
    readonly format: string;
    readonly quality: number;
  };
}

// Enhanced audio registry with proper types
export interface EnhancedAudioAssetRegistry extends AudioAssetRegistry {
  readonly enhanced?: Record<string, EnhancedAudioAsset>;
}

// Asset group definition for batch loading
export interface AssetGroup {
  readonly id: string;
  readonly name: string;
  readonly priority: LoadPriority;
  readonly assets: readonly string[]; // Asset IDs
  readonly lazyLoad?: boolean;
}

// Manifest for efficient asset registration
export interface AudioAssetManifest {
  readonly version: string;
  readonly totalAssets: number;
  readonly totalSizeMB: number;
  readonly groups: readonly AssetGroup[];
  readonly assets: Record<string, EnhancedAudioAsset>;
}

// Fix: Use class implementation instead of interface merging
export class AudioAssetRegistry {
  private sfxMap = new Map<SoundEffectId, SoundEffect>();
  private musicMap = new Map<MusicTrackId, MusicTrack>();
  private voiceMap = new Map<VoiceLineId, VoiceLine>();
  private assetGroups: Map<string, AssetGroup> = new Map();

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
    this.initializeAssetGroups();
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

  /**
   * Initialize asset groups for batch loading
   */
  private initializeAssetGroups(): void {
    // Critical assets - load immediately on startup
    this.registerAssetGroup({
      id: "critical",
      name: "Critical UI Sounds",
      priority: "critical",
      assets: ["hit_light", "stance_change"],
      lazyLoad: false,
    });

    // High priority - load during intro screen
    this.registerAssetGroup({
      id: "intro_music",
      name: "Intro Screen Music",
      priority: "high",
      assets: ["intro_theme"],
      lazyLoad: false,
    });

    // Normal priority - load during gameplay preparation
    this.registerAssetGroup({
      id: "combat_sfx",
      name: "Combat Sound Effects",
      priority: "normal",
      assets: ["attack_light", "vital_hit_critical"],
      lazyLoad: false,
    });

    // Low priority - lazy load when needed
    this.registerAssetGroup({
      id: "ambient_music",
      name: "Ambient Background Music",
      priority: "low",
      assets: ["dojang_ambience"],
      lazyLoad: true,
    });
  }

  /**
   * Register an asset group
   */
  public registerAssetGroup(group: AssetGroup): void {
    this.assetGroups.set(group.id, group);
  }

  /**
   * Get asset group by ID
   */
  public getAssetGroup(groupId: string): AssetGroup | undefined {
    return this.assetGroups.get(groupId);
  }

  /**
   * Get all asset groups
   */
  public getAllAssetGroups(): readonly AssetGroup[] {
    return Array.from(this.assetGroups.values());
  }

  /**
   * Get asset groups by priority
   */
  public getAssetGroupsByPriority(priority: LoadPriority): readonly AssetGroup[] {
    return Array.from(this.assetGroups.values()).filter(
      (group) => group.priority === priority
    );
  }

  /**
   * Get all assets in a group
   */
  public getAssetsInGroup(groupId: string): readonly AudioAsset[] {
    const group = this.assetGroups.get(groupId);
    if (!group) return [];

    const assets: AudioAsset[] = [];
    for (const assetId of group.assets) {
      const sfx = this.getSFX(assetId);
      if (sfx) {
        assets.push(sfx);
        continue;
      }

      const music = this.getMusic(assetId);
      if (music) {
        assets.push(music);
        continue;
      }

      const voice = this.getVoice(assetId);
      if (voice) {
        assets.push(voice);
      }
    }

    return assets;
  }

  /**
   * Create a manifest for efficient asset registration
   */
  public createManifest(): AudioAssetManifest {
    const allAssets: Record<string, EnhancedAudioAsset> = {};

    // Add SFX assets
    this.sfxMap.forEach((sfx, id) => {
      allAssets[id] = {
        ...sfx,
        preloadPriority: "normal",
      } as EnhancedAudioAsset;
    });

    // Add music assets
    this.musicMap.forEach((music, id) => {
      allAssets[id] = {
        ...music,
        preloadPriority: "high",
      } as EnhancedAudioAsset;
    });

    // Add voice assets
    this.voiceMap.forEach((voice, id) => {
      allAssets[id] = {
        ...voice,
        preloadPriority: "normal",
      } as EnhancedAudioAsset;
    });

    const totalAssets = Object.keys(allAssets).length;
    const estimatedSizeMB = totalAssets * ESTIMATED_ASSET_SIZE_MB;

    return {
      version: "1.0.0",
      totalAssets,
      totalSizeMB: estimatedSizeMB,
      groups: this.getAllAssetGroups(),
      assets: allAssets,
    };
  }
}

// Export singleton instance
export const audioAssetRegistry = new AudioAssetRegistry();

// Default export
export default audioAssetRegistry;
