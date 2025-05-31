import { useCallback } from "react";
import type { Graphics as PixiGraphics } from "pixi.js";
import {
  PixiTextComponent,
  PixiContainerComponent,
  PixiGraphicsComponent,
  type PixiContainerComponentProps,
  PixiTextComponentProps,
} from "./PixiComponents";
import {
  KOREAN_COLORS,
  KOREAN_FONT_FAMILY,
  type TrigramStance,
  TRIGRAM_DATA,
} from "../../../types";

// Fix prop interfaces to extend properly
export interface KoreanButtonProps
  extends Omit<PixiContainerComponentProps, "children"> {
  readonly text: string;
  readonly koreanText?: string;
  readonly variant?: "primary" | "secondary" | "danger";
  readonly disabled?: boolean;
  readonly size?: "small" | "medium" | "large";
}

export function KoreanButton({
  text,
  koreanText,
  variant = "primary",
  disabled = false,
  size = "medium",
  onClick,
  ...containerProps
}: KoreanButtonProps): React.ReactElement {
  const sizeConfig = {
    small: { width: 80, height: 24, fontSize: 10 },
    medium: { width: 120, height: 30, fontSize: 14 },
    large: { width: 160, height: 40, fontSize: 16 },
  };

  const drawButton = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      const colors = {
        primary: { bg: KOREAN_COLORS.DOJANG_BLUE, border: KOREAN_COLORS.GOLD },
        secondary: { bg: KOREAN_COLORS.GRAY_DARK, border: KOREAN_COLORS.CYAN },
        danger: { bg: KOREAN_COLORS.Red, border: KOREAN_COLORS.WHITE },
      };

      const color = colors[variant];
      const alpha = disabled ? 0.5 : 1;
      const config = sizeConfig[size];

      // Button background
      g.setFillStyle({ color: color.bg, alpha });
      g.roundRect(
        -config.width / 2,
        -config.height / 2,
        config.width,
        config.height,
        5
      );
      g.fill();

      // Button border
      g.setStrokeStyle({ color: color.border, width: 2, alpha });
      g.roundRect(
        -config.width / 2,
        -config.height / 2,
        config.width,
        config.height,
        5
      );
      g.stroke();
    },
    [variant, disabled, size]
  );

  return (
    <PixiContainerComponent
      {...containerProps}
      interactive={!disabled}
      onClick={disabled ? null : onClick || null} // Ensure we never pass undefined
    >
      <PixiGraphicsComponent draw={drawButton} />
      <PixiTextComponent
        text={koreanText || text}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontFamily: KOREAN_FONT_FAMILY,
          fontSize: sizeConfig[size].fontSize,
          fill: disabled ? KOREAN_COLORS.GRAY_LIGHT : KOREAN_COLORS.WHITE,
          fontWeight: "bold",
        }}
      />
    </PixiContainerComponent>
  );
}

// Text component interfaces
export interface KoreanTitleTextProps
  extends Omit<PixiTextComponentProps, "text"> {
  readonly korean: string;
  readonly english?: string;
  readonly emphasis?: boolean;
}

export interface KoreanBodyTextProps
  extends Omit<PixiTextComponentProps, "text"> {
  readonly text: string;
  readonly secondary?: boolean;
}

export interface KoreanHighlightTextProps
  extends Omit<PixiTextComponentProps, "text"> {
  readonly text: string;
  readonly type?: "info" | "warning" | "success";
}

// Korean title text
export function KoreanTitleText({
  korean,
  english,
  emphasis = false,
  ...textProps
}: KoreanTitleTextProps): React.ReactElement {
  const displayText = english ? `${korean} (${english})` : korean;

  return (
    <PixiTextComponent
      {...textProps}
      text={displayText}
      style={{
        fontFamily: KOREAN_FONT_FAMILY,
        fontSize: 18,
        fill: emphasis ? KOREAN_COLORS.GOLD : KOREAN_COLORS.WHITE,
        fontWeight: "bold",
        ...textProps.style,
      }}
    />
  );
}

// Korean body text
export function KoreanBodyText({
  text,
  secondary = false,
  ...textProps
}: KoreanBodyTextProps): React.ReactElement {
  return (
    <PixiTextComponent
      {...textProps}
      text={text}
      style={{
        fontFamily: KOREAN_FONT_FAMILY,
        fontSize: 14,
        fill: secondary ? KOREAN_COLORS.GRAY_LIGHT : KOREAN_COLORS.WHITE,
        ...textProps.style,
      }}
    />
  );
}

