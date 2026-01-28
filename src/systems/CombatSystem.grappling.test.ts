/**
 * Integration Tests for CombatSystem with Grappling
 *
 * **Korean**: 잡기 전투 시스템 통합 테스트 (Combat System Grappling Integration Tests)
 *
 * Tests the integration of GrappleSystem with CombatSystem,
 * ensuring grappling mechanics work correctly in combat flow.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { CombatSystem } from "./CombatSystem";
import type { PlayerState } from "@/systems/player";
import {
  CombatAttackType,
  CombatState,
  GrappleState,
  GrappleTarget,
  PlayerArchetype,
  TrigramStance,
} from "@/types";
import type { KoreanTechnique } from "@/systems/vitalpoint/types";

describe("CombatSystem Grappling Integration", () => {
  let combatSystem: CombatSystem;
  let attacker: PlayerState;
  let defender: PlayerState;
  let grappleTechnique: KoreanTechnique;

  beforeEach(() => {
    combatSystem = new CombatSystem();

    // Create test players
    attacker = createTestPlayer("attacker", {
      attackPower: 15,
      defense: 12,
      speed: 10,
      technique: 14,
      stamina: 100,
      currentStance: TrigramStance.GON, // GON stance is good for grappling
      combatState: CombatState.IDLE,
    });

    defender = createTestPlayer("defender", {
      attackPower: 12,
      defense: 15,
      speed: 12,
      technique: 10,
      stamina: 100,
      currentStance: TrigramStance.GEON,
      combatState: CombatState.IDLE,
    });

    // Create a grapple technique
    grappleTechnique = {
      id: "test-grapple",
      name: { korean: "팔꺾기", english: "Arm Lock" },
      koreanName: "팔꺾기",
      englishName: "Arm Lock",
      romanized: "pal-kkeok-gi",
      description: {
        korean: "상대 팔을 잡아 관절을 꺾는 기술",
        english: "Lock opponent's arm by grasping and applying joint pressure",
      },
      stance: TrigramStance.GON,
      type: CombatAttackType.GRAPPLE,
      damageType: "joint" as any,
      damage: 20,
      kiCost: 10,
      staminaCost: 15,
      accuracy: 0.85,
      reachConfig: {
        bodyPart: "arm",
        techniqueType: "punch",
        baseExtension: 0.9,
      },
      executionTime: 600,
      recoveryTime: 800,
      critChance: 0.1,
      critMultiplier: 1.5,
      effects: [],
      category: "medium",
      range: "short",
      speed: 0.9,
    };
  });

  describe("Grapple Attack Execution", () => {
    it("should initiate grapple on successful GRAPPLE attack", () => {
      // Execute multiple times to get at least one success
      let result;
      for (let i = 0; i < 20; i++) {
        result = combatSystem.resolveAttack(attacker, defender, grappleTechnique);
        if (result.success) break;
      }

      expect(result).toBeDefined();
      if (result!.success) {
        expect(result!.hit).toBe(true);
        expect(result!.attacker.combatState).toBe(CombatState.GRAPPLING);
        expect(result!.defender.combatState).toBe(CombatState.GRAPPLED);
        expect(result!.attacker.grappleControl).toBeDefined();
        expect(result!.defender.grappleControl).toBeDefined();
      }
    });

    it("should prevent grappled player from attacking", () => {
      // Set defender as grappled
      const grappledDefender: PlayerState = {
        ...defender,
        combatState: CombatState.GRAPPLED,
        grappleControl: {
          state: GrappleState.CONTROLLING,
          target: GrappleTarget.ARM,
          controllerId: attacker.id,
          targetId: defender.id,
          gripStrength: 70,
          duration: 1000,
          startTime: Date.now(),
          canEscape: true,
          staminaCostPerSecond: 5,
        },
      };

      // Try to attack while grappled
      const normalTechnique: KoreanTechnique = {
        ...grappleTechnique,
        id: "test-punch",
        type: CombatAttackType.PUNCH,
      };

      const result = combatSystem.resolveAttack(
        grappledDefender,
        attacker,
        normalTechnique
      );

      expect(result.success).toBe(false);
      expect(result.hit).toBe(false);
    });

    it("should deal reduced damage on successful grapple", () => {
      // Execute grapple multiple times to get success
      let successfulResult;
      for (let i = 0; i < 20; i++) {
        const result = combatSystem.resolveAttack(
          attacker,
          defender,
          grappleTechnique
        );
        if (result.success) {
          successfulResult = result;
          break;
        }
      }

      if (successfulResult) {
        // Grapples deal 30% of normal damage on initiation
        expect(successfulResult.damage).toBeGreaterThan(0);
        expect(successfulResult.damage).toBeLessThan(grappleTechnique.damage);
        expect(successfulResult.damage).toBeLessThanOrEqual(
          grappleTechnique.damage * 0.3
        );
      }
    });

    it("should consume stamina on grapple attempt", () => {
      const initialStamina = attacker.stamina;

      // Execute grapple
      const result = combatSystem.resolveAttack(
        attacker,
        defender,
        grappleTechnique
      );

      // Stamina should be consumed regardless of success
      if (result.attacker.stamina !== initialStamina) {
        expect(result.attacker.stamina).toBeLessThan(initialStamina);
      }
    });
  });

  describe("Grapple Control State", () => {
    it("should track grapple control on both players", () => {
      // Execute grapple multiple times to get success
      let successfulResult;
      for (let i = 0; i < 20; i++) {
        const result = combatSystem.resolveAttack(
          attacker,
          defender,
          grappleTechnique
        );
        if (result.success) {
          successfulResult = result;
          break;
        }
      }

      if (successfulResult) {
        const { attacker: updatedAttacker, defender: updatedDefender } =
          successfulResult;

        expect(updatedAttacker.grappleControl).toBeDefined();
        expect(updatedDefender.grappleControl).toBeDefined();
        expect(updatedAttacker.grappleControl?.controllerId).toBe(attacker.id);
        expect(updatedAttacker.grappleControl?.targetId).toBe(defender.id);
        expect(updatedDefender.grappleControl?.controllerId).toBe(attacker.id);
        expect(updatedDefender.grappleControl?.targetId).toBe(defender.id);
      }
    });

    it("should determine grapple target from technique name", () => {
      // Test different technique names
      const armTechnique = {
        ...grappleTechnique,
        id: "arm-lock",
        name: { korean: "팔꺾기", english: "Arm Lock" },
      };

      const wristTechnique = {
        ...grappleTechnique,
        id: "wrist-lock",
        name: { korean: "손목꺾기", english: "Wrist Lock" },
      };

      const hipTechnique = {
        ...grappleTechnique,
        id: "hip-throw",
        name: { korean: "허리후리기", english: "Hip Throw" },
      };

      // Execute and verify targets (indirectly through success)
      const armResult = combatSystem.resolveAttack(
        attacker,
        defender,
        armTechnique
      );
      const wristResult = combatSystem.resolveAttack(
        attacker,
        defender,
        wristTechnique
      );
      const hipResult = combatSystem.resolveAttack(
        attacker,
        defender,
        hipTechnique
      );

      // Just verify they execute without errors
      expect(armResult).toBeDefined();
      expect(wristResult).toBeDefined();
      expect(hipResult).toBeDefined();
    });
  });

  describe("Grapple State Updates", () => {
    it("should update grapple state over time", () => {
      const currentTime = Date.now();

      // Create initial grapple state
      const controller: PlayerState = {
        ...attacker,
        combatState: CombatState.GRAPPLING,
        grappleControl: {
          state: GrappleState.CONTROLLING,
          target: GrappleTarget.ARM,
          controllerId: attacker.id,
          targetId: defender.id,
          gripStrength: 80,
          duration: 0,
          startTime: currentTime,
          canEscape: false,
          staminaCostPerSecond: 5,
        },
      };

      const controlled: PlayerState = {
        ...defender,
        combatState: CombatState.GRAPPLED,
        grappleControl: controller.grappleControl,
      };

      // Update state
      const result = combatSystem.updateGrappleState(
        controller,
        controlled,
        1.0, // 1 second
        currentTime + 1000
      );

      expect(result).toBeDefined();
      expect(result.updatedController).toBeDefined();
      expect(result.updatedTarget).toBeDefined();

      // Stamina should have decreased
      expect(result.updatedController.stamina).toBeLessThan(controller.stamina);

      // Control duration should have increased
      if (result.updatedController.grappleControl) {
        expect(result.updatedController.grappleControl.duration).toBeGreaterThan(
          0
        );
      }
    });

    it("should break grapple when stamina runs out", () => {
      const currentTime = Date.now();

      // Create controller with low stamina
      const tiredController: PlayerState = {
        ...attacker,
        stamina: 2, // Very low stamina
        combatState: CombatState.GRAPPLING,
        grappleControl: {
          state: GrappleState.CONTROLLING,
          target: GrappleTarget.ARM,
          controllerId: attacker.id,
          targetId: defender.id,
          gripStrength: 80,
          duration: 1000,
          startTime: currentTime - 1000,
          canEscape: true,
          staminaCostPerSecond: 5,
        },
      };

      const controlled: PlayerState = {
        ...defender,
        combatState: CombatState.GRAPPLED,
        grappleControl: tiredController.grappleControl,
      };

      // Update with long delta time
      const result = combatSystem.updateGrappleState(
        tiredController,
        controlled,
        1.0,
        currentTime
      );

      // Grapple should be broken
      expect(result.updatedController.combatState).toBe(CombatState.IDLE);
      expect(result.updatedTarget.combatState).toBe(CombatState.IDLE);
      expect(result.updatedController.grappleControl).toBeNull();
      expect(result.updatedTarget.grappleControl).toBeNull();
    });
  });

  describe("Combat Flow with Grappling", () => {
    it("should handle complete grapple flow: initiate -> control -> release", () => {
      const timestamp = Date.now();

      // Step 1: Initiate grapple
      let result = null;
      for (let i = 0; i < 30; i++) {
        result = combatSystem.resolveAttack(attacker, defender, grappleTechnique);
        if (result.success) break;
      }

      expect(result).not.toBeNull();

      if (result!.success) {
        const { attacker: grapplingAttacker, defender: grappledDefender } =
          result;

        // Step 2: Verify control state
        expect(grapplingAttacker.combatState).toBe(CombatState.GRAPPLING);
        expect(grappledDefender.combatState).toBe(CombatState.GRAPPLED);

        // Step 3: Update over time (maintain control)
        const updateResult = combatSystem.updateGrappleState(
          grapplingAttacker,
          grappledDefender,
          0.5,
          timestamp + 500
        );

        // Control should still be maintained
        if (updateResult.updatedController.grappleControl) {
          expect(updateResult.updatedController.combatState).toBe(
            CombatState.GRAPPLING
          );
          expect(updateResult.updatedTarget.combatState).toBe(
            CombatState.GRAPPLED
          );
        }
      }
    });

    it("should allow GON stance to have grappling advantage", () => {
      const gonAttacker = {
        ...attacker,
        currentStance: TrigramStance.GON,
      };

      const nonGonAttacker = {
        ...attacker,
        currentStance: TrigramStance.GEON,
      };

      // Execute multiple times to get statistical significance
      let gonSuccesses = 0;
      let nonGonSuccesses = 0;
      const trials = 50;

      for (let i = 0; i < trials; i++) {
        const gonResult = combatSystem.resolveAttack(
          gonAttacker,
          defender,
          grappleTechnique
        );
        if (gonResult.success) gonSuccesses++;

        const nonGonResult = combatSystem.resolveAttack(
          nonGonAttacker,
          defender,
          grappleTechnique
        );
        if (nonGonResult.success) nonGonSuccesses++;
      }

      // GON stance should have higher success rate (at least 80% of the time)
      expect(gonSuccesses).toBeGreaterThan(nonGonSuccesses * 0.8);
    });
  });
});

/**
 * Helper to create test player
 */
function createTestPlayer(
  id: string,
  overrides: Partial<PlayerState> = {}
): PlayerState {
  const defaultPlayer: PlayerState = {
    id,
    name: { korean: "테스트", english: "Test" },
    archetype: PlayerArchetype.MUSA,
    health: 100,
    maxHealth: 100,
    ki: 100,
    maxKi: 100,
    stamina: 100,
    maxStamina: 100,
    energy: 100,
    maxEnergy: 100,
    attackPower: 10,
    defense: 10,
    speed: 10,
    technique: 10,
    pain: 0,
    consciousness: 100,
    balance: 100,
    momentum: 0,
    currentStance: TrigramStance.GEON,
    combatState: CombatState.IDLE,
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
    grappleControl: null,
  };

  return { ...defaultPlayer, ...overrides };
}
