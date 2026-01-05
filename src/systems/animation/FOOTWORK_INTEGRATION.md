# Footwork Animation System Integration Guide

## Overview

The footwork animation system adds 4 specialized Korean martial arts footwork patterns (보법, Bobeop) to complement the existing 8-directional tactical step system.

## Architecture

### Animation States

**Footwork Pattern Types:**
- **Circular (원형보)**: Lateral movement while maintaining guard facing
- **Pivot (축족회전)**: 90° rotation on planted foot  
- **Slide (미끄럼보)**: Both feet move together
- **Shuffle (섞음보)**: Quick 15cm micro-adjustments

**Animation States Added:**
```typescript
// Circular steps (18 frames, 300ms, 30cm)
| "footwork_circular_left"
| "footwork_circular_right"

// Pivot rotations (15 frames, 250ms, 90°)
| "footwork_pivot_left"
| "footwork_pivot_right"

// Slide movements (12 frames, 200ms, 30cm)
| "footwork_slide_forward"
| "footwork_slide_back"
| "footwork_slide_left"
| "footwork_slide_right"

// Shuffle adjustment (6 frames, 100ms, 15cm)
| "footwork_shuffle"
```

### Animation Priorities

- **Circular & Pivot**: Priority 5 (ATTACK/STEP) - Non-interruptible
- **Slide**: Priority 4 (DEFEND) - Interruptible
- **Shuffle**: Priority 3 (STANCE_CHANGE) - Interruptible

### Keyboard Controls

**New Ctrl+WASD controls for footwork:**
- `Ctrl+A`: Circular step left (원형보 좌)
- `Ctrl+D`: Circular step right (원형보 우)
- `Ctrl+W`: Slide forward (미끄럼보 전)
- `Ctrl+S`: Slide back (미끄럼보 후)

**Existing controls unchanged:**
- `Shift+WASD`: Tactical steps (8 directions, 30cm)
- `WASD`: Regular movement

## Usage Examples

### In Combat System

```typescript
import { FootworkPattern } from './systems/animation/types';

// Execute circular step
combatSystem.executeFootwork('circular', 'left');

// Execute pivot rotation
combatSystem.executeFootwork('pivot', 'right');

// Execute slide step
combatSystem.executeFootwork('slide', 'forward');
```

### In Animation State Machine

```typescript
import { PlayerAnimationStateMachine } from './systems/animation';

const animMachine = new PlayerAnimationStateMachine();

// Transition to footwork animation
animMachine.transitionTo('footwork_circular_left');

// Update at 60fps
const result = animMachine.update(deltaTime);
```

### In SkeletalPlayer3D

The footwork animations integrate automatically via the existing animation system:

```typescript
// Current animation state flows through:
// PlayerState → AnimationState → SkeletalPlayer3D

// Footwork animations use "walk" base animation with:
// - Custom keyframes for weight transfer
// - Guard pose maintenance
// - Direction-specific movement vectors
```

## Performance Characteristics

### Frame Timings (60fps)

| Pattern  | Frames | Duration | Distance | Priority | Interruptible |
|----------|--------|----------|----------|----------|---------------|
| Circular | 18     | 300ms    | 30cm     | 5        | No            |
| Pivot    | 15     | 250ms    | 90°      | 5        | No            |
| Slide    | 12     | 200ms    | 30cm     | 4        | Yes           |
| Shuffle  | 6      | 100ms    | 15cm     | 3        | Yes           |

### Comparison with Tactical Steps

| Feature          | Tactical Steps | Footwork Patterns |
|------------------|----------------|-------------------|
| Directions       | 8              | Varies by pattern |
| Commitment       | High           | Varies            |
| Guard Maintained | Yes            | Yes (circular)    |
| Rotation         | No             | Yes (pivot)       |
| Speed            | Standard       | Variable          |

## Testing

Comprehensive test coverage provided in `FootworkAnimations.test.ts`:

- ✅ 26 tests covering all patterns
- ✅ Korean terminology validation
- ✅ Animation timing requirements
- ✅ Priority system integration
- ✅ Acceptance criteria validation

