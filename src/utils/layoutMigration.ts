/**
 * Layout Migration Helper
 *
 * Utility functions to help migrate existing components to use the unified LayoutSystem.
 * These helpers identify positioning patterns and suggest layout system equivalents.
 *
 * @module utils/layoutMigration
 * @category Utilities
 */

import { GridPosition, ResponsivePosition, ZIndexValue } from "../types/LayoutTypes";

/**
 * Positioning pattern detected in legacy code
 */
export interface DetectedPositioningPattern {
  /** Pattern type */
  readonly type: "absolute" | "grid-like" | "centered" | "aligned";
  /** Current values */
  readonly current: {
    readonly x?: number | string;
    readonly y?: number | string;
    readonly width?: number | string;
    readonly zIndex?: number;
  };
  /** Suggested layout system approach */
  readonly suggestion: {
    readonly method: "grid" | "responsive" | "alignment";
    readonly config: GridPosition | ResponsivePosition | { align: string };
  };
  /** Confidence level (0-1) */
  readonly confidence: number;
}

/**
 * Analyze CSS style object and detect positioning pattern
 *
 * @param style - React CSSProperties style object
 * @param containerWidth - Container width for grid calculations
 * @returns Detected pattern with suggestions
 *
 * @example
 * ```typescript
 * const pattern = analyzePositioningPattern(
 *   { position: "absolute", left: "200px", width: "400px" },
 *   1200
 * );
 * // Returns grid suggestion if width matches grid columns
 * ```
 */
export function analyzePositioningPattern(
  style: React.CSSProperties,
  containerWidth: number = 1200
): DetectedPositioningPattern | null {
  // Check for absolute positioning
  if (style.position !== "absolute" && style.position !== "fixed") {
    return null;
  }

  const left = parseValue(style.left);
  const top = parseValue(style.top);
  const right = parseValue(style.right);
  const bottom = parseValue(style.bottom);
  const width = parseValue(style.width);
  const zIndex = style.zIndex ? Number(style.zIndex) : undefined;

  // Detect grid-like pattern (width is multiple of column width)
  if (typeof left === "number" && typeof width === "number") {
    const columnWidth = containerWidth / 12;
    const column = Math.round(left / columnWidth);
    const span = Math.round(width / columnWidth);

    // Check if values align with grid
    if (
      Math.abs(left - column * columnWidth) < 5 &&
      Math.abs(width - span * columnWidth) < 10
    ) {
      return {
        type: "grid-like",
        current: { x: left, y: top, width, zIndex },
        suggestion: {
          method: "grid",
          config: { column, span } as GridPosition,
        },
        confidence: 0.9,
      };
    }
  }

  // Detect centered pattern
  if (
    (typeof left === "number" && typeof right === "number" && left === right) ||
    (style.margin === "auto" || style.marginLeft === "auto")
  ) {
    return {
      type: "centered",
      current: { x: left, y: top, width, zIndex },
      suggestion: {
        method: "alignment",
        config: { align: "center" },
      },
      confidence: 0.85,
    };
  }

  // Detect right-aligned pattern
  if (typeof right === "number") {
    return {
      type: "aligned",
      current: { x: right, y: top ?? bottom, width, zIndex },
      suggestion: {
        method: "alignment",
        config: { align: "right" },
      },
      confidence: 0.8,
    };
  }

  // Default to responsive positioning
  return {
    type: "absolute",
    current: { x: left, y: top, width, zIndex },
    suggestion: {
      method: "responsive",
      config: {
        base: { x: left ?? 0, y: top ?? 0 },
      } as ResponsivePosition,
    },
    confidence: 0.7,
  };
}

/**
 * Suggest z-index from Z_INDEX hierarchy
 *
 * Maps legacy z-index values to standardized Z_INDEX constants.
 *
 * @param currentZIndex - Current z-index value
 * @returns Suggested Z_INDEX constant name and value
 *
 * @example
 * ```typescript
 * const suggestion = suggestZIndex(1000);
 * // Returns { name: "HUD", value: 40 }
 * ```
 */
export function suggestZIndex(currentZIndex: number): {
  name: string;
  value: ZIndexValue;
} {
  // Map legacy z-index ranges to Z_INDEX constants
  if (currentZIndex >= 80) return { name: "DEBUG", value: 80 };
  if (currentZIndex >= 70) return { name: "TOOLTIP", value: 70 };
  if (currentZIndex >= 60) return { name: "MODAL", value: 60 };
  if (currentZIndex >= 50) return { name: "MOBILE_CONTROLS", value: 50 };
  if (currentZIndex >= 40) return { name: "HUD", value: 40 };
  if (currentZIndex >= 30) return { name: "EFFECTS", value: 30 };
  if (currentZIndex >= 20) return { name: "PLAYERS", value: 20 };
  if (currentZIndex >= 10) return { name: "ARENA", value: 10 };
  return { name: "BACKGROUND", value: 0 };
}

