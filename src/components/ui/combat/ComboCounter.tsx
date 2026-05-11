/**
 * ComboCounter - Combo count and timing window display
 *
 * Shows current combo count and visual timing indicator for combo continuation.
 * Korean/English bilingual with Korean cyberpunk theming. Displays optimal
 * timing window for chaining techniques.
 *
 * Features:
 * - Bilingual labels: "연속 공격 | Combo"
 * - Combo count display with multiplier
 * - Visual timing window indicator
 * - Color-coded timing feedback (perfect/good/miss)
 * - Korean cyberpunk aesthetic
 * - WCAG AA contrast compliance
 * - Mobile-optimized sizing
 *
 * @module components/ui/combat/ComboCounter
 * @category Combat UI
 * @korean 콤보카운터 - 연속 공격 카운터 및 타이밍 표시기
 */

import React, { useMemo, useEffect, useState } from "react";
import { KOREAN_COLORS } from "../../../types/constants"; // eslint-disable-line no-restricted-imports -- This UI component directly uses color constants
import { hexToRgbaString } from "../../../utils/colorUtils";

/**
 * Props for ComboCounter component
 */
export interface ComboCounterProps {
  /** Current combo count */
  readonly comboCount: number;
  /** Timing window for next technique (milliseconds) */
  readonly comboWindow?: number;
  /** Time elapsed since last technique (milliseconds) */
  readonly timeSinceLastHit?: number;
  /** Whether combo is currently active */
  readonly isActive: boolean;
  /** Whether to show on mobile devices */
  readonly showOnMobile?: boolean;
  /** Additional CSS classes */
  readonly className?: string;
}

/**
 * Get timing quality based on elapsed time and window
 * 타이밍 품질 판정
 */
const getTimingQuality = (
  elapsed: number,
  window: number
): "perfect" | "good" | "miss" => {
  const ratio = elapsed / window;
  
  if (ratio <= 0.5) {
    return "perfect"; // First half of window
  } else if (ratio <= 1.0) {
    return "good"; // Second half of window
  } else {
    return "miss"; // Window expired
  }
};

/**
 * Get timing color based on quality
 * 타이밍에 따른 색상 결정
 */
const getTimingColor = (quality: "perfect" | "good" | "miss"): string => {
  switch (quality) {
    case "perfect":
      return `#${KOREAN_COLORS.ACCENT_GREEN.toString(16).padStart(6, "0")}`;
    case "good":
      return `#${KOREAN_COLORS.ACCENT_YELLOW.toString(16).padStart(6, "0")}`;
    case "miss":
      return `#${KOREAN_COLORS.ACCENT_RED.toString(16).padStart(6, "0")}`;
  }
};

/**
 * ComboCounter Component
 *
 * Displays combo count and timing window for Son (Wind) stance combo chains.
 * Provides visual feedback for optimal technique timing within combo flow.
 *
 * @example
 * ```tsx
 * const [comboState, setComboState] = useState({
 *   count: 0,
 *   lastHitTime: 0,
 *   window: 200,
 * });
 *
 * // On technique hit
 * const handleTechniqueHit = (technique: TrigramStanceTechnique) => {
 *   const now = Date.now();
 *   const elapsed = now - comboState.lastHitTime;
 *   
 *   if (elapsed <= comboState.window) {
 *     // Combo continues
 *     setComboState({
 *       count: comboState.count + 1,
 *       lastHitTime: now,
 *       window: technique.comboWindow || 200,
 *     });
 *   } else {
 *     // Combo resets
 *     setComboState({
 *       count: 1,
 *       lastHitTime: now,
 *       window: technique.comboWindow || 200,
 *     });
 *   }
 * };
 *
 * <ComboCounter
 *   comboCount={comboState.count}
 *   comboWindow={comboState.window}
 *   timeSinceLastHit={Date.now() - comboState.lastHitTime}
 *   isActive={comboState.count > 0}
 *   showOnMobile={true}
 * />
 * ```
 */
