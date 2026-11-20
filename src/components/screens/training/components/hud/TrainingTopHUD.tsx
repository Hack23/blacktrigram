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
import { TRAINING_TOP_HUD_HEIGHT_PERCENT } from "../../../../../types/constants/layout";
import { SPACING, SPACING_NUMERIC, SPACING_ADJUSTMENTS, BORDER_RADIUS, TYPOGRAPHY, TYPOGRAPHY_NUMERIC, HIERARCHY, BORDERS, GRADIENTS, HUD_STYLE } from "../../../../../types/constants/designSystem";
import { getHUDHeight } from "../../../../../utils/responsiveLayout";
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
  readonly onToggleOverlay: () => void;
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
  height,
  isMobile,
  positionScale,
  isTraining,
  onStartTraining,
  onStopTraining,
  selectedArchetype,
  onArchetypeSelect,
  overlayVisible,
  onToggleOverlay,
  onReturnToMenu,
  onPlaySFX,
}) => {
  const layout = React.useMemo(() => {
    const hudHeight =
      getHUDHeight(height, TRAINING_TOP_HUD_HEIGHT_PERCENT) * positionScale;

    const padding = isMobile ? SPACING_NUMERIC.xs : SPACING_NUMERIC.sm * positionScale;
    const gap = isMobile ? SPACING_NUMERIC.xs : SPACING_NUMERIC.sm * positionScale;
    const fontSize = isMobile ? TYPOGRAPHY_NUMERIC.bodySmall : TYPOGRAPHY_NUMERIC.bodySmall * positionScale;

    return {
      hudHeight,
      padding,
      gap,
      fontSize,
      hudWidth: width,
    };
  }, [width, height, isMobile, positionScale]);

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
        padding: `${layout.padding}px`,
        pointerEvents: "none",
        boxSizing: "border-box",
        borderBottom: BORDERS.default,
        background: GRADIENTS.vertical(0.9),
        backdropFilter: HUD_STYLE.backdropFilter,
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
          variant="compact"
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
            <button type="button" onClick={onToggleOverlay} aria-pressed={overlayVisible}
              style={{
                padding: `${SPACING.xxs} ${SPACING_ADJUSTMENTS.xsPlus}`,
                background: HUD_STYLE.background,
                border: BORDERS.muted,
                borderRadius: BORDER_RADIUS.sm,
                fontSize: `${layout.fontSize}px`,
                fontFamily: TYPOGRAPHY.bodySmall.fontFamily,
                color: HIERARCHY.accent.color,
                whiteSpace: "nowrap",
                pointerEvents: "auto",
                cursor: "pointer",
              }}
              data-testid="training-toggle-targets"
            >
              급소 보기 | Targets (V)
            </button>

          {/* Archetype Selector */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: `${layout.gap}px`,
              padding: `${SPACING_ADJUSTMENTS.compact} ${SPACING.sm}`,
              background: HUD_STYLE.background,
              border: BORDERS.accent,
              borderRadius: BORDER_RADIUS.md,
              pointerEvents: "all",
            }}
          >
            <span
              style={{
                fontSize: `${layout.fontSize}px`,
                color: HIERARCHY.gold.color,
                fontWeight: "bold",
                fontFamily: TYPOGRAPHY.bodySmall.fontFamily,
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
      {isMobile && (
        <button type="button" onClick={onToggleOverlay} aria-pressed={overlayVisible}
          style={{
            padding: `${SPACING.xxs} ${SPACING.xs}`,
            background: HUD_STYLE.background,
            border: BORDERS.muted,
            borderRadius: BORDER_RADIUS.sm,
            fontSize: TYPOGRAPHY.caption.fontSize,
            fontFamily: TYPOGRAPHY.caption.fontFamily,
            color: HIERARCHY.accent.color,
            pointerEvents: "auto",
          }}
          data-testid="training-toggle-targets"
        >
          급소 | Targets
        </button>
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
