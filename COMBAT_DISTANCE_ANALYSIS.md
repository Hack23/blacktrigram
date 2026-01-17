# Combat System Distance Calculation Analysis

## Critical Issue Identified ⚠️

The movement system fix introduced a **coordinate system mismatch** between movement positions and combat distance calculations.

### Root Cause

**Movement System** (after fix):
- Uses `BASE_PIXELS_PER_METER / arenaScale` for pixel-to-meter conversion
- Desktop (scale=1.0): 100 pixels per meter
- Mobile (scale=0.3125): 320 pixels per meter
- Player positions are stored in **scale-adjusted pixel coordinates**

**Combat System** (current):
- Uses fixed `METERS_TO_PIXELS_SCALE = 100` for distance calculations
- Technique reach converted using fixed 100 px/m ratio
- Distance calculated directly from pixel coordinates: `sqrt(dx² + dy²)`

### The Problem

When arena scale < 1.0 (mobile devices):
1. Player position: `(100, 100)` in screen pixels
2. Movement system converts to 3D: `(100 / 320, 100 / 320) = (0.3125, 0.3125)` meters
3. Movement system converts back: `(0.3125 * 320, 0.3125 * 320) = (100, 100)` pixels ✅
4. **BUT** combat distance uses pixel coordinates directly: `distance = 100` pixels
5. Technique reach: `1.5 meters * 100 = 150` pixels (using fixed METERS_TO_PIXELS_SCALE)
6. **Result**: Distance appears SHORTER than it should in meters!

### Example Scenario

**Mobile Arena (scale=0.3125):**
- Player at (0, 0), Enemy at (320, 0) in screen pixels
- Actual distance: 320 pixels
- Movement system interprets this as: 320 / 320 = 1 meter ✅
- Combat system interprets this as: 320 / 100 = 3.2 meters ❌

**Result**: A kick with 1.5m reach appears to miss when it should hit!

### Visual Example

```
Desktop (scale=1.0, 100 px/m):
Player [●]-----100px-----[○] Enemy
       └─────1.0m──────┘
Distance: 100px ÷ 100 = 1.0m ✅ Correct

Mobile (scale=0.3125, 320 px/m):
Player [●]-----100px-----[○] Enemy
       └─────0.3125m────┘  (movement)
       └─────1.0m──────┘  (combat calc) ❌ WRONG!
Distance: 100px ÷ 100 = 1.0m (should be 0.3125m)
```

## Impact on Combat

### 1. Hit Detection Accuracy ❌
- Kicks with 1.5m reach may miss at 1.4m actual distance
- Visual disconnect between animation and hit confirmation
- Mobile players see attacks "miss" when they look like they should hit

### 2. Animation Timing ❌
- Animation hit windows calculated based on reach in meters
- Reach calculations use correct meters, but distance uses wrong scale
- Kick animation shows foot extending to enemy, but no hit registered

### 3. AI Behavior ❌
- AI uses `distanceToOpponent` to select techniques
- With wrong distance calculation, AI selects inappropriate techniques
- May try punches (short reach) when kicks (long reach) are needed
- Or vice versa - attempts kicks when too close

### 4. Visual Feedback ❌
- Distance indicators show incorrect range circles
- "In range" indicators activate at wrong times
- Player confusion about effective attack ranges

## Files Affected

### Primary Files
1. `src/components/screens/combat/hooks/useAICombat.ts`
   - Line 1144-1146: Distance calculation
   - Line 727: Technique range check

2. `src/components/screens/combat/hooks/useCombatActions.ts`
   - Uses METERS_TO_PIXELS_SCALE for movement threshold

3. `src/systems/CombatSystem.ts`
   - Uses METERS_TO_PIXELS_SCALE throughout
   - Distance calculations for hit detection

4. `src/systems/physics/CollisionDetection.ts`
   - Coordinate conversions for collision detection

### Related Files
- `src/utils/inputSystem.ts` - Movement coordinate system
- `src/types/physicsConstants.ts` - METERS_TO_PIXELS_SCALE constant
- `src/components/screens/combat/CombatScreen3D.tsx` - Arena scaling

## Solution Required

### Option 1: Scale-Aware Distance Calculations (Recommended)

Pass arena scale to combat calculations and convert distances properly:

```typescript
// In useAICombat.ts
const buildCombatContext = useCallback((): CombatContext => {
  const dx = player.position.x - opponent.position.x;
  const dy = player.position.y - opponent.position.y;
  const distanceInPixels = Math.sqrt(dx * dx + dy * dy);
  
  // Convert pixel distance to meters using arena scale
  const pixelsPerMeter = BASE_PIXELS_PER_METER / (arenaBounds.scale ?? 1.0);
  const distanceInMeters = distanceInPixels / pixelsPerMeter;
  
  return {
    // ... other context
    distanceToOpponent: distanceInMeters * METERS_TO_PIXELS_SCALE, // Convert to "standard" pixels
  };
}, [player, opponent, arenaBounds]);
```

### Option 2: Normalize All Combat to Meters

Convert all combat calculations to work in meters directly:

```typescript
// Convert positions to meters
const playerMeters = {
  x: player.position.x / pixelsPerMeter,
  y: player.position.y / pixelsPerMeter,
};

// Calculate distance in meters
const distanceInMeters = calculateDistance(playerMeters, opponentMeters);

// Compare against technique reach in meters (no conversion needed)
if (distanceInMeters <= technique.reach) {
  // Hit!
}
```

### Option 3: Use 3D Coordinates for Combat

Since movement already converts to 3D coordinates, use those for combat:

```typescript
// Movement already maintains 3D position in meters
const distance3D = calculateDistance3D(
  state.position, // THREE.Vector3 in meters
  opponentPosition // THREE.Vector3 in meters
);
```

## Recommendation

**Option 1** is recommended because:
- ✅ Minimal changes to existing combat code
- ✅ Maintains backward compatibility
- ✅ Clear separation: positions in pixels, calculations in meters
- ✅ Easy to test and validate

## Testing Requirements

1. **Unit Tests**
   - Test distance calculation with different arena scales
   - Verify technique range checks with scaled positions
   - Test hit detection at various distances and scales

2. **Integration Tests**
   - Verify AI technique selection at different distances
   - Test hit detection accuracy across scales
   - Validate animation hit windows align with actual hits

3. **Visual Tests**
   - Verify kicks hit when animation shows contact
   - Check distance indicators show correct ranges
   - Validate "in range" feedback is accurate

## Priority

🔴 **HIGH PRIORITY** - This affects core gameplay mechanics:
- Hit detection accuracy
- Combat feel and responsiveness
- Player frustration with "phantom misses"
- AI behavior consistency

## Next Steps

1. ✅ Create this analysis document
2. ⏳ Implement scale-aware distance calculations
3. ⏳ Add tests for distance calculations with scaling
4. ⏳ Update combat system to use correct distances
5. ⏳ Validate with visual testing
6. ⏳ Document the fix in PR

---

**Status**: Analysis Complete - Ready for Implementation
**Estimated Effort**: 2-3 hours
**Risk**: Medium (affects core combat mechanics)
