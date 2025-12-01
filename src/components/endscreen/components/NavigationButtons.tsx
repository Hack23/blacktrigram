import React, { useCallback } from "react";
import { useAudio } from "../../../audio/AudioProvider";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";

export interface NavigationButtonsProps {
  readonly onReturnToMenu: () => void;
  readonly onRematch?: () => void;
  readonly onViewReplay?: () => void;
  readonly isMobile: boolean;
  readonly isTablet: boolean;
}

/**
 * Helper to convert hex color to CSS string
 */
const toCssColor = (hex: number): string => hexToRgbaString(hex, 1);

/**
 * Navigation Buttons Component
 * Provides action buttons for replay and menu navigation
 */
export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onReturnToMenu,
  onRematch,
  onViewReplay,
  isMobile,
  isTablet,
}) => {
  const audio = useAudio();

  const buttonFontSize = isMobile ? 14 : isTablet ? 15 : 16;
  const buttonPadding = isMobile
    ? "10px 20px"
    : isTablet
    ? "11px 22px"
    : "12px 25px";
  const spacing = isMobile ? 10 : isTablet ? 12 : 15;

  const handleReturnToMenu = useCallback(() => {
    audio.playSFX?.("menu_select");
    onReturnToMenu();
  }, [audio, onReturnToMenu]);

  const handleRematch = useCallback(() => {
    if (onRematch) {
      audio.playSFX?.("menu_select");
      onRematch();
    }
  }, [audio, onRematch]);

  const handleViewReplay = useCallback(() => {
    if (onViewReplay) {
      audio.playSFX?.("menu_select");
      onViewReplay();
    }
  }, [audio, onViewReplay]);

  const handleHover = useCallback(() => {
    audio.playSFX?.("menu_hover");
  }, [audio]);

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
      <button
        onClick={handleReturnToMenu}
        onMouseEnter={handleHover}
        style={{
          background: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.9),
          border: "none",
          borderRadius: "8px",
          padding: buttonPadding,
          fontSize: buttonFontSize,
          color: toCssColor(KOREAN_COLORS.UI_BACKGROUND_DARK),
          fontFamily: FONT_FAMILY.KOREAN,
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s ease",
          minWidth: isMobile ? "200px" : "150px",
          boxShadow: `0 4px 12px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3)}`,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1);
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = `0 6px 16px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.4)}`;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.9);
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = `0 4px 12px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3)}`;
        }}
        data-testid="return-to-menu-button"
      >
        메뉴로 | Return to Menu
      </button>

      {/* Rematch Button - Secondary Action */}
      {onRematch && (
        <button
          onClick={handleRematch}
          onMouseEnter={handleHover}
          style={{
            background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8),
            border: `2px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.8)}`,
            borderRadius: "8px",
            padding: buttonPadding,
            fontSize: buttonFontSize,
            color: toCssColor(KOREAN_COLORS.ACCENT_GOLD),
            fontFamily: FONT_FAMILY.KOREAN,
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease",
            minWidth: isMobile ? "200px" : "150px",
            boxShadow: `0 4px 12px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.2)}`,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.2);
            e.currentTarget.style.borderColor = hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1);
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 6px 16px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.3)}`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8);
            e.currentTarget.style.borderColor = hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.8);
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 4px 12px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.2)}`;
          }}
          data-testid="rematch-button"
        >
          재대결 | Rematch
        </button>
      )}

      {/* View Replay Button - Tertiary Action */}
      {onViewReplay && (
        <button
          onClick={handleViewReplay}
          onMouseEnter={handleHover}
          style={{
            background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8),
            border: `2px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 0.8)}`,
            borderRadius: "8px",
            padding: buttonPadding,
            fontSize: buttonFontSize,
            color: toCssColor(KOREAN_COLORS.ACCENT_BLUE),
            fontFamily: FONT_FAMILY.KOREAN,
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease",
            minWidth: isMobile ? "200px" : "150px",
            boxShadow: `0 4px 12px ${hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 0.2)}`,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 0.2);
            e.currentTarget.style.borderColor = hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 1);
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 6px 16px ${hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 0.3)}`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8);
            e.currentTarget.style.borderColor = hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 0.8);
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 4px 12px ${hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 0.2)}`;
          }}
          data-testid="view-replay-button"
        >
          리플레이 | View Replay
        </button>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
