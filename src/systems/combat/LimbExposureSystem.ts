/**
 * Limb Exposure System for Counter-Attack Detection
 *
 * **Korean**: 사지 노출 시스템 (Saji Nochul System)
 *
 * Analyzes technique animations to determine when limbs become exposed and vulnerable
 * during attack execution. This enables:
 * - Defensive counter-attacks (반격 - banggyeok)
 * - Breaking techniques (파쇄기 - paswaegi)
 * - Exploiting overextension (과다신장 약점 - gwada sinjang yakjeom)
 *
 * **Martial Arts Philosophy**:
 * - **허점공격** (Heojeom Gonggyeok) - Attacking openings/weaknesses
 * - **후수필승** (Husu Pilseung) - Victory through counter-attack timing
 * - **이순응변** (Isun Eungbyeon) - Adapt and exploit opponent's mistakes
 *
 * @module systems/combat/LimbExposureSystem
 * @korean 사지노출시스템
 */

import type { KoreanTechnique } from "../vitalpoint/types";
import type {
  BreakingResult,
  BreakingTarget,
  CounterOpportunity,
  ExposedLimbType,
  LimbExposureWindow,
  PhysicalReachConfig,
} from "../../types/physics";

/**
 * Breaking technique constants
 * **Korean**: 파쇄기술 상수
 */

/**
 * Minimum effective force required to successfully execute a breaking technique.
 * Force below this threshold will not break joints/bones.
 * Typical damage values range from 20-80, with 40 being the minimum for effective breaks.
 * @korean 파쇄최소힘
 */
const BREAKING_FORCE_THRESHOLD = 40;

/**
 * Maximum effective force for calculating break severity on 0-1 scale.
 * Force values above 80 are clamped to 1.0 severity (complete break).
 * @korean 파쇄최대힘
 */
const BREAKING_MAX_FORCE = 80;

/**
 * Maximum range in meters for executing counter-attacks.
 * Counter-attacks are close-range defensive techniques requiring proximity.
 * @korean 반격최대거리
 */
const MAX_COUNTER_RANGE_METERS = 1.0;

/**
 * Calculate counter-attack opportunities from a technique's reach configuration.
 *
 * **Korean**: 반격 기회 계산
 *
 * Analyzes the technique's execution timeline and limb exposure to identify
 * windows where the opponent is vulnerable to counter-attacks.
 *
 * @param technique - The technique being executed
 * @param currentTime - Current time in technique execution (ms)
 * @returns Counter opportunity if one exists, undefined otherwise
 *
 * @public
 * @korean 반격기회계산
 */
export function calculateCounterOpportunity(
  technique: KoreanTechnique,
  currentTime: number
): CounterOpportunity | undefined {
  const { reachConfig, executionTime } = technique;

  // No exposure window defined, no counter opportunity
  if (!reachConfig.exposureWindow) {
    return undefined;
  }

  const exposure = reachConfig.exposureWindow;

  // Calculate absolute timing of exposure window
  const windowStart = executionTime * exposure.startTime;
  const windowEnd = windowStart + exposure.duration;

  // Check if current time is within the exposure window
  if (currentTime < windowStart || currentTime > windowEnd) {
    return undefined;
  }

  // Determine recommended counter techniques based on exposed limb
  const recommendedCounters = getRecommendedCounters(
    exposure.exposedLimb,
    reachConfig,
    exposure.allowsBreaking
  );

  return {
    exposedLimb: exposure.exposedLimb,
    windowStart,
    windowDuration: exposure.duration,
    vulnerabilityMultiplier: exposure.vulnerabilityMultiplier,
    allowsBreaking: exposure.allowsBreaking,
    recommendedCounters,
  };
}

/**
 * Get recommended counter-technique IDs for an exposed limb.
 *
 * **Korean**: 추천 반격 기술 조회
 *
 * Returns technique IDs that would be effective against the exposed limb.
 * These IDs are string-based and should match techniques in the game's
 * technique library. When implementing, validate these IDs exist.
 *
 * **Note**: These are example/placeholder IDs. Actual implementation should
 * reference real technique definitions or use a typed enum of technique IDs.
 *
 * @param exposedLimb - The limb that is exposed
 * @param reachConfig - Reach configuration of the attacking technique
 * @param allowsBreaking - Whether breaking techniques are viable
 * @returns Array of recommended counter-technique IDs (unvalidated strings)
 *
 * @internal
 * @korean 추천반격기술조회
 */
