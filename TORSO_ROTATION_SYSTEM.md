# Torso Rotation System

## Overview

The torso rotation system enables independent upper and lower body movement in Black Trigram, allowing realistic Korean martial arts techniques where the upper body can face opponents while the lower body moves in different directions (strafing).

## Key Features

- **Independent Rotation**: Torso can rotate ±90° relative to hip alignment
- **Anatomical Constraints**: Automatic clamping to prevent unrealistic twisting
- **Smooth Interpolation**: 200ms (12 frames at 60fps) smooth rotation
- **Power Modifiers**: Hip rotation contributes 10-30% damage bonus to strikes
- **Performance Optimized**: Maintains 60fps with multiple characters

## Korean Terminology

- **허리회전 (Heorhwoejeon)**: Torso rotation
- **상체비틀기 (Sangchebiteulgi)**: Upper body twist
- **골반회전 (Golbanhwoejeon)**: Hip/pelvis rotation
- **파워배율 (Pawo Baeyul)**: Power multiplier

## Core Components

### 1. Torso Rotation Calculation

Calculate torso rotation to face opponent while moving:

```typescript
import { calculateTorsoRotation, TORSO_CONSTRAINTS } from '@/systems/animation';
import * as THREE from 'three';

// Player at origin, opponent to the right, hips facing forward
const playerPos = new THREE.Vector3(0, 0, 0);
const opponentPos = new THREE.Vector3(5, 0, 0);
const moveDir = new THREE.Vector3(0, 0, 1); // Moving forward
const hipRotation = 0; // Hips facing forward (Z+)

const torsoRotation = calculateTorsoRotation(
  playerPos,
  opponentPos,
  moveDir,
  hipRotation
);

// torsoRotation = π/2 (90°) - torso rotated right to face opponent
console.log(`Torso rotation: ${(torsoRotation * 180 / Math.PI).toFixed(1)}°`);
```

### 2. Hip Rotation Power Modifier

Calculate damage bonus from proper hip engagement:

```typescript
import { calculateHipRotationPowerModifier } from '@/systems/animation';

// Full rotation on strike technique
const strikeModifier = calculateHipRotationPowerModifier(Math.PI / 2, 'strike');
console.log(`Strike damage: ${(strikeModifier * 100 - 100).toFixed(0)}% bonus`);
// Output: "Strike damage: 30% bonus"

// Partial rotation on throw
const throwModifier = calculateHipRotationPowerModifier(Math.PI / 4, 'throw');
console.log(`Throw damage: ${(throwModifier * 100 - 100).toFixed(0)}% bonus`);
// Output: "Throw damage: 5% bonus"
```

### 3. Integration with Body Facing System

The torso rotation is integrated into the `BodyFacing` interface:

```typescript
import { createDefaultBodyFacing, type BodyFacing } from '@/systems/animation';

// Create body facing state with torso rotation support
const bodyFacing: BodyFacing = createDefaultBodyFacing(0);

// The bodyFacing object now includes:
// - torsoRotation: number (radians, relative to hips)
// - hipRotation: number (radians, base rotation)
```

### 4. Visual Rendering Integration

The `SkeletalPlayer3D` component automatically applies torso rotation:

```typescript
// In SkeletalPlayer3D useFrame hook:
if (bodyFacing) {
  const spine = rig.bones.get("spine_upper");
  if (spine) {
    // Use torso rotation if available, otherwise use full body facing
    const torsoRotation = bodyFacing.torsoRotation ?? getFacingAngleRadians(bodyFacing);
    spine.rotation.y = torsoRotation;
  }
}
```

### 5. Damage Calculation Integration

Hip rotation modifier is integrated into damage calculation:

```typescript
import { DamageCalculator } from '@/systems/vitalpoint/DamageCalculator';

// Calculate enhanced damage with hip rotation
const damageResult = DamageCalculator.calculateEnhancedVitalPointDamage(
  attackerState,
  defenderState,
  technique,
  vitalPointHit,
  currentHour,
  meridianStates,
  hipRotationAngle // New parameter for hip rotation in radians
);

// Hip rotation automatically applies 10-30% damage bonus
```

## Constants and Constraints

