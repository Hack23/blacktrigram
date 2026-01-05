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
import { isTransitionAllowed } from "./AnimationTransitions";
import { TrigramStance } from "../../types/common";
import type {
  AnimationConfig,
  AnimationEvents,
  AnimationMachineState,
  AnimationPriority,
  AnimationState,
  AnimationUpdateResult,
  FallType,
} from "./types";
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
 * 
 * @korean 기본애니메이션설정
 */
export const DEFAULT_ANIMATION_CONFIGS: Map<AnimationState, AnimationConfig> =
  new Map([
    [
      "idle",
      {
        state: "idle",
        frames: 4,
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      "walk",
      {
        state: "walk",
        frames: 6,
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 1 as AnimationPriority,
        duration: 6 / 60,
      },
    ],
    [
      "run",
      {
        state: "run",
        frames: 8,
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 2 as AnimationPriority,
        duration: 8 / 60,
      },
    ],
    [
      "stance_change",
      {
        state: "stance_change",
        frames: 36, // 600ms at 60fps
        fps: 60,
        loop: false,
        interruptible: false,
        priority: 3 as AnimationPriority,
        duration: 0.6,
      },
    ],
    [
      "stance_side_switch",
      {
        state: "stance_side_switch",
        frames: 24, // 400ms at 60fps for left↔right switch
        fps: 60,
        loop: false,
        interruptible: false,
        priority: 3 as AnimationPriority,
        duration: 0.4,
      },
    ],
    [
      "defend",
      {
        state: "defend",
        frames: 4, // 67ms at 60fps
        fps: 60,
        loop: false,
        interruptible: true,
        priority: 4 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      "attack",
      {
        state: "attack",
        frames: 12, // 200ms at 60fps
        fps: 60,
        loop: false,
        interruptible: true,
        priority: 5 as AnimationPriority,
        duration: 12 / 60,
      },
    ],
    [
      "hit",
      {
        state: "hit",
        frames: 4, // 67ms at 60fps
        fps: 60,
        loop: false,
        interruptible: false,
        priority: 6 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      "ko",
      {
        state: "ko",
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
      "fall_forward",
      {
        state: "fall_forward",
        frames: 24, // 400ms at 60fps - stumble forward, knee collapse, hands brace, face-down
        fps: 60,
        loop: false,
        interruptible: false,
        priority: 8 as AnimationPriority,
        duration: 0.4,
      },
    ],
    [
      "fall_backward",
      {
        state: "fall_backward",
        frames: 30, // 500ms at 60fps - backward stumble, sit, back impact, supine
        fps: 60,
        loop: false,
        interruptible: false,
        priority: 8 as AnimationPriority,
        duration: 0.5,
      },
    ],
    [
      "fall_side_left",
      {
        state: "fall_side_left",
        frames: 27, // 450ms at 60fps - rotation, shoulder roll, side sprawl
        fps: 60,
        loop: false,
        interruptible: false,
        priority: 8 as AnimationPriority,
        duration: 0.45,
      },
    ],
    [
      "fall_side_right",
      {
        state: "fall_side_right",
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
      "ground_prone",
      {
        state: "ground_prone",
        frames: 4, // Breathing loop on ground (face down)
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      "ground_supine",
      {
        state: "ground_supine",
        frames: 4, // Breathing loop on ground (face up)
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      "ground_side_left",
      {
        state: "ground_side_left",
        frames: 4, // Breathing loop on ground (left side)
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      "ground_side_right",
      {
        state: "ground_side_right",
        frames: 4, // Breathing loop on ground (right side)
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    // Stance-specific guard animations (팔괘 방어 자세)
    [
      "stance_guard_geon",
      {
        state: "stance_guard_geon",
        frames: 6, // Breathing animation
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 6 / 60,
      },
    ],
    [
      "stance_guard_tae",
      {
        state: "stance_guard_tae",
        frames: 6, // Breathing animation
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 6 / 60,
      },
    ],
    [
      "stance_guard_li",
      {
        state: "stance_guard_li",
        frames: 4, // Controlled breathing
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      "stance_guard_jin",
      {
        state: "stance_guard_jin",
        frames: 5, // Deep breathing
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 5 / 60,
      },
    ],
    [
      "stance_guard_son",
      {
        state: "stance_guard_son",
        frames: 6, // Rhythmic breathing
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 6 / 60,
      },
    ],
    [
      "stance_guard_gam",
      {
        state: "stance_guard_gam",
        frames: 6, // Flowing breathing
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 6 / 60,
      },
    ],
    [
      "stance_guard_gan",
      {
        state: "stance_guard_gan",
        frames: 4, // Steady breathing
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 4 / 60,
      },
    ],
    [
      "stance_guard_gon",
      {
        state: "stance_guard_gon",
        frames: 5, // Deep diaphragm breathing
        fps: 60,
        loop: true,
        interruptible: true,
        priority: 0 as AnimationPriority,
        duration: 5 / 60,
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
    [TrigramStance.GEON]: "stance_guard_geon",
    [TrigramStance.TAE]: "stance_guard_tae",
    [TrigramStance.LI]: "stance_guard_li",
    [TrigramStance.JIN]: "stance_guard_jin",
    [TrigramStance.SON]: "stance_guard_son",
    [TrigramStance.GAM]: "stance_guard_gam",
    [TrigramStance.GAN]: "stance_guard_gan",
    [TrigramStance.GON]: "stance_guard_gon",
  };

  /**
   * Static reverse mapping from guard AnimationState to TrigramStance
   * Prevents repeated object allocation in getCurrentGuardStance()
   * @korean 방어상태자세맵
   */
  private static readonly STANCE_FROM_GUARD_MAP: Record<string, TrigramStance> = {
    "stance_guard_geon": TrigramStance.GEON,
    "stance_guard_tae": TrigramStance.TAE,
    "stance_guard_li": TrigramStance.LI,
    "stance_guard_jin": TrigramStance.JIN,
    "stance_guard_son": TrigramStance.SON,
    "stance_guard_gam": TrigramStance.GAM,
    "stance_guard_gan": TrigramStance.GAN,
    "stance_guard_gon": TrigramStance.GON,
  };

  private currentState: AnimationState = "idle";
  private frameIndex = 0;
  private timeAccumulator = 0;
  private previousState: AnimationState | null = null;
  private justStarted = false;
  private justCompleted = false;

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
            const fallType = this.currentState.replace("fall_", "") as FallType;
            const groundState = FALL_TO_GROUND_MAP[fallType];
            const groundAnimState = `ground_${groundState}` as AnimationState;
            
            this.previousState = this.currentState;
            this.currentState = groundAnimState;
            this.frameIndex = 0;
            this.timeAccumulator = 0;
            this.justStarted = true;

            if (this.events?.onAnimationStart) {
              this.events.onAnimationStart(groundAnimState);
            }
          }
          // Non-fall, non-looping animations transition to idle
          else if (this.currentState !== "idle" && 
                   this.currentState !== "ko" &&
                   !this.currentState.startsWith("ground_")) {
            // Direct transition to idle without interrupt event
            this.previousState = this.currentState;
            this.currentState = "idle";
            this.frameIndex = 0;
            this.timeAccumulator = 0;
            this.justStarted = true;

            if (this.events?.onAnimationStart) {
              this.events.onAnimationStart("idle");
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
    this.currentState = "idle";
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
}
