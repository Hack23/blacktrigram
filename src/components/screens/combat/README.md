# 🥋 Combat Screen Package

**Package**: `src/components/screens/combat/`  
**Main Component**: `CombatScreen3D.tsx`  
**Complexity**: Highest (35+ components)  
**Performance Target**: 60fps desktop, 55fps mobile

---

## 📋 Overview

The Combat Screen is the core gameplay component of Black Trigram, implementing the full Korean martial arts combat system with:
- 8 trigram stances (건, 태, 리, 진, 손, 감, 간, 곤)
- 70 vital point targeting system
- Skeletal animation (28 bones per character)
- AI combat opponents
- Real-time damage calculations

---

## 🏗️ Component Structure

```plaintext
combat/
├── CombatScreen3D.tsx              # Main screen component
├── CombatScreen3D.test.tsx         # Screen tests
├── components/
│   ├── controls/
│   │   ├── CombatButtons.tsx       # Action buttons
│   │   ├── CombatControlsPanel.tsx # Control layout
│   │   └── KeyboardHints.tsx       # Keyboard shortcuts
│   ├── feedback/
│   │   ├── MatchCountdown.tsx      # Round timer
│   │   ├── RoundAnnouncement.tsx   # Round display
│   │   └── RoundStartAnnouncement.tsx
│   └── indicators/
│       └── InputBufferDisplay.tsx  # Input buffer visualization
└── README.md                        # This file
```

---

## 📱 Responsive Orientation Profiles

The combat screen's layout is computed by `useCombatLayout(width, height)`, which
returns an orientation-aware `{ isMobile, isPortrait, arenaBounds }` tuple. The
hook selects one of four layout profiles:

| Profile              | Trigger                                     | Arena aspect | Side HUDs | Camera                         |
| -------------------- | ------------------------------------------- | ------------ | --------- | ------------------------------ |
| Desktop              | `!isMobile && !isPortrait`                  | 4:3          | Shown     | Default (FOV 60, z=12)         |
| Mobile landscape     | `isMobile && !isPortrait`                   | 4:3          | Shown     | Tighter (FOV 55, z=10)         |
| Mobile portrait      | `isPortrait && width < 1024`                | 3:4          | **Hidden** | Pulled back (FOV +15, z+4)    |
| Tablet (landscape)   | `isMobile && width ≥ 768 && !isPortrait`    | 4:3          | Shown     | Mobile camera                  |

Key rules:

- **Portrait forcing**: any viewport with `height > width × 0.9` and
  `width < 1024` is treated as mobile, regardless of user-agent, so devtools
  emulation matches real rotated phones.
- **Bottom-band reservation**: in portrait mobile, `useCombatLayout` subtracts
  `controlsHeight + footerHeight + mobileControlsHeight` from the arena's
  available height so the 3D scene is never occluded by the technique bar or
  D-Pad / action buttons.
- **Side-HUD collapse**: `CombatLeftHUD` and `CombatRightHUD` are not rendered
  in portrait mobile (player HP/stamina remain visible via the top HUD).
- **Camera**: in portrait the FOV is widened and the camera is pulled back so
  both fighters fit the narrow viewport from head to feet.

See `useCombatLayout.responsive.test.ts` for a viewport matrix that enforces
"arena stays inside the viewport with non-trivial area" on every supported
phone + tablet resolution.

---

## ⚡ Performance Characteristics

### Current Performance (January 2026)

| Device | FPS | Load Time | Memory | Status |
|--------|-----|-----------|--------|---------|
| Desktop | 58-60fps | 1.8s | 420MB | ✅ Good |
| Tablet | 52-55fps | 2.3s | 280MB | ⚠️ Near target |
| Mobile | 48-52fps | 3.2s | 190MB | ⚠️ Below target |
| Low-End | 45-48fps | 3.8s | 140MB | ⚠️ Below target |

### Known Bottlenecks

1. **Particle System**: Exceeds 20-particle budget on mobile (actual: 40-50)
2. **Skeletal Animation**: Complex bone transforms impact mobile performance
3. **AI Calculations**: Per-frame AI decision-making overhead
4. **Shadow Rendering**: High shadow map resolution on mid-tier devices

### Optimization Priorities (Q1 2026)

- 🔴 **High**: Reduce particle count on mobile (40-50 → 20)
- 🔴 **High**: Implement LOD system for player models
- 🟡 **Medium**: Optimize AI to run every 3-5 frames
- 🟡 **Medium**: Lower shadow map resolution on mobile (1024 → 512)

---

## 🎮 Key Features

### Combat Systems

**Trigram Stance System**:
- 8 stances based on I Ching philosophy
- Stance-specific techniques and advantages
- Ki/Stamina cost for stance transitions

**Vital Point Targeting**:
- 70 authentic Korean martial arts vital points
- Anatomical hit detection with polygon zones
- 5 severity levels (Lethal, Critical, Major, Moderate, Minor)

**Skeletal Animation**:
- 28-bone hierarchy per character
- Hand pose system (7 poses)
- Muscle tension visualization

**AI Opponent**:
- 5 archetype-specific behaviors
- Adaptive difficulty system
- Tactical decision-making

