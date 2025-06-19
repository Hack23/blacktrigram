/**
 * Common utility types for Korean martial arts game
 */

// Position in 2D space
export interface Position {
  readonly x: number;
  readonly y: number;
}

// Size dimensions
export interface Size {
  readonly width: number;
  readonly height: number;
}

// Rectangle bounds
export interface Bounds extends Position, Size {}

/**
 * RGBA color specification
 */
export interface Color {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a?: number;
}

// Time duration in milliseconds
export type Duration = number;

// Percentage value (0-1)
export type Percentage = number;

// ID string
export type ID = string;

// Generic callback function
export type Callback<T = void> = () => T;

// Event handler
export type EventHandler<T = any> = (event: T) => void;

// Optional properties helper
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Required properties helper
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Deep readonly
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Korean text support
export interface KoreanText {
  readonly korean: string;
  readonly english: string;
  readonly romanized?: string;
}

// Base entity with Korean naming
export interface KoreanEntity {
  readonly id: ID;
  readonly name: KoreanText;
  readonly description?: KoreanText;
}

// Damage range
export interface DamageRange {
  readonly min: number;
  readonly max: number;
  readonly type?: import("./enums").DamageType;
  readonly average?: number;
}

// Status effect duration
export interface EffectDuration {
  readonly startTime: number;
  readonly endTime: number;
  readonly duration: number;
}

// Generic game entity
export interface GameEntity extends KoreanEntity {
  readonly position?: Position;
  readonly size?: Size;
  readonly active?: boolean;
  readonly visible?: boolean;
}

// Animation frame data
export interface AnimationFrame {
  readonly duration: Duration;
  readonly properties: Record<string, any>;
  readonly easing?: string;
}

// Transition data
export interface Transition {
  readonly from: string;
  readonly to: string;
  readonly duration: Duration;
  readonly easing?: string;
}

// Theme colors
export interface Theme {
  readonly primary: Color;
  readonly secondary: Color;
  readonly accent?: Color;
  readonly background?: Color;
  readonly text?: Color;
}

// Configuration object
export interface Config {
  readonly [key: string]: any;
}

// Result with success/error
export interface Result<T, E = Error> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: E;
  readonly message?: string;
}

// Validation result
export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings?: readonly string[];
}

export default {};
