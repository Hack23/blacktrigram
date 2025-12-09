# Shared 3D HUD Components

**Unified Korean cyberpunk-themed HUD components for Black Trigram's Combat and Training screens.**

## Overview

This directory contains shared, reusable 3D HUD components that integrate seamlessly with Three.js scenes using Html overlays from `@react-three/drei`. All components follow the Korean cyberpunk aesthetic and provide bilingual (Korean/English) labels.

## Components

### HealthBar3D

Segmented health display with color transitions based on health percentage.

**Features:**
- 10 segmented bars with smooth animations
- Color transitions: Green (>50%), Yellow (25-50%), Red (<25%)
- Pulse animation when health <20%
- Korean/English bilingual labels
- Responsive sizing (mobile/tablet/desktop)
- Full ARIA accessibility support

**Usage:**
```tsx
import { HealthBar3D } from './components/ui/shared';

<HealthBar3D
  current={85}
  max={100}
  playerId="player1"
  variant="player"  // or "opponent" or "training"
  showText={true}
  isMobile={false}
  screenWidth={1200}
/>
```

**Test Coverage:** 100% (33 tests)

---

### StaminaBar3D

Segmented stamina display with cyan/blue gradient theming.

**Features:**
- 5 segmented bars with smooth transitions
- Consistent cyan/blue color scheme
- Pulse animation when stamina <20%
- Korean/English bilingual labels
- Responsive sizing (mobile/tablet/desktop)
- Full ARIA accessibility support

**Usage:**
```tsx
import { StaminaBar3D } from './components/ui/shared';

<StaminaBar3D
  current={45}
  max={50}
  playerId="player1"
  variant="player"
  showText={true}
  isMobile={false}
  screenWidth={1200}
/>
```

**Test Coverage:** 100% (30 tests)

---

### StatusIndicator3D

Generic status indicator for Ki, techniques, buffs/debuffs, and custom states.

**Features:**
- Multiple status types (ki, technique, buff, debuff, stance, custom)
- Icon + bilingual label + value display
- Variant support (player/opponent/training)
- Custom color override support
- Responsive sizing
- Type-safe status type enum

**Usage:**
```tsx
import { StatusIndicator3D } from './components/ui/shared';

<StatusIndicator3D
  type="ki"
  labelKorean="기력"
  labelEnglish="Ki Energy"
  value={75}
  maxValue={100}
  variant="player"
  icon="⚡"  // optional custom icon
  color={0x00ffff}  // optional custom color
  isMobile={false}
  screenWidth={1200}
/>
```

**Status Types:**
- `ki` - Ki/Energy level (⚡)
- `technique` - Technique availability (🥋)
- `buff` - Positive status effect (↑)
- `debuff` - Negative status effect (↓)
- `stance` - Current stance (☯)
- `custom` - Custom indicator (●)

**Test Coverage:** 93.33% (33 tests)

---

## Theme System

All components use the centralized `korean-cyberpunk.ts` theme system.

### Variants

Each component supports three visual variants:

