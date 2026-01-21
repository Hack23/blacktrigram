/**
 * BaseButton - Enhanced button component with Korean theming
 * 
 * Builds on existing KoreanButton with extracted common logic
 * Provides consistent button styling across the application
 * 
 * Now with Html overlay positioning helpers for:
 * - Consistent z-index management
 * - Performance optimization with distanceFactor
 * - GPU acceleration
 * 
 * @module components/base
 */

import { Html } from "@react-three/drei";
import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { KOREAN_COLORS, UI_DIMENSIONS } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { applyHtmlOverlayStyles, calculateDistanceFactor } from "../../../utils/htmlOverlayHelpers";
import type { HtmlOverlayLayer } from "../../../types/HtmlOverlayTypes";
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
  /** Html overlay layer for z-index (default: 'hud') */
  readonly layer?: HtmlOverlayLayer;
  /** Whether button should occlude behind 3D objects (default: false) */
  readonly occlude?: boolean;
  /** ARIA label for accessibility (optional, defaults to korean text) */
  readonly ariaLabel?: string;
  /** ARIA described by ID for additional context */
  readonly ariaDescribedBy?: string;
  /** Auto-focus on mount (default: false) */
  readonly autoFocus?: boolean;
}

/**
 * BaseButton Component
 * 
 * Enhanced Korean-themed button with common functionality extracted.
 * Uses useKoreanTheme hook for consistent styling.
 * Now includes Html overlay positioning helpers for proper z-index and performance.
 * 
 * WCAG 2.1 AA Accessibility Features:
 * - Proper ARIA labels and semantic HTML
 * - Keyboard navigation support (Enter and Space keys)
 * - Visible focus indicators with high contrast
 * - Disabled state properly communicated
 * - Minimum 44x44px touch targets on mobile
 * 
 * Optimized with React.memo for performance
 * 
 * @example
 * ```tsx
 * <BaseButton
 *   korean="공격"
 *   english="Attack"
 *   onClick={() => console.log("Attack")}
 *   variant="primary"
 *   size="md"
 *   layer="hud"
 *   ariaLabel="Attack button"
 * />
 * ```
 */
const BaseButtonComponent: React.FC<BaseButtonProps> = ({
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
  layer = "hud",
  occlude = false,
  ariaLabel,
  ariaDescribedBy,
  autoFocus = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Use Korean theme hook for consistent styling
  const { buttonVariant, buttonSize, fontFamily, accessibility } = useKoreanTheme({
    variant,
    size,
    disabled,
    isMobile,
  });

  // Auto-focus on mount if requested
  useEffect(() => {
    if (autoFocus && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [autoFocus]);

  // Track screen width for responsive distance factor updates on resize
  const [screenWidth, setScreenWidth] = useState(() => 
    typeof window !== "undefined" ? window.innerWidth : UI_DIMENSIONS.DEFAULT_SCREEN_WIDTH
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate optimal distance factor for button
  const distanceFactor = useMemo(() => {
    return calculateDistanceFactor(screenWidth, "button", isMobile);
  }, [screenWidth, isMobile]);

  // Apply Html overlay styles with proper z-index
  const overlayStyle = useMemo(() => {
    return applyHtmlOverlayStyles(layer, true, distanceFactor, true, occlude);
  }, [layer, distanceFactor, occlude]);

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

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // Set pressed state for visual feedback on keyboard activation
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        setIsPressed(true);
      }
    },
    [disabled]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // Clear pressed state - native button behavior will trigger onClick
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        setIsPressed(false);
      }
    },
    [disabled]
  );

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
      // Ensure minimum touch target size on mobile (WCAG 2.1 AA)
      minWidth: isMobile ? accessibility.minTouchTarget : "auto",
      minHeight: isMobile ? accessibility.minTouchTarget : "auto",
      boxShadow: isHovered && !disabled
        ? `0 0 10px ${hexToRgbaString(buttonVariant.border, 0.5)}`
        : "none",
      transform: isPressed && !disabled ? "scale(0.98)" : "scale(1)",
      textShadow: `0 2px 4px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.5)}`,
      // Apply GPU acceleration from overlay style
      WebkitTransform: overlayStyle.transform,
      zIndex: overlayStyle.zIndex,
      // WCAG 2.1 AA compliant focus indicator
      outline: isFocused && !disabled ? accessibility.focusOutline : "none",
      outlineOffset: isFocused && !disabled ? accessibility.focusOutlineOffset : "0",
    };
  }, [
    buttonVariant,
    buttonSize,
    fontFamily,
    disabled,
    fullWidth,
    isHovered,
    isPressed,
    isFocused,
    overlayStyle,
    isMobile,
    accessibility,
  ]);

  return (
    <Html 
      position={position} 
      center={overlayStyle.center}
      distanceFactor={overlayStyle.distanceFactor}
      occlude={overlayStyle.occlude}
      style={{ pointerEvents: overlayStyle.pointerEvents }}
    >
      <button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        disabled={disabled}
        type="button"
        aria-label={ariaLabel ?? `${korean} ${english}`}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled}
        style={buttonStyle}
        data-testid={testId ?? "base-button"}
      >
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          gap: "2px"
        }}>
          <span lang="ko" style={{ fontSize: "1em" }}>{korean}</span>
          <span lang="en" style={{ 
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

// Export memoized component for performance optimization
export const BaseButton = React.memo(BaseButtonComponent);

BaseButton.displayName = "BaseButton";
