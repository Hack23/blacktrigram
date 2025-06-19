/**
 * @fileoverview Effect utility functions for Korean martial arts combat system
 */

import type {
  HitEffect,
  DisplayHitEffect,
  StatusEffect,
  HitEffectType,
  EffectIntensity,
} from "../types/effects";
import type { KoreanText } from "../types/korean-text";
import { KOREAN_COLORS } from "../types/constants";

/**
 * Creates a hit effect with Korean martial arts context
 */
export function createHitEffect(
  id: string,
  type: HitEffectType,
  attackerId: string,
  defenderId: string,
  position: { x: number; y: number },
  damage: number,
  duration: number = 1500
): HitEffect {
  return {
    id,
    type,
    attackerId,
    defenderId,
    timestamp: Date.now(),
    duration,
    position,
    intensity: Math.min(damage / 20, 2.0), // Normalize damage to intensity (0-2.0)
    startTime: Date.now(),
    text: getEffectText(type),
  };
}

/**
 * Gets Korean text for hit effect type
 */
export function getEffectText(type: HitEffectType): string {
  switch (type) {
    case "hit":
      return "타격!";
    case "critical_hit":
      return "치명타!";
    case "technique_hit":
      return "기술!";
    case "vital_point_hit":
      return "급소!";
    case "stun":
      return "기절!";
    case "ko":
      return "KO!";
    case "block":
      return "방어!";
    case "counter":
      return "반격!";
    case "dodge":
      return "회피!";
    case "absorb":
      return "흡수!";
    default:
      return "효과";
  }
}

/**
 * Converts a hit effect to display hit effect with animation properties
 */
export function createDisplayHitEffect(
  hitEffect: HitEffect,
  currentTime: number
): DisplayHitEffect {
  const elapsed = currentTime - hitEffect.startTime;
  const progress = Math.min(elapsed / hitEffect.duration, 1.0);

  // Animation curves for different properties
  const opacity = Math.max(0, 1.0 - progress);
  const scale = 1.0 + progress * 0.5; // Grows by 50% over time
  const displayAlpha = opacity * 0.8; // Slightly more transparent
  const displayY = hitEffect.position?.y || 0 - progress * 30; // Floats upward
  const displaySize = 12 + hitEffect.intensity * 8; // Size based on intensity

  return {
    ...hitEffect,
    opacity,
    scale,
    displayAlpha,
    displayY,
    displaySize,
  };
}

/**
 * Creates a status effect for Korean martial arts
 */
export function createStatusEffect(
  id: string,
  type: StatusEffect["type"],
  intensity: EffectIntensity,
  duration: number,
  source: string
): StatusEffect {
  const startTime = Date.now();

  return {
    id,
    type,
    intensity,
    duration,
    description: getStatusEffectDescription(type, intensity),
    stackable: isStatusEffectStackable(type),
    source,
    startTime,
    endTime: startTime + duration,
  };
}

/**
 * Gets Korean description for status effect type
 */
export function getStatusEffectDescription(
  type: StatusEffect["type"],
  intensity: EffectIntensity
): KoreanText {
  const descriptions: Record<
    StatusEffect["type"],
    Record<EffectIntensity, KoreanText>
  > = {
    stun: {
      low: { korean: "가벼운 기절", english: "Light Stun" },
      medium: { korean: "기절", english: "Stun" },
      high: { korean: "심한 기절", english: "Heavy Stun" },
      extreme: { korean: "완전 기절", english: "Complete Stun" },
    },
    poison: {
      low: { korean: "경미한 중독", english: "Minor Poison" },
      medium: { korean: "중독", english: "Poison" },
      high: { korean: "심한 중독", english: "Heavy Poison" },
      extreme: { korean: "치명적 중독", english: "Lethal Poison" },
    },
    burn: {
      low: { korean: "가벼운 화상", english: "Minor Burn" },
      medium: { korean: "화상", english: "Burn" },
      high: { korean: "심한 화상", english: "Severe Burn" },
      extreme: { korean: "치명적 화상", english: "Critical Burn" },
    },
    bleed: {
      low: { korean: "가벼운 출혈", english: "Minor Bleeding" },
      medium: { korean: "출혈", english: "Bleeding" },
      high: { korean: "심한 출혈", english: "Heavy Bleeding" },
      extreme: { korean: "대량 출혈", english: "Massive Bleeding" },
    },
    strengthened: {
      low: { korean: "약간 강화", english: "Slightly Strengthened" },
      medium: { korean: "강화", english: "Strengthened" },
      high: { korean: "크게 강화", english: "Greatly Strengthened" },
      extreme: { korean: "극도로 강화", english: "Extremely Strengthened" },
    },
    weakened: {
      low: { korean: "약간 약화", english: "Slightly Weakened" },
      medium: { korean: "약화", english: "Weakened" },
      high: { korean: "크게 약화", english: "Greatly Weakened" },
      extreme: { korean: "극도로 약화", english: "Extremely Weakened" },
    },
  };

  return (
    descriptions[type]?.[intensity] || {
      korean: "알 수 없는 효과",
      english: "Unknown Effect",
    }
  );
}

