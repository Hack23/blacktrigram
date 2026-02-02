# Korean Martial Arts Animation Quality Improvement Guide

## 🎯 Objective

Improve animation quality from current **10-15%** to target **95%+** through systematic enhancement of techniques, guard poses, movement, and idle animations with authentic Korean martial arts biomechanics.

## 📊 Current State

**System Architecture:**
- **Location**: `src/systems/animation/catalogs/`
- **Size**: 39,616 lines of animation definitions
- **Structure**: Separate files per trigram stance + specialized animations
- **Framework**: `MartialArtsAnimationBuilder` with semantic methods
- **Testing**: 1,900+ tests, all passing ✅

**Quality Issues:**
1. **Robotic Motion**: Techniques have 4-6 semantic keyframes but lack fine-grained transitional frames
2. **Teleporting**: Missing anticipation and acceleration curves between major poses
3. **Static Guards**: No micro-adjustments or natural fidgeting
4. **Basic Breathing**: Simple chest expansion only
5. **Linear Movement**: No weight transfer or momentum

**Note**: Current animations use 4-6 semantic builder methods (e.g., `.punchChamber()`, `.punchExtend()`), which create functional keyframes. However, the visual smoothness and biomechanical detail are at 10-15% of target quality due to lack of intermediate frames and natural motion curves.

## 🔧 Animation Builder API Reference

### Basic Pattern
```typescript
import { MartialArtsAnimationBuilder, TECHNIQUE_TIMING } from "../builders/MartialArtsAnimationBuilder";
import { BoneName } from "@/types/skeletal";

const animation = MartialArtsAnimationBuilder.create("technique_name", "한글이름")
  .asAttack(TECHNIQUE_TIMING.FAST.total) // or .asIdle(), .asMovement(), etc.
  
  // Method 1: Semantic builder methods (auto-generates keyframe at current time)
  .punchChamber(0.1, "left") // Creates keyframe with punch chamber position
  .withKoreanMiddleGuard("right") // Modifies last keyframe to add guard
  
  // Method 2: Manual keyframe with precise bone control
  .at(0.25) // Returns KeyframeConfig for time 0.25s
  .rotate(BoneName.SHOULDER_L, -0.3, 0.1, 0.4) // X, Y, Z in radians
  .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
  .rotate(BoneName.PELVIS, 0.02, 0.05, 0) // Hip engagement
  .position(BoneName.PELVIS, 0, 0, 0.1) // X, Y, Z in meters
  .done<MartialArtsAnimationBuilder>() // MUST call .done() to return to builder
  
  // Method 3: Another semantic method
  .punchExtend(0.15, "left")
  
  .build(); // Finalize and return SkeletalAnimation
```

### Key Bone Names (BoneName enum)
```typescript
// Core Skeleton
BoneName.PELVIS        // Root of body
BoneName.SPINE_LOWER   // Lower back
BoneName.SPINE_MIDDLE  // Mid back
BoneName.SPINE_UPPER   // Upper chest
BoneName.NECK          // Neck
BoneName.HEAD          // Head

// Arms (L/R for left/right)
BoneName.SHOULDER_L, BoneName.SHOULDER_R    // Shoulder joints
BoneName.UPPER_ARM_L, BoneName.UPPER_ARM_R  // Upper arm
BoneName.ELBOW_L, BoneName.ELBOW_R          // Elbow joints
BoneName.FOREARM_L, BoneName.FOREARM_R      // Forearm
BoneName.WRIST_L, BoneName.WRIST_R          // Wrist joints
BoneName.HAND_L, BoneName.HAND_R            // Hand

// Legs (L/R for left/right)
BoneName.HIP_L, BoneName.HIP_R          // Hip rotation (leg socket)
BoneName.THIGH_L, BoneName.THIGH_R      // Thigh
BoneName.KNEE_L, BoneName.KNEE_R        // Knee bend
BoneName.SHIN_L, BoneName.SHIN_R        // Shin
BoneName.FOOT_L, BoneName.FOOT_R        // Ankle/foot

// Note: Additional finger bones available for detailed hand animation (LOD)
// See src/types/skeletal.ts BoneName enum for complete bone list
```

