# Recovery Animation Guide | 복귀 애니메이션 가이드

## Overview | 개요

This guide explains the realistic recovery animation system for Black Trigram, which prevents instant "snap-back" transitions after techniques by implementing proper Korean martial arts recovery principles.

본 가이드는 흑괘의 사실적인 복귀 애니메이션 시스템을 설명합니다. 이 시스템은 기술 후 즉각적인 "스냅백" 전환을 방지하고 한국 무술의 적절한 복귀 원리를 구현합니다.

## Korean Martial Arts Recovery Principles | 한국 무술 복귀 원리

### 복귀 (Bokgwi) - Return to Stance

Korean martial arts emphasize controlled, deliberate recovery after techniques:

한국 무술은 기술 후 통제된 의도적인 복귀를 강조합니다:

- **균형회복 (Gyunhyeong Hoebog)** - Balance restoration through intermediate positions
- **자세복귀 (Jase Bokgwi)** - Stance return with gradual deceleration
- **호흡조절 (Hoheup Jojoel)** - Breath control during recovery phase
- **근육이완 (Geunryuk Ihwan)** - Muscle relaxation after peak tension

## Implementation | 구현

### Using the Recovery System

The recovery system is automatically applied when using `MartialArtsAnimationBuilder`:

```typescript
import { MartialArtsAnimationBuilder, TECHNIQUE_TIMING } from './MartialArtsAnimationBuilder';

// Create technique with recovery
const frontKick = MartialArtsAnimationBuilder
  .create("front_kick", "앞차기")
  .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
  .stance()        // Initial stance (t=0)
  .chamber(0.12)   // Knee lifts (120ms)
  .extend(0.18)    // Leg extends (180ms)
  .retract(0.10)   // Return through chamber (100ms)
  .recover(0.22)   // Recovery phase (220ms) - NEW!
  .build();
```

### Recovery Phase Structure

The `recover()` method now creates **two keyframes** instead of one:

```typescript
// Intermediate Recovery (60% through recovery duration)
// - 80% back to neutral stance
// - Muscle tension releases significantly (60% reduction)
// - Breathing synchronization active

// Final Recovery (100% of recovery duration)
// - Complete return to fighting guard
// - Muscle tension at relaxed state (10% base)
// - Ready for next technique
```

### Custom Recovery Configuration

For advanced control, pass a configuration object:

```typescript
import { createTechniqueRecovery } from './TechniqueRecoveryPhases';

// Standard recovery (200ms)
.recover()

// Custom duration (250ms)
.recover(0.25)

// Advanced: Custom intermediate progress
.recover(0.22, { 
  intermediateProgress: 0.75  // 75% back to neutral
})

// Use technique-specific recovery
const kickRecovery = createTechniqueRecovery("kick");
.recover(kickRecovery.duration, kickRecovery)
```

## Recovery Timings by Technique Type

Different techniques require different recovery durations:

| Technique Type | Duration | Intermediate Progress | Rationale |
|----------------|----------|----------------------|-----------|
| **발차기 (Kick)** | 220ms | 75% | Longer for balance restoration |
| **주먹 (Punch)** | 180ms | 85% | Faster recovery, arms retract quickly |
| **던지기 (Throw)** | 280ms | 70% | Extended for body repositioning |
| **회전 (Spin)** | 280ms | 70% | Longest to stop rotational momentum |

```typescript
import { createTechniqueRecovery } from './TechniqueRecoveryPhases';

// Create kick with kick-specific recovery (220ms)
const roundhouseKick = builder
  .roundhouseExtend(0.20)
  .recover(createTechniqueRecovery("kick").duration);

// Create punch with punch-specific recovery (180ms)
const cross = builder
  .punchExtend(0.20, "right")
  .recover(createTechniqueRecovery("punch").duration);
```

## Key Features

### 1. Gradual Deceleration (점진적 감속)

Recovery uses **ease-out interpolation** for natural deceleration:

```typescript
// Old behavior: Instant return to guard (jarring)
position: peakPosition → guardPosition (instant)

// New behavior: Gradual deceleration through intermediate
position: peakPosition → intermediatePosition (60% duration, ease-out)
       → guardPosition (40% duration, ease-out)
```

### 2. Muscle Tension Release (근육 긴장 이완)

Muscles gradually relax using a **quadratic ease-out curve**:

```typescript
// Tension release progression
At peak: 100% tension (maximum exertion)
At 50% recovery: ~25% tension (75% released)
At 80% recovery: ~10% tension (90% released) 
At completion: 10% tension (relaxed, but alert)
```

### 3. Intermediate Positions (중간 자세)

Recovery passes through transitional positions, not direct returns:

```typescript
// Path of returning limb
Peak position (1.7 rad hip flexion)
  ↓ (80% back to neutral, ease-out)
Intermediate position (0.34 rad hip flexion)
  ↓ (final 20%, ease-out)
Neutral position (0 rad hip flexion)
```

### 4. Breathing Synchronization (호흡 동기화)

Subtle breathing movement during recovery (optional):

