/**
 * Accessibility type definitions for WCAG 2.1 Level AA compliance
 * Provides type-safe ARIA attributes and keyboard navigation interfaces
 * 
 * @module types/AccessibilityTypes
 * @category Accessibility
 * @korean 접근성 타입
 */

/**
 * ARIA role types for semantic HTML elements
 */
export type AriaRole =
  | 'button'
  | 'navigation'
  | 'main'
  | 'complementary'
  | 'contentinfo'
  | 'banner'
  | 'form'
  | 'search'
  | 'region'
  | 'article'
  | 'alert'
  | 'alertdialog'
  | 'dialog'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'progressbar'
  | 'slider'
  | 'spinbutton'
  | 'tab'
  | 'tablist'
  | 'tabpanel'
  | 'toolbar'
  | 'tooltip'
  | 'group'
  | 'listbox'
  | 'option'
  | 'radio'
  | 'radiogroup'
  | 'switch'
  | 'link'
  | 'img'
  | 'presentation'
  | 'none';

/**
 * ARIA live region politeness levels
 */
export type AriaLive = 'off' | 'polite' | 'assertive';

/**
 * ARIA current state values
 */
export type AriaCurrent =
  | 'page'
  | 'step'
  | 'location'
  | 'date'
  | 'time'
  | 'true'
  | 'false';

/**
 * Keyboard key codes for navigation
 */
export enum KeyCode {
  ENTER = 'Enter',
  SPACE = ' ',
  ESCAPE = 'Escape',
  TAB = 'Tab',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  HOME = 'Home',
  END = 'End',
  PAGE_UP = 'PageUp',
  PAGE_DOWN = 'PageDown',
}

/**
 * Keyboard navigation actions
 */
export interface KeyboardActions {
  /** Action triggered on Enter or Space */
  readonly onActivate?: () => void;
  /** Action triggered on Escape */
  readonly onCancel?: () => void;
  /** Action triggered on arrow keys */
  readonly onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  /** Action triggered on Tab key */
  readonly onTab?: (shiftKey: boolean) => void;
  /** Action triggered on Home/End keys */
  readonly onJump?: (to: 'start' | 'end') => void;
}

/**
 * ARIA attributes for components
 */
export interface AriaAttributes {
  /** ARIA role */
  readonly role?: AriaRole;
  /** ARIA label (Korean | English bilingual format) */
  readonly 'aria-label'?: string;
  /** ARIA labelled by element ID */
  readonly 'aria-labelledby'?: string;
  /** ARIA described by element ID */
  readonly 'aria-describedby'?: string;
  /** ARIA live region politeness */
  readonly 'aria-live'?: AriaLive;
  /** ARIA expanded state */
  readonly 'aria-expanded'?: boolean;
  /** ARIA pressed state */
  readonly 'aria-pressed'?: boolean;
  /** ARIA selected state */
  readonly 'aria-selected'?: boolean;
  /** ARIA checked state */
  readonly 'aria-checked'?: boolean | 'mixed';
  /** ARIA disabled state */
  readonly 'aria-disabled'?: boolean;
  /** ARIA hidden state */
  readonly 'aria-hidden'?: boolean;
  /** ARIA current state */
  readonly 'aria-current'?: AriaCurrent;
  /** ARIA modal state */
  readonly 'aria-modal'?: boolean;
  /** ARIA controls element ID */
  readonly 'aria-controls'?: string;
  /** ARIA owns element IDs */
  readonly 'aria-owns'?: string;
  /** ARIA has popup type */
  readonly 'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  /** ARIA value now (for progress indicators) */
  readonly 'aria-valuenow'?: number;
  /** ARIA value min */
  readonly 'aria-valuemin'?: number;
  /** ARIA value max */
  readonly 'aria-valuemax'?: number;
  /** ARIA value text */
  readonly 'aria-valuetext'?: string;
  /** ARIA orientation */
  readonly 'aria-orientation'?: 'horizontal' | 'vertical';
  /** ARIA atomic (for live regions) */
  readonly 'aria-atomic'?: boolean;
  /** ARIA relevant (for live regions) */
  readonly 'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';
  /** ARIA busy state */
  readonly 'aria-busy'?: boolean;
  /** ARIA invalid state */
  readonly 'aria-invalid'?: boolean | 'grammar' | 'spelling';
  /** ARIA required state */
  readonly 'aria-required'?: boolean;
  /** ARIA readonly state */
  readonly 'aria-readonly'?: boolean;
}

