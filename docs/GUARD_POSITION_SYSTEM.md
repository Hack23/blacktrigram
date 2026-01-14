# Guard Position System (막기자세 시스템)

## 🎯 Overview

The Guard Position System implements authentic Korean martial arts defensive positioning throughout all animations. This system ensures fighters maintain proper hand positioning and guard postures (막기자세) before, during, and after techniques.

## 🥋 Korean Martial Arts Guard Positions

### Three Primary Guards (삼단막기)

#### 1. 상단막기 (Sangdan Makgi) - High Guard
**Purpose**: Protects head and face  
**Height**: Temple/forehead level  
**Hand Pose**: Vertical fists (주먹)  
**Protects**: Head, temple, forehead, eyes, nose, jaw  
**Usage**: High kicks, overhead attacks, aggressive stances  

```typescript
.withGuard("HIGH_GUARD")
```

#### 2. 중단막기 (Jungdan Makgi) - Middle Guard  
**Purpose**: Protects torso and vital organs  
**Height**: Chest/solar plexus level  
**Hand Pose**: Vertical fists (주먹)  
**Protects**: Chest, solar plexus, ribs, liver, spleen  
**Usage**: Most common guard, versatile defensive posture  

```typescript
.withGuard("MIDDLE_GUARD")
```

#### 3. 하단막기 (Hadan Makgi) - Low Guard
**Purpose**: Protects lower body  
**Height**: Abdomen/hip level  
**Hand Pose**: Vertical fists (주먹)  
**Protects**: Abdomen, groin, hip, thighs  
**Usage**: Grappling range, low attacks, ground combat  

```typescript
.withGuard("LOW_GUARD")
```

## 🔧 Technical Implementation

### API Usage

#### Both Hands in Guard
```typescript
.at(0.0)
.withGuard("MIDDLE_GUARD")  // Both hands in middle guard
.done()
```

#### Single Hand Guard (For Striking Techniques)
```typescript
.at(0.0)
.withGuard("MIDDLE_GUARD", "left")   // Only left hand guards
.done()

.at(0.0)
.withGuard("MIDDLE_GUARD", "right")  // Only right hand guards
.done()
```

### Complete Animation Pattern

```typescript
export const PUNCH_WITH_GUARD = MartialArtsAnimationBuilder
  .create("punch_guard", "주먹지르기_막기")
  .asAttack(0.6)
  
  // 1. START: Both hands in middle guard (중단막기)
  .at(0.0)
  .withGuard("MIDDLE_GUARD")
  .done()
  
  // 2. WIND-UP: Prepare strike, non-striking hand maintains guard
  .at(0.15)
  .rotate(BoneName.SHOULDER_R, 0.3, 0, -0.3)  // Right arm prepares
  .rotate(BoneName.ELBOW_R, 0, 0, 1.8)
  .withGuard("MIDDLE_GUARD", "left")  // Left hand stays in guard
  .done()
  
  // 3. EXTENSION: Execute strike, non-striking hand maintains guard
  .at(0.3)
  .rotate(BoneName.SHOULDER_R, -0.7, 0, 0.5)  // Right arm extends
  .rotate(BoneName.ELBOW_R, 0, 0, 0.05)
  .withGuard("MIDDLE_GUARD", "left")  // Left hand still guards
  .done()
  
  // 4. RECOVERY: Return both hands to guard
  .at(0.6)
  .withGuard("MIDDLE_GUARD")  // Both hands return to guard
  .rotate(BoneName.SPINE_UPPER, 0, 0, 0)  // Reset torso
  .done()
  
  .build();
```

## 📐 Guard Position Specifications

### High Guard (상단막기)
```typescript
{
  korean: "상단막기",
  english: "High Guard",
  romanized: "Sangdan Makgi",
  left: {
    shoulder: [toRadians(-15), toRadians(0), toRadians(10)],
    elbow: [toRadians(0), toRadians(0), toRadians(-110)],
    wrist: [toRadians(0), toRadians(0), toRadians(0)],
  },
  right: {
    shoulder: [toRadians(-15), toRadians(0), toRadians(-10)],
    elbow: [toRadians(0), toRadians(0), toRadians(110)],
    wrist: [toRadians(0), toRadians(0), toRadians(0)],
  },
  height: "temple_level",
  handPose: "fist_vertical",
  protects: ["head", "temple", "forehead", "eyes", "nose", "jaw"],
}
```

