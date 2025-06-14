/**
 * Korean text component exports for Black Trigram martial arts game
 */

// Main Korean text system exports
export { default as KoreanText } from "./KoreanText";
export { KOREAN_TEXT_CONSTANTS } from "./constants";
export { useKoreanTextStyle } from "./hooks/useKoreanTextStyle";
export {
  createKoreanPixiText,
  getKoreanTextMetrics,
  formatKoreanText,
} from "./utils";

// Component exports
export { KoreanMartialText } from "./components/KoreanMartialText";
export { KoreanStatusText } from "./components/KoreanStatusText";
export { KoreanTechniqueText } from "./components/KoreanTechniqueText";
export { KoreanText as KoreanTextComponent } from "./components/KoreanText";
export { KoreanTitle } from "./components/KoreanTitle";

// Type exports
export type {
  KoreanPixiTextProps,
  KoreanTextStyle,
  KoreanTextStyleConfig,
} from "./types";
