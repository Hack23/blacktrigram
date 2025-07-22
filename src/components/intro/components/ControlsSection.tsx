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
      if (event.key === "Escape" || event.key.toLowerCase() === "b") {
        event.preventDefault();
        event.stopPropagation();
        onBack();
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      if (event.button === 2) {
        event.preventDefault();
        onBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    document.addEventListener("contextmenu", handleContextMenu, {
      passive: false,
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [onBack]);

  // Restored better responsive calculations
  const contentPadding = isMobile ? 15 : 25;
  const sectionSpacing = isMobile ? 20 : 30;
  const buttonArea = isMobile ? 70 : 80;
  const headerHeight = isMobile ? 70 : 85;
  const availableHeight = height - buttonArea - headerHeight;

  // Restored better stance grid calculations for 4 columns
  const stanceControlsCount = Object.keys(
    COMBAT_CONTROLS.stanceControls
  ).length;
  const buttonsPerRow = isMobile ? 2 : isTablet ? 4 : 4; // Back to 4 columns
  const buttonHeight = isMobile ? 100 : 110; // Reduced height for better fit
  const buttonSpacing = isMobile ? 10 : 15;
  const stanceRows = Math.ceil(stanceControlsCount / buttonsPerRow);
  const stanceSectionHeight = Math.min(
    50 + stanceRows * (buttonHeight + buttonSpacing) + 20,
    availableHeight * 0.7
  );

  // Combat section calculations
  const combatControlsCount = Object.keys(COMBAT_CONTROLS.combat).length;
  const combatItemHeight = isMobile ? 45 : 50;
  const combatSectionHeight = Math.min(
    50 + combatControlsCount * combatItemHeight + 20,
    availableHeight * 0.3
  );

  return (
    <ResponsivePixiPanel
      title="무술 조작법 | Combat Controls"
      x={x}
      y={y}
      width={width}
      height={height}
      screenWidth={width}
      screenHeight={height}
      data-testid="controls-section"
    >
      {/* Enhanced Header Section */}
      <ResponsivePixiContainer
        x={0}
        y={0}
        screenWidth={width}
        screenHeight={headerHeight}
        data-testid="controls-header"
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            // Enhanced gradient header background
            const gradient = new PIXI.FillGradient(0, 0, 0, headerHeight);
            gradient.addColorStop(0, KOREAN_COLORS.UI_BACKGROUND_DARK);
            gradient.addColorStop(0.7, KOREAN_COLORS.UI_BACKGROUND_MEDIUM);
            gradient.addColorStop(1, KOREAN_COLORS.UI_BACKGROUND_LIGHT);
            g.fill(gradient);
            g.rect(0, 0, width, headerHeight);
            g.fill();

            // Traditional Korean border pattern
            g.stroke({ width: 2, color: KOREAN_COLORS.KOREAN_RED, alpha: 0.8 });
            g.rect(
              contentPadding,
              contentPadding,
              width - contentPadding * 2,
              headerHeight - contentPadding * 2
            );
            g.stroke();

            // Inner accent line
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.6,
            });
            g.rect(
              contentPadding + 3,
              contentPadding + 3,
              width - (contentPadding + 3) * 2,
              headerHeight - (contentPadding + 3) * 2
            );
            g.stroke();
          }}
        />

        {/* Main Title - Bilingual */}
        <KoreanText
          text={{
            korean: "흑괘 무술 제어법",
            english: "Black Trigram Combat Controls",
          }}
          size="large"
          weight="bold"
          x={width / 2}
          y={headerHeight / 2 - 10}
          anchor={{ x: 0.5, y: 0.5 }}
          color={KOREAN_COLORS.ACCENT_GOLD}
        />

        {/* Subtitle - Bilingual */}
        <pixiText
          text="☯ 팔괘 철학과 급소술의 융합 | Eight Trigrams Philosophy & Vital Point Arts ☯"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.PRIMARY_CYAN,
            fontFamily: "Arial, sans-serif",
            fontStyle: "italic",
          }}
          x={width / 2}
          y={headerHeight / 2 + 8}
          anchor={{ x: 0.5, y: 0.5 }}
        />
      </ResponsivePixiContainer>

      {/* Scrollable Content Container */}
      <ResponsivePixiContainer
        x={0}
        y={headerHeight}
        screenWidth={width}
        screenHeight={height - headerHeight - buttonArea}
        data-testid="controls-content"
      >
        {/* Enhanced Trigram Stances Section */}
        <ResponsivePixiContainer
          x={0}
          y={0}
          screenWidth={width}
          screenHeight={stanceSectionHeight}
          data-testid="trigram-controls"
        >
          {/* Section Background */}
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.3 });
              g.roundRect(
                contentPadding / 2,
                0,
                width - contentPadding,
                stanceSectionHeight,
                10
              );
              g.fill();

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.4,
              });
              g.roundRect(
                contentPadding / 2,
                0,
                width - contentPadding,
                stanceSectionHeight,
                10
              );
              g.stroke();
            }}
          />

          {/* Section Title - Bilingual */}
          <KoreanText
            text={{
              korean: "팔괘 무술 자세",
              english: "Eight Trigram Combat Stances",
            }}
            size="medium"
            weight="bold"
            x={contentPadding}
            y={12}
            color={KOREAN_COLORS.ACCENT_GOLD}
          />

          {/* Philosophy Subtitle - Bilingual */}
          <pixiText
            text="🗡️ 전통 한국 무예의 8가지 핵심 자세 | 8 Core Stances of Traditional Korean Martial Arts 🗡️"
            style={{
              fontSize: isMobile ? 9 : 11,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              fontFamily: "Arial, sans-serif",
              fontStyle: "italic",
            }}
            x={contentPadding}
            y={32}
          />

          {/* Enhanced Stance Controls Grid - Restored 4 Column Layout */}
          <ResponsivePixiContainer
            x={contentPadding}
            y={50}
            screenWidth={width - contentPadding * 2}
            screenHeight={stanceSectionHeight - 50}
            data-testid="stance-controls-grid"
          >
            {Object.entries(COMBAT_CONTROLS.stanceControls).map(
              ([key, value], index) => {
                const buttonWidth = Math.max(
                  isMobile ? 170 : 180,
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
                    {/* Enhanced Card Background */}
                    <pixiGraphics
                      draw={(g) => {
                        g.clear();

                        // Main card background with gradient
                        const gradient = new PIXI.FillGradient(
                          0,
                          0,
                          0,
                          buttonHeight
                        );
                        gradient.addColorStop(
                          0,
                          KOREAN_COLORS.UI_BACKGROUND_MEDIUM
                        );
                        gradient.addColorStop(
                          0.6,
                          KOREAN_COLORS.UI_BACKGROUND_LIGHT
                        );
                        gradient.addColorStop(
                          1,
                          KOREAN_COLORS.UI_BACKGROUND_MEDIUM
                        );
                        g.fill(gradient);
                        g.roundRect(0, 0, buttonWidth, buttonHeight, 8);
                        g.fill();

                        // Trigram symbol background panel
                        g.fill({
                          color: KOREAN_COLORS.ACCENT_GOLD,
                          alpha: 0.15,
                        });
                        g.roundRect(buttonWidth - 35, 5, 30, 25, 4);
                        g.fill();

                        // Combat effectiveness indicator
                        g.fill({ color: KOREAN_COLORS.KOREAN_RED, alpha: 0.1 });
                        g.roundRect(
                          5,
                          buttonHeight - 20,
                          buttonWidth - 10,
                          15,
                          3
                        );
                        g.fill();

                        // Enhanced border with stance-specific styling
                        g.stroke({
                          width: 1.5,
                          color: KOREAN_COLORS.ACCENT_GOLD,
                          alpha: 0.9,
                        });
                        g.roundRect(0, 0, buttonWidth, buttonHeight, 8);
                        g.stroke();

                        // Inner accent line
                        g.stroke({
                          width: 1,
                          color: KOREAN_COLORS.PRIMARY_CYAN,
                          alpha: 0.4,
                        });
                        g.roundRect(1, 1, buttonWidth - 2, buttonHeight - 2, 7);
                        g.stroke();
                      }}
                    />

                    {/* Key Badge */}
                    <pixiGraphics
                      draw={(g) => {
                        g.clear();
                        g.fill({
                          color: KOREAN_COLORS.ACCENT_GOLD,
                          alpha: 0.9,
                        });
                        g.roundRect(5, 5, 20, 20, 4);
                        g.fill();
                        g.stroke({
                          width: 1,
                          color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                        });
                        g.roundRect(5, 5, 20, 20, 4);
                        g.stroke();
                      }}
                    />

                    <pixiText
                      text={key}
                      style={{
                        fontSize: isMobile ? 12 : 14,
                        fill: KOREAN_COLORS.UI_BACKGROUND_DARK,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={15}
                      y={15}
                      anchor={{ x: 0.5, y: 0.5 }}
                    />

                    {/* Trigram Symbol - Enhanced */}
                    <pixiText
                      text={value.symbol}
                      style={{
                        fontSize: isMobile ? 16 : 18,
                        fill: KOREAN_COLORS.ACCENT_GOLD,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={buttonWidth - 20}
                      y={17}
                      anchor={{ x: 0.5, y: 0.5 }}
                    />

                    {/* Stance Name - Bilingual Layout */}
                    <pixiText
                      text={value.korean}
                      style={{
                        fontSize: isMobile ? 11 : 13,
                        fill: KOREAN_COLORS.TEXT_PRIMARY,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={30}
                      y={8}
                    />

                    <pixiText
                      text={value.english}
                      style={{
                        fontSize: isMobile ? 8 : 9,
                        fill: KOREAN_COLORS.TEXT_SECONDARY,
                        fontFamily: "Arial, sans-serif",
                        fontStyle: "italic",
                      }}
                      x={30}
                      y={22}
                    />

                    {/* Technique Details - Bilingual */}
                    <pixiText
                      text={`🥋 ${value.technique.korean}`}
                      style={{
                        fontSize: isMobile ? 8 : 9,
                        fill: KOREAN_COLORS.PRIMARY_CYAN,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={8}
                      y={35}
                    />

                    <pixiText
                      text={value.technique.english}
                      style={{
                        fontSize: isMobile ? 7 : 8,
                        fill: KOREAN_COLORS.ACCENT_CYAN,
                        fontFamily: "Arial, sans-serif",
                        fontStyle: "italic",
                      }}
                      x={8}
                      y={47}
                    />

                    {/* Combat Focus - Bilingual */}
                    <pixiText
                      text={`⚔️ ${value.combatFocus.korean}`}
                      style={{
                        fontSize: isMobile ? 7 : 8,
                        fill: KOREAN_COLORS.SECONDARY_MAGENTA,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={8}
                      y={59}
                    />

                    <pixiText
                      text={value.combatFocus.english}
                      style={{
                        fontSize: isMobile ? 6 : 7,
                        fill: KOREAN_COLORS.SECONDARY_MAGENTA,
                        fontFamily: "Arial, sans-serif",
                        fontStyle: "italic",
                      }}
                      x={8}
                      y={69}
                    />

                    {/* Combat Effects - Bottom Bar - Bilingual */}
                    <pixiText
                      text={`💥 ${value.combatEffects.korean}`}
                      style={{
                        fontSize: isMobile ? 6 : 7,
                        fill: KOREAN_COLORS.NEGATIVE_RED,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={8}
                      y={buttonHeight - 13}
                    />

                    {/* Effectiveness Indicator - Bilingual */}
                    <pixiText
                      text="급소술"
                      style={{
                        fontSize: isMobile ? 6 : 7,
                        fill: KOREAN_COLORS.KOREAN_RED,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={buttonWidth - 8}
                      y={buttonHeight - 8}
                      anchor={{ x: 1, y: 1 }}
                    />
                  </ResponsivePixiContainer>
                );
              }
            )}
          </ResponsivePixiContainer>
        </ResponsivePixiContainer>

        {/* Enhanced Combat Controls Section */}
        <ResponsivePixiContainer
          x={0}
          y={stanceSectionHeight + sectionSpacing}
          screenWidth={width}
          screenHeight={combatSectionHeight}
          data-testid="combat-controls"
        >
          {/* Section Background */}
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.3 });
              g.roundRect(
                contentPadding / 2,
                0,
                width - contentPadding,
                combatSectionHeight,
                10
              );
              g.fill();

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.PRIMARY_CYAN,
                alpha: 0.4,
              });
              g.roundRect(
                contentPadding / 2,
                0,
                width - contentPadding,
                combatSectionHeight,
                10
              );
              g.stroke();
            }}
          />

          {/* Section Title - Bilingual */}
          <KoreanText
            text={{
              korean: "실전 격투 조작",
              english: "Combat Actions",
            }}
            size="medium"
            weight="bold"
            x={contentPadding}
            y={12}
            color={KOREAN_COLORS.PRIMARY_CYAN}
          />

          {/* Enhanced Combat Warning - Bilingual */}
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.NEGATIVE_RED, alpha: 0.1 });
              g.roundRect(
                contentPadding,
                30,
                width - contentPadding * 2,
                20,
                5
              );
              g.fill();
              g.stroke({
                width: 1,
                color: KOREAN_COLORS.NEGATIVE_RED,
                alpha: 0.5,
              });
              g.roundRect(
                contentPadding,
                30,
                width - contentPadding * 2,
                20,
                5
              );
              g.stroke();
            }}
          />

          <pixiText
            text="⚠️ 교육용 무술 시뮬레이션 | Educational Martial Arts Simulation - 실제 급소 공격은 위험합니다 | Real vital point attacks are dangerous"
            style={{
              fontSize: isMobile ? 8 : 9,
              fill: KOREAN_COLORS.NEGATIVE_RED,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={contentPadding + 8}
            y={36}
          />

          {/* Enhanced Combat Controls List - Bilingual */}
          <ResponsivePixiContainer
            x={contentPadding}
            y={55}
            screenWidth={width - contentPadding * 2}
            screenHeight={combatSectionHeight - 55}
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
                  {/* Enhanced Item Background */}
                  <pixiGraphics
                    draw={(g) => {
                      g.clear();

                      // Gradient background
                      const gradient = new PIXI.FillGradient(
                        0,
                        0,
                        0,
                        combatItemHeight - 6
                      );
                      gradient.addColorStop(
                        0,
                        KOREAN_COLORS.UI_BACKGROUND_LIGHT
                      );
                      gradient.addColorStop(
                        0.5,
                        KOREAN_COLORS.UI_BACKGROUND_MEDIUM
                      );
                      gradient.addColorStop(
                        1,
                        KOREAN_COLORS.UI_BACKGROUND_LIGHT
                      );
                      g.fill(gradient);
                      g.roundRect(
                        0,
                        0,
                        width - contentPadding * 3,
                        combatItemHeight - 6,
                        6
                      );
                      g.fill();

                      // Key highlight area
                      g.fill({ color: KOREAN_COLORS.ACCENT_CYAN, alpha: 0.15 });
                      g.roundRect(
                        6,
                        6,
                        key.length * (isMobile ? 8 : 10) + 12,
                        combatItemHeight - 18,
                        4
                      );
                      g.fill();

                      // Border
                      g.stroke({
                        width: 1,
                        color: KOREAN_COLORS.ACCENT_CYAN,
                        alpha: 0.6,
                      });
                      g.roundRect(
                        0,
                        0,
                        width - contentPadding * 3,
                        combatItemHeight - 6,
                        6
                      );
                      g.stroke();
                    }}
                  />

                  {/* Key Badge */}
                  <pixiText
                    text={key}
                    style={{
                      fontSize: isMobile ? 12 : 14,
                      fill: KOREAN_COLORS.ACCENT_GOLD,
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                    }}
                    x={12}
                    y={8}
                  />

                  {/* Korean Description */}
                  <pixiText
                    text={description.korean}
                    style={{
                      fontSize: isMobile ? 9 : 11,
                      fill: KOREAN_COLORS.TEXT_PRIMARY,
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                    }}
                    x={key.length * (isMobile ? 8 : 10) + 25}
                    y={8}
                  />

                  {/* English Description */}
                  <pixiText
                    text={description.english}
                    style={{
                      fontSize: isMobile ? 7 : 9,
                      fill: KOREAN_COLORS.TEXT_SECONDARY,
                      fontFamily: "Arial, sans-serif",
                      fontStyle: "italic",
                    }}
                    x={key.length * (isMobile ? 8 : 10) + 25}
                    y={24}
                  />
                </ResponsivePixiContainer>
              )
            )}
          </ResponsivePixiContainer>
        </ResponsivePixiContainer>
      </ResponsivePixiContainer>

      {/* Enhanced Footer with Navigation - Bilingual */}
      <ResponsivePixiContainer
        x={0}
        y={height - buttonArea}
        screenWidth={width}
        screenHeight={buttonArea}
        data-testid="controls-footer"
      >
        {/* Enhanced Footer Background */}
        <pixiGraphics
          draw={(g) => {
            g.clear();

            // Gradient footer background
            const gradient = new PIXI.FillGradient(0, 0, 0, buttonArea);
            gradient.addColorStop(0, KOREAN_COLORS.UI_BACKGROUND_DARK);
            gradient.addColorStop(0.3, KOREAN_COLORS.UI_BACKGROUND_MEDIUM);
            gradient.addColorStop(1, KOREAN_COLORS.UI_BACKGROUND_DARK);
            g.fill(gradient);
            g.rect(0, 0, width, buttonArea);
            g.fill();

            // Traditional border pattern
            g.stroke({ width: 2, color: KOREAN_COLORS.KOREAN_RED, alpha: 0.8 });
            g.moveTo(0, 0);
            g.lineTo(width, 0);
            g.stroke();

            // Accent line
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.6,
            });
            g.moveTo(contentPadding, 2);
            g.lineTo(width - contentPadding, 2);
            g.stroke();
          }}
        />

        {/* Enhanced Back Button - Bilingual */}
        <ResponsivePixiContainer
          x={width / 2}
          y={buttonArea / 2}
          screenWidth={200}
          screenHeight={40}
          data-testid="back-button-container"
        >
          <ResponsivePixiButton
            text="무도장 복귀 | Return to Dojang"
            width={200}
            height={40}
            screenWidth={width}
            screenHeight={height}
            variant="secondary"
            onClick={onBack}
            data-testid="controls-back-button"
          />
        </ResponsivePixiContainer>

        {/* Enhanced Keyboard Shortcuts - Bilingual */}
        <ResponsivePixiContainer
          x={width - 90}
          y={buttonArea / 2 - 12}
          screenWidth={80}
          screenHeight={24}
          data-testid="keyboard-shortcuts"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.8 });
              g.roundRect(0, 0, 80, 24, 4);
              g.fill();
              g.stroke({
                width: 1,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.5,
              });
              g.roundRect(0, 0, 80, 24, 4);
              g.stroke();
            }}
          />

          <pixiText
            text="ESC | B"
            style={{
              fontSize: isMobile ? 9 : 10,
              fill: KOREAN_COLORS.SECONDARY_MAGENTA,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={40}
            y={12}
            anchor={{ x: 0.5, y: 0.5 }}
          />
        </ResponsivePixiContainer>

        {/* Philosophy Footer Text - Bilingual */}
        <pixiText
          text="🥋 흑괘의 길을 걸어라 | Walk the Path of the Black Trigram 🥋"
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontFamily: "Arial, sans-serif",
            fontStyle: "italic",
          }}
          x={contentPadding}
          y={buttonArea - 8}
        />
      </ResponsivePixiContainer>
    </ResponsivePixiPanel>
  );
};

export default ControlsSection;
