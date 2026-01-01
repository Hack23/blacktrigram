# 🎨 Three.js Patterns for Black Trigram (흑괘)

## 📚 **Documentation Structure**

This document covers **game engine Three.js patterns** for Korean martial arts combat mechanics and visual effects.

**For UI architecture patterns**, see complementary documentation:
- **[Three.js UI Integration](./THREEJS_UI_INTEGRATION.md)** - Html overlay vs 3D mesh decisions, Canvas setup, UI performance optimization
- **[UI/UX Architecture](./UI_UX_ARCHITECTURE.md)** - Complete component hierarchy and design patterns

**Topics in this document:**
- Korean-themed materials and stance-based effects (Eight Trigrams)
- Combat hit effects and vital point markers
- Character animations for martial arts movements
- Object pooling and performance optimization techniques
- 3D spatial audio integration for immersive combat

---

## 📚 Purpose

This document provides common Three.js patterns, best practices, and reusable code examples specifically for Black Trigram's Korean martial arts combat system.

---

## 🎯 Core Patterns

### Pattern 1: Korean-Themed Materials

Create materials that reflect traditional Korean aesthetics with cyberpunk fusion.

```typescript
import { KOREAN_COLORS } from '../types/constants';
import * as THREE from 'three';

/**
 * Create a Korean-themed material with proper lighting response
 */
function createKoreanMaterial(config: {
  baseColor: number;
  metalness?: number;
  roughness?: number;
  emissive?: number;
  emissiveIntensity?: number;
}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: config.baseColor,
    metalness: config.metalness ?? 0.5,
    roughness: config.roughness ?? 0.5,
    emissive: config.emissive ?? config.baseColor,
    emissiveIntensity: config.emissiveIntensity ?? 0.1,
  });
}

// Usage examples
const geonMaterial = createKoreanMaterial({
  baseColor: KOREAN_COLORS.CARDINAL_CENTER, // 건 - Heaven (Yellow)
  metalness: 0.7,
  roughness: 0.3,
  emissiveIntensity: 0.3,
});

const taeMaterial = createKoreanMaterial({
  baseColor: KOREAN_COLORS.PRIMARY_CYAN, // 태 - Lake (Cyan)
  metalness: 0.3,
  roughness: 0.8,
  emissiveIntensity: 0.2,
});

const liMaterial = createKoreanMaterial({
  baseColor: KOREAN_COLORS.CARDINAL_SOUTH, // 리 - Fire (Red)
  metalness: 0.1,
  roughness: 0.9,
  emissiveIntensity: 0.5,
});
```

### Pattern 2: Stance-Based Visual Effects

Change character appearance based on Eight Trigram stance.

```typescript
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { TrigramStance } from '../types/trigram';
import { KOREAN_COLORS } from '../types/constants';

interface StanceAuraProps {
  stance: TrigramStance;
  intensity?: number;
}

export function StanceAura3D({ stance, intensity = 1.0 }: StanceAuraProps) {
  const auraRef = useRef<THREE.Mesh>(null);
  
  // Get stance color
  const stanceColor = useMemo(() => {
    const colorMap: Record<TrigramStance, number> = {
      geon: KOREAN_COLORS.CARDINAL_CENTER,  // ☰ Heaven - Yellow
      tae: KOREAN_COLORS.PRIMARY_CYAN,      // ☱ Lake - Cyan
      li: KOREAN_COLORS.CARDINAL_SOUTH,     // ☲ Fire - Red
      jin: KOREAN_COLORS.SECONDARY_YELLOW,  // ☳ Thunder - Yellow
      son: KOREAN_COLORS.CARDINAL_EAST,     // ☴ Wind - Green
      gam: KOREAN_COLORS.ACCENT_BLUE,       // ☵ Water - Blue
      gan: KOREAN_COLORS.UI_BACKGROUND_LIGHT, // ☶ Mountain - Gray
      gon: KOREAN_COLORS.UI_BACKGROUND_DARK,  // ☷ Earth - Dark
    };
    return colorMap[stance];
  }, [stance]);
  
  // Pulse animation
  useFrame((state) => {
    if (!auraRef.current) return;
    
    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
    auraRef.current.scale.setScalar(pulse * intensity);
    
    // Rotate based on stance type
    auraRef.current.rotation.y += 0.01;
  });
  
  return (
    <mesh ref={auraRef}>
      <torusGeometry args={[1.2, 0.1, 16, 32]} />
      <meshBasicMaterial 
        color={stanceColor}
        transparent
        opacity={0.3}
        wireframe
      />
    </mesh>
  );
}
```

