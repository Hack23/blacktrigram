// Reusable PIXI.js components for Black Trigram Korean martial arts game

import React, { useState, useCallback, useMemo } from "react";
import { Container, Graphics, Text, useApp, useTick } from "@pixi/react"; // Removed usePixiApp
import * as PIXI from "pixi.js";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  // FONT_WEIGHTS, // Unused
  TRIGRAM_DATA, // Unused
  TRIGRAM_STANCES_ORDER,
  GAME_CONFIG as GlobalGameConfig,
  FONT_WEIGHTS, // Renamed to avoid conflict
} from "../../../types/constants";
import type {
  TrigramStance,
  Position,
  KoreanText,
  ProgressTrackerProps as LocalProgressTrackerProps, // Renamed
  TrigramWheelProps as LocalTrigramWheelProps, // Renamed
  BaseComponentProps,
  KoreanPixiTextProps as LocalKoreanPixiTextProps, // Renamed
} from "../../../types";
import { deepMerge } from "../../../utils/objectUtils"; // Assuming deepMerge exists

// CyberpunkGrid
interface CyberpunkGridProps extends BaseComponentProps {
  gridSize?: number;
  lineColor?: number;
  lineWidth?: number;
  pulse?: boolean;
  width?: number; // Added width
  height?: number; // Added height
}

export const CyberpunkGrid: React.FC<CyberpunkGridProps> = ({
  gridSize = 50,
  lineColor = KOREAN_COLORS.UI_BACKGROUND_DARK,
  lineWidth = 1,
  pulse = true,
  width = GlobalGameConfig.CANVAS_WIDTH, // Use GlobalGameConfig
  height = GlobalGameConfig.CANVAS_HEIGHT, // Use GlobalGameConfig
  ...props
}) => {
  const [time, setTime] = useState(0);
  // const app = useApp(); // Unused
  useTick((delta) => pulse && setTime((t) => t + delta));

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      const alpha = pulse ? 0.1 + (Math.sin(time * 0.05) + 1) * 0.1 : 0.2;
      g.lineStyle(lineWidth, lineColor, alpha);
      for (let i = 0; i <= width; i += gridSize) {
        g.moveTo(i, 0);
        g.lineTo(i, height);
      }
      for (let j = 0; j <= height; j += gridSize) {
        g.moveTo(0, j);
        g.lineTo(width, j);
      }
    },
    [gridSize, lineColor, lineWidth, pulse, time, width, height]
  );

  return <Graphics draw={draw} {...props} />;
};

// CyberpunkButton
interface CyberpunkButtonProps extends BaseComponentProps {
  text: string;
  onClick: () => void;
  color?: number;
  width?: number; // Added width
  height?: number; // Added height
  disabled?: boolean; // Added disabled
}

export const CyberpunkButton: React.FC<CyberpunkButtonProps> = ({
  text,
  onClick,
  color = KOREAN_COLORS.PRIMARY_CYAN,
  width = 150,
  height = 40,
  disabled = false,
  ...props
}) => {
  const [isOver, setIsOver] = useState(false);
  const [isDown, setIsDown] = useState(false);
  // const app = useApp(); // Unused

  const textStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.medium,
        fill: disabled
          ? KOREAN_COLORS.UI_DISABLED_TEXT
          : KOREAN_COLORS.BLACK_SOLID, // Text color based on state
        align: "center",
        stroke: KOREAN_COLORS.BLACK_SOLID, // Valid ITextStyle property
        strokeThickness: 1, // Valid ITextStyle property
      }),
    [disabled]
  );

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      let currentFill = color;
      if (disabled) {
        currentFill = KOREAN_COLORS.UI_DISABLED_BG;
      } else if (isDown) {
        currentFill = KOREAN_COLORS.PRIMARY_CYAN_DARK;
      } else if (isOver) {
        currentFill = KOREAN_COLORS.PRIMARY_CYAN_LIGHT;
      }

      const borderColor = disabled
        ? KOREAN_COLORS.UI_DISABLED_BORDER
        : isOver
        ? KOREAN_COLORS.PRIMARY_CYAN_LIGHT
        : KOREAN_COLORS.PRIMARY_CYAN;

      g.beginFill(currentFill, disabled ? 0.6 : 1);
      g.lineStyle(2, borderColor, isOver && !disabled ? 1 : 0.7);
      g.drawRoundedRect(0, 0, width, height, height / 4);
      g.endFill();

      // Inner glow/shadow for depth
      if (!disabled) {
        g.lineStyle(1, KOREAN_COLORS.PRIMARY_CYAN_LIGHT, 0.5);
        g.drawRoundedRect(2, 2, width - 4, height - 4, height / 4 - 2);
      }
    },
    [color, width, height, isOver, isDown, disabled]
  );

  return (
    <Container
      interactive={!disabled}
      buttonMode={!disabled}
      pointertap={!disabled ? onClick : undefined}
      pointerover={() => !disabled && setIsOver(true)}
      pointerout={() => {
        setIsOver(false);
        setIsDown(false);
      }}
      pointerdown={() => !disabled && setIsDown(true)}
      pointerup={() => setIsDown(false)}
      cursor={disabled ? "default" : "pointer"}
      {...props}
    >
      <Graphics draw={draw} />
      <Text
        text={text}
        anchor={0.5}
        x={width / 2}
        y={height / 2}
        style={textStyle}
      />
    </Container>
  );
};

