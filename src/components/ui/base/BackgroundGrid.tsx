import { useCallback } from "react";
import type { Graphics as PixiGraphics } from "pixi.js";
import { KOREAN_COLORS } from "../../../types";

export interface BackgroundGridProps {
  readonly width: number;
  readonly height: number;
  readonly gridSize?: number;
  readonly lineWidth?: number;
  readonly color?: number;
  readonly alpha?: number;
  readonly animated?: boolean;
}

export function BackgroundGrid({
  width,
  height,
  gridSize = 50,
  lineWidth = 1,
  color = KOREAN_COLORS.ACCENT_BLUE,
  alpha = 0.3,
  animated = false,
}: BackgroundGridProps): React.ReactElement {
  const drawGrid = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      const colorValue: number =
        typeof color === "number" ? color : KOREAN_COLORS.ACCENT_BLUE;

      // Draw vertical lines
      g.lineStyle(lineWidth, colorValue, alpha);
      for (let x = 0; x <= width; x += gridSize) {
        g.moveTo(x, 0);
        g.lineTo(x, height);
      }

      // Draw horizontal lines
      for (let y = 0; y <= height; y += gridSize) {
        g.moveTo(0, y);
        g.lineTo(width, y);
      }

      // Add intersection points for cyberpunk feel
      if (animated) {
        g.lineStyle(2, KOREAN_COLORS.CYAN, alpha * 0.6);

        for (let x = 0; x <= width; x += gridSize) {
          for (let y = 0; y <= height; y += gridSize) {
            g.drawCircle(x, y, 2);
          }
        }
      }
    },
    [width, height, gridSize, lineWidth, color, alpha, animated]
  );

  return <pixiGraphics draw={drawGrid} />;
}

export interface CyberpunkBackgroundProps {
  readonly width: number;
  readonly height: number;
}

export function CyberpunkBackground({
  width,
  height,
}: CyberpunkBackgroundProps): React.ReactElement {
  const drawBackground = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      // Dark base background
      g.beginFill(KOREAN_COLORS.BLACK);
      g.drawRect(0, 0, width, height);
      g.endFill();

      // Cyberpunk grid overlay
      g.lineStyle(1, KOREAN_COLORS.ACCENT_BLUE, 0.2);

      const gridSize = 40;
      for (let x = 0; x <= width; x += gridSize) {
        g.moveTo(x, 0);
        g.lineTo(x, height);
      }

      for (let y = 0; y <= height; y += gridSize) {
        g.moveTo(0, y);
        g.lineTo(width, y);
      }

      // Add some glowing accents
      g.lineStyle(2, KOREAN_COLORS.CYAN, 0.4);

      // Diagonal accent lines
      g.moveTo(0, 0);
      g.lineTo(width, height);

      g.moveTo(width, 0);
      g.lineTo(0, height);
    },
    [width, height]
  );

  return <pixiGraphics draw={drawBackground} />;
}
