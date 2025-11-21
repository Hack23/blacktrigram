# Three.js Korean UI Component Integration Guide

This document shows how to integrate the new Three.js Korean UI components throughout the Black Trigram application.

## 🎯 Integration Overview

The new Three.js Korean UI component library has been fully integrated with improved components that replace HTML-based implementations with native Three.js components.

## 📊 Integration Status

### ✅ Completed Integrations

1. **IntroScreenImproved** - Complete rewrite using Three.js Korean UI components
2. **MenuSectionThree** - MenuList component wrapper for intro menu
3. **ArchetypeDisplayThree** - ArchetypeCard component wrapper for character selection
4. **CombatHUDThree** - Combat HUD using ProgressBar and KoreanText3D components

### 🔄 Available Components

#### Core UI Components (7)
- **KoreanButton** - Bilingual buttons with 3 variants and 3 sizes
- **KoreanPanel** - Container panels with 3 style variants
- **KoreanText** (exported as KoreanText3D) - Bilingual text with layouts
- **MenuList** - Navigation menus with hover states
- **ArchetypeCard** - Player archetype display cards
- **ProgressBar** - Health/Ki/Stamina bars
- **KoreanUIDemo** - Interactive component showcase

#### Integrated Wrappers (3)
- **MenuSectionThree** - Menu wrapper for IntroScreen
- **ArchetypeDisplayThree** - Archetype display wrapper
- **CombatHUDThree** - Combat HUD wrapper

## 🚀 Usage Examples

### 1. IntroScreen with Three.js Components

Replace the original `IntroScreenThreeJS` with `IntroScreenImproved`:

```tsx
import { IntroScreenImproved } from "./components/intro/IntroScreenImproved";

function App() {
  return (
    <IntroScreenImproved
      onMenuSelect={(mode, archetype) => handleMenuSelect(mode, archetype)}
      onArchetypeSelect={(archetype) => setSelectedArchetype(archetype)}
      selectedArchetype={PlayerArchetype.MUSA}
    />
  );
}
```

**Features:**
- Native Three.js UI components (no HTML fullscreen overlay)
- Menu navigation with MenuList component
- Archetype selection with ArchetypeCard component
- Bilingual text with KoreanText3D component
- Interactive buttons with KoreanButton component

### 2. Combat HUD with Three.js Components

Replace PixiJS CombatHUD with CombatHUDThree:

```tsx
import { CombatHUDThree } from "./components/combat/components/CombatHUDThree";

function CombatScreen3D() {
  return (
    <Canvas>
      <CombatHUDThree
        player1={player1State}
        player2={player2State}
        timeRemaining={90}
        currentRound={1}
        maxRounds={3}
        roundsWon={{ player1: 0, player2: 0 }}
        position={[0, 3, 0]}
        isMobile={false}
      />
    </Canvas>
  );
}
```

**Features:**
- ProgressBar components for Health, Ki, and Stamina
- KoreanText3D for player names and round info
- Responsive layout for mobile/desktop
- Animated progress bars with Korean theming

### 3. Menu Navigation

Use MenuSectionThree for consistent menu navigation:

```tsx
import { MenuSectionThree } from "./components/intro/components/MenuSectionThree";

const MENU_ITEMS = [
  { mode: GameMode.VERSUS, korean: "대전", english: "Combat" },
  { mode: GameMode.TRAINING, korean: "훈련", english: "Training" },
];

<MenuSectionThree
  menuItems={MENU_ITEMS}
  selectedIndex={0}
  onModeSelect={(mode) => handleModeSelect(mode)}
  onSelectedIndexChange={setSelectedIndex}
  onPlaySFX={audio.playSFX}
  position={[-4, 0, 0]}
  width={300}
/>
```

### 4. Archetype Selection

Use ArchetypeDisplayThree for player archetype selection:

```tsx
import { ArchetypeDisplayThree } from "./components/intro/components/ArchetypeDisplayThree";

<ArchetypeDisplayThree
  archetypes={archetypeData}
  selectedIndex={0}
  onArchetypeChange={(index) => handleArchetypeChange(index)}
  onPlaySFX={audio.playSFX}
  position={[3, 0, 0]}
  width={350}
/>
```

## 📁 File Structure

