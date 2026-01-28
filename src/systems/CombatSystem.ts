import * as THREE from "three";
import { getArchetypePhysicalAttributes } from "../data/archetypePhysicalAttributes";
import { getTechniqueById } from "../data/techniques";
import { BodyRegion, CombatAttackType, CombatState, DamageType } from "../types";
import { VitalPointCategory, VitalPointSeverity } from "../types/common";
import { BASE_STAMINA_REGEN_RATE } from "../types/physicsConstants";
import { Technique } from "../types/technique";
import { calculateDistance3D } from "../utils/math";
import { calculateBodyRadius } from "../utils/skeletonScaling";
import type { DefensiveAnimationType } from "./animation";
import {
  AnimationType,
  calculateSpeedModifierForDamage,
  determineAnimationTypeForTechnique,
  getAdjustedAnimationDuration,
  getAnimationNameForType,
  isWithinHitWindow,
} from "./animation";
import { applyDamageToBodyParts } from "./bodypart/BodyPartDamageIntegration";
import { playerInjuryManager } from "./bodypart";
import {
  applyBreathingDisruptionFromVitalPoint,
  applyBreathingDisruptionFromTorsoDamage,
  BreathingDisruptionSystem,
  causesBreathingDisruption,
  updateBreathingDisruption,
} from "./breathing";
import BalanceSystem from "./combat/BalanceSystem";
import ConsciousnessSystem from "./combat/ConsciousnessSystem";
import {
  extractVitalPointCategory,
  isHeadTraumaHit,
} from "./combat/painConsciousnessUtils";
import PainResponseSystem, {
  ShockPainEffect,
} from "./combat/PainResponseSystem";
import { CombatResult, CombatSystemInterface } from "./combat/types";
import {
  CollisionDetection,
  KnockbackPhysics,
  physicalReachCalculator,
  type KnockbackConfig,
} from "./physics";
import { PlayerState } from "./player";
import {
  addEffectsToPlayer,
  getEffectModifiers,
  removeExpiredEffects,
} from "./PlayerEffectManager";
import { TRIGRAM_TECHNIQUES } from "./trigram";
import { TrigramSystem } from "./TrigramSystem";
import { StatusEffect } from "./types";
import { KoreanTechnique, VitalPointHitResult } from "./vitalpoint/types";
import { VitalPointSystem } from "./VitalPointSystem";
import { GrappleSystem } from "./combat/GrappleSystem";

/**
 * Enhanced Combat System with Pain Response and Consciousness integration.
 *
 * Integrates realistic pain accumulation and consciousness tracking for
 * progressive combat impairment.
 */
export class CombatSystem implements CombatSystemInterface {
  private vitalPointSystem: VitalPointSystem;
  protected trigramSystem: TrigramSystem;
  private painSystem: PainResponseSystem;
  private consciousnessSystem: ConsciousnessSystem;
  private balanceSystem: BalanceSystem;
  private knockbackPhysics: KnockbackPhysics;
  private collisionDetection: CollisionDetection;
  private grappleSystem: GrappleSystem;

  // Track shock pain effects per player
  private shockPainEffects: Map<string, ShockPainEffect>;
  // Track last head trauma time per player for consciousness recovery
  private lastHeadTraumaTime: Map<string, number>;

  // Vital point severity thresholds
  private readonly SEVERITY_MAJOR_THRESHOLD = 30;
  private readonly SEVERITY_MODERATE_THRESHOLD = 20;

  constructor() {
    this.vitalPointSystem = new VitalPointSystem();
    this.trigramSystem = new TrigramSystem();
    this.painSystem = new PainResponseSystem();
    this.consciousnessSystem = new ConsciousnessSystem();
    this.balanceSystem = new BalanceSystem();
    this.knockbackPhysics = new KnockbackPhysics();
    this.collisionDetection = new CollisionDetection();
    this.grappleSystem = new GrappleSystem();
    this.shockPainEffects = new Map();
    this.lastHeadTraumaTime = new Map();
  }

  /**
   * Cleanup per-player combat state.
   *
   * Call this when a player permanently leaves the match or when
   * match-level cleanup is performed to avoid unbounded Map growth.
   *
   * @param playerId - ID of the player to cleanup
   *
   * @public
   * @korean 플레이어데이터정리
   */
  public cleanupPlayerData(playerId: string): void {
    this.shockPainEffects.delete(playerId);
    this.lastHeadTraumaTime.delete(playerId);
  }

  /**
   * Dispose of all combat system resources.
   *
   * **Korean**: 전투 시스템 자원 정리
   *
   * Cleans up Three.js resources (geometries, raycaster) used by the collision
   * detection system to prevent memory leaks. Should be called when the
   * CombatSystem is destroyed or reinitialized.
   *
   * @public
   * @korean 전투시스템자원정리
   */
  public dispose(): void {
    // Dispose collision detection resources (cached geometries, raycaster)
    this.collisionDetection.dispose();
  }

  /**
   * Get the balance system instance for fall checking.
   *
   * @returns BalanceSystem instance
   * @public
   * @korean 균형시스템가져오기
   */
  public getBalanceSystem(): BalanceSystem {
    return this.balanceSystem;
  }

  /**
   * Get the consciousness system instance for fall checking.
   *
   * @returns ConsciousnessSystem instance
   * @public
   * @korean 의식시스템가져오기
   */
  public getConsciousnessSystem(): ConsciousnessSystem {
    return this.consciousnessSystem;
  }

  /**
   * Get the collision detection system instance.
   *
   * @returns CollisionDetection instance
   * @public
   * @korean 충돌감지시스템가져오기
   */
  public getCollisionDetection(): CollisionDetection {
    return this.collisionDetection;
  }

