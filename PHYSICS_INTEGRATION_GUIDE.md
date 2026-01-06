# Physics Movement Integration for Existing Components

**Korean**: 기존 컴포넌트 물리 이동 통합 (Existing Component Physics Movement Integration)

This guide shows how to enable physics-based movement in CombatScreen3D, TrainingScreen3D, and CombatSystem using the enhanced `usePlayerMovement` hook.

## Quick Integration

The existing `usePlayerMovement` hook now supports optional physics-based movement. Simply add the `usePhysics` flag and physics parameters:

### Before (Basic Movement)
```typescript
const { playerPosition, isMoving } = usePlayerMovement({
  initialPosition: { x: 100, y: 400 },
  bounds: { x: 0, y: 0, width: 1200, height: 800 },
  onPositionChange: (pos) => onPlayerUpdate({ position: pos }),
});
```

### After (Physics-Based Movement)
```typescript
const { playerPosition, isMoving, velocity, speed } = usePlayerMovement({
  initialPosition: { x: 100, y: 400 },
  bounds: { x: 0, y: 0, width: 1200, height: 800 },
  onPositionChange: (pos) => onPlayerUpdate({ position: pos }),
  
  // ✨ Enable physics-based movement
  usePhysics: true,
  currentStance: player.currentStance,
  legInjuryFactor: calculateLegInjury(player.bodyPartHealth),
  isRunning: pressedKeys.has('Shift'),
  useTacticalSteps: false,
});
```

---

## CombatScreen3D Integration

Update `src/components/combat/CombatScreen3D.tsx`:

```typescript
// Around line 588 - Update the usePlayerMovement call
const { 
  isMoving: player1IsMoving,
  playerPosition: player1PositionFromMovement,
  velocity,
  speed,
} = usePlayerMovement({
  initialPosition: { x: 100, y: height / 2 - 90 },
  bounds: { x: 0, y: 0, width, height },
  onPositionChange: (newPosition) => {
    onPlayerUpdate(0, { position: newPosition });
  },
  enabled: !isPaused && !isRoundTransitioning && gamePhase === "active",
  moveSpeed: 200,
  
  // ✨ Physics-based movement
  usePhysics: true,
  currentStance: player1.currentStance,
  legInjuryFactor: calculateLegInjuryFactor(player1),
  isRunning: false, // Can be connected to Shift key or button
});

// Helper function to calculate leg injury
function calculateLegInjuryFactor(player: PlayerState): number {
  if (!player.bodyPartHealth) return 0;
  
  const leftLeg = player.bodyPartHealth.leftLeg ?? player.maxHealth;
  const rightLeg = player.bodyPartHealth.rightLeg ?? player.maxHealth;
  const maxLeg = player.maxHealth;
  
  const averageLegHealth = (leftLeg + rightLeg) / (2 * maxLeg);
  return 1.0 - averageLegHealth; // 0 = healthy, 1 = critical
}
```

### Optional: Display Speed in HUD

Add speed feedback to the player HUD:

```typescript
// In the PlayerHUD component
{speed !== undefined && speed > 0.1 && (
  <div style={{
    fontSize: isMobile ? 10 : 12,
    color: KOREAN_COLORS.TEXT_SECONDARY,
    fontFamily: FONT_FAMILY.KOREAN,
  }}>
    속도 | Speed: {speed.toFixed(1)} m/s
  </div>
)}
```

---

## TrainingScreen3D Integration

Update `src/components/training/TrainingScreen3D.tsx`:

```typescript
// Around line 189 - Update the usePlayerMovement call
const { 
  playerPosition, 
  isMoving,
  velocity,
  speed,
} = usePlayerMovement({
  initialPosition: playerState.position,
  bounds: { x: 0, y: 0, width, height },
  onPositionChange: (newPosition) => {
    onPlayerUpdate({ position: newPosition });
  },
  enabled: !isPaused,
  moveSpeed: 300,
  
  // ✨ Physics-based movement
  usePhysics: true,
  currentStance: playerState.currentStance,
  legInjuryFactor: 0, // No injury in training mode
  isRunning: false,
  useTacticalSteps: tacticalMode, // Can be toggled with 'T' key
});
```

### Optional: Tactical Step Mode in Training

Add a toggle for tactical step mode (30cm grid):

```typescript
const [tacticalMode, setTacticalMode] = useState(false);

// Add keyboard handler
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 't' || e.key === 'T') {
      setTacticalMode(prev => !prev);
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);

// Display grid when tactical mode is active
{tacticalMode && (
  <Html fullscreen>
    <div style={{
      position: 'absolute',
      top: 10,
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '8px 16px',
      background: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
      border: `2px solid ${KOREAN_COLORS.ACCENT_GOLD}`,
      borderRadius: '4px',
      fontFamily: FONT_FAMILY.KOREAN,
      color: KOREAN_COLORS.TEXT_PRIMARY,
    }}>
      ⚡ 전술 보법 | Tactical Steps Active
    </div>
  </Html>
)}
```

---

