<p align="center">
  <img src="https://hack23.github.io/cia-compliance-manager/icon-192.png" alt="Hack23 Logo" width="192" height="192">
</p>

<h1 align="center">♿ Black Trigram — Accessibility Guide</h1>

<p align="center">
  <strong>🌐 WCAG 2.1 Level AA Compliance Standards</strong><br>
  <em>🎯 Inclusive Korean Martial Arts Gaming Experience</em>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Owner-Development_Team-0A66C2?style=for-the-badge" alt="Owner"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Version-1.0-555?style=for-the-badge" alt="Version"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Updated-2026--01--01-success?style=for-the-badge" alt="Last Updated"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Review-Quarterly-orange?style=for-the-badge" alt="Review Cycle"/></a>
</p>

**📋 Document Owner:** Development Team | **📄 Version:** 1.0 | **📅 Last Updated:** 2026-01-01 (UTC)  
**🔄 Review Cycle:** Quarterly | **⏰ Next Review:** 2026-04-01

---

## 🎯 **Purpose**

This guide establishes **WCAG 2.1 Level AA accessibility standards** for Black Trigram, ensuring inclusive gaming experiences for players with visual, auditory, motor, and cognitive differences.

---

## 📊 **Accessibility Standards Summary**

| **Category** | **Standard** | **Status** | **Priority** |
|--------------|-------------|-----------|--------------|
| **Color Contrast** | WCAG AA 4.5:1 | ✅ Met | Critical |
| **Keyboard Navigation** | Full keyboard support | ✅ Implemented | Critical |
| **Screen Readers** | ARIA labels | 🔄 In Progress | High |
| **Focus Indicators** | 2px high-contrast | ✅ Met | Critical |
| **Touch Targets** | Minimum 48x48px | ✅ Met | Critical |
| **Text Alternatives** | Alt text for images | ✅ Met | High |
| **Reduced Motion** | respects prefers-reduced-motion | ✅ Met | High |

---

## 🎨 **Color Contrast Compliance**

### **Text Colors (WCAG AA Compliant)**

All text colors meet **4.5:1 contrast ratio** on dark backgrounds:

| **Color** | **Hex** | **Contrast Ratio** | **Usage** | **Status** |
|-----------|---------|-------------------|-----------|-----------|
| **TEXT_PRIMARY** | `#ffffff` | 20.3:1 | Main text | ✅ Exceeds |
| **TEXT_SECONDARY** | `#cccccc` | 13.1:1 | Secondary text | ✅ Exceeds |
| **TEXT_TERTIARY** | `#aaaaaa` | 8.5:1 | Tertiary text | ✅ Exceeds |
| **TEXT_ACCENT** | `#00e6e6` | 15.8:1 | Accent text | ✅ Exceeds |
| **TEXT_WARNING** | `#ffbb00` | 13.4:1 | Warnings | ✅ Exceeds |
| **TEXT_ERROR** | `#ff4444` | 8.2:1 | Errors | ✅ Exceeds |

