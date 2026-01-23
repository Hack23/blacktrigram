# 📱 Screen Architecture Patterns & Performance Standards

**Last Updated**: January 2026  
**Version**: 1.0  
**Status**: Production Standards for Black Trigram (흑괘)

---

## 📋 Overview

This document establishes comprehensive component architecture patterns, performance baselines, and quality standards for all Black Trigram screen packages to ensure consistent 60fps performance, >85% test coverage, and Korean theming excellence.

### 🎯 Scope

- **Screen Packages**: 6 packages (combat, training, intro, endscreen, controls, philosophy)
- **Total Components**: ~84 screen component files, 83 test files
- **Performance Target**: 60fps on desktop, 55fps on mobile
- **Test Coverage Target**: >85% for all packages
- **Accessibility Target**: WCAG 2.1 AA compliance

---

## 🏗️ Standard Screen Component Architecture

### Core Pattern: React + Three.js Integration

All screen components follow this standardized structure:

```typescript
/**
 * Standard screen component structure
 * Follows Black Trigram architecture patterns
 */

import { Canvas } from '@react-three/fiber';
import { Html, PerspectiveCamera } from '@react-three/drei';
import { useMemo, useCallback, useState } from 'react';
import { KOREAN_COLORS, FONT_FAMILY } from '../../../types/constants';
import { getPerformanceSettings } from '../../../types/constants/performance';
import { detectPlatform, shouldUseMobileControls } from '../../../utils/deviceDetection';

export interface ScreenProps {
  /** Screen width in pixels */
  readonly width: number;
  /** Screen height in pixels */
  readonly height: number;
  /** Action callback handler */
  readonly onAction?: (action: ScreenAction) => void;
}

export const Screen3D: React.FC<ScreenProps> = ({ 
  width, 
  height, 
  onAction 
}) => {
  // 1. Device detection (determines mobile controls and sizing)
  const platform = useMemo(() => detectPlatform(), []);
  const showMobileControls = useMemo(() => shouldUseMobileControls(), []);
  
  // 2. Performance settings based on device and screen size
  const perfSettings = useMemo(
    () => getPerformanceSettings(width, platform.isMobile),
    [width, platform.isMobile]
  );

  // 3. Responsive layout calculations based on screen size
  const layout = useMemo(() => ({
    padding: width < 768 ? 10 : 20,
    fontSize: width < 768 ? 14 : 18,
    spacing: width < 768 ? 8 : 15,
    buttonSize: width < 768 ? 40 : 60,
  }), [width]);

  // 4. State management with proper typing
  const [screenState, setScreenState] = useState<ScreenState>({
    isLoading: false,
    selectedItem: null,
  });

  // 5. Event handlers with useCallback
  const handleAction = useCallback((action: string) => {
    onAction?.({ type: action, timestamp: Date.now() });
  }, [onAction]);

  return (
    <Canvas
      style={{ width, height }}
      gl={{ 
        antialias: perfSettings.antialias,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={perfSettings.dpr}
      shadows={perfSettings.shadowMapSize > 1024}
      data-testid="screen-canvas"
    >
      {/* 6. Korean-themed lighting */}
      <ambientLight intensity={0.4} color={KOREAN_COLORS.PRIMARY_CYAN} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[perfSettings.shadowMapSize, perfSettings.shadowMapSize]}
        color={KOREAN_COLORS.ACCENT_GOLD}
      />

      {/* 7. Camera setup */}
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />

      {/* 8. 3D Scene content (game objects) */}
      <SceneObjects state={screenState} />

      {/* 9. Html UI overlays (HUD elements) */}
      <Html fullscreen>
        <div 
          style={{ 
            padding: layout.padding,
            fontFamily: FONT_FAMILY.KOREAN,
          }}
          data-testid="screen-ui-overlay"
        >
          <ScreenUI 
            layout={layout} 
            state={screenState} 
            onAction={handleAction}
            showMobileControls={showMobileControls}
          />
        </div>
      </Html>

      {/* 10. Performance monitoring (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMonitor targetFPS={perfSettings.targetFPS} />
      )}
    </Canvas>
  );
};
``` 
            layout={layout} 
            state={screenState} 
            onAction={handleAction} 
          />
        </div>
      </Html>

      {/* 9. Performance monitoring (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMonitor targetFPS={perfSettings.targetFPS} />
      )}
    </Canvas>
  );
};
```

---

## 🔍 Device Detection & Responsive Design

### Device Detection Pattern

**ALWAYS use device detection utilities** instead of passing `isMobile` as a prop. Device detection should be performed inside components to determine:
1. Whether to show mobile controls (based on user-agent + touch capability)
2. Performance settings optimization
3. Responsive layout adjustments

```typescript
import { detectPlatform, shouldUseMobileControls } from '../../../utils/deviceDetection';

// Detect device type and capabilities
const platform = detectPlatform();
// Returns: { os, deviceType, hasTouch, isMobile, isTablet, isDesktop, screenWidth, screenHeight }

// Determine if mobile controls should be shown
const showMobileControls = shouldUseMobileControls();
// Returns: true for phones, tablets, and touch devices
```

### Why Device Detection Over Props

**❌ Don't pass `isMobile` as a prop**:
```typescript
// BAD: isMobile as prop
<Screen3D width={width} height={height} isMobile={true} />
```

**✅ Use device detection inside component**:
```typescript
// GOOD: Detect device inside component
const platform = useMemo(() => detectPlatform(), []);
const showMobileControls = useMemo(() => shouldUseMobileControls(), []);
```

**Benefits**:
- ✅ Correctly identifies high-resolution phones (2K/4K Android devices)
- ✅ Handles tablets and touch-enabled devices properly
- ✅ Single source of truth for device capabilities
- ✅ Automatically adapts to device changes
- ✅ User-agent detection takes priority over screen size

### Responsive Sizing Pattern

**All sizing should depend on screen resolution**, not device type:

```typescript
// ✅ GOOD: Size based on screen dimensions
const layout = useMemo(() => ({
  padding: width < 768 ? 10 : 20,
  fontSize: width < 768 ? 14 : width < 1024 ? 18 : 22,
  spacing: width < 768 ? 8 : 15,
  buttonSize: width < 768 ? 40 : 60,
}), [width]);

// ✅ GOOD: Breakpoint-based sizing
const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1440,
};

const isMobileSize = width < BREAKPOINTS.MOBILE;
const isTabletSize = width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.TABLET;
const isDesktopSize = width >= BREAKPOINTS.TABLET;
```

### Mobile Controls Display

```typescript
// Show mobile controls based on device detection
{showMobileControls && (
  <>
    <VirtualDPad />
    <ActionButtons />
  </>
)}

// Keyboard shortcuts for desktop
{!showMobileControls && (
  <KeyboardHints />
)}
```

---

## 📐 Component Organization Patterns

### File Structure Per Screen Package

```plaintext
src/components/screens/{screen-name}/
├── {ScreenName}3D.tsx           # Main screen component
├── {ScreenName}3D.test.tsx      # Screen tests (>85% coverage)
├── components/                   # Screen-specific components
│   ├── ui/                      # Html overlay components
│   │   ├── *OverlayHtml.tsx    # UI overlays (naming convention)
│   │   └── *.test.tsx
│   ├── three/                   # Three.js 3D components
│   │   ├── *3D.tsx             # 3D meshes (naming convention)
│   │   └── *.test.tsx
│   └── shared/                  # Shared components
│       ├── *.tsx
│       └── *.test.tsx
└── README.md                     # Screen-specific documentation
```

### Naming Conventions

#### Html Overlay Components (2D UI)
**Pattern**: `*OverlayHtml.tsx`

Html overlays are 2D UI elements rendered over the 3D scene using `<Html>` from `@react-three/drei`.

**Examples**:
- `TrainingStatsOverlayHtml.tsx` - Training statistics display
- `PlayerStateOverlayHtml.tsx` - Player health/status overlay
- `MenuSectionOverlayHtml.tsx` - Menu UI overlay
- `VitalPointOverlayControlsHtml.tsx` - Vital point targeting controls

**When to Use Html Overlays**:
- ✅ HUD elements (health bars, Ki meters, timers)
- ✅ Interactive buttons and menus
- ✅ Text-heavy UI (combat log, instructions)
- ✅ Form inputs and controls
- ✅ Bilingual text displays (Korean | English)

#### Three.js 3D Components
**Pattern**: `*3D.tsx`

3D components are Three.js meshes, groups, or effects rendered in the 3D scene.

**Examples**:
- `TrainingDummy3D.tsx` - 3D training dummy model
- `CombatArena3D.tsx` - 3D combat arena environment
- `VitalPointMarker3D.tsx` - 3D vital point indicators
- `Player3D.tsx` - 3D player character model

**When to Use 3D Components**:
- ✅ Game objects (characters, environment, props)
- ✅ Particle effects (blood, energy, impacts)
- ✅ Visual effects (stance auras, hit effects)
- ✅ 3D indicators (floating markers, direction arrows)
- ✅ Animated 3D elements (skeletal animations)

---

## 🎨 Korean Theming Standards

### Color Usage Patterns

**Primary Colors** (from `src/types/constants/colors.ts`):
```typescript
// ALWAYS use KOREAN_COLORS constants
import { KOREAN_COLORS } from '../../../types/constants';

// Cyberpunk neon accents
const primaryUI = KOREAN_COLORS.PRIMARY_CYAN;     // 0x00e6e6
const secondaryUI = KOREAN_COLORS.ACCENT_GOLD;    // 0xffc400

// Korean traditional colors (오방색)
const eastColor = KOREAN_COLORS.TRIGRAM_SON_PRIMARY;  // Wind (green)
const westColor = KOREAN_COLORS.TRIGRAM_GAM_PRIMARY;  // Water (blue)
const southColor = KOREAN_COLORS.TRIGRAM_LI_PRIMARY;  // Fire (orange-red)
const northColor = KOREAN_COLORS.TRIGRAM_GON_PRIMARY; // Earth (dark khaki)

// Combat effects
const criticalHit = KOREAN_COLORS.CRITICAL_HIT;       // 0xff4444
const perfectStrike = KOREAN_COLORS.PERFECT_STRIKE;   // 0xffc400
const vitalPoint = KOREAN_COLORS.VITAL_POINT_HIT;     // 0xff33ff
```

**WCAG 2.1 AA Compliance**:
- Text colors meet 4.5:1 contrast ratio on dark backgrounds
- UI elements meet 3:1 contrast ratio
- Focus indicators use 2px borders with high contrast

### Typography Standards

**Font Families** (from `src/types/constants/typography.ts`):
```typescript
import { FONT_FAMILY, getKoreanFontSize } from '../../../types/constants';

// Korean text ALWAYS uses Noto Sans KR
const koreanFont = FONT_FAMILY.KOREAN; // "Noto Sans KR", "Malgun Gothic"

// Cyberpunk titles
const cyberFont = FONT_FAMILY.CYBER; // "Orbitron", "Noto Sans KR"

// Responsive Korean text sizing
const fontSize = getKoreanFontSize('MEDIUM', width);
// Returns: 17px (320-380px), 18px (380-450px), 20px (450+px)
```

**Minimum Font Sizes**:
- Extra-small mobile (<380px): 15px minimum
- Small mobile (380-450px): 16px minimum
- Regular (450+px): 17px minimum

### Bilingual Text Pattern

**ALWAYS display Korean and English text together**:
```typescript
<Html center position={[0, 2, 0]}>
  <div
    style={{
      fontSize: getKoreanFontSize('MEDIUM', width),
      color: '#' + KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, '0'),
      fontFamily: FONT_FAMILY.KOREAN,
      fontWeight: 'bold',
    }}
    data-testid="bilingual-text"
  >
    {koreanText} | {englishText}
  </div>
</Html>
```

**Examples**:
- "건괘 | Heaven Stance"
- "급소격 | Vital Point Strike"
- "완벽한 타격 | Perfect Strike"

---

## ⚡ Performance Standards & Baselines

### Performance Targets by Device

| Device Category | Target FPS | Load Time | Memory Budget |
|----------------|-----------|-----------|---------------|
| Desktop (>1024px) | 60fps | <2s | <500MB |
| Tablet (768-1024px) | 55fps | <3s | <300MB |
| Mobile (380-768px) | 55fps | <3.5s | <200MB |
| Low-end Mobile (<380px) | 50fps | <4s | <150MB |

### Performance Settings by Tier

From `src/types/constants/performance.ts`:

```typescript
import { getPerformanceSettings } from '../../../types/constants/performance';
import { detectPlatform } from '../../../utils/deviceDetection';

// Automatically optimizes based on device and screen size
const platform = detectPlatform();
const settings = getPerformanceSettings(width, platform.isMobile);

// Returns:
// - maxParticles: 20 (low) to 100 (high)
// - shadowMapSize: 512 (low) to 2048 (high)
// - antialias: false (low) to true (high)
// - dpr: 1 (low) to [1, 3.5] (mobile-high)
// - postProcessing: false (mobile) to true (desktop)
// - targetFPS: 50 (low) to 60 (high)
```

### Performance Monitoring Pattern

**Frame Rate Tracking**:
```typescript
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export const PerformanceMonitor: React.FC<{ targetFPS: number }> = ({ targetFPS }) => {
  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef(Date.now());

  useFrame((state, delta) => {
    // Track frame time (target: ~16.67ms for 60fps)
    const now = Date.now();
    const frameTime = now - lastTimeRef.current;
    lastTimeRef.current = now;

    frameTimesRef.current.push(frameTime);
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift();
    }

    // Calculate average FPS
    const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / 
                         frameTimesRef.current.length;
    const currentFPS = 1000 / avgFrameTime;

    // Warn on frame drops
    if (delta > 0.02) { // ~50fps or lower
      console.warn(`Frame drop detected: ${currentFPS.toFixed(1)}fps (target: ${targetFPS}fps)`);
    }
  });

  return null;
};
```

---

## 🧪 Testing Standards

### Test Coverage Requirements

**Minimum Coverage**: >85% for all screen packages

**Coverage Breakdown**:
- Statements: >85%
- Branches: >80%
- Functions: >85%
- Lines: >85%

### Testing Structure Pattern

```typescript
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { describe, it, expect, vi } from 'vitest';
import { Suspense } from 'react';

describe('Screen3D', () => {
  // 1. Rendering tests
  it('should render without crashing', () => {
    const { container } = render(
      <Canvas>
        <Suspense fallback={null}>
          <Screen3D width={1200} height={800} />
        </Suspense>
      </Canvas>
    );
    
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  // 2. Responsive design tests
  it('should adapt layout for mobile screen size', () => {
    const { getByTestId } = render(
      <Canvas>
        <Suspense fallback={null}>
          <Screen3D width={375} height={667} />
        </Suspense>
      </Canvas>
    );
    
    const overlay = getByTestId('screen-ui-overlay');
    expect(overlay).toHaveStyle({ padding: '10px' });
  });

  // 3. Korean theming tests
  it('should apply Korean colors and fonts', () => {
    const { getByTestId } = render(
      <Canvas>
        <Suspense fallback={null}>
          <Screen3D width={1200} height={800} />
        </Suspense>
      </Canvas>
    );
    
    const text = getByTestId('bilingual-text');
    expect(text).toHaveStyle({ fontFamily: expect.stringContaining('Noto Sans KR') });
  });

  // 4. Performance tests
  it('should use appropriate performance settings', () => {
    const mockPerfSettings = vi.fn();
    // Test that performance settings are applied
  });

  // 5. Accessibility tests
  it('should have proper ARIA labels', () => {
    const { getByRole } = render(
      <Canvas>
        <Suspense fallback={null}>
          <Screen3D width={1200} height={800} />
        </Suspense>
      </Canvas>
    );
    
    // Test for proper ARIA labels and keyboard navigation
  });
});
```

### Testing Scenarios Per Screen

**Combat Screen**:
- Combat flow (attack, defend, stance change)
- HUD updates (health, Ki, stamina)
- AI behavior
- Performance under load (particles, animations)

**Training Screen**:
- Training mode selection
- Technique execution
- Progress tracking
- Performance with training dummy

**Intro Screen**:
- Menu navigation
- Archetype selection
- Settings changes
- Audio/video loading

**Controls Screen**:
- Control display
- Interactive tutorial
- Keyboard/touch input demonstration

**Philosophy Screen**:
- Trigram philosophy display
- Cultural information presentation
- Navigation between sections

**End Screen**:
- Victory/defeat display
- Statistics presentation
- Rematch/menu navigation

---

## ♿ Accessibility Standards (WCAG 2.1 AA)

### Keyboard Navigation

**Required Support**:
- Tab navigation through interactive elements
- Enter/Space for button activation
- Arrow keys for menu navigation
- Escape for modal dismissal

**Implementation Pattern**:
```typescript
const handleKeyDown = useCallback((event: KeyboardEvent) => {
  switch (event.key) {
    case 'Tab':
      // Cycle through focusable elements
      break;
    case 'Enter':
    case ' ':
      // Activate focused element
      break;
    case 'Escape':
      // Close modal or return to menu
      break;
    case 'ArrowUp':
    case 'ArrowDown':
      // Navigate menu items
      break;
  }
}, []);

useEffect(() => {
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [handleKeyDown]);
```

### Screen Reader Support

**ARIA Labels**:
```typescript
<button
  onClick={handleAction}
  aria-label="공격 | Attack - Execute current stance technique"
  data-testid="attack-button"
>
  공격 | Attack
</button>

<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  data-testid="health-status"
>
  Health: {health}% - {health > 70 ? 'Good' : health > 30 ? 'Warning' : 'Critical'}
</div>
```

### Focus Indicators

**ALWAYS provide visible focus indicators**:
```css
button:focus-visible {
  outline: 2px solid #00e6e6; /* KOREAN_COLORS.PRIMARY_CYAN */
  outline-offset: 2px;
}

