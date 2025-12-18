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
import React, { useEffect, useMemo, useState } from "react";
import {
  createHumanoidRig,
  getAnimation,
  applyKeyframeToRig,
  updateAnimation,
} from "../../systems/animation";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
import type { SkeletalRig, SkeletalAnimationState } from "../../types/skeletal";
import type { Player3DUnifiedProps } from "../../types/player-visual";
import { toHexColor } from "../../utils/colorHelpers";
import { getArchetypeColors } from "../../utils/colorUtils";
import BoneRenderer from "./BoneRenderer";
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
}) => {
  // Create skeletal rig
  const rig = useMemo<SkeletalRig>(() => createHumanoidRig(), []);

  // Animation state
  const [animState, setAnimState] = useState<SkeletalAnimationState>({
    currentAnimation: null,
    currentTime: 0,
    isPlaying: false,
    playbackSpeed: 1.0,
    previousKeyframeIndex: 0,
    nextKeyframeIndex: 1,
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
  }, [
    isStunned,
    health,
    maxHealth,
    ki,
    archetypeColors.primary,
  ]);

  // Stance color
  const stanceColor = useMemo(() => getStanceColor(stance), [stance]);
  const trigramSymbol = useMemo(() => getTrigramSymbol(stance), [stance]);

  // Load attack animation when currentAnimation changes
  useEffect(() => {
    if (currentAnimation === "attack" && attackAnimation) {
      const anim = getAnimation(attackAnimation);
      if (anim) {
        setAnimState({
          currentAnimation: anim,
          currentTime: 0,
          isPlaying: true,
          playbackSpeed: 1.0,
          previousKeyframeIndex: 0,
          nextKeyframeIndex: 1,
        });
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
      }
    } else {
      // Reset to idle
      setAnimState((prev) => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    }
  }, [currentAnimation, attackAnimation, isBlocking]);

  // Animation loop using useFrame (60fps)
  useFrame((_state, delta) => {
    if (!animState.isPlaying || !animState.currentAnimation) {
      return;
    }

    // Update animation time and get interpolated keyframe
    const result = updateAnimation(
      animState.currentAnimation,
      animState.currentTime,
      delta,
      animState.playbackSpeed
    );

    // Apply keyframe to rig
    applyKeyframeToRig(rig, result.keyframe);

    // Update animation state
    setAnimState((prev) => ({
      ...prev,
      currentTime: result.time,
    }));

    // Handle animation completion
    if (result.completed) {
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
      {/* Stance aura effect */}
      <StanceAura stance={stance} intensity={ki / 100} animated />

      {/* Skeletal rig rendering */}
      <BoneRenderer
        rig={rig}
        color={bodyColor}
        showBones={true}
        renderMode={showSkeleton ? "debug" : "solid"}
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
    </group>
  );
};

export default SkeletalPlayer3D;
