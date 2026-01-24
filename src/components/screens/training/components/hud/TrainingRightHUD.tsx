/**
 * TrainingRightHUD - Right side panel for training screen
 *
 * Layout Order (gaming best practice - most referenced at top):
 * 1. Training Statistics (top) - Always visible, most checked
 * 2. Training Mode Selector (middle) - Changed occasionally
 * 3. Vital Point / Footwork Panel (bottom) - Contextual
 *
 * Gaming Layout Best Practice:
 * - Width: Resolution-based 14-18% of screen
 * - Height: Between top/bottom bars
 * - Scrollable vital point section for long lists
 *
 * Now uses shared HUD utilities with resolution-based sizing.
 *
 * @korean 훈련화면 오른쪽 패널 - 통계(상), 모드(중), 급소(하)
 */

import React from "react";
import { useHUDLayout } from "../../../../../hooks/useHUDLayout";
import { getResponsiveSize } from "../../../../../utils/responsiveLayout";
import { BaseHUDContainer } from "../../../../shared/ui/BaseHUDContainer";
import type {
  FootworkDrill,
  TrainingMode,
  TrainingStats,
} from "../../hooks/useTrainingState";
import FootworkDrillsOverlayHtml from "../FootworkDrillsOverlayHtml";
import TrainingModeSelectorOverlayHtml from "../TrainingModeSelectorOverlayHtml";
import TrainingStatsOverlayHtml from "../TrainingStatsOverlayHtml";
import VitalPointTrainingOverlayHtml from "../VitalPointTrainingOverlayHtml";

export interface TrainingRightHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Whether mobile controls should be shown (NOT for sizing) */
  readonly isMobile?: boolean;
  /** Position scale multiplier for large displays */
  readonly positionScale: number;
  /** Current training mode */
  readonly trainingMode: TrainingMode;
  /** Handler for training mode change */
  readonly onModeChange: (mode: TrainingMode) => void;
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
 * Right panel with Stats (top), Mode selector (middle), Vital points (bottom).
 * Uses shared HUD utilities for consistent layout and styling.
 */
export const TrainingRightHUD: React.FC<TrainingRightHUDProps> = ({
  width,
  height,
  isMobile = false,
  positionScale,
  trainingMode,
  onModeChange,
  stats,
  distanceToDummy,
  effectiveReach,
  selectedVitalPoint,
  onVitalPointSelect,
  footworkDrillType,
  footworkDrillStep,
  footworkDrillActive,
  onStartFootworkDrill,
  onStopFootworkDrill,
  onAdvanceFootworkStep,
}) => {
  // Use shared HUD layout hook with TrainingRightHUD-specific spacing
  // TrainingRightHUD uses tighter spacing than TrainingLeftHUD for denser content
  // Resolution-based gap: mobile 6px, tablet 7px, desktop 8px
  const gapOverride = getResponsiveSize(width, {
    mobile: 6,
    tablet: 7,
    desktop: 8,
  }) * positionScale;
  
  const layout = useHUDLayout(
    width,
    height,
    positionScale,
    'right',
    'training',
    undefined,  // Use default padding from hook
    gapOverride  // Override gap for tighter spacing
  );

  return (
    <BaseHUDContainer
      position="right"
      width={layout.hudWidth}
      height={layout.availableHeight}
      topOffset={layout.topOffset}
      padding={layout.padding}
      gap={layout.gap}
      style={{ overflow: "hidden" }}
      dataTestId="training-right-hud"
    >
      {/* TOP: Training Stats - most referenced, always visible */}
      <div
        style={{
          pointerEvents: "all",
          width: "100%",
          flexShrink: 0,
        }}
        data-testid="training-right-hud-stats-section"
      >
        <TrainingStatsOverlayHtml
          stats={stats}
          isMobile={isMobile}
          width={layout.hudWidth - layout.padding * 2}
          distanceToDummy={distanceToDummy}
          effectiveReach={effectiveReach}
        />
      </div>

      {/* MIDDLE: Mode Selector - compact */}
      <div
        style={{
          pointerEvents: "all",
          width: "100%",
          flexShrink: 0,
        }}
        data-testid="training-right-hud-mode-section"
      >
        <TrainingModeSelectorOverlayHtml
          currentMode={trainingMode}
          onModeChange={onModeChange}
          isMobile={isMobile}
        />
      </div>

      {/* BOTTOM: Vital Point / Footwork - scrollable for long lists */}
      <div
        style={{
          pointerEvents: "all",
          width: "100%",
          flex: 1,
          overflow: "auto",
          minHeight: 0,
        }}
        data-testid="training-right-hud-bottom-section"
      >
        {trainingMode === "footwork" || trainingMode === "combo_practice" ? (
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
    </BaseHUDContainer>
  );
};

export default TrainingRightHUD;
