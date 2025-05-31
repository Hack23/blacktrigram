import { audioManager } from "../audio/AudioManager"; // Use default export
import type {
  PlayerState,
  KoreanTechnique,
  VitalPoint,
  AttackResult,
  StatusEffect,
  Condition,
  VitalPointHit, // This should now work with the export fixed
  VitalPointSystemConfig, // Assuming this is defined for vitalPointConfig
} from "../types";
import { TrigramSystem } from "./TrigramSystem";
import { VitalPointSystem } from "./VitalPointSystem";

// Fix vitalPointConfig to be compatible
const VITAL_POINT_CONFIG: VitalPointSystemConfig = {
  targetingDifficulty: 0.75,
  damageMultiplier: 1.8,
  effectChance: 0.6,
  baseAccuracy: 0.8,
  distanceModifier: 0.05,
};

export const CombatSystem = {
  resolveAttack(
    attacker: PlayerState,
    defender: PlayerState,
    technique: KoreanTechnique,
    targetedVitalPoints: VitalPoint[] = []
  ): AttackResult {
    const distance = Math.abs(attacker.position.x - defender.position.x);

    let baseHitChance = 0.9;
    if ("isDodging" in defender && defender.isDodging) {
      baseHitChance -= 0.3;
    }

    if (Math.random() > baseHitChance) {
      if (audioManager.playSFX) audioManager.playSFX("hit_light"); // Fix string argument
      return {
        hit: false,
        damage: 0,
        critical: false,
        blocked: false,
        conditionsApplied: [],
        attackerState: attacker,
        defenderState: defender,
        description: "Attack missed",
      };
    }

    if (defender.isBlocking) {
      const blockEffectiveness = 0.7;
      const damageAfterBlock =
        (technique.damage || 0) * (1 - blockEffectiveness);
      if (audioManager.playSFX) audioManager.playSFX("block_success"); // Fix string argument
      return {
        hit: true,
        damage: Math.floor(damageAfterBlock),
        critical: false,
        blocked: true,
        conditionsApplied: [],
        attackerState: attacker,
        defenderState: {
          ...defender,
          stamina: Math.max(0, defender.stamina - 5),
        },
        description: "Attack blocked",
      };
    }

    const stanceAdvantage = TrigramSystem.calculateStanceAdvantage(
      attacker.stance,
      defender.stance
    );

    let vitalPointMultiplier = 1.0;
    let vitalPointHitDetail: VitalPointHit | null = null;
    if (targetedVitalPoints.length > 0 && targetedVitalPoints[0]) {
      vitalPointHitDetail = VitalPointSystem.checkVitalPointHit(
        defender.position,
        targetedVitalPoints[0],
        technique,
        distance,
        VITAL_POINT_CONFIG
      );
      if (vitalPointHitDetail?.vitalPoint) {
        vitalPointMultiplier =
          vitalPointHitDetail.vitalPoint.damageMultiplier || 1.5;
      }
    }

    let finalDamage = technique.damage || 0;
    finalDamage *= stanceAdvantage;
    finalDamage *= vitalPointMultiplier;

    const techniqueCritChance =
      "critChance" in technique ? technique.critChance : 0.1;
    const isCriticalHit = Math.random() < (techniqueCritChance || 0.1);
    if (isCriticalHit) {
      const techniqueCritMultiplier =
        "critMultiplier" in technique ? technique.critMultiplier : 1.5;
      finalDamage *= techniqueCritMultiplier || 1.5;
    }

    finalDamage = Math.floor(finalDamage);

    const conditionsApplied: Condition[] = [];
    if ("effects" in technique && technique.effects) {
      (technique.effects as StatusEffect[]).forEach((effect: StatusEffect) => {
        if (Math.random() < (effect.chance || 1.0)) {
          conditionsApplied.push({
            type: effect.type,
            duration: effect.duration,
            magnitude: effect.magnitude || 1.0,
            source: attacker.playerId,
          });
        }
      });
    }
    if (
      vitalPointHitDetail &&
      "effectsApplied" in vitalPointHitDetail &&
      vitalPointHitDetail.effectsApplied
    ) {
      (vitalPointHitDetail.effectsApplied as StatusEffect[]).forEach(
        (effect: StatusEffect) => {
          if (Math.random() < (effect.chance || 1.0)) {
            conditionsApplied.push({
              type: effect.type,
              duration: effect.duration,
              magnitude: effect.magnitude || 1.0,
              source: attacker.playerId,
            });
          }
        }
      );
    }

    if (audioManager.playAttackSound)
      audioManager.playAttackSound(technique.damage || 10); // Fix to use number
    if (audioManager.playHitSound)
      audioManager.playHitSound(
        finalDamage, // Use number instead of string
        isCriticalHit
      );

    return {
      hit: true,
      damage: finalDamage,
      critical: isCriticalHit,
      blocked: false,
      conditionsApplied,
      attackerState: { ...attacker, ki: attacker.ki - (technique.kiCost || 5) },
      defenderState: {
        ...defender,
        health: Math.max(0, defender.health - finalDamage),
        conditions: [...defender.conditions, ...conditionsApplied],
      },
      description: `${technique.name} hit for ${finalDamage} damage`,
    };
  },

  // ... other combat system methods
  // calculateEffectiveDamage, applyConditions, checkWinCondition, etc.
};

// function calculateEffectiveDamage is declared but its value is never read.
// This function seems to be part of the internal logic of resolveAttack or a helper.
// If it's meant to be exported, it should be part of the CombatSystem object.
// For now, assuming it's a helper or its logic is incorporated above.
