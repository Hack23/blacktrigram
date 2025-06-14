import React from "react";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import type { KoreanHeaderProps } from "../../../types/components";
import { KOREAN_COLORS } from "../../../types/constants";

export const KoreanHeader: React.FC<KoreanHeaderProps> = ({
  title,
  subtitle,
  size = "medium",
  alignment = "center",
  x = 0,
  y = 0,
  width = 400,
  height = 80,
}) => {
  usePixiExtensions();

  const getSizeConfig = () => {
    const configs = {
      small: { titleSize: 18, subtitleSize: 12, spacing: 25 },
      medium: { titleSize: 24, subtitleSize: 16, spacing: 35 },
      large: { titleSize: 32, subtitleSize: 20, spacing: 45 },
    };
    return configs[size];
  };

  const config = getSizeConfig();
  const alignmentAnchor =
    alignment === "center" ? 0.5 : alignment === "right" ? 1 : 0;
  const textX =
    alignment === "center" ? width / 2 : alignment === "right" ? width : 0;

  return (
    <pixiContainer x={x} y={y} data-testid="korean-header">
      {/* Title */}
      <pixiText
        text={title.korean}
        style={{
          fontSize: config.titleSize,
          fill: KOREAN_COLORS.ACCENT_GOLD,
          fontWeight: "bold",
          align: alignment,
        }}
        x={textX}
        y={0}
        anchor={{ x: alignmentAnchor, y: 0 }}
      />

      <pixiText
        text={title.english}
        style={{
          fontSize: config.titleSize * 0.8,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
          align: alignment,
        }}
        x={textX}
        y={config.titleSize + 5}
        anchor={{ x: alignmentAnchor, y: 0 }}
      />

      {/* Subtitle */}
      {subtitle && (
        <>
          <pixiText
            text={subtitle.korean}
            style={{
              fontSize: config.subtitleSize,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              align: alignment,
            }}
            x={textX}
            y={config.spacing + 10}
            anchor={{ x: alignmentAnchor, y: 0 }}
          />

          <pixiText
            text={subtitle.english}
            style={{
              fontSize: config.subtitleSize * 0.9,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
              align: alignment,
            }}
            x={textX}
            y={config.spacing + 10 + config.subtitleSize + 3}
            anchor={{ x: alignmentAnchor, y: 0 }}
          />
        </>
      )}

      {/* Decorative underline */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.lineStyle(2, KOREAN_COLORS.ACCENT_GOLD, 0.7);
          const lineY = height - 10;
          const lineWidth = width * 0.6;
          const lineX = alignment === "center" ? (width - lineWidth) / 2 : 0;
          g.moveTo(lineX, lineY);
          g.lineTo(lineX + lineWidth, lineY);
        }}
      />
    </pixiContainer>
  );
};

export default KoreanHeader;
