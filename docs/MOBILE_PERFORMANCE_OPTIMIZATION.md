# Mobile Performance Optimization Guide

## Overview

This document describes the mobile performance optimization system implemented for Black Trigram (흑괘) to achieve the 55fps+ target on mobile devices.

## Performance Targets

### Mobile (Phones/Tablets)
- **Target FPS**: 55+ sustained
- **Draw Calls**: <100 per frame
- **Memory Usage**: <200MB heap
- **Particle Count**: 50% of desktop
- **Shadow Quality**: 512x512 (reduced from 2048x2048)

### Desktop
- **Target FPS**: 60fps
- **Draw Calls**: <150 per frame
- **Memory Usage**: <300MB heap
- **Particle Count**: 100% (full quality)
- **Shadow Quality**: 2048x2048

## Architecture

### Core Systems

#### 1. Adaptive Quality System (`AdaptiveQuality.ts`)

Automatically monitors FPS and adjusts rendering quality in real-time.

**Quality Levels:**
```typescript
high: {
  shadowMapSize: 1536,
  maxParticles: 60,
  postProcessing: false,
  effectsQuality: 1.0,
}

medium: {
  shadowMapSize: 1024,
  maxParticles: 40,
  postProcessing: false,
  effectsQuality: 0.75,
}

low: {
  shadowMapSize: 512,
  maxParticles: 20,
  postProcessing: false,
  effectsQuality: 0.5,
}
```

**Adjustment Thresholds:**
- **Downgrade**: FPS < 45 for 60 frames (~1 second)
- **Upgrade**: FPS > 58 for 60 frames (~1 second)
- **Debounce**: 2 seconds between quality changes

**Usage:**
```tsx
import { useAdaptiveQuality } from '@/components/shared/three/optimization';

function CombatScene({ isMobile }) {
  const quality = useAdaptiveQuality(
    true,  // enabled
    isMobile,
    (newQuality) => console.log(`Quality: ${newQuality}`)
  );

  return (
    <Canvas shadowMap={{ size: quality.shadowMapSize }}>
      <ParticleSystem maxParticles={quality.maxParticles} />
    </Canvas>
  );
}
```

#### 2. LOD System (`LODSystem.tsx`)

Level of Detail optimization reduces polygon count based on camera distance.

**LOD Distances:**
```typescript
DEFAULT: {
  high: 0,      // 0-12 units
  medium: 12,   // 12-20 units
  // low: 20+    (implicit)
}

MOBILE: {
  high: 0,      // 0-8 units (more aggressive)
  medium: 8,    // 8-15 units
  // low: 15+
}
```

**Usage:**
```tsx
import { LODCharacter } from '@/components/shared/three/optimization';

<LODCharacter
  highDetail={<Player3DHighDetail />}
  mediumDetail={<Player3DMediumDetail />}
  lowDetail={<Player3DLowDetail />}
  isMobile={isMobile}
/>
```

**Particle LOD:**
```tsx
import { getLODParticleCount } from '@/components/shared/three/optimization';

const particleCount = getLODParticleCount(100, detailLevel);
// high: 100, medium: 60, low: 30
```

#### 3. Instanced Geometry (`InstancedGeometry.tsx`)

GPU instancing reduces draw calls for repeated geometry.

**Benefits:**
- Reduces N draw calls to 1 per geometry type
- 50%+ performance improvement for particle-heavy scenes
- Maintains individual instance transforms and colors

**Usage:**
```tsx
import { InstancableParticles } from '@/components/shared/three/optimization';

const positions = useMemo(() =>
  Array.from({ length: 50 }, () => [
    Math.random() * 10 - 5,
    Math.random() * 5,
    Math.random() * 10 - 5,
  ]),
  []
);

<InstancableParticles
  positions={positions}
  size={0.1}
  quality="medium"
  baseColor={0x00ffff}
/>
```

## Integration with CombatScreen3D

The optimization system is integrated into `CombatScreen3D.tsx`:

```tsx
export interface CombatScreen3DProps {
  // ... existing props
  readonly enableAdaptiveQuality?: boolean;  // default: true on mobile
  readonly showPerformanceOverlay?: boolean; // default: dev mode
}

export const CombatScreen3D: React.FC<CombatScreen3DProps> = ({
  // ...
  enableAdaptiveQuality,
  showPerformanceOverlay = import.meta.env.DEV,
}) => {
  // Adaptive quality monitoring
  const shouldEnableAdaptiveQuality = enableAdaptiveQuality ?? isMobile;

  // Internal wrapper component
  const AdaptiveQualityWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    useAdaptiveQuality(
      shouldEnableAdaptiveQuality,
      isMobile,
      (newQuality) => {
        if (import.meta.env.DEV) {
          console.log(`[CombatScreen3D] Quality adjusted to: ${newQuality}`);
        }
      }
    );

    return <>{children}</>;
  };

  return (
    <Canvas>
      <AdaptiveQualityWrapper>
        {showPerformanceOverlay && <PerformanceOverlay3D />}
        {/* Combat content */}
      </AdaptiveQualityWrapper>
    </Canvas>
  );
};
```

## Performance Constants

Mobile and desktop thresholds are defined in `src/types/constants/performance.ts`:

