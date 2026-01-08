/**
 * ResponsiveContainer - Grid-based responsive layout container
 *
 * A flexible container component that uses the unified LayoutSystem for positioning.
 * Supports grid-based layout, responsive positioning, and proper z-index layering.
 *
 * Features:
 * - Grid-based positioning (12-column system)
 * - Responsive breakpoints (mobile/tablet/desktop)
 * - Safe area handling for mobile devices
 * - Alignment helpers (horizontal/vertical)
 * - Z-index layer management
 *
 * Note: When both grid and alignment are specified, alignment takes precedence
 * for the aligned axis. This allows grid-based sizing with custom alignment.
 *
 * @module components/base/ResponsiveContainer
 * @category Base Components
 * @korean 반응형컨테이너
 */

import React, { useMemo } from "react";
import { defaultLayoutSystem } from "../../../systems/LayoutSystem";
import {
  GridPosition,
  HorizontalAlignment,
  ResponsivePosition,
  VerticalAlignment,
  ZIndexValue,
} from "../../../types/LayoutTypes";

/**
 * Default row height for grid-based vertical positioning (in pixels)
 * Used when row index is specified in GridPosition
 * Exported for use in custom layouts requiring consistent vertical spacing
 */
export const DEFAULT_ROW_HEIGHT = 100;

/**
 * Props for ResponsiveContainer component
 */
export interface ResponsiveContainerProps {
  /** Child elements to render */
  readonly children: React.ReactNode;

  /** Grid-based position configuration */
  readonly grid?: GridPosition;

  /** Responsive position configuration (alternative to grid) */
  readonly position?: ResponsivePosition;

  /** Z-index layer for stacking */
  readonly zIndex?: ZIndexValue;

  /** 
   * Horizontal alignment within parent
   * ⚠️ Requires elementWidth to be specified for alignment calculations to work
   * Without elementWidth, alignment will be silently ignored
   */
  readonly horizontalAlign?: HorizontalAlignment;

  /** 
   * Vertical alignment within parent
   * ⚠️ Requires elementHeight to be specified for alignment calculations to work
   * Without elementHeight, alignment will be silently ignored
   */
  readonly verticalAlign?: VerticalAlignment;

  /** Margin in pixels */
  readonly margin?: number;

  /** Padding in pixels */
  readonly padding?: number;

  /** Container width (required for grid calculations) */
  readonly containerWidth: number;

  /** Container height (for vertical alignment) */
  readonly containerHeight?: number;

  /** Element width (for alignment calculations) */
  readonly elementWidth?: number;

  /** Element height (for alignment calculations) */
  readonly elementHeight?: number;

  /** Additional CSS class names */
  readonly className?: string;

  /** Additional inline styles */
  readonly style?: React.CSSProperties;

  /** Apply safe area insets for mobile devices */
  readonly useSafeArea?: boolean;

  /** Safe area edge to apply ('top' | 'bottom' | 'left' | 'right') */
  readonly safeAreaEdge?: "top" | "bottom" | "left" | "right";

  /** Data test ID for testing */
  readonly "data-testid"?: string;
}

