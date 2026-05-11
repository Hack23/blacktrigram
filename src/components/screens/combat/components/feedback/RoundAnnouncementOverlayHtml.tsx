/**
 * RoundAnnouncement Component - Displays round completion and transition UI
 *
 * Korean: 라운드 발표 (Round Announcement)
 *
 * Shows round winner, current score, statistics, and countdown to next round.
 * Implements Korean cyberpunk aesthetic with bilingual text support.
 *
 * Refactored to use useKoreanTheme for consistent styling.
 *
 * @module components/combat/RoundAnnouncement
 * @category Combat UI
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PlayerState } from "../../../../../systems";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
import { hexColorToCSS } from "../../../../../utils/colorUtils";

/**
 * Round statistics displayed between rounds
 *
 * Korean: 라운드 통계 (Round Statistics)
 */
export interface RoundStats {
  /** Total damage dealt by player */
  readonly damageDealt: number;
  /** Number of hits successfully landed */
  readonly hitsLanded: number;
  /** Number of vital points struck */
  readonly vitalPointsHit: number;
  /** Combat accuracy percentage */
  readonly accuracy: number;
}

/**
 * Props for the RoundAnnouncement component
 */
export interface RoundAnnouncementProps {
  /** Current round number (1-based) */
  readonly roundNumber: number;
  /** Round winner, or null if round was a draw */
  readonly roundWinner: PlayerState | null;
  /** Current match score (player1 wins, player2 wins) */
  readonly currentScore: { readonly player1: number; readonly player2: number };
  /** Round statistics to display */
  readonly roundStats?: RoundStats;
  /** Callback when countdown completes */
  readonly onCountdownComplete: () => void;
  /** Callback when skip button is pressed */
  readonly onSkip: () => void;
  /** Whether layout should adapt for mobile screens */
  readonly isMobile: boolean;
  /** Total number of rounds in match (for match point detection) */
  readonly totalRounds?: number;
  /** Countdown duration in seconds */
  readonly countdownDuration?: number;
}

/**
 * RoundAnnouncement Component
 *
 * Displays round completion announcement with:
 * - Bilingual round completion title
 * - Round winner display
 * - Current match score
 * - Round statistics (damage, hits, accuracy)
 * - Countdown to next round
 * - Skip button for quick play
 * - Match point indicator for final rounds
 * - Uses useKoreanTheme for consistent styling
 *
 * Korean: 라운드 종료 발표 컴포넌트
 */
