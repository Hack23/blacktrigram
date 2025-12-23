/**
 * VitalPointOverlayControls - UI controls for vital point visualization
 *
 * Provides comprehensive controls for the 70-point vital point overlay system:
 * - Toggle overlay visibility
 * - Filter by severity level
 * - Filter by body region
 * - Search vital points
 * - Adjust marker scale
 * - Toggle labels
 * - Toggle animations
 *
 * @module components/combat/components/VitalPointOverlayControls
 */

import { Html } from "@react-three/drei";
import React, { useCallback, useMemo, useState } from "react";
import { VitalPointSeverity } from "../../../types/common";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";
import {
  KOREAN_VITAL_POINTS,
  getVitalPointsStats,
} from "../../../systems/vitalpoint/KoreanVitalPoints";
import type { BodyRegionFilter } from "./VitalPointMarkers3D";

// Re-export BodyRegionFilter for convenience
export type { BodyRegionFilter } from "./VitalPointMarkers3D";

/**
 * Props for VitalPointOverlayControls component
 */
export interface VitalPointOverlayControlsProps {
  /** Whether overlay is currently visible */
  readonly visible: boolean;
  /** Callback when visibility changes */
  readonly onVisibleChange: (visible: boolean) => void;
  /** Current severity filters */
  readonly severityFilters: VitalPointSeverity[];
  /** Callback when severity filters change */
  readonly onSeverityFiltersChange: (filters: VitalPointSeverity[]) => void;
  /** Current region filter */
  readonly regionFilter: BodyRegionFilter;
  /** Callback when region filter changes */
  readonly onRegionFilterChange: (filter: BodyRegionFilter) => void;
  /** Current search query */
  readonly searchQuery?: string;
  /** Callback when search query changes */
  readonly onSearchQueryChange?: (query: string) => void;
  /** Whether labels are shown */
  readonly showLabels: boolean;
  /** Callback when label visibility changes */
  readonly onShowLabelsChange: (show: boolean) => void;
  /** Whether animations are enabled */
  readonly animated: boolean;
  /** Callback when animation state changes */
  readonly onAnimatedChange: (animated: boolean) => void;
  /** Marker scale multiplier */
  readonly scale: number;
  /** Callback when scale changes */
  readonly onScaleChange: (scale: number) => void;
  /** Whether on mobile device */
  readonly isMobile?: boolean;
  /** Position override for the control panel */
  readonly position?: [number, number, number];
}

/**
 * Convert numeric color to CSS hex string
 */
const colorToHex = (color: number): string => {
  return `#${color.toString(16).padStart(6, "0")}`;
};

/**
 * Get color for severity level
 */
const getSeverityColor = (severity: VitalPointSeverity): string => {
  switch (severity) {
    case VitalPointSeverity.LETHAL:
      return "#ff0000"; // Red
    case VitalPointSeverity.CRITICAL:
      return "#ff6600"; // Orange
    case VitalPointSeverity.MAJOR:
      return "#ffaa00"; // Gold
    case VitalPointSeverity.MODERATE:
      return "#ffd700"; // Yellow
    case VitalPointSeverity.MINOR:
      return "#00ff88"; // Green
    default:
      return "#00ffff"; // Cyan
  }
};

/**
 * VitalPointOverlayControls Component
 * Provides comprehensive UI for vital point visualization control
 */
export const VitalPointOverlayControls: React.FC<
  VitalPointOverlayControlsProps
