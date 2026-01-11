/**
 * Animation priority system for Black Trigram
 * 
 * Determines which animations can interrupt others based on priority levels.
 * Higher priority animations can interrupt lower priority ones.
 * 
 * Priority order: recovery > fall > ko > hit > attack > defend > stance_change > movement > idle
 * 
 * Enhanced with:
 * - Deterministic conflict resolution for simultaneous equal-priority animations
 * - Animation queue system for pending animations
 * - Interruptibility windows (frame-based interrupt control)
 * - Korean terminology for all priority levels and conflicts
 * 
 * @module systems/animation/AnimationPriority
 * @category Animation
 * @korean 애니메이션우선순위
 */

import { AnimationPriority, AnimationState, STEP_PRIORITY } from "./types";

/**
 * Map animation states to their priority levels
 * 
 * Stance guard animations have same priority as idle (0) since they are
 * also idle states, just stance-specific.
 * Tactical steps have priority 5 (same as attacks) to ensure commitment.
 * 
 * @korean 애니메이션우선순위맵
 */
export const ANIMATION_PRIORITY_MAP: Record<AnimationState, AnimationPriority> = {
  idle: AnimationPriority.IDLE,
  walk: AnimationPriority.WALK,
  run: AnimationPriority.RUN,
  stance_change: AnimationPriority.STANCE_CHANGE,
  stance_side_switch: AnimationPriority.STANCE_CHANGE, // Same priority as stance_change
  defend: AnimationPriority.DEFEND,
  // Defensive animations (방어 애니메이션)
  defend_block_success: AnimationPriority.HIT, // Priority 6 - same as hit
  defend_parry: AnimationPriority.KO, // Priority 7 - higher than block
  defend_guard_break: AnimationPriority.FALL, // Priority 8 - highest (same as fall)
  defend_recovery: AnimationPriority.RUN, // Priority 2 - interruptible recovery
  attack: AnimationPriority.ATTACK,
  hit: AnimationPriority.HIT,
  ko: AnimationPriority.KO,
  // Stance-specific guard animations (팔괘 방어 자세)
  stance_guard_geon: AnimationPriority.IDLE,
  stance_guard_tae: AnimationPriority.IDLE,
  stance_guard_li: AnimationPriority.IDLE,
  stance_guard_jin: AnimationPriority.IDLE,
  stance_guard_son: AnimationPriority.IDLE,
  stance_guard_gam: AnimationPriority.IDLE,
  stance_guard_gan: AnimationPriority.IDLE,
  stance_guard_gon: AnimationPriority.IDLE,
  // Tactical step animations (전술적 발걸음) - non-interruptible
  step_forward: STEP_PRIORITY,
  step_back: STEP_PRIORITY,
  step_left: STEP_PRIORITY,
  step_right: STEP_PRIORITY,
  step_forward_left: STEP_PRIORITY,
  step_forward_right: STEP_PRIORITY,
  step_back_left: STEP_PRIORITY,
  step_back_right: STEP_PRIORITY,
  // Fall animations (낙법) - highest priority
  fall_forward: AnimationPriority.FALL,
  fall_backward: AnimationPriority.FALL,
  fall_side_left: AnimationPriority.FALL,
  fall_side_right: AnimationPriority.FALL,
  // Ground states (지면 자세) - idle priority
  ground_prone: AnimationPriority.IDLE,
  ground_supine: AnimationPriority.IDLE,
  ground_side_left: AnimationPriority.IDLE,
  ground_side_right: AnimationPriority.IDLE,
  // 180-degree turn animations (180도 회전) - same as steps (committed action)
  turn_left: STEP_PRIORITY,
  turn_right: STEP_PRIORITY,
  // Footwork patterns (보법) - Korean martial arts specialized footwork
  footwork_circular_left: STEP_PRIORITY,
  footwork_circular_right: STEP_PRIORITY,
  footwork_pivot_left: STEP_PRIORITY,
  footwork_pivot_right: STEP_PRIORITY,
  footwork_slide_forward: AnimationPriority.DEFEND,
  footwork_slide_back: AnimationPriority.DEFEND,
  footwork_slide_left: AnimationPriority.DEFEND,
  footwork_slide_right: AnimationPriority.DEFEND,
  footwork_shuffle: AnimationPriority.STANCE_CHANGE,
  // Recovery animations (기상 애니메이션) - highest priority (can interrupt anything)
  recovery_prone_standup: AnimationPriority.RECOVERY,
  recovery_supine_standup: AnimationPriority.RECOVERY,
  recovery_roll: AnimationPriority.RECOVERY,
  recovery_defensive: AnimationPriority.RECOVERY,
};