/**
 * Generate ResponsiveContainer code from legacy style
 *
 * Creates React code string for ResponsiveContainer based on detected pattern.
 *
 * @param pattern - Detected positioning pattern
 * @param children - Component children code
 * @returns Generated ResponsiveContainer code
 *
 * @example
 * ```typescript
 * const pattern = analyzePositioningPattern(style, 1200);
 * const code = generateResponsiveContainerCode(pattern, "<VolumeControl />");
 * console.log(code);
 * // Outputs:
 * // <ResponsiveContainer
 * //   grid={{ column: 2, span: 4 }}
 * //   containerWidth={width}
 * //   zIndex={Z_INDEX.HUD}
 * // >
 * //   <VolumeControl />
 * // </ResponsiveContainer>
 * ```
 */
export function generateResponsiveContainerCode(
  pattern: DetectedPositioningPattern,
  children: string = "<Component />"
): string {
  const lines: string[] = ["<ResponsiveContainer"];

  // Add configuration based on suggestion
  if (pattern.suggestion.method === "grid") {
    const config = pattern.suggestion.config as GridPosition;
    lines.push(`  grid={{ column: ${config.column}, span: ${config.span} }}`);
  } else if (pattern.suggestion.method === "responsive") {
    const config = pattern.suggestion.config as ResponsivePosition;
    lines.push(
      `  position={{ base: { x: ${config.base.x}, y: ${config.base.y} } }}`
    );
  } else if (pattern.suggestion.method === "alignment") {
    const config = pattern.suggestion.config as { align: string };
    lines.push(`  horizontalAlign="${config.align}"`);
  }

  lines.push("  containerWidth={width}");

  // Add z-index if present
  if (pattern.current.zIndex) {
    const zIndexSuggestion = suggestZIndex(pattern.current.zIndex);
    lines.push(`  zIndex={Z_INDEX.${zIndexSuggestion.name}}`);
  }

  lines.push(">");
  lines.push(`  ${children}`);
  lines.push("</ResponsiveContainer>");

  return lines.join("\n");
}

/**
 * Parse CSS value to number
 *
 * Extracts numeric value from CSS string (e.g., "100px" -> 100)
 *
 * @param value - CSS value (string or number)
 * @returns Numeric value or undefined
 */
function parseValue(value: string | number | undefined): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const match = value.match(/^(-?\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : undefined;
  }
  return undefined;
}

/**
 * Migration suggestions for common patterns
 */
export const MIGRATION_PATTERNS = {
  // Top-right corner (common for settings/volume)
  topRight: {
    legacy: { position: "absolute", top: "20px", right: "20px" },
    modern: {
      component: "ResponsiveContainer",
      props: {
        position: { base: { x: "width - 200", y: 20 } },
        horizontalAlign: "right",
        margin: 20,
      },
    },
  },

  // Centered modal
  centered: {
    legacy: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" },
    modern: {
      component: "ResponsiveContainer",
      props: {
        containerWidth: "width",
        containerHeight: "height",
        elementWidth: "modalWidth",
        elementHeight: "modalHeight",
        horizontalAlign: "center",
        verticalAlign: "middle",
      },
    },
  },

  // Full-width header
  fullWidthHeader: {
    legacy: { position: "absolute", top: 0, left: 0, width: "100%" },
    modern: {
      component: "ResponsiveContainer",
      props: {
        grid: { column: 0, span: 12 },
        position: { base: { x: 0, y: 0 } },
      },
    },
  },

  // Two-column layout
  twoColumn: {
    legacy: { position: "absolute", left: 0, width: "50%" },
    modern: {
      component: "ResponsiveContainer",
      props: {
        grid: { column: 0, span: 6 },
      },
    },
  },
} as const;

/**
 * Check if component should use safe area
 *
 * Determines if a component positioned near screen edges should use safe area insets.
 *
 * @param style - CSS style object
 * @param screenHeight - Screen height
 * @returns Whether safe area should be used and which edge
 */
export function shouldUseSafeArea(
  style: React.CSSProperties,
  screenHeight: number
): { use: boolean; edge?: "top" | "bottom" } {
  const top = parseValue(style.top);
  const bottom = parseValue(style.bottom);

  // Check if positioned near top edge (within 50px)
  if (typeof top === "number" && top < 50) {
    return { use: true, edge: "top" };
  }

  // Check if positioned near bottom edge (within 50px)
  if (typeof bottom === "number" && bottom < 50) {
    return { use: true, edge: "bottom" };
  }

  // Check if positioned near bottom via calculated position
  const bottomPos = typeof top === "number" ? screenHeight - top : undefined;
  if (bottomPos !== undefined && bottomPos < 100) {
    return { use: true, edge: "bottom" };
  }

  return { use: false };
}
