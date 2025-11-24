/**
 * Pain Response System for managing cumulative pain effects in combat.
 * 
 * **Korean**: 고통 반응 시스템 (Pain Response System)
 * 
 * Implements realistic pain accumulation that progressively reduces combat
 * effectiveness. Unlike health, pain represents the body's protective response
 * to damage, reducing capabilities before critical injury occurs.
 * 
 * ## Pain Mechanics
 * 
 * - **충격통 (Shock Pain)**: Instant reaction affecting all abilities
 * - **누적외상 (Cumulative Trauma)**: Progressive damage impairment
 * - **통증과부하 (Pain Overload)**: Complete incapacitation from overwhelming pain
 * - **무력화한계 (Incapacitation Threshold)**: Point of complete combat inability
 * 
 * @module systems/combat/PainResponseSystem
 * @category Combat System
 * @korean 고통반응시스템
 */

import { PlayerState } from "../player";
import { VitalPointSeverity } from "@/types";

/**
 * Pain level categories for status indication.
 */
export enum PainLevel {
  /** No significant pain (0-20) */
  NONE = "none",
  /** Light discomfort (21-40) */
  LIGHT = "light",
  /** Moderate pain affecting performance (41-60) */
  MODERATE = "moderate",
  /** Severe pain causing impairment (61-80) */
  SEVERE = "severe",
  /** Overwhelming pain, near incapacitation (81-100) */
  OVERWHELMING = "overwhelming",
}

/**
 * Effects of pain on combat performance.
 */
interface PainEffects {
  /** Pain value range */
  readonly range: readonly [number, number];
  /** Overall effectiveness multiplier */
  readonly effectivenessMultiplier: number;
  /** Movement speed penalty */
  readonly movementPenalty: number;
  /** Accuracy penalty */
  readonly accuracyPenalty: number;
  /** Stamina drain multiplier */
  readonly staminaDrainMultiplier: number;
}

/**
 * Pain Response System managing cumulative pain effects.
 * 
 * Pain accumulates from all damage sources and reduces combat effectiveness
 * progressively. High pain can incapacitate even if health remains adequate.
 * Pain dissipates slowly over time.
 * 
 * @example
 * ```typescript
 * const painSystem = new PainResponseSystem();
 * 
 * // Apply pain from damage
 * const newPlayer = painSystem.applyPain(player, 15, VitalPointSeverity.MAJOR);
 * 
 * // Check pain level
 * const level = painSystem.getPainLevel(newPlayer.pain);
 * 
 * // Apply dissipation over time
 * const recovered = painSystem.applyDissipation(newPlayer, 1000);
 * ```
 * 
 * @public
 * @korean 고통반응시스템
 */
export class PainResponseSystem {
  /**
   * Pain level effects and thresholds.
   */
  private readonly painEffects: Record<PainLevel, PainEffects> = {
    [PainLevel.NONE]: {
      range: [0, 20],
      effectivenessMultiplier: 1.0,
      movementPenalty: 0.0,
      accuracyPenalty: 0.0,
      staminaDrainMultiplier: 1.0,
    },
    [PainLevel.LIGHT]: {
      range: [21, 40],
      effectivenessMultiplier: 0.95,
      movementPenalty: 0.05,
      accuracyPenalty: 0.05,
      staminaDrainMultiplier: 1.1,
    },
    [PainLevel.MODERATE]: {
      range: [41, 60],
      effectivenessMultiplier: 0.85,
      movementPenalty: 0.15,
      accuracyPenalty: 0.15,
      staminaDrainMultiplier: 1.25,
    },
    [PainLevel.SEVERE]: {
      range: [61, 80],
      effectivenessMultiplier: 0.65,
      movementPenalty: 0.30,
      accuracyPenalty: 0.30,
      staminaDrainMultiplier: 1.5,
    },
    [PainLevel.OVERWHELMING]: {
      range: [81, 100],
      effectivenessMultiplier: 0.40,
      movementPenalty: 0.50,
      accuracyPenalty: 0.50,
      staminaDrainMultiplier: 2.0,
    },
  };

  /**
   * Pain multipliers by vital point severity.
   */
  private readonly severityMultipliers: Record<VitalPointSeverity, number> = {
    [VitalPointSeverity.MINOR]: 0.5,
    [VitalPointSeverity.MODERATE]: 1.0,
    [VitalPointSeverity.MAJOR]: 1.5,
    [VitalPointSeverity.CRITICAL]: 2.0,
    [VitalPointSeverity.LETHAL]: 3.0,
  };

  /**
   * Base pain dissipation rate per second.
   */
  private readonly baseDissipationRate = 2.0; // 2 points per second

  /**
   * Maximum pain value.
   */
  private readonly maxPain = 100;

  /**
   * Applies pain from combat damage.
   * 
   * Calculates pain increase based on damage amount and severity.
   * Vital point strikes cause more pain than equivalent body damage.
   * 
   * @param player - Current player state
   * @param damage - Base damage amount
   * @param severity - Optional vital point severity
   * @returns Updated player state with increased pain
   * 
   * @example
   * ```typescript
   * // Normal hit
   * player = system.applyPain(player, 10);
   * 
   * // Vital point hit with higher pain
   * player = system.applyPain(player, 10, VitalPointSeverity.MAJOR);
   * ```
   * 
   * @public
   * @korean 고통적용
   */
  applyPain(
    player: PlayerState,
    damage: number,
    severity?: VitalPointSeverity
  ): PlayerState {
    // Get multiplier based on severity
    const multiplier = severity
      ? this.severityMultipliers[severity]
      : 1.0;

    // Calculate pain increase
    const painIncrease = damage * multiplier * 0.8; // 0.8 = pain-to-damage ratio

    // Apply pain, clamped to max
    const newPain = Math.min(this.maxPain, player.pain + painIncrease);

    return {
      ...player,
      pain: newPain,
    };
  }

