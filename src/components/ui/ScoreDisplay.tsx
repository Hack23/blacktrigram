import React, { useMemo } from "react";
import { KOREAN_COLORS } from "../../types/constants";
import {
  ResponsivePixiContainer,
  ResponsivePixiPanel,
} from "./base/ResponsivePixiComponents";

export interface ScoreDisplayProps {
  readonly player1Score: number;
  readonly player2Score: number;
  readonly player1Name: string;
  readonly player2Name: string;
  readonly maxScore: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly screenWidth: number;
  readonly screenHeight: number;
  readonly showPercentage?: boolean;
  readonly animated?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  player1Score,
  player2Score,
  player1Name,
  player2Name,
  maxScore,
  x,
  y,
  width,
  height,
  screenWidth,
  screenHeight,
  showPercentage = false,
  animated = true,
}) => {
  const isMobile = screenWidth < 768;

  const { player1Percentage, player2Percentage, isPlayer1Leading } =
    useMemo(() => {
      const total = player1Score + player2Score;
      const p1Pct = total > 0 ? (player1Score / total) * 100 : 50;
      const p2Pct = total > 0 ? (player2Score / total) * 100 : 50;

      return {
        player1Percentage: Math.round(p1Pct),
        player2Percentage: Math.round(p2Pct),
        isPlayer1Leading: player1Score > player2Score,
      };
    }, [player1Score, player2Score]);

  const getScoreColor = (score: number, isLeading: boolean) => {
    if (score === 0) return KOREAN_COLORS.TEXT_TERTIARY;
    if (isLeading) return KOREAN_COLORS.ACCENT_GREEN;
    return KOREAN_COLORS.ACCENT_GOLD;
  };

  // Animation effects for enhanced visual appeal
  const pulseAnimation = animated
    ? Math.sin(Date.now() * 0.004) * 0.1 + 0.9
    : 1;
  const scoreGlow = animated ? Math.sin(Date.now() * 0.006) * 0.2 + 0.8 : 1;

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      data-testid="score-display"
    >
      {/* Enhanced background panel with Korean martial arts design */}
      <ResponsivePixiPanel
        title="점수 - Score"
        x={0}
        y={0}
        width={width}
        height={height}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
      />

      {/* Decorative Korean pattern background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          // Traditional Korean geometric pattern
          g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.2 });

          // Draw traditional trigram-inspired pattern
          const patternSize = 30;
          for (let i = patternSize; i < width - patternSize; i += patternSize) {
            for (
              let j = patternSize;
              j < height - patternSize;
              j += patternSize
            ) {
              // Draw small trigram-like patterns
              g.moveTo(i - 8, j);
              g.lineTo(i + 8, j);
              g.moveTo(i - 6, j - 4);
              g.lineTo(i + 6, j - 4);
              g.moveTo(i - 8, j + 4);
              g.lineTo(i + 8, j + 4);
            }
          }
          g.stroke();
        }}
        data-testid="score-pattern-background"
      />

      {/* Enhanced Player 1 Score Section */}
      <pixiContainer x={15} y={35} data-testid="player1-score-section">
        {/* Player name with enhanced styling */}
        <pixiText
          text={player1Name}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
            dropShadow: {
              color: KOREAN_COLORS.BLACK_SOLID,
              blur: 2,
              distance: 2,
            },
          }}
          data-testid="player1-name"
        />

        {/* Animated score display */}
        <pixiText
          text={player1Score.toString()}
          style={{
            fontSize: isMobile ? 28 : 36,
            fill: getScoreColor(player1Score, isPlayer1Leading),
            fontWeight: "bold",
            align: "center",
            dropShadow: {
              color: KOREAN_COLORS.BLACK_SOLID,
              blur: 3,
              distance: 3,
            },
            stroke: {
              color: KOREAN_COLORS.BLACK_SOLID,
              width: 2,
            },
          }}
          x={0}
          y={isMobile ? 20 : 25}
          scale={{
            x: animated ? pulseAnimation : 1,
            y: animated ? pulseAnimation : 1,
          }}
          data-testid="player1-score"
        />

        {/* Enhanced Score Bar for Player 1 with Korean aesthetics */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            const barWidth = width / 2 - 30;
            const barHeight = 8;
            const barY = isMobile ? 55 : 70;

            // Background with Korean pattern
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
            g.roundRect(0, barY, barWidth, barHeight, 4);
            g.fill();

            // Decorative notches for traditional look
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.6,
            });
            for (let i = barWidth / 4; i < barWidth; i += barWidth / 4) {
              g.moveTo(i, barY - 2);
              g.lineTo(i, barY + barHeight + 2);
            }
            g.stroke();

            // Animated fill based on score
            const fillWidth = (player1Score / maxScore) * barWidth;
            if (fillWidth > 0) {
              g.fill({
                color: getScoreColor(player1Score, isPlayer1Leading),
                alpha: 0.9,
              });
              g.roundRect(0, barY, fillWidth, barHeight, 4);
              g.fill();

              // Animated shine effect
              if (animated) {
                g.fill({ color: 0xffffff, alpha: 0.3 * scoreGlow });
                g.roundRect(2, barY + 1, fillWidth - 4, barHeight - 2, 3);
                g.fill();
              }
            }

            // Enhanced border
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.8,
            });
            g.roundRect(0, barY, barWidth, barHeight, 4);
            g.stroke();
          }}
          data-testid="player1-score-bar"
        />

        {showPercentage && (
          <pixiText
            text={`${player1Percentage}%`}
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontWeight: "bold",
            }}
            x={0}
            y={isMobile ? 70 : 85}
            data-testid="player1-percentage"
          />
        )}
      </pixiContainer>

      {/* Enhanced VS Separator with martial arts styling */}
      <pixiContainer x={width / 2} y={height / 2} data-testid="vs-separator">
        {/* Outer ring with animation */}
        <pixiGraphics
          draw={(g) => {
            g.clear();

            // Outer glow effect
            if (animated) {
              g.fill({
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.3 * pulseAnimation,
              });
              g.circle(0, 0, isMobile ? 22 : 26);
              g.fill();
            }

            // Main circle with enhanced visuals
            g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
            g.circle(0, 0, isMobile ? 18 : 22);
            g.fill();

            // Traditional Korean border pattern
            g.stroke({
              width: 3,
              color: KOREAN_COLORS.PRIMARY_CYAN,
              alpha: 0.9,
            });
            g.circle(0, 0, isMobile ? 18 : 22);
            g.stroke();

            // Inner decorative elements
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.BLACK_SOLID,
              alpha: 0.8,
            });
            g.circle(0, 0, isMobile ? 12 : 15);
            g.stroke();
          }}
        />

        <pixiText
          text="VS"
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.BLACK_SOLID,
            fontWeight: "bold",
            align: "center",
            stroke: {
              color: KOREAN_COLORS.TEXT_PRIMARY,
              width: 1,
            },
          }}
          anchor={0.5}
          scale={{
            x: animated ? pulseAnimation : 1,
            y: animated ? pulseAnimation : 1,
          }}
          data-testid="vs-text"
        />
      </pixiContainer>

      {/* Enhanced Player 2 Score Section (mirrored) */}
      <pixiContainer
        x={width - 15 - (width / 2 - 30)}
        y={35}
        data-testid="player2-score-section"
      >
        <pixiText
          text={player2Name}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
            align: "right",
            dropShadow: {
              color: KOREAN_COLORS.BLACK_SOLID,
              blur: 2,
              distance: 2,
            },
          }}
          x={width / 2 - 30}
          anchor={{ x: 1, y: 0 }}
          data-testid="player2-name"
        />

        <pixiText
          text={player2Score.toString()}
          style={{
            fontSize: isMobile ? 28 : 36,
            fill: getScoreColor(player2Score, !isPlayer1Leading),
            fontWeight: "bold",
            align: "right",
            dropShadow: {
              color: KOREAN_COLORS.BLACK_SOLID,
              blur: 3,
              distance: 3,
            },
            stroke: {
              color: KOREAN_COLORS.BLACK_SOLID,
              width: 2,
            },
          }}
          x={width / 2 - 30}
          y={isMobile ? 20 : 25}
          anchor={{ x: 1, y: 0 }}
          scale={{
            x: animated ? pulseAnimation : 1,
            y: animated ? pulseAnimation : 1,
          }}
          data-testid="player2-score"
        />

        {/* Enhanced Score Bar for Player 2 (right-aligned) */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            const barWidth = width / 2 - 30;
            const barHeight = 8;
            const barY = isMobile ? 55 : 70;

            // Background
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
            g.roundRect(0, barY, barWidth, barHeight, 4);
            g.fill();

            // Decorative notches
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.6,
            });
            for (let i = barWidth / 4; i < barWidth; i += barWidth / 4) {
              g.moveTo(i, barY - 2);
              g.lineTo(i, barY + barHeight + 2);
            }
            g.stroke();

            // Fill from right side
            const fillWidth = (player2Score / maxScore) * barWidth;
            const startX = barWidth - fillWidth;
            if (fillWidth > 0) {
              g.fill({
                color: getScoreColor(player2Score, !isPlayer1Leading),
                alpha: 0.9,
              });
              g.roundRect(startX, barY, fillWidth, barHeight, 4);
              g.fill();

              // Animated shine effect
              if (animated) {
                g.fill({ color: 0xffffff, alpha: 0.3 * scoreGlow });
                g.roundRect(
                  startX + 2,
                  barY + 1,
                  fillWidth - 4,
                  barHeight - 2,
                  3
                );
                g.fill();
              }
            }

            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.8,
            });
            g.roundRect(0, barY, barWidth, barHeight, 4);
            g.stroke();
          }}
          data-testid="player2-score-bar"
        />

        {showPercentage && (
          <pixiText
            text={`${player2Percentage}%`}
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "right",
              fontWeight: "bold",
            }}
            x={width / 2 - 30}
            y={isMobile ? 70 : 85}
            anchor={{ x: 1, y: 0 }}
            data-testid="player2-percentage"
          />
        )}
      </pixiContainer>

      {/* Enhanced Match Status with Korean text */}
      <pixiContainer x={width / 2} y={height - 25} data-testid="match-status">
        <pixiText
          text={`최고 점수: ${maxScore} | 목표 달성까지: ${Math.max(
            0,
            maxScore - Math.max(player1Score, player2Score)
          )}`}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
            align: "center",
            fontFamily: "Noto Sans KR",
          }}
          anchor={0.5}
          data-testid="max-score-text"
        />
      </pixiContainer>

      {/* Enhanced Winner indicator with martial arts terminology */}
      {(player1Score > 0 || player2Score > 0) && (
        <pixiContainer x={width / 2} y={10} data-testid="winner-indicator">
          <pixiText
            text={
              isPlayer1Leading ? `${player1Name} 승세` : `${player2Name} 승세`
            }
            style={{
              fontSize: isMobile ? 11 : 13,
              fill: isPlayer1Leading
                ? getScoreColor(player1Score, true)
                : getScoreColor(player2Score, true),
              fontWeight: "bold",
              align: "center",
              fontFamily: "Noto Sans KR",
              dropShadow: {
                color: KOREAN_COLORS.BLACK_SOLID,
                blur: 1,
                distance: 1,
              },
            }}
            anchor={0.5}
            scale={{ x: animated ? scoreGlow : 1, y: animated ? scoreGlow : 1 }}
            data-testid="leading-player-text"
          />
        </pixiContainer>
      )}

      {/* Victory celebration effect */}
      {(player1Score >= maxScore || player2Score >= maxScore) && animated && (
        <pixiGraphics
          draw={(g) => {
            g.clear();
            // Celebration sparkles
            const sparkleAlpha = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
            g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: sparkleAlpha });

            // Draw sparkle pattern around the winner
            for (let i = 0; i < 8; i++) {
              const angle = (i / 8) * Math.PI * 2;
              const radius = 40 + Math.sin(Date.now() * 0.008 + i) * 10;
              const sparkleX = width / 2 + Math.cos(angle) * radius;
              const sparkleY = height / 2 + Math.sin(angle) * radius;
              g.star(sparkleX, sparkleY, 4, 3, 6);
            }
            g.fill();
          }}
          data-testid="victory-celebration-effect"
        />
      )}
    </ResponsivePixiContainer>
  );
};

export default ScoreDisplay;
