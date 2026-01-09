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
 * Animation states for player characters (애니메이션 상태)
 * 
 * Enum-based animation state system for type safety and IDE autocomplete.
 * Each state includes Korean terminology and timing specifications.
 * 
 * Based on game-design.md specifications:
 * - Attack: 12 frames (200ms at 60fps)
 * - Block: 4 frames (67ms at 60fps)
 * - Walk: 6 frames (100ms at 60fps)
 * - Stance transitions: 36 frames (600ms at 60fps)
 * - Tactical steps: 18 frames (300ms at 60fps, 30cm distance)
 * 
 * @public
 * @korean 애니메이션상태
 */
export enum AnimationState {
  // ===== Basic Movement States (기본 이동 상태) =====
  
  /** 
   * Idle stance - Default breathing animation
   * Korean: 대기 (daegi) - Standing ready
   * Duration: 4 frames (67ms)
   */
  IDLE = "idle",
  
  /** 
   * Walk - Normal walking movement
   * Korean: 보행 (bohaeng) - Walking
   * Duration: 6 frames (100ms)
   */
  WALK = "walk",
  
  /** 
   * Run - Fast movement animation
   * Korean: 달리기 (dalligi) - Running
   * Duration: 8 frames (133ms)
   */
  RUN = "run",
  
  // ===== Combat Actions (전투 행동) =====
  
  /** 
   * Attack - Generic attack animation
   * Korean: 공격 (gonggyeok) - Attack
   * Duration: 12 frames (200ms)
   */
  ATTACK = "attack",
  
  /** 
   * Defend - Basic block/defense
   * Korean: 방어 (bangeo) - Defense
   * Duration: 4 frames (67ms)
   */
  DEFEND = "defend",
  
  /** 
   * Defend Block Success - Successful block, absorb impact
   * Korean: 막기 (makgi) - Block successfully
   * Duration: 8 frames (133ms)
   */
  DEFEND_BLOCK_SUCCESS = "defend_block_success",
  
  /** 
   * Defend Parry - Parry deflection, redirect attack
   * Korean: 받아넘기기 (badaneumgigi) - Parry deflect
   * Duration: 10 frames (167ms)
   */
  DEFEND_PARRY = "defend_parry",
  
  /** 
   * Defend Guard Break - Guard break, defensive stance destroyed
   * Korean: 방어붕괴 (bangeo bunggoe) - Guard broken
   * Duration: 15 frames (250ms)
   */
  DEFEND_GUARD_BREAK = "defend_guard_break",
  
  /** 
   * Defend Recovery - Guard recovery, restore defensive posture
   * Korean: 방어복구 (bangeo bokgu) - Guard recovery
   * Duration: 12 frames (200ms)
   */
  DEFEND_RECOVERY = "defend_recovery",
  
  /** 
   * Hit - Taking damage animation
   * Korean: 피격 (pigyeok) - Being hit
   * Duration: 4 frames (67ms)
   */
  HIT = "hit",
  
  /** 
   * KO - Knockout/death animation
   * Korean: 기절 (gijeol) - Knockout
   * Duration: 30 frames (500ms)
   */
  KO = "ko",
  
  // ===== Stance Transitions (자세 전환) =====
  
  /** 
   * Stance Change - Trigram stance transition
   * Korean: 자세변경 (jaseybyeongyeong) - Stance change
   * Duration: 36 frames (600ms)
   */
  STANCE_CHANGE = "stance_change",
  
  /** 
   * Stance Side Switch - Left↔right stance mirror
   * Korean: 좌우전환 (jwaujeonhwan) - Left-right switch
   * Duration: 24 frames (400ms)
   */
  STANCE_SIDE_SWITCH = "stance_side_switch",
  
  // ===== Stance Guard Animations (팔괘 방어 자세) =====
  
  /** 
   * Stance Guard Geon - ☰ Heaven stance guard
   * Korean: 건괘수비 (geon-goe subi) - Heaven guard
   * Duration: 6 frames (breathing loop)
   */
  STANCE_GUARD_GEON = "stance_guard_geon",
  
