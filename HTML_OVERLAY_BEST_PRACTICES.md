# Html Overlay Best Practices for Three.js

**Version**: 1.0  
**Last Updated**: 2025-12-31  
**Module**: Three.js Html Overlays  
**Korean**: HTML 오버레이 모범 사례

## 📋 Overview

This document outlines best practices for using Html overlays from `@react-three/drei` in Black Trigram's Three.js scenes. Proper Html overlay positioning prevents z-fighting, clipping, and performance issues while maintaining 60fps target.

## 🎯 Core Principles

### 1. **Always Use Helper Functions**

✅ **DO**: Use `htmlOverlayHelpers` for consistent positioning and styling

```typescript
import { 
  applyHtmlOverlayStyles, 
  calculateDistanceFactor 
} from '../../utils/htmlOverlayHelpers';

const overlayStyle = applyHtmlOverlayStyles('hud', false);
```

❌ **DON'T**: Hardcode z-index or styling values

```typescript
// Bad - hardcoded z-index
<Html style={{ zIndex: 40 }}>
```

### 2. **Use Correct Layer for Z-Index**

Html overlay layers map to Z_INDEX hierarchy:

| Layer | Z-Index | Use Case |
|-------|---------|----------|
| `background` | 0 | Background scenes and effects |
| `arena` | 10 | Combat arena and training grounds |
| `players` | 20 | Player characters and enemies |
| `effects` | 30 | Visual effects and particles |
| `hud` | 40 | HUD elements (health bars, timers) |
| `mobile-controls` | 50 | Mobile touch controls |
| `modal` | 60 | Modal dialogs and overlays |
| `tooltip` | 70 | Tooltips and hints |
| `debug` | 80 | Debug and performance overlays |

**Example**:
```typescript
<BaseText
  korean="체력"
  english="Health"
  layer="hud" // Correct layer for HUD element
/>
```

### 3. **Set Pointer Events Appropriately**

- **Interactive elements** (buttons, menus): `pointerEvents: 'all'`
- **Non-interactive elements** (text, labels): `pointerEvents: 'none'`

This improves performance by preventing unnecessary event handling.

```typescript
// Interactive button
const overlayStyle = applyHtmlOverlayStyles('hud', true); // interactive = true

// Non-interactive text
const overlayStyle = applyHtmlOverlayStyles('hud', false); // interactive = false
```

### 4. **Use Responsive Distance Factors**

Distance factor controls Html overlay scaling. Use `calculateDistanceFactor()` for optimal values:

```typescript
const distanceFactor = calculateDistanceFactor(
  screenWidth,
  'text', // 'text' | 'button' | 'panel'
  isMobile
);
```

**Default factors**:
- Text: 10 (desktop), 15 (mobile)
- Button: 12 (desktop), 18 (mobile)
- Panel: 15 (desktop), 22.5 (mobile)

### 5. **Enable GPU Acceleration**

Always apply GPU acceleration for smooth rendering:

```typescript
const overlayStyle = applyHtmlOverlayStyles('hud', false);
// overlayStyle.transform = 'translateZ(0)' - GPU acceleration enabled
```

### 6. **Prevent Clipping with Bounds Checking**

For dynamic positioning, use `calculateSafePosition()` to prevent clipping:

```typescript
const safePosition = calculateSafePosition(
  [x, y, z], // Desired position
  { width: 200, height: 100, margin: 10 }, // Element bounds
  { width: screenWidth, height: screenHeight } // Screen bounds
);

if (safePosition.wasClamped) {
  console.warn('Position clamped to screen bounds');
}
```

## 🏗️ Component Patterns

### Pattern 1: Simple Text Overlay

```typescript
import { BaseText } from '../base';

<BaseText
  korean="공격"
  english="Attack"
  position={[0, 2, 0]}
  layer="hud"
  size="medium"
  isMobile={isMobile}
/>
```

### Pattern 2: Interactive Button Overlay

```typescript
import { BaseButton } from '../base';

<BaseButton
  korean="확인"
  english="Confirm"
  onClick={handleConfirm}
  position={[0, -1, 0]}
  layer="modal"
  variant="primary"
  size="md"
  isMobile={isMobile}
/>
```

### Pattern 3: Custom Html Overlay

```typescript
import React from 'react';
import { Html } from '@react-three/drei';
import { applyHtmlOverlayStyles, calculateDistanceFactor } from '../../utils/htmlOverlayHelpers';

interface MyCustomOverlayProps {
  readonly isMobile: boolean;
}

const MyCustomOverlay: React.FC<MyCustomOverlayProps> = ({ isMobile }) => {
  const distanceFactor = calculateDistanceFactor(
    window.innerWidth,
    'panel',
    isMobile
  );
  
  const overlayStyle = applyHtmlOverlayStyles('hud', false, distanceFactor);
  
  return (
    <Html 
      position={[0, 3, 0]}
      center={overlayStyle.center}
      distanceFactor={overlayStyle.distanceFactor}
      occlude={overlayStyle.occlude}
      style={{ pointerEvents: overlayStyle.pointerEvents }}
    >
      <div style={{
        transform: overlayStyle.transform,
        zIndex: overlayStyle.zIndex,
        padding: '12px',
        background: 'rgba(26, 26, 26, 0.9)',
        borderRadius: '8px',
      }}>
        {/* Custom content */}
      </div>
    </Html>
  );
};
```

