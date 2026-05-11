/**
 * SpeedIndicatorHUD Component - Visual indicator for player movement speed
 *
 * Displays a speed percentage indicator showing the current movement speed
 * relative to base speed, taking into account stance modifiers, injuries,
 * stamina, and combat state.
 *
 * @module components/shared/three/ui/SpeedIndicatorHUD
 * @category Shared UI
 * @korean 속도표시기
 */

import React, { useMemo } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import "./HUDAnimations.css";

export interface SpeedIndicatorHUDProps {
  /**
   * Final movement speed in m/s
   * @korean 최종속도
   */
  readonly finalSpeed: number;

  /**
   * Base movement speed before modifiers in m/s
   * @korean 기본속도
   */
  readonly baseSpeed: number;

  /**
   * Player position ('left' or 'right' side of screen)
   * @korean 플레이어위치
   */
  readonly position: "left" | "right";

  /**
   * Mobile responsive mode (smaller text)
   * @korean 모바일여부
   */
  readonly isMobile: boolean;

  /**
   * Whether to show the indicator (optional, default: true)
   * @korean 표시여부
   */
  readonly visible?: boolean;
}

/**
 * Get color for speed percentage
 *
 * **Korean**: 속도 색상 (Speed Color)
 *
 * Color coding:
 * - Green: 100%+ (boosted speed)
 * - Cyan: 80-99% (good speed)
 * - Yellow: 50-79% (reduced speed)
 * - Orange: 25-49% (heavily reduced)
 * - Red: <25% (critical reduction)
 */
function getSpeedColor(speedPercent: number): string {
  let colorValue: number;

  if (speedPercent >= 100) {
    colorValue = KOREAN_COLORS.POSITIVE_GREEN;
  } else if (speedPercent >= 80) {
    colorValue = KOREAN_COLORS.PRIMARY_CYAN;
  } else if (speedPercent >= 50) {
    colorValue = KOREAN_COLORS.WARNING_YELLOW;
  } else if (speedPercent >= 25) {
    colorValue = KOREAN_COLORS.WARNING_ORANGE;
  } else {
    colorValue = KOREAN_COLORS.ACCENT_RED;
  }

  // Convert number to properly formatted hex string with # prefix
  return `#${colorValue.toString(16).padStart(6, "0")}`;
}

/**
 * Get Korean label for speed range
 */
function getSpeedLabel(speedPercent: number): {
  korean: string;
  english: string;
} {
  if (speedPercent >= 100) {
    return { korean: "가속", english: "BOOSTED" };
  } else if (speedPercent >= 80) {
    return { korean: "양호", english: "GOOD" };
  } else if (speedPercent >= 50) {
    return { korean: "감소", english: "REDUCED" };
  } else if (speedPercent >= 25) {
    return { korean: "저하", english: "SLOWED" };
  } else {
    return { korean: "위급", english: "CRITICAL" };
  }
}

/**
 * SpeedIndicatorHUD - Movement speed percentage indicator
 *
 * Displays current movement speed as a percentage of base speed
 * with color coding and bilingual labels. Updates dynamically as
 * speed modifiers change from stance, injury, stamina, and combat state.
 *
 * @example
 * ```tsx
 * <SpeedIndicatorHUD
 *   finalSpeed={1.8}
 *   baseSpeed={2.0}
 *   position="left"
 *   isMobile={false}
 * />
 * ```
 *
 * @korean 속도표시기
 */
export const SpeedIndicatorHUD: React.FC<SpeedIndicatorHUDProps> = ({
  finalSpeed,
  baseSpeed,
  position,
  isMobile,
  visible = true,
}) => {
  const speedData = useMemo(() => {
    // Calculate speed as percentage of base
    const speedPercent = baseSpeed > 0 ? (finalSpeed / baseSpeed) * 100 : 100;
    const color = getSpeedColor(speedPercent);
    const label = getSpeedLabel(speedPercent);

    return {
      speedPercent: Math.round(speedPercent),
      color,
      label,
    };
  }, [finalSpeed, baseSpeed]);

  const containerStyle = useMemo(() => {
    const shouldGlow = speedData.speedPercent >= 100;
    return {
      position: "relative" as const,
      display: visible ? "flex" : "none",
      flexDirection: "column" as const,
      alignItems: "center" as const,
      gap: isMobile ? "4px" : "6px",
      width: "100%",
      padding: isMobile ? "8px 12px" : "10px 16px",
      backgroundColor: `rgba(0, 0, 0, 0.7)`,
      border: `2px solid ${speedData.color}`,
      borderRadius: "6px",
      boxShadow: shouldGlow 
        ? `0 0 15px ${speedData.color}, 0 0 25px ${speedData.color}40`
        : `0 0 10px ${speedData.color}`,
      pointerEvents: "none" as const,
      transition: "all 0.3s ease-out",
      animation: shouldGlow ? "speedGlow 1.5s ease-in-out infinite" : "none",
    };
  }, [isMobile, visible, speedData.color, speedData.speedPercent]);

  const percentStyle = useMemo(
    () => ({
      fontFamily: FONT_FAMILY.KOREAN,
      fontSize: isMobile ? "18px" : "22px",
      fontWeight: "bold" as const,
      color: speedData.color,
      textShadow: `0 0 8px ${speedData.color}`,
      lineHeight: 1,
      margin: 0,
    }),
    [isMobile, speedData.color],
  );

  const labelStyle = useMemo(
    () => ({
      fontFamily: FONT_FAMILY.KOREAN,
      fontSize: isMobile ? "10px" : "12px",
      fontWeight: "normal" as const,
      color: speedData.color,
      opacity: 0.9,
      letterSpacing: "0.5px",
      lineHeight: 1,
      margin: 0,
    }),
    [isMobile, speedData.color],
  );

  const koreanLabelStyle = useMemo(
    () => ({
      fontFamily: FONT_FAMILY.KOREAN,
      fontSize: isMobile ? "11px" : "13px",
      fontWeight: "600" as const,
      color: speedData.color,
      opacity: 0.95,
      letterSpacing: "0.5px",
      lineHeight: 1,
      margin: 0,
    }),
    [isMobile, speedData.color],
  );

  return (
    <div
      data-testid={`speed-indicator-${position}`}
      className="hud-animated"
      style={containerStyle}
      aria-label={`${speedData.label.korean} | ${speedData.label.english}: ${speedData.speedPercent}%`}
      role="status"
      aria-live="polite"
    >
      {/* Speed percentage */}
      <div style={percentStyle}>{speedData.speedPercent}%</div>

      {/* Korean label */}
      <div style={koreanLabelStyle}>{speedData.label.korean}</div>

      {/* English label */}
      <div style={labelStyle}>{speedData.label.english}</div>

      {/* Speed unit label */}
      <div
        style={{
          ...labelStyle,
          fontSize: isMobile ? "9px" : "10px",
          opacity: 0.7,
          marginTop: isMobile ? "2px" : "3px",
        }}
      >
        속도변경 | Speed
      </div>
    </div>
  );
};

SpeedIndicatorHUD.displayName = "SpeedIndicatorHUD";
