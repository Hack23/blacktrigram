import type {
  HitEffect,
  StatusEffect,
  EffectType,
  EffectIntensity,
} from "../types/effects";
import type { Position, KoreanText } from "../types";
import { HitEffectType } from "../types/effects";

/**
 * Create a hit effect for visual feedback
 */
export function createHitEffect(
  id: string,
  type: HitEffectType,
  position: Position,
  intensity: number,
  duration: number = 1000
): HitEffect {
  return {
    id,
    type,
    attackerId: "unknown",
    defenderId: "unknown",
    timestamp: Date.now(),
    duration,
    position,
    intensity,
    lifespan: duration,
    alpha: 1.0,
    size: 1.0,
    startTime: Date.now(),
  };
}

/**
 * Get hit effect color based on type
 */
export function getHitEffectColor(type: HitEffectType): number {
  switch (type) {
    case HitEffectType.CRITICAL_HIT:
      return 0xff6b00; // Orange
    case HitEffectType.VITAL_POINT_STRIKE:
      return 0xff0000; // Red
    case HitEffectType.BLOCK:
      return 0x4a90e2; // Blue
    case HitEffectType.MISS:
      return 0x888888; // Gray
    default:
      return 0xffffff; // White
  }
}

/**
 * Create a status effect
 */
export function createStatusEffect(
  id: string,
  type: EffectType,
  intensity: EffectIntensity,
  duration: number,
  description: KoreanText,
  source: string = "unknown"
): StatusEffect {
  const currentTime = Date.now();
  return {
    id,
    type,
    intensity,
    duration,
    description,
    stackable: false,
    source,
    startTime: currentTime,
    endTime: currentTime + duration,
  };
}

/**
 * Calculate effect intensity based on damage
 */
export function calculateEffectIntensity(damage: number): EffectIntensity {
  // Fix: Use proper EffectIntensity values from effects.ts
  if (damage >= 50) return "extreme" as EffectIntensity;
  if (damage >= 30) return "high" as EffectIntensity;
  if (damage >= 15) return "medium" as EffectIntensity;
  return "weak" as EffectIntensity;
}

/**
 * Get effect duration modifier based on type
 */
export function getEffectDurationModifier(type: EffectType): number {
  switch (type) {
    case "bleed": // Fix: Use string literal instead of enum
      return 1.5;
    case "poison":
      return 2.0;
    case "stun":
      return 0.5;
    case "burn":
      return 1.2;
    default:
      return 1.0;
  }
}

/**
 * Apply effect to player stats
 */
export function applyEffectModifiers(
  baseValue: number,
  effects: readonly StatusEffect[],
  statType: "attack" | "defense" | "speed"
): number {
  let modifier = 1.0;

  effects.forEach((effect) => {
    switch (effect.type) {
      case "bleed":
        if (statType === "attack") modifier *= 0.9;
        break;
      case "strengthened":
        if (statType === "attack") modifier *= 1.2;
        break;
      case "weakened":
        modifier *= 0.8;
        break;
      case "exhausted":
        if (statType === "speed") modifier *= 0.7;
        break;
    }
  });

  return Math.floor(baseValue * modifier);
}

/**
 * Check if effect is beneficial or harmful
 */
export function isEffectBeneficial(type: EffectType): boolean {
  const beneficialEffects: EffectType[] = [
    "focused",
    "rage",
    "defensive",
    "strengthened",
  ];
  return beneficialEffects.includes(type);
}

/**
 * Get effect description based on type and intensity
 */
