# Mobile Touch Control System

## Overview

Black Trigram features a comprehensive mobile touch control system designed for 375x667+ mobile resolutions, optimized for 60fps performance on mid-tier devices (iPhone 11, Samsung S10).

## Components

### 1. Virtual D-Pad (VirtualDPad.tsx)

**Location**: Bottom-left corner  
**Size**: 120px diameter  
**Touch Targets**: 44px+ minimum (iOS accessibility guideline)

**Features**:
- 8-directional movement control
- Korean arrow indicators (↑ ↗ → ↘ ↓ ↙ ← ↖)
- Active state visual feedback
- Haptic feedback on press (10ms light vibration)
- Translucent overlay (80% opacity)

**Usage**:
```typescript
<VirtualDPad
  onMove={(direction, eventType) => handleMove(direction, eventType)}
  disabled={!controlsEnabled}
  size={120}
  bottom={20}
  left={20}
  opacity={0.8}
/>
```

**Gesture Mappings**:
- `up` → W key (move forward)
- `down` → S key (move backward)
- `left` → A key (strafe left)
- `right` → D key (strafe right)
- Diagonals → Primary direction

### 2. Action Buttons (ActionButtons.tsx)

**Location**: Bottom-right corner  
**Sizes**: 
- Attack button: 60x60px (gold, ⚡)
- Block button: 50x50px (blue, 🛡️)

**Features**:
- Bilingual labels (한글 | English)
- Press state animations (scale 0.95)
- Haptic feedback (medium 50ms for attack, light 10ms for block)
- Vertical stack layout with 10px gap

**Usage**:
```typescript
<ActionButtons
  onAttack={() => executeTechnique()}
  onBlock={(type) => type === 'start' ? activateBlock() : deactivateBlock()}
  disabled={!controlsEnabled}
  bottom={20}
  right={20}
  opacity={0.8}
/>
```

### 3. Stance Wheel (StanceWheel.tsx)

**Location**: Bottom-center  
**Sizes**:
- Collapsed: 60x60px
- Expanded: 200x200px diameter

**Features**:
- 8-segment circular selector
- Trigram symbols (☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷)
- Korean stance names (건 태 리 진 손 감 간 곤)
- Current stance highlighting (gold)
- Smooth expand/collapse animation (0.3s)
- 50px touch targets per segment

**Usage**:
```typescript
<StanceWheel
  currentStance={player.stanceIndex}
  onStanceChange={(idx) => switchStance(TRIGRAM_STANCES[idx])}
  expanded={wheelExpanded}
  onToggle={() => setWheelExpanded(!wheelExpanded)}
  disabled={!controlsEnabled}
  opacity={0.8}
/>
```

**Stance Mappings**:
- 0: ☰ 건 (Geon) - Heaven
- 1: ☱ 태 (Tae) - Lake
- 2: ☲ 리 (Li) - Fire
- 3: ☳ 진 (Jin) - Thunder
- 4: ☴ 손 (Son) - Wind
- 5: ☵ 감 (Gam) - Water
- 6: ☶ 간 (Gan) - Mountain
- 7: ☷ 곤 (Gon) - Earth

### 4. Gesture Recognizer (GestureRecognizer.tsx)

**Location**: Fullscreen overlay  
**Min Swipe Distance**: 50px (configurable)

**Features**:
- 4-direction swipe detection
- Two-finger tap detection
- Visual feedback with icons and bilingual labels
- Auto-fading feedback (1000ms)
- Instruction overlay (top-right)

**Usage**:
```typescript
<GestureRecognizer
  onGesture={(gesture) => handleGesture(gesture)}
  enabled={controlsEnabled}
  showFeedback={true}
  minSwipeDistance={50}
/>
```

**Gesture Types**:
- `swipe-right` (→) - 전진 | Advance
- `swipe-left` (←) - 후퇴 | Retreat
- `swipe-up` (↑) - 상단 | High
- `swipe-down` (↓) - 하단 | Low
- `two-finger-tap` (🎯) - 급소 | Vital Point
- `tap` (👆) - 터치 | Tap

## Haptic Feedback

The system uses the Vibration API for tactile feedback:

### Patterns

```typescript
export const HAPTIC_PATTERNS = {
  light: [10],      // D-pad movement, block
  medium: [50],     // Attack, stance change
  heavy: [100],     // Critical hits, vital points
  combo: [30, 20, 30], // Multi-hit combos
};
```

### Browser Support

- Chrome/Edge: Full support
- Safari: Requires user gesture first
- Firefox: Limited support
- Fallback: Silent (no error)

## Mobile Detection

Controls are automatically shown when `width < 768px`:

```typescript
const isMobile = useMemo(() => width < 768, [width]);

// In Canvas
{isMobile && (
  <>
    <VirtualDPad onMove={handleMove} />
    <ActionButtons onAttack={handleAttack} onBlock={handleBlock} />
    <StanceWheel currentStance={stance} onStanceChange={handleStanceChange} />
    <GestureRecognizer onGesture={handleGesture} />
  </>
)}
```

## Integration Examples

