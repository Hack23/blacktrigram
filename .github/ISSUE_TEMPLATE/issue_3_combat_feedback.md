---
name: "✨ Enhance Combat Feedback with Synchronized Effects"
about: Synchronize HitEffectsLayer with audio triggers and add particle effects
title: "✨ Enhance Combat Feedback with Synchronized Effects"
labels: ["game-development", "effects", "high-priority", "audio"]
assignees: []
---

## 🎯 Objective

Enhance combat feedback by synchronizing `HitEffectsLayer` visual effects with audio triggers, implementing camera shake, particle shaders, and bilingual damage popups for immersive combat feel.

## 📋 Context

**Current State**:
- ✅ `HitEffectsLayer.tsx` visualizes hits, crits, blocks, misses
- ✅ `AudioManager` has comprehensive SFX library
- ✅ Combat events flow from `CombatSystem`
- ❌ Audio/visual synchronization is manual and inconsistent
- ❌ No camera shake or screen effects on heavy hits
- ❌ Particle effects are basic and not optimized

## ✅ Acceptance Criteria

### 1. Audio-Visual Synchronization
- [ ] Create `CombatFeedbackController` to orchestrate effects
- [ ] Trigger audio SFX simultaneously with visual hit effects
- [ ] Match SFX intensity to damage type (light/heavy/critical)
- [ ] Implement 3D spatial audio based on hit position

### 2. Camera Effects
- [ ] Camera shake on heavy hits (intensity scales with damage)
- [ ] Screen flash on critical vital point strikes
- [ ] Slow-motion effect for KO moments (0.5x speed for 500ms)
- [ ] Smooth camera interpolation using easing functions

### 3. Particle System Enhancement
- [ ] Blood splatter particles with physics (gravity, velocity)
- [ ] Ki energy trails for special techniques
- [ ] Impact sparks with neon colors matching trigrams
- [ ] Optimize using `ParticleContainer` for batching

### 4. Damage Popups
- [ ] Floating damage numbers with bilingual format
- [ ] Color-coded by damage type (normal/critical/blocked)
- [ ] Smooth fade-out animation with upward motion
- [ ] Korean text rendering with proper font

### 5. Performance Optimization
- [ ] Object pooling for particles (max 100 active)
- [ ] Culling off-screen effects
- [ ] Frame-rate adaptive quality reduction
- [ ] Memory profiling to prevent GC spikes

## 📚 Reference Files
- `src/components/ui/HitEffectsLayer.tsx`
- `src/audio/AudioManager.ts`
- `src/systems/CombatSystem.ts`
- `src/utils/effectUtils.ts`

## 🎨 Effect Specifications

### Camera Shake Formula
```typescript
// Intensity based on damage percentage
const shakeIntensity = Math.min(damage / maxHealth * 10, 5);
const shakeDuration = 200 + (damage * 2); // ms
```

### Particle Configuration
```typescript
const PARTICLE_CONFIG = {
  blood: {
    count: 20,
    velocity: { min: 2, max: 5 },
    gravity: 0.5,
    lifetime: 1000, // ms
    color: KOREAN_COLORS.BLOOD_RED,
  },
  ki: {
    count: 50,
    velocity: { min: 1, max: 3 },
    gravity: -0.2, // float upward
    lifetime: 1500,
    color: KOREAN_COLORS.KI_CYAN,
  },
};
```

**Priority**: 🔴 HIGH | **Effort**: 3 days
