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
  
  // Additional Korean Martial Arts
  // Kuk Sool Won (국술원)
  KUK_SOOL_WON: { korean: '국술원', romanization: 'Kuk Sool Won', english: 'Korean Martial Arts Association' },
  PRESSURE_POINT_STRIKE: { korean: '혈도공격', romanization: 'Hyeoldo Gonggyeok', english: 'Pressure Point Strike' },
  HAND_SWORD: { korean: '수도', romanization: 'Sudo', english: 'Hand Sword Strike' },
  
  // Tang Soo Do (당수도)
  TANG_SOO_DO: { korean: '당수도', romanization: 'Tang Soo Do', english: 'Way of the Tang Hand' },
  REVERSE_PUNCH: { korean: '역권', romanization: 'Yeokgwon', english: 'Reverse Punch' },
  FRONT_KICK: { korean: '앞차기', romanization: 'Apchagi', english: 'Front Kick' },
  
  // Hwa Rang Do (화랑도)
  HWA_RANG_DO: { korean: '화랑도', romanization: 'Hwa Rang Do', english: 'Way of the Flowering Knights' },
  SWORD_DRAWING: { korean: '발도', romanization: 'Baldo', english: 'Sword Drawing' },
  EMPTY_HAND: { korean: '맨손', romanization: 'Maenson', english: 'Empty Hand Techniques' },
  
  // Gumdo/Geomdo (검도)
  GUMDO: { korean: '검도', romanization: 'Gumdo', english: 'Way of the Sword' },
  SWORD_CUT: { korean: '베기', romanization: 'Begi', english: 'Sword Cut' },
  THRUST: { korean: '찌르기', romanization: 'Jjireugi', english: 'Thrust' },
  
  // Ssireum (씨름)
  SSIREUM: { korean: '씨름', romanization: 'Ssireum', english: 'Korean Wrestling' },
  LEG_SWEEP: { korean: '다리걸기', romanization: 'Dari-geolgi', english: 'Leg Sweep' },
  WAIST_GRAB: { korean: '허리잡기', romanization: 'Heori-japgi', english: 'Waist Grab' },
  
  // Subak (수박)
  SUBAK: { korean: '수박', romanization: 'Subak', english: 'Ancient Korean Martial Art' },
  ANCIENT_TECHNIQUE: { korean: '고대 기법', romanization: 'Godae Gibeop', english: 'Ancient Technique' },
  
  // Yudo (유도)
  YUDO: { korean: '유도', romanization: 'Yudo', english: 'Korean Judo' },
  SHOULDER_THROW: { korean: '어깨넘기기', romanization: 'Eokkae-neomgigi', english: 'Shoulder Throw' },
  GROUND_CONTROL: { korean: '굳히기', romanization: 'Gudhigi', english: 'Ground Control/Pin' },
  
  // Gongkwon Yusul (공권유술)
  GONGKWON_YUSUL: { korean: '공권유술', romanization: 'Gongkwon Yusul', english: 'Korean Mixed Martial Art' },
  INTEGRATED_TECHNIQUE: { korean: '통합 기술', romanization: 'Tonghap Gisul', english: 'Integrated Technique' },
  
  // Dark Ops Combat Applications
  SILENT_KILL: { korean: '무음 암살', romanization: 'Mueum Amsal', english: 'Silent Kill' },
  TACTICAL_STRIKE: { korean: '전술 타격', romanization: 'Jeonsul Tagyeok', english: 'Tactical Strike' },
  INFILTRATION: { korean: '침투', romanization: 'Chimtu', english: 'Infiltration' },
  SUPPRESSION: { korean: '제압', romanization: 'Jeoap', english: 'Suppression' },
  CONTROL_POINT: { korean: '제어점', romanization: 'Jeeojeom', english: 'Control Point' },
  NERVE_STRIKE: { korean: '신경 타격', romanization: 'Singyeong Tagyeok', english: 'Nerve Strike' },
  RESPIRATORY_ATTACK: { korean: '호흡 제어', romanization: 'Hoheup Jeeo', english: 'Respiratory Control' },
  VASCULAR_DISRUPTION: { korean: '혈관 차단', romanization: 'Hyeolgwan Chadan', english: 'Vascular Disruption' },
  MOBILITY_DENIAL: { korean: '이동 불능', romanization: 'Idong Bulleung', english: 'Mobility Denial' },
  INTERROGATION_TECHNIQUE: { korean: '심문 기술', romanization: 'Simmun Gisul', english: 'Interrogation Technique' },
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
    hapkido: 'Korean martial art emphasizing joint locks, throws, and vital point strikes (1948)',
    taekwondo: 'Korean martial art known for dynamic kicking techniques (1955, Olympic sport)',
    taekyon: 'Traditional Korean martial art with fluid, rhythmic movements (UNESCO Heritage)',
    kuk_sool_won: 'Comprehensive Korean martial arts system with royal court techniques (1958)',
    tang_soo_do: 'Korean martial art emphasizing traditional values and character (1945)',
    hwa_rang_do: 'Complete warrior art based on ancient Hwarang knights (1960, 4000+ techniques)',
    gumdo: 'Korean sword art emphasizing mind-sword unity and spiritual discipline',
    ssireum: 'Traditional Korean wrestling, UNESCO Heritage, ancient folk sport',
    subak: 'Ancient pre-Joseon martial art, predecessor to modern Korean arts',
    yudo: 'Korean adaptation of judo with throws, pins, and joint locks',
    gongkwon_yusul: 'Modern Korean mixed martial art for practical self-defense (1996)',
    respect: 'Each style has deep history and should be portrayed authentically',
  },
  
  DARK_OPS: {
    origin: 'Korean special operations forces combining traditional martial arts with modern tactics',
    units: 'Five specialized units: Amheuk Jakjeon, Amheuk Teuggongdae, Simya Jakjeon, Beullaekopseu, Simhae Chimtu',
    integration: 'Traditional martial arts techniques adapted for tactical military applications',
    respect: 'Special forces methods are lethal and should be portrayed with appropriate gravity',
    gameplay: 'Equipment and environment multipliers represent tactical advantages',
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
      joint_locks: ['Sonmok-kkeokgi (손목꺾기)', 'Gwanjeolgi (관절기)'],
      throws: ['Deonjigi (던지기)', 'Nelligi (넘기기)'],
      strikes: ['Hyeoldo Gonggyeok (혈도공격)', 'Sudo (수도)'],
    },
    philosophy: 'Redirect and control opponent\'s energy, minimize force',
  },
  
  TAEKWONDO: {
    korean: '태권도',
    english: 'The Way of Foot and Fist',
    founded: '1955',
    founder: 'Choi Hong Hi (최홍희) / Kukkiwon',
    focus: ['High kicks', 'Speed', 'Power', 'Olympic sport'],
    techniques: {
      kicks: ['Dollyeochagi (돌려차기)', 'Naeryeochagi (내려차기)', 'Yeopchagi (옆차기)'],
      punches: ['Jireugi (지르기)', 'Yeokgwon (역권)'],
      blocks: ['Makgi (막기)', 'Palgup (팔굽)'],
      forms: ['Poomsae (품새)', 'Tul (틀)'],
    },
    philosophy: 'Strength through discipline, mental and physical balance',
  },
  
  TAEKYON: {
    korean: '택견',
    english: 'Traditional Korean Martial Art',
    founded: 'Ancient (pre-1400s)',
    heritage: 'UNESCO Intangible Cultural Heritage',
    focus: ['Fluid movement', 'Low kicks', 'Rhythmic footwork', 'Push techniques'],
    techniques: {
      kicks: ['Nalgaechagi (날개차기)', 'Yettchigi (옆치기)'],
      footwork: ['Poom (품)', 'Kkulgi (끌기)'],
      pushes: ['Milgi (밀기)', 'Batang-son (바탕손)'],
    },
    philosophy: 'Dance-like flow, traditional Korean warrior art preservation',
  },
  
  KUK_SOOL_WON: {
    korean: '국술원',
    english: 'Korean Martial Arts Association',
    founded: '1958',
    founder: 'Suh In-Hyuk (서인혁)',
    focus: ['Comprehensive system', 'Joint locks', 'Pressure points', 'Traditional weapons'],
    techniques: {
      strikes: ['Sudo (수도)', 'Hyeoldo (혈도)'],
      locks: ['Gwanjeolgi (관절기)', 'Jabgi (잡기)'],
      throws: ['Deonjigi (던지기)', 'Nelligi (넘기기)'],
      weapons: ['Gum (검 - sword)', 'Bong (봉 - staff)', 'Ssanggeom (쌍검 - twin swords)'],
    },
    philosophy: 'Comprehensive Korean martial heritage, royal court techniques',
  },
  
  TANG_SOO_DO: {
    korean: '당수도',
    english: 'Way of the Tang Hand',
    founded: '1945',
    founder: 'Hwang Kee (황기)',
    focus: ['Traditional forms', 'Hard-soft balance', 'Character development'],
    techniques: {
      kicks: ['Apchagi (앞차기)', 'Yeopchagi (옆차기)', 'Dwichagi (뒤차기)'],
      punches: ['Jireugi (지르기)', 'Yeokgwon (역권)', 'Sudo (수도)'],
      forms: ['Hyung (형)', 'Pyung Ahn (평안)'],
    },
    philosophy: 'Traditional values, respect, humility, perseverance',
  },
  
  HWA_RANG_DO: {
    korean: '화랑도',
    english: 'Way of the Flowering Knights',
    founded: '1960',
    founder: 'Joo Bang Lee (이주방)',
    heritage: 'Based on ancient Hwarang warriors',
    focus: ['Comprehensive combat', 'Weapons', 'Mental training', '4,000+ techniques'],
    techniques: {
      empty_hand: ['Maenson (맨손)', 'Gwonbeop (권법)'],
      weapons: ['Gum (검)', 'Chang (창 - spear)', 'Gungdo (궁도 - archery)'],
      medicine: ['Healing arts', 'Pressure point therapy'],
    },
    philosophy: 'Hwarang warrior code: loyalty, filial piety, trustworthiness, valor',
  },
  
  GUMDO: {
    korean: '검도 / 劍道',
    english: 'Way of the Sword',
    heritage: 'Korean sword art, distinct from Japanese Kendo',
    focus: ['Katana techniques', 'Cutting', 'Thrusting', 'Spiritual discipline'],
    techniques: {
      cuts: ['Begi (베기)', 'Naeryeobegi (내려베기)'],
      thrusts: ['Jjireugi (찌르기)', 'Tchireugi (찌르기)'],
      drawing: ['Baldo (발도)', 'Geombaldo (검발도)'],
      forms: ['Jegi (제기)', 'Gibon Dongjak (기본동작)'],
    },
    philosophy: 'Mind-sword unity, cutting through illusion, spiritual cultivation',
  },
  
  SSIREUM: {
    korean: '씨름',
    english: 'Korean Wrestling',
    heritage: 'UNESCO Intangible Cultural Heritage, ancient Korean sport',
    focus: ['Grappling', 'Throws', 'Takedowns', 'Traditional wrestling'],
    techniques: {
      grabs: ['Satba-japgi (샅바잡기)', 'Heori-japgi (허리잡기)'],
      throws: ['Dari-geolgi (다리걸기)', 'Dwijibgi (뒤집기)'],
      techniques: ['Andarideulgi (안다리들기)', 'Bakkdarideulgi (밖다리들기)'],
    },
    philosophy: 'Strength through technique, traditional Korean folk sport',
  },
  
  SUBAK: {
    korean: '수박',
    english: 'Ancient Korean Martial Art',
    heritage: 'Pre-Joseon dynasty martial art (before 1392)',
    historical: 'Predecessor to modern Korean martial arts',
    focus: ['Hand strikes', 'Ancient techniques', 'Historical preservation'],
    techniques: {
      strikes: ['Godae Gibeop (고대 기법)', 'Sudo (수도)'],
      historical: 'Techniques preserved in historical texts',
    },
    philosophy: 'Ancient Korean warrior traditions, historical martial heritage',
  },
  
  YUDO: {
    korean: '유도',
    english: 'Korean Judo',
    heritage: 'Korean adaptation of Japanese Judo',
    focus: ['Throws', 'Pins', 'Joint locks', 'Chokes'],
    techniques: {
      throws: ['Eokkae-neomgigi (어깨넘기기)', 'Dwijibgi (뒤집기)'],
      pins: ['Gudhigi (굳히기)', 'Nuweugi (누워기)'],
      locks: ['Gwanjeolgi (관절기)', 'Palkkumchigi (팔꿈치기)'],
    },
    philosophy: 'Maximum efficiency, mutual welfare and benefit',
  },
  
  GONGKWON_YUSUL: {
    korean: '공권유술',
    english: 'Korean Mixed Martial Art',
    founded: '1996',
    founder: 'Kang Jun',
    focus: ['Modern MMA', 'Integrated techniques', 'Competition', 'Self-defense'],
    techniques: {
      striking: ['Gwonbeop (권법)', 'Balchagi (발차기)'],
      grappling: ['Jabgi (잡기)', 'Gwanjeolgi (관절기)'],
      ground: ['Nuweugi (누워기)', 'Jomeugi (조르기)'],
      integrated: ['Tonghap Gisul (통합 기술)'],
    },
    philosophy: 'Modern Korean MMA, practical self-defense for 21st century',
  },
} as const;
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
  {
    id: 'carotid-sinus',
    koreanName: '경동맥동',
    englishName: 'Carotid Sinus',
    anatomicalLocation: 'Anterolateral neck, bifurcation of common carotid artery',
    category: 'neck',
    severity: 'instant',
    strikeTypes: ['pressure', 'choke'],
    effectiveStances: ['GAM', 'TAE'],
    description: 'Baroreceptor activation causes rapid unconsciousness (3-8 seconds)',
    tacticalApplication: 'silent_kill',
    soundLevel: 'silent',
    incapacitationTime: 5,
    requiresFollowUp: false,
    specialForces: ['Amheuk Jakjeon Budae', 'Simya Jakjeon Budae'],
  },
  {
    id: 'vagus-nerve',
    koreanName: '미주신경',
    englishName: 'Vagus Nerve (Neck)',
    anatomicalLocation: 'Lateral neck, posterior to sternocleidomastoid muscle',
    category: 'neck',
    severity: 'severe',
    strikeTypes: ['pressure', 'nerve_strike'],
    effectiveStances: ['LI', 'SON'],
    description: 'Causes vasovagal response, respiratory distress',
    tacticalApplication: 'suppression',
    soundLevel: 'quiet',
    incapacitationTime: 3,
    requiresFollowUp: true,
    specialForces: ['Amheuk Teuggongdae', 'Beullaekopseu Budae'],
  },
  {
    id: 'brachial-plexus',
    koreanName: '상완신경총',
    englishName: 'Brachial Plexus Origin',
    anatomicalLocation: 'Supraclavicular fossa, nerve bundle emerging from neck',
    category: 'neck',
    severity: 'severe',
    strikeTypes: ['shock', 'nerve_strike'],
    effectiveStances: ['JIN', 'LI'],
    description: 'Causes immediate arm paralysis and severe pain',
    tacticalApplication: 'mobility_denial',
    soundLevel: 'quiet',
    incapacitationTime: 30,
    requiresFollowUp: false,
    specialForces: ['Simhae Chimtu Budae'],
  },
  {
    id: 'phrenic-nerve-zone',
    koreanName: '횡격막 신경대',
    englishName: 'Phrenic Nerve Zone',
    anatomicalLocation: 'Anterior neck, C3-C5 nerve roots near scalene muscles',
    category: 'neck',
    severity: 'severe',
    strikeTypes: ['pressure', 'nerve_strike'],
    effectiveStances: ['LI', 'GAM'],
    description: 'Disrupts diaphragm control, causes respiratory arrest',
    tacticalApplication: 'interrogation',
    soundLevel: 'silent',
    incapacitationTime: 10,
    requiresFollowUp: true,
    specialForces: ['Beullaekopseu Budae'],
  },
];

