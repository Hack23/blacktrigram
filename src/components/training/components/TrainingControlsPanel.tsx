import { extend } from "@pixi/react";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import React, { useEffect, useState } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";

// Register PixiJS components
extend({ Container, Graphics, Sprite, Text });

export interface TrainingControlsPanelProps {
  readonly isTraining: boolean;
  readonly onStartTraining: () => void;
  readonly onStopTraining: () => void;
  readonly width: number;
  readonly height: number;
  readonly isMobile: boolean;
}

export const TrainingControlsPanel: React.FC<TrainingControlsPanelProps> = ({
  isTraining,
  onStartTraining,
  onStopTraining,
  width,
  height,
  isMobile,
}) => {
  // Animation state for smooth pulsing effects
  const [animationTime, setAnimationTime] = useState(0);

  // Controlled animation loop
  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      setAnimationTime(elapsed);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <pixiContainer data-testid="training-controls-panel">
      {/* Enhanced Panel Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          
          // More transparent background
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.75 });
          g.roundRect(0, 0, width, height, 12);
          g.fill();

          // Border with training state color and enhanced glow
          const borderColor = isTraining
            ? KOREAN_COLORS.ACCENT_GREEN
            : KOREAN_COLORS.PRIMARY_CYAN;
          g.stroke({ width: 2, color: borderColor, alpha: 0.9 });
          g.roundRect(0, 0, width, height, 12);
          g.stroke();

          // Inner accent border with pulse for training state using controlled animation
          const innerAlpha = isTraining ? 0.5 + Math.sin(animationTime * 5) * 0.2 : 0.4;
          g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: innerAlpha });
          g.roundRect(2, 2, width - 4, height - 4, 10);
          g.stroke();
          
          // Corner decorations for Korean aesthetic
          const corners = [
            { x: 8, y: 8 },
            { x: width - 8, y: 8 },
            { x: 8, y: height - 8 },
            { x: width - 8, y: height - 8 },
          ];
          
          corners.forEach((corner) => {
            g.stroke({ width: 2, color: borderColor, alpha: 0.6 });
            g.moveTo(corner.x - 4, corner.y);
            g.lineTo(corner.x + 4, corner.y);
            g.moveTo(corner.x, corner.y - 4);
            g.lineTo(corner.x, corner.y + 4);
            g.stroke();
          });
        }}
      />

      {/* Header */}
      <pixiContainer x={15} y={15}>
        <pixiText
          text="훈련 조작"
          style={{
            fontSize: isMobile ? 14 : 16,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
          }}
        />
        <pixiText
          text="Training Controls"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontStyle: "italic",
          }}
          y={isMobile ? 16 : 18}
        />
      </pixiContainer>

      {/* Status Indicator with enhanced animation */}
      <pixiContainer x={width - 20} y={15}>
        <pixiGraphics
          draw={(g) => {
            g.clear();
            const statusColor = isTraining
              ? KOREAN_COLORS.ACCENT_GREEN
              : KOREAN_COLORS.UI_GRAY;

            // Main status dot
            g.fill({ color: statusColor, alpha: 0.9 });
            g.circle(0, 0, 6);
            g.fill();

            // Enhanced pulsing effect when training using controlled animation
            if (isTraining) {
              const pulse = 1 + Math.sin(animationTime * 6) * 0.4;
              
              // Outer pulse ring
              g.stroke({ width: 2, color: statusColor, alpha: 0.6 * (1 - pulse / 2) });
              g.circle(0, 0, 8 * pulse);
              g.stroke();
              
              // Inner glow
              g.fill({ color: KOREAN_COLORS.TEXT_BRIGHT, alpha: 0.3 });
              g.circle(0, 0, 3);
              g.fill();
            }
          }}
        />
      </pixiContainer>

      {/* Start/Stop Button */}
      <pixiContainer x={15} y={isMobile ? 45 : 50}>
        <pixiContainer
          interactive={true}
          onPointerDown={isTraining ? onStopTraining : onStartTraining}
          data-testid="start-stop-button"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              const buttonColor = isTraining
                ? KOREAN_COLORS.ACCENT_RED
                : KOREAN_COLORS.ACCENT_GREEN;

              // Button background with gradient effect
              g.fill({ color: buttonColor, alpha: 0.9 });
              g.roundRect(0, 0, width - 30, 35, 8);
              g.fill();

              // Hover effect
              g.fill({ color: KOREAN_COLORS.TEXT_BRIGHT, alpha: 0.1 });
              g.roundRect(0, 0, width - 30, 35, 8);
              g.fill();

              // Border
              g.stroke({
                width: 2,
                color: KOREAN_COLORS.TEXT_PRIMARY,
                alpha: 0.8,
              });
              g.roundRect(0, 0, width - 30, 35, 8);
              g.stroke();

              // Inner highlight
              g.stroke({
                width: 1,
                color: KOREAN_COLORS.TEXT_BRIGHT,
                alpha: 0.3,
              });
              g.roundRect(2, 2, width - 34, 31, 6);
              g.stroke();
            }}
          />

          {/* Button Icon */}
          <pixiText
            text={isTraining ? "⏹" : "▶"}
            style={{
              fontSize: isMobile ? 14 : 16,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
            }}
            x={15}
            y={17.5}
            anchor={0.5}
          />

          {/* Button Text */}
          <pixiText
            text={isTraining ? "중지" : "시작"}
            style={{
              fontSize: isMobile ? 12 : 14,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.KOREAN,
            }}
            x={(width - 30) / 2}
            y={17.5}
            anchor={0.5}
          />
        </pixiContainer>
      </pixiContainer>

      {/* Control Instructions */}
      <pixiContainer x={15} y={height - 35}>
        <pixiText
          text="조작법:"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.ACCENT_CYAN,
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
          }}
        />
      </pixiContainer>

      <pixiContainer x={15} y={height - 20}>
        <pixiText
          text="WASD-이동 | Space-공격 | 1-8-자세"
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: FONT_FAMILY.KOREAN,
          }}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default TrainingControlsPanel;