/**
 * Check if an animation can interrupt another based on priority
 * 
 * @param current - Current animation state
 * @param requested - Requested animation state
 * @param currentInterruptible - Whether current animation is interruptible
 * @returns Whether the requested animation can interrupt the current one
 * 
 * @example
 * ```typescript
 * // Hit can interrupt attack
 * canInterrupt("attack", "hit", true); // true
 * 
 * // Attack cannot interrupt hit
 * canInterrupt("hit", "attack", true); // false
 * 
 * // Nothing can interrupt non-interruptible animations
 * canInterrupt("attack", "hit", false); // false (unless same priority)
 * ```
 * 
 * @korean 중단가능여부확인
 */
export function canInterrupt(
  current: AnimationState,
  requested: AnimationState,
  currentInterruptible: boolean
): boolean {
  const currentPriority = ANIMATION_PRIORITY_MAP[current];
  const requestedPriority = ANIMATION_PRIORITY_MAP[requested];

  // Same priority animations can always transition
  if (currentPriority === requestedPriority) {
    return true;
  }

  // Non-interruptible animations can only be interrupted by higher priority
  if (!currentInterruptible) {
    return requestedPriority > currentPriority;
  }

  // Interruptible animations can be interrupted by same or higher priority
  return requestedPriority >= currentPriority;
}

/**
 * Get the priority level for an animation state
 * 
 * @param state - Animation state
 * @returns Priority level
 * 
 * @korean 우선순위가져오기
 */
export function getPriority(state: AnimationState): AnimationPriority {
  return ANIMATION_PRIORITY_MAP[state];
}

/**
 * Compare two animation priorities
 * 
 * @param state1 - First animation state
 * @param state2 - Second animation state
 * @returns Positive if state1 has higher priority, negative if state2 has higher priority, 0 if equal
 * 
 * @korean 우선순위비교
 */
export function comparePriority(
  state1: AnimationState,
  state2: AnimationState
): number {
  return ANIMATION_PRIORITY_MAP[state1] - ANIMATION_PRIORITY_MAP[state2];
}

// ===== Korean Priority Level Terminology (우선순위 등급 용어) =====

/**
 * Korean names for each priority level
 * 
 * Maps priority levels to their Korean martial arts terminology:
 * - IDLE (0): 대기 (Daegi) - Waiting/Ready state
 * - WALK (1): 보행 (Bohaeng) - Walking movement
 * - RUN (2): 질주 (Jilju) - Running movement
 * - STANCE_CHANGE (3): 자세전환 (Jase Jeonhwan) - Stance transition
 * - DEFEND (4): 방어 (Bangeo) - Defense action
 * - ATTACK (5): 공격 (Gonggyeok) - Attack action
 * - HIT (6): 피격 (Pigyeok) - Being hit
 * - KO (7): 기절 (Gijeol) - Knockout
 * - FALL (8): 낙법 (Nakbeop) - Falling technique
 * - RECOVERY (9): 기상 (Gisang) - Recovery/Getting up
 * 
 * @korean 우선순위한글용어
 */
export const PRIORITY_LEVEL_KOREAN_NAMES: Record<AnimationPriority, {
  korean: string;
  romanized: string;
  english: string;
}> = {
  [AnimationPriority.IDLE]: {
    korean: "대기",
    romanized: "Daegi",
    english: "Ready State",
  },
  [AnimationPriority.WALK]: {
    korean: "보행",
    romanized: "Bohaeng",
    english: "Walking",
  },
  [AnimationPriority.RUN]: {
    korean: "질주",
    romanized: "Jilju",
    english: "Running",
  },
  [AnimationPriority.STANCE_CHANGE]: {
    korean: "자세전환",
    romanized: "Jase Jeonhwan",
    english: "Stance Change",
  },
  [AnimationPriority.DEFEND]: {
    korean: "방어",
    romanized: "Bangeo",
    english: "Defense",
  },
  [AnimationPriority.ATTACK]: {
    korean: "공격",
    romanized: "Gonggyeok",
    english: "Attack",
  },
  [AnimationPriority.HIT]: {
    korean: "피격",
    romanized: "Pigyeok",
    english: "Hit",
  },
  [AnimationPriority.KO]: {
    korean: "기절",
    romanized: "Gijeol",
    english: "Knockout",
  },
  [AnimationPriority.FALL]: {
    korean: "낙법",
    romanized: "Nakbeop",
    english: "Falling",
  },
  [AnimationPriority.RECOVERY]: {
    korean: "기상",
    romanized: "Gisang",
    english: "Recovery",
  },
};

