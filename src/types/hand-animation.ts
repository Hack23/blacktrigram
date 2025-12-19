/**
 * Hand animation types for Korean martial arts techniques
 * 
 * Defines hand poses, finger positions, and animation states for realistic
 * martial arts hand techniques including strikes, grappling, and precise
 * vital point targeting.
 * 
 * @module types/hand-animation
 * @category Type Definitions
 * @korean 손애니메이션타입
 */

import * as THREE from "three";

/**
 * Martial arts hand pose types
 * 
 * Traditional Korean martial arts hand formations:
 * - FIST (주먹): Closed fist for punching
 * - KNIFE_HAND (수도): Extended fingers, rigid hand edge for strikes
 * - SPEAR_HAND (관수): Extended fingers together, pointed thrust
 * - PALM_HEEL (장력): Palm-heel strike position with curled fingers
 * - GRAPPLING (잡기): Fingers curved for grabs and control
 * - OPEN (펴기): Neutral open hand position
 * 
 * @public
 * @korean 손자세타입
 */
export enum HandPoseType {
  /** 주먹 - Closed fist for punching */
  FIST = "fist",
  /** 수도 - Knife-hand strike with rigid edge */
  KNIFE_HAND = "knife_hand",
  /** 관수 - Spear-hand thrust with pointed fingers */
  SPEAR_HAND = "spear_hand",
  /** 장력 - Palm-heel strike with curled fingers */
  PALM_HEEL = "palm_heel",
  /** 잡기 - Grappling hand for grabs */
  GRAPPLING = "grappling",
  /** 펴기 - Open hand neutral position */
  OPEN = "open",
}

/**
 * Finger identification
 * 
 * @public
 * @korean 손가락
 */
export enum FingerType {
  /** 엄지 - Thumb */
  THUMB = "thumb",
  /** 검지 - Index finger */
  INDEX = "index",
  /** 중지 - Middle finger */
  MIDDLE = "middle",
  /** 약지 - Ring finger */
  RING = "ring",
  /** 새끼 - Pinky finger */
  PINKY = "pinky",
}

/**
 * Finger curl amount (0 = fully extended, 1 = fully curled)
 * 
 * Normalized values for finger joint angles:
 * - 0.0: Fully extended (straight)
 * - 0.5: Half curled (slightly bent)
 * - 1.0: Fully curled (tight fist)
 * 
 * @public
 * @korean 손가락구부림량
 */
export interface FingerCurl {
  /** Thumb curl amount (0-1) */
  readonly thumb: number;
  /** Index finger curl amount (0-1) */
  readonly index: number;
  /** Middle finger curl amount (0-1) */
  readonly middle: number;
  /** Ring finger curl amount (0-1) */
  readonly ring: number;
  /** Pinky finger curl amount (0-1) */
  readonly pinky: number;
}

/**
 * Finger spread amount (0 = together, 1 = spread apart)
 * 
 * Controls the lateral spacing between fingers.
 * 
 * @public
 * @korean 손가락벌림량
 */
export interface FingerSpread {
  /** Spread between thumb and index (0-1) */
  readonly thumbIndex: number;
  /** Spread between index and middle (0-1) */
  readonly indexMiddle: number;
  /** Spread between middle and ring (0-1) */
  readonly middleRing: number;
  /** Spread between ring and pinky (0-1) */
  readonly ringPinky: number;
}

/**
 * Hand pose definition for martial arts techniques
 * 
 * Complete hand configuration including finger positions and wrist rotation
 * for authentic Korean martial arts hand techniques.
 * 
 * @public
 * @korean 손자세정의
 */
export interface HandPose {
  /**
   * Pose identifier
   * @korean 자세ID
   */
  readonly type: HandPoseType;

  /**
   * Korean name for the pose
   * @korean 한글이름
   */
  readonly nameKorean: string;

  /**
   * English name for the pose
   * @korean 영어이름
   */
  readonly nameEnglish: string;

  /**
   * Romanized Korean name
   * @korean 로마자이름
   */
  readonly romanized: string;

  /**
   * Finger curl amounts (0-1 per finger)
   * @korean 손가락구부림
   */
  readonly fingerCurl: FingerCurl;

  /**
   * Finger spread amounts (0-1 between fingers)
   * @korean 손가락벌림
   */
  readonly fingerSpread: FingerSpread;

  /**
   * Wrist rotation for the technique
   * @korean 손목회전
   */
  readonly wristRotation: THREE.Euler;

  /**
   * Description of the technique
   * @korean 설명
   */
  readonly description: {
    readonly korean: string;
    readonly english: string;
  };

  /**
   * Which martial art this pose comes from
   * @korean 무술출처
   */
  readonly martialArtOrigin: "taekwondo" | "hapkido" | "taekyon" | "traditional";

  /**
   * Primary striking surface
   * @korean 타격면
   */
  readonly strikingSurface:
    | "knuckles"
    | "palm_heel"
    | "knife_edge"
    | "fingertips"
    | "whole_hand";
}

/**
 * Hand animation state
 * 
 * Current state of hand animation including pose transition progress.
 * 
 * @public
 * @korean 손애니메이션상태
 */
