/**
 * AI Decision Tree for Korean Martial Arts Combat
 * Strategic decision-making system with multiple tactical options
 *
 * **Korean Philosophy Integration (한국 무술 철학)**:
 * - 지피지기백전불태 (知彼知己百戰不殆) - Know the enemy, know yourself, and victory is certain
 * - 이순응변 (以柔應變) - Adapt with flexibility and flow like water
 * - 급소공격 (急所攻擊) - Strike vital points with precision and timing
 */

import { PlayerState } from "@/systems/player";
import { TrigramSystem } from "@/systems/TrigramSystem";
import {
  KOREAN_VITAL_POINTS,
  getVitalPointById,
} from "@/systems/vitalpoint/KoreanVitalPoints";
import { Position, TrigramStance, PlayerArchetype } from "@/types";
import { DifficultyParameters } from "./AdaptiveDifficulty";
import { AIPersonality, getArchetypeBehavior } from "./AIPersonality";
import { AIComboSystem } from "./ComboSystem";

/**
 * AI action types
 */
export enum AIActionType {
  ATTACK = "attack",
  TECHNIQUE = "technique",
  DEFEND = "defend",
  COUNTER = "counter",
  RETREAT = "retreat",
  APPROACH = "approach",
  CIRCLE = "circle",
  STANCE_CHANGE = "stance_change",
  FEINT = "feint",
  WAIT = "wait",
  COMBO = "combo",
}

/**
 * AI decision result
 */
export interface AIDecision {
  readonly action: AIActionType;
  readonly targetPosition?: Position;
  readonly targetStance?: TrigramStance;
  readonly targetVitalPoint?: string; // ID of vital point to target
  readonly priority: number; // 0-10: Decision confidence
  readonly reason: string; // For debugging/analysis
}

/**
 * Combat context for decision making
 */
export interface CombatContext {
  readonly playerPosition: Position;
  readonly opponentPosition: Position;
  readonly playerHealth: number;
  readonly playerMaxHealth: number;
  readonly playerKi: number;
  readonly playerMaxKi: number;
  readonly playerStamina: number;
  readonly playerMaxStamina: number;
  readonly opponentHealth: number;
  readonly opponentStance: TrigramStance;
  readonly playerStance: TrigramStance;
  readonly distanceToOpponent: number;
  readonly timeInMatch: number;
  readonly isOpponentAttacking: boolean;
  readonly recentDamageTaken: number;
  readonly opponentBalance?: string; // Balance state: "READY" | "SHAKEN" | "VULNERABLE" | "HELPLESS"
  readonly arenaBounds: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
}

/**
 * AI Decision Tree System
 *
 * **Korean Combat Philosophy (한국 무술 철학)**:
 * This system embodies traditional Korean martial arts principles:
 *
 * - **팔괘 응용** (Trigram Application): Uses Eight Trigram system for stance transitions
 * - **급소 타격** (Vital Point Strikes): Targets anatomical weak points with precision
 * - **상황 판단** (Situational Awareness): Adapts tactics based on combat context
 * - **기술 조합** (Technique Combinations): Chains attacks into flowing combos
 * - **방어 우선** (Defense First): Prioritizes survival and tactical retreat when needed
 */
export class AIDecisionTree {
  private lastDecisionTime = 0;
  private decisionCooldown = 50; // 50ms minimum between decisions
  private consecutiveAttacks = 0;
  private lastStanceChange = 0;
  private readonly stanceChangeCooldown = 3000; // 3 seconds

  // Systems for advanced decision-making
  private trigramSystem: TrigramSystem;
  private difficultyLevel: number = 0.5; // 0.0-1.0: AI skill level
  private difficultyParams?: DifficultyParameters; // Difficulty parameters for AI behavior
  private currentReactionDelay: number = 50; // Current reaction delay (calculated once per param change)

  // Movement constants
  private static readonly MOVE_STEP_SIZE = 50; // Fixed movement step size in pixels
  private static readonly MIN_DISTANCE_THRESHOLD = 5; // Minimum distance to avoid division by zero
  
  /**
   * Arena boundary margins - exported for test validation
   * These values represent the player character size/collision margins
   */
  public static readonly ARENA_MARGIN_X = 60; // Horizontal boundary margin
  public static readonly ARENA_MARGIN_Y = 180; // Vertical boundary margin

  constructor() {
    this.trigramSystem = new TrigramSystem();
  }

  /**
   * Set AI difficulty level for vital point targeting accuracy
   * @param level - 0.0 (beginner) to 1.0 (master)
   */
  setDifficultyLevel(level: number): void {
    this.difficultyLevel = Math.max(0, Math.min(1, level));
  }

  /**
   * Set difficulty parameters for AI behavior
   * Affects reaction time, accuracy, decision quality, etc.
   * 
   * Calculates a randomized reaction delay (within parameter range) once when 
   * parameters change. This provides varied AI timing while maintaining consistent
   * behavior throughout the current parameter set.
   * 
   * @korean 난이도 매개변수 설정
   * @param params - Difficulty parameters to apply
   */
  setDifficultyParameters(params: DifficultyParameters): void {
    this.difficultyParams = params;
    // Calculate randomized reaction delay once when params change
    // This provides variety while ensuring consistent timing until next param update
    if (params) {
      this.currentReactionDelay = 
        params.reactionTimeMs.min +
        Math.random() * (params.reactionTimeMs.max - params.reactionTimeMs.min);
    }
  }

