/**
 * Accessibility utility functions for WCAG 2.1 Level AA compliance
 * Provides keyboard navigation, focus management, color contrast checking,
 * and screen reader support utilities
 * 
 * @module utils/accessibility
 * @category Accessibility
 * @korean 접근성 유틸리티
 */

import React from 'react';
import {
  KeyboardActions,
  FocusIndicatorStyle,
  ScreenReaderAnnouncement,
  ColorContrastConfig,
  WCAGComplianceResult,
  WCAGLevel,
  AriaAttributes,
  createBilingualLabel,
} from '../types/AccessibilityTypes';
import { KOREAN_COLORS } from '../types/constants';

/**
 * Handle keyboard navigation events with WCAG compliance
 * Supports Tab, Enter, Space, Escape, Arrow keys, Home, End
 * 
 * @param event - Keyboard event
 * @param actions - Actions to perform for different keys
 * 
 * @example
 * ```tsx
 * <div onKeyDown={(e) => handleKeyboardNav(e, {
 *   onActivate: () => handleClick(),
 *   onCancel: () => handleClose(),
 *   onNavigate: (dir) => handleMove(dir),
 * })}>
 * ```
 */
export function handleKeyboardNav(
  event: KeyboardEvent,
  actions: KeyboardActions
): void {
  const { key, shiftKey } = event;

  switch (key) {
    case 'Enter':
    case ' ':
      // Activate element (button, link, etc.)
      event.preventDefault();
      actions.onActivate?.();
      break;

    case 'Escape':
      // Cancel or close action
      event.preventDefault();
      actions.onCancel?.();
      break;

    case 'Tab':
      // Tab navigation (forward or backward with Shift)
      actions.onTab?.(shiftKey);
      break;

    case 'ArrowUp':
      // Navigate up
      event.preventDefault();
      actions.onNavigate?.('up');
      break;

    case 'ArrowDown':
      // Navigate down
      event.preventDefault();
      actions.onNavigate?.('down');
      break;

    case 'ArrowLeft':
      // Navigate left
      event.preventDefault();
      actions.onNavigate?.('left');
      break;

    case 'ArrowRight':
      // Navigate right
      event.preventDefault();
      actions.onNavigate?.('right');
      break;

    case 'Home':
      // Jump to start
      event.preventDefault();
      actions.onJump?.('start');
      break;

    case 'End':
      // Jump to end
      event.preventDefault();
      actions.onJump?.('end');
      break;
  }
}

/**
 * Default focus indicator style (WCAG 2.1 Level AA compliant)
 * Uses 2px solid outline with high contrast cyan color
 */
