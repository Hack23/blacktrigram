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
export type TrainingMode = 
  | "basics"              // Basic Training - Simple striking practice
  | "advanced"            // Advanced Training - Vital point precision
  | "free"                // Free Practice - Open combat vs AI
  | "stance_training"     // Stance Training - Practice 8 trigrams
  | "vital_point"         // Vital Point Training - Precision targeting
  | "combo_practice";     // Combo Practice - Multi-hit techniques

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
};

/**
 * TrainingModeSelectorHTML Component
 * Html overlay for selecting training mode - Compact horizontal layout
 */
export const TrainingModeSelectorHTML: React.FC<TrainingModeSelectorHTMLProps> = ({
  currentMode,
  onModeChange,
  isMobile,
}) => {
  const panelWidth = isMobile ? 280 : 320;

  return (
    <div
      style={{
        width: `${panelWidth}px`,
        background: "rgba(26, 26, 26, 0.9)",
        border: "2px solid rgba(0, 255, 255, 0.9)",
        borderRadius: "12px",
        padding: isMobile ? "10px" : "12px",
        fontFamily: FONT_FAMILY.KOREAN,
        color: "#ffffff",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
      }}
      data-testid="training-mode-selector-html"
    >
      {/* Header */}
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <div
          style={{
            fontSize: isMobile ? "13px" : "15px",
            fontWeight: "bold",
            color: "#00ffff",
          }}
        >
          훈련 모드 | Training Mode
        </div>
        <div
          style={{
            fontSize: isMobile ? "9px" : "10px",
            color: "#999999",
            fontStyle: "italic",
            marginTop: "2px",
            minHeight: "16px",
          }}
        >
          {MODE_INFO[currentMode].description}
        </div>
      </div>

      {/* Mode Buttons - Horizontal Grid */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: panelWidth < 280 ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          gap: "6px" 
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
              }}
              data-testid={`mode-${mode}`}
              title={info.description}
            >
              <div
                style={{
                  fontWeight: "bold",
                  color: isSelected ? "#00ffff" : "#ffffff",
                  fontSize: isMobile ? "11px" : "12px",
                  marginBottom: "2px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                {info.korean}
              </div>
              <div
                style={{
                  fontSize: isMobile ? "8px" : "9px",
                  color: isSelected ? "#ffd700" : "#999999",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
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
};

export default TrainingModeSelectorHTML;
