/**
 * KoreanPanel - Three.js-compatible panel container component
 * 
 * Provides a styled container with Korean cyberpunk theming
 * 
 * Now refactored to use BasePanel for consistent styling
 * 
 * @module components/three
 */

import React from "react";
import { BasePanel, type BasePanelProps } from "../../base";

/**
 * Props for KoreanPanel component
 * Extends BasePanelProps for consistency
 */
export interface KoreanPanelProps extends Omit<BasePanelProps, "isMobile"> {
}

/**
 * KoreanPanel Component
 * 
 * A container component with Korean cyberpunk styling.
 * Now uses BasePanel internally for consistent styling and reduced duplication.
 * 
 * @example
 * ```tsx
 * <KoreanPanel variant="bordered" padding={20}>
 *   <h1>Panel Content</h1>
 * </KoreanPanel>
 * ```
 */
export const KoreanPanel: React.FC<KoreanPanelProps> = ({ testId, ...rest }) => {
  return <BasePanel testId={testId ?? "korean-panel"} {...rest} />;
};

KoreanPanel.displayName = "KoreanPanel";
