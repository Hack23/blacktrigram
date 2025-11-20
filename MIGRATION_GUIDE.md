# 🔄 PixiJS to Three.js Migration Guide

## 📚 Purpose

This guide provides a comprehensive roadmap for migrating Black Trigram (흑괘) components from PixiJS (2D) to Three.js (3D) while maintaining Korean martial arts theming, 60fps performance, and cultural authenticity.

---

## 🎯 Migration Overview

### Why Migrate to Three.js?

- **🎨 Enhanced Visual Capabilities**: True 3D rendering for more immersive combat
- **🥋 Better Vital Point Visualization**: 3D anatomical models with real depth
- **✨ Advanced Particle Systems**: Realistic ki energy and impact effects
- **📦 Modern Ecosystem**: Active @react-three ecosystem with powerful helpers
- **🔮 Future-Ready**: Foundation for VR/AR martial arts training

### Coexistence Strategy

PixiJS and Three.js can **coexist** during migration:
- Existing PixiJS components continue working
- New components built with Three.js
- Gradual migration based on priority
- No "big bang" rewrite required

---

## 📐 Architecture Comparison

### PixiJS Architecture (Current)

```typescript
import { Application, Container, Sprite } from 'pixi.js';
import { Stage } from '@pixi/react';

// PixiJS Application
const app = new Application({
  width: 1200,
  height: 800,
  backgroundColor: 0x1a1a1a,
});

// 2D sprite rendering
const sprite = Sprite.from('character.png');
app.stage.addChild(sprite);

// Animation loop
app.ticker.add((delta) => {
  sprite.rotation += 0.01 * delta;
});
```

### Three.js Architecture (Target)

```typescript
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Three.js Canvas (React component)
<Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
  <ambientLight intensity={0.5} />
  <directionalLight position={[10, 10, 5]} />
  
  {/* 3D mesh rendering */}
  <CharacterModel3D position={[0, 0, 0]} />
  
  <OrbitControls />
</Canvas>

// Animation with useFrame hook
function CharacterModel3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01 * delta;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color={KOREAN_COLORS.PRIMARY_CYAN} />
    </mesh>
  );
}
```

---

## 🔄 Component Conversion Patterns

### Pattern 1: PixiJS Container → Three.js Group

**PixiJS (Before):**
```typescript
import { Container, Graphics } from 'pixi.js';

const container = new Container();
container.x = 100;
container.y = 100;

const graphics = new Graphics();
graphics.beginFill(0x00ffff);
graphics.drawCircle(0, 0, 50);
graphics.endFill();

container.addChild(graphics);
```

**Three.js (After):**
```typescript
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

function KoreanStanceIndicator() {
  return (
    <group position={[1, 1, 0]}>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={KOREAN_COLORS.PRIMARY_CYAN}
          emissive={KOREAN_COLORS.PRIMARY_CYAN}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}
```

### Pattern 2: PixiJS Text → Html Overlay

**PixiJS (Before):**
```typescript
import { Text } from 'pixi.js';

const nameText = new Text('무사 | Warrior', {
  fontSize: 18,
  fill: 0xffd700,
  fontFamily: 'Korean Font',
});
nameText.x = 100;
nameText.y = 50;
app.stage.addChild(nameText);
```

**Three.js (After):**
```typescript
import { Html } from '@react-three/drei';

function PlayerNametag({ name, nameKorean }) {
  return (
    <Html position={[0, 2, 0]} center>
      <div style={{
        background: `${KOREAN_COLORS.UI_BACKGROUND_DARK}cc`,
        color: KOREAN_COLORS.ACCENT_GOLD,
        padding: '8px 12px',
        borderRadius: '4px',
        border: `2px solid ${KOREAN_COLORS.PRIMARY_CYAN}`,
        fontFamily: 'Korean Font',
        fontSize: '14px',
      }}>
        {nameKorean} | {name}
      </div>
    </Html>
  );
}
```

### Pattern 3: PixiJS Sprite → Three.js Textured Mesh

**PixiJS (Before):**
```typescript
import { Sprite, Texture } from 'pixi.js';

const texture = Texture.from('character-sprite.png');
const sprite = new Sprite(texture);
sprite.anchor.set(0.5);
sprite.x = 400;
sprite.y = 300;
sprite.scale.set(2);
```

**Three.js (After):**
```typescript
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

function CharacterSprite() {
  const texture = useTexture('/character-sprite.png');
  
  return (
    <mesh position={[0, 0, 0]} scale={[2, 2, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
```

