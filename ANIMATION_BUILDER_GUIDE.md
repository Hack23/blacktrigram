# Animation Builder - Usage Examples

This guide demonstrates how to use the new AnimationBuilder, KeyframeFactories, and BoneRotationHelpers to create cleaner, more maintainable animations.

## 🎯 Overview

The AnimationBuilder provides a fluent API for creating skeletal animations with:
- Reduced boilerplate (50%+ less code)
- Better readability (declarative style)
- Reusable keyframe factories
- Bone rotation helpers for common movements
- Type-safe construction

## 📚 Basic Usage

### Old Way (Verbose)
```typescript
export const JAB_ANIMATION: SkeletalAnimation = {
  name: "jab",
  koreanName: "잽",
  duration: 0.3,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, -0.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.5, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    // ... more keyframes
  ],
};
```

### New Way (Builder Pattern)
```typescript
export const JAB_ANIMATION = AnimationBuilder.create("jab")
  .withKoreanName("잽")
  .withDuration(0.3)
  .withType("attack")
  .keyframe(0.0, "linear")
    .rotate(BoneName.SHOULDER_R, 0, 0, -0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
    .build()
  .keyframe(0.15, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0, 0, 0.5)
    .rotate(BoneName.ELBOW_R, 0, 0, 0)
    .position(BoneName.HAND_R, 0, 0, 0.8)
    .build()
  .addKeyframe(KeyframeFactories.guardReturn(0.3))
  .build();
```

## 🔧 Using Bone Rotation Helpers

The BoneRotationHelpers provide symmetry-aware rotation creation:

```typescript
// Instead of manually calculating left/right differences:
const rightShoulder = new THREE.Euler(0, 0, 0.5, "XYZ");
const leftShoulder = new THREE.Euler(0, 0, -0.5, "XYZ");  // Negative!

// Use helpers (automatically handles left/right symmetry):
const rightShoulder = BoneRotationHelpers.shoulderExtension("R", 0.5);
const leftShoulder = BoneRotationHelpers.shoulderExtension("L", 0.5);
```

### Complete Example with Helpers
```typescript
export const ENHANCED_JAB = AnimationBuilder.create("enhanced_jab")
  .withKoreanName("향상된 잽")
  .withDuration(0.3)
  .withType("attack")
  .keyframe(0.0, "linear")
    .rotate(
      BoneName.SHOULDER_R,
      ...BoneRotationHelpers.shoulderExtension("R", -0.2).toArray()
    )
    .rotate(
      BoneName.ELBOW_R,
      ...BoneRotationHelpers.elbowBend("R", 1.5).toArray()
    )
    .build()
  .keyframe(0.15, "ease-out")
    .rotate(
      BoneName.SHOULDER_R,
      ...BoneRotationHelpers.shoulderExtension("R", 0.5).toArray()
    )
    .rotate(
      BoneName.ELBOW_R,
      ...BoneRotationHelpers.elbowBend("R", 0).toArray()
    )
    .position(BoneName.HAND_R, 0, 0, 0.8)
    .build()
  .addKeyframe(KeyframeFactories.guardReturn(0.3))
  .build();
```

## 🏭 Using Keyframe Factories

Keyframe factories extract common animation patterns:

### guardReturn()
Returns to defensive guard position:
```typescript
.addKeyframe(KeyframeFactories.guardReturn(0.3))
```

### neutralStance()
Resets all joints to neutral position:
```typescript
.addKeyframe(KeyframeFactories.neutralStance(0.0))
```

### rotateTorso()
Creates torso rotation with cascading angles:
```typescript
// Rotate torso 45 degrees with natural spine cascade
.addKeyframe(KeyframeFactories.rotateTorso(0.1, Math.PI / 4, "ease-out"))
```

## 📊 Code Reduction Example

### Before: 40 Lines
```typescript
export const CROSS_ANIMATION: SkeletalAnimation = {
  name: "cross",
  koreanName: "크로스",
  duration: 0.35,
  loop: false,
  type: "attack",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, -0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.6, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.2, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, -0.15, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, -0.1, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
    {
      time: 0.18,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0.6, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.4, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0.3, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0.2, 0, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 1.0)]]),
    },
    {
      time: 0.35,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, -0.3, -0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.HAND_R, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};
```