  /**
   * Calculate knockback physics for combat hit.
   *
   * **Korean**: 밀침 계산 (Calculate Knockback)
   *
   * Determines knockback displacement, duration, and fall state based on:
   * - Attack damage amount
   * - Defender's balance state
   * - Defender's stance resistance
   * - Attack direction vector
   *
   * @param attacker - Attacking player state
   * @param defender - Defending player state
   * @param damage - Total damage dealt
   * @returns Knockback information or undefined if no knockback
   *
   * @example
   * ```typescript
   * const knockback = this.calculateKnockback(attacker, defender, 80);
   * // Returns: { displacement: {x:2.5,y:0,z:0}, duration:0.8, recoveryWindow:0.7, shouldFall:false }
   * ```
   *
   * @private
   * @korean 밀침계산
   */
  private calculateKnockback(
    attacker: PlayerState,
    defender: PlayerState,
    damage: number,
  ): CombatResult["knockback"] {
    // Calculate attack direction vector (attacker → defender)
    const attackDirection = new THREE.Vector3(
      defender.position.x - attacker.position.x,
      0, // Keep knockback on horizontal plane
      defender.position.y - attacker.position.y,
    );

    // If attacker and defender are at the exact same position, skip knockback to avoid NaN direction
    if (attackDirection.lengthSq() === 0) {
      return undefined;
    }

    attackDirection.normalize();

    // Create knockback configuration
    const config: KnockbackConfig = {
      force: damage * 10, // Convert damage to force (arbitrary scaling)
      direction: attackDirection,
      duration: 0, // Will be calculated by physics engine
      balanceState: {
        current: defender.balance,
        max: 100, // Assuming max balance is always 100
      },
      currentStance: defender.currentStance,
    };

    // Calculate knockback result
    const result = this.knockbackPhysics.calculateKnockback(config, damage);

    // Convert Three.js Vector3 to plain object for serialization
    return {
      displacement: {
        x: result.displacement.x,
        y: result.displacement.y,
        z: result.displacement.z,
      },
      duration: result.duration,
      recoveryWindow: result.recoveryWindow,
      shouldFall: result.shouldFall,
    };
  }

  /**
   * Fix: Update resolveAttack to match interface signature and add animation-aware hit detection
   *
   * **Korean**: 공격 해결 (애니메이션 인식)
   *
   * Integrates animation timing and physical reach calculation for reality-based hit detection.
   * Hits only register when:
   * 1. Animation is in hit window (extension phase)
   * 2. Attacker is within effective reach based on limb length and animation
   * 3. Existing accuracy and stance checks pass
   *
   * @param attacker - Attacking player state
   * @param defender - Defending player state
   * @param technique - Technique being executed
   * @param targetedVitalPointId - Optional specific vital point target
   * @param animationContext - Optional animation timing context for reality-based hit detection
   * @returns Combat result with hit/miss and damage information
   */
  resolveAttack(
    attacker: PlayerState,
    defender: PlayerState,
    technique: KoreanTechnique,
    targetedVitalPointId?: string,
    animationContext?: {
      animationType: AnimationType;
      currentTime: number;
    },
  ): CombatResult {
    const timestamp = Date.now();

    // Check if attacker can execute the technique
    if (!this.canExecuteTechnique(attacker, technique)) {
      return {
        hit: false,
        damage: 0,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp,
        technique,
        attacker,
        defender,
        success: false,
        isCritical: false,
        isBlocked: false,
      };
    }

    // Check if attacker is being grappled - cannot attack while controlled
    if (attacker.combatState === CombatState.GRAPPLED) {
      return {
        hit: false,
        damage: 0,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp,
        technique,
        attacker,
        defender,
        success: false,
        isCritical: false,
        isBlocked: false,
      };
    }

    // === ANIMATION-AWARE HIT DETECTION ===
    // If animation context provided, validate timing and reach
    if (animationContext) {
      const { animationType, currentTime } = animationContext;

      // Check if within hit window (extension phase)
      if (!isWithinHitWindow(animationType, currentTime)) {
        return {
          hit: false,
          damage: 0,
          criticalHit: false,
          vitalPointHit: false,
          effects: [],
          timestamp,
          technique,
          attacker,
          defender,
          success: false,
          isCritical: false,
          isBlocked: false,
        };
      }

      // Calculate effective reach based on physical attributes and animation
      const attackerPhysical = getArchetypePhysicalAttributes(
        attacker.archetype,
      );
      const reachResult = physicalReachCalculator.calculateReach(
        attackerPhysical,
        animationType,
        currentTime,
        attacker.currentStance,
      );

      // Check distance to defender using 3D Euclidean distance
      // Physics-first: Position type is 2D in METERS
      // No conversion needed - positions are already in meters
      const centerToCenterDistance = calculateDistance3D(
        [attacker.position.x, attacker.position.y, 0],
        [defender.position.x, defender.position.y, 0],
      );

      // Calculate defender body radius based on their physical attributes
      // Attacks hit the body surface, not the center point
      // 타격은 중심점이 아닌 몸체 표면에 적중
      const defenderPhysical = getArchetypePhysicalAttributes(
        defender.archetype,
      );
      const defenderBodyRadius = calculateBodyRadius(defenderPhysical);

      // Effective distance = center-to-center minus target body radius
      // 유효 거리 = 중심간 거리 - 목표 몸체 반경
      const distance = Math.max(0, centerToCenterDistance - defenderBodyRadius);

      // If out of reach, miss
      if (distance > reachResult.effectiveReach) {
        return {
          hit: false,
          damage: 0,
          criticalHit: false,
          vitalPointHit: false,
          effects: [],
          timestamp,
          technique,
          attacker,
          defender,
          success: false,
          isCritical: false,
          isBlocked: false,
        };
      }
    }

    // Fix: Use correct method signature
    const stanceEffectiveness = this.trigramSystem.calculateStanceEffectiveness(
      attacker.currentStance,
      defender.currentStance,
    );

    // Calculate base hit chance
    const baseAccuracy = technique.accuracy * stanceEffectiveness;
    const hitRoll = Math.random();
    const hit = hitRoll <= baseAccuracy;

    if (!hit) {
      return {
        hit: false,
        damage: 0,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp,
        technique,
        attacker,
        defender,
        success: false,
        isCritical: false,
        isBlocked: false,
      };
    }

    // Special handling for grapple techniques
    if (technique.type === CombatAttackType.GRAPPLE) {
      const grappleResult = this.handleGrappleTechnique(
        attacker,
        defender,
        technique,
        timestamp
      );

      // Grapples don't deal immediate damage, they establish control
      // Small damage on successful grapple to represent the initial impact
      const grappleDamage = grappleResult.grappleSuccess
        ? technique.damage * 0.3
        : 0;

      return {
        hit: grappleResult.grappleSuccess,
        damage: grappleDamage,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp,
        technique,
        attacker: grappleResult.updatedAttacker,
        defender: grappleResult.updatedDefender,
        success: grappleResult.grappleSuccess,
        isCritical: false,
        isBlocked: false,
        animation: this.getAnimationInfoForTechnique(technique),
      };
    }

    // Process vital point hit if targeted (with archetype parameters)
    let vitalPointResult: VitalPointHitResult | null = null;
    if (targetedVitalPointId) {
      vitalPointResult = this.processVitalPointHit(
        targetedVitalPointId,
        technique.damage ?? 15,
        attacker,
        defender,
      );
    }

    // Calculate damage using the interface method
    const damageResult = this.calculateDamage(
      technique,
      attacker,
      defender,
      vitalPointResult ?? {
        hit: false,
        damage: 0,
        effects: [],
        severity: VitalPointSeverity.MINOR,
      },
    );

    // Check for critical hit
    const critRoll = Math.random();
    const isCritical = critRoll <= (technique.critChance ?? 0.1);

    // Determine animation information for technique
    const animationInfo = this.getAnimationInfoForTechnique(technique);

    // Calculate knockback physics (밀침 물리)
    const knockbackInfo = this.calculateKnockback(
      attacker,
      defender,
      damageResult.totalDamage,
    );

    return {
      hit: true,
      damage: damageResult.totalDamage,
      criticalHit: isCritical,
      vitalPointHit: vitalPointResult?.hit ?? false,
      effects: damageResult.effectsApplied,
      timestamp,
      technique,
      attacker,
      defender,
      success: true,
      isCritical: vitalPointResult?.hit ?? false,
      isBlocked: false,
      targetedVitalPointId, // Pass through the targeted vital point ID
      animation: animationInfo, // Add animation information
      knockback: knockbackInfo, // Add knockback information
    };
  }