### Semantic Builder Methods

**Punch Methods:**
- `.punchChamber(time, side)` - Chamber position at hip
- `.punchExtend(time, side)` - Full extension with rotation
- `.punchPeak(time, side)` - Peak impact position
- `.punchWindup(time)` - Initial wind-up

**Kick Methods:**
- `.chamber(time)` - Knee-up chamber position
- `.extend(time)` - Leg extension
- `.retract(time)` - Pull back through chamber
- `.roundhouseChamber(time)` - Hip-rotated chamber
- `.roundhouseExtend(time)` - Circular extension
- `.sideKickChamber(time)` - Sideways turn
- `.sideKickExtend(time)` - Lateral thrust

**Guard Methods:**
- `.withKoreanHighGuard(side)` - 상단막기 (High guard)
- `.withKoreanMiddleGuard(side)` - 중단막기 (Middle guard)
- `.withKoreanLowGuard(side)` - 하단막기 (Low guard)
- Side parameter: `"left"` | `"right"` | `"both"`

**Recovery:**
- `.recover(time)` - Return to neutral stance

## 📈 Enhancement Strategies

### 1. Technique Animation Enhancement

**Current State: 3-5 keyframes**
```typescript
// ❌ OLD: Basic 4-keyframe punch (robotic, teleporting)
export const JAB_ANIMATION = MartialArtsAnimationBuilder.create("jab", "잽")
  .asAttack(0.55)
  .punchChamber(0.1, "left")     // Keyframe 1: Chamber
  .punchExtend(0.15, "left")     // Keyframe 2: Extend
  .punchPeak(0.05, "left")       // Keyframe 3: Peak
  .recover(0.25)                 // Keyframe 4: Recover
  .build();
```

**Target State: 10-15 keyframes**
```typescript
// ✅ NEW: Enhanced 10-keyframe punch (smooth, realistic)
export const JAB_ANIMATION = MartialArtsAnimationBuilder.create("jab", "잽")
  .asAttack(0.55)
  
  // 1. Initial guard position (0ms)
  .at(0)
  .rotate(BoneName.SHOULDER_L, -0.17, 0, -0.09)
  .rotate(BoneName.SHOULDER_R, -0.17, 0, 0.09)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.57)
  .rotate(BoneName.ELBOW_R, 0, 0, 1.57)
  .done<MartialArtsAnimationBuilder>()
  
  // 2. Anticipation - subtle shoulder load (30ms)
  .at(0.03)
  .rotate(BoneName.SHOULDER_L, -0.15, 0, -0.15) // Slight back
  .rotate(BoneName.PELVIS, -0.01, -0.02, 0) // Subtle coil
  .done<MartialArtsAnimationBuilder>()
  
  // 3. Begin chamber - elbow starts back (70ms)
  .at(0.07)
  .rotate(BoneName.SHOULDER_L, -0.2, 0, -0.5)
  .rotate(BoneName.ELBOW_L, 0, 0, -2.0) // Pulling back
  .done<MartialArtsAnimationBuilder>()
  
  // 4. Full chamber at hip (100ms)
  .punchChamber(0.1, "left")
  .withKoreanMiddleGuard("right")
  
  // 5. Launch initiation - hip fires (150ms)
  .at(0.15)
  .rotate(BoneName.PELVIS, 0.02, 0.05, 0) // Hip drives
  .rotate(BoneName.SHOULDER_L, -0.25, 0.05, 0.2)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.3) // Starting extension
  .done<MartialArtsAnimationBuilder>()
  
  // 6. Acceleration phase (200ms)
  .at(0.2)
  .rotate(BoneName.PELVIS, 0.03, 0.08, 0)
  .rotate(BoneName.SPINE_UPPER, 0.02, 0.06, 0) // Torso follows
  .rotate(BoneName.SHOULDER_L, -0.3, 0.1, 0.4)
  .rotate(BoneName.ELBOW_L, 0, 0, -0.8) // Extending fast
  .done<MartialArtsAnimationBuilder>()
  
  // 7. Near full extension with fist rotation (250ms)
  .at(0.25)
  .rotate(BoneName.SHOULDER_L, -0.35, 0.12, 0.5)
  .rotate(BoneName.ELBOW_L, 0, 0, -0.3) // Nearly straight
  .rotate(BoneName.WRIST_L, 0, 0, -1.57) // Fist pronated
  .done<MartialArtsAnimationBuilder>()
  
  // 8. Peak impact (300ms)
  .at(0.3)
  .rotate(BoneName.SHOULDER_L, -0.4, 0.15, 0.6)
  .rotate(BoneName.ELBOW_L, 0, 0, -0.1) // Full extension
  .rotate(BoneName.PELVIS, 0.04, 0.1, 0) // Maximum rotation
  .done<MartialArtsAnimationBuilder>()
  
  // 9. Begin retraction (350ms)
  .at(0.35)
  .rotate(BoneName.SHOULDER_L, -0.25, 0, 0.2)
  .rotate(BoneName.ELBOW_L, 0, 0, -1.5) // Starting to bend
  .rotate(BoneName.PELVIS, 0.01, 0.03, 0) // Counter-rotation starts
  .done<MartialArtsAnimationBuilder>()
  
  // 10. Recovery to guard (550ms)
  .recover(0.2)
  .withKoreanMiddleGuard()
  
  .build();
```

