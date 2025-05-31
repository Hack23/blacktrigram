// Base UI component exports for Korean martial arts game

import { KOREAN_COLORS, KOREAN_FONT_FAMILY } from "../../../types";

export {
  KoreanText,
  KoreanMartialText,
  KoreanTechniqueText,
  KoreanStatusText,
  KoreanTextUtils,
  validateKoreanText,
  KoreanTitle,
  type KoreanTextProps,
  type KoreanMartialTextProps,
  type KoreanTechniqueTextProps,
  type KoreanStatusTextProps,
  type KoreanTitleProps,
  type KoreanTextSize,
  type KoreanTextVariant,
  type KoreanTextEmphasis,
  type MartialVariant,
  type HonorLevel,
} from "./KoreanText";

export {
  BackgroundGrid,
  CyberpunkBackground,
  type BackgroundGridProps,
  type CyberpunkBackgroundProps,
} from "./BackgroundGrid";

export {
  PixiContainerComponent,
  PixiGraphicsComponent,
  PixiTextComponent,
} from "./PixiComponents";

// Re-export commonly used Korean martial arts constants
export {
  KOREAN_COLORS,
  KOREAN_FONT_FAMILY,
  TRIGRAM_DATA,
  TRIGRAM_STANCES_ORDER,
} from "../../../types";

// Utility type for Korean UI theming
export interface KoreanUITheme {
  readonly primaryColor: number;
  readonly accentColor: number;
  readonly backgroundColor: number;
  readonly textColor: number;
  readonly fontFamily: string;
}

// Default Korean martial arts theme
export const KOREAN_MARTIAL_THEME: KoreanUITheme = {
  primaryColor: KOREAN_COLORS.GOLD,
  accentColor: KOREAN_COLORS.CYAN,
  backgroundColor: KOREAN_COLORS.BLACK,
  textColor: KOREAN_COLORS.WHITE,
  fontFamily: KOREAN_FONT_FAMILY,
} as const;
