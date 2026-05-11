/**
 * TrainingModeSelectorOverlayHtml - Html overlay for training mode selection
 *
 * Allows switching between different training modes with consistent Korean theming.
 * Uses KOREAN_COLORS constants and bilingual formatting.
 *
 * @module components/screens/training
 * @category Training UI
 * @korean 훈련모드선택오버레이
 */

import React from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { SPACING } from "../../../../types/constants/ui";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import {
  formatBilingualText,
  getEnhancedKoreanOverlayStyles,
  getResponsiveSpacing,
} from "../../../../utils/koreanThemeHelpers";
import {
  getNeonTextShadow,
  getSmoothTransition,
} from "../../../../utils/visualEffects";
import "../training.css";

/**
 * Training mode types
 */
export type TrainingMode =
  | "basics" // Basic Training - Simple striking practice
  | "advanced" // Advanced Training - Vital point precision
  | "free" // Free Practice - Open combat vs AI
  | "stance_training" // Stance Training - Practice 8 trigrams
  | "vital_point" // Vital Point Training - Precision targeting
  | "combo_practice" // Combo Practice - Multi-hit techniques
  | "footwork"; // Footwork Training - Movement drills (보법 훈련)

/**
 * Props for TrainingModeSelectorOverlayHtml component
 */
export interface TrainingModeSelectorOverlayHtmlProps {
  /** Currently selected training mode */
  readonly currentMode: TrainingMode;
  /** Callback when mode changes */
  readonly onModeChange: (mode: TrainingMode) => void;
  /** Whether on mobile device */
  readonly isMobile: boolean;
}

/**
 * Mode information
 */
const MODE_INFO: Record<
  TrainingMode,
  { korean: string; english: string; description: string }
> = {
  basics: {
    korean: "기본 훈련",
    english: "Basic Training",
    description: "기초 타격 연습 | Basic striking practice",
  },
  advanced: {
    korean: "고급 훈련",
    english: "Advanced Training",
    description: "급소 정밀 타격 | Vital point precision",
  },
  free: {
    korean: "자유 훈련",
    english: "Free Practice",
    description: "AI 대련 | Combat vs AI opponent",
  },
  stance_training: {
    korean: "팔괘 수련",
    english: "Stance Training",
    description: "팔괘 전환 연습 | Eight trigrams mastery",
  },
  vital_point: {
    korean: "급소 훈련",
    english: "Vital Point Training",
    description: "정밀 타격 연습 | Precision targeting drill",
  },
  combo_practice: {
    korean: "연속 기술",
    english: "Combo Practice",
    description: "연속 타격 훈련 | Multi-hit techniques",
  },
  footwork: {
    korean: "보법 훈련",
    english: "Footwork Training",
    description: "보법 수련 | Movement drills",
  },
};

/**
 * TrainingModeSelectorOverlayHtml Component
 *
 * Html overlay for selecting training mode with Korean theming.
 * Compact horizontal grid layout optimized for desktop and mobile.
 *
 * Optimized with React.memo for 60fps performance:
 * - Prevents re-renders when currentMode hasn't changed
 * - Callback expected to be stable (parent should use useCallback)
 *
 * @example
 * ```tsx
 * <TrainingModeSelectorOverlayHtml
 *   currentMode="vital_point"
 *   onModeChange={(mode) => console.log(mode)}
 *   isMobile={false}
 * />
 * ```
 *
 * @korean 훈련모드선택오버레이컴포넌트
 */
export const TrainingModeSelectorOverlayHtml =
  React.memo<TrainingModeSelectorOverlayHtmlProps>(
    ({ currentMode, onModeChange, isMobile }) => {
      const padding = getResponsiveSpacing("sm", isMobile);
      const gap = getResponsiveSpacing("xs", isMobile);

      const panelStyle: React.CSSProperties = {
        ...getEnhancedKoreanOverlayStyles({
          opacity: 0.9,
          glowIntensity: "medium",
          includeGradient: false,
          includeBackdropBlur: true,
          depthLayers: 3,
        }),
        width: "100%",
        padding: `${padding}px`,
        boxSizing: "border-box",
      };

      const titleFontSize = isMobile ? 13 : 15;
      const descFontSize = isMobile ? 9 : 10;

      return (
        <div style={panelStyle} data-testid="training-mode-selector-html">
          {/* Header with bilingual title */}
          <div style={{ marginBottom: `${SPACING.SM}px`, textAlign: "center" }}>
            <div
              style={{
                fontSize: `${titleFontSize}px`,
                fontWeight: "bold",
                color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN),
                fontFamily: FONT_FAMILY.KOREAN,
                textShadow: getNeonTextShadow(
                  KOREAN_COLORS.PRIMARY_CYAN,
                  "medium",
                ),
                transition: getSmoothTransition("all", "normal"),
              }}
            >
              {formatBilingualText("훈련 모드", "Training Mode", "pipe")}
            </div>
            <div
              style={{
                fontSize: `${descFontSize}px`,
                color: hexToRgbaString(KOREAN_COLORS.TEXT_TERTIARY),
                fontStyle: "italic",
                marginTop: "2px",
                minHeight: "16px",
                fontFamily: FONT_FAMILY.KOREAN,
                transition: getSmoothTransition("all", "normal"),
              }}
            >
              {MODE_INFO[currentMode].description}
            </div>
          </div>

          {/* Mode Buttons - Grid layout (2 columns to fit narrow side HUD) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: `${gap}px`,
            }}
          >
            {(Object.keys(MODE_INFO) as TrainingMode[]).map((mode) => {
              const isSelected = mode === currentMode;
              const info = MODE_INFO[mode];

              return (
                <button
                  key={mode}
                  onClick={() => onModeChange(mode)}
                  className={`mode-button ${isSelected ? "selected" : ""}`}
                  style={{
                    padding: isMobile ? "6px 4px" : "8px 6px",
                    textAlign: "center",
                    fontSize: isMobile ? "10px" : "11px",
                    minHeight: isMobile ? "45px" : "50px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: FONT_FAMILY.KOREAN,
                  }}
                  data-testid={`mode-${mode}`}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      color: hexToRgbaString(
                        isSelected
                          ? KOREAN_COLORS.PRIMARY_CYAN
                          : KOREAN_COLORS.TEXT_PRIMARY,
                      ),
                      fontSize: isMobile ? "11px" : "12px",
                      marginBottom: "2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%",
                      minWidth: 0,
                    }}
                  >
                    {info.korean}
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? "8px" : "9px",
                      color: hexToRgbaString(
                        isSelected
                          ? KOREAN_COLORS.ACCENT_GOLD
                          : KOREAN_COLORS.TEXT_TERTIARY,
                      ),
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%",
                      minWidth: 0,
                    }}
                  >
                    {info.english}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    },
    (prevProps, nextProps) => {
      return (
        prevProps.currentMode === nextProps.currentMode &&
        prevProps.isMobile === nextProps.isMobile &&
        prevProps.onModeChange === nextProps.onModeChange
      );
    },
  );

TrainingModeSelectorOverlayHtml.displayName = "TrainingModeSelectorOverlayHtml";

export default TrainingModeSelectorOverlayHtml;
