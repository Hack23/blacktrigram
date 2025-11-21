/**
 * KoreanButton - Three.js-compatible button component with Korean theming
 * 
 * Provides bilingual button with cyberpunk Korean aesthetic
 * Supports both HTML overlay and 3D mesh rendering
 * 
 * @module components/three
 */

import { Html } from "@react-three/drei";
import React, { useCallback, useMemo, useState } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";

/**
 * Props for KoreanButton component
 */
export interface KoreanButtonProps {
  readonly korean: string;
  readonly english: string;
  readonly onClick: () => void;
  readonly disabled?: boolean;
  readonly variant?: "primary" | "secondary" | "danger";
  readonly size?: "sm" | "md" | "lg";
  readonly position?: [number, number, number];
  readonly fullWidth?: boolean;
  readonly testId?: string;
}

/**
 * KoreanButton Component
 * 
 * A bilingual button component with Korean cyberpunk theming.
 * Uses @react-three/drei Html overlay for proper DOM interaction.
 * 
 * @example
 * ```tsx
 * <KoreanButton
 *   korean="공격"
 *   english="Attack"
 *   onClick={() => console.log("Attack clicked")}
 *   variant="primary"
 *   size="md"
 * />
 * ```
 */
export const KoreanButton: React.FC<KoreanButtonProps> = ({
  korean,
  english,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  position = [0, 0, 0],
  fullWidth = false,
  testId,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Memoize variant colors for performance
  const variantColors = useMemo(() => {
    switch (variant) {
      case "primary":
        return {
          background: KOREAN_COLORS.UI_BACKGROUND_DARK,
          border: KOREAN_COLORS.PRIMARY_CYAN,
          text: KOREAN_COLORS.ACCENT_GOLD,
          hoverBg: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.1),
          activeBg: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.2),
        };
      case "secondary":
        return {
          background: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
          border: KOREAN_COLORS.ACCENT_GOLD,
          text: KOREAN_COLORS.TEXT_PRIMARY,
          hoverBg: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.1),
          activeBg: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.2),
        };
      case "danger":
        return {
          background: KOREAN_COLORS.UI_BACKGROUND_DARK,
          border: KOREAN_COLORS.ACCENT_RED,
          text: KOREAN_COLORS.ACCENT_RED,
          hoverBg: hexToRgbaString(KOREAN_COLORS.ACCENT_RED, 0.1),
          activeBg: hexToRgbaString(KOREAN_COLORS.ACCENT_RED, 0.2),
        };
      default:
        return {
          background: KOREAN_COLORS.UI_BACKGROUND_DARK,
          border: KOREAN_COLORS.PRIMARY_CYAN,
          text: KOREAN_COLORS.ACCENT_GOLD,
          hoverBg: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.1),
          activeBg: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.2),
        };
    }
  }, [variant]);

  // Memoize size dimensions for performance
  const sizeDimensions = useMemo(() => {
    switch (size) {
      case "sm":
        return {
          padding: "8px 16px",
          fontSize: "14px",
          borderWidth: "1px",
        };
      case "lg":
        return {
          padding: "16px 32px",
          fontSize: "20px",
          borderWidth: "3px",
        };
      case "md":
      default:
        return {
          padding: "12px 24px",
          fontSize: "16px",
          borderWidth: "2px",
        };
    }
  }, [size]);

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
    let background = hexToRgbaString(variantColors.background, 0.9);
    
    if (isPressed) {
      background = variantColors.activeBg;
    } else if (isHovered) {
      background = variantColors.hoverBg;
    }

    return {
      background,
      border: `${sizeDimensions.borderWidth} solid ${hexToRgbaString(variantColors.border)}`,
      color: hexToRgbaString(variantColors.text),
      padding: sizeDimensions.padding,
      fontSize: sizeDimensions.fontSize,
      fontFamily: FONT_FAMILY.KOREAN,
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
        ? `0 0 10px ${hexToRgbaString(variantColors.border, 0.5)}`
        : "none",
      transform: isPressed && !disabled ? "scale(0.98)" : "scale(1)",
      textShadow: `0 2px 4px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.5)}`,
    };
  }, [
    variantColors,
    sizeDimensions,
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
        data-testid={testId ?? "korean-button"}
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

KoreanButton.displayName = "KoreanButton";
