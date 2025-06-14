import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useTrainingStatistics } from "./useTrainingStatistics";

/**
 * ## Training Statistics Hook Test Suite
 *
 * **Business Purpose:**
 * Validates the statistics tracking hook that manages Korean martial arts
 * performance metrics and progression analysis.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("useTrainingStatistics", () => {
  const initialStats = {
    attempts: 0,
    hits: 0,
    perfectStrikes: 0,
    accuracy: 0,
    sessionTime: 0,
    experienceGained: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with provided statistics", () => {
    const { result } = renderHook(() => useTrainingStatistics(initialStats));

    expect(result.current.stats).toEqual(initialStats);
    expect(result.current.getAccuracyTrend()).toBe("stable");
  });

  it("should update statistics correctly", () => {
    const { result } = renderHook(() => useTrainingStatistics(initialStats));

    act(() => {
      result.current.updateStats({
        attempts: 5,
        hits: 4,
        accuracy: 80,
      });
    });

    expect(result.current.stats.attempts).toBe(5);
    expect(result.current.stats.hits).toBe(4);
    expect(result.current.stats.accuracy).toBe(80);
  });

  it("should calculate Korean martial arts grades correctly", () => {
    const { result } = renderHook(() => useTrainingStatistics({
      ...initialStats,
      accuracy: 85,
    }));

    const grade = result.current.getKoreanGrade();
    expect(grade.grade).toBe("양호");
    expect(grade.color).toBe("green");
  });

  it("should track accuracy trends", () => {
    const { result } = renderHook(() => useTrainingStatistics(initialStats));

    // Simulate improving accuracy
    act(() => {
      result.current.updateStats({ accuracy: 60 });
    });
    act(() => {
      result.current.updateStats({ accuracy: 70 });
    });
    act(() => {
      result.current.updateStats({ accuracy: 80 });
    });

    expect(result.current.getAccuracyTrend()).toBe("improving");
  });
});
      });

      expect(result.current.stats.sessionTime).toBe(10);

      // Reset stats
      act(() => {
        result.current.resetStats();
      });

      expect(result.current.stats.sessionTime).toBe(0);

      // Advance time again
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.stats.sessionTime).toBe(5);
    });
  });

  describe("Statistics Updates", () => {
    it("should increment attempts correctly", () => {
      const { result } = renderHook(() => useTrainingStatistics());

      act(() => {
        result.current.incrementAttempts();
      });

      expect(result.current.stats.attempts).toBe(1);

      act(() => {
        result.current.incrementAttempts();
        result.current.incrementAttempts();
      });

      expect(result.current.stats.attempts).toBe(3);
    });

    it("should increment perfect strikes correctly", () => {
      const { result } = renderHook(() => useTrainingStatistics());

      act(() => {
        result.current.incrementPerfectStrikes();
      });

      expect(result.current.stats.perfectStrikes).toBe(1);
    });

    it("should increment critical hits correctly", () => {
      const { result } = renderHook(() => useTrainingStatistics());

      act(() => {
        result.current.incrementCriticalHits();
      });

      expect(result.current.stats.criticalHits).toBe(1);
    });

    it("should increment techniques executed correctly", () => {
      const { result } = renderHook(() => useTrainingStatistics());

      act(() => {
        result.current.incrementTechniques();
      });

      expect(result.current.stats.techniquesExecuted).toBe(1);
    });

    it("should increment stance changes correctly", () => {
      const { result } = renderHook(() => useTrainingStatistics());

      act(() => {
        result.current.incrementStanceChanges();
      });

      expect(result.current.stats.stanceChanges).toBe(1);
    });
  });

  describe("Damage Tracking", () => {
    it("should add damage and update totals", () => {
      const { result } = renderHook(() => useTrainingStatistics());

      // First, execute some techniques to avoid division by zero
      act(() => {
        result.current.incrementTechniques();
        result.current.addDamage(50);
      });

      expect(result.current.stats.totalDamage).toBe(50);
      expect(result.current.stats.averageDamage).toBe(50);

      act(() => {
        result.current.incrementTechniques();
        result.current.addDamage(30);
      });

      expect(result.current.stats.totalDamage).toBe(80);
      expect(result.current.stats.averageDamage).toBe(40); // 80 / 2
    });

    it("should handle zero techniques executed", () => {
      const { result } = renderHook(() => useTrainingStatistics());

      act(() => {
        result.current.addDamage(25);
      });

      expect(result.current.stats.totalDamage).toBe(25);
      expect(result.current.stats.averageDamage).toBe(25); // Should use damage value when no techniques
    });
  });

  describe("Accuracy Calculation", () => {
    it("should calculate accuracy correctly", () => {
      const { result } = renderHook(() => useTrainingStatistics());

      // Set up some attempts and perfect strikes
      act(() => {
        result.current.incrementAttempts();
        result.current.incrementAttempts();
        result.current.incrementAttempts();
        result.current.incrementAttempts();
        result.current.incrementPerfectStrikes();
        result.current.incrementPerfectStrikes();
        result.current.updateAccuracy();
      });

      expect(result.current.stats.attempts).toBe(4);
      expect(result.current.stats.perfectStrikes).toBe(2);
      expect(result.current.stats.accuracy).toBe(50); // 2/4 * 100
    });

    it("should handle zero attempts", () => {
      const { result } = renderHook(() => useTrainingStatistics());

      act(() => {
        result.current.updateAccuracy();
      });

      expect(result.current.stats.accuracy).toBe(0);
    });

    it("should handle perfect accuracy", () => {
      const { result } = renderHook(() => useTrainingStatistics());

      act(() => {
        result.current.incrementAttempts();
        result.current.incrementAttempts();
        result.current.incrementPerfectStrikes();
        result.current.incrementPerfectStrikes();
        result.current.updateAccuracy();
      });

      expect(result.current.stats.accuracy).toBe(100);
    });
  });

  describe("Best Combo Tracking", () => {
    it("should update best combo when higher", () => {
      const { result } = renderHook(() => useTrainingStatistics());

      act(() => {
        result.current.updateBestCombo(5);
      });

      expect(result.current.stats.bestCombo).toBe(5);

      act(() => {
        result.current.updateBestCombo(3);
      });

      expect(result.current.stats.bestCombo).toBe(5); // Should not decrease

      act(() => {
        result.current.updateBestCombo(8);
      });

      expect(result.current.stats.bestCombo).toBe(8); // Should increase
    });
  });

  describe("Bulk Updates", () => {
    it("should update multiple stats at once", () => {
      const { result } = renderHook(() => useTrainingStatistics());

      act(() => {
        result.current.updateStats({
          attempts: 10,
          perfectStrikes: 7,
          totalDamage: 350,
        });
      });

      expect(result.current.stats.attempts).toBe(10);
      expect(result.current.stats.perfectStrikes).toBe(7);
      expect(result.current.stats.totalDamage).toBe(350);
      // Other stats should remain unchanged
      expect(result.current.stats.criticalHits).toBe(0);
    });
  });

  describe("Reset Functionality", () => {
    it("should reset all statistics to initial values", () => {
      const { result } = renderHook(() => useTrainingStatistics());

      // Set up some statistics
      act(() => {
        result.current.incrementAttempts();
        result.current.incrementPerfectStrikes();
        result.current.addDamage(100);
        result.current.updateBestCombo(5);
      });

      // Verify stats are not zero
      expect(result.current.stats.attempts).toBe(1);
      expect(result.current.stats.perfectStrikes).toBe(1);
      expect(result.current.stats.totalDamage).toBe(100);
      expect(result.current.stats.bestCombo).toBe(5);

      // Reset
      act(() => {
        result.current.resetStats();
      });

      // Verify all stats are reset
      expect(result.current.stats).toEqual({
        attempts: 0,
        techniquesExecuted: 0,
        perfectStrikes: 0,
        criticalHits: 0,
        totalDamage: 0,
        sessionTime: 0,
        accuracy: 0,
        averageDamage: 0,
        bestCombo: 0,
        stanceChanges: 0,
      });
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle a complete training session", () => {
      const { result } = renderHook(() => useTrainingStatistics());

      act(() => {
        // Simulate a training session
        result.current.incrementAttempts(); // Attempt 1
        result.current.incrementTechniques();
        result.current.addDamage(25);
        result.current.incrementPerfectStrikes();

        result.current.incrementAttempts(); // Attempt 2
        result.current.incrementTechniques();
        result.current.addDamage(15);

        result.current.incrementAttempts(); // Attempt 3
        result.current.incrementTechniques();
        result.current.addDamage(30);
        result.current.incrementPerfectStrikes();
        result.current.incrementCriticalHits();

        result.current.incrementStanceChanges();
        result.current.updateBestCombo(3);
        result.current.updateAccuracy();
      });

      expect(result.current.stats.attempts).toBe(3);
      expect(result.current.stats.techniquesExecuted).toBe(3);
      expect(result.current.stats.perfectStrikes).toBe(2);
      expect(result.current.stats.criticalHits).toBe(1);
      expect(result.current.stats.totalDamage).toBe(70);
      expect(result.current.stats.averageDamage).toBeCloseTo(23.33, 2);
      expect(result.current.stats.accuracy).toBeCloseTo(66.67, 2);
      expect(result.current.stats.bestCombo).toBe(3);
      expect(result.current.stats.stanceChanges).toBe(1);
    });
  });
});
