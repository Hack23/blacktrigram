/**
 * DamageNumber3D - Floating damage number effect in 3D space
 *
 * Shows damage numbers that float up and fade out
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import { FONT_FAMILY } from "../../../types/constants";
import { applyHtmlOverlayStyles } from "../../../utils/htmlOverlayHelpers";

/**
 * Props for DamageNumber3D component
 */
export interface DamageNumber3DProps {
  /** Initial 3D position */
  readonly position: [number, number, number];
  /** Damage value to display */
  readonly damage: number;
  /** Type of hit (affects color) */
  readonly type: "normal" | "perfect" | "critical";
  /** Callback when animation completes */
  readonly onComplete: () => void;
  /** Animation duration in seconds */
  readonly duration?: number;
}

/**
 * DamageNumber3D Component
 * Displays floating damage numbers in 3D space
 */
export const DamageNumber3D: React.FC<DamageNumber3DProps> = ({
  position,
  damage,
  type,
  onComplete,
  duration = 1.5,
}) => {
  const startTimeRef = useRef<number | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  // Get color based on type
  const color =
    type === "critical"
      ? "#ff0000"
      : type === "perfect"
      ? "#ffd700"
      : "#ffffff";

  // Apply Html overlay styles for damage numbers (effects layer)
  const overlayStyle = useMemo(() => {
    return applyHtmlOverlayStyles("effects", false, 10, true, false);
  }, []);

  // Animate floating and fading using refs to avoid unnecessary re-renders
  useFrame(() => {
    // Lazy initialize start time on first frame
    startTimeRef.current ??= performance.now();

    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const progress = Math.min(elapsed / duration, 1);

    if (progress >= 1 && !completedRef.current) {
      completedRef.current = true;
      onComplete();
      return;
    }

    if (completedRef.current) return; // Stop processing after completion

    // Float upward with easing - use CSS transform for position animation
    const floatDistance = 1.5;
    const yOffset = floatDistance * progress;

    // Update DOM directly to avoid React re-renders
    if (divRef.current) {
      divRef.current.style.transform = `translateY(-${yOffset * 30}px)`; // Scale to pixels
      divRef.current.style.opacity = String(1 - progress);
    }
  });

  return (
    <Html
      position={position}
      center={overlayStyle.center}
      distanceFactor={overlayStyle.distanceFactor}
      style={{
        pointerEvents: overlayStyle.pointerEvents,
        transition: "none",
      }}
    >
      <div
        ref={divRef}
        data-testid="damage-number-3d"
        style={{
          fontSize:
            type === "critical" ? "32px" : type === "perfect" ? "28px" : "24px",
          fontWeight: "bold",
          color,
          fontFamily: FONT_FAMILY.KOREAN,
          textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
          opacity: 1,
          transform: type === "critical" ? "scale(1.2)" : "scale(1)",
          zIndex: overlayStyle.zIndex,
        }}
      >
        -{damage}
      </div>
    </Html>
  );
};

export default DamageNumber3D;
