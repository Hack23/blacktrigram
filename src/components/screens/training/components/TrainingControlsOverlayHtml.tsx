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
  formatBilingualText,
  getEnhancedKoreanOverlayStyles,
  getKoreanButtonWithGlow,
  getResponsiveSpacing,
} from "../../../../utils/koreanThemeHelpers";
import {
  getNeonTextShadow,
  getSmoothTransition,
} from "../../../../utils/visualEffects";
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
  /** Compact mode for embedding inside the slim top HUD */
  readonly variant?: "panel" | "compact";
}

/**
 * TrainingControlsOverlayHtml Component
 * 
 * Html overlay showing training status and start/stop controls with Korean theming.
 * All colors use KOREAN_COLORS constants for consistency.
 *
 * Optimized with React.memo for 60fps performance:
 * - Prevents re-renders when isTraining state hasn't changed
 * - Callbacks expected to be stable (parent should use useCallback)
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
export const TrainingControlsOverlayHtml = React.memo<TrainingControlsOverlayHtmlProps>(
  ({
    isTraining,
    onStartTraining,
    onStopTraining,
    isMobile,
    variant = "panel",
  }) => {
  const isCompact = variant === "compact";
  const panelWidth = isCompact ? (isMobile ? 180 : 210) : isMobile ? 200 : 220;
  const panelHeight = isCompact ? (isMobile ? 40 : 44) : isMobile ? 90 : 100;
  const padding = isCompact ? getResponsiveSpacing("xs", isMobile) : getResponsiveSpacing("sm", isMobile);

  // Use Korean colors for border based on training state
  const stateColor = isTraining ? KOREAN_COLORS.ACCENT_GREEN : KOREAN_COLORS.ACCENT_RED;
  const borderColor = hexToRgbaString(stateColor, 0.9);

  // Enhanced panel styles with neon glow
  const panelStyle: React.CSSProperties = {
    ...getEnhancedKoreanOverlayStyles({
      opacity: 0.88,
      glowIntensity: isTraining ? "medium" : "subtle",
      includeGradient: false,
      includeBackdropBlur: true,
      depthLayers: 2,
    }),
    width: `${panelWidth}px`,
    height: `${panelHeight}px`,
    padding: `${padding}px`,
    border: `2px solid ${borderColor}`,
    position: "relative",
    display: "flex",
    flexDirection: isCompact ? "row" : "column",
    alignItems: isCompact ? "center" : "stretch",
    justifyContent: isCompact ? "space-between" : "flex-start",
    gap: `${padding}px`,
    boxSizing: "border-box",
    fontFamily: FONT_FAMILY.KOREAN,
  };

  // Enhanced button styles (memoized, interaction states handled internally by getKoreanButtonWithGlow)
  const buttonStyles = React.useMemo(
    () =>
      getKoreanButtonWithGlow({
        variant: isTraining ? "danger" : "success",
        glowIntensity: "strong",
        hoverAnimation: "combined",
      }),
    [isTraining]
  );

  const titleFontSize = isCompact ? (isMobile ? 11 : 12) : isMobile ? 13 : 14;
  const infoFontSize = isMobile ? 9 : 10;

  return (
    <div style={panelStyle} data-testid="training-controls-html">
      {/* Header with bilingual status */}
      <div style={{ marginBottom: isCompact ? 0 : `${SPACING.SM}px`, minWidth: 0 }}>
        <div
          style={{
            fontSize: `${titleFontSize}px`,
            fontWeight: "bold",
            color: hexToRgbaString(stateColor),
            textShadow: getNeonTextShadow(stateColor, isTraining ? "medium" : "subtle"),
            transition: getSmoothTransition("all", "normal"),
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
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
          top: isCompact ? "6px" : "12px",
          right: isCompact ? "6px" : "12px",
        }}
      />

      {/* Start/Stop Button with Korean theming */}
      <button
        onClick={isTraining ? onStopTraining : onStartTraining}
        className={`training-button ${isTraining ? "training-button-stop" : "training-button-start"}`}
        style={{
          ...buttonStyles,
          // Note: fontSize from buttonStyles is intentionally overridden with titleFontSize
          // to maintain consistent sizing with the training header/title typography
          fontSize: `${titleFontSize}px`,
          height: isCompact ? "30px" : "35px",
          minWidth: isCompact ? "72px" : undefined,
          padding: isCompact ? "4px 8px" : buttonStyles.padding,
          flexShrink: 0,
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
      {!isCompact && !isTraining && (
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
  },
  (prevProps, nextProps) => {
    // Re-render when training state, mobile state, or callbacks change
    // Including callback props here avoids stale-closure issues where the
    // component would keep calling outdated handlers that reference old state.
    return (
      prevProps.isTraining === nextProps.isTraining &&
      prevProps.isMobile === nextProps.isMobile &&
      prevProps.onStartTraining === nextProps.onStartTraining &&
      prevProps.onStopTraining === nextProps.onStopTraining
    );
  },
);

TrainingControlsOverlayHtml.displayName = "TrainingControlsOverlayHtml";

export default TrainingControlsOverlayHtml;
