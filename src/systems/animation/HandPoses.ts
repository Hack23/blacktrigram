/**
 * Hand pose definitions for Korean martial arts techniques
 * 
 * Defines authentic hand poses from Taekwondo, Hapkido, and Taekyon
 * including finger positions, wrist rotations, and striking surfaces.
 * 
 * @module systems/animation/HandPoses
 * @category Animation System
 * @korean 손자세시스템
 */

import * as THREE from "three";
import {
  HandPoseType,
} from "../../types/hand-animation";
import type {
  HandPose,
  FingerCurl,
  FingerSpread,
  HandAnimationState,
  TechniqueHandPose,
} from "../../types/hand-animation";

/**
 * Standard finger curl values for common poses
 * @korean 기본손가락구부림값
 */
const FINGER_CURL = {
  /** Fully extended fingers */
  EXTENDED: { thumb: 0.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 },
  /** Fully curled fist */
  CURLED: { thumb: 0.8, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 },
  /** Half curled (slightly bent) */
  HALF: { thumb: 0.3, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 },
  /** Relaxed natural position */
  RELAXED: { thumb: 0.2, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2 },
} as const;

/**
 * Standard finger spread values
 * @korean 기본손가락벌림값
 */
const FINGER_SPREAD = {
  /** Fingers together */
  TOGETHER: { thumbIndex: 0.0, indexMiddle: 0.0, middleRing: 0.0, ringPinky: 0.0 },
  /** Fingers naturally spread */
  NATURAL: { thumbIndex: 0.3, indexMiddle: 0.1, middleRing: 0.1, ringPinky: 0.1 },
  /** Fingers wide spread */
  WIDE: { thumbIndex: 0.8, indexMiddle: 0.4, middleRing: 0.4, ringPinky: 0.4 },
} as const;

/**
 * 주먹 (Fist) - Closed fist for punching
 * 
 * Traditional Taekwondo fist formation:
 * - All fingers tightly curled
 * - Thumb wrapped over index/middle fingers
 * - Knuckles aligned for impact
 * - Wrist straight for power transfer
 * 
 * @korean 주먹자세
 */
export const FIST_POSE: HandPose = {
  type: HandPoseType.FIST,
  nameKorean: "주먹",
  nameEnglish: "Fist",
  romanized: "Jumeok",
  fingerCurl: FINGER_CURL.CURLED,
  fingerSpread: FINGER_SPREAD.TOGETHER,
  wristRotation: new THREE.Euler(0, 0, 0),
  description: {
    korean: "태권도 기본 주먹. 손가락을 단단히 말아 쥐고 엄지는 검지와 중지 위에 감싼다.",
    english: "Traditional Taekwondo fist. Fingers tightly curled with thumb wrapped over index and middle fingers.",
  },
  martialArtOrigin: "taekwondo",
  strikingSurface: "knuckles",
};

/**
 * 수도 (Knife-Hand) - Rigid hand edge strike
 * 
 * Hapkido/Taekwondo knife-hand technique:
 * - Fingers fully extended and together
 * - Thumb tucked against palm
 * - Hand rotated edge-down (90 degrees)
 * - Rigid for chopping strikes to neck/collar
 * 
 * @korean 수도자세
 */
export const KNIFE_HAND_POSE: HandPose = {
  type: HandPoseType.KNIFE_HAND,
  nameKorean: "수도",
  nameEnglish: "Knife-Hand",
  romanized: "Sudo",
  fingerCurl: {
    thumb: 0.5, // Thumb tucked against palm
    index: 0.0,
    middle: 0.0,
    ring: 0.0,
    pinky: 0.0,
  },
  fingerSpread: FINGER_SPREAD.TOGETHER,
  wristRotation: new THREE.Euler(0, 0, -Math.PI / 2), // Edge-down rotation
  description: {
    korean: "합기도/태권도 수도치기. 손가락을 펴서 모으고 손날로 목이나 쇄골을 가격한다.",
    english: "Hapkido/Taekwondo knife-hand strike. Fingers extended together, striking with hand edge to neck or collar.",
  },
  martialArtOrigin: "hapkido",
  strikingSurface: "knife_edge",
};

/**
 * 관수 (Spear-Hand) - Pointed finger thrust
 * 
 * Traditional Korean spear-hand thrust:
 * - All fingers extended and pressed together
 * - Thumb extended alongside
 * - Fingertips form a point
 * - For precise strikes to soft targets (throat, eyes, solar plexus)
 * 
 * @korean 관수자세
 */
