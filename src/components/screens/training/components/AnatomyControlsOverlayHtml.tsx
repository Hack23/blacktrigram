/**
 * AnatomyControlsOverlayHtml - Html UI for toggling anatomy visualization layers
 * 
 * Provides buttons to toggle skeleton, nerves, vascular, and surface layers
 * with consistent Korean martial arts cyberpunk theming.
 * 
 * @module components/screens/training/components/AnatomyControlsOverlayHtml
 * @category Training UI
 * @korean 해부학제어오버레이
 */

import React, { useCallback, useState } from "react";
import type { AnatomyLayer } from "./AnatomyOverlay3D";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { SPACING } from "../../../../types/constants/ui";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import {
  formatBilingualText,
  getEnhancedKoreanOverlayStyles,
  getResponsiveSpacing,
} from "../../../../utils/koreanThemeHelpers";
import {
  getNeonTextShadow,
  getSmoothTransition,
  getNeonGlowEffect,
} from "../../../../utils/visualEffects";
import "../training.css";

/**
 * Props for AnatomyControlsOverlayHtml component
 */
export interface AnatomyControlsOverlayHtmlProps {
  /** Currently visible anatomy layers */
  readonly visibleLayers: readonly AnatomyLayer[];
  /** Callback when layer visibility changes */
  readonly onLayerToggle: (layer: AnatomyLayer) => void;
  /** Whether on mobile device */
  readonly isMobile?: boolean;
}

/**
 * Layer button configuration with Korean colors
 * 
 * @korean 레이어설정
 */
interface LayerConfig {
  readonly id: AnatomyLayer;
  readonly korean: string;
  readonly english: string;
  readonly icon: string;
  readonly color: number; // Numeric hex color from KOREAN_COLORS
}

const LAYER_CONFIGS: readonly LayerConfig[] = [
  {
    id: "skeleton",
    korean: "골격",
    english: "Skeleton",
    icon: "🦴",
    color: KOREAN_COLORS.TEXT_PRIMARY,
  },
  {
    id: "nerves",
    korean: "신경",
    english: "Nerves",
    icon: "⚡",
    color: KOREAN_COLORS.ACCENT_GOLD,
  },
  {
    id: "vascular",
    korean: "혈관",
    english: "Vascular",
    icon: "❤️",
    color: KOREAN_COLORS.ACCENT_RED,
  },
  {
    id: "surface",
    korean: "표면",
    english: "Surface",
    icon: "👤",
    color: KOREAN_COLORS.PRIMARY_CYAN,
  },
];

/**
 * AnatomyControlsOverlayHtml Component
 * UI controls for anatomy layer visibility
 */
export const AnatomyControlsOverlayHtml: React.FC<AnatomyControlsOverlayHtmlProps> = ({
  visibleLayers,
  onLayerToggle,
  isMobile = false,
}) => {
  // State for hover effects
  const [hoveredLayer, setHoveredLayer] = useState<AnatomyLayer | null>(null);

  const handleToggle = useCallback(
    (layer: AnatomyLayer) => {
      onLayerToggle(layer);
    },
    [onLayerToggle]
  );

  const panelWidth = isMobile ? 220 : 260;
  const padding = getResponsiveSpacing("md", isMobile);

  // Enhanced panel styles with neon glow
  const panelStyle: React.CSSProperties = {
    ...getEnhancedKoreanOverlayStyles({
      opacity: 0.88,
      glowIntensity: "medium",
      includeGradient: false,
      includeBackdropBlur: true,
      depthLayers: 3,
    }),
    width: `${panelWidth}px`,
    padding: `${padding}px`,
  };

  return (
    <div
      style={panelStyle}
      data-testid="anatomy-controls-html"
    >
      {/* Header with bilingual text */}
      <div style={{ marginBottom: `${SPACING.MD}px` }}>
        <div
          style={{
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: "bold",
            color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN),
            textShadow: getNeonTextShadow(KOREAN_COLORS.PRIMARY_CYAN, "medium"),
            transition: getSmoothTransition("all", "normal"),
          }}
        >
          {formatBilingualText("해부학 표시", "Anatomy Display", "pipe")}
        </div>
      </div>

      {/* Layer toggle buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${SPACING.SM}px`,
        }}
      >
        {LAYER_CONFIGS.map((config) => {
          const isActive = visibleLayers.includes(config.id);
          const isHovered = hoveredLayer === config.id;
          const layerColor = hexToRgbaString(config.color);
          const activeBackground = hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.2);
          const inactiveBackground = hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.6);
          const inactiveBorder = hexToRgbaString(KOREAN_COLORS.TEXT_TERTIARY, 0.2);

          // Enhanced glow effect for active/hovered states
          const glowEffect = (isActive || isHovered) 
            ? getNeonGlowEffect(config.color, isActive ? "strong" : "medium", true)
            : undefined;

          return (
            <button
              key={config.id}
              onClick={() => handleToggle(config.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: `${SPACING.SM}px`,
                background: isActive ? activeBackground : inactiveBackground,
                border: `2px solid ${isActive ? layerColor : inactiveBorder}`,
                borderRadius: `${SPACING.SM}px`,
                padding: isMobile ? `${SPACING.SM}px ${SPACING.SM}px` : `${SPACING.SM}px ${SPACING.MD}px`,
                cursor: "pointer",
                transition: getSmoothTransition("all", "normal"),
                fontFamily: FONT_FAMILY.KOREAN,
                color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY),
                width: "100%",
                transform: isHovered ? "scale(1.03)" : "scale(1)",
                boxShadow: glowEffect,
              }}
              onMouseEnter={() => setHoveredLayer(config.id)}
              onMouseLeave={() => setHoveredLayer(null)}
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
                    color: isActive ? layerColor : hexToRgbaString(KOREAN_COLORS.TEXT_TERTIARY),
                  }}
                >
                  {config.korean}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? "9px" : "10px",
                    color: isActive 
                      ? hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY) 
                      : hexToRgbaString(KOREAN_COLORS.TEXT_TERTIARY, 0.6),
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
                  background: isActive ? layerColor : hexToRgbaString(KOREAN_COLORS.TEXT_TERTIARY, 0.2),
                  boxShadow: isActive ? `0 0 10px ${layerColor}` : "none",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Info text */}
      <div
        style={{
          marginTop: `${SPACING.MD}px`,
          paddingTop: `${SPACING.MD}px`,
          borderTop: `1px solid ${hexToRgbaString(KOREAN_COLORS.TEXT_TERTIARY, 0.1)}`,
          fontSize: isMobile ? "9px" : "10px",
          color: hexToRgbaString(KOREAN_COLORS.TEXT_TERTIARY),
          textAlign: "center",
          lineHeight: "1.4",
          fontFamily: FONT_FAMILY.KOREAN,
        }}
      >
        {formatBilingualText("클릭하여 표시/숨김", "Click to show/hide", "pipe")}
      </div>
    </div>
  );
};

export default AnatomyControlsOverlayHtml;