  /**
   * Check if kill mode should be activated based on archetype behavior
   * 
   * Kill mode activates when:
   * - Opponent health is low (<30%)
   * - Opponent is in vulnerable balance state (HELPLESS/VULNERABLE)
   * 
   * **Korean Philosophy (결정타 모드)**:
   * Each archetype activates kill mode differently based on combat philosophy:
   * - **Musa**: Honor demands finishing the fight decisively
   * - **Amsalja**: Opportunity for instant takedown with precision
   * - **Hacker**: Analytical window for calculated strike
   * - **Jeongbo Yowon**: Strategic opportunity for submission
   * - **Jojik Pokryeokbae**: Pragmatic moment to finish brutally
   * 
   * @korean 결정타 모드 활성화 확인
   * 
   * @param context - Current combat context
   * @param personality - AI personality archetype
   * @returns True if kill mode should be active
   */
  private isKillModeActive(context: CombatContext, personality: AIPersonality): boolean {
    const opponentHealthPercent = context.opponentHealth / context.playerMaxHealth;
    const isOpponentVulnerable =
      context.opponentBalance != null &&
      (context.opponentBalance === "HELPLESS" ||
        context.opponentBalance === "VULNERABLE");
    
    // Different activation thresholds based on archetype philosophy
    let healthThreshold = 0.30; // Default 30%
    
    switch (personality.archetype) {
      case PlayerArchetype.MUSA:
        // Aggressive: Activate kill mode early (honor code)
        healthThreshold = 0.30;
        break;
      case PlayerArchetype.AMSALJA:
        // Precise: Activate when perfect opportunity presents
        healthThreshold = 0.30;
        break;
      case PlayerArchetype.HACKER:
        // Analytical: Calculate optimal finishing window
        healthThreshold = 0.25; // More conservative, waits for clear advantage
        break;
      case PlayerArchetype.JEONGBO_YOWON:
        // Strategic: Balanced approach
        healthThreshold = 0.28;
        break;
      case PlayerArchetype.JOJIK_POKRYEOKBAE:
        // Pragmatic: Opportunistic finishing
        healthThreshold = 0.35; // Earlier activation, dirty fighter mentality
        break;
    }
    
    // Activate kill mode when opponent is low health OR vulnerable
    return opponentHealthPercent < healthThreshold || isOpponentVulnerable;
  }

  /**
   * Apply kill mode modifiers to action weights for finishing behavior
   * 
   * **Kill Mode Behavior (결정타 행동)**:
   * Each archetype has unique finishing behavior based on combat philosophy:
   * - **Musa**: All-in overwhelming force (2.5x attack, 0x retreat)
   * - **Amsalja**: Instant takedown focus (3.0x technique, feints disabled)
   * - **Hacker**: Analytical precision (2.0x technique, counter focus)
   * - **Jeongbo Yowon**: Strategic control (1.8x technique, balanced approach)
   * - **Jojik Pokryeokbae**: Brutal pragmatism (2.2x attack, dirty tactics)
   * 
   * @korean 결정타 모드 가중치 적용
   * 
   * @param baseWeights - Base action weight multipliers
   * @param personality - AI personality archetype
   * @param isKillMode - Whether kill mode is active
   * @returns Modified action weights for kill mode
   */
  private applyKillModeModifiers(
    baseWeights: { attack: number; technique: number; defend: number; retreat: number },
    personality: AIPersonality,
    isKillMode: boolean
  ): { attack: number; technique: number; defend: number; retreat: number } {
    if (!isKillMode) {
      return baseWeights;
    }

    const modified = { ...baseWeights };
    
    // Apply archetype-specific kill mode behavior
    switch (personality.archetype) {
      case PlayerArchetype.MUSA:
        // Warrior: All-in overwhelming force (honor code)
        modified.attack *= 2.5; // Massive attack priority
        modified.technique *= 2.0; // Prefer powerful techniques
        modified.defend *= 0.2; // Minimal defense
        modified.retreat = 0.0; // No retreat (honor code)
        break;
        
      case PlayerArchetype.AMSALJA:
        // Assassin: Instant takedown focus (precision)
        modified.technique *= 3.0; // Prioritize lethal techniques
        modified.attack *= 1.5; // Quick finishers
        modified.defend *= 0.3; // Reduce defense during kill window
        // Note: retreat remains available for tactical repositioning
        break;
        
      case PlayerArchetype.HACKER:
        // Hacker: Analytical precision (calculated strike)
        modified.technique *= 2.0; // Calculated finishing techniques
        modified.attack *= 1.3; // Measured attacks
        modified.defend *= 0.7; // Maintain defensive awareness
        // Counter-attack focus through higher base defense
        break;
        
      case PlayerArchetype.JEONGBO_YOWON:
        // Intelligence Operative: Strategic control (psychological pressure)
        modified.technique *= 1.8; // Strategic techniques
        modified.attack *= 1.6; // Balanced offensive
        modified.defend *= 0.6; // Moderate defense reduction
        modified.retreat *= 0.5; // Tactical retreat available
        break;
        
      case PlayerArchetype.JOJIK_POKRYEOKBAE:
        // Organized Crime: Brutal pragmatism (dirty fighter)
        modified.attack *= 2.2; // Brutal finishing attacks
        modified.technique *= 1.7; // Dirty techniques
        modified.defend *= 0.4; // Reduced defense (pragmatic risk)
        modified.retreat *= 1.2; // Will retreat if needed (surviv survival instinct)
        break;
    }
    
    return modified;
  }

