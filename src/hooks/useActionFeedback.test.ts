/**
 * useActionFeedback Hook Tests
 * 
 * Tests for the action feedback state management hook.
 */

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useActionFeedback } from "./useActionFeedback";

describe("useActionFeedback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with empty state", () => {
    const { result } = renderHook(() => useActionFeedback());

    expect(result.current.state.damageNumbers).toEqual([]);
    expect(result.current.state.actionFeedbacks).toEqual([]);
    expect(result.current.state.comboCount).toBe(0);
    expect(result.current.state.lastHitTime).toBe(0);
    expect(result.current.state.currentTechnique).toBeNull();
  });

  describe("damage numbers", () => {
    it("should add damage number", () => {
      const { result } = renderHook(() => useActionFeedback());

      act(() => {
        result.current.actions.addDamageNumber(25, { x: 100, y: 200 }, "normal");
      });

      expect(result.current.state.damageNumbers).toHaveLength(1);
      expect(result.current.state.damageNumbers[0].damage).toBe(25);
      expect(result.current.state.damageNumbers[0].type).toBe("normal");
      expect(result.current.state.damageNumbers[0].position).toEqual({ x: 100, y: 200 });
    });

    it("should add critical damage number", () => {
      const { result } = renderHook(() => useActionFeedback());

      act(() => {
        result.current.actions.addDamageNumber(50, { x: 150, y: 250 }, "critical");
      });

      expect(result.current.state.damageNumbers[0].type).toBe("critical");
    });

    it("should add vital damage number", () => {
      const { result } = renderHook(() => useActionFeedback());

      act(() => {
        result.current.actions.addDamageNumber(35, { x: 150, y: 250 }, "vital");
      });

      expect(result.current.state.damageNumbers[0].type).toBe("vital");
    });

    it("should clear expired damage numbers", () => {
      const { result } = renderHook(() => useActionFeedback({
        damageNumberDuration: 1000,
      }));

      act(() => {
        result.current.actions.addDamageNumber(25, { x: 100, y: 200 }, "normal");
      });

      expect(result.current.state.damageNumbers).toHaveLength(1);

      // Advance time past the duration
      act(() => {
        vi.advanceTimersByTime(1100);
      });

      expect(result.current.state.damageNumbers).toHaveLength(0);
    });
  });

  describe("action feedback", () => {
    it("should add action feedback", () => {
      const { result } = renderHook(() => useActionFeedback());

      act(() => {
        result.current.actions.addActionFeedback(
          "critical",
          "Critical!",
          "치명타!",
          { x: 100, y: 200 }
        );
      });

      expect(result.current.state.actionFeedbacks).toHaveLength(1);
      expect(result.current.state.actionFeedbacks[0].type).toBe("critical");
      expect(result.current.state.actionFeedbacks[0].text).toBe("Critical!");
      expect(result.current.state.actionFeedbacks[0].textKorean).toBe("치명타!");
    });

    it("should add blocked feedback", () => {
      const { result } = renderHook(() => useActionFeedback());

      act(() => {
        result.current.actions.addActionFeedback(
          "blocked",
          "Blocked",
          "방어!",
          { x: 100, y: 200 }
        );
      });

      expect(result.current.state.actionFeedbacks[0].type).toBe("blocked");
    });

    it("should add dodged feedback", () => {
      const { result } = renderHook(() => useActionFeedback());

      act(() => {
        result.current.actions.addActionFeedback(
          "dodged",
          "Dodged",
          "회피!",
          { x: 100, y: 200 }
        );
      });

      expect(result.current.state.actionFeedbacks[0].type).toBe("dodged");
    });

    it("should clear expired action feedbacks", () => {
      const { result } = renderHook(() => useActionFeedback({
        actionFeedbackDuration: 1000,
      }));

      act(() => {
        result.current.actions.addActionFeedback(
          "perfect",
          "Perfect!",
          "완벽!",
          { x: 100, y: 200 }
        );
      });

      expect(result.current.state.actionFeedbacks).toHaveLength(1);

      // Advance time past the duration
      act(() => {
        vi.advanceTimersByTime(1100);
      });

      expect(result.current.state.actionFeedbacks).toHaveLength(0);
    });
  });

  describe("combo counter", () => {
    it("should increment combo", () => {
      const { result } = renderHook(() => useActionFeedback());

      act(() => {
        result.current.actions.incrementCombo();
      });

      expect(result.current.state.comboCount).toBe(1);

      act(() => {
        result.current.actions.incrementCombo();
      });

      expect(result.current.state.comboCount).toBe(2);
    });

    it("should reset combo", () => {
      const { result } = renderHook(() => useActionFeedback());

      act(() => {
        result.current.actions.incrementCombo();
        result.current.actions.incrementCombo();
        result.current.actions.incrementCombo();
      });

      expect(result.current.state.comboCount).toBe(3);

      act(() => {
        result.current.actions.resetCombo();
      });

      expect(result.current.state.comboCount).toBe(0);
    });

    it("should auto-reset combo after timeout", () => {
      const { result } = renderHook(() => useActionFeedback({
        comboResetTime: 2000,
      }));

      act(() => {
        result.current.actions.incrementCombo();
        result.current.actions.incrementCombo();
      });

      expect(result.current.state.comboCount).toBe(2);

      // Advance time past the reset time
      act(() => {
        vi.advanceTimersByTime(2100);
      });

      expect(result.current.state.comboCount).toBe(0);
    });

    it("should reset combo timer on each increment", () => {
      const { result } = renderHook(() => useActionFeedback({
        comboResetTime: 2000,
      }));

      act(() => {
        result.current.actions.incrementCombo();
      });

      // Advance time but not past reset
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      act(() => {
        result.current.actions.incrementCombo();
      });

      expect(result.current.state.comboCount).toBe(2);

      // Advance time again
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // Combo should still be active since we reset the timer
      expect(result.current.state.comboCount).toBe(2);

      // Now wait for the full reset time
      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(result.current.state.comboCount).toBe(0);
    });

    it("should update lastHitTime on increment", () => {
      const { result } = renderHook(() => useActionFeedback());

      expect(result.current.state.lastHitTime).toBe(0);

      act(() => {
        result.current.actions.incrementCombo();
      });

      expect(result.current.state.lastHitTime).toBeGreaterThan(0);
    });
  });

  describe("technique display", () => {
    it("should show technique name", () => {
      const { result } = renderHook(() => useActionFeedback());

      act(() => {
        result.current.actions.showTechnique("천둥벽력", "Thunder Strike");
      });

      expect(result.current.state.currentTechnique).toEqual({
        korean: "천둥벽력",
        english: "Thunder Strike",
      });
    });

    it("should hide technique after duration", () => {
      const { result } = renderHook(() => useActionFeedback({
        techniqueDuration: 2000,
      }));

      act(() => {
        result.current.actions.showTechnique("천둥벽력", "Thunder Strike");
      });

      expect(result.current.state.currentTechnique).not.toBeNull();

      act(() => {
        vi.advanceTimersByTime(2100);
      });

      expect(result.current.state.currentTechnique).toBeNull();
    });

    it("should hide technique manually", () => {
      const { result } = renderHook(() => useActionFeedback());

      act(() => {
        result.current.actions.showTechnique("천둥벽력", "Thunder Strike");
      });

      expect(result.current.state.currentTechnique).not.toBeNull();

      act(() => {
        result.current.actions.hideTechnique();
      });

      expect(result.current.state.currentTechnique).toBeNull();
    });

    it("should replace existing technique", () => {
      const { result } = renderHook(() => useActionFeedback());

      act(() => {
        result.current.actions.showTechnique("천둥벽력", "Thunder Strike");
      });

      act(() => {
        result.current.actions.showTechnique("화염지창", "Fire Spear");
      });

      expect(result.current.state.currentTechnique).toEqual({
        korean: "화염지창",
        english: "Fire Spear",
      });
    });
  });

  describe("clearExpired", () => {
    it("should clear all expired items", () => {
      const { result } = renderHook(() => useActionFeedback({
        damageNumberDuration: 1000,
        actionFeedbackDuration: 1000,
      }));

      act(() => {
        result.current.actions.addDamageNumber(25, { x: 100, y: 200 }, "normal");
        result.current.actions.addActionFeedback(
          "critical",
          "Critical!",
          "치명타!",
          { x: 100, y: 200 }
        );
      });

      expect(result.current.state.damageNumbers).toHaveLength(1);
      expect(result.current.state.actionFeedbacks).toHaveLength(1);

      act(() => {
        vi.advanceTimersByTime(1100);
      });

      expect(result.current.state.damageNumbers).toHaveLength(0);
      expect(result.current.state.actionFeedbacks).toHaveLength(0);
    });
  });
});
