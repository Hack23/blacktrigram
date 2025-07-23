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
  const textRef = useRef<PIXI.Text>(null);

  const { korean, english } = getStatusText(status, round);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Fade in and scale down
    setAlpha(1);
    setScale(1);

    // Hold for a moment, then fade out
    timeoutId = setTimeout(() => {
      setAlpha(0);
      setScale(0.8);
      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, 500); // Call complete after fade out
      }
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
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
