/**
 * ☷ 곤 (GON) - Earth Stance Technique Extensions
 * Gon-specific metadata for authentic Ssireum/Hapkido grappling mechanics
 *
 * Extends base TrigramStanceTechnique with Earth-specific properties:
 * - Throw trajectory mechanics (던지기 궤적)
 * - Ground impact multipliers (지면 충격 배수)
 * - Grappling control duration (잡기 제어 시간)
 * - Supportive healing (대지 치유)
 * - Earth visual effects (대지 시각 효과)
 *
 * Based on authentic Korean martial arts:
 * - Ssireum (씨름) - Traditional Korean wrestling
 * - Hapkido (합기도) - Joint locks and throws
 *
 * @module GonTechniqueExtensions
 * @korean 곤괘기술확장
 */

import type { TrigramStanceTechnique } from "@/systems/vitalpoint";

/**
 * Throw trajectory types for Gon techniques
 * 던지기 궤적 유형
 *
 * Describes the physical path of the throw for animation and physics
 *
 * @korean 던지기궤적유형
 */
export type ThrowTrajectory =
  | "arc_over_hip" // 엉덩이 넘기기 - Over the hip rotation (classic Ssireum)
  | "horizontal_sweep" // 수평 쓸기 - Horizontal sweeping motion
  | "forward_drive" // 앞 밀어붙이기 - Forward driving takedown
  | "vertical_slam" // 수직 강타 - Straight down slam
  | "circular_trip" // 원형 걸기 - Circular tripping motion
  | "sacrifice_arc" // 희생 던지기 궤적 - Sacrifice throw trajectory
  | "clinch_control" // 잡기 제어 - Clinch/grip control (no throw)
  | "arc_downward" // 호 아래로 - Downward arcing throw
  | "spiral" // 나선형 - Spiral/twisting throw
  | "direct_slam"; // 직접 내리찍기 - Direct impact slam

/**
 * Takedown type classification
 * 넘어뜨리기 분류
 *
 * @korean 넘어뜨리기분류
 */
export type TakedownType =
  | "leg_reap" // 다리걸기 - Leg reaping technique
  | "hip_throw" // 엉덩이던지기 - Hip throw technique
  | "body_lock" // 몸통잡기 - Body lock takedown
  | "sacrifice" // 희생던지기 - Sacrifice throw
  | "slam" // 내리찍기 - Slam/driving technique
  | "sweep"; // 쓸기 - Sweeping technique

/**
 * Sweep direction for leg techniques
 * 쓸기 방향
 *
 * @korean 쓸기방향
 */
export type SweepDirection =
  | "inward" // 안쪽 - Inner reap (안다리걸기)
  | "outward" // 바깥쪽 - Outer reap (바깥다리걸기)
  | "backwards" // 뒤쪽 - Backwards sweep
  | "circular"; // 원형 - Circular sweep

/**
 * Ending position after throw
 * 던지기 후 위치
 *
 * @korean 던지기후위치
 */
export type EndingPosition =
  | "standing_dominant" // 서있기 우세 - Opponent down, attacker standing
  | "mount" // 기마 자세 - Top mount position
  | "side_control" // 옆 제어 - Side control position
  | "back_control" // 뒤 제어 - Back control position
  | "ground_mutual"; // 둘 다 지면 - Both fighters on ground

/**
 * Breath loss severity
 * 호흡 상실 심각도
 *
 * @korean 호흡상실심각도
 */
export type BreathLoss = "mild" | "moderate" | "severe";

/**
 * Lift height for throwing techniques
 * 들어올리기 높이
 *
 * @korean 들어올리기높이
 */
export type LiftHeight = "none" | "low" | "medium" | "high";

/**
 * Rotational power level
 * 회전력 수준
 *
 * @korean 회전력수준
 */
export type RotationalPower = "low" | "medium" | "high";

/**
 * Momentum transfer level
 * 운동량 전달 수준
 *
 * @korean 운동량전달수준
 */
export type MomentumTransfer = "low" | "medium" | "high";

/**
 * Setup speed for technique execution
 * 기술 준비 속도
 *
 * @korean 기술준비속도
 */
export type SetupSpeed = "slow" | "medium" | "fast";

/**
 * Penetration depth for stance/level change
 * 침투 깊이
 *
 * @korean 침투깊이
 */
export type PenetrationDepth = "high" | "medium" | "low";

