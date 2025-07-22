import { COMBAT_CONTROLS } from "@/systems";
import * as PIXI from "pixi.js";
import React, { useEffect } from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import { KoreanText } from "../../ui/base/korean-text/KoreanText";
import {
  ResponsivePixiButton,
  ResponsivePixiContainer,
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

  // Improved responsive calculations for full screen
  const contentPadding = isMobile ? 20 : 30;
  const sectionSpacing = isMobile ? 15 : 20;
  const buttonArea = isMobile ? 80 : 90;
  const headerHeight = isMobile ? 100 : 120;
  const availableHeight = height - buttonArea - headerHeight - contentPadding;

  // Better stance grid calculations
  const stanceControlsCount = Object.keys(
    COMBAT_CONTROLS.stanceControls
  ).length;
  const buttonsPerRow = isMobile ? 2 : isTablet ? 3 : 4;
  const buttonWidth = Math.max(
    isMobile ? 160 : 180,
    (width - contentPadding * 2 - (buttonsPerRow - 1) * 15) / buttonsPerRow
  );
  const buttonHeight = isMobile ? 120 : 140;
  const buttonSpacing = 15;
  const stanceRows = Math.ceil(stanceControlsCount / buttonsPerRow);
  const stanceSectionHeight = Math.min(
    60 + stanceRows * (buttonHeight + buttonSpacing),
    availableHeight * 0.65
  );

  // Combat section calculations
  const combatControlsCount = Object.keys(COMBAT_CONTROLS.combat).length;
  const combatItemHeight = isMobile ? 50 : 55;
  const combatSectionHeight = Math.min(
    60 + combatControlsCount * combatItemHeight,
    availableHeight * 0.35
  );

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={width}
      screenHeight={height}
      data-testid="controls-section"
    >
      {/* Full Screen Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          // Dark cyberpunk background
          const gradient = new PIXI.FillGradient(0, 0, width, height);
          gradient.addColorStop(0, 0x0a0a0f);
          gradient.addColorStop(0.5, 0x1a1a2e);
          gradient.addColorStop(1, 0x0f0f23);
          g.fill(gradient);
          g.rect(0, 0, width, height);
          g.fill();

          // Grid overlay
          g.stroke({ width: 1, color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.1 });
          const gridSize = isMobile ? 50 : 80;
          for (let i = 0; i < width; i += gridSize) {
            g.moveTo(i, 0);
            g.lineTo(i, height);
          }
          for (let i = 0; i < height; i += gridSize) {
            g.moveTo(0, i);
            g.lineTo(width, i);
          }
          g.stroke();
        }}
      />

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
            // Header background with gradient
            const gradient = new PIXI.FillGradient(0, 0, 0, headerHeight);
            gradient.addColorStop(0, KOREAN_COLORS.UI_BACKGROUND_DARK);
            gradient.addColorStop(0.7, KOREAN_COLORS.UI_BACKGROUND_MEDIUM);
            gradient.addColorStop(1, KOREAN_COLORS.UI_BACKGROUND_LIGHT);
            g.fill(gradient);
            g.rect(
              contentPadding,
              contentPadding,
              width - contentPadding * 2,
              headerHeight - contentPadding * 2
            );
            g.fill();

            // Border
            g.stroke({ width: 3, color: KOREAN_COLORS.KOREAN_RED, alpha: 0.8 });
            g.rect(
              contentPadding,
              contentPadding,
              width - contentPadding * 2,
              headerHeight - contentPadding * 2
            );
            g.stroke();

            // Inner accent
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.6,
            });
            g.rect(
              contentPadding + 5,
              contentPadding + 5,
              width - (contentPadding + 5) * 2,
              headerHeight - (contentPadding + 5) * 2
            );
            g.stroke();
          }}
        />

        {/* Main Title */}
        <KoreanText
          text={{
            korean: "흑괘 무술 제어법",
            english: "Black Trigram Combat Controls",
          }}
          size="large"
          weight="bold"
          x={width / 2}
          y={headerHeight / 2 - 15}
          anchor={{ x: 0.5, y: 0.5 }}
          color={KOREAN_COLORS.ACCENT_GOLD}
        />

        {/* Subtitle */}
        <pixiText
          text="☯ 팔괘 철학과 급소술의 융합 | Eight Trigrams Philosophy & Vital Point Arts ☯"
          style={{
            fontSize: isMobile ? 12 : 16,
            fill: KOREAN_COLORS.PRIMARY_CYAN,
            fontFamily: "Arial, sans-serif",
            fontStyle: "italic",
            align: "center",
          }}
          x={width / 2}
          y={headerHeight / 2 + 15}
          anchor={{ x: 0.5, y: 0.5 }}
        />
      </ResponsivePixiContainer>

      {/* Scrollable Content Container */}
      <ResponsivePixiContainer
        x={0}
        y={headerHeight}
        screenWidth={width}
        screenHeight={availableHeight}
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
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.4 });
              g.roundRect(
                contentPadding,
                0,
                width - contentPadding * 2,
                stanceSectionHeight,
                12
              );
              g.fill();

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.5,
              });
              g.roundRect(
                contentPadding,
                0,
                width - contentPadding * 2,
                stanceSectionHeight,
                12
              );
              g.stroke();
            }}
          />

          {/* Section Title */}
          <KoreanText
            text={{
              korean: "팔괘 무술 자세",
              english: "Eight Trigram Combat Stances",
            }}
            size="medium"
            weight="bold"
            x={contentPadding + 20}
            y={20}
            color={KOREAN_COLORS.ACCENT_GOLD}
          />

          {/* Philosophy Subtitle */}
          <pixiText
            text="🗡️ 전통 한국 무예의 8가지 핵심 자세 | 8 Core Stances of Traditional Korean Martial Arts 🗡️"
            style={{
              fontSize: isMobile ? 11 : 14,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              fontFamily: "Arial, sans-serif",
              fontStyle: "italic",
            }}
            x={contentPadding + 20}
            y={45}
          />

          {/* Enhanced Stance Controls Grid */}
          <ResponsivePixiContainer
            x={contentPadding + 20}
            y={70}
            screenWidth={width - (contentPadding + 20) * 2}
            screenHeight={stanceSectionHeight - 70}
            data-testid="stance-controls-grid"
          >
            {Object.entries(COMBAT_CONTROLS.stanceControls).map(
              ([key, value], index) => {
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
                        g.roundRect(0, 0, buttonWidth, buttonHeight, 10);
                        g.fill();

                        // Trigram symbol background panel
                        g.fill({
                          color: KOREAN_COLORS.ACCENT_GOLD,
                          alpha: 0.2,
                        });
                        g.roundRect(buttonWidth - 40, 8, 35, 30, 6);
                        g.fill();

                        // Enhanced border
                        g.stroke({
                          width: 2,
                          color: KOREAN_COLORS.ACCENT_GOLD,
                          alpha: 0.9,
                        });
                        g.roundRect(0, 0, buttonWidth, buttonHeight, 10);
                        g.stroke();

                        // Inner accent line
                        g.stroke({
                          width: 1,
                          color: KOREAN_COLORS.PRIMARY_CYAN,
                          alpha: 0.5,
                        });
                        g.roundRect(2, 2, buttonWidth - 4, buttonHeight - 4, 8);
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
                        g.roundRect(8, 8, 25, 25, 6);
                        g.fill();
                        g.stroke({
                          width: 1,
                          color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                        });
                        g.roundRect(8, 8, 25, 25, 6);
                        g.stroke();
                      }}
                    />

                    <pixiText
                      text={key}
                      style={{
                        fontSize: isMobile ? 14 : 16,
                        fill: KOREAN_COLORS.UI_BACKGROUND_DARK,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={20}
                      y={20}
                      anchor={{ x: 0.5, y: 0.5 }}
                    />

                    {/* Trigram Symbol - Enhanced */}
                    <pixiText
                      text={value.symbol}
                      style={{
                        fontSize: isMobile ? 18 : 22,
                        fill: KOREAN_COLORS.ACCENT_GOLD,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={buttonWidth - 22}
                      y={23}
                      anchor={{ x: 0.5, y: 0.5 }}
                    />

                    {/* Stance Name - Bilingual Layout */}
                    <pixiText
                      text={value.korean}
                      style={{
                        fontSize: isMobile ? 12 : 14,
                        fill: KOREAN_COLORS.TEXT_PRIMARY,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={40}
                      y={12}
                    />

                    <pixiText
                      text={value.english}
                      style={{
                        fontSize: isMobile ? 9 : 10,
                        fill: KOREAN_COLORS.TEXT_SECONDARY,
                        fontFamily: "Arial, sans-serif",
                        fontStyle: "italic",
                      }}
                      x={40}
                      y={28}
                    />

                    {/* Technique Details */}
                    <pixiText
                      text={`🥋 ${value.technique.korean}`}
                      style={{
                        fontSize: isMobile ? 9 : 10,
                        fill: KOREAN_COLORS.PRIMARY_CYAN,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={8}
                      y={45}
                    />

                    <pixiText
                      text={value.technique.english}
                      style={{
                        fontSize: isMobile ? 8 : 9,
                        fill: KOREAN_COLORS.ACCENT_CYAN,
                        fontFamily: "Arial, sans-serif",
                        fontStyle: "italic",
                      }}
                      x={8}
                      y={58}
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
                      y={72}
                    />

                    <pixiText
                      text={value.combatFocus.english}
                      style={{
                        fontSize: isMobile ? 7 : 8,
                        fill: KOREAN_COLORS.SECONDARY_MAGENTA,
                        fontFamily: "Arial, sans-serif",
                        fontStyle: "italic",
                      }}
                      x={8}
                      y={84}
                    />

                    {/* Combat Effects - Bottom Bar */}
                    <pixiText
                      text={`💥 ${value.combatEffects.korean}`}
                      style={{
                        fontSize: isMobile ? 7 : 8,
                        fill: KOREAN_COLORS.NEGATIVE_RED,
                        fontFamily: "Arial, sans-serif",
                        fontWeight: "bold",
                      }}
                      x={8}
                      y={buttonHeight - 20}
                    />

                    {/* Effectiveness Indicator */}
                    <pixiText
                      text="급소술"
                      style={{
                        fontSize: isMobile ? 7 : 8,
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
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.4 });
              g.roundRect(
                contentPadding,
                0,
                width - contentPadding * 2,
                combatSectionHeight,
                12
              );
              g.fill();

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.PRIMARY_CYAN,
                alpha: 0.5,
              });
              g.roundRect(
                contentPadding,
                0,
                width - contentPadding * 2,
                combatSectionHeight,
                12
              );
              g.stroke();
            }}
          />

          {/* Section Title */}
          <KoreanText
            text={{
              korean: "실전 격투 조작",
              english: "Combat Actions",
            }}
            size="medium"
            weight="bold"
            x={contentPadding + 20}
            y={20}
            color={KOREAN_COLORS.PRIMARY_CYAN}
          />

          {/* Enhanced Combat Controls List */}
          <ResponsivePixiContainer
            x={contentPadding + 20}
            y={50}
            screenWidth={width - (contentPadding + 20) * 2}
            screenHeight={combatSectionHeight - 50}
            data-testid="combat-controls-list"
          >
            {Object.entries(COMBAT_CONTROLS.combat).map(
              ([key, description], index) => (
                <ResponsivePixiContainer
                  key={key}
                  x={0}
                  y={index * combatItemHeight}
                  screenWidth={width - (contentPadding + 20) * 2}
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
                        combatItemHeight - 8
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
                        width - (contentPadding + 20) * 2 - 20,
                        combatItemHeight - 8,
                        8
                      );
                      g.fill();

                      // Key highlight area
                      g.fill({ color: KOREAN_COLORS.ACCENT_CYAN, alpha: 0.2 });
                      g.roundRect(
                        8,
                        8,
                        key.length * (isMobile ? 10 : 12) + 16,
                        combatItemHeight - 24,
                        6
                      );
                      g.fill();

                      // Border
                      g.stroke({
                        width: 1,
                        color: KOREAN_COLORS.ACCENT_CYAN,
                        alpha: 0.7,
                      });
                      g.roundRect(
                        0,
                        0,
                        width - (contentPadding + 20) * 2 - 20,
                        combatItemHeight - 8,
                        8
                      );
                      g.stroke();
                    }}
                  />

                  {/* Key Badge */}
                  <pixiText
                    text={key}
                    style={{
                      fontSize: isMobile ? 14 : 16,
                      fill: KOREAN_COLORS.ACCENT_GOLD,
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                    }}
                    x={16}
                    y={12}
                  />

                  {/* Korean Description */}
                  <pixiText
                    text={description.korean}
                    style={{
                      fontSize: isMobile ? 11 : 13,
                      fill: KOREAN_COLORS.TEXT_PRIMARY,
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                    }}
                    x={key.length * (isMobile ? 10 : 12) + 35}
                    y={12}
                  />

                  {/* English Description */}
                  <pixiText
                    text={description.english}
                    style={{
                      fontSize: isMobile ? 9 : 11,
                      fill: KOREAN_COLORS.TEXT_SECONDARY,
                      fontFamily: "Arial, sans-serif",
                      fontStyle: "italic",
                    }}
                    x={key.length * (isMobile ? 10 : 12) + 35}
                    y={30}
                  />
                </ResponsivePixiContainer>
              )
            )}
          </ResponsivePixiContainer>
        </ResponsivePixiContainer>
      </ResponsivePixiContainer>

      {/* Enhanced Footer with Navigation */}
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
            g.stroke({ width: 3, color: KOREAN_COLORS.KOREAN_RED, alpha: 0.8 });
            g.moveTo(0, 0);
            g.lineTo(width, 0);
            g.stroke();

            // Accent line
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.6,
            });
            g.moveTo(contentPadding, 3);
            g.lineTo(width - contentPadding, 3);
            g.stroke();
          }}
        />

        {/* Enhanced Back Button */}
        <ResponsivePixiButton
          text="무도장 복귀 | Return to Dojang"
          x={width / 2 - 120}
          y={buttonArea / 2 - 20}
          width={240}
          height={40}
          screenWidth={width}
          screenHeight={height}
          variant="secondary"
          onClick={onBack}
          data-testid="controls-back-button"
        />

        {/* Enhanced Keyboard Shortcuts */}
        <ResponsivePixiContainer
          x={width - 100}
          y={buttonArea / 2 - 15}
          screenWidth={90}
          screenHeight={30}
          data-testid="keyboard-shortcuts"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.9 });
              g.roundRect(0, 0, 90, 30, 6);
              g.fill();
              g.stroke({
                width: 1,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.6,
              });
              g.roundRect(0, 0, 90, 30, 6);
              g.stroke();
            }}
          />

          <pixiText
            text="ESC | B"
            style={{
              fontSize: isMobile ? 11 : 12,
              fill: KOREAN_COLORS.SECONDARY_MAGENTA,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={45}
            y={15}
            anchor={{ x: 0.5, y: 0.5 }}
          />
        </ResponsivePixiContainer>

        {/* Philosophy Footer Text */}
        <pixiText
          text="🥋 흑괘의 길을 걸어라 | Walk the Path of the Black Trigram 🥋"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontFamily: "Arial, sans-serif",
            fontStyle: "italic",
          }}
          x={contentPadding}
          y={buttonArea - 12}
        />
      </ResponsivePixiContainer>
    </ResponsivePixiContainer>
  );
};

export default ControlsSection;
