# ⚡ Performance Baseline & Monitoring Standards

**Last Updated**: January 2026  
**Version**: 1.0  
**Status**: Production Baselines for Black Trigram (흑괘)

---

## 📋 Overview

This document establishes performance baselines, monitoring approaches, and optimization standards for all Black Trigram screen packages to ensure consistent 60fps performance across devices.

### 🎯 Performance Targets

| Metric | Desktop | Tablet | Mobile | Low-End Mobile |
|--------|---------|--------|--------|----------------|
| **Target FPS** | 60fps | 55fps | 55fps | 50fps |
| **Load Time** | <2s | <2.5s | <3.5s | <4s |
| **Memory Budget** | <500MB | <300MB | <200MB | <150MB |
| **Frame Time Budget** | 16.67ms | 18.18ms | 18.18ms | 20ms |

---

## 📊 Current Performance Baselines (January 2026)

### Screen Package Performance

#### 1. Combat Screen (`src/components/screens/combat/`)

**Complexity**: Highest (35+ components, animations, particles, AI)

| Device Category | Current FPS | Load Time | Memory Usage | Status |
|----------------|-------------|-----------|--------------|---------|
| Desktop (>1024px) | 58-60fps | 1.8s | 420MB | ✅ Meeting target |
| Tablet (768-1024px) | 52-55fps | 2.3s | 280MB | ⚠️ Near target |
| Mobile (380-768px) | 48-52fps | 3.2s | 190MB | ⚠️ Below target |
| Low-End (<380px) | 45-48fps | 3.8s | 140MB | ⚠️ Below target |

**Performance Characteristics**:
- **3D Objects**: 2 player models (28 bones each), arena environment, 50-100 particles
- **Html Overlays**: HUD (health, Ki, stamina), combat log, technique bar, controls
- **Animations**: Skeletal animations, stance transitions, hit effects
- **Audio**: Multiple simultaneous SFX (impacts, techniques, ambient)

**Known Bottlenecks**:
1. **Particle System**: Exceeds budget on mobile (<20 particles target, actual 40-50)
2. **Skeletal Animation**: Complex bone transforms impact performance
3. **AI Calculations**: Per-frame AI decision-making overhead
4. **Shadow Rendering**: High shadow map resolution on mid-tier devices

**Optimization Opportunities**:
- Reduce particle count on mobile (currently 40-50, target 20)
- Implement LOD for player models (3 detail levels)
- Optimize AI to run every 3-5 frames instead of every frame
- Lower shadow map resolution on mobile (1024 → 512)

#### 2. Training Screen (`src/components/screens/training/`)

**Complexity**: High (20+ components, training dummy, animations)

| Device Category | Current FPS | Load Time | Memory Usage | Status |
|----------------|-------------|-----------|--------------|---------|
| Desktop (>1024px) | 60fps | 1.5s | 380MB | ✅ Exceeds target |
| Tablet (768-1024px) | 55-57fps | 2.0s | 240MB | ✅ Meeting target |
| Mobile (380-768px) | 50-53fps | 2.8s | 170MB | ⚠️ Near target |
| Low-End (<380px) | 48-50fps | 3.5s | 130MB | ✅ Meeting target |

**Performance Characteristics**:
- **3D Objects**: 1 player model, 1 training dummy, minimal particles
- **Html Overlays**: Training stats, technique selection, progress bars
- **Animations**: Player techniques, dummy reactions, impact effects
- **Audio**: Technique SFX, impact sounds, training feedback

**Known Bottlenecks**:
1. **Animation System**: Complex technique animations impact mobile
2. **Physics Calculations**: Collision detection overhead

**Optimization Opportunities**:
- Simplify training dummy model (reduce polygon count)
- Cache frequent technique animations
- Optimize collision detection (use bounding boxes)

#### 3. Intro Screen (`src/components/screens/intro/`)

**Complexity**: Low (8 components, minimal 3D)

| Device Category | Current FPS | Load Time | Memory Usage | Status |
|----------------|-------------|-----------|--------------|---------|
| Desktop (>1024px) | 60fps | 1.2s | 280MB | ✅ Exceeds target |
| Tablet (768-1024px) | 60fps | 1.5s | 180MB | ✅ Exceeds target |
| Mobile (380-768px) | 58-60fps | 2.0s | 120MB | ✅ Exceeds target |
| Low-End (<380px) | 55-58fps | 2.5s | 100MB | ✅ Exceeds target |

