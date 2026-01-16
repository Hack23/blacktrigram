/**
 * VitalPointMarker3D - Individual vital point marker with hover labels
 *
 * Provides interactive 3D markers for vital points with Korean-English bilingual labels
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { VitalPoint } from "../../../../systems/vitalpoint/types";
import { VitalPointSeverity } from "../../../../types/common";
import {
  FONT_FAMILY,
  KOREAN_COLORS,
  UI_DIMENSIONS,
} from "../../../../types/constants";
import {
  applyHtmlOverlayStyles,
  calculateDistanceFactor,
} from "../../../../utils/htmlOverlayHelpers";

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
  /** Pulse frequency in Hz (default: 6Hz for selected, 4Hz for training mode) */
  readonly pulseFrequency?: number;
  /** Pulse amplitude (default: 0.25 for selected, 0.15 for training mode) */
  readonly pulseAmplitude?: number;
  /** Maximum emissive intensity for selected/hovered state (default: 3.5) */
  readonly maxEmissiveIntensity?: number;
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
 * Base scale offset for pulsing animation
 * This value (1.15) ensures the marker pulses around a slightly enlarged baseline,
 * making the pulsing effect more visible without excessive size variation.
 */
const PULSE_BASE_SCALE = 1.15;

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
  pulseFrequency,
  pulseAmplitude,
  maxEmissiveIntensity = 3.5,
}) => {
  // Default pulse settings: higher frequency/amplitude for selected, lower for training mode
  const defaultPulseFrequency = isTraining && !isSelected ? 4 : 6;
  const defaultPulseAmplitude = isTraining && !isSelected ? 0.15 : 0.25;
  
  const activePulseFrequency = pulseFrequency ?? defaultPulseFrequency;
  const activePulseAmplitude = pulseAmplitude ?? defaultPulseAmplitude;
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Calculate marker size (larger on mobile, adjustable by difficulty)
  const baseSize = isMobile ? 0.15 : 0.1;
  const markerSize = baseSize * sizeMultiplier;

  // Reusable vector for scale animation
  const targetScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  // Animate selected and hovered markers
  // Note: Pulse frequency and amplitude are configurable via props to allow adjustment
  // for extended training sessions where high frequency may cause visual fatigue.
  useFrame((state) => {
    if (!meshRef.current) return;

    if (isSelected || hovered) {
      // Pulsing animation with configurable frequency and amplitude
      const pulse = Math.sin(state.clock.elapsedTime * activePulseFrequency) * activePulseAmplitude + PULSE_BASE_SCALE;
      meshRef.current.scale.setScalar(pulse);
    } else {
      // Smooth return to normal scale
      targetScale.set(1, 1, 1);
      meshRef.current.scale.lerp(targetScale, 0.1);
    }
  });

  const color = useMemo(
    () => getSeverityColor(vitalPoint.severity),
    [vitalPoint.severity]
  );

  // Memoize marker material to avoid recreating on every render
  const markerMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: isSelected ? KOREAN_COLORS.ACCENT_GOLD : color,
        emissive: isSelected ? KOREAN_COLORS.ACCENT_GOLD : color,
        emissiveIntensity: isSelected || hovered ? maxEmissiveIntensity : 2.0,
        // Note: High emissive intensity (default 3.5 for selected) is optimized for
        // a small number of simultaneously highlighted markers. When many markers are
        // active (e.g., displaying all 70 vital points), reduce maxEmissiveIntensity
        // via props or implement LOD to cap total high-intensity markers at ~10-15.
        // See AnatomyOverlay3D.tsx for consistent guidance on emissive thresholds.
        metalness: 0.9, // Increased metalness for more reflective appearance (was 0.8)
        roughness: 0.1, // Reduced roughness for stronger reflections (was 0.2)
        clearcoat: 1.0,
        clearcoatRoughness: 0.05, // Reduced for sharper clearcoat (was 0.1)
        transparent: true,
        opacity: isTraining ? 0.9 : 0.6,
        // Enhanced PBR properties
        transmission: 0.1, // Slight transmission for glass-like effect
        thickness: 0.2,
        ior: 2.4, // High IOR for gem-like appearance
        sheen: 0.3, // Increased sheen
        sheenRoughness: 0.1,
      }),
    [isSelected, hovered, color, maxEmissiveIntensity, isTraining]
  );

  // Dispose marker material on unmount or when a new material is created
  useEffect(() => {
    return () => {
      markerMaterial.dispose();
    };
  }, [markerMaterial]);

  // Track screen width for responsive distance factor updates on resize
  const [screenWidth, setScreenWidth] = useState(() =>
    typeof window !== "undefined"
      ? window.innerWidth
      : UI_DIMENSIONS.DEFAULT_SCREEN_WIDTH
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
    return applyHtmlOverlayStyles(
      "tooltip",
      false,
      tooltipDistanceFactor,
      true,
      false
    );
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
        name={`vital-point-marker-${vitalPoint.id}`}
      >
        <sphereGeometry args={[markerSize, 16, 16]} />
        <primitive object={markerMaterial} attach="material" />
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
