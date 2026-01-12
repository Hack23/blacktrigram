/**
 * AI Combo System for Korean Martial Arts
 * Manages multi-hit combo sequences based on trigram stances and archetype signature combos
 */

import { TrigramStance, PlayerArchetype } from "@/types";
import { KoreanTechnique } from "@/systems/vitalpoint";
import { TRIGRAM_TECHNIQUES } from "@/systems/trigram";
import { PlayerState } from "@/systems/player";
import { AIPersonality } from "./AIPersonality";

/**
 * Combo sequence for a specific trigram stance
 */
export interface ComboSequence {
  readonly stanceId: TrigramStance;
  readonly techniques: readonly KoreanTechnique[];
  readonly minDistance: number;
  readonly maxDistance: number;
  readonly requiredKi: number;
  readonly requiredStamina: number;
  readonly name: {
    readonly korean: string;
    readonly english: string;
  };
}

/**
 * Archetype signature combo sequence (2-3 technique chains)
 * 
 * These are special technique sequences that represent each archetype's
 * fighting philosophy and preferred combat patterns.
 * 
 * @korean 원형 대표 연계 기술
 */
export interface ArchetypeComboSequence {
  readonly archetype: PlayerArchetype;
  readonly techniqueIds: readonly string[]; // 2-3 technique IDs in sequence
  readonly name: {
    readonly korean: string;
    readonly english: string;
  };
  readonly description: {
    readonly korean: string;
    readonly english: string;
  };
}

/**
 * Archetype Signature Combos
 * 
 * Each archetype has 2 signature combo sequences that reflect their combat philosophy.
 * These combos are prioritized by AI for authentic fighting style representation.
 * 
 * Combo patterns:
 * - Musa: Power amplification and defense-to-offense transitions
 * - Amsalja: Setup-to-execution nerve strike sequences
 * - Hacker: Analysis-to-burst and stun-to-shutdown patterns
 * - Jeongbo: Weaken-to-exploit and counter-to-finish sequences
 * - Jojik: Chaos-to-brutality and aggression-to-desperation patterns
 * 
 * @korean 원형 대표 연계 기술 정의
 */
