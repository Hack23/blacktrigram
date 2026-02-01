# Gan (Mountain) Trigram - Immovable Defense Implementation Guide

## 🎯 Overview

This document describes the enhanced defensive mechanics for Gan (☶ 간괘 - Mountain) trigram techniques, implementing immovable defense with block timing, damage reduction, stability bonuses, and rooting effects.

## 📋 New Defensive Properties

All Gan techniques now include the following optional properties for defensive mechanics:

### `blockWindow` (milliseconds)
**Korean:** 막기 타이밍 창

The time window during which a block can successfully defend against an incoming attack.

**Range:** 200-350ms
- **Tight window (200-250ms):** Counter-attacks requiring precise timing
- **Standard window (280-300ms):** Normal blocks
- **Wide window (350ms):** Defensive stances with extended protection

**Example Usage:**
```typescript
{
  id: "gan_rock_defense",
  blockWindow: 300, // 300ms window to execute block
  // ... other properties
}
```

### `perfectBlockWindow` (milliseconds)
**Korean:** 완벽막기 타이밍 창

A tighter window within the blockWindow for executing a perfect block with enhanced effects.

**Range:** 60-100ms
- **Very tight (60-70ms):** Advanced techniques requiring expert timing
- **Tight (75-80ms):** Standard perfect block window
- **Generous (100ms):** Defensive stances with easier perfect blocks

**Visual Effects for Perfect Block:**
- Stone/rock particle burst
- Mountain silhouette effect
- Enhanced damage reduction feedback
- Ground shaking/impact effect

### `damageReduction` (multiplier, 0.0-1.0)
**Korean:** 데미지 감소 배율

Percentage of damage absorbed when successfully blocking.

**Range:** 0.5-0.75
- **0.5 (50%):** Counter-focused techniques (30% damage taken)
- **0.6-0.65 (60-65%):** Standard blocks (35-40% damage taken)
- **0.7 (70%):** Strong blocks (30% damage taken)
- **0.75 (75%):** Maximum defense stance (25% damage taken)

**Calculation:**
```typescript
const damageAfterBlock = incomingDamage * (1 - technique.damageReduction);
// Example: 100 damage × (1 - 0.7) = 30 damage taken
```

### `stabilityBonus` (multiplier)
**Korean:** 안정성 보너스

Multiplier applied to stability/fortitude when in defensive stance.

**Range:** 1.2-1.8
- **1.2-1.3 (120-130%):** Counter-attacks with mobility
- **1.4-1.5 (140-150%):** Standard defensive stances
- **1.6 (160%):** Grappling control positions
- **1.8 (180%):** Maximum immovable stance

**Visual Representation:**
- Stability meter showing defensive fortitude
- Increased resistance to knockback
- Reduced vulnerability to breaking
- Mountain-like immovable appearance

### `rootingEffect` (boolean)
**Korean:** 뿌리내림 효과

When `true`, indicates the technique creates a rooted, grounded stance with visible ground connection.

**Visual Effects:**
- Ground cracks/earth fissures from feet
- Dust particles settling around stance
- Character model slightly lowered/grounded
- Stone/earth particles at contact points
- Root-like energy effects

**When to Use:**
- ✓ All BLOCK type techniques
- ✓ Defensive stances
- ✓ Grappling control positions
- ✗ Counter-attacks requiring mobility

## 🎮 Gan Technique Configuration

| Technique ID | Block Window | Perfect Window | Damage Reduction | Stability | Rooting |
|-------------|--------------|----------------|------------------|-----------|---------|
| `gan_rock_defense` | 300ms | 80ms | 65% | 130% | ✓ |
| `gan_immovable_stance` | 350ms | 100ms | **75%** (max) | **180%** (max) | ✓ |
| `gan_iron_block` | 280ms | 70ms | 70% | 150% | ✓ |
| `gan_counter_strike` | 200ms | 60ms | 50% | 120% | ✗ |
| `gan_reversal_technique` | 250ms | 75ms | 55% | 140% | ✓ |
| `gan_mountain_stance_lock` | 220ms | 65ms | 60% | 160% | ✓ |

## 🎨 UI/Visual Implementation Guide

### Block Timing Window Indicators

**Display Requirements:**
1. Show incoming attack trajectory/warning
2. Display block timing window as visual bar or circle
3. Highlight perfect block window within
4. Real-time feedback on block success/failure

**Example Implementation:**
```typescript
interface BlockTimingIndicator {
  totalWindow: number; // blockWindow
  perfectWindow: number; // perfectBlockWindow
  remainingTime: number; // Current countdown
  isPerfectBlockActive: boolean;
}

// Visual states
if (withinPerfectWindow) {
  // Show gold/bright cyan highlight
  color = KOREAN_COLORS.ACCENT_GOLD;
} else if (withinBlockWindow) {
  // Show standard cyan indicator
  color = KOREAN_COLORS.PRIMARY_CYAN;
} else {
  // Show red/warning indicator
  color = KOREAN_COLORS.CARDINAL_SOUTH;
}
```

### Stability Meter

