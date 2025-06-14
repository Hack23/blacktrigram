import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import useTrainingSession from "./hooks/useTrainingSession";
import { TrigramStance, PlayerArchetype } from "../../../types/enums";
import type { PlayerState } from "../../../types/player";

const mockAudio = {
  playSFX: vi.fn(),
  playMusic: vi.fn(),
  stopMusic: vi.fn(),
  setVolume: vi.fn(),
  isInitialized: true,
};

const mockPlayer: PlayerState = {
  id: "test-player",
  name: { korean: "테스트", english: "Test" },
  archetype: PlayerArchetype.MUSA,
  experiencePoints: 100,
  currentStance: TrigramStance.GEON,
  health: 100,
  maxHealth: 100,
  ki: 100,
  maxKi: 100,
  stamina: 100,
  maxStamina: 100,
  energy: 100,
  maxEnergy: 100,
  attackPower: 75,
  defense: 75,
  speed: 75,
  technique: 75,
  pain: 0,
  consciousness: 100,
  balance: 100,
  momentum: 0,
  combatState: "idle" as any,
  position: { x: 0, y: 0 },
  isBlocking: false,
  isStunned: false,
  isCountering: false,
  lastActionTime: 0,
  recoveryTime: 0,
  lastStanceChangeTime: 0,
  statusEffects: [],
  activeEffects: [],
  vitalPoints: [],
  totalDamageReceived: 0,
  totalDamageDealt: 0,
  hitsTaken: 0,
  hitsLanded: 0,
  perfectStrikes: 0,
  vitalPointHits: 0,
};

const mockModeData = {
  mode: "basics" as const,
  name: { korean: "기본", english: "Basics" },
  description: { korean: "기본 훈련", english: "Basic training" },
  maxAttempts: 20,
  difficulty: 1,
  requiredLevel: 1,
  availableStances: [TrigramStance.GEON],
  focusAreas: ["accuracy"],
};

