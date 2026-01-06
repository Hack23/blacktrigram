# Physics-Based Movement System

**Korean**: 이동 물리 시스템 (Movement Physics System)

## Overview

The Black Trigram physics-based movement system provides realistic combat movement with proper acceleration, deceleration, and Korean martial arts-inspired stance modifiers. Built for Three.js with @react-three/fiber, it delivers smooth 60fps movement for authentic fighting game feel.

## Features

### ✅ Realistic Physics
- **Acceleration**: 0 to 2m/s in 0.5 seconds (4.0 m/s²)
- **Deceleration**: 2m/s to 0 in 0.3 seconds (6.67 m/s²)
- **Smooth velocity curves**: Natural feeling movement
- **Delta time clamping**: Stable physics during lag spikes

### ✅ Combat Movement Speeds
- **Walking**: 2m/s forward, 1.5m/s backward (25% slower)
- **Running**: 4m/s forward, 3m/s backward (25% slower)
- **Lateral**: 1.8m/s side-stepping
- **Tactical Steps**: 30cm (foot-wide) grid quantization

### ✅ Eight Trigram Stance Modifiers

Based on traditional Korean martial arts philosophy, each stance has unique movement characteristics:

| Trigram | Korean | Speed | Description |
|---------|--------|-------|-------------|
| ☰ 건 (Geon) | Heaven | 100% | Balanced, standard movement |
| ☱ 태 (Tae) | Lake | 110% | Fluid, flowing techniques |
| ☲ 리 (Li) | Fire | 120% | Aggressive, fast attacks |
| ☳ 진 (Jin) | Thunder | 115% | Explosive power |
| ☴ 손 (Son) | Wind | 125% | Fastest stance, continuous motion |
| ☵ 감 (Gam) | Water | 105% | Adaptive flow |
| ☶ 간 (Gan) | Mountain | 80% | Solid defense, slower |
| ☷ 곤 (Gon) | Earth | 85% | Grounded, stable |

### ✅ Injury System Integration

Leg damage reduces movement speed:
- **10% injury** → 5% speed reduction
- **50% injury** → 25% speed reduction
- **100% injury** → 50% speed reduction (maximum penalty)

## Architecture

### Core Components

```
src/systems/physics/
├── MovementPhysics.ts        # Core physics engine
├── MovementPhysics.test.ts   # Physics unit tests (29 tests)
└── index.ts                   # Public API

src/hooks/
├── usePlayerMovement.ts       # React Three Fiber integration
├── usePlayerMovement.test.ts  # Hook integration tests (8 tests)
```

### Data Flow

```
Keyboard/Gamepad Input
    ↓
Movement Controls (forward, lateral, isRunning)
    ↓
usePlayerMovement Hook
    ↓
MovementPhysics Engine
    ↓
Three.js Position Updates (60fps via useFrame)
    ↓
3D Character Rendering
```

## Usage

### Basic Three.js Integration

```typescript
import { usePlayerMovement } from '@/hooks/usePlayerMovement';
import { TrigramStance } from '@/types/common';

function Player3D({ stance, legInjury }: Props) {
  const { position, velocity, speed, updateControls } = usePlayerMovement({
    stance,
    legInjuryFactor: legInjury,
    initialPosition: new THREE.Vector3(0, 0, 0),
  });

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w') updateControls({ forward: 1.0 });
      if (e.key === 's') updateControls({ forward: -1.0 });
      if (e.key === 'a') updateControls({ lateral: -1.0 });
      if (e.key === 'd') updateControls({ lateral: 1.0 });
      if (e.key === 'Shift') updateControls({ isRunning: true });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 's') updateControls({ forward: 0 });
      if (e.key === 'a' || e.key === 'd') updateControls({ lateral: 0 });
      if (e.key === 'Shift') updateControls({ isRunning: false });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [updateControls]);

  return (
    <mesh position={position}>
      <capsuleGeometry args={[0.5, 1.6]} />
      <meshStandardMaterial 
        color={getStanceColor(stance)}
        emissive={speed > 0 ? 0x00ffff : 0x000000}
        emissiveIntensity={speed / 4.0}
      />
    </mesh>
  );
}
```

### Tactical Step Mode

