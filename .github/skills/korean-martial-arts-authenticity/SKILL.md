---
name: korean-martial-arts-authenticity
description: |
  Enforces authentic Korean martial arts systems (Hapkido, Taekwondo, Taekyon, Kuk Sool Won,
  Tang Soo Do, Hwa Rang Do, Gumdo, Ssireum, Subak, Yudo, Gongkwon Yusul) with Eight Trigram
  stances, 70 vital points, Dark Ops combat applications, special forces integration, cultural
  respect, anatomical precision, and realistic combat mechanics for Black Trigram.
license: MIT
---

# Korean Martial Arts Authenticity Skill

## Purpose

This skill ensures that all Korean martial arts content in Black Trigram is authentic, culturally respectful, anatomically accurate, and properly implements traditional systems like the Eight Trigrams (팔괘), 70 vital points (급소), and Korean martial arts techniques from Hapkido, Taekwondo, and Taekyon.

## When to Apply

**Automatically trigger this skill when:**
- Implementing Eight Trigram stance system (팔괘)
- Adding vital point targeting (급소)
- Creating combat techniques or special moves
- Writing Korean martial arts terminology (any of 11 arts)
- Implementing damage calculations based on anatomy
- Creating character archetypes with martial arts backgrounds
- Adding martial arts animations or movements
- Designing combat mechanics or strike systems
- Translating martial arts concepts
- Reviewing combat balance and realism
- Implementing Dark Ops special forces techniques
- Adding tactical combat applications
- Integrating equipment-enhanced martial arts
- Creating special operations units or missions
- Implementing silent kill or suppression mechanics

## Core Principles

### 1. Eight Trigram System (팔괘 체계) Accuracy

**ALWAYS use the correct trigram associations:**

✅ **Authentic Eight Trigram Implementation**
```typescript
export const EIGHT_TRIGRAMS = {
  GEON: {
    symbol: '☰',
    korean: '건',
    english: 'Heaven',
    element: 'Metal',
    direction: 'Northwest',
    attributes: ['Direct Force', 'Strength', 'Creativity'],
    combatStyle: 'Overwhelming power and direct strikes',
// ... (see full reference in Hack23 ISMS)
```

❌ **Anti-Pattern: Incorrect Trigram Associations**
```typescript
// BAD: Wrong symbols or meanings
const TRIGRAMS = {
  GEON: { symbol: '☱', korean: '간' }, // ❌ Wrong symbol and name
  // Mixing up trigram attributes undermines authenticity
};
```

### 2. 70 Vital Points (급소 七十穴) Precision

**ALWAYS use anatomically accurate vital point locations:**

✅ **Authentic Vital Point System**
```typescript
export interface VitalPoint {
  readonly id: string;
  readonly koreanName: string;
  readonly englishName: string;
  readonly anatomicalLocation: string;
  readonly category: 'head' | 'neck' | 'torso' | 'arms' | 'legs';
  readonly severity: 'instant' | 'severe' | 'moderate' | 'minor';
  readonly strikeTypes: readonly StrikeType[];
  readonly effectiveStances: readonly TrigramStance[];
// ... (see full reference in Hack23 ISMS)
```

❌ **Anti-Pattern: Vague or Inaccurate Vital Points**
```typescript
// BAD: No anatomical precision
const vitalPoints = {
  head: 100,  // ❌ Where on head?
  body: 75,   // ❌ Body has many vital points
  arm: 25,    // ❌ Not anatomically specific
};
```

### 3. Korean Martial Arts Terminology Accuracy

**ALWAYS use proper Korean terminology with correct Romanization:**

✅ **Proper Terminology and Translations**
```typescript
export const KOREAN_TERMINOLOGY = {
  // Basic Concepts
  MARTIAL_ART: { korean: '무술', romanization: 'Musul', english: 'Martial Art' },
  TECHNIQUE: { korean: '기술', romanization: 'Gisul', english: 'Technique' },
  STANCE: { korean: '자세', romanization: 'Jase', english: 'Stance' },
  VITAL_POINT: { korean: '급소', romanization: 'Geupso', english: 'Vital Point' },
  
  // Hapkido (합기도) Terms
  WRIST_LOCK: { korean: '손목꺾기', romanization: 'Sonmok-kkeokgi', english: 'Wrist Lock' },
// ... (see full reference in Hack23 ISMS)
```

❌ **Anti-Pattern: Incorrect or Mixed Terminology**
```typescript
// BAD: Wrong romanization or mixing styles
const terminology = {
  hapkido: 'Hapgido',      // ❌ Wrong romanization (should be Hapkido)
  geupso: 'Guepso',        // ❌ Wrong romanization (should be Geupso)
  taekwondo: 'Tae Kwon Do', // ❌ Inconsistent spacing
};
```

### 4. Cultural Respect and Context

**ALWAYS provide proper cultural context:**

✅ **Respectful Implementation with Context**
```typescript
export const CULTURAL_CONTEXT = {
  EIGHT_TRIGRAMS: {
    origin: 'I Ching (易經) / Yijing - Ancient Chinese divination text',
    koreanAdoption: 'Integrated into Korean philosophy and martial arts',
    meaning: 'Represents fundamental forces of nature and combat principles',
    respect: 'Used with understanding of philosophical depth, not just symbols',
  },
  
  VITAL_POINTS: {
// ... (see full reference in Hack23 ISMS)
```

❌ **Anti-Pattern: Superficial or Disrespectful Use**
```typescript
// BAD: No cultural context or respect
const trigrams = ['random', 'symbol', 'for', 'decoration']; // ❌
const vitalPoints = ['mystery', 'chakra', 'points']; // ❌ Mixing concepts
```

### 5. Comprehensive Korean Martial Arts Coverage

