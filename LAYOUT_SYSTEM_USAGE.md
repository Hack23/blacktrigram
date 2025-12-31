# Layout System Usage Guide

This guide demonstrates how to use the unified LayoutSystem for consistent component positioning across Black Trigram screens.

## Overview

The unified layout system provides:
- **12-column grid system** for consistent alignment
- **Responsive positioning** with mobile/tablet/desktop breakpoints
- **Z-index hierarchy** for proper layering
- **Safe area handling** for mobile devices with notches
- **Alignment helpers** for centering and positioning

## Quick Start

### Option 1: Using ResponsiveContainer (Recommended)

```tsx
import { ResponsiveContainer } from "../base/ResponsiveContainer";
import { Z_INDEX } from "../../types/LayoutTypes";

// Grid-based positioning
<ResponsiveContainer
  grid={{ column: 2, span: 8 }}
  containerWidth={width}
  zIndex={Z_INDEX.HUD}
>
  <PlayerHUD />
</ResponsiveContainer>

// Responsive positioning with alignment
<ResponsiveContainer
  position={{
    base: { x: 100, y: 50 },
    mobile: { x: 10, y: 20 }
  }}
  containerWidth={width}
  horizontalAlign="center"
  zIndex={Z_INDEX.MODAL}
>
  <Dialog />
</ResponsiveContainer>
```

### Option 2: Using LayoutSystem Directly

```tsx
import { defaultLayoutSystem } from "../../systems/LayoutSystem";
import { Z_INDEX } from "../../types/LayoutTypes";

// Calculate grid position
const gridPos = defaultLayoutSystem.calculateGridPosition(2, 8, width);

// Calculate responsive position
const screenSize = defaultLayoutSystem.getScreenSize(width, height);
const pos = defaultLayoutSystem.calculateResponsivePosition(
  {
    base: { x: 100, y: 50 },
    mobile: { x: 10, y: 20 }
  },
  screenSize
);

// Calculate alignment
const centeredX = defaultLayoutSystem.alignHorizontal(
  elementWidth,
  containerWidth,
  "center"
);
```

## Z-Index Hierarchy

Always use the Z_INDEX constants for proper layering:

```tsx
import { Z_INDEX } from "../../types/LayoutTypes";

const layers = {
  BACKGROUND: 0,      // Background scenes
  ARENA: 10,          // Combat arena
  PLAYERS: 20,        // Player characters
  EFFECTS: 30,        // Visual effects
  HUD: 40,            // HUD elements
  MOBILE_CONTROLS: 50, // Touch controls
  MODAL: 60,          // Modal dialogs
  TOOLTIP: 70,        // Tooltips
  DEBUG: 80,          // Debug overlays
};
```

## Grid System

The 12-column grid provides consistent alignment:

```tsx
// Full width (12 columns)
<ResponsiveContainer grid={{ column: 0, span: 12 }} containerWidth={width}>
  <Header />
</ResponsiveContainer>

// Half width (6 columns)
<ResponsiveContainer grid={{ column: 0, span: 6 }} containerWidth={width}>
  <LeftPanel />
</ResponsiveContainer>

// Centered 8 columns
<ResponsiveContainer grid={{ column: 2, span: 8 }} containerWidth={width}>
  <MainContent />
</ResponsiveContainer>
```

## Responsive Positioning

Define positions for different screen sizes:

```tsx
<ResponsiveContainer
  position={{
    base: { x: 100, y: 50 },        // Desktop (≥1200px)
    tablet: { x: 50, y: 30 },       // Tablet (768-1199px)
    mobile: { x: 10, y: 20 },       // Mobile (<768px)
    scaleProportionally: true       // Auto-scale if no override
  }}
  containerWidth={width}
>
  <Element />
</ResponsiveContainer>
```

## Alignment Helpers

Center or align elements within containers:

```tsx
// Center horizontally and vertically
<ResponsiveContainer
  position={{ base: { x: 0, y: 0 } }}
  containerWidth={width}
  containerHeight={height}
  elementWidth={400}
  elementHeight={300}
  horizontalAlign="center"
  verticalAlign="middle"
>
  <Dialog />
</ResponsiveContainer>

// Align to bottom-right
<ResponsiveContainer
  position={{ base: { x: 0, y: 0 } }}
  containerWidth={width}
  containerHeight={height}
  elementWidth={200}
  elementHeight={100}
  horizontalAlign="right"
  verticalAlign="bottom"
  margin={20}
>
  <VolumeControl />
</ResponsiveContainer>
```

