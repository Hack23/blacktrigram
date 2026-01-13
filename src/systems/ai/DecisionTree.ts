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
import { BalanceState } from "@/types/player-visual";
import { DifficultyParameters } from "./AdaptiveDifficulty";
import { AIPersonality, getArchetypeBehavior } from "./AIPersonality";
import { AIComboSystem } from "./ComboSystem";

/**
 * Game grid cell size in pixels for distance calculations
 * 
 * @korean 게임 그리드 셀 크기 (픽셀)
 */
const CELL_SIZE = 40;

/**
 * Distance-based stance preferences for tactical positioning
 * 
 * Stances are categorized by optimal combat range:
 * - **CLOSE (1-2 cells)**: Aggressive stances for close quarters (GEON, JIN, LI, SON)
 * - **MID (3-4 cells)**: Adaptive stances for mid-range (GAM, TAE, GAN)
 * - **FAR (5+ cells)**: Defensive stances for distance (GAN, GON)
 * 
 * **Note**: GAN (Mountain) intentionally appears in both MID and FAR ranges.
 * It represents a highly stable defensive posture that can be held while
 * maintaining mid-range pressure or retreating to long distance. This
 * overlap slightly increases GAN's selection frequency by design, reflecting
 * the Mountain's versatility in Korean martial arts philosophy.
 * 
 * @korean 거리별 자세 선호도
 */
const DISTANCE_BASED_STANCES: Record<string, readonly TrigramStance[]> = {
  CLOSE: [TrigramStance.GEON, TrigramStance.JIN, TrigramStance.LI, TrigramStance.SON], // 1-2 cells
  MID: [TrigramStance.GAM, TrigramStance.TAE, TrigramStance.GAN], // 3-4 cells
  FAR: [TrigramStance.GAN, TrigramStance.GON], // 5+ cells (GAN shared with MID as versatile defensive stance)
};

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
 * Vulnerability assessment context for exploitation tactics
 * 
 * Comprehensive analysis of opponent's defenseless states:
 * - **isHelpless**: Balance === HELPLESS (90% takedown priority)
 * - **isVulnerable**: Balance === VULNERABLE or HELPLESS (70% aggressive attack priority)
 * - **isShaken**: Balance === SHAKEN, VULNERABLE, or HELPLESS (50% pressure tactics priority)
 * - **hasLowStamina**: Stamina < 20% (60% exploitation priority)
 * - **hasNoKi**: Ki < 10% (50% technique spam priority)
 * - **overallVulnerability**: Composite vulnerability score (0.0-1.0)
 * 
 * @korean 취약성 평가 컨텍스트
 */
export interface VulnerabilityContext {
  readonly isHelpless: boolean; // balance === HELPLESS
  readonly isVulnerable: boolean; // balance === VULNERABLE or HELPLESS
  readonly isShaken: boolean; // balance === SHAKEN, VULNERABLE, or HELPLESS
  readonly hasLowStamina: boolean; // stamina < 20%
  readonly hasNoKi: boolean; // ki < 10%
  readonly overallVulnerability: number; // 0.0-1.0 composite score
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
  readonly opponentBalance?: BalanceState; // Balance state: "READY" | "SHAKEN" | "VULNERABLE" | "HELPLESS"
  readonly opponentStamina?: number; // Opponent stamina for exploitation
  readonly opponentMaxStamina?: number; // Opponent max stamina
  readonly opponentKi?: number; // Opponent ki for exploitation
  readonly opponentMaxKi?: number; // Opponent max ki
  readonly stanceFatigue?: {
    readonly timeInStance: number; // Milliseconds in current stance
  };
  readonly arenaBounds: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
}

/**
 * Assess opponent vulnerability for exploitation tactics
 * 
 * Analyzes multiple vulnerability factors to create comprehensive assessment:
 * - Balance states (HELPLESS/VULNERABLE/SHAKEN)
 * - Stamina depletion (< 20%)
 * - Ki depletion (< 10%)
 * - Composite vulnerability score (weighted average)
 * 
 * **Korean Philosophy (취약성 평가)**:
 * Traditional Korean martial arts teach reading opponent's weakness:
 * - 기회 포착 (Gihoei Pochak) - Seizing opportunities
 * - 약점 공격 (Yakjeom Gonggyeok) - Exploiting weaknesses
 * - 결정타 (Gyeoljeongta) - Delivering decisive strikes
 * 
 * @korean 상대 취약성 평가
 * 
 * @param context - Current combat context with opponent state
 * @returns Vulnerability assessment with boolean flags and composite score
 */
