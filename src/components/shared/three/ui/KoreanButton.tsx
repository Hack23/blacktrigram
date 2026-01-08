/**
 * KoreanButton - Three.js-compatible button component with Korean theming
 * 
 * Provides bilingual button with cyberpunk Korean aesthetic
 * Supports both HTML overlay and 3D mesh rendering
 * 
 * Now refactored to use BaseButton for consistent styling
 * 
 * @module components/three
 */

import React from "react";
import { BaseButton, type BaseButtonProps } from "../../base";

/**
 * Props for KoreanButton component
 * Extends BaseButtonProps for consistency
 */
export interface KoreanButtonProps extends Omit<BaseButtonProps, "isMobile"> {
  // All props inherited from BaseButton
}

/**
 * KoreanButton Component
 * 
 * A bilingual button component with Korean cyberpunk theming.
 * Now uses BaseButton internally for consistent styling and reduced duplication.
 * 
 * @example
 * ```tsx
 * <KoreanButton
 *   korean="공격"
 *   english="Attack"
 *   onClick={() => console.log("Attack clicked")}
 *   variant="primary"
 *   size="md"
 * />
 * ```
 */
export const KoreanButton: React.FC<KoreanButtonProps> = ({ testId, ...rest }) => {
  // Simply delegate to BaseButton - all logic is now centralized
  // Default testId to "korean-button" for backward compatibility
  return <BaseButton testId={testId ?? "korean-button"} {...rest} />;
};

KoreanButton.displayName = "KoreanButton";
