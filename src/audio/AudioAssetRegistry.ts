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
    this.initializeCombatAudioAssets();
    this.initializeAssetGroups();
  }

  private initializeDefaultAssets(): void {
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

  /**
   * Initialize comprehensive combat audio assets
   * Registers attack sounds, hit reactions, blocks, dodges, and stance changes
   */
  private initializeCombatAudioAssets(): void {
    // Combat Music Tracks
    this.registerMusic("combat_theme", {
      id: "combat_theme",
      type: "music",
      name: "Combat Theme",
      title: { korean: "전투 테마", english: "Combat Theme" },
      category: "music",
      url: "/assets/audio/music/combat_theme.webm",
      formats: ["audio/webm", "audio/mp3"],
      loaded: false,
      volume: 0.6,
      loop: true,
      variations: [
        "/assets/audio/music/combat_theme.webm",
        "/assets/audio/music/combat_theme.mp3",
      ],
      bpm: 140,
      fadeInTime: 2000,
      fadeOutTime: 2000,
    });

    // Archetype-Specific Music Themes
    const archetypeThemes = [
      { id: "musa_warrior_theme", name: "Musa Warrior Theme", korean: "무사 테마", file: "musa_warrior" },
      { id: "amsalja_shadow_theme", name: "Amsalja Shadow Theme", korean: "암살자 테마", file: "amsalja_shadow" },
      { id: "hacker_cyber_theme", name: "Hacker Cyber Theme", korean: "해커 테마", file: "hacker_cyber" },
      { id: "jeongbo_intel_theme", name: "Jeongbo Intel Theme", korean: "정보요원 테마", file: "jeongbo_intel" },
      { id: "jojik_street_theme", name: "Jojik Street Theme", korean: "조직폭력배 테마", file: "jojik_street" },
    ];

    archetypeThemes.forEach(theme => {
      this.registerMusic(theme.id, {
        id: theme.id,
        type: "music",
        name: theme.name,
        title: { korean: theme.korean, english: theme.name },
        category: "music",
        url: `/assets/audio/music/archetype_themes/${theme.file}.mp3`,
        formats: ["audio/mp3"],
        loaded: false,
        volume: 0.6,
        loop: true,
        bpm: 130,
        fadeInTime: 2000,
        fadeOutTime: 2000,
      });
    });

    // Attack Sounds - Light Punches (8 variations)
    for (let i = 1; i <= 8; i++) {
      this.registerSFX(`attack_punch_light_${i}`, {
        id: `attack_punch_light_${i}`,
        type: "sound",
        name: `Light Punch ${i}`,
        category: "sfx",
        url: `/assets/audio/sfx/combat/attack_punch_light_${i}.webm`,
        formats: ["audio/webm", "audio/mp3"],
        loaded: false,
        volume: 0.6,
      });
    }

    // Attack Sounds - Medium Punches (4 variations)
    for (let i = 1; i <= 4; i++) {
      this.registerSFX(`attack_punch_medium_${i}`, {
        id: `attack_punch_medium_${i}`,
        type: "sound",
        name: `Medium Punch ${i}`,
        category: "sfx",
        url: `/assets/audio/sfx/combat/attack_punch_medium_${i}.webm`,
        formats: ["audio/webm", "audio/mp3"],
        loaded: false,
        volume: 0.7,
      });
    }

    // Attack Sounds - Generic Light/Medium/Heavy
    this.registerSFX("attack_light", {
      id: "attack_light",
      type: "sound",
      name: "Light Attack",
      category: "sfx",
      url: "/assets/audio/sfx/combat/attack_light.webm",
      formats: ["audio/webm", "audio/mp3"],
      loaded: false,
      volume: 0.6,
      variations: [
        "/assets/audio/sfx/combat/attack_light.webm",
        "/assets/audio/sfx/combat/attack_light_3.webm",
        "/assets/audio/sfx/combat/attack_light_4.webm",
      ],
    });

    this.registerSFX("attack_medium", {
      id: "attack_medium",
      type: "sound",
      name: "Medium Attack",
      category: "sfx",
      url: "/assets/audio/sfx/combat/attack_medium.webm",
      formats: ["audio/webm", "audio/mp3"],
      loaded: false,
      volume: 0.7,
      variations: [
        "/assets/audio/sfx/combat/attack_medium.webm",
        "/assets/audio/sfx/combat/attack_medium_1.webm",
        "/assets/audio/sfx/combat/attack_medium_3.webm",
      ],
    });

    this.registerSFX("attack_heavy", {
      id: "attack_heavy",
      type: "sound",
      name: "Heavy Attack",
      category: "sfx",
      url: "/assets/audio/sfx/combat/attack_heavy.webm",
      formats: ["audio/webm", "audio/mp3"],
      loaded: false,
      volume: 0.8,
    });

    // Attack Sounds - Critical (4 variations)
    for (let i = 1; i <= 4; i++) {
      this.registerSFX(`attack_critical_${i}`, {
        id: `attack_critical_${i}`,
        type: "sound",
        name: `Critical Attack ${i}`,
        category: "sfx",
        url: `/assets/audio/sfx/combat/attack_critical_${i}.webm`,
        formats: ["audio/webm", "audio/mp3"],
        loaded: false,
        volume: 0.9,
      });
    }

    // Attack Sounds - Special Geon Technique (4 variations)
    for (let i = 1; i <= 4; i++) {
      this.registerSFX(`attack_special_geon_${i}`, {
        id: `attack_special_geon_${i}`,
        type: "sound",
        name: `Geon Special ${i}`,
        category: "sfx",
        url: `/assets/audio/sfx/combat/attack_special_geon_${i}.webm`,
        formats: ["audio/webm", "audio/mp3"],
        loaded: false,
        volume: 0.8,
      });
    }

    // Hit Reaction Sounds - Light (4 variations)
    for (let i = 1; i <= 4; i++) {
      this.registerSFX(`hit_light_${i}`, {
        id: `hit_light_${i}`,
        type: "sound",
        name: `Light Hit ${i}`,
        category: "sfx",
        url: `/assets/audio/sfx/hits/hit_light_${i}.webm`,
        formats: ["audio/webm", "audio/mp3"],
        loaded: false,
        volume: 0.5,
      });
    }

    // Hit Reaction Sounds - Medium (4 variations)
    for (let i = 1; i <= 4; i++) {
      this.registerSFX(`hit_medium_${i}`, {
        id: `hit_medium_${i}`,
        type: "sound",
        name: `Medium Hit ${i}`,
        category: "sfx",
        url: `/assets/audio/sfx/hits/hit_medium_${i}.webm`,
        formats: ["audio/webm", "audio/mp3"],
        loaded: false,
        volume: 0.6,
      });
    }

    // Hit Reaction Sounds - Heavy (4 variations)
    for (let i = 1; i <= 4; i++) {
      this.registerSFX(`hit_heavy_${i}`, {
        id: `hit_heavy_${i}`,
        type: "sound",
        name: `Heavy Hit ${i}`,
        category: "sfx",
        url: `/assets/audio/sfx/hits/hit_heavy_${i}.webm`,
        formats: ["audio/webm", "audio/mp3"],
        loaded: false,
        volume: 0.7,
      });
    }

    // Hit Reaction Sounds - Critical (4 variations)
    for (let i = 1; i <= 4; i++) {
      this.registerSFX(`hit_critical_${i}`, {
        id: `hit_critical_${i}`,
        type: "sound",
        name: `Critical Hit ${i}`,
        category: "sfx",
        url: `/assets/audio/sfx/hits/hit_critical_${i}.webm`,
        formats: ["audio/webm", "audio/mp3"],
        loaded: false,
        volume: 0.9,
      });
    }

    // Block Sounds - Success (4 variations)
    for (let i = 1; i <= 4; i++) {
      this.registerSFX(`block_success_${i}`, {
        id: `block_success_${i}`,
        type: "sound",
        name: `Block Success ${i}`,
        category: "sfx",
        url: `/assets/audio/sfx/blocks/block_success_${i}.webm`,
        formats: ["audio/webm", "audio/mp3"],
        loaded: false,
        volume: 0.6,
      });
    }

    // Block Sounds - Break (4 variations)
    for (let i = 1; i <= 4; i++) {
      this.registerSFX(`block_break_${i}`, {
        id: `block_break_${i}`,
        type: "sound",
        name: `Block Break ${i}`,
        category: "sfx",
        url: `/assets/audio/sfx/blocks/block_break_${i}.webm`,
        formats: ["audio/webm", "audio/mp3"],
        loaded: false,
        volume: 0.8,
      });
    }

    // Dodge Sounds (8 variations)
    for (let i = 1; i <= 8; i++) {
      this.registerSFX(`dodge_${i}`, {
        id: `dodge_${i}`,
        type: "sound",
        name: `Dodge ${i}`,
        category: "sfx",
        url: `/assets/audio/sfx/movement/dodge_${i}.webm`,
        formats: ["audio/webm", "audio/mp3"],
        loaded: false,
        volume: 0.5,
      });
    }

    // Stance Change Sounds (4 variations)
    for (let i = 1; i <= 4; i++) {
      this.registerSFX(`stance_change_${i}`, {
        id: `stance_change_${i}`,
        type: "sound",
        name: `Stance Change ${i}`,
        category: "sfx",
        url: `/assets/audio/sfx/movement/stance_change_${i}.webm`,
        formats: ["audio/webm", "audio/mp3"],
        loaded: false,
        volume: 0.4,
      });
    }
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
      assets: [
        "hit_light_1",
        "hit_light_2",
        "attack_light",
        "stance_change_1",
        "stance_change_2",
      ],
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

    // Combat music - high priority for combat screen
    this.registerAssetGroup({
      id: "combat_music",
      name: "Combat Background Music",
      priority: "high",
      assets: [
        "combat_theme",
        "musa_warrior_theme",
        "amsalja_shadow_theme",
        "hacker_cyber_theme",
        "jeongbo_intel_theme",
        "jojik_street_theme",
      ],
      lazyLoad: false,
    });

    // Normal priority - combat SFX
    this.registerAssetGroup({
      id: "combat_attacks",
      name: "Combat Attack Sounds",
      priority: "normal",
      assets: [
        "attack_light",
        "attack_medium",
        "attack_heavy",
        "attack_punch_light_1",
        "attack_punch_light_2",
        "attack_punch_medium_1",
        "attack_critical_1",
        "attack_critical_2",
      ],
      lazyLoad: false,
    });

    this.registerAssetGroup({
      id: "combat_hits",
      name: "Combat Hit Reactions",
      priority: "normal",
      assets: [
        "hit_light_1",
        "hit_light_2",
        "hit_medium_1",
        "hit_medium_2",
        "hit_heavy_1",
        "hit_critical_1",
      ],
      lazyLoad: false,
    });

    this.registerAssetGroup({
      id: "combat_defense",
      name: "Combat Defense Sounds",
      priority: "normal",
      assets: [
        "block_success_1",
        "block_success_2",
        "block_break_1",
        "dodge_1",
        "dodge_2",
      ],
      lazyLoad: false,
    });

    this.registerAssetGroup({
      id: "combat_movement",
      name: "Combat Movement Sounds",
      priority: "normal",
      assets: [
        "stance_change_1",
        "stance_change_2",
        "stance_change_3",
        "dodge_3",
        "dodge_4",
      ],
      lazyLoad: false,
    });
  }

  /**
   * Register an asset group for batch loading
   * @param group - Asset group configuration with ID, name, priority, and asset IDs
   */
  public registerAssetGroup(group: AssetGroup): void {
    this.assetGroups.set(group.id, group);
  }

  /**
   * Get asset group by ID
   * @param groupId - ID of the asset group to retrieve
   * @returns The asset group or undefined if not found
   */
  public getAssetGroup(groupId: string): AssetGroup | undefined {
    return this.assetGroups.get(groupId);
  }

  /**
   * Get all registered asset groups
   * @returns Array of all asset groups
   */
  public getAllAssetGroups(): readonly AssetGroup[] {
    return Array.from(this.assetGroups.values());
  }

  /**
   * Get asset groups filtered by priority level
   * @param priority - Priority level to filter by (critical/high/normal/low)
   * @returns Array of asset groups matching the priority
   */
  public getAssetGroupsByPriority(priority: LoadPriority): readonly AssetGroup[] {
    return Array.from(this.assetGroups.values()).filter(
      (group) => group.priority === priority
    );
  }

  /**
   * Get all assets belonging to a specific group
   * @param groupId - ID of the asset group
   * @returns Array of audio assets in the group, or empty array if group not found
   */
  public getAssetsInGroup(groupId: string): readonly AudioAsset[] {
    const group = this.assetGroups.get(groupId);
    if (!group) return [];

    const assets: AudioAsset[] = [];
    for (const assetId of group.assets) {
      // Check all maps, take first match
      const asset = this.getSFX(assetId) ?? this.getMusic(assetId) ?? this.getVoice(assetId);
      if (asset) {
        assets.push(asset);
      }
    }

    return assets;
  }

  /**
   * Create a manifest for efficient asset registration
   * @returns Audio asset manifest with version, total assets, size estimates, groups, and all assets
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
