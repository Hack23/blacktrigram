# GitHub Copilot Instructions for Black Trigram (흑괘)

PRIO 1: Follow existing React + Three.js patterns for 3D rendering and UI overlays
PRIO 2: Use established component structure and Korean martial arts theming
PRIO 3: Maintain type safety and proper error handling throughout

## 🔧 Current Code Patterns & Architecture

### React + Three.js Integration Pattern

```typescript
// ALWAYS follow this established pattern from existing components
import { Canvas } from '@react-three/fiber';
import { Html, PerspectiveCamera } from '@react-three/drei';
import { KOREAN_COLORS } from '../../types/constants';
import * as THREE from 'three';
import { useMemo } from 'react';

// Component structure with 3D scene
export const ComponentName: React.FC<Props> = ({ ...props }) => {
  // State management with proper typing
  const [state, setState] = useState<StateType>(initialValue);

  // Layout calculations for responsive design
  const layoutConstants = useMemo(
    () => ({
      padding: isMobile ? 10 : 20,
      headerHeight: isMobile ? 50 : 60,
      // ... other responsive calculations
    }),
    [isMobile]
  );

  return (
    <Canvas
      style={{ width, height }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      data-testid="component-name"
    >
      {/* 3D Scene content */}
      <ambientLight intensity={0.5} />
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      
      {/* UI Overlay using Html */}
      <Html fullscreen>
        <div style={{ padding: layoutConstants.padding }}>
          {/* Component UI content */}
        </div>
      </Html>
    </Canvas>
  );
};
```

### Three.js Scene Setup (From CombatScreen)

```typescript
// ALWAYS use proper lighting and camera setup
const sceneSetup = {
  camera: {
    position: [0, 5, 10] as [number, number, number],
    fov: 75,
  },
  lighting: {
    ambient: { intensity: 0.5, color: KOREAN_COLORS.PRIMARY_CYAN },
    directional: { intensity: 1, position: [10, 10, 5] as [number, number, number] },
  },
};

// Scene component pattern
<Canvas gl={{ antialias: true, alpha: true }}>
  <ambientLight 
    intensity={sceneSetup.lighting.ambient.intensity}
    color={sceneSetup.lighting.ambient.color}
  />
  <directionalLight 
    position={sceneSetup.lighting.directional.position}
    intensity={sceneSetup.lighting.directional.intensity}
    castShadow
  />
  <PerspectiveCamera 
    makeDefault 
    position={sceneSetup.camera.position} 
    fov={sceneSetup.camera.fov} 
  />
</Canvas>
```

### Korean Theming Pattern

```typescript
// ALWAYS use Korean colors and bilingual text
import { KOREAN_COLORS, FONT_FAMILY } from "../../types/constants";

// Bilingual text pattern using Html overlay
<Html center position={[0, 2, 0]}>
  <div
    style={{
      fontSize: isMobile ? 14 : 18,
      color: KOREAN_COLORS.ACCENT_GOLD,
      fontFamily: FONT_FAMILY.KOREAN,
      fontWeight: "bold",
    }}
    data-testid="bilingual-text"
  >
    {korean} | {english}
  </div>
</Html>

// Enhanced 3D materials with Korean aesthetics
<mesh castShadow receiveShadow>
  <boxGeometry args={[width, height, 0.1]} />
  <meshStandardMaterial
    color={KOREAN_COLORS.UI_BACKGROUND_DARK}
    emissive={KOREAN_COLORS.PRIMARY_CYAN}
    emissiveIntensity={0.2}
    metalness={0.5}
    roughness={0.5}
  />
</mesh>
```

### State Management Pattern

```typescript
// ALWAYS use proper typing and responsive state
interface ComponentState {
  readonly isActive: boolean;
  readonly selectedIndex: number;
  // ... other state properties
}

// State with proper initialization
const [componentState, setComponentState] = useState<ComponentState>({
  isActive: false,
  selectedIndex: 0,
});

// Event handlers with useCallback
const handleAction = useCallback(
  (param: string) => {
    // Action logic
    onAction?.(param);
  },
  [onAction]
);
```

### Component Props Interface Pattern