  /** 
   * Stance Guard Tae - ☱ Lake stance guard
   * Korean: 태괘수비 (tae-goe subi) - Lake guard
   * Duration: 6 frames (breathing loop)
   */
  STANCE_GUARD_TAE = "stance_guard_tae",
  
  /** 
   * Stance Guard Li - ☲ Fire stance guard
   * Korean: 리괘수비 (li-goe subi) - Fire guard
   * Duration: 4 frames (breathing loop)
   */
  STANCE_GUARD_LI = "stance_guard_li",
  
  /** 
   * Stance Guard Jin - ☳ Thunder stance guard
   * Korean: 진괘수비 (jin-goe subi) - Thunder guard
   * Duration: 5 frames (breathing loop)
   */
  STANCE_GUARD_JIN = "stance_guard_jin",
  
  /** 
   * Stance Guard Son - ☴ Wind stance guard
   * Korean: 손괘수비 (son-goe subi) - Wind guard
   * Duration: 6 frames (breathing loop)
   */
  STANCE_GUARD_SON = "stance_guard_son",
  
  /** 
   * Stance Guard Gam - ☵ Water stance guard
   * Korean: 감괘수비 (gam-goe subi) - Water guard
   * Duration: 6 frames (breathing loop)
   */
  STANCE_GUARD_GAM = "stance_guard_gam",
  
  /** 
   * Stance Guard Gan - ☶ Mountain stance guard
   * Korean: 간괘수비 (gan-goe subi) - Mountain guard
   * Duration: 4 frames (breathing loop)
   */
  STANCE_GUARD_GAN = "stance_guard_gan",
  
  /** 
   * Stance Guard Gon - ☷ Earth stance guard
   * Korean: 곤괘수비 (gon-goe subi) - Earth guard
   * Duration: 5 frames (breathing loop)
   */
  STANCE_GUARD_GON = "stance_guard_gon",
  
  // ===== Tactical Step Movements (전술적 발걸음) =====
  
  /** 
   * Step Forward - Forward tactical step
   * Korean: 전진보법 (jeonjin bobeop) - Forward step
   * Duration: 18 frames (300ms), Distance: 30cm
   */
  STEP_FORWARD = "step_forward",
  
  /** 
   * Step Back - Retreat tactical step
   * Korean: 후퇴보법 (hutoe bobeop) - Retreat step
   * Duration: 18 frames (300ms), Distance: 30cm
   */
  STEP_BACK = "step_back",
  
  /** 
   * Step Left - Left side tactical step
   * Korean: 좌측면보법 (jwacheuk myeon bobeop) - Left side step
   * Duration: 18 frames (300ms), Distance: 30cm
   */
  STEP_LEFT = "step_left",
  
  /** 
   * Step Right - Right side tactical step
   * Korean: 우측면보법 (ucheuk myeon bobeop) - Right side step
   * Duration: 18 frames (300ms), Distance: 30cm
   */
  STEP_RIGHT = "step_right",
  
  /** 
   * Step Forward Left - Forward-left diagonal step
   * Korean: 전좌측보법 (jeon jwacheuk bobeop) - Forward-left diagonal
   * Duration: 18 frames (300ms), Distance: 30cm
   */
  STEP_FORWARD_LEFT = "step_forward_left",
  
  /** 
   * Step Forward Right - Forward-right diagonal step
   * Korean: 전우측보법 (jeon ucheuk bobeop) - Forward-right diagonal
   * Duration: 18 frames (300ms), Distance: 30cm
   */
  STEP_FORWARD_RIGHT = "step_forward_right",
  
  /** 
   * Step Back Left - Back-left diagonal step
   * Korean: 후좌측보법 (hu jwacheuk bobeop) - Back-left diagonal
   * Duration: 18 frames (300ms), Distance: 30cm
   */
  STEP_BACK_LEFT = "step_back_left",
  
  /** 
   * Step Back Right - Back-right diagonal step
   * Korean: 후우측보법 (hu ucheuk bobeop) - Back-right diagonal
   * Duration: 18 frames (300ms), Distance: 30cm
   */
  STEP_BACK_RIGHT = "step_back_right",
  
