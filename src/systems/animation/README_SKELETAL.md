# Skeletal Animation System

**흑괘 골격 애니메이션 시스템** - Articulated body model with realistic martial arts animations

## Overview

The skeletal animation system provides a complete humanoid rig with 30 bones for realistic fighter animations. It supports keyframe-based animations with interpolation for smooth martial arts movements including punches, kicks, and defensive stances.

## Architecture

### Components

1. **Bone Hierarchy** (`SkeletonRig.ts`)
   - 30-bone humanoid rig with articulated joints
   - Root: pelvis (center of mass)
   - Spine: 3 segments (lower, middle, upper)
   - Arms: shoulder → upper arm → elbow → forearm → wrist → hand (×2)
   - Legs: hip → thigh → knee → shin → ankle → foot (×2)
   - Head: neck → head

2. **Animation System** (`AttackAnimations.ts`)
   - 7 pre-defined animation clips
   - Keyframe-based with automatic interpolation
   - Attack animations: jab, cross, front kick, roundhouse kick
   - Defensive animations: block
   - Stance animations: idle, fighting stance

3. **Renderer** (`SkeletalPlayer3D.tsx`)
   - Three.js-based bone rendering
   - Real-time keyframe interpolation (60fps)
   - Simplified hand geometry with 5 fingers per hand
   - Optional debug visualization

## Usage

### Basic Example

```tsx
import { Canvas } from '@react-three/fiber';
import { SkeletalPlayer3D } from './components/three/SkeletalPlayer3D';
import { KOREAN_COLORS } from './types/constants';

function MyScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <SkeletalPlayer3D
        playerId="fighter1"
        position={[0, 0, 0]}
        currentAnimation="jab"
        bodyColor={KOREAN_COLORS.PRIMARY_CYAN}
        showHands={true}
      />
    </Canvas>
  );
}
```

### Animation Control

```tsx
import { useState } from 'react';
import { SkeletalPlayer3D } from './components/three/SkeletalPlayer3D';

function AnimatedFighter() {
  const [animation, setAnimation] = useState('idle');

  const performJab = () => setAnimation('jab');
  const performCross = () => setAnimation('cross');
  const performBlock = () => setAnimation('block');

  return (
    <>
      <SkeletalPlayer3D
        playerId="fighter1"
        currentAnimation={animation}
        position={[0, 0, 0]}
      />
      
      <div>
        <button onClick={performJab}>Jab</button>
        <button onClick={performCross}>Cross</button>
        <button onClick={performBlock}>Block</button>
      </div>
    </>
  );
}
```

### Creating Custom Animations

```typescript
import { AnimationClip, BoneTransform } from '../types/skeletal';
import * as THREE from 'three';

// Helper function for creating bone transforms
const transform = (
  boneName: string,
  rotation: [number, number, number],
  position?: [number, number, number]
): BoneTransform => ({
  boneName: boneName as any,
  rotation: new THREE.Euler(...rotation),
  position: position ? new THREE.Vector3(...position) : undefined,
});

// Define custom animation
export const CUSTOM_KICK: AnimationClip = {
  name: 'custom_kick',
  duration: 0.4,
  loop: false,
  keyframes: [
    // Chambering phase (0.0-0.15s)
    {
      time: 0.1,
      transforms: [
        transform('hip_R', [0.6, 0, 0]),    // Hip flexion
        transform('knee_R', [0, 0, 1.5]),   // Knee bent
      ],
    },
    // Extension phase (0.15-0.25s)
    {
      time: 0.2,
      transforms: [
        transform('hip_R', [0.4, 0, 0]),
        transform('knee_R', [0, 0, 0.2]),   // Leg extends
        transform('shin_R', [0, 0, 0], [0, 0, 0.4]), // Forward motion
      ],
    },
    // Return to stance (0.25-0.4s)
    {
      time: 0.4,
      transforms: [
        transform('hip_R', [0, 0, 0]),
        transform('knee_R', [0, 0, 0]),
      ],
    },
  ],
};
```

### Direct Bone Manipulation

```typescript
import { createHumanoidRig, updateBoneWorldMatrices } from '../systems/animation/SkeletonRig';

// Create rig
const rig = createHumanoidRig();

// Get specific bone
const rightElbow = rig.bones.get('elbow_R');

// Modify bone rotation (bend elbow)
if (rightElbow) {
  rightElbow.rotation.z = -1.5; // Bend 90 degrees
}

// Update world matrices (required after modifications)
updateBoneWorldMatrices(rig.root);
```

## Animation Clips

### Attack Animations

