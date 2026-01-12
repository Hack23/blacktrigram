/**
 * useAICombat Hook - AI Combat System Integration
 *
 * Custom hook for AI combat behavior with strategic decision-making.
 *
 * Manages AI opponent behavior including:
 * - Strategic decision-making via DecisionTree
 * - Combo attack sequences
 * - Adaptive difficulty based on player skill
 * - Performance monitoring (<10ms target for decisions)
 *
 * Side effects:
 * - Manages internal state for AI actions and aggression
 * - Sets up intervals/timers for AI action scheduling
 * - Updates state in response to combat events and round status
 *
 * @param config Configuration object for AI combat behavior.
 * @param config.player The AI-controlled player state.
 * @param config.opponent The opponent player state.
 * @param config.personality The AI's personality archetype.
 * @param config.adaptiveDifficulty Adaptive difficulty system instance.
 * @param config.arenaBounds Arena boundaries for movement validation.
 * @param config.roundStarted Whether the combat round has started.
 * @param config.roundEnded Whether the combat round has ended.
 * @param config.isPaused Whether the game is paused.
 * @param config.onExecuteAction Callback to execute AI actions.
 * @param config.onStanceChange Callback to handle stance changes.
 *
 * @returns AI combat state and control functions
 *
 * @example
 * ```typescript
 * const { aiState } = useAICombat({
 *   player: aiPlayer,
 *   opponent: humanPlayer,
 *   personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
 *   adaptiveDifficulty,
 *   arenaBounds,
 *   roundStarted,
 *   roundEnded,
 *   isPaused,
 *   onExecuteAction: handleAction,
 *   onStanceChange: handleStanceChange,
 * });
 * ```
 */

import {
  AdaptiveDifficulty,
  AIActionType,
  AIComboSystem,
  AIDecisionTree,
  AIPersonality,
  CombatContext,
  DifficultyParameters,
  getArchetypeBehavior,
  getNextComboTechnique,
  interpolateDifficultyParameters,
} from "@/systems/ai";
import { PlayerState } from "@/systems/player";
import { Position, TrigramStance, DamageType, CombatAttackType, PlayerArchetype } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KoreanTechniquesSystem } from "@/systems/trigram/KoreanTechniques";
import { KoreanTechnique } from "@/systems/vitalpoint/types";
import {
  KOREAN_VITAL_POINTS,
} from "@/systems/vitalpoint/KoreanVitalPoints";
import { getBalanceState } from "@/utils/player3DHelpers";
import { getArchetypePhysicalAttributes } from "@/data/archetypePhysicalAttributes";
import { physicalReachCalculator } from "@/systems/physics";
import { STANCE_REACH_MODIFIERS } from "@/types/physics";
import { METERS_TO_PIXELS_SCALE } from "@/types/physicsConstants";

// Performance monitoring constants
const AI_DECISION_THRESHOLD_MS = 10; // Threshold for slow decision warnings
const WARNING_THROTTLE_MS = 5000; // Throttle performance warnings to every 5 seconds

/**
 * Technique range constants (pixels)
 * Based on game design: 1 cell = ~40px, 2 cells = ~80px, 3 cells = ~120px
 * 
 * Each technique has a range property in cell units (e.g., 1.0 = 1 cell = 40px)
 * 
 * @korean 기술 범위 상수
 */

/**
 * Get viable techniques based on distance, stance, and stamina
 * 
 * Filters techniques that:
 * - Match current stance
 * - Are within effective range of opponent
 * - Have sufficient stamina to execute
 * - Applies selection bias against recently used techniques (avoid >70% repetition)
 * 
 * @korean 거리, 자세, 체력에 따른 실행 가능한 기술 선택
 * 
 * @param distance - Distance to opponent in pixels
 * @param stance - Current trigram stance
 * @param stamina - Available stamina
 * @param archetype - Player archetype for specialized techniques
 * @param recentTechniques - Array of recently used technique IDs (for variation)
 * @returns Array of viable techniques sorted by effectiveness with variation bias
 */
function getViableTechniques(
  distance: number,
  stance: TrigramStance,
  stamina: number,
  archetype: PlayerState["archetype"],
  recentTechniques: string[] = []
): readonly KoreanTechnique[] {
  // Get all available techniques for stance and archetype
  const stanceTechniques =
    KoreanTechniquesSystem.getAllAvailableTechniques(stance, archetype);

  // Early return if no techniques available
  if (stanceTechniques.length === 0) {
    return [];
  }

  // Filter techniques that are viable for current situation
  const viableTechniques = stanceTechniques.filter((tech) => {
    // Calculate technique effective range using Physical ReachCalculator
    // Get AI player's physical attributes
    const physicalAttributes = getArchetypePhysicalAttributes(archetype);
    
    // Calculate maximum reach for this technique
    // Use animationType if available, otherwise derive from reachConfig
    const animType = tech.animationType;
    let maxReach: number;
    
    if (animType) {
      // Use PhysicalReachCalculator with animation timing
      maxReach = physicalReachCalculator.calculateMaxReach(
        physicalAttributes,
        animType,
        stance
      );
    } else {
      // Fallback: Calculate reach directly from reachConfig
      // This ensures consistency with technique definitions when no animation type
      const limbLength = tech.reachConfig.bodyPart === 'leg' 
        ? physicalAttributes.legLength 
        : physicalAttributes.armLength;
      
      // Apply stance modifier using actual stance-specific modifiers
      const stanceModifier = STANCE_REACH_MODIFIERS[stance];
      maxReach = (limbLength / 100) * tech.reachConfig.baseExtension * stanceModifier;
    }
    
    // Convert meters to pixels using shared scaling constant
    const maxRange = maxReach * METERS_TO_PIXELS_SCALE;

    // Check if opponent is within technique range
    const inRange = distance <= maxRange;

    // Check if player has sufficient stamina
    const hasStamina = stamina >= tech.staminaCost;

    return inRange && hasStamina;
  });

  // Pre-compute recent use counts for efficiency (avoid O(n²×m) in sort)
  const recentUseCounts = new Map<string, number>();
  for (const tech of viableTechniques) {
    recentUseCounts.set(
      tech.id,
      recentTechniques.filter((id) => id === tech.id).length
    );
  }

  // Sort by effectiveness with variation bias
  return viableTechniques.sort((a, b) => {
    // Base effectiveness: damage × accuracy
    const baseEffectivenessA = (a.damage ?? 0) * (a.accuracy ?? 0.8);
    const baseEffectivenessB = (b.damage ?? 0) * (b.accuracy ?? 0.8);

    // Apply penalty for recently used techniques (avoid repetition)
    const recentUsesA = recentUseCounts.get(a.id) ?? 0;
    const recentUsesB = recentUseCounts.get(b.id) ?? 0;
    
    // Penalty: 20% reduction per recent use (max 60% penalty for 3+ uses)
    const penaltyA = Math.min(0.6, recentUsesA * 0.2);
    const penaltyB = Math.min(0.6, recentUsesB * 0.2);
    
    const finalEffectivenessA = baseEffectivenessA * (1 - penaltyA);
    const finalEffectivenessB = baseEffectivenessB * (1 - penaltyB);

    return finalEffectivenessB - finalEffectivenessA;
  });
}

