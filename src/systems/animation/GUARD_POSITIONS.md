# Korean Guard Position System (막기자세 시스템)

## Overview

The Korean Guard Position system provides authentic Korean martial arts defensive postures for use in animations. This system implements three primary guard levels based on traditional Taekwondo blocking techniques (막기).

## Guard Positions

### 상단막기 (Sangdan Makgi) - High Guard

**Purpose**: Protects head and face from overhead attacks

**Characteristics**:
- Hands at temple/forehead level
- Elbows bent ~110° (tight guard)
- Fists vertical (thumb-side up)
- Forearms create defensive barrier

**Protects**:
- Head (머리)
- Temple (관자놀이)
- Forehead (이마)
- Eyes (눈)
- Nose (코)
- Jaw (턱)

**Usage**:
```typescript
import { MartialArtsAnimationBuilder } from "./MartialArtsAnimationBuilder";

const animation = MartialArtsAnimationBuilder
  .create("high_block", "상단막기")
  .asDefense(0.5)
  .withKoreanHighGuard() // Apply high guard to both hands
  .build();
```

### 중단막기 (Jungdan Makgi) - Middle Guard

**Purpose**: Protects torso and vital organs (most versatile guard)

**Characteristics**:
- Hands at chest/chin level
- Elbows bent ~90° (classic guard)
- Fists vertical
- Ready to attack or defend

**Protects**:
- Chest (가슴)
- Solar plexus (명치)
- Ribs (갈비뼈)
- Liver (간)
- Spleen (비장)
- Heart (심장)

**Usage**:
```typescript
const animation = MartialArtsAnimationBuilder
  .create("jab", "잽")
  .asAttack(0.55)
  .punchChamber(0.1, "left")
  .withKoreanMiddleGuard("right") // Right hand stays in guard
  .punchExtend(0.15, "left")
  .withKoreanMiddleGuard("right") // Maintain guard
  .recover(0.3)
  .withKoreanMiddleGuard() // Both hands return to guard
  .build();
```

### 하단막기 (Hadan Makgi) - Low Guard

**Purpose**: Protects lower body and groin from low attacks

**Characteristics**:
- Hands at abdomen/hip level
- Elbows bent ~70° (wider guard)
- Fists vertical
- Ready to sprawl or clinch

**Protects**:
- Abdomen (하복부)
- Groin (낭심)
- Hip (엉덩이)
- Thigh (허벅지)
- Lower ribs (아래 갈비뼈)

**Usage**:
```typescript
const animation = MartialArtsAnimationBuilder
  .create("low_block", "하단막기")
  .asDefense(0.6)
  .withKoreanLowGuard()
  .build();
```

## Using Guard Positions in Animations

### One-Handed Guards (Non-Striking Hand Protection)

When executing a technique with one hand, the other hand should maintain guard:

```typescript
// Example: Right punch with left hand guard
const rightCross = MartialArtsAnimationBuilder
  .create("cross", "크로스")
  .asAttack(0.73)
  .punchChamber(0.15, "right")
  .withKoreanMiddleGuard("left") // Left hand guards
  .punchExtend(0.20, "right")
  .withKoreanMiddleGuard("left") // Left maintains guard
  .punchPeak(0.08, "right")
  .withKoreanMiddleGuard("left") // Still guarding
  .recover(0.30)
  .withKoreanMiddleGuard() // Both return to guard
  .build();
```

### Guard Recovery Pattern

All techniques should follow the Korean martial arts pattern:
1. **준비 (Junbi)** - Start in guard
2. **실행 (Silhaeng)** - Execute technique (non-striking hand guards)
3. **복귀 (Bokgwi)** - Return to guard

```typescript
const technique = MartialArtsAnimationBuilder
  .create("technique", "기술")
  .asAttack(duration)
  // Start with guard (optional, depends on context)
  .withKoreanMiddleGuard()
  // Execute technique phases
  .chamber(0.1)
  .extend(0.2)
  // Maintain guard on non-striking side
  .withKoreanMiddleGuard("left") // or "right"
  // Return to guard
  .recover(0.3)
  .withKoreanMiddleGuard() // Both hands
  .build();
```

## Using with KeyframeConfig

For direct keyframe manipulation:

```typescript
import { KeyframeConfig } from "./KeyframeConfig";

// Create keyframe with guard
const kf = new KeyframeConfig();
kf.withGuard("MIDDLE_GUARD") // Both hands
  .position(BoneName.PELVIS, 0, 0, 0);

// One-handed guard
const kf2 = new KeyframeConfig();
kf2.withGuard("MIDDLE_GUARD", "left") // Only left hand
   .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.3); // Right hand attacks
```

## Guard Position Details

### Shoulder Rotations

