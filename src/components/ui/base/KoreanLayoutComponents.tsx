/**
 * @fileoverview Korean-themed layout components using @pixi/layout
 * @description Reusable layout primitives with Korean martial arts aesthetics
 */

import React, { useCallback } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import "@pixi/layout";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import { KOREAN_COLORS } from "../../../types/constants";
import type { KoreanText } from "../../../types/korean-text";
import * as PIXI from "pixi.js";

// Extend PixiJS components for layout support
extend({ Container, Graphics, Text });

/**
 * @interface KoreanButtonProps
 * @description Korean-themed button component with bilingual support and layout-powered responsive design
 */
export interface KoreanButtonProps {
  readonly text: KoreanText;
  readonly onClick: () => void;
  readonly width?: number;
  readonly height?: number;
  readonly variant?: "primary" | "secondary" | "combat" | "stance";
  readonly disabled?: boolean;
  readonly x?: number;
  readonly y?: number;
  readonly scale?: number;
  readonly "data-testid"?: string;
}

/**
 * @interface ResponsiveContainerProps
 * @description Layout-powered container with Korean aesthetic and responsive behavior
 */
export interface ResponsiveContainerProps {
  readonly children: React.ReactNode;
  readonly width?: number | string;
  readonly height?: number | string;
  readonly padding?:
    | number
    | { top?: number; right?: number; bottom?: number; left?: number };
  readonly backgroundColor?: number;
  readonly borderColor?: number;
  readonly borderRadius?: number;
  readonly flexDirection?: "row" | "column";
  readonly justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  readonly alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  readonly gap?: number;
  readonly x?: number;
  readonly y?: number;
  readonly "data-testid"?: string;
}

/**
 * @interface KoreanPanelProps
 * @description Traditional Korean-styled panel with modern responsive layout
 */
export interface KoreanPanelProps {
  readonly title?: KoreanText;
  readonly children: React.ReactNode;
  readonly width?: number;
  readonly height?: number;
  readonly showBorder?: boolean;
  readonly showHeader?: boolean;
  readonly variant?: "dark" | "light" | "accent";
  readonly x?: number;
  readonly y?: number;
  readonly "data-testid"?: string;
}

/**
 * @component KoreanButton
 * @description Reusable Korean-themed button with bilingual text and responsive layout
 *
 * Features:
 * - Bilingual Korean-English text support
 * - Multiple visual variants for different contexts
 * - Hover and disabled states with proper feedback
 * - Layout-powered responsive sizing
 * - Traditional Korean color schemes
 *
 * @param props - Button configuration and styling options
 * @returns Responsive Korean-themed button component
 */
