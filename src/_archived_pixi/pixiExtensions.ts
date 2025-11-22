/**
 * PixiJS extensions and utilities for Black Trigram
 */
import { extend, useTick } from "@pixi/react";
import * as PIXI from "pixi.js";
import { Container, Graphics, Sprite, Text } from "pixi.js";

/**
 * Extend PIXI components for use with React
 */
export const extendPixiComponents = () => {
  extend({ Container, Graphics, Text, Sprite });
};

/**
 * Hook to use PixiJS extensions
 */
export const usePixiExtensions = () => {
  // Extend PIXI components on first call
  extendPixiComponents();

  return {
    extendPixiComponents,
  };
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
  const fontSize = baseStyle.fontSize as number;
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
  g.fill({ color: fillColor, alpha });
  g.roundRect(0, 0, width, height, cornerRadius);
  g.fill();

  if (strokeWidth > 0) {
    g.stroke({ width: strokeWidth, color: strokeColor, alpha });
    g.roundRect(0, 0, width, height, cornerRadius);
    g.stroke();
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
  g.fill({ color: fillColor, alpha });
  g.roundRect(0, 0, width, height, cornerRadius);
  g.fill();

  g.stroke({ width: borderWidth, color: borderColor, alpha: 0.8 });
  g.roundRect(0, 0, width, height, cornerRadius);
  g.stroke();
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
  graphics.rect(x, y, size, size / 8);
  graphics.fill({ color: 0x00ffff });

  graphics.rect(x, y + size / 3, size, size / 8);
  graphics.fill({ color: 0x00ffff });

  graphics.rect(x, y + (2 * size) / 3, size, size / 8);
  graphics.fill({ color: 0x00ffff });
};