/**
 * Select optimal vital point for attack based on stance compatibility and archetype priority
 * 
 * Prioritizes vital points by:
 * 1. Archetype vital target priority (health/pain/consciousness/balanced)
 * 2. Stance compatibility (must be in effectiveStances array)
 * 3. Base damage threshold (>25 damage preferred)
 * 4. Targeting difficulty vs AI skill level
 * 
 * @korean 자세 효과 및 원형 우선순위에 따른 최적 급소 선택
 * 
 * @param stance - Current trigram stance
 * @param difficultyLevel - AI difficulty level (0.0-1.0)
 * @param archetype - Player archetype for priority targeting
 * @returns Vital point ID or null if no suitable target
 */
function selectOptimalVitalPoint(
  stance: TrigramStance,
  difficultyLevel: number,
  archetype: PlayerState["archetype"]
): string | null {
  // Guard: Ensure vital points are available
  if (KOREAN_VITAL_POINTS.length === 0) {
    return null;
  }

  // Get archetype behavior for vital point priority
  const behavior = getArchetypeBehavior(archetype);

  // Filter vital points effective for current stance
  const effectivePoints = KOREAN_VITAL_POINTS.filter((point) =>
    point.effectiveStances?.includes(stance)
  );

  if (effectivePoints.length === 0) {
    // Fallback: select any vital point if no stance-specific ones available
    const fallbackPoint =
      KOREAN_VITAL_POINTS[
        Math.floor(Math.random() * KOREAN_VITAL_POINTS.length)
      ];
    return fallbackPoint?.id ?? null;
  }

  // Damage threshold for high-priority targets
  const HIGH_DAMAGE_THRESHOLD = 25;
  
  // Filter by damage threshold (prefer high-damage vital points)
  const highDamagePoints = effectivePoints.filter(
    (point) => (point.baseDamage ?? 0) > HIGH_DAMAGE_THRESHOLD
  );

  const targetPoints =
    highDamagePoints.length > 0
      ? highDamagePoints
      : effectivePoints;

  // Sort by targeting suitability based on AI difficulty AND archetype priority
  const sortedPoints = [...targetPoints].sort((a, b) => {
    // Calculate base suitability score
    const baseSuitabilityA =
      (a.baseDamage ?? 0) * (1 - Math.abs(difficultyLevel - a.targetingDifficulty));
    const baseSuitabilityB =
      (b.baseDamage ?? 0) * (1 - Math.abs(difficultyLevel - b.targetingDifficulty));
    
    // Apply archetype priority multiplier
    const priorityMultiplierA = getVitalPointPriorityScore(a, behavior.vitalTargetPriority);
    const priorityMultiplierB = getVitalPointPriorityScore(b, behavior.vitalTargetPriority);
    
    const finalSuitabilityA = baseSuitabilityA * priorityMultiplierA;
    const finalSuitabilityB = baseSuitabilityB * priorityMultiplierB;
    
    return finalSuitabilityB - finalSuitabilityA;
  });

  // Select top-rated target
  return sortedPoints[0]?.id ?? null;
}

/**
 * Calculate priority score for vital point based on archetype targeting preference
 * 
 * @korean 원형 타격 우선순위 점수 계산
 * 
 * @param vitalPoint - Vital point to score
 * @param priority - Archetype vital target priority
 * @returns Priority multiplier (1.0 = neutral, >1.0 = preferred, <1.0 = deprioritized)
 */
function getVitalPointPriorityScore(
  vitalPoint: typeof KOREAN_VITAL_POINTS[0],
  priority: import("@/systems/ai/AIPersonality").VitalTargetPriority
): number {
  // Import effect types to check vital point effects
  const effects = vitalPoint.effects || [];
  
  switch (priority) {
    case "health":
      // Jojik - prioritize high base damage
      return (vitalPoint.baseDamage ?? 0) > 30 ? 1.5 : 1.0;
      
    case "pain":
      // Jeongbo - prioritize pain-inducing effects
      // Check if effects include pain or disorientation
      const hasPainEffect = effects.some(e => 
        String(e).toLowerCase().includes("pain") || 
        String(e).toLowerCase().includes("disorientation")
      );
      return hasPainEffect ? 1.5 : 1.0;
      
    case "consciousness":
      // Amsalja - prioritize consciousness-affecting strikes
      // Check if effects include unconsciousness, stun, or breathlessness
      const hasConsciousnessEffect = effects.some(e => 
        String(e).toLowerCase().includes("unconscious") || 
        String(e).toLowerCase().includes("stun") ||
        String(e).toLowerCase().includes("breathless")
      );
      return hasConsciousnessEffect ? 1.5 : 1.0;
      
    case "balanced":
    default:
      // Musa, Hacker - balanced approach
      return 1.0;
  }
}

/**
 * Check if a technique is a signature move for the given archetype
 * 
 * Signature techniques are identified by:
 * - Damage type and attack type matching archetype preferences
 * - Ki/Stamina costs indicating advanced techniques
 * - Specific technique characteristics (e.g., nerve strikes for Amsalja)
 * 
 * @korean 원형 대표 기술 확인
 * 
 * @param technique - Technique to check
 * @param archetype - Player archetype
 * @returns True if technique is signature for the archetype
 */
