# Leg Muscle Tension System (다리 근육 긴장 시스템)

## Overview | 개요

The Leg Muscle Tension System provides realistic visualization of leg muscle engagement during Korean martial arts stances. This system calculates muscle tension based on authentic biomechanical principles:

- **체중부하 (Weight Distribution)** - Which leg bears more load
- **무릎굽힘각도 (Knee Flexion Angle)** - Deep bends require more tension
- **등척성수축 (Isometric Contraction)** - Holding positions activates muscles
- **자세준비상태 (Stance Readiness)** - Coiled muscles ready to explode

다리 근육 긴장 시스템은 한국 무술 자세에서 다리 근육 활성화의 사실적인 시각화를 제공합니다.

## Implementation | 구현

### Core Function: `getMuscleTensionForStance()`

Located in: `src/systems/animation/MuscleActivation.ts`

Calculates muscle tension for all 8 trigram stances (팔괘 자세):

```typescript
// Example usage from a component file under src/
import { getMuscleTensionForStance } from "../systems/animation/MuscleActivation";
import { TrigramStance } from "../types/common";

// Get leg muscle tension for Thunder stance (진 천둥)
const muscleTension = getMuscleTensionForStance(TrigramStance.JIN);

console.log(muscleTension.get("QUAD_L"));      // 0.69 (69% tension)
console.log(muscleTension.get("QUAD_R"));      // 0.69
console.log(muscleTension.get("CALF_L"));      // 0.29 (29% tension)
console.log(muscleTension.get("CALF_R"));      // 0.29
console.log(muscleTension.get("HAMSTRING_L")); // 0.35
console.log(muscleTension.get("HAMSTRING_R")); // 0.35
console.log(muscleTension.get("GLUTE_L"));     // 0.32
console.log(muscleTension.get("GLUTE_R"));     // 0.32
```

### Muscle Groups Affected | 영향받는 근육 그룹

- **QUAD_L** / **QUAD_R** - 대퇴사두근 (Quadriceps) - Primary weight-bearing muscles
- **HAMSTRING_L** / **HAMSTRING_R** - 햄스트링 (Hamstrings) - Stabilization muscles
- **CALF_L** / **CALF_R** - 종아리 (Calves) - Isometric hold support
- **GLUTE_L** / **GLUTE_R** - 둔근 (Glutes) - Hip extension and posture

## Calculation Formulas | 계산 공식

### Quadriceps Tension (대퇴사두근 긴장도)

```typescript
// Base tension from knee bend angle
baseTension = (180° - kneeAngle) / 110

// Apply weight distribution
quadTension = baseTension * 0.6 + weightDistribution * 0.4
```

**Example - Jin Thunder Stance (진 천둥 자세):**
- Knee angle: 90° (deep squat)
- Weight: 50% each leg
- Result: `(180-90)/110 * 0.6 + 0.5 * 0.4 = 0.69` (69% tension)

### Calf Tension (종아리 긴장도)

```typescript
if (kneeAngle < 100°) {
  // Deep stance - high calf engagement
  calfTension = min(0.9, 0.5 + (100 - kneeAngle)/50 * 0.4) * weightDistribution
} else {
  // Standard stance - moderate engagement
  calfTension = 0.25 * weightDistribution
}
```

**Example - Jin Thunder Stance:**
- Knee angle: 90° (< 100°)
- Weight: 50% each leg
- Result: `(0.5 + (100-90)/50 * 0.4) * 0.5 = 0.29` (29% tension)

### Hamstring Tension (햄스트링 긴장도)

```typescript
// Antagonist muscles - activate for stabilization
hamstringTension = baseTension * 0.5 * weightDistribution
```

### Glute Tension (둔근 긴장도)

```typescript
// Based on hip height - lower stances engage more
gluteBaseTension = (1.0 - hipHeight) * 0.5
gluteTension = gluteBaseTension + baseTension * 0.2 * weightDistribution
```

## Stance-Specific Results | 자세별 결과

### Deep Stances (깊은 자세)

#### ☳ Jin Thunder (진 천둥) - 90° knee, 50/50 weight
- **QUAD**: 0.69 (Very high - isometric hold)
- **CALF**: 0.29 (Moderate - balance support)
- **HAMSTRING**: 0.35 (Stabilization)
- **GLUTE**: 0.32 (Low hip position)

#### ☷ Gon Earth (곤 땅) - 80° knee, 50/50 weight
- **QUAD**: 0.75 (Maximum - deepest stance)
- **CALF**: 0.33 (High - extreme balance)
- **HAMSTRING**: 0.38 (Maximum stabilization)
- **GLUTE**: 0.36 (Very low hip)

### Forward Weight Stances (전방 체중 자세)

