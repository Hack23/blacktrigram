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
    ? "Use On-Screen Controls"
    : "Controls: [WASD] Move | [Space] Attack | [Shift] Defend | [Alt] Technique";

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
      <pixiText
        text={controlsText}
        style={{ ...textStyle, align: "left" }}
        layout={{
          flexGrow: 1,
        }}
      />
      <pixiText
        text="Return to Menu"
        style={buttonTextStyle}
        interactive
        cursor="pointer"
        onPointerTap={onReturnToMenu}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        layout={{
          flexShrink: 0,
        }}
      />
    </pixiContainer>
  );
};