  /**
   * Make strategic decision based on combat context
   * 
   * Applies difficulty-based reaction time delays if difficulty parameters are set
   */
  makeDecision(
    context: CombatContext,
    personality: AIPersonality,
    comboSystem: AIComboSystem
  ): AIDecision {
    const now = Date.now();

    // Apply difficulty-based reaction time delay (calculated once per param change)
    const reactionDelay = this.difficultyParams
      ? this.currentReactionDelay
      : this.decisionCooldown;

    // Respect decision cooldown (use reaction delay if difficulty params available)
    const effectiveCooldown = Math.max(this.decisionCooldown, reactionDelay);
    if (now - this.lastDecisionTime < effectiveCooldown) {
      return {
        action: AIActionType.WAIT,
        priority: 0,
        reason: this.difficultyParams
          ? `Reaction time delay: ${effectiveCooldown.toFixed(0)}ms`
          : "Decision cooldown active",
      };
    }

    this.lastDecisionTime = now;

    // Check for kill mode activation (Issue #enhance-ai-aggression)
    const killModeActive = this.isKillModeActive(context, personality);

    // Check for active combo first
    if (comboSystem.isComboActive()) {
      return this.decideComboAction(context, personality);
    }

    // Evaluate tactical options in priority order
    const decisions: AIDecision[] = [];

    // Get optimal range for this archetype
    const optimalRange = this.getOptimalRange(personality);
    const distance = context.distanceToOpponent;

    // 1. Critical health - survival priority
    decisions.push(this.evaluateSurvival(context, personality));

    // 2. Counter-attack opportunity
    if (context.isOpponentAttacking) {
      decisions.push(this.evaluateCounter(context, personality, killModeActive));
    }

    // 3. Combo initiation (only if at reasonable distance)
    if (distance < optimalRange * 1.5) {
      decisions.push(this.evaluateComboStart(context, personality, comboSystem));
    }

    // 4. Stance transition
    decisions.push(this.evaluateStanceChange(context, personality, now));

    // 5. Feint attack (only at mid-close range) - reduced priority in kill mode
    if (distance < optimalRange * 1.8 && !killModeActive) {
      decisions.push(this.evaluateFeint(context, personality));
    }

    // 6. Distance-based tactics (archetype-aware ranges)
    if (distance < optimalRange * 1.2) {
      // Close to optimal range - use close-range tactics including vital point targeting
      decisions.push(this.evaluateCloseRange(context, personality, killModeActive));
    } else if (distance > optimalRange * 1.8) {
      // Too far - need to approach
      decisions.push(this.evaluateApproach(context, personality, killModeActive));
    } else {
      // Mid-range - good tactical position
      decisions.push(this.evaluateMidRange(context, personality));
    }

    // 7. Defensive positioning (reduced in kill mode)
    if (!killModeActive || personality.archetype !== PlayerArchetype.MUSA) {
      decisions.push(this.evaluateDefense(context, personality));
    }

    // Apply kill mode modifiers to boost aggression (Issue #enhance-ai-aggression)
    if (killModeActive) {
      // Map decisions to new array with modified priorities
      const modifiedDecisions = decisions.map((decision) => {
        // CRITICAL: Survival decisions (retreat for self-preservation) should NOT be affected by kill mode
        // Kill mode is about finishing the opponent, not about ignoring the AI's own safety
        // Survival retreats are identified by priority 20 OR reason containing survival keywords
        const isSurvivalRetreat = 
          decision.action === AIActionType.RETREAT && 
          (decision.priority === 20 || 
           decision.reason.includes('Critical health') || 
           decision.reason.includes('High pain') ||
           decision.reason.includes('위급 상황') ||
           decision.reason.includes('고통 회피'));
           
        if (isSurvivalRetreat) {
          // This is a survival retreat decision - preserve its priority
          return decision;
        }
        
        // Calculate base action weights for non-survival decisions
        const weights = {
          attack: decision.action === AIActionType.ATTACK ? 1.0 : 0.0,
          technique: decision.action === AIActionType.TECHNIQUE ? 1.0 : 0.0,
          defend: decision.action === AIActionType.DEFEND ? 1.0 : 0.0,
          retreat: decision.action === AIActionType.RETREAT ? 1.0 : 0.0,
        };
        
        // Apply kill mode modifiers
        const modifiedWeights = this.applyKillModeModifiers(weights, personality, true);
        
        // Adjust priority based on modified weights
        let newPriority = decision.priority;
        if (decision.action === AIActionType.ATTACK) {
          newPriority = decision.priority * modifiedWeights.attack;
        } else if (decision.action === AIActionType.TECHNIQUE) {
          newPriority = decision.priority * modifiedWeights.technique;
        } else if (decision.action === AIActionType.DEFEND) {
          newPriority = decision.priority * modifiedWeights.defend;
        } else if (decision.action === AIActionType.RETREAT) {
          newPriority = decision.priority * modifiedWeights.retreat;
        }
        
        return { ...decision, priority: newPriority };
      });
      
      // Select highest priority decision from modified array
      const bestDecision = modifiedDecisions.reduce((best, current) =>
        current.priority > best.priority ? current : best
      );

      // Track consecutive attacks
      if (
        bestDecision.action === AIActionType.ATTACK ||
        bestDecision.action === AIActionType.TECHNIQUE
      ) {
        this.consecutiveAttacks++;
      } else {
        this.consecutiveAttacks = 0;
      }

      return bestDecision;
    }

    // Normal mode: Select highest priority decision without kill mode modifiers
    const bestDecision = decisions.reduce((best, current) =>
      current.priority > best.priority ? current : best
    );

    // Track consecutive attacks
    if (
      bestDecision.action === AIActionType.ATTACK ||
      bestDecision.action === AIActionType.TECHNIQUE
    ) {
      this.consecutiveAttacks++;
    } else {
      this.consecutiveAttacks = 0;
    }

    return bestDecision;
  }

  /**
   * Evaluate survival tactics when critically low health
   * 
   * **Korean Philosophy (생존 전략)**:
   * - Consider both health and pain levels
   * - Archetype affects retreat threshold and behavior
   * - Honor code (Musa) prevents retreat above threshold
   */
  private evaluateSurvival(
    context: CombatContext,
    personality: AIPersonality
  ): AIDecision {
    const healthPercent = context.playerHealth / context.playerMaxHealth;
    const painLevel = context.recentDamageTaken;
    
    // Get archetype behavior profile
    const behavior = getArchetypeBehavior(personality.archetype);

    // Check critical survival condition: low health OR (moderate health + high pain)
    const isCritical = healthPercent < personality.tacticalRetreatThreshold;
    const isHighPain = healthPercent < 0.5 && painLevel > 50;

    if (isCritical || isHighPain) {
      // Honor code: Musa never retreats above their threshold (30%)
      if (behavior.honorCode && healthPercent > behavior.retreatThreshold / 100) {
        return {
          action: AIActionType.WAIT,
          priority: 0,
          reason: `Honor code prevents retreat: ${(healthPercent * 100).toFixed(1)}% (명예 규범)`,
        };
      }
      
      const retreatVector = this.calculateRetreatPosition(context);
      
      return {
        action: AIActionType.RETREAT,
        targetPosition: retreatVector,
        priority: 20, // Highest priority - must always override kill mode aggression
        reason: isCritical 
          ? `Critical health: ${(healthPercent * 100).toFixed(1)}% (위급 상황)`
          : `High pain: ${painLevel.toFixed(0)} (고통 회피)`,
      };
    }

    return { action: AIActionType.WAIT, priority: 0, reason: "Health stable" };
  }