### Pattern 3: Vital Point Markers

Visualize all 70 Korean vital points in 3D space.

{% raw %}
```typescript
import { Html } from '@react-three/drei';
import { useMemo } from 'react';
import { KOREAN_COLORS } from '../types/constants';
import { VitalPoint, VitalPointSeverity } from '../types/vitalpoints';

interface VitalPointMarkers3DProps {
  visible: boolean;
  points: VitalPoint[];
  onPointClick?: (point: VitalPoint) => void;
}

export function VitalPointMarkers3D({
  visible,
  points,
  onPointClick,
}: VitalPointMarkers3DProps) {
  // Color based on severity
  const getPointColor = (severity: VitalPointSeverity): number => {
    switch (severity) {
      case 'critical': return KOREAN_COLORS.CARDINAL_SOUTH;   // Red - Critical
      case 'secondary': return KOREAN_COLORS.SECONDARY_YELLOW; // Yellow - Secondary
      case 'standard': return KOREAN_COLORS.PRIMARY_CYAN;      // Cyan - Standard
    }
  };
  
  if (!visible) return null;
  
  return (
    <group>
      {points.map((point, index) => (
        <group key={point.id ?? point.nameKorean ?? index} position={point.position3D}>
          {/* 3D marker sphere */}
          <mesh
            onClick={() => onPointClick?.(point)}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default';
            }}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial 
              color={getPointColor(point.severity)}
              emissive={getPointColor(point.severity)}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Korean label */}
          <Html
            position={[0.1, 0.1, 0]}
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <div style={{
              background: `${KOREAN_COLORS.UI_BACKGROUND_DARK}dd`,
              color: `#${getPointColor(point.severity).toString(16).padStart(6, '0')}`,
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '10px',
              fontFamily: 'Korean Font',
              whiteSpace: 'nowrap',
              border: `1px solid #${getPointColor(point.severity).toString(16).padStart(6, '0')}`,
            }}>
              {point.nameKorean}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
```
{% endraw %}

### Pattern 4: Combat Hit Effects

Create realistic impact effects with particles and lighting.

```typescript
import { useFrame } from '@react-three/fiber';
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { KOREAN_COLORS } from '../types/constants';

interface HitEffect3DProps {
  position: [number, number, number];
  intensity: number;
  type: 'normal' | 'critical' | 'blocked';
  onComplete?: () => void;
}