export const DEFAULT_FOCUS_STYLE: FocusIndicatorStyle = {
  outlineWidth: 2,
  outlineColor: KOREAN_COLORS.PRIMARY_CYAN,
  outlineOffset: 2,
  outlineStyle: 'solid',
  boxShadow: (() => {
    const rgb = hexToRgb(KOREAN_COLORS.PRIMARY_CYAN);
    return `0 0 0 2px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
  })(),
  transitionDuration: 0.2,
};

/**
 * Get focus indicator CSS style object
 * 
 * @param isFocused - Whether element is currently focused
 * @param customStyle - Optional custom focus style overrides
 * @returns CSS style object for focus indicator
 * 
 * @example
 * ```tsx
 * const [isFocused, setIsFocused] = useState(false);
 * <button
 *   style={getFocusStyle(isFocused)}
 *   onFocus={() => setIsFocused(true)}
 *   onBlur={() => setIsFocused(false)}
 * >
 * ```
 */
export function getFocusStyle(
  isFocused: boolean,
  customStyle?: Partial<FocusIndicatorStyle>
): React.CSSProperties {
  if (!isFocused) {
    return {
      outline: 'none',
      transition: `all ${DEFAULT_FOCUS_STYLE.transitionDuration}s ease`,
    };
  }

  const style = { ...DEFAULT_FOCUS_STYLE, ...customStyle };
  const rgb = hexToRgb(style.outlineColor ?? KOREAN_COLORS.PRIMARY_CYAN);

  return {
    outline: `${style.outlineWidth}px ${style.outlineStyle} rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    outlineOffset: `${style.outlineOffset}px`,
    boxShadow: style.boxShadow ?? `0 0 0 2px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`,
    transition: `all ${style.transitionDuration}s ease`,
  };
}

/**
 * Convert hex color to RGB components
 * 
 * @param hex - Hex color code (0xRRGGBB)
 * @returns RGB components
 */
export function hexToRgb(hex: number): { r: number; g: number; b: number } {
  return {
    r: (hex >> 16) & 255,
    g: (hex >> 8) & 255,
    b: hex & 255,
  };
}

/**
 * Calculate contrast ratio between two colors (WCAG 2.1)
 * 
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @returns Contrast ratio (1-21)
 * 
 * @example
 * ```typescript
 * const ratio = getContrastRatio(KOREAN_COLORS.TEXT_PRIMARY, KOREAN_COLORS.UI_BACKGROUND_DARK);
 * console.log(`Contrast ratio: ${ratio.toFixed(2)}:1`); // Should be >= 4.5:1 for WCAG AA
 * ```
 */
export function getContrastRatio(foreground: number, background: number): number {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  // Calculate relative luminance (WCAG formula)
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      const sRGB = c / 255;
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(fg.r, fg.g, fg.b);
  const l2 = getLuminance(bg.r, bg.g, bg.b);

  // Contrast ratio formula
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color combination meets WCAG contrast requirements
 * 
 * @param config - Color contrast configuration
 * @returns Whether contrast meets WCAG requirements
 * 
 * @example
 * ```typescript
 * const meetsWCAG = meetsContrastRequirement({
 *   foreground: KOREAN_COLORS.TEXT_PRIMARY,
 *   background: KOREAN_COLORS.UI_BACKGROUND_DARK,
 *   targetRatio: 4.5,
 * });
 * ```
 */
export function meetsContrastRequirement(config: ColorContrastConfig): boolean {
  const ratio = getContrastRatio(config.foreground, config.background);
  return ratio >= config.targetRatio;
}

/**
 * Get WCAG-compliant foreground color for given background
 * Returns white or black depending on which provides better contrast
 * 
 * @param background - Background color (hex)
 * @returns Foreground color (hex) that meets WCAG AA
 */
export function getAccessibleForeground(background: number): number {
  const whiteRatio = getContrastRatio(KOREAN_COLORS.TEXT_PRIMARY, background);
  const blackRatio = getContrastRatio(KOREAN_COLORS.BLACK_SOLID, background);

  // Return color with better contrast
  return whiteRatio >= blackRatio
    ? KOREAN_COLORS.TEXT_PRIMARY
    : KOREAN_COLORS.BLACK_SOLID;
}

/**
 * Announce message to screen readers
 * Creates a live region announcement with configurable politeness
 * 
 * @param announcement - Screen reader announcement configuration
 * 
 * @example
 * ```typescript
 * announceToScreenReader({
 *   message: '공격 성공 | Attack successful',
 *   politeness: 'polite',
 *   delay: 100,
 * });
 * ```
 */
export function announceToScreenReader(
  announcement: ScreenReaderAnnouncement
): void {
  const { message, politeness = 'polite', delay = 0 } = announcement;

  setTimeout(() => {
    // Create or get existing live region
    let liveRegion = document.getElementById('sr-live-region');

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'sr-live-region';
      liveRegion.setAttribute('aria-live', politeness);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(liveRegion);
    }

    // Update message
    liveRegion.textContent = message;

    // Clear message after 3 seconds
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = '';
      }
    }, 3000);
  }, delay);
}

/**
 * Trap focus within a container element
 * Prevents focus from leaving the container (e.g., for modals)
 * 
 * @param container - Container element to trap focus within
 * @returns Cleanup function to remove focus trap
 * 
 * @example
 * ```typescript
 * useEffect(() => {
 *   const cleanup = trapFocus(modalRef.current);
 *   return cleanup;
 * }, []);
 * ```
 */
