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
   * Make strategic decision based on combat context
   */
  makeDecision(
    context: CombatContext,
    personality: AIPersonality,
    comboSystem: AIComboSystem
  ): AIDecision {
    const now = Date.now();

    // Respect decision cooldown for performance
    if (now - this.lastDecisionTime < this.decisionCooldown) {
      return {
        action: AIActionType.WAIT,
        priority: 0,
        reason: "Decision cooldown active",
      };
    }

    this.lastDecisionTime = now;

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
      decisions.push(this.evaluateCounter(context, personality));
    }

    // 3. Combo initiation (only if at reasonable distance)
    if (distance < optimalRange * 1.5) {
      decisions.push(this.evaluateComboStart(context, personality, comboSystem));
    }

    // 4. Stance transition
    decisions.push(this.evaluateStanceChange(context, personality, now));

    // 5. Feint attack (only at mid-close range)
    if (distance < optimalRange * 1.8) {
      decisions.push(this.evaluateFeint(context, personality));
    }

    // 6. Distance-based tactics (archetype-aware ranges)
    if (distance < optimalRange * 1.2) {
      // Close to optimal range - use close-range tactics including vital point targeting
      decisions.push(this.evaluateCloseRange(context, personality));
    } else if (distance > optimalRange * 1.8) {
      // Too far - need to approach
      decisions.push(this.evaluateApproach(context, personality));
    } else {
      // Mid-range - good tactical position
      decisions.push(this.evaluateMidRange(context, personality));
    }

    // 7. Defensive positioning
    decisions.push(this.evaluateDefense(context, personality));

    // Select highest priority decision
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
        priority: 10, // Highest priority
        reason: isCritical 
          ? `Critical health: ${(healthPercent * 100).toFixed(1)}% (위급 상황)`
          : `High pain: ${painLevel.toFixed(0)} (고통 회피)`,
      };
    }

    return { action: AIActionType.WAIT, priority: 0, reason: "Health stable" };
  }

  /**
   * Evaluate counter-attack opportunity
   */
  private evaluateCounter(
    context: CombatContext,
    personality: AIPersonality
  ): AIDecision {
    const shouldCounter =
      Math.random() < personality.defensePreference * 0.8 &&
      context.distanceToOpponent < 150;

    if (shouldCounter) {
      return {
        action: AIActionType.COUNTER,
        priority: 8,
        reason: "Opponent attacking - counter opportunity",
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
   * Considers resource costs and counter-stance effectiveness.
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
      // Try counter-stance instead
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
   */
  private evaluateCloseRange(
    context: CombatContext,
    personality: AIPersonality
  ): AIDecision {
    const hasResources = context.playerKi > 10 && context.playerStamina > 15;
    const aggression = personality.aggressionLevel;

    // Select vital point target based on difficulty
    const targetVitalPoint = this.selectVitalPointTarget(context, personality);

    // Get Korean name for logging if vital point is selected
    const vitalPointName = targetVitalPoint
      ? getVitalPointById(targetVitalPoint)?.names.korean ?? targetVitalPoint
      : undefined;

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
   */
  private evaluateApproach(
    context: CombatContext,
    personality: AIPersonality
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
    const movementBias = this.getArchetypeMovementBias(personality.archetype);
    let approachPos: Position;

    // Archetype-specific approach patterns
    if (personality.archetype === PlayerArchetype.MUSA && Math.random() < 0.7) {
      // Musa: Direct charge 70% of the time
      approachPos = this.calculateDirectApproach(context);
    } else if (personality.archetype === PlayerArchetype.AMSALJA && Math.random() < 0.4) {
      // Amsalja: Flanking approach 40% of the time
      approachPos = this.calculateFlankingApproach(context);
    } else {
      // Default approach with slight randomization
      approachPos = this.calculateApproachPosition(context);
    }

    // Calculate priority based on distance from optimal range
    // Very far: priority ~6-7, moderate distance: priority ~5
    const basePriority = 4;
    const distanceRatio = Math.min(2, (distance - optimalRange) / optimalRange);
    const priorityBoost = distanceRatio * movementBias * 0.8;
    const finalPriority = basePriority + priorityBoost;

    return {
      action: AIActionType.APPROACH,
      targetPosition: approachPos,
      priority: Math.min(8, finalPriority), // Cap at 8 to allow survival/critical actions to override
      reason: `Moving closer (distance: ${Math.round(
        distance
      )}, optimal: ${optimalRange})`,
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
   */
  private calculateDirectApproach(context: CombatContext): Position {
    const dx = context.opponentPosition.x - context.playerPosition.x;
    const dy = context.opponentPosition.y - context.playerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If already very close to the opponent, hold position (avoid erratic movement)
    if (distance < AIDecisionTree.MIN_DISTANCE_THRESHOLD) {
      return this.clampToArenaBounds(context.playerPosition, context.arenaBounds);
    }

    // Move straight toward opponent with fixed step size for consistent movement speed
    const step = Math.min(AIDecisionTree.MOVE_STEP_SIZE, distance);
    return this.clampToArenaBounds(
      {
        x: context.playerPosition.x + (dx / distance) * step,
        y: context.playerPosition.y + (dy / distance) * step,
      },
      context.arenaBounds
    );
  }

  /**
   * Calculate flanking approach position (diagonal/side approach)
   * Used primarily by Amsalja archetype for stealth positioning
   */
  private calculateFlankingApproach(context: CombatContext): Position {
    const dx = context.opponentPosition.x - context.playerPosition.x;
    const dy = context.opponentPosition.y - context.playerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If distance is too small, return player's current position (avoid erratic movement)
    if (distance < AIDecisionTree.MIN_DISTANCE_THRESHOLD) {
      return this.clampToArenaBounds(context.playerPosition, context.arenaBounds);
    }

    // Add perpendicular offset for flanking (40-60 pixels to the side)
    const flankOffset = 40 + Math.random() * 20;
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
   * - Hacker prefers to maintain this range
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

    // Archetype-specific mid-range behavior
    if (personality.archetype === PlayerArchetype.HACKER && Math.abs(distance - optimalRange) < 50) {
      // Hacker at ideal range - prefer to maintain position with circling
      const circlePos = this.calculateCirclePosition(context);
      return {
        action: AIActionType.CIRCLE,
        targetPosition: circlePos,
        priority: 6,
        reason: "Hacker maintaining optimal mid-range (사이버 위치 유지)",
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

    // Too close to optimal range - consider retreat or technique
    if (distance < optimalRange * 0.7 && personality.archetype === PlayerArchetype.HACKER) {
      const retreatPos = this.calculateRetreatPosition(context);
      return {
        action: AIActionType.RETREAT,
        targetPosition: retreatPos,
        priority: 5,
        reason: "Hacker creating space (거리 확보)",
      };
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
