# Physics Movement Integration Guide

**Korean**: 물리 이동 통합 가이드 (Physics Movement Integration Guide)

This guide shows how to integrate the physics-based movement system into your Black Trigram game components.

## Quick Start

### 1. Basic Player with Physics Movement

The simplest way to add physics-based movement to a 3D player:

```typescript
import { PhysicsPlayer3D } from '@/components/three/PhysicsPlayer3D';
import { TrigramStance } from '@/types/common';

function MyGameScene() {
  const [stance, setStance] = useState(TrigramStance.GEON);
  const [legInjury, setLegInjury] = useState(0);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      
      <PhysicsPlayer3D
        stance={stance}
        legInjuryFactor={legInjury}
        showVelocity={true}
      />
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </Canvas>
  );
}
```

**Controls:**
- `W` - Move forward
- `S` - Move backward
- `A` - Strafe left
- `D` - Strafe right
- `Shift` - Run (hold while moving)

### 2. Custom Player Component with Physics

If you need more control, use the `usePlayerMovement` hook directly:

```typescript
import { usePlayerMovement } from '@/hooks/usePlayerMovement';
import { useEffect } from 'react';

function CustomPlayer3D({ stance, legInjury, onMove }) {
  // Initialize physics
  const { position, velocity, speed, updateControls } = usePlayerMovement({
    stance,
    legInjuryFactor: legInjury,
    initialPosition: new THREE.Vector3(0, 0, 0),
  });

  // Wire up your custom input system
  useEffect(() => {
    const handleInput = (input: MyInputType) => {
      updateControls({
        forward: input.forward,
        lateral: input.lateral,
        isRunning: input.sprint,
        useTacticalSteps: input.tactical,
      });
    };

    myInputSystem.on('move', handleInput);
    return () => myInputSystem.off('move', handleInput);
  }, [updateControls]);

  // Notify parent of position changes
  useEffect(() => {
    onMove?.(position);
  }, [position, onMove]);

  return (
    <mesh position={position}>
      <capsuleGeometry args={[0.5, 1.6]} />
      <meshStandardMaterial color={getStanceColor(stance)} />
    </mesh>
  );
}
```

### 3. Integration with Existing useKeyboardControls

Update your existing keyboard hook to call `updateControls`:

```typescript
import { usePlayerMovement } from '@/hooks/usePlayerMovement';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';

function Player3DWithKeyboard({ stance, legInjury }) {
  const { position, updateControls } = usePlayerMovement({
    stance,
    legInjuryFactor: legInjury,
  });

  // Track movement state
  const [movementState, setMovementState] = useState({
    forward: 0,
    lateral: 0,
    isRunning: false,
  });

  // Use existing keyboard controls
  const { queuedInputs } = useKeyboardControls({
    onStanceChange: (stanceIndex) => {
      // Handle stance changes
    },
    onAction: (action) => {
      // Parse movement actions
      switch (action) {
        case 'move_up':
          setMovementState(prev => ({ ...prev, forward: 1 }));
          break;
        case 'move_down':
          setMovementState(prev => ({ ...prev, forward: -1 }));
          break;
        case 'move_left':
          setMovementState(prev => ({ ...prev, lateral: -1 }));
          break;
        case 'move_right':
          setMovementState(prev => ({ ...prev, lateral: 1 }));
          break;
      }
    },
    enabled: true,
  });

  // Update physics when movement state changes
  useEffect(() => {
    updateControls(movementState);
  }, [movementState, updateControls]);

  return <mesh position={position}>{/* ... */}</mesh>;
}
```

## Advanced Integration

### Tactical Step Mode

Enable precise 30cm grid movement for tactical positioning:

