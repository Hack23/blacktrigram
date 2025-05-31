import type {
  PlayerState,
  KoreanTechnique,
  VitalPointHit,
  DamageResult, // Consolidated type from types/index.ts
  Condition,
  DamageType,
  VitalPoint,
} from "../../types";
import { TrigramSystem } from "../TrigramSystem";
import { TRIGRAM_DATA } from "../../types";

// Define DamageModifiers if not already in types/index.ts
// This seems specific to this module's internal calculations.
export interface DamageModifiers {
  multiplier: number;
  messages: string[];
  finalDamage: number; // This is a calculated value within modifiers, not the final DamageResult.damage
  baseDamage: number;
  critMultiplier: number;
  stanceAdvantage: number;
  vitalPointName: string;
}

const damageDescriptions: Record<string, string> = {
  light: "가벼운 타격",
  medium: "보통 타격",
  heavy: "강한 타격",
  critical: "치명타",
  block: "방어됨",
};

export class KoreanDamageCalculator {
  // Example: Define thresholds if they are class constants
  // private static readonly PERFECT_THRESHOLD = 0.95;
  // private static readonly CRITICAL_THRESHOLD = 0.85;
  // private static readonly MERIDIAN_DISRUPTION_THRESHOLD = 1.2;
  // private static readonly MAX_ELEMENTAL_BONUS = 0.5;
  // private static readonly GUARD_EFFECTIVENESS = 0.7;

  public static calculateBaseDamage(
    technique: KoreanTechnique,
    distance: number,
    precision: number
  ): DamageResult {
    const basePower = technique.damage;
    const distanceMultiplier = Math.max(0.3, 1 - distance / technique.range);
    const baseDmg = basePower * distanceMultiplier * precision;

    const damageType =
      baseDmg >= 35 && precision >= 0.9
        ? "critical"
        : baseDmg >= 25 && precision >= 0.7
        ? "heavy"
        : baseDmg >= 15 && precision >= 0.5
        ? "medium"
        : "light";

    const result: DamageResult = {
      damage: Math.round(baseDmg),
      baseDamage: baseDmg,
      isCritical: damageType === "critical",
      vitalPointHit: null,
      modifiers: [],
      description: "기본 계산된 손상",
      damageType: damageType,
    };
    return result;
  }

  public static applyVitalPointModifiers(
    baseDamage: number,
    vitalPoint: VitalPoint | null,
    precision: number,
    _technique?: KoreanTechnique
  ): DamageResult {
    let vitalPointBonus = 0;
    let meridianMultiplier = 1.0;
    let finalDamageType: DamageType = "light";
    let hitVitalPointKoreanName: string | undefined = undefined;
    let descriptionMessage = ""; // Initialize as empty string

    if (vitalPoint) {
      hitVitalPointKoreanName = vitalPoint.koreanName;
      vitalPointBonus = (vitalPoint.damageMultiplier - 1) * baseDamage;

      finalDamageType = KoreanDamageCalculator.determineDamageType(
        baseDamage,
        precision,
        vitalPoint
      );

      // Ensure string assignment with proper null checking
      descriptionMessage = hitVitalPointKoreanName
        ? `${hitVitalPointKoreanName} - ${damageDescriptions[finalDamageType]}`
        : damageDescriptions[finalDamageType] || "Basic attack";
    } else {
      // Handle non-vital point case
      if (baseDamage > 50 && precision > 0.9) finalDamageType = "critical";
      else if (baseDamage > 30 || precision > 0.7) finalDamageType = "heavy";
      else if (baseDamage > 10) finalDamageType = "medium";
      else finalDamageType = "light";
      descriptionMessage =
        damageDescriptions[finalDamageType] || "Basic attack"; // Ensure string
    }

    const totalDamage = Math.round(
      (baseDamage + vitalPointBonus) * meridianMultiplier
    );

    const result: DamageResult = {
      damage: totalDamage,
      baseDamage: baseDamage,
      isCritical: finalDamageType === "critical",
      vitalPointHit: vitalPoint
        ? ({
            hit: true,
            vitalPoint: vitalPoint,
            damage: totalDamage,
            critical: finalDamageType === "critical",
            description: descriptionMessage,
            effectiveness: precision,
          } as VitalPointHit)
        : null,
      modifiers: [],
      description: descriptionMessage,
      vitalPointBonus: vitalPointBonus,
      meridianMultiplier: meridianMultiplier,
      damageType: finalDamageType,
      // Set optional properties directly in object literal
      ...(hitVitalPointKoreanName && { koreanName: hitVitalPointKoreanName }),
      ...(vitalPoint?.name && { vitalPointName: vitalPoint.name }),
    };

    return result;
  }

