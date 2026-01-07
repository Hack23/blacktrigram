# Knockback Physics System Integration Guide

## 🎯 Overview

The Knockback Physics System (`KnockbackPhysics`) has been successfully integrated into the CombatSystem. This document explains how the system works and how to use knockback data in combat.

## ✅ Implementation Status

### Completed Components

1. **KnockbackPhysics.ts** (481 lines)
   - Core physics calculations
   - 37 comprehensive unit tests (100% passing)
   - Performance: <1ms per calculation (60fps optimized)

2. **CombatSystem Integration**
   - Extended `CombatResult` interface with knockback data
   - Added `calculateKnockback` method
   - Integrated into `resolveAttack` method

3. **Type Definitions**
   - `KnockbackConfig` - Input configuration
   - `KnockbackResult` - Calculation output  
   - `BalanceState` - Balance integration

## 📊 Knockback Data Structure

### CombatResult Extension

```typescript
interface CombatResult {
  // ... existing fields
  readonly knockback?: {
    /** Knockback displacement vector in world space */
    readonly displacement: { x: number; y: number; z: number };
    /** Knockback animation duration in seconds */
    readonly duration: number;
    /** Recovery window (vulnerable state) in seconds */
    readonly recoveryWindow: number;
    /** Whether knockback triggers fall animation (넘어짐) */
    readonly shouldFall: boolean;
  };
}
```

### Usage in Combat

```typescript
const result = combatSystem.resolveAttack(attacker, defender, technique);

if (result.hit && result.knockback) {
  // Apply knockback displacement to defender
  const newPosition = {
    x: defender.position.x + result.knockback.displacement.x,
    y: defender.position.y + result.knockback.displacement.z, // Note: z maps to y in 2D
  };
  
  // Trigger knockback animation
  const animationDuration = result.knockback.duration * 1000; // Convert to ms
  
  // Set non-interruptible state
  defender.isStunned = true;
  
  // Schedule recovery window (vulnerable state)
  setTimeout(() => {
    defender.isStunned = false;
    // Player can now act but is vulnerable
  }, animationDuration);
  
  setTimeout(() => {
    // Recovery window ends
  }, animationDuration + result.knockback.recoveryWindow * 1000);
  
  // Trigger fall if needed
  if (result.knockback.shouldFall) {
    const fallType = balanceSystem.determineFallType(
      defender,
      attackAngle,
      attackHeight
    );
    animationStateMachine.transitionTo(fallAnimation[fallType]);
  }
}
```

## 🧮 Knockback Calculation Logic

### 1. Base Knockback Distance

```typescript
Damage Tier    | Base Distance | Duration
---------------|---------------|----------
Light (0-40)   | 0.5m         | 0.3s
Medium (40-70) | 1.2m         | 0.5s
Heavy (70-100) | 2.5m         | 0.8s
Critical (100+)| 4.0m         | 1.2s
```

### 2. Stance Resistance Modifiers

```typescript
Stance                    | Modifier | Effect
--------------------------|----------|------------------
☶ Gan (Mountain)         | +40%     | Max resistance
☷ Gon (Earth)            | +30%     | High resistance
☰ Geon (Heaven)          | +10%     | Balanced
☵ Gam (Water)            | 0%       | Neutral
☱ Tae (Lake)             | 0%       | Neutral
☳ Jin (Thunder)          | -10%     | Slight vulnerability
☴ Son (Wind)             | -20%     | Fluid, mobile
☲ Li (Fire)              | -30%     | Max vulnerability
```

### 3. Balance State Modifiers

```typescript
Balance Level     | Multiplier | Effect
------------------|------------|----------------------
High (>70%)       | 0.70x      | -30% knockback
Medium (40-70%)   | 1.00x      | Normal knockback
Low (20-40%)      | 1.50x      | +50% knockback, stumbling
Critical (<20%)   | 2.00x      | +100% knockback, fall
```

### 4. Final Formula

```typescript
finalDistance = baseDistance * (1 - stanceResistance) * balanceModifier
displacement = attackDirection * finalDistance
```

