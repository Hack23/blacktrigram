/**
 * SkeletalPlayer3DWithLOD component with Level of Detail optimization
 *
 * Performance-optimized wrapper for SkeletalPlayer3D with 3 LOD levels:
 * - High detail (< 10m): Full skeletal rig with all muscles and clothing
 * - Medium detail (10-20m): Simplified skeleton with reduced muscle detail
 * - Low detail (> 20m): Basic capsule representation for distant characters
 *
 * Target performance: <5ms per character at 60fps
 *
 * @module components/shared/three/models/SkeletalPlayer3DWithLOD
 * @category 3D Components
 * @korean 레벨오브디테일플레이어3D
 */

import { Detailed } from "@react-three/drei";
import React, { useMemo } from "react";
import { getArchetypePhysicalAttributes } from "../../../../data/archetypePhysicalAttributes";
import { KOREAN_COLORS } from "../../../../types/constants";
import type { Player3DUnifiedProps } from "../../../../types/player-visual";
import { getArchetypeColors } from "../../../../utils/colorUtils";
import { SkeletalPlayer3D } from "./SkeletalPlayer3D";

/**
 * Props for SkeletalPlayer3DWithLOD component
 */
export interface SkeletalPlayer3DWithLODProps extends Player3DUnifiedProps {
  /** Attack animation name (for attack state) */
  readonly attackAnimation?: string;
  /** Show skeleton bones for debugging */
  readonly showSkeleton?: boolean;
  /** LOD distances in meters [close, medium, far] (default: [0, 10, 20]) */
  readonly lodDistances?: [number, number, number];
  /** Enable LOD system (default: true) */
  readonly enableLOD?: boolean;
}

/**
 * Level of Detail (LOD) variants for SkeletalPlayer3D
 */
export const SkeletalPlayer3DWithLOD: React.FC<SkeletalPlayer3DWithLODProps> = ({
  lodDistances = [0, 10, 20],
  enableLOD = true,
  ...playerProps
}) => {
  const {
    archetype,
    health,
    maxHealth,
    isStunned = false,
    ki,
    position,
    facing = "right",
    scale = 1,
  } = playerProps;

  // Get archetype attributes for LOD sizing
  const physicalAttributes = useMemo(
    () => getArchetypePhysicalAttributes(archetype),
    [archetype]
  );

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

  // LOD High Detail (< 10m): Full skeletal rig with all details
  const HighDetailPlayer = useMemo(
    () => (
      <SkeletalPlayer3D
        {...playerProps}
        showDetails={true}
      />
    ),
    [playerProps]
  );

  // LOD Medium Detail (10-20m): Simplified skeleton
  const MediumDetailPlayer = useMemo(
    () => (
      <SkeletalPlayer3D
        {...playerProps}
        showDetails={false} // Hide text overlays
        showStanceIndicator={false} // Hide stance symbol
      />
    ),
    [playerProps]
  );

  // LOD Low Detail (> 20m): Basic capsule mesh
  const LowDetailPlayer = useMemo(() => {
    const height = physicalAttributes.torsoLength + physicalAttributes.legLength;
    const radius = physicalAttributes.shoulderWidth / 4;

    return (
      <group
        position={position}
        rotation={[0, playerProps.rotation ?? 0, 0]}
        scale={[facing === "left" ? -scale : scale, scale, scale]}
        name={`lod-low-${playerProps.playerId}`}
      >
        <mesh castShadow>
          <capsuleGeometry args={[radius, height, 8, 16]} />
          <meshStandardMaterial
            color={bodyColor}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      </group>
    );
  }, [
    physicalAttributes,
    position,
    playerProps.rotation,
    playerProps.playerId,
    facing,
    scale,
    bodyColor,
  ]);

  // If LOD disabled, render full detail only
  if (!enableLOD) {
    return (
      <SkeletalPlayer3D
        {...playerProps}
        showDetails={true}
      />
    );
  }

  return (
    <Detailed distances={lodDistances}>
      {HighDetailPlayer}
      {MediumDetailPlayer}
      {LowDetailPlayer}
    </Detailed>
  );
};

export default SkeletalPlayer3DWithLOD;