function getRecommendedCounters(
  exposedLimb: ExposedLimbType,
  reachConfig: PhysicalReachConfig,
  allowsBreaking: boolean
): readonly string[] {
  const counters: string[] = [];

  // Breaking techniques for overextended limbs
  if (allowsBreaking) {
    if (exposedLimb.includes("leg") || exposedLimb.includes("ankle")) {
      counters.push("leg_sweep", "ankle_break", "knee_stomp");
    } else if (exposedLimb.includes("knee")) {
      counters.push("knee_break", "hyperextension_kick");
    } else if (exposedLimb.includes("arm") || exposedLimb.includes("elbow")) {
      counters.push("arm_bar", "elbow_break", "joint_lock");
    } else if (exposedLimb.includes("wrist")) {
      counters.push("wrist_lock", "wrist_break");
    }
  }

  // Vital point strikes on exposed limbs
  if (exposedLimb.includes("arm")) {
    counters.push("ulnar_nerve_strike", "radial_nerve_pressure");
  } else if (exposedLimb.includes("leg")) {
    counters.push("peroneal_nerve_strike", "thigh_pressure_point");
  }

  // Counter-strikes based on body part type
  if (reachConfig.bodyPart === "leg") {
    counters.push("leg_parry_counter", "inside_leg_kick");
  } else if (reachConfig.bodyPart === "arm") {
    counters.push("arm_trap_counter", "redirect_punch");
  }

  return counters;
}

/**
 * Calculate vulnerability multiplier for a technique at a specific time.
 *
 * **Korean**: 취약성 배수 계산
 *
 * Determines how vulnerable the attacker is at a given point in their
 * technique execution. Useful for damage calculation during counter-attacks.
 *
 * @param technique - The technique being executed
 * @param currentTime - Current time in technique execution (ms)
 * @returns Vulnerability multiplier (1.0 = normal, >1.0 = more vulnerable)
 *
 * @public
 * @korean 취약성배수계산
 */
export function calculateVulnerabilityMultiplier(
  technique: KoreanTechnique,
  currentTime: number
): number {
  const { reachConfig, executionTime, recoveryTime } = technique;

  // No exposure window, return baseline vulnerability
  if (!reachConfig.exposureWindow) {
    return 1.0;
  }

  const exposure = reachConfig.exposureWindow;
  const windowStart = executionTime * exposure.startTime;
  const windowEnd = windowStart + exposure.duration;

  // Before exposure window: slight vulnerability during wind-up
  if (currentTime < windowStart) {
    return 1.1;
  }

  // Within exposure window: maximum vulnerability
  if (currentTime <= windowEnd) {
    return exposure.vulnerabilityMultiplier;
  }

  // Recovery phase: moderate vulnerability
  const recoveryStart = executionTime;
  const recoveryEnd = executionTime + recoveryTime;
  if (currentTime > recoveryStart && currentTime <= recoveryEnd) {
    const recoveryProgress = (currentTime - recoveryStart) / recoveryTime;
    // Linearly decrease from max vulnerability to baseline
    return (
      exposure.vulnerabilityMultiplier -
      (exposure.vulnerabilityMultiplier - 1.0) * recoveryProgress
    );
  }

  // After recovery: baseline vulnerability
  return 1.0;
}

/**
 * Determine which limb is exposed based on technique and animation state.
 *
 * **Korean**: 노출된 사지 결정
 *
 * Analyzes the technique's body part and animation to determine which
 * specific limb (left/right) is currently exposed.
 *
 * @param technique - The technique being executed
 * @param isLeftSided - Whether the technique uses the left side
 * @returns The exposed limb type
 *
 * @public
 * @korean 노출사지결정
 */
