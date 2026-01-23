# 🎯 Training Screen Package

**Package**: `src/components/screens/training/`  
**Main Component**: `TrainingScreen3D.tsx`  
**Complexity**: High (20+ components)  
**Performance Target**: 60fps desktop, 55fps mobile

---

## 📋 Overview

The Training Screen provides a practice environment for mastering Korean martial arts techniques:
- Interactive training dummy for technique practice
- Technique execution and feedback
- Progress tracking and statistics
- Step-by-step technique breakdowns

---

## 🏗️ Component Structure

```plaintext
training/
├── TrainingScreen3D.tsx            # Main screen component
├── TrainingScreen3D.test.tsx       # Screen tests
├── components/
│   ├── ui/
│   │   ├── TrainingStatsOverlayHtml.tsx    # Stats display
│   │   └── TechniqueSelectOverlayHtml.tsx  # Technique selection
│   ├── three/
│   │   ├── TrainingDummy3D.tsx     # 3D training target
│   │   └── ImpactEffect3D.tsx      # Visual feedback
│   └── feedback/
│       └── TechniqueGuide.tsx      # Step-by-step guide
└── README.md                        # This file
```

---

## ⚡ Performance Characteristics

### Current Performance (January 2026)

| Device | FPS | Load Time | Memory | Status |
|--------|-----|-----------|--------|---------|
| Desktop | 60fps | 1.5s | 380MB | ✅ Excellent |
| Tablet | 55-57fps | 2.0s | 240MB | ✅ Good |
| Mobile | 50-53fps | 2.8s | 170MB | ⚠️ Near target |
| Low-End | 48-50fps | 3.5s | 130MB | ✅ Good |

### Known Bottlenecks

1. **Animation System**: Complex technique animations impact mobile
2. **Physics Calculations**: Collision detection overhead for dummy interactions

### Optimization Priorities (Q1 2026)

- 🟡 **Medium**: Simplify training dummy model (reduce polygon count)
- 🟡 **Medium**: Cache frequent technique animations
- 🟢 **Low**: Optimize collision detection (use bounding boxes)

---

## 🎮 Key Features

### Training Systems

**Training Modes**:
- Technique practice (individual moves)
- Combo training (technique sequences)
- Vital point precision training
- Speed and timing drills

**Training Dummy**:
- 3D interactive target
- Anatomical zones for vital point targeting
- Visual feedback on strike accuracy
- Damage visualization

**Progress Tracking**:
- Technique mastery levels
- Accuracy statistics
- Speed metrics
- Vital point hit rate

### UI Components (Html Overlays)

**Training Stats**:
- Current technique name (bilingual)
- Accuracy percentage
- Speed rating
- Combo counter

**Technique Selection**:
- Technique list by category
- Difficulty ratings
- Requirements display
- Preview demonstrations

---

## 🎨 Korean Theming

### Bilingual Display

All technique names displayed in Korean and English:

```typescript
"정권지르기 | Straight Punch"
"돌려차기 | Roundhouse Kick"
"급소격 | Vital Point Strike"
```

### Training UI Colors

```typescript
// Success feedback
POSITIVE_GREEN: 0x00ff00      // Successful execution
PERFECT_STRIKE: 0xffc400      // Perfect technique

// Instruction colors
TEXT_PRIMARY: 0xffffff        // Main instructions
TEXT_SECONDARY: 0xcccccc      // Additional guidance
ACCENT_GOLD: 0xffc400         // Emphasis
```

---

## 🧪 Testing Coverage

**Current Coverage**: ~75% (target: >85%)

### Test Scenarios

1. **Training Mode Selection**:
   - Mode switching
   - Technique selection
   - Difficulty adjustment

2. **Technique Execution**:
   - Input validation
   - Animation playback
   - Feedback display

3. **Progress Tracking**:
   - Statistics updates
   - Accuracy calculations
   - Mastery level progression

4. **Performance**:
   - Frame rate with animations
   - Memory usage during practice
   - Resource cleanup

---

## ♿ Accessibility

### Keyboard Controls

- **Enter**: Start/execute technique
- **Space**: Pause/resume
- **Arrow Keys**: Navigate technique list
- **1-8**: Quick-select techniques
- **Esc**: Return to menu

---

## 📚 Related Documentation

- [Screen Architecture Patterns](../../docs/SCREEN_ARCHITECTURE_PATTERNS.md)
- [Performance Baseline](../../docs/PERFORMANCE_BASELINE.md)
- [Overall Architecture](../../ARCHITECTURE.md)

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
