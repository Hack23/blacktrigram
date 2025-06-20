/// <reference types="vite/client" />
/// <reference types="react" />

import type {
  Application,
  Container,
  Graphics,
  Sprite,
  Text,
  TextStyle,
} from "pixi.js";

// Global JSX declarations for PixiJS v8 components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      pixiContainer: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        scale?: number | { x: number; y: number };
        alpha?: number;
        visible?: boolean;
        interactive?: boolean;
        cursor?: string;
        onPointerDown?: () => void;
        onPointerUp?: () => void;
        onPointerOver?: () => void;
        onPointerOut?: () => void;
        onPointerTap?: () => void;
      };
      pixiGraphics: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        draw?: (graphics: Graphics) => void;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        alpha?: number;
        interactive?: boolean;
        cursor?: string;
        onPointerDown?: () => void;
        onPointerUp?: () => void;
        onPointerOver?: () => void;
        onPointerOut?: () => void;
      };
      pixiText: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        text?: string;
        style?: Partial<TextStyle> | TextStyle;
        x?: number;
        y?: number;
        anchor?: number | { x: number; y: number };
        scale?: number | { x: number; y: number };
        alpha?: number;
        interactive?: boolean;
        onPointerDown?: () => void;
        onPointerTap?: () => void;
      };
      pixiSprite: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        texture?: any;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        scale?: number | { x: number; y: number };
        anchor?: number | { x: number; y: number };
        alpha?: number;
        interactive?: boolean;
        onPointerDown?: () => void;
        onPointerTap?: () => void;
      };
    }

    // Fix JSX.Element for React 18
    interface Element
      extends React.ReactElement<React.ComponentProps<any>, any> {}
  }

  // PixiJS v8 global namespace
  namespace PIXI {
    export { Graphics, Container, Text, Sprite, Application, TextStyle };
  }
}

// Declare module for @pixi/react compatibility
declare module "@pixi/react" {
  export * from "@pixi/react/lib/index";
}

// Game asset type declarations
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.wav" {
  const src: string;
  export default src;
}