  /**
   * Evaluate counter-attack opportunity
   * 
   * **Kill Mode Enhancement (결정타 반격)**:
   * All archetypes enhance counter behavior during kill mode based on philosophy:
   * - **Musa**: Increased counter frequency (honor demands swift response)
   * - **Amsalja**: Enhanced counter timing with precision strikes
   * - **Hacker**: Calculated counter-attacks (analytical opportunity)
   * - **Jeongbo Yowon**: Strategic counters (psychological advantage)
   * - **Jojik Pokryeokbae**: Opportunistic counters (dirty tactics)
   * 
   * @param context - Combat context
   * @param personality - AI personality
   * @param killModeActive - Whether kill mode is active
   */
  private evaluateCounter(
    context: CombatContext,
    personality: AIPersonality,
    killModeActive: boolean = false
  ): AIDecision {
    // Base counter chance affected by defense preference
    let counterChance = personality.defensePreference * 0.8;
    let counterPriority = 8;
    
    // Kill mode: Archetype-specific counter behavior enhancements
    if (killModeActive) {
      switch (personality.archetype) {
        case PlayerArchetype.MUSA:
          // Musa: Honor code demands swift aggressive counter
          counterChance = Math.min(0.95, counterChance + 0.3); // +30% counter chance
          counterPriority = 9; // Highest priority counter
          break;
          
        case PlayerArchetype.AMSALJA:
          // Amsalja: Precision counter-strikes for instant takedown
          counterChance = Math.min(0.90, counterChance + 0.25); // +25% counter chance
          counterPriority = 9; // Highest priority counter
          break;
          
        case PlayerArchetype.HACKER:
          // Hacker: Calculated counter with analytical precision
          counterChance = Math.min(0.85, counterChance + 0.15); // +15% counter chance
          counterPriority = 9; // Enhanced priority for analytical strike
          break;
          
        case PlayerArchetype.JEONGBO_YOWON:
          // Jeongbo Yowon: Strategic counter with psychological pressure
          counterChance = Math.min(0.80, counterChance + 0.20); // +20% counter chance
          counterPriority = 8; // Moderate priority increase
          break;
          
        case PlayerArchetype.JOJIK_POKRYEOKBAE:
          // Jojik: Opportunistic dirty counter
          counterChance = Math.min(0.85, counterChance + 0.25); // +25% counter chance
          counterPriority = 8; // Pragmatic priority
          break;
      }
    }
    
    const shouldCounter =
      Math.random() < counterChance &&
      context.distanceToOpponent < 150;

    if (shouldCounter) {
      let killModeReason = "";
      if (killModeActive) {
        switch (personality.archetype) {
          case PlayerArchetype.MUSA:
            killModeReason = " - 명예 반격 (honor counter)";
            break;
          case PlayerArchetype.AMSALJA:
            killModeReason = " - 정밀 반격 (precision counter)";
            break;
          case PlayerArchetype.HACKER:
            killModeReason = " - 분석 반격 (analytical counter)";
            break;
          case PlayerArchetype.JEONGBO_YOWON:
            killModeReason = " - 전략 반격 (strategic counter)";
            break;
          case PlayerArchetype.JOJIK_POKRYEOKBAE:
            killModeReason = " - 기습 반격 (opportunistic counter)";
            break;
        }
      }
      
      return {
        action: AIActionType.COUNTER,
        priority: counterPriority,
        reason: `Opponent attacking - counter opportunity${killModeReason}`,
      };
    }

    return {
      action: AIActionType.DEFEND,
      priority: 6,
      reason: "Opponent attacking - defensive stance",
    };
  }

  /**
   * Evaluate combo initiation (fix for issue #2529467014)
   */
  private evaluateComboStart(
    context: CombatContext,
    personality: AIPersonality,
    comboSystem: AIComboSystem
  ): AIDecision {
    // Check if combo system is already active
    if (comboSystem.isComboActive()) {
      return {
        action: AIActionType.WAIT,
        priority: 0,
        reason: "Combo already active",
      };
    }

    // Don't start combo if already in consecutive attacks
    if (this.consecutiveAttacks > 0) {
      return {
        action: AIActionType.WAIT,
        priority: 0,
        reason: "Combo cooldown",
      };
    }

    const hasResources =
      context.playerKi > context.playerMaxKi * 0.3 &&
      context.playerStamina > context.playerMaxStamina * 0.3;

    const goodDistance = context.distanceToOpponent < 130;
    const comboChance = Math.random() < personality.comboTendency;

    if (hasResources && goodDistance && comboChance) {
      return {
        action: AIActionType.COMBO,
        priority: 7,
        reason: "Initiating combo sequence",
      };
    }

    return {
      action: AIActionType.WAIT,
      priority: 0,
      reason: "Combo conditions not met",
    };
  }

  /**
   * Evaluate stance change using TrigramSystem
   *
   * **Korean Philosophy (자세 전환)**:
   * Uses I Ching-based trigram system to find optimal stance transitions.
   * Considers resource costs, counter-stance effectiveness, and archetype preferences.
   * Each archetype has favored stances that they switch to more frequently.
   */
  private evaluateStanceChange(
    context: CombatContext,
    personality: AIPersonality,
    now: number
  ): AIDecision {
    // Respect stance change cooldown
    if (now - this.lastStanceChange < this.stanceChangeCooldown) {
      return {
        action: AIActionType.WAIT,
        priority: 0,
        reason: "Stance change on cooldown",
      };
    }

    const shouldChange = Math.random() < personality.stanceSwitchFrequency;
    if (!shouldChange) {
      return {
        action: AIActionType.WAIT,
        priority: 0,
        reason: "No stance change needed",
      };
    }

    const behavior = getArchetypeBehavior(personality.archetype);
    
    // Check if already in a preferred stance - if so, reduce change chance (but not completely)
    // This check only applies outside combat to avoid stance lock during active fighting
    const inPreferredStance = behavior.preferredStances.includes(context.playerStance);
    if (inPreferredStance && !context.isOpponentAttacking && Math.random() < 0.6) {
      // 60% chance to stay in preferred stance when not under immediate pressure
      return {
        action: AIActionType.WAIT,
        priority: 0,
        reason: "Already in preferred stance (선호 자세 유지)",
      };
    }

    // Use TrigramSystem to recommend optimal stance
    // Create a minimal PlayerState object with only the properties actually used by recommendStance
    const playerState = {
      currentStance: context.playerStance,
      ki: context.playerKi,
      stamina: context.playerStamina,
      archetype: personality.archetype,
    } as unknown as PlayerState;

    const recommendedStance = this.trigramSystem.recommendStance(playerState);

    // Check if we can afford the transition
    const canTransition = this.trigramSystem.canTransitionTo(
      context.playerStance,
      recommendedStance,
      playerState
    );

    if (!canTransition) {
      // Try archetype-preferred stance or counter-stance
      const preferredAvailable = behavior.preferredStances.find(
        (stance) => this.trigramSystem.canTransitionTo(context.playerStance, stance, playerState)
      );
      
      if (preferredAvailable) {
        this.lastStanceChange = now;
        return {
          action: AIActionType.STANCE_CHANGE,
          targetStance: preferredAvailable,
          priority: 6,
          reason: `Switching to preferred stance (선호 자세 전환: ${preferredAvailable})`,
        };
      }
      
      // Fallback to counter-stance
      const counterStance = this.selectCounterStance(
        context.opponentStance,
        personality
      );

      this.lastStanceChange = now;
      return {
        action: AIActionType.STANCE_CHANGE,
        targetStance: counterStance,
        priority: 5,
        reason: `Counter stance to ${context.opponentStance} (급소 대응)`,
      };
    }

    this.lastStanceChange = now;

    return {
      action: AIActionType.STANCE_CHANGE,
      targetStance: recommendedStance,
      priority: 6,
      reason: `Optimal stance transition via TrigramSystem (팔괘 전환)`,
    };
  }