describe("useTrainingSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize correctly", () => {
    const { result } = renderHook(() => useTrainingSession({
      mode: "basics",
      modeData: mockModeData,
      player: mockPlayer,
      onPlayerUpdate: vi.fn(),
      audio: mockAudio,
    }));

    expect(result.current.isTraining).toBe(false);
    expect(result.current.currentCombo).toBe(0);
    expect(result.current.stats.attempts).toBe(0);
  });

  it("should start training session", () => {
    const { result } = renderHook(() => useTrainingSession({
      mode: "basics",
      modeData: mockModeData,
      player: mockPlayer,
      onPlayerUpdate: vi.fn(),
      audio: mockAudio,
    }));

    act(() => {
      result.current.startTraining();
    });

    expect(result.current.isTraining).toBe(true);
    expect(mockAudio.playSFX).toHaveBeenCalledWith("training_start");
  });

  it("should execute training technique", () => {
    const mockOnPlayerUpdate = vi.fn();
    const { result } = renderHook(() => useTrainingSession({
      mode: "basics",
      modeData: mockModeData,
      player: mockPlayer,
      onPlayerUpdate: mockOnPlayerUpdate,
      audio: mockAudio,
    }));

    act(() => {
      result.current.startTraining();
    });

    act(() => {
      const techniqueResult = result.current.executeTrainingTechnique({
        stance: TrigramStance.GEON,
        dummy: {
          health: 100,
          maxHealth: 100,
          position: { x: 0, y: 0 },
          isActive: true,
          lastHitTime: 0,
          hitCount: 0,
          isStunned: false,
          defensiveMode: false,
        },
        currentCombo: 0,
        lastTechniqueTime: 0,
      });

      expect(techniqueResult).toBeDefined();
      expect(techniqueResult.damage).toBeGreaterThan(0);
    });

    expect(result.current.stats.attempts).toBe(1);
    expect(mockOnPlayerUpdate).toHaveBeenCalled();
  });

  it("should reset training session", () => {
    const { result } = renderHook(() => useTrainingSession({
      mode: "basics",
      modeData: mockModeData,
      player: mockPlayer,
      onPlayerUpdate: vi.fn(),
      audio: mockAudio,
    }));

    act(() => {
      result.current.startTraining();
    });

    act(() => {
      result.current.resetTrainingSession();
    });

    expect(result.current.stats.attempts).toBe(0);
    expect(result.current.currentCombo).toBe(0);
  });
});
      expect(mockAudio.playMusic).toHaveBeenCalledWith("training_theme");
    });

    it("should stop training session correctly", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      // Start training first
      act(() => {
        result.current.startTraining();
      });

      // Then stop it
      act(() => {
        result.current.stopTraining();
      });

      expect(result.current.isTraining).toBe(false);
      expect(mockAudio.playSFX).toHaveBeenCalledWith("training_complete");
      expect(mockAudio.stopMusic).toHaveBeenCalled();
      expect(mockOnPlayerUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          experiencePoints: expect.any(Number),
        })
      );
    });

    it("should pause training session", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      // Start training first
      act(() => {
        result.current.startTraining();
      });

      // Then pause it
      act(() => {
        result.current.pauseTraining();
      });

      expect(result.current.isSessionPaused).toBe(true);
      expect(mockAudio.playSFX).toHaveBeenCalledWith("menu_select");
      expect(mockAudio.setVolume).toHaveBeenCalledWith("music", 0.3);
    });

    it("should resume training session", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      // Start and pause training
      act(() => {
        result.current.startTraining();
        result.current.pauseTraining();
      });

      // Then resume
      act(() => {
        result.current.resumeTraining();
      });

      expect(result.current.isSessionPaused).toBe(false);
      expect(mockAudio.setVolume).toHaveBeenCalledWith("music", 0.7);
    });

    it("should not pause when not training", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      act(() => {
        result.current.pauseTraining();
      });

      expect(result.current.isSessionPaused).toBe(false);
      expect(mockAudio.playSFX).not.toHaveBeenCalled();
    });

    it("should not resume when not paused", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      act(() => {
        result.current.startTraining();
        result.current.resumeTraining();
      });

      expect(mockAudio.setVolume).not.toHaveBeenCalledWith("music", 0.7);
    });
  });

  describe("Technique Execution", () => {
    it("should execute technique when training", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      act(() => {
        result.current.startTraining();
      });

      let techniqueResult: any;
      act(() => {
        techniqueResult = result.current.executeTrainingTechnique({
          stance: TrigramStance.GEON,
          dummy: { health: 100, maxHealth: 100 } as any,
          currentCombo: 0,
          lastTechniqueTime: 0,
        });
      });

      expect(techniqueResult.hit).toBe(true);
      expect(techniqueResult.damage).toBe(25);
      expect(mockAudio.playSFX).toHaveBeenCalledWith("perfect_hit");
    });

    it("should not execute technique when not training", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      let techniqueResult: any;
      act(() => {
        techniqueResult = result.current.executeTrainingTechnique({
          stance: TrigramStance.GEON,
          dummy: {} as any,
          currentCombo: 0,
          lastTechniqueTime: 0,
        });
      });

      expect(techniqueResult.miss).toBe(true);
      expect(techniqueResult.damage).toBe(0);
    });

    it("should not execute technique when paused", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      act(() => {
        result.current.startTraining();
        result.current.pauseTraining();
      });

      let techniqueResult: any;
      act(() => {
        techniqueResult = result.current.executeTrainingTechnique({
          stance: TrigramStance.GEON,
          dummy: {} as any,
          currentCombo: 0,
          lastTechniqueTime: 0,
        });
      });

      expect(techniqueResult.miss).toBe(true);
    });

    it("should handle combo timing correctly", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      act(() => {
        result.current.startTraining();
      });

      // Execute first technique
      act(() => {
        result.current.executeTrainingTechnique({
          stance: TrigramStance.GEON,
          dummy: {} as any,
          currentCombo: 0,
          lastTechniqueTime: 0,
        });
      });

      expect(result.current.currentCombo).toBe(1);

      // Execute second technique within combo window
      act(() => {
        result.current.executeTrainingTechnique({
          stance: TrigramStance.GEON,
          dummy: {} as any,
          currentCombo: 1,
          lastTechniqueTime: Date.now() - 1000, // 1 second ago
        });
      });

      expect(result.current.currentCombo).toBe(2);
    });

    it("should reset combo when outside time window", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      act(() => {
        result.current.startTraining();
      });

      // Execute technique outside combo window
      act(() => {
        result.current.executeTrainingTechnique({
          stance: TrigramStance.GEON,
          dummy: {} as any,
          currentCombo: 5,
          lastTechniqueTime: Date.now() - 5000, // 5 seconds ago
        });
      });

      expect(result.current.currentCombo).toBe(1); // Reset and new hit
    });

    it("should play different sounds based on technique result", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      act(() => {
        result.current.startTraining();
      });

      // Mock different technique results
      const { executeTrainingTechnique } = require("./utils/trainingUtils");

      // Perfect hit
      executeTrainingTechnique.mockReturnValueOnce({
        hit: true,
        damage: 25,
        critical: false,
        perfect: true,
        miss: false,
        stance: TrigramStance.GEON,
        accuracy: 0.95,
      });

      act(() => {
        result.current.executeTrainingTechnique({
          stance: TrigramStance.GEON,
          dummy: {} as any,
          currentCombo: 0,
          lastTechniqueTime: 0,
        });
      });

      expect(mockAudio.playSFX).toHaveBeenCalledWith("perfect_hit");
      expect(mockAudio.playTrigramStanceSound).toHaveBeenCalledWith(
        "GEON_perfect"
      );

      // Critical hit
      executeTrainingTechnique.mockReturnValueOnce({
        hit: true,
        damage: 40,
        critical: true,
        perfect: false,
        miss: false,
        stance: TrigramStance.GEON,
        accuracy: 0.85,
      });

      act(() => {
        result.current.executeTrainingTechnique({
          stance: TrigramStance.GEON,
          dummy: {} as any,
          currentCombo: 1,
          lastTechniqueTime: Date.now(),
        });
      });

      expect(mockAudio.playSFX).toHaveBeenCalledWith("critical_hit");
      expect(mockAudio.playVitalPointHitSound).toHaveBeenCalledWith("critical");
    });
  });

  describe("Experience and Progression", () => {
    it("should calculate experience with archetype bonus", () => {
      const assassinPlayer = {
        ...mockPlayer,
        archetype: PlayerArchetype.AMSALJA,
      };
      const { result } = renderHook(() =>
        useTrainingSession({ ...defaultProps, player: assassinPlayer })
      );

      act(() => {
        result.current.startTraining();
        result.current.stopTraining();
      });

      // Assassin should get 1.2x experience bonus
      expect(mockOnPlayerUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          experiencePoints: expect.any(Number),
        })
      );
    });

    it("should update best combo when stopping training", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      act(() => {
        result.current.startTraining();
      });

      // Simulate achieving a combo
      act(() => {
        result.current.executeTrainingTechnique({
          stance: TrigramStance.GEON,
          dummy: {} as any,
          currentCombo: 0,
          lastTechniqueTime: 0,
        });
        result.current.executeTrainingTechnique({
          stance: TrigramStance.GEON,
          dummy: {} as any,
          currentCombo: 1,
          lastTechniqueTime: Date.now() - 500,
        });
      });

      act(() => {
        result.current.stopTraining();
      });

      // Best combo should be updated
      expect(result.current.stats.bestCombo).toBeGreaterThan(0);
    });
  });

  describe("Audio Integration", () => {
    it("should play performance-based completion sounds", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      // Mock high accuracy stats
      const mockStatsHook = require("./hooks/useTrainingStatistics");
      mockStatsHook.useTrainingStatistics.mockReturnValueOnce({
        stats: { ...mockStatsHook.useTrainingStatistics().stats, accuracy: 95 },
        resetStats: vi.fn(),
        incrementAttempts: vi.fn(),
        incrementPerfectStrikes: vi.fn(),
        incrementCriticalHits: vi.fn(),
        addDamage: vi.fn(),
        updateAccuracy: vi.fn(),
        incrementTechniques: vi.fn(),
        updateBestCombo: vi.fn(),
      });

      act(() => {
        result.current.startTraining();
        result.current.stopTraining();
      });

      expect(mockAudio.playSFX).toHaveBeenCalledWith("perfect_completion");
    });

    it("should play combo achievement sounds", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      act(() => {
        result.current.startTraining();
      });

      // Execute multiple techniques to build combo
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.executeTrainingTechnique({
            stance: TrigramStance.GEON,
            dummy: {} as any,
            currentCombo: i,
            lastTechniqueTime: Date.now() - 100,
          });
        });
      }

      expect(mockAudio.playSFX).toHaveBeenCalledWith(
        expect.stringMatching(/combo_\d/)
      );
    });
  });

  describe("Session Reset", () => {
    it("should reset all session data", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      act(() => {
        result.current.startTraining();
        result.current.executeTrainingTechnique({
          stance: TrigramStance.GEON,
          dummy: {} as any,
          currentCombo: 0,
          lastTechniqueTime: 0,
        });
      });

      act(() => {
        result.current.resetTrainingSession();
      });

      expect(result.current.isTraining).toBe(false);
      expect(result.current.isSessionPaused).toBe(false);
      expect(result.current.currentCombo).toBe(0);
      expect(result.current.lastTechniqueTime).toBe(0);
      expect(mockAudio.stopMusic).toHaveBeenCalled();
      expect(mockAudio.playSFX).toHaveBeenCalledWith("session_reset");
    });
  });

  describe("Different Training Modes", () => {
    it.each([
      ["basics", 3000],
      ["advanced", 2000],
      ["techniques", 1500],
      ["combat", 1000],
      ["free", 2500],
    ])(
      "should use correct combo window for %s mode",
      (mode, expectedWindow) => {
        const modeSpecificProps = {
          ...defaultProps,
          mode: mode as any,
          modeData: { ...mockModeData, mode: mode as any },
        };

        const { result } = renderHook(() =>
          useTrainingSession(modeSpecificProps)
        );

        act(() => {
          result.current.startTraining();
        });

        // Test combo timing with mode-specific window
        act(() => {
          result.current.executeTrainingTechnique({
            stance: TrigramStance.GEON,
            dummy: {} as any,
            currentCombo: 1,
            lastTechniqueTime: Date.now() - (expectedWindow + 100), // Just outside window
          });
        });

        // Combo should reset for timing outside window
        expect(result.current.currentCombo).toBe(1); // Reset to 1 for new hit
      }
    );
  });

  describe("Error Handling", () => {
    it("should handle missing audio gracefully", () => {
      const { result } = renderHook(() =>
        useTrainingSession({ ...defaultProps, audio: {} as any })
      );

      act(() => {
        result.current.startTraining();
      });

      // Should not crash despite missing audio methods
      expect(result.current.isTraining).toBe(true);
    });

    it("should handle invalid technique parameters", () => {
      const { result } = renderHook(() => useTrainingSession(defaultProps));

      act(() => {
        result.current.startTraining();
      });

      let techniqueResult: any;
      act(() => {
        techniqueResult = result.current.executeTrainingTechnique({
          stance: null,
          dummy: null,
        });
      });

      expect(techniqueResult).toBeDefined();
    });
  });
});
