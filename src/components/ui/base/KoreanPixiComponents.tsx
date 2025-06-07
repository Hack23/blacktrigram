import React, { useMemo, useCallback, useState } from "react";
import { Container, Graphics, Text, Sprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  TRIGRAM_DATA,
  // TRIGRAM_STANCES_ORDER, // Unused
  KOREAN_FONT_FAMILY, // Use this for Korean fonts
} from "../../../types/constants";
// import { KoreanPixiText } from "./korean-text"; // Unused
import type {
  KoreanText as KoreanTextType, // Keep this alias if used locally
  TrigramStance,
  // ProgressTrackerProps, // Unused
  BaseComponentProps,
  ColorValue,
  Position,
} from "../../../types";
import { useTexture } from "../../../hooks/useTexture"; // Assuming useTexture hook

// ... (Keep existing interfaces like KoreanStyledTextProps, KoreanStyledButtonProps etc. if they are used elsewhere)

// KoreanPixiProgressTracker
interface KoreanPixiProgressTrackerProps extends BaseComponentProps {
  label?: string | KoreanTextType;
  value: number;
  maxValue: number;
  barColor?: ColorValue;
  backgroundColor?: ColorValue;
  borderColor?: ColorValue; // Added from props
  borderWidth?: number; // Added from props
  showText?: boolean;
  textColor?: ColorValue; // Added from props
}

export const KoreanPixiProgressTracker: React.FC<
  KoreanPixiProgressTrackerProps
> = ({
  label,
  value,
  maxValue,
  width = 200,
  height = 20,
  barColor = KOREAN_COLORS.PRIMARY_CYAN,
  backgroundColor = KOREAN_COLORS.UI_BACKGROUND_SURFACE,
  borderColor = KOREAN_COLORS.UI_STEEL_GRAY, // Used
  borderWidth = 1, // Used
  showText = true,
  textColor = KOREAN_COLORS.TEXT_PRIMARY, // Used
  x = 0, // Use prop x
  y = 0, // Use prop y
}) => {
  // ... (implementation similar to ProgressTracker.tsx, using PIXI components)
  const percentage =
    maxValue > 0 ? Math.max(0, Math.min(1, value / maxValue)) : 0;

  const textStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.MONO,
        fontSize: FONT_SIZES.small * 0.9,
        fill: textColor as number,
        align: "center",
      }),
    [textColor]
  );

  const labelStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: KOREAN_FONT_FAMILY, // Use Korean font
        fontSize: FONT_SIZES.small,
        fill: KOREAN_COLORS.TEXT_SECONDARY,
        fontWeight:
          FONT_WEIGHTS.semibold.toString() as PIXI.TextStyleFontWeight,
      }),
    []
  );

  const labelText = typeof label === "string" ? label : label?.korean;

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(backgroundColor as number, 0.8);
      if (borderWidth > 0) {
        g.lineStyle(borderWidth, borderColor as number, 1);
      }
      g.drawRoundedRect(0, 0, width, height, height / 4);
      g.endFill();

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

  return (
    <Container x={x} y={y}>
      {labelText && (
        <Text text={labelText} y={-(FONT_SIZES.small + 5)} style={labelStyle} />
      )}
      <Graphics draw={draw} />
      {showText && (
        <Text
          text={`${Math.round(value)} / ${maxValue}`}
          anchor={0.5}
          x={width / 2}
          y={height / 2}
          style={textStyle}
        />
      )}
    </Container>
  );
};

// KoreanPixiTrigramWheel (Simplified example)
interface KoreanPixiTrigramWheelProps extends BaseComponentProps {
  currentStance: TrigramStance;
  onStanceSelect: (stance: TrigramStance) => void;
  size?: number;
  isEnabled?: boolean;
}

