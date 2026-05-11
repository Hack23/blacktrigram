/**
 * Combat effects and status system for Korean martial arts.
 *
 * @module systems/effects
 * @category Combat Effects
 * @korean 전투효과시스템
 */

/** Hit effect type discriminator for combat feedback */
export enum HitEffectType {
  GENERAL_DAMAGE = "general_damage",
  CRITICAL_HIT = "critical_hit",
  VITAL_POINT_STRIKE = "vital_point_strike",
  STATUS_EFFECT = "status_effect",
  MISS = "miss",
  BLOCK = "block",
  PARRY = "parry",
  COUNTER = "counter",
  HIT = "hit",
}

/** Additional hit effect variants for status effects */
export enum HitEffectEnum {
  STUN = "stun",
  WEAKNESS = "weakness",
  STAMINA_DRAIN = "stamina_drain",
  VULNERABILITY = "vulnerability",
  BLEEDING = "bleeding",
  BUFF = "buff",
  DEBUFF = "debuff",
  PARALYSIS = "paralysis",
  POISON = "poison",
  BURN = "burn",
  FREEZE = "freeze",
  CONFUSION = "confusion",
}

/** Effect intensity levels for status effects */
export enum EffectIntensity {
  WEAK = "weak",
  MINOR = "minor",
  LOW = "low",
  MEDIUM = "medium",
  MODERATE = "moderate",
  HIGH = "high",
  SEVERE = "severe",
  CRITICAL = "critical",
  EXTREME = "extreme",
}

/** Union type of all applicable status effect identifiers */
export type EffectType =
  | "stun"
  | "poison"
  | "burn"
  | "bleed"
  | "exhausted"
  | "focused"
  | "rage"
  | "defensive"
  | "weakened"
  | "strengthened"
  | "paralysis" // Add missing paralysis
  | "confusion" // Add missing confusion
  | "vulnerability" // Add missing vulnerability
  | "stamina_drain"; // Add missing stamina_drain

// Particle effect for visual feedback
// Particle effect types
export type ParticleType =
  | "spark"
  | "blood"
  | "energy"
  | "dust"
  | "flash"
  | "smoke"
  | "lightning"
  | "wind";

// Environmental effect
// Environmental effect types
export type EnvironmentalEffectType =
  | "smoke"
  | "fire"
  | "ice"
  | "wind"
  | "lightning"
  | "darkness"
  | "light"
  | "pressure";