### Middle Guard (중단막기)
```typescript
{
  korean: "중단막기",
  english: "Middle Guard",
  romanized: "Jungdan Makgi",
  left: {
    shoulder: [toRadians(-10), toRadians(0), toRadians(8)],
    elbow: [toRadians(0), toRadians(0), toRadians(-90)],
    wrist: [toRadians(0), toRadians(0), toRadians(0)],
  },
  right: {
    shoulder: [toRadians(-10), toRadians(0), toRadians(-8)],
    elbow: [toRadians(0), toRadians(0), toRadians(90)],
    wrist: [toRadians(0), toRadians(0), toRadians(0)],
  },
  height: "chest_level",
  handPose: "fist_vertical",
  protects: ["chest", "solar_plexus", "ribs", "liver", "spleen", "heart"],
}
```

### Low Guard (하단막기)
```typescript
{
  korean: "하단막기",
  english: "Low Guard",
  romanized: "Hadan Makgi",
  left: {
    shoulder: [toRadians(20), toRadians(0), toRadians(10)],
    elbow: [toRadians(0), toRadians(0), toRadians(-70)],
    wrist: [toRadians(0), toRadians(0), toRadians(0)],
  },
  right: {
    shoulder: [toRadians(20), toRadians(0), toRadians(-10)],
    elbow: [toRadians(0), toRadians(0), toRadians(70)],
    wrist: [toRadians(0), toRadians(0), toRadians(0)],
  },
  height: "abdomen_level",
  handPose: "fist_vertical",
  protects: ["abdomen", "groin", "hip", "thigh", "lower_ribs"],
}
```

## 🎮 Guard Selection by Technique Type

### High Techniques (상단 기술)
**Use HIGH_GUARD** to protect face:
- High kicks (높은 발차기)
- Head-level strikes (머리 공격)
- Jumping techniques (뛰기 기술)
- Spinning heel kicks (돌려차기)

```typescript
.at(0.0)
.withGuard("HIGH_GUARD")  // Face protection
.done()
```

### Middle Techniques (중단 기술)
**Use MIDDLE_GUARD** (most common):
- Punches (주먹 치기)
- Body kicks (몸통 발차기)
- Elbow strikes (팔꿈치 치기)
- Standard attacks (기본 공격)

```typescript
.at(0.0)
.withGuard("MIDDLE_GUARD")  // Standard guard
.done()
```

### Low Techniques (하단 기술)
**Use LOW_GUARD** for ground range:
- Low kicks (낮은 발차기)
- Sweeps (쓸어차기)
- Grappling (잡기)
- Takedowns (넘어뜨리기)

```typescript
.at(0.0)
.withGuard("LOW_GUARD")  // Ground combat protection
.done()
```

## 🎯 Animation Standards

### Rule 1: Start in Guard (준비자세)
**Every technique must start from proper guard position**

```typescript
// ✅ CORRECT
.at(0.0)
.withGuard("MIDDLE_GUARD")  // Starts in guard
.done()

// ❌ INCORRECT - No initial guard
.at(0.0)
.rotate(BoneName.SHOULDER_R, 0.3, 0, 0)  // Missing guard
.done()
```

### Rule 2: Maintain Non-Striking Hand Guard (방어 유지)
**The non-striking hand must remain in guard during technique execution**

```typescript
// ✅ CORRECT
.at(0.25)
.rotate(BoneName.SHOULDER_R, -0.7, 0, 0.5)  // Right punch
.withGuard("MIDDLE_GUARD", "left")  // Left maintains guard
.done()

// ❌ INCORRECT - Both hands move
.at(0.25)
.rotate(BoneName.SHOULDER_R, -0.7, 0, 0.5)
.rotate(BoneName.SHOULDER_L, -0.3, 0, 0)  // Left drops guard
.done()
```

### Rule 3: Return to Guard (복귀)
**Every technique must end by returning to guard position**

```typescript
// ✅ CORRECT
.at(durationEnd)
.withGuard("MIDDLE_GUARD")  // Returns to guard
.rotate(BoneName.SPINE_UPPER, 0, 0, 0)  // Reset body
.done()

// ❌ INCORRECT - Doesn't return to guard
.at(durationEnd)
.rotate(BoneName.SHOULDER_R, 0, 0, -0.1)  // Arm positioned randomly
.done()
```

## 📊 Testing Guard Positions

