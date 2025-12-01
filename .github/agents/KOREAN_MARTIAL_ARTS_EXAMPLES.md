# 🥋 Korean Martial Arts Expert Agent - Usage Examples

This document provides practical examples of how to use the Korean Martial Arts Expert agent to extend the Black Trigram combat system with authentic Korean martial arts techniques and vital points.

## Table of Contents

1. [Adding New Vital Points](#adding-new-vital-points)
2. [Creating Korean Techniques](#creating-korean-techniques)
3. [Integrating with Trigram Stances](#integrating-with-trigram-stances)
4. [Archetype Specializations](#archetype-specializations)
5. [Testing Combat Systems](#testing-combat-systems)

---

## Adding New Vital Points

### Example 1: Hapkido Joint Lock Target

**Context**: Adding a radial nerve strike point used in Hapkido joint manipulation techniques.

**File**: `src/systems/vitalpoint/VitalPointsData.ts`

```typescript
// Add to VITAL_POINTS_DATA array
{
  id: "hapkido_radial_nerve",
  names: {
    korean: "요골신경점",
    english: "Radial Nerve Strike Point",
    romanized: "yogol-singyeong-jeom",
  },
  position: { x: 150, y: 200 }, // Upper forearm position
  category: VitalPointCategory.NEUROLOGICAL,
  severity: VitalPointSeverity.MODERATE,
  baseDamage: 22,
  effects: [
    {
      id: "arm_paralysis",
      type: VitalPointEffectType.PARALYSIS,
      intensity: EffectIntensity.MEDIUM,
      duration: 2000, // 2 seconds of paralysis
      description: {
        korean: "팔 일시 마비",
        english: "Temporary arm paralysis",
      },
      stackable: false,
      source: "vital_point_system",
    },
  ],
  description: {
    korean: "합기도의 요골신경 타격으로 팔의 일시적 마비를 유발하는 압박점",
    english: "Hapkido pressure point strike causing temporary arm paralysis via radial nerve compression",
    romanized: "Hapkido-ui yogol-singyeong tagyeok",
  },
  targetingDifficulty: 0.6, // Moderate difficulty
  effectiveStances: [
    TrigramStance.TAE,  // Lake (fluid control)
    TrigramStance.SON,  // Wind (continuous pressure)
  ],
  
  // Korean martial arts specific properties
  martialArtOrigin: 'hapkido',
  strikeType: 'pressure',
  archetypeBonus: {
    amsalja: 1.3,    // Shadow assassin +30% (silent incapacitation)
    jeongbo: 1.2,    // Intelligence operative +20% (precise timing)
    musa: 0.9,       // Traditional warrior -10% (prefers direct force)
  },
  anatomicalDepth: 'shallow',
  recoveryTime: 2000,
  
  // Backwards compatibility
  korean: { korean: "요골신경점", english: "Radial Nerve Strike Point" },
  english: "Radial Nerve Strike Point",
  anatomicalName: "Radial Nerve (C5-C8)",
  radius: 18,
  damage: { min: 18, max: 26, average: 22 },
  difficulty: 0.6,
  requiredForce: 15,
  safetyWarning: "Can cause temporary loss of fine motor control",
}
```

### Example 2: Taekwondo High Kick Target

**Context**: Adding a temple strike point optimized for Taekwondo high kicks.

```typescript
{
  id: "taekwondo_temple_kick",
  names: {
    korean: "측두부 고타격점",
    english: "High Temple Kick Point",
    romanized: "cheukdubu go-tagyeok-jeom",
  },
  position: { x: 95, y: 52 }, // Side of head
  category: VitalPointCategory.NEUROLOGICAL,
  severity: VitalPointSeverity.CRITICAL,
  baseDamage: 42,
  effects: [
    {
      id: "knockout",
      type: VitalPointEffectType.UNCONSCIOUSNESS,
      intensity: EffectIntensity.HIGH,
      duration: 5000,
      description: {
        korean: "즉시 기절",
        english: "Immediate knockout",
      },
      stackable: false,
      source: "vital_point_system",
    },
    {
      id: "vision_blur",
      type: VitalPointEffectType.VISION_IMPAIRMENT,
      intensity: EffectIntensity.MEDIUM,
      duration: 3000,
      description: {
        korean: "시야 흐림",
        english: "Blurred vision",
      },
      stackable: false,
      source: "vital_point_system",
    },
  ],
  description: {
    korean: "태권도 돌려차기로 타격하는 관자놀이 급소, 뇌진탕 위험이 높음",
    english: "Temple vital point for Taekwondo roundhouse kicks, high concussion risk",
    romanized: "Taekwondo dollyo-chagi-ro tagyeok",
  },
  targetingDifficulty: 0.85, // Very difficult - requires flexibility and timing
  effectiveStances: [
    TrigramStance.LI,   // Fire (precision)
    TrigramStance.JIN,  // Thunder (explosive power)
  ],
  
  martialArtOrigin: 'taekwondo',
  strikeType: 'kick',
  archetypeBonus: {
    musa: 1.2,         // Traditional warrior +20% (classical technique)
    hacker: 1.15,      // Cyber warrior +15% (calculated targeting)
    amsalja: 0.9,      // Shadow assassin -10% (prefers stealth)
  },
  anatomicalDepth: 'shallow',
  recoveryTime: 5000,
  
  korean: { korean: "측두부 고타격점", english: "High Temple Kick Point" },
  english: "High Temple Kick Point",
  anatomicalName: "Temporal Region (Pterion)",
  radius: 20,
  damage: { min: 35, max: 50, average: 42 },
  difficulty: 0.85,
  requiredForce: 40,
  safetyWarning: "EXTREMELY DANGEROUS - Can cause severe brain injury or death",
}
```

### Example 3: Taekyon Sweep Target

**Context**: Adding an ankle pressure point for Taekyon sweeping techniques.

```typescript
{
  id: "taekyon_ankle_sweep",
  names: {
    korean: "발목 쓸기점",
    english: "Ankle Sweep Point",
    romanized: "balmok sseul-gi-jeom",
  },
  position: { x: 110, y: 450 }, // Ankle region
  category: VitalPointCategory.SKELETAL,
  severity: VitalPointSeverity.MINOR,
  baseDamage: 15,
  effects: [
    {
      id: "balance_loss",
      type: VitalPointEffectType.BALANCE_DISRUPTION,
      intensity: EffectIntensity.MEDIUM,
      duration: 1500,
      description: {
        korean: "균형 상실",
        english: "Balance disruption",
      },
      stackable: false,
      source: "vital_point_system",
    },
    {
      id: "mobility_reduction",
      type: VitalPointEffectType.MOVEMENT_IMPAIRMENT,
      intensity: EffectIntensity.LOW,
      duration: 2000,
      description: {
        korean: "이동 장애",
        english: "Reduced mobility",
      },
      stackable: true,
      source: "vital_point_system",
    },
  ],
  description: {
    korean: "택견의 전통적인 발목 쓸기 기술로 상대의 균형을 무너뜨리는 압박점",
    english: "Traditional Taekyon ankle sweep technique pressure point for destabilizing opponents",
    romanized: "Taekyon-ui jeontong-jeogin balmok sseul-gi",
  },
  targetingDifficulty: 0.45, // Relatively easy to target
  effectiveStances: [
    TrigramStance.SON,  // Wind (flowing movement)
    TrigramStance.GON,  // Earth (grounding techniques)
  ],
  
  martialArtOrigin: 'taekyon',
  strikeType: 'kick',
  archetypeBonus: {
    jojik: 1.3,        // Organized crime +30% (street fighting)
    amsalja: 1.1,      // Shadow assassin +10% (setup techniques)
  },
  anatomicalDepth: 'surface',
  recoveryTime: 1500,
  
  korean: { korean: "발목 쓸기점", english: "Ankle Sweep Point" },
  english: "Ankle Sweep Point",
  anatomicalName: "Lateral Malleolus",
  radius: 25,
  damage: { min: 10, max: 20, average: 15 },
  difficulty: 0.45,
  requiredForce: 12,
  safetyWarning: "Can cause ankle sprains if executed improperly",
}
```

---

## Creating Korean Techniques

### Example 1: Hapkido Wrist Lock Technique

**File**: `src/systems/trigram/techniques.ts`

```typescript
// Add to TRIGRAM_TECHNIQUES[TrigramStance.TAE] array
{
  id: "hapkido_kotegaeshi",
  names: {
    korean: "손목꺾기",
    english: "Wrist Twist Throw",
    romanized: "sonmok-kkeokgi",
  },
  stance: TrigramStance.TAE, // Lake stance (fluid control)
  martialArt: 'hapkido',
  targetVitalPoints: [
    "hapkido_radial_nerve",  // Primary target
    "wrist_joint",           // Secondary joint lock
    "elbow_pressure",        // Continuation point
  ],
  kiCost: 15,
  staminaCost: 20,
  executionTime: 800, // 0.8 seconds
  damageMultiplier: 1.4,
  description: {
    korean: "합기도의 대표적인 손목꺾기 기술로 상대의 손목을 제어하여 제압하고 던지는 기법",
    english: "Signature Hapkido wrist twist technique that controls opponent's wrist to subdue and throw",
  },
  archetypeEffectiveness: {
    amsalja: 1.3,      // Shadow assassin - silent control
    jeongbo: 1.2,       // Intelligence operative - precision timing
    musa: 0.9,          // Traditional warrior - prefers direct strikes
    hacker: 1.0,        // Neutral
    jojik: 1.1,         // Organized crime - practical application
  },
  requirements: {
    minKi: 10,
    minStamina: 15,
    requiredStance: TrigramStance.TAE,
  },
  comboNextTechniques: [
    "hapkido_elbow_lock",
    "hapkido_throw_down",
  ],
  defensiveCounters: [
    TrigramStance.GAN,  // Mountain stance counters with solid defense
  ],
}
```

### Example 2: Taekwondo Spinning Hook Kick

```typescript
{
  id: "taekwondo_spinning_hook",
  names: {
    korean: "뒤후려차기",
    english: "Spinning Hook Kick",
    romanized: "dwi-huryeo-chagi",
  },
  stance: TrigramStance.JIN, // Thunder stance (explosive power)
  martialArt: 'taekwondo',
  targetVitalPoints: [
    "taekwondo_temple_kick",
    "head_jaw",
    "neck_side",
  ],
  kiCost: 25,
  staminaCost: 30,
  executionTime: 1200, // 1.2 seconds (longer due to spin)
  damageMultiplier: 2.0, // High damage but risky
  description: {
    korean: "태권도의 회전 후려차기로 강력한 원심력을 이용하여 상대의 머리를 타격하는 고급 기술",
    english: "Advanced Taekwondo spinning hook kick utilizing centrifugal force to strike opponent's head",
  },
  archetypeEffectiveness: {
    musa: 1.3,          // Traditional warrior - classical technique
    hacker: 1.15,       // Cyber warrior - calculated angles
    amsalja: 0.85,      // Shadow assassin - too flashy
    jeongbo: 1.0,       // Neutral
    jojik: 0.9,         // Organized crime - impractical
  },
  requirements: {
    minKi: 20,
    minStamina: 25,
    requiredStance: TrigramStance.JIN,
  },
  vulnerabilityWindow: 600, // Vulnerable during spin
  comboNextTechniques: [
    "taekwondo_ax_kick",
    "taekwondo_side_kick",
  ],
  defensiveCounters: [
    TrigramStance.GAN,  // Mountain stance blocks
    TrigramStance.GAM,  // Water stance evades
  ],
}
```

### Example 3: Taekyon Flow Combination

```typescript
{
  id: "taekyon_pumbalgi_flow",
  names: {
    korean: "품밟기 연속",
    english: "Taekyon Flow Step Combination",
    romanized: "pumbalpgi yeonseok",
  },
  stance: TrigramStance.SON, // Wind stance (continuous flow)
  martialArt: 'taekyon',
  targetVitalPoints: [
    "taekyon_ankle_sweep",
    "knee_joint",
    "thigh_muscle",
  ],
  kiCost: 18,
  staminaCost: 22,
  executionTime: 1000,
  damageMultiplier: 1.3,
  description: {
    korean: "택견의 전통적인 품밟기 기법으로 리듬감 있는 발놀림과 연속적인 쓸기 기술",
    english: "Traditional Taekyon rhythmic footwork with continuous sweeping techniques",
  },
  archetypeEffectiveness: {
    amsalja: 1.2,       // Shadow assassin - fluid unpredictable
    jojik: 1.25,        // Organized crime - street effective
    musa: 0.95,         // Traditional warrior - unconventional
    hacker: 1.1,        // Cyber warrior - pattern recognition
    jeongbo: 1.15,      // Intelligence operative - strategic
  },
  requirements: {
    minKi: 15,
    minStamina: 18,
    requiredStance: TrigramStance.SON,
  },
  comboChain: true, // Can chain multiple times
  comboNextTechniques: [
    "taekyon_ankle_sweep",
    "taekyon_push_off",
  ],
}
```

---

## Integrating with Trigram Stances

### Stance-Technique Mapping Example

**File**: `src/systems/trigram/techniques.ts`

```typescript
export const TRIGRAM_TECHNIQUES: Record<TrigramStance, readonly KoreanTechnique[]> = {
  [TrigramStance.GEON]: [
    // Heaven - Direct power (Taekwondo power techniques)
    TAEKWONDO_FRONT_KICK,
    TAEKWONDO_HAMMER_FIST,
    TAEKWONDO_BREAKING_STRIKE,
  ],
  
  [TrigramStance.TAE]: [
    // Lake - Fluid control (Hapkido joint locks)
    HAPKIDO_KOTEGAESHI,
    HAPKIDO_ELBOW_LOCK,
    HAPKIDO_SHOULDER_THROW,
  ],
  
  [TrigramStance.LI]: [
    // Fire - Precision (Taekwondo precision kicks)
    TAEKWONDO_AX_KICK,
    TAEKWONDO_SPINNING_HOOK,
    TAEKWONDO_PRESSURE_POINT_STRIKE,
  ],
  
  [TrigramStance.JIN]: [
    // Thunder - Explosive (Taekwondo jumping kicks)
    TAEKWONDO_JUMPING_SPIN_KICK,
    TAEKWONDO_FLYING_SIDE_KICK,
    TAEKWONDO_DOUBLE_KICK,
  ],
  
  [TrigramStance.SON]: [
    // Wind - Continuous (Taekyon flow techniques)
    TAEKYON_PUMBALGI_FLOW,
    TAEKYON_CONTINUOUS_SWEEP,
    TAEKYON_PUSH_PULL_COMBO,
  ],
  
  [TrigramStance.GAM]: [
    // Water - Adaptive (Hapkido redirections)
    HAPKIDO_CIRCLE_THROW,
    HAPKIDO_REDIRECT_STRIKE,
    HAPKIDO_FLOWING_COUNTER,
  ],
  
  [TrigramStance.GAN]: [
    // Mountain - Defensive (Hapkido blocks)
    HAPKIDO_SOLID_BLOCK,
    HAPKIDO_IMMOVABLE_STANCE,
    HAPKIDO_COUNTER_LOCK,
  ],
  
  [TrigramStance.GON]: [
    // Earth - Grounding (Ssireum takedowns)
    SSIREUM_LEG_TRIP,
    SSIREUM_BODY_SLAM,
    HAPKIDO_GROUND_PIN,
  ],
};
```

---

## Archetype Specializations

### Archetype Combat Style Implementation

**File**: `src/systems/types.ts`

```typescript
export const PLAYER_ARCHETYPES_DATA: Record<PlayerArchetype, PlayerArchetypeData> = {
  musa: {
    id: 'musa',
    names: {
      korean: '무사',
      english: 'Traditional Warrior',
    },
    description: {
      korean: '전통 무술의 정통성을 지키며 강력한 힘으로 상대를 제압하는 전사',
      english: 'Warrior who upholds traditional martial arts authenticity with overwhelming force',
    },
    favoredStances: [
      TrigramStance.GEON,  // Heaven - direct power
      TrigramStance.JIN,   // Thunder - explosive force
      TrigramStance.GAN,   // Mountain - solid defense
    ],
    martialArtsPreference: {
      taekwondo: 1.2,      // +20% classical Taekwondo
      hapkido: 1.0,        // Neutral
      taekyon: 0.9,        // -10% unconventional style
      ssireum: 1.1,        // +10% traditional grappling
    },
    combatPhilosophy: 'Honor through disciplined strength',
    specialAbility: {
      name: { korean: '무사의 기백', english: "Warrior's Spirit" },
      effect: 'Bone-breaking techniques deal +25% damage',
    },
  },
  
  amsalja: {
    id: 'amsalja',
    names: {
      korean: '암살자',
      english: 'Shadow Assassin',
    },
    description: {
      korean: '은밀한 접근과 신속한 제압으로 상대를 무력화하는 암살 전문가',
      english: 'Assassination specialist who neutralizes opponents through stealth and swift incapacitation',
    },
    favoredStances: [
      TrigramStance.TAE,   // Lake - fluid control
      TrigramStance.SON,   // Wind - continuous pressure
      TrigramStance.GAM,   // Water - adaptive flow
    ],
    martialArtsPreference: {
      hapkido: 1.3,        // +30% pressure points and locks
      taekyon: 1.15,       // +15% unpredictable flow
      taekwondo: 0.85,     // -15% too direct
      ssireum: 0.9,        // -10% too obvious
    },
    combatPhilosophy: 'Efficiency through invisibility and precision',
    specialAbility: {
      name: { korean: '암영의 일격', english: "Shadow Strike" },
      effect: 'Nerve strikes cause +30% longer paralysis duration',
    },
  },
  
  hacker: {
    id: 'hacker',
    names: {
      korean: '해커',
      english: 'Cyber Warrior',
    },
    description: {
      korean: '기술과 정보를 활용하여 계산된 정확한 타격으로 상대를 제압',
      english: 'Tech-enhanced fighter using calculated precision strikes based on data analysis',
    },
    favoredStances: [
      TrigramStance.LI,    // Fire - precision
      TrigramStance.SON,   // Wind - adaptability
      TrigramStance.JIN,   // Thunder - explosive timing
    ],
    martialArtsPreference: {
      taekwondo: 1.15,     // +15% precision kicks
      hapkido: 1.1,        // +10% technical locks
      taekyon: 1.0,        // Neutral
      ssireum: 0.95,       // -5% less technical
    },
    combatPhilosophy: 'Information as power, technology as edge',
    specialAbility: {
      name: { korean: '분석 타격', english: "Analytical Strike" },
      effect: '+15% accuracy on all vital point targeting',
    },
  },
  
  jeongbo: {
    id: 'jeongbo',
    names: {
      korean: '정보요원',
      english: 'Intelligence Operative',
    },
    description: {
      korean: '심리전과 관찰을 통해 적의 약점을 파악하고 정확한 타이밍에 공격',
      english: 'Strategic fighter who identifies weaknesses through psychology and observation',
    },
    favoredStances: [
      TrigramStance.GAM,   // Water - adaptation
      TrigramStance.LI,    // Fire - precision
      TrigramStance.GAN,   // Mountain - patience
    ],
    martialArtsPreference: {
      hapkido: 1.25,       // +25% defensive counters
      taekyon: 1.1,        // +10% strategic flow
      taekwondo: 1.0,      // Neutral
      ssireum: 0.95,       // -5% too straightforward
    },
    combatPhilosophy: 'Knowledge through observation, victory through timing',
    specialAbility: {
      name: { korean: '심리 파악', english: "Psychological Read" },
      effect: '+25% effectiveness on vascular vital points (blood pressure manipulation)',
    },
  },
  
  jojik: {
    id: 'jojik',
    names: {
      korean: '조직폭력배',
      english: 'Organized Crime',
    },
    description: {
      korean: '생존을 위한 비열한 전투 방식으로 규칙을 무시하고 상대를 제압',
      english: 'Street fighter who ignores rules, using dirty tactics for survival',
    },
    favoredStances: [
      TrigramStance.GON,   // Earth - takedowns
      TrigramStance.SON,   // Wind - unpredictable
      TrigramStance.GEON,  // Heaven - brute force
    ],
    martialArtsPreference: {
      ssireum: 1.3,        // +30% brutal grappling
      taekyon: 1.2,        // +20% street adaptability
      hapkido: 1.0,        // Neutral
      taekwondo: 0.85,     // -15% too formal
    },
    combatPhilosophy: 'Survival through ruthlessness, victory by any means',
    specialAbility: {
      name: { korean: '거리 생존술', english: "Street Survival" },
      effect: '+20% damage on "dirty" vital point strikes (groin, eyes, throat)',
    },
  },
};
```

---

## Testing Combat Systems

### Unit Test Example for New Vital Point

**File**: `src/systems/vitalpoint/VitalPointsData.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { VITAL_POINTS_DATA } from './VitalPointsData';
import { VitalPointCategory, VitalPointSeverity } from '@/types';

describe('Korean Martial Arts Vital Points', () => {
  describe('Hapkido Radial Nerve Point', () => {
    const radialNervePoint = VITAL_POINTS_DATA.find(
      vp => vp.id === 'hapkido_radial_nerve'
    );

    it('should exist in vital points database', () => {
      expect(radialNervePoint).toBeDefined();
    });

    it('should have correct Korean name', () => {
      expect(radialNervePoint?.names.korean).toBe('요골신경점');
    });

    it('should be categorized as neurological', () => {
      expect(radialNervePoint?.category).toBe(VitalPointCategory.NEUROLOGICAL);
    });

    it('should have moderate severity', () => {
      expect(radialNervePoint?.severity).toBe(VitalPointSeverity.MODERATE);
    });

    it('should provide arm paralysis effect', () => {
      const paralysisEffect = radialNervePoint?.effects.find(
        e => e.id === 'arm_paralysis'
      );
      expect(paralysisEffect).toBeDefined();
      expect(paralysisEffect?.duration).toBe(2000);
    });

    it('should have archetype bonuses', () => {
      expect(radialNervePoint?.archetypeBonus?.amsalja).toBe(1.3);
      expect(radialNervePoint?.archetypeBonus?.jeongbo).toBe(1.2);
    });

    it('should be shallow depth for pressure strikes', () => {
      expect(radialNervePoint?.anatomicalDepth).toBe('shallow');
    });
  });

  describe('Taekwondo Temple Kick Point', () => {
    const templeKickPoint = VITAL_POINTS_DATA.find(
      vp => vp.id === 'taekwondo_temple_kick'
    );

    it('should be high difficulty to target', () => {
      expect(templeKickPoint?.targetingDifficulty).toBeGreaterThanOrEqual(0.8);
    });

    it('should have critical severity', () => {
      expect(templeKickPoint?.severity).toBe(VitalPointSeverity.CRITICAL);
    });

    it('should favor musa archetype', () => {
      expect(templeKickPoint?.archetypeBonus?.musa).toBeGreaterThan(1.0);
    });
  });

  describe('Vital Points Database Integrity', () => {
    it('should have 70+ vital points', () => {
      expect(VITAL_POINTS_DATA.length).toBeGreaterThanOrEqual(70);
    });

    it('should have bilingual names for all points', () => {
      VITAL_POINTS_DATA.forEach(vp => {
        expect(vp.names.korean).toBeTruthy();
        expect(vp.names.english).toBeTruthy();
        expect(vp.names.romanized).toBeTruthy();
      });
    });

    it('should have unique IDs', () => {
      const ids = VITAL_POINTS_DATA.map(vp => vp.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should categorize all points', () => {
      VITAL_POINTS_DATA.forEach(vp => {
        expect(Object.values(VitalPointCategory)).toContain(vp.category);
      });
    });
  });
});
```

### Integration Test Example for Technique Execution

**File**: `src/systems/trigram/KoreanTechniques.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { KoreanTechniquesSystem } from './KoreanTechniques';
import { TrigramStance, PlayerArchetype } from '@/types';
import { createMockPlayer } from '@/test/test-utils';

describe('Korean Techniques System', () => {
  describe('Hapkido Techniques', () => {
    it('should allow amsalja to execute kotegaeshi effectively', () => {
      const player = createMockPlayer({
        currentStance: TrigramStance.TAE,
        archetype: PlayerArchetype.AMSALJA,
        ki: 20,
        stamina: 25,
      });

      const technique = KoreanTechniquesSystem.getTechniqueById('hapkido_kotegaeshi');
      expect(technique).toBeDefined();

      const canExecute = KoreanTechniquesSystem.canExecuteTechnique(player, technique!);
      expect(canExecute).toBe(true);

      // Check archetype effectiveness
      const effectiveness = technique?.archetypeEffectiveness?.amsalja;
      expect(effectiveness).toBe(1.3); // +30% bonus
    });

    it('should prevent execution without sufficient resources', () => {
      const player = createMockPlayer({
        currentStance: TrigramStance.TAE,
        ki: 5,  // Not enough Ki
        stamina: 10,  // Not enough Stamina
      });

      const technique = KoreanTechniquesSystem.getTechniqueById('hapkido_kotegaeshi');
      const canExecute = KoreanTechniquesSystem.canExecuteTechnique(player, technique!);
      expect(canExecute).toBe(false);
    });
  });

  describe('Taekwondo Techniques', () => {
    it('should favor musa archetype for spinning hook kick', () => {
      const technique = KoreanTechniquesSystem.getTechniqueById('taekwondo_spinning_hook');
      expect(technique?.archetypeEffectiveness?.musa).toBe(1.3);
    });

    it('should penalize amsalja for flashy techniques', () => {
      const technique = KoreanTechniquesSystem.getTechniqueById('taekwondo_spinning_hook');
      expect(technique?.archetypeEffectiveness?.amsalja).toBeLessThan(1.0);
    });
  });

  describe('Stance Effectiveness', () => {
    it('should calculate correct effectiveness for TAE vs GEON', () => {
      const effectiveness = KoreanTechniquesSystem.getTechniqueEffectiveness(
        TrigramStance.TAE,  // Fluid control
        TrigramStance.GEON  // Direct force
      );
      expect(effectiveness).toBeGreaterThan(1.0); // TAE counters GEON
    });
  });
});
```

---

## Best Practices Summary

When using the Korean Martial Arts Expert agent:

1. **Always provide bilingual names** (Korean, English, Romanization)
2. **Reference authentic martial arts sources** in descriptions
3. **Balance archetype effectiveness** - no archetype should dominate
4. **Respect anatomical reality** - vital points must have real anatomical basis
5. **Test thoroughly** - unit tests for data, integration tests for systems
6. **Document cultural context** - explain traditional martial arts philosophy
7. **Maintain consistency** - follow existing patterns in the codebase
8. **Consider all five archetypes** when designing techniques
9. **Apply Eight Trigram philosophy** to stance-technique relationships
10. **Ensure realistic combat applications** based on actual martial arts

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
