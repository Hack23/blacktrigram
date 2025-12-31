# Responsive Layout System

## Overview

The responsive layout system provides comprehensive support for all screen sizes from mobile (375px) to ultra-wide displays (2560px+) with five distinct screen size categories and proportional scaling.

## Screen Size Categories

| Category | Width Range | Scale Multipliers | Use Cases |
|----------|------------|-------------------|-----------|
| **mobile** | < 768px | Font: 0.8x, Spacing: 0.5x | Phones (iPhone SE, iPhone 14) |
| **tablet** | 768-1024px | Font: 0.9x, Spacing: 0.75x | Tablets (iPad, Android tablets) |
| **desktop** | 1024-1440px | Font: 1.0x, Spacing: 1.0x | Standard monitors (1280x800) |
| **large** | 1440-1920px | Font: 1.2x, Spacing: 1.25x | HD/2K displays (1920x1080) |
| **xlarge** | ≥ 1920px | Font: 1.4x, Spacing: 1.5x | 4K/ultra-wide displays |

## Key Features

### Proportional Font Scaling

- **Base size**: 16px (desktop reference)
- **Scale range**: 0.8x (mobile) to 1.4x (4K)
- **Korean text constraints**: 14-24px for optimal readability
- **Automatic clamping**: Ensures text never becomes too small or large

```typescript
// Example: 16px base font on different screens
mobile:   16px * 0.8 = 12.8px → clamped to 14px (minimum)
tablet:   16px * 0.9 = 14.4px
desktop:  16px * 1.0 = 16px (reference)
large:    16px * 1.2 = 19.2px
xlarge:   16px * 1.4 = 22.4px
```

### Proportional Spacing Scaling

- **Base spacing**: 16px (desktop reference)
- **Scale range**: 0.5x (mobile) to 1.5x (4K)
- **Rounded values**: Always rounded to integer pixels for crisp rendering

```typescript
// Example: 20px base spacing on different screens
mobile:   20px * 0.5  = 10px
tablet:   20px * 0.75 = 15px
desktop:  20px * 1.0  = 20px (reference)
large:    20px * 1.25 = 25px
xlarge:   20px * 1.5  = 30px
```

### Smooth Transitions

- **Duration**: 300ms
- **Easing**: ease-in-out
- **Properties**: font-size, padding, margin, width, height
- **60fps performance**: Optimized for smooth window resizing

## Usage Examples

### Basic Usage with useResponsiveLayout

```typescript
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { useWindowSize } from '../hooks/useWindowSize';

function MyComponent() {
  const { width, height } = useWindowSize();
  const layout = useResponsiveLayout(width, height);

  return (
    <div style={{
      fontSize: layout.fontSize.body,    // 14-24px based on screen size
      padding: layout.spacing.md,         // 8-24px based on screen size
      transition: layout.transition,      // Smooth resizing
    }}>
      <h1 style={{ fontSize: layout.fontSize.title }}>
        {layout.screenSize === 'mobile' ? 'Mobile View' : 'Desktop View'}
      </h1>
      {/* Content adapts to: mobile, tablet, desktop, large, xlarge */}
    </div>
  );
}
```

### Using ResponsiveContainer Component

```typescript
import { ResponsiveContainer } from '../components/ui/ResponsiveContainer';

function MyScreen() {
  return (
    <ResponsiveContainer
      applySafeArea        // Apply mobile safe areas (notch, home indicator)
      padding="normal"     // Responsive padding (compact, normal, spacious)
      enableTransitions    // Smooth resize transitions
    >
      <CombatHUD />
    </ResponsiveContainer>
  );
}
```

### Direct Usage of Scaling Functions

```typescript
import {
  getScreenSize,
  calculateFontSize,
  calculateSpacing,
  calculateResponsiveValues,
} from '../systems/ResponsiveScaling';

function calculateLayout(width: number) {
  const screenSize = getScreenSize(width);
  
  // Calculate individual values
  const fontSize = calculateFontSize(16, screenSize);  // 14-22.4px
  const spacing = calculateSpacing(20, screenSize);     // 10-30px
  
  // Or get all values at once
  const values = calculateResponsiveValues(width);
  return {
    fontSize: values.fontSize.body,
    titleSize: values.fontSize.title,
    spacing: values.spacing.md,
    transition: values.transition,
  };
}
```

### Combat Layout Integration

```typescript
import { useCombatLayout } from '../components/combat/hooks/useCombatLayout';
import { useWindowSize } from '../hooks/useWindowSize';

function CombatScreen() {
  const { width, height } = useWindowSize();
  const { layoutConstants, arenaBounds, screenSize } = useCombatLayout(width, height);

  // Layout constants adapt to screen size
  // - Mobile: compact HUD (95px), larger controls (160px)
  // - Tablet: moderate HUD (100px), balanced controls (140px)
  // - Desktop: spacious HUD (120px), standard controls (160px)
  // - Large/XLarge: optimized for high-res displays

  return (
    <div>
      <HUD height={layoutConstants.hudHeight} />
      <Arena bounds={arenaBounds} />
      <Controls height={layoutConstants.controlsHeight} />
    </div>
  );
}
```

## Testing

### Comprehensive Screen Size Coverage

The system is tested across 10+ screen sizes:

