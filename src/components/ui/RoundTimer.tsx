import React, { useMemo } from "react";
import { KOREAN_COLORS } from "../../types/constants";
import {
  ResponsivePixiContainer,
  ResponsivePixiPanel,
} from "./base/ResponsivePixiComponents";

export interface RoundTimerProps {
  readonly timeRemaining: number; // in seconds
  readonly totalTime: number; // in seconds
  readonly currentRound: number;
  readonly maxRounds: number;
  readonly isPaused?: boolean;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly screenWidth: number;
  readonly screenHeight: number;
  readonly showMilliseconds?: boolean;
}

export const RoundTimer: React.FC<RoundTimerProps> = ({
  timeRemaining,
  totalTime,
  currentRound,
  maxRounds,
  isPaused = false,
  x,
  y,
  width,
  height,
  screenWidth,
  screenHeight,
  showMilliseconds = false,
}) => {
  const isMobile = screenWidth < 768;

  const { minutes, seconds, milliseconds, timePercentage, urgencyLevel } =
    useMemo(() => {
      const mins = Math.floor(timeRemaining / 60);
      const secs = Math.floor(timeRemaining % 60);
      const ms = Math.floor((timeRemaining % 1) * 100);
      const percentage = totalTime > 0 ? timeRemaining / totalTime : 0;

      let urgency: "normal" | "warning" | "critical" = "normal";
      if (percentage < 0.1) urgency = "critical";
      else if (percentage < 0.3) urgency = "warning";

      return {
        minutes: mins,
        seconds: secs,
        milliseconds: ms,
        timePercentage: percentage,
        urgencyLevel: urgency,
      };
    }, [timeRemaining, totalTime]);

  const getTimerColor = () => {
    if (isPaused) return KOREAN_COLORS.TEXT_SECONDARY;
    switch (urgencyLevel) {
      case "critical":
        return KOREAN_COLORS.ACCENT_RED;
      case "warning":
        return KOREAN_COLORS.ACCENT_GOLD;
      default:
        return KOREAN_COLORS.ACCENT_GREEN;
    }
  };

  const formatTime = () => {
    const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    return showMilliseconds
      ? `${timeStr}.${milliseconds.toString().padStart(2, "0")}`
      : timeStr;
  };

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      data-testid="round-timer"
    >
      <ResponsivePixiPanel
        title=""
        x={0}
        y={0}
        width={width}
        height={height}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
      />

      {/* Round Information */}
      <pixiContainer x={width / 2} y={15} data-testid="round-info">
        <pixiText
          text={`라운드 ${currentRound} / ${maxRounds}`}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
            align: "center",
            fontFamily: "Noto Sans KR",
          }}
          anchor={0.5}
          data-testid="round-counter"
        />
      </pixiContainer>

      {/* Timer Display */}
      <pixiContainer x={width / 2} y={height / 2} data-testid="timer-display">
        {/* Timer background circle */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            const radius = isMobile ? 35 : 45;

            // Background circle
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
            g.circle(0, 0, radius);
            g.fill();

            // Progress ring
            g.stroke({ width: 4, color: getTimerColor(), alpha: 0.9 });
            const angle = timePercentage * Math.PI * 2;
            g.arc(0, 0, radius - 2, -Math.PI / 2, -Math.PI / 2 + angle);
            g.stroke();

            // Border
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.6,
            });
            g.circle(0, 0, radius);
            g.stroke();
          }}
          data-testid="timer-circle"
        />

        {/* Time text */}
        <pixiText
          text={formatTime()}
          style={{
            fontSize: isMobile ? 14 : 18,
            fill: getTimerColor(),
            fontWeight: "bold",
            align: "center",
            fontFamily: "monospace",
          }}
          anchor={0.5}
          data-testid="timer-text"
        />

        {/* Pause indicator */}
        {isPaused && (
          <pixiText
            text="일시정지"
            style={{
              fontSize: isMobile ? 8 : 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "center",
              fontFamily: "Noto Sans KR",
            }}
            x={0}
            y={isMobile ? 20 : 25}
            anchor={0.5}
            data-testid="pause-indicator"
          />
        )}
      </pixiContainer>

      {/* Time bar at bottom */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          const barWidth = width - 20;
          const barHeight = 4;
          const barY = height - 15;

          // Background bar
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
          g.rect(10, barY, barWidth, barHeight);
          g.fill();

          // Progress bar
          const progressWidth = barWidth * timePercentage;
          g.fill({ color: getTimerColor(), alpha: 0.9 });
          g.rect(10, barY, progressWidth, barHeight);
          g.fill();

          // Border
          g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.6 });
          g.rect(10, barY, barWidth, barHeight);
          g.stroke();
        }}
        data-testid="timer-progress-bar"
      />

      {/* Urgency effects */}
      {urgencyLevel === "critical" && !isPaused && (
        <pixiGraphics
          draw={(g) => {
            g.clear();
            const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
            g.stroke({
              width: 3,
              color: KOREAN_COLORS.ACCENT_RED,
              alpha: pulse,
            });
            g.rect(2, 2, width - 4, height - 4);
            g.stroke();
          }}
          data-testid="critical-timer-effect"
        />
      )}

      {/* Korean time label */}
      <pixiContainer x={width / 2} y={height - 30} data-testid="time-label">
        <pixiText
          text="남은 시간"
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
            align: "center",
            fontFamily: "Noto Sans KR",
          }}
          anchor={0.5}
          data-testid="time-label-korean"
        />
      </pixiContainer>
    </ResponsivePixiContainer>
  );
};

export default RoundTimer;