```typescript
// ALWAYS use readonly properties with explicit types
export interface ComponentProps {
  readonly width: number;
  readonly height: number;
  readonly x?: number;
  readonly y?: number;
  readonly isMobile?: boolean;
  readonly onAction?: (data: ActionData) => void;
  readonly children?: React.ReactNode;
}

// Default props in destructuring
export const Component: React.FC<ComponentProps> = ({
  width = 1200,
  height = 800,
  x = 0,
  y = 0,
  isMobile = false,
  onAction,
  children,
}) => {
  // Component implementation
};
```

### Responsive Design Pattern (From CombatScreen)

```typescript
// ALWAYS calculate responsive values
const isMobile = useMemo(() => width < 768, [width]);

const layoutCalculation = useMemo(() => ({
  buttonSize: isMobile ? 40 : 60,
  fontSize: isMobile ? 12 : 16,
  padding: isMobile ? 10 : 20,
  spacing: isMobile ? 8 : 15,
}), [isMobile]);

// Apply in UI overlays using Html
<Html fullscreen>
  <div
    style={{
      padding: layoutCalculation.padding,
      gap: layoutCalculation.spacing,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* UI content */}
  </div>
</Html>
```

### Audio Integration Pattern

```typescript
// ALWAYS use audio context from provider
import { useAudio } from "../../audio/AudioProvider";

export const Component: React.FC<Props> = ({ ... }) => {
  const audio = useAudio();

  const handleAction = useCallback(() => {
    audio.playSFX("menu_select");
    // Action logic
  }, [audio]);
};
```

### Error Handling & Testing Pattern

```typescript
// ALWAYS include data-testid for testing
<Canvas data-testid="unique-component-id">
  <group data-testid="game-objects">
    {/* 3D content */}
  </group>
  
  <Html fullscreen>
    <div data-testid="ui-overlay">
      {/* UI content */}
    </div>
  </Html>
</Canvas>

// ALWAYS handle potential null/undefined
const safeValue = value ?? defaultValue;

// ALWAYS use proper error boundaries
try {
  // Risky operation
} catch (error) {
  console.warn("Operation failed:", error);
  // Fallback behavior
}
```

## 📚 File Organization Patterns

### Component File Structure

```plaintext
src/components/
├── ui/                       # UI components with React + CSS
│   ├── base/                 # Base UI components with Korean theming
│   │   ├── KoreanButton.tsx # Button component with Korean styles
│   │   ├── KoreanPanel.tsx  # Panel component with Korean aesthetics
│   │   └── BaseComponents.tsx # Core React UI components
│   ├── combat/               # Combat-specific UI components
│   │   ├── TrigramSelector.tsx # Trigram stance selection component
│   │   ├── HealthBar.tsx    # Health bar with Korean aesthetics
│   │   └── VitalPointOverlay.tsx # Anatomical targeting interface
│   ├── containers/           # Layout containers and panels
│   │   ├── CombatHUD.tsx    # Main combat interface layout
│   │   └── PlayerStatusPanel.tsx # Player information display
│   └── texts/                # Text components with bilingual support
│       ├── BilingualText.tsx # Korean-English dual display
│       └── CombatLog.tsx    # Scrolling combat history
├── three/                    # Three.js 3D components
│   ├── scenes/               # 3D scene components
│   │   ├── CombatScene.tsx  # Main 3D combat scene
│   │   └── TrainingScene.tsx # Training area 3D scene
│   ├── models/               # 3D model components
│   │   ├── Character3D.tsx  # Player/enemy 3D models
│   │   └── Environment3D.tsx # Environment objects
│   └── effects/              # 3D visual effects
│       ├── ParticleEffects.tsx # Particle systems
│       └── StanceAura3D.tsx # Stance visual effects
├── audio/                    # Audio context and hooks
│   ├── AudioProvider.ts     # Context provider for audio
│   └── sounds/               # Audio files and assets
├── hooks/                    # Custom hooks
│   ├── useCombat.ts         # Combat-related hooks
│   ├── usePlayer.ts         # Player state hooks
│   └── useThreeScene.ts     # Three.js scene management hooks
├── screens/                  # Screen components
│   ├── CombatScreen.tsx     # Main combat screen with 3D
│   ├── IntroScreen.tsx      # Introduction and menu screen
│   └── SettingsScreen.tsx   # Settings and configuration screen
└── utils/                   # Utility functions and constants
    ├── constants.ts         # Constant values and configurations
    ├── threeHelpers.ts      # Three.js utility functions
    └── helpers.ts           # General helper functions
```

### Component Design Principles

- **Three.js Foundation**: All 3D content uses @react-three/fiber and @react-three/drei
- **Html Overlays**: Use Html from @react-three/drei for UI elements over 3D scenes
- **Korean Theming**: Consistent cyberpunk Korean aesthetic with traditional color harmony
- **Extensibility**: Components designed for easy customization and extension
- **Composition**: Build complex interfaces through component composition
- **Responsiveness**: All components adapt to mobile, tablet, and desktop screen sizes

### Three.js Component Extensions for Korean Martial Arts

| **Base Pattern** | **Korean Extension** | **Features**                      | **Use Case**                     |
| --------------------------- | -------------------- | ---------------------------------------- | -------------------------------- |
| `mesh`                    | `KoreanStyledMesh`       | Korean color materials, emissive effects  | Game objects with Korean aesthetics |
| `group`               | `CharacterGroup`      | Stance-based positioning, animations      | Character models in eight trigram stances   |
| `Html`               | `KoreanHUD`, `StatusPanel` | Bilingual text, responsive layout   | Combat HUD and player information          |
| `pointLight`                | `StanceAura`    | Color-coded by stance, pulsing effects          | Trigram stance visual indicators       |
| `particleSystem`                 | `CombatEffects`          | Korean-themed particles, impact effects             | Attack and defense visual feedback         |
| `Canvas`                 | `GameCanvas`        | Korean color scheme, optimized settings   | Main game rendering surface     |

## 🔧 Three.js 3D & UI Implementation Patterns

### Responsive Layout Patterns with Html Overlays

```typescript
// Korean-themed responsive layout constants
export const KOREAN_LAYOUTS = {
  // Main combat HUD layout
  COMBAT_HUD: {
    position: 'fixed' as const,
    width: '100%',
    height: '80px',
    display: 'flex',
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '10px 20px',
  },

  // Trigram stance selector grid
  TRIGRAM_GRID: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    gap: '15px',
    maxWidth: '400px',
    padding: '20px',
  },

  // Player status panel layout
  PLAYER_STATUS: {
    width: '200px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    padding: '15px',
    backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
    borderRadius: '8px',
  },

  // Mobile-optimized layouts
  MOBILE_COMBAT_HUD: {
    width: '100%',
    height: '60px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    gap: '5px',
    padding: '10px',
  },
} as const;
```

### Korean UI Color System

```typescript
export const KOREAN_COLORS = {
  // Primary cyberpunk Korean colors
  PRIMARY_CYAN: 0x00ffff,
  SECONDARY_YELLOW: 0xffd700,
  ACCENT_GOLD: 0xffaa00,
  ACCENT_BLUE: 0x0088ff,

  // UI background colors
  UI_BACKGROUND_DARK: 0x1a1a1a,
  UI_BACKGROUND_MEDIUM: 0x2d2d2d,
  UI_BACKGROUND_LIGHT: 0x404040,

  // Korean traditional colors (오방색)
  CARDINAL_EAST: 0x00ff88, // 동방 청색
  CARDINAL_WEST: 0xffffff, // 서방 백색
  CARDINAL_SOUTH: 0xff4444, // 남방 적색
  CARDINAL_NORTH: 0x000000, // 북방 흑색
  CARDINAL_CENTER: 0xffaa00, // 중앙 황색
} as const;
```

## 🎮 Three.js 3D Integration Patterns

### Canvas Setup with Korean Theming

```typescript
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Html, Stats } from '@react-three/drei';
import { KOREAN_COLORS } from '../../types/constants';
import * as THREE from 'three';

interface Scene3DWrapperProps {
  readonly width: number;
  readonly height: number;
  readonly children: React.ReactNode;
  readonly showStats?: boolean;
}

export const Scene3DWrapper: React.FC<Scene3DWrapperProps> = ({
  width,
  height,
  children,
  showStats = false,
}) => {
  return (
    <Canvas
      style={{ width, height }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
      shadows
      onCreated={({ gl, scene }) => {
        // Korean cyberpunk background
        gl.setClearColor(KOREAN_COLORS.UI_BACKGROUND_DARK, 1);
        scene.fog = new THREE.Fog(
          KOREAN_COLORS.UI_BACKGROUND_DARK,
          10,
          50
        );
      }}
    >
      {/* Korean-themed lighting */}
      <ambientLight intensity={0.4} color={KOREAN_COLORS.PRIMARY_CYAN} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color={KOREAN_COLORS.ACCENT_GOLD}
      />
      <pointLight
        position={[-10, 5, -5]}
        intensity={0.5}
        color={KOREAN_COLORS.ACCENT_BLUE}
      />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />

      {/* Game content */}
      {children}

      {/* Performance stats in development */}
      {showStats && process.env.NODE_ENV === 'development' && (
        <Html fullscreen>
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <Stats />
          </div>
        </Html>
      )}
    </Canvas>
  );
};
```