export const SPEAR_HAND_POSE: HandPose = {
  type: HandPoseType.SPEAR_HAND,
  nameKorean: "관수",
  nameEnglish: "Spear-Hand",
  romanized: "Gwansu",
  fingerCurl: FINGER_CURL.EXTENDED,
  fingerSpread: FINGER_SPREAD.TOGETHER,
  wristRotation: new THREE.Euler(0, 0, 0),
  description: {
    korean: "전통 한국 무술 관수. 손가락을 펴서 모아 뾰족하게 만들어 목구멍, 눈, 명치 등을 찌른다.",
    english: "Traditional Korean spear-hand. Fingers extended together forming a point for precise strikes to throat, eyes, solar plexus.",
  },
  martialArtOrigin: "traditional",
  strikingSurface: "fingertips",
};

/**
 * 장력 (Palm-Heel) - Palm-heel strike
 * 
 * Taekwondo palm-heel strike:
 * - Fingers curled back (not tightly)
 * - Wrist extended back
 * - Palm heel exposed for striking
 * - For powerful upward strikes to chin/jaw
 * 
 * @korean 장력자세
 */
export const PALM_HEEL_POSE: HandPose = {
  type: HandPoseType.PALM_HEEL,
  nameKorean: "장력",
  nameEnglish: "Palm-Heel",
  romanized: "Jangryeok",
  fingerCurl: FINGER_CURL.HALF,
  fingerSpread: FINGER_SPREAD.NATURAL,
  wristRotation: new THREE.Euler(-0.3, 0, 0), // Wrist extended back
  description: {
    korean: "태권도 장력치기. 손가락을 약간 구부리고 손목을 꺾어 손바닥 아래쪽으로 턱이나 명치를 가격한다.",
    english: "Taekwondo palm-heel strike. Fingers slightly curled, wrist extended back, striking with palm heel to chin or solar plexus.",
  },
  martialArtOrigin: "taekwondo",
  strikingSurface: "palm_heel",
};

/**
 * 잡기 (Grappling) - Grasping hand
 * 
 * Hapkido grappling hand position:
 * - Fingers curved for gripping
 * - Thumb opposed for control
 * - Natural spread for maximum grip
 * - For joint locks and throws
 * 
 * @korean 잡기자세
 */
export const GRAPPLING_POSE: HandPose = {
  type: HandPoseType.GRAPPLING,
  nameKorean: "잡기",
  nameEnglish: "Grappling",
  romanized: "Japgi",
  fingerCurl: {
    thumb: 0.6,
    index: 0.6,
    middle: 0.6,
    ring: 0.6,
    pinky: 0.6,
  },
  fingerSpread: FINGER_SPREAD.NATURAL,
  wristRotation: new THREE.Euler(0, 0, 0),
  description: {
    korean: "합기도 잡기 자세. 손가락을 자연스럽게 구부려 상대를 잡거나 관절기를 건다.",
    english: "Hapkido grappling position. Fingers naturally curved for gripping opponent or applying joint locks.",
  },
  martialArtOrigin: "hapkido",
  strikingSurface: "whole_hand",
};

/**
 * 펴기 (Open) - Neutral open hand
 * 
 * Relaxed open hand position:
 * - Fingers slightly curled (natural relaxation)
 * - Natural spread
 * - Neutral wrist
 * - Default/idle position
 * 
 * @korean 펴기자세
 */
export const OPEN_POSE: HandPose = {
  type: HandPoseType.OPEN,
  nameKorean: "펴기",
  nameEnglish: "Open",
  romanized: "Pyeogi",
  fingerCurl: FINGER_CURL.RELAXED,
  fingerSpread: FINGER_SPREAD.NATURAL,
  wristRotation: new THREE.Euler(0, 0, 0),
  description: {
    korean: "자연스러운 열린 손. 휴식이나 기본 자세에서 사용한다.",
    english: "Natural open hand. Used in idle or default position.",
  },
  martialArtOrigin: "traditional",
  strikingSurface: "whole_hand",
};

/**
 * All hand poses indexed by type
 * @korean 모든손자세맵
 */
export const HAND_POSES: Record<HandPoseType, HandPose> = {
  [HandPoseType.FIST]: FIST_POSE,
  [HandPoseType.KNIFE_HAND]: KNIFE_HAND_POSE,
  [HandPoseType.SPEAR_HAND]: SPEAR_HAND_POSE,
  [HandPoseType.PALM_HEEL]: PALM_HEEL_POSE,
  [HandPoseType.GRAPPLING]: GRAPPLING_POSE,
  [HandPoseType.OPEN]: OPEN_POSE,
};

/**
 * Get hand pose by type
 * 
 * @param poseType - Hand pose type
 * @returns Hand pose configuration
 * @korean 손자세가져오기
 */
export const getHandPose = (poseType: HandPoseType): HandPose => {
  return HAND_POSES[poseType];
};

/**
 * Technique to hand pose mappings
 * 
 * Maps attack technique names to appropriate hand poses for both hands.
 * 
 * @korean 기술손자세매핑
 */