export const ARCHETYPE_SIGNATURE_COMBOS: Record<PlayerArchetype, readonly ArchetypeComboSequence[]> = {
  [PlayerArchetype.MUSA]: [
    {
      archetype: PlayerArchetype.MUSA,
      techniqueIds: ["musa_thunder_strike", "musa_dragon_fist"],
      name: {
        korean: "천둥용권",
        english: "Thunder Dragon Combo",
      },
      description: {
        korean: "천둥벽력으로 적을 흔들고 용권으로 관통합니다",
        english: "Shake enemy with Thunder Strike, pierce through with Dragon Fist",
      },
    },
    {
      archetype: PlayerArchetype.MUSA,
      techniqueIds: ["musa_iron_defense", "musa_mountain_breaker"],
      name: {
        korean: "철벽파산",
        english: "Iron Mountain Break",
      },
      description: {
        korean: "철벽방어로 적의 공격을 막고 파산격으로 반격합니다",
        english: "Block with Iron Defense, counter with Mountain Breaker",
      },
    },
  ],
  
  [PlayerArchetype.AMSALJA]: [
    {
      archetype: PlayerArchetype.AMSALJA,
      techniqueIds: ["amsalja_shadow_strike", "amsalja_silent_death"],
      name: {
        korean: "암영무음",
        english: "Shadow Silent Death",
      },
      description: {
        korean: "암영격으로 신경을 교란하고 무음살로 마무리합니다",
        english: "Disrupt nerves with Shadow Strike, finish with Silent Death",
      },
    },
    {
      archetype: PlayerArchetype.AMSALJA,
      techniqueIds: ["amsalja_nerve_strike", "amsalja_deadly_precision"],
      name: {
        korean: "신경정밀",
        english: "Nerve Precision Combo",
      },
      description: {
        korean: "신경타로 마비시키고 치명정밀로 급소를 공격합니다",
        english: "Paralyze with Nerve Strike, target vitals with Deadly Precision",
      },
    },
  ],
  
  [PlayerArchetype.HACKER]: [
    {
      archetype: PlayerArchetype.HACKER,
      techniqueIds: ["hacker_data_strike", "hacker_cyber_overdrive"],
      name: {
        korean: "데이터가속",
        english: "Data Overdrive Burst",
      },
      description: {
        korean: "데이터 타격으로 분석하고 사이버 가속으로 폭발적 공격을 수행합니다",
        english: "Analyze with Data Strike, burst with Cyber Overdrive",
      },
    },
    {
      archetype: PlayerArchetype.HACKER,
      techniqueIds: ["hacker_electric_shock", "hacker_system_crash"],
      name: {
        korean: "전격크래시",
        english: "Electric System Crash",
      },
      description: {
        korean: "전격으로 기절시키고 시스템 크래시로 무력화합니다",
        english: "Stun with Electric Shock, disable with System Crash",
      },
    },
  ],
  
  [PlayerArchetype.JEONGBO_YOWON]: [
    {
      archetype: PlayerArchetype.JEONGBO_YOWON,
      techniqueIds: ["jeongbo_tactical_strike", "jeongbo_psychological_warfare"],
      name: {
        korean: "전술심리",
        english: "Tactical Psychology Combo",
      },
      description: {
        korean: "전술타격으로 약점을 노출시키고 심리전으로 정신을 교란합니다",
        english: "Expose weakness with Tactical Strike, disrupt with Psychological Warfare",
      },
    },
    {
      archetype: PlayerArchetype.JEONGBO_YOWON,
      techniqueIds: ["jeongbo_counter_intelligence", "jeongbo_intelligence_strike"],
      name: {
        korean: "역정보타격",
        english: "Counter Intelligence Strike",
      },
      description: {
        korean: "역정보공작으로 반격하고 정보타격으로 완벽하게 마무리합니다",
        english: "Counter with Counter Intelligence, finish with Intelligence Strike",
      },
    },
  ],
  
  [PlayerArchetype.JOJIK_POKRYEOKBAE]: [
    {
      archetype: PlayerArchetype.JOJIK_POKRYEOKBAE,
      techniqueIds: ["jojik_street_brawl", "jojik_brutal_takedown"],
      name: {
        korean: "거리잔혹",
        english: "Street Brutality Combo",
      },
      description: {
        korean: "거리싸움으로 혼란을 주고 잔혹제압으로 무자비하게 쓰러뜨립니다",
        english: "Create chaos with Street Brawl, brutalize with Brutal Takedown",
      },
    },
    {
      archetype: PlayerArchetype.JOJIK_POKRYEOKBAE,
      techniqueIds: ["jojik_improvised_weapon", "jojik_ruthless_assault"],
      name: {
        korean: "즉석무자비",
        english: "Improvised Ruthless Assault",
      },
      description: {
        korean: "즉석무기로 공격하고 무자비공격으로 자비 없이 마무리합니다",
        english: "Attack with Improvised Weapon, finish ruthlessly with Ruthless Assault",
      },
    },
  ],
};

/**
 * Get next technique in archetype signature combo
 * 
 * Checks if current technique is part of a signature combo sequence,
 * and returns the next technique in that sequence if found.
 * 
 * @korean 원형 대표 연계 기술의 다음 기술 가져오기
 * 
 * @param currentTechniqueId - Current technique ID just executed
 * @param archetype - Player archetype
 * @returns Next technique ID in combo sequence, or undefined if no combo
 */
export function getNextComboTechnique(
  currentTechniqueId: string,
  archetype: PlayerArchetype
): string | undefined {
  const combos = ARCHETYPE_SIGNATURE_COMBOS[archetype];
  
  if (!combos) {
    return undefined;
  }
  
  for (const combo of combos) {
    const currentIndex = combo.techniqueIds.indexOf(currentTechniqueId);
    
    // Found current technique in this combo
    if (currentIndex !== -1 && currentIndex < combo.techniqueIds.length - 1) {
      // Return next technique in sequence
      return combo.techniqueIds[currentIndex + 1];
    }
  }
  
  return undefined; // No combo continuation found
}

/**
 * AI Combo System manages combo execution and decision-making
 */
export class AIComboSystem {
  private comboSequences: Map<TrigramStance, ComboSequence[]>;
  private currentCombo: KoreanTechnique[] = [];
  private comboProgress = 0;
  private lastComboTime = 0;
  private readonly comboTimeout = 2000; // 2 seconds to continue combo

  constructor() {
    this.comboSequences = this.initializeComboSequences();
  }

