/**
 * Defensive animations for Eight Trigram stances
 * 
 * Implements stance-specific defensive techniques based on Korean martial arts
 * and I Ching philosophy. Each stance has unique defensive characteristics
 * that reflect its philosophical nature.
 * 
 * Coverage:
 * - 8 stances × 2 defensive moves = 16 defensive animations
 * - Block success, parry, guard break, and recovery animations
 * - Integration with existing AnimationStateMachine
 * 
 * @module systems/animation/DefensiveAnimations
 * @category Animation
 * @korean 방어애니메이션
 */

import * as THREE from "three";
import type { SkeletalAnimation } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import { TrigramStance } from "../../types/common";

/**
 * ☰ 건 (Geon) - Heaven Defensive Move 1: High Block (상단막기)
 * 
 * Strong overhead block with both arms raised high. Direct force meets force.
 * Traditional Taekwondo high block technique.
 * 
 * Duration: 200ms (defensive reaction)
 * 
 * @korean 건상단막기
 */
export const GEON_HIGH_BLOCK: SkeletalAnimation = {
  name: "geon_high_block",
  koreanName: "건 상단막기",
  duration: 0.2,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-1.0, 0.3, -0.6, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-1.0, -0.3, 0.6, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.2,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.8, 0.6, 0.2, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.8, -0.6, -0.2, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * ☰ 건 (Geon) - Heaven Defensive Move 2: Counter Strike (반격)
 * 
 * Quick counter punch after blocking, leveraging forward aggression.
 * Embodies Heaven's active, yang energy.
 * 
 * Duration: 250ms
 * 
 * @korean 건반격
 */
export const GEON_COUNTER_STRIKE: SkeletalAnimation = {
  name: "geon_counter_strike",
  koreanName: "건 반격",
  duration: 0.25,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, -0.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.5, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.15,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0.5, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.8)]]),
    },
    {
      time: 0.25,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, -0.1, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☱ 태 (Tae) - Lake Defensive Move 1: Joint Lock Defense (관절꺾기 방어)
 * 
 * Circular deflection leading into joint manipulation. Fluid redirection.
 * 
 * Duration: 300ms
 * 
 * @korean 태관절방어
 */
export const TAE_JOINT_LOCK_DEFENSE: SkeletalAnimation = {
  name: "tae_joint_lock_defense",
  koreanName: "태 관절방어",
  duration: 0.3,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.4, 0.9, 0.4, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.4, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.15,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 1.2, 0.6, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.0, "XYZ")],
        [BoneName.WRIST_L, new THREE.Euler(0.3, 0.5, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.3,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.4, 0.9, 0.4, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.4, "XYZ")],
        [BoneName.WRIST_L, new THREE.Euler(0.2, 0.3, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * ☱ 태 (Tae) - Lake Defensive Move 2: Sweep Defense (쓸어치기 방어)
 * 
 * Low sweeping motion to deflect and unbalance attacker.
 * 
 * Duration: 280ms
 * 
 * @korean 태쓸어치기방어
 */
export const TAE_SWEEP_DEFENSE: SkeletalAnimation = {
  name: "tae_sweep_defense",
  koreanName: "태 쓸어치기방어",
  duration: 0.28,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, -0.6, -0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.5, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0.2, -0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.15,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.1, 0.8, 0.5, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.3, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0.2, 0.4, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.28,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.5, -0.7, -0.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.1, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * ☲ 리 (Li) - Fire Defensive Move 1: Precision Parry (정밀 받아넘기기)
 * 
 * Precise hand deflection targeting specific attack points.
 * 
 * Duration: 180ms (fast precision)
 * 
 * @korean 리정밀받아넘기기
 */
export const LI_PRECISION_PARRY: SkeletalAnimation = {
  name: "li_precision_parry",
  koreanName: "리 정밀받아넘기기",
  duration: 0.18,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.8, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.5, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.09,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 1.0, 0.7, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.3, "XYZ")],
        [BoneName.WRIST_L, new THREE.Euler(0.2, 0.4, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.18,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.8, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.6, "XYZ")],
        [BoneName.WRIST_L, new THREE.Euler(0, 0.1, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * ☲ 리 (Li) - Fire Defensive Move 2: Nerve Strike Counter (신경타격 반격)
 * 
 * Quick nerve strike counter after deflection.
 * 
 * Duration: 220ms
 * 
 * @korean 리신경타격반격
 */
export const LI_NERVE_STRIKE_COUNTER: SkeletalAnimation = {
  name: "li_nerve_strike_counter",
  koreanName: "리 신경타격반격",
  duration: 0.22,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.3, -0.6, -0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.4, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.12,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, -0.3, 0.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.3, "XYZ")],
        [BoneName.WRIST_R, new THREE.Euler(0.1, -0.2, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.6)]]),
    },
    {
      time: 0.22,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.3, -0.6, -0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        [BoneName.WRIST_R, new THREE.Euler(0.1, -0.1, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☳ 진 (Jin) - Thunder Defensive Move 1: Explosive Block (폭발적 막기)
 * 
 * Powerful explosive block that can stagger attacker.
 * 
 * Duration: 150ms (explosive reaction)
 * 
 * @korean 진폭발막기
 */
export const JIN_EXPLOSIVE_BLOCK: SkeletalAnimation = {
  name: "jin_explosive_block",
  koreanName: "진 폭발막기",
  duration: 0.15,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.8, 0.3, 0.7, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.8, -0.3, -0.7, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.4, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.08,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.6, 0.5, 0.9, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.6, -0.5, -0.9, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.8, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.8, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0.1, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.15,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.8, 0.3, 0.7, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.8, -0.3, -0.7, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.4, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * ☳ 진 (Jin) - Thunder Defensive Move 2: Shocking Counter (충격 반격)
 * 
 * Lightning-fast counter strike with explosive power.
 * 
 * Duration: 180ms
 * 
 * @korean 진충격반격
 */
export const JIN_SHOCKING_COUNTER: SkeletalAnimation = {
  name: "jin_shocking_counter",
  koreanName: "진 충격반격",
  duration: 0.18,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.8, 0.3, 0.7, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.4, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(-0.15, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.09,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.6, 0.4, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.2, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.3, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0.2, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0.7)]]),
    },
    {
      time: 0.18,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.8, 0.3, 0.7, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.4, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_L, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☴ 손 (Son) - Wind Defensive Move 1: Continuous Deflection (연속 막기)
 * 
 * Rapid circular deflections, multiple in succession.
 * 
 * Duration: 350ms (continuous motion)
 * 
 * @korean 손연속막기
 */
export const SON_CONTINUOUS_DEFLECTION: SkeletalAnimation = {
  name: "son_continuous_deflection",
  koreanName: "손 연속막기",
  duration: 0.35,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.65, 0.7, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.6, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.12,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.9, 0.7, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.4, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.2, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.23,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.1, 0.6, 0.3, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.7, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.1, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.35,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.65, 0.7, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.6, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * ☴ 손 (Son) - Wind Defensive Move 2: Pressure Counter (압박 반격)
 * 
 * Multiple quick strikes after deflection, maintaining pressure.
 * 
 * Duration: 400ms
 * 
 * @korean 손압박반격
 */
export const SON_PRESSURE_COUNTER: SkeletalAnimation = {
  name: "son_pressure_counter",
  koreanName: "손 압박반격",
  duration: 0.4,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.1, -0.7, -0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.5, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.13,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, -0.3, 0.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.1, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.5)]]),
    },
    {
      time: 0.26,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 0.3, -0.2, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.1, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.HAND_R, new THREE.Vector3(0, 0, 0)],
        [BoneName.HAND_L, new THREE.Vector3(0, 0, 0.5)],
      ]),
    },
    {
      time: 0.4,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.65, 0.7, 0.5, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.1, -0.7, -0.3, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.6, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.5, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.HAND_L, new THREE.Vector3(0, 0, 0)],
      ]),
    },
  ],
};