export const TECHNIQUE_HAND_POSES: Record<string, TechniqueHandPose> = {
  idle: {
    techniqueName: "idle",
    leftHandPose: HandPoseType.OPEN,
    rightHandPose: HandPoseType.OPEN,
    transitionDuration: 0.3,
  },
  jab: {
    techniqueName: "jab",
    leftHandPose: HandPoseType.FIST,
    rightHandPose: HandPoseType.FIST,
    transitionDuration: 0.1,
  },
  cross: {
    techniqueName: "cross",
    leftHandPose: HandPoseType.FIST,
    rightHandPose: HandPoseType.FIST,
    transitionDuration: 0.1,
  },
  hook: {
    techniqueName: "hook",
    leftHandPose: HandPoseType.FIST,
    rightHandPose: HandPoseType.FIST,
    transitionDuration: 0.1,
  },
  uppercut: {
    techniqueName: "uppercut",
    leftHandPose: HandPoseType.FIST,
    rightHandPose: HandPoseType.FIST,
    transitionDuration: 0.1,
  },
  knife_hand_strike: {
    techniqueName: "knife_hand_strike",
    leftHandPose: HandPoseType.KNIFE_HAND,
    rightHandPose: HandPoseType.OPEN,
    transitionDuration: 0.15,
  },
  spear_hand_thrust: {
    techniqueName: "spear_hand_thrust",
    leftHandPose: HandPoseType.SPEAR_HAND,
    rightHandPose: HandPoseType.OPEN,
    transitionDuration: 0.15,
  },
  palm_heel_strike: {
    techniqueName: "palm_heel_strike",
    leftHandPose: HandPoseType.PALM_HEEL,
    rightHandPose: HandPoseType.OPEN,
    transitionDuration: 0.12,
  },
  grab: {
    techniqueName: "grab",
    leftHandPose: HandPoseType.GRAPPLING,
    rightHandPose: HandPoseType.GRAPPLING,
    transitionDuration: 0.2,
  },
  block: {
    techniqueName: "block",
    leftHandPose: HandPoseType.OPEN,
    rightHandPose: HandPoseType.OPEN,
    transitionDuration: 0.1,
  },
};

/**
 * Get hand pose configuration for a technique
 * 
 * @param techniqueName - Technique identifier
 * @returns Hand pose configuration for both hands, or default open pose
 * @korean 기술손자세가져오기
 */
export const getTechniqueHandPose = (
  techniqueName: string
): TechniqueHandPose => {
  return (
    TECHNIQUE_HAND_POSES[techniqueName] ?? {
      techniqueName,
      leftHandPose: HandPoseType.OPEN,
      rightHandPose: HandPoseType.OPEN,
      transitionDuration: 0.3,
    }
  );
};

/**
 * Interpolate between two finger curl configurations
 * 
 * @param from - Starting finger curl
 * @param to - Target finger curl
 * @param progress - Interpolation progress (0-1)
 * @returns Interpolated finger curl
 * @korean 손가락구부림보간
 */
export const interpolateFingerCurl = (
  from: FingerCurl,
  to: FingerCurl,
  progress: number
): FingerCurl => {
  const t = Math.max(0, Math.min(1, progress)); // Clamp to [0, 1]
  return {
    thumb: from.thumb + (to.thumb - from.thumb) * t,
    index: from.index + (to.index - from.index) * t,
    middle: from.middle + (to.middle - from.middle) * t,
    ring: from.ring + (to.ring - from.ring) * t,
    pinky: from.pinky + (to.pinky - from.pinky) * t,
  };
};

/**
 * Interpolate between two finger spread configurations
 * 
 * @param from - Starting finger spread
 * @param to - Target finger spread
 * @param progress - Interpolation progress (0-1)
 * @returns Interpolated finger spread
 * @korean 손가락벌림보간
 */
export const interpolateFingerSpread = (
  from: FingerSpread,
  to: FingerSpread,
  progress: number
): FingerSpread => {
  const t = Math.max(0, Math.min(1, progress));
  return {
    thumbIndex: from.thumbIndex + (to.thumbIndex - from.thumbIndex) * t,
    indexMiddle: from.indexMiddle + (to.indexMiddle - from.indexMiddle) * t,
    middleRing: from.middleRing + (to.middleRing - from.middleRing) * t,
    ringPinky: from.ringPinky + (to.ringPinky - from.ringPinky) * t,
  };
};

/**
 * Interpolate between two wrist rotations
 * 
 * @param from - Starting wrist rotation
 * @param to - Target wrist rotation
 * @param progress - Interpolation progress (0-1)
 * @returns Interpolated wrist rotation
 * @korean 손목회전보간
 */
export const interpolateWristRotation = (
  from: THREE.Euler,
  to: THREE.Euler,
  progress: number
): THREE.Euler => {
  const t = Math.max(0, Math.min(1, progress));
  return new THREE.Euler(
    from.x + (to.x - from.x) * t,
    from.y + (to.y - from.y) * t,
    from.z + (to.z - from.z) * t,
    from.order
  );
};

