# 📖 Philosophy Screen Package

**Package**: `src/components/screens/philosophy/`  
**Main Component**: `PhilosophyScreen3D.tsx`  
**Complexity**: Low (5 components)  
**Performance Target**: 60fps all devices

---

## 📋 Overview

The Philosophy Screen explores the I Ching and Korean martial arts philosophy:
- Eight trigram (팔괘) explanations
- Traditional Korean martial arts philosophy
- Combat principles and wisdom
- Cultural context and history

---

## 🏗️ Component Structure

```plaintext
philosophy/
├── PhilosophyScreen3D.tsx          # Main screen component
├── PhilosophyScreen3D.test.tsx     # Screen tests
├── components/
│   ├── ui/
│   │   ├── PhilosophyContentOverlayHtml.tsx  # Content display
│   │   └── TrigramNavigationOverlayHtml.tsx  # Navigation
│   └── three/
│       ├── TrigramSymbol3D.tsx     # 3D trigram symbols
│       └── BackgroundEffect3D.tsx  # Visual effects
└── README.md                        # This file
```

---

## ⚡ Performance Characteristics

### Current Performance (January 2026)

| Device | FPS | Load Time | Memory | Status |
|--------|-----|-----------|--------|---------|
| Desktop | 60fps | 1.0s | 240MB | ✅ Excellent |
| Tablet | 60fps | 1.2s | 160MB | ✅ Excellent |
| Mobile | 58-60fps | 1.8s | 110MB | ✅ Excellent |
| Low-End | 55-58fps | 2.3s | 95MB | ✅ Excellent |

**Status**: ✅ **Excellent performance across all devices** - No optimization needed

---

## 🎮 Key Features

### Eight Trigrams (팔괘)

**1. ☰ 건 (Geon) - Heaven 天**
- Element: Metal, Direction: Northwest
- Philosophy: Direct force, heavenly power
- Combat: Powerful frontal attacks

**2. ☱ 태 (Tae) - Lake 澤**
- Element: Metal, Direction: West
- Philosophy: Joyful adaptation, fluidity
- Combat: Joint manipulation, pressure points

**3. ☲ 리 (Li) - Fire 火**
- Element: Fire, Direction: South
- Philosophy: Clarity and precision
- Combat: Precise nerve strikes

**4. ☳ 진 (Jin) - Thunder 雷**
- Element: Wood, Direction: East
- Philosophy: Explosive movement
- Combat: Powerful bursts

**5. ☴ 손 (Son) - Wind 風**
- Element: Wood, Direction: Southeast
- Philosophy: Continuous pressure
- Combat: Flowing combinations

**6. ☵ 감 (Gam) - Water 水**
- Element: Water, Direction: North
- Philosophy: Adaptation and flow
- Combat: Defensive mastery

**7. ☶ 간 (Gan) - Mountain 山**
- Element: Earth, Direction: Northeast
- Philosophy: Immovable strength
- Combat: Solid defense

**8. ☷ 곤 (Gon) - Earth 地**
- Element: Earth, Direction: Southwest
- Philosophy: Grounding and stability
- Combat: Takedowns and throws

### Content Sections

**Philosophy Topics**:
- I Ching and trigram system
- Korean martial arts history
- Vital point theory (급소학)
- Combat ethics and honor
- Training philosophy

---

## 🎨 Korean Theming

### Trigram Display

Each trigram shown with:
- Korean name (건, 태, 리, etc.)
- Chinese character (天, 澤, 火, etc.)
- English translation
- Symbolic representation
- Combat application

### UI Colors

```typescript
// Trigram-specific colors
TRIGRAM_GEON_PRIMARY: 0xffd700  // Heaven - Gold
TRIGRAM_TAE_PRIMARY: 0x87ceeb   // Lake - Sky Blue
TRIGRAM_LI_PRIMARY: 0xff4500    // Fire - Orange Red
TRIGRAM_JIN_PRIMARY: 0x9370db   // Thunder - Purple
TRIGRAM_SON_PRIMARY: 0x32cd32   // Wind - Green
TRIGRAM_GAM_PRIMARY: 0x1e90ff   // Water - Blue
TRIGRAM_GAN_PRIMARY: 0x8b4513   // Mountain - Brown
TRIGRAM_GON_PRIMARY: 0x2f4f4f   // Earth - Dark Slate
```

---

## 🧪 Testing Coverage

**Current Coverage**: ~80% (target: >85%)

### Test Scenarios

1. **Content Display**:
   - All trigrams shown
   - Philosophy text correct
   - Bilingual content

2. **Navigation**:
   - Section switching
   - Trigram selection
   - Back to menu

3. **Visual Effects**:
   - Trigram symbols rotate
   - Background effects
   - Smooth transitions

---

## ♿ Accessibility

### Keyboard Controls

- **Arrow Keys**: Navigate trigrams
- **Tab**: Switch sections
- **Enter**: Select trigram
- **Esc**: Return to menu
- **1-8**: Quick-select trigram

---

## 📚 Related Documentation

- [Screen Architecture Patterns](../../docs/SCREEN_ARCHITECTURE_PATTERNS.md)
- [Performance Baseline](../../docs/PERFORMANCE_BASELINE.md)
- [Overall Architecture](../../ARCHITECTURE.md)

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
