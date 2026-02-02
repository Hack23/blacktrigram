/**
 * Tests for Gon Technique Extensions utility functions
 * @module systems/trigram/types/GonTechniqueExtensions.test
 */

import { describe, it, expect } from 'vitest';
import {
  validateGonTechniqueEnhancements,
  calculateEarthCrackIntensity,
  isExtendedGonTechnique,
  type ExtendedGonTechnique,
} from './GonTechniqueExtensions';
import type { TrigramStanceTechnique } from '@/systems/vitalpoint';
import { TrigramStance } from '@/types';

// Helper to create a complete base technique
const createBaseTechnique = (overrides: Partial<ExtendedGonTechnique> = {}): ExtendedGonTechnique => ({
  id: 'test',
  name: {
    korean: '테스트',
    english: 'Test',
    romanized: 'test',
  },
  koreanName: '테스트',
  englishName: 'Test',
  romanized: 'test',
  description: {
    korean: '테스트',
    english: 'Test',
  },
  stance: TrigramStance.GON,
  type: 'throw',
  damageType: 'impact',
  damage: 50,
  kiCost: 10,
  staminaCost: 15,
  accuracy: 0.85,
  reachConfig: { bodyPart: 'arm', techniqueType: 'punch', baseExtension: 1.0 },
  executionTime: 1000,
  recoveryTime: 500,
  critChance: 0.1,
  critMultiplier: 1.5,
  effects: [],
  category: 'heavy',
  range: 'medium',
  speed: 0.8,
  animationId: 'test',
  throwTrajectory: 'arc_downward',
  groundImpactMultiplier: 1.5,
  controlDuration: 1200,
  supportiveHealing: 5,
  earthCrackEffect: true,
  ...overrides,
});

