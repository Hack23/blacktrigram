/**
 * MatchCountdown Component - Displays match start countdown sequence
 * 
 * Korean: 매치 시작 카운트다운 (Match Start Countdown)
 * 
 * Shows "Ready?" → "3... 2... 1..." → "Fight!" sequence with animations.
 * Implements Korean cyberpunk aesthetic with bilingual text support.
 * Plays audio cues for countdown and fight announcement.
 * 
 * @module components/combat/MatchCountdown
 * @category Combat UI
 */

import { Html } from "@react-three/drei";
import React, { useEffect, useMemo } from "react";
import { useAudio } from "../../../audio/AudioProvider";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";
import { hexColorToCSS } from "../../../utils/colorUtils";
import { useMatchCountdown, MatchCountdownState } from "../../../hooks/useMatchCountdown";

/**
 * Props for the MatchCountdown component
 */
export interface MatchCountdownProps {
  /** Callback when countdown completes */
  readonly onComplete: () => void;
  /** Whether layout should adapt for mobile screens */
  readonly isMobile: boolean;
  /** Optional callback for skip button */
  readonly onSkip?: () => void;
  /** Whether skip button should be shown */
  readonly showSkip?: boolean;
}

/**
 * Get display text for current countdown state
 */
function getDisplayText(state: MatchCountdownState, currentNumber: number): {
  ko: string;
  en: string;
} | null {
  switch (state) {
    case "ready":
      return { ko: "준비?", en: "Ready?" };
    case "counting":
      return { ko: String(currentNumber), en: String(currentNumber) };
    case "fight":
      return { ko: "전투!", en: "Fight!" };
    default:
      return null;
  }
}

/**
 * MatchCountdown Component
 * 
 * Displays match start countdown with:
 * - "Ready?" announcement (1 second)
 * - Countdown from 3 to 1 (1 second intervals)
 * - "Fight!" announcement (1 second)
 * - Pulse/scale animations for emphasis
 * - Bilingual Korean-English text
 * - Audio cues for countdown and fight
 * - Optional skip button
 * - Responsive sizing for mobile/tablet/desktop
 * 
 * Korean: 매치 시작 카운트다운 컴포넌트
 */
export const MatchCountdown: React.FC<MatchCountdownProps> = ({
  onComplete,
  isMobile,
  onSkip,
  showSkip = false,
}) => {
  const audio = useAudio();

  // Use match countdown hook
  const { state, currentNumber, startCountdown, skipCountdown, isActive } =
    useMatchCountdown(
      {
        readyDuration: 1,
        countdownInterval: 1,
        fightDuration: 1,
        startNumber: 3,
      },
      onComplete
    );

  // Auto-start countdown on mount
  useEffect(() => {
    startCountdown();
  }, [startCountdown]);

  // Play audio cues based on state transitions
  useEffect(() => {
    if (!audio.isAudioReady) return;

    if (state === "counting" && currentNumber > 0) {
      // Play beep for each countdown number
      audio.playSFX("attack_light"); // Using placeholder - will be countdown_beep
    } else if (state === "fight") {
      // Play fight announcement
      audio.playSFX("attack_heavy"); // Using placeholder - will be fight_start
    }
  }, [state, currentNumber, audio.isAudioReady]);

  // Handle skip
  const handleSkip = () => {
    skipCountdown();
    onSkip?.();
  };

  // Get display text
  const displayText = getDisplayText(state, currentNumber);

  // Calculate responsive font sizes
  const mainFontSize = isMobile
    ? state === "fight" ? "72px" : "64px"
    : state === "fight" ? "120px" : "96px";
  
  const subFontSize = isMobile
    ? state === "fight" ? "48px" : "40px"
    : state === "fight" ? "72px" : "56px";

  // Convert hex colors to CSS - memoized for performance
  const goldColor = useMemo(
    () => hexColorToCSS(KOREAN_COLORS.ACCENT_GOLD),
    []
  );
  const cyanColor = useMemo(
    () => hexColorToCSS(KOREAN_COLORS.PRIMARY_CYAN),
    []
  );
  const darkBg = useMemo(
    () => hexColorToCSS(KOREAN_COLORS.UI_BACKGROUND_DARK),
    []
  );

  // Don't render if countdown not active or complete
  if (!isActive || !displayText) {
    return null;
  }

  return (
    <Html fullscreen>
      <div
        data-testid="match-countdown"
        role="dialog"
        aria-modal="true"
        aria-label="Match countdown in progress"
        aria-live="assertive"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            state === "fight" ? `${darkBg}cc` : `${darkBg}ee`,
          zIndex: 1000,
          animation: state === "ready" ? "fadeIn 0.3s ease-in" : "none",
        }}
      >
        <div
          style={{
            fontSize: mainFontSize,
            fontWeight: "bold",
            color: state === "fight" ? goldColor : cyanColor,
            fontFamily: FONT_FAMILY.KOREAN,
            textShadow: `0 0 ${state === "fight" ? "40px" : "30px"} ${
              state === "fight" ? goldColor : cyanColor
            }`,
            animation:
              state === "ready"
                ? "pulse 0.8s ease-out"
                : state === "counting"
                ? "countdownPulse 0.8s ease-out"
                : state === "fight"
                ? "flash 0.3s ease-out"
                : "none",
            textAlign: "center",
            userSelect: "none",
          }}
          data-testid="countdown-text"
        >
          {displayText.ko}
          <br />
          <span
            style={{
              fontSize: subFontSize,
            }}
          >
            {displayText.en}
          </span>
        </div>

        {/* Optional Skip Button */}
        {showSkip && state !== "fight" && (
          <button
            onClick={handleSkip}
            data-testid="skip-countdown-button"
            aria-label="Skip countdown"
            style={{
              position: "absolute",
              bottom: isMobile ? "40px" : "60px",
              padding: isMobile ? "10px 24px" : "12px 32px",
              fontSize: isMobile ? "14px" : "16px",
              backgroundColor: cyanColor,
              color: darkBg,
              border: "none",
              borderRadius: "6px",
              fontFamily: FONT_FAMILY.KOREAN,
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = `0 0 20px ${cyanColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onFocus={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = `0 0 20px ${cyanColor}`;
              e.currentTarget.style.outline = `2px solid ${cyanColor}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.outline = "none";
            }}
          >
            건너뛰기 | Skip
          </button>
        )}
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes pulse {
            0% {
              opacity: 0;
              transform: scale(0.9);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes countdownPulse {
            0% {
              opacity: 0;
              transform: scale(1.2);
            }
            50% {
              opacity: 1;
              transform: scale(1.1);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes flash {
            0% {
              opacity: 0;
              transform: scale(1.5);
            }
            30% {
              opacity: 1;
              transform: scale(1.3);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </Html>
  );
};

export default MatchCountdown;