  /**
   * Get animation information for a technique
   *
   * Determines the skeletal animation to play, duration, and speed modifier
   * based on technique configuration or automatic determination.
   *
   * @param technique - Korean technique to execute
   * @returns Animation information or undefined
   *
   * @private
   * @korean 기술애니메이션정보가져오기
   */
  private getAnimationInfoForTechnique(
    technique: KoreanTechnique,
  ): CombatResult["animation"] {
    // Check if technique has explicit animation config (from Technique interface)
    // KoreanTechnique may not have animation field, so check the technique data
    const techniqueData = this.getTechniqueData(technique);

    let animationType;
    let speedModifier;

    if (techniqueData?.animation) {
      // Use explicit animation configuration
      animationType = techniqueData.animation.type;
      speedModifier = techniqueData.animation.speedModifier;
    } else {
      // Auto-determine animation from technique characteristics
      const techniqueName =
        technique.name?.english || technique.englishName || "";
      const techniqueId = technique.id || "";
      const damageType = technique.damageType || "";

      animationType = determineAnimationTypeForTechnique(
        techniqueName,
        techniqueId,
        damageType,
      );

      // Calculate speed modifier based on technique damage
      speedModifier = calculateSpeedModifierForDamage(technique.damage || 15);
    }

    // Get base animation name from animation type
    const animationName = getAnimationNameForType(animationType);

    // Calculate adjusted duration
    const duration = getAdjustedAnimationDuration(animationName, speedModifier);

    // Get Korean technique name for display
    const techniqueDisplayName =
      technique.name?.korean || technique.koreanName || technique.id;

    return {
      animationName,
      duration,
      speedModifier,
      techniqueDisplayName,
    };
  }

  /**
   * Get Technique data if this KoreanTechnique has an associated Technique definition
   *
   * @param technique - Korean technique
   * @returns Technique data or null
   *
   * @private
   * @korean 기술데이터가져오기
   */
  private getTechniqueData(technique: KoreanTechnique): Technique | null {
    return getTechniqueById(technique.id) ?? null;
  }

  /**
   * Handle grapple technique execution.
   *
   * **Korean**: 잡기 기술 처리 (Handle Grapple Technique)
   *
   * Initiates or transitions grapple control based on technique.
   *
   * @param attacker - Player executing grapple
   * @param defender - Target player
   * @param technique - Grapple technique being used
   * @param currentTime - Current game time in milliseconds
   * @returns Updated player states with grapple control
   */
  handleGrappleTechnique(
    attacker: PlayerState,
    defender: PlayerState,
    technique: KoreanTechnique,
    currentTime: number
  ): {
    updatedAttacker: PlayerState;
    updatedDefender: PlayerState;
    grappleSuccess: boolean;
  } {
    // Determine grapple target from technique
    const target = this.getGrappleTargetFromTechnique(technique);

    // Attempt grapple
    const result = this.grappleSystem.attemptGrapple(
      attacker,
      defender,
      target,
      currentTime
    );

    if (result.success && result.grappleControl) {
      // Grapple succeeded - update both players
      return {
        updatedAttacker: {
          ...attacker,
          combatState: CombatState.GRAPPLING,
          grappleControl: result.grappleControl,
          stamina: Math.max(0, attacker.stamina - result.staminaCost),
        },
        updatedDefender: {
          ...defender,
          combatState: CombatState.GRAPPLED,
          grappleControl: result.grappleControl,
        },
        grappleSuccess: true,
      };
    }

    // Grapple failed
    return {
      updatedAttacker: {
        ...attacker,
        stamina: Math.max(0, attacker.stamina - result.staminaCost),
      },
      updatedDefender: defender,
      grappleSuccess: false,
    };
  }

