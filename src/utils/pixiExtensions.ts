import { useEffect } from "react";
import { extend } from "@pixi/react";
import {
  Container,
  Graphics,
  Text,
  Sprite,
  AnimatedSprite,
  TilingSprite,
  BitmapText,
  NineSliceSprite,
} from "pixi.js";

// Re-export useTick from @pixi/react for convenience
export { useTick } from "@pixi/react";

// Extend PIXI React with all components used in Black Trigram
export function usePixiExtensions(): void {
  useEffect(() => {
    extend({
      Container,
      Graphics,
      Text, // Fixed: Add Text to extensions
      Sprite,
      AnimatedSprite,
      TilingSprite,
      BitmapText,
      NineSliceSprite,
    });
  }, []);
}

// Enhanced Graphics API wrapper for v8 compatibility
export const createKoreanGraphics = () => {
  const graphics = new Graphics();

  // Modern PixiJS v8 API wrappers
  const drawRoundedRect = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    return graphics.roundRect(x, y, width, height, radius); // Updated API
  };

  const fillWithColor = (color: number, alpha = 1) => {
    return graphics.fill({ color, alpha }); // Updated API - no beginFill/endFill needed
  };

  const strokeWithColor = (color: number, width = 1, alpha = 1) => {
    return graphics.stroke({ color, width, alpha }); // Updated API
  };

  return {
    graphics,
    drawRoundedRect,
    fillWithColor,
    strokeWithColor,
  };
};

// Korean martial arts specific drawing utilities
export const drawTrigramSymbol = (
  graphics: Graphics,
  x: number,
  y: number,
  size: number
) => {
  graphics.clear();

  // Draw trigram lines using modern API
  graphics.rect(x, y, size, size / 8);
  graphics.fill({ color: 0x00ffff });

  graphics.rect(x, y + size / 3, size, size / 8);
  graphics.fill({ color: 0x00ffff });

  graphics.rect(x, y + (2 * size) / 3, size, size / 8);
  graphics.fill({ color: 0x00ffff });
};
