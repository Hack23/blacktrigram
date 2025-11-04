// src/components/combat/components/CombatFooter.tsx
import { extend } from "@pixi/react";
import { Container, TextStyle } from "pixi.js";
import React, { useState } from "react";
import { extendPixiComponents } from "../../../utils/pixiExtensions";

// Ensure PixiJS components are extended
extendPixiComponents();
extend({ Container });

export interface CombatFooterProps {
  readonly onReturnToMenu: () => void;
  readonly isMobile: boolean;
  readonly width: number;
  readonly height: number;
}

export const CombatFooter: React.FC<CombatFooterProps> = ({
  onReturnToMenu,
  isMobile,
  width,
  height,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const textStyle = new TextStyle({
    fontFamily: '"Noto Sans KR", sans-serif',
    fontSize: isMobile ? 12 : 14,
    fill: "#a0a0a0",
    align: "center",
  });

  const buttonTextStyle = new TextStyle({
    fontFamily: '"Noto Sans KR", sans-serif',
    fontSize: isMobile ? 14 : 16,
    fill: isHovered ? "#00FFC8" : "#c0c0c0",
    fontWeight: "bold",
  });

  const controlsText = isMobile
    ? "화면 터치로 조작 | Use On-Screen Controls"
    : "조작: [WASD] 이동 | [Space] 공격 | [Shift] 방어 | [Alt] 기술 | [1-8] 자세";

  const fullControlsText = "Controls: [WASD] Move | [Space] Attack | [Shift] Defend | [Alt] Technique | [1-8] Stances";

  return (
    <pixiContainer
      layout={{
        width,
        height,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
      }}
    >
      {/* Enhanced background with subtle glow */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({
            color: 0x000000,
            alpha: 0.5,
          });
          g.rect(0, 0, width, height);
        }}
        x={-20}
        y={0}
      />

      <pixiText
        text={isMobile ? controlsText : fullControlsText}
        style={{ ...textStyle, align: "left" }}
        layout={{
          flexGrow: 1,
        }}
      />

      {/* Enhanced menu button with hover effect */}
      <pixiContainer
        interactive
        cursor="pointer"
        onPointerTap={onReturnToMenu}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        layout={{
          flexShrink: 0,
        }}
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            // Button background
            g.fill({
              color: isHovered ? 0x003344 : 0x002233,
              alpha: 0.9,
            });
            g.roundRect(0, 0, 140, 30, 5);

            // Border with glow
            g.stroke({
              width: isHovered ? 2 : 1,
              color: isHovered ? 0x00ffc8 : 0x00aa99,
              alpha: isHovered ? 1 : 0.7,
            });
            g.roundRect(0, 0, 140, 30, 5);
          }}
        />
        <pixiText
          text="메뉴로 | Return to Menu"
          style={buttonTextStyle}
          x={70}
          y={15}
          anchor={0.5}
        />
      </pixiContainer>
    </pixiContainer>
  );
};