/**
 * Focus management configuration
 */
export interface FocusConfig {
  /** Whether element should receive focus on mount */
  readonly autoFocus?: boolean;
  /** Whether focus should be trapped within element */
  readonly trapFocus?: boolean;
  /** Whether focus should be restored on unmount */
  readonly restoreFocus?: boolean;
  /** Initial focus target selector */
  readonly initialFocus?: string;
  /** Return focus target selector */
  readonly returnFocus?: string;
}

/**
 * Focus indicator style configuration
 */
export interface FocusIndicatorStyle {
  /** Outline width in pixels */
  readonly outlineWidth?: number;
  /** Outline color (hex) */
  readonly outlineColor?: number;
  /** Outline offset in pixels */
  readonly outlineOffset?: number;
  /** Outline style */
  readonly outlineStyle?: 'solid' | 'dashed' | 'dotted';
  /** Box shadow for glow effect */
  readonly boxShadow?: string;
  /** Transition duration in seconds */
  readonly transitionDuration?: number;
}

/**
 * Keyboard event handler type
 */
export type KeyboardEventHandler = (event: KeyboardEvent) => void;

/**
 * Focus event handler type
 */
export type FocusEventHandler = (event: FocusEvent) => void;

/**
 * Screen reader announcement configuration
 */
export interface ScreenReaderAnnouncement {
  /** Message to announce (Korean | English bilingual) */
  readonly message: string;
  /** Politeness level */
  readonly politeness?: AriaLive;
  /** Delay before announcement in milliseconds */
  readonly delay?: number;
}

/**
 * Color contrast configuration for WCAG compliance
 */
export interface ColorContrastConfig {
  /** Foreground color (hex) */
  readonly foreground: number;
  /** Background color (hex) */
  readonly background: number;
  /** Target contrast ratio (4.5:1 for normal text, 3:1 for large text or UI) */
  readonly targetRatio: 4.5 | 3;
  /** Whether this is for large text (18pt+ or 14pt+ bold) */
  readonly isLargeText?: boolean;
}

/**
 * Accessibility validation result
 */
export interface AccessibilityValidation {
  /** Whether validation passed */
  readonly passed: boolean;
  /** Validation errors */
  readonly errors: readonly string[];
  /** Validation warnings */
  readonly warnings: readonly string[];
  /** Validation recommendations */
  readonly recommendations: readonly string[];
}

/**
 * WCAG compliance level
 */
export enum WCAGLevel {
  A = 'A',
  AA = 'AA',
  AAA = 'AAA',
}

/**
 * WCAG compliance check result
 */
export interface WCAGComplianceResult {
  /** Compliance level achieved */
  readonly level: WCAGLevel;
  /** Whether component meets target level */
  readonly compliant: boolean;
  /** Specific criteria results */
  readonly criteria: {
    readonly keyboardAccessible: boolean;
    readonly colorContrast: boolean;
    readonly focusVisible: boolean;
    readonly ariaLabels: boolean;
    readonly semanticHTML: boolean;
    readonly errorIdentification: boolean;
  };
  /** Issues found */
  readonly issues: readonly string[];
}

/**
 * Bilingual label format (Korean | English)
 */
export interface BilingualLabel {
  /** Korean text */
  readonly korean: string;
  /** English text */
  readonly english: string;
  /** Formatted label string (Korean | English) */
  readonly label: string;
}

/**
 * Helper function to create bilingual labels
 */
export const createBilingualLabel = (
  korean: string,
  english: string
): BilingualLabel => ({
  korean,
  english,
  label: `${korean} | ${english}`,
});