export const KoreanButton: React.FC<KoreanButtonProps> = ({
  text,
  onClick,
  width = 120,
  height = 40,
  variant = "primary",
  disabled = false,
  x = 0,
  y = 0,
  scale = 1.0,
  "data-testid": testId = "korean-button",
}) => {
  usePixiExtensions();

  const getVariantColors = useCallback((variant: string, disabled: boolean) => {
    if (disabled) {
      return {
        background: KOREAN_COLORS.UI_GRAY,
        border: KOREAN_COLORS.UI_BORDER,
        text: KOREAN_COLORS.TEXT_DISABLED,
      };
    }

    switch (variant) {
      case "primary":
        return {
          background: KOREAN_COLORS.ACCENT_GOLD,
          border: KOREAN_COLORS.ACCENT_GOLD,
          text: KOREAN_COLORS.TEXT_PRIMARY,
        };
      case "combat":
        return {
          background: KOREAN_COLORS.NEGATIVE_RED,
          border: KOREAN_COLORS.NEGATIVE_RED,
          text: KOREAN_COLORS.TEXT_PRIMARY,
        };
      case "stance":
        return {
          background: KOREAN_COLORS.PRIMARY_CYAN,
          border: KOREAN_COLORS.PRIMARY_CYAN,
          text: KOREAN_COLORS.TEXT_PRIMARY,
        };
      case "secondary":
      default:
        return {
          background: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
          border: KOREAN_COLORS.UI_BORDER,
          text: KOREAN_COLORS.TEXT_PRIMARY,
        };
    }
  }, []);

  const colors = getVariantColors(variant, disabled);

  const drawButton = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Button background
      g.fill({ color: colors.background, alpha: disabled ? 0.5 : 0.9 });
      g.roundRect(0, 0, width, height, 8);
      g.fill();

      // Button border
      g.stroke({
        width: 2,
        color: colors.border,
        alpha: disabled ? 0.3 : 0.8,
      });
      g.roundRect(0, 0, width, height, 8);
      g.stroke();

      // Korean corner accents
      if (!disabled && variant === "primary") {
        g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
        g.rect(6, 6, 12, 2);
        g.rect(6, 6, 2, 12);
        g.rect(width - 18, 6, 12, 2);
        g.rect(width - 8, 6, 2, 12);
        g.fill();
      }
    },
    [colors, width, height, disabled, variant]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick();
    }
  }, [disabled, onClick]);

  // Fix TEXT_DISABLED color constant
  type KoreanButtonVariant =
    | "primary"
    | "secondary"
    | "combat"
    | "stance"
    | "disabled";

  function getVariantTextColor(
    variant: KoreanButtonVariant,
    disabled: boolean
  ): number {
    if (disabled) {
      return KOREAN_COLORS.TEXT_SECONDARY; // Fix: Use existing color constant
    }

    switch (variant) {
      case "primary":
        return KOREAN_COLORS.TEXT_PRIMARY;
      case "secondary":
        return KOREAN_COLORS.TEXT_SECONDARY;
      case "combat":
        return KOREAN_COLORS.ACCENT_GOLD;
      case "stance":
        return KOREAN_COLORS.PRIMARY_CYAN;
      default:
        return KOREAN_COLORS.TEXT_PRIMARY;
    }
  }

  return (
    <pixiContainer
      x={x}
      y={y}
      scale={scale}
      interactive={!disabled}
      cursor={disabled ? "default" : "pointer"}
      data-testid={testId}
      onClick={handleClick}
    >
      <pixiGraphics draw={drawButton} />

      {/* Korean text */}
      <pixiText
        text={text.korean}
        style={{
          fontSize: 12,
          fill: getVariantTextColor(variant, disabled),
          fontWeight: "bold",
          align: "center",
        }}
        anchor={0.5}
      />

      {/* English text */}
      <pixiText
        text={text.english}
        style={{
          fontSize: Math.max(8, Math.min(12, height * 0.25)),
          fill: colors.text,
          align: "center",
        }}
        anchor={0.5}
        x={width / 2}
        y={height * 0.65}
      />
    </pixiContainer>
  );
};

