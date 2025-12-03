/**
 * Tests for useCombatTimer hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCombatTimer } from "./useCombatTimer";

// Create a mock playSFX function that we can track
const mockPlaySFX = vi.fn();
let mockIsAudioReady = true;

// Mock audio provider with controllable isAudioReady
vi.mock("../audio/AudioProvider", () => ({
  useAudio: () => ({
    get isAudioReady() {
      return mockIsAudioReady;
    },
    playSFX: mockPlaySFX,
  }),
}));

describe("useCombatTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockPlaySFX.mockClear();
    mockIsAudioReady = true; // Reset to true for each test
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should initialize with initial time", () => {
    const { result } = renderHook(() =>
      useCombatTimer({
        initialTime: 180,
        isPaused: false,
        onTimeUp: vi.fn(),
      })
    );

    expect(result.current.timeRemaining).toBe(180);
    expect(result.current.formattedTime).toBe("03:00");
    expect(result.current.warningLevel).toBe("none");
    expect(result.current.isTimeUp).toBe(false);
  });

  it("should format time correctly", () => {
    const { result } = renderHook(() =>
      useCombatTimer({
        initialTime: 65,
        isPaused: false,
        onTimeUp: vi.fn(),
      })
    );

    expect(result.current.formattedTime).toBe("01:05");
  });

  it("should countdown when not paused", () => {
    const { result } = renderHook(() =>
      useCombatTimer({
        initialTime: 10,
        isPaused: false,
        onTimeUp: vi.fn(),
      })
    );

    expect(result.current.timeRemaining).toBe(10);

    // Advance time by 1 second (10 ticks of 100ms)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should have decreased
    expect(result.current.timeRemaining).toBeLessThan(10);
    expect(result.current.timeRemaining).toBeGreaterThan(8.5);
  });

  it("should pause countdown when isPaused is true", () => {
    const { result, rerender } = renderHook(
      ({ isPaused }) =>
        useCombatTimer({
          initialTime: 10,
          isPaused,
          onTimeUp: vi.fn(),
        }),
      {
        initialProps: { isPaused: false },
      }
    );

    // Let it countdown a bit
    act(() => {
      vi.advanceTimersByTime(500);
    });

    const timeBefore = result.current.timeRemaining;

    // Pause
    rerender({ isPaused: true });

    // Advance time while paused
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Time should not change while paused
    expect(result.current.timeRemaining).toBe(timeBefore);
  });

  it("should resume countdown after being paused", () => {
    const { result, rerender } = renderHook(
      ({ isPaused }) =>
        useCombatTimer({
          initialTime: 10,
          isPaused,
          onTimeUp: vi.fn(),
        }),
      {
        initialProps: { isPaused: false },
      }
    );

    // Let it countdown a bit (should be around 9.5s)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    const timeAfterFirstCountdown = result.current.timeRemaining;
    expect(timeAfterFirstCountdown).toBeLessThan(10);
    expect(timeAfterFirstCountdown).toBeGreaterThan(9);

    // Pause
    rerender({ isPaused: true });

    // Advance time while paused (time shouldn't change)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const timeDuringPause = result.current.timeRemaining;
    expect(timeDuringPause).toBe(timeAfterFirstCountdown);

    // Resume
    rerender({ isPaused: false });

    // Advance time after resuming (should continue from paused time)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const timeAfterResume = result.current.timeRemaining;
    expect(timeAfterResume).toBeLessThan(timeDuringPause);
    expect(timeAfterResume).toBeGreaterThan(timeDuringPause - 1.5);
  });

  it("should show warning level at 10 seconds", () => {
    const { result } = renderHook(() =>
      useCombatTimer({
        initialTime: 11,
        isPaused: false,
        onTimeUp: vi.fn(),
        warningThreshold: 10,
        urgentThreshold: 5,
      })
    );

    expect(result.current.warningLevel).toBe("none");

    // Advance time to reach warning threshold
    act(() => {
      vi.advanceTimersByTime(1500); // 1.5 seconds
    });

    expect(result.current.warningLevel).toBe("warning");
  });

  it("should show urgent level at 5 seconds", () => {
    const { result } = renderHook(() =>
      useCombatTimer({
        initialTime: 6,
        isPaused: false,
        onTimeUp: vi.fn(),
        warningThreshold: 10,
        urgentThreshold: 5,
      })
    );

    expect(result.current.warningLevel).toBe("warning");

    // Advance time to reach urgent threshold
    act(() => {
      vi.advanceTimersByTime(1500); // 1.5 seconds
    });

    expect(result.current.warningLevel).toBe("urgent");
  });

  it("should call onTimeUp when timer reaches 0", () => {
    const onTimeUp = vi.fn();
    const { result } = renderHook(() =>
      useCombatTimer({
        initialTime: 1,
        isPaused: false,
        onTimeUp,
      })
    );

    expect(onTimeUp).not.toHaveBeenCalled();

    // Advance time to reach 0
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.isTimeUp).toBe(true);
    expect(result.current.timeRemaining).toBe(0);
    expect(onTimeUp).toHaveBeenCalledTimes(1);
  });

  it("should reset when initialTime changes", () => {
    const { result, rerender } = renderHook(
      ({ initialTime }) =>
        useCombatTimer({
          initialTime,
          isPaused: false,
          onTimeUp: vi.fn(),
        }),
      {
        initialProps: { initialTime: 10 },
      }
    );

    // Let timer run
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Change initial time (new round)
    rerender({ initialTime: 180 });

    expect(result.current.timeRemaining).toBe(180);
    expect(result.current.isTimeUp).toBe(false);
    expect(result.current.formattedTime).toBe("03:00");
  });

  it("should handle custom warning thresholds", () => {
    const { result } = renderHook(() =>
      useCombatTimer({
        initialTime: 30,
        isPaused: false,
        onTimeUp: vi.fn(),
        warningThreshold: 20,
        urgentThreshold: 10,
      })
    );

    expect(result.current.warningLevel).toBe("none");

    // At 19 seconds, should show warning
    const { result: result2 } = renderHook(() =>
      useCombatTimer({
        initialTime: 19,
        isPaused: false,
        onTimeUp: vi.fn(),
        warningThreshold: 20,
        urgentThreshold: 10,
      })
    );

    expect(result2.current.warningLevel).toBe("warning");

    // At 9 seconds, should show urgent
    const { result: result3 } = renderHook(() =>
      useCombatTimer({
        initialTime: 9,
        isPaused: false,
        onTimeUp: vi.fn(),
        warningThreshold: 20,
        urgentThreshold: 10,
      })
    );

    expect(result3.current.warningLevel).toBe("urgent");
  });

  it("should not go below 0", () => {
    const { result } = renderHook(() =>
      useCombatTimer({
        initialTime: 0.5,
        isPaused: false,
        onTimeUp: vi.fn(),
      })
    );

    // Advance time beyond initial time
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.timeRemaining).toBeGreaterThanOrEqual(0);
    expect(result.current.timeRemaining).toBeLessThanOrEqual(0.5);
  });

  it("should format time correctly for edge cases", () => {
    // Test 0 seconds
    const { result: result1 } = renderHook(() =>
      useCombatTimer({
        initialTime: 0,
        isPaused: false,
        onTimeUp: vi.fn(),
      })
    );
    expect(result1.current.formattedTime).toBe("00:00");

    // Test 59 seconds
    const { result: result2 } = renderHook(() =>
      useCombatTimer({
        initialTime: 59,
        isPaused: false,
        onTimeUp: vi.fn(),
      })
    );
    expect(result2.current.formattedTime).toBe("00:59");

    // Test 60 seconds
    const { result: result3 } = renderHook(() =>
      useCombatTimer({
        initialTime: 60,
        isPaused: false,
        onTimeUp: vi.fn(),
      })
    );
    expect(result3.current.formattedTime).toBe("01:00");

    // Test 599 seconds (9:59)
    const { result: result4 } = renderHook(() =>
      useCombatTimer({
        initialTime: 599,
        isPaused: false,
        onTimeUp: vi.fn(),
      })
    );
    expect(result4.current.formattedTime).toBe("09:59");
  });

  describe("Audio Warnings", () => {
    it("should play 10s warning sound when crossing warning threshold", () => {
      renderHook(() =>
        useCombatTimer({
          initialTime: 11,
          isPaused: false,
          onTimeUp: vi.fn(),
          warningThreshold: 10,
          urgentThreshold: 5,
        })
      );

      expect(mockPlaySFX).not.toHaveBeenCalled();

      // Advance time to cross warning threshold
      act(() => {
        vi.advanceTimersByTime(1500); // 1.5 seconds, should be at ~9.5s
      });

      // Should have played warning sound once
      expect(mockPlaySFX).toHaveBeenCalledTimes(1);
      expect(mockPlaySFX).toHaveBeenCalledWith("attack_light");
    });

    it("should play 5s urgent warning sound when crossing urgent threshold", () => {
      renderHook(() =>
        useCombatTimer({
          initialTime: 6,
          isPaused: false,
          onTimeUp: vi.fn(),
          warningThreshold: 10,
          urgentThreshold: 5,
        })
      );

      // Should have played warning sound immediately (already below 10s)
      expect(mockPlaySFX).toHaveBeenCalledTimes(1);
      expect(mockPlaySFX).toHaveBeenCalledWith("attack_light");
      mockPlaySFX.mockClear();

      // Advance time to cross urgent threshold
      act(() => {
        vi.advanceTimersByTime(1500); // 1.5 seconds, should be at ~4.5s
      });

      // Should have played urgent sound once
      expect(mockPlaySFX).toHaveBeenCalledTimes(1);
      expect(mockPlaySFX).toHaveBeenCalledWith("attack_heavy");
    });

    it("should not play audio when isAudioReady is false", () => {
      // Set audio to not ready
      mockIsAudioReady = false;

      renderHook(() =>
        useCombatTimer({
          initialTime: 6,
          isPaused: false,
          onTimeUp: vi.fn(),
          warningThreshold: 10,
          urgentThreshold: 5,
        })
      );

      // Should not play any audio when isAudioReady is false
      expect(mockPlaySFX).not.toHaveBeenCalled();

      // Advance time to cross urgent threshold
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      // Still should not play audio
      expect(mockPlaySFX).not.toHaveBeenCalled();
    });

    it("should not play audio when paused during threshold crossing", () => {
      const { rerender } = renderHook(
        ({ isPaused }) =>
          useCombatTimer({
            initialTime: 11,
            isPaused,
            onTimeUp: vi.fn(),
            warningThreshold: 10,
            urgentThreshold: 5,
          }),
        {
          initialProps: { isPaused: false },
        }
      );

      expect(mockPlaySFX).not.toHaveBeenCalled();

      // Pause before crossing threshold
      rerender({ isPaused: true });

      // Advance time while paused (should cross threshold)
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Should not play audio while paused
      expect(mockPlaySFX).not.toHaveBeenCalled();
    });

    it("should play warning sound only once per threshold", () => {
      renderHook(() =>
        useCombatTimer({
          initialTime: 11,
          isPaused: false,
          onTimeUp: vi.fn(),
          warningThreshold: 10,
          urgentThreshold: 5,
        })
      );

      expect(mockPlaySFX).not.toHaveBeenCalled();

      // Cross warning threshold
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      expect(mockPlaySFX).toHaveBeenCalledTimes(1);
      mockPlaySFX.mockClear();

      // Continue countdown but stay in warning range
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Should not play warning sound again while in same warning level
      expect(mockPlaySFX).not.toHaveBeenCalled();
    });
  });
});
