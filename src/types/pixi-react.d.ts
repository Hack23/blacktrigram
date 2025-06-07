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
  Application as PIXIApplication, // Renamed to avoid conflict
} from "pixi.js";

// PIXI.js React integration type declarations
declare module "@pixi/react" {
  import * as PIXI from "pixi.js";
  import { ComponentType, ReactNode, RefObject } from "react";

  // Application component props (this is the React component, not the PIXI.Application class)
  export interface ApplicationProps {
    width?: number;
    height?: number;
    backgroundColor?: number; // Changed from background
    antialias?: boolean;
    resolution?: number;
    style?: React.CSSProperties; // Added
    children?: ReactNode;
    // Note: ref is handled by React.forwardRef, not as a direct prop
    options?: Partial<PIXI.IApplicationOptions>; // Added to match usage
  }

  // Base PIXI component props
  interface PixiComponentProps {
    x?: number;
    y?: number;
    rotation?: number;
    scale?: number | { x: number; y: number } | [number, number]; // Added [number, number]
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
    onpointertap?: (event: PIXI.FederatedPointerEvent) => void; // Added
    onclick?: (event: PIXI.FederatedPointerEvent) => void; // Added
    pointertap?: (event: PIXI.FederatedPointerEvent) => void; // Added for consistency
    click?: (event: PIXI.FederatedPointerEvent) => void; // Added for consistency
    pointerdown?: (event: PIXI.FederatedPointerEvent) => void;
    pointerup?: (event: PIXI.FederatedPointerEvent) => void;
    pointermove?: (event: PIXI.FederatedPointerEvent) => void;
    pointerover?: (event: PIXI.FederatedPointerEvent) => void;
    pointerout?: (event: PIXI.FederatedPointerEvent) => void;
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
    geometry?: PIXI.GraphicsGeometry; // Added
  }

  // Text component props
  interface TextProps extends PixiComponentProps {
    text: string;
    style?: Partial<PIXI.ITextStyle> | PIXI.TextStyle; // Use ITextStyle for broader compatibility
    anchor?: number | { x: number; y: number } | [number, number]; // Added [number, number]
    resolution?: number;
  }

  // Sprite component props
  interface SpriteProps extends PixiComponentProps {
    texture?: PIXI.Texture | string;
    anchor?: number | { x: number; y: number } | [number, number]; // Added [number, number]
    tint?: number;
    width?: number;
    height?: number;
    image?: string; // Often used for initial texture loading
  }

  // AnimatedSprite component props
  interface AnimatedSpriteProps extends PixiComponentProps {
    textures: PIXI.Texture[] | PIXI.FrameObject[];
    animationSpeed?: number;
    loop?: boolean;
    autoUpdate?: boolean;
    onComplete?: () => void;
    onFrameChange?: (currentFrame: number) => void;
    onLoop?: () => void;
    anchor?: number | { x: number; y: number } | [number, number]; // Added [number, number]
    tint?: number;
    isPlaying?: boolean; // Added
    initialFrame?: number; // Added
    currentFrame?: number; // Added
  }

  // TilingSprite component props
  interface TilingSpriteProps extends PixiComponentProps {
    texture: PIXI.Texture;
    width: number;
    height: number;
    tilePosition?: { x: number; y: number } | PIXI.Point | PIXI.ObservablePoint;
    tileScale?: { x: number; y: number } | PIXI.Point | PIXI.ObservablePoint;
    anchor?: number | { x: number; y: number } | [number, number]; // Added [number, number]
    tint?: number;
    tileTransform?: PIXI.Transform; // Added
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
    anchor?: number | { x: number; y: number } | [number, number]; // Added [number, number]
    tint?: number;
  }

  // Stage component props (Root container for PIXI elements)
  export interface StageProps extends ContainerProps {
    width?: number;
    height?: number;
    options?: Partial<PIXI.IApplicationOptions>;
    raf?: boolean;
    renderOnUpdate?: boolean;
  }

  // Component exports - Application is the React component wrapper
  export const Application: ComponentType<
    ApplicationProps & { children?: ReactNode }
  >; // Ensure children is part of ApplicationProps
  export const Stage: ComponentType<StageProps>; // Added Stage export
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
    callback: (delta: number, ticker: PIXI.Ticker) => void, // Added ticker
    enabled?: boolean,
    render?: boolean // Added
  ): void;
  export function extend(components: Record<string, any>): void;
  export function usePixiApp(): PIXI.Application; // Alias often seen

  // Utility types for refs
  export type ContainerRef = RefObject<PIXI.Container>;
  export type GraphicsRef = RefObject<PIXI.Graphics>;
  export type TextRef = RefObject<PIXI.Text>;
  export type SpriteRef = RefObject<PIXI.Sprite>;

  // For JSX IntrinsicElements
  export interface PixiElements {
    pixiContainer: ContainerProps;
    pixiGraphics: GraphicsProps;
    pixiText: TextProps;
    pixiSprite: SpriteProps;
    pixiAnimatedSprite: AnimatedSpriteProps;
    pixiTilingSprite: TilingSpriteProps;
    pixiNineSliceSprite: NineSliceSpriteProps;
    // Add other components if needed
  }
}

// Extend JSX namespace
declare global {
  namespace JSX {
    interface IntrinsicElements extends import("@pixi/react").PixiElements {
      // Ensure PixiElements are merged correctly
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
