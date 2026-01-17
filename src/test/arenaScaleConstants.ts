/**
 * Shared arena scale constants for testing across different device sizes.
 * These values represent the ratio of device arena size to desktop baseline (960px).
 * 
 * @packageDocumentation
 */

/**
 * Mobile arena scale (300px / 960px = 0.3125)
 * Used for phones and small mobile devices
 */
export const MOBILE_ARENA_SCALE = 0.3125;

/**
 * Tablet arena scale (480px / 960px = 0.5)
 * Used for tablets and medium-sized devices
 */
export const TABLET_ARENA_SCALE = 0.5;

/**
 * Desktop arena scale (960px / 960px = 1.0)
 * Used as the baseline for desktop and large displays
 */
export const DESKTOP_ARENA_SCALE = 1.0;
