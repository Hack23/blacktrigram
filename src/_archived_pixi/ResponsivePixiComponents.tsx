import React, { useState, useCallback, useMemo, ReactNode } from "react";
import { KOREAN_COLORS } from "../../../types/constants";

// Responsive PixiJS Button with adaptive sizing
export const ResponsivePixiButton: React.FC<ResponsivePixiButtonProps> = ({
  x = 0,
  y = 0,
  text,
  width,
  height,
  variant = "primary",
  onClick,
  disabled = false,
  testId,
  "data-testid": dataTestId,
  screenWidth = 0,
  screenHeight: _screenHeight = 0,
}) => {
  const sw = screenWidth;
  const containerTestId = dataTestId ?? testId;
  const [isHovered, setIsHovered] = useState(false);

  const fontSize = useMemo(() => {
    const isMobile = sw < 768;
    const isTablet = sw >= 768 && sw < 1024;
    return isMobile ? 12 : isTablet ? 14 : 16;
  }, [sw]);

  const getButtonColor = useCallback(() => {
    if (disabled) return KOREAN_COLORS.UI_DISABLED_BG;

    switch (variant) {
      case "primary":
        return KOREAN_COLORS.PRIMARY_CYAN;
      case "secondary":
        return KOREAN_COLORS.UI_STEEL_GRAY;
      case "accent":
        return KOREAN_COLORS.ACCENT_GOLD;
      case "ghost":
        return KOREAN_COLORS.TRANSPARENT;
      case "danger":
        return KOREAN_COLORS.NEGATIVE_RED;
      default:
        return KOREAN_COLORS.PRIMARY_CYAN;
    }
  }, [variant, disabled]);

  return (
    <pixiContainer x={x} y={y} data-testid={containerTestId} onClick={onClick}>
      <pixiGraphics
        draw={(g) => {
          g.clear();
          const color = getButtonColor();
          const alpha = isHovered ? 0.8 : 0.6;

          g.fill({ color, alpha });
          g.roundRect(0, 0, width || 120, height || 40, 8);
          g.fill();

          g.stroke({
            width: 2,
            color: disabled
              ? KOREAN_COLORS.UI_DISABLED_BORDER
              : KOREAN_COLORS.ACCENT_GOLD,
            alpha: 0.8,
          });
          g.roundRect(0, 0, width || 120, height || 40, 8);
          g.stroke();
        }}
        interactive={!disabled}
        onPointerOver={() => !disabled && setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onPointerDown={() => !disabled && onClick?.()}
      />
      <pixiText
        text={text}
        style={{
          fontSize,
          fill: disabled
            ? KOREAN_COLORS.UI_DISABLED_TEXT
            : KOREAN_COLORS.TEXT_PRIMARY,
          align: "center",
          fontWeight: "bold",
        }}
        x={(width || 120) / 2}
        y={(height || 40) / 2}
        anchor={0.5}
        data-testid={`${containerTestId}-text`}
      />
    </pixiContainer>
  );
};

// Responsive PixiJS Container that adapts to screen size
export const ResponsivePixiContainer: React.FC<
  ResponsivePixiContainerProps
> = ({
  x = 0,
  y = 0,
  children,
  testId,
  "data-testid": dataTestId,
  screenWidth: _screenWidth,
  screenHeight: _screenHeight,
}) => {
  const containerTestId = dataTestId ?? testId;
  return (
    <pixiContainer x={x} y={y} data-testid={containerTestId}>
      {children}
    </pixiContainer>
  );
};

// Responsive PixiJS Panel with title bar
export const ResponsivePixiPanel: React.FC<ResponsivePixiPanelProps> = ({
  x = 0,
  y = 0,
  title,
  children,
  width = 200,
  height = 150,
  testId,
  "data-testid": dataTestId,
  screenWidth: _screenWidth,
  screenHeight: _screenHeight,
}) => {
  const containerTestId = dataTestId ?? testId;

  return (
    <pixiContainer x={x} y={y} data-testid={containerTestId}>
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.9 });
          g.roundRect(0, 0, width, height, 8);
          g.fill();

          g.stroke({
            width: 2,
            color: KOREAN_COLORS.ACCENT_GOLD,
            alpha: 0.8,
          });
          g.roundRect(0, 0, width, height, 8);
          g.stroke();
        }}
      />

      {title && (
        <pixiText
          text={title}
          data-testid={`${containerTestId}-title`}
          style={{
            fontSize: 14,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
          }}
          x={10}
          y={-20}
        />
      )}

      <pixiContainer x={0} y={25}>
        {children}
      </pixiContainer>
    </pixiContainer>
  );
};

// Simple Pixi-React wrappers that forward data-testid, positioning, text, children and click handlers.
export interface ResponsivePixiButtonProps {
  text: string;
  // allow both forms of test id
  testId?: string;
  "data-testid"?: string;
  x?: number;
  y?: number;
  // sizing props
  width?: number;
  height?: number;
  screenWidth?: number;
  screenHeight?: number;
  variant?: "primary" | "secondary" | "accent" | "ghost" | "danger";
  disabled?: boolean;
  onClick?: () => void;
}

export const ResponsivePixiButtonSimple: React.FC<
  ResponsivePixiButtonProps
> = ({ text, testId, x = 0, y = 0, onClick }) => {
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <pixiContainer
      data-testid={testId}
      x={x}
      y={y}
      interactive
      onClick={handleClick}
    >
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.beginFill(0x444444);
          g.drawRect(0, 0, 120, 40);
          g.endFill();
        }}
      />
      <pixiText
        data-testid={`${testId}-text`}
        text={text}
        anchor={0.5}
        x={60}
        y={20}
      />
    </pixiContainer>
  );
};

export interface ResponsivePixiPanelProps {
  title: string;
  testId?: string;
  "data-testid"?: string;
  x?: number;
  y?: number;
  children?: React.ReactNode;
  // sizing props
  width?: number;
  height?: number;
  screenWidth?: number;
  screenHeight?: number;
}

export interface ResponsivePixiContainerProps {
  testId?: string;
  "data-testid"?: string;
  x?: number;
  y?: number;
  children?: ReactNode;
  // responsive context
  screenWidth?: number;
  screenHeight?: number;
}

export default {
  ResponsivePixiContainer,
  ResponsivePixiButton,
  ResponsivePixiPanel,
};
