import React, { useState, useCallback, useMemo } from "react";
import { KOREAN_COLORS } from "../../../types/constants";

// Responsive PixiJS Button with adaptive sizing
export const ResponsivePixiButton: React.FC<ResponsivePixiButtonProps> = ({
  text,
  x = 0,
  y = 0,
  width,
  height,
  screenWidth,
  variant = "primary",
  onClick,
  disabled = false,
  "data-testid": testId,
}) => {
  const sw = screenWidth ?? 0;
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
    <pixiContainer x={x} y={y} data-testid={testId}>
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
      />
    </pixiContainer>
  );
};

// Responsive PixiJS Container that adapts to screen size
export const ResponsivePixiContainer: React.FC<
  ResponsivePixiContainerProps
> = ({ children, x = 0, y = 0, "data-testid": testId }) => {
  return (
    <pixiContainer x={x} y={y} data-testid={testId}>
      {children}
    </pixiContainer>
  );
};

// Responsive PixiJS Panel with title bar
export const ResponsivePixiPanel: React.FC<ResponsivePixiPanelProps> = ({
  title,
  children,
  x = 0,
  y = 0,
  width = 200,
  height = 150,
  "data-testid": testId,
}) => {
  return (
    <pixiContainer x={x} y={y} data-testid={testId}>
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

// Props interfaces: make screenWidth/screenHeight optional
export interface ResponsivePixiButtonProps {
  readonly text: string;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly screenWidth?: number; // now optional
  readonly screenHeight?: number; // now optional
  readonly variant?: "primary" | "secondary" | "accent" | "ghost" | "danger";
  readonly onClick?: () => void;
  readonly disabled?: boolean;
  readonly "data-testid"?: string;
}

export interface ResponsivePixiContainerProps {
  readonly children?: React.ReactNode;
  readonly x?: number;
  readonly y?: number;
  readonly screenWidth?: number; // now optional
  readonly screenHeight?: number; // now optional
  readonly "data-testid"?: string;
}

export interface ResponsivePixiPanelProps {
  readonly title?: string;
  readonly children?: React.ReactNode;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly screenWidth?: number; // now optional
  readonly screenHeight?: number; // now optional
  readonly "data-testid"?: string;
}

export default {
  ResponsivePixiContainer,
  ResponsivePixiButton,
  ResponsivePixiPanel,
};