## CombatSystem Integration

The CombatSystem can access physics data through the player state. Update injury calculations to affect movement:

```typescript
// In CombatSystem.ts
import { MovementPhysics } from './physics/MovementPhysics';

// Add to class
private readonly movementPhysics = new MovementPhysics();

// When applying damage to legs
public applyLegDamage(player: PlayerState, damage: number): PlayerState {
  // ... existing damage logic ...
  
  // Calculate new leg injury factor
  const leftLeg = updatedPlayer.bodyPartHealth?.leftLeg ?? player.maxHealth;
  const rightLeg = updatedPlayer.bodyPartHealth?.rightLeg ?? player.maxHealth;
  const legInjuryFactor = 1.0 - ((leftLeg + rightLeg) / (2 * player.maxHealth));
  
  // Get current max speed with injury penalty
  const maxSpeed = this.movementPhysics.getMaxSpeed(
    false, // not running
    updatedPlayer.currentStance,
    legInjuryFactor
  );
  
  console.log(`Leg injury: ${(legInjuryFactor * 100).toFixed(0)}%, Max speed: ${maxSpeed.toFixed(2)} m/s`);
  
  return updatedPlayer;
}
```

---

## Features You Get

### ✅ Realistic Acceleration
- 0 → 2m/s in 0.5 seconds (4.0 m/s²)
- Smooth velocity curves, no instant movement

### ✅ Realistic Deceleration
- 2m/s → 0 in 0.3 seconds (6.67 m/s²)
- Quick stopping for combat reactions

### ✅ Stance-Based Speed Modifiers
| Stance | Korean | Speed Modifier |
|--------|--------|----------------|
| ☰ 건 (Geon) | Heaven | 100% |
| ☱ 태 (Tae) | Lake | 110% |
| ☲ 리 (Li) | Fire | 120% |
| ☳ 진 (Jin) | Thunder | 115% |
| ☴ 손 (Son) | Wind | 125% (fastest) |
| ☵ 감 (Gam) | Water | 105% |
| ☶ 간 (Gan) | Mountain | 80% (slowest) |
| ☷ 곤 (Gon) | Earth | 85% |

### ✅ Injury System Integration
- Leg damage reduces speed 0-50%
- Automatically calculated from body part health
- Smooth speed reduction as damage accumulates

### ✅ Tactical Steps (Optional)
- 30cm grid quantization
- Precise positioning for vital point attacks
- Toggle on/off with 'T' key

---

## Testing

Run the existing test suite - no changes needed:

```bash
npm run test:systems  # All 2,175 tests should pass
npm run test -- src/systems/physics/  # Physics-specific tests
```

---

## Performance Notes

- **Zero overhead when disabled**: Physics is only calculated when `usePhysics: true`
- **60fps maintained**: Physics updates use requestAnimationFrame
- **Memory efficient**: Reuses Three.js vectors, no allocations in hot path
- **Backward compatible**: Existing code works without changes

---

## Migration Checklist

For each screen component:

- [ ] Add `usePhysics: true` to usePlayerMovement config
- [ ] Pass `currentStance` from player state
- [ ] Calculate `legInjuryFactor` from body part health
- [ ] Optional: Add `isRunning` toggle (Shift key)
- [ ] Optional: Add `useTacticalSteps` mode
- [ ] Optional: Display speed/velocity in HUD
- [ ] Test movement feels realistic
- [ ] Verify stance changes affect speed
- [ ] Verify injury reduces speed appropriately

---

## Korean Terminology

**이동속도** (idong sokdo) - Movement speed  
**가속도** (gasokdo) - Acceleration  
**감속도** (gamsokdo) - Deceleration  
**보법** (bobeop) - Footwork  
**전술보법** (jeonsul bobeop) - Tactical steps  
**다리부상** (dari busang) - Leg injury  

---

## Troubleshooting

### Movement feels too slow/fast
Adjust the position scaling factor in `inputSystem.ts`:
```typescript
// Line ~97: Adjust the 100 multiplier
position: new THREE.Vector3(initialPosition.x / 100, 0, initialPosition.y / 100)
```

### Stance changes don't affect speed
Ensure `currentStance` prop is updated reactively:
```typescript
// This should be in a useEffect or passed as a prop
currentStance: player.currentStance,
```

### Injury doesn't reduce speed
Check the `legInjuryFactor` calculation:
```typescript
const legHealth = (leftLeg + rightLeg) / (2 * maxHealth);
const legInjuryFactor = 1.0 - legHealth; // Must be 0-1

console.log('Leg injury factor:', legInjuryFactor); // Debug
```

---

## Next Steps

Once physics movement is working:
1. **Animation Blending**: Connect velocity to footstep animations
2. **Dash Mechanic**: Add burst movement with momentum
3. **Stamina Integration**: Reduce speed when stamina is low
4. **Arena Boundaries**: Add collision detection with arena edges
5. **Footstep Audio**: Play sounds based on movement speed

---

**흑괘의 길을 걸어라** - Walk the Path of the Black Trigram
