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
  const [scale, setScale] = useState(1);

  // Enhanced fade out animation with scale
  useEffect(() => {
    if (visible) {
      // Use microtask to avoid synchronous setState warning
      Promise.resolve().then(() => {
        setAlpha(1);
        setOffsetY(0);
        setScale(1.2); // Start larger
      });
      
      // Scale down quickly
      const scaleTimer = setTimeout(() => {
        setScale(1);
      }, 100);
      
      // Then fade out
      const fadeTimer = setTimeout(() => {
        setAlpha(0);
        setOffsetY(-30);
      }, 1500);
      
      return () => {
        clearTimeout(scaleTimer);
        clearTimeout(fadeTimer);
      };
    }
  }, [visible, feedback]);

  if (!visible) return null;

  // Determine feedback color based on content
  const getFeedbackColor = () => {
    if (feedback.includes("완벽") || feedback.includes("Perfect")) {
      return KOREAN_COLORS.ACCENT_GREEN;
    } else if (feedback.includes("좋은") || feedback.includes("Good")) {
      return KOREAN_COLORS.ACCENT_GOLD;
    } else if (feedback.includes("빗나감") || feedback.includes("Miss")) {
      return KOREAN_COLORS.ACCENT_RED;
    }
    return KOREAN_COLORS.PRIMARY_CYAN;
  };

  const feedbackColor = getFeedbackColor();

  return (
    <pixiContainer
      x={x}
      y={y + offsetY}
      alpha={alpha}
      scale={scale}
      data-testid="training-feedback"
      layout={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {/* Enhanced background with glow */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          
          // Outer glow
          g.fill({ color: feedbackColor, alpha: 0.2 * alpha });
          g.roundRect(-85, -32, 170, 64, 14);
          g.fill();
          
          // Main background
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.95 });
          g.roundRect(-80, -30, 160, 60, 12);
          g.fill();

          // Gradient top highlight
          g.fill({ color: feedbackColor, alpha: 0.3 });
          g.roundRect(-78, -28, 156, 15, 10);
          g.fill();

          // Border with feedback color
          g.stroke({ width: 2, color: feedbackColor, alpha: 0.9 });
          g.roundRect(-80, -30, 160, 60, 12);
          g.stroke();
          
          // Inner accent
          g.stroke({ width: 1, color: KOREAN_COLORS.TEXT_BRIGHT, alpha: 0.4 });
          g.roundRect(-78, -28, 156, 56, 10);
          g.stroke();
        }}
        layout={{
          position: "absolute",
          alignSelf: "center",
        }}
      />

      {/* Main feedback text with enhanced styling */}
      <pixiText
        text={feedback}
        style={{
          fontSize: isMobile ? 16 : 20,
          fill: feedbackColor,
          fontWeight: "bold",
          fontFamily: "Noto Sans KR",
          align: "center",
          dropShadow: {
            color: KOREAN_COLORS.BLACK,
            distance: 3,
            alpha: 0.9,
            blur: 4,
          },
          stroke: {
            color: KOREAN_COLORS.UI_BACKGROUND_DARK,
            width: 2,
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