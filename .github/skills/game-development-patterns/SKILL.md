---
name: game-development-patterns
description: |
  Enforces game development best practices for Black Trigram including game loop patterns,
  state management, combat system architecture, animation timing, deterministic physics,
  and 60fps performance targets for Korean martial arts combat gameplay.
license: MIT
---

# Game Development Patterns Skill

## Purpose

This skill ensures that all game development in Black Trigram follows industry-standard game architecture patterns, maintains deterministic combat logic, achieves consistent 60fps performance, and creates engaging Korean martial arts gameplay experiences with proper state management and timing.

## When to Apply

**Automatically trigger this skill when:**
- Implementing game loops with `useFrame`
- Creating combat systems or state machines
- Managing game state (player, enemies, combat flow)
- Implementing animations or timing-dependent logic
- Working with fixed timesteps or delta time
- Creating game events and action queues
- Implementing turn-based or real-time combat
- Managing game progression and victory/defeat conditions
- Debugging timing or synchronization issues
- Optimizing game performance or reducing lag

## Core Principles

### 1. Game Loop Architecture

**ALWAYS use proper game loop patterns with clamped delta:**

✅ **Standard Game Loop with Delta Clamping**
```typescript
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

// Maximum allowed frame time (prevents spiral of death)
const MAX_DELTA = 1 / 30; // 33ms maximum frame time

interface GameLoopOptions {
  readonly maxDelta?: number;
  readonly enabled?: boolean;
}

export function useGameLoop(
  update: (delta: number) => void,
  options: GameLoopOptions = {}
) {
  const { maxDelta = MAX_DELTA, enabled = true } = options;
  
  useFrame((_state, delta) => {
    if (!enabled) return;
    
    // Clamp delta to prevent spiral of death
    const safeDelta = Math.min(delta, maxDelta);
    
    update(safeDelta);
  });
}

// Usage in combat scene
export const CombatScene: React.FC = () => {
  useGameLoop((delta) => {
    updatePlayerPosition(delta);
    updateEnemyAI(delta);
    checkCollisions();
    updateAnimations(delta);
  });
  
  return <CombatArena3D />;
};
```

❌ **Anti-Pattern: Unclamped Delta Time**
```typescript
// BAD: Can cause spiral of death with large frame times
useFrame((_state, delta) => {
  // If frame takes 1 second, entities will teleport!
  entity.position.x += velocity * delta; // ❌
});
```

### 2. Fixed Timestep for Deterministic Physics

**ALWAYS use fixed timestep for combat logic and physics:**

✅ **Fixed Timestep Implementation**
```typescript
const FIXED_TIMESTEP = 1 / 60; // 60 Hz for deterministic simulation
const MAX_ACCUMULATOR = 0.25; // Prevent accumulator overflow

export function useFixedTimestep(
  updatePhysics: (dt: number) => void
) {
  const accumulatorRef = useRef(0);
  
  useFrame((_state, delta) => {
    // Clamp incoming delta
    const frameDelta = Math.min(delta, MAX_ACCUMULATOR);
    
    // Accumulate time
    accumulatorRef.current += frameDelta;
    
    // Limit accumulator to prevent runaway
    accumulatorRef.current = Math.min(
      accumulatorRef.current,
      MAX_ACCUMULATOR
    );
    
    // Run fixed updates
    while (accumulatorRef.current >= FIXED_TIMESTEP) {
      updatePhysics(FIXED_TIMESTEP);
      accumulatorRef.current -= FIXED_TIMESTEP;
    }
  });
}

// Usage for combat physics
export const CombatPhysics: React.FC = () => {
  useFixedTimestep((dt) => {
    // Deterministic combat calculations
    calculateStrikeDamage(dt);
    resolveCollisions(dt);
    updateVitalPointTargeting(dt);
  });
  
  return null;
};
```

❌ **Anti-Pattern: Variable Timestep for Physics**
```typescript
// BAD: Physics results depend on frame rate
useFrame((_state, delta) => {
  // Different FPS = different combat outcomes ❌
  applyForce(entity, force * delta);
  resolveCollision(entity1, entity2, delta);
});
```

### 3. Game State Machine Architecture

**ALWAYS use clear state machines for game flow:**