```typescript
const [tacticalMode, setTacticalMode] = useState(false);

function TacticalPlayer3D({ stance }) {
  const { position, updateControls } = usePlayerMovement({
    stance,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle tactical mode with 'T' key
      if (e.key === 't' || e.key === 'T') {
        setTacticalMode(prev => !prev);
      }

      // Movement with tactical steps
      if (e.key === 'w') {
        updateControls({
          forward: 1.0,
          useTacticalSteps: tacticalMode,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tacticalMode, updateControls]);

  return (
    <>
      <mesh position={position}>{/* player */}</mesh>
      {/* Visual indicator for tactical mode */}
      {tacticalMode && (
        <GridHelper
          args={[50, 166]}  // 50m grid with 0.3m spacing
          position={[0, 0.01, 0]}
        />
      )}
    </>
  );
}
```

### Combat Integration with Injury System

Connect movement speed to combat damage:

```typescript
import { usePlayerMovement } from '@/hooks/usePlayerMovement';
import { calculateLegInjury } from '@/systems/bodypart';

function CombatPlayer3D({ player, stance }) {
  // Calculate leg injury from body part health
  const legInjury = calculateLegInjury(
    player.bodyPartHealth?.leftLeg,
    player.bodyPartHealth?.rightLeg,
    player.bodyPartMaxHealth
  );

  const { position, maxSpeed, updateControls } = usePlayerMovement({
    stance,
    legInjuryFactor: legInjury,
  });

  // Display speed reduction feedback
  const speedPenalty = legInjury * 0.5; // 0-50% reduction
  const displaySpeed = maxSpeed.toFixed(1);

  return (
    <>
      <mesh position={position}>{/* player */}</mesh>
      
      {/* Speed indicator */}
      {legInjury > 0 && (
        <Html position={[position.x, position.y + 2.5, position.z]} center>
          <div style={{
            color: legInjury > 0.5 ? '#ff4444' : '#ffaa00',
            fontSize: '14px',
            fontFamily: 'Korean Font',
          }}>
            {speedPenalty > 0 && `⚠️ -${(speedPenalty * 100).toFixed(0)}% 속도`}
            <br />
            {displaySpeed} m/s
          </div>
        </Html>
      )}
    </>
  );
}
```

### Stance-Based Movement Feedback

Visualize different stance speeds:

```typescript
function StanceAwarePlayer3D({ stance }) {
  const physics = new MovementPhysics();
  const stanceModifier = physics.getStanceSpeedModifier(stance);

  const { position, speed, updateControls } = usePlayerMovement({
    stance,
  });

  // Aura intensity based on speed
  const auraIntensity = (speed / 4.0) * stanceModifier;

  return (
    <group position={position}>
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1.6]} />
        <meshStandardMaterial
          color={getStanceColor(stance)}
          emissive={getStanceColor(stance)}
          emissiveIntensity={auraIntensity}
        />
      </mesh>

      {/* Speed trail effect for fast stances */}
      {stanceModifier > 1.1 && speed > 1.0 && (
        <Trail
          width={0.3}
          color={getStanceColor(stance)}
          length={8}
          decay={1}
        >
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color={getStanceColor(stance)} />
          </mesh>
        </Trail>
      )}
    </group>
  );
}
```

## Mobile/Touch Integration

Add touch controls for mobile devices:

```typescript
import { useTouchControls } from '@/hooks/useTouchControls';

function MobilePlayer3D({ stance }) {
  const { position, updateControls } = usePlayerMovement({
    stance,
  });

  const { joystickPosition, isActive } = useTouchControls({
    enabled: true,
  });

  useEffect(() => {
    if (isActive) {
      updateControls({
        forward: joystickPosition.y,
        lateral: joystickPosition.x,
        isRunning: false, // Add sprint button separately
      });
    } else {
      updateControls({
        forward: 0,
        lateral: 0,
        isRunning: false,
      });
    }
  }, [joystickPosition, isActive, updateControls]);

  return <mesh position={position}>{/* player */}</mesh>;
}
```

## Performance Tips

### 1. Reuse Physics Instance

Don't create new `MovementPhysics` instances in render:

