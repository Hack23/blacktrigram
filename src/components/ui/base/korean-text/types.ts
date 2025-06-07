// This file should primarily re-export types from the main /src/types/korean-text.ts
// or define very local, component-specific sub-types if absolutely necessary.

import type { TextStyle as PixiTextStyle, Point as PixiPoint } from "pixi.js"; // Correctly import PIXI types
import type {
  KoreanText as BaseKoreanText,
  ColorValue,
} from "../../../../types/korean-text"; // Assuming this is the intended import for base types

// Base Korean text interface (re-export or ensure it's the primary definition)
export type { BaseKoreanText, ColorValue };

export interface KoreanTextConfig {
  readonly primary: string;
  readonly fallback: string;
  readonly size: number;
  readonly weight: number;
  readonly color: number;
}

export interface KoreanPixiTextProps {
  text: string | BaseKoreanText; // Use BaseKoreanText
  style?: Partial<PixiTextStyle>; // Use imported PixiTextStyle
  anchor?: [number, number] | number | PixiPoint; // Use imported PixiPoint
  position?: [number, number] | PixiPoint; // Use imported PixiPoint
  [key: string]: any;
}

// Korean text display utilities
export interface KoreanTextStyleInternal extends Partial<PixiTextStyle> {
  // Use imported PixiTextStyle
  // This interface seems to be for internal PIXI text styling.
  // Properties here should align with PIXI.TextStyle options.
}

// Korean martial arts specific text types
export interface KoreanMartialText extends BaseKoreanText {
  // Use BaseKoreanText
  readonly technique?: string;
  readonly stance?: string;
  readonly philosophy?: string;
}

export interface KoreanArchetypeText extends BaseKoreanText {
  // Use BaseKoreanText
  readonly description: BaseKoreanText; // Use BaseKoreanText
  readonly philosophy: BaseKoreanText; // Use BaseKoreanText
  readonly specialization?: string;
}

// ... existing code ...
// (KOREAN_TEXT_SIZES, KoreanFontWeight, KoreanTextVariant, etc. remain the same)
// Ensure all KoreanText related props use BaseKoreanText or string where appropriate

export type KoreanTextSize =
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "xxlarge"
  | "title";
export const KOREAN_TEXT_SIZES: Record<KoreanTextSize, number> = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  title: 48,
};

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

export type KoreanTextVariant =
  | "body"
  | "title"
  | "technique"
  | "status"
  | "martial";

export type KoreanTextEmphasis =
  | "none"
  | "bold"
  | "italic"
  | "underline"
  | "glow"
  | "shadow"
  | "outline";

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

export type MartialVariant = "practitioner" | "master" | "grandmaster";
export type HonorLevel = "student" | "instructor" | "master";
export type FontWeight = KoreanFontWeight;

export interface KoreanTextProps {
  readonly korean: string | BaseKoreanText; // Use BaseKoreanText
  readonly english?: string;
  readonly size?: KoreanTextSize | number;
  readonly weight?: KoreanFontWeight;
  readonly color?: number | string;
  readonly variant?: KoreanTextVariant;
  readonly emphasis?: KoreanTextEmphasis;
  readonly align?: "left" | "center" | "right";
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

export interface KoreanTextHeaderProps extends KoreanTextProps {
  readonly korean: string; // Keep as string if it's just the header text
  readonly english?: string;
  readonly subtitle?: string;
  readonly level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export type KoreanTitleProps = KoreanTextHeaderProps;

export interface KoreanTechniqueTextProps extends KoreanTextProps {
  readonly korean: string | BaseKoreanText; // Use BaseKoreanText
  readonly english?: string;
  readonly koreanName?: string;
  readonly englishName?: string;
  readonly trigram?: import("../../../../types").TrigramStance; // Use full import if TrigramStance is not in scope
  readonly showStanceSymbol?: boolean;
  readonly damage?: number | string;
  readonly mastered?: boolean;
}

export interface KoreanStatusTextProps extends KoreanTextProps {
  readonly korean: string | BaseKoreanText; // Use BaseKoreanText
  readonly statusKey: StatusKey;
  readonly value: number;
  readonly maxValue: number;
  readonly showPercentage?: boolean;
  readonly criticalThreshold?: number;
  readonly warningThreshold?: number;
}

export interface KoreanMartialTextProps extends KoreanTextProps {
  readonly korean: string | BaseKoreanText; // Use BaseKoreanText
  readonly english?: string;
  readonly martialVariant: MartialVariant;
  readonly honorLevel?: HonorLevel;
  readonly showHonorific?: boolean;
  readonly rank?: HonorLevel;
}

export interface KoreanPixiTextConfig extends Partial<PixiTextStyle> {
  // Use imported PixiTextStyle
  // This seems to be the main PIXI text style config.
}

export const KOREAN_FONT_FAMILY = "Noto Sans KR, Arial, sans-serif";
export const KOREAN_FONT_SIZES = KOREAN_TEXT_SIZES;

export const KOREAN_TEXT_ALIGNMENT = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;

export const KOREAN_TEXT_WEIGHTS: Record<
  Extract<KoreanFontWeight, number | "regular" | "semibold" | "bold">,
  number
> & { light: number; medium: number; heavy: number } = {
  // Ensure all keys are covered
  light: 300,
  regular: 400,
  medium: 500, // Added medium
  semibold: 600,
  bold: 700,
  heavy: 900,
  300: 300,
  400: 400,
  500: 500,
  600: 600,
  700: 700,
  900: 900,
};

export const KOREAN_TEXT_STYLES = {
  NORMAL: "normal",
  ITALIC: "italic",
} as const;
