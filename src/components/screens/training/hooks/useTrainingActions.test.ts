/**
 * Tests for useTrainingActions hook
 *
 * Focuses on testing the handleAttack function including:
 * - TechniqueBar selection resolving technique data
 * - Correct intensity mapping at damage thresholds (10/25/40)
 */

import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useTrainingActions, UseTrainingActionsConfig } from "./useTrainingActions";
import { AnimationState, AnimationType } from "../../../../systems/animation";
import { PlayerArchetype, TrigramStance } from "../../../../types/common";
import { KoreanTechniquesSystem } from "../../../../systems/trigram/KoreanTechniques";
import { AttackIntensity } from "../../../screens/combat/hooks/useCombatAudio";

// Mock dependencies
vi.mock("../../../../systems/trigram/KoreanTechniques", () => ({
  KoreanTechniquesSystem: {
    getTechniqueById: vi.fn(),
  },
}));

vi.mock("../../../../systems/trigram/techniques", () => ({
  getTechniquesByStance: vi.fn(() => []),
}));

describe("useTrainingActions", () => {
  let mockConfig: UseTrainingActionsConfig;
  let mockPlayAttackSound: ReturnType<typeof vi.fn>;
  let mockAudioPlaySFX: ReturnType<typeof vi.fn>;
  let mockPlayerAnimation: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    mockPlayAttackSound = vi.fn().mockResolvedValue(undefined);
    mockAudioPlaySFX = vi.fn().mockResolvedValue(undefined);
    mockPlayerAnimation = {
      transitionTo: vi.fn().mockReturnValue(true),
      transitionToStanceGuard: vi.fn().mockReturnValue(true),
      currentState: "idle",
    } as any;

    mockConfig = {
      state: {
        isTraining: false,
        dummyHealth: 100,
        currentStanceIndex: 0,
        selectedVitalPoint: null,
        trainingMode: "basics",
        stats: {
          hits: 0,
          misses: 0,
          score: 0,
          combo: 0,
          bestCombo: 0,
          accuracy: 0,
        },
        perfectStrikes: 0,
        bestCombo: 0,
        sessionStartTime: null,
        sessionDuration: 0,
        feedback: "",
        showFeedback: false,
        hitEffects: [],
        nextEffectId: 0,
        stanceWheelExpanded: false,
        visibleAnatomyLayers: [],
        footworkDrillActive: false,
        footworkDrillType: "circular_left" as const,
        footworkDrillStep: 0,
      },
      actions: {
        startTraining: vi.fn(),
        stopTraining: vi.fn(),
        registerHit: vi.fn(),
        registerMiss: vi.fn(),
        setDummyHealth: vi.fn(),
        resetDummy: vi.fn(),
        setTrainingMode: vi.fn(),
        setFeedback: vi.fn(),
        hideFeedback: vi.fn(),
        addHitEffect: vi.fn(),
        removeHitEffect: vi.fn(),
        setSelectedVitalPoint: vi.fn(),
        updateSessionDuration: vi.fn(),
        setStanceIndex: vi.fn(),
        toggleStanceWheel: vi.fn(),
        updateBestCombo: vi.fn(),
        toggleAnatomyLayer: vi.fn(),
        setAnatomyLayers: vi.fn(),
        startFootworkDrill: vi.fn(),
        stopFootworkDrill: vi.fn(),
        advanceFootworkStep: vi.fn(),
        resetFootworkDrill: vi.fn(),
      },
      playerPosition: { x: 0, y: 0 },
      player3DPosition: [0, 0, 0] as [number, number, number],
      dummyPosition: [1.5, 0, 0] as [number, number, number],
      playerArchetype: PlayerArchetype.MUSA,
      playerStance: TrigramStance.GEON,
      currentTechniqueAnimationTypeRef: {
        current: AnimationType.JAB,
      },
      audio: {
        playSFX: mockAudioPlaySFX as any,
      },
      playAttackSound: mockPlayAttackSound as any,
      playBoneImpactSound: vi.fn().mockResolvedValue(undefined) as any,
      onPlayerUpdate: vi.fn(),
      playerAnimation: mockPlayerAnimation as any,
      pendingAttackRef: {
        current: null,
      },
    };
  });

  describe("handleAttack - Attack Sound Intensity Selection", () => {
    it("should play light intensity sound for techniques with damage < 10", () => {
      // Config with TechniqueBar selection
      const configWithSelection = {
        ...mockConfig,
        selectedTechniqueId: "light_technique",
      };

      // Mock technique with low damage
      (KoreanTechniquesSystem.getTechniqueById as ReturnType<typeof vi.fn>).mockReturnValue({
        id: "light_technique",
        name: { korean: "가벼운 기술", english: "Light Technique" },
        damage: 8,
        staminaCost: 5,
        kiCost: 0,
        animationType: AnimationType.JAB,
      });

      const { result } = renderHook(() => useTrainingActions(configWithSelection));

      act(() => {
        result.current.handleAttack();
      });

      expect(mockPlayAttackSound).toHaveBeenCalledWith("light");
    });

    it("should play medium intensity sound for techniques with damage 10-24", () => {
      const configWithSelection = {
        ...mockConfig,
        selectedTechniqueId: "medium_technique",
      };

      // Mock technique with medium damage
      (KoreanTechniquesSystem.getTechniqueById as ReturnType<typeof vi.fn>).mockReturnValue({
        id: "medium_technique",
        name: { korean: "중간 기술", english: "Medium Technique" },
        damage: 15,
        staminaCost: 10,
        kiCost: 5,
        animationType: AnimationType.CROSS,
      });

      const { result } = renderHook(() => useTrainingActions(configWithSelection));

      act(() => {
        result.current.handleAttack();
      });

      expect(mockPlayAttackSound).toHaveBeenCalledWith("medium");
    });

    it("should play heavy intensity sound for techniques with damage 25-39", () => {
      const configWithSelection = {
        ...mockConfig,
        selectedTechniqueId: "heavy_technique",
      };

      // Mock technique with heavy damage
      (KoreanTechniquesSystem.getTechniqueById as ReturnType<typeof vi.fn>).mockReturnValue({
        id: "heavy_technique",
        name: { korean: "강력한 기술", english: "Heavy Technique" },
        damage: 30,
        staminaCost: 15,
        kiCost: 10,
        animationType: AnimationType.HOOK,
      });

      const { result } = renderHook(() => useTrainingActions(configWithSelection));

      act(() => {
        result.current.handleAttack();
      });

      expect(mockPlayAttackSound).toHaveBeenCalledWith("heavy");
    });

    it("should play critical intensity sound for techniques with damage >= 40", () => {
      const configWithSelection = {
        ...mockConfig,
        selectedTechniqueId: "critical_technique",
      };

      // Mock technique with critical damage
      (KoreanTechniquesSystem.getTechniqueById as ReturnType<typeof vi.fn>).mockReturnValue({
        id: "critical_technique",
        name: { korean: "치명적인 기술", english: "Critical Technique" },
        damage: 45,
        staminaCost: 20,
        kiCost: 20,
        animationType: AnimationType.UPPERCUT,
      });

      const { result } = renderHook(() => useTrainingActions(configWithSelection));

      act(() => {
        result.current.handleAttack();
      });

      expect(mockPlayAttackSound).toHaveBeenCalledWith("critical");
    });

    it("should test exact damage threshold boundaries", () => {
      // Test damage = 10 (should be medium)
      const config10 = {
        ...mockConfig,
        selectedTechniqueId: "threshold_10",
      };
      (KoreanTechniquesSystem.getTechniqueById as ReturnType<typeof vi.fn>).mockReturnValue({
        id: "threshold_10",
        damage: 10,
      });

      const { result: result10 } = renderHook(() => useTrainingActions(config10));

      act(() => {
        result10.current.handleAttack();
      });

      expect(mockPlayAttackSound).toHaveBeenCalledWith("medium");
      vi.clearAllMocks();

      // Test damage = 25 (should be heavy)
      const config25 = {
        ...mockConfig,
        selectedTechniqueId: "threshold_25",
      };
      (KoreanTechniquesSystem.getTechniqueById as ReturnType<typeof vi.fn>).mockReturnValue({
        id: "threshold_25",
        damage: 25,
      });

      const { result: result25 } = renderHook(() => useTrainingActions(config25));

      act(() => {
        result25.current.handleAttack();
      });

      expect(mockPlayAttackSound).toHaveBeenCalledWith("heavy");
      vi.clearAllMocks();

      // Test damage = 40 (should be critical)
      const config40 = {
        ...mockConfig,
        selectedTechniqueId: "threshold_40",
      };
      (KoreanTechniquesSystem.getTechniqueById as ReturnType<typeof vi.fn>).mockReturnValue({
        id: "threshold_40",
        damage: 40,
      });

      const { result: result40 } = renderHook(() => useTrainingActions(config40));

      act(() => {
        result40.current.handleAttack();
      });

      expect(mockPlayAttackSound).toHaveBeenCalledWith("critical");
    });
  });

  describe("handleAttack - TechniqueBar Selection Resolution", () => {
    it("should resolve technique data from TechniqueBar selection using getTechniqueById", () => {
      // Config with selectedTechniqueId (simulating TechniqueBar selection)
      const configWithSelection = {
        ...mockConfig,
        selectedTechniqueId: "selected_technique_123",
      };

      const mockTechnique = {
        id: "selected_technique_123",
        name: { korean: "선택된 기술", english: "Selected Technique" },
        damage: 20,
        staminaCost: 12,
        kiCost: 8,
        animationType: AnimationType.CROSS,
      };

      (KoreanTechniquesSystem.getTechniqueById as ReturnType<typeof vi.fn>).mockReturnValue(
        mockTechnique
      );

      const { result } = renderHook(() => useTrainingActions(configWithSelection));

      act(() => {
        result.current.handleAttack();
      });

      // Verify getTechniqueById was called with the selected technique ID
      expect(KoreanTechniquesSystem.getTechniqueById).toHaveBeenCalledWith(
        "selected_technique_123"
      );

      // Verify correct intensity based on resolved technique damage (20 = medium)
      expect(mockPlayAttackSound).toHaveBeenCalledWith("medium");
    });

    it("should handle TechniqueBar selection when technique is not found", () => {
      const configWithSelection = {
        ...mockConfig,
        selectedTechniqueId: "unknown_technique",
      };

      // getTechniqueById returns undefined for unknown technique
      (KoreanTechniquesSystem.getTechniqueById as ReturnType<typeof vi.fn>).mockReturnValue(
        undefined
      );

      const { result } = renderHook(() => useTrainingActions(configWithSelection));

      act(() => {
        result.current.handleAttack();
      });

      // Should still call playAttackSound with default damage fallback (10 = medium)
      expect(mockPlayAttackSound).toHaveBeenCalledWith("medium");
    });

    it("should not call getTechniqueById when no technique is selected", () => {
      const { result } = renderHook(() => useTrainingActions(mockConfig));

      act(() => {
        result.current.handleAttack();
      });

      // Should not attempt to resolve technique when selectedTechniqueId is not provided
      expect(KoreanTechniquesSystem.getTechniqueById).not.toHaveBeenCalled();

      // Should use default damage (10 = medium)
      expect(mockPlayAttackSound).toHaveBeenCalledWith("medium");
    });
  });

  describe("handleAttack - Fallback Behavior", () => {
    it("should fallback to generic whoosh when playAttackSound is not available", () => {
      const configWithoutAttackSound = {
        ...mockConfig,
        playAttackSound: undefined,
      };

      const { result } = renderHook(() => useTrainingActions(configWithoutAttackSound));

      act(() => {
        result.current.handleAttack();
      });

      // Should fallback to generic audio.playSFX
      expect(mockAudioPlaySFX).toHaveBeenCalledWith("whoosh");
      expect(mockPlayAttackSound).not.toHaveBeenCalled();
    });

    it("should trigger attack animation regardless of sound availability", () => {
      const { result } = renderHook(() => useTrainingActions(mockConfig));

      act(() => {
        result.current.handleAttack();
      });

      // Animation should always be triggered
      expect((mockPlayerAnimation as any).transitionTo).toHaveBeenCalledWith(AnimationState.ATTACK);
    });
  });

  describe("handleAttack - Integration with Default Techniques", () => {
    it("should use default technique when no TechniqueBar selection exists", () => {
      // This test verifies the existing default technique path still works
      const { result } = renderHook(() => useTrainingActions(mockConfig));

      act(() => {
        result.current.handleAttack();
      });

      // Should not call getTechniqueById since no selection
      expect(KoreanTechniquesSystem.getTechniqueById).not.toHaveBeenCalled();

      // Should use default damage fallback
      expect(mockPlayAttackSound).toHaveBeenCalled();
    });
  });
});
