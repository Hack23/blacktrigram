# ♿ Accessibility & WCAG Patterns Skill

> **Strategic Principle**: Accessible software is usable software. Build inclusive experiences that work for everyone, regardless of ability.

## 🎯 Purpose

Enforce WCAG 2.1 Level AA accessibility standards for Black Trigram, ensuring the game is usable by people with diverse abilities including those using assistive technologies.

**Reference**: [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)

## Enforcement Rules

### Rule 1: Semantic HTML in Html Overlays
```
IF (creating Html overlay component OR modifying UI)
THEN (use semantic HTML: <nav>, <main>, <button>, <label>, headings hierarchy)
ELSE (reject - div soup is not accessible)
```

### Rule 2: ARIA Attributes
```
IF (custom interactive component without native HTML equivalent)
THEN (add proper ARIA roles, labels, and states)
ELSE (use native HTML elements - first rule of ARIA)
```

### Rule 3: Keyboard Navigation
```
IF (interactive element in UI overlay)
THEN (ensure keyboard accessible: Tab, Enter, Escape, Arrow keys)
ELSE (reject - mouse-only interactions exclude keyboard users)
```

### Rule 4: Color Contrast
```
IF (text on background using KOREAN_COLORS)
THEN (verify WCAG AA contrast ratio: 4.5:1 normal text, 3:1 large text)
ELSE (adjust colors while maintaining Korean cyberpunk aesthetic)
```

### Rule 5: Screen Reader Support
```
IF (game state change OR combat action result)
THEN (announce via aria-live region with appropriate politeness)
ELSE (screen reader users miss critical game information)
```

## Core Patterns

### Accessible Html Overlay
```typescript
import { Html } from '@react-three/drei';

// ✅ GOOD: Accessible overlay
<Html fullscreen>
  <main role="application" aria-label="Black Trigram Combat">
    <nav aria-label="Combat controls">
      <button
        aria-label="공격 | Attack"
        aria-pressed={isAttacking}
        onClick={handleAttack}
        data-testid="attack-button"
      >
        공격 | Attack
      </button>
    </nav>
    <div role="status" aria-live="polite" aria-atomic="true">
      {combatMessage}
    </div>
  </main>
</Html>

// ❌ BAD: Inaccessible overlay
<Html fullscreen>
  <div onClick={handleAttack}>Attack</div>
  <div>{combatMessage}</div>
</Html>
```

### Focus Management
```typescript
// ✅ Focus trap for modal dialogs
const dialogRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  if (isOpen) dialogRef.current?.focus();
}, [isOpen]);

<div
  ref={dialogRef}
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  tabIndex={-1}
>
  <h2 id="dialog-title">일시정지 | Pause</h2>
</div>
```

### Korean Bilingual Accessibility
```typescript
// ✅ Bilingual accessible text
<span lang="ko">공격</span> | <span lang="en">Attack</span>

// ✅ Screen reader description for Korean terms
<abbr title="Hapkido - Korean martial art of joint locks and throws">
  합기도
</abbr>
```

## WCAG 2.1 AA Checklist

| Criterion | Requirement | Black Trigram Context |
|-----------|------------|----------------------|
| 1.1.1 Non-text Content | Alt text for images | 3D scene descriptions |
| 1.3.1 Info and Relationships | Semantic structure | Html overlay headings |
| 1.4.3 Contrast | 4.5:1 ratio | Korean color palette |
| 2.1.1 Keyboard | All functionality | Combat controls |
| 2.4.3 Focus Order | Logical tab order | UI overlay navigation |
| 3.1.2 Language of Parts | Lang attributes | Korean/English text |
| 4.1.2 Name, Role, Value | ARIA for custom widgets | Game UI components |

## Testing Requirements

- ✅ axe-core automated testing in Cypress E2E
- ✅ Keyboard-only navigation testing
- ✅ Screen reader testing (NVDA/VoiceOver)
- ✅ Color contrast verification for KOREAN_COLORS
- ✅ Focus management testing for modals/dialogs
- ✅ `data-testid` on all interactive elements

## Compliance

- **ISO 27001:2022**: A.8.26 (Application security requirements)
- **WCAG 2.1**: Level AA conformance
- **EN 301 549**: European accessibility standard
- **Hack23 ISMS**: Secure Development Policy - accessibility requirements

---

**흑괘의 접근성** - _Accessibility of the Black Trigram_
