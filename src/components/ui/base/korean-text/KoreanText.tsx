import React from "react";
import { usePixiExtensions } from "../../../../utils/pixiExtensions";
import type { KoreanPixiTextProps } from "./types";
import { KOREAN_TEXT_CONSTANTS } from "./constants";
import * as PIXI from "pixi.js";

export const KoreanText: React.FC<KoreanPixiTextProps> = ({
  text,
  x = 0,
  y = 0,
  anchor = 0,
  style,
  visible = true,
  alpha = 1,
}) => {
  usePixiExtensions();

  const defaultStyle = new PIXI.TextStyle({
    fontFamily: KOREAN_TEXT_CONSTANTS.FONT_FAMILIES.PRIMARY,
    fontSize: KOREAN_TEXT_CONSTANTS.FONT_SIZES.MEDIUM,
    fill: KOREAN_TEXT_CONSTANTS.COLORS.PRIMARY,
    align: "left",
  });

  const finalStyle = style || defaultStyle;

  return (
    <pixiContainer x={x} y={y} visible={visible} alpha={alpha}>
      {/* Korean text */}
      <pixiText text={text.korean} style={finalStyle} anchor={anchor} y={0} />

      {/* English text (if provided) */}
      {text.english && (
        <pixiText
          text={text.english}
          style={
            new PIXI.TextStyle({
              ...finalStyle,
              fontSize:
                (finalStyle.fontSize as number) *
                KOREAN_TEXT_CONSTANTS.LAYOUT.KOREAN_ENGLISH_RATIO,
              fill: KOREAN_TEXT_CONSTANTS.COLORS.SECONDARY,
            })
          }
          anchor={anchor}
          y={(finalStyle.fontSize as number) + 4}
        />
      )}
    </pixiContainer>
  );
};

export default KoreanText;
