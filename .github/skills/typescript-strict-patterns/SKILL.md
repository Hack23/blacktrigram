---
name: typescript-strict-patterns
description: Enforces maximum TypeScript type safety for Black Trigram — strict mode, no 'any', readonly by default, exhaustive pattern matching, explicit return types for compile-time error detection
license: MIT
---

# 📐 TypeScript Strict Patterns Skill

> **Strategic Principle**: TypeScript's type system is your first line of defense. Use it to prevent bugs at compile time.

## 🎯 Purpose

Enforce strict TypeScript patterns for Black Trigram, ensuring maximum type safety, compile-time error detection, and maintainable code through TypeScript best practices.

**Reference**: [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)

## Enforcement Rules

### Rule 1: Strict Mode Compliance
```
IF (TypeScript code)
THEN (must compile with strict: true, no type errors, no suppressions)
ELSE (reject - strict mode catches real bugs)
```

### Rule 2: No 'any' Type
```
IF (variable, parameter, or return type is 'any')
THEN (replace with proper type, generic, or 'unknown' with type guard)
ELSE (reject - 'any' defeats the purpose of TypeScript)
```

### Rule 3: Readonly by Default
```
IF (interface property OR function parameter)
THEN (use 'readonly' unless mutation is required and justified)
ELSE (accidental mutation causes hard-to-find bugs)
```

### Rule 4: Exhaustive Pattern Matching
```
IF (switch/if-else over union type or enum)
THEN (handle all cases with exhaustive check using 'never')
ELSE (new enum values silently fall through)
```

### Rule 5: Explicit Return Types
```
IF (exported function)
THEN (declare explicit return type)
ELSE (inferred return types can change unexpectedly)
```

## Core Patterns

### Strict Configuration
```json
// tsconfig.json - must include
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true
  }
}
```

### Type Guards
```typescript
// ✅ GOOD: Proper type narrowing
function isTrigramStance(value: unknown): value is TrigramStance {
  return typeof value === 'string' &&
    (['geon', 'tae', 'li', 'jin', 'son', 'gam', 'gan', 'gon'] as const)
      .includes(value as TrigramStance);
}

// Usage
const stance: unknown = getStanceFromInput();
if (isTrigramStance(stance)) {
  // TypeScript knows stance is TrigramStance here
  applyStance(stance);
}
```

### Exhaustive Matching
```typescript
// ✅ Compile-time safety for union types
function getStanceColor(stance: TrigramStance): number {
  switch (stance) {
    case 'geon': return KOREAN_COLORS.ACCENT_GOLD;
    case 'tae': return KOREAN_COLORS.PRIMARY_CYAN;
    case 'li': return KOREAN_COLORS.CARDINAL_SOUTH;
    case 'jin': return KOREAN_COLORS.ACCENT_BLUE;
    case 'son': return KOREAN_COLORS.CARDINAL_EAST;
    case 'gam': return KOREAN_COLORS.PRIMARY_CYAN;
    case 'gan': return KOREAN_COLORS.CARDINAL_WEST;
    case 'gon': return KOREAN_COLORS.CARDINAL_CENTER;
    default: {
      const _exhaustive: never = stance;
      throw new Error(`Unknown stance: ${_exhaustive}`);
    }
  }
}
```

### Readonly Interfaces
```typescript
// ✅ Immutable by default
export interface VitalPoint {
  readonly id: string;
  readonly names: Readonly<BilingualText>;
  readonly position: Readonly<Position>;
  readonly category: VitalPointCategory;
  readonly baseDamage: number;
  readonly effects: readonly VitalPointEffect[];
}

// ✅ Readonly arrays
function processEffects(effects: readonly StatusEffect[]): void {
  // effects.push(...) ← compile error!
}
```

### Discriminated Unions
```typescript
// ✅ Type-safe state management
type CombatAction =
  | { readonly type: 'attack'; readonly targetId: string; readonly damage: number }
  | { readonly type: 'defend'; readonly blockStrength: number }
  | { readonly type: 'special'; readonly techniqueId: string; readonly kiCost: number }
  | { readonly type: 'move'; readonly direction: Vector2 };

function executeCombatAction(action: CombatAction): void {
  switch (action.type) {
    case 'attack':
      applyDamage(action.targetId, action.damage); // TypeScript knows the shape
      break;
    case 'defend':
      activateBlock(action.blockStrength);
      break;
    // ... exhaustive
  }
}
```

## Anti-Patterns

| ❌ Anti-Pattern | ✅ Correct Pattern |
|----------------|-------------------|
| `value as Type` | Type guard or generic |
| `value!` (non-null assertion) | Null check or optional chaining |
| `// @ts-ignore` | Fix the type error |
| `any` | `unknown` + type guard |
| `Function` | Specific function signature |
| `Object` | Record or specific interface |
| Mutable interface props | `readonly` properties |
| Implicit `any` in callbacks | Explicit parameter types |

## Testing Requirements

- ✅ `npm run check` passes with zero errors
- ✅ No `@ts-ignore` or `@ts-expect-error` without justification
- ✅ No `any` types in production code
- ✅ All exported functions have explicit return types
- ✅ Discriminated unions use exhaustive matching

## Compliance

- **ISO 27001:2022**: A.8.25 (Secure development lifecycle)
- **CWE-843**: Type Confusion prevention
- **Hack23 ISMS**: Secure Development Policy

---

**흑괘의 타입 안전성** - _Type Safety of the Black Trigram_