### CombatScreen3D

```typescript
// Mobile control handlers
const handleMobileMove = useCallback((direction: Direction | null, eventType: DPadEventType) => {
  if (!direction || eventType !== 'start') return;
  
  const keyMap: Record<Direction, string> = {
    'up': 'w', 'down': 's', 'left': 'a', 'right': 'd',
    'up-right': 'd', 'down-right': 'd', 'down-left': 'a', 'up-left': 'w',
  };
  
  const key = keyMap[direction];
  if (key) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  }
}, []);

const handleMobileGesture = useCallback((gesture: GestureEvent) => {
  switch (gesture.type) {
    case 'swipe-right':
      // Advance toward opponent
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
      break;
    case 'swipe-left':
      // Retreat from opponent
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      break;
    case 'two-finger-tap':
      // Toggle vital point mode
      audio.playSFX("menu_select");
      // TODO: Implement vital point mode
      break;
  }
}, [audio]);
```

### TrainingScreen3D

```typescript
const handleMobileGesture = useCallback((gesture: GestureEvent) => {
  switch (gesture.type) {
    case 'swipe-up':
      // Quick strike
      if (isTraining) {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      }
      break;
    case 'swipe-down':
      // Reset dummy
      setDummyHealth(100);
      setFeedback("더미 재설정 | Dummy Reset");
      break;
    case 'two-finger-tap':
      // Toggle training mode
      setTrainingMode(mode === "vital_point" ? "basics" : "vital_point");
      audio.playSFX("menu_select");
      break;
  }
}, [isTraining, audio]);
```

## Performance Optimization

### 60fps Target

All controls are optimized for 60fps performance:

1. **useCallback** for all event handlers
2. **useMemo** for layout calculations
3. **CSS transitions** instead of JavaScript animations
4. **Efficient touch event handling** with preventDefault
5. **Minimal re-renders** with proper dependency arrays

### Memory Management

- Touch event listeners cleaned up on unmount
- Feedback indicators auto-removed after 1000ms
- No object allocations in hot paths
- Reuse of Three.js vectors where possible

### Optimization Checklist

- [x] Event handlers use useCallback
- [x] Layout calculations use useMemo
- [x] Touch events call preventDefault
- [x] Visual feedback uses CSS transitions
- [x] Old feedback indicators cleaned up
- [x] No memory leaks from event listeners
- [x] Minimal state updates
- [x] Efficient gesture detection algorithm

## Testing

### Unit Tests

149 tests covering all mobile components:

```bash
npm test -- src/components/mobile src/hooks/useTouchControls.test.ts src/utils/haptics.test.ts
```

**Coverage**:
- `haptics.test.ts`: 27 tests, 100% coverage
- `useTouchControls.test.ts`: 16 tests, 85%+ coverage
- `VirtualDPad.test.tsx`: 18 tests
- `ActionButtons.test.tsx`: 23 tests
- `StanceWheel.test.tsx`: 33 tests
- `GestureRecognizer.test.tsx`: 32 tests

### Manual Testing

**Devices Tested**:
- iPhone 11 (iOS 15+)
- Samsung Galaxy S10 (Android 11+)
- iPad Air (landscape + portrait)
- Chrome DevTools mobile emulation

**Test Scenarios**:
1. Virtual D-pad: Test all 8 directions
2. Attack/block buttons: Rapid tapping
3. Stance wheel: Expand, select, collapse
4. Swipe gestures: All 4 directions with visual feedback
5. Two-finger tap: Vital point mode toggle
6. Haptic feedback: Verify vibration patterns
7. Orientation change: Portrait ↔ landscape
8. Performance: Maintain 60fps during combat

## Accessibility

### Touch Targets

All touch targets meet iOS accessibility guidelines:

- Minimum size: 44x44px
- D-pad buttons: 44px+
- Attack button: 60x60px
- Block button: 50x50px
- Stance segments: 50x50px

### Visual Feedback

- High contrast borders (cyan, gold)
- Active state animations
- Bilingual labels (한글 | English)
- Icon indicators (⚡ 🛡️ ☰ etc.)

### Haptic Feedback

- Light: Non-critical actions
- Medium: Important actions
- Heavy: Critical moments
- Fallback: Silent operation

## Known Limitations

1. **Haptic API**: Not supported in all browsers (Safari requires user gesture)
2. **Two-finger gestures**: May conflict with system gestures on some devices
3. **Landscape mode**: Control layout optimized for portrait, works in landscape
4. **Small screens**: Controls may overlap on screens < 375px width

## Future Enhancements

- [ ] Custom control layout editor
- [ ] Gesture sensitivity settings
- [ ] Alternative control schemes
- [ ] Controller support via Gamepad API
- [ ] Voice commands for accessibility
- [ ] Tutorial mode for new users
- [ ] Gesture replay/training

## References

- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/inputs/touchscreen-gestures)
- [Material Design Touch Targets](https://material.io/design/usability/accessibility.html#layout-and-typography)
- [W3C Touch Events](https://www.w3.org/TR/touch-events/)
- [MDN Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
