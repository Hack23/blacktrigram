/**
 * Combat system constants for Korean martial arts
 */

import type { SoundEffectId } from "../audio";

// Combat timing constants
export const COMBAT_TIMING = {
  ATTACK_WINDOW_MS: 200,
  PERFECT_TIMING_WINDOW_MS: 50,
  BLOCK_WINDOW_MS: 300,
  COUNTER_WINDOW_MS: 150,
  COMBO_CHAIN_TIMEOUT_MS: 1500,
  STANCE_TRANSITION_TIME_MS: 500,
  RECOVERY_TIME_BASE_MS: 800,
} as const;

// Damage calculation constants
export const DAMAGE_CONSTANTS = {
  BASE_DAMAGE_MULTIPLIER: 1.0,
  CRITICAL_HIT_MULTIPLIER: 1.5,
  VITAL_POINT_MULTIPLIER: 2.0,
  BLOCKED_DAMAGE_REDUCTION: 0.3,
  ARMOR_PENETRATION_BASE: 0.1,
  ELEMENTAL_BONUS: 0.2,
} as const;

// Status effect durations (in milliseconds)
export const STATUS_EFFECT_DURATIONS = {
  STUN_SHORT: 500,
  STUN_MEDIUM: 1000,
  STUN_LONG: 2000,
  BLEED_LIGHT: 3000,
  BLEED_HEAVY: 5000,
  PAIN_MINOR: 2000,
  PAIN_MAJOR: 4000,
  VULNERABLE: 3000,
  EXHAUSTED: 2500,
} as const;

// Combat state machine
export const COMBAT_STATES = {
  IDLE: "idle",
  ATTACKING: "attacking",
  DEFENDING: "defending",
  STUNNED: "stunned",
  RECOVERING: "recovering",
  DEFEATED: "defeated",
  INCAPACITATED: "incapacitated",
} as const;

// Hit types and their properties
export const HIT_TYPES = {
  MISS: { damage: 0, sound: "miss" as SoundEffectId, effect: "none" },
  GRAZE: { damage: 0.3, sound: "light_hit" as SoundEffectId, effect: "light" },
  NORMAL: {
    damage: 1.0,
    sound: "hit_medium" as SoundEffectId,
    effect: "normal",
  },
  SOLID: { damage: 1.2, sound: "hit_heavy" as SoundEffectId, effect: "heavy" },
  CRITICAL: {
    damage: 1.5,
    sound: "critical_hit" as SoundEffectId,
    effect: "critical",
  },
  VITAL: {
    damage: 2.0,
    sound: "critical_hit" as SoundEffectId,
    effect: "vital",
  },
} as const;

// Combat audio mapping
export const COMBAT_AUDIO_MAP = {
  ATTACK_LIGHT: "attack_light" as SoundEffectId,
  ATTACK_MEDIUM: "attack_medium" as SoundEffectId,
  ATTACK_HEAVY: "attack_heavy" as SoundEffectId,
  HIT_LIGHT: "hit_light" as SoundEffectId,
  HIT_MEDIUM: "hit_medium" as SoundEffectId,
  HIT_HEAVY: "hit_heavy" as SoundEffectId,
  BLOCK_SUCCESS: "block_success" as SoundEffectId,
  BLOCK_BREAK: "block_break" as SoundEffectId,
  STANCE_CHANGE: "stance_change" as SoundEffectId,
  CRITICAL_HIT: "critical_hit" as SoundEffectId,
  GUARD: "guard" as SoundEffectId,
  TECHNIQUE: "technique" as SoundEffectId,
  COMBAT_END: "combat_end" as SoundEffectId,
} as const;

// Ki and stamina costs
export const RESOURCE_COSTS = {
  BASIC_ATTACK: { ki: 5, stamina: 10 },
  HEAVY_ATTACK: { ki: 15, stamina: 25 },
  SPECIAL_TECHNIQUE: { ki: 25, stamina: 20 },
  BLOCK: { ki: 2, stamina: 5 },
  DODGE: { ki: 8, stamina: 15 },
  STANCE_CHANGE: { ki: 10, stamina: 5 },
} as const;

// Accuracy modifiers
export const ACCURACY_MODIFIERS = {
  BASE_ACCURACY: 0.75,
  DISTANCE_PENALTY_PER_UNIT: 0.05,
  MOVING_TARGET_PENALTY: 0.1,
  VITAL_POINT_PENALTY: 0.3,
  EXHAUSTED_PENALTY: 0.2,
  FOCUSED_BONUS: 0.15,
  COMBO_ACCURACY_DECAY: 0.05,
} as const;

// Combat configuration
export const COMBAT_CONFIG = {
  MAX_HEALTH: 100,
  MAX_KI: 100,
  MAX_STAMINA: 100,
  MAX_CONSCIOUSNESS: 100,
  MAX_BALANCE: 100,

  // Damage thresholds
  LIGHT_DAMAGE_THRESHOLD: 15,
  MEDIUM_DAMAGE_THRESHOLD: 25,
  HEAVY_DAMAGE_THRESHOLD: 35,
  CRITICAL_DAMAGE_THRESHOLD: 45,

  // Status effect durations (ms)
  STUN_DURATION: 2000,
  PAIN_DURATION: 5000,
  BLEED_DURATION: 10000,

  // Combat timing
  ATTACK_WINDOW: 300,
  COUNTER_WINDOW: 200,
  BLOCK_WINDOW: 400,
  RECOVERY_TIME: 500,
} as const;