```typescript
// Enable breathing (default: true)
.recover(0.22, { includeBreathing: true })

// Disable breathing
.recover(0.22, { includeBreathing: false })
```

## Validation

Use `validateRecoveryPhase()` to ensure animations meet standards:

```typescript
import { validateRecoveryPhase } from './TechniqueRecoveryPhases';

const animation = builder.build();
const validation = validateRecoveryPhase(animation);

if (!validation.valid) {
  console.warn("Recovery phase issues:", validation.issues);
  // Issues: ["Recovery duration 100ms is outside recommended range (150-250ms)"]
}
```

### Recovery Standards

- **Duration**: 150-250ms (Korean martial arts timing)
- **Easing**: ease-out or natural-motion (gradual deceleration)
- **Intermediate positions**: Must exist (no direct snap-back)
- **Muscle tension**: Must release during recovery

## Performance Considerations

Recovery animations are optimized for **60fps gameplay**:

- Minimal additional keyframes (2 per recovery)
- Efficient muscle tension calculations
- No runtime allocations during animation playback
- Compatible with existing animation system

## Testing

Test your recovery animations:

```typescript
import { describe, it, expect } from 'vitest';

describe("Custom Technique", () => {
  it("should have proper recovery phase", () => {
    const animation = createMyTechnique();
    
    // Check duration
    const recoveryDuration = animation.duration - baseAnimation.duration;
    expect(recoveryDuration).toBeGreaterThan(0.15);
    expect(recoveryDuration).toBeLessThan(0.25);
    
    // Check intermediate positions
    const intermediate = animation.keyframes[animation.keyframes.length - 2];
    expect(intermediate.easing).toBe("ease-out");
    expect(intermediate.boneRotations.size).toBeGreaterThan(0);
  });
});
```

## Examples

### Example 1: Front Kick with Recovery

```typescript
export const FRONT_KICK_WITH_RECOVERY: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("front_kick", "앞차기")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .stance()                    // t=0ms: Initial stance
    .chamber(0.12)               // t=120ms: Knee lifts
    .extend(0.18)                // t=300ms: Leg extends (peak)
    .retract(0.10)               // t=400ms: Return to chamber
    .recover(0.22)               // t=620ms: Recovery phase
                                 //   → t=532ms: Intermediate (80% back)
                                 //   → t=620ms: Final guard position
    .build();

// Result: 700ms total duration (500ms technique + 200ms recovery)
// Smooth transition without instant snap-back
```

### Example 2: Custom Recovery Configuration

```typescript
import { addRecoveryPhase } from './TechniqueRecoveryPhases';

// Create base technique (without recovery)
const baseTechnique = builder
  .stance()
  .chamber(0.12)
  .extend(0.18)
  .retract(0.10)
  .build();

// Apply custom recovery phase
const withCustomRecovery = addRecoveryPhase(baseTechnique, {
  duration: 0.25,              // 250ms recovery
  intermediateProgress: 0.7,   // 70% back at intermediate
  intermediateTimeRatio: 0.5,  // Intermediate at 50% of duration
  easing: "controlled-slow",   // Controlled deceleration
  includeBreathing: true,      // Enable breathing sync
});
```

## Migration Guide

### Upgrading Existing Animations

Old animations using simple `recover()` will automatically benefit from the new system:

```typescript
// Old code (still works, but now uses new recovery system)
.recover(0.2);  // Now creates 2 keyframes with intermediate position

// Explicitly using old behavior (not recommended)
// Use a single addKeyframe call instead of recover()
```

### Gradual Migration

1. **Test existing animations**: They should work without changes
2. **Adjust recovery durations**: May need slight tuning for new timing
3. **Update tests**: Recovery keyframes now include intermediate positions
4. **Verify visual quality**: Check for smooth deceleration

## Troubleshooting

### Issue: Animation feels too slow

**Solution**: Reduce recovery duration

```typescript
.recover(0.15)  // Minimum recommended duration
```

### Issue: Recovery doesn't pass through expected position

**Solution**: Adjust intermediate progress

```typescript
.recover(0.22, { intermediateProgress: 0.9 })  // Closer to neutral
```

### Issue: Multiple recovery phases compound

**Solution**: Only call `recover()` once per technique

```typescript
// ❌ BAD: Multiple recoveries
.retract(0.1)
.recover(0.1)
.recover(0.1)  // Double recovery!

// ✅ GOOD: Single recovery
.retract(0.1)
.recover(0.2)
```

## API Reference

See `TechniqueRecoveryPhases.ts` for complete API documentation:

- `addRecoveryPhase()` - Add recovery to animation
- `createTechniqueRecovery()` - Get technique-specific config
- `validateRecoveryPhase()` - Validate recovery standards
- `calculateRecoveryTension()` - Compute muscle tension
- `getMuscleTensionState()` - Extract tension by body region

## References

- **Korean Martial Arts Recovery**: Traditional 낙법 (Nakbeop) techniques
- **Animation Principles**: Disney's 12 Principles (Ease-In/Ease-Out)
- **Biomechanics**: Natural muscle relaxation curves

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
