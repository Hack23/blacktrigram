---
name: threejs-best-practices
description: |
  Enforces @react-three/fiber and @react-three/drei best practices for Black Trigram,
  including proper Canvas setup, Korean-themed lighting, resource cleanup patterns,
  Html overlay vs 3D mesh decision guide, performance optimization (useFrame, useMemo),
  testing patterns, and common Three.js anti-patterns to avoid.
license: MIT
---

# Three.js Best Practices Skill

## Purpose

This skill ensures that all Three.js implementations in Black Trigram follow React Three Fiber best practices, maintain 60fps performance, properly manage resources, and create immersive 3D Korean martial arts experiences with proper separation between 3D world and UI overlays.

## When to Apply

**Automatically trigger this skill when:**
- Creating or modifying Three.js scenes or components
- Implementing 3D models, characters, or environments
- Adding visual effects, particles, or shaders
- Working with cameras, lights, or materials
- Creating UI overlays with `<Html>` components
- Implementing animations with `useFrame`
- Adding textures, geometries, or Three.js objects
- Optimizing 3D rendering performance
- Reviewing pull requests with Three.js changes

## Core Principles

### 1. Canvas Setup and Scene Configuration

**ALWAYS use proper Canvas configuration:**

✅ **Standard Canvas Setup for Black Trigram**
```typescript
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Stats } from '@react-three/drei';
import { KOREAN_COLORS } from '@/types/constants';
import * as THREE from 'three';

interface Scene3DWrapperProps {
  readonly width: number;
  readonly height: number;
  readonly children: React.ReactNode;
  readonly showStats?: boolean;
  readonly enableShadows?: boolean;
}

export const Scene3DWrapper: React.FC<Scene3DWrapperProps> = ({
  width,
  height,
  children,
  showStats = false,
  enableShadows = true,
}) => {
  return (
    <Canvas
      style={{ width, height }}
      gl={{
        antialias: true,                    // Smooth edges
        alpha: false,                       // Opaque background (better performance)
        powerPreference: 'high-performance', // Use discrete GPU if available
        preserveDrawingBuffer: false,       // Better performance
      }}
      dpr={[1, 2]}                          // Adaptive pixel ratio (1x on low-end, 2x on high-end)
      shadows={enableShadows}               // Enable shadow rendering
      frameloop="always"                    // Always render (for games)
      onCreated={({ gl, scene }) => {
        // Set Korean cyberpunk background
        gl.setClearColor(KOREAN_COLORS.UI_BACKGROUND_DARK, 1);
        
        // Add fog for depth perception
        scene.fog = new THREE.Fog(
          KOREAN_COLORS.UI_BACKGROUND_DARK,
          10,  // Near distance
          50   // Far distance
        );
        
        // Enable tone mapping for better colors
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
      }}
      data-testid="game-canvas"
    >
      {/* Korean-themed lighting */}
      <ambientLight intensity={0.4} color={KOREAN_COLORS.PRIMARY_CYAN} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-mapSize={[2048, 2048]}
        color={KOREAN_COLORS.ACCENT_GOLD}
      />
      
      {/* Environment for reflections */}
      <Environment preset="city" />
      
      {/* Default camera */}
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />
      
      {/* Game content */}
      {children}
      
      {/* Performance stats in development */}
      {showStats && process.env.NODE_ENV === 'development' && <Stats />}
    </Canvas>
  );
};
```

✅ **Canvas Performance Configuration**
```typescript
// GOOD: Optimized Canvas for 60fps
<Canvas
  gl={{
    antialias: true,
    alpha: false,              // Opaque background = better performance
    powerPreference: 'high-performance',
    stencil: false,            // Disable if not using
    depth: true,               // Enable depth testing
  }}
  dpr={[1, 2]}                 // Adaptive DPR based on device
  shadows                      // Enable shadows (moderate cost)
  frameloop="always"           // For games, always render
  performance={{
    current: 1,                // Performance factor (1 = normal)
    min: 0.5,                  // Minimum performance factor
    max: 1,                    // Maximum performance factor
    debounce: 200,             // Debounce time for performance adjustments
  }}
/>

// BAD: Unoptimized Canvas
<Canvas
  gl={{ antialias: true, alpha: true }} // Alpha = performance cost
  dpr={3}                                // Fixed 3x DPR = performance cost
  frameloop="demand"                     // For games, use "always"
/>
```