function isSignatureTechnique(
  technique: KoreanTechnique,
  archetype: PlayerState["archetype"]
): boolean {
  const damageType = technique.damageType;
  const attackType = technique.type;
  const isAdvanced = (technique.kiCost || 0) >= 10 || (technique.staminaCost || 0) >= 15;
  
  switch (archetype) {
    case PlayerArchetype.MUSA:
      // Musa: Joint manipulation (JOINT damage) and bone strikes (CRUSHING/BLUNT)
      return (
        damageType === DamageType.JOINT ||
        damageType === DamageType.CRUSHING ||
        (damageType === DamageType.BLUNT && isAdvanced)
      );
      
    case PlayerArchetype.AMSALJA:
      // Amsalja: Nerve strikes (NERVE damage) and silent takedowns (pressure points)
      return (
        damageType === DamageType.NERVE ||
        damageType === DamageType.PRESSURE ||
        attackType === CombatAttackType.NERVE_STRIKE ||
        attackType === CombatAttackType.PRESSURE_POINT
      );
      
    case PlayerArchetype.HACKER:
      // Hacker: Anatomical analysis (INTERNAL/NERVE) and calculated strikes
      return (
        damageType === DamageType.INTERNAL ||
        damageType === DamageType.NERVE ||
        (isAdvanced && (technique.accuracy || 0) >= 0.8) // High accuracy represents calculation
      );
      
    case PlayerArchetype.JEONGBO_YOWON:
      // Jeongbo: Psychological pressure (PRESSURE) and submission techniques (JOINT)
      return (
        damageType === DamageType.PRESSURE ||
        damageType === DamageType.JOINT ||
        attackType === CombatAttackType.GRAPPLE
      );
      
    case PlayerArchetype.JOJIK_POKRYEOKBAE:
      // Jojik: Dirty techniques (any high-damage strike) and environmental usage
      return (
        (technique.damage || 0) >= 30 || // High raw damage
        damageType === DamageType.SLASHING || // Brutal cutting
        damageType === DamageType.PIERCING // Dirty stabbing techniques
      );
      
    default:
      return false;
  }
}

/**
 * Update technique usage frequency and rotation queue
 * 
 * Tracks technique usage for diversity enforcement:
 * 1. Updates usage frequency counter
 * 2. Adds to recent techniques queue (last 5)
 * 3. Marks as used in current match
 * 4. Resets "all used" when all 4 archetype techniques completed
 * 
 * @korean 기술 사용 빈도 및 순환 큐 업데이트
 * 
 * @param techniqueId - ID of technique just used
 * @param rotationQueue - Technique rotation tracking object
 * @param archetypeTechniqueIds - All technique IDs for this archetype (for reset detection)
 */
function updateTechniqueRotation(
  techniqueId: string,
  rotationQueue: TechniqueRotationQueue,
  archetypeTechniqueIds: Set<string>
): void {
  // Update frequency counter
  const current = rotationQueue.frequency.get(techniqueId) ?? 0;
  rotationQueue.frequency.set(techniqueId, current + 1);
  
  // Increment total attacks
  rotationQueue.totalAttacks++;
  
  // Add to recent queue (last 5)
  rotationQueue.used.push(techniqueId);
  if (rotationQueue.used.length > 5) {
    rotationQueue.used.shift(); // Keep only last 5
  }
  
  // Mark as used in this match
  rotationQueue.allUsed.add(techniqueId);
  
  // Reset "all used" if all archetype techniques have been used
  // This ensures AI cycles through full arsenal repeatedly
  let allTechniquesUsed = true;
  for (const techId of archetypeTechniqueIds) {
    if (!rotationQueue.allUsed.has(techId)) {
      allTechniquesUsed = false;
      break;
    }
  }
  
  if (allTechniquesUsed) {
    rotationQueue.allUsed.clear();
  }
}

/**
 * Check if technique is overused (exceeds 40% threshold)
 * 
 * Enforces variety by identifying techniques that have been
 * used more than 40% of total attacks.
 * 
 * @korean 기술 과다 사용 확인 (40% 임계값)
 * 
 * @param techniqueId - Technique ID to check
 * @param rotationQueue - Technique rotation tracking object
 * @returns True if technique exceeds 40% usage threshold
 */
function isOverused(
  techniqueId: string,
  rotationQueue: TechniqueRotationQueue
): boolean {
  if (rotationQueue.totalAttacks === 0) {
    return false;
  }
  
  const uses = rotationQueue.frequency.get(techniqueId) ?? 0;
  const percentage = uses / rotationQueue.totalAttacks;
  return percentage > 0.40; // >40% threshold
}

/**
 * Select technique with rotation bias for diversity
 * 
 * Prioritizes techniques in this order:
 * 1. Never used in this match (highest priority)
 * 2. Not used in last 5 techniques (avoid repetition)
 * 3. Any viable technique (fallback)
 * 
 * Within each priority tier, selects by effectiveness (damage × accuracy).
 * 
 * @korean 다양성을 위한 순환 편향 기술 선택
 * 
 * @param viableTechniques - Techniques that are viable (range, stamina, stance)
 * @param rotationQueue - Technique rotation tracking object
 * @returns Best technique with rotation bias applied
 */
