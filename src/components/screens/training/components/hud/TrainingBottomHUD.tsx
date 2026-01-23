/**
 * TrainingBottomHUD - Bottom side HUD for training screen
 *
 * Contains:
 * - Technique Bar (centered)
 * - Feedback Message (centered overlay)
 *
 * Gaming Layout Best Practice:
 * - Width: 100% of screen
 * - Height: Fixed height (~10-12% of screen, ~100-120px)
 * - Full width spans below left/right HUDs
 *
 * Responsible for sizing and positioning all bottom-side UI elements.
 *
 * @korean 훈련화면 하단 HUD - 기술 바 및 피드백 메시지
 */

import React from "react";
import { PlayerState } from "../../../../../systems";
import { Technique } from "../../../../../types";
import { Z_INDEX } from "../../../../../types/LayoutTypes";
import { TechniqueBarContainer } from "../../../../shared/three/ui/TechniqueBarContainer";
import TrainingFeedbackOverlayHtml from "../TrainingFeedbackOverlayHtml";

/** Bottom HUD height constants (gaming standard: ~10-12% of screen) */
const BOTTOM_HUD_HEIGHT_DESKTOP = 120;
const BOTTOM_HUD_HEIGHT_MOBILE = 100;

export interface TrainingBottomHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Whether mobile layout is active */
  readonly isMobile: boolean;
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
}

/**
 * TrainingBottomHUD Component
 *
 * Bottom side of the training screen containing the technique bar
 * and centered feedback messages.
 * Full width (100%), fixed height spans below left/right HUDs.
 */
export const TrainingBottomHUD: React.FC<TrainingBottomHUDProps> = ({
  width,
  height,
  isMobile,
  positionScale,
  techniques,
  player,
  selectedIndex,
  cooldowns,
  onTechniqueSelect,
  showFeedback,
  feedbackMessage,
}) => {
  // Layout calculations for bottom HUD with proper gaming proportions
  const layout = React.useMemo(() => {
    // Fixed height for bottom HUD, scaled for 4K
    const hudHeight = isMobile
      ? BOTTOM_HUD_HEIGHT_MOBILE
      : BOTTOM_HUD_HEIGHT_DESKTOP * positionScale;

    // Padding
    const padding = isMobile ? 10 : 15 * positionScale;

    return {
      hudHeight,
      padding,
    };
  }, [isMobile, positionScale]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: `${layout.hudHeight}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        padding: `${layout.padding}px`,
        boxSizing: "border-box",
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
            isMobile={isMobile}
          />
        </div>
      )}

      {/* Technique Bar - centered, constrained to not overlap side HUDs */}
      <div
        style={{
          pointerEvents: "all",
          maxWidth: "70%", // Leave space for side HUDs (15% each side)
        }}
        data-testid="training-bottom-hud-technique-section"
      >
        <TechniqueBarContainer
          visible={true}
          techniques={techniques as Technique[]}
          player={player}
          selectedIndex={selectedIndex}
          cooldowns={cooldowns}
          onTechniqueSelect={onTechniqueSelect}
          onTechniqueHover={(_tech) => {
            // Could add additional hover effects here
          }}
          isMobile={isMobile}
          screenWidth={width}
          screenHeight={height}
        />
      </div>
    </div>
  );
};

export default TrainingBottomHUD;
