/// <reference types="vite/client" />
/// <reference types="react" />

// Global JSX declarations for PixiJS components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      pixiContainer: any;
      pixiGraphics: any;
      pixiText: any;
      pixiSprite: any;
    }
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
