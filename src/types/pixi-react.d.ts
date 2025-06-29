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
  GraphicsContext,
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
} from "@pixi/layout";

import type * as UI from "@pixi/ui";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
//  1.  **Minimal** base-props shared by all PIXI display objects
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

  // Federated pointer events (camelCase variant only – use these in React code)
  onClick?: (e: PIXI.FederatedPointerEvent) => void;
  onPointerDown?: (e: PIXI.FederatedPointerEvent) => void;
  onPointerUp?: (e: PIXI.FederatedPointerEvent) => void;
  onPointerUpOutside?: (e: PIXI.FederatedPointerEvent) => void;
  onPointerOver?: (e: PIXI.FederatedPointerEvent) => void;
  onPointerOut?: (e: PIXI.FederatedPointerEvent) => void;
  onPointerMove?: (e: PIXI.FederatedPointerEvent) => void;
  onPointerTap?: (e: PIXI.FederatedPointerEvent) => void;
  onPointerCancel?: (e: PIXI.FederatedPointerEvent) => void;

  // Test-ids for RTL & Cypress
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
  context?: GraphicsContext;
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
//  Layout (@pixi/layout) - Correct types
// --------------------------------------
export interface LayoutContainerProps
  extends PixiReactElementProps<typeof LayoutContainer> {}
export interface LayoutSpriteProps
  extends PixiReactElementProps<typeof LayoutSprite> {}
export interface LayoutTextProps
  extends PixiReactElementProps<typeof LayoutText> {}
export interface LayoutGraphicsProps
  extends PixiReactElementProps<typeof LayoutGraphics> {}
export interface LayoutTilingSpriteProps
  extends PixiReactElementProps<typeof LayoutTilingSprite> {}
export interface LayoutBitmapTextProps
  extends PixiReactElementProps<typeof LayoutBitmapText> {}
export interface LayoutAnimatedSpriteProps
  extends PixiReactElementProps<typeof LayoutAnimatedSprite> {}
export interface LayoutNineSliceSpriteProps
  extends PixiReactElementProps<typeof LayoutNineSliceSprite> {}
export interface LayoutGifSpriteProps
  extends PixiReactElementProps<typeof LayoutGifSprite> {}
export interface LayoutViewProps
  extends PixiReactElementProps<typeof LayoutView> {}

// --------------------------------------
//  UI (@pixi/ui) – Make props permissive
// --------------------------------------
export type FancyButtonProps = PixiReactElementProps<
  typeof UI.FancyButton,
  true
>;
export type ProgressBarProps = PixiReactElementProps<
  typeof UI.ProgressBar,
  true
>;
export type ScrollBoxProps = PixiReactElementProps<typeof UI.ScrollBox, true>;
export type MaskedFrameProps = PixiReactElementProps<
  typeof UI.MaskedFrame,
  true
>;
export type ButtonProps = PixiReactElementProps<typeof UI.Button, true>;
export type SliderProps = PixiReactElementProps<typeof UI.Slider, true>;
export type InputProps = PixiReactElementProps<typeof UI.Input, true>;
export type CheckBoxProps = PixiReactElementProps<typeof UI.CheckBox, true>;
export type RadioGroupProps = PixiReactElementProps<typeof UI.RadioGroup, true>;
export type SelectProps = PixiReactElementProps<typeof UI.Select, true>;

// ---------------------------------------------------------------------------
//  3.  Global JSX intrinsic-element declarations
// ---------------------------------------------------------------------------
declare module "@pixi/react" {
  /* eslint-disable @typescript-eslint/consistent-type-definitions */
  interface PixiElements {
    /* --- Plain PIXI display-objects (no layout) ------------------------- */
    pixiContainer: ContainerProps;
    pixiSprite: SpriteProps;
    pixiGraphics: GraphicsProps;
    pixiText: TextProps;
    pixiTilingSprite: TilingSpriteProps;
    pixiAnimatedSprite: AnimatedSpriteProps;
    pixiBitmapText: BitmapTextProps;
    pixiParticleContainer: ParticleContainerProps;

    /* --- @pixi/layout COMPONENTS --------------------------------------- */
    layoutContainer: LayoutContainerProps;
    layoutSprite: LayoutSpriteProps;
    layoutTilingSprite: LayoutTilingSpriteProps;
    layoutText: LayoutTextProps;
    layoutBitmapText: LayoutBitmapTextProps;
    layoutAnimatedSprite: LayoutAnimatedSpriteProps;
    layoutGraphics: LayoutGraphicsProps;
    layoutNineSliceSprite: LayoutNineSliceSpriteProps;
    layoutGifSprite: LayoutGifSpriteProps;
    layoutView: LayoutViewProps;

    /* --- @pixi/ui components ------------------------------------------- */
    pixiFancyButton: FancyButtonProps;
    pixiProgressBar: ProgressBarProps;
    pixiScrollBox: ScrollBoxProps;
    pixiMaskedFrame: MaskedFrameProps;
    pixiButton: ButtonProps;
    pixiSlider: SliderProps;
    pixiInput: InputProps;
    pixiCheckBox: CheckBoxProps;
    pixiRadioGroup: RadioGroupProps;
    pixiSelect: SelectProps;
  }
}

// Let React recognise those intrinsic elements, too
declare global {
  namespace JSX {
    interface IntrinsicElements extends import("@pixi/react").PixiElements {}
  }
}
