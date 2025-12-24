import React, { useMemo } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { hexToRgbaString, hexColorToCSS } from "../../../utils/colorUtils";

export interface StatBarProps {
  readonly label: string; // Format: "Korean | English"
  readonly value: number; // 0-100 range
  readonly max?: number; // Maximum value for scaling
  readonly color?: number; // Hex color for bar
  readonly height?: number; // Bar height in pixels
  readonly showValue?: boolean; // Show numeric value
  readonly isMobile?: boolean;
}

/**
 * StatBar component - Displays a horizontal bar chart for stats
 * Used in archetype cards to visualize combat statistics
 */
export const StatBar: React.FC<StatBarProps> = React.memo(
  ({
    label,
    value,
    max = 100,
    color = KOREAN_COLORS.PRIMARY_CYAN,
    height = 12,
    showValue = true,
    isMobile = false,
  }) => {
    // Calculate percentage for bar width
    const percentage = useMemo(
      () => Math.min(100, Math.max(0, (value / max) * 100)),
      [value, max]
    );

    // Memoize color calculations
    const colors = useMemo(
      () => ({
        barBackground: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 1),
        barFill: hexToRgbaString(color, 0.9),
        barBorder: hexToRgbaString(color, 0.7),
        labelColor: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY),
        valueColor: hexColorToCSS(color),
      }),
      [color]
    );

    // Responsive sizing
    const fontSize = isMobile ? 9 : 11;
    const labelWidth = isMobile ? 70 : 80;
    const valueWidth = isMobile ? 25 : 30;

    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "12px",
        }}
        data-testid={`stat-bar-${label.split("|")[0].trim()}`}
      >
        {/* Stat label */}
        <div
          style={{
            width: `${labelWidth}px`,
            fontSize: `${fontSize}px`,
            fontFamily: FONT_FAMILY.KOREAN,
            color: colors.labelColor,
            flexShrink: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          data-testid="stat-label"
        >
          {label}
        </div>

        {/* Stat bar container */}
        <div
          style={{
            flex: 1,
            height: `${height}px`,
            background: colors.barBackground,
            borderRadius: "2px",
            position: "relative",
            border: `1px solid ${colors.barBorder}`,
            overflow: "hidden",
          }}
          data-testid="stat-bar-container"
        >
          {/* Stat bar fill */}
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              background: colors.barFill,
              borderRadius: "2px",
              transition: "width 0.3s ease",
              boxShadow: `0 0 8px ${hexToRgbaString(color, 0.5)}`,
            }}
            data-testid="stat-bar-fill"
          />
        </div>

        {/* Stat value */}
        {showValue && (
          <div
            style={{
              width: `${valueWidth}px`,
              fontSize: `${fontSize}px`,
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.PRIMARY,
              color: colors.valueColor,
              textAlign: "right",
              flexShrink: 0,
            }}
            data-testid="stat-value"
          >
            {Math.round(value)}
          </div>
        )}
      </div>
    );
  }
);

StatBar.displayName = "StatBar";