export function HitEffect3D({
  position,
  intensity,
  type,
  onComplete,
}: HitEffect3DProps) {
  const [elapsed, setElapsed] = useState(0);
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  const effectDuration = 0.5; // seconds
  
  // Get effect color
  const effectColor = type === 'critical'
    ? KOREAN_COLORS.CARDINAL_SOUTH
    : type === 'blocked'
    ? KOREAN_COLORS.ACCENT_BLUE
    : KOREAN_COLORS.ACCENT_GOLD;
  
  // Animate effect
  useFrame((state, delta) => {
    setElapsed(prev => prev + delta);
    
    if (!groupRef.current || !lightRef.current) return;
    
    const progress = elapsed / effectDuration;
    
    // Expand and fade
    const scale = 1 + progress * 2;
    groupRef.current.scale.setScalar(scale);
    
    // Fade out light
    lightRef.current.intensity = intensity * (1 - progress) * 5;
    
    // Complete effect
    if (progress >= 1) {
      onComplete?.();
    }
  });
  
  if (elapsed >= effectDuration) return null;
  
  return (
    <group ref={groupRef} position={position}>
      {/* Impact flash */}
      <pointLight
        ref={lightRef}
        color={effectColor}
        intensity={intensity * 5}
        distance={3}
        decay={2}
      />
      
      {/* Particle burst */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial 
          color={effectColor}
          transparent
          opacity={1 - elapsed / effectDuration}
        />
      </mesh>
      
      {/* Shockwave ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.6, 32]} />
        <meshBasicMaterial 
          color={effectColor}
          transparent
          opacity={(1 - elapsed / effectDuration) * 0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
```

### Pattern 5: Character Animation with useFrame

Smooth character animations respecting physics and martial arts movements.

```typescript
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { TrigramStance } from '../types/trigram';

interface CombatCharacter3DProps {
  position: [number, number, number];
  stance: TrigramStance;
  isAttacking: boolean;
  health: number;
}

export function CombatCharacter3D({
  position,
  stance,
  isAttacking,
  health,
}: CombatCharacter3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const velocityRef = useRef(new THREE.Vector3());
  
  // Reusable vector instances to avoid allocations
  const targetVelocity = useMemo(() => new THREE.Vector3(), []);
  const tempVector = useMemo(() => new THREE.Vector3(), []);
  
  // Animation loop at 60fps
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Breathing animation (subtle)
    const breathCycle = Math.sin(state.clock.elapsedTime * 2) * 0.02 + 1;
    groupRef.current.scale.y = breathCycle;
    
    // Combat stance rotation
    const targetRotation = getStanceRotation(stance);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      0.1
    );
    
    // Attack animation
    if (isAttacking) {
      const attackCycle = Math.sin(state.clock.elapsedTime * 10);
      tempVector.set(Math.sin(targetRotation), 0, Math.cos(targetRotation));
      tempVector.multiplyScalar(attackCycle * 0.3);
      groupRef.current.position.copy(
        tempVector.add(new THREE.Vector3(...position))
      );
    } else {
      groupRef.current.position.lerp(
        new THREE.Vector3(...position),
        0.1
      );
    }
    
    // Health-based color change
    const materialOpacity = THREE.MathUtils.lerp(0.3, 1.0, health / 100);
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshStandardMaterial;
        material.opacity = materialOpacity;
      }
    });
  });
  
  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.5, 1.5, 16, 32]} />
        <meshStandardMaterial 
          color={getHealthColor(health)}
          transparent
        />
      </mesh>
      
      {/* Stance aura */}
      <StanceAura3D stance={stance} intensity={isAttacking ? 1.5 : 1.0} />
    </group>
  );
}

function getStanceRotation(stance: TrigramStance): number {
  // Rotate character based on Eight Trigram directions
  const rotationMap: Record<TrigramStance, number> = {
    geon: 0,                    // ☰ North
    tae: Math.PI / 4,           // ☱ Northeast
    li: Math.PI / 2,            // ☲ East
    jin: (3 * Math.PI) / 4,     // ☳ Southeast
    son: Math.PI,               // ☴ South
    gam: (5 * Math.PI) / 4,     // ☵ Southwest
    gan: (3 * Math.PI) / 2,     // ☶ West
    gon: (7 * Math.PI) / 4,     // ☷ Northwest
  };
  return rotationMap[stance];
}

function getHealthColor(health: number): number {
  if (health > 70) return KOREAN_COLORS.CARDINAL_EAST;   // Green - Healthy
  if (health > 30) return KOREAN_COLORS.CARDINAL_CENTER; // Yellow - Injured
  return KOREAN_COLORS.CARDINAL_SOUTH;                   // Red - Critical
}
```

---

## 🎮 Combat Scene Patterns

### Pattern 6: Complete Combat Arena

Full scene setup with lighting, environment, and characters.

```typescript
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { KOREAN_COLORS } from '../types/constants';
import * as THREE from 'three';

interface CombatArena3DProps {
  width: number;
  height: number;
  playerState: PlayerState;
  enemyState: EnemyState;
}

export function CombatArena3D({
  width,
  height,
  playerState,
  enemyState,
}: CombatArena3DProps) {
  return (
    <div style={{ width, height }}>
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
        <KoreanLighting />
        
        {/* Environment reflections */}
        <Environment preset="city" />
        
        {/* Camera */}
        <PerspectiveCamera 
          makeDefault 
          position={[0, 5, 10]} 
          fov={75}
        />
        
        {/* Combat arena floor */}
        <CombatFloor />
        
        {/* Player character */}
        <CombatCharacter3D
          position={[-5, 0, 0]}
          stance={playerState.stance}
          health={playerState.health}
          isAttacking={playerState.isAttacking}
        />
        
        {/* Enemy character */}
        <CombatCharacter3D
          position={[5, 0, 0]}
          stance={enemyState.stance}
          health={enemyState.health}
          isAttacking={enemyState.isAttacking}
        />
        
        {/* Combat effects */}
        <CombatEffects3D />
        
        {/* Development controls */}
        {process.env.NODE_ENV === 'development' && (
          <OrbitControls 
            enableDamping 
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={20}
          />
        )}
      </Canvas>
    </div>
  );
}

function KoreanLighting() {
  return (
    <>
      {/* Ambient light with Korean cyan tint */}
      <ambientLight intensity={0.4} color={KOREAN_COLORS.PRIMARY_CYAN} />
      
      {/* Main directional light (golden hour) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color={KOREAN_COLORS.ACCENT_GOLD}
      />
      
      {/* Fill light (blue) */}
      <pointLight
        position={[-10, 5, -5]}
        intensity={0.5}
        color={KOREAN_COLORS.ACCENT_BLUE}
      />
      
      {/* Rim light (highlight edges) */}
      <pointLight
        position={[0, 10, -10]}
        intensity={0.3}
        color={KOREAN_COLORS.SECONDARY_YELLOW}
      />
    </>
  );
}

function CombatFloor() {
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.5, 0]}
      receiveShadow
    >
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial 
        color={KOREAN_COLORS.UI_BACKGROUND_MEDIUM}
        metalness={0.1}
        roughness={0.9}
      />
    </mesh>
  );
}
```

---

## 🎨 UI Overlay Patterns

### Pattern 7: Html UI Over 3D Scene

Combine 3D rendering with traditional UI elements.

{% raw %}
```typescript
import { Html } from '@react-three/drei';
import { KOREAN_COLORS } from '../types/constants';

