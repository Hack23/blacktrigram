import React, { useEffect, useState } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { extendPixiComponents } from "../../../utils/pixiExtensions";

extendPixiComponents();

type TrainingMode = "basics" | "advanced" | "free";

export interface TrainingModeSelectorProps {
  readonly currentMode: TrainingMode;
  readonly onModeChange: (mode: TrainingMode) => void;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly isMobile: boolean;
}

const MODE_DATA: Record<
  TrainingMode,
  {
    korean: string;
    english: string;
    description: string;
    color: number;
    icon: string;
  }
> = {
  basics: {
    korean: "기초",
    english: "Basics",
    description: "기본 타격 연습",
    color: KOREAN_COLORS.ACCENT_GREEN,
    icon: "◯",
  },
  advanced: {
    korean: "고급",
    english: "Advanced",
    description: "급소 정밀 타격",
    color: KOREAN_COLORS.ACCENT_RED,
    icon: "◆",
  },
  free: {
    korean: "자유",
    english: "Free",
    description: "자유로운 연습",
    color: KOREAN_COLORS.PRIMARY_CYAN,
    icon: "☯",
  },
};

export const TrainingModeSelector: React.FC<TrainingModeSelectorProps> = ({
  currentMode,
  onModeChange,
  x,
  y,
  width,
  height,
  isMobile,
}) => {
  const modes = Object.keys(MODE_DATA) as TrainingMode[];
  const buttonWidth = (width - 20) / modes.length - 10;

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
    <pixiContainer x={x} y={y} data-testid="training-mode-selector">
      {/* Enhanced Panel Background with gradient effect */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          
          // More transparent background to show dojang
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.7 });
          g.roundRect(0, 0, width, height, 10);
          g.fill();

          // Enhanced border with glow
          g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
          g.roundRect(0, 0, width, height, 10);
          g.stroke();
          
          // Inner accent line for depth
          g.stroke({ width: 1, color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.4 });
          g.roundRect(2, 2, width - 4, height - 4, 8);
          g.stroke();
        }}
      />

      {/* Mode Buttons */}
      {modes.map((mode, index) => {
        const isSelected = currentMode === mode;
        const modeData = MODE_DATA[mode];
        const buttonX = 10 + index * (buttonWidth + 10);

        return (
          <pixiContainer
            key={mode}
            x={buttonX}
            y={10}
            interactive={true}
            onPointerDown={() => onModeChange(mode)}
            data-testid={`mode-${mode}`}
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();

                // Enhanced button background with hover effect simulation
                const bgAlpha = isSelected ? 0.95 : 0.75;
                g.fill({
                  color: isSelected
                    ? modeData.color
                    : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: bgAlpha,
                });
                g.roundRect(0, 0, buttonWidth, height - 20, 8);
                g.fill();

                // Inner highlight for depth
                if (isSelected) {
                  g.fill({ color: KOREAN_COLORS.TEXT_BRIGHT, alpha: 0.1 });
                  g.roundRect(2, 2, buttonWidth - 4, 8, 4);
                  g.fill();
                }

                // Enhanced selection glow with pulse effect using controlled animation
                if (isSelected) {
                  const pulse = 1 + Math.sin(animationTime * 3) * 0.2;
                  g.stroke({ width: 2 * pulse, color: modeData.color, alpha: 0.9 });
                  g.roundRect(-2, -2, buttonWidth + 4, height - 16, 10);
                  g.stroke();
                  
                  // Secondary glow
                  g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.5 });
                  g.roundRect(-4, -4, buttonWidth + 8, height - 12, 12);
                  g.stroke();
                }

                // Enhanced border
                g.stroke({
                  width: isSelected ? 2 : 1,
                  color: isSelected
                    ? KOREAN_COLORS.TEXT_BRIGHT
                    : KOREAN_COLORS.TEXT_SECONDARY,
                  alpha: isSelected ? 1.0 : 0.6,
                });
                g.roundRect(0, 0, buttonWidth, height - 20, 8);
                g.stroke();
              }}
            />

            {/* Mode Icon */}
            <pixiText
              text={modeData.icon}
              style={{
                fontSize: isMobile ? 12 : 14,
                fill: isSelected ? KOREAN_COLORS.TEXT_BRIGHT : modeData.color,
                fontWeight: "bold",
              }}
              x={buttonWidth / 2}
              y={8}
              anchor={0.5}
            />

            {/* Korean Text */}
            <pixiText
              text={modeData.korean}
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: isSelected
                  ? KOREAN_COLORS.TEXT_BRIGHT
                  : KOREAN_COLORS.TEXT_PRIMARY,
                fontWeight: "bold",
                fontFamily: FONT_FAMILY.KOREAN,
                align: "center",
              }}
              x={buttonWidth / 2}
              y={height - 32}
              anchor={0.5}
            />

            {/* English Text */}
            <pixiText
              text={modeData.english}
              style={{
                fontSize: isMobile ? 8 : 9,
                fill: isSelected
                  ? KOREAN_COLORS.TEXT_SECONDARY
                  : KOREAN_COLORS.TEXT_TERTIARY,
                fontStyle: "italic",
                align: "center",
              }}
              x={buttonWidth / 2}
              y={height - 18}
              anchor={0.5}
            />
          </pixiContainer>
        );
      })}

      {/* Mode Description */}
      <pixiContainer x={width / 2} y={height + 5}>
        <pixiText
          text={MODE_DATA[currentMode].description}
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: FONT_FAMILY.KOREAN,
            align: "center",
          }}
          anchor={0.5}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default TrainingModeSelector;
