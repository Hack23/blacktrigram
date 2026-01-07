# Fall Animation System - Integration Guide

## Overview

The fall animation system is now fully integrated into the backend combat systems. This guide shows how to complete the frontend integration in `CombatScreen3D.tsx`.

## Backend Integration Status ✅

### Completed Components

1. **Fall Animation System**
   - 4 fall types with keyframes
   - Ground states with breathing loops
   - Animation state machine with auto-transitions
   - 64 passing tests

2. **Balance System Integration**
   - Automatically disrupts balance on hits
   - Recovers balance over time
   - Triggers falls at < 20% balance

3. **Consciousness System Integration**
   - Triggers falls at < 10% consciousness
   - Uses last impact angle for fall direction

4. **Combat System Integration**
   - BalanceSystem instantiated
   - Balance disruption in applyCombatResult()
   - Balance recovery in applyRecovery()
   - Public accessors available

## Frontend Integration (CombatScreen3D)

### Step 1: Import Fall Utilities

```typescript
import { checkForFall, isInFallOrGroundState } from "../../systems";
```

### Step 2: Add Fall Checking in Combat Update Loop

Find where player state is updated after combat (around applyCombatResult or player update effects). Add fall checking:

```typescript
// After combat result is applied to player
const fallCheck = checkForFall(
  updatedPlayer,
  combatSystem,
  undefined, // lastImpactAngle (optional)
  attackAngle // attackAngle (optional)
);

if (fallCheck.shouldFall && fallCheck.animationState) {
  // Trigger fall animation
  playerAnimation.transitionTo(fallCheck.animationState);
  
  // Optional: Add feedback
  console.log(`Player falling: ${fallCheck.reason} (${fallCheck.fallType})`);
  
  // Optional: Add combat message
  const fallName = getFallTypeName(fallCheck.fallType!);
  addCombatMessage(fallName.korean, fallName.english);
}
```

### Step 3: Prevent Actions During Falls

When checking if player can perform actions, add fall state check:

```typescript
const canAct = !isPaused && 
               !isInFallOrGroundState(playerAnimation.getCurrentState()) &&
               combatState.roundStarted && 
               !combatState.roundEnded;
```

### Step 4: Handle Fall Animation Completion

In animation event handlers, handle fall-to-ground transitions:

```typescript
onAnimationComplete: (state) => {
  // Fall animations automatically transition to ground states
  // via AnimationStateMachine, so no manual handling needed
  
  // Optional: Add feedback when hitting ground
  if (state.startsWith("fall_")) {
    playSFX("body_impact");
    // Future: Add camera shake, ground dust, etc.
  }
}
```

## Example: Complete Integration

```typescript
// In CombatScreen3D.tsx

// After resolving attack and updating player state
useEffect(() => {
  // Apply combat system recovery (includes balance recovery)
  const updatedPlayer1 = combatSystem.applyRecovery(validPlayers[0], deltaTime);
  const updatedPlayer2 = combatSystem.applyRecovery(validPlayers[1], deltaTime);
  
  // Check for falls
  const player1Fall = checkForFall(updatedPlayer1, combatSystem);
  const player2Fall = checkForFall(updatedPlayer2, combatSystem);
  
  if (player1Fall.shouldFall && player1Fall.animationState) {
    player1Animation.transitionTo(player1Fall.animationState);
  }
  
  if (player2Fall.shouldFall && player2Fall.animationState) {
    player2Animation.transitionTo(player2Fall.animationState);
  }
  
  // Update players
  onPlayerUpdate(0, updatedPlayer1);
  onPlayerUpdate(1, updatedPlayer2);
}, [/* dependencies */]);
```

## Fall Triggering Conditions

### Balance-Based Falls
- Triggered when `player.balance < 20%`
- Uses attack angle to determine fall direction
- Fallback to stance-based direction if no attack angle

### Consciousness-Based Falls  
- Triggered when `player.consciousness < 10%`
- Uses last impact angle if available
- Default to backward fall (natural collapse)

## Animation States

### Fall States (Non-looping)
- `fall_forward` (24 frames, 400ms)
- `fall_backward` (30 frames, 500ms)
- `fall_side_left` (27 frames, 450ms)
- `fall_side_right` (27 frames, 450ms)

### Ground States (Looping)
- `ground_prone` (face down)
- `ground_supine` (face up)
- `ground_side_left` (left side)
- `ground_side_right` (right side)

## Impact Frames

Fall impact occurs at specific frames for effects:
- Forward: Frame 18
- Backward: Frame 22
- Side: Frame 20

Use `getImpactFrame(fallType)` from FallAnimations to get impact frame for effects.

## Korean Terminology

- **낙법** (Nakbeop): Falling technique
- **기상** (Gisang): Rising from ground
- **전방낙법** (Jeonbang Nakbeop): Forward fall
- **후방낙법** (Hubang Nakbeop): Backward fall
- **측방낙법** (Cheukbang Nakbeop): Side fall
- **균형상실** (Gyunhyeong Sangsil): Balance loss
- **의식상실** (Uisik Sangsil): Consciousness loss

## Testing

After integration, test:
1. **Balance falls**: Multiple leg strikes should cause fall
2. **Consciousness falls**: Heavy head strikes should cause fall
3. **Fall direction**: Verify correct fall animation for attack angle
4. **Ground states**: Falls should auto-transition to ground
5. **Performance**: Should maintain 60fps during falls

## Next Steps

1. Add fall checking to CombatScreen3D combat loop
2. Test fall triggering with leg sweeps and head strikes
3. Optional: Add impact effects (camera shake, audio, particles)
4. Optional: Add recovery animations from ground states

## References

- `src/systems/combat/FallIntegration.ts` - Fall checking utilities
- `src/systems/animation/FallAnimations.ts` - Fall keyframes and logic
- `src/systems/combat/BalanceSystem.ts` - Balance fall triggers
- `src/systems/combat/ConsciousnessSystem.ts` - Consciousness fall triggers
- `COMBAT_ARCHITECTURE.md` - Complete system documentation