function selectTechniqueWithRotation(
  viableTechniques: readonly KoreanTechnique[],
  rotationQueue: TechniqueRotationQueue
): KoreanTechnique | undefined {
  if (viableTechniques.length === 0) {
    return undefined;
  }
  
  // Filter out overused techniques (>40% threshold)
  const balancedTechniques = viableTechniques.filter(
    t => !isOverused(t.id, rotationQueue)
  );
  
  // If all techniques overused (rare), reset frequency tracking and use any
  const candidates = balancedTechniques.length > 0 
    ? balancedTechniques 
    : viableTechniques;
  
  if (balancedTechniques.length === 0 && rotationQueue.totalAttacks > 0) {
    // Reset frequency to allow reuse and realign total count
    rotationQueue.frequency.clear();
    rotationQueue.totalAttacks = 0;
  }
  
  // Priority 1: Never used in this match
  const neverUsed = candidates.filter(
    t => !rotationQueue.allUsed.has(t.id)
  );
  
  if (neverUsed.length > 0) {
    // Sort by effectiveness within never-used tier
    return [...neverUsed].sort((a, b) => {
      const effA = (a.damage ?? 0) * (a.accuracy ?? 0.8);
      const effB = (b.damage ?? 0) * (b.accuracy ?? 0.8);
      return effB - effA;
    })[0];
  }
  
  // Priority 2: Not in last 5 techniques
  const unusedRecently = candidates.filter(
    t => !rotationQueue.used.includes(t.id)
  );
  
  if (unusedRecently.length > 0) {
    // Sort by effectiveness within unused-recently tier
    return [...unusedRecently].sort((a, b) => {
      const effA = (a.damage ?? 0) * (a.accuracy ?? 0.8);
      const effB = (b.damage ?? 0) * (b.accuracy ?? 0.8);
      return effB - effA;
    })[0];
  }
  
  // Priority 3: Any viable technique (all used recently)
  // Sort by effectiveness
  return [...candidates].sort((a, b) => {
    const effA = (a.damage ?? 0) * (a.accuracy ?? 0.8);
    const effB = (b.damage ?? 0) * (b.accuracy ?? 0.8);
    return effB - effA;
  })[0];
}

/**
 * Filter techniques by cooldown availability
 * 
 * Returns only techniques that are off cooldown and ready to use.
 * If all techniques are on cooldown, returns empty array.
 * 
 * @korean 재사용 대기시간별 기술 필터링
 * 
 * @param techniques - Techniques to filter
 * @param cooldownMap - Map of technique ID to last use timestamp
 * @returns Techniques that are off cooldown
 */
function filterByCooldown(
  techniques: readonly KoreanTechnique[],
  cooldownMap: TechniqueCooldownMap
): readonly KoreanTechnique[] {
  const now = Date.now();
  
  return techniques.filter(t => {
    const lastUsed = cooldownMap.get(t.id) ?? 0;
    const cooldown = (t.recoveryTime ?? 0) + (t.executionTime ?? 0); // Total cooldown time
    const timeSinceUse = now - lastUsed;
    return timeSinceUse >= cooldown;
  });
}

/**
 * Get all techniques for an archetype (for cross-stance usage)
 * 
 * Returns all 4 techniques available to the archetype,
 * regardless of stance requirements.
 * 
 * @korean 원형의 모든 기술 가져오기 (교차 자세 사용)
 * 
 * @param archetype - Player archetype
 * @returns All techniques for the archetype
 */
function getAllArchetypeTechniques(
  archetype: PlayerState["archetype"]
): readonly KoreanTechnique[] {
  // Use KoreanTechniquesSystem to efficiently get all techniques for archetype
  // This avoids iterating through all 8 stances
  return KoreanTechniquesSystem.getTechniquesByArchetype(archetype);
}

/**
 * Apply cross-stance damage modifier to technique
 * 
 * Creates a modified copy of the technique with 80% damage for cross-stance usage.
 * This prevents mutation of the original technique object.
 * 
 * **Design Rationale for 80% Effectiveness:**
 * Cross-stance techniques are performed from a non-optimal stance, reducing
 * power generation and body mechanics efficiency. The 80% modifier reflects:
 * - Suboptimal weight transfer and leverage
 * - Reduced muscle engagement from non-ideal positioning
 * - Decreased stability and balance during execution
 * 
 * This is consistent with Korean martial arts philosophy where proper stance
 * (자세) is fundamental to technique effectiveness. Other properties like
 * accuracy and execution time remain unchanged as the technique mechanics
 * themselves are unchanged, only the power generation is affected.
 * 
 * @korean 교차 자세 피해 배율 적용 (80% 효과)
 * 
 * @param technique - Original technique
 * @param isCrossStance - Whether technique is from different stance
 * @returns Modified technique with 80% damage if cross-stance, original otherwise
 */
function applyCrossStanceDamageModifier(
  technique: KoreanTechnique,
  isCrossStance: boolean
): KoreanTechnique {
  if (!isCrossStance || !technique.damage) {
    return technique;
  }
  
  // Create modified copy with 80% damage
  return {
    ...technique,
    damage: Math.floor(technique.damage * 0.8),
  };
}

/**
 * Helper to select technique for AI action with rotation and cooldown awareness
 * 
 * Enhanced technique selection with:
 * - Technique rotation queue for diversity (prevents >70% repetition → targets <40%)
 * - Cooldown-aware filtering (prioritizes ready techniques)
 * - Cross-stance fallback (uses other techniques at 80% effectiveness)
 * - Archetype signature bias (maintains 40%+ signature technique usage)
 * 
 * @korean 순환 및 재사용 대기시간을 고려한 기술 선택
 * 
 * @param isSpecialTechnique - Whether to filter for high-cost special techniques
 * @param context - Current combat context
 * @param player - AI player state
 * @param adaptiveDifficulty - Adaptive difficulty system
 * @param rotationQueue - Technique rotation tracking object
 * @param cooldownMap - Technique cooldown tracking map
 * @returns Selected technique, vital point, action type, and cross-stance flag
 */