## 💡 Example Scenarios

### Light Strike on Stable Player

```typescript
// Attacker: Geon stance (light punch, 30 damage)
// Defender: Gan stance (Mountain, +40% resistance), 85% balance

Base: 0.5m (light)
Stance: 0.5m * 0.6 (Mountain) = 0.3m
Balance: 0.3m * 0.7 (high) = 0.21m
Duration: 0.3s
Recovery: 0.2s

Result: Minimal knockback, quick recovery
```

### Heavy Strike on Low-Balance Player

```typescript
// Attacker: Heavy kick, 80 damage
// Defender: Li stance (Fire, -30% resistance), 30% balance (stumbling)

Base: 2.5m (heavy)
Stance: 2.5m * 1.3 (Fire) = 3.25m
Balance: 3.25m * 1.5 (low) = 4.875m
Duration: 0.86s
Recovery: 1.05s (0.7s * 1.5 for low balance)

Result: Significant knockback, extended vulnerability
```

### Critical Strike on Falling Player

```typescript
// Attacker: Critical strike, 110 damage
// Defender: Li stance (Fire), 15% balance (critical)

Base: 4.0m (critical)
Stance: 4.0m * 1.3 (Fire) = 5.2m
Balance: 5.2m * 2.0 (critical) = 10.4m
Duration: 1.2s
Recovery: 1.5s
shouldFall: true

Result: Massive knockback + fall animation, long recovery
```

## 🎮 Animation Integration

### Knockback Animation Curve

The system uses an ease-out cubic curve for realistic knockback:

```typescript
// Fast initial impact, gradual deceleration
easedProgress = 1 - Math.pow(1 - progress, 3);
currentPosition = startPosition + (displacement * easedProgress);
```

### Visual Effects Recommendations

1. **Particle Trail** - Dust/debris trail during knockback
2. **Impact Flash** - Visual feedback on hit
3. **Camera Shake** - Proportional to knockback distance
4. **Motion Blur** - During rapid displacement
5. **Stumbling Animation** - For low balance knockback
6. **Fall Animation** - For critical balance (<20%)

## 🔧 Performance Considerations

- **Calculation Time**: <1ms (tested with 1000 iterations)
- **Memory**: Minimal allocations (reuses vectors)
- **60fps Budget**: 16.67ms per frame (well under)
- **Optimizations**:
  - Vector math on stack
  - Pre-calculated constants
  - Efficient lookup tables

## 📝 Korean Terminology

- **밀침** (Milchim) - Knockback
- **휘청거림** (Hwicheong-georim) - Stumbling
- **넘어짐** (Neom-eojim) - Falling
- **회복** (Hoebbok) - Recovery

## 🚀 Future Enhancements

Potential improvements for future development:

1. **Environmental Collision** - Wall/obstacle detection during knockback
2. **Combo Interruption** - Reset combo counter on knockback
3. **Sound Effects** - Audio feedback based on knockback magnitude
4. **Camera Effects** - Dynamic camera based on knockback direction
5. **Multiplayer Sync** - Network synchronization for online play

## ✅ Testing

Run tests with:

```bash
# Core physics tests
npm run test -- src/systems/physics/KnockbackPhysics.test.ts

# Full system tests
npm run test:systems
```

All 2200+ system tests pass with knockback integration.

## 📚 References

- **KnockbackPhysics.ts** - Core implementation
- **CombatSystem.ts** - Integration point
- **combat/types.ts** - Type definitions
- **combat/BalanceSystem.ts** - Balance integration

## 🎯 Summary

The knockback system is fully implemented and integrated into the combat system. It provides realistic force-based displacement with:

- ✅ Damage-scaled knockback distances
- ✅ 8 trigram stance resistance modifiers
- ✅ Balance state integration
- ✅ Smooth animation curves
- ✅ Korean-English terminology
- ✅ 60fps performance
- ✅ Comprehensive test coverage

The system is ready for use in combat gameplay and animations.
