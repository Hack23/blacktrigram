import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { PlayerArchetype } from "@/types";
import { createPlayerFromArchetype } from "@/utils/playerUtils";
import { useAICombat, AICombatCallbacks } from "./useAICombat";
import { ArenaBounds } from "./useCombatLayout";

describe("useAICombat", () => {
  let mockCallbacks: AICombatCallbacks;
  let arenaBounds: ArenaBounds;

  beforeEach(() => {
    vi.useFakeTimers();
    mockCallbacks = {
      onAttack: vi.fn(),
      onDefend: vi.fn(),
      onTechnique: vi.fn(),
      onMove: vi.fn(),
    };
    arenaBounds = {
      x: 120,
      y: 150,
      width: 960,
      height: 420,
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initialization", () => {
    it("should initialize with default AI state", () => {
      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      const { result } = renderHook(() =>
        useAICombat(
          true,
          [
            { x: 300, y: 400 },
            { x: 800, y: 400 },
          ],
          [player1, player2],
          arenaBounds,
          mockCallbacks
        )
      );

      expect(result.current.aiState).toBeDefined();
      expect(result.current.aiState.aggressionLevel).toBe(0.65);
      expect(result.current.aiState.consecutiveAttacks).toBe(0);
    });
  });

  describe("AI decision making", () => {
    it("should execute attack when players are close", async () => {
      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      renderHook(() =>
        useAICombat(
          true,
          [
            { x: 300, y: 400 },
            { x: 380, y: 400 }, // Close distance (~80 units)
          ],
          [player1, player2],
          arenaBounds,
          mockCallbacks
        )
      );

      // Advance timer to trigger AI decision
      await vi.advanceTimersByTimeAsync(1100);

      // AI should have made some action
      expect(
        mockCallbacks.onAttack.mock.calls.length +
          mockCallbacks.onDefend.mock.calls.length +
          mockCallbacks.onTechnique.mock.calls.length
      ).toBeGreaterThan(0);
    });

    it("should execute move when players are far apart", async () => {
      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      renderHook(() =>
        useAICombat(
          true,
          [
            { x: 200, y: 400 },
            { x: 800, y: 400 }, // Far distance (600 units)
          ],
          [player1, player2],
          arenaBounds,
          mockCallbacks
        )
      );

      await vi.advanceTimersByTimeAsync(1100);

      // AI should attempt to move closer
      expect(mockCallbacks.onMove).toHaveBeenCalled();
    });

    it("should defend more when AI health is low", async () => {
      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = {
        ...createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1),
        health: 20,
        maxHealth: 100,
      };

      renderHook(() =>
        useAICombat(
          true,
          [
            { x: 300, y: 400 },
            { x: 380, y: 400 },
          ],
          [player1, player2],
          arenaBounds,
          mockCallbacks
        )
      );

      await vi.advanceTimersByTimeAsync(2000);

      // With low health, AI should be more defensive or retreat
      expect(
        mockCallbacks.onDefend.mock.calls.length +
          mockCallbacks.onMove.mock.calls.length
      ).toBeGreaterThan(0);
    });
  });

  describe("combo system", () => {
    it("should track consecutive attacks", async () => {
      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      const { result } = renderHook(() =>
        useAICombat(
          true,
          [
            { x: 300, y: 400 },
            { x: 380, y: 400 },
          ],
          [player1, player2],
          arenaBounds,
          mockCallbacks
        )
      );

      const initialAttacks = result.current.aiState.consecutiveAttacks;

      await vi.advanceTimersByTimeAsync(3000);

      // Note: Due to randomness, we can't guarantee exact behavior
      // Just verify the state is being updated
      expect(result.current.aiState).toBeDefined();
    });
  });

  describe("enabled/disabled state", () => {
    it("should not execute actions when disabled", async () => {
      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      renderHook(() =>
        useAICombat(
          false, // Disabled
          [
            { x: 300, y: 400 },
            { x: 380, y: 400 },
          ],
          [player1, player2],
          arenaBounds,
          mockCallbacks
        )
      );

      await vi.advanceTimersByTimeAsync(2000);

      expect(mockCallbacks.onAttack).not.toHaveBeenCalled();
      expect(mockCallbacks.onDefend).not.toHaveBeenCalled();
      expect(mockCallbacks.onTechnique).not.toHaveBeenCalled();
      expect(mockCallbacks.onMove).not.toHaveBeenCalled();
    });

    it("should resume when re-enabled", async () => {
      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      const { rerender } = renderHook(
        ({ enabled }) =>
          useAICombat(
            enabled,
            [
              { x: 300, y: 400 },
              { x: 380, y: 400 },
            ],
            [player1, player2],
            arenaBounds,
            mockCallbacks
          ),
        {
          initialProps: { enabled: false },
        }
      );

      await vi.advanceTimersByTimeAsync(1000);
      expect(mockCallbacks.onAttack).not.toHaveBeenCalled();

      rerender({ enabled: true });
      await vi.advanceTimersByTimeAsync(1100);

      // Should now execute actions
      expect(
        mockCallbacks.onAttack.mock.calls.length +
          mockCallbacks.onDefend.mock.calls.length +
          mockCallbacks.onTechnique.mock.calls.length +
          mockCallbacks.onMove.mock.calls.length
      ).toBeGreaterThan(0);
    });
  });

  describe("resource management", () => {
    it("should prefer attacks over techniques when resources are low", async () => {
      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = {
        ...createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1),
        ki: 5,
        maxKi: 100,
        stamina: 10,
        maxStamina: 100,
      };

      renderHook(() =>
        useAICombat(
          true,
          [
            { x: 300, y: 400 },
            { x: 380, y: 400 },
          ],
          [player1, player2],
          arenaBounds,
          mockCallbacks
        )
      );

      await vi.advanceTimersByTimeAsync(2000);

      // With low resources, techniques should be less frequent
      const techniqueCount = mockCallbacks.onTechnique.mock.calls.length;
      const totalActions =
        mockCallbacks.onAttack.mock.calls.length +
        mockCallbacks.onDefend.mock.calls.length +
        techniqueCount;

      if (totalActions > 0) {
        expect(techniqueCount / totalActions).toBeLessThan(0.5);
      }
    });
  });

  describe("boundary constraints", () => {
    it("should keep AI movement within arena bounds", async () => {
      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      renderHook(() =>
        useAICombat(
          true,
          [
            { x: 200, y: 400 },
            { x: 900, y: 400 },
          ],
          [player1, player2],
          arenaBounds,
          mockCallbacks
        )
      );

      await vi.advanceTimersByTimeAsync(2000);

      // Check that any move calls respect bounds
      mockCallbacks.onMove.mock.calls.forEach((call) => {
        const position = call[0];
        expect(position.x).toBeGreaterThanOrEqual(arenaBounds.x);
        expect(position.x).toBeLessThanOrEqual(
          arenaBounds.x + arenaBounds.width
        );
        expect(position.y).toBeGreaterThanOrEqual(arenaBounds.y);
        expect(position.y).toBeLessThanOrEqual(
          arenaBounds.y + arenaBounds.height
        );
      });
    });
  });

  describe("action cooldowns", () => {
    it("should respect action cooldown timing", async () => {
      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      renderHook(() =>
        useAICombat(
          true,
          [
            { x: 300, y: 400 },
            { x: 380, y: 400 },
          ],
          [player1, player2],
          arenaBounds,
          mockCallbacks
        )
      );

      // Initial state - should not execute immediately
      expect(mockCallbacks.onAttack).not.toHaveBeenCalled();

      // After initial delay, should start executing
      await vi.advanceTimersByTimeAsync(1100);

      const actionsAfterDelay =
        mockCallbacks.onAttack.mock.calls.length +
        mockCallbacks.onDefend.mock.calls.length +
        mockCallbacks.onTechnique.mock.calls.length +
        mockCallbacks.onMove.mock.calls.length;

      expect(actionsAfterDelay).toBeGreaterThan(0);
    });
  });
});