.menu-item:focus-visible {
  border: 2px solid #ffc400; /* KOREAN_COLORS.ACCENT_GOLD */
  box-shadow: 0 0 8px rgba(0, 230, 230, 0.5);
}
```

---

## 📊 Current Performance Baselines (January 2026)

### Screen Package Analysis

| Screen Package | Components | Tests | Current Coverage | Performance Status |
|---------------|-----------|-------|------------------|-------------------|
| Combat | 35 files | 35 tests | ~80% | 60fps desktop, 55fps mobile |
| Training | 20 files | 20 tests | ~75% | 60fps desktop, 50fps mobile |
| Intro | 8 files | 8 tests | ~85% | 60fps all devices |
| Controls | 6 files | 6 tests | ~90% | 60fps all devices |
| Philosophy | 5 files | 5 tests | ~80% | 60fps all devices |
| EndScreen | 4 files | 4 tests | ~85% | 60fps all devices |

**Overall Metrics**:
- Total Components: 84 files
- Total Tests: 83 test files
- Average Coverage: ~79% (target: >85%)
- Target FPS: 60fps desktop, 55fps mobile
- Current Status: Meeting targets on most screens

### Known Performance Bottlenecks

1. **Combat Screen Particles**:
   - Issue: Particle count exceeds budget on low-end mobile
   - Target: Reduce to <20 particles on low-tier devices
   - Status: Optimization needed

2. **Training Screen Animation**:
   - Issue: Skeletal animation overhead on complex techniques
   - Target: Optimize bone transforms, use LOD system
   - Status: In progress

3. **Memory Usage**:
   - Issue: Memory growth over extended sessions
   - Target: Implement proper Three.js resource disposal
   - Status: Monitoring

---

## 🔧 Html Overlay vs 3D Mesh Decision Matrix

### Decision Criteria

| Use Case | Html Overlay | 3D Mesh | Rationale |
|----------|-------------|---------|-----------|
| Health bars | ✅ Preferred | ❌ Avoid | Better text rendering, easier styling |
| Player names | ✅ Preferred | ❌ Avoid | Font rendering, bilingual support |
| Menu buttons | ✅ Required | ❌ Never | Interactive form elements |
| Character models | ❌ Never | ✅ Required | 3D geometry, animations |
| Particle effects | ❌ Never | ✅ Required | WebGL performance |
| Combat log | ✅ Required | ❌ Never | Text-heavy, scrollable |
| Stance indicators | ⚠️ Both | ⚠️ Both | Html for UI, 3D for aura effects |
| Vital point markers | ⚠️ Both | ⚠️ Both | 3D for world space, Html for details |

### Hybrid Approach (Recommended)

```typescript
// Combine Html overlays with 3D meshes for best results
export const CombatSceneHybrid: React.FC = () => {
  return (
    <Canvas>
      {/* 3D game world */}
      <CombatArena3D />
      
      {/* 3D characters with skeletal animation */}
      <Player3D position={[-5, 0, 0]} stance="geon" />
      <Player3D position={[5, 0, 0]} stance="gam" />
      
      {/* 3D effects */}
      <StanceAura3D stance="geon" position={[-5, 1, 0]} />
      <HitEffect3D position={[0, 1.5, 0]} type="critical" />
      
      {/* Html UI overlays over 3D world */}
      <Html position={[-5, 2.5, 0]} center>
        <PlayerNametag name="무사 | Warrior" health={85} />
      </Html>
      
      <Html position={[5, 2.5, 0]} center>
        <PlayerNametag name="암살자 | Assassin" health={72} />
      </Html>
      
      {/* Fullscreen UI layer */}
      <Html fullscreen>
        <div className="hud-container">
          <CombatHUD />
          <ControlPanel />
        </div>
      </Html>
    </Canvas>
  );
};
```

---

## 📈 Performance Optimization Techniques

### Three.js Optimization

**1. Geometry Instancing** (for repeated objects):
```typescript
import { Instances, Instance } from '@react-three/drei';

