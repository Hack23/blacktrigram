/**
 * TrainingRightHUD - Right side panel for training screen
 *
 * Layout Order (gaming best practice - most referenced at top):
 * 1. Training Statistics (top) - Always visible, most checked
 * 2. Training Mode Selector (middle) - Changed occasionally
 * 3. Vital Point / Footwork Panel (bottom) - Contextual
 *
 * Gaming Layout Best Practice:
 * - Width: 15% of screen (mobile: 18%)
 * - Height: Between top/bottom bars
 * - Scrollable vital point section for long lists
 *
 * @korean 훈련화면 오른쪽 패널 - 통계(상), 모드(중), 급소(하)
 */

import React from "react";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
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

/** HUD width - slightly narrower for more arena space */
const HUD_WIDTH_PERCENT_DESKTOP = 14;
const HUD_WIDTH_PERCENT_MOBILE = 18;

/** Top/Bottom bar heights (must match those components) */
const TOP_HUD_HEIGHT_DESKTOP = 70;
const TOP_HUD_HEIGHT_MOBILE = 50;
const BOTTOM_HUD_HEIGHT_DESKTOP = 130;
const BOTTOM_HUD_HEIGHT_MOBILE = 110;

export interface TrainingRightHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Whether mobile layout is active */
  readonly isMobile: boolean;
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
 */
export const TrainingRightHUD: React.FC<TrainingRightHUDProps> = ({
  width,
  height,
  isMobile,
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
    const hudWidthPercent = isMobile
      ? HUD_WIDTH_PERCENT_MOBILE
      : HUD_WIDTH_PERCENT_DESKTOP;
    const hudWidth = Math.round((width * hudWidthPercent) / 100);

    const scaledTopHeight = isMobile
      ? TOP_HUD_HEIGHT_MOBILE
      : TOP_HUD_HEIGHT_DESKTOP * positionScale;
    const scaledBottomHeight = isMobile
      ? BOTTOM_HUD_HEIGHT_MOBILE
      : BOTTOM_HUD_HEIGHT_DESKTOP * positionScale;

    const topOffset = scaledTopHeight;
    const bottomOffset = scaledBottomHeight;
    const availableHeight = height - topOffset - bottomOffset;

    const padding = isMobile ? 8 : 10 * positionScale;
    const gap = isMobile ? 6 : 8 * positionScale;

    return { hudWidth, topOffset, bottomOffset, availableHeight, padding, gap };
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
