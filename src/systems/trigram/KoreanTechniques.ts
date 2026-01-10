import { PlayerArchetype } from "../../types";
import { TrigramStance } from "../../types/common";
import { PlayerState } from "../player";
import { PLAYER_ARCHETYPES_DATA } from "../types";
import { KoreanTechnique } from "../vitalpoint";
import {
  DARK_OPS_ARCHETYPE_BONUSES,
  DARK_OPS_TECHNIQUES,
  TRIGRAM_TECHNIQUES,
} from "./techniques/index";

/**
 * Korean martial arts techniques system
 */
export class KoreanTechniquesSystem {
  /**
   * Get available techniques for a trigram stance
   */
  static getAvailableTechniques(
    stance: TrigramStance
  ): readonly KoreanTechnique[] {
    return (TRIGRAM_TECHNIQUES[stance] as readonly KoreanTechnique[]) || [];
  }

  /**
   * Get Dark Ops techniques (암흑작전부대 기술)
   * Specialized techniques for 암살자 (Amsalja) archetype
   */
  static getDarkOpsTechniques(): readonly KoreanTechnique[] {
    return DARK_OPS_TECHNIQUES;
  }

  /**
   * Get all available techniques including Dark Ops
   */
  static getAllAvailableTechniques(
    stance: TrigramStance,
    archetype?: PlayerArchetype
  ): readonly KoreanTechnique[] {
    const stanceTechniques = this.getAvailableTechniques(stance);

    // Add Dark Ops techniques for 암살자 (Amsalja) archetype
    if (archetype === PlayerArchetype.AMSALJA) {
      const darkOpsTechniques = DARK_OPS_TECHNIQUES.filter(
        (tech) => tech.stance === stance
      );
      return [...stanceTechniques, ...darkOpsTechniques];
    }

    return stanceTechniques;
  }

  /**
   * Get primary technique for stance
   */
  static getPrimaryTechnique(stance: TrigramStance): KoreanTechnique | null {
    const techniques = this.getAvailableTechniques(stance);
    return techniques[0] ?? null;
  }

  /**
   * Check if player can execute technique
   */
  static canExecuteTechnique(
    player: PlayerState,
    technique: KoreanTechnique
  ): boolean {
    return (
      player.ki >= technique.kiCost &&
      player.stamina >= technique.staminaCost &&
      player.currentStance === technique.stance
    );
  }

  /**
   * Get technique effectiveness against target stance
   */
  static getTechniqueEffectiveness(
    attackerStance: TrigramStance,
    defenderStance: TrigramStance
  ): number {
    return (
      TECHNIQUE_EFFECTIVENESS_MATRIX[attackerStance]?.[defenderStance] ?? 1.0
    );
  }

  /**
   * Get all techniques
   */
  static getAllTechniques(): KoreanTechnique[] {
    // Fix: Convert readonly array to mutable array using spread operator
    const stanceTechniques = Object.values(TRIGRAM_TECHNIQUES).flat();
    const darkOpsTechniques = [...DARK_OPS_TECHNIQUES];
    return [...stanceTechniques, ...darkOpsTechniques] as KoreanTechnique[];
  }

  static getTechniquesByArchetype(
    archetype: PlayerArchetype
  ): readonly KoreanTechnique[] {
    const allTechniques = this.getAllTechniques();

    // Filter techniques based on archetype preferences
    const archetypeData = PLAYER_ARCHETYPES_DATA[archetype]; // Fix: Now properly imported
    const favoredStances = archetypeData.favoredStances || [];

    // Filter by favored stances (excludes Dark Ops techniques initially)
    const filteredTechniques = allTechniques.filter((technique) => {
      // Exclude Dark Ops from initial filtering
      if (technique.id.startsWith("darkops_")) {
        return false;
      }
      return favoredStances.includes(technique.stance);
    });

    // Add Dark Ops techniques for 암살자 (Amsalja) only
    if (archetype === PlayerArchetype.AMSALJA) {
      return [...filteredTechniques, ...DARK_OPS_TECHNIQUES];
    }

    return filteredTechniques;
  }

  static getTechniqueById(id: string): KoreanTechnique | undefined {
    const allTechniques = this.getAllTechniques();
    return allTechniques.find((technique) => technique.id === id);
  }

  /**
   * Check if technique is a Dark Ops technique
   */
  static isDarkOpsTechnique(techniqueId: string): boolean {
    return DARK_OPS_TECHNIQUES.some((tech) => tech.id === techniqueId);
  }

  /**
   * Get Dark Ops archetype effectiveness multiplier
   * Uses DARK_OPS_ARCHETYPE_BONUSES from techniques.ts
   */
  static getDarkOpsArchetypeBonus(archetype: PlayerArchetype): number {
    return DARK_OPS_ARCHETYPE_BONUSES[archetype] || 1.0;
  }

  /**
   * Get night operations bonus (simulated)
   * In a full game, this would use actual game time
   */
  static getNightOperationsBonus(): number {
    // Simulate night time for now (in real game, use game clock)
    // Night: 00:00-06:00, 18:00-23:59 = 1.25x
    // Day: 06:00-18:00 = 1.0x
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) return 1.25; // Night
    if (hour >= 18 && hour < 24) return 1.25; // Night
    if (hour >= 5 && hour < 7) return 1.15; // Twilight
    if (hour >= 17 && hour < 19) return 1.15; // Twilight
    return 1.0; // Day
  }
}

// Export functions for backwards compatibility
export function getTechniquesByStance(
  stance: TrigramStance
): KoreanTechnique[] {
  // Fix: Convert readonly array to mutable array
  return [
    ...((TRIGRAM_TECHNIQUES[stance] as unknown as KoreanTechnique[]) || []),
  ];
}

// Export TRIGRAM_TECHNIQUES for tests
export { DARK_OPS_TECHNIQUES, TRIGRAM_TECHNIQUES } from "./techniques/index";

// Export Dark Ops constants
export {
  DARK_OPS_ARCHETYPE_BONUSES,
  DARK_OPS_NIGHT_BONUS,
  DARK_OPS_SPECIAL_EFFECTS,
  DARK_OPS_UNITS,
} from "./techniques/index";

// Export technique effectiveness matrix
export const TECHNIQUE_EFFECTIVENESS_MATRIX: Record<
  TrigramStance,
  Partial<Record<TrigramStance, number>>
> = {
  [TrigramStance.GEON]: {
    [TrigramStance.GON]: 1.2,
    [TrigramStance.SON]: 0.8,
  },
  [TrigramStance.TAE]: {
    [TrigramStance.JIN]: 1.2,
    [TrigramStance.GAN]: 0.8,
  },
  [TrigramStance.LI]: {
    [TrigramStance.GAM]: 1.2,
    [TrigramStance.TAE]: 0.8,
  },
  [TrigramStance.JIN]: {
    [TrigramStance.SON]: 1.2,
    [TrigramStance.GEON]: 0.8,
  },
  [TrigramStance.SON]: {
    [TrigramStance.GON]: 1.2,
    [TrigramStance.LI]: 0.8,
  },
  [TrigramStance.GAM]: {
    [TrigramStance.LI]: 1.2,
    [TrigramStance.JIN]: 0.8,
  },
  [TrigramStance.GAN]: {
    [TrigramStance.TAE]: 1.2,
    [TrigramStance.GAM]: 0.8,
  },
  [TrigramStance.GON]: {
    [TrigramStance.GEON]: 1.2,
    [TrigramStance.SON]: 0.8,
  },
};
