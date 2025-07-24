import React from "react";
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

  return (
    <pixiContainer x={x} y={y} data-testid="training-mode-selector">
      {/* Panel Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.95 });
          g.roundRect(0, 0, width, height, 10);
          g.fill();

          g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.6 });
          g.roundRect(0, 0, width, height, 10);
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

                // Button background
                g.fill({
                  color: isSelected
                    ? modeData.color
                    : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: isSelected ? 0.9 : 0.7,
                });
                g.roundRect(0, 0, buttonWidth, height - 20, 8);
                g.fill();

                // Selection glow
                if (isSelected) {
                  g.stroke({ width: 2, color: modeData.color, alpha: 0.8 });
                  g.roundRect(-2, -2, buttonWidth + 4, height - 16, 10);
                  g.stroke();
                }

                // Border
                g.stroke({
                  width: 1,
                  color: isSelected
                    ? KOREAN_COLORS.TEXT_BRIGHT
                    : KOREAN_COLORS.TEXT_SECONDARY,
                  alpha: 0.8,
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