**Note**: This is a 10-keyframe example (keyframes at 0, 0.03, 0.07, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.55).

**Key Improvements:**
- ✅ Anticipation frame (shoulder load, weight shift)
- ✅ Multi-stage chamber (gradual pull-back)
- ✅ Hip initiation (power generation from ground)
- ✅ Torso cascade (sequential body segment activation)
- ✅ Acceleration curves (smooth speed changes)
- ✅ Follow-through (continued rotation after impact)
- ✅ Counter-rotation recovery (natural body mechanics)

### 2. Guard Pose Enhancement

**Add Micro-Adjustments to StanceGuardPoses.ts:**

```typescript
// Current: Static guard pose
export const GEON_HIGH_GUARD_POSE: StanceGuardPose = {
  leftArm: {
    shoulder: new THREE.Euler(-1.0, 0.2, 0.5),
    elbow: new THREE.Euler(0, 0, -2.2),
    wrist: new THREE.Euler(0.3, 0.2, 0),
  },
  // ... rest of pose
};

// Enhanced: Add variation functions
export function getGeonGuardWithVariation(
  timePhase: number // 0-1 through breathing cycle
): StanceGuardPose {
  const base = GEON_HIGH_GUARD_POSE;
  
  // Subtle hand height adjustment (breathing sync)
  const breathAdjust = Math.sin(timePhase * Math.PI * 2) * 0.05;
  
  // Random micro-fidget (every few seconds)
  const fidget = (Math.random() - 0.5) * 0.02;
  
  return {
    leftArm: {
      shoulder: new THREE.Euler(
        base.leftArm.shoulder.x + breathAdjust,
        base.leftArm.shoulder.y + fidget,
        base.leftArm.shoulder.z
      ),
      elbow: base.leftArm.elbow,
      wrist: base.leftArm.wrist,
    },
    // ... apply to all limbs
  };
}
```

### 3. Idle Animation Enhancement

**Add Natural Micro-Movements:**

