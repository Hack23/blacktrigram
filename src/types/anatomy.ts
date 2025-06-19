/**
 * Anatomical and vital point system types
 */

import type { KoreanText, DamageRange } from "./common";
import type { EffectIntensity } from "./effects";

// Vital point definition
export interface VitalPoint {
  readonly id: string;
  readonly korean: KoreanText;
  readonly english: string;
  readonly anatomicalName?: string;
  readonly category: VitalPointCategory;
  readonly severity: VitalPointSeverity;
  readonly position: Position;
  readonly radius: number;
  readonly effects: readonly VitalPointEffect[];
  readonly damage?: DamageRange;
  readonly baseDamage?: number; // Add missing property
  readonly description: KoreanText;
  readonly difficulty: number;
  readonly requiredForce: number;
  readonly safetyWarning?: string;
  readonly location?: Position;
  readonly region?: string; // Add missing region property
}

// Vital point effect
export interface VitalPointEffect {
  readonly type: VitalPointEffectType;
  readonly intensity: EffectIntensity;
  readonly damage?: number;
  readonly duration?: number;
  readonly description: KoreanText;
}

// Player archetype data
export interface PlayerArchetypeData {
  readonly id: string;
  readonly name: KoreanText;
  readonly description: KoreanText;
  readonly baseHealth: number;
  readonly baseKi: number;
  readonly baseStamina: number;
  readonly coreStance: TrigramStance;
  readonly theme: {
    primary: number;
    secondary: number;
  };
  readonly colors: {
    primary: number;
    secondary: number;
  };
  readonly stats: {
    attackPower: number;
    defense: number;
    speed: number;
    technique: number;
  };
  readonly favoredStances: readonly TrigramStance[];
  readonly specialAbilities: readonly string[];
  readonly philosophy: KoreanText;
}

// Trigram transition cost
export interface TrigramTransitionCost {
  readonly ki: number;
  readonly stamina: number;
  readonly timeMilliseconds: number;
}

// Trigram transition rule
export interface TrigramTransitionRule {
  readonly from: TrigramStance;
  readonly to: TrigramStance;
  readonly allowed: boolean;
  readonly cost: TrigramTransitionCost;
  readonly difficulty: number;
  readonly conditions?: string[];
}

// Region data
export interface RegionData {
  readonly name: KoreanText;
  readonly boundaries: readonly Position[];
  readonly vitalPoints: readonly VitalPoint[];
  readonly vulnerabilities: readonly string[];
}

// Vital point hit result
export interface VitalPointHitResult {
  readonly hit: boolean;
  readonly vitalPoint?: VitalPoint;
  readonly damage: number;
  readonly effects: readonly StatusEffect[];
  readonly severity: VitalPointSeverity;
}

// Damage result
export interface DamageResult {
  readonly damage: number;
  readonly effects: readonly StatusEffect[];
  readonly isCritical: boolean;
  readonly isVitalPoint: boolean;
}

// Anatomical region
export interface AnatomicalRegion {
  readonly id: string;
  readonly name: KoreanText;
  readonly boundaries: readonly Position[];
  readonly vitalPoints: readonly VitalPoint[];
}

// Body region
export interface BodyRegion {
  readonly id: string;
  readonly name: KoreanText;
  readonly boundaries: readonly Position[];
  readonly vitalPoints: readonly VitalPoint[];
}

// Vital point system config
export interface VitalPointSystemConfig {
  readonly damageMultipliers?: Record<VitalPointSeverity, number>;
  readonly effectDurations?: Record<string, number>;
  readonly hitRadiusModifier?: number;
  readonly accuracyThreshold?: number;
}

// Stance effectiveness matrix
export const TRIGRAM_EFFECTIVENESS: Record<
  TrigramStance,
  Partial<Record<TrigramStance, number>>
