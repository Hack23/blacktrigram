# 📝 Documentation Standards Skill

> **Strategic Principle**: Great documentation is as important as great code. Document for clarity, maintainability, and knowledge transfer.

## 🎯 Purpose

Enforce consistent documentation standards across Black Trigram, ensuring code, APIs, architecture, and user guides are well-documented with bilingual Korean-English support.

**Reference**: [Hack23 ISMS Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)

## Enforcement Rules

### Rule 1: JSDoc/TSDoc for Public APIs
```
IF (exported function, class, interface, or type)
THEN (add JSDoc with @param, @returns, @throws, @example)
ELSE (reject - undocumented public APIs impede maintainability)
```

### Rule 2: Architecture Documentation
```
IF (modifying component structure OR data models OR system design)
THEN (update relevant C4 architecture documents: ARCHITECTURE.md, DATA_MODEL.md, etc.)
ELSE (documentation drift - refer to c4-architecture-documentation skill)
```

### Rule 3: Bilingual Documentation
```
IF (user-facing text OR Korean martial arts terminology)
THEN (provide both Korean and English with romanization where applicable)
ELSE (incomplete documentation for international audience)
```

### Rule 4: Security Documentation
```
IF (security-related change OR authentication/authorization)
THEN (update SECURITY_ARCHITECTURE.md AND add ISMS policy references)
ELSE (security documentation gap - refer to security-architecture-validation skill)
```

## Core Patterns

### JSDoc Format
```typescript
/**
 * Calculates damage multiplier based on trigram stance alignment.
 *
 * Uses the Eight Trigram (팔괘) opposition system to determine
 * effectiveness of attacks between different stances.
 *
 * @param attackerStance - The attacker's current trigram stance
 * @param defenderStance - The defender's current trigram stance
 * @returns Damage multiplier between 0.5 (disadvantage) and 2.0 (advantage)
 *
 * @example
 * ```typescript
 * const multiplier = calculateStanceMultiplier('geon', 'gon');
 * // Returns: 1.5 (Heaven vs Earth advantage)
 * ```
 *
 * @see {@link TrigramStance} for valid stance values
 */
export function calculateStanceMultiplier(
  attackerStance: TrigramStance,
  defenderStance: TrigramStance,
): number { /* ... */ }
```

### Interface Documentation
```typescript
/**
 * Represents a vital point (급소) target in the combat system.
 *
 * @property names - Bilingual names (Korean, English, romanized)
 * @property position - 2D coordinates on the character model
 * @property category - Anatomical category (neurological, cardiovascular, etc.)
 * @property severity - Impact severity level
 */
export interface VitalPoint {
  readonly id: string;
  readonly names: BilingualText;
  readonly position: Position;
  readonly category: VitalPointCategory;
  readonly severity: VitalPointSeverity;
}
```

### Component Documentation
```typescript
/**
 * CombatHUD displays the heads-up display during combat.
 *
 * Renders player health, ki energy, stance indicator, and
 * combat log using Html overlays over the Three.js scene.
 *
 * @remarks
 * Uses KOREAN_COLORS for consistent cyberpunk Korean aesthetic.
 * All text is bilingual (Korean | English).
 *
 * @example
 * ```tsx
 * <CombatHUD
 *   player={playerState}
 *   width={1200}
 *   height={800}
 *   isMobile={false}
 * />
 * ```
 */
```

## Required Architecture Documents

| Document | Purpose | Update When |
|----------|---------|-------------|
| `ARCHITECTURE.md` | C4 models (Context, Container, Component) | Structure changes |
| `DATA_MODEL.md` | Data structures and relationships | Type changes |
| `FLOWCHART.md` | Business process and data flows | Flow changes |
| `STATEDIAGRAM.md` | System state transitions | State changes |
| `MINDMAP.md` | Conceptual relationships | Concept changes |
| `SWOT.md` | Strategic analysis | Strategy changes |
| `SECURITY_ARCHITECTURE.md` | Security design and controls | Security changes |
| `FUTURE_*.md` | Planned improvements and roadmap | Planning changes |

## Testing Requirements

- ✅ TypeDoc generates without errors (`npm run docs`)
- ✅ All public APIs have JSDoc comments
- ✅ Architecture documents are consistent with code
- ✅ Korean terminology includes romanization
- ✅ README.md is current and accurate

## Compliance

- **ISO 27001:2022**: A.5.37 (Documented operating procedures)
- **NIST CSF 2.0**: GV.PO (Policy), ID.AM (Asset Management)
- **Hack23 ISMS**: Information Security Policy, Secure Development Policy

---

**흑괘의 문서화** - _Documentation of the Black Trigram_
