import React from "react";
import * as PIXI from "pixi.js";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import { KOREAN_COLORS } from "../../../types/constants";

export interface BackgroundGridProps {
  readonly width?: number;
  readonly height?: number;
  readonly gridSize?: number;
  readonly lineColor?: number;
  readonly lineAlpha?: number;
  readonly showMajorLines?: boolean;
  readonly x?: number;
  readonly y?: number;
}

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({
  width = 800,
  height = 600,
  gridSize = 50,
  lineColor = KOREAN_COLORS.UI_BORDER,
  lineAlpha = 0.3,
  showMajorLines = true,
  x = 0,
  y = 0,
}) => {
  usePixiExtensions();

  const drawGrid = React.useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Minor grid lines
      g.lineStyle(1, lineColor, lineAlpha);

      // Vertical lines
      for (let i = 0; i <= width; i += gridSize) {
        g.moveTo(i, 0);
        g.lineTo(i, height);
      }

      // Horizontal lines
      for (let i = 0; i <= height; i += gridSize) {
        g.moveTo(0, i);
        g.lineTo(width, i);
      }

      // Major grid lines
      if (showMajorLines) {
        g.lineStyle(2, lineColor, lineAlpha * 1.5);

        // Major vertical lines (every 5 grid units)
        for (let i = 0; i <= width; i += gridSize * 5) {
          g.moveTo(i, 0);
          g.lineTo(i, height);
        }

        // Major horizontal lines (every 5 grid units)
        for (let i = 0; i <= height; i += gridSize * 5) {
          g.moveTo(0, i);
          g.lineTo(width, i);
        }
      }
    },
    [width, height, gridSize, lineColor, lineAlpha, showMajorLines]
  );

  return (
    <pixiContainer x={x} y={y} data-testid="background-grid">
      <pixiGraphics draw={drawGrid} />
    </pixiContainer>
  );
};

export default BackgroundGrid;
