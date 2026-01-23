import { OrbitControls } from "@react-three/drei";
import React, { useState, useMemo } from "react";
import { TRIGRAM_DATA, TRIGRAM_STANCES_ORDER } from "../../../../systems/trigram/types";
import { TrigramStance } from "../../../../types";
import { KOREAN_COLORS } from "../../../../types/constants/colors";
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

    return TRIGRAM_STANCES_ORDER.map((stance, index) => {
      const angle = (index / TRIGRAM_STANCES_ORDER.length) * Math.PI * 2;
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
      
      {/* Primary directional light with optional shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Accent lights for cyberpunk feel */}
      <pointLight position={[0, 5, 0]} intensity={0.8} color={KOREAN_COLORS.PRIMARY_CYAN} />
      <pointLight position={[0, -2, 0]} intensity={0.5} color={KOREAN_COLORS.ACCENT_GOLD} />

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