describe('GonTechniqueExtensions Utilities', () => {
  describe('validateGonTechniqueEnhancements', () => {
    it('should validate technique with all values in range', () => {
      const technique = createBaseTechnique();

      const result = validateGonTechniqueEnhancements(technique);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject groundImpactMultiplier below 1.0', () => {
      const technique = createBaseTechnique({ groundImpactMultiplier: 0.8 });

      const result = validateGonTechniqueEnhancements(technique);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('groundImpactMultiplier must be 1.0-2.0, got 0.8');
    });

    it('should reject groundImpactMultiplier above 2.0', () => {
      const technique = createBaseTechnique({ groundImpactMultiplier: 2.5 });

      const result = validateGonTechniqueEnhancements(technique);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('groundImpactMultiplier must be 1.0-2.0, got 2.5');
    });

    it('should reject controlDuration below 800ms', () => {
      const technique = createBaseTechnique({ controlDuration: 700 });

      const result = validateGonTechniqueEnhancements(technique);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('controlDuration must be 800-2000ms, got 700ms');
    });

    it('should reject controlDuration above 2000ms', () => {
      const technique = createBaseTechnique({ controlDuration: 2500 });

      const result = validateGonTechniqueEnhancements(technique);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('controlDuration must be 800-2000ms, got 2500ms');
    });

    it('should reject supportiveHealing below 0', () => {
      const technique = createBaseTechnique({ supportiveHealing: -1 });

      const result = validateGonTechniqueEnhancements(technique);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('supportiveHealing must be 0-10, got -1');
    });

    it('should reject supportiveHealing above 10', () => {
      const technique = createBaseTechnique({ supportiveHealing: 12 });

      const result = validateGonTechniqueEnhancements(technique);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('supportiveHealing must be 0-10, got 12');
    });

    it('should validate optional gripStrength in range', () => {
      const technique = createBaseTechnique({ gripStrength: 0.85 });

      const result = validateGonTechniqueEnhancements(technique);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid optional fields', () => {
      const technique = createBaseTechnique({
        gripStrength: 1.5, // Invalid: > 1.0
        selfRisk: -0.1, // Invalid: < 0
        traditionalBonus: 2.5, // Invalid: > 2.0
      });

      const result = validateGonTechniqueEnhancements(technique);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('gripStrength must be 0-1, got 1.5');
      expect(result.errors).toContain('selfRisk must be 0-1, got -0.1');
      expect(result.errors).toContain('traditionalBonus must be 1.0-2.0, got 2.5');
    });
  });

  describe('calculateEarthCrackIntensity', () => {
    it('should return "none" when earthCrackEffect is false', () => {
      const technique = {
        earthCrackEffect: false,
        groundImpactMultiplier: 2.0,
      };

      const intensity = calculateEarthCrackIntensity(technique, 1.0);
      expect(intensity).toBe('none');
    });

    it('should return "small" for low impact', () => {
      const technique = {
        earthCrackEffect: true,
        groundImpactMultiplier: 1.0,
      };

      const intensity = calculateEarthCrackIntensity(technique, 1.0);
      expect(intensity).toBe('small'); // 1.0 * 1.0 = 1.0 < 1.3
    });

    it('should return "medium" for moderate impact', () => {
      const technique = {
        earthCrackEffect: true,
        groundImpactMultiplier: 1.4,
      };

      const intensity = calculateEarthCrackIntensity(technique, 1.0);
      expect(intensity).toBe('medium'); // 1.4 * 1.0 = 1.4, between 1.3 and 1.6
    });

    it('should return "large" for high impact', () => {
      const technique = {
        earthCrackEffect: true,
        groundImpactMultiplier: 1.7,
      };

      const intensity = calculateEarthCrackIntensity(technique, 1.0);
      expect(intensity).toBe('large'); // 1.7 * 1.0 = 1.7, between 1.6 and 1.9
    });

    it('should return "massive" for maximum impact', () => {
      const technique = {
        earthCrackEffect: true,
        groundImpactMultiplier: 2.0,
      };

      const intensity = calculateEarthCrackIntensity(technique, 1.0);
      expect(intensity).toBe('massive'); // 2.0 * 1.0 = 2.0 >= 1.9
    });

    it('should scale with player strength', () => {
      const technique = {
        earthCrackEffect: true,
        groundImpactMultiplier: 1.2,
      };

      // Low strength: small intensity
      expect(calculateEarthCrackIntensity(technique, 0.8)).toBe('small'); // 1.2 * 0.8 = 0.96 < 1.3

      // High strength: medium intensity
      expect(calculateEarthCrackIntensity(technique, 1.3)).toBe('medium'); // 1.2 * 1.3 = 1.56, between 1.3 and 1.6
    });
  });

  describe('isExtendedGonTechnique', () => {
    it('should return true for valid extended Gon technique', () => {
      const technique: any = {
        id: 'test',
        throwTrajectory: 'arc_downward',
        groundImpactMultiplier: 1.5,
        controlDuration: 1200,
        supportiveHealing: 5,
        earthCrackEffect: true,
      };

      expect(isExtendedGonTechnique(technique)).toBe(true);
    });

    it('should return false when missing throwTrajectory', () => {
      const technique: any = {
        id: 'test',
        groundImpactMultiplier: 1.5,
        controlDuration: 1200,
        supportiveHealing: 5,
        earthCrackEffect: true,
      };

      expect(isExtendedGonTechnique(technique)).toBe(false);
    });

    it('should return false when missing groundImpactMultiplier', () => {
      const technique: any = {
        id: 'test',
        throwTrajectory: 'arc_downward',
        controlDuration: 1200,
        supportiveHealing: 5,
        earthCrackEffect: true,
      };

      expect(isExtendedGonTechnique(technique)).toBe(false);
    });

    it('should return false when missing controlDuration', () => {
      const technique: any = {
        id: 'test',
        throwTrajectory: 'arc_downward',
        groundImpactMultiplier: 1.5,
        supportiveHealing: 5,
        earthCrackEffect: true,
      };

      expect(isExtendedGonTechnique(technique)).toBe(false);
    });

    it('should return false when missing supportiveHealing', () => {
      const technique: any = {
        id: 'test',
        throwTrajectory: 'arc_downward',
        groundImpactMultiplier: 1.5,
        controlDuration: 1200,
        earthCrackEffect: true,
      };

      expect(isExtendedGonTechnique(technique)).toBe(false);
    });

    it('should return false when missing earthCrackEffect', () => {
      const technique: any = {
        id: 'test',
        throwTrajectory: 'arc_downward',
        groundImpactMultiplier: 1.5,
        controlDuration: 1200,
        supportiveHealing: 5,
      };

      expect(isExtendedGonTechnique(technique)).toBe(false);
    });

    it('should return false for basic technique without Gon fields', () => {
      const technique: TrigramStanceTechnique = {
        id: 'basic_punch',
        name: {
          korean: '기본펀치',
          english: 'Basic Punch',
          romanized: 'gibon punch',
        },
        koreanName: '기본펀치',
        englishName: 'Basic Punch',
        romanized: 'gibon punch',
        description: {
          korean: '기본 펀치',
          english: 'Basic punch',
        },
        stance: TrigramStance.GEON,
        type: 'strike',
        damageType: 'impact',
        damage: 30,
        kiCost: 5,
        staminaCost: 15,
        accuracy: 0.9,
        reachConfig: { bodyPart: 'arm', techniqueType: 'punch', baseExtension: 1.0 },
        executionTime: 400,
        recoveryTime: 300,
        critChance: 0.1,
        critMultiplier: 1.5,
        effects: [],
        animationId: 'jab',
        category: 'light',
        range: 'short',
        speed: 1.2,
      };

      expect(isExtendedGonTechnique(technique)).toBe(false);
    });
  });
});
