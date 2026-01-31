---
name: performance-optimization
description: |
  Enforces 60fps rendering for Three.js scenes, bundle size optimization (<500KB initial,
  <2MB total), Lighthouse performance score >90, memory leak prevention, efficient Three.js
  patterns (instancing, LOD, culling), and performance budget monitoring for Black Trigram.
license: MIT
---

# Performance Optimization Skill

## Purpose

This skill ensures that Black Trigram maintains exceptional performance across all platforms, achieving consistent 60fps rendering, optimal bundle sizes, and efficient resource utilization while providing an immersive Korean martial arts experience.

## When to Apply

**Automatically trigger this skill when:**
- Creating or modifying Three.js scenes and components
- Adding new 3D models, textures, or visual effects
- Implementing animation systems or game loops
- Working with WebGL shaders or materials
- Adding third-party dependencies
- Optimizing rendering performance
- Implementing lazy loading or code splitting
- Adding performance-critical game logic
- Reviewing pull requests with performance impact

## Core Principles

### 1. 60fps Rendering Target (Essential for Combat)

**ALWAYS maintain 60fps (16.67ms per frame):**

✅ **Frame Budget Breakdown**
```typescript
// Frame time budget for 60fps
const FRAME_BUDGET_MS = {
  TOTAL: 16.67,           // Total frame time
  GAME_LOGIC: 3.0,        // Combat calculations, AI
  PHYSICS: 2.0,           // Collision detection, animations
  RENDERING: 8.0,         // Three.js draw calls
  INPUT: 1.0,             // Input processing
  AUDIO: 1.0,             // Audio updates
  OVERHEAD: 1.67,         // Browser overhead, GC
} as const;

// ALWAYS measure frame time
import { useFrame } from '@react-three/fiber';

export const PerformanceMonitor: React.FC = () => {
  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef(performance.now());
  
  useFrame(() => {
    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;
    lastTimeRef.current = now;
    
    // Track frame times (rolling window)
    frameTimesRef.current.push(deltaTime);
    if (frameTimesRef.current.length > 120) {
      frameTimesRef.current.shift();
    }
    
    // Alert if frame time exceeds budget
    if (deltaTime > FRAME_BUDGET_MS.TOTAL) {
      console.warn(`Frame time exceeded: ${deltaTime.toFixed(2)}ms`);
    }
    
    // Calculate average FPS
    const avgFrameTime = 
      frameTimesRef.current.reduce((a, b) => a + b, 0) / 
      frameTimesRef.current.length;
    const fps = 1000 / avgFrameTime;
    
    if (fps < 55) {
      console.error(`Low FPS detected: ${fps.toFixed(1)}`);
    }
  });
  
  return null;
};
```

✅ **Performance Profiling in Development**
```typescript
// ALWAYS profile performance-critical sections
import { useFrame } from '@react-three/fiber';

export const ProfiledCombatSystem: React.FC = () => {
  useFrame(() => {
    // Profile game logic
    performance.mark('combat-logic-start');
    updateCombatLogic();
    performance.mark('combat-logic-end');
    performance.measure(
      'Combat Logic',
      'combat-logic-start',
      'combat-logic-end'
    );
    
    // Check measurement
    const measure = performance.getEntriesByName('Combat Logic')[0];
    if (measure.duration > FRAME_BUDGET_MS.GAME_LOGIC) {
      console.warn(`Combat logic too slow: ${measure.duration.toFixed(2)}ms`);
    }
    
    performance.clearMarks();
    performance.clearMeasures();
  });
};
```

### 2. Bundle Size Optimization

**ALWAYS enforce bundle size limits:**

✅ **Bundle Size Targets**
```typescript
// vite.config.ts - Bundle size configuration
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React + Three.js
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          
          // Separate chunk for Korean assets
          korean: ['./src/types/constants/korean'],
          
          // Audio system separate chunk
          audio: ['./src/audio/AudioProvider'],
        },
      },
    },
    
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug'],
      },
    },
    
    // Bundle size warning thresholds
    chunkSizeWarningLimit: 500, // 500KB warning
  },
});
```

