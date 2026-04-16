/**
 * Shared constants for orientation-aware responsive layout.
 *
 * Extracted so that `useCombatLayout` and `useTrainingLayout` compute the
 * same portrait "bottom band" and share a single source of truth for the
 * portrait-forcing hysteresis and the reserved control-column heights.
 *
 * 반응형 레이아웃 상수
 *
 * @module utils/responsiveOrientationConstants
 * @category Layout
 */

/**
 * Hysteresis factor for portrait detection.
 *
 * A viewport is treated as portrait when `height > width × FACTOR`. The
 * factor is &lt; 1.0 so near-square viewports (e.g. `1024×1000`) settle into
 * one orientation and don't flap on every pixel of resize.
 *
 * @public
 */
export const PORTRAIT_HYSTERESIS_FACTOR = 0.9;

/**
 * Maximum width at which a portrait viewport is force-promoted to the mobile
 * layout branch even if the user-agent reports a desktop browser. Matches the
 * tablet breakpoint used elsewhere in the codebase (1024px).
 *
 * This makes devtools emulation of a rotated phone/tablet behave identically
 * to a real device.
 *
 * @public
 */
export const PORTRAIT_FORCE_MAX_WIDTH_PX = 1024;

/**
 * Height reserved at the bottom of a mobile portrait viewport for the
 * on-screen virtual controls (D-Pad + action buttons rendered by
 * `MobileControlsWrapper`). Used as a conservative upper bound so the
 * 3D arena never ends up drawn behind the controls.
 *
 * Two values are provided so that very small phones (iPhone SE class,
 * width &lt; 380) can still fit a playable arena.
 *
 * Combat uses the larger 200/160 band because its Mobile controls stack
 * D-Pad + action buttons + the persistent technique bar. Training uses
 * the smaller 180/140 band because its on-screen controls are lighter.
 *
 * @public
 */
export const MOBILE_CONTROLS_RESERVED_HEIGHT_PX = {
  /** D-Pad + action buttons + technique bar on combat (standard phones) */
  combatStandard: 200,
  /** Combat controls on extra-small phones (width &lt; 380) */
  combatExtraSmall: 160,
  /** Training on-screen controls (standard phones) */
  trainingStandard: 180,
  /** Training on-screen controls (extra-small phones) */
  trainingExtraSmall: 140,
} as const;

/**
 * Total bottom clearance to reserve in portrait mode = control/technique
 * bar height + footer height + the on-screen virtual controls band.
 *
 * @param controlsHeight - layout constant for technique/control bar
 * @param footerHeight - layout constant for footer
 * @param isExtraSmall - true when the viewport is &lt; 380px wide
 * @param variant - "combat" or "training" (differs in control band size)
 *
 * @public
 */
export function portraitMobileControlsBottomBand(
  controlsHeight: number,
  footerHeight: number,
  isExtraSmall: boolean,
  variant: "combat" | "training",
): number {
  const band =
    variant === "combat"
      ? isExtraSmall
        ? MOBILE_CONTROLS_RESERVED_HEIGHT_PX.combatExtraSmall
        : MOBILE_CONTROLS_RESERVED_HEIGHT_PX.combatStandard
      : isExtraSmall
        ? MOBILE_CONTROLS_RESERVED_HEIGHT_PX.trainingExtraSmall
        : MOBILE_CONTROLS_RESERVED_HEIGHT_PX.trainingStandard;

  return controlsHeight + footerHeight + band;
}
