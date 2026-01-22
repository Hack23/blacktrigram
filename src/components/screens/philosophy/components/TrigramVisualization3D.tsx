import { OrbitControls } from "@react-three/drei";
import React, { useState, useMemo } from "react";
import { TRIGRAM_DATA } from "../../../../systems/trigram/types";
import { TrigramStance } from "../../../../types";
import { TrigramSymbol3D } from "./TrigramSymbol3D";

export interface TrigramVisualization3DProps {
  readonly selectedTrigram: TrigramStance | null;
  readonly onTrigramSelect: (stance: TrigramStance) => void;
  readonly enableControls?: boolean;
}

/**
 * 3D Trigram Visualization Component
 * 
 * **Korean**: 3D 트라이그램 시각화
 * 
 * Arranges eight trigram symbols in 3D space with:
 * - Circular formation around center point
 * - Interactive selection with hover effects
 * - Smooth camera controls (optional)
 * - Lighting for dramatic effect
 * - Particle effects for mystical atmosphere
 * 
 * Layout:
 * - 8 trigrams arranged in a circle with 4.5 unit radius
 * - Each symbol positioned based on traditional I Ching sequence
 * - Vertical stacking for visual depth
 * 
 * Performance:
 * - Memoized positions to avoid recalculation
 * - Efficient event handling
 * - Uses TrigramSymbol3D for individual rendering
 * 
 * @example
 * ```typescript
 * <TrigramVisualization3D
 *   selectedTrigram={selectedTrigram}
 *   onTrigramSelect={(stance) => setSelectedTrigram(stance)}
 *   enableControls={true}
 * />
 * ```
 * 
 * @public
 * @category Philosophy Components
 */
export const TrigramVisualization3D: React.FC<
  TrigramVisualization3DProps
> = ({ selectedTrigram, onTrigramSelect, enableControls = false }) => {
  const [hoveredTrigram, setHoveredTrigram] = useState<TrigramStance | null>(
    null
  );

  // Memoize trigram positions in circular formation
  const trigramPositions = useMemo(() => {
    const radius = 4.5;
    const trigrams = [
      TrigramStance.GEON,
      TrigramStance.TAE,
      TrigramStance.LI,
      TrigramStance.JIN,
      TrigramStance.SON,
      TrigramStance.GAM,
      TrigramStance.GAN,
      TrigramStance.GON,
    ];

    return trigrams.map((stance, index) => {
      const angle = (index / trigrams.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      // Add vertical variation using double frequency for visual depth effect
      // This creates a wave pattern that rises and falls twice as fast as the circle
      const y = Math.sin(angle * 2) * 0.5;

      return {
        stance,
        position: [x, y, z] as [number, number, number],
      };
    });
  }, []);

  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      
      {/* Primary directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Accent lights for cyberpunk feel */}
      <pointLight position={[0, 5, 0]} intensity={0.8} color={0x00e6e6} />
      <pointLight position={[0, -2, 0]} intensity={0.5} color={0xffc400} />

      {/* Trigram symbols in circular formation */}
      {trigramPositions.map(({ stance, position }) => (
        <TrigramSymbol3D
          key={stance}
          trigram={TRIGRAM_DATA[stance]}
          stance={stance}
          position={position}
          isSelected={selectedTrigram === stance}
          isHovered={hoveredTrigram === stance}
          onClick={() => onTrigramSelect(stance)}
          onPointerOver={() => setHoveredTrigram(stance)}
          onPointerOut={() => setHoveredTrigram(null)}
        />
      ))}

      {/* Optional orbital controls for development */}
      {enableControls && (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
        />
      )}
    </>
  );
};

export default TrigramVisualization3D;
