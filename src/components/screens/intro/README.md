# 🎬 Intro Screen Package

**Package**: `src/components/screens/intro/`  
**Main Component**: `IntroScreen3D.tsx`  
**Complexity**: Low (8 components)  
**Performance Target**: 60fps all devices

---

## 📋 Overview

The Intro Screen serves as the game's main menu and entry point:
- Game title and branding
- Player archetype selection (5 archetypes)
- Settings and options
- Navigation to other screens

---

## 🏗️ Component Structure

```plaintext
intro/
├── IntroScreen3D.tsx               # Main screen component
├── IntroScreen3D.test.tsx          # Screen tests
├── components/
│   ├── ui/
│   │   ├── MainMenuOverlayHtml.tsx        # Main menu
│   │   ├── ArchetypeSelectOverlayHtml.tsx # Archetype picker
│   │   └── SettingsOverlayHtml.tsx        # Settings panel
│   └── three/
│       └── BackgroundScene3D.tsx   # 3D background
└── README.md                        # This file
```

---

## ⚡ Performance Characteristics

### Current Performance (January 2026)

| Device | FPS | Load Time | Memory | Status |
|--------|-----|-----------|--------|---------|
| Desktop | 60fps | 1.2s | 280MB | ✅ Excellent |
| Tablet | 60fps | 1.5s | 180MB | ✅ Excellent |
| Mobile | 58-60fps | 2.0s | 120MB | ✅ Excellent |
| Low-End | 55-58fps | 2.5s | 100MB | ✅ Excellent |

**Status**: ✅ **Excellent performance across all devices** - No optimization needed

---

## 🎮 Key Features

### Player Archetypes

**5 Archetypes** (무사, 암살자, 해커, 정보요원, 조직폭력배):

1. **무사 (Musa) - Traditional Warrior**
   - Honor through disciplined strength
   - Balanced combat style

2. **암살자 (Amsalja) - Shadow Assassin**
   - Precision through stealth
   - Speed and accuracy focus

3. **해커 (Hacker) - Cyber Warrior**
   - Technology-enhanced combat
   - Strategic advantages

4. **정보요원 (Jeongbo Yowon) - Intelligence Operative**
   - Strategic analysis
   - Tactical precision

5. **조직폭력배 (Jojik Pokryeokbae) - Organized Crime**
   - Ruthless pragmatism
   - Aggressive techniques

### Menu System

**Navigation Options**:
- Start Combat
- Training Mode
- Philosophy (trigram lore)
- Controls Guide
- Settings
- Exit

---

## 🎨 Korean Theming

### Title Display

```typescript
// Bilingual title with Korean emphasis
"흑괘" (large, primary)
"Black Trigram" (smaller, secondary)
"어둠의 무예로 완벽한 일격을 추구하라"
```

### Menu Colors

```typescript
PRIMARY_CYAN: 0x00e6e6       // Active menu items
ACCENT_GOLD: 0xffc400        // Hover/focus
TEXT_PRIMARY: 0xffffff       // Menu text
UI_BACKGROUND_DARK: 0x0a0a0a // Background
```

---

## 🧪 Testing Coverage

**Current Coverage**: ~85% (target: >85%)

### Test Scenarios

1. **Menu Navigation**:
   - Menu item selection
   - Keyboard navigation
   - Touch/click interaction

2. **Archetype Selection**:
   - Archetype display
   - Selection confirmation
   - Description display

3. **Settings**:
   - Settings panel display
   - Option changes
   - Save/cancel functionality

4. **Performance**:
   - 60fps maintained
   - Quick load times
   - Minimal memory usage

---

## ♿ Accessibility

### Keyboard Controls

- **Arrow Keys**: Navigate menu
- **Enter**: Select menu item
- **Tab**: Cycle through options
- **Esc**: Back to previous menu
- **1-5**: Quick-select archetype

---

## 📚 Related Documentation

- [Screen Architecture Patterns](../../docs/SCREEN_ARCHITECTURE_PATTERNS.md)
- [Performance Baseline](../../docs/PERFORMANCE_BASELINE.md)
- [Overall Architecture](../../ARCHITECTURE.md)

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