  // ===== Footwork Patterns (보법) =====
  
  /** 
   * Footwork Circular Left - Circular step maintaining guard (left)
   * Korean: 원형보 좌 (wonhyeongbo jwa) - Circular step left
   * Duration: 18 frames (300ms), Distance: 30cm
   */
  FOOTWORK_CIRCULAR_LEFT = "footwork_circular_left",
  
  /** 
   * Footwork Circular Right - Circular step maintaining guard (right)
   * Korean: 원형보 우 (wonhyeongbo u) - Circular step right
   * Duration: 18 frames (300ms), Distance: 30cm
   */
  FOOTWORK_CIRCULAR_RIGHT = "footwork_circular_right",
  
  /** 
   * Footwork Pivot Left - Pivot rotation on planted foot (left)
   * Korean: 축족회전 좌 (chukjok hoejeon jwa) - Pivot rotation left
   * Duration: 15 frames (250ms), Rotation: 90°
   */
  FOOTWORK_PIVOT_LEFT = "footwork_pivot_left",
  
  /** 
   * Footwork Pivot Right - Pivot rotation on planted foot (right)
   * Korean: 축족회전 우 (chukjok hoejeon u) - Pivot rotation right
   * Duration: 15 frames (250ms), Rotation: 90°
   */
  FOOTWORK_PIVOT_RIGHT = "footwork_pivot_right",
  
  /** 
   * Footwork Slide Forward - Both feet slide together (forward)
   * Korean: 미끄럼보 전 (mikkeureombo jeon) - Sliding step forward
   * Duration: 12 frames (200ms), Distance: 30cm
   */
  FOOTWORK_SLIDE_FORWARD = "footwork_slide_forward",
  
  /** 
   * Footwork Slide Back - Both feet slide together (back)
   * Korean: 미끄럼보 후 (mikkeureombo hu) - Sliding step back
   * Duration: 12 frames (200ms), Distance: 30cm
   */
  FOOTWORK_SLIDE_BACK = "footwork_slide_back",
  
  /** 
   * Footwork Slide Left - Both feet slide together (left)
   * Korean: 미끄럼보 좌 (mikkeureombo jwa) - Sliding step left
   * Duration: 12 frames (200ms), Distance: 30cm
   */
  FOOTWORK_SLIDE_LEFT = "footwork_slide_left",
  
  /** 
   * Footwork Slide Right - Both feet slide together (right)
   * Korean: 미끄럼보 우 (mikkeureombo u) - Sliding step right
   * Duration: 12 frames (200ms), Distance: 30cm
   */
  FOOTWORK_SLIDE_RIGHT = "footwork_slide_right",
  
  /** 
   * Footwork Shuffle - Quick micro-adjustment
   * Korean: 섞음보 (seokkeumbo) - Shuffle step
   * Duration: 6 frames (100ms), Distance: 15cm
   */
  FOOTWORK_SHUFFLE = "footwork_shuffle",
  
  // ===== Fall Animations (낙법 애니메이션) =====
  
  /** 
   * Fall Forward - Forward fall animation
   * Korean: 전방낙법 (jeonbang nakbeop) - Forward falling technique
   * Duration: 24 frames (400ms)
   */
  FALL_FORWARD = "fall_forward",
  
  /** 
   * Fall Backward - Backward fall animation
   * Korean: 후방낙법 (hubang nakbeop) - Backward falling technique
   * Duration: 30 frames (500ms)
   */
  FALL_BACKWARD = "fall_backward",
  
  /** 
   * Fall Side Left - Left side fall animation
   * Korean: 좌측낙법 (jwacheuk nakbeop) - Left side falling technique
   * Duration: 27 frames (450ms)
   */
  FALL_SIDE_LEFT = "fall_side_left",
  
  /** 
   * Fall Side Right - Right side fall animation
   * Korean: 우측낙법 (ucheuk nakbeop) - Right side falling technique
   * Duration: 27 frames (450ms)
   */
  FALL_SIDE_RIGHT = "fall_side_right",
  
  // ===== Ground States (지면 자세) =====
  
