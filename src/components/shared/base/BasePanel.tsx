/**
 * BasePanel - Enhanced panel component with Korean theming
 * 
 * Builds on existing KoreanPanel with extracted common logic
 * Provides consistent panel styling across the application
 * 
 * @module components/base
 */

import { Html } from "@react-three/drei";
import React, { useMemo } from "react";
import { useKoreanTheme } from "./useKoreanTheme";

/**
 * Props for BasePanel component
 */
export interface BasePanelProps {
  readonly children: React.ReactNode;
  readonly position?: [number, number, number];
  readonly width?: number | string;
  readonly height?: number | string;
  readonly padding?: number;
  readonly variant?: "default" | "bordered" | "elevated";
  readonly testId?: string;
  readonly isMobile?: boolean;
}

/**
 * BasePanel Component
 * 
 * Enhanced Korean-themed panel with common functionality extracted.
 * Uses useKoreanTheme hook for consistent styling.
 * 
 * @example
 * ```tsx
 * <BasePanel variant="bordered" padding={20}>
 *   <h1>Panel Content</h1>
 * </BasePanel>
 * ```
 */
export const BasePanel: React.FC<BasePanelProps> = ({
  children,
  position = [0, 0, 0],
  width = "auto",
  height = "auto",
  padding = 16,
  variant = "default",
  testId,
  isMobile = false,
}) => {
  // Use Korean theme hook for consistent styling
  const { panelVariant, fontFamily } = useKoreanTheme({
    variant,
    isMobile,
  });

  // Memoize panel styles for performance
  const panelStyle = useMemo<React.CSSProperties>(() => {
    return {
      width,
      height,
      padding: `${padding}px`,
      borderRadius: "8px",
      fontFamily: fontFamily.KOREAN,
      background: panelVariant.background,
      border: panelVariant.border,
      boxShadow: panelVariant.boxShadow,
    };
  }, [width, height, padding, panelVariant, fontFamily]);

  return (
    <Html position={position} center>
      <div style={panelStyle} data-testid={testId ?? "base-panel"}>
        {children}
      </div>
    </Html>
  );
};

BasePanel.displayName = "BasePanel";
