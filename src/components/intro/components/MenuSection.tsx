import React, { useCallback } from "react";
import { GameMode } from "../../../types/enums";
import { KOREAN_COLORS } from "../../../types/constants";

export interface MenuSectionProps {
  readonly selectedMode: GameMode;
  readonly onModeSelect: (mode: GameMode) => void;
  readonly onStartGame: () => void;
  readonly onShowPhilosophy: () => void;
  readonly onShowControls: () => void;
  readonly width: number;
  readonly height: number;
  readonly x: number;
  readonly y: number;
  readonly menuItems: readonly {
    mode: GameMode;
    korean: string;
    english: string;
  }[];
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  selectedMode,
  onModeSelect,
  onStartGame,
  onShowPhilosophy,
  onShowControls,
  width,
  height,
  x,
  y,
  menuItems,
}) => {
  const handleArchetypeToggle = useCallback(() => {
    // Placeholder for archetype selection
    console.log("Archetype toggle clicked");
  }, []);

  return (
    <pixiContainer x={x} y={y} data-testid="menu-section">
      {/* Background Panel */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9);
          g.drawRoundedRect(0, 0, width, height, 8);
          g.endFill();
          g.setStrokeStyle({
            width: 2,
            color: KOREAN_COLORS.PRIMARY_CYAN,
            alpha: 0.7,
          });
          g.drawRoundedRect(0, 0, width, height, 8);
        }}
      />

      {/* Action Buttons Container - Use menuItems */}
      <pixiContainer x={20} y={20} data-testid="action-buttons">
        {menuItems.map((item, index) => {
          const isTraining = item.mode === "training";
          const isCombat = item.mode === "versus";

          return (
            <pixiContainer
              key={item.mode}
              y={index * 60}
              data-testid={
                isTraining
                  ? "training-button"
                  : isCombat
                  ? "combat-button"
                  : `${item.mode.toLowerCase()}-button`
              }
            >
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.beginFill(
                    selectedMode === item.mode
                      ? KOREAN_COLORS.ACCENT_GOLD
                      : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                    0.8
                  );
                  g.drawRoundedRect(0, 0, width - 40, 50, 5);
                  g.endFill();
                }}
                interactive={true}
                onPointerDown={() => onModeSelect(item.mode)}
              />
              <pixiText
                text={`${item.korean} - ${item.english}`}
                style={{
                  fontSize: 16,
                  fill: KOREAN_COLORS.TEXT_PRIMARY,
                  align: "center",
                }}
                x={(width - 40) / 2}
                y={25}
                anchor={0.5}
              />
            </pixiContainer>
          );
        })}

        {/* Start Game Button - Use onStartGame */}
        <pixiContainer
          y={menuItems.length * 60 + 20}
          data-testid="start-game-button"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.beginFill(KOREAN_COLORS.POSITIVE_GREEN, 0.8);
              g.drawRoundedRect(0, 0, width - 40, 50, 5);
              g.endFill();
            }}
            interactive={true}
            onPointerDown={onStartGame}
          />
          <pixiText
            text="게임 시작 - Start Game"
            style={{
              fontSize: 16,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              align: "center",
            }}
            x={(width - 40) / 2}
            y={25}
            anchor={0.5}
          />
        </pixiContainer>
      </pixiContainer>

      {/* Archetype Selection (Mock) */}
      <pixiContainer x={20} y={height - 80} data-testid="archetype-section">
        <pixiContainer data-testid="archetype-toggle">
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.beginFill(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.6);
              g.drawRoundedRect(0, 0, width - 40, 30, 3);
              g.endFill();
            }}
            interactive={true}
            onPointerDown={handleArchetypeToggle}
          />
          <pixiText
            text="무사 선택 - Select Archetype ▼"
            style={{
              fontSize: 12,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "center",
            }}
            x={(width - 40) / 2}
            y={15}
            anchor={0.5}
          />
        </pixiContainer>

        {/* Mock Archetype List (hidden by default) */}
        <pixiContainer y={35} data-testid="archetype-list" alpha={0}>
          {[
            "musa",
            "amsalja",
            "hacker",
            "jeongbo_yowon",
            "jojik_pokryeokbae",
          ].map((archetype, index) => (
            <pixiContainer
              key={archetype}
              y={index * 25}
              data-testid={`archetype-option-${archetype}`}
            >
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.beginFill(KOREAN_COLORS.UI_BACKGROUND_LIGHT, 0.8);
                  g.drawRoundedRect(0, 0, width - 40, 20, 2);
                  g.endFill();
                }}
              />
              <pixiText
                text={archetype}
                style={{
                  fontSize: 10,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                }}
                x={5}
                y={10}
                anchor={{ x: 0, y: 0.5 }}
              />
            </pixiContainer>
          ))}
        </pixiContainer>

        {/* Selected Archetype Display */}
        <pixiContainer y={-30} data-testid="selected-archetype">
          <pixiText
            text="선택된 무사: 무사"
            style={{
              fontSize: 10,
              fill: KOREAN_COLORS.ACCENT_GOLD,
            }}
          />
        </pixiContainer>
      </pixiContainer>

      {/* Philosophy and Controls buttons */}
      <pixiContainer x={20} y={height - 100} data-testid="philosophy-button">
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.beginFill(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.6);
            g.drawRoundedRect(0, 0, 100, 35, 5);
            g.endFill();
          }}
          interactive={true}
          onPointerDown={onShowPhilosophy}
        />
        <pixiText
          text="철학 - Philosophy"
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
          }}
          x={50}
          y={17.5}
          anchor={0.5}
        />
      </pixiContainer>

      <pixiContainer x={130} y={height - 100} data-testid="controls-button">
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.beginFill(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.6);
            g.drawRoundedRect(0, 0, 100, 35, 5);
            g.endFill();
          }}
          interactive={true}
          onPointerDown={onShowControls}
        />
        <pixiText
          text="조작 - Controls"
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
          }}
          x={50}
          y={17.5}
          anchor={0.5}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default MenuSection;
