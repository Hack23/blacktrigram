/**
 * CombatTimer Component - Displays combat round timer
 * 
 * Korean: 전투 타이머 (Combat Timer)
 * 
 * Shows remaining time in MM:SS format with:
 * - Color changes based on time remaining
 * - Pulsing animation when time is critical
 * - Korean cyberpunk aesthetic
 * - Responsive sizing
 * 
 * @module components/combat/CombatTimer
 * @category Combat UI
 */

import React, { useMemo, useEffect } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../../../types/constants";
import { hexColorToCSS } from "../../../../../utils/colorUtils";
import { TimerWarningLevel } from "../../../../../hooks/useCombatTimer";

// Define CSS animation once at module level to avoid re-insertion
const PULSE_ANIMATION_ID = "combat-timer-pulse-animation";

const injectPulseAnimation = () => {
  // Check if style already exists in DOM instead of using module-level flag
  if (document.getElementById(PULSE_ANIMATION_ID)) return;
  
  const style = document.createElement("style");
  style.id = PULSE_ANIMATION_ID;
  style.textContent = `
    @keyframes pulse {
      0% {
        transform: translateX(-50%) scale(1);
        opacity: 1;
      }
      50% {
        transform: translateX(-50%) scale(1.05);
        opacity: 0.9;
      }
      100% {
        transform: translateX(-50%) scale(1);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
};

/**
 * Props for the CombatTimer component
 */
export interface CombatTimerProps {
  /** Formatted time string (MM:SS) */
  readonly formattedTime: string;
  /** Current warning level */
  readonly warningLevel: TimerWarningLevel;
  /** Whether time is up */
  readonly isTimeUp: boolean;
  /** Whether layout should adapt for mobile screens */
  readonly isMobile: boolean;
  /** Optional custom position styling */
  readonly style?: React.CSSProperties;
}

/**
 * Get timer color based on warning level
 */
function getTimerColor(
  warningLevel: TimerWarningLevel,
  isTimeUp: boolean
): number {
  if (isTimeUp) {
    return KOREAN_COLORS.NEGATIVE_RED; // Red for time up
  }
  switch (warningLevel) {
    case "urgent":
      return KOREAN_COLORS.NEGATIVE_RED; // Red (≤5s)
    case "warning":
      return KOREAN_COLORS.SECONDARY_YELLOW; // Yellow (≤10s)
    case "none":
    default:
      return KOREAN_COLORS.PRIMARY_CYAN; // Cyan (>10s)
  }
}

/**
 * CombatTimer Component
 * 
 * Displays round timer with Korean cyberpunk aesthetic and responsive design.
 * 
 * Features:
 * - MM:SS format display
 * - Color changes: cyan (>10s), yellow (≤10s), red (≤5s)
 * - Pulsing animation when time ≤5s
 * - "Time's Up!" message when timer reaches 0
 * - Responsive sizing for mobile/tablet/desktop
 * - Korean-English bilingual support
 * 
 * Korean: 전투 타이머 컴포넌트
 * 
 * @example
 * ```tsx
 * <CombatTimer
 *   formattedTime="03:45"
 *   warningLevel="none"
 *   isTimeUp={false}
 *   isMobile={false}
 * />
 * ```
 */
export const CombatTimer: React.FC<CombatTimerProps> = ({
  formattedTime,
  warningLevel,
  isTimeUp,
  isMobile,
  style = {},
}) => {
  // Inject CSS animation once on mount
  useEffect(() => {
    injectPulseAnimation();
  }, []);

  // Get timer color
  const timerColor = getTimerColor(warningLevel, isTimeUp);
  const timerColorCSS = useMemo(() => hexColorToCSS(timerColor), [timerColor]);

  // Background color with opacity
  const bgColor = useMemo(
    () => hexColorToCSS(KOREAN_COLORS.UI_BACKGROUND_DARK),
    []
  );

  // Border color based on warning level
  const borderColor = useMemo(() => {
    if (isTimeUp) return hexColorToCSS(KOREAN_COLORS.NEGATIVE_RED);
    if (warningLevel === "urgent")
      return hexColorToCSS(KOREAN_COLORS.NEGATIVE_RED);
    if (warningLevel === "warning")
      return hexColorToCSS(KOREAN_COLORS.SECONDARY_YELLOW);
    return hexColorToCSS(KOREAN_COLORS.PRIMARY_CYAN);
  }, [warningLevel, isTimeUp]);

  // Should pulse when urgent or time is up
  const shouldPulse = warningLevel === "urgent" || isTimeUp;

  // Font sizes based on screen size
  const fontSize = isMobile ? "32px" : "48px";
  const labelFontSize = isMobile ? "12px" : "14px";

  // Display text
  const displayText = isTimeUp ? "시간 종료 | Time's Up!" : formattedTime;

  return (
    <div
      data-testid="combat-timer"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Time remaining: ${formattedTime}`}
      style={{
        position: "absolute",
        top: isMobile ? "8px" : "12px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize,
        fontFamily: "monospace",
        fontWeight: "bold",
        color: timerColorCSS,
        textShadow: `0 0 ${isMobile ? "8px" : "12px"} ${timerColorCSS}, 0 0 ${
          isMobile ? "16px" : "24px"
        } ${timerColorCSS}`,
        padding: isMobile ? "8px 16px" : "12px 24px",
        backgroundColor: `${bgColor}dd`,
        border: `2px solid ${borderColor}`,
        borderRadius: isMobile ? "6px" : "8px",
        animation: shouldPulse ? "pulse 0.5s infinite" : "none",
        zIndex: 100,
        pointerEvents: "none",
        userSelect: "none",
        minWidth: isMobile ? "120px" : "160px",
        textAlign: "center",
        boxShadow: `0 0 ${isMobile ? "12px" : "20px"} ${borderColor}40`,
        ...style,
      }}
    >
      {/* Label */}
      {!isTimeUp && (
        <div
          style={{
            fontSize: labelFontSize,
            fontFamily: FONT_FAMILY.KOREAN,
            color: timerColorCSS,
            marginBottom: "2px",
            opacity: 0.8,
          }}
        >
          시간 | TIME
        </div>
      )}

      {/* Timer display */}
      <div>{displayText}</div>
    </div>
  );
};

export default CombatTimer;