export function getEffectDescription(
  type: EffectType,
  intensity: EffectIntensity
): KoreanText {
  const descriptions: Record<
    EffectType,
    Record<EffectIntensity, KoreanText>
  > = {
    stun: {
      weak: { korean: "가벼운 기절", english: "Light Stun" },
      minor: { korean: "경미한 기절", english: "Minor Stun" },
      medium: { korean: "기절", english: "Stun" },
      moderate: { korean: "기절", english: "Stun" },
      high: { korean: "심한 기절", english: "Heavy Stun" },
      severe: { korean: "심한 기절", english: "Severe Stun" },
      critical: { korean: "완전 기절", english: "Complete Stun" },
      extreme: { korean: "완전 기절", english: "Complete Stun" },
      low: { korean: "약한 기절", english: "Weak Stun" },
    },
    poison: {
      weak: { korean: "경미한 중독", english: "Minor Poison" },
      minor: { korean: "경미한 중독", english: "Minor Poison" },
      medium: { korean: "중독", english: "Poison" },
      moderate: { korean: "중독", english: "Poison" },
      high: { korean: "심한 중독", english: "Severe Poison" },
      severe: { korean: "심한 중독", english: "Severe Poison" },
      critical: { korean: "치명적 중독", english: "Lethal Poison" },
      extreme: { korean: "치명적 중독", english: "Lethal Poison" },
      low: { korean: "약한 중독", english: "Weak Poison" },
    },
    weakened: {
      weak: { korean: "약간 약화", english: "Slightly Weakened" },
      minor: { korean: "경미한 약화", english: "Minor Weakness" },
      medium: { korean: "약화", english: "Weakened" },
      moderate: { korean: "약화", english: "Weakened" },
      high: { korean: "심하게 약화", english: "Severely Weakened" },
      severe: { korean: "심하게 약화", english: "Severely Weakened" },
      critical: { korean: "극도로 약화", english: "Critically Weakened" },
      extreme: { korean: "극도로 약화", english: "Critically Weakened" },
      low: { korean: "약간 약화", english: "Slightly Weakened" },
    },
    burn: {
      weak: { korean: "가벼운 화상", english: "Minor Burn" },
      minor: { korean: "경미한 화상", english: "Minor Burn" },
      medium: { korean: "화상", english: "Burn" },
      moderate: { korean: "화상", english: "Burn" },
      high: { korean: "심한 화상", english: "Severe Burn" },
      severe: { korean: "심한 화상", english: "Severe Burn" },
      critical: { korean: "치명적 화상", english: "Critical Burn" },
      extreme: { korean: "치명적 화상", english: "Critical Burn" },
      low: { korean: "약한 화상", english: "Weak Burn" },
    },
    bleed: {
      weak: { korean: "가벼운 출혈", english: "Minor Bleeding" },
      minor: { korean: "경미한 출혈", english: "Minor Bleeding" },
      medium: { korean: "출혈", english: "Bleeding" },
      moderate: { korean: "출혈", english: "Bleeding" },
      high: { korean: "심한 출혈", english: "Heavy Bleeding" },
      severe: { korean: "심한 출혈", english: "Severe Bleeding" },
      critical: { korean: "치명적 출혈", english: "Critical Bleeding" },
      extreme: { korean: "치명적 출혈", english: "Critical Bleeding" },
      low: { korean: "약한 출혈", english: "Weak Bleeding" },
    },
    exhausted: {
      weak: { korean: "약간 지침", english: "Slightly Tired" },
      minor: { korean: "경미한 피로", english: "Minor Fatigue" },
      medium: { korean: "지침", english: "Exhausted" },
      moderate: { korean: "지침", english: "Exhausted" },
      high: { korean: "심하게 지침", english: "Severely Exhausted" },
      severe: { korean: "심하게 지침", english: "Severely Exhausted" },
      critical: { korean: "완전 탈진", english: "Completely Drained" },
      extreme: { korean: "완전 탈진", english: "Completely Drained" },
      low: { korean: "약간 피로", english: "Slightly Fatigued" },
    },
    focused: {
      weak: { korean: "약간 집중", english: "Slightly Focused" },
      minor: { korean: "경미한 집중", english: "Minor Focus" },
      medium: { korean: "집중", english: "Focused" },
      moderate: { korean: "집중", english: "Focused" },
      high: { korean: "깊은 집중", english: "Deeply Focused" },
      severe: { korean: "깊은 집중", english: "Deeply Focused" },
      critical: { korean: "완전 집중", english: "Completely Focused" },
      extreme: { korean: "완전 집중", english: "Completely Focused" },
      low: { korean: "약한 집중", english: "Weak Focus" },
    },
    rage: {
      weak: { korean: "약간 분노", english: "Slightly Enraged" },
      minor: { korean: "경미한 분노", english: "Minor Rage" },
      medium: { korean: "분노", english: "Enraged" },
      moderate: { korean: "분노", english: "Enraged" },
      high: { korean: "맹렬한 분노", english: "Furious" },
      severe: { korean: "맹렬한 분노", english: "Furious" },
      critical: { korean: "광분", english: "Berserk" },
      extreme: { korean: "광분", english: "Berserk" },
      low: { korean: "약한 분노", english: "Weak Rage" },
    },
    defensive: {
      weak: { korean: "약간 방어적", english: "Slightly Defensive" },
      minor: { korean: "경미한 방어", english: "Minor Defense" },
      medium: { korean: "방어적", english: "Defensive" },
      moderate: { korean: "방어적", english: "Defensive" },
      high: { korean: "높은 방어", english: "Highly Defensive" },
      severe: { korean: "높은 방어", english: "Highly Defensive" },
      critical: { korean: "완벽한 방어", english: "Perfect Defense" },
      extreme: { korean: "완벽한 방어", english: "Perfect Defense" },
      low: { korean: "약한 방어", english: "Weak Defense" },
    },
    strengthened: {
      weak: { korean: "약간 강화", english: "Slightly Strengthened" },
      minor: { korean: "경미한 강화", english: "Minor Strength" },
      medium: { korean: "강화", english: "Strengthened" },
      moderate: { korean: "강화", english: "Strengthened" },
      high: { korean: "크게 강화", english: "Greatly Strengthened" },
      severe: { korean: "크게 강화", english: "Greatly Strengthened" },
      critical: { korean: "극대 강화", english: "Maximally Strengthened" },
      extreme: { korean: "극대 강화", english: "Maximally Strengthened" },
      low: { korean: "약한 강화", english: "Weak Strength" },
    },
    paralysis: {
      weak: { korean: "가벼운 마비", english: "Minor Paralysis" },
      minor: { korean: "경미한 마비", english: "Minor Paralysis" },
      medium: { korean: "마비", english: "Paralysis" },
      moderate: { korean: "마비", english: "Paralysis" },
      high: { korean: "심한 마비", english: "Severe Paralysis" },
      severe: { korean: "심한 마비", english: "Severe Paralysis" },
      critical: { korean: "완전 마비", english: "Complete Paralysis" },
      extreme: { korean: "완전 마비", english: "Complete Paralysis" },
      low: { korean: "약한 마비", english: "Weak Paralysis" },
    },
    confusion: {
      weak: { korean: "약간 혼란", english: "Slight Confusion" },
      minor: { korean: "경미한 혼란", english: "Minor Confusion" },
      medium: { korean: "혼란", english: "Confusion" },
      moderate: { korean: "혼란", english: "Confusion" },
      high: { korean: "심한 혼란", english: "Severe Confusion" },
      severe: { korean: "심한 혼란", english: "Severe Confusion" },
      critical: { korean: "완전 혼란", english: "Complete Confusion" },
      extreme: { korean: "완전 혼란", english: "Complete Confusion" },
      low: { korean: "약한 혼란", english: "Weak Confusion" },
    },
    vulnerability: {
      weak: { korean: "약간 취약", english: "Slightly Vulnerable" },
      minor: { korean: "경미한 취약", english: "Minor Vulnerability" },
      medium: { korean: "취약", english: "Vulnerable" },
      moderate: { korean: "취약", english: "Vulnerable" },
      high: { korean: "매우 취약", english: "Very Vulnerable" },
      severe: { korean: "매우 취약", english: "Very Vulnerable" },
      critical: { korean: "극도로 취약", english: "Extremely Vulnerable" },
      extreme: { korean: "극도로 취약", english: "Extremely Vulnerable" },
      low: { korean: "약한 취약", english: "Weak Vulnerability" },
    },
    stamina_drain: {
      weak: { korean: "체력 소모", english: "Stamina Drain" },
      minor: { korean: "경미한 체력 소모", english: "Minor Stamina Drain" },
      medium: { korean: "체력 고갈", english: "Stamina Depletion" },
      moderate: { korean: "체력 고갈", english: "Stamina Depletion" },
      high: { korean: "심한 체력 고갈", english: "Severe Stamina Loss" },
      severe: { korean: "심한 체력 고갈", english: "Severe Stamina Loss" },
      critical: { korean: "완전 체력 고갈", english: "Complete Stamina Loss" },
      extreme: { korean: "완전 체력 고갈", english: "Complete Stamina Loss" },
      low: { korean: "약한 체력 소모", english: "Weak Stamina Drain" },
    },
  };

  return (
    descriptions[type]?.[intensity] || {
      korean: `${type} 효과`,
      english: `${type} effect`,
    }
  );
}

