# Unified Player Animation State Manager

A frame-accurate animation system for Black Trigram, managing player animations at 60fps with priority-based interrupts and transition validation.

## 🎯 Features

- **8 Animation States**: idle, walk, run, attack, defend, hit, stance_change, ko
- **Frame-Accurate Timing**: Based on game-design.md specifications
  - Attack: 12 frames (200ms at 60fps)
  - Block: 4 frames (67ms at 60fps)
  - Stance change: 36 frames (600ms at 60fps)
- **Priority System**: Higher priority animations can interrupt lower priority ones
  - Priority order: ko > hit > attack > defend > stance_change > run > walk > idle
- **Transition Rules**: Validates state transitions (e.g., attack cannot transition directly to walk)
- **Event System**: Callbacks for animation start, specific frames, completion, and interruption
- **React Integration**: `usePlayerAnimation` hook with automatic re-renders
- **60fps Performance**: Optimized for multiple animated characters

## 📚 Core Components

### AnimationStateMachine.ts

Core state machine managing animation state, frame counting, and timing.

```typescript
const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS, {
  onAnimationStart: (state) => console.log(`Started: ${state}`),
  onFrame: (frame, state) => {
    if (state === "attack" && frame === 6) {
      executeAttack(); // Hit at midpoint
    }
  },
  onAnimationComplete: (state) => console.log(`Completed: ${state}`),
  onAnimationInterrupted: (from, to) => console.log(`${from} -> ${to}`),
});

// In game loop (useFrame)
useFrame((state, delta) => {
  const result = machine.update(delta);
  updateVisuals(result.state, result.frame);
});

// Trigger animations
machine.transitionTo("attack");
```

### AnimationPriority.ts

Priority system for animation interrupts.

```typescript
import { canInterrupt, getPriority } from "./AnimationPriority";

// Check if hit can interrupt attack
canInterrupt("attack", "hit", true); // true - hit has higher priority

// Get priority level
getPriority("hit"); // 6
getPriority("attack"); // 5
```

### AnimationTransitions.ts

Transition rules and validation.

```typescript
import { isTransitionAllowed, getValidTransitions } from "./AnimationTransitions";

// Check if transition is allowed
isTransitionAllowed("idle", "walk"); // true
isTransitionAllowed("attack", "walk"); // false - must return to idle first
isTransitionAllowed("ko", "idle"); // false - KO is terminal

// Get all valid transitions from a state
const validFromIdle = getValidTransitions("idle");
// Returns: ["walk", "run", "attack", "defend", "stance_change", "hit", "ko"]
```

### usePlayerAnimation Hook

React hook for animation state management.

```typescript
import { usePlayerAnimation } from "../../hooks/usePlayerAnimation";
import { useFrame } from "@react-three/fiber";

function CombatScreen() {
  const playerAnimation = usePlayerAnimation({
    events: {
      onAnimationStart: (state) => {
        console.log(`Animation started: ${state}`);
        audio.playSFX(`anim_${state}`);
      },
      onFrame: (frame, state) => {
        if (state === "attack" && frame === 6) {
          // Execute attack at midpoint (frame 6 of 12)
          executeCombatAttack();
        }
      },
      onAnimationComplete: (state) => {
        console.log(`Animation completed: ${state}`);
        if (state === "attack") {
          updateCombatState({ isExecutingTechnique: false });
        }
      },
    },
  });

  // Update in game loop
  useFrame((state, delta) => {
    const result = playerAnimation.update(delta);
    // result.state, result.frame, result.progress available
  });

  // Trigger animations from input
  const handleAttack = () => {
    const success = playerAnimation.transitionTo("attack");
    if (success) {
      updateCombatState({ isExecutingTechnique: true });
    }
  };

  const handleMovement = (isMoving: boolean) => {
    playerAnimation.transitionTo(isMoving ? "walk" : "idle");
  };

  // Pass animation state to 3D component
  return (
    <Player3DUnified
      currentAnimation={playerAnimation.currentState}
      // ... other props
    />
  );
}
```

## 🎮 Integration Guide

### CombatScreen3D Integration

```typescript
// 1. Initialize animation for each player
const player1Animation = usePlayerAnimation({ events: combatEvents });
const player2Animation = usePlayerAnimation({ events: aiEvents });

// 2. Update in useFrame
useFrame((state, delta) => {
  player1Animation.update(delta);
  player2Animation.update(delta);
});

// 3. Trigger from game events
const handleAttack = () => player1Animation.transitionTo("attack");
const handleDefend = () => player1Animation.transitionTo("defend");
const handleHit = () => player1Animation.transitionTo("hit");
const handleStanceChange = () => player1Animation.transitionTo("stance_change");

// 4. Handle movement
usePlayerMovement({
  onMoveStart: () => player1Animation.transitionTo("walk"),
  onMoveStop: () => player1Animation.transitionTo("idle"),
});

// 5. Pass to Player3DUnified
<Player3DUnified currentAnimation={player1Animation.currentState} />
```

