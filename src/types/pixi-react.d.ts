/// <reference types="pixi.js" />
/// <reference types="react" />

import type {
  Graphics,
  Container as PixiContainer,
  Text as PixiText,
  Sprite,
  Texture,
  DisplayObject,
  FederatedPointerEvent,
  TextStyle,
  Application,
} from "pixi.js";
import type { ReactNode } from "react";

// Type definitions for @pixi/react v8 compatibility
declare module "@pixi/react" {
  import type { ComponentProps } from "react";
  import type * as PIXI from "pixi.js";

  // Core exports
  export function extend(components: Record<string, any>): void;
  export function useExtend(components: Record<string, any>): void;
  export function useApplication(): { app: PIXI.Application };
  export function useTick(
    callback: (delta: number) => void,
    enabled?: boolean | { enabled?: boolean }
  ): void;

  // Application component
  export interface ApplicationProps {
    children?: React.ReactNode;
    width?: number;
    height?: number;
    backgroundColor?: number;
    antialias?: boolean;
    autoStart?: boolean;
    resizeTo?: HTMLElement | React.RefObject<HTMLElement> | Window;
    defaultTextStyle?: Partial<PIXI.TextStyle>;
    extensions?: any[];
    onInit?: (app: PIXI.Application) => void;
  }

  export const Application: React.FC<ApplicationProps>;

  // Pixi component props
  export interface PixiReactElementProps<T> extends ComponentProps<any> {
    ref?: React.Ref<T>;
  }

  // Built-in element types
  export interface PixiElements {
    pixiContainer: PixiReactElementProps<PIXI.Container> &
      Partial<PIXI.Container> & {
        interactive?: boolean;
        onClick?: () => void;
        onPointerDown?: () => void;
        onPointerUp?: () => void;
        onPointerMove?: () => void;
        onPointerEnter?: () => void;
        onPointerLeave?: () => void;
      };
    pixiGraphics: PixiReactElementProps<PIXI.Graphics> &
      Partial<PIXI.Graphics> & {
        draw?: (graphics: PIXI.Graphics) => void;
        interactive?: boolean;
        onClick?: () => void;
        onPointerDown?: () => void;
      };
    pixiText: PixiReactElementProps<PIXI.Text> &
      Partial<PIXI.Text> & {
        text: string;
        style?: Partial<PIXI.TextStyle>;
        anchor?: { x: number; y: number } | number;
      };
    pixiSprite: PixiReactElementProps<PIXI.Sprite> &
      Partial<PIXI.Sprite> & {
        texture?: PIXI.Texture;
        anchor?: { x: number; y: number } | number;
      };
  }
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

export type { PixiReactElementProps } from "@pixi/react";
export {};