```typescript
import { TORSO_CONSTRAINTS } from '@/systems/animation';

// Maximum/minimum torso rotation (±90° = ±π/2 radians)
TORSO_CONSTRAINTS.MAX_ROTATION // π/2 radians (90°)
TORSO_CONSTRAINTS.MIN_ROTATION // -π/2 radians (-90°)

// Smooth interpolation time
TORSO_CONSTRAINTS.INTERPOLATION_TIME // 0.2 seconds (200ms)

// Power modifier range
TORSO_CONSTRAINTS.POWER_MODIFIER_RANGE // [0.10, 0.30] (10%-30%)
```

## Anatomical Constraints

The system enforces realistic anatomical limits:

- **Maximum Rotation**: ±90° (π/2 radians) from hip alignment
- **Automatic Clamping**: Values exceeding ±90° are automatically clamped
- **Angle Normalization**: Angles are normalized to -π to π range

```typescript
// Example: Attempting >90° rotation
const excessiveRotation = calculateTorsoRotation(
  playerPos,
  behindOpponentPos, // Opponent behind player
  moveDir,
  0
);

// Result is automatically clamped to MAX_ROTATION (π/2)
assert(Math.abs(excessiveRotation) <= TORSO_CONSTRAINTS.MAX_ROTATION);
```

## Performance Considerations

The torso rotation system is optimized for 60fps gameplay:

- **Efficient Calculations**: Uses optimized trigonometry and clamping
- **Smooth Interpolation**: 200ms timing provides natural feel without stutter
- **Minimal Overhead**: All calculations are O(1) complexity
- **Validated Performance**: Tested with multiple simultaneous character rotations

## Testing

Comprehensive test suite with 25+ test cases:

```bash
# Run torso rotation tests
npm test -- TorsoRotation.test.ts

# Run all animation tests (includes torso rotation)
npm test -- src/systems/animation/
```

## Usage Example: Complete Combat Scenario

```typescript
import { 
  calculateTorsoRotation, 
  calculateHipRotationPowerModifier,
  TORSO_CONSTRAINTS 
} from '@/systems/animation';
import * as THREE from 'three';

// Combat scenario: Player strafing left while facing opponent
function handleCombatMovement(
  playerPos: THREE.Vector3,
  opponentPos: THREE.Vector3,
  movementInput: { x: number, z: number }
) {
  // Calculate hip rotation from movement direction
  const hipRotation = Math.atan2(movementInput.x, movementInput.z);
  
  // Calculate torso rotation to face opponent
  const moveDir = new THREE.Vector3(movementInput.x, 0, movementInput.z).normalize();
  const torsoRotation = calculateTorsoRotation(
    playerPos,
    opponentPos,
    moveDir,
    hipRotation
  );
  
  // Calculate power modifier for potential strike
  const powerModifier = calculateHipRotationPowerModifier(
    Math.abs(torsoRotation),
    'strike'
  );
  
  return {
    hipRotation,
    torsoRotation,
    powerModifier,
    canStrike: Math.abs(torsoRotation) > TORSO_CONSTRAINTS.MAX_ROTATION * 0.5
  };
}
```

## Integration Checklist

When integrating torso rotation into gameplay:

- [ ] Calculate torso rotation based on opponent position
- [ ] Apply anatomical constraints (±90°)
- [ ] Use smooth interpolation for natural feel (200ms)
- [ ] Apply hip rotation power modifier to damage
- [ ] Update BodyFacing state with torso/hip rotations
- [ ] Render torso rotation on spine_upper bone
- [ ] Test performance with multiple characters
- [ ] Validate 60fps target is maintained

## Future Enhancements

Potential improvements for future development:

- **Dynamic Constraints**: Adjust rotation limits based on stamina/injuries
- **Stance-Specific Modifiers**: Different rotation ranges per trigram stance
- **Animation Blending**: Smooth transitions between torso rotation states
- **Visual Feedback**: UI indicators showing current torso rotation angle
- **Tutorial Integration**: Teach players about hip rotation power mechanics

## References

- **COMBAT_ARCHITECTURE.md**: Body mechanics documentation
- **SkeletonRig.ts**: Core rotation calculation functions
- **BodyFacingSystem.ts**: Body facing state management
- **DamageCalculator.ts**: Damage modifier integration
- **SkeletalPlayer3D.tsx**: Visual rendering implementation
