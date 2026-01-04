# Physical Attributes Visual Guide

## Overview

This document explains how physical attributes (muscle mass and fat mass) affect the visual appearance of player characters in Black Trigram (흑괘).

**PR Context:** Implementation of visual differentiation based on PR #1081's physical attributes system.

## Implementation Details

### Muscle Mass Scaling

**Purpose:** Makes characters with higher muscle mass appear visibly larger and more muscular.

**Formula:**
```typescript
muscleScaleFactor = sqrt(muscleMass / 35)
```

**Reference:** 35kg muscle mass = 1.0x scale (baseline)

**Range:**
- Minimum: 32kg → ~0.93x scale (lean/defined muscles)
- Average: 35kg → 1.00x scale (normal build)
- Maximum: 42kg → ~1.09x scale (bulky/thick muscles)

**Visual Impact:**
- Affects all 20 muscle groups (biceps, triceps, quads, etc.)
- Scales both base and flexed muscle sizes proportionally
- Gradual scaling using square root for realistic appearance

### Fat Layer Rendering

**Purpose:** Adds a semi-transparent "fat layer" over muscles to represent body fat percentage.

**Opacity Formula:**
```typescript
fatLayerOpacity = clamp((fatMass - 8) / (22 - 8) * 0.5, 0.0, 0.5)
```

**Thickness Formula:**
```typescript
fatLayerThickness = clamp((fatMass - 8) / (22 - 8) * 0.15, 0.0, 0.15)
```

**Reference:** 
- 8kg fat → invisible (0% opacity)
- 12kg fat → moderate visibility (~14% opacity)
- 22kg fat → maximum visibility (50% opacity)

