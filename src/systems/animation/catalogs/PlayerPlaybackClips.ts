import { Euler, Vector3 } from "three";
import { BoneName, type SkeletalAnimation } from "../../../types/skeletal";
import {
  FALL_BACKWARD_ANIMATION,
  FALL_FORWARD_ANIMATION,
  FALL_SIDE_LEFT_ANIMATION,
  FALL_SIDE_RIGHT_ANIMATION,
  IDLE_ANIMATION,
} from "./BasicAnimations";
import {
  RECOVERY_DEFENSIVE_KEYFRAMES,
  RECOVERY_PRONE_KEYFRAMES,
  RECOVERY_ROLL_KEYFRAMES,
  RECOVERY_SUPINE_KEYFRAMES,
  type RecoveryKeyframe,
} from "./RecoveryAnimations";

const REACTION_DURATION = 4 / 60;
const RECOVERY_FPS = 60;
// Visual offset from pelvis rest height, in rig-space meters.
const GROUNDED_PELVIS_OFFSET = -0.75;

const ready = IDLE_ANIMATION.keyframes[0];
const hitReaction: SkeletalAnimation = {
  name: "hit",
  koreanName: "피격",
  duration: REACTION_DURATION,
  loop: false,
  type: "idle",
  keyframes: [
    { ...ready, time: 0 },
    {
      ...ready,
      time: REACTION_DURATION / 2,
      easing: "ease-out",
      boneRotations: new Map([
        ...ready.boneRotations,
        [BoneName.PELVIS, new Euler(-0.15, 0, 0.06)],
        [BoneName.SPINE_UPPER, new Euler(-0.23, -0.1, 0.12)],
        [BoneName.HEAD, new Euler(0.13, 0.12, -0.1)],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new Vector3(0, -0.05, 0)]]),
    },
    { ...ready, time: REACTION_DURATION, easing: "ease-out" },
  ],
};

function groundHold(
  name: string,
  koreanName: string,
  fall: SkeletalAnimation,
): SkeletalAnimation {
  const end = fall.keyframes[fall.keyframes.length - 1];
  return {
    name,
    koreanName,
    duration: 1,
    type: "idle",
    loop: true,
    keyframes: [{ ...end, time: 0 }],
  };
}

/** Adapt authored recovery poses to renderable rig tracks without changing gameplay data. */
function recoveryClip(
  name: string,
  koreanName: string,
  frames: readonly RecoveryKeyframe[],
): SkeletalAnimation {
  return {
    name,
    koreanName,
    duration: ((frames.at(-1)?.frame ?? 0) + 1) / RECOVERY_FPS,
    type: "movement",
    loop: false,
    keyframes: frames.map(({ frame, torsoRotation, centerOfMassHeight }, index) => {
      const { x, y, z } = torsoRotation;
      const lift = index === frames.length - 1 ? 1 : centerOfMassHeight;
      return {
        time: frame / RECOVERY_FPS,
        easing: "ease-in-out",
        boneRotations: new Map([
          ...ready.boneRotations,
          [BoneName.PELVIS, new Euler(x, y, z, "YXZ")],
        ]),
        bonePositions: new Map([
          [BoneName.PELVIS, new Vector3(0, GROUNDED_PELVIS_OFFSET * (1 - lift), 0)],
        ]),
      };
    }),
  };
}

const death: SkeletalAnimation = {
  ...FALL_BACKWARD_ANIMATION,
  name: "death",
  koreanName: "기절",
};

export const PLAYER_PLAYBACK_CLIPS: ReadonlyMap<string, SkeletalAnimation> = new Map([
  ["hit", hitReaction],
  ["death", death],
  ["ground_prone", groundHold("ground_prone", "엎드림", FALL_FORWARD_ANIMATION)],
  ["ground_supine", groundHold("ground_supine", "누움", FALL_BACKWARD_ANIMATION)],
  ["ground_side_left", groundHold("ground_side_left", "좌측와", FALL_SIDE_LEFT_ANIMATION)],
  ["ground_side_right", groundHold("ground_side_right", "우측와", FALL_SIDE_RIGHT_ANIMATION)],
  ["recovery_prone_standup", recoveryClip("recovery_prone_standup", "엎드린 기상", RECOVERY_PRONE_KEYFRAMES)],
  ["recovery_supine_standup", recoveryClip("recovery_supine_standup", "누운 기상", RECOVERY_SUPINE_KEYFRAMES)],
  ["recovery_roll", recoveryClip("recovery_roll", "회전기상", RECOVERY_ROLL_KEYFRAMES)],
  ["recovery_defensive", recoveryClip("recovery_defensive", "방어기상", RECOVERY_DEFENSIVE_KEYFRAMES)],
]);
