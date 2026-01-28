# Grappling System Documentation

## Overview

The **Grappling System** (잡기 시스템) implements realistic grappling and takedown mechanics for Black Trigram's Korean martial arts combat. Based on **Hapkido (합기도)** joint locks and **Ssireum (씨름)** wrestling techniques, the system provides authentic control and escape mechanics.

## Key Features

### 🥋 Realistic Control Mechanics
- **Grip Strength**: Decays at 2 points/second, affects escape difficulty
- **Control Duration**: Minimum 0.5s before escape attempts allowed
- **Stamina Costs**: 5 base stamina/sec, varies by body part targeted
- **Movement Penalties**: GRAPPLING -80% (20% speed), GRAPPLED -100% (cannot move)

### 🎯 Intelligent Target Detection
The system automatically determines grapple target from technique characteristics:
- `wrist` → Hand control (easiest, 80% stamina cost)
- `arm` → Arm control (standard, 100% stamina cost)
- `leg` → Leg control (harder, 120% stamina cost)
- `torso`, `body`, `hip` → Torso control (very hard, 130% stamina cost)
- `neck` → Neck control (most demanding, 150% stamina cost)
- `both`, `double` → Both arms (hardest, 180% stamina cost)

### 🌏 Korean Martial Arts Integration
- **GON Stance (곤괘)**: Earth stance gets +15% grappling success chance and +30% grip strength bonus (1.3× multiplier), +30% escape chance
- **GAN Stance (간괘)**: Mountain stance gets +15% grip strength bonus (1.15× multiplier), +15% escape chance
- Authentic Hapkido joint lock principles
- Traditional Ssireum grip and control mechanics

## Usage

### Defining a Grapple Technique

```typescript
const armLock: KoreanTechnique = {
  id: "arm-lock",
  name: { korean: "팔꺾기", english: "Arm Lock" },
  stance: TrigramStance.GON,
  type: CombatAttackType.GRAPPLE, // Key: Mark as GRAPPLE type
  damageType: DamageType.JOINT,
  damage: 20,
  kiCost: 10,
  staminaCost: 15,
  accuracy: 0.85,
  executionTime: 600,
  recoveryTime: 800,
  // ... other properties
};
```

### Executing a Grapple

```typescript
// The CombatSystem automatically handles grapple execution
const result = combatSystem.resolveAttack(
  attacker,
  defender,
  armLock // GRAPPLE type technique
);

if (result.success) {
  // Grapple successful - control established
  console.log("Control established!");
  console.log("Attacker state:", result.attacker.combatState); // GRAPPLING
  console.log("Defender state:", result.defender.combatState); // GRAPPLED
  console.log("Grip strength:", result.attacker.grappleControl?.gripStrength);
}
```

### Maintaining Control Over Time

```typescript
// Update grapple state each frame
const { updatedController, updatedTarget } = combatSystem.updateGrappleState(
  controller,
  target,
  deltaTime, // Time in seconds (e.g., 0.016 for 60fps)
  currentTime // Timestamp in milliseconds
);

// Control automatically breaks if:
// - Controller runs out of stamina
// - Controller is stunned
// - Grip strength drops below minimum (20)
if (!updatedController.grappleControl) {
  console.log("Grapple control broken!");
}
```

### Attempting to Escape

```typescript
// The GrappleSystem can be accessed directly for manual escapes
const grappleSystem = new GrappleSystem();

const escapeResult = grappleSystem.attemptEscape(
  grappleControl,
  controller,
  target
);

if (escapeResult.success) {
  // Escape successful - both players return to IDLE state
  console.log("Escaped from grapple!");
}
```

## Success Calculation

### Grapple Initiation
Success chance is calculated based on:
- **Base**: 50% + (attacker technique - defender defense) × 2%
- **Speed advantage**: +(attacker speed - defender speed) × 1%
- **GON stance bonus**: +15%
- **Defender attacking**: +20% (easier to grapple)
- **Defender defending**: -15% (harder to grapple)
- **Target difficulty**:
  - Hand: +10%
  - Both arms: -20%
  - Neck: -10%

### Escape Attempts
Escape chance is calculated based on:
- **Base**: 50% - (grip strength / 100) × 30%
- **Strength difference**: +(target power - controller power) × 2%
- **Speed advantage**: +(target speed - controller speed) × 1.5%
- **Technique skill**: +target technique × 0.5%
- **GON stance escape bonus**: +30%
- **GAN stance escape bonus**: +15%
- **Time penalty**: -min(20%, duration × 2%)

