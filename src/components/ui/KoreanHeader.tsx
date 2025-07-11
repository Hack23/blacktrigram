import * as PIXI from "pixi.js";
import React from "react";
import type { KoreanText } from "../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
import { usePixiExtensions } from "../../utils/pixiExtensions";

export interface KoreanHeaderProps {
  readonly title: KoreanText;
  readonly subtitle?: KoreanText;
  readonly size?: "small" | "medium" | "large";
  readonly alignment?: "left" | "center" | "right";
  readonly x?: number;
  readonly y?: number;
  readonly showUnderline?: boolean;
  readonly animated?: boolean;
  readonly glowIntensity?: number;
}

export const KoreanHeader: React.FC<KoreanHeaderProps> = ({
  title,
  subtitle,
  size = "medium",
  alignment = "center",
  x = 0,
  y = 0,
  showUnderline = true,
  animated = true,
  glowIntensity = 1.0,
}) => {
  usePixiExtensions();

  const titleSize = size === "large" ? 32 : size === "medium" ? 24 : 18;
  const subtitleSize = titleSize * 0.7;
  const currentTime = animated ? Date.now() : 0;

  const titleStyle = React.useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.KOREAN,
        fontSize: titleSize,
        fill: KOREAN_COLORS.ACCENT_GOLD,
        fontWeight: "bold",
        align: alignment,
        // Enhanced drop shadow for cyberpunk effect
        dropShadow: {
          color: KOREAN_COLORS.ACCENT_GOLD,
          distance: 3 + (animated ? Math.sin(currentTime * 0.002) * 1 : 0),
          alpha: 0.6 * glowIntensity,
          blur: 4,
        },
        // Subtle stroke for definition
        stroke: {
          color: KOREAN_COLORS.UI_BACKGROUND_DARK,
          width: 1,
        },
      }),
    [titleSize, alignment, animated, currentTime, glowIntensity]
  );

  const englishStyle = React.useMemo(
    () =>
      new PIXI.TextStyle({
        ...titleStyle,
        fontSize: titleSize * 0.6,
        fill: KOREAN_COLORS.TEXT_TERTIARY,
        fontWeight: "normal",
        fontStyle: "italic",
        dropShadow: {
          color: KOREAN_COLORS.PRIMARY_CYAN,
          distance: 2,
          alpha: 0.4 * glowIntensity,
          blur: 2,
        },
      }),
    [titleStyle, titleSize, glowIntensity]
  );

  const subtitleStyle = React.useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.KOREAN,
        fontSize: subtitleSize,
        fill: KOREAN_COLORS.TEXT_SECONDARY,
        align: alignment,
        dropShadow: {
          color: KOREAN_COLORS.TEXT_SECONDARY,
          distance: 1,
          alpha: 0.3 * glowIntensity,
          blur: 1,
        },
      }),
    [subtitleSize, alignment, glowIntensity]
  );

  const anchorValue =
    alignment === "center" ? 0.5 : alignment === "right" ? 1 : 0;

  // Enhanced underline with Korean traditional patterns and cyberpunk elements
  const drawEnhancedUnderline = React.useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      const underlineWidth = titleSize * 6; // Dynamic width based on title size
      const centerX = underlineWidth / 2;
      const time = animated ? currentTime * 0.001 : 0;

      // Traditional Korean knot pattern (매듭) inspired base
      const knotHeight = 12;
      const knotY = 5;

      // Main golden underline with traditional Korean curve
      g.stroke({
        width: 3,
        color: KOREAN_COLORS.ACCENT_GOLD,
        alpha: 0.8 + (animated ? Math.sin(time * 2) * 0.2 : 0),
      });

      // Korean traditional "S" curve (태극 inspired)
      g.moveTo(0, knotY);
      g.bezierCurveTo(
        underlineWidth * 0.25,
        knotY - knotHeight * 0.5,
        underlineWidth * 0.75,
        knotY + knotHeight * 0.5,
        underlineWidth,
        knotY
      );
      g.stroke();

      // Secondary cyan accent line
      g.stroke({
        width: 1.5,
        color: KOREAN_COLORS.PRIMARY_CYAN,
        alpha: 0.6 + (animated ? Math.sin(time * 3 + Math.PI / 2) * 0.3 : 0),
      });
      g.moveTo(underlineWidth * 0.1, knotY + 3);
      g.bezierCurveTo(
        underlineWidth * 0.3,
        knotY + 3 - knotHeight * 0.3,
        underlineWidth * 0.7,
        knotY + 3 + knotHeight * 0.3,
        underlineWidth * 0.9,
        knotY + 3
      );
      g.stroke();

      // Trigram symbol accents at ends
      const trigramSize = 8;
      const trigramAlpha = 0.4 + (animated ? Math.sin(time * 1.5) * 0.2 : 0);

      // Left trigram (☰ - Heaven)
      g.stroke({
        width: 2,
        color: KOREAN_COLORS.ACCENT_GOLD,
        alpha: trigramAlpha,
      });
      for (let i = 0; i < 3; i++) {
        const lineY = knotY + 15 + i * 3;
        g.moveTo(-trigramSize, lineY);
        g.lineTo(-2, lineY);
      }
      g.stroke();

      // Right trigram (☷ - Earth)
      g.stroke({
        width: 2,
        color: KOREAN_COLORS.PRIMARY_CYAN,
        alpha: trigramAlpha,
      });
      for (let i = 0; i < 3; i++) {
        const lineY = knotY + 15 + i * 3;
        // Broken lines for Earth trigram
        g.moveTo(underlineWidth + 2, lineY);
        g.lineTo(underlineWidth + trigramSize * 0.4, lineY);
        g.moveTo(underlineWidth + trigramSize * 0.6, lineY);
        g.lineTo(underlineWidth + trigramSize, lineY);
      }
      g.stroke();

      // Central energy orb
      const orbRadius = 6 + (animated ? Math.sin(time * 4) * 2 : 0);
      const orbAlpha = 0.3 + (animated ? Math.sin(time * 2.5) * 0.2 : 0);

      // Outer glow
      g.fill({
        color: KOREAN_COLORS.ACCENT_CYAN,
        alpha: orbAlpha * 0.3,
      });
      g.circle(centerX, knotY + 6, orbRadius + 4);
      g.fill();

      // Inner core
      g.fill({
        color: KOREAN_COLORS.ACCENT_GOLD,
        alpha: orbAlpha,
      });
      g.circle(centerX, knotY + 6, orbRadius);
      g.fill();

      // Energy particles (if animated)
      if (animated) {
        for (let i = 0; i < 5; i++) {
          const particleAngle = time * 2 + (i * Math.PI * 2) / 5;
          const particleDistance = 15 + Math.sin(time * 3 + i) * 5;
          const particleX =
            centerX + Math.cos(particleAngle) * particleDistance;
          const particleY =
            knotY + 6 + Math.sin(particleAngle) * particleDistance;

          g.fill({
            color:
              i % 2 === 0
                ? KOREAN_COLORS.ACCENT_GOLD
                : KOREAN_COLORS.PRIMARY_CYAN,
            alpha: 0.6 + Math.sin(time * 4 + i) * 0.3,
          });
          g.circle(particleX, particleY, 1.5);
          g.fill();
        }
      }
    },
    [titleSize, animated, currentTime]
  );

  return (
    <pixiContainer x={x} y={y} data-testid="korean-header">
      {/* Main Korean title with enhanced glow */}
      <pixiText
        text={title.korean}
        style={titleStyle}
        anchor={anchorValue}
        scale={
          animated
            ? {
                x: 1 + Math.sin(currentTime * 0.001) * 0.02,
                y: 1 + Math.sin(currentTime * 0.001) * 0.02,
              }
            : { x: 1, y: 1 }
        }
      />

      {/* English subtitle with offset */}
      <pixiText
        text={title.english}
        style={englishStyle}
        anchor={anchorValue}
        y={titleSize + 5}
        alpha={0.9}
      />

      {/* Enhanced Korean traditional + cyberpunk underline */}
      {showUnderline && (
        <pixiGraphics
          draw={drawEnhancedUnderline}
          y={titleSize + 15}
          x={
            anchorValue === 0.5
              ? -titleSize * 3
              : anchorValue === 1
              ? -titleSize * 6
              : 0
          }
        />
      )}

      {/* Subtitle section with traditional spacing */}
      {subtitle && (
        <>
          <pixiText
            text={subtitle.korean}
            style={subtitleStyle}
            anchor={anchorValue}
            y={titleSize + 55}
          />
          <pixiText
            text={subtitle.english}
            style={{
              ...subtitleStyle,
              fontSize: subtitleSize * 0.8,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
              fontStyle: "italic",
            }}
            anchor={anchorValue}
            y={titleSize + 55 + subtitleSize + 5}
          />
        </>
      )}
    </pixiContainer>
  );
};

export default KoreanHeader;