### 2. Korean-Themed Lighting and Aesthetics

**ALWAYS apply Korean cyberpunk lighting:**

✅ **Standard Three-Light Setup**
```typescript
// GOOD: Efficient three-light setup with Korean colors
import { KOREAN_COLORS } from '@/types/constants';

export const KoreanSceneLighting: React.FC = () => {
  return (
    <>
      {/* 1. Ambient light for base illumination (Korean cyan) */}
      <ambientLight 
        intensity={0.4} 
        color={KOREAN_COLORS.PRIMARY_CYAN} 
      />
      
      {/* 2. Directional light for main shadows (Korean gold) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        color={KOREAN_COLORS.ACCENT_GOLD}
      />
      
      {/* 3. Accent point light for highlights (Korean blue) */}
      <pointLight
        position={[-10, 5, -5]}
        intensity={0.5}
        distance={20}
        decay={2}
        color={KOREAN_COLORS.ACCENT_BLUE}
      />
    </>
  );
};

// BAD: Too many lights (kills performance)
export const UnoptimizedLighting: React.FC = () => {
  return (
    <>
      {/* 50 point lights = FPS drops to 10! */}
      {Array.from({ length: 50 }).map((_, i) => (
        <pointLight key={i} position={[i, 0, 0]} castShadow />
      ))}
    </>
  );
};
```

✅ **Korean-Themed Materials**
```typescript
// GOOD: Korean cyberpunk materials with emissive effects
import { useMemo } from 'react';
import * as THREE from 'three';
import { KOREAN_COLORS } from '@/types/constants';

export const KoreanStyledMesh: React.FC<{ stance: TrigramStance }> = ({ stance }) => {
  const material = useMemo(() => {
    const stanceColor = TRIGRAM_STANCES[stance].color;
    
    return new THREE.MeshStandardMaterial({
      color: stanceColor,
      emissive: KOREAN_COLORS.PRIMARY_CYAN,
      emissiveIntensity: 0.2,
      metalness: 0.5,
      roughness: 0.5,
      envMapIntensity: 1.0,
    });
  }, [stance]);
  
  useEffect(() => {
    return () => material.dispose();
  }, [material]);
  
  return (
    <mesh material={material} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
};

// Enhanced material with Korean aesthetics
export const EnhancedKoreanMaterial: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 2, 0.1]} />
      <meshStandardMaterial
        color={KOREAN_COLORS.UI_BACKGROUND_MEDIUM}
        emissive={KOREAN_COLORS.PRIMARY_CYAN}
        emissiveIntensity={0.3}
        metalness={0.6}
        roughness={0.4}
        transparent={true}
        opacity={0.9}
      />
    </mesh>
  );
};
```

### 3. Html Overlay vs 3D Mesh Decision Guide

**ALWAYS choose the right approach:**

✅ **Use Html Overlays For:**
```typescript
import { Html } from '@react-three/drei';
import { FONT_FAMILY, KOREAN_COLORS } from '@/types/constants';

// 1. UI ELEMENTS (buttons, menus, text)
export const PlayerNametag: React.FC<{ name: string; health: number }> = ({ name, health }) => {
  return (
    <Html position={[0, 2.5, 0]} center distanceFactor={10}>
      <div style={{
        background: `#${KOREAN_COLORS.UI_BACKGROUND_DARK.toString(16)}dd`,
        border: `2px solid #${KOREAN_COLORS.PRIMARY_CYAN.toString(16)}`,
        borderRadius: '8px',
        padding: '8px 12px',
        fontFamily: FONT_FAMILY.KOREAN,
        color: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16)}`,
        pointerEvents: 'none',
      }}>
        <div>{name}</div>
        <HealthBar value={health} />
      </div>
    </Html>
  );
};

// 2. INTERACTIVE MENUS
export const CombatMenu: React.FC<{ onAction: (action: string) => void }> = ({ onAction }) => {
  return (
    <Html fullscreen>
      <div style={{ 
        position: 'absolute', 
        bottom: 20, 
        left: '50%', 
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
      }}>
        <button 
          onClick={() => onAction('attack')}
          style={{
            fontFamily: FONT_FAMILY.KOREAN,
            background: `#${KOREAN_COLORS.PRIMARY_CYAN.toString(16)}`,
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          공격 | Attack
        </button>
        <button onClick={() => onAction('defend')}>
          방어 | Defend
        </button>
      </div>
    </Html>
  );
};

