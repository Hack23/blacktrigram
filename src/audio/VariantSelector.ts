/**
 * Audio Variant Selector for Korean martial arts context
 * Selects appropriate audio variants based on combat context and archetype
 */

import type { PlayerArchetype, TrigramStance } from "../types/enums";
import type { SoundEffectId, MusicTrackId, AudioAsset } from "../types/audio";
import { getSoundAsset, getMusicAsset } from "./AudioAssetRegistry";

export interface AudioVariantContext {
  readonly archetype?: PlayerArchetype;
  readonly stance?: TrigramStance;
  readonly intensity?: "light" | "medium" | "heavy" | "critical";
  readonly combatPhase?: "intro" | "combat" | "victory" | "defeat";
  readonly damageAmount?: number;
  readonly isVitalPoint?: boolean;
  readonly comboCount?: number;
}

export class VariantSelector {
  private static readonly ARCHETYPE_SOUND_PREFERENCES: Record<
    PlayerArchetype,
    {
      attackPrefix: string;
      voiceStyle: string;
      intensity: number;
    }
  > = {
    musa: {
      attackPrefix: "traditional",
      voiceStyle: "honorable",
      intensity: 1.0,
    },
    amsalja: { attackPrefix: "stealth", voiceStyle: "silent", intensity: 0.8 },
    hacker: { attackPrefix: "tech", voiceStyle: "digital", intensity: 0.9 },
    jeongbo_yowon: {
      attackPrefix: "tactical",
      voiceStyle: "precise",
      intensity: 0.85,
    },
    jojik_pokryeokbae: {
      attackPrefix: "brutal",
      voiceStyle: "aggressive",
      intensity: 1.2,
    },
  };

  private static readonly STANCE_AUDIO_MODIFIERS: Record<
    TrigramStance,
    {
      pitchModifier: number;
      reverb: number;
      element: string;
    }
  > = {
    geon: { pitchModifier: 1.1, reverb: 0.3, element: "thunder" },
    tae: { pitchModifier: 0.9, reverb: 0.5, element: "water" },
    li: { pitchModifier: 1.2, reverb: 0.2, element: "fire" },
    jin: { pitchModifier: 1.3, reverb: 0.1, element: "lightning" },
    son: { pitchModifier: 0.95, reverb: 0.4, element: "wind" },
    gam: { pitchModifier: 0.8, reverb: 0.6, element: "deep_water" },
    gan: { pitchModifier: 0.7, reverb: 0.8, element: "mountain" },
    gon: { pitchModifier: 0.85, reverb: 0.7, element: "earth" },
  };

  /**
   * Select the best sound variant for the given context
   */
  static selectSoundVariant(
    baseId: SoundEffectId,
    context: AudioVariantContext = {}
  ): AudioAsset | undefined {
    const baseAsset = getSoundAsset(baseId);
    if (!baseAsset) {
      console.warn(`Base sound asset not found: ${baseId}`);
      return undefined;
    }

    // For now, return the base asset
    // In a full implementation, this would select from variants based on context
    return this.applyContextualModifications(baseAsset, context);
  }

  /**
   * Select the best music variant for the given context
   */
  static selectMusicVariant(
    baseId: MusicTrackId,
    context: AudioVariantContext = {}
  ): AudioAsset | undefined {
    const baseAsset = getMusicAsset(baseId);
    if (!baseAsset) {
      console.warn(`Base music asset not found: ${baseId}`);
      return undefined;
    }

    return this.applyContextualModifications(baseAsset, context);
  }

  /**
   * Get attack sound based on damage and archetype
   */
  static getAttackSound(context: AudioVariantContext): SoundEffectId {
    const { damageAmount = 0, intensity } = context;

    // Determine intensity from damage if not provided
    let soundIntensity = intensity;
    if (!soundIntensity) {
      if (damageAmount > 50) soundIntensity = "critical";
      else if (damageAmount > 30) soundIntensity = "heavy";
      else if (damageAmount > 15) soundIntensity = "medium";
      else soundIntensity = "light";
    }

    // Map intensity to sound ID
    switch (soundIntensity) {
      case "critical":
        return context.isVitalPoint ? "critical_hit" : "attack_critical";
      case "heavy":
        return "attack_heavy";
      case "medium":
        return "attack_medium";
      case "light":
      default:
        return "attack_light";
    }
  }

