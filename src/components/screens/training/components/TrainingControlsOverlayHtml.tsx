/**
 * TrainingControlsOverlayHtml - Html overlay for training controls
 * 
 * Displays start/stop button and training status with consistent Korean theming.
 * Uses KOREAN_COLORS constants and bilingual formatting.
 * 
 * @module components/screens/training
 * @category Training UI
 * @korean 훈련제어오버레이
 */

import React from "react";
import {
  FONT_FAMILY,
  KOREAN_COLORS,
} from "../../../../types/constants";
import { SPACING } from "../../../../types/constants/ui";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import {
  getKoreanOverlayBaseStyles,
  formatBilingualText,
  getResponsiveSpacing,
} from "../../../../utils/koreanThemeHelpers";
import "../training.css";

/**
 * Props for TrainingControlsOverlayHtml component
 */
export interface TrainingControlsOverlayHtmlProps {
  /** Whether training is currently active */
  readonly isTraining: boolean;
  /** Callback to start training */
  readonly onStartTraining: () => void;
  /** Callback to stop training */
  readonly onStopTraining: () => void;
  /** Whether on mobile device */
  readonly isMobile: boolean;
}

/**
 * TrainingControlsOverlayHtml Component
 * 
 * Html overlay showing training status and start/stop controls with Korean theming.
 * All colors use KOREAN_COLORS constants for consistency.
 * 
 * @example
 * ```tsx
 * <TrainingControlsOverlayHtml
 *   isTraining={true}
 *   onStartTraining={() => console.log('start')}
 *   onStopTraining={() => console.log('stop')}
 *   isMobile={false}
 * />
 * ```
 * 
 * @korean 훈련제어오버레이컴포넌트
 */
export const TrainingControlsOverlayHtml: React.FC<TrainingControlsOverlayHtmlProps> = ({
  isTraining,
  onStartTraining,
  onStopTraining,
  isMobile,
}) => {
  const panelWidth = isMobile ? 200 : 220;
  const panelHeight = isMobile ? 90 : 100;
  const padding = getResponsiveSpacing("sm", isMobile);

  // Use Korean colors for border based on training state
  const borderColor = hexToRgbaString(
    isTraining ? KOREAN_COLORS.ACCENT_GREEN : KOREAN_COLORS.ACCENT_RED,
    0.9
  );

  const panelStyle: React.CSSProperties = {
    ...getKoreanOverlayBaseStyles(0.85),
    width: `${panelWidth}px`,
    height: `${panelHeight}px`,
    padding: `${padding}px`,
    border: `2px solid ${borderColor}`,
    position: "relative",
  };

  const titleFontSize = isMobile ? 13 : 14;
  const infoFontSize = isMobile ? 9 : 10;

  return (
    <div style={panelStyle} data-testid="training-controls-html">
      {/* Header with bilingual status */}
      <div style={{ marginBottom: `${SPACING.SM}px` }}>
        <div
          style={{
            fontSize: `${titleFontSize}px`,
            fontWeight: "bold",
            color: hexToRgbaString(
              isTraining ? KOREAN_COLORS.ACCENT_GREEN : KOREAN_COLORS.ACCENT_RED
            ),
            fontFamily: FONT_FAMILY.KOREAN,
          }}
        >
          {formatBilingualText(
            isTraining ? "훈련 진행중" : "훈련 대기",
            isTraining ? "Training Active" : "Training Stopped",
            "pipe"
          )}
        </div>
      </div>

      {/* Status Indicator with CSS animation */}
      <div
        className={`status-indicator ${isTraining ? "active" : "inactive"}`}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
        }}
      />

      {/* Start/Stop Button with Korean theming */}
      <button
        onClick={isTraining ? onStopTraining : onStartTraining}
        className={`training-button ${isTraining ? "training-button-stop" : "training-button-start"}`}
        style={{
          fontSize: `${titleFontSize}px`,
          fontFamily: FONT_FAMILY.KOREAN,
          height: "35px",
        }}
        data-testid="training-toggle-button"
        data-training-state={isTraining ? "active" : "inactive"}
      >
        <span>{isTraining ? "⏹" : "▶"}</span>
        <span>
          {formatBilingualText(
            isTraining ? "중지" : "시작",
            isTraining ? "Stop" : "Start",
            "pipe"
          )}
        </span>
      </button>

      {/* Info text about auto-restart with Korean colors */}
      {!isTraining && (
        <div
          style={{
            fontSize: `${infoFontSize}px`,
            color: hexToRgbaString(KOREAN_COLORS.TEXT_TERTIARY),
            textAlign: "center",
            marginTop: `${SPACING.XS}px`,
            fontFamily: FONT_FAMILY.KOREAN,
            lineHeight: "1.4",
          }}
        >
          <div>모드 변경시 자동 재시작</div>
          <div>Auto-restarts on mode change</div>
        </div>
      )}
    </div>
  );
};

export default TrainingControlsOverlayHtml;