  /**
   * Determine grapple target from technique characteristics.
   *
   * **Korean**: 기술에서 잡기 목표 결정 (Determine Grapple Target from Technique)
   *
   * @private
   */
  private getGrappleTargetFromTechnique(
    technique: KoreanTechnique
  ): import("@/types").GrappleTarget {
    const { GrappleTarget } = require("@/types");
    
    // Check technique name/ID for hints
    const techName = (
      technique.name?.english ||
      technique.englishName ||
      ""
    ).toLowerCase();
    const techId = technique.id.toLowerCase();

    if (techName.includes("wrist") || techId.includes("wrist")) {
      return GrappleTarget.HAND;
    }
    if (techName.includes("arm") || techId.includes("arm")) {
      return GrappleTarget.ARM;
    }
    if (techName.includes("leg") || techId.includes("leg")) {
      return GrappleTarget.LEG;
    }
    if (techName.includes("neck") || techId.includes("neck")) {
      return GrappleTarget.NECK;
    }
    if (
      techName.includes("both") ||
      techName.includes("double") ||
      techId.includes("both")
    ) {
      return GrappleTarget.BOTH_ARMS;
    }
    if (
      techName.includes("torso") ||
      techName.includes("body") ||
      techName.includes("hip") ||
      techId.includes("torso")
    ) {
      return GrappleTarget.TORSO;
    }

    // Default to arm for unspecified grapples
    return GrappleTarget.ARM;
  }

  /**
   * Update grapple state for players over time.
   *
   * **Korean**: 잡기 상태 업데이트 (Update Grapple State)
   *
   * @param controller - Player maintaining control
   * @param target - Player being controlled
   * @param deltaTime - Time elapsed in seconds
   * @param currentTime - Current game time in milliseconds
   * @returns Updated player states
   */
  updateGrappleState(
    controller: PlayerState,
    target: PlayerState,
    deltaTime: number,
    currentTime: number
  ): {
    updatedController: PlayerState;
    updatedTarget: PlayerState;
  } {
    if (!controller.grappleControl) {
      // No active grapple
      return {
        updatedController: controller,
        updatedTarget: target,
      };
    }

    // Update grapple control
    const updatedControl = this.grappleSystem.updateGrapple(
      controller.grappleControl,
      controller,
      target,
      deltaTime,
      currentTime
    );

    if (!updatedControl) {
      // Grapple broken - reset both players
      return {
        updatedController: {
          ...controller,
          combatState: CombatState.IDLE,
          grappleControl: null,
        },
        updatedTarget: {
          ...target,
          combatState: CombatState.IDLE,
          grappleControl: null,
        },
      };
    }

    // Deduct stamina from controller
    const staminaCost = updatedControl.staminaCostPerSecond * deltaTime;

    return {
      updatedController: {
        ...controller,
        grappleControl: updatedControl,
        stamina: Math.max(0, controller.stamina - staminaCost),
      },
      updatedTarget: {
        ...target,
        grappleControl: updatedControl,
      },
    };
  }

  /**
   * Fix: Make applyCombatResult non-static instance method with effect application
   * Enhanced with Pain Response and Consciousness System integration
   */
  applyCombatResult(
    result: CombatResult,
    attacker: PlayerState,
    defender: PlayerState,
  ): { updatedAttacker: PlayerState; updatedDefender: PlayerState } {
    // Start with base result
    const { updatedAttacker, updatedDefender: initialDefender } =
      CombatSystem.applyCombatResult(result, attacker, defender);
    let updatedDefender = initialDefender;

    if (result.hit && result.damage > 0) {
      // Determine vital point category and severity from hit result
      const category = this.getVitalPointCategory(result);
      const severity = this.getVitalPointSeverity(result);

      // Apply pain from damage
      const { player: defenderWithPain, shockEffect: newShockEffect } =
        this.painSystem.applyPain(
          updatedDefender,
          result.damage,
          severity,
          category,
        );
      updatedDefender = defenderWithPain;

      // Store shock pain effect if triggered
      if (newShockEffect) {
        this.shockPainEffects.set(updatedDefender.id, newShockEffect);
      }

      // Check for pain overload stun
      if (this.painSystem.shouldTriggerStun(updatedDefender)) {
        updatedDefender = {
          ...updatedDefender,
          isStunned: true,
        };
      }

      // Apply consciousness damage for head/neurological hits
      if (this.isHeadTrauma(result, category)) {
        updatedDefender = this.consciousnessSystem.applyDamage(
          updatedDefender,
          result.damage,
          category,
        );

        // Track head trauma time for recovery gating
        this.lastHeadTraumaTime.set(updatedDefender.id, Date.now());

        // Check incapacitation threshold
        if (
          this.consciousnessSystem.isAtIncapacitationThreshold(updatedDefender)
        ) {
          updatedDefender = {
            ...updatedDefender,
            isStunned: true,
            // Could add helpless duration tracking here if needed
          };
        }
      }

      // Apply pain and consciousness effects to stats
      const currentShockEffect = this.shockPainEffects.get(updatedDefender.id);
      updatedDefender = this.painSystem.applyEffects(
        updatedDefender,
        currentShockEffect,
      );
      updatedDefender = this.consciousnessSystem.applyEffects(updatedDefender);

      // Apply balance disruption from the hit
      // Determine body region from vital point or use default
      const bodyRegion = this.getBodyRegionFromResult(result);
      updatedDefender = this.balanceSystem.disruptBalance(
        updatedDefender,
        result.damage,
        bodyRegion,
      );

      // Apply breathing disruption for torso strikes
      if (result.vitalPointHit && result.targetedVitalPointId) {
        // Vital point strike to torso
        const vitalPoint = this.vitalPointSystem.getVitalPointById(
          result.targetedVitalPointId,
        );
        if (vitalPoint && causesBreathingDisruption(vitalPoint.id)) {
          updatedDefender = applyBreathingDisruptionFromVitalPoint(
            updatedDefender,
            vitalPoint,
            Date.now(),
          );
        }
      } else if (bodyRegion === BodyRegion.TORSO && result.damage >= 10) {
        // General torso damage (non-vital point hits)
        // Apply breathing disruption if damage is significant enough
        // Note: Solar plexus detection is best-effort; vital point system is primary mechanism
        const isSolarPlexusArea = 
          result.technique?.id?.toLowerCase().includes("solar") ||
          result.technique?.id?.toLowerCase().includes("myeongchi") ||
          false;
        updatedDefender = applyBreathingDisruptionFromTorsoDamage(
          updatedDefender,
          result.damage,
          isSolarPlexusArea,
          Date.now(),
        );
      }
    }

    return { updatedAttacker, updatedDefender };
  }

