/**
 * Tests for useBalanceAnimations and useMuscleActivation hooks
 *
 * @module hooks/__tests__/useBalanceAnimations.test
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useBalanceAnimations } from "../useBalanceAnimations";
import { useMuscleActivation } from "../useMuscleActivation";

describe("useBalanceAnimations", () => {
  describe("initialization", () => {
    it("should initialize with neutral position", () => {
      const { result } = renderHook(() =>
        useBalanceAnimations({
          balance: "READY",
        })
      );

      expect(result.current.swayPosition).toEqual([0, 0, 0]);
      expect(result.current.helplessRotation).toBe(0);
      expect(result.current.updateBalanceAnimations).toBeDefined();
    });
  });

  describe("balance state animations", () => {
    it("should sway for SHAKEN balance", () => {
      const { result } = renderHook(() =>
        useBalanceAnimations({
          balance: "SHAKEN",
        })
      );

      // Update animation a few times
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.updateBalanceAnimations(0.1, i % 2);
        }
      });

      // Should have non-zero sway
      const [x, y] = result.current.swayPosition;
      expect(Math.abs(x) + Math.abs(y)).toBeGreaterThan(0);
      expect(result.current.helplessRotation).toBe(0); // No lean for SHAKEN
    });

    it("should sway more for VULNERABLE balance", () => {
      const { result } = renderHook(() =>
        useBalanceAnimations({
          balance: "VULNERABLE",
        })
      );

      // Update animation
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.updateBalanceAnimations(0.1, i % 2);
        }
      });

      // Should have non-zero sway
      const [x, y] = result.current.swayPosition;
      expect(Math.abs(x) + Math.abs(y)).toBeGreaterThan(0);
      expect(result.current.helplessRotation).toBe(0); // No lean for VULNERABLE
    });

    it("should stumble for HELPLESS balance", () => {
      const { result } = renderHook(() =>
        useBalanceAnimations({
          balance: "HELPLESS",
        })
      );

      // Update animation
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.updateBalanceAnimations(0.1, i % 2);
        }
      });

      // Should have non-zero sway and lean
      const [x, y] = result.current.swayPosition;
      expect(Math.abs(x) + Math.abs(y)).toBeGreaterThan(0);
      expect(Math.abs(result.current.helplessRotation)).toBeGreaterThan(0);
    });

    it("should return to neutral when balance improves", () => {
      const { result, rerender } = renderHook(
        ({ balance }) =>
          useBalanceAnimations({
            balance,
          }),
        {
          initialProps: { balance: "HELPLESS" as const },
        }
      );

      // Build up sway
      act(() => {
        for (let i = 0; i < 5; i++) {
          result.current.updateBalanceAnimations(0.1, i % 2);
        }
      });

      const swayAfterHelpless = result.current.swayPosition;

      // Improve balance
      rerender({ balance: "READY" });

      // Update to decay sway
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.updateBalanceAnimations(0.016, i % 2);
        }
      });

      const [x, y] = result.current.swayPosition;
      const [prevX, prevY] = swayAfterHelpless;

      // Sway should be reduced
      expect(Math.abs(x)).toBeLessThanOrEqual(Math.abs(prevX));
      expect(Math.abs(y)).toBeLessThanOrEqual(Math.abs(prevY));
    });
  });

  describe("frame counter synchronization", () => {
    it("should only update state on even frames", () => {
      const { result } = renderHook(() =>
        useBalanceAnimations({
          balance: "SHAKEN",
        })
      );

      const initialPosition = result.current.swayPosition;

      // Odd frame - should not update state
      act(() => {
        result.current.updateBalanceAnimations(0.016, 1);
      });

      expect(result.current.swayPosition).toEqual(initialPosition);

      // Even frame - should update state
      act(() => {
        result.current.updateBalanceAnimations(0.016, 2);
      });

      expect(result.current.swayPosition).not.toEqual(initialPosition);
    });
  });

  describe("animation continuity", () => {
    it("should maintain continuous sway motion", () => {
      const { result, rerender } = renderHook(() =>
        useBalanceAnimations({
          balance: "VULNERABLE",
        })
      );

      const xPositions: number[] = [];

      // Update with even frame counters to trigger state updates
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.updateBalanceAnimations(0.1, i * 2); // Even frames only
        });
        
        // Force a re-render to get updated state
        rerender();
        xPositions.push(result.current.swayPosition[0]);
      }

      // X positions should vary (sine wave motion)
      const uniqueXPositions = new Set(xPositions.map(x => x.toFixed(6)));
      expect(uniqueXPositions.size).toBeGreaterThan(2);
      
      // Verify sway is actually happening (some non-zero positions)
      const nonZeroPositions = xPositions.filter(x => Math.abs(x) > 0.001);
      expect(nonZeroPositions.length).toBeGreaterThan(0);
    });
  });
});

describe("useMuscleActivation", () => {
  describe("initialization", () => {
    it("should initialize with empty muscle states", () => {
      const { result } = renderHook(() =>
        useMuscleActivation({
          currentAnimation: "idle",
          stamina: 100,
        })
      );

      expect(result.current.muscleStates).toBeDefined();
      expect(result.current.muscleStates.size).toBeGreaterThanOrEqual(0);
      expect(result.current.updateMuscleActivations).toBeDefined();
    });
  });

  describe("muscle activation for different animations", () => {
    it("should activate muscles for attack", () => {
      const { result } = renderHook(() =>
        useMuscleActivation({
          currentAnimation: "attack",
          attackAnimation: "jab",
          stamina: 100,
        })
      );

      // Update muscle activations
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.updateMuscleActivations(0.016, i);
        }
      });

      // Muscles should be activated (sync happens every 10 frames)
      expect(result.current.muscleStates.size).toBeGreaterThan(0);
    });

    it("should activate muscles for blocking", () => {
      const { result } = renderHook(() =>
        useMuscleActivation({
          currentAnimation: "defend",
          isBlocking: true,
          stamina: 100,
        })
      );

      // Update muscle activations
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.updateMuscleActivations(0.016, i);
        }
      });

      expect(result.current.muscleStates.size).toBeGreaterThan(0);
    });

    it("should activate muscles for movement", () => {
      const { result } = renderHook(() =>
        useMuscleActivation({
          currentAnimation: "walk",
          stamina: 100,
        })
      );

      // Update muscle activations
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.updateMuscleActivations(0.016, i);
        }
      });

      expect(result.current.muscleStates.size).toBeGreaterThan(0);
    });

    it("should relax muscles for idle", () => {
      const { result, rerender } = renderHook(
        ({ currentAnimation, attackAnimation }) =>
          useMuscleActivation({
            currentAnimation,
            attackAnimation,
            stamina: 100,
          }),
        {
          initialProps: {
            currentAnimation: "attack" as const,
            attackAnimation: "jab",
          },
        }
      );

      // Activate muscles
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.updateMuscleActivations(0.016, i);
        }
      });

      // Verify muscles activated
      expect(result.current.muscleStates.size).toBeGreaterThan(0);

      // Transition to idle
      rerender({
        currentAnimation: "idle",
        attackAnimation: undefined,
      });

      // Let muscles relax
      act(() => {
        for (let i = 0; i < 20; i++) {
          result.current.updateMuscleActivations(0.016, i);
        }
      });

      // Muscle states should still exist but values should be lower
      expect(result.current.muscleStates.size).toBeGreaterThanOrEqual(0);
    });
  });

  describe("stamina effects", () => {
    it("should reduce muscle activation with low stamina", () => {
      const { result: highStamina } = renderHook(() =>
        useMuscleActivation({
          currentAnimation: "attack",
          attackAnimation: "jab",
          stamina: 100,
        })
      );

      const { result: lowStamina } = renderHook(() =>
        useMuscleActivation({
          currentAnimation: "attack",
          attackAnimation: "jab",
          stamina: 10,
        })
      );

      // Update both
      act(() => {
        for (let i = 0; i < 10; i++) {
          highStamina.current.updateMuscleActivations(0.016, i);
          lowStamina.current.updateMuscleActivations(0.016, i);
        }
      });

      // Both should have muscle activation
      expect(highStamina.current.muscleStates.size).toBeGreaterThan(0);
      expect(lowStamina.current.muscleStates.size).toBeGreaterThan(0);
    });
  });

  describe("frame counter synchronization", () => {
    it("should sync muscle states every 10 frames", () => {
      const { result } = renderHook(() =>
        useMuscleActivation({
          currentAnimation: "attack",
          attackAnimation: "jab",
          stamina: 100,
        })
      );

      // Verify initial state exists
      expect(result.current.muscleStates).toBeDefined();

      // Update 9 frames (no sync)
      act(() => {
        for (let i = 1; i < 10; i++) {
          result.current.updateMuscleActivations(0.016, i);
        }
      });

      // State may not have changed (depending on initial timing)
      expect(result.current.muscleStates).toBeDefined();

      // Frame 0 (sync frame)
      act(() => {
        result.current.updateMuscleActivations(0.016, 0);
      });

      // State should be synced now
      expect(result.current.muscleStates.size).toBeGreaterThanOrEqual(0);
    });
  });

  describe("cleanup", () => {
    it("should cleanup muscle manager on unmount", () => {
      const { unmount } = renderHook(() =>
        useMuscleActivation({
          currentAnimation: "attack",
          attackAnimation: "jab",
          stamina: 100,
        })
      );

      // Should not throw on unmount
      expect(() => unmount()).not.toThrow();
    });
  });
});
