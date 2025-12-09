# Stance Change Animation System

## Overview

A complete visual effects system for stance transitions in Black Trigram (흑괘), providing smooth, immersive feedback when players change between the 8 trigram stances.

## Components

### StanceAuraParticles
**200-particle system with stance-specific colors and motion patterns**

```tsx
<StanceAuraParticles 
  stance={TrigramStance.GEON} 
  intensity={0.8}
  count={200}
  animated={true}
  spread={2.0}
/>
```

**Features:**
- ✅ 8 unique stance patterns (Heaven: upward, Lake: fluid, Fire: erratic, Thunder: explosive, etc.)
- ✅ Color-coded by trigram (Gold, Sky Blue, Orange Red, Purple, Green, Blue, Brown, Dark Khaki)
- ✅ Orbital motion with stance-specific speed and rotation
- ✅ Performance optimized with instanced rendering and particle recycling
- ✅ Configurable particle count (default: 200, mobile: 100)

**Props:**
- `stance`: TrigramStance - Current trigram stance
- `intensity?`: number (0-1) - Effect intensity (default: 1.0)
- `count?`: number - Number of particles (default: 200)
- `animated?`: boolean - Enable animation (default: true)
- `spread?`: number - Spread radius (default: 2.0)

### StanceSymbol3D
**Floating Unicode trigram symbols above player**

```tsx
<StanceSymbol3D 
  stance={TrigramStance.GEON}
  heightOffset={2.5}
  animated={true}
  scale={1.0}
  showName={true}
/>
```

**Features:**
- ✅ Unicode trigram symbols (☰☱☲☳☴☵☶☷)
- ✅ Bilingual Korean name display (건 태 리 진 손 감 간 곤)
- ✅ Rotation animation and pulsing glow effect
- ✅ Configurable height offset and scale
- ✅ Korean cyberpunk theming with color-coded display

**Props:**
- `stance`: TrigramStance - Current trigram stance
- `heightOffset?`: number - Height above player (default: 2.5)
- `animated?`: boolean - Enable rotation (default: true)
- `scale?`: number - Symbol scale (default: 1.0)
- `showName?`: boolean - Show Korean name (default: true)

### StanceTransitionEffect
**0.5s smooth transitions with color interpolation**

```tsx
<StanceTransitionEffect
  fromStance={TrigramStance.GEON}
  toStance={TrigramStance.TAE}
  onTransitionComplete={() => console.log('Done')}
  duration={0.5}
  showNameOverlay={true}
/>
```

**Features:**
- ✅ 0.5s smooth color interpolation between stances
- ✅ Expanding energy ring effect with additive blending
- ✅ 1-second bilingual stance name overlay (Korean + English)
- ✅ Automatic cleanup after transition completion
- ✅ Callback support for audio sync and game logic

**Props:**
- `fromStance`: TrigramStance | null - Previous stance (null for initial)
- `toStance`: TrigramStance - New stance
- `onTransitionComplete?`: () => void - Callback when done
- `duration?`: number - Transition duration in seconds (default: 0.5)
- `showNameOverlay?`: boolean - Show name overlay (default: true)

### Player3DWithTransitions
**Enhanced player component with automatic stance detection**

```tsx
<Player3DWithTransitions
  playerId="player1"
  archetype={PlayerArchetype.MUSA}
  stance={currentStance}
  position={[0, 0, 0]}
  rotation={0}
  health={85}
  maxHealth={100}
  stamina={60}
  ki={40}
  pain={20}
  balance="READY"
  consciousness={100}
  bloodLoss={0}
  currentAnimation="idle"
  isMobile={false}
  enableTransitionEffects={true}
  enableParticles={true}
  enableStanceSymbol={true}
  enableStanceAudio={true}
  onStanceTransitionComplete={(stance) => console.log('New stance:', stance)}
/>
```

