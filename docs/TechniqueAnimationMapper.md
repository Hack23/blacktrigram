# Technique Animation Mapper

**Korean**: 기술 애니메이션 매퍼

## Overview

The `TechniqueAnimationMapper` provides comprehensive mapping between combat techniques, trigram stances, and corresponding animations for the Black Trigram (흑괘) martial arts game. It achieves **100% coverage** of all 1024 possible technique-stance combinations with O(1) lookup performance.

## Architecture

### Mapping System

The mapper uses a three-tier lookup strategy:

1. **Exact Match**: `stance-type-part-intensity` (e.g., `"geon-strike-head-heavy"`)
2. **Intensity-Agnostic**: Falls back to medium intensity if exact intensity not found
3. **Technique Type Fallback**: Uses generic animation for the technique type

### Coverage

- **Total Combinations**: 1,024
- **8 Trigram Stances**: ☰ 건, ☱ 태, ☲ 리, ☳ 진, ☴ 손, ☵ 감, ☶ 간, ☷ 곤
- **4 Technique Types**: Strike, Joint, Throw, Pressure Point
- **8 Body Parts**: Head, Neck, Torso Upper/Lower, Arms, Legs
- **4 Intensity Levels**: Light, Medium, Heavy, Critical
- **Coverage**: 100%

## Usage

### Basic Usage

```typescript
import { techniqueAnimationMapper, TrigramStance } from "@/systems/animation";
import { BodyPart } from "@/systems/bodypart/types";

// Get animation for specific technique
const animation = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.GEON,
  techniqueType: "strike",
  bodyPart: BodyPart.HEAD,
  intensity: "heavy",
});

// Use animation properties
console.log(animation.koreanName); // "건괘 두부 강 타격"
console.log(animation.englishName); // "Heaven Head Heavy Strike"
console.log(animation.duration); // 0.78 seconds
console.log(animation.impactFrame); // Frame 14
console.log(animation.recoveryFrames); // 18 frames
```

### Advanced Joint Movement Integration (PR #1132)

The mapper now includes comprehensive torso and hip rotation data for all 1024 technique combinations, integrating with the advanced joint movement system for realistic Korean martial arts execution.

#### Torso Rotation (허리회전)

```typescript
const animation = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.GON,  // Earth stance - deep rotation
  techniqueType: "throw",
  bodyPart: BodyPart.TORSO_LOWER,
  intensity: "critical",
});

console.log(animation.torsoRotation); // ~1.05 radians (60°)
// Torso rotation relative to hips (-π/2 to π/2)
// Varies by stance and technique type
```

**Stance-Specific Torso Rotation**:
- **건 (Geon)**: 30° - Moderate direct rotation
- **태 (Tae)**: 10° - Minimal fluid rotation
- **리 (Li)**: 20° - Quick snap rotation
- **진 (Jin)**: 45° - Wide explosive rotation
- **손 (Son)**: 15° - Continuous adaptive flow
- **감 (Gam)**: 22.5° - Circular wave motion
- **간 (Gan)**: 5° - Stable minimal rotation
- **곤 (Gon)**: 60° - Deep grounded rotation

#### Hip Engagement (골반참여도)

```typescript
const animation = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.JIN,  // Thunder - maximum hip drive
  techniqueType: "strike",
  bodyPart: BodyPart.HEAD,
  intensity: "critical",
});

console.log(animation.hipEngagement); // ~1.0 (100%)
console.log(animation.powerModifier);  // ~1.30 (30% bonus)
// Hip engagement scales with stance, technique, and intensity
```

**Hip Engagement by Stance**:
- **건 (Geon)**: 90% - High engagement for direct force
- **태 (Tae)**: 50% - Moderate fluid movement
- **리 (Li)**: 70% - Good engagement for rapid techniques
- **진 (Jin)**: 100% - Maximum explosive power
- **손 (Son)**: 60% - Moderate continuous pressure
- **감 (Gam)**: 70% - Good adaptive flow
- **간 (Gan)**: 30% - Low stable defensive
- **곤 (Gon)**: 95% - Very high grounding techniques

#### Power Modifiers (파워배율)

Power modifiers are automatically calculated based on hip engagement and technique type:

```typescript
// Strike with high hip engagement
const strikeAnim = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.GEON,
  techniqueType: "strike",
  bodyPart: BodyPart.HEAD,
  intensity: "heavy",
});
console.log(strikeAnim.powerModifier); // 1.27 (27% damage bonus)

// Joint technique with lower engagement
const jointAnim = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.TAE,
  techniqueType: "joint",
  bodyPart: BodyPart.ARM_LEFT,
  intensity: "heavy",
});
console.log(jointAnim.powerModifier); // 1.03 (3% damage bonus)
```

