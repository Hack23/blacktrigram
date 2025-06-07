// Common shared types for Black Trigram Korean martial arts game

import { StatusEffect } from "./effects";
import type {
  DamageType,
  EffectIntensity,
  EffectType as EnumEffectType, // Renamed to avoid conflict with local EffectType if any
} from "./enums";
import type { KoreanText } from "./korean-text"; // Ensure KoreanText is imported

// Basic shared types
export interface Position {
  readonly x: number; // Made readonly
  readonly y: number; // Made readonly
}

export interface Dimensions {
  readonly width: number;
  readonly height: number;
}

export interface BoundingBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface Vector2D {
  // Ensure this is consistently defined or imported if defined elsewhere
  readonly x: number;
  readonly y: number;
}

export interface Range {
  readonly min: number;
  readonly max: number;
}

export interface TimeRange {
  readonly start: number;
  readonly end: number;
  readonly duration: number;
}

export interface KoreanMartialArtsMetadata {
  readonly culturalAccuracy: number; // 0-1 scale
  readonly traditionalBasis: string;
  readonly modernAdaptation: string;
  readonly philosophicalDepth: number; // 1-5 scale
}

export type Direction = "left" | "right" | "up" | "down";
export type Facing = "left" | "right";

// Fix: Remove duplicate Timestamp declarations - keep only one
export type Timestamp = number;

// Add missing exports for systems.ts
export interface Velocity {
  readonly x: number;
  readonly y: number;
}

export type EntityId = string;

export interface BilingualIdentifier {
  readonly korean: string;
  readonly english: string;
  readonly romanized?: string;
}

// Damage range specification (Canonical definition)
export interface DamageRange {
  readonly min: number;
  readonly max: number;
  readonly type?: DamageType; // Optional: specific damage type for this range
}

// Combat condition for status effects
export interface CombatCondition {
  readonly id: string;
  readonly name: KoreanText; // Use imported KoreanText
  readonly type: EnumEffectType; // Use EnumEffectType from enums
  readonly intensity: EffectIntensity;
  readonly duration: number; // Duration in game ticks or seconds
  readonly source?: string; // E.g., technique ID, environmental effect
  readonly description?: KoreanText; // Changed to KoreanText | undefined
  readonly severity: "light" | "moderate" | "severe" | "critical"; // Added severity
  readonly effects: ReadonlyArray<StatusEffect>; // Added effects, StatusEffect will be from ./effects
}

// Common types used throughout BlackTrigram

// Position interface for 2D coordinates - single declaration
// Removed duplicate Position

// Color value type for UI elements
export type ColorValue = number | string;

// Korean text bilingual interface - define locally to avoid conflicts
// Removed local KoreanTextType, use imported KoreanText

// Status effect interface - define intensity locally
// Removed local StatusEffect, use imported StatusEffect from ./effects

// Combat condition interface for player state effects
// Merged with the definition above

// Base interfaces
export interface Identifiable {
  readonly id: string;
}

export interface Timestamped {
  readonly timestamp: number;
}

export interface Size {
  readonly width: number;
  readonly height: number;
}

export interface Rectangle extends Position, Size {}

// Removed duplicate Vector2D definition, ensure it's defined once (e.g., above)

// Export the local KoreanText type
// export type { KoreanTextType as KoreanText }; // Removed, use imported KoreanText

// Remove createPlayerState - it should be in utils/playerUtils.ts
// Keep only common shared types here

// Re-export StatusEffect from effects.ts for convenience if needed by other files that import from common.ts
export type { StatusEffect } from "./effects";
