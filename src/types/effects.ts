/**
 * @fileoverview Effect system types for Korean martial arts combat
 */

import type { Position } from "./common";
import type { KoreanText } from "./korean-text";

/**
 * Types of hit effects that can occur during combat
 */
export enum HitEffectType {
  HIT = "hit",
  CRITICAL = "critical",
  TECHNIQUE_HIT = "technique_hit",
  VITAL_POINT_HIT = "vital_point_hit",
  STUN = "stun",
  PARALYSIS = "paralysis",
  WEAKENED = "weakened",
  STAMINA_DRAIN = "stamina_drain",
  CONFUSION = "confusion",
  BLEED = "bleed",
  VULNERABILITY = "vulnerability",
  DODGE = "dodge",
}

/**
 * Intensity levels for effects
 */
export enum EffectIntensity {
  MINOR = "minor",
  MODERATE = "moderate",
  SEVERE = "severe",
  CRITICAL = "critical",
}

/**
 * Status effect types for gameplay mechanics
 */
export enum StatusEffectType {
  STUN = "stun",
  POISON = "poison",
  BURN = "burn",
  BLEED = "bleed",
  STRENGTHENED = "strengthened",
  WEAKENED = "weakened",
  PARALYSIS = "paralysis",
  CONFUSION = "confusion",
  REGENERATION = "regeneration",
  STAMINA_DRAIN = "stamina_drain",
}

/**
 * Hit effect for display and gameplay
 */
export interface HitEffect {
  readonly id: string;
  readonly type: HitEffectType;
  readonly intensity: "minor" | "moderate" | "critical" | "severe";
  readonly duration: number;
  readonly damage?: number;
  readonly position: Position;
  readonly timestamp: number;
  readonly text: string;
  readonly color: number;
}

/**
 * Display-specific hit effect properties
 */
export interface DisplayHitEffect extends HitEffect {
  readonly scale: number;
  readonly alpha: number;
  readonly velocity: { x: number; y: number };
  readonly fontSize: number;
}

/**
 * Status effect that persists over time
 */
export interface StatusEffect {
  readonly id: string;
  readonly type: StatusEffectType;
  readonly intensity: EffectIntensity;
  readonly duration: number;
  readonly description: KoreanText;
  readonly stackable: boolean;
  readonly source: string;
  readonly startTime: number;
  readonly endTime: number;
}

/**
 * Environmental effect that affects the combat area
 */
export interface EnvironmentalEffect {
  readonly id: string;
  readonly type: string;
  readonly area: {
    readonly center: Position;
    readonly radius: number;
  };
  readonly duration: number;
  readonly intensity: number;
  readonly effects: readonly StatusEffect[];
}

// Export all types and enums
export {
  HitEffectType,
  EffectIntensity,
  StatusEffectType,
  type HitEffect,
  type DisplayHitEffect,
  type StatusEffect,
  type EnvironmentalEffect,
  type Position,
};

// Default export should be the main interface, not HitEffect
export default StatusEffect;

// Environmental effect types
export enum EnvironmentalEffectType {
  SMOKE = "smoke",
  FIRE = "fire",
  ICE = "ice",
  WIND = "wind",
  LIGHTNING = "lightning",
  DARKNESS = "darkness",
  LIGHT = "light",
  PRESSURE = "pressure",
}

// Fix: Add missing VisualEffect export
export interface VisualEffect {
  readonly id: string;
  readonly type: string;
  readonly duration: number;
  readonly intensity: number;
  readonly position?: Position;
  readonly color?: number;
}

// Fix: Add missing EffectSystem export
export interface EffectSystem {
  readonly effects: readonly VisualEffect[];
  readonly addEffect: (effect: VisualEffect) => void;
  readonly removeEffect: (id: string) => void;
  readonly updateEffects: (deltaTime: number) => void;
}

// Fix: Remove duplicate HitEffect interface - use the complete one above

// Fix: Update DisplayHitEffect interface to extend the main HitEffect
export interface DisplayHitEffect extends HitEffect {
  readonly opacity: number;
  readonly scale: number;
  readonly startTime: number;
  readonly displayAlpha: number;
  readonly displayY: number;
  readonly displaySize: number;
}