export function CombatHUDOverlay({ player, enemy }) {
  return (
    <>
      {/* Player nameplate (3D positioned) */}
      <Html position={[-5, 2.5, 0]} center>
        <PlayerNameplate 
          name={player.name}
          nameKorean={player.nameKorean}
          health={player.health}
        />
      </Html>
      
      {/* Enemy nameplate (3D positioned) */}
      <Html position={[5, 2.5, 0]} center>
        <PlayerNameplate 
          name={enemy.name}
          nameKorean={enemy.nameKorean}
          health={enemy.health}
        />
      </Html>
      
      {/* Fullscreen UI overlay */}
      <Html fullscreen>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}>
          {/* Top bar */}
          <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'all',
          }}>
            <TrigramSelector />
          </div>
          
          {/* Bottom controls */}
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'all',
          }}>
            <CombatControls />
          </div>
        </div>
      </Html>
    </>
  );
}

function PlayerNameplate({ name, nameKorean, health }) {
  return (
    <div style={{
      background: `${KOREAN_COLORS.UI_BACKGROUND_DARK}cc`,
      border: `2px solid ${KOREAN_COLORS.PRIMARY_CYAN}`,
      borderRadius: '8px',
      padding: '12px',
      fontFamily: 'Korean Font',
      textAlign: 'center',
      minWidth: '150px',
    }}>
      {/* Name */}
      <div style={{
        color: KOREAN_COLORS.ACCENT_GOLD,
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '8px',
      }}>
        {nameKorean} | {name}
      </div>
      
      {/* Health bar */}
      <div style={{
        background: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
        height: '8px',
        borderRadius: '4px',
        overflow: 'hidden',
        border: `1px solid ${KOREAN_COLORS.PRIMARY_CYAN}`,
      }}>
        <div style={{
          width: `${health}%`,
          height: '100%',
          background: health > 50
            ? KOREAN_COLORS.CARDINAL_EAST
            : KOREAN_COLORS.CARDINAL_SOUTH,
          transition: 'width 0.3s ease',
        }} />
      </div>
      
      {/* Health text */}
      <div style={{
        color: KOREAN_COLORS.PRIMARY_CYAN,
        fontSize: '12px',
        marginTop: '4px',
      }}>
        {health}/100 HP
      </div>
    </div>
  );
}
```
{% endraw %}

---

## ⚡ Performance Patterns

### Pattern 8: Object Pooling

Reuse objects instead of creating/destroying them.

```typescript
import * as THREE from 'three';

class ParticlePool {
  private available: THREE.Mesh[] = [];
  private inUse = new Set<THREE.Mesh>();
  
  constructor(
    private createParticle: () => THREE.Mesh,
    private resetParticle: (particle: THREE.Mesh) => void,
    initialSize = 100
  ) {
    // Pre-allocate particles
    for (let i = 0; i < initialSize; i++) {
      this.available.push(this.createParticle());
    }
  }
  
  acquire(): THREE.Mesh {
    let particle = this.available.pop();
    
    if (!particle) {
      // Create new if pool exhausted
      particle = this.createParticle();
    }
    
    this.inUse.add(particle);
    particle.visible = true;
    
    return particle;
  }
  
  release(particle: THREE.Mesh): void {
    if (!this.inUse.has(particle)) return;
    
    this.resetParticle(particle);
    particle.visible = false;
    this.inUse.delete(particle);
    this.available.push(particle);
  }
  
  releaseAll(): void {
    this.inUse.forEach(particle => this.release(particle));
  }
}