// 3. FULLSCREEN UI OVERLAYS
export const CombatHUD: React.FC = () => {
  return (
    <Html fullscreen>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}>
        <div style={{ position: 'absolute', top: 20, left: 20 }}>
          <PlayerStatus />
        </div>
        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <EnemyStatus />
        </div>
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
          <StanceIndicator />
        </div>
      </div>
    </Html>
  );
};
```

✅ **Use 3D Meshes For:**
```typescript
// 1. GAME OBJECTS AND CHARACTERS
export const CombatCharacter3D: React.FC<{ 
  position: Vector3; 
  stance: TrigramStance;
  isAttacking: boolean;
}> = ({ position, stance, isAttacking }) => {
  return (
    <group position={position}>
      {/* Character mesh */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.5, 1.5, 16, 32]} />
        <meshStandardMaterial
          color={TRIGRAM_STANCES[stance].color}
          emissive={KOREAN_COLORS.PRIMARY_CYAN}
          emissiveIntensity={isAttacking ? 0.5 : 0.1}
        />
      </mesh>
      
      {/* Stance aura (3D effect) */}
      <StanceAura3D stance={stance} />
    </group>
  );
};

// 2. VISUAL EFFECTS AND PARTICLES
export const AttackEffect3D: React.FC<{ position: Vector3 }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Point light for impact */}
      <pointLight
        intensity={2}
        distance={5}
        decay={2}
        color={KOREAN_COLORS.ACCENT_GOLD}
      />
      
      {/* Particle system */}
      <ImpactParticles count={50} spread={2} />
    </group>
  );
};

// 3. ENVIRONMENT AND WORLD OBJECTS
export const CombatArena3D: React.FC = () => {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color={KOREAN_COLORS.UI_BACKGROUND_DARK}
          roughness={0.8}
        />
      </mesh>
      
      {/* Arena walls */}
      <ArenaWalls />
      
      {/* Background elements */}
      <KoreanArchitecture />
    </group>
  );
};
```

✅ **Hybrid Approach (Recommended)**
```typescript
// GOOD: Combine both for best results
export const CombatSceneHybrid: React.FC = () => {
  return (
    <Scene3DWrapper width={1200} height={800}>
      {/* 3D WORLD: Characters, environment, effects */}
      <CombatArena3D />
      <CombatCharacter3D position={[-5, 0, 0]} stance="geon" />
      <CombatCharacter3D position={[5, 0, 0]} stance="gon" />
      <ParticleSystem3D />
      
      {/* HTML OVERLAYS: UI elements, text, menus */}
      <Html position={[-5, 2.5, 0]} center>
        <PlayerNametag name="Player 1" health={85} />
      </Html>
      
      <Html fullscreen>
        <CombatHUD />
        <ControlPanel />
      </Html>
    </Scene3DWrapper>
  );
};
```

### 4. Proper Three.js Resource Cleanup

**ALWAYS dispose of Three.js resources:**

✅ **Geometry and Material Disposal**
```typescript
// GOOD: Proper cleanup prevents memory leaks
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

export const ProperCleanup: React.FC = () => {
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x00ffff }),
    []
  );
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);
  
  return (
    <mesh geometry={geometry} material={material}>
      {/* No inline geometry/material = proper cleanup */}
    </mesh>
  );
};

// BAD: No cleanup (memory leak!)
export const MemoryLeak: React.FC = () => {
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x00ffff }),
    []
  );
  
  // Missing cleanup!
  
  return <mesh geometry={geometry} material={material} />;
};
```

✅ **Texture Disposal**
```typescript
// GOOD: Clean up textures
import { useTexture } from '@react-three/drei';
import { useEffect } from 'react';

