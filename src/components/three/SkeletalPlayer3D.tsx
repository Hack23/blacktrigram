/**
 * SkeletalPlayer3D component with articulated body model
 *
 * Implements full skeletal rigging system for realistic fighter animations
 * with independent limb movement, elbow/knee joints, and attack animations.
 *
 * @module components/three/SkeletalPlayer3D
 * @category 3D Components
 * @korean 골격플레이어3D컴포넌트
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  applyKeyframeToRig,
  createDefaultFacialDamage,
  createScaledHumanoidRig,
  createInitialHandAnimationState,
  getAnimation,
  getExpressionFromCombatState,
  getTechniqueHandPose,
  updateAnimation,
  updateHandAnimationState,
  getGuardPoseForStance,
  getStepAnimation,
} from "../../systems/animation";
import type { StanceLaterality } from "../../systems/trigram/types";
import { getArchetypePhysicalAttributes } from "../../data/archetypePhysicalAttributes";
import { MuscleActivationManager } from "../../systems/animation/MuscleActivation";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
import { TrigramStance } from "../../types/common";
import { FacialExpression } from "../../types/facial";
import type { HandAnimationState } from "../../types/hand-animation";
import { HandPoseType } from "../../types/hand-animation";
import type { Player3DUnifiedProps } from "../../types/player-visual";
import type { SkeletalAnimationState, SkeletalRig } from "../../types/skeletal";
import { toHexColor } from "../../utils/colorHelpers";
import { getArchetypeColors } from "../../utils/colorUtils";
import BoneRenderer from "./BoneRenderer";
import MuscleSystem from "./MuscleSystem";
import PlayerStateIndicators from "./PlayerStateIndicators";
import StanceAura from "./StanceAura";

/**
 * Get stance-specific color from Korean theming
 *
 * @param stance - Current trigram stance
 * @returns Hex color number
 * @korean 자세색상가져오기
 */
const getStanceColor = (stance: string): number => {
  const stanceColors: Record<string, number> = {
    geon: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
    tae: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
    li: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,
    jin: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
    son: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
    gam: KOREAN_COLORS.TRIGRAM_GAM_PRIMARY,
    gan: KOREAN_COLORS.TRIGRAM_GAN_PRIMARY,
    gon: KOREAN_COLORS.TRIGRAM_GON_PRIMARY,
  };
  return stanceColors[stance] ?? KOREAN_COLORS.PRIMARY_CYAN;
};

// Set of diagonal step animations for O(1) lookup (prevents false positives)
const DIAGONAL_STEP_ANIMATIONS = new Set([
  "step_forward_left",
  "step_forward_right",
  "step_back_left",
  "step_back_right",
]);

/**
 * Get trigram symbol for stance
 *
 * @param stance - Current trigram stance
 * @returns Unicode trigram symbol
 * @korean 팔괘기호가져오기
 */
const getTrigramSymbol = (stance: string): string => {
  const symbols: Record<string, string> = {
    geon: "☰",
    tae: "☱",
    li: "☲",
    jin: "☳",
    son: "☴",
    gam: "☵",
    gan: "☶",
    gon: "☷",
  };
  return symbols[stance] ?? "☰";
};

/**
 * Blend factor for torso rotation during guard overlay
 * 
 * This value is multiplied by the main `blendFactor` argument used for the
 * stance guard overlay. For example, when `blendFactor` is 1.0 (full guard),
 * the effective torso guard influence becomes `1.0 * 0.8 = 0.8`, allowing
 * approximately 20% of the base animation (walk/idle) torso movement to show
 * through. Keep this lower than 1.0 to preserve some natural torso motion
 * while still maintaining a visible guard posture.
 * 
 * @korean 방어자세가 몸통에 적용되는 비율을 줄이는 추가 스케일 계수
 */
const TORSO_BLEND_FACTOR = 0.8;

/**
 * Full guard blend factor for maintaining complete fighting stance
 * @korean 완전방어블렌드계수
 */
const FULL_GUARD_BLEND = 1.0;

/**
 * Apply stance guard pose overlay on top of base animation
 * 
 * Blends guard arm positions with base animation (idle/walk) to maintain
 * guard pose during movement. Only affects upper body (arms, torso) while
 * allowing legs to animate normally.
 * 
 * PERFORMANCE: Directly modifies existing Euler rotation components
 * to avoid extra Euler object cloning while still using component-wise interpolation.
 * 
 * @param rig - Skeletal rig to apply overlay to
 * @param stance - Current trigram stance
 * @param breathingPhase - Breathing phase 0.0-1.0 for scale oscillation
 * @param laterality - Stance laterality (left or right foot forward)
 * @param blendFactor - How much guard pose to blend (0=base animation, 1=full guard)
 * 
 * @korean 자세방어포즈오버레이적용
 */
