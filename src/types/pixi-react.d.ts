/// <reference types="pixi.js" />
/// <reference types="react" />
/// <reference types="@pixi/ui" />
/// <reference types="@pixi/layout" />

import type * as UI from "@pixi/ui";
import type * as PIXI from "pixi.js";
import type { ReactNode } from "react";

// Layout mixin properties from @pixi/layout
interface LayoutMixinProps {
  layout?: {
    width?: number | string;
    height?: number | string;
    x?: number | string;
    y?: number | string;
    position?: "relative" | "absolute";
    display?: "flex" | "block" | "none";
    flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
    justifyContent?:
      | "flex-start"
      | "flex-end"
      | "center"
      | "space-between"
      | "space-around"
      | "space-evenly";
    alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
    alignSelf?:
      | "auto"
      | "flex-start"
      | "flex-end"
      | "center"
      | "stretch"
      | "baseline";
    flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: number | string;
    gap?: number;
    padding?:
      | number
      | { top?: number; right?: number; bottom?: number; left?: number };
    margin?:
      | number
      | { top?: number; right?: number; bottom?: number; left?: number };
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    backgroundColor?: number | string;
    borderRadius?: number;
    overflow?: "hidden" | "visible" | "scroll";
    zIndex?: number;
    maxWidth?: number | string;
    maxHeight?: number | string;
    minWidth?: number | string;
    minHeight?: number | string;
  };
}

// Base props that all PIXI display objects share
interface BasePixiProps<T extends PIXI.Container> extends LayoutMixinProps {
  key?: React.Key;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  alpha?: number;
  angle?: number;
  pivot?: PIXI.PointData | [number, number];
  position?: PIXI.PointData | [number, number];
  rotation?: number;
  scale?: PIXI.PointData | [number, number] | number;
  skew?: PIXI.PointData | [number, number];
  visible?: boolean;
  interactive?: boolean;
  interactiveChildren?: boolean;
  cursor?: string;
  hitArea?: PIXI.IHitArea;
  tint?: number;
  zIndex?: number;
  name?: string;
  accessible?: boolean;
  accessibleTitle?: string;
  accessibleHint?: string;
  ref?: React.Ref<T>;
  children?: ReactNode;

  // Event handlers - Both camelCase and lowercase versions for compatibility
  // CamelCase versions (commonly used in React)
  onClick?: (event: PIXI.FederatedPointerEvent) => void;
  onPointerDown?: (event: PIXI.FederatedPointerEvent) => void;
  onPointerUp?: (event: PIXI.FederatedPointerEvent) => void;
  onPointerUpOutside?: (event: PIXI.FederatedPointerEvent) => void;
  onPointerOver?: (event: PIXI.FederatedPointerEvent) => void;
  onPointerOut?: (event: PIXI.FederatedPointerEvent) => void;
  onPointerMove?: (event: PIXI.FederatedPointerEvent) => void;
  onPointerTap?: (event: PIXI.FederatedPointerEvent) => void;
  onRightClick?: (event: PIXI.FederatedPointerEvent) => void;
  onRightDown?: (event: PIXI.FederatedPointerEvent) => void;
  onRightUp?: (event: PIXI.FederatedPointerEvent) => void;
  onRightUpOutside?: (event: PIXI.FederatedPointerEvent) => void;
  onWheel?: (event: PIXI.FederatedWheelEvent) => void;

  // Lowercase versions (PIXI native style)
  onclick?: (event: PIXI.FederatedPointerEvent) => void;
  onpointerdown?: (event: PIXI.FederatedPointerEvent) => void;
  onpointerup?: (event: PIXI.FederatedPointerEvent) => void;
  onpointerupoutside?: (event: PIXI.FederatedPointerEvent) => void;
  onpointerover?: (event: PIXI.FederatedPointerEvent) => void;
  onpointerout?: (event: PIXI.FederatedPointerEvent) => void;
  onpointermove?: (event: PIXI.FederatedPointerEvent) => void;
  onpointertap?: (event: PIXI.FederatedPointerEvent) => void;
  onrightclick?: (event: PIXI.FederatedPointerEvent) => void;
  onrightdown?: (event: PIXI.FederatedPointerEvent) => void;
  onrightup?: (event: PIXI.FederatedPointerEvent) => void;
  onrightupoutside?: (event: PIXI.FederatedPointerEvent) => void;
  onwheel?: (event: PIXI.FederatedWheelEvent) => void;

  // Test data attributes
  "data-testid"?: string;
}

// Container-specific props
interface ContainerProps extends BasePixiProps<PIXI.Container> {
  sortableChildren?: boolean;
  sortChildren?: () => void;
}

// Graphics-specific props
interface GraphicsProps extends BasePixiProps<PIXI.Graphics> {
  blendMode?: PIXI.BLEND_MODES;
  tint?: number;
  fill?: PIXI.FillStyleInputs;
  stroke?: PIXI.StrokeStyleInputs;
  draw?: (graphics: PIXI.Graphics) => void;
}