  /**
   * Applies pain dissipation over time.
   * 
   * Pain naturally dissipates when not taking damage, but slower
   * at high pain levels due to lingering trauma.
   * 
   * @param player - Current player state
   * @param deltaTime - Time elapsed in milliseconds
   * @returns Updated player state with reduced pain
   * 
   * @example
   * ```typescript
   * // In game loop
   * player = system.applyDissipation(player, 16); // ~60fps
   * ```
   * 
   * @public
   * @korean 고통감소
   */
  applyDissipation(player: PlayerState, deltaTime: number): PlayerState {
    // Already at zero pain
    if (player.pain <= 0) {
      return player;
    }

    const deltaSeconds = deltaTime / 1000;
    const level = this.getPainLevel(player.pain);

    // Dissipation modifier based on pain level
    let dissipationModifier = 1.0;
    if (level === PainLevel.SEVERE) {
      dissipationModifier = 0.7; // Slower dissipation at high pain
    } else if (level === PainLevel.OVERWHELMING) {
      dissipationModifier = 0.5; // Very slow dissipation at overwhelming pain
    }

    const dissipation =
      this.baseDissipationRate * deltaSeconds * dissipationModifier;
    const newPain = Math.max(0, player.pain - dissipation);

    return {
      ...player,
      pain: newPain,
    };
  }

  /**
   * Determines pain level from pain value.
   * 
   * @param pain - Pain value (0-100)
   * @returns Current pain level
   * 
   * @public
   * @korean 고통수준확인
   */
  getPainLevel(pain: number): PainLevel {
    if (pain >= 81) return PainLevel.OVERWHELMING;
    if (pain >= 61) return PainLevel.SEVERE;
    if (pain >= 41) return PainLevel.MODERATE;
    if (pain >= 21) return PainLevel.LIGHT;
    return PainLevel.NONE;
  }

  /**
   * Gets effects for a specific pain level.
   * 
   * @param level - Pain level
   * @returns Effects applied at that level
   * 
   * @public
   * @korean 고통효과
   */
  getEffects(level: PainLevel): PainEffects {
    return this.painEffects[level];
  }

  /**
   * Applies pain effects to player state.
   * 
   * Modifies player stats based on current pain level.
   * 
   * @param player - Current player state
   * @returns Modified player state with pain effects
   * 
   * @public
   * @korean 고통효과적용
   */
  applyEffects(player: PlayerState): PlayerState {
    const level = this.getPainLevel(player.pain);
    const effects = this.getEffects(level);

    return {
      ...player,
      attackPower: Math.floor(
        player.attackPower * effects.effectivenessMultiplier
      ),
      defense: Math.floor(
        player.defense * effects.effectivenessMultiplier
      ),
      speed: Math.floor(
        player.speed * (1 - effects.movementPenalty)
      ),
      technique: Math.floor(
        player.technique * (1 - effects.accuracyPenalty)
      ),
    };
  }

  /**
   * Checks if player is incapacitated by pain.
   * 
   * @param player - Current player state
   * @returns True if pain is overwhelming
   * 
   * @public
   * @korean 고통무력화확인
   */
  isIncapacitated(player: PlayerState): boolean {
    return this.getPainLevel(player.pain) === PainLevel.OVERWHELMING;
  }

  /**
   * Gets bilingual name for pain level.
   * 
   * @param level - Pain level
   * @returns Korean and English level names
   * 
   * @public
   * @korean 고통이름
   */
  getLevelName(level: PainLevel): { korean: string; english: string } {
    const names: Record<PainLevel, { korean: string; english: string }> = {
      [PainLevel.NONE]: {
        korean: "무통",
        english: "No Pain",
      },
      [PainLevel.LIGHT]: {
        korean: "경미한통증",
        english: "Light Pain",
      },
      [PainLevel.MODERATE]: {
        korean: "중등도통증",
        english: "Moderate Pain",
      },
      [PainLevel.SEVERE]: {
        korean: "심한통증",
        english: "Severe Pain",
      },
      [PainLevel.OVERWHELMING]: {
        korean: "압도적통증",
        english: "Overwhelming Pain",
      },
    };

    return names[level];
  }

  /**
   * Gets color indicator for pain level (for UI).
   * 
   * @param level - Pain level
   * @returns Hex color code
   * 
   * @public
   * @korean 고통색상
   */
  getLevelColor(level: PainLevel): number {
    const colors: Record<PainLevel, number> = {
      [PainLevel.NONE]: 0x00ff00, // Green
      [PainLevel.LIGHT]: 0x88ff00, // Yellow-green
      [PainLevel.MODERATE]: 0xffff00, // Yellow
      [PainLevel.SEVERE]: 0xff8800, // Orange
      [PainLevel.OVERWHELMING]: 0xff0000, // Red
    };

    return colors[level];
  }
}

export default PainResponseSystem;
