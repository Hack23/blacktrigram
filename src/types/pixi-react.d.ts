/// <reference types="pixi.js" />
/// <reference types="react" />
/// <reference types="@pixi/ui" />
/// <reference types="@pixi/layout" />

// Only declare the module for react-reconciler constants fix
declare module "react-reconciler/constants" {
  export * from "react-reconciler/constants.js";
}


import type * as Layout from "@pixi/layout";
import "@pixi/react";
import type { PixiReactElementProps } from "@pixi/react";
import type * as UI from "@pixi/ui";
import type * as PIXI from "pixi.js";

// ---------------------------------------------------------------------------
// 1. Prop types inferred directly from Pixi.js classes
//    This replaces the manual BasePixiProps and component-specific interfaces.
// ---------------------------------------------------------------------------

/* --- Plain PIXI.js DisplayObjects ---------------------------------------- */
export type ContainerProps = PixiReactElementProps<typeof PIXI.Container>;
export type SpriteProps = PixiReactElementProps<typeof PIXI.Sprite>;
export type GraphicsProps = PixiReactElementProps<typeof PIXI.Graphics>;
export type TextProps = PixiReactElementProps<typeof PIXI.Text>;
export type TilingSpriteProps = PixiReactElementProps<typeof PIXI.TilingSprite>;
export type AnimatedSpriteProps = PixiReactElementProps<
  typeof PIXI.AnimatedSprite
>;
export type BitmapTextProps = PixiReactElementProps<typeof PIXI.BitmapText>;
export type ParticleContainerProps = PixiReactElementProps<
  typeof PIXI.ParticleContainer
>;

/* --- @pixi/layout Components --------------------------------------------- */
export type LayoutContainerProps = PixiReactElementProps<
  typeof Layout.LayoutContainer
>;
export type LayoutSpriteProps = PixiReactElementProps<
  typeof Layout.LayoutSprite
>;
export type LayoutTextProps = PixiReactElementProps<typeof Layout.LayoutText>;
export type LayoutGraphicsProps = PixiReactElementProps<
  typeof Layout.LayoutGraphics
>;
export type LayoutTilingSpriteProps = PixiReactElementProps<
  typeof Layout.LayoutTilingSprite
>;
export type LayoutAnimatedSpriteProps = PixiReactElementProps<
  typeof Layout.LayoutAnimatedSprite
>;
// Add any other @pixi/layout components you use here...

/* --- @pixi/ui Components (using permissive props) ------------------------ */
export type ButtonProps = PixiReactElementProps<typeof UI.Button, true>;
export type FancyButtonProps = PixiReactElementProps<
  typeof UI.FancyButton,
  true
>;
export type ProgressBarProps = PixiReactElementProps<
  typeof UI.ProgressBar,
  true
>;
export type ScrollBoxProps = PixiReactElementProps<typeof UI.ScrollBox, true>;
export type InputProps = PixiReactElementProps<typeof UI.Input, true>;
export type SliderProps = PixiReactElementProps<typeof UI.Slider, true>;
export type CheckBoxProps = PixiReactElementProps<typeof UI.CheckBox, true>;
export type RadioGroupProps = PixiReactElementProps<typeof UI.RadioGroup, true>;
export type SelectProps = PixiReactElementProps<typeof UI.Select, true>;
export type MaskedFrameProps = PixiReactElementProps<
  typeof UI.MaskedFrame,
  true
>;

// ---------------------------------------------------------------------------
// 2. Augment the @pixi/react module to add our JSX intrinsic elements
// ---------------------------------------------------------------------------
declare module "@pixi/react" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface PixiElements {
    /* --- Plain PIXI display-objects ------------------------------------ */
    pixiContainer: ContainerProps;
    pixiSprite: SpriteProps;
    pixiGraphics: GraphicsProps;
    pixiText: TextProps;
    pixiTilingSprite: TilingSpriteProps;
    pixiAnimatedSprite: AnimatedSpriteProps;
    pixiBitmapText: BitmapTextProps;
    pixiParticleContainer: ParticleContainerProps;

    /* --- @pixi/layout components --------------------------------------- */
    layoutContainer: LayoutContainerProps;
    layoutSprite: LayoutSpriteProps;
    layoutTilingSprite: LayoutTilingSpriteProps;
    layoutText: LayoutTextProps;
    layoutAnimatedSprite: LayoutAnimatedSpriteProps;
    layoutGraphics: LayoutGraphicsProps;

    /* --- @pixi/ui components ------------------------------------------- */
    pixiButton: ButtonProps;
    pixiFancyButton: FancyButtonProps;
    pixiProgressBar: ProgressBarProps;
    pixiScrollBox: ScrollBoxProps;
    pixiInput: InputProps;
    pixiSlider: SliderProps;
    pixiCheckBox: CheckBoxProps;
    pixiRadioGroup: RadioGroupProps;
    pixiSelect: SelectProps;
    pixiMaskedFrame: MaskedFrameProps;
  }
}

// ---------------------------------------------------------------------------
// 3. Augment the global JSX namespace to make TypeScript recognize the elements
// ---------------------------------------------------------------------------
declare global {
  namespace JSX {
    interface IntrinsicElements extends import("@pixi/react").PixiElements {}
  }
}
