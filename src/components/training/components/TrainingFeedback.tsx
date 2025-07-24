import React, { useEffect, useState } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
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
  const [alpha, setAlpha] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [displayY, setDisplayY] = useState(y);

  useEffect(() => {
    if (visible && feedback) {
      // Fade in and animate
      setAlpha(1);
      setScale(1);
      setDisplayY(y);

      // Animate upward and fade out
      const animateTimer = setTimeout(() => {
        setAlpha(0);
        setScale(0.8);
        setDisplayY(y - 50);
      }, 1500);

      return () => clearTimeout(animateTimer);
    } else {
      setAlpha(0);
    }
  }, [visible, feedback, y]);

  if (!visible || !feedback) return null;

  const [koreanText, englishText] = feedback.split(" | ");

  return (
    <pixiContainer
      x={x}
      y={displayY}
      alpha={alpha}
      scale={{ x: scale, y: scale }}
      data-testid="training-feedback"
      layout={{
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      {/* Feedback Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
          g.roundRect(-120, -40, 240, 80, 12);
          g.fill();

          g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
          g.roundRect(-120, -40, 240, 80, 12);
          g.stroke();
        }}
        layout={{
          position: "absolute",
          alignSelf: "center",
        }}
      />

      {/* Korean Feedback Text */}
      <pixiText
        text={koreanText || feedback}
        style={{
          fontSize: isMobile ? 16 : 20,
          fill: KOREAN_COLORS.ACCENT_GOLD,
          fontWeight: "bold",
          fontFamily: FONT_FAMILY.KOREAN,
          align: "center",
          dropShadow: {
            color: KOREAN_COLORS.BLACK,
            distance: 2,
            alpha: 0.7,
          },
        }}
        anchor={0.5}
        y={-15}
      />

      {/* English Feedback Text */}
      {englishText && (
        <pixiText
          text={englishText}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontStyle: "italic",
            fontFamily: FONT_FAMILY.PRIMARY,
            align: "center",
          }}
          anchor={0.5}
          y={5}
        />
      )}

      {/* Score Display */}
      {score > 0 && (
        <pixiContainer y={25}>
          <pixiText
            text={`점수: ${score} | Score: ${score}`}
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.KOREAN,
              align: "center",
            }}
            anchor={0.5}
          />
        </pixiContainer>
      )}

      {/* Combo Display */}
      {combo > 1 && (
        <pixiContainer x={100} y={-20}>
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.ACCENT_RED, alpha: 0.8 });
              g.circle(0, 0, 15);
              g.fill();

              g.stroke({ width: 2, color: KOREAN_COLORS.TEXT_PRIMARY });
              g.circle(0, 0, 15);
              g.stroke();
            }}
          />
          <pixiText
            text={`${combo}연`}
            style={{
              fontSize: isMobile ? 8 : 10,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.KOREAN,
              align: "center",
            }}
            anchor={0.5}
            y={-3}
          />
          <pixiText
            text="COMBO"
            style={{
              fontSize: 6,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              align: "center",
            }}
            anchor={0.5}
            y={8}
          />
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default TrainingFeedback;