| Variant | Border Color | Glow Color | Use Case |
|---------|-------------|-----------|----------|
| `player` | Cyan (#00ffff) | Cyan | Player character HUD |
| `opponent` | Red (#ff3333) | Red | Opponent character HUD |
| `training` | Gold (#ffd700) | Gold | Training dummy/NPC HUD |

### Responsive Sizing

Components automatically adapt to three screen sizes:

| Breakpoint | Width | Component Behavior |
|------------|-------|-------------------|
| Mobile | <768px | Compact sizing, smaller fonts |
| Tablet | 768-1024px | Medium sizing |
| Desktop | >1024px | Full sizing, maximum readability |

Use the `isMobile` prop or pass `screenWidth` for automatic responsive behavior.

### Color Palette

All components use colors from `KOREAN_COLORS`:

```typescript
// Primary colors
PRIMARY_CYAN: 0x00ffff
ACCENT_BLUE: 0x3399ff
ACCENT_GOLD: 0xffd700
ACCENT_RED: 0xff3333

// Health colors
HEALTH_FULL: 0x00ff00    // Green (>50%)
HEALTH_MEDIUM: 0xffff00  // Yellow (25-50%)
HEALTH_CRITICAL: 0xff0000 // Red (<25%)

// Status colors
POSITIVE_GREEN: 0x00ff00
NEGATIVE_RED: 0xff0000
```

---

## Three.js Integration

### Basic Integration

All components use `Html` overlays from `@react-three/drei` for 3D scene integration:

```tsx
import { Canvas } from '@react-three/fiber';
import { Html, PerspectiveCamera } from '@react-three/drei';
import { HealthBar3D, StaminaBar3D } from './components/ui/shared';

export const CombatScene3D: React.FC = () => {
  return (
    <Canvas>
      {/* 3D Scene */}
      <ambientLight intensity={0.5} />
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      
      {/* 3D Objects */}
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={0x00ffff} />
      </mesh>

      {/* HUD Overlay */}
      <Html fullscreen>
        <div style={{ position: 'absolute', top: 20, left: 20 }}>
          <HealthBar3D current={85} max={100} playerId="player1" />
          <StaminaBar3D current={45} max={50} playerId="player1" />
        </div>
      </Html>
    </Canvas>
  );
};
```

### Example Demo

See `Example3D.tsx` for a complete interactive demo showing:
- Proper Three.js scene setup
- HUD overlay positioning
- Interactive state management
- Responsive controls

---

## Accessibility

All components follow WCAG 2.1 AA standards:

- **ARIA roles**: `progressbar` for HealthBar and StaminaBar
- **ARIA labels**: Bilingual Korean/English labels
- **ARIA values**: Current, min, max, and text descriptions
- **Keyboard navigation**: Components are keyboard-accessible
- **Screen reader support**: Proper semantic HTML

---

## Testing

### Test Coverage

- **Overall**: 96.92% coverage
- **HealthBar3D**: 100% (33 tests)
- **StaminaBar3D**: 100% (30 tests)
- **StatusIndicator3D**: 93.33% (33 tests)

### Running Tests

```bash
# Run all shared component tests
npm test -- src/components/ui/shared/

# Run with coverage
npm test -- src/components/ui/shared/ --coverage

# Run specific component tests
npm test -- src/components/ui/shared/HealthBar3D.test.tsx
```

### Test Categories

Each component has comprehensive tests covering:
1. **Rendering**: Basic rendering and test IDs
2. **Value Calculation**: Percentage calculations and edge cases
3. **Variants**: Player, opponent, and training variants
4. **Responsive Behavior**: Mobile and desktop sizing
5. **Accessibility**: ARIA attributes and roles
6. **Visual States**: Animations and color transitions
7. **Edge Cases**: Fractional values, zero/negative, large numbers

---

## Migration Guide

### From Existing HealthBar

**Before:**
```tsx
import { HealthBar } from '../components/combat/components/HealthBar';

<HealthBar
  current={85}
  max={100}
  playerId="player1"
  isMobile={isMobile}
/>
```

**After:**
```tsx
import { HealthBar3D } from '../components/ui/shared';

<HealthBar3D
  current={85}
  max={100}
  playerId="player1"
  variant="player"  // NEW: specify variant
  showText={true}
  isMobile={isMobile}
  screenWidth={width}  // NEW: for responsive sizing
/>
```

### From Existing StaminaBar

**Before:**
```tsx
import { StaminaBar } from '../components/combat/components/StaminaBar';

<StaminaBar
  current={45}
  max={50}
  playerId="player1"
  isMobile={isMobile}
/>
```

**After:**
```tsx
import { StaminaBar3D } from '../components/ui/shared';

<StaminaBar3D
  current={45}
  max={50}
  playerId="player1"
  variant="player"  // NEW: specify variant
  showText={true}
  isMobile={isMobile}
  screenWidth={width}  // NEW: for responsive sizing
/>
```

---

## Contributing

When adding new shared components:

1. **Follow naming convention**: `[ComponentName]3D.tsx`
2. **Add comprehensive tests**: Target >85% coverage
3. **Use theme system**: Import from `korean-cyberpunk.ts`
4. **Support variants**: Player/opponent/training
5. **Add accessibility**: ARIA labels and roles
6. **Document thoroughly**: JSDoc comments and README updates
7. **Provide examples**: Usage examples in component files

---

## File Structure

```
src/components/ui/shared/
├── HealthBar3D.tsx           # Health bar component
├── HealthBar3D.test.tsx      # Health bar tests
├── StaminaBar3D.tsx          # Stamina bar component
├── StaminaBar3D.test.tsx     # Stamina bar tests
├── StatusIndicator3D.tsx     # Status indicator component
├── StatusIndicator3D.test.tsx # Status indicator tests
├── Example3D.tsx             # Integration example
├── index.ts                  # Component exports
└── README.md                 # This file

src/theme/
└── korean-cyberpunk.ts       # Centralized theme system
```

---

## License

Part of the Black Trigram project. See [LICENSE](../../../LICENSE) for details.

## Credits

Built with:
- **React 19** - UI framework
- **Three.js 0.181** - 3D rendering
- **@react-three/fiber 9.4** - React renderer for Three.js
- **@react-three/drei 10.7** - Three.js helpers and Html overlay
- **TypeScript 5.9** - Type safety
- **Vitest 4.0** - Testing framework

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
