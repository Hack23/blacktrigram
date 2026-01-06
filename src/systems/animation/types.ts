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
 * - fall_forward: Forward fall animation (24 frames, 400ms)
 * - fall_backward: Backward fall animation (30 frames, 500ms)
 * - fall_side_left: Left side fall animation (27 frames, 450ms)
 * - fall_side_right: Right side fall animation (27 frames, 450ms)
 * - ground_prone: Face-down ground position (4 frame breathing loop)
 * - ground_supine: Face-up ground position (4 frame breathing loop)
 * - ground_side_left: Left side ground position (4 frame breathing loop)
 * - ground_side_right: Right side ground position (4 frame breathing loop)
 * - turn_left: 180° turn left animation (12 frames, 200ms)
 * - turn_right: 180° turn right animation (12 frames, 200ms)
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
  | "step_back_right"
  | "fall_forward"
  | "fall_backward"
  | "fall_side_left"
  | "fall_side_right"
  | "ground_prone"
  | "ground_supine"
  | "ground_side_left"
  | "ground_side_right"
  | "turn_left"
  | "turn_right";

/**
 * Animation priority levels for interrupt system
 * 
 * Higher priority animations can interrupt lower priority ones.
 * Priority order: ko > hit > attack > defend > step > stance_change > movement > idle
 * 
 * Steps are non-interruptible (same priority as attacks) to ensure commitment
 * to tactical repositioning in Korean martial arts.
 * Priority order: fall > ko > hit > attack > defend > stance_change > movement > idle
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
  FALL = 8,
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

/**
 * Fall direction types for knockdown animations
 * 
 * Determines which fall animation to play based on attack direction,
 * balance loss, or consciousness failure.
 * 
 * Korean terminology:
 * - forward: 전방낙법 (Jeonbang Nakbeop) - Forward falling technique
 * - backward: 후방낙법 (Hubang Nakbeop) - Backward falling technique
 * - side_left: 좌측낙법 (Jwacheuk Nakbeop) - Left side falling technique
 * - side_right: 우측낙법 (Ucheuk Nakbeop) - Right side falling technique
 * 
 * @public
 * @korean 낙법유형
 */
export type FallType = "forward" | "backward" | "side_left" | "side_right";

/**
 * Ground position states after falling
 * 
 * Represents the character's position on the ground after a fall.
 * Each state has a looping breathing animation.
 * 
 * Korean terminology:
 * - prone: 엎드림 (Eopdeurim) - Face down position
 * - supine: 누움 (Nuum) - Face up position
 * - side_left: 좌측와 (Jwacheuk Wa) - Left side position
 * - side_right: 우측와 (Ucheuk Wa) - Right side position
 * 
 * @public
 * @korean 지면자세
 */
export type GroundState = "prone" | "supine" | "side_left" | "side_right";

/**
 * Maps fall types to corresponding ground states
 * 
 * @public
 * @korean 낙법지면맵
 */
export const FALL_TO_GROUND_MAP: Record<FallType, GroundState> = {
  forward: "prone",
  backward: "supine",
  side_left: "side_left",
  side_right: "side_right",
};

/**
 * Maps fall types to corresponding animation states
 * 
 * @public
 * @korean 낙법애니메이션맵
 */
export const FALL_TYPE_TO_ANIMATION: Record<FallType, AnimationState> = {
  forward: "fall_forward",
  backward: "fall_backward",
  side_left: "fall_side_left",
  side_right: "fall_side_right",
};

/**
 * Maps ground states to corresponding animation states
 * 
 * @public
 * @korean 지면애니메이션맵
 */
export const GROUND_STATE_TO_ANIMATION: Record<GroundState, AnimationState> = {
  prone: "ground_prone",
  supine: "ground_supine",
  side_left: "ground_side_left",
  side_right: "ground_side_right",
};

/**
 * Body facing direction system state
 * 
 * Manages automatic character rotation to face opponent with:
 * - Smooth torso rotation (45°/sec, ±90° range)
 * - Independent head tracking (±45° range)
 * - 180° turn animations for repositioning
 * - Facing lock during attack/defend animations
 * 
 * Korean terminology:
 * - 정면향하기 (Jeongmyeon Hyanghagi) - Face forward
 * - 몸회전 (Mom Hoejeon) - Body rotation
 * - 머리추적 (Meori Chujok) - Head tracking
 * - 180도회전 (180-do Hoejeon) - 180-degree turn
 * 
 * @public
 * @korean 몸향하기상태
 */
export interface BodyFacing {
  /**
   * Current facing direction in degrees (0-360)
   * - 0° = facing right (+X axis)
   * - 90° = facing down (+Z axis)
   * - 180° = facing left (-X axis)
   * - 270° = facing up (-Z axis)
   * 
   * @korean 현재각도
   */
  readonly currentAngle: number;

  /**
   * Desired facing direction in degrees (0-360)
   * Typically pointing toward opponent position
   * 
   * @korean 목표각도
   */
  readonly targetAngle: number;

  /**
   * Rotation speed in degrees per second
   * Default: 45°/sec for smooth, realistic rotation
   * 
   * @korean 회전속도
   */
  readonly rotationSpeed: number;

  /**
   * Head rotation offset relative to torso (-45° to +45°)
   * Head can track independently within limited range
   * - Positive = head turned right
   * - Negative = head turned left
   * 
   * @korean 머리회전각도
   */
  readonly headAngleOffset: number;

  /**
   * Whether facing direction is locked
   * True during attack/defend animations to lock attack direction
   * False during idle/movement to allow dynamic tracking
   * 
   * @korean 회전잠금
   */
  readonly isLocked: boolean;

  /**
   * Whether character is currently executing a 180° turn animation
   * Used to prevent movement and other actions during repositioning
   * 
   * @korean 180도회전중
   */
  readonly isTurning: boolean;

  /**
   * Direction of current 180° turn ('left' or 'right')
   * Determines which turn animation to play
   * 
   * @korean 회전방향
   */
  readonly turnDirection?: 'left' | 'right';

  /**
   * Timestamp when 180° turn animation started
   * Used to track turn animation progress (200ms duration)
   * 
   * @korean 회전시작시간
   */
  readonly turnStartTime?: number;
}
