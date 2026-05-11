/**
 * BaseButtonOverlayHtml - HTML button component with Korean theming (non-Three.js)
 * 
 * A version of BaseButton that doesn't require Three.js/Canvas context
 * Can be used in regular DOM components
 * 
 * @module components/base
 */

import React, { useCallback, useMemo, useState } from "react";
import { getKoreanButtonWithGlow } from "../../../utils/koreanThemeHelpers";
import { useKoreanTheme } from "./useKoreanTheme";
import { UIHaptics } from "../../../utils/hapticFeedback";

/**
 * Props for BaseButtonOverlayHtml component
 */
export interface BaseButtonOverlayHtmlProps {
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
  readonly autoFocus?: boolean;
  readonly ariaLabel?: string;
  readonly ariaCurrent?: React.AriaAttributes["aria-current"];
}

/**
 * BaseButtonOverlayHtml Component
 * 
 * HTML button with Korean theming (no Three.js dependency).
 * Uses useKoreanTheme hook for consistent styling.
 *
 * Optimized with React.memo for 60fps performance:
 * - Prevents re-renders when props haven't changed
 * - Event handlers already use useCallback internally
 * 
 * @example
 * ```tsx
 * <BaseButtonOverlayHtml
 *   korean="확인"
 *   english="Confirm"
 *   onClick={() => handleConfirm()}
 *   variant="primary"
 *   size="md"
 * />
 * ```
 */
export const BaseButtonOverlayHtml = React.memo<BaseButtonOverlayHtmlProps>(
  ({
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
  autoFocus = false,
  ariaLabel,
  ariaCurrent,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const { buttonSize } = useKoreanTheme({
    variant,
    size,
    disabled,
    isMobile,
  });

  const handleClick = useCallback(() => {
    if (!disabled) {
      UIHaptics.buttonTap(); // Add haptic feedback
      onClick();
    }
  }, [onClick, disabled]);

  const handleMouseEnterInternal = useCallback(() => {
    if (!disabled) {
      UIHaptics.menuHover(); // Add haptic feedback
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

  const buttonStyle = useMemo<React.CSSProperties>(() => {
    const enhancedStyles = getKoreanButtonWithGlow({
      variant,
      isHovered: isHovered && !disabled,
      isPressed: isPressed && !disabled,
      isFocused: false,
      glowIntensity: "medium",
      hoverAnimation: "combined",
    });

    return {
      ...enhancedStyles,
      padding: buttonSize.padding,
      fontSize: buttonSize.fontSize, // Override for size consistency
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      borderRadius: "4px",
      textAlign: "center" as const,
      userSelect: "none" as const,
      WebkitUserSelect: "none" as const,
      width: fullWidth ? "100%" : "auto",
      ...customStyle,
    };
  }, [
    variant,
    buttonSize,
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
      autoFocus={autoFocus}
      aria-label={ariaLabel ?? `${korean} | ${english}`}
      aria-current={ariaCurrent}
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
});

BaseButtonOverlayHtml.displayName = "BaseButtonOverlayHtml";
