// Korean text system types for Black Trigram

import type { TrigramStance } from "./enums";

// Base Korean text interface
export interface KoreanText {
  readonly korean: string;
  readonly english: string;
  readonly romanized?: string;
}

export interface KoreanTextConfig {
  readonly primary: string;
  readonly fallback: string;
  readonly size: number;
  readonly weight: number;
  readonly color: number;
}

export interface KoreanPixiTextProps {
  text: string | KoreanText;
  style?: any;
  anchor?: [number, number] | number;
  position?: [number, number];
  [key: string]: any;
}

// Korean text display utilities
export interface KoreanTextStyle {
  readonly fontFamily: string;
  readonly fontSize: number;
  readonly fill: number;
  readonly align?: string;
  readonly fontWeight?: string | number;
  readonly dropShadow?: boolean;
  readonly dropShadowColor?: number;
  readonly dropShadowBlur?: number;
  readonly fontStyle?: string;
  readonly letterSpacing?: number;
  readonly wordWrap?: boolean;
  readonly wordWrapWidth?: number;
  readonly alpha?: number;
}

// Korean martial arts specific text types
export interface KoreanMartialText extends KoreanText {
  readonly technique?: string;
  readonly stance?: string;
  readonly philosophy?: string;
}

export interface KoreanArchetypeText extends KoreanText {
  readonly description: KoreanText;
  readonly philosophy: KoreanText;
  readonly specialization?: string;
}

// Korean text size type
export type KoreanTextSize =
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "xxlarge" // Added
  | "title"; // Added title to match KOREAN_TEXT_SIZES in constants/typography.ts and constants.ts
export const KOREAN_TEXT_SIZES: Record<KoreanTextSize, number> = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  title: 48,
};

// Korean font weight type
export type KoreanFontWeight =
  | 300
  | 400
  | 500
  | 600
  | 700
  | 900
  | "regular"
  | "semibold"
  | "bold";

// Korean text variant
export type KoreanTextVariant =
  | "body"
  | "title"
  | "technique"
  | "status"
  | "martial";

// Korean text emphasis
export type KoreanTextEmphasis =
  | "none"
  | "bold"
  | "italic"
  | "underline"
  | "glow"
  | "shadow"
  | "outline";

// Status key type for Korean status translations
export type StatusKey =
  | "health"
  | "ki"
  | "stamina"
  | "consciousness"
  | "pain"
  | "balance"
  | "health_critical"
  | "stamina_low"
  | "ki_depleted"
  | "stunned"
  | "bleeding"
  | "poisoned"
  | "burning"
  | "frozen"
  | "slowed"
  | "hastened"
  | "guard_break"
  | "counter_hit"
  | "vulnerable"
  | "ready"
  | "active"
  | "inactive"
  | "success"
  | "failure"
  | "warning"
  | "info";

// Martial variant type
export type MartialVariant = "practitioner" | "master" | "grandmaster";
export type HonorLevel = "student" | "instructor" | "master";

// Font weight type alias
export type FontWeight = KoreanFontWeight;

// Color value type (re-export from common)
export type ColorValue = number;

// Base Korean text props
export interface KoreanTextProps {
  readonly korean: string | KoreanText;
  readonly english?: string;
  readonly size?: KoreanTextSize | number;
  readonly weight?: KoreanFontWeight;
  readonly color?: number | string; // Allow both number and string for compatibility
  readonly variant?: KoreanTextVariant;
  readonly emphasis?: KoreanTextEmphasis;
  readonly align?: "left" | "center" | "right";
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

// Korean title props
export interface KoreanTextHeaderProps extends KoreanTextProps {
  readonly korean: string;
  readonly english?: string;
  readonly subtitle?: string;
  readonly level?: 1 | 2 | 3 | 4 | 5 | 6;
}

// Korean title props alias
export type KoreanTitleProps = KoreanTextHeaderProps;

// Korean technique text props
export interface KoreanTechniqueTextProps extends KoreanTextProps {
  readonly korean: string | KoreanText;
  readonly english?: string;
  readonly koreanName?: string;
  readonly englishName?: string;
  readonly trigram?: TrigramStance;
  readonly showStanceSymbol?: boolean;
  readonly damage?: number | string;
  readonly mastered?: boolean;
}

// Korean status text props
export interface KoreanStatusTextProps extends KoreanTextProps {
  readonly korean: string | KoreanText;
  readonly statusKey: StatusKey;
  readonly value: number;
  readonly maxValue: number;
  readonly showPercentage?: boolean;
  readonly criticalThreshold?: number;
  readonly warningThreshold?: number;
}

// Korean martial text props
export interface KoreanMartialTextProps extends KoreanTextProps {
  readonly korean: string | KoreanText;
  readonly english?: string;
  readonly martialVariant: MartialVariant;
  readonly honorLevel?: HonorLevel;
  readonly showHonorific?: boolean;
  readonly rank?: HonorLevel;
}

// PIXI text style configuration
export interface PixiTextStyleConfig {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  fill?: number | string;
  align?: string;
  letterSpacing?: number;
  lineHeight?: number;
  dropShadow?: boolean;
  dropShadowColor?: number | string;
  dropShadowBlur?: number;
  dropShadowAngle?: number;
  dropShadowDistance?: number;
  dropShadowAlpha?: number;
  stroke?: number | string;
  strokeThickness?: number;
  wordWrap?: boolean;
  wordWrapWidth?: number;
}

// For PIXI text config in UI
export type KoreanPixiTextConfig = PixiTextStyleConfig;

// Fix font family to be a string, not object
export const KOREAN_FONT_FAMILY = "Noto Sans KR, Arial, sans-serif"; // Standardized

// Export the font sizes with proper name
export const KOREAN_FONT_SIZES = KOREAN_TEXT_SIZES;

// Text formatting constants
export const KOREAN_TEXT_ALIGNMENT = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;

export const KOREAN_TEXT_WEIGHTS = {
  LIGHT: 300,
  REGULAR: 400,
  MEDIUM: 500,
  BOLD: 700,
  HEAVY: 900,
} as const;

export const KOREAN_TEXT_STYLES = {
  NORMAL: "normal",
  ITALIC: "italic",
} as const;