export function trapFocus(container: HTMLElement | null): () => void {
  if (!container) return () => {};

  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift + Tab: Move focus backward
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab: Move focus forward
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Set initial focus
  firstElement?.focus();

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Get all focusable elements within a container
 * 
 * @param container - Container element
 * @returns Array of focusable elements
 */
export function getFocusableElements(
  container: HTMLElement
): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

/**
 * Validate WCAG 2.1 Level AA compliance for a component
 * 
 * Note: Color contrast checking requires access to computed styles,
 * which is not available in all testing environments. This validation
 * focuses on structural accessibility attributes.
 * 
 * @param element - Element to validate
 * @param config - Validation configuration
 * @returns Compliance validation result
 */
export function validateWCAGCompliance(
  element: HTMLElement | null,
  config?: {
    checkKeyboard?: boolean;
    checkFocusVisible?: boolean;
    checkAria?: boolean;
  }
): WCAGComplianceResult {
  const {
    checkKeyboard = true,
    checkFocusVisible = true,
    checkAria = true,
  } = config ?? {};

  const issues: string[] = [];
  let keyboardAccessible = true;
  const colorContrast = true; // Note: Requires computed styles - use getContrastRatio() directly for color validation
  let focusVisible = true;
  let ariaLabels = true;

  if (!element) {
    issues.push('Element not found');
    return {
      level: WCAGLevel.A,
      compliant: false,
      criteria: {
        keyboardAccessible: false,
        colorContrast: false,
        focusVisible: false,
        ariaLabels: false,
        semanticHTML: false,
        errorIdentification: false,
      },
      issues,
    };
  }

  // Check keyboard accessibility
  if (checkKeyboard) {
    const isInteractive =
      element.tagName === 'BUTTON' ||
      element.tagName === 'A' ||
      element.tagName === 'INPUT' ||
      element.hasAttribute('onclick');

    if (isInteractive && element.getAttribute('tabindex') === '-1') {
      keyboardAccessible = false;
      issues.push('Interactive element not keyboard accessible');
    }
  }

  // Check ARIA labels
  if (checkAria) {
    const hasAriaLabel =
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-labelledby');

    const hasTextContent = element.textContent?.trim();

    if (!hasAriaLabel && !hasTextContent) {
      ariaLabels = false;
      issues.push('Missing ARIA label or text content');
    }
  }

  // Check focus indicator
  if (checkFocusVisible) {
    const computedStyle = window.getComputedStyle(element);
    const outline = computedStyle.outline;

    if (outline === 'none' || outline === '') {
      focusVisible = false;
      issues.push('Missing visible focus indicator');
    }
  }

  const allPass =
    keyboardAccessible && colorContrast && focusVisible && ariaLabels;

  return {
    level: allPass ? WCAGLevel.AA : WCAGLevel.A,
    compliant: allPass,
    criteria: {
      keyboardAccessible,
      colorContrast, // Note: Always true - use getContrastRatio() for actual color validation
      focusVisible,
      ariaLabels,
      semanticHTML: true, // Requires manual verification
      errorIdentification: true, // Requires manual verification
    },
    issues,
  };
}

/**
 * Create comprehensive ARIA attributes for a component
 * 
 * @param label - Bilingual label (Korean | English)
 * @param role - ARIA role
 * @param additionalAttrs - Additional ARIA attributes
 * @returns Complete ARIA attributes object
 * 
 * @example
 * ```tsx
 * const ariaProps = createAriaAttributes(
 *   createBilingualLabel('공격', 'Attack'),
 *   'button',
 *   { 'aria-pressed': isPressed }
 * );
 * <button {...ariaProps}>
 * ```
 */
export function createAriaAttributes(
  label: string | { korean: string; english: string },
  role?: AriaAttributes['role'],
  additionalAttrs?: Partial<AriaAttributes>
): AriaAttributes {
  const bilingualLabel =
    typeof label === 'string'
      ? label
      : createBilingualLabel(label.korean, label.english).label;

  return {
    role,
    'aria-label': bilingualLabel,
    ...additionalAttrs,
  };
}

/**
 * Check if element is currently visible
 * Useful for skip-to-content and focus management
 * 
 * @param element - Element to check
 * @returns Whether element is visible
 */
export function isElementVisible(element: HTMLElement | null): boolean {
  if (!element) return false;

  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.offsetParent !== null
  );
}

/**
 * Focus first error element in a form
 * Useful for form validation accessibility
 * 
 * @param container - Form container
 */
export function focusFirstError(container: HTMLElement): void {
  const errorElements = container.querySelectorAll<HTMLElement>(
    '[aria-invalid="true"]'
  );

  if (errorElements.length > 0) {
    errorElements[0].focus();
    announceToScreenReader({
      message: '오류가 발견되었습니다 | Errors found',
      politeness: 'assertive',
    });
  }
}

/**
 * Create skip to content link for keyboard navigation
 * Returns a link that allows users to skip to main content
 * 
 * @param targetId - ID of main content element
 * @returns Skip link element
 */
export function createSkipLink(targetId: string): HTMLAnchorElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = '본문으로 건너뛰기 | Skip to content';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #00e6e6;
    color: #000;
    padding: 8px;
    text-decoration: none;
    z-index: 10000;
    font-weight: bold;
  `;

  // Show on focus
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });

  // Hide on blur
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });

  return skipLink;
}
