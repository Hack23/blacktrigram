# Shared Component Library - Quick Start Recommendations

**Date:** 2026-01-22  
**Based on:** [Comprehensive Audit Report](./SHARED_COMPONENTS_AUDIT.md)  
**Priority:** Critical

---

## 🎯 Executive Summary

The comprehensive audit reveals **0% adoption** of our high-quality Base components (BaseButton, BasePanel, BaseText, useKoreanTheme) despite excellent test coverage (96.3%) and WCAG 2.1 AA compliance. This results in **35-40% code duplication** (~1,400-2,400 lines) across screen packages.

## 🔴 Critical Actions (Start Immediately)

### 1. Mandate useKoreanTheme Hook Usage
**Status:** ZERO adoption | **Impact:** 300-500 lines saved

**Current Problem:**
```typescript
// Repeated 150+ times across codebase
import { KOREAN_COLORS, FONT_FAMILY } from "../../types/constants";
const titleColor = hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD);
const textStyle = { fontFamily: FONT_FAMILY.KOREAN };
```

**Solution:**
```typescript
// Single import with all theming built-in
import { useKoreanTheme } from "@/components/shared/base";
const { colors, typography, buttonVariant } = useKoreanTheme({ variant: "primary" });
```

**Benefits:**
- ✅ Consistent Korean theming
- ✅ Korean typography optimization (line-height 1.6, letter-spacing)
- ✅ Responsive sizing helpers
- ✅ Accessibility features (focus indicators, touch targets)
- ✅ High contrast mode support

**Action Items:**
1. Add to ESLint rules: Warn on direct KOREAN_COLORS imports
2. Update component templates to include useKoreanTheme
3. Refactor one screen per sprint as template

### 2. Replace All Custom Buttons with BaseButton
**Status:** 10+ custom implementations | **Impact:** 500-800 lines saved

**Current Problem:**
```typescript
// NavigationButtons.tsx - 237 lines of custom button logic
<button
  style={{
    background: baseBackground,
    border: `2px solid ${borderColor}`,
    borderRadius: "8px",
    padding: buttonPadding,
    fontSize: buttonFontSize,
    fontFamily: FONT_FAMILY.KOREAN,
    // ... 20+ more style properties
  }}
  onMouseOver={handleHover}
  onMouseOut={handleHover}
>
  {text.korean} | {text.english}
</button>
```

**Solution:**
```typescript
// 4 lines with full accessibility
<BaseButton
  korean={text.korean}
  english={text.english}
  onClick={onClick}
  variant={isPrimary ? "primary" : "secondary"}
  size={isMobile ? "sm" : "md"}
  isMobile={isMobile}
/>
```

**Benefits:**
- ✅ WCAG 2.1 AA compliant (keyboard nav, ARIA labels)
- ✅ Consistent hover/focus states
- ✅ Korean typography optimization
- ✅ GPU acceleration support
- ✅ Responsive sizing

**Action Items:**
1. Document migration pattern in component README
2. Create before/after examples
3. Refactor high-traffic components first (NavigationButtons, MenuSection)

### 3. Standardize All Panels with BasePanel
**Status:** 20+ custom panel implementations | **Impact:** 200-400 lines saved

**Current Problem:**
```typescript
// Repeated 20+ times
<div style={{
  backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8),
  border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.5)}`,
  borderRadius: "8px",
  padding: isMobile ? "10px" : "20px",
  // ... more duplicate styles
}}>
  {content}
</div>
```

**Solution:**
```typescript
// 6 lines with accessibility
<BasePanel
  variant="bordered"
  padding={20}
  ariaRole="region"
  ariaLabel="Combat statistics panel"
  isMobile={isMobile}
>
  {content}
</BasePanel>
```

**Benefits:**
- ✅ Consistent panel styling
- ✅ Proper ARIA roles (region, article, navigation)
- ✅ Variant support (default, bordered, elevated)
- ✅ Reduced duplication

**Action Items:**
1. Map all panel variants to BasePanel props
2. Create visual style guide
3. Refactor panels screen-by-screen

---

## 📊 Quick Wins (Low Effort, High Impact)

### 4. Replace Bilingual Text Patterns with BaseText
**Effort:** 3 days | **Impact:** 100-200 lines

Find patterns like:
```typescript
<div>
  <span style={{ fontFamily: FONT_FAMILY.KOREAN }}>{korean}</span>
  <span> | </span>
  <span>{english}</span>
</div>
```

Replace with:
```typescript
<BaseText
  korean={korean}
  english={english}
  layout="horizontal"
  size="medium"