export const RoundAnnouncement: React.FC<RoundAnnouncementProps> = ({
  roundNumber,
  roundWinner,
  currentScore,
  roundStats,
  onCountdownComplete,
  onSkip,
  isMobile,
  totalRounds = 3,
  countdownDuration = 3,
}) => {
  const theme = useKoreanTheme({ variant: "primary", size: "large", isMobile });
  const [countdown, setCountdown] = useState(countdownDuration);
  const [isVisible, setIsVisible] = useState(false);
  const hasCompletedRef = useRef(false);

  const onCountdownCompleteRef = useRef(onCountdownComplete);
  useEffect(() => {
    onCountdownCompleteRef.current = onCountdownComplete;
  }, [onCountdownComplete]);

  const handleCountdownComplete = useCallback(() => {
    onCountdownCompleteRef.current();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        handleCountdownComplete();
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, handleCountdownComplete]);

  const isMatchPoint = useMemo(() => {
    const maxScore = Math.max(currentScore.player1, currentScore.player2);
    const roundsToWin = Math.ceil(totalRounds / 2);
    return maxScore === roundsToWin - 1;
  }, [currentScore, totalRounds]);

  const goldColor = useMemo(
    () => hexColorToCSS(theme.colors.ACCENT_GOLD),
    [theme.colors.ACCENT_GOLD]
  );
  const cyanColor = useMemo(
    () => hexColorToCSS(theme.colors.PRIMARY_CYAN),
    [theme.colors.PRIMARY_CYAN]
  );
  const darkBg = useMemo(
    () => hexColorToCSS(theme.colors.UI_BACKGROUND_DARK),
    [theme.colors.UI_BACKGROUND_DARK]
  );
  const textSecondary = useMemo(
    () => hexColorToCSS(theme.colors.TEXT_SECONDARY),
    [theme.colors.TEXT_SECONDARY]
  );

  const containerStyle = useMemo(
    () => ({
      position: "fixed" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${darkBg}dd`,
      zIndex: 1000,
      opacity: isVisible ? 1 : 0,
      transition: "opacity 0.3s ease-in-out",
    }),
    [darkBg, isVisible]
  );

  return (
    <div data-testid="round-announcement" style={containerStyle}>
      {/* Match Point Indicator */}
      {isMatchPoint && (
        <div
          style={{
            fontSize: isMobile ? "20px" : "28px",
            color: goldColor,
            fontFamily: theme.fontFamily.KOREAN,
            fontWeight: "bold",
            marginBottom: isMobile ? "10px" : "20px",
            textShadow: `0 0 20px ${goldColor}`,
            animation: "pulse 1s infinite",
          }}
          data-testid="match-point-indicator"
        >
          매치 포인트! | Match Point!
        </div>
      )}

      {/* Round Complete Title */}
      <h1
        style={{
          fontSize: isMobile ? "36px" : "56px",
          color: goldColor,
          fontFamily: theme.fontFamily.KOREAN,
          fontWeight: "bold",
          margin: `0 0 ${isMobile ? "20px" : "30px"} 0`,
          textShadow: `0 0 30px ${goldColor}`,
          textAlign: "center",
        }}
        data-testid="round-complete-title"
      >
        라운드 {roundNumber} 완료!
        <br />
        Round {roundNumber} Complete!
      </h1>

      {/* Round Winner */}
      {roundWinner && (
        <div
          style={{
            fontSize: isMobile ? "24px" : "36px",
            color: cyanColor,
            fontFamily: theme.fontFamily.KOREAN,
            margin: `0 0 ${isMobile ? "20px" : "30px"} 0`,
            textAlign: "center",
          }}
          data-testid="round-winner"
        >
          승자 | Winner: {roundWinner.name.korean} | {roundWinner.name.english}
        </div>
      )}

      {/* Current Score */}
      <div
        style={{
          display: "flex",
          gap: isMobile ? "40px" : "80px",
          marginBottom: isMobile ? "20px" : "30px",
          fontSize: isMobile ? "32px" : "48px",
          fontWeight: "bold",
        }}
        data-testid="current-score"
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: isMobile ? "14px" : "18px",
              color: cyanColor,
              marginBottom: "8px",
            }}
          >
            Player 1
          </div>
          <div style={{ color: goldColor }}>{currentScore.player1}</div>
        </div>
        <div style={{ color: cyanColor }}>-</div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: isMobile ? "14px" : "18px",
              color: cyanColor,
              marginBottom: "8px",
            }}
          >
            Player 2
          </div>
          <div style={{ color: goldColor }}>{currentScore.player2}</div>
        </div>
      </div>

      {/* Round Statistics */}
      {roundStats && (
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "12px" : "24px",
            marginBottom: isMobile ? "20px" : "30px",
            fontSize: isMobile ? "14px" : "16px",
            color: textSecondary,
            fontFamily: theme.fontFamily.KOREAN,
          }}
          data-testid="round-stats"
        >
          <div>피해량 | Damage: {roundStats.damageDealt.toFixed(0)}</div>
          <div>명중 | Hits: {roundStats.hitsLanded}</div>
          <div>급소타격 | Vital Points: {roundStats.vitalPointsHit}</div>
          <div>정확도 | Accuracy: {roundStats.accuracy.toFixed(1)}%</div>
        </div>
      )}

      {/* Countdown */}
      <div
        style={{
          fontSize: isMobile ? "48px" : "72px",
          color: goldColor,
          fontWeight: "bold",
          marginBottom: isMobile ? "20px" : "30px",
          textShadow: `0 0 40px ${goldColor}`,
        }}
        data-testid="countdown-display"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Countdown: ${countdown} seconds remaining`}
      >
        {countdown}
      </div>

      {/* Skip Button */}
      <button
        onClick={onSkip}
        data-testid="skip-countdown-button"
        className="skip-countdown-button"
        style={{
          padding: isMobile ? "10px 24px" : "12px 32px",
          fontSize: isMobile ? "14px" : "16px",
          backgroundColor: cyanColor,
          color: darkBg,
          border: "none",
          borderRadius: "6px",
          fontFamily: theme.fontFamily.KOREAN,
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        건너뛰기 | Skip
      </button>

      {/* CSS Animation for pulse effect and button hover */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.05);
            }
          }
          
          .skip-countdown-button {
            transition: all 0.2s ease;
          }
          
          .skip-countdown-button:hover {
            transform: scale(1.05);
            box-shadow: 0 0 20px ${cyanColor};
          }
          
          .skip-countdown-button:focus {
            outline: 2px solid ${cyanColor};
            outline-offset: 2px;
          }
        `}
      </style>
    </div>
  );
};

export default RoundAnnouncement;