// ✅ GOOD: Use instancing for repeated geometry
export const ParticleSystem: React.FC = () => {
  const particles = useMemo(() => 
    Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      position: [Math.random() * 20 - 10, Math.random() * 10, Math.random() * 20 - 10] as [number, number, number],
    })),
    []
  );

  return (
    <Instances limit={1000}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color={KOREAN_COLORS.PRIMARY_CYAN} />
      {particles.map((p) => (
        <Instance key={p.id} position={p.position} />
      ))}
    </Instances>
  );
};
```

**2. Level of Detail (LOD)**:
```typescript
import { Detailed } from '@react-three/drei';

export const OptimizedCharacter: React.FC = () => {
  return (
    <Detailed distances={[0, 10, 20]}>
      <HighDetailCharacter /> {/* Close range */}
      <MediumDetailCharacter /> {/* Medium range */}
      <LowDetailCharacter /> {/* Far range */}
    </Detailed>
  );
};
```

**3. Resource Disposal**:
```typescript
useEffect(() => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial();
  
  return () => {
    // ALWAYS clean up Three.js resources
    geometry.dispose();
    material.dispose();
  };
}, []);
```

**4. Memoization**:
```typescript
// ✅ GOOD: Memoize expensive calculations based on screen size
const layout = useMemo(
  () => calculateComplexLayout(width, height),
  [width, height]
);