  /**
   * Initialize combo sequences for each trigram stance
   */
  private initializeComboSequences(): Map<TrigramStance, ComboSequence[]> {
    const sequences = new Map<TrigramStance, ComboSequence[]>();

    // Geon (Heaven) - Direct force combos
    sequences.set(TrigramStance.GEON, [
      {
        stanceId: TrigramStance.GEON,
        techniques: this.getTechniqueSequence(TrigramStance.GEON, 3),
        minDistance: 80,
        maxDistance: 140,
        requiredKi: 30,
        requiredStamina: 40,
        name: {
          korean: "천둥벽력 연타",
          english: "Thunder Strike Combo",
        },
      },
    ]);

    // Tae (Lake) - Fluid manipulation combos
    sequences.set(TrigramStance.TAE, [
      {
        stanceId: TrigramStance.TAE,
        techniques: this.getTechniqueSequence(TrigramStance.TAE, 3),
        minDistance: 70,
        maxDistance: 130,
        requiredKi: 25,
        requiredStamina: 35,
        name: {
          korean: "유수연타",
          english: "Flowing Water Combo",
        },
      },
    ]);

    // Li (Fire) - Precision strike combos
    sequences.set(TrigramStance.LI, [
      {
        stanceId: TrigramStance.LI,
        techniques: this.getTechniqueSequence(TrigramStance.LI, 3),
        minDistance: 90,
        maxDistance: 150,
        requiredKi: 35,
        requiredStamina: 30,
        name: {
          korean: "화염연격",
          english: "Flame Strike Series",
        },
      },
    ]);

    // Jin (Thunder) - Explosive combos
    sequences.set(TrigramStance.JIN, [
      {
        stanceId: TrigramStance.JIN,
        techniques: this.getTechniqueSequence(TrigramStance.JIN, 3),
        minDistance: 80,
        maxDistance: 140,
        requiredKi: 40,
        requiredStamina: 45,
        name: {
          korean: "벽력난타",
          english: "Lightning Barrage",
        },
      },
    ]);

    // Son (Wind) - Continuous pressure combos
    sequences.set(TrigramStance.SON, [
      {
        stanceId: TrigramStance.SON,
        techniques: this.getTechniqueSequence(TrigramStance.SON, 3),
        minDistance: 70,
        maxDistance: 130,
        requiredKi: 28,
        requiredStamina: 38,
        name: {
          korean: "선풍연쇄",
          english: "Whirlwind Chain",
        },
      },
    ]);

    // Gam (Water) - Adaptive flow combos
    sequences.set(TrigramStance.GAM, [
      {
        stanceId: TrigramStance.GAM,
        techniques: this.getTechniqueSequence(TrigramStance.GAM, 3),
        minDistance: 75,
        maxDistance: 135,
        requiredKi: 30,
        requiredStamina: 35,
        name: {
          korean: "수류연환",
          english: "Water Flow Sequence",
        },
      },
    ]);

    // Gan (Mountain) - Defensive counter combos
    sequences.set(TrigramStance.GAN, [
      {
        stanceId: TrigramStance.GAN,
        techniques: this.getTechniqueSequence(TrigramStance.GAN, 3),
        minDistance: 70,
        maxDistance: 130,
        requiredKi: 25,
        requiredStamina: 40,
        name: {
          korean: "반석반격",
          english: "Mountain Counter",
        },
      },
    ]);

    // Gon (Earth) - Grounding combos
    sequences.set(TrigramStance.GON, [
      {
        stanceId: TrigramStance.GON,
        techniques: this.getTechniqueSequence(TrigramStance.GON, 3),
        minDistance: 60,
        maxDistance: 120,
        requiredKi: 30,
        requiredStamina: 50,
        name: {
          korean: "대지낙타",
          english: "Earth Slam Combo",
        },
      },
    ]);

    return sequences;
  }

  /**
   * Get technique sequence for a stance
   */
  private getTechniqueSequence(
    stance: TrigramStance,
    count: number
  ): readonly KoreanTechnique[] {
    const techniques = TRIGRAM_TECHNIQUES[stance] ?? [];
    
    // Warn if not enough techniques for full combo (issue #2529727989)
    if (techniques.length < count) {
      console.warn(
        `[AIComboSystem] Not enough techniques defined for stance '${stance}'. Requested ${count}, but only ${techniques.length} available. Returning partial combo.`
      );
    }
    
    // Return only available techniques
    return techniques.slice(0, count);
  }