### useFrame Animation Pattern

```typescript
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

// ALWAYS use useFrame for 60fps animations
export const AnimatedCharacter: React.FC<CharacterProps> = ({
  position,
  stance,
  isMoving,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const velocityRef = useRef(new THREE.Vector3());

  // Game loop at 60fps
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Update velocity based on stance
    const targetVelocity = calculateStanceVelocity(stance, isMoving);
    velocityRef.current.lerp(targetVelocity, 0.1);

    // Update position
    groupRef.current.position.add(
      velocityRef.current.clone().multiplyScalar(delta)
    );

    // Breathing animation (Note: For many characters, consider batching or using shaders)
    const breathScale = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 1;
    groupRef.current.scale.y = breathScale;

    // Combat stance rotation
    const targetRotation = getStanceRotation(stance);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      0.1
    );
  });

  return (
    <group ref={groupRef} position={position}>
      <CharacterMesh stance={stance} />
      <StanceAuraEffect stance={stance} />
    </group>
  );
};
```

### Html Overlay vs 3D Mesh Decision

**Use Html Overlays for:**
```typescript
import { Html } from '@react-three/drei';

// ✅ UI elements (buttons, text, stats)
export const PlayerHUD3D: React.FC = ({ player }) => {
  return (
    <Html
      position={[0, 2.5, 0]}
      center
      distanceFactor={10}
      occlude={false}
      style={{ pointerEvents: 'all' }}
    >
      <div style={{
        background: `${KOREAN_COLORS.UI_BACKGROUND_DARK}dd`,
        border: `2px solid ${KOREAN_COLORS.PRIMARY_CYAN}`,
        borderRadius: '8px',
        padding: '12px',
        fontFamily: 'Korean Font',
      }}>
        <div>{player.nameKorean} | {player.name}</div>
        <HealthBar value={player.health} />
        <StanceIndicator stance={player.stance} />
      </div>
    </Html>
  );
};

// ✅ Interactive menus
export const CombatMenu3D: React.FC = ({ onAction }) => {
  return (
    <Html fullscreen>
      <div style={{ 
        position: 'absolute', 
        bottom: 20, 
        left: '50%', 
        transform: 'translateX(-50%)'
      }}>
        <button onClick={() => onAction('attack')}>
          공격 | Attack
        </button>
        <button onClick={() => onAction('defend')}>
          방어 | Defend
        </button>
      </div>
    </Html>
  );
};
```

**Use 3D Meshes for:**
```typescript
// ✅ Game objects, characters, effects
export const CombatCharacter3D: React.FC = ({ 
  position, 
  stance, 
  isAttacking 
}) => {
  return (
    <group position={position}>
      {/* Character mesh with Korean-themed materials */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.5, 1.5, 16, 32]} />
        <meshStandardMaterial
          color={getStanceColor(stance)}
          emissive={KOREAN_COLORS.PRIMARY_CYAN}
          emissiveIntensity={isAttacking ? 0.5 : 0.1}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Particle effects */}
      {isAttacking && (
        <AttackParticles color={KOREAN_COLORS.ACCENT_GOLD} />
      )}

      {/* Stance aura (3D effect) */}
      <StanceAura3D stance={stance} />
    </group>
  );
};

// ✅ Visual effects
export const HitEffect3D: React.FC = ({ position, type }) => {
  return (
    <group position={position}>
      <pointLight
        intensity={2}
        distance={5}
        decay={2}
        color={type === 'critical' 
          ? KOREAN_COLORS.CARDINAL_SOUTH 
          : KOREAN_COLORS.ACCENT_GOLD
        }
      />
      <ImpactParticles count={50} spread={2} />
    </group>
  );
};
```