/**
 * ☵ 감 (Gam) - Water Defensive Move 1: Flow Defense (흐름 방어)
 * 
 * Yielding circular defense that redirects force.
 * 
 * Duration: 320ms
 * 
 * @korean 감흐름방어
 */
export const GAM_FLOW_DEFENSE: SkeletalAnimation = {
  name: "gam_flow_defense",
  koreanName: "감 흐름방어",
  duration: 0.32,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.1, 0.5, 0.6, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.8, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.2, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.16,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0.8, 0.4, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.5, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.2, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0.15, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.32,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.1, 0.5, 0.6, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.8, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * ☵ 감 (Gam) - Water Defensive Move 2: Redirection Counter (전환 반격)
 * 
 * Uses opponent's momentum for counter strike.
 * 
 * Duration: 300ms
 * 
 * @korean 감전환반격
 */
export const GAM_REDIRECTION_COUNTER: SkeletalAnimation = {
  name: "gam_redirection_counter",
  koreanName: "감 전환반격",
  duration: 0.3,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.1, -0.5, -0.6, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.8, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.15,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.3, -0.2, 0.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.3, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.2, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, -0.15, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.6)]]),
    },
    {
      time: 0.3,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.1, -0.5, -0.6, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.8, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☶ 간 (Gan) - Mountain Defensive Move 1: Immovable Block (부동 막기)
 * 
 * Solid defensive stance that absorbs attacks.
 * 
 * Duration: 250ms
 * 
 * @korean 간부동막기
 */
export const GAN_IMMOVABLE_BLOCK: SkeletalAnimation = {
  name: "gan_immovable_block",
  koreanName: "간 부동막기",
  duration: 0.25,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.7, 0.2, 0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.7, -0.2, -0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.13,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.8, 0.3, 0.9, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.8, -0.3, -0.9, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.4, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.25, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.25, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.25,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.7, 0.2, 0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.7, -0.2, -0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * ☶ 간 (Gan) - Mountain Defensive Move 2: Counter Fortress (반격 요새)
 * 
 * Strong defensive position with delayed power counter.
 * 
 * Duration: 350ms
 * 
 * @korean 간반격요새
 */
export const GAN_COUNTER_FORTRESS: SkeletalAnimation = {
  name: "gan_counter_fortress",
  koreanName: "간 반격요새",
  duration: 0.35,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.7, 0.2, 0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.7, -0.2, -0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.15,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.7, 0.2, 0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.7, -0.2, -0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.22,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0.5, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.2, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.2, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0.7)]]),
    },
    {
      time: 0.35,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(-0.7, 0.2, 0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.7, -0.2, -0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * ☷ 곤 (Gon) - Earth Defensive Move 1: Grounding Defense (접지 방어)
 * 
 * Low defensive posture with strong base.
 * 
 * Duration: 280ms
 * 
 * @korean 곤접지방어
 */
export const GON_GROUNDING_DEFENSE: SkeletalAnimation = {
  name: "gon_grounding_defense",
  koreanName: "곤 접지방어",
  duration: 0.28,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0.1, 0.4, 0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.1, -0.4, -0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.9, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.9, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-1.0, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.14,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0.2, 0.5, 0.9, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.2, -0.5, -0.9, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-1.1, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.1, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(-0.1, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.28,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0.1, 0.4, 0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.1, -0.4, -0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.9, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.9, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-1.0, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * ☷ 곤 (Gon) - Earth Defensive Move 2: Takedown Counter (꺾기 반격)
 * 
 * Defensive takedown using low center of gravity advantage.
 * 
 * Duration: 450ms
 * 
 * @korean 곤꺾기반격
 */
export const GON_TAKEDOWN_COUNTER: SkeletalAnimation = {
  name: "gon_takedown_counter",
  koreanName: "곤 꺾기반격",
  duration: 0.45,
  loop: false,
  type: "defense",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0.1, 0.4, 0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.1, -0.4, -0.8, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-1.0, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.15,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0.3, 0.6, 1.0, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.3, -0.6, -1.0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.7, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.7, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.8, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.8, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0.2, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.3,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0.4, 0.7, 1.1, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.4, -0.7, -1.1, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0.3, 0.2, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0.2, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.45,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0.1, 0.4, 0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.1, -0.4, -0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.9, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.9, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-1.0, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * Map of all defensive animations by stance
 * 
 * Each stance has 2 unique defensive animations that reflect its philosophy:
 * - GEON: High blocks and counter strikes (direct force)
 * - TAE: Joint locks and sweeps (fluid manipulation)
 * - LI: Precision parries and nerve counters (targeted precision)
 * - JIN: Explosive blocks and shocking counters (explosive power)
 * - SON: Continuous deflections and pressure counters (sustained pressure)
 * - GAM: Flow defenses and redirection counters (adaptive flow)
 * - GAN: Immovable blocks and fortress counters (solid defense)
 * - GON: Grounding defenses and takedown counters (low control)
 * 
 * @korean 자세별방어애니메이션
 */
export const DEFENSIVE_ANIMATIONS_BY_STANCE: ReadonlyMap<
  TrigramStance,
  readonly SkeletalAnimation[]
> = new Map([
  [TrigramStance.GEON, [GEON_HIGH_BLOCK, GEON_COUNTER_STRIKE] as const],
  [TrigramStance.TAE, [TAE_JOINT_LOCK_DEFENSE, TAE_SWEEP_DEFENSE] as const],
  [TrigramStance.LI, [LI_PRECISION_PARRY, LI_NERVE_STRIKE_COUNTER] as const],
  [TrigramStance.JIN, [JIN_EXPLOSIVE_BLOCK, JIN_SHOCKING_COUNTER] as const],
  [TrigramStance.SON, [SON_CONTINUOUS_DEFLECTION, SON_PRESSURE_COUNTER] as const],
  [TrigramStance.GAM, [GAM_FLOW_DEFENSE, GAM_REDIRECTION_COUNTER] as const],
  [TrigramStance.GAN, [GAN_IMMOVABLE_BLOCK, GAN_COUNTER_FORTRESS] as const],
  [TrigramStance.GON, [GON_GROUNDING_DEFENSE, GON_TAKEDOWN_COUNTER] as const],
]);

/**
 * All defensive animations in a single map for easy lookup
 * 
 * @korean 모든방어애니메이션
 */
export const ALL_DEFENSIVE_ANIMATIONS = new Map<string, SkeletalAnimation>([
  ["geon_high_block", GEON_HIGH_BLOCK],
  ["geon_counter_strike", GEON_COUNTER_STRIKE],
  ["tae_joint_lock_defense", TAE_JOINT_LOCK_DEFENSE],
  ["tae_sweep_defense", TAE_SWEEP_DEFENSE],
  ["li_precision_parry", LI_PRECISION_PARRY],
  ["li_nerve_strike_counter", LI_NERVE_STRIKE_COUNTER],
  ["jin_explosive_block", JIN_EXPLOSIVE_BLOCK],
  ["jin_shocking_counter", JIN_SHOCKING_COUNTER],
  ["son_continuous_deflection", SON_CONTINUOUS_DEFLECTION],
  ["son_pressure_counter", SON_PRESSURE_COUNTER],
  ["gam_flow_defense", GAM_FLOW_DEFENSE],
  ["gam_redirection_counter", GAM_REDIRECTION_COUNTER],
  ["gan_immovable_block", GAN_IMMOVABLE_BLOCK],
  ["gan_counter_fortress", GAN_COUNTER_FORTRESS],
  ["gon_grounding_defense", GON_GROUNDING_DEFENSE],
  ["gon_takedown_counter", GON_TAKEDOWN_COUNTER],
]);

/**
 * Get defensive animations for a specific stance
 * 
 * @param stance - Trigram stance
 * @returns Array of 2 defensive animations for the stance
 * 
 * @example
 * ```typescript
 * const geonDefenses = getDefensiveAnimationsForStance(TrigramStance.GEON);
 * console.log(geonDefenses[0].koreanName); // "건 상단막기"
 * ```
 * 
 * @korean 자세방어애니메이션가져오기
 */
export function getDefensiveAnimationsForStance(
  stance: TrigramStance
): readonly SkeletalAnimation[] {
  return DEFENSIVE_ANIMATIONS_BY_STANCE.get(stance) || [];
}

/**
 * Get a defensive animation by name
 * 
 * @param name - Animation name
 * @returns Skeletal animation or undefined
 * 
 * @korean 방어애니메이션가져오기
 */
export function getDefensiveAnimation(
  name: string
): SkeletalAnimation | undefined {
  return ALL_DEFENSIVE_ANIMATIONS.get(name);
}