/>
```

### 5. Use Layout Utilities for Responsive Calculations
**Effort:** 2 days | **Impact:** 50-100 lines

Replace manual calculations:
```typescript
const fontSize = isMobile ? 14 : 18;
const padding = isMobile ? 10 : 20;
```

With utilities:
```typescript
import { getLayoutConstants } from "@/components/shared/base";
const layout = getLayoutConstants(isMobile);
```

---

## 🛠️ Implementation Guidance

### For New Features
1. **ALWAYS** start with shared components
2. Check `src/components/shared/` before building custom
3. Extend shared components, don't reinvent

### For Refactoring Existing Code
1. **Focus on high-traffic components first**
   - NavigationButtons (endscreen)
   - MenuSectionOverlayHtml (intro)
   - PauseMenu (combat)
2. **One screen at a time**
   - Take screenshots before/after
   - Run visual regression tests
   - QA review each screen
3. **Measure impact**
   - Track lines of code removed
   - Monitor performance (60fps target)
   - Verify accessibility compliance

### Quality Gates
1. **Code Review Checklist:**
   - [ ] Uses BaseButton instead of custom buttons
   - [ ] Uses BasePanel instead of custom divs
   - [ ] Uses useKoreanTheme hook for theming
   - [ ] Uses BaseText for bilingual content
   - [ ] Includes proper ARIA labels
   - [ ] Has test coverage >90%

2. **ESLint Rules to Add:**
   ```javascript
   // Warn on direct KOREAN_COLORS imports (use useKoreanTheme instead)
   "no-restricted-imports": ["warn", {
     "paths": [{
       "name": "../../types/constants",
       "importNames": ["KOREAN_COLORS", "FONT_FAMILY"],
       "message": "Use useKoreanTheme hook instead of direct imports"
     }]
   }]
   ```

---

## 📈 Expected ROI

### Code Reduction
| Phase | Lines Saved | Timeline |
|-------|-------------|----------|
| useKoreanTheme adoption | 300-500 | Week 1-2 |
| Button consolidation | 500-800 | Week 3-4 |
| Panel standardization | 200-400 | Week 5-6 |
| **Total** | **1,400-2,400 (14-24%)** | **6-8 weeks** |

### Quality Improvements
- ✅ 100% WCAG 2.1 AA compliance
- ✅ Consistent Korean theming
- ✅ Better keyboard navigation
- ✅ Improved screen reader support
- ✅ Optimized Korean typography

### Developer Experience
- ⚡ Faster feature development (reusable components)
- 📚 Easier onboarding for new developers
- 🧠 Reduced cognitive load (shared patterns)
- 📖 Better documentation

---

## 🚀 Getting Started

### Week 1-2: Foundation
1. Add useKoreanTheme to 2-3 components as examples
2. Document migration patterns
3. Create before/after comparison guide
4. Add ESLint rules

### Week 3-4: Button Consolidation
1. Refactor NavigationButtons (endscreen)
2. Refactor MenuSectionOverlayHtml (intro)
3. Update 5+ other button implementations
4. Verify accessibility with screen readers

### Week 5-6: Panel Standardization
1. Map all panel variants to BasePanel
2. Create visual style guide
3. Refactor panels in 2-3 screens
4. QA review and polish

### Week 7-8: Quick Wins
1. Replace bilingual text patterns
2. Use layout utilities
3. Extract color calculations
4. Final testing and documentation

---

## 📚 Resources

- **Comprehensive Audit:** [SHARED_COMPONENTS_AUDIT.md](./SHARED_COMPONENTS_AUDIT.md)
- **Base Components README:** [src/components/shared/base/README.md](../src/components/shared/base/README.md)
- **Three.js Components README:** [src/components/shared/three/README.md](../src/components/shared/three/README.md)
- **Component Usage Examples:** See BaseButton, BasePanel, BaseText tests

---

## ✅ Success Criteria

This effort will be considered successful when:

1. ✅ **Base component adoption:** 80%+ in screens (currently 0%)
2. ✅ **useKoreanTheme adoption:** 80%+ in screens (currently 0%)
3. ✅ **Code duplication:** <15% (down from 35-40%)
4. ✅ **Test coverage:** Maintained at 95%+
5. ✅ **Performance:** 60fps consistent on all screens
6. ✅ **Accessibility:** 100% WCAG 2.1 AA compliance

---

**Next Step:** Start with useKoreanTheme adoption in Week 1-2. Update one screen as a template for others to follow.

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