## 🚀 Performance Optimization

### 1. **Use React.memo for Static Overlays**

```typescript
export const StaticOverlay = React.memo<Props>(({ position, text }) => {
  return (
    <BaseText
      korean={text.korean}
      english={text.english}
      position={position}
      layer="hud"
    />
  );
});
```

### 2. **Memoize Expensive Calculations**

```typescript
const overlayStyle = useMemo(() => {
  const factor = calculateDistanceFactor(screenWidth, 'text', isMobile);
  return applyHtmlOverlayStyles('hud', false, factor);
}, [screenWidth, isMobile]);
```

### 3. **Minimize Html Overlay Count**

- Combine multiple text elements into a single Html overlay when possible
- Use 3D Text meshes for static labels that don't need interactivity
- Hide off-screen Html overlays

```typescript
// Good - single Html overlay for related elements
<Html position={[0, 2, 0]}>
  <div>
    <div>{player.nameKorean} | {player.name}</div>
    <div>체력: {player.health} | Health: {player.health}</div>
  </div>
</Html>

// Bad - multiple Html overlays for same location
<Html position={[0, 2.2, 0]}>
  <div>{player.nameKorean} | {player.name}</div>
</Html>
<Html position={[0, 1.8, 0]}>
  <div>체력: {player.health} | Health: {player.health}</div>
</Html>
```

### 4. **Use Distance-Based Culling**

Hide Html overlays when too far from camera:

```typescript
const { camera } = useThree();
const [visible, setVisible] = useState(true);

useFrame(() => {
  const distance = camera.position.distanceTo(overlayPosition);
  setVisible(distance < 20); // Hide if >20 units away
});

if (!visible) return null;
```

## 📱 Mobile Considerations

### 1. **Larger Touch Targets**

Mobile buttons should be at least 44x44px (iOS guideline):

```typescript
<BaseButton
  size={isMobile ? "lg" : "md"} // Larger on mobile
  isMobile={isMobile}
/>
```

### 2. **Safe Area Insets**

Account for notches and home indicators:

```typescript
import { getDefaultSafeArea } from '../../utils/htmlOverlayHelpers';

const safeArea = getDefaultSafeArea(isMobile);
// safeArea.top = 44px, safeArea.bottom = 34px on mobile
```

### 3. **Simplified Overlays**

Reduce visual complexity on mobile:

```typescript
const fontSize = isMobile ? 12 : 16;
const showLabels = !isMobile; // Hide some labels on mobile
```

## 🧪 Testing Checklist

Before deploying Html overlay changes:

- [ ] No z-fighting with 3D elements
- [ ] Text doesn't clip at screen edges
- [ ] Proper layering (modals over HUD, HUD over arena)
- [ ] Interactive elements respond to pointer events
- [ ] Non-interactive elements don't block interactions
- [ ] 60fps maintained with all overlays visible
- [ ] Korean/English text properly contained
- [ ] Mobile responsive (test 375x667 minimum)
- [ ] Safe area respected on notched devices
- [ ] Touch targets ≥44px on mobile

## 🔧 Troubleshooting

### Issue: Html overlay clips at screen edge

**Solution**: Use `calculateSafePosition()` with element bounds:

```typescript
const safePosition = calculateSafePosition(
  position,
  { width: elementWidth, height: elementHeight, margin: 10 },
  { width: screenWidth, height: screenHeight }
);
```

### Issue: Text appears behind 3D objects

**Solution**: Check z-index layer and ensure HUD > PLAYERS:

```typescript
<BaseText layer="hud" /> {/* z-index: 40 */}
<Player3D /> {/* z-index: 20 (PLAYERS layer) */}
```

### Issue: Button not clickable

**Solution**: Ensure `pointerEvents: 'all'` for interactive elements:

```typescript
const overlayStyle = applyHtmlOverlayStyles('hud', true); // interactive
```

### Issue: Performance drops with many Html overlays

**Solutions**:
1. Use React.memo for static overlays
2. Implement distance-based culling
3. Combine multiple elements into single Html overlay
4. Use 3D Text meshes for static labels

### Issue: Html overlay too small/large

**Solution**: Use `calculateDistanceFactor()` for responsive scaling:

```typescript
const distanceFactor = calculateDistanceFactor(
  window.innerWidth,
  'text',
  isMobile
);
```

## 📚 References

- **Html Component**: [@react-three/drei Html docs](https://github.com/pmndrs/drei#html)
- **Z_INDEX Hierarchy**: `src/types/LayoutTypes.ts`
- **Html Overlay Helpers**: `src/utils/htmlOverlayHelpers.ts`
- **Html Overlay Types**: `src/types/HtmlOverlayTypes.ts`
- **Base Components**: `src/components/base/BaseText.tsx`, `BaseButton.tsx`

## 🎯 Summary

- **Use helper functions** for consistent z-index and styling
- **Choose correct layer** for proper stacking order
- **Optimize pointer events** (interactive vs non-interactive)
- **Apply GPU acceleration** for smooth rendering
- **Test thoroughly** across devices and screen sizes
- **Maintain 60fps** with performance optimizations

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
