# ReachConfig Analysis: baseExtension vs maxReachMultiplier

## 🔍 Issue Identified

The `reachConfig.baseExtension` field in technique definitions is **NOT being used** by `PhysicalReachCalculator`. Instead, the calculator uses `maxReachMultiplier` from `AnimationHitTiming`, causing a mismatch between intended and actual ranges.

## 📊 Current State

### Technique Definition (GeonTechniques.ts)
```typescript
{
  id: "geon_frontal_kick",
  name: { korean: "앞차기", english: "Front Kick" },
  reachConfig: {
    bodyPart: "leg",
    techniqueType: "kick",
    baseExtension: 1.05,  // ❌ NOT USED
  },
  animationType: AnimationType.FRONT_KICK,
  // ...
}
```

### Animation Hit Timing (AnimationHitTiming.ts)
```typescript
[AnimationType.FRONT_KICK]: {
  animationType: AnimationType.FRONT_KICK,
  hitWindow: {
    startTime: 0.15,
    peakTime: 0.27,
    endTime: 0.4,
    maxReachMultiplier: 1.0,  // ✅ ACTUALLY USED (not 1.05!)
  },
}
```

### PhysicalReachCalculator.calculateReach()
```typescript
// Line 179-182: Uses animation timing, not reachConfig
const animationReachMultiplier = getCurrentReachMultiplier(
  animationType,
  animationTime,
);

// Line 224-227: Formula does not include baseExtension
const effectiveReach =
  (baseLimbLengthMeters + bodyPivotContribution) *
  animationReachMultiplier *  // ❌ Uses maxReachMultiplier (1.0)
  stanceModifier;
```

## 🎯 Impact on Front Kick

### Expected Behavior (with baseExtension: 1.05)
```
Musa front kick reach:
- Leg length: 0.95m
- Body pivot: 0.25m
- Base extension: 1.05 (from reachConfig)
- Stance modifier: 1.0 (GEON)
- Expected reach: (0.95 + 0.25) × 1.05 × 1.0 = 1.26m
```

### Actual Behavior (with maxReachMultiplier: 1.0)
```
Musa front kick reach:
- Leg length: 0.95m
- Body pivot: 0.25m
- Animation multiplier: 1.0 (from AnimationHitTiming)
- Stance modifier: 1.0 (GEON)
- Actual reach: (0.95 + 0.25) × 1.0 × 1.0 = 1.20m
```

**Difference**: 0.06m (6cm) shorter than intended!

## 📈 All Techniques Affected

### Comparison Table

| Technique Type | reachConfig.baseExtension | maxReachMultiplier | Discrepancy |
|---------------|---------------------------|-------------------|-------------|
| Punches | 0.90-0.95 | 0.9-1.0 | Close match ✅ |
| Kicks | 1.00-1.05 | 1.0-1.05 | 0-0.05 mismatch ⚠️ |
| Elbows | 0.50-0.60 | 0.5-0.6 | Close match ✅ |
| Grapples | 0.70-0.90 | N/A | Not animation-based ⚠️ |

### Specific Technique Analysis

**Kicks with Mismatch:**
```typescript
// geon_frontal_kick
reachConfig.baseExtension: 1.05
maxReachMultiplier: 1.0
Discrepancy: -5%

// geon_roundhouse_kick
reachConfig.baseExtension: 1.05
maxReachMultiplier: 1.05
Discrepancy: 0% ✅ (matches!)

// jin_jumping_front_kick
reachConfig.baseExtension: 1.15
maxReachMultiplier: 1.1
Discrepancy: -5%
```

## 🔧 Root Cause

The system has **two sources of truth** for reach multipliers:

1. **Technique definitions** (`reachConfig.baseExtension`) - Designer intent
2. **Animation timing** (`maxReachMultiplier`) - Animation system

The PhysicalReachCalculator **only uses #2**, making #1 irrelevant.

## 💡 Solutions

### Option 1: Use baseExtension (Recommended)
Update `PhysicalReachCalculator` to use `reachConfig.baseExtension`:

```typescript
calculateReach(
  physicalAttributes: PhysicalAttributes,
  animationType: AnimationType,
  animationTime: number,
  stance: TrigramStance,
  reachConfig?: PhysicalReachConfig,  // Add parameter
): PhysicalReachResult {
  // ... existing code ...
  
  // Use baseExtension if provided, otherwise use animation multiplier
  const extensionMultiplier = reachConfig?.baseExtension ?? 
                               animationReachMultiplier;
  
  const effectiveReach =
    (baseLimbLengthMeters + bodyPivotContribution) *
    extensionMultiplier *
    stanceModifier;
  
  // ...
}
```

**Pros:**
- Respects designer intent
- Single source of truth
- Easier to balance techniques

**Cons:**
- Need to pass reachConfig through call chain
- Need to update all call sites

### Option 2: Sync Values (Quick Fix)
Update all `maxReachMultiplier` values to match `baseExtension`:

```typescript
// For each technique with mismatch:
[AnimationType.FRONT_KICK]: {
  hitWindow: {
    // ...
    maxReachMultiplier: 1.05,  // Changed from 1.0 to match baseExtension
  },
}
```

**Pros:**
- No code changes needed
- Quick fix
- Maintains existing architecture

**Cons:**
- Two sources of truth remain
- Future inconsistencies likely
- Manual syncing required

### Option 3: Remove baseExtension
Remove `baseExtension` from technique definitions and only use `maxReachMultiplier`:

**Pros:**
- Single source of truth
- Animation-driven (consistent with system design)

**Cons:**
- Loses designer flexibility
- Harder to balance per technique
- Breaking change to technique definitions

## 🎯 Recommendation

**Use Option 1** (Use baseExtension):
1. Update `PhysicalReachCalculator` to accept and use `reachConfig`
2. Pass `reachConfig` through the call chain
3. Keep `maxReachMultiplier` as fallback for techniques without reachConfig
4. Update tests to verify baseExtension is used correctly

This provides the best long-term solution and respects the original design intent.

## 📝 Next Steps

1. **Decision**: Choose which option to implement
2. **Update**: Modify PhysicalReachCalculator or AnimationHitTiming
3. **Test**: Verify all 51 techniques have correct ranges
4. **Document**: Update COMBAT_ARCHITECTURE.md with chosen approach
5. **Validate**: Run full test suite and in-game testing

## 🔗 Related Files

- `src/systems/physics/PhysicalReachCalculator.ts` - Reach calculation
- `src/systems/animation/core/AnimationHitTiming.ts` - Animation multipliers
- `src/systems/trigram/techniques/*.ts` - Technique definitions
- `src/types/physics.ts` - PhysicalReachConfig type
