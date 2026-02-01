/**
 * LiPrecisionTargetingOverlay.tsx
 *
 * Targeting reticle and vital point display for Li (Fire) stance precision strikes.
 * Shows available vital points, targeting accuracy, and precision feedback.
 *
 * Features:
 * - Dynamic targeting reticle with crosshair
 * - Vital points in range with distance indicators
 * - Real-time accuracy meter
 * - Korean cyberpunk aesthetic with neon glow effects
 * - Bilingual text (Korean/English)
 *
 * Performance: Optimized for 60fps with minimal DOM updates
 *
 * @module components/screens/combat/components/effects/LiPrecisionTargetingOverlay
 * @korean 리괘정밀조준오버레이
 */

import React, { useMemo, useEffect } from "react";
import { KOREAN_VITAL_POINTS } from "../../../../../systems/vitalpoint/KoreanVitalPoints";
import { KOREAN_COLORS, SPACING } from "../../../../../types/constants";
import { FONT_SIZES } from "../../../../../types/constants/typography";
import {
  formatBilingualText,
  getEnhancedKoreanOverlayStyles,
} from "../../../../../utils/koreanThemeHelpers";
import {
  getNeonGlowEffect,
  getNeonTextShadow,
} from "../../../../../utils/visualEffects";
import { hexToRgbaString } from "../../../../../utils/colorUtils";

/**
 * Props for LiPrecisionTargetingOverlay component
 */
export interface LiPrecisionTargetingOverlayProps {
  /** Whether the player is currently in Li stance */
  readonly isLiStance: boolean;
  /** Current targeting accuracy (0.0 to 1.0) */
  readonly accuracy: number;
  /** Player position for range calculation [x, y] */
  readonly playerPosition: readonly [number, number];
  /** Maximum targeting range in meters */
  readonly maxRange?: number;
  /** Currently selected/hovered vital point ID */
  readonly selectedVitalPointId: string | null;
  /** Callback when vital point is selected */
  readonly onVitalPointSelect?: (vitalPointId: string) => void;
  /** Whether on mobile device */
  readonly isMobile: boolean;
}

/**
 * Calculate distance between two positions
 */
function calculateDistance(
  pos1: readonly [number, number],
  pos2: { x: number; y: number }
): number {
  const dx = pos1[0] - pos2.x;
  const dy = pos1[1] - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Get accuracy color based on precision level
 */
function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 0.9) return hexToRgbaString(KOREAN_COLORS.POSITIVE_GREEN, 1.0);
  if (accuracy >= 0.7) return hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1.0);
  if (accuracy >= 0.5) return hexToRgbaString(KOREAN_COLORS.WARNING_ORANGE, 1.0);
  return hexToRgbaString(KOREAN_COLORS.ACCENT_RED, 1.0);
}

/**
 * LiPrecisionTargetingOverlay Component
 *
 * Displays targeting UI for Li stance precision strikes with vital point overlay
 */
