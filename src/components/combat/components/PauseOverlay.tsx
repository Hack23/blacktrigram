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
    // Enhanced gradient-like effect with multiple layers
    g.fill({ color: 0x0a0f12, alpha: 0.85 });
    g.rect(0, 0, window.innerWidth, window.innerHeight);
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

  const instructionsStyle = new TextStyle({
    fontFamily: '"Noto Sans KR", sans-serif',
    fontSize: isMobile ? 14 : 18,
    fill: "#ffd700",
    align: "center",
    fontWeight: "600",
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
      
      {/* Enhanced central panel with decorative borders */}
      <pixiContainer
        layout={{
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Decorative top border */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.stroke({ width: 2, color: 0x00ffc8, alpha: 0.6 });
            g.moveTo(-150, -10);
            g.lineTo(150, -10);
          }}
        />

        <pixiText text="일시정지 | PAUSED" style={titleStyle} />
        
        {/* Enhanced instructions panel */}
        <pixiContainer
          layout={{
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <pixiText
            text="ESC 키로 계속하기 | Press ESC to resume"
            style={instructionsStyle}
            visible={!isMobile}
          />
          <pixiText
            text={isMobile ? "화면 터치로 계속하기 | Tap to resume" : ""}
            style={subtitleStyle}
            visible={isMobile}
          />
        </pixiContainer>

        {/* Decorative bottom border */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.stroke({ width: 2, color: 0x00ffc8, alpha: 0.6 });
            g.moveTo(-150, 10);
            g.lineTo(150, 10);
          }}
        />
      </pixiContainer>
    </pixiContainer>
  );
};
