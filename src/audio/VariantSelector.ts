/**
 * Audio Variant Selector for Korean martial arts context
 * Selects appropriate audio variants based on combat context and archetype
 */

import type { PlayerArchetype, TrigramStance } from "../types/enums";
import type {
  SoundEffect,
  MusicTrack,
  MusicTrackId,
  SoundEffectId,
} from "../types/audio";

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
  /**
   * Select the best sound variant for the given context
   */
  static selectSoundVariant(
    baseSound: SoundEffect,
    archetype: PlayerArchetype,
    stance?: TrigramStance
  ): SoundEffect {
    if (!baseSound.variations || baseSound.variations.length === 0) {
      return baseSound;
    }

    // Select variant based on archetype
    let variantIndex = 0;
    switch (archetype) {
      case "musa": // Traditional warrior - use original
        variantIndex = 0;
        break;
      case "amsalja": // Assassin - use quieter variants
        variantIndex = Math.min(1, baseSound.variations.length - 1);
        break;
      case "hacker": // Cyber warrior - use electronic variants
        variantIndex = Math.min(2, baseSound.variations.length - 1);
        break;
      case "jeongbo_yowon": // Intelligence - use subtle variants
        variantIndex = Math.min(3, baseSound.variations.length - 1);
        break;
      case "jojik_pokryeokbae": // Crime - use aggressive variants
        variantIndex = Math.min(4, baseSound.variations.length - 1);
        break;
      default:
        variantIndex = 0;
    }

    // Modify based on stance if provided
    if (stance) {
      const stanceModifier = this.getStanceModifier(stance);
      variantIndex =
        (variantIndex + stanceModifier) % baseSound.variations.length;
    }

    const selectedVariant = baseSound.variations[variantIndex];

    return {
      ...baseSound,
      url: selectedVariant,
      id: `${baseSound.id}_${archetype}_${stance || "default"}`,
    };
  }

  /**
   * Select the best music variant for the given context
   */
  static selectMusicVariant(
    baseMusic: MusicTrack,
    archetype: PlayerArchetype,
    intensity: number = 0.5
  ): MusicTrack {
    if (!baseMusic.variations || baseMusic.variations.length === 0) {
      return baseMusic;
    }

    // Select based on archetype and intensity
    const archetypeWeight = this.getArchetypeWeight(archetype);
    const intensityWeight = Math.floor(intensity * 3); // 0-2 range

    const variantIndex =
      (archetypeWeight + intensityWeight) % baseMusic.variations.length;
    const selectedVariant = baseMusic.variations[variantIndex];

    return {
      ...baseMusic,
      url: selectedVariant,
      id: `${baseMusic.id}_${archetype}_intensity${intensityWeight}`,
      volume: (baseMusic.volume ?? 0.7) * (0.8 + intensity * 0.4), // Fix: Handle undefined volume
    };
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
   * Get stance modifier for audio selection
   */
  private static getStanceModifier(stance: TrigramStance): number {
    const stanceMap: Record<TrigramStance, number> = {
      geon: 0, // Heaven - original
      tae: 1, // Lake - fluid
      li: 2, // Fire - intense
      jin: 3, // Thunder - explosive
      son: 4, // Wind - swift
      gam: 5, // Water - flowing
      gan: 6, // Mountain - stable
      gon: 7, // Earth - grounded
    };
    return stanceMap[stance] || 0;
  }

  /**
   * Get archetype weight for variant selection
   */
  private static getArchetypeWeight(archetype: PlayerArchetype): number {
    const archetypeMap: Record<PlayerArchetype, number> = {
      musa: 0, // Traditional
      amsalja: 1, // Stealth
      hacker: 2, // Tech
      jeongbo_yowon: 3, // Intelligence
      jojik_pokryeokbae: 4, // Aggressive
    };
    return archetypeMap[archetype] || 0;
  }

  /**
   * Select context-appropriate audio variant
   */
  public static selectByContext(
    baseAssetId: string,
    context: {
      archetype: PlayerArchetype;
      stance?: TrigramStance;
      intensity?: number;
    }
  ): { soundId?: string; musicId?: string } {
    // Return string IDs instead of typed IDs
    return {
      soundId: `${baseAssetId}_${context.archetype}`,
      musicId: `${baseAssetId}_${context.archetype}`,
    };
  }

  /**
   * Select the best music variant for the given context
   */
  public static selectMusicVariantForArchetype(
    baseMusic: MusicTrack,
    archetype: PlayerArchetype,
    intensity: number = 1.0
  ): string {
    // Fix: Check for variations property existence
    if (
      !("variations" in baseMusic) ||
      !baseMusic.variations ||
      baseMusic.variations.length === 0
    ) {
      console.warn(`No variations available for music track: ${baseMusic.id}`);
      return baseMusic.url;
    }

    const archetypeWeight = this.getArchetypeWeight(archetype);
    const intensityWeight = Math.floor(intensity * 10);

    const variantIndex =
      (archetypeWeight + intensityWeight) % baseMusic.variations.length;
    const selectedVariant = baseMusic.variations[variantIndex];

    console.log(
      `Selected variant for ${archetype} at intensity ${intensity}: ${selectedVariant}`
    );

    return selectedVariant;
  }

  /**
   * Get random variant from available options
   */
  public static selectRandomVariant(
    baseAsset: MusicTrack | SoundEffect
  ): string {
    // Fix: Type guard to check for variations
    const hasVariations = (
      asset: MusicTrack | SoundEffect
    ): asset is SoundEffect => {
      return (
        "variations" in asset &&
        Array.isArray(asset.variations) &&
        asset.variations.length > 0
      );
    };

    if (!hasVariations(baseAsset)) {
      return baseAsset.url;
    }

    // Fix: Now TypeScript knows baseAsset.variations exists and is not empty
    const randomIndex = Math.floor(
      Math.random() * baseAsset.variations!.length
    );
    const selectedVariant = baseAsset.variations![randomIndex];

    console.log(`Random variant selected: ${selectedVariant}`);
    return selectedVariant;
  }
}

export default VariantSelector;

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
