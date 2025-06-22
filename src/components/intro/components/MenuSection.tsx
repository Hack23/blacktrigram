import React from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import { GameMode } from "../../../types/enums";

export interface MenuSectionProps {
  readonly menuItems: Array<{
    mode: GameMode;
    korean: string;
    english: string;
  }>;
  readonly selectedIndex: number;
  readonly onModeSelect: (mode: GameMode) => void;
  readonly width: number;
  readonly height: number;
  readonly x: number;
  readonly y: number;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  selectedIndex,
  onModeSelect,
  width,
  height,
  x,
  y,
}) => {
  return (
    <pixiContainer
      x={x}
      y={y}
      layout={{
        width,
        height,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 24,
        padding: 20,
      }}
      data-testid="menu-section"
    >
      {/* Background Panel */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
          g.roundRect(0, 0, width, height, 8);
          g.fill();
          g.stroke({
            width: 2,
            color: KOREAN_COLORS.PRIMARY_CYAN,
            alpha: 0.7,
          });
          g.roundRect(0, 0, width, height, 8);
          g.stroke();
        }}
      />

      {/* Menu Title */}
      <pixiText
        text="메인 메뉴 - Main Menu"
        style={{
          fontSize: 18,
          fill: KOREAN_COLORS.ACCENT_GOLD,
          align: "center",
          fontWeight: "bold",
        }}
        x={width / 2}
        y={20}
        anchor={0.5}
      />

      {/* Menu Items Container */}
      <pixiContainer
        x={20}
        y={50}
        layout={{
          width: width - 40,
          flexDirection: "column",
          gap: 16,
        }}
        data-testid="main-menu-buttons"
      >
        {menuItems.map((item, index) => (
          <pixiContainer
            key={item.mode}
            y={index * 60}
            layout={{
              width: width - 40,
              height: 50,
              marginBottom: 12,
            }}
            data-testid={`menu-item-${item.mode}`}
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color:
                    selectedIndex === index
                      ? KOREAN_COLORS.ACCENT_GOLD
                      : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, width - 40, 50, 5);
                g.fill();
              }}
              interactive={true}
              onPointerDown={() => onModeSelect(item.mode)}
            />
            <pixiText
              text={`${item.korean} - ${item.english}`}
              style={{
                fontSize: 16,
                fill:
                  selectedIndex === index
                    ? KOREAN_COLORS.UI_BACKGROUND_DARK
                    : KOREAN_COLORS.TEXT_PRIMARY,
                align: "center",
              }}
              x={(width - 40) / 2}
              y={25}
              anchor={0.5}
            />
          </pixiContainer>
        ))}
      </pixiContainer>

      {/* Keyboard navigation hint */}
      <pixiText
        text="방향키로 메뉴 이동, Enter 키로 선택"
        style={{
          fontSize: 12,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
          align: "center",
          fontStyle: "italic",
        }}
        x={width / 2}
        y={height - 20}
        anchor={0.5}
      />
    </pixiContainer>
  );
};

export default MenuSection;
