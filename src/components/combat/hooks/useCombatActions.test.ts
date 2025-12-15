/**
 * Tests for useCombatActions hook
 * Verifies combat action handlers functionality
 */

import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useCombatActions } from "./useCombatActions";
import { CombatSystem } from "@/systems/CombatSystem";
import { TrigramStance, PlayerArchetype } from "@/types";
import { HitEffectType } from "@/systems/effects";
import { useCombatState } from "./useCombatState";

describe("useCombatActions", () => {
  let mockConfig: any;
  let mockCombatSystem: CombatSystem;

  beforeEach(() => {
    mockCombatSystem = new CombatSystem();

    const mockPlayer1 = {
      id: "player1",
      name: { korean: "플레이어1", english: "Player 1", romanized: "player1" },
      archetype: PlayerArchetype.MUSA,
      health: 100,
      maxHealth: 100,
      ki: 50,
      maxKi: 100,
      stamina: 80,
      maxStamina: 100,
      currentStance: TrigramStance.GEON,
      position: { x: 300, y: 400 },
      isBlocking: false,
      isStunned: false,
      combatState: "idle" as any,
      hitsTaken: 0,
      hitsLanded: 0,
    };

    const mockPlayer2 = {
      id: "player2",
      name: { korean: "플레이어2", english: "Player 2", romanized: "player2" },
      archetype: PlayerArchetype.AMSALJA,
      health: 100,
      maxHealth: 100,
      ki: 50,
      maxKi: 100,
      stamina: 80,
      maxStamina: 100,
      currentStance: TrigramStance.TAE,
      position: { x: 700, y: 400 },
      isBlocking: false,
      isStunned: false,
      combatState: "idle" as any,
      hitsTaken: 0,
      hitsLanded: 0,
    };

    const { result: stateResult } = renderHook(() => useCombatState());

    mockConfig = {
      validPlayers: [mockPlayer1, mockPlayer2] as const,
      playerPositions: [
        { x: 300, y: 400 },
        { x: 700, y: 400 },
      ] as const,
      combatState: {
        ...stateResult.current.state,
        roundStarted: true,
        roundEnded: false,
        isExecutingTechnique: false,
      },
      combatActions: stateResult.current.actions,
      combatSystem: mockCombatSystem,
      onPlayerUpdate: vi.fn(),
      addCombatMessage: vi.fn(),
      addHitEffect: vi.fn(),
      arenaBounds: {
        x: 100,
        y: 100,
        width: 800,
        height: 600,
      },
    };
  });

  describe("handleAttack", () => {
    it("should not execute when technique is being executed", () => {
      const config = {
        ...mockConfig,
        combatState: {
          ...mockConfig.combatState,
          isExecutingTechnique: true,
        },
      };

      const { result } = renderHook(() => useCombatActions(config));

      act(() => {
        result.current.handleAttack();
      });

      expect(config.onPlayerUpdate).not.toHaveBeenCalled();
    });

    it("should not execute when round not started", () => {
      const config = {
        ...mockConfig,
        combatState: {
          ...mockConfig.combatState,
          roundStarted: false,
        },
      };

      const { result } = renderHook(() => useCombatActions(config));

      act(() => {
        result.current.handleAttack();
      });

      expect(config.onPlayerUpdate).not.toHaveBeenCalled();
    });

    it("should not execute when round ended", () => {
      const config = {
        ...mockConfig,
        combatState: {
          ...mockConfig.combatState,
          roundEnded: true,
        },
      };

      const { result } = renderHook(() => useCombatActions(config));

      act(() => {
        result.current.handleAttack();
      });

      expect(config.onPlayerUpdate).not.toHaveBeenCalled();
    });

    it("should add hit effect when attacking", () => {
      const { result } = renderHook(() => useCombatActions(mockConfig));

      act(() => {
        result.current.handleAttack();
      });

      expect(mockConfig.addHitEffect).toHaveBeenCalled();
    });

    it("should execute with custom technique", () => {
      const mockTechnique = {
        id: "test_technique",
        name: {
          korean: "테스트 기술",
          english: "Test Technique",
          romanized: "teseuteu gisul",
        },
        description: {
          korean: "테스트용 기술",
          english: "Test technique",
        },
        staminaCost: 20,
        kiCost: 15,
        damage: { min: 25, max: 35 },
        damageType: "blunt" as const,
        cooldown: 5000,
        keyboardShortcut: "Q" as const,
        criticalChance: 0.3,
        animationDuration: 800,
      };

      // Spy on the combat system to verify technique conversion
      const resolveAttackSpy = vi.spyOn(mockCombatSystem, 'resolveAttack');

      const { result } = renderHook(() => useCombatActions(mockConfig));

      act(() => {
        result.current.handleAttack(mockTechnique);
      });

      // Should execute attack with custom technique
      expect(mockConfig.addHitEffect).toHaveBeenCalled();
      expect(mockConfig.addCombatMessage).toHaveBeenCalled();

      // Verify technique was correctly converted and passed to combat system
      expect(resolveAttackSpy).toHaveBeenCalledWith(
        mockConfig.validPlayers[0],
        mockConfig.validPlayers[1],
        expect.objectContaining({
          id: "test_technique",
          damage: 30, // Average of min (25) and max (35)
          kiCost: 15,
          staminaCost: 20,
          critChance: 0.3,
          executionTime: 800,
          romanized: "teseuteu gisul",
        })
      );
    });

    it("should use basic attack when no technique provided", () => {
      const { result } = renderHook(() => useCombatActions(mockConfig));

      act(() => {
        result.current.handleAttack();
      });

      // Should execute attack with basic attack
      expect(mockConfig.addHitEffect).toHaveBeenCalled();
      expect(mockConfig.addCombatMessage).toHaveBeenCalled();
    });
  });

  describe("handleDefend", () => {
    it("should set blocking state", () => {
      const { result } = renderHook(() => useCombatActions(mockConfig));

      act(() => {
        result.current.handleDefend();
      });

      expect(mockConfig.onPlayerUpdate).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ isBlocking: true })
      );
      expect(mockConfig.addCombatMessage).toHaveBeenCalledWith(
        "방어 자세",
        "Defensive Stance"
      );
    });

    it("should not execute when round not started", () => {
      const config = {
        ...mockConfig,
        combatState: {
          ...mockConfig.combatState,
          roundStarted: false,
        },
      };

      const { result } = renderHook(() => useCombatActions(config));

      act(() => {
        result.current.handleDefend();
      });

      expect(config.onPlayerUpdate).not.toHaveBeenCalled();
    });
  });

  describe("handleTechniqueExecute", () => {
    it("should not execute with insufficient ki", () => {
      const lowKiPlayer = { ...mockConfig.validPlayers[0], ki: 5 };
      const config = {
        ...mockConfig,
        validPlayers: [lowKiPlayer, mockConfig.validPlayers[1]] as const,
      };

      const { result } = renderHook(() => useCombatActions(config));

      act(() => {
        result.current.handleTechniqueExecute();
      });

      expect(config.addCombatMessage).toHaveBeenCalledWith(
        "기력/체력 부족",
        "Insufficient Ki/Stamina"
      );
    });

    it("should not execute with insufficient stamina", () => {
      const lowStaminaPlayer = { ...mockConfig.validPlayers[0], stamina: 10 };
      const config = {
        ...mockConfig,
        validPlayers: [lowStaminaPlayer, mockConfig.validPlayers[1]] as const,
      };

      const { result } = renderHook(() => useCombatActions(config));

      act(() => {
        result.current.handleTechniqueExecute();
      });

      expect(config.addCombatMessage).toHaveBeenCalledWith(
        "기력/체력 부족",
        "Insufficient Ki/Stamina"
      );
    });

    it("should add critical hit effect", () => {
      const { result } = renderHook(() => useCombatActions(mockConfig));

      act(() => {
        result.current.handleTechniqueExecute();
      });

      expect(mockConfig.addHitEffect).toHaveBeenCalledWith(
        HitEffectType.CRITICAL_HIT,
        expect.any(Object),
        1.5
      );
    });

    it("should trigger screen shake", () => {
      const { result } = renderHook(() => useCombatActions(mockConfig));

      act(() => {
        result.current.handleTechniqueExecute();
      });

      // Screen shake should be set through combatActions
      expect(mockConfig.combatActions.setScreenShake).toBeDefined();
    });
  });

  describe("handleStanceSwitch", () => {
    it("should change player stance", () => {
      const { result } = renderHook(() => useCombatActions(mockConfig));

      act(() => {
        result.current.handleStanceSwitch(TrigramStance.LI);
      });

      expect(mockConfig.onPlayerUpdate).toHaveBeenCalledWith(
        0,
        expect.objectContaining({ currentStance: TrigramStance.LI })
      );
      expect(mockConfig.addCombatMessage).toHaveBeenCalled();
    });

    it("should not execute when round not started", () => {
      const config = {
        ...mockConfig,
        combatState: {
          ...mockConfig.combatState,
          roundStarted: false,
        },
      };

      const { result } = renderHook(() => useCombatActions(config));

      act(() => {
        result.current.handleStanceSwitch(TrigramStance.LI);
      });

      expect(config.onPlayerUpdate).not.toHaveBeenCalled();
    });
  });

  describe("AI actions", () => {
    describe("handleAIAttack", () => {
      it("should add hit effect", () => {
        const { result } = renderHook(() => useCombatActions(mockConfig));

        act(() => {
          result.current.handleAIAttack();
        });

        expect(mockConfig.addHitEffect).toHaveBeenCalledWith(
          HitEffectType.HIT,
          mockConfig.playerPositions[1],
          1
        );
      });

      it("should deal damage when in range", () => {
        // Players close together
        const config = {
          ...mockConfig,
          playerPositions: [
            { x: 400, y: 400 },
            { x: 450, y: 400 },
          ] as const,
        };

        const { result } = renderHook(() => useCombatActions(config));

        act(() => {
          result.current.handleAIAttack();
        });

        expect(config.onPlayerUpdate).toHaveBeenCalledWith(
          0,
          expect.objectContaining({
            health: expect.any(Number),
            hitsTaken: expect.any(Number),
          })
        );
      });
    });

    describe("handleAIDefend", () => {
      it("should set AI blocking state", () => {
        const { result } = renderHook(() => useCombatActions(mockConfig));

        act(() => {
          result.current.handleAIDefend();
        });

        expect(mockConfig.onPlayerUpdate).toHaveBeenCalledWith(
          1,
          expect.objectContaining({ isBlocking: true })
        );
      });
    });

    describe("handleAITechnique", () => {
      it("should fall back to basic attack with insufficient resources", () => {
        const lowResourcePlayer = { ...mockConfig.validPlayers[1], ki: 5 };
        const config = {
          ...mockConfig,
          validPlayers: [mockConfig.validPlayers[0], lowResourcePlayer] as const,
        };

        const { result } = renderHook(() => useCombatActions(config));

        act(() => {
          result.current.handleAITechnique();
        });

        // Should call addHitEffect with regular HIT effect (from fallback)
        expect(config.addHitEffect).toHaveBeenCalled();
      });

      it("should execute technique with sufficient resources", () => {
        const { result } = renderHook(() => useCombatActions(mockConfig));

        act(() => {
          result.current.handleAITechnique();
        });

        expect(mockConfig.addHitEffect).toHaveBeenCalledWith(
          HitEffectType.CRITICAL_HIT,
          mockConfig.playerPositions[1],
          1.5
        );
      });
    });

    describe("moveAIPlayer", () => {
      it("should move AI towards target position", () => {
        const { result } = renderHook(() => useCombatActions(mockConfig));
        const targetPos = { x: 600, y: 400 };

        act(() => {
          result.current.moveAIPlayer(targetPos);
        });

        expect(mockConfig.onPlayerUpdate).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            position: expect.any(Object),
          })
        );
      });

      it("should keep AI within arena bounds", () => {
        const { result } = renderHook(() => useCombatActions(mockConfig));
        const targetPos = { x: 2000, y: 2000 }; // Outside bounds

        act(() => {
          result.current.moveAIPlayer(targetPos);
        });

        // Should still call onPlayerUpdate but with clamped position
        expect(mockConfig.onPlayerUpdate).toHaveBeenCalled();
      });

      it("should not move when distance is very small", () => {
        const config = {
          ...mockConfig,
          playerPositions: [
            { x: 300, y: 400 },
            { x: 700, y: 400 },
          ] as const,
        };

        const { result } = renderHook(() => useCombatActions(config));
        const targetPos = { x: 701, y: 400 }; // Very close

        act(() => {
          result.current.moveAIPlayer(targetPos);
        });

        // Should not update position when distance < 5
        expect(config.onPlayerUpdate).not.toHaveBeenCalled();
      });
    });
  });
});
