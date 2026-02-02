/**
 * PressureMeter - Son (Wind) stance pressure accumulation meter
 *
 * Displays pressure stacks (0-10) accumulated through Son technique combos.
 * Korean/English bilingual with cyberpunk theming. Responsive design for
 * mobile and desktop displays.
 *
 * Features:
 * - Bilingual Korean/English labels: "압박 | Pressure"
 * - Visual stack counter (0-10)
 * - Color-coded intensity (low/medium/high)
 * - Korean cyberpunk aesthetic
 * - WCAG AA contrast compliance
 * - Mobile-optimized sizing
 *
 * @module components/ui/combat/PressureMeter
 * @category Combat UI
 * @korean 압박계량기 - 손 자세 압박 누적 표시기
 */

import React, { useMemo } from "react";
import { KOREAN_COLORS } from "../../../types/constants"; // eslint-disable-line no-restricted-imports -- This UI component directly uses color constants
import { hexToRgbaString } from "../../../utils/colorUtils";

/**
 * Props for PressureMeter component
 */
export interface PressureMeterProps {
  /** Current pressure stacks (0-10) */
  readonly pressure: number;
  /** Maximum pressure stacks */
  readonly maxPressure?: number;
  /** Whether to show on mobile devices */
  readonly showOnMobile?: boolean;
  /** Additional CSS classes */
  readonly className?: string;
}

/**
 * Get pressure color based on stack count
 * 압박 수준에 따른 색상 결정
 */
const getPressureColor = (pressure: number, maxPressure: number): string => {
  const ratio = pressure / maxPressure;
  
  if (ratio >= 0.7) {
    // High pressure (7-10 stacks) - Critical red
    return `#${KOREAN_COLORS.ACCENT_RED.toString(16).padStart(6, "0")}`;
  } else if (ratio >= 0.4) {
    // Medium pressure (4-6 stacks) - Warning orange
    return `#${KOREAN_COLORS.WARNING_ORANGE.toString(16).padStart(6, "0")}`;
  } else {
    // Low pressure (1-3 stacks) - Son wind green
    return `#${KOREAN_COLORS.TRIGRAM_SON_PRIMARY.toString(16).padStart(6, "0")}`;
  }
};

/**
 * PressureMeter Component
 *
 * Displays Son (Wind) stance pressure accumulation with bilingual labels
 * and color-coded visual feedback. Integrates with combo system to show
 * continuous pressure mechanics.
 *
 * @example
 * ```tsx
 * const [pressure, setPressure] = useState(0);
 *
 * // On Son technique hit
 * const handleTechniqueHit = (technique: TrigramStanceTechnique) => {
 *   if (technique.stance === TrigramStance.SON && technique.pressureStacks) {
 *     setPressure(prev => Math.min(prev + technique.pressureStacks, 10));
 *   }
 * };
 *
 * <PressureMeter
 *   pressure={pressure}
 *   maxPressure={10}
 *   showOnMobile={true}
 * />
 * ```
 */
export const PressureMeter: React.FC<PressureMeterProps> = ({
  pressure,
  maxPressure = 10,
  showOnMobile = true,
  className = "",
}) => {
  const pressureColor = useMemo(
    () => getPressureColor(pressure, maxPressure),
    [pressure, maxPressure]
  );

  const fillPercentage = useMemo(
    () => Math.min((pressure / maxPressure) * 100, 100),
    [pressure, maxPressure]
  );

  const glowColor = useMemo(
    () => hexToRgbaString(parseInt(pressureColor.slice(1), 16), 0.6),
    [pressureColor]
  );

  return (
    <div
      className={`pressure-meter${className ? ` ${className}` : ""}${!showOnMobile ? " hidden-mobile" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "12px 16px",
        backgroundColor: `#${KOREAN_COLORS.UI_BACKGROUND_MEDIUM.toString(16).padStart(6, "0")}`,
        border: `2px solid ${pressureColor}`,
        borderRadius: "8px",
        minWidth: "200px",
        boxShadow: `0 0 12px ${glowColor}, inset 0 0 8px rgba(0, 0, 0, 0.5)`,
      }}
      role="meter"
      aria-valuenow={pressure}
      aria-valuemin={0}
      aria-valuemax={maxPressure}
      aria-label={`Pressure: ${pressure} out of ${maxPressure}`}
    >
      {/* Bilingual Label */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "14px",
          fontWeight: 600,
          color: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}`,
          fontFamily: "'Noto Sans KR', 'Nanum Gothic', sans-serif",
          letterSpacing: "0.5px",
        }}
      >
        <span style={{ color: pressureColor }}>압박 | Pressure</span>
        <span
          style={{
            color: pressureColor,
            fontSize: "16px",
            fontWeight: 700,
            textShadow: `0 0 8px ${glowColor}`,
          }}
        >
          {pressure}/{maxPressure}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          position: "relative",
          height: "24px",
          backgroundColor: `#${KOREAN_COLORS.UI_BACKGROUND_DARK.toString(16).padStart(6, "0")}`,
          borderRadius: "4px",
          overflow: "hidden",
          border: `1px solid #${KOREAN_COLORS.UI_BORDER.toString(16).padStart(6, "0")}`,
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${fillPercentage}%`,
            backgroundColor: pressureColor,
            transition: "width 0.3s ease, background-color 0.3s ease",
            boxShadow: `inset 0 0 12px ${glowColor}`,
          }}
        />

        {/* Stack Indicators */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: maxPressure }).map((_, index) => (
            <div
              key={index}
              style={{
                width: "2px",
                height: "100%",
                backgroundColor:
                  index < pressure
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(255, 255, 255, 0.1)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Korean Description */}
      <div
        style={{
          fontSize: "11px",
          color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}`,
          fontFamily: "'Noto Sans KR', 'Nanum Gothic', sans-serif",
          textAlign: "center",
          opacity: 0.8,
        }}
      >
        연속 공격으로 압박을 가하세요
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .pressure-meter.hidden-mobile {
              display: none;
            }
            .pressure-meter {
              min-width: 160px;
              padding: 10px 12px;
              gap: 6px;
            }
            .pressure-meter > div:first-child {
              font-size: 12px;
            }
            .pressure-meter > div:first-child span:last-child {
              font-size: 14px;
            }
            .pressure-meter > div:nth-child(2) {
              height: 20px;
            }
            .pressure-meter > div:last-child {
              font-size: 10px;
            }
          }
        `}
      </style>
    </div>
  );
};