  /**
   * Determines if a hit caused head trauma (affects consciousness).
   *
   * @param result - Combat result
   * @param category - Vital point category
   * @returns True if hit should affect consciousness
   */
  private isHeadTrauma(
    result: CombatResult,
    category?: VitalPointCategory,
  ): boolean {
    return isHeadTraumaHit(result, category);
  }

  /**
   * Extracts vital point category from combat result.
   *
   * @param result - Combat result
   * @returns Vital point category if available
   */
  private getVitalPointCategory(
    result: CombatResult,
  ): VitalPointCategory | undefined {
    return extractVitalPointCategory(result);
  }

  /**
   * Extracts vital point severity from combat result.
   *
   * @param result - Combat result
   * @returns Vital point severity if critical hit
   */
  private getVitalPointSeverity(
    result: CombatResult,
  ): VitalPointSeverity | undefined {
    if (result.vitalPointHit) {
      if (result.isCritical) {
        return VitalPointSeverity.CRITICAL;
      }
      if (result.damage > this.SEVERITY_MAJOR_THRESHOLD) {
        return VitalPointSeverity.MAJOR;
      }
      if (result.damage > this.SEVERITY_MODERATE_THRESHOLD) {
        return VitalPointSeverity.MODERATE;
      }
      return VitalPointSeverity.MINOR;
    }
    return undefined;
  }

  /**
   * Determines body region from combat result for balance disruption.
   *
   * Maps vital points to body regions for balance system integration.
   * Uses string matching on vital point IDs as a pragmatic heuristic since
   * VitalPoint interface doesn't currently include a bodyRegion property.
   *
   * Future improvement: Add bodyRegion: BodyRegion to VitalPoint interface
   * for more robust region mapping without string pattern matching.
   *
   * @param result - Combat result
   * @returns Body region that was struck
   * @private
   * @korean 신체부위결정
   */
  private getBodyRegionFromResult(result: CombatResult): BodyRegion {
    // If we have a targeted vital point, try to determine region
    if (result.targetedVitalPointId) {
      const vitalPoint = this.vitalPointSystem.getVitalPointById(
        result.targetedVitalPointId,
      );

      if (vitalPoint) {
        const pointId = vitalPoint.id.toLowerCase();

        // Check for leg/lower body targets
        if (
          pointId.includes("leg") ||
          pointId.includes("knee") ||
          pointId.includes("ankle") ||
          pointId.includes("thigh")
        ) {
          return BodyRegion.LEFT_LEG; // Generic leg for balance disruption
        }

        // Check for head targets
        if (
          pointId.includes("head") ||
          pointId.includes("temple") ||
          pointId.includes("jaw") ||
          pointId.includes("nose")
        ) {
          return BodyRegion.HEAD;
        }

        // Check for arm targets
        if (
          pointId.includes("arm") ||
          pointId.includes("elbow") ||
          pointId.includes("wrist") ||
          pointId.includes("shoulder")
        ) {
          return BodyRegion.LEFT_ARM;
        }
      }
    }

    // Default to torso for general strikes
    return BodyRegion.TORSO;
  }

  /**
   * Updates player states for recovery (pain dissipation, consciousness recovery, balance recovery).
   * Call this regularly in game loop.
   *
   * @param player - Player to update
   * @param deltaTime - Time elapsed since last update (ms)
   * @returns Updated player state
   */
  applyRecovery(player: PlayerState, deltaTime: number): PlayerState {
    let updatedPlayer = player;

    // Apply pain recovery
    updatedPlayer = this.painSystem.applyDissipation(updatedPlayer, deltaTime);

    // Apply consciousness recovery (only if enough time since head trauma)
    const lastTrauma = this.lastHeadTraumaTime.get(player.id);
    updatedPlayer = this.consciousnessSystem.applyRecovery(
      updatedPlayer,
      deltaTime,
      lastTrauma,
    );

    // Apply balance recovery
    updatedPlayer = this.balanceSystem.applyRecovery(updatedPlayer, deltaTime);

    // Clean up expired shock pain effects
    const shockEffect = this.shockPainEffects.get(player.id);
    if (shockEffect) {
      const elapsed = Date.now() - shockEffect.startTime;
      if (elapsed >= shockEffect.duration) {
        this.shockPainEffects.delete(player.id);
      }
    }

    return updatedPlayer;
  }

