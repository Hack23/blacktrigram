/**
 * Selects and applies skeletal clips for the player renderer.
 * The gameplay timeline owns combat events; this hook only writes visual poses.
 *
 * @module hooks/useSkeletalAnimation
 * @category Hooks
 * @korean 골격애니메이션훅
 */

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  getAnimation,
  getAttackAnimation,
  getDefensiveAnimation,
  getFootworkAnimation,
  getStepAnimation,
  performanceMonitor,
} from "../systems/animation";
import { PLAYER_PLAYBACK_CLIPS } from "../systems/animation/catalogs/PlayerPlaybackClips";
import { applyLaterality } from "../systems/animation/core/LateralityTransform";
import {
  prepareSkeletalPose,
  SkeletalPosePlayback,
} from "../systems/animation/core/SkeletalPosePlayback";
import type { TrigramStance } from "../types/common";
import type { PlayerAnimation } from "../types/player-visual";
import type { SkeletalAnimation, SkeletalAnimationState, SkeletalRig } from "../types/skeletal";

export interface UseSkeletalAnimationOptions {
  readonly currentAnimation: PlayerAnimation;
  /** Resolved clip name/ID; not a request to resolve the technique again. */
  readonly attackAnimation?: string;
  readonly isBlocking?: boolean;
  readonly stance?: TrigramStance;
  readonly laterality?: "left" | "right";
  /** Change to replay the same action and clip. */
  readonly playbackKey?: string | number;
  /** Visual completion only; do not use to schedule combat events. */
  readonly onAnimationComplete?: () => void;
}

export interface UseSkeletalAnimationReturn {
  readonly animState: SkeletalAnimationState;
  readonly animTimeRef: React.MutableRefObject<number>;
  /**
   * Apply the current pose. Optionally pass authored clip-local seconds from an
   * external timeline; this bypasses the internal clock and speed multiplier.
   */
  readonly updateRigAnimation: (rig: SkeletalRig, delta: number, clipTimeSeconds?: number) => void;
  /** The parent owns model facing, including diagonal steps. */
  readonly diagonalRotationY: number | null;
}

const MAX_VISUAL_DELTA = 1 / 30;
const MAX_BLEND_SECONDS = 0.09;
const WALK_SEAM_SECONDS = 0.05;

const VISUAL_FALLBACKS: Partial<Record<PlayerAnimation, string>> = {
  defend_block_success: "block_high",
  defend_parry: "gam_flowing_block",
  defend_guard_break: "hit",
  defend_recovery: "block_low",
  stance_side_switch: "footwork_switch_step",
  turn_left: "movement_pivot_left",
  turn_right: "movement_pivot_right",
  grapple_entry: "grapple",
  grapple_control: "gon_ground_control_transition",
  grapple_struggle: "joint_lock_defense",
  grapple_escape: "backward_retreat",
};

const DIAGONAL_STEP_FOOTWORK: Partial<Record<PlayerAnimation, string>> = {
  step_forward_left: "footwork_circular_left",
  step_forward_right: "footwork_circular_right",
  step_back_left: "footwork_slide_left",
  step_back_right: "footwork_slide_right",
};

function isNamedAttack(state: PlayerAnimation): boolean {
  return state === "attack" || state === "technique_execute" || state === "counter";
}

function findVisualClip(name: string): SkeletalAnimation | undefined {
  return getAnimation(name) ?? PLAYER_PLAYBACK_CLIPS.get(name) ??
    getFootworkAnimation(name) ?? getStepAnimation(name);
}

function selectClip(
  state: PlayerAnimation,
  name: string | undefined,
  stance: TrigramStance | undefined,
): SkeletalAnimation | undefined {
  if (isNamedAttack(state)) {
    return (name ? getAnimation(name) ?? getAttackAnimation(name) : undefined) ??
      getAnimation(state === "counter" ? "counter_strike" : "jab");
  }
  if (state === "defend" || state === "block") {
    return (name ? getDefensiveAnimation(name) : undefined) ?? getAnimation("block");
  }
  if ((state === "idle" || state === "walk" || state === "run") && stance) {
    const variant = getAnimation(`${state === "idle" ? "stance" : state}_${stance}`);
    if (variant) return variant;
  }
  const fallback = VISUAL_FALLBACKS[state] ?? DIAGONAL_STEP_FOOTWORK[state];
  return findVisualClip(state) ?? (fallback ? findVisualClip(fallback) : undefined);
}

function isDirectional(state: PlayerAnimation): boolean {
  return state.startsWith("step_") || state.startsWith("footwork_") ||
    state.startsWith("turn_") || state.startsWith("fall_") ||
    state.startsWith("ground_");
}

const mirroredClips = new WeakMap<SkeletalAnimation, SkeletalAnimation>();
const walkCycles = new WeakMap<SkeletalAnimation, SkeletalAnimation>();

function mirror(clip: SkeletalAnimation): SkeletalAnimation {
  const cached = mirroredClips.get(clip);
  if (cached) return cached;
  const mirrored = applyLaterality(clip, "left");
  mirroredClips.set(clip, mirrored);
  mirroredClips.set(mirrored, clip);
  return mirrored;
}