### UI Components (Html Overlays)

**HUD Elements**:
- Player health, Ki, stamina bars
- Combat timer and round display
- Technique bar with available moves
- Combo counter

**Controls**:
- Action buttons (attack, defend, technique)
- Virtual D-pad for movement
- Stance selection interface
- Vital point overlay controls

---

## 🎨 Korean Theming

### Color Palette

Uses `KOREAN_COLORS` from `src/types/constants/colors.ts`:

```typescript
// Primary UI colors
PRIMARY_CYAN: 0x00e6e6      // HUD elements
ACCENT_GOLD: 0xffc400       // Emphasis, perfect strikes

// Combat effects
CRITICAL_HIT: 0xff4444      // Critical damage
PERFECT_STRIKE: 0xffc400    // Perfect execution
VITAL_POINT_HIT: 0xff33ff   // Vital point strikes

// Trigram stance colors
TRIGRAM_GEON_PRIMARY: 0xffd700  // Heaven (건)
TRIGRAM_TAE_PRIMARY: 0x87ceeb   // Lake (태)
TRIGRAM_LI_PRIMARY: 0xff4500    // Fire (리)
// ... [8 total trigram colors]
```

### Typography

**Fonts**:
- Korean text: `Noto Sans KR` (responsive sizing)
- Combat UI: `FONT_FAMILY.CYBER` for cyberpunk aesthetic
- Bilingual format: "건괘 | Heaven Stance"

**Responsive Text Sizes**:
```typescript
getKoreanFontSize('MEDIUM', width)
// <380px: 17px
// 380-450px: 18px
// >450px: 20px
```

---

## 🧪 Testing Coverage

**Current Coverage**: ~80% (target: >85%)

### Test Scenarios

1. **Combat Flow**:
   - Attack execution and damage calculation
   - Defense and blocking mechanics
   - Stance transitions and Ki management

2. **HUD Updates**:
   - Health bar updates on damage
   - Ki/stamina regeneration
   - Timer countdown

3. **AI Behavior**:
   - Archetype-specific patterns
   - Adaptive difficulty adjustments
   - Decision-making validation

4. **Performance**:
   - Frame rate under load (particles, animations)
   - Memory usage during extended combat
   - Resource cleanup on unmount

---

## ♿ Accessibility

### Keyboard Controls

- **WASD**: Movement
- **Space**: Execute current technique
- **1-8**: Stance selection (trigram)
- **Shift**: Guard/block
- **Ctrl**: Vital point targeting mode
- **Esc**: Pause/menu

### ARIA Labels

All interactive elements include proper `aria-label` attributes:

```typescript
<button
  onClick={handleAttack}
  aria-label="공격 | Attack - Execute current stance technique"
  data-testid="attack-button"
>
  공격 | Attack
</button>
```

### Focus Indicators

High-contrast focus indicators (2px borders) using `KOREAN_COLORS.PRIMARY_CYAN`.

---

## 🔧 Usage Example

```typescript
import { CombatScreen3D } from './components/screens/combat/CombatScreen3D';

function App() {
  return (
    <CombatScreen3D
      width={window.innerWidth}
      height={window.innerHeight}
      isMobile={/mobile/i.test(navigator.userAgent)}
      onAction={(action) => console.log('Combat action:', action)}
    />
  );
}
```

---

## 📊 Performance Monitoring

### Development Overlay

Enable performance monitoring in development:

```typescript
<PerformanceOverlay3D targetFPS={perfSettings.targetFPS} />
```

Displays:
- Current FPS
- Frame time (ms)
- Memory usage (MB)
- Frame drop count

### Frame Rate Tracking

```typescript
const metrics = usePerformanceMonitor(perfSettings.targetFPS);

// Logs warnings on frame drops (<50fps)
// Tracks average FPS over 60 frames
// Monitors memory usage (if available)
```

---

## 🚀 Optimization Techniques

### Applied Optimizations

1. **Geometry Instancing**: Particles use `<Instances>` for efficient rendering
2. **Memoization**: Layout calculations and shared materials
3. **Resource Cleanup**: Proper disposal of Three.js objects
4. **Conditional Rendering**: Post-processing disabled on mobile

### Pending Optimizations

1. **LOD System**: Implement 3 detail levels for player models
   - High: Full 28-bone skeleton
   - Medium: 14-bone simplified skeleton
   - Low: Static mesh with baked animations

2. **Particle Reduction**: Dynamic particle count based on device
   ```typescript
   const particleCount = perfSettings.maxParticles; // 20-100 based on device
   ```

3. **AI Optimization**: Throttle AI updates to every 3-5 frames
   ```typescript
   if (frameCount % 3 === 0) {
     updateAIBehavior();
   }
   ```

---

## 📚 Related Documentation

- [Screen Architecture Patterns](../../docs/SCREEN_ARCHITECTURE_PATTERNS.md)
- [Performance Baseline](../../docs/PERFORMANCE_BASELINE.md)
- [Combat System Architecture](../../COMBAT_ARCHITECTURE.md)
- [Overall Architecture](../../ARCHITECTURE.md)

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial documentation: Architecture, performance baselines, optimization priorities |

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