**Hybrid Approach (Recommended):**
```typescript
// ✅ Combine both for best results
export const CombatSceneHybrid: React.FC = () => {
  return (
    <Scene3DWrapper width={1200} height={800}>
      {/* 3D game world */}
      <CombatArena />
      
      {/* 3D characters */}
      <CombatCharacter3D position={[-5, 0, 0]} stance="geon" />
      <CombatCharacter3D position={[5, 0, 0]} stance="gon" />
      
      {/* 3D effects */}
      <ParticleSystem3D />
      
      {/* Html UI overlays */}
      <Html position={[-5, 2.5, 0]} center>
        <PlayerNametag name="Player 1" health={85} />
      </Html>
      
      <Html position={[5, 2.5, 0]} center>
        <PlayerNametag name="Player 2" health={72} />
      </Html>
      
      {/* Fullscreen UI */}
      <Html fullscreen>
        <CombatHUD />
        <ControlPanel />
      </Html>
    </Scene3DWrapper>
  );
};
```

### TypeScript Types for Three.js

```typescript
// ALWAYS use proper types from three package
import * as THREE from 'three';
import { ThreeEvent, RootState } from '@react-three/fiber';

// Mesh references
interface MeshRef {
  current: THREE.Mesh | null;
}

interface GroupRef {
  current: THREE.Group | null;
}

// Event handlers
type PointerEventHandler = (event: ThreeEvent<PointerEvent>) => void;
type ClickEventHandler = (event: ThreeEvent<MouseEvent>) => void;

// Component props with Three.js types
interface Mesh3DProps {
  readonly position?: THREE.Vector3Tuple;
  readonly rotation?: THREE.EulerTuple;
  readonly scale?: number | THREE.Vector3Tuple;
  readonly color?: THREE.ColorRepresentation;
  readonly onClick?: ClickEventHandler;
  readonly onPointerOver?: PointerEventHandler;
  readonly onPointerOut?: PointerEventHandler;
}

// Material configuration
interface KoreanMaterialConfig {
  readonly color: number;
  readonly metalness?: number;
  readonly roughness?: number;
  readonly emissive?: number;
  readonly emissiveIntensity?: number;
  readonly transparent?: boolean;
  readonly opacity?: number;
}

// Scene state
interface Scene3DState {
  readonly camera: THREE.PerspectiveCamera;
  readonly scene: THREE.Scene;
  readonly gl: THREE.WebGLRenderer;
  readonly clock: THREE.Clock;
}
```

### Performance Optimization for Three.js

```typescript
// ✅ Use instancing for repeated geometry
import { Instances, Instance } from '@react-three/drei';

export const OptimizedParticles: React.FC = () => {
  const particles = useMemo(
    () => Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      position: [
        Math.random() * 20 - 10,
        Math.random() * 10,
        Math.random() * 20 - 10,
      ] as [number, number, number],
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

// ✅ Use LOD for distant objects
import { Detailed } from '@react-three/drei';

export const OptimizedCharacter: React.FC = () => {
  return (
    <Detailed distances={[0, 10, 20]}>
      <HighDetailCharacter />
      <MediumDetailCharacter />
      <LowDetailCharacter />
    </Detailed>
  );
};

// ✅ Memoize geometries and materials
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

// ✅ Clean up resources
useEffect(() => {
  return () => {
    sharedGeometry.dispose();
    sharedMaterial.dispose();
  };
}, [sharedGeometry, sharedMaterial]);
```

### Testing Three.js Components

```typescript
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { describe, it, expect } from 'vitest';
import { Suspense } from 'react';

// Helper to render Three.js components
function render3D(component: React.ReactElement) {
  return render(
    <Canvas>
      <Suspense fallback={null}>
        {component}
      </Suspense>
    </Canvas>
  );
}

describe('CombatCharacter3D', () => {
  it('should render without crashing', () => {
    const { container } = render3D(
      <CombatCharacter3D 
        position={[0, 0, 0]} 
        stance="geon" 
      />
    );

    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('should apply Korean theming', () => {
    const { container } = render3D(
      <CombatCharacter3D 
        position={[0, 0, 0]} 
        stance="geon" 
      />
    );

    // Test that component renders
    expect(container).toBeTruthy();
  });
});

// For more complex 3D testing, use @react-three/test-renderer
// See: https://github.com/pmndrs/react-three-fiber/tree/master/packages/test-renderer
```

## 🧪 Testing Strategy

### Three.js Component Testing