✅ **Bundle Size Monitoring**
```json
// package.json - Add bundle size analysis
{
  "scripts": {
    "build": "tsc && vite build",
    "build:analyze": "vite-bundle-visualizer",
    "build:check-size": "npm run build && bundlesize"
  },
  "bundlesize": [
    {
      "path": "./dist/assets/index-*.js",
      "maxSize": "500 KB"
    },
    {
      "path": "./dist/assets/vendor-*.js",
      "maxSize": "300 KB"
    },
    {
      "path": "./dist/assets/three-*.js",
      "maxSize": "400 KB"
    }
  ]
}
```

✅ **Lazy Loading for Non-Critical Code**
```typescript
// ALWAYS lazy load non-critical screens
import { lazy, Suspense } from 'react';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

// Lazy load heavy screens
const CombatScreen = lazy(() => import('@/screens/CombatScreen'));
const SettingsScreen = lazy(() => import('@/screens/SettingsScreen'));
const TrainingScreen = lazy(() => import('@/screens/TrainingScreen'));

export const App: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen korean="로딩 중" english="Loading" />}>
      <Router>
        <Routes>
          <Route path="/" element={<IntroScreen />} />
          <Route path="/combat" element={<CombatScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/training" element={<TrainingScreen />} />
        </Routes>
      </Router>
    </Suspense>
  );
};
```

### 3. Three.js Performance Optimization

**ALWAYS use efficient Three.js patterns:**

✅ **Instancing for Repeated Geometry**
```typescript
// GOOD: Use instancing for particles, bullets, effects
import { Instances, Instance } from '@react-three/drei';
import { useMemo } from 'react';
import { KOREAN_COLORS } from '@/types/constants';

export const OptimizedParticles: React.FC<{ count: number }> = ({ count }) => {
  // Pre-calculate positions once
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

// BAD: Creating individual meshes (100x slower!)
export const UnoptimizedParticles: React.FC = () => {
  return (
    <>
      {Array.from({ length: 1000 }).map((_, i) => (
        <mesh key={i} position={[Math.random() * 20 - 10, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={0x00ffff} />
        </mesh>
      ))}
    </>
  );
};
```

✅ **Level of Detail (LOD) for Distance-Based Quality**
```typescript
// GOOD: Use LOD for characters at varying distances
import { Detailed } from '@react-three/drei';

export const OptimizedCharacter: React.FC<{ position: Vector3 }> = ({ position }) => {
  return (
    <Detailed distances={[0, 10, 20, 40]} position={position}>
      {/* High detail (0-10 units) - 5000 triangles */}
      <HighDetailCharacterMesh />
      
      {/* Medium detail (10-20 units) - 1500 triangles */}
      <MediumDetailCharacterMesh />
      
      {/* Low detail (20-40 units) - 500 triangles */}
      <LowDetailCharacterMesh />
      
      {/* Billboard (40+ units) - 2 triangles */}
      <CharacterBillboard />
    </Detailed>
  );
};
```

✅ **Frustum Culling and Object Culling**
```typescript
// GOOD: Enable frustum culling (default in Three.js)
// Manually cull objects outside view when needed

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

export const CulledObject: React.FC<{ position: Vector3 }> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [isVisible, setIsVisible] = useState(true);
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Check if object is in camera frustum
    const frustum = new THREE.Frustum();
    const projectionMatrix = new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(projectionMatrix);
    
    const visible = frustum.intersectsObject(meshRef.current);
    if (visible !== isVisible) {
      setIsVisible(visible);
    }
  });
  
  // Don't render if not visible
  if (!isVisible) return null;
  
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
};
```

✅ **Memoize Geometries and Materials**
```typescript
// GOOD: Reuse geometries and materials
import { useMemo } from 'react';
import * as THREE from 'three';
import { KOREAN_COLORS } from '@/types/constants';

export const OptimizedMeshes: React.FC = () => {
  // Create geometry once, reuse for all instances
  const sharedGeometry = useMemo(
    () => new THREE.BoxGeometry(1, 1, 1),
    []
  );
  
  // Create material once, reuse for all instances
  const sharedMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: KOREAN_COLORS.PRIMARY_CYAN,
      metalness: 0.5,
      roughness: 0.5,
    }),
    []
  );
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sharedGeometry.dispose();
      sharedMaterial.dispose();
    };
  }, [sharedGeometry, sharedMaterial]);
  
  return (
    <>
      <mesh geometry={sharedGeometry} material={sharedMaterial} position={[-2, 0, 0]} />
      <mesh geometry={sharedGeometry} material={sharedMaterial} position={[0, 0, 0]} />
      <mesh geometry={sharedGeometry} material={sharedMaterial} position={[2, 0, 0]} />
    </>
  );
};

// BAD: Creating new geometry/material for each mesh
export const UnoptimizedMeshes: React.FC = () => {
  return (
    <>
      {Array.from({ length: 100 }).map((_, i) => (
        <mesh key={i} position={[i, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} /> {/* New geometry each time! */}
          <meshStandardMaterial color={0x00ffff} /> {/* New material each time! */}
        </mesh>
      ))}
    </>
  );
};
```

