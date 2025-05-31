import React, { useCallback } from "react";
import type { Graphics as PixiGraphics } from "pixi.js";
import { KOREAN_FONT_FAMILY } from "../../../types";

// Simple wrapper components for PixiJS elements
export interface PixiGraphicsComponentProps {
  readonly x?: number;
  readonly y?: number;
  readonly interactive?: boolean;
  readonly draw: (graphics: PixiGraphics) => void;
  readonly onClick?: (() => void) | null;
  readonly onPointerDown?: (() => void) | null;
  readonly alpha?: number;
  readonly visible?: boolean;
}

export function PixiGraphicsComponent({
  x = 0,
  y = 0,
  interactive = false,
  draw,
  onClick = null,
  onPointerDown = null,
  alpha = 1,
  visible = true,
}: PixiGraphicsComponentProps): React.ReactElement {
  const memoizedDraw = useCallback(draw, [draw]);

  return (
    <pixiGraphics
      x={x}
      y={y}
      interactive={interactive}
      draw={memoizedDraw}
      onClick={onClick}
      onPointerDown={onPointerDown}
      alpha={alpha}
      visible={visible}
    />
  );
}

export interface PixiTextComponentProps {
  readonly text: string;
  readonly x?: number;
  readonly y?: number;
  readonly anchor?: { x: number; y: number } | number;
  readonly style?: {
    readonly fontFamily?: string;
    readonly fontSize?: number;
    readonly fill?: number | string;
    readonly fontWeight?:
      | "normal"
      | "bold"
      | "bolder"
      | "lighter"
      | "100"
      | "200"
      | "300"
      | "400"
      | "500"
      | "600"
      | "700"
      | "800"
      | "900";
  };
  readonly alpha?: number;
  readonly visible?: boolean;
}

export function PixiTextComponent({
  text,
  x = 0,
  y = 0,
  anchor = { x: 0, y: 0 },
  style = {},
  alpha = 1,
  visible = true,
}: PixiTextComponentProps): React.ReactElement {
  // Ensure proper PixiJS style format
  const pixiStyle = {
    fontFamily: KOREAN_FONT_FAMILY,
    fontSize: 16,
    fill: 0xffffff,
    fontWeight: "normal" as const,
    align: "left" as const,
    ...style,
  };

  return (
    <pixiText
      text={text}
      x={x}
      y={y}
      anchor={anchor}
      style={pixiStyle}
      alpha={alpha}
      visible={visible}
    />
  );
}

export interface PixiContainerComponentProps {
  readonly x?: number;
  readonly y?: number;
  readonly interactive?: boolean;
  readonly children?: React.ReactNode;
  readonly alpha?: number;
  readonly visible?: boolean;
  readonly onClick?: (() => void) | null;
  readonly onPointerDown?: (() => void) | null;
  readonly onPointerLeave?: (() => void) | null;
  readonly onPointerEnter?: (() => void) | null; // Add this missing prop
}

export function PixiContainerComponent({
  x = 0,
  y = 0,
  interactive = false,
  children,
  alpha = 1,
  visible = true,
  onClick = null,
  onPointerDown = null,
  onPointerLeave = null,
  onPointerEnter = null,
}: PixiContainerComponentProps): React.ReactElement {
  return (
    <pixiContainer
      x={x}
      y={y}
      interactive={interactive}
      alpha={alpha}
      visible={visible}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerLeave={onPointerLeave}
      onPointerEnter={onPointerEnter}
    >
      {children}
    </pixiContainer>
  );
}
