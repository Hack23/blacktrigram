/**
 * RoundStartAnnouncement Component - Displays "Round X Begin!" announcement
 *
 * Korean: 라운드 시작 발표 (Round Start Announcement)
 *
 * Shows "Round X Begin!" for subsequent rounds (not the first round).
 * Implements Korean cyberpunk aesthetic with bilingual text support.
 *
 * @module components/combat/RoundStartAnnouncement
 * @category Combat UI
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAudio } from "../../../../audio/AudioProvider";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { hexColorToCSS } from "../../../../utils/colorUtils";

/**
 * Props for the RoundStartAnnouncement component
 */
export interface RoundStartAnnouncementProps {
  /** Round number (1-based) */
  readonly roundNumber: number;
  /** Duration to display announcement in seconds */
  readonly duration?: number;
  /** Callback when announcement completes */
  readonly onComplete: () => void;
  /** Whether layout should adapt for mobile screens */
  readonly isMobile: boolean;
}

/**
 * RoundStartAnnouncement Component
 *
 * Displays "Round X Begin!" announcement with:
 * - Bilingual round number and "Begin!" text
 * - Flash/pulse animation for impact
 * - Auto-dismiss after configured duration
 * - Audio cue for round start
 * - Responsive sizing for mobile/tablet/desktop
 *
 * Korean: 라운드 시작 발표 컴포넌트
 */
export const RoundStartAnnouncement: React.FC<RoundStartAnnouncementProps> = ({
  roundNumber,
  duration = 2,
  onComplete,
  isMobile,
}) => {
  const audio = useAudio();
  const [isVisible, setIsVisible] = useState(false);

  // Use ref to stabilize onComplete callback - prevents timer reset on re-renders
  // This is critical because parent component may recreate onComplete due to state changes
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Stable callback that reads from ref
  const handleComplete = useCallback(() => {
    onCompleteRef.current();
  }, []);

  // Fade in animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Play audio cue on mount
  useEffect(() => {
    if (audio.isAudioReady) {
      audio.playSFX("attack_medium"); // Using placeholder - will be round_start
    }
  }, [audio]);

  // Auto-dismiss after duration - uses stable handleComplete to prevent timer resets
  useEffect(() => {
    let isMounted = true;
    let innerTimer: ReturnType<typeof setTimeout> | null = null;

    const outerTimer = setTimeout(() => {
      setIsVisible(false);
      innerTimer = setTimeout(() => {
        if (isMounted) {
          handleComplete();
        }
      }, 300); // Wait for fade out
    }, duration * 1000);

    return () => {
      isMounted = false;
      clearTimeout(outerTimer);
      if (innerTimer) {
        clearTimeout(innerTimer);
      }
    };
  }, [duration, handleComplete]);

  // Convert hex colors to CSS - memoized for performance
  const goldColor = useMemo(() => hexColorToCSS(KOREAN_COLORS.ACCENT_GOLD), []);
  const darkBg = useMemo(
    () => hexColorToCSS(KOREAN_COLORS.UI_BACKGROUND_DARK),
    []
  );

  return (
    <>
      <div
        data-testid="round-start-announcement"
        role="alert"
        aria-live="assertive"
        aria-label={`Round ${roundNumber} starting`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `${darkBg}88`,
          zIndex: 900,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: isMobile ? "56px" : "96px",
            fontWeight: "bold",
            color: goldColor,
            fontFamily: FONT_FAMILY.KOREAN,
            textShadow: `0 0 40px ${goldColor}`,
            animation: "roundStartFlash 0.5s ease-out",
            textAlign: "center",
            userSelect: "none",
          }}
          data-testid="round-start-text"
        >
          라운드 {roundNumber} 시작!
          <br />
          <span
            style={{
              fontSize: isMobile ? "40px" : "64px",
            }}
          >
            Round {roundNumber} Begin!
          </span>
        </div>
      </div>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes roundStartFlash {
            0% {
              opacity: 0;
              transform: scale(1.5);
            }
            30% {
              opacity: 1;
              transform: scale(1.2);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </>
  );
};

export default RoundStartAnnouncement;
