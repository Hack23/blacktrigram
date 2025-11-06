---
name: "⚔️ Build Technique Catalog UI with Real Combat Data"
about: Replace mock technique list in CombatControls with actual CombatSystem data
title: "⚔️ Build Technique Catalog UI with Real Combat Data"
labels: ["game-development", "ui", "high-priority", "combat"]
assignees: []
---

## 🎯 Objective

Replace the mock technique list in `CombatControls.tsx` with actual technique data from `CombatSystem`, implementing proper filtering by stance, stamina gating, and bilingual display.

## 📋 Context

**Current State**:
- ✅ `CombatSystem` has `getAvailableTechniques()` method with full technique data
- ✅ Korean technique names and descriptions exist in `KoreanTechniques.ts`
- ✅ `CombatControls` UI framework exists with responsive layout
- ❌ Techniques are currently hard-coded mock data
- ❌ No stamina/Ki cost validation in UI
- ❌ No stance-specific technique filtering

## ✅ Acceptance Criteria

### 1. Data Integration
- [ ] Surface `CombatSystem.getAvailableTechniques()` in `CombatControls`
- [ ] Filter techniques by current player stance
- [ ] Display technique metadata (damage, stamina cost, Ki cost)
- [ ] Show bilingual technique names (Korean | English)

### 2. Stamina & Ki Gating
- [ ] Disable techniques when stamina < required cost
- [ ] Disable techniques when Ki < required cost
- [ ] Visual indication of disabled state (grayed out + tooltip)
- [ ] Real-time updates as stamina/Ki regenerate

### 3. UI Enhancement
- [ ] Technique cards with hover effects showing details
- [ ] Keyboard shortcuts (1-8 for techniques)
- [ ] Touch-friendly button sizing for mobile
- [ ] Responsive grid layout adapting to screen size

### 4. Korean Theming
- [ ] Use `KOREAN_COLORS` for technique type indicators
- [ ] Trigram symbols for stance-specific techniques
- [ ] Bilingual tooltips with proper Korean typography
- [ ] Neon borders matching cyberpunk aesthetic

## 📚 Reference Files
- `src/components/combat/components/CombatControls.tsx`
- `src/systems/CombatSystem.ts`
- `src/systems/trigram/KoreanTechniques.ts`
- `src/types/constants/colors.ts`

## 🎨 UI Mock
```
┌─────────────────────────────────────┐
│ 🥋 Available Techniques (☰ Geon)   │
├─────────────────────────────────────┤
│ [1] 직격권 | Direct Strike          │
│     💪 Stamina: 8  🔵 Ki: 5        │
│     💥 Damage: 20  ⚡ Speed: Fast   │
├─────────────────────────────────────┤
│ [2] 뇌격장 | Thunder Palm (DISABLED)│
│     💪 Stamina: 15  🔵 Ki: 12      │
│     ⚠️ Insufficient Ki              │
└─────────────────────────────────────┘
```

**Priority**: 🔴 HIGH | **Effort**: 2-3 days
