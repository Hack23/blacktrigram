/**
 * Korean Guard Positions (막기자세)
 *
 * Defines authentic Korean martial arts guard positions for all animations.
 * Guards protect vital areas and provide optimal positioning for techniques.
 *
 * Korean martial arts emphasize three primary guard levels:
 * - 상단막기 (Sangdan Makgi) - High guard protecting head
 * - 중단막기 (Jungdan Makgi) - Middle guard protecting torso
 * - 하단막기 (Hadan Makgi) - Low guard protecting lower body
 *
 * Each guard position includes:
 * - Proper shoulder and elbow angles
 * - Hand pose (주먹쥐기 - fist formation)
 * - Guard height description
 * - Korean/English terminology
 *
 * @module systems/animation/KoreanGuardPositions
 * @category Animation System
 * @korean 막기자세시스템
 */

/**
 * Guard position for a single arm
 * @korean 팔방어위치
 */
export interface GuardArmPosition {
  /** Shoulder rotation in radians (x, y, z) */
  readonly shoulder: readonly [number, number, number];
  /** Elbow rotation in radians (x, y, z) */
  readonly elbow: readonly [number, number, number];
  /** Wrist rotation in radians (x, y, z) */
  readonly wrist: readonly [number, number, number];
}

/**
 * Complete guard position configuration
 * @korean 방어자세설정
 */
export interface GuardPosition {
  /** Korean name */
  readonly korean: string;
  /** English name */
  readonly english: string;
  /** Romanization */
  readonly romanized: string;
  /** Description of guard purpose and application */
  readonly description: {
    readonly korean: string;
    readonly english: string;
  };
  /** Left arm guard position */
  readonly left: GuardArmPosition;
  /** Right arm guard position */
  readonly right: GuardArmPosition;
  /** Height level of guard */
  readonly height: "temple_level" | "chest_level" | "abdomen_level";
  /** Default hand pose for this guard */
  readonly handPose: "fist_vertical" | "fist_horizontal" | "open_hand";
  /** Vital areas protected by this guard */
  readonly protects: readonly string[];
}

/**
 * Helper to convert degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 * @korean 도를라디안으로
 */
const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/**
 * 상단막기 (Sangdan Makgi) - High Guard
 *
 * Traditional Taekwondo high block position protecting head and face.
 * Both hands at temple/forehead level with elbows bent tight.
 * Fists vertical (thumb-side up) for maximum protection.
 *
 * Protects against:
 * - High strikes to head (머리 공격)
 * - Overhead attacks (위쪽 공격)
 * - Face punches (얼굴 주먹)
 *
 * Application:
 * - Default guard for Geon (Heaven) stance
 * - Used in high kicking techniques
 * - Transitional guard for head-level attacks
 *
 * Biomechanics:
 * - Shoulders raised (~15° abduction)
 * - Elbows bent ~110° (tight guard)
 * - Fists at temple level
 * - Forearms vertical for deflection
 *
 * @korean 상단막기자세
 */
export const HIGH_GUARD: GuardPosition = {
  korean: "상단막기",
  english: "High Guard",
  romanized: "Sangdan Makgi",
  description: {
    korean:
      "머리와 얼굴을 보호하는 높은 방어 자세. 주먹을 관자놀이 높이에 두고 팔꿈치를 단단히 구부림.",
    english:
      "High guard protecting head and face. Fists at temple level with elbows bent tight.",
  },
  left: {
    shoulder: [toRadians(-15), toRadians(0), toRadians(10)] as const,
    elbow: [toRadians(0), toRadians(0), toRadians(-110)] as const,
    wrist: [toRadians(0), toRadians(0), toRadians(0)] as const,
  },
  right: {
    shoulder: [toRadians(-15), toRadians(0), toRadians(-10)] as const,
    elbow: [toRadians(0), toRadians(0), toRadians(110)] as const,
    wrist: [toRadians(0), toRadians(0), toRadians(0)] as const,
  },
  height: "temple_level",
  handPose: "fist_vertical",
  protects: [
    "head",
    "temple",
    "forehead",
    "eyes",
    "nose",
    "jaw",
  ] as const,
};

/**
 * 중단막기 (Jungdan Makgi) - Middle Guard
 *
 * Standard Korean martial arts guard at chest/solar plexus level.
 * Most versatile guard position, used in most fighting stances.
 * Elbows at 90° protecting ribs and torso.
 *
 * Protects against:
 * - Body punches (몸통 주먹)
 * - Solar plexus strikes (명치 공격)
 * - Rib attacks (갈비뼈 공격)
 * - Liver strikes (간 공격)
 *
 * Application:
 * - Default guard for most stances
 * - Starting position for most techniques
 * - Balanced offensive/defensive posture
 *
 * Biomechanics:
 * - Shoulders neutral (~10° forward)
 * - Elbows bent ~90° (classic guard)
 * - Fists at chest/chin level
 * - Ready to attack or defend
 *
 * @korean 중단막기자세
 */