export const TextureCleanup: React.FC = () => {
  const texture = useTexture('/textures/character.jpg');
  
  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);
  
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};
```

✅ **Complete Cleanup Pattern**
```typescript
// GOOD: Comprehensive cleanup
export const CompleteCleanup: React.FC = () => {
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.Material | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  
  useEffect(() => {
    // Load texture
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/texture.jpg');
    textureRef.current = texture;
    
    // Create geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    geometryRef.current = geometry;
    
    // Create material
    const material = new THREE.MeshStandardMaterial({ map: texture });
    materialRef.current = material;
    
    // Cleanup on unmount
    return () => {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);
  
  if (!geometryRef.current || !materialRef.current) {
    return null;
  }
  
  return (
    <mesh 
      geometry={geometryRef.current} 
      material={materialRef.current}
    />
  );
};
```

### 5. Efficient useFrame Patterns

**ALWAYS optimize useFrame usage:**

✅ **Batch Operations in useFrame**
```typescript
// GOOD: Single useFrame for multiple objects
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export const BatchedAnimations: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Batch all updates in one frame callback
    groupRef.current.children.forEach((child, i) => {
      child.rotation.y += delta * 0.5;
      child.position.y = Math.sin(state.clock.elapsedTime + i) * 0.5;
    });
  });
  
  return (
    <group ref={groupRef}>
      {Array.from({ length: 100 }).map((_, i) => (
        <mesh key={i} position={[i * 2, 0, 0]}>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      ))}
    </group>
  );
};

// BAD: Multiple useFrame calls (100x more expensive)
export const UnbatchedAnimations: React.FC = () => {
  return (
    <>
      {Array.from({ length: 100 }).map((_, i) => (
        <AnimatedObject key={i} index={i} />
      ))}
    </>
  );
};

const AnimatedObject: React.FC<{ index: number }> = ({ index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // BAD: Separate useFrame for each (100 callbacks per frame!)
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.5;
  });
  
  return <mesh ref={meshRef}><boxGeometry /></mesh>;
};
```

✅ **Reuse Temporary Objects**
```typescript
// GOOD: Reuse temp objects to avoid GC pressure
import { useMemo } from 'react';

export const EfficientUseFrame: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create temp objects once
  const tempVector = useMemo(() => new THREE.Vector3(), []);
  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Reuse temp objects (no GC pressure)
    tempVector.set(
      Math.sin(state.clock.elapsedTime),
      Math.cos(state.clock.elapsedTime),
      0
    );
    meshRef.current.position.copy(tempVector);
    
    // Rotation using temp quaternion
    tempQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), delta);
    meshRef.current.quaternion.multiply(tempQuaternion);
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
};

// BAD: Creating objects every frame
export const WastefulUseFrame: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // BAD: New Vector3 every frame = GC pressure!
    const tempVector = new THREE.Vector3(
      Math.sin(state.clock.elapsedTime),
      Math.cos(state.clock.elapsedTime),
      0
    );
    meshRef.current.position.copy(tempVector);
  });
  
  return <mesh ref={meshRef}><boxGeometry /></mesh>;
};
```

✅ **Conditional useFrame Execution**
```typescript
// GOOD: Skip unnecessary calculations
export const ConditionalFrame: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (!isActive || !meshRef.current) return; // Early exit
    
    // Only update when active
    meshRef.current.rotation.y += delta;
  });
  
  return <mesh ref={meshRef}><boxGeometry /></mesh>;
};
```

### 6. Performance Optimization Patterns

**ALWAYS use efficient Three.js patterns:**

✅ **Instancing for Repeated Geometry**
```typescript
// GOOD: Use Instances for repeated objects
import { Instances, Instance } from '@react-three/drei';

export const OptimizedParticles: React.FC<{ count: number }> = ({ count }) => {
  const positions = useMemo(
    () => Array.from({ length: count }, () => [
      Math.random() * 20 - 10,
      Math.random() * 10,
      Math.random() * 20 - 10,
    ] as [number, number, number]),
    [count]
  );
  
  return (
    <Instances limit={count}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color={KOREAN_COLORS.PRIMARY_CYAN} />
      
      {positions.map((pos, i) => (
        <Instance key={i} position={pos} />
      ))}
    </Instances>
  );
};