const applyStanceGuardOverlay = (
  rig: SkeletalRig,
  stance: TrigramStance | string,
  breathingPhase: number,
  laterality: StanceLaterality = "right",
  blendFactor: number = FULL_GUARD_BLEND
): void => {
  const guardPose = getGuardPoseForStance(stance as TrigramStance, laterality);
  if (!guardPose) return;

  // Blend left arm rotations with current pose (maintain animation)
  // Directly modifies rotation components in-place for performance (avoids object allocations)
  const leftShoulder = rig.bones.get("left_shoulder");
  if (leftShoulder) {
    const current = leftShoulder.rotation;
    const target = guardPose.leftArm.shoulder;
    current.x = THREE.MathUtils.lerp(current.x, target.x, blendFactor);
    current.y = THREE.MathUtils.lerp(current.y, target.y, blendFactor);
    current.z = THREE.MathUtils.lerp(current.z, target.z, blendFactor);
  }
  const leftElbow = rig.bones.get("left_elbow");
  if (leftElbow) {
    const current = leftElbow.rotation;
    const target = guardPose.leftArm.elbow;
    current.x = THREE.MathUtils.lerp(current.x, target.x, blendFactor);
    current.y = THREE.MathUtils.lerp(current.y, target.y, blendFactor);
    current.z = THREE.MathUtils.lerp(current.z, target.z, blendFactor);
  }
  const leftWrist = rig.bones.get("left_wrist");
  if (leftWrist) {
    const current = leftWrist.rotation;
    const target = guardPose.leftArm.wrist;
    current.x = THREE.MathUtils.lerp(current.x, target.x, blendFactor);
    current.y = THREE.MathUtils.lerp(current.y, target.y, blendFactor);
    current.z = THREE.MathUtils.lerp(current.z, target.z, blendFactor);
  }

  // Blend right arm rotations with current pose
  const rightShoulder = rig.bones.get("right_shoulder");
  if (rightShoulder) {
    const current = rightShoulder.rotation;
    const target = guardPose.rightArm.shoulder;
    current.x = THREE.MathUtils.lerp(current.x, target.x, blendFactor);
    current.y = THREE.MathUtils.lerp(current.y, target.y, blendFactor);
    current.z = THREE.MathUtils.lerp(current.z, target.z, blendFactor);
  }
  const rightElbow = rig.bones.get("right_elbow");
  if (rightElbow) {
    const current = rightElbow.rotation;
    const target = guardPose.rightArm.elbow;
    current.x = THREE.MathUtils.lerp(current.x, target.x, blendFactor);
    current.y = THREE.MathUtils.lerp(current.y, target.y, blendFactor);
    current.z = THREE.MathUtils.lerp(current.z, target.z, blendFactor);
  }
  const rightWrist = rig.bones.get("right_wrist");
  if (rightWrist) {
    const current = rightWrist.rotation;
    const target = guardPose.rightArm.wrist;
    current.x = THREE.MathUtils.lerp(current.x, target.x, blendFactor);
    current.y = THREE.MathUtils.lerp(current.y, target.y, blendFactor);
    current.z = THREE.MathUtils.lerp(current.z, target.z, blendFactor);
  }

  // Blend torso rotation with current pose
  const spine = rig.bones.get("spine");
  if (spine) {
    const current = spine.rotation;
    const target = guardPose.torso;
    // Apply full torso rotation for distinct stance appearance
    const torsoBlend = blendFactor * TORSO_BLEND_FACTOR;
    current.x = THREE.MathUtils.lerp(current.x, target.x, torsoBlend);
    current.y = THREE.MathUtils.lerp(current.y, target.y, torsoBlend);
    current.z = THREE.MathUtils.lerp(current.z, target.z, torsoBlend);
  }

  // Apply breathing animation scale (chest/shoulder expansion)
  const breathingScale = THREE.MathUtils.lerp(
    guardPose.breathingRange.min,
    guardPose.breathingRange.max,
    (Math.sin(breathingPhase * Math.PI * 2) + 1) / 2 // Sine wave 0-1
  );

  // Apply breathing to upper torso
  const chest = rig.bones.get("chest");
  if (chest) {
    chest.scale.setScalar(breathingScale);
  }
  const neck = rig.bones.get("neck");
  if (neck) {
    neck.scale.y = breathingScale;
  }
};

/**
 * Default transition duration for hand pose changes (in seconds)
 * @korean 손자세전환기본지속시간
 */
const DEFAULT_HAND_TRANSITION_DURATION = 0.2;

