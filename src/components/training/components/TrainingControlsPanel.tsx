import React from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import { extendPixiComponents } from "../../../utils/pixiExtensions";
import { ResponsivePixiPanel } from "../../ui/base/ResponsivePixiComponents";

extendPixiComponents();

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
  return (
    <ResponsivePixiPanel
      title="훈련 조작 | Training Controls"
      width={width}
      height={height}
      screenWidth={width * 2}
      screenHeight={height * 2}
      data-testid="training-controls-panel"
    >
      {/* Start/Stop Button */}
      <pixiContainer x={20} y={20}>
        <pixiContainer
          interactive={true}
          onPointerDown={isTraining ? onStopTraining : onStartTraining}
          data-testid="start-stop-button"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color: isTraining
                  ? KOREAN_COLORS.ACCENT_RED
                  : KOREAN_COLORS.ACCENT_GREEN,
                alpha: 0.8,
              });
              g.roundRect(0, 0, isMobile ? 100 : 120, 35, 8);
              g.fill();

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.TEXT_PRIMARY,
                alpha: 0.8,
              });
              g.roundRect(0, 0, isMobile ? 100 : 120, 35, 8);
              g.stroke();
            }}
          />
          <pixiText
            text={isTraining ? "중지" : "시작"}
            style={{
              fontSize: isMobile ? 12 : 16,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
            x={(isMobile ? 100 : 120) / 2}
            y={17.5}
            anchor={0.5}
          />
        </pixiContainer>
      </pixiContainer>

      {/* Instructions */}
      <pixiContainer x={20} y={70}>
        <pixiText
          text="조작법:"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
          }}
        />
        <pixiText
          text="WASD - 이동 | Move"
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Noto Sans KR",
          }}
          y={15}
        />
        <pixiText
          text="Space - 공격 | Attack"
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Noto Sans KR",
          }}
          y={25}
        />
        <pixiText
          text="1-8 - 자세 변경 | Stance"
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Noto Sans KR",
          }}
          y={35}
        />
      </pixiContainer>
    </ResponsivePixiPanel>
  );
};

export default TrainingControlsPanel;