### Pattern 4: PixiJS Particle System → Three.js Instances

**PixiJS (Before):**
```typescript
import { ParticleContainer, Sprite } from 'pixi.js';

const particles = new ParticleContainer(10000, {
  scale: true,
  position: true,
  rotation: true,
  alpha: true,
});

for (let i = 0; i < 1000; i++) {
  const particle = Sprite.from('particle.png');
  particle.x = Math.random() * 800;
  particle.y = Math.random() * 600;
  particles.addChild(particle);
}
```

**Three.js (After):**
```typescript
import { Instances, Instance } from '@react-three/drei';
import { useMemo } from 'react';

function KiParticles() {
  const particles = useMemo(() => 
    Array.from({ length: 1000 }, () => ({
      position: [
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.5,
    })),
    []
  );

  return (
    <Instances limit={1000}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color={KOREAN_COLORS.PRIMARY_CYAN} />
      {particles.map((p, i) => (
        <Instance key={i} position={p.position} scale={p.scale} />
      ))}
    </Instances>
  );
}
```

### Pattern 5: PixiJS Animation → useFrame Hook

**PixiJS (Before):**
```typescript
import { Application, Sprite } from 'pixi.js';

const app = new Application();
const sprite = Sprite.from('character.png');

app.ticker.add((delta) => {
  sprite.rotation += 0.01 * delta;
  sprite.y = Math.sin(Date.now() * 0.001) * 10;
});
```

**Three.js (After):**
```typescript
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function AnimatedCharacter() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Rotation animation
    meshRef.current.rotation.y += 0.01 * delta * 60;
    
    // Breathing animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <capsuleGeometry args={[0.5, 1.5, 16, 32]} />
      <meshStandardMaterial color={KOREAN_COLORS.ACCENT_GOLD} />
    </mesh>
  );
}
```

---

## 🎨 Korean Theming in Three.js

### Using KOREAN_COLORS with Three.js

All existing `KOREAN_COLORS` constants work seamlessly with Three.js:

```typescript
import { KOREAN_COLORS } from '../types/constants';

// Material colors
<meshStandardMaterial color={KOREAN_COLORS.PRIMARY_CYAN} />
<meshStandardMaterial color={KOREAN_COLORS.ACCENT_GOLD} />

// Emissive materials for ki energy
<meshStandardMaterial 
  color={KOREAN_COLORS.CARDINAL_EAST}
  emissive={KOREAN_COLORS.CARDINAL_EAST}
  emissiveIntensity={0.5}
/>

// Point light colors
<pointLight 
  color={KOREAN_COLORS.SECONDARY_YELLOW}
  intensity={2}
  distance={5}
/>

// Ambient light with Korean theme
<ambientLight 
  color={KOREAN_COLORS.PRIMARY_CYAN}
  intensity={0.4}
/>
```

### Cardinal Directions (오방색) in 3D Space

```typescript
// Traditional Korean five directions in 3D
function CardinalDirectionLights() {
  return (
    <>
      {/* 동방 청색 - East (Blue-Green) */}
      <pointLight 
        position={[10, 0, 0]}
        color={KOREAN_COLORS.CARDINAL_EAST}
        intensity={0.8}
      />
      
      {/* 서방 백색 - West (White) */}
      <pointLight 
        position={[-10, 0, 0]}
        color={KOREAN_COLORS.CARDINAL_WEST}
        intensity={0.8}
      />
      
      {/* 남방 적색 - South (Red) */}
      <pointLight 
        position={[0, 0, 10]}
        color={KOREAN_COLORS.CARDINAL_SOUTH}
        intensity={0.8}
      />
      
      {/* 북방 흑색 - North (Black/Dark) */}
      <pointLight 
        position={[0, 0, -10]}
        color={KOREAN_COLORS.CARDINAL_NORTH}
        intensity={0.3}
      />
      
      {/* 중앙 황색 - Center (Yellow) */}
      <pointLight 
        position={[0, 10, 0]}
        color={KOREAN_COLORS.CARDINAL_CENTER}
        intensity={1.0}
      />
    </>
  );
}
```

---

## 📋 Step-by-Step Migration Process

### Phase 1: Setup Infrastructure ✅ COMPLETE

```bash
# Install Three.js dependencies (already done)
npm install three @react-three/fiber @react-three/drei
npm install --save-dev @types/three

# Verify installation
npm run test  # HelloThreeJS tests should pass
```

### Phase 2: Create Test Component ✅ COMPLETE