/**
 * Determines if a status effect type can stack
 */
export function isStatusEffectStackable(type: StatusEffect["type"]): boolean {
  const stackableTypes: StatusEffect["type"][] = ["poison", "burn", "bleed"];
  return stackableTypes.includes(type);
}

/**
 * Gets the color for a status effect based on its type
 */
export function getStatusEffectColor(type: StatusEffect["type"]): number {
  const colorMap: Record<StatusEffect["type"], number> = {
    stun: KOREAN_COLORS.WARNING_YELLOW,
    poison: KOREAN_COLORS.POSITIVE_GREEN,
    burn: KOREAN_COLORS.ACCENT_RED,
    bleed: KOREAN_COLORS.NEGATIVE_RED,
    strengthened: KOREAN_COLORS.ACCENT_GOLD,
    weakened: KOREAN_COLORS.UI_GRAY,
  };

  return colorMap[type] || KOREAN_COLORS.NEUTRAL_GRAY;
}

/**
 * Calculates if a status effect has expired
 */
export function isStatusEffectExpired(
  effect: StatusEffect,
  currentTime: number
): boolean {
  return currentTime >= effect.endTime;
}

/**
 * Gets remaining duration for a status effect in seconds
 */
export function getStatusEffectRemainingDuration(
  effect: StatusEffect,
  currentTime: number
): number {
  const remaining = Math.max(0, effect.endTime - currentTime);
  return Math.round(remaining / 1000);
}

/**
 * Applies Korean martial arts philosophy to effect intensity calculation
 */
export function calculateTrigramEffectIntensity(
  baseIntensity: number,
  attackerStance: string,
  defenderStance: string
): number {
  // Traditional Korean martial arts emphasize balance and flow
  // Effects are modified based on trigram relationships
  const stanceMultipliers: Record<string, number> = {
    geon: 1.2, // Heaven - Strong effects
    tae: 0.9, // Lake - Gentle effects
    li: 1.1, // Fire - Intense effects
    jin: 1.3, // Thunder - Shocking effects
    son: 0.8, // Wind - Light effects
    gam: 1.0, // Water - Balanced effects
    gan: 0.7, // Mountain - Defensive effects
    gon: 1.1, // Earth - Grounding effects
  };

  const attackerMultiplier = stanceMultipliers[attackerStance] || 1.0;
  const defenderMultiplier = stanceMultipliers[defenderStance] || 1.0;

  // Calculate final intensity based on trigram philosophy
  return baseIntensity * attackerMultiplier * (2.0 - defenderMultiplier);
}

/**
 * Updates display effects for animation
 */
export function updateDisplayEffects(
  effects: readonly HitEffect[],
  currentTime: number
): DisplayHitEffect[] {
  return effects
    .filter((effect) => !isEffectExpired(effect, currentTime))
    .map((effect) => createDisplayHitEffect(effect, currentTime));
}

/**
 * Checks if an effect has expired
 */
export function isEffectExpired(
  effect: HitEffect,
  currentTime: number
): boolean {
  return currentTime >= effect.startTime + effect.duration;
}

/**
 * Removes expired effects from a list
 */
export function removeExpiredEffects<T extends HitEffect>(
  effects: readonly T[],
  currentTime: number
): T[] {
  return effects.filter((effect) => !isEffectExpired(effect, currentTime));
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
