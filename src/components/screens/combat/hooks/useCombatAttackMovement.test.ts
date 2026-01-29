/**
 * Tests for useCombatAttackMovement hook
 */

import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { AnimationType } from "@/systems/animation";
import { TrigramStance } from "@/types/common";
import { useCombatAttackMovement } from "./useCombatAttackMovement";

describe("useCombatAttackMovement", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return base positions when neither player is attacking", () => {
    const { result } = renderHook(() =>
      useCombatAttackMovement({
        player1Attacking: false,
        player1AnimationType: undefined,
        player1Stance: TrigramStance.GEON,
        player1BasePosition: [5, 0, 0],
        player2Attacking: false,
        player2AnimationType: undefined,
        player2Stance: TrigramStance.GON,
        player2BasePosition: [-5, 0, 0],
      })
    );

    expect(result.current.player1Position).toEqual([5, 0, 0]);
    expect(result.current.player2Position).toEqual([-5, 0, 0]);
    expect(result.current.player1IsLunging).toBe(false);
    expect(result.current.player2IsLunging).toBe(false);
  });

  it("should apply attack movement to player 1 when attacking", async () => {
    const { result } = renderHook(() =>
      useCombatAttackMovement({
        player1Attacking: true,
        player1AnimationType: AnimationType.ROUNDHOUSE_KICK,
        player1Stance: TrigramStance.GEON,
        player1BasePosition: [5, 0, 0],
        player2Attacking: false,
        player2AnimationType: undefined,
        player2Stance: TrigramStance.GON,
        player2BasePosition: [-5, 0, 0],
      })
    );

    // Initially should be lunging
    expect(result.current.player1IsLunging).toBe(true);

    // Position should move toward opponent (x decreasing)
    await waitFor(() => {
      expect(result.current.player1Position[0]).toBeLessThan(5);
    });

    // Player 2 should remain at base
    expect(result.current.player2Position).toEqual([-5, 0, 0]);
  });

  it("should apply attack movement to player 2 when attacking", async () => {
    const { result } = renderHook(() =>
      useCombatAttackMovement({
        player1Attacking: false,
        player1AnimationType: undefined,
        player1Stance: TrigramStance.GEON,
        player1BasePosition: [5, 0, 0],
        player2Attacking: true,
        player2AnimationType: AnimationType.FRONT_KICK,
        player2Stance: TrigramStance.GON,
        player2BasePosition: [-5, 0, 0],
      })
    );

    // Initially should be lunging
    expect(result.current.player2IsLunging).toBe(true);

    // Position should move toward opponent (x increasing)
    await waitFor(() => {
      expect(result.current.player2Position[0]).toBeGreaterThan(-5);
    });

    // Player 1 should remain at base
    expect(result.current.player1Position).toEqual([5, 0, 0]);
  });

  it("should handle both players attacking simultaneously", async () => {
    const { result } = renderHook(() =>
      useCombatAttackMovement({
        player1Attacking: true,
        player1AnimationType: AnimationType.JAB,
        player1Stance: TrigramStance.GEON,
        player1BasePosition: [5, 0, 0],
        player2Attacking: true,
        player2AnimationType: AnimationType.CROSS,
        player2Stance: TrigramStance.GON,
        player2BasePosition: [-5, 0, 0],
      })
    );

    // Both should be lunging
    expect(result.current.player1IsLunging).toBe(true);
    expect(result.current.player2IsLunging).toBe(true);

    // Both should move toward each other
    await waitFor(() => {
      expect(result.current.player1Position[0]).toBeLessThan(5);
      expect(result.current.player2Position[0]).toBeGreaterThan(-5);
    });
  });

  it("should return to base position after attack completes", async () => {
    const { result, rerender } = renderHook(
      ({ attacking }) =>
        useCombatAttackMovement({
          player1Attacking: attacking,
          player1AnimationType: AnimationType.JAB,
          player1Stance: TrigramStance.GEON,
          player1BasePosition: [5, 0, 0],
          player2Attacking: false,
          player2AnimationType: undefined,
          player2Stance: TrigramStance.GON,
          player2BasePosition: [-5, 0, 0],
        }),
      { initialProps: { attacking: true } }
    );

    // Should be attacking initially
    expect(result.current.player1IsLunging).toBe(true);

    // Stop attacking
    rerender({ attacking: false });

    // Should return to base position
    await waitFor(() => {
      expect(result.current.player1Position).toEqual([5, 0, 0]);
      expect(result.current.player1IsLunging).toBe(false);
    });
  });

  it("should calculate correct attack direction", async () => {
    const { result } = renderHook(() =>
      useCombatAttackMovement({
        player1Attacking: true,
        player1AnimationType: AnimationType.SIDE_KICK,
        player1Stance: TrigramStance.LI,
        player1BasePosition: [3, 0, 2],
        player2Attacking: false,
        player2AnimationType: undefined,
        player2Stance: TrigramStance.GAM,
        player2BasePosition: [-3, 0, -2],
      })
    );

    // Player 1 should move toward player 2 (x decreasing, z decreasing)
    await waitFor(() => {
      expect(result.current.player1Position[0]).toBeLessThan(3);
      expect(result.current.player1Position[2]).toBeLessThan(2);
    });
  });

  it("should respect stance modifiers (Heaven stance more aggressive)", async () => {
    // Heaven stance (GEON) has +30% movement modifier
    const heavenResult = renderHook(() =>
      useCombatAttackMovement({
        player1Attacking: true,
        player1AnimationType: AnimationType.ROUNDHOUSE_KICK,
        player1Stance: TrigramStance.GEON, // Heaven - most aggressive
        player1BasePosition: [5, 0, 0],
        player2Attacking: false,
        player2AnimationType: undefined,
        player2Stance: TrigramStance.GON,
        player2BasePosition: [-5, 0, 0],
      })
    );

    // Mountain stance (GAN) has -20% movement modifier
    const mountainResult = renderHook(() =>
      useCombatAttackMovement({
        player1Attacking: true,
        player1AnimationType: AnimationType.ROUNDHOUSE_KICK,
        player1Stance: TrigramStance.GAN, // Mountain - defensive
        player1BasePosition: [5, 0, 0],
        player2Attacking: false,
        player2AnimationType: undefined,
        player2Stance: TrigramStance.GON,
        player2BasePosition: [-5, 0, 0],
      })
    );

    await waitFor(() => {
      // Heaven stance should move further forward than Mountain stance
      const heavenDisplacement = 5 - heavenResult.result.current.player1Position[0];
      const mountainDisplacement =
        5 - mountainResult.result.current.player1Position[0];
      expect(heavenDisplacement).toBeGreaterThan(mountainDisplacement);
    });
  });

  it("should handle rapid attack state changes gracefully", async () => {
    const { result, rerender } = renderHook(
      ({ attacking }) =>
        useCombatAttackMovement({
          player1Attacking: attacking,
          player1AnimationType: AnimationType.JAB,
          player1Stance: TrigramStance.GEON,
          player1BasePosition: [5, 0, 0],
          player2Attacking: false,
          player2AnimationType: undefined,
          player2Stance: TrigramStance.GON,
          player2BasePosition: [-5, 0, 0],
        }),
      { initialProps: { attacking: true } }
    );

    // Toggle attack state rapidly
    rerender({ attacking: false });
    rerender({ attacking: true });
    rerender({ attacking: false });

    // Should eventually settle to base position
    await waitFor(() => {
      expect(result.current.player1Position).toEqual([5, 0, 0]);
      expect(result.current.player1IsLunging).toBe(false);
    });
  });

  it("should continue attack smoothly when base position changes during attack", async () => {
    // Test that attack movement continues without reset when base position shifts
    // (e.g., from knockback or displacement) while attack is in progress
    const { result, rerender } = renderHook(
      ({ basePos }) =>
        useCombatAttackMovement({
          player1Attacking: true,
          player1AnimationType: AnimationType.ROUNDHOUSE_KICK,
          player1Stance: TrigramStance.GEON,
          player1BasePosition: basePos,
          player2Attacking: false,
          player2AnimationType: undefined,
          player2Stance: TrigramStance.GON,
          player2BasePosition: [-5, 0, 0],
        }),
      { initialProps: { basePos: [5, 0, 0] as [number, number, number] } }
    );

    // Wait for attack movement to begin
    await waitFor(() => {
      expect(result.current.player1IsLunging).toBe(true);
    });

    // Simulate knockback: change base position while attack is still active
    rerender({ basePos: [6, 0, 0] as [number, number, number] });

    // Wait a brief moment for position update
    await waitFor(() => {
      // Position should have changed (not equal to captured position)
      // but attack should continue (isLunging should still be true initially)
      expect(result.current.player1Position).not.toEqual([5, 0, 0]);
    });

    // Attack should eventually complete and return to NEW base position
    await waitFor(
      () => {
        expect(result.current.player1Position).toEqual([6, 0, 0]);
        expect(result.current.player1IsLunging).toBe(false);
      },
      { timeout: 1000 }
    );
  });
});
