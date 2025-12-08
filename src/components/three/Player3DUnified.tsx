/**
 * Player3DUnified - Unified 3D player visual component
 * 
 * Provides a complete, reusable 3D player representation for use in both
 * CombatScreen3D and TrainingScreen3D. Includes body mesh, stance aura,
 * state indicators, and animations.
 * 
 * @module components/three/Player3DUnified
 * @category 3D Components
 * @korean 통합플레이어3D
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { TrigramStance } from "../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
import type { Player3DUnifiedProps } from "../../types/player-visual";
import { getArchetypeColors } from "../../utils/colorUtils";
import PlayerStateIndicators from "./PlayerStateIndicators";
import StanceAura from "./StanceAura";

/**
 * Get stance-specific color from Korean theming
 * 
 * @param stance - Current trigram stance
 * @returns Hex color number
 * @korean 자세색상가져오기
 */
const getStanceColor = (stance: TrigramStance): number => {
  const stanceColors = {
    [TrigramStance.GEON]: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
    [TrigramStance.TAE]: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
    [TrigramStance.LI]: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,
    [TrigramStance.JIN]: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
    [TrigramStance.SON]: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
    [TrigramStance.GAM]: KOREAN_COLORS.TRIGRAM_GAM_PRIMARY,
    [TrigramStance.GAN]: KOREAN_COLORS.TRIGRAM_GAN_PRIMARY,
    [TrigramStance.GON]: KOREAN_COLORS.TRIGRAM_GON_PRIMARY,
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
const getTrigramSymbol = (stance: TrigramStance): string => {
  const symbols = {
    [TrigramStance.GEON]: "☰",
    [TrigramStance.TAE]: "☱",
    [TrigramStance.LI]: "☲",
    [TrigramStance.JIN]: "☳",
    [TrigramStance.SON]: "☴",
    [TrigramStance.GAM]: "☵",
    [TrigramStance.GAN]: "☶",
    [TrigramStance.GON]: "☷",
  };
  return symbols[stance] ?? "☰";
};

/**
 * Player3DUnified Component
 * 
 * Complete unified 3D player representation with:
 * - Body mesh with archetype-specific styling
 * - Stance aura effect (8 trigrams)
 * - State indicators (health, stamina, Ki, balance)
 * - Combat animations (attack, defend, hit, etc.)
 * - Pain/balance/consciousness visualization
 * 
 * @example
 * ```tsx
 * <Player3DUnified
 *   playerId="player1"
 *   archetype={PlayerArchetype.MUSA}
 *   stance={TrigramStance.GEON}
 *   position={[0, 0, 0]}
 *   rotation={0}
 *   health={85}
 *   maxHealth={100}
 *   stamina={60}
 *   ki={40}
 *   pain={20}
 *   balance="READY"
 *   consciousness={100}
 *   bloodLoss={0}
 *   isBlocking={false}
 *   isAttacking={false}
 *   currentAnimation="idle"
 *   isMobile={false}
 * />
 * ```
 * 
 * @korean 통합플레이어3D컴포넌트
 */
export const Player3DUnified: React.FC<Player3DUnifiedProps> = ({
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
  scale = 1.0,
  showDetails = true,
  facing = "right",
  showStanceIndicator = true,
  onAnimationComplete,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const attackTimeRef = useRef(0);
  const lastAnimationRef = useRef(currentAnimation);

  // Get archetype colors
  const archetypeColors = useMemo(
    () => getArchetypeColors(archetype),
    [archetype]
  );

  // Calculate visual states
  const visualStates = useMemo(() => {
    const healthPercent = health / maxHealth;
    const kiPercent = ki / 100;
    const consciousnessPercent = consciousness / 100;

    return {
      healthPercent,
      kiPercent,
      consciousnessPercent,
      isLowHealth: healthPercent < 0.3,
      isHighKi: kiPercent > 0.8,
      shouldGlow: isBlocking || isCountering || kiPercent > 0.7,
      isDazed: consciousnessPercent < 0.7,
    };
  }, [health, maxHealth, ki, consciousness, isBlocking, isCountering]);

  // Cache material reference on mount
  useEffect(() => {
    if (bodyRef.current?.material) {
      if ("emissiveIntensity" in bodyRef.current.material) {
        bodyMaterialRef.current = bodyRef.current
          .material as THREE.MeshStandardMaterial;
      }
    }
  }, []);

  // Body color based on state
  const bodyColor = useMemo(() => {
    if (isStunned) return KOREAN_COLORS.WARNING_YELLOW;
    if (visualStates.isLowHealth) return KOREAN_COLORS.ACCENT_RED;
    if (visualStates.isHighKi) return KOREAN_COLORS.PRIMARY_CYAN;
    return archetypeColors.primary;
  }, [
    isStunned,
    visualStates.isLowHealth,
    visualStates.isHighKi,
    archetypeColors.primary,
  ]);

  // Stance color
  const stanceColor = useMemo(() => getStanceColor(stance), [stance]);
  const trigramSymbol = useMemo(() => getTrigramSymbol(stance), [stance]);

  // Reset attack animation timer when animation state changes
  useEffect(() => {
    if (currentAnimation !== "attack") {
      attackTimeRef.current = 0;
    }

    // Trigger animation complete callback if animation changed
    if (
      lastAnimationRef.current !== currentAnimation &&
      onAnimationComplete
    ) {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 500); // Animation duration
      return () => clearTimeout(timer);
    }

    lastAnimationRef.current = currentAnimation;
  }, [currentAnimation, onAnimationComplete]);

  // Animation loop using useFrame (60fps)
  useFrame((state, delta) => {
    if (!groupRef.current || !bodyRef.current) return;

    // Breathing animation
    const breathScale = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 1;
    groupRef.current.scale.y = breathScale * scale;

    // Facing direction
    groupRef.current.scale.x = facing === "left" ? -scale : scale;
    groupRef.current.scale.z = scale;

    // Attack animation
    if (currentAnimation === "attack") {
      attackTimeRef.current += delta;
      const attackProgress = attackTimeRef.current / 0.5; // 500ms attack

      if (attackProgress < 1) {
        // Lunge forward
        bodyRef.current.position.z = Math.sin(attackProgress * Math.PI) * 0.5;
      } else {
        // Reset
        bodyRef.current.position.z = 0;
        attackTimeRef.current = 0;
      }
    } else {
      bodyRef.current.position.z = 0;
    }

    // Hit animation - flash and recoil (using cached material)
    if (currentAnimation === "hit") {
      const hitFlash = Math.sin(state.clock.elapsedTime * 20);
      if (bodyMaterialRef.current) {
        bodyMaterialRef.current.emissiveIntensity = Math.abs(hitFlash) * 0.5;
      }
      // Recoil backward
      bodyRef.current.position.z = Math.sin(state.clock.elapsedTime * 20) * -0.1;
    } else {
      if (bodyMaterialRef.current) {
        bodyMaterialRef.current.emissiveIntensity = visualStates.shouldGlow ? 0.3 : 0.1;
      }
    }

    // Stance change animation - rotation pulse
    if (currentAnimation === "stance_change") {
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
      groupRef.current.scale.set(
        (facing === "left" ? -1 : 1) * pulseScale * scale,
        pulseScale * scale,
        pulseScale * scale
      );
    }

    // Ki aura rotation
    if (visualStates.shouldGlow) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    } else {
      groupRef.current.rotation.y = 0;
    }

    // Balance state wobble
    if (balance === "SHAKEN" || balance === "VULNERABLE") {
      const wobble = Math.sin(state.clock.elapsedTime * 5) * 0.05;
      groupRef.current.rotation.z = wobble;
    } else if (balance === "HELPLESS") {
      // Extreme wobble when helpless
      const extremeWobble = Math.sin(state.clock.elapsedTime * 8) * 0.15;
      groupRef.current.rotation.z = extremeWobble;
    } else {
      groupRef.current.rotation.z = 0;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, rotation, 0]}
      data-testid={`player3d-${playerId}`}
    >
      {/* Stance aura effect */}
      <StanceAura stance={stance} intensity={ki / 100} animated />

      {/* Main body (torso) */}
      <mesh
        ref={bodyRef}
        position={[0, 1, 0]}
        castShadow
        receiveShadow
        data-testid="player-body"
      >
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive={bodyColor}
          emissiveIntensity={0.1}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={
            visualStates.isLowHealth
              ? KOREAN_COLORS.ACCENT_RED
              : archetypeColors.secondary
          }
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Arms */}
      <mesh
        position={
          currentAnimation === "attack"
            ? [-0.4, 1.2, 0.3]
            : currentAnimation === "defend" || isBlocking
            ? [-0.3, 1.4, 0.2]
            : [-0.4, 1.2, 0]
        }
        rotation={[0, 0, currentAnimation === "attack" ? -0.5 : 0]}
        castShadow
      >
        <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh
        position={
          currentAnimation === "attack"
            ? [0.4, 1.2, 0.3]
            : currentAnimation === "defend" || isBlocking
            ? [0.3, 1.4, 0.2]
            : [0.4, 1.2, 0]
        }
        rotation={[0, 0, currentAnimation === "attack" ? 0.5 : 0]}
        castShadow
      >
        <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Legs */}
      <mesh
        position={[-0.15, 0.4, 0]}
        rotation={[currentAnimation === "walk" ? 0.2 : 0, 0, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.1, 0.7, 4, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh
        position={[0.15, 0.4, 0]}
        rotation={[currentAnimation === "walk" ? -0.2 : 0, 0, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.1, 0.7, 4, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Blocking shield effect */}
      {isBlocking && (
        <mesh position={[0, 1.2, 0.3]}>
          <circleGeometry args={[0.5, 32]} />
          <meshBasicMaterial
            color={KOREAN_COLORS.PRIMARY_BLUE}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
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
                  color: `#${stanceColor.toString(16).padStart(6, "0")}`,
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

export default Player3DUnified;
