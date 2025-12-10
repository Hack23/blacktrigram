/**
 * Animation system types for Black Trigram
 * 
 * Defines animation states, configurations, and transition rules
 * for frame-accurate combat animations at 60fps.
 * 
 * @module systems/animation/types
 * @category Animation
 * @korean 애니메이션시스템타입
 */

/**
 * Animation states for player characters
 * 
 * Based on game-design.md specifications:
 * - idle: Default state, breathing animation
 * - walk: Movement animation (6 frames)
 * - run: Fast movement animation
 * - attack: Attack animation (12 frames per game-design.md)
 * - defend: Block/defense animation (4 frames per game-design.md)
 * - hit: Taking damage animation
 * - stance_change: Trigram stance transition (600ms)
 * - ko: Knockout/death animation
 * 
 * @public
 * @korean 애니메이션상태
 */
export type AnimationState =
  | "idle"
  | "walk"
  | "run"
  | "attack"
  | "defend"
  | "hit"
  | "stance_change"
  | "ko";

/**
 * Animation priority levels for interrupt system
 * 
 * Higher priority animations can interrupt lower priority ones.
 * Priority order: ko > hit > attack > defend > stance_change > movement > idle
 * 
 * @public
 * @korean 애니메이션우선순위
 */
export enum AnimationPriority {
  IDLE = 0,
  WALK = 1,
  RUN = 2,
  STANCE_CHANGE = 3,
  DEFEND = 4,
  ATTACK = 5,
  HIT = 6,
  KO = 7,
}

/**
 * Animation configuration for a single animation state
 * 
 * Frame counts based on game-design.md:
 * - Attack: 12 frames (200ms at 60fps)
 * - Block: 4 frames (67ms at 60fps)
 * - Walk: 6 frames
 * 
 * @public
 * @korean 애니메이션설정
 */
export interface AnimationConfig {
  /**
   * Animation state identifier
   * @korean 상태
   */
  readonly state: AnimationState;

  /**
   * Total number of frames in animation
   * @korean 프레임수
   */
  readonly frames: number;

  /**
   * Target frames per second (typically 60)
   * @korean 초당프레임
   */
  readonly fps: number;

  /**
   * Whether animation loops continuously
   * @korean 반복여부
   */
  readonly loop: boolean;

  /**
   * Whether animation can be interrupted by higher priority animations
   * @korean 중단가능여부
   */
  readonly interruptible: boolean;

  /**
   * Animation priority for interrupt system
   * @korean 우선순위
   */
  readonly priority: AnimationPriority;

  /**
   * Duration in seconds (calculated from frames/fps)
   * @korean 지속시간
   */
  readonly duration: number;
}

/**
 * Animation event callback types
 * 
 * @public
 * @korean 애니메이션이벤트
 */
export interface AnimationEvents {
  /**
   * Called when animation starts
   * @korean 시작이벤트
   */
  readonly onAnimationStart?: (state: AnimationState) => void;

  /**
   * Called on specific frame numbers
   * @korean 프레임이벤트
   */
  readonly onFrame?: (frame: number, state: AnimationState) => void;

  /**
   * Called when animation completes
   * @korean 완료이벤트
   */
  readonly onAnimationComplete?: (state: AnimationState) => void;

  /**
   * Called when animation is interrupted
   * @korean 중단이벤트
   */
  readonly onAnimationInterrupted?: (
    fromState: AnimationState,
    toState: AnimationState
  ) => void;
}

/**
 * Animation state machine state
 * 
 * @public
 * @korean 애니메이션상태머신상태
 */
export interface AnimationMachineState {
  /**
   * Current animation state
   * @korean 현재상태
   */
  readonly currentState: AnimationState;

  /**
   * Current frame index (0 to frames-1)
   * @korean 현재프레임
   */
  readonly frameIndex: number;

  /**
   * Time accumulator for frame timing
   * @korean 시간누적
   */
  readonly timeAccumulator: number;

  /**
   * Whether animation is playing
   * @korean 재생중
   */
  readonly isPlaying: boolean;

  /**
   * Previous animation state
   * @korean 이전상태
   */
  readonly previousState: AnimationState | null;
}

/**
 * Animation transition rule
 * 
 * @public
 * @korean 애니메이션전환규칙
 */
export interface TransitionRule {
  /**
   * Source animation state
   * @korean 시작상태
   */
  readonly from: AnimationState;

  /**
   * Target animation state
   * @korean 목표상태
   */
  readonly to: AnimationState;

  /**
   * Whether transition is allowed
   * @korean 허용여부
   */
  readonly allowed: boolean;

  /**
   * Optional condition function
   * @korean 조건함수
   */
  readonly condition?: () => boolean;
}

/**
 * Result of an animation update
 * 
 * @public
 * @korean 애니메이션업데이트결과
 */
export interface AnimationUpdateResult {
  /**
   * Current animation state
   * @korean 현재상태
   */
  readonly state: AnimationState;

  /**
   * Current frame index
   * @korean 현재프레임
   */
  readonly frame: number;

  /**
   * Animation progress (0-1)
   * @korean 진행률
   */
  readonly progress: number;

  /**
   * Whether animation just completed this frame
   * @korean 완료여부
   */
  readonly justCompleted: boolean;

  /**
   * Whether animation just started this frame
   * @korean 시작여부
   */
  readonly justStarted: boolean;
}