**Visual Impact:**
- Semi-transparent skin-tone layer over all muscle groups
- Adds 0-15% additional size to muscles
- Only visible when opacity > 5% (fat mass > ~9kg)
- Uses SKIN_TONE color (peachy tone #f5d7b1)

## Archetype Visual Characteristics

### 조직폭력배 (Jojik Pokryeokbae) - Organized Crime

**Physical Stats:**
- Muscle Mass: 42kg (highest)
- Fat Mass: 18kg (highest)
- Weight: 85kg

**Visual Appearance:**
- **Muscle Scale:** ~1.09x (bulky, thick muscles)
- **Fat Layer Opacity:** ~36% (prominently visible)
- **Fat Layer Thickness:** +11% size increase
- **Overall Look:** Intimidating powerhouse with visible bulk and some softness
- **Combat Style:** Raw power and durability over refined technique

### 암살자 (Amsalja) - Shadow Assassin

**Physical Stats:**
- Muscle Mass: 32kg (lowest)
- Fat Mass: 9kg (lowest)
- Weight: 68kg

**Visual Appearance:**
- **Muscle Scale:** ~0.93x (lean, defined muscles)
- **Fat Layer Opacity:** ~4% (nearly invisible)
- **Fat Layer Thickness:** +0.7% size increase
- **Overall Look:** Lean and agile with sharply defined muscles
- **Combat Style:** Speed and precision through minimal mass

### 무사 (Musa) - Traditional Warrior

**Physical Stats:**
- Muscle Mass: 38kg
- Fat Mass: 12kg
- Weight: 75kg

**Visual Appearance:**
- **Muscle Scale:** ~1.04x (athletic, balanced)
- **Fat Layer Opacity:** ~14% (subtle layer)
- **Fat Layer Thickness:** +4% size increase
- **Overall Look:** Balanced warrior physique with disciplined conditioning
- **Combat Style:** Harmony between strength, speed, and endurance

### 해커 (Hacker) - Cyber Warrior

**Physical Stats:**
- Muscle Mass: 34kg
- Fat Mass: 14kg
- Weight: 70kg

**Visual Appearance:**
- **Muscle Scale:** ~0.99x (slightly below average)
- **Fat Layer Opacity:** ~21% (moderately visible)
- **Fat Layer Thickness:** +6.4% size increase
- **Overall Look:** Average build with slight softness from sedentary work
- **Combat Style:** Tech augmentation compensates for physical limitations

### 정보요원 (Jeongbo Yowon) - Intelligence Operative

**Physical Stats:**
- Muscle Mass: 36kg
- Fat Mass: 11kg
- Weight: 73kg

**Visual Appearance:**
- **Muscle Scale:** ~1.01x (fit and toned)
- **Fat Layer Opacity:** ~11% (minimal visibility)
- **Fat Layer Thickness:** +3.2% size increase
- **Overall Look:** Government fitness standards - functional and versatile
- **Combat Style:** Balanced operative training for varied missions

## Visual Comparison Table

| Archetype | Muscle Scale | Fat Opacity | Overall Appearance |
|-----------|--------------|-------------|-------------------|
| **Jojik** | 1.09x (Bulky) | 36% (High) | Thick, powerful, intimidating |
| **Musa** | 1.04x (Athletic) | 14% (Low) | Balanced, disciplined, toned |
| **Jeongbo** | 1.01x (Fit) | 11% (Low) | Lean operative, functional |
| **Hacker** | 0.99x (Average) | 21% (Moderate) | Tech worker, slight softness |
| **Amsalja** | 0.93x (Lean) | 4% (Minimal) | Defined, agile, efficient |

## Technical Implementation

### MuscleSystem Component Changes

**New Props:**
```typescript
interface MuscleSystemProps {
  readonly muscleStates: Map<string, number>;
  readonly isExhausted?: boolean;
  readonly physicalAttributes?: {
    readonly muscleMass: number;
    readonly fatMass: number;
  };
}
```

**Calculation Functions:**
- `calculateMuscleScaleFactor(muscleMass: number): number`
- `calculateFatLayerOpacity(fatMass: number): number`
- `calculateFatLayerThickness(fatMass: number): number`

**Rendering:**
1. Scale all muscle group geometries based on muscle mass
2. Render fat layer as semi-transparent overlay when opacity > 5%
3. Apply muscle scaling to both base and flexed states

### SkeletalPlayer3D Integration

```typescript
<MuscleSystem 
  muscleStates={muscleStates} 
  isExhausted={stamina < 20}
  physicalAttributes={{
    muscleMass: physicalAttributes.muscleMass,
    fatMass: physicalAttributes.fatMass,
  }}
/>
```

## Testing

**Test Coverage:** 52 tests passing
- 35 existing tests (muscle groups, tension, exhaustion)
- 17 new tests for physical attributes scaling

**Test Categories:**
1. **Muscle Mass Scaling Tests**
   - High muscle mass (Jojik - 42kg)
   - Low muscle mass (Amsalja - 32kg)
   - Average muscle mass (Musa - 38kg)
   - Backward compatibility (no attributes)

2. **Fat Layer Tests**
   - High fat mass rendering (18kg)
   - Low fat mass rendering (9kg)
   - Below visibility threshold (8kg)

3. **Archetype Visual Tests**
   - All 5 archetypes render correctly
   - Combined with exhaustion effects

## Performance Considerations

**Impact:** Minimal performance overhead
- Calculations happen once per render (useMemo)
- Fat layer only rendered when visible (opacity > 5%)
- No additional frame-by-frame computations
- All 20 muscle groups + fat layer render at 60fps

**Optimization:**
- Scale factors cached with useMemo
- Fat layer skipped for low-fat characters
- Existing muscle system performance maintained

## Future Enhancements

**Potential Additions:**
1. Body shape variations based on weight distribution
2. Muscle definition detail based on body fat percentage
3. Vascular visibility for extremely low body fat
4. Muscle striations for high muscle mass + low fat
5. Sweat and fatigue effects scaled by body composition

## Korean Martial Arts Context

The visual differences reinforce the philosophical approach of each archetype:

- **Jojik (조직폭력배):** Street-hardened bulk reflects ruthless survival
- **Amsalja (암살자):** Lean efficiency embodies invisible lethality
- **Musa (무사):** Balanced physique shows disciplined training
- **Hacker (해커):** Tech-focused build indicates augmented combat
- **Jeongbo (정보요원):** Operative fitness represents versatile capability

## Accessibility

**Color Choices:**
- SKIN_TONE (#f5d7b1) provides natural contrast
- Semi-transparency allows muscle definition to show through
- No reliance on color alone for differentiation (size matters more)

## References

- PR #1081: Physical Attributes System Implementation
- `src/data/archetypePhysicalAttributes.ts` - Archetype physical profiles
- `src/components/three/MuscleSystem.tsx` - Visual rendering implementation
- `src/components/three/SkeletalPlayer3D.tsx` - Integration point
