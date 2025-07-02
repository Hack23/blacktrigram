/* ------------------------------------------------------------------ */
/*  PixiJS extensions and utilities for Black Trigram
/* ------------------------------------------------------------------ */
import {
  LayoutAnimatedSprite,
  LayoutBitmapText,
  LayoutContainer,
  LayoutGraphics,
  LayoutNineSliceSprite,
  LayoutSprite,
  LayoutText,
  LayoutTilingSprite,
  LayoutView,
} from "@pixi/layout/components";
import { extend, useTick } from "@pixi/react";
import {
  Button,
  CheckBox,
  FancyButton,
  Input,
  MaskedFrame,
  ProgressBar,
  RadioGroup,
  ScrollBox,
  Select,
  Slider,
} from "@pixi/ui";
import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";

let componentsExtended = false;

/**
 * Extends PixiJS components for use with @pixi/react.
 * This function should be called ONCE at the root of your application.
 * It is idempotent and safe to call multiple times.
 */
export const extendPixiComponents = () => {
  if (componentsExtended) {
    return;
  }

  // @pixi/react v4+ extends base PIXI components (Container, Sprite, Text, etc.) by default.
  // We only need to extend the components from @pixi/layout and @pixi/ui.
  extend({
    // Layout components
    LayoutContainer,
    LayoutSprite,
    LayoutText,
    LayoutGraphics,
    LayoutTilingSprite,
    LayoutAnimatedSprite,
    LayoutBitmapText,
    LayoutNineSliceSprite,
    LayoutView,

    // UI components
    Button,
    FancyButton,
    ProgressBar,
    ScrollBox,
    MaskedFrame,
    Slider,
    Input,
    CheckBox,
    RadioGroup,
    Select,
  });

  componentsExtended = true;
};

/**
 * Hook to ensure PixiJS extensions are applied.
 * It's recommended to call extendPixiComponents() once globally instead,
 * but this hook is safe to use in components if needed.
 * @deprecated Call extendPixiComponents() once at app root instead.
 */
export const usePixiExtensions = () => {
  extendPixiComponents();
};

// Export useTick from @pixi/react for convenience
export { useTick };

// Default export for backward compatibility
export default usePixiExtensions;

/**
 * Create a PIXI.TextStyle with appropriate fallbacks
 */
export const createTextStyle = (
  style: Partial<PIXI.TextStyleOptions>
): PIXI.TextStyle => {
  return new PIXI.TextStyle(style);
};

/**
 * Create a responsive text style based on screen width
 */
export const createResponsiveTextStyle = (
  baseStyle: Partial<PIXI.TextStyleOptions>,
  screenWidth: number
): PIXI.TextStyle => {
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;

  // Adjust font size based on screen size
  const fontSize = (baseStyle.fontSize as number) || 16;
  const responsiveFontSize = isMobile
    ? fontSize * 0.7
    : isTablet
    ? fontSize * 0.85
    : fontSize;

  return new PIXI.TextStyle({
    ...baseStyle,
    fontSize: responsiveFontSize,
  });
};

/**
 * Create a graphics context for use with LayoutGraphics
 * This is a helper to create graphics contexts in a type-safe way
 */
export const createGraphicsContext = (
  drawFunction: (g: PIXI.Graphics) => void
): PIXI.GraphicsContext => {
  const graphics = new PIXI.Graphics();
  drawFunction(graphics);
  return graphics.context;
};

/**
 * Draw a simple rounded button
 */
export const drawButton = (
  g: PIXI.Graphics,
  width: number,
  height: number,
  options: {
    fillColor?: number;
    strokeColor?: number;
    strokeWidth?: number;
    alpha?: number;
    cornerRadius?: number;
  } = {}
) => {
  const {
    fillColor = 0x333333,
    strokeColor = 0x666666,
    strokeWidth = 2,
    alpha = 1,
    cornerRadius = 8,
  } = options;

  g.clear();
  g.roundRect(0, 0, width, height, cornerRadius);
  g.fill({ color: fillColor, alpha });

  if (strokeWidth > 0) {
    g.roundRect(0, 0, width, height, cornerRadius);
    g.stroke({ width: strokeWidth, color: strokeColor, alpha });
  }
};

/**
 * Draw a Korean-style panel
 */
export const drawKoreanPanel = (
  g: PIXI.Graphics,
  width: number,
  height: number,
  options: {
    fillColor?: number;
    borderColor?: number;
    borderWidth?: number;
    alpha?: number;
    cornerRadius?: number;
  } = {}
) => {
  const {
    fillColor = 0x1a1a2e,
    borderColor = 0x00ffff,
    borderWidth = 2,
    alpha = 0.9,
    cornerRadius = 8,
  } = options;

  g.clear();
  g.roundRect(0, 0, width, height, cornerRadius);
  g.fill({ color: fillColor, alpha });

  g.roundRect(0, 0, width, height, cornerRadius);
  g.stroke({ width: borderWidth, color: borderColor, alpha: 0.8 });
};

/**
 * Enhanced Graphics API wrapper for v8 compatibility
 */
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
    return graphics.roundRect(x, y, width, height, radius);
  };

  const fillWithColor = (color: number, alpha = 1) => {
    return graphics.fill({ color, alpha });
  };

  const strokeWithColor = (color: number, width = 1, alpha = 1) => {
    return graphics.stroke({ color, width, alpha });
  };

  return {
    graphics,
    drawRoundedRect,
    fillWithColor,
    strokeWithColor,
  };
};

/**
 * Korean martial arts specific drawing utilities
 */
export const drawTrigramSymbol = (
  graphics: Graphics,
  x: number,
  y: number,
  size: number
) => {
  graphics.clear();

  // Draw trigram lines using modern API
  graphics.rect(x, y, size, size / 8).fill({ color: 0x00ffff });
  graphics.rect(x, y + size / 3, size, size / 8).fill({ color: 0x00ffff });
  graphics.rect(x, y + (2 * size) / 3, size, size / 8).fill({ color: 0x00ffff });
};
