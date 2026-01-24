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
 * @korean 훈련화면 오른쪽 패널 - 통계(상), 모드(중), 급소(하)
 */

import React from "react";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import {
  getHUDHeight,
  getResponsivePadding,
  getResponsiveSize,
} from "../../../../../utils/responsiveLayout";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
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
 * Uses resolution-based sizing for all dimensions.
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
  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile,
  });

  const layout = React.useMemo(() => {
    // Resolution-based width: 14-18% of screen
    const hudWidthPercent = getResponsiveSize(width, {
      mobile: 18,
      tablet: 16,
      desktop: 14,
    });
    const hudWidth = Math.round((width * hudWidthPercent) / 100);

    // Top/bottom offsets using resolution-based height calculations
    const scaledTopHeight = getHUDHeight(height, 0.06) * positionScale; // ~6% for top
    const scaledBottomHeight = getHUDHeight(height, 0.11) * positionScale; // ~11% for bottom

    const topOffset = scaledTopHeight;
    const bottomOffset = scaledBottomHeight;
    const availableHeight = height - topOffset - bottomOffset;

    // Resolution-based padding and gap
    const padding = getResponsivePadding(width) * positionScale;
    const gap = getResponsiveSize(width, {
      mobile: 6,
      tablet: 7,
      desktop: 8,
    }) * positionScale;

    return { hudWidth, topOffset, bottomOffset, availableHeight, padding, gap };
  }, [width, height, positionScale]);

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
        alignItems: "stretch",
        pointerEvents: "none",
        padding: `${layout.padding}px`,
        boxSizing: "border-box",
        gap: `${layout.gap}px`,
        borderLeft: `2px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.4)}`,
        background: `linear-gradient(270deg, ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.85)} 0%, ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.4)} 100%)`,
        backdropFilter: "blur(8px)",
        overflow: "hidden",
      }}
      data-testid="training-right-hud"
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
    </div>
  );
};

export default TrainingRightHUD;