/**
 * ResponsiveContainer Component
 *
 * Provides grid-based or responsive positioning using the unified LayoutSystem.
 * Can be used as a wrapper for any UI element that needs consistent positioning.
 *
 * @example Grid-based positioning
 * ```tsx
 * <ResponsiveContainer
 *   grid={{ column: 2, span: 8 }}
 *   containerWidth={1200}
 *   zIndex={Z_INDEX.HUD}
 * >
 *   <PlayerHUD />
 * </ResponsiveContainer>
 * ```
 *
 * @example Responsive positioning with alignment
 * ```tsx
 * <ResponsiveContainer
 *   position={{
 *     base: { x: 100, y: 50 },
 *     mobile: { x: 10, y: 20 }
 *   }}
 *   containerWidth={width}
 *   horizontalAlign="center"
 *   zIndex={Z_INDEX.MODAL}
 * >
 *   <Dialog />
 * </ResponsiveContainer>
 * ```
 *
 * @example Safe area handling for mobile
 * ```tsx
 * <ResponsiveContainer
 *   position={{ base: { x: 0, y: 0 } }}
 *   containerWidth={width}
 *   useSafeArea
 *   safeAreaEdge="top"
 *   zIndex={Z_INDEX.HUD}
 * >
 *   <Header />
 * </ResponsiveContainer>
 * ```
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  grid,
  position,
  zIndex,
  horizontalAlign,
  verticalAlign,
  margin = 0,
  padding = 0,
  containerWidth,
  containerHeight,
  elementWidth,
  elementHeight,
  className,
  style,
  useSafeArea = false,
  safeAreaEdge,
  "data-testid": dataTestId,
}) => {
  // Calculate position based on grid or responsive config
  const calculatedPosition = useMemo(() => {
    const screenSize = defaultLayoutSystem.getScreenSize(
      containerWidth,
      containerHeight ?? 800 // Default height if not provided
    );

    let x = 0;
    let y = 0;
    let width = elementWidth;

    // Development-mode validation: warn if alignment props are used without dimensions
    if (process.env.NODE_ENV === 'development') {
      if (horizontalAlign && !elementWidth) {
        console.warn(
          `ResponsiveContainer: horizontalAlign="${horizontalAlign}" requires elementWidth to work. ` +
          `Alignment will be ignored. Consider using CSS flexbox instead (display: flex, justifyContent: ${horizontalAlign === 'left' ? 'flex-start' : horizontalAlign === 'right' ? 'flex-end' : 'center'}).`
        );
      }
      if (verticalAlign && !elementHeight) {
        console.warn(
          `ResponsiveContainer: verticalAlign="${verticalAlign}" requires elementHeight to work. ` +
          `Alignment will be ignored. Consider using CSS flexbox instead (display: flex, alignItems: ${verticalAlign === 'top' ? 'flex-start' : verticalAlign === 'bottom' ? 'flex-end' : 'center'}).`
        );
      }
    }

    // Calculate based on grid
    if (grid) {
      const gridPos = defaultLayoutSystem.calculateGridPosition(
        grid.column,
        grid.span,
        containerWidth,
        grid.gutter
      );
      x = gridPos.x;
      width = gridPos.width;
      // Use DEFAULT_ROW_HEIGHT for vertical grid positioning
      y = grid.row ? grid.row * DEFAULT_ROW_HEIGHT : 0;
    }
    // Calculate based on responsive position
    else if (position) {
      const pos = defaultLayoutSystem.calculateResponsivePosition(position, screenSize);
      x = pos.x;
      y = pos.y;
    }

    // Apply horizontal alignment if specified
    // Note: When both grid and horizontalAlign are specified, alignment overrides
    // the grid x position, but maintains grid-based width. This allows
    // grid-sized elements with custom horizontal positioning.
    if (horizontalAlign && elementWidth) {
      x = defaultLayoutSystem.alignHorizontal(
        elementWidth,
        containerWidth,
        horizontalAlign,
        margin
      );
    }

    // Apply vertical alignment if specified
    // Note: When both grid and verticalAlign are specified, alignment overrides
    // the grid y position. This allows custom vertical positioning with grid columns.
    if (verticalAlign && containerHeight && elementHeight) {
      y = defaultLayoutSystem.alignVertical(
        elementHeight,
        containerHeight,
        verticalAlign,
        margin
      );
    }

    // Apply safe area if needed
    if (useSafeArea && safeAreaEdge) {
      const safePos = defaultLayoutSystem.calculateSafePosition({ x, y }, safeAreaEdge);
      x = safePos.x;
      y = safePos.y;
    }

    return { x, y, width };
  }, [
    grid,
    position,
    containerWidth,
    containerHeight,
    elementWidth,
    elementHeight,
    horizontalAlign,
    verticalAlign,
    margin,
    useSafeArea,
    safeAreaEdge,
  ]);

  // Combine calculated position with provided styles
  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      position: "absolute",
      left: calculatedPosition.x,
      top: calculatedPosition.y,
      width: calculatedPosition.width,
      padding,
      margin: 0, // Margin is handled in position calculation
      zIndex,
      ...style, // Allow style overrides
    }),
    [calculatedPosition, padding, zIndex, style]
  );

  return (
    <div
      className={className}
      style={containerStyle}
      data-testid={dataTestId}
      data-layout-grid={grid ? `${grid.column},${grid.span}` : undefined}
      data-layout-zindex={zIndex}
    >
      {children}
    </div>
  );
};

/**
 * Default export for convenience
 */
export default ResponsiveContainer;
