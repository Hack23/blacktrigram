/**
 * StatBar - Enhanced stat visualization component with Korean theming
 * 
 * Refactored to use useKoreanTheme hook for consistent styling
 * Displays horizontal bar chart for combat statistics
 * 
 * Performance optimized with React.memo and useMemo
 * 
 * @module components/screens/intro
 * @category Intro UI
 * @korean 능력치바
 */

import React, { useMemo } from "react";
import { useKoreanTheme } from "../../../shared/base/useKoreanTheme";
import { KOREAN_COLORS } from "../../../../types/constants";
import { hexToRgbaString, hexColorToCSS } from "../../../../utils/colorUtils";

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
 * 
 * Refactored to use useKoreanTheme for consistent Korean theming:
 * - Uses Korean typography configuration
 * - Applies Korean color palette
 * - Responsive sizing based on device type
 * - Memoized for optimal performance
 * 
 * Used in archetype cards to visualize combat statistics
 * 
 * @example
 * ```tsx
 * <StatBar
 *   label="공격 | Attack"
 *   value={85}
 *   max={100}
 *   color={KOREAN_COLORS.PRIMARY_CYAN}
 *   isMobile={false}
 * />
 * ```
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
    // Use Korean theme hook for consistent styling
    const { koreanTypography, colors: themeColors, calculateResponsiveSize } = useKoreanTheme({
      size: "small",
      isMobile,
    });

    // Calculate percentage for bar width
    const percentage = useMemo(
      () => Math.min(100, Math.max(0, (value / max) * 100)),
      [value, max]
    );

    // Memoize color calculations with Korean theme
    const statBarColors = useMemo(
      () => ({
        barBackground: hexToRgbaString(themeColors.UI_BACKGROUND_MEDIUM, 1),
        barFill: hexToRgbaString(color, 0.9),
        barBorder: hexToRgbaString(color, 0.7),
        labelColor: hexColorToCSS(themeColors.TEXT_SECONDARY),
        valueColor: hexColorToCSS(color),
      }),
      [color, themeColors]
    );

    // Responsive sizing using Korean theme utilities
    const fontSize = calculateResponsiveSize(isMobile ? 9 : 11);
    const labelWidth = calculateResponsiveSize(isMobile ? 70 : 80);
    const valueWidth = calculateResponsiveSize(isMobile ? 25 : 30);

    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: `${calculateResponsiveSize(12)}px`,
        }}
        data-testid={`stat-bar-${label.split("|")[0].trim()}`}
      >
        {/* Stat label with Korean typography */}
        <div
          style={{
            width: `${labelWidth}px`,
            fontSize: `${fontSize}px`,
            fontFamily: koreanTypography.fontFamily,
            color: statBarColors.labelColor,
            flexShrink: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            // Apply Korean typography optimization
            lineHeight: koreanTypography.lineHeight,
            letterSpacing: koreanTypography.letterSpacing,
            wordBreak: koreanTypography.wordBreak,
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
            background: statBarColors.barBackground,
            borderRadius: "2px",
            position: "relative",
            border: `1px solid ${statBarColors.barBorder}`,
            overflow: "hidden",
          }}
          data-testid="stat-bar-container"
        >
          {/* Stat bar fill with smooth transition */}
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              background: statBarColors.barFill,
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
              fontFamily: koreanTypography.fontFamily,
              color: statBarColors.valueColor,
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

export default StatBar;
