# ✨ Code Quality Excellence Skill

> **Strategic Principle**: High-quality code is reusable, type-safe, maintainable, and testable by design.

## 🎯 Purpose

Enforce code quality standards for Black Trigram, ensuring every line of code contributes to a maintainable, secure, and efficient codebase following Hack23 AB standards.

**Reference**: [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)

## Enforcement Rules

### Rule 1: Code Reusability
```
IF (creating new code)
THEN (search existing src/types/, src/utils/, src/components/ first)
ELSE (reject duplicate code - extend existing implementations)
```

### Rule 2: Strict TypeScript
```
IF (any TypeScript code)
THEN (no 'any' types, no type assertions without justification, readonly properties for interfaces)
ELSE (reject - type safety is non-negotiable)
```

### Rule 3: Function Complexity
```
IF (function cyclomatic complexity > 10 OR lines > 50)
THEN (refactor into smaller, focused functions)
ELSE (maintain single responsibility principle)
```

### Rule 4: Import Organization
```
IF (import statements in file)
THEN (organize: 1) React/Three.js 2) External libs 3) Internal modules 4) Types 5) Constants)
ELSE (maintain consistent import ordering)
```

### Rule 5: Error Handling
```
IF (operation can fail: async, DOM access, external data)
THEN (handle errors explicitly with try/catch or null coalescing)
ELSE (unhandled errors crash the game)
```

## Core Patterns

### Reusable Code Locations
```
src/types/          → Type definitions (constants.ts, common.ts)
src/utils/          → Utility functions
src/components/ui/  → Reusable UI components
src/systems/        → Game systems (combat, audio)
src/hooks/          → Custom React hooks
```

### Type Safety
```typescript
// ✅ GOOD: Strict types with readonly
export interface CombatResult {
  readonly damage: number;
  readonly stanceBonus: number;
  readonly vitalPointHit: boolean;
  readonly effects: readonly StatusEffect[];
}

// ❌ BAD: Loose types
interface CombatResult {
  damage: any;
  stanceBonus: number;
  vitalPointHit: boolean;
  effects: StatusEffect[];
}
```

### Null Safety
```typescript
// ✅ GOOD: Null coalescing
const playerName = player?.name ?? 'Unknown';
const damage = calculateDamage(attack) ?? 0;

// ❌ BAD: Truthy check (misses 0, '')
const damage = calculateDamage(attack) || 0;
```

### Function Design
```typescript
// ✅ GOOD: Small, focused, typed
export function calculateEffectiveDamage(
  baseDamage: number,
  stanceMultiplier: number,
  archetypeBonus: number,
): number {
  return Math.round(baseDamage * stanceMultiplier * (1 + archetypeBonus));
}

// ❌ BAD: Large function doing too many things
export function combat(attacker: any, defender: any) {
  // 100+ lines of mixed concerns
}
```

## Anti-Patterns

- ❌ `as any` type assertions
- ❌ Non-null assertions (`value!`) without justification
- ❌ `console.log` in production code (use proper logging)
- ❌ Magic numbers without named constants
- ❌ Mutable state where immutable works
- ❌ Deep nesting (>3 levels)
- ❌ Functions with >5 parameters (use options object)

## Quality Metrics

| Metric | Target | Tool |
|--------|--------|------|
| TypeScript errors | 0 | `npm run check` |
| ESLint warnings | 0 | `npm run lint` |
| Test coverage | >90% | `npm run coverage` |
| Unused code | 0 | `npm run find:unused` |
| License compliance | 100% | `npm run test:licenses` |

## Compliance

- **ISO 27001:2022**: A.8.25 (Secure development lifecycle)
- **NIST CSF 2.0**: PR.DS (Data Security)
- **CIS Controls v8.1**: 16 (Application Software Security)
- **Hack23 ISMS**: Secure Development Policy

---

**흑괘의 품질** - _Quality of the Black Trigram_
