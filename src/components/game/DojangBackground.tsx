// Underground dojang background for Korean martial arts

import { extend } from "@pixi/react";
import * as PIXI from "pixi.js";
import { Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import React, { useCallback, useEffect, useState } from "react";
import { KOREAN_COLORS } from "../../types/constants";

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
          PIXI.Assets.load("/assets/visual/bg/dojang/dojang_floor_tex.png"),
          PIXI.Assets.load("/assets/visual/bg/dojang/dojang_wall_tex.png"),
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

      // Adaptive finer grid + center focus ring
      const step = Math.max(40, Math.min(70, width / 28));
      for (let i = 0; i < width; i += step) {
        g.moveTo(i, 0);
        g.lineTo(i, height);
      }
      for (let j = 0; j < height; j += step) {
        g.moveTo(0, j);
        g.lineTo(width, j);
      }
      g.stroke();

      // Subtle center ellipse (focus zone)
      g.stroke({
        width: 2,
        color:
          lighting === "cyberpunk"
            ? KOREAN_COLORS.PRIMARY_CYAN
            : KOREAN_COLORS.ACCENT_GOLD,
        alpha: settings.accentAlpha * 0.55,
      });
      const cx = width / 2;
      const cy = height * 0.62;
      g.ellipse(cx, cy, width * 0.28, height * 0.18);
      g.stroke();

      // Vignette
      g.beginFill(0x000000, 0.35);
      g.drawRect(0, 0, width, height);
      g.endFill();
      g.blendMode = "overlay";
    },
    [width, height, lighting, getLightingSettings]
  );

  const settings = getLightingSettings(lighting);

  return (
    <pixiContainer {...props}>
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
        <pixiGraphics
          draw={drawFallbackBackground}
          data-testid="dojang-fallback-background"
        />
      )}

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

      <pixiGraphics draw={drawOverlay} data-testid="dojang-overlay" />
    </pixiContainer>
  );
};

export default DojangBackground;