export const MIDDLE_GUARD: GuardPosition = {
  korean: "중단막기",
  english: "Middle Guard",
  romanized: "Jungdan Makgi",
  description: {
    korean:
      "가슴과 명치를 보호하는 중간 방어 자세. 팔꿈치를 90도 구부려 몸통을 보호함.",
    english:
      "Middle guard protecting chest and solar plexus. Elbows bent at 90° protecting torso.",
  },
  left: {
    shoulder: [toRadians(-10), toRadians(0), toRadians(8)] as const,
    elbow: [toRadians(0), toRadians(0), toRadians(-90)] as const,
    wrist: [toRadians(0), toRadians(0), toRadians(0)] as const,
  },
  right: {
    shoulder: [toRadians(-10), toRadians(0), toRadians(-8)] as const,
    elbow: [toRadians(0), toRadians(0), toRadians(90)] as const,
    wrist: [toRadians(0), toRadians(0), toRadians(0)] as const,
  },
  height: "chest_level",
  handPose: "fist_vertical",
  protects: [
    "chest",
    "solar_plexus",
    "ribs",
    "liver",
    "spleen",
    "heart",
  ] as const,
};

/**
 * 하단막기 (Hadan Makgi) - Low Guard
 *
 * Low guard position protecting lower body and groin.
 * Used in grappling and ground-fighting scenarios.
 * Hands at abdomen/hip level ready for low attacks.
 *
 * Protects against:
 * - Low kicks (낮은 발차기)
 * - Body kicks (몸통 발차기)
 * - Groin attacks (낭심 공격)
 * - Takedown attempts (넘어뜨리기)
 *
 * Application:
 * - Default for Gon (Earth) stance
 * - Grappling and clinch range
 * - Defense against low attacks
 *
 * Biomechanics:
 * - Shoulders forward (~20° flexion)
 * - Elbows bent ~70° (wider guard)
 * - Fists at abdomen/hip level
 * - Ready to sprawl or clinch
 *
 * @korean 하단막기자세
 */
export const LOW_GUARD: GuardPosition = {
  korean: "하단막기",
  english: "Low Guard",
  romanized: "Hadan Makgi",
  description: {
    korean:
      "하복부와 낭심을 보호하는 낮은 방어 자세. 손을 배 높이에 두고 낮은 공격에 대비함.",
    english:
      "Low guard protecting lower body and groin. Hands at abdomen level ready for low attacks.",
  },
  left: {
    shoulder: [toRadians(20), toRadians(0), toRadians(10)] as const,
    elbow: [toRadians(0), toRadians(0), toRadians(-70)] as const,
    wrist: [toRadians(0), toRadians(0), toRadians(0)] as const,
  },
  right: {
    shoulder: [toRadians(20), toRadians(0), toRadians(-10)] as const,
    elbow: [toRadians(0), toRadians(0), toRadians(70)] as const,
    wrist: [toRadians(0), toRadians(0), toRadians(0)] as const,
  },
  height: "abdomen_level",
  handPose: "fist_vertical",
  protects: [
    "abdomen",
    "groin",
    "hip",
    "thigh",
    "lower_ribs",
  ] as const,
};

/**
 * All Korean guard positions indexed by name
 * @korean 모든방어자세
 */
export const KOREAN_GUARD_POSITIONS = {
  HIGH_GUARD,
  MIDDLE_GUARD,
  LOW_GUARD,
} as const;

/**
 * Guard position type
 * @korean 방어자세타입
 */
export type GuardPositionType = keyof typeof KOREAN_GUARD_POSITIONS;

/**
 * Get guard position by type
 *
 * @param type - Guard position type
 * @returns Guard position configuration
 * @korean 방어자세가져오기
 */
export const getGuardPosition = (type: GuardPositionType): GuardPosition => {
  return KOREAN_GUARD_POSITIONS[type];
};

/**
 * Get appropriate guard for stance height
 *
 * Determines which guard position is most appropriate based on
 * the stance configuration and fighting context.
 *
 * @param stanceType - Type of stance ("high" | "middle" | "low")
 * @returns Recommended guard position
 * @korean 자세높이에맞는방어자세
 */
export const getGuardForStanceHeight = (
  stanceType: "high" | "middle" | "low"
): GuardPosition => {
  switch (stanceType) {
    case "high":
      return HIGH_GUARD;
    case "low":
      return LOW_GUARD;
    case "middle":
    default:
      return MIDDLE_GUARD;
  }
};
