/// <reference types="pixi.js" />
/// <reference types="react" />
/// <reference types="@pixi/ui" />
/// <reference types="@pixi/layout" />

import "@pixi/react";
import type { PixiReactElementProps } from "@pixi/react";

import type {
  AnimatedSprite,
  BitmapText,
  Container,
  Graphics,
  ParticleContainer,
  Sprite,
  Text,
  TilingSprite,
} from "pixi.js";

import type {
  LayoutAnimatedSprite,
  LayoutBitmapText,
  LayoutContainer,
  LayoutGifSprite,
  LayoutGraphics,
  LayoutNineSliceSprite,
  LayoutSprite,
  LayoutText,
  LayoutTilingSprite,
  LayoutView,
} from "@pixi/layout/components";

import type * as UI from "@pixi/ui";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
//  1.  **Minimal** base-props shared by all PIXI display objects
//      (no `layout:` prop any more – that is handled by the layout components
//       themselves)
// ---------------------------------------------------------------------------
interface BasePixiProps<T extends PIXI.Container> {
  key?: React.Key;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  alpha?: number;
  angle?: number;
  position?: PIXI.IPointData | [number, number];
  pivot?: PIXI.IPointData | [number, number];
  rotation?: number;
  scale?: PIXI.IPointData | [number, number] | number;
  skew?: PIXI.IPointData | [number, number];
  visible?: boolean;
  interactive?: boolean;
  interactiveChildren?: boolean;
  cursor?: string;
  zIndex?: number;
  name?: string;
  ref?: React.Ref<T>;
  children?: ReactNode;

  //  Federated pointer events (camelCase variant only – use these in React code)
  onClick?: (e: PIXI.FederatedPointerEvent) => void;
  onPointerDown?: (e: PIXI.FederatedPointerEvent) => void;
  onPointerUp?: (e: PIXI.FederatedPointerEvent) => void;
  onPointerUpOutside?: (e: PIXI.FederatedPointerEvent) => void;
  onPointerOver?: (e: PIXI.FederatedPointerEvent) => void;
  onPointerOut?: (e: PIXI.FederatedPointerEvent) => void;
  onPointerMove?: (e: PIXI.FederatedPointerEvent) => void;

  //  Test-ids for RTL & Cypress
  "data-testid"?: string;
}

// ---------------------------------------------------------------------------
//  2.  Component-specific prop helpers (only the stuff we _really_ use)
// ---------------------------------------------------------------------------
export interface ContainerProps extends BasePixiProps<Container> {}
export interface SpriteProps extends BasePixiProps<Sprite> {
  texture?: PIXI.Texture | string;
  anchor?: PIXI.IPointData | [number, number] | number;
}
export interface TextProps extends BasePixiProps<Text> {
  text?: string;
  style?: Partial<PIXI.TextStyle | PIXI.TextStyleOptions>;
  anchor?: PIXI.IPointData | [number, number] | number;
}
export interface GraphicsProps extends BasePixiProps<Graphics> {
  draw?: (g: Graphics) => void;
}
export interface TilingSpriteProps extends BasePixiProps<TilingSprite> {
  texture?: PIXI.Texture | string;
  width: number;
  height: number;
}
export interface AnimatedSpriteProps extends BasePixiProps<AnimatedSprite> {
  textures?: PIXI.Texture[] | PIXI.FrameObject[];
  animationSpeed?: number;
  loop?: boolean;
}
export interface BitmapTextProps extends BasePixiProps<BitmapText> {
  text?: string;
  fontName?: string;
  fontSize?: number;
}
export interface ParticleContainerProps
  extends BasePixiProps<ParticleContainer> {
  maxSize?: number;
}

// --------------------------------------
//  UI (@pixi/ui) – only two we actually use
// --------------------------------------
export interface FancyButtonProps extends BasePixiProps<UI.FancyButton> {
  defaultView?: string | PIXI.DisplayObject;
  hoverView?: string | PIXI.DisplayObject;
  pressedView?: string | PIXI.DisplayObject;
  text?: string;
  onPress?: () => void;
}
export interface ProgressBarProps extends BasePixiProps<UI.ProgressBar> {
  progress?: number;
}

// ---------------------------------------------------------------------------
//  3.  Global JSX intrinsic-element declarations
//      Only _layout aware_ components + a handful of plain PIXI classes
// ---------------------------------------------------------------------------
declare module "@pixi/react" {
  /* eslint-disable @typescript-eslint/consistent-type-definitions */
  interface PixiElements {
    /* --- Plain PIXI display-objects (no layout) ------------------------- */
    pixiContainer: PixiReactElementProps<typeof Container>;
    pixiSprite: PixiReactElementProps<typeof Sprite>;
    pixiGraphics: PixiReactElementProps<typeof Graphics>;
    pixiText: PixiReactElementProps<typeof Text>;
    pixiTilingSprite: PixiReactElementProps<typeof TilingSprite>;
    pixiAnimatedSprite: PixiReactElementProps<typeof AnimatedSprite>;

    /* --- @pixi/layout COMPONENTS --------------------------------------- */
    pixiLayoutContainer: PixiReactElementProps<typeof LayoutContainer>;
    layoutSprite: PixiReactElementProps<typeof LayoutSprite>;
    layoutTilingSprite: PixiReactElementProps<typeof LayoutTilingSprite>;
    layoutText: PixiReactElementProps<typeof LayoutText>;
    layoutBitmapText: PixiReactElementProps<typeof LayoutBitmapText>;
    layoutAnimatedSprite: PixiReactElementProps<typeof LayoutAnimatedSprite>;
    layoutGraphics: PixiReactElementProps<typeof LayoutGraphics>;
    layoutNineSliceSprite: PixiReactElementProps<typeof LayoutNineSliceSprite>;
    layoutGifSprite: PixiReactElementProps<typeof LayoutGifSprite>;
    layoutView: PixiReactElementProps<typeof LayoutView>;

    /* --- @pixi/ui shortcuts (optional – use rarely) -------------------- */
    pixiFancyButton: PixiReactElementProps<typeof UI.FancyButton>;
    pixiProgressBar: PixiReactElementProps<typeof UI.ProgressBar>;
  }
}

// Let React recognise those intrinsic elements, too
declare global {
  namespace JSX {
    interface IntrinsicElements extends import("@pixi/react").PixiElements {}
  }
}
