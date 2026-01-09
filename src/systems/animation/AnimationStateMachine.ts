/**
 * Player Animation State Machine for Black Trigram
 * 
 * Manages player character animations with frame-accurate timing at 60fps.
 * Supports animation priorities, transitions, and event callbacks.
 * 
 * Based on game-design.md specifications:
 * - Attack: 12 frames (200ms at 60fps)
 * - Block: 4 frames (67ms at 60fps)
 * - Walk: 6 frames
 * - Stance change: 600ms
 * 
 * @module systems/animation/AnimationStateMachine
 * @category Animation
 * @korean 애니메이션상태머신
 */

import { canInterrupt } from "./AnimationPriority";
import { isTransitionAllowed, getStanceTransition, type StanceTransition } from "./AnimationTransitions";
import { 
  createMotionPredictionState, 
  updateMotionPrediction,
  predictFutureKeyframe,
  type MotionPredictionState,
  type EasingName,
} from "./KeyframeInterpolation";
import { TrigramStance } from "../../types/common";
import { AnimationState } from "./types";
import type {
  AnimationConfig,
  AnimationEvents,
  AnimationMachineState,
  AnimationPriority,
  AnimationUpdateResult,
  FallType,
} from "./types";
import { STEP_PRIORITY } from "./types";
import { FALL_TO_GROUND_MAP } from "./types";

/**
 * Default animation configurations based on game-design.md
 * 
 * Frame timings:
 * - Attack: 12 frames = 200ms at 60fps
 * - Block: 4 frames = 67ms at 60fps
 * - Walk: 6 frames = 100ms at 60fps
 * - Hit: 4 frames = 67ms at 60fps
 * - Stance change: 36 frames = 600ms at 60fps
 * - Stance guards: 4-6 frames = breathing animation at 60fps
 * - Tactical steps: 18 frames = 300ms at 60fps, 30cm distance
 * 
 * Defensive animations (방어 애니메이션):
 * - Block Success (막기): 8 frames = 133ms - absorb impact, maintain guard
 * - Parry Deflect (받아넘기기): 10 frames = 167ms - redirect attack, counter window
 * - Guard Break (방어붕괴): 15 frames = 250ms - arms forced wide, vulnerable
 * - Guard Recovery (방어복구): 12 frames = 200ms - restore guard position
 * 
 * @korean 기본애니메이션설정
 */
