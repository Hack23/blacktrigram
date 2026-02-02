/**
 * Gon Technique Integration Tests
 * 
 * Tests the integration of ExtendedGonTechnique metadata with combat systems:
 * - DamageCalculator.calculateThrowImpactDamage() using groundImpactMultiplier
 * - DamageCalculator.calculateEarthHealing() using supportiveHealing
 * - GrappleSystem.getTechniqueControlDuration() using controlDuration
 * - GrappleSystem.applyPostThrowAdvantage() using controlDuration
 * 
 * @module GonTechniqueIntegration.test
 * @korean 곤괘기술통합테스트
 */

import { describe, it, expect } from 'vitest';
import { DamageCalculator } from '../vitalpoint/DamageCalculator';
import { GrappleSystem } from './GrappleSystem';
import type { ExtendedGonTechnique } from '../trigram/types/GonTechniqueExtensions';
import type { KoreanTechnique } from '../vitalpoint/types';
import { CombatAttackType, DamageType, TrigramStance } from '../../types/common';
import { AnimationType } from '../animation';

describe('Gon Technique Integration', () => {
  // ============= Mock Gon Technique =============
  const mockSsireumThrow: ExtendedGonTechnique = {
    id: 'gon_ssireum_throw',
    name: {
      korean: '씨름던지기',
      english: 'Ssireum Throw',
      romanized: 'Ssireum Deonjigi',
    },
    koreanName: '씨름던지기',
    englishName: 'Ssireum Throw',
    romanized: 'Ssireum Deonjigi',
    description: {
      korean: '전통 씨름 던지기 기술',
      english: 'Traditional Ssireum throwing technique',
    },
    stance: TrigramStance.GON,
    type: CombatAttackType.THROW,
    damageType: DamageType.BLUNT,
    damage: 45,
    kiCost: 20,
    staminaCost: 30,
    accuracy: 0.75,
    reachConfig: {
      bodyPart: 'arm',
      techniqueType: 'punch',
      baseExtension: 0.9,
    },
    executionTime: 1100,
    recoveryTime: 1600,
    critChance: 0.12,
    critMultiplier: 1.6,
    effects: [],
    animationCategory: 'throw',
    animationId: 'gon_ssireum_throw',
    animationType: AnimationType.GON_SSIREUM_THROW,
    animationSpeed: 1.0,
    category: 'heavy',
    range: 'short',
    speed: 0.9,

    // ============= GON ENHANCEMENTS =============
    throwTrajectory: 'arc_over_hip',
    groundImpactMultiplier: 1.7, // High impact from rotational velocity
    controlDuration: 1800, // Strong post-throw position
    supportiveHealing: 5, // Maximum earth connection
    earthCrackEffect: true,
    traditionalBonus: 1.15,
  };

  // ============= Mock Non-Gon Technique =============
  const mockStrike: KoreanTechnique = {
    id: 'geon_straight_punch',
    name: {
      korean: '정권지르기',
      english: 'Straight Punch',
      romanized: 'Jeonggwon Jireugi',
    },
    koreanName: '정권지르기',
    englishName: 'Straight Punch',
    romanized: 'Jeonggwon Jireugi',
    description: {
      korean: '직선 펀치',
      english: 'Direct straight punch',
    },
    stance: TrigramStance.GEON,
    type: CombatAttackType.STRIKE,
    damageType: DamageType.BLUNT,
    damage: 25,
    kiCost: 10,
    staminaCost: 15,
    accuracy: 0.85,
    reachConfig: {
      bodyPart: 'arm',
      techniqueType: 'punch',
      baseExtension: 1.0,
    },
    executionTime: 400,
    recoveryTime: 600,
    critChance: 0.15,
    critMultiplier: 1.8,
    effects: [],
    animationCategory: 'strike',
    animationId: 'geon_straight_punch',
    animationType: AnimationType.STRIKE,
    animationSpeed: 1.2,
    category: 'light',
    range: 'medium',
    speed: 1.2,
  };

  describe('DamageCalculator.calculateThrowImpactDamage', () => {
    it('should apply groundImpactMultiplier for Gon techniques', () => {
      const baseDamage = 50;
      const attackerStrength = 50; // Baseline

      const result = DamageCalculator.calculateThrowImpactDamage(
        mockSsireumThrow,
        baseDamage,
        attackerStrength
      );

      // Expected: 50 × 1.7 × 1.0 (strength modifier) = 85 (±5% variance)
      expect(result.damage).toBeGreaterThan(80);
      expect(result.damage).toBeLessThan(90);
      expect(result.isCritical).toBe(true); // High impact = critical
      expect(result.isVitalPoint).toBe(false);
      expect(result.effects).toEqual([]);
    });

    it('should scale with attacker strength', () => {
      const baseDamage = 50;
      const weakStrength = 25;
      const strongStrength = 100;

      const weakResult = DamageCalculator.calculateThrowImpactDamage(
        mockSsireumThrow,
        baseDamage,
        weakStrength
      );

      const strongResult = DamageCalculator.calculateThrowImpactDamage(
        mockSsireumThrow,
        baseDamage,
        strongStrength
      );

      // Stronger attackers should deal more damage
      expect(strongResult.damage).toBeGreaterThan(weakResult.damage);
    });

    it('should return base damage for non-Gon techniques', () => {
      const baseDamage = 50;
      const attackerStrength = 50;

      const result = DamageCalculator.calculateThrowImpactDamage(
        mockStrike,
        baseDamage,
        attackerStrength
      );

      // Non-Gon technique: return base damage unchanged
      expect(result.damage).toBe(baseDamage);
      expect(result.isCritical).toBe(false);
      expect(result.isVitalPoint).toBe(false);
    });

    it('should enforce minimum damage of 1', () => {
      const baseDamage = 0;
      const attackerStrength = 10;

      const result = DamageCalculator.calculateThrowImpactDamage(
        mockSsireumThrow,
        baseDamage,
        attackerStrength
      );

      expect(result.damage).toBeGreaterThanOrEqual(1);
    });
  });

  describe('DamageCalculator.calculateEarthHealing', () => {
    it('should calculate healing from supportiveHealing field', () => {
      const earthAffinity = 0; // No bonus

      const healing = DamageCalculator.calculateEarthHealing(
        mockSsireumThrow,
        earthAffinity
      );

      // Base healing = 5
      expect(healing).toBe(5);
    });

    it('should scale with earth affinity bonus', () => {
      const earthAffinity = 0.3; // 30% bonus

      const healing = DamageCalculator.calculateEarthHealing(
        mockSsireumThrow,
        earthAffinity
      );

      // 5 × 1.3 = 6.5 → 6 (floored)
      expect(healing).toBe(6);
    });

    it('should cap earth affinity bonus at 100%', () => {
      const earthAffinity = 2.0; // 200% (should be capped)

      const healing = DamageCalculator.calculateEarthHealing(
        mockSsireumThrow,
        earthAffinity
      );

      // 5 × 2.0 = 10 (capped at 100% bonus)
      expect(healing).toBe(10);
    });

    it('should return 0 for non-Gon techniques', () => {
      const earthAffinity = 0.5;

      const healing = DamageCalculator.calculateEarthHealing(
        mockStrike,
        earthAffinity
      );

      // Non-Gon technique: no earth healing
      expect(healing).toBe(0);
    });

    it('should handle negative earth affinity gracefully', () => {
      const earthAffinity = -0.5; // Negative (should be clamped to 0)

      const healing = DamageCalculator.calculateEarthHealing(
        mockSsireumThrow,
        earthAffinity
      );

      // Should not reduce healing below base value
      expect(healing).toBe(5);
    });
  });

  describe('GrappleSystem.getTechniqueControlDuration', () => {
    const grappleSystem = new GrappleSystem();

    it('should return controlDuration from Gon technique metadata', () => {
      const duration = grappleSystem.getTechniqueControlDuration(
        mockSsireumThrow
      );

      // Ssireum throw has 1800ms control duration
      expect(duration).toBe(1800);
    });

    it('should return default duration for non-Gon techniques', () => {
      const defaultDuration = 1000;

      const duration = grappleSystem.getTechniqueControlDuration(
        mockStrike,
        defaultDuration
      );

      // Non-Gon technique: use default
      expect(duration).toBe(defaultDuration);
    });

    it('should use custom default when provided', () => {
      const customDefault = 1500;

      const duration = grappleSystem.getTechniqueControlDuration(
        mockStrike,
        customDefault
      );

      expect(duration).toBe(customDefault);
    });
  });

  describe('GrappleSystem.applyPostThrowAdvantage', () => {
    const grappleSystem = new GrappleSystem();

    it('should create advantage state with technique controlDuration', () => {
      const currentTime = Date.now();
      const attackerId = 'player1';
      const defenderId = 'player2';

      const advantage = grappleSystem.applyPostThrowAdvantage(
        mockSsireumThrow,
        attackerId,
        defenderId,
        currentTime
      );

      expect(advantage.controllerId).toBe(attackerId);
      expect(advantage.targetId).toBe(defenderId);
      expect(advantage.duration).toBe(1800); // From technique metadata
      expect(advantage.startTime).toBe(currentTime);
      expect(advantage.endTime).toBe(currentTime + 1800);
    });

    it('should use fallback duration for non-Gon techniques', () => {
      const currentTime = Date.now();
      const attackerId = 'player1';
      const defenderId = 'player2';

      const advantage = grappleSystem.applyPostThrowAdvantage(
        mockStrike,
        attackerId,
        defenderId,
        currentTime
      );

      // Non-Gon technique: use 1200ms fallback
      expect(advantage.duration).toBe(1200);
      expect(advantage.endTime).toBe(currentTime + 1200);
    });

    it('should correctly calculate time windows', () => {
      const currentTime = 5000;
      const attackerId = 'player1';
      const defenderId = 'player2';

      const advantage = grappleSystem.applyPostThrowAdvantage(
        mockSsireumThrow,
        attackerId,
        defenderId,
        currentTime
      );

      expect(advantage.startTime).toBe(5000);
      expect(advantage.endTime).toBe(5000 + 1800);
      expect(advantage.endTime - advantage.startTime).toBe(1800);
    });
  });

  describe('Integration: Complete throw sequence', () => {
    const grappleSystem = new GrappleSystem();

    it('should correctly apply all Gon enhancements in sequence', () => {
      const baseDamage = 50;
      const attackerStrength = 80;
      const earthAffinity = 0.2; // 20% bonus
      const currentTime = Date.now();

      // Step 1: Calculate throw impact damage
      const damageResult = DamageCalculator.calculateThrowImpactDamage(
        mockSsireumThrow,
        baseDamage,
        attackerStrength
      );

      expect(damageResult.damage).toBeGreaterThan(baseDamage); // Enhanced by multiplier
      expect(damageResult.isCritical).toBe(true); // High impact

      // Step 2: Calculate earth healing for attacker
      const healing = DamageCalculator.calculateEarthHealing(
        mockSsireumThrow,
        earthAffinity
      );

      expect(healing).toBe(6); // 5 × 1.2 = 6

      // Step 3: Apply post-throw control advantage
      const advantage = grappleSystem.applyPostThrowAdvantage(
        mockSsireumThrow,
        'player1',
        'player2',
        currentTime
      );

      expect(advantage.duration).toBe(1800); // Strong control

      // Verify complete sequence consistency
      expect(damageResult.damage).toBeGreaterThan(0);
      expect(healing).toBeGreaterThan(0);
      expect(advantage.duration).toBeGreaterThan(0);
    });

    it('should handle non-Gon techniques with graceful fallbacks', () => {
      const baseDamage = 50;
      const attackerStrength = 80;
      const earthAffinity = 0.2;
      const currentTime = Date.now();

      // Step 1: Strike damage (no ground multiplier)
      const damageResult = DamageCalculator.calculateThrowImpactDamage(
        mockStrike,
        baseDamage,
        attackerStrength
      );

      expect(damageResult.damage).toBe(baseDamage); // Unchanged

      // Step 2: No earth healing
      const healing = DamageCalculator.calculateEarthHealing(
        mockStrike,
        earthAffinity
      );

      expect(healing).toBe(0);

      // Step 3: Default control duration
      const advantage = grappleSystem.applyPostThrowAdvantage(
        mockStrike,
        'player1',
        'player2',
        currentTime
      );

      expect(advantage.duration).toBe(1200); // Fallback
    });
  });

  describe('Performance validation', () => {
    it('should execute throw damage calculation efficiently', () => {
      const iterations = 10000;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        DamageCalculator.calculateThrowImpactDamage(
          mockSsireumThrow,
          50,
          80
        );
      }

      const end = performance.now();
      const avgTime = (end - start) / iterations;

      // Should execute in less than 0.1ms per call (10,000 ops in < 1s)
      expect(avgTime).toBeLessThan(0.1);
    });

    it('should execute healing calculation efficiently', () => {
      const iterations = 10000;
      const start = performance.now();

      for (let i = 0; i < iterations; i++) {
        DamageCalculator.calculateEarthHealing(mockSsireumThrow, 0.3);
      }

      const end = performance.now();
      const avgTime = (end - start) / iterations;

      // Simple arithmetic should be extremely fast
      expect(avgTime).toBeLessThan(0.05);
    });
  });
});
