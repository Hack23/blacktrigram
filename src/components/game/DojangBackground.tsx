import { useCallback } from "react";
import { PixiGraphicsComponent } from "../ui/base/PixiComponents";
import type { Graphics as PixiGraphics } from "pixi.js";
import { KOREAN_COLORS } from "../../types";

export interface DojangBackgroundProps {
  readonly width: number;
  readonly height: number;
}

export function DojangBackground({
  width,
  height,
}: DojangBackgroundProps): React.ReactElement {
  const drawBackground = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      // Dark cyberpunk background
      g.setFillStyle({ color: KOREAN_COLORS.BLACK });
      g.rect(0, 0, width, height);
      g.fill();

      // Add traditional Korean dojang floor pattern
      g.setStrokeStyle({
        color: KOREAN_COLORS.ACCENT_BLUE,
        width: 1,
        alpha: 0.3,
      });

      const tileSize = 50;
      for (let x = 0; x <= width; x += tileSize) {
        g.moveTo(x, 0);
        g.lineTo(x, height);
        g.stroke();
      }

      for (let y = 0; y <= height; y += tileSize) {
        g.moveTo(0, y);
        g.lineTo(width, y);
        g.stroke();
      }

      // Central training area circle
      const centerX = width / 2;
      const centerY = height / 2;

      g.setStrokeStyle({
        color: KOREAN_COLORS.GOLD,
        width: 3,
        alpha: 0.6,
      });
      g.circle(centerX, centerY, Math.min(width, height) * 0.3);
      g.stroke();

      // Traditional Korean decorative elements
      const trigramPositions = [
        { x: width * 0.1, y: height * 0.1 },
        { x: width * 0.9, y: height * 0.1 },
        { x: width * 0.1, y: height * 0.9 },
        { x: width * 0.9, y: height * 0.9 },
      ];

      trigramPositions.forEach(({ x, y }) => {
        g.setStrokeStyle({
          color: KOREAN_COLORS.CYAN,
          width: 2,
          alpha: 0.4,
        });
        g.circle(x, y, 15);
        g.stroke();
      });
    },
    [width, height]
  );

  return <PixiGraphicsComponent draw={drawBackground} />;
}