const sharedGeometry = useMemo(
  () => new THREE.BoxGeometry(1, 1, 1),
  []
);

const sharedMaterial = useMemo(
  () => new THREE.MeshStandardMaterial({
    color: KOREAN_COLORS.ACCENT_GOLD,
    metalness: 0.5,
    roughness: 0.5,
  }),
  []
);
```

---

## 🎯 Quality Checklist for Screen Components

Before completing a screen component, verify:

### Architecture
- [ ] Uses standard screen component structure
- [ ] Follows naming conventions (*OverlayHtml.tsx vs *3D.tsx)
- [ ] Implements proper responsive design
- [ ] Uses performance settings based on device
- [ ] Separates Html overlays from 3D meshes appropriately

### Korean Theming
- [ ] Uses KOREAN_COLORS constants
- [ ] Applies Noto Sans KR font for Korean text
- [ ] Displays bilingual text (Korean | English)
- [ ] Implements cyberpunk Korean aesthetic
- [ ] Respects WCAG 2.1 AA contrast ratios

### Performance
- [ ] Achieves target FPS (60fps desktop, 55fps mobile)
- [ ] Load time within budget (<2s desktop, <3.5s mobile)
- [ ] Memory usage under limits
- [ ] Uses proper Three.js optimization (instancing, LOD, disposal)
- [ ] Includes performance monitoring in development

### Testing
- [ ] Test coverage >85%
- [ ] Rendering tests pass
- [ ] Responsive design tests pass
- [ ] Korean theming tests pass
- [ ] Performance tests pass
- [ ] Accessibility tests pass

### Accessibility
- [ ] Keyboard navigation supported
- [ ] ARIA labels provided
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] WCAG 2.1 AA compliant

### Documentation
- [ ] Component has JSDoc comments
- [ ] Props interface documented
- [ ] Korean terminology explained
- [ ] Performance considerations noted
- [ ] Usage examples provided

---

## 📚 Additional Resources

### Documentation
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Overall system architecture
- [UI/UX Architecture](./UI_UX_ARCHITECTURE.md) - UI component hierarchy
- [Performance Testing](../performance-testing.md) - Performance benchmarks
- [E2E Test Plan](../E2ETestPlan.md) - End-to-end testing strategy

### Code References
- `src/types/constants/` - Color, typography, performance constants
- `src/components/shared/` - Shared components and patterns
- `src/hooks/` - Reusable React hooks
- `src/systems/` - Game systems and logic

### External Standards
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Three.js Performance Tips](https://threejs.org/docs/index.html#manual/en/introduction/Performance-Tips)
- [React Three Fiber Best Practices](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial documentation: Architecture patterns, performance baselines, quality standards |

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
