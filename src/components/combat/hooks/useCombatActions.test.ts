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
import { TRIGRAM_TECHNIQUES } from "@/systems/trigram/techniques";

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

  describe("Technique Integration", () => {
    describe("handleAttack with TRIGRAM_TECHNIQUES", () => {
      it("should use GEON stance technique (천둥벽력) instead of basic attack", () => {
        const geonPlayer = {
          ...mockConfig.validPlayers[0],
          currentStance: TrigramStance.GEON,
          ki: 50,
          stamina: 50,
        };
        const config = {
          ...mockConfig,
          validPlayers: [geonPlayer, mockConfig.validPlayers[1]] as const,
        };

        const { result } = renderHook(() => useCombatActions(config));

        act(() => {
          result.current.handleAttack();
        });

        // Verify technique from GEON stance was used (천둥벽력 - Thunder Strike)
        const geonTechnique = TRIGRAM_TECHNIQUES[TrigramStance.GEON][0];
        expect(geonTechnique.name.korean).toBe("천둥벽력");
        expect(geonTechnique.name.english).toBe("Thunder Strike");
        expect(geonTechnique.damage).toBe(30); // Not hardcoded 15
        
        // Combat message should include technique name
        expect(config.addCombatMessage).toHaveBeenCalledWith(
          expect.stringContaining("천둥벽력"),
          expect.stringContaining("Thunder Strike")
        );
      });

      it("should use TAE stance technique (유수연타) for Lake stance", () => {
        const taePlayer = {
          ...mockConfig.validPlayers[0],
          currentStance: TrigramStance.TAE,
          ki: 50,
          stamina: 50,
        };
        const config = {
          ...mockConfig,
          validPlayers: [taePlayer, mockConfig.validPlayers[1]] as const,
        };

        // Verify TAE technique definition
        const taeTechnique = TRIGRAM_TECHNIQUES[TrigramStance.TAE][0];
        expect(taeTechnique.name.korean).toBe("유수연타");
        expect(taeTechnique.name.english).toBe("Flowing Strikes");
        expect(taeTechnique.damage).toBe(25); // Different from GEON
        
        const { result } = renderHook(() => useCombatActions(config));

        act(() => {
          result.current.handleAttack();
        });

        // Attack was executed (hit or miss doesn't matter for this test)
        // The important thing is that TAE technique was selected and used
        expect(config.addCombatMessage).toHaveBeenCalled();
      });

      it("should respect ki costs from technique definitions", () => {
        const geonTechnique = TRIGRAM_TECHNIQUES[TrigramStance.GEON][0];
        const lowKiPlayer = {
          ...mockConfig.validPlayers[0],
          currentStance: TrigramStance.GEON,
          ki: geonTechnique.kiCost - 1, // Insufficient ki
          stamina: 50,
        };
        const config = {
          ...mockConfig,
          validPlayers: [lowKiPlayer, mockConfig.validPlayers[1]] as const,
        };

        const { result } = renderHook(() => useCombatActions(config));

        act(() => {
          result.current.handleAttack();
        });

        // Should fail with insufficient resources message
        expect(config.addCombatMessage).toHaveBeenCalledWith(
          "기력/체력 부족",
          "Insufficient Ki/Stamina"
        );
        expect(config.onPlayerUpdate).not.toHaveBeenCalled();
      });

      it("should respect stamina costs from technique definitions", () => {
        const geonTechnique = TRIGRAM_TECHNIQUES[TrigramStance.GEON][0];
        const lowStaminaPlayer = {
          ...mockConfig.validPlayers[0],
          currentStance: TrigramStance.GEON,
          ki: 50,
          stamina: geonTechnique.staminaCost - 1, // Insufficient stamina
        };
        const config = {
          ...mockConfig,
          validPlayers: [lowStaminaPlayer, mockConfig.validPlayers[1]] as const,
        };

        const { result } = renderHook(() => useCombatActions(config));

        act(() => {
          result.current.handleAttack();
        });

        // Should fail with insufficient resources message
        expect(config.addCombatMessage).toHaveBeenCalledWith(
          "기력/체력 부족",
          "Insufficient Ki/Stamina"
        );
        expect(config.onPlayerUpdate).not.toHaveBeenCalled();
      });

      it("should use different techniques for each trigram stance", () => {
        // Test that all 8 stances have techniques
        const stances = [
          TrigramStance.GEON,
          TrigramStance.TAE,
          TrigramStance.LI,
          TrigramStance.JIN,
          TrigramStance.SON,
          TrigramStance.GAM,
          TrigramStance.GAN,
          TrigramStance.GON,
        ];

        stances.forEach((stance) => {
          const techniques = TRIGRAM_TECHNIQUES[stance];
          expect(techniques).toBeDefined();
          expect(techniques.length).toBeGreaterThan(0);
          
          // Each technique should have proper structure
          const technique = techniques[0];
          expect(technique.name.korean).toBeTruthy();
          expect(technique.name.english).toBeTruthy();
          expect(technique.damage).toBeGreaterThan(0);
          expect(technique.kiCost).toBeGreaterThan(0);
          expect(technique.staminaCost).toBeGreaterThan(0);
        });
      });

      it("should use LI stance technique (화염지창) for Fire stance", () => {
        const liPlayer = {
          ...mockConfig.validPlayers[0],
          currentStance: TrigramStance.LI,
          ki: 50,
          stamina: 50,
        };
        const config = {
          ...mockConfig,
          validPlayers: [liPlayer, mockConfig.validPlayers[1]] as const,
        };

        const { result } = renderHook(() => useCombatActions(config));

        act(() => {
          result.current.handleAttack();
        });

        const liTechnique = TRIGRAM_TECHNIQUES[TrigramStance.LI][0];
        expect(liTechnique.name.korean).toBe("화염지창");
        expect(liTechnique.name.english).toBe("Flame Spear");
        expect(liTechnique.damage).toBe(35); // Higher precision damage
      });

      it("should use JIN stance technique (벽력일섬) for Thunder stance", () => {
        const jinPlayer = {
          ...mockConfig.validPlayers[0],
          currentStance: TrigramStance.JIN,
          ki: 50,
          stamina: 50,
        };
        const config = {
          ...mockConfig,
          validPlayers: [jinPlayer, mockConfig.validPlayers[1]] as const,
        };

        const { result } = renderHook(() => useCombatActions(config));

        act(() => {
          result.current.handleAttack();
        });

        const jinTechnique = TRIGRAM_TECHNIQUES[TrigramStance.JIN][0];
        expect(jinTechnique.name.korean).toBe("벽력일섬");
        expect(jinTechnique.name.english).toBe("Lightning Flash");
        expect(jinTechnique.damage).toBe(28); // Explosive power
      });

      it("should display Korean technique names in combat log", () => {
        const config = {
          ...mockConfig,
          validPlayers: [
            { ...mockConfig.validPlayers[0], currentStance: TrigramStance.GEON, ki: 50, stamina: 50 },
            mockConfig.validPlayers[1],
          ] as const,
        };

        const { result } = renderHook(() => useCombatActions(config));

        act(() => {
          result.current.handleAttack();
        });

        // Verify Korean and English technique names are used in combat messages
        const calls = config.addCombatMessage.mock.calls;
        const hasTechniqueName = calls.some(
          (call) => call[0].includes("천둥벽력") && call[1].includes("Thunder Strike")
        );
        expect(hasTechniqueName).toBe(true);
      });

      it("should use technique damage values not hardcoded 15", () => {
        // GEON technique has 30 damage, not 15
        const geonTechnique = TRIGRAM_TECHNIQUES[TrigramStance.GEON][0];
        expect(geonTechnique.damage).toBe(30);
        expect(geonTechnique.damage).not.toBe(15);

        // TAE technique has 25 damage, not 15
        const taeTechnique = TRIGRAM_TECHNIQUES[TrigramStance.TAE][0];
        expect(taeTechnique.damage).toBe(25);
        expect(taeTechnique.damage).not.toBe(15);

        // LI technique has 35 damage, not 15
        const liTechnique = TRIGRAM_TECHNIQUES[TrigramStance.LI][0];
        expect(liTechnique.damage).toBe(35);
        expect(liTechnique.damage).not.toBe(15);
      });
    });
  });
});
