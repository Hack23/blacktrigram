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

import React, { useMemo } from "react";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
import { BaseButtonOverlayHtml } from "../../../../shared/base/BaseButtonOverlayHtml";

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
 * Uses BaseButtonOverlayHtml with custom container for combat-specific styling.
 * 
 * Refactored to use BaseButtonOverlayHtml for better consistency.
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

  const containerStyle = useMemo(() => ({
    background: hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.85),
    border: `2px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.8)}`,
  }), [theme.colors.UI_BACKGROUND_DARK, theme.colors.PRIMARY_CYAN]);

  return (
    <div
      style={{
        textAlign: "center",
        background: containerStyle.background,
        border: containerStyle.border,
        borderRadius: "8px",
        padding: isMobile ? "6px 10px" : "8px 12px",
      }}
    >
      <BaseButtonOverlayHtml
        korean={isMobile ? "메뉴" : "메뉴로"}
        english={isMobile ? "Menu" : "Return to Menu"}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        variant="primary"
        size="md"
        isMobile={isMobile}
        testId="return-to-menu-button"
      />
    </div>
  );
};

export default CombatReturnToMenuButton;
