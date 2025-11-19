import "@pixi/layout";
import { extend } from "@pixi/react";
import { Container, FillGradient } from "pixi.js";
import React, { useEffect, useMemo } from "react";
import { useAudio } from "../../audio/AudioProvider";
import { KOREAN_COLORS } from "../../types/constants";
import { ControlsSection } from "./ControlsSection";

extend({ Container });

export interface ControlsScreenProps {
  readonly onReturnToMenu: () => void;
  readonly width?: number;
  readonly height?: number;
}

export const ControlsScreen: React.FC<ControlsScreenProps> = ({
  onReturnToMenu,
  width = 1200,
  height = 800,
}) => {
  const audio = useAudio();
  const isMobile = useMemo(() => width < 768, [width]);
  const layoutConstants = useMemo(
    () => ({
      padding: isMobile ? 10 : 20,
      headerHeight: isMobile ? 50 : 60,
      footerHeight: isMobile ? 40 : 50,
    }),
    [isMobile]
  );

  // Enhanced keyboard handling for screen-level navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key.toLowerCase() === "m") {
        event.preventDefault();
        audio.playSFX("menu_back");
        onReturnToMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReturnToMenu, audio]);

  return (
    <pixiContainer
      width={width}
      height={height}
      data-testid="controls-screen"
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

          // Cyberpunk grid overlay
          g.stroke({
            width: 1,
            color: KOREAN_COLORS.PRIMARY_CYAN,
            alpha: 0.15,
          });
          const gridSize = isMobile ? 40 : 60;
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
        data-testid="controls-background"
      />

      <pixiContainer
        layout={{
          width: "100%",
          height: layoutConstants.headerHeight,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        data-testid="controls-header"
      >
        <pixiText
          text="조작법 안내 - Controls Guide"
          style={{
            fontSize: isMobile ? 16 : 20,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
            align: "center",
          }}
          anchor={0.5}
          x={width / 2}
          y={layoutConstants.headerHeight / 2}
        />
      </pixiContainer>

      <pixiContainer
        layout={{
          width: "100%",
          flexGrow: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: layoutConstants.padding,
        }}
      >
        <ControlsSection
          onBack={onReturnToMenu}
          x={0}
          y={0}
          width={width - layoutConstants.padding * 2}
          height={
            height -
            layoutConstants.headerHeight -
            layoutConstants.footerHeight -
            layoutConstants.padding * 2
          }
        />
      </pixiContainer>

      <pixiContainer
        layout={{
          width: "100%",
          height: layoutConstants.footerHeight,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        data-testid="controls-footer"
      >
        <pixiText
          text="ESC 또는 M 키로 메뉴로 돌아가기 - Press ESC or M to return to menu"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontStyle: "italic",
            align: "center",
          }}
          anchor={0.5}
          x={width / 2}
          y={layoutConstants.footerHeight / 2}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default ControlsScreen;