  /** 
   * Ground Prone - Face-down ground position
   * Korean: 엎드림 (eopdeurim) - Face down position
   * Duration: 4 frames (breathing loop)
   */
  GROUND_PRONE = "ground_prone",
  
  /** 
   * Ground Supine - Face-up ground position
   * Korean: 누움 (nuum) - Face up position
   * Duration: 4 frames (breathing loop)
   */
  GROUND_SUPINE = "ground_supine",
  
  /** 
   * Ground Side Left - Left side ground position
   * Korean: 좌측와 (jwacheuk wa) - Left side position
   * Duration: 4 frames (breathing loop)
   */
  GROUND_SIDE_LEFT = "ground_side_left",
  
  /** 
   * Ground Side Right - Right side ground position
   * Korean: 우측와 (ucheuk wa) - Right side position
   * Duration: 4 frames (breathing loop)
   */
  GROUND_SIDE_RIGHT = "ground_side_right",
  
  // ===== Turn Animations (180도 회전) =====
  
  /** 
   * Turn Left - 180° turn left animation
   * Korean: 좌회전 (jwahoejeon) - Left turn
   * Duration: 12 frames (200ms), Rotation: 180°
   */
  TURN_LEFT = "turn_left",
  
  /** 
   * Turn Right - 180° turn right animation
   * Korean: 우회전 (uhoejeon) - Right turn
   * Duration: 12 frames (200ms), Rotation: 180°
   */
  TURN_RIGHT = "turn_right",
  
  // ===== Recovery Animations (회복 애니메이션) =====
  
  /** 
   * Recovery Prone Standup - Stand up from prone position
   * Korean: 엎드린 기상 (eopdeurin gisang) - Prone stand-up
   * Duration: 30 frames (500ms)
   */
  RECOVERY_PRONE_STANDUP = "recovery_prone_standup",
  
  /** 
   * Recovery Supine Standup - Stand up from supine position
   * Korean: 누운 기상 (nuun gisang) - Supine stand-up
   * Duration: 36 frames (600ms)
   */
  RECOVERY_SUPINE_STANDUP = "recovery_supine_standup",
  
  /** 
   * Recovery Roll - Roll recovery to standing
   * Korean: 회전기상 (hoejeon gisang) - Roll recovery
   * Duration: 24 frames (400ms), Stamina cost: 20
   */
  RECOVERY_ROLL = "recovery_roll",
  
  /** 
   * Recovery Defensive - Defensive getup with guard
   * Korean: 방어기상 (bangeo gisang) - Defensive getup
   * Duration: 42 frames (700ms), Damage reduction: 50%
   */
  RECOVERY_DEFENSIVE = "recovery_defensive",
}

/**
 * Animation priority levels for interrupt system
 * 
 * Higher priority animations can interrupt lower priority ones.
 * Priority order: recovery > fall > ko > hit > attack > defend > step > stance_change > movement > idle
 * 
 * Steps are non-interruptible (same priority as attacks) to ensure commitment
 * to tactical repositioning in Korean martial arts.
 * Recovery animations have highest priority to allow getting up from ground.
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
  RECOVERY = 9,
}

// Step animations use ATTACK priority (5) - both are non-interruptible
export const STEP_PRIORITY = AnimationPriority.ATTACK;

/**
 * Defensive animation types for guard break and defensive stance mechanics.
 * 
 * **Korean Terminology**:
 * - block_success: 막기 (makgi) - Successful block, absorb impact
 * - parry_deflect: 받아넘기기 (badaneumgigi) - Parry deflection, redirect attack
 * - guard_break: 방어붕괴 (bangeo bunggoe) - Guard break, defensive stance destroyed
 * - guard_recovery: 방어복구 (bangeo bokgu) - Guard recovery, restore defensive posture
 * 
 * @public
 * @korean 방어애니메이션타입
 */
export type DefensiveAnimationType = 
  | 'block_success'
  | 'parry_deflect'
  | 'guard_break'
  | 'guard_recovery';

