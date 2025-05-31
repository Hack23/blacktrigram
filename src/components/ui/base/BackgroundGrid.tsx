import { useCallback } from "react";
import type { Graphics as PixiGraphics } from "pixi.js";
import { PixiGraphicsComponent } from "./PixiComponents";
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

      // Set line style - handle both number and string colors
      let colorValue: number;
      if (typeof color === "number") {
        colorValue = color;
      } else {
        // Remove the string handling since color is always number in our types
        colorValue = KOREAN_COLORS.ACCENT_BLUE;
      }

      g.setStrokeStyle({
        color: colorValue,
        width: lineWidth,
        alpha,
      });

      // Draw vertical lines
      for (let x = 0; x <= width; x += gridSize) {
        g.moveTo(x, 0);
        g.lineTo(x, height);
        g.stroke();
      }

      // Draw horizontal lines
      for (let y = 0; y <= height; y += gridSize) {
        g.moveTo(0, y);
        g.lineTo(width, y);
        g.stroke();
      }

      // Add intersection points for cyberpunk feel
      if (animated) {
        g.setStrokeStyle({
          color: KOREAN_COLORS.CYAN,
          width: 2,
          alpha: alpha * 0.6,
        });

        for (let x = 0; x <= width; x += gridSize) {
          for (let y = 0; y <= height; y += gridSize) {
            g.circle(x, y, 2);
            g.stroke();
          }
        }
      }
    },
    [width, height, gridSize, lineWidth, color, alpha, animated]
  );

  return <PixiGraphicsComponent draw={drawGrid} />;
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
      g.setFillStyle({ color: KOREAN_COLORS.BLACK });
      g.rect(0, 0, width, height);
      g.fill();

      // Cyberpunk grid overlay
      g.setStrokeStyle({
        color: KOREAN_COLORS.ACCENT_BLUE,
        width: 1,
        alpha: 0.2,
      });

      const gridSize = 40;
      for (let x = 0; x <= width; x += gridSize) {
        g.moveTo(x, 0);
        g.lineTo(x, height);
        g.stroke();
      }

      for (let y = 0; y <= height; y += gridSize) {
        g.moveTo(0, y);
        g.lineTo(width, y);
        g.stroke();
      }

      // Add some glowing accents
      g.setStrokeStyle({
        color: KOREAN_COLORS.CYAN,
        width: 2,
        alpha: 0.4,
      });

      // Diagonal accent lines
      g.moveTo(0, 0);
      g.lineTo(width, height);
      g.stroke();

      g.moveTo(width, 0);
      g.lineTo(0, height);
      g.stroke();
    },
    [width, height]
  );

  return <PixiGraphicsComponent draw={drawBackground} />;
}