  /**
   * Static version for backwards compatibility with comprehensive effect application
   * Enhanced with Pain Response and Consciousness System integration
   * Updated to apply damage to body parts for 8-body-part health visualization
   */
  static applyCombatResult(
    result: CombatResult,
    attacker: PlayerState,
    defender: PlayerState,
  ): { updatedAttacker: PlayerState; updatedDefender: PlayerState } {
    // Apply damage and effects
    let updatedDefender = defender;
    let updatedAttacker = attacker;

    if (result.hit) {
      // Determine body region from technique or use random distribution
      const bodyRegion = CombatSystem.getBodyRegionFromTechnique(
        result.technique,
      );

      // Apply damage to body parts (this also updates aggregate health)
      updatedDefender = applyDamageToBodyParts(
        defender,
        result.damage,
        bodyRegion,
      );

      // Record injury for trauma visualization (외상 시각화)
      // Use per-player injury tracking to prevent mixing injuries between characters
      // Automatically tracks bruising, cuts, and blood effects based on damage type
      // Records injury even without specific technique (defaults to BRUISE)
      if (result.damage > 0) {
        const defenderInjuryIntegration = playerInjuryManager.getIntegrationForPlayer(defender.id);
        defenderInjuryIntegration.recordCombatDamage({
          damage: result.damage,
          bodyRegion,
          damageType: (result.technique?.damageType as DamageType) || undefined,
        });
      }

      // Update tracking stats (applyDamageToBodyParts already sets health)
      updatedDefender = {
        ...updatedDefender,
        totalDamageReceived:
          updatedDefender.totalDamageReceived + result.damage,
        hitsTaken: updatedDefender.hitsTaken + 1,
      };

      // Apply status effects from vital point hit
      if (result.effects && result.effects.length > 0) {
        updatedDefender = addEffectsToPlayer(updatedDefender, result.effects);
      }

      // Track vital point hits
      if (result.vitalPointHit) {
        updatedAttacker = {
          ...updatedAttacker,
          vitalPointHits: attacker.vitalPointHits + 1,
        };
      }

      // Track perfect strikes (high accuracy)
      if (result.isCritical) {
        updatedAttacker = {
          ...updatedAttacker,
          perfectStrikes: attacker.perfectStrikes + 1,
        };
      }
    }

    // Apply technique costs to attacker
    updatedAttacker = {
      ...updatedAttacker,
      ki: Math.max(0, attacker.ki - 5),
      stamina: Math.max(0, attacker.stamina - 10),
      totalDamageDealt:
        attacker.totalDamageDealt + (result.hit ? result.damage : 0),
      hitsLanded: attacker.hitsLanded + (result.hit ? 1 : 0),
    };

    return { updatedAttacker, updatedDefender };
  }

  /**
   * Determine body region from technique name or type
   *
   * **Korean**: 기술에서 신체 영역 결정
   *
   * @param technique - The technique used in the attack
   * @returns Body region to apply damage to
   */
  private static getBodyRegionFromTechnique(
    technique?: KoreanTechnique,
  ): BodyRegion {
    if (!technique) {
      // Default to torso if no technique specified
      return BodyRegion.TORSO;
    }

    const techniqueName = (
      technique.name?.english ||
      technique.englishName ||
      ""
    ).toLowerCase();
    const techniqueId = technique.id?.toLowerCase() || "";

    // Head/face targeting techniques
    if (
      techniqueName.includes("head") ||
      techniqueName.includes("temple") ||
      techniqueName.includes("jaw") ||
      techniqueName.includes("face") ||
      techniqueId.includes("head") ||
      techniqueId.includes("skull")
    ) {
      return BodyRegion.HEAD;
    }

    // Neck targeting techniques
    if (
      techniqueName.includes("neck") ||
      techniqueName.includes("throat") ||
      techniqueName.includes("choke") ||
      techniqueId.includes("neck")
    ) {
      return BodyRegion.NECK;
    }

    // Leg targeting techniques
    if (
      techniqueName.includes("kick") ||
      techniqueName.includes("sweep") ||
      techniqueName.includes("leg") ||
      techniqueName.includes("knee") ||
      techniqueId.includes("kick") ||
      techniqueId.includes("leg")
    ) {
      // Randomly choose left or right leg
      return Math.random() < 0.5 ? BodyRegion.LEFT_LEG : BodyRegion.RIGHT_LEG;
    }

    // Arm targeting techniques
    if (
      techniqueName.includes("arm") ||
      techniqueName.includes("shoulder") ||
      techniqueName.includes("elbow") ||
      techniqueId.includes("arm")
    ) {
      // Randomly choose left or right arm
      return Math.random() < 0.5 ? BodyRegion.LEFT_ARM : BodyRegion.RIGHT_ARM;
    }

    // Punch/strike techniques typically target torso
    if (
      techniqueName.includes("punch") ||
      techniqueName.includes("strike") ||
      techniqueName.includes("jab") ||
      techniqueName.includes("cross") ||
      techniqueName.includes("hook") ||
      techniqueName.includes("uppercut")
    ) {
      // Mix of torso and head for punches
      return Math.random() < 0.7 ? BodyRegion.TORSO : BodyRegion.HEAD;
    }

    // Body/core targeting techniques
    if (
      techniqueName.includes("body") ||
      techniqueName.includes("solar") ||
      techniqueName.includes("liver") ||
      techniqueName.includes("ribs") ||
      techniqueName.includes("abdomen") ||
      techniqueId.includes("torso") ||
      techniqueId.includes("core")
    ) {
      return BodyRegion.TORSO;
    }

    // Default to torso for unmatched techniques
    return BodyRegion.TORSO;
  }

  /**
   * Fix: Add missing getAvailableTechniques method required by interface
   */
  getAvailableTechniques(player: PlayerState): readonly KoreanTechnique[] {
    const allTechniques = TRIGRAM_TECHNIQUES[player.currentStance] ?? [];

    // Filter techniques based on available resources using canExecuteTechnique
    return allTechniques.filter((technique) =>
      this.canExecuteTechnique(player, technique as KoreanTechnique),
    ) as readonly KoreanTechnique[];
  }

