/**
 * Unit tests for Speed Modifier System
 * 
 * **Korean**: 속도 변경 시스템 테스트
 * 
 * Tests comprehensive speed modifier calculations including stance modifiers,
 * injury penalties, stamina effects, and combat state adjustments.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SpeedModifierSystem, MovementType } from './SpeedModifierSystem';
import { TrigramStance, CombatState } from '@/types/common';
import type { PlayerState } from '@/systems/player';

describe('SpeedModifierSystem', () => {
  let system: SpeedModifierSystem;
  let basePlayerState: PlayerState;

  beforeEach(() => {
    system = new SpeedModifierSystem();
    
    // Create base player state for testing
    basePlayerState = {
      id: 'test-player',
      name: { korean: '테스트', english: 'Test' },
      archetype: 'musa' as any,
      
      // Resources
      health: 100,
      maxHealth: 100,
      ki: 100,
      maxKi: 100,
      stamina: 100,
      maxStamina: 100,
      energy: 100,
      maxEnergy: 100,
      
      // Body part health (all at full health initially)
      bodyPartHealth: {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      },
      bodyPartMaxHealth: {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      },
      
      // Combat attributes
      attackPower: 10,
      defense: 10,
      speed: 10,
      technique: 10,
      pain: 0,
      consciousness: 100,
      balance: 100,
      momentum: 0,
      
      // Combat state
      currentStance: TrigramStance.GEON,
      combatState: CombatState.IDLE,
      position: { x: 0, y: 0 },
      isBlocking: false,
      isStunned: false,
      isCountering: false,
      lastActionTime: 0,
      recoveryTime: 0,
      lastStanceChangeTime: 0,
      
      // Effects and vital points
      statusEffects: [],
      activeEffects: [],
      vitalPoints: [],
      
      // Statistics
      totalDamageReceived: 0,
      totalDamageDealt: 0,
      hitsTaken: 0,
      hitsLanded: 0,
      perfectStrikes: 0,
      vitalPointHits: 0,
    };
  });

  describe('Base Speed Calculations', () => {
    it('should calculate correct walking speed', () => {
      const modifiers = system.calculateSpeedModifiers(
        basePlayerState,
        MovementType.WALKING,
        false
      );

      expect(modifiers.baseSpeed).toBe(2.0); // BASE_WALKING_SPEED
    });

    it('should calculate correct running speed', () => {
      const modifiers = system.calculateSpeedModifiers(
        basePlayerState,
        MovementType.RUNNING,
        false
      );

      expect(modifiers.baseSpeed).toBe(4.0); // BASE_RUNNING_SPEED
    });

    it('should calculate correct backward speed (75% of walking)', () => {
      const modifiers = system.calculateSpeedModifiers(
        basePlayerState,
        MovementType.BACKWARD,
        false
      );

      expect(modifiers.baseSpeed).toBe(1.5); // 2.0 * 0.75
    });

    it('should calculate correct lateral speed', () => {
      const modifiers = system.calculateSpeedModifiers(
        basePlayerState,
        MovementType.LATERAL,
        false
      );

      expect(modifiers.baseSpeed).toBe(1.8); // LATERAL_SPEED
    });

    it('should calculate correct crouching speed', () => {
      const modifiers = system.calculateSpeedModifiers(
        basePlayerState,
        MovementType.WALKING,
        true // isCrouching
      );

      expect(modifiers.baseSpeed).toBe(1.0); // CROUCHING_SPEED
    });

    it('should override movement type when crouching', () => {
      const modifiers = system.calculateSpeedModifiers(
        basePlayerState,
        MovementType.RUNNING,
        true // isCrouching overrides running
      );

      expect(modifiers.baseSpeed).toBe(1.0); // CROUCHING_SPEED
    });
  });

  describe('Stance Speed Modifiers', () => {
    it('should apply Geon (Heaven) stance modifier (100%)', () => {
      const modifiers = system.calculateSpeedModifiers(
        { ...basePlayerState, currentStance: TrigramStance.GEON },
        MovementType.WALKING
      );

      expect(modifiers.stanceModifier).toBe(1.00);
      expect(modifiers.finalSpeed).toBe(2.0); // 2.0 * 1.00
    });

    it('should apply Tae (Lake) stance modifier (110%)', () => {
      const modifiers = system.calculateSpeedModifiers(
        { ...basePlayerState, currentStance: TrigramStance.TAE },
        MovementType.WALKING
      );

      expect(modifiers.stanceModifier).toBe(1.10);
      expect(modifiers.finalSpeed).toBe(2.2); // 2.0 * 1.10
    });

    it('should apply Li (Fire) stance modifier (120%)', () => {
      const modifiers = system.calculateSpeedModifiers(
        { ...basePlayerState, currentStance: TrigramStance.LI },
        MovementType.WALKING
      );

      expect(modifiers.stanceModifier).toBe(1.20);
      expect(modifiers.finalSpeed).toBe(2.4); // 2.0 * 1.20
    });

    it('should apply Jin (Thunder) stance modifier (115%)', () => {
      const modifiers = system.calculateSpeedModifiers(
        { ...basePlayerState, currentStance: TrigramStance.JIN },
        MovementType.WALKING
      );

      expect(modifiers.stanceModifier).toBe(1.15);
      expect(modifiers.finalSpeed).toBe(2.3); // 2.0 * 1.15
    });

    it('should apply Son (Wind) stance modifier (125% - fastest)', () => {
      const modifiers = system.calculateSpeedModifiers(
        { ...basePlayerState, currentStance: TrigramStance.SON },
        MovementType.WALKING
      );

      expect(modifiers.stanceModifier).toBe(1.25);
      expect(modifiers.finalSpeed).toBe(2.5); // 2.0 * 1.25
    });

    it('should apply Gam (Water) stance modifier (105%)', () => {
      const modifiers = system.calculateSpeedModifiers(
        { ...basePlayerState, currentStance: TrigramStance.GAM },
        MovementType.WALKING
      );

      expect(modifiers.stanceModifier).toBe(1.05);
      expect(modifiers.finalSpeed).toBe(2.1); // 2.0 * 1.05
    });

    it('should apply Gan (Mountain) stance modifier (80% - defensive)', () => {
      const modifiers = system.calculateSpeedModifiers(
        { ...basePlayerState, currentStance: TrigramStance.GAN },
        MovementType.WALKING
      );

      expect(modifiers.stanceModifier).toBe(0.80);
      expect(modifiers.finalSpeed).toBe(1.6); // 2.0 * 0.80
    });

    it('should apply Gon (Earth) stance modifier (85%)', () => {
      const modifiers = system.calculateSpeedModifiers(
        { ...basePlayerState, currentStance: TrigramStance.GON },
        MovementType.WALKING
      );

      expect(modifiers.stanceModifier).toBe(0.85);
      expect(modifiers.finalSpeed).toBe(1.7); // 2.0 * 0.85
    });
  });

  describe('Injury Penalty Calculations', () => {
    it('should have no penalty with healthy legs (100% health)', () => {
      const modifiers = system.calculateSpeedModifiers(
        basePlayerState,
        MovementType.WALKING
      );

      expect(modifiers.injuryPenalty).toBe(0.0);
      expect(modifiers.finalSpeed).toBe(2.0);
    });

    it('should apply light penalty with light leg damage (20% damage)', () => {
      const injuredState = {
        ...basePlayerState,
        bodyPartHealth: {
          ...basePlayerState.bodyPartHealth!,
          legLeft: 80, // 20% damage -> 80% health (above 70% threshold = NORMAL)
          legRight: 80,
        },
      };

      const modifiers = system.calculateSpeedModifiers(
        injuredState,
        MovementType.WALKING
      );

      // 80% health is above 70% threshold, so no penalty (NORMAL state)
      expect(modifiers.injuryPenalty).toBe(0.0);
    });

    it('should apply moderate penalty with moderate leg damage (50% damage)', () => {
      const injuredState = {
        ...basePlayerState,
        bodyPartHealth: {
          ...basePlayerState.bodyPartHealth!,
          legLeft: 50, // 50% damage -> 50% health (at LIMPING threshold)
          legRight: 50,
        },
      };

      const modifiers = system.calculateSpeedModifiers(
        injuredState,
        MovementType.WALKING
      );

      // 50% health triggers LIMPING state (0.8 multiplier = 0.2 penalty)
      expect(modifiers.injuryPenalty).toBeCloseTo(0.2, 2);
    });

    it('should apply heavy penalty with heavy leg damage (80% damage)', () => {
      const injuredState = {
        ...basePlayerState,
        bodyPartHealth: {
          ...basePlayerState.bodyPartHealth!,
          legLeft: 20, // 80% damage
          legRight: 20,
        },
      };

      const modifiers = system.calculateSpeedModifiers(
        injuredState,
        MovementType.WALKING
      );

      // Heavy damage should apply significant penalty
      expect(modifiers.injuryPenalty).toBeGreaterThan(0.40);
    });

    it('should apply maximum penalty with critical leg damage (95% damage)', () => {
      const injuredState = {
        ...basePlayerState,
        bodyPartHealth: {
          ...basePlayerState.bodyPartHealth!,
          legLeft: 5, // 95% damage -> 5% health (HOBBLED state)
          legRight: 5,
        },
      };

      const modifiers = system.calculateSpeedModifiers(
        injuredState,
        MovementType.WALKING
      );

      // 5% health triggers HOBBLED state (0.4 multiplier = 0.6 penalty, clamped to 0.6)
      expect(modifiers.injuryPenalty).toBeCloseTo(0.6, 2);
    });

    it('should use average leg damage (both legs considered)', () => {
      const asymmetricInjury = {
        ...basePlayerState,
        bodyPartHealth: {
          ...basePlayerState.bodyPartHealth!,
          legLeft: 100, // Healthy (100%)
          legRight: 20,  // 20% health
        },
      };

      const modifiers = system.calculateSpeedModifiers(
        asymmetricInjury,
        MovementType.WALKING
      );

      // MovementPenaltySystem uses average: (100 + 20) / 2 = 60% -> LIMPING state
      // LIMPING = 0.8 multiplier = 0.2 penalty
      expect(modifiers.injuryPenalty).toBeCloseTo(0.2, 2);
    });

    it('should handle missing body part health gracefully', () => {
      const noBodyPartHealth = {
        ...basePlayerState,
        bodyPartHealth: undefined,
        bodyPartMaxHealth: undefined,
      };

      const modifiers = system.calculateSpeedModifiers(
        noBodyPartHealth,
        MovementType.WALKING
      );

      expect(modifiers.injuryPenalty).toBe(0.0);
      expect(modifiers.finalSpeed).toBe(2.0);
    });
  });

  describe('Stamina Penalty Calculations', () => {
    it('should have no penalty with high stamina (100%)', () => {
      const modifiers = system.calculateSpeedModifiers(
        basePlayerState,
        MovementType.WALKING
      );

      expect(modifiers.staminaPenalty).toBe(0.0);
      expect(modifiers.finalAcceleration).toBe(4.0);
      expect(modifiers.canRun).toBe(true);
    });

    it('should have no penalty with high stamina (75%)', () => {
      const highStamina = { ...basePlayerState, stamina: 75 };

      const modifiers = system.calculateSpeedModifiers(
        highStamina,
        MovementType.WALKING
      );

      expect(modifiers.staminaPenalty).toBe(0.0);
      expect(modifiers.finalAcceleration).toBe(4.0);
      expect(modifiers.canRun).toBe(true);
    });

    it('should apply 20% penalty with medium stamina (50%)', () => {
      const mediumStamina = { ...basePlayerState, stamina: 50 };

      const modifiers = system.calculateSpeedModifiers(
        mediumStamina,
        MovementType.WALKING
      );

      expect(modifiers.staminaPenalty).toBe(0.20);
      expect(modifiers.finalAcceleration).toBe(3.2); // 4.0 * (1 - 0.20)
      expect(modifiers.canRun).toBe(true);
    });

    it('should apply 50% penalty with low stamina (25%)', () => {
      const lowStamina = { ...basePlayerState, stamina: 25 };

      const modifiers = system.calculateSpeedModifiers(
        lowStamina,
        MovementType.WALKING
      );

      expect(modifiers.staminaPenalty).toBe(0.50);
      expect(modifiers.finalAcceleration).toBe(2.0); // 4.0 * (1 - 0.50)
      expect(modifiers.canRun).toBe(true);
    });

    it('should apply 75% penalty with depleted stamina (5%)', () => {
      const depletedStamina = { ...basePlayerState, stamina: 5 };

      const modifiers = system.calculateSpeedModifiers(
        depletedStamina,
        MovementType.WALKING
      );

      expect(modifiers.staminaPenalty).toBe(0.75);
      expect(modifiers.finalAcceleration).toBe(1.0); // 4.0 * (1 - 0.75)
      expect(modifiers.canRun).toBe(false); // Cannot run below 10%
    });

    it('should prevent running when stamina below 10%', () => {
      const veryLowStamina = { ...basePlayerState, stamina: 8 };

      const modifiers = system.calculateSpeedModifiers(
        veryLowStamina,
        MovementType.WALKING
      );

      expect(modifiers.canRun).toBe(false);
    });

    it('should allow running at exactly 10% stamina', () => {
      const minRunStamina = { ...basePlayerState, stamina: 10 };

      const modifiers = system.calculateSpeedModifiers(
        minRunStamina,
        MovementType.WALKING
      );

      expect(modifiers.canRun).toBe(true);
    });
  });

  describe('Combat State Penalties', () => {
    it('should have no penalty when idle', () => {
      const modifiers = system.calculateSpeedModifiers(
        { ...basePlayerState, combatState: CombatState.IDLE },
        MovementType.WALKING
      );

      expect(modifiers.combatStatePenalty).toBe(0.0);
      expect(modifiers.finalSpeed).toBe(2.0);
    });

    it('should apply 30% penalty when attacking', () => {
      const attacking = { ...basePlayerState, combatState: CombatState.ATTACKING };

      const modifiers = system.calculateSpeedModifiers(
        attacking,
        MovementType.WALKING
      );

      expect(modifiers.combatStatePenalty).toBe(0.30);
      expect(modifiers.finalSpeed).toBe(1.4); // 2.0 * (1 - 0.30)
    });

    it('should apply 20% penalty when defending', () => {
      const defending = { ...basePlayerState, combatState: CombatState.DEFENDING };

      const modifiers = system.calculateSpeedModifiers(
        defending,
        MovementType.WALKING
      );

      expect(modifiers.combatStatePenalty).toBe(0.20);
      expect(modifiers.finalSpeed).toBe(1.6); // 2.0 * (1 - 0.20)
    });

    it('should apply 100% penalty when stunned (cannot move)', () => {
      const stunned = { ...basePlayerState, combatState: CombatState.STUNNED };

      const modifiers = system.calculateSpeedModifiers(
        stunned,
        MovementType.WALKING
      );

      expect(modifiers.combatStatePenalty).toBe(1.0);
      expect(modifiers.finalSpeed).toBe(0.0); // 2.0 * (1 - 1.0)
    });

    it('should apply 40% penalty when recovering', () => {
      const recovering = { ...basePlayerState, combatState: CombatState.RECOVERING };

      const modifiers = system.calculateSpeedModifiers(
        recovering,
        MovementType.WALKING
      );

      expect(modifiers.combatStatePenalty).toBe(0.40);
      expect(modifiers.finalSpeed).toBe(1.2); // 2.0 * (1 - 0.40)
    });
  });

  describe('Modifier Stacking', () => {
    it('should stack stance modifier and injury penalty multiplicatively', () => {
      const stackedModifiers = {
        ...basePlayerState,
        currentStance: TrigramStance.SON, // 125% speed
        bodyPartHealth: {
          ...basePlayerState.bodyPartHealth!,
          legLeft: 50, // ~50% health
          legRight: 50,
        },
      };

      const modifiers = system.calculateSpeedModifiers(
        stackedModifiers,
        MovementType.WALKING
      );

      // Expected: 2.0 * 1.25 * (1 - injuryPenalty)
      // With moderate injury, should be significantly reduced from 2.5
      expect(modifiers.finalSpeed).toBeGreaterThan(1.0);
      expect(modifiers.finalSpeed).toBeLessThan(2.5);
    });

    it('should combine all penalties in complex scenario', () => {
      const complexScenario = {
        ...basePlayerState,
        currentStance: TrigramStance.GAN, // 80% speed (defensive)
        combatState: CombatState.ATTACKING, // -30% penalty
        stamina: 30, // Low stamina (50% accel penalty)
        bodyPartHealth: {
          ...basePlayerState.bodyPartHealth!,
          legLeft: 40, // Moderate injury
          legRight: 40,
        },
      };

      const modifiers = system.calculateSpeedModifiers(
        complexScenario,
        MovementType.WALKING
      );

      // Expected speed: 2.0 * 0.80 * (1 - injury) * (1 - 0.30)
      expect(modifiers.stanceModifier).toBe(0.80);
      expect(modifiers.combatStatePenalty).toBe(0.30);
      expect(modifiers.injuryPenalty).toBeGreaterThan(0.0);
      
      // Final speed should be significantly reduced
      expect(modifiers.finalSpeed).toBeLessThan(1.2);
      
      // Acceleration should have stamina penalty
      expect(modifiers.staminaPenalty).toBe(0.50);
      expect(modifiers.finalAcceleration).toBe(2.0); // 4.0 * (1 - 0.50)
    });

    it('should result in minimal speed with all negative factors', () => {
      const worstCase = {
        ...basePlayerState,
        currentStance: TrigramStance.GAN, // 80% (slowest practical)
        combatState: CombatState.RECOVERING, // -40%
        stamina: 5, // Depleted (-75% accel)
        bodyPartHealth: {
          ...basePlayerState.bodyPartHealth!,
          legLeft: 10, // Critical injury
          legRight: 10,
        },
      };

      const modifiers = system.calculateSpeedModifiers(
        worstCase,
        MovementType.WALKING
      );

      // Should be very slow but not zero (not stunned)
      expect(modifiers.finalSpeed).toBeGreaterThan(0.0);
      expect(modifiers.finalSpeed).toBeLessThan(0.5);
      expect(modifiers.canRun).toBe(false);
    });

    it('should result in zero speed when stunned regardless of other factors', () => {
      const stunnedWithGoodCondition = {
        ...basePlayerState,
        currentStance: TrigramStance.SON, // Fast stance
        combatState: CombatState.STUNNED, // Stunned
        stamina: 100, // Full stamina
        // Healthy legs
      };

      const modifiers = system.calculateSpeedModifiers(
        stunnedWithGoodCondition,
        MovementType.WALKING
      );

      expect(modifiers.finalSpeed).toBe(0.0); // Cannot move when stunned
    });
  });

  describe('Apply Speed Modifiers', () => {
    it('should apply modifiers to movement physics interface', () => {
      let appliedSpeed = 0;
      let appliedAccel = 0;

      const mockPhysics = {
        setMaxSpeed: (speed: number) => { appliedSpeed = speed; },
        setAcceleration: (accel: number) => { appliedAccel = accel; },
      };

      const modifiers = system.calculateSpeedModifiers(
        basePlayerState,
        MovementType.RUNNING
      );

      system.applySpeedModifiers(mockPhysics, modifiers);

      expect(appliedSpeed).toBe(modifiers.finalSpeed);
      expect(appliedAccel).toBe(modifiers.finalAcceleration);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero max stamina', () => {
      const zeroMaxStamina = {
        ...basePlayerState,
        stamina: 0,
        maxStamina: 0,
      };

      const modifiers = system.calculateSpeedModifiers(
        zeroMaxStamina,
        MovementType.WALKING
      );

      expect(modifiers.staminaPenalty).toBe(0.0);
      expect(modifiers.canRun).toBe(true); // Allow running if stamina not tracked
    });

    it('should handle negative stamina values', () => {
      const negativeStamina = {
        ...basePlayerState,
        stamina: -10,
        maxStamina: 100,
      };

      const modifiers = system.calculateSpeedModifiers(
        negativeStamina,
        MovementType.WALKING
      );

      // Should treat as depleted stamina
      expect(modifiers.staminaPenalty).toBeGreaterThan(0.0);
      expect(modifiers.canRun).toBe(false);
    });

    it('should handle stamina exceeding maximum', () => {
      const excessStamina = {
        ...basePlayerState,
        stamina: 150,
        maxStamina: 100,
      };

      const modifiers = system.calculateSpeedModifiers(
        excessStamina,
        MovementType.WALKING
      );

      // Should treat as high stamina
      expect(modifiers.staminaPenalty).toBe(0.0);
      expect(modifiers.canRun).toBe(true);
    });
  });
});