export function determineExposedLimb(
  technique: KoreanTechnique,
  isLeftSided: boolean = false
): ExposedLimbType {
  const { reachConfig } = technique;

  // If exposure window explicitly defines the limb, use it
  if (reachConfig.exposureWindow?.exposedLimb) {
    return reachConfig.exposureWindow.exposedLimb;
  }

  // Otherwise, infer from body part and sidedness
  const side = isLeftSided ? "left" : "right";

  switch (reachConfig.bodyPart) {
    case "arm":
      // Determine joint based on reach extension
      if (reachConfig.baseExtension > 0.8) {
        return `${side}_arm` as ExposedLimbType;
      } else if (reachConfig.baseExtension > 0.5) {
        return `${side}_elbow` as ExposedLimbType;
      } else {
        return `${side}_wrist` as ExposedLimbType;
      }

    case "leg":
      // Kicks expose different parts based on extension
      if (reachConfig.baseExtension > 1.0) {
        return `${side}_leg` as ExposedLimbType;
      } else if (reachConfig.baseExtension > 0.7) {
        return `${side}_knee` as ExposedLimbType;
      } else {
        return `${side}_ankle` as ExposedLimbType;
      }

    case "torso":
      // Torso techniques typically expose arms
      return `${side}_arm` as ExposedLimbType;

    default:
      return "right_arm";
  }
}

/**
 * Map exposed limb to breaking technique target.
 *
 * **Korean**: 노출 사지를 파쇄 목표로 매핑
 *
 * Converts an exposed limb type to the appropriate breaking target
 * for joint and limb breaking techniques.
 *
 * @param exposedLimb - The exposed limb
 * @returns The breaking target joint/bone
 *
 * @public
 * @korean 파쇄목표매핑
 */
export function mapLimbToBreakingTarget(
  exposedLimb: ExposedLimbType
): BreakingTarget {
  if (exposedLimb.includes("ankle")) return "ankle";
  if (exposedLimb.includes("knee")) return "knee";
  if (exposedLimb.includes("elbow")) return "elbow";
  if (exposedLimb.includes("wrist")) return "wrist";

  // Default mapping for general limbs
  if (exposedLimb.includes("leg")) return "knee";
  if (exposedLimb.includes("arm")) return "elbow";

  return "elbow"; // Default fallback
}

/**
 * Calculate breaking technique effectiveness.
 *
 * **Korean**: 파쇄 기술 효과 계산
 *
 * Determines the result of a breaking technique applied to an exposed limb,
 * considering the vulnerability window, force applied, and target joint.
 *
 * @param breakingTechnique - The breaking technique being applied (reserved for future use)
 * @param counterOpportunity - The counter opportunity being exploited
 * @param force - Force/damage of the breaking technique (typically 20-80 range)
 * @returns Result of the breaking attempt
 *
 * @remarks
 * The breakingTechnique parameter is currently unused but reserved for future
 * extensibility. It may be used to apply technique-specific modifiers or
 * validate technique compatibility with the breaking target.
 *
 * @public
 * @korean 파쇄기술효과계산
 */
