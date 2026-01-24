# HUD Positioning Guide

**흑괘 (Black Trigram) - HUD 위치 지정 가이드**

## 📋 Overview

This guide defines the standardized positioning strategies for all HUD (Heads-Up Display) components in Black Trigram. Following these patterns ensures consistent, maintainable, and responsive UI layouts across all screens.

## 🎯 Core Principles

### 1. Screen-Level HUDs Use Absolute Positioning

**Pattern:** Anchor to screen edges using `position: "absolute"`

```tsx
// ✅ GOOD: Screen-level HUD (Left/Right/Top/Bottom)
<div
  style={{
    position: "absolute",
    left: 0,
    top: `${topOffset}px`,
    width: `${width * HUD_WIDTH_PERCENT.LEFT_DESKTOP}px`,
    height: `${availableHeight}px`,
    display: "flex",
    flexDirection: "column",
    // ... other styles
  }}
>
  {/* HUD content */}
</div>
```

**Why:**
- Anchored to screen edges regardless of parent container
- Predictable positioning across all screen sizes
- Clear separation between screen layout and content layout

**Examples:**
- `CombatLeftHUD.tsx` - Left side player stats
- `CombatRightHUD.tsx` - Right side AI/opponent stats
- `CombatTopHUD.tsx` - Top bar with timer and controls
- `CombatBottomHUD.tsx` - Bottom bar with technique selection

### 2. Internal Content Uses Relative Positioning + Flexbox

**Pattern:** Natural document flow with flexbox layouts

```tsx
// ✅ GOOD: Internal HUD content layout
<div
  style={{
    position: "absolute", // Screen-level HUD
    left: 0,
    top: 0,
    width: `${hudWidth}px`,
    height: "100%",
  }}
>
  {/* Use flexbox for internal layout */}
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      padding: "16px",
    }}
  >
    <PlayerInfo />
    <HealthBar />
    <Actions />
  </div>
</div>
```

**Why:**
- Natural document flow is easier to maintain
- Flexbox handles spacing and alignment automatically
- Changes to one element don't break others
- Responsive by default

**Examples:**
- Player stats sections in `CombatLeftHUD.tsx`
- Training controls in `TrainingLeftHUD.tsx`
- Button groups in top/bottom bars

### 3. Special Cases: Overlays and Tooltips

**Pattern:** Absolute positioning relative to parent for floating elements

```tsx
// ✅ GOOD: Overlay positioned relative to parent
<div style={{ position: "relative" }}>
  {/* Parent container */}
  <Button>Hover me</Button>

  {/* Tooltip positioned relative to button */}
  {showTooltip && (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginTop: "8px",
        zIndex: Z_INDEX.TOOLTIP,
      }}
    >
      Tooltip content
    </div>
  )}
</div>
```

**When to use:**
- Tooltips that appear on hover
- Dropdown menus
- Modal overlays
- Feedback messages that float above content

## 📐 Layout Constants

### HUD Width Percentages

Use `HUD_WIDTH_PERCENT` constants from `src/types/LayoutTypes.ts`:

```tsx
import { HUD_WIDTH_PERCENT } from "../../types/LayoutTypes";

// Left/Right HUDs
const hudWidth = isMobile
  ? width * HUD_WIDTH_PERCENT.LEFT_MOBILE    // 18%
  : width * HUD_WIDTH_PERCENT.LEFT_DESKTOP;  // 14%
```

**Standard widths:**
- **Desktop Left/Right:** 14% (leaves 72% for arena)
- **Mobile Left/Right:** 18% (larger touch targets)
- **Top/Bottom:** 100% (full width)

### HUD Height Constants

Use `HUD_HEIGHT` constants from `src/types/LayoutTypes.ts`:

```tsx
import { HUD_HEIGHT } from "../../types/LayoutTypes";

const hudHeight = isMobile
  ? HUD_HEIGHT.TOP_MOBILE                    // 50px
  : HUD_HEIGHT.TOP_DESKTOP * positionScale;  // 70px * scale
```

**Standard heights:**
- **Top bars:** 50-70px (slim, minimal obstruction)
- **Bottom bars:** 100-130px (fits technique cards + padding)

## 🎨 Z-Index Management

Use `Z_INDEX` constants from `src/types/LayoutTypes.ts`:

