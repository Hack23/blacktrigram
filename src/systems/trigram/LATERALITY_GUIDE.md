# Stance Laterality System Guide

## Overview

The Stance Laterality System extends Black Trigram's eight trigram stances (팔괘) with authentic Korean martial arts left/right differentiation, creating 16 distinct stance configurations.

**Korean Terms:**
- **왼발서기 (Oenbal Seogi)**: Left stance - left foot forward, left guard high
- **오른발서기 (Oreun Bal Seogi)**: Right stance - right foot forward, right guard high
- **측면성 (Cheungmyeonseong)**: Laterality

## Architecture

### Type System

```typescript
// Core types
export type StanceLaterality = "left" | "right";
export type StanceWithSide = `${TrigramStance}_${StanceLaterality}`;

// Example values
"geon_left"   // Heaven stance, left foot forward
"tae_right"   // Lake stance, right foot forward
```

### Stance Configurations

**Total Stances**: 16 (8 trigrams × 2 laterality)

| Trigram | Korean | Left Stance | Right Stance |
|---------|--------|-------------|--------------|
| ☰ 건 (Geon) | Heaven | `geon_left` | `geon_right` |
| ☱ 태 (Tae) | Lake | `tae_left` | `tae_right` |
| ☲ 리 (Li) | Fire | `li_left` | `li_right` |
| ☳ 진 (Jin) | Thunder | `jin_left` | `jin_right` |
| ☴ 손 (Son) | Wind | `son_left` | `son_right` |
| ☵ 감 (Gam) | Water | `gam_left` | `gam_right` |
| ☶ 간 (Gan) | Mountain | `gan_left` | `gan_right` |
| ☷ 곤 (Gon) | Earth | `gon_left` | `gon_right` |

## Usage Examples

### StanceManager

```typescript
import { StanceManager } from "./StanceManager";

const manager = new StanceManager();

// Get current laterality (defaults to "right")
const laterality = manager.getCurrentLaterality(); // "right"

// Switch stance side (left ↔ right)
const result = manager.switchStanceSide(player);
// {
//   success: true,
//   laterality: "left",
//   cost: { ki: 0, stamina: 2, timeMilliseconds: 400 }
// }
```

### Guard Poses

```typescript
import { getGuardPoseForStance } from "./animation/StanceGuardPoses";

// Get right stance guard (default)
const rightGeon = getGuardPoseForStance("geon", "right");

// Get left stance guard (mirrored)
const leftGeon = getGuardPoseForStance("geon", "left");

// Get all 16 configurations
const allPoses = getAllStanceGuardPoses();
// Map with keys: "geon_left", "geon_right", "tae_left", etc.
```

### Utility Functions

```typescript
import { combineStanceWithSide, parseStanceWithSide } from "./types";

// Combine stance and laterality
const combined = combineStanceWithSide("geon", "left");
// "geon_left"

// Parse combined string
const parsed = parseStanceWithSide("geon_left");
// { stance: "geon", laterality: "left" }
```

### Mirror Guard Pose

```typescript
import { mirrorGuardPose } from "../types/skeletal";

// Mirror a guard pose from right to left
const rightPose = GEON_HIGH_GUARD_POSE;
const leftPose = mirrorGuardPose(rightPose);

// The function:
// - Swaps left ↔ right arm positions
// - Negates Y and Z rotations (lateral twist and roll)
// - Preserves X rotation (forward/back bend)
// - Maintains weight distribution and breathing
```

## Technical Specifications

### Transition Timing

- **Stance Side Switch**: 400ms (24 frames @ 60fps)
- **Trigram Stance Change**: 600ms (36 frames @ 60fps)
- **Cooldown**: 500ms between any stance changes

### Resource Costs

- **Stance Side Switch**: 2 stamina, 0 ki
- **Trigram Stance Change**: Varies by transition (10-30 ki, 15-45 stamina)

### Weight Distribution

Both left and right stances maintain 60% weight on the forward leg for authentic Korean martial arts positioning.

## Korean Martial Arts Context

