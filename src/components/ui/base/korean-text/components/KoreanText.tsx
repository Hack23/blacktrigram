import React from "react";
import * as PIXI from "pixi.js";
import { usePixiExtensions } from "../../../../../utils/pixiExtensions";
import { createKoreanTextStyle, getDisplayText } from "./KoreanPixiTextUtils";
// Fix: Import type from separate file to avoid naming conflict
import type { KoreanText as KoreanTextType } from "../../../../../types/korean-text";

export interface KoreanTextProps {
  readonly text: KoreanTextType;
  readonly showRomanization?: boolean;
  readonly style?: PIXI.TextStyle;
  readonly x?: number;
  readonly y?: number;
  readonly anchor?: number | { x: number; y: number };
}

// Fix: Rename component to avoid conflict with type
export const KoreanPixiTextComponent: React.FC<KoreanTextProps> = ({
  text,
  showRomanization = false,
  style,
  x = 0,
  y = 0,
  anchor = 0,
}) => {
  usePixiExtensions();

  const displayText = getDisplayText(text, showRomanization);
  const textStyle = style || createKoreanTextStyle(); // Fix: Now has default parameter

  return (
    <pixiText
      text={displayText}
      style={textStyle}
      x={x}
      y={y}
      anchor={anchor}
    />
  );
};

// Export with original name for compatibility
export const KoreanText = KoreanPixiTextComponent;
export default KoreanText;
