import React, { useCallback } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import { slideUpAnimation } from "./animations";

export interface NavigationButtonsProps {
  readonly onReturnToMenu: () => void;
  readonly onRematch?: () => void;
  readonly onViewReplay?: () => void;
  readonly isMobile: boolean;
  readonly isTablet: boolean;
  /** Optional audio callback for click sounds - passed from parent to avoid Html portal context issues */
  readonly onPlaySelectSound?: () => void;
  /** Optional audio callback for hover sounds - passed from parent to avoid Html portal context issues */
  readonly onPlayHoverSound?: () => void;
}

/**
 * Helper to convert hex color to CSS string
 */
const toCssColor = (hex: number): string => hexToRgbaString(hex, 1);

/**
 * Configuration for a styled navigation button
 */
interface ButtonConfig {
  readonly onClick: () => void;
  readonly onMouseEnter: () => void;
  readonly primaryColor: number;
  readonly borderColor?: number;
  readonly text: { readonly korean: string; readonly english: string };
  readonly testId: string;
  readonly isPrimary?: boolean;
}

/**
 * Props for the reusable styled button component for navigation
 */
interface StyledButtonProps extends ButtonConfig {
  readonly buttonPadding: string;
  readonly buttonFontSize: number;
  readonly minWidth: string;
}

/**
 * Reusable styled button component for navigation
 */
const StyledButton: React.FC<StyledButtonProps> = ({
  onClick,
  onMouseEnter,
  primaryColor,
  borderColor,
  text,
  testId,
  isPrimary = false,
  buttonPadding,
  buttonFontSize,
  minWidth,
}) => {
  const baseBackground = isPrimary
    ? hexToRgbaString(primaryColor, 0.9)
    : hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8);

  const hoverBackground = isPrimary
    ? hexToRgbaString(primaryColor, 1)
    : hexToRgbaString(primaryColor, 0.2);

  const textColor = isPrimary
    ? toCssColor(KOREAN_COLORS.UI_BACKGROUND_DARK)
    : toCssColor(primaryColor);

  const border = isPrimary
    ? "none"
    : `2px solid ${hexToRgbaString(borderColor ?? primaryColor, 0.8)}`;

  const hoverBorderColor = isPrimary
    ? "none"
    : `2px solid ${hexToRgbaString(borderColor ?? primaryColor, 1)}`;

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{
        background: baseBackground,
        border,
        borderRadius: "8px",
        padding: buttonPadding,
        fontSize: buttonFontSize,
        color: textColor,
        fontFamily: FONT_FAMILY.KOREAN,
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.2s ease",
        minWidth,
        boxShadow: `0 4px 12px ${hexToRgbaString(primaryColor, 0.3)}`,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = hoverBackground;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 6px 16px ${hexToRgbaString(
          primaryColor,
          0.4
        )}`;
        if (!isPrimary) {
          e.currentTarget.style.border = hoverBorderColor;
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = baseBackground;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = `0 4px 12px ${hexToRgbaString(
          primaryColor,
          0.3
        )}`;
        if (!isPrimary) {
          e.currentTarget.style.border = border;
        }
      }}
      data-testid={testId}
    >
      {text.korean} | {text.english}
    </button>
  );
};

/**
 * Navigation Buttons Component
 * Provides action buttons for replay and menu navigation
 * Note: Audio callbacks are passed as props since this component is rendered
 * inside a Canvas Html portal which doesn't have access to AudioProvider context
 */
export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onReturnToMenu,
  onRematch,
  onViewReplay,
  isMobile,
  isTablet,
  onPlaySelectSound,
  onPlayHoverSound,
}) => {
  const buttonFontSize = isMobile ? 14 : isTablet ? 15 : 16;
  const buttonPadding = isMobile
    ? "10px 20px"
    : isTablet
    ? "11px 22px"
    : "12px 25px";
  const spacing = isMobile ? 10 : isTablet ? 12 : 15;
  const minWidth = isMobile ? "200px" : "150px";

  const handleReturnToMenu = useCallback(() => {
    onPlaySelectSound?.();
    onReturnToMenu();
  }, [onPlaySelectSound, onReturnToMenu]);

  const handleRematch = useCallback(() => {
    if (onRematch) {
      onPlaySelectSound?.();
      onRematch();
    }
  }, [onPlaySelectSound, onRematch]);

  const handleViewReplay = useCallback(() => {
    if (onViewReplay) {
      onPlaySelectSound?.();
      onViewReplay();
    }
  }, [onPlaySelectSound, onViewReplay]);

  const handleHover = useCallback(() => {
    onPlayHoverSound?.();
  }, [onPlayHoverSound]);

  return (
    <div
      data-testid="navigation-buttons"
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: spacing,
        marginTop: spacing * 2,
        animation: "slideUp 0.6s ease-out 0.3s both",
      }}
    >
      {/* Return to Menu Button - Primary Action */}
      <StyledButton
        onClick={handleReturnToMenu}
        onMouseEnter={handleHover}
        primaryColor={KOREAN_COLORS.PRIMARY_CYAN}
        text={{ korean: "메뉴로", english: "Return to Menu" }}
        testId="return-to-menu-button"
        isPrimary={true}
        buttonPadding={buttonPadding}
        buttonFontSize={buttonFontSize}
        minWidth={minWidth}
      />

      {/* Rematch Button - Secondary Action */}
      {onRematch && (
        <StyledButton
          onClick={handleRematch}
          onMouseEnter={handleHover}
          primaryColor={KOREAN_COLORS.ACCENT_GOLD}
          borderColor={KOREAN_COLORS.ACCENT_GOLD}
          text={{ korean: "재대결", english: "Rematch" }}
          testId="rematch-button"
          isPrimary={false}
          buttonPadding={buttonPadding}
          buttonFontSize={buttonFontSize}
          minWidth={minWidth}
        />
      )}

      {/* View Replay Button - Tertiary Action */}
      {onViewReplay && (
        <StyledButton
          onClick={handleViewReplay}
          onMouseEnter={handleHover}
          primaryColor={KOREAN_COLORS.ACCENT_BLUE}
          borderColor={KOREAN_COLORS.ACCENT_BLUE}
          text={{ korean: "리플레이", english: "View Replay" }}
          testId="view-replay-button"
          isPrimary={false}
          buttonPadding={buttonPadding}
          buttonFontSize={buttonFontSize}
          minWidth={minWidth}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        ${slideUpAnimation}
      `}</style>
    </div>
  );
};