/**
 * Animation configuration for a single animation state
 * 
 * Frame counts based on game-design.md:
 * - Attack: 12 frames (200ms at 60fps)
 * - Block: 4 frames (67ms at 60fps)
 * - Walk: 6 frames
 * 
 * Extended with defensive animation support:
 * - Block Success: 8 frames (133ms)
 * - Parry Deflect: 10 frames (167ms)
 * - Guard Break: 15 frames (250ms)
 * - Guard Recovery: 12 frames (200ms)
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

  /**
   * Counter-attack window in seconds (for parry animations)
   * Creates an opportunity window for immediate counter-attacks after successful parry.
   * @korean 반격시간
   */
  readonly counterWindow?: number;

  /**
   * Vulnerability window duration in seconds (for guard break animations)
   * Extended vulnerability period where defender takes increased damage.
   * @korean 취약시간
   */
  readonly vulnerabilityDuration?: number;
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
  forward: AnimationState.FALL_FORWARD,
  backward: AnimationState.FALL_BACKWARD,
  side_left: AnimationState.FALL_SIDE_LEFT,
  side_right: AnimationState.FALL_SIDE_RIGHT,
};

/**
 * Maps ground states to corresponding animation states
 * 
 * @public
 * @korean 지면애니메이션맵
 */
export const GROUND_STATE_TO_ANIMATION: Record<GroundState, AnimationState> = {
  prone: AnimationState.GROUND_PRONE,
  supine: AnimationState.GROUND_SUPINE,
  side_left: AnimationState.GROUND_SIDE_LEFT,
  side_right: AnimationState.GROUND_SIDE_RIGHT,
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

/**
 * Footwork pattern types for Korean martial arts (보법)
 * 
 * Four specialized footwork patterns based on traditional Korean martial arts:
 * - circular: 원형보 (Wonhyeongbo) - Circular stepping while maintaining guard facing
 * - pivot: 축족회전 (Chukjok Hoejeon) - Pivot rotation on planted foot
 * - slide: 미끄럼보 (Mikkeureombo) - Sliding step with both feet moving together
 * - shuffle: 섞음보 (Seokkeumbo) - Quick shuffling micro-adjustment
 * 
 * Each pattern serves distinct tactical purposes in combat:
 * - Circular: Lateral repositioning while keeping opponent in guard
 * - Pivot: Fast direction changes on planted foot
 * - Slide: Maintaining stable base while advancing/retreating
 * - Shuffle: Fine-tuning position without commitment
 * 
 * @public
 * @korean 보법유형
 */
export type FootworkPattern = 'circular' | 'pivot' | 'slide' | 'shuffle';

/**
 * Footwork direction for directional patterns
 * 
 * @public
 * @korean 보법방향
 */
export type FootworkDirection = 'left' | 'right' | 'forward' | 'back';

/**
 * Korean terminology for footwork patterns
 * 
 * Maps each footwork pattern to its Korean martial arts terminology
 * with romanization and English translation.
 * 
 * @public
 * @korean 보법한글용어
 */
export const FOOTWORK_KOREAN_TERMS: Record<FootworkPattern, { korean: string; romanized: string; english: string }> = {
  circular: {
    korean: '원형보',
    romanized: 'Wonhyeongbo',
    english: 'Circular Step',
  },
  pivot: {
    korean: '축족회전',
    romanized: 'Chukjok Hoejeon',
    english: 'Pivot Rotation',
  },
  slide: {
    korean: '미끄럼보',
    romanized: 'Mikkeureombo',
    english: 'Sliding Step',
  },
  shuffle: {
    korean: '섞음보',
    romanized: 'Seokkeumbo',
    english: 'Shuffle Step',
  },
};

/**
 * Recovery animation types for getting up from ground states
 * 
 * Korean terminology:
 * - prone_standup: 엎드린 기상 (Eopdeurin Gisang) - Stand up from prone
 * - supine_standup: 누운 기상 (Nuun Gisang) - Stand up from supine
 * - roll: 회전기상 (Hoejeon Gisang) - Roll recovery
 * - defensive: 방어기상 (Bangeo Gisang) - Defensive getup
 * 
 * @public
 * @korean 회복애니메이션유형
 */
export type RecoveryAnimationType = 
  | 'prone_standup'
  | 'supine_standup'
  | 'roll_recovery'
  | 'defensive_getup';

/**
 * Korean terminology for recovery animations
 * 
 * Maps each recovery type to its Korean martial arts terminology
 * with romanization and English translation.
 * 
 * @public
 * @korean 회복한글용어
 */
export const RECOVERY_KOREAN_TERMS: Record<RecoveryAnimationType, { korean: string; romanized: string; english: string }> = {
  prone_standup: {
    korean: '엎드린 기상',
    romanized: 'Eopdeurin Gisang',
    english: 'Prone Stand-Up',
  },
  supine_standup: {
    korean: '누운 기상',
    romanized: 'Nuun Gisang',
    english: 'Supine Stand-Up',
  },
  roll_recovery: {
    korean: '회전기상',
    romanized: 'Hoejeon Gisang',
    english: 'Roll Recovery',
  },
  defensive_getup: {
    korean: '방어기상',
    romanized: 'Bangeo Gisang',
    english: 'Defensive Getup',
  },
};

/**
 * Maps ground states to their default recovery animation
 * 
 * @public
 * @korean 지면회복맵
 */
export const GROUND_STATE_TO_RECOVERY: Record<GroundState, RecoveryAnimationType> = {
  prone: 'prone_standup',
  supine: 'supine_standup',
  side_left: 'roll_recovery',  // Side positions use roll by default
  side_right: 'roll_recovery',
};

/**
 * Maps recovery types to their animation states
 * 
 * @public
 * @korean 회복애니메이션맵
 */
export const RECOVERY_TYPE_TO_ANIMATION: Record<RecoveryAnimationType, AnimationState> = {
  prone_standup: AnimationState.RECOVERY_PRONE_STANDUP,
  supine_standup: AnimationState.RECOVERY_SUPINE_STANDUP,
  roll_recovery: AnimationState.RECOVERY_ROLL,
  defensive_getup: AnimationState.RECOVERY_DEFENSIVE,
};

// ===== Backward Compatibility Helpers (하위 호환성 도우미) =====

/**
 * Convert string to AnimationState enum (backward compatibility)
 * 
 * **Korean**: 문자열을 애니메이션 상태로 변환
 * 
 * Provides backward compatibility for code using string-based animation states.
 * Returns null if the string doesn't match any valid animation state.
 * 
 * @param state - String representation of animation state
 * @returns AnimationState enum or null if invalid
 * 
 * @example
 * ```typescript
 * const state = stringToAnimationState("idle"); // AnimationState.IDLE
 * const invalid = stringToAnimationState("invalid"); // null
 * ```
 * 
 * @public
 * @korean 문자열을애니메이션상태로변환
 */
export function stringToAnimationState(state: string): AnimationState | null {
  const normalized = state.toLowerCase();
  
  // Check if the normalized string is a valid AnimationState enum value
  const values = Object.values(AnimationState) as string[];
  if (values.includes(normalized)) {
    return normalized as AnimationState;
  }
  
  return null;
}

/**
 * Check if a value is a valid AnimationState enum
 * 
 * **Korean**: 유효한 애니메이션 상태인지 확인
 * 
 * Type guard to validate that a value is a valid AnimationState enum value.
 * 
 * @param value - Value to check
 * @returns True if value is a valid AnimationState
 * 
 * @example
 * ```typescript
 * if (isValidAnimationState(someValue)) {
 *   // TypeScript knows someValue is AnimationState here
 *   machine.transitionTo(someValue);
 * }
 * ```
 * 
 * @public
 * @korean 유효한애니메이션상태확인
 */
export function isValidAnimationState(value: unknown): value is AnimationState {
  if (typeof value !== 'string') {
    return false;
  }
  
  const values = Object.values(AnimationState) as string[];
  return values.includes(value);
}

/**
 * Get all animation state enum values as an array
 * 
 * **Korean**: 모든 애니메이션 상태 값 배열
 * 
 * Returns an array of all valid AnimationState enum values.
 * Useful for iteration, validation, and testing.
 * 
 * @returns Array of all AnimationState values
 * 
 * @example
 * ```typescript
 * const allStates = getAllAnimationStates();
 * allStates.forEach(state => {
 *   console.log(`State: ${state}`);
 * });
 * ```
 * 
 * @public
 * @korean 모든애니메이션상태가져오기
 */
export function getAllAnimationStates(): AnimationState[] {
  return Object.values(AnimationState);
}

/**
 * Check if an animation state is a stance guard state
 * 
 * **Korean**: 자세 방어 상태인지 확인
 * 
 * Determines if the given animation state is one of the eight trigram
 * stance guard animations.
 * 
 * @param state - Animation state to check
 * @returns True if state is a stance guard animation
 * 
 * @example
 * ```typescript
 * if (isStanceGuardState(AnimationState.STANCE_GUARD_GEON)) {
 *   // Handle stance guard logic
 * }
 * ```
 * 
 * @public
 * @korean 자세방어상태확인
 */
export function isStanceGuardState(state: AnimationState): boolean {
  return state.startsWith('stance_guard_');
}

/**
 * Check if an animation state is a step movement state
 * 
 * **Korean**: 발걸음 이동 상태인지 확인
 * 
 * Determines if the given animation state is one of the tactical step
 * movement animations.
 * 
 * @param state - Animation state to check
 * @returns True if state is a step movement animation
 * 
 * @example
 * ```typescript
 * if (isStepState(AnimationState.STEP_FORWARD)) {
 *   // Handle step movement logic
 * }
 * ```
 * 
 * @public
 * @korean 발걸음상태확인
 */
export function isStepState(state: AnimationState): boolean {
  return state.startsWith('step_');
}

/**
 * Check if an animation state is a footwork pattern state
 * 
 * **Korean**: 보법 패턴 상태인지 확인
 * 
 * Determines if the given animation state is one of the specialized
 * Korean martial arts footwork patterns.
 * 
 * @param state - Animation state to check
 * @returns True if state is a footwork pattern animation
 * 
 * @example
 * ```typescript
 * if (isFootworkState(AnimationState.FOOTWORK_CIRCULAR_LEFT)) {
 *   // Handle footwork pattern logic
 * }
 * ```
 * 
 * @public
 * @korean 보법상태확인
 */
export function isFootworkState(state: AnimationState): boolean {
  return state.startsWith('footwork_');
}

/**
 * Check if an animation state is a fall animation state
 * 
 * **Korean**: 낙법 애니메이션 상태인지 확인
 * 
 * Determines if the given animation state is one of the fall animations.
 * 
 * @param state - Animation state to check
 * @returns True if state is a fall animation
 * 
 * @example
 * ```typescript
 * if (isFallState(AnimationState.FALL_FORWARD)) {
 *   // Handle fall animation logic
 * }
 * ```
 * 
 * @public
 * @korean 낙법상태확인
 */
export function isFallState(state: AnimationState): boolean {
  return state.startsWith('fall_');
}

/**
 * Check if an animation state is a ground position state
 * 
 * **Korean**: 지면 자세 상태인지 확인
 * 
 * Determines if the given animation state is one of the ground position
 * breathing loops.
 * 
 * @param state - Animation state to check
 * @returns True if state is a ground position animation
 * 
 * @example
 * ```typescript
 * if (isGroundState(AnimationState.GROUND_PRONE)) {
 *   // Handle ground position logic
 * }
 * ```
 * 
 * @public
 * @korean 지면상태확인
 */
export function isGroundState(state: AnimationState): boolean {
  return state.startsWith('ground_');
}

/**
 * Check if an animation state is a recovery animation state
 * 
 * **Korean**: 회복 애니메이션 상태인지 확인
 * 
 * Determines if the given animation state is one of the recovery/getup
 * animations.
 * 
 * @param state - Animation state to check
 * @returns True if state is a recovery animation
 * 
 * @example
 * ```typescript
 * if (isRecoveryState(AnimationState.RECOVERY_ROLL)) {
 *   // Handle recovery animation logic
 * }
 * ```
 * 
 * @public
 * @korean 회복상태확인
 */
export function isRecoveryState(state: AnimationState): boolean {
  return state.startsWith('recovery_');
}
