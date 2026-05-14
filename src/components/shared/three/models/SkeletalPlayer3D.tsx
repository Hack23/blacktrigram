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
  MAX_FRAME_DELTA_SECONDS,
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
import { getArchetypeSkinTone } from "../../../../utils/colorUtils";
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
  laterality, // Stance laterality (left/right foot forward)
}) => {
  const effectiveLaterality = laterality ?? "right";
  const physicalAttributes = useMemo(
    () => getArchetypePhysicalAttributes(archetype),
    [archetype],
  );

  const rig = useMemo<SkeletalRig>(
    () => createScaledHumanoidRig(physicalAttributes),
    [physicalAttributes],
  );


  const { updateRigAnimation, diagonalRotationY } = useSkeletalAnimation({
    currentAnimation,
    attackAnimation,
    isBlocking,
    stance,
    laterality: effectiveLaterality, // Pass laterality for animation mirroring
    onAnimationComplete,
  });

  const { leftHandState, rightHandState, updateHandAnimations } =
    useHandPoseTransitions({
      currentAnimation,
      attackAnimation,
      isBlocking,
    });


  const { swayPosition, helplessRotation, updateBalanceAnimations } =
    useBalanceAnimations({
      balance,
    });

  const { muscleStates, updateMuscleActivations } = useMuscleActivation({
    currentAnimation,
    attackAnimation,
    isBlocking,
    stamina,
  });

  const skinTone = useMemo(() => getArchetypeSkinTone(archetype), [archetype]);

  const bodyColor = useMemo(() => {
    if (isStunned) return KOREAN_COLORS.WARNING_YELLOW;
    if (health / maxHealth < 0.3) return KOREAN_COLORS.ACCENT_RED;
    if (ki / 100 > 0.8) return KOREAN_COLORS.PRIMARY_CYAN;
    return skinTone; // Use archetype skin tone instead of primary color
  }, [isStunned, health, maxHealth, ki, skinTone]);

  const stanceColor = useMemo(() => getStanceColor(stance), [stance]);
  const trigramSymbol = useMemo(() => getTrigramSymbol(stance), [stance]);

  const [justHit, setJustHit] = useState(false);
  const [justLanded, setJustLanded] = useState(false);
  const lastHealthRef = useRef(health);

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
      justLanded,
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

  const calculatedFacialDamage = useMemo(() => {
    return facialDamage ?? createDefaultFacialDamage();
  }, [facialDamage]);

  const opponentPos = useMemo(() => {
    if (opponentPosition) {
      return new THREE.Vector3(...opponentPosition);
    }
    return new THREE.Vector3(facing === "right" ? 5 : -5, 2, 0);
  }, [opponentPosition, facing]);


  const frameCounter = useRef(0);

  useFrame((_state, delta) => {
    const safeDelta = Math.min(delta, MAX_FRAME_DELTA_SECONDS);
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
        updatedFacing = lockFacing(bodyFacing);
      } else if (!shouldLock && bodyFacing.isLocked) {
        updatedFacing = unlockFacing(bodyFacing);
      }

      if (!updatedFacing.isLocked) {
        updatedFacing = updateFacingTowardOpponent(
          updatedFacing,
          playerPos,
          opponentPos,
          safeDelta,
          Date.now(),
        );
      }

      if (updatedFacing !== bodyFacing) {
        onBodyFacingUpdate(updatedFacing);
      }
    }


    frameCounter.current = (frameCounter.current + 1) % 10;

    updateRigAnimation(rig, safeDelta);

    updateHandAnimations(safeDelta);

    updateBalanceAnimations(safeDelta, frameCounter.current);

    updateMuscleActivations(safeDelta, frameCounter.current);

    if (bodyFacing) {
      const head = rig.bones.get("head");
      if (head) {
        const headRotation = getHeadAngleRadians(bodyFacing);
        head.rotation.y = headRotation;
      }
    }
  });

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