function selectTechniqueForAction(
  isSpecialTechnique: boolean,
  context: CombatContext,
  player: PlayerState,
  adaptiveDifficulty: AdaptiveDifficulty,
  rotationQueue: TechniqueRotationQueue,
  cooldownMap: TechniqueCooldownMap
): { 
  technique?: KoreanTechnique; 
  vitalPoint?: string; 
  actionType: string;
  isCrossStance?: boolean;
} {
  // Get viable techniques for current stance
  const viableTechniques = getViableTechniques(
    context.distanceToOpponent,
    player.currentStance,
    player.stamina,
    player.archetype,
    rotationQueue.used // Pass recent techniques for penalty
  );

  // Filter by cooldown availability
  const readyTechniques = filterByCooldown(viableTechniques, cooldownMap);
  
  // Use ready techniques if available, otherwise check cooldowns
  let candidates = readyTechniques.length > 0 ? readyTechniques : viableTechniques;
  
  // Filter for special techniques if requested
  if (isSpecialTechnique) {
    const specialCandidates = candidates.filter(
      (tech) => tech.kiCost >= 10 || tech.staminaCost >= 15
    );
    candidates = specialCandidates.length > 0 ? specialCandidates : candidates;
  }

  // If no viable techniques for current stance, try cross-stance techniques
  let isCrossStance = false;
  if (candidates.length === 0) {
    const allTechniques = getAllArchetypeTechniques(player.archetype);
    const crossStanceTechniques = allTechniques.filter(
      t => t.stance !== player.currentStance &&
           context.distanceToOpponent <= ((t.reachConfig?.baseExtension ?? 1.0) * METERS_TO_PIXELS_SCALE) &&
           player.stamina >= t.staminaCost &&
           !isOverused(t.id, rotationQueue) // Apply rotation diversity to cross-stance
    );
    
    // Filter by cooldown for cross-stance techniques too
    const readyCrossStance = filterByCooldown(crossStanceTechniques, cooldownMap);
    candidates = readyCrossStance.length > 0 ? readyCrossStance : crossStanceTechniques;
    isCrossStance = candidates.length > 0;
  }

  if (candidates.length > 0) {
    // Filter signature techniques once for efficiency
    const signatureTechniques = candidates.filter((tech) =>
      isSignatureTechnique(tech, player.archetype)
    );
    
    // Apply 60% bias toward signature techniques
    // Determine category first, then select best technique within category
    const useSignature = signatureTechniques.length > 0 && Math.random() < 0.6;
    
    const selectedCandidates = useSignature ? signatureTechniques : candidates;
    const technique = selectTechniqueWithRotation(selectedCandidates, rotationQueue);
    
    if (technique) {
      const difficultyLevel = adaptiveDifficulty.calculatePlayerSkill();
      const vitalPoint = selectOptimalVitalPoint(
        player.currentStance, 
        difficultyLevel, 
        player.archetype
      ) ?? undefined;
      
      // Apply cross-stance damage modifier if needed
      const finalTechnique = applyCrossStanceDamageModifier(technique, isCrossStance);
      
      return { 
        technique: finalTechnique, 
        vitalPoint, 
        actionType: isSpecialTechnique ? "technique" : "attack",
        isCrossStance
      };
    }
  }

  return { actionType: "idle" };
}

/**
 * Determine if AI should switch stance laterality based on personality and tactical situation.
 * 
 * Strategic laterality decisions in Korean martial arts:
 * - **Aggressive personality**: Prefers matched stances (same laterality) for offensive advantage
 *   Matched stances expose centerlines, creating attack opportunities
 * - **Defensive personality**: Prefers mismatched stances (opposite laterality) for protection
 *   Mismatched stances naturally guard centerlines with lead hand
 * - **Health-based modifier**: Low health increases defensive preference
 * 
 * @param aiLaterality - AI's current stance laterality
 * @param opponentLaterality - Opponent's stance laterality  
 * @param personality - AI personality archetype
 * @param aiHealth - AI's current health (0-100)
 * @param lastSwitchTime - Timestamp of last laterality switch
 * @param currentTime - Current timestamp for cooldown check
 * @returns true if AI should switch laterality, false otherwise
 * 
 * @korean AI 측면성 전환 결정
 */
function shouldAISwitchLaterality(
  aiLaterality: "left" | "right",
  opponentLaterality: "left" | "right",
  personality: AIPersonality,
  aiHealth: number,
  lastSwitchTime: number,
  currentTime: number
): boolean {
  // Cooldown: Don't switch more than once per 3 seconds
  const LATERALITY_COOLDOWN = 3000;
  if (currentTime - lastSwitchTime < LATERALITY_COOLDOWN) {
    return false;
  }

  const isMatched = aiLaterality === opponentLaterality;
  
  // Aggressive AI: Prefer matched stances (offensive advantage)
  // Defensive AI: Prefer mismatched stances (defensive protection)
  const aggressionFactor = personality.aggressionLevel;
  const defenseFactor = personality.defensePreference;
  
  // Health-based modifier: Lower health increases defensive behavior
  const healthFactor = aiHealth / 100;
  const effectiveAggression = aggressionFactor * Math.max(0.3, healthFactor);
  const effectiveDefense = defenseFactor * (1.2 - healthFactor * 0.2);
  
  // Aggressive AI wants matched stances
  if (effectiveAggression > 0.6 && !isMatched) {
    return Math.random() < 0.3; // 30% chance to switch to matched
  }
  
  // Defensive AI wants mismatched stances
  if (effectiveDefense > 0.6 && isMatched) {
    return Math.random() < 0.25; // 25% chance to switch to mismatched
  }
  
  // Low health emergency: Switch to defensive mismatch
  if (aiHealth < 30 && isMatched) {
    return Math.random() < 0.4; // 40% chance when critically low health
  }
  
  return false;
}

/**
 * AI state management
 */
interface AIState {
  nextAction: number;
  targetPosition: Position;
  lastActionType: string;
  consecutiveAttacks: number;
  actionCooldown: number;
  aggressionLevel: number;
  selectedTechnique?: KoreanTechnique;
  targetVitalPoint?: string;
  recentTechniques: string[]; // Track last 5 techniques for variation
}

/**
 * Technique rotation queue for enforcing variety
 * 
 * Tracks technique usage to prevent repetitive patterns:
 * - Last 5 techniques used (for immediate variation)
 * - All techniques used in current match (for full arsenal tracking)
 * - Usage frequency per technique (for 40% threshold enforcement)
 * - Total attacks counter (for percentage calculation)
 * 
 * @korean 기술 순환 큐 (다양성 강화)
 */
interface TechniqueRotationQueue {
  used: string[]; // Last 5 technique IDs (FIFO)
  allUsed: Set<string>; // All techniques used this match
  frequency: Map<string, number>; // Usage count per technique ID
  totalAttacks: number; // Total attack count for percentage calculation
}

/**
 * Technique cooldown tracking
 * 
 * Maps technique ID to timestamp of last use
 * Used for cooldown-aware technique selection
 * 
 * @korean 기술 재사용 대기시간 추적
 */
type TechniqueCooldownMap = Map<string, number>;

/**
 * AI combat hook configuration
 */
