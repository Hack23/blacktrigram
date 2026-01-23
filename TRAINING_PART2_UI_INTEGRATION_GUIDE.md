# Training Part 2: UI Component Integration Quick Reference

## Overview
This guide provides copy-paste examples for integrating BaseButton, BasePanel, and BaseText into the 4 HTML overlay components.

## Reference Implementation
**TrainingStatsOverlayHtml.tsx** - Use this as the gold standard for:
- React.memo with custom comparison
- KOREAN_COLORS usage
- Shared utility usage
- Korean typography
- Memoization patterns

## Pattern: Replace Custom Button with BaseButton

### Before (Custom Button)
```typescript
<button
  onClick={handleClick}
  style={{
    padding: "8px 12px",
    background: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.2),
    border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN)}`,
    color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY),
    fontFamily: FONT_FAMILY.KOREAN,
    cursor: "pointer",
  }}
>
  {korean} | {english}
</button>
```

### After (BaseButton)
```typescript
import { BaseButton } from "../../../shared/base";

<BaseButton
  korean={korean}
  english={english}
  onClick={handleClick}
  variant="primary"
  size="md"
  isMobile={isMobile}
  testId="your-button-id"
/>
```

## Pattern: Wrap with BasePanel

### Before (Custom Panel)
```typescript
<div
  style={{
    width: `${panelWidth}px`,
    padding: `${padding}px`,
    background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
    border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.9)}`,
    borderRadius: "12px",
  }}
>
  {children}
</div>
```

### After (BasePanel)
```typescript
import { BasePanel } from "../../../shared/base";

<BasePanel
  width={panelWidth}
  padding={padding}
  variant="bordered"
  isMobile={isMobile}
  ariaLabel="Your panel description"
  testId="your-panel-id"
>
  {children}
</BasePanel>
```

## Pattern: Korean Themed Text

### Before (Custom Styling)
```typescript
<div
  style={{
    fontSize: "16px",
    color: "#00ffff",
    fontFamily: FONT_FAMILY.KOREAN,
    textShadow: "0 0 10px #00ffff",
  }}
>
  {korean} | {english}
</div>
```

### After (Shared Utilities)
```typescript
import { hexToRgbaString } from "../../../../utils/colorUtils";
import { formatBilingualText } from "../../../../utils/koreanThemeHelpers";
import { getNeonTextShadow } from "../../../../utils/visualEffects";

<div
  style={{
    fontSize: "16px",
    color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN),
    fontFamily: FONT_FAMILY.KOREAN,
    textShadow: getNeonTextShadow(KOREAN_COLORS.PRIMARY_CYAN, "medium"),
  }}
>
  {formatBilingualText(korean, english, "pipe")}
</div>
```

## Complete Example: AnatomyControlsOverlayHtml Refactor

### Current Structure
```typescript
// Custom button implementation
<button onClick={...} style={{...}}> ... </button>
```

### Refactored with Shared Components
```typescript
import { BaseButton } from "../../../shared/base";
import { useKoreanTheme } from "../../../shared/base/useKoreanTheme";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import {
  formatBilingualText,
  getEnhancedKoreanOverlayStyles,
} from "../../../../utils/koreanThemeHelpers";

export const AnatomyControlsOverlayHtml: React.FC<Props> = ({
  visibleLayers,
  onLayerToggle,
  isMobile,
}) => {
  // Use Korean theme hook
  const { buttonSize, colors } = useKoreanTheme({
    size: "md",
    isMobile,
  });

  const panelStyle: React.CSSProperties = {
    ...getEnhancedKoreanOverlayStyles({
      opacity: 0.88,
      glowIntensity: "medium",
    }),
    width: isMobile ? 220 : 260,
    padding: buttonSize.padding,
  };

  return (
    <div style={panelStyle}>
      <div style={{ marginBottom: "12px" }}>
        <div style={{
          color: hexToRgbaString(colors.PRIMARY_CYAN),
          fontSize: isMobile ? "14px" : "16px",
          fontWeight: "bold",
        }}>
          {formatBilingualText("해부학 표시", "Anatomy Display", "pipe")}
        </div>
      </div>

      {LAYER_CONFIGS.map((config) => (
        <BaseButton
          key={config.id}
          korean={config.korean}
          english={config.english}
          onClick={() => onLayerToggle(config.id)}
          variant={visibleLayers.includes(config.id) ? "primary" : "secondary"}
          size="md"
          fullWidth
          isMobile={isMobile}
          testId={`anatomy-layer-${config.id}`}
        />
      ))}
    </div>
  );
};
```

## Korean Color Replacements

### Common Inline Colors to Replace
```typescript
// ❌ BEFORE - Inline hex strings
"#00ffff" // Cyan
"#ffd700" // Gold  
"#ffffff" // White
"#ff4444" // Red
"#00ff00" // Green

// ✅ AFTER - KOREAN_COLORS constants
hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN)
hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD)
hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY)
hexToRgbaString(KOREAN_COLORS.ACCENT_RED)
hexToRgbaString(KOREAN_COLORS.ACCENT_GREEN)
```

### Complete Color Map
```typescript
// Text colors
KOREAN_COLORS.TEXT_PRIMARY    // White text
KOREAN_COLORS.TEXT_SECONDARY  // Light gray
KOREAN_COLORS.TEXT_TERTIARY   // Medium gray

// Accent colors
KOREAN_COLORS.PRIMARY_CYAN    // Main cyan
KOREAN_COLORS.ACCENT_GOLD     // Main gold
KOREAN_COLORS.ACCENT_RED      // Danger/error
KOREAN_COLORS.ACCENT_GREEN    // Success
KOREAN_COLORS.ACCENT_BLUE     // Info

// Background colors
KOREAN_COLORS.UI_BACKGROUND_DARK    // Very dark panels
KOREAN_COLORS.UI_BACKGROUND_MEDIUM  // Medium dark
KOREAN_COLORS.UI_BACKGROUND_LIGHT   // Lighter panels
KOREAN_COLORS.UI_BORDER             // Border color
```