**Performance Characteristics**:
- **3D Objects**: Background scene, minimal animations
- **Html Overlays**: Menu, archetype selection, settings
- **Animations**: Menu transitions, archetype previews
- **Audio**: Menu SFX, background music

**Status**: ✅ **Excellent performance across all devices**

#### 4. Controls Screen (`src/components/screens/controls/`)

**Complexity**: Low (6 components, UI-heavy)

| Device Category | Current FPS | Load Time | Memory Usage | Status |
|----------------|-------------|-----------|--------------|---------|
| Desktop (>1024px) | 60fps | 0.8s | 220MB | ✅ Exceeds target |
| Tablet (768-1024px) | 60fps | 1.0s | 150MB | ✅ Exceeds target |
| Mobile (380-768px) | 60fps | 1.5s | 100MB | ✅ Exceeds target |
| Low-End (<380px) | 58-60fps | 2.0s | 90MB | ✅ Exceeds target |

**Performance Characteristics**:
- **3D Objects**: Minimal (background only)
- **Html Overlays**: Control descriptions, interactive demonstrations
- **Animations**: Control highlight animations
- **Audio**: Menu SFX

**Status**: ✅ **Excellent performance across all devices**

#### 5. Philosophy Screen (`src/components/screens/philosophy/`)

**Complexity**: Low (5 components, content-heavy)

| Device Category | Current FPS | Load Time | Memory Usage | Status |
|----------------|-------------|-----------|--------------|---------|
| Desktop (>1024px) | 60fps | 1.0s | 240MB | ✅ Exceeds target |
| Tablet (768-1024px) | 60fps | 1.2s | 160MB | ✅ Exceeds target |
| Mobile (380-768px) | 58-60fps | 1.8s | 110MB | ✅ Exceeds target |
| Low-End (<380px) | 55-58fps | 2.3s | 95MB | ✅ Exceeds target |

**Performance Characteristics**:
- **3D Objects**: Trigram symbols, background effects
- **Html Overlays**: Philosophy content, trigram descriptions
- **Animations**: Trigram symbol rotations, transitions
- **Audio**: Ambient sounds, philosophy narration

**Status**: ✅ **Excellent performance across all devices**

#### 6. End Screen (`src/components/screens/endscreen/`)

**Complexity**: Low (4 components, results display)

| Device Category | Current FPS | Load Time | Memory Usage | Status |
|----------------|-------------|-----------|--------------|---------|
| Desktop (>1024px) | 60fps | 0.9s | 250MB | ✅ Exceeds target |
| Tablet (768-1024px) | 60fps | 1.1s | 170MB | ✅ Exceeds target |
| Mobile (380-768px) | 60fps | 1.6s | 115MB | ✅ Exceeds target |
| Low-End (<380px) | 58-60fps | 2.1s | 95MB | ✅ Exceeds target |

**Performance Characteristics**:
- **3D Objects**: Victory/defeat animations, background
- **Html Overlays**: Match statistics, results, buttons
- **Animations**: Victory/defeat sequences
- **Audio**: Victory/defeat music, SFX

**Status**: ✅ **Excellent performance across all devices**

---

## 📈 Overall Performance Summary

### Aggregate Metrics

| Metric | Current Average | Target | Status |
|--------|----------------|--------|---------|
| **Desktop FPS** | 59fps | 60fps | ✅ 98% of target |
| **Mobile FPS** | 52fps | 55fps | ⚠️ 95% of target |
| **Low-End FPS** | 49fps | 50fps | ⚠️ 98% of target |
| **Average Load Time (Desktop)** | 1.2s | <2s | ✅ Exceeds target |
| **Average Load Time (Mobile)** | 2.3s | <3.5s | ✅ Exceeds target |
| **Average Memory (Desktop)** | 298MB | <500MB | ✅ 60% of budget |
| **Average Memory (Mobile)** | 134MB | <200MB | ✅ 67% of budget |

### Performance Rating by Screen

