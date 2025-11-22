# Three.js Performance Optimization Guide for Black Trigram (흑괘)

## 🎯 Performance Targets

- **Desktop**: 60fps minimum @ 1920x1080
- **Mobile**: 55fps minimum @ iPhone 11, Galaxy S10
- **Memory**: <300MB during 5-minute play session
- **Draw Calls**: <100 per frame
- **Bundle Size**: <1.5MB gzipped total

## 📊 Performance Monitoring

### Using PerformanceMonitor

```typescript
import { usePerformanceMonitor } from '../../utils/performance';

function GameScene() {
  const { metrics, isGood, warnings } = usePerformanceMonitor({
    enabled: import.meta.env.DEV,
    thresholds: {
      targetFps: 60,
      minAcceptableFps: 55,
      maxMemoryMB: 300,
      maxDrawCalls: 100,
    },
  });

  // Use metrics for development debugging
  if (import.meta.env.DEV) {
    console.log(metrics);
  }

  return (
    <>
      {/* 3D content */}
      {import.meta.env.DEV && <PerformanceOverlay3D />}
    </>
  );
}
```

### Performance Overlay

The `PerformanceOverlay3D` component is automatically included in `CombatScreen3D` during development:

```typescript
{import.meta.env.DEV && (
  <PerformanceOverlay3D
    position={[-7, 4, 0]}
    visible={true}
  />
)}
```

## 🚀 Optimization Techniques

### 1. Frustum Culling (Automatic)

Three.js automatically culls objects outside the camera frustum. Ensure objects have proper bounding volumes:

```typescript
// Mesh bounding volumes are calculated automatically
<mesh castShadow receiveShadow>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial />
</mesh>
```

### 2. Instancing for Repeated Geometry

Use `<Instances>` from `@react-three/drei` for many identical objects:

```typescript
import { Instances, Instance } from '@react-three/drei';

<Instances limit={1000}>
  <sphereGeometry args={[0.1, 8, 8]} />
  <meshBasicMaterial color={KOREAN_COLORS.PRIMARY_CYAN} />
  
  {particles.map((p) => (
    <Instance key={p.id} position={p.position} />
  ))}
</Instances>
```

### 3. Level of Detail (LOD)

Use `<Detailed>` for objects that appear at different distances:

```typescript
import { Detailed } from '@react-three/drei';

<Detailed distances={[0, 10, 20]}>
  <HighDetailCharacter />  {/* 0-10 units */}
  <MediumDetailCharacter /> {/* 10-20 units */}
  <LowDetailCharacter />    {/* 20+ units */}
</Detailed>
```

### 4. Geometry and Material Reuse

Always memoize geometries and materials:

```typescript
// ❌ BAD: Creates new objects every render
function BadComponent() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={0xff0000} />
    </mesh>
  );
}

// ✅ GOOD: Reuses geometry and material
function GoodComponent() {
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0xff0000 }),
    []
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <mesh geometry={geometry} material={material} />;
}
```

### 5. Texture Optimization

Optimize textures for performance:

```typescript
import { useTexture } from '@react-three/drei';

function OptimizedTexture() {
  const texture = useTexture('/path/to/texture.png');

  useMemo(() => {
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 8; // Max supported by most hardware
  }, [texture]);

  return texture;
}
```

### 6. Avoid Allocations in useFrame

```typescript
// ❌ BAD: Allocates new objects every frame
useFrame(() => {
  const velocity = new THREE.Vector3(1, 0, 0);
  mesh.position.add(velocity);
});

// ✅ GOOD: Reuses objects
const velocity = useRef(new THREE.Vector3(1, 0, 0));

useFrame(() => {
  mesh.position.add(velocity.current);
});
```

### 7. Limit Shadow Casters

Only enable shadows on important objects:

```typescript
// High-detail character
<mesh castShadow receiveShadow>
  <characterGeometry />
</mesh>

// Background environment
<mesh receiveShadow> {/* Only receive, don't cast */}
  <groundGeometry />
</mesh>

// Small particles
<mesh> {/* No shadows */}
  <particleGeometry />
</mesh>
```

### 8. Optimize Lights

Limit the number of dynamic lights:

```typescript
// ❌ BAD: Too many lights
<pointLight position={[1, 1, 1]} />
<pointLight position={[2, 2, 2]} />
<pointLight position={[3, 3, 3]} />
{/* ... 20 more lights */}

// ✅ GOOD: Few key lights + ambient
<ambientLight intensity={0.4} color={KOREAN_COLORS.PRIMARY_CYAN} />
<directionalLight position={[10, 10, 5]} intensity={1} castShadow />
<pointLight position={[-10, 5, -5]} intensity={0.5} />
```

### 9. Optimize Particle Systems

Use `Points` instead of individual meshes:

```typescript
import { Points, PointMaterial } from '@react-three/drei';

<Points positions={particlePositions}>
  <PointMaterial
    color={KOREAN_COLORS.PRIMARY_CYAN}
    size={0.08}
    sizeAttenuation
    transparent
    opacity={0.8}
    depthWrite={false}
  />
</Points>
```

