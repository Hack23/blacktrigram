# AI Movement System Architecture

## Overview

The AI movement system enables Player2 (AI-controlled opponent) to navigate the combat arena with strategic positioning based on distance, health status, and archetype combat style.

## Problem Statement (Original Issue)

**Symptom**: AI remained stationary during combat despite having functional AI systems.

**Root Cause**: State synchronization issue between AI movement logic and 3D rendering:
- AI DecisionTree generated movement actions (APPROACH, RETREAT, CIRCLE)
- moveAIPlayer calculated new positions and called onPlayerUpdate
- BUT: playerPositions state was never synchronized with Player2's updated position
- Result: 3D model rendered at stale position while AI "thought" it was moving

## Architecture

### Component Flow

```
┌─────────────────┐
│  DecisionTree   │ Generate movement decisions based on:
│                 │ - Distance to opponent
│                 │ - Health/stamina status
└────────┬────────┘ - Archetype behavior patterns
         │
         ▼
┌─────────────────┐
│   useAICombat   │ Execute AI decisions:
│                 │ - Convert decisions to actions
│                 │ - Select techniques and vital points
└────────┬────────┘ - Trigger movement with target positions
         │
         ▼
┌─────────────────┐
│  executeAction  │ Route action to handler:
│                 │ - attack → handleAIAttack
│                 │ - approach/retreat/circle → moveAIPlayer
└────────┬────────┘ - feint → special movement logic
         │
         ▼
┌─────────────────┐
│  moveAIPlayer   │ Calculate movement:
│                 │ - Interpolate toward target (4px/frame)
│                 │ - Clamp to arena boundaries
└────────┬────────┘ - Call onPlayerUpdate(1, {position})
         │
         ▼
┌─────────────────┐
│ CombatScreen3D  │ Update state:
│                 │ - players[1].position updated by parent
│                 │ - player2Position derived via useMemo
└────────┬────────┘ - player2Position3D calculated for rendering
         │
         ▼
┌─────────────────┐
│ Player3DUnified │ Render at new position
│                 │ - Uses player2Position3D
│                 │ - Animation synced (walk/idle)
└─────────────────┘
```

### State Management

**Player1 Position** (Player-controlled):
```typescript
const [player1Position, setPlayer1Position] = useState<Position>({ x, y });

// Updated by usePlayerMovement hook
usePlayerMovement({
  onPositionChange: (newPos) => {
    setPlayer1Position(newPos);
    onPlayerUpdate(0, { position: newPos });
  }
});
```

**Player2 Position** (AI-controlled):
```typescript
// Derived from players prop (updated by parent via onPlayerUpdate)
const player2Position = useMemo<Position>(() => {
  if (players.length >= 2 && players[1].position) {
    return players[1].position;
  }
  return defaultPosition; // Fallback
}, [players, arenaBounds]);

// AI movement updates parent state:
moveAIPlayer(targetPos) → onPlayerUpdate(1, {position: newPos})
→ players[1].position updated → player2Position recomputed
```

**Combined Positions**:
```typescript
// For backward compatibility with existing code
const playerPositions = useMemo<Position[]>(() => {
  return [player1Position, player2Position];
}, [player1Position, player2Position]);
```

### Animation Synchronization

**Player2 Animation** (walks when moving):
```typescript
useEffect(() => {
  const currentPos = playerPositions[1];
  const prevPos = prevPlayer2PositionRef.current;
  
  // Detect movement by comparing positions
  const isMoving =
    Math.abs(currentPos.x - prevPos.x) > 0.5 ||
    Math.abs(currentPos.y - prevPos.y) > 0.5;
  
  if (isMoving) {
    // AI is moving - transition to walk
    if (player2Animation.currentState !== "walk" && 
        player2Animation.currentState !== "attack") {
      player2Animation.transitionTo("walk");
    }
  } else {
    // AI stopped - return to idle
    if (player2Animation.currentState === "walk") {
      player2Animation.transitionTo("idle");
    }
  }
  
  prevPlayer2PositionRef.current = currentPos;
}, [playerPositions, player2Animation]);
```

## Movement Patterns by Archetype