  /**
   * Evaluate feint attack
   */
  private evaluateFeint(
    context: CombatContext,
    personality: AIPersonality
  ): AIDecision {
    const shouldFeint =
      Math.random() < personality.feintChance &&
      context.distanceToOpponent < 180;

    if (shouldFeint) {
      return {
        action: AIActionType.FEINT,
        priority: 4,
        reason: "Feinting to bait opponent",
      };
    }

    return {
      action: AIActionType.WAIT,
      priority: 0,
      reason: "No feint opportunity",
    };
  }

  /**
   * Evaluate close range tactics with vital point targeting
   *
   * **Korean Philosophy (급소 공격)**:
   * At close range, AI targets specific vital points based on difficulty level.
   * Higher difficulty = more precise targeting of critical points.
   * 
   * **Kill Mode Enhancement (결정타)**:
   * When kill mode is active, AI prioritizes finishing techniques with boosted priority.
   * 
   * @param context - Combat context
   * @param personality - AI personality
   * @param killModeActive - Whether kill mode is active (opponent <30% health or vulnerable)
   */
  private evaluateCloseRange(
    context: CombatContext,
    personality: AIPersonality,
    killModeActive: boolean = false
  ): AIDecision {
    const hasResources = context.playerKi > 10 && context.playerStamina > 15;
    const aggression = personality.aggressionLevel;

    // Select vital point target based on difficulty
    const targetVitalPoint = this.selectVitalPointTarget(context, personality);

    // Get Korean name for logging if vital point is selected
    const vitalPointName = targetVitalPoint
      ? getVitalPointById(targetVitalPoint)?.names.korean ?? targetVitalPoint
      : undefined;

    // Kill mode: Prioritize finishing attacks with maximum aggression
    if (killModeActive) {
      const killModeSuffix = personality.archetype === PlayerArchetype.MUSA 
        ? " (결정타 - 압도적 공격)" 
        : " (결정타 - 즉사 기술)";
      
      if (hasResources) {
        return {
          action: AIActionType.TECHNIQUE,
          targetVitalPoint,
          priority: targetVitalPoint ? 9 : 8, // Highest priority with vital point
          reason: targetVitalPoint
            ? `Kill mode - finishing technique on vital point (급소 결정타: ${vitalPointName})${killModeSuffix}`
            : `Kill mode - finishing technique${killModeSuffix}`,
        };
      } else {
        return {
          action: AIActionType.ATTACK,
          targetVitalPoint,
          priority: targetVitalPoint ? 8 : 7, // Very high priority
          reason: targetVitalPoint
            ? `Kill mode - finishing attack (결정타 급소: ${vitalPointName})${killModeSuffix}`
            : `Kill mode - finishing attack${killModeSuffix}`,
        };
      }
    }

    // Normal close range behavior
    if (Math.random() < aggression * 0.8) {
      return {
        action: AIActionType.ATTACK,
        targetVitalPoint,
        priority: targetVitalPoint ? 7 : 6,
        reason: targetVitalPoint
          ? `Close range - vital point attack (급소 타격: ${vitalPointName})`
          : "Close range - aggressive strike",
      };
    } else if (Math.random() < aggression * 0.9 && hasResources) {
      return {
        action: AIActionType.TECHNIQUE,
        targetVitalPoint,
        priority: targetVitalPoint ? 6 : 5,
        reason: targetVitalPoint
          ? `Close range - technique on vital point (급소 기술: ${vitalPointName})`
          : "Close range - technique execution",
      };
    } else {
      return {
        action: AIActionType.DEFEND,
        priority: 4,
        reason: "Close range - defensive posture (방어 자세)",
      };
    }
  }

  /**
   * Select vital point to target based on difficulty and stance
   *
   * **Korean Philosophy (급소 선택)**:
   * - Beginner AI: Random targeting or no specific target
   * - Intermediate AI: Favors easier vital points
   * - Advanced AI: Targets appropriate points for current stance
   * - Master AI: Targets critical points with high precision
   */
  private selectVitalPointTarget(
    context: CombatContext,
    personality: AIPersonality
  ): string | undefined {
    // Guard: Ensure vital points are available
    if (KOREAN_VITAL_POINTS.length === 0) {
      return undefined;
    }

    // Check if AI attempts vital point targeting based on difficulty
    const targetChance = this.difficultyLevel * personality.aggressionLevel;
    if (Math.random() > targetChance) {
      return undefined; // No specific vital point target
    }

    // Filter vital points by effective stance
    const effectivePoints = KOREAN_VITAL_POINTS.filter((point) =>
      point.effectiveStances?.includes(context.playerStance)
    );

    if (effectivePoints.length === 0) {
      // Fallback to any vital point
      const randomIndex = Math.floor(
        Math.random() * KOREAN_VITAL_POINTS.length
      );
      return KOREAN_VITAL_POINTS[randomIndex].id;
    }

    // Select based on difficulty level
    if (this.difficultyLevel < 0.3) {
      // Beginner: Random selection from effective points.
      // NOTE: This uses Math.random(), which is not seeded and thus not deterministic.
      // For reproducible AI behavior (e.g., in testing or balancing), consider using a seeded RNG.
      // Also, this "beginner" AI still filters by effective points (stance-appropriate), which may be more sophisticated than a true novice.
      // If true beginner behavior is desired, select from all KOREAN_VITAL_POINTS instead.
      const randomIndex = Math.floor(Math.random() * effectivePoints.length);
      return effectivePoints[randomIndex].id;
    } else if (this.difficultyLevel < 0.6) {
      // Intermediate: Prefer easier targets (lower difficulty)
      const easierPoints = effectivePoints.filter(
        (p) => p.targetingDifficulty < 0.7
      );

      if (easierPoints.length > 0) {
        // Sort without mutating original array
        const sortedEasierPoints = [...easierPoints].sort(
          (a, b) => a.targetingDifficulty - b.targetingDifficulty
        );
        return sortedEasierPoints[0].id;
      }
      return effectivePoints[0].id;
    } else {
      // Advanced/Master: Target high-value critical points
      const criticalPoints = effectivePoints.filter(
        (p) => p.severity === "critical" || p.severity === "major"
      );

      if (criticalPoints.length > 0) {
        // Sort without mutating original array
        const sortedCritical = [...criticalPoints].sort(
          (a, b) => (b.baseDamage ?? 0) - (a.baseDamage ?? 0)
        );
        return sortedCritical[0].id;
      }

      // Fallback to highest damage point (guaranteed to exist due to check at line 456)
      const sortedByDamage = [...effectivePoints].sort(
        (a, b) => (b.baseDamage ?? 0) - (a.baseDamage ?? 0)
      );
      return sortedByDamage[0]?.id ?? effectivePoints[0].id;
    }
  }