## State Diagram

```
IDLE ─────┬─→ GRAPPLING ─────┬─→ IDLE
          │   (GRABBING)     │   (stamina depleted)
          │   ↓               │
          │   (CONTROLLING)──┴─→ IDLE
          │                       (escaped or released)
          │   GRAPPLED ──────────→ IDLE
          │   (being controlled)  (escaped or released)
          │
          └─→ ATTACKING
              (normal attacks blocked if grappled)
```

**State Transitions:**
- `GRABBING`: Initial grapple attempt, transitions to CONTROLLING on first frame
- `CONTROLLING`: Active control state with grip decay and stamina cost
- `ESCAPING`: Player attempting to break free (future enhancement)
- `THROWING`: Transitioning to throw technique (future enhancement)
- `LOCKING`: Applying joint lock (future enhancement)

## Integration Points

### CombatSystem
- `resolveAttack()`: Special handling for GRAPPLE type
- `handleGrappleTechnique()`: Initiates grapple control
- `updateGrappleState()`: Maintains control over time
- `getGrappleTargetFromTechnique()`: Auto-detects target

### PlayerState
- `combatState`: GRAPPLING | GRAPPLED
- `grappleControl`: Active grapple control data

### SpeedModifierSystem
- GRAPPLING: 80% movement penalty
- GRAPPLED: 100% movement penalty (cannot move)

## Testing

### Unit Tests (23 tests)
`src/systems/combat/GrappleSystem.test.ts`
- Grapple attempt validation
- Control duration and grip decay
- Escape mechanics
- Transition checks (throw, joint lock)

### Integration Tests (10 tests)
`src/systems/CombatSystem.grappling.test.ts`
- Full combat flow with grappling
- State transitions
- Stamina management
- GON stance advantage

## Configuration

```typescript
const config: GrappleConfig = {
  baseStaminaCostPerSecond: 5,     // Base stamina drain
  minGripStrength: 20,              // Minimum to maintain control
  maxGripStrength: 100,             // Maximum grip strength
  baseEscapeDifficulty: 1.5,        // Escape difficulty multiplier
  escapeStaminaCost: 15,            // Stamina cost per escape attempt
  minControlDuration: 500,          // Min time before escape (ms)
};

const grappleSystem = new GrappleSystem(config);
```

## Future Enhancements

### Planned Features
- [ ] Grapple hold animations
- [ ] Escape struggle animations
- [ ] Limb-specific control poses
- [ ] Smooth state transitions
- [ ] Follow-up techniques from control:
  - Throws (던지기) from torso/arm control
  - Joint locks (관절기) from hand/arm control
  - Takedowns from leg control

### Animation Support
When implementing animations:
1. Add GRAPPLE_ENTRY phase (0.15s)
2. Add GRAPPLE_CONTROL loop animation
3. Add GRAPPLE_ESCAPE animation
4. Add transition animations for throws/locks

## Korean Martial Arts Reference

### Hapkido Joint Locks (합기도 관절기)
- **손목꺾기** (Sonmok-kkeokgi) - Wrist lock
- **팔꺾기** (Pal-kkeokgi) - Arm lock
- **어깨꺾기** (Eokkae-kkeokgi) - Shoulder lock
- **목조르기** (Mok-joreogi) - Neck choke

### Ssireum Wrestling (씨름)
- **바지잡기** (Baji-japgi) - Pants grip
- **허리잡기** (Heori-japgi) - Waist grip
- **샅바잡기** (Satba-japgi) - Traditional satba grip
- **다리걸기** (Dari-geolgi) - Leg hook

## Performance Considerations

- Grip strength updates: O(1) per frame
- Escape calculations: O(1) per attempt
- No additional memory allocation during control
- All calculations use simple arithmetic (no complex math)

## Conclusion

The Grappling System provides authentic Korean martial arts control mechanics with:
- ✅ Realistic grip strength and decay
- ✅ Proper stamina management
- ✅ Intelligent escape mechanics
- ✅ Seamless CombatSystem integration
- ✅ Comprehensive test coverage (33 tests)

For questions or enhancements, see:
- `src/systems/combat/GrappleSystem.ts` - Core implementation
- `src/systems/CombatSystem.ts` - Combat integration
- Test files for usage examples