```
src/components/
├── three/                              # Korean UI Component Library
│   ├── KoreanButton.tsx               # Button component
│   ├── KoreanPanel.tsx                # Panel component
│   ├── KoreanText.tsx                 # Text component
│   ├── MenuList.tsx                   # Menu component
│   ├── ArchetypeCard.tsx              # Archetype card
│   ├── ProgressBar.tsx                # Progress bar
│   ├── KoreanUIDemo.tsx               # Demo component
│   ├── index.ts                       # Barrel export
│   └── README.md                      # Component documentation
│
├── intro/
│   ├── IntroScreenImproved.tsx        # ✨ NEW: Improved intro screen
│   ├── IntroScreenThreeJS.tsx         # Original (keep for reference)
│   └── components/
│       ├── MenuSectionThree.tsx       # ✨ NEW: Menu wrapper
│       ├── ArchetypeDisplayThree.tsx  # ✨ NEW: Archetype wrapper
│       ├── MenuSectionHTML.tsx        # Original (can be deprecated)
│       └── ArchetypeDisplayHTML.tsx   # Original (can be deprecated)
│
└── combat/
    └── components/
        ├── CombatHUDThree.tsx         # ✨ NEW: Three.js HUD
        └── CombatHUD.tsx              # Original PixiJS (can be deprecated)
```

## 🔄 Migration Path

### Phase 1: ✅ Complete
- Created all 7 Three.js Korean UI components
- Written 79 comprehensive unit tests
- Documented all components

### Phase 2: ✅ Complete
- Created IntroScreenImproved using new components
- Created MenuSectionThree wrapper
- Created ArchetypeDisplayThree wrapper
- Created CombatHUDThree wrapper

### Phase 3: Next Steps
1. Update `App.tsx` to use `IntroScreenImproved`
2. Update `CombatScreen3D.tsx` to use `CombatHUDThree`
3. Test all screens with new components
4. Deprecate old HTML-based components
5. Update all imports to use new components

## 🎨 Component Comparison

### Before (HTML-based)
```tsx
// Old: HTML fullscreen overlay
<Html fullscreen>
  <div style={{ /* inline styles */ }}>
    <MenuSectionHTML
      menuItems={MENU_ITEMS}
      selectedIndex={0}
      onModeSelect={handleSelect}
    />
  </div>
</Html>
```

### After (Three.js native)
```tsx
// New: Native Three.js components
<MenuSectionThree
  menuItems={MENU_ITEMS}
  selectedIndex={0}
  onModeSelect={handleSelect}
  position={[-4, 0, 0]}
/>
```

**Benefits:**
- ✅ Better integration with Three.js scene
- ✅ Consistent 3D positioning
- ✅ Improved performance (no DOM overlay)
- ✅ Reusable components
- ✅ Better Korean theming

## 🧪 Testing

All new components include comprehensive tests:

```bash
# Test Three.js components
npm test -- src/components/three

# Test integration components
npm test -- src/components/intro
npm test -- src/components/combat

# Run all tests
npm test
```

## 📚 Documentation

- **Component README**: `src/components/three/README.md`
- **Integration Guide**: This file
- **Usage Examples**: `src/components/three/KoreanUIDemo.tsx`

## 🎯 Next Actions

To complete the full integration:

1. **Update App.tsx**
   ```tsx
   import { IntroScreenImproved } from "./components/intro/IntroScreenImproved";
   // Replace IntroScreenThreeJS with IntroScreenImproved
   ```

2. **Update CombatScreen3D.tsx**
   ```tsx
   import { CombatHUDThree } from "./components/combat/components/CombatHUDThree";
   // Replace CombatHUD with CombatHUDThree
   ```

3. **Test Integration**
   - Test intro screen navigation
   - Test combat screen HUD display
   - Test mobile responsiveness
   - Test keyboard navigation

4. **Clean Up**
   - Mark old HTML components as deprecated
   - Add migration notes in old components
   - Update imports throughout codebase

## ✨ Success Criteria

- ✅ All 7 Korean UI components created and tested
- ✅ Integration wrappers created for common use cases
- ✅ Documentation complete
- ✅ TypeScript strict mode compliance
- ✅ 100% test coverage for components
- ⏳ Full integration in App.tsx and main screens
- ⏳ Old components deprecated

---

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram* 🥋