// Usage
const particlePool = new ParticlePool(
  // Create function
  () => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshBasicMaterial({ color: KOREAN_COLORS.PRIMARY_CYAN })
    );
    return mesh;
  },
  // Reset function
  (particle) => {
    particle.position.set(0, 0, 0);
    particle.scale.setScalar(1);
  },
  100 // Initial pool size
);

// In combat effect
function spawnHitParticles(position: THREE.Vector3) {
  for (let i = 0; i < 10; i++) {
    const particle = particlePool.acquire();
    particle.position.copy(position);
    
    // Release after animation
    setTimeout(() => {
      particlePool.release(particle);
    }, 1000);
  }
}
```

### Pattern 9: LOD (Level of Detail)

Optimize rendering for distant objects.

```typescript
import { Detailed } from '@react-three/drei';

export function OptimizedCharacter({ position, health, stance }) {
  return (
    <Detailed distances={[0, 10, 20]} position={position}>
      {/* High detail (close up) */}
      <group>
        <HighDetailBody health={health} />
        <VitalPointMarkers3D visible={true} />
        <StanceAura3D stance={stance} intensity={1.0} />
        <DetailedClothing />
      </group>
      
      {/* Medium detail (medium distance) */}
      <group>
        <MediumDetailBody health={health} />
        <StanceAura3D stance={stance} intensity={0.7} />
      </group>
      
      {/* Low detail (far away) */}
      <group>
        <mesh>
          <capsuleGeometry args={[0.5, 1.5, 8, 16]} />
          <meshBasicMaterial color={getHealthColor(health)} />
        </mesh>
      </group>
    </Detailed>
  );
}
```

---

## 🎵 Audio Integration

### Pattern 10: 3D Spatial Audio

Position audio sources in 3D space.

```typescript
import { PositionalAudio } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface SpatialHitSound3DProps {
  position: [number, number, number];
  soundUrl: string;
  volume?: number;
}

export function SpatialHitSound3D({
  position,
  soundUrl,
  volume = 1.0,
}: SpatialHitSound3DProps) {
  const audioRef = useRef<THREE.PositionalAudio>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);
  
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial visible={false} />
      <PositionalAudio
        ref={audioRef}
        url={soundUrl}
        distance={10}
        volume={volume}
        loop={false}
      />
    </mesh>
  );
}
```

---

## 🧪 Testing Patterns

### Pattern 11: Component Testing

Test Three.js components with proper TypeScript validation.

```typescript
import { describe, expect, it } from 'vitest';
import { CombatCharacter3D } from './CombatCharacter3D';
import { KOREAN_COLORS } from '../types/constants';

describe('CombatCharacter3D', () => {
  it('should be defined and importable', () => {
    expect(CombatCharacter3D).toBeDefined();
    expect(typeof CombatCharacter3D).toBe('function');
  });
  
  it('should accept valid props', () => {
    const props = {
      position: [0, 0, 0] as [number, number, number],
      stance: 'geon' as const,
      health: 85,
      isAttacking: false,
    };
    
    expect(props.position).toEqual([0, 0, 0]);
    expect(props.stance).toBe('geon');
    expect(props.health).toBe(85);
  });
  
  it('should use Korean colors', () => {
    expect(typeof KOREAN_COLORS.PRIMARY_CYAN).toBe('number');
    expect(typeof KOREAN_COLORS.ACCENT_GOLD).toBe('number');
  });
});
```

---

## 📚 Additional Resources

### Optimization Tips
1. **Batch draw calls** - Use `Instances` for repeated geometry
2. **Texture atlases** - Combine textures to reduce memory
3. **Frustum culling** - Automatic in Three.js
4. **Dispose resources** - Clean up geometries/materials on unmount
5. **Use refs** - Avoid state updates in useFrame

### Korean Cultural Integration
- Always use `KOREAN_COLORS` for theming
- Include bilingual text (Korean | English)
- Respect Eight Trigram symbolism
- Maintain 60fps for smooth martial arts motion
- Consider traditional Korean aesthetics

### Performance Monitoring
```typescript
import { Stats } from '@react-three/drei';

{process.env.NODE_ENV === 'development' && <Stats />}
```

---

**흑괘의 3D 패턴을 마스터하라** - _Master Black Trigram's 3D Patterns_

---

**📋 Document Control:**  
**✅ Created:** 2025-01-20  
**📤 Distribution:** Development Team  
**🏷️ Classification:** Internal  
**⏰ Next Review:** Monthly
