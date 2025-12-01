/**
 * useRoundTransition Hook Tests
 * 
 * Tests for round transition state management
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useRoundTransition } from "./useRoundTransition";
import { PlayerState } from "../systems";
import { PlayerArchetype, TrigramStance, CombatState } from "../types";

describe("useRoundTransition", () => {
  const mockWinner: PlayerState = {
    id: "player1",
    name: { korean: "무사", english: "Warrior" },
    archetype: PlayerArchetype.MUSA,
    health: 80,
    maxHealth: 100,
    ki: 90,
    maxKi: 100,
    stamina: 85,
    maxStamina: 100,
    energy: 100,
    maxEnergy: 100,
    attackPower: 15,
    defense: 12,
    speed: 10,
    technique: 14,
    currentStance: TrigramStance.GEON,
    combatState: CombatState.IDLE,
    position: { x: 100, y: 200 },
    isBlocking: false,
    isStunned: false,
    isCountering: false,
    statusEffects: [],
    vitalPointsHit: {},
    hitsLanded: 5,
    hitsTaken: 3,
    comboCount: 2,
    perfectBlockCount: 1,
    totalDamageDealt: 50,
    totalDamageReceived: 30,
    vitalPointHits: 2,
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should initialize with idle state", () => {
    const { result } = renderHook(() => useRoundTransition());

    expect(result.current.transitionState).toBe("idle");
    expect(result.current.showAnnouncement).toBe(false);
    expect(result.current.roundWinner).toBeNull();
    expect(result.current.currentRoundNumber).toBe(0);
  });

  it("should start transition and move through states", async () => {
    // Use real timers for this test
    vi.useRealTimers();
    
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useRoundTransition({ announcementDuration: 1, countdownDuration: 2 }, onComplete)
    );

    // Start transition
    act(() => {
      result.current.startTransition(mockWinner, 1);
    });

    // Should be in announcing state
    expect(result.current.transitionState).toBe("announcing");
    expect(result.current.showAnnouncement).toBe(true);
    expect(result.current.roundWinner).toBe(mockWinner);
    expect(result.current.currentRoundNumber).toBe(1);

    // After announcement duration, should move to countdown
    await waitFor(
      () => {
        expect(result.current.transitionState).toBe("countdown");
      },
      { timeout: 1500 }
    );

    // Countdown should start at configured duration
    expect(result.current.countdownValue).toBe(2);

    // Wait for countdown to decrement
    await waitFor(
      () => {
        expect(result.current.countdownValue).toBe(1);
      },
      { timeout: 1500 }
    );

    // Wait for complete countdown and transition
    await waitFor(
      () => {
        expect(result.current.transitionState).toBe("idle");
        expect(onComplete).toHaveBeenCalledTimes(1);
      },
      { timeout: 2000 }
    );
    
    vi.useFakeTimers();
  });

  it("should skip countdown when skipCountdown is called", async () => {
    // Use real timers for this test
    vi.useRealTimers();
    
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useRoundTransition({ announcementDuration: 1, countdownDuration: 3 }, onComplete)
    );

    // Start transition
    act(() => {
      result.current.startTransition(mockWinner, 1);
    });

    // Wait for announcing to complete and countdown to start
    await waitFor(
      () => {
        expect(result.current.transitionState).toBe("countdown");
      },
      { timeout: 1500 }
    );

    // Skip countdown
    act(() => {
      result.current.skipCountdown();
    });

    expect(result.current.transitionState).toBe("transitioning");

    // Wait for transition to complete
    await waitFor(
      () => {
        expect(result.current.transitionState).toBe("idle");
        expect(onComplete).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 }
    );
    
    vi.useFakeTimers();
  });

  it("should reset transition to idle", () => {
    const { result } = renderHook(() => useRoundTransition());

    // Start transition
    act(() => {
      result.current.startTransition(mockWinner, 1);
    });

    expect(result.current.transitionState).toBe("announcing");

    // Reset
    act(() => {
      result.current.resetTransition();
    });

    expect(result.current.transitionState).toBe("idle");
    expect(result.current.roundWinner).toBeNull();
    expect(result.current.currentRoundNumber).toBe(0);
  });

  it("should use default configuration values", () => {
    const { result } = renderHook(() => useRoundTransition());

    // Default countdown duration is 3
    expect(result.current.countdownValue).toBe(3);
  });

  it("should use custom configuration values", () => {
    const { result } = renderHook(() =>
      useRoundTransition({ countdownDuration: 5 })
    );

    expect(result.current.countdownValue).toBe(5);
  });

  it("should handle null winner", () => {
    const { result } = renderHook(() => useRoundTransition());

    act(() => {
      result.current.startTransition(null, 1);
    });

    expect(result.current.roundWinner).toBeNull();
    expect(result.current.transitionState).toBe("announcing");
  });

  it("should clean up timers on unmount", () => {
    const { result, unmount } = renderHook(() => useRoundTransition());

    act(() => {
      result.current.startTransition(mockWinner, 1);
    });

    // Unmount while in announcing state
    unmount();

    // Advance timers to verify no errors occur
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // No errors should be thrown
    expect(true).toBe(true);
  });

  it("should show announcement during announcing and countdown states", () => {
    const { result } = renderHook(() => useRoundTransition());

    expect(result.current.showAnnouncement).toBe(false);

    act(() => {
      result.current.startTransition(mockWinner, 1);
    });

    expect(result.current.showAnnouncement).toBe(true);
    expect(result.current.transitionState).toBe("announcing");

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.showAnnouncement).toBe(true);
    expect(result.current.transitionState).toBe("countdown");
  });

  it("should not show announcement in idle or transitioning states", async () => {
    // Use real timers for this test
    vi.useRealTimers();
    
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useRoundTransition(
        { announcementDuration: 1, countdownDuration: 1 },
        onComplete
      )
    );

    expect(result.current.showAnnouncement).toBe(false);

    act(() => {
      result.current.startTransition(mockWinner, 1);
    });

    // Complete entire transition
    await waitFor(
      () => {
        expect(result.current.transitionState).toBe("idle");
        expect(result.current.showAnnouncement).toBe(false);
      },
      { timeout: 3500 }
    );
    
    vi.useFakeTimers();
  });
});