```typescript
// Test pattern for Korean Three.js components
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';

describe("KoreanTrigramSelector3D", () => {
  it("should render all eight trigram options in 3D", () => {
    const { container } = render(
      <Canvas>
        <TrigramSelector3D onStanceChange={mockHandler} />
      </Canvas>
    );

    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it("should respond to stance selection", async () => {
    const onStanceChange = vi.fn();
    const { container } = render(
      <Canvas>
        <TrigramSelector3D onStanceChange={onStanceChange} />
      </Canvas>
    );

    // Test interaction logic
    // Note: 3D interaction testing requires special setup
    expect(container).toBeTruthy();
  });

  it("should adapt for mobile screens", () => {
    const { container } = render(
      <Canvas style={{ width: 400, height: 600 }}>
        <TrigramSelector3D responsive />
      </Canvas>
    );

    expect(container.querySelector('canvas')).toHaveStyle({ width: '400px' });
  });
});
```

### Test Coverage Goals

- Three.js component tests: >85% coverage (3D testing complexity)
- UI component tests: >95% coverage
- Korean text rendering tests: 100% accuracy validation
- Accessibility tests: >85% coverage

## 🎮 Korean Martial Arts Integration

### Eight Trigram System (팔괘 체계)

- **☰ 건 (Geon)** - Heaven: Direct force techniques
- **☱ 태 (Tae)** - Lake: Fluid joint manipulation
- **☲ 리 (Li)** - Fire: Precise nerve strikes
- **☳ 진 (Jin)** - Thunder: Explosive power techniques
- **☴ 손 (Son)** - Wind: Continuous pressure attacks
- **☵ 감 (Gam)** - Water: Flow and adaptation techniques
- **☶ 간 (Gan)** - Mountain: Defensive mastery
- **☷ 곤 (Gon)** - Earth: Grounding and takedown techniques

### Player Archetypes (플레이어 원형)

- **무사 (Musa)** - Traditional Warrior: Honor through disciplined strength
- **암살자 (Amsalja)** - Shadow Assassin: Precision through stealth
- **해커 (Hacker)** - Cyber Warrior: Technology-enhanced combat
- **정보요원 (Jeongbo Yowon)** - Intelligence Operative: Strategic analysis
- **조직폭력배 (Jojik Pokryeokbae)** - Organized Crime: Ruthless pragmatism

## 🌟 Success Criteria

When following these guidelines, code should:

- ✅ Use Three.js with @react-three/fiber for 3D rendering
- ✅ Use Html overlays from @react-three/drei for UI elements
- ✅ Implement responsive layouts that work across all screen sizes
- ✅ Include proper Korean-English bilingual support
- ✅ Follow accessibility best practices with proper test IDs
- ✅ Maintain cyberpunk Korean aesthetic consistently
- ✅ Achieve 60fps performance for all 3D rendering and interactions
- ✅ Provide comprehensive test coverage for all components
- ✅ Use proper Three.js optimization techniques (instancing, LOD, etc.)

## 🎯 Philosophy Integration

**Remember**: Black Trigram represents the intersection of traditional Korean martial arts wisdom and modern interactive technology. Every component should honor this balance while providing authentic, educational, and respectful user experience through 3D immersion and extensible design patterns.

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

### Code Completion Anti-Patterns to Avoid

- ❌ Using Html overlays for everything (prefer 3D meshes for in-world objects)
- ❌ Creating new Three.js objects every frame (causes performance issues)
- ❌ Hardcoded positioning instead of responsive design
- ❌ Missing Korean cultural context in component design
- ❌ Non-extensible component implementations
- ❌ Incomplete accessibility implementation
- ❌ Not cleaning up Three.js resources on unmount
- ❌ Performance-heavy operations without optimization

## 🧪 Testing Strategy

### Existing Test Infrastructure (✅ Excellent)

- **Setup**: `src/test/setup.ts` - Audio and Three.js mocking
- **Utils**: `src/test/test-utils.ts` - Testing utilities
- **Audio Tests**: Comprehensive coverage in `src/audio/__tests__/`
- **System Tests**: Coverage for combat systems

### Test Patterns to Follow

Testing best practices, using test id in code, testable code and resilient test

## 🎯 Core Game Design Philosophy

### Combat Pillars (Must Guide All Implementation)

- **정격자 (Jeonggyeokja)** - Precision Striker: Every strike targets anatomical vulnerabilities
- **비수 (Bisu)** - Lethal Technique: Realistic application of traditional martial arts
- **암살자 (Amsalja)** - Combat Specialist: Focus on immediate incapacitation
- **급소격 (Geupsogyeok)** - Vital Point Strike: Authentic pressure point combat

