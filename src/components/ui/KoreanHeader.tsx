import React from "react";
import * as PIXI from "pixi.js";
import { usePixiExtensions } from "../../utils/pixiExtensions";
import { KOREAN_COLORS, FONT_FAMILY } from "../../types/constants";
import type { KoreanText } from "../../types/korean-text";

export interface KoreanHeaderProps {
  readonly title: KoreanText;
  readonly subtitle?: KoreanText;
  readonly size?: "small" | "medium" | "large";
  readonly alignment?: "left" | "center" | "right";
  readonly x?: number;
  readonly y?: number;
  readonly showUnderline?: boolean;
}

export const KoreanHeader: React.FC<KoreanHeaderProps> = ({
  title,
  subtitle,
  size = "medium",
  alignment = "center",
  x = 0,
  y = 0,
  showUnderline = true,
}) => {
  usePixiExtensions();

  const titleSize = size === "large" ? 32 : size === "medium" ? 24 : 18;
  const subtitleSize = titleSize * 0.7;

  const titleStyle = React.useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.KOREAN,
        fontSize: titleSize,
        fill: KOREAN_COLORS.ACCENT_GOLD,
        fontWeight: "bold",
        align: alignment,
      }),
    [titleSize, alignment]
  );

  const subtitleStyle = React.useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.KOREAN,
        fontSize: subtitleSize,
        fill: KOREAN_COLORS.TEXT_SECONDARY,
        align: alignment,
      }),
    [subtitleSize, alignment]
  );

  const anchorValue =
    alignment === "center" ? 0.5 : alignment === "right" ? 1 : 0;

  const drawUnderline = React.useCallback(
    (g: PIXI.Graphics) => {
      if (!showUnderline) return;

      g.clear();
      g.lineStyle(2, KOREAN_COLORS.ACCENT_GOLD, 0.8);
      g.moveTo(-50, 0);
      g.lineTo(50, 0);
    },
    [showUnderline]
  );

  return (
    <pixiContainer x={x} y={y} data-testid="korean-header">
      <pixiText text={title.korean} style={titleStyle} anchor={anchorValue} />

      <pixiText
        text={title.english}
        style={
          new PIXI.TextStyle({
            ...titleStyle,
            fontSize: titleSize * 0.6,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
          })
        }
        anchor={anchorValue}
        y={titleSize + 5}
      />

      {showUnderline && (
        <pixiGraphics draw={drawUnderline} y={titleSize + 15} />
      )}

      {subtitle && (
        <pixiText
          text={subtitle.korean}
          style={subtitleStyle}
          anchor={anchorValue}
          y={titleSize + 30}
        />
      )}
    </pixiContainer>
  );
};

export default KoreanHeader;
