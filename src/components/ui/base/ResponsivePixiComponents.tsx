import React, { useCallback } from "react";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import { KOREAN_COLORS } from "../../../types/constants";

export interface ResponsivePixiContainerProps {
  readonly children?: React.ReactNode;
  readonly x?: number;
  readonly y?: number;
  readonly screenWidth?: number;
  readonly screenHeight?: number;
  readonly [key: string]: any;
}

export const ResponsivePixiContainer: React.FC<
  ResponsivePixiContainerProps
> = ({ children, x = 0, y = 0, ...props }) => {
  usePixiExtensions();

  return (
    <pixiContainer x={x} y={y} {...props}>
      {children}
    </pixiContainer>
  );
};

export interface ResponsivePixiPanelProps extends ResponsivePixiContainerProps {
  readonly title?: string;
  readonly width?: number;
  readonly height?: number;
}

export const ResponsivePixiPanel: React.FC<ResponsivePixiPanelProps> = ({
  title,
  width = 200,
  height = 150,
  children,
  x = 0,
  y = 0,
  ...props
}) => {
  usePixiExtensions();

  return (
    <pixiContainer x={x} y={y} {...props}>
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
          g.roundRect(0, 0, width, height, 8);
          g.fill();
          g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
          g.roundRect(0, 0, width, height, 8);
          g.stroke();
        }}
      />
      {title && (
        <pixiText
          text={title}
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
          }}
          x={8}
          y={8}
          data-testid={`${title.toLowerCase().replace(/\s+/g, "-")}-title`}
        />
      )}
      <pixiContainer x={0} y={title ? 25 : 8}>
        {children}
      </pixiContainer>
    </pixiContainer>
  );
};

export interface ResponsivePixiButtonProps {
  readonly text: string;
  readonly onClick?: () => void;
  readonly variant?: "primary" | "secondary";
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
  readonly screenWidth?: number;
  readonly screenHeight?: number;
  readonly [key: string]: any;
}

export const ResponsivePixiButton: React.FC<ResponsivePixiButtonProps> = ({
  text,
  onClick,
  variant = "primary",
  width = 100,
  height = 40,
  x = 0,
  y = 0,
  ...props
}) => {
  usePixiExtensions();

  const buttonColor =
    variant === "primary"
      ? KOREAN_COLORS.ACCENT_GOLD
      : KOREAN_COLORS.UI_BACKGROUND_MEDIUM;

  // Fix: Proper click handler that actually gets called
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const drawButton = (g: any) => {
    g.clear();
    g.fill({ color: buttonColor, alpha: 0.8 });
    g.roundRect(0, 0, width, height, 6);
    g.fill();
    g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
    g.roundRect(0, 0, width, height, 6);
    g.stroke();
  };

  const testId = `${text.toLowerCase().replace(/\s+/g, "-")}-button`;

  return (
    <pixiContainer x={x} y={y} {...props}>
      <pixiGraphics
        draw={drawButton}
        interactive={true}
        onPointerDown={handleClick}
        data-testid={testId}
      />
      <pixiText
        text={text}
        style={{
          fontSize: 12,
          fill:
            variant === "primary"
              ? KOREAN_COLORS.BLACK_SOLID
              : KOREAN_COLORS.TEXT_PRIMARY,
          align: "center",
        }}
        x={width / 2}
        y={height / 2}
        anchor={0.5}
        data-testid={`${text.toLowerCase().replace(/\s+/g, "-")}-text`}
      />
    </pixiContainer>
  );
};

export default {
  ResponsivePixiContainer,
  ResponsivePixiButton,
  ResponsivePixiPanel,
};
