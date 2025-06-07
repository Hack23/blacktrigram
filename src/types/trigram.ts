// Korean martial arts trigram system types

import type { TrigramStance, PlayerArchetype, EffectType } from "./enums";
import type { KoreanText } from "./korean-text";
import type { KoreanTechnique } from "./index"; // Assuming StatusEffect is in index or effects

// Export TrigramStance for external modules
export type { TrigramStance } from "./enums";

// Trigram transition cost - FIXED: Add missing timeMilliseconds
export interface TrigramTransitionCost {
  readonly ki: number;
  readonly stamina: number;
  readonly timeMilliseconds: number; // Added missing time component
}

// Enhanced transition metrics with all required properties
export interface TransitionMetrics {
  readonly cost: TrigramTransitionCost;
  readonly effectiveness: number;
  readonly risk: number;
  readonly stamina: number; // Added missing property
  readonly timeMilliseconds: number; // Added missing property
}

// Enhanced transition path interface
export interface TransitionPath {
  readonly path: readonly TrigramStance[];
  readonly totalCost: TrigramTransitionCost;
  readonly overallEffectiveness: number;
  readonly cumulativeRisk: number;
  readonly name: string; // Added
  readonly description: {
    // Added
    readonly korean: string;
    readonly english: string;
  };
}

// Trigram transition rule - FIXED: Add missing properties
export interface TrigramTransitionRule {
  readonly from: TrigramStance;
  readonly to: TrigramStance;
  readonly cost: TrigramTransitionCost;
  readonly effectiveness: number; // Added
  readonly conditions?: ReadonlyArray<{
    type: "player_stat" | "archetype" | "active_effect";
    stat?: "health" | "ki" | "stamina";
    archetype?: PlayerArchetype;
    effectType?: EffectType; // Use EffectType from enums
    threshold?: number;
    value?: boolean | string;
  }>;
  readonly description: KoreanText; // Added
}

// Ki flow factors with all required properties
export interface KiFlowFactors {
  readonly playerLevelModifier: number;
  readonly stanceAffinity: number;
  readonly distance: number; // Added missing property
  readonly elementalHarmony: number; // Added missing property
}

// Trigram data structure
export interface TrigramData {
  readonly id: TrigramStance;
  readonly name: KoreanText;
  readonly symbol: string;
  readonly element: KoreanText; // Changed from string to KoreanText
  readonly direction?: string; // Made optional
  readonly philosophy: KoreanText; // Added philosophy property
  readonly combatRole: KoreanText; // Added combat role property
  readonly technique: KoreanTechnique; // Associated signature technique
  readonly strengths?: readonly string[]; // Added strengths property
  readonly weaknesses?: readonly string[]; // Add missing weaknesses property
  readonly offensiveBonus?: number; // Added
  readonly defensiveBonus?: number; // Added
  readonly kiFlowModifier?: number; // How this stance affects Ki recovery or usage
  readonly staminaModifier?: number; // How this stance affects Stamina recovery or usage
  readonly theme?: {
    // Added theme for visual styling
    readonly primary: number;
    readonly secondary: number;
    readonly active: number;
    readonly hover: number;
    readonly glow: number;
  };
}

// Effectiveness matrix for stance combinations
export type TrigramEffectivenessMatrix = {
  readonly [K in TrigramStance]: {
    readonly [J in TrigramStance]: number;
  };
};

// Stance system interface
export interface TrigramSystemInterface {
  getCurrentStance(): TrigramStance;
  setStance(stance: TrigramStance): Promise<boolean>; // Returns true if successful
  getAvailableTechniques(stance: TrigramStance): readonly KoreanTechnique[]; // Changed parameter
  getTrigramData(stance: TrigramStance): TrigramData;
  calculateTransition(
    from: TrigramStance,
    to: TrigramStance,
    playerKi: number, // Added
    playerStamina: number // Added
  ): TrigramTransitionCost | null; // null if not possible
  getEffectiveness(
    attackerStance: TrigramStance,
    defenderStance: TrigramStance
  ): number;
}

// Archetype stance affinity
export interface ArchetypeStanceAffinity {
  readonly archetype: PlayerArchetype;
  readonly affinities: Record<TrigramStance, number>;
}

// Add missing StanceTransition interface
export interface StanceTransition {
  readonly from: TrigramStance;
  readonly to: TrigramStance;
  readonly cost: TrigramTransitionCost;
  readonly duration: number; // Added
  readonly difficulty: number; // Added
}
