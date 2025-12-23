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
  createHumanoidRig,
  createInitialHandAnimationState,
  getAnimation,
  getExpressionFromCombatState,
  getTechniqueHandPose,
  updateAnimation,
  updateHandAnimationState,
} from "../../systems/animation";
import { MuscleActivationManager } from "../../systems/animation/MuscleActivation";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
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
  // Create skeletal rig
  const rig = useMemo<SkeletalRig>(() => createHumanoidRig(), []);

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
      }
    } else if (currentAnimation === "hit") {
      // Hit reaction - keep current pose but stop animation
      setAnimState((prev) => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
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
    }
  }, [currentAnimation, attackAnimation, isBlocking]);

  // Calculate sway position based on balance state
  const [swayPosition, setSwayPosition] = useState<[number, number, number]>([0, 0, 0]);

  // Animation loop using useFrame (60fps)
  useFrame((_state, delta) => {
    // Calculate sway based on balance state (for SHAKEN and VULNERABLE)
    if (balance === "SHAKEN" || balance === "VULNERABLE") {
      swayTimeRef.current += delta;
      
      const swayIntensity = balance === "SHAKEN" ? 0.02 : 0.04;
      const swaySpeed = balance === "SHAKEN" ? 2 : 3;
      
      const swayX = Math.sin(swayTimeRef.current * swaySpeed) * swayIntensity;
      const swayY = Math.cos(swayTimeRef.current * swaySpeed * 0.8) * swayIntensity * 0.5;
      
      // Update sway position periodically to reduce re-renders
      if (frameCounter.current % 2 === 0) {
        setSwayPosition([swayX, swayY, 0]);
      }
    } else {
      // Smoothly return to neutral position
      if (frameCounter.current % 2 === 0 && (Math.abs(swayPosition[0]) > 0.001 || Math.abs(swayPosition[1]) > 0.001)) {
        setSwayPosition([swayPosition[0] * 0.95, swayPosition[1] * 0.95, 0]);
      }
      
      // Reset sway time when not swaying
      if (Math.abs(swayPosition[0]) < 0.001 && Math.abs(swayPosition[1]) < 0.001) {
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

    // Update skeletal animation
    if (!animState.isPlaying || !animState.currentAnimation) {
      return;
    }

    // Update animation time and get interpolated keyframe
    const result = updateAnimation(
      animState.currentAnimation,
      animTimeRef.current,
      delta,
      animState.playbackSpeed
    );

    // Apply keyframe to rig
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
  });

  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
      scale={[facing === "left" ? -scale : scale, scale, scale]}
      data-testid={`skeletal-player3d-${playerId}`}
    >
      {/* Inner group for sway animation */}
      <group position={swayPosition}>
      {/* Stance aura effect */}
      <StanceAura stance={stance} intensity={ki / 100} animated />

      {/* Muscle system rendering */}
      <MuscleSystem muscleStates={muscleStates} isExhausted={stamina < 20} />

      {/* Skeletal rig rendering */}
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