// BAD: Individual meshes (100x slower!)
export const UnoptimizedParticles: React.FC<{ count: number }> = ({ count }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[Math.random() * 20 - 10, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={0x00ffff} />
        </mesh>
      ))}
    </>
  );
};
```

✅ **Level of Detail (LOD)**
```typescript
// GOOD: Use LOD for distance-based quality
import { Detailed } from '@react-three/drei';

export const OptimizedCharacter: React.FC = () => {
  return (
    <Detailed distances={[0, 10, 20, 40]}>
      {/* High detail (0-10 units) */}
      <HighDetailMesh triangles={5000} />
      
      {/* Medium detail (10-20 units) */}
      <MediumDetailMesh triangles={1500} />
      
      {/* Low detail (20-40 units) */}
      <LowDetailMesh triangles={500} />
      
      {/* Billboard (40+ units) */}
      <CharacterBillboard triangles={2} />
    </Detailed>
  );
};
```

✅ **Memoize Expensive Calculations**
```typescript
// GOOD: useMemo for expensive operations
export const MemoizedComponent: React.FC<{ data: ComplexData }> = ({ data }) => {
  // Expensive calculation memoized
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);
  
  const geometry = useMemo(
    () => new THREE.BoxGeometry(1, 1, 1),
    []
  );
  
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial />
    </mesh>
  );
};

// BAD: Expensive calculations on every render
export const UnmemoizedComponent: React.FC<{ data: ComplexData }> = ({ data }) => {
  // Recalculated every render!
  const processedData = expensiveProcessing(data);
  
  return (
    <mesh>
      <boxGeometry /> {/* New geometry every render! */}
      <meshStandardMaterial />
    </mesh>
  );
};
```

### 7. Testing Three.js Components

**ALWAYS test Three.js components:**

✅ **Basic Three.js Component Test**
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
        isAttacking={false}
      />
    );
    
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
  
  it('should apply Korean theming colors', () => {
    const { container } = render3D(
      <CombatCharacter3D 
        position={[0, 0, 0]} 
        stance="geon" 
        isAttacking={false}
      />
    );
    
    // Verify component renders
    expect(container).toBeTruthy();
  });
});
```

✅ **Testing with @react-three/test-renderer**
```typescript
// For advanced testing, use @react-three/test-renderer
import { render } from '@react-three/test-renderer';

describe('Advanced Three.js Tests', () => {
  it('should update position on animation', async () => {
    const { scene, rerender, advance } = await render(
      <AnimatedMesh initialPosition={[0, 0, 0]} />
    );
    
    // Advance time by 1 second
    await advance(1);
    
    // Check that position changed
    const mesh = scene.children[0] as THREE.Mesh;
    expect(mesh.position.y).not.toBe(0);
  });
});
```

### 8. Common Three.js Anti-Patterns to REJECT

**Immediately flag and reject these patterns:**

❌ **Creating Objects in Render/useFrame**
```typescript
// BAD: Creating new objects every frame
useFrame(() => {
  const vector = new THREE.Vector3(); // Memory leak!
  mesh.position.copy(vector);
});

// GOOD: Reuse objects
const tempVector = useMemo(() => new THREE.Vector3(), []);
useFrame(() => {
  tempVector.set(x, y, z);
  mesh.position.copy(tempVector);
});
```

❌ **Missing Resource Cleanup**
```typescript
// BAD: No cleanup
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial();
// No dispose() call!

// GOOD: Cleanup in useEffect
useEffect(() => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial();
  
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);
```

❌ **Too Many Lights with Shadows**
```typescript
// BAD: Every light casts shadows
{lights.map((light, i) => (
  <pointLight key={i} castShadow />
))}

// GOOD: Only 1-2 main lights cast shadows
<directionalLight castShadow position={[10, 10, 5]} />
<pointLight intensity={0.5} /> {/* No shadow */}
```

