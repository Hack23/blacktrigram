import { COMBAT_CONTROLS } from "@/systems";
import * as PIXI from "pixi.js";
import React, { useEffect } from "react";
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
  // Consistent mobile detection
  const isMobile = PIXI.isMobile.phone;
  const isTablet = PIXI.isMobile.tablet;

  // Enhanced escape key handling for this component
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle escape key or 'B' for back
      if (event.key === "Escape" || event.key.toLowerCase() === "b") {
        event.preventDefault();
        onBack();
      }
    };

    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onBack]);

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
          {/* Section Title - Enhanced Bilingual */}
          <pixiText
            text="팔괘 자세 (Trigram Stances) - 八卦姿勢"
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
                    {/* Enhanced bilingual display */}
                    <pixiText
                      text={`${key}: ${value.korean}`}
                      style={{
                        fontSize: isMobile ? 9 : 11,
                        fill: KOREAN_COLORS.TEXT_SECONDARY,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={8}
                      y={6}
                      anchor={{ x: 0, y: 0 }}
                    />
                    <pixiText
                      text={`${value.technique}`}
                      style={{
                        fontSize: isMobile ? 8 : 10,
                        fill: KOREAN_COLORS.ACCENT_CYAN,
                        fontFamily: "Arial, sans-serif",
                        fontStyle: "italic",
                      }}
                      x={8}
                      y={buttonHeight - 10}
                      anchor={{ x: 0, y: 0 }}
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
          {/* Section Title - Enhanced Bilingual */}
          <pixiText
            text="전투 조작 (Combat Controls) - 戰鬥操作"
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

        {/* Enhanced Navigation Info Section */}
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
          screenHeight={80}
          data-testid="navigation-info"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                alpha: 0.7,
              });
              g.roundRect(0, 0, width - contentPadding * 2, 75, 8);
              g.fill();
              g.stroke({
                width: 2,
                color: KOREAN_COLORS.PRIMARY_CYAN,
                alpha: 0.5,
              });
              g.roundRect(0, 0, width - contentPadding * 2, 75, 8);
              g.stroke();
            }}
          />

          {/* Korean Navigation Tip */}
          <pixiText
            text="💡 탐색 팁: ESC 또는 B 키로 메뉴로 돌아가기"
            style={{
              fontSize: isMobile ? 11 : 13,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={15}
            y={12}
          />

          {/* English Navigation Tip */}
          <pixiText
            text="Navigation Tip: Press ESC or B to return to menu"
            style={{
              fontSize: isMobile ? 10 : 11,
              fill: KOREAN_COLORS.ACCENT_CYAN,
              fontFamily: "Arial, sans-serif",
              fontStyle: "italic",
            }}
            x={15}
            y={30}
          />

          {/* Additional Control Hint */}
          <pixiText
            text="추가 정보: 돌아가기 버튼을 클릭하거나 키보드 단축키 사용"
            style={{
              fontSize: isMobile ? 9 : 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Arial, sans-serif",
            }}
            x={15}
            y={48}
          />

          <pixiText
            text="Additional: Click Back button or use keyboard shortcuts"
            style={{
              fontSize: isMobile ? 8 : 9,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Arial, sans-serif",
              fontStyle: "italic",
            }}
            x={15}
            y={62}
          />
        </ResponsivePixiContainer>
      </ResponsivePixiContainer>

      {/* Enhanced Fixed Back Button at Bottom */}
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
            // Enhanced gradient background for footer
            const gradient = new PIXI.FillGradient(0, 0, 0, buttonArea);
            gradient.addColorStop(0, 0x1a1a2e);
            gradient.addColorStop(0.5, 0x16213e);
            gradient.addColorStop(1, 0x0a0a0f);
            g.fill(gradient);
            g.rect(0, 0, width, buttonArea);
            g.fill();

            // Enhanced top border line
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.8,
            });
            g.moveTo(0, 0);
            g.lineTo(width, 0);
            g.stroke();
          }}
        />

        {/* Back Button - Centered with better styling */}
        <ResponsivePixiContainer
          x={width / 2}
          y={buttonArea / 2}
          screenWidth={160}
          screenHeight={45}
          data-testid="back-button-container"
        >
          <ResponsivePixiButton
            text="돌아가기 (Back)"
            width={160}
            height={45}
            screenWidth={width}
            screenHeight={height}
            variant="secondary"
            onClick={onBack}
            data-testid="controls-back-button"
          />
        </ResponsivePixiContainer>

        {/* Enhanced Keyboard shortcut hints */}
        <pixiContainer>
          <pixiText
            text="ESC"
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.SECONDARY_MAGENTA,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={width - 50}
            y={buttonArea / 2 - 8}
            anchor={{ x: 0.5, y: 0.5 }}
          />
          <pixiText
            text="B"
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.SECONDARY_MAGENTA,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={width - 25}
            y={buttonArea / 2 - 8}
            anchor={{ x: 0.5, y: 0.5 }}
          />
        </pixiContainer>
      </ResponsivePixiContainer>
    </ResponsivePixiPanel>
  );
};

export default ControlsSection;
