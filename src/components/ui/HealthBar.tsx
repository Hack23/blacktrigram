import React, { useMemo } from "react";
import * as PIXI from "pixi.js";
import { KOREAN_COLORS } from "../../types/constants";
import { ResponsivePixiContainer } from "./base/ResponsivePixiComponents";

export interface HealthBarProps {
  readonly current: number;
  readonly max: number;
  readonly playerName: string;
  readonly position?: "left" | "right" | "center";
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly screenWidth: number;
  readonly screenHeight: number;
  readonly showText?: boolean;
  readonly animated?: boolean;
  readonly showDamageIndicator?: boolean;
}

export const HealthBar: React.FC<HealthBarProps> = ({
  current,
  max,
  playerName,
  position = "left",
  x,
  y,
  width,
  height,
  screenWidth,
  screenHeight,
  showText = true,
  animated = true,
  showDamageIndicator = true,
}) => {
  const isMobile = screenWidth < 768;

  const { healthPercentage, healthStatus, displayHealth } = useMemo(() => {
    const percentage = max > 0 ? current / max : 0;
    let status: "critical" | "low" | "medium" | "high" = "high";

    if (percentage <= 0.15) status = "critical";
    else if (percentage <= 0.35) status = "low";
    else if (percentage <= 0.65) status = "medium";

    return {
      healthPercentage: Math.max(0, Math.min(1, percentage)),
      healthStatus: status,
      displayHealth: Math.max(0, current),
    };
  }, [current, max]);

  const getHealthColor = () => {
    switch (healthStatus) {
      case "critical":
        return KOREAN_COLORS.ACCENT_RED;
      case "low":
        return KOREAN_COLORS.ACCENT_GOLD;
      case "medium":
        return KOREAN_COLORS.ACCENT_CYAN;
      default:
        return KOREAN_COLORS.ACCENT_GREEN;
    }
  };

  // Enhanced gradient for better visual appeal
  const getHealthGradient = () => {
    if (healthPercentage > 0.5) {
      return [KOREAN_COLORS.ACCENT_GREEN, KOREAN_COLORS.ACCENT_CYAN];
    } else if (healthPercentage > 0.25) {
      return [KOREAN_COLORS.ACCENT_GOLD, KOREAN_COLORS.ACCENT_GREEN];
    } else {
      return [KOREAN_COLORS.ACCENT_RED, KOREAN_COLORS.ACCENT_GOLD];
    }
  };

  const isRightAligned = position === "right";
  const isCenterAligned = position === "center";

  // Animation states for enhanced visuals
  const pulseAnimation = animated
    ? Math.sin(Date.now() * 0.005) * 0.1 + 0.9
    : 1;
  const damageFlash =
    showDamageIndicator && healthStatus === "critical"
      ? Math.sin(Date.now() * 0.01) * 0.3 + 0.7
      : 1;

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      data-testid={`health-bar-${position}`}
    >
      {/* Player Name with enhanced styling */}
      {showText && (
        <pixiText
          text={playerName}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
            align: isRightAligned
              ? "right"
              : isCenterAligned
              ? "center"
              : "left",
            dropShadow: {
              color: KOREAN_COLORS.BLACK_SOLID,
              blur: 2,
              distance: 2,
            },
          }}
          x={isRightAligned ? width : isCenterAligned ? width / 2 : 0}
          y={0}
          anchor={
            isRightAligned
              ? { x: 1, y: 0 }
              : isCenterAligned
              ? { x: 0.5, y: 0 }
              : { x: 0, y: 0 }
          }
          data-testid={`health-bar-name-${position}`}
        />
      )}

      {/* Enhanced Health Bar Container */}
      <pixiContainer
        x={0}
        y={showText ? (isMobile ? 20 : 25) : 5}
        data-testid={`health-bar-container-${position}`}
      >
        {/* Background with Korean pattern */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            const barHeight = height - (showText ? (isMobile ? 25 : 30) : 5);

            // Main background
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
            g.roundRect(0, 0, width, barHeight, 4);
            g.fill();

            // Korean-style decorative pattern
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.3,
            });
            for (let i = 0; i < width; i += 20) {
              g.moveTo(i, 0);
              g.lineTo(i + 10, barHeight / 2);
              g.lineTo(i, barHeight);
            }
            g.stroke();

            // Border with enhanced styling
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.8,
            });
            g.roundRect(0, 0, width, barHeight, 4);
            g.stroke();
          }}
          data-testid={`health-bar-background-${position}`}
        />

        {/* Enhanced Health Fill with gradient effect */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            const barHeight = height - (showText ? (isMobile ? 25 : 30) : 5);
            const fillWidth = width * healthPercentage;

            if (fillWidth > 0) {
              // Gradient health fill using the enhanced gradient
              const [startColor, endColor] = getHealthGradient();
              const gradient = new PIXI.FillGradient(0, 0, fillWidth, 0);
              gradient.addColorStop(0, startColor);
              gradient.addColorStop(1, endColor);

              g.fill(gradient);
              if (isRightAligned) {
                // Fill from right for player 2
                g.roundRect(width - fillWidth, 0, fillWidth, barHeight, 4);
              } else {
                // Fill from left for player 1
                g.roundRect(0, 0, fillWidth, barHeight, 4);
              }
              g.fill();

              // Enhanced shine effect with animation
              g.fill({
                color: 0xffffff,
                alpha: 0.3 * (animated ? pulseAnimation : 1),
              });
              const shineWidth = fillWidth * 0.6;
              const shineHeight = barHeight * 0.4;
              if (isRightAligned) {
                g.roundRect(
                  width - shineWidth - 4,
                  2,
                  shineWidth,
                  shineHeight,
                  2
                );
              } else {
                g.roundRect(4, 2, shineWidth, shineHeight, 2);
              }
              g.fill();
            }
          }}
          data-testid={`health-bar-fill-${position}`}
        />

        {/* Enhanced damage indicator effects */}
        {showDamageIndicator && healthStatus === "critical" && (
          <pixiGraphics
            draw={(g) => {
              g.clear();
              // Pulsing red warning effect
              g.stroke({
                width: 3,
                color: KOREAN_COLORS.ACCENT_RED,
                alpha: 0.8 * damageFlash,
              });
              g.roundRect(
                -3,
                -3,
                width + 6,
                height - (showText ? (isMobile ? 21 : 26) : 1),
                7
              );
              g.stroke();

              // Additional warning flashes
              g.fill({
                color: KOREAN_COLORS.ACCENT_RED,
                alpha: 0.1 * damageFlash,
              });
              g.roundRect(
                0,
                0,
                width,
                height - (showText ? (isMobile ? 25 : 30) : 5),
                4
              );
              g.fill();
            }}
            data-testid={`health-bar-critical-effect-${position}`}
          />
        )}

        {/* Enhanced health segments with Korean aesthetic */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            const barHeight = height - (showText ? (isMobile ? 25 : 30) : 5);

            // Traditional Korean division markers
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.4,
            });
            const segments = 4;
            const segmentWidth = width / segments;

            for (let i = 1; i < segments; i++) {
              const segmentX = segmentWidth * i;
              // Vertical divider
              g.moveTo(segmentX, 2);
              g.lineTo(segmentX, barHeight - 2);

              // Korean-style decorative marks
              g.circle(segmentX, barHeight / 2, 2);
            }
            g.stroke();
          }}
          data-testid={`health-bar-segments-${position}`}
        />
      </pixiContainer>

      {/* Enhanced Health Text with better positioning */}
      {showText && (
        <pixiText
          text={`${Math.ceil(displayHealth)} / ${max}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: getHealthColor(),
            fontWeight: "bold",
            align: isRightAligned
              ? "right"
              : isCenterAligned
              ? "center"
              : "left",
            dropShadow: {
              color: KOREAN_COLORS.BLACK_SOLID,
              blur: 1,
              distance: 1,
            },
          }}
          x={isRightAligned ? width : isCenterAligned ? width / 2 : 0}
          y={height - (isMobile ? 12 : 15)}
          anchor={
            isRightAligned
              ? { x: 1, y: 0 }
              : isCenterAligned
              ? { x: 0.5, y: 0 }
              : { x: 0, y: 0 }
          }
          data-testid={`health-bar-text-${position}`}
        />
      )}

      {/* Enhanced Korean health status with martial arts terminology */}
      {showText && (
        <pixiText
          text={
            healthStatus === "critical"
              ? "위험 - 기절 직전"
              : healthStatus === "low"
              ? "부상 - 약한 상태"
              : healthStatus === "medium"
              ? "보통 - 전투 가능"
              : "건강 - 최상 컨디션"
          }
          style={{
            fontSize: isMobile ? 7 : 9,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Noto Sans KR",
            align: isRightAligned
              ? "right"
              : isCenterAligned
              ? "center"
              : "left",
            fontStyle: "italic",
          }}
          x={isRightAligned ? width - 2 : isCenterAligned ? width / 2 : 2}
          y={showText ? (isMobile ? 22 : 27) : 7}
          anchor={
            isRightAligned
              ? { x: 1, y: 0 }
              : isCenterAligned
              ? { x: 0.5, y: 0 }
              : { x: 0, y: 0 }
          }
          data-testid={`health-bar-status-${position}`}
        />
      )}

      {/* Ki/Energy indicator for martial arts theme */}
      {healthPercentage > 0.8 && animated && (
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({
              color: KOREAN_COLORS.ACCENT_GREEN,
              alpha: 0.3 * Math.sin(Date.now() * 0.008) + 0.3,
            });
            g.circle(
              isRightAligned ? width - 10 : 10,
              (showText ? (isMobile ? 22 : 27) : 7) + 5,
              3
            );
            g.fill();
          }}
          data-testid={`health-bar-ki-indicator-${position}`}
        />
      )}
    </ResponsivePixiContainer>
  );
};

export default HealthBar;
