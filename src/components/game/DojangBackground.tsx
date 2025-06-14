// Underground dojang background for Korean martial arts

import React, { useCallback, useEffect, useState } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text, Sprite, Texture } from "pixi.js";
import { KOREAN_COLORS } from "../../types/constants";
import * as PIXI from "pixi.js";

extend({
  Container,
  Graphics,
  Text,
  Sprite,
});

export interface DojangBackgroundProps {
  width: number;
  height: number;
  lighting?: "normal" | "dim" | "bright" | "cyberpunk" | "traditional";
  animate?: boolean;
  "data-testid"?: string;
}

export const DojangBackground: React.FC<DojangBackgroundProps> = ({
  width,
  height,
  lighting = "normal",
  animate = true,
  ...props
}) => {
  const [floorTexture, setFloorTexture] = useState<Texture | null>(null);
  const [wallTexture, setWallTexture] = useState<Texture | null>(null);

  // Enhanced texture loading with proper async/await pattern like IntroScreen
  useEffect(() => {
    let destroyed = false;
    const loadTextures = async () => {
      try {
        const [floor, wall] = await Promise.all([
          PIXI.Assets.load("/src/assets/visual/bg/dojang/dojang_floor_tex.png"),
          PIXI.Assets.load("/src/assets/visual/bg/dojang/dojang_wall_tex.png"),
        ]);

        if (!destroyed) {
          setFloorTexture(floor as Texture);
          setWallTexture(wall as Texture);
        }
      } catch (error) {
        console.warn("Failed to load dojang textures:", error);
        // Continue without textures - fallback graphics will be used
      }
    };

    loadTextures();
    return () => {
      destroyed = true;
    };
  }, []);

  const getLightingSettings = useCallback((lightingMode: string) => {
    switch (lightingMode) {
      case "dim":
        return {
          backgroundAlpha: 0.7,
          gridAlpha: 0.2,
          accentAlpha: 0.3,
          ambientColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
          tintColor: 0x444444,
        };
      case "bright":
        return {
          backgroundAlpha: 1.0,
          gridAlpha: 0.5,
          accentAlpha: 0.7,
          ambientColor: KOREAN_COLORS.UI_BACKGROUND_LIGHT,
          tintColor: 0xffffff,
        };
      case "cyberpunk":
        return {
          backgroundAlpha: 0.95,
          gridAlpha: 0.4,
          accentAlpha: 0.8,
          ambientColor: KOREAN_COLORS.NEON_CYAN,
          tintColor: 0x00ffff,
        };
      case "traditional":
        return {
          backgroundAlpha: 0.9,
          gridAlpha: 0.3,
          accentAlpha: 0.6,
          ambientColor: KOREAN_COLORS.KOREAN_RED,
          tintColor: 0xaa8866,
        };
      default: // "normal"
        return {
          backgroundAlpha: 0.9,
          gridAlpha: 0.3,
          accentAlpha: 0.4,
          ambientColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
          tintColor: 0xffffff,
        };
    }
  }, []);

  const drawFallbackBackground = useCallback(
    (g: any) => {
      g.clear();

      const settings = getLightingSettings(lighting);

      // Fallback solid background
      g.fill({ color: settings.ambientColor, alpha: settings.backgroundAlpha });
      g.rect(0, 0, width, height);
      g.fill();
    },
    [width, height, lighting, getLightingSettings]
  );

  const drawOverlay = useCallback(
    (g: any) => {
      g.clear();

      const settings = getLightingSettings(lighting);

      // Traditional Korean mat pattern overlay
      g.stroke({
        width: 1,
        color:
          lighting === "cyberpunk"
            ? KOREAN_COLORS.NEON_CYAN
            : KOREAN_COLORS.ACCENT_GOLD,
        alpha: settings.gridAlpha,
      });
      const gridSize = 60;
      for (let i = 0; i < width; i += gridSize) {
        g.moveTo(i, 0);
        g.lineTo(i, height);
      }
      for (let j = 0; j < height; j += gridSize) {
        g.moveTo(0, j);
        g.lineTo(width, j);
      }
      g.stroke();

      // Center circle for training with lighting-appropriate color
      const centerColor =
        lighting === "cyberpunk"
          ? KOREAN_COLORS.NEON_PURPLE
          : lighting === "traditional"
          ? KOREAN_COLORS.KOREAN_BLUE
          : KOREAN_COLORS.PRIMARY_CYAN;

      g.stroke({ width: 3, color: centerColor, alpha: 0.6 });
      g.circle(width / 2, height / 2, Math.min(width, height) * 0.2);
      g.stroke();

      // Corner decorations with lighting-appropriate styling
      const cornerSize = 40;
      const cornerColor =
        lighting === "cyberpunk"
          ? KOREAN_COLORS.NEON_PINK
          : lighting === "traditional"
          ? KOREAN_COLORS.KOREAN_RED
          : KOREAN_COLORS.ACCENT_GOLD;

      g.fill({ color: cornerColor, alpha: settings.accentAlpha });
      g.rect(0, 0, cornerSize, cornerSize);
      g.rect(width - cornerSize, 0, cornerSize, cornerSize);
      g.rect(0, height - cornerSize, cornerSize, cornerSize);
      g.rect(width - cornerSize, height - cornerSize, cornerSize, cornerSize);
      g.fill();

      // Additional cyberpunk effects
      if (lighting === "cyberpunk") {
        // Neon strips along edges
        g.stroke({ width: 2, color: KOREAN_COLORS.NEON_CYAN, alpha: 0.8 });
        g.moveTo(0, height * 0.25);
        g.lineTo(width, height * 0.25);
        g.moveTo(0, height * 0.75);
        g.lineTo(width, height * 0.75);
        g.stroke();

        // Glowing center accent
        g.fill({ color: KOREAN_COLORS.NEON_PURPLE, alpha: 0.2 });
        g.circle(width / 2, height / 2, Math.min(width, height) * 0.1);
        g.fill();
      }

      // Additional traditional effects
      if (lighting === "traditional") {
        // Traditional Korean border pattern
        g.stroke({ width: 4, color: KOREAN_COLORS.KOREAN_BLUE, alpha: 0.6 });
        g.rect(20, 20, width - 40, height - 40);
        g.stroke();

        // Yin-yang symbol in center
        g.fill({ color: KOREAN_COLORS.KOREAN_BLACK, alpha: 0.3 });
        g.circle(width / 2, height / 2, 30);
        g.fill();
        g.fill({ color: KOREAN_COLORS.KOREAN_WHITE, alpha: 0.3 });
        g.arc(width / 2, height / 2, 30, 0, Math.PI);
        g.fill();
      }
    },
    [width, height, lighting, getLightingSettings]
  );

  const settings = getLightingSettings(lighting);

  return (
    <pixiContainer {...props}>
      {/* Background Layer */}
      {floorTexture ? (
        // Dojang Floor Texture Background
        <pixiSprite
          texture={floorTexture}
          x={0}
          y={0}
          width={width}
          height={height}
          alpha={settings.backgroundAlpha}
          tint={settings.tintColor}
          data-testid="dojang-floor-texture"
        />
      ) : (
        // Fallback solid background if texture fails to load
        <pixiGraphics
          draw={drawFallbackBackground}
          data-testid="dojang-fallback-background"
        />
      )}

      {/* Wall accent texture (if available) */}
      {wallTexture && lighting === "traditional" && (
        <pixiSprite
          texture={wallTexture}
          x={width * 0.8}
          y={0}
          width={width * 0.3}
          height={height}
          alpha={0.3}
          tint={settings.tintColor}
          data-testid="dojang-wall-texture"
        />
      )}

      {/* Overlay graphics for grid lines and decorative elements */}
      <pixiGraphics draw={drawOverlay} data-testid="dojang-overlay" />
    </pixiContainer>
  );
};

export default DojangBackground;
