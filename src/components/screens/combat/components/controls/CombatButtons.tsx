/**
 * CombatButtons - Reusable button components for CombatScreen
 * 
 * Provides return-to-menu button with combat-specific styling.
 * Extracted from CombatScreen3D to reduce code duplication.
 * 
 * @module components/screens/combat
 * @category Combat UI
 * @korean 전투버튼
 */

import React from "react";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";

export interface CombatReturnToMenuButtonProps {
  /** Callback when button is clicked */
  readonly onClick: () => void;
  /** Callback when mouse enters button */
  readonly onMouseEnter?: () => void;
  /** Whether on mobile device */
  readonly isMobile: boolean;
}

/**
 * CombatReturnToMenuButton Component
 * 
 * Bilingual button to return to main menu from combat screen.
 * Uses Korean theming with cyan accent (combat color) and responsive sizing.
 * 
 * Reduces code duplication by 56 lines from CombatScreen3D (inline CSS + container)
 * 
 * @example
 * ```tsx
 * <CombatReturnToMenuButton
 *   onClick={() => navigate('/menu')}
 *   onMouseEnter={() => playSound()}
 *   isMobile={false}
 * />
 * ```
 */
export const CombatReturnToMenuButton: React.FC<
  CombatReturnToMenuButtonProps
> = ({ onClick, onMouseEnter, isMobile }) => {
  const theme = useKoreanTheme({ variant: "primary", size: "md", isMobile });

  return (
    <div
      style={{
        textAlign: "center",
        background: "rgba(10, 10, 15, 0.85)",
        border: `2px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.8)}`,
        borderRadius: "8px",
        padding: isMobile ? "6px 10px" : "8px 12px",
      }}
    >
      <style>
        {`
          .combat-return-menu-btn {
            background: ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.9)};
            color: ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 1)};
            border: none;
            border-radius: 8px;
            padding: ${isMobile ? "8px 12px" : "10px 16px"};
            font-size: ${isMobile ? "12px" : "14px"};
            font-family: ${theme.koreanTypography.fontFamily};
            line-height: ${theme.koreanTypography.lineHeight};
            letter-spacing: ${theme.koreanTypography.letterSpacing};
            word-break: ${theme.koreanTypography.wordBreak};
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
            min-height: 36px;
            white-space: nowrap;
          }
          .combat-return-menu-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px ${hexToRgbaString(
              theme.colors.PRIMARY_CYAN,
              0.8,
            )};
          }
        `}
      </style>
      <button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        className="combat-return-menu-btn"
        data-testid="return-to-menu-button"
        aria-label="Return to main menu"
      >
        {isMobile ? "메뉴 | Menu" : "메뉴로 | Return to Menu"}
      </button>
    </div>
  );
};

export default CombatReturnToMenuButton;