  /**
   * Check if attacker can execute technique
   */
  private canExecuteTechnique(
    player: PlayerState,
    technique: KoreanTechnique,
  ): boolean {
    return (
      player.ki >= technique.kiCost &&
      player.stamina >= technique.staminaCost &&
      player.currentStance === technique.stance &&
      !player.isStunned
    );
  }

  /**
   * Static methods for backwards compatibility
   */
  static resolveAttack(
    attacker: PlayerState,
    defender: PlayerState,
    technique: KoreanTechnique,
  ): CombatResult {
    const instance = new CombatSystem();
    return instance.executeAttack(attacker, defender, technique);
  }

  /**
   * Check if a player is defeated
   */
  isPlayerDefeated(player: PlayerState): boolean {
    return player.health <= 0 || player.consciousness <= 0;
  }

  /**
   * Update player state over time with effect management
   */
  updatePlayerState(player: PlayerState, deltaTime: number): PlayerState {
    let updatedPlayer = { ...player };

    // Remove expired effects first
    updatedPlayer = removeExpiredEffects(updatedPlayer);

    // Get effect modifiers for resource regeneration
    const effectModifiers = getEffectModifiers(updatedPlayer);

    // Apply natural regeneration with effect modifiers
    const regenRate = deltaTime / 1000; // Convert to seconds

    // Ki regeneration (slower during combat) - affected by effects
    if (updatedPlayer.ki < updatedPlayer.maxKi) {
      updatedPlayer.ki = Math.min(
        updatedPlayer.maxKi,
        updatedPlayer.ki + regenRate * 2 * effectModifiers.kiRegen,
      );
    }

    // Stamina regeneration - affected by effects and breathing disruption
    // Uses BASE_STAMINA_REGEN_RATE constant for better gameplay
    // Allows players to move around and attack frequently without running out
    // 체력 재생 속도 - 더 활발한 전투를 위해
    if (updatedPlayer.stamina < updatedPlayer.maxStamina) {
      const baseStaminaRegen = regenRate * BASE_STAMINA_REGEN_RATE * effectModifiers.staminaRegen;
      // Apply breathing disruption system's stamina regen modifier
      const modifiedStaminaRegen =
        BreathingDisruptionSystem.calculateStaminaRegen(
          updatedPlayer,
          baseStaminaRegen,
        );
      updatedPlayer.stamina = Math.min(
        updatedPlayer.maxStamina,
        updatedPlayer.stamina + modifiedStaminaRegen,
      );
    }

    // Health regeneration (very slow)
    if (
      updatedPlayer.health < updatedPlayer.maxHealth &&
      updatedPlayer.health > 0
    ) {
      updatedPlayer.health = Math.min(
        updatedPlayer.maxHealth,
        updatedPlayer.health + regenRate * 0.5,
      );
    }

    // Update breathing disruption effects (gradual recovery if torso health > 50%)
    updatedPlayer = updateBreathingDisruption(
      updatedPlayer,
      deltaTime,
      Date.now(),
    );

    // Clear temporary combat states
    const currentTime = Date.now();
    if (
      updatedPlayer.lastActionTime &&
      currentTime - updatedPlayer.lastActionTime > updatedPlayer.recoveryTime
    ) {
      updatedPlayer.isStunned = false;
      updatedPlayer.isCountering = false;
    }

    return updatedPlayer;
  }

  /**
   * Get combat statistics
   */
  getCombatStatistics(player: PlayerState): {
    healthPercent: number;
    kiPercent: number;
    staminaPercent: number;
    balancePercent: number;
  } {
    return {
      healthPercent: (player.health / player.maxHealth) * 100,
      kiPercent: (player.ki / player.maxKi) * 100,
      staminaPercent: (player.stamina / player.maxStamina) * 100,
      balancePercent: player.balance,
    };
  }

  /**
   * Fix: Integrate processVitalPointHit into the combat system with archetype parameters
   */
  private processVitalPointHit(
    vitalPointId: string,
    _baseDamage: number, // Unused but kept for interface compatibility
    attacker: PlayerState,
    defender: PlayerState,
  ): VitalPointHitResult {
    const vitalPoint = this.vitalPointSystem.getVitalPointById(vitalPointId);

    if (!vitalPoint) {
      return {
        hit: false,
        damage: 0,
        effects: [],
        severity: VitalPointSeverity.MINOR,
      };
    }

    // Use VitalPointSystem's processHit with full archetype support
    return this.vitalPointSystem.processHit(
      vitalPoint.position, // Use vital point position for hit calculation
      { width: 10, height: 10 }, // Standard hit box
      vitalPointId, // Targeted vital point
      undefined, // Use current hour from system
      attacker.archetype, // Attacker archetype for offensive modifiers
      defender.archetype, // Defender archetype for defensive modifiers
    );
  }

