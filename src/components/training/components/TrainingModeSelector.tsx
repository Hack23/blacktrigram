import React from "react";
import { KOREAN_COLORS } from "../../../types/constants";
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

const MODE_DATA: Record<TrainingMode, { korean: string; english: string }> = {
  basics: { korean: "기초", english: "Basics" },
  advanced: { korean: "고급", english: "Advanced" },
  free: { korean: "자유", english: "Free" },
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
  const buttonWidth = width / modes.length - 10;

  return (
    <pixiContainer x={x} y={y} data-testid="training-mode-selector">
      {modes.map((mode, index) => {
        const isSelected = currentMode === mode;
        const modeData = MODE_DATA[mode];

        return (
          <pixiContainer
            key={mode}
            x={index * (buttonWidth + 10)}
            y={0}
            interactive={true}
            onPointerDown={() => onModeChange(mode)}
            data-testid={`mode-${mode}`}
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: isSelected
                    ? KOREAN_COLORS.ACCENT_GOLD
                    : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, buttonWidth, height, 5);
                g.fill();

                g.stroke({
                  width: 1,
                  color: isSelected
                    ? KOREAN_COLORS.PRIMARY_CYAN
                    : KOREAN_COLORS.TEXT_SECONDARY,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, buttonWidth, height, 5);
                g.stroke();
              }}
            />
            <pixiText
              text={modeData.korean}
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: isSelected
                  ? KOREAN_COLORS.UI_BACKGROUND_DARK
                  : KOREAN_COLORS.TEXT_PRIMARY,
                fontWeight: "bold",
                fontFamily: "Noto Sans KR",
              }}
              x={buttonWidth / 2}
              y={height / 2}
              anchor={0.5}
            />
          </pixiContainer>
        );
      })}
    </pixiContainer>
  );
};

export default TrainingModeSelector;