```typescript
// ❌ BAD - creates new instance every render
function Player() {
  const physics = new MovementPhysics();
  // ...
}

// ✅ GOOD - hook already reuses instance
function Player() {
  const { position, updateControls } = usePlayerMovement({
    // hook manages physics instance
  });
}
```

### 2. Batch Control Updates

Update controls once per frame, not multiple times:

```typescript
// ❌ BAD - multiple updates per frame
updateControls({ forward: 1 });
updateControls({ lateral: 1 });
updateControls({ isRunning: true });

// ✅ GOOD - single update with all changes
updateControls({
  forward: 1,
  lateral: 1,
  isRunning: true,
});
```

### 3. Disable When Not Visible

Save CPU by disabling physics for off-screen players:

```typescript
const { position, updateControls } = usePlayerMovement({
  stance,
  enabled: isVisible, // Disable when off-screen
});
```

## Testing

### Unit Testing Physics Integration

```typescript
import { renderHook } from '@testing-library/react';
import { usePlayerMovement } from '@/hooks/usePlayerMovement';

test('should integrate with stance system', () => {
  const { result } = renderHook(() =>
    usePlayerMovement({
      stance: TrigramStance.SON, // Wind stance
    })
  );

  // Wind stance should have 125% speed
  expect(result.current.maxSpeed).toBe(2.5); // 2.0 * 1.25
});
```

### E2E Testing Movement

```typescript
// cypress/e2e/player-movement.cy.ts
describe('Player Movement', () => {
  it('should move with keyboard controls', () => {
    cy.visit('/game');
    
    // Press W to move forward
    cy.get('canvas').type('w');
    
    // Wait for movement
    cy.wait(1000);
    
    // Verify position changed
    cy.window().its('gameState.playerPosition.z').should('be.gt', 0);
  });
});
```

## Troubleshooting

### Issue: Player not moving

**Check:**
1. Is `enabled` prop set to `true`?
2. Are keyboard events being captured?
3. Is `updateControls` being called?

```typescript
// Add debug logging
useEffect(() => {
  console.log('Physics enabled:', enabled);
  console.log('Position:', position);
  console.log('Velocity:', velocity);
}, [enabled, position, velocity]);
```

### Issue: Stuttering movement

**Causes:**
1. Delta time not clamped → Use `maxDeltaTime` prop
2. Too many physics updates → Ensure only one instance per player
3. Physics running when not needed → Disable for off-screen players

```typescript
// Clamp delta time
const { position } = usePlayerMovement({
  stance,
  maxDeltaTime: 1 / 30, // Cap at 30fps equivalent
});
```

### Issue: Speed doesn't match stance

**Check:**
1. Stance prop is correctly passed
2. Stance changes trigger re-render
3. Physics engine recognizes stance

```typescript
// Verify stance speed modifier
import { MovementPhysics } from '@/systems/physics';

const physics = new MovementPhysics();
console.log('Stance modifier:', physics.getStanceSpeedModifier(stance));
```

## Korean Terminology Reference

| English | Korean | Romanization |
|---------|--------|--------------|
| Movement speed | 이동속도 | idong sokdo |
| Acceleration | 가속도 | gasokdo |
| Deceleration | 감속도 | gamsokdo |
| Footwork | 보법 | bobeop |
| Forward | 전진 | jeonjin |
| Backward | 후퇴 | hutoe |
| Lateral | 측면이동 | cheungmyeon idong |
| Sprint | 질주 | jilju |
| Tactical step | 전술보법 | jeonsul bobeop |

## Next Steps

1. **Add Animation Blending**: Connect velocity to animation system
2. **Arena Boundaries**: Add collision detection with arena edges
3. **Stamina System**: Reduce speed when stamina is low
4. **Dash Mechanic**: Add burst movement with momentum
5. **Footstep Audio**: Play sounds based on movement speed

---

**흑괘의 길을 걸어라** - Walk the Path of the Black Trigram