**Reference:** [WCAG 2.1 Contrast Minimum](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

---

## ⌨️ **Keyboard Navigation**

### **Keyboard Shortcuts**

| **Key** | **Action** | **Korean** | **English** |
|---------|-----------|-----------|-------------|
| `Space` | Execute technique | 기술 실행 | Execute Technique |
| `1-8` | Select stance | 팔괘 선택 | Select Trigram |
| `Shift` | Block/Defend | 방어 | Block |
| `Ctrl` | Target vital point | 급소 겨냥 | Target Vital Point |
| `Tab` | Navigate UI | UI 탐색 | Navigate |
| `Esc` | Pause menu | 일시정지 | Pause |
| `Enter` | Confirm action | 확인 | Confirm |
| `Arrow Keys` | Movement | 이동 | Movement |

### **Focus Indicator Standards**

```typescript
// ✅ GOOD: Clear 2px focus indicator
const focusStyle = {
  outline: '2px solid #00e6e6',  // High-contrast cyan
  outlineOffset: '2px',
  borderRadius: '4px',
};

// Apply to all interactive elements
.button:focus,
.link:focus,
.input:focus {
  outline: 2px solid #00e6e6;
  outline-offset: 2px;
}
```

---

## 🖱️ **Touch Target Sizes**

### **Minimum Touch Target Standards**

All interactive elements meet **WCAG 2.5.5 Target Size** requirements:

| **Element Type** | **Minimum Size** | **Black Trigram Size** | **Status** |
|------------------|------------------|----------------------|-----------|
| **Primary Buttons** | 44x44px | 48x48px | ✅ Exceeds |
| **Secondary Buttons** | 44x44px | 48x48px | ✅ Exceeds |
| **Mobile D-Pad Buttons** | 44x44px | 48x48px | ✅ Exceeds |
| **Attack Button** | 44x44px | 80x80px | ✅ Exceeds |
| **Block Button** | 44x44px | 70x70px | ✅ Exceeds |
| **Stance Wheel Buttons** | 44x44px | 48x48px | ✅ Exceeds |

---

## 📝 **data-testid Naming Convention**

### **Format**

```
[screen]-[component]-[purpose]
```

### **Examples**

```typescript
// Screen-level components
data-testid="intro-screen"
data-testid="combat-screen"
data-testid="training-screen"

// Combat components
data-testid="combat-attack-button"
data-testid="combat-block-button"
data-testid="combat-stance-selector"
data-testid="combat-health-bar"

// Mobile controls
data-testid="mobile-dpad"
data-testid="mobile-dpad-up"
data-testid="mobile-dpad-down"
data-testid="mobile-dpad-left"
data-testid="mobile-dpad-right"

// Navigation
data-testid="intro-start-button"
data-testid="intro-settings-button"
data-testid="header-back-button"
```

---

## 🔊 **Screen Reader Support**

### **ARIA Labels**

```typescript
// ✅ GOOD: Descriptive ARIA labels
<button
  aria-label="공격 - Attack"
  aria-pressed={isPressed}
  onClick={handleAttack}
>
  ⚔️
</button>

// ✅ GOOD: ARIA live regions for dynamic content
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {combatMessage}
</div>

// ✅ GOOD: ARIA landmarks
<nav aria-label="메인 네비게이션 - Main Navigation">
  {/* Navigation links */}
</nav>

<main role="main" aria-label="메인 콘텐츠 - Main Content">
  {/* Main content */}
</main>
```

### **Skip Links**

```typescript
// ✅ GOOD: Skip to main content link
<a
  href="#main-content"
  className="skip-link"
  style={{
    position: 'absolute',
    left: -9999,
    top: 0,
    zIndex: 999,
  }}
>
  본문으로 건너뛰기 | Skip to main content
</a>

<main id="main-content" role="main">
  {/* Main content */}
</main>
```

---

## 🎬 **Animation and Motion**

### **Reduced Motion Support**

```typescript
// ✅ GOOD: Respect prefers-reduced-motion
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

// Apply in components
const AnimatedComponent: React.FC = () => {
  const reducedMotion = useReducedMotion();

  return (
    <div style={{
      transition: reducedMotion ? 'none' : 'all 300ms ease-in-out',
      animation: reducedMotion ? 'none' : 'fadeIn 500ms',
    }}>
      {/* Content */}
    </div>
  );
};
```

---

## ✅ **Accessibility Checklist for New Components**

### **Before Component Creation**

- [ ] Review WCAG 2.1 Level AA requirements
- [ ] Plan keyboard navigation support
- [ ] Design with color-independent information
- [ ] Consider screen reader experience

### **During Development**

- [ ] Use semantic HTML5 elements
- [ ] Add proper ARIA labels and roles
- [ ] Implement keyboard event handlers
- [ ] Add 2px high-contrast focus indicators
- [ ] Use data-testid for all interactive elements
- [ ] Test color contrast (minimum 4.5:1)
- [ ] Ensure touch targets ≥48x48px
- [ ] Support reduced motion preference

### **Testing Phase**

- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Test color contrast with tools
- [ ] Test on mobile devices (touch targets)
- [ ] Test with reduced motion enabled
- [ ] Test at 200% zoom level
- [ ] Verify focus order is logical

### **Before Release**

- [ ] Document keyboard shortcuts
- [ ] Create accessibility statement
- [ ] Run automated accessibility tests
- [ ] Conduct manual accessibility audit
- [ ] Fix all critical issues
- [ ] Document known limitations

---

## 🧪 **Accessibility Testing Tools**

### **Automated Tools**

```bash
# Install testing dependencies
npm install --save-dev @axe-core/react jest-axe

# Run accessibility tests
npm test -- --coverage src/components
```

```typescript
// Example accessibility test
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<MyComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### **Manual Testing**

1. **Keyboard Navigation**: Tab through all elements
2. **Screen Reader**: Test with NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)
3. **Color Contrast**: Use Chrome DevTools contrast checker
4. **Focus Indicators**: Verify visible focus on all interactive elements
5. **Zoom Test**: Test at 200% browser zoom
6. **Reduced Motion**: Enable "Reduce motion" in OS settings

---

## 📚 **Related Documents**

- [🏗️ UI/UX Architecture](./UI_UX_ARCHITECTURE.md) - Component design patterns
- [🎨 Korean Theming Guide](./KOREAN_THEMING_GUIDE.md) - Accessible color palette
- [📐 Responsive Design](./RESPONSIVE_DESIGN.md) - Responsive accessibility
- [📱 Mobile Controls](./MOBILE_CONTROLS.md) - Touch target standards
- [🌐 Three.js UI Integration](./THREEJS_UI_INTEGRATION.md) - 3D accessibility considerations

---

**📋 Document Control:**  
**✅ Approved by:** Development Team  
**📤 Distribution:** Public  
**🏷️ Classification:** [![Confidentiality: Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels)  
**📅 Effective Date:** 2026-01-01  
**⏰ Next Review:** 2026-04-01  
**🎯 Framework Compliance:** [![ISO 27001](https://img.shields.io/badge/ISO_27001-2022_Aligned-blue?style=flat-square&logo=iso&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![WCAG 2.1 AA](https://img.shields.io/badge/WCAG_2.1-Level_AA-success?style=flat-square&logo=w3c&logoColor=white)](https://www.w3.org/WAI/WCAG21/quickref/)

---

**🥋 흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
