import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants/colors";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import type { TrigramStanceData } from "../../../../systems/trigram/types";
import { TrigramStance } from "../../../../types/common";

export interface TrigramSymbol3DProps {
  readonly trigram: TrigramStanceData;
  readonly stance: TrigramStance; // The trigram stance key for test IDs
  readonly position: [number, number, number];
  readonly isSelected: boolean;
  readonly isHovered: boolean;
  readonly onClick?: () => void;
  readonly onPointerOver?: () => void;
  readonly onPointerOut?: () => void;
  readonly scale?: number;
}

/**
 * 3D Trigram Symbol Component
 * 
 * **Korean**: 3D 트라이그램 심볼
 * 
 * Renders an individual trigram symbol in 3D space with:
 * - Smooth rotation animation at 60fps
 * - Color changes based on selection and hover state
 * - Particle glow effects for mystical feel
 * - Korean cyberpunk aesthetic with neon glow
 * - Html overlay for the trigram symbol character
 * 
 * Performance optimizations:
 * - Memoized geometries and materials
 * - useFrame for efficient 60fps animation
 * - Smooth lerp transitions for scale changes
 * 
 * @example
 * ```typescript
 * <TrigramSymbol3D
 *   trigram={TRIGRAM_DATA[TrigramStance.GEON]}
 *   stance={TrigramStance.GEON}
 *   position={[0, 0, 0]}
 *   isSelected={false}
 *   isHovered={true}
 *   onClick={() => console.log("Clicked")}
 * />
 * ```
 * 
 * @public
 * @category Philosophy Components
 */
export const TrigramSymbol3D: React.FC<TrigramSymbol3DProps> = ({
  trigram,
  stance,
  position,
  isSelected,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut,
  scale = 1,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Memoize target scales to avoid recreation in useFrame
  const targetScaleSelected = useMemo(
    () => new THREE.Vector3(1.5 * scale, 1.5 * scale, 1.5 * scale),
    [scale]
  );
  const targetScaleHovered = useMemo(
    () => new THREE.Vector3(1.2 * scale, 1.2 * scale, 1.2 * scale),
    [scale]
  );
  const targetScaleNormal = useMemo(
    () => new THREE.Vector3(1 * scale, 1 * scale, 1 * scale),
    [scale]
  );

  // Memoize material properties and color strings
  const materialConfig = useMemo(() => {
    const baseColor = trigram.theme.primary;
    const emissiveColor = isSelected
      ? KOREAN_COLORS.ACCENT_GOLD
      : KOREAN_COLORS.PRIMARY_CYAN;
    const emissiveIntensity = isSelected ? 0.8 : isHovered ? 0.5 : 0.2;

    return {
      color: baseColor,
      emissive: emissiveColor,
      emissiveIntensity,
      metalness: 0.7,
      roughness: 0.3,
      // Pre-calculate color strings for Html overlay
      symbolColor: `#${baseColor.toString(16).padStart(6, "0")}`,
      glowColor: isSelected
        ? `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`
        : `#${baseColor.toString(16).padStart(6, "0")}`,
    };
  }, [trigram.theme.primary, isSelected, isHovered]);

  // 60fps animation loop
  useFrame((state, delta) => {
    if (!meshRef.current || !glowRef.current) return;

    // Smooth rotation
    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.rotation.x += delta * 0.2;

    // Glow rotation in opposite direction
    glowRef.current.rotation.y -= delta * 0.3;

    // Scale animation with lerp for smooth transitions
    let targetScale = targetScaleNormal;
    if (isSelected) {
      targetScale = targetScaleSelected;
    } else if (isHovered) {
      targetScale = targetScaleHovered;
    }
    meshRef.current.scale.lerp(targetScale, 0.1);

    // Pulsing glow effect
    const pulseFactor = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
    glowRef.current.scale.set(1.3 * pulseFactor, 1.3 * pulseFactor, 1.3 * pulseFactor);
  });

  return (
    <group position={position}>
      {/* Main trigram mesh */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        castShadow
        receiveShadow
        data-testid={`trigram-symbol-${stance}`}
      >
        <boxGeometry args={[1, 1, 0.15]} />
        <meshStandardMaterial
          color={materialConfig.color}
          emissive={materialConfig.emissive}
          emissiveIntensity={materialConfig.emissiveIntensity}
          metalness={materialConfig.metalness}
          roughness={materialConfig.roughness}
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef}>
        <boxGeometry args={[1.3, 1.3, 0.1]} />
        <meshBasicMaterial
          color={isSelected ? KOREAN_COLORS.ACCENT_GOLD : trigram.theme.primary}
          transparent
          opacity={isSelected ? 0.3 : isHovered ? 0.2 : 0.1}
        />
      </mesh>

      {/* Html overlay for trigram symbol and name */}
      <Html
        center
        position={[0, 0.8, 0]}
        style={{
          pointerEvents: "none",
          userSelect: "none",
        }}
        data-testid={`trigram-symbol-overlay-${stance}`}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {/* Trigram symbol */}
          <div
            style={{
              fontSize: isSelected ? "48px" : isHovered ? "40px" : "36px",
              color: materialConfig.symbolColor,
              textShadow: `0 0 20px ${materialConfig.glowColor}`,
              transition: "all 0.3s ease",
              fontWeight: "bold",
            }}
          >
            {trigram.symbol}
          </div>

          {/* Korean name */}
          <div
            style={{
              fontSize: isSelected ? "16px" : "14px",
              color: "#ffffff",
              textShadow: `0 0 10px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)}`,
              fontWeight: "bold",
              whiteSpace: "nowrap",
              transition: "all 0.3s ease",
            }}
          >
            {trigram.name.korean}
          </div>
        </div>
      </Html>
    </group>
  );
};

export default TrigramSymbol3D;
