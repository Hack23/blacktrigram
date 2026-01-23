/**
 * Combat HUD Components Index
 *
 * Exports all HUD components for the combat screen.
 * Following gaming UI best practices:
 * - TopHUD: 70px/55px - Round info, timer, menu
 * - BottomHUD: 120px/100px - Technique bar, controls
 * - LeftHUD: 14%/18% - Player 1 stats
 * - RightHUD: 14%/18% - Player 2/AI stats
 * - Arena: ~72% center
 *
 * @korean 전투화면 HUD 컴포넌트 인덱스
 */

export { CombatTopHUD } from "./CombatTopHUD";
export type { CombatTopHUDProps } from "./CombatTopHUD";

export { CombatBottomHUD } from "./CombatBottomHUD";
export type { CombatBottomHUDProps } from "./CombatBottomHUD";

export { CombatLeftHUD } from "./CombatLeftHUD";
export type { CombatLeftHUDProps } from "./CombatLeftHUD";

export { CombatRightHUD } from "./CombatRightHUD";
export type { CombatRightHUDProps } from "./CombatRightHUD";