  /**
   * Get optimal combat range based on AI personality archetype
   * 
   * Uses archetype behavior profiles to determine preferred combat distance.
   * Range is converted from cell units to pixels (1 cell = ~40px).
   * 
   * @korean 최적 전투 거리 - 원형별 선호 거리
   */
  private getOptimalRange(personality: AIPersonality): number {
    const CELL_SIZE = 40; // Size of one grid cell in pixels
    
    // Get archetype behavior profile
    const behavior = getArchetypeBehavior(personality.archetype);
    
    // Convert cell units to pixels
    return behavior.optimalRange * CELL_SIZE;
  }

  /**
   * Evaluate approach tactics with archetype-specific behavior
   * 
   * **Korean Philosophy (접근 전략)**:
   * - Musa charges directly (70% direct path)
   * - Amsalja uses flanking movements (40% diagonal approach)
   * - Hacker maintains optimal distance (prefers not to close too much)
   * 
   * **Kill Mode Enhancement (결정타 접근)**:
   * All archetypes enhance movement speed in kill mode based on combat philosophy:
   * - **Musa**: Direct charging with leg shifts for maximum speed (40% faster)
   * - **Amsalja**: Swift stepping patterns for rapid positioning (30% faster)
   * - **Hacker**: Calculated approach for optimal strike position (20% faster)
   * - **Jeongbo Yowon**: Strategic positioning for control (25% faster)
   * - **Jojik Pokryeokbae**: Unpredictable rush for brutal finish (35% faster)
   * 
   * @param context - Combat context
   * @param personality - AI personality
   * @param killModeActive - Whether kill mode is active
   */
  private evaluateApproach(
    context: CombatContext,
    personality: AIPersonality,
    killModeActive: boolean = false
  ): AIDecision {
    const optimalRange = this.getOptimalRange(personality);
    const distance = context.distanceToOpponent;

    // If already at optimal range or closer, lower priority
    if (distance <= optimalRange * 1.2) {
      return {
        action: AIActionType.WAIT,
        priority: 0,
        reason: "Already at optimal range",
      };
    }

    // Apply archetype-specific movement bias
    let movementBias = this.getArchetypeMovementBias(personality.archetype);
    
    // Kill mode: Enhance movement speed for all archetypes based on philosophy
    if (killModeActive) {
      switch (personality.archetype) {
        case PlayerArchetype.MUSA:
          movementBias *= 1.4; // 40% faster closing speed with leg shifts
          break;
        case PlayerArchetype.AMSALJA:
          movementBias *= 1.3; // 30% faster with stepping patterns
          break;
        case PlayerArchetype.HACKER:
          movementBias *= 1.2; // 20% faster for calculated approach
          break;
        case PlayerArchetype.JEONGBO_YOWON:
          movementBias *= 1.25; // 25% faster for strategic positioning
          break;
        case PlayerArchetype.JOJIK_POKRYEOKBAE:
          movementBias *= 1.35; // 35% faster for unpredictable rush
          break;
      }
    }
    
    let approachPos: Position;

    // Archetype-specific approach patterns
    if (personality.archetype === PlayerArchetype.MUSA && Math.random() < 0.7) {
      // Musa: Direct charge 70% of the time (enhanced in kill mode)
      approachPos = this.calculateDirectApproach(context, killModeActive);
    } else if (personality.archetype === PlayerArchetype.AMSALJA && Math.random() < 0.4) {
      // Amsalja: Flanking approach 40% of the time (enhanced in kill mode)
      approachPos = this.calculateFlankingApproach(context, killModeActive);
    } else {
      // Default approach with slight randomization
      approachPos = this.calculateApproachPosition(context);
    }

    // Calculate priority based on distance from optimal range
    // Very far: priority ~6-7, moderate distance: priority ~5
    let basePriority = 4;
    
    // Kill mode: Increase approach priority for closing distance (archetype-dependent)
    if (killModeActive && distance > optimalRange * 1.5) {
      switch (personality.archetype) {
        case PlayerArchetype.MUSA:
        case PlayerArchetype.JOJIK_POKRYEOKBAE:
          basePriority = 6; // Aggressive approach
          break;
        case PlayerArchetype.AMSALJA:
          basePriority = 6; // Swift approach for takedown
          break;
        case PlayerArchetype.HACKER:
        case PlayerArchetype.JEONGBO_YOWON:
          basePriority = 5; // Calculated/strategic approach
          break;
      }
    }
    
    const distanceRatio = Math.min(2, (distance - optimalRange) / optimalRange);
    const priorityBoost = distanceRatio * movementBias * 0.8;
    const finalPriority = basePriority + priorityBoost;

    let killModeReason = "";
    if (killModeActive) {
      switch (personality.archetype) {
        case PlayerArchetype.MUSA:
          killModeReason = " - 돌격 (charging)";
          break;
        case PlayerArchetype.AMSALJA:
          killModeReason = " - 신속 접근 (swift approach)";
          break;
        case PlayerArchetype.HACKER:
          killModeReason = " - 분석 접근 (calculated approach)";
          break;
        case PlayerArchetype.JEONGBO_YOWON:
          killModeReason = " - 전략 접근 (strategic approach)";
          break;
        case PlayerArchetype.JOJIK_POKRYEOKBAE:
          killModeReason = " - 돌진 (rush)";
          break;
      }
    }

    return {
      action: AIActionType.APPROACH,
      targetPosition: approachPos,
      priority: Math.min(9, finalPriority), // Allow higher cap in kill mode
      reason: `Moving closer (distance: ${Math.round(
        distance
      )}, optimal: ${optimalRange})${killModeReason}`,
    };
  }

