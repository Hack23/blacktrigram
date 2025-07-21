import { COMBAT_CONTROLS } from "@/systems";
import * as PIXI from "pixi.js";
import React from "react";
import { KOREAN_COLORS } from "../../../types/constants";

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
  const isMobile = PIXI.isMobile.phone;
  const isTablet = PIXI.isMobile.tablet;

  // Calculate responsive dimensions
  const contentPadding = isMobile ? 15 : 20;
  const sectionSpacing = isMobile ? 20 : 30;
  const buttonArea = isMobile ? 60 : 80;
  const availableHeight = height - buttonArea - contentPadding * 2;

  // Calculate stance section height (ensure it doesn't overflow)
  const stanceControlsCount = Object.keys(
    COMBAT_CONTROLS.stanceControls
  ).length;
  const buttonsPerRow = isMobile ? 2 : isTablet ? 3 : 4;
  const buttonHeight = isMobile ? 35 : 40;
  const buttonSpacing = 10;
  const stanceRows = Math.ceil(stanceControlsCount / buttonsPerRow);
  const stanceSectionHeight = Math.min(
    35 + stanceRows * (buttonHeight + buttonSpacing) + 20,
    availableHeight * 0.6
  );

  // Calculate combat section height
  const combatControlsCount = Object.keys(COMBAT_CONTROLS.combat).length;
  const combatItemHeight = isMobile ? 25 : 30;
  const combatSectionHeight = Math.min(
    35 + combatControlsCount * combatItemHeight + 20,
    availableHeight * 0.4
  );

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
      {/* Scrollable Content Container */}
      <ResponsivePixiContainer
        x={0}
        y={0}
        screenWidth={width}
        screenHeight={height - buttonArea}
        data-testid="controls-content"
      >
        {/* Trigram Stances Section */}
        <ResponsivePixiContainer
          x={0}
          y={contentPadding}
          screenWidth={width}
          screenHeight={stanceSectionHeight}
          data-testid="trigram-controls"
        >
          {/* Section Title */}
          <pixiText
            text="팔괘 자세 (Trigram Stances)"
            style={{
              fontSize: isMobile ? 16 : 20,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={contentPadding}
            y={0}
          />

          {/* Stance Controls Grid */}
          <ResponsivePixiContainer
            x={contentPadding}
            y={35}
            screenWidth={width - contentPadding * 2}
            screenHeight={stanceSectionHeight - 35}
            data-testid="stance-controls-grid"
          >
            {Object.entries(COMBAT_CONTROLS.stanceControls).map(
              ([key, value], index) => {
                const buttonWidth = Math.max(
                  isMobile ? 140 : 160,
                  (width -
                    contentPadding * 2 -
                    (buttonsPerRow - 1) * buttonSpacing) /
                    buttonsPerRow
                );
                const xPos =
                  (index % buttonsPerRow) * (buttonWidth + buttonSpacing);
                const yPos =
                  Math.floor(index / buttonsPerRow) *
                  (buttonHeight + buttonSpacing);

                return (
                  <ResponsivePixiContainer
                    key={key}
                    x={xPos}
                    y={yPos}
                    screenWidth={buttonWidth}
                    screenHeight={buttonHeight}
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
                      text={`${key}: ${value.korean}`}
                      style={{
                        fontSize: isMobile ? 9 : 11,
                        fill: KOREAN_COLORS.TEXT_SECONDARY,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={8}
                      y={8}
                      anchor={{ x: 0, y: 0 }}
                    />
                    <pixiText
                      text={`(${value.technique})`}
                      style={{
                        fontSize: isMobile ? 8 : 10,
                        fill: KOREAN_COLORS.ACCENT_CYAN,
                        fontFamily: "Arial, sans-serif",
                        fontStyle: "italic",
                      }}
                      x={8}
                      y={buttonHeight - 8}
                      anchor={{ x: 0, y: 1 }}
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
          y={contentPadding + stanceSectionHeight + sectionSpacing}
          screenWidth={width}
          screenHeight={combatSectionHeight}
          data-testid="combat-controls"
        >
          {/* Section Title */}
          <pixiText
            text="전투 조작 (Combat Controls)"
            style={{
              fontSize: isMobile ? 16 : 20,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={contentPadding}
            y={0}
          />

          {/* Combat Controls List */}
          <ResponsivePixiContainer
            x={contentPadding}
            y={35}
            screenWidth={width - contentPadding * 2}
            screenHeight={combatSectionHeight - 35}
            data-testid="combat-controls-list"
          >
            {Object.entries(COMBAT_CONTROLS.combat).map(
              ([key, description], index) => (
                <ResponsivePixiContainer
                  key={key}
                  x={0}
                  y={index * combatItemHeight}
                  screenWidth={width - contentPadding * 2}
                  screenHeight={combatItemHeight}
                  data-testid={`combat-control-${key}`}
                >
                  <pixiGraphics
                    draw={(g) => {
                      g.clear();
                      g.fill({
                        color: KOREAN_COLORS.UI_BACKGROUND_LIGHT,
                        alpha: 0.6,
                      });
                      g.roundRect(
                        0,
                        0,
                        width - contentPadding * 3,
                        combatItemHeight - 5,
                        4
                      );
                      g.fill();
                      // Add subtle border
                      g.stroke({
                        width: 1,
                        color: KOREAN_COLORS.ACCENT_CYAN,
                        alpha: 0.3,
                      });
                      g.roundRect(
                        0,
                        0,
                        width - contentPadding * 3,
                        combatItemHeight - 5,
                        4
                      );
                      g.stroke();
                    }}
                  />
                  <pixiText
                    text={key}
                    style={{
                      fontSize: isMobile ? 11 : 13,
                      fill: KOREAN_COLORS.ACCENT_GOLD,
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                    }}
                    x={8}
                    y={(combatItemHeight - 5) / 2}
                    anchor={{ x: 0, y: 0.5 }}
                  />
                  <pixiText
                    text={`: ${description}`}
                    style={{
                      fontSize: isMobile ? 10 : 12,
                      fill: KOREAN_COLORS.TEXT_SECONDARY,
                      fontFamily: "Arial, sans-serif",
                    }}
                    x={key.length * (isMobile ? 7 : 8) + 15}
                    y={(combatItemHeight - 5) / 2}
                    anchor={{ x: 0, y: 0.5 }}
                  />
                </ResponsivePixiContainer>
              )
            )}
          </ResponsivePixiContainer>
        </ResponsivePixiContainer>

        {/* Additional Controls Info */}
        <ResponsivePixiContainer
          x={contentPadding}
          y={
            contentPadding +
            stanceSectionHeight +
            sectionSpacing +
            combatSectionHeight +
            10
          }
          screenWidth={width - contentPadding * 2}
          screenHeight={60}
          data-testid="additional-controls"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                alpha: 0.7,
              });
              g.roundRect(0, 0, width - contentPadding * 2, 50, 8);
              g.fill();
              g.stroke({
                width: 2,
                color: KOREAN_COLORS.PRIMARY_CYAN,
                alpha: 0.5,
              });
              g.roundRect(0, 0, width - contentPadding * 2, 50, 8);
              g.stroke();
            }}
          />
          <pixiText
            text="💡 팁: ESC 키로 메뉴로 돌아가기"
            style={{
              fontSize: isMobile ? 12 : 14,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={15}
            y={15}
          />
          <pixiText
            text="Tip: Press ESC to return to menu"
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.ACCENT_CYAN,
              fontFamily: "Arial, sans-serif",
              fontStyle: "italic",
            }}
            x={15}
            y={32}
          />
        </ResponsivePixiContainer>
      </ResponsivePixiContainer>

      {/* Fixed Back Button at Bottom */}
      <ResponsivePixiContainer
        x={0}
        y={height - buttonArea}
        screenWidth={width}
        screenHeight={buttonArea}
        data-testid="controls-footer"
      >
        {/* Footer Background */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            // Gradient background for footer
            const gradient = new PIXI.FillGradient(0, 0, 0, buttonArea);
            gradient.addColorStop(0, 0x1a1a2e);
            gradient.addColorStop(1, 0x0a0a0f);
            g.fill(gradient);
            g.rect(0, 0, width, buttonArea);
            g.fill();

            // Top border line
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.6,
            });
            g.moveTo(0, 0);
            g.lineTo(width, 0);
            g.stroke();
          }}
        />

        {/* Back Button - Centered */}
        <ResponsivePixiContainer
          x={width / 2}
          y={buttonArea / 2}
          screenWidth={140}
          screenHeight={40}
          data-testid="back-button-container"
        >
          <ResponsivePixiButton
            text="돌아가기 (Back)"
            width={140}
            height={40}
            screenWidth={width}
            screenHeight={height}
            variant="secondary"
            onClick={onBack}
            data-testid="controls-back-button"
          />
        </ResponsivePixiContainer>

        {/* Keyboard shortcut hint */}
        <pixiText
          text="ESC"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.SECONDARY_MAGENTA,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
          }}
          x={width - 30}
          y={buttonArea / 2}
          anchor={{ x: 0.5, y: 0.5 }}
        />
      </ResponsivePixiContainer>
    </ResponsivePixiPanel>
  );
};

export default ControlsSection;
