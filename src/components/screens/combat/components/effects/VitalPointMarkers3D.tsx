/**
 * VitalPointMarkers3D - 3D vital point visualization
 *
 * Renders anatomical vital points (급소) in 3D space around character models
 * Provides Korean martial arts targeting system visualization
 * Note: Currently displays points from KOREAN_VITAL_POINTS data (expandable to 70 points)
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { KOREAN_VITAL_POINTS } from "../../../../../systems/vitalpoint/KoreanVitalPoints";
import { VitalPoint } from "../../../../../systems/vitalpoint/types";
import { Position, VitalPointSeverity } from "../../../../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../../types/constants";

/**
 * Body region filter options
 */
export type BodyRegionFilter = "all" | "head" | "torso" | "arms" | "legs";

/**
 * Props for the VitalPointMarkers3D component.
 * Controls visibility and interaction with anatomical targeting points.
 */
export interface VitalPointMarkers3DProps {
  /** 3D world position of the character [x, y, z]. Defaults to [0, 0, 0] */
  readonly position?: [number, number, number];
  /** Whether markers are visible. Defaults to true */
  readonly visible?: boolean;
  /** Selected vital point ID for highlighting */
  readonly selectedPoint?: string | null;
  /** Callback when a vital point is clicked */
  readonly onPointClick?: (vitalPointId: string) => void;
  /** Callback when a vital point is hovered */
  readonly onPointHover?: (vitalPointId: string | null) => void;
  /** Filter points by severity level */
  readonly severityFilter?: VitalPointSeverity[];
  /** Filter points by body region */
  readonly regionFilter?: BodyRegionFilter;
  /** Search query to filter points by name */
  readonly searchQuery?: string;
  /** Whether to show point labels with Korean names */
  readonly showLabels?: boolean;
  /** Scale multiplier for marker size. Defaults to 1.0 */
  readonly scale?: number;
  /** Whether to enable pulsing animation. Defaults to true */
  readonly animated?: boolean;
}

/**
 * Get color based on vital point severity
 */
const getSeverityColor = (severity: VitalPointSeverity): number => {
  switch (severity) {
    case VitalPointSeverity.LETHAL:
      return KOREAN_COLORS.ACCENT_RED;
    case VitalPointSeverity.CRITICAL:
      return KOREAN_COLORS.SECONDARY_MAGENTA;
    case VitalPointSeverity.MAJOR:
      return KOREAN_COLORS.ACCENT_GOLD;
    case VitalPointSeverity.MODERATE:
      return KOREAN_COLORS.SECONDARY_YELLOW;
    case VitalPointSeverity.MINOR:
      return KOREAN_COLORS.ACCENT_CYAN;
    default:
      return KOREAN_COLORS.PRIMARY_CYAN;
  }
};

// Coordinate conversion constants
// The vital point data uses pixel coordinates where:
// - X: ~50-150 range, centered around 100 (character center)
// - Y: 0 at top of head, ~200 at feet
// The 3D character is:
// - X: centered at 0, width ~0.8 units
// - Y: 0 at feet, ~2.8 at top of head
const CHARACTER_CENTER_X = 100; // Pixel center of character sprite
const CHARACTER_SPRITE_HEIGHT = 200; // Pixel height of character sprite
const CHARACTER_3D_HEIGHT = 2.8; // 3D model height in world units
const CHARACTER_3D_WIDTH = 0.8; // Approximate 3D model width
const SPRITE_WIDTH = 100; // Half-width of sprite (total ~200 pixels)

// Label styling constants
const LABEL_STYLES = {
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "10px",
  subtextSize: "8px",
  subtextOpacity: 0.8,
  borderWidth: "1px",
} as const;

/**
 * Convert color number to RGBA hex string
 * @param color - Color as number (e.g., 0xFF0000)
 * @param alpha - Alpha channel as hex string (e.g., "dd" for semi-transparent)
 * @returns RGBA hex string (e.g., "#ff0000dd")
 */