### TrainingScreen3D Integration

```typescript
const playerAnimation = usePlayerAnimation({
  events: {
    onFrame: (frame, state) => {
      if (state === "attack" && frame === 6) {
        checkTrainingDummyHit();
      }
    },
  },
});

// Similar pattern to CombatScreen3D
```

## 📊 Animation Configurations

Default configurations based on game-design.md:

| Animation      | Frames | Duration (60fps) | Loop | Interruptible | Priority |
| -------------- | ------ | ---------------- | ---- | ------------- | -------- |
| idle           | 4      | 67ms             | Yes  | Yes           | 0        |
| walk           | 6      | 100ms            | Yes  | Yes           | 1        |
| run            | 8      | 133ms            | Yes  | Yes           | 2        |
| stance_change  | 36     | 600ms            | No   | No            | 3        |
| defend         | 4      | 67ms             | No   | Yes           | 4        |
| attack         | 12     | 200ms            | No   | Yes           | 5        |
| hit            | 4      | 67ms             | No   | No            | 6        |
| ko             | 30     | 500ms            | No   | No            | 7        |

## 🔧 Custom Configurations

```typescript
const customConfigs = new Map([
  [
    "attack",
    {
      state: "attack",
      frames: 16, // Longer attack
      fps: 60,
      loop: false,
      interruptible: true,
      priority: 5,
      duration: 16 / 60,
    },
  ],
]);

const animation = usePlayerAnimation({ customConfigs });
```

## 🎯 Priority System Examples

```typescript
// Hit interrupts attack (higher priority)
animation.transitionTo("attack"); // Success
animation.transitionTo("hit"); // Success - interrupts attack
console.log(animation.currentState); // "hit"

// Attack cannot interrupt hit (lower priority)
animation.transitionTo("hit"); // Success
animation.transitionTo("attack"); // Fails
console.log(animation.currentState); // Still "hit"

// KO is terminal
animation.transitionTo("ko"); // Success
animation.transitionTo("idle"); // Fails
animation.reset(); // Must reset to leave KO
```

## 🧪 Testing

Comprehensive test suite with 83 tests:

```bash
npm test -- src/systems/animation src/hooks/usePlayerAnimation.test.ts
```

Test coverage:

- AnimationPriority: 12 tests
- AnimationTransitions: 21 tests
- AnimationStateMachine: 29 tests
- usePlayerAnimation: 21 tests

## 📝 API Reference

### PlayerAnimationStateMachine

```typescript
class PlayerAnimationStateMachine {
  constructor(animations: Map<AnimationState, AnimationConfig>, events?: AnimationEvents);
  update(deltaTime: number): AnimationUpdateResult;
  transitionTo(newState: AnimationState): boolean;
  getCurrentState(): AnimationState;
  getCurrentFrame(): number;
  getPreviousState(): AnimationState | null;
  getCurrentAnimation(): AnimationConfig | undefined;
  reset(): void;
  getState(): AnimationMachineState;
}
```

### usePlayerAnimation Hook

```typescript
function usePlayerAnimation(options?: UsePlayerAnimationOptions): UsePlayerAnimationReturn;

interface UsePlayerAnimationReturn {
  readonly currentState: AnimationState;
  readonly currentFrame: number;
  readonly update: (deltaTime: number) => AnimationUpdateResult;
  readonly transitionTo: (newState: AnimationState) => boolean;
  readonly reset: () => void;
  readonly stateMachine: PlayerAnimationStateMachine;
}
```

### Animation Events

```typescript
interface AnimationEvents {
  readonly onAnimationStart?: (state: AnimationState) => void;
  readonly onFrame?: (frame: number, state: AnimationState) => void;
  readonly onAnimationComplete?: (state: AnimationState) => void;
  readonly onAnimationInterrupted?: (
    fromState: AnimationState,
    toState: AnimationState
  ) => void;
}
```

## 🚀 Performance

- **60fps Target**: Maintains consistent 60fps with multiple animated characters
- **Frame-Accurate**: Timing based on delta time with proper accumulation
- **Optimized**: Minimal allocations in hot paths, efficient state machine
- **Tested**: Performance test ensures 60 updates complete in < 100ms

## 📖 Additional Resources

- [IntegrationGuide.tsx](./IntegrationGuide.tsx) - Detailed integration examples
- [game-design.md](../../../game-design.md) - Combat timing specifications
- [Player3DUnified.tsx](../../components/three/Player3DUnified.tsx) - 3D player component
- [CombatScreen3D.tsx](../../components/combat/CombatScreen3D.tsx) - Combat screen implementation

## 🤝 Contributing

When adding new animations or modifying the system:

1. Update `AnimationState` type in types.ts
2. Add animation config to `DEFAULT_ANIMATION_CONFIGS`
3. Update `ANIMATION_PRIORITY_MAP` if needed
4. Add transition rules to `DEFAULT_TRANSITIONS`
5. Add tests for new animations
6. Update this README

## 📄 License

Part of the Black Trigram project. See main LICENSE file.