  /**
   * Get archetype-specific movement bias multipliers
   * 
   * Applies movement pattern modifiers based on archetype behavior profiles:
   * - Aggressive: High forward pressure (2.0x)
   * - Evasive: Moderate mobility (1.5x)
   * - Analytical: Conservative approach (0.8x-1.0x)
   * - Unpredictable: Variable movement (1.3x)
   * 
   * @korean 원형별 이동 성향
   */
  private getArchetypeMovementBias(archetype: PlayerArchetype): number {
    const behavior = getArchetypeBehavior(archetype);
    
    switch (behavior.movementPattern) {
      case "aggressive": // Musa - aggressive forward movement
        return 2.0;
      case "evasive": // Amsalja - high mobility, flanking preference
        return 1.5;
      case "analytical": // Hacker, Jeongbo - calculated approach
        return archetype === PlayerArchetype.HACKER ? 0.8 : 1.0;
      case "unpredictable": // Jojik - variable patterns
        return 1.3;
      default:
        return 1.0;
    }
  }

  /**
   * Calculate direct approach position (straight line to opponent)
   * Used primarily by Musa archetype for charging attacks
   * 
   * **Kill Mode Enhancement (결정타 돌격)**:
   * - Larger step size for faster closing with leg shifts
   * - Aggressive stride pattern for maximum forward momentum
   * 
   * @param context - Combat context
   * @param killModeActive - Whether kill mode is active
   */
  private calculateDirectApproach(context: CombatContext, killModeActive: boolean = false): Position {
    const dx = context.opponentPosition.x - context.playerPosition.x;
    const dy = context.opponentPosition.y - context.playerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If already very close to the opponent, hold position (avoid erratic movement)
    if (distance < AIDecisionTree.MIN_DISTANCE_THRESHOLD) {
      return this.clampToArenaBounds(context.playerPosition, context.arenaBounds);
    }

    // Kill mode: Enhanced step size for faster charging with leg shifts
    const baseStepSize = AIDecisionTree.MOVE_STEP_SIZE;
    const stepSize = killModeActive 
      ? Math.min(baseStepSize * 1.5, distance) // 50% larger steps (leg shift technique)
      : Math.min(baseStepSize, distance);
    
    // Move straight toward opponent with enhanced step size in kill mode
    return this.clampToArenaBounds(
      {
        x: context.playerPosition.x + (dx / distance) * stepSize,
        y: context.playerPosition.y + (dy / distance) * stepSize,
      },
      context.arenaBounds
    );
  }

  /**
   * Calculate flanking approach position (diagonal/side approach)
   * Used primarily by Amsalja archetype for stealth positioning
   * 
   * **Kill Mode Enhancement (결정타 측면 공격)**:
   * - Tighter flanking angle for more aggressive positioning
   * - Swift stepping pattern for rapid side movement
   * 
   * @param context - Combat context
   * @param killModeActive - Whether kill mode is active
   */
  private calculateFlankingApproach(context: CombatContext, killModeActive: boolean = false): Position {
    const dx = context.opponentPosition.x - context.playerPosition.x;
    const dy = context.opponentPosition.y - context.playerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If distance is too small, return player's current position (avoid erratic movement)
    if (distance < AIDecisionTree.MIN_DISTANCE_THRESHOLD) {
      return this.clampToArenaBounds(context.playerPosition, context.arenaBounds);
    }

    // Kill mode: Tighter flanking for more aggressive positioning
    const baseFlankOffset = 40 + Math.random() * 20;
    const flankOffset = killModeActive 
      ? baseFlankOffset * 0.7 // 30% closer flank (swift stepping)
      : baseFlankOffset;
    
    const perpX = -dy / distance; // Perpendicular vector
    const perpY = dx / distance;
    const flankSide = Math.random() < 0.5 ? 1 : -1; // Random side

    return this.clampToArenaBounds(
      {
        x: context.opponentPosition.x + perpX * flankOffset * flankSide,
        y: context.opponentPosition.y + perpY * flankOffset * flankSide,
      },
      context.arenaBounds
    );
  }

  /**
   * Clamp position to arena boundaries with proper margins
   * Centralizes boundary validation logic for all movement calculations
   */
  private clampToArenaBounds(
    position: Position,
    arenaBounds: { readonly x: number; readonly y: number; readonly width: number; readonly height: number }
  ): Position {
    return {
      x: Math.max(
        arenaBounds.x,
        Math.min(
          arenaBounds.x + arenaBounds.width - AIDecisionTree.ARENA_MARGIN_X,
          position.x
        )
      ),
      y: Math.max(
        arenaBounds.y,
        Math.min(
          arenaBounds.y + arenaBounds.height - AIDecisionTree.ARENA_MARGIN_Y,
          position.y
        )
      ),
    };
  }

  /**
   * Evaluate mid-range tactics with distance awareness
   * 
   * **Korean Philosophy (중거리 전술)**:
   * - Considers optimal range for archetype
   * - Hacker prefers to maintain this range (analytical pattern)
   * - Jeongbo uses strategic timing and analysis
   * - Others may close or open distance based on situation
   */
  private evaluateMidRange(
    context: CombatContext,
    personality: AIPersonality
  ): AIDecision {
    const hasResources = context.playerKi > context.playerMaxKi * 0.3;
    const optimalRange = this.getOptimalRange(personality);
    const distance = context.distanceToOpponent;
    const tacticRoll = Math.random();
    const behavior = getArchetypeBehavior(personality.archetype);

    // Archetype-specific mid-range behavior based on movement pattern
    if (behavior.movementPattern === "analytical" && Math.abs(distance - optimalRange) < 50) {
      // Analytical archetypes (Hacker, Jeongbo) at ideal range - maintain position
      const circlePos = this.calculateCirclePosition(context);
      const archetypeName = personality.archetype === PlayerArchetype.HACKER 
        ? "사이버" : "정보";
      return {
        action: AIActionType.CIRCLE,
        targetPosition: circlePos,
        priority: 6,
        reason: `${archetypeName} maintaining optimal mid-range (${archetypeName} 위치 유지)`,
      };
    }

    // Too far from optimal range - approach
    if (distance > optimalRange * 1.5) {
      const approachPos = this.calculateApproachPosition(context);
      return {
        action: AIActionType.APPROACH,
        targetPosition: approachPos,
        priority: 5,
        reason: "Moving to optimal range (최적 거리로 이동)",
      };
    }

    // Too close to optimal range - analytical archetypes create space
    if (distance < optimalRange * 0.7 && behavior.movementPattern === "analytical") {
      const retreatPos = this.calculateRetreatPosition(context);
      return {
        action: AIActionType.RETREAT,
        targetPosition: retreatPos,
        priority: 5,
        reason: "Creating tactical space (거리 확보)",
      };
    }

    // Unpredictable archetype (Jojik) - randomize tactics
    if (behavior.movementPattern === "unpredictable") {
      const randomAction = tacticRoll < 0.33 ? "attack" : tacticRoll < 0.66 ? "circle" : "approach";
      if (randomAction === "attack" && hasResources) {
        return {
          action: AIActionType.TECHNIQUE,
          priority: 5,
          reason: "Unpredictable attack (예측불가 공격)",
        };
      } else if (randomAction === "circle") {
        const circlePos = this.calculateCirclePosition(context);
        return {
          action: AIActionType.CIRCLE,
          targetPosition: circlePos,
          priority: 4,
          reason: "Unpredictable movement (예측불가 이동)",
        };
      }
    }

    // At good range - mix of techniques and repositioning
    if (tacticRoll < 0.3 && hasResources) {
      return {
        action: AIActionType.TECHNIQUE,
        priority: 5,
        reason: "Mid-range technique (중거리 기술)",
      };
    } else if (tacticRoll < 0.6) {
      const circlePos = this.calculateCirclePosition(context);
      return {
        action: AIActionType.CIRCLE,
        targetPosition: circlePos,
        priority: 4,
        reason: "Tactical repositioning (전술적 이동)",
      };
    } else {
      const approachPos = this.calculateApproachPosition(context);
      return {
        action: AIActionType.APPROACH,
        targetPosition: approachPos,
        priority: 4,
        reason: "Moving to optimal range (최적 거리로 이동)",
      };
    }
  }

