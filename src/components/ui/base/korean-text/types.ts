// This file should primarily re-export types from the main /src/types/korean-text.ts
// or define very local, component-specific sub-types if absolutely necessary.

import type { KoreanText, TrigramStance } from "../../../../types";
import type { ReactNode } from "react";

// Fix: Re-export KoreanText from main types
export type { KoreanText } from "../../../../types/korean-text";

// Add xsmall to KoreanTextSize
export type KoreanTextSize =
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "xxlarge"
  | "title";
export type KoreanTextWeight =
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "heavy";
export type KoreanTextEmphasis = "none" | "bold" | "italic" | "underline";
export type KoreanTextVariant = "primary" | "secondary" | "accent" | "combat";
export type KoreanTextDisplay = "korean" | "english" | "both";
export type KoreanTextOrder = "korean_first" | "english_first"; // Fix: Use underscore format

// Main component props interface
export interface KoreanTextComponentProps {
  readonly korean?: string;
  readonly english?: string;
  readonly text?: string | { korean?: string; english?: string };
  readonly size?: KoreanTextSize | number;
  readonly weight?: KoreanTextWeight;
  readonly variant?: KoreanTextVariant;
  readonly emphasis?: KoreanTextEmphasis;
  readonly display?: KoreanTextDisplay;
  readonly order?: KoreanTextOrder;
  readonly showBoth?: boolean; // Compatibility
  readonly koreanFirst?: boolean; // Compatibility
  readonly separator?: string;
  readonly cyberpunk?: boolean;
  readonly showUnderline?: boolean;
  readonly align?: "left" | "center" | "right";
  readonly color?: string | number;
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly onClick?: () => void;
  readonly id?: string;
  readonly children?: ReactNode;
}

// Configuration interface
export interface KoreanTextConfig {
  readonly variant: KoreanTextVariant;
  readonly size: KoreanTextSize;
  readonly weight: KoreanTextWeight;
  readonly order: KoreanTextOrder;
  readonly display?: KoreanTextDisplay; // Add optional display
  readonly cyberpunk: boolean;
  readonly showRomanization?: boolean; // Add optional showRomanization
}

// Technique text props
export interface KoreanTechniqueTextProps {
  readonly technique: {
    readonly stance: string;
    readonly koreanName: string;
    readonly englishName: string;
    readonly description?: {
      readonly korean: string;
      readonly english: string;
    };
  };
  readonly size?: KoreanTextSize | number;
  readonly weight?: KoreanTextWeight;
  readonly variant?: KoreanTextVariant;
  readonly emphasis?: KoreanTextEmphasis;
  readonly display?: KoreanTextDisplay;
  readonly order?: KoreanTextOrder;
  readonly showStance?: boolean;
  readonly showDescription?: boolean;
  readonly showEffects?: boolean;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

// Title props
export interface KoreanTitleProps {
  readonly korean: string;
  readonly english: string;
  readonly level?: 1 | 2 | 3 | 4 | 5 | 6;
  readonly variant?: KoreanTextVariant;
  readonly cyberpunk?: boolean;
  readonly glow?: boolean;
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly display?: KoreanTextDisplay;
  readonly order?: KoreanTextOrder;
  readonly centerAlign?: boolean;
}

// Legacy compatibility type
export type KoreanTextProps = KoreanTextComponentProps;

// Size mapping
export const KOREAN_TEXT_SIZES: Record<KoreanTextSize, number> = {
  xsmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
  xxlarge: 32,
  title: 48,
};

// Font family constant
export const KOREAN_FONT_FAMILY = "'Noto Sans KR', 'Malgun Gothic', sans-serif";

// Pixi-specific interfaces
export interface KoreanPixiTextProps {
  readonly text: KoreanText;
  readonly size?: KoreanTextSize;
  readonly weight?: KoreanTextWeight;
  readonly color?: number;
  readonly x?: number;
  readonly y?: number;
  readonly anchor?: number | { x: number; y: number };
  readonly showRomanization?: boolean;
  // Fix: Add missing properties
  readonly style?: any; // PIXI.TextStyle
  readonly visible?: boolean;
  readonly alpha?: number;
}

export interface KoreanTextStyle {
  readonly fontSize: number;
  readonly fontFamily: string;
  readonly fontWeight: number;
  readonly fill: number;
  readonly align?: "left" | "center" | "right";
  readonly lineHeight?: number;
}

export interface KoreanTextStyleConfig {
  readonly size: KoreanTextSize;
  readonly weight: KoreanTextWeight;
  readonly color: number;
  readonly variant?: KoreanTextVariant;
  readonly emphasis?: KoreanTextEmphasis;
}

export interface KoreanTextAnimation {
  readonly type: "fade" | "slide" | "scale" | "typewriter";
  readonly duration: number;
  readonly delay?: number;
  readonly easing?: string;
}

export interface KoreanPixiProgressTrackerProps {
  readonly progress: number;
  readonly maxProgress?: number;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
  readonly color?: number;
  readonly backgroundColor?: number;
  readonly showText?: boolean;
}

export interface KoreanPixiTrigramWheelProps {
  readonly currentStance: TrigramStance;
  readonly onStanceChange?: (stance: TrigramStance) => void; // Fix: Use TrigramStance
  readonly size?: number;
  readonly x?: number;
  readonly y?: number;
  readonly interactive?: boolean;
  readonly showLabels?: boolean; // Add missing property
}

export interface KoreanPixiHeaderProps {
  readonly title: KoreanText | string;
  readonly subtitle?: KoreanText | string;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly fontSize?: number;
  readonly textColor?: number;
  readonly accentColor?: number;
  readonly showUnderline?: boolean;
  readonly align?: "left" | "center" | "right";
}

export interface KoreanPixiButtonProps {
  readonly text: KoreanText | string;
  readonly onClick?: () => void;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly variant?: "primary" | "secondary" | "danger";
  readonly disabled?: boolean;
}

// Add missing utility interfaces
export interface KoreanTextStyleOptions {
  fontSize?: number;
  fill?: number;
  fontWeight?: string;
  align?: "left" | "center" | "right";
  stroke?: number;
  cyberpunk?: boolean;
}