export const LiPrecisionTargetingOverlay: React.FC<LiPrecisionTargetingOverlayProps> =
  React.memo(
    ({
      isLiStance,
      accuracy,
      playerPosition,
      maxRange = 3.0,
      selectedVitalPointId,
      onVitalPointSelect,
      isMobile,
    }) => {
      // Inject keyframe animation once on mount
      useEffect(() => {
        const styleId = "li-precision-targeting-keyframes";
        
        // Check if already injected
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
          @keyframes pulse-reticle {
            0%, 100% {
              transform: scale(1);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.05);
              opacity: 1.0;
            }
          }
        `;
        document.head.appendChild(style);
        
        return () => {
          const existingStyle = document.getElementById(styleId);
          if (existingStyle) {
            document.head.removeChild(existingStyle);
          }
        };
      }, []);
      
      // Filter vital points in range (hooks must be called unconditionally)
      const vitalPointsInRange = useMemo(() => {
        if (!isLiStance) return [];
        
        return KOREAN_VITAL_POINTS.filter((vp) => {
          const distance = calculateDistance(playerPosition, vp.position);
          return distance <= maxRange;
        })
          .sort((a, b) => {
            // Sort by distance (closest first)
            const distA = calculateDistance(playerPosition, a.position);
            const distB = calculateDistance(playerPosition, b.position);
            return distA - distB;
          })
          .slice(0, isMobile ? 3 : 5); // Limit to 3 on mobile, 5 on desktop
      }, [isLiStance, playerPosition, maxRange, isMobile]);

      // Only show when in Li stance
      if (!isLiStance) return null;

      // Accuracy percentage
      const accuracyPercent = Math.round(accuracy * 100);
      const accuracyColor = getAccuracyColor(accuracy);

      // Container styles
      const containerStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: SPACING.md,
      };

      // Targeting reticle styles
      const reticleContainerStyle: React.CSSProperties = {
        position: "relative",
        width: isMobile ? "120px" : "150px",
        height: isMobile ? "120px" : "150px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      };

      const reticleStyle: React.CSSProperties = {
        width: "100%",
        height: "100%",
        border: `2px solid ${hexToRgbaString(KOREAN_COLORS.TRIGRAM_LI_PRIMARY, 0.8)}`,
        borderRadius: "50%",
        boxShadow: getNeonGlowEffect(KOREAN_COLORS.TRIGRAM_LI_PRIMARY, "medium", true),
        animation: "pulse-reticle 2s ease-in-out infinite",
      };

      const crosshairHorizontalStyle: React.CSSProperties = {
        position: "absolute",
        top: "50%",
        left: "10%",
        right: "10%",
        height: "2px",
        backgroundColor: hexToRgbaString(KOREAN_COLORS.TRIGRAM_LI_PRIMARY, 0.8),
        transform: "translateY(-50%)",
        boxShadow: getNeonGlowEffect(KOREAN_COLORS.TRIGRAM_LI_PRIMARY, "subtle", false),
      };

      const crosshairVerticalStyle: React.CSSProperties = {
        position: "absolute",
        left: "50%",
        top: "10%",
        bottom: "10%",
        width: "2px",
        backgroundColor: hexToRgbaString(KOREAN_COLORS.TRIGRAM_LI_PRIMARY, 0.8),
        transform: "translateX(-50%)",
        boxShadow: getNeonGlowEffect(KOREAN_COLORS.TRIGRAM_LI_PRIMARY, "subtle", false),
      };

      const centerDotStyle: React.CSSProperties = {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: hexToRgbaString(KOREAN_COLORS.TRIGRAM_LI_PRIMARY, 1.0),
        transform: "translate(-50%, -50%)",
        boxShadow: getNeonGlowEffect(KOREAN_COLORS.TRIGRAM_LI_PRIMARY, "strong", true),
      };

      // Accuracy meter styles
      const accuracyMeterStyle: React.CSSProperties = {
        ...getEnhancedKoreanOverlayStyles({
          opacity: 0.85,
          glowIntensity: "medium",
          includeGradient: false,
          includeBackdropBlur: true,
          depthLayers: 2,
        }),
        padding: isMobile ? SPACING.xs : SPACING.sm,
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: SPACING.xs,
      };

      const accuracyLabelStyle: React.CSSProperties = {
        fontSize: isMobile ? `${FONT_SIZES.tiny}px` : `${FONT_SIZES.small}px`,
        color: hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY, 1.0),
        textShadow: getNeonTextShadow(KOREAN_COLORS.TEXT_SECONDARY, "subtle"),
        fontWeight: 500,
        letterSpacing: "0.5px",
      };

      const accuracyValueStyle: React.CSSProperties = {
        fontSize: isMobile ? `${FONT_SIZES.large}px` : `${FONT_SIZES.xlarge}px`,
        color: accuracyColor,
        textShadow: getNeonTextShadow(
          accuracy >= 0.9
            ? KOREAN_COLORS.POSITIVE_GREEN
            : accuracy >= 0.7
              ? KOREAN_COLORS.ACCENT_GOLD
              : KOREAN_COLORS.ACCENT_RED,
          "strong"
        ),
        fontWeight: 700,
        letterSpacing: "1px",
      };

      // Vital points list styles
      const vitalPointsListStyle: React.CSSProperties = {
        ...getEnhancedKoreanOverlayStyles({
          opacity: 0.85,
          glowIntensity: "medium",
          includeGradient: false,
          includeBackdropBlur: true,
          depthLayers: 2,
        }),
        padding: isMobile ? SPACING.xs : SPACING.sm,
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: SPACING.xs,
        maxWidth: isMobile ? "200px" : "280px",
      };

      const vitalPointHeaderStyle: React.CSSProperties = {
        fontSize: isMobile ? `${FONT_SIZES.tiny}px` : `${FONT_SIZES.small}px`,
        color: hexToRgbaString(KOREAN_COLORS.TRIGRAM_LI_PRIMARY, 1.0),
        textShadow: getNeonTextShadow(KOREAN_COLORS.TRIGRAM_LI_PRIMARY, "medium"),
        fontWeight: 600,
        textAlign: "center",
        borderBottom: `1px solid ${hexToRgbaString(KOREAN_COLORS.TRIGRAM_LI_PRIMARY, 0.3)}`,
        paddingBottom: SPACING.xs,
      };

      return (
        <div style={containerStyle}>
          {/* Targeting Reticle */}
          <div style={reticleContainerStyle}>
            <div style={reticleStyle}>
              <div style={crosshairHorizontalStyle} />
              <div style={crosshairVerticalStyle} />
              <div style={centerDotStyle} />
            </div>
          </div>

          {/* Accuracy Meter */}
          <div style={accuracyMeterStyle}>
            <div style={accuracyLabelStyle}>
              {formatBilingualText("정밀도", "Precision")}
            </div>
            <div style={accuracyValueStyle}>{accuracyPercent}%</div>
          </div>

          {/* Vital Points in Range */}
          {vitalPointsInRange.length > 0 && (
            <div style={vitalPointsListStyle}>
              <div style={vitalPointHeaderStyle}>
                {formatBilingualText("사정거리 내 급소", "Vital Points in Range")}
              </div>
              {vitalPointsInRange.map((vp) => {
                const distance = calculateDistance(playerPosition, vp.position);
                const isSelected = vp.id === selectedVitalPointId;

                const vitalPointItemStyle: React.CSSProperties = {
                  fontSize: isMobile ? "10px" : `${FONT_SIZES.tiny}px`,
                  color: isSelected
                    ? hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1.0)
                    : hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, 1.0),
                  textShadow: isSelected
                    ? getNeonTextShadow(KOREAN_COLORS.ACCENT_GOLD, "strong")
                    : getNeonTextShadow(KOREAN_COLORS.TEXT_PRIMARY, "subtle"),
                  fontWeight: isSelected ? 600 : 400,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: SPACING.xs,
                  borderRadius: "4px",
                  backgroundColor: isSelected
                    ? hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.15)
                    : "transparent",
                  border: isSelected
                    ? `1px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.5)}`
                    : "1px solid transparent",
                  transition: "all 0.2s ease-in-out",
                  cursor: onVitalPointSelect ? "pointer" : "default",
                  pointerEvents: onVitalPointSelect ? "auto" : "none",
                };

                const distanceStyle: React.CSSProperties = {
                  fontSize: isMobile ? "9px" : "11px",
                  color: hexToRgbaString(KOREAN_COLORS.TEXT_TERTIARY, 0.8),
                  fontWeight: 500,
                };

                return (
                  <div
                    key={vp.id}
                    style={vitalPointItemStyle}
                    {...(onVitalPointSelect && {
                      onClick: () => onVitalPointSelect(vp.id),
                      onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onVitalPointSelect(vp.id);
                        }
                      },
                      role: "button" as const,
                      tabIndex: 0,
                    })}
                  >
                    <span>
                      {formatBilingualText(vp.names.korean, vp.names.english)}
                    </span>
                    <span style={distanceStyle}>{distance.toFixed(1)}m</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }
  );

LiPrecisionTargetingOverlay.displayName = "LiPrecisionTargetingOverlay";