/**
 * Extended Gon technique with Earth-specific mechanics
 * 대지 특화 기술 확장 인터페이스
 *
 * Adds authentic Ssireum/Hapkido grappling mechanics to base technique.
 * All Gon stance techniques should implement this interface.
 *
 * **Korean Martial Arts Context**:
 * - Ssireum (씨름): Traditional Korean wrestling with satba belt
 * - Hapkido (합기도): Joint locks, throws, circular motion
 *
 * **Earth Philosophy** (대지 철학):
 * "대지는 모든 것을 품고 키운다" - The earth embraces and nurtures all things
 *
 * @korean 확장곤괘기술
 */
export interface ExtendedGonTechnique extends TrigramStanceTechnique {
  // ============= CORE FIELDS (Phase 1 Implementation) =============

  /**
   * Physical trajectory path of the throw
   * 던지기 궤적
   *
   * Determines animation path and physics simulation
   *
   * @example "arc_over_hip" for traditional Ssireum throw
   * @korean 던지기궤적
   */
  throwTrajectory: ThrowTrajectory;

  /**
   * Ground impact damage multiplier (1.0-2.0 range)
   * 지면 충격 배수
   *
   * Multiplies base damage when opponent hits ground.
   * - 1.0-1.2: Low impact (controlled takedowns)
   * - 1.3-1.5: Medium impact (standard throws)
   * - 1.6-1.8: High impact (power throws)
   * - 1.9-2.0: Maximum impact (slams)
   *
   * **Formula**: `Final Damage = Base Damage × groundImpactMultiplier × (1 + strength_modifier)`
   *
   * @example 2.0 for 대지강타 (Ground Pound) - maximum impact
   * @korean 지면충격배수
   */
  groundImpactMultiplier: number;

  /**
   * Post-throw control duration in milliseconds
   * 던지기 후 제어 시간
   *
   * Duration attacker maintains positional advantage after throw.
   * Affects follow-up attack windows and defender recovery time.
   *
   * **Range**: 800ms (brief) to 2000ms (dominant)
   *
   * @example 1800 for 씨름던지기 (Ssireum Throw) - strong control
   * @korean 제어시간
   */
  controlDuration: number;

  /**
   * Earth's supportive healing value (0-10 scale)
   * 대지 치유 수치
   *
   * HP restored from earth connection during technique execution.
   * Based on Korean philosophy: earth nurtures all things.
   *
   * **Typical Range**: 1-6 for combat techniques
   * - 0-2: Minimal earth connection (aggressive)
   * - 3-4: Moderate earth connection (standard Ssireum)
   * - 5-6: Strong earth connection (traditional, sacrifice throws)
   * - 7-10: RESERVED for meditation/healing techniques
   *
   * **Formula**: `HP Restored = supportiveHealing × (1 + earth_affinity_stat)`
   *
   * @example 5 for 씨름던지기 - traditional technique bonus
   * @korean 대지치유
   */
  supportiveHealing: number;

  /**
   * Whether technique creates earth crack visual effect
   * 대지 균열 효과 여부
   *
   * If true, ground impact creates visual feedback:
   * - Earth crack patterns (Korean pottery-inspired)
   * - Dust clouds (yellow-brown 황토색)
   * - Shockwave ripples (for high impact)
   *
   * **Intensity scales with**: groundImpactMultiplier
   *
   * @example true for all throws/slams, false for clinch control
   * @korean 대지균열효과
   */
  earthCrackEffect: boolean;

  // ============= OPTIONAL ADVANCED FIELDS (Phase 3) =============

  /**
   * Requires traditional Ssireum satba belt grip
   * 샅바 잡기 필요 여부
   *
   * If true, technique uses traditional Korean wrestling belt mechanics
   *
   * @optional
   * @korean 샅바필요
   */
  satbaGripRequired?: boolean;

  /**
   * Cultural authenticity damage bonus
   * 전통 무술 보너스
   *
   * Damage multiplier for traditional Korean techniques
   * Rewards using authentic martial arts
   *
   * @example 1.15 (15% bonus) for 씨름던지기
   * @optional
   * @korean 전통보너스
   */
  traditionalBonus?: number;

  /**
   * Grip strength for escape difficulty (0-1 scale)
   * 잡기 강도
   *
   * Higher values make technique harder to escape from
   * 1.0 = unbreakable, 0.0 = no grip
   *
   * @optional
   * @korean 잡기강도
   */
  gripStrength?: number;

  /**
   * Takedown classification
   * 넘어뜨리기 유형
   *
   * @optional
   * @korean 넘어뜨리기유형
   */
  takedownType?: TakedownType;

  /**
   * Sweep direction for leg techniques
   * 쓸기 방향
   *
   * @optional
   * @korean 쓸기방향
   */
  sweepDirection?: SweepDirection;

