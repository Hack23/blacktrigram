/**
 * AI Decision Tree for Korean Martial Arts Combat
 * Strategic decision-making system with multiple tactical options
 */

import { Position, TrigramStance } from "@/types";
import { AIPersonality } from "./AIPersonality";
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
 */
export class AIDecisionTree {
  private lastDecisionTime = 0;
  private decisionCooldown = 50; // 50ms minimum between decisions
  private consecutiveAttacks = 0;
  private lastStanceChange = 0;
  private readonly stanceChangeCooldown = 3000; // 3 seconds

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

    // 1. Critical health - survival priority
    decisions.push(this.evaluateSurvival(context, personality));

    // 2. Counter-attack opportunity
    if (context.isOpponentAttacking) {
      decisions.push(this.evaluateCounter(context, personality));
    }

    // 3. Combo initiation
    decisions.push(this.evaluateComboStart(context, personality, comboSystem));

    // 4. Stance transition
    decisions.push(this.evaluateStanceChange(context, personality, now));

    // 5. Feint attack
    decisions.push(this.evaluateFeint(context, personality));

    // 6. Distance-based tactics
    if (context.distanceToOpponent < 120) {
      decisions.push(this.evaluateCloseRange(context, personality));
    } else if (context.distanceToOpponent > 250) {
      decisions.push(this.evaluateApproach(context, personality));
    } else {
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
   */
  private evaluateSurvival(
    context: CombatContext,
    personality: AIPersonality
  ): AIDecision {
    const healthPercent = context.playerHealth / context.playerMaxHealth;

    if (healthPercent < personality.tacticalRetreatThreshold) {
      const retreatVector = this.calculateRetreatPosition(context);
      return {
        action: AIActionType.RETREAT,
        targetPosition: retreatVector,
        priority: 10, // Highest priority
        reason: `Critical health: ${(healthPercent * 100).toFixed(1)}%`,
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
      return { action: AIActionType.WAIT, priority: 0, reason: "Combo cooldown" };
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
   * Evaluate stance change
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

    // Select counter-stance to opponent
    const counterStance = this.selectCounterStance(
      context.opponentStance,
      personality
    );

    this.lastStanceChange = now;

    return {
      action: AIActionType.STANCE_CHANGE,
      targetStance: counterStance,
      priority: 5,
      reason: `Changing to counter ${context.opponentStance}`,
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
   * Evaluate close range tactics
   */
  private evaluateCloseRange(
    context: CombatContext,
    personality: AIPersonality
  ): AIDecision {
    const hasResources =
      context.playerKi > 10 && context.playerStamina > 15;
    const aggression = personality.aggressionLevel;

    if (Math.random() < aggression * 0.8) {
      return {
        action: AIActionType.ATTACK,
        priority: 6,
        reason: "Close range - aggressive strike",
      };
    } else if (Math.random() < aggression * 0.9 && hasResources) {
      return {
        action: AIActionType.TECHNIQUE,
        priority: 5,
        reason: "Close range - technique execution",
      };
    } else {
      return {
        action: AIActionType.DEFEND,
        priority: 4,
        reason: "Close range - defensive posture",
      };
    }
  }

  /**
   * Evaluate approach tactics
   */
  private evaluateApproach(
    context: CombatContext,
    _personality: AIPersonality
  ): AIDecision {
    const approachPos = this.calculateApproachPosition(context);

    return {
      action: AIActionType.APPROACH,
      targetPosition: approachPos,
      priority: 5,
      reason: `Moving closer (distance: ${Math.round(context.distanceToOpponent)})`,
    };
  }

  /**
   * Evaluate mid-range tactics
   */
  private evaluateMidRange(
    context: CombatContext,
    _personality: AIPersonality
  ): AIDecision {
    const hasResources = context.playerKi > context.playerMaxKi * 0.3;
    const tacticRoll = Math.random();

    if (tacticRoll < 0.3 && hasResources) {
      return {
        action: AIActionType.TECHNIQUE,
        priority: 5,
        reason: "Mid-range technique",
      };
    } else if (tacticRoll < 0.6) {
      const circlePos = this.calculateCirclePosition(context);
      return {
        action: AIActionType.CIRCLE,
        targetPosition: circlePos,
        priority: 4,
        reason: "Tactical repositioning",
      };
    } else {
      const approachPos = this.calculateApproachPosition(context);
      return {
        action: AIActionType.APPROACH,
        targetPosition: approachPos,
        priority: 4,
        reason: "Moving to optimal range",
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

    // Normalize and retreat
    const retreatDistance = 150;
    const nx = dx / distance;
    const ny = dy / distance;

    return {
      x: Math.max(
        context.arenaBounds.x,
        Math.min(
          context.arenaBounds.x + context.arenaBounds.width - 60,
          context.playerPosition.x + nx * retreatDistance
        )
      ),
      y: Math.max(
        context.arenaBounds.y,
        Math.min(
          context.arenaBounds.y + context.arenaBounds.height - 180,
          context.playerPosition.y + ny * retreatDistance
        )
      ),
    };
  }

  /**
   * Calculate approach position
   */
  private calculateApproachPosition(context: CombatContext): Position {
    const offsetX = (Math.random() - 0.5) * 80;
    const offsetY = (Math.random() - 0.5) * 60;

    return {
      x: Math.max(
        context.arenaBounds.x,
        Math.min(
          context.arenaBounds.x + context.arenaBounds.width - 60,
          context.opponentPosition.x + offsetX
        )
      ),
      y: Math.max(
        context.arenaBounds.y,
        Math.min(
          context.arenaBounds.y + context.arenaBounds.height - 180,
          context.opponentPosition.y + offsetY
        )
      ),
    };
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

    return {
      x: Math.max(
        context.arenaBounds.x,
        Math.min(
          context.arenaBounds.x + context.arenaBounds.width - 60,
          context.opponentPosition.x + Math.cos(angle + Math.PI / 2) * circleRadius
        )
      ),
      y: Math.max(
        context.arenaBounds.y,
        Math.min(
          context.arenaBounds.y + context.arenaBounds.height - 180,
          context.opponentPosition.y + Math.sin(angle + Math.PI / 2) * circleRadius
        )
      ),
    };
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

    const counters = stanceCounters[opponentStance] || [];
    
    // Try to find a counter that's also in favored stances
    const favoredCounters = counters.filter((s) =>
      personality.favoredStances.includes(s)
    );
    
    if (favoredCounters.length > 0) {
      return favoredCounters[Math.floor(Math.random() * favoredCounters.length)];
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