function assessVulnerability(context: CombatContext): VulnerabilityContext {
  // Balance-based vulnerability (Issue #enhance-intelligence-operative-ai)
  // Uses balance state enum from context: HELPLESS, VULNERABLE, SHAKEN, READY
  const isHelpless = context.opponentBalance === "HELPLESS";
  const isVulnerable = 
    context.opponentBalance === "VULNERABLE" || 
    context.opponentBalance === "HELPLESS";
  const isShaken = 
    context.opponentBalance === "SHAKEN" || 
    context.opponentBalance === "VULNERABLE" || 
    context.opponentBalance === "HELPLESS";
  
  // Resource-based vulnerability (Issue #enhance-intelligence-operative-ai)
  // Stamina and ki depletion indicate defensive weakness
  const staminaPercent = context.opponentStamina && context.opponentMaxStamina 
    ? context.opponentStamina / context.opponentMaxStamina 
    : 1.0;
  const kiPercent = context.opponentKi && context.opponentMaxKi 
    ? context.opponentKi / context.opponentMaxKi 
    : 1.0;
  
  const hasLowStamina = staminaPercent < 0.20; // < 20% stamina
  const hasNoKi = kiPercent < 0.10; // < 10% ki
  
  // Composite vulnerability score (0.0-1.0) with weighted factors:
  // - Balance: 40% weight (most critical - physical vulnerability)
  // - Stamina: 30% weight (affects defensive capability)
  // - Ki: 30% weight (affects technique usage)
  let balanceVulnerability = 0.0;
  if (isHelpless) balanceVulnerability = 1.0;
  else if (isVulnerable) balanceVulnerability = 0.7;
  else if (isShaken) balanceVulnerability = 0.5;
  
  const overallVulnerability = 
    balanceVulnerability * 0.4 + 
    (1 - staminaPercent) * 0.3 + 
    (1 - kiPercent) * 0.3;
  
  return {
    isHelpless,
    isVulnerable,
    isShaken,
    hasLowStamina,
    hasNoKi,
    overallVulnerability,
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
 * - **취약성 공략** (Vulnerability Exploitation): Exploits defenseless states with precision (Issue #enhance-intelligence-operative-ai)
 */
export class AIDecisionTree {
  private lastDecisionTime = 0;
  private decisionCooldown = 50; // 50ms minimum between decisions
  private consecutiveAttacks = 0;
  private lastStanceChange = 0;
  private readonly stanceChangeCooldown = 3000; // 3 seconds

  // Psychological warfare tracking (Issue #enhance-intelligence-operative-ai)
  // Tracks cumulative psychological pressure for Intelligence Operative archetype
  private psychologicalPressure = 0; // 0-100: Cumulative psychological pressure
  private lastPressureActionTime = 0; // Timestamp of last pressure-building action

  // Systems for advanced decision-making
  private trigramSystem: TrigramSystem;
  private difficultyLevel: number = 0.5; // 0.0-1.0: AI skill level
  private difficultyParams?: DifficultyParameters; // Difficulty parameters for AI behavior
  private currentReactionDelay: number = 50; // Current reaction delay (calculated once per param change)

  // Movement constants
  private static readonly MOVE_STEP_SIZE = 50; // Fixed movement step size in pixels
  private static readonly MIN_DISTANCE_THRESHOLD = 5; // Minimum distance to avoid division by zero
  
  /**
   * Scaling factor for fatigue override probability calculation.
   * Used to convert fatigue modifier to override chance in non-linear manner.
   * Value of 0.5 provides gradual scaling: 1.2x fatigue → ~10% override, 1.5x → ~25%.
   * 
   * @korean 피로도 우선순위 무시 배율
   */
  private static readonly FATIGUE_OVERRIDE_SCALING_FACTOR = 0.5;
  
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
        modified.retreat *= 1.2; // Will retreat if needed (survival instinct)
        break;
    }
    
    return modified;
  }

  /**
   * Apply Intelligence Operative (Jeongbo Yowon) vulnerability exploitation
   * 
   * Enhances decision weights to exploit opponent's defenseless states with precision:
   * - **HELPLESS (balance === HELPLESS)**: 90% takedown priority - Execute precision takedown
   * - **VULNERABLE (balance === VULNERABLE)**: 70% aggressive attack - Sustained pressure tactics
   * - **SHAKEN (balance === SHAKEN)**: 50% pressure increase - Psychological warfare
   * - **Low Stamina (< 20%)**: 60% exploitation - Force defensive positions
   * - **No Ki (< 10%)**: 50% technique spam - Prevent powerful techniques
   * 
   * **Multiplier Stacking Behavior**:
   * When multiple vulnerabilities are present, multipliers stack multiplicatively:
   * - VULNERABLE (2.0x attack) + low stamina (1.5x attack) = 3.0x total attack multiplier
   * - VULNERABLE (1.8x technique) + low ki (1.4x technique) = 2.52x total technique multiplier
   * This creates increasingly aggressive exploitation as opponent becomes more vulnerable.
   * Note: HELPLESS state uses exclusive else-if, so it doesn't stack with VULNERABLE/SHAKEN.
   * 
   * **Jeongbo Philosophy (정보요원 전략)**:
   * - Knowledge through observation (관찰을 통한 지식)
   * - Psychological manipulation (심리적 조작)
   * - Precise timing (정확한 타이밍)
   * - Strategic exploitation (전략적 공략)
   * 
   * This function provides 3x higher vulnerability exploitation rate than Musa,
   * 2x higher psychological warfare usage than Amsalja, and 5x higher takedown
   * success rate when opponent is HELPLESS.
   * 
   * @korean 정보요원 취약성 공략
   * 
   * @param weights - Base action weight multipliers
   * @param vulnerability - Vulnerability assessment context
   * @param personality - AI personality archetype
   * @returns Modified action weights for Jeongbo exploitation
   */
  private applyJeongboExploitation(
    weights: { attack: number; technique: number; defend: number; feint: number; approach: number; circle: number },
    vulnerability: VulnerabilityContext,
    personality: AIPersonality
  ): { attack: number; technique: number; defend: number; feint: number; approach: number; circle: number } {
    // Only Jeongbo gets vulnerability exploitation bonuses
    if (personality.archetype !== PlayerArchetype.JEONGBO_YOWON) {
      return weights;
    }
    
    const modified = { ...weights };
    
    // Check for psychological pressure buildup (Issue #enhance-intelligence-operative-ai Phase 3)
    const pressureStrike = this.shouldExecutePressureStrike(vulnerability);
    if (pressureStrike) {
      // Psychological pressure ≥ 50 + Opponent VULNERABLE = Decisive Strike
      modified.technique *= 3.0; // Execute decisive psychological technique
      modified.attack *= 0.3; // Reduce basic attacks
      return modified; // Override other modifiers for pressure strike
    }
    
    // HELPLESS: Execute precision takedown (90% priority)
    if (vulnerability.isHelpless) {
      modified.technique *= 5.0; // Massive technique priority for Precision Takedown
      modified.attack *= 0.2; // Reduce basic attacks
      modified.defend *= 0.1; // Minimal defense needed
      modified.feint *= 0.1; // No feinting during execution
    }
    // VULNERABLE: Aggressive pressure (70% priority)
    else if (vulnerability.isVulnerable) {
      modified.attack *= 2.0; // Increased attack frequency
      modified.technique *= 1.8; // Tactical Strike priority
      modified.feint *= 0.5; // Less feinting, more action
      modified.defend *= 0.5; // Reduced defense (maintain offensive)
    }
    // SHAKEN: Psychological warfare (50% priority)
    else if (vulnerability.isShaken) {
      modified.feint *= 2.0; // Increase psychological pressure
      modified.circle *= 1.5; // Intimidation tactics (circling)
      modified.technique *= 1.3; // "Psychological Warfare" technique
    }
    
    // Low stamina: Relentless pressure (60% priority)
    if (vulnerability.hasLowStamina) {
      modified.attack *= 1.5; // Force stamina drain
      modified.approach *= 1.3; // Close distance to pressure
    }
    
    // No ki: Technique spam (50% priority)
    if (vulnerability.hasNoKi) {
      modified.technique *= 1.4; // Opponent can't use powerful techniques
      modified.attack *= 1.3; // Maintain offensive
    }
    
    return modified;
  }

  /**
   * Build psychological pressure through intimidation tactics
   * 
   * Intelligence Operative uses feints, circling, and approach/retreat patterns
   * to build cumulative psychological pressure on opponent. When pressure reaches
   * 50+ and opponent is VULNERABLE, triggers decisive strike.
   * 
   * **Psychological Tactics (심리전 전술)**:
   * - Feints: +10 pressure (fake attacks create hesitation)
   * - Circling: +5 pressure (predator circling prey)
   * - Approach: +3 pressure (aggressive positioning)
   * - Decay: -3 pressure per second (pressure fades without action)
   * 
   * @korean 심리적 압박 증가
   * 
   * @param actionType - Type of action taken (FEINT, CIRCLE, APPROACH, etc.)
   * @param now - Current timestamp for decay calculation
   */
  private buildPsychologicalPressure(actionType: AIActionType, now: number): void {
    // Apply pressure decay (3 points per second since last pressure action)
    if (this.lastPressureActionTime > 0) {
      const timeSinceLastAction = now - this.lastPressureActionTime;
      const decayAmount = (timeSinceLastAction / 1000) * 3; // 3 points per second
      this.psychologicalPressure = Math.max(0, this.psychologicalPressure - decayAmount);
    }
    
    // Build pressure based on action type
    switch (actionType) {
      case AIActionType.FEINT:
        this.psychologicalPressure = Math.min(100, this.psychologicalPressure + 10);
        this.lastPressureActionTime = now;
        break;
      case AIActionType.CIRCLE:
        this.psychologicalPressure = Math.min(100, this.psychologicalPressure + 5);
        this.lastPressureActionTime = now;
        break;
      case AIActionType.APPROACH:
        this.psychologicalPressure = Math.min(100, this.psychologicalPressure + 3);
        this.lastPressureActionTime = now;
        break;
      // Attacks and techniques release pressure (execution phase)
      case AIActionType.ATTACK:
      case AIActionType.TECHNIQUE:
        // Pressure resets after decisive action
        this.psychologicalPressure = Math.max(0, this.psychologicalPressure * 0.5);
        break;
    }
  }

  /**
   * Check if psychological pressure should trigger decisive strike
   * 
   * Jeongbo executes decisive technique when:
   * - Psychological pressure ≥ 50 (sustained intimidation)
   * - Opponent is VULNERABLE or worse (balance < 30)
   * - Returns true to boost technique priority
   * 
   * @korean 심리적 압박 결정타 확인
   * 
   * @param vulnerability - Vulnerability assessment context
   * @returns True if pressure warrants decisive strike
   */
  private shouldExecutePressureStrike(vulnerability: VulnerabilityContext): boolean {
    return (
      this.psychologicalPressure >= 50 &&
      (vulnerability.isVulnerable || vulnerability.isHelpless)
    );
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

    // Assess opponent vulnerability for exploitation (Issue #enhance-intelligence-operative-ai)
    const vulnerability = assessVulnerability(context);

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

    // Apply Jeongbo vulnerability exploitation (Issue #enhance-intelligence-operative-ai)
    // This provides 3x higher exploitation rate than other archetypes
    let modifiedDecisions = decisions;
    if (personality.archetype === PlayerArchetype.JEONGBO_YOWON) {
      modifiedDecisions = decisions.map((decision) => {
        // Skip survival decisions (preserve self-preservation)
        const SURVIVAL_REASON_KEYWORDS = [
          "critical health", "high pain", "survival retreat", "emergency retreat",
          "위급 상황", "고통 회피",
        ];
        const reasonLower = decision.reason.toLowerCase();
        const hasSurvivalKeyword = SURVIVAL_REASON_KEYWORDS.some((keyword) =>
          reasonLower.includes(keyword)
        );
        const isSurvivalRetreat =
          decision.action === AIActionType.RETREAT &&
          (decision.priority === 20 || hasSurvivalKeyword);
        
        if (isSurvivalRetreat) {
          return decision;
        }
        
        // Only apply exploitation to relevant action types
        // Other actions (COUNTER, RETREAT, WAIT, STANCE_CHANGE, COMBO) maintain original priority
        const exploitableActions = [
          AIActionType.ATTACK,
          AIActionType.TECHNIQUE,
          AIActionType.DEFEND,
          AIActionType.FEINT,
          AIActionType.APPROACH,
          AIActionType.CIRCLE,
        ];
        
        if (!exploitableActions.includes(decision.action)) {
          return decision; // Preserve priority for non-exploitable actions
        }
        
        // Calculate base action weights including feint, approach, circle
        const weights = {
          attack: decision.action === AIActionType.ATTACK ? 1.0 : 0.0,
          technique: decision.action === AIActionType.TECHNIQUE ? 1.0 : 0.0,
          defend: decision.action === AIActionType.DEFEND ? 1.0 : 0.0,
          feint: decision.action === AIActionType.FEINT ? 1.0 : 0.0,
          approach: decision.action === AIActionType.APPROACH ? 1.0 : 0.0,
          circle: decision.action === AIActionType.CIRCLE ? 1.0 : 0.0,
        };
        
        // Apply Jeongbo exploitation modifiers
        const modifiedWeights = this.applyJeongboExploitation(weights, vulnerability, personality);
        
        // Adjust priority based on modified weights
        let newPriority = decision.priority;
        if (decision.action === AIActionType.ATTACK) {
          newPriority = decision.priority * modifiedWeights.attack;
        } else if (decision.action === AIActionType.TECHNIQUE) {
          newPriority = decision.priority * modifiedWeights.technique;
        } else if (decision.action === AIActionType.DEFEND) {
          newPriority = decision.priority * modifiedWeights.defend;
        } else if (decision.action === AIActionType.FEINT) {
          newPriority = decision.priority * modifiedWeights.feint;
        } else if (decision.action === AIActionType.APPROACH) {
          newPriority = decision.priority * modifiedWeights.approach;
        } else if (decision.action === AIActionType.CIRCLE) {
          newPriority = decision.priority * modifiedWeights.circle;
        }
        
        return { ...decision, priority: newPriority };
      });
    }

    // Apply kill mode modifiers to boost aggression (Issue #enhance-ai-aggression)
    if (killModeActive) {
      // Map decisions to new array with modified priorities
      modifiedDecisions = modifiedDecisions.map((decision) => {
        // CRITICAL: Survival decisions (retreat for self-preservation) should NOT be affected by kill mode
        // Kill mode is about finishing the opponent, not about ignoring the AI's own safety
        // Survival retreats are identified by priority 20 OR reason containing survival keywords
        // Survival retreat detection with English and Korean keywords
        const SURVIVAL_REASON_KEYWORDS = [
          // English survival indicators (lowercase)
          "critical health",
          "high pain",
          "survival retreat",
          "emergency retreat",
          // Korean survival indicators
          "위급 상황",
          "고통 회피",
        ];

        const reasonLower = decision.reason.toLowerCase();
        const hasSurvivalKeyword = SURVIVAL_REASON_KEYWORDS.some((keyword) =>
          reasonLower.includes(keyword)
        );

        const isSurvivalRetreat =
          decision.action === AIActionType.RETREAT &&
          (decision.priority === 20 || hasSurvivalKeyword);
           
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

      // Build psychological pressure for Jeongbo (Issue #enhance-intelligence-operative-ai Phase 3)
      if (personality.archetype === PlayerArchetype.JEONGBO_YOWON) {
        this.buildPsychologicalPressure(bestDecision.action, now);
      }

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

    // Normal mode: Select highest priority decision (may have Jeongbo exploitation applied)
    const bestDecision = modifiedDecisions.reduce((best, current) =>
      current.priority > best.priority ? current : best
    );

    // Build psychological pressure for Jeongbo (Issue #enhance-intelligence-operative-ai Phase 3)
    if (personality.archetype === PlayerArchetype.JEONGBO_YOWON) {
      this.buildPsychologicalPressure(bestDecision.action, now);
    }

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
   * Select stance based on distance to opponent
   * 
   * Chooses optimal stance for current combat range, prioritizing:
   * 1. Overlap between distance-optimal stances and archetype preferred stances
   * 2. Any distance-optimal stance if no overlap exists (expands tactical repertoire)
   * 3. Avoids switching to current stance
   * 
   * **Distance Categories**:
   * - CLOSE (≤2 cells / 80px): GEON, JIN, LI, SON - Aggressive close-quarters stances
   * - MID (3-4 cells / 120-160px): GAM, TAE, GAN - Adaptive mid-range stances
   * - FAR (≥5 cells / 200px+): GAN, GON - Defensive distance stances
   * 
   * @korean 거리별 자세 선택
   * 
   * @param distance - Distance to opponent in pixels
   * @param preferredStances - Archetype's preferred stances
   * @param currentStance - Current stance (to avoid redundant switches)
   * @returns Optimal stance for distance, or undefined if no valid options
   */
  private selectStanceForDistance(
    distance: number,
    preferredStances: readonly TrigramStance[],
    currentStance: TrigramStance
  ): TrigramStance | undefined {
    // Determine distance category using module-level CELL_SIZE constant
    let distanceCategory: string;
    if (distance <= 2 * CELL_SIZE) {
      distanceCategory = "CLOSE";
    } else if (distance <= 4 * CELL_SIZE) {
      distanceCategory = "MID";
    } else {
      distanceCategory = "FAR";
    }
    
    const optimalStances = DISTANCE_BASED_STANCES[distanceCategory];
    
    // Find overlap between optimal stances and preferred stances
    const candidates = optimalStances.filter(s => preferredStances.includes(s));
    
    // If no overlap, use any optimal stance (expand tactical repertoire)
    const finalCandidates = candidates.length > 0 ? candidates : optimalStances;
    
    // Don't switch to current stance
    const filtered = finalCandidates.filter(s => s !== currentStance);
    
    if (filtered.length === 0) {
      return undefined;
    }
    
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  /**
   * Evaluate stance change using TrigramSystem and distance-based selection
   *
   * **Korean Philosophy (자세 전환)**:
   * Uses I Ching-based trigram system to find optimal stance transitions.
   * Considers resource costs, counter-stance effectiveness, archetype preferences,
   * and distance-based tactical positioning.
   * 
   * **Dynamic Stance Rotation (Issue #dynamic-ai-stance-rotation)**:
   * - Integrates distance-based stance selection for tactical variety
   * - Prioritizes counter-stances for opponent matchup advantage
   * - Expands tactical repertoire beyond archetype preferences when needed
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

    const behavior = getArchetypeBehavior(personality.archetype);
    
    // Apply stance fatigue modifier (Issue #dynamic-ai-stance-rotation Phase 4)
    // Increases stance switch probability based on time in current stance:
    // - After 10 seconds: +20% increase (1.2x multiplier)
    // - After 20 seconds: +50% increase (1.5x multiplier)
    const timeInStance = Math.max(0, context.stanceFatigue?.timeInStance ?? 0);
    const fatigueModifier = this.getStanceFatigueModifier(timeInStance);
    const adjustedSwitchFrequency = Math.min(0.95, personality.stanceSwitchFrequency * fatigueModifier);
    
    // Single random check using fatigue-adjusted frequency to avoid compounding probability
    const shouldChange = Math.random() < adjustedSwitchFrequency;
    if (!shouldChange) {
      return {
        action: AIActionType.WAIT,
        priority: 0,
        reason: fatigueModifier > 1.0 
          ? `Stance change deferred (fatigue: ${fatigueModifier.toFixed(2)}x, probability: ${(adjustedSwitchFrequency * 100).toFixed(1)}%)` 
          : "No stance change needed",
      };
    }
    
    // Check if already in a preferred stance - if so, reduce change chance (but not completely)
    // This check only applies outside combat to avoid stance lock during active fighting
    const inPreferredStance = behavior.preferredStances.includes(context.playerStance);
    if (inPreferredStance && !context.isOpponentAttacking && Math.random() < 0.6) {
      // 60% chance to stay in preferred stance when not under immediate pressure
      // However, fatigue can override this (higher fatigue = more likely to switch anyway)
      // Use non-linear scaling for gradual, predictable override behavior:
      // - At 1.2x fatigue (10s): ~10% override chance
      // - At 1.5x fatigue (20s): ~25% override chance
      // - Caps at 80% to preserve some tactical consideration
      const fatigueOverrideProbability =
        fatigueModifier > 1.0
          ? Math.min(0.8, (fatigueModifier - 1.0) * AIDecisionTree.FATIGUE_OVERRIDE_SCALING_FACTOR)
          : 0;
      const fatigueOverride =
        fatigueModifier > 1.2 && Math.random() < fatigueOverrideProbability;
      if (!fatigueOverride) {
        return {
          action: AIActionType.WAIT,
          priority: 0,
          reason: "Already in preferred stance (선호 자세 유지)",
        };
      }
    }

    // Create a minimal PlayerState object with only the properties actually used
    const playerState = {
      currentStance: context.playerStance,
      ki: context.playerKi,
      stamina: context.playerStamina,
      archetype: personality.archetype,
    } as unknown as PlayerState;

    // Priority 1: Try distance-based stance selection for tactical variety
    const distanceStance = this.selectStanceForDistance(
      context.distanceToOpponent,
      behavior.preferredStances,
      context.playerStance
    );
    
    if (distanceStance && this.trigramSystem.canTransitionTo(
      context.playerStance,
      distanceStance,
      playerState
    )) {
      this.lastStanceChange = now;
      return {
        action: AIActionType.STANCE_CHANGE,
        targetStance: distanceStance,
        priority: 7,
        reason: `Distance-optimal stance (거리 최적 자세: ${distanceStance})`,
      };
    }

    // Priority 2: Try counter-stance for opponent matchup
    const counterStance = this.trigramSystem.getCounterStance(context.opponentStance);
    if (counterStance !== context.playerStance && this.trigramSystem.canTransitionTo(
      context.playerStance,
      counterStance,
      playerState
    )) {
      this.lastStanceChange = now;
      return {
        action: AIActionType.STANCE_CHANGE,
        targetStance: counterStance,
        priority: 6,
        reason: `Counter stance to ${context.opponentStance} (상극 대응)`,
      };
    }

    // Priority 3: Use TrigramSystem to recommend optimal stance
    const recommendedStance = this.trigramSystem.recommendStance(playerState);
    
    if (this.trigramSystem.canTransitionTo(
      context.playerStance,
      recommendedStance,
      playerState
    )) {
      this.lastStanceChange = now;
      return {
        action: AIActionType.STANCE_CHANGE,
        targetStance: recommendedStance,
        priority: 6,
        reason: `Optimal stance transition via TrigramSystem (팔괘 전환)`,
      };
    }

    // Priority 4: Try archetype-preferred stance
    const preferredAvailable = behavior.preferredStances.find(
      (stance) => 
        stance !== context.playerStance &&
        this.trigramSystem.canTransitionTo(context.playerStance, stance, playerState)
    );
    
    if (preferredAvailable) {
      this.lastStanceChange = now;
      return {
        action: AIActionType.STANCE_CHANGE,
        targetStance: preferredAvailable,
        priority: 5,
        reason: `Switching to preferred stance (선호 자세 전환: ${preferredAvailable})`,
      };
    }

    // No viable stance change available
    return {
      action: AIActionType.WAIT,
      priority: 0,
      reason: "No viable stance transition",
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
   * Calculate stance fatigue modifier for increased switching probability
   * 
   * Applies time-based modifiers to encourage dynamic stance rotation:
   * - 0-10 seconds: No modifier (1.0x)
   * - 10-20 seconds: +20% increase (1.2x multiplier)
   * - 20+ seconds: +50% increase (1.5x multiplier)
   * 
   * This ensures AI doesn't stay locked in one stance for extended periods,
   * promoting the use of all 8 trigram stances throughout combat.
   * 
   * **Korean Philosophy (자세 피로도)**:
   * Remaining in one stance too long reduces tactical flexibility and
   * makes the fighter predictable. The Eight Trigram system requires
   * constant adaptation and flow between stances.
   * 
   * @korean 자세 피로도 배율 계산
   * 
   * @param timeInStance - Time in current stance in milliseconds
   * @returns Stance switch frequency multiplier (1.0 = no change, >1.0 = increased probability)
   */
  private getStanceFatigueModifier(timeInStance: number): number {
    if (timeInStance > 20000) {
      return 1.5; // 50% increase after 20 seconds
    }
    if (timeInStance > 10000) {
      return 1.2; // 20% increase after 10 seconds
    }
    return 1.0; // No modifier for first 10 seconds
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
   * Reset decision state
   */
  reset(): void {
    this.lastDecisionTime = 0;
    this.consecutiveAttacks = 0;
    this.lastStanceChange = 0;
    // Reset psychological pressure tracking (Issue #enhance-intelligence-operative-ai Phase 3)
    this.psychologicalPressure = 0;
    this.lastPressureActionTime = 0;
  }
}
