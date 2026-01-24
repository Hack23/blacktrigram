/**
 * TrainingBottomHUD - Bottom bar for training screen
 *
 * Contains:
 * - Technique Bar (centered)
 * - Volume Control (bottom-right, compact)
 * - Feedback Message (centered overlay)
 * - Archetype Selector (mobile only - bottom-left)
 *
 * Gaming Layout Best Practice:
 * - Width: 100% of screen
 * - Height: Resolution-based ~11% of screen height (40-120px range)
 * - On mobile, consolidates controls from TopHUD
 *
 * @korean 훈련화면 하단 바 - 기술 바, 음량, 피드백, 모바일 원형선택
 */

import React from "react";
import { PlayerState } from "../../../../../systems";
import { Technique } from "../../../../../types";
import { PlayerArchetype } from "../../../../../types/common";
import { Z_INDEX } from "../../../../../types/LayoutTypes";
import { SPACING, BORDERS, GRADIENTS, HUD_STYLE } from "../../../../../types/constants/designSystem";
import {
  getHUDHeight,
  getResponsivePadding,
  shouldShowMobileControls,
} from "../../../../../utils/responsiveLayout";
import { TechniqueBar } from "../../../../shared/three/ui/TechniqueBar";
import { VolumeControl } from "../../../../shared/ui/VolumeControl";
import { ArchetypeSelectionButtons } from "../TrainingButtonsOverlayHtml";
import TrainingFeedbackOverlayHtml from "../TrainingFeedbackOverlayHtml";



export interface TrainingBottomHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Whether mobile controls should be shown (NOT for sizing) */
  readonly isMobile?: boolean;
  /** Position scale multiplier for large displays */
  readonly positionScale: number;
  /** Available techniques for the technique bar */
  readonly techniques: readonly Technique[];
  /** Player state for technique availability checks */
  readonly player: PlayerState;
  /** Currently selected technique index */
  readonly selectedIndex: number;
  /** Active technique cooldowns */
  readonly cooldowns: Map<string, number>;
  /** Handler for technique selection */
  readonly onTechniqueSelect: (index: number) => void;
  /** Whether to show feedback message */
  readonly showFeedback: boolean;
  /** Feedback message to display */
  readonly feedbackMessage: string;
  /** Currently selected archetype (for mobile) */
  readonly selectedArchetype?: PlayerArchetype;
  /** Handler for archetype selection (for mobile) */
  readonly onArchetypeSelect?: (archetype: PlayerArchetype) => void;
  /** Handler for playing sound effects (for mobile) */
  readonly onPlaySFX?: (sound: string) => void;
}

/**
 * TrainingBottomHUD Component
 *
 * Compact bottom bar with centered technique bar, volume control,
 * and archetype selector on mobile. Uses resolution-based sizing.
 */
export const TrainingBottomHUD: React.FC<TrainingBottomHUDProps> = ({
  width,
  height,
  isMobile = false,
  positionScale,
  techniques,
  player,
  selectedIndex,
  cooldowns,
  onTechniqueSelect,
  showFeedback,
  feedbackMessage,
  selectedArchetype,
  onArchetypeSelect,
  onPlaySFX,
}) => {
  // isMobile only used for showing mobile controls
  const showMobileControls = shouldShowMobileControls(width, isMobile);

  const layout = React.useMemo(() => {
    // Resolution-based HUD height (11% of screen height, 40-120px range)
    const hudHeight = getHUDHeight(height, 0.11) * positionScale;
    
    // Resolution-based padding
    const padding = getResponsivePadding(width) * positionScale;


    return { hudHeight, padding };
  }, [width, height, positionScale]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: `${layout.hudHeight}px`,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        padding: `${layout.padding}px`,
        boxSizing: "border-box",
        borderTop: BORDERS.default,
        background: GRADIENTS.verticalReverse(0.9),
        backdropFilter: HUD_STYLE.backdropFilter,
      }}
      data-testid="training-bottom-hud"
    >
      {/* Feedback Message (centered in screen, above technique bar) */}
      {showFeedback && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: Z_INDEX.MODAL,
            pointerEvents: "none",
          }}
        >
          <TrainingFeedbackOverlayHtml
            message={feedbackMessage}
            isMobile={showMobileControls}
          />
        </div>
      )}

      {/* Technique Bar - centered, embedded mode for proper containment */}
      <div
        style={{
          pointerEvents: "all",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "visible",
          height: "100%",
        }}
        data-testid="training-bottom-hud-technique-section"
      >
        <TechniqueBar
          techniques={techniques as Technique[]}
          player={player}
          selectedIndex={selectedIndex}
          cooldowns={cooldowns}
          onTechniqueSelect={onTechniqueSelect}
          onTechniqueHover={(_tech) => {}}
          isMobile={showMobileControls}
          screenWidth={width}
          screenHeight={height}
          embedded={true}
        />
      </div>

      {/* Volume Control - bottom right corner */}
      <div
        style={{
          position: "absolute",
          right: `${layout.padding * 1.5}px`,
          bottom: `${layout.padding}px`,
          pointerEvents: "all",
        }}
        data-testid="training-bottom-hud-volume-section"
      >
        <VolumeControl position="bottom-right" compact={true} />
      </div>

      {/* Mobile Archetype Selector - bottom left corner */}
      {showMobileControls && onArchetypeSelect && selectedArchetype && (
        <div
          style={{
            position: "absolute",
            left: `${layout.padding * 1.5}px`,
            bottom: `${layout.padding}px`,
            pointerEvents: "all",
            display: "flex",
            alignItems: "center",
            gap: SPACING.xxs,
            padding: `${SPACING.xxs} ${SPACING.xs}`,
            background: GRADIENTS.vertical(0.9),
            border: BORDERS.accent,
            borderRadius: SPACING.xxs,
          }}
          data-testid="training-bottom-hud-archetype-section"
        >
          <ArchetypeSelectionButtons
            selectedArchetype={selectedArchetype}
            onArchetypeSelect={onArchetypeSelect}
            onPlaySFX={onPlaySFX ?? (() => {})}
            isMobile={showMobileControls}
          />
        </div>
      )}
    </div>
  );
};

export default TrainingBottomHUD;
