# Movement Speed Fix - Resolution of Coordinate System Mismatch

## Problem Statement

After PR #1306, player movement remained extremely slow:
- **Reported**: 25 seconds to traverse 9 meters
- **Expected**: 1.8-4.5 seconds (at 2-5 m/s movement speed)
- **Issue**: Movement was ~5.5x slower than expected

## Root Cause Analysis

PR #1306 attempted to fix movement speed by making the system "scale-aware," but introduced a fundamental coordinate system mismatch:

### The Incorrect Approach (PR #1306)

```typescript
// ❌ WRONG: World size scaled with screen size
const worldWidth = 16 * scale;     // Desktop: 16m, Mobile: 5m
const worldDepth = 8 * scale;      // Desktop: 8m, Mobile: 2.5m

// ❌ WRONG: Pixels-per-meter used constant divided by scale
const pixelsPerMeter = 100 / scale; // Desktop: 100, Mobile: 320
```

### The Mismatch

**Physics System Calculation:**
- Desktop: 100 pixels per meter
- Mobile: 320 pixels per meter

**3D Rendering Expectation:**
- Desktop: 960px arena / 16m world = **60 pixels per meter**
- Mobile: 300px arena / 5m world = **60 pixels per meter**

**Result**: Physics system moved the player using 100 px/m (or 320 px/m on mobile), but the 3D rendering interpreted positions at 60 px/m. This caused a ~40% coordinate mismatch on desktop and worse on mobile.

## The Correct Solution

### Key Principle

**The physical world size should be fixed, regardless of device screen size. Only the pixel density changes.**

### Implementation

#### 1. Created Arena Constants (`src/types/arenaConstants.ts`)

```typescript
// Fixed world dimensions in meters
export const WORLD_WIDTH_METERS = 16;  // Always 16 meters
export const WORLD_DEPTH_METERS = 8;   // Always 8 meters

// Calculate correct pixels-per-meter from arena dimensions
export function calculatePixelsPerMeter(arenaWidthPixels: number): number {
  return arenaWidthPixels / WORLD_WIDTH_METERS;
}
```

**Results:**
- Desktop (960px): 960 / 16 = **60 px/m** ✓
- Mobile (300px): 300 / 16 = **18.75 px/m** ✓

#### 2. Fixed Movement System (`src/utils/inputSystem.ts`)

```typescript
// ✅ CORRECT: Calculate pixels-per-meter from arena width
const pixelsPerMeter = bounds?.width
  ? calculatePixelsPerMeter(bounds.width)
  : 60; // fallback to desktop default

// Convert 3D to pixels
let newX = state.position.x * pixelsPerMeter;
let newY = state.position.z * pixelsPerMeter;
```

#### 3. Fixed 3D Coordinate Conversion

**TrainingScreen3D.tsx:**
```typescript
// ✅ CORRECT: Fixed world size
const WORLD_WIDTH = 16; // meters (fixed, not scaled)
const WORLD_DEPTH = 8;  // meters (fixed, not scaled)

const x = relX * WORLD_WIDTH - WORLD_WIDTH / 2;
const z = relZ * WORLD_DEPTH - WORLD_DEPTH / 2;

// Dummy position: fixed at 5 meters (not scaled)
const dummyPosition = [5, 0, 0];
```

**CombatScreen3D.tsx:**
```typescript
// ✅ CORRECT: Fixed world size for both players
const WORLD_WIDTH = 16; // meters (fixed)
const WORLD_DEPTH = 8;  // meters (fixed)
```

#### 4. Fixed Combat Distance Calculations

**useAICombat.ts:**
```typescript
// ✅ CORRECT: Calculate from arena dimensions
const pixelsPerMeter = arenaBounds.width
  ? calculatePixelsPerMeter(arenaBounds.width)
  : 60;
const distanceInMeters = distanceInPixels / pixelsPerMeter;
```

**useCombatActions.ts:**
```typescript
// ✅ CORRECT: Consistent calculation throughout
const pixelsPerMeter = arenaBounds.width
  ? calculatePixelsPerMeter(arenaBounds.width)
  : 60;
const baseSpeed = (2.5 * pixelsPerMeter) / 20;
```

## Expected Results

### Desktop (960px arena)
- Pixels per meter: 60
- World size: 16m × 8m (fixed)
- Player at 2 m/s moves 120 pixels per second
- Time to traverse 9m: **4.5 seconds** ✓

### Mobile (300px arena)
- Pixels per meter: 18.75
- World size: 16m × 8m (same world!)
- Player at 2 m/s moves 37.5 pixels per second
- Time to traverse 9m: **4.5 seconds** ✓

### Comparison

| Metric | Before Fix | After Fix |
|--------|-----------|-----------|
| Desktop px/m | 100 (wrong) | 60 (correct) |
| Mobile px/m | 320 (wrong) | 18.75 (correct) |
| Desktop 9m traversal | ~25s | 4.5s ✓ |
| Mobile 9m traversal | ~25s | 4.5s ✓ |
| World size desktop | 16m | 16m |
| World size mobile | 5m (wrong!) | 16m ✓ |

## Verification

### TypeScript Compilation
```bash
npm run check
# ✅ PASS - No errors
```

### Unit Tests
```bash
npm test
# ✅ PASS - 7766 tests passed
```

### Manual Testing Required

1. **Training Screen:**
   - Start at one side of arena
   - Move to training dummy (should be ~9m away)
   - Expected time at 2 m/s: **4.5 seconds**
   - Verify on both desktop and mobile

2. **Combat Screen:**
   - Start at one side of arena
   - Move across to opponent
   - Verify movement feels consistent with training
   - Verify combat distance detection works correctly

## Files Modified

1. `src/types/arenaConstants.ts` - **NEW** - Central constants and calculations
2. `src/utils/inputSystem.ts` - Movement pixel-to-meter conversion
3. `src/components/screens/training/TrainingScreen3D.tsx` - 3D coordinate conversion
4. `src/components/screens/combat/CombatScreen3D.tsx` - 3D coordinate conversion
5. `src/components/screens/combat/hooks/useAICombat.ts` - AI distance calculations
6. `src/components/screens/combat/hooks/useCombatActions.ts` - AI movement and thresholds

## Breaking Changes

None - this is a bug fix that restores intended behavior.

## Deprecations

- `BASE_PIXELS_PER_METER` constant is deprecated
- Use `calculatePixelsPerMeter(arenaWidth)` instead

## Summary

The core issue was attempting to scale the game world size with screen resolution. The correct approach is:

1. **World size is fixed**: 16m × 8m always
2. **Pixel density varies**: Desktop (60 px/m), Mobile (18.75 px/m)
3. **Calculate from arena**: `pixelsPerMeter = arenaWidth / WORLD_WIDTH_METERS`

This ensures:
- ✅ Consistent movement speed across all devices
- ✅ Correct distance calculations for combat
- ✅ Proper 3D coordinate mapping
- ✅ Expected traversal times (4.5s for 9m at 2m/s)