// Dark Ops damage calculation with tactical modifiers
export function calculateDarkOpsDamage(
  point: DarkOpsVitalPoint,
  stance: TrigramStance,
  equipment: 'bare_hands' | 'night_vision' | 'cyber_enhanced',
  environment: 'day' | 'night' | 'underwater'
): number {
  const baseDamage = calculateVitalPointDamage(point, stance, point.strikeTypes[0], 100);
  
  // Equipment multiplier
  const equipmentMultipliers = {
    bare_hands: 1.0,
    night_vision: 1.15,  // +15% accuracy at night
    cyber_enhanced: 1.25, // +25% with digital targeting
  };
  const equipmentMod = equipmentMultipliers[equipment];
  
  // Environment multiplier
  const environmentMultipliers = {
    day: 1.0,
    night: 1.1,  // Dark Ops units excel at night
    underwater: 0.8, // Reduced effectiveness underwater
  };
  const environmentMod = environmentMultipliers[environment];
  
  // Tactical application effectiveness
  const tacticalMod = point.soundLevel === 'silent' ? 1.3 : 1.0;
  
  return baseDamage * equipmentMod * environmentMod * tacticalMod;
}
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
      stealth: 1.3, // +30% when undetected
      vital_points: 1.5, // +50% vital point damage
    },
    optimalArchetype: 'Amsalja (암살자)',
  },
  
  AMHEUK_TEUGGONGDAE: {
    korean: '암흑특공대',
    english: 'Shadow Commando Brigade',
    motto: '보이지 않는 일격 (The Invisible Strike)',
    specialization: ['Demolition', 'Sabotage', 'Facility breaching'],
    martialArtsBase: ['Ssireum (close-quarters)', 'Hapkido (control)', 'Taekwondo (breaking)'],
    combatMultiplier: {
      confined_space: 1.3,
      explosive_breach: 1.4,
      prisoner_control: 1.5,
    },
    optimalArchetype: 'Jojik Pokryeokbae (조직폭력배)',
  },
  
  SIMYA_JAKJEON: {
    korean: '심야작전부대',
    english: 'Nightfall Infiltration Squadron',
    motto: '밤이 우리의 무기다 (Night is Our Weapon)',
    specialization: ['Night operations', 'Rappelling', 'Zero-light CQB'],
    martialArtsBase: ['Taekyon (silent movement)', 'Hapkido (nerve strikes)', 'Modified Taekwondo'],
    combatMultiplier: {
      night: 1.5,  // +50% at night
      vertical_combat: 1.3,
      silent_takedown: 1.4,
    },
    optimalArchetype: 'Amsalja (암살자)',
  },
  
  BEULLAEKOPSEU: {
    korean: '블랙옵스부대',
    english: 'Black Ops Task Force',
    motto: '작전은 비공개, 결과는 치명적 (Mission Classified, Result Lethal)',
    specialization: ['Cyber-espionage', 'Electronic warfare', 'Deep-cover ops'],
    martialArtsBase: ['Calculated Hapkido', 'Tech-enhanced targeting'],
    combatMultiplier: {
      cyber_enhanced: 1.4,
      intelligence_gathering: 1.3,
      tech_assisted: 1.5,
    },
    optimalArchetype: 'Hacker (해커)',
  },
  
  SIMHAE_CHIMTU: {
    korean: '심해침투부대',
    english: 'Deep Sea Infiltration Unit',
    motto: '가장 깊은 곳에서 올라온 칼날 (Blade from the Deepest Depths)',
    specialization: ['Maritime ops', 'Underwater demolition', 'Amphibious combat'],
    martialArtsBase: ['Adapted Ssireum', 'Modified Hapkido', 'Vessel-combat Taekwondo'],
    combatMultiplier: {
      underwater: 1.3,
      ship_deck: 1.4,
      amphibious: 1.3,
    },
    optimalArchetype: 'Musa (무사)',
  },
} as const;

