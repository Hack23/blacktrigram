# Jin (Thunder) Trigram Explosive Power System

## 🎯 Overview

The Jin (진괘 - Thunder) trigram represents **explosive power** through thunder's sudden, overwhelming force. This document describes the implementation of the two-phase explosive system for Jin techniques.

## ⚡ Two-Phase Explosive System

### Charge Phase (충전 단계)
**Duration**: 200-400ms  
**Purpose**: Power buildup with visual accumulation

**Visual Effects**:
- Electric arcs converging to striking point
- Energy gathering animation
- Body tension visualization
- Thunder charge sound effects

**Implementation**: `ThunderEffect3D` component with `effectType="charge"`

### Release Phase (폭발 단계)
**Duration**: 400-600ms  
**Purpose**: Explosive burst with maximum impact

**Visual Effects**:
- Lightning flash and explosive burst
- Particle explosion on impact
- Camera shake for physical feedback
- Screen flash for impact emphasis
- Thunder burst sound effects

**Implementation**:
- `ThunderEffect3D` component with `effectType="release"`
- `ExplosiveBurstEffect3D` for particle explosions
- `CameraShakeManager` for camera shake
- `ScreenFlash` component for screen flash

## 🥋 Jin Technique Specifications

### 1. Lightning Flash (벽력일섬)
**Total Time**: 700ms  
**Charge**: 200ms | **Release**: 500ms  
**Power Multiplier**: 1.3x  
**Effects**:
- Camera shake: 0.3 intensity (light)
- Screen flash: 0.4 intensity (moderate)
- Thunder effect: Electric cyan lightning

### 2. Jumping Front Kick (뛰어앞차기)
**Total Time**: 900ms  
**Charge**: 350ms | **Release**: 550ms  
**Power Multiplier**: 1.4x  
**Effects**:
- Camera shake: 0.6 intensity (strong)
- Screen flash: 0.5 intensity (strong)
- Thunder effect: Explosive gold burst

### 3. Tornado Kick (회오리차기)
**Total Time**: 1000ms  
**Charge**: 400ms | **Release**: 600ms  
**Power Multiplier**: 1.5x (highest)  
**Effects**:
- Camera shake: 0.7 intensity (very strong)
- Screen flash: 0.6 intensity (strong)
- Thunder effect: Lightning trail during spin

### 4. Flying Sidekick (날아차기)
**Total Time**: 850ms  
**Charge**: 300ms | **Release**: 550ms  
**Power Multiplier**: 1.4x  
**Effects**:
- Camera shake: 0.6 intensity (strong)
- Screen flash: 0.5 intensity (strong)
- Thunder effect: Thunder burst on impact

### 5. Back Kick (뒤차기)
**Total Time**: 750ms  
**Charge**: 250ms | **Release**: 500ms  
**Power Multiplier**: 1.4x  
**Effects**:
- Camera shake: 0.7 intensity (very strong)
- Screen flash: 0.6 intensity (strong)
- Thunder effect: Unpredictable lightning

### 6. Knee Strike (무릎치기)
**Total Time**: 600ms  
**Charge**: 200ms | **Release**: 400ms  
**Power Multiplier**: 1.3x  
**Effects**:
- Camera shake: 0.5 intensity (medium)
- Screen flash: 0.4 intensity (moderate)
- Thunder effect: Close-range shock

## 🎨 Visual Effects System

### ThunderEffect3D Component

**Location**: `src/components/shared/three/effects/ThunderEffect3D.tsx`

**Props**:
```typescript
interface ThunderEffect3DProps {
  position: [number, number, number];  // 3D position
  intensity?: number;                   // 0-1
  effectType: "charge" | "release";    // Phase type
  duration?: number;                    // Milliseconds
  onComplete?: () => void;              // Callback
  active?: boolean;                     // Toggle
}
```

**Features**:
- Lightning arcs with zigzag patterns
- Electric sparks with physics
- Pulsing energy spheres
- Korean cyberpunk color scheme (Cyan, Blue, Gold)

### ExplosiveBurstEffect3D Component

**Location**: `src/components/shared/three/effects/ExplosiveBurstEffect3D.tsx`

**Props**:
```typescript
interface ExplosiveBurstEffect3DProps {
  position: [number, number, number];  // 3D position
  intensity?: number;                   // 0-1
  particleCount?: number;               // Default: 50
  duration?: number;                    // Default: 1500ms
  onComplete?: () => void;              // Callback
  active?: boolean;                     // Toggle
  color?: number;                       // Hex color
}
```

**Features**:
- Multi-layered particle burst
- Expanding shockwave rings
- Debris particles with physics
- Bright flash light
- Configurable colors

### Camera Shake System

**Location**: `src/utils/cameraShake.ts`

**API**:
```typescript
const manager = new CameraShakeManager();
manager.attachCamera(camera);
manager.shake({
  intensity: 0.5,      // 0-1
  duration: 300,       // Milliseconds
  frequency: 15,       // Hz
  decay: 0.95          // 0-1
});
manager.update();      // Call in animation loop
```

**Predefined Profiles**:
```typescript
JIN_SHAKE_PROFILES = {
  light: { intensity: 0.3, duration: 200 },
  medium: { intensity: 0.5, duration: 300 },
  heavy: { intensity: 0.7, duration: 400 },
  explosive: { intensity: 1.0, duration: 500 }
}
```

### Screen Flash System

**Location**: `src/components/shared/effects/ScreenFlash.tsx`

