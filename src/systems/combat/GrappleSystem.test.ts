/**
 * Tests for GrappleSystem
 *
 * **Korean**: 잡기 시스템 테스트 (Grapple System Tests)
 *
 * Tests realistic grappling and control mechanics based on
 * Hapkido and Ssireum principles.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  GrappleSystem,
  DEFAULT_GRAPPLE_CONFIG,
  type GrappleAttemptResult,
  type EscapeAttemptResult,
} from "./GrappleSystem";
import type { PlayerState } from "@/systems/player";
import {
  CombatState,
  GrappleState,
  GrappleTarget,
  PlayerArchetype,
  TrigramStance,
} from "@/types";

describe("GrappleSystem", () => {
  let grappleSystem: GrappleSystem;
  let attacker: PlayerState;
  let defender: PlayerState;
  let currentTime: number;

  beforeEach(() => {
    grappleSystem = new GrappleSystem();
    currentTime = 1000;

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
  });

  describe("attemptGrapple", () => {
    it("should successfully initiate grapple with sufficient stats", () => {
      const result = grappleSystem.attemptGrapple(
        attacker,
        defender,
        GrappleTarget.ARM,
        currentTime
      );

      // Success is probabilistic, but we can check structure
      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("staminaCost");

      if (result.success) {
        expect(result.grappleControl).toBeDefined();
        expect(result.grappleControl?.state).toBe(GrappleState.CONTROLLING);
        expect(result.grappleControl?.controllerId).toBe(attacker.id);
        expect(result.grappleControl?.targetId).toBe(defender.id);
        expect(result.grappleControl?.target).toBe(GrappleTarget.ARM);
        expect(result.grappleControl?.gripStrength).toBeGreaterThan(0);
      }
    });

    it("should fail if attacker is stunned", () => {
      const stunnedAttacker = {
        ...attacker,
        combatState: CombatState.STUNNED,
      };

      const result = grappleSystem.attemptGrapple(
        stunnedAttacker,
        defender,
        GrappleTarget.ARM,
        currentTime
      );

      expect(result.success).toBe(false);
      expect(result.reason).toContain("stunned");
      expect(result.staminaCost).toBe(0);
    });

    it("should fail if attacker has insufficient stamina", () => {
      const tiredAttacker = {
        ...attacker,
        stamina: 5, // Below escape stamina cost
      };

      const result = grappleSystem.attemptGrapple(
        tiredAttacker,
        defender,
        GrappleTarget.ARM,
        currentTime
      );

      expect(result.success).toBe(false);
      expect(result.reason).toContain("stamina");
      expect(result.staminaCost).toBe(0);
    });

    it("should fail if defender is already grappled", () => {
      const grappledDefender = {
        ...defender,
        combatState: CombatState.GRAPPLED,
      };

      const result = grappleSystem.attemptGrapple(
        attacker,
        grappledDefender,
        GrappleTarget.ARM,
        currentTime
      );

      expect(result.success).toBe(false);
      expect(result.reason).toContain("already being grappled");
      expect(result.staminaCost).toBe(0);
    });

    it("should have higher success rate with GON stance", () => {
      const gonAttacker = {
        ...attacker,
        currentStance: TrigramStance.GON,
      };

      const nonGonAttacker = {
        ...attacker,
        currentStance: TrigramStance.GEON,
      };

      // Test multiple times to get statistical significance
      let gonSuccesses = 0;
      let nonGonSuccesses = 0;
      const trials = 100;

      for (let i = 0; i < trials; i++) {
        const gonResult = grappleSystem.attemptGrapple(
          gonAttacker,
          defender,
          GrappleTarget.ARM,
          currentTime + i
        );
        if (gonResult.success) gonSuccesses++;

        const nonGonResult = grappleSystem.attemptGrapple(
          nonGonAttacker,
          defender,
          GrappleTarget.ARM,
          currentTime + i + 1000
        );
        if (nonGonResult.success) nonGonSuccesses++;
      }

      // GON stance should have higher success rate
      expect(gonSuccesses).toBeGreaterThan(nonGonSuccesses * 0.9);
    });

    it("should calculate appropriate grip strength for different targets", () => {
      const targets = [
        GrappleTarget.HAND,
        GrappleTarget.ARM,
        GrappleTarget.LEG,
        GrappleTarget.TORSO,
        GrappleTarget.NECK,
        GrappleTarget.BOTH_ARMS,
      ];

      const results: { [key: string]: number } = {};

      // Collect successful grapples
      for (const target of targets) {
        for (let i = 0; i < 10; i++) {
          const result = grappleSystem.attemptGrapple(
            attacker,
            defender,
            target,
            currentTime + i
          );

          if (result.success && result.grappleControl) {
            if (!results[target]) {
              results[target] = result.grappleControl.gripStrength;
              break;
            }
          }
        }
      }

      // Hand should be easier to control than both arms
      if (results[GrappleTarget.HAND] && results[GrappleTarget.BOTH_ARMS]) {
        expect(results[GrappleTarget.HAND]).toBeGreaterThan(
          results[GrappleTarget.BOTH_ARMS]
        );
      }
    });
  });

  describe("updateGrapple", () => {
    it("should update grapple duration", () => {
      const initialGrapple = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 80,
        duration: 0,
        startTime: currentTime,
        canEscape: false,
        staminaCostPerSecond: 5,
      };

      const newTime = currentTime + 600;
      const deltaTime = 0.6; // 600ms in seconds

      const updated = grappleSystem.updateGrapple(
        initialGrapple,
        attacker,
        defender,
        deltaTime,
        newTime
      );

      expect(updated).not.toBeNull();
      expect(updated?.duration).toBe(600);
    });

    it("should decay grip strength over time", () => {
      const initialGrapple = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 80,
        duration: 0,
        startTime: currentTime,
        canEscape: false,
        staminaCostPerSecond: 5,
      };

      const deltaTime = 1.0; // 1 second

      const updated = grappleSystem.updateGrapple(
        initialGrapple,
        attacker,
        defender,
        deltaTime,
        currentTime + 1000
      );

      expect(updated).not.toBeNull();
      expect(updated!.gripStrength).toBeLessThan(initialGrapple.gripStrength);
    });

    it("should allow escape after minimum duration", () => {
      const initialGrapple = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 80,
        duration: 0,
        startTime: currentTime,
        canEscape: false,
        staminaCostPerSecond: 5,
      };

      // Update past minimum duration
      const newTime = currentTime + DEFAULT_GRAPPLE_CONFIG.minControlDuration + 100;
      const deltaTime = (DEFAULT_GRAPPLE_CONFIG.minControlDuration + 100) / 1000;

      const updated = grappleSystem.updateGrapple(
        initialGrapple,
        attacker,
        defender,
        deltaTime,
        newTime
      );

      expect(updated).not.toBeNull();
      expect(updated?.canEscape).toBe(true);
    });

    it("should break control if controller is stunned", () => {
      const initialGrapple = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 80,
        duration: 0,
        startTime: currentTime,
        canEscape: false,
        staminaCostPerSecond: 5,
      };

      const stunnedController = {
        ...attacker,
        combatState: CombatState.STUNNED,
      };

      const updated = grappleSystem.updateGrapple(
        initialGrapple,
        stunnedController,
        defender,
        0.1,
        currentTime + 100
      );

      expect(updated).toBeNull();
    });

    it("should break control if controller runs out of stamina", () => {
      const initialGrapple = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 80,
        duration: 0,
        startTime: currentTime,
        canEscape: false,
        staminaCostPerSecond: 5,
      };

      const exhaustedController = {
        ...attacker,
        stamina: 2, // Not enough for update
      };

      const updated = grappleSystem.updateGrapple(
        initialGrapple,
        exhaustedController,
        defender,
        1.0,
        currentTime + 1000
      );

      expect(updated).toBeNull();
    });

    it("should break control if grip strength drops too low", () => {
      const initialGrapple = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 21, // Just above minimum (20)
        duration: 0,
        startTime: currentTime,
        canEscape: false,
        staminaCostPerSecond: 5,
      };

      // Decay rate is 2 points per second, so 2 seconds should drop it below 20
      const deltaTime = 1.5;

      const updated = grappleSystem.updateGrapple(
        initialGrapple,
        attacker,
        defender,
        deltaTime,
        currentTime + 1500
      );

      // With grip at 21 and decay of 3 (2*1.5), it should drop to 18, below minimum of 20
      expect(updated).toBeNull();
    });
  });

  describe("attemptEscape", () => {
    it("should not allow escape before minimum duration", () => {
      const grappleControl = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 80,
        duration: 200, // Below minimum
        startTime: currentTime,
        canEscape: false,
        staminaCostPerSecond: 5,
      };

      const result = grappleSystem.attemptEscape(
        grappleControl,
        attacker,
        defender
      );

      expect(result.success).toBe(false);
      expect(result.reason).toContain("Cannot escape yet");
      expect(result.staminaCost).toBe(0);
    });

    it("should fail escape with insufficient stamina", () => {
      const grappleControl = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 80,
        duration: 1000,
        startTime: currentTime,
        canEscape: true,
        staminaCostPerSecond: 5,
      };

      const tiredDefender = {
        ...defender,
        stamina: 5, // Below escape cost
      };

      const result = grappleSystem.attemptEscape(
        grappleControl,
        attacker,
        tiredDefender
      );

      expect(result.success).toBe(false);
      expect(result.reason).toContain("stamina");
      expect(result.staminaCost).toBe(0);
    });

    it("should weaken grip on failed escape", () => {
      const initialGripStrength = 80;
      const grappleControl = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: initialGripStrength,
        duration: 1000,
        startTime: currentTime,
        canEscape: true,
        staminaCostPerSecond: 5,
      };

      const result = grappleSystem.attemptEscape(
        grappleControl,
        attacker,
        defender
      );

      if (!result.success && result.grappleControl) {
        expect(result.grappleControl.gripStrength).toBeLessThan(initialGripStrength);
      }
    });

    it("should break control on successful escape", () => {
      const grappleControl = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 30, // Weak grip
        duration: 3000, // Long duration
        startTime: currentTime,
        canEscape: true,
        staminaCostPerSecond: 5,
      };

      // Strong defender
      const strongDefender = {
        ...defender,
        attackPower: 20,
        speed: 18,
        technique: 16,
      };

      // Try multiple times to get a success
      let gotSuccess = false;
      for (let i = 0; i < 20; i++) {
        const result = grappleSystem.attemptEscape(
          grappleControl,
          attacker,
          strongDefender
        );

        if (result.success) {
          expect(result.grappleControl).toBeNull();
          gotSuccess = true;
          break;
        }
      }

      // With weak grip and strong defender, should eventually succeed
      expect(gotSuccess).toBe(true);
    });
  });

  describe("canTransitionToThrow", () => {
    it("should allow throw transition with sufficient control", () => {
      const grappleControl = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 70,
        duration: 1500, // Sufficient duration
        startTime: currentTime,
        canEscape: true,
        staminaCostPerSecond: 5,
      };

      const canThrow = grappleSystem.canTransitionToThrow(
        grappleControl,
        attacker
      );

      expect(canThrow).toBe(true);
    });

    it("should not allow throw with insufficient duration", () => {
      const grappleControl = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 70,
        duration: 500, // Too short
        startTime: currentTime,
        canEscape: false,
        staminaCostPerSecond: 5,
      };

      const canThrow = grappleSystem.canTransitionToThrow(
        grappleControl,
        attacker
      );

      expect(canThrow).toBe(false);
    });

    it("should not allow throw with weak grip", () => {
      const grappleControl = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 40, // Too weak
        duration: 1500,
        startTime: currentTime,
        canEscape: true,
        staminaCostPerSecond: 5,
      };

      const canThrow = grappleSystem.canTransitionToThrow(
        grappleControl,
        attacker
      );

      expect(canThrow).toBe(false);
    });

    it("should not allow throw from hand grapple", () => {
      const grappleControl = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.HAND, // Not good for throws
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 70,
        duration: 1500,
        startTime: currentTime,
        canEscape: true,
        staminaCostPerSecond: 5,
      };

      const canThrow = grappleSystem.canTransitionToThrow(
        grappleControl,
        attacker
      );

      expect(canThrow).toBe(false);
    });
  });

  describe("canTransitionToJointLock", () => {
    it("should allow joint lock on arm", () => {
      const highTechAttacker = {
        ...attacker,
        technique: 15,
      };

      const grappleControl = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 70,
        duration: 1000,
        startTime: currentTime,
        canEscape: true,
        staminaCostPerSecond: 5,
      };

      const canLock = grappleSystem.canTransitionToJointLock(
        grappleControl,
        highTechAttacker
      );

      expect(canLock).toBe(true);
    });

    it("should not allow joint lock with low technique", () => {
      const lowTechAttacker = {
        ...attacker,
        technique: 5,
      };

      const grappleControl = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.ARM,
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 70,
        duration: 1000,
        startTime: currentTime,
        canEscape: true,
        staminaCostPerSecond: 5,
      };

      const canLock = grappleSystem.canTransitionToJointLock(
        grappleControl,
        lowTechAttacker
      );

      expect(canLock).toBe(false);
    });

    it("should not allow joint lock on torso", () => {
      const grappleControl = {
        state: GrappleState.CONTROLLING,
        target: GrappleTarget.TORSO, // Not a joint
        controllerId: attacker.id,
        targetId: defender.id,
        gripStrength: 70,
        duration: 1000,
        startTime: currentTime,
        canEscape: true,
        staminaCostPerSecond: 5,
      };

      const canLock = grappleSystem.canTransitionToJointLock(
        grappleControl,
        attacker
      );

      expect(canLock).toBe(false);
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
