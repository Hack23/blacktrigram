---
name: "🎬 Implement Player Animation System with Spritesheet Integration"
about: Wire PlayerVisuals component to trigram stance animations with proper timing
title: "🎬 Implement Player Animation System with Spritesheet Integration"
labels: ["game-development", "animation", "high-priority", "PixiJS"]
assignees: []
---

## 🎯 Objective

Integrate the existing spritesheet manifests with `PlayerVisuals.tsx` to enable dynamic stance transitions, attack animations, block sequences, and KO effects for all 5 player archetypes.

## 📋 Context

**Current State**:
- ✅ Spritesheet JSON manifests exist for all archetypes (`assets/spritesheets/*.json`)
- ✅ `PlayerSpritesheet.ts` provides runtime lookup layer
- ✅ `PlayerVisuals.tsx` renders player silhouettes and stance glyphs
- ❌ No animation state machine connected to visual updates
- ❌ Attack/block/KO animations are placeholders

## ✅ Acceptance Criteria

### 1. Animation State Machine
- [ ] Create `AnimationStateMachine.ts` in `src/systems/animation/`
- [ ] Define states: `IDLE`, `STANCE_TRANSITION`, `ATTACK`, `BLOCK`, `HIT_REACTION`, `KO`
- [ ] Implement state transitions with timing from `animations.ts`
- [ ] Handle animation queuing for combo sequences

### 2. PlayerVisuals Integration
- [ ] Connect `PlayerVisuals` to animation state machine
- [ ] Implement spritesheet frame updates based on current state
- [ ] Add stance-specific idle animations for all 8 trigrams
- [ ] Wire attack animations to technique execution events

### 3. Combat Integration
- [ ] Wire to `CombatScreen` combat events
- [ ] Synchronize with audio triggers
- [ ] Maintain 60fps performance with 2 animated players
- [ ] Add comprehensive tests

## 📚 Reference Files
- `src/components/ui/PlayerVisuals.tsx`
- `src/utils/PlayerSpritesheet.ts`
- `src/types/constants/animations.ts`
- `assets/spritesheets/*.json`

**Priority**: 🔴 HIGH | **Effort**: 3-4 days