| Animation | Duration | Description |
|-----------|----------|-------------|
| `jab` | 0.3s | Right straight punch with elbow extension |
| `cross` | 0.35s | Left power punch with torso rotation |
| `front_kick` | 0.4s | Forward kick with knee chamber and extension |
| `roundhouse_kick` | 0.5s | Circular kick with hip rotation |

### Defensive Animations

| Animation | Duration | Description |
|-----------|----------|-------------|
| `block` | 0.2s | Arms raised in defensive guard position |

### Stance Animations

| Animation | Duration | Description |
|-----------|----------|-------------|
| `idle` | 2.0s (loop) | Subtle breathing animation |
| `fighting_stance` | 1.0s (loop) | Active combat stance with guard up |

## Performance

The skeletal system is optimized for 60fps gameplay:

- **Bone count**: 30 bones (maximum for performance target)
- **Update time**: <5ms for world matrix updates
- **Animation interpolation**: <2ms per frame
- **Memory**: ~8KB per rig instance

### Performance Tips

1. **Reuse rigs**: Clone rigs for multiple characters instead of creating new ones
2. **Limit bone updates**: Only update bones that are actually animated
3. **Use LOD**: Switch to simpler geometry at distance
4. **Optimize keyframes**: Fewer keyframes = faster interpolation

```typescript
import { cloneRig } from '../systems/animation/SkeletonRig';

// Create one rig and clone it for multiple fighters
const baseRig = createHumanoidRig();
const fighter1Rig = cloneRig(baseRig);
const fighter2Rig = cloneRig(baseRig);
```

## Testing

The skeletal system has 100% test coverage for core functionality:

```bash
# Run skeletal system tests
npm test -- src/systems/animation/SkeletonRig.test.ts
npm test -- src/systems/animation/AttackAnimations.test.ts
npm test -- src/components/three/SkeletalPlayer3D.test.tsx
```

### Test Coverage

- ✅ Bone creation and hierarchy: 100%
- ✅ World matrix transformations: 100%
- ✅ Animation keyframes: 100%
- ✅ Rig utilities (clone, reset): 100%
- ⚠️ Component rendering: 7% (WebGL-dependent, requires E2E tests)

## Bone Names Reference

### Core Structure
- `pelvis` - Root bone (center of mass)
- `spine_lower`, `spine_middle`, `spine_upper` - Spine chain
- `neck`, `head` - Head chain

### Arms (Left)
- `shoulder_L`, `upper_arm_L`, `elbow_L`, `forearm_L`, `wrist_L`, `hand_L`

### Arms (Right)
- `shoulder_R`, `upper_arm_R`, `elbow_R`, `forearm_R`, `wrist_R`, `hand_R`

### Legs (Left)
- `hip_L`, `thigh_L`, `knee_L`, `shin_L`, `ankle_L`, `foot_L`

### Legs (Right)
- `hip_R`, `thigh_R`, `knee_R`, `shin_R`, `ankle_R`, `foot_R`

## Coordinate System

- **Y-up**: Vertical axis
- **X-axis**: Left (-) to Right (+)
- **Z-axis**: Back (-) to Front (+)
- **Rotations**: Euler angles in radians
- **Units**: Meters (1 unit = 1 meter)

## Integration with Game Systems

### Combat System Integration

```typescript
import { SkeletalPlayer3D } from './components/three/SkeletalPlayer3D';
import { useCombat } from './hooks/useCombat';

function CombatScene() {
  const { executeAttack, currentStance } = useCombat();

  const handleAttackComplete = () => {
    // Animation completed, handle game logic
    executeAttack();
  };

  return (
    <SkeletalPlayer3D
      playerId="player1"
      currentAnimation={getAnimationForAttack(currentStance)}
      onAnimationComplete={handleAttackComplete}
    />
  );
}
```

## Future Enhancements

Planned improvements for the skeletal system:

1. **Inverse Kinematics (IK)**: Foot placement on uneven terrain
2. **Procedural Animation**: Dynamic weight shift and balance
3. **Animation Blending**: Smooth transitions between animations
4. **Hit Reactions**: Dynamic response to impacts
5. **Cloth Physics**: Clothing and equipment simulation
6. **Finger Articulation**: Full finger bone chains for hand gestures

## Korean Martial Arts Context

The skeletal system is designed specifically for authentic Korean martial arts:

- **팔괘 (Palgwae)**: Eight trigram stances
- **급소격 (Geupsogyeok)**: Vital point striking
- **정격자 (Jeonggyeokja)**: Precision striking techniques
- **비수 (Bisu)**: Lethal hand techniques

All animations are based on traditional Korean martial arts movements adapted for realistic 3D gameplay.

## License

Part of Black Trigram (흑괘) - Licensed under the project's main license.
