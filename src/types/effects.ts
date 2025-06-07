// Status effects system for Korean martial arts

import type { EffectType, EffectIntensity, DamageType } from "./enums"; // Added DamageType
import type { KoreanText } from "./korean-text";
import type { Position } from "./common";

export interface StatusEffect {
  readonly id: string;
  readonly type: EffectType;
  readonly intensity: EffectIntensity; // Uses EffectIntensity from enums
  readonly duration: number; // in milliseconds
  readonly description: KoreanText;
  readonly stackable: boolean;
  readonly source?: string; // Optional source identifier
  readonly chance?: number;
  readonly modifiers?: readonly EffectModifier[];
}

export interface EffectModifier {
  readonly attribute: string;
  readonly value: number;
  readonly type: "flat" | "percentage";
  readonly damageType?: DamageType; // Added optional damageType
}

export interface VitalPointEffect extends StatusEffect {
  // VitalPointEffect is essentially a StatusEffect with potential additional properties
  readonly vitalPointId?: string;
  readonly bodyRegion?: string;
}

// Hit effect for visual combat feedback
export interface HitEffect {
  readonly id: string;
  readonly type: "light" | "medium" | "heavy" | "critical";
  readonly position: Position;
  readonly damage: number;
  readonly timestamp: number;
  readonly duration: number;
  readonly color: number; // PIXI color value
  readonly playerId: string;
}

// Combat effect types
export interface CombatEffect {
  readonly id: string;
  readonly type: "buff" | "debuff" | "status" | "environmental";
  readonly name: string;
  readonly description: string;
  readonly duration: number;
  readonly intensity: number;
  readonly timestamp: number;
  readonly position?: Position;
}

// Particle effect configuration
export interface ParticleEffect {
  readonly id: string;
  readonly type: "sparks" | "blood" | "ki_energy" | "dust" | "wind";
  readonly position: Position;
  readonly velocity: { x: number; y: number };
  readonly lifespan: number;
  readonly color: number;
  readonly alpha: number;
  readonly scale: number;
}

// Screen effect types for UI feedback
export interface ScreenEffect {
  readonly id: string;
  readonly type: "flash" | "shake" | "zoom" | "blur" | "color_shift";
  readonly intensity: number;
  readonly duration: number;
  readonly easing?: "linear" | "ease_in" | "ease_out" | "ease_in_out";
}

// Animation effect configuration
export interface AnimationEffect {
  readonly id: string;
  readonly target: string; // Target object ID
  readonly property: string; // Property to animate
  readonly from: number;
  readonly to: number;
  readonly duration: number;
  readonly easing?: "linear" | "ease_in" | "ease_out" | "ease_in_out";
  readonly loop?: boolean;
  readonly delay?: number;
}

// Sound effect integration
export interface SoundEffect {
  readonly id: string;
  readonly soundId: string;
  readonly volume: number;
  readonly pitch?: number;
  readonly delay?: number;
  readonly position?: Position; // For spatial audio
}

// Composite effect that combines multiple effects
export interface CompositeEffect {
  readonly id: string;
  readonly hitEffects: HitEffect[];
  readonly combatEffects: CombatEffect[];
  readonly particleEffects: ParticleEffect[];
  readonly screenEffects: ScreenEffect[];
  readonly soundEffects: SoundEffect[];
  readonly animationEffects: AnimationEffect[];
}

// Effect manager state
export interface EffectState {
  readonly activeHitEffects: HitEffect[];
  readonly activeCombatEffects: CombatEffect[];
  readonly activeParticleEffects: ParticleEffect[];
  readonly activeScreenEffects: ScreenEffect[];
  readonly activeAnimationEffects: AnimationEffect[];
}

// Effect creation helpers
export type EffectFactory = {
  createHitEffect: (
    damage: number,
    position: Position,
    type?: HitEffect["type"]
  ) => HitEffect;
  createCombatEffect: (
    type: CombatEffect["type"],
    name: string,
    duration: number
  ) => CombatEffect;
  createParticleEffect: (
    type: ParticleEffect["type"],
    position: Position
  ) => ParticleEffect;
  createScreenEffect: (
    type: ScreenEffect["type"],
    intensity: number,
    duration: number
  ) => ScreenEffect;
};
