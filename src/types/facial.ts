/**
 * Facial animation types for realistic combat emotion and damage
 * 
 * Defines facial expression system with damage tracking, eye tracking,
 * and smooth expression transitions for authentic human-like combat feedback.
 * 
 * @module types/facial
 * @category Type Definitions
 * @korean 얼굴애니메이션타입
 */

import * as THREE from "three";

/**
 * Facial expression states for combat
 * 
 * Represents emotional and physical states visible on fighter's face.
 * Each expression corresponds to specific combat situations.
 * 
 * @public
 * @category Facial Animation
 * @korean 얼굴표정
 */
export enum FacialExpression {
  /** Calm, ready state */
  NEUTRAL = "neutral",
  /** Concentrated, ready to attack */
  FOCUSED = "focused",
  /** Pain response after hit */
  PAINED = "pained",
  /** Low stamina, heavy breathing */
  EXHAUSTED = "exhausted",
  /** Brief satisfaction after successful strike */
  VICTORIOUS = "victorious",
  /** Knocked out, unconscious */
  DEFEATED = "defeated",
}

/**
 * Bilingual names for facial expressions
 * 
 * @public
 * @category Facial Animation
 * @korean 표정이름
 */
export const FACIAL_EXPRESSION_NAMES: Record<
  FacialExpression,
  { korean: string; english: string; romanized: string }
> = {
  [FacialExpression.NEUTRAL]: {
    korean: "평온",
    english: "Neutral",
    romanized: "pyeong-on",
  },
  [FacialExpression.FOCUSED]: {
    korean: "집중",
    english: "Focused",
    romanized: "jipjung",
  },
  [FacialExpression.PAINED]: {
    korean: "고통",
    english: "Pained",
    romanized: "gotong",
  },
  [FacialExpression.EXHAUSTED]: {
    korean: "지침",
    english: "Exhausted",
    romanized: "jichim",
  },
  [FacialExpression.VICTORIOUS]: {
    korean: "승리",
    english: "Victorious",
    romanized: "seungri",
  },
  [FacialExpression.DEFEATED]: {
    korean: "패배",
    english: "Defeated",
    romanized: "paebae",
  },
};

/**
 * Facial damage state tracking
 * 
 * Tracks accumulated damage to face for visual feedback.
 * Includes bruising, swelling, and bleeding effects.
 * 
 * @public
 * @category Facial Animation
 * @korean 얼굴손상상태
 */
export interface FacialDamageState {
  /** Left eye swelling (0-1, 0=none, 1=fully swollen) */
  readonly leftEyeSwelling: number;
  
  /** Right eye swelling (0-1, 0=none, 1=fully swollen) */
  readonly rightEyeSwelling: number;
  
  /** Mouth/lip bleeding intensity (0-1) */
  readonly mouthBleeding: number;
  
  /** Nose bleeding intensity (0-1) */
  readonly noseBleeding: number;
  
  /** Bruise intensity on left cheek (0-1) */
  readonly leftCheekBruise: number;
  
  /** Bruise intensity on right cheek (0-1) */
  readonly rightCheekBruise: number;
  
  /** Forehead bruise/cut intensity (0-1) */
  readonly foreheadBruise: number;
  
  /** Jaw bruise intensity (0-1) */
  readonly jawBruise: number;
  
  /** Total facial damage accumulation (0-100) */
  readonly totalFacialDamage: number;
}

/**
 * Expression state with transition timing
 * 
 * Manages current expression and smooth transition to next expression.
 * 
 * @public
 * @category Facial Animation
 * @korean 표정상태
 */
export interface ExpressionState {
  /** Current facial expression */
  readonly expression: FacialExpression;
  
  /** Expression intensity (0-1, affects degree of expression) */
  readonly intensity: number;
  
  /** Time to transition to new expression (seconds) */
  readonly transitionTime: number;
  
  /** Previous expression (for blending) */
  readonly previousExpression?: FacialExpression;
  
  /** Transition progress (0-1, 0=start, 1=complete) */
  readonly transitionProgress?: number;
}

/**
 * Eye openness values for expressions
 * 
 * @public
 * @category Facial Animation
 * @korean 눈개방도
 */
export const EYE_OPENNESS: Record<FacialExpression, number> = {
  [FacialExpression.NEUTRAL]: 1.0, // Fully open
  [FacialExpression.FOCUSED]: 0.7, // Narrowed
  [FacialExpression.PAINED]: 0.3, // Squinted
  [FacialExpression.EXHAUSTED]: 0.5, // Half-closed
  [FacialExpression.VICTORIOUS]: 0.9, // Nearly fully open
  [FacialExpression.DEFEATED]: 0.0, // Closed
};

/**
 * Mouth openness values for expressions
 * 
 * @public
 * @category Facial Animation
 * @korean 입개방도
 */
export const MOUTH_OPENNESS: Record<FacialExpression, number> = {
  [FacialExpression.NEUTRAL]: 0.0, // Closed
  [FacialExpression.FOCUSED]: 0.0, // Closed, determined
  [FacialExpression.PAINED]: 0.8, // Open, yelling
  [FacialExpression.EXHAUSTED]: 0.4, // Panting
  [FacialExpression.VICTORIOUS]: 0.2, // Slight smile
  [FacialExpression.DEFEATED]: 0.1, // Slack
};