/**
 * Update effect over time
 */
export function updateEffect(
  effect: StatusEffect,
  currentTime: number
): StatusEffect | null {
  if (currentTime >= effect.endTime) {
    return null; // Effect has expired
  }

  return effect; // Effect is still active
}

/**
 * Combine multiple effects of same type
 */
export function combineEffects(effects: StatusEffect[]): StatusEffect[] {
  const combinedEffects: StatusEffect[] = [];
  // Fix: Use string type instead of EffectType since StatusEffect.type is string
  const effectsByType = new Map<string, StatusEffect[]>();

  // Group effects by type
  effects.forEach((effect) => {
    // Fix: effect.type is string, so use string methods
    if (!effectsByType.has(effect.type)) {
      effectsByType.set(effect.type, []);
    }
    effectsByType.get(effect.type)!.push(effect);
  });

  // Combine stackable effects, keep latest non-stackable
  effectsByType.forEach((typeEffects, _) => {
    if (typeEffects.length === 0) return;

    const firstEffect = typeEffects[0];
    if (firstEffect.stackable) {
      // Keep all stackable effects
      combinedEffects.push(...typeEffects);
    } else {
      // Keep only the latest non-stackable effect
      const latestEffect = typeEffects.reduce((latest, current) =>
        current.startTime > latest.startTime ? current : latest
      );
      combinedEffects.push(latestEffect);
    }
  });

  return combinedEffects;
}