```typescript
// Tested screen sizes
const testCases = [
  { width: 375, height: 667, expected: 'mobile', name: 'iPhone SE' },
  { width: 414, height: 896, expected: 'mobile', name: 'iPhone 11' },
  { width: 768, height: 1024, expected: 'tablet', name: 'iPad' },
  { width: 800, height: 1280, expected: 'tablet', name: 'Android Tablet' },
  { width: 1024, height: 768, expected: 'desktop', name: 'Small Desktop' },
  { width: 1280, height: 800, expected: 'desktop', name: 'Standard Desktop' },
  { width: 1440, height: 900, expected: 'large', name: 'HD Display' },
  { width: 1920, height: 1080, expected: 'xlarge', name: '2K Display' },
  { width: 2560, height: 1440, expected: 'xlarge', name: '4K Display' },
  { width: 3440, height: 1440, expected: 'xlarge', name: 'Ultra-wide' },
];
```

### Test Helper Functions

```typescript
import { testScreenSize } from '../systems/ResponsiveScaling';

// Test screen size determination
const result = testScreenSize(768, 1024);
console.log(result.screenSize);  // 'tablet'
console.log(result.isTablet);    // true
console.log(result.isMobile);    // false
console.log(result.isDesktop);   // false
console.log(result.isLandscape); // false (768 < 1024)
```

## Performance Considerations

### Optimization Strategies

1. **Memoization**: All hooks use `useMemo` to prevent unnecessary recalculations
2. **Breakpoint-based**: Recalculates only when crossing breakpoints, not on every pixel change
3. **Integer rounding**: Spacing values rounded for GPU optimization
4. **Transition batching**: CSS transitions batch multiple property changes
5. **60fps target**: Optimized for smooth resize operations

### Performance Metrics

- **Hook execution time**: < 1ms
- **Recalculation frequency**: Only on breakpoint changes
- **Memory footprint**: Minimal (memoized values)
- **Render impact**: Zero additional renders when width stays within same breakpoint

## Korean Text Readability

### Design Constraints

The system enforces strict readability constraints for Korean and English text:

- **Minimum body text**: 14px (small screens)
- **Maximum text size**: 24px (large screens)
- **Title range**: 18-28px
- **Hero text range**: 24-36px
- **HUD text range**: 16-24px (important information)

### Rationale

Korean characters (Hangul) require slightly larger sizes than Latin characters for optimal readability due to their complex structure. The 14-24px range ensures:

- Korean text remains legible on small mobile screens
- Text doesn't become uncomfortably large on 4K displays
- Consistent reading experience across all device types

## Migration Guide

### Updating Existing Components

```typescript
// Before: Hardcoded sizes
<div style={{ fontSize: 16, padding: 20 }}>

// After: Responsive scaling
const layout = useResponsiveLayout(width, height);
<div style={{
  fontSize: layout.fontSize.body,
  padding: layout.spacing.md,
  transition: layout.transition,
}}>
```

### Replacing Binary Mobile/Desktop Checks

```typescript
// Before: Binary mobile check
const isMobile = width < 768;
const fontSize = isMobile ? 14 : 16;

// After: Five screen size categories
const layout = useResponsiveLayout(width, height);
const fontSize = layout.fontSize.body; // Automatically scales: 14-22.4px
```

## API Reference

See [ResponsiveScaling.ts](../systems/ResponsiveScaling.ts) for complete API documentation with TypeScript definitions and JSDoc comments.

### Core Functions

- `getScreenSize(width)` - Determine screen size category
- `calculateFontSize(base, screenSize)` - Calculate scaled font size
- `calculateSpacing(base, screenSize)` - Calculate scaled spacing
- `calculateResponsiveValues(width)` - Get all responsive values at once
- `createTransitionString(config?)` - Create CSS transition string

### Hooks

- `useResponsiveLayout(width, height)` - Complete responsive layout configuration
- `useCombatLayout(width, height)` - Combat-specific responsive layout
- `useContentArea(layout, hudHeight, controlsHeight)` - Calculate available content area

### Components

- `ResponsiveContainer` - Wrapper component with automatic responsive properties

## Troubleshooting

### Text Too Small on Mobile

Check that minimum font size constraint is being applied:

```typescript
const fontSize = calculateFontSize(baseSize, screenSize, 14, 24);
// Ensures result is never < 14px
```

### Layout Jumps During Resize

Enable smooth transitions:

```typescript
<ResponsiveContainer enableTransitions>
  {children}
</ResponsiveContainer>
```

### Spacing Not Scaling Proportionally

Ensure you're using the responsive spacing system:

```typescript
// Wrong: Hardcoded spacing
padding: 20

// Correct: Responsive spacing
padding: layout.spacing.md  // Scales: 8-24px
```

### Screen Size Not Updating

Check that width/height are being passed correctly:

```typescript
const { width, height } = useWindowSize();  // ✅ Correct
const layout = useResponsiveLayout(width, height);

// Not: useResponsiveLayout(1200, 800)  // ❌ Static values
```

## Future Enhancements

- [ ] Container query support for component-based responsive design
- [ ] Reduced motion preference support
- [ ] Custom breakpoint configuration per component
- [ ] Responsive font loading optimization
- [ ] Advanced accessibility features (contrast, text spacing)
