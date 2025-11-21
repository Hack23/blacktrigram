/**
 * Player3DModel - 3D character representation for combat
 * 
 * Replaces PixiJS PlayerVisuals with Three.js 3D model
 * Uses simple geometries for performance while maintaining Korean aesthetic
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PlayerState } from "../../../systems";
import { TrigramStance } from "../../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { getArchetypeColors } from "../../../utils/colorUtils";

export interface Player3DModelProps {
  readonly playerState: PlayerState;
  readonly position?: [number, number, number];
  readonly scale?: number;
  readonly showDetails?: boolean;
  readonly animationState?: PlayerAnimationState;
  readonly facing?: "left" | "right";
  readonly showHealthBar?: boolean;
  readonly showStanceIndicator?: boolean;
}

export type PlayerAnimationState =
  | "idle"
  | "attack"
  | "defend"
  | "hit"
  | "stance_change"
  | "technique_execute"
  | "walk";

/**
 * Get stance-specific color from Korean theming
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
 * Player3DModel Component
 * Renders a 3D character model with Korean theming and combat animations
 */
export const Player3DModel: React.FC<Player3DModelProps> = ({
  playerState,
  position = [0, 0, 0],
  scale = 1.0,
  showDetails = true,
  animationState = "idle",
  facing = "right",
  showHealthBar = true,
  showStanceIndicator = true,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const attackTimeRef = useRef(0);

  // Get archetype colors
  const archetypeColors = useMemo(
    () => getArchetypeColors(playerState.archetype),
    [playerState.archetype]
  );

  // Calculate visual states
  const visualStates = useMemo(() => {
    const healthPercent = playerState.health / playerState.maxHealth;
    const kiPercent = playerState.ki / playerState.maxKi;

    return {
      healthPercent,
      kiPercent,
      isLowHealth: healthPercent < 0.3,
      isHighKi: kiPercent > 0.8,
      shouldGlow:
        playerState.isBlocking ||
        playerState.isCountering ||
        kiPercent > 0.7,
    };
  }, [playerState]);

  // Cache material reference on mount
  useEffect(() => {
    if (bodyRef.current && bodyRef.current.material) {
      if ("emissiveIntensity" in bodyRef.current.material) {
        bodyMaterialRef.current = bodyRef.current.material as THREE.MeshStandardMaterial;
      }
    }
  }, []);

  // Body color based on state
  const bodyColor = useMemo(() => {
    if (playerState.isStunned) return KOREAN_COLORS.WARNING_YELLOW;
    if (visualStates.isLowHealth) return KOREAN_COLORS.ACCENT_RED;
    if (visualStates.isHighKi) return KOREAN_COLORS.PRIMARY_CYAN;
    return archetypeColors.primary;
  }, [playerState, visualStates, archetypeColors]);

  // Stance color
  const stanceColor = useMemo(
    () => getStanceColor(playerState.currentStance),
    [playerState.currentStance]
  );

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
    if (animationState === "attack") {
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
    }

    // Hit animation - flash and recoil (using cached material)
    if (animationState === "hit") {
      const hitFlash = Math.sin(state.clock.elapsedTime * 20);
      if (bodyMaterialRef.current) {
        bodyMaterialRef.current.emissiveIntensity = Math.abs(hitFlash) * 0.5;
      }
    } else {
      if (bodyMaterialRef.current) {
        bodyMaterialRef.current.emissiveIntensity = 0.1;
      }
    }

    // Stance change animation - rotation pulse
    if (animationState === "stance_change") {
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
      groupRef.current.scale.set(
        (facing === "left" ? -1 : 1) * pulseScale * scale,
        pulseScale * scale,
        pulseScale * scale
      );
    }

    // Ki aura rotation
    if (visualStates.shouldGlow) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    } else {
      groupRef.current.rotation.y = 0;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Ki aura effect */}
      {visualStates.shouldGlow && (
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial
            color={KOREAN_COLORS.PRIMARY_CYAN}
            transparent
            opacity={0.2}
            wireframe
          />
        </mesh>
      )}

      {/* Main body (torso) */}
      <mesh ref={bodyRef} position={[0, 1, 0]} castShadow receiveShadow>
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
          animationState === "attack"
            ? [-0.4, 1.2, 0.3]
            : animationState === "defend"
            ? [-0.3, 1.4, 0.2]
            : [-0.4, 1.2, 0]
        }
        rotation={[0, 0, animationState === "attack" ? -0.5 : 0]}
        castShadow
      >
        <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh
        position={
          animationState === "attack"
            ? [0.4, 1.2, 0.3]
            : animationState === "defend"
            ? [0.3, 1.4, 0.2]
            : [0.4, 1.2, 0]
        }
        rotation={[0, 0, animationState === "attack" ? 0.5 : 0]}
        castShadow
      >
        <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Legs */}
      <mesh
        position={[-0.15, 0.4, 0]}
        rotation={[animationState === "walk" ? 0.2 : 0, 0, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.1, 0.7, 4, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh
        position={[0.15, 0.4, 0]}
        rotation={[animationState === "walk" ? -0.2 : 0, 0, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.1, 0.7, 4, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Blocking shield effect */}
      {playerState.isBlocking && (
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
      {playerState.isCountering && (
        <mesh position={[0, 1.5, 0]}>
          <torusGeometry args={[0.4, 0.05, 8, 32]} />
          <meshBasicMaterial
            color={KOREAN_COLORS.ACCENT_PURPLE}
          />
        </mesh>
      )}

      {/* Stance indicator ring */}
      {showStanceIndicator && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.5, 32]} />
          <meshBasicMaterial
            color={stanceColor}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Html overlay for text elements */}
      {showDetails && (
        <Html
          position={[0, 2.5, 0]}
          center
          distanceFactor={10}
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
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              {playerState.name.korean}
            </div>

            {/* Trigram symbol */}
            {showStanceIndicator && (
              <div
                style={{
                  fontSize: "16px",
                  color: `#${stanceColor.toString(16).padStart(6, "0")}`,
                }}
              >
                {getTrigramSymbol(playerState.currentStance)}
              </div>
            )}

            {/* Health bar */}
            {showHealthBar && (
              <div
                style={{
                  width: "60px",
                  height: "6px",
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: "3px",
                  overflow: "hidden",
                  margin: "4px auto 0",
                }}
              >
                <div
                  style={{
                    width: `${visualStates.healthPercent * 100}%`,
                    height: "100%",
                    background:
                      visualStates.healthPercent > 0.5
                        ? "#00ff00"
                        : visualStates.healthPercent > 0.25
                        ? "#ffff00"
                        : "#ff0000",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            )}

            {/* Combat state text */}
            {(playerState.isBlocking ||
              playerState.isStunned ||
              playerState.isCountering) && (
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#ffff00",
                  marginTop: "4px",
                }}
              >
                {playerState.isBlocking
                  ? "방어"
                  : playerState.isStunned
                  ? "기절"
                  : "반격"}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

export default Player3DModel;
