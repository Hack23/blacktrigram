# Trigram Stance Animation Mapping System

## 🎯 Overview

The Trigram Stance Animation Mapping System provides automated, type-safe mapping between the Eight Trigram stances (팔괘) and their corresponding guard poses and technique animations.

**Korean Context:**
- **자세 가드 자세 (Jase Guard Jase)**: Guard positions for each trigram
- **팔괘 기술 (Palgwae Gisul)**: Eight trigram techniques
- **자동 매핑 (Jadong Maeping)**: Automatic mapping system

## 📦 Module Location

```typescript
import {
  TRIGRAM_GUARD_POSE_MAP,
  TRIGRAM_TECHNIQUE_ANIMATIONS_MAP,
  getGuardPoseByStance,
  getTechniqueAnimationsByStance,
} from './src/systems/animation/TrigramStanceAnimationMap';
```

## 🗺️ Available Maps

### TRIGRAM_GUARD_POSE_MAP

Direct O(1) mapping from `TrigramStance` to `StanceGuardPose`.

```typescript
const geonGuard = TRIGRAM_GUARD_POSE_MAP.get(TrigramStance.GEON);
// Returns: GEON_HIGH_GUARD_POSE with arm positions, torso rotation, breathing range
```

### TRIGRAM_TECHNIQUE_ANIMATIONS_MAP

Mapping from `TrigramStance` to an array of technique animations.

```typescript
const geonTechniques = TRIGRAM_TECHNIQUE_ANIMATIONS_MAP.get(TrigramStance.GEON);
// Returns: Array of 7 Heaven stance technique animations
```

## 🔧 Accessor Functions

### getGuardPoseByStance

Retrieve guard pose for a stance with undefined safety.

```typescript
const guardPose = getGuardPoseByStance(TrigramStance.GEON);
if (guardPose) {
  applyGuardPoseToRig(rig, guardPose);
}
```

### getTechniqueAnimationsByStance

Get all technique animations for a stance (returns empty array if not found).

```typescript
const techniques = getTechniqueAnimationsByStance(TrigramStance.GEON);
console.log(`Heaven stance has ${techniques.length} techniques`); // 7

// Use in combat system
const randomTechnique = techniques[Math.floor(Math.random() * techniques.length)];
playAnimation(randomTechnique);
```

### getTechniqueAnimationNamesByStance

Get animation names for debugging/UI display.

```typescript
const names = getTechniqueAnimationNamesByStance(TrigramStance.GEON);
// Returns: ["geon_heaven_strike", "geon_heavenly_fist", "geon_frontal_kick", ...]
```

### getTechniqueCountByStance

Quick check for technique availability.

```typescript
const count = getTechniqueCountByStance(TrigramStance.GEON);
console.log(`Geon has ${count} techniques`); // 7
```

### hasGuardPose / hasTechniqueAnimations

Defensive validation before accessing data.

```typescript
if (hasGuardPose(stance) && hasTechniqueAnimations(stance)) {
  // Safe to use both guard pose and techniques
  const guard = getGuardPoseByStance(stance);
  const techniques = getTechniqueAnimationsByStance(stance);
}
```

## 📊 Stance Mapping Summary

| Stance | Symbol | Korean | English | Guard Pose | Techniques |
|--------|--------|--------|---------|------------|------------|
| GEON | ☰ | 건 | Heaven | High Guard | 7 |
| TAE | ☱ | 태 | Lake | Fluid Guard | 7 |
| LI | ☲ | 리 | Fire | Fire Guard | 6 |
| JIN | ☳ | 진 | Thunder | Thunder Guard | 6 |
| SON | ☴ | 손 | Wind | Wind Guard | 6 |
| GAM | ☵ | 감 | Water | Water Guard | 6 |
| GAN | ☶ | 간 | Mountain | Mountain Guard | 6 |
| GON | ☷ | 곤 | Earth | Earth Guard | 7 |

**Total**: 8 stances, 8 guard poses, 51 unique technique animations

## 💡 Usage Examples

### Combat System Integration

```typescript
import { TrigramStance } from './types/common';
import { 
  getGuardPoseByStance, 
  getTechniqueAnimationsByStance 
} from './systems/animation/TrigramStanceAnimationMap';

class CombatController {
  private currentStance: TrigramStance = TrigramStance.GEON;

  changeStance(newStance: TrigramStance) {
    this.currentStance = newStance;
    
    // Apply guard pose
    const guardPose = getGuardPoseByStance(newStance);
    if (guardPose) {
      this.applyGuardPose(guardPose);
    }
  }

  executeRandomTechnique() {
    const techniques = getTechniqueAnimationsByStance(this.currentStance);
    if (techniques.length > 0) {
      const technique = techniques[Math.floor(Math.random() * techniques.length)];
      this.playAnimation(technique);
    }
  }
}
```

### UI Display

```typescript
import { TrigramStance } from './types/common';
import { 
  getTechniqueCountByStance,
  getTechniqueAnimationNamesByStance 
} from './systems/animation/TrigramStanceAnimationMap';

function renderStanceSelector() {
  return Object.values(TrigramStance).map(stance => {
    const count = getTechniqueCountByStance(stance);
    const names = getTechniqueAnimationNamesByStance(stance);
    
    return (
      <StanceButton stance={stance}>
        <StanceIcon stance={stance} />
        <StanceName stance={stance} />
        <TechniqueCount>{count} techniques</TechniqueCount>
        <TechniqueList techniques={names} />
      </StanceButton>
    );
  });
}
```

### AI Combat Decision

```typescript
import { TrigramStance } from './types/common';
import { 
  getTechniqueAnimationsByStance,
  hasGuardPose 
} from './systems/animation/TrigramStanceAnimationMap';

class AIController {
  selectBestTechnique(myStance: TrigramStance, opponentStance: TrigramStance) {
    // Get all available techniques for current stance
    const techniques = getTechniqueAnimationsByStance(myStance);
    
    // Filter by effectiveness against opponent
    const effectiveTechniques = techniques.filter(tech => 
      this.isEffectiveAgainst(tech, opponentStance)
    );
    
    // Select optimal technique
    return this.selectOptimal(effectiveTechniques);
  }
}
```

## 🧪 Testing

The module includes comprehensive test coverage (34 tests):

```bash
npm test -- src/systems/animation/TrigramStanceAnimationMap.test.ts
```

Test categories:
- ✅ Map completeness (all 8 stances)
- ✅ Correct guard pose mapping
- ✅ Technique animation grouping
- ✅ Accessor function behavior
- ✅ Performance benchmarks (O(1) lookup)
- ✅ Integration consistency

## 🔗 Related Modules

- **StanceGuardPoses.ts**: Defines individual guard pose configurations
- **StanceAnimations.ts**: Defines technique animation implementations
- **TrigramSystem.ts**: Manages stance transitions and effectiveness
- **AnimationStateMachine.ts**: Handles animation state and transitions

## 📚 References

- [COMBAT_ARCHITECTURE.md](../COMBAT_ARCHITECTURE.md) - Combat system design
- [game-design.md](../game-design.md) - Eight Trigram philosophy
- [ANIMATION_BUILDER_GUIDE.md](./ANIMATION_BUILDER_GUIDE.md) - Animation creation

---

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*
