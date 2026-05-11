/**
 * Key3D - Individual 3D keyboard key component with press animation
 * 
 * Renders a 3D box mesh for a keyboard key with category-based coloring,
 * press animation, and bilingual label overlay.
 * 
 * @module components/screens/controls/components
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import { getKeyCategoryColor, type KeyData } from "../constants/ControlsConstants";

/**
 * Props for Key3D component
 */
export interface Key3DProps {
  /** Key data containing position, label, and category */
  readonly keyData: KeyData;
  /** Whether this key is currently pressed */
  readonly isPressed: boolean;
}

/**
 * Key3D Component
 * 
 * Individual 3D keyboard key with press animation and label overlay.
 * Uses category-based coloring and emissive glow when pressed.
 * 
 * @example
 * ```tsx
 * <Key3D
 *   keyData={{ code: 'Space', label: 'Space', row: 4, col: 2, width: 3, category: 'combat' }}
 *   isPressed={pressedKeys.has('Space')}
 * />
 * ```
 */
export const Key3D: React.FC<Key3DProps> = ({ keyData, isPressed }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetScale = useRef(new THREE.Vector3(1, 1, 1));

  const keyWidth = (keyData.width ?? 1) * 0.6; // 0.6 units per key width
  const keyHeight = 0.6;
  const keyDepth = 0.2;

  const position = useMemo<[number, number, number]>(() => {
    const x = keyData.col * 0.6 + (keyWidth / 2) - 3.0; // Center around origin
    const y = -keyData.row * 0.6;
    const z = isPressed ? -0.05 : 0; // Press down slightly when pressed
    return [x, y, z];
  }, [keyData.col, keyData.row, keyWidth, isPressed]);

  const categoryColor = useMemo(() => getKeyCategoryColor(keyData.category), [keyData.category]);

  useFrame(() => {
    if (!meshRef.current) return;

    const targetScaleValue = isPressed ? 0.9 : 1.0;
    targetScale.current.set(targetScaleValue, targetScaleValue, 1.0);

    meshRef.current.scale.lerp(targetScale.current, 0.2);
  });

  const materials = useMemo(
    () => ({
      unpressed: new THREE.MeshStandardMaterial({
        color: categoryColor,
        emissive: categoryColor,
        emissiveIntensity: 0.3,
        metalness: 0.6,
        roughness: 0.4,
        transparent: true,
        opacity: 0.9,
      }),
      pressed: new THREE.MeshStandardMaterial({
        color: categoryColor,
        emissive: categoryColor,
        emissiveIntensity: 2.5,
        metalness: 0.6,
        roughness: 0.4,
        transparent: true,
        opacity: 0.9,
      }),
    }),
    [categoryColor]
  );

  const keyMaterial = isPressed ? materials.pressed : materials.unpressed;

  useEffect(() => {
    return () => {
      materials.unpressed.dispose();
      materials.pressed.dispose();
    };
  }, [materials]);

  const labelStyle = useMemo(() => ({
    fontFamily: FONT_FAMILY.KOREAN,
    fontSize: keyData.width && keyData.width > 2 ? '11px' : '13px',
    fontWeight: 'bold' as const,
    color: isPressed ? hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD) : hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY),
    textAlign: 'center' as const,
    pointerEvents: 'none' as const,
    userSelect: 'none' as const,
    textShadow: isPressed ? `0 0 8px ${hexToRgbaString(categoryColor, 0.8)}` : 'none',
    whiteSpace: 'nowrap' as const,
    lineHeight: 1.2,
  }), [isPressed, categoryColor, keyData.width]);

  return (
    <group position={position}>
      {/* 3D key box */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        name={`key-${keyData.code}`}
        data-testid={`key-${keyData.code}`}
      >
        <boxGeometry args={[keyWidth, keyHeight, keyDepth]} />
        <primitive object={keyMaterial} attach="material" />
      </mesh>

      {/* Label overlay */}
      <Html
        position={[0, 0, keyDepth / 2 + 0.01]}
        center
        distanceFactor={2}
        style={{ pointerEvents: 'none' }}
      >
        <div style={labelStyle}>
          {/* Main label */}
          <div>{keyData.label}</div>
          {/* Korean label (if available) */}
          {keyData.labelKorean && (
            <div style={{
              fontSize: '10px',
              color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD),
              marginTop: '2px',
            }}>
              {keyData.labelKorean}
            </div>
          )}
        </div>
      </Html>

      {/* Glow ring when pressed */}
      {isPressed && (
        <mesh position={[0, 0, -keyDepth / 2 - 0.02]} rotation={[0, 0, 0]}>
          <ringGeometry args={[Math.max(keyWidth, keyHeight) * 0.6, Math.max(keyWidth, keyHeight) * 0.7, 32]} />
          <meshBasicMaterial
            color={categoryColor}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

export default Key3D;