const colorToRgbaHex = (color: number, alpha: string = "ff"): string => {
  return `#${color.toString(16).padStart(6, "0")}${alpha}`;
};

/**
 * Convert 2D sprite coordinates to 3D body position
 * Maps vital point pixel coordinates to 3D character model space
 *
 * Input: 2D pixel coordinates where:
 *   - X: ~50-150 (100 = center), positive = right side of character
 *   - Y: 0 = top of head, 200 = feet (y increases downward)
 *
 * Output: 3D world coordinates relative to character position where:
 *   - X: horizontal offset from character center
 *   - Y: height from ground (0 = feet, 2.8 = top)
 *   - Z: depth offset (positive = in front of character)
 */
const convert2DTo3D = (
  pos2D: Position,
  basePosition: [number, number, number]
): [number, number, number] => {
  // Convert X from pixel (100=center) to 3D offset
  // Map from [50, 150] to [-0.4, 0.4] approximately
  const normalizedX = (pos2D.x - CHARACTER_CENTER_X) / SPRITE_WIDTH;
  const x3D = normalizedX * CHARACTER_3D_WIDTH;

  // Convert Y from pixel (0=top, 200=bottom) to 3D height (0=feet, 2.8=head)
  // Invert Y axis and scale to 3D height
  const normalizedY = 1 - pos2D.y / CHARACTER_SPRITE_HEIGHT;
  const y3D = normalizedY * CHARACTER_3D_HEIGHT;

  // Z offset - slight forward position for visibility
  const z3D = 0.15;

  return [basePosition[0] + x3D, basePosition[1] + y3D, basePosition[2] + z3D];
};

/**
 * Individual Vital Point Marker Component
 */
interface VitalPointMarkerProps {
  readonly vitalPoint: VitalPoint;
  readonly position3D: [number, number, number];
  readonly selected: boolean;
  readonly hovered: boolean;
  readonly showLabel: boolean;
  readonly scale: number;
  readonly animated: boolean;
  readonly onHover: (hovered: boolean) => void;
  readonly onClick: () => void;
}

