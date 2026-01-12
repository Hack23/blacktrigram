# Animation-Based Hit Detection Integration Guide

## Overview

This guide explains how to integrate the `AnimationHitTiming` and `PhysicalReachCalculator` systems into the combat hit detection logic to make hits only register when animations visually connect with the target.

## Problem Statement

Currently, hit detection uses fixed `range` values in techniques without considering:
- Actual animation visual reach (limb extension in 3D space)
- Physical attributes from archetypes (arm/leg length differences)
- Animation timing (hits should only register during extension phase)
- Movement scale in combat/training screens

## Solution Architecture

### 1. Animation Timing Context

Combat needs to track the current animation time to determine if a hit is possible:

```typescript
// In PlayerState or combat tracking
interface AnimationContext {
  currentAnimation: AnimationType;
  animationStartTime: number;  // Timestamp when animation began
  animationProgress: number;    // 0.0 - 1.0 progress through animation
}
```

### 2. Modified Hit Detection Flow

```
┌─────────────────────┐
│ Player Attacks      │
│ (Technique Execute) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Get Animation for Technique         │
│ - AnimationType from technique      │
│ - Start animation timestamp         │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Update Animation Progress (useFrame)│
│ - Calculate elapsed time            │
│ - Track animation phase             │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Check Hit Window                    │
│ - isWithinHitWindow(anim, time)     │
│ - If false, no hit possible         │
└──────────┬──────────────────────────┘
           │ Hit window active
           ▼
┌─────────────────────────────────────┐
│ Calculate Physical Reach            │
│ - Get attacker physical attributes  │
│ - PhysicalReachCalculator.          │
│   calculateReach(attrs, anim,       │
│   currentTime, stance)              │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Distance Check                      │
│ - Calculate 3D distance to defender │
│ - Compare to effectiveReach         │
│ - If distance > reach, MISS         │
└──────────┬──────────────────────────┘
           │ Within reach
           ▼
┌─────────────────────────────────────┐
│ Collision Detection                 │
│ - Existing vital point hit logic    │
│ - Returns hit result                │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────┐
│ Apply Damage        │
└─────────────────────┘
```

## Implementation Steps

### Step 1: Add Animation Context to Combat Flow

**Location**: `src/components/screens/combat/hooks/useCombatActions.ts`

```typescript
// Add animation timing tracking
const attackAnimations = useRef<Map<number, {
  animationType: AnimationType;
  startTime: number;
  duration: number;
}>>(new Map());

// When technique is executed
const handleTechniqueExecute = useCallback((
  playerIndex: number,
  technique: KoreanTechnique,
  targetVitalPointId?: string
) => {
  const attacker = validPlayers[playerIndex];
  
  // Get animation for technique
  const animationType = technique.animationType || AnimationType.JAB;
  const animationConfig = getAnimationForTechnique(technique);
  
  // Track animation start
  attackAnimations.current.set(playerIndex, {
    animationType,
    startTime: performance.now(),
    duration: animationConfig?.duration || 0.5,
  });
  
  // ... rest of existing logic
}, [validPlayers]);
```

### Step 2: Check Hit Window in useFrame Loop

**Location**: `src/components/screens/combat/CombatScreen3D.tsx` (or equivalent)

```typescript
useFrame((state, delta) => {
  // For each active attack animation
  attackAnimations.current.forEach((anim, playerIndex) => {
    const elapsed = (performance.now() - anim.startTime) / 1000; // Convert to seconds
    
    // Check if within hit window
    if (isWithinHitWindow(anim.animationType, elapsed)) {
      // Check if hit should be registered
      checkAnimationHit(playerIndex, anim.animationType, elapsed);
    }
    
    // Remove completed animations
    if (elapsed > anim.duration) {
      attackAnimations.current.delete(playerIndex);
    }
  });
});
```

### Step 3: Animation-Aware Hit Detection

**Location**: New method in `useCombatActions` or `CombatSystem`