/**
 * @component ResponsiveContainer
 * @description Layout-powered container with Korean aesthetic and flexible responsive behavior
 *
 * Features:
 * - CSS Flexbox-like layout properties using @pixi/layout
 * - Responsive width/height with percentage support
 * - Korean-themed styling and colors
 * - Automatic child arrangement and spacing
 * - Mobile-optimized padding and margins
 *
 * @param props - Container layout and styling configuration
 * @returns Responsive container with automatic child layout
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  width = "auto",
  height = "auto",
  padding = 10,
  backgroundColor = KOREAN_COLORS.UI_BACKGROUND_DARK,
  borderColor = KOREAN_COLORS.UI_BORDER,
  borderRadius = 8,
  flexDirection = "column",
  justifyContent = "flex-start",
  alignItems = "flex-start",
  gap = 10,
  x = 0,
  y = 0,
  "data-testid": testId = "responsive-container",
}) => {
  usePixiExtensions();

  const normalizedPadding =
    typeof padding === "number"
      ? { top: padding, right: padding, bottom: padding, left: padding }
      : { top: 0, right: 0, bottom: 0, left: 0, ...padding };

  const drawBackground = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // We'll calculate actual dimensions based on layout
      const containerWidth = typeof width === "number" ? width : 300;
      const containerHeight = typeof height === "number" ? height : 200;

      // Background
      g.fill({ color: backgroundColor, alpha: 0.9 });
      g.roundRect(0, 0, containerWidth, containerHeight, borderRadius);
      g.fill();

      // Border
      g.stroke({ width: 1, color: borderColor, alpha: 0.6 });
      g.roundRect(0, 0, containerWidth, containerHeight, borderRadius);
      g.stroke();
    },
    [width, height, backgroundColor, borderColor, borderRadius]
  );

  // Fix layout properties type issues
  const containerLayout = {
    width: typeof width === "number" ? width : parseFloat(width),
    height: typeof height === "number" ? height : parseFloat(height),
    padding: {
      top: normalizedPadding.top,
      right: normalizedPadding.right,
      bottom: normalizedPadding.bottom,
      left: normalizedPadding.left,
    },
  };

  return (
    <pixiContainer
      x={x}
      y={y}
      data-testid={testId}
      layout={{
        width: width,
        height: height,
        flexDirection: flexDirection,
        justifyContent: justifyContent,
        alignItems: alignItems,
        gap: gap,
        padding: normalizedPadding,
      }}
    >
      <pixiGraphics draw={drawBackground} />
      {children}
    </pixiContainer>
  );
};

/**
 * @component KoreanPanel
 * @description Traditional Korean-styled panel with modern responsive features
 *
 * Features:
 * - Bilingual Korean-English header support
 * - Traditional Korean design patterns and colors
 * - Responsive layout with automatic content arrangement
 * - Multiple visual variants for different contexts
 * - Optional border and header display
 *
 * @param props - Panel configuration and content
 * @returns Korean-themed panel with responsive layout
 */