/**
 * Get Korean name for a priority level
 * 
 * @param priority - Animation priority level
 * @returns Korean terminology object
 * 
 * @korean 우선순위한글이름가져오기
 */
export function getPriorityKoreanName(priority: AnimationPriority): {
  korean: string;
  romanized: string;
  english: string;
} {
  return PRIORITY_LEVEL_KOREAN_NAMES[priority];
}

// ===== Conflict Resolution (충돌 해결) =====

/**
 * Conflict resolution strategy for equal-priority animations
 * 
 * **Korean**: 충돌 해결 전략
 * 
 * Determines how to handle when two animations of equal priority
 * are requested simultaneously:
 * 
 * - `timestamp`: First animation requested wins (FIFO - 선입선출)
 * - `state_order`: Use AnimationState enum order as tiebreaker
 * - `current`: Keep current animation running
 * - `requested`: Always switch to requested animation
 * 
 * @korean 충돌해결전략
 */
export type ConflictResolutionStrategy =
  | "timestamp" // 시간순서 (First requested wins)
  | "state_order" // 상태순서 (Enum order tiebreaker)
  | "current" // 현재유지 (Keep current)
  | "requested"; // 요청수락 (Accept requested)

/**
 * Animation request with timestamp for conflict resolution
 * 
 * **Korean**: 애니메이션 요청
 * 
 * Tracks animation requests with timestamps to enable deterministic
 * conflict resolution when multiple equal-priority animations compete.
 * 
 * @korean 애니메이션요청
 */
export interface AnimationRequest {
  /** Requested animation state */
  readonly state: AnimationState;
  /** Request timestamp in milliseconds (from performance.now()) */
  readonly timestamp: number;
  /** Request priority */
  readonly priority: AnimationPriority;
  /** Whether this is a forced request (bypasses normal rules) */
  readonly forced?: boolean;
}

/**
 * Resolve conflict between two equal-priority animations
 * 
 * **Korean**: 충돌 해결
 * 
 * Uses the specified strategy to deterministically decide which animation
 * should play when both have equal priority.
 * 
 * @param current - Current animation request
 * @param requested - Requested animation request
 * @param strategy - Conflict resolution strategy
 * @returns Which animation should play: 'current' or 'requested'
 * 
 * @example
 * ```typescript
 * const current = {
 *   state: AnimationState.ATTACK,
 *   timestamp: 1000,
 *   priority: AnimationPriority.ATTACK,
 * };
 * const requested = {
 *   state: AnimationState.STEP_FORWARD,
 *   timestamp: 1001,
 *   priority: AnimationPriority.ATTACK,
 * };
 * 
 * // Timestamp strategy: current wins (1000 < 1001)
 * resolveConflict(current, requested, "timestamp"); // "current"
 * 
 * // Requested strategy: always take new animation
 * resolveConflict(current, requested, "requested"); // "requested"
 * ```
 * 
 * @korean 충돌해결
 */
export function resolveConflict(
  current: AnimationRequest,
  requested: AnimationRequest,
  strategy: ConflictResolutionStrategy = "timestamp"
): "current" | "requested" {
  // If only one is forced, forced wins
  if (requested.forced && !current.forced) {
    return "requested";
  }
  if (current.forced && !requested.forced) {
    return "current";
  }
  
  // If both are forced OR both are normal, use conflict resolution strategy

  // Apply conflict resolution strategy
  switch (strategy) {
    case "timestamp":
      // Earlier timestamp wins (FIFO)
      return current.timestamp <= requested.timestamp ? "current" : "requested";
    
    case "state_order":
      // Use enum value comparison as tiebreaker
      return current.state <= requested.state ? "current" : "requested";
    
    case "current":
      // Always keep current animation
      return "current";
    
    case "requested":
      // Always accept requested animation
      return "requested";
    
    default:
      // Default to timestamp strategy
      return current.timestamp <= requested.timestamp ? "current" : "requested";
  }
}

