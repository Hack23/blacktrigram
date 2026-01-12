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
import { getArchetypePhysicalAttributes } from "../../../../data/archetypePhysicalAttributes";
import { useBalanceAnimations } from "../../../../hooks/useBalanceAnimations";
import { useHandPoseTransitions } from "../../../../hooks/useHandPoseTransitions";
import { useMuscleActivation } from "../../../../hooks/useMuscleActivation";
import { useSkeletalAnimation } from "../../../../hooks/useSkeletalAnimation";
import {
  createDefaultFacialDamage,
  createScaledHumanoidRig,
  getExpressionFromCombatState,
  getHeadAngleRadians,
  lockFacing,
  unlockFacing,
  updateFacingTowardOpponent,
} from "../../../../systems/animation";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { FacialExpression } from "../../../../types/facial";
import type { Player3DUnifiedProps } from "../../../../types/player-visual";
import type { SkeletalRig } from "../../../../types/skeletal";
import { toHexColor } from "../../../../utils/colorHelpers";
import { getArchetypeColors } from "../../../../utils/colorUtils";
import BoneRenderer from "../anatomy/BoneRenderer";
import PlayerStateIndicators from "../effects/PlayerStateIndicators";

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
  // laterality removed - guard positions now handled by stance animations
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
  bodyFacing,
  onBodyFacingUpdate,
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

  // ========================================
  // ANIMATION HOOKS - Modular animation system
  // ========================================

  // Base skeletal animation (idle, walk, attack, etc.)
  const { updateRigAnimation, diagonalRotationY } = useSkeletalAnimation({
    currentAnimation,
    attackAnimation,
    isBlocking,
    stance,
    onAnimationComplete,
  });

  // Hand pose transitions for both hands
  const { leftHandState, rightHandState, updateHandAnimations } =
    useHandPoseTransitions({
      currentAnimation,
      attackAnimation,
      isBlocking,
    });

  // NOTE: Guard pose overlay removed - stance animations built with MartialArtsAnimationBuilder
  // already include proper guard positions via transitionToStanceGuard()
  // 가드 포즈 오버레이 제거 - MartialArtsAnimationBuilder로 빌드된 자세 애니메이션에
  // transitionToStanceGuard()를 통한 적절한 가드 위치가 이미 포함되어 있음

  // Balance animations (sway, stumble, lean based on balance state)
  const { swayPosition, helplessRotation, updateBalanceAnimations } =
    useBalanceAnimations({
      balance,
    });

  // Muscle activation system
  const { muscleStates, updateMuscleActivations } = useMuscleActivation({
    currentAnimation,
    attackAnimation,
    isBlocking,
    stamina,
  });

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

  // ========================================
  // ANIMATION FRAME LOOP - Modular hook-based system
  // ========================================

  // Frame counter for periodic updates
  const frameCounter = useRef(0);

  // Animation loop using useFrame (60fps)
  useFrame((_state, delta) => {
    // Update body facing to track opponent (if enabled)
    // ONLY track opponent when NOT moving (walk animations handle their own direction)
    const isWalkingAnimation =
      currentAnimation === "walk" ||
      (typeof currentAnimation === "string" &&
        currentAnimation.startsWith("step_"));

    if (
      bodyFacing &&
      opponentPosition &&
      onBodyFacingUpdate &&
      !isWalkingAnimation
    ) {
      const playerPos = { x: position[0], y: position[2] }; // X and Z for 2D top-down
      const opponentPos = { x: opponentPosition[0], y: opponentPosition[2] };

      // Check if facing should be locked during committed animations
      const isStepAnimation =
        typeof currentAnimation === "string" &&
        currentAnimation.startsWith("step_");
      const isTurnAnimation =
        typeof currentAnimation === "string" &&
        currentAnimation.startsWith("turn_");

      const shouldLock =
        currentAnimation === "attack" ||
        currentAnimation === "defend" ||
        isStepAnimation ||
        isTurnAnimation;

      let updatedFacing = bodyFacing;

      if (shouldLock && !bodyFacing.isLocked) {
        // Lock facing at start of committed action (attack/defend/step/turn)
        updatedFacing = lockFacing(bodyFacing);
      } else if (!shouldLock && bodyFacing.isLocked) {
        // Unlock facing after committed action completes
        updatedFacing = unlockFacing(bodyFacing);
      }

      // Update facing direction (handles rotation speed, head tracking, turns)
      if (!updatedFacing.isLocked) {
        updatedFacing = updateFacingTowardOpponent(
          updatedFacing,
          playerPos,
          opponentPos,
          delta,
          Date.now()
        );
      }

      // Notify parent if facing changed
      if (updatedFacing !== bodyFacing) {
        onBodyFacingUpdate(updatedFacing);
      }
    }

    // ========================================
    // HOOK-BASED ANIMATION UPDATES (60fps)
    // ========================================

    // Update frame counter for periodic state sync
    frameCounter.current = (frameCounter.current + 1) % 10;

    // 1. Base skeletal animation (idle, walk, attack, etc.)
    // Stance-specific guard positions are built into the MartialArtsAnimationBuilder animations
    // 자세별 가드 위치가 MartialArtsAnimationBuilder 애니메이션에 포함됨
    updateRigAnimation(rig, delta);

    // 2. Hand pose transitions
    updateHandAnimations(delta);

    // 3. Balance animations (sway, stumble, lean)
    updateBalanceAnimations(delta, frameCounter.current);

    // 5. Muscle activation states
    updateMuscleActivations(delta, frameCounter.current);

    // Apply head rotation toward opponent (if body facing tracking is enabled)
    // Note: Torso rotation is now handled by guard pose overlay for proper stance positioning
    // Only the head tracks the opponent independently for natural looking
    if (bodyFacing) {
      // Apply head rotation to head bone (includes independent offset)
      // Head can track ±45° independently from torso for natural looking
      const head = rig.bones.get("head");
      if (head) {
        const headRotation = getHeadAngleRadians(bodyFacing);
        head.rotation.y = headRotation;
      }
    }
  });

  // Use diagonal rotation override if set, otherwise use prop rotation
  const effectiveRotation = diagonalRotationY ?? rotation;

  return (
    <group
      position={position}
      rotation={[0, effectiveRotation, 0]}
      scale={[facing === "left" ? -scale : scale, scale, scale]}
      name={`skeletal-player3d-${playerId}`}
    >
      {/* Inner group for sway animation and helpless lean */}
      <group position={swayPosition} rotation={[helplessRotation, 0, 0]}>
        {/* Skeletal rig rendering with bone-attached muscles */}
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
            shoulderWidth: physicalAttributes.shoulderWidth,
            torsoLength: physicalAttributes.torsoLength,
            armLength: physicalAttributes.armLength,
            legLength: physicalAttributes.legLength,
          }}
          muscleStates={muscleStates}
          isExhausted={stamina < 20}
          archetype={archetype}
        />

        {/* Clothing is now rendered via BoneClothing inside BoneRenderer */}
        {/* This ensures clothing inherits bone transforms automatically */}

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
      </group>{" "}
      {/* Close inner sway group */}
    </group>
  );
};

export default SkeletalPlayer3D;