// Calculate special forces effectiveness
export function getSpecialForcesBonus(
  unit: keyof typeof SPECIAL_FORCES_UNITS,
  environment: string,
  archetype: string
): number {
  const unitData = SPECIAL_FORCES_UNITS[unit];
  const multipliers = unitData.combatMultiplier;
  
  let bonus = 1.0;
  
  // Apply environment-specific multipliers
  if (environment in multipliers) {
    bonus *= multipliers[environment as keyof typeof multipliers];
  }
  
  // Apply archetype bonus if optimal
  if (archetype === unitData.optimalArchetype.split(' ')[0]) {
    bonus *= 1.25; // +25% for optimal archetype
  }
  
  return bonus;
}
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
❌ **Generic Dark Ops** - Special forces must integrate specific Korean martial arts base  
❌ **Unrealistic Special Forces** - Equipment/environment multipliers must be balanced  
❌ **Missing Sound Levels** - Dark Ops techniques must specify sound profile

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
- **다양성 (Diversity)**: Recognizing all 11 Korean martial arts traditions
- **전술적 통합 (Tactical Integration)**: Special forces adapt traditional arts for modern combat

**11 Korean Martial Arts to Honor:**
1. Hapkido (합기도) - Energy coordination, joint locks
2. Taekwondo (태권도) - Dynamic kicks, Olympic sport
3. Taekyon (택견) - Fluid traditional art, UNESCO Heritage
4. Kuk Sool Won (국술원) - Comprehensive royal court techniques
5. Tang Soo Do (당수도) - Character development, traditional values
6. Hwa Rang Do (화랑도) - Complete warrior system, 4000+ techniques
7. Gumdo (검도) - Sword art, mind-sword unity
8. Ssireum (씨름) - Traditional wrestling, UNESCO Heritage
9. Subak (수박) - Ancient pre-Joseon martial heritage
10. Yudo (유도) - Korean judo adaptation
11. Gongkwon Yusul (공권유술) - Modern Korean MMA

**5 Special Forces Units to Integrate:**
1. 암흑작전부대 (Amheuk Jakjeon Budae) - Dark Operations: Silent kills, infiltration
2. 암흑특공대 (Amheuk Teuggongdae) - Shadow Commandos: Demolition, sabotage
3. 심야작전부대 (Simya Jakjeon Budae) - Nightfall Squadron: Night ops, rappelling
4. 블랙옵스부대 (Beullaekopseu Budae) - Black Ops: Cyber warfare, intelligence
5. 심해침투부대 (Simhae Chimtu Budae) - Deep Sea: Maritime ops, underwater combat

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_

**Authentic representation honors the warriors who came before - both traditional masters and modern special forces operators.**