// ===== Animation Queue System (애니메이션 대기열) =====

/**
 * Animation queue for managing pending animations
 * 
 * **Korean**: 애니메이션 대기열
 * 
 * Stores pending animation requests that should play after the current
 * animation completes. Useful for:
 * - Buffering input during non-interruptible animations
 * - Creating animation chains/combos
 * - Handling rapid input sequences
 * 
 * Queue is priority-ordered: highest priority animations are dequeued first.
 * 
 * @korean 애니메이션대기열
 */
export class AnimationQueue {
  private queue: AnimationRequest[] = [];
  private maxSize: number;
  private conflictStrategy: ConflictResolutionStrategy;

  /**
   * Create a new animation queue
   * 
   * @param maxSize - Maximum queue size (default: 3)
   * @param conflictStrategy - Strategy for resolving equal-priority conflicts
   * 
   * @korean 생성자
   */
  constructor(
    maxSize: number = 3,
    conflictStrategy: ConflictResolutionStrategy = "timestamp"
  ) {
    this.maxSize = maxSize;
    this.conflictStrategy = conflictStrategy;
  }

  /**
   * Add animation request to queue
   * 
   * **Korean**: 대기열에 추가
   * 
   * Adds an animation request to the queue if space is available.
   * Queue is kept sorted by priority (highest first).
   * 
   * @param request - Animation request to enqueue
   * @returns Whether request was successfully enqueued
   * 
   * @korean 대기열추가
   */
  enqueue(request: AnimationRequest): boolean {
    // Check if queue is full
    if (this.queue.length >= this.maxSize) {
      // Queue is sorted by priority (highest first), so last element is lowest priority
      const lowestPriorityItem = this.queue[this.queue.length - 1];
      
      if (request.priority > lowestPriorityItem.priority) {
        // Remove lowest priority item to make space
        this.queue.pop();
      } else {
        return false; // Queue full, request discarded
      }
    }

    // Add request and sort by priority (highest first)
    this.queue.push(request);
    this.queue.sort((a, b) => b.priority - a.priority);
    
    return true;
  }

  /**
   * Remove and return highest priority request from queue
   * 
   * **Korean**: 대기열에서 제거
   * 
   * Dequeues the highest priority animation request.
   * If multiple requests have equal priority, uses conflict resolution strategy.
   * 
   * @returns Next animation request or null if queue is empty
   * 
   * @korean 대기열제거
   */
  dequeue(): AnimationRequest | null {
    if (this.queue.length === 0) {
      return null;
    }

    // Get all requests with highest priority
    const highestPriority = this.queue[0].priority;
    const highestPriorityRequests = this.queue.filter(
      r => r.priority === highestPriority
    );

    let selectedRequest: AnimationRequest;

    if (highestPriorityRequests.length === 1) {
      selectedRequest = highestPriorityRequests[0];
    } else {
      // Multiple equal-priority requests - use conflict resolution
      selectedRequest = highestPriorityRequests.reduce((current, next) => {
        const winner = resolveConflict(current, next, this.conflictStrategy);
        return winner === "current" ? current : next;
      });
    }

    // Remove selected request from queue
    const index = this.queue.indexOf(selectedRequest);
    this.queue.splice(index, 1);

    return selectedRequest;
  }

  /**
   * Peek at next request without removing it
   * 
   * **Korean**: 다음 요청 확인
   * 
   * @returns Next animation request or null if queue is empty
   * 
   * @korean 다음요청확인
   */
  peek(): AnimationRequest | null {
    return this.queue.length > 0 ? this.queue[0] : null;
  }