// CyberpunkTrigramWheel
export const CyberpunkTrigramWheel: React.FC<LocalTrigramWheelProps> = ({
  currentStance,
  onStanceSelect,
  selectedStance: propSelectedStance,
  isEnabled = true,
  size = 200,
  x = 0,
  y = 0,
  ...props
}) => {
  const [hoveredSegment, setHoveredSegment] = useState<TrigramStance | null>(
    null
  ); // Corrected type
  // const app = useApp(); // Unused
  const selectedStance = propSelectedStance || currentStance;

  const handleSegmentHover = (stanceId: TrigramStance | null) => {
    // Corrected type
    if (isEnabled) setHoveredSegment(stanceId);
  };

  const handleSegmentClick = (stanceId: TrigramStance) => {
    // Corrected type
    if (isEnabled) onStanceSelect(stanceId);
  };

  const radius = size / 2;
  const numSegments = TRIGRAM_STANCES_ORDER.length; // Define numSegments
  const segmentAngle = (2 * Math.PI) / numSegments;

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      TRIGRAM_STANCES_ORDER.forEach((stanceId, i) => {
        const stanceTheme = TRIGRAM_DATA[stanceId]?.theme;
        const baseColor = stanceTheme?.primary || KOREAN_COLORS.UI_STEEL_GRAY;
        const hoverColor = stanceTheme?.glow || KOREAN_COLORS.UI_LIGHT_GRAY;
        const activeColor =
          stanceTheme?.active || KOREAN_COLORS.ACCENT_PRIMARY_LIGHT;
        const borderColor =
          stanceTheme?.secondary || KOREAN_COLORS.PRIMARY_CYAN;

        const startAngle = i * segmentAngle - Math.PI / 2 - segmentAngle / 2;
        const endAngle = startAngle + segmentAngle;

        let fillColor = baseColor;
        let currentBorderColor = borderColor;
        let alpha = isEnabled ? 1 : 0.4;

        if (stanceId === selectedStance) {
          fillColor = activeColor;
          currentBorderColor = stanceTheme?.glow || KOREAN_COLORS.WHITE_SOLID;
        } else if (stanceId === hoveredSegment && isEnabled) {
          fillColor = hoverColor;
          currentBorderColor =
            stanceTheme?.glow || KOREAN_COLORS.ACCENT_PRIMARY;
        }

        g.lineStyle(2, currentBorderColor, alpha);
        g.beginFill(
          fillColor,
          alpha * (stanceId === selectedStance ? 0.9 : 0.7)
        );
        g.moveTo(radius, radius);
        g.arc(radius, radius, radius - 2, startAngle, endAngle);
        g.lineTo(radius, radius);
        g.endFill();
      });
      // Center
      const centerTheme = TRIGRAM_DATA[currentStance]?.theme;
      g.beginFill(
        centerTheme?.primary || KOREAN_COLORS.UI_BACKGROUND_DARK,
        isEnabled ? 1 : 0.5
      );
      g.lineStyle(
        2,
        centerTheme?.secondary || KOREAN_COLORS.PRIMARY_CYAN,
        isEnabled ? 1 : 0.5
      );
      g.drawCircle(radius, radius, radius * 0.35);
      g.endFill();
    },
    [
      radius,
      segmentAngle,
      currentStance,
      selectedStance,
      hoveredSegment,
      isEnabled,
      numSegments,
    ]
  );

  return (
    <Container x={x} y={y} {...props}>
      <Graphics draw={draw} />
      {TRIGRAM_STANCES_ORDER.map((stanceId, i) => {
        const angle = i * segmentAngle - Math.PI / 2;
        const textRadius = radius * 0.7;
        const textX = radius + textRadius * Math.cos(angle);
        const textY = radius + textRadius * Math.sin(angle);
        const stanceData = TRIGRAM_DATA[stanceId];
        if (!stanceData) return null;

        const isCurrent = stanceId === currentStance;
        // const isHovered = hoveredSegment === stanceId; // Corrected comparison
        const isSelected = stanceId === selectedStance;

        let textColor = KOREAN_COLORS.TEXT_PRIMARY;
        if (isSelected)
          textColor = KOREAN_COLORS.BLACK_SOLID; // Example for selected
        else if (isCurrent) textColor = KOREAN_COLORS.ACCENT_PRIMARY;

        return (
          <Text
            key={stanceId}
            text={stanceData.symbol}
            x={textX}
            y={textY}
            anchor={0.5}
            interactive={isEnabled}
            buttonMode={isEnabled}
            pointertap={() => handleSegmentClick(stanceId)}
            pointerover={() => handleSegmentHover(stanceId)}
            pointerout={() => handleSegmentHover(null)}
            style={{
              fontFamily: FONT_FAMILY.SYMBOL,
              fontSize: FONT_SIZES.large * (size / 150),
              fill: textColor,
              fontWeight:
                isCurrent || isSelected
                  ? (FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight)
                  : (FONT_WEIGHTS.regular.toString() as PIXI.TextStyleFontWeight),
            }}
          />
        );
      })}
      <Text
        text={TRIGRAM_DATA[currentStance]?.symbol}
        x={radius}
        y={radius}
        anchor={0.5}
        style={{
          fontFamily: FONT_FAMILY.SYMBOL,
          fontSize: FONT_SIZES.xlarge * (size / 150),
          fill: KOREAN_COLORS.BLACK_SOLID, // Center symbol color
        }}
      />
    </Container>
  );
};

