# Technique Animation Integration Guide

## 🎯 Overview

This guide explains how to integrate the technique-to-animation linking system that has been implemented for Black Trigram (흑괘). The system connects combat techniques to skeletal animations with proper Korean martial arts form and timing.

## 📋 What Was Implemented

### 1. Animation Type System

**File**: `src/types/skeletal.ts`

Created `AttackAnimationType` enum with 12 animation variants across 5 base categories:

```typescript
export enum AttackAnimationType {
  // Punch category (주먹 타격)
  PUNCH_HIGH = "punch_high",
  PUNCH_MID = "punch_mid",
  PUNCH_LOW = "punch_low",

  // Kick category (발차기)
  KICK_FRONT = "kick_front",
  KICK_SIDE = "kick_side",
  KICK_ROUNDHOUSE = "kick_round",

  // Elbow category (팔꿈치 타격)
  ELBOW_STRIKE = "elbow_strike",
  ELBOW_UPPERCUT = "elbow_uppercut",

  // Knee category (무릎 타격)
  KNEE_STRIKE = "knee_strike",
  KNEE_CLINCH = "knee_clinch",

  // Pressure point category (급소 타격)
  PRESSURE_POINT = "pressure_point",
  PRESSURE_POINT_RAPID = "pressure_point_rapid",
}
```

### 2. Technique Animation Mapper

**File**: `src/systems/animation/TechniqueAnimationMapper.ts`

Provides automatic animation selection and speed calculation:

```typescript
// Auto-determine animation type from technique characteristics
determineAnimationTypeForTechnique(
  techniqueName: string,
  techniqueId: string,
  damageType?: string
): AttackAnimationType

// Calculate speed modifier based on damage
calculateSpeedModifierForDamage(damage: number): number
// Returns: 1.2 (light), 1.0 (normal), 0.8 (heavy)

// Get adjusted animation duration
getAdjustedAnimationDuration(
  baseAnimationName: string,
  speedModifier: number
): number
```

### 3. Combat System Integration

**File**: `src/systems/CombatSystem.ts`

Added animation information to combat results:

```typescript
// New method in CombatSystem
private getAnimationInfoForTechnique(
  technique: KoreanTechnique
): CombatResult["animation"]

// Extended CombatResult interface (src/systems/combat/types.ts)
interface CombatResult {
  // ... existing fields
  readonly animation?: {
    readonly animationName: string;      // e.g., "jab", "roundhouse_kick"
    readonly duration: number;            // Adjusted milliseconds
    readonly speedModifier: number;       // 0.8 - 1.2
    readonly techniqueDisplayName?: string; // Korean name
  };
}
```

### 4. Technique Name Display Component

**File**: `src/components/combat/components/TechniqueNameDisplay.tsx`

React component for displaying technique names during combat:

```tsx
<TechniqueNameDisplay
  koreanName="경동맥격"
  englishName="Carotid Strike"
  duration={2000}
  position={[0, 2, 0]}
  isCritical={true}
  visible={true}
/>
```

## 🔧 How to Use

### Adding Animation to a New Technique

**Option 1: Explicit Animation Config**

```typescript
const newTechnique: Technique = {
  id: "custom_strike",
  name: {
    korean: "특수타격",
    english: "Special Strike",
  },
  damage: { min: 25, max: 35 },
  damageType: DamageType.BLUNT,
  // Add animation configuration
  animation: {
    type: AttackAnimationType.PUNCH_MID,
    speedModifier: 1.0, // Normal speed
  },
};
```

**Option 2: Auto-Determination**

```typescript
// No explicit animation field needed
const newTechnique: Technique = {
  id: "auto_kick",
  name: {
    korean: "자동발차기",
    english: "Auto Kick",
  },
  damage: { min: 30, max: 40 },
  damageType: DamageType.BLUNT,
  // Animation will be auto-determined from name/id/damageType
};
```

### Executing Technique with Animation

```typescript
import { CombatSystem } from "./systems/CombatSystem";

const combatSystem = new CombatSystem();

// Execute technique
const result = combatSystem.resolveAttack(
  attacker,
  defender,
  technique,
  targetedVitalPointId
);

// result.animation now contains:
// - animationName: "jab" or "front_kick", etc.
// - duration: adjusted milliseconds
// - speedModifier: 0.8 - 1.2
// - techniqueDisplayName: Korean technique name
```

### Displaying Technique Name During Combat

```tsx
import { TechniqueNameDisplay } from "@/components/combat/components";

function CombatScene() {
  const [currentTechnique, setCurrentTechnique] = useState(null);

  const handleAttack = async (technique) => {
    const result = combatSystem.resolveAttack(attacker, defender, technique);
    
    if (result.hit && result.animation) {
      // Show technique name
      setCurrentTechnique({
        korean: result.animation.techniqueDisplayName,
        english: technique.name.english,
        duration: result.animation.duration,
        isCritical: result.isCritical,
      });

      // Hide after animation duration
      setTimeout(() => {
        setCurrentTechnique(null);
      }, result.animation.duration);
    }
  };

  return (
    <Canvas>
      {/* Combat scene */}
      
      {/* Show technique name */}
      {currentTechnique && (
        <TechniqueNameDisplay
          koreanName={currentTechnique.korean}
          englishName={currentTechnique.english}
          duration={currentTechnique.duration}
          isCritical={currentTechnique.isCritical}
          visible={true}
        />
      )}
    </Canvas>
  );
}
```

### Playing Animation Based on Technique

```typescript
// In your 3D character component
function Character3D({ combatResult }) {
  const { animationName, speedModifier } = combatResult.animation || {};

  // Get animation from AttackAnimations
  const animation = getAnimation(animationName);
  
  if (animation) {
    // Play animation with adjusted speed
    playSkeletalAnimation(animation, speedModifier);
  }
}
```