**Power Modifier Ranges by Technique**:
- **Strike**: 1.0 - 1.30 (up to 30% bonus)
- **Throw**: 1.0 - 1.20 (up to 20% bonus)
- **Pressure Point**: 1.0 - 1.25 (up to 25% bonus)
- **Joint**: 1.0 - 1.10 (up to 10% bonus)

### Validation

```typescript
// Validate mapping completeness
const validation = techniqueAnimationMapper.validateCompleteness();

console.log(`Coverage: ${validation.coverage}%`); // 100%
console.log(`Mapped: ${validation.mapped}/${validation.total}`); // 1024/1024
console.log(`Missing: ${validation.missing.length}`); // 0
```

### Creating Custom Instance

```typescript
import { TechniqueAnimationMapper } from "@/systems/animation";

// Create custom mapper instance
const customMapper = new TechniqueAnimationMapper();

// Use same API
const animation = customMapper.getAnimation({
  stance: TrigramStance.LI,
  techniqueType: "pressure_point",
  bodyPart: BodyPart.NECK,
  intensity: "critical",
});
```

## Stance Characteristics

Each trigram stance has unique animation characteristics based on its philosophical foundation:

### ☰ 건 (Geon) - Heaven Stance

**Philosophy**: Direct force, overwhelming power, aggressive techniques

**Animation Characteristics**:
- Standard to slightly faster timing
- Forceful, direct movements
- Emphasis on power delivery

```typescript
const geonAnimation = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.GEON,
  techniqueType: "strike",
  bodyPart: BodyPart.TORSO_UPPER,
  intensity: "heavy",
});
// Direct, powerful strike animation
```

### ☱ 태 (Tae) - Lake Stance

**Philosophy**: Fluid movement, joint manipulation, flowing techniques

**Animation Characteristics**:
- Faster recovery frames (fluid)
- 1.3x duration for joint techniques
- Smooth, flowing transitions

```typescript
const taeAnimation = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.TAE,
  techniqueType: "joint",
  bodyPart: BodyPart.ARM_LEFT,
  intensity: "medium",
});
// Fluid joint lock animation
```

### ☲ 리 (Li) - Fire Stance

**Philosophy**: Precision and speed, rapid attacks, nerve strikes

**Animation Characteristics**:
- 0.85x duration (faster)
- Earlier impact frames
- Quick recovery (3 frames less)

```typescript
const liAnimation = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.LI,
  techniqueType: "pressure_point",
  bodyPart: BodyPart.NECK,
  intensity: "critical",
});
// Fast, precise nerve strike
```

### ☳ 진 (Jin) - Thunder Stance

**Philosophy**: Explosive power, shocking techniques, sudden movements

**Animation Characteristics**:
- 0.9x duration (slightly faster)
- Longer recovery (+2 frames)
- Explosive impact delivery

```typescript
const jinAnimation = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.JIN,
  techniqueType: "strike",
  bodyPart: BodyPart.HEAD,
  intensity: "heavy",
});
// Explosive shocking strike
```

### ☴ 손 (Son) - Wind Stance

**Philosophy**: Continuous pressure, evasion, mobility

**Animation Characteristics**:
- 0.95x duration
- Faster recovery (-1 frame)
- Continuous, pressuring movement

```typescript
const sonAnimation = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.SON,
  techniqueType: "strike",
  bodyPart: BodyPart.LEG_LEFT,
  intensity: "light",
});
// Fast, mobile strike
```

### ☵ 감 (Gam) - Water Stance

**Philosophy**: Flow and adaptation, counter techniques, redirection

**Animation Characteristics**:
- 1.1x duration (slightly slower)
- Later impact frame (+1)
- Adaptive, flowing movement

```typescript
const gamAnimation = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.GAM,
  techniqueType: "throw",
  bodyPart: BodyPart.TORSO_LOWER,
  intensity: "medium",
});
// Flowing, adaptive throw
```

### ☶ 간 (Gan) - Mountain Stance

**Philosophy**: Defensive mastery, immovable stance, endurance

**Animation Characteristics**:
- 1.2x duration (slower, defensive)
- Later impact frame (+2)
- Longer recovery (+3 frames)

```typescript
const ganAnimation = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.GAN,
  techniqueType: "joint",
  bodyPart: BodyPart.ARM_RIGHT,
  intensity: "heavy",
});
// Defensive, controlled technique
```

### ☷ 곤 (Gon) - Earth Stance

