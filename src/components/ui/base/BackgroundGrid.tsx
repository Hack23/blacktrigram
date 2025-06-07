import React, { useMemo, useCallback } from "react";
import { Graphics, useTick } from "@pixi/react";
import type {
  BackgroundGridProps as ComponentBackgroundGridProps,
  GameComponentProps,
} from "../../../types/components"; // Corrected import
import { KOREAN_COLORS, GAME_CONFIG } from "../../../types/constants";
import * as PIXI from "pixi.js";

// Interface name changed to avoid conflict with imported type
export interface LocalBackgroundGridProps extends GameComponentProps {
  gridSize?: number;
  lineColor?: number | string; // Allow string for hex
  lineWidth?: number;
  pulseEffect?: boolean;
  time?: number; // Added time prop
}

export const BackgroundGrid: React.FC<LocalBackgroundGridProps> = ({
  width = GAME_CONFIG.CANVAS_WIDTH,
  height = GAME_CONFIG.CANVAS_HEIGHT,
  gridSize = 50,
  lineColor: initialLineColor = KOREAN_COLORS.PRIMARY_CYAN,
  lineWidth = 1,
  pulseEffect = true,
  visible = true,
  interactive, // Added from props
  time: propTime, // Added from props
  ...props
}) => {
  const [internalTime, setInternalTime] = React.useState(0);
  useTick((delta) => {
    if (propTime === undefined) {
      // Only use internal tick if time prop is not provided
      setInternalTime((t) => t + delta);
    }
  });

  const currentTime = propTime !== undefined ? propTime : internalTime;

  const resolvedLineColor = useMemo(() => {
    // Unused but kept for structure
    if (typeof initialLineColor === "string") {
      return parseInt(initialLineColor.replace("#", ""), 16);
    }
    return initialLineColor || KOREAN_COLORS.ACCENT_BLUE;
  }, [initialLineColor]);

  const drawGrid = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      if (!visible) return;

      const effectiveLineColor =
        interactive && pulseEffect // Check interactive here
          ? KOREAN_COLORS.ACCENT_PRIMARY // Example hover color
          : typeof initialLineColor === "string"
          ? parseInt(initialLineColor.replace("#", ""), 16)
          : initialLineColor;

      let alpha = 0.2;
      if (pulseEffect) {
        alpha = 0.1 + (Math.sin(currentTime * 0.05) + 1) * 0.15; // Pulsating alpha
      }

      g.lineStyle(lineWidth, effectiveLineColor, alpha);

      for (let i = 0; i <= width; i += gridSize) {
        g.moveTo(i, 0);
        g.lineTo(i, height);
      }
      for (let j = 0; j <= height; j += gridSize) {
        g.moveTo(0, j);
        g.lineTo(width, j);
      }
    },
    [
      width,
      height,
      gridSize,
      initialLineColor,
      lineWidth,
      pulseEffect,
      visible,
      currentTime,
      interactive,
    ] // Added interactive
  );

  return <Graphics draw={drawGrid} {...props} />;
};
