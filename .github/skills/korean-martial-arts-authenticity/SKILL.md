---
name: korean-martial-arts-authenticity
description: |
  Enforces authentic Korean martial arts systems including Eight Trigram stances,
  70 vital points accuracy, proper Hapkido/Taekwondo/Taekyon terminology, cultural
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
- Writing Korean martial arts terminology
- Implementing damage calculations based on anatomy
- Creating character archetypes with martial arts backgrounds
- Adding martial arts animations or movements
- Designing combat mechanics or strike systems
- Translating martial arts concepts
- Reviewing combat balance and realism

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
    optimalTechniques: [
      'Thunder Strike (천둥벽력)',
      'Heaven's Hammer (천추)',
      'Crushing Blow (강타)'
    ],
    physicalFocus: 'Upper body strength, overhead strikes',
    philosophy: 'The unyielding force of heaven',
  },
  TAE: {
    symbol: '☱',
    korean: '태',
    english: 'Lake',
    element: 'Metal',
    direction: 'West',
    attributes: ['Fluidity', 'Joy', 'Adaptation'],
    combatStyle: 'Flowing joint manipulations',
    optimalTechniques: [
      'Joint Lock Flow (관절기 흐름)',
      'Water Reflection (수류반격)',
      'Flowing Grasp (유수연타)'
    ],
    physicalFocus: 'Joint manipulation, circular movements',
    philosophy: 'Like water seeking its level',
  },
  LI: {
    symbol: '☲',
    korean: '리',
    english: 'Fire',
    element: 'Fire',
    direction: 'South',
    attributes: ['Precision', 'Clarity', 'Illumination'],
    combatStyle: 'Precise nerve strikes',
    optimalTechniques: [
      'Flame Spear (화염지창)',
      'Burning Point (화점)',
      'Light Strike (광격)'
    ],
    physicalFocus: 'Nerve strikes, finger techniques',
    philosophy: 'Illuminating the path to victory',
  },
  JIN: {
    symbol: '☳',
    korean: '진',
    english: 'Thunder',
    element: 'Wood',
    direction: 'East',
    attributes: ['Explosiveness', 'Movement', 'Arousal'],
    combatStyle: 'Explosive power techniques',
    optimalTechniques: [
      'Thunder Flash (벽력일섬)',
      'Explosive Burst (폭발타)',
      'Shock Strike (진타)'
    ],
    physicalFocus: 'Explosive movements, rapid strikes',
    philosophy: 'Strike like thunder from clear sky',
  },
  SON: {
    symbol: '☴',
    korean: '손',
    english: 'Wind',
    element: 'Wood',
    direction: 'Southeast',
    attributes: ['Continuous', 'Penetrating', 'Gentle'],
    combatStyle: 'Continuous pressure attacks',
    optimalTechniques: [
      'Wind Barrage (선풍연격)',
      'Gale Force (풍압)',
      'Penetrating Strike (관통격)'
    ],
    physicalFocus: 'Rapid combinations, pressure tactics',
    philosophy: 'Wind that penetrates all defenses',
  },
  GAM: {
    symbol: '☵',
    korean: '감',
    english: 'Water',
    element: 'Water',
    direction: 'North',
    attributes: ['Adaptation', 'Danger', 'Depth'],
    combatStyle: 'Flow and adaptation techniques',
    optimalTechniques: [
      'Water Counter (수류반격)',
      'Drowning Technique (익수기)',
      'Tidal Wave (해일)'
    ],
    physicalFocus: 'Counterattacks, defensive flows',
    philosophy: 'Adapt like water to any situation',
  },
  GAN: {
    symbol: '☶',
    korean: '간',
    english: 'Mountain',
    element: 'Earth',
    direction: 'Northeast',
    attributes: ['Stillness', 'Keeping Still', 'Meditation'],
    combatStyle: 'Defensive mastery',
    optimalTechniques: [
      'Mountain Stand (반석방어)',
      'Immovable (부동자세)',
      'Stone Wall (석벽)'
    ],
    physicalFocus: 'Defensive positions, rooting',
    philosophy: 'Unmovable as a mountain',
  },
  GON: {
    symbol: '☷',
    korean: '곤',
    english: 'Earth',
    element: 'Earth',
    direction: 'Southwest',
    attributes: ['Receptive', 'Devoted', 'Yielding'],
    combatStyle: 'Grounding and takedown techniques',
    optimalTechniques: [
      'Earth Embrace (대지포옹)',
      'Ground Slam (낙지)',
      'Rooting Technique (근본기)'
    ],
    physicalFocus: 'Takedowns, ground control',
    philosophy: 'Embrace the earth to defeat heaven',
  },
} as const;