// Damage ranges by attack type
export const DAMAGE_RANGES = {
  STRIKE: { min: 10, max: 20, type: "blunt" },
  PUNCH: { min: 8, max: 18, type: "blunt" },
  KICK: { min: 12, max: 22, type: "blunt" },
  ELBOW: { min: 15, max: 25, type: "blunt" },
  KNEE: { min: 18, max: 28, type: "blunt" },
  GRAPPLE: { min: 5, max: 15, type: "joint" },
  THROW: { min: 20, max: 30, type: "crushing" },
  PRESSURE_POINT: { min: 25, max: 40, type: "nerve" },
  NERVE_STRIKE: { min: 30, max: 45, type: "nerve" },
  BONE_STRIKE: { min: 35, max: 50, type: "blunt" },
} as const;

// Damage ranges for combat levels
export const DAMAGE_RANGES_LEVELS = {
  light: { min: 5, max: 15 },
  medium: { min: 15, max: 25 },
  heavy: { min: 25, max: 40 },
  critical: { min: 40, max: 60 },
  vital_point: { min: 50, max: 80 },
} as const;

// Combat effectiveness modifiers
export const COMBAT_MODIFIERS = {
  ARCHETYPE_BONUS: {
    MUSA: { damageResistance: 1.2, jointTechniques: 1.5 },
    AMSALJA: { stealthMultiplier: 1.8, oneStrikeKill: 2.0 },
    HACKER: { precisionAnalysis: 1.6, environmentalControl: 1.4 },
    JEONGBO: { psychologicalWarfare: 1.5, strategicAnalysis: 1.4 },
    JOJIK: { dirtyFighting: 1.8, survivalInstinct: 1.6 },
  },

  VITAL_POINT_MULTIPLIER: 2.5,
  COUNTER_ATTACK_MULTIPLIER: 1.8,
  CRITICAL_HIT_MULTIPLIER: 2.0,
  PERFECT_TECHNIQUE_MULTIPLIER: 3.0,
} as const;

// Enhanced combat mechanics for Korean martial arts
export const PAIN_RESPONSE_SYSTEM = {
  SHOCK_PAIN_MULTIPLIER: 1.5,
  CUMULATIVE_TRAUMA_FACTOR: 0.8,
  PAIN_OVERLOAD_THRESHOLD: 85,
  INCAPACITATION_THRESHOLD: 95,
} as const;

export const VITAL_POINT_MODIFIERS = {
  HEAD: { damage: 2.0, consciousness: 3.0, stun: 2.5 },
  NECK: { damage: 2.5, consciousness: 4.0, stun: 3.0 },
  TORSO: { damage: 1.5, consciousness: 1.5, stun: 1.2 },
  LIMBS: { damage: 1.2, consciousness: 0.8, stun: 1.0 },
} as const;

// Transition cost limits for stance changes
export const MAX_TRANSITION_COST_KI = 50;
export const MAX_TRANSITION_COST_STAMINA = 40;
export const MAX_TRANSITION_TIME_MILLISECONDS = 2000;

// Damage calculation constants
export const DAMAGE_CONSTANTS = {
  BASE_DAMAGE_MIN: 5,
  BASE_DAMAGE_MAX: 40,
  CRITICAL_MULTIPLIER: 2.0,
  VITAL_POINT_MULTIPLIER: 1.5,
  GLANCING_BLOW_MULTIPLIER: 0.3,
} as const;

// Combat state thresholds
export const COMBAT_THRESHOLDS = {
  HEALTH_CRITICAL: 20, // percentage
  STAMINA_LOW: 25, // percentage
  KI_DEPLETED: 10, // percentage
  PAIN_SEVERE: 80, // percentage
  CONSCIOUSNESS_DANGER: 30, // percentage
} as const;

// Vital point targeting constants
export const VITAL_POINT_CONSTANTS = {
  BASE_ACCURACY: 0.7, // 70% base hit chance
  PRECISION_BONUS: 0.2, // 20% bonus for aimed shots
  DISTANCE_PENALTY: 0.1, // 10% penalty per unit distance
  STANCE_MODIFIER_MAX: 0.3, // Maximum 30% modifier from stance
} as const;

// Korean martial arts specific combat values
export const KOREAN_COMBAT_VALUES = {
  RESPECT_BONUS: 1.1, // 10% damage bonus for honorable combat
  DISHONOR_PENALTY: 0.8, // 20% damage penalty for dishonorable combat
  MASTERY_THRESHOLD: 1000, // Experience points for technique mastery
  PERFECT_TECHNIQUE_BONUS: 1.25, // 25% bonus for perfect execution
} as const;

// Export all constants
export const COMBAT_CONSTANTS = {
  ...COMBAT_TIMING,
  ...DAMAGE_CONSTANTS,
  ...COMBAT_THRESHOLDS,
  ...VITAL_POINT_CONSTANTS,
  ...KOREAN_COMBAT_VALUES,
  MAX_TRANSITION_COST_KI,
  MAX_TRANSITION_COST_STAMINA,
  MAX_TRANSITION_TIME_MILLISECONDS,
  BASE_ACCURACY: 0.8,
  CRITICAL_HIT_CHANCE: 0.05,
  CRITICAL_HIT_MULTIPLIER: 1.5,
  MAX_DAMAGE_PER_HIT: 100,
  MIN_DAMAGE_PER_HIT: 1,
  STANCE_CHANGE_COOLDOWN_MS: 500,
  DEFAULT_ATTACK_RANGE: 1.0,
  VITAL_POINT_ACCURACY_BONUS: 0.15,
} as const;

// Sound effect IDs for combat
export const COMBAT_SOUND_EFFECTS = {
  combat_end: "combat_end" as const,
  miss: "miss" as const,
  guard: "guard" as const,
  technique: "technique" as const,
  // Add other combat-specific sound effect IDs here if they are distinct
  // from the main SoundEffectId list or need specific grouping.
};