✅ **Efficient useFrame Usage**
```typescript
// GOOD: Batch operations in useFrame
import { useFrame } from '@react-three/fiber';

export const OptimizedAnimations: React.FC = () => {
  const objectsRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (!objectsRef.current) return;
    
    // Batch all updates in single frame callback
    objectsRef.current.children.forEach((child, i) => {
      // Update rotation
      child.rotation.y += delta * 0.5;
      
      // Update position with sine wave
      child.position.y = Math.sin(state.clock.elapsedTime + i) * 0.5;
    });
  });
  
  return <group ref={objectsRef}>{/* children */}</group>;
};

// BAD: Multiple useFrame calls
export const UnoptimizedAnimations: React.FC = () => {
  // Each child component has its own useFrame
  // This creates 100 separate frame callbacks!
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
  
  // BAD: Separate useFrame for each instance
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.5;
  });
  
  return <mesh ref={meshRef}>{/* ... */}</mesh>;
};
```

### 4. Memory Management and Leak Prevention

**ALWAYS clean up Three.js resources:**

✅ **Proper Resource Disposal**
```typescript
// GOOD: Clean up geometries, materials, textures
import { useEffect } from 'react';
import * as THREE from 'three';

export const ProperCleanup: React.FC = () => {
  useEffect(() => {
    // Create resources
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial();
    const texture = new THREE.TextureLoader().load('/texture.png');
    
    // Cleanup on unmount
    return () => {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);
};
```

✅ **Memory Monitoring in Development**
```typescript
// ALWAYS monitor memory usage
export const MemoryMonitor: React.FC = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const interval = setInterval(() => {
      if (performance.memory) {
        const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
        const percentUsed = (usedJSHeapSize / jsHeapSizeLimit) * 100;
        
        if (percentUsed > 80) {
          console.warn(`High memory usage: ${percentUsed.toFixed(1)}%`);
        }
        
        console.log(`Memory: ${(usedJSHeapSize / 1048576).toFixed(2)} MB`);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return null;
};
```

### 5. WebGL Best Practices

**ALWAYS follow WebGL performance guidelines:**

✅ **Optimize Draw Calls**
```typescript
// GOOD: Minimize draw calls by merging geometries
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import * as THREE from 'three';

export const MergedGeometry: React.FC = () => {
  const mergedGeo = useMemo(() => {
    const geometries: THREE.BufferGeometry[] = [];
    
    // Create 100 box geometries at different positions
    for (let i = 0; i < 100; i++) {
      const geo = new THREE.BoxGeometry(1, 1, 1);
      geo.translate(i * 2, 0, 0);
      geometries.push(geo);
    }
    
    // Merge into single geometry (1 draw call instead of 100!)
    const merged = mergeBufferGeometries(geometries);
    
    // Clean up individual geometries
    geometries.forEach(g => g.dispose());
    
    return merged;
  }, []);
  
  return (
    <mesh geometry={mergedGeo}>
      <meshStandardMaterial />
    </mesh>
  );
};
```

✅ **Reduce Texture Size and Use Compression**
```typescript
// GOOD: Use compressed textures and mipmaps
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const OptimizedTextures: React.FC = () => {
  const texture = useTexture('/textures/character-diffuse.jpg');
  
  // Configure texture for performance
  useMemo(() => {
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 4; // Reasonable quality
    texture.generateMipmaps = true;
    
    // Use power-of-2 sizes: 512x512, 1024x1024, 2048x2048
    // Avoid odd sizes like 1234x567
  }, [texture]);
  
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};
```