#### ☰ Geon Heaven (건 하늘) - 70°/160° knees, 60/40 weight
- **QUAD_R (front)**: 0.64 (High - bearing front weight)
- **QUAD_L (back)**: 0.20 (Low - extended back leg)
- **Front leg bears majority of load**

### Back Weight Stances (후방 체중 자세)

#### ☱ Tae Lake (태 호수) - 170°/120° knees, 10/90 weight
- **QUAD_R (front)**: 0.08 (Very low - light touch)
- **QUAD_L (back)**: 0.50 (High - spring-loaded)
- **Back leg bears majority of load**

#### ☵ Gam Water (감 물) - 150°/100° knees, 30/70 weight
- **QUAD_R (front)**: 0.22 (Moderate)
- **QUAD_L (back)**: 0.51 (High)
- **Back-weighted defensive stance**

### Balanced Stances (균형 자세)

#### ☲ Li Fire (리 화염) - 135° both knees, 50/50 weight
- **QUAD_L**: 0.45 (Moderate)
- **QUAD_R**: 0.45 (Moderate)
- **Equal tension for mobility**

#### ☶ Gan Mountain (간 산) - 120° both knees, 40/60 weight
- **QUAD_L**: 0.48 (Moderate-high)
- **QUAD_R**: 0.42 (Moderate)
- **Slight back emphasis for defense**

### Special Stances

#### ☴ Son Wind (손 바람) - 170°/45° knees, 100/0 weight (Crane stance)
- **QUAD_R (standing)**: 0.45 (Moderate - weight bearing)
- **QUAD_L (raised)**: 0.60 (High - holding knee up!)
- **Raised leg requires significant quad engagement to hold position**

## Integration with useMuscleActivation Hook

The hook automatically applies stance tension during idle animations:

```typescript
// Example usage from a component file under src/
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useMuscleActivation } from "../hooks/useMuscleActivation";
import { TrigramStance } from "../types/common";

const MyComponent = () => {
  const { muscleStates, updateMuscleActivations } = useMuscleActivation({
    currentAnimation: "idle",
    stamina: 85,
    currentStance: TrigramStance.JIN, // Apply Jin stance tension
  });

  // Use a ref to track frame counter across renders
  const frameCounterRef = useRef(0);

  useFrame((_, delta) => {
    frameCounterRef.current = (frameCounterRef.current + 1) % 10;
    updateMuscleActivations(delta, frameCounterRef.current);
  });

  return (
    <BoneRenderer
      rig={rig}
      muscleStates={muscleStates}
      isExhausted={stamina < 20}
    />
  );
};
```

## Visual Representation

The tension values are applied to `BoneAttachedMuscles` components which:

1. **Scale muscle geometry** based on tension (0.0 = relaxed, 1.0 = fully flexed)
2. **Change muscle color** based on tension level:
   - Relaxed: `KOREAN_COLORS.MUSCLE_TONE`
   - Flexed (>0.7): `KOREAN_COLORS.MUSCLE_FLEXED`
   - Exhausted: `KOREAN_COLORS.MUSCLE_EXHAUSTED`
3. **Apply shaking effect** when exhausted and tension > 0.3

## Performance

- **60fps compatible** - Lightweight calculations
- **Cached results** - Muscle states synced every 10 frames
- **No allocations** - Reuses scratch maps to avoid GC pressure
- **Smooth transitions** - Lerp interpolation at 5.0/sec

## Testing

Comprehensive test coverage (55 tests passing):

```bash
npm test -- MuscleActivation.test.ts
```

### Test Categories:
- Deep stances show high muscle engagement
- Weight distribution affects leg tension correctly
- Hamstring and glute activation
- Single-leg crane stance
- All values within 0-1 range
- Smooth transitions between states

## Korean Martial Arts Authenticity (한국 무술 진실성)

Based on authentic Korean martial arts biomechanics:

- **태권도 (Taekwondo)** - Horse stance (기마서기), forward stance (앞서기)
- **합기도 (Hapkido)** - Cat stance (고양이서기), back stance (뒤서기)
- **택견 (Taekyon)** - Crane stance (학서기), fluid movements
- **씨름 (Ssireum)** - Low grappling stances

All tension calculations reflect real isometric muscle engagement patterns used in traditional Korean martial arts training.

## References

- `src/systems/animation/MuscleActivation.ts` - Core implementation
- `src/systems/animation/MuscleActivation.test.ts` - Test suite
- `src/hooks/useMuscleActivation.ts` - Integration hook
- `src/systems/animation/MartialArtsConstants.ts` - Biomechanics data
- `src/components/shared/three/anatomy/BoneAttachedMuscles.tsx` - Visual rendering

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
