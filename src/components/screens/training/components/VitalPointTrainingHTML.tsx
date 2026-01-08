/**
 * VitalPointTrainingHTML - Html overlay for vital point selection
 * 
 */

import React, { useMemo } from "react";
import { KOREAN_VITAL_POINTS } from "../../../../../systems/vitalpoint/KoreanVitalPoints";
import { VitalPointSeverity } from "../../../../../types/common";
import { FONT_FAMILY } from "../../../../../types/constants";
import "../training.css";

/**
 * Props for VitalPointTrainingHTML component
 */
export interface VitalPointTrainingHTMLProps {
  /** Currently selected vital point ID */
  readonly selectedVitalPoint: string | null;
  /** Callback when vital point is selected */
  readonly onVitalPointSelect: (vitalPointId: string) => void;
  /** Whether on mobile device */
  readonly isMobile: boolean;
}

/**
 * Get color hex string from severity
 */
const getSeverityColorHex = (severity: VitalPointSeverity): string => {
  const colorMap: Record<VitalPointSeverity, string> = {
    [VitalPointSeverity.MINOR]: "#00ff88",
    [VitalPointSeverity.MODERATE]: "#ffaa00",
    [VitalPointSeverity.MAJOR]: "#ffd700",
    [VitalPointSeverity.CRITICAL]: "#ff4444",
    [VitalPointSeverity.LETHAL]: "#ff0000",
  };
  return colorMap[severity] ?? "#999999";
};

/**
 * Get difficulty stars
 */
const getDifficultyStars = (difficulty: number): string => {
  const stars = Math.ceil(difficulty * 5);
  return "★".repeat(Math.min(stars, 5)) + "☆".repeat(5 - Math.min(stars, 5));
};

/**
 * VitalPointTrainingHTML Component
 * Html overlay for vital point selection and information
 */
export const VitalPointTrainingHTML: React.FC<VitalPointTrainingHTMLProps> = ({
  selectedVitalPoint,
  onVitalPointSelect,
  isMobile,
}) => {
  // Use first 8 vital points for training panel
  const availableVitalPoints = useMemo(
    () => KOREAN_VITAL_POINTS.slice(0, isMobile ? 4 : 8),
    [isMobile]
  );

  const selectedPoint = useMemo(
    () => availableVitalPoints.find((p) => p.id === selectedVitalPoint),
    [availableVitalPoints, selectedVitalPoint]
  );

  const panelWidth = isMobile ? 240 : 280;
  const maxHeight = isMobile ? 300 : 400;

  return (
    <div
      style={{
        width: `${panelWidth}px`,
        maxHeight: `${maxHeight}px`,
        background: "rgba(26, 26, 26, 0.85)",
        border: "2px solid rgba(255, 0, 255, 0.9)",
        borderRadius: "12px",
        padding: "15px",
        fontFamily: FONT_FAMILY.KOREAN,
        color: "#ffffff",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        overflow: "auto",
      }}
      data-testid="vital-point-training-html"
    >
      {/* Header */}
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: "bold",
            color: "#ff00ff",
          }}
        >
          급소 선택
        </div>
        <div
          style={{
            fontSize: isMobile ? "10px" : "12px",
            color: "#999999",
            fontStyle: "italic",
          }}
        >
          Vital Point Selection
        </div>
      </div>

      {/* Vital Points List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {availableVitalPoints.map((point) => {
          const isSelected = point.id === selectedVitalPoint;
          const severityColor = getSeverityColorHex(point.severity);

          return (
            <button
              key={point.id}
              onClick={() => onVitalPointSelect(point.id)}
              className={`vital-point-button ${isSelected ? "selected" : ""}`}
              style={{
                borderColor: isSelected ? "#ffd700" : severityColor,
              }}
              data-testid={`vital-point-${point.id}`}
            >
              <div
                style={{
                  fontSize: isMobile ? "11px" : "12px",
                  fontWeight: "bold",
                  color: severityColor,
                }}
              >
                {point.names.korean}
              </div>
              <div
                style={{
                  fontSize: isMobile ? "9px" : "10px",
                  color: "#999999",
                }}
              >
                {point.names.english}
              </div>
              <div
                style={{
                  fontSize: isMobile ? "8px" : "9px",
                  color: "#ffd700",
                  marginTop: "4px",
                }}
              >
                {getDifficultyStars(point.targetingDifficulty ?? 0.5)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Point Details */}
      {selectedPoint && (
        <div
          style={{
            marginTop: "15px",
            paddingTop: "15px",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <div
            style={{
              fontSize: isMobile ? "11px" : "12px",
              fontWeight: "bold",
              color: "#00ffff",
              marginBottom: "8px",
            }}
          >
            선택된 급소 | Selected Point
          </div>
          <div
            style={{
              fontSize: isMobile ? "10px" : "11px",
              color: "#ffffff",
              lineHeight: "1.4",
            }}
          >
            <div style={{ marginBottom: "4px" }}>
              <span style={{ color: "#ffd700" }}>위치:</span>{" "}
              {selectedPoint.category}
            </div>
            <div style={{ marginBottom: "4px" }}>
              <span style={{ color: "#ffd700" }}>심각도:</span>{" "}
              {selectedPoint.severity}
            </div>
            <div
              style={{
                fontSize: isMobile ? "9px" : "10px",
                color: "#888888",
                marginTop: "8px",
              }}
            >
              {selectedPoint.description.korean} | {selectedPoint.description.english}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalPointTrainingHTML;
