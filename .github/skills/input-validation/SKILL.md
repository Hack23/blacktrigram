---
name: input-validation
description: Enforces input validation at all system boundaries for Black Trigram — type, length, format, range checks; Zod/type guards; safe output encoding; aligned with OWASP A03:2021 and Hack23 Secure Development Policy §3.3
license: MIT
---

# 🛡️ Input Validation Skill

> **Strategic Principle**: Never trust input. Validate everything at system boundaries.

## 🎯 Purpose

Enforce input validation patterns for Black Trigram, preventing injection attacks, data corruption, and unexpected behavior through strict validation at all system boundaries.

**Reference**: [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) | [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

## Enforcement Rules

### Rule 1: User Input Validation
```
IF (accepting user input: form fields, URL params, keyboard events)
THEN (validate type, length, format, and range before processing)
ELSE (reject - unvalidated input is a security vulnerability)
```

### Rule 2: Data Boundary Validation
```
IF (data crossing system boundary: API response, localStorage, URL hash)
THEN (validate with Zod schema or type guard before use)
ELSE (corrupted data crashes the application)
```

### Rule 3: Output Encoding
```
IF (rendering user-provided content in HTML)
THEN (use React's built-in XSS protection, avoid dangerouslySetInnerHTML)
ELSE (XSS vulnerability - OWASP Top 10 A03:2021)
```

### Rule 4: Combat Data Validation
```
IF (combat input: damage values, vital point IDs, stance changes)
THEN (validate against known ranges and enums)
ELSE (game exploit through invalid combat data)
```

## Core Patterns

### Type Guards
```typescript
// ✅ Runtime type validation
function isValidStance(value: unknown): value is TrigramStance {
  return typeof value === 'string' &&
    ['geon', 'tae', 'li', 'jin', 'son', 'gam', 'gan', 'gon'].includes(value);
}

function isValidDamage(value: unknown): value is number {
  return typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 999;
}
```

### Schema Validation with Zod
```typescript
import { z } from 'zod';

const PlayerInputSchema = z.object({
  name: z.string().min(1).max(50).trim(),
  stance: z.enum(['geon', 'tae', 'li', 'jin', 'son', 'gam', 'gan', 'gon']),
  action: z.enum(['attack', 'defend', 'special', 'move']),
});

// Validate at boundary
const result = PlayerInputSchema.safeParse(rawInput);
if (!result.success) {
  console.warn('Invalid input:', result.error.issues);
  return;
}
const validInput = result.data;
```

### URL/Hash Validation
```typescript
// ✅ Validate URL parameters
function getScreenFromHash(hash: string): GameScreen {
  const screen = hash.replace('#', '');
  const validScreens = ['intro', 'combat', 'training', 'settings'] as const;
  return validScreens.includes(screen as typeof validScreens[number])
    ? (screen as GameScreen)
    : 'intro'; // Safe default
}
```

### LocalStorage Validation
```typescript
// ✅ Validate stored data
function loadGameState(): GameState | null {
  try {
    const raw = localStorage.getItem('blacktrigram_state');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return GameStateSchema.parse(parsed);
  } catch {
    console.warn('Invalid saved state, using defaults');
    return null;
  }
}
```

## OWASP Top 10 Mapping

| OWASP | Risk | Black Trigram Mitigation |
|-------|------|------------------------|
| A03:2021 Injection | XSS via game input | React auto-escaping, no dangerouslySetInnerHTML |
| A04:2021 Insecure Design | Invalid game state | Zod schemas, type guards |
| A08:2021 Software Integrity | Tampered data | Validation at all boundaries |

## Testing Requirements

- ✅ Unit tests for all type guards
- ✅ Boundary value testing (min, max, edge cases)
- ✅ Invalid input rejection tests
- ✅ XSS prevention verification
- ✅ Schema validation error handling

## Compliance

- **ISO 27001:2022**: A.8.26 (Application security requirements)
- **NIST CSF 2.0**: PR.DS-1 (Data-at-rest protection)
- **CIS Controls v8.1**: 16.6 (Use standard hardening configuration)
- **OWASP**: Top 10 2021 - A03 Injection
- **Hack23 ISMS**: Secure Development Policy - Input Validation

---

**흑괘의 검증** - _Validation of the Black Trigram_