The `HelloThreeJS` component demonstrates:
- Canvas setup
- Basic 3D rendering
- Korean theming integration
- Animation with useFrame

**Location**: `src/components/test/HelloThreeJS.tsx`

### Phase 3: Migrate Particle Systems (Next)

**Target Components:**
- `src/components/combat/particles/HitEffectsLayer.tsx`
- Ki energy particles
- Blood splatter effects
- Impact sparks

**Strategy:**
1. Create `src/components/combat/particles/ThreeJSParticles.tsx`
2. Use `Instances` for performance
3. Maintain Korean color theming
4. Test performance (target: 1000+ particles at 60fps)

**Example:**
```typescript
// New file: src/components/combat/particles/KiEnergyParticles3D.tsx
import { Instances, Instance } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { KOREAN_COLORS } from '../../../types/constants';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
}

export function KiEnergyParticles3D() {
  const particlesRef = useRef<Particle[]>([]);
  
  // Initialize particles
  useMemo(() => {
    particlesRef.current = Array.from({ length: 500 }, () => ({
      position: new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ),
      velocity: new THREE.Vector3(
        Math.random() * 0.1 - 0.05,
        Math.random() * 0.1,
        Math.random() * 0.1 - 0.05
      ),
      life: Math.random(),
    }));
  }, []);
  
  // Animate particles
  useFrame((state, delta) => {
    particlesRef.current.forEach((particle) => {
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));
      particle.life -= delta * 0.5;
      
      // Reset dead particles
      if (particle.life <= 0) {
        particle.position.set(0, 0, 0);
        particle.life = 1.0;
      }
    });
  });
  
  return (
    <Instances limit={500}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial 
        color={KOREAN_COLORS.PRIMARY_CYAN}
        transparent
        opacity={0.8}
      />
      {particlesRef.current.map((particle, i) => (
        <Instance 
          key={i} 
          position={particle.position}
          scale={particle.life}
        />
      ))}
    </Instances>
  );
}
```

### Phase 4: Migrate UI Components

**Hybrid Approach**: Combine Three.js 3D with Html overlays

**Target Components:**
- CombatHUD → Keep as Html overlay
- Player status panels → Html overlay
- Damage numbers → Html with 3D positioning

**Example:**
```typescript
import { Html } from '@react-three/drei';

function CombatHUD3D({ player, enemy }) {
  return (
    <>
      {/* 3D character models */}
      <CharacterModel3D position={[-5, 0, 0]} state={player} />
      <CharacterModel3D position={[5, 0, 0]} state={enemy} />
      
      {/* Html UI overlays */}
      <Html position={[-5, 2.5, 0]} center>
        <PlayerStatusPanel player={player} />
      </Html>
      
      <Html position={[5, 2.5, 0]} center>
        <PlayerStatusPanel player={enemy} />
      </Html>
      
      {/* Fullscreen UI */}
      <Html fullscreen>
        <div className="combat-hud-overlay">
          <TrigramSelector />
          <ControlPanel />
        </div>
      </Html>
    </>
  );
}
```

### Phase 5: Migrate Character Rendering

**Target:**
- Create 3D character models
- Implement vital point visualization
- Add stance-based animations

**New Files:**
```
src/components/combat/characters/
  ├── CharacterModel3D.tsx        # Base 3D character
  ├── VitalPointMarkers3D.tsx     # 70 vital points in 3D
  ├── StanceAnimation3D.tsx       # Eight trigram stances
  └── DamageVisualization3D.tsx   # Blood and injury effects
```

**Example:**
```typescript
// src/components/combat/characters/CharacterModel3D.tsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { TrigramStance } from '../../../types/trigram';
import { KOREAN_COLORS } from '../../../types/constants';

interface CharacterModel3DProps {
  position: [number, number, number];
  stance: TrigramStance;
  health: number;
  isAttacking: boolean;
}

export function CharacterModel3D({
  position,
  stance,
  health,
  isAttacking,
}: CharacterModel3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Breathing animation
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const breathScale = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 1;
    groupRef.current.scale.y = breathScale;
  });
  
  // Color based on health
  const bodyColor = health > 70 
    ? KOREAN_COLORS.CARDINAL_EAST 
    : health > 30
    ? KOREAN_COLORS.CARDINAL_CENTER
    : KOREAN_COLORS.CARDINAL_SOUTH;
  
  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.5, 1.5, 16, 32]} />
        <meshStandardMaterial 
          color={bodyColor}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Stance aura */}
      <mesh scale={isAttacking ? 1.5 : 1.0}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color={getStanceColor(stance)}
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
      
      {/* Vital point markers */}
      <VitalPointMarkers3D visible={true} />
    </group>
  );
}

function getStanceColor(stance: TrigramStance): number {
  const stanceColors = {
    geon: KOREAN_COLORS.CARDINAL_CENTER,
    tae: KOREAN_COLORS.PRIMARY_CYAN,
    li: KOREAN_COLORS.CARDINAL_SOUTH,
    jin: KOREAN_COLORS.SECONDARY_YELLOW,
    son: KOREAN_COLORS.CARDINAL_EAST,
    gam: KOREAN_COLORS.ACCENT_BLUE,
    gan: KOREAN_COLORS.UI_BACKGROUND_LIGHT,
    gon: KOREAN_COLORS.UI_BACKGROUND_DARK,
  };
  return stanceColors[stance] || KOREAN_COLORS.ACCENT_GOLD;
}
```