### Test Pattern
```typescript
describe("Guard Position Tests", () => {
  it("should start in proper guard", () => {
    const animation = createAnimation();
    const firstFrame = animation.keyframes[0];
    
    expect(hasGuardPosition(firstFrame, "MIDDLE_GUARD", "left")).toBe(true);
    expect(hasGuardPosition(firstFrame, "MIDDLE_GUARD", "right")).toBe(true);
  });

  it("should maintain non-striking hand guard", () => {
    const animation = createAnimation();
    const midFrame = animation.keyframes[1];  // During strike
    
    expect(hasGuardPosition(midFrame, "MIDDLE_GUARD", "left")).toBe(true);
  });

  it("should return to guard", () => {
    const animation = createAnimation();
    const endFrame = animation.keyframes[animation.keyframes.length - 1];
    
    expect(hasGuardPosition(endFrame, "MIDDLE_GUARD", "left")).toBe(true);
    expect(hasGuardPosition(endFrame, "MIDDLE_GUARD", "right")).toBe(true);
  });
});
```

## 🔧 Migration Guide

### Converting Existing Animations

**Before (No Guards)**:
```typescript
export const OLD_PUNCH = AnimationBuilder.create("punch")
  .withKoreanName("주먹")
  .withDuration(0.5)
  .withType("attack")
  .keyframe(0.0, "linear")
  .rotate(BoneName.SHOULDER_R, 0.3, 0, -0.3)
  .build()
  .build();
```

**After (With Guards)**:
```typescript
export const NEW_PUNCH = MartialArtsAnimationBuilder
  .create("punch", "주먹")
  .asAttack(0.5)
  // Start in guard
  .at(0.0)
  .withGuard("MIDDLE_GUARD")
  .done()
  // Wind-up with guard maintenance
  .at(0.15)
  .rotate(BoneName.SHOULDER_R, 0.3, 0, -0.3)
  .withGuard("MIDDLE_GUARD", "left")  // Non-striking hand guards
  .done()
  // Return to guard
  .at(0.5)
  .withGuard("MIDDLE_GUARD")
  .done()
  .build();
```

### Migration Checklist
- [ ] Convert `AnimationBuilder` to `MartialArtsAnimationBuilder`
- [ ] Add initial guard position at time 0
- [ ] Add guard maintenance during technique execution
- [ ] Add guard return at technique end
- [ ] Test all three guard states (start, mid, end)
- [ ] Validate performance (60fps)

## 📚 Related Files

### Core System Files
- `src/systems/animation/KoreanGuardPositions.ts` - Guard definitions
- `src/systems/animation/KeyframeConfig.ts` - `.withGuard()` implementation
- `src/systems/animation/MartialArtsAnimationBuilder.ts` - Builder with guard support

### Animation Files to Update
- `src/systems/animation/AttackAnimations.ts` - Basic attack moves
- `src/systems/animation/DefensiveAnimations.ts` - Defensive techniques
- `src/systems/animation/StanceAttackAnimations.ts` - 24 stance-specific attacks
- `src/systems/animation/ComboAnimations.ts` - Combination techniques

### Test Files
- `src/systems/animation/__tests__/GuardPositionIntegration.test.ts` - 16 comprehensive tests

## 🎯 Success Criteria

- ✅ All techniques start from proper guard position
- ✅ Hands return to guard after technique execution
- ✅ Non-striking hand maintains guard during techniques
- ✅ Guard height appropriate for stance (high/middle/low)
- ✅ Korean/English documentation complete
- ✅ Test coverage >90% for guard positions
- ✅ Performance maintained (60fps, <10ms animation creation)

## 🌟 Best Practices

### DO ✅
- Always start techniques in guard
- Maintain non-striking hand in guard during technique
- Return both hands to guard at end
- Use appropriate guard height for technique type
- Test all three guard phases (start, mid, end)
- Document guard rationale in animation comments

### DON'T ❌
- Start techniques without guard position
- Drop both hands during strikes
- Leave hands in attack position at end
- Use mismatched guard heights (e.g., low guard for high kick)
- Skip guard testing
- Forget Korean-English bilingual documentation

## 📖 References

### Korean Martial Arts Terms
- **막기자세** (Makgi Jase) - Guard position/blocking posture
- **주먹쥐기** (Jumeok Jwigi) - Fist formation
- **준비자세** (Junbi Jase) - Ready stance
- **상단막기** (Sangdan Makgi) - High block/guard
- **중단막기** (Jungdan Makgi) - Middle block/guard
- **하단막기** (Hadan Makgi) - Low block/guard
- **손날** (Sonnal) - Knife-hand edge
- **방어** (Bangeo) - Defense/protection

### Traditional Korean Martial Arts
- **태권도** (Taekwondo) - The Way of Foot and Fist
- **합기도** (Hapkido) - The Way of Coordinating Energy
- **택견** (Taekyon) - Traditional Korean martial art

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
