import React, { useMemo, useState, useCallback } from "react"; // Added useCallback
import { Container, Graphics, Text } from "@pixi/react";
import type { TrigramWheelProps } from "../../types"; // Removed unused TrigramStance
import {
  TRIGRAM_STANCES_ORDER,
  TRIGRAM_DATA,
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../../types/constants";
import * as PIXI from "pixi.js";

const getTrigramColorFromTheme = (
  stanceId: keyof typeof TRIGRAM_DATA,
  colorType: "primary" | "secondary" | "glow" | "text" = "primary",
  defaultColor: number = KOREAN_COLORS.UI_STEEL_GRAY // Changed default to number
): number => {
  const theme = TRIGRAM_DATA[stanceId]?.theme;
  if (theme) {
    return (theme[colorType] as number) || defaultColor; // Cast theme color to number
  }
  return defaultColor;
};

export const TrigramWheel: React.FC<TrigramWheelProps> = ({
  currentStance,
  onStanceSelect,
  selectedStance: propSelectedStance, // Added from props
  onStanceChange, // Added from props
  isEnabled = true,
  interactive = true, // Default to true
  showLabels = true,
  size = 200,
  position, // Use x, y from BaseComponentProps if position is not given
  x: propX, // From BaseComponentProps
  y: propY, // From BaseComponentProps
  // time, // Unused time prop
  ...props
}) => {
  const x = position?.x ?? propX ?? 0;
  const y = position?.y ?? propY ?? 0;

  const [hoveredStance, setHoveredStance] = useState<
    keyof typeof TRIGRAM_DATA | null
  >(null);
  const selectedStance = propSelectedStance || currentStance;

  const segmentTextStyle = useMemo(
    // Unused but kept for structure
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.small * (size / 200), // Scale with size
        fill: KOREAN_COLORS.TEXT_PRIMARY,
        align: "center",
      }),
    [size]
  );

  const centerTextStyle = useMemo(
    // Unused but kept for structure
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.large * (size / 200), // Scale with size
        fill: KOREAN_COLORS.ACCENT_PRIMARY,
        fontWeight: FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
        align: "center",
      }),
    [size]
  );

  const radius = size / 2;
  const segmentAngle = (2 * Math.PI) / TRIGRAM_STANCES_ORDER.length;

  const handleSegmentClick = useCallback(
    (stance: keyof typeof TRIGRAM_DATA) => {
      if (isEnabled && interactive) {
        if (onStanceChange) onStanceChange(stance);
        if (onStanceSelect) onStanceSelect(stance);
      }
    },
    [isEnabled, interactive, onStanceChange, onStanceSelect]
  );

  const drawWheel = (g: PIXI.Graphics) => {
    g.clear();
    TRIGRAM_STANCES_ORDER.forEach((stanceId, index) => {
      const startAngle = index * segmentAngle - Math.PI / 2 - segmentAngle / 2;
      const endAngle = startAngle + segmentAngle;

      const isCurrent = stanceId === currentStance;
      const isSelected = stanceId === selectedStance;
      const isHovered = stanceId === hoveredStance;

      let fillColor = getTrigramColorFromTheme(
        stanceId,
        "primary",
        KOREAN_COLORS.UI_BACKGROUND_MEDIUM
      );
      let lineColor = getTrigramColorFromTheme(
        stanceId,
        "secondary",
        KOREAN_COLORS.UI_BORDER
      );
      let alpha = isEnabled ? 1 : 0.5;

      if (isSelected) {
        fillColor = getTrigramColorFromTheme(
          stanceId,
          "active",
          TRIGRAM_DATA[stanceId]?.theme.primary ||
            KOREAN_COLORS.ACCENT_PRIMARY_LIGHT
        );
        lineColor = getTrigramColorFromTheme(
          stanceId,
          "glow",
          KOREAN_COLORS.WHITE_SOLID
        );
      } else if (isHovered && isEnabled && interactive) {
        fillColor = getTrigramColorFromTheme(
          stanceId,
          "hover",
          TRIGRAM_DATA[stanceId]?.theme.primary ||
            KOREAN_COLORS.UI_BACKGROUND_LIGHT
        );
        lineColor = getTrigramColorFromTheme(
          stanceId,
          "glow",
          KOREAN_COLORS.ACCENT_PRIMARY
        );
      }

      g.lineStyle(
        isCurrent || isSelected || (isHovered && isEnabled) ? 3 : 2,
        lineColor,
        alpha
      );
      g.beginFill(
        fillColor,
        isCurrent || isSelected ? alpha * 0.9 : alpha * 0.7
      );
      g.moveTo(radius, radius);
      g.arc(radius, radius, radius - 5, startAngle, endAngle);
      g.lineTo(radius, radius);
      g.endFill();
    });

    // Center circle
    g.lineStyle(
      2,
      getTrigramColorFromTheme(
        currentStance,
        "secondary",
        KOREAN_COLORS.UI_BORDER
      )
    );
    g.beginFill(
      getTrigramColorFromTheme(
        currentStance,
        "primary",
        KOREAN_COLORS.UI_BACKGROUND_DARK
      )
    );
    g.drawCircle(radius, radius, radius * 0.4);
    g.endFill();
  };

  return (
    <Container x={x} y={y} width={size} height={size} {...props}>
      <Graphics draw={drawWheel} />
      {TRIGRAM_STANCES_ORDER.map((stanceId, index) => {
        const angle = index * segmentAngle - Math.PI / 2;
        const textRadius = radius * (showLabels ? 0.75 : 0.6);
        const textX = radius + textRadius * Math.cos(angle);
        const textY = radius + textRadius * Math.sin(angle);
        const stanceData = TRIGRAM_DATA[stanceId];
        // const trigramColor = stanceData?.theme; // Unused

        if (!stanceData) return null;

        const textColor =
          stanceId === currentStance
            ? getTrigramColorFromTheme(
                stanceId,
                "text",
                KOREAN_COLORS.BLACK_SOLID
              ) // Text color for current stance (e.g. black)
            : getTrigramColorFromTheme(
                stanceId,
                "text",
                KOREAN_COLORS.TEXT_PRIMARY
              );

        return (
          <Container
            key={stanceId}
            interactive={isEnabled && interactive}
            buttonMode={isEnabled && interactive}
            pointertap={() => handleSegmentClick(stanceId)}
            pointerover={() =>
              isEnabled && interactive && setHoveredStance(stanceId)
            }
            pointerout={() =>
              isEnabled && interactive && setHoveredStance(null)
            }
          >
            {/* Invisible hit area for better interaction */}
            <Graphics
              draw={(g) => {
                g.beginFill(0xff0000, 0.001); // Almost transparent
                g.moveTo(radius, radius);
                g.arc(
                  radius,
                  radius,
                  radius,
                  index * segmentAngle - Math.PI / 2 - segmentAngle / 2,
                  index * segmentAngle - Math.PI / 2 + segmentAngle / 2
                );
                g.lineTo(radius, radius);
                g.endFill();
              }}
            />
            <Text
              text={stanceData.symbol}
              x={textX}
              y={textY - (showLabels ? 8 * (size / 200) : 0)}
              anchor={0.5}
              style={{
                fontFamily: FONT_FAMILY.SYMBOL,
                fontSize: FONT_SIZES.large * (size / 150),
                fill: textColor,
                fontWeight:
                  stanceId === currentStance
                    ? (FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight)
                    : (FONT_WEIGHTS.regular.toString() as PIXI.TextStyleFontWeight),
              }}
            />
            {showLabels && (
              <Text
                text={stanceData.name.korean}
                x={textX}
                y={textY + 8 * (size / 200)}
                anchor={0.5}
                style={{
                  fontFamily: FONT_FAMILY.PRIMARY,
                  fontSize: FONT_SIZES.tiny * (size / 100),
                  fill: textColor,
                }}
              />
            )}
          </Container>
        );
      })}
      <Text
        text={TRIGRAM_DATA[currentStance]?.symbol}
        x={radius}
        y={radius}
        anchor={0.5}
        style={{
          fontFamily: FONT_FAMILY.SYMBOL,
          fontSize: FONT_SIZES.xlarge * (size / 200),
          fill: getTrigramColorFromTheme(
            currentStance,
            "text",
            KOREAN_COLORS.BLACK_SOLID
          ), // Text color for current stance symbol
          fontWeight: FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
        }}
      />
    </Container>
  );
};

export default TrigramWheel;