// Trigram matchup system (advantage/disadvantage)
export const TRIGRAM_MATCHUPS = {
  // Each trigram has advantages over certain others
  GEON: { strong: ['SON', 'LI'], weak: ['GAM', 'TAE'] },    // Heaven
  TAE: { strong: ['GEON', 'GAN'], weak: ['LI', 'JIN'] },    // Lake
  LI: { strong: ['TAE', 'GAN'], weak: ['GAM', 'GON'] },     // Fire
  JIN: { strong: ['TAE', 'GON'], weak: ['SON', 'GEON'] },   // Thunder
  SON: { strong: ['GON', 'GAM'], weak: ['GAN', 'JIN'] },    // Wind
  GAM: { strong: ['LI', 'GEON'], weak: ['GON', 'SON'] },    // Water
  GAN: { strong: ['SON', 'JIN'], weak: ['TAE', 'LI'] },     // Mountain
  GON: { strong: ['GAM', 'LI'], weak: ['GEON', 'JIN'] },    // Earth
} as const;
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
  readonly description: string;
}

// Example: Critical head vital points
export const HEAD_VITAL_POINTS: readonly VitalPoint[] = [
  {
    id: 'taiyang',
    koreanName: '태양혈',
    englishName: 'Temple (Taiyang)',
    anatomicalLocation: 'Temporal bone, 1 cun posterior to lateral orbital rim',
    category: 'head',
    severity: 'instant',
    strikeTypes: ['pierce', 'shock'],
    effectiveStances: ['LI', 'JIN'],  // Fire (precision) or Thunder (explosive)
    description: 'Critical point - strike can cause immediate unconsciousness or death',
  },
  {
    id: 'renzhong',
    koreanName: '인중혈',
    englishName: 'Philtrum (Renzhong)',
    anatomicalLocation: 'Philtrum, midway between nose and upper lip',
    category: 'head',
    severity: 'severe',
    strikeTypes: ['pierce', 'pressure'],
    effectiveStances: ['LI', 'SON'],  // Fire (precision) or Wind (continuous)
    description: 'Causes severe pain, disorientation, and potential knockout',
  },
  {
    id: 'jiache',
    koreanName: '협차혈',
    englishName: 'Jaw Hinge (Jiache)',
    anatomicalLocation: 'Masseter muscle attachment at mandible angle',
    category: 'head',
    severity: 'severe',
    strikeTypes: ['impact', 'hook'],
    effectiveStances: ['GEON', 'JIN'],  // Heaven (power) or Thunder (explosive)
    description: 'Knockout point - disrupts jaw and causes brain impact',
  },
] as const;

