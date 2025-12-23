/**
 * TraumaOverlay3D - Bruising and injury visualization system
 *
 * Renders progressive bruising, cuts, and bone fracture indicators on 3D character models
 * using shader-based texture overlays with color blending. Bruises darken with repeated
 * hits to the same body region and persist across combat rounds.
 *
 * Features:
 * - Progressive bruising (purple/black gradients)
 * - Cut/laceration marks for sharp strikes
 * - Bone fracture indicators at <30% health
 * - Injury persistence across rounds
 * - Korean-themed injury visualization
 *
 * @module components/combat/TraumaOverlay3D
 * @category Combat Effects
 * @korean 외상오버레이3D
 */

import { Html } from "@react-three/drei";
import React, { useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../types/constants";
import { BodyRegion } from "../../../types/common";

/**
 * Injury type classification
 */
export enum InjuryType {
  BRUISE = "bruise",          // Blunt force trauma
  CUT = "cut",                // Sharp weapon/strike
  LACERATION = "laceration",  // Deep cut with blood trail
  FRACTURE = "fracture",      // Bone damage indicator
}

/**
 * Individual injury data
 */
export interface Injury {
  /** Unique identifier */
  readonly id: string;
  /** Body region affected */
  readonly region: BodyRegion;
  /** Type of injury */
  readonly type: InjuryType;
  /** Position on body [x, y, z] relative to character center */
  readonly position: [number, number, number];
  /** Severity (0.0 to 1.0) */
  readonly severity: number;
  /** Number of hits to same location (for progressive bruising) */
  readonly hitCount: number;
  /** Timestamp when injury was created */
  readonly timestamp: number;
}

/**
 * Props for TraumaOverlay3D component
 */
export interface TraumaOverlay3DProps {
  /** Character ID for injury tracking */
  readonly playerId: string;
  /** Current health (0-100) */
  readonly health: number;
  /** Active injuries to visualize */
  readonly injuries: readonly Injury[];
  /** Character position in world space */
  readonly characterPosition: [number, number, number];
  /** Whether character is mobile (simplified visualization) */
  readonly isMobile?: boolean;
  /** Whether to show fracture indicators */
  readonly showFractures?: boolean;
}

/**
 * Color constants for injury visualization
 */
const INJURY_COLORS = {
  BRUISE_FRESH: 0x8B0000,      // Dark red (fresh bruise)
  BRUISE_OLD: 0x4B0082,        // Indigo (aging bruise)
  BRUISE_SEVERE: 0x000000,     // Black (severe bruising)
  CUT_COLOR: 0xFF0000,         // Bright red (cut)
  FRACTURE_INDICATOR: KOREAN_COLORS.ACCENT_GOLD, // Gold (bone fracture)
} as const;

/**
 * Get bruise color based on severity and hit count
 */
const getBruiseColor = (severity: number, hitCount: number): number => {
  if (hitCount >= 3 || severity > 0.8) {
    return INJURY_COLORS.BRUISE_SEVERE; // Black for severe/repeated trauma
  } else if (hitCount >= 2 || severity > 0.5) {
    return INJURY_COLORS.BRUISE_OLD; // Indigo for moderate bruising
  } else {
    return INJURY_COLORS.BRUISE_FRESH; // Dark red for fresh bruise
  }
};

/**
 * Get injury size based on severity
 */
const getInjurySize = (severity: number): number => {
  return 0.1 + severity * 0.3; // 0.1 to 0.4 units
};

/**
 * InjuryMarker - Individual injury visualization
 */
const InjuryMarker: React.FC<{
  injury: Injury;
  characterPosition: [number, number, number];
  isMobile: boolean;
}> = ({ injury, characterPosition, isMobile }) => {
  // Calculate world position relative to character
  const worldPosition: [number, number, number] = useMemo(() => {
    return [
      characterPosition[0] + injury.position[0],
      characterPosition[1] + injury.position[1],
      characterPosition[2] + injury.position[2],
    ];
  }, [characterPosition, injury.position]);

  const size = useMemo(() => getInjurySize(injury.severity), [injury.severity]);

  // Render based on injury type
  switch (injury.type) {
    case InjuryType.BRUISE: {
      const color = getBruiseColor(injury.severity, injury.hitCount);
      const opacity = Math.min(0.8, 0.3 + injury.severity * 0.5);

      return (
        <mesh position={worldPosition} data-testid={`injury-${injury.id}`}>
          <sphereGeometry args={[size, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={opacity}
            depthTest={true}
          />
        </mesh>
      );
    }

    case InjuryType.CUT:
    case InjuryType.LACERATION: {
      const cutLength = injury.type === InjuryType.LACERATION ? size * 3 : size * 2;
      return (
        <group position={worldPosition} data-testid={`injury-${injury.id}`}>
          {/* Cut mark - thin red line */}
          <mesh>
            <boxGeometry args={[cutLength, 0.02, 0.02]} />
            <meshBasicMaterial
              color={INJURY_COLORS.CUT_COLOR}
              transparent
              opacity={0.9}
            />
          </mesh>
          {/* Blood trail for lacerations */}
          {injury.type === InjuryType.LACERATION && (
            <mesh position={[0, -size * 0.5, 0]}>
              <boxGeometry args={[0.02, size, 0.02]} />
              <meshBasicMaterial
                color={KOREAN_COLORS.BLOODLOSS_INDICATOR}
                transparent
                opacity={0.7}
              />
            </mesh>
          )}
        </group>
      );
    }

    case InjuryType.FRACTURE: {
      return (
        <group position={worldPosition} data-testid={`injury-${injury.id}`}>
          {/* Fracture indicator - pulsing gold ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 0.8, size, 16]} />
            <meshBasicMaterial
              color={INJURY_COLORS.FRACTURE_INDICATOR}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Cross indicator */}
          <mesh>
            <boxGeometry args={[size * 2, 0.02, 0.02]} />
            <meshBasicMaterial
              color={INJURY_COLORS.FRACTURE_INDICATOR}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[size * 2, 0.02, 0.02]} />
            <meshBasicMaterial
              color={INJURY_COLORS.FRACTURE_INDICATOR}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      );
    }

    default:
      return null;
  }
};

/**
 * FractureWarning - Html overlay warning for critical bone damage
 */
const FractureWarning: React.FC<{
  health: number;
  isMobile: boolean;
}> = ({ health, isMobile }) => {
  if (health >= 30) return null;

  const warningOpacity = useMemo(() => {
    // Pulse more intensely as health drops
    return 0.5 + (30 - health) / 60; // 0.5 at 30% health, 1.0 at 0% health
  }, [health]);

  return (
    <Html center position={[0, 2.5, 0]}>
      <div
        style={{
          padding: isMobile ? "8px 12px" : "10px 16px",
          backgroundColor: `rgba(255, 200, 0, ${warningOpacity * 0.3})`,
          border: `2px solid ${THREE.ColorManagement.toWorkingColorSpace(
            new THREE.Color(INJURY_COLORS.FRACTURE_INDICATOR),
            THREE.SRGBColorSpace
          ).getHexString()}`,
          borderRadius: "6px",
          fontSize: isMobile ? "12px" : "14px",
          color: "#FFD700",
          fontWeight: "bold",
          textShadow: "0 0 4px rgba(0,0,0,0.8)",
          animation: "fracturePulse 1s ease-in-out infinite",
        }}
        data-testid="fracture-warning"
      >
        ⚠️ 골절위험 | Bone Fracture Risk
      </div>
      <style>
        {`
          @keyframes fracturePulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
        `}
      </style>
    </Html>
  );
};

/**
 * TraumaOverlay3D Component
 *
 * Visualizes progressive combat trauma including bruising, cuts, and bone damage
 * on 3D character models. Injuries persist across rounds and darken with repeated
 * hits to the same body region.
 *
 * @example
 * ```tsx
 * const [injuries, setInjuries] = useState<Injury[]>([]);
 *
 * // On hit event
 * const handleHit = (region: BodyRegion, position: [number, number, number], type: InjuryType) => {
 *   const existingInjury = injuries.find(i => 
 *     i.region === region && 
 *     distance(i.position, position) < 0.2
 *   );
 *
 *   if (existingInjury) {
 *     // Progressive bruising - increase hit count
 *     setInjuries(prev => prev.map(i => 
 *       i.id === existingInjury.id 
 *         ? { ...i, hitCount: i.hitCount + 1, severity: Math.min(1.0, i.severity + 0.2) }
 *         : i
 *     ));
 *   } else {
 *     // New injury
 *     setInjuries([...injuries, {
 *       id: generateId(),
 *       region,
 *       type,
 *       position,
 *       severity: 0.5,
 *       hitCount: 1,
 *       timestamp: Date.now(),
 *     }]);
 *   }
 * };
 *
 * <TraumaOverlay3D
 *   playerId={playerId}
 *   health={playerHealth}
 *   injuries={injuries}
 *   characterPosition={characterPosition}
 *   isMobile={isMobile}
 *   showFractures={true}
 * />
 * ```
 */
export const TraumaOverlay3D: React.FC<TraumaOverlay3DProps> = ({
  playerId,
  health,
  injuries,
  characterPosition,
  isMobile = false,
  showFractures = true,
}) => {
  // Filter injuries for this player
  const playerInjuries = useMemo(() => {
    // In multi-player scenarios, filter by player
    // For now, show all injuries on the character
    return injuries;
  }, [injuries]);

  // Separate fractures from other injuries
  const { fractures, otherInjuries } = useMemo(() => {
    const frac = playerInjuries.filter((i) => i.type === InjuryType.FRACTURE);
    const other = playerInjuries.filter((i) => i.type !== InjuryType.FRACTURE);
    return { fractures: frac, otherInjuries: other };
  }, [playerInjuries]);

  return (
    <group data-testid={`trauma-overlay-${playerId}`}>
      {/* Render non-fracture injuries */}
      {otherInjuries.map((injury) => (
        <InjuryMarker
          key={injury.id}
          injury={injury}
          characterPosition={characterPosition}
          isMobile={isMobile}
        />
      ))}

      {/* Render fractures if enabled and health is critical */}
      {showFractures &&
        health < 30 &&
        fractures.map((injury) => (
          <InjuryMarker
            key={injury.id}
            injury={injury}
            characterPosition={characterPosition}
            isMobile={isMobile}
          />
        ))}

      {/* Fracture warning overlay */}
      {showFractures && health < 30 && fractures.length > 0 && (
        <FractureWarning health={health} isMobile={isMobile} />
      )}
    </group>
  );
};

export default TraumaOverlay3D;
