# Movement System Scaling Fix

## Problem Summary

Players reported that movement speed appeared extremely slow on screen despite correct physics calculations showing 2.0 m/s walking speed. The issue affected both TrainingScreen and CombatScreen, with worse symptoms on mobile devices.

## Root Causes

### 1. Arena Scale Not Applied to Movement Speed

**Location**: `src/utils/inputSystem.ts` lines 277-286

The physics engine used a fixed 100:1 pixel-to-meter conversion ratio regardless of arena scale:
- Desktop: scale = 1.0 (960px arena width) → 100 pixels per meter
- Mobile: scale = 0.3125 (300px arena width) → **still used 100 pixels per meter**

**Result**: On mobile, the same physics speed (2.0 m/s) covered much less visual distance because the arena was smaller but the pixel conversion wasn't scaled.

### 2. Hardcoded Bounds Offsets

**Location**: `src/utils/inputSystem.ts` lines 282-283

Fixed offsets `-60` and `-180` pixels were hardcoded in bounds clamping:
```typescript
// Old (wrong):
newX = Math.max(bounds.x, Math.min(bounds.x + bounds.width - 60, newX));
newY = Math.max(bounds.y, Math.min(bounds.y + bounds.height - 180, newY));
```

These offsets were NOT responsive to screen size or arena scale, causing inconsistent movement boundaries.

### 3. TrainingScreen Expandedbounds Workaround

**Location**: `src/components/screens/training/TrainingScreen3D.tsx` lines 253-261

TrainingScreen "fixed" the hardcoded offsets by expanding bounds by +60/+180:
```typescript
const expandedBounds = {
  width: trainingAreaBounds.width + 60,  // Compensate for -60
  height: trainingAreaBounds.height + 180, // Compensate for -180
};
```

This was a workaround that masked the real issue rather than fixing it.

## Solution Implemented

### 1. Scale-Aware Pixel Conversion

**File**: `src/utils/inputSystem.ts`

Added arena scale to the bounds interface and updated pixel conversion:

```typescript
export interface InputSystemConfig {
  readonly bounds?: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly scale?: number; // NEW: Arena scale factor
  };
  // ... rest of config
}

// Updated conversion logic:
const arenaScale = bounds?.scale ?? 1.0;
const pixelsPerMeter = 100 / arenaScale;
let newX = state.position.x * pixelsPerMeter;
let newY = state.position.z * pixelsPerMeter;
```

**Result**: 
- Desktop (scale=1.0): 100 pixels per meter
- Mobile (scale=0.3125): 320 pixels per meter (scaled)
- Visual movement speed is now consistent across all device sizes

### 2. Removed Hardcoded Offsets

**File**: `src/utils/inputSystem.ts`

Removed hardcoded `-60` and `-180` offsets from bounds clamping:

```typescript
// New (correct):
newX = Math.max(bounds.x, Math.min(bounds.x + bounds.width, newX));
newY = Math.max(bounds.y, Math.min(bounds.y + bounds.height, newY));
```

Movement now respects the actual arena bounds from the layout system.

### 3. Updated Screen Components

**Files**: 
- `src/components/screens/training/TrainingScreen3D.tsx`
- `src/components/screens/combat/CombatScreen3D.tsx`

Both screens now pass the scale factor to `usePlayerMovement`:

```typescript
const { playerPosition, isMoving, velocity } = usePlayerMovement({
  bounds: {
    x: arenaBounds.x,
    y: arenaBounds.y,
    width: arenaBounds.width,
    height: arenaBounds.height,
    scale: arenaBounds.scale, // NEW: Pass scale for proper conversion
  },
  // ... rest of config
});
```

Removed the `expandedBounds` workaround from TrainingScreen.

## Testing

### New Test File

**File**: `src/utils/__tests__/arenaCoordinateConversion.test.ts`

Comprehensive test suite covering:
- ✅ Desktop arena coordinate conversion (scale=1.0)
- ✅ Mobile arena coordinate conversion (scale=0.3125)
- ✅ Pixel-to-meter conversion with scaling
- ✅ Movement speed consistency across scales
- ✅ Bounds clamping without hardcoded offsets
- ✅ Real-world movement scenarios

All 12 tests pass successfully.

## Verification

1. **TypeScript**: `npm run check` - Passes ✅
2. **Tests**: `npm test` - Passes ✅ (12 new tests)
3. **Existing Tests**: All existing tests continue to pass ✅

## Impact

### Desktop (1200x800, scale=1.0)
- **Before**: Movement speed appeared correct
- **After**: Movement speed unchanged (still correct)

### Mobile (375x667, scale=0.3125)
- **Before**: Movement appeared 3.2x slower than desktop
- **After**: Movement speed now visually consistent with desktop

### Training Arena
- **Before**: Could not move across full arena (compensated with expandedBounds)
- **After**: Full arena movement with proper bounds

### Combat Arena
- **Before**: Movement worked but scaling was inconsistent
- **After**: Consistent scaled movement across all device sizes

## Technical Details

### Coordinate System Flow

**Before (Broken)**:
```
Input (WASD) → Physics (m/s) → Convert (×100) → Clamp (hardcoded -60,-180) → Screen
                                        ↓
                                  Ignores scale!
```

**After (Fixed)**:
```
Input (WASD) → Physics (m/s) → Convert (×100/scale) → Clamp (proper bounds) → Screen
                                        ↓
                                Uses arena scale
```

### Scale Factor Examples

| Device | Arena Width | Scale | Pixels/Meter | Visual Speed |
|--------|------------|-------|--------------|--------------|
| Desktop | 960px | 1.0 | 100 | Baseline |
| Large Phone | 500px | 0.521 | 192 | Consistent |
| Mobile | 300px | 0.3125 | 320 | Consistent |

### Movement Speed Calculation

At 2.0 m/s walking speed with 60fps:
- **Distance per frame**: 2.0 m/s × (1/60 s) = 0.0333 meters
- **Desktop pixels/frame**: 0.0333 m × 100 px/m = 3.33 pixels
- **Mobile pixels/frame**: 0.0333 m × 320 px/m = 10.67 pixels

Mobile needs more pixels per frame because the arena is smaller (300px vs 960px), ensuring visually consistent movement speed.

## Related Files Modified

1. `src/utils/inputSystem.ts` - Core movement physics integration
2. `src/components/screens/training/TrainingScreen3D.tsx` - Training screen
3. `src/components/screens/combat/CombatScreen3D.tsx` - Combat screen
4. `src/utils/__tests__/arenaCoordinateConversion.test.ts` - New test suite

## Future Improvements

1. ✅ Arena scale is now properly integrated
2. ✅ Movement speed is consistent across devices
3. ✅ Comprehensive test coverage added
4. 🔄 Consider adding visual indicators for movement speed
5. 🔄 Add E2E tests for player movement across screens
6. 🔄 Document the coordinate system in architecture docs

## References

- Issue: Movement extremely slow on screen
- Physics system: `src/systems/physics/MovementPhysics.ts`
- Layout system: `src/components/screens/*/hooks/use*Layout.ts`
- Arena bounds: `src/utils/mobileLayoutHelpers.ts`
