import React from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import { COMBAT_CONTROLS } from "../../../types/constants/controls";
import {
  ResponsivePixiButton,
  ResponsivePixiContainer,
  ResponsivePixiPanel,
} from "../../ui/base/ResponsivePixiComponents";

export interface ControlsSectionProps {
  readonly onBack: () => void;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
}

export const ControlsSection: React.FC<ControlsSectionProps> = ({
  onBack,
  x = 0,
  y = 0,
  width = 800,
  height = 600,
}) => {
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  return (
    <ResponsivePixiPanel
      title="조작법 (Controls)"
      x={x}
      y={y}
      width={width}
      height={height}
      screenWidth={width}
      screenHeight={height}
      data-testid="controls-section"
    >
      {/* Trigram Stances Section */}
      <ResponsivePixiContainer
        x={0}
        y={0}
        screenWidth={width}
        screenHeight={height}
        data-testid="trigram-controls"
      >
        <pixiText
          text="팔괘 자세 (Trigram Stances)"
          style={{
            fontSize: isMobile ? 18 : 24,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
          }}
          x={20}
          y={0}
        />

        {/* Stance Controls Grid */}
        <ResponsivePixiContainer
          x={20}
          y={35}
          screenWidth={width}
          screenHeight={height}
          data-testid="stance-controls-grid"
        >
          {Object.entries(COMBAT_CONTROLS.stanceControls).map(
            ([key, value], index) => {
              const buttonsPerRow = isMobile ? 2 : isTablet ? 4 : 4;
              const buttonWidth = isMobile ? 160 : 180;
              const buttonHeight = isMobile ? 40 : 35;
              const xPos = (index % buttonsPerRow) * (buttonWidth + 10);
              const yPos =
                Math.floor(index / buttonsPerRow) * (buttonHeight + 10);

              return (
                <ResponsivePixiContainer
                  key={key}
                  x={xPos}
                  y={yPos}
                  screenWidth={width}
                  screenHeight={height}
                  data-testid={`stance-control-${key}`}
                >
                  <pixiGraphics
                    draw={(g) => {
                      g.clear();
                      g.fill({
                        color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                        alpha: 0.8,
                      });
                      g.roundRect(0, 0, buttonWidth, buttonHeight, 6);
                      g.fill();
                      g.stroke({
                        width: 1,
                        color: KOREAN_COLORS.ACCENT_GOLD,
                        alpha: 0.6,
                      });
                      g.roundRect(0, 0, buttonWidth, buttonHeight, 6);
                      g.stroke();
                    }}
                  />
                  <pixiText
                    text={`${key}: ${value.korean} (${value.technique})`}
                    style={{
                      fontSize: isMobile ? 10 : 12,
                      fill: KOREAN_COLORS.TEXT_SECONDARY,
                      fontFamily: "Arial, sans-serif",
                    }}
                    x={8}
                    y={buttonHeight / 2}
                    anchor={{ x: 0, y: 0.5 }}
                  />
                </ResponsivePixiContainer>
              );
            }
          )}
        </ResponsivePixiContainer>
      </ResponsivePixiContainer>

      {/* Combat Controls Section */}
      <ResponsivePixiContainer
        x={0}
        y={height * 0.5}
        screenWidth={width}
        screenHeight={height}
        data-testid="combat-controls"
      >
        <pixiText
          text="전투 조작 (Combat Controls)"
          style={{
            fontSize: isMobile ? 18 : 24,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
          }}
          x={20}
          y={0}
        />

        {Object.entries(COMBAT_CONTROLS.combat).map(
          ([key, description], index) => (
            <ResponsivePixiContainer
              key={key}
              x={20}
              y={35 + index * (isMobile ? 25 : 30)}
              screenWidth={width}
              screenHeight={height}
              data-testid={`combat-control-${key}`}
            >
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color: KOREAN_COLORS.UI_BACKGROUND_LIGHT,
                    alpha: 0.6,
                  });
                  g.roundRect(0, 0, width - 80, isMobile ? 20 : 25, 4);
                  g.fill();
                }}
              />
              <pixiText
                text={`${key}: ${description}`}
                style={{
                  fontSize: isMobile ? 11 : 14,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  fontFamily: "Arial, sans-serif",
                }}
                x={8}
                y={(isMobile ? 20 : 25) / 2}
                anchor={{ x: 0, y: 0.5 }}
              />
            </ResponsivePixiContainer>
          )
        )}
      </ResponsivePixiContainer>

      {/* Back Button */}
      <pixiContainer
        x={width - 150}
        y={height - 80}
        layout={{
          alignSelf: "flex-end",
        }}
      >
        <ResponsivePixiButton
          text="돌아가기"
          width={120}
          height={40}
          screenWidth={width}
          screenHeight={height}
          variant="secondary"
          onClick={onBack}
          data-testid="controls-back-button"
        />
      </pixiContainer>
    </ResponsivePixiPanel>
  );
};

export default ControlsSection;