  /**
   * Get hit sound based on damage and vital point status
   */
  static getHitSound(context: AudioVariantContext): SoundEffectId {
    const { damageAmount = 0, isVitalPoint = false, intensity } = context;

    if (isVitalPoint) {
      return "critical_hit";
    }

    // Determine intensity from damage if not provided
    let soundIntensity = intensity;
    if (!soundIntensity) {
      if (damageAmount > 50) soundIntensity = "critical";
      else if (damageAmount > 30) soundIntensity = "heavy";
      else if (damageAmount > 15) soundIntensity = "medium";
      else soundIntensity = "light";
    }

    switch (soundIntensity) {
      case "critical":
        return "hit_critical";
      case "heavy":
        return "hit_heavy";
      case "medium":
        return "hit_medium";
      case "light":
      default:
        return "hit_light";
    }
  }

  /**
   * Get appropriate music for combat phase and archetype
   */
  static getCombatMusic(context: AudioVariantContext): MusicTrackId {
    const { combatPhase = "combat" } = context;

    switch (combatPhase) {
      case "intro":
        return "intro_theme";
      case "victory":
        return "victory_theme";
      case "defeat":
        return "ambient_dojang"; // Somber ambient for defeat
      case "combat":
      default:
        // Could vary by archetype in full implementation
        return "combat_theme";
    }
  }

  /**
   * Apply contextual modifications to audio asset
   */
  private static applyContextualModifications(
    asset: AudioAsset,
    context: AudioVariantContext
  ): AudioAsset {
    let modifiedAsset = { ...asset };

    // Apply archetype-based modifications
    if (context.archetype) {
      const archetypePrefs =
        this.ARCHETYPE_SOUND_PREFERENCES[context.archetype];
      modifiedAsset = {
        ...modifiedAsset,
        volume: Math.min(1.0, asset.volume * archetypePrefs.intensity),
      };
    }

    // Apply stance-based modifications
    if (context.stance) {
      const stanceModifier = this.STANCE_AUDIO_MODIFIERS[context.stance];
      // In a full implementation, this would modify pitch, reverb, etc.
      // For now, just adjust volume slightly based on stance
      const stanceVolumeModifier =
        0.9 + (stanceModifier.pitchModifier - 1.0) * 0.1;
      modifiedAsset = {
        ...modifiedAsset,
        volume: Math.min(1.0, modifiedAsset.volume * stanceVolumeModifier),
      };
    }

    return modifiedAsset;
  }

  /**
   * Get combo sound based on combo count
   */
  static getComboSound(comboCount: number): SoundEffectId {
    if (comboCount >= 5) {
      return "combo_finish";
    } else if (comboCount >= 2) {
      return "combo_buildup";
    } else {
      return "perfect_strike";
    }
  }

  /**
   * Check if a specific variant exists for the given context
   */
  static hasVariant(
    baseId: SoundEffectId | MusicTrackId,
    _context: AudioVariantContext
  ): boolean {
    // In a full implementation, this would check for specific variant files
    // For placeholder implementation, always return true for base assets
    const isSfx =
      typeof baseId === "string" && getSoundAsset(baseId as SoundEffectId);
    const isMusic =
      typeof baseId === "string" && getMusicAsset(baseId as MusicTrackId);

    return !!(isSfx || isMusic);
  }
}

// Export convenience functions
export function selectCombatSound(context: AudioVariantContext): SoundEffectId {
  return VariantSelector.getAttackSound(context);
}

export function selectHitSound(context: AudioVariantContext): SoundEffectId {
  return VariantSelector.getHitSound(context);
}

export function selectCombatMusic(context: AudioVariantContext): MusicTrackId {
  return VariantSelector.getCombatMusic(context);
}
