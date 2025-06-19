import { useEffect } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text, Sprite, AnimatedSprite } from "pixi.js";
import "@pixi/layout";

/**
 * Custom hook to ensure PixiJS components are extended for use in React
 */
export function usePixiExtensions(): void {
  useEffect(() => {
    extend({
      Container,
      Graphics,
      Text,
      Sprite,
      AnimatedSprite,
    });
  }, []);
}

/**
 * Initialize all required PixiJS extensions for the game
 */
export function initializePixiExtensions(): void {
  extend({
    Container,
    Graphics,
    Text,
    Sprite,
    AnimatedSprite,
  });
}

/**
 * Simple tick hook placeholder - not using PIXI ticker for now
 */
export function useTick(callback?: (delta: number) => void): void {
  useEffect(() => {
    if (!callback) return;

    let animationId: number;
    let lastTime = 0;

    const tick = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      if (delta > 0) {
        callback(delta);
      }

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [callback]);
}

export default usePixiExtensions;

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

/**
 * @function createPixiElement
 * @description Helper to create PixiJS elements with proper typing
 */
export const createPixiElement = <T extends keyof JSX.IntrinsicElements>(
  type: T,
  props: JSX.IntrinsicElements[T]
): JSX.Element => {
  // This would be implemented based on specific PixiJS element creation needs
  // For now, it serves as a placeholder for future enhancements
  throw new Error("createPixiElement not yet implemented");
};

/**
 * @constant PIXI_ELEMENT_TYPES
 * @description Available PixiJS element types for React components
 */
export const PIXI_ELEMENT_TYPES = {
  CONTAINER: "pixiContainer",
  GRAPHICS: "pixiGraphics",
  TEXT: "pixiText",
  SPRITE: "pixiSprite",
  ANIMATED_SPRITE: "pixiAnimatedSprite",
} as const;

export type PixiElementType =
  (typeof PIXI_ELEMENT_TYPES)[keyof typeof PIXI_ELEMENT_TYPES];
