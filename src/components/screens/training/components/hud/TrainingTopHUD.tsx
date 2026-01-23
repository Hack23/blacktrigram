/**
 * TrainingTopHUD - Top side HUD for training screen
 *
 * Contains:
 * - Training Active/Stop controls (left)
 * - Archetype Selector (left, below controls)
 * - Vital Point Overlay hint (center)
 * - Training Mode Selector (center)
 * - Return to Menu button (right) - Standard gaming pattern
 * - Volume Control (right)
 *
 * Gaming Layout Best Practice:
 * - Width: 100% of screen
 * - Height: Fixed height (~10-12% of screen, ~120-140px)
 * - Full width spans above left/right HUDs
 * - Back button in top-right for easy access
 *
 * Responsible for sizing and positioning all top-side UI elements.
 *
 * @korean 훈련화면 상단 HUD - 훈련 제어, 원형 선택, 모드 선택, 메뉴 복귀
 */

import React from "react";
import { PlayerArchetype } from "../../../../../types/common";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
import { VolumeControl } from "../../../../shared/ui/VolumeControl";
import type { TrainingMode } from "../../hooks/useTrainingState";
import {
  ArchetypeSelectionButtons,
  ReturnToMenuButton,
} from "../TrainingButtonsOverlayHtml";
import TrainingControlsOverlayHtml from "../TrainingControlsOverlayHtml";
import TrainingModeSelectorOverlayHtml from "../TrainingModeSelectorOverlayHtml";

/** Top HUD height constants (gaming standard: ~10-12% of screen) */
const TOP_HUD_HEIGHT_DESKTOP = 140;
const TOP_HUD_HEIGHT_MOBILE = 120;

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
  /** Current training mode */
  readonly currentMode: TrainingMode;
  /** Handler for training mode change */
  readonly onModeChange: (mode: TrainingMode) => void;
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
 * Top side of the training screen containing training controls, archetype selector,
 * vital point hint, mode selector, and return to menu button.
 * Full width (100%), fixed height spans above left/right HUDs.
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
  currentMode,
  onModeChange,
  overlayVisible,
  onReturnToMenu,
  onPlaySFX,
}) => {
  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile,
  });

  // Layout calculations for top HUD with proper gaming proportions
  const layout = React.useMemo(() => {
    // Fixed height for top HUD, scaled for 4K
    const hudHeight = isMobile
      ? TOP_HUD_HEIGHT_MOBILE
      : TOP_HUD_HEIGHT_DESKTOP * positionScale;

    // Padding and spacing
    const padding = isMobile ? 12 : 20 * positionScale;
    const gap = isMobile ? 8 : 12 * positionScale;

    // Font sizes scaled for resolution
    const labelFontSize = isMobile ? 10 : 12 * positionScale;
    const hintFontSize = isMobile ? 12 : 14 * positionScale;

    // Spacer width for right side balance (matches left content width)
    const spacerWidth = isMobile ? 100 : 180 * positionScale;

    return {
      hudHeight,
      padding,
      gap,
      labelFontSize,
      hintFontSize,
      spacerWidth,
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
        flexDirection: "column",
        pointerEvents: "none",
        boxSizing: "border-box",
      }}
      data-testid="training-top-hud"
    >
      {/* Top Row - Controls Left, Hint Center, Spacer Right */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: `${layout.padding}px`,
          width: "100%",
          boxSizing: "border-box",
          flex: 1,
        }}
      >
        {/* Left Section - Training Controls & Archetype Selector */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: `${layout.gap}px`,
            pointerEvents: "all",
            alignItems: "flex-start",
          }}
          data-testid="training-top-hud-left-section"
        >
          <TrainingControlsOverlayHtml
            isTraining={isTraining}
            onStartTraining={onStartTraining}
            onStopTraining={onStopTraining}
            isMobile={isMobile}
          />

          {/* Archetype Selector */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: `${layout.gap}px`,
              padding: isMobile
                ? "8px 12px"
                : `${10 * positionScale}px ${16 * positionScale}px`,
              background: hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.9),
              border: `2px solid ${hexToRgbaString(
                theme.colors.ACCENT_GOLD,
                0.6,
              )}`,
              borderRadius: `${8 * positionScale}px`,
              fontFamily: theme.koreanTypography.fontFamily,
              lineHeight: theme.koreanTypography.lineHeight,
              letterSpacing: theme.koreanTypography.letterSpacing,
              wordBreak: theme.koreanTypography.wordBreak,
            }}
          >
            <div
              style={{
                fontSize: `${layout.labelFontSize}px`,
                color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              원형 선택 | Archetype
            </div>
            <ArchetypeSelectionButtons
              selectedArchetype={selectedArchetype}
              onArchetypeSelect={onArchetypeSelect}
              onPlaySFX={onPlaySFX}
              isMobile={isMobile}
            />
          </div>
        </div>

        {/* Center Section - Vital Point Hint & Mode Selector */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: `${layout.gap}px`,
          }}
          data-testid="training-top-hud-mode-section"
        >
          {/* Vital Point Hint */}
          {!overlayVisible && (
            <div
              style={{
                padding: isMobile
                  ? "8px 12px"
                  : `${10 * positionScale}px ${16 * positionScale}px`,
                background: hexToRgbaString(
                  theme.colors.UI_BACKGROUND_DARK,
                  0.9,
                ),
                border: `2px solid ${hexToRgbaString(
                  theme.colors.PRIMARY_CYAN,
                  0.6,
                )}`,
                borderRadius: `${8 * positionScale}px`,
                fontSize: `${layout.hintFontSize}px`,
                fontFamily: theme.koreanTypography.fontFamily,
                color: hexToRgbaString(theme.colors.PRIMARY_CYAN, 1),
                fontWeight: "bold",
                textAlign: "center",
                pointerEvents: "none",
              }}
            >
              💡 급소 오버레이 | Vital Point Overlay: Press{" "}
              <span
                style={{
                  color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
                }}
              >
                V
              </span>
            </div>
          )}

          {/* Mode Selector */}
          <div style={{ pointerEvents: "all" }}>
            <TrainingModeSelectorOverlayHtml
              currentMode={currentMode}
              onModeChange={onModeChange}
              isMobile={isMobile}
            />
          </div>
        </div>

        {/* Right Section - Volume Control & Return to Menu */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: `${layout.gap}px`,
            alignItems: "flex-start",
            pointerEvents: "all",
          }}
          data-testid="training-top-hud-right-section"
        >
          {/* Volume Control */}
          <VolumeControl position="top-right" compact={isMobile} />

          {/* Return to Menu Button */}
          <ReturnToMenuButton
            onClick={onReturnToMenu}
            onMouseEnter={() => onPlaySFX("menu_hover")}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingTopHUD;
