# HUD Sizing and Mobile Rendering Fix

## Problem Statement

Multiple issues were reported with HUD positioning and mobile rendering:

1. **HUD Elements Below Screen**: Parts of HUDs were rendering below the visible viewport, making them inaccessible
2. **Mobile Rendering Issues**: Training and combat screens showed black/flickering arena on mobile in portrait mode
3. **Canvas Sizing Inconsistency**: CombatScreen3D missing explicit Canvas dimensions

## Root Causes

### 1. Canvas Sizing
- **CombatScreen3D** did not have explicit `style={{ width, height }}` on Canvas element
- **TrainingScreen3D** had inconsistent units (`width, height` vs `${width}px, ${height}px`)
- This caused Three.js to potentially render at incorrect dimensions

### 2. Container Overflow
- Screen containers did not have `overflow: hidden`
- HUD overlay divs did not have `overflow: hidden`
- Elements could extend beyond viewport boundaries

### 3. Mobile Control Positioning
- Mobile controls used `position: fixed` instead of `position: absolute`
- Fixed positioning relative to viewport caused controls to render outside container
- Affected components:
  - `MobileControlsOverlay`
  - `StanceWheelPure` (both expanded and collapsed states)
  - `GestureRecognizerPure`

## Solutions Implemented

### 1. Canvas Sizing Fixes

**CombatScreen3D.tsx**:
```tsx
<Canvas
  style={{ width: `${width}px`, height: `${height}px` }}  // Added explicit sizing
  camera={{ /* ... */ }}
  gl={{ /* ... */ }}
>
```

**TrainingScreen3D.tsx**:
```tsx
<Canvas
  style={{ width: `${width}px`, height: `${height}px` }}  // Consistent px units
  gl={{ /* ... */ }}
>
```

### 2. Container Overflow Fixes

**Screen Containers**:
```tsx
<div
  style={{
    width: `${width}px`,
    height: `${height}px`,
    position: "relative",
    overflow: "hidden",  // Prevent content overflow
  }}
>
```

**HUD Overlay Containers**:
```tsx
<div
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: Z_INDEX.HUD,
    overflow: "hidden",  // Clip HUD elements
  }}
>
```

### 3. Mobile Control Positioning Fixes

Changed from `position: fixed` to `position: absolute`:

**MobileControlsPure.tsx**:
```tsx
<div
  style={{
    position: "absolute",  // Changed from fixed
    bottom: `${bottom}px`,
    left: 0,
    right: 0,
    // ...
  }}
>
```

**StanceWheelPure.tsx** (both expanded and collapsed):
```tsx
<div
  style={{
    position: "absolute",  // Changed from fixed
    bottom: `${dynamicBottom}px`,
    left: "50%",
    transform: "translateX(-50%)",
    // ...
  }}
>
```

**GestureRecognizerPure.tsx**:
```tsx
<div
  style={{
    position: "absolute",  // Changed from fixed
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    // ...
  }}
>
```

## Testing

### Build Tests
```bash
npm run check  # TypeScript compilation - PASSED
npm run build  # Production build - PASSED
```

### Unit Tests
```bash
npm test -- --run StanceWheel.test.tsx  # 33/33 tests PASSED
npm test -- --run CombatScreen3D        # All tests PASSED
npm test -- --run TrainingScreen3D      # All tests PASSED
```

## Expected Impact

### Desktop/Laptop
- ✅ All HUD elements properly contained within viewport
- ✅ No UI elements extending below visible area
- ✅ Consistent Canvas rendering at correct dimensions

### Mobile (Portrait and Landscape)
- ✅ Mobile controls positioned correctly within container
- ✅ Stance wheel centered and accessible
- ✅ No black screen or flickering issues
- ✅ Arena renders properly in both orientations
- ✅ All touch controls remain within touchable area

### Tablet
- ✅ Responsive layout maintained
- ✅ HUD elements scale appropriately
- ✅ No overflow issues at any screen size

## Files Modified

1. `src/components/screens/combat/CombatScreen3D.tsx`
2. `src/components/screens/training/TrainingScreen3D.tsx`
3. `src/components/shared/mobile/MobileControlsPure.tsx`
4. `src/components/shared/mobile/StanceWheelPure.tsx`
5. `src/components/shared/mobile/GestureRecognizerPure.tsx`

## Related Issues

- HUD positioning issues on all screens
- Mobile rendering black screen/flickering
- Controls extending beyond viewport

## Technical Notes

### Why `absolute` vs `fixed`?

- `position: fixed` positions elements relative to the **viewport**
- `position: absolute` positions elements relative to the **nearest positioned ancestor**
- Since our game screens are contained divs (not fullscreen), `absolute` is correct
- This ensures all UI elements are properly contained within the game area

### Canvas Style Requirement

Three.js @react-three/fiber Canvas component:
- Requires explicit width/height in style prop for proper WebGL context sizing
- Without it, Canvas may render at default/incorrect dimensions
- Inconsistent units (number vs string) can cause rendering issues

## Testing Recommendations

For thorough validation, test on:
- [ ] Desktop Chrome (1920x1080, 2560x1440, 3840x2160)
- [ ] Desktop Firefox (various resolutions)
- [ ] Mobile Safari (iPhone - portrait and landscape)
- [ ] Mobile Chrome (Android - portrait and landscape)
- [ ] Tablet (iPad - both orientations)

## Korean Martial Arts Context

These fixes ensure the cyberpunk Korean aesthetic is properly displayed:
- 八卦 (팔괘 - Eight Trigrams) stance wheel centered and accessible
- 급소격 (Vital Point Strike) overlays properly positioned
- Combat arena (무예 - Martial Arts) fully visible
- All UI maintains 흑괘 (Black Trigram) themed consistency