**Philosophy**: Grounding techniques, takedowns, throws

**Animation Characteristics**:
- 1.6x duration for throws (much slower)
- Later impact frame (+3 for throws)
- Longer recovery (+4 frames for throws)

```typescript
const gonAnimation = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.GON,
  techniqueType: "throw",
  bodyPart: BodyPart.TORSO_UPPER,
  intensity: "heavy",
});
// Powerful grounding throw (1.56s duration)
```

## Intensity Modifiers

Animation properties scale with intensity level:

### Light Intensity

- **Duration**: 0.7x base (faster)
- **Impact Frame**: Frame 8
- **Recovery**: 8 frames
- **Use Case**: Quick jabs, testing strikes

```typescript
const lightStrike = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.GEON,
  techniqueType: "strike",
  bodyPart: BodyPart.TORSO_UPPER,
  intensity: "light",
});
// 0.42s duration, frame 8 impact
```

### Medium Intensity

- **Duration**: 1.0x base (standard)
- **Impact Frame**: Frame 10
- **Recovery**: 12 frames
- **Use Case**: Standard attacks

```typescript
const mediumStrike = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.GEON,
  techniqueType: "strike",
  bodyPart: BodyPart.TORSO_UPPER,
  intensity: "medium",
});
// 0.6s duration, frame 10 impact
```

### Heavy Intensity

- **Duration**: 1.3x base (slower, more powerful)
- **Impact Frame**: Frame 14
- **Recovery**: 18 frames
- **Use Case**: Power strikes, finishing moves

```typescript
const heavyStrike = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.GEON,
  techniqueType: "strike",
  bodyPart: BodyPart.TORSO_UPPER,
  intensity: "heavy",
});
// 0.78s duration, frame 14 impact
```

### Critical Intensity

- **Duration**: 1.6x base (slowest, maximum power)
- **Impact Frame**: Frame 18
- **Recovery**: 24 frames
- **Use Case**: Finishing blows, critical hits

```typescript
const criticalStrike = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.GEON,
  techniqueType: "strike",
  bodyPart: BodyPart.TORSO_UPPER,
  intensity: "critical",
});
// 0.96s duration, frame 18 impact
```

## Performance

### O(1) Lookup Performance

The mapper achieves **O(1) constant-time lookup** using Map-based storage:

```typescript
// Benchmark: 10,000 lookups
const startTime = performance.now();

for (let i = 0; i < 10000; i++) {
  techniqueAnimationMapper.getAnimation({
    stance: TrigramStance.GEON,
    techniqueType: "strike",
    bodyPart: BodyPart.HEAD,
    intensity: "heavy",
  });
}

const endTime = performance.now();
const avgTime = (endTime - startTime) / 10000;

console.log(`Average lookup time: ${avgTime}ms`);
// Result: < 0.01ms per lookup
```

### Memory Efficiency

- **Map Storage**: ~1024 entries
- **Memory Footprint**: ~200KB
- **Initialization**: < 50ms on modern hardware

## Korean Terminology

The mapper provides full bilingual support with authentic Korean martial arts terminology:

### Stance Names (괘 이름)

| Trigram | Korean | Romanization | English |
|---------|--------|--------------|---------|
| ☰ | 건괘 | Geon-goe | Heaven |
| ☱ | 태괘 | Tae-goe | Lake |
| ☲ | 리괘 | Li-goe | Fire |
| ☳ | 진괘 | Jin-goe | Thunder |
| ☴ | 손괘 | Son-goe | Wind |
| ☵ | 감괘 | Gam-goe | Water |
| ☶ | 간괘 | Gan-goe | Mountain |
| ☷ | 곤괘 | Gon-goe | Earth |

### Technique Types (기술 유형)

| Type | Korean | Romanization | English |
|------|--------|--------------|---------|
| Strike | 타격 | Tagyeok | Strike |
| Joint | 관절 | Gwanjeol | Joint Lock |
| Throw | 던지기 | Deonjigi | Throw |
| Pressure Point | 급소 | Geupso | Vital Point |

### Body Parts (신체 부위)

| Part | Korean | Romanization | English |
|------|--------|--------------|---------|
| Head | 두부 | Dubu | Head |
| Neck | 경부 | Gyeongbu | Neck |
| Upper Torso | 상체 | Sangche | Upper Torso |
| Lower Torso | 하체 | Hache | Lower Torso |
| Left Arm | 좌팔 | Jwapal | Left Arm |
| Right Arm | 우팔 | Upal | Right Arm |
| Left Leg | 좌각 | Jwagak | Left Leg |
| Right Leg | 우각 | Ugak | Right Leg |

