import { COMBAT_CONTROLS } from "@/systems";
import * as PIXI from "pixi.js";
import React, { useEffect } from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import { KoreanText } from "../../ui/base/korean-text/KoreanText";

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

  // Enhanced event handling with better cleanup
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle escape key or 'B' for back
      if (event.key === "Escape" || event.key.toLowerCase() === "b") {
        event.preventDefault();
        event.stopPropagation();
        onBack();
      }
    };

    // Handle mouse events for additional back functionality
    const handleContextMenu = (event: MouseEvent) => {
      // Optional: Right-click to go back
      if (event.button === 2) {
        event.preventDefault();
        onBack();
      }
    };

    // Add event listeners
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    document.addEventListener("contextmenu", handleContextMenu, {
      passive: false,
    });

    // Cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
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
  const buttonsPerRow = isMobile ? 1 : isTablet ? 2 : 2; // Reduced to accommodate more content
  const buttonHeight = isMobile ? 80 : 100; // Increased for more content
  const buttonSpacing = 10;
  const stanceRows = Math.ceil(stanceControlsCount / buttonsPerRow);
  const stanceSectionHeight = Math.min(
    45 + stanceRows * (buttonHeight + buttonSpacing) + 20,
    availableHeight * 0.7
  );

  // Calculate combat section height
  const combatControlsCount = Object.keys(COMBAT_CONTROLS.combat).length;
  const combatItemHeight = isMobile ? 40 : 50; // Increased for KoreanText
  const combatSectionHeight = Math.min(
    45 + combatControlsCount * combatItemHeight + 20,
    availableHeight * 0.3
  );

  return (
    <ResponsivePixiPanel
      title="무술 조작법 (Combat Controls)"
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
          {/* Section Title - Enhanced with Combat Context */}
          <KoreanText
            text={{
              korean: "팔괘 무술 자세 (Eight Trigram Combat Stances)",
              english: "Authentic Korean Martial Arts Fighting Forms",
            }}
            size={isMobile ? "medium" : "large"}
            weight="bold"
            x={contentPadding}
            y={0}
          />

          {/* Combat Philosophy Subtitle */}
          <pixiText
            text="☯ 태극과 팔괘의 무술철학을 바탕으로 한 실전 격투술 ☯"
            style={{
              fontSize: isMobile ? 11 : 13,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontFamily: "Arial, sans-serif",
              fontStyle: "italic",
            }}
            x={contentPadding}
            y={25}
          />

          {/* Stance Controls Grid */}
          <ResponsivePixiContainer
            x={contentPadding}
            y={45}
            screenWidth={width - contentPadding * 2}
            screenHeight={stanceSectionHeight - 45}
            data-testid="stance-controls-grid"
          >
            {Object.entries(COMBAT_CONTROLS.stanceControls).map(
              ([key, value], index) => {
                const buttonWidth = Math.max(
                  isMobile ? 300 : 360,
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
                        // Enhanced background with combat theme
                        g.fill({
                          color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                          alpha: 0.9,
                        });
                        g.roundRect(0, 0, buttonWidth, buttonHeight, 8);
                        g.fill();

                        // Trigram symbol background
                        g.fill({
                          color: KOREAN_COLORS.ACCENT_GOLD,
                          alpha: 0.1,
                        });
                        g.roundRect(buttonWidth - 40, 5, 35, 30, 4);
                        g.fill();

                        // Border with stance-specific color
                        g.stroke({
                          width: 2,
                          color: KOREAN_COLORS.ACCENT_GOLD,
                          alpha: 0.8,
                        });
                        g.roundRect(0, 0, buttonWidth, buttonHeight, 8);
                        g.stroke();
                      }}
                    />

                    {/* Key and Symbol */}
                    <pixiText
                      text={`${key}`}
                      style={{
                        fontSize: isMobile ? 12 : 14,
                        fill: KOREAN_COLORS.ACCENT_GOLD,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={8}
                      y={8}
                    />

                    <pixiText
                      text={value.symbol}
                      style={{
                        fontSize: isMobile ? 16 : 20,
                        fill: KOREAN_COLORS.ACCENT_GOLD,
                        fontFamily: "Arial, sans-serif",
                      }}
                      x={buttonWidth - 25}
                      y={8}
                      anchor={{ x: 0.5, y: 0 }}
                    />

                    {/* Stance Name - Korean/English */}
                    <pixiText
                      text={`${value.korean} (${value.english})`}
                      style={{
                        fontSize: isMobile ? 11 : 13,
                        fill: KOREAN_COLORS.TEXT_PRIMARY,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={35}
                      y={8}
                    />

                    {/* Technique Name */}
                    <pixiText
                      text={value.technique.korean}
                      style={{
                        fontSize: isMobile ? 9 : 11,
                        fill: KOREAN_COLORS.PRIMARY_CYAN,
                        fontFamily: "Arial, sans-serif",
                        fontStyle: "italic",
                      }}
                      x={8}
                      y={26}
                    />

                    <pixiText
                      text={value.technique.english}
                      style={{
                        fontSize: isMobile ? 8 : 10,
                        fill: KOREAN_COLORS.ACCENT_CYAN,
                        fontFamily: "Arial, sans-serif",
                        fontStyle: "italic",
                      }}
                      x={8}
                      y={38}
                    />

                    {/* Combat Focus */}
                    <pixiText
                      text={`⚔️ ${value.combatFocus.korean}`}
                      style={{
                        fontSize: isMobile ? 8 : 9,
                        fill: KOREAN_COLORS.SECONDARY_MAGENTA,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={8}
                      y={52}
                    />

                    {/* Combat Effects */}
                    <pixiText
                      text={`💥 ${value.combatEffects.korean}`}
                      style={{
                        fontSize: isMobile ? 7 : 8,
                        fill: KOREAN_COLORS.NEGATIVE_RED,
                        fontFamily: "Arial, sans-serif",
                      }}
                      x={8}
                      y={buttonHeight - 12}
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
          <KoreanText
            text={{
              korean: "실전 격투 조작 (Combat Actions)",
              english: "Authentic Martial Arts Combat Controls",
            }}
            size={isMobile ? "medium" : "large"}
            weight="bold"
            x={contentPadding}
            y={0}
          />

          {/* Combat Warning */}
          <pixiText
            text="⚠️ 주의: 실제 무술 기법 - 교육 목적으로만 사용하세요"
            style={{
              fontSize: isMobile ? 9 : 11,
              fill: KOREAN_COLORS.NEGATIVE_RED,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={contentPadding}
            y={25}
          />

          {/* Combat Controls List */}
          <ResponsivePixiContainer
            x={contentPadding}
            y={45}
            screenWidth={width - contentPadding * 2}
            screenHeight={combatSectionHeight - 45}
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
                        alpha: 0.8,
                      });
                      g.roundRect(
                        0,
                        0,
                        width - contentPadding * 3,
                        combatItemHeight - 5,
                        6
                      );
                      g.fill();
                      g.stroke({
                        width: 1,
                        color: KOREAN_COLORS.ACCENT_CYAN,
                        alpha: 0.4,
                      });
                      g.roundRect(
                        0,
                        0,
                        width - contentPadding * 3,
                        combatItemHeight - 5,
                        6
                      );
                      g.stroke();
                    }}
                  />

                  {/* Key */}
                  <pixiText
                    text={key}
                    style={{
                      fontSize: isMobile ? 12 : 14,
                      fill: KOREAN_COLORS.ACCENT_GOLD,
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                    }}
                    x={10}
                    y={8}
                  />

                  {/* Korean Description */}
                  <pixiText
                    text={description.korean}
                    style={{
                      fontSize: isMobile ? 10 : 12,
                      fill: KOREAN_COLORS.TEXT_PRIMARY,
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                    }}
                    x={key.length * (isMobile ? 8 : 10) + 20}
                    y={8}
                  />

                  {/* English Description */}
                  <pixiText
                    text={description.english}
                    style={{
                      fontSize: isMobile ? 9 : 10,
                      fill: KOREAN_COLORS.TEXT_SECONDARY,
                      fontFamily: "Arial, sans-serif",
                      fontStyle: "italic",
                    }}
                    x={key.length * (isMobile ? 8 : 10) + 20}
                    y={24}
                  />
                </ResponsivePixiContainer>
              )
            )}
          </ResponsivePixiContainer>
        </ResponsivePixiContainer>

        {/* Enhanced Combat Philosophy Section */}
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
          screenHeight={100}
          data-testid="combat-philosophy"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                alpha: 0.8,
              });
              g.roundRect(0, 0, width - contentPadding * 2, 95, 8);
              g.fill();
              g.stroke({
                width: 2,
                color: KOREAN_COLORS.KOREAN_RED,
                alpha: 0.6,
              });
              g.roundRect(0, 0, width - contentPadding * 2, 95, 8);
              g.stroke();
            }}
          />

          {/* Combat Philosophy Header */}
          <pixiText
            text="🥋 무도철학 (Martial Philosophy)"
            style={{
              fontSize: isMobile ? 12 : 14,
              fill: KOREAN_COLORS.KOREAN_RED,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={15}
            y={10}
          />

          {/* Korean Philosophy */}
          <pixiText
            text="정확한 급소타격으로 적을 무력화하는 한국 전통무술의 정수"
            style={{
              fontSize: isMobile ? 10 : 11,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontFamily: "Arial, sans-serif",
            }}
            x={15}
            y={28}
          />

          {/* English Philosophy */}
          <pixiText
            text="The essence of Korean martial arts - precise vital point strikes to incapacitate enemies"
            style={{
              fontSize: isMobile ? 9 : 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Arial, sans-serif",
              fontStyle: "italic",
            }}
            x={15}
            y={44}
          />

          {/* Navigation Tip */}
          <pixiText
            text="💡 ESC 또는 B키로 메뉴 복귀 | Press ESC or B to return to menu"
            style={{
              fontSize: isMobile ? 9 : 10,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              fontFamily: "Arial, sans-serif",
            }}
            x={15}
            y={62}
          />

          {/* Educational Warning */}
          <pixiText
            text="⚠️ 교육용 시뮬레이션 - 실제 무술 수련은 전문가 지도하에 하세요"
            style={{
              fontSize: isMobile ? 8 : 9,
              fill: KOREAN_COLORS.NEGATIVE_RED,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={15}
            y={78}
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
              color: KOREAN_COLORS.KOREAN_RED,
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
          screenWidth={180}
          screenHeight={45}
          data-testid="back-button-container"
        >
          <ResponsivePixiButton
            text="무도장으로 돌아가기 (Return to Dojang)"
            width={180}
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
            x={width - 60}
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
            x={width - 30}
            y={buttonArea / 2 - 8}
            anchor={{ x: 0.5, y: 0.5 }}
          />
        </pixiContainer>
      </ResponsivePixiContainer>
    </ResponsivePixiPanel>
  );
};

export default ControlsSection;
