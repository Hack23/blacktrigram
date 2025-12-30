/**
 * KoreanText - Three.js-compatible text component with bilingual support
 * 
 * Displays Korean and English text with cyberpunk styling
 * 
 * Now refactored to use BaseText for consistent styling
 * 
 * @module components/three
 */

import React from "react";
import { BaseText, type BaseTextProps } from "../base";

/**
 * Props for KoreanText component
 * Extends BaseTextProps for consistency
 */
export interface KoreanTextProps extends Omit<BaseTextProps, "isMobile"> {
  // All props inherited from BaseText
}

/**
 * KoreanText Component
 * 
 * A bilingual text component with Korean cyberpunk styling.
 * Now uses BaseText internally for consistent styling and reduced duplication.
 * 
 * @example
 * ```tsx
 * <KoreanText
 *   korean="공격"
 *   english="Attack"
 *   size="large"
 *   layout="vertical"
 * />
 * ```
 */
export const KoreanText: React.FC<KoreanTextProps> = ({ testId, ...rest }) => {
  // Simply delegate to BaseText - all logic is now centralized
  // Default testId to "korean-text" for backward compatibility
  return <BaseText testId={testId ?? "korean-text"} {...rest} />;
};

KoreanText.displayName = "KoreanText";
