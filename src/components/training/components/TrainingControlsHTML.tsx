/**
 * TrainingControlsHTML - Html overlay for training controls
 * 
 * Simplified to show only stop button and status, as training auto-starts
 */

import React from "react";
import { FONT_FAMILY } from "../../../types/constants";
import "../training.css";

/**
 * Props for TrainingControlsHTML component
 */
export interface TrainingControlsHTMLProps {
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
 * TrainingControlsHTML Component
 * Html overlay showing training status and stop control
 */
export const TrainingControlsHTML: React.FC<TrainingControlsHTMLProps> = ({
  isTraining,
  onStopTraining,
  isMobile,
}) => {
  const panelWidth = isMobile ? 200 : 220;
  const panelHeight = isMobile ? 90 : 100;

  const borderColor = isTraining
    ? "rgba(0, 255, 136, 0.9)"
    : "rgba(255, 68, 68, 0.9)";

  return (
    <div
      style={{
        width: `${panelWidth}px`,
        height: `${panelHeight}px`,
        background: "rgba(26, 26, 26, 0.85)",
        border: `2px solid ${borderColor}`,
        borderRadius: "12px",
        padding: "12px",
        fontFamily: FONT_FAMILY.KOREAN,
        color: "#ffffff",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        position: "relative",
      }}
      data-testid="training-controls-html"
    >
      {/* Header */}
      <div style={{ marginBottom: "8px" }}>
        <div
          style={{
            fontSize: isMobile ? "13px" : "14px",
            fontWeight: "bold",
            color: isTraining ? "#00ff88" : "#ff4444",
          }}
        >
          {isTraining ? "훈련 진행중" : "훈련 중지"}
        </div>
        <div
          style={{
            fontSize: isMobile ? "9px" : "10px",
            color: "#999999",
            fontStyle: "italic",
          }}
        >
          {isTraining ? "Training Active" : "Training Stopped"}
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

      {/* Stop Button - only show when training is active */}
      {isTraining && (
        <button
          onClick={onStopTraining}
          className="training-button training-button-stop"
          style={{
            fontSize: isMobile ? "13px" : "14px",
            fontFamily: FONT_FAMILY.KOREAN,
            height: "35px",
          }}
          data-testid="stop-button"
        >
          <span>⏹</span>
          <span>중지 | Stop</span>
        </button>
      )}

      {/* Info text when stopped */}
      {!isTraining && (
        <div
          style={{
            fontSize: isMobile ? "9px" : "10px",
            color: "#999999",
            textAlign: "center",
            marginTop: "4px",
          }}
        >
          모드 변경시 자동 재시작
          <br />
          Auto-restarts on mode change
        </div>
      )}
    </div>
  );
};

export default TrainingControlsHTML;
