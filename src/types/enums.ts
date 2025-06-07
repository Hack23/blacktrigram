// Core enums for Black Trigram Korean martial arts system

// Player archetypes for Korean martial arts specializations
export type PlayerArchetype =
  | "musa"
  | "amsalja"
  | "hacker"
  | "jeongbo_yowon"
  | "jojik_pokryeokbae";

// Trigram stances from the I Ching
export type TrigramStance =
  | "geon" // ☰ Heaven
  | "tae" // ☱ Lake
  | "li" // ☲ Fire
  | "jin" // ☳ Thunder
  | "son" // ☴ Wind
  | "gam" // ☵ Water
  | "gan" // ☶ Mountain
  | "gon"; // ☷ Earth

// Game phases for state management
export type GamePhase =
  | "intro"
  | "training"
  | "combat"
  | "victory"
  | "defeat"
  | "paused";

// Body regions for vital point targeting - add missing regions
export type BodyRegion =
  | "head"
  | "face_upper" // Added
  | "chest" // Add missing chest region
  | "abdomen" // Add missing abdomen region
  | "neck"
  | "torso"
  | "left_arm"
  | "right_arm"
  | "left_leg"
  | "right_leg";

// Vital point severity levels
export type VitalPointSeverity =
  | "minor"
  | "moderate"
  | "severe"
  | "critical"
  | "lethal";

// Effect types for combat
export type EffectType =
  | "stun"
  | "bleed"
  | "pain"
  | "vulnerable"
  | "exhausted"
  | "poisoned" // Added
  | "burning" // Added
  | "weakness" // Added
  | "bleeding"
  | "confusion" // Added
  | "buff" // Added
  | "debuff" // Added
  | "winded" // Added
  | "paralysis" // Added
  | "stamina_drain" // Added
  | "vital_weakness" // Added
  | "vital_stunning" // Added
  | "damage_vulnerability" // Added
  | "vital_paralysis"; // Added

// Effect intensity levels
export type EffectIntensity =
  | "light"
  | "moderate"
  | "severe"
  | "critical"
  | "weak" // Added
  | "medium" // Added
  | "strong" // Added
  | "heavy";

// Combat attack types
export type EnumCombatAttackType =
  | "strike"
  | "thrust"
  | "block"
  | "counter_attack"
  | "throw"
  | "grapple"
  | "pressure_point"
  | "nerve_strike"
  | "punch"; // Add missing punch type

// Damage types for Korean martial arts
export type DamageType =
  | "blunt"
  | "piercing"
  | "slashing"
  | "pressure"
  | "nerve"
  | "joint"
  | "internal"
  | "impact"
  | "crushing"
  | "sharp"
  | "electric"
  | "fire"
  | "ice"
  | "poison"
  | "psychic"
  | "blood";

// Status effect types
export type StatusEffectType =
  | "stun"
  | "bleed"
  | "pain"
  | "vulnerable"
  | "exhausted"
  | "poisoned"
  | "burning";

// Audio categories
export type AudioCategory = "combat" | "ui" | "music" | "ambient";

// Priority levels
export type Priority = "low" | "medium" | "high" | "critical";

// Add missing enums that systems reference
export type CombatReadiness =
  | "ready"
  | "not_ready"
  | "exhausted"
  | "injured"
  | "unconscious"
  | "critical_damage" // Added
  | "heavy_damage" // Added
  | "moderate_damage" // Added
  | "light_damage" // Added
  | "incapacitated";

export type CombatState =
  | "idle"
  | "ready" // Add ready state
  | "attacking"
  | "defending"
  | "stunned"
  | "recovering"
  | "defeated"
  | "incapacitated"; // Add incapacitated state

export type InputAction =
  | "stance_change"
  | "attack"
  | "defend"
  | "move"
  | "special"
  | "pause";

export type VitalPointCategory =
  | "head"
  | "neck"
  | "torso"
  | "limbs"
  | "joints"
  | "nerve"
  | "vascular"
  | "pressure_point";