/** Stance walks are single strides. Alternate leads instead of snapping back to frame zero. */
function loopWalk(clip: SkeletalAnimation): SkeletalAnimation {
  if (clip.loop || !clip.keyframes[0]) return clip;
  const cached = walkCycles.get(clip);
  if (cached) return cached;
  const oppositeStart = clip.duration + WALK_SEAM_SECONDS;
  const duration = oppositeStart * 2;
  const cycle = {
    ...clip,
    loop: true,
    duration,
    keyframes: [
      ...clip.keyframes,
      ...mirror(clip).keyframes.map((key) => ({ ...key, time: key.time + oppositeStart })),
      { ...clip.keyframes[0], time: duration },
    ],
  };
  walkCycles.set(clip, cycle);
  return cycle;
}

interface PlaybackSession {
  readonly clip: SkeletalAnimation;
  readonly speed: number;
}

interface LivePlayback {
  readonly rig: SkeletalRig;
  readonly pose: SkeletalPosePlayback;
  session: PlaybackSession;
  blendTime: number;
  completed: boolean;
}

export function useSkeletalAnimation(
  {
    currentAnimation,
    attackAnimation,
    isBlocking = false,
    stance,
    laterality = "right",
    playbackKey,
    onAnimationComplete,
  }: UseSkeletalAnimationOptions,
): UseSkeletalAnimationReturn {
  const passive = currentAnimation === "idle" || currentAnimation.startsWith("stance_") &&
    currentAnimation !== "stance_change" && currentAnimation !== "stance_side_switch";
  const state = passive && isBlocking ? "defend" : currentAnimation;
  const name = isNamedAttack(currentAnimation) || currentAnimation === "defend" ||
    currentAnimation === "block" ? attackAnimation : undefined;
  const baseClip = selectClip(state, name, stance) ?? getAnimation("idle");
  const oriented = baseClip && laterality === "left" && !isDirectional(state)
    ? mirror(baseClip)
    : baseClip;
  const clip = oriented && state === "walk" ? loopWalk(oriented) : oriented;
  const speed = state === "stance_change" ? 1.2 : passive && state !== "defend" ? 0.5 : 1;
  const session = useMemo(
    () => (clip ? { clip, speed, state, name, playbackKey } : null),
    [clip, speed, state, name, playbackKey],
  );
  const prepared = useMemo(() => clip ? prepareSkeletalPose(clip) : null, [clip]);
  const live = useRef<LivePlayback | null>(null);
  const animTimeRef = useRef(0);
  const [finished, setFinished] = useState<PlaybackSession | null>(null);

  useLayoutEffect(() => {
    animTimeRef.current = 0;
  }, [session]);

  const updateRigAnimation = useCallback(
    (rig: SkeletalRig, delta: number, clipTimeSeconds?: number) => {
      if (!session || !prepared) return;
      const start = performance.now();
      const dt = Number.isFinite(delta) ? Math.min(MAX_VISUAL_DELTA, Math.max(0, delta)) : 0;
      const { duration, loop } = session.clip;
      const blendDuration = Math.min(MAX_BLEND_SECONDS, duration * 0.3);
      if (live.current?.rig !== rig) {
        const alreadyCompleted = live.current?.session === session && live.current.completed;
        const pose = new SkeletalPosePlayback(rig);
        if (alreadyCompleted) pose.apply(prepared, duration);
        live.current = { rig, pose, session, blendTime: blendDuration, completed: alreadyCompleted };
      }
      const playback = live.current;
      if (playback.session !== session) {
        playback.pose.capture();
        playback.session = session;
        playback.blendTime = 0;
        playback.completed = false;
      }
      if (playback.completed) return;

      const next = clipTimeSeconds !== undefined && Number.isFinite(clipTimeSeconds)
        ? Math.max(0, clipTimeSeconds)
        : animTimeRef.current + dt * session.speed;
      const time = loop && duration > 0 ? next % duration : Math.min(next, duration);
      const done = !loop && time >= duration;
      playback.blendTime = Math.min(blendDuration, playback.blendTime + dt);
      const alpha = done || blendDuration <= 0 ? 1 : playback.blendTime / blendDuration;
      playback.pose.apply(prepared, time, alpha * alpha * (3 - 2 * alpha));
      animTimeRef.current = time;
      performanceMonitor.recordFrame(performance.now() - start);

      if (done) {
        playback.completed = true;
        setFinished(session);
        onAnimationComplete?.();
      }
    },
    [onAnimationComplete, prepared, session],
  );

  return {
    animState: {
      currentAnimation: clip ?? null,
      currentTime: session && finished === session ? session.clip.duration : 0,
      isPlaying: session !== null && finished !== session,
      playbackSpeed: speed,
      previousKeyframeIndex: 0,
      nextKeyframeIndex: 1,
    },
    animTimeRef,
    updateRigAnimation,
    diagonalRotationY: null,
  };
}
