// Base button component with Korean martial arts styling

import React, { useState, useMemo, useCallback } from "react";
import { Container, Graphics, Text, Sprite } from "@pixi/react";
import type { BaseButtonProps } from "../../../types";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../../../types/constants";
import * as PIXI from "pixi.js";
import { useTexture } from "../../../hooks/useTexture"; // Assuming useTexture hook

interface ButtonColors {
  base: number;
  hover: number;
  active: number;
  text: number;
  border?: number;
}

export const BaseButton: React.FC<BaseButtonProps> = ({
  text,
  englishText, // Can be part of KoreanText object or separate
  variant = "primary",
  size = "medium",
  icon,
  onClick, // For HTML button (not used here as it's a Pixi component)
  onPixiClick,
  disabled = false,
  isLoading = false, // TODO: Implement loading visual state
  // style, // For HTML button
  pixiStyle: customPixiStyle, // For PIXI text
  // className, // For HTML button
  // fullWidth, // For HTML button, layout handled by Pixi props x,y,width,height
  testId, // For testing, can be added as a prop to Container if needed
  x = 0,
  y = 0,
  width: propWidth, // Renamed to avoid conflict
  height: propHeight, // Renamed to avoid conflict
  anchor = 0, // PIXI anchor for the button container
  draw: customDraw, // Allow custom draw logic
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false); // Used
  const [isPressed, setIsPressed] = useState(false); // Used

  const variantColors: ButtonColors = useMemo(() => {
    switch (variant) {
      case "secondary":
        return {
          base: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
          hover: KOREAN_COLORS.UI_BACKGROUND_LIGHT,
          active: KOREAN_COLORS.UI_BACKGROUND_DARK,
          text: KOREAN_COLORS.TEXT_PRIMARY,
          border: KOREAN_COLORS.UI_BORDER,
        };
      case "danger":
        return {
          base: KOREAN_COLORS.NEGATIVE_RED,
          hover: KOREAN_COLORS.NEGATIVE_RED_LIGHT,
          active: KOREAN_COLORS.NEGATIVE_RED_DARK,
          text: KOREAN_COLORS.WHITE_SOLID,
          border: KOREAN_COLORS.NEGATIVE_RED_DARK,
        };
      case "link":
      case "ghost":
        return {
          base: KOREAN_COLORS.TRANSPARENT, // Use transparent color
          hover: KOREAN_COLORS.UI_BUTTON_HOVER_BG, // Slight background on hover for ghost/link
          active: KOREAN_COLORS.UI_BUTTON_ACTIVE_BG,
          text: KOREAN_COLORS.PRIMARY_CYAN,
          border: KOREAN_COLORS.TRANSPARENT,
        };
      case "hover": // Custom variant for specific hover state if needed
        return {
          base: KOREAN_COLORS.UI_BUTTON_HOVER_BG,
          hover: KOREAN_COLORS.UI_BUTTON_HOVER_BG,
          active: KOREAN_COLORS.UI_BUTTON_ACTIVE_BG,
          text: KOREAN_COLORS.ACCENT_PRIMARY,
          border: KOREAN_COLORS.PRIMARY_CYAN,
        };
      case "primary":
      default:
        return {
          base: KOREAN_COLORS.PRIMARY_CYAN,
          hover: KOREAN_COLORS.PRIMARY_CYAN_LIGHT,
          active: KOREAN_COLORS.PRIMARY_CYAN_DARK,
          text: KOREAN_COLORS.BLACK_SOLID, // Text on primary buttons often dark
          border: KOREAN_COLORS.PRIMARY_CYAN_DARK,
        };
    }
  }, [variant]);

  const currentColors = useMemo(() => {
    // Define currentColors
    if (disabled)
      return {
        ...variantColors,
        base: KOREAN_COLORS.UI_DISABLED_BG,
        text: KOREAN_COLORS.UI_DISABLED_TEXT,
        border: KOREAN_COLORS.UI_DISABLED_BORDER,
      };
    if (isPressed)
      return {
        ...variantColors,
        base: variantColors.active,
        border: variantColors.border || variantColors.active,
      };
    if (isHovered)
      return {
        ...variantColors,
        base: variantColors.hover,
        border: variantColors.border || variantColors.hover,
      };
    return variantColors;
  }, [variantColors, disabled, isPressed, isHovered]);

  const buttonActualWidth = useMemo(() => {
    // Define buttonActualWidth
    if (propWidth) return propWidth;
    // Basic auto-sizing logic (can be improved)
    let calculatedWidth = 100; // Min width
    if (typeof text === "string")
      calculatedWidth = Math.max(
        calculatedWidth,
        text.length * (FONT_SIZES[size] || FONT_SIZES.medium) * 0.7 + 40
      );
    else if (text?.korean)
      calculatedWidth = Math.max(
        calculatedWidth,
        text.korean.length * (FONT_SIZES[size] || FONT_SIZES.medium) * 0.8 + 40
      );
    if (icon) calculatedWidth += 30;
    return Math.min(calculatedWidth, 400); // Max width
  }, [propWidth, text, size, icon]);

  const buttonActualHeight =
    propHeight || (size === "large" ? 60 : size === "medium" ? 50 : 40); // Define buttonActualHeight

  const textStyle = useMemo(() => {
    // Define textStyle
    const baseSize = FONT_SIZES[size] || FONT_SIZES.medium;
    return new PIXI.TextStyle({
      fontFamily: FONT_FAMILY.PRIMARY,
      fontSize: baseSize,
      fill: currentColors.text,
      fontWeight: FONT_WEIGHTS.semibold.toString() as PIXI.TextStyleFontWeight,
      align: "center",
      ...customPixiStyle,
    });
  }, [size, currentColors.text, customPixiStyle]);

  const drawButton = useCallback(
    (g: PIXI.Graphics) => {
      if (customDraw) {
        customDraw(g); // Allow external draw function to take over
        return;
      }
      g.clear();
      const currentFill = currentColors.base; // Define currentFill
      const currentBorder = currentColors.border || currentFill;

      g.beginFill(currentFill, disabled ? 0.5 : isLoading ? 0.7 : 1);
      g.lineStyle(2, currentBorder, disabled ? 0.3 : 1);
      g.drawRoundedRect(
        0,
        0,
        buttonActualWidth,
        buttonActualHeight,
        buttonActualHeight / 4
      );
      g.endFill();

      if (isLoading) {
        // Simple loading indicator (e.g., pulsating alpha or a spinner)
        g.beginFill(
          KOREAN_COLORS.WHITE_SOLID,
          Math.sin(Date.now() / 200) * 0.2 + 0.3
        );
        g.drawCircle(buttonActualWidth - 20, buttonActualHeight / 2, 8);
        g.endFill();
      }
    },
    [
      buttonActualWidth,
      buttonActualHeight,
      currentColors,
      disabled,
      isLoading,
      customDraw,
    ]
  );

  const handlePointerDown = useCallback(() => {
    if (!disabled && !isLoading) setIsPressed(true);
  }, [disabled, isLoading]);

  const handlePointerUp = useCallback(() => {
    if (!disabled && !isLoading && isPressed) {
      if (onPixiClick) onPixiClick({} as PIXI.FederatedPointerEvent); // Mock event for now
    }
    setIsPressed(false);
  }, [disabled, isLoading, isPressed, onPixiClick]);

  const handlePointerOver = useCallback(() => {
    if (!disabled && !isLoading) setIsHovered(true);
  }, [disabled, isLoading]);

  const handlePointerOut = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false); // Also reset pressed state if pointer leaves while pressed
  }, []);

  // const handlePointerTap = useCallback(() => { // Unused
  //   if (!disabled && !isLoading && onPixiClick) {
  //     onPixiClick({} as PIXI.FederatedPointerEvent);
  //   }
  // }, [disabled, isLoading, onPixiClick]);

  const iconTexture =
    typeof icon === "string"
      ? useTexture(icon)
      : icon instanceof PIXI.Texture
      ? icon
      : null;
  const displayText = typeof text === "string" ? text : text?.korean || "";
  const displaySubText = typeof text !== "string" ? text?.english : englishText;

  const textX = iconTexture
    ? buttonActualWidth / 2 + 15
    : buttonActualWidth / 2;
  const textY = displaySubText
    ? buttonActualHeight / 2 - (textStyle.fontSize || FONT_SIZES.medium) * 0.3
    : buttonActualHeight / 2;

  return (
    <Container
      x={x}
      y={y}
      pivot={
        typeof anchor === "number"
          ? [buttonActualWidth * anchor, buttonActualHeight * anchor]
          : [
              buttonActualWidth * (anchor?.x || 0),
              buttonActualHeight * (anchor?.y || 0),
            ]
      }
      interactive={!disabled && !isLoading}
      buttonMode={!disabled && !isLoading}
      cursor={!disabled && !isLoading ? "pointer" : "default"}
      pointerdown={handlePointerDown} // Use defined handler
      pointerup={handlePointerUp} // Use defined handler
      pointerover={handlePointerOver} // Use defined handler
      pointerout={handlePointerOut} // Use defined handler
      // pointertap={handlePointerTap} // Use defined handler
      {...props}
    >
      <Graphics draw={drawButton} />
      {iconTexture && (
        <Sprite
          texture={iconTexture}
          anchor={0.5}
          x={20}
          y={buttonActualHeight / 2}
          width={(textStyle.fontSize || FONT_SIZES.medium) * 1.2}
          height={(textStyle.fontSize || FONT_SIZES.medium) * 1.2}
          tint={currentColors.text}
        />
      )}
      {displayText && (
        <Text
          text={displayText}
          anchor={0.5}
          x={textX}
          y={textY}
          style={textStyle} // Use defined textStyle
        />
      )}
      {displaySubText && (
        <Text
          text={displaySubText}
          anchor={0.5}
          x={textX}
          y={
            buttonActualHeight / 2 +
            (textStyle.fontSize || FONT_SIZES.medium) * 0.5
          } // Use defined textStyle
          style={{
            ...textStyle,
            fontSize: (textStyle.fontSize || FONT_SIZES.medium) * 0.75,
          }} // Use defined textStyle
        />
      )}
    </Container>
  );
};