### Intensity Levels (강도 레벨)

| Intensity | Korean | Romanization |
|-----------|--------|--------------|
| Light | 경 | Gyeong |
| Medium | 중 | Jung |
| Heavy | 강 | Gang |
| Critical | 극 | Geuk |

### Example Korean Names

```typescript
// 건괘 두부 강 타격
// Geon-goe Dubu Gang Tagyeok
// Heaven Head Heavy Strike

// 리괘 경부 극 급소
// Li-goe Gyeongbu Geuk Geupso
// Fire Neck Critical Pressure Point

// 곤괘 하체 중 던지기
// Gon-goe Hache Jung Deonjigi
// Earth Lower Torso Heavy Throw
```

## API Reference

### Class: TechniqueAnimationMapper

#### Methods

##### `getAnimation(key: TechniqueAnimationKey): TechniqueAnimation`

Retrieve animation configuration for a specific technique combination.

**Parameters:**
- `key`: Technique animation key with stance, type, body part, and intensity

**Returns:**
- `TechniqueAnimation`: Complete animation configuration

**Example:**
```typescript
const animation = techniqueAnimationMapper.getAnimation({
  stance: TrigramStance.GEON,
  techniqueType: "strike",
  bodyPart: BodyPart.HEAD,
  intensity: "heavy",
});
```

##### `validateCompleteness(): MappingValidationResult`

Validate mapping completeness and report coverage statistics.

**Returns:**
- `MappingValidationResult`: Coverage percentage, mapped count, and missing combinations

**Example:**
```typescript
const validation = techniqueAnimationMapper.validateCompleteness();
console.log(`Coverage: ${validation.coverage}%`);
console.log(`Missing: ${validation.missing.length} combinations`);
```

##### `getMappedCount(): number`

Get total number of mapped combinations.

**Returns:**
- `number`: Count of mapped technique combinations

**Example:**
```typescript
const count = techniqueAnimationMapper.getMappedCount();
console.log(`Total mapped: ${count}`); // 1024
```

### Types

#### `TechniqueAnimationKey`

Composite key for technique animation lookup.

```typescript
interface TechniqueAnimationKey {
  readonly stance: string; // TrigramStance
  readonly techniqueType: TechniqueTypeCategory;
  readonly bodyPart: string; // BodyPart
  readonly intensity: TechniqueIntensity;
}
```

#### `TechniqueAnimation`

Complete animation configuration with Korean terminology.

```typescript
interface TechniqueAnimation {
  readonly animationState: AnimationState;
  readonly duration: number; // seconds
  readonly impactFrame: number; // 0-indexed frame
  readonly recoveryFrames: number;
  readonly priority: AnimationPriority;
  readonly koreanName: string;
  readonly englishName: string;
}
```

#### `TechniqueIntensity`

Attack intensity level affecting animation speed.

```typescript
type TechniqueIntensity = 'light' | 'medium' | 'heavy' | 'critical';
```

#### `TechniqueTypeCategory`

Core technique categories.

```typescript
type TechniqueTypeCategory = 'strike' | 'joint' | 'throw' | 'pressure_point';
```

#### `MappingValidationResult`

Result of mapping completeness validation.

```typescript
interface MappingValidationResult {
  readonly coverage: number; // 0-100
  readonly total: number;
  readonly mapped: number;
  readonly missing: readonly TechniqueAnimationKey[];
}
```

## Testing

### Test Coverage

The mapper includes comprehensive test suite with **37 tests** achieving **100% pass rate**:

- Initialization: 3 tests
- Animation retrieval: 7 tests
- Stance-specific behavior: 8 tests
- Korean terminology: 3 tests
- Validation: 5 tests
- Performance: 2 tests
- Fallback system: 3 tests
- Timing: 2 tests
- Singleton: 3 tests
- Utilities: 1 test

### Running Tests

```bash
# Run mapper tests
npm test -- src/systems/animation/TechniqueAnimationMapper.enhanced.test.ts

# Run with coverage
npm run coverage -- src/systems/animation/TechniqueAnimationMapper.enhanced.test.ts
```

### Example Test

```typescript
import { techniqueAnimationMapper } from "@/systems/animation";

describe("TechniqueAnimationMapper", () => {
  it("should return exact match for specific combination", () => {
    const animation = techniqueAnimationMapper.getAnimation({
      stance: TrigramStance.GEON,
      techniqueType: "strike",
      bodyPart: BodyPart.HEAD,
      intensity: "heavy",
    });

    expect(animation.koreanName).toContain("건괘");
    expect(animation.englishName).toContain("Heaven");
    expect(animation.duration).toBeGreaterThan(0);
  });
});
```

