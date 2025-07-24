// src/components/combat/components/PauseOverlay.tsx
import { extend } from "@pixi/react";
import { Container, Graphics, TextStyle } from "pixi.js";
import React, { useCallback } from "react";
import { extendPixiComponents } from "../../../utils/pixiExtensions";

// Ensure PixiJS components are extended
extendPixiComponents();
extend({ Container });

export interface PauseOverlayProps {
  readonly isMobile: boolean;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({ isMobile }) => {
  const draw = useCallback((g: Graphics) => {
    g.clear();
    g.beginFill(0x0a0f12, 0.85); // Dark obsidian with 85% opacity
    g.drawRect(0, 0, window.innerWidth, window.innerHeight);
    g.endFill();
  }, []);

  const titleStyle = new TextStyle({
    fontFamily: '"Noto Sans KR", "Roboto", sans-serif',
    fontSize: isMobile ? 48 : 72,
    fill: "#00FFC8", // Teal Neon
    fontWeight: "bold",
    stroke: { color: "#000000", width: 4 },
    letterSpacing: 2,
    dropShadow: {
      color: "#00FFC8",
      blur: 15,
      distance: 0,
    },
  });

  const subtitleStyle = new TextStyle({
    fontFamily: '"Noto Sans KR", sans-serif',
    fontSize: isMobile ? 16 : 20,
    fill: "#a0a0a0",
    align: "center",
  });

  return (
    <pixiContainer
      layout={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <pixiGraphics draw={draw} />
      <pixiContainer
        layout={{
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <pixiText text="일시정지 | PAUSED" style={titleStyle} />
        <pixiText
          text="Press ESC to resume"
          style={subtitleStyle}
          visible={!isMobile}
        />
      </pixiContainer>
    </pixiContainer>
  );
};
