# Animation System Improvement Plan (애니메이션 시스템 개선 계획)

**Created**: January 21, 2026  
**Status**: Analysis Complete - Ready for Implementation

## 📋 Executive Summary

This document outlines the comprehensive analysis and improvement plan for Black Trigram's animation system. The goal is to ensure all animations have proper frame counts (minimum 12 keyframes at 60fps), eliminate duplication, complete incomplete techniques, fix direction issues, and properly utilize the existing utility infrastructure.

---

## 🚨 Critical Issues Identified

### 1. Animation Duration Issues (Too Short)

**Target**: Minimum 550ms (TECHNIQUE_TIMING.FAST) = 33 frames @ 60fps

**Critical Offenders (< 350ms)**:

| Animation                     | File                    | Current Duration  | Target |
| ----------------------------- | ----------------------- | ----------------- | ------ |
| `SON_WIND_PALM_ANIMATION`     | StanceAnimations.ts:440 | 280ms (17 frames) | 550ms  |
| `JAB_ANIMATION`               | AttackAnimations.ts:36  | 300ms (18 frames) | 550ms  |
| `SON_PALM_ANIMATION`          | StanceAnimations.ts:404 | 300ms (18 frames) | 550ms  |
| `JIN_THUNDER_FLASH_ANIMATION` | StanceAnimations.ts:338 | 320ms (19 frames) | 550ms  |

**High Priority (350-400ms)**:

| Animation                          | File                      | Current Duration | Target |
| ---------------------------------- | ------------------------- | ---------------- | ------ |
| `GEON_HEAVENLY_FIST_ANIMATION`     | StanceAnimations.ts       | 350ms            | 550ms  |
| `CROSS_ANIMATION`                  | AttackAnimations.ts:94    | 350ms            | 550ms  |
| `ELBOW_STRIKE_ANIMATION`           | ElbowKneeAnimations.ts:35 | 350ms            | 550ms  |
| `ELBOW_UPPERCUT_ANIMATION`         | ElbowKneeAnimations.ts:55 | 350ms            | 550ms  |
| `DARKOPS_JUGULAR_STRIKE_ANIMATION` | DarkOpsAnimations.ts:48   | 350ms            | 550ms  |
| Multiple DarkOps animations        | DarkOpsAnimations.ts      | 300-380ms        | 550ms+ |

---

### 2. Duplicate/Shared Animations (Non-Unique Techniques)

**Critical: 9+ techniques sharing `AnimationType.JAB`**:

| Technique                          | Stance | Should Use                       |
| ---------------------------------- | ------ | -------------------------------- |
| `geon_heavenly_fist` (천권)        | Geon   | `GEON_HEAVENLY_FIST` (exists!)   |
| `li_pressure_point` (혈도공격)     | Li     | `LI_PRESSURE_POINT_STRIKE`       |
| `jin_lightning_flash` (벽력일섬)   | Jin    | `JIN_THUNDER_FLASH` (exists!)    |
| `son_whirlwind_barrage` (선풍연격) | Son    | `SON_WHIRLWIND_STRIKE` (exists!) |
| `son_rhythmic_strikes` (결련수)    | Son    | `SON_RHYTHMIC_STRIKES`           |

**4 Techniques sharing `AnimationType.BLOCK`**:

| Technique                         | Stance | Should Use                   |
| --------------------------------- | ------ | ---------------------------- |
| `gan_rock_defense` (반석방어)     | Gan    | `GAN_ROCK_DEFENSE` (exists!) |
| `gan_immovable_stance` (부동자세) | Gan    | `GAN_IMMOVABLE_GUARD`        |
| `gan_iron_block` (철벽막기)       | Gan    | `GAN_IRON_WALL_BLOCK`        |
| `gam_flowing_block` (유수막기)    | Gam    | `GAM_FLOWING_BLOCK`          |

---

### 3. Existing Animations NOT Mapped to Techniques

These stance-specific animations exist but aren't connected:

| Animation                        | File                        | Technique That Should Use It |
| -------------------------------- | --------------------------- | ---------------------------- |
| `JIN_THUNDER_FLASH_ANIMATION`    | StanceAnimations.ts         | `jin_lightning_flash`        |
| `JIN_JUMPING_KNEE_ANIMATION`     | JinTechniqueAnimations.ts   | `jin_jumping_knee`           |
| `SON_WHIRLWIND_STRIKE_ANIMATION` | SonStanceAnimations.ts      | `son_whirlwind_barrage`      |
| `GAN_ROCK_DEFENSE_ANIMATION`     | GanTechniqueAnimations.ts   | `gan_rock_defense`           |
| `GAM_WATER_COUNTER_ANIMATION`    | GamRedirectionAnimations.ts | `gam_water_counter`          |
| `GON_EARTH_EMBRACE_ANIMATION`    | GonTechniqueAnimations.ts   | `gon_earth_embrace`          |
| `LI_FLAME_SPEAR_ANIMATION`       | LiTechniqueAnimations.ts    | `li_flame_spear`             |

---

### 4. Kick Direction Issues

| Kick                    | Status        | Issue                                         |
| ----------------------- | ------------- | --------------------------------------------- |
| Hook Kick (후려차기)    | ⚠️ Wrong      | Uses crescent arc instead of hook-back motion |
| Tornado Kick (회전차기) | ⚠️ Incomplete | Missing full 360° rotation                    |
| Spinning Back Kick      | ⚠️ Wrong      | Labeled as 540° but only 180° rotation        |
| All Kicks               | ⚠️ Missing    | Only right leg variants exist                 |

---

### 5. Underused Utility Systems

| Utility                  | Status                  | Usage Opportunity                              |
| ------------------------ | ----------------------- | ---------------------------------------------- |
| `BodyFacingSystem`       | 1 of 25+ functions used | Opponent tracking, attack facing lock          |
| `AdvancedJointMovements` | Partial                 | Hip rotation for kicks, wrist snap for punches |
| `AnimationMirror`        | Internal only           | Mirror animations for left/right variants      |
| Factory Presets          | Internal only           | Dynamic animation generation                   |

---

## 🎯 Implementation Plan

### Phase 1: Fix Critical Duration Issues (Priority: HIGH)

**Goal**: Ensure all animations use `TECHNIQUE_TIMING` constants

**Files to Update**:

1. **AttackAnimations.ts** - Update 2 animations
2. **StanceAnimations.ts** - Update 8 animations
3. **ElbowKneeAnimations.ts** - Update 6 animations
4. **DarkOpsAnimations.ts** - Update 8 animations

**Pattern to Apply**:

```typescript
// BEFORE (too short)
export const JAB_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jab", "잽")
    .asAttack(0.3) // ❌ 300ms - too short!
    .punchWindup(0.08)
    .punchExtend(0.1)
    .recover(0.12)
    .build();

// AFTER (proper timing)
export const JAB_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jab", "잽")
    .asAttack(TECHNIQUE_TIMING.FAST.total) // ✅ 550ms
    .punchWindup(TECHNIQUE_TIMING.FAST.chamber)
    .punchExtend(TECHNIQUE_TIMING.FAST.extend)
    .punchPeak(TECHNIQUE_TIMING.FAST.peak) // Added peak phase!
    .punchRetract(TECHNIQUE_TIMING.FAST.retract)
    .recover(TECHNIQUE_TIMING.FAST.recover)
    .build();
```

---

### Phase 2: Connect Existing Animations to Techniques (Priority: HIGH)

**Goal**: Map stance-specific animations to their techniques in `TechniqueAnimationMapping.ts`

**Changes Required**:

```typescript
// Add to TECHNIQUE_ANIMATION_MAP in TechniqueAnimationMapping.ts

// Jin (Thunder) techniques
jin_lightning_flash: { type: AnimationType.JIN_THUNDER_FLASH, speed: 1.3 },
jin_jumping_knee: { type: AnimationType.JIN_THUNDER_KNEE, speed: 1.0 },

// Son (Wind) techniques
son_whirlwind_barrage: { type: AnimationType.SON_WHIRLWIND_STRIKE, speed: 1.2 },
son_rhythmic_strikes: { type: AnimationType.SON_RHYTHMIC_STRIKES, speed: 1.3 },

// Gan (Mountain) techniques
gan_rock_defense: { type: AnimationType.GAN_ROCK_DEFENSE, speed: 0.9 },
gan_immovable_stance: { type: AnimationType.GAN_IMMOVABLE_GUARD, speed: 0.8 },

// Gam (Water) techniques
gam_water_counter: { type: AnimationType.GAM_WATER_COUNTER, speed: 1.1 },
gam_flowing_block: { type: AnimationType.GAM_FLOWING_BLOCK, speed: 1.0 },

// Gon (Earth) techniques
gon_earth_embrace: { type: AnimationType.GON_EARTH_EMBRACE, speed: 0.85 },
gon_ssireum_throw: { type: AnimationType.GON_SSIREUM_THROW, speed: 0.9 },
```

---

### Phase 3: Fix Kick Direction Issues (Priority: MEDIUM)

**Goal**: Correct biomechanics for problematic kicks

#### 3.1 Hook Kick Fix

Add new methods to `MartialArtsAnimationBuilder.ts`:

```typescript
/**
 * Hook kick extension past target (후려차기 연장)
 * Leg extends past target position
 */
hookKickExtend(timeOffset: number = 0.15): this {
  this.addKeyframe(this.currentTime + timeOffset, "ease-out", (kf) => {
    kf.rotate(BoneName.HIP_R, 1.3, 0, 0.5);
    kf.rotate(BoneName.KNEE_R, -0.1, 0, 0);
    kf.rotate(BoneName.PELVIS, 0, -1.8, 0); // Past perpendicular
    kf.rotate(BoneName.SPINE_LOWER, 0, 0.3, 0);
  });
  return this;
}

/**
 * Hook kick hook-back motion (후려차기 후림)
 * Heel hooks back toward target
 */
hookKickHook(timeOffset: number = 0.15): this {
  this.addKeyframe(this.currentTime + timeOffset, "ease-in", (kf) => {
    kf.rotate(BoneName.HIP_R, 1.0, 0, -0.3); // Leg hooks back
    kf.rotate(BoneName.KNEE_R, -0.6, 0, 0); // Slight knee bend
    kf.rotate(BoneName.FOOT_R, 0.3, 0, -0.4); // Heel first
    kf.rotate(BoneName.PELVIS, 0, -1.3, 0);
  });
  return this;
}
```