// Sprite-specific props
interface SpriteProps extends BasePixiProps<PIXI.Sprite> {
  texture?: PIXI.Texture | string;
  anchor?: PIXI.PointData | [number, number] | number;
  blendMode?: PIXI.BLEND_MODES;
  roundPixels?: boolean;
}

// Text-specific props
interface TextProps extends BasePixiProps<PIXI.Text> {
  text?: string;
  style?: Partial<PIXI.TextStyle | PIXI.TextStyleOptions>;
  anchor?: PIXI.PointData | [number, number] | number;
  resolution?: number;
}

// AnimatedSprite-specific props
interface AnimatedSpriteProps extends BasePixiProps<PIXI.AnimatedSprite> {
  textures?: PIXI.Texture[] | PIXI.FrameObject[];
  autoPlay?: boolean;
  animationSpeed?: number;
  loop?: boolean;
  anchor?: PIXI.PointData | [number, number] | number;
  blendMode?: PIXI.BLEND_MODES;
  onComplete?: () => void;
  onFrameChange?: (currentFrame: number) => void;
  onLoop?: () => void;
}

// TilingSprite-specific props
interface TilingSpriteProps extends BasePixiProps<PIXI.TilingSprite> {
  texture?: PIXI.Texture | string;
  width: number;
  height: number;
  tileScale?: PIXI.PointData | [number, number];
  tilePosition?: PIXI.PointData | [number, number];
  anchor?: PIXI.PointData | [number, number] | number;
  blendMode?: PIXI.BLEND_MODES;
}

// ParticleContainer-specific props
interface ParticleContainerProps extends BasePixiProps<PIXI.ParticleContainer> {
  maxSize?: number;
  properties?: {
    vertices?: boolean;
    position?: boolean;
    rotation?: boolean;
    uvs?: boolean;
    tint?: boolean;
  };
  batchSize?: number;
  autoResize?: boolean;
}

// BitmapText-specific props
interface BitmapTextProps extends BasePixiProps<PIXI.BitmapText> {
  text?: string;
  fontName?: string;
  fontSize?: number;
  tint?: number;
  align?: "left" | "center" | "right";
  letterSpacing?: number;
  maxWidth?: number;
  anchor?: PIXI.PointData | [number, number] | number;
}

// UI Component Props
interface FancyButtonProps extends BasePixiProps<UI.FancyButton> {
  defaultView?: string | PIXI.Container;
  hoverView?: string | PIXI.Container;
  pressedView?: string | PIXI.Container;
  disabledView?: string | PIXI.Container;
  text?: string;
  textStyle?: Partial<PIXI.TextStyle>;
  padding?: number;
  anchorX?: number;
  anchorY?: number;
  scale?: number;
  defaultTextScale?: number;
  hoverTextScale?: number;
  pressedTextScale?: number;
  disabledTextScale?: number;
  defaultTextOffset?: { x?: number; y?: number };
  hoverTextOffset?: { x?: number; y?: number };
  pressedTextOffset?: { x?: number; y?: number };
  disabledTextOffset?: { x?: number; y?: number };
  animations?: UI.ButtonAnimations;
  onPress?: () => void;
  onHover?: () => void;
  onOut?: () => void;
  onDown?: () => void;
  onUp?: () => void;
}

interface ButtonProps extends BasePixiProps<UI.Button> {
  onPress?: () => void;
  onDown?: () => void;
  onUp?: () => void;
  onHover?: () => void;
  onOut?: () => void;
  onUpOut?: () => void;
}

interface ScrollBoxProps extends BasePixiProps<UI.ScrollBox> {
  width: number;
  height: number;
  items?: PIXI.Container[];
  background?: number | string | PIXI.Container;
  radius?: number;
  elementsMargin?: number;
  vertPadding?: number;
  horPadding?: number;
  padding?: number;
  disableDynamicRendering?: boolean;
  globalScroll?: boolean;
  shiftScroll?: boolean;
  proximityRange?: number;
  proximityDebounce?: number;
  dragTrashHold?: number;
  type?: "vertical" | "horizontal";
  overflow?: "hidden" | "scroll";
}

interface ProgressBarProps extends BasePixiProps<UI.ProgressBar> {
  bg?: string | PIXI.Container;
  fill?: string | PIXI.Container;
  fillPadding?: { x?: number; y?: number };
  progress?: number;
  animated?: boolean;
  animationSpeed?: number;
}

interface RadioGroupProps extends BasePixiProps<UI.RadioGroup> {
  items?: UI.RadioBoxOptions[];
  type?: "vertical" | "horizontal";
  elementsMargin?: number;
  selectedItem?: number;
  onChange?: (selectedItemID: number, selectedVal: string) => void;
}

