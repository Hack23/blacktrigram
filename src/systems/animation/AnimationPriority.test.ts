/**
 * Unit tests for AnimationPriority system
 * 
 * Tests animation priority comparison, interrupt logic, conflict resolution,
 * animation queue, and interruptibility windows.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  canInterrupt,
  getPriority,
  comparePriority,
  ANIMATION_PRIORITY_MAP,
  getPriorityKoreanName,
  PRIORITY_LEVEL_KOREAN_NAMES,
  resolveConflict,
  AnimationQueue,
  canInterruptAtFrame,
  getInterruptibilityWindow,
  type AnimationRequest,
  type InterruptibilityWindow,
} from "./AnimationPriority";
import { AnimationPriority, AnimationState } from "./types";

describe("AnimationPriority", () => {
  describe("ANIMATION_PRIORITY_MAP", () => {
    it("should map all animation states to priority levels", () => {
      const states: AnimationState[] = [
        "idle",
        "walk",
        "run",
        "stance_change",
        "defend",
        "attack",
        "hit",
        "ko",
      ];

      states.forEach((state) => {
        expect(ANIMATION_PRIORITY_MAP[state]).toBeDefined();
        expect(typeof ANIMATION_PRIORITY_MAP[state]).toBe("number");
      });
    });

    it("should have correct priority order: ko > hit > attack > defend > stance_change > movement > idle", () => {
      expect(ANIMATION_PRIORITY_MAP.ko).toBeGreaterThan(
        ANIMATION_PRIORITY_MAP.hit
      );
      expect(ANIMATION_PRIORITY_MAP.hit).toBeGreaterThan(
        ANIMATION_PRIORITY_MAP.attack
      );
      expect(ANIMATION_PRIORITY_MAP.attack).toBeGreaterThan(
        ANIMATION_PRIORITY_MAP.defend
      );
      expect(ANIMATION_PRIORITY_MAP.defend).toBeGreaterThan(
        ANIMATION_PRIORITY_MAP.stance_change
      );
      expect(ANIMATION_PRIORITY_MAP.stance_change).toBeGreaterThan(
        ANIMATION_PRIORITY_MAP.run
      );
      expect(ANIMATION_PRIORITY_MAP.run).toBeGreaterThan(
        ANIMATION_PRIORITY_MAP.walk
      );
      expect(ANIMATION_PRIORITY_MAP.walk).toBeGreaterThan(
        ANIMATION_PRIORITY_MAP.idle
      );
    });
  });

  describe("canInterrupt", () => {
    it("should allow same priority animations to transition", () => {
      expect(canInterrupt("walk", "walk", true)).toBe(true);
      expect(canInterrupt("walk", "walk", false)).toBe(true);
    });

    it("should allow higher priority to interrupt interruptible animations", () => {
      expect(canInterrupt("attack", "hit", true)).toBe(true);
      expect(canInterrupt("defend", "attack", true)).toBe(true);
      expect(canInterrupt("idle", "walk", true)).toBe(true);
    });

    it("should not allow lower priority to interrupt interruptible animations", () => {
      expect(canInterrupt("hit", "attack", true)).toBe(false);
      expect(canInterrupt("attack", "defend", true)).toBe(false);
      expect(canInterrupt("walk", "idle", true)).toBe(false);
    });

    it("should not allow lower priority to interrupt non-interruptible animations", () => {
      expect(canInterrupt("hit", "attack", false)).toBe(false);
      expect(canInterrupt("attack", "walk", false)).toBe(false);
    });

    it("should allow higher priority to interrupt non-interruptible animations", () => {
      expect(canInterrupt("attack", "hit", false)).toBe(true);
      expect(canInterrupt("defend", "hit", false)).toBe(true);
      expect(canInterrupt("stance_change", "ko", false)).toBe(true);
    });

    it("should handle KO animation (highest priority)", () => {
      expect(canInterrupt("attack", "ko", true)).toBe(true);
      expect(canInterrupt("hit", "ko", true)).toBe(true);
      expect(canInterrupt("ko", "idle", true)).toBe(false);
      expect(canInterrupt("ko", "hit", true)).toBe(false);
    });
  });

  describe("getPriority", () => {
    it("should return correct priority for each state", () => {
      expect(getPriority("idle")).toBe(AnimationPriority.IDLE);
      expect(getPriority("walk")).toBe(AnimationPriority.WALK);
      expect(getPriority("run")).toBe(AnimationPriority.RUN);
      expect(getPriority("stance_change")).toBe(
        AnimationPriority.STANCE_CHANGE
      );
      expect(getPriority("defend")).toBe(AnimationPriority.DEFEND);
      expect(getPriority("attack")).toBe(AnimationPriority.ATTACK);
      expect(getPriority("hit")).toBe(AnimationPriority.HIT);
      expect(getPriority("ko")).toBe(AnimationPriority.KO);
    });
  });

  describe("comparePriority", () => {
    it("should return positive when first state has higher priority", () => {
      expect(comparePriority("hit", "attack")).toBeGreaterThan(0);
      expect(comparePriority("ko", "hit")).toBeGreaterThan(0);
      expect(comparePriority("attack", "idle")).toBeGreaterThan(0);
    });

    it("should return negative when second state has higher priority", () => {
      expect(comparePriority("attack", "hit")).toBeLessThan(0);
      expect(comparePriority("hit", "ko")).toBeLessThan(0);
      expect(comparePriority("idle", "attack")).toBeLessThan(0);
    });

    it("should return zero when priorities are equal", () => {
      expect(comparePriority("idle", "idle")).toBe(0);
      expect(comparePriority("attack", "attack")).toBe(0);
      expect(comparePriority("hit", "hit")).toBe(0);
    });
  });

  // ===== Korean Terminology Tests =====

  describe("getPriorityKoreanName", () => {
    it("should return Korean name for each priority level", () => {
      const idleName = getPriorityKoreanName(AnimationPriority.IDLE);
      expect(idleName.korean).toBe("대기");
      expect(idleName.romanized).toBe("Daegi");
      expect(idleName.english).toBe("Ready State");

      const attackName = getPriorityKoreanName(AnimationPriority.ATTACK);
      expect(attackName.korean).toBe("공격");
      expect(attackName.romanized).toBe("Gonggyeok");
      expect(attackName.english).toBe("Attack");
    });

    it("should have names for all priority levels", () => {
      const priorities = Object.values(AnimationPriority).filter(
        v => typeof v === "number"
      ) as AnimationPriority[];

      priorities.forEach(priority => {
        const name = getPriorityKoreanName(priority);
        expect(name.korean).toBeDefined();
        expect(name.romanized).toBeDefined();
        expect(name.english).toBeDefined();
      });
    });
  });

  describe("PRIORITY_LEVEL_KOREAN_NAMES", () => {
    it("should have entries for all priority levels", () => {
      expect(PRIORITY_LEVEL_KOREAN_NAMES[AnimationPriority.IDLE]).toBeDefined();
      expect(PRIORITY_LEVEL_KOREAN_NAMES[AnimationPriority.WALK]).toBeDefined();
      expect(PRIORITY_LEVEL_KOREAN_NAMES[AnimationPriority.RUN]).toBeDefined();
      expect(PRIORITY_LEVEL_KOREAN_NAMES[AnimationPriority.STANCE_CHANGE]).toBeDefined();
      expect(PRIORITY_LEVEL_KOREAN_NAMES[AnimationPriority.DEFEND]).toBeDefined();
      expect(PRIORITY_LEVEL_KOREAN_NAMES[AnimationPriority.ATTACK]).toBeDefined();
      expect(PRIORITY_LEVEL_KOREAN_NAMES[AnimationPriority.HIT]).toBeDefined();
      expect(PRIORITY_LEVEL_KOREAN_NAMES[AnimationPriority.KO]).toBeDefined();
      expect(PRIORITY_LEVEL_KOREAN_NAMES[AnimationPriority.FALL]).toBeDefined();
      expect(PRIORITY_LEVEL_KOREAN_NAMES[AnimationPriority.RECOVERY]).toBeDefined();
    });
  });

  // ===== Conflict Resolution Tests =====

  describe("resolveConflict", () => {
    const baseTime = 1000;

    it("should resolve timestamp strategy correctly (FIFO)", () => {
      const earlier: AnimationRequest = {
        state: AnimationState.ATTACK,
        timestamp: baseTime,
        priority: AnimationPriority.ATTACK,
      };
      const later: AnimationRequest = {
        state: AnimationState.STEP_FORWARD,
        timestamp: baseTime + 10,
        priority: AnimationPriority.ATTACK,
      };

      // Earlier timestamp wins
      expect(resolveConflict(earlier, later, "timestamp")).toBe("current");
      expect(resolveConflict(later, earlier, "timestamp")).toBe("requested");
    });

    it("should resolve state_order strategy correctly", () => {
      const stateA: AnimationRequest = {
        state: AnimationState.ATTACK, // "attack"
        timestamp: baseTime,
        priority: AnimationPriority.ATTACK,
      };
      const stateB: AnimationRequest = {
        state: AnimationState.STEP_FORWARD, // "step_forward"
        timestamp: baseTime,
        priority: AnimationPriority.ATTACK,
      };

      // "attack" < "step_forward" alphabetically
      expect(resolveConflict(stateA, stateB, "state_order")).toBe("current");
      expect(resolveConflict(stateB, stateA, "state_order")).toBe("requested");
    });

    it("should resolve current strategy correctly", () => {
      const current: AnimationRequest = {
        state: AnimationState.ATTACK,
        timestamp: baseTime,
        priority: AnimationPriority.ATTACK,
      };
      const requested: AnimationRequest = {
        state: AnimationState.DEFEND,
        timestamp: baseTime + 100,
        priority: AnimationPriority.ATTACK,
      };

      // Always keep current
      expect(resolveConflict(current, requested, "current")).toBe("current");
    });

    it("should resolve requested strategy correctly", () => {
      const current: AnimationRequest = {
        state: AnimationState.ATTACK,
        timestamp: baseTime,
        priority: AnimationPriority.ATTACK,
      };
      const requested: AnimationRequest = {
        state: AnimationState.DEFEND,
        timestamp: baseTime + 100,
        priority: AnimationPriority.ATTACK,
      };

      // Always accept requested
      expect(resolveConflict(current, requested, "requested")).toBe("requested");
    });

    it("should handle forced requests correctly", () => {
      const current: AnimationRequest = {
        state: AnimationState.ATTACK,
        timestamp: baseTime,
        priority: AnimationPriority.ATTACK,
        forced: true,
      };
      const requested: AnimationRequest = {
        state: AnimationState.HIT,
        timestamp: baseTime + 10,
        priority: AnimationPriority.ATTACK,
        forced: true,
      };
      const normal: AnimationRequest = {
        state: AnimationState.DEFEND,
        timestamp: baseTime,
        priority: AnimationPriority.ATTACK,
      };

      // Forced requested beats normal current
      expect(resolveConflict(normal, requested, "timestamp")).toBe("requested");

      // Forced current beats normal requested
      expect(resolveConflict(current, normal, "timestamp")).toBe("current");

      // Both forced: use strategy (timestamp in this case)
      expect(resolveConflict(current, requested, "timestamp")).toBe("current");
    });

    it("should use timestamp strategy as default", () => {
      const earlier: AnimationRequest = {
        state: AnimationState.ATTACK,
        timestamp: baseTime,
        priority: AnimationPriority.ATTACK,
      };
      const later: AnimationRequest = {
        state: AnimationState.DEFEND,
        timestamp: baseTime + 10,
        priority: AnimationPriority.ATTACK,
      };

      // @ts-expect-error - Testing with invalid strategy
      expect(resolveConflict(earlier, later, "invalid")).toBe("current");
    });

    it("should handle simultaneous timestamps deterministically", () => {
      const req1: AnimationRequest = {
        state: AnimationState.ATTACK,
        timestamp: baseTime,
        priority: AnimationPriority.ATTACK,
      };
      const req2: AnimationRequest = {
        state: AnimationState.DEFEND,
        timestamp: baseTime, // Same timestamp
        priority: AnimationPriority.ATTACK,
      };

      // With equal timestamps, current wins
      expect(resolveConflict(req1, req2, "timestamp")).toBe("current");
      expect(resolveConflict(req2, req1, "timestamp")).toBe("current");
    });
  });

  // ===== Animation Queue Tests =====

  describe("AnimationQueue", () => {
    let queue: AnimationQueue;

    beforeEach(() => {
      queue = new AnimationQueue(3, "timestamp");
    });

    it("should enqueue and dequeue requests correctly", () => {
      const req: AnimationRequest = {
        state: AnimationState.ATTACK,
        timestamp: 1000,
        priority: AnimationPriority.ATTACK,
      };

      expect(queue.enqueue(req)).toBe(true);
      expect(queue.size()).toBe(1);

      const dequeued = queue.dequeue();
      expect(dequeued).toEqual(req);
      expect(queue.isEmpty()).toBe(true);
    });

    it("should maintain priority order", () => {
      const lowPriority: AnimationRequest = {
        state: AnimationState.WALK,
        timestamp: 1000,
        priority: AnimationPriority.WALK,
      };
      const mediumPriority: AnimationRequest = {
        state: AnimationState.ATTACK,
        timestamp: 1001,
        priority: AnimationPriority.ATTACK,
      };
      const highPriority: AnimationRequest = {
        state: AnimationState.HIT,
        timestamp: 1002,
        priority: AnimationPriority.HIT,
      };

      queue.enqueue(lowPriority);
      queue.enqueue(highPriority);
      queue.enqueue(mediumPriority);

      // Should dequeue in priority order: HIT > ATTACK > WALK
      expect(queue.dequeue()?.state).toBe(AnimationState.HIT);
      expect(queue.dequeue()?.state).toBe(AnimationState.ATTACK);
      expect(queue.dequeue()?.state).toBe(AnimationState.WALK);
    });

    it("should respect max queue size", () => {
      const req1: AnimationRequest = {
        state: AnimationState.WALK,
        timestamp: 1000,
        priority: AnimationPriority.WALK, // Priority 1
      };
      const req2: AnimationRequest = {
        state: AnimationState.RUN,
        timestamp: 1001,
        priority: AnimationPriority.RUN, // Priority 2
      };
      const req3: AnimationRequest = {
        state: AnimationState.ATTACK,
        timestamp: 1002,
        priority: AnimationPriority.ATTACK, // Priority 5
      };
      const req4LowerPriority: AnimationRequest = {
        state: AnimationState.IDLE,
        timestamp: 1003,
        priority: AnimationPriority.IDLE, // Priority 0 - lowest priority
      };

      expect(queue.enqueue(req1)).toBe(true);
      expect(queue.enqueue(req2)).toBe(true);
      expect(queue.enqueue(req3)).toBe(true);
      expect(queue.isFull()).toBe(true);

      // Fourth enqueue should fail (priority 0 is lower than lowest existing priority 1)
      expect(queue.enqueue(req4LowerPriority)).toBe(false);
      expect(queue.size()).toBe(3);
    });

    it("should replace lower priority when full", () => {
      const lowPriority: AnimationRequest = {
        state: AnimationState.WALK,
        timestamp: 1000,
        priority: AnimationPriority.WALK,
      };
      const mediumPriority: AnimationRequest = {
        state: AnimationState.ATTACK,
        timestamp: 1001,
        priority: AnimationPriority.ATTACK,
      };
      const highPriority: AnimationRequest = {
        state: AnimationState.HIT,
        timestamp: 1002,
        priority: AnimationPriority.HIT,
      };
      const veryHighPriority: AnimationRequest = {
        state: AnimationState.KO,
        timestamp: 1003,
        priority: AnimationPriority.KO,
      };

      queue.enqueue(lowPriority);
      queue.enqueue(mediumPriority);
      queue.enqueue(highPriority);

      // Queue is full, but KO has higher priority than WALK
      expect(queue.enqueue(veryHighPriority)).toBe(true);
      expect(queue.size()).toBe(3);

      // WALK should have been replaced
      const states = queue.getAll().map(r => r.state);
      expect(states).not.toContain(AnimationState.WALK);
      expect(states).toContain(AnimationState.KO);
    });

    it("should handle equal priority with conflict resolution", () => {
      const req1: AnimationRequest = {
        state: AnimationState.ATTACK,
        timestamp: 1000,
        priority: AnimationPriority.ATTACK,
      };
      const req2: AnimationRequest = {
        state: AnimationState.STEP_FORWARD,
        timestamp: 1001,
        priority: AnimationPriority.ATTACK,
      };

      queue.enqueue(req1);
      queue.enqueue(req2);

      // With timestamp strategy, earlier request (req1) should be dequeued first
      const dequeued = queue.dequeue();
      expect(dequeued?.state).toBe(AnimationState.ATTACK);
    });

    it("should peek without removing", () => {
      const req: AnimationRequest = {
        state: AnimationState.ATTACK,
        timestamp: 1000,
        priority: AnimationPriority.ATTACK,
      };

      queue.enqueue(req);

      expect(queue.peek()).toEqual(req);
      expect(queue.size()).toBe(1); // Still in queue
    });

    it("should clear all requests", () => {
      queue.enqueue({
        state: AnimationState.ATTACK,
        timestamp: 1000,
        priority: AnimationPriority.ATTACK,
      });
      queue.enqueue({
        state: AnimationState.DEFEND,
        timestamp: 1001,
        priority: AnimationPriority.DEFEND,
      });

      expect(queue.size()).toBe(2);

      queue.clear();

      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });

    it("should return null when dequeuing empty queue", () => {
      expect(queue.dequeue()).toBeNull();
    });

    it("should return null when peeking empty queue", () => {
      expect(queue.peek()).toBeNull();
    });

    it("should support different conflict resolution strategies", () => {
      const timestampQueue = new AnimationQueue(3, "timestamp");
      const requestedQueue = new AnimationQueue(3, "requested");

      const req1: AnimationRequest = {
        state: AnimationState.ATTACK,
        timestamp: 1000,
        priority: AnimationPriority.ATTACK,
      };
      const req2: AnimationRequest = {
        state: AnimationState.STEP_FORWARD,
        timestamp: 1001,
        priority: AnimationPriority.ATTACK,
      };

      timestampQueue.enqueue(req1);
      timestampQueue.enqueue(req2);

      requestedQueue.enqueue(req1);
      requestedQueue.enqueue(req2);

      // Timestamp queue: earlier request wins
      expect(timestampQueue.dequeue()?.state).toBe(AnimationState.ATTACK);

      // Requested queue: later request wins
      expect(requestedQueue.dequeue()?.state).toBe(AnimationState.STEP_FORWARD);
    });

    it("should correctly report full/empty states", () => {
      expect(queue.isEmpty()).toBe(true);
      expect(queue.isFull()).toBe(false);

      queue.enqueue({
        state: AnimationState.ATTACK,
        timestamp: 1000,
        priority: AnimationPriority.ATTACK,
      });

      expect(queue.isEmpty()).toBe(false);
      expect(queue.isFull()).toBe(false);

      queue.enqueue({
        state: AnimationState.DEFEND,
        timestamp: 1001,
        priority: AnimationPriority.DEFEND,
      });
      queue.enqueue({
        state: AnimationState.HIT,
        timestamp: 1002,
        priority: AnimationPriority.HIT,
      });

      expect(queue.isFull()).toBe(true);

      queue.clear();

      expect(queue.isEmpty()).toBe(true);
    });

    it("should provide read-only access to all requests", () => {
      const req1: AnimationRequest = {
        state: AnimationState.ATTACK,
        timestamp: 1000,
        priority: AnimationPriority.ATTACK,
      };
      const req2: AnimationRequest = {
        state: AnimationState.DEFEND,
        timestamp: 1001,
        priority: AnimationPriority.DEFEND,
      };

      queue.enqueue(req1);
      queue.enqueue(req2);

      const all = queue.getAll();
      expect(all.length).toBe(2);

      // Modifying returned array shouldn't affect queue
      // @ts-expect-error - Testing immutability
      all.push({
        state: AnimationState.HIT,
        timestamp: 1002,
        priority: AnimationPriority.HIT,
      });

      expect(queue.size()).toBe(2);
    });
  });

  // ===== Interruptibility Window Tests =====

  describe("canInterruptAtFrame", () => {
    const windows: InterruptibilityWindow[] = [
      // Startup frames: interruptible by attacks or higher
      { startFrame: 0, endFrame: 3, minPriorityToInterrupt: AnimationPriority.ATTACK },
      // Active frames: not in any window (non-interruptible)
      // Recovery frames: interruptible by any action
      { startFrame: 10, endFrame: 12, minPriorityToInterrupt: AnimationPriority.DEFEND },
    ];

    it("should allow interrupt during startup window", () => {
      // Frame 2 is in startup window (requires ATTACK priority)
      expect(canInterruptAtFrame(2, AnimationPriority.HIT, windows)).toBe(true);
      expect(canInterruptAtFrame(2, AnimationPriority.ATTACK, windows)).toBe(true);
      expect(canInterruptAtFrame(2, AnimationPriority.DEFEND, windows)).toBe(false);
    });

    it("should not allow interrupt during active frames", () => {
      // Frame 5 is not in any window (non-interruptible)
      expect(canInterruptAtFrame(5, AnimationPriority.KO, windows)).toBe(false);
      expect(canInterruptAtFrame(5, AnimationPriority.HIT, windows)).toBe(false);
    });

    it("should allow interrupt during recovery window", () => {
      // Frame 11 is in recovery window (requires DEFEND priority)
      expect(canInterruptAtFrame(11, AnimationPriority.HIT, windows)).toBe(true);
      expect(canInterruptAtFrame(11, AnimationPriority.DEFEND, windows)).toBe(true);
      expect(canInterruptAtFrame(11, AnimationPriority.STANCE_CHANGE, windows)).toBe(false);
    });

    it("should handle empty window array", () => {
      // No windows means non-interruptible
      expect(canInterruptAtFrame(0, AnimationPriority.KO, [])).toBe(false);
    });

    it("should handle frame at window boundaries", () => {
      // Test exact boundary frames
      expect(canInterruptAtFrame(0, AnimationPriority.ATTACK, windows)).toBe(true);
      expect(canInterruptAtFrame(3, AnimationPriority.ATTACK, windows)).toBe(true);
      expect(canInterruptAtFrame(10, AnimationPriority.DEFEND, windows)).toBe(true);
      expect(canInterruptAtFrame(12, AnimationPriority.DEFEND, windows)).toBe(true);

      // Just outside boundaries
      expect(canInterruptAtFrame(4, AnimationPriority.KO, windows)).toBe(false);
      expect(canInterruptAtFrame(9, AnimationPriority.KO, windows)).toBe(false);
      expect(canInterruptAtFrame(13, AnimationPriority.KO, windows)).toBe(false);
    });

    it("should respect minimum priority requirements", () => {
      const strictWindow: InterruptibilityWindow[] = [
        { startFrame: 0, endFrame: 5, minPriorityToInterrupt: AnimationPriority.KO },
      ];

      expect(canInterruptAtFrame(2, AnimationPriority.KO, strictWindow)).toBe(true);
      expect(canInterruptAtFrame(2, AnimationPriority.RECOVERY, strictWindow)).toBe(true);
      expect(canInterruptAtFrame(2, AnimationPriority.HIT, strictWindow)).toBe(false);
    });
  });

  describe("getInterruptibilityWindow", () => {
    const windows: InterruptibilityWindow[] = [
      { startFrame: 0, endFrame: 3, minPriorityToInterrupt: AnimationPriority.ATTACK },
      { startFrame: 10, endFrame: 12, minPriorityToInterrupt: AnimationPriority.DEFEND },
    ];

    it("should return correct window for frame in range", () => {
      const window = getInterruptibilityWindow(2, windows);
      expect(window).toEqual({
        startFrame: 0,
        endFrame: 3,
        minPriorityToInterrupt: AnimationPriority.ATTACK,
      });
    });

    it("should return null for frame not in any window", () => {
      expect(getInterruptibilityWindow(5, windows)).toBeNull();
    });

    it("should handle frame at window boundaries", () => {
      expect(getInterruptibilityWindow(0, windows)).not.toBeNull();
      expect(getInterruptibilityWindow(3, windows)).not.toBeNull();
      expect(getInterruptibilityWindow(10, windows)).not.toBeNull();
      expect(getInterruptibilityWindow(12, windows)).not.toBeNull();
    });

    it("should return null for empty window array", () => {
      expect(getInterruptibilityWindow(0, [])).toBeNull();
    });

    it("should return first matching window if overlapping", () => {
      const overlappingWindows: InterruptibilityWindow[] = [
        { startFrame: 0, endFrame: 5, minPriorityToInterrupt: AnimationPriority.ATTACK },
        { startFrame: 3, endFrame: 8, minPriorityToInterrupt: AnimationPriority.DEFEND },
      ];

      const window = getInterruptibilityWindow(4, overlappingWindows);
      expect(window?.minPriorityToInterrupt).toBe(AnimationPriority.ATTACK);
    });
  });
});
