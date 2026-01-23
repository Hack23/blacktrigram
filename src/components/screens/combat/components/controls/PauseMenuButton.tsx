/**
 * PauseMenuButton - Reusable button for pause menu items
 * 
 * Provides consistent styling for pause menu action buttons with Korean theming.
 * Extracted from PauseMenu to reduce code duplication.
 * 
 * Refactored to use useKoreanTheme for consistent theming.
 * 
 * @module components/screens/combat/controls
 * @category Combat UI
 * @korean 일시정지메뉴버튼
 */

import React, { forwardRef } from "react";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import { getFocusStyle } from "../../../../../utils/accessibility";

export interface PauseMenuButtonProps {
  /** Korean label text */
  readonly labelKorean: string;
  /** English label text */
  readonly labelEnglish: string;
  /** Optional icon/emoji */
  readonly icon?: string;
  /** Click handler */
  readonly onClick: () => void;
  /** Mouse enter handler */
  readonly onMouseEnter?: () => void;
  /** Key down handler */
  readonly onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  /** Focus handler */
  readonly onFocus?: () => void;
  /** Whether button is focused */
  readonly isFocused: boolean;
  /** Whether on mobile device */
  readonly isMobile: boolean;
  /** Test ID */
  readonly testId: string;
}

/**
 * PauseMenuButton Component
 * 
 * Styled button for pause menu with:
 * - Korean/English bilingual text with icon support
 * - Cyan themed styling matching combat screen via useKoreanTheme
 * - Hover and focus effects with accessibility support
 * - Responsive sizing for mobile/desktop
 * 
 * Reduces code duplication by ~70 lines from PauseMenu (inline button styling)
 * 
 * @example
 * ```tsx
 * <PauseMenuButton
 *   ref={buttonRef}
 *   labelKorean="계속"
 *   labelEnglish="Resume"
 *   icon="▶️"
 *   onClick={handleResume}
 *   isFocused={focusedIndex === 0}
 *   isMobile={false}
 *   testId="pause-resume-button"
 * />
 * ```
 */
export const PauseMenuButton = forwardRef<
  HTMLButtonElement,
  PauseMenuButtonProps
>(
  (
    {
      labelKorean,
      labelEnglish,
      icon,
      onClick,
      onMouseEnter,
      onKeyDown,
      onFocus,
      isFocused,
      isMobile,
      testId,
    },
    ref,
  ) => {
    const theme = useKoreanTheme({ variant: "primary", size: "lg", isMobile });
    
    return (
      <button
        ref={ref}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        data-testid={testId}
        aria-label={`${labelKorean} | ${labelEnglish}`}
        role="menuitem"
        tabIndex={0}
        style={{
          padding: isMobile ? "12px 24px" : "16px 32px",
          fontSize: isMobile ? "16px" : "20px",
          backgroundColor: hexToRgbaString(
            theme.colors.UI_BACKGROUND_MEDIUM,
            0.9,
          ),
          color: hexToRgbaString(theme.colors.PRIMARY_CYAN, 1),
          border: `2px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.6)}`,
          borderRadius: "8px",
          fontFamily: theme.fontFamily.KOREAN,
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s ease",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          boxShadow: "none",
          ...getFocusStyle(isFocused, {
            outlineWidth: 3,
            boxShadow: `0 0 0 4px ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.3)}, 0 0 20px ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.5)}`,
          }),
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = hexToRgbaString(
            theme.colors.PRIMARY_CYAN,
            1,
          );
          e.currentTarget.style.color = hexToRgbaString(
            theme.colors.UI_BACKGROUND_DARK,
            1,
          );
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = `0 0 20px ${hexToRgbaString(
            theme.colors.PRIMARY_CYAN,
            0.5,
          )}`;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = hexToRgbaString(
            theme.colors.UI_BACKGROUND_MEDIUM,
            0.9,
          );
          e.currentTarget.style.color = hexToRgbaString(
            theme.colors.PRIMARY_CYAN,
            1,
          );
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {icon && <span style={{ fontSize: "24px" }}>{icon}</span>}
        <span>
          {labelKorean} | {labelEnglish}
        </span>
      </button>
    );
  },
);

PauseMenuButton.displayName = "PauseMenuButton";

export default PauseMenuButton;
