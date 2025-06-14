// Korean martial arts trigram system types

import type { TrigramStance, PlayerArchetype, EffectType } from "./enums";
import type { KoreanText } from "./korean-text";

// Export TrigramStance for external modules
export type { TrigramStance } from "./enums";

// Trigram transition cost - FIXED: Ensure consistent naming
export interface TrigramTransitionCost {
  readonly ki: number;
  readonly stamina: number;
  readonly timeMilliseconds: number; // Use this consistently throughout
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
  readonly path: readonly TrigramStance[]; // Main path property
  readonly totalCost: TrigramTransitionCost; // Fix: Add proper type
  readonly effectiveness: number;
  readonly name: string;
  readonly description: KoreanText;
  // Remove 'from' property - it's covered by path[0]
}

// Trigram transition rule - FIXED: Add missing properties
export interface TrigramTransitionRule {
  readonly from: TrigramStance;
  readonly to: TrigramStance;
  readonly cost: TrigramTransitionCost;
  readonly effectiveness: number; // Add missing property
  readonly conditions?: ReadonlyArray<{
    type: "player_stat" | "archetype" | "active_effect";
    stat?: "health" | "ki" | "stamina";
    archetype?: PlayerArchetype;
    effectType?: EffectType;
    threshold?: number;
    value?: boolean | string;
  }>;
  readonly description: KoreanText;
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
  readonly korean: string;
  readonly english: string;
  readonly symbol: string;
  readonly element: string;
  readonly nature: "yin" | "yang";
  readonly philosophy: KoreanText;
  readonly combat: KoreanText;
  readonly theme: TrigramTheme;
  readonly name: KoreanText;
  readonly defensiveBonus: number;
  readonly kiFlowModifier: number;
  readonly techniques: {
    readonly primary: {
      readonly korean: string;
      readonly english: string;
      readonly damage: number;
      readonly kiCost: number;
      readonly staminaCost: number;
      readonly hitChance: number;
      readonly criticalChance: number;
      readonly description: KoreanText;
      readonly targetAreas: readonly string[];
      readonly effects: readonly string[];
    };
  };
}

// Trigram effectiveness matrix
export interface TrigramEffectivenessMatrix {
  readonly [attacker: string]: {
    readonly [defender: string]: number;
  };
}

// Trigram stance transition
export interface TrigramTransition {
  readonly from: TrigramStance;
  readonly to: TrigramStance;
  readonly difficulty: number;
  readonly kiCost: number;
  readonly staminaCost: number;
  readonly transitionTime: number;
}

// Fix: Add missing StanceTransition export
export interface StanceTransition {
  readonly from: TrigramStance;
  readonly to: TrigramStance;
  readonly difficulty: number;
  readonly time: number;
  readonly kiCost: number;
  readonly requirements?: string[];
}

// Trigram philosophy system
export interface TrigramPhilosophy {
  readonly trigram: TrigramStance;
  readonly principle: KoreanText;
  readonly application: KoreanText;
  readonly strengthsAgainst: readonly TrigramStance[];
  readonly weaknessesAgainst: readonly TrigramStance[];
}

// Trigram combat style
export interface TrigramCombatStyle {
  readonly trigram: TrigramStance;
  readonly combatApproach: string;
  readonly preferredRange: "close" | "medium" | "long";
  readonly focusArea: "offense" | "defense" | "balance";
  readonly keyCharacteristics: readonly string[];
}

// Archetype-trigram affinity
export interface ArchetypeTrigramAffinity {
  readonly archetype: PlayerArchetype;
  readonly preferredTrigrams: readonly TrigramStance[];
  readonly bonusEffectiveness: Record<TrigramStance, number>;
  readonly penaltyTrigrams: readonly TrigramStance[];
}

// Fix: Update TrigramTheme to include all required properties
export interface TrigramTheme {
  readonly primary: number;
  readonly secondary: number;
  readonly active: number; // Fix: Add missing active property
  readonly hover: number; // Fix: Add missing hover property
  readonly text: number; // Fix: Add missing text property
}
