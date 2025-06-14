/**
 * Combat System Constants for Korean Martial Arts
 */

import type { SoundEffectId } from "../audio";
import type { TrigramStance } from "../enums";

// Combat configuration
export const COMBAT_CONFIG = {
  MAX_HEALTH: 100,
  MAX_KI: 100,
  MAX_STAMINA: 100,
  MAX_BALANCE: 100,
  MAX_CONSCIOUSNESS: 100,

  // Damage multipliers
  CRITICAL_HIT_MULTIPLIER: 2.0,
  VITAL_POINT_MULTIPLIER: 1.5,
  COUNTER_ATTACK_MULTIPLIER: 1.3,

  // Status thresholds
  LOW_HEALTH_THRESHOLD: 25,
  CRITICAL_HEALTH_THRESHOLD: 10,
  UNCONSCIOUS_THRESHOLD: 0,
  STAMINA_EXHAUSTED_THRESHOLD: 0,

  // Recovery rates (per second)
  STAMINA_RECOVERY_RATE: 10,
  KI_RECOVERY_RATE: 5,
  BALANCE_RECOVERY_RATE: 15,
  CONSCIOUSNESS_RECOVERY_RATE: 2,

  // Combat timing (milliseconds)
  TECHNIQUE_COOLDOWN: 500,
  STANCE_CHANGE_COOLDOWN: 200,
  BLOCK_DURATION: 300,
  RECOVERY_TIME: 400,
} as const;

// Enhanced damage calculation constants
export const ENHANCED_DAMAGE_CONSTANTS = {
  BASE_DAMAGE: 10,
  CRITICAL_MULTIPLIER: 2.0,
  VITAL_POINT_MULTIPLIER: 1.5,
  ARMOR_REDUCTION: 0.1,
  STANCE_DEFENSE_BONUS: 0.2,
  BALANCE_IMPACT_MULTIPLIER: 0.3,
  CONSCIOUSNESS_THRESHOLD: 30,
  PAIN_THRESHOLD: 80,

  // New damage factors
  TECHNIQUE_POWER_MODIFIER: 0.2,
  ARCHETYPE_BONUS: 0.15,
  COMBO_MULTIPLIER: 1.2,
  PERFECT_TIMING_BONUS: 0.3,
  BASE_CRIT_CHANCE: 0.1, // Added: Base critical hit chance (e.g., 10%)
} as const;

// Combat system constants for Korean martial arts

export const COMBAT_CONSTANTS = {
  // Damage calculation
  BASE_DAMAGE: 10,
  CRITICAL_MULTIPLIER: 2.0,
  VITAL_POINT_MULTIPLIER: 1.5,

  // Status thresholds
  LOW_HEALTH_THRESHOLD: 30,
  CRITICAL_HEALTH_THRESHOLD: 15,
  EXHAUSTED_STAMINA_THRESHOLD: 20,

  // Recovery rates (per second)
  STAMINA_RECOVERY_RATE: 5,
  KI_RECOVERY_RATE: 3,
  CONSCIOUSNESS_RECOVERY_RATE: 2,

  // Combat timing
  ATTACK_COOLDOWN: 500, // milliseconds
  STANCE_CHANGE_COOLDOWN: 300,
  BLOCK_WINDOW: 200,

  // Balance and momentum
  BALANCE_RECOVERY_RATE: 10,
  MOMENTUM_DECAY_RATE: 5,

  // Pain and status effects
  PAIN_DECAY_RATE: 3,
  STATUS_EFFECT_DURATION: 3000,
} as const;

// Trigram stance order for UI
export const TRIGRAM_STANCES_ORDER = [
  "geon",
  "tae",
  "li",
  "jin",
  "son",
  "gam",
  "gan",
  "gon",
] as const;

// Combat controls mapping
export const COMBAT_CONTROLS = {
  // Trigram stance system (1-8 keys)
  stanceControls: {
    "1": {
      stance: "geon" as TrigramStance,
      korean: "건",
      technique: "천둥벽력",
    },
    "2": {
      stance: "tae" as TrigramStance,
      korean: "태",
      technique: "유수연타",
    },
    "3": { stance: "li" as TrigramStance, korean: "리", technique: "화염지창" },
    "4": {
      stance: "jin" as TrigramStance,
      korean: "진",
      technique: "벽력일섬",
    },
    "5": {
      stance: "son" as TrigramStance,
      korean: "손",
      technique: "선풍연격",
    },
    "6": {
      stance: "gam" as TrigramStance,
      korean: "감",
      technique: "수류반격",
    },
    "7": {
      stance: "gan" as TrigramStance,
      korean: "간",
      technique: "반석방어",
    },
    "8": {
      stance: "gon" as TrigramStance,
      korean: "곤",
      technique: "대지포옹",
    },
  },

  // Movement controls
  movement: {
    WASD: "Tactical positioning and footwork",
    ArrowKeys: "Alternative movement system",
  },

  // Combat actions
  combat: {
    SPACE: "Execute current stance technique",
    SHIFT: "Defensive guard/block position",
    CTRL: "Precision vital point targeting mode",
    TAB: "Cycle through player archetypes",
  },

  // System controls
  system: {
    ESC: "Pause menu / Return to intro",
    F1: "Help / Controls guide",
    M: "Mute / Audio settings",
  },
} as const;