> = {
  [TrigramStance.GEON]: {
    [TrigramStance.GON]: 1.2,
    [TrigramStance.SON]: 0.8,
  },
  [TrigramStance.TAE]: {
    [TrigramStance.JIN]: 1.2,
    [TrigramStance.GAN]: 0.8,
  },
  [TrigramStance.LI]: {
    [TrigramStance.GAM]: 1.2,
    [TrigramStance.TAE]: 0.8,
  },
  [TrigramStance.JIN]: {
    [TrigramStance.SON]: 1.2,
    [TrigramStance.GEON]: 0.8,
  },
  [TrigramStance.SON]: {
    [TrigramStance.GON]: 1.2,
    [TrigramStance.LI]: 0.8,
  },
  [TrigramStance.GAM]: {
    [TrigramStance.LI]: 1.2,
    [TrigramStance.JIN]: 0.8,
  },
  [TrigramStance.GAN]: {
    [TrigramStance.TAE]: 1.2,
    [TrigramStance.GAM]: 0.8,
  },
  [TrigramStance.GON]: {
    [TrigramStance.GEON]: 1.2,
    [TrigramStance.SON]: 0.8,
  },
};

// Archetype preferred stances
export const ARCHETYPE_STANCES: Record<PlayerArchetype, TrigramStance[]> = {
  [PlayerArchetype.MUSA]: [TrigramStance.GEON, TrigramStance.GAN],
  [PlayerArchetype.AMSALJA]: [TrigramStance.SON, TrigramStance.GAM],
  [PlayerArchetype.HACKER]: [TrigramStance.LI, TrigramStance.JIN],
  [PlayerArchetype.JEONGBO_YOWON]: [TrigramStance.TAE, TrigramStance.GAN],
  [PlayerArchetype.JOJIK_POKRYEOKBAE]: [TrigramStance.JIN, TrigramStance.GON],
};

export interface KoreanTechnique {
  id: string;
  name: {
    korean: string;
    english: string;
    romanized: string;
  };
  koreanName: string;
  englishName: string;
  romanized: string;
  description: {
    korean: string;
    english: string;
  };
  stance: TrigramStance;
  type: string;
  damageType: string;
  damage: number;
  kiCost: number;
  staminaCost: number;
  accuracy: number;
  range: number;
  executionTime: number;
  recoveryTime: number;
  critChance: number;
  critMultiplier: number;
  effects: any[];
}

export enum VitalPointCategory {
  HEAD = "head",
  NECK = "neck",
  TORSO = "torso",
  ARMS = "arms",
  LEGS = "legs",
  NEUROLOGICAL = "neurological",
  RESPIRATORY = "respiratory",
  CIRCULATORY = "circulatory",
  VASCULAR = "vascular",
  ORGAN = "organ",
}

export enum VitalPointSeverity {
  LOW = "low",
  MINOR = "minor",
  MEDIUM = "medium",
  MODERATE = "moderate",
  HIGH = "high",
  MAJOR = "major",
  CRITICAL = "critical",
}

export enum VitalPointEffectType {
  UNCONSCIOUSNESS = "unconsciousness",
  BREATHLESSNESS = "breathlessness",
  PAIN = "pain",
  PARALYSIS = "paralysis",
  STUN = "stun",
  WEAKNESS = "weakness",
  DISORIENTATION = "disorientation",
  BLOOD_FLOW_RESTRICTION = "blood_flow_restriction",
  NERVE_DISRUPTION = "nerve_disruption",
  ORGAN_DISRUPTION = "organ_disruption",
}

/**
 * Effect intensity levels
 */
export enum EffectIntensity {
  MINOR = "minor",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

/**
 * 2D position coordinates
 */
export interface Position {
  readonly x: number;
  readonly y: number;
}

/**
 * Vital point on the human body
 */
export interface VitalPoint {
  readonly id: string;
  readonly category: VitalPointCategory;
  readonly severity: VitalPointSeverity;
  readonly name: KoreanText;
  readonly description: KoreanText;
  readonly effects: readonly VitalPointEffect[];
  readonly location?: Position;
  readonly targetAreas: readonly string[];
  readonly accessibility: number;
  readonly accuracy: number;
  readonly discoveryLevel: number;
}

/**
 * Effect that occurs when a vital point is struck
 */
export interface VitalPointEffect {
  readonly type: VitalPointEffectType;
  readonly intensity: EffectIntensity;
  readonly duration?: number;
  readonly description: KoreanText;
}

export {
  VitalPointCategory,
  VitalPointSeverity,
  VitalPointEffectType,
  EffectIntensity,
  type Position,
  type VitalPoint,
  type VitalPointEffect,
};
