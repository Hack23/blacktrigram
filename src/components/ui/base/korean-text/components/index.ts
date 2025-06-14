/**
 * Korean text components export
 */

// Main components
export { KoreanMartialText } from "./KoreanMartialText";
export { KoreanStatusText } from "./KoreanStatusText";
export { KoreanTechniqueText } from "./KoreanTechniqueText";
export { KoreanText } from "./KoreanText";
export { KoreanTitle } from "./KoreanTitle";

// Fix: Export functions from the utils file instead since KoreanPixiTextUtils.tsx doesn't have all exports
export {
  createKoreanPixiText,
  getKoreanTextMetrics,
  formatKoreanText,
  sizeToPixelValue,
} from "../utils";

// Fix: For PIXI-specific utilities, we'll create simple wrapper functions
export const createKoreanPixiTextWithFallback = (
  text: import("../../../../../types/korean-text").KoreanText,
  preferEnglish: boolean = false
): string => {
  return preferEnglish ? text.english : text.korean;
};

export const createKoreanPixiMultilineText = (
  text: import("../../../../../types/korean-text").KoreanText
): string => {
  return `${text.korean}\n${text.english}`;
};

// Fix: Export PIXI TextStyle creator function instead of type
export const KoreanPixiTextStyle = (options: any = {}) => {
  const PIXI = require("pixi.js");
  return new PIXI.TextStyle({
    fontFamily: '"Noto Sans KR", "Malgun Gothic", Arial, sans-serif',
    fontSize: 16,
    fill: 0xffffff,
    ...options,
  });
};

// Re-export main KoreanText component
export { default as KoreanTextComponent } from "../KoreanText";