```typescript
const { position, updateControls } = usePlayerMovement({
  stance: TrigramStance.GEON,
});

// Enable tactical steps for precise 30cm grid movement
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 't') {
      // Toggle tactical step mode
      updateControls({ useTacticalSteps: true });
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [updateControls]);
```

### Injury Integration

```typescript
// Calculate leg injury from body part health
const legHealth = (leftLegHealth + rightLegHealth) / (2 * maxLegHealth);
const legInjuryFactor = 1.0 - legHealth; // 0 = healthy, 1 = critical

const { position, maxSpeed } = usePlayerMovement({
  stance: currentStance,
  legInjuryFactor, // Automatically reduces speed
});

// Display speed reduction
console.log(`Current max speed: ${maxSpeed.toFixed(2)} m/s`);
// Healthy: 2.00 m/s
// 50% leg injury: 1.50 m/s (25% reduction)
// 100% leg injury: 1.00 m/s (50% reduction)
```

### Stance-Based Speed Demonstration

```typescript
// Wind stance (fastest)
const windMovement = usePlayerMovement({
  stance: TrigramStance.SON, // 125% speed
});
// Max speed: 2.5 m/s walking, 5.0 m/s running

// Mountain stance (defensive, slowest)
const mountainMovement = usePlayerMovement({
  stance: TrigramStance.GAN, // 80% speed
});
// Max speed: 1.6 m/s walking, 3.2 m/s running
```

## Korean Terminology

**이동속도** (idong sokdo) - Movement speed  
**가속도** (gasokdo) - Acceleration  
**보법** (bobeop) - Footwork/stepping technique  
**전진** (jeonjin) - Forward movement  
**후퇴** (hutoe) - Backward movement/retreat  
**측면이동** (cheungmyeon idong) - Lateral movement  

## Performance

- **Target**: 60fps on mid-range hardware
- **Physics updates**: Every frame via useFrame
- **Memory**: Zero allocations in update loop (reuses temp vectors)
- **Mobile**: Fully supported with responsive controls

## Testing

### Running Tests

```bash
# Physics engine tests
npm run test -- src/systems/physics/MovementPhysics.test.ts

# Hook integration tests
npm run test -- src/hooks/usePlayerMovement.test.ts

# All system tests
npm run test:systems
```

### Test Coverage

- **Physics Engine**: 29 tests covering all movement mechanics
- **Hook Integration**: 8 tests covering React Three Fiber integration
- **Total Coverage**: All acceptance criteria validated

## Technical Details

### Acceleration Math

Using linear acceleration towards target velocity:

```typescript
// Acceleration phase
const velocityDelta = BASE_ACCELERATION * deltaTime; // 4.0 m/s² * dt
const newSpeed = Math.min(currentSpeed + velocityDelta, targetSpeed);

// Deceleration phase
const velocityDelta = BASE_DECELERATION * deltaTime; // 6.67 m/s² * dt
const newSpeed = Math.max(currentSpeed - velocityDelta, 0);
```

### Tactical Step Quantization

```typescript
// Quantize movement to 0.3m (30cm) grid
const movement = velocity.clone().multiplyScalar(deltaTime);
movement.x = Math.round(movement.x / STEP_SIZE) * STEP_SIZE; // 0.3m steps
movement.z = Math.round(movement.z / STEP_SIZE) * STEP_SIZE;
position.add(movement);
```

### Stance Speed Calculation

```typescript
const baseSpeed = isRunning ? 4.0 : 2.0;                    // Walking or running
const stanceModifier = STANCE_SPEED_MODIFIERS[stance];      // 0.8 to 1.25
const injuryPenalty = 1.0 - (legInjuryFactor * 0.5);       // 0-50% reduction
const finalSpeed = baseSpeed * stanceModifier * injuryPenalty;
```

## Future Enhancements

- [ ] Dash/dodge mechanics with momentum
- [ ] Momentum-based attack combos
- [ ] Arena boundary collision detection
- [ ] Slope/terrain adaptation
- [ ] Stamina-based speed reduction
- [ ] Animation blending based on velocity

## References

- [Combat Architecture](../../COMBAT_ARCHITECTURE.md) - Overall combat system design
- [Game Design](../../game-design.md) - Korean martial arts philosophy
- [Three.js Documentation](https://threejs.org/docs/)
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/)

---

**흑괘의 길을 걸어라** - Walk the Path of the Black Trigram