### Realistic Combat Mechanics

## 👤 Player Archetypes (Must Reference in All Combat Code)

## 🎨 Visual Design System

### Cyberpunk Korean Aesthetic (Apply to All Visual Components)

## 🎮 Combat Controls & UX

### Precision Input System (Implement in All Combat Components)

#### Primary Combat Controls

```typescript
// Combat control mapping
const COMBAT_CONTROLS = {
  // Trigram stance system (1-8 keys)
  stanceControls: {
    "1": { stance: "geon", korean: "건", technique: "천둥벽력" },
    "2": { stance: "tae", korean: "태", technique: "유수연타" },
    "3": { stance: "li", korean: "리", technique: "화염지창" },
    "4": { stance: "jin", korean: "진", technique: "벽력일섬" },
    "5": { stance: "son", korean: "손", technique: "선풍연격" },
    "6": { stance: "gam", korean: "감", technique: "수류반격" },
    "7": { stance: "gan", korean: "간", technique: "반석방어" },
    "8": { stance: "gon", korean: "곤", technique: "대지포옹" },
  },

  // Movement and combat actions
  movement: {
    WASD: "Tactical positioning and footwork",
    ArrowKeys: "Alternative movement system",
  },

  combat: {
    SPACE: "Execute current stance technique",
    SHIFT: "Defensive guard/block position",
    CTRL: "Precision vital point targeting mode",
    TAB: "Cycle through player archetypes",
  },

  // System controls
  system: {
    ESC: "Pause menu / Return to intro",
    F1: "Help / Controls guide",
    M: "Mute / Audio settings",
  },
};

// Implement responsive controls
function handleCombatInput(event: KeyboardEvent, player: PlayerState) {
  const key = event.key;

  // Stance changes (1-8)
  if (key >= "1" && key <= "8") {
    const stanceIndex = parseInt(key) - 1;
    const stance = TRIGRAM_STANCES_ORDER[stanceIndex];
    return executeStanceChange(player, stance);
  }

  // Combat actions
  switch (key) {
    case " ": // Space
      return executeTechnique(player);
    case "Shift":
      return toggleGuard(player);
    case "Control":
      return enterVitalPointMode(player);
  }
}
```

## 🌟 Success Criteria

When following these guidelines, code should:

- ✅ Implement authentic Korean martial arts mechanics
- ✅ Respect traditional Korean culture and terminology
- ✅ Achieve realistic combat physics and feedback
- ✅ Maintain cyberpunk aesthetic integration
- ✅ Provide comprehensive accessibility features
- ✅ Target 60fps performance for all combat
- ✅ Use existing type system and components extensively
- ✅ Include proper Korean-English bilingual support

## 🔨 Build and Development Workflow

### Essential Commands

```bash
# Development
npm run dev              # Start development server with hot reload
npm run check            # Run TypeScript type checking
npm run lint             # Run ESLint for code quality

# Building
npm run build            # Production build with optimizations
npm run build:analyze    # Build with bundle size analysis
npm run preview          # Preview production build locally

# Testing
npm test                 # Run unit tests with Vitest
npm run coverage         # Run tests with coverage report
npm run test:e2e         # Run Cypress E2E tests
npm run test:systems     # Run combat system tests

# Code Quality
npm run find:unused      # Find unused code with Knip
npm run test:licenses    # Validate dependency licenses
npm run validate:mcp     # Validate Copilot MCP configuration
npm run docs             # Generate TypeDoc documentation
```

### Development Workflow

1. **Before coding**: Run `npm run check` and `npm run lint` to ensure clean baseline
2. **During development**: Use `npm run dev` for hot reload testing
3. **Before committing**: Run `npm run lint`, `npm run check`, and `npm test`
4. **For PRs**: Ensure `npm run test:e2e` passes and review `npm run coverage`

### TypeScript Configuration

- **Strict mode enabled**: All code must pass strict TypeScript checks
- **No implicit any**: Always provide explicit types
- **Readonly properties**: Prefer readonly for interfaces and props
- **Proper null handling**: Use `??` for null coalescing, avoid `||` where possible

## 📦 Dependency Management

### Adding Dependencies

**ALWAYS check security before adding dependencies:**

