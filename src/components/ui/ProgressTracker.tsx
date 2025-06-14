import React, { useMemo } from "react";
import { KOREAN_COLORS } from "../../types/constants";
import {
  ResponsivePixiContainer,
  ResponsivePixiPanel,
} from "./base/ResponsivePixiComponents";

export interface ProgressTrackerProps {
  readonly title: string;
  readonly progress: number; // 0-1
  readonly maxProgress: number;
  readonly currentValue: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly screenWidth: number;
  readonly screenHeight: number;
  readonly color?: number;
  readonly showText?: boolean;
  readonly korean?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  title,
  progress,
  maxProgress,
  currentValue,
  x,
  y,
  width,
  height,
  screenWidth,
  screenHeight,
  color = KOREAN_COLORS.ACCENT_GREEN,
  showText = true,
  korean,
}) => {
  const isMobile = screenWidth < 768;

  const progressPercent = useMemo(() => {
    return Math.max(0, Math.min(1, progress));
  }, [progress]);

  const progressColor = useMemo(() => {
    // Use the provided color as base, but adjust based on progress for better UX
    if (progressPercent > 0.7) return KOREAN_COLORS.ACCENT_GREEN;
    if (progressPercent > 0.3) return KOREAN_COLORS.ACCENT_GOLD;
    if (progressPercent > 0) return KOREAN_COLORS.ACCENT_RED;
    // Use the provided color as fallback when there's no progress
    return color;
  }, [progressPercent, color]);

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      data-testid={`progress-tracker-${title
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      {/* Background Panel */}
      <ResponsivePixiPanel
        title=""
        x={0}
        y={0}
        width={width}
        height={height}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
      />

      {/* Title */}
      {showText && (
        <pixiText
          text={korean ? `${korean} - ${title}` : title}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
            fontFamily: korean ? "Noto Sans KR" : undefined,
          }}
          x={8}
          y={8}
          data-testid={`progress-title-${title}`}
        />
      )}

      {/* Progress Bar Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({
            color: KOREAN_COLORS.UI_BACKGROUND_DARK,
            alpha: 0.8,
          });
          g.roundRect(
            8,
            showText ? (isMobile ? 25 : 30) : 8,
            width - 16,
            isMobile ? 12 : 16,
            4
          );
          g.fill();

          g.stroke({
            width: 1,
            color: KOREAN_COLORS.ACCENT_GOLD,
            alpha: 0.6,
          });
          g.roundRect(
            8,
            showText ? (isMobile ? 25 : 30) : 8,
            width - 16,
            isMobile ? 12 : 16,
            4
          );
          g.stroke();
        }}
        data-testid={`progress-bar-background-${title}`}
      />

      {/* Progress Bar Fill */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          const fillWidth = (width - 16) * progressPercent;
          if (fillWidth > 0) {
            g.fill({ color: progressColor, alpha: 0.9 });
            g.roundRect(
              8,
              showText ? (isMobile ? 25 : 30) : 8,
              fillWidth,
              isMobile ? 12 : 16,
              4
            );
            g.fill();
          }
        }}
        data-testid={`progress-bar-fill-${title}`}
      />

      {/* Progress Text */}
      {showText && (
        <pixiText
          text={`${currentValue}/${maxProgress} (${Math.round(
            progressPercent * 100
          )}%)`}
          style={{
            fontSize: isMobile ? 9 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
          }}
          x={width / 2}
          y={showText ? (isMobile ? 45 : 50) : 28}
          anchor={0.5}
          data-testid={`progress-text-${title}`}
        />
      )}

      {/* Glow effect for high progress */}
      {progressPercent > 0.8 && (
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GREEN,
              alpha: 0.6,
            });
            g.roundRect(
              6,
              showText ? (isMobile ? 23 : 28) : 6,
              width - 12,
              isMobile ? 16 : 20,
              6
            );
            g.stroke();
          }}
          data-testid={`progress-glow-${title}`}
        />
      )}
    </ResponsivePixiContainer>
  );
};

export default ProgressTracker;
