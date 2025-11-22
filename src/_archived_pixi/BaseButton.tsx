// Base button component with Korean martial arts styling

import React, { useState } from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import usePixiExtensions from "../../../utils/pixiExtensions";


export const BaseButton: React.FC<BaseButtonProps> = ({
  x = 0,
  y = 0,
  width = 150,
  height = 40,
  text = "",
  koreanText = "",
  onClick,
  disabled = false,
  variant = "primary",
  testId = "",
}) => {
  usePixiExtensions();

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getButtonColors = () => {
    if (disabled) {
      return {
        background: KOREAN_COLORS.UI_DISABLED_FILL,
        border: KOREAN_COLORS.UI_DISABLED_BORDER,
        text: KOREAN_COLORS.UI_DISABLED_TEXT,
      };
    }

    const variantColors = {
      primary: {
        background: KOREAN_COLORS.PRIMARY_CYAN,
        border: KOREAN_COLORS.ACCENT_BLUE,
        text: KOREAN_COLORS.BLACK_SOLID,
      },
      secondary: {
        background: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
        border: KOREAN_COLORS.UI_BORDER,
        text: KOREAN_COLORS.TEXT_PRIMARY,
      },
      accent: {
        background: KOREAN_COLORS.ACCENT_GOLD,
        border: KOREAN_COLORS.ACCENT_ORANGE,
        text: KOREAN_COLORS.BLACK_SOLID,
      },
      ghost: {
        background: 0x000000,
        border: KOREAN_COLORS.UI_BORDER,
        text: KOREAN_COLORS.TEXT_PRIMARY,
      },
      danger: {
        background: KOREAN_COLORS.NEGATIVE_RED,
        border: KOREAN_COLORS.NEGATIVE_RED_DARK,
        text: KOREAN_COLORS.WHITE_SOLID,
      },
    };

    return variantColors[variant];
  };

  const colors = getButtonColors();
  const alpha = isPressed ? 0.8 : isHovered ? 0.9 : 1.0;

  const handlePointerDown = () => {
    if (!disabled) {
      setIsPressed(true);
      onClick?.();
    }
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const handlePointerOver = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  return (
    <pixiContainer x={x} y={y} data-testid={testId || "base-button"}>
      {/* Button Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.beginFill(colors.background, alpha);
          g.lineStyle(2, colors.border, alpha);
          g.drawRoundedRect(0, 0, width, height, 5);
          g.endFill();
        }}
        interactive={!disabled}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />

      {/* Button Text */}
      {koreanText && (
        <pixiText
          text={koreanText}
          style={{
            fontSize: 14,
            fill: colors.text,
            fontWeight: "bold",
            align: "center",
          }}
          x={width / 2}
          y={height / 2 - 8}
          anchor={0.5}
        />
      )}

      {text && (
        <pixiText
          text={text}
          style={{
            fontSize: 12,
            fill: colors.text,
            align: "center",
          }}
          x={width / 2}
          y={height / 2 + (koreanText ? 6 : 0)}
          anchor={0.5}
        />
      )}
    </pixiContainer>
  );
};

export default BaseButton;

export interface BaseButtonProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  koreanText?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "accent" | "ghost" | "danger";
  children?: React.ReactNode;
  testId?: string;
}
