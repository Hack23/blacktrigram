# Speed Modifier System - Usage Examples

**Korean**: 속도 변경 시스템 사용 예시

This document demonstrates how to integrate and use the Speed Modifier System with the Movement Physics system and SpeedIndicatorHUD component.

## Table of Contents

- [Basic Integration](#basic-integration)
- [Complete Combat Scene Integration](#complete-combat-scene-integration)
- [Using SpeedIndicatorHUD](#using-speedindicatorhud)
- [Performance Considerations](#performance-considerations)

## Basic Integration

### Step 1: Import Required Systems

```typescript
import { SpeedModifierSystem, MovementType } from '@/systems/physics/SpeedModifierSystem';
import { MovementPhysics } from '@/systems/physics/MovementPhysics';
import type { PlayerState } from '@/systems/player';
```

### Step 2: Initialize Systems

```typescript
// Initialize systems (typically done once at component mount)
const speedModifierSystem = new SpeedModifierSystem();
const movementPhysics = new MovementPhysics();
```

### Step 3: Calculate and Apply Speed Modifiers

```typescript
// In your game loop or movement update function
function updatePlayerMovement(
  playerState: PlayerState,
  movementInput: MovementInput,
  deltaTime: number
) {
  // Determine movement type based on input
  const movementType = movementInput.isRunning 
    ? MovementType.RUNNING 
    : MovementType.WALKING;
  
  // Calculate speed modifiers based on player state
  const speedModifiers = speedModifierSystem.calculateSpeedModifiers(
    playerState,
    movementType,
    false // isCrouching
  );
  
  // Apply modifiers to movement physics
  speedModifierSystem.applySpeedModifiers(movementPhysics, speedModifiers);
  
  // Update movement with physics system
  movementPhysics.updateMovement(movementState, movementInput, deltaTime);
  
  // Optional: Clear overrides after use if you want to return to default behavior
  // movementPhysics.clearOverrides();
  
  return speedModifiers; // Return for UI display
}
```

## Complete Combat Scene Integration

Here's a full example of integrating the SpeedModifierSystem into a combat scene:

```typescript
import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { SpeedModifierSystem, MovementType } from '@/systems/physics/SpeedModifierSystem';
import { MovementPhysics, MovementState } from '@/systems/physics/MovementPhysics';
import { SpeedIndicatorHUD } from '@/components/combat/components/SpeedIndicatorHUD';
import type { PlayerState } from '@/systems/player';
import * as THREE from 'three';

interface CombatSceneProps {
  readonly playerState: PlayerState;
  readonly isMobile: boolean;
}

export const CombatScene: React.FC<CombatSceneProps> = ({
  playerState,
  isMobile,
}) => {
  // Initialize systems (memoized to avoid recreating)
  const speedModifierSystem = useMemo(() => new SpeedModifierSystem(), []);
  const movementPhysics = useMemo(() => new MovementPhysics(), []);
  
  // Movement state (mutable for performance)
  const movementState = useRef<MovementState>({
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    acceleration: 0,
    maxSpeed: 2.0,
    currentStance: playerState.currentStance,
    legInjuryFactor: 0,
  });
  
  // Track current speed modifiers for UI
  const [speedModifiers, setSpeedModifiers] = React.useState({
    finalSpeed: 2.0,
    baseSpeed: 2.0,
  });
  
  // Movement input state
  const movementInput = useRef({
    forward: 0,
    lateral: 0,
    isRunning: false,
    isMoving: false,
    useTacticalSteps: false,
  });
  
  // Update movement in game loop
  useFrame((state, delta) => {
    // Clamp delta to avoid instability
    const safeDelta = Math.min(delta, 1 / 30);
    
    // Determine movement type
    const movementType = movementInput.current.isRunning 
      ? MovementType.RUNNING 
      : MovementType.WALKING;
    
    // Calculate speed modifiers based on current player state
    const modifiers = speedModifierSystem.calculateSpeedModifiers(
      playerState,
      movementType,
      false // isCrouching (could be derived from player state)
    );
    
    // Apply modifiers to movement physics
    speedModifierSystem.applySpeedModifiers(movementPhysics, modifiers);
    
    // Update movement state
    movementState.current.currentStance = playerState.currentStance;
    movementState.current.legInjuryFactor = calculateLegInjuryFactor(playerState);
    
    // Update movement with physics
    movementPhysics.updateMovement(
      movementState.current,
      movementInput.current,
      safeDelta
    );
    
    // Update speed modifiers for UI (throttled to avoid excessive re-renders)
    if (state.clock.elapsedTime % 0.1 < safeDelta) {
      setSpeedModifiers({
        finalSpeed: modifiers.finalSpeed,
        baseSpeed: modifiers.baseSpeed,
      });
    }
  });
  
  // Helper to calculate leg injury factor
  const calculateLegInjuryFactor = useCallback((player: PlayerState): number => {
    if (!player.bodyPartHealth || !player.bodyPartMaxHealth) {
      return 0;
    }
    
    const leftLegPercent = player.bodyPartHealth.legLeft / player.bodyPartMaxHealth.legLeft;
    const rightLegPercent = player.bodyPartHealth.legRight / player.bodyPartMaxHealth.legRight;
    const avgLegHealth = (leftLegPercent + rightLegPercent) / 2;
    
    // Convert to injury factor (0 = healthy, 1 = fully injured)
    return 1.0 - avgLegHealth;
  }, []);
  
  return (
    <>
      {/* 3D Game Scene */}
      <group position={movementState.current.position}>
        {/* Player character mesh */}
      </group>
      
      {/* Speed Indicator HUD */}
      <Html fullscreen>
        <SpeedIndicatorHUD
          finalSpeed={speedModifiers.finalSpeed}
          baseSpeed={speedModifiers.baseSpeed}
          position="left"
          isMobile={isMobile}
          visible={true}
        />
      </Html>
    </>
  );
};
```

## Using SpeedIndicatorHUD

### Basic Usage

```typescript
import { SpeedIndicatorHUD } from '@/components/combat/components/SpeedIndicatorHUD';

// In your React component
<SpeedIndicatorHUD
  finalSpeed={modifiers.finalSpeed}  // From SpeedModifierSystem
  baseSpeed={modifiers.baseSpeed}    // From SpeedModifierSystem
  position="left"                     // "left" or "right"
  isMobile={isMobile}                 // Responsive layout
  visible={true}                      // Show/hide indicator
/>
```

### Integration with Combat HUD

```typescript
import { SpeedIndicatorHUD } from '@/components/combat/components/SpeedIndicatorHUD';
import { HealthBar, StaminaBar } from '@/components/combat/components';

export const CombatHUD: React.FC<Props> = ({ playerState, speedModifiers }) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Other HUD elements */}
      <HealthBar health={playerState.health} maxHealth={playerState.maxHealth} />
      <StaminaBar stamina={playerState.stamina} maxStamina={playerState.maxStamina} />
      
      {/* Speed Indicator */}
      <SpeedIndicatorHUD
        finalSpeed={speedModifiers.finalSpeed}
        baseSpeed={speedModifiers.baseSpeed}
        position="left"
        isMobile={false}
      />
    </div>
  );
};
```

### Color-Coded Speed States

The SpeedIndicatorHUD automatically color-codes speed percentages:

- **Green (가속 | BOOSTED)**: 100%+ speed (stance boost like Wind stance)
- **Cyan (양호 | GOOD)**: 80-99% speed (slight reduction)
- **Yellow (감소 | REDUCED)**: 50-79% speed (moderate reduction)
- **Orange (저하 | SLOWED)**: 25-49% speed (heavy reduction)
- **Red (위급 | CRITICAL)**: <25% speed (critical reduction, near immobile)

## Performance Considerations

### Calculation Frequency

For optimal performance at 60fps:

1. **Calculate modifiers once per frame** in the game loop
2. **Update UI less frequently** (e.g., every 100ms) to reduce React re-renders
3. **Reuse system instances** - don't create new SpeedModifierSystem on every frame

### Example: Throttled UI Updates

```typescript
// In game loop
useFrame((state, delta) => {
  // Calculate modifiers every frame for physics
  const modifiers = speedModifierSystem.calculateSpeedModifiers(...);
  speedModifierSystem.applySpeedModifiers(movementPhysics, modifiers);
  
  // Update UI only every 100ms (10 times per second)
  if (state.clock.elapsedTime % 0.1 < delta) {
    setSpeedModifiersForUI(modifiers);
  }
});
```

### Memory Management

```typescript
// Initialize systems once
const speedModifierSystem = useMemo(() => new SpeedModifierSystem(), []);

// Clean up if needed
useEffect(() => {
  return () => {
    movementPhysics.clearOverrides();
  };
}, [movementPhysics]);
```

## Testing Speed Modifiers

### Example: Testing Stance Effects

```typescript
import { SpeedModifierSystem, MovementType } from '@/systems/physics/SpeedModifierSystem';
import { TrigramStance } from '@/types/common';

const system = new SpeedModifierSystem();

// Test Wind stance (fastest at 125%)
const windStanceModifiers = system.calculateSpeedModifiers(
  { ...playerState, currentStance: TrigramStance.SON },
  MovementType.WALKING
);

console.log('Wind stance speed:', windStanceModifiers.finalSpeed); // ~2.5 m/s (125%)

// Test Mountain stance (slowest at 80%)
const mountainStanceModifiers = system.calculateSpeedModifiers(
  { ...playerState, currentStance: TrigramStance.GAN },
  MovementType.WALKING
);

console.log('Mountain stance speed:', mountainStanceModifiers.finalSpeed); // ~1.6 m/s (80%)
```

### Example: Testing Injury Effects

```typescript
// Simulate moderate leg injury (50% health)
const injuredPlayer = {
  ...playerState,
  bodyPartHealth: {
    ...playerState.bodyPartHealth,
    legLeft: 50,
    legRight: 50,
  },
};

const modifiers = system.calculateSpeedModifiers(
  injuredPlayer,
  MovementType.WALKING
);

console.log('Injured speed:', modifiers.finalSpeed); // ~1.6 m/s (20% penalty)
console.log('Injury penalty:', modifiers.injuryPenalty); // ~0.2
```

### Example: Testing Stamina Effects

```typescript
// Simulate depleted stamina (<10%)
const exhaustedPlayer = {
  ...playerState,
  stamina: 5,
  maxStamina: 100,
};

const modifiers = system.calculateSpeedModifiers(
  exhaustedPlayer,
  MovementType.WALKING
);

console.log('Can run:', modifiers.canRun); // false
console.log('Acceleration penalty:', modifiers.staminaPenalty); // 0.75 (75% reduced)
console.log('Final acceleration:', modifiers.finalAcceleration); // 1.0 m/s² (25% of base)
```

## Summary

The Speed Modifier System provides:

1. ✅ **Comprehensive speed calculations** based on stance, injury, stamina, and combat state
2. ✅ **Easy integration** with existing MovementPhysics system
3. ✅ **Visual feedback** through SpeedIndicatorHUD component
4. ✅ **60fps performance** with optimized calculations
5. ✅ **Korean martial arts theming** with bilingual support

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