```typescript
function checkAnimationHit(
  attackerIndex: number,
  animationType: AnimationType,
  animationTime: number
): void {
  const attacker = validPlayers[attackerIndex];
  const defender = validPlayers[1 - attackerIndex]; // Opponent
  
  // Get physical attributes for attacker's archetype
  const attackerPhysical = getArchetypePhysicalAttributes(attacker.archetype);
  
  // Calculate current effective reach
  const reachResult = physicalReachCalculator.calculateReach(
    attackerPhysical,
    animationType,
    animationTime,
    attacker.currentStance
  );
  
  // Check if can hit at this moment
  if (!reachResult.canHit) {
    return; // Not in hit window
  }
  
  // Calculate 3D distance
  const attackerPos = playerPositions[attackerIndex];
  const defenderPos = playerPositions[1 - attackerIndex];
  const distance = Math.sqrt(
    Math.pow(defenderPos.x - attackerPos.x, 2) +
    Math.pow(defenderPos.y - attackerPos.y, 2)
  );
  
  // Check if within effective reach
  if (distance > reachResult.effectiveReach) {
    // OUT OF RANGE - no hit
    return;
  }
  
  // Within reach! Proceed with hit detection
  // Use existing collision detection for vital points
  const result = collisionDetection.checkAttackHit(
    { x: attackerPos.x, y: 0, z: attackerPos.y }, // Convert 2D to 3D
    { x: defenderPos.x, y: 0, z: defenderPos.y },
    { type: getTechniqueType(animationType) },
    attacker.currentStance,
    getTargetRegion(defender) // Could be user-selected or auto
  );
  
  if (result.hit) {
    // Process the hit with existing combat system
    processCombatHit(attackerIndex, result);
  }
}
```

### Step 4: Helper Functions

```typescript
/**
 * Convert AnimationType to TechniqueType for collision detection
 */
function getTechniqueType(animationType: AnimationType): string {
  if (animationType.includes('kick')) return 'kick';
  if (animationType.includes('elbow')) return 'elbow';
  if (animationType.includes('knee')) return 'knee';
  if (animationType.includes('nerve') || 
      animationType.includes('pressure')) return 'pressure_point';
  return 'punch'; // Default
}

/**
 * Determine target anatomical region
 * Could be user-selected via UI or auto-determined
 */
function getTargetRegion(defender: PlayerState): AnatomicalRegionPhysics {
  // For now, default based on defender height
  // In final implementation, this should come from:
  // 1. User selection (vital point overlay)
  // 2. AI decision (intelligent targeting)
  // 3. Auto-aim based on attack type
  return "torso"; // Default target
}
```

### Step 5: Update CombatSystem.resolveAttack

**Location**: `src/systems/CombatSystem.ts`

Add animation context parameter:

```typescript
resolveAttack(
  attacker: PlayerState,
  defender: PlayerState,
  technique: KoreanTechnique,
  targetedVitalPointId?: string,
  animationContext?: {  // NEW PARAMETER
    animationType: AnimationType;
    currentTime: number;
  }
): CombatResult {
  // If animation context provided, validate hit timing
  if (animationContext) {
    const { animationType, currentTime } = animationContext;
    
    // Check if within hit window
    if (!isWithinHitWindow(animationType, currentTime)) {
      return this.createMissResult(attacker, defender, technique, 'outside_hit_window');
    }
    
    // Calculate effective reach
    const attackerPhysical = getArchetypePhysicalAttributes(attacker.archetype);
    const reachResult = physicalReachCalculator.calculateReach(
      attackerPhysical,
      animationType,
      currentTime,
      attacker.currentStance
    );
    
    // Check distance
    const distance = this.calculateDistance(attacker.position, defender.position);
    if (distance > reachResult.effectiveReach) {
      return this.createMissResult(attacker, defender, technique, 'out_of_reach');
    }
  }
  
  // Proceed with existing hit logic
  // ... (rest of existing code)
}
```

## Testing Scenarios

### Test 1: Archetype Reach Differences

```typescript
// Test that different archetypes have different reaches
test('Amsalja (long arms) reaches farther than Hacker (short arms)', () => {
  const amsaljaReach = physicalReachCalculator.calculateMaxReach(
    AMSALJA_PHYSICAL,
    AnimationType.JAB,
    TrigramStance.LI
  );
  
  const hackerReach = physicalReachCalculator.calculateMaxReach(
    HACKER_PHYSICAL,
    AnimationType.JAB,
    TrigramStance.LI
  );
  
  expect(amsaljaReach).toBeGreaterThan(hackerReach);
  // Amsalja: 82cm arms vs Hacker: 73cm arms = ~10cm difference
  expect(amsaljaReach - hackerReach).toBeCloseTo(0.10, 1);
});
```

### Test 2: Hit Window Timing

```typescript
test('Hits only register during extension phase', () => {
  const jabTiming = getAnimationHitTiming(AnimationType.JAB);
  
  // Before hit window (chamber phase)
  expect(isWithinHitWindow(AnimationType.JAB, 0.05)).toBe(false);
  
  // During hit window (extension phase)
  expect(isWithinHitWindow(AnimationType.JAB, 0.15)).toBe(true);
  
  // After hit window (retraction phase)
  expect(isWithinHitWindow(AnimationType.JAB, 0.30)).toBe(false);
});
```

### Test 3: Animation Progress Reach