// Damage calculation based on vital point
export function calculateVitalPointDamage(
  point: VitalPoint,
  stance: TrigramStance,
  strikeType: StrikeType,
  baseStrength: number
): number {
  // Stance effectiveness multiplier (1.0x to 3.0x)
  const stanceMultiplier = point.effectiveStances.includes(stance) ? 2.5 : 1.0;
  
  // Strike type compatibility (1.0x or 1.5x)
  const strikeMultiplier = point.strikeTypes.includes(strikeType) ? 1.5 : 1.0;
  
  // Severity multiplier
  const severityMultipliers = {
    instant: 5.0,
    severe: 3.0,
    moderate: 2.0,
    minor: 1.0,
  };
  const severityMultiplier = severityMultipliers[point.severity];
  
  return baseStrength * stanceMultiplier * strikeMultiplier * severityMultiplier;
}
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
  JOINT_LOCK: { korean: '관절기', romanization: 'Gwanjeolgi', english: 'Joint Lock' },
  THROWING: { korean: '던지기', romanization: 'Deonjigi', english: 'Throwing' },
  
  // Taekwondo (태권도) Terms
  ROUNDHOUSE_KICK: { korean: '돌려차기', romanization: 'Dollyeochagi', english: 'Roundhouse Kick' },
  AXE_KICK: { korean: '내려차기', romanization: 'Naeryeochagi', english: 'Axe Kick' },
  SPINNING_KICK: { korean: '뒤후려차기', romanization: 'Dwihurye chagi', english: 'Spinning Hook Kick' },
  
  // Taekyon (택견) Terms  
  POOM: { korean: '품', romanization: 'Poom', english: 'Form/Movement' },
  NALGAECHAGI: { korean: '날개차기', romanization: 'Nalgaechagi', english: 'Wing Kick' },
  YETTCHIGI: { korean: '옆치기', romanization: 'Yettchigi', english: 'Side Strike' },
  
  // Special Operations Terms
  DARK_OPS: { korean: '암흑작전', romanization: 'Amheuk Jakjeon', english: 'Dark Operations' },
  ASSASSINATION: { korean: '암살', romanization: 'Amsal', english: 'Assassination' },
  CLOSE_COMBAT: { korean: '근접전투', romanization: 'Geunjeop Jeontu', english: 'Close Combat' },
} as const;

// Bilingual display helper
export function formatBilingual(termKey: keyof typeof KOREAN_TERMINOLOGY): string {
  const term = KOREAN_TERMINOLOGY[termKey];
  return `${term.korean} | ${term.english}`;
}

// Example: "급소 | Vital Point"
const displayText = formatBilingual('VITAL_POINT');
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
    origin: 'Traditional Chinese Medicine (TCM) and Korean medicine',
    context: 'Based on meridian theory and anatomical knowledge',
    realWorld: 'Some points are life-threatening and should be portrayed seriously',
    gameBalance: 'Damage scaled for gameplay but maintains anatomical respect',
  },
  
  MARTIAL_ARTS: {
    hapkido: 'Korean martial art emphasizing joint locks, throws, and vital point strikes',
    taekwondo: 'Korean martial art known for dynamic kicking techniques',
    taekyon: 'Traditional Korean martial art with fluid, rhythmic movements',
    respect: 'Each style has deep history and should be portrayed authentically',
  },
} as const;

// Education tooltip for players
export function getEducationalContext(topic: string): string {
  const context = CULTURAL_CONTEXT[topic as keyof typeof CULTURAL_CONTEXT];
  return `
    Origin: ${context.origin}
    ${context.koreanAdoption ? 'Korean Context: ' + context.koreanAdoption : ''}
    ${context.respect}
  `;
}
```

❌ **Anti-Pattern: Superficial or Disrespectful Use**
```typescript
// BAD: No cultural context or respect
const trigrams = ['random', 'symbol', 'for', 'decoration']; // ❌
const vitalPoints = ['mystery', 'chakra', 'points']; // ❌ Mixing concepts
```

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

## Required Patterns

✅ **Trigram-Based Combat Multipliers**
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
```

## Compliance Framework

### ISO 27001:2022 Alignment
- **A.7.8**: Information Security Awareness - Educational content about martial arts

### NIST Cybersecurity Framework 2.0
- **GV.RR**: Risk Management - Responsible portrayal of combat techniques

### CIS Controls v8.1
- **CIS Control 14**: Security Awareness - Cultural sensitivity and education

## Remember

**무술의 정신 (Spirit of Martial Arts)**

Korean martial arts are not just combat techniques - they embody:
- **존중 (Respect)**: For tradition, teachers, and opponents
- **정확성 (Precision)**: In technique and terminology
- **교육 (Education)**: Teaching proper context and history
- **책임 (Responsibility)**: Portraying dangerous techniques seriously
- **진정성 (Authenticity)**: Honoring the source material

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

**Authentic representation honors the warriors who came before.**