// Korean highlight text
export function KoreanHighlightText({
  text,
  type = "info",
  ...textProps
}: KoreanHighlightTextProps): React.ReactElement {
  const colors = {
    info: KOREAN_COLORS.CYAN,
    warning: KOREAN_COLORS.Orange,
    success: KOREAN_COLORS.Green,
  };

  return (
    <PixiTextComponent
      {...textProps}
      text={text}
      style={{
        fontFamily: KOREAN_FONT_FAMILY,
        fontSize: 16,
        fill: colors[type],
        fontWeight: "bold",
        ...textProps.style,
      }}
    />
  );
}

// Korean combat status display
export interface KoreanCombatStatusProps
  extends Omit<PixiTextComponentProps, "text"> {
  readonly status: string;
  readonly warning?: boolean;
}

export function KoreanCombatStatus({
  status,
  warning = false,
  ...textProps
}: KoreanCombatStatusProps): React.ReactElement {
  return (
    <PixiTextComponent
      {...textProps}
      text={status}
      style={{
        fontFamily: KOREAN_FONT_FAMILY,
        fontSize: 12,
        fill: warning ? KOREAN_COLORS.CRITICAL_RED : KOREAN_COLORS.CYAN,
        fontWeight: "bold",
        ...textProps.style,
      }}
    />
  );
}

export interface KoreanTrigramDisplayProps {
  readonly stance: TrigramStance;
  readonly x?: number;
  readonly y?: number;
  readonly size?: number;
  readonly showKorean?: boolean;
  readonly showEnglish?: boolean;
}

export function KoreanTrigramDisplay({
  stance,
  x = 0,
  y = 0,
  size = 48,
  showKorean = true,
  showEnglish = false,
}: KoreanTrigramDisplayProps): React.ReactElement {
  const trigram = TRIGRAM_DATA[stance];

  const drawTrigram = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      // Draw trigram background circle
      g.setFillStyle({
        color: trigram.color,
        alpha: 0.2,
      });
      g.circle(0, 0, size / 2);
      g.fill();

      // Draw trigram border
      g.setStrokeStyle({
        color: trigram.color,
        width: 2,
      });
      g.circle(0, 0, size / 2);
      g.stroke();
    },
    [trigram.color, size]
  );

  return (
    <PixiContainerComponent x={x} y={y}>
      <PixiGraphicsComponent draw={drawTrigram} />

      {/* Trigram Symbol */}
      <PixiTextComponent
        text={trigram.symbol}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontFamily: "serif",
          fontSize: size * 0.6,
          fill: trigram.color,
          fontWeight: "bold",
        }}
      />

      {/* Korean Name */}
      {showKorean && (
        <PixiTextComponent
          text={trigram.korean}
          y={size * 0.6}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{
            fontFamily: KOREAN_FONT_FAMILY,
            fontSize: size * 0.25,
            fill: KOREAN_COLORS.WHITE,
          }}
        />
      )}

      {/* English Name */}
      {showEnglish && (
        <PixiTextComponent
          text={trigram.english}
          y={showKorean ? size * 0.8 : size * 0.6}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: size * 0.2,
            fill: KOREAN_COLORS.GRAY_LIGHT,
          }}
        />
      )}
    </PixiContainerComponent>
  );
}

export interface KoreanHealthBarProps {
  readonly current: number;
  readonly maximum: number;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly showText?: boolean;
}

export function KoreanHealthBar({
  current,
  maximum,
  x = 0,
  y = 0,
  width = 200,
  height = 20,
  showText = true,
}: KoreanHealthBarProps): React.ReactElement {
  const healthPercent = Math.max(0, Math.min(1, current / maximum));

  const drawHealthBar = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      // Background
      g.setFillStyle({ color: KOREAN_COLORS.GRAY_DARK });
      g.rect(0, 0, width, height);
      g.fill();

      // Health fill
      const healthColor =
        healthPercent > 0.6
          ? KOREAN_COLORS.Green
          : healthPercent > 0.3
          ? KOREAN_COLORS.Orange
          : KOREAN_COLORS.Red;

      g.setFillStyle({ color: healthColor });
      g.rect(2, 2, (width - 4) * healthPercent, height - 4);
      g.fill();

      // Border
      g.setStrokeStyle({
        color: KOREAN_COLORS.GOLD,
        width: 1,
      });
      g.rect(0, 0, width, height);
      g.stroke();
    },
    [current, maximum, width, height, healthPercent]
  );

  return (
    <PixiContainerComponent x={x} y={y}>
      <PixiGraphicsComponent draw={drawHealthBar} />

      {showText && (
        <PixiTextComponent
          text={`체력: ${current}/${maximum}`}
          x={width / 2}
          y={height / 2}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{
            fontFamily: KOREAN_FONT_FAMILY,
            fontSize: 12,
            fill: KOREAN_COLORS.WHITE,
            fontWeight: "bold",
          }}
        />
      )}
    </PixiContainerComponent>
  );
}
