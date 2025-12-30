/**
 * BaseButtonHTML - HTML button component with Korean theming (non-Three.js)
 * 
 * A version of BaseButton that doesn't require Three.js/Canvas context
 * Can be used in regular DOM components
 * 
 * @module components/base
 */

import React, { useCallback, useMemo, useState } from "react";
import { KOREAN_COLORS } from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";
import { useKoreanTheme } from "./useKoreanTheme";

/**
 * Props for BaseButtonHTML component
 */
export interface BaseButtonHTMLProps {
  readonly korean: string;
  readonly english: string;
  readonly onClick: () => void;
  readonly onMouseEnter?: () => void;
  readonly disabled?: boolean;
  readonly variant?: "primary" | "secondary" | "danger";
  readonly size?: "sm" | "md" | "lg";
  readonly fullWidth?: boolean;
  readonly testId?: string;
  readonly isMobile?: boolean;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

/**
 * BaseButtonHTML Component
 * 
 * HTML button with Korean theming (no Three.js dependency).
 * Uses useKoreanTheme hook for consistent styling.
 * 
 * @example
 * ```tsx
 * <BaseButtonHTML
 *   korean="확인"
 *   english="Confirm"
 *   onClick={() => handleConfirm()}
 *   variant="primary"
 *   size="md"
 * />
 * ```
 */
export const BaseButtonHTML: React.FC<BaseButtonHTMLProps> = ({
  korean,
  english,
  onClick,
  onMouseEnter,
  disabled = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  testId,
  isMobile = false,
  className,
  style: customStyle,
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

  const handleMouseEnterInternal = useCallback(() => {
    if (!disabled) {
      setIsHovered(true);
      onMouseEnter?.();
    }
  }, [disabled, onMouseEnter]);

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
      ...customStyle,
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
    customStyle,
  ]);

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnterInternal}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled}
      style={buttonStyle}
      className={className}
      data-testid={testId ?? "base-button-html"}
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
  );
};

BaseButtonHTML.displayName = "BaseButtonHTML";
