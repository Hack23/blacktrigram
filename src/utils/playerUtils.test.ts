import { beforeEach, describe, expect, it } from "vitest";
import { PLAYER_ARCHETYPES_DATA } from "../systems";
import {
  CombatState,
  PlayerArchetype,
  TrigramStance,
} from "../types";
import {
  applyDamage,
  applyStatusEffect,
  calculateCombatEffectiveness,
  canPlayerAct,
  createPlayerFromArchetype,
  getArchetypeBonuses,
  hasEnoughResources,
  updatePlayerState,
  updateStatusEffects,
  resetPlayerState,
  initializeBodyFacing,
} from "./playerUtils";
import type { PlayerState } from "../systems/player";

describe("playerUtils", () => {
  describe("createPlayerFromArchetype", () => {
    it("should create player with MUSA archetype", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

      expect(player.id).toBe("player_1");
      expect(player.archetype).toBe(PlayerArchetype.MUSA);
      expect(player.name.korean).toContain("무사");
      expect(player.health).toBeGreaterThan(0);
      expect(player.maxHealth).toBe(player.health);
      expect(player.currentStance).toBe(TrigramStance.GEON);
    });

    it("should create player with AMSALJA archetype", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      expect(player.id).toBe("player_2");
      expect(player.archetype).toBe(PlayerArchetype.AMSALJA);
      expect(player.name.korean).toContain("암살자");
      expect(player.currentStance).toBe(TrigramStance.SON);
    });

    it("should create player with HACKER archetype", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.HACKER, 0);

      expect(player.archetype).toBe(PlayerArchetype.HACKER);
      expect(player.name.korean).toContain("해커");
      expect(player.currentStance).toBe(TrigramStance.LI);
    });

    it("should create player with JEONGBO_YOWON archetype", () => {
      const player = createPlayerFromArchetype(
        PlayerArchetype.JEONGBO_YOWON,
        1
      );

      expect(player.archetype).toBe(PlayerArchetype.JEONGBO_YOWON);
      expect(player.name.korean).toContain("정보요원");
      expect(player.currentStance).toBe(TrigramStance.TAE);
    });

    it("should create player with JOJIK_POKRYEOKBAE archetype", () => {
      const player = createPlayerFromArchetype(
        PlayerArchetype.JOJIK_POKRYEOKBAE,
        0
      );

      expect(player.archetype).toBe(PlayerArchetype.JOJIK_POKRYEOKBAE);
      expect(player.name.korean).toContain("조직폭력배");
      expect(player.currentStance).toBe(TrigramStance.JIN);
    });

    it("should initialize player with correct position based on index", () => {
      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      expect(player1.position.x).toBe(300);
      expect(player2.position.x).toBe(500);
      expect(player1.position.y).toBe(400);
      expect(player2.position.y).toBe(400);
    });

    it("should initialize combat stats from archetype data", () => {
      const archetype = PlayerArchetype.MUSA;
      const player = createPlayerFromArchetype(archetype, 0);
      const archetypeData = PLAYER_ARCHETYPES_DATA[archetype];

      expect(player.attackPower).toBe(archetypeData.stats.attackPower);
      expect(player.defense).toBe(archetypeData.stats.defense);
      expect(player.speed).toBe(archetypeData.stats.speed);
      expect(player.technique).toBe(archetypeData.stats.technique);
    });

    it("should initialize with empty status effects and vital points", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

      expect(player.statusEffects).toEqual([]);
      expect(player.activeEffects).toEqual([]);
      expect(player.vitalPoints).toEqual([]);
    });

    it("should initialize match statistics to zero", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

      expect(player.totalDamageReceived).toBe(0);
      expect(player.totalDamageDealt).toBe(0);
      expect(player.hitsTaken).toBe(0);
      expect(player.hitsLanded).toBe(0);
      expect(player.perfectStrikes).toBe(0);
      expect(player.vitalPointHits).toBe(0);
    });

    it("should initialize combat state correctly", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

      expect(player.combatState).toBe(CombatState.IDLE);
      expect(player.isBlocking).toBe(false);
      expect(player.isStunned).toBe(false);
      expect(player.isCountering).toBe(false);
      expect(player.lastActionTime).toBe(0);
      expect(player.recoveryTime).toBe(0);
    });
  });

  describe("updatePlayerState", () => {
    let player: PlayerState;

    beforeEach(() => {
      player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    });

    it("should update single property", () => {
      const updated = updatePlayerState(player, { health: 50 });

      expect(updated.health).toBe(50);
      expect(updated.id).toBe(player.id);
      expect(updated.archetype).toBe(player.archetype);
    });

    it("should update multiple properties", () => {
      const updated = updatePlayerState(player, {
        health: 50,
        ki: 30,
        stamina: 40,
      });

      expect(updated.health).toBe(50);
      expect(updated.ki).toBe(30);
      expect(updated.stamina).toBe(40);
    });

    it("should clamp health to valid range", () => {
      const updated1 = updatePlayerState(player, { health: -10 });
      const updated2 = updatePlayerState(player, { health: 9999 });

      expect(updated1.health).toBe(0);
      expect(updated2.health).toBe(player.maxHealth);
    });

    it("should clamp ki to valid range", () => {
      const updated1 = updatePlayerState(player, { ki: -5 });
      const updated2 = updatePlayerState(player, { ki: 9999 });

      expect(updated1.ki).toBe(0);
      expect(updated2.ki).toBe(player.maxKi);
    });

    it("should clamp stamina to valid range", () => {
      const updated1 = updatePlayerState(player, { stamina: -5 });
      const updated2 = updatePlayerState(player, { stamina: 9999 });

      expect(updated1.stamina).toBe(0);
      expect(updated2.stamina).toBe(player.maxStamina);
    });

    it("should clamp consciousness to 0-100 range", () => {
      const updated1 = updatePlayerState(player, { consciousness: -10 });
      const updated2 = updatePlayerState(player, { consciousness: 150 });

      expect(updated1.consciousness).toBe(0);
      expect(updated2.consciousness).toBe(100);
    });

    it("should clamp balance to 0-100 range", () => {
      const updated1 = updatePlayerState(player, { balance: -10 });
      const updated2 = updatePlayerState(player, { balance: 150 });

      expect(updated1.balance).toBe(0);
      expect(updated2.balance).toBe(100);
    });

    it("should not affect unspecified properties", () => {
      const updated = updatePlayerState(player, { health: 50 });

      expect(updated.ki).toBe(player.ki);
      expect(updated.stamina).toBe(player.stamina);
      expect(updated.attackPower).toBe(player.attackPower);
    });
  });

  describe("applyDamage", () => {
    let player: PlayerState;

    beforeEach(() => {
      player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    });

    it("should reduce health by damage amount", () => {
      const result = applyDamage(player, 30);

      expect(result.health).toBe(player.health - 30);
      expect(result.totalDamageReceived).toBe(30);
      expect(result.hitsTaken).toBe(1);
    });

    it("should not reduce health below zero", () => {
      const result = applyDamage(player, 99999);

      expect(result.health).toBe(0);
      expect(result.consciousness).toBe(0);
    });

    it("should update combat state when knocked out", () => {
      const result = applyDamage(player, 99999);

      expect(result.combatState).toBe(CombatState.STUNNED);
      expect(result.consciousness).toBe(0);
    });

    it("should track cumulative damage", () => {
      let current = player;
      current = applyDamage(current, 10);
      current = applyDamage(current, 15);
      current = applyDamage(current, 20);

      expect(current.totalDamageReceived).toBe(45);
      expect(current.hitsTaken).toBe(3);
    });

    it("should maintain player state consistency", () => {
      const result = applyDamage(player, 20);

      expect(result.id).toBe(player.id);
      expect(result.archetype).toBe(player.archetype);
      expect(result.maxHealth).toBe(player.maxHealth);
    });
  });

  describe("canPlayerAct", () => {
    let player: PlayerState;

    beforeEach(() => {
      player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    });

    it("should return true for healthy player", () => {
      expect(canPlayerAct(player)).toBe(true);
    });

    it("should return false when health is zero", () => {
      const defeated = updatePlayerState(player, { health: 0 });

      expect(canPlayerAct(defeated)).toBe(false);
    });

    it("should return false when consciousness is zero", () => {
      const unconscious = updatePlayerState(player, { consciousness: 0 });

      expect(canPlayerAct(unconscious)).toBe(false);
    });

    it("should return false when stunned", () => {
      const stunned = updatePlayerState(player, { 
        isStunned: true,
        combatState: CombatState.STUNNED 
      });

      expect(canPlayerAct(stunned)).toBe(false);
    });

    it("should return true for damaged but capable player", () => {
      const damaged = applyDamage(player, 30);

      expect(canPlayerAct(damaged)).toBe(true);
    });
  });

  describe("hasEnoughResources", () => {
    let player: PlayerState;

    beforeEach(() => {
      player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    });

    it("should return true when player has sufficient resources", () => {
      expect(hasEnoughResources(player, 10, 15)).toBe(true);
    });

    it("should return false when ki is insufficient", () => {
      const lowKiPlayer = updatePlayerState(player, { ki: 5 });

      expect(hasEnoughResources(lowKiPlayer, 10, 15)).toBe(false);
    });

    it("should return false when stamina is insufficient", () => {
      const lowStaminaPlayer = updatePlayerState(player, { stamina: 5 });

      expect(hasEnoughResources(lowStaminaPlayer, 10, 15)).toBe(false);
    });

    it("should handle zero cost", () => {
      expect(hasEnoughResources(player, 0, 0)).toBe(true);
    });

    it("should handle exact resource amounts", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      
      expect(hasEnoughResources(player, player.ki, player.stamina)).toBe(true);
    });
  });

  describe("applyStatusEffect", () => {
    let player: PlayerState;

    beforeEach(() => {
      player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    });

    it("should add status effect to player", () => {
      const effect = {
        id: "stunned",
        type: "stun" as const,
        duration: 1000,
        intensity: 0.8,
        source: "technique",
        endTime: Date.now() + 1000,
        stackable: false,
      };

      const affected = applyStatusEffect(player, effect);

      expect(affected.statusEffects).toHaveLength(1);
      expect(affected.statusEffects[0].id).toBe("stunned");
      expect(affected.activeEffects).toContain("stun");
    });

    it("should handle multiple status effects", () => {
      const effect1 = {
        id: "stunned",
        type: "stun" as const,
        duration: 1000,
        intensity: 0.8,
        source: "technique",
        endTime: Date.now() + 1000,
        stackable: false,
      };
      const effect2 = {
        id: "bleeding",
        type: "bleeding" as const,
        duration: 2000,
        intensity: 0.5,
        source: "vital_point",
        endTime: Date.now() + 2000,
        stackable: true,
      };

      let affected = player;
      affected = applyStatusEffect(affected, effect1);
      affected = applyStatusEffect(affected, effect2);

      expect(affected.statusEffects).toHaveLength(2);
      expect(affected.activeEffects).toHaveLength(2);
    });

    it("should replace non-stackable effects of same type", () => {
      const effect1 = {
        id: "stunned",
        type: "stun" as const,
        duration: 1000,
        intensity: 0.8,
        source: "technique",
        endTime: Date.now() + 1000,
        stackable: false,
      };
      const effect2 = {
        id: "stunned_longer",
        type: "stun" as const,
        duration: 2000,
        intensity: 0.9,
        source: "technique",
        endTime: Date.now() + 2000,
        stackable: false,
      };

      let affected = applyStatusEffect(player, effect1);
      affected = applyStatusEffect(affected, effect2);

      expect(affected.statusEffects).toHaveLength(1);
      expect(affected.statusEffects[0].intensity).toBe(0.9);
    });
  });

  describe("calculateCombatEffectiveness", () => {
    it("should return 1.0 for fully healthy player", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

      const effectiveness = calculateCombatEffectiveness(player);

      expect(effectiveness).toBe(1.0);
    });

    it("should return lower value for damaged player", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const damaged = applyDamage(player, 50);

      const effectiveness = calculateCombatEffectiveness(damaged);

      expect(effectiveness).toBeLessThan(1.0);
      expect(effectiveness).toBeGreaterThan(0);
    });

    it("should consider all factors in calculation", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const weakened = updatePlayerState(player, {
        health: player.maxHealth * 0.5,
        stamina: player.maxStamina * 0.5,
        consciousness: 50,
        balance: 50,
      });

      const effectiveness = calculateCombatEffectiveness(weakened);

      expect(effectiveness).toBeCloseTo(0.5, 1);
    });

    it("should return low value for critically injured player", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const critical = updatePlayerState(player, {
        health: player.maxHealth * 0.1,
        stamina: player.maxStamina * 0.1,
        consciousness: 10,
        balance: 10,
      });

      const effectiveness = calculateCombatEffectiveness(critical);

      expect(effectiveness).toBeLessThan(0.2);
    });
  });

  describe("updateStatusEffects", () => {
    it("should remove expired effects", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const currentTime = Date.now();
      const expiredEffect = {
        id: "expired",
        type: "stun" as const,
        duration: 1000,
        intensity: 0.8,
        source: "technique",
        endTime: currentTime - 1000, // Already expired
        stackable: false,
      };

      let affected = applyStatusEffect(player, expiredEffect);
      affected = updateStatusEffects(affected, currentTime);

      expect(affected.statusEffects).toHaveLength(0);
    });

    it("should keep active effects", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const currentTime = Date.now();
      const activeEffect = {
        id: "active",
        type: "stun" as const,
        duration: 1000,
        intensity: 0.8,
        source: "technique",
        endTime: currentTime + 5000, // Still active
        stackable: false,
      };

      let affected = applyStatusEffect(player, activeEffect);
      affected = updateStatusEffects(affected, currentTime);

      expect(affected.statusEffects).toHaveLength(1);
    });
  });

  describe("getArchetypeBonuses", () => {
    it("should return bonuses for MUSA archetype", () => {
      const bonuses = getArchetypeBonuses(PlayerArchetype.MUSA);

      expect(bonuses.attackBonus).toBeGreaterThan(0);
      expect(bonuses.defenseBonus).toBeGreaterThan(0);
      expect(bonuses.speedBonus).toBeGreaterThan(0);
      expect(bonuses.techniqueBonus).toBeGreaterThan(0);
    });

    it("should return different bonuses for different archetypes", () => {
      const musaBonuses = getArchetypeBonuses(PlayerArchetype.MUSA);
      const amsaljaBonuses = getArchetypeBonuses(PlayerArchetype.AMSALJA);

      // At least one bonus should be different
      const isDifferent =
        musaBonuses.attackBonus !== amsaljaBonuses.attackBonus ||
        musaBonuses.defenseBonus !== amsaljaBonuses.defenseBonus ||
        musaBonuses.speedBonus !== amsaljaBonuses.speedBonus ||
        musaBonuses.techniqueBonus !== amsaljaBonuses.techniqueBonus;

      expect(isDifferent).toBe(true);
    });
  });

  describe("resetPlayerState", () => {
    it("should create fresh player state", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      // Apply damage to verify reset works
      const damaged = applyDamage(player, 50);
      expect(damaged.health).toBe(player.maxHealth - 50);
      expect(damaged.totalDamageReceived).toBe(50);
      
      const reset = resetPlayerState(PlayerArchetype.MUSA, 0);

      expect(reset.health).toBe(reset.maxHealth);
      expect(reset.totalDamageReceived).toBe(0);
      expect(reset.statusEffects).toHaveLength(0);
    });

    it("should match createPlayerFromArchetype", () => {
      const created = createPlayerFromArchetype(PlayerArchetype.HACKER, 1);
      const reset = resetPlayerState(PlayerArchetype.HACKER, 1);

      expect(reset.health).toBe(created.health);
      expect(reset.archetype).toBe(created.archetype);
      expect(reset.currentStance).toBe(created.currentStance);
    });
  });

  describe("Korean martial arts integration", () => {
    it("should preserve Korean names through operations", () => {
      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const damaged = applyDamage(player, 20);

      expect(damaged.name.korean).toContain("무사");
      expect(damaged.name.english).toContain("Warrior");
    });

    it("should maintain archetype-specific stances", () => {
      const musa = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const amsalja = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      expect(musa.currentStance).toBe(TrigramStance.GEON);
      expect(amsalja.currentStance).toBe(TrigramStance.SON);
    });

    it("should reflect archetype combat characteristics", () => {
      const musa = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const hacker = createPlayerFromArchetype(PlayerArchetype.HACKER, 1);

      // MUSA should have different stats than HACKER
      expect(musa.attackPower).not.toBe(hacker.attackPower);
    });
  });

  describe("initializeBodyFacing", () => {
    it("should calculate correct initial facing angle toward opponent", () => {
      const playerPos = { x: 0, y: 0 };
      const opponentPos = { x: 10, y: 0 };
      
      const bodyFacing = initializeBodyFacing(playerPos, opponentPos);
      
      // Facing right (0 degrees for +X axis)
      expect(bodyFacing.currentAngle).toBeCloseTo(0, 1);
      expect(bodyFacing.targetAngle).toBeCloseTo(0, 1);
    });

    it("should initialize with default rotation speed", () => {
      const playerPos = { x: 0, y: 0 };
      const opponentPos = { x: 5, y: 5 };
      
      const bodyFacing = initializeBodyFacing(playerPos, opponentPos);
      
      expect(bodyFacing.rotationSpeed).toBe(45); // Default 45°/sec
    });

    it("should initialize with unlocked state", () => {
      const playerPos = { x: 0, y: 0 };
      const opponentPos = { x: 0, y: 10 };
      
      const bodyFacing = initializeBodyFacing(playerPos, opponentPos);
      
      expect(bodyFacing.isLocked).toBe(false);
      expect(bodyFacing.isTurning).toBe(false);
    });

    it("should initialize with zero head offset", () => {
      const playerPos = { x: 100, y: 100 };
      const opponentPos = { x: 200, y: 200 };
      
      const bodyFacing = initializeBodyFacing(playerPos, opponentPos);
      
      expect(bodyFacing.headAngleOffset).toBe(0);
    });

    it("should handle different opponent positions", () => {
      const playerPos = { x: 300, y: 400 };
      
      // Test facing opponent to the right
      const facingRight = initializeBodyFacing(playerPos, { x: 500, y: 400 });
      expect(facingRight.currentAngle).toBeCloseTo(0, 1);
      
      // Test facing opponent below (positive Y is down in top-down 2D)
      const facingDown = initializeBodyFacing(playerPos, { x: 300, y: 600 });
      expect(facingDown.currentAngle).toBeCloseTo(90, 1);
      
      // Test facing opponent to the left
      const facingLeft = initializeBodyFacing(playerPos, { x: 100, y: 400 });
      expect(Math.abs(facingLeft.currentAngle - 180)).toBeLessThan(1);
      
      // Test facing opponent above
      const facingUp = initializeBodyFacing(playerPos, { x: 300, y: 200 });
      expect(facingUp.currentAngle).toBeCloseTo(270, 1);
    });

    it("should return BodyFacing with all required properties", () => {
      const playerPos = { x: 0, y: 0 };
      const opponentPos = { x: 1, y: 1 };
      
      const bodyFacing = initializeBodyFacing(playerPos, opponentPos);
      
      expect(bodyFacing).toHaveProperty("currentAngle");
      expect(bodyFacing).toHaveProperty("targetAngle");
      expect(bodyFacing).toHaveProperty("rotationSpeed");
      expect(bodyFacing).toHaveProperty("headAngleOffset");
      expect(bodyFacing).toHaveProperty("isLocked");
      expect(bodyFacing).toHaveProperty("isTurning");
    });
  });
});