| Guard | Left Shoulder (X, Y, Z) | Right Shoulder (X, Y, Z) |
|-------|------------------------|--------------------------|
| High | (-15°, 0°, 10°) | (-15°, 0°, -10°) |
| Middle | (-10°, 0°, 8°) | (-10°, 0°, -8°) |
| Low | (20°, 0°, 10°) | (20°, 0°, -10°) |

### Elbow Rotations

| Guard | Left Elbow (X, Y, Z) | Right Elbow (X, Y, Z) |
|-------|---------------------|----------------------|
| High | (0°, 0°, -110°) | (0°, 0°, 110°) |
| Middle | (0°, 0°, -90°) | (0°, 0°, 90°) |
| Low | (0°, 0°, -70°) | (0°, 0°, 70°) |

## Korean Martial Arts Principles

### 막기자세 (Makgi Jase) - Blocking Postures

Korean martial arts emphasize three levels of defense:

1. **상단 (Sangdan)** - Upper level
   - Protects head and face
   - High priority targets
   - Used against overhead strikes

2. **중단 (Jungdan)** - Middle level
   - Protects torso and organs
   - Most common defense
   - Balanced offense/defense

3. **하단 (Hadan)** - Lower level
   - Protects lower body
   - Used against kicks and sweeps
   - Grappling preparation

### 주먹쥐기 (Jumeok Jwigi) - Fist Formation

All guards use vertical fist position (세로주먹):
- Fingers tightly curled
- Thumb wrapped over index/middle fingers
- Knuckles aligned for impact
- Wrist straight for power transfer

### 준비자세 (Junbi Jase) - Ready Stance

Guards represent ready stances:
- Alert but relaxed
- Able to attack or defend instantly
- Protects vital areas
- Maintains mobility

## Implementation Notes

### Type Safety

Guards use TypeScript for compile-time safety:

```typescript
type GuardPositionType = "HIGH_GUARD" | "MIDDLE_GUARD" | "LOW_GUARD";
type HandSelection = "left" | "right" | "both";
```

### Performance

Guards are pre-calculated constants:
- No runtime computation
- Direct rotation application
- Minimal overhead
- 60fps compatible

### Extensibility

Guards can be extended for:
- Stance-specific guards
- Weapon guards
- Grappling positions
- Custom defensive postures

## Testing

Guard positions include comprehensive tests:

```bash
# Run guard position tests
npm test -- KoreanGuardPositions.test.ts

# Run integration tests
npm test -- GuardPositionIntegration.test.ts

# Run all animation tests
npm test -- --run "animation"
```

## Examples

### Complete Punch Technique

```typescript
import { MartialArtsAnimationBuilder, TECHNIQUE_TIMING } from "./MartialArtsAnimationBuilder";

export const JAB_ANIMATION = MartialArtsAnimationBuilder
  .create("jab", "잽")
  .asAttack(TECHNIQUE_TIMING.FAST.total)
  .punchChamber(TECHNIQUE_TIMING.FAST.chamber, "left")
  .withKoreanMiddleGuard("right") // Right guards during left jab
  .punchExtend(TECHNIQUE_TIMING.FAST.extend, "left")
  .withKoreanMiddleGuard("right") // Maintain guard
  .punchPeak(TECHNIQUE_TIMING.FAST.peak, "left")
  .withKoreanMiddleGuard("right") // Still guarding
  .recover(TECHNIQUE_TIMING.FAST.retract + TECHNIQUE_TIMING.FAST.recover)
  .withKoreanMiddleGuard() // Both return to guard
  .build();
```

### Defensive Technique

```typescript
export const HIGH_BLOCK = MartialArtsAnimationBuilder
  .create("high_block", "상단막기")
  .asDefense(0.4)
  .withKoreanHighGuard() // Both hands block high
  .build();
```

### Custom Technique with Mixed Guards

```typescript
export const UPPERCUT = MartialArtsAnimationBuilder
  .create("uppercut", "어퍼컷")
  .asAttack(0.7)
  .uppercutCrouch(0.08, "right")
  .withKoreanMiddleGuard("left") // Left guards during crouch
  .uppercutPunch(0.1, "right")
  .withKoreanHighGuard("left") // Left guards high as right uppercuts
  .recover(0.52)
  .withKoreanMiddleGuard() // Both return to middle guard
  .build();
```

## References

- [COMBAT_ARCHITECTURE.md](../../COMBAT_ARCHITECTURE.md) - Combat system design
- [game-design.md](../../game-design.md) - Game design principles
- [MartialArtsAnimationBuilder.ts](./MartialArtsAnimationBuilder.ts) - Animation builder
- [HandPoses.ts](./HandPoses.ts) - Hand pose system

## Contributing

When adding new animations:

1. **Always start techniques in guard** (or document why not)
2. **Maintain non-striking hand in guard** during execution
3. **Return to guard after technique** completion
4. **Use appropriate guard level** for technique type
5. **Add tests** for guard positions
6. **Document Korean terminology** in comments

---

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*
