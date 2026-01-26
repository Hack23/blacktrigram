# Coordinate System Investigation Report

## Summary
Investigated the entire combat system and screens for similar pixel/meter coordinate mixing issues. Found and fixed **4 additional components** beyond the original knockback issue.

## Components Fixed

### 1. useCombatActions.ts (Original Issue)
**Issue**: Knockback boundary clamping used pixel-based bounds
**Fix**: Changed to meter-based boundary calculation
**Impact**: Players no longer pushed outside arena by strong knockback

### 2. DamageNumbers.tsx
**Issue**: Floating damage numbers used pixel-based position normalization
**Fix**: Changed to meter-based normalization using worldWidthMeters/worldDepthMeters
**Impact**: Damage numbers now render at correct positions relative to hits

### 3. HitEffects3DInstanced.tsx
**Issue**: Instanced hit effects used pixel-based position normalization
**Fix**: Changed to meter-based normalization
**Impact**: Hit particle effects now appear at correct locations

### 4. HitEffects3D.tsx
**Issue**: Non-instanced hit effects used pixel-based position normalization
**Fix**: Changed to meter-based normalization with proper defaults
**Impact**: All hit effects (sparks, flashes, etc.) render correctly

### 5. ActionFeedback.tsx
**Issue**: Action feedback text ("Critical!", "Perfect!") used pixel-based positioning
**Fix**: Changed to meter-based normalization
**Impact**: Feedback text appears at correct positions above hits

## Technical Details

### Problem Pattern (All Components)
```typescript
// ❌ WRONG: Mixing meters and pixels
const relX = (position.x - arenaBounds.x) / arenaBounds.width;
// position.x: meters (e.g., 2.5m from center)
// arenaBounds.x: pixels (e.g., 100px from left)
// Result: Meaningless calculation
```

### Solution Pattern (All Components)
```typescript
// ✅ CORRECT: Meter-based normalization
const halfWidth = arenaBounds.worldWidthMeters / 2;
const halfDepth = arenaBounds.worldDepthMeters / 2;
const relX = (position.x + halfWidth) / arenaBounds.worldWidthMeters;
const relZ = (position.y + halfDepth) / arenaBounds.worldDepthMeters;
```

### Coordinate System Architecture
```
Physics-First System:
- All positions in METERS relative to arena center (0, 0)
- Arena extends from:
  - X: -worldWidthMeters/2 to +worldWidthMeters/2
  - Z: -worldDepthMeters/2 to +worldDepthMeters/2
  
Visual effects normalize meter positions to 0-1 range:
  relX = (position.x + halfWidth) / worldWidthMeters
  
Then map to 3D world coordinates:
  worldX = relX * 16 - 8  // -8 to +8 range
```

## Impact Analysis

### Before Fix
- Knockback could push players outside arena
- Visual effects rendered at incorrect positions
- Effects more noticeable on:
  - Smaller arenas (6m, 8m)
  - Positions near arena edges
  - High-resolution screens

### After Fix
- All positions clamped correctly to arena boundaries
- Visual effects render at accurate positions
- Consistent behavior across all arena sizes
- Proper physics-first architecture maintained

### Example Calculation
**Scenario**: 8m × 6m arena, player at x=3m (3 meters right of center)

**Before:**
```typescript
relX = (3 - 100) / 800 = -0.12125  // ❌ Wrong!
// Effect appears far left, possibly outside arena
```

**After:**
```typescript
relX = (3 + 4) / 8 = 0.875  // ✅ Correct!
// Effect appears at 87.5% from left (correct position)
```

## Verification Results

### Components Checked ✅
- [x] useCombatActions.ts - Fixed knockback + AI movement
- [x] DamageNumbers.tsx - Fixed
- [x] HitEffects3DInstanced.tsx - Fixed
- [x] HitEffects3D.tsx - Fixed
- [x] ActionFeedback.tsx - Fixed
- [x] useCombatLayout.ts - Verified correct (only calculates bounds)
- [x] CombatScreen3D.tsx - Verified correct (initializes in meters)
- [x] useAICombat.ts - Verified correct (uses meters)

### Test Results ✅
```
✓ DamageNumbers.test.tsx (7 tests)
✓ HitEffects3D.test.tsx (15 tests)
✓ HitEffects3DInstanced.test.tsx (24 tests)
✓ ActionFeedback.test.tsx (16 tests)
✓ KnockbackArenaBounds.test.ts (5 tests) - NEW
✓ All physics tests (201 tests)
✓ All combat hooks tests (190 tests)
✓ TypeScript: PASS
✓ ESLint: PASS
```

## Conclusion

**Total Issues Found**: 5 (1 original + 4 discovered)
**Total Issues Fixed**: 5
**Test Coverage**: Comprehensive
**Breaking Changes**: None
**Performance Impact**: None (same calculations, correct values)

All coordinate system issues in the combat system have been identified and resolved. The entire codebase now consistently uses the physics-first meter-based coordinate system with proper conversions to pixel/3D coordinates only at render time.

## Related Files
- Investigation triggered by: Knockback boundary issue
- Root cause: Physics-first architecture not consistently applied
- Solution: Unified meter-based coordinate handling throughout combat system