```tsx
import { Z_INDEX } from "../../types/LayoutTypes";

<div style={{ zIndex: Z_INDEX.HUD }}>
  {/* Main HUD content */}
</div>

<div style={{ zIndex: Z_INDEX.HUD_OVERLAY }}>
  {/* Overlay within HUD */}
</div>

<div style={{ zIndex: Z_INDEX.MODAL }}>
  {/* Modal dialog */}
</div>
```

**Layer hierarchy:**
```
Scene layers (0-30)
├─ BACKGROUND: 0
├─ ARENA: 10
├─ PLAYERS: 20
└─ EFFECTS: 30

HUD layers (40-99)
├─ HUD_BACKGROUND: 40
├─ HUD: 50
├─ TECHNIQUE_BAR: 55
└─ HUD_OVERLAY: 60

Top-level UI (100+)
├─ MOBILE_CONTROLS: 100
├─ MODAL: 200
├─ TOOLTIP: 300
├─ PAUSE_MENU: 1000
├─ LOADING: 2000
└─ DEBUG: 9000
```

**Rules:**
- ❌ NEVER use arbitrary numbers: `zIndex: 999`
- ✅ ALWAYS use constants: `zIndex: Z_INDEX.HUD`
- ✅ Use appropriate layer for component type

## 📱 Responsive Design

### Mobile vs Desktop

All HUD components must support responsive design:

```tsx
interface HUDProps {
  readonly width: number;
  readonly height: number;
  readonly isMobile: boolean;
  readonly positionScale: number;
}

// Responsive calculations
const layout = React.useMemo(() => {
  const hudWidth = isMobile
    ? width * HUD_WIDTH_PERCENT.LEFT_MOBILE
    : width * HUD_WIDTH_PERCENT.LEFT_DESKTOP;

  const padding = isMobile ? 8 : 12 * positionScale;
  const gap = isMobile ? 10 : 14 * positionScale;
  const fontSize = isMobile ? 12 : 14 * positionScale;

  return { hudWidth, padding, gap, fontSize };
}, [width, height, isMobile, positionScale]);
```

**Key considerations:**
- **Mobile:** Larger touch targets (18% width vs 14%)
- **Mobile:** Compact spacing to preserve screen space
- **4K displays:** Apply `positionScale` multiplier (1.0-1.5)

### Safe Area Insets

For mobile devices with notches:

```tsx
// Account for safe area insets
const topInset = env(safe-area-inset-top);
const bottomInset = env(safe-area-inset-bottom);

<div style={{
  paddingTop: `max(${padding}px, ${topInset})`,
  paddingBottom: `max(${padding}px, ${bottomInset})`,
}}>
  {/* Content */}
</div>
```

## ✅ Best Practices

### DO ✅

```tsx
// ✅ Use named constants
import { HUD_WIDTH_PERCENT, HUD_HEIGHT, Z_INDEX } from "../../types/LayoutTypes";

// ✅ Calculate responsive values
const hudWidth = width * HUD_WIDTH_PERCENT.LEFT_DESKTOP;
const hudHeight = HUD_HEIGHT.TOP_DESKTOP * positionScale;

// ✅ Use flexbox for internal layouts
<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
  <Component1 />
  <Component2 />
</div>

// ✅ Use position: absolute for screen-level HUDs
<div style={{ position: "absolute", left: 0, top: 0 }}>
  {/* Screen-level HUD */}
</div>

// ✅ Use Z_INDEX constants
<div style={{ zIndex: Z_INDEX.HUD }}>
  {/* HUD content */}
</div>
```

### DON'T ❌

```tsx
// ❌ Hardcoded magic numbers
const hudWidth = 168; // What does this mean?
const hudHeight = 80;

// ❌ Arbitrary z-index values
<div style={{ zIndex: 999 }}>

// ❌ Absolute positioning for internal content
<div style={{ position: "absolute", top: "10px", left: "10px" }}>
  <PlayerInfo />
</div>
<div style={{ position: "absolute", top: "80px", left: "10px" }}>
  <Actions />
</div>

// ❌ Non-responsive calculations
const hudWidth = width * 0.14; // Works, but use constant

// ❌ Mixing positioning strategies randomly
// Each component should have a clear, documented reason for its positioning
```

## 🔧 Component Examples

### Example 1: Combat Left HUD (Screen-Level)

