# Layout System Application Plan for 3D Screens

## 🎯 Objective
Apply the unified layout system to game screens, prioritizing 3D/Three.js functionality for proper game operation.

## 📋 Refactoring Priority

### Priority 1: CombatScreen3D (Core Gameplay)
**File:** `src/components/combat/CombatScreen3D.tsx`

**Current Issues:**
- 4+ instances of absolute positioning with hardcoded values
- Custom z-index values (not using Z_INDEX constants)
- Html overlays positioned manually within Three.js Canvas

**Refactoring Approach:**
1. Keep Canvas absolute positioning (required for Three.js layering)
2. Replace Html overlay positioning with ResponsiveContainer
3. Apply Z_INDEX.HUD for HUD elements
4. Apply Z_INDEX.MOBILE_CONTROLS for touch controls
5. Use grid system for consistent element spacing

**Example Before:**
```tsx
<Html fullscreen>
  <div style={{ position: "absolute", top: 10, left: 10, zIndex: 100 }}>
    <PlayerHUD player={player1} />
  </div>
</Html>
```

**Example After:**
```tsx
<Html fullscreen>
  <ResponsiveContainer
    position={{ base: { x: 10, y: 10 } }}
    containerWidth={width}
    useSafeArea
    safeAreaEdge="top"
    zIndex={Z_INDEX.HUD}
  >
    <PlayerHUD player={player1} />
  </ResponsiveContainer>
</Html>
```

### Priority 2: TrainingScreen3D (Training Mode)
**File:** `src/components/training/TrainingScreen3D.tsx`

**Similar approach to CombatScreen3D:**
- Html overlays → ResponsiveContainer
- Z_INDEX constants for proper layering
- Safe area handling for mobile controls

### Priority 3: IntroScreenThreeJS (Entry Point)
**File:** `src/components/intro/IntroScreenThreeJS.tsx`

**Current Issues:**
- 2 instances of absolute positioning (background, Canvas)
- VolumeControl uses hardcoded positioning

**Refactoring Approach:**
1. Keep background and Canvas absolute (required for visual effect)
2. Html overlays use ResponsiveContainer
3. Apply Z_INDEX hierarchy

## 🔧 UI Component Updates

### VolumeControl Example
**File:** `src/components/ui/VolumeControl.tsx`

**Before:**
```tsx
const getPositionStyle = useMemo((): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 1000, // Custom z-index
    padding: compact ? "8px 12px" : "12px 16px",
  };
  
  switch (position) {
    case "top-right":
      return { ...baseStyle, top: "20px", right: "20px" };
    // ...
  }
}, [position, compact]);
```

**After:**
```tsx
// Use ResponsiveContainer wrapper or return position for parent
const getPositionConfig = useMemo(() => {
  switch (position) {
    case "top-right":
      return {
        position: { base: { x: 0, y: 20 } },
        horizontalAlign: "right" as const,
        margin: 20,
        zIndex: Z_INDEX.HUD,
      };
    // ...
  }
}, [position]);
```

## 📊 Implementation Strategy

### Phase 1: Demonstration (Current)
- Create example refactoring for one component
- Show before/after comparison
- Validate performance (60fps maintained)
- Get user approval

### Phase 2: Core Screens
- Refactor CombatScreen3D Html overlays
- Refactor TrainingScreen3D Html overlays
- Test gameplay functionality
- Verify 3D rendering unaffected

### Phase 3: UI Components
- Update VolumeControl
- Update other reusable UI components
- Apply to IntroScreenThreeJS

### Phase 4: Validation
- Test on 5+ screen sizes (375px-1920px)
- Verify Korean/English alignment
- Performance validation (60fps)
- E2E tests pass

## ✅ Success Criteria

- [ ] CombatScreen3D uses ResponsiveContainer for UI overlays
- [ ] TrainingScreen3D uses ResponsiveContainer for UI overlays
- [ ] All screens use Z_INDEX constants
- [ ] Safe area handling applied to mobile controls
- [ ] 60fps performance maintained
- [ ] Game functionality preserved
- [ ] Tests passing

## 🎮 3D Functionality Preservation

**Critical: Do NOT change:**
- Canvas positioning (must remain absolute for Three.js)
- Camera configurations
- 3D scene rendering
- WebGL context handling
- Performance optimizations

**Safe to change:**
- Html overlay positioning within Canvas
- UI element layout and spacing
- Z-index values (use constants)
- Responsive calculations

## 📝 Next Steps

1. **Get user confirmation** on approach
2. **Start with CombatScreen3D** - most critical for gameplay
3. **Incremental changes** - one screen at a time
4. **Test after each change** - ensure game works
5. **Report progress** - commit working changes

---

**Status:** Awaiting user confirmation to proceed with refactoring
**Estimated Impact:** ~200 lines changed across 3 main screens
**Risk Level:** Low (Html overlays only, Canvas untouched)
**Performance Impact:** Neutral or improved (optimized calculations)