Run tests:
```bash
npm test -- FootworkAnimations.test.ts
```

## Korean Terminology Reference

### Footwork Patterns (보법 유형)

| Pattern  | Korean    | Romanization      | Meaning                |
|----------|-----------|-------------------|------------------------|
| Circular | 원형보    | Wonhyeongbo       | Circular step          |
| Pivot    | 축족회전  | Chukjok Hoejeon   | Pivot foot rotation    |
| Slide    | 미끄럼보  | Mikkeureombo      | Sliding step           |
| Shuffle  | 섞음보    | Seokkeumbo        | Shuffle step           |

### Traditional Context

Korean martial arts (태권도, 택견, 합기도) emphasize precise footwork (보법) for:
- **간격 조절** (Gangyeok Jojul) - Distance management
- **각도 변화** (Gakdo Byeonhwa) - Angle changes
- **중심 유지** (Jungsim Yuji) - Balance maintenance
- **공격 준비** (Gonggyeok Junbi) - Attack preparation

## Integration Checklist

- [x] Type definitions added
- [x] Animation configurations created
- [x] Keyboard controls implemented (Ctrl+A/D, Ctrl+W/S)
- [x] Type definitions added
- [x] Animation configurations created
- [x] Keyboard controls implemented (Ctrl+A/D, Ctrl+W/S)
- [x] Test coverage achieved
- [x] Visual keyframe data (ALL skeletal animations implemented)
- [x] 3D skeletal animation integration (SkeletalPlayer3D updated)
- [x] All 9 footwork skeletal animations complete
- [ ] Additional keyboard controls (pivot, shuffle, slide L/R)
- [ ] Body facing system integration (future work)
- [ ] Training mode footwork exercises (future enhancement)

## Implementation Status

### Completed ✅
1. **Type System**: FootworkPattern type and 9 AnimationState values
2. **Animation Configs**: All 4 patterns configured with proper frame counts and priorities
3. **Keyboard Controls**: Ctrl+A/D (circular), Ctrl+W/S (slide)
4. **Skeletal Animations**: ALL PATTERNS FULLY IMPLEMENTED
   - Circular left/right with detailed keyframes ✅
   - Slide forward/back with detailed keyframes ✅
   - Slide left/right with detailed keyframes ✅ NEW
   - Pivot left/right with 90° rotation keyframes ✅ NEW
   - Shuffle with micro-adjustment keyframes ✅ NEW
5. **3D Integration**: SkeletalPlayer3D.tsx handles all footwork animations
6. **Test Coverage**: 26 tests covering all patterns and integration

### Ready for Control Binding 🎮
All footwork patterns now have complete skeletal animations and are ready for keyboard bindings:
1. **Pivot Rotations**: Full skeletal animations with 90° rotation - awaiting keybinding
2. **Shuffle Step**: Full skeletal animations with 15cm micro-adjustment - awaiting keybinding
3. **Slide Left/Right**: Full skeletal animations with lateral movement - awaiting keybinding

### Future Enhancements ⏭️
1. **Body Facing Integration**: Future work for maintaining facing direction during circular steps
2. **Training Mode**: Footwork exercises and drills

## Future Enhancements

1. **Advanced Footwork Combinations**
   - Circular → Pivot chains
   - Slide → Circular transitions
   - Footwork combo attacks

2. **Stance-Specific Footwork**
   - Each trigram stance has preferred footwork
   - Stance synergy bonuses
   - Cultural authenticity for each 팔괘

3. **Training Drills**
   - Footwork pattern practice mode
   - Timing challenges
   - Circular stepping around targets

4. **Visual Enhancements**
   - Foot trail effects
   - Ground contact particles
   - Stance aura during footwork

## See Also

- [Issue #1073](https://github.com/Hack23/blacktrigram/issues/1073) - Step Movement Animations
- [Issue #1074](https://github.com/Hack23/blacktrigram/issues/1074) - Footwork Animation (this implementation)
- [COMBAT_ARCHITECTURE.md](../../COMBAT_ARCHITECTURE.md) - Overall combat system
- [StepAnimations.ts](./StepAnimations.ts) - Tactical step implementation

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_ 🥋