### After: 18 Lines (55% Reduction)
```typescript
export const CROSS_ANIMATION = AnimationBuilder.create("cross")
  .withKoreanName("크로스")
  .withDuration(0.35)
  .withType("attack")
  .keyframe(0.0, "linear")
    .rotate(BoneName.SHOULDER_R, 0, 0, -0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.6)
    .build()
  .addKeyframe(KeyframeFactories.rotateTorso(0.0, -0.2))
  .keyframe(0.18, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0, 0, 0.6)
    .rotate(BoneName.ELBOW_R, 0, 0, 0)
    .position(BoneName.HAND_R, 0, 0, 1.0)
    .build()
  .addKeyframe(KeyframeFactories.rotateTorso(0.18, 0.4, "ease-out"))
  .addKeyframe(KeyframeFactories.guardReturn(0.35))
  .build();
```

## 🎨 Complex Animation Example

```typescript
export const SPINNING_KICK = AnimationBuilder.create("spinning_kick")
  .withKoreanName("회전발차기")
  .withDuration(0.8)
  .withType("attack")
  // Wind-up phase
  .addKeyframe(KeyframeFactories.neutralStance(0.0))
  .keyframe(0.2, "ease-in")
    .rotate(BoneName.HIP_L, ...BoneRotationHelpers.hipRotation("L", 0.3).toArray())
    .rotate(BoneName.KNEE_L, ...BoneRotationHelpers.kneeBend("L", 1.2).toArray())
    .build()
  .addKeyframe(KeyframeFactories.rotateTorso(0.2, -Math.PI / 4))
  // Spin phase
  .addKeyframe(KeyframeFactories.rotateTorso(0.4, Math.PI * 1.5, "linear"))
  .keyframe(0.5, "ease-out")
    .rotate(BoneName.HIP_L, ...BoneRotationHelpers.hipRotation("L", 1.5, 0.8).toArray())
    .rotate(BoneName.KNEE_L, ...BoneRotationHelpers.kneeBend("L", 0.2).toArray())
    .build()
  // Recovery
  .addKeyframe(KeyframeFactories.neutralStance(0.8))
  .build();
```

## 📈 Benefits

| Metric | Old Way | New Way | Improvement |
|--------|---------|---------|-------------|
| Lines of code | 40 | 18 | **55% reduction** |
| Boilerplate | High | Low | **Minimal** |
| Readability | Medium | High | **Better** |
| Maintainability | Low | High | **Much better** |
| Type safety | Good | Excellent | **Stronger** |

## 🚀 Migration Guide

1. **Import the builder**:
   ```typescript
   import {
     AnimationBuilder,
     KeyframeFactories,
     BoneRotationHelpers,
   } from "../../systems/animation";
   ```

2. **Convert existing animations**:
   - Replace `const ANIM: SkeletalAnimation = { ... }` with `AnimationBuilder.create()`
   - Use `.keyframe().rotate()` instead of `new Map([[...]])`
   - Use factories for common patterns (guard return, torso rotation)
   - Use helpers for bone rotations

3. **Test thoroughly**:
   - Verify animation timing is identical
   - Check bone rotations match original
   - Validate easing functions

## 💡 Best Practices

1. **Use factories for common patterns**
   ```typescript
   // Good
   .addKeyframe(KeyframeFactories.guardReturn(0.3))
   
   // Avoid
   .keyframe(0.3).rotate(...).rotate(...).rotate(...).build()
   ```

2. **Use helpers for symmetry**
   ```typescript
   // Good
   .rotate(BoneName.SHOULDER_R, ...BoneRotationHelpers.shoulderExtension("R", 0.5).toArray())
   
   // Avoid
   .rotate(BoneName.SHOULDER_R, 0, 0, 0.5)
   ```

3. **Chain logically**
   ```typescript
   AnimationBuilder.create("name")
     .withKoreanName("한글")
     .withDuration(0.5)
     .withType("attack")
     .keyframe(...).build()
     .keyframe(...).build()
     .build();
   ```

## 🔮 Future Enhancements

Potential additions to the builder:
- **Animation composition**: `.compose(otherAnimation, blendFactor)`
- **Mirroring**: `.mirror()` to create left-hand version
- **Timing adjustments**: `.scaleTime(factor)` to speed up/slow down
- **Interpolation**: `.interpolate(targetKeyframe, steps)`

---

**Start using the AnimationBuilder today to create cleaner, more maintainable animations! 🎉**