```typescript
export const MOBILE_PERFORMANCE_THRESHOLDS = {
  targetFPS: 55,
  minAcceptableFPS: 45,
  maxDrawCalls: 100,
  maxMemoryMB: 200,
  particleReduction: 0.5,  // 50% of desktop
  shadowMapSize: 512,
} as const;

export const DESKTOP_PERFORMANCE_THRESHOLDS = {
  targetFPS: 60,
  minAcceptableFPS: 55,
  maxDrawCalls: 150,
  maxMemoryMB: 300,
  particleReduction: 1.0,  // full quality
  shadowMapSize: 2048,
} as const;
```

## Testing

### Unit Tests

**Location**: `src/components/shared/three/optimization/*.test.ts`

**Coverage**:
- AdaptiveQuality: 26 tests (quality management, adaptive adjustment, thresholds)
- LODSystem: 24 tests (distance calculations, particle/shadow optimization)
- InstancedGeometry: 8 tests (instancing utilities, batching)

**Run tests**:
```bash
npm test -- src/components/shared/three/optimization --run
```

### E2E Tests

**Location**: `cypress/e2e/performance/mobile-performance.cy.ts`

**Scenarios**:
1. 30-second combat session on mobile viewport (375x667)
2. Adaptive quality system integration verification

**Run E2E tests**:
```bash
npm run test:e2e -- --spec "cypress/e2e/performance/mobile-performance.cy.ts"
```

## Performance Monitoring

### Development Mode

Enable performance overlay:
```tsx
<CombatScreen3D
  showPerformanceOverlay={true}
  enableAdaptiveQuality={true}
  // ... other props
/>
```

The overlay displays:
- Current FPS
- Average FPS
- Min/Max FPS
- Frame time (ms)
- Memory usage (Chrome only)
- Draw calls
- Triangle count

### Console Logging

Quality changes are logged in development mode:
```
[AdaptiveQuality] Quality changed to medium (avg fps: 42.3)
[AdaptiveQuality] Quality changed to high (avg fps: 59.1)
```

## Best Practices

### DO ✅

1. **Use adaptive quality on mobile by default**
   ```tsx
   enableAdaptiveQuality={isMobile}
   ```

2. **Apply LOD to distant objects**
   ```tsx
   <LODCharacter isMobile={isMobile} {...props} />
   ```

3. **Use instancing for repeated geometry**
   ```tsx
   <InstancableParticles positions={positions} />
   ```

4. **Monitor performance in development**
   ```tsx
   showPerformanceOverlay={import.meta.env.DEV}
   ```

5. **Reduce particle count on mobile**
   ```tsx
   const count = isMobile ? 50 : 100;
   ```

### DON'T ❌

1. **Don't disable adaptive quality globally** - Users with low-end devices need it
2. **Don't create new Three.js objects every frame** - Use useMemo/refs
3. **Don't use high-poly models for distant objects** - Apply LOD
4. **Don't render unnecessary particles** - Use instancing and quality tiers
5. **Don't forget to clean up Three.js resources** - Dispose geometry/materials

## Future Enhancements

### Planned Optimizations

1. **Character LOD Variants**
   - HighDetailPlayer3D (0-12 units)
   - MediumDetailPlayer3D (12-20 units)
   - LowDetailPlayer3D (20+ units)

2. **Texture Compression**
   - ASTC for mobile
   - ETC2 fallback
   - Mipmaps for all textures

3. **Shadow Optimization**
   - Dynamic shadow map size
   - Cascade shadow maps for large scenes
   - Shadow culling for distant objects

4. **Particle System Optimization**
   - GPU particle simulation
   - Particle pooling
   - Distance-based culling

5. **CI/CD Integration**
   - Performance regression tests
   - Automated performance reports
   - FPS benchmarking in CI

## Troubleshooting

### Low FPS on Mobile

1. **Check adaptive quality is enabled**:
   ```tsx
   enableAdaptiveQuality={true}
   ```

2. **Verify quality is adjusting**:
   - Open dev tools console
   - Look for quality change logs

3. **Check particle counts**:
   ```tsx
   const particles = isMobile ? 50 : 100;
   ```

4. **Verify shadow quality**:
   ```tsx
   shadowMapSize: isMobile ? 512 : 2048
   ```

### Quality Not Adjusting

1. **Ensure system is enabled**:
   ```tsx
   useAdaptiveQuality(true, isMobile, callback)
   ```

2. **Check FPS thresholds**:
   - Downgrade: FPS < 45
   - Upgrade: FPS > 58
   - Need 60 samples (~1 second)

3. **Verify debounce time**:
   - 2 seconds between changes
   - Prevents thrashing

### Memory Issues

1. **Check for memory leaks**:
   ```tsx
   useEffect(() => {
     const geometry = new THREE.BoxGeometry();
     return () => geometry.dispose(); // Clean up!
   }, []);
   ```

2. **Monitor memory in Chrome**:
   - Open Performance tab
   - Record session
   - Check heap allocations

3. **Reduce asset quality**:
   - Lower texture resolution
   - Reduce polygon counts
   - Use texture compression

## References

- [Three.js Performance](https://threejs.org/manual/#en/optimize)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [@react-three/drei](https://github.com/pmndrs/drei)
- [Mobile Performance Best Practices](https://web.dev/fast/)

## Support

For questions or issues with the optimization system:

1. Check existing documentation
2. Review test cases for examples
3. Open an issue on GitHub
4. Contact the performance team

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