**Features:**
- ✅ Wraps Player3DUnified with stance effects
- ✅ Automatic stance change detection
- ✅ Integrated particle system, symbol, and transitions
- ✅ Audio synchronization (plays "stance_change" SFX)
- ✅ Mobile optimizations (reduced particles, smaller symbol, no overlays)
- ✅ Individual effect toggles for performance tuning

**Additional Props** (extends Player3DUnifiedProps):
- `enableTransitionEffects?`: boolean - Show transitions (default: true)
- `enableParticles?`: boolean - Show particles (default: true)
- `enableStanceSymbol?`: boolean - Show floating symbol (default: true)
- `enableStanceAudio?`: boolean - Play SFX (default: true)
- `transitionDuration?`: number - Transition time (default: 0.5)
- `onStanceTransitionStart?`: (from, to) => void - Start callback
- `onStanceTransitionComplete?`: (stance) => void - Complete callback

## Usage

### Basic Usage

```tsx
import { Player3DWithTransitions } from './components/three';
import { TrigramStance, PlayerArchetype } from './types/common';

function CombatScene() {
  const [stance, setStance] = useState(TrigramStance.GEON);

  return (
    <Canvas>
      <Player3DWithTransitions
        playerId="player1"
        archetype={PlayerArchetype.MUSA}
        stance={stance}
        position={[0, 0, 0]}
        rotation={0}
        health={100}
        maxHealth={100}
        stamina={100}
        ki={80}
        pain={0}
        balance="READY"
        consciousness={100}
        bloodLoss={0}
        currentAnimation="idle"
        isMobile={false}
      />
    </Canvas>
  );
}
```

### Keyboard Controls

```tsx
// Map 1-8 keys to stances
const stanceMap = {
  '1': TrigramStance.GEON,  // 건 - Heaven
  '2': TrigramStance.TAE,   // 태 - Lake
  '3': TrigramStance.LI,    // 리 - Fire
  '4': TrigramStance.JIN,   // 진 - Thunder
  '5': TrigramStance.SON,   // 손 - Wind
  '6': TrigramStance.GAM,   // 감 - Water
  '7': TrigramStance.GAN,   // 간 - Mountain
  '8': TrigramStance.GON,   // 곤 - Earth
};

useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    const newStance = stanceMap[e.key];
    if (newStance) setStance(newStance);
  };
  
  window.addEventListener('keypress', handleKeyPress);
  return () => window.removeEventListener('keypress', handleKeyPress);
}, []);
```

### Mobile Optimization

```tsx
// Automatically optimizes for mobile
<Player3DWithTransitions
  {...playerProps}
  isMobile={window.innerWidth < 768}
  // Reduces particles to 100
  // Scales symbol to 0.8
  // Hides name overlays
/>
```

### Performance Mode

```tsx
// Disable effects for low-end devices
<Player3DWithTransitions
  {...playerProps}
  enableParticles={false}
  enableStanceSymbol={false}
  enableTransitionEffects={false}
  enableStanceAudio={false}
/>
```

### Individual Components

```tsx
// Use components separately for more control
<group>
  <StanceAuraParticles
    stance={stance}
    intensity={ki / 100}
    count={200}
    animated={true}
  />
  
  <StanceSymbol3D
    stance={stance}
    heightOffset={2.5}
    animated={true}
  />
  
  {showTransition && (
    <StanceTransitionEffect
      fromStance={prevStance}
      toStance={stance}
      onTransitionComplete={() => setShowTransition(false)}
    />
  )}
</group>
```

## Trigram Stances

| Key | Korean | English | Symbol | Color | Pattern |
|-----|--------|---------|--------|-------|---------|
| 1 | 건 | Heaven | ☰ | Gold | Direct upward |
| 2 | 태 | Lake | ☱ | Sky Blue | Fluid wavy |
| 3 | 리 | Fire | ☲ | Orange Red | Fast erratic |
| 4 | 진 | Thunder | ☳ | Purple | Explosive |
| 5 | 손 | Wind | ☴ | Light Green | Swirling |
| 6 | 감 | Water | ☵ | Blue | Flowing |
| 7 | 간 | Mountain | ☶ | Brown | Stable |
| 8 | 곤 | Earth | ☷ | Dark Khaki | Grounded |