```bash
# Check for vulnerabilities before adding
npm audit
npm run test:licenses

# Add dependency with exact version
npm install --save-exact package-name@version

# Development dependencies
npm install --save-dev --save-exact package-name@version
```

### Approved Dependency Categories

- ✅ **Core**: React 19, Three.js, TypeScript
- ✅ **3D**: @react-three/fiber, @react-three/drei
- ✅ **Audio**: Howler.js
- ✅ **Testing**: Vitest, Cypress, Testing Library
- ✅ **Build**: Vite, ESLint, TypeScript
- ⚠️ **New dependencies**: Must pass security audit and license check

### Dependency Update Policy

- **Security updates**: Apply immediately
- **Minor/patch updates**: Test thoroughly before merging
- **Major updates**: Requires architecture review and comprehensive testing
- **Deprecated packages**: Plan migration path before removal

## 🔍 Code Review Standards

### Before Requesting Review

- [ ] All tests pass (`npm test` and `npm run test:e2e`)
- [ ] No TypeScript errors (`npm run check`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Coverage maintained or improved (`npm run coverage`)
- [ ] Documentation updated (JSDoc, README, etc.)
- [ ] MCP configuration validated (`npm run validate:mcp`)
- [ ] No unused code (`npm run find:unused`)
- [ ] License compliance verified (`npm run test:licenses`)

### Code Review Checklist

**Architecture & Design:**
- [ ] Follows established React + Three.js patterns
- [ ] Uses Html overlays appropriately for UI
- [ ] Korean theming applied consistently
- [ ] Proper component composition

**Code Quality:**
- [ ] Type-safe with strict TypeScript
- [ ] Proper error handling and null checks
- [ ] Performance optimized (60fps target)
- [ ] No console.log in production code
- [ ] Proper use of useMemo/useCallback for optimization

**Testing:**
- [ ] Unit tests for all new logic
- [ ] E2E tests for user workflows
- [ ] Test IDs added to interactive elements
- [ ] Edge cases covered

**Documentation:**
- [ ] JSDoc comments for public APIs
- [ ] README updated if user-facing changes
- [ ] Korean-English bilingual text provided
- [ ] ARCHITECTURE.md updated if structure changes

### Common Review Feedback

**Avoid:**
- ❌ Hardcoded positioning (use layout system)
- ❌ Missing data-testid attributes
- ❌ Non-readonly interface properties
- ❌ Using `||` instead of `??` for defaults
- ❌ Missing Korean cultural context
- ❌ Performance-heavy operations without optimization
- ❌ Incomplete error handling

**Prefer:**
- ✅ Html overlays for UI, 3D meshes for game objects
- ✅ Comprehensive test coverage
- ✅ Explicit typing (no implicit any)
- ✅ Korean-English bilingual support
- ✅ Proper component abstraction
- ✅ Performance monitoring

## ⚠️ Common Pitfalls and Solutions

### Three.js Integration Issues

**Pitfall**: Creating new Three.js objects every frame
```typescript
// ❌ BAD: Creating new objects in useFrame
useFrame(() => {
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  mesh.material = material;
});

// ✅ GOOD: Reuse objects with useMemo
const material = useMemo(
  () => new THREE.MeshStandardMaterial({ color: KOREAN_COLORS.PRIMARY_CYAN }),
  []
);
```

**Pitfall**: Memory leaks from Three.js objects
```typescript
// ✅ GOOD: Clean up in useEffect
useEffect(() => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial();
  
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);
```

### Korean Text Issues

**Pitfall**: Font not loading for Korean characters in Html overlays
```typescript
// ✅ GOOD: Use FONT_FAMILY.KOREAN constant
import { FONT_FAMILY } from "../../types/constants";

<Html center>
  <div style={{ fontFamily: FONT_FAMILY.KOREAN }}>
    한글 텍스트
  </div>
</Html>
```


### Type Safety Issues

**Pitfall**: Using non-null assertion operator
```typescript
// ❌ BAD: Unsafe non-null assertion
const value = getValue()!;

// ✅ GOOD: Proper null handling
const value = getValue();
if (value !== null) {
  // Use value safely
}
```

## 🎯 Philosophy Integration

**Remember**: Black Trigram represents the intersection of traditional Korean martial arts wisdom and modern interactive technology. Every implementation should honor this balance while providing authentic, educational, and respectful gameplay.

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
