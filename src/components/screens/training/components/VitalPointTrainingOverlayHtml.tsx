/**
 * VitalPointTrainingOverlayHtml - Html overlay for vital point selection
 * 
 * Provides vital point selection interface with consistent Korean martial arts theming.
 * 
 * @module components/screens/training/components/VitalPointTrainingOverlayHtml
 * @category Training UI
 * @korean 급소훈련오버레이
 */

import React, { useMemo } from "react";
import { KOREAN_VITAL_POINTS } from "../../../../systems/vitalpoint/KoreanVitalPoints";
import { VitalPointSeverity } from "../../../../types/common";
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
  getNeonGlowEffect,
} from "../../../../utils/visualEffects";
import "../training.css";

/**
 * Props for VitalPointTrainingOverlayHtml component
 */
export interface VitalPointTrainingOverlayHtmlProps {
  /** Currently selected vital point ID */
  readonly selectedVitalPoint: string | null;
  /** Callback when vital point is selected */
  readonly onVitalPointSelect: (vitalPointId: string) => void;
  /** Whether on mobile device */
  readonly isMobile: boolean;
}

/**
 * Get Korean color from severity
 * Maps vital point severity to KOREAN_COLORS constants
 * 
 * @korean 심각도별색상
 */
const getSeverityColor = (severity: VitalPointSeverity): number => {
  const colorMap: Record<VitalPointSeverity, number> = {
    [VitalPointSeverity.MINOR]: KOREAN_COLORS.POSITIVE_GREEN,
    [VitalPointSeverity.MODERATE]: KOREAN_COLORS.WARNING_ORANGE,
    [VitalPointSeverity.MAJOR]: KOREAN_COLORS.ACCENT_GOLD,
    [VitalPointSeverity.CRITICAL]: KOREAN_COLORS.ACCENT_RED,
    [VitalPointSeverity.LETHAL]: KOREAN_COLORS.PRIMARY_RED,
  };
  return colorMap[severity] ?? KOREAN_COLORS.TEXT_TERTIARY;
};

/**
 * Get difficulty stars
 */
const getDifficultyStars = (difficulty: number): string => {
  const stars = Math.ceil(difficulty * 5);
  return "★".repeat(Math.min(stars, 5)) + "☆".repeat(5 - Math.min(stars, 5));
};

/**
 * VitalPointTrainingOverlayHtml Component
 * Html overlay for vital point selection and information
 */
export const VitalPointTrainingOverlayHtml: React.FC<VitalPointTrainingOverlayHtmlProps> = ({
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
  const padding = getResponsiveSpacing("md", isMobile);

  // Enhanced panel styles with neon glow
  const panelStyle: React.CSSProperties = {
    ...getEnhancedKoreanOverlayStyles({
      opacity: 0.88,
      glowIntensity: "medium",
      includeGradient: false,
      includeBackdropBlur: true,
      depthLayers: 3,
    }),
    width: `${panelWidth}px`,
    maxHeight: `${maxHeight}px`,
    padding: `${padding}px`,
    overflow: "auto",
    border: `2px solid ${hexToRgbaString(KOREAN_COLORS.SECONDARY_MAGENTA, 0.9)}`,
  };

  return (
    <div
      style={panelStyle}
      data-testid="vital-point-training-html"
    >
      {/* Header with bilingual text */}
      <div style={{ marginBottom: `${SPACING.MD}px` }}>
        <div
          style={{
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: "bold",
            color: hexToRgbaString(KOREAN_COLORS.SECONDARY_MAGENTA),
            textShadow: getNeonTextShadow(KOREAN_COLORS.SECONDARY_MAGENTA, "medium"),
            transition: getSmoothTransition("all", "normal"),
          }}
        >
          {formatBilingualText("급소 선택", "Vital Point Selection", "pipe")}
        </div>
      </div>

      {/* Vital Points List */}
      <div style={{ display: "flex", flexDirection: "column", gap: `${SPACING.SM}px` }}>
        {availableVitalPoints.map((point) => {
          const isSelected = point.id === selectedVitalPoint;
          const severityColor = getSeverityColor(point.severity);
          const severityColorRgba = hexToRgbaString(severityColor);

          // Enhanced glow effect for selected vital points
          const glowEffect = isSelected 
            ? getNeonGlowEffect(KOREAN_COLORS.ACCENT_GOLD, "strong", true)
            : "none";

          return (
            <button
              key={point.id}
              onClick={() => onVitalPointSelect(point.id)}
              className={`vital-point-button ${isSelected ? "selected" : ""}`}
              style={{
                borderColor: isSelected 
                  ? hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD) 
                  : severityColorRgba,
                fontFamily: FONT_FAMILY.KOREAN,
                boxShadow: glowEffect,
                transition: getSmoothTransition("all", "normal"),
              }}
              data-testid={`vital-point-${point.id}`}
            >
              <div
                style={{
                  fontSize: isMobile ? "11px" : "12px",
                  fontWeight: "bold",
                  color: severityColorRgba,
                }}
              >
                {point.names.korean}
              </div>
              <div
                style={{
                  fontSize: isMobile ? "9px" : "10px",
                  color: hexToRgbaString(KOREAN_COLORS.TEXT_TERTIARY),
                }}
              >
                {point.names.english}
              </div>
              <div
                style={{
                  fontSize: isMobile ? "8px" : "9px",
                  color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD),
                  marginTop: `${SPACING.XS}px`,
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
            marginTop: `${SPACING.MD}px`,
            paddingTop: `${SPACING.MD}px`,
            borderTop: `1px solid ${hexToRgbaString(KOREAN_COLORS.TEXT_TERTIARY, 0.2)}`,
          }}
        >
          <div
            style={{
              fontSize: isMobile ? "11px" : "12px",
              fontWeight: "bold",
              color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN),
              marginBottom: `${SPACING.SM}px`,
              fontFamily: FONT_FAMILY.KOREAN,
            }}
          >
            {formatBilingualText("선택된 급소", "Selected Point", "pipe")}
          </div>
          <div
            style={{
              fontSize: isMobile ? "10px" : "11px",
              color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY),
              lineHeight: "1.4",
              fontFamily: FONT_FAMILY.KOREAN,
            }}
          >
            <div style={{ marginBottom: `${SPACING.XS}px` }}>
              <span style={{ color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD) }}>
                {formatBilingualText("위치", "Location", "parentheses")}:
              </span>{" "}
              {selectedPoint.category}
            </div>
            <div style={{ marginBottom: `${SPACING.XS}px` }}>
              <span style={{ color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD) }}>
                {formatBilingualText("심각도", "Severity", "parentheses")}:
              </span>{" "}
              {selectedPoint.severity}
            </div>
            <div
              style={{
                fontSize: isMobile ? "9px" : "10px",
                color: hexToRgbaString(KOREAN_COLORS.TEXT_TERTIARY),
                marginTop: `${SPACING.SM}px`,
              }}
            >
              {formatBilingualText(
                selectedPoint.description.korean, 
                selectedPoint.description.english, 
                "pipe"
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalPointTrainingOverlayHtml;
