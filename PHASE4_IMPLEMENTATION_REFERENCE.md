# Phase 4 Implementation Reference

## Quick Start Guide

This document provides a quick reference for understanding and extending the Phase 4 idle breathing animation system.

---

## 📁 File Location

```
src/systems/animation/catalogs/StanceIdleAnimations.ts
```

---

## 🔧 Key Functions

### 1. Natural Breathing Calculation

```typescript
function calculateBreathingScale(
  phase: number,      // 0-1 breathing cycle position
  min: number,        // Minimum scale (exhale)
  max: number,        // Maximum scale (peak inhale)
): number
```

**Usage**:
```typescript
const breathingScale = calculateBreathingScale(0.5, 0.98, 1.02);
// Returns 1.02 (peak inhale at phase 0.5)
```

**Output Range**: `min` to `max` (typically 0.96-1.04)

---

### 2. Torso Breathing Offset

```typescript
function calculateTorsoBreathingOffset(
  breathingScale: number  // Current breathing scale
): number
```

**Usage**:
```typescript
const offset = calculateTorsoBreathingOffset(1.04);
// Returns 0.016 radians (chest forward expansion)
```

**Output Range**: -0.016 to +0.016 radians (~1° forward/backward)

---

### 3. Shoulder Rise/Fall

```typescript
function calculateShoulderBreathing(
  breathingScale: number  // Current breathing scale
): number
```

**Usage**:
```typescript
const shoulderOffset = calculateShoulderBreathing(1.04);
// Returns 0.006 radians (shoulder rise)
```

**Output Range**: -0.006 to +0.006 radians (~0.34°)

**Stance Multipliers**:
- Jin (Thunder): 1.2x = 0.41°
- Normal: 1.0x = 0.34°
- Li (Fire): 0.6x = 0.20°
- Gan (Mountain): 0.5x = 0.17°

---

### 4. Head Tracking

```typescript
function calculateHeadMovement(
  phase: number,      // 0-1 cycle position
  intensity: number,  // 0-1 awareness level
): {
  pitch: number;  // X-axis (nod)
  yaw: number;    // Y-axis (turn)
  roll: number;   // Z-axis (tilt)
}
```

**Usage**:
```typescript
const head = calculateHeadMovement(0.25, 0.6);
// Returns { pitch: 0.012, yaw: 0.009, roll: 0.005 }
```

**Intensity by Stance**:
- Son (Wind): 0.9 - Never still
- Tae (Lake): 0.8 - Adaptive
- Gam (Water): 0.7 - Calm adaptive
- Geon (Heaven): 0.6 - Alert
- Jin/Gon: 0.5 - Moderate
- Li (Fire): 0.3 - Focused
- Gan (Mountain): 0.2 - Immovable

---

### 5. Stance Micro-Movements

```typescript
function calculateStanceMicroMovement(
  phase: number,
  stanceType: 'aggressive' | 'fluid' | 'precise' | 'coiled' | 
              'flowing' | 'adaptive' | 'solid' | 'grounded',
): {
  guardFloat: number;    // Guard hand adjustment
  weightShift: number;   // Weight shift amount
}
```

**Usage**:
```typescript
const micro = calculateStanceMicroMovement(0.3, 'aggressive');
// Returns { guardFloat: 0.008, weightShift: 0.005 }
```

**Stance Type Mapping**:
- `'aggressive'` → Geon (Heaven)
- `'fluid'` → Tae (Lake)
- `'precise'` → Li (Fire)
- `'coiled'` → Jin (Thunder)
- `'flowing'` → Son (Wind)
- `'adaptive'` → Gam (Water)
- `'solid'` → Gan (Mountain)
- `'grounded'` → Gon (Earth)

---

### 6. Knee Bounce

```typescript
function calculateKneeBounce(
  phase: number,      // 0-1 cycle position
  amplitude: number,  // Stance-specific amplitude
): number
```

**Usage**:
```typescript
const kneeBounce = calculateKneeBounce(0.5, 0.005);
// Returns -0.0006 radians (slight knee flex at mid-breath)
```

**Amplitudes by Stance** (from `WEIGHT_SHIFT_AMPLITUDES`):
- Jin: 0.009 - Coiled spring
- Gam: 0.008 - Flowing
- Tae: 0.007 - Fluid
- Son: 0.006 - Rhythmic
- Geon: 0.005 - Mobile
- Gon: 0.004 - Grounded
- Li: 0.003 - Precision
- Gan: 0.002 - Mountain solid

---

### 7. Apply Pose to Keyframe

```typescript
function applyGuardPoseToKeyframe(
  kf: KeyframeConfig,
  pose: StanceGuardPose,
  breathingOffset: number,
  shoulderOffset: number,
  headMovement: { pitch: number; yaw: number; roll: number },
  kneeBounce: number = 0,
  guardAdjustment: number = 0,
): void
```

**Usage**:
```typescript
const kf = builder.at(frameTime);
applyGuardPoseToKeyframe(
  kf,
  GEON_HIGH_GUARD_POSE,
  breathingOffset,
  shoulderOffset,
  headMovement,
  kneeBounce,
  microMove.guardFloat,
);
kf.done<MartialArtsAnimationBuilder>();
```

---

## 🎯 Creating a New Idle Animation

### Template

```typescript
function createMyIdleAnimation(): SkeletalAnimation {
  const pose = MY_GUARD_POSE;
  const { min, max } = pose.breathingRange;
  const duration = 2.5; // seconds
  const amplitude = 0.006; // weight shift
  const frames = 5; // number of keyframes

  const builder = MartialArtsAnimationBuilder.create(
    "my_idle",
    "나의 대기",
  ).asIdle(duration, true);

  for (let i = 0; i <= frames; i++) {
    const phase = i / frames;
    const frameTime = phase * duration;
    
    // Calculate breathing
    const breathingScale = calculateBreathingScale(phase, min, max);
    const breathingOffset = calculateTorsoBreathingOffset(breathingScale);
    const shoulderOffset = calculateShoulderBreathing(breathingScale);
    
    // Calculate head tracking
    const headMovement = calculateHeadMovement(phase, 0.6);
    
    // Calculate micro-movements
    const microMove = calculateStanceMicroMovement(phase, 'fluid');
    const kneeBounce = calculateKneeBounce(phase, amplitude);

    // Build keyframe
    const kf = builder.at(frameTime);
    applyGuardPoseToKeyframe(
      kf,
      pose,
      breathingOffset,
      shoulderOffset,
      headMovement,
      kneeBounce,
      microMove.guardFloat,
    );
    kf.done<MartialArtsAnimationBuilder>();
  }

  return builder.build();
}
```

---

## 🔄 Breathing Cycle Timeline

```
Phase   Time    Action          Breathing Scale
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0.0     0.0s    Start exhale    1.00 (neutral)
0.2     0.5s    Inhaling        1.01
0.4     1.0s    Peak inhale     1.04 (max)
0.5     1.25s   Hold peak       1.04
0.6     1.5s    Exhaling        1.02
0.8     2.0s    Continuing      0.98
0.9     2.25s   Full exhale     0.96 (min)
1.0     2.5s    Hold valley     0.96
```

---

## 📐 Bone Hierarchy

```
PELVIS (root)
├── SPINE_LOWER (30% torso rotation)
│   └── SPINE_MIDDLE (30% torso rotation)
│       └── SPINE_UPPER (40% torso rotation + breathing)
│           ├── SHOULDER_L (+ shoulder breathing + guard float)
│           │   └── ELBOW_L (+ guard float)
│           │       └── WRIST_L
│           ├── SHOULDER_R (+ shoulder breathing + guard float)
│           │   └── ELBOW_R (+ guard float)
│           │       └── WRIST_R
│           └── HEAD (+ three-axis tracking)
├── HIP_L
│   └── KNEE_L (+ knee bounce)
│       └── FOOT_L
└── HIP_R
    └── KNEE_R (+ knee bounce)
        └── FOOT_R
```

---

## 📊 Breathing Range Configuration

### From Guard Poses (`StanceGuardPoses.ts`)

```typescript
interface StanceGuardPose {
  // ...
  breathingRange: {
    min: number;  // Exhale scale (0.96-0.99)
    max: number;  // Inhale scale (1.01-1.04)
  };
  // ...
}
```

### Current Ranges

| Stance | Min   | Max   | Range | Character |
|--------|-------|-------|-------|-----------|
| Jin    | 0.96  | 1.04  | 0.08  | Deep power |
| Gon    | 0.96  | 1.04  | 0.08  | Grounded |
| Tae    | 0.97  | 1.03  | 0.06  | Flowing |
| Gam    | 0.97  | 1.03  | 0.06  | Deep flow |
| Geon   | 0.98  | 1.02  | 0.04  | Powerful |
| Son    | 0.985 | 1.015 | 0.03  | Rhythmic |
| Li     | 0.99  | 1.01  | 0.02  | Controlled |
| Gan    | 0.99  | 1.01  | 0.02  | Minimal |

---

## 🎨 Stance Character Guide

### Choosing Stance Type

When creating a new stance, select the appropriate character type:

**Aggressive** - Forward pressure, rapid adjustments
- Use for: Offensive stances, boxing-style guards
- Example: Geon (Heaven)

**Fluid** - Circular flowing, larger movements
- Use for: Adaptive stances, flowing styles
- Example: Tae (Lake)

**Precise** - Minimal controlled, tight movements
- Use for: Precision stances, focused styles
- Example: Li (Fire)

**Coiled** - Tension pulses, spring-like readiness
- Use for: Explosive stances, power styles
- Example: Jin (Thunder)

**Flowing** - Continuous never-stopping motion
- Use for: Mobile stances, pressure styles
- Example: Son (Wind)

**Adaptive** - Responsive circular shifts
- Use for: Defensive stances, counter styles
- Example: Gam (Water)

**Solid** - Minimal immovable stability
- Use for: Defensive stances, blocking styles
- Example: Gan (Mountain)

**Grounded** - Stable low-stance readiness
- Use for: Wrestling stances, grappling styles
- Example: Gon (Earth)

---

## 🧪 Testing Your Animation

### Basic Tests

```typescript
describe("My Idle Animation", () => {
  it("should have correct duration", () => {
    expect(MY_IDLE_ANIMATION.duration).toBe(2.5);
  });

  it("should be looping", () => {
    expect(MY_IDLE_ANIMATION.loop).toBe(true);
  });

  it("should have multiple keyframes", () => {
    expect(MY_IDLE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(4);
  });

  it("should have consistent leg positions", () => {
    const firstKf = MY_IDLE_ANIMATION.keyframes[0];
    const lastKf = MY_IDLE_ANIMATION.keyframes[MY_IDLE_ANIMATION.keyframes.length - 1];
    
    const firstHipL = firstKf.boneRotations.get("hip_L");
    const lastHipL = lastKf.boneRotations.get("hip_L");
    
    expect(lastHipL?.x).toBeCloseTo(firstHipL?.x ?? 0, 2);
  });
});
```

---

## 🐛 Common Issues

### Issue: Breathing looks mechanical

**Solution**: Check breathing range in guard pose
```typescript
breathingRange: {
  min: 0.96,  // Should be < 1.0
  max: 1.04,  // Should be > 1.0
}
```

### Issue: Too much shoulder movement

**Solution**: Reduce shoulder multiplier
```typescript
const shoulderOffset = calculateShoulderBreathing(breathingScale) * 0.5;
```

### Issue: Head moves too much

**Solution**: Reduce intensity parameter
```typescript
const headMovement = calculateHeadMovement(phase, 0.3); // Lower intensity
```

### Issue: Guard hands float excessively

**Solution**: Scale down guard adjustment
```typescript
applyGuardPoseToKeyframe(
  kf,
  pose,
  breathingOffset,
  shoulderOffset,
  headMovement,
  kneeBounce,
  microMove.guardFloat * 0.5, // Scale down
);
```

### Issue: Walking in place appearance

**Solution**: Legs should NOT move between keyframes
```typescript
// Ensure leg rotations are identical across all keyframes
// Only pelvis Y position can change (stance height)
// NO pelvis X/Z position changes
kf.position(BoneName.PELVIS, 0, pelvisHeight, 0); // X=0, Z=0
```

---

## 📖 Further Reading

- `PHASE4_IDLE_ANIMATIONS_COMPLETE.md` - Full achievement summary
- `PHASE4_BREATHING_TECHNICAL_DETAILS.md` - Deep technical dive
- `PHASE4_VISUAL_SUMMARY.md` - Quick visual reference
- `src/systems/animation/catalogs/StanceGuardPoses.ts` - Guard pose definitions
- `src/systems/animation/builders/MartialArtsAnimationBuilder.ts` - Animation builder API

---

## 💡 Tips

1. **Start with reference stance** - Copy similar existing stance and modify
2. **Test breathing range first** - Get natural breathing before adding micro-movements
3. **Adjust intensity gradually** - Small changes in intensity make big visual differences
4. **Watch for leg movement** - Legs should stay fixed (no walking)
5. **Use stance character types** - Choose from 8 predefined character types
6. **Respect Korean martial arts** - Each stance should reflect its philosophy
7. **Test in game** - Visual appearance matters more than perfect numbers

---

## 🎯 Quality Checklist

✅ Natural breathing with holds (not continuous)  
✅ Shoulders rise/fall with respiration  
✅ Head tracks with awareness  
✅ Micro-movements show stance character  
✅ Knees bounce subtly  
✅ Legs stay fixed (no walking)  
✅ Duration matches stance tempo  
✅ Korean names and terminology  
✅ Tests passing  
✅ Reflects martial arts philosophy  

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_ ✨