/**
 * Head movement animation type
 * 
 * Defines types of head movements for combat reactions.
 * 
 * @public
 * @category Facial Animation
 * @korean 머리움직임타입
 */
export enum HeadMovementType {
  /** Head snaps back when hit */
  RECOIL = "recoil",
  /** Slight nod forward during attack */
  NOD = "nod",
  /** Head tilts to avoid strike */
  TILT = "tilt",
  /** Head turns to track opponent */
  TURN = "turn",
  /** Head shakes when stunned */
  SHAKE = "shake",
  /** Head drops when defeated */
  DROP = "drop",
}

/**
 * Head movement animation keyframes
 * 
 * Sequence of Euler rotations for head movement animations.
 * 
 * @public
 * @category Facial Animation
 * @korean 머리움직임키프레임
 */
export interface HeadMovementKeyframes {
  /** Movement type identifier */
  readonly type: HeadMovementType;
  
  /** Sequence of rotation keyframes */
  readonly rotations: readonly THREE.Euler[];
  
  /** Duration of each keyframe in seconds */
  readonly frameDuration: number;
  
  /** Total animation duration in seconds */
  readonly totalDuration: number;
  
  /** Whether animation loops */
  readonly loop: boolean;
}

/**
 * Eye tracking state
 * 
 * Manages eye direction and pupil position for opponent tracking.
 * 
 * @public
 * @category Facial Animation
 * @korean 눈추적상태
 */
export interface EyeTrackingState {
  /** Target position to look at (opponent position) */
  readonly targetPosition: THREE.Vector3;
  
  /** Current look direction (normalized) */
  readonly lookDirection: THREE.Vector3;
  
  /** Pupil offset from center (-1 to 1 for each axis) */
  readonly pupilOffset: { x: number; y: number };
  
  /** Tracking speed (smoothing factor) */
  readonly trackingSpeed: number;
  
  /** Whether tracking is enabled */
  readonly enabled: boolean;
}

/**
 * Default facial damage state (no damage)
 * 
 * @public
 * @category Facial Animation
 * @korean 기본얼굴손상상태
 */
export const DEFAULT_FACIAL_DAMAGE: FacialDamageState = {
  leftEyeSwelling: 0,
  rightEyeSwelling: 0,
  mouthBleeding: 0,
  noseBleeding: 0,
  leftCheekBruise: 0,
  rightCheekBruise: 0,
  foreheadBruise: 0,
  jawBruise: 0,
  totalFacialDamage: 0,
};

/**
 * Default expression state (neutral)
 * 
 * @public
 * @category Facial Animation
 * @korean 기본표정상태
 */
export const DEFAULT_EXPRESSION_STATE: ExpressionState = {
  expression: FacialExpression.NEUTRAL,
  intensity: 1.0,
  transitionTime: 0.2,
};

/**
 * Default eye tracking state
 * 
 * @public
 * @category Facial Animation
 * @korean 기본눈추적상태
 */
export const DEFAULT_EYE_TRACKING: EyeTrackingState = {
  targetPosition: new THREE.Vector3(0, 1.9, 5), // Looking forward
  lookDirection: new THREE.Vector3(0, 0, 1), // Forward
  pupilOffset: { x: 0, y: 0 },
  trackingSpeed: 0.1,
  enabled: true,
};

/**
 * Face3D component props
 * 
 * @public
 * @category Facial Animation
 * @korean 얼굴3D속성
 */
export interface Face3DProps {
  /** Current facial expression */
  readonly expression: FacialExpression;
  
  /** Facial damage state */
  readonly damage: FacialDamageState;
  
  /** Opponent position for eye tracking */
  readonly opponentPosition: THREE.Vector3;
  
  /** Current head rotation (Euler angles) */
  readonly headRotation: THREE.Euler;
  
  /** Enable eye tracking (default: true) */
  readonly enableEyeTracking?: boolean;
  
  /** Enable damage visualization (default: true) */
  readonly enableDamageVisuals?: boolean;
  
  /** Mobile mode (simplified rendering) */
  readonly isMobile?: boolean;
  
  /** Skin tone color (default: KOREAN_COLORS.SKIN_TONE) */
  readonly skinColor?: number;
}

/**
 * Eye component props
 * 
 * @public
 * @category Facial Animation
 * @korean 눈3D속성
 */
export interface EyeProps {
  /** Eye position relative to head */
  readonly position: [number, number, number];
  
  /** Current facial expression */
  readonly expression: FacialExpression;
  
  /** Look direction for pupil tracking */
  readonly lookDirection: THREE.Vector3;
  
  /** Eye swelling amount (0-1) */
  readonly swelling: number;
  
  /** Whether this is the left or right eye */
  readonly side: "left" | "right";
}

/**
 * Mouth component props
 * 
 * @public
 * @category Facial Animation
 * @korean 입3D속성
 */
export interface MouthProps {
  /** Mouth position relative to head */
  readonly position: [number, number, number];
  
  /** Current facial expression */
  readonly expression: FacialExpression;
  
  /** Bleeding intensity (0-1) */
  readonly bleeding: number;
}