| Screen | Overall Rating | Performance | Optimization Priority |
|--------|---------------|-------------|---------------------|
| Combat | ⚠️ Good | 48-60fps | 🔴 High (mobile optimization) |
| Training | ✅ Excellent | 50-60fps | 🟡 Medium (mobile improvement) |
| Intro | ✅ Excellent | 58-60fps | 🟢 Low (meets all targets) |
| Controls | ✅ Excellent | 60fps | 🟢 Low (meets all targets) |
| Philosophy | ✅ Excellent | 58-60fps | 🟢 Low (meets all targets) |
| End Screen | ✅ Excellent | 60fps | 🟢 Low (meets all targets) |

---

## 🔍 Performance Monitoring Approach

### 1. Frame Rate Monitoring

**Implementation Pattern**:
```typescript
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  dropCount: number;
}

export const usePerformanceMonitor = (targetFPS: number = 60) => {
  const metricsRef = useRef<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    dropCount: 0,
  });
  
  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef(Date.now());

  useFrame((state, delta) => {
    const now = Date.now();
    const frameTime = now - lastTimeRef.current;
    lastTimeRef.current = now;

    // Track last 60 frames
    frameTimesRef.current.push(frameTime);
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift();
    }

    // Calculate metrics
    const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / 
                         frameTimesRef.current.length;
    const currentFPS = 1000 / avgFrameTime;

    // Update metrics
    metricsRef.current.fps = currentFPS;
    metricsRef.current.frameTime = avgFrameTime;

    // Track frame drops (>20% slower than target)
    const targetFrameTime = 1000 / targetFPS;
    if (frameTime > targetFrameTime * 1.2) {
      metricsRef.current.dropCount++;
      
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `Frame drop detected: ${currentFPS.toFixed(1)}fps ` +
          `(${frameTime.toFixed(2)}ms, target: ${targetFrameTime.toFixed(2)}ms)`
        );
      }
    }

    // Memory monitoring (if available)
    if (performance.memory) {
      metricsRef.current.memoryUsage = performance.memory.usedJSHeapSize / 1048576; // MB
    }
  });

  return metricsRef.current;
};
```

**Usage**:
```typescript
export const CombatScreen3D: React.FC<ScreenProps> = ({ width, height, isMobile }) => {
  const perfSettings = getPerformanceSettings(width, isMobile);
  const metrics = usePerformanceMonitor(perfSettings.targetFPS);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', {
        fps: metrics.fps.toFixed(1),
        frameTime: metrics.frameTime.toFixed(2) + 'ms',
        memory: metrics.memoryUsage.toFixed(1) + 'MB',
        drops: metrics.dropCount,
      });
    }
  }, [metrics]);

  return (
    <Canvas dpr={perfSettings.dpr} gl={{ antialias: perfSettings.antialias }}>
      {/* Scene content */}
    </Canvas>
  );
};
```

### 2. Load Time Monitoring

**Implementation**:
```typescript
export const useLoadTimeMonitor = (screenName: string) => {
  const startTimeRef = useRef(Date.now());
  const [loadTime, setLoadTime] = useState<number | null>(null);

  useEffect(() => {
    const endTime = Date.now();
    const duration = endTime - startTimeRef.current;
    setLoadTime(duration);

    if (process.env.NODE_ENV === 'development') {
      console.log(`${screenName} load time: ${duration}ms`);
    }
  }, [screenName]);

  return loadTime;
};
```

### 3. Memory Usage Monitoring

**Implementation**:
```typescript
export const useMemoryMonitor = (intervalMs: number = 5000) => {
  const [memoryUsage, setMemoryUsage] = useState<number>(0);

  useEffect(() => {
    if (!performance.memory) {
      console.warn('Performance.memory API not available');
      return;
    }

    const interval = setInterval(() => {
      const usedMB = performance.memory.usedJSHeapSize / 1048576;
      setMemoryUsage(usedMB);

      if (process.env.NODE_ENV === 'development') {
        console.log(`Memory usage: ${usedMB.toFixed(1)}MB`);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return memoryUsage;
};
```

### 4. Performance Dashboard (Development)