export function calculateBreakingResult(
  breakingTechnique: KoreanTechnique,
  counterOpportunity: CounterOpportunity,
  force: number
): BreakingResult {
  // Note: breakingTechnique parameter reserved for future use
  // (e.g., technique-specific breaking modifiers)
  void breakingTechnique;
  const target = mapLimbToBreakingTarget(counterOpportunity.exposedLimb);

  // Breaking only works during valid windows
  if (!counterOpportunity.allowsBreaking) {
    return {
      success: false,
      target,
      severity: 0,
      damage: force * 0.5, // Reduced damage without breaking
      mobilityReduction: 0,
      statusEffects: [],
    };
  }

  // Calculate breaking severity based on force and vulnerability
  const effectiveForce = force * counterOpportunity.vulnerabilityMultiplier;
  const baseSuccess = effectiveForce > BREAKING_FORCE_THRESHOLD;
  const severity = Math.min(effectiveForce / BREAKING_MAX_FORCE, 1.0);

  if (!baseSuccess) {
    return {
      success: false,
      target,
      severity: 0,
      damage: effectiveForce * 0.7,
      mobilityReduction: 0,
      statusEffects: [],
    };
  }

  // Successful break - apply appropriate effects
  // Note: Status effect IDs must match those defined in the StatusEffect system
  // See src/systems/types.ts for available status effects
  const statusEffects: string[] = ["pain"];
  let mobilityReduction: number;

  // Severity-based effects
  if (severity > 0.8) {
    // Severe break - dislocation or fracture
    statusEffects.push("severe_injury", "disabled_limb");
    mobilityReduction = 0.6;

    if (target === "ankle" || target === "knee") {
      statusEffects.push("impaired_mobility");
      mobilityReduction = 0.8; // Leg breaks severely impact movement
    }
  } else if (severity > 0.5) {
    // Moderate break
    statusEffects.push("injured_limb");
    mobilityReduction = 0.4;
  } else {
    // Minor break - sprain or strain
    statusEffects.push("sprained_joint");
    mobilityReduction = 0.2;
  }

  // Bleeding for bone breaks
  if (severity > 0.6) {
    statusEffects.push("bleeding");
  }

  return {
    success: true,
    target,
    severity,
    damage: effectiveForce,
    mobilityReduction,
    statusEffects,
  };
}

/**
 * Check if a defender can execute a counter-attack.
 *
 * **Korean**: 반격 실행 가능 여부 확인
 *
 * Validates whether a defender is in position and has the resources
 * to execute a counter-attack against an exposed limb.
 *
 * @param defenderStamina - Defender's current stamina
 * @param counterTechnique - The counter technique to execute
 * @param distance - Distance between attacker and defender (meters)
 * @returns Whether the counter can be executed
 *
 * @public
 * @korean 반격실행가능확인
 */
export function canExecuteCounter(
  defenderStamina: number,
  counterTechnique: KoreanTechnique,
  distance: number
): boolean {
  // Check stamina requirement
  if (defenderStamina < counterTechnique.staminaCost) {
    return false;
  }

  // Counter must be executable at current distance
  if (distance > MAX_COUNTER_RANGE_METERS) {
    return false;
  }

  return true;
}

/**
 * Generate limb exposure window for a technique.
 *
 * **Korean**: 사지 노출 시간 생성
 *
 * Creates a default limb exposure window for techniques that don't
 * explicitly define one, based on heuristics from the technique type
 * and reach configuration.
 *
 * @param technique - The technique to generate exposure for
 * @returns Generated limb exposure window
 *
 * @public
 * @korean 사지노출시간생성
 */
export function generateLimbExposureWindow(
  technique: KoreanTechnique
): LimbExposureWindow {
  const { reachConfig, executionTime } = technique;
  const exposedLimb = determineExposedLimb(technique);

  // High extension = high vulnerability
  const isHighExtension = reachConfig.baseExtension > 1.0;
  const isMediumExtension = reachConfig.baseExtension > 0.8;

  // Determine vulnerability based on extension
  let vulnerabilityMultiplier: number;
  let allowsBreaking: boolean;

  if (isHighExtension) {
    vulnerabilityMultiplier = 2.2; // Very vulnerable
    allowsBreaking = true;
  } else if (isMediumExtension) {
    vulnerabilityMultiplier = 1.6;
    allowsBreaking = false;
  } else {
    vulnerabilityMultiplier = 1.2; // Low extension, low vulnerability
    allowsBreaking = false;
  }

  // Exposure starts during peak extension (typically 40-60% of execution)
  const startTime = 0.5;

  // Duration scales with execution time (20-40% of execution)
  const durationRatio = isHighExtension ? 0.4 : 0.25;
  const duration = Math.floor(executionTime * durationRatio);

  return {
    exposedLimb,
    startTime,
    duration,
    vulnerabilityMultiplier,
    allowsBreaking,
  };
}

export default {
  calculateCounterOpportunity,
  calculateVulnerabilityMultiplier,
  determineExposedLimb,
  mapLimbToBreakingTarget,
  calculateBreakingResult,
  canExecuteCounter,
  generateLimbExposureWindow,
};
