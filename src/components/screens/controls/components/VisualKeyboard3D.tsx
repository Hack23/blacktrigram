/**
 * VisualKeyboard3D - 3D keyboard visualization with all keys
 * 
 * Renders a complete 3D keyboard with keys filtered by selected category.
 * Uses grid layout with proper spacing and lighting for visual clarity.
 * 
 * @module components/screens/controls/components
 */

import React, { useMemo } from "react";
import { KOREAN_COLORS } from "../../../../types/constants/colors";
import { filterKeysByCategory, KEYBOARD_LAYOUT, type KeyData } from "../constants/ControlsConstants";
import { Key3D } from "./Key3D";

/**
 * Props for VisualKeyboard3D component
 */
export interface VisualKeyboard3DProps {
  /** Set of currently pressed key codes */
  readonly pressedKeys: Set<string>;
  /** Selected control category to filter keys */
  readonly selectedTab: 'combat' | 'movement' | 'system';
}

/**
 * VisualKeyboard3D Component
 * 
 * 3D keyboard visualization showing all keys filtered by selected category.
 * Keys are positioned in a grid layout with proper spacing.
 * 
 * @example
 * ```tsx
 * <Canvas>
 *   <VisualKeyboard3D
 *     pressedKeys={new Set(['Space', 'KeyW'])}
 *     selectedTab="combat"
 *   />
 * </Canvas>
 * ```
 */
export const VisualKeyboard3D: React.FC<VisualKeyboard3DProps> = ({
  pressedKeys,
  selectedTab,
}) => {
  // Filter keys by selected category
  const filteredKeys = useMemo<readonly KeyData[]>(() => {
    return filterKeysByCategory(KEYBOARD_LAYOUT, selectedTab);
  }, [selectedTab]);

  return (
    <group
      position={[0, -1, 0]}
      rotation={[-Math.PI / 6, 0, 0]}
      data-testid="visual-keyboard"
    >
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} />

      {/* Directional light for depth and shadows */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Additional directional light from the side */}
      <directionalLight
        position={[-3, 3, 2]}
        intensity={0.5}
      />

      {/* Point light for accent highlights */}
      <pointLight
        position={[0, 2, 2]}
        intensity={0.6}
        distance={10}
        decay={2}
      />

      {/* Render all filtered keys */}
      {filteredKeys.map((keyData) => (
        <Key3D
          key={keyData.code}
          keyData={keyData}
          isPressed={pressedKeys.has(keyData.code)}
        />
      ))}

      {/* Background plane for keyboard base */}
      <mesh
        position={[0, 0, -0.2]}
        receiveShadow
      >
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial
          color={KOREAN_COLORS.ARENA_BACKGROUND}
          metalness={0.8}
          roughness={0.3}
          opacity={0.9}
          transparent
        />
      </mesh>

      {/* Grid helper for visual reference (subtle) */}
      <gridHelper
        args={[12, 20, KOREAN_COLORS.UI_STEEL_GRAY_DARK, KOREAN_COLORS.UI_BACKGROUND_MEDIUM]}
        position={[0, 0, -0.19]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
};

export default VisualKeyboard3D;