```typescript
test('Reach increases during extension, peaks, then decreases', () => {
  const calc = new PhysicalReachCalculator();
  
  // At start (chamber) - minimal reach
  const reachStart = calc.calculateReach(
    MUSA_PHYSICAL,
    AnimationType.CROSS,
    0.10,
    TrigramStance.GEON
  );
  expect(reachStart.effectiveReach).toBeLessThan(0.5);
  
  // At peak - maximum reach
  const reachPeak = calc.calculateReach(
    MUSA_PHYSICAL,
    AnimationType.CROSS,
    0.25,
    TrigramStance.GEON
  );
  expect(reachPeak.effectiveReach).toBeGreaterThan(reachStart.effectiveReach);
  
  // During retraction - decreasing reach
  const reachEnd = calc.calculateReach(
    MUSA_PHYSICAL,
    AnimationType.CROSS,
    0.35,
    TrigramStance.GEON
  );
  expect(reachEnd.effectiveReach).toBeLessThan(reachPeak.effectiveReach);
});
```

## Visual Validation

### Training Screen Validation

The Training Screen (TrainingScreen3D.tsx) is ideal for validating this system visually:

1. **Display Reach Circles**:
   - Show current effective reach as a circle around player
   - Update circle size in real-time during animations
   - Color-code: Green (can hit), Red (out of reach)

2. **Hit Window Indicator**:
   - Visual timeline showing hit window phases
   - Chamber (yellow) → Extension (green) → Retraction (orange)
   - Current position marker on timeline

3. **Distance Display**:
   - Show actual distance to target dummy
   - Show required reach for current animation time
   - Clear visual feedback when hit connects

## Performance Considerations

### Optimization 1: Limit Checks

Only check hit detection during active attack animations:

```typescript
if (attackAnimations.current.size === 0) {
  return; // No active attacks, skip checks
}
```

### Optimization 2: Cache Calculations

```typescript
// Cache physical attributes per archetype
const archetypeReachCache = new Map<PlayerArchetype, PhysicalAttributes>();

function getCachedPhysicalAttributes(archetype: PlayerArchetype) {
  if (!archetypeReachCache.has(archetype)) {
    archetypeReachCache.set(
      archetype,
      getArchetypePhysicalAttributes(archetype)
    );
  }
  return archetypeReachCache.get(archetype)!;
}
```

### Optimization 3: Distance Culling

```typescript
// Quick distance check before expensive calculations
const maxPossibleReach = 2.0; // meters, maximum any technique can reach
const quickDistance = Math.abs(attackerPos.x - defenderPos.x) + 
                      Math.abs(attackerPos.y - defenderPos.y);

if (quickDistance > maxPossibleReach) {
  return; // Definitely out of range, skip calculations
}
```

## Migration Strategy

### Phase 1: Parallel System (Current State)
- New systems implemented but not integrated
- Existing combat continues to work
- Can test new systems in isolation

### Phase 2: Opt-In Integration
- Add feature flag: `USE_ANIMATION_HIT_DETECTION`
- Training Screen uses new system (non-competitive)
- Combat Screen uses old system (stable)

### Phase 3: Gradual Rollout
- Enable in Combat Screen with fallback
- Monitor for issues
- Collect user feedback

### Phase 4: Full Migration
- Remove old distance-only checks
- Make animation timing mandatory
- Update all technique definitions

## Success Criteria

✅ **Visual Authenticity**
- Hits only register when limb visually contacts target
- No "phantom hits" before extension
- No hits after retraction begins

✅ **Physical Reality**
- Jojik (long arms/legs) reaches 10-15% farther than Hacker
- Kicks reach ~40% farther than punches for same archetype
- Elbow strikes limited to very close range (<0.5m)

✅ **Animation Accuracy**
- Fast techniques (jab) have tight timing windows (100-250ms)
- Heavy techniques (axe kick) have longer windows (250-650ms)
- Spinning techniques require full rotation before contact

✅ **Performance**
- Maintains 60fps with 2 active animations
- Hit checks complete in <1ms
- No noticeable lag during combat

## Next Steps

1. **Implement Step 1-2**: Add animation context tracking
2. **Create Test Environment**: Use Training Screen for validation
3. **Visual Debugging**: Add reach circles and timing indicators
4. **Unit Tests**: Verify calculations match expectations
5. **Integration Testing**: Full combat scenarios
6. **Performance Profiling**: Ensure 60fps maintained
7. **User Testing**: Gather feedback on feel and accuracy

## References

- `src/systems/animation/AnimationHitTiming.ts` - Hit window definitions
- `src/systems/physics/PhysicalReachCalculator.ts` - Reach calculations
- `src/data/archetypePhysicalAttributes.ts` - Physical attribute data
- `src/systems/physics/CollisionDetection.ts` - Existing collision logic
- `src/types/physics.ts` - Physics type definitions
