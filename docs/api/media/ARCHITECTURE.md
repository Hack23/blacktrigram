# 🎮 Black Trigram (흑괘) – Technical Architecture

---

## 📚 Architecture Documentation Map

| Document                                                              | Focus            | Description                                                                                                |
| --------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| **[🌐 System Context](#-system-context)**                             | C4 Model         | High-level view showing actors (Player, CDNs) and the entirely front-end application                       |
| **[🏢 Container View](#-container-view)**                             | C4 Model         | Frontend-only architecture: UI Layer, Game Logic, Asset Loader, Renderer, and State Management             |
| **[🧩 Component View](#-component-view)**                             | C4 Model         | Detailed breakdown of all key modules: Combat System, Trigram System, Vital Point System, Audio, UI        |
| **[🔧 File Structure](#-file-structure-highlights)**                  | Organization     | Current project structure and key file locations                                                           |
| **[🔄 Combat Flow Sequence](#-combat-flow-sequence)**                 | Sequence Diagram | How input flows through logic to rendering and feedback in real time                                       |
| **[⚡ Security & Performance](#-security--performance-architecture)** | Performance      | Client-side performance profiling, optimization techniques, and graceful degradation strategies            |
| **[📊 SWOT Analysis](#-swot-analysis)**                               | Strategy         | Strengths, Weaknesses, Opportunities, Threats for a 100% frontend, no-persistence "Black Trigram" web game |
| **[🎯 Core Game Concepts](#-core-game-concepts)**                     | Game Design      | Player archetypes, trigram system, resources & mechanics                                                   |
| **[🏗️ Architecture Concepts](#-architecture-concepts)**               | Technical Design | Mindmap of system architecture layers and components                                                       |
| **[🔄 UX Flow](#-ux-flow)**                                           | User Experience  | User journey through screens and interactions                                                              |
| **[🔄 Combat Mechanics](#-combat-mechanics--data-relationships)**     | Game Mechanics   | Detailed combat system data flow and relationships                                                         |

---

## 🌐 System Context

```mermaid
C4Context
    title System Context - Black Trigram (흑괘) Web Application

    Person(player, "🧑‍🤝‍🧑 Martial Arts Student", "Learns Korean vital point targeting through realistic combat simulation")
    Person(instructor, "🥋 Martial Arts Instructor", "Uses for teaching traditional Korean techniques")
    
    System(blackTrigram, "🌐 Black Trigram (흑괘)", "Korean martial arts combat simulator with authentic vital point targeting")
    
    System_Ext(audioCDN, "🎵 Audio CDN", "Korean traditional music + cyberpunk SFX")
    System_Ext(artCDN, "🖼️ Visual Assets CDN", "Character sprites, UI elements, particle effects")
    System_Ext(culturalDB, "🏛️ Korean Cultural Database", "Authentic martial arts terminology, I Ching philosophy")

    Rel(player, blackTrigram, "Practices combat techniques", "HTTPS/WebGL")
    Rel(instructor, blackTrigram, "Demonstrates vital points", "HTTPS/WebGL")
    
    Rel(blackTrigram, audioCDN, "Streams traditional Korean audio", "HTTPS")
    Rel(blackTrigram, artCDN, "Loads visual assets", "HTTPS")
    Rel(blackTrigram, culturalDB, "References authentic terminology", "HTTPS/JSON")

    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
  ```

> **Legend**
>
> - 🧑‍🤝‍🧑 **Player**: End-user interacting with Black Trigram through desktop or mobile browser.
> - 🌐 **Black Trigram Web App**: Entirely front-end, built with React + PixiJS (TypeScript). All game logic, state, & rendering occur in-browser—no backend.
> - 🎵 **Audio CDN**: Serves SFX (bone cracks, impacts, ambient kyūdō sounds) and traditional Korean background music.
> - 🖼️ **Art CDN**: Serves character sprites, particle bitmaps (ki energy, blood splatter), UI icons, fonts (including Korean text), and other graphical assets.

---

## 🏢 Container View

```mermaid
C4Container
    title Container View - Black Trigram Performance Architecture

    Person(user, "🧑‍🤝‍🧑 User", "Practices Korean martial arts")

    System_Boundary(browserApp, "🌐 Black Trigram Browser Application") {
        Container(ui, "🖥️ React UI Layer", "React 19 + TypeScript", "Korean-themed components, responsive design")
        Container(gameEngine, "⚙️ Game Logic Engine", "TypeScript Modules", "Combat calculations, trigram system, vital points")
        Container(renderer, "🎨 PixiJS Renderer", "PixiJS 8 + WebGL", "60fps 2D graphics, particle systems, animations")
        Container(audioEngine, "🎵 Audio Engine", "Howler.js + Web Audio", "Korean traditional + cyberpunk audio")
        Container(stateManager, "🗄️ State Manager", "Zustand + React Context", "Game state, UI state, performance metrics")
        Container(assetLoader, "📦 Asset Loader", "PixiJS Assets + Custom", "Lazy loading, caching, compression")
        Container(perfMonitor, "📈 Performance Monitor", "Stats.js + Custom", "FPS tracking, memory usage, optimization")
    }

    Rel(user, ui, "Interacts via input", "Touch/Mouse/Keyboard")
    Rel(ui, gameEngine, "Dispatches actions", "Function calls")
    Rel(gameEngine, renderer, "Updates visuals", "PixiJS API")
    Rel(gameEngine, audioEngine, "Triggers sounds", "Howler.js API")
    Rel(gameEngine, stateManager, "Updates state", "Zustand actions")
    Rel(assetLoader, renderer, "Provides textures", "PixiJS Textures")
    Rel(assetLoader, audioEngine, "Provides audio", "Audio Buffers")
    Rel(perfMonitor, stateManager, "Reports metrics", "Performance data")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

> **Containers Overview**
>
> - **🖥️ UI Layer**:
>
>   - React + TypeScript functional components.
>   - Screens: `CombatScreen`, `TrainingScreen`, `IntroScreen`.
>   - Common UI: `CombatHUD`, `TrigramWheel`, `ProgressTracker`, etc.
>   - Base modules in base: `BaseButton`, `KoreanText`, `BackgroundGrid`, etc.
>   - CSS: App.css, `src/CombatScreen.css`, etc.

> - **⚙️ Game Logic Layer**:
>
>   - Under `src/systems/*`, `src/types/*`.
>   - **CombatSystem (src/systems/CombatSystem.ts)**: Orchestrates input → trigram → vital-point → damage → audio/visual.
>   - **TrigramSystem (src/systems/trigram/**)\*\*:
>
>     - `StanceManager.ts`: Tracks current stance, validates Ki/Stamina, handles transition cost.
>     - `TransitionCalculator.ts`: Computes validity of stance switches.
>     - `TrigramCalculator.ts`: Provides technique data & advantage multipliers.
>     - `KoreanCulture.ts`: Supplies I Ching lore, Korean labels/descriptions.
>
>   - **VitalPointSystem (src/systems/vitalpoint/**)\*\*:
>
>     - `KoreanAnatomy.ts` & `KoreanVitalPoints.ts`: Defines all 70 vital points (critical, secondary, standard) and multipliers.
>     - `HitDetection.ts`: Checks collisions between attack hitboxes & character bounding boxes.
>     - `DamageCalculator.ts`: Applies base damage × trigram advantage × vital-point multiplier.
>
>   - **AudioManager (src/audio/**)\*\*:
>
>     - `AudioAssetRegistry.ts`, `AudioManager.ts`, `AudioUtils.ts`, `DefaultSoundGenerator.ts`, `VariantSelector.ts`: Load & play SFX/music via Web Audio API.
>
>   - **Physics & AI** (planned under `src/systems/AISystem.ts`): Minimal NPC behaviors.

> - **📦 Asset Loader**:
>
>   - Asset loading via custom hooks and helpers for textures & JSON data.
>   - Helpers in playerUtils.ts, `colorUtils.ts` map asset keys to URLs.
>   - Dynamically import large JSON (e.g., `src/types/constants/trigram.ts`) at runtime.

> - **🎨 Rendering Engine**:
>
>   - Three.js (wrapped by `@react-three/fiber`) via GameEngine.tsx.
>   - Manages 3D scene with WebGL rendering via Canvas component.
>   - Renders: Character 3D models, environment, particles, and visual effects.
>   - UI overlays via Html component from `@react-three/drei` for HUD, health, Ki, stance indicators.

> - **🗄️ State Management**:
>
>   - In-browser only (no backend). Uses **Zustand** (or React Context fallback) under hooks.
>   - `useGameState.ts`, `useUIState.ts`, `useEnemyState.ts` store: health, stamina, Ki, current stance, enemy state, UI flags.
>   - **No Persistence**: Refresh resets all state / progress.

---

## 🧩 Component View

```mermaid
C4Component
    title Combat System Components - Korean Martial Arts Engine

    Container_Boundary(combatSystem, "⚙️ Combat System") {
        Component(combatController, "🥊 CombatController", "TypeScript", "Orchestrates all combat interactions")
        Component(inputHandler, "🎮 InputHandler", "TypeScript", "Processes keyboard/mouse/touch input")
        Component(trigramEngine, "☯️ TrigramEngine", "TypeScript", "Manages 8 trigram stances and transitions")
        Component(vitalPointEngine, "🎯 VitalPointEngine", "TypeScript", "Handles 70 vital point targeting system")
        Component(damageCalculator, "💥 DamageCalculator", "TypeScript", "Calculates realistic combat damage")
        Component(effectsProcessor, "✨ EffectsProcessor", "TypeScript", "Manages visual and audio effects")
    }

    Container_Boundary(dataLayer, "📊 Data Layer") {
        Component(koreanTerminology, "🇰🇷 KoreanTerminology", "JSON/TypeScript", "Authentic Korean martial arts terms")
        Component(anatomyData, "🫀 AnatomyData", "JSON/TypeScript", "Human anatomy and vital point locations")
        Component(trigramData, "📊 TrigramData", "JSON/TypeScript", "I Ching trigram relationships and techniques")
        Component(audioAssets, "🎵 AudioAssets", "WebM/OGG", "Korean traditional + cyberpunk audio")
    }

    Container_Boundary(rendering, "🎨 Rendering Layer") {
        Component(combatRenderer, "⚔️ CombatRenderer", "PixiJS", "Renders combat scenes and animations")
        Component(particleSystem, "✨ ParticleSystem", "PixiJS", "Ki energy, blood effects, impact sparks")
        Component(hudRenderer, "📊 HUDRenderer", "PixiJS", "Health bars, stance indicators, damage numbers")
    }

    Rel(inputHandler, combatController, "Sends input events")
    Rel(combatController, trigramEngine, "Requests stance changes")
    Rel(combatController, vitalPointEngine, "Checks hit targets")
    Rel(combatController, damageCalculator, "Calculates damage")
    Rel(damageCalculator, effectsProcessor, "Triggers effects")

    Rel(trigramEngine, trigramData, "Loads stance data")
    Rel(vitalPointEngine, anatomyData, "References vital points")
    Rel(combatController, koreanTerminology, "Gets Korean terms")
    Rel(effectsProcessor, audioAssets, "Plays sound effects")

    Rel(effectsProcessor, combatRenderer, "Updates visuals")
    Rel(effectsProcessor, particleSystem, "Spawns particles")
    Rel(combatController, hudRenderer, "Updates HUD")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

## Enhanced Icon Categories

### 🖥️ UI Layer Icons

- **📱 App** - Mobile-first application root
- **🏮 IntroScreen** - Traditional Korean lantern for welcome
- **⚔️ CombatScreen** - Crossed swords for combat
- **🎯 TrainingScreen** - Target for practice mode
- **🎮 GameUI** - Game controller for interface
- **📊 CombatHUD** - Chart/dashboard for HUD
- **☯️ TrigramWheel** - Yin-yang for Korean philosophy
- **🏁 EndScreen** - Checkered flag for completion
- **🔘 BaseButton** - Button for reusable component
- **🇰🇷 KoreanText** - Korean flag for Korean text
- **⚏ BackgroundGrid** - Grid pattern for overlay

### ⚙️ Game Logic Icons

- **🥊 CombatSystem** - Boxing glove for combat orchestration
- **🔶 TrigramSystem** - Diamond for trigram system
- **🥋 StanceManager** - Martial arts uniform for stance
- **🔄 TransitionCalculator** - Refresh for transitions
- **🧮 TrigramCalculator** - Abacus for calculations
- **🏛️ KoreanCulture** - Classical building for culture
- **🎯 VitalPointSystem** - Bullseye for targeting
- **🫀 AnatomicalRegions** - Heart for anatomy
- **💥 HitDetection** - Explosion for collision
- **🩸 DamageCalculator** - Blood drop for damage
- **🎵 AudioManager** - Musical note for audio
- **🎹 DefaultSoundGenerator** - Piano for sound generation
- **🎲 VariantSelector** - Dice for randomization

### 📦 Asset Loader Icons

- **🖼️ PixiLoader** - Framed picture for textures
- **🎧 AudioLoader** - Headphones for audio assets
- **📋 TrigramDataLoader** - Clipboard for data
- **🧬 VitalPointsDataLoader** - DNA for anatomical data

### 🗄️ State Management Icons

- **🎮 useGameState** - Game controller for game state
- **🖱️ useUIState** - Computer mouse for UI state
- **👹 useEnemyState** - Ogre for enemy state

### 🎨 Rendering Engine Icons

- **🎭 PixiStage** - Theater masks for stage
- **👤 PlayerVisuals** - Bust silhouette for player
- **👺 EnemyVisuals** - Goblin for enemy
- **✨ ParticlesLayer** - Sparkles for effects
- **🌅 DojangBackground** - Sunrise for environment

---

## 🎮 Three.js 3D Rendering Architecture

Black Trigram is transitioning from PixiJS (2D rendering) to Three.js (3D rendering) to enhance visual capabilities while maintaining Korean martial arts theming and 60fps performance.

### 📦 Three.js Dependencies

The following Three.js packages are now installed and configured:

- **three@0.181.2** - Core Three.js 3D engine with WebGL rendering
- **@react-three/fiber@9.4.0** - React renderer for Three.js (declarative 3D in React)
- **@react-three/drei@10.7.7** - Useful helpers and abstractions (@react-three/fiber)
- **@types/three@0.181.0** - TypeScript type definitions for Three.js

### 🏗️ Architecture Integration

```mermaid
graph TD
    subgraph "React 19 Application Layer"
        A[React Components]
        B[State Management - Zustand]
        C[Korean Theming - KOREAN_COLORS]
    end
    
    subgraph "Rendering Layer"
        D[@react-three/fiber Canvas]
        E[PixiJS 2D Renderer]
    end
    
    subgraph "Three.js 3D Scene"
        F[Scene Graph]
        G[3D Characters]
        H[Vital Point Markers]
        I[Particle Systems]
        J[Korean-Themed Materials]
        K[Lighting Setup]
    end
    
    subgraph "UI Overlay Layer"
        L[Html Components]
        M[Combat HUD]
        N[Status Panels]
    end
    
    A --> D
    A --> E
    B --> A
    C --> A
    C --> J
    
    D --> F
    F --> G
    F --> H
    F --> I
    F --> J
    F --> K
    
    D --> L
    L --> M
    L --> N
    
    style D fill:#00ffff,stroke:#333,stroke-width:3px
    style F fill:#ffd700,stroke:#333,stroke-width:3px
    style J fill:#ff4444,stroke:#333,stroke-width:2px
    style L fill:#98fb98,stroke:#333,stroke-width:2px
```

### 📐 Rendering Pipeline

```mermaid
sequenceDiagram
    participant React as React Component
    participant Canvas as @react-three/fiber Canvas
    participant Scene as Three.js Scene
    participant WebGL as WebGL Renderer
    participant Display as Browser Display
    
    React->>Canvas: Render 3D components
    Canvas->>Scene: Build scene graph
    Scene->>Scene: Apply Korean materials
    Scene->>Scene: Position characters
    Scene->>Scene: Update particles
    
    loop Animation Loop (60fps)
        Canvas->>Scene: useFrame hook
        Scene->>WebGL: Render scene
        WebGL->>Display: Draw to canvas
    end
    
    Note over React,Display: Html overlays render separately via React DOM
```

### 📁 File Structure

#### Current Implementation
- **src/components/test/**
  - `HelloThreeJS.tsx` - Test component demonstrating Three.js setup
  - `HelloThreeJS.test.tsx` - Unit tests for Three.js infrastructure
  - `HelloThreeJS-demo.tsx` - Interactive demo with controls

#### Planned Structure
```
src/components/combat/
├── characters/
│   ├── CharacterModel3D.tsx           # Base 3D character model
│   ├── VitalPointMarkers3D.tsx        # 70 vital points in 3D
│   ├── StanceAnimation3D.tsx          # Eight trigram stances
│   └── DamageVisualization3D.tsx      # Blood and injury effects
├── particles/
│   ├── KiEnergyParticles3D.tsx        # Ki energy particle system
│   ├── HitEffects3D.tsx               # Impact effects and sparks
│   └── BloodSplatter3D.tsx            # Realistic blood effects
├── arena/
│   ├── CombatArena3D.tsx              # Complete 3D combat scene
│   ├── DojangFloor3D.tsx              # Traditional dojang floor
│   └── KoreanLighting3D.tsx           # Korean-themed lighting setup
└── ui/
    ├── CombatHUDOverlay.tsx           # Html UI over 3D scene
    ├── PlayerNameplate3D.tsx          # Player info in 3D space
    └── VitalPointTooltip3D.tsx        # Interactive tooltips
```

### 🔧 Configuration

**Vite Configuration (`vite.config.ts`):**
```typescript
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      // Three.js dependencies
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      // Audio
      "howler",
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
```

**TypeScript Configuration (`tsconfig.json`):**
```json
{
  "compilerOptions": {
    "skipLibCheck": true,          // Handles Three.js type complexities
    "moduleResolution": "bundler",  // Optimized for Vite + Three.js
    "strict": true,                 // Strict type checking
    "jsx": "react-jsx",             // React 19 JSX transform
    "types": ["vite/client", "node"]
  }
}
```

**Test Setup (`src/test/setup.ts`):**
```typescript
// WebGL context mocking for Three.js tests
class MockWebGLRenderingContext {
  getExtension = vi.fn();
  getParameter = vi.fn();
  // ... full WebGL API mock
}

// ResizeObserver polyfill for @react-three/fiber
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = MockResizeObserver;
```

### 🎨 Core Patterns

#### Pattern 1: Canvas Setup with Korean Theming

```typescript
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { KOREAN_COLORS } from "../../types/constants";
import * as THREE from "three";

export function CombatScene3D() {
  return (
    <Canvas
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
        color={KOREAN_COLORS.ACCENT_GOLD}
      />
      
      {/* Environment reflections */}
      <Environment preset="city" />
      
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />
      
      {/* Game content */}
      <CombatArena3D />
    </Canvas>
  );
}
```

#### Pattern 2: useFrame Animation Loop

```typescript
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function AnimatedCharacter({ stance, health }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // 60fps animation loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Breathing animation
    const breathScale = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 1;
    meshRef.current.scale.y = breathScale;
    
    // Stance-based rotation
    meshRef.current.rotation.y = getStanceRotation(stance);
  });
  
  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <capsuleGeometry args={[0.5, 1.5, 16, 32]} />
      <meshStandardMaterial color={getHealthColor(health)} />
    </mesh>
  );
}
```

#### Pattern 3: Html Overlays for UI

{% raw %}
```typescript
import { Html } from "@react-three/drei";

export function PlayerNameplate3D({ name, nameKorean, health }) {
  return (
    <Html position={[0, 2.5, 0]} center>
      <div style={{
        background: `${KOREAN_COLORS.UI_BACKGROUND_DARK}cc`,
        border: `2px solid ${KOREAN_COLORS.PRIMARY_CYAN}`,
        borderRadius: '8px',
        padding: '12px',
        fontFamily: 'Korean Font',
      }}>
        <div style={{ color: KOREAN_COLORS.ACCENT_GOLD }}>
          {nameKorean} | {name}
        </div>
        <HealthBar health={health} />
      </div>
    </Html>
  );
}
```
{% endraw %}

#### Pattern 4: Korean Materials and Lighting

```typescript
// Eight Trigram color mapping
const TRIGRAM_COLORS: Record<TrigramStance, number> = {
  geon: KOREAN_COLORS.CARDINAL_CENTER,  // ☰ Heaven - Yellow
  tae: KOREAN_COLORS.PRIMARY_CYAN,      // ☱ Lake - Cyan
  li: KOREAN_COLORS.CARDINAL_SOUTH,     // ☲ Fire - Red
  jin: KOREAN_COLORS.SECONDARY_YELLOW,  // ☳ Thunder - Yellow
  son: KOREAN_COLORS.CARDINAL_EAST,     // ☴ Wind - Green
  gam: KOREAN_COLORS.ACCENT_BLUE,       // ☵ Water - Blue
  gan: KOREAN_COLORS.UI_BACKGROUND_LIGHT, // ☶ Mountain - Gray
  gon: KOREAN_COLORS.UI_BACKGROUND_DARK,  // ☷ Earth - Dark
};

// Cardinal directions lighting (오방색)
export function CardinalLighting() {
  return (
    <>
      <pointLight position={[10, 0, 0]} color={KOREAN_COLORS.CARDINAL_EAST} />
      <pointLight position={[-10, 0, 0]} color={KOREAN_COLORS.CARDINAL_WEST} />
      <pointLight position={[0, 0, 10]} color={KOREAN_COLORS.CARDINAL_SOUTH} />
      <pointLight position={[0, 0, -10]} color={KOREAN_COLORS.CARDINAL_NORTH} />
      <pointLight position={[0, 10, 0]} color={KOREAN_COLORS.CARDINAL_CENTER} />
    </>
  );
}
```

### 📊 Performance Optimization

#### Bundle Size Management

| Asset | Size (Uncompressed) | Size (Gzipped) | Notes |
|-------|---------------------|----------------|-------|
| Three.js core | ~600KB | ~150KB | Tree-shaken imports |
| @react-three/fiber | ~100KB | ~30KB | React integration |
| @react-three/drei | ~200KB | ~60KB | Only imported helpers |
| **Total** | **~900KB** | **~240KB** | Lazy-loaded when needed |

#### Optimization Techniques

1. **Instancing for Particles**
```typescript
import { Instances, Instance } from '@react-three/drei';

<Instances limit={1000}>
  <sphereGeometry args={[0.1, 8, 8]} />
  <meshBasicMaterial color={KOREAN_COLORS.PRIMARY_CYAN} />
  {particles.map((p, i) => (
    <Instance key={i} position={p.position} scale={p.scale} />
  ))}
</Instances>
```

2. **LOD (Level of Detail)**
```typescript
import { Detailed } from '@react-three/drei';

<Detailed distances={[0, 10, 20]}>
  <HighDetailCharacter />
  <MediumDetailCharacter />
  <LowDetailCharacter />
</Detailed>
```

3. **Object Pooling**
```typescript
// Reuse objects instead of creating new ones
const particlePool = new ParticlePool(createParticle, resetParticle, 100);
```

### 🚀 Migration Strategy

#### Phase 1: Infrastructure Setup ✅ COMPLETE
- [x] Three.js dependencies installed
- [x] Test component created (`HelloThreeJS`)
- [x] Korean theming verified
- [x] Build and test pipeline working

#### Phase 2: Particle Systems (In Progress)
- [ ] Migrate ki energy particles to Three.js `Instances`
- [ ] Create 3D blood splatter effects
- [ ] Implement impact sparks with lighting
- [ ] Performance validation (1000+ particles at 60fps)

#### Phase 3: Character Models (Planned)
- [ ] Create 3D character base model
- [ ] Implement 70 vital point markers in 3D space
- [ ] Add stance-based animations (Eight Trigrams)
- [ ] Integrate damage visualization

#### Phase 4: Combat Arena (Planned)
- [ ] Build 3D dojang environment
- [ ] Korean-themed lighting setup
- [ ] Shadow and reflection effects
- [ ] Environmental particles (dust, air)

#### Phase 5: UI Integration (Planned)
- [ ] Convert Combat HUD to Html overlays
- [ ] 3D-positioned player status panels
- [ ] Floating damage numbers
- [ ] Vital point targeting interface

#### Phase 6: Polish & Optimization (Planned)
- [ ] Post-processing effects (bloom, color grading)
- [ ] Advanced particle systems
- [ ] Mobile performance optimization
- [ ] Production deployment

### 🧪 Testing Strategy

#### Unit Tests
```typescript
// Test Three.js component imports and props
describe('CharacterModel3D', () => {
  it('should be defined and importable', () => {
    expect(CharacterModel3D).toBeDefined();
  });
  
  it('should accept Korean colors', () => {
    expect(typeof KOREAN_COLORS.PRIMARY_CYAN).toBe('number');
  });
});
```

#### E2E Tests
```typescript
// cypress/e2e/threejs-combat.cy.ts
describe('Three.js Combat Arena', () => {
  it('should render 3D scene without errors', () => {
    cy.visit('/combat');
    cy.get('canvas').should('exist');
    cy.wait(1000); // Allow scene to load
  });
  
  it('should maintain 60fps during combat', () => {
    // Use custom FPS counter to validate performance
  });
});
```

#### Manual Testing Checklist
- [ ] Visual quality on desktop (1920x1080)
- [ ] Visual quality on mobile (720p)
- [ ] 60fps sustained on desktop
- [ ] 55fps minimum on mobile
- [ ] Korean colors render correctly
- [ ] Html overlays positioned properly
- [ ] No WebGL errors in console
- [ ] Memory usage stays below 500MB (desktop)

### 🎯 Performance Targets

| Platform | Resolution | Target FPS | Particles | Memory |
|----------|-----------|------------|-----------|--------|
| Desktop | 1920x1080 | 60fps (sustained) | 1000+ | <500MB |
| Tablet | 1024x768 | 60fps (target) | 750+ | <400MB |
| Mobile | 720p | 55fps (minimum) | 500+ | <300MB |

### 📚 Documentation & Resources

#### Project Documentation
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Complete PixiJS to Three.js migration guide
- **[docs/three-js-patterns.md](./docs/three-js-patterns.md)** - Common patterns and examples
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - This document (architecture overview)

#### External Resources
- **[Three.js Documentation](https://threejs.org/docs/)** - Official Three.js docs
- **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/)** - React Three Fiber docs
- **[@react-three/drei](https://github.com/pmndrs/drei)** - Helper library
- **[Hack23/game](https://github.com/Hack23/game)** - Reference implementation

#### Learning Resources
- **Three.js Journey** - Comprehensive Three.js course
- **Discover three.js** - Free online book
- **React Three Fiber Examples** - Official example gallery

### ✅ Success Criteria

**Infrastructure:**
- [x] Three.js packages installed and configured
- [x] TypeScript support enabled
- [x] Korean theming integration verified
- [x] Build pipeline working
- [x] Test infrastructure set up

**Performance:**
- [ ] 60fps sustained on desktop at 1920x1080
- [ ] 55fps minimum on mobile at 720p
- [ ] 1000+ particles at 60fps (desktop)
- [ ] Memory usage <500MB (desktop)
- [ ] Bundle size <1MB gzipped

**Quality:**
- [ ] Korean cultural aesthetics maintained
- [ ] Smooth martial arts animations
- [ ] Realistic vital point visualization
- [ ] Immersive combat experience
- [ ] Bilingual UI (Korean | English)

**Documentation:**
- [x] Architecture documented
- [x] Migration guide created
- [x] Pattern library established
- [ ] API documentation updated
- [ ] Team training completed

---

## 🔧 File Structure Highlights

- **src/components/ui/base**

  - `BaseButton.tsx`, `BackgroundGrid.tsx`, `KoreanText.tsx`, `KoreanHeader.tsx`, `PixiComponents.tsx`: Reusable UI primitives and Korean font utilities.

- **src/components/combat**

  - `CombatScreen.tsx`, `CombatArena.tsx`, `CombatControls.tsx`, `CombatHUD.tsx`: All UI & logic for real-time combat.

- **src/components/training**

  - `TrainingScreen.tsx`, `TrainingControlsPanel.tsx`, `VitalPointTrainingPanel.tsx`: Components for practicing vital-point targeting.

- **src/hooks**

  - `useTexture.ts`: Custom hook wrapping PixiJS loader for image caching.
  - `useGameState.ts`, `useUIState.ts`, `useEnemyState.ts`: Zustand stores for global state.

- **src/systems/trigram**

  - `KoreanCulture.ts`, `StanceManager.ts`, `TransitionCalculator.ts`, `TrigramCalculator.ts`: Trigram mechanics and data access.

- **src/systems/vitalpoint**

  - `AnatomicalRegions.ts`, `HitDetection.ts`, `DamageCalculator.ts`, `KoreanVitalPoints.ts`: Vital-point definitions, detection, and damage logic.

- **src/audio**

  - `AudioAssetRegistry.ts`, `AudioManager.ts`, `AudioUtils.ts`, `DefaultSoundGenerator.ts`, `VariantSelector.ts`: All sound loading and playback.

- **src/utils**

  - `playerUtils.ts`, `colorUtils.ts`: Helper functions for mapping archetype data and color schemes.

---

## 🔄 Combat Flow Sequence

```mermaid
sequenceDiagram
    title 🔄 Combat Flow – Fully Frontend (Black Trigram)

    participant Player as "🧑‍🤝‍🧑 Player"
    participant InputSystem as "🎮 InputSystem"
    participant CombatEngine as "⚔️ Combat Engine"
    participant TrigramSystem as "🔶 Trigram System"
    participant VitalPointSystem as "🎯 VitalPoint System"
    participant AudioManager as "🎵 Audio Manager"
    participant StateStore as "🗄️ Zustand Store"
    participant PixiStage as "🎨 PixiJS Renderer"

    Note over Player,PixiStage: 🥋 Korean Martial Arts Real-Time Combat

    Player->>InputSystem: 🥋 Press stance key (e.g., '1' for 건/Geon)
    InputSystem->>CombatEngine: 🔃 Stance change request
    CombatEngine->>TrigramSystem: 🔁 Calculate transition (Current → Geon)
    TrigramSystem->>StateStore: ➖ Deduct Ki/Stamina
    TrigramSystem-->>CombatEngine: ✅ Transition result (Success/Fail)
    CombatEngine->>AudioManager: 🔊 Play stance change SFX
    CombatEngine->>PixiStage: ✨ Update player aura visuals (PlayerVisuals)

    Player->>InputSystem: ⚔️ Click to attack (Mouse click)
    InputSystem->>CombatEngine: 🎯 Attack command with screen coords
    CombatEngine->>TrigramSystem: 💡 Get current technique parameters
    CombatEngine->>VitalPointSystem: 🔍 Hit detection (range & bounding boxes)
    VitalPointSystem-->VitalPointSystem: 🎯 Compute precision vs 70 vital points
    VitalPointSystem-->>CombatEngine: ✅ Hit result (VitalPointData, Multiplier)
    CombatEngine->>CombatEngine: 🧮 Compute final damage (base × trigram_adv × vp_mult)
    CombatEngine->>StateStore: 🩸 Reduce enemy health
    CombatEngine->>AudioManager: 🔊 Play impact SFX (bone crack / muscle thud)
    CombatEngine->>PixiStage: 💥 Render hit sparks, blood, damage numbers (ParticlesLayer)
    CombatEngine->>StateStore: ⚡ Update visual state (enemy hit flag, UI flags)
    CombatEngine-->>PixiStage: 👺 Trigger enemy reaction animation (EnemyVisuals)
```

> **Note**
>
> - **InputSystem**: Lives in React (e.g., `CombatControls.tsx`), dispatching events to `CombatEngine`.
> - **CombatEngine**: Aggregates all combat logic in `CombatSystem.ts`.
> - **TrigramSystem**: Handles stance logic, technique lookup, state updates (Zustand).
> - **VitalPointSystem**: Performs in-memory geometry collision detection & returns multipliers.
> - **AudioManager**: Web Audio API plays sound buffers loaded at runtime from the Audio CDN.
> - **Three.js Scene**: Via `@react-three/fiber` Canvas component, renders 3D characters, environment, effects, and UI overlays via Html.
> - **Zustand Store**: All shared state (player health, Ki, stance) resides in memory; React components subscribe.

---

## ⚡ Security & Performance Architecture

```mermaid
graph TD
    subgraph PM["🔍 Performance Monitoring & Profiling"]
      PerfMon[📈 Performance Monitor]
      FPS[📊 FPS Tracking Stats.js]
      Memory[💾 Memory Usage Chrome DevTools]
      GC[🗑️ GC Observations]
      AssetTiming[⏱️ Asset Load Times Network Tab]
    end

    subgraph OT["🚀 Optimization Techniques"]
      OptEngine[⚙️ Optimization Engine]
      SpriteBatch[📦 PixiJS Sprite Batching]
      AtlasTextures[🎨 Texture Atlases Spritesheet]
      ObjectPooling[🔄 Object Pooling Particles & Effects]
      AssetCaching[🔒 useTexture & React.lazy]
      CodeSplitting[📂 Dynamic import]
      AudioCompression[🎵 OGG/MP3 Streaming]
      Debounce[⏳ Debounce/Throttle Inputs & Animations]
      Memoization[🧠 React.memo / useMemo / useCallback]
      WebGLExtensions[🖥️ Enable EXT_disjoint_timer_query]
    end

    subgraph FS["🛡️ Fallback Systems"]
      FallbackMgr[⚠️ Fallback Manager]
      LowQualityMode[📉 Low Quality Graphics on Low-end GPUs]
      ReducedEffects[❌ Disable Blood / High-poly Particles]
      ProceduralAudio[🎹 Procedural SFX fallback if CDN missing]
      Canvas2D[🖼️ Fallback to Canvas 2D if WebGL Unsupported]
    end

    PerfMon --> FPS
    PerfMon --> Memory
    PerfMon --> GC
    PerfMon --> AssetTiming

    OptEngine --> SpriteBatch
    OptEngine --> AtlasTextures
    OptEngine --> ObjectPooling
    OptEngine --> AssetCaching
    OptEngine --> CodeSplitting
    OptEngine --> AudioCompression
    OptEngine --> Debounce
    OptEngine --> Memoization
    OptEngine --> WebGLExtensions

    FallbackMgr --> LowQualityMode
    FallbackMgr --> ReducedEffects
    FallbackMgr --> ProceduralAudio
    FallbackMgr --> Canvas2D

    PM -.-> OT
    OT -.-> FS

    classDef perfMon fill:#4ecdc4,stroke:#333,stroke-width:2px,color:#000
    classDef optTech fill:#45b7d1,stroke:#333,stroke-width:2px,color:#000
    classDef fallback fill:#f9ca24,stroke:#333,stroke-width:2px,color:#000

    class PerfMon,FPS,Memory,GC,AssetTiming perfMon
    class OptEngine,SpriteBatch,AtlasTextures,ObjectPooling,AssetCaching,CodeSplitting,AudioCompression,Debounce,Memoization,WebGLExtensions optTech
    class FallbackMgr,LowQualityMode,ReducedEffects,ProceduralAudio,Canvas2D fallback
```

### **Performance Monitoring**

- **📈 FPS Tracking**: Integrate [Stats.js](https://github.com/mrdoob/stats.js/) to measure and display real-time framerate.
- **💾 Memory Usage**: Use Chrome DevTools to inspect memory footprint; watch for leaks when large particle sets spawn.
- **🗑️ GC Observations**: Monitor GC pauses when many objects (particles, temporary data) are created/destroyed; mitigate via object pooling.
- **⏱️ Asset Timing**: Leverage Network panel or custom timing code to measure JSON, texture, and audio load times from CDNs.

### **Optimization Techniques**

1. **📦 PixiJS Sprite Batching**

   - Group sprites sharing textures into batch draw calls (e.g., `ParticleContainer` for hit effects).
   - Use Pixi's `ParticleContainer` or `SpriteBatch` for high particle counts (ki energy, blood).

2. **🎨 Texture Atlases**

   - Combine character frames, UI icons, and particle frames into single spritesheets (e.g., `characters.json`, `particles.json`).
   - Minimizes WebGL texture switches, increasing draw performance.

3. **🔄 Object Pooling**

   - Pre-allocate particle/effect objects (blood splatter, ki orbs) and recycle instead of allocating new instances.
   - Pool frequently used objects (damage-number labels, aura filters) to reduce GC pressure.

4. **🔒 Asset Caching**

   - Custom `useTexture` hook: ensures textures load once and reuse across components.
   - Leverage browser-level caching (Cache-Control headers on CDN) to avoid re-fetching.

5. **📂 Code Splitting**

   - Lazy-load heavy modules: `TrainingScreen`, concept art galleries, large JSON data (non-MVP features).
   - Use dynamic `import()` to download code only when needed.

6. **🎵 Audio Compression & Streaming**

   - Store audio on CDN as compressed OGG/MP3.
   - Stream large background tracks, pre-decode short SFX in memory for low-latency playback.

7. **⏳ Debounce / Throttle**

   - Prevent rapid-fire input (stance spamming) from overwhelming main loop.
   - Throttle UI updates (animation triggers, combo pop-ups) using `useThrottle`/`useDebounce`.

8. **🧠 Memoization**

   - Use `React.memo` for pure UI components (`TrigramWheel`, `CombatHUD`) so they only re-render on relevant prop changes.
   - Leverage `useMemo` / `useCallback` for expensive calculations inside React components.

9. **🖥️ WebGL Extensions**

   - Enable `EXT_disjoint_timer_query` in PixiJS to gather GPU timing metrics for deeper profiling.

### **Fallback Systems (Graceful Degradation)**

1. **📉 Low Quality Mode**

   - Detect GPU capabilities at startup. If low, reduce canvas resolution and disable sub-pixel effects.
   - Toggle via "Low Graphics" checkbox in settings (Zustand flag: `useUIState.isLowGraphicsMode`).

2. **❌ Reduced Effects**

   - On performance drop (FPS < 30), disable expensive particles: blood splatter, continuous ki swirl.
   - Use `useUIState.isLowPerfMode` to toggle off these render layers.

3. **🎹 Procedural Audio**

   - If Audio CDN fails (e.g., offline), fall back to simple beep-thump procedural sounds via `DefaultSoundGenerator.ts`.

4. **🖼️ Canvas2D Fallback**

   - If WebGL unavailable (older browsers), switch to Canvas 2D renderer for core gameplay (no advanced particles, simplified effects).

---

## 📊 SWOT Analysis

### Traditional SWOT Quadrant Chart

```mermaid
%%{init: {
  "theme": "neutral",
  "themeVariables": {
    "quadrant1Fill": "#2b83ba",
    "quadrant2Fill": "#1a9641", 
    "quadrant3Fill": "#d7191c",
    "quadrant4Fill": "#756bb1",
    "quadrantTitleFill": "#ffffff",
    "quadrantPointFill": "#ffffff",
    "quadrantPointTextFill": "#000000",
    "quadrantXAxisTextFill": "#000000",
    "quadrantYAxisTextFill": "#000000"
  },
  "quadrantChart": {
    "chartWidth": 700,
    "chartHeight": 700,
    "pointLabelFontSize": 14,
    "titleFontSize": 24,
    "quadrantLabelFontSize": 18,
    "xAxisLabelFontSize": 16,
    "yAxisLabelFontSize": 16
  }
}}%%
quadrantChart
    title 📊 Black Trigram (흑괘) Frontend-Only SWOT Analysis
    x-axis Internal --> External
    y-axis Negative --> Positive
    quadrant-1 Opportunities
    quadrant-2 Strengths
    quadrant-3 Weaknesses
    quadrant-4 Threats

    "💡 PWA & Offline Caching": [0.8, 0.9] radius: 7, color: #a4c2f4, stroke-color: #3d64ba, stroke-width: 2px
    "📱 Mobile-First UX": [0.7, 0.8] radius: 7, color: #a4c2f4, stroke-color: #3d64ba, stroke-width: 2px
    "🎨 Community Modding": [0.85, 0.75] radius: 7, color: #a4c2f4, stroke-color: #3d64ba, stroke-width: 2px
    "🤖 AI-Driven Tutorials": [0.75, 0.85] radius: 7, color: #a4c2f4, stroke-color: #3d64ba, stroke-width: 2px
    "🌱 Ecosystem Partnerships": [0.65, 0.7] radius: 6, color: #a4c2f4, stroke-color: #3d64ba, stroke-width: 2px

    "🛠️ Zero-Install Web App": [0.2, 0.8] radius: 7, color: #a2d2a4, stroke-color: #2c882c, stroke-width: 2px
    "⏱ Fast Iteration": [0.25, 0.75] radius: 6, color: #a2d2a4, stroke-color: #2c882c, stroke-width: 2px
    "💸 Reduced Operational Costs": [0.15, 0.85] radius: 6, color: #a2d2a4, stroke-color: #2c882c, stroke-width: 2px
    "🚀 Immediate CDN Updates": [0.1, 0.7] radius: 7, color: #a2d2a4, stroke-color: #2c882c, stroke-width: 2px
    "🌍 Global Accessibility": [0.05, 0.9] radius: 6, color: #a2d2a4, stroke-color: #2c882c, stroke-width: 2px

    "🌀 No Persistence (Session-Only)": [0.2, 0.25] radius: 7, color: #f5a9a9, stroke-color: #aa3939, stroke-width: 2px
    "🐢 Asset Load Latency": [0.3, 0.2] radius: 7, color: #f5a9a9, stroke-color: #aa3939, stroke-width: 2px
    "📴 Limited Offline Play": [0.15, 0.3] radius: 6, color: #f5a9a9, stroke-color: #aa3939, stroke-width: 2px
    "🌐 Browser Compatibility": [0.25, 0.15] radius: 7, color: #f5a9a9, stroke-color: #aa3939, stroke-width: 2px
    "⚠️ Memory/GC Spikes": [0.35, 0.1] radius: 6, color: #f5a9a9, stroke-color: #aa3939, stroke-width: 2px

    "🌩️ CDN Outages/Latency": [0.8, 0.3] radius: 7, color: #d5a6bd, stroke-color: #9b568a, stroke-width: 2px
    "⚠️ WebGL Deprecation": [0.7, 0.2] radius: 7, color: #d5a6bd, stroke-color: #9b568a, stroke-width: 2px
    "🏆 Competitive Mobile Games": [0.75, 0.25] radius: 7, color: #d5a6bd, stroke-color: #9b568a, stroke-width: 2px
    "📉 Tech Debt (State Complexity)": [0.9, 0.2] radius: 6, color: #d5a6bd, stroke-color: #9b568a, stroke-width: 2px
    "🔒 CDN Security Risks": [0.85, 0.15] radius: 6, color: #d5a6bd, stroke-color: #9b568a, stroke-width: 2px
    "🌐 Browser Standards Changes": [0.65, 0.25] radius: 6, color: #d5a6bd, stroke-color: #9b568a, stroke-width: 2px
```

### Mindmap of Strengths

```mermaid
mindmap
  root((🟢 Strengths))
    id1(🛠️ Zero-Install Web App)
      id1.1[Play immediately—no download/sign-up]
      id1.2[Instant patching via static hosting]
      id1.3[High adoption barrier removed]
    id2(⏱ Fast Iteration)
      id2.1[Front-end only; no backend migrations]
      id2.2[Rapid prototyping & feature rollout]
      id2.3[Hot reloading in dev mode]
    id3(💸 Reduced Operational Costs)
      id3.1[No server infrastructure costs]
      id3.2[Leverage static CDNs - Cloudflare/AWS S3]
      id3.3[Minimal DevOps overhead]
    id4(🚀 Immediate CDN Updates)
      id4.1[Push new animations & sounds instantly]
      id4.2[JSON/trigram data can update in real time]
      id4.3[Rapid asset iteration in production]
    id5(🌍 Global Accessibility)
      id5.1[Runs in any modern browser]
      id5.2[Cross-platform compatibility: desktop & mobile]
      id5.3[Low barrier to entry for users]
    id6(🔶 Authentic Korean Martial Arts Integration)
      id6.1[Deep I Ching philosophy]
      id6.2[70 traditional vital points]
      id6.3[Korean labels, audio, cultural immersion]
    id7(🎵 Rich Audio-Visual Experience)
      id7.1[Traditional Korean instruments & cyberpunk fusion]
      id7.2[Spectacular ki energy & blood particles]
      id7.3[Responsive, low-latency SFX]
    id8(⚙️ Modular Architecture)
      id8.1[Clear separation: Combat, Trigram, VitalPoint, Audio]
      id8.2[Reusable React + PixiJS components]
      id8.3[Zustand slices for isolated state]
    id9(🔑 Comprehensive Testing Framework)
      id9.1[Unit tests for combat & trigram logic]
      id9.2[Integration tests for full combat flow]
      id9.3[Performance tests with Stats.js]
```

### Mindmap of Weaknesses

```mermaid
mindmap
  root((🟠 Weaknesses))
    id1(🌀 No Persistence Session-Only)
      id1.1[All progress lost on refresh]
      id1.2[No saved unlocks or training logs]
      id1.3[Limited long-term engagement]
    id2(🐢 Asset Load Latency)
      id2.1[Large JSON/trigram data slows startup]
      id2.2[High-res textures cause delays]
      id2.3[Initial loading screen can be lengthy]
    id3(📴 Limited Offline Play)
      id3.1[Without service workers, no offline mode]
      id3.2[Users with spotty connectivity struggle]
      id3.3[No cached game state]
    id4(🌐 Browser Compatibility Challenges)
      id4.1[WebGL differences across browsers]
      id4.2[Web Audio API support varies]
      id4.3[Mobile browser quirks]
    id5(⚠️ Memory/GC Spikes)
      id5.1[Many particles cause GC pauses]
      id5.2[Object churn in combat heavy scenes]
      id5.3[Zustand state updates triggering re-renders]
    id6(⚙️ Complex State Management)
      id6.1[Multiple Zustand slices can desync]
      id6.2[No unified persistence layer]
      id6.3[Harder to trace bugs across stores]
    id7(❌ Incomplete Features)
      id7.1[Some techniques/stances lack polish]
      id7.2[Missing grappling & blocking for certain stances]
      id7.3[Training mode limited in scope]
    id8(🔍 UX Learning Curve)
      id8.1[Complex trigram interactions require tutorials]
      id8.2[70 vital points may overwhelm new players]
      id8.3[Not immediately intuitive for casual users]
    id9(🛠️ Limited Analytics)
      id9.1[No built-in user metrics or telemetry]
      id9.2[Hard to measure player behavior/performance]
      id9.3[No A/B testing framework]
```

### Mindmap of Opportunities

```mermaid
mindmap
  root((🔵 Opportunities))
    id1(💡 PWA & Offline Caching)
      id1.1[Implement service workers for asset caching]
      id1.2[Cache JSON & textures for offline play]
      id1.3[Persistence via IndexedDB/localStorage]
    id2(📱 Mobile-First UX)
      id2.1[Optimize controls for touch; swipe/drag]
      id2.2[Adaptive UI layouts for small screens]
      id2.3[Accelerometer-based stance changes]
    id3(🎨 Community Modding)
      id3.1[Allow custom skins via URL overlays]
      id3.2[Custom particle packs/community-created assets]
      id3.3[User-generated stances & techniques]
    id4(🤖 AI-Driven Tutorial Modules)
      id4.1[WebAssembly/TF.js for adaptive feedback]
      id4.2[Real-time guidance on vital-point targeting]
      id4.3[Progressive difficulty based on performance]
    id5(🌱 Ecosystem Partnerships)
      id5.1[Collaboration with martial arts schools]
      id5.2[Cultural institution sponsorships]
      id5.3[Cross-promotion with Korean cultural events]
    id6(🔧 Third-Party Integrations)
      id6.1[Discord & Twitch combat overlays]
      id6.2[Leaderboard integration via Firebase]
      id6.3[Social sharing of combo replays]
    id7(⚙️ Advanced Analytics)
      id7.1[Track detailed player telemetry]
      id7.2[Heatmaps of vital-point targeting accuracy]
      id7.3[User segmentation & A/B tests for features]
    id8(📚 E-Learning Mode)
      id8.1[Structured courses on trigram theory]
      id8.2[Guided practice sessions on vital points]
      id8.3[Certification badges for skill milestones]
    id9(🌐 Global Localization)
      id9.1[Support multiple languages - KR, EN, JP, CN]
      id9.2[Localized UI/UX for regional audiences]
      id9.3[Region-specific AI tutor voice-overs]
```

### Mindmap of Threats

```mermaid
mindmap
  root((🔴 Threats))
    id1(🌩️ CDN Outages / Latency)
      id1.1[Audio CDN or Art CDN downtime]
      id1.2[High global latency affects playability]
      id1.3[Single region CDN cold starts]
    id2(⚠️ WebGL / API Deprecation)
      id2.1[Future browser changes break PixiJS]
      id2.2[Web Audio API behavior shifts]
      id2.3[Mobile browser limitations]
    id3(🏆 Competitive Mobile Titles)
      id3.1[Native mobile games with deeper UX]
      id3.2[Lower-latency touch controls]
      id3.3[Larger marketing budgets]
    id4(📉 Technical Debt Accumulation)
      id4.1[Complex Zustand stores & no persistence]
      id4.2[Inconsistent data patterns]
      id4.3[Inefficient combat loops]
    id5(🔒 CDN Asset Security Risks)
      id5.1[MITM if CDN not HTTPS + SRI]
      id5.2[Compromised asset hosting]
      id5.3[Unverified third-party scripts]
    id6(📶 Browser Standards Evolution)
      id6.1[Changes to ES modules affect bundling]
      id6.2[New security policies - CORS, CSP]
      id6.3[Deprecated features in future standards]
    id7(🎮 Player Retention Challenges)
      id7.1[Without persistence, limited engagement]
      id7.2[Lack of progression incentives]
      id7.3[Session-only gameplay limits depth]
    id8(💰 Monetization Limitations)
      id8.1[No backend for payment processing]
      id8.2[Limited ability to track purchases]
      id8.3[Difficult to implement premium features]
    id9(🌍 Cultural Sensitivity Issues)
      id9.1[Misrepresentation of Korean culture]
      id9.2[Inappropriate use of traditional symbols]
      id9.3[Lack of cultural consultant validation]
```

---

## 🎯 Core Game Concepts

### Player Archetypes & Combat Philosophy

```mermaid
mindmap
  root((🥋 Black Trigram Core))
    id1[🎮 Player Archetypes]
      id1.1[무사 Musa - Traditional Warrior]
        id1.1.1[Honor-bound combat]
        id1.1.2[Balanced techniques]
        id1.1.3[Strong fundamentals]
      id1.2[암살자 Amsalja - Shadow Assassin]
        id1.2.1[Precision strikes]
        id1.2.2[Stealth mechanics]
        id1.2.3[Critical damage focus]
      id1.3[해커 Hacker - Cyber Warrior]
        id1.3.1[Tech-enhanced combat]
        id1.3.2[Digital disruption]
        id1.3.3[Augmented abilities]
      id1.4[정보요원 Jeongbo - Intelligence Op]
        id1.4.1[Analytical combat]
        id1.4.2[Predictive strikes]
        id1.4.3[Tactical advantage]
      id1.5[조직폭력배 Jojik - Crime Fighter]
        id1.5.1[Brutal efficiency]
        id1.5.2[Street techniques]
        id1.5.3[Overwhelming force]
    id2[☯️ Eight Trigrams]
      id2.1[☰ 건 Geon - Heaven]
        id2.1.1[Direct strikes]
        id2.1.2[Overwhelming power]
      id2.2[☱ 태 Tae - Lake]
        id2.2.1[Fluid movements]
        id2.2.2[Joint manipulation]
      id2.3[☲ 리 Li - Fire]
        id2.3.1[Nerve strikes]
        id2.3.2[Burning techniques]
      id2.4[☳ 진 Jin - Thunder]
        id2.4.1[Explosive attacks]
        id2.4.2[Sudden impacts]
      id2.5[☴ 손 Son - Wind]
        id2.5.1[Continuous pressure]
        id2.5.2[Rapid combos]
      id2.6[☵ 감 Gam - Water]
        id2.6.1[Adaptive defense]
        id2.6.2[Flow counters]
      id2.7[☶ 간 Gan - Mountain]
        id2.7.1[Immovable defense]
        id2.7.2[Counter strikes]
      id2.8[☷ 곤 Gon - Earth]
        id2.8.1[Grounding attacks]
        id2.8.2[Takedown focus]
    id3[🎯 Vital Points]
      id3.1[Critical Points]
        id3.1.1[Instant KO potential]
        id3.1.2[x5.0 damage multiplier]
      id3.2[Secondary Points]
        id3.2.1[Major damage]
        id3.2.2[x3.0 damage multiplier]
      id3.3[Standard Points]
        id3.3.1[Basic damage]
        id3.3.2[x1.5 damage multiplier]
    id4[⚡ Resources]
      id4.1[❤️ Health]
        id4.1.1[100 HP per fighter]
        id4.1.2[No regeneration]
      id4.2[💪 Stamina]
        id4.2.1[Physical actions]
        id4.2.2[Slow regeneration]
      id4.3[🔵 Ki Energy]
        id4.3.1[Special techniques]
        id4.3.2[Stance transitions]
```

---

## 🏗️ Architecture Concepts

### System Architecture Layers

```mermaid
mindmap
  root((🏗️ Architecture))
    id1[🖥️ Presentation Layer]
      id1.1[React Components]
        id1.1.1[Screens]
        id1.1.2[HUD Elements]
        id1.1.3[Controls]
      id1.2[PixiJS Rendering]
        id1.2.1[Sprites]
        id1.2.2[Particles]
        id1.2.3[Animations]
      id1.3[UI/UX Design]
        id1.3.1[Korean Typography]
        id1.3.2[Cyberpunk Theme]
        id1.3.3[Responsive Layout]

    id2[⚙️ Business Logic]
      id2.1[Combat System]
        id2.1.1[Damage Calculation]
        id2.1.2[Hit Detection]
        id2.1.3[Combat Flow]
      id2.2[Trigram System]
        id2.2.1[Stance Management]
        id2.2.2[Transitions]
        id2.2.3[Techniques]
      id2.3[Vital Point System]
        id2.3.1[Anatomy Mapping]
        id2.3.2[Multipliers]
        id2.3.3[Effects]

    id3[🗄️ State Management]
      id3.1[Zustand Stores]
        id3.1.1[Game State]
        id3.1.2[UI State]
        id3.1.3[Enemy State]
      id3.2[React Context]
        id3.2.1[Audio Context]
        id3.2.2[Theme Context]
      id3.3[Session Storage]
        id3.3.1[Temporary Data]
        id3.3.2[Settings]

    id4[📦 Asset Management]
      id4.1[PixiJS Loader]
        id4.1.1[Texture Loading]
        id4.1.2[Sprite Sheets]
      id4.2[Audio System]
        id4.2.1[Howler.js]
        id4.2.2[Web Audio API]
      id4.3[Data Loading]
        id4.3.1[JSON Import]
        id4.3.2[Dynamic Loading]

    id5[🔧 Infrastructure]
      id5.1[Build System]
        id5.1.1[Vite]
        id5.1.2[TypeScript]
        id5.1.3[ESBuild]
      id5.2[Testing]
        id5.2.1[Vitest]
        id5.2.2[React Testing Library]
        id5.2.3[Cypress]
      id5.3[Deployment]
        id5.3.1[Static Hosting]
        id5.3.2[CDN Distribution]
        id5.3.3[CI/CD Pipeline]
```

---

## 🔄 UX Flow

### User Journey Through Game

```mermaid
flowchart TD
    Start([🎮 Game Load]) --> Loading[⏳ Loading Assets]
    Loading --> Intro[🏮 Intro Screen]

    Intro --> |New Game| CharSelect[👤 Archetype Selection]
    Intro --> |Training| Training[🎯 Training Mode]
    Intro --> |Settings| Settings[⚙️ Settings Menu]

    CharSelect --> Combat[⚔️ Combat Arena]
    Training --> VitalPractice[🎯 Vital Point Practice]
    Training --> StancePractice[☯️ Stance Training]

    Combat --> |Victory| Victory[🏆 Victory Screen]
    Combat --> |Defeat| Defeat[💀 Defeat Screen]
    Combat --> |Pause| PauseMenu[⏸️ Pause Menu]

    Victory --> Intro
    Defeat --> Intro
    PauseMenu --> |Resume| Combat
    PauseMenu --> |Quit| Intro

    VitalPractice --> |Exit| Training
    StancePractice --> |Exit| Training
    Training --> |Back| Intro
    Settings --> |Back| Intro

    %% Styling
    classDef screenNode fill:#FFD700,stroke:#333,stroke-width:2px,color:#000
    classDef actionNode fill:#00FFD0,stroke:#333,stroke-width:2px,color:#000
    classDef menuNode fill:#FF6B6B,stroke:#333,stroke-width:2px,color:#000

    class Intro,CharSelect,Combat,Victory,Defeat,Training,Settings screenNode
    class Loading,VitalPractice,StancePractice actionNode
    class PauseMenu menuNode
```

---

## 🔄 Combat Mechanics & Data Relationships

### Combat System Data Flow

```mermaid
graph TB
    subgraph "🎮 Input Layer"
        KI[Keyboard Input]
        MI[Mouse Input]
        TI[Touch Input]
    end

    subgraph "⚙️ Combat Engine"
        IS[Input System]
        SM[Stance Manager]
        TC[Technique Calculator]
        HD[Hit Detection]
        DC[Damage Calculator]
        ES[Effect System]
    end

    subgraph "📊 Game State"
        PS[Player State]
        ES2[Enemy State]
        CS[Combat State]
    end

    subgraph "🎨 Rendering"
        VS[Visual System]
        AS[Audio System]
        PS2[Particle System]
    end

    KI --> IS
    MI --> IS
    TI --> IS

    IS --> SM
    SM --> TC
    TC --> HD
    HD --> DC
    DC --> ES

    SM <--> PS
    DC <--> ES2
    ES <--> CS

    CS --> VS
    CS --> AS
    CS --> PS2

    %% Styling
    classDef inputClass fill:#87CEFA,stroke:#333,stroke-width:2px
    classDef engineClass fill:#00FFD0,stroke:#333,stroke-width:2px
    classDef stateClass fill:#FFD700,stroke:#333,stroke-width:2px
    classDef renderClass fill:#FF6B6B,stroke:#333,stroke-width:2px

    class KI,MI,TI inputClass
    class IS,SM,TC,HD,DC,ES engineClass
    class PS,ES2,CS stateClass
    class VS,AS,PS2 renderClass
```

### Trigram Advantage Matrix

```mermaid
graph LR
    subgraph "☯️ Trigram Relationships"
        G[☰ 건 Geon]
        T[☱ 태 Tae]
        L[☲ 리 Li]
        J[☳ 진 Jin]
        S[☴ 손 Son]
        GM[☵ 감 Gam]
        GN[☶ 간 Gan]
        K[☷ 곤 Gon]
    end

    %% Advantage relationships (→ means "has advantage over")
    G -->|Power > Fluid| T
    T -->|Fluid > Fire| L
    L -->|Fire > Thunder| J
    J -->|Thunder > Wind| S
    S -->|Wind > Water| GM
    GM -->|Water > Mountain| GN
    GN -->|Mountain > Earth| K
    K -->|Earth > Heaven| G

    %% Defensive advantages (⇢ means "defends well against")
    G -.->|Blocks Earth| K
    GN -.->|Blocks Water| GM
    GM -.->|Blocks Wind| S

    %% Style colors
    style G fill:#FFD700,stroke:#333,stroke-width:3px
    style T fill:#87CEEB,stroke:#333,stroke-width:3px
    style L fill:#FF6347,stroke:#333,stroke-width:3px
    style J fill:#FF1493,stroke:#333,stroke-width:3px
    style S fill:#98FB98,stroke:#333,stroke-width:3px
    style GM fill:#4682B4,stroke:#333,stroke-width:3px
    style GN fill:#8B4513,stroke:#333,stroke-width:3px
    style K fill:#D2691E,stroke:#333,stroke-width:3px
```

---

## 📈 Performance Optimization Strategy

### Resource Loading Pipeline

```mermaid
sequenceDiagram
    participant B as Browser
    participant L as Asset Loader
    participant CDN as CDN Servers
    participant C as Cache
    participant G as Game Engine

    B->>L: Initialize game
    L->>C: Check local cache

    alt Assets cached
        C-->>L: Return cached assets
    else Assets not cached
        L->>CDN: Request assets
        CDN-->>L: Stream assets
        L->>C: Store in cache
    end

    L->>G: Assets ready
    G->>B: Start game

    Note over B,G: Lazy load non-critical assets during gameplay
```

### Memory Management Strategy

```mermaid
graph TD
    subgraph "🧠 Memory Pools"
        PP[Particle Pool<br/>Pre-allocated: 1000]
        DP[Damage Number Pool<br/>Pre-allocated: 50]
        EP[Effect Pool<br/>Pre-allocated: 100]
    end

    subgraph "♻️ Object Lifecycle"
        CR[Create/Reset]
        US[Use in Scene]
        RE[Return to Pool]
    end

    subgraph "🗑️ Garbage Collection Mitigation"
        RA[Reuse Allocations]
        PO[Pool Objects]
        LG[Limit Generation]
    end

    PP --> CR
    DP --> CR
    EP --> CR

    CR --> US
    US --> RE
    RE --> PP
    RE --> DP
    RE --> EP

    RA --> PO
    PO --> LG

    style PP fill:#A5D6A7,stroke:#333,stroke-width:2px
    style DP fill:#81C784,stroke:#333,stroke-width:2px
    style EP fill:#66BB6A,stroke:#333,stroke-width:2px
```

---

## 🔒 Security Considerations

### Frontend Security Architecture

```mermaid
graph TB
    subgraph "🛡️ Security Layers"
        CSP[Content Security Policy]
        SRI[Subresource Integrity]
        CORS[CORS Headers]
        VAL[Input Validation]
    end

    subgraph "🔐 Asset Security"
        HTTPS[HTTPS Only CDN]
        SIGN[Signed Assets]
        HASH[Asset Hashing]
    end

    subgraph "🚫 Attack Mitigation"
        XSS[XSS Prevention]
        CSRF[CSRF Protection]
        INJ[Injection Prevention]
    end

    CSP --> XSS
    SRI --> SIGN
    CORS --> HTTPS
    VAL --> INJ

    HTTPS --> HASH
    SIGN --> HASH

    style CSP fill:#FF6B6B,stroke:#333,stroke-width:2px
    style HTTPS fill:#FFD700,stroke:#333,stroke-width:2px
    style XSS fill:#87CEEB,stroke:#333,stroke-width:2px
```

---

## 🚀 Deployment Architecture

### CI/CD Pipeline

```mermaid
graph LR
    subgraph "🔧 Development"
        DEV[Local Dev]
        TEST[Test Suite]
    end

    subgraph "🏗️ Build Pipeline"
        GH[GitHub Actions]
        BUILD[Vite Build]
        OPT[Optimization]
    end

    subgraph "📦 Distribution"
        CDN1[Asset CDN]
        CDN2[App CDN]
        CACHE[Edge Cache]
    end

    subgraph "🌍 Global Delivery"
        US[US Servers]
        EU[EU Servers]
        ASIA[Asia Servers]
    end

    DEV --> TEST
    TEST --> GH
    GH --> BUILD
    BUILD --> OPT

    OPT --> CDN1
    OPT --> CDN2

    CDN1 --> CACHE
    CDN2 --> CACHE

    CACHE --> US
    CACHE --> EU
    CACHE --> ASIA

    style GH fill:#24292E,stroke:#fff,stroke-width:2px,color:#fff
    style CDN1 fill:#FF9500,stroke:#333,stroke-width:2px
    style CACHE fill:#00C851,stroke:#333,stroke-width:2px
```

---

## 📊 Metrics & Monitoring

### Performance Monitoring Dashboard

```mermaid
graph TD
    subgraph "📈 Client Metrics"
        FPS[FPS Counter]
        MEM[Memory Usage]
        LAT[Input Latency]
        LOAD[Asset Load Time]
    end

    subgraph "📊 Game Metrics"
        DMG[Damage Dealt]
        ACC[Hit Accuracy]
        COMBO[Combo Success]
        TIME[Session Duration]
    end

    subgraph "🔍 Analytics"
        GA[Google Analytics]
        CUSTOM[Custom Events]
        ERROR[Error Tracking]
    end

    FPS --> GA
    MEM --> GA
    LAT --> CUSTOM
    LOAD --> CUSTOM

    DMG --> CUSTOM
    ACC --> CUSTOM
    COMBO --> CUSTOM
    TIME --> GA

    GA --> ERROR
    CUSTOM --> ERROR

    style FPS fill:#4CAF50,stroke:#333,stroke-width:2px
    style GA fill:#FFA726,stroke:#333,stroke-width:2px
    style ERROR fill:#EF5350,stroke:#333,stroke-width:2px
```

---

## 🎮 Future Architecture Considerations

### Potential Backend Integration

```mermaid
graph TD
    subgraph "Current: Frontend Only"
        FE[React + PixiJS]
        LOCAL[Local State]
        CDN[Static CDN]
    end

    subgraph "Future: Optional Backend"
        API[REST API]
        DB[Database]
        AUTH[Authentication]
        LEAD[Leaderboards]
        SAVE[Save Games]
    end

    FE -.->|Future Integration| API
    LOCAL -.->|Sync| DB
    CDN -.->|Dynamic Assets| API

    API --> AUTH
    API --> LEAD
    API --> SAVE

    style FE fill:#61DAFB,stroke:#333,stroke-width:2px
    style API fill:#FF6B6B,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5
    style DB fill:#336791,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5
```

---

## 📝 Architecture Decision Records (ADRs)

### ADR-001: Frontend-Only Architecture

**Status**: Accepted  
**Date**: 2024-01-01  
**Context**: Need to minimize operational complexity and maximize accessibility  
**Decision**: Build as purely frontend application with no backend dependencies  
**Consequences**:

- ✅ Zero server costs
- ✅ Instant deployment
- ✅ No database management
- ❌ No persistence
- ❌ Limited multiplayer options

### ADR-002: React + PixiJS Integration

**Status**: Accepted  
**Date**: 2024-01-01  
**Context**: Need powerful 3D rendering with modern React development  
**Decision**: Use @react-three/fiber for seamless Three.js integration  
**Consequences**:

- ✅ Best of both worlds (React + Three.js)
- ✅ Strong ecosystem (@react-three/drei helpers)
- ✅ Type safety with TypeScript
- ✅ Declarative 3D scene graph
- ❌ Learning curve for Three.js concepts
- ❌ Bundle size considerations

### ADR-003: Zustand for State Management

**Status**: Accepted  
**Date**: 2024-01-01  
**Context**: Need lightweight state management without Redux complexity  
**Decision**: Use Zustand for all global state  
**Consequences**:

- ✅ Minimal boilerplate
- ✅ TypeScript friendly
- ✅ DevTools support
- ❌ Less ecosystem than Redux
- ❌ Need custom persistence layer

---

## 🏁 Conclusion

Black Trigram's architecture represents a modern approach to browser-based gaming, leveraging cutting-edge web technologies while maintaining simplicity through its frontend-only design. The modular architecture supports rapid iteration and easy deployment while providing a rich, culturally authentic gaming experience.

### Key Architectural Strengths:

- **Zero Backend Complexity**: Pure frontend eliminates server management
- **Modular Design**: Clear separation of concerns across systems
- **Performance Focused**: Optimization strategies baked into architecture
- **Culturally Rich**: Deep integration of Korean martial arts philosophy
- **Developer Friendly**: TypeScript, modern React, comprehensive testing

### Areas for Future Enhancement:

- **Persistence Layer**: Optional backend for save games
- **Multiplayer Support**: WebRTC or server-based PvP
- **Advanced Analytics**: Deeper player behavior tracking
- **Mobile Optimization**: Native app wrapper or PWA
- **Content Expansion**: More stances, techniques, and vital points

The architecture is designed to scale with the game's ambitions while maintaining the core philosophy of accessibility, authenticity, and engaging combat mechanics.

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

---

## 📚 Related Documents

### 🔐 ISMS Policies
- [🔐 Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) - Overall security governance
- [🛠️ Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) - Security-integrated SDLC
- [🏷️ Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) - Business impact analysis

### 🛡️ Black Trigram Documentation
- [🛡️ Security Architecture](./SECURITY_ARCHITECTURE.md) - Security implementation
- [🔮 Future Architecture](./FUTURE_ARCHITECTURE.md) - Planned system evolution
- [⚔️ Combat Architecture](./COMBAT_ARCHITECTURE.md) - Combat system design
- [🎯 Threat Model](./THREAT_MODEL.md) - Security threat analysis
- [🔄 Workflows](./WORKFLOWS.md) - CI/CD security automation
- [🔧 Development Guide](./development.md) - Security features

---

**📋 Document Control:**  
**✅ Approved by:** James Pether Sörling, CEO  
**📤 Distribution:** Public  
**🏷️ Classification:** [![Confidentiality: Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square&logo=shield&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels) [![Integrity: Moderate](https://img.shields.io/badge/I-Moderate-yellow?style=flat-square&logo=check-circle&logoColor=black)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#integrity-levels) [![Availability: Standard](https://img.shields.io/badge/A-Standard-lightgreen?style=flat-square&logo=server&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#availability-levels)  
**📅 Effective Date:** 2025-01-15  
**⏰ Next Review:** 2025-04-15  
**🎯 Framework Compliance:** [![ISO 27001](https://img.shields.io/badge/ISO_27001-2022_Aligned-blue?style=flat-square&logo=iso&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![NIST CSF 2.0](https://img.shields.io/badge/NIST_CSF-2.0_Aligned-green?style=flat-square&logo=nist&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![CIS Controls](https://img.shields.io/badge/CIS_Controls-v8.1_Aligned-orange?style=flat-square&logo=cisecurity&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)
