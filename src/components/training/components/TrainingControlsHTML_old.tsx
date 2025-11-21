/**
 * TrainingControlsHTML - Html overlay for training controls
 * 
 * Migrated from PixiJS TrainingControlsPanel to Html overlay
 * for use with @react-three/drei Html component
 */

import React, { useEffect, useState } from "react";
import { FONT_FAMILY } from "../../../types/constants";

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
 * Html overlay for training start/stop controls
 */
export const TrainingControlsHTML: React.FC<TrainingControlsHTMLProps> = ({
  isTraining,
  onStartTraining,
  onStopTraining,
  isMobile,
}) => {
  const [animationTime, setAnimationTime] = useState(0);

  // Animation loop for pulsing effects
  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      setAnimationTime(elapsed);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const panelWidth = isMobile ? 260 : 280;
  const panelHeight = isMobile ? 120 : 140;

  // Calculate pulsing alpha for animations
  const innerAlpha = isTraining ? 0.5 + Math.sin(animationTime * 5) * 0.2 : 0.4;
  const statusPulse = isTraining ? 1 + Math.sin(animationTime * 6) * 0.4 : 1;

  const borderColor = isTraining
    ? `rgba(0, 255, 136, ${innerAlpha})`
    : `rgba(0, 255, 255, 0.9)`;

  const statusColor = isTraining
    ? "#00ff88"
    : "#888888";

  const buttonColor = isTraining
    ? "#ff4444"
    : "#00ff88";

  return (
    <div
      style={{
        width: `${panelWidth}px`,
        height: `${panelHeight}px`,
        background: `rgba(26, 26, 26, 0.85)`,
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

      {/* Status Indicator */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: statusColor,
          boxShadow: isTraining
            ? `0 0 ${8 * statusPulse}px ${statusColor}`
            : "none",
        }}
      />

      {/* Start/Stop Button */}
      <button
        onClick={isTraining ? onStopTraining : onStartTraining}
        data-testid="start-stop-button"
        style={{
          width: "100%",
          height: "40px",
          background: buttonColor,
          border: "2px solid rgba(255, 255, 255, 0.8)",
          borderRadius: "8px",
          color: "#ffffff",
          fontSize: isMobile ? "14px" : "16px",
          fontWeight: "bold",
          fontFamily: FONT_FAMILY.KOREAN,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "all 0.2s",
          marginBottom: "10px",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = `0 0 15px ${buttonColor}`;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
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