### 무사 (Musa) - Traditional Warrior
- **Pattern**: Aggressive charging
- **Optimal Range**: 1-2 cells (40-80px)
- **Behavior**: 70% direct approach to opponent
- **Movement Bias**: 2.0x forward pressure
- **Philosophy**: Honor demands facing opponent directly

```typescript
if (personality.archetype === PlayerArchetype.MUSA && Math.random() < 0.7) {
  approachPos = calculateDirectApproach(context); // Straight line
}
```

### 암살자 (Amsalja) - Shadow Assassin
- **Pattern**: Flanking and circling
- **Optimal Range**: 1-2 cells (40-80px)
- **Behavior**: 40% flanking/diagonal approaches
- **Movement Bias**: 1.5x mobility
- **Philosophy**: Strike from unexpected angles

```typescript
if (personality.archetype === PlayerArchetype.AMSALJA && Math.random() < 0.4) {
  approachPos = calculateFlankingApproach(context); // Perpendicular offset
}
```

### 해커 (Hacker) - Cyber Warrior
- **Pattern**: Distance maintenance
- **Optimal Range**: 3-4 cells (120-160px)
- **Behavior**: Stays at mid-range, rarely closes distance
- **Movement Bias**: 0.8x conservative approach
- **Philosophy**: Analyze from safe distance

```typescript
if (behavior.movementPattern === "analytical" && 
    Math.abs(distance - optimalRange) < 50) {
  // Maintain position, circle instead of closing
  return { action: AIActionType.CIRCLE, ... };
}
```

### 정보요원 (Jeongbo Yowon) - Intelligence Operative
- **Pattern**: Strategic positioning
- **Optimal Range**: 2-3 cells (80-120px)
- **Behavior**: Calculated approaches, creates tactical space
- **Movement Bias**: 1.0x balanced
- **Philosophy**: Control the engagement distance

### 조직폭력배 (Jojik Pokryeokbae) - Organized Crime
- **Pattern**: Unpredictable
- **Optimal Range**: 2 cells (80px)
- **Behavior**: Randomized tactics (33% attack, 33% circle, 33% approach)
- **Movement Bias**: 1.3x variable
- **Philosophy**: Keep opponent guessing

```typescript
if (behavior.movementPattern === "unpredictable") {
  const randomAction = tacticRoll < 0.33 ? "attack" : 
                       tacticRoll < 0.66 ? "circle" : "approach";
}
```

## Distance-Based Movement Logic

### Approach (Too Far)
```typescript
if (distance > optimalRange * 1.8) {
  return { action: AIActionType.APPROACH, targetPosition: ... };
}
```

### Retreat (Critical Health)
```typescript
if (healthPercent < tacticalRetreatThreshold) {
  return { action: AIActionType.RETREAT, targetPosition: ... };
}
```

### Circle (Mid-Range)
```typescript
if (distance > optimalRange * 1.2 && distance < optimalRange * 1.8) {
  return { action: AIActionType.CIRCLE, targetPosition: ... };
}
```

### Maintain Position (Optimal Range)
```typescript
if (Math.abs(distance - optimalRange) < 50) {
  return { action: AIActionType.WAIT, ... };
}
```

## Movement Calculations

### Direct Approach (Straight Line)
```typescript
const dx = opponent.x - ai.x;
const dy = opponent.y - ai.y;
const distance = Math.sqrt(dx * dx + dy * dy);
const step = Math.min(MOVE_STEP_SIZE, distance);

newPos = {
  x: ai.x + (dx / distance) * step,
  y: ai.y + (dy / distance) * step
};
```

### Flanking Approach (Perpendicular)
```typescript
const perpX = -dy / distance; // Perpendicular vector
const perpY = dx / distance;
const flankOffset = 40 + Math.random() * 20;
const flankSide = Math.random() < 0.5 ? 1 : -1;

newPos = {
  x: opponent.x + perpX * flankOffset * flankSide,
  y: opponent.y + perpY * flankOffset * flankSide
};
```

### Retreat (Away from Opponent)
```typescript
const retreatDistance = 150;
const nx = (ai.x - opponent.x) / distance;
const ny = (ai.y - opponent.y) / distance;

newPos = {
  x: ai.x + nx * retreatDistance,
  y: ai.y + ny * retreatDistance
};
```