## Performance

### Target: 60fps

All components are optimized for smooth 60fps gameplay:

✅ **Delta clamping**: Prevents spiral of death (max 1/30s per frame)
✅ **Instanced rendering**: Single draw call for all particles
✅ **Object pooling**: Reuses particle positions
✅ **Optimized animations**: Minimal per-frame allocations
✅ **Mobile aware**: Reduced effects on mobile devices

### Performance Benchmarks

- Desktop (200 particles): ~58-60fps
- Mobile (100 particles): ~55-60fps
- Performance mode (no effects): 60fps solid

## Test Coverage

✅ **116 unit tests passing (100% success rate)**

- StanceAuraParticles: 28 tests
- StanceSymbol3D: 39 tests
- StanceTransitionEffect: 25 tests
- Player3DWithTransitions: 24 tests

**Test categories:**
- Component props and defaults
- All 8 trigram stances
- Korean martial arts integration
- Performance considerations
- Edge cases

## Audio Integration

The system integrates with AudioProvider to play SFX:

```tsx
// Automatically plays "stance_change" SFX
<Player3DWithTransitions
  {...props}
  enableStanceAudio={true} // default
/>
```

**Required audio asset:** `stance_change`

Register in AudioAssetRegistry:
```ts
audioAssetRegistry.registerSFX({
  id: 'stance_change',
  path: '/audio/sfx/stance_change.mp3',
  volume: 0.7,
});
```

## Examples

See `StanceAnimationExamples.tsx` for complete usage examples:

1. **BasicStanceTransitionExample** - Simplest usage
2. **IndividualComponentsExample** - Manual control
3. **MobileOptimizedExample** - Mobile-specific settings
4. **PerformanceModeExample** - Maximum performance
5. **CustomTransitionExample** - With callbacks
6. **KeyboardControlExample** - Complete with keyboard input

## Technical Details

### Color Interpolation

Uses `colorUtils.blend()` for smooth RGB interpolation:

```ts
const currentColor = colorUtils.blend(
  fromColor, 
  toColor, 
  progress
);
```

### Particle Motion

Orbital motion with stance-specific patterns:

```ts
const targetX = Math.cos(orbitalAngle) * orbitalRadius;
const targetZ = Math.sin(orbitalAngle) * orbitalRadius;
const targetY = 1.0 + Math.sin(time * speed) * verticalBias;

// Smooth interpolation
position.lerp(target, delta * speed);
```

### Stance Detection

Automatic detection of stance changes:

```tsx
useEffect(() => {
  if (previousStance !== null && previousStance !== stance) {
    setIsTransitioning(true);
    audio.playSFX('stance_change');
  }
}, [stance, previousStance]);
```

## Architecture

```
components/three/
├── StanceAuraParticles.tsx      # Particle system
├── StanceSymbol3D.tsx            # Floating symbol
├── StanceTransitionEffect.tsx    # Transition effect
├── Player3DWithTransitions.tsx   # Integration wrapper
├── StanceAnimationExamples.tsx   # Usage examples
├── *.test.tsx                    # Unit tests
└── README_STANCE_ANIMATIONS.md   # This file
```

## Future Enhancements

- [ ] Position adjustment animations (stance affects height/width)
- [ ] Particle trail effects during transition
- [ ] Custom stance change SFX per trigram
- [ ] VR/AR support for stance visualization
- [ ] Multiplayer synchronization

## Contributing

When adding new stance effects:

1. Maintain 60fps performance target
2. Follow Korean theming (KOREAN_COLORS)
3. Add comprehensive unit tests
4. Update examples file
5. Document in this README

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
