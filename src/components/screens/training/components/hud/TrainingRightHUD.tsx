/**
 * TrainingRightHUD - Right side HUD for training screen
 *
 * Contains:
 * - Training Statistics (top)
 * - Vital Point Selection / Footwork Drills Panel (bottom)
 *
 * Note: Volume Control and Return to Menu have been moved to TrainingTopHUD
 * following gaming UX best practices (top-right for menu/settings).
 *
 * Gaming Layout Best Practice:
 * - Width: 15% of screen (mobile: 20%)
 * - Height: 100% minus top/bottom HUD heights
 * - Leaves 70% center for arena
 *
 * Responsible for sizing and positioning all right-side UI elements.
 *
 * @korean 훈련화면 오른쪽 HUD - 통계, 급소 선택
 */

import React from "react";
import type {
  FootworkDrill,
  TrainingMode,
  TrainingStats,
} from "../../hooks/useTrainingState";
import FootworkDrillsOverlayHtml from "../FootworkDrillsOverlayHtml";
import TrainingStatsOverlayHtml from "../TrainingStatsOverlayHtml";
import VitalPointTrainingOverlayHtml from "../VitalPointTrainingOverlayHtml";

/** HUD width percentage of screen (gaming standard: 15-20%) */
const HUD_WIDTH_PERCENT_DESKTOP = 15;
const HUD_WIDTH_PERCENT_MOBILE = 20;

/** Top/Bottom HUD reserved heights */
const TOP_HUD_HEIGHT_DESKTOP = 140;
const TOP_HUD_HEIGHT_MOBILE = 120;
const BOTTOM_HUD_HEIGHT_DESKTOP = 120;
const BOTTOM_HUD_HEIGHT_MOBILE = 100;

export interface TrainingRightHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Whether mobile layout is active */
  readonly isMobile: boolean;
  /** Position scale multiplier for large displays */
  readonly positionScale: number;
  /** Training statistics */
  readonly stats: TrainingStats & {
    readonly sessionDuration?: number;
    readonly bestCombo?: number;
    readonly perfectStrikes?: number;
  };
  /** Distance to training dummy */
  readonly distanceToDummy: number;
  /** Effective reach for current technique */
  readonly effectiveReach: number;
  /** Current training mode */
  readonly trainingMode: TrainingMode;
  /** Selected vital point ID */
  readonly selectedVitalPoint: string | null;
  /** Handler for vital point selection */
  readonly onVitalPointSelect: (point: string | null) => void;
  /** Current footwork drill type */
  readonly footworkDrillType: FootworkDrill;
  /** Current footwork drill step */
  readonly footworkDrillStep: number;
  /** Whether footwork drill is active */
  readonly footworkDrillActive: boolean;
  /** Handler to start footwork drill */
  readonly onStartFootworkDrill: (drill: FootworkDrill) => void;
  /** Handler to stop footwork drill */
  readonly onStopFootworkDrill: () => void;
  /** Handler to advance footwork step */
  readonly onAdvanceFootworkStep: () => void;
}

/**
 * TrainingRightHUD Component
 *
 * Right side of the training screen containing stats and vital point/footwork panels.
 * Takes 15% of screen width (20% on mobile), positioned between top and bottom HUDs.
 */
export const TrainingRightHUD: React.FC<TrainingRightHUDProps> = ({
  width,
  height,
  isMobile,
  positionScale,
  stats,
  distanceToDummy,
  effectiveReach,
  trainingMode,
  selectedVitalPoint,
  onVitalPointSelect,
  footworkDrillType,
  footworkDrillStep,
  footworkDrillActive,
  onStartFootworkDrill,
  onStopFootworkDrill,
  onAdvanceFootworkStep,
}) => {
  // Layout calculations for right HUD with proper gaming proportions
  const layout = React.useMemo(() => {
    // Width: 15-20% of screen
    const hudWidthPercent = isMobile
      ? HUD_WIDTH_PERCENT_MOBILE
      : HUD_WIDTH_PERCENT_DESKTOP;
    const hudWidth = Math.round((width * hudWidthPercent) / 100);

    // Scale factors for 4K (positionScale: 1.0-1.5)
    const scaledTopHeight = isMobile
      ? TOP_HUD_HEIGHT_MOBILE
      : TOP_HUD_HEIGHT_DESKTOP * positionScale;
    const scaledBottomHeight = isMobile
      ? BOTTOM_HUD_HEIGHT_MOBILE
      : BOTTOM_HUD_HEIGHT_DESKTOP * positionScale;

    // Calculate available height between top and bottom HUDs
    const topOffset = scaledTopHeight;
    const bottomOffset = scaledBottomHeight;
    const availableHeight = height - topOffset - bottomOffset;

    // Internal padding and spacing
    const padding = isMobile ? 10 : 15 * positionScale;
    const gap = isMobile ? 10 : 15 * positionScale;

    return {
      hudWidth,
      topOffset,
      bottomOffset,
      availableHeight,
      padding,
      gap,
    };
  }, [width, height, isMobile, positionScale]);

  return (
    <div
      style={{
        position: "absolute",
        top: `${layout.topOffset}px`,
        right: 0,
        width: `${layout.hudWidth}px`,
        height: `${layout.availableHeight}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        pointerEvents: "none",
        padding: `${layout.padding}px`,
        boxSizing: "border-box",
      }}
      data-testid="training-right-hud"
    >
      {/* Top Section - Training Stats */}
      <div
        style={{
          pointerEvents: "all",
          maxWidth: "100%",
        }}
        data-testid="training-right-hud-stats-section"
      >
        <TrainingStatsOverlayHtml
          stats={stats}
          isMobile={isMobile}
          distanceToDummy={distanceToDummy}
          effectiveReach={effectiveReach}
        />
      </div>

      {/* Spacer to push bottom panel down */}
      <div style={{ flex: 1 }} />

      {/* Bottom Section - Vital Point Panel or Footwork Drills */}
      <div
        style={{
          pointerEvents: "all",
          maxWidth: "100%",
        }}
        data-testid="training-right-hud-bottom-section"
      >
        {trainingMode === "footwork" ? (
          <FootworkDrillsOverlayHtml
            currentDrill={footworkDrillType}
            onDrillChange={onStartFootworkDrill}
            currentStep={footworkDrillStep}
            onStepComplete={onAdvanceFootworkStep}
            isActive={footworkDrillActive}
            onToggleActive={() => {
              if (footworkDrillActive) {
                onStopFootworkDrill();
              } else {
                onStartFootworkDrill(footworkDrillType);
              }
            }}
            isMobile={isMobile}
          />
        ) : (
          <VitalPointTrainingOverlayHtml
            selectedVitalPoint={selectedVitalPoint}
            onVitalPointSelect={onVitalPointSelect}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
};

export default TrainingRightHUD;