export const KoreanPanel: React.FC<KoreanPanelProps> = ({
  title,
  children,
  width = 300,
  height = 200,
  showBorder = true,
  showHeader = true,
  variant = "dark",
  x = 0,
  y = 0,
  "data-testid": testId = "korean-panel",
}) => {
  usePixiExtensions();

  const getVariantColors = useCallback((variant: string) => {
    switch (variant) {
      case "light":
        return {
          background: KOREAN_COLORS.UI_BACKGROUND_LIGHT,
          border: KOREAN_COLORS.UI_BORDER,
          header: KOREAN_COLORS.ACCENT_GOLD,
          text: KOREAN_COLORS.TEXT_PRIMARY,
        };
      case "accent":
        return {
          background: KOREAN_COLORS.ACCENT_BLUE,
          border: KOREAN_COLORS.ACCENT_GOLD,
          header: KOREAN_COLORS.ACCENT_GOLD,
          text: KOREAN_COLORS.TEXT_PRIMARY,
        };
      case "dark":
      default:
        return {
          background: KOREAN_COLORS.UI_BACKGROUND_DARK,
          border: KOREAN_COLORS.UI_BORDER,
          header: KOREAN_COLORS.ACCENT_GOLD,
          text: KOREAN_COLORS.TEXT_PRIMARY,
        };
    }
  }, []);

  const colors = getVariantColors(variant);
  const headerHeight = showHeader && title ? 40 : 0;

  const drawPanel = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Main panel background
      g.fill({ color: colors.background, alpha: 0.95 });
      g.roundRect(0, 0, width, height, 12);
      g.fill();

      // Border
      if (showBorder) {
        g.stroke({ width: 2, color: colors.border, alpha: 0.8 });
        g.roundRect(0, 0, width, height, 12);
        g.stroke();
      }

      // Header background
      if (showHeader && title) {
        g.fill({ color: colors.header, alpha: 0.2 });
        g.roundRect(2, 2, width - 4, headerHeight - 2, 10);
        g.fill();

        // Header border
        g.stroke({ width: 1, color: colors.header, alpha: 0.6 });
        g.roundRect(2, 2, width - 4, headerHeight - 2, 10);
        g.stroke();
      }

      // Korean decorative corner elements
      if (variant === "accent") {
        const cornerSize = 8;
        g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });

        // Top-left corner
        g.rect(8, 8, cornerSize, 2);
        g.rect(8, 8, 2, cornerSize);

        // Top-right corner
        g.rect(width - 16, 8, cornerSize, 2);
        g.rect(width - 10, 8, 2, cornerSize);

        // Bottom-left corner
        g.rect(8, height - 16, cornerSize, 2);
        g.rect(8, height - 16, 2, cornerSize);

        // Bottom-right corner
        g.rect(width - 16, height - 16, cornerSize, 2);
        g.rect(width - 10, height - 16, 2, cornerSize);

        g.fill();
      }
    },
    [
      width,
      height,
      colors,
      showBorder,
      showHeader,
      title,
      headerHeight,
      variant,
    ]
  );

  return (
    <pixiContainer x={x} y={y} data-testid={testId}>
      <pixiGraphics draw={drawPanel} />

      {/* Header */}
      {showHeader && title && (
        <pixiContainer x={15} y={8}>
          <pixiText
            text={title.korean}
            style={{
              fontSize: 14,
              fill: colors.header,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
          />

          <pixiText
            text={title.english}
            style={{
              fontSize: 10,
              fill: colors.text,
              alpha: 0.8,
            }}
            y={20}
          />
        </pixiContainer>
      )}

      {/* Content container with proper spacing */}
      <pixiContainer
        x={15}
        y={headerHeight + 15}
        layout={{
          width: width - 30,
          height: height - headerHeight - 30,
          flexDirection: "column",
          gap: 10,
        }}
      >
        {children}
      </pixiContainer>
    </pixiContainer>
  );
};

/**
 * @component KoreanProgressBar
 * @description Korean-themed progress bar with bilingual labels and responsive design
 */
export interface KoreanProgressBarProps {
  readonly label: KoreanText;
  readonly current: number;
  readonly max: number;
  readonly width?: number;
  readonly height?: number;
  readonly color?: number;
  readonly showText?: boolean;
  readonly x?: number;
  readonly y?: number;
  readonly "data-testid"?: string;
}

export const KoreanProgressBar: React.FC<KoreanProgressBarProps> = ({
  label,
  current,
  max,
  width = 200,
  height = 20,
  color = KOREAN_COLORS.POSITIVE_GREEN,
  showText = true,
  x = 0,
  y = 0,
  "data-testid": testId = "korean-progress-bar",
}) => {
  usePixiExtensions();

  const percentage = Math.max(0, Math.min(1, current / max));

  const getStatusColor = useCallback((percent: number): number => {
    if (percent > 0.6) return KOREAN_COLORS.POSITIVE_GREEN;
    if (percent > 0.3) return KOREAN_COLORS.WARNING_YELLOW;
    return KOREAN_COLORS.NEGATIVE_RED;
  }, []);

  const statusColor =
    color === KOREAN_COLORS.POSITIVE_GREEN ? getStatusColor(percentage) : color;

  const drawProgressBar = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Background
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.8 });
      g.roundRect(0, 0, width, height, height / 2);
      g.fill();

      // Progress fill
      g.fill({ color: statusColor, alpha: 0.9 });
      g.roundRect(0, 0, width * percentage, height, height / 2);
      g.fill();

      // Border
      g.stroke({ width: 1, color: KOREAN_COLORS.UI_BORDER, alpha: 0.6 });
      g.roundRect(0, 0, width, height, height / 2);
      g.stroke();
    },
    [width, height, percentage, statusColor]
  );

  return (
    <pixiContainer x={x} y={y} data-testid={testId}>
      {/* Label */}
      {showText && (
        <pixiContainer>
          <pixiText
            text={label.korean}
            style={{
              fontSize: 10,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
          />

          <pixiText
            text={`${Math.round(current)}/${max} (${Math.round(
              percentage * 100
            )}%)`}
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
            x={width - 80}
          />
        </pixiContainer>
      )}

      {/* Progress bar */}
      <pixiGraphics draw={drawProgressBar} y={showText ? 15 : 0} />
    </pixiContainer>
  );
};

// Export all layout components for easy importing
export default {
  KoreanButton,
  ResponsiveContainer,
  KoreanPanel,
  KoreanProgressBar,
};