**API**:
```typescript
const { flash, FlashComponent } = useScreenFlash();

flash({
  intensity: 0.5,
  duration: 200,
  color: KOREAN_COLORS.ACCENT_GOLD,
  fadeCurve: "ease-out"
});

return <>{FlashComponent}</>;
```

**Predefined Profiles**:
```typescript
JIN_FLASH_PROFILES = {
  light: { intensity: 0.4, duration: 150, color: CYAN },
  medium: { intensity: 0.5, duration: 200, color: GOLD },
  heavy: { intensity: 0.6, duration: 250, color: RED },
  explosive: { intensity: 0.8, duration: 300, color: GOLD }
}
```

## 🎮 Implementation Guide

### Using Jin Explosive Techniques

```typescript
import { JIN_TECHNIQUES } from "@/systems/trigram/techniques/JinTechniques";
import { ThunderEffect3D, ExplosiveBurstEffect3D } from "@/components/shared/three/effects";
import { useCameraShake } from "@/utils/cameraShake";
import { useScreenFlash } from "@/components/shared/effects/ScreenFlash";

function CombatScene() {
  const technique = JIN_TECHNIQUES[0]; // Lightning Flash
  const { shakeProfile } = useCameraShake();
  const { flashProfile, FlashComponent } = useScreenFlash();
  
  const executeTechnique = () => {
    // Charge phase
    if (technique.chargeTime) {
      setTimeout(() => {
        // Show charge effect
        setShowCharge(true);
      }, 0);
    }
    
    // Release phase
    if (technique.releaseTime) {
      setTimeout(() => {
        setShowCharge(false);
        setShowRelease(true);
        setShowBurst(true);
        
        // Trigger feedback effects
        if (technique.cameraShakeIntensity) {
          shakeProfile("heavy");
        }
        if (technique.screenFlashIntensity) {
          flashProfile("medium");
        }
      }, technique.chargeTime || 0);
    }
  };
  
  return (
    <>
      {showCharge && (
        <ThunderEffect3D
          position={[0, 1, 0]}
          effectType="charge"
          intensity={1.0}
          duration={technique.chargeTime}
          active={true}
        />
      )}
      
      {showRelease && (
        <>
          <ThunderEffect3D
            position={[0, 1, 0]}
            effectType="release"
            intensity={1.0}
            duration={technique.releaseTime}
            active={true}
          />
          
          {showBurst && (
            <ExplosiveBurstEffect3D
              position={[0, 1, 0]}
              intensity={technique.explosivePower || 1.0}
              active={true}
            />
          )}
        </>
      )}
      
      {FlashComponent}
    </>
  );
}
```

## 📊 Performance Guidelines

### 60fps Target
- Particle count: ≤50 per burst
- Simultaneous effects: ≤3 active
- Update frequency: 16.67ms (60fps)

### Optimization Techniques
- Use particle pooling for repeated effects
- Dispose of geometries after use
- Limit concurrent thunder effects
- Use instanced rendering for debris

### Memory Management
```typescript
useEffect(() => {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.Material();
  
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);
```

## 🧪 Testing

### Unit Tests
- `ThunderEffect3D.test.tsx`: Thunder effect rendering
- `ExplosiveBurstEffect3D.test.tsx`: Burst effect particles
- `cameraShake.test.ts`: Shake manager functionality
- `ScreenFlash.test.tsx`: Flash component behavior

### Integration Tests
- Technique execution flow
- Visual effect synchronization
- Performance validation (60fps)
- Sound effect timing

### E2E Tests
- Complete combat scenarios
- Training mode explosive practice
- Performance under load

## 🎯 Korean Martial Arts Philosophy

**진괘 (Jin Trigram)** - Thunder:
- **번개처럼 치고 천둥처럼 움직인다**  
  _"Strike like lightning, move like thunder"_
  
- **폭발력 (Pokbaryeok)** - Explosive Power:
  The sudden release of accumulated energy, like thunder following lightning

- **충격파 (Chunggyeokpa)** - Shockwave:
  The ripple of force that extends beyond the initial impact

## 📚 Related Files

### Core Implementation
- `src/systems/trigram/techniques/JinTechniques.ts` - Technique definitions
- `src/systems/animation/catalogs/JinTechniqueAnimations.ts` - Animation definitions
- `src/systems/animation/catalogs/JinStanceAnimations.ts` - Stance animations

### Visual Effects
- `src/components/shared/three/effects/ThunderEffect3D.tsx` - Thunder effects
- `src/components/shared/three/effects/ExplosiveBurstEffect3D.tsx` - Burst effects
- `src/components/shared/effects/ScreenFlash.tsx` - Screen flash

### Utilities
- `src/utils/cameraShake.ts` - Camera shake system

### Tests
- `src/components/shared/three/effects/ThunderEffect3D.test.tsx`
- `src/components/shared/three/effects/ExplosiveBurstEffect3D.test.tsx`
- `src/utils/__tests__/cameraShake.test.ts`
- `src/components/shared/effects/ScreenFlash.test.tsx`

## 🔮 Future Enhancements

- [ ] Training mode power meter visualization
- [ ] Perfect timing window indicators
- [ ] Combo multipliers for consecutive explosive hits
- [ ] Advanced particle systems (GPU-based)
- [ ] Sound effect integration with thunder/lightning themes
- [ ] Haptic feedback for mobile devices
- [ ] AI training for explosive technique timing

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
