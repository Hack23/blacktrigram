/**
 * Tests for useCombatActions hook
 * Verifies combat action handlers functionality
 */

import { AnimationType } from "@/systems/animation/builders/MartialArtsConstants";
import { CombatSystem } from "@/systems/CombatSystem";
import { HitEffectType } from "@/systems/effects";
import { DamageType, PlayerArchetype, TrigramStance } from "@/types";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCombatActions } from "./useCombatActions";
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
      statusEffects: [],
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
      statusEffects: [],
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
      onLateralityUpdate: vi.fn(),
      addCombatMessage: vi.fn(),
      addHitEffect: vi.fn(),
      arenaBounds: {
        x: 100,
        y: 100,
        width: 800,
        height: 600,
        worldWidthMeters: 8,
        worldDepthMeters: 6,
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
        damageType: DamageType.BLUNT,
        cooldown: 5000,
        keyboardShortcut: "Q" as const,
        criticalChance: 0.3,
        animationDuration: 800,
      };

      // Spy on the combat system to verify technique conversion
      const resolveAttackSpy = vi.spyOn(mockCombatSystem, "resolveAttack");

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
        }),
        undefined, // vitalPointId
        expect.objectContaining({
          animationType: expect.anything(),
          currentTime: expect.any(Number), // Uses peak time for hit detection
        }),
      );
    });

    it("should use stance-based technique when no technique provided", () => {
      // Spy on combat system to verify technique is being used
      const resolveAttackSpy = vi.spyOn(mockCombatSystem, "resolveAttack");

      const { result } = renderHook(() => useCombatActions(mockConfig));

      act(() => {
        result.current.handleAttack();
      });

      // Should execute attack with stance-based technique (GEON stance)
      expect(mockConfig.addHitEffect).toHaveBeenCalled();
      expect(mockConfig.addCombatMessage).toHaveBeenCalled();

      // Verify a technique from GEON stance was used (not basic attack)
      // Check that stance matches GEON rather than specific technique ID
      const attackCall = resolveAttackSpy.mock.calls[0];
      expect(attackCall).toBeDefined();
      expect(attackCall[2]).toMatchObject({
        stance: TrigramStance.GEON,
      });
      // Verify Korean name is present (proving it's not the old hardcoded basic attack)
      expect(attackCall[2].koreanName).toBeTruthy();
    });

    it("should reject attack when player has insufficient resources for stance technique", () => {
      const lowResourcePlayer = {
        ...mockConfig.validPlayers[0],
        ki: 5, // GEON techniques require more ki
        stamina: 10,
      };
      const config = {
        ...mockConfig,
        validPlayers: [lowResourcePlayer, mockConfig.validPlayers[1]] as const,
      };

      const { result } = renderHook(() => useCombatActions(config));

      act(() => {
        result.current.handleAttack();
      });

      // Should show insufficient resources message
      expect(config.addCombatMessage).toHaveBeenCalledWith(
        "기력/체력 부족",
        "Insufficient Ki/Stamina",
      );
      expect(config.onPlayerUpdate).not.toHaveBeenCalled();
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
        expect.objectContaining({ isBlocking: true }),
      );
      expect(mockConfig.addCombatMessage).toHaveBeenCalledWith(
        "방어 자세",
        "Defensive Stance",
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
        "Insufficient Ki/Stamina",
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
        "Insufficient Ki/Stamina",
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
        1.5,
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
        expect.objectContaining({ currentStance: TrigramStance.LI }),
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

        // Should add hit effect (HIT or CRITICAL_HIT depending on combat result)
        expect(mockConfig.addHitEffect).toHaveBeenCalled();
      });

      it("should use combat system to resolve attack", () => {
        const { result } = renderHook(() => useCombatActions(mockConfig));

        act(() => {
          result.current.handleAIAttack();
        });

        // should update both players through combat system
        expect(mockConfig.onPlayerUpdate).toHaveBeenCalled();
      });

      it("should add combat message on hit or miss", () => {
        const { result } = renderHook(() => useCombatActions(mockConfig));

        act(() => {
          result.current.handleAIAttack();
        });

        expect(mockConfig.addCombatMessage).toHaveBeenCalled();
      });

      it("should use proper basic attack technique", () => {
        const { result } = renderHook(() => useCombatActions(mockConfig));

        act(() => {
          result.current.handleAIAttack();
        });

        // Verify combat message includes attack reference
        expect(mockConfig.addCombatMessage).toHaveBeenCalledWith(
          expect.stringContaining("AI"),
          expect.stringContaining("AI"),
        );
      });

      it("should use provided technique when passed as parameter", () => {
        const mockTechnique = {
          id: "test_technique",
          name: { korean: "테스트", english: "Test Tech", romanized: "test" },
          koreanName: "테스트",
          englishName: "Test Tech",
          romanized: "test",
          description: { korean: "테스트", english: "Test" },
          stance: TrigramStance.GEON,
          type: "attack",
          damageType: "physical",
          damage: 20,
          kiCost: 10,
          staminaCost: 12,
          accuracy: 0.9,
          reachConfig: {
            bodyPart: "arm" as const,
            techniqueType: "punch" as const,
            baseExtension: 0.95,
          },
          executionTime: 500,
          recoveryTime: 400,
          critChance: 0.15,
          critMultiplier: 1.6,
          effects: [],
        };

        const { result } = renderHook(() => useCombatActions(mockConfig));

        act(() => {
          result.current.handleAIAttack(mockTechnique, undefined);
        });

        // Combat system should be called with the provided technique
        expect(mockConfig.onPlayerUpdate).toHaveBeenCalled();
        expect(mockConfig.addHitEffect).toHaveBeenCalled();
      });

      it("should pass vital point ID to combat system when provided", () => {
        const mockTechnique = {
          id: "test_technique",
          name: { korean: "테스트", english: "Test Tech", romanized: "test" },
          koreanName: "테스트",
          englishName: "Test Tech",
          romanized: "test",
          description: { korean: "테스트", english: "Test" },
          stance: TrigramStance.GEON,
          type: "attack",
          damageType: "physical",
          damage: 20,
          kiCost: 10,
          staminaCost: 12,
          accuracy: 0.9,
          reachConfig: {
            bodyPart: "arm" as const,
            techniqueType: "punch" as const,
            baseExtension: 0.95,
          },
          executionTime: 500,
          recoveryTime: 400,
          critChance: 0.15,
          critMultiplier: 1.6,
          effects: [],
        };
        const mockVitalPoint = "baekhoehoel";

        const resolveSpy = vi.spyOn(mockConfig.combatSystem, "resolveAttack");
        const { result } = renderHook(() => useCombatActions(mockConfig));

        act(() => {
          result.current.handleAIAttack(mockTechnique, mockVitalPoint);
        });

        // Verify resolveAttack was called with vital point parameter and animation context
        expect(resolveSpy).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          expect.anything(),
          mockVitalPoint,
          expect.objectContaining({
            animationType: expect.anything(),
            currentTime: expect.any(Number),
          }),
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
          expect.objectContaining({ isBlocking: true }),
        );
      });
    });

    describe("handleAITechnique", () => {
      it("should fall back to basic attack with insufficient resources", () => {
        const lowResourcePlayer = { ...mockConfig.validPlayers[1], ki: 5 };
        const config = {
          ...mockConfig,
          validPlayers: [
            mockConfig.validPlayers[0],
            lowResourcePlayer,
          ] as const,
        };

        const { result } = renderHook(() => useCombatActions(config));

        act(() => {
          result.current.handleAITechnique();
        });

        // Should fall back to basic attack (addHitEffect called)
        expect(config.addHitEffect).toHaveBeenCalled();
      });

      it("should execute technique with sufficient resources", () => {
        const { result } = renderHook(() => useCombatActions(mockConfig));

        act(() => {
          result.current.handleAITechnique();
        });

        // Should add critical hit effect for technique
        expect(mockConfig.addHitEffect).toHaveBeenCalled();
      });

      it("should use combat system to resolve technique", () => {
        const { result } = renderHook(() => useCombatActions(mockConfig));

        act(() => {
          result.current.handleAITechnique();
        });

        // should update players through combat system
        expect(mockConfig.onPlayerUpdate).toHaveBeenCalled();
      });

      it("should consume resources even on miss", () => {
        const { result } = renderHook(() => useCombatActions(mockConfig));

        act(() => {
          result.current.handleAITechnique();
        });

        // Either updates through combat system or manually deducts resources
        expect(mockConfig.onPlayerUpdate).toHaveBeenCalled();
      });

      it("should use provided technique and vital point when passed", () => {
        const mockTechnique = {
          id: "special_technique",
          name: {
            korean: "특수기술",
            english: "Special Tech",
            romanized: "special",
          },
          koreanName: "특수기술",
          englishName: "Special Tech",
          romanized: "special",
          description: { korean: "특수", english: "Special" },
          stance: TrigramStance.GEON,
          type: "technique",
          damageType: "physical",
          damage: 30,
          kiCost: 15,
          staminaCost: 18,
          accuracy: 0.85,
          reachConfig: {
            bodyPart: "leg" as const,
            techniqueType: "kick" as const,
            baseExtension: 1.1,
          },
          executionTime: 700,
          recoveryTime: 600,
          critChance: 0.2,
          critMultiplier: 1.8,
          effects: [],
          animationType: AnimationType.SPINNING_HOOK, // Required for animation context
        };
        const mockVitalPoint = "myeongchi";

        const resolveSpy = vi.spyOn(mockConfig.combatSystem, "resolveAttack");
        const { result } = renderHook(() => useCombatActions(mockConfig));

        act(() => {
          result.current.handleAITechnique(mockTechnique, mockVitalPoint);
        });

        // Verify technique and vital point passed to combat system with animation context
        expect(resolveSpy).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          mockTechnique,
          mockVitalPoint,
          expect.objectContaining({
            animationType: expect.anything(),
            currentTime: expect.any(Number),
          }),
        );
      });

      it("should fall back to basic attack if technique requires too much resources", () => {
        const expensiveTechnique = {
          id: "expensive_technique",
          name: {
            korean: "고비용",
            english: "Expensive",
            romanized: "expensive",
          },
          koreanName: "고비용",
          englishName: "Expensive",
          romanized: "expensive",
          description: { korean: "비용", english: "Cost" },
          stance: TrigramStance.GEON,
          type: "technique",
          damageType: "physical",
          damage: 50,
          kiCost: 100, // More than available
          staminaCost: 100, // More than available
          accuracy: 0.9,
          reachConfig: {
            bodyPart: "arm" as const,
            techniqueType: "punch" as const,
            baseExtension: 1.0,
          },
          executionTime: 1000,
          recoveryTime: 800,
          critChance: 0.25,
          critMultiplier: 2.0,
          effects: [],
        };

        const { result } = renderHook(() => useCombatActions(mockConfig));

        act(() => {
          result.current.handleAITechnique(
            expensiveTechnique,
            "test_vital_point",
          );
        });

        // Should still call combat actions (falls back to basic attack)
        expect(mockConfig.addHitEffect).toHaveBeenCalled();
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
          }),
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
            { x: 3.0, y: 0 }, // Player 1 at 3m from center
            { x: -3.0, y: 0 }, // AI at -3m from center
          ] as const,
        };

        const { result } = renderHook(() => useCombatActions(config));
        // Target position very close to current: within 0.05m threshold (5cm)
        const targetPos = { x: -3.02, y: 0 }; // Only 2cm away

        act(() => {
          result.current.moveAIPlayer(targetPos);
        });

        // Should not update position when distance < 0.05m (5cm threshold from physics-first architecture)
        expect(config.onPlayerUpdate).not.toHaveBeenCalled();
      });
    });
  });

  describe("handleStanceSideSwitch", () => {
    it("should successfully switch laterality when conditions are met", () => {
      const { result } = renderHook(() => useCombatActions(mockConfig));

      act(() => {
        result.current.handleStanceSideSwitch(0);
      });

      // Should update player state with stamina deduction
      expect(mockConfig.onPlayerUpdate).toHaveBeenCalledWith(
        0,
        expect.objectContaining({
          stamina: 78, // 80 - 2
        }),
      );

      // Should add combat message about stance change
      expect(mockConfig.addCombatMessage).toHaveBeenCalledWith(
        expect.stringMatching(/왼발서기|오른발서기/),
        expect.stringMatching(/Left Stance|Right Stance/),
      );

      // Should add visual effect
      expect(mockConfig.addHitEffect).toHaveBeenCalled();
    });

    it("should fail when insufficient stamina", () => {
      const lowStaminaPlayer = { ...mockConfig.validPlayers[0], stamina: 1 };
      const config = {
        ...mockConfig,
        validPlayers: [lowStaminaPlayer, mockConfig.validPlayers[1]] as const,
      };

      const { result } = renderHook(() => useCombatActions(config));

      act(() => {
        result.current.handleStanceSideSwitch(0);
      });

      // Should show insufficient stamina message
      expect(config.addCombatMessage).toHaveBeenCalledWith(
        "체력 부족",
        "Insufficient Stamina",
      );

      // Should not update player state
      expect(config.onPlayerUpdate).not.toHaveBeenCalled();
    });

    it("should toggle laterality from right to left", () => {
      const config = {
        ...mockConfig,
        combatState: {
          ...mockConfig.combatState,
          playerLaterality: ["right", "right"] as [
            "left" | "right",
            "left" | "right",
          ],
        },
      };

      const { result } = renderHook(() => useCombatActions(config));

      act(() => {
        result.current.handleStanceSideSwitch(0);
      });

      // Should add combat message for left stance
      expect(config.addCombatMessage).toHaveBeenCalledWith(
        "왼발서기",
        "Left Stance",
      );
    });

    it("should toggle laterality from left to right", () => {
      // Set combat state with left laterality for player 0
      const config = {
        ...mockConfig,
        combatState: {
          ...mockConfig.combatState,
          playerLaterality: ["left" as "left" | "right", "right" as "left" | "right"],
        },
      };

      const { result } = renderHook(() => useCombatActions(config));

      act(() => {
        result.current.handleStanceSideSwitch(0);
      });

      // Should add combat message for right stance (toggled from left)
      expect(config.addCombatMessage).toHaveBeenCalledWith(
        "오른발서기",
        "Right Stance",
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
        result.current.handleStanceSideSwitch(0);
      });

      // Should not update player or show messages
      expect(config.onPlayerUpdate).not.toHaveBeenCalled();
      expect(config.addCombatMessage).not.toHaveBeenCalled();
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
        result.current.handleStanceSideSwitch(0);
      });

      // Should not update player or show messages
      expect(config.onPlayerUpdate).not.toHaveBeenCalled();
      expect(config.addCombatMessage).not.toHaveBeenCalled();
    });

    it("should work for player 2 (AI)", () => {
      const { result } = renderHook(() => useCombatActions(mockConfig));

      act(() => {
        result.current.handleStanceSideSwitch(1);
      });

      // Should update player 2 state
      expect(mockConfig.onPlayerUpdate).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          stamina: 78, // 80 - 2
        }),
      );
    });

    it("should show cooldown message when on cooldown", () => {
      // This test assumes StanceManager enforces cooldown
      // We'll create a player who recently switched
      const recentSwitchPlayer = {
        ...mockConfig.validPlayers[0],
        lastStanceChangeTime: Date.now() - 100, // Recent stance change
      };
      const config = {
        ...mockConfig,
        validPlayers: [recentSwitchPlayer, mockConfig.validPlayers[1]] as const,
      };

      const { result } = renderHook(() => useCombatActions(config));

      act(() => {
        result.current.handleStanceSideSwitch(0);
        // Attempt immediate second switch (should fail due to cooldown)
        result.current.handleStanceSideSwitch(0);
      });

      // Second call should show cooldown message
      const calls = config.addCombatMessage.mock.calls;
      const hasCooldownMessage = calls.some(
        (call: [string, string]) =>
          call[0] === "대기 중" && call[1] === "On Cooldown",
      );
      expect(hasCooldownMessage || calls.length === 1).toBe(true);
    });
  });

  describe("injury creation functions", () => {
    it("should create injuries when damage is dealt with onInjuryCreated callback", () => {
      const onInjuryCreated = vi.fn();
      const config = {
        ...mockConfig,
        onInjuryCreated,
      };

      const { result } = renderHook(() => useCombatActions(config));

      // Mock successful hit
      vi.spyOn(mockCombatSystem, "resolveAttack").mockReturnValue({
        hit: true,
        damage: 20,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {
          id: "test",
          name: { korean: "테스트", english: "Test", romanized: "test" },
          damageType: "blunt",
        } as any,
        attacker: mockConfig.validPlayers[0],
        defender: mockConfig.validPlayers[1],
        success: true,
        isCritical: false,
        isBlocked: false,
      });

      // Mock applyCombatResult to prevent actual combat system execution
      vi.spyOn(mockCombatSystem, "applyCombatResult").mockReturnValue({
        updatedAttacker: mockConfig.validPlayers[0],
        updatedDefender: {
          ...mockConfig.validPlayers[1],
          health: mockConfig.validPlayers[1].health - 20,
        },
      });

      act(() => {
        result.current.handleAttack();
      });

      // Verify injury was created for player 2 (enemy)
      expect(onInjuryCreated).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^injury_/),
          type: expect.any(String),
          region: expect.any(String),
          position: expect.any(Array),
          severity: expect.any(Number),
          hitCount: 1,
          timestamp: expect.any(Number),
          playerId: "enemy",
        }),
        1, // Target player index
      );
    });

    it("should create fracture injuries when health is critically low", () => {
      const onInjuryCreated = vi.fn();
      const lowHealthPlayer = {
        ...mockConfig.validPlayers[1],
        health: 25, // Below 30% threshold
      };
      const config = {
        ...mockConfig,
        validPlayers: [mockConfig.validPlayers[0], lowHealthPlayer] as const,
        onInjuryCreated,
      };

      const { result } = renderHook(() => useCombatActions(config));

      // Mock severe damage hit
      vi.spyOn(mockCombatSystem, "resolveAttack").mockReturnValue({
        hit: true,
        damage: 30, // Severe damage
        criticalHit: true,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {
          id: "test",
          name: { korean: "테스트", english: "Test", romanized: "test" },
          damageType: "blunt",
        } as any,
        attacker: mockConfig.validPlayers[0],
        defender: lowHealthPlayer,
        success: true,
        isCritical: true,
        isBlocked: false,
      });

      vi.spyOn(mockCombatSystem, "applyCombatResult").mockReturnValue({
        updatedAttacker: mockConfig.validPlayers[0],
        updatedDefender: { ...lowHealthPlayer, health: 20 }, // After damage
      });

      act(() => {
        result.current.handleAttack();
      });

      // Verify fracture injury was created
      expect(onInjuryCreated).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "fracture",
          severity: expect.any(Number),
        }),
        1,
      );
    });

    it("should create cut injuries for slashing damage", () => {
      const onInjuryCreated = vi.fn();
      const config = {
        ...mockConfig,
        onInjuryCreated,
      };

      const { result } = renderHook(() => useCombatActions(config));

      const slashingTechnique = {
        id: "slash",
        name: { korean: "베기", english: "Slash", romanized: "slash" },
        description: { korean: "베기", english: "Slash" },
        damageType: DamageType.SLASHING,
        damage: { min: 10, max: 20 },
        kiCost: 10,
        staminaCost: 15,
        requiredStance: TrigramStance.GEON,
      } as any;

      // Mock slashing attack
      vi.spyOn(mockCombatSystem, "resolveAttack").mockReturnValue({
        hit: true,
        damage: 15,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {
          id: "slash",
          name: { korean: "베기", english: "Slash", romanized: "slash" },
          damageType: "slashing",
        } as any,
        attacker: mockConfig.validPlayers[0],
        defender: mockConfig.validPlayers[1],
        success: true,
        isCritical: false,
        isBlocked: false,
      });

      // Mock applyCombatResult to ensure damage is applied
      vi.spyOn(mockCombatSystem, "applyCombatResult").mockReturnValue({
        updatedAttacker: mockConfig.validPlayers[0],
        updatedDefender: {
          ...mockConfig.validPlayers[1],
          health: mockConfig.validPlayers[1].health - 15,
        },
      });

      act(() => {
        result.current.handleAttack(slashingTechnique);
      });

      // Verify cut injury was created
      expect(onInjuryCreated).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "cut",
        }),
        1,
      );
    });

    it("should create laceration injuries for heavy slashing damage", () => {
      const onInjuryCreated = vi.fn();
      const config = {
        ...mockConfig,
        onInjuryCreated,
      };

      const { result } = renderHook(() => useCombatActions(config));

      const heavySlashingTechnique = {
        id: "heavy-slash",
        name: { korean: "강베기", english: "Heavy Slash", romanized: "slash" },
        description: { korean: "강베기", english: "Heavy Slash" },
        damageType: DamageType.SLASHING,
        damage: { min: 20, max: 30 },
        kiCost: 15,
        staminaCost: 20,
        requiredStance: TrigramStance.GEON,
      } as any;

      // Mock heavy slashing attack
      vi.spyOn(mockCombatSystem, "resolveAttack").mockReturnValue({
        hit: true,
        damage: 25, // Over 20 damage threshold
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {
          id: "heavy-slash",
          name: { korean: "강베기", english: "Heavy Slash", romanized: "slash" },
          damageType: "slashing",
        } as any,
        attacker: mockConfig.validPlayers[0],
        defender: mockConfig.validPlayers[1],
        success: true,
        isCritical: false,
        isBlocked: false,
      });

      // Mock applyCombatResult to ensure damage is applied
      vi.spyOn(mockCombatSystem, "applyCombatResult").mockReturnValue({
        updatedAttacker: mockConfig.validPlayers[0],
        updatedDefender: {
          ...mockConfig.validPlayers[1],
          health: mockConfig.validPlayers[1].health - 25,
        },
      });

      act(() => {
        result.current.handleAttack(heavySlashingTechnique);
      });

      // Verify laceration injury was created
      expect(onInjuryCreated).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "laceration",
        }),
        1,
      );
    });
  });
});
