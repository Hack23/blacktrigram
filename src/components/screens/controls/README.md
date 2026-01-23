# 🎮 Controls Screen Package

**Package**: `src/components/screens/controls/`  
**Main Component**: `ControlsScreen3D.tsx`  
**Complexity**: Low (6 components)  
**Performance Target**: 60fps all devices

---

## 📋 Overview

The Controls Screen provides comprehensive control documentation and interactive demonstrations:
- Keyboard control mapping
- Touch/mobile control guide
- Interactive demonstrations
- Combat control reference

---

## 🏗️ Component Structure

```plaintext
controls/
├── ControlsScreen3D.tsx            # Main screen component
├── ControlsScreen3D.test.tsx       # Screen tests
├── components/
│   ├── ui/
│   │   ├── ControlsListOverlayHtml.tsx    # Control descriptions
│   │   └── KeyboardMapOverlayHtml.tsx     # Keyboard layout
│   └── interactive/
│       └── ControlDemo3D.tsx       # Interactive demo
└── README.md                        # This file
```

---

## ⚡ Performance Characteristics

### Current Performance (January 2026)

| Device | FPS | Load Time | Memory | Status |
|--------|-----|-----------|--------|---------|
| Desktop | 60fps | 0.8s | 220MB | ✅ Excellent |
| Tablet | 60fps | 1.0s | 150MB | ✅ Excellent |
| Mobile | 60fps | 1.5s | 100MB | ✅ Excellent |
| Low-End | 58-60fps | 2.0s | 90MB | ✅ Excellent |

**Status**: ✅ **Excellent performance across all devices** - No optimization needed

---

## 🎮 Key Features

### Control Documentation

**Keyboard Controls**:
- Movement (WASD, Arrow Keys)
- Combat actions (Space, Shift, Ctrl)
- Stance selection (1-8)
- System controls (Esc, F1, M)

**Mobile Controls**:
- Virtual D-pad
- Action buttons
- Touch gestures
- Stance selector

### Interactive Demonstrations

- Live control preview
- Visual feedback on input
- Technique execution examples
- Stance transition animations

---

## 🎨 Korean Theming

### Bilingual Control Labels

```typescript
"이동 | Movement - WASD"
"공격 | Attack - Space"
"방어 | Guard - Shift"
"급소격 모드 | Vital Point Mode - Ctrl"
"팔괘 선택 | Trigram Stance - 1-8"
```

### UI Colors

```typescript
PRIMARY_CYAN: 0x00e6e6       // Active controls
ACCENT_GOLD: 0xffc400        // Highlighted keys
TEXT_PRIMARY: 0xffffff       // Control labels
UI_BACKGROUND_DARK: 0x0a0a0a // Background
```

---

## 🧪 Testing Coverage

**Current Coverage**: ~90% (target: >85%)

### Test Scenarios

1. **Control Display**:
   - All controls shown
   - Bilingual labels correct
   - Layout responsive

2. **Interactive Demo**:
   - Demo activates properly
   - Input detection works
   - Visual feedback appears

3. **Navigation**:
   - Back to menu works
   - Section switching
   - Keyboard navigation

---

## ♿ Accessibility

### Keyboard Controls

- **Tab**: Navigate sections
- **Arrow Keys**: Scroll content
- **Enter**: Activate demo
- **Esc**: Return to menu

### Screen Reader Support

All control descriptions include `aria-label` attributes.

---

## 📚 Related Documentation

- [Screen Architecture Patterns](../../docs/SCREEN_ARCHITECTURE_PATTERNS.md)
- [Performance Baseline](../../docs/PERFORMANCE_BASELINE.md)
- [CONTROLS.md](../../CONTROLS.md)

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
