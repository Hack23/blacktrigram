// src/components/combat/components/RoundStatusDisplay.tsx
import "@pixi/layout";
import { extend } from "@pixi/react";
import * as PIXI from "pixi.js";
import { Container } from "pixi.js";

import React, { useEffect, useRef, useState } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { extendPixiComponents } from "../../../utils/pixiExtensions";

// Register PixiJS classes for use as JSX components
extend({
  Container,
  Text,
});

// Ensure PixiJS components are extended
extendPixiComponents();

export interface RoundStatusDisplayProps {
  readonly round: number;
  readonly status: "ready" | "start" | "fight" | "ko" | "end";
  readonly width: number;
  readonly height: number;
  readonly onAnimationComplete?: () => void;
}

const getStatusText = (
  status: RoundStatusDisplayProps["status"],
  round: number
): { korean: string; english: string } => {
  switch (status) {
    case "start":
      return { korean: `제 ${round} 회`, english: `Round ${round}` };
    case "fight":
      return { korean: "시작!", english: "FIGHT!" };
    case "ko":
      return { korean: "승리!", english: "K.O.!" };
    case "end":
      return { korean: "종료", english: "Match Over" };
    default:
      return { korean: "", english: "" };
  }
};

export const RoundStatusDisplay: React.FC<RoundStatusDisplayProps> = ({
  round,
  status,
  width,
  height,
  onAnimationComplete,
}) => {
  const [alpha, setAlpha] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [rotation, setRotation] = useState(0);
  const textRef = useRef<PIXI.Text>(null);

  const { korean, english } = getStatusText(status, round);

  useEffect(() => {
    let animationFrames: NodeJS.Timeout[] = [];

    // Enhanced animation sequence with rotation
    const frames = [
      { alpha: 0, scale: 1.8, rotation: -0.1, delay: 0 },
      { alpha: 1, scale: 1.0, rotation: 0, delay: 100 },
      { alpha: 1, scale: 1.05, rotation: 0.02, delay: 300 },
      { alpha: 1, scale: 1.0, rotation: 0, delay: 400 },
    ];

    frames.forEach(frame => {
      const timeoutId = setTimeout(() => {
        setAlpha(frame.alpha);
        setScale(frame.scale);
        setRotation(frame.rotation);
      }, frame.delay);
      animationFrames.push(timeoutId);
    });

    // Hold for a moment, then fade out with rotation
    const holdTimeout = setTimeout(() => {
      setAlpha(0);
      setScale(0.7);
      setRotation(0.1);
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, 500);
      }
    }, 1500);
    animationFrames.push(holdTimeout);

    return () => {
      animationFrames.forEach(clearTimeout);
    };
  }, [status, round, onAnimationComplete]);

  const textStyle = new PIXI.TextStyle({
    fontFamily: FONT_FAMILY.KOREAN,
    fontSize: 80,
    fontWeight: "900",
    fill: KOREAN_COLORS.ACCENT_GOLD,
    stroke: { color: KOREAN_COLORS.BLACK, width: 8 },
    dropShadow: {
      color: KOREAN_COLORS.BLACK,
      blur: 15,
      distance: 5,
      alpha: 0.8,
    },
    align: "center",
  });

  const subTextStyle = new PIXI.TextStyle({
    ...textStyle,
    fontSize: 40,
    fill: KOREAN_COLORS.TEXT_BRIGHT,
    stroke: { color: KOREAN_COLORS.BLACK, width: 4 },
  });

  return (
    <pixiContainer
      x={width / 2}
      y={height / 2}
      alpha={alpha}
      scale={scale}
      rotation={rotation}
      pivot={{ x: 0.5, y: 0.5 }}
      data-testid="round-status-display"
      layout={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      {/* Background glow effect */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.3 * alpha });
          g.circle(0, 0, 250);
        }}
        x={0}
        y={20}
      />

      <pixiText
        ref={textRef}
        text={korean}
        style={textStyle}
        anchor={{ x: 0.5, y: 0.5 }}
      />
      <pixiText
        text={english}
        style={subTextStyle}
        anchor={{ x: 0.5, y: 0.5 }}
        y={80}
      />
    </pixiContainer>
  );
};