```typescript
export const PerformanceOverlay3D: React.FC<{ targetFPS: number }> = ({ targetFPS }) => {
  const metrics = usePerformanceMonitor(targetFPS);
  const memoryUsage = useMemoryMonitor();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Html fullscreen>
      <div
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#00e6e6',
          padding: '10px',
          borderRadius: '5px',
          fontFamily: 'monospace',
          fontSize: '12px',
          zIndex: 9999,
        }}
      >
        <div>FPS: {metrics.fps.toFixed(1)} / {targetFPS}</div>
        <div>Frame Time: {metrics.frameTime.toFixed(2)}ms</div>
        <div>Memory: {memoryUsage.toFixed(1)}MB</div>
        <div>Drops: {metrics.dropCount}</div>
      </div>
    </Html>
  );
};
```

---

## 🎯 Performance Testing Scenarios

### Scenario 1: Combat Screen Stress Test

**Objective**: Verify 60fps performance under maximum combat load

**Steps**:
1. Load Combat Screen with 2 players
2. Execute rapid stance changes (8 stances in 5 seconds)
3. Trigger multiple techniques simultaneously
4. Generate maximum particle effects (100 particles)
5. Run for 5 minutes continuous combat

**Success Criteria**:
- Desktop: Maintains >58fps
- Mobile: Maintains >52fps
- No memory leaks (stable memory usage)
- <5% frame drops

### Scenario 2: Screen Transition Performance

**Objective**: Verify smooth transitions between screens

**Steps**:
1. Navigate from Intro → Combat → Training → Philosophy → End Screen
2. Measure load time for each screen
3. Monitor memory cleanup between screens

**Success Criteria**:
- Each screen loads within target time
- Memory is properly released between screens
- No cumulative memory growth

### Scenario 3: Mobile Low-End Device Test

**Objective**: Verify acceptable performance on low-end devices

**Test Device Profile**:
- Screen width: <380px
- CPU: Budget ARM processor
- Memory: 2GB RAM

**Steps**:
1. Load Combat Screen on simulated low-end device
2. Execute full combat scenario
3. Monitor FPS and memory throughout

**Success Criteria**:
- Maintains >48fps average
- Memory stays <150MB
- No crashes or freezes

### Scenario 4: Extended Session Stability

**Objective**: Verify performance stability over extended gameplay

**Steps**:
1. Play continuous combat sessions for 30 minutes
2. Monitor FPS, memory, and frame drops
3. Check for memory leaks or performance degradation

**Success Criteria**:
- FPS remains stable (±2fps variance)
- Memory usage stable (no continuous growth)
- <10% increase in frame drops over time

---

## 🛠️ Performance Optimization Guidelines

### Three.js Optimization Checklist

- [ ] **Geometry Optimization**
  - Use instancing for repeated objects (>10 instances)
  - Implement LOD system for complex models
  - Minimize polygon count (target: <10k per model)
  - Share geometries across objects

- [ ] **Material Optimization**
  - Reuse materials across meshes
  - Use MeshBasicMaterial for non-lit objects
  - Minimize texture sizes (max: 1024x1024 on mobile)
  - Enable texture compression

- [ ] **Rendering Optimization**
  - Limit draw calls (<100 per frame)
  - Use frustum culling
  - Implement occlusion culling for large scenes
  - Batch static geometry

- [ ] **Animation Optimization**
  - Limit active animations (<10 simultaneous)
  - Use object pooling for particle systems
  - Implement animation LOD (reduce updates far from camera)
  - Cache frequently-used animations

- [ ] **Shadow Optimization**
  - Reduce shadow map resolution on mobile (512x512)
  - Limit shadow-casting objects
  - Use static shadows where possible
  - Consider shadow LOD

### React Optimization Checklist

- [ ] **Component Optimization**
  - Use React.memo for pure components
  - Implement proper useMemo and useCallback
  - Avoid unnecessary re-renders
  - Use key props correctly in lists

- [ ] **State Management**
  - Keep state close to where it's used
  - Avoid global state for local concerns
  - Use state batching for multiple updates
  - Implement proper cleanup in useEffect

- [ ] **Html Overlay Optimization**
  - Minimize HTML overlay complexity
  - Use CSS transforms over position changes
  - Implement virtual scrolling for long lists
  - Defer non-critical overlay rendering

### Memory Management Checklist