### Traditional Application

In authentic Korean martial arts (태권도, 합기도, 택견):

1. **왼발서기 (Left Stance)**:
   - Left foot forward
   - Left hand as lead guard
   - Right hand chambered for power strikes
   - Used for: Defensive positioning, counter-striking

2. **오른발서기 (Right Stance)**:
   - Right foot forward
   - Right hand as lead guard
   - Left hand chambered for power strikes
   - Used for: Offensive positioning, direct attacks

### Tactical Considerations

**Stance Matching**: Same stance (left vs left) creates open lines for body attacks
**Stance Mismatching**: Opposite stances (left vs right) creates closed centerline

## Performance Optimization

### Caching

The `getAllStanceGuardPoses()` function caches its result:

```typescript
// First call: generates all 16 poses
const poses1 = getAllStanceGuardPoses(); // Computes

// Subsequent calls: returns cached result
const poses2 = getAllStanceGuardPoses(); // Cached (same Map instance)
```

### Mirroring

Guard pose mirroring is computed on-demand:
- Right laterality: Returns base pose (no computation)
- Left laterality: Computes mirrored pose (lightweight operation)

## Testing

### Test Coverage

- **StanceManager**: 23 tests (10 laterality-specific)
- **Mirror Function**: 4 tests
- **Guard Poses**: 104 tests (7 laterality tests)
- **Utility Functions**: 10 tests
- **Total**: 141 tests covering laterality system

### Running Tests

```bash
# Test StanceManager with laterality
npm test -- StanceManager

# Test guard pose mirroring
npm test -- skeletal.mirrorGuardPose

# Test utility functions
npm test -- types.test

# Test guard poses with laterality
npm test -- StanceGuardPoses
```

## Integration Points

### Animation System

- `AnimationStateMachine`: `stance_side_switch` animation state
- `StanceGuardPoses`: Laterality-aware pose retrieval
- `AnimationPriority`: Side switch priority = stance change priority

### Combat System

- `TrigramSystem`: Tracks current stance and laterality
- `CombatCalculator`: Considers laterality in effectiveness calculations
- `PlayerState`: Stores laterality as part of combat state

### UI/HUD (Future)

- Stance indicator displays: "☰ 건 L" or "☰ 건 R"
- Korean text: "왼발서기" or "오른발서기"
- Visual guard position feedback

## Best Practices

### Do ✅

```typescript
// Use default laterality when not specified
const pose = getGuardPoseForStance("geon"); // Right by default

// Check success before using result
const result = manager.switchStanceSide(player);
if (result.success) {
  player = result.updatedPlayer;
}

// Use utility functions for string manipulation
const combined = combineStanceWithSide(stance, laterality);
```

### Don't ❌

```typescript
// Don't manually construct stance strings
const bad = `${stance}_${laterality}`; // Use combineStanceWithSide()

// Don't ignore cooldowns
// Always check result.success

// Don't assume laterality without checking
// Use manager.getCurrentLaterality()
```

## Future Enhancements

- [ ] UI indicators showing current stance side
- [ ] Q key binding for stance side switching
- [ ] Combat advantage calculations for stance matching/mismatching
- [ ] Visual weight distribution feedback (60% forward leg)
- [ ] Skeletal rig integration for 3D rendering
- [ ] Training mode for practicing stance side transitions

## References

- **COMBAT_ARCHITECTURE.md**: Trigram system architecture
- **game-design.md**: Combat mechanics and specifications
- **Korean Martial Arts**: Traditional stance conventions
  - Taekwondo (태권도): Modern sport martial art
  - Hapkido (합기도): Joint locks and pressure points
  - Taekyon (택견): Traditional Korean martial art

## Related Files

- `src/systems/trigram/types.ts` - Type definitions
- `src/systems/trigram/StanceManager.ts` - Stance management
- `src/types/skeletal.ts` - Mirror function
- `src/systems/animation/StanceGuardPoses.ts` - Guard poses
- `src/systems/animation/AnimationStateMachine.ts` - Animation states

---

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*
