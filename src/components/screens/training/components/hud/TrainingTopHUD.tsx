/**
 * TrainingTopHUD - Slim top bar for training screen
 *
 * Gaming Best Practice - Minimal Top Bar:
 * - Training Active/Stop indicator (left)
 * - Vital Point hint + Archetype Selector (center) - desktop only
 * - Return to Menu button (right) - Standard gaming pattern
 *
 * Mobile:
 * - Only shows Training status (left) and Return button (right)
 * - Other controls consolidated in BottomHUD
 *
 * Layout:
 * - Width: 100% of screen
 * - Height: Compact 50-70px (minimal obstruction)
 *
 * @korean 훈련화면 상단 바 - 훈련 상태, 급소 힌트, 원형 선택, 메뉴 복귀
 */

import React from "react";
import { PlayerArchetype } from "../../../../../types/common";
import {
  HUD_HEIGHT,
} from "../../../../../types/LayoutTypes";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
import {
  ArchetypeSelectionButtons,
  ReturnToMenuButton,
} from "../TrainingButtonsOverlayHtml";
import TrainingControlsOverlayHtml from "../TrainingControlsOverlayHtml";

export interface TrainingTopHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Whether mobile layout is active */
  readonly isMobile: boolean;
  /** Position scale multiplier for large displays */
  readonly positionScale: number;
  /** Whether training is currently active */
  readonly isTraining: boolean;
  /** Handler to start training */
  readonly onStartTraining: () => void;
  /** Handler to stop training */
  readonly onStopTraining: () => void;
  /** Currently selected archetype */
  readonly selectedArchetype: PlayerArchetype;
  /** Handler for archetype selection */
  readonly onArchetypeSelect: (archetype: PlayerArchetype) => void;
  /** Whether vital point overlay is visible */
  readonly overlayVisible: boolean;
  /** Handler for returning to menu */
  readonly onReturnToMenu: () => void;
  /** Handler for playing sound effects */
  readonly onPlaySFX: (sound: string) => void;
}

/**
 * TrainingTopHUD Component
 *
 * Slim top bar containing training controls, vital point hint, archetype selector,
 * and return to menu button. On mobile, only essential controls shown.
 */
export const TrainingTopHUD: React.FC<TrainingTopHUDProps> = ({
  width,
  isMobile,
  positionScale,
  isTraining,
  onStartTraining,
  onStopTraining,
  selectedArchetype,
  onArchetypeSelect,
  overlayVisible,
  onReturnToMenu,
  onPlaySFX,
}) => {
  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile,
  });

  // Layout calculations for slim top bar
  const layout = React.useMemo(() => {
    const hudHeight = isMobile
      ? HUD_HEIGHT.TRAINING_TOP_MOBILE
      : HUD_HEIGHT.TRAINING_TOP_DESKTOP * positionScale;

    const padding = isMobile ? 8 : 12 * positionScale;
    const gap = isMobile ? 8 : 12 * positionScale;
    const fontSize = isMobile ? 11 : 12 * positionScale;

    return {
      hudHeight,
      padding,
      gap,
      fontSize,
      hudWidth: width,
    };
  }, [width, isMobile, positionScale]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${layout.hudHeight}px`,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: `${layout.padding}px ${layout.padding * 1.5}px`,
        pointerEvents: "none",
        boxSizing: "border-box",
        borderBottom: `2px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.4)}`,
        background: `linear-gradient(180deg, ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.9)} 0%, ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.7)} 100%)`,
        backdropFilter: "blur(8px)",
      }}
      data-testid="training-top-hud"
    >
      {/* Left Section - Training Controls (compact) */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: `${layout.gap}px`,
          pointerEvents: "all",
          alignItems: "center",
        }}
        data-testid="training-top-hud-left-section"
      >
        <TrainingControlsOverlayHtml
          isTraining={isTraining}
          onStartTraining={onStartTraining}
          onStopTraining={onStopTraining}
          isMobile={isMobile}
        />
      </div>

      {/* Center Section - Vital Point Hint + Archetype Selector (desktop) */}
      {!isMobile && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: `${layout.gap * 2}px`,
          }}
          data-testid="training-top-hud-center-section"
        >
          {/* Vital Point Hint */}
          {!overlayVisible && (
            <div
              style={{
                padding: `${4 * positionScale}px ${10 * positionScale}px`,
                background: hexToRgbaString(
                  theme.colors.UI_BACKGROUND_DARK,
                  0.8,
                ),
                border: `1px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.5)}`,
                borderRadius: `${4 * positionScale}px`,
                fontSize: `${layout.fontSize}px`,
                fontFamily: theme.koreanTypography.fontFamily,
                color: hexToRgbaString(theme.colors.PRIMARY_CYAN, 1),
                whiteSpace: "nowrap",
              }}
              data-testid="vital-point-hint"
            >
              💡 Press{" "}
              <span
                style={{
                  color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
                  fontWeight: "bold",
                }}
              >
                V
              </span>{" "}
              for vital points
            </div>
          )}

          {/* Archetype Selector */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: `${layout.gap}px`,
              padding: `${6 * positionScale}px ${12 * positionScale}px`,
              background: hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.8),
              border: `1px solid ${hexToRgbaString(theme.colors.ACCENT_GOLD, 0.5)}`,
              borderRadius: `${6 * positionScale}px`,
              pointerEvents: "all",
            }}
          >
            <span
              style={{
                fontSize: `${layout.fontSize}px`,
                color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
                fontWeight: "bold",
                fontFamily: theme.koreanTypography.fontFamily,
                whiteSpace: "nowrap",
              }}
            >
              원형 | Archetype:
            </span>
            <ArchetypeSelectionButtons
              selectedArchetype={selectedArchetype}
              onArchetypeSelect={onArchetypeSelect}
              onPlaySFX={onPlaySFX}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}

      {/* Mobile Center - Just vital point hint */}
      {isMobile && !overlayVisible && (
        <div
          style={{
            padding: "4px 8px",
            background: hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.8),
            border: `1px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.5)}`,
            borderRadius: "4px",
            fontSize: "10px",
            fontFamily: theme.koreanTypography.fontFamily,
            color: hexToRgbaString(theme.colors.PRIMARY_CYAN, 1),
          }}
          data-testid="training-top-hud-center-section"
        >
          <span style={{ color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1) }}>
            V
          </span>{" "}
          = 급소
        </div>
      )}

      {/* Right Section - Return to Menu */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          pointerEvents: "all",
        }}
        data-testid="training-top-hud-right-section"
      >
        <ReturnToMenuButton
          onClick={onReturnToMenu}
          onMouseEnter={() => onPlaySFX("menu_hover")}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default TrainingTopHUD;
