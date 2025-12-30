/**
 * BaseButton - Enhanced button component with Korean theming
 * 
 * Builds on existing KoreanButton with extracted common logic
 * Provides consistent button styling across the application
 * 
 * @module components/base
 */

import { Html } from "@react-three/drei";
import React, { useCallback, useMemo, useState } from "react";
import { KOREAN_COLORS } from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";
import { useKoreanTheme } from "./useKoreanTheme";

/**
 * Props for BaseButton component
 */
export interface BaseButtonProps {
  readonly korean: string;
  readonly english: string;
  readonly onClick: () => void;
  readonly disabled?: boolean;
  readonly variant?: "primary" | "secondary" | "danger";
  readonly size?: "sm" | "md" | "lg";
  readonly position?: [number, number, number];
  readonly fullWidth?: boolean;
  readonly testId?: string;
  readonly isMobile?: boolean;
}

/**
 * BaseButton Component
 * 
 * Enhanced Korean-themed button with common functionality extracted.
 * Uses useKoreanTheme hook for consistent styling.
 * 
 * @example
 * ```tsx
 * <BaseButton
 *   korean="공격"
 *   english="Attack"
 *   onClick={() => console.log("Attack")}
 *   variant="primary"
 *   size="md"
 * />
 * ```
 */
export const BaseButton: React.FC<BaseButtonProps> = ({
  korean,
  english,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  position = [0, 0, 0],
  fullWidth = false,
  testId,
  isMobile = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Use Korean theme hook for consistent styling
  const { buttonVariant, buttonSize, fontFamily } = useKoreanTheme({
    variant,
    size,
    disabled,
    isMobile,
  });

  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick();
    }
  }, [onClick, disabled]);

  const handleMouseEnter = useCallback(() => {
    if (!disabled) {
      setIsHovered(true);
    }
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    if (!disabled) {
      setIsPressed(true);
    }
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  // Memoize button styles for performance
  const buttonStyle = useMemo<React.CSSProperties>(() => {
    let background = hexToRgbaString(buttonVariant.background, 0.9);
    
    if (isPressed) {
      background = buttonVariant.activeBg;
    } else if (isHovered) {
      background = buttonVariant.hoverBg;
    }

    return {
      background,
      border: `${buttonSize.borderWidth} solid ${hexToRgbaString(buttonVariant.border)}`,
      color: hexToRgbaString(buttonVariant.text),
      padding: buttonSize.padding,
      fontSize: buttonSize.fontSize,
      fontFamily: fontFamily.KOREAN,
      fontWeight: "bold",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      borderRadius: "4px",
      transition: "all 0.2s ease",
      textAlign: "center",
      userSelect: "none",
      WebkitUserSelect: "none",
      width: fullWidth ? "100%" : "auto",
      boxShadow: isHovered && !disabled
        ? `0 0 10px ${hexToRgbaString(buttonVariant.border, 0.5)}`
        : "none",
      transform: isPressed && !disabled ? "scale(0.98)" : "scale(1)",
      textShadow: `0 2px 4px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.5)}`,
    };
  }, [
    buttonVariant,
    buttonSize,
    fontFamily,
    disabled,
    fullWidth,
    isHovered,
    isPressed,
  ]);

  return (
    <Html position={position} center>
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        disabled={disabled}
        style={buttonStyle}
        data-testid={testId ?? "base-button"}
      >
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          gap: "2px"
        }}>
          <span style={{ fontSize: "1em" }}>{korean}</span>
          <span style={{ 
            fontSize: "0.75em", 
            opacity: 0.8,
            fontStyle: "italic"
          }}>
            {english}
          </span>
        </div>
      </button>
    </Html>
  );
};

BaseButton.displayName = "BaseButton";