export const KoreanPixiTrigramWheel: React.FC<KoreanPixiTrigramWheelProps> = ({
  currentStance,
  onStanceSelect,
  size = 150,
  isEnabled = true,
  x = 0,
  y = 0,
}) => {
  const radius = size / 2;
  const segmentAngle = (2 * Math.PI) / TRIGRAM_DATA.orderedStances.length;

  const drawWheel = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      TRIGRAM_DATA.orderedStances.forEach((stanceId, index) => {
        const stanceTheme = TRIGRAM_DATA[stanceId]?.theme;
        const startAngle =
          index * segmentAngle - Math.PI / 2 - segmentAngle / 2;
        const endAngle = startAngle + segmentAngle;
        const isActive = stanceId === currentStance;

        g.lineStyle(
          2,
          isActive
            ? stanceTheme?.glow || KOREAN_COLORS.ACCENT_PRIMARY
            : stanceTheme?.secondary || KOREAN_COLORS.UI_BORDER,
          isEnabled ? 1 : 0.5
        );
        g.beginFill(
          isActive
            ? stanceTheme?.active || KOREAN_COLORS.ACCENT_PRIMARY_LIGHT
            : stanceTheme?.primary || KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
          isEnabled ? (isActive ? 0.9 : 0.7) : 0.4
        );
        g.moveTo(radius, radius);
        g.arc(radius, radius, radius - 2, startAngle, endAngle);
        g.lineTo(radius, radius);
        g.endFill();
      });
      // Center circle
      g.lineStyle(
        2,
        TRIGRAM_DATA[currentStance]?.theme.secondary || KOREAN_COLORS.UI_BORDER
      );
      g.beginFill(
        TRIGRAM_DATA[currentStance]?.theme.primary ||
          KOREAN_COLORS.UI_BACKGROUND_DARK
      );
      g.drawCircle(radius, radius, radius * 0.3);
      g.endFill();
    },
    [radius, segmentAngle, currentStance, isEnabled]
  );

  return (
    <Container x={x} y={y}>
      <Graphics draw={drawWheel} />
      {TRIGRAM_DATA.orderedStances.map((stanceId, index) => {
        const angle = index * segmentAngle - Math.PI / 2;
        const textRadius = radius * 0.7;
        const textX = radius + textRadius * Math.cos(angle);
        const textY = radius + textRadius * Math.sin(angle);
        return (
          <Text
            key={stanceId}
            text={TRIGRAM_DATA[stanceId]?.symbol || ""}
            x={textX}
            y={textY}
            anchor={0.5}
            interactive={isEnabled}
            buttonMode={isEnabled}
            pointertap={() => isEnabled && onStanceSelect(stanceId)}
            style={{
              fontFamily: FONT_FAMILY.SYMBOL,
              fontSize: FONT_SIZES.large * (size / 150),
              fill:
                stanceId === currentStance
                  ? KOREAN_COLORS.BLACK_SOLID
                  : KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight:
                FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
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
          fill: KOREAN_COLORS.BLACK_SOLID, // Color for current stance symbol in center
          fontWeight: FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
        }}
      />
    </Container>
  );
};

// KoreanPixiHeader
interface KoreanPixiHeaderProps extends BaseComponentProps {
  korean: string;
  english?: string;
  level?: 1 | 2 | 3;
}
export const KoreanPixiHeader: React.FC<KoreanPixiHeaderProps> = ({
  korean,
  english,
  level = 1,
  width = 800,
  height = 60,
  x = 0,
  y = 0,
}) => {
  const titleStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: KOREAN_FONT_FAMILY,
        fontSize:
          level === 1
            ? FONT_SIZES.xlarge
            : level === 2
            ? FONT_SIZES.large
            : FONT_SIZES.medium,
        fill: KOREAN_COLORS.ACCENT_PRIMARY,
        fontWeight: FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
      }),
    [level]
  );

  const englishStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: level === 1 ? FONT_SIZES.medium : FONT_SIZES.small,
        fill: KOREAN_COLORS.TEXT_SECONDARY,
      }),
    [level]
  );

  const drawBg = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK_TRANSLUCENT, 0.9);
      g.lineStyle(1, KOREAN_COLORS.PRIMARY_CYAN, 0.8);
      g.drawRect(0, 0, width, height);
      g.endFill();
    },
    [width, height]
  );

  return (
    <Container x={x} y={y}>
      <Graphics draw={drawBg} />
      <Text
        text={korean}
        x={width / 2}
        y={english ? height / 2 - 10 : height / 2}
        anchor={0.5}
        style={titleStyle}
      />
      {english && (
        <Text
          text={english}
          x={width / 2}
          y={height / 2 + 10}
          anchor={0.5}
          style={englishStyle}
        />
      )}
    </Container>
  );
};

