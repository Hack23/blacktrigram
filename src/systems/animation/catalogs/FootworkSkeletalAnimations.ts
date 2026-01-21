/**
 * Korean martial arts footwork animations with skeletal keyframes (보법 애니메이션)
 *
 * Defines realistic footwork animation sequences for all specialized movement patterns:
 * - Circular steps (원형보): Lateral movement while maintaining guard facing
 * - Slide steps (미끄럼보): Both feet move together with no weight transfer
 * - Pivot steps (축족회전): 90° rotations on planted foot
 * - Shuffle step (섞음보): Quick 15cm micro-adjustments
 *
 * All 9 footwork animation variants (4 pattern types: circular, pivot, slide, shuffle)
 * are fully implemented using the MartialArtsAnimationBuilder pattern.
 *
 * @module systems/animation/FootworkSkeletalAnimations
 * @category Animation System
 * @korean 보법애니메이션
 */

import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// CIRCULAR STEP ANIMATIONS (원형보)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CIRCULAR STEP LEFT Animation (원형보 좌)
 * Lateral movement to the left while maintaining forward-facing guard.
 * Distance: 30cm lateral (left), Duration: 300ms
 * @korean 원형보좌애니메이션
 */
export const FOOTWORK_CIRCULAR_LEFT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("footwork_circular_left", "원형보 좌")
    .asMovement(0.3, false)
    .stance()
    .sideStepLeft(0.1, "ease-out")
    .sideStepLeft(0.1, "linear")
    .recover(0.1, "ease-in")
    .build();

/**
 * CIRCULAR STEP RIGHT Animation (원형보 우)
 * Lateral movement to the right while maintaining forward-facing guard.
 * Distance: 30cm lateral (right), Duration: 300ms
 * @korean 원형보우애니메이션
 */
export const FOOTWORK_CIRCULAR_RIGHT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("footwork_circular_right", "원형보 우")
    .asMovement(0.3, false)
    .stance()
    .sideStepRight(0.1, "ease-out")
    .sideStepRight(0.1, "linear")
    .recover(0.1, "ease-in")
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE STEP ANIMATIONS (미끄럼보)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SLIDE FORWARD Animation (미끄럼보 전)
 * Forward sliding step where both feet move together.
 * Distance: 40cm forward, Duration: 200ms
 * @korean 미끄럼보전애니메이션
 */
export const FOOTWORK_SLIDE_FORWARD_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("footwork_slide_forward", "미끄럼보 전")
    .asMovement(0.2, false)
    .stance()
    .forwardStep(0.07, "ease-out")
    .forwardStep(0.06, "linear")
    .recover(0.07, "ease-in")
    .build();

/**
 * SLIDE BACK Animation (미끄럼보 후)
 * Backward sliding step where both feet move together.
 * Distance: 40cm backward, Duration: 200ms
 * @korean 미끄럼보후애니메이션
 */
export const FOOTWORK_SLIDE_BACK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("footwork_slide_back", "미끄럼보 후")
    .asMovement(0.2, false)
    .stance()
    .backwardStep(0.07, "ease-out")
    .backwardStep(0.06, "linear")
    .recover(0.07, "ease-in")
    .build();

/**
 * SLIDE LEFT Animation (미끄럼보 좌)
 * Lateral sliding step to the left.
 * Distance: 30cm lateral (left), Duration: 200ms
 * @korean 미끄럼보좌애니메이션
 */
export const FOOTWORK_SLIDE_LEFT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("footwork_slide_left", "미끄럼보 좌")
    .asMovement(0.2, false)
    .stance()
    .sideStepLeft(0.07, "ease-out")
    .sideStepLeft(0.06, "linear")
    .recover(0.07, "ease-in")
    .build();

/**
 * SLIDE RIGHT Animation (미끄럼보 우)
 * Lateral sliding step to the right.
 * Distance: 30cm lateral (right), Duration: 200ms
 * @korean 미끄럼보우애니메이션
 */
export const FOOTWORK_SLIDE_RIGHT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("footwork_slide_right", "미끄럼보 우")
    .asMovement(0.2, false)
    .stance()
    .sideStepRight(0.07, "ease-out")
    .sideStepRight(0.06, "linear")
    .recover(0.07, "ease-in")
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// PIVOT STEP ANIMATIONS (축족회전)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * PIVOT LEFT Animation (축족회전 좌)
 * 90° rotation to the left on planted right foot.
 * Rotation: 90° counter-clockwise, Duration: 250ms
 * @korean 축족회전좌애니메이션
 */
export const FOOTWORK_PIVOT_LEFT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("footwork_pivot_left", "축족회전 좌")
    .asMovement(0.25, false)
    .stance()
    .rotate(0.08, "ease-out")
    .rotate(0.08, "linear")
    .recover(0.09, "ease-in")
    .build();

/**
 * PIVOT RIGHT Animation (축족회전 우)
 * 90° rotation to the right on planted left foot.
 * Rotation: 90° clockwise, Duration: 250ms
 * @korean 축족회전우애니메이션
 */
export const FOOTWORK_PIVOT_RIGHT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("footwork_pivot_right", "축족회전 우")
    .asMovement(0.25, false)
    .stance()
    .rotate(0.08, "ease-out")
    .rotate(0.08, "linear")
    .recover(0.09, "ease-in")
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SHUFFLE STEP ANIMATION (섞음보)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SHUFFLE STEP Animation (섞음보)
 * Quick micro-adjustments of 15cm for positional fine-tuning.
 * Distance: 15cm (micro-adjustment), Duration: 100ms
 * @korean 섞음보애니메이션
 */
export const FOOTWORK_SHUFFLE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("footwork_shuffle", "섞음보")
    .asMovement(0.1, false)
    .stance()
    .step(0.05, "ease-out")
    .recover(0.05, "ease-in")
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION COLLECTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all footwork animations by name
 * @korean 보법애니메이션맵
 */
export const FOOTWORK_ANIMATIONS = new Map<string, SkeletalAnimation>([
  ["footwork_circular_left", FOOTWORK_CIRCULAR_LEFT_ANIMATION],
  ["footwork_circular_right", FOOTWORK_CIRCULAR_RIGHT_ANIMATION],
  ["footwork_slide_forward", FOOTWORK_SLIDE_FORWARD_ANIMATION],
  ["footwork_slide_back", FOOTWORK_SLIDE_BACK_ANIMATION],
  ["footwork_slide_left", FOOTWORK_SLIDE_LEFT_ANIMATION],
  ["footwork_slide_right", FOOTWORK_SLIDE_RIGHT_ANIMATION],
  ["footwork_pivot_left", FOOTWORK_PIVOT_LEFT_ANIMATION],
  ["footwork_pivot_right", FOOTWORK_PIVOT_RIGHT_ANIMATION],
  ["footwork_shuffle", FOOTWORK_SHUFFLE_ANIMATION],
]);

/**
 * Get footwork animation by name
 * @korean 보법애니메이션가져오기
 */
export function getFootworkAnimation(
  animationName: string
): SkeletalAnimation | undefined {
  return FOOTWORK_ANIMATIONS.get(animationName);
}