  /**
   * Self-risk factor (0-1 scale)
   * 자기 위험도
   *
   * Chance of self-damage from technique (e.g., sacrifice throws)
   * 0.2 = 20% chance of taking damage yourself
   *
   * @optional
   * @korean 자기위험도
   */
  selfRisk?: number;

  /**
   * Counter vulnerability (0-1 scale)
   * 반격 취약성
   *
   * How easily technique can be countered during execution
   * Higher = more vulnerable to counter-attacks
   *
   * @optional
   * @korean 반격취약성
   */
  counterVulnerability?: number;

  /**
   * Positional outcome after technique
   * 기술 후 위치
   *
   * @optional
   * @korean 기술후위치
   */
  endingPosition?: EndingPosition;

  /**
   * Follow-up technique damage bonus
   * 연속 공격 보너스
   *
   * Damage multiplier for chained techniques
   *
   * @example 0.3 (30% bonus) for sacrifice throws
   * @optional
   * @korean 연속공격보너스
   */
  transitionBonus?: number;

  /**
   * Breath restriction level (0-1 scale)
   * 호흡 제한 수준
   *
   * How much technique restricts opponent's breathing
   * Used for body locks and compression techniques
   *
   * @optional
   * @korean 호흡제한
   */
  breathRestriction?: number;

  /**
   * Stun chance probability (0-1 scale)
   * 기절 확률
   *
   * Chance technique stuns opponent on impact
   *
   * @example 0.4 (40% chance) for 대지강타
   * @optional
   * @korean 기절확률
   */
  stunChance?: number;

  /**
   * Breath loss severity
   * 호흡 상실 심각도
   *
   * How severely technique "knocks the wind out"
   *
   * @optional
   * @korean 호흡상실
   */
  breathLoss?: BreathLoss;

  /**
   * Setup speed classification
   * 준비 속도
   *
   * @optional
   * @korean 준비속도
   */
  setupSpeed?: SetupSpeed;

  /**
   * Penetration depth level
   * 침투 깊이
   *
   * @optional
   * @korean 침투깊이
   */
  penetrationDepth?: PenetrationDepth;

  /**
   * Lift height before throw
   * 들어올리기 높이
   *
   * @optional
   * @korean 들어올리기높이
   */
  liftHeight?: LiftHeight;

  /**
   * Rotational power level
   * 회전력 수준
   *
   * @optional
   * @korean 회전력
   */
  rotationalPower?: RotationalPower;

  /**
   * Momentum transfer level
   * 운동량 전달
   *
   * @optional
   * @korean 운동량전달
   */
  momentumTransfer?: MomentumTransfer;
}

/**
 * Earth crack visual effect intensity
 * 대지 균열 시각 효과 강도
 *
 * @korean 대지균열강도
 */
export type EarthCrackIntensity = "none" | "small" | "medium" | "large" | "massive";

/**
 * Calculate earth crack visual intensity based on impact
 * 충격도에 따른 대지 균열 강도 계산
 *
 * @param technique - Gon technique with impact multiplier
 * @param playerStrength - Player's strength stat modifier
 * @returns Visual effect intensity level
 *
 * @korean 대지균열강도계산
 */
export function calculateEarthCrackIntensity(
  technique: Pick<ExtendedGonTechnique, "earthCrackEffect" | "groundImpactMultiplier">,
  playerStrength: number,
): EarthCrackIntensity {
  if (!technique.earthCrackEffect) return "none";

  const impactScore = technique.groundImpactMultiplier * playerStrength;

  if (impactScore < 1.3) return "small";
  if (impactScore < 1.6) return "medium";
  if (impactScore < 1.9) return "large";
  return "massive"; // 대지강타 with high strength = spectacular
}

/**
 * Type guard to check if technique is extended Gon technique
 * 확장 곤괘 기술 여부 확인
 *
 * @param technique - Technique to check
 * @returns True if technique has Gon-specific fields
 *
 * @korean 확장곤괘기술확인
 */
export function isExtendedGonTechnique(
  technique: TrigramStanceTechnique,
): technique is ExtendedGonTechnique {
  return (
    "throwTrajectory" in technique &&
    "groundImpactMultiplier" in technique &&
    "controlDuration" in technique &&
    "supportiveHealing" in technique &&
    "earthCrackEffect" in technique
  );
}

/**
 * Validate Gon technique enhancement values
 * 곤괘 기술 강화 수치 검증
 *
 * Ensures all enhancement values are within valid ranges
 *
 * @param technique - Extended Gon technique to validate
 * @returns Validation result with errors if any
 *
 * @korean 곤괘기술검증
 */