export const DEFAULT_ANIMATION_CONFIGS: Map<AnimationState, AnimationConfig> =
  new Map<AnimationState, AnimationConfig>([
    [
      AnimationState.IDLE,
      {
        state: AnimationState.IDLE,
        frames: 4,
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      AnimationState.WALK,
      {
        state: AnimationState.WALK,
        frames: 6,
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 1 as AnimationPriority,
        duration: 6 / 60,
      },
    ],
    [
      AnimationState.RUN,
      {
        state: AnimationState.RUN,
        frames: 8,
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 2 as AnimationPriority,
        duration: 8 / 60,
      },
    ],
    [
      AnimationState.STANCE_CHANGE,
      {
        state: AnimationState.STANCE_CHANGE,
        frames: 36, // 600ms at 60fps
        fps: 60,
        loop: false,
        interruptible: false,
        priority: 3 as AnimationPriority,
        duration: 0.6,
        easing: "smooth-transition", // Smooth S-curve for stance changes
      },
    ],
    [
      AnimationState.STANCE_SIDE_SWITCH,
      {
        state: AnimationState.STANCE_SIDE_SWITCH,
        frames: 24, // 400ms at 60fps for left↔right switch
        fps: 60,
        loop: false,
        interruptible: false,
        priority: 3 as AnimationPriority,
        duration: 0.4,
      },
    ],
    [
      AnimationState.DEFEND,
      {
        state: AnimationState.DEFEND,
        frames: 4, // 67ms at 60fps
        fps: 60,
        loop: false,
        interruptible: true,
        priority: 4 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    // Defensive animations (방어 애니메이션) - Enhanced guard break system
    [
      AnimationState.DEFEND_BLOCK_SUCCESS,
      {
        state: AnimationState.DEFEND_BLOCK_SUCCESS,
        frames: 8, // 133ms at 60fps - absorb impact, maintain guard
        fps: 60,
        loop: false,
        interruptible: false, // Must complete block animation
        priority: 6 as AnimationPriority, // Higher than defend, same as hit
        duration: 0.133,
        easing: "controlled-slow", // Controlled deceleration for impact absorption
      },
    ],
    [
      AnimationState.DEFEND_PARRY,
      {
        state: AnimationState.DEFEND_PARRY,
        frames: 10, // 167ms at 60fps - redirect attack, open counter opportunity
        fps: 60,
        loop: false,
        interruptible: false, // Must complete parry animation
        priority: 7 as AnimationPriority, // Higher than block, creates counter window
        duration: 0.167,
        counterWindow: 0.2, // 200ms counter-attack opportunity after parry
      },
    ],
    [
      AnimationState.DEFEND_GUARD_BREAK,
      {
        state: AnimationState.DEFEND_GUARD_BREAK,
        frames: 15, // 250ms at 60fps - arms forced wide, vulnerable state
        fps: 60,
        loop: false,
        interruptible: false, // Cannot interrupt guard break
        priority: 8 as AnimationPriority, // Highest priority (same as fall)
        duration: 0.25,
        vulnerabilityDuration: 0.5, // 500ms vulnerable state after guard break
      },
    ],
    [
      AnimationState.DEFEND_RECOVERY,
      {
        state: AnimationState.DEFEND_RECOVERY,
        frames: 12, // 200ms at 60fps - restore guard position
        fps: 60,
        loop: false,
        interruptible: true, // Can be interrupted by attacks
        priority: 2 as AnimationPriority, // Same as run, lower than defend
        duration: 0.2,
        easing: "natural-motion", // Physics-based recovery
      },
    ],
    [
      AnimationState.ATTACK,
      {
        state: AnimationState.ATTACK,
        frames: 12, // 200ms at 60fps
        fps: 60,
        loop: false,
        interruptible: true,
        priority: STEP_PRIORITY,
        duration: 12 / 60,
        easing: "explosive-power", // Explosive acceleration for attacks
      },
    ],
    [
      AnimationState.HIT,
      {
        state: AnimationState.HIT,
        frames: 4, // 67ms at 60fps
        fps: 60,
        loop: false,
        interruptible: false,
        priority: 6 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      AnimationState.KO,
      {
        state: AnimationState.KO,
        frames: 30, // 500ms at 60fps
        fps: 60,
        loop: false,
        interruptible: false,
        priority: 7 as AnimationPriority,
        duration: 0.5,
      },
    ],
    // Fall animations (낙법 애니메이션) - Priority 8 (highest)
    [
      AnimationState.FALL_FORWARD,
      {
        state: AnimationState.FALL_FORWARD,
        frames: 24, // 400ms at 60fps - stumble forward, knee collapse, hands brace, face-down
        fps: 60,
        loop: false,
        interruptible: false,
        priority: 8 as AnimationPriority,
        duration: 0.4,
      },
    ],
    [
      AnimationState.FALL_BACKWARD,
      {
        state: AnimationState.FALL_BACKWARD,
        frames: 30, // 500ms at 60fps - backward stumble, sit, back impact, supine
        fps: 60,
        loop: false,
        interruptible: false,
        priority: 8 as AnimationPriority,
        duration: 0.5,
      },
    ],
    [
      AnimationState.FALL_SIDE_LEFT,
      {
        state: AnimationState.FALL_SIDE_LEFT,
        frames: 27, // 450ms at 60fps - rotation, shoulder roll, side sprawl
        fps: 60,
        loop: false,
        interruptible: false,
        priority: 8 as AnimationPriority,
        duration: 0.45,
      },
    ],
    [
      AnimationState.FALL_SIDE_RIGHT,
      {
        state: AnimationState.FALL_SIDE_RIGHT,
        frames: 27, // 450ms at 60fps - rotation, shoulder roll, side sprawl
        fps: 60,
        loop: false,
        interruptible: false,
        priority: 8 as AnimationPriority,
        duration: 0.45,
      },
    ],
    // Ground state animations (지면 자세) - Breathing loops
    [
      AnimationState.GROUND_PRONE,
      {
        state: AnimationState.GROUND_PRONE,
        frames: 4, // Breathing loop on ground (face down)
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      AnimationState.GROUND_SUPINE,
      {
        state: AnimationState.GROUND_SUPINE,
        frames: 4, // Breathing loop on ground (face up)
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      AnimationState.GROUND_SIDE_LEFT,
      {
        state: AnimationState.GROUND_SIDE_LEFT,
        frames: 4, // Breathing loop on ground (left side)
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      AnimationState.GROUND_SIDE_RIGHT,
      {
        state: AnimationState.GROUND_SIDE_RIGHT,
        frames: 4, // Breathing loop on ground (right side)
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    // Recovery animations (기상 애니메이션) - Priority 9 (higher than falls)
    [
      AnimationState.RECOVERY_PRONE_STANDUP,
      {
        state: AnimationState.RECOVERY_PRONE_STANDUP,
        frames: 30, // 500ms at 60fps - push up from prone, rise to standing
        fps: 60,
        loop: false,
        interruptible: false, // Last 6 frames (100ms) are interruptible
        priority: 9 as AnimationPriority,
        duration: 0.5,
      },
    ],
    [
      AnimationState.RECOVERY_SUPINE_STANDUP,
      {
        state: AnimationState.RECOVERY_SUPINE_STANDUP,
        frames: 36, // 600ms at 60fps - sit up, roll forward, stand
        fps: 60,
        loop: false,
        interruptible: false, // Last 6 frames (100ms) are interruptible
        priority: 9 as AnimationPriority,
        duration: 0.6,
      },
    ],
    [
      AnimationState.RECOVERY_ROLL,
      {
        state: AnimationState.RECOVERY_ROLL,
        frames: 24, // 400ms at 60fps - roll to side, spring to feet (quick recovery)
        fps: 60,
        loop: false,
        interruptible: false, // Last 6 frames (100ms) are interruptible
        priority: 9 as AnimationPriority,
        duration: 0.4,
      },
    ],
    [
      AnimationState.RECOVERY_DEFENSIVE,
      {
        state: AnimationState.RECOVERY_DEFENSIVE,
        frames: 42, // 700ms at 60fps - slow rise with guard up (vulnerable but defended)
        fps: 60,
        loop: false,
        interruptible: false, // Last 6 frames (100ms) are interruptible
        priority: 9 as AnimationPriority,
        duration: 0.7,
      },
    ],
    // 180-degree turn animations (180도 회전 애니메이션)
    [
      AnimationState.TURN_LEFT,
      {
        state: AnimationState.TURN_LEFT,
        frames: 12, // 200ms at 60fps for 180° turn
        fps: 60,
        loop: false,
        interruptible: false,
        priority: STEP_PRIORITY, // Same priority as attacks/steps - committed action
        duration: 12 / 60,
      },
    ],
    [
      AnimationState.TURN_RIGHT,
      {
        state: AnimationState.TURN_RIGHT,
        frames: 12, // 200ms at 60fps for 180° turn
        fps: 60,
        loop: false,
        interruptible: false,
        priority: STEP_PRIORITY, // Same priority as attacks/steps - committed action
        duration: 12 / 60,
      },
    ],
    // Stance-specific guard animations (팔괘 방어 자세)
    [
      AnimationState.STANCE_GUARD_GEON,
      {
        state: AnimationState.STANCE_GUARD_GEON,
        frames: 6, // Breathing animation
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 6 / 60,
      },
    ],
    [
      AnimationState.STANCE_GUARD_TAE,
      {
        state: AnimationState.STANCE_GUARD_TAE,
        frames: 6, // Breathing animation
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 6 / 60,
      },
    ],
    [
      AnimationState.STANCE_GUARD_LI,
      {
        state: AnimationState.STANCE_GUARD_LI,
        frames: 4, // Controlled breathing
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      AnimationState.STANCE_GUARD_JIN,
      {
        state: AnimationState.STANCE_GUARD_JIN,
        frames: 5, // Deep breathing
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 5 / 60,
      },
    ],
    [
      AnimationState.STANCE_GUARD_SON,
      {
        state: AnimationState.STANCE_GUARD_SON,
        frames: 6, // Rhythmic breathing
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 6 / 60,
      },
    ],
    [
      AnimationState.STANCE_GUARD_GAM,
      {
        state: AnimationState.STANCE_GUARD_GAM,
        frames: 6, // Flowing breathing
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 6 / 60,
      },
    ],
    [
      AnimationState.STANCE_GUARD_GAN,
      {
        state: AnimationState.STANCE_GUARD_GAN,
        frames: 4, // Steady breathing
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      AnimationState.STANCE_GUARD_GON,
      {
        state: AnimationState.STANCE_GUARD_GON,
        frames: 5, // Deep diaphragm breathing
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 5 / 60,
      },
    ],
    // Tactical step animations (전술적 발걸음)
    // 18 frames = 300ms at 60fps, 30cm distance per step
    [
      AnimationState.STEP_FORWARD,
      {
        state: AnimationState.STEP_FORWARD,
        frames: 18,
        fps: 60,
        loop: false,
        interruptible: false, // Non-interruptible for commitment
        priority: STEP_PRIORITY,
        duration: 0.3,
      },
    ],
    [
      AnimationState.STEP_BACK,
      {
        state: AnimationState.STEP_BACK,
        frames: 18,
        fps: 60,
        loop: false,
        interruptible: false,
        priority: STEP_PRIORITY,
        duration: 0.3,
      },
    ],
    [
      AnimationState.STEP_LEFT,
      {
        state: AnimationState.STEP_LEFT,
        frames: 18,
        fps: 60,
        loop: false,
        interruptible: false,
        priority: STEP_PRIORITY,
        duration: 0.3,
      },
    ],
    [
      AnimationState.STEP_RIGHT,
      {
        state: AnimationState.STEP_RIGHT,
        frames: 18,
        fps: 60,
        loop: false,
        interruptible: false,
        priority: STEP_PRIORITY,
        duration: 0.3,
      },
    ],
    [
      AnimationState.STEP_FORWARD_LEFT,
      {
        state: AnimationState.STEP_FORWARD_LEFT,
        frames: 18,
        fps: 60,
        loop: false,
        interruptible: false,
        priority: STEP_PRIORITY,
        duration: 0.3,
      },
    ],
    [
      AnimationState.STEP_FORWARD_RIGHT,
      {
        state: AnimationState.STEP_FORWARD_RIGHT,
        frames: 18,
        fps: 60,
        loop: false,
        interruptible: false,
        priority: STEP_PRIORITY,
        duration: 0.3,
      },
    ],
    [
      AnimationState.STEP_BACK_LEFT,
      {
        state: AnimationState.STEP_BACK_LEFT,
        frames: 18,
        fps: 60,
        loop: false,
        interruptible: false,
        priority: STEP_PRIORITY,
        duration: 0.3,
      },
    ],
    [
      AnimationState.STEP_BACK_RIGHT,
      {
        state: AnimationState.STEP_BACK_RIGHT,
        frames: 18,
        fps: 60,
        loop: false,
        interruptible: false,
        priority: STEP_PRIORITY,
        duration: 0.3,
      },
    ],
    // Footwork patterns (보법) - Korean martial arts specialized footwork
    // Circular step (원형보) - Lateral movement maintaining guard facing
    [
      AnimationState.FOOTWORK_CIRCULAR_LEFT,
      {
        state: AnimationState.FOOTWORK_CIRCULAR_LEFT,
        frames: 18, // 300ms at 60fps
        fps: 60,
        loop: false,
        interruptible: false, // Committed footwork
        priority: STEP_PRIORITY, // Same as tactical steps
        duration: 0.3,
      },
    ],
    [
      AnimationState.FOOTWORK_CIRCULAR_RIGHT,
      {
        state: AnimationState.FOOTWORK_CIRCULAR_RIGHT,
        frames: 18, // 300ms at 60fps
        fps: 60,
        loop: false,
        interruptible: false,
        priority: STEP_PRIORITY,
        duration: 0.3,
      },
    ],
    // Pivot step (축족회전) - Rotation on planted foot
    [
      AnimationState.FOOTWORK_PIVOT_LEFT,
      {
        state: AnimationState.FOOTWORK_PIVOT_LEFT,
        frames: 15, // 250ms at 60fps
        fps: 60,
        loop: false,
        interruptible: false,
        priority: STEP_PRIORITY,
        duration: 0.25,
      },
    ],
    [
      AnimationState.FOOTWORK_PIVOT_RIGHT,
      {
        state: AnimationState.FOOTWORK_PIVOT_RIGHT,
        frames: 15, // 250ms at 60fps
        fps: 60,
        loop: false,
        interruptible: false,
        priority: STEP_PRIORITY,
        duration: 0.25,
      },
    ],
    // Slide step (미끄럼보) - Both feet move together
    [
      AnimationState.FOOTWORK_SLIDE_FORWARD,
      {
        state: AnimationState.FOOTWORK_SLIDE_FORWARD,
        frames: 12, // 200ms at 60fps
        fps: 60,
        loop: false,
        interruptible: true, // Can be interrupted
        priority: 4 as AnimationPriority, // Same as defend
        duration: 0.2,
      },
    ],
    [
      AnimationState.FOOTWORK_SLIDE_BACK,
      {
        state: AnimationState.FOOTWORK_SLIDE_BACK,
        frames: 12, // 200ms at 60fps
        fps: 60,
        loop: false,
        interruptible: true,
        priority: 4 as AnimationPriority,
        duration: 0.2,
      },
    ],
    [
      AnimationState.FOOTWORK_SLIDE_LEFT,
      {
        state: AnimationState.FOOTWORK_SLIDE_LEFT,
        frames: 12, // 200ms at 60fps
        fps: 60,
        loop: false,
        interruptible: true,
        priority: 4 as AnimationPriority,
        duration: 0.2,
      },
    ],
    [
      AnimationState.FOOTWORK_SLIDE_RIGHT,
      {
        state: AnimationState.FOOTWORK_SLIDE_RIGHT,
        frames: 12, // 200ms at 60fps
        fps: 60,
        loop: false,
        interruptible: true,
        priority: 4 as AnimationPriority,
        duration: 0.2,
      },
    ],
    // Shuffle step (섞음보) - Quick micro-adjustment
    [
      AnimationState.FOOTWORK_SHUFFLE,
      {
        state: AnimationState.FOOTWORK_SHUFFLE,
        frames: 6, // 100ms at 60fps
        fps: 60,
        loop: false,
        interruptible: true,
        priority: 3 as AnimationPriority, // Same as stance_change
        duration: 0.1,
      },
    ],
  ]);

/**
 * Player Animation State Machine
 * 
 * Manages animation state, transitions, and timing with frame-accurate updates.
 * Integrates priority system and event callbacks.
 * 
 * @example
 * ```typescript
 * const machine = new PlayerAnimationStateMachine(DEFAULT_ANIMATION_CONFIGS, {
 *   onAnimationStart: (state) => console.log(`Started ${state}`),
 *   onAnimationComplete: (state) => console.log(`Completed ${state}`),
 *   onFrame: (frame, state) => {
 *     if (state === "attack" && frame === 6) {
 *       // Execute attack at midpoint (frame 6 of 12)
 *       executeAttackLogic();
 *     }
 *   }
 * });
 * 
 * // In game loop (useFrame)
 * useFrame((state, delta) => {
 *   const result = machine.update(delta);
 *   updatePlayerVisuals(result.state, result.frame);
 * });
 * 
 * // Trigger animations
 * machine.transitionTo("attack");
 * ```
 * 
 * @korean 플레이어애니메이션상태머신
 */
export class PlayerAnimationStateMachine {
  /**
   * Static mapping from TrigramStance to guard AnimationState
   * Prevents repeated object allocation in transitionToStanceGuard()
   * @korean 자세방어상태맵
   */
  private static readonly GUARD_STATE_MAP: Record<TrigramStance, AnimationState> = {
    [TrigramStance.GEON]: AnimationState.STANCE_GUARD_GEON,
    [TrigramStance.TAE]: AnimationState.STANCE_GUARD_TAE,
    [TrigramStance.LI]: AnimationState.STANCE_GUARD_LI,
    [TrigramStance.JIN]: AnimationState.STANCE_GUARD_JIN,
    [TrigramStance.SON]: AnimationState.STANCE_GUARD_SON,
    [TrigramStance.GAM]: AnimationState.STANCE_GUARD_GAM,
    [TrigramStance.GAN]: AnimationState.STANCE_GUARD_GAN,
    [TrigramStance.GON]: AnimationState.STANCE_GUARD_GON,
  };

  /**
   * Static reverse mapping from guard AnimationState to TrigramStance
   * Prevents repeated object allocation in getCurrentGuardStance()
   * @korean 방어상태자세맵
   */
  private static readonly STANCE_FROM_GUARD_MAP: Record<string, TrigramStance> = {
    [AnimationState.STANCE_GUARD_GEON]: TrigramStance.GEON,
    [AnimationState.STANCE_GUARD_TAE]: TrigramStance.TAE,
    [AnimationState.STANCE_GUARD_LI]: TrigramStance.LI,
    [AnimationState.STANCE_GUARD_JIN]: TrigramStance.JIN,
    [AnimationState.STANCE_GUARD_SON]: TrigramStance.SON,
    [AnimationState.STANCE_GUARD_GAM]: TrigramStance.GAM,
    [AnimationState.STANCE_GUARD_GAN]: TrigramStance.GAN,
    [AnimationState.STANCE_GUARD_GON]: TrigramStance.GON,
  };

  private currentState: AnimationState = AnimationState.IDLE;
  private frameIndex = 0;
  private timeAccumulator = 0;
  private previousState: AnimationState | null = null;
  private justStarted = false;
  private justCompleted = false;
  
  /**
   * Current stance transition data (null when not in stance_change animation)
   * 
   * **Korean**: 현재 자세 전환 데이터
   * 
   * Tracks the active stance transition for use during stance_change animation.
   * Provides access to keyframes and blend weights for smooth interpolation.
   * 
   * @korean 현재자세전환데이터
   */
  private currentStanceTransition: StanceTransition | null = null;

  /**
   * Motion prediction state for latency reduction
   * 
   * **Korean**: 동작 예측 상태
   * 
   * Tracks animation velocities for motion prediction to reduce perceived latency.
   * Updated each frame with velocity calculations for smooth anticipation.
   * 
   * @korean 동작예측상태
   */
  private motionPrediction: MotionPredictionState = createMotionPredictionState();

  /**
   * Enable motion prediction for latency reduction
   * 
   * **Korean**: 동작 예측 활성화
   * 
   * When enabled, predicts future animation frames based on current velocity
   * to reduce perceived input latency by 16-33ms (1-2 frames at 60fps).
   * 
   * @korean 동작예측활성화
   */
  private enableMotionPrediction: boolean = false;

  /**
   * Motion prediction time ahead (seconds)
   * 
   * **Korean**: 예측 시간
   * 
   * How far ahead to predict motion (default: 1 frame = 16.67ms at 60fps).
   * Typical range: 0.016-0.033 seconds for <50ms total latency.
   * 
   * @korean 예측시간
   */
  private predictionTimeAhead: number = 0.01667; // 1 frame at 60fps
  
  /**
   * Previous keyframe for motion prediction velocity calculation
   * 
   * **Korean**: 이전 키프레임
   * 
   * @korean 이전키프레임
   */
  private previousKeyframe: any = null; // Will store AnimationKeyframe when available

  /**
   * Preferred easing function for smooth transitions
   * 
   * **Korean**: 선호 이징 함수
   * 
   * Default easing curve for animation blending and transitions.
   * Can be overridden per animation or transition.
   * 
   * @korean 선호이징함수
   */
  private preferredEasing: EasingName = "natural-motion";

  /**
   * Create a new animation state machine
   * 
   * @param animations - Map of animation configurations
   * @param events - Optional event callbacks
   * 
   * @korean 생성자
   */
  constructor(
    private readonly animations: Map<AnimationState, AnimationConfig>,
    private readonly events?: AnimationEvents
  ) {}

  /**
   * Update animation state with delta time
   * 
   * Call this in useFrame for 60fps updates.
   * Handles frame progression, looping, and completion.
   * 
   * @param deltaTime - Time elapsed since last update (in seconds)
   * @returns Animation update result with current state and frame
   * 
   * @korean 업데이트
   */
  update(deltaTime: number): AnimationUpdateResult {
    const currentAnim = this.animations.get(this.currentState);
    if (!currentAnim) {
      return {
        state: this.currentState,
        frame: 0,
        progress: 0,
        justCompleted: false,
        justStarted: false,
      };
    }

    // Reset just started/completed flags
    const wasJustStarted = this.justStarted;
    this.justStarted = false;
    const previousJustCompleted = this.justCompleted;
    this.justCompleted = false;

    // Accumulate time
    this.timeAccumulator += deltaTime;
    const frameDuration = 1 / currentAnim.fps;

    // Check if we should advance to next frame
    if (this.timeAccumulator >= frameDuration) {
      const previousFrame = this.frameIndex;
      this.frameIndex++;
      this.timeAccumulator -= frameDuration;

      // Emit frame event
      if (this.events?.onFrame && previousFrame !== this.frameIndex) {
        this.events.onFrame(this.frameIndex, this.currentState);
      }

      // Handle animation completion
      if (this.frameIndex >= currentAnim.frames) {
        if (currentAnim.loop) {
          // Loop back to start
          this.frameIndex = 0;
        } else {
          // Animation completed
          this.justCompleted = true;
          if (this.events?.onAnimationComplete) {
            this.events.onAnimationComplete(this.currentState);
          }

          // Auto-transition logic
          // Fall animations transition to ground states using the mapping
          if (this.currentState.startsWith("fall_")) {
            const fallType = this.currentState.replace("fall_", "");
            
            // Validate that fallType is a valid FallType before using in map
            if (fallType === "forward" || fallType === "backward" || 
                fallType === "side_left" || fallType === "side_right") {
              const groundState = FALL_TO_GROUND_MAP[fallType as FallType];
              const groundAnimKey = `ground_${groundState}`;

              // Validate that the constructed ground animation state actually exists
              if (DEFAULT_ANIMATION_CONFIGS.has(groundAnimKey as AnimationState)) {
                const groundAnimState = groundAnimKey as AnimationState;

                this.previousState = this.currentState;
                this.currentState = groundAnimState;
                this.frameIndex = 0;
                this.timeAccumulator = 0;
                this.justStarted = true;

                if (this.events?.onAnimationStart) {
                  this.events.onAnimationStart(groundAnimState);
                }
              } else {
                // Fallback: if mapping is invalid, safely transition to idle
                // instead of entering an undefined animation state.
                console.warn(
                  "[AnimationStateMachine] Invalid ground animation mapping for fall type:",
                  fallType,
                  "->",
                  groundAnimKey
                );
                this.previousState = this.currentState;
                this.currentState = AnimationState.IDLE;
                this.frameIndex = 0;
                this.timeAccumulator = 0;
                this.justStarted = true;

                if (this.events?.onAnimationStart) {
                  this.events.onAnimationStart(AnimationState.IDLE);
                }
              }
            } else {
              // Invalid fall type - fallback to idle
              console.warn(
                "[AnimationStateMachine] Invalid fall animation state:",
                this.currentState
              );
              this.previousState = this.currentState;
              this.currentState = AnimationState.IDLE;
              this.frameIndex = 0;
              this.timeAccumulator = 0;
              this.justStarted = true;

              if (this.events?.onAnimationStart) {
                this.events.onAnimationStart(AnimationState.IDLE);
              }
            }
          }
          // Recovery animations transition to idle when complete
          else if (this.currentState.startsWith("recovery_")) {
            this.previousState = this.currentState;
            this.currentState = AnimationState.IDLE;
            this.frameIndex = 0;
            this.timeAccumulator = 0;
            this.justStarted = true;

            if (this.events?.onAnimationStart) {
              this.events.onAnimationStart(AnimationState.IDLE);
            }
          }
          // Non-fall, non-recovery, non-looping animations transition to idle
          else if (this.currentState !== AnimationState.IDLE && 
                   this.currentState !== AnimationState.KO &&
                   !this.currentState.startsWith("ground_")) {
            // Clear stance transition data if completing stance_change
            if (this.currentState === AnimationState.STANCE_CHANGE) {
              this.clearStanceTransition();
            }
            
            // Direct transition to idle without interrupt event
            this.previousState = this.currentState;
            this.currentState = AnimationState.IDLE;
            this.frameIndex = 0;
            this.timeAccumulator = 0;
            this.justStarted = true;

            if (this.events?.onAnimationStart) {
              this.events.onAnimationStart(AnimationState.IDLE);
            }
          } else {
            // Stay on last frame (for ko and ground states)
            this.frameIndex = currentAnim.frames - 1;
          }
        }
      }
    }

    const progress = currentAnim.frames > 0 ? this.frameIndex / currentAnim.frames : 0;

    return {
      state: this.currentState,
      frame: this.frameIndex,
      progress,
      justCompleted: previousJustCompleted,
      justStarted: wasJustStarted,
    };
  }

  /**
   * Attempt to transition to a new animation state
   * 
   * Checks transition rules and priority system before transitioning.
   * 
   * @param newState - Target animation state
   * @returns Whether transition was successful
   * 
   * @example
   * ```typescript
   * // Successful transitions
   * machine.transitionTo("walk"); // idle -> walk
   * machine.transitionTo("attack"); // walk -> attack
   * 
   * // Failed transition (invalid or lower priority)
   * machine.transitionTo("walk"); // attack -> walk (blocked, must complete first)
   * ```
   * 
   * @korean 상태전환
   */
  transitionTo(newState: AnimationState): boolean {
    // Don't transition to same state
    if (this.currentState === newState) {
      return false;
    }

    // Check if transition is allowed by rules
    if (!isTransitionAllowed(this.currentState, newState)) {
      return false;
    }

    const currentAnim = this.animations.get(this.currentState);
    const newAnim = this.animations.get(newState);

    if (!newAnim) {
      return false;
    }

    // Check priority system
    if (
      currentAnim &&
      !canInterrupt(this.currentState, newState, currentAnim.interruptible)
    ) {
      return false;
    }

    // Emit interrupt event if current animation wasn't completed
    if (this.frameIndex < (currentAnim?.frames ?? 0) - 1) {
      if (this.events?.onAnimationInterrupted) {
        this.events.onAnimationInterrupted(this.currentState, newState);
      }
    }

    // Clear stance transition data if interrupting stance_change
    if (this.currentState === AnimationState.STANCE_CHANGE) {
      this.clearStanceTransition();
    }

    // Execute transition
    this.previousState = this.currentState;
    this.currentState = newState;
    this.frameIndex = 0;
    this.timeAccumulator = 0;
    this.justStarted = true;
    this.justCompleted = false;

    // Emit start event
    if (this.events?.onAnimationStart) {
      this.events.onAnimationStart(newState);
    }

    return true;
  }

  /**
   * Get current animation state
   * 
   * @returns Current animation state
   * @korean 현재상태가져오기
   */
  getCurrentState(): AnimationState {
    return this.currentState;
  }

  /**
   * Get current frame index
   * 
   * @returns Current frame index (0 to frames-1)
   * @korean 현재프레임가져오기
   */
  getCurrentFrame(): number {
    return this.frameIndex;
  }

  /**
   * Get previous animation state
   * 
   * @returns Previous animation state or null
   * @korean 이전상태가져오기
   */
  getPreviousState(): AnimationState | null {
    return this.previousState;
  }

  /**
   * Get current animation configuration
   * 
   * @returns Current animation config or undefined
   * @korean 현재애니메이션설정가져오기
   */
  getCurrentAnimation(): AnimationConfig | undefined {
    return this.animations.get(this.currentState);
  }

  /**
   * Reset animation state machine to idle
   * 
   * @korean 초기화
   */
  reset(): void {
    this.currentState = AnimationState.IDLE;
    this.frameIndex = 0;
    this.timeAccumulator = 0;
    this.previousState = null;
    this.justStarted = false;
    this.justCompleted = false;
  }

  /**
   * Get full internal state (for debugging/testing)
   * 
   * @returns Current state machine state
   * @korean 상태가져오기
   */
  getState(): AnimationMachineState {
    return {
      currentState: this.currentState,
      frameIndex: this.frameIndex,
      timeAccumulator: this.timeAccumulator,
      isPlaying: true,
      previousState: this.previousState,
    };
  }

  /**
   * Transition to stance-specific guard animation
   * 
   * Convenience method to transition to a stance guard based on trigram stance.
   * Automatically maps trigram stance to corresponding guard animation state.
   * 
   * @param stance - Trigram stance identifier
   * @returns Whether transition was successful
   * 
   * @example
   * ```typescript
   * // When player changes to Fire stance
   * machine.transitionToStanceGuard(TrigramStance.LI);
   * // Internally transitions to "stance_guard_li" animation state
   * ```
   * 
   * @korean 자세방어전환
   */
  transitionToStanceGuard(stance: TrigramStance): boolean {
    const guardAnimationState = PlayerAnimationStateMachine.GUARD_STATE_MAP[stance];
    
    // Verify the guard animation exists in our configs
    if (!guardAnimationState || !this.animations.has(guardAnimationState)) {
      console.warn(`No guard animation configured for stance: ${stance}`);
      return false;
    }

    return this.transitionTo(guardAnimationState);
  }

  /**
   * Check if current animation is a stance guard
   * 
   * @returns True if currently in a stance guard animation
   * @korean 자세방어상태확인
   */
  isInStanceGuard(): boolean {
    return this.currentState.startsWith("stance_guard_");
  }

  /**
   * Get current guard stance if in a guard animation
   * 
   * @returns Trigram stance or null if not in guard
   * @korean 현재방어자세가져오기
   */
  getCurrentGuardStance(): TrigramStance | null {
    if (!this.isInStanceGuard()) {
      return null;
    }

    const stance = PlayerAnimationStateMachine.STANCE_FROM_GUARD_MAP[this.currentState];
    
    // Validate that we got a valid stance
    if (!stance) {
      console.warn(`Invalid guard state detected: ${this.currentState}`);
      return null;
    }

    return stance;
  }

  /**
   * Transition to stance_change animation with specific stance transition data
   * 
   * **Korean**: 자세 전환 애니메이션 시작
   * 
   * Initiates a stance change animation with the specific transition data
   * from the 64-transition matrix. This provides stance-specific keyframes
   * and blend weights for smooth interpolation.
   * 
   * @param fromStance - Source trigram stance
   * @param toStance - Target trigram stance
   * @returns Whether transition was successful
   * 
   * @example
   * ```typescript
   * // Start transition from Heaven to Lake stance
   * const success = machine.transitionToStanceChange(
   *   TrigramStance.GEON, 
   *   TrigramStance.TAE
   * );
   * 
   * if (success) {
   *   // During update loop, use getStanceTransitionBlend() to interpolate
   *   const blend = machine.getStanceTransitionBlend();
   *   if (blend) {
   *     // Apply blend weights to stance poses
   *     applyStanceBlend(blend);
   *   }
   * }
   * ```
   * 
   * @korean 자세전환애니메이션시작
   */
  transitionToStanceChange(
    fromStance: TrigramStance,
    toStance: TrigramStance
  ): boolean {
    // Get the specific transition data from the 64-transition matrix
    const transitionData = getStanceTransition(fromStance, toStance);
    
    if (!transitionData) {
      console.warn(
        `[AnimationStateMachine] No transition data found for ${fromStance} -> ${toStance}`
      );
      return false;
    }

    // Store current transition data in case we need to restore it
    const previousTransitionData = this.currentStanceTransition;

    // Temporarily set the new transition data
    this.currentStanceTransition = transitionData;

    // Initiate the stance_change animation
    const success = this.transitionTo(AnimationState.STANCE_CHANGE);

    // If transition failed, restore previous transition data
    if (!success) {
      this.currentStanceTransition = previousTransitionData;
    }

    return success;
  }

  /**
   * Get current stance transition data
   * 
   * **Korean**: 현재 자세 전환 데이터 가져오기
   * 
   * Returns the active stance transition data during stance_change animation.
   * Null if not currently in a stance transition.
   * 
   * @returns Current stance transition or null
   * 
   * @korean 현재자세전환데이터가져오기
   */
  getCurrentStanceTransition(): StanceTransition | null {
    return this.currentStanceTransition;
  }

  /**
   * Get interpolated blend weights for current stance transition frame
   * 
   * **Korean**: 현재 프레임 블렌드 가중치
   * 
   * Returns the interpolated blend data for the current frame during
   * stance_change animation. Uses the keyframe data from the transition
   * matrix to provide smooth stance interpolation.
   * 
   * @returns Blend data with stance and weight, or null if not in transition
   * 
   * @example
   * ```typescript
   * // In rendering loop during stance transition
   * const blend = machine.getStanceTransitionBlend();
   * if (blend) {
   *   console.log(`Frame ${blend.frame}: ${blend.stance} at ${blend.blend}x weight`);
   *   // Apply blended pose: blend.blend * targetPose + (1 - blend.blend) * sourcePose
   * }
   * ```
   * 
   * @korean 현재프레임블렌드가중치
   */
  getStanceTransitionBlend(): {
    frame: number;
    stance: TrigramStance | 'neutral';
    blend: number;
  } | null {
    // Only valid during stance_change animation
    if (this.currentState !== AnimationState.STANCE_CHANGE || !this.currentStanceTransition) {
      return null;
    }

    const keyframes = this.currentStanceTransition.keyframes;
    const currentFrame = this.frameIndex;

    // Find the two keyframes to interpolate between
    let prevKeyframe = keyframes[0];
    let nextKeyframe = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (keyframes[i].frame <= currentFrame && keyframes[i + 1].frame > currentFrame) {
        prevKeyframe = keyframes[i];
        nextKeyframe = keyframes[i + 1];
        break;
      }
    }

    // If we're exactly on a keyframe, return it directly
    const exactKeyframe = keyframes.find(kf => kf.frame === currentFrame);
    if (exactKeyframe) {
      return {
        frame: currentFrame,
        stance: exactKeyframe.stance,
        blend: exactKeyframe.blend,
      };
    }

    // Linear interpolation between keyframes
    const frameRange = nextKeyframe.frame - prevKeyframe.frame;
    const frameProgress = frameRange > 0 
      ? (currentFrame - prevKeyframe.frame) / frameRange 
      : 0;

    const interpolatedBlend = 
      prevKeyframe.blend + (nextKeyframe.blend - prevKeyframe.blend) * frameProgress;

    // Use the next keyframe's stance as we're transitioning towards it
    return {
      frame: currentFrame,
      stance: nextKeyframe.stance,
      blend: interpolatedBlend,
    };
  }

  /**
   * Check if currently in a stance transition animation
   * 
   * **Korean**: 자세 전환 중 확인
   * 
   * @returns True if currently executing a stance_change animation
   * @korean 자세전환중확인
   */
  isInStanceTransition(): boolean {
    return this.currentState === AnimationState.STANCE_CHANGE && this.currentStanceTransition !== null;
  }

  /**
   * Clear stance transition data (called automatically when transition completes)
   * 
   * **Korean**: 자세 전환 데이터 초기화
   * 
   * @internal
   * @korean 자세전환데이터초기화
   */
  private clearStanceTransition(): void {
    this.currentStanceTransition = null;
  }

  /**
   * Enable or disable motion prediction
   * 
   * **Korean**: 동작 예측 설정
   * 
   * Enables motion prediction to reduce perceived input latency by predicting
   * future animation frames based on current velocity (1-2 frames ahead).
   * 
   * @param enabled - Whether to enable motion prediction
   * @param predictionTime - Optional: time ahead to predict (default: 16.67ms)
   * 
   * @example
   * ```typescript
   * // Enable motion prediction for 1 frame (16.67ms at 60fps)
   * machine.setMotionPrediction(true);
   * 
   * // Enable with 2 frames prediction (33.33ms)
   * machine.setMotionPrediction(true, 0.03333);
   * ```
   * 
   * @korean 동작예측설정
   */
  setMotionPrediction(enabled: boolean, predictionTime?: number): void {
    this.enableMotionPrediction = enabled;
    if (predictionTime !== undefined) {
      // Clamp to 50ms maximum for <50ms total latency
      this.predictionTimeAhead = Math.min(predictionTime, 0.05);
    }
  }

  /**
   * Get motion prediction state
   * 
   * **Korean**: 동작 예측 상태 가져오기
   * 
   * @returns Current motion prediction state
   * @korean 동작예측상태가져오기
   */
  getMotionPredictionState(): MotionPredictionState {
    return this.motionPrediction;
  }

  /**
   * Check if motion prediction is enabled
   * 
   * **Korean**: 동작 예측 활성화 확인
   * 
   * @returns True if motion prediction is enabled
   * @korean 동작예측활성화확인
   */
  isMotionPredictionEnabled(): boolean {
    return this.enableMotionPrediction;
  }

  /**
   * Set preferred easing function for transitions
   * 
   * **Korean**: 선호 이징 함수 설정
   * 
   * Sets the default easing curve for animation transitions.
   * Can use presets like "natural-motion", "smooth-transition", etc.
   * 
   * @param easingName - Easing function name
   * 
   * @example
   * ```typescript
   * // Use natural motion for Korean martial arts
   * machine.setPreferredEasing("natural-motion");
   * 
   * // Use explosive power for strike animations
   * machine.setPreferredEasing("explosive-power");
   * ```
   * 
   * @korean 선호이징함수설정
   */
  setPreferredEasing(easingName: EasingName): void {
    this.preferredEasing = easingName;
  }

  /**
   * Get preferred easing function
   * 
   * **Korean**: 선호 이징 함수 가져오기
   * 
   * @returns Current preferred easing name
   * @korean 선호이징함수가져오기
   */
  getPreferredEasing(): EasingName {
    return this.preferredEasing;
  }

  /**
   * Update motion prediction with skeletal keyframe data
   * 
   * **Korean**: 동작 예측 업데이트
   * 
   * This should be called from the skeletal animation layer when applying
   * interpolated keyframes to the rig. It updates velocity tracking for
   * motion prediction to reduce perceived latency.
   * 
   * Integration point: Call this from your skeletal animation system after
   * computing the current interpolated keyframe (e.g., from getInterpolatedKeyframe).
   * 
   * @param currentKeyframe - Current skeletal animation keyframe with bone positions/rotations
   * @param deltaTime - Time elapsed since last update
   * 
   * @example
   * ```typescript
   * // In your skeletal animation update loop:
   * const currentKeyframe = getInterpolatedKeyframe(animation, time);
   * 
   * // Update motion prediction (for next frame)
   * if (machine.isMotionPredictionEnabled()) {
   *   machine.updateMotionPredictionState(currentKeyframe, deltaTime);
   * }
   * 
   * // Apply keyframe to rig
   * applyKeyframeToRig(rig, currentKeyframe);
   * ```
   * 
   * @korean 동작예측업데이트
   */
  updateMotionPredictionState(currentKeyframe: any, deltaTime: number): void {
    if (!this.enableMotionPrediction) {
      return;
    }

    // Update velocity tracking if we have a previous keyframe
    if (this.previousKeyframe) {
      this.motionPrediction = updateMotionPrediction(
        this.motionPrediction,
        this.previousKeyframe,
        currentKeyframe,
        deltaTime
      );
    }

    // Store current keyframe for next update
    this.previousKeyframe = currentKeyframe;
  }

  /**
   * Get predicted future keyframe for latency reduction
   * 
   * **Korean**: 예측된 미래 키프레임 가져오기
   * 
   * Returns a keyframe predicted ahead by predictionTimeAhead (default: 1 frame).
   * This reduces perceived input latency by showing where the animation will be
   * in the near future rather than where it currently is.
   * 
   * Integration point: Use this instead of the current keyframe when applying
   * to the rig if motion prediction is enabled.
   * 
   * @param currentKeyframe - Current skeletal animation keyframe
   * @returns Predicted future keyframe, or current if prediction disabled
   * 
   * @example
   * ```typescript
   * // In your skeletal animation update loop:
   * let keyframeToApply = currentKeyframe;
   * 
   * if (machine.isMotionPredictionEnabled()) {
   *   keyframeToApply = machine.getPredictedKeyframe(currentKeyframe);
   * }
   * 
   * applyKeyframeToRig(rig, keyframeToApply);
   * ```
   * 
   * @korean 예측키프레임가져오기
   */
  getPredictedKeyframe(currentKeyframe: any): any {
    if (!this.enableMotionPrediction || !this.previousKeyframe) {
      return currentKeyframe;
    }

    return predictFutureKeyframe(
      currentKeyframe,
      this.motionPrediction,
      this.predictionTimeAhead
    );
  }
}
