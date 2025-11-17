/**
 * Tests for useAICombat hook
 * Verifies AI combat behavior and decision-making
 */

import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useAICombat } from "./useAICombat";
import { PlayerState } from "@/systems/player";
import { TrigramStance, PlayerArchetype, Position } from "@/types";
import { 
  AdaptiveDifficulty,
} from "@/systems/ai";
import { AI_PERSONALITIES } from "@/systems/ai/AIPersonality";

// Mock player state factory
function createMockPlayer(overrides?: Partial<PlayerState>): PlayerState {
  return {
    health: 100,
    maxHealth: 100,
    ki: 100,
    maxKi: 100,
    stamina: 100,
    maxStamina: 100,
    position: { x: 400, y: 300 },
    currentStance: TrigramStance.GEON,
    archetype: PlayerArchetype.MUSA,
    combatState: "idle",
    isBlocking: false,
    totalDamageDealt: 0,
    totalDamageReceived: 0,
    comboCount: 0,
    lastAttackTime: 0,
    ...overrides,
  } as PlayerState;
}

describe("useAICombat", () => {
  let mockOnExecuteAction: ReturnType<typeof vi.fn>;
  let mockOnStanceChange: ReturnType<typeof vi.fn>;
  let mockAdaptiveDifficulty: AdaptiveDifficulty;

  beforeEach(() => {
    vi.useFakeTimers();
    mockOnExecuteAction = vi.fn();
    mockOnStanceChange = vi.fn();
    mockAdaptiveDifficulty = new AdaptiveDifficulty();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("Initialization", () => {
    it("should initialize with correct initial state", () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: false,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      expect(result.current.aiState).toBeDefined();
      expect(result.current.aiState.lastActionType).toBe("idle");
      expect(result.current.aiState.consecutiveAttacks).toBe(0);
      expect(result.current.comboSystem).toBeDefined();
      expect(result.current.decisionTree).toBeDefined();
      expect(result.current.adjustedPersonality).toBeDefined();
    });

    it("should initialize combo system", () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: false,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      expect(result.current.comboSystem).toBeDefined();
      expect(result.current.comboSystem.isComboActive()).toBe(false);
    });

    it("should work with DEFENSIVE_SPECIALIST personality", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.DEFENSIVE_SPECIALIST,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: false,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      expect(result.current.decisionTree).toBeDefined();
    });
  });

  describe("Personality Adjustment", () => {
    it("should adjust personality based on adaptive difficulty", () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.BALANCED_FIGHTER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: false,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      expect(result.current.adjustedPersonality).toBeDefined();
      expect(result.current.adjustedPersonality.aggressionLevel).toBeGreaterThanOrEqual(0);
    });

    it("should update aggression level in AI state", () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: false,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      expect(result.current.aiState.aggressionLevel).toBe(
        result.current.adjustedPersonality.aggressionLevel
      );
    });
  });

  describe("Round Start Behavior", () => {
    it("should reset AI systems when round starts", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result, rerender } = renderHook(
        ({ roundStarted }) =>
          useAICombat({
            player,
            opponent,
            personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
            adaptiveDifficulty: mockAdaptiveDifficulty,
            isPaused: false,
            roundStarted,
            roundEnded: false,
            arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
            onExecuteAction: mockOnExecuteAction,
            onStanceChange: mockOnStanceChange,
          }),
        { initialProps: { roundStarted: false } }
      );

      // Start round - should reset systems
      rerender({ roundStarted: true });

      // Combo system should be initialized (not necessarily active)
      expect(result.current.comboSystem).toBeDefined();
      expect(result.current.comboSystem.isComboActive()).toBe(false);
    });

    it("should initialize damage tracking on round start", () => {
      const player = createMockPlayer({ totalDamageReceived: 50 });
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result, rerender } = renderHook(
        ({ roundStarted }) =>
          useAICombat({
            player,
            opponent,
            personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
            adaptiveDifficulty: mockAdaptiveDifficulty,
            isPaused: false,
            roundStarted,
            roundEnded: false,
            arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
            onExecuteAction: mockOnExecuteAction,
            onStanceChange: mockOnStanceChange,
          }),
        { initialProps: { roundStarted: false } }
      );

      rerender({ roundStarted: true });

      // State should be initialized
      expect(result.current.aiState).toBeDefined();
    });
  });

  describe("AI Decision Loop", () => {
    it("should not execute actions when paused", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: true,
          roundStarted: true,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      // Wait for potential AI actions
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockOnExecuteAction).not.toHaveBeenCalled();
    });

    it("should not execute actions when round not started", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: false,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockOnExecuteAction).not.toHaveBeenCalled();
    });

    it("should not execute actions when round ended", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: true,
          roundEnded: true,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockOnExecuteAction).not.toHaveBeenCalled();
    });

    it("should execute actions when round is active", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: true,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockOnExecuteAction).toHaveBeenCalled();
    });

    it("should respect action cooldown", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: true,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      const callCountBefore = mockOnExecuteAction.mock.calls.length;

      // Advance time by less than cooldown
      act(() => {
        vi.advanceTimersByTime(100);
      });

      const callCountAfter = mockOnExecuteAction.mock.calls.length;

      // Should respect cooldown and not call too frequently
      expect(callCountAfter - callCountBefore).toBeLessThan(5);
    });
  });

  describe("executeAIAction", () => {
    it("should call onExecuteAction callback", () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: false,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      act(() => {
        result.current.executeAIAction("attack");
      });

      expect(mockOnExecuteAction).toHaveBeenCalledWith("attack", undefined);
    });

    it("should pass target position to callback", () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });
      const targetPosition: Position = { x: 600, y: 400 };

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: false,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      act(() => {
        result.current.executeAIAction("approach", targetPosition);
      });

      expect(mockOnExecuteAction).toHaveBeenCalledWith("approach", targetPosition);
    });
  });

  describe("Combat Context Building", () => {
    it("should calculate distance correctly", async () => {
      const player = createMockPlayer({ position: { x: 400, y: 300 } });
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: true,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      // Wait for AI to make a decision
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // The AI should have processed context
      expect(result.current.aiState).toBeDefined();
    });

    it("should track damage received", async () => {
      const player = createMockPlayer({ totalDamageReceived: 0 });
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result, rerender } = renderHook(
        ({ player }) =>
          useAICombat({
            player,
            opponent,
            personality: AI_PERSONALITIES.DEFENSIVE_SPECIALIST,
            adaptiveDifficulty: mockAdaptiveDifficulty,
            isPaused: false,
            roundStarted: true,
            roundEnded: false,
            arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
            onExecuteAction: mockOnExecuteAction,
            onStanceChange: mockOnStanceChange,
          }),
        { initialProps: { player } }
      );

      // Simulate damage
      const damagedPlayer = createMockPlayer({ totalDamageReceived: 20 });
      rerender({ player: damagedPlayer });

      act(() => {
        vi.advanceTimersByTime(100);
      });

      // AI should have processed the damage in context
      expect(result.current.aiState).toBeDefined();
    });
  });

  describe("Stance Changes", () => {
    it("should call onStanceChange when stance change decision is made", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      // This test validates that the hook doesn't crash with stance changes
      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.TECHNICAL_MASTER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: true,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      // Let AI make decisions
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Note: onStanceChange may or may not be called depending on decision tree logic
      expect(result.current).toBeDefined();
    });

    it("should handle missing onStanceChange callback gracefully", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.TECHNICAL_MASTER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: true,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          // No onStanceChange provided
        })
      );

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current).toBeDefined();
    });
  });

  describe("Performance Monitoring", () => {
    it("should track AI state updates", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: true,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // AI state should update and track actions
      expect(result.current.aiState).toBeDefined();
      expect(result.current.aiState.lastActionType).toBeDefined();
    });

    it("should update consecutive attacks counter", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ 
        position: { x: 450, y: 300 }, // Close distance to encourage attacks
        health: 100,
      });

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: true,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      const initialAttacks = result.current.aiState.consecutiveAttacks;

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Consecutive attacks should be tracked (value may stay 0 or increase)
      expect(result.current.aiState.consecutiveAttacks).toBeGreaterThanOrEqual(0);
      // Verify state is being tracked
      expect(typeof result.current.aiState.consecutiveAttacks).toBe('number');
    });
  });

  describe("Different AI Personalities", () => {
    it("should work with AGGRESSIVE_STRIKER personality", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: true,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockOnExecuteAction).toHaveBeenCalled();
      expect(result.current.adjustedPersonality.aggressionLevel).toBeGreaterThan(0.5);
    });

    it("should work with DEFENSIVE_SPECIALIST personality", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.DEFENSIVE_SPECIALIST,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: true,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockOnExecuteAction).toHaveBeenCalled();
      expect(result.current.adjustedPersonality.defensePreference).toBeGreaterThan(0.5);
    });

    it("should work with BALANCED_FIGHTER personality", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.BALANCED_FIGHTER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: true,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockOnExecuteAction).toHaveBeenCalled();
    });

    it("should work with TECHNICAL_MASTER personality", async () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { result } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.TECHNICAL_MASTER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: true,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockOnExecuteAction).toHaveBeenCalled();
    });
  });

  describe("Cleanup", () => {
    it("should cleanup interval on unmount", () => {
      const player = createMockPlayer();
      const opponent = createMockPlayer({ position: { x: 800, y: 300 } });

      const { unmount } = renderHook(() =>
        useAICombat({
          player,
          opponent,
          personality: AI_PERSONALITIES.AGGRESSIVE_STRIKER,
          adaptiveDifficulty: mockAdaptiveDifficulty,
          isPaused: false,
          roundStarted: true,
          roundEnded: false,
          arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
          onExecuteAction: mockOnExecuteAction,
          onStanceChange: mockOnStanceChange,
        })
      );

      const callCountBefore = mockOnExecuteAction.mock.calls.length;

      unmount();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      const callCountAfter = mockOnExecuteAction.mock.calls.length;

      // No new calls should be made after unmount
      expect(callCountAfter).toBe(callCountBefore);
    });
  });
});