### Phase 6: Performance Optimization

**Techniques:**
1. **Instancing** - Use `Instances` for repeated geometry
2. **LOD** - Level of Detail for distant objects
3. **Frustum Culling** - Automatic in Three.js
4. **Object Pooling** - Reuse objects instead of creating new ones
5. **Texture Atlases** - Combine textures to reduce draw calls

**Example:**
```typescript
import { Detailed } from '@react-three/drei';

function OptimizedCharacter() {
  return (
    <Detailed distances={[0, 10, 20]}>
      {/* High detail - close up */}
      <HighDetailCharacter />
      
      {/* Medium detail - medium distance */}
      <MediumDetailCharacter />
      
      {/* Low detail - far away */}
      <LowDetailCharacter />
    </Detailed>
  );
}
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
// Test Three.js component imports and props
describe('CharacterModel3D', () => {
  it('should be defined and importable', () => {
    expect(CharacterModel3D).toBeDefined();
  });
  
  it('should accept TypeScript props correctly', () => {
    const props = {
      position: [0, 0, 0] as [number, number, number],
      stance: 'geon' as TrigramStance,
      health: 85,
      isAttacking: false,
    };
    
    expect(props.position).toEqual([0, 0, 0]);
    expect(props.stance).toBe('geon');
  });
});
```

### Integration Tests

For full Three.js rendering, use Cypress E2E tests:

```typescript
// cypress/e2e/threejs-combat.cy.ts
describe('Three.js Combat Scene', () => {
  it('should render 3D combat arena', () => {
    cy.visit('/combat');
    
    // Check that Canvas rendered
    cy.get('canvas').should('exist');
    
    // Check that scene loaded
    cy.wait(1000); // Allow scene to render
    
    // Verify no WebGL errors in console
    cy.window().then((win) => {
      const errors = win.console.error;
      expect(errors).to.not.exist;
    });
  });
  
  it('should maintain 60fps during combat', () => {
    cy.visit('/combat');
    
    // Monitor FPS (would need custom FPS counter)
    cy.window().then((win) => {
      // Check performance metrics
      const performance = win.performance;
      expect(performance).to.exist;
    });
  });
});
```

---

## ⚠️ Common Pitfalls and Solutions

### Pitfall 1: Memory Leaks

**Problem**: Creating new Three.js objects in render without cleanup

```typescript
// ❌ BAD - Creates new geometry every render
function BadComponent() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} /> {/* New geometry every render! */}
      <meshStandardMaterial color={0xff0000} />
    </mesh>
  );
}

// ✅ GOOD - Geometry reused automatically by React Three Fiber
function GoodComponent() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={0xff0000} />
    </mesh>
  );
}

// ✅ GOOD - Explicit cleanup if needed
function ComponentWithCleanup() {
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);
  
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={0xff0000} />
    </mesh>
  );
}
```

### Pitfall 2: Performance Issues with Particles

**Problem**: Creating individual meshes for particles

```typescript
// ❌ BAD - Individual meshes (slow for many particles)
function BadParticles() {
  const particles = Array.from({ length: 1000 });
  
  return (
    <>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={0x00ffff} />
        </mesh>
      ))}
    </>
  );
}

// ✅ GOOD - Use Instances for performance
function GoodParticles() {
  const particles = useMemo(
    () => Array.from({ length: 1000 }, () => ({
      position: [Math.random() * 10, Math.random() * 10, Math.random() * 10],
    })),
    []
  );
  
  return (
    <Instances limit={1000}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color={0x00ffff} />
      {particles.map((p, i) => (
        <Instance key={i} position={p.position} />
      ))}
    </Instances>
  );
}
```