// Damage types
export const DAMAGE_TYPES = {
  PHYSICAL: "physical",
  ENERGY: "energy",
  VITAL_POINT: "vital_point",
  PSYCHOLOGICAL: "psychological",
} as const;

// Combat phases
export const COMBAT_PHASES = {
  PREPARATION: "preparation",
  ENGAGEMENT: "engagement",
  EXECUTION: "execution",
  RECOVERY: "recovery",
  RESOLUTION: "resolution",
} as const;

// Combat audio mapping
export const COMBAT_AUDIO_MAP: Record<string, SoundEffectId> = {
  light_attack: "attack_light",
  medium_attack: "attack_medium",
  heavy_attack: "attack_heavy",
  critical_attack: "attack_critical",

  light_hit: "hit_light",
  medium_hit: "hit_medium",
  heavy_hit: "hit_heavy",
  critical_hit: "critical_hit",

  block: "block_success",
  guard_break: "block_break",
  miss: "miss",

  stance_change: "stance_change",
  technique: "technique_execute",

  match_start: "match_start",
  combat_end: "combat_end",
  victory: "victory",
  defeat: "defeat",

  guard: "guard",
} as const;

// Combat state transitions
export const COMBAT_STATE_MACHINE = {
  idle: {
    canTransitionTo: ["attacking", "defending", "moving", "stunned"],
    duration: Infinity,
  },
  attacking: {
    canTransitionTo: ["idle", "recovering", "stunned"],
    duration: 500,
  },
  defending: {
    canTransitionTo: ["idle", "attacking", "stunned"],
    duration: 300,
  },
  moving: {
    canTransitionTo: ["idle", "attacking", "defending"],
    duration: 200,
  },
  stunned: {
    canTransitionTo: ["idle"],
    duration: 1000,
  },
  recovering: {
    canTransitionTo: ["idle"],
    duration: 400,
  },
  unconscious: {
    canTransitionTo: ["idle"],
    duration: 5000,
  },
} as const;

// Training-specific combat constants
export const TRAINING_COMBAT_SETTINGS = {
  techniqueCooldown: 500,
  perfectStrikeThreshold: 0.7,
  maxTrainingSession: 300000, // 5 minutes
  kiRegenerationRate: 2,
  staminaRegenerationRate: 1.5,
} as const;

// Combat state transitions for training mode
export const TRAINING_STATE_MACHINE = {
  practicing: {
    canTransitionTo: ["idle", "executing", "recovering"],
    duration: Infinity,
  },
  executing: {
    canTransitionTo: ["practicing", "idle"],
    duration: 800,
  },
  recovering: {
    canTransitionTo: ["practicing", "idle"],
    duration: 300,
  },
} as const;

// Technique execution results
export const TECHNIQUE_RESULTS = {
  SUCCESS: "success",
  BLOCKED: "blocked",
  MISSED: "missed",
  COUNTERED: "countered",
  INTERRUPTED: "interrupted",
} as const;

// Combat effectiveness modifiers
export const EFFECTIVENESS_MODIFIERS = {
  stance_advantage: 1.2,
  stance_disadvantage: 0.8,
  counter_attack: 1.5,
  perfect_timing: 1.3,
  off_balance: 0.7,
  fatigued: 0.6,
  focused: 1.1,
} as const;

// Combat timing constants
export const COMBAT_TIMING = {
  ATTACK_WINDOW: 500, // milliseconds
  COUNTER_WINDOW: 300,
  BLOCK_WINDOW: 200,
  DODGE_WINDOW: 250,

  // Recovery times
  LIGHT_ATTACK_RECOVERY: 300,
  HEAVY_ATTACK_RECOVERY: 600,
  BLOCK_RECOVERY: 200,
  STANCE_CHANGE_RECOVERY: 400,
} as const;

// Damage calculation constants
export const DAMAGE_CONSTANTS = {
  BASE_DAMAGE: 10,
  CRITICAL_MULTIPLIER: 1.5,
  VITAL_POINT_MULTIPLIER: 2.0,
  COUNTER_MULTIPLIER: 1.3,

  // Damage reduction
  BLOCK_REDUCTION: 0.7,
  GLANCING_REDUCTION: 0.5,
  ARMOR_REDUCTION_MAX: 0.9,
} as const;

// Combat resource costs
export const RESOURCE_COSTS = {
  KI: {
    BASIC_TECHNIQUE: 5,
    ADVANCED_TECHNIQUE: 10,
    SPECIAL_TECHNIQUE: 15,
    ULTIMATE_TECHNIQUE: 25,
  },
  STAMINA: {
    BASIC_ATTACK: 8,
    HEAVY_ATTACK: 15,
    BLOCK: 5,
    DODGE: 10,
    STANCE_CHANGE: 12,
  },
} as const;

// Hit detection constants
export const HIT_DETECTION = {
  PRECISION_THRESHOLD: 0.8,
  VITAL_POINT_THRESHOLD: 0.9,
  BASE_ACCURACY: 0.7,
  MAX_ACCURACY: 0.95,

  // Hit boxes
  PLAYER_HITBOX_WIDTH: 60,
  PLAYER_HITBOX_HEIGHT: 180,
  VITAL_POINT_RADIUS: 15,
} as const;

// Status effect durations
export const STATUS_DURATIONS = {
  STUN: 1500,
  POISON: 5000,
  BURN: 3000,
  BLEED: 4000,
  WEAKNESS: 6000,
  STRENGTH_BUFF: 8000,
} as const;

export default COMBAT_CONFIG;
