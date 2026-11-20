import { getAnimationDurationOrFallback, TARGET_ANIMATION_FPS } from "../systems/animation";

/** Match the clip duration and active frame used by the game animation clock. */
export function getAttackPresentation(animationName: string): {
  readonly duration: number;
  readonly impactFrame: number;
} {
  const duration = getAnimationDurationOrFallback(animationName);
  const frames = Math.max(1, Math.round(duration * TARGET_ANIMATION_FPS));
  return { duration, impactFrame: Math.round(frames * 0.4) };
}
