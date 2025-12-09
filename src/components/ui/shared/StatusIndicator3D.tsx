/**
 * StatusIndicator3D - Shared 3D status indicator component
 * 
 * Generic status display for various combat/training states:
 * - Ki/Energy levels
 * - Technique availability
 * - Buffs/Debuffs
 * - Stance status
 * - Korean/English bilingual labels
 * - Responsive sizing for mobile/tablet/desktop
 * - Html overlay for 3D scene integration
 * 
 * @module components/ui/shared/StatusIndicator3D
 * @category Combat UI
 * @korean 상태 표시기 3D
 */

import React from "react";
import { hexToRgbaString } from "../../../utils/colorUtils";
import {
  HUDVariant,
  getVariantColors,
  STATUS_INDICATOR_SIZES,
  getResponsiveValue,
  HUD_TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
  OPACITY,
} from "../../../theme/korean-cyberpunk";
import { KOREAN_COLORS } from "../../../types/constants";

/**
 * Status indicator types
 */
export type StatusType =
  | "ki"
  | "technique"
  | "buff"
  | "debuff"
  | "stance"
  | "custom";

/**
 * Props for StatusIndicator3D component
 */
export interface StatusIndicator3DProps {
  /** Status type for styling */
  readonly type: StatusType;
  /** Korean label */
  readonly labelKorean: string;
  /** English label */
  readonly labelEnglish: string;
  /** Current value */
  readonly value: number | string;
  /** Maximum value (for percentage-based indicators) */
  readonly maxValue?: number;
  /** Visual variant (player/opponent/training) */
  readonly variant?: HUDVariant;
  /** Custom icon (emoji or symbol) */
  readonly icon?: string;
  /** Custom color override */
  readonly color?: number;
  /** Whether to use mobile-optimized sizing */
  readonly isMobile?: boolean;
  /** Screen width for responsive sizing */
  readonly screenWidth?: number;
  /** Test ID for component */
  readonly testId?: string;
}

/**
 * Get color based on status type
 */
const getStatusColor = (type: StatusType, customColor?: number): number => {
  if (customColor !== undefined) return customColor;
  
  switch (type) {
    case "ki":
      return KOREAN_COLORS.KI_FULL;
    case "technique":
      return KOREAN_COLORS.ACCENT_GOLD;
    case "buff":
      return KOREAN_COLORS.POSITIVE_GREEN;
    case "debuff":
      return KOREAN_COLORS.NEGATIVE_RED;
    case "stance":
      return KOREAN_COLORS.PRIMARY_CYAN;
    case "custom":
      return KOREAN_COLORS.TEXT_PRIMARY;
    default:
      return KOREAN_COLORS.TEXT_PRIMARY;
  }
};

/**
 * Get default icon for status type
 */
const getDefaultIcon = (type: StatusType): string => {
  switch (type) {
    case "ki":
      return "⚡";
    case "technique":
      return "🥋";
    case "buff":
      return "↑";
    case "debuff":
      return "↓";
    case "stance":
      return "☯";
    case "custom":
      return "●";
    default:
      return "●";
  }
};

/**
 * StatusIndicator3D - Generic status display component
 * 
 * Used in CombatScreen3D and TrainingScreen3D for various status indicators
 */
export const StatusIndicator3D: React.FC<StatusIndicator3DProps> = ({
  type,
  labelKorean,
  labelEnglish,
  value,
  maxValue,
  variant = "player",
  icon,
  color: customColor,
  isMobile = false,
  screenWidth = 1200,
  testId,
}) => {
  const variantColors = getVariantColors(variant);
  const statusColor = getStatusColor(type, customColor);
  const displayIcon = icon ?? getDefaultIcon(type);

  // Responsive sizing
  const width = isMobile
    ? STATUS_INDICATOR_SIZES.width.mobile
    : getResponsiveValue(STATUS_INDICATOR_SIZES.width, screenWidth);
  const height = isMobile
    ? STATUS_INDICATOR_SIZES.height.mobile
    : getResponsiveValue(STATUS_INDICATOR_SIZES.height, screenWidth);
  const fontSize = isMobile
    ? STATUS_INDICATOR_SIZES.fontSize.mobile
    : getResponsiveValue(STATUS_INDICATOR_SIZES.fontSize, screenWidth);
  const iconSize = isMobile
    ? STATUS_INDICATOR_SIZES.iconSize.mobile
    : getResponsiveValue(STATUS_INDICATOR_SIZES.iconSize, screenWidth);

  // Format display value
  const displayValue =
    maxValue !== undefined
      ? `${typeof value === "number" ? Math.ceil(value) : value}/${maxValue}`
      : typeof value === "number"
      ? Math.ceil(value)
      : value;

  return (
    <div
      data-testid={testId ?? `status-indicator-3d-${type}`}
      style={{
        width: `${width}px`,
        minHeight: `${height}px`,
        padding: "8px",
        backgroundColor: hexToRgbaString(variantColors.background, OPACITY.normal),
        borderRadius: BORDER_RADIUS.medium,
        border: `2px solid ${hexToRgbaString(statusColor, 1)}`,
        boxShadow: SHADOWS.glow(hexToRgbaString(statusColor, 1), 0.2),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
      }}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: `${iconSize}px`,
          lineHeight: 1,
        }}
      >
        {displayIcon}
      </div>

      {/* Labels */}
      <div
        style={{
          fontSize: `${fontSize * 0.7}px`,
          color: hexToRgbaString(statusColor, 1),
          fontFamily: HUD_TYPOGRAPHY.fontFamily,
          fontWeight: HUD_TYPOGRAPHY.fontWeights.bold,
          textAlign: "center",
        }}
      >
        <div>{labelKorean}</div>
        <div
          style={{
            fontSize: `${fontSize * 0.6}px`,
            color: hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY, 1),
            fontWeight: HUD_TYPOGRAPHY.fontWeights.normal,
          }}
        >
          {labelEnglish}
        </div>
      </div>

      {/* Value */}
      <div
        style={{
          fontSize: `${fontSize}px`,
          color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, 1),
          fontFamily: HUD_TYPOGRAPHY.fontFamily,
          fontWeight: HUD_TYPOGRAPHY.fontWeights.bold,
        }}
        data-testid={`status-value-3d-${type}`}
      >
        {displayValue}
      </div>
    </div>
  );
};

export default StatusIndicator3D;