✅ **Limit Light Count**
```typescript
// GOOD: Use reasonable light count
export const OptimizedLighting: React.FC = () => {
  return (
    <>
      {/* 1 ambient light for global illumination */}
      <ambientLight intensity={0.4} color={KOREAN_COLORS.PRIMARY_CYAN} />
      
      {/* 1 directional light for main shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* 1-2 point lights for accents */}
      <pointLight
        position={[0, 5, 0]}
        intensity={0.5}
        color={KOREAN_COLORS.ACCENT_GOLD}
      />
    </>
  );
};

// BAD: Too many lights (kills performance)
export const UnoptimizedLighting: React.FC = () => {
  return (
    <>
      {/* 50 point lights = instant FPS drop! */}
      {Array.from({ length: 50 }).map((_, i) => (
        <pointLight key={i} position={[i, 0, 0]} castShadow />
      ))}
    </>
  );
};
```

### 6. Performance Budgets and Monitoring

**ALWAYS enforce performance budgets:**

✅ **Lighthouse Performance Score >90**
```json
// .github/workflows/performance.yml
name: Performance Audit

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.json'
          
# lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "speed-index": ["error", { "maxNumericValue": 3000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "interactive": ["error", { "maxNumericValue": 3500 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

✅ **Performance Budget in CI**
```typescript
// scripts/check-performance-budget.ts
interface PerformanceBudget {
  readonly metric: string;
  readonly budget: number;
  readonly actual: number;
}

const PERFORMANCE_BUDGETS: PerformanceBudget[] = [
  { metric: 'JavaScript Bundle', budget: 500, actual: 0 }, // KB
  { metric: 'CSS Bundle', budget: 50, actual: 0 }, // KB
  { metric: 'Images Total', budget: 1000, actual: 0 }, // KB
  { metric: 'Total Bundle', budget: 2000, actual: 0 }, // KB
  { metric: 'FPS (min)', budget: 55, actual: 0 }, // fps
  { metric: 'Frame Time (max)', budget: 18, actual: 0 }, // ms
];

// Check bundle sizes
const checkBudgets = async () => {
  // ... implementation
  const failures = PERFORMANCE_BUDGETS.filter(b => b.actual > b.budget);
  
  if (failures.length > 0) {
    console.error('Performance budget exceeded:');
    failures.forEach(f => {
      console.error(`  ${f.metric}: ${f.actual} > ${f.budget}`);
    });
    process.exit(1);
  }
};
```

### 7. Common Performance Anti-Patterns to REJECT

**Immediately flag and reject these patterns:**

❌ **Creating Objects in useFrame**
```typescript
// BAD: Creating new objects every frame
useFrame(() => {
  const vector = new THREE.Vector3(); // New object every frame!
  mesh.position.copy(vector);
});

// GOOD: Reuse objects
const tempVector = useMemo(() => new THREE.Vector3(), []);
useFrame(() => {
  tempVector.set(x, y, z);
  mesh.position.copy(tempVector);
});
```

❌ **Unnecessary Re-renders**
```typescript
// BAD: Component re-renders on every parent update
export const ExpensiveComponent: React.FC<{ data: Data }> = ({ data }) => {
  // Expensive calculation runs on every render!
  const result = expensiveCalculation(data);
  return <div>{result}</div>;
};

// GOOD: Memoize expensive calculations
export const OptimizedComponent: React.FC<{ data: Data }> = ({ data }) => {
  const result = useMemo(() => expensiveCalculation(data), [data]);
  return <div>{result}</div>;
};
```

❌ **Too Many Shadow-Casting Lights**
```typescript
// BAD: Every light casts shadows
{lights.map((light, i) => (
  <pointLight key={i} castShadow />
))}

// GOOD: Only 1-2 main lights cast shadows
<directionalLight castShadow position={[10, 10, 5]} />
<pointLight intensity={0.5} /> {/* No shadow casting */}
```

❌ **High-Resolution Shadows**
```typescript
// BAD: 4K shadow maps (huge performance cost)
<directionalLight castShadow shadow-mapSize={[4096, 4096]} />

// GOOD: 2K or 1K shadow maps
<directionalLight castShadow shadow-mapSize={[2048, 2048]} />
```

❌ **Unoptimized Textures**
```typescript
// BAD: Loading 4K uncompressed PNG
const texture = useTexture('/character-4k.png'); // 8MB!