// PixiKoreanText
export const PixiKoreanText: React.FC<LocalKoreanPixiTextProps> = ({
  // Use renamed prop
  text,
  style: customStyle,
  anchor = 0,
  position: pos, // Renamed to avoid conflict with props.position
  x,
  y,
  ...props
}) => {
  // const app = useApp(); // Unused

  const textStyle = useMemo(() => {
    const baseStyle: Partial<PIXI.TextStyleOptions> = {
      fontFamily: FONT_FAMILY.PRIMARY, // Default to primary, can be overridden by KOREAN_FONT_FAMILY
      fontSize: FONT_SIZES.medium,
      fill: KOREAN_COLORS.TEXT_PRIMARY,
      wordWrap: true,
      wordWrapWidth: 400, // Default word wrap width
    };
    // Use deepMerge if available and needed, otherwise simple spread
    return new PIXI.TextStyle(
      customStyle ? { ...baseStyle, ...customStyle } : baseStyle
    );
  }, [customStyle]);

  const displayText = typeof text === "string" ? text : text.korean;
  const finalX = pos ? pos[0] : x;
  const finalY = pos ? pos[1] : y;

  // Drop shadow example (if needed, can be part of style)
  // if (textStyle.dropShadow) {
  //   textStyle.dropShadowColor = textStyle.dropShadowColor || KOREAN_COLORS.BLACK_SOLID;
  //   textStyle.dropShadowBlur = textStyle.dropShadowBlur || 2;
  //   textStyle.dropShadowDistance = textStyle.dropShadowDistance || 2;
  // }

  return (
    <Text
      text={displayText}
      anchor={anchor}
      x={finalX}
      y={finalY}
      style={textStyle}
      {...props}
    />
  );
};

// PixiProgressBar
export const PixiProgressBar: React.FC<LocalProgressTrackerProps> = ({
  // Use renamed prop
  label,
  value,
  maxValue,
  width = 200,
  height = 20,
  barColor = KOREAN_COLORS.POSITIVE_GREEN,
  backgroundColor = KOREAN_COLORS.UI_BACKGROUND_DARK,
  borderColor = KOREAN_COLORS.PRIMARY_CYAN,
  borderWidth = 1,
  showText = true,
  // labelVisible = true, // Prop does not exist
  // labelStyle: customLabelStyle, // Prop does not exist
  x = 0,
  y = 0,
  ...props
}) => {
  const percentage =
    maxValue > 0 ? Math.max(0, Math.min(1, value / maxValue)) : 0;
  // const app = useApp(); // Not needed if using <Graphics>

  const drawBar = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      // Background
      g.beginFill(backgroundColor as number, 0.8);
      if (borderWidth > 0) {
        g.lineStyle(borderWidth, borderColor as number, 1);
      }
      g.drawRoundedRect(0, 0, width, height, height / 4);
      g.endFill();

      // Bar
      if (percentage > 0) {
        g.beginFill(barColor as number, 1);
        g.lineStyle(0);
        g.drawRoundedRect(
          borderWidth,
          borderWidth,
          (width - borderWidth * 2) * percentage,
          height - borderWidth * 2,
          (height - borderWidth * 2) / 4
        );
        g.endFill();
      }
    },
    [
      width,
      height,
      backgroundColor,
      borderColor,
      borderWidth,
      barColor,
      percentage,
    ]
  );

  // useEffect(() => { // Not needed if using <Graphics draw={...}>
  //   // This effect was trying to use app.renderer.plugins.graphics which is incorrect.
  //   // The <Graphics draw={...}> pattern handles updates automatically when props change.
  // }, [value, maxValue, drawBar, app.renderer]);

  const textStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.MONO,
        fontSize: FONT_SIZES.small * 0.8,
        fill: KOREAN_COLORS.TEXT_PRIMARY,
        align: "center",
      }),
    []
  );

  const labelTextStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.small,
        fill: KOREAN_COLORS.TEXT_SECONDARY,
      }),
    []
  );

  const labelContent = typeof label === "string" ? label : label?.korean;

  return (
    <Container x={x} y={y} {...props}>
      {labelContent && (
        <Text
          text={labelContent}
          y={-(FONT_SIZES.small + 5)}
          style={labelTextStyle}
        />
      )}
      <Graphics draw={drawBar} />
      {showText && (
        <Text
          text={`${Math.round(value)}/${maxValue}`}
          anchor={0.5}
          x={width / 2}
          y={height / 2}
          style={textStyle}
        />
      )}
    </Container>
  );
};