  public static determineDamageType(
    baseDamage: number,
    precision: number,
    vitalPoint: VitalPoint | null // Uses imported VitalPoint
  ): DamageType {
    if (vitalPoint) {
      // Use damageMultiplier
      if (vitalPoint.damageMultiplier >= 1.8 && precision >= 0.9)
        return "critical";
      if (vitalPoint.damageMultiplier >= 1.5 || precision >= 0.75)
        return "heavy";
      if (vitalPoint.damageMultiplier >= 1.2 || precision >= 0.5)
        return "medium";
    } else {
      // No vital point hit
      if (baseDamage >= 35 && precision >= 0.9) return "critical";
      if (baseDamage >= 25 && precision >= 0.7) return "heavy";
      if (baseDamage >= 15 && precision >= 0.5) return "medium";
    }
    return "light";
  }

  public static calculateDamageOnVitalPoint(
    vitalPoint: VitalPoint,
    precision: number,
    baseDamageFromTechnique: number
  ): DamageResult {
    const damageType = KoreanDamageCalculator.determineDamageType(
      baseDamageFromTechnique,
      precision,
      vitalPoint
    );
    const vitalPointMultiplier = vitalPoint.damageMultiplier || 1.0;
    const finalDamageValue =
      baseDamageFromTechnique * vitalPointMultiplier * precision;
    const vitalPointBonusValue =
      (vitalPointMultiplier - 1.0) * baseDamageFromTechnique;

    const result: DamageResult = {
      damage: Math.round(finalDamageValue),
      baseDamage: baseDamageFromTechnique,
      isCritical: damageType === "critical",
      vitalPointHit: {
        hit: true,
        vitalPoint: vitalPoint,
        damage: Math.round(finalDamageValue),
        critical: damageType === "critical",
        description: `효과: ${vitalPoint.koreanName}에 ${precision.toFixed(
          2
        )} 정밀도로 타격`,
        // Ensure all required VitalPointHit properties are set
      } as VitalPointHit,
      modifiers: [],
      description: `효과: ${vitalPoint.koreanName}에 ${precision.toFixed(
        2
      )} 정밀도로 타격`,
      vitalPointBonus: vitalPointBonusValue,
      meridianMultiplier: 1.0, // Placeholder, adjust if meridian logic is added
      damageType: damageType,
      koreanName: vitalPoint.koreanName, // This is a string, should be fine
      vitalPointName: vitalPoint.name, // This is { english: string; korean: string; }, should be fine
    };
    return result;
  }
}

export function calculateBaseDamage(
  technique: KoreanTechnique,
  attacker: PlayerState,
  defender: PlayerState,
  vitalPointHit: VitalPointHit | null
): DamageResult {
  const modifiers = calculateDamageModifiers(
    technique,
    vitalPointHit,
    attacker,
    defender
  );
  const baseDamageValue = technique.damage || 0;
  let finalDamage = baseDamageValue * modifiers.multiplier;

  // Apply critical hit if applicable
  const techniqueCritChance = technique.critChance ?? 0.1;
  const isCritical =
    vitalPointHit?.critical || Math.random() < techniqueCritChance;
  if (isCritical) {
    finalDamage *= modifiers.critMultiplier;
    modifiers.messages.push("Critical Hit!");
  }

  finalDamage = Math.round(finalDamage);

  const hitVitalPointKoreanName = vitalPointHit?.vitalPoint?.koreanName;
  const hitVitalPointNameEnglish = vitalPointHit?.vitalPoint?.name?.english;

  // Ensure the description uses a string, e.g., from vitalPoint.koreanName or vitalPoint.name.korean
  let description = "Hit";
  if (hitVitalPointKoreanName) {
    description = `Hit ${hitVitalPointKoreanName}`;
    if (hitVitalPointNameEnglish) {
      description += ` (${hitVitalPointNameEnglish})`;
    }
  }

  const result: DamageResult = {
    damage: finalDamage,
    baseDamage: baseDamageValue,
    isCritical: isCritical,
    vitalPointHit: vitalPointHit,
    modifiers: modifiers.messages,
    description: description,
    damageType: "medium", // Add required damageType
    // Set optional properties conditionally
    ...(hitVitalPointKoreanName && { koreanName: hitVitalPointKoreanName }),
    ...(vitalPointHit?.vitalPoint?.name && {
      vitalPointName: vitalPointHit.vitalPoint.name,
    }),
  };

  return result;
}