export function validateGonTechniqueEnhancements(
  technique: ExtendedGonTechnique,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate groundImpactMultiplier (1.0-2.0)
  if (
    technique.groundImpactMultiplier < 1.0 ||
    technique.groundImpactMultiplier > 2.0
  ) {
    errors.push(
      `groundImpactMultiplier must be 1.0-2.0, got ${technique.groundImpactMultiplier}`,
    );
  }

  // Validate controlDuration (800-2000ms)
  if (technique.controlDuration < 800 || technique.controlDuration > 2000) {
    errors.push(
      `controlDuration must be 800-2000ms, got ${technique.controlDuration}ms`,
    );
  }

  // Validate supportiveHealing (0-10)
  if (technique.supportiveHealing < 0 || technique.supportiveHealing > 10) {
    errors.push(
      `supportiveHealing must be 0-10, got ${technique.supportiveHealing}`,
    );
  }

  // Validate optional fields if present
  if (technique.gripStrength !== undefined) {
    if (technique.gripStrength < 0 || technique.gripStrength > 1) {
      errors.push(`gripStrength must be 0-1, got ${technique.gripStrength}`);
    }
  }

  if (technique.selfRisk !== undefined) {
    if (technique.selfRisk < 0 || technique.selfRisk > 1) {
      errors.push(`selfRisk must be 0-1, got ${technique.selfRisk}`);
    }
  }

  if (technique.traditionalBonus !== undefined) {
    if (technique.traditionalBonus < 1.0 || technique.traditionalBonus > 2.0) {
      errors.push(
        `traditionalBonus must be 1.0-2.0, got ${technique.traditionalBonus}`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Earth philosophy constants
 * 대지 철학 상수
 *
 * @korean 대지철학상수
 */
export const EARTH_PHILOSOPHY = {
  /**
   * Korean philosophy: "The earth embraces and nurtures all things"
   * 대지는 모든 것을 품고 키운다
   */
  CORE_PRINCIPLE: {
    korean: "대지는 모든 것을 품고 키운다",
    romanized: "Daeji-neun modeun geoseul pumgo kiwinda",
    english: "The earth embraces and nurtures all things",
  },

  /**
   * Grounding effect (접지 효과)
   * Physical earth contact provides regeneration
   */
  GROUNDING_EFFECT: {
    korean: "접지 효과",
    romanized: "Jeobji Hyogwa",
    english: "Grounding Effect",
  },

  /**
   * Earth's embrace (대지의 포옹)
   * Low stance connection provides stamina recovery
   */
  EARTH_EMBRACE: {
    korean: "대지의 포옹",
    romanized: "Daeji-ui Po-ong",
    english: "Earth's Embrace",
  },

  /**
   * Nurturing recovery (양육 회복)
   * Post-throw earth contact provides healing
   */
  NURTURING_RECOVERY: {
    korean: "양육 회복",
    romanized: "Yangnyuk Hoibok",
    english: "Nurturing Recovery",
  },
} as const;

/**
 * Ssireum cultural context
 * 씨름 문화 배경
 *
 * @korean 씨름문화
 */
export const SSIREUM_CONTEXT = {
  /**
   * UNESCO Intangible Cultural Heritage (2018)
   */
  UNESCO_STATUS: {
    year: 2018,
    category: "Intangible Cultural Heritage of Humanity",
  },

  /**
   * Traditional Ssireum equipment
   */
  EQUIPMENT: {
    /**
     * Satba - fabric belt wrapped around waist and thigh
     * 샅바 - 허리와 넓적다리에 감는 천 띠
     */
    SATBA: {
      korean: "샅바",
      romanized: "Satba",
      english: "Traditional wrestling belt",
      description:
        "Fabric belt wrapped around waist and right thigh for grip techniques",
    },

    /**
     * Morae-pan - sand circle arena
     * 모래판 - 모래 경기장
     */
    ARENA: {
      korean: "모래판",
      romanized: "Morae-pan",
      english: "Sand circle arena",
      diameter: "8.5m",
    },
  },

  /**
   * Key Ssireum principles
   */
  PRINCIPLES: {
    POWER_TRANSMISSION: {
      korean: "힘의 전달",
      romanized: "Him-ui Jeontal",
      english: "Power transmission through hips",
    },
    CENTER_CONTROL: {
      korean: "중심 잡기",
      romanized: "Jungsim Japgi",
      english: "Controlling opponent's center of gravity",
    },
    EARTH_CONNECTION: {
      korean: "대지와의 연결",
      romanized: "Daeji-wa-ui Yeongyeol",
      english: "Connection with earth for power",
    },
  },
} as const;