interface UseAICombatConfig {
  readonly player: PlayerState;
  readonly opponent: PlayerState;
  readonly personality: AIPersonality;
  readonly adaptiveDifficulty: AdaptiveDifficulty;
  readonly isPaused: boolean;
  readonly roundStarted: boolean;
  readonly roundEnded: boolean;
  readonly arenaBounds: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly onExecuteAction: (action: string, targetPosition?: Position) => void;
  readonly onStanceChange?: (stance: TrigramStance) => void;
  readonly onLateralityChange?: () => void;
  readonly playerLaterality?: "left" | "right";
  readonly opponentLaterality?: "left" | "right";
}

/**
 * AI combat hook return type
 */
interface UseAICombatReturn {
  readonly aiState: AIState;
  readonly comboSystem: AIComboSystem;
  readonly decisionTree: AIDecisionTree;
  readonly adjustedPersonality: AIPersonality;
  readonly executeAIAction: (action: string, targetPosition?: Position) => void;
  readonly currentDifficultyParams: DifficultyParameters;
  readonly updateDifficultyTarget: (newParams: DifficultyParameters) => void;
}

/**
 * Custom hook for AI combat behavior
 */
export function useAICombat(config: UseAICombatConfig): UseAICombatReturn {
  const {
    player,
    opponent,
    personality,
    adaptiveDifficulty,
    isPaused,
    roundStarted,
    roundEnded,
    arenaBounds,
    onExecuteAction,
    onStanceChange,
    onLateralityChange,
    playerLaterality,
    opponentLaterality,
  } = config;

  // Initialize AI systems (persist across renders)
  const comboSystem = useMemo(() => new AIComboSystem(), []);
  const decisionTree = useMemo(() => new AIDecisionTree(), []);

  // Adjust personality based on player skill
  const adjustedPersonality = useMemo(
    () => adaptiveDifficulty.adjustAIPersonality(personality),
    [adaptiveDifficulty, personality]
  );

  // Update AI difficulty level based on adaptive difficulty (only when skill level meaningfully changes)
  const lastSkillLevelRef = useRef(0.5);
  useEffect(() => {
    const newSkillLevel = adaptiveDifficulty.calculatePlayerSkill();
    // Only update if skill level changed by more than 1%
    if (Math.abs(newSkillLevel - lastSkillLevelRef.current) > 0.01) {
      lastSkillLevelRef.current = newSkillLevel;
      decisionTree.setDifficultyLevel(newSkillLevel);
    }
  }, [adaptiveDifficulty, decisionTree]);

  // Difficulty parameters with smooth interpolation
  // Using useState with lazy initializer instead of useMemo since it only runs once
  const [currentParams, setCurrentParams] = useState<DifficultyParameters>(() =>
    adaptiveDifficulty.getDifficultyParameters()
  );
  const [targetParams, setTargetParams] = useState<DifficultyParameters>(() =>
    adaptiveDifficulty.getDifficultyParameters()
  );
  const startParamsRef = useRef<DifficultyParameters>(currentParams);
  const transitionStartTimeRef = useRef<number>(0);
  const transitionDurationMs = 10000; // 10 seconds for smooth transition

  // AI state - use useState lazy initializer for Date.now()
  const [aiState, setAiState] = useState<AIState>(() => {
    const now = Date.now();
    return {
      nextAction: now,
      targetPosition: player.position,
      lastActionType: "idle",
      consecutiveAttacks: 0,
      actionCooldown: 500,
      aggressionLevel: adjustedPersonality.aggressionLevel,
      selectedTechnique: undefined,
      targetVitalPoint: undefined,
      recentTechniques: [],
    };
  });

  // Performance tracking - use useState lazy initializer for refs that need Date.now()
  const lastDecisionTimeRef = useRef(0);
  const [initialMatchTime] = useState(() => Date.now());
  const matchStartTimeRef = useRef(initialMatchTime);
  const previousDamageRef = useRef(0);
  const [initialActionTime] = useState(() => Date.now());
  const nextActionRef = useRef(initialActionTime);
  const lastWarningTimeRef = useRef(0);
  const lastLateralitySwitchRef = useRef(0); // Track last laterality switch for cooldown

  // Technique rotation queue and cooldown tracking (Issue #expand-technique-selection-diversity)
  // Enforce technique variety: all 4 techniques used, no technique >40% usage
  const techniqueRotationQueueRef = useRef<TechniqueRotationQueue>({
    used: [],
    allUsed: new Set(),
    frequency: new Map(),
    totalAttacks: 0,
  });
  
  const techniqueCooldownMapRef = useRef<TechniqueCooldownMap>(new Map());
  
  // Get all technique IDs for current archetype (for reset detection)
  const archetypeTechniqueIds = useMemo(() => {
    const allTechs = getAllArchetypeTechniques(player.archetype);
    return new Set(allTechs.map(t => t.id));
  }, [player.archetype]);

  // Stance fatigue tracking (Issue #dynamic-ai-stance-rotation Phase 4)
  // Tracks how long AI has been in current stance to encourage dynamic switching
  // Use useState lazy initializer for Date.now() to avoid impure function call during render
  const [initialStanceFatigue] = useState(() => ({
    currentStance: player.currentStance,
    lastSwitchTime: Date.now(),
  }));
  const stanceFatigueRef = useRef(initialStanceFatigue);

  // Initialize previousDamageRef when round starts (issue #2529728007)
  useEffect(() => {
    if (roundStarted) {
      matchStartTimeRef.current = Date.now();
      previousDamageRef.current = player.totalDamageReceived;
      decisionTree.reset();
      comboSystem.resetCombo();
      
      // Reset stance fatigue tracking on round start
      stanceFatigueRef.current = {
        currentStance: player.currentStance,
        lastSwitchTime: Date.now(),
      };
      
      // Reset technique rotation queue on round start (Issue #expand-technique-selection-diversity)
      techniqueRotationQueueRef.current = {
        used: [],
        allUsed: new Set(),
        frequency: new Map(),
        totalAttacks: 0,
      };
      
      // Reset technique cooldown tracking on round start
      techniqueCooldownMapRef.current.clear();
    }
  }, [roundStarted, decisionTree, comboSystem]);

  // Monitor stance changes and update fatigue tracking (Issue #dynamic-ai-stance-rotation Phase 4)
  // Detects when AI changes stance and resets fatigue timer
  useEffect(() => {
    if (!roundStarted || roundEnded || isPaused) {
      return;
    }

    // Detect stance change and reset fatigue timer
    if (player.currentStance !== stanceFatigueRef.current.currentStance) {
      stanceFatigueRef.current = {
        currentStance: player.currentStance,
        lastSwitchTime: Date.now(),
      };
    }
  }, [player.currentStance, roundStarted, roundEnded, isPaused]);

  // Smooth interpolation of difficulty parameters using requestAnimationFrame
  useEffect(() => {
    if (isPaused || !roundStarted || roundEnded) {
      return;
    }

    let animationFrameId: number;
    let isComplete = false;

    const animate = () => {
      if (isComplete) return;

      const now = Date.now();
      const elapsed = now - transitionStartTimeRef.current;
      const progress = Math.min(1.0, elapsed / transitionDurationMs);

      if (progress < 1.0) {
        // Still interpolating from captured start params to target
        const interpolated = interpolateDifficultyParameters(
          startParamsRef.current,
          targetParams,
          progress
        );
        setCurrentParams(interpolated);
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Transition complete - snap to target and stop
        setCurrentParams(targetParams);
        isComplete = true;
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPaused, roundStarted, roundEnded, targetParams, transitionDurationMs]);

  // Pass current difficulty parameters to DecisionTree
  useEffect(() => {
    decisionTree.setDifficultyParameters(currentParams);
  }, [decisionTree, currentParams]);

  /**
   * Execute AI action callback
   * 
   * Triggers the onExecuteAction callback which will then retrieve
   * the selected technique and vital point from aiState
   * 
   * @korean AI 행동 실행 콜백
   */
  const executeAIAction = useCallback(
    (action: string, targetPosition?: Position) => {
      onExecuteAction(action, targetPosition);
    },
    [onExecuteAction]
  );

  /**
   * Update difficulty target parameters
   * Triggers smooth interpolation to new difficulty level
   * 
   * @korean 난이도 목표 매개변수 업데이트
   */
  const updateDifficultyTarget = useCallback((newParams: DifficultyParameters) => {
    // Capture current params as start point for smooth transition
    startParamsRef.current = currentParams;
    transitionStartTimeRef.current = Date.now();
    setTargetParams(newParams);
  }, [currentParams]);

  /**
   * Build combat context for decision-making
   */
  const buildCombatContext = useCallback((): CombatContext => {
    const dx = player.position.x - opponent.position.x;
    const dy = player.position.y - opponent.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate recent damage taken (fix for issue #2529467021)
    const recentDamageTaken = Math.max(
      0,
      player.totalDamageReceived - previousDamageRef.current
    );
    previousDamageRef.current = player.totalDamageReceived;

    // Convert opponent balance number to balance state for kill mode detection
    // Uses getBalanceState() from player3DHelpers.ts to ensure consistency
    // Thresholds: >=80 READY, >=50 SHAKEN, >=20 VULNERABLE, <20 HELPLESS
    const opponentBalance = getBalanceState(opponent.balance);

    return {
      playerPosition: player.position,
      opponentPosition: opponent.position,
      playerHealth: player.health,
      playerMaxHealth: player.maxHealth,
      playerKi: player.ki,
      playerMaxKi: player.maxKi,
      playerStamina: player.stamina,
      playerMaxStamina: player.maxStamina,
      opponentHealth: opponent.health,
      opponentStance: opponent.currentStance,
      playerStance: player.currentStance,
      distanceToOpponent: distance,
      timeInMatch: Date.now() - matchStartTimeRef.current,
      isOpponentAttacking: opponent.combatState === "attacking",
      recentDamageTaken,
      opponentBalance, // Added for kill mode detection
      stanceFatigue: {
        // Compute time in stance on-demand instead of polling with setInterval
        timeInStance: Date.now() - stanceFatigueRef.current.lastSwitchTime,
      },
      arenaBounds,
    };
  }, [player, opponent, arenaBounds]);

  /**
   * AI decision loop (fixed memory leak - issue #2529466989)
   */
  useEffect(() => {
    if (isPaused || !roundStarted || roundEnded) {
      return;
    }

    const aiInterval = setInterval(() => {
      const now = Date.now();

      // Respect next action time using ref (prevents stale closure)
      if (now < nextActionRef.current) {
        return;
      }

      // Performance: track decision time
      const decisionStart = performance.now();

      // Build combat context
      const context = buildCombatContext();

      // Make strategic decision
      const decision = decisionTree.makeDecision(
        context,
        adjustedPersonality,
        comboSystem
      );

      // Performance: warn if decision took too long with time-based throttle (issue #2529466997, #2529728019)
      const decisionTime = performance.now() - decisionStart;
      if (decisionTime > AI_DECISION_THRESHOLD_MS) {
        const now = Date.now();
        if (now - lastWarningTimeRef.current > WARNING_THROTTLE_MS) {
          // Only warn every 5 seconds
          console.warn(
            `AI decisions running slow: ${decisionTime.toFixed(2)}ms`
          );
          lastWarningTimeRef.current = now;
        }
      }
      lastDecisionTimeRef.current = decisionTime;

      // Execute decision with technique and vital point selection
      let actionType = "idle";
      let newTargetPosition = aiState.targetPosition;
      let newConsecutiveAttacks = aiState.consecutiveAttacks;
      let selectedTechnique: KoreanTechnique | undefined;
      let targetVitalPoint: string | undefined;

      switch (decision.action) {
        case AIActionType.ATTACK:
          {
            const result = selectTechniqueForAction(
              false,
              context,
              player,
              adaptiveDifficulty,
              techniqueRotationQueueRef.current,
              techniqueCooldownMapRef.current
            );
            selectedTechnique = result.technique;
            targetVitalPoint = result.vitalPoint;
            actionType = result.actionType;
            
            // Update rotation queue and cooldown tracking if technique selected
            // Note: Cross-stance damage modifier already applied in selectTechniqueForAction()
            if (selectedTechnique) {
              updateTechniqueRotation(
                selectedTechnique.id,
                techniqueRotationQueueRef.current,
                archetypeTechniqueIds
              );
              
              // Record cooldown start time
              techniqueCooldownMapRef.current.set(selectedTechnique.id, Date.now());
              
              // Check for signature combo continuation (Issue #expand-technique-selection-diversity)
              const nextComboTechnique = getNextComboTechnique(
                selectedTechnique.id,
                player.archetype
              );
              
              // If this technique starts a combo, store next technique for consideration
              if (nextComboTechnique) {
                // Store combo hint for next decision (combo system can use this)
                // The decision tree will naturally consider this in the next cycle
                comboSystem.startCombo(player, opponent, adjustedPersonality);
              }
            }
            
            if (actionType === "attack") {
              newConsecutiveAttacks++;
            }
          }
          break;

        case AIActionType.TECHNIQUE:
          {
            const result = selectTechniqueForAction(
              true,
              context,
              player,
              adaptiveDifficulty,
              techniqueRotationQueueRef.current,
              techniqueCooldownMapRef.current
            );
            selectedTechnique = result.technique;
            targetVitalPoint = result.vitalPoint;
            actionType = result.actionType;
            
            // Update rotation queue and cooldown tracking if technique selected
            // Note: Cross-stance damage modifier already applied in selectTechniqueForAction()
            if (selectedTechnique) {
              updateTechniqueRotation(
                selectedTechnique.id,
                techniqueRotationQueueRef.current,
                archetypeTechniqueIds
              );
              
              // Record cooldown start time
              techniqueCooldownMapRef.current.set(selectedTechnique.id, Date.now());
              
              // Check for signature combo continuation (Issue #expand-technique-selection-diversity)
              const nextComboTechnique = getNextComboTechnique(
                selectedTechnique.id,
                player.archetype
              );
              
              // If this technique starts a combo, store next technique for consideration
              if (nextComboTechnique) {
                // Store combo hint for next decision (combo system can use this)
                comboSystem.startCombo(player, opponent, adjustedPersonality);
              }
            }
            
            if (actionType === "attack" || actionType === "technique") {
              newConsecutiveAttacks++;
            }
          }
          break;

        case AIActionType.COMBO:
          // Start or continue combo
          if (!comboSystem.isComboActive()) {
            comboSystem.startCombo(player, opponent, adjustedPersonality);
          }

          if (
            comboSystem.shouldContinueCombo(
              player,
              opponent,
              adjustedPersonality
            )
          ) {
            const technique = comboSystem.getNextComboTechnique();
            actionType = technique ? "technique" : "attack";
            newConsecutiveAttacks++;
          } else {
            comboSystem.resetCombo();
            actionType = "idle";
          }
          break;

        case AIActionType.DEFEND:
          actionType = "defend";
          newConsecutiveAttacks = 0;
          break;

        case AIActionType.COUNTER:
          actionType = "counter";
          newConsecutiveAttacks = 0;
          break;

        case AIActionType.RETREAT:
          actionType = "retreat";
          newTargetPosition = decision.targetPosition ?? aiState.targetPosition;
          newConsecutiveAttacks = 0;
          break;

        case AIActionType.APPROACH:
          actionType = "approach";
          newTargetPosition = decision.targetPosition ?? opponent.position;
          newConsecutiveAttacks = 0;
          break;

        case AIActionType.CIRCLE:
          actionType = "circle";
          newTargetPosition = decision.targetPosition ?? aiState.targetPosition;
          newConsecutiveAttacks = 0;
          break;

        case AIActionType.STANCE_CHANGE:
          if (decision.targetStance && onStanceChange) {
            onStanceChange(decision.targetStance);
          }
          actionType = "idle";
          newConsecutiveAttacks = 0;
          break;

        case AIActionType.FEINT:
          actionType = "feint";
          newConsecutiveAttacks = 0;
          break;

        case AIActionType.WAIT:
        default:
          actionType = "idle";
          newConsecutiveAttacks = 0;
          break;
      }

      // Check for strategic laterality switch (Phase 8)
      // AI decides whether to switch stance side based on personality and tactical situation
      if (onLateralityChange && playerLaterality && opponentLaterality) {
        const shouldSwitch = shouldAISwitchLaterality(
          opponentLaterality, // Laterality for player index 1 (AI-controlled in this hook)
          playerLaterality,   // Laterality for player index 0 (human-controlled in this hook)
          adjustedPersonality,
          player.health,
          lastLateralitySwitchRef.current,
          now
        );
        
        if (shouldSwitch) {
          onLateralityChange();
          lastLateralitySwitchRef.current = now;
        }
      }

      // Execute action (technique and vital point are stored in aiState)
      executeAIAction(actionType, newTargetPosition);

      // Calculate next action cooldown
      const actionCooldown =
        actionType === "attack" || actionType === "technique" ? 600 : 400;

      // Update next action time using ref (prevents stale closure)
      nextActionRef.current = now + actionCooldown + Math.random() * 200;

      // Track recent techniques for variation (keep last 5)
      let updatedRecentTechniques = [...aiState.recentTechniques];
      if (selectedTechnique) {
        updatedRecentTechniques.push(selectedTechnique.id);
        // Keep only last 5 techniques
        if (updatedRecentTechniques.length > 5) {
          updatedRecentTechniques = updatedRecentTechniques.slice(-5);
        }
      }

      // Update AI state with selected technique and vital point
      setAiState({
        nextAction: nextActionRef.current,
        targetPosition: newTargetPosition,
        lastActionType: actionType,
        consecutiveAttacks: newConsecutiveAttacks,
        actionCooldown,
        aggressionLevel: adjustedPersonality.aggressionLevel,
        selectedTechnique,
        targetVitalPoint,
        recentTechniques: updatedRecentTechniques,
      });
    }, 50); // 50ms loop for responsive AI

    return () => clearInterval(aiInterval);
  }, [
    isPaused,
    roundStarted,
    roundEnded,
    buildCombatContext,
    decisionTree,
    adjustedPersonality,
    comboSystem,
    executeAIAction,
    onStanceChange,
    onLateralityChange,
    player,
    opponent,
    aiState,
    playerLaterality,
    opponentLaterality,
    adaptiveDifficulty,
  ]);

  return {
    aiState,
    comboSystem,
    decisionTree,
    adjustedPersonality,
    executeAIAction,
    currentDifficultyParams: currentParams,
    updateDifficultyTarget,
  };
}