```typescript
// Enhanced idle with head movement, shoulder rolls, weight shifts
function createEnhancedGeonIdle(): SkeletalAnimation {
  const pose = GEON_HIGH_GUARD_POSE;
  const duration = 4.0; // Longer cycle for more natural feel
  const frames = 12; // More frames for smoother motion
  
  const builder = MartialArtsAnimationBuilder.create("stance_geon", "건 대기")
    .asIdle(duration, true);
  
  for (let i = 0; i <= frames; i++) {
    const phase = i / frames;
    const t = phase * duration;
    
    // Multiple overlapping sine waves for natural variation
    const breathPhase = Math.sin(phase * Math.PI * 2);
    const headPhase = Math.sin(phase * Math.PI * 4 + 0.3); // Faster, offset
    const shoulderPhase = Math.sin(phase * Math.PI * 3 + 0.7);
    const weightPhase = Math.sin(phase * Math.PI * 1.5);
    
    const kf = builder.at(t);
    
    // Base pose
    applyGuardPoseToKeyframe(kf, pose, 0, 0);
    
    // Add micro-movements
    // Head tracking (looking around slightly)
    kf.rotate(BoneName.HEAD, 
      0.09 + headPhase * 0.03, // Up/down
      headPhase * 0.05,         // Left/right
      0
    );
    
    // Shoulder micro-adjustments
    kf.rotate(BoneName.SHOULDER_L,
      -1.0 + shoulderPhase * 0.02,
      0.2,
      0.5 + shoulderPhase * 0.03
    );
    
    // Subtle weight shift with biomechanically accurate pelvis movement
    kf.rotate(BoneName.KNEE_L,
      1.2 + weightPhase * 0.05,
      0, 0
    );
    kf.rotate(BoneName.KNEE_R,
      1.2 - weightPhase * 0.05, // Opposite
      0, 0
    );
    kf.rotate(BoneName.PELVIS,
      weightPhase * 0.015, // Subtle pelvis tilt for authentic weight transfer
      0,
      weightPhase * 0.01 // Slight lateral shift
    );
    
    // Breathing expansion
    kf.rotate(BoneName.SPINE_UPPER,
      breathPhase * 0.03, // Chest forward on inhale
      0, 0
    );
    
    kf.done<MartialArtsAnimationBuilder>();
  }
  
  return builder.build();
}
```

### 4. Movement Animation Enhancement

**Add Weight Transfer and Momentum:**

```typescript
// Enhanced forward step with proper biomechanics
export const FORWARD_STEP = MartialArtsAnimationBuilder.create(
  "forward_step",
  "전진보"
)
  .asMovement(0.6, false)
  
  // 1. Initial stance (0ms)
  .at(0)
  .rotate(BoneName.PELVIS, 0, 0, 0)
  .rotate(BoneName.KNEE_L, -0.5, 0, 0) // Front leg bent
  .rotate(BoneName.KNEE_R, -0.3, 0, 0) // Rear leg
  .position(BoneName.PELVIS, 0, 0, 0)
  .done<MartialArtsAnimationBuilder>()
  
  // 2. Weight shift back (prepare to push) (100ms)
  .at(0.1)
  .rotate(BoneName.PELVIS, -0.05, 0, 0) // Slight back tilt
  .rotate(BoneName.KNEE_R, -0.4, 0, 0) // Load rear leg
  .position(BoneName.PELVIS, 0, 0, -0.02) // Slight back
  .done<MartialArtsAnimationBuilder>()
  
  // 3. Push-off initiation (200ms)
  .at(0.2)
  .rotate(BoneName.PELVIS, 0.05, 0, 0) // Forward thrust
  .rotate(BoneName.KNEE_R, -0.2, 0, 0) // Extending
  .rotate(BoneName.FOOT_R, -0.15, 0, 0) // Plantarflexion (toes push)
  .position(BoneName.PELVIS, 0, 0.02, 0.1) // Up and forward
  .done<MartialArtsAnimationBuilder>()
  
  // 4. Flight phase (300ms)
  .at(0.3)
  .rotate(BoneName.PELVIS, 0.08, 0, 0)
  .rotate(BoneName.KNEE_L, -0.2, 0, 0) // Front leg extending
  .rotate(BoneName.KNEE_R, -0.1, 0, 0) // Rear leg following
  .position(BoneName.PELVIS, 0, 0.03, 0.25) // Peak height
  .done<MartialArtsAnimationBuilder>()
  
  // 5. Landing preparation (450ms)
  .at(0.45)
  .rotate(BoneName.PELVIS, 0.03, 0, 0)
  .rotate(BoneName.KNEE_L, -0.6, 0, 0) // Front leg bending to absorb
  .rotate(BoneName.FOOT_L, 0.1, 0, 0) // Dorsiflexion (heel first)
  .position(BoneName.PELVIS, 0, 0.01, 0.4)
  .done<MartialArtsAnimationBuilder>()
  
  // 6. Landing complete (600ms)
  .at(0.6)
  .rotate(BoneName.PELVIS, 0, 0, 0) // Stable
  .rotate(BoneName.KNEE_L, -0.5, 0, 0) // Absorbed impact
  .rotate(BoneName.KNEE_R, -0.3, 0, 0) // Rear leg forward
  .position(BoneName.PELVIS, 0, 0, 0.5) // Full step distance
  .done<MartialArtsAnimationBuilder>()
  
  .build();

// Note: Keyframe times (0, 0.1, 0.2, 0.3, 0.45, 0.6) are absolute times 
// within the 0.6s duration specified in .asMovement(0.6, false)
```