/**
 * Remove expired effects
 */
export function removeExpiredEffects(effects: StatusEffect[]): StatusEffect[] {
  const currentTime = Date.now();
  return effects.filter((effect) => effect.endTime > currentTime);
}

/**
 * Create effect from Korean text
 */
export function createEffectFromKoreanText(
  koreanText: string,
  englishText: string,
  duration: number = 3000
): StatusEffect {
  // Fix: Provide all required arguments
  return createStatusEffect(
    koreanText.toLowerCase(),
    "stun" as EffectType, // Use proper EffectType
    "medium" as EffectIntensity,
    duration,
    {
      korean: koreanText,
      english: englishText,
    }
  );
}

/**
 * Get effect display text
 */
export function getEffectDisplayText(
  effect: StatusEffect,
  preferKorean: boolean = true
): string {
  return preferKorean ? effect.description.korean : effect.description.english;
}

// Fix: Korean martial arts specific effect utilities
export function createKoreanStatusEffect(
  koreanName: string,
  englishName: string,
  intensity: EffectIntensity = "medium" as EffectIntensity,
  duration: number = 3000
): StatusEffect {
  return createStatusEffect(
    koreanName.toLowerCase().replace(/\s+/g, "_"),
    "stun" as EffectType, // This is correct - keep as is
    intensity,
    duration,
    { korean: koreanName, english: englishName }
  );
}

export function createVitalPointEffect(
  vitalPointName: string,
  effectType: EffectType,
  duration: number = 5000
): StatusEffect {
  return createStatusEffect(
    `vital_point_${effectType}`,
    effectType, // This is correct - use the parameter directly
    "medium" as EffectIntensity,
    duration,
    {
      korean: `${vitalPointName} 급소 타격`,
      english: `${vitalPointName} vital point strike`,
    }
  );
}

export function createTrigramEffect(
  stanceName: string,
  effectType: EffectType,
  duration: number = 2000
): StatusEffect {
  return createStatusEffect(
    `trigram_${stanceName}_${effectType}`,
    effectType, // This is correct - use the parameter directly
    "medium" as EffectIntensity,
    duration,
    {
      korean: `${stanceName}괘 효과`,
      english: `${stanceName} trigram effect`,
    }
  );
}

// Fix: Group effects by type using proper typing
export function groupEffectsByTypeEnum(
  effects: StatusEffect[]
): Map<EffectType, StatusEffect[]> {
  const effectsByType = new Map<EffectType, StatusEffect[]>();

  for (const effect of effects) {
    // Cast string to EffectType for enum operations
    const effectType = effect.type as EffectType;
    if (!effectsByType.has(effectType)) {
      effectsByType.set(effectType, []);
    }
    effectsByType.get(effectType)!.push(effect);
  }

  return effectsByType;
}

/**
 * Group effects by type using string keys (works with StatusEffect.type)
 */
export function groupEffectsByType(
  effects: StatusEffect[]
): Map<string, StatusEffect[]> {
  const effectsByType = new Map<string, StatusEffect[]>();

  for (const effect of effects) {
    // Fix: Use string type directly since StatusEffect.type is string
    if (!effectsByType.has(effect.type)) {
      effectsByType.set(effect.type, []);
    }
    effectsByType.get(effect.type)!.push(effect);
  }

  return effectsByType;
}
