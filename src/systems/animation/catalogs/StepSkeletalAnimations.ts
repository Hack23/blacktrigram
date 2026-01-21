/**
 * Korean martial arts step movement animations with skeletal keyframes
 *
 * Defines realistic tactical step animation sequences for precise footwork
 * with 30cm distance, 300ms duration, and guard maintenance.
 *
 * All step animations are implemented using the MartialArtsAnimationBuilder pattern.
 *
 * @module systems/animation/StepSkeletalAnimations
 * @category Animation System
 * @korean 발걸음애니메이션
 */

import type { SkeletalAnimation } from "@/types/skeletal";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";

/**
 * FORWARD STEP Animation (전진보법)
 *
 * Tactical forward step with weight transfer and guard maintenance.
 *
 * Animation phases:
 * 1. Preparation (0-0.1s): Weight shifts to back foot, crouch slightly
 * 2. Movement (0.1-0.2s): Front foot lifts and extends forward
 * 3. Landing (0.2-0.25s): Front foot plants, weight transfers forward
 * 4. Stabilization (0.25-0.3s): Back foot follows, body straightens
 *
 * Distance: 30cm forward
 * Duration: 300ms
 * Guard: Maintained throughout
 *
 * @korean 전진보법애니메이션
 */
export const STEP_FORWARD_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("step_forward", "전진보법")
    .asMovement(0.3, false)
    .stance()
    .forwardStep(0.12, "ease-out")
    .forwardStep(0.1, "linear")
    .recover(0.08, "ease-in")
    .build();

/**
 * BACKWARD STEP Animation (후진보법)
 *
 * Tactical backward step for defensive retreat while maintaining guard.
 *
 * Animation phases:
 * 1. Preparation (0-0.1s): Weight shifts to front foot
 * 2. Movement (0.1-0.2s): Back foot lifts and extends backward
 * 3. Landing (0.2-0.25s): Back foot plants, weight transfers
 * 4. Stabilization (0.25-0.3s): Front foot follows, guard maintained
 *
 * Distance: 30cm backward
 * Duration: 300ms
 * Guard: Maintained throughout
 *
 * @korean 후진보법애니메이션
 */
export const STEP_BACK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("step_back", "후진보법")
    .asMovement(0.3, false)
    .stance()
    .backwardStep(0.12, "ease-out")
    .backwardStep(0.1, "linear")
    .recover(0.08, "ease-in")
    .build();

/**
 * STEP LEFT Animation (좌측보법)
 *
 * Lateral step to the left while maintaining forward-facing guard.
 *
 * Animation phases:
 * 1. Preparation (0-0.1s): Weight shifts to right foot
 * 2. Movement (0.1-0.2s): Left foot lifts and extends laterally
 * 3. Landing (0.2-0.25s): Left foot plants, weight transfers
 * 4. Stabilization (0.25-0.3s): Right foot follows, stance width maintained
 *
 * Distance: 30cm lateral (left)
 * Duration: 300ms
 * Guard: Maintained forward-facing
 *
 * @korean 좌측보법애니메이션
 */
export const STEP_LEFT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("step_left", "좌측보법")
    .asMovement(0.3, false)
    .stance()
    .sideStepLeft(0.12, "ease-out")
    .sideStepLeft(0.1, "linear")
    .recover(0.08, "ease-in")
    .build();

/**
 * STEP RIGHT Animation (우측보법)
 *
 * Lateral step to the right while maintaining forward-facing guard.
 * Mirror of step left.
 *
 * Distance: 30cm lateral (right)
 * Duration: 300ms
 * Guard: Maintained forward-facing
 *
 * @korean 우측보법애니메이션
 */
export const STEP_RIGHT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("step_right", "우측보법")
    .asMovement(0.3, false)
    .stance()
    .sideStepRight(0.12, "ease-out")
    .sideStepRight(0.1, "linear")
    .recover(0.08, "ease-in")
    .build();

/**
 * Map of all step animations by name
 *
 * Provides quick lookup for step movement animations.
 *
 * @korean 발걸음애니메이션맵
 */
export const STEP_ANIMATIONS = new Map<string, SkeletalAnimation>([
  ["step_forward", STEP_FORWARD_ANIMATION],
  ["step_back", STEP_BACK_ANIMATION],
  ["step_left", STEP_LEFT_ANIMATION],
  ["step_right", STEP_RIGHT_ANIMATION],
]);

/**
 * Get step animation by name
 *
 * Returns the skeletal animation for the specified step direction.
 * Returns undefined if animation not found.
 *
 * @param animationName - Animation state name (e.g., "step_forward")
 * @returns Skeletal animation or undefined
 * @korean 발걸음애니메이션가져오기
 */
export function getStepAnimation(
  animationName: string
): SkeletalAnimation | undefined {
  return STEP_ANIMATIONS.get(animationName);
}
