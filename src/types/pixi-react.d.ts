/// <reference types="pixi.js" />
/// <reference types="react" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // PIXI React v8 automatically provides these after useExtend
      pixiContainer: any;
      pixiGraphics: any;
      pixiSprite: any;
      pixiText: any;
      pixiAnimatedSprite: any;
      pixiTilingSprite: any;
      pixiParticleContainer: any;
      pixiBitmapText: any;
    }
  }
}

// PIXI React v8 module declarations
declare module "@pixi/react" {
  import type { ReactNode } from "react";
  import type * as PIXI from "pixi.js";

  // Application component props (replaces Stage from v7)
  export interface ApplicationProps {
    width?: number;
    height?: number;
    backgroundColor?: number;
    antialias?: boolean;
    autoDensity?: boolean;
    resizeTo?: HTMLElement | Window;
    children?: ReactNode;
  }

  // Main Application component
  export const Application: React.ComponentType<ApplicationProps>;

  // Hooks
  export function useApplication(): { app: PIXI.Application };
  export function useExtend(components: Record<string, any>): void;
  export function useTick(
    callback: (delta: number) => void,
    enabled?: boolean
  ): void;

  // Component creation helper
  export function extend(components: Record<string, any>): void;
}

export {};