> = ({
  visible,
  onVisibleChange,
  severityFilters,
  onSeverityFiltersChange,
  regionFilter,
  onRegionFilterChange,
  searchQuery: externalSearchQuery,
  onSearchQueryChange,
  showLabels,
  onShowLabelsChange,
  animated,
  onAnimatedChange,
  scale,
  onScaleChange,
  isMobile = false,
  position,
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Use internal state if no external control provided
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const searchQuery = externalSearchQuery ?? internalSearchQuery;
  const setSearchQuery = onSearchQueryChange ?? setInternalSearchQuery;

  // Get system statistics
  const stats = useMemo(() => getVitalPointsStats(), []);

  // Get filtered count
  const filteredCount = useMemo(() => {
    let points = [...KOREAN_VITAL_POINTS];

    // Filter by severity
    if (severityFilters.length > 0) {
      points = points.filter((vp) => severityFilters.includes(vp.severity));
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

    return points.length;
  }, [severityFilters, regionFilter, searchQuery]);

  // Toggle severity filter
  const toggleSeverityFilter = useCallback(
    (severity: VitalPointSeverity) => {
      const newFilters = severityFilters.includes(severity)
        ? severityFilters.filter((s) => s !== severity)
        : [...severityFilters, severity];
      onSeverityFiltersChange(newFilters);
    },
    [severityFilters, onSeverityFiltersChange]
  );

  // Severity options
  const severityOptions: VitalPointSeverity[] = [
    VitalPointSeverity.LETHAL,
    VitalPointSeverity.CRITICAL,
    VitalPointSeverity.MAJOR,
    VitalPointSeverity.MODERATE,
    VitalPointSeverity.MINOR,
  ];

  // Region options
  const regionOptions: { value: BodyRegionFilter; label: string; korean: string }[] = [
    { value: "all", label: "All Regions", korean: "전체" },
    { value: "head", label: "Head", korean: "머리" },
    { value: "torso", label: "Torso", korean: "몸통" },
    { value: "arms", label: "Arms", korean: "팔" },
    { value: "legs", label: "Legs", korean: "다리" },
  ];

  // Panel styles
  const panelWidth = isMobile ? 280 : 350;
  const buttonHeight = isMobile ? 32 : 36;
  const fontSize = isMobile ? 11 : 13;
  const smallFontSize = isMobile ? 9 : 10;

  return (
    <Html
      position={position ?? [0, 0, 0]}
      center={false}
      distanceFactor={20}
      style={{ pointerEvents: "all" }}
    >
      <div
        style={{
          width: panelWidth,
          background: `${colorToHex(KOREAN_COLORS.UI_BACKGROUND_DARK)}f0`,
          border: `2px solid ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}`,
          borderRadius: "12px",
          padding: isMobile ? "12px" : "16px",
          fontFamily: FONT_FAMILY.KOREAN,
          color: "#ffffff",
          boxShadow: `0 0 30px ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}40, inset 0 0 20px ${colorToHex(KOREAN_COLORS.UI_BACKGROUND_DARK)}80`,
          backdropFilter: "blur(8px)",
          transition: "all 0.3s ease",
        }}
        data-testid="vital-point-overlay-controls"
      >
        {/* Header with toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
            paddingBottom: "12px",
            borderBottom: `1px solid ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}40`,
            background: `linear-gradient(90deg, ${colorToHex(KOREAN_COLORS.UI_BACKGROUND_DARK)}00 0%, ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}10 50%, ${colorToHex(KOREAN_COLORS.UI_BACKGROUND_DARK)}00 100%)`,
          }}
        >
          <div>
            <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: "bold" }}>
              급소 오버레이 | Vital Points
            </div>
            <div
              style={{
                fontSize: smallFontSize,
                color: colorToHex(KOREAN_COLORS.TEXT_SECONDARY),
                marginTop: "2px",
              }}
            >
              {filteredCount} / {stats.total} 표시 | Showing
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: `linear-gradient(135deg, ${colorToHex(KOREAN_COLORS.UI_BACKGROUND_MEDIUM)} 0%, ${colorToHex(KOREAN_COLORS.UI_BACKGROUND_DARK)} 100%)`,
              border: `2px solid ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}`,
              borderRadius: "6px",
              padding: "8px 14px",
              color: "#ffffff",
              fontSize,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: `0 2px 8px ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}30`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = `0 4px 12px ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = `0 2px 8px ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}30`;
            }}
            data-testid="toggle-expand-button"
          >
            {expanded ? "▼" : "▶"}
          </button>
        </div>

        {/* Main toggle */}
        <div style={{ marginBottom: "14px" }}>
          <button
            onClick={() => onVisibleChange(!visible)}
            style={{
              width: "100%",
              height: buttonHeight,
              background: visible
                ? `linear-gradient(135deg, ${colorToHex(KOREAN_COLORS.ACCENT_GOLD)} 0%, ${colorToHex(KOREAN_COLORS.SECONDARY_YELLOW)} 100%)`
                : `linear-gradient(135deg, ${colorToHex(KOREAN_COLORS.UI_BACKGROUND_MEDIUM)} 0%, ${colorToHex(KOREAN_COLORS.UI_BACKGROUND_DARK)} 100%)`,
              border: `2px solid ${visible ? colorToHex(KOREAN_COLORS.ACCENT_GOLD) : colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}`,
              borderRadius: "8px",
              color: visible ? "#1a1a1a" : "#ffffff",
              fontSize: isMobile ? 13 : 15,
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: visible 
                ? `0 4px 16px ${colorToHex(KOREAN_COLORS.ACCENT_GOLD)}60, inset 0 2px 4px rgba(255,255,255,0.2)`
                : `0 2px 8px ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}30`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = visible 
                ? `0 6px 20px ${colorToHex(KOREAN_COLORS.ACCENT_GOLD)}80`
                : `0 4px 12px ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = visible 
                ? `0 4px 16px ${colorToHex(KOREAN_COLORS.ACCENT_GOLD)}60`
                : `0 2px 8px ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}30`;
            }}
            data-testid="toggle-visibility-button"
          >
            {visible ? "✓ 활성화 | Enabled" : "비활성화 | Disabled"}
          </button>
        </div>

        {/* Expanded controls */}
        {expanded && visible && (
          <>
            {/* Severity filters */}
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  fontSize,
                  marginBottom: "8px",
                  color: colorToHex(KOREAN_COLORS.ACCENT_CYAN),
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                심각도 필터 | Severity Filter
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {severityOptions.map((severity) => {
                  const isActive = severityFilters.includes(severity);
                  const severityColor = getSeverityColor(severity);
                  return (
                    <button
                      key={severity}
                      onClick={() => toggleSeverityFilter(severity)}
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, ${severityColor} 0%, ${severityColor}cc 100%)`
                          : `${colorToHex(KOREAN_COLORS.UI_BACKGROUND_MEDIUM)}`,
                        border: `2px solid ${severityColor}`,
                        borderRadius: "6px",
                        padding: "6px 12px",
                        color: "#ffffff",
                        fontSize: smallFontSize,
                        cursor: "pointer",
                        opacity: isActive ? 1 : 0.6,
                        transition: "all 0.2s ease",
                        fontWeight: isActive ? "bold" : "normal",
                        boxShadow: isActive ? `0 2px 8px ${severityColor}50` : "none",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = isActive ? "1" : "0.6";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                      data-testid={`severity-filter-${severity}`}
                    >
                      {severity}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Region filter */}
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  fontSize,
                  marginBottom: "8px",
                  color: colorToHex(KOREAN_COLORS.ACCENT_CYAN),
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                부위 필터 | Region Filter
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {regionOptions.map((option) => {
                  const isActive = regionFilter === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => onRegionFilterChange(option.value)}
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)} 0%, ${colorToHex(KOREAN_COLORS.ACCENT_BLUE)} 100%)`
                          : `${colorToHex(KOREAN_COLORS.UI_BACKGROUND_MEDIUM)}`,
                        border: `2px solid ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}`,
                        borderRadius: "6px",
                        padding: "6px 12px",
                        color: "#ffffff",
                        fontSize: smallFontSize,
                        cursor: "pointer",
                        opacity: isActive ? 1 : 0.6,
                        transition: "all 0.2s ease",
                        fontWeight: isActive ? "bold" : "normal",
                        boxShadow: isActive ? `0 2px 8px ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}50` : "none",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = isActive ? "1" : "0.6";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                      data-testid={`region-filter-${option.value}`}
                    >
                      {option.korean} | {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search box */}
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  fontSize,
                  marginBottom: "8px",
                  color: colorToHex(KOREAN_COLORS.ACCENT_CYAN),
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                검색 | Search
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="급소 이름... | Point name..."
                style={{
                  width: "100%",
                  height: buttonHeight,
                  background: `${colorToHex(KOREAN_COLORS.UI_BACKGROUND_MEDIUM)}`,
                  border: `2px solid ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}40`,
                  borderRadius: "8px",
                  padding: "0 14px",
                  color: "#ffffff",
                  fontSize,
                  fontFamily: FONT_FAMILY.KOREAN,
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colorToHex(KOREAN_COLORS.PRIMARY_CYAN);
                  e.currentTarget.style.boxShadow = `0 0 12px ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}40`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = `${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}40`;
                  e.currentTarget.style.boxShadow = "none";
                }}
                data-testid="search-input"
              />
            </div>

            {/* Display options */}
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize,
                  marginBottom: "6px",
                  color: colorToHex(KOREAN_COLORS.ACCENT_CYAN),
                }}
              >
                표시 옵션 | Display Options
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => onShowLabelsChange(e.target.checked)}
                    data-testid="show-labels-checkbox"
                  />
                  <span style={{ fontSize }}>라벨 표시 | Show Labels</span>
                </label>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={animated}
                    onChange={(e) => onAnimatedChange(e.target.checked)}
                    data-testid="animated-checkbox"
                  />
                  <span style={{ fontSize }}>애니메이션 | Animations</span>
                </label>
              </div>
            </div>

            {/* Scale slider */}
            <div>
              <div
                style={{
                  fontSize,
                  marginBottom: "6px",
                  color: colorToHex(KOREAN_COLORS.ACCENT_CYAN),
                }}
              >
                크기 | Scale: {scale.toFixed(1)}x
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={scale}
                onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: colorToHex(KOREAN_COLORS.PRIMARY_CYAN),
                }}
                data-testid="scale-slider"
              />
            </div>

            {/* Statistics */}
            <div
              style={{
                marginTop: "12px",
                paddingTop: "12px",
                borderTop: `1px solid ${colorToHex(KOREAN_COLORS.PRIMARY_CYAN)}44`,
                fontSize: smallFontSize,
                color: colorToHex(KOREAN_COLORS.TEXT_SECONDARY),
              }}
            >
              <div>
                머리: {stats.byRegion.head} | 몸통: {stats.byRegion.torso}
              </div>
              <div>
                팔: {stats.byRegion.arms} | 다리: {stats.byRegion.legs}
              </div>
            </div>
          </>
        )}
      </div>
    </Html>
  );
};

export default VitalPointOverlayControls;