  /**
   * Process defensive action and determine animation type.
   *
   * Determines the appropriate defensive animation based on:
   * - Defender's balance and stamina (defensive power)
   * - Attacker's technique power
   * - Combat readiness state
   *
   * **Korean**: 방어 행동 처리
   *
   * @param defender - Defending player state
   * @param attacker - Attacking player state (unused but kept for future enhancements)
   * @param attackPower - Power of the incoming attack
   * @returns Defensive animation type to play (parry_deflect, block_success, or guard_break)
   *
   * @example
   * ```typescript
   * const animType = combatSystem.processDefensiveAction(
   *   defender,
   *   attacker,
   *   technique.damage
   * );
   * // Returns: 'parry_deflect', 'block_success', or 'guard_break'
   * ```
   *
   * @public
   * @korean 방어행동처리
   */
  public processDefensiveAction(
    defender: PlayerState,
    _attacker: PlayerState,
    attackPower: number,
  ): Exclude<DefensiveAnimationType, "guard_recovery"> {
    // Guard Break: Check balance threshold first (highest priority condition)
    if (defender.balance < 30) {
      return "guard_break";
    }

    // Calculate defensive power based on balance and stamina
    // Balance represents physical stability (0-100)
    // Stamina represents energy reserves (0-100)
    const balanceFactor = defender.balance / 100;
    const staminaFactor = defender.stamina / 100;

    // Apply defensive modifiers from effects
    const effectModifiers = getEffectModifiers(defender);
    const defenseMultiplier = effectModifiers.defense;

    // Defense stat provides moderate bonus (normalized to 0.5-1.5 range for typical 5-15 defense)
    const defenseBonus = Math.max(0.5, Math.min(1.5, defender.defense / 10));

    // Calculate final defensive power
    const defensePower =
      balanceFactor * staminaFactor * 100 * defenseMultiplier * defenseBonus;

    // Determine defensive outcome based on power ratio
    // Parry: Strong defense (1.8x attack power or more) - Perfect deflection
    if (defensePower >= attackPower * 1.8) {
      return "parry_deflect";
    }
    // Block Success: Adequate defense (1.0x to 1.8x attack power) - Absorb impact
    else if (defensePower >= attackPower) {
      return "block_success";
    }
    // Guard Break: Defense insufficient against powerful attack (<60% of attack power)
    else if (defensePower < attackPower * 0.6) {
      return "guard_break";
    }
    // Block Success: Marginal defense (60-100% of attack power) - barely hold
    else {
      return "block_success";
    }
  }

  /**
   * Execute attack with technique
   */
  protected executeAttack(
    attacker: PlayerState,
    defender: PlayerState,
    technique: KoreanTechnique,
  ): CombatResult {
    const hitRoll = Math.random();
    const accuracy = technique.accuracy || 0.8;
    const hit = hitRoll <= accuracy;

    if (!hit) {
      return {
        hit: false,
        damage: 0,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique,
        attacker,
        defender,
        success: false,
        isCritical: false,
        isBlocked: false,
      };
    }

    // Calculate damage using the interface method
    const vitalPointHit: VitalPointHitResult = {
      hit: false,
      damage: 0,
      effects: [],
      severity: VitalPointSeverity.MINOR, // Use the enum directly
    };

    const damageResult = this.calculateDamage(
      technique,
      attacker,
      defender,
      vitalPointHit,
    );

    return {
      hit: true,
      damage: damageResult.totalDamage,
      criticalHit: Math.random() < (technique.critChance || 0.1),
      vitalPointHit: false,
      effects: damageResult.effectsApplied,
      timestamp: Date.now(),
      technique,
      attacker,
      defender,
      success: true,
      isCritical: false,
      isBlocked: false,
    };
  }

  /**
   * Fix: Add missing calculateDamage method required by interface
   */
  calculateDamage(
    technique: KoreanTechnique,
    attacker: PlayerState,
    defender: PlayerState,
    hitResult: VitalPointHitResult,
  ): {
    baseDamage: number;
    modifierDamage: number;
    totalDamage: number;
    effectsApplied: readonly StatusEffect[];
    finalDefenderState?: Partial<PlayerState>;
  } {
    // Calculate base damage from technique
    const baseDamage = technique.damage || 15;

    // Apply attacker modifiers
    const attackerBonus = attacker.attackPower * 0.1;

    // Apply vital point modifiers if hit
    let vitalPointMultiplier = 1.0;
    if (hitResult.hit && hitResult.vitalPointHit) {
      // Use the correct property name
      const severityMultipliers: Record<VitalPointSeverity, number> = {
        [VitalPointSeverity.MINOR]: 1.1,
        [VitalPointSeverity.MODERATE]: 1.3,
        [VitalPointSeverity.MAJOR]: 1.6,
        [VitalPointSeverity.CRITICAL]: 2.0,
        [VitalPointSeverity.LETHAL]: 3.0,
      };

      // Use the severity property directly
      vitalPointMultiplier = severityMultipliers[hitResult.severity] ?? 1.0;
    }

    // Calculate total modifier damage
    const modifierDamage = attackerBonus * vitalPointMultiplier;

    // Apply defense reduction
    const defenseReduction = defender.defense * 0.05;
    const totalDamage = Math.max(
      1,
      baseDamage + modifierDamage - defenseReduction,
    );

    // Combine effects from technique and vital point hit
    const effectsApplied = [...technique.effects, ...hitResult.effects];

    return {
      baseDamage,
      modifierDamage,
      totalDamage: Math.floor(totalDamage),
      effectsApplied,
      finalDefenderState: {
        health: Math.max(0, defender.health - totalDamage),
      },
    };
  }
}

/**
 * Creates a standardized CombatResult with all required fields
 * Ensures both 'critical' and 'criticalHit' are present for API compatibility
 */
export function createCombatResult(
  partialResult: Partial<CombatResult>,
): CombatResult {
  // Set default values
  const result: CombatResult = {
    success: partialResult.success ?? false,
    damage: partialResult.damage ?? 0,
    isCritical: partialResult.isCritical ?? partialResult.criticalHit ?? false,
    hit: partialResult.hit ?? partialResult.success ?? false,
    isBlocked: partialResult.isBlocked ?? false,
    vitalPointHit: partialResult.vitalPointHit ?? false,
    effects: partialResult.effects ?? [],
    attacker: partialResult.attacker,
    defender: partialResult.defender,
    technique: partialResult.technique,
    // Always set criticalHit to match critical for consistency
    criticalHit: partialResult.isCritical ?? partialResult.criticalHit ?? false,
    timestamp: Date.now(),
  };

  return result;
}

export default CombatSystem;