## 📊 Animation Timing Reference

### Speed Modifier Rules

```typescript
// Based on technique damage
if (damage < 20) {
  speedModifier = 1.2;  // Light, fast techniques
} else if (damage > 35) {
  speedModifier = 0.8;  // Heavy, powerful techniques
} else {
  speedModifier = 1.0;  // Normal speed
}

// Example calculations:
// Base animation: 300ms (jab)
// Light technique: 300ms / 1.2 = 250ms
// Normal technique: 300ms / 1.0 = 300ms
// Heavy technique: 300ms / 0.8 = 375ms
```

### Existing Skeletal Animations

| Animation Name | Duration | Type | Description |
|---------------|----------|------|-------------|
| `jab` | 300ms | Punch | Fast straight punch |
| `cross` | 350ms | Punch | Power cross punch |
| `front_kick` | ~400ms | Kick | Front snap kick |
| `roundhouse_kick` | ~500ms | Kick | Roundhouse kick |

## 🎮 Complete Combat Flow Example

```typescript
// 1. User selects technique
const selectedTechnique = getTechniquesForStanceAndArchetype(
  player.currentStance,
  player.archetype
)[0];

// 2. Execute attack
const result = combatSystem.resolveAttack(
  player,
  opponent,
  selectedTechnique
);

// 3. Check if hit
if (result.hit && result.animation) {
  // 4. Play skeletal animation
  const animConfig = getAnimation(result.animation.animationName);
  playAnimation(player, animConfig, result.animation.speedModifier);

  // 5. Display technique name
  showTechniqueName(
    result.animation.techniqueDisplayName,
    selectedTechnique.name.english,
    result.animation.duration,
    result.isCritical
  );

  // 6. Apply damage after animation frames (12 frames @ 60fps = 200ms)
  setTimeout(() => {
    applyDamageToPlayer(opponent, result.damage);
  }, 200); // Attack frame timing

  // 7. Hide technique name after full animation
  setTimeout(() => {
    hideTechniqueName();
  }, result.animation.duration);
}
```

## 🧪 Testing

### Unit Tests

Run technique name display tests:

```bash
npm test -- src/components/combat/components/TechniqueNameDisplay.test.tsx
```

### Integration Testing

```typescript
import { CombatSystem } from "./systems/CombatSystem";
import { MUSA_TECHNIQUES } from "./data/techniques";

describe("Technique Animation Integration", () => {
  it("should populate animation info in combat result", () => {
    const system = new CombatSystem();
    const technique = MUSA_TECHNIQUES[0]; // Thunder Strike

    const result = system.resolveAttack(attacker, defender, technique);

    expect(result.animation).toBeDefined();
    expect(result.animation.animationName).toBe("jab");
    expect(result.animation.speedModifier).toBeGreaterThanOrEqual(0.8);
    expect(result.animation.speedModifier).toBeLessThanOrEqual(1.2);
    expect(result.animation.duration).toBeGreaterThan(0);
  });
});
```

## 🔍 Debugging

### Check Animation Mapping

```typescript
import { determineAnimationTypeForTechnique } from "./systems/animation/TechniqueAnimationMapper";

// Test animation type determination
const animType = determineAnimationTypeForTechnique(
  "Thunder Strike",
  "musa_thunder_strike",
  "blunt"
);
console.log("Animation Type:", animType); // "punch_high"
```

### Verify Speed Calculation

```typescript
import { calculateSpeedModifierForDamage } from "./systems/animation/TechniqueAnimationMapper";

console.log("Light (15 damage):", calculateSpeedModifierForDamage(15)); // 1.2
console.log("Normal (25 damage):", calculateSpeedModifierForDamage(25)); // 1.0
console.log("Heavy (40 damage):", calculateSpeedModifierForDamage(40)); // 0.8
```

## 📝 Future Enhancements

### Priority 1: Add Missing Animations

Currently, some animation types reuse existing animations:
- Elbow strikes → Use jab animation (should have dedicated elbow animation)
- Knee strikes → Use front kick animation (should have dedicated knee animation)
- Pressure point rapid → Use jab animation (could have faster variant)

### Priority 2: Sound Integration

Link animation events to SFX:

```typescript
// Future implementation
animation: {
  type: AttackAnimationType.PUNCH_MID,
  speedModifier: 1.0,
  soundEffect: "punch_impact_heavy", // Link to audio system
}
```

### Priority 3: Camera Animation

Add camera shake/zoom for critical hits:

```typescript
if (result.isCritical) {
  triggerCameraShake(intensity: 0.5, duration: 200);
}
```

## 🎯 Summary

The technique-to-animation linking system is now fully implemented with:
- ✅ 12 animation type variants
- ✅ Automatic animation determination
- ✅ Speed modifiers (0.8x-1.2x)
- ✅ Korean technique name display
- ✅ CombatSystem integration
- ✅ Comprehensive tests

All 20 archetype techniques have animation configurations. The 70 Korean trigram techniques are auto-mapped via the TechniqueAnimationMapper system.

## 📚 Related Files

- `src/types/skeletal.ts` - Animation type definitions
- `src/types/technique.ts` - Technique interface with animation field
- `src/systems/animation/TechniqueAnimationMapper.ts` - Animation mapping logic
- `src/systems/animation/AttackAnimations.ts` - Skeletal animation definitions
- `src/systems/CombatSystem.ts` - Combat system with animation integration
- `src/data/techniques.ts` - Technique definitions with animations
- `src/components/combat/components/TechniqueNameDisplay.tsx` - UI component

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
