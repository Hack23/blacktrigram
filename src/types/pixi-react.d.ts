/// <reference types="pixi.js" />
/// <reference types="react" />

import type {
  Container,
  Graphics,
  Text,
  Sprite,
  Texture,
  DisplayObject,
  FederatedPointerEvent,
  TextStyle,
  Application,
} from "pixi.js";

// PIXI.js React integration type declarations
declare module "@pixi/react" {
  import { ComponentType, ReactNode, RefObject } from "react";
  import * as PIXI from "pixi.js";

  // Application component props (this is the React component, not the PIXI.Application class)
  export interface ApplicationProps {
    width?: number;
    height?: number;
    backgroundColor?: number;
    antialias?: boolean;
    resolution?: number;
    style?: React.CSSProperties;
    children?: ReactNode;
    // Note: ref is handled by React.forwardRef, not as a direct prop
  }

  // Base PIXI component props
  interface PixiComponentProps {
    x?: number;
    y?: number;
    rotation?: number;
    scale?: number | { x: number; y: number };
    alpha?: number;
    visible?: boolean;
    interactive?: boolean;
    buttonMode?: boolean;
    cursor?: string;
    mask?: PIXI.Container | PIXI.Graphics | PIXI.Sprite;
    filters?: PIXI.Filter[];
    zIndex?: number;
    eventMode?: "none" | "passive" | "auto" | "static" | "dynamic";

    // Event handlers - made optional
    onpointerdown?: (event: PIXI.FederatedPointerEvent) => void;
    onpointerup?: (event: PIXI.FederatedPointerEvent) => void;
    onpointermove?: (event: PIXI.FederatedPointerEvent) => void;
    onpointerover?: (event: PIXI.FederatedPointerEvent) => void;
    onpointerout?: (event: PIXI.FederatedPointerEvent) => void;
    onpointertap?: (event: PIXI.FederatedPointerEvent) => void;
    onclick?: (event: PIXI.FederatedPointerEvent) => void;
  }

  // Container component props
  interface ContainerProps extends PixiComponentProps {
    children?: React.ReactNode;
    sortableChildren?: boolean;
    interactiveChildren?: boolean;
  }

  // Graphics component props
  interface GraphicsProps extends PixiComponentProps {
    draw: (graphics: PIXI.Graphics) => void;
    clear?: boolean;
  }

  // Text component props
  interface TextProps extends PixiComponentProps {
    text: string;
    style?: Partial<PIXI.TextStyle> | PIXI.TextStyle;
    anchor?: number | { x: number; y: number };
    resolution?: number;
  }

  // Sprite component props
  interface SpriteProps extends PixiComponentProps {
    texture?: PIXI.Texture | string;
    anchor?: number | { x: number; y: number };
    tint?: number;
    width?: number;
    height?: number;
    image?: string;
  }

  // AnimatedSprite component props
  interface AnimatedSpriteProps extends PixiComponentProps {
    textures: PIXI.Texture[];
    animationSpeed?: number;
    loop?: boolean;
    autoUpdate?: boolean;
    onComplete?: () => void;
    onFrameChange?: (currentFrame: number) => void;
    onLoop?: () => void;
    anchor?: number | { x: number; y: number };
    tint?: number;
  }

  // TilingSprite component props
  interface TilingSpriteProps extends PixiComponentProps {
    texture: PIXI.Texture;
    width: number;
    height: number;
    tilePosition?: { x: number; y: number };
    tileScale?: { x: number; y: number };
    anchor?: number | { x: number; y: number };
    tint?: number;
  }

  // NineSliceSprite component props
  interface NineSliceSpriteProps extends PixiComponentProps {
    texture: PIXI.Texture;
    leftWidth?: number;
    topHeight?: number;
    rightWidth?: number;
    bottomHeight?: number;
    width?: number;
    height?: number;
    anchor?: number | { x: number; y: number };
    tint?: number;
  }

  // Component exports - Application is the React component wrapper
  export const Application: ComponentType<ApplicationProps>;
  export const Container: ComponentType<ContainerProps>;
  export const Graphics: ComponentType<GraphicsProps>;
  export const Text: ComponentType<TextProps>;
  export const Sprite: ComponentType<SpriteProps>;
  export const AnimatedSprite: React.ComponentType<AnimatedSpriteProps>;
  export const TilingSprite: React.ComponentType<TilingSpriteProps>;
  export const NineSliceSprite: React.ComponentType<NineSliceSpriteProps>;

  // Hooks
  export function useApp(): PIXI.Application;
  export function useTick(
    callback: (delta: number) => void,
    enabled?: boolean
  ): void;
  export function extend(components: Record<string, any>): void;

  // Utility types for refs
  export type ContainerRef = RefObject<PIXI.Container>;
  export type GraphicsRef = RefObject<PIXI.Graphics>;
  export type TextRef = RefObject<PIXI.Text>;
  export type SpriteRef = RefObject<PIXI.Sprite>;
}

// Extend JSX namespace
declare global {
  namespace JSX {
    interface IntrinsicElements {
      pixiContainer: import("@pixi/react").PixiElements["pixiContainer"];
      pixiGraphics: import("@pixi/react").PixiElements["pixiGraphics"];
      pixiText: import("@pixi/react").PixiElements["pixiText"];
      pixiSprite: import("@pixi/react").PixiElements["pixiSprite"];
    }
  }
}

// Global PIXI namespace augmentation
declare global {
  namespace PIXI {
    // Ensure PIXI types are available globally
    // The existing FederatedPointerEvent definition seems fine, just ensure it's correctly picked up.
    // If PIXI's own types are not being found, you might need to ensure @types/pixi.js is installed and configured.
  }
}

export {}; // Ensures this is treated as a module