## 📋 Implementation Checklist

### High Priority (Most Visual Impact)
- [ ] **Punch Animations** - Add 10-15 keyframes to all punches
  - [ ] JAB_ANIMATION
  - [ ] CROSS_ANIMATION
  - [ ] HOOK_ANIMATION
  - [ ] UPPERCUT_ANIMATION
  
- [ ] **Kick Animations** - Add chamber/extension progressions
  - [ ] FRONT_KICK_ANIMATION
  - [ ] ROUNDHOUSE_KICK_ANIMATION
  - [ ] SIDE_KICK_ANIMATION
  
- [ ] **Idle Animations** - Add micro-movements to all stances
  - [ ] GEON_IDLE_ANIMATION (Heaven)
  - [ ] TAE_IDLE_ANIMATION (Lake)
  - [ ] LI_IDLE_ANIMATION (Fire)
  - [ ] JIN_IDLE_ANIMATION (Thunder)
  - [ ] SON_IDLE_ANIMATION (Wind)
  - [ ] GAM_IDLE_ANIMATION (Water)
  - [ ] GAN_IDLE_ANIMATION (Mountain)
  - [ ] GON_IDLE_ANIMATION (Earth)

### Medium Priority
- [ ] **Guard Poses** - Add variation functions for each stance
- [ ] **Movement Animations** - Add weight transfer to all locomotion
- [ ] **Stance Transitions** - Smooth interpolations between stances

### Low Priority (Polish)
- [ ] **Combo Animations** - Multi-hit sequences
- [ ] **Special Techniques** - Dark Ops and advanced moves
- [ ] **Recovery Animations** - Getting up, stumbling, etc.

## 🎯 Quality Validation

**Before/After Metrics:**
- Keyframe count per technique: 3-5 → 10-15 ✓
- Animation smoothness: Linear → Curved acceleration ✓
- Biomechanical accuracy: Basic → Authentic Korean martial arts ✓
- Natural movement: Robotic → Fluid human motion ✓
- Idle realism: Static → Natural fidgeting ✓

**Testing:**
```bash
# Run animation tests
npm test -- src/systems/animation/catalogs

# Check specific animation file
npm test -- src/systems/animation/catalogs/PunchAnimations.test.ts

# Type check
npm run check

# Visual inspection needed - run game and observe in-game
npm run dev
```

## 📚 References

- **Animation System**: `src/systems/animation/`
- **Builder Code**: `src/systems/animation/builders/MartialArtsAnimationBuilder.ts`
- **Keyframe Config**: `src/systems/animation/builders/KeyframeConfig.ts`
- **Bone Names**: `src/types/skeletal.ts`
- **Korean Martial Arts**: Game design documents in `docs/`

## 🚀 Getting Started

1. **Study existing animations** in `GeonStanceAnimations.ts` - best examples of multi-keyframe animations
2. **Start with one punch** - JAB_ANIMATION as proof of concept
3. **Test thoroughly** - ensure smooth motion and no breakage
4. **Apply pattern** - systematically enhance all techniques
5. **Iterate and refine** - adjust based on visual results

---

**Target Completion**: Systematic enhancement of all 50+ techniques, 8 guard poses, 8 idle animations, and 10+ movement patterns for 95%+ quality Korean martial arts animations.