```tsx
export const CombatLeftHUD: React.FC<Props> = ({
  width,
  height,
  isMobile,
  positionScale,
  // ... other props
}) => {
  const layout = React.useMemo(() => {
    const hudWidth = isMobile
      ? width * HUD_WIDTH_PERCENT.LEFT_MOBILE
      : width * HUD_WIDTH_PERCENT.LEFT_DESKTOP;

    const topOffset = isMobile
      ? HUD_HEIGHT.COMBAT_TOP_MOBILE
      : HUD_HEIGHT.COMBAT_TOP_DESKTOP * positionScale;

    const bottomOffset = isMobile
      ? HUD_HEIGHT.COMBAT_BOTTOM_MOBILE
      : HUD_HEIGHT.COMBAT_BOTTOM_DESKTOP * positionScale;

    const availableHeight = height - topOffset - bottomOffset;

    return { hudWidth, topOffset, availableHeight };
  }, [width, height, isMobile, positionScale]);

  return (
    <div
      style={{
        // Screen-level absolute positioning
        position: "absolute",
        left: 0,
        top: `${layout.topOffset}px`,
        width: `${layout.hudWidth}px`,
        height: `${layout.availableHeight}px`,
        
        // Internal layout uses flexbox
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "16px",
        
        // Styling
        zIndex: Z_INDEX.HUD,
        // ... other styles
      }}
    >
      {/* Internal content uses relative positioning */}
      <PlayerHUD player={player} />
      <HealthBar health={player.health} />
      <StaminaBar stamina={player.stamina} />
    </div>
  );
};
```

### Example 2: Player HUD (Internal Component)

```tsx
export const PlayerHUD: React.FC<Props> = ({ player, isMobile }) => {
  return (
    // Relative positioning within parent
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        // No absolute positioning!
      }}
    >
      <PlayerName name={player.name} />
      <PlayerArchetype archetype={player.archetype} />
      <PlayerStats stats={player.stats} />
    </div>
  );
};
```

### Example 3: Tooltip (Special Case)

```tsx
export const TooltipButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button>Hover me</button>

      {/* Tooltip positioned relative to button */}
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: "8px",
            zIndex: Z_INDEX.TOOLTIP,
            // ... tooltip styles
          }}
        >
          Tooltip content
        </div>
      )}
    </div>
  );
};
```

## 🧪 Testing Checklist

When implementing or refactoring HUD components:

- [ ] Uses appropriate positioning strategy (absolute for screen-level, relative for content)
- [ ] Uses constants from `LayoutTypes.ts` instead of magic numbers
- [ ] Responsive to `isMobile` prop
- [ ] Applies `positionScale` for 4K displays
- [ ] Uses `Z_INDEX` constants for layering
- [ ] Internal content uses flexbox or grid for layouts
- [ ] No hardcoded pixel offsets for internal elements
- [ ] Maintains visual output (no regressions)
- [ ] Passes all existing tests
- [ ] TypeScript compilation succeeds

## 📚 Related Files

**Core types and constants:**
- `src/types/LayoutTypes.ts` - Layout constants and interfaces

**HUD components:**
- `src/components/screens/combat/components/hud/CombatLeftHUD.tsx`
- `src/components/screens/combat/components/hud/CombatRightHUD.tsx`
- `src/components/screens/combat/components/hud/CombatTopHUD.tsx`
- `src/components/screens/combat/components/hud/CombatBottomHUD.tsx`
- `src/components/screens/training/components/hud/TrainingLeftHUD.tsx`
- `src/components/screens/training/components/hud/TrainingRightHUD.tsx`
- `src/components/screens/training/components/hud/TrainingTopHUD.tsx`
- `src/components/screens/training/components/hud/TrainingBottomHUD.tsx`

## 🎯 Summary

### Quick Reference

| Component Type | Positioning | Layout | Z-Index |
|---------------|-------------|--------|---------|
| **Screen-level HUDs** | `position: "absolute"` | Anchored to edges | `Z_INDEX.HUD` |
| **Internal content** | `position: "relative"` | Flexbox/Grid | Inherited |
| **Overlays/Tooltips** | `position: "absolute"` | Relative to parent | `Z_INDEX.TOOLTIP` |
| **Modals** | `position: "fixed"` | Centered | `Z_INDEX.MODAL` |

### Key Takeaways

1. **Screen-level HUDs** → Absolute positioning with edge anchoring
2. **Internal content** → Flexbox for layouts, avoid nested absolute positioning
3. **Use constants** → No magic numbers, use `HUD_WIDTH_PERCENT`, `HUD_HEIGHT`, `Z_INDEX`
4. **Responsive design** → Support `isMobile` and `positionScale`
5. **Consistent patterns** → Follow established patterns across all HUD components

---

**흑괘의 길을 걸어라** - *Walk the Path of the Black Trigram*