  /**
   * Clear all pending requests
   * 
   * **Korean**: 대기열 초기화
   * 
   * @korean 대기열초기화
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Get number of pending requests
   * 
   * **Korean**: 대기열 크기
   * 
   * @returns Number of pending requests
   * 
   * @korean 대기열크기
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Check if queue is empty
   * 
   * **Korean**: 대기열 비어있음
   * 
   * @returns True if queue has no pending requests
   * 
   * @korean 대기열비어있음
   */
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  /**
   * Check if queue is full
   * 
   * **Korean**: 대기열 가득참
   * 
   * @returns True if queue is at maximum capacity
   * 
   * @korean 대기열가득찬
   */
  isFull(): boolean {
    return this.queue.length >= this.maxSize;
  }

  /**
   * Get all pending requests (read-only)
   * 
   * **Korean**: 모든 대기 요청
   * 
   * @returns Array of pending requests
   * 
   * @korean 모든대기요청
   */
  getAll(): readonly AnimationRequest[] {
    return [...this.queue];
  }

  /**
   * Get maximum queue size
   * 
   * **Korean**: 최대 대기열 크기
   * 
   * @returns Maximum queue capacity
   * 
   * @korean 최대대기열크기
   */
  getMaxSize(): number {
    return this.maxSize;
  }
}

// ===== Interruptibility Windows (중단 가능 구간) =====

/**
 * Interruptibility window definition
 * 
 * **Korean**: 중단 가능 구간
 * 
 * Defines specific frame ranges where an animation can be interrupted,
 * allowing for more nuanced control than simple boolean interruptibility.
 * 
 * Example: Attack animation might be interruptible only in startup frames (0-3)
 * and recovery frames (10-12), but not during active frames (4-9).
 * 
 * @korean 중단가능구간
 */
export interface InterruptibilityWindow {
  /** Starting frame (inclusive) */
  readonly startFrame: number;
  /** Ending frame (inclusive) */
  readonly endFrame: number;
  /** Minimum priority required to interrupt during this window */
  readonly minPriorityToInterrupt: AnimationPriority;
}

/**
 * Check if an animation can be interrupted at a specific frame
 * 
 * **Korean**: 프레임별 중단 가능 여부
 * 
 * Determines if an animation can be interrupted based on:
 * - Current frame index
 * - Interruptibility windows
 * - Requested animation priority
 * 
 * @param currentFrame - Current frame index in animation
 * @param requestedPriority - Priority of animation trying to interrupt
 * @param windows - Array of interruptibility windows
 * @returns Whether animation can be interrupted at this frame
 * 
 * @example
 * ```typescript
 * const attackWindows: InterruptibilityWindow[] = [
 *   { startFrame: 0, endFrame: 3, minPriorityToInterrupt: AnimationPriority.ATTACK },
 *   { startFrame: 10, endFrame: 12, minPriorityToInterrupt: AnimationPriority.DEFEND },
 * ];
 * 
 * // Frame 2: interruptible by attacks or higher
 * canInterruptAtFrame(2, AnimationPriority.HIT, attackWindows); // true
 * canInterruptAtFrame(2, AnimationPriority.DEFEND, attackWindows); // false
 * 
 * // Frame 5: not interruptible (no window)
 * canInterruptAtFrame(5, AnimationPriority.KO, attackWindows); // false
 * ```
 * 
 * @korean 프레임별중단가능여부
 */
export function canInterruptAtFrame(
  currentFrame: number,
  requestedPriority: AnimationPriority,
  windows: readonly InterruptibilityWindow[]
): boolean {
  // Find window that contains current frame
  const activeWindow = windows.find(
    w => currentFrame >= w.startFrame && currentFrame <= w.endFrame
  );

  // If no window contains this frame, cannot interrupt
  if (!activeWindow) {
    return false;
  }

  // Check if requested priority meets window's minimum
  return requestedPriority >= activeWindow.minPriorityToInterrupt;
}

/**
 * Get interruptibility window for current frame
 * 
 * **Korean**: 현재 프레임 중단 가능 구간
 * 
 * Returns the active interruptibility window for the given frame,
 * or null if frame is not in any window.
 * 
 * @param currentFrame - Current frame index
 * @param windows - Array of interruptibility windows
 * @returns Active window or null
 * 
 * @korean 현재프레임중단가능구간
 */
export function getInterruptibilityWindow(
  currentFrame: number,
  windows: readonly InterruptibilityWindow[]
): InterruptibilityWindow | null {
  return windows.find(
    w => currentFrame >= w.startFrame && currentFrame <= w.endFrame
  ) ?? null;
}
