# Base Korean UI Components

## Overview

The `src/components/base/` directory contains centralized Korean-themed UI components that eliminate code duplication and provide consistent styling across the Black Trigram application.

**✨ Enhanced with WCAG 2.1 AA accessibility compliance and Korean typography optimization**

## Architecture

### Component Hierarchy

```
src/components/base/
├── useKoreanTheme.ts                # Custom hook for Korean theming + accessibility
├── layoutUtils.ts                   # Layout calculation utilities
├── AccessibilityProvider.tsx        # Context provider for accessibility settings
├── BaseButton.tsx                   # Enhanced Korean-themed button (Three.js)
├── BaseButtonHTML.tsx               # Enhanced Korean-themed button (HTML)
├── BasePanel.tsx                    # Enhanced Korean-themed panel (Three.js)
├── BaseText.tsx                     # Enhanced bilingual text (Three.js)
├── __tests__/accessibility.test.tsx # WCAG 2.1 AA compliance tests (25 tests)
└── index.ts                         # Barrel export
```

### Design Principles

1. **DRY (Don't Repeat Yourself)**: All common Korean theming logic is centralized
2. **Consistency**: Same styling patterns across all components
3. **Accessible**: WCAG 2.1 AA compliant with proper ARIA attributes and keyboard navigation
4. **Responsive**: Mobile-first design with responsive calculations
5. **Type-Safe**: Full TypeScript typing for all components
6. **Performance**: React.memo optimization and memoization throughout
7. **Testable**: 100% test coverage with axe-core accessibility tests

## 🎯 WCAG 2.1 AA Accessibility Features

### Keyboard Navigation
- **Enter & Space Keys**: Trigger button actions
- **Focus Indicators**: High contrast outlines (3px cyan, 4px gold in high contrast mode)
- **Tab Navigation**: All interactive elements keyboard accessible

### ARIA Attributes
- **aria-label**: Descriptive labels for screen readers
- **aria-describedby**: Additional context for complex components
- **aria-disabled**: Proper disabled state communication
- **aria-role**: Semantic HTML roles (region, navigation, article, etc.)
- **aria-live**: Live regions for dynamic content announcements
- **lang**: Language attributes (lang="ko", lang="en") for bilingual text

### Touch Targets
- **Minimum Size**: 44x44px on mobile devices (WCAG 2.1 AA requirement)
- **Responsive Sizing**: Optimized for all screen sizes

### Color Contrast
- **Text Contrast**: 4.5:1 ratio on dark backgrounds
- **UI Elements**: 3:1 ratio for non-text elements
- **High Contrast Mode**: Toggle for enhanced visibility

### Korean Typography Optimization
- **Line Height**: 1.6 for Korean characters (vs 1.5 for Latin)
- **Letter Spacing**: -0.01em for tighter Korean text
- **Word Break**: keep-all prevents breaking Korean words mid-syllable
- **Word Wrap**: break-word for appropriate wrapping
- **Font Family**: Noto Sans KR, Malgun Gothic optimized for readability

## Components

### AccessibilityProvider

Context provider for global accessibility settings.

**Features:**
- High contrast mode toggle
- Automatic reduced motion detection (prefers-reduced-motion)
- Global accessibility state management
- Body class manipulation for high contrast CSS

**Usage:**
```tsx
import { AccessibilityProvider, useAccessibility } from '@/components/base';

// Wrap your app
function App() {
  return (
    <AccessibilityProvider>
      <YourApp />
    </AccessibilityProvider>
  );
}

// Use in components
function MyComponent() {
  const { highContrast, reducedMotion, toggleHighContrast } = useAccessibility();
  
  return (
    <button onClick={toggleHighContrast}>
      Toggle High Contrast
    </button>
  );
}
```

### useKoreanTheme Hook

Custom React hook providing consistent Korean cyberpunk theming with accessibility features.

**Features:**
- Button variant configurations (primary, secondary, danger)
- Panel variant configurations (default, bordered, elevated)
- Responsive sizing for mobile/desktop
- Text size calculations
- **Korean typography optimization** (line height, letter spacing, word break)
- **Accessibility configuration** (focus indicators, touch targets, high contrast)
- Theme application utilities

**Usage:**
```typescript
import { useKoreanTheme } from '@/components/base';

const MyComponent = () => {
  const { 
    buttonVariant, 
    buttonSize, 
    koreanTypography, 
    accessibility 
  } = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile: false,
    highContrast: false,
  });

  return (
    <button style={{
      background: hexToRgbaString(buttonVariant.background),
      padding: buttonSize.padding,
      fontFamily: koreanTypography.fontFamily,
      lineHeight: koreanTypography.lineHeight,
      outline: isFocused ? accessibility.focusOutline : 'none',
    }}>
      Click Me
    </button>
  );
};
```

**Korean Typography Config:**
```typescript
{
  fontFamily: "'Noto Sans KR', 'Malgun Gothic', Arial, sans-serif",
  lineHeight: 1.6,            // Optimal for Korean characters
  letterSpacing: "-0.01em",   // Tighter Korean spacing
  wordBreak: "keep-all",      // Prevent breaking Korean words
  wordWrap: "break-word"      // Wrap long words appropriately
}
```

**Accessibility Config:**
```typescript
{
  focusOutline: "3px solid #00ffff",  // Normal mode
  highContrastFocusOutline: "4px solid #ffc400",  // High contrast mode
  focusOutlineOffset: "2px",
  minTouchTarget: "44px"  // WCAG 2.1 AA minimum
}
```

### BaseButton

Enhanced Korean-themed button component with bilingual support and WCAG 2.1 AA compliance.

**Props:**
- `korean`: Korean text
- `english`: English text
- `onClick`: Click handler
- `disabled`: Disabled state
- `variant`: 'primary' | 'secondary' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `position`: 3D position [x, y, z]
- `fullWidth`: Full width flag
- `testId`: Test identifier
- `isMobile`: Mobile flag
- **`ariaLabel`**: ARIA label for accessibility (optional, defaults to korean text)
- **`ariaDescribedBy`**: ARIA described by ID for additional context
- **`autoFocus`**: Auto-focus on mount for accessibility

**Accessibility Features:**
- ✅ Keyboard navigation (Enter and Space keys)
- ✅ Focus indicators with high contrast
- ✅ ARIA labels and semantic HTML (type="button")
- ✅ Disabled state with aria-disabled
- ✅ Minimum 44x44px touch targets on mobile
- ✅ Language attributes (lang="ko", lang="en")

**Performance:**
- ✅ Optimized with React.memo
- ✅ Memoized styles with useMemo
- ✅ Memoized callbacks with useCallback

**Usage:**
```tsx
import { BaseButton } from '@/components/base';

<BaseButton
  korean="공격"
  english="Attack"
  onClick={() => handleAttack()}
  variant="primary"
  size="md"
  ariaLabel="Attack button"
  autoFocus={true}
/>
```

**Note:** BaseButton requires Three.js Canvas context. For regular DOM components (dialogs, modals, forms), use BaseButtonHTML instead.

### BaseButtonHTML

Enhanced Korean-themed button component for HTML contexts (non-Three.js).

**Props:**
- `korean`: Korean text
- `english`: English text
- `onClick`: Click handler
- `onMouseEnter`: Mouse enter handler (for audio)
- `disabled`: Disabled state
- `variant`: 'primary' | 'secondary' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: Full width flag
- `testId`: Test identifier
- `isMobile`: Mobile flag
- `className`: Custom CSS class
- `style`: Custom inline styles (applied last, allows overrides)
- `autoFocus`: Auto focus on mount (for accessibility)

**Usage:**
```tsx
import { BaseButtonHTML } from '@/components/base';

// In dialogs, modals, or standard forms
<BaseButtonHTML
  korean="확인"
  english="Confirm"
  onClick={() => handleConfirm()}
  variant="primary"
  size="md"
  autoFocus={true}
/>
```

**When to Use:**
- ✅ Use `BaseButtonHTML` for regular DOM components (dialogs, modals, forms)
- ✅ Use `BaseButton` for Three.js Canvas contexts (3D scenes, Html overlays)

### BasePanel

Enhanced Korean-themed panel container component with WCAG 2.1 AA semantic HTML.

**Props:**
- `children`: Panel content
- `position`: 3D position [x, y, z]
- `width`: Panel width
- `height`: Panel height
- `padding`: Internal padding
- `variant`: 'default' | 'bordered' | 'elevated'
- `testId`: Test identifier
- `isMobile`: Mobile flag
- **`ariaRole`**: ARIA role for semantic HTML ('region' | 'article' | 'complementary' | 'navigation' | 'main')
- **`ariaLabel`**: ARIA label for accessibility
- **`ariaDescribedBy`**: ARIA described by ID for additional context

**Accessibility Features:**
- ✅ Proper ARIA roles for semantic HTML
- ✅ ARIA labels for screen reader context
- ✅ Responsive padding for touch targets

**Performance:**
- ✅ Optimized with React.memo
- ✅ Memoized styles with useMemo

**Usage:**
```tsx
import { BasePanel } from '@/components/base';

<BasePanel 
  variant="bordered" 
  padding={20}
  ariaRole="region"
  ariaLabel="Combat statistics panel"
>
  <h1>Panel Title</h1>
  <p>Panel content goes here</p>
</BasePanel>
```

### BaseText

Enhanced bilingual text component with Korean typography optimization and accessibility.

**Props:**
- `korean`: Korean text
- `english`: English text
- `position`: 3D position [x, y, z]
- `size`: 'small' | 'medium' | 'large' | 'xlarge'
- `color`: Text color (hex number)
- `align`: 'left' | 'center' | 'right'
- `weight`: 'normal' | 'bold'
- `layout`: 'vertical' | 'horizontal'
- `testId`: Test identifier
- `isMobile`: Mobile flag
- **`ariaLabel`**: ARIA label for accessibility
- **`ariaLive`**: ARIA live region for dynamic content ('polite' | 'assertive' | 'off')

**Korean Typography Features:**
- ✅ Line height 1.6 for Korean characters
- ✅ Letter spacing -0.01em for tighter text
- ✅ Word break keep-all prevents mid-syllable breaks
- ✅ Word wrap break-word for appropriate wrapping
- ✅ Language attributes (lang="ko", lang="en")

**Accessibility Features:**
- ✅ Proper language attributes for screen readers
- ✅ ARIA labels for additional context
- ✅ ARIA live regions for dynamic content
- ✅ Optimized for screen reader pronunciation

**Performance:**
- ✅ Optimized with React.memo
- ✅ Memoized styles with useMemo

**Usage:**
```tsx
import { BaseText } from '@/components/base';

<BaseText
  korean="전투 시작"
  english="Combat Start"
  size="large"
  layout="vertical"
  ariaLive="polite"
  ariaLabel="Combat status message"
/>
```

### Layout Utilities

Utility functions for responsive layout calculations.

**Functions:**
- `calculateResponsiveFontSize(baseSize, isMobile)`: Calculate responsive font size
- `calculateResponsivePadding(basePadding, isMobile)`: Calculate responsive padding
- `calculateResponsiveSpacing(baseSpacing, isMobile)`: Calculate responsive spacing
- `calculateResponsiveDimensions(config)`: Calculate all responsive dimensions
- `getLayoutConstants(isMobile)`: Get layout constants for screen size
- `pxToRem(px, baseFontSize)`: Convert pixels to rem
- `calculateCenteredPosition(containerSize, elementSize)`: Calculate centered position
- `calculateGridLayout(totalItems, columns, gap)`: Calculate grid layout dimensions

**Usage:**
```typescript
import { calculateResponsiveFontSize, getLayoutConstants } from '@/components/base';

const fontSize = calculateResponsiveFontSize(16, isMobile);
const layout = getLayoutConstants(isMobile);
```

## Refactored Components

The following existing components now use the base components internally:

- **KoreanButton** → Uses `BaseButton`
- **KoreanPanel** → Uses `BasePanel`
- **KoreanText** → Uses `BaseText`

This provides backward compatibility while eliminating code duplication.

## Code Duplication Reduction

### Before Refactoring

- **KoreanButton.tsx**: 225 lines (duplicated variant logic, size logic, styling)
- **KoreanPanel.tsx**: 97 lines (duplicated variant logic, styling)
- **KoreanText.tsx**: 113 lines (duplicated size logic, styling)
- **Total**: 435 lines with ~60% duplication

### After Refactoring

- **useKoreanTheme.ts**: 236 lines (centralized logic)
- **layoutUtils.ts**: 120 lines (centralized utilities)
- **BaseButton.tsx**: 146 lines (uses hook)
- **BasePanel.tsx**: 65 lines (uses hook)
- **BaseText.tsx**: 99 lines (uses hook)
- **KoreanButton.tsx**: 44 lines (wrapper)
- **KoreanPanel.tsx**: 44 lines (wrapper)
- **KoreanText.tsx**: 44 lines (wrapper)
- **Total**: 798 lines with ~15% duplication

### Metrics

- **Code Duplication Reduction**: From 60% to 15% = **75% reduction**
- **Lines of Duplicated Code**: From ~260 lines to ~40 lines = **85% reduction**
- **Maintainability**: Changes to theming now require updating only 1 location (useKoreanTheme)
- **Consistency**: 100% consistent theming across all components

## Testing

All base components have comprehensive test coverage including accessibility tests:

- **useKoreanTheme.test.ts**: 17 tests
- **layoutUtils.test.ts**: 21 tests
- **BaseButton.test.tsx**: 20 tests
- **BasePanel.test.tsx**: 14 tests
- **BaseText.test.tsx**: 21 tests
- **ResponsiveContainer.test.tsx**: 21 tests
- **BaseButtonOverlayHtml.test.tsx**: 21 tests
- **AccessibilityProvider.test.tsx**: 11 tests
- **accessibility.test.tsx**: 25 tests (WCAG 2.1 AA compliance)
- **Total**: 171 tests with 100% coverage ✅

### Accessibility Testing with axe-core

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

describe('BaseButton Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <BaseButton korean="공격" english="Attack" onClick={vi.fn()} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Test Coverage Areas

- ✅ WCAG 2.1 AA compliance (axe-core automated testing)
- ✅ Keyboard navigation (Enter, Space, Tab)
- ✅ Focus management and indicators
- ✅ ARIA attributes and semantic HTML
- ✅ Color contrast ratios (4.5:1 for text)
- ✅ Touch target sizes (44x44px minimum)
- ✅ Language attributes for bilingual content
- ✅ Korean typography rendering
- ✅ High contrast mode
- ✅ Reduced motion support
- ✅ Screen reader compatibility

## Benefits

1. **Reduced Duplication**: 75% reduction in code duplication
2. **Consistency**: Uniform Korean theming across all components
3. **Maintainability**: Single source of truth for styling logic
4. **Type Safety**: Full TypeScript typing
5. **Performance**: Optimized with React.memo, useMemo, and useCallback
6. **Extensibility**: Easy to add new components or variants
7. **Testing**: Comprehensive test coverage ensures reliability
8. **Responsive**: Built-in mobile/desktop responsiveness
9. **✨ Accessible**: WCAG 2.1 AA compliant with axe-core testing
10. **✨ Korean Typography**: Optimized for Korean character readability
11. **✨ Screen Reader Support**: Proper ARIA attributes and language tags
12. **✨ Keyboard Navigation**: Full keyboard accessibility

## Future Enhancements

- Add Cypress E2E tests for accessibility (keyboard navigation, screen reader)
- Implement high contrast CSS theme
- Add virtualization for long lists (react-window)
- Create skip links for keyboard navigation
- Add more component variants as needed
- Extend layout utilities for complex layouts
- Add animation utilities (respecting prefers-reduced-motion)
- Create more specialized base components
- Integrate with design tokens system
