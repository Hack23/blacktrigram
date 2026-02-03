# Guard Pose Corrections Reference
## Quick Reference for Fixing StanceGuardPoses.ts

**Target File**: `src/systems/animation/catalogs/StanceGuardPoses.ts`  
**Purpose**: Replace incorrect guard pose angles with authentic Korean martial arts biomechanics

---

## ☰ GEON (Heaven) - Taekwondo Ap Seogi Guard

### Current (WRONG) - Lines 56-91
```typescript
leftArm: {
  shoulder: new THREE.Euler(-1.0, 0.2, 0.5),   // ❌ Too high
  elbow: new THREE.Euler(0, 0, -2.2),          // ✅ Correct tightness
  wrist: new THREE.Euler(0.3, 0.2, 0),         // ❌ Too much extension
}
```

### Corrected (AUTHENTIC)
```typescript
leftArm: {
  shoulder: new THREE.Euler(-0.7, 0.15, 0.35),  // ✅ Solar plexus level
  elbow: new THREE.Euler(0, 0, -2.0),           // ✅ Tight to ribs (115°)
  wrist: new THREE.Euler(0, 0.1, 0),            // ✅ Neutral ready position
}
rightArm: {
  shoulder: new THREE.Euler(-0.7, -0.15, -0.35), // ✅ Mirror
  elbow: new THREE.Euler(0, 0, 2.0),             // ✅ Tight to ribs
  wrist: new THREE.Euler(0, -0.1, 0),            // ✅ Neutral
}
```

**Biomechanics**:
- Shoulder flexion: -0.7 rad (-40°) = hands at mid-chest/solar plexus
- Elbow flexion: 2.0 rad (115°) = tight guard, elbows cover ribs
- Wrist: neutral 0° = fists ready to strike

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