### 10. Canvas Configuration

Optimize canvas settings:

```typescript
<Canvas
  gl={{
    antialias: true,
    alpha: false, // Faster when false
    powerPreference: 'high-performance',
    stencil: false, // Disable if not needed
    depth: true,
  }}
  dpr={[1, 2]} // Limit device pixel ratio for performance
  shadows
  frameloop="always" // or 'demand' for static scenes
>
```

## 📈 Performance Profiling

### Chrome DevTools

1. Open DevTools (F12)
2. Go to Performance tab
3. Record while playing the game
4. Look for:
   - Long frames (>16.67ms for 60fps)
   - Frequent garbage collection
   - High GPU usage

### Three.js Renderer Info

Access renderer info in development:

```typescript
useFrame(({ gl }) => {
  if (import.meta.env.DEV && frameCount % 60 === 0) {
    console.log({
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
    });
  }
});
```

## 🎮 Black Trigram Specific Optimizations

### Combat Scene

1. **Character Models**: Use LOD for distant opponents
2. **Particle Effects**: Pool and reuse particle systems
3. **Vital Point Markers**: Only render when in targeting mode
4. **Arena Geometry**: Simple geometry, detailed textures
5. **Post-processing**: Minimal or disabled on mobile

### Common Patterns

```typescript
// Efficient combat character with LOD
<Detailed distances={[0, 15, 30]}>
  <Player3DModelHigh />
  <Player3DModelMedium />
  <Player3DModelLow />
</Detailed>

// Pooled particle effects
<ParticlePool maxSize={100}>
  {activeEffects.map(effect => (
    <ParticleEffect key={effect.id} {...effect} />
  ))}
</ParticlePool>

// Conditional vital points
{showVitalPoints && targetingMode && (
  <VitalPointMarkers3D player={player} />
)}
```

## 🔧 Build Optimization

### Vite Configuration

The `vite.config.ts` has been optimized for Three.js:

```typescript
build: {
  rollupOptions: {
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      trySideEffects: false,
    },
  },
}
```

### Bundle Analysis

```bash
npm run build:analyze
```

This will show:
- Bundle size breakdown
- Three.js tree shaking effectiveness
- Largest dependencies

## 📱 Mobile Optimization

### Responsive DPR

```typescript
const dpr = useMemo(() => {
  return width < 768 ? [1, 1.5] : [1, 2];
}, [width]);

<Canvas dpr={dpr}>
```

### Conditional Effects

```typescript
const isMobile = width < 768;

<Canvas>
  {!isMobile && <PostProcessing />}
  {!isMobile && <Shadows />}
  {!isMobile && <Fog />}
</Canvas>
```

## 🧪 Testing Performance

### Cypress Performance Tests

Existing tests in `cypress/e2e/performance-threejs.cy.ts`:

```typescript
cy.assertSmoothFPS(2000); // Verify 60fps
cy.assertMinFPS(55, 2000); // Minimum 55fps
cy.assertNoMemoryLeaks(3000); // No memory leaks
```

### Manual Testing Checklist

- [ ] 60fps during idle combat
- [ ] 55fps+ during intense combat
- [ ] No frame drops during stance changes
- [ ] No memory growth over 5 minutes
- [ ] Smooth transitions between scenes
- [ ] Good performance on mobile devices

## 🎯 Performance Targets Summary

| Metric | Desktop (1920x1080) | Mobile (iPhone 11) |
|--------|---------------------|-------------------|
| Target FPS | 60 | 60 |
| Minimum FPS | 55 | 50 |
| Frame Time | <16.67ms | <20ms |
| Memory | <300MB | <200MB |
| Draw Calls | <100 | <75 |
| Bundle Size | <1.5MB gzipped | <1.5MB gzipped |

## 🔍 Common Performance Issues

### Issue: Low FPS during combat

**Causes:**
- Too many shadow casters
- Expensive particle systems
- Too many draw calls

**Solutions:**
- Limit shadows to main characters
- Use instancing for particles
- Batch geometry where possible

### Issue: Memory leaks

**Causes:**
- Geometries/materials not disposed
- Event listeners not removed
- Textures not released

**Solutions:**
- Always dispose in `useEffect` cleanup
- Remove event listeners on unmount
- Use `useTexture` hook properly

### Issue: Stuttering during scene transitions

**Causes:**
- Large assets loading synchronously
- Garbage collection spikes
- Component mount/unmount overhead

**Solutions:**
- Use `<Suspense>` for async loading
- Preload assets during intro
- Reuse components where possible

## 🌟 Success Criteria

✅ **60fps desktop** during combat with 2 characters and effects  
✅ **55fps mobile** on iPhone 11/Galaxy S10  
✅ **<300MB memory** during 5-minute play session  
✅ **<100 draw calls** per frame  
✅ **No memory leaks** detected  
✅ **Bundle <1.5MB** gzipped  
✅ **Performance monitoring** in development  

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