// KoreanPixiButton (Simplified from BaseButton)
interface KoreanPixiButtonProps extends BaseComponentProps {
  text: string | KoreanTextType;
  onClick?: (event: PIXI.FederatedPointerEvent) => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  icon?: string | PIXI.Texture; // Path to icon texture or Texture object
  color?: number; // Added color prop
}

export const KoreanPixiButton: React.FC<KoreanPixiButtonProps> = ({
  text,
  onClick,
  variant = "primary",
  disabled = false,
  icon,
  width = 150,
  height = 40,
  x = 0,
  y = 0,
  color = KOREAN_COLORS.PRIMARY_CYAN, // Default color
  ...props
}) => {
  const [isHover, setIsHover] = useState(false);
  const [isDown, setIsDown] = useState(false);

  const iconTexture =
    typeof icon === "string"
      ? useTexture(icon)
      : icon instanceof PIXI.Texture
      ? icon
      : null;

  const drawButton = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      let currentFill = color;
      let alpha = disabled ? 0.5 : 1;

      if (!disabled) {
        if (isDown)
          currentFill = PIXI.utils.mixColors(
            color,
            KOREAN_COLORS.BLACK_SOLID,
            0.3
          );
        else if (isHover)
          currentFill = PIXI.utils.mixColors(
            color,
            KOREAN_COLORS.WHITE_SOLID,
            0.2
          );
      }

      switch (variant) {
        case "secondary":
          currentFill =
            isHover && !disabled
              ? KOREAN_COLORS.UI_BACKGROUND_LIGHT
              : KOREAN_COLORS.UI_BACKGROUND_MEDIUM;
          break;
        case "ghost":
          currentFill =
            isHover && !disabled
              ? KOREAN_COLORS.UI_BUTTON_HOVER_BG
              : KOREAN_COLORS.TRANSPARENT;
          break;
      }

      g.beginFill(currentFill, alpha);
      g.lineStyle(
        2,
        variant === "ghost" && !isHover
          ? KOREAN_COLORS.TRANSPARENT
          : PIXI.utils.mixColors(currentFill, KOREAN_COLORS.BLACK_SOLID, 0.2),
        alpha
      );
      g.drawRoundedRect(0, 0, width, height, height / 4);
      g.endFill();
    },
    [width, height, color, disabled, isHover, isDown, variant]
  );

  const textContent = typeof text === "string" ? text : text.korean;
  const textStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: KOREAN_FONT_FAMILY,
        fontSize: FONT_SIZES.small,
        fill: disabled
          ? KOREAN_COLORS.UI_DISABLED_TEXT
          : variant === "primary"
          ? KOREAN_COLORS.BLACK_SOLID
          : KOREAN_COLORS.TEXT_PRIMARY,
        align: "center",
      }),
    [disabled, variant]
  );

  // PIXI.TextMetrics.measureText is available.
  // const textMetrics = PIXI.TextMetrics.measureText(textContent, textStyle);
  // const textX = iconTexture ? (width - textMetrics.width) / 2 + 15 : (width - textMetrics.width) / 2;
  // const textY = (height - textMetrics.height) / 2;

  return (
    <Container
      x={x}
      y={y}
      interactive={!disabled}
      buttonMode={!disabled}
      pointertap={!disabled ? onClick : undefined}
      pointerover={() => setIsHover(true)}
      pointerout={() => {
        setIsHover(false);
        setIsDown(false);
      }}
      pointerdown={() => setIsDown(true)}
      pointerup={() => setIsDown(false)}
      {...props}
    >
      <Graphics draw={drawButton} />
      {iconTexture && (
        <Sprite
          texture={iconTexture}
          x={10}
          y={height / 2}
          anchor={0.5}
          width={height * 0.6}
          height={height * 0.6}
        />
      )}
      <Text
        text={textContent}
        x={width / 2}
        y={height / 2}
        anchor={0.5}
        style={textStyle}
      />
    </Container>
  );
};