## Shared Utilities Reference

### Typography
```typescript
import {
  formatBilingualText,
  getResponsiveSpacing,
} from "../../../../utils/koreanThemeHelpers";

// Bilingual text formatting
formatBilingualText("한글", "English", "pipe")    // "한글 | English"
formatBilingualText("한글", "English", "dash")    // "한글 - English"
formatBilingualText("한글", "English", "parentheses") // "한글 (English)"

// Responsive spacing
const padding = getResponsiveSpacing("md", isMobile); // 12px mobile, 16px desktop
```

### Visual Effects
```typescript
import {
  getNeonTextShadow,
  getSmoothTransition,
  getNeonGlowEffect,
} from "../../../../utils/visualEffects";

// Neon text glow
textShadow: getNeonTextShadow(KOREAN_COLORS.PRIMARY_CYAN, "medium")

// Smooth transitions
transition: getSmoothTransition("all", "normal") // "all 0.2s ease"

// Box shadow glow
boxShadow: getNeonGlowEffect(KOREAN_COLORS.ACCENT_GOLD, "strong", true)
```

### Panel Styles
```typescript
import { getEnhancedKoreanOverlayStyles } from "../../../../utils/koreanThemeHelpers";

const panelStyle = getEnhancedKoreanOverlayStyles({
  opacity: 0.88,
  glowIntensity: "medium",
  includeGradient: false,
  includeBackdropBlur: true,
  depthLayers: 3,
});
```

## Component-Specific Refactoring Guide

### 1. AnatomyControlsOverlayHtml.tsx
**Changes**:
- Replace 4 custom layer buttons with BaseButton
- Use useKoreanTheme for sizing
- Apply getEnhancedKoreanOverlayStyles for panel

**Estimated Time**: 1 hour

### 2. FootworkDrillsOverlayHtml.tsx
**Changes**:
- Wrap entire component with BasePanel (optional - currently has custom structure)
- Replace drill selection grid buttons (7) with BaseButton
- Replace start/stop button with BaseButton
- Replace ALL inline hex colors with KOREAN_COLORS

**Estimated Time**: 1.5 hours

### 3. VitalPointTrainingOverlayHtml.tsx
**Changes**:
- Wrap with BasePanel
- Replace vital point selection buttons (4-8) with BaseButton
- Apply getNeonGlowEffect instead of custom boxShadow
- Use formatBilingualText for labels

**Estimated Time**: 1 hour

### 4. TrainingControlsOverlayHtml.tsx
**Changes**:
- Replace custom training button with BaseButton
- Keep custom status indicator (animated dot)
- Ensure consistent use of Korean utilities

**Estimated Time**: 0.5 hours

**Total Estimated Time**: 4 hours

## Testing After Refactoring

### Visual Regression Checklist
- [ ] Buttons render correctly
- [ ] Hover states work
- [ ] Click handlers fire
- [ ] Korean/English text displays
- [ ] Colors match KOREAN_COLORS palette
- [ ] Responsive sizing works
- [ ] Glow effects render

### Functional Testing
- [ ] Layer toggle works (AnatomyControls)
- [ ] Drill selection works (FootworkDrills)
- [ ] Vital point selection works (VitalPointTraining)
- [ ] Start/stop training works (TrainingControls)

### Accessibility Testing
- [ ] ARIA labels present
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatibility

## Common Pitfalls

### ❌ Forgetting to handle callbacks
```typescript
// BAD - inline arrow function
<BaseButton onClick={() => someAction()} />

// GOOD - useCallback for stable reference
const handleClick = useCallback(() => someAction(), []);
<BaseButton onClick={handleClick} />
```

### ❌ Not memoizing styles
```typescript
// BAD - recreates object every render
<div style={{ color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN) }}>

// GOOD - useMemo for stable reference
const textStyle = useMemo(() => ({
  color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN),
}), []);
<div style={textStyle}>
```

### ❌ Missing dependencies in React.memo
```typescript
// BAD - callbacks not in comparison
React.memo(Component, (prev, next) => 
  prev.value === next.value
);

// GOOD - include callbacks
React.memo(Component, (prev, next) => 
  prev.value === next.value &&
  prev.onClick === next.onClick
);
```

## Success Criteria

After refactoring, verify:
- ✅ All inline hex colors replaced with KOREAN_COLORS
- ✅ All buttons use BaseButton
- ✅ Panels use getEnhancedKoreanOverlayStyles
- ✅ Text uses formatBilingualText
- ✅ Effects use getNeonTextShadow/getNeonGlowEffect
- ✅ No visual regressions
- ✅ All functionality preserved
- ✅ Test coverage maintained/improved

## Resources

- **Reference**: `src/components/screens/training/components/TrainingStatsOverlayHtml.tsx`
- **BaseButton**: `src/components/shared/base/BaseButton.tsx`
- **BasePanel**: `src/components/shared/base/BasePanel.tsx`
- **useKoreanTheme**: `src/components/shared/base/useKoreanTheme.ts`
- **Colors**: `src/types/constants/colors.ts`
- **Utilities**: `src/utils/koreanThemeHelpers.ts`, `src/utils/visualEffects.ts`

---

**Start with AnatomyControlsOverlayHtml** - it's the simplest and will establish the pattern for the others.
