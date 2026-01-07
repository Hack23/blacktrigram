/**
 * Tests for usePlayerAnimation stance transition integration
 * 
 * Validates the transitionToStanceChange method in the hook
 * 
 * @module hooks/usePlayerAnimation.stance-transition.test
 * @category Testing
 */

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePlayerAnimation } from "./usePlayerAnimation";
import { TrigramStance } from "../types/common";

describe("usePlayerAnimation - Stance Transition Integration", () => {
  it("should expose transitionToStanceChange method", () => {
    const { result } = renderHook(() => usePlayerAnimation());
    
    expect(result.current.transitionToStanceChange).toBeDefined();
    expect(typeof result.current.transitionToStanceChange).toBe("function");
  });

  it("should successfully transition with transitionToStanceChange", () => {
    const { result } = renderHook(() => usePlayerAnimation());
    
    let success = false;
    act(() => {
      success = result.current.transitionToStanceChange(
        TrigramStance.GEON,
        TrigramStance.TAE
      );
    });
    
    expect(success).toBe(true);
    expect(result.current.currentState).toBe("stance_change");
  });

  it("should handle all 64 stance transitions", () => {
    const stances = [
      TrigramStance.GEON,
      TrigramStance.TAE,
      TrigramStance.LI,
      TrigramStance.JIN,
      TrigramStance.SON,
      TrigramStance.GAM,
      TrigramStance.GAN,
      TrigramStance.GON,
    ];

    for (const from of stances) {
      for (const to of stances) {
        const { result } = renderHook(() => usePlayerAnimation());
        
        let success = false;
        act(() => {
          success = result.current.transitionToStanceChange(from, to);
        });
        
        expect(success).toBe(true);
      }
    }
  });

  it("should update state when transition succeeds", () => {
    const { result } = renderHook(() => usePlayerAnimation());
    
    const initialState = result.current.currentState;
    expect(initialState).toBe("idle");
    
    act(() => {
      result.current.transitionToStanceChange(
        TrigramStance.GEON,
        TrigramStance.TAE
      );
    });
    
    expect(result.current.currentState).toBe("stance_change");
    expect(result.current.currentState).not.toBe(initialState);
  });

  it("should transition to guard after stance_change completes", () => {
    const { result } = renderHook(() => usePlayerAnimation());
    
    // Start stance transition
    act(() => {
      result.current.transitionToStanceChange(
        TrigramStance.GEON,
        TrigramStance.TAE
      );
    });
    
    expect(result.current.currentState).toBe("stance_change");
    
    // Simulate animation completion (36 frames at 60fps)
    act(() => {
      for (let i = 0; i < 40; i++) {
        result.current.update(1 / 60);
      }
    });
    
    // Should be back to idle after completion
    expect(result.current.currentState).toBe("idle");
    
    // Can now transition to target guard
    act(() => {
      result.current.transitionToStanceGuard(TrigramStance.TAE);
    });
    
    expect(result.current.currentState).toBe("stance_guard_tae");
  });

  it("should work in combat flow scenario", () => {
    const { result } = renderHook(() => usePlayerAnimation());
    
    // Player starts in idle
    expect(result.current.currentState).toBe("idle");
    
    // Player transitions to first stance guard
    act(() => {
      result.current.transitionToStanceGuard(TrigramStance.GEON);
    });
    expect(result.current.currentState).toBe("stance_guard_geon");
    
    // Player changes stance during combat
    act(() => {
      result.current.transitionToStanceChange(
        TrigramStance.GEON,
        TrigramStance.TAE
      );
    });
    expect(result.current.currentState).toBe("stance_change");
    
    // Wait for transition to complete
    act(() => {
      for (let i = 0; i < 40; i++) {
        result.current.update(1 / 60);
      }
    });
    
    // Back to idle, can transition to new guard
    expect(result.current.currentState).toBe("idle");
    
    act(() => {
      result.current.transitionToStanceGuard(TrigramStance.TAE);
    });
    expect(result.current.currentState).toBe("stance_guard_tae");
  });
});