export interface HandAnimationState {
  /**
   * Current hand pose
   * @korean 현재자세
   */
  readonly currentPose: HandPoseType;

  /**
   * Target hand pose (during transition)
   * @korean 목표자세
   */
  readonly targetPose: HandPoseType | null;

  /**
   * Transition progress (0-1)
   * @korean 전환진행률
   */
  readonly transitionProgress: number;

  /**
   * Current finger curl values (interpolated)
   * @korean 현재손가락구부림
   */
  readonly currentFingerCurl: FingerCurl;

  /**
   * Current finger spread values (interpolated)
   * @korean 현재손가락벌림
   */
  readonly currentFingerSpread: FingerSpread;

  /**
   * Current wrist rotation (interpolated)
   * @korean 현재손목회전
   */
  readonly currentWristRotation: THREE.Euler;

  /**
   * Whether hand is highlighted for vital point targeting
   * @korean 급소표시여부
   */
  readonly isHighlighted: boolean;

  /**
   * Highlight mode for different striking surfaces
   * @korean 표시모드
   */
  readonly highlightMode:
    | "none"
    | "knuckles"
    | "palm"
    | "knife_edge"
    | "fingertips"
    | null;
}

/**
 * Hand side identification
 * 
 * @public
 * @korean 손쪽
 */
export type HandSide = "left" | "right";

/**
 * Hand pose configuration for attack techniques
 * 
 * Maps attack technique names to appropriate hand poses.
 * 
 * @public
 * @korean 공격기술손자세
 */
export interface TechniqueHandPose {
  /**
   * Technique name (e.g., "jab", "cross", "knife_hand_strike")
   * @korean 기술이름
   */
  readonly techniqueName: string;

  /**
   * Hand pose for left hand
   * @korean 왼손자세
   */
  readonly leftHandPose: HandPoseType;

  /**
   * Hand pose for right hand
   * @korean 오른손자세
   */
  readonly rightHandPose: HandPoseType;

  /**
   * Transition duration in seconds
   * @korean 전환시간
   */
  readonly transitionDuration: number;
}

/**
 * Hand level of detail (LOD) settings
 * 
 * Performance optimization by adjusting hand detail based on camera distance.
 * 
 * @public
 * @korean 손상세도설정
 */
export interface HandLODConfig {
  /**
   * Detail level
   * - high: Full finger geometry (4 bones per finger)
   * - medium: Simplified fingers (3 bones per finger)
   * - low: No finger detail (hand as single unit)
   * @korean 상세도
   */
  readonly detailLevel: "high" | "medium" | "low";

  /**
   * Distance thresholds for LOD switching
   * @korean 거리기준
   */
  readonly distanceThresholds: {
    readonly high: number; // Camera distance for high detail (< 5 units)
    readonly medium: number; // Camera distance for medium detail (< 15 units)
    readonly low: number; // Camera distance for low detail (>= 15 units)
  };

  /**
   * Whether to render individual fingers
   * @korean 손가락렌더링여부
   */
  readonly renderFingers: boolean;

  /**
   * Number of segments per finger
   * @korean 손가락세그먼트수
   */
  readonly fingerSegments: number;
}

/**
 * Finger bone segments
 * 
 * Anatomically correct finger bone structure:
 * - Metacarpal: Knuckle base (hand to finger connection)
 * - Proximal: First joint (knuckle joint)
 * - Intermediate: Middle joint
 * - Distal: Fingertip
 * 
 * Note: Thumb has no intermediate phalanx (2 bones instead of 3)
 * 
 * @public
 * @korean 손가락뼈세그먼트
 */
export interface FingerSegments {
  /**
   * Metacarpal bone (knuckle base)
   * @korean 중수골
   */
  readonly metacarpal: THREE.Vector3;

  /**
   * Proximal phalanx (first joint)
   * @korean 근위지골
   */
  readonly proximal: THREE.Vector3;

  /**
   * Intermediate phalanx (middle joint)
   * Note: Thumb does not have this bone
   * @korean 중위지골
   */
  readonly intermediate: THREE.Vector3 | null;

  /**
   * Distal phalanx (fingertip)
   * @korean 원위지골
   */
  readonly distal: THREE.Vector3;
}

/**
 * Complete hand structure with all finger bones
 * 
 * @public
 * @korean 손뼈구조
 */
export interface HandStructure {
  /**
   * Palm base position
   * @korean 손바닥위치
   */
  readonly palm: THREE.Vector3;

  /**
   * Wrist position
   * @korean 손목위치
   */
  readonly wrist: THREE.Vector3;

  /**
   * Thumb segments (2 bones: no intermediate)
   * @korean 엄지뼈
   */
  readonly thumb: FingerSegments;

  /**
   * Index finger segments (3 bones)
   * @korean 검지뼈
   */
  readonly index: FingerSegments;

  /**
   * Middle finger segments (3 bones)
   * @korean 중지뼈
   */
  readonly middle: FingerSegments;

  /**
   * Ring finger segments (3 bones)
   * @korean 약지뼈
   */
  readonly ring: FingerSegments;

  /**
   * Pinky finger segments (3 bones)
   * @korean 새끼뼈
   */
  readonly pinky: FingerSegments;
}