#### 3.2 Tornado Kick Fix

```typescript
/**
 * Tornado kick jump with 360° rotation (회전차기 도약)
 */
tornadoJump(timeOffset: number = 0.3): this {
  // Initial rotation (180°)
  this.addKeyframe(this.currentTime + timeOffset * 0.4, "ease-out", (kf) => {
    kf.rotate(BoneName.PELVIS, 0, -3.14, 0); // 180° rotation
    kf.position(BoneName.ROOT, 0, 0.3, 0); // Jump up
  });

  // Complete rotation (360°)
  this.addKeyframe(this.currentTime + timeOffset, "ease-in-out", (kf) => {
    kf.rotate(BoneName.PELVIS, 0, -6.28, 0); // 360° rotation
    kf.position(BoneName.ROOT, 0, 0.5, 0); // Peak height
  });
  return this;
}
```

---

### Phase 4: Utilize Underused Systems (Priority: MEDIUM)

#### 4.1 Integrate BodyFacingSystem

Add to combat loop in `CombatSystem.ts`:

```typescript
import { BodyFacingManager } from "@/systems/animation/systems/BodyFacingSystem";

// In combat update:
const facing = new BodyFacingManager();
facing.setTargetPosition(opponent.position);
facing.update(deltaTime);
const { head, torso } = facing.getRotations();
// Apply to player animation state
```

#### 4.2 Use AnimationMirror for Left/Right Variants

Add to animation catalogs:

```typescript
import { mirrorAnimation } from "../utils/AnimationMirror";

// Create right-leg kick
export const FRONT_KICK_R_ANIMATION = createFrontKickAnimation("right");

// Mirror for left-leg variant
export const FRONT_KICK_L_ANIMATION = mirrorAnimation(FRONT_KICK_R_ANIMATION);
```

#### 4.3 Use AdvancedJointMovements for Power Calculation

```typescript
import { calculateHipRotationAngle } from "../systems/AdvancedJointMovements";

// In damage calculation:
const hipRotation = calculateHipRotationAngle(
  currentPelvisRotation,
  peakPelvisRotation,
);
const powerMultiplier = 1.0 + (hipRotation / Math.PI) * 0.3;
```

---

### Phase 5: Create Missing Unique Animations (Priority: LOW)

**Animations to Create**:

1. `GAN_IMMOVABLE_GUARD` - Statuesque defensive posture
2. `GAN_IRON_WALL_BLOCK` - Double-arm reinforced block
3. `GAM_FLOWING_BLOCK` - Circular yielding water block
4. `SON_RHYTHMIC_STRIKES` - Taekyon rhythmic hand patterns
5. `LI_PRESSURE_POINT_STRIKE` - Precision finger strike
6. `GEON_POWER_PALM` - Overhead palm with body weight

---

## 📊 Summary Statistics

| Category                         | Count    | Status              |
| -------------------------------- | -------- | ------------------- |
| Animations under 550ms           | 20+      | ⚠️ Need fix         |
| Techniques sharing generic anims | 35 (53%) | ⚠️ Need unique      |
| Existing anims not connected     | 11       | ⚠️ Need mapping     |
| Kicks with direction issues      | 3        | ⚠️ Need fix         |
| Underused utility functions      | 40+      | ⚠️ Need integration |
| New animations needed            | 6-8      | 📝 Planned          |

---

## ✅ Success Criteria

After implementation:

1. **No animation under 550ms** (TECHNIQUE_TIMING.FAST minimum)
2. **Each trigram technique has unique animation** (no shared generics)
3. **All kick directions biomechanically correct**
4. **Left/right variants for all applicable techniques**
5. **BodyFacingSystem integrated for opponent tracking**
6. **Full test coverage for animation timing**

---

## 🔧 Quick Reference: TECHNIQUE_TIMING Constants

| Timing         | Total Duration | Frames @ 60fps | Use For               |
| -------------- | -------------- | -------------- | --------------------- |
| `FAST`         | 550ms          | 33             | Jabs, quick strikes   |
| `FAST_MEDIUM`  | 600ms          | 36             | Lead hooks, counters  |
| `MEDIUM_LIGHT` | 700ms          | 42             | Uppercuts, backfists  |
| `MEDIUM`       | 730ms          | 44             | Crosses, roundhouses  |
| `MEDIUM_HEAVY` | 750ms          | 45             | Side kicks, crescents |
| `HEAVY_LIGHT`  | 800ms          | 48             | Hooks, sweeps         |
| `HEAVY_MEDIUM` | 850ms          | 51             | Question marks        |
| `HEAVY`        | 1000ms         | 60             | Power punches, jumps  |
| `SPINNING`     | 1200ms         | 72             | Spinning techniques   |

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