// GOOD: Use compressed JPG or WebP, reasonable resolution
const texture = useTexture('/character-1k.jpg'); // 200KB
```

## Enforcement Rules

### Rule 1: All 3D Scenes Must Maintain 60fps

```
IF (frame time > 16.67ms consistently)
THEN (optimize rendering OR reduce quality)
ELSE (approve performance)
```

### Rule 2: Bundle Size Limits Enforced

```
IF (initial bundle > 500KB OR total bundle > 2MB)
THEN (apply code splitting, lazy loading, or tree shaking)
ELSE (approve bundle size)
```

### Rule 3: Lighthouse Performance Score Must Be >90

```
IF (Lighthouse performance score < 90)
THEN (optimize Critical Rendering Path, reduce JavaScript)
ELSE (approve performance score)
```

### Rule 4: Memory Leaks Must Be Fixed

```
IF (memory usage grows unbounded over time)
THEN (add proper cleanup in useEffect and component unmount)
ELSE (approve memory management)
```

### Rule 5: Use Three.js Performance Best Practices

```
IF (component uses inefficient patterns like no instancing, no LOD, or excessive draw calls)
THEN (refactor to use instancing, LOD, and merged geometries)
ELSE (approve Three.js implementation)
```

## Performance Checklist

**Before approving any performance-critical change:**

- [ ] **60fps Target**: Maintains 60fps on target hardware
- [ ] **Bundle Size**: Initial <500KB, total <2MB
- [ ] **Lighthouse Score**: Performance score >90
- [ ] **Memory Management**: No memory leaks detected
- [ ] **Three.js Optimization**: Uses instancing, LOD, and culling where appropriate
- [ ] **Texture Optimization**: Textures are compressed and power-of-2 sizes
- [ ] **Draw Calls**: Minimized through geometry merging
- [ ] **Light Count**: Reasonable light count (3-5 lights max)
- [ ] **Shadow Quality**: Shadows use 2K or 1K maps
- [ ] **Code Splitting**: Non-critical code is lazy loaded
- [ ] **Profiling**: Performance profiled in development
- [ ] **Budget Monitoring**: CI checks enforce performance budgets

## ISO 27001 Alignment

This skill enforces controls from:

- **A.12.1** - Operational Procedures and Responsibilities (performance monitoring)
- **A.12.6** - Technical Vulnerability Management (performance vulnerabilities)

## NIST CSF 2.0 Alignment

- **PR.DS-06**: Integrity checking mechanisms verify performance baselines
- **DE.CM-04**: Performance anomalies detected and analyzed

## CIS Controls v8.1 Alignment

- **Control 12**: Network Infrastructure Management (optimize network asset loading)
- **Control 16**: Application Software Security (performance validation)

## Korean Philosophy Integration

### 효율의 도 (The Way of Efficiency)

**Core Performance Principles:**

1. **간결함 (Simplicity)** - Eliminate unnecessary complexity in rendering
2. **조화 (Harmony)** - Balance visual quality with performance
3. **절제 (Restraint)** - Use resources wisely, avoid excess
4. **유연함 (Flexibility)** - Adapt quality based on hardware capabilities
5. **지속성 (Sustainability)** - Maintain performance over extended gameplay

**흑괘 성능 철학 (Black Trigram Performance Philosophy):**
- **빠름 (Speed)** - 60fps is non-negotiable for combat precision
- **효율 (Efficiency)** - Every byte, every draw call, every frame matters
- **최적화 (Optimization)** - Continuous improvement, never settle

## Remember

**Performance is not optional—it is essential for authentic martial arts gameplay. Every millisecond counts when executing precision strikes on vital points.**

When optimizing performance:
1. **MEASURE** - Always profile before optimizing
2. **TARGET** - Focus on the biggest bottlenecks first
3. **OPTIMIZE** - Use Three.js best practices (instancing, LOD, culling)
4. **VERIFY** - Confirm improvements with performance tests
5. **MONITOR** - Continuously track performance in CI
6. **BUDGET** - Enforce performance budgets for all changes

**흑괘의 속도를 지켜라** - _Protect the Speed of the Black Trigram_
