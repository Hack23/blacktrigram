/**
 * AnatomyControlsHTML - Html UI for toggling anatomy visualization layers
 * 
 * Provides buttons to toggle skeleton, nerves, vascular, and surface layers
 */

import React, { useCallback } from "react";
import type { AnatomyLayer } from "./AnatomyOverlay3D";
import { FONT_FAMILY } from "../../../types/constants";
import "../training.css";

/**
 * Props for AnatomyControlsHTML component
 */
export interface AnatomyControlsHTMLProps {
  /** Currently visible anatomy layers */
  readonly visibleLayers: readonly AnatomyLayer[];
  /** Callback when layer visibility changes */
  readonly onLayerToggle: (layer: AnatomyLayer) => void;
  /** Whether on mobile device */
  readonly isMobile?: boolean;
}

/**
 * Layer button configuration
 */
interface LayerConfig {
  readonly id: AnatomyLayer;
  readonly korean: string;
  readonly english: string;
  readonly icon: string;
  readonly color: string;
}

const LAYER_CONFIGS: readonly LayerConfig[] = [
  {
    id: "skeleton",
    korean: "골격",
    english: "Skeleton",
    icon: "🦴",
    color: "#ffffff",
  },
  {
    id: "nerves",
    korean: "신경",
    english: "Nerves",
    icon: "⚡",
    color: "#ffaa00",
  },
  {
    id: "vascular",
    korean: "혈관",
    english: "Vascular",
    icon: "❤️",
    color: "#ff4444",
  },
  {
    id: "surface",
    korean: "표면",
    english: "Surface",
    icon: "👤",
    color: "#00ffff",
  },
];

/**
 * AnatomyControlsHTML Component
 * UI controls for anatomy layer visibility
 */
export const AnatomyControlsHTML: React.FC<AnatomyControlsHTMLProps> = ({
  visibleLayers,
  onLayerToggle,
  isMobile = false,
}) => {
  const handleToggle = useCallback(
    (layer: AnatomyLayer) => {
      onLayerToggle(layer);
    },
    [onLayerToggle]
  );

  return (
    <div
      style={{
        background: "rgba(26, 26, 26, 0.85)",
        border: "2px solid rgba(0, 255, 255, 0.9)",
        borderRadius: "12px",
        padding: isMobile ? "12px" : "15px",
        fontFamily: FONT_FAMILY.KOREAN,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        width: isMobile ? "220px" : "260px",
      }}
      data-testid="anatomy-controls-html"
    >
      {/* Header */}
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: "bold",
            color: "#00ffff",
          }}
        >
          해부학 표시
        </div>
        <div
          style={{
            fontSize: isMobile ? "10px" : "12px",
            color: "#999999",
            fontStyle: "italic",
          }}
        >
          Anatomy Display
        </div>
      </div>

      {/* Layer toggle buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {LAYER_CONFIGS.map((config) => {
          const isActive = visibleLayers.includes(config.id);

          return (
            <button
              key={config.id}
              onClick={() => handleToggle(config.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: isActive
                  ? "rgba(0, 255, 255, 0.2)"
                  : "rgba(40, 40, 40, 0.6)",
                border: `2px solid ${isActive ? config.color : "rgba(255, 255, 255, 0.2)"}`,
                borderRadius: "8px",
                padding: isMobile ? "8px 10px" : "10px 12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: FONT_FAMILY.KOREAN,
                color: "#ffffff",
                width: "100%",
              }}
              // Note: Direct DOM manipulation for hover effects is used here for immediate
              // visual feedback without React re-renders. For better maintainability in
              // future iterations, consider migrating to CSS hover pseudo-classes.
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = `0 0 15px ${config.color}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              data-testid={`anatomy-layer-${config.id}`}
              aria-label={`Toggle ${config.english} layer`}
              aria-pressed={isActive}
            >
              {/* Icon */}
              <span
                style={{
                  fontSize: isMobile ? "18px" : "20px",
                  filter: isActive ? "none" : "grayscale(100%)",
                  opacity: isActive ? 1 : 0.5,
                }}
              >
                {config.icon}
              </span>

              {/* Labels */}
              <div
                style={{
                  flex: 1,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "12px" : "13px",
                    fontWeight: "bold",
                    color: isActive ? config.color : "#999999",
                  }}
                >
                  {config.korean}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? "9px" : "10px",
                    color: isActive ? "#cccccc" : "#666666",
                  }}
                >
                  {config.english}
                </div>
              </div>

              {/* Active indicator */}
              <div
                style={{
                  width: isMobile ? "8px" : "10px",
                  height: isMobile ? "8px" : "10px",
                  borderRadius: "50%",
                  background: isActive ? config.color : "rgba(255, 255, 255, 0.2)",
                  boxShadow: isActive ? `0 0 10px ${config.color}` : "none",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Info text */}
      <div
        style={{
          marginTop: "12px",
          paddingTop: "12px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          fontSize: isMobile ? "9px" : "10px",
          color: "#888888",
          textAlign: "center",
          lineHeight: "1.4",
        }}
      >
        클릭하여 표시/숨김
        <br />
        Click to show/hide
      </div>
    </div>
  );
};

export default AnatomyControlsHTML;
