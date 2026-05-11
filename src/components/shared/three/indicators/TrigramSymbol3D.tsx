/**
 * TrigramSymbol3D - Reusable 3D trigram symbol component
 * 
 * Displays authentic Korean trigram symbols (☰☱☲☳☴☵☶☷) with
 * brushstroke effects and fade animations for combat feedback.
 * 
 * @module components/shared/three/indicators/TrigramSymbol3D
 * @category Combat UI
 * @korean 삼차원팔괘기호
 */

import { Html } from "@react-three/drei";
import React, { useMemo } from "react";
import * as THREE from "three";
import { FONT_FAMILY } from "../../../../types/constants";

/**
 * Props for TrigramSymbol3D component
 * @korean 삼차원팔괘기호속성
 */
export interface TrigramSymbol3DProps {
  /** Trigram symbol character (☰☱☲☳☴☵☶☷) */
  readonly symbol: string;
  /** Position in 3D space */
  readonly position: THREE.Vector3Tuple;
  /** Symbol color (hexadecimal format) */
  readonly color: number | string;
  /** Opacity (0.0 to 1.0) */
  readonly opacity?: number;
  /** Scale multiplier */
  readonly scale?: number;
  /** Whether to show Korean brushstroke effect */
  readonly brushstroke?: boolean;
  /** Font size in pixels */
  readonly fontSize?: number;
  /** Whether to use mobile-optimized sizing */
  readonly isMobile?: boolean;
  /** Additional CSS class name */
  readonly className?: string;
  /** Test ID for testing */
  readonly testId?: string;
}

/**
 * TrigramSymbol3D Component
 * 
 * Renders a Korean trigram symbol in 3D space using Html overlay.
 * Supports fade animations, elemental colors, and brushstroke effects.
 * 
 * Features:
 * - Authentic Unicode trigram symbols (☰☱☲☳☴☵☶☷)
 * - Korean brushstroke text-shadow effect
 * - Smooth fade in/out animations
 * - Responsive scaling for mobile/desktop
 * - Optimized for 60fps performance
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <TrigramSymbol3D 
 *   symbol="☰"
 *   position={[0, 1, 0]}
 *   color={0xffffff}
 * />
 * 
 * // With fade animation
 * <TrigramSymbol3D 
 *   symbol="☲"
 *   position={[0, 1, 0]}
 *   color={0xff4444}
 *   opacity={0.7}
 *   scale={1.5}
 *   brushstroke={true}
 * />
 * ```
 * 
 * @korean 삼차원팔괘기호컴포넌트
 */
export const TrigramSymbol3D: React.FC<TrigramSymbol3DProps> = ({
  symbol,
  position,
  color,
  opacity = 1.0,
  scale = 1.0,
  brushstroke = true,
  fontSize: customFontSize,
  isMobile = false,
  className = "",
  testId = "trigram-symbol-3d",
}) => {
  // Calculate responsive font size
  const fontSize = useMemo(() => {
    if (customFontSize) return customFontSize;
    return isMobile ? 48 : 64;
  }, [customFontSize, isMobile]);

  // Convert color to CSS format
  const colorString = useMemo(() => {
    if (typeof color === "string") {
      return color;
    }
    // Convert hex number to CSS hex string
    const hexString = color.toString(16).padStart(6, "0");
    return `#${hexString}`;
  }, [color]);

  // Calculate scaled font size
  const scaledFontSize = useMemo(() => {
    return Math.round(fontSize * scale);
  }, [fontSize, scale]);

  // Brushstroke text-shadow effect
  const textShadow = useMemo(() => {
    if (!brushstroke) {
      return `0 0 20px ${colorString}, 0 0 40px ${colorString}`;
    }

    // Multi-layered shadow for Korean brushstroke effect
    return `
      0 0 20px ${colorString},
      0 0 40px ${colorString},
      1px 1px 2px rgba(0, 0, 0, 0.8),
      -1px -1px 2px rgba(255, 255, 255, 0.1),
      2px 2px 4px rgba(0, 0, 0, 0.6)
    `.trim();
  }, [brushstroke, colorString]);

  // Style object
  const style = useMemo(
    () => ({
      fontSize: `${scaledFontSize}px`,
      color: colorString,
      fontFamily: FONT_FAMILY.KOREAN,
      fontWeight: "bold" as const,
      textShadow,
      opacity,
      transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
      transform: `scale(${scale})`,
      userSelect: "none" as const,
      pointerEvents: "none" as const,
      WebkitFontSmoothing: "antialiased" as const,
      MozOsxFontSmoothing: "grayscale" as const,
    }),
    [scaledFontSize, colorString, textShadow, opacity, scale]
  );

  return (
    <Html position={position} center distanceFactor={10}>
      <div
        data-testid={testId}
        className={className}
        style={style}
        role="img"
        aria-label={`Trigram symbol ${symbol}`}
      >
        {symbol}
      </div>
    </Html>
  );
};

/**
 * Memoized TrigramSymbol3D to prevent unnecessary re-renders
 * @korean 메모이즈된삼차원팔괘기호
 */
export default React.memo(TrigramSymbol3D);