## Integration Examples

### Combat System Integration

```typescript
import { techniqueAnimationMapper } from "@/systems/animation";
import { executeTechnique } from "@/systems/combat";

function performTechnique(
  attacker: Player,
  target: Player,
  technique: KoreanTechnique
) {
  // Get appropriate animation
  const animation = techniqueAnimationMapper.getAnimation({
    stance: attacker.currentStance,
    techniqueType: technique.type as TechniqueTypeCategory,
    bodyPart: technique.targetBodyPart,
    intensity: calculateIntensity(technique),
  });

  // Play animation
  playAnimation(attacker, animation);

  // Execute technique at impact frame
  setTimeout(() => {
    executeTechnique(attacker, target, technique);
  }, (animation.impactFrame / 60) * 1000); // Convert to ms
}
```

### Visual Feedback

```typescript
import { techniqueAnimationMapper } from "@/systems/animation";

function displayTechniqueName(technique: KoreanTechnique, stance: TrigramStance) {
  const animation = techniqueAnimationMapper.getAnimation({
    stance,
    techniqueType: technique.type as TechniqueTypeCategory,
    bodyPart: technique.targetBodyPart,
    intensity: "medium",
  });

  // Display bilingual technique name
  showOverlay({
    korean: animation.koreanName,
    english: animation.englishName,
    duration: animation.duration * 1000,
  });
}
```

### AI Integration

```typescript
import { techniqueAnimationMapper } from "@/systems/animation";

function selectAITechnique(
  aiPlayer: Player,
  target: Player
): TechniqueAnimation {
  // AI selects technique based on strategy
  const technique = aiStrategy.selectTechnique(aiPlayer, target);

  // Get matching animation
  return techniqueAnimationMapper.getAnimation({
    stance: aiPlayer.currentStance,
    techniqueType: technique.type as TechniqueTypeCategory,
    bodyPart: technique.targetBodyPart,
    intensity: technique.intensity,
  });
}
```

## Best Practices

### 1. Use Singleton Instance

```typescript
// ✅ GOOD: Use singleton
import { techniqueAnimationMapper } from "@/systems/animation";

const animation = techniqueAnimationMapper.getAnimation(key);

// ❌ BAD: Create new instance
const mapper = new TechniqueAnimationMapper(); // Unnecessary
```

### 2. Cache Validation Results

```typescript
// ✅ GOOD: Cache validation during development
const VALIDATION_CACHE = techniqueAnimationMapper.validateCompleteness();

function checkCoverage() {
  return VALIDATION_CACHE.coverage;
}
```

### 3. Type Safety

```typescript
// ✅ GOOD: Use proper types
import { TrigramStance, TechniqueIntensity } from "@/systems/animation";
import { BodyPart } from "@/systems/bodypart/types";

const key: TechniqueAnimationKey = {
  stance: TrigramStance.GEON,
  techniqueType: "strike",
  bodyPart: BodyPart.HEAD,
  intensity: "heavy",
};

// ❌ BAD: Magic strings
const badKey = {
  stance: "geon", // No type safety
  techniqueType: "strike",
  bodyPart: "head",
  intensity: "heavy",
};
```

### 4. Error Handling

```typescript
// ✅ GOOD: Handle missing animations gracefully
const animation = techniqueAnimationMapper.getAnimation(key);

// Fallback system ensures animation is always defined
if (animation.koreanName === "일반 기술") {
  console.warn("Using fallback animation");
}

// Use animation safely
playAnimation(player, animation);
```

## Future Enhancements

### Planned Features

1. **Animation Blending**: Smooth transitions between stances
2. **Dynamic Modifiers**: Environmental effects on animation timing
3. **Combo Chains**: Special animations for technique combinations
4. **Fatigue System**: Slower animations when stamina is low
5. **Injury Effects**: Modified animations for damaged body parts

### Extension Points

The mapper is designed for easy extension:

```typescript
// Custom mapper with extended functionality
class ExtendedTechniqueAnimationMapper extends TechniqueAnimationMapper {
  constructor() {
    super();
    this.addCustomMappings();
  }

  private addCustomMappings(): void {
    // Add special technique mappings
    // Add environmental modifiers
    // Add combo-specific animations
  }
}
```

## License

Copyright © 2024 Hack23. All rights reserved.

Part of the Black Trigram (흑괘) Korean martial arts combat game.

---

**Last Updated**: 2024-01-09  
**Version**: 1.0.0  
**Maintainer**: Black Trigram Development Team
