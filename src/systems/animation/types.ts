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
 * - stance_side_switch: Left↔right stance mirror (400ms at 60fps = 24 frames)
 * - ko: Knockout/death animation
 * - stance_guard_{stance}: Stance-specific idle guard animations (4-6 frames each)
 * - step_{direction}: Tactical step movements (18 frames, 300ms, 30cm distance)
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
  | "stance_side_switch"
  | "ko"
  | "stance_guard_geon"
  | "stance_guard_tae"
  | "stance_guard_li"
  | "stance_guard_jin"
  | "stance_guard_son"
  | "stance_guard_gam"
  | "stance_guard_gan"
  | "stance_guard_gon"
  | "step_forward"
  | "step_back"
  | "step_left"
  | "step_right"
  | "step_forward_left"
  | "step_forward_right"
  | "step_back_left"
  | "step_back_right";

/**
 * Animation priority levels for interrupt system
 * 
 * Higher priority animations can interrupt lower priority ones.
 * Priority order: ko > hit > attack > defend > step > stance_change > movement > idle
 * 
 * Steps are non-interruptible (same priority as attacks) to ensure commitment
 * to tactical repositioning in Korean martial arts.
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
  ATTACK = 5, // STEP shares ATTACK priority (both non-interruptible)
  HIT = 6,
  KO = 7,
}

// Step animations use ATTACK priority (5) - both are non-interruptible
export const STEP_PRIORITY = AnimationPriority.ATTACK;

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

/**
 * Step direction for tactical movement
 * 
 * Eight directions for tactical stepping (전술적 발놀림):
 * - forward: 전진보법 (Jeonjin Bobeop) - Forward step
 * - back: 후퇴보법 (Hutoe Bobeop) - Retreat step
 * - left: 좌측면보법 (Jwacheuk Myeon Bobeop) - Left side step
 * - right: 우측면보법 (Ucheuk Myeon Bobeop) - Right side step
 * - forward_left: 전좌측보법 (Jeon Jwacheuk Bobeop) - Forward-left diagonal
 * - forward_right: 전우측보법 (Jeon Ucheuk Bobeop) - Forward-right diagonal
 * - back_left: 후좌측보법 (Hu Jwacheuk Bobeop) - Back-left diagonal
 * - back_right: 후우측보법 (Hu Ucheuk Bobeop) - Back-right diagonal
 * 
 * Each step moves exactly 30cm (one foot width) for tactical repositioning
 * in Korean martial arts combat.
 * 
 * @public
 * @korean 발걸음방향
 */
export type StepDirection =
  | 'forward'
  | 'back'
  | 'left'
  | 'right'
  | 'forward_left'
  | 'forward_right'
  | 'back_left'
  | 'back_right';

/**
 * Step animation configuration
 * 
 * Defines keyframes for tactical step movements with:
 * - Weight transfer from back foot to front foot
 * - Foot lift and placement
 * - Guard position maintenance
 * - 30cm distance movement
 * - 300ms duration (18 frames at 60fps)
 * 
 * @public
 * @korean 발걸음애니메이션설정
 */
export interface StepConfig extends AnimationConfig {
  /**
   * Step direction
   * @korean 방향
   */
  readonly direction: StepDirection;

  /**
   * Distance moved in meters (always 0.3m = 30cm)
   * @korean 이동거리
   */
  readonly distance: number;

  /**
   * Whether guard position is maintained during step
   * @korean 방어자세유지
   */
  readonly maintainsGuard: boolean;

  /**
   * Stamina cost for this step
   * @korean 체력소모
   */
  readonly staminaCost: number;
}

/**
 * Step keyframe data for animation interpolation
 * 
 * Defines weight distribution, foot positions, and body center of gravity
 * at specific frames during the step animation.
 * 
 * @public
 * @korean 발걸음키프레임
 */
export interface StepKeyframe {
  /**
   * Frame number (0-17 for 18-frame step)
   * @korean 프레임번호
   */
  readonly frame: number;

  /**
   * Weight distribution (0 = fully on back foot, 1 = fully on front foot)
   * @korean 체중분배
   */
  readonly weight: number;

  /**
   * Front foot position offset from start (0-1, where 1 = full step distance)
   * @korean 앞발위치
   */
  readonly frontFootOffset: number;

  /**
   * Back foot position offset from start (0-1)
   * @korean 뒷발위치
   */
  readonly backFootOffset: number;

  /**
   * Vertical lift of front foot in meters
   * @korean 앞발들어올림
   */
  readonly frontFootLift: number;

  /**
   * Body center of gravity height offset
   * @korean 무게중심높이
   */
  readonly cogHeight: number;
}