export function calculateDamageModifiers(
  technique: KoreanTechnique,
  vitalPointHit: VitalPointHit | null,
  attacker: PlayerState,
  defender: PlayerState
): DamageModifiers {
  let overallMultiplier = 1.0;
  const messages: string[] = [];

  const stanceAdvantage = TrigramSystem.calculateStanceAdvantage(
    attacker.stance,
    defender.stance
  );
  if (stanceAdvantage > 1.0) {
    messages.push(
      `${TRIGRAM_DATA[attacker.stance].koreanName} has advantage over ${
        TRIGRAM_DATA[defender.stance].koreanName
      } (+${((stanceAdvantage - 1.0) * 100).toFixed(0)}%)`
    );
  } else if (stanceAdvantage < 1.0) {
    messages.push(
      `${TRIGRAM_DATA[attacker.stance].koreanName} is at disadvantage against ${
        TRIGRAM_DATA[defender.stance].koreanName
      } (${((1.0 - stanceAdvantage) * 100).toFixed(0)}%)`
    );
  }
  overallMultiplier *= stanceAdvantage;

  if (vitalPointHit?.hit && vitalPointHit.vitalPoint) {
    // Use damageMultiplier instead of baseDamageModifier
    const vpDamageMultiplier = vitalPointHit.vitalPoint.damageMultiplier ?? 1.0;
    overallMultiplier *= vpDamageMultiplier;
    messages.push(
      `Critical hit on ${vitalPointHit.vitalPoint.koreanName}! (x${
        // Access koreanName directly
        vpDamageMultiplier.toFixed(1)
      })`
    );
    vitalPointHit.vitalPoint.effects?.forEach((effect) => {
      messages.push(
        `Applied ${effect.type} due to ${
          vitalPointHit.vitalPoint?.koreanName ?? "vital point"
        } hit.`
      );
    });
  }

  if (technique.properties?.includes("armor_piercing")) {
    overallMultiplier *= 1.2; // Example multiplier
    messages.push(`${technique.koreanName || technique.name} pierces armor!`);
  }

  const defenderConditions = defender.conditions || [];
  defenderConditions.forEach((condition: Condition) => {
    if (condition.type === "vulnerable") {
      const magnitude = condition.magnitude ?? 1.5; // Access magnitude from Condition
      overallMultiplier *= magnitude;
      messages.push(
        `Defender is vulnerable! (+${((magnitude - 1.0) * 100).toFixed(0)}%)`
      );
    }
  });

  const techCritChance = technique.critChance ?? 0.1;
  const techCritMultiplier = technique.critMultiplier ?? 1.5;

  return {
    multiplier: overallMultiplier,
    messages: messages,
    finalDamage: Math.round((technique.damage || 0) * overallMultiplier),
    baseDamage: technique.damage || 0, // This is DamageModifiers, not DamageResult
    critMultiplier:
      vitalPointHit?.critical || Math.random() < techCritChance
        ? techCritMultiplier
        : 1.0,
    stanceAdvantage: stanceAdvantage,
    vitalPointName: vitalPointHit?.vitalPoint?.koreanName ?? "", // Ensure string
  };
}
