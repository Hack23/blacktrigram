/**
 * TrainingButtons - Reusable button components for TrainingScreen
 * 
 * Provides return-to-menu button and archetype selection buttons.
 * Extracted from TrainingScreen3D to reduce code duplication.
 * 
 * @module components/screens/training
 * @category Training UI
 * @korean 훈련버튼
 */

import React, { useCallback } from "react";
import { PlayerArchetype } from "../../../../types/common";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import { useKoreanTheme } from "../../../shared/base/useKoreanTheme";
import { BaseButtonOverlayHtml } from "../../../shared/base/BaseButtonOverlayHtml";

export interface ReturnToMenuButtonProps {
  /** Callback when button is clicked */
  readonly onClick: () => void;
  /** Callback when mouse enters button */
  readonly onMouseEnter?: () => void;
  /** Whether on mobile device */
  readonly isMobile: boolean;
}

/**
 * ReturnToMenuButton Component
 * 
 * Bilingual button to return to main menu from training screen.
 * Uses BaseButtonOverlayHtml for consistent Korean theming.
 * 
 * Refactored to use BaseButtonOverlayHtml for better consistency.
 * 
 * @example
 * ```tsx
 * <ReturnToMenuButton
 *   onClick={() => navigate('/menu')}
 *   onMouseEnter={() => playSound()}
 *   isMobile={false}
 * />
 * ```
 */
export const ReturnToMenuButton: React.FC<ReturnToMenuButtonProps> = ({
  onClick,
  onMouseEnter,
  isMobile,
}) => {
  return (
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
  );
};

export interface ArchetypeSelectionButtonsProps {
  /** Currently selected archetype */
  readonly selectedArchetype: PlayerArchetype;
  /** Callback when archetype is selected */
  readonly onArchetypeSelect: (archetype: PlayerArchetype) => void;
  /** Callback to play sound effects */
  readonly onPlaySFX?: (sound: string) => void;
  /** Whether on mobile device */
  readonly isMobile: boolean;
}

/**
 * ArchetypeSelectionButtons Component
 * 
 * Grid of buttons to select player archetype during training.
 * Highlights selected archetype with gold background.
 * 
 * Reduces code duplication by 35 lines from TrainingScreen3D (inline button logic)
 * 
 * @example
 * ```tsx
 * <ArchetypeSelectionButtons
 *   selectedArchetype={PlayerArchetype.MUSA}
 *   onArchetypeSelect={(arch) => setArchetype(arch)}
 *   onPlaySFX={(sound) => audio.play(sound)}
 *   isMobile={false}
 * />
 * ```
 */
export const ArchetypeSelectionButtons: React.FC<
  ArchetypeSelectionButtonsProps
> = ({ selectedArchetype, onArchetypeSelect, onPlaySFX, isMobile }) => {
  const theme = useKoreanTheme({ variant: "primary", size: "sm", isMobile });

  const handleArchetypeClick = useCallback(
    (archetype: PlayerArchetype) => {
      onArchetypeSelect(archetype);
      onPlaySFX?.("menu_select");
    },
    [onArchetypeSelect, onPlaySFX],
  );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        justifyContent: "center",
      }}
      data-testid="archetype-selection-buttons"
    >
      {Object.values(PlayerArchetype).map((arch) => (
        <button
          key={arch}
          onClick={() => handleArchetypeClick(arch)}
          style={{
            padding: isMobile ? "4px 8px" : "6px 10px",
            fontSize: isMobile ? "9px" : "11px",
            fontFamily: theme.koreanTypography.fontFamily,
            fontWeight: selectedArchetype === arch ? "bold" : "normal",
            background:
              selectedArchetype === arch
                ? hexToRgbaString(theme.colors.ACCENT_GOLD, 0.8)
                : hexToRgbaString(theme.colors.UI_BACKGROUND_MEDIUM, 0.8),
            color:
              selectedArchetype === arch
                ? hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 1)
                : hexToRgbaString(theme.colors.TEXT_PRIMARY, 1),
            border: `1px solid ${hexToRgbaString(
              selectedArchetype === arch
                ? theme.colors.ACCENT_GOLD
                : theme.colors.UI_BORDER,
              0.6,
            )}`,
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          data-testid={`archetype-button-${arch}`}
          aria-label={`Select ${arch} archetype`}
          aria-pressed={selectedArchetype === arch}
        >
          {arch.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default { ReturnToMenuButton, ArchetypeSelectionButtons };