/**
 * Create initial hand animation state
 * 
 * @param initialPose - Starting hand pose
 * @returns Initial hand animation state
 * @korean 손애니메이션상태초기화
 */
export const createInitialHandAnimationState = (
  initialPose: HandPoseType = HandPoseType.OPEN
): HandAnimationState => {
  const pose = getHandPose(initialPose);
  return {
    currentPose: initialPose,
    targetPose: null,
    transitionProgress: 1.0, // Fully transitioned to current pose
    currentFingerCurl: pose.fingerCurl,
    currentFingerSpread: pose.fingerSpread,
    currentWristRotation: pose.wristRotation.clone(),
    isHighlighted: false,
    highlightMode: null,
  };
};

/**
 * Update hand animation state with transition
 * 
 * @param state - Current hand animation state
 * @param targetPose - Target hand pose to transition to
 * @param deltaTime - Time since last update (seconds)
 * @param transitionDuration - Total transition duration (seconds)
 * @returns Updated hand animation state
 * @korean 손애니메이션상태업데이트
 */
export const updateHandAnimationState = (
  state: HandAnimationState,
  targetPose: HandPoseType | null,
  deltaTime: number,
  transitionDuration: number = 0.2
): HandAnimationState => {
  // No transition needed
  if (targetPose === null || targetPose === state.currentPose) {
    return {
      ...state,
      targetPose: null,
      transitionProgress: 1.0,
    };
  }

  // Start new transition when target pose changes
  if (state.targetPose !== targetPose) {
    // Compute initial progress so we begin interpolating immediately
    const initialProgress = Math.min(1.0, deltaTime / transitionDuration);

    // Use the current interpolated state as the "from" pose for smoother continuity.
    // Fallback to the canonical currentPose definition if current* values are not set.
    const currentPoseDefinition = getHandPose(state.currentPose);
    const fromFingerCurl =
      state.currentFingerCurl ?? currentPoseDefinition.fingerCurl;
    const fromFingerSpread =
      state.currentFingerSpread ?? currentPoseDefinition.fingerSpread;
    const fromWristRotation =
      state.currentWristRotation ?? currentPoseDefinition.wristRotation;

    const toPose = getHandPose(targetPose);

    const newFingerCurl = interpolateFingerCurl(
      fromFingerCurl,
      toPose.fingerCurl,
      initialProgress
    );
    const newFingerSpread = interpolateFingerSpread(
      fromFingerSpread,
      toPose.fingerSpread,
      initialProgress
    );
    const newWristRotation = interpolateWristRotation(
      fromWristRotation,
      toPose.wristRotation,
      initialProgress
    );

    return {
      ...state,
      targetPose,
      transitionProgress: initialProgress,
      currentFingerCurl: newFingerCurl,
      currentFingerSpread: newFingerSpread,
      currentWristRotation: newWristRotation,
    };
  }

  // Continue existing transition
  const newProgress = Math.min(
    1.0,
    state.transitionProgress + deltaTime / transitionDuration
  );

  // Get poses for interpolation
  const fromPose = getHandPose(state.currentPose);
  const toPose = getHandPose(targetPose);

  // Interpolate values
  const newFingerCurl = interpolateFingerCurl(
    fromPose.fingerCurl,
    toPose.fingerCurl,
    newProgress
  );
  const newFingerSpread = interpolateFingerSpread(
    fromPose.fingerSpread,
    toPose.fingerSpread,
    newProgress
  );
  const newWristRotation = interpolateWristRotation(
    fromPose.wristRotation,
    toPose.wristRotation,
    newProgress
  );

  // Check if transition is complete
  if (newProgress >= 1.0) {
    return {
      ...state,
      currentPose: targetPose,
      targetPose: null,
      transitionProgress: 1.0,
      currentFingerCurl: toPose.fingerCurl,
      currentFingerSpread: toPose.fingerSpread,
      currentWristRotation: toPose.wristRotation.clone(),
    };
  }

  return {
    ...state,
    transitionProgress: newProgress,
    currentFingerCurl: newFingerCurl,
    currentFingerSpread: newFingerSpread,
    currentWristRotation: newWristRotation,
  };
};

/**
 * Set hand highlight mode for vital point targeting
 * 
 * @param state - Current hand animation state
 * @param isHighlighted - Whether hand is highlighted
 * @param mode - Highlight mode for striking surface
 * @returns Updated hand animation state
 * @korean 손표시설정
 */
export const setHandHighlight = (
  state: HandAnimationState,
  isHighlighted: boolean,
  mode: HandAnimationState["highlightMode"] = null
): HandAnimationState => {
  return {
    ...state,
    isHighlighted,
    highlightMode: isHighlighted ? mode : null,
  };
};