  /**
   * Evaluate defensive tactics
   */
  private evaluateDefense(
    context: CombatContext,
    personality: AIPersonality
  ): AIDecision {
    const shouldDefend =
      Math.random() < personality.defensePreference &&
      context.recentDamageTaken > 20;

    if (shouldDefend) {
      return {
        action: AIActionType.DEFEND,
        priority: 6,
        reason: "Defensive response to damage",
      };
    }

    return {
      action: AIActionType.WAIT,
      priority: 0,
      reason: "No defensive need",
    };
  }

  /**
   * Decide combo action
   */
  private decideComboAction(
    _context: CombatContext,
    _personality: AIPersonality
  ): AIDecision {
    return {
      action: AIActionType.COMBO,
      priority: 9,
      reason: "Continuing active combo",
    };
  }

  /**
   * Calculate retreat position
   */
  private calculateRetreatPosition(context: CombatContext): Position {
    const dx = context.playerPosition.x - context.opponentPosition.x;
    const dy = context.playerPosition.y - context.opponentPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If distance is too small, retreat in a default direction (away from center)
    if (distance < AIDecisionTree.MIN_DISTANCE_THRESHOLD) {
      const retreatDistance = 150;
      return this.clampToArenaBounds(
        {
          x: context.playerPosition.x + retreatDistance,
          y: context.playerPosition.y,
        },
        context.arenaBounds
      );
    }

    // Normalize and retreat
    const retreatDistance = 150;
    const nx = dx / distance;
    const ny = dy / distance;

    return this.clampToArenaBounds(
      {
        x: context.playerPosition.x + nx * retreatDistance,
        y: context.playerPosition.y + ny * retreatDistance,
      },
      context.arenaBounds
    );
  }

  /**
   * Calculate approach position
   */
  private calculateApproachPosition(context: CombatContext): Position {
    const offsetX = (Math.random() - 0.5) * 80;
    const offsetY = (Math.random() - 0.5) * 60;

    return this.clampToArenaBounds(
      {
        x: context.opponentPosition.x + offsetX,
        y: context.opponentPosition.y + offsetY,
      },
      context.arenaBounds
    );
  }

  /**
   * Calculate circle position
   */
  private calculateCirclePosition(context: CombatContext): Position {
    const angle = Math.atan2(
      context.opponentPosition.y - context.playerPosition.y,
      context.opponentPosition.x - context.playerPosition.x
    );
    const circleRadius = 150 + Math.random() * 50;

    return this.clampToArenaBounds(
      {
        x: context.opponentPosition.x + Math.cos(angle + Math.PI / 2) * circleRadius,
        y: context.opponentPosition.y + Math.sin(angle + Math.PI / 2) * circleRadius,
      },
      context.arenaBounds
    );
  }

  /**
   * Select counter-stance to opponent's stance (fix for issue #2529466994)
   * Implements actual counter logic based on Korean martial arts philosophy
   */
  private selectCounterStance(
    opponentStance: TrigramStance,
    personality: AIPersonality
  ): TrigramStance {
    // Define counter relationships based on trigram philosophy
    const stanceCounters: Record<TrigramStance, TrigramStance[]> = {
      [TrigramStance.GEON]: [TrigramStance.GAM, TrigramStance.GON], // Heaven countered by Water, Earth
      [TrigramStance.TAE]: [TrigramStance.LI, TrigramStance.GEON], // Lake countered by Fire, Heaven
      [TrigramStance.LI]: [TrigramStance.GAM, TrigramStance.SON], // Fire countered by Water, Wind
      [TrigramStance.JIN]: [TrigramStance.GAN, TrigramStance.GON], // Thunder countered by Mountain, Earth
      [TrigramStance.SON]: [TrigramStance.GAN, TrigramStance.GEON], // Wind countered by Mountain, Heaven
      [TrigramStance.GAM]: [TrigramStance.GON, TrigramStance.GAN], // Water countered by Earth, Mountain
      [TrigramStance.GAN]: [TrigramStance.JIN, TrigramStance.TAE], // Mountain countered by Thunder, Lake
      [TrigramStance.GON]: [TrigramStance.SON, TrigramStance.LI], // Earth countered by Wind, Fire
    };

    const counters = stanceCounters[opponentStance] ?? [];

    // Try to find a counter that's also in favored stances
    const favoredCounters = counters.filter((s) =>
      personality.favoredStances.includes(s)
    );

    if (favoredCounters.length > 0) {
      return favoredCounters[
        Math.floor(Math.random() * favoredCounters.length)
      ];
    }

    // Fallback to any counter stance
    if (counters.length > 0) {
      return counters[Math.floor(Math.random() * counters.length)];
    }

    // Last resort: use favored stance
    if (personality.favoredStances.length > 0) {
      return personality.favoredStances[
        Math.floor(Math.random() * personality.favoredStances.length)
      ];
    }

    // Ultimate fallback: different stance (issue #2529728009)
    const allStances = Object.values(TrigramStance);
    const filtered = allStances.filter((s) => s !== opponentStance);
    if (filtered.length === 0) {
      return opponentStance; // Edge case: same stance
    }
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  /**
   * Reset decision state
   */
  reset(): void {
    this.lastDecisionTime = 0;
    this.consecutiveAttacks = 0;
    this.lastStanceChange = 0;
  }
}
