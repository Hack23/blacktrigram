// Player state and archetype definitions for Korean martial arts game

import type {
  PlayerArchetype as PlayerArchetypeEnum, // Use alias to avoid conflict if any local declaration was intended
  TrigramStance,
  CombatState,
  BodyRegion,
  CombatReadiness, // Import CombatReadiness
} from "./enums";
import type { Position, KoreanText } from "./index"; // Imports from the main index file
import type { StatusEffect } from "./effects";

// Define and export PlayerAttributes
export interface PlayerAttributes {
  strength: number;
  agility: number;
  endurance: number;
  intelligence: number;
  focus: number; // Ki control, precision
  resilience: number; // Pain tolerance, recovery
}

// Define and export PlayerSkills
export interface PlayerSkills {
  striking: number; // 권법 (Gwongbeop) - Punching/Striking
  kicking: number; // 발차기 (Balchagi) - Kicking
  grappling: number; // 유술 (Yusul) - Grappling/Joint Locks
  weaponry: number; // 무기술 (Mugisul) - Weaponry (if applicable)
  meditation: number; // 명상 (Myeongsang) - Ki cultivation
  strategy: number; // 전략 (Jeonryak) - Combat tactics
}

export interface PlayerState {
  readonly id: string;
  readonly archetype: PlayerArchetypeEnum; // Use aliased PlayerArchetypeEnum
  name: KoreanText; // Made mutable for updates
  health: number;
  readonly maxHealth: number;
  ki: number; // Spiritual energy
  readonly maxKi: number;
  stamina: number; // Physical endurance
  readonly maxStamina: number;
  consciousness: number; // Awareness, 0 = unconscious
  pain: number; // Current pain level, affects actions
  balance: number; // Stability, 0 = fallen
  bloodLoss: number; // Cumulative blood loss
  position: Position;
  facing: "left" | "right"; // Made mutable for updates
  currentTargetId?: string | null; // Made mutable for updates
  activeEffects: readonly StatusEffect[]; // Made mutable for updates // Changed from StatusEffect[]
  readonly attributes: PlayerAttributes;
  readonly skills: PlayerSkills;
  combatState: CombatState; // Made mutable for updates
  readonly lastActionTime: number; // Changed from mutable
  lastStanceChangeTime: number; // Made mutable for updates
  comboCount: number; // Made mutable for updates
  readonly vitalPointDamage: Record<string, number>;
  readonly bodyPartStatus: Record<
    BodyRegion,
    "healthy" | "injured" | "critical"
  >;
  readonly knownTechniques: readonly string[];
  currentStance: TrigramStance; // Made mutable for updates
  combatReadiness?: CombatReadiness; // Added optional combatReadiness
}

export type PlayerArchetype = PlayerArchetypeEnum; // Export PlayerArchetype type alias

// Player archetype specific bonuses
export interface PlayerArchetypeBonuses {
  readonly damageBonus: number;
  readonly accuracyBonus: number;
  readonly speedBonus: number;
  readonly defenseBonus: number;
  readonly damageResistance?: number;
  readonly precisionBonus?: number;
  readonly kiEfficiency?: number; // Added
  readonly staminaEfficiency?: number; // Added
  // Allow other string-based descriptive bonuses if necessary,
  // but calculation-relevant ones should be numbers.
  [key: string]: number | string | undefined;
}

// Player archetype data structure - Consolidated definition
export interface PlayerArchetypeData {
  readonly name: { korean: string; english: string };
  readonly description: { korean: string; english: string };
  readonly preferredTrigrams: readonly TrigramStance[];
  readonly specialization: string;
  readonly bonuses: PlayerArchetypeBonuses; // Unified to use PlayerArchetypeBonuses
}

export interface PlayerCombatStats {
  readonly id: string;
  readonly archetype: PlayerArchetype;
  readonly level: number;
  readonly experience: number;
  readonly nextLevelExperience: number;
  readonly attributes: PlayerAttributes;
  readonly skills: PlayerSkills;
  readonly combatState: CombatState;
  readonly lastActionTime: number;
  readonly lastStanceChangeTime: number;
  readonly comboCount: number;
  readonly vitalPointDamage: Record<string, number>;
  readonly bodyPartStatus: Record<
    BodyRegion,
    "healthy" | "injured" | "critical"
  >;
  readonly knownTechniques: readonly string[];
  readonly currentStance: TrigramStance;
  readonly combatReadiness: CombatReadiness; // Added
}

export interface PlayerProgression {
  readonly id: string;
  readonly archetype: PlayerArchetype;
  readonly level: number;
  readonly experience: number;
  readonly nextLevelExperience: number;
  readonly attributes: PlayerAttributes;
  readonly skills: PlayerSkills;
  readonly knownTechniques: readonly string[];
}
