// Korean martial arts anatomy system for precise vital point targeting

import { Position } from "./common";
import type { KoreanText } from "./korean-text";
import type {
  BodyRegion,
  EffectIntensity,
  EffectType,
  VitalPointCategory as EnumVitalPointCategory,
  VitalPointSeverity as EnumVitalPointSeverity,
} from "./enums"; // Corrected imports
import type { StatusEffect } from "./effects"; // Corrected to import StatusEffect from effects.ts

// Vital point effect for Korean martial arts realism - FIXED: Use proper types
export interface VitalPointEffect {
  readonly id: string;
  readonly type: EffectType; // Fixed: Use imported type from enums
  readonly intensity: EffectIntensity; // Fixed: Use imported type from enums
  readonly duration: number; // Duration in milliseconds
  readonly description: KoreanText;
  readonly stackable: boolean;
  readonly source?: string; // Optional: e.g., 'technique', 'vital_point'
  readonly chance?: number; // Optional: 0-1
  readonly modifiers?: ReadonlyArray<any>; // TODO: Define specific modifier types
}

// Vital point location for targeting in Korean martial arts
export interface VitalPointLocation {
  readonly x: number; // Relative x-coordinate (e.g., 0-100 or 0-1)
  readonly y: number; // Relative y-coordinate
  readonly region: BodyRegion | string; // General body region or specific sub-region
  readonly depth?: number; // Optional: penetration depth required
}

// Korean martial arts vital point definition - FIXED: Complete interface
export interface VitalPoint {
  readonly id: string;
  readonly name: KoreanText;
  readonly koreanName: string; // For easier access
  readonly englishName: string; // For easier access
  readonly korean?: string; // Original field, can be deprecated if name.korean is primary
  readonly category: EnumVitalPointCategory | string; // Use imported EnumVitalPointCategory
  readonly description: KoreanText;
  readonly location: VitalPointLocation;
  readonly severity: EnumVitalPointSeverity; // Use imported EnumVitalPointSeverity
  readonly baseAccuracy: number; // Base chance to hit (0-1)
  readonly baseDamage: number; // Base damage if hit
  readonly damageMultiplier: number; // Multiplier for this vital point
  readonly effects: readonly VitalPointEffect[];
  readonly techniques: readonly string[]; // IDs of techniques effective against this point
  readonly damage?: number; // Can be derived or specific override
  readonly baseStun?: number; // Base stun duration in ms
  // Add any other relevant properties from KoreanAnatomy.ts or KoreanVitalPoints.ts
}

// Body region data
export interface RegionData {
  readonly name: KoreanText;
  readonly subRegions?: readonly string[]; // Optional or ensure it's always present
  readonly vitalPoints: readonly VitalPoint[] | readonly string[]; // Allow string IDs or full VitalPoint objects
  readonly vulnerability: number;
  readonly pressure_points?: readonly string[]; // IDs of pressure points in this region
}

// Anatomical hit for combat system
export interface AnatomicalHit {
  readonly position: Position;
  readonly region: BodyRegion;
  readonly vitalPointsInRange: readonly VitalPoint[];
  readonly accuracy: number;
  readonly force: number;
}

// Vital point hit result
export interface VitalPointHitResult {
  readonly hit: boolean;
  readonly damage: number;
  readonly effects: readonly StatusEffect[];
  readonly vitalPointsHit: readonly VitalPoint[];
  readonly vitalPoint?: VitalPoint;
  readonly severity?: EnumVitalPointSeverity; // Use imported EnumVitalPointSeverity
  readonly criticalHit: boolean;
  readonly location: Position;
  readonly effectiveness: number;
  readonly statusEffectsApplied: readonly StatusEffect[];
  readonly painLevel: number;
  readonly consciousnessImpact: number;
}

// Korean anatomy system interface
export interface KoreanAnatomySystem {
  readonly getVitalPointsInRegion: (
    region: BodyRegion
  ) => readonly VitalPoint[];
  readonly calculateHitAccuracy: (
    targetPosition: Position,
    attackAccuracy: number
  ) => number;
  readonly getRegionByPosition: (position: Position) => BodyRegion | null;
  readonly getVitalPointById: (id: string) => VitalPoint | undefined;
}

// Ensure VitalPointSeverity is handled correctly, likely imported from enums.ts
// If it was defined here, it should be:
// export type VitalPointSeverity = "minor" | "moderate" | "severe" | "critical" | "lethal";
// But it's better in enums.ts

export type AnatomicalRegion =
  | "head"
  | "neck"
  | "torso_front"
  | "torso_back"
  | "left_arm_upper"
  | "left_arm_lower"
  | "left_hand"
  | "right_arm_upper"
  | "right_arm_lower"
  | "right_hand"
  | "left_leg_upper"
  | "left_leg_lower"
  | "left_foot"
  | "right_leg_upper"
  | "right_leg_lower"
  | "right_foot"
  | "joints"
  | "internal_organs";

export interface AnatomicalLocation {
  readonly x: number; // Relative X coordinate (0-1 or pixel based on context)
  readonly y: number; // Relative Y coordinate
  readonly z?: number; // Relative Z coordinate (depth)
  readonly region: AnatomicalRegion; // General region
  readonly specific_area?: string; // e.g., "Temporal", "Solar Plexus"
}

export interface BodyPart {
  readonly id: string;
  readonly name: KoreanText;
  readonly region: AnatomicalRegion;
  readonly subRegion?: string;
  readonly vitalPoints?: string[]; // IDs of vital points located here
  readonly health: number;
  readonly maxHealth: number;
  readonly armorValue?: number; // Optional armor/protection value
}

export interface AnatomyModel {
  readonly bodyParts: Record<string, BodyPart>;
  readonly overallHealth: number;
  readonly overallMaxHealth: number;
}

export type VitalPointCategory = EnumVitalPointCategory; // Alias to imported enum

export type VitalPointSeverity = EnumVitalPointSeverity; // Alias to imported enum