const VitalPointMarker: React.FC<VitalPointMarkerProps> = ({
  vitalPoint,
  position3D,
  selected,
  hovered,
  showLabel,
  scale,
  animated,
  onHover,
  onClick,
}) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Animate marker
  useFrame((state) => {
    if (!sphereRef.current || !animated) return;

    // Pulsing animation
    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
    sphereRef.current.scale.setScalar(pulse * scale);

    // Rotate ring for selected/hovered
    if (ringRef.current && (selected || hovered)) {
      ringRef.current.rotation.z += 0.05;
    }
  });

  const color = useMemo(() => {
    if (selected) return KOREAN_COLORS.ACCENT_GOLD;
    if (hovered) return KOREAN_COLORS.PRIMARY_CYAN;
    return getSeverityColor(vitalPoint.severity);
  }, [selected, hovered, vitalPoint.severity]);

  const markerSize = useMemo(() => {
    // Base marker size and severity multipliers
    // Increased base size for better visibility in combat
    const DEFAULT_MARKER_SIZE = 0.08;

    switch (vitalPoint.severity) {
      case VitalPointSeverity.LETHAL:
      case VitalPointSeverity.CRITICAL:
        return DEFAULT_MARKER_SIZE * 1.6 * scale; // 0.128
      case VitalPointSeverity.MAJOR:
        return DEFAULT_MARKER_SIZE * 1.3 * scale; // 0.104
      case VitalPointSeverity.MODERATE:
        return DEFAULT_MARKER_SIZE * 1.0 * scale; // 0.08
      case VitalPointSeverity.MINOR:
        return DEFAULT_MARKER_SIZE * 0.8 * scale; // 0.064
      default:
        return DEFAULT_MARKER_SIZE * scale;
    }
  }, [vitalPoint.severity, scale]);

  return (
    <group position={position3D}>
      {/* Main sphere marker */}
      <mesh
        ref={sphereRef}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <sphereGeometry args={[markerSize, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || selected ? 0.8 : 0.4}
          transparent
          opacity={hovered || selected ? 1.0 : 0.85}
        />
      </mesh>

      {/* Outer ring for selected/hovered */}
      {(selected || hovered) && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[markerSize * 1.5, markerSize * 1.8, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Label overlay */}
      {showLabel && (hovered || selected) && (
        <Html
          position={[0, markerSize * 2, 0]}
          center
          distanceFactor={5}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div
            style={{
              background: colorToRgbaHex(color, "dd"),
              color: "#ffffff",
              padding: LABEL_STYLES.padding,
              borderRadius: LABEL_STYLES.borderRadius,
              fontSize: LABEL_STYLES.fontSize,
              fontFamily: FONT_FAMILY.KOREAN,
              whiteSpace: "nowrap",
              textAlign: "center",
              border: `${LABEL_STYLES.borderWidth} solid ${colorToRgbaHex(
                color
              )}`,
            }}
          >
            <div>{vitalPoint.names.korean}</div>
            <div
              style={{
                fontSize: LABEL_STYLES.subtextSize,
                opacity: LABEL_STYLES.subtextOpacity,
              }}
            >
              {vitalPoint.names.english}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

/**
 * VitalPointMarkers3D Component
 * Renders all vital points as 3D markers around a character
 */
export const VitalPointMarkers3D: React.FC<VitalPointMarkers3DProps> = ({
  position = [0, 0, 0],
  visible = true,
  selectedPoint = null,
  onPointClick,
  onPointHover,
  severityFilter,
  regionFilter = "all",
  searchQuery = "",
  showLabels = true,
  scale = 1.0,
  animated = true,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // Filter vital points based on severity, region, and search
  const visiblePoints = useMemo(() => {
    let points = [...KOREAN_VITAL_POINTS];

    // Filter by severity
    if (severityFilter && severityFilter.length > 0) {
      points = points.filter((vp) => severityFilter.includes(vp.severity));
    }

    // Filter by region
    if (regionFilter !== "all") {
      if (regionFilter === "arms") {
        // Match both left and right arm vital points
        points = points.filter(
          (vp) =>
            vp.id.startsWith("arm_left_") || vp.id.startsWith("arm_right_")
        );
      } else if (regionFilter === "legs") {
        // Match both left and right leg vital points
        points = points.filter(
          (vp) =>
            vp.id.startsWith("leg_left_") || vp.id.startsWith("leg_right_")
        );
      } else {
        // Simple prefix match for head_ or torso_
        const prefix = `${regionFilter}_`;
        points = points.filter((vp) => vp.id.startsWith(prefix));
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      points = points.filter(
        (vp) =>
          vp.names.korean.toLowerCase().includes(query) ||
          vp.names.english.toLowerCase().includes(query) ||
          vp.names.romanized.toLowerCase().includes(query) ||
          vp.id.toLowerCase().includes(query)
      );
    }

    return points;
  }, [severityFilter, regionFilter, searchQuery]);

  // Handle point hover
  const handlePointHover = (vitalPointId: string, hovered: boolean) => {
    const newHovered = hovered ? vitalPointId : null;
    setHoveredPoint(newHovered);
    onPointHover?.(newHovered);
  };

  // Handle point click
  const handlePointClick = (vitalPointId: string) => {
    onPointClick?.(vitalPointId);
  };

  if (!visible) return null;

  return (
    <group position={position}>
      {visiblePoints.map((vitalPoint) => {
        const position3D = convert2DTo3D(vitalPoint.position, [0, 0, 0]);

        return (
          <VitalPointMarker
            key={vitalPoint.id}
            vitalPoint={vitalPoint}
            position3D={position3D}
            selected={selectedPoint === vitalPoint.id}
            hovered={hoveredPoint === vitalPoint.id}
            showLabel={showLabels}
            scale={scale}
            animated={animated}
            onHover={(hovered) => handlePointHover(vitalPoint.id, hovered)}
            onClick={() => handlePointClick(vitalPoint.id)}
          />
        );
      })}
    </group>
  );
};

export default VitalPointMarkers3D;
