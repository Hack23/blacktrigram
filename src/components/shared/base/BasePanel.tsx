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
  /** ARIA role for semantic HTML (default: "region") */
  readonly ariaRole?: "region" | "article" | "complementary" | "navigation" | "main";
  /** ARIA label for accessibility */
  readonly ariaLabel?: string;
  /** ARIA described by ID for additional context */
  readonly ariaDescribedBy?: string;
}

/**
 * BasePanel Component
 * 
 * Enhanced Korean-themed panel with common functionality extracted.
 * Uses useKoreanTheme hook for consistent styling.
 * 
 * WCAG 2.1 AA Accessibility Features:
 * - Proper ARIA roles for semantic HTML
 * - ARIA labels for screen reader context
 * - Responsive padding for touch targets
 * 
 * Optimized with React.memo for performance
 * 
 * @example
 * ```tsx
 * <BasePanel 
 *   variant="bordered" 
 *   padding={20}
 *   ariaRole="region"
 *   ariaLabel="Combat statistics panel"
 * >
 *   <h1>Panel Content</h1>
 * </BasePanel>
 * ```
 */
const BasePanelComponent: React.FC<BasePanelProps> = ({
  children,
  position = [0, 0, 0],
  width = "auto",
  height = "auto",
  padding = 16,
  variant = "default",
  testId,
  isMobile = false,
  ariaRole = "region",
  ariaLabel,
  ariaDescribedBy,
}) => {
  const { panelVariant, fontFamily } = useKoreanTheme({
    variant,
    isMobile,
  });

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
      <div 
        style={panelStyle} 
        data-testid={testId ?? "base-panel"}
        role={ariaRole}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {children}
      </div>
    </Html>
  );
};

export const BasePanel = React.memo(BasePanelComponent);

BasePanel.displayName = "BasePanel";