export const ComboCounter: React.FC<ComboCounterProps> = ({
  comboCount,
  comboWindow = 200,
  timeSinceLastHit = 0,
  isActive,
  showOnMobile = true,
  className = "",
}) => {
  const [animateCount, setAnimateCount] = useState(false);

  const timingQuality = useMemo(() => {
    if (!isActive || comboCount === 0) return "miss";
    return getTimingQuality(timeSinceLastHit, comboWindow);
  }, [isActive, comboCount, timeSinceLastHit, comboWindow]);

  const timingColor = useMemo(
    () => getTimingColor(timingQuality),
    [timingQuality]
  );

  const windowProgress = useMemo(() => {
    if (!isActive || comboCount === 0) return 0;
    return Math.min((timeSinceLastHit / comboWindow) * 100, 100);
  }, [isActive, comboCount, timeSinceLastHit, comboWindow]);

  useEffect(() => {
    if (comboCount > 0) {
      setAnimateCount(true);
      const timer = setTimeout(() => setAnimateCount(false), 300);
      return () => clearTimeout(timer);
    }
  }, [comboCount]);

  const glowColor = useMemo(
    () => hexToRgbaString(parseInt(timingColor.slice(1), 16), 0.6),
    [timingColor]
  );

  if (!isActive && comboCount === 0) {
    return null; // Hide when not active
  }

  return (
    <div
      className={`combo-counter${className ? ` ${className}` : ""}${!showOnMobile ? " hidden-mobile" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "14px 18px",
        backgroundColor: `#${KOREAN_COLORS.UI_BACKGROUND_MEDIUM.toString(16).padStart(6, "0")}`,
        border: `2px solid ${timingColor}`,
        borderRadius: "8px",
        minWidth: "220px",
        boxShadow: `0 0 16px ${glowColor}, inset 0 0 10px rgba(0, 0, 0, 0.5)`,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
      role="status"
      aria-live="polite"
      aria-label={`Combo: ${comboCount} hits`}
    >
      {/* Bilingual Label and Count */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}`,
            fontFamily: "'Noto Sans KR', 'Nanum Gothic', sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          연속 공격 | Combo
        </span>
        <span
          style={{
            fontSize: animateCount ? "28px" : "24px",
            fontWeight: 700,
            color: timingColor,
            fontFamily: "'Orbitron', 'Noto Sans KR', monospace",
            textShadow: `0 0 12px ${glowColor}`,
            transition: "font-size 0.15s ease, color 0.2s ease",
          }}
        >
          {comboCount}x
        </span>
      </div>

      {/* Timing Window Indicator */}
      <div
        style={{
          position: "relative",
          height: "28px",
          backgroundColor: `#${KOREAN_COLORS.UI_BACKGROUND_DARK.toString(16).padStart(6, "0")}`,
          borderRadius: "4px",
          overflow: "hidden",
          border: `1px solid #${KOREAN_COLORS.UI_BORDER.toString(16).padStart(6, "0")}`,
        }}
      >
        {/* Progress Fill */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${windowProgress}%`,
            backgroundColor: timingColor,
            transition: "width 0.05s linear, background-color 0.2s ease",
            boxShadow: `inset 0 0 12px ${glowColor}`,
          }}
        />

        {/* Timing Label */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: 600,
            color: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}`,
            fontFamily: "'Noto Sans KR', sans-serif",
            textShadow: "0 0 4px rgba(0, 0, 0, 0.8)",
            pointerEvents: "none",
          }}
        >
          {timingQuality === "perfect" && "완벽! | Perfect!"}
          {timingQuality === "good" && "좋음 | Good"}
          {timingQuality === "miss" && "놓침 | Missed"}
        </div>

        {/* Window Markers */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: "2px",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            transform: "translateX(-50%)",
          }}
        />
      </div>

      {/* Timing Window Info */}
      <div
        style={{
          fontSize: "11px",
          color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}`,
          fontFamily: "'Noto Sans KR', 'Nanum Gothic', sans-serif",
          textAlign: "center",
          opacity: 0.8,
        }}
      >
        타이밍 창: {comboWindow}ms | Window: {comboWindow}ms
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .combo-counter.hidden-mobile {
              display: none;
            }
            .combo-counter {
              min-width: 180px;
              padding: 12px 14px;
              gap: 8px;
            }
            .combo-counter > div:first-child span:first-child {
              font-size: 12px;
            }
            .combo-counter > div:first-child span:last-child {
              font-size: 20px;
            }
            .combo-counter > div:nth-child(2) {
              height: 24px;
            }
            .combo-counter > div:nth-child(2) > div:nth-child(2) {
              font-size: 11px;
            }
            .combo-counter > div:last-child {
              font-size: 10px;
            }
          }
        `}
      </style>
    </div>
  );
};