## Safe Area Handling

Handle mobile device notches and home indicators:

```tsx
// Top safe area (notch)
<ResponsiveContainer
  position={{ base: { x: 0, y: 10 } }}
  containerWidth={width}
  useSafeArea
  safeAreaEdge="top"
  zIndex={Z_INDEX.HUD}
>
  <StatusBar />
</ResponsiveContainer>

// Bottom safe area (home indicator)
<ResponsiveContainer
  position={{ base: { x: 0, y: height - 100 } }}
  containerWidth={width}
  useSafeArea
  safeAreaEdge="bottom"
  zIndex={Z_INDEX.MOBILE_CONTROLS}
>
  <ActionButtons />
</ResponsiveContainer>
```

## Migration Examples

### Before: Hardcoded Positioning

```tsx
// Old approach with hardcoded values
<div style={{
  position: "absolute",
  top: "20px",
  right: "20px",
  zIndex: 1000,
}}>
  <VolumeControl />
</div>
```

### After: Using ResponsiveContainer

```tsx
// New approach with responsive layout
import { ResponsiveContainer } from "../base/ResponsiveContainer";
import { Z_INDEX } from "../../types/LayoutTypes";

<ResponsiveContainer
  position={{
    base: { x: width - 220, y: 20 },
    mobile: { x: width - 180, y: 10 }
  }}
  containerWidth={width}
  horizontalAlign="right"
  margin={20}
  zIndex={Z_INDEX.HUD}
>
  <VolumeControl />
</ResponsiveContainer>
```

### Before: Manual Grid Calculations

```tsx
// Old approach with manual calculations
const columnWidth = width / 12;
const x = 2 * columnWidth;
const elementWidth = 8 * columnWidth - 20;

<div style={{
  position: "absolute",
  left: x,
  top: 100,
  width: elementWidth,
}}>
  <PlayerInfo />
</div>
```

### After: Using Grid System

```tsx
// New approach with grid system
<ResponsiveContainer
  grid={{ column: 2, span: 8 }}
  position={{ base: { x: 0, y: 100 } }}
  containerWidth={width}
  zIndex={Z_INDEX.HUD}
>
  <PlayerInfo />
</ResponsiveContainer>
```

## Best Practices

1. **Always use Z_INDEX constants** for layering
2. **Prefer grid-based positioning** for layout structure
3. **Use responsive positioning** for elements that need different positions per device
4. **Apply safe areas** for mobile UI elements near edges
5. **Use alignment helpers** instead of manual centering calculations
6. **Provide mobile overrides** for elements that need different positioning on small screens
7. **Test on multiple screen sizes** (375px, 768px, 1200px, 1920px)

## Performance Considerations

- ResponsiveContainer uses `useMemo` to optimize position calculations
- Position recalculates only when dependencies change (width, grid config, etc.)
- Avoid inline object creation for position config - use constants when possible
- Grid calculations are <1ms for 60fps performance

## Testing

When writing tests for components using the layout system:

```tsx
import { render } from "@testing-library/react";
import { Z_INDEX } from "../../types/LayoutTypes";

it("should position element correctly", () => {
  const { container } = render(
    <ResponsiveContainer
      grid={{ column: 2, span: 4 }}
      containerWidth={1200}
      zIndex={Z_INDEX.HUD}
      data-testid="my-element"
    >
      <div>Content</div>
    </ResponsiveContainer>
  );

  const element = container.querySelector('[data-testid="my-element"]');
  expect(element).toBeTruthy();
  expect(element?.getAttribute("data-layout-grid")).toBe("2,4");
  expect(element?.getAttribute("data-layout-zindex")).toBe(String(Z_INDEX.HUD));
});
```

## Further Reading

- `src/systems/LayoutSystem.ts` - Core layout calculations
- `src/types/LayoutTypes.ts` - Type definitions
- `src/components/base/ResponsiveContainer.tsx` - Container component
- `src/systems/LayoutSystem.test.ts` - Test examples