/**
 * Frequency of React state syncs during hand animations.
 * Value of 20 means sync every 5% progress (~every 3 frames at 60fps).
 * This reduces React re-renders from 60/sec to ~20/sec during transitions.
 * @korean 손상태동기화빈도
 */
const HAND_STATE_SYNC_FREQUENCY = 20;

/**
 * Animation constants for balance state sway effects.
 * Defines intensity, speed, and lean parameters for visual feedback.
 * @korean 균형상태애니메이션상수
 */
const BALANCE_STATE_ANIMATION_CONSTANTS = {
  SHAKEN: {
    swayIntensity: 0.02, // 2% subtle sway
    swaySpeed: 2, // Hz frequency
  },
  VULNERABLE: {
    swayIntensity: 0.04, // 4% moderate sway
    swaySpeed: 3, // Hz frequency
  },
  HELPLESS: {
    stumbleIntensity: 0.08, // 8% pronounced stumble
    stumbleSpeed: 1.5, // Hz frequency (slower, more dramatic)
    leanIntensity: 0.15, // 15° forward lean angle
    lowerStance: -0.15, // Lower Y position for stumbling effect
  },
  SWAY_THRESHOLD: 0.001, // Minimum sway to consider significant
} as const;

/**
 * Updates hand animation state for a single hand at 60fps.
 * Uses refs to avoid triggering React re-renders on every frame.
 * Only syncs to React state periodically or when transition completes.
 *
 * @param handStateRef - Ref storing current hand animation state
 * @param setHandState - React setState function to update hand state
 * @param delta - Time elapsed since last frame (in seconds)
 * @korean 손애니메이션프레임업데이트
 */
const updateHandAnimationFrame = (
  handStateRef: React.MutableRefObject<HandAnimationState>,
  setHandState: React.Dispatch<React.SetStateAction<HandAnimationState>>,
  delta: number
): void => {
  if (handStateRef.current && handStateRef.current.targetPose !== null) {
    const previousState = handStateRef.current;
    const updatedState = updateHandAnimationState(
      previousState,
      previousState.targetPose,
      delta,
      DEFAULT_HAND_TRANSITION_DURATION
    );

    handStateRef.current = updatedState;

    // Sync to React state periodically (approximately every 3 frames at 60fps)
    // to balance animation smoothness with React render performance.
    if (
      updatedState.targetPose === null ||
      Math.floor(
        updatedState.transitionProgress * HAND_STATE_SYNC_FREQUENCY
      ) !==
        Math.floor(previousState.transitionProgress * HAND_STATE_SYNC_FREQUENCY)
    ) {
      setHandState(updatedState);
    }
  }
};

/**
 * Checks if there is significant sway that requires animation updates.
 * 
 * @param swayPosition - Current sway position [x, y, z]
 * @param helplessRotation - Current helpless rotation angle
 * @returns True if sway is above threshold
 * @korean 의미있는흔들림확인
 */
const hasSignificantSway = (
  swayPosition: [number, number, number],
  helplessRotation: number
): boolean => {
  return (
    Math.abs(swayPosition[0]) > BALANCE_STATE_ANIMATION_CONSTANTS.SWAY_THRESHOLD ||
    Math.abs(swayPosition[1]) > BALANCE_STATE_ANIMATION_CONSTANTS.SWAY_THRESHOLD ||
    Math.abs(helplessRotation) > BALANCE_STATE_ANIMATION_CONSTANTS.SWAY_THRESHOLD
  );
};

/**
 * SkeletalPlayer3D Component
 *
 * Complete skeletal player with 28-bone rig and realistic animations.
 * Supports all Korean martial arts attack animations (jab, cross, kicks, block).
 *
 * @example
 * ```tsx
 * <SkeletalPlayer3D
 *   playerId="player1"
 *   archetype={PlayerArchetype.MUSA}
 *   stance={TrigramStance.GEON}
 *   position={[0, 0, 0]}
 *   rotation={0}
 *   health={85}
 *   maxHealth={100}
 *   stamina={60}
 *   ki={40}
 *   currentAnimation="attack"
 *   attackAnimation="jab"
 *   showDetails={true}
 * />
 * ```
 *
 * @korean 골격플레이어3D컴포넌트
 */
export const SkeletalPlayer3D: React.FC<
  Player3DUnifiedProps & {
    readonly attackAnimation?: string;
    readonly showSkeleton?: boolean;
  }