interface CheckBoxProps extends BasePixiProps<UI.CheckBox> {
  checked?: boolean;
  text?: string;
  textStyle?: Partial<PIXI.TextStyle>;
  checkView?: string | PIXI.Container;
  checkHoverView?: string | PIXI.Container;
  checkPressedView?: string | PIXI.Container;
  checkDisabledView?: string | PIXI.Container;
  uncheckedView?: string | PIXI.Container;
  uncheckedHoverView?: string | PIXI.Container;
  uncheckedPressedView?: string | PIXI.Container;
  uncheckedDisabledView?: string | PIXI.Container;
  onChange?: (checked: boolean) => void;
}

interface InputProps extends BasePixiProps<UI.Input> {
  bg?: string | PIXI.Container;
  textStyle?: Partial<PIXI.TextStyle>;
  placeholder?: string;
  value?: string;
  maxLength?: number;
  align?: "left" | "center" | "right";
  padding?: { top?: number; right?: number; bottom?: number; left?: number };
  cleanOnFocus?: boolean;
  onEnter?: (text: string) => void;
  onChange?: (text: string) => void;
}

interface SliderProps extends BasePixiProps<UI.Slider> {
  bg?: string | PIXI.Container;
  fill?: string | PIXI.Container;
  slider?: string | PIXI.Container;
  min?: number;
  max?: number;
  value?: number;
  step?: number;
  onUpdate?: (value: number) => void;
}

interface ListProps extends BasePixiProps<UI.List> {
  items?: PIXI.Container[];
  type?: "vertical" | "horizontal";
  elementsMargin?: number;
  padding?: number;
  vertPadding?: number;
  horPadding?: number;
  topPadding?: number;
  bottomPadding?: number;
  leftPadding?: number;
  rightPadding?: number;
}

interface MaskedFrameProps extends BasePixiProps<UI.MaskedFrame> {
  target?: PIXI.Container;
  mask?: string | PIXI.Container;
  borderWidth?: number;
  padding?: number;
}

// PIXI React v8 module declarations
declare module "@pixi/react" {
  import type * as PIXI from "pixi.js";
  import type { ReactNode } from "react";

  // Type helper for extended components
  export type PixiReactElementProps<T> = T extends new (
    ...args: any[]
  ) => infer Instance
    ? Instance extends PIXI.Container
      ? ContainerProps
      : Instance extends PIXI.Graphics
      ? GraphicsProps
      : Instance extends PIXI.Sprite
      ? SpriteProps
      : Instance extends PIXI.Text
      ? TextProps
      : Instance extends UI.FancyButton
      ? FancyButtonProps
      : Instance extends UI.Button
      ? ButtonProps
      : Instance extends UI.ScrollBox
      ? ScrollBoxProps
      : Instance extends UI.ProgressBar
      ? ProgressBarProps
      : Instance extends UI.RadioGroup
      ? RadioGroupProps
      : Instance extends UI.CheckBox
      ? CheckBoxProps
      : Instance extends UI.Input
      ? InputProps
      : Instance extends UI.Slider
      ? SliderProps
      : Instance extends UI.List
      ? ListProps
      : Instance extends UI.MaskedFrame
      ? MaskedFrameProps
      : BasePixiProps<
          Instance extends PIXI.Container ? Instance : PIXI.Container
        >
    : never;

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

  // Define the available elements after extension
  interface PixiElements {
    pixiContainer: ContainerProps;
    pixiGraphics: GraphicsProps;
    pixiSprite: SpriteProps;
    pixiText: TextProps;
    pixiAnimatedSprite: AnimatedSpriteProps;
    pixiTilingSprite: TilingSpriteProps;
    pixiParticleContainer: ParticleContainerProps;
    pixiBitmapText: BitmapTextProps;
    pixiFancyButton: FancyButtonProps;
    pixiButton: ButtonProps;
    pixiScrollBox: ScrollBoxProps;
    pixiProgressBar: ProgressBarProps;
    pixiRadioGroup: RadioGroupProps;
    pixiCheckBox: CheckBoxProps;
    pixiInput: InputProps;
    pixiSlider: SliderProps;
    pixiList: ListProps;
    pixiMaskedFrame: MaskedFrameProps;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends PixiElements {}
  }
}

// Export types for use in other files
export type {
  AnimatedSpriteProps,
  BasePixiProps,
  BitmapTextProps,
  ButtonProps,
  CheckBoxProps,
  ContainerProps,
  FancyButtonProps,
  GraphicsProps,
  InputProps,
  LayoutMixinProps,
  ListProps,
  MaskedFrameProps,
  ParticleContainerProps,
  ProgressBarProps,
  RadioGroupProps,
  ScrollBoxProps,
  SliderProps,
  SpriteProps,
  TextProps,
  TilingSpriteProps,
};

export {};
