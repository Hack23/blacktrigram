/**
 * Korean text system types for bilingual martial arts content
 */

// Core Korean text interface
export interface KoreanText {
  readonly korean: string;
  readonly english: string;
  readonly romanized?: string;
}

// Fix: Convert to proper enums
export enum KoreanTextSize {
  XSMALL = "xsmall",
  TINY = "tiny",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  XLARGE = "xlarge",
  HUGE = "huge",
  TITLE = "title",
}

export enum KoreanTextWeight {
  LIGHT = "light",
  NORMAL = "normal",
  REGULAR = "regular",
  MEDIUM = "medium",
  SEMIBOLD = "semibold",
  BOLD = "bold",
  HEAVY = "heavy",
}

// Fix: Add missing KoreanTextAlignment type
export type KoreanTextAlignment = "left" | "center" | "right";

// Korean text styles for different contexts
export interface KoreanTextStyle {
  readonly size: KoreanTextSize;
  readonly weight: KoreanTextWeight;
  readonly color: number;
  readonly alignment: KoreanTextAlignment;
}

// Fix: Add missing TrigramStance type
export type TrigramStance =
  | "geon"
  | "tae"
  | "li"
  | "jin"
  | "son"
  | "gam"
  | "gan"
  | "gon";

export default KoreanText;
