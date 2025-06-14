import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTrainingSession } from "./useTrainingSession";
import { PlayerArchetype, TrigramStance } from "../../../../types/enums";
import type { PlayerState } from "../../../../types/player";
import { TRAINING_MODES } from "../constants/trainingModes";

/**
 * ## Training Session Hook Test Suite
 *
 * **Business Purpose:**
 * Validates the core training session management that coordinates all aspects
 * of Korean martial arts skill development within Black Trigram.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("useTrainingSession", () => {
  let mockPlayer: PlayerState;
  let mockOnPlayerUpdate: ReturnType<typeof vi.fn>;
  let mockAudio: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockAudio = {
      playSFX: vi.fn(),
      playMusic: vi.fn(),
      isInitialized: true,
    };

    mockPlayer = {
      id: "test-player",
      name: { korean: "테스트 무사", english: "Test Warrior" },
      archetype: PlayerArchetype.MUSA,
      currentStance: TrigramStance.GEON,
      health: 100,
      maxHealth: 100,
      ki: 100,
      maxKi: 100,
      stamina: 100,
      maxStamina: 100,
      technique: 75,
      experiencePoints: 0,
      // ...other required properties
    };

    mockOnPlayerUpdate = vi.fn();
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() =>
      useTrainingSession({
        mode: "basics",
        modeData: {
          id: "basics",
          name: { korean: "기본", english: "Basics" },
          maxAttempts: 20,
          difficulty: 1,
          requiredLevel: 1,
          availableStances: [TrigramStance.GEON],
          focusAreas: ["accuracy"],
          rewards: { experienceMultiplier: 1.0, unlocks: [], achievements: [] },
        },
        player: mockPlayer,
        onPlayerUpdate: vi.fn(),
        audio: mockAudio,
      })
    );

    expect(result.current.isTraining).toBe(false);
    expect(result.current.stats.attempts).toBe(0);
    expect(result.current.currentCombo).toBe(0);
  });

  it("should start training session correctly", () => {
    const { result } = renderHook(() =>
      useTrainingSession({
        mode: "basics",
        modeData: {
          id: "basics",
          name: { korean: "기본", english: "Basics" },
          maxAttempts: 20,
          difficulty: 1,
          requiredLevel: 1,
          availableStances: [TrigramStance.GEON],
          focusAreas: ["accuracy"],
          rewards: { experienceMultiplier: 1.0, unlocks: [], achievements: [] },
        },
        player: mockPlayer,
        onPlayerUpdate: vi.fn(),
        audio: mockAudio,
      })
    );

    act(() => {
      result.current.startTraining();
    });

    expect(result.current.isTraining).toBe(true);
    expect(mockAudio.playSFX).toHaveBeenCalledWith("training_start");
  });

  it("should execute techniques and update statistics", () => {
    const { result } = renderHook(() =>
      useTrainingSession({
        mode: "basics",
        modeData: {
          id: "basics",
          name: { korean: "기본", english: "Basics" },
          maxAttempts: 20,
          difficulty: 1,
          requiredLevel: 1,
          availableStances: [TrigramStance.GEON],
          focusAreas: ["accuracy"],
          rewards: { experienceMultiplier: 1.0, unlocks: [], achievements: [] },
        },
        player: mockPlayer,
        onPlayerUpdate: mockOnPlayerUpdate,
        audio: mockAudio,
      })
    );

    act(() => {
      result.current.startTraining();
    });

    act(() => {
      const techniqueResult = result.current.executeTrainingTechnique({
        stance: TrigramStance.GEON,
        dummy: {
          health: 100,
          maxHealth: 100,
          position: { x: 500, y: 300 },
          isActive: true,
          lastHitTime: 0,
          hitCount: 0,
          isStunned: false,
          defensiveMode: false,
        },
        currentCombo: 0,
        lastTechniqueTime: 0,
      });

      expect(techniqueResult.success).toBe(true);
    });

    expect(result.current.stats.attempts).toBe(1);
    expect(mockOnPlayerUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        experiencePoints: expect.any(Number),
      })
    );
  });

  describe("Korean Martial Arts Training Integration", () => {
    it("should handle authentic Korean training progression", () => {
      const { result } = renderHook(() =>
        useTrainingSession({
          mode: "basics",
          modeData: TRAINING_MODES[0],
          player: mockPlayer,
          onPlayerUpdate: mockOnPlayerUpdate,
          audio: mockAudio,
        })
      );

      act(() => {
        result.current.startTraining();
      });

      expect(result.current.isTraining).toBe(true);
      expect(result.current.stats.sessionTime).toBeGreaterThanOrEqual(0);
    });

    it("should calculate Korean martial arts experience correctly", () => {
      const { result } = renderHook(() =>
        useTrainingSession({
          mode: "basics",
          modeData: TRAINING_MODES[0],
          player: mockPlayer,
          onPlayerUpdate: mockOnPlayerUpdate,
          audio: mockAudio,
        })
      );

      act(() => {
        result.current.startTraining();
        result.current.executeTrainingTechnique({
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
          currentCombo: 1,
          lastTechniqueTime: 0,
        });
      });

      expect(mockOnPlayerUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          experiencePoints: expect.any(Number),
        })
      );
    });
  });
});
