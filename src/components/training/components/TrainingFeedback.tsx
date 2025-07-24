import React, { useEffect, useState } from "react";
import {  KOREAN_COLORS } from "../../../types/constants";
import { extendPixiComponents } from "../../../utils/pixiExtensions";

// Ensure PixiJS components are extended
extendPixiComponents();

export interface TrainingFeedbackProps {
  readonly feedback: string;
  readonly score: number;
  readonly combo: number;
  readonly x: number;
  readonly y: number;
  readonly visible: boolean;
  readonly isMobile: boolean;
}

export const TrainingFeedback: React.FC<TrainingFeedbackProps> = ({
  feedback,
  score,
  combo,
  x,
  y,
  visible,
  isMobile,
}) => {
  const [alpha, setAlpha] = useState(1);
  const [offsetY, setOffsetY] = useState(0);

  // Fade out animation
  useEffect(() => {
    if (visible) {
      setAlpha(1);
      setOffsetY(0);
      const timer = setTimeout(() => {
        setAlpha(0);
        setOffsetY(-30);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [visible, feedback]);

  if (!visible) return null;

  return (
    <pixiContainer
      x={x}
      y={y + offsetY}
      alpha={alpha}
      data-testid="training-feedback"
      layout={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {/* Enhanced background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
          g.roundRect(-80, -30, 160, 60, 12);
          g.fill();

          g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
          g.roundRect(-80, -30, 160, 60, 12);
          g.stroke();
        }}
        layout={{
          position: "absolute",
          alignSelf: "center",
        }}
      />

      {/* Main feedback text */}
      <pixiText
        text={feedback}
        style={{
          fontSize: isMobile ? 14 : 18,
          fill: KOREAN_COLORS.ACCENT_GOLD,
          fontWeight: "bold",
          fontFamily: "Noto Sans KR",
          align: "center",
          dropShadow: {
            color: KOREAN_COLORS.BLACK,
            distance: 2,
            alpha: 0.8,
          },
        }}
        anchor={0.5}
        layout={{
          alignSelf: "center",
        }}
      />

      {/* Score and combo display */}
      {(score > 0 || combo > 0) && (
        <pixiContainer
          layout={{
            flexDirection: "row",
            gap: 15,
            alignItems: "center",
          }}
          y={20}
        >
          {score > 0 && (
            <pixiText
              text={`점수: ${score}`}
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: KOREAN_COLORS.PRIMARY_CYAN,
                fontFamily: "Noto Sans KR",
                fontWeight: "bold",
              }}
              anchor={0.5}
            />
          )}

          {combo > 1 && (
            <pixiText
              text={`${combo}연타!`}
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: KOREAN_COLORS.ACCENT_RED,
                fontFamily: "Noto Sans KR",
                fontWeight: "bold",
              }}
              anchor={0.5}
            />
          )}
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default TrainingFeedback;