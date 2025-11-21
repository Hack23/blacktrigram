/**
 * TrainingModeSelectorHTML - Html overlay for training mode selection
 * 
 * Allows switching between different training modes
 */

import React from "react";
import { FONT_FAMILY } from "../../../types/constants";
import "../training.css";

/**
 * Training mode types
 */
export type TrainingMode = "basics" | "advanced" | "free";

/**
 * Props for TrainingModeSelectorHTML component
 */
export interface TrainingModeSelectorHTMLProps {
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
const MODE_INFO: Record<TrainingMode, { korean: string; english: string; description: string }> = {
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
    english: "Free Training",
    description: "제한 없는 연습 | Unrestricted practice",
  },
};

/**
 * TrainingModeSelectorHTML Component
 * Html overlay for selecting training mode
 */
export const TrainingModeSelectorHTML: React.FC<TrainingModeSelectorHTMLProps> = ({
  currentMode,
  onModeChange,
  isMobile,
}) => {
  const panelWidth = isMobile ? 260 : 300;

  return (
    <div
      style={{
        width: `${panelWidth}px`,
        background: "rgba(26, 26, 26, 0.85)",
        border: "2px solid rgba(0, 255, 255, 0.9)",
        borderRadius: "12px",
        padding: "15px",
        fontFamily: FONT_FAMILY.KOREAN,
        color: "#ffffff",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
      }}
      data-testid="training-mode-selector-html"
    >
      {/* Header */}
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: "bold",
            color: "#00ffff",
          }}
        >
          훈련 모드
        </div>
        <div
          style={{
            fontSize: isMobile ? "10px" : "12px",
            color: "#999999",
            fontStyle: "italic",
          }}
        >
          Training Mode
        </div>
      </div>

      {/* Mode Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {(Object.keys(MODE_INFO) as TrainingMode[]).map((mode) => {
          const isSelected = mode === currentMode;
          const info = MODE_INFO[mode];

          return (
            <button
              key={mode}
              onClick={() => onModeChange(mode)}
              className={`mode-button ${isSelected ? "selected" : ""}`}
              style={{
                padding: "10px",
                textAlign: "left",
              }}
              data-testid={`mode-${mode}`}
            >
              <div
                style={{
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "bold",
                  color: isSelected ? "#00ffff" : "#ffffff",
                  marginBottom: "4px",
                }}
              >
                {info.korean}
              </div>
              <div
                style={{
                  fontSize: isMobile ? "10px" : "11px",
                  color: "#999999",
                  marginBottom: "6px",
                }}
              >
                {info.english}
              </div>
              <div
                style={{
                  fontSize: isMobile ? "9px" : "10px",
                  color: "#888888",
                  lineHeight: "1.3",
                }}
              >
                {info.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TrainingModeSelectorHTML;