### Pitfall 3: Incorrect useFrame Usage

**Problem**: Modifying state directly in useFrame

```typescript
// ❌ BAD - Causes unnecessary re-renders
function BadAnimation() {
  const [rotation, setRotation] = useState(0);
  
  useFrame(() => {
    setRotation(prev => prev + 0.01); // Re-renders entire component!
  });
  
  return (
    <mesh rotation={[0, rotation, 0]}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}

// ✅ GOOD - Use refs for animation
function GoodAnimation() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01; // Direct manipulation, no re-render
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

### Pitfall 4: Html Overlays Performance

**Problem**: Too many Html components

```typescript
// ❌ BAD - Many Html components (expensive)
function BadHUD() {
  return (
    <>
      {players.map((player) => (
        <Html key={player.id} position={player.position}>
          <div>{player.name}</div>
        </Html>
      ))}
    </>
  );
}

// ✅ GOOD - Single Html overlay
function GoodHUD() {
  return (
    <Html fullscreen>
      <div className="hud-container">
        {players.map((player) => (
          <div 
            key={player.id}
            style={{
              position: 'absolute',
              left: `${player.screenX}px`,
              top: `${player.screenY}px`,
            }}
          >
            {player.name}
          </div>
        ))}
      </div>
    </Html>
  );
}
```

---

## 🎯 Performance Targets

### Desktop (1920x1080)
- **Target**: 60fps sustained
- **Particles**: 1000+ at 60fps
- **Draw calls**: < 100
- **Memory**: < 500MB

### Mobile (720p)
- **Target**: 55fps minimum
- **Particles**: 500+ at 55fps
- **Draw calls**: < 50
- **Memory**: < 300MB

### Monitoring

```typescript
import { Stats } from '@react-three/drei';

function Scene() {
  return (
    <Canvas>
      {/* Your 3D content */}
      
      {/* Show FPS stats in development */}
      {process.env.NODE_ENV === 'development' && <Stats />}
    </Canvas>
  );
}
```

---

## 📚 Resources

### Official Documentation
- **Three.js**: https://threejs.org/docs/
- **@react-three/fiber**: https://docs.pmnd.rs/react-three-fiber/
- **@react-three/drei**: https://github.com/pmndrs/drei

### Reference Implementations
- **Hack23/game**: https://github.com/Hack23/game - Reference Three.js architecture

### Learning Resources
- **Three.js Journey**: https://threejs-journey.com/
- **Discover three.js**: https://discoverthreejs.com/
- **React Three Fiber Examples**: https://docs.pmnd.rs/react-three-fiber/getting-started/examples

---

## 🎓 Next Steps

1. **Review this guide** - Understand the migration strategy
2. **Study HelloThreeJS** - Examine the test component (`src/components/test/HelloThreeJS.tsx`)
3. **Plan migration priority** - Which components to migrate first
4. **Create proof of concept** - Migrate one small component
5. **Measure performance** - Ensure 60fps target met
6. **Iterate** - Refine patterns and repeat

---

## ✅ Migration Checklist

### Preparation
- [x] Three.js dependencies installed
- [x] Test component created (HelloThreeJS)
- [x] Korean theming verified
- [ ] Migration guide reviewed

### Phase 1: Particles
- [ ] Ki energy particles migrated
- [ ] Blood splatter effects migrated
- [ ] Impact sparks migrated
- [ ] Performance validated (1000+ particles at 60fps)

### Phase 2: UI
- [ ] Combat HUD converted to Html overlays
- [ ] Player status panels migrated
- [ ] Damage numbers implemented
- [ ] Korean fonts working in Html overlays

### Phase 3: Characters
- [ ] 3D character models created
- [ ] Vital point markers in 3D
- [ ] Stance animations implemented
- [ ] Collision detection updated

### Phase 4: Polish
- [ ] Lighting optimized
- [ ] Shadows configured
- [ ] Post-processing effects added
- [ ] Mobile performance validated

### Phase 5: Deprecation
- [ ] Old PixiJS components marked deprecated
- [ ] Documentation updated
- [ ] E2E tests updated
- [ ] Production deployment

---

**흑괘의 3D 여정을 시작하라** - _Begin Black Trigram's 3D Journey_

---

**📋 Document Control:**  
**✅ Created:** 2025-01-20  
**📤 Distribution:** Development Team  
**🏷️ Classification:** Internal  
**⏰ Next Review:** After Phase 3 completion