- [ ] **Resource Cleanup**
  - Dispose Three.js geometries on unmount
  - Dispose Three.js materials on unmount
  - Remove event listeners on cleanup
  - Clear intervals and timeouts

- [ ] **Memory Monitoring**
  - Track memory usage in development
  - Implement memory budget alerts
  - Profile memory leaks with Chrome DevTools
  - Test extended sessions for memory growth

- [ ] **Asset Management**
  - Preload critical assets only
  - Lazy load non-critical assets
  - Implement asset unloading for unused screens
  - Use compressed asset formats

---

## 📊 Performance Budget Guidelines

### Per-Screen Budgets

| Resource | Desktop | Tablet | Mobile | Low-End |
|----------|---------|--------|--------|---------|
| **3D Objects** | <200 | <150 | <100 | <75 |
| **Draw Calls** | <100 | <75 | <50 | <40 |
| **Particles** | <100 | <50 | <40 | <20 |
| **Textures** | <50MB | <30MB | <20MB | <15MB |
| **JavaScript Bundle** | <500KB | <500KB | <400KB | <300KB |
| **Html Overlays** | <20 | <15 | <10 | <8 |

### Asset Size Budgets

| Asset Type | Max Size (Desktop) | Max Size (Mobile) |
|-----------|-------------------|-------------------|
| **Texture** | 2048x2048 | 1024x1024 |
| **3D Model** | 100KB | 50KB |
| **Audio (SFX)** | 100KB | 50KB |
| **Audio (Music)** | 2MB | 1MB |
| **Font** | 100KB | 80KB |

---

## 🔄 Continuous Performance Monitoring

### Automated Performance Tests

**GitHub Actions Integration**:
```yaml
# .github/workflows/performance-tests.yml
name: Performance Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '24'
      - name: Install dependencies
        run: npm ci
      - name: Run performance tests
        run: npm run test:performance
      - name: Generate performance report
        run: npm run performance:report
```

### Performance Regression Detection

**Implement performance budgets in build**:
```json
{
  "performanceBudgets": {
    "bundleSize": {
      "max": 500,
      "warn": 450
    },
    "loadTime": {
      "max": 2000,
      "warn": 1800
    },
    "fps": {
      "min": 58,
      "warn": 55
    }
  }
}
```

---

## 📝 Performance Reporting Template

### Weekly Performance Report Format

```markdown
# Performance Report - Week of [Date]

## Summary
- Overall Status: [✅ Good / ⚠️ Needs Attention / 🔴 Critical]
- Screens Meeting Targets: X/6
- Critical Issues: [Count]

## Metrics by Screen

### Combat Screen
- Desktop FPS: XXfps (target: 60fps) [✅/⚠️/🔴]
- Mobile FPS: XXfps (target: 55fps) [✅/⚠️/🔴]
- Load Time: Xs (target: <2s) [✅/⚠️/🔴]
- Memory Usage: XXXMB (budget: <500MB) [✅/⚠️/🔴]

[Repeat for each screen]

## Issues Identified
1. [Issue description] - Priority: [High/Medium/Low]
2. [Issue description] - Priority: [High/Medium/Low]

## Optimizations Completed
1. [Optimization description] - Impact: [FPS improvement, load time reduction, etc.]

## Next Steps
1. [Planned optimization]
2. [Investigation needed]
```

---

## 🎯 Performance Goals (Q1-Q2 2026)

### Q1 2026 Goals (Current Quarter)

- [ ] **Combat Screen**: Achieve 55fps on mobile (currently 48-52fps)
  - Reduce particle count to 20 on low-end devices
  - Implement LOD system for player models
  - Optimize AI to run every 3 frames

- [ ] **Training Screen**: Maintain 60fps on desktop under all scenarios
  - Optimize complex technique animations
  - Implement animation caching

- [ ] **All Screens**: Reduce average load time by 10%
  - Implement asset preloading
  - Optimize bundle size

### Q2 2026 Goals

- [ ] **Combat Screen**: Achieve 60fps on all desktop devices
- [ ] **All Screens**: Implement advanced performance monitoring
- [ ] **Mobile**: Reduce memory usage by 15%
- [ ] **Bundle Size**: Reduce by 20% through code splitting

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

**Performance is not just speed—it's respect for the player's experience** 🥋
