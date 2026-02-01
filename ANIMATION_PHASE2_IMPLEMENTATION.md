# Animation Quality Phase 2 Implementation
## Power Generation in Techniques

**Date**: February 1, 2025  
**Focus**: Issues #3, #4, #5 from ANIMATION_QUALITY_ANALYSIS.md  
**Target Files**: KickAnimations.ts, PunchAnimations.ts, AttackAnimations.ts

---

## Issue #3: Weight Transfer in Strikes (HIGH Priority)

### Problem
Punches lack hip drive and weight transfer, reducing power by 40-60%.

### Solution
Add to all punch animations:
1. **Hip drive**: Pelvis position moves forward +0.12m during extension
2. **Hip rotation**: 0.5 rad (28.6°) for cross punch, 0.2 rad (11.5°) for jab
3. **Weight shift**: Front knee flexion increases, rear leg extends

### Implementation
- **Cross punch** (CROSS_ANIMATION in PunchAnimations.ts): 
  - Uses helper methods that already have some rotation
  - Need to enhance with explicit pelvis position shift
- **Jab** (JAB_ANIMATION in AttackAnimations.ts):
  - Already has pelvis rotation (0.2 rad at line 67)
  - Need to add pelvis position shift forward

---

## Issue #4: Hip Rotation in Kicks (HIGH Priority)

### Problem
Kicks need more explosive hip rotation for power generation.

### Current State
The builder methods already have hip rotation:
- `roundhouseChamber`: pelvis rotates -0.79 rad (45°) at line 562
- `roundhouseExtend`: pelvis rotates -1.5 rad (86°) at line 608
- `sideKickChamber`: pelvis rotates -1.57 rad (90°) via helper
- `sideKickExtend`: pelvis rotates -1.57 rad (90°) at line 713

### Enhancement Needed
✅ **Hip rotation IS PRESENT** - but needs explosive timing:
1. Reduce chamber phase timing (make it faster)
2. Add "ease-explosive" easing for snap
3. Ensure torso follows through with hip rotation

### Kicks to Enhance
1. **Roundhouse Kick** (ROUNDHOUSE_KICK_ANIMATION)
2. **Front Kick** (FRONT_KICK_ANIMATION) - add forward hip drive
3. **Side Kick** (SIDE_KICK_ANIMATION) - verify lateral hip rotation
4. **Back Kick** (BACK_KICK_ANIMATION) - add full 180° hip rotation check

---

## Issue #5: Technique Timing (MEDIUM-HIGH Priority)

### Problem
Strike execution phase is too slow (440ms), making techniques look sluggish.

### Target Timing Formula
- **Chamber**: 40% of total duration (slow coil)
- **Strike**: 20% of total duration (EXPLOSIVE) ⚡
- **Recovery**: 40% of total duration (controlled)

### Current vs Target

| Technique | Current Strike | Target Strike | Reduction |
|-----------|---------------|---------------|-----------|
| Jab | 150ms | 110ms | -27% |
| Cross | 200ms | 146ms | -27% |
| Roundhouse | 200ms | 160ms | -20% |
| Front Kick | 180ms | 140ms | -22% |

### Implementation Strategy
Use existing TECHNIQUE_TIMING but adjust:
- Reduce `extend` phase by 20-30%
- Increase `chamber` phase slightly for better coil
- Add "ease-explosive" easing for strike phase

---

## Implementation Steps

### Step 1: Enhance Cross Punch (Issue #3)
**File**: `src/systems/animation/catalogs/PunchAnimations.ts`

```typescript
// BEFORE (line 101-112):
export const CROSS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("cross", "크로스")
    .asAttack(TECHNIQUE_TIMING.MEDIUM.total)
    .punchChamber(TECHNIQUE_TIMING.MEDIUM.chamber, "right")
    .withKoreanMiddleGuard("left")
    .punchExtend(TECHNIQUE_TIMING.MEDIUM.extend, "right")
    .withKoreanMiddleGuard("left")
    .punchPeak(TECHNIQUE_TIMING.MEDIUM.peak, "right")
    .withKoreanMiddleGuard("left")
    .recover(TECHNIQUE_TIMING.MEDIUM.retract + TECHNIQUE_TIMING.MEDIUM.recover)
    .withKoreanMiddleGuard()
    .build();

// AFTER (add explicit hip drive):
export const CROSS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("cross", "크로스")
    .asAttack(TECHNIQUE_TIMING.MEDIUM.total)
    .punchChamber(TECHNIQUE_TIMING.MEDIUM.chamber, "right")
    .withKoreanMiddleGuard("left")
    // Add explicit hip drive at extension
    .at(TECHNIQUE_TIMING.MEDIUM.chamber + TECHNIQUE_TIMING.MEDIUM.extend * 0.5)
    .position(BoneName.PELVIS, 0, 0, 0.06) // Forward drive starts
    .rotate(BoneName.PELVIS, 0, 0.25, 0) // Additional hip rotation
    .done<MartialArtsAnimationBuilder>()
    .punchExtend(TECHNIQUE_TIMING.MEDIUM.extend, "right")
    .withKoreanMiddleGuard("left")
    // Peak with full hip drive
    .at(TECHNIQUE_TIMING.MEDIUM.chamber + TECHNIQUE_TIMING.MEDIUM.extend)
    .position(BoneName.PELVIS, 0, 0, 0.12) // Full forward drive
    .rotate(BoneName.PELVIS, 0, 0.5, 0) // Full hip rotation (28.6°)
    .done<MartialArtsAnimationBuilder>()
    .punchPeak(TECHNIQUE_TIMING.MEDIUM.peak, "right")
    .withKoreanMiddleGuard("left")
    .recover(TECHNIQUE_TIMING.MEDIUM.retract + TECHNIQUE_TIMING.MEDIUM.recover)
    .withKoreanMiddleGuard()
    .build();
```

### Step 2: Add Hip Drive to Front Kick (Issue #4)
**File**: `src/systems/animation/catalogs/KickAnimations.ts`

Add forward hip thrust during extension phase at line 48.

### Step 3: Optimize Timing (Issue #5)
Create new EXPLOSIVE timing constants for Phase 2 techniques.

---

## Testing Strategy

1. **Visual Inspection**: Run game and observe technique animations
2. **Timing Validation**: Ensure strike phases are 20-30% faster
3. **Power Generation**: Verify hip rotation is visible and explosive
4. **Korean Authenticity**: Compare to Taekwondo reference videos

---

## Success Criteria

✅ All punches show visible hip drive forward  
✅ All kicks have explosive hip rotation  
✅ Strike phases are 20-30% faster than chamber/recovery  
✅ Techniques look powerful and martial arts-authentic  

**Expected Quality Gain**: 50% → 75% (+25%)

---

**Prepared by**: Game Developer Agent  
**Reference**: ANIMATION_QUALITY_ANALYSIS.md Issues #3, #4, #5
