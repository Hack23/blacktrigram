/**
 * RoundAnnouncement Component - Displays round completion and transition UI
 * 
 * Korean: 라운드 발표 (Round Announcement)
 * 
 * Shows round winner, current score, statistics, and countdown to next round.
 * Implements Korean cyberpunk aesthetic with bilingual text support.
 * 
 * @module components/combat/RoundAnnouncement
 * @category Combat UI
 */

import React, { useEffect, useState, useMemo } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";
import { PlayerState } from "../../../systems";

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
  const [countdown, setCountdown] = useState(countdownDuration);
  const [isVisible, setIsVisible] = useState(false);

  // Fade in animation on mount
  useEffect(() => {
    // Trigger fade in after a small delay
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Countdown logic
  useEffect(() => {
    if (countdown <= 0) {
      onCountdownComplete();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, onCountdownComplete]);

  // Determine if this is match point
  const isMatchPoint = useMemo(() => {
    const maxScore = Math.max(currentScore.player1, currentScore.player2);
    const roundsToWin = Math.ceil(totalRounds / 2);
    return maxScore === roundsToWin - 1;
  }, [currentScore, totalRounds]);

  // Convert hex colors to CSS
  const goldColor = `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`;
  const cyanColor = `#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`;
  const darkBg = `#${KOREAN_COLORS.UI_BACKGROUND_DARK.toString(16).padStart(6, "0")}`;

  return (
    <div
      data-testid="round-announcement"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: `${darkBg}dd`,
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      {/* Match Point Indicator */}
      {isMatchPoint && (
        <div
          style={{
            fontSize: isMobile ? "20px" : "28px",
            color: goldColor,
            fontFamily: FONT_FAMILY.KOREAN,
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
          fontFamily: FONT_FAMILY.KOREAN,
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
            fontFamily: FONT_FAMILY.KOREAN,
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
            color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}`,
            fontFamily: FONT_FAMILY.KOREAN,
          }}
          data-testid="round-stats"
        >
          <div>
            피해량 | Damage: {roundStats.damageDealt.toFixed(0)}
          </div>
          <div>
            명중 | Hits: {roundStats.hitsLanded}
          </div>
          <div>
            급소타격 | Vital Points: {roundStats.vitalPointsHit}
          </div>
          <div>
            정확도 | Accuracy: {roundStats.accuracy.toFixed(1)}%
          </div>
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
      >
        {countdown}
      </div>

      {/* Skip Button */}
      <button
        onClick={onSkip}
        data-testid="skip-countdown-button"
        style={{
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
      >
        건너뛰기 | Skip
      </button>

      {/* CSS Animation for pulse effect */}
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
        `}
      </style>
    </div>
  );
};

export default RoundAnnouncement;