  /**
   * Calculate distance between two players
   */
  private getDistance(player: PlayerState, opponent: PlayerState): number {
    const dx = player.position.x - opponent.position.x;
    const dy = player.position.y - opponent.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Check if AI should continue current combo
   * 
   * Enhanced with:
   * - Opponent balance state checking (SHAKEN/VULNERABLE)
   * - Combo length limit (max 3 techniques)
   * - Stamina threshold (>20 for combo continuation)
   * 
   * @korean 연계 기술 계속 여부 판단
   */
  shouldContinueCombo(
    player: PlayerState,
    opponent: PlayerState,
    personality: AIPersonality
  ): boolean {
    const now = Date.now();

    // No active combo - check if combo exists
    if (this.currentCombo.length === 0) {
      return false;
    }

    // Combo timed out
    if (now - this.lastComboTime > this.comboTimeout) {
      this.resetCombo();
      return false;
    }

    // Combo completed
    if (this.comboProgress >= this.currentCombo.length) {
      this.resetCombo();
      return false;
    }

    // Combo length limit: max 3 techniques
    if (this.comboProgress >= 3) {
      this.resetCombo();
      return false;
    }

    // Korean martial arts philosophy: flow like water
    const distance = this.getDistance(player, opponent);
    const distanceOk = distance < 120;
    
    // Stamina threshold for combo continuation (>20)
    const hasResources = player.ki >= 10 && player.stamina > 20;
    
    // Balance thresholds for vulnerability detection
    // Balance is a numeric value (0-100) representing stability
    // Values below 30 indicate SHAKEN/VULNERABLE states in combat
    const VULNERABLE_BALANCE_THRESHOLD = 30;
    
    // Check opponent balance state - continue combo if opponent is vulnerable
    const opponentVulnerable = 
      opponent.balance < VULNERABLE_BALANCE_THRESHOLD || // Low balance (SHAKEN/VULNERABLE state)
      opponent.isStunned || // Stunned state
      opponent.health < opponent.maxHealth * 0.3; // Low health (<30%)
    
    // Higher chance to continue if opponent is vulnerable
    const baseChance = personality.comboTendency;
    const vulnerabilityBonus = opponentVulnerable ? 0.3 : 0;
    const finalContinueChance = Math.min(0.95, baseChance + vulnerabilityBonus);
    const randomChance = Math.random() < finalContinueChance;

    return distanceOk && hasResources && randomChance;
  }

  /**
   * Start a new combo sequence
   */
  startCombo(
    player: PlayerState,
    opponent: PlayerState,
    personality: AIPersonality
  ): boolean {
    // Check if suitable for combo
    const distance = this.getDistance(player, opponent);
    const sequences = this.comboSequences.get(player.currentStance);

    if (!sequences || sequences.length === 0) {
      return false;
    }

    // Find suitable combo for current situation
    const suitableCombo = sequences.find(
      (seq) =>
        distance >= seq.minDistance &&
        distance <= seq.maxDistance &&
        player.ki >= seq.requiredKi &&
        player.stamina >= seq.requiredStamina
    );

    if (!suitableCombo) {
      return false;
    }

    // Random chance based on personality
    if (Math.random() > personality.comboTendency) {
      return false;
    }

    // Start combo
    this.currentCombo = [...suitableCombo.techniques];
    this.comboProgress = 0;
    this.lastComboTime = Date.now();
    return true;
  }

  /**
   * Get next technique in combo
   */
  getNextComboTechnique(): KoreanTechnique | null {
    if (
      this.comboProgress >= this.currentCombo.length ||
      this.currentCombo.length === 0
    ) {
      return null;
    }

    const technique = this.currentCombo[this.comboProgress];
    this.comboProgress++;
    this.lastComboTime = Date.now();
    return technique;
  }

  /**
   * Reset current combo
   */
  resetCombo(): void {
    this.currentCombo = [];
    this.comboProgress = 0;
    this.lastComboTime = 0;
  }

  /**
   * Check if combo is active (fix for issue #2529727999)
   */
  isComboActive(): boolean {
    return (
      this.currentCombo.length > 0 &&
      this.comboProgress >= 0 &&
      this.comboProgress < this.currentCombo.length &&
      Date.now() - this.lastComboTime < this.comboTimeout
    );
  }

  /**
   * Get combo progress information
   */
  getComboInfo(): {
    active: boolean;
    progress: number;
    total: number;
    percentage: number;
  } {
    return {
      active: this.isComboActive(),
      progress: this.comboProgress,
      total: this.currentCombo.length,
      percentage:
        this.currentCombo.length > 0
          ? (this.comboProgress / this.currentCombo.length) * 100
          : 0,
    };
  }

  /**
   * Get available combos for stance
   */
  getAvailableCombos(stance: TrigramStance): readonly ComboSequence[] {
    return this.comboSequences.get(stance) ?? [];
  }
}