**Display as:**
- Bar gauge showing current stability
- Mountain icon with fill level
- Numerical percentage (optional)
- Color-coded by stability level:
  - Green/Cyan: High stability (>150%)
  - Yellow: Medium stability (120-150%)
  - Red: Low stability (<120%)

### Damage Absorption Visualization

**On Successful Block:**
1. Show incoming damage number in red
2. Show reduced damage number in cyan/gold
3. Display absorption percentage
4. Visual shield/barrier effect

**Example:**
```
Incoming: -100 HP (red)
Absorbed: -70 HP (barrier effect)
Taken: -30 HP (cyan, smaller)
```

### Rooting Effect Visualization

**3D Scene Effects:**
```typescript
if (technique.rootingEffect) {
  // Ground connection
  - Render earth cracks from feet (radial pattern)
  - Spawn stone/rock particles at stance points
  - Add ground impact dust cloud
  - Lower character stance slightly (visual weight)
  
  // Perfect block enhancement
  if (perfectBlock) {
    - Larger earth crack pattern
    - Mountain silhouette behind character
    - Stone burst particles (30-50 particles)
    - Ground shake camera effect
  }
}
```

### Korean Aesthetic Requirements

**Color Palette:**
- Primary: `KOREAN_COLORS.PRIMARY_CYAN` (#00FFFF)
- Accent: `KOREAN_COLORS.ACCENT_GOLD` (#FFAA00)
- Earth/Stone: `KOREAN_COLORS.UI_BACKGROUND_MEDIUM` (#2D2D2D)
- Success: `KOREAN_COLORS.CARDINAL_EAST` (#00FF88)

**Font:**
- Use `FONT_FAMILY.KOREAN` for all text
- Always show Korean/English bilingual text

## 🔊 Audio Recommendations

### Sound Effects by Action

**Block Success:**
- Heavy stone impact sound
- Deep resonant tone
- Earth rumble (low frequency)

**Perfect Block:**
- Crystalline chime overlay
- Enhanced stone impact
- Mountain echo effect

**Rooting Effect:**
- Earth cracking/settling sound
- Stone grinding
- Subtle rumble bass

**Damage Absorption:**
- Barrier/shield impact
- Reduced hit sound (muffled)
- Success chime for high absorption

## 🧪 Testing Defensive Mechanics

**Test Scenarios:**

1. **Block Timing Accuracy:**
   - Verify blockWindow duration matches specification
   - Validate perfectBlockWindow is subset of blockWindow
   - Test edge cases (frame-perfect timing)

2. **Damage Reduction:**
   - Calculate damage before block
   - Apply damageReduction multiplier
   - Verify final damage matches formula
   - Test with various damage values

3. **Stability System:**
   - Track stability without bonus
   - Apply stabilityBonus multiplier
   - Verify stability affects knockback resistance
   - Test stability meter display

4. **Rooting Visualization:**
   - Check rootingEffect flag
   - Render ground connection effects
   - Verify perfect block enhancements
   - Test performance impact (60fps target)

## 📊 Performance Considerations

**60fps Target:**
- Earth particle effects: Max 50 particles per block
- Ground crack geometry: Simple line/quad primitives
- Reuse particle pools (don't create/destroy each time)
- Use instanced rendering for stone particles

**Memory Management:**
- Pre-load stone/earth textures
- Cache particle geometries
- Clean up effects after animation completes

## 🌍 Bilingual Terminology

| English | Korean | Romanization |
|---------|--------|--------------|
| Block | 막기 | makgi |
| Defense | 방어 | bangeo |
| Mountain | 산 | san |
| Immovable | 부동 | budong |
| Stability | 안정성 | anjeonseong |
| Rooting | 뿌리내림 | ppurinaerim |
| Perfect Block | 완벽막기 | wanbyeokmakgi |
| Damage Reduction | 데미지 감소 | damiji gamso |

## 🎯 Implementation Checklist

For UI/Animation Teams:

- [ ] Block timing window indicator system
- [ ] Perfect block window highlight
- [ ] Stability meter/gauge display
- [ ] Damage absorption visualization
- [ ] Rooting ground connection effects
- [ ] Stone/earth particle system
- [ ] Mountain silhouette effect (perfect block)
- [ ] Korean/English bilingual text
- [ ] Audio integration for all defensive actions
- [ ] Performance optimization (60fps target)
- [ ] Training mode with defensive timing practice

## 📚 References

- **Type Definitions:** `src/systems/vitalpoint/types.ts`
- **Technique Data:** `src/systems/trigram/techniques/GanTechniques.ts`
- **Tests:** `src/systems/trigram/techniques/GanTechniques.test.ts`
- **Issue:** [#1521 - Improve Gan (Mountain) Trigram Techniques](https://github.com/Hack23/blacktrigram/issues/1521)

## 🥋 Philosophy

**간괘 (Gan - Mountain):**
> "산처럼 굳건히 서서 때를 기다려라"
> 
> "Stand firm like a mountain and wait for the moment"

The defensive mechanics embody this philosophy through:
- **Immovable stance** - High stability and rooting
- **Patient defense** - Precise block timing windows
- **Rock-solid protection** - Strong damage reduction
- **Mountain-like fortitude** - Sustained defensive capability