❌ **Inline Geometry/Material Creation**
```typescript
// BAD: New geometry/material every render
return (
  <mesh>
    <boxGeometry args={[1, 1, 1]} /> {/* New every render! */}
    <meshStandardMaterial color={0xff0000} />
  </mesh>
);

// GOOD: Memoize or use refs
const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
const material = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xff0000 }), []);
```

## Enforcement Rules

### Rule 1: All Canvas Must Use Standard Configuration

```
IF (Canvas component created)
THEN (use Scene3DWrapper with Korean theming and performance settings)
ELSE (reject non-standard Canvas setup)
```

### Rule 2: Resource Cleanup Required

```
IF (Three.js objects created: geometry, material, texture)
THEN (add cleanup in useEffect return)
ELSE (reject PR for memory leak)
```

### Rule 3: Html for UI, Meshes for 3D

```
IF (adding UI element like button, text, menu)
THEN (use Html overlay)
ELSE IF (adding 3D game object, character, effect)
THEN (use 3D mesh)
ELSE (clarify use case and choose appropriate approach)
```

### Rule 4: Batch useFrame Operations

```
IF (multiple objects need animation)
THEN (use single useFrame callback with group ref)
ELSE (reject multiple useFrame hooks)
```

### Rule 5: Use Performance Optimization Patterns

```
IF (rendering repeated geometry OR distant objects)
THEN (use Instances for repeated, Detailed for LOD)
ELSE (optimize before merging)
```

## Three.js Best Practices Checklist

**Before approving any Three.js change:**

- [ ] **Canvas Setup**: Uses Scene3DWrapper with proper configuration
- [ ] **Korean Theming**: Applies Korean colors, lighting, materials
- [ ] **Resource Cleanup**: All geometries, materials, textures disposed
- [ ] **Html vs Mesh**: Correct choice for UI overlays vs 3D objects
- [ ] **useFrame Efficiency**: Batched operations, reused temp objects
- [ ] **Performance**: Uses Instances, LOD, and memoization
- [ ] **Light Count**: Reasonable light count (3-5 max)
- [ ] **Shadow Quality**: Only 1-2 lights cast shadows
- [ ] **Testing**: Component has unit tests
- [ ] **60fps Target**: Maintains 60fps on target hardware

## ISO 27001 Alignment

This skill enforces controls from:

- **A.12.1** - Operational procedures (3D rendering best practices)
- **A.12.6** - Technical vulnerability management (resource cleanup prevents crashes)

## NIST CSF 2.0 Alignment

- **PR.DS-06**: Integrity checking mechanisms (verify 3D scenes render correctly)

## CIS Controls v8.1 Alignment

- **Control 16**: Application Software Security (secure Three.js implementation)

## Korean Philosophy Integration

### 삼차원의 도 (The Way of Three Dimensions)

**Core Three.js Principles:**

1. **효율성 (Efficiency)** - Optimize every frame, every draw call
2. **간결성 (Simplicity)** - Use minimal resources for maximum effect
3. **조화 (Harmony)** - Balance visual quality with performance
4. **정리 (Cleanup)** - Properly dispose of all resources
5. **명료성 (Clarity)** - Clear separation between UI and 3D world

**흑괘 Three.js 철학 (Black Trigram Three.js Philosophy):**
- **몰입감 (Immersion)** - Create authentic 3D martial arts experience
- **성능 (Performance)** - 60fps is non-negotiable
- **미학 (Aesthetics)** - Korean cyberpunk visual identity

## Remember

**Three.js mastery requires discipline—every resource must be managed, every frame optimized.**

When implementing Three.js:
1. **SETUP** - Use Scene3DWrapper with Korean theming
2. **SEPARATE** - Html for UI, meshes for 3D world
3. **OPTIMIZE** - Use Instances, LOD, and batching
4. **CLEANUP** - Dispose all geometries, materials, textures
5. **BATCH** - Single useFrame for multiple objects
6. **TEST** - Verify components render correctly
7. **MEASURE** - Profile and maintain 60fps

**흑괘의 삼차원을 지켜라** - _Protect the Three Dimensions of the Black Trigram_
