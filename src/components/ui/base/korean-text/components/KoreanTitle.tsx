import React from "react";
import * as PIXI from "pixi.js";
import { usePixiExtensions } from "../../../../../utils/pixiExtensions";
import { KOREAN_COLORS } from "../../../../../types/constants";
import type { KoreanText } from "../../../../../types/korean-text";

export interface KoreanTitleProps {
  readonly title: KoreanText;
  readonly subtitle?: KoreanText;
  readonly size?: "small" | "medium" | "large";
  readonly alignment?: "left" | "center" | "right";
  readonly x?: number;
  readonly y?: number;
}

export const KoreanTitle: React.FC<KoreanTitleProps> = ({
  title,
  subtitle,
  size = "medium",
  alignment = "center",
  x = 0,
  y = 0,
}) => {
  usePixiExtensions();

  const titleSize = size === "large" ? 36 : size === "medium" ? 28 : 20;
  const subtitleSize = titleSize * 0.6;

  const titleStyle = new PIXI.TextStyle({
    fontSize: titleSize,
    fill: KOREAN_COLORS.ACCENT_GOLD,
    fontWeight: "bold",
    align: alignment,
  });

  const subtitleStyle = new PIXI.TextStyle({
    fontSize: subtitleSize,
    fill: KOREAN_COLORS.TEXT_SECONDARY,
    align: alignment,
  });

  return (
    <pixiContainer x={x} y={y}>
      <pixiText
        text={title.korean}
        style={titleStyle}
        anchor={alignment === "center" ? 0.5 : alignment === "right" ? 1 : 0}
      />
      {subtitle && (
        <pixiText
          text={subtitle.korean}
          style={subtitleStyle}
          y={titleSize + 10}
          anchor={alignment === "center" ? 0.5 : alignment === "right" ? 1 : 0}
        />
      )}
    </pixiContainer>
  );
};

export default KoreanTitle;
