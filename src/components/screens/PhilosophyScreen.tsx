import React, { useEffect } from "react";
import "@pixi/layout";
import { extend } from "@pixi/react";
import { Container, FillGradient } from "pixi.js";
import { KOREAN_COLORS } from "../../types/constants";
import { PhilosophySection } from "./PhilosophySection";

extend({ Container });

export interface PhilosophyScreenProps {
  readonly onReturnToMenu: () => void;
  readonly width?: number;
  readonly height?: number;
}

export const PhilosophyScreen: React.FC<PhilosophyScreenProps> = ({
  onReturnToMenu,
  width = 1200,
  height = 800,
}) => {
  // Enhanced keyboard handling for screen-level navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key.toLowerCase() === "m") {
        event.preventDefault();
        onReturnToMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReturnToMenu]);

  return (
    <pixiContainer
      width={width}
      height={height}
      data-testid="philosophy-screen"
      layout={{
        width,
        height,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 0,
      }}
    >
      <pixiGraphics
        draw={(g) => {
          g.clear();
          const gradient = new FillGradient(0, 0, width, height);
          gradient.addColorStop(0, 0x0a0a0f);
          gradient.addColorStop(0.5, 0x1a1a2e);
          gradient.addColorStop(1, 0x0f0f23);
          g.fill(gradient);
          g.rect(0, 0, width, height);
          g.fill();

          // Add cyberpunk grid overlay like IntroScreen
          g.stroke({
            width: 1,
            color: KOREAN_COLORS.PRIMARY_CYAN,
            alpha: 0.15,
          });
          const gridSize = 60;
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
        layout={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        data-testid="philosophy-background"
      />

      <pixiContainer
        layout={{
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <PhilosophySection
          onBack={onReturnToMenu}
          x={0}
          y={0}
          width={width - 40} // Account for padding
          height={height - 40}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default PhilosophyScreen;