### Arena Boundary Clamping
```typescript
clampToArenaBounds(position, arenaBounds) {
  return {
    x: Math.max(
      arenaBounds.x,
      Math.min(
        arenaBounds.x + arenaBounds.width - ARENA_MARGIN_X,
        position.x
      )
    ),
    y: Math.max(
      arenaBounds.y,
      Math.min(
        arenaBounds.y + arenaBounds.height - ARENA_MARGIN_Y,
        position.y
      )
    )
  };
}
```

## Performance Characteristics

- **Decision Frequency**: 50ms (20 decisions/second)
- **Movement Step Size**: 4 pixels per update
- **Target Decision Time**: <10ms (measured via performance.now())
- **Animation Frame Rate**: 60fps (via useFrame hook)
- **Position Update Threshold**: 0.5px (prevents micro-movements)

## Testing

### Unit Tests
- `AIMovement.test.ts`: 12 tests covering movement decision logic
- `useCombatActions.test.ts`: 3 tests for moveAIPlayer functionality
- `CombatScreen3D.test.tsx`: 18 integration tests

### Test Scenarios

**Distance Closing**:
```typescript
// AI at (900, 400), Player at (100, 400)
// Expected: AI moves west toward player over 3-4 seconds
```

**Defensive Retreat**:
```typescript
// AI health < 30%, pain > 50
// Expected: AI moves away from player to 3+ cell distance
```

**Archetype Flanking (Amsalja)**:
```typescript
// AI archetype: Amsalja
// Expected: 40% of movements use diagonal paths
```

**Stamina Management**:
```typescript
// AI stamina < 10
// Expected: Movement frequency reduces, actions prioritized
```

## Known Limitations

1. **Pathfinding**: Uses direct line movement, no obstacle avoidance
2. **Collision**: No player-player collision detection (players can overlap)
3. **Prediction**: AI doesn't predict player movement patterns
4. **Terrain**: No terrain-based movement penalties (flat arena)

## Future Enhancements

1. **Visual Feedback**: 
   - Combat log messages for AI movement ("AI approaching", "AI circling")
   - Dust particle effects on movement
   - Motion blur trails

2. **Advanced Pathfinding**:
   - A* pathfinding for complex environments
   - Obstacle avoidance
   - Cover-based positioning

3. **Adaptive Movement**:
   - Learn from player movement patterns
   - Counter player's preferred positioning
   - Bait and punish strategies

4. **Environmental Interaction**:
   - Ring-out mechanics (push opponent out of bounds)
   - Wall-pin techniques
   - Corner pressure strategies

## Debugging

### Common Issues

**AI Not Moving**:
```typescript
// Check 1: Is round started?
console.log("Round started:", combatState.roundStarted);

// Check 2: Is AI decision tree generating movement actions?
console.log("AI action:", decision.action, decision.targetPosition);

// Check 3: Is onPlayerUpdate being called?
console.log("Player2 position update:", players[1].position);

// Check 4: Is player2Position derived correctly?
console.log("Derived position:", player2Position);
```

**Animation Not Syncing**:
```typescript
// Check position change detection threshold
const positionChanged = 
  Math.abs(currentPos.x - prevPos.x) > 0.5 || // Threshold too high?
  Math.abs(currentPos.y - prevPos.y) > 0.5;
```

**Boundary Issues**:
```typescript
// Verify arena bounds and margins
console.log("Arena bounds:", arenaBounds);
console.log("Margins:", ARENA_MARGIN_X, ARENA_MARGIN_Y);
console.log("Clamped position:", clampedPosition);
```

## References

- **Game Design**: `game-design.md` (Sections 2.1-2.3)
- **AI Systems**: `src/systems/ai/DecisionTree.ts`
- **Movement Hook**: `src/components/combat/hooks/useCombatActions.ts`
- **Combat Screen**: `src/components/combat/CombatScreen3D.tsx`
- **Player Archetypes**: `game-design.md#player-archetypes`
- **Korean Philosophy**: Traditional I Ching (팔괘/八卦) trigram system

## Conclusion

The AI movement system successfully integrates strategic positioning with Korean martial arts philosophy. Each archetype exhibits distinct movement patterns that reflect their combat style, creating engaging and realistic opponent behavior. The state synchronization fix ensures that AI decisions translate into visible movement, making combat dynamic and tactical.

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*