**ALWAYS implement all major Korean martial arts with authentic techniques:**

✅ **Complete Korean Martial Arts System**
```typescript
export const KOREAN_MARTIAL_ARTS = {
  // Traditional Arts
  HAPKIDO: {
    korean: '합기도',
    english: 'The Way of Coordinating Energy',
    founded: '1948',
    founder: 'Choi Yong-Sool (최용술)',
    focus: ['Joint locks', 'Throws', 'Pressure points', 'Circular motion'],
    techniques: {
// ... (see full reference in Hack23 ISMS)
```

### 6. Dark Ops Combat Applications

**ALWAYS integrate special operations tactical combat with traditional martial arts:**

✅ **Dark Ops Vital Point Targeting System**
```typescript
export interface DarkOpsVitalPoint extends VitalPoint {
  readonly tacticalApplication: 'silent_kill' | 'suppression' | 'interrogation' | 'mobility_denial';
  readonly soundLevel: 'silent' | 'quiet' | 'audible';
  readonly incapacitationTime: number; // seconds
  readonly requiresFollowUp: boolean;
  readonly specialForces: readonly string[]; // Which units specialize in this
}

export const DARK_OPS_VITAL_POINTS: readonly DarkOpsVitalPoint[] = [
// ... (see full reference in Hack23 ISMS)
```

### 7. Special Forces Integration Patterns

**ALWAYS integrate Korean special forces units with martial arts philosophies:**

✅ **Special Forces Combat Doctrine**
```typescript
export const SPECIAL_FORCES_UNITS = {
  AMHEUK_JAKJEON: {
    korean: '암흑작전부대',
    english: 'Dark Operations Unit',
    motto: '어둠 속의 칼날 (Blade in the Darkness)',
    specialization: ['Silent infiltration', 'Assassination', 'Black-site operations'],
    martialArtsBase: ['Hapkido (pressure points)', 'Taekyon (stealth movement)'],
    combatMultiplier: {
      night: 1.4,  // +40% at night
// ... (see full reference in Hack23 ISMS)
```

## Enforcement Rules

### Rule 5: Comprehensive Martial Arts Coverage
```
IF (implementing Korean martial art NOT in KOREAN_MARTIAL_ARTS constant)
THEN (add art with proper Korean name, founder, techniques, philosophy)
ELSE (verify terminology and historical accuracy)
```

### Rule 6: Dark Ops Tactical Integration
```
IF (implementing special forces technique WITHOUT martial arts base)
THEN (integrate with appropriate Korean martial art from SPECIAL_FORCES_UNITS)
ELSE (verify tactical application matches unit specialization)
```

### Rule 7: Equipment-Enhanced Combat
```
IF (Dark Ops technique uses equipment OR technology)
THEN (apply appropriate equipment multiplier AND verify sound level)
ELSE (ensure bare-hands baseline remains balanced)
```

❌ **Anti-Pattern: Superficial or Disrespectful Use**
```typescript

## Enforcement Rules

### Rule 1: Eight Trigram Accuracy
```
IF (trigram symbol OR attributes OR philosophy incorrect)
THEN (reject with: "Verify Eight Trigram authenticity - use EIGHT_TRIGRAMS constant")
ELSE (verify combat style matches trigram philosophy)
```

### Rule 2: Vital Point Anatomical Precision
```
IF (vital point lacks anatomical location OR severity OR effective stances)
THEN (add anatomical details from TCM/Korean medicine sources)
ELSE (verify strike type compatibility)
```

### Rule 3: Korean Terminology Consistency
```
IF (Korean terms use wrong romanization OR inconsistent spelling)
THEN (apply Revised Romanization of Korean standard)
ELSE (verify bilingual format: "Korean | English")
```

### Rule 4: Cultural Context Required
```
IF (implementing traditional system WITHOUT context OR education)
THEN (add CULTURAL_CONTEXT documentation and player tooltips)
ELSE (verify respectful and accurate portrayal)
```

## Anti-Patterns to REJECT

❌ **Invented Trigrams** - Only use the authentic Eight Trigrams  
❌ **Fantasy Vital Points** - Must be anatomically accurate  
❌ **Mixed Martial Arts Styles** - Don't conflate Japanese/Chinese/Korean arts  
❌ **Appropriation Without Context** - Always provide educational context  
❌ **Disrespectful Portrayal** - Treat cultural systems with respect  
❌ **Incomplete Martial Arts** - All 11 Korean arts should be available, not just 2-3  
// ... (see full reference in Hack23 ISMS)
```typescript
export function getTrigramAdvantage(
  attackerStance: TrigramStance,
  defenderStance: TrigramStance
): number {
  const matchup = TRIGRAM_MATCHUPS[attackerStance];
  
  if (matchup.strong.includes(defenderStance)) {
    return 1.5; // 50% damage bonus
  }
  
  if (matchup.weak.includes(defenderStance)) {
    return 0.7; // 30% damage penalty
  }
  
  return 1.0; // Neutral matchup
}
```

✅ **Educational Tooltips for Players**
```typescript
export const VitalPointTooltip: React.FC<{ point: VitalPoint }> = ({ point }) => {
  return (
    <div className="tooltip">
      <h3>{point.koreanName} | {point.englishName}</h3>
      <p><strong>Location:</strong> {point.anatomicalLocation}</p>
      <p><strong>Severity:</strong> {point.severity}</p>
      <p><strong>Best Stances:</strong> {point.effectiveStances.join(', ')}</p>
      <p><strong>Description:</strong> {point.description}</p>
      <p className="warning">
        ⚠️ This is based on traditional martial arts anatomy. 
        In real life, strikes to vital points can cause serious injury or death.
      </p>
    </div>
  );
};