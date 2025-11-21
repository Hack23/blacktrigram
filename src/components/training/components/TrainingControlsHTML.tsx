/**
 * TrainingControlsHTML - Html overlay for training controls
 * 
 * Migrated from PixiJS TrainingControlsPanel to Html overlay
 * Uses CSS animations instead of requestAnimationFrame for better performance
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
 * Html overlay for training start/stop controls with CSS animations
 */
export const TrainingControlsHTML: React.FC<TrainingControlsHTMLProps> = ({
  isTraining,
  onStartTraining,
  onStopTraining,
  isMobile,
}) => {
  const panelWidth = isMobile ? 260 : 280;
  const panelHeight = isMobile ? 120 : 140;

  const borderColor = isTraining
    ? "rgba(0, 255, 136, 0.9)"
    : "rgba(0, 255, 255, 0.9)";

  return (
    <div
      style={{
        width: `${panelWidth}px`,
        height: `${panelHeight}px`,
        background: "rgba(26, 26, 26, 0.85)",
        border: `2px solid ${borderColor}`,
        borderRadius: "12px",
        padding: "15px",
        fontFamily: FONT_FAMILY.KOREAN,
        color: "#ffffff",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        position: "relative",
      }}
      data-testid="training-controls-html"
    >
      {/* Header */}
      <div style={{ marginBottom: "10px" }}>
        <div
          style={{
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: "bold",
            color: "#ffd700",
          }}
        >
          훈련 조작
        </div>
        <div
          style={{
            fontSize: isMobile ? "10px" : "12px",
            color: "#999999",
            fontStyle: "italic",
          }}
        >
          Training Controls
        </div>
      </div>

      {/* Status Indicator with CSS animation */}
      <div
        className={`status-indicator ${isTraining ? "active" : "inactive"}`}
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
        }}
      />

      {/* Start/Stop Button with CSS hover */}
      <button
        onClick={isTraining ? onStopTraining : onStartTraining}
        className={`training-button ${isTraining ? "training-button-stop" : "training-button-start"}`}
        style={{
          fontSize: isMobile ? "14px" : "16px",
          fontFamily: FONT_FAMILY.KOREAN,
          marginBottom: "10px",
        }}
        data-testid="start-stop-button"
      >
        <span>{isTraining ? "⏹" : "▶"}</span>
        <span>{isTraining ? "중지" : "시작"}</span>
      </button>

      {/* Control Instructions */}
      <div
        style={{
          fontSize: isMobile ? "9px" : "10px",
          color: "#00ffff",
          marginTop: "auto",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "4px" }}>조작법:</div>
        <div style={{ color: "#999999" }}>
          WASD-이동 | Space-공격 | 1-8-자세
        </div>
      </div>
    </div>
  );
};

export default TrainingControlsHTML;
