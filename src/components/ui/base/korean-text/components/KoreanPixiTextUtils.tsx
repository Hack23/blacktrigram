import React from "react";
import { usePixiExtensions } from "../../../../../utils/pixiExtensions";
import type { KoreanText } from "../../../../../types/korean-text";
import { KOREAN_TEXT_CONSTANTS } from "../constants";
import * as PIXI from "pixi.js";

export const getKoreanTextMetrics = (text: string, style?: PIXI.TextStyle) => {
  const textStyle =
    style ||
    new PIXI.TextStyle({
      fontFamily: KOREAN_TEXT_CONSTANTS.FONT_FAMILIES.PRIMARY,
      fontSize: KOREAN_TEXT_CONSTANTS.FONT_SIZES.MEDIUM,
    });

  const tempText = new PIXI.Text(text, textStyle);
  return {
    width: tempText.width,
    height: tempText.height,
  };
};

export const KoreanPixiTextStyle = (
  options: Partial<PIXI.TextStyleOptions> = {}
) => {
  return new PIXI.TextStyle({
    fontFamily: KOREAN_TEXT_CONSTANTS.FONT_FAMILIES.PRIMARY,
    fontSize: KOREAN_TEXT_CONSTANTS.FONT_SIZES.MEDIUM,
    fill: KOREAN_TEXT_CONSTANTS.COLORS.PRIMARY as PIXI.ColorSource,
    ...options,
  });
};

export const createKoreanPixiTextWithFallback = (
  text: KoreanText,
  preferEnglish: boolean = false,
  style?: PIXI.TextStyle
): React.ReactElement => {
  usePixiExtensions();

  const displayText = preferEnglish ? text.english : text.korean;
  const defaultStyle = KoreanPixiTextStyle({
    fontSize: preferEnglish ? 14 : 16,
  });

  return <pixiText text={displayText} style={style || defaultStyle} />;
};

export const createKoreanPixiMultilineText = (
  text: KoreanText,
  maxWidth: number,
  style?: PIXI.TextStyle
): React.ReactElement => {
  usePixiExtensions();

  const textStyle =
    style ||
    KoreanPixiTextStyle({
      wordWrap: true,
      wordWrapWidth: maxWidth,
      lineHeight: KOREAN_TEXT_CONSTANTS.LAYOUT.LINE_HEIGHT_RATIO * 16,
    });

  return <pixiText text={text.korean} style={textStyle} />;
};

// Fix: Add proper default export
const KoreanPixiTextUtils = {
  getKoreanTextMetrics,
  KoreanPixiTextStyle,
  createKoreanPixiTextWithFallback,
  createKoreanPixiMultilineText,
};

export default KoreanPixiTextUtils;
      wordWrapWidth: maxWidth,
      lineHeight: KOREAN_TEXT_CONSTANTS.LAYOUT.LINE_HEIGHT_RATIO * 16,
    });

  return <pixiText text={text.korean} style={textStyle} />;
};

// Fix: Add proper default export
const KoreanPixiTextUtils = {
  createKoreanPixiText,
  getKoreanTextMetrics,
  KoreanPixiTextStyle,
  createKoreanPixiTextWithFallback,
  createKoreanPixiMultilineText,
};

export default KoreanPixiTextUtils;
