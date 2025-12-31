/**
 * VitalPointMarker3D - Individual vital point marker with hover labels
 * 
 * Provides interactive 3D markers for vital points with Korean-English bilingual labels
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { VitalPoint } from "../../../systems/vitalpoint/types";
import { VitalPointSeverity } from "../../../types/common";
import { KOREAN_COLORS, FONT_FAMILY, UI_DIMENSIONS } from "../../../types/constants";
import { applyHtmlOverlayStyles, calculateDistanceFactor } from "../../../utils/htmlOverlayHelpers";

/**
 * Props for VitalPointMarker3D component
 */
export interface VitalPointMarker3DProps {
  /** The vital point data to visualize */
  readonly vitalPoint: VitalPoint;
  /** Whether this vital point is currently selected */
  readonly isSelected: boolean;
  /** Whether training mode is active */
  readonly isTraining: boolean;
  /** Whether on mobile device (larger hit targets) */
  readonly isMobile?: boolean;
  /** Callback when vital point is clicked/hit */
  readonly onHit?: (vitalPointId: string) => void;
  /** Base size multiplier (for difficulty modes) */
  readonly sizeMultiplier?: number;
}

/**
 * Get color based on vital point severity
 */
const getSeverityColor = (severity: VitalPointSeverity): number => {
  switch (severity) {
    case VitalPointSeverity.MINOR:
      return KOREAN_COLORS.POSITIVE_GREEN;
    case VitalPointSeverity.MODERATE:
      return KOREAN_COLORS.WARNING_YELLOW;
    case VitalPointSeverity.MAJOR:
      return KOREAN_COLORS.ACCENT_GOLD;
    case VitalPointSeverity.CRITICAL:
      return KOREAN_COLORS.ACCENT_RED;
    case VitalPointSeverity.LETHAL:
      return KOREAN_COLORS.NEGATIVE_RED; // Most severe - red for lethal vital points
    default:
      return KOREAN_COLORS.TEXT_SECONDARY;
  }
};

/**
 * VitalPointMarker3D Component
 * Individual 3D marker with hover tooltip
 */
export const VitalPointMarker3D: React.FC<VitalPointMarker3DProps> = ({
  vitalPoint,
  isSelected,
  isTraining,
  isMobile = false,
  onHit,
  sizeMultiplier = 1.0,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Calculate marker size (larger on mobile, adjustable by difficulty)
  const baseSize = isMobile ? 0.15 : 0.1;
  const markerSize = baseSize * sizeMultiplier;

  // Reusable vector for scale animation
  const targetScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  // Animate selected and hovered markers
  useFrame((state) => {
    if (!meshRef.current) return;

    if (isSelected || hovered) {
      // Pulsing animation for selected/hovered markers
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.15 + 1;
      meshRef.current.scale.setScalar(pulse);
    } else {
      // Smooth return to normal scale
      targetScale.set(1, 1, 1);
      meshRef.current.scale.lerp(targetScale, 0.1);
    }
  });

  const color = useMemo(() => getSeverityColor(vitalPoint.severity), [vitalPoint.severity]);

  // Track screen width for responsive distance factor updates on resize
  const [screenWidth, setScreenWidth] = useState(() => 
    typeof window !== "undefined" ? window.innerWidth : UI_DIMENSIONS.DEFAULT_SCREEN_WIDTH
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate optimal distance factor for tooltip overlay
  const tooltipDistanceFactor = useMemo(() => {
    return calculateDistanceFactor(screenWidth, "text", isMobile);
  }, [screenWidth, isMobile]);

  // Apply Html overlay styles for tooltip
  const tooltipOverlayStyle = useMemo(() => {
    return applyHtmlOverlayStyles("tooltip", false, tooltipDistanceFactor, true, false);
  }, [tooltipDistanceFactor]);

  const handleClick = useCallback(() => {
    if (isTraining && onHit) {
      onHit(vitalPoint.id);
    }
  }, [isTraining, onHit, vitalPoint.id]);

  return (
    <group>
      {/* Hit target sphere
          Note: Three.js 3D objects lack standard DOM accessibility (aria-label, role, etc.).
          For accessible alternatives, see keyboard shortcuts documented in the UI and
          consider future enhancements for screen reader support via Html overlays. */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        data-testid={`vital-point-marker-${vitalPoint.id}`}
      >
        <sphereGeometry args={[markerSize, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? KOREAN_COLORS.ACCENT_GOLD : color}
          emissive={isSelected ? KOREAN_COLORS.ACCENT_GOLD : color}
          emissiveIntensity={isSelected ? 0.7 : hovered ? 0.5 : 0.2}
          metalness={0.6}
          roughness={0.3}
          transparent
          opacity={isTraining ? 0.9 : 0.5}
        />
      </mesh>

      {/* Ring indicator for selected marker */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[markerSize * 1.2, markerSize * 1.5, 32]} />
          <meshBasicMaterial
            color={KOREAN_COLORS.ACCENT_GOLD}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Hover tooltip with Korean-English labels */}
      {hovered && (
        <Html
          position={[0, markerSize + 0.2, 0]}
          center={tooltipOverlayStyle.center}
          distanceFactor={tooltipOverlayStyle.distanceFactor}
          occlude={tooltipOverlayStyle.occlude}
          style={{ pointerEvents: tooltipOverlayStyle.pointerEvents }}
        >
          <div
            style={{
              background: "rgba(0, 0, 0, 0.9)",
              border: `2px solid ${isSelected ? "#ffd700" : "#00ffff"}`,
              borderRadius: "8px",
              padding: isMobile ? "6px 10px" : "8px 12px",
              fontFamily: FONT_FAMILY.KOREAN,
              whiteSpace: "nowrap",
              boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)",
              transform: tooltipOverlayStyle.transform,
              zIndex: tooltipOverlayStyle.zIndex,
            }}
            data-testid={`vital-point-tooltip-${vitalPoint.id}`}
          >
            {/* Korean name */}
            <div
              style={{
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: "bold",
                color: "#ffd700",
                marginBottom: "4px",
              }}
            >
              {vitalPoint.names.korean}
            </div>

            {/* English name */}
            <div
              style={{
                fontSize: isMobile ? "10px" : "11px",
                color: "#00ffff",
                marginBottom: "4px",
              }}
            >
              {vitalPoint.names.english}
            </div>

            {/* Romanized name */}
            <div
              style={{
                fontSize: isMobile ? "9px" : "10px",
                color: "#999999",
                fontStyle: "italic",
              }}
            >
              {vitalPoint.names.romanized}
            </div>

            {/* Severity indicator */}
            <div
              style={{
                fontSize: isMobile ? "9px" : "10px",
                color: `#${new THREE.Color(color).getHexString()}`,
                marginTop: "6px",
                borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                paddingTop: "4px",
              }}
            >
              심각도 | {vitalPoint.severity}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default VitalPointMarker3D;
