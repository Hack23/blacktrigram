---
name: 3d-combat-systems
description: |
  Enforces 3D physics-based combat patterns for Black Trigram including Rapier physics,
  collision detection, attack/defense mechanics, damage calculations, hitbox accuracy,
  and realistic Korean martial arts combat in Three.js environments.
license: MIT
---

# 3D Combat Systems Skill

## Purpose

Ensures all 3D combat in Black Trigram uses proper physics-based mechanics, accurate collision detection, realistic damage calculations based on Eight Trigrams and vital points, and creates immersive Korean martial arts combat experiences in Three.js with @react-three/rapier.

## When to Apply

**Automatically trigger when:**
- Implementing physics-based combat with Rapier
- Creating collision detection systems
- Implementing attack/defense mechanics
- Calculating damage from strikes
- Creating hitboxes or hurtboxes
- Implementing blocking or parrying
- Adding knockback or stagger effects
- Testing combat balance

## Core Principles

### 1. Physics-Based Combat with Rapier

✅ **Proper Rapier Integration**
```typescript
import { RigidBody, CuboidCollider } from '@react-three/rapier';

export const CombatCharacter: React.FC<CharacterProps> = ({
  position,
  stance,
  onHit,
}) => {
  return (
    <RigidBody
      type="dynamic"
      position={position}
      userData={{ type: 'character', stance }}
      onCollisionEnter={(event) => {
        if (event.other.rigidBody?.userData?.type === 'attack') {
          const damage = calculateDamage(stance, event);
          onHit?.(damage);
        }
      }}
    >
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.5, 1.6, 16, 32]} />
        <meshStandardMaterial color={getStanceColor(stance)} />
      </mesh>
      <CuboidCollider args={[0.5, 1, 0.5]} />
    </RigidBody>
  );
};
```

### 2. Hitbox and Hurtbox System

✅ **Accurate Collision Zones**
```typescript
export const CombatHitboxes: React.FC = () => {
  return (
    <group>
      {/* Head hitbox - critical */}
      <CuboidCollider
        args={[0.15, 0.15, 0.15]}
        position={[0, 1.8, 0]}
        sensor
        onIntersectionEnter={(event) => {
          handleVitalPointHit('head', event);
        }}
      />
      
      {/* Torso hitbox - vital organs */}
      <CuboidCollider
        args={[0.3, 0.5, 0.2]}
        position={[0, 1.2, 0]}
        sensor
        onIntersectionEnter={(event) => {
          handleVitalPointHit('torso', event);
        }}
      />
    </group>
  );
};
```

### 3. Damage Calculation System

✅ **Comprehensive Damage Formula**
```typescript
export function calculateCombatDamage(
  attacker: CombatEntity,
  defender: CombatEntity,
  strikeData: StrikeData
): DamageResult {
  // Base damage from technique
  const baseDamage = strikeData.technique.baseDamage;
  
  // Trigram matchup multiplier
  const stanceMultiplier = getTrigramAdvantage(
    attacker.stance,
    defender.stance
  );
  
  // Vital point multiplier
  const vitalMultiplier = strikeData.vitalPoint
    ? getVitalPointMultiplier(strikeData.vitalPoint, attacker.stance)
    : 1.0;
  
  // Defense calculation
  const defenseValue = defender.isBlocking
    ? defender.defense * 2.0
    : defender.defense;
  
  // Final damage
  const rawDamage = baseDamage * stanceMultiplier * vitalMultiplier;
  const finalDamage = Math.max(0, rawDamage - defenseValue);
  
  return {
    damage: finalDamage,
    isCritical: vitalMultiplier > 2.0,
    isBlocked: defender.isBlocking && finalDamage < rawDamage * 0.5,
  };
}
```

## Enforcement Rules

### Rule 1: Physics-Based Combat
```
IF (combat uses direct position manipulation OR no physics engine)
THEN (implement Rapier physics with proper collision detection)
ELSE (verify realistic force application)
```

### Rule 2: Hitbox Accuracy
```
IF (hitboxes don't match character anatomy OR too large/small)
THEN (create anatomically accurate collision zones)
ELSE (verify vital point hitbox placement)
```

### Rule 3: Damage Calculation Determinism
```
IF (damage uses Math.random() OR non-deterministic factors)
THEN (use deterministic formula with stance/vital point multipliers)
ELSE (verify damage is reproducible)
```

## Anti-Patterns to REJECT

❌ **Random Damage** - No Math.random() in combat calculations
❌ **Single Hitbox** - Need separate zones for head/torso/limbs
❌ **No Physics** - Must use Rapier for realistic combat
❌ **Instant Hits** - Attacks should have travel time and collision

## Compliance Framework

- **ISO 27001 A.12.1**: Operational procedures for combat systems
- **NIST CSF PR.DS**: Data integrity in combat state
- **CIS Control 16**: Secure application patterns

## Remember

**물리 기반 전투 (Physics-Based Combat)**

Realistic Korean martial arts combat requires proper physics simulation, accurate hitboxes, and deterministic damage calculations.

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
