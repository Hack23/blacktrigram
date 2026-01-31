/**
 * Tests for PunchPhaseApplicator
 *
 * @module systems/animation/__tests__/PunchPhaseApplicator.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { applyPunchPhaseToConfig, type PunchSide } from './PunchPhaseApplicator';
import { KeyframeConfig } from './KeyframeConfig';
import { BoneName } from '@/types/skeletal';
import { PUNCH_PHASES } from './MartialArtsConstants';

describe('PunchPhaseApplicator', () => {
  let config: KeyframeConfig;

  beforeEach(() => {
    config = new KeyframeConfig();
  });

  describe('applyPunchPhaseToConfig', () => {
    it('should apply chamber phase to right hand', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.CHAMBER, 'right');

      // Verify right arm bones are set
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_R)).toBe(true);
    });

    it('should apply chamber phase to left hand', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.CHAMBER, 'left');

      // Verify left arm bones are set
      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_L)).toBe(true);
    });

    it('should apply extension phase correctly', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.EXTENSION, 'right');

      // Verify extension-specific rotations
      const shoulder = config.rotations.get(BoneName.SHOULDER_R);
      expect(shoulder).toBeDefined();
      expect(shoulder?.x).toBe(PUNCH_PHASES.EXTENSION.shoulder[0]);
    });

    it('should include wrist when option is enabled', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.CHAMBER, 'right', {
        includeWrist: true,
      });

      expect(config.rotations.has(BoneName.WRIST_R)).toBe(true);
    });

    it('should not include wrist by default', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.CHAMBER, 'right');

      expect(config.rotations.has(BoneName.WRIST_R)).toBe(false);
    });

    it('should include opposite arm for hikite when enabled', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.EXTENSION, 'right', {
        includeOppositeArm: true,
      });

      // Verify opposite arm (left) is set for hikite
      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_L)).toBe(true);
    });

    it('should not include opposite arm when disabled', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.EXTENSION, 'right', {
        includeOppositeArm: false,
      });

      // Verify opposite arm is not set
      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(false);
      expect(config.rotations.has(BoneName.ELBOW_L)).toBe(false);
    });

    it('should include spine rotation when phase has spineY', () => {
      const phaseWithSpine = {
        shoulder: [0, 0, 0.5] as const,
        elbow: [0, 0, 1.5] as const,
        spineY: 0.3,
      };

      applyPunchPhaseToConfig(config, phaseWithSpine, 'right');

      expect(config.rotations.has(BoneName.SPINE_UPPER)).toBe(true);
    });

    it('should include pelvis rotation when phase has pelvisY', () => {
      const phaseWithPelvis = {
        shoulder: [0, 0, 0.5] as const,
        elbow: [0, 0, 1.5] as const,
        pelvisY: 0.2,
      };

      applyPunchPhaseToConfig(config, phaseWithPelvis, 'right');

      expect(config.rotations.has(BoneName.PELVIS)).toBe(true);
    });

    it('should apply hand pose when specified', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.EXTENSION, 'right', {
        handPose: 'fist',
      });

      // Verify config has rotations (hand pose is applied internally)
      expect(config.rotations.size).toBeGreaterThan(2);
    });

    it('should apply hand highlight mode when specified', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.EXTENSION, 'right', {
        handPose: 'fist',
        handHighlightMode: 'knuckles',
      });

      // Verify config has rotations
      expect(config.rotations.size).toBeGreaterThan(0);
    });

    it('should apply opposite hand pose when specified', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.EXTENSION, 'right', {
        includeOppositeArm: true,
        oppositeHandPose: 'open',
      });

      // Verify both arms are configured
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(true);
    });
  });

  describe('Punch phases', () => {
    it('should handle chamber phase', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.CHAMBER, 'right');

      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_R)).toBe(true);
    });

    it('should handle extension phase', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.EXTENSION, 'right');

      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_R)).toBe(true);
    });
  });

  describe('Side selection', () => {
    it('should correctly apply to right side', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.CHAMBER, 'right');

      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_R)).toBe(true);
      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(true); // Opposite for hikite
    });

    it('should correctly apply to left side', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.CHAMBER, 'left');

      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_L)).toBe(true);
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true); // Opposite for hikite
    });

    it('should swap opposite arm based on punching hand', () => {
      const rightConfig = new KeyframeConfig();
      applyPunchPhaseToConfig(rightConfig, PUNCH_PHASES.EXTENSION, 'right', {
        includeOppositeArm: true,
      });

      const leftConfig = new KeyframeConfig();
      applyPunchPhaseToConfig(leftConfig, PUNCH_PHASES.EXTENSION, 'left', {
        includeOppositeArm: true,
      });

      // Right punch: left arm is opposite
      expect(rightConfig.rotations.has(BoneName.SHOULDER_L)).toBe(true);
      // Left punch: right arm is opposite
      expect(leftConfig.rotations.has(BoneName.SHOULDER_R)).toBe(true);
    });
  });

  describe('Integration - Complex punch sequences', () => {
    it('should build complete jab animation', () => {
      config
        .rotate(BoneName.PELVIS, 0, 0.1, 0);

      applyPunchPhaseToConfig(config, PUNCH_PHASES.CHAMBER, 'right', {
        handPose: 'fist',
        includeOppositeArm: true,
      });

      expect(config.rotations.size).toBeGreaterThan(4);
      expect(config.rotations.has(BoneName.PELVIS)).toBe(true);
    });

    it('should chain multiple punch phases', () => {
      // Chamber
      applyPunchPhaseToConfig(config, PUNCH_PHASES.CHAMBER, 'right');
      const chamberSize = config.rotations.size;

      // Extension (overwrites)
      applyPunchPhaseToConfig(config, PUNCH_PHASES.EXTENSION, 'right');
      
      expect(config.rotations.size).toBeGreaterThanOrEqual(chamberSize);
    });

    it('should work with fluent KeyframeConfig API', () => {
      config
        .rotate(BoneName.SPINE_UPPER, 0, 0.2, 0);

      applyPunchPhaseToConfig(config, PUNCH_PHASES.EXTENSION, 'right', {
        handPose: 'fist',
        handHighlightMode: 'knuckles',
      });

      config
        .position(BoneName.HAND_R, 0, 0, 0.8)
        .setFacialExpression('focused');

      expect(config.rotations.size).toBeGreaterThan(3);
      expect(config.positions.has(BoneName.HAND_R)).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle punch with all options enabled', () => {
      expect(() => {
        applyPunchPhaseToConfig(config, PUNCH_PHASES.EXTENSION, 'right', {
          includeWrist: true,
          includeSpineMiddle: true,
          includeOppositeArm: true,
          handPose: 'fist',
          handHighlightMode: 'knuckles',
          oppositeHandPose: 'open',
        });
      }).not.toThrow();

      expect(config.rotations.size).toBeGreaterThan(0);
    });

    it('should handle punch with minimal options', () => {
      expect(() => {
        applyPunchPhaseToConfig(config, PUNCH_PHASES.CHAMBER, 'right', {});
      }).not.toThrow();

      expect(config.rotations.size).toBeGreaterThan(0);
    });

    it('should handle both punch sides', () => {
      const sides: PunchSide[] = ['left', 'right'];

      sides.forEach((side) => {
        const testConfig = new KeyframeConfig();
        expect(() => {
          applyPunchPhaseToConfig(testConfig, PUNCH_PHASES.EXTENSION, side);
        }).not.toThrow();

        expect(testConfig.rotations.size).toBeGreaterThan(0);
      });
    });

    it('should default to right side when not specified', () => {
      applyPunchPhaseToConfig(config, PUNCH_PHASES.CHAMBER);

      // Should default to right
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_R)).toBe(true);
    });
  });
});
