/**
 * Tests for useCombatState hook
 * Verifies state management with useReducer pattern
 */

import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCombatState } from "./useCombatState";
import { HitEffectType } from "@/systems/effects";

describe("useCombatState", () => {
  describe("initial state", () => {
    it("should have correct initial values", () => {
      const { result } = renderHook(() => useCombatState());
      
      expect(result.current.state.hitEffects).toEqual([]);
      expect(result.current.state.isExecutingTechnique).toBe(false);
      expect(result.current.state.combatMessages).toEqual([]);
      expect(result.current.state.roundStarted).toBe(false);
      expect(result.current.state.roundEnded).toBe(false);
      expect(result.current.state.roundDisplayStatus).toBeNull();
      expect(result.current.state.comboCount).toBe(0);
      expect(result.current.state.lastHitTime).toBe(0);
      expect(result.current.state.screenShake).toEqual({ x: 0, y: 0 });
    });
  });

  describe("hit effects actions", () => {
    it("should add hit effect", () => {
      const { result } = renderHook(() => useCombatState());
      
      const effect = {
        id: "test-1",
        type: HitEffectType.HIT,
        attackerId: "player1",
        defenderId: "player2",
        timestamp: Date.now(),
        duration: 1000,
        position: { x: 100, y: 100 },
        intensity: 1,
        startTime: Date.now(),
      };
      
      act(() => {
        result.current.actions.addHitEffect(effect);
      });
      
      expect(result.current.state.hitEffects).toHaveLength(1);
      expect(result.current.state.hitEffects[0]).toBe(effect);
    });

    it("should set hit effects array", () => {
      const { result } = renderHook(() => useCombatState());
      
      const effects = [
        {
          id: "test-1",
          type: HitEffectType.HIT,
          attackerId: "player1",
          defenderId: "player2",
          timestamp: Date.now(),
          duration: 1000,
          position: { x: 100, y: 100 },
          intensity: 1,
          startTime: Date.now(),
        },
        {
          id: "test-2",
          type: HitEffectType.CRITICAL_HIT,
          attackerId: "player1",
          defenderId: "player2",
          timestamp: Date.now(),
          duration: 1000,
          position: { x: 150, y: 150 },
          intensity: 1.5,
          startTime: Date.now(),
        },
      ];
      
      act(() => {
        result.current.actions.setHitEffects(effects);
      });
      
      expect(result.current.state.hitEffects).toHaveLength(2);
      expect(result.current.state.hitEffects).toEqual(effects);
    });

    it("should remove hit effect by id", () => {
      const { result } = renderHook(() => useCombatState());
      
      const effect1 = {
        id: "test-1",
        type: HitEffectType.HIT,
        attackerId: "player1",
        defenderId: "player2",
        timestamp: Date.now(),
        duration: 1000,
        position: { x: 100, y: 100 },
        intensity: 1,
        startTime: Date.now(),
      };
      
      const effect2 = {
        id: "test-2",
        type: HitEffectType.BLOCK,
        attackerId: "player1",
        defenderId: "player2",
        timestamp: Date.now(),
        duration: 1000,
        position: { x: 150, y: 150 },
        intensity: 0.8,
        startTime: Date.now(),
      };
      
      act(() => {
        result.current.actions.addHitEffect(effect1);
        result.current.actions.addHitEffect(effect2);
      });
      
      expect(result.current.state.hitEffects).toHaveLength(2);
      
      act(() => {
        result.current.actions.removeHitEffect("test-1");
      });
      
      expect(result.current.state.hitEffects).toHaveLength(1);
      expect(result.current.state.hitEffects[0].id).toBe("test-2");
    });
  });

  describe("technique execution actions", () => {
    it("should set executing technique to true", () => {
      const { result } = renderHook(() => useCombatState());
      
      act(() => {
        result.current.actions.setExecutingTechnique(true);
      });
      
      expect(result.current.state.isExecutingTechnique).toBe(true);
    });

    it("should set executing technique to false", () => {
      const { result } = renderHook(() => useCombatState());
      
      act(() => {
        result.current.actions.setExecutingTechnique(true);
        result.current.actions.setExecutingTechnique(false);
      });
      
      expect(result.current.state.isExecutingTechnique).toBe(false);
    });
  });

  describe("combat messages actions", () => {
    it("should add combat message", () => {
      const { result } = renderHook(() => useCombatState());
      
      act(() => {
        result.current.actions.addCombatMessage("공격 성공! | Attack Hit!");
      });
      
      expect(result.current.state.combatMessages).toHaveLength(1);
      expect(result.current.state.combatMessages[0]).toBe("공격 성공! | Attack Hit!");
    });

    it("should keep only last 5 messages", () => {
      const { result } = renderHook(() => useCombatState());
      
      act(() => {
        result.current.actions.addCombatMessage("Message 1");
        result.current.actions.addCombatMessage("Message 2");
        result.current.actions.addCombatMessage("Message 3");
        result.current.actions.addCombatMessage("Message 4");
        result.current.actions.addCombatMessage("Message 5");
        result.current.actions.addCombatMessage("Message 6");
      });
      
      expect(result.current.state.combatMessages).toHaveLength(5);
      expect(result.current.state.combatMessages[0]).toBe("Message 6");
      expect(result.current.state.combatMessages[4]).toBe("Message 2");
    });
  });

  describe("round management actions", () => {
    it("should set round started", () => {
      const { result } = renderHook(() => useCombatState());
      
      act(() => {
        result.current.actions.setRoundStarted(true);
      });
      
      expect(result.current.state.roundStarted).toBe(true);
    });

    it("should set round ended", () => {
      const { result } = renderHook(() => useCombatState());
      
      act(() => {
        result.current.actions.setRoundEnded(true);
      });
      
      expect(result.current.state.roundEnded).toBe(true);
    });

    it("should set round display status", () => {
      const { result } = renderHook(() => useCombatState());
      
      act(() => {
        result.current.actions.setRoundDisplayStatus("start");
      });
      
      expect(result.current.state.roundDisplayStatus).toBe("start");
      
      act(() => {
        result.current.actions.setRoundDisplayStatus("fight");
      });
      
      expect(result.current.state.roundDisplayStatus).toBe("fight");
    });

    it("should reset round state", () => {
      const { result } = renderHook(() => useCombatState());
      
      // Set up some state
      act(() => {
        result.current.actions.setRoundStarted(true);
        result.current.actions.setRoundEnded(true);
        result.current.actions.setRoundDisplayStatus("end");
        result.current.actions.setComboCount(5);
        result.current.actions.addHitEffect({
          id: "test",
          type: HitEffectType.HIT,
          attackerId: "player1",
          defenderId: "player2",
          timestamp: Date.now(),
          duration: 1000,
          position: { x: 100, y: 100 },
          intensity: 1,
          startTime: Date.now(),
        });
      });
      
      // Reset
      act(() => {
        result.current.actions.resetRoundState();
      });
      
      expect(result.current.state.roundStarted).toBe(false);
      expect(result.current.state.roundEnded).toBe(false);
      expect(result.current.state.roundDisplayStatus).toBeNull();
      expect(result.current.state.comboCount).toBe(0);
      expect(result.current.state.hitEffects).toEqual([]);
    });
  });

  describe("combo tracking actions", () => {
    it("should set combo count", () => {
      const { result } = renderHook(() => useCombatState());
      
      act(() => {
        result.current.actions.setComboCount(5);
      });
      
      expect(result.current.state.comboCount).toBe(5);
    });

    it("should increment combo", () => {
      const { result } = renderHook(() => useCombatState());
      
      act(() => {
        result.current.actions.incrementCombo();
        result.current.actions.incrementCombo();
        result.current.actions.incrementCombo();
      });
      
      expect(result.current.state.comboCount).toBe(3);
    });

    it("should reset combo", () => {
      const { result } = renderHook(() => useCombatState());
      
      act(() => {
        result.current.actions.setComboCount(10);
        result.current.actions.resetCombo();
      });
      
      expect(result.current.state.comboCount).toBe(0);
    });

    it("should set last hit time", () => {
      const { result } = renderHook(() => useCombatState());
      const timestamp = Date.now();
      
      act(() => {
        result.current.actions.setLastHitTime(timestamp);
      });
      
      expect(result.current.state.lastHitTime).toBe(timestamp);
    });
  });

  describe("screen shake actions", () => {
    it("should set screen shake", () => {
      const { result } = renderHook(() => useCombatState());
      
      act(() => {
        result.current.actions.setScreenShake({ x: 5, y: -3 });
      });
      
      expect(result.current.state.screenShake).toEqual({ x: 5, y: -3 });
    });

    it("should reset screen shake", () => {
      const { result } = renderHook(() => useCombatState());
      
      act(() => {
        result.current.actions.setScreenShake({ x: 8, y: -5 });
        result.current.actions.resetScreenShake();
      });
      
      expect(result.current.state.screenShake).toEqual({ x: 0, y: 0 });
    });
  });

  describe("state updates batching", () => {
    it("should batch multiple state updates", () => {
      const { result } = renderHook(() => useCombatState());
      
      act(() => {
        result.current.actions.setRoundStarted(true);
        result.current.actions.setComboCount(3);
        result.current.actions.addCombatMessage("Test message");
        result.current.actions.setExecutingTechnique(true);
      });
      
      expect(result.current.state.roundStarted).toBe(true);
      expect(result.current.state.comboCount).toBe(3);
      expect(result.current.state.combatMessages).toHaveLength(1);
      expect(result.current.state.isExecutingTechnique).toBe(true);
    });
  });
});