✅ **Robust State Machine Pattern**
```typescript
type GameState =
  | { state: 'intro'; selectedArchetype?: string }
  | { state: 'menu'; currentOption: number }
  | { state: 'combat'; combatId: string; round: number }
  | { state: 'paused'; previous: GameState }
  | { state: 'victory'; winner: string; rewards: Reward[] }
  | { state: 'defeat'; reason: string; canRetry: boolean };

type GameEvent =
  | { type: 'START_GAME'; archetype: string }
  | { type: 'NAVIGATE_MENU'; option: number }
  | { type: 'START_COMBAT'; combatId: string }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'PLAYER_VICTORY'; winner: string; rewards: Reward[] }
  | { type: 'PLAYER_DEFEAT'; reason: string; canRetry: boolean }
  | { type: 'RETRY_COMBAT' }
  | { type: 'RETURN_TO_MENU' };

export function gameStateReducer(
  state: GameState,
  event: GameEvent
): GameState {
  switch (state.state) {
    case 'intro':
      if (event.type === 'START_GAME') {
        return { state: 'menu', currentOption: 0 };
      }
      return state;
      
    case 'menu':
      if (event.type === 'NAVIGATE_MENU') {
        return { ...state, currentOption: event.option };
      }
      if (event.type === 'START_COMBAT') {
        return { 
          state: 'combat', 
          combatId: event.combatId, 
          round: 1 
        };
      }
      return state;
      
    case 'combat':
      if (event.type === 'PAUSE') {
        return { state: 'paused', previous: state };
      }
      if (event.type === 'PLAYER_VICTORY') {
        return { 
          state: 'victory', 
          winner: event.winner, 
          rewards: event.rewards 
        };
      }
      if (event.type === 'PLAYER_DEFEAT') {
        return { 
          state: 'defeat', 
          reason: event.reason, 
          canRetry: event.canRetry 
        };
      }
      return state;
      
    case 'paused':
      if (event.type === 'RESUME') {
        return state.previous;
      }
      if (event.type === 'RETURN_TO_MENU') {
        return { state: 'menu', currentOption: 0 };
      }
      return state;
      
    case 'victory':
    case 'defeat':
      if (event.type === 'RETURN_TO_MENU') {
        return { state: 'menu', currentOption: 0 };
      }
      if (event.type === 'RETRY_COMBAT' && state.state === 'defeat') {
        return { state: 'menu', currentOption: 0 };
      }
      return state;
      
    default:
      return state;
  }
}

// Hook wrapper
export function useGameStateMachine(initialState: GameState) {
  const [state, dispatch] = useReducer(gameStateReducer, initialState);
  return { state, dispatch };
}
```

❌ **Anti-Pattern: Unstructured State**
```typescript
// BAD: Hard to maintain and debug
const [isMenu, setIsMenu] = useState(false);
const [isCombat, setIsCombat] = useState(false);
const [isPaused, setIsPaused] = useState(false);
// What if multiple states are true? ❌
```

## Enforcement Rules

### Rule 1: Game Loop Delta Clamping
```
IF (useFrame without delta clamping OR delta > 1/30)
THEN (reject with: "Apply delta clamping to prevent spiral of death")
ELSE (verify MAX_DELTA constant is defined)
```

### Rule 2: Fixed Timestep for Physics
```
IF (physics or combat calculations use variable delta)
THEN (apply fixed timestep pattern with accumulator)
ELSE (verify FIXED_TIMESTEP = 1/60 for 60Hz simulation)
```

### Rule 3: State Machine Enforcement
```
IF (game state uses multiple boolean flags OR unstructured state)
THEN (reject with: "Use discriminated union state machine pattern")
ELSE (verify all state transitions are explicit)
```

### Rule 4: Combat Logic Separation
```
IF (combat logic mixed with rendering OR UI OR audio)
THEN (separate into layers: state, actions, rules, events)
ELSE (verify CombatRulesEngine handles all damage calculations)
```

## Anti-Patterns to REJECT

❌ **Spiral of Death** - Unclamped delta causing performance degradation  
❌ **Frame-Rate Dependent Logic** - Gameplay changes with FPS  
❌ **Global Mutable State** - Hard to debug and test  
❌ **Mixed Concerns** - Logic, rendering, audio intertwined

## Compliance Framework

### ISO 27001:2022 Alignment
- **A.8.1**: Asset Management - Proper game state and resource management

### NIST Cybersecurity Framework 2.0
- **ID.AM**: Asset Management - Track game entities and resources

### CIS Controls v8.1
- **CIS Control 2**: Inventory and Control of Software Assets

## Remember

**흑괘의 게임 철학 (Black Trigram Game Philosophy)**

Master the game loop, master the combat. Delta-time independence, deterministic physics, and 60fps performance are the foundation of authentic Korean martial arts gameplay.

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
