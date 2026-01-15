# 3D Components Improvement Plan for Black Trigram

## 1. Overview

This document outlines the strategy to upgrade the visual fidelity of 3D components in the `Combat` and `Training` screens. The goal is to align the visuals with a high-end "Cyberpunk Korean Martial Arts" aesthetic, utilizing PBR materials, Image-Based Lighting (IBL), and advanced post-processing effects.

## 2. Completed Improvements (Combat Environment)

- **Scene Lighting**: Integrated `<Environment preset="city" />` for realistic reflections.
- **Arena Materials**: Upgraded `CombatArena3D` floor and walls to `MeshPhysicalMaterial` with adjusted roughness/metalness for a wet, neon-lit concrete look.
- **Testing**: Updated unit tests to support new environmental components.

## 3. Training Screen Upgrades

The training screen currently looks flatter than the combat screen.

### 3.1 Post-Processing (Priority: High)

- **Target**: `TrainingScreen3D.tsx`
- **Current State**: Basic Bloom, SSAO, Vignette.
- **Improvement**:
  - **Chromatic Aberration**: Add subtle color fringe (offset ~0.002) to simulate cyber-optic HUD interface.
  - **Noise**: Add low-opacity overlay for filmic/gritty texture.
  - **Bloom**: Increase intensity slightly for "neon" glow on vital points.

### 3.2 Training Dummy (Priority: High)

- **Target**: `TrainingDummy3D.tsx`
- **Current State**: `MeshStandardMaterial` (Steel Gray).
- **Improvement**: Upgrade to `MeshPhysicalMaterial`.
  - **Clearcoat**: 1.0 (Glossy cyborg synthetic skin).
  - **Metalness**: 0.8 (Metallic sub-structure).
  - **Roughness**: 0.2 (Polished).
  - **Emissive Response**: Add pulse effect when hit.

### 3.3 Anatomy Overlay

- **Target**: `AnatomyOverlay3D.tsx`
- **Improvement**: Use `MeshPhysicalMaterial` with `transmission` (glass-like) properties for outer layers to see internal organs, instead of simple opacity.

## 4. Shared Components Strategy

### 4.1 Vital Point Markers

- **Target**: `VitalPointMarker3D.tsx`
- **Improvement**: Ensure they emit light (`emissive > 1`) so they bloom properly against the dark background.

### 4.2 Particle Effects

- **Target**: `HitFeedbackEffect3D.tsx`
- **Improvement**: Increase particle count for "critical" hits and use additive blending for brighter sparks.

## 5. Execution Plan

1.  **Refine Training Screen**: Add new post-processing effects. [DONE]
2.  **Upgrade Dummy**: Replace materials in `TrainingDummy3D`. [DONE]
3.  **Upgrade Anatomy**: Upgrade Skeleton and Vascular layers to `MeshPhysicalMaterial` with emissive pulsing. [DONE]
4.  **Vital Point Markers**: Upgrade to `MeshPhysicalMaterial` with high bloom. [DONE]
5.  **Particle Effects**: Increase density and use additive blending. [DONE]
6.  **Fix Combat Screen**: Ensure `CombatScreen3D` also receives the intended post-processing updates. [DONE]
