/**
 * Unit tests for useTechniqueSelection hook
 *
 * Tests technique selection, keyboard shortcuts, cooldown tracking,
 * and resource validation.
 */

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PlayerState } from "../systems/player";
import { CombatState, PlayerArchetype, TrigramStance } from "../types";
import { useTechniqueSelection } from "./useTechniqueSelection";

describe("useTechniqueSelection", () => {
  let mockPlayer: PlayerState;

  beforeEach(() => {
    // Create mock player with full resources
    mockPlayer = {
      id: "player-1",
      name: { korean: "테스트", english: "Test" },
      archetype: PlayerArchetype.MUSA,
      health: 100,
      maxHealth: 100,
      ki: 100,
      maxKi: 100,
      stamina: 100,
      maxStamina: 100,
      energy: 100,
      maxEnergy: 100,
      attackPower: 15,
      defense: 10,
      speed: 10,
      technique: 10,
      pain: 0,
      consciousness: 100,
      balance: 100,
      momentum: 0,
      currentStance: TrigramStance.GEON,
      combatState: CombatState.IDLE,
      position: { x: 0, y: 0 },
      isBlocking: false,
      isStunned: false,
      isCountering: false,
      statusEffects: [],
      hitsLanded: 0,
      hitsTaken: 0,
      blockedAttacks: 0,
      misses: 0,
      comboCount: 0,
      vitalPointHits: 0,
      totalDamageDealt: 0,
      totalDamageReceived: 0,
    };

    // Mock timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should load available techniques for player archetype", () => {
    const { result } = renderHook(() =>
      useTechniqueSelection({
        player: mockPlayer,
        enabled: true,
      })
    );

    // Now returns stance-based techniques + archetype techniques
    // GEON stance has 7 techniques + 4 MUSA archetype techniques (filtered by stance) = varies
    expect(result.current.availableTechniques.length).toBeGreaterThan(4);
    // First technique should be from GEON stance (천둥벽력 - Thunder Strike)
    expect(result.current.availableTechniques[0].name.korean).toBe("천둥벽력");
    expect(result.current.selectedIndex).toBe(0);
  });

  it("should select technique by index", () => {
    const onTechniqueSelected = vi.fn();
    const { result } = renderHook(() =>
      useTechniqueSelection({
        player: mockPlayer,
        enabled: true,
        onTechniqueSelected,
      })
    );

    act(() => {
      result.current.selectTechnique(2);
    });

    expect(result.current.selectedIndex).toBe(2);
    expect(onTechniqueSelected).toHaveBeenCalledWith(
      result.current.availableTechniques[2]
    );
  });

  it("should validate technique execution with sufficient resources", () => {
    const { result } = renderHook(() =>
      useTechniqueSelection({
        player: mockPlayer,
        enabled: true,
      })
    );

    const technique = result.current.availableTechniques[0];
    const validation = result.current.validateTechnique(technique);

    expect(validation.canExecute).toBe(true);
    expect(validation.reason).toBeUndefined();
  });

  it("should reject technique execution with insufficient stamina", () => {
    const lowStaminaPlayer = { ...mockPlayer, stamina: 10 };
    const { result } = renderHook(() =>
      useTechniqueSelection({
        player: lowStaminaPlayer,
        enabled: true,
      })
    );

    const technique = result.current.availableTechniques[0]; // Costs 30 stamina
    const validation = result.current.validateTechnique(technique);

    expect(validation.canExecute).toBe(false);
    expect(validation.insufficientStamina).toBe(true);
    expect(validation.reason).toBe("Insufficient stamina");
  });

  it("should reject technique execution with insufficient Ki", () => {
    const lowKiPlayer = { ...mockPlayer, ki: 10 };
    const { result } = renderHook(() =>
      useTechniqueSelection({
        player: lowKiPlayer,
        enabled: true,
      })
    );

    const technique = result.current.availableTechniques[0]; // Costs 20 Ki
    const validation = result.current.validateTechnique(technique);

    expect(validation.canExecute).toBe(false);
    expect(validation.insufficientKi).toBe(true);
    expect(validation.reason).toBe("Insufficient Ki");
  });

  it("should execute technique and start cooldown", async () => {
    const onTechniqueExecute = vi.fn();
    const { result } = renderHook(() =>
      useTechniqueSelection({
        player: mockPlayer,
        enabled: true,
        onTechniqueExecute,
      })
    );

    const technique = result.current.availableTechniques[0];

    act(() => {
      result.current.executeTechnique();
    });

    expect(onTechniqueExecute).toHaveBeenCalledWith(technique);
    expect(result.current.activeCooldowns).toHaveLength(1);
    expect(result.current.isOnCooldown(technique.id)).toBe(true);
  });

  it("should reject technique execution when on cooldown", () => {
    const onTechniqueExecute = vi.fn();
    const { result } = renderHook(() =>
      useTechniqueSelection({
        player: mockPlayer,
        enabled: true,
        onTechniqueExecute,
      })
    );

    // Verify we have techniques available before testing cooldown
    expect(result.current.availableTechniques.length).toBeGreaterThan(0);

    // Execute once to start cooldown
    act(() => {
      result.current.executeTechnique();
    });

    // Try to execute again
    act(() => {
      result.current.executeTechnique();
    });

    // Should only be called once
    expect(onTechniqueExecute).toHaveBeenCalledTimes(1);
  });

  it("should update cooldown remaining time", async () => {
    const onTechniqueExecute = vi.fn();
    const { result } = renderHook(() =>
      useTechniqueSelection({
        player: mockPlayer,
        enabled: true,
        onTechniqueExecute,
      })
    );

    const technique = result.current.availableTechniques[0];

    act(() => {
      result.current.executeTechnique();
    });

    const initialRemaining = result.current.getRemainingCooldown(technique.id);
    expect(initialRemaining).toBeGreaterThan(0);

    // Advance timer by 1 second and flush intervals
    act(() => {
      vi.advanceTimersByTime(1100); // Wait for interval update (100ms)
    });

    const newRemaining = result.current.getRemainingCooldown(technique.id);
    expect(newRemaining).toBeLessThan(initialRemaining);
  });

  it("should remove cooldown when complete", async () => {
    const onTechniqueExecute = vi.fn();
    const { result } = renderHook(() =>
      useTechniqueSelection({
        player: mockPlayer,
        enabled: true,
        onTechniqueExecute,
      })
    );

    const technique = result.current.availableTechniques[0];

    act(() => {
      result.current.executeTechnique();
    });

    expect(result.current.isOnCooldown(technique.id)).toBe(true);

    // Advance past cooldown duration (5000ms) plus interval update
    act(() => {
      vi.advanceTimersByTime(5200);
    });

    expect(result.current.isOnCooldown(technique.id)).toBe(false);
    expect(result.current.activeCooldowns).toHaveLength(0);
  });

  it("should handle keyboard shortcuts when enabled", () => {
    const onTechniqueExecute = vi.fn();
    renderHook(() =>
      useTechniqueSelection({
        player: mockPlayer,
        enabled: true,
        onTechniqueExecute,
      })
    );

    // Simulate Q key press
    act(() => {
      const event = new KeyboardEvent("keydown", { key: "q" });
      window.dispatchEvent(event);
    });

    expect(onTechniqueExecute).toHaveBeenCalled();
  });

  it("should not handle keyboard shortcuts when disabled", () => {
    const onTechniqueExecute = vi.fn();
    renderHook(() =>
      useTechniqueSelection({
        player: mockPlayer,
        enabled: false,
        onTechniqueExecute,
      })
    );

    // Simulate Q key press
    act(() => {
      const event = new KeyboardEvent("keydown", { key: "q" });
      window.dispatchEvent(event);
    });

    expect(onTechniqueExecute).not.toHaveBeenCalled();
  });

  it("should check if player has sufficient resources", () => {
    const { result } = renderHook(() =>
      useTechniqueSelection({
        player: mockPlayer,
        enabled: true,
      })
    );

    const technique = result.current.availableTechniques[0];
    expect(result.current.hasResources(technique)).toBe(true);

    const lowResourcePlayer = { ...mockPlayer, stamina: 10, ki: 10 };
    const { result: result2 } = renderHook(() =>
      useTechniqueSelection({
        player: lowResourcePlayer,
        enabled: true,
      })
    );

    expect(result2.current.hasResources(technique)).toBe(false);
  });
});
