// Combat effects and status system for Korean martial arts

import type { KoreanText, Position } from "./index";

// Hit effect for visual feedback
export interface HitEffect {
  readonly id: string;
  readonly type: HitEffectType;
  readonly attackerId: string;
  readonly defenderId: string;
  readonly timestamp: number;
  readonly duration: number;
  readonly position?: Position;
  readonly velocity?: { x: number; y: number };
  readonly color?: number;
  readonly size?: number;
  readonly alpha?: number;
  readonly lifespan?: number;
  readonly text?: string | KoreanText;
  readonly damageAmount?: number;
  readonly vitalPointId?: string;
  readonly statusEffect?: StatusEffect;
  readonly yOffset?: number;
  readonly intensity: number;
  readonly startTime: number; // Required property
}

// Hit effect types
export enum HitEffectType {
  GENERAL_DAMAGE = "general_damage",
  CRITICAL_HIT = "critical_hit",
  VITAL_POINT_STRIKE = "vital_point_strike",
  STATUS_EFFECT = "status_effect",
  MISS = "miss",
  BLOCK = "block",
  PARRY = "parry",
  COUNTER = "counter",
}

// Fix: Add missing EffectIntensity values
export type EffectIntensity =
  | "weak" // Fix: Add weak
  | "minor"
  | "low"
  | "medium"
  | "moderate"
  | "high"
  | "severe"
  | "critical"
  | "extreme"; // Fix: Add extreme

// Status effects that can be applied to players
export interface StatusEffect {
  readonly id: string;
  readonly type: string; // Fix: Keep as string for flexibility
  readonly intensity: EffectIntensity;
  readonly duration: number;
  readonly description: KoreanText;
  readonly stackable: boolean;
  readonly source: string;
  readonly startTime: number;
  readonly endTime: number;
}

// Effect types
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
export interface ParticleEffect {
  readonly id: string;
  readonly type: ParticleType;
  readonly position: Position;
  readonly velocity: { x: number; y: number };
  readonly acceleration?: { x: number; y: number };
  readonly color: number;
  readonly size: number;
  readonly lifetime: number;
  readonly fadeOut?: boolean;
  readonly gravity?: number;
}

// Particle effect types
export enum ParticleType {
  SPARK = "spark",
  BLOOD = "blood",
  ENERGY = "energy",
  DUST = "dust",
  FLASH = "flash",
  SMOKE = "smoke",
  LIGHTNING = "lightning",
  WIND = "wind",
}

// Environmental effect
export interface EnvironmentalEffect {
  readonly id: string;
  readonly type: EnvironmentalEffectType;
  readonly affectedArea: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly effects: {
    readonly visibilityModifier?: number;
    readonly accuracyModifier?: number;
    readonly movementModifier?: number;
    readonly damageModifier?: number;
  };
  readonly duration: number;
}

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

export default HitEffect;
