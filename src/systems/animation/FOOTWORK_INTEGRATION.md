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

**Complete Footwork Control System:**

**Circular Steps (원형보 - Lateral movement maintaining guard):**
- `Ctrl+A`: Circular step left (원형보 좌)
- `Ctrl+D`: Circular step right (원형보 우)

**Slide Steps (미끄럼보 - Both feet move together):**
- `Ctrl+W`: Slide forward (미끄럼보 전)
- `Ctrl+S`: Slide back (미끄럼보 후)
- `Alt+A`: Slide left (미끄럼보 좌)
- `Alt+D`: Slide right (미끄럼보 우)

**Pivot Rotations (축족회전 - 90° rotation on planted foot):**
- `Shift+Ctrl+A`: Pivot left (축족회전 좌)
- `Shift+Ctrl+D`: Pivot right (축족회전 우)

**Shuffle Step (섞음보 - Quick 15cm micro-adjustment):**
- `Shift+Ctrl+W`: Shuffle step (섞음보)
- `Shift+Ctrl+S`: Shuffle step (섞음보)

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
- [x] Keyboard controls implemented (ALL 9 footwork patterns)
  - [x] Circular left/right (Ctrl+A/D)
  - [x] Slide forward/back (Ctrl+W/S)
  - [x] Slide left/right (Alt+A/D) ✨ NEW
  - [x] Pivot left/right (Shift+Ctrl+A/D) ✨ NEW
  - [x] Shuffle step (Shift+Ctrl+W/S) ✨ NEW
- [x] Test coverage achieved
- [x] Visual keyframe data (ALL skeletal animations implemented)
- [x] 3D skeletal animation integration (SkeletalPlayer3D updated)
- [x] All 9 footwork skeletal animations complete
- [x] Training mode footwork exercises ✨ COMPLETE
  - [x] FootworkDrillsHTML component with 7 drill types
  - [x] FootPlacementMarkers3D for 3D visual guidance
  - [x] Training state with footwork drill support
  - [x] Integration into TrainingScreen3D
- [x] Visual foot placement indicators ✨ COMPLETE
- [ ] Movement trail effects (future enhancement)
- [ ] Body facing system integration (future work)

## Implementation Status

### Completed ✅
1. **Type System**: FootworkPattern type and 9 AnimationState values
2. **Animation Configs**: All 4 patterns configured with proper frame counts and priorities
3. **Keyboard Controls**: ALL 9 footwork patterns accessible ✨ COMPLETE
   - Circular left/right (Ctrl+A/D) ✅
   - Slide forward/back (Ctrl+W/S) ✅
   - Slide left/right (Alt+A/D) ✅ NEW
   - Pivot left/right (Shift+Ctrl+A/D) ✅ NEW
   - Shuffle step (Shift+Ctrl+W/S) ✅ NEW
4. **Skeletal Animations**: ALL PATTERNS FULLY IMPLEMENTED
   - Circular left/right with detailed keyframes ✅
   - Slide forward/back with detailed keyframes ✅
   - Slide left/right with detailed keyframes ✅
   - Pivot left/right with 90° rotation keyframes ✅
   - Shuffle with micro-adjustment keyframes ✅
5. **3D Integration**: SkeletalPlayer3D.tsx handles all footwork animations
6. **Test Coverage**: 26 tests covering all patterns and integration
7. **Training Mode Integration**: ✨ COMPLETE
   - FootworkDrillsHTML component with 7 drill types ✅
   - FootPlacementMarkers3D for 3D visual guidance ✅
   - Training state with footwork drill support ✅
   - Footwork training mode in mode selector ✅
   - Real-time 3D foot placement markers ✅

### In Progress 🚧
1. **Visual Enhancements**: Movement trail effects and ground contact particles
2. **Performance Testing**: 60fps validation during complex footwork sequences

### Future Enhancements ⏭️
1. **Body Facing Integration**: Maintaining facing direction during circular steps
2. **Stance-Specific Footwork**: Trigram stance synergy with footwork patterns
3. **Footwork Combinations**: Circular → Pivot chains and advanced sequences
4. **AI Training Partner**: Footwork drills with AI opponent for reactive training

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
- [Issue #1076](https://github.com/Hack23/blacktrigram/issues/1076) - Footwork Animation (this implementation)
- [COMBAT_ARCHITECTURE.md](../../COMBAT_ARCHITECTURE.md) - Overall combat system
- [StepSkeletalAnimations.ts](./StepSkeletalAnimations.ts) - Tactical step implementation

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_ 🥋