> = ({
  playerId,
  archetype,
  stance,
  laterality = "right",
  position,
  rotation,
  health,
  maxHealth,
  stamina,
  ki,
  pain,
  balance,
  consciousness,
  bloodLoss,
  isBlocking,
  isStunned = false,
  isCountering = false,
  currentAnimation,
  isMobile,
  name,
  scale = 1,
  showDetails = true,
  facing = "right",
  showStanceIndicator = true,
  onAnimationComplete,
  attackAnimation,
  showSkeleton = false,
  facialExpression,
  facialDamage,
  enableFacialExpressions = false,
  enableEyeTracking = true,
  opponentPosition,
}) => {
  // Get physical attributes for the archetype
  const physicalAttributes = useMemo(
    () => getArchetypePhysicalAttributes(archetype),
    [archetype]
  );

  // Create skeletal rig with scaled dimensions based on archetype
  const rig = useMemo<SkeletalRig>(
    () => createScaledHumanoidRig(physicalAttributes),
    [physicalAttributes]
  );

  // Muscle activation manager
  const muscleManager = useRef(new MuscleActivationManager());
  const [muscleStates, setMuscleStates] = useState<Map<string, number>>(
    new Map()
  );
  const frameCounter = useRef(0);

  // Cleanup muscle manager on unmount
  useEffect(() => {
    return () => {
      try {
        muscleManager.current.reset();
      } catch (error) {
        console.warn("MuscleActivationManager reset failed:", error);
      }
    };
  }, []);

  // Animation state
  const [animState, setAnimState] = useState<SkeletalAnimationState>({
    currentAnimation: null,
    currentTime: 0,
    isPlaying: false,
    playbackSpeed: 1.0,
    previousKeyframeIndex: 0,
    nextKeyframeIndex: 1,
  });

  // Hand animation state for both hands
  const [leftHandState, setLeftHandState] = useState<HandAnimationState>(
    createInitialHandAnimationState(HandPoseType.OPEN)
  );
  const [rightHandState, setRightHandState] = useState<HandAnimationState>(
    createInitialHandAnimationState(HandPoseType.OPEN)
  );

  // Diagonal step rotation override (Y-axis rotation in radians)
  const [diagonalRotationY, setDiagonalRotationY] = useState<number | null>(null);

  // Refs for 60fps animation updates without triggering React re-renders
  const leftHandStateRef = useRef<HandAnimationState>(leftHandState);
  const rightHandStateRef = useRef<HandAnimationState>(rightHandState);

  // Sync refs with state
  useEffect(() => {
    leftHandStateRef.current = leftHandState;
  }, [leftHandState]);

  useEffect(() => {
    rightHandStateRef.current = rightHandState;
  }, [rightHandState]);

  // Get archetype colors
  const archetypeColors = useMemo(
    () => getArchetypeColors(archetype),
    [archetype]
  );

  // Body color based on state
  const bodyColor = useMemo(() => {
    if (isStunned) return KOREAN_COLORS.WARNING_YELLOW;
    if (health / maxHealth < 0.3) return KOREAN_COLORS.ACCENT_RED;
    if (ki / 100 > 0.8) return KOREAN_COLORS.PRIMARY_CYAN;
    return archetypeColors.primary;
  }, [isStunned, health, maxHealth, ki, archetypeColors.primary]);

  // Stance color
  const stanceColor = useMemo(() => getStanceColor(stance), [stance]);
  const trigramSymbol = useMemo(() => getTrigramSymbol(stance), [stance]);

  // Animation time ref - use ref to avoid state updates during render
  const animTimeRef = useRef(0);

  // Breathing phase ref for stance guard animations (0-1 cycle)
  const breathingPhaseRef = useRef(0);

  // Ref for character sway based on balance state
  const swayTimeRef = useRef(0);

  // Track recent combat events for expression calculation
  const [justHit, setJustHit] = useState(false);
  const [justLanded, setJustLanded] = useState(false);
  const lastHealthRef = useRef(health);

  // Detect hit events (health decreased)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (health < lastHealthRef.current) {
      setJustHit(true);
      timeoutId = setTimeout(() => setJustHit(false), 1000); // Clear after 1 second
    }

    lastHealthRef.current = health;

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [health]);

  // Detect successful attacks (currentAnimation changed to attack)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (currentAnimation === "attack") {
      setJustLanded(true);
      timeoutId = setTimeout(() => setJustLanded(false), 500); // Clear after 0.5 seconds
    }

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentAnimation]);

  // Calculate facial expression from combat state (or use provided one)
  const calculatedExpression = useMemo(() => {
    if (!enableFacialExpressions) {
      return FacialExpression.NEUTRAL;
    }

    if (facialExpression) {
      return facialExpression;
    }

    return getExpressionFromCombatState(
      health,
      maxHealth,
      stamina,
      pain,
      consciousness,
      justHit,
      justLanded
    );
  }, [
    enableFacialExpressions,
    facialExpression,
    health,
    maxHealth,
    stamina,
    pain,
    consciousness,
    justHit,
    justLanded,
  ]);

  // Facial damage state
  const calculatedFacialDamage = useMemo(() => {
    return facialDamage ?? createDefaultFacialDamage();
  }, [facialDamage]);

  // Opponent position for eye tracking
  const opponentPos = useMemo(() => {
    if (opponentPosition) {
      return new THREE.Vector3(...opponentPosition);
    }
    // Default: opponent in front
    return new THREE.Vector3(facing === "right" ? 5 : -5, 2, 0);
  }, [opponentPosition, facing]);

  // Load attack/defend/idle/walk animation when currentAnimation or blocking state changes

  useEffect(() => {
    // Reset animation time ref whenever animation changes
    animTimeRef.current = 0;

    if (currentAnimation === "attack" && attackAnimation) {
      const anim = getAnimation(attackAnimation);
      if (anim) {
        // Update animation state based on prop changes - this is intentional and safe
        setAnimState({
          currentAnimation: anim,
          currentTime: 0,
          isPlaying: true,
          playbackSpeed: 1.0,
          previousKeyframeIndex: 0,
          nextKeyframeIndex: 1,
        });

        // Update hand poses based on attack technique
        const handPose = getTechniqueHandPose(attackAnimation);
        setLeftHandState((prev) =>
          updateHandAnimationState(
            prev,
            handPose.leftHandPose,
            0,
            handPose.transitionDuration
          )
        );
        setRightHandState((prev) =>
          updateHandAnimationState(
            prev,
            handPose.rightHandPose,
            0,
            handPose.transitionDuration
          )
        );
        
        // Clear diagonal rotation override for non-step animations
        setDiagonalRotationY(null);
      }
    } else if (currentAnimation === "defend" || isBlocking) {
      const blockAnim = getAnimation("block");
      if (blockAnim) {
        setAnimState({
          currentAnimation: blockAnim,
          currentTime: 0,
          isPlaying: true,
          playbackSpeed: 1.0,
          previousKeyframeIndex: 0,
          nextKeyframeIndex: 1,
        });

        // Open hands for blocking
        setLeftHandState((prev) =>
          updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.1)
        );
        setRightHandState((prev) =>
          updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.1)
        );
        
        // Clear diagonal rotation override for non-step animations
        setDiagonalRotationY(null);
      }
    } else if (currentAnimation === "walk") {
      // Walking animation - 걷기 애니메이션
      const walkAnim = getAnimation("walk");
      if (walkAnim) {
        setAnimState({
          currentAnimation: walkAnim,
          currentTime: 0,
          isPlaying: true,
          playbackSpeed: 1.0, // Normal walking speed
          previousKeyframeIndex: 0,
          nextKeyframeIndex: 1,
        });

        // Relaxed hands while walking
        setLeftHandState((prev) =>
          updateHandAnimationState(prev, HandPoseType.RELAXED, 0, 0.2)
        );
        setRightHandState((prev) =>
          updateHandAnimationState(prev, HandPoseType.RELAXED, 0, 0.2)
        );
        
        // Clear diagonal rotation override for non-step animations
        setDiagonalRotationY(null);
      }
    } else if (currentAnimation === "stance_change") {
      // Stance change animation - 자세 변경 애니메이션
      const idleAnim = getAnimation("idle_stance");
      if (idleAnim) {
        setAnimState({
          currentAnimation: idleAnim,
          currentTime: 0,
          isPlaying: true,
          playbackSpeed: 1.2, // Slightly faster for responsiveness
          previousKeyframeIndex: 0,
          nextKeyframeIndex: 1,
        });

        // Guard hands during stance change
        setLeftHandState((prev) =>
          updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.15)
        );
        setRightHandState((prev) =>
          updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.15)
        );
        
        // Clear diagonal rotation override for non-step animations
        setDiagonalRotationY(null);
      }
    } else if (currentAnimation === "hit") {
      // Hit reaction - keep current pose but stop animation
      setAnimState((prev) => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    } else if (currentAnimation?.startsWith("step_")) {
      // Tactical step animation - 전술적 발걸음 애니메이션
      const stepAnim = getStepAnimation(currentAnimation);
      if (stepAnim) {
        setAnimState({
          currentAnimation: stepAnim,
          currentTime: 0,
          isPlaying: true,
          playbackSpeed: 1.0, // Normal step speed (300ms duration)
          previousKeyframeIndex: 0,
          nextKeyframeIndex: 1,
        });

        // Maintain guard hands during step (hands stay up)
        setLeftHandState((prev) =>
          updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.1)
        );
        setRightHandState((prev) =>
          updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.1)
        );

        // For diagonal steps, apply rotation offset to preserve current facing direction
        // This combines the cardinal animation with angular movement relative to current rotation
        if (DIAGONAL_STEP_ANIMATIONS.has(currentAnimation)) {
          // Diagonal step detected - apply relative rotation offset
          const baseRotationY = rotation ?? 0;
          let rotationOffset: number;
          
          if (currentAnimation === "step_forward_left") {
            rotationOffset = Math.PI / 4; // 45° left of current forward
          } else if (currentAnimation === "step_forward_right") {
            rotationOffset = -Math.PI / 4; // 45° right of current forward
          } else if (currentAnimation === "step_back_left") {
            rotationOffset = (3 * Math.PI) / 4; // 135° left of current forward (45° left of back)
          } else if (currentAnimation === "step_back_right") {
            rotationOffset = -(3 * Math.PI) / 4; // 135° right of current forward (45° right of back)
          } else {
            rotationOffset = 0; // Fallback: preserve current facing
          }
          
          setDiagonalRotationY(baseRotationY + rotationOffset);
        } else {
          // Clear diagonal rotation override for non-diagonal step animations
          setDiagonalRotationY(null);
        }
      } else {
        // Fallback to walk if step animation not found
        console.warn(
          `[SkeletalPlayer3D] Step animation not found for ${currentAnimation}, using walk fallback`
        );
        const walkAnim = getAnimation("walk");
        if (walkAnim) {
          setAnimState({
            currentAnimation: walkAnim,
            currentTime: 0,
            isPlaying: true,
            playbackSpeed: 1.0,
            previousKeyframeIndex: 0,
            nextKeyframeIndex: 1,
          });
        }
      }
    } else if (currentAnimation?.startsWith("stance_guard_")) {
      // Stance guard animation - 자세 방어 애니메이션
      // Note: PlayerAnimation type doesn't include "stance_guard_*" variants, but this check
      // exists for compatibility with internal animation state management. In practice,
      // the guard overlay is applied via the explicit stance prop in useFrame.
      // Play idle animation as base, overlay guard pose in useFrame
      const idleAnim = getAnimation("idle_stance");
      if (idleAnim) {
        setAnimState({
          currentAnimation: idleAnim, // Use idle as base animation
          currentTime: 0,
          isPlaying: true, // Keep playing for idle + breathing animation
          playbackSpeed: 0.5, // Slow breathing animation like idle
          previousKeyframeIndex: 0,
          nextKeyframeIndex: 1,
        });
      } else {
        // Fallback: no base animation available for guard stance.
        // Guard overlay (hands/pose) will still run without an underlying idle_stance clip.
        console.warn(
          "[SkeletalPlayer3D] idle_stance animation not found; applying guard overlay without base animation."
        );
        setAnimState({
          currentAnimation: null,
          currentTime: 0,
          isPlaying: false, // Set to false since no animation available
          playbackSpeed: 1.0,
          previousKeyframeIndex: 0,
          nextKeyframeIndex: 1,
        });
      }

      // Guard hands in open position
      setLeftHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.2)
      );
      setRightHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.OPEN, 0, 0.2)
      );
      
      // Clear diagonal rotation override for non-step animations
      setDiagonalRotationY(null);
    } else {
      // Idle animation - 대기 애니메이션
      const idleAnim = getAnimation("idle_stance");
      if (idleAnim) {
        setAnimState({
          currentAnimation: idleAnim,
          currentTime: 0,
          isPlaying: true,
          playbackSpeed: 0.5, // Slow breathing animation
          previousKeyframeIndex: 0,
          nextKeyframeIndex: 1,
        });
      } else {
        // Fallback: stop animation if idle_stance not found
        setAnimState((prev) => ({
          ...prev,
          isPlaying: false,
          currentTime: 0,
        }));
      }

      // Return to relaxed hand pose when idle
      setLeftHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.RELAXED, 0, 0.3)
      );
      setRightHandState((prev) =>
        updateHandAnimationState(prev, HandPoseType.RELAXED, 0, 0.3)
      );
      
      // Clear diagonal rotation override for non-step animations
      setDiagonalRotationY(null);
    }
  }, [currentAnimation, attackAnimation, isBlocking]);

  // Calculate sway position based on balance state
  const [swayPosition, setSwayPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [helplessRotation, setHelplessRotation] = useState<number>(0);

  // Animation loop using useFrame (60fps)
  useFrame((_state, delta) => {
    // Calculate sway/stumble based on balance state
    if (balance === "HELPLESS") {
      // Helpless state: pronounced stumbling motion
      swayTimeRef.current += delta;
      
      const { stumbleIntensity, stumbleSpeed, leanIntensity, lowerStance } =
        BALANCE_STATE_ANIMATION_CONSTANTS.HELPLESS;
      
      const swayX = Math.sin(swayTimeRef.current * stumbleSpeed) * stumbleIntensity;
      const swayY = Math.cos(swayTimeRef.current * stumbleSpeed * 0.5) * stumbleIntensity * 0.3 + lowerStance;
      const leanAngle = Math.sin(swayTimeRef.current * stumbleSpeed * 0.7) * leanIntensity;
      
      // Update periodically to reduce React re-renders while keeping helpless animation dramatic
      if (frameCounter.current % 2 === 0) {
        setSwayPosition([swayX, swayY, 0]);
        setHelplessRotation(leanAngle);
      }
    } else if (balance === "SHAKEN" || balance === "VULNERABLE") {
      // Shaken/Vulnerable state: subtle sway
      swayTimeRef.current += delta;
      
      const animConfig = balance === "SHAKEN"
        ? BALANCE_STATE_ANIMATION_CONSTANTS.SHAKEN
        : BALANCE_STATE_ANIMATION_CONSTANTS.VULNERABLE;
      
      const swayX = Math.sin(swayTimeRef.current * animConfig.swaySpeed) * animConfig.swayIntensity;
      const swayY = Math.cos(swayTimeRef.current * animConfig.swaySpeed * 0.8) * animConfig.swayIntensity * 0.5;
      
      // Update sway position periodically to reduce re-renders
      if (frameCounter.current % 2 === 0) {
        setSwayPosition([swayX, swayY, 0]);
        setHelplessRotation(0);
      }
    } else {
      // Smoothly return to neutral position
      if (frameCounter.current % 2 === 0 && hasSignificantSway(swayPosition, helplessRotation)) {
        setSwayPosition([swayPosition[0] * 0.95, swayPosition[1] * 0.95, 0]);
        setHelplessRotation(helplessRotation * 0.95);
      }
      
      // Reset sway time when not swaying
      if (!hasSignificantSway(swayPosition, helplessRotation)) {
        swayTimeRef.current = 0;
      }
    }

    // Update hand animation state at 60fps using refs to reduce React re-render frequency
    updateHandAnimationFrame(leftHandStateRef, setLeftHandState, delta);

    updateHandAnimationFrame(rightHandStateRef, setRightHandState, delta);

    // Update muscle system at 60fps
    if (currentAnimation === "attack" && attackAnimation) {
      muscleManager.current.update(attackAnimation, stamina, delta);
    } else if (currentAnimation === "defend" || isBlocking) {
      muscleManager.current.update("block", stamina, delta);
    } else if (
      currentAnimation === "walk" ||
      currentAnimation === "stance_change"
    ) {
      // Engage stance/leg/core muscles during movement and stance changes
      muscleManager.current.update("stance_change", stamina, delta);
    } else {
      muscleManager.current.relaxAllMuscles(delta);
    }

    // Sync muscle states to React state deterministically (every 10 frames at 60fps = ~6 times/sec)
    // to balance animation smoothness with performance and reduce GC pressure
    frameCounter.current = (frameCounter.current + 1) % 10;
    if (frameCounter.current === 0) {
      // Reuse scratch map from manager to avoid repeated allocations
      const scratchMap = muscleManager.current.getScratchMapForSync();
      setMuscleStates(scratchMap);
    }

    // Update skeletal animation (base animation)
    if (animState.isPlaying && animState.currentAnimation) {
      // Normal animation: Update animation time and get interpolated keyframe
      const result = updateAnimation(
        animState.currentAnimation,
        animTimeRef.current,
        delta,
        animState.playbackSpeed
      );

      // Apply keyframe to rig (base animation: idle, walk, etc.)
      applyKeyframeToRig(rig, result.keyframe);

      // Update time ref
      animTimeRef.current = result.time;

      // Handle animation completion - only update state when animation completes
      if (result.completed) {
        animTimeRef.current = 0;
        setAnimState((prev) => ({
          ...prev,
          isPlaying: false,
          currentTime: 0,
        }));

        // Trigger callback
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    }

    // Apply guard pose overlay on top of base animation
    // Guard is applied by default for idle/walk/stance/block/counter states,
    // but not during attack/defend/hit/death animations where specific arm positions are needed
    const shouldApplyGuard = currentAnimation !== "attack" 
      && currentAnimation !== "defend" 
      && currentAnimation !== "hit"
      && currentAnimation !== "death";
    
    if (shouldApplyGuard) {
      // Update breathing phase for guard poses (cycles through 0-1 based on time)
      breathingPhaseRef.current += delta * 0.5; // 0.5 Hz = 2 seconds per breath cycle
      if (breathingPhaseRef.current > 1.0) {
        breathingPhaseRef.current -= 1.0;
      }

      // Use the explicit stance prop for guard overlay rather than deriving it from currentAnimation.
      // currentAnimation is typed as PlayerAnimation and does not include the "stance_guard_*" variants,
      // so stance is the single source of truth for selecting the correct guard pose.
      const stanceToUse = stance;
      
      // Apply full guard pose overlay to maintain fighting stance during all movement
      // Each stance × laterality combination creates distinct appearance
      applyStanceGuardOverlay(rig, stanceToUse, breathingPhaseRef.current, laterality, FULL_GUARD_BLEND);
    }
  });

  // Use diagonal rotation override if set, otherwise use prop rotation
  const effectiveRotation = diagonalRotationY ?? rotation;

  return (
    <group
      position={position}
      rotation={[0, effectiveRotation, 0]}
      scale={[facing === "left" ? -scale : scale, scale, scale]}
      data-testid={`skeletal-player3d-${playerId}`}
    >
      {/* Inner group for sway animation and helpless lean */}
      <group position={swayPosition} rotation={[helplessRotation, 0, 0]}>
      {/* Stance aura effect */}
      <StanceAura stance={stance} intensity={ki / 100} animated />

      {/* Muscle system rendering with physical attributes for visual scaling */}
      <MuscleSystem 
        muscleStates={muscleStates} 
        isExhausted={stamina < 20}
        physicalAttributes={{
          muscleMass: physicalAttributes.muscleMass,
          fatMass: physicalAttributes.fatMass,
        }}
      />

      {/* Skeletal rig rendering with physical attributes for bone thickness */}
      <BoneRenderer
        rig={rig}
        color={bodyColor}
        showBones={true}
        renderMode={showSkeleton ? "debug" : "solid"}
        leftHandState={leftHandState}
        rightHandState={rightHandState}
        cameraDistance={10}
        facialExpression={calculatedExpression}
        facialDamage={calculatedFacialDamage}
        opponentPosition={opponentPos}
        enableFacialExpressions={enableFacialExpressions}
        enableEyeTracking={enableEyeTracking}
        physicalAttributes={{
          muscleMass: physicalAttributes.muscleMass,
          fatMass: physicalAttributes.fatMass,
        }}
      />

      {/* Blocking shield effect */}
      {isBlocking && (
        <mesh position={[0, 1.2, 0.3]}>
          <circleGeometry args={[0.5, 32]} />
          <meshBasicMaterial
            color={KOREAN_COLORS.PRIMARY_BLUE}
            transparent
            opacity={0.5}
            side={2}
          />
        </mesh>
      )}

      {/* Counter indicator */}
      {isCountering && (
        <mesh position={[0, 1.5, 0]}>
          <torusGeometry args={[0.4, 0.05, 8, 32]} />
          <meshBasicMaterial color={KOREAN_COLORS.ACCENT_PURPLE} />
        </mesh>
      )}

      {/* Player name overlay */}
      {showDetails && name && (
        <Html
          position={[0, 2.8, 0]}
          center
          distanceFactor={isMobile ? 15 : 10}
          occlude={false}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY.KOREAN,
              textAlign: "center",
              color: "white",
              textShadow: "0 0 4px rgba(0,0,0,0.8)",
            }}
          >
            {/* Player name */}
            <div
              style={{
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
              data-testid="player-name"
            >
              {name.korean}
            </div>

            {/* Trigram symbol */}
            {showStanceIndicator && (
              <div
                style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: toHexColor(stanceColor),
                }}
                data-testid="trigram-symbol"
              >
                {trigramSymbol}
              </div>
            )}

            {/* Combat state text */}
            {(isBlocking || isStunned || isCountering) && (
              <div
                style={{
                  fontSize: isMobile ? "10px" : "12px",
                  fontWeight: "bold",
                  color: "#ffff00",
                  marginTop: "4px",
                }}
                data-testid="combat-state"
              >
                {isBlocking ? "방어" : isStunned ? "기절" : "반격"}
              </div>
            )}
          </div>
        </Html>
      )}

      {/* State indicators (health, stamina, Ki, balance) */}
      {showDetails && (
        <PlayerStateIndicators
          health={health}
          maxHealth={maxHealth}
          stamina={stamina}
          ki={ki}
          balance={balance}
          consciousness={consciousness}
          pain={pain}
          bloodLoss={bloodLoss}
          isMobile={isMobile}
        />
      )}
      </group> {/* Close inner sway group */}
    </group>
  );
};

export default SkeletalPlayer3D;
