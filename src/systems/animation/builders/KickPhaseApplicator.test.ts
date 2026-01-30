/**
 * Tests for KickPhaseApplicator
 *
 * @module systems/animation/__tests__/KickPhaseApplicator.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  applyKickPhaseToConfig,
  applyRoundhousePhaseToConfig,
  applySideKickPhaseToConfig,
  type KickSide,
} from './KickPhaseApplicator';
import { KeyframeConfig } from './KeyframeConfig';
import { BoneName } from '@/types/skeletal';
import { KICK_PHASES } from './MartialArtsConstants';

describe('KickPhaseApplicator', () => {
  let config: KeyframeConfig;

  beforeEach(() => {
    config = new KeyframeConfig();
  });

  describe('applyKickPhaseToConfig - Basic kicks', () => {
    it('should apply chamber phase to right leg', () => {
      applyKickPhaseToConfig(config, KICK_PHASES.CHAMBER, {
        side: 'right',
      });

      // Verify right leg bones are set
      expect(config.rotations.has(BoneName.HIP_R)).toBe(true);
      expect(config.rotations.has(BoneName.KNEE_R)).toBe(true);
    });

    it('should apply chamber phase to left leg', () => {
      applyKickPhaseToConfig(config, KICK_PHASES.CHAMBER, {
        side: 'left',
      });

      // Verify left leg bones are set
      expect(config.rotations.has(BoneName.HIP_L)).toBe(true);
      expect(config.rotations.has(BoneName.KNEE_L)).toBe(true);
    });

    it('should apply extension phase correctly', () => {
      applyKickPhaseToConfig(config, KICK_PHASES.EXTENSION, {
        side: 'right',
      });

      // Verify extension-specific rotations
      const hip = config.rotations.get(BoneName.HIP_R);
      expect(hip).toBeDefined();
      expect(hip?.x).toBe(KICK_PHASES.EXTENSION.hip[0]);
    });

    it('should apply high peak phase correctly', () => {
      applyKickPhaseToConfig(config, KICK_PHASES.HIGH_PEAK, {
        side: 'right',
      });

      expect(config.rotations.has(BoneName.HIP_R)).toBe(true);
      expect(config.rotations.has(BoneName.KNEE_R)).toBe(true);
    });

    it('should include ankle when option is enabled', () => {
      applyKickPhaseToConfig(config, KICK_PHASES.CHAMBER, {
        side: 'right',
        includeAnkle: true,
      });

      expect(config.rotations.has(BoneName.FOOT_R)).toBe(true);
    });

    it('should not include ankle by default', () => {
      applyKickPhaseToConfig(config, KICK_PHASES.CHAMBER, {
        side: 'right',
      });

      expect(config.rotations.has(BoneName.FOOT_R)).toBe(false);
    });

    it('should include pelvis when option is enabled', () => {
      const phaseWithPelvis = {
        hip: [1.2, 0, 0] as const,
        knee: [0, 0, 2.5] as const,
        pelvis: [0, 0.2, 0] as const,
      };

      applyKickPhaseToConfig(config, phaseWithPelvis, {
        side: 'right',
        includePelvis: true,
      });

      expect(config.rotations.has(BoneName.PELVIS)).toBe(true);
    });

    it('should include support knee when phase has it', () => {
      applyKickPhaseToConfig(config, KICK_PHASES.CHAMBER, {
        side: 'right',
      });

      // Support knee is left when kicking with right
      expect(config.rotations.has(BoneName.KNEE_L)).toBe(true);
    });

    it('should reset foot when option is enabled', () => {
      applyKickPhaseToConfig(config, KICK_PHASES.CHAMBER, {
        side: 'right',
        resetFoot: true,
      });

      // Foot should be reset to [0, 0, 0]
      const foot = config.rotations.get(BoneName.FOOT_R);
      expect(foot).toBeDefined();
      expect(foot?.x).toBe(0);
      expect(foot?.y).toBe(0);
      expect(foot?.z).toBe(0);
    });

    it('should highlight kicking foot when option is enabled', () => {
      applyKickPhaseToConfig(config, KICK_PHASES.EXTENSION, {
        side: 'right',
        highlightKickingFoot: true,
      });

      // Verify kick is applied (highlight is internal state)
      expect(config.rotations.has(BoneName.HIP_R)).toBe(true);
    });
  });

  describe('applyRoundhousePhaseToConfig - Roundhouse kicks', () => {
    it('should apply roundhouse chamber phase', () => {
      applyRoundhousePhaseToConfig(config, KICK_PHASES.ROUNDHOUSE_CHAMBER, {
        side: 'right',
      });

      // Verify right leg bones are set
      expect(config.rotations.has(BoneName.HIP_R)).toBe(true);
      expect(config.rotations.has(BoneName.KNEE_R)).toBe(true);
    });

    it('should apply roundhouse to left leg', () => {
      applyRoundhousePhaseToConfig(config, KICK_PHASES.ROUNDHOUSE_CHAMBER, {
        side: 'left',
      });

      // Verify left leg bones are set
      expect(config.rotations.has(BoneName.HIP_L)).toBe(true);
      expect(config.rotations.has(BoneName.KNEE_L)).toBe(true);
    });

    it('should include pelvis Y rotation', () => {
      applyRoundhousePhaseToConfig(config, KICK_PHASES.ROUNDHOUSE_CHAMBER, {
        side: 'right',
      });

      expect(config.rotations.has(BoneName.PELVIS)).toBe(true);
    });

    it('should include spine rotations', () => {
      applyRoundhousePhaseToConfig(config, KICK_PHASES.ROUNDHOUSE_CHAMBER, {
        side: 'right',
      });

      expect(config.rotations.has(BoneName.SPINE_UPPER)).toBe(true);
    });
  });

  describe('applySideKickPhaseToConfig - Side kicks', () => {
    it('should apply side kick chamber phase', () => {
      applySideKickPhaseToConfig(config, KICK_PHASES.SIDE_CHAMBER, {
        side: 'right',
      });

      // Verify right leg bones are set
      expect(config.rotations.has(BoneName.HIP_R)).toBe(true);
      expect(config.rotations.has(BoneName.KNEE_R)).toBe(true);
    });

    it('should apply side kick to left leg', () => {
      applySideKickPhaseToConfig(config, KICK_PHASES.SIDE_CHAMBER, {
        side: 'left',
      });

      // Verify left leg bones are set
      expect(config.rotations.has(BoneName.HIP_L)).toBe(true);
      expect(config.rotations.has(BoneName.KNEE_L)).toBe(true);
    });

    it('should include pelvis rotation', () => {
      applySideKickPhaseToConfig(config, KICK_PHASES.SIDE_CHAMBER, {
        side: 'right',
      });

      expect(config.rotations.has(BoneName.PELVIS)).toBe(true);
    });
  });

  describe('Side selection', () => {
    it('should correctly apply to right side', () => {
      applyKickPhaseToConfig(config, KICK_PHASES.CHAMBER, {
        side: 'right',
      });

      expect(config.rotations.has(BoneName.HIP_R)).toBe(true);
      expect(config.rotations.has(BoneName.KNEE_R)).toBe(true);
      // Support knee is left
      expect(config.rotations.has(BoneName.KNEE_L)).toBe(true);
    });

    it('should correctly apply to left side', () => {
      applyKickPhaseToConfig(config, KICK_PHASES.CHAMBER, {
        side: 'left',
      });

      expect(config.rotations.has(BoneName.HIP_L)).toBe(true);
      expect(config.rotations.has(BoneName.KNEE_L)).toBe(true);
      // Support knee is right
      expect(config.rotations.has(BoneName.KNEE_R)).toBe(true);
    });

    it('should default to right side when not specified', () => {
      applyKickPhaseToConfig(config, KICK_PHASES.CHAMBER, {});

      // Should default to right
      expect(config.rotations.has(BoneName.HIP_R)).toBe(true);
      expect(config.rotations.has(BoneName.KNEE_R)).toBe(true);
    });

    it('should swap support leg based on kicking leg', () => {
      const rightConfig = new KeyframeConfig();
      applyKickPhaseToConfig(rightConfig, KICK_PHASES.EXTENSION, {
        side: 'right',
      });

      const leftConfig = new KeyframeConfig();
      applyKickPhaseToConfig(leftConfig, KICK_PHASES.EXTENSION, {
        side: 'left',
      });

      // Right kick: left leg is support
      expect(rightConfig.rotations.has(BoneName.KNEE_L)).toBe(true);
      // Left kick: right leg is support
      expect(leftConfig.rotations.has(BoneName.KNEE_R)).toBe(true);
    });
  });

  describe('Integration - Complex kick sequences', () => {
    it('should build complete front kick animation', () => {
      config.rotate(BoneName.PELVIS, 0, 0.2, 0);

      applyKickPhaseToConfig(config, KICK_PHASES.CHAMBER, {
        side: 'right',
        highlightKickingFoot: true,
      });

      expect(config.rotations.size).toBeGreaterThan(3);
      expect(config.rotations.has(BoneName.PELVIS)).toBe(true);
    });

    it('should build complete roundhouse kick animation', () => {
      applyRoundhousePhaseToConfig(
        config,
        KICK_PHASES.ROUNDHOUSE_CHAMBER,
        {
          side: 'right',
        }
      );

      expect(config.rotations.has(BoneName.HIP_R)).toBe(true);
      expect(config.rotations.has(BoneName.KNEE_R)).toBe(true);
    });

    it('should chain multiple kick phases', () => {
      // Chamber
      applyKickPhaseToConfig(config, KICK_PHASES.CHAMBER, {
        side: 'right',
      });
      const chamberSize = config.rotations.size;

      // Extension (overwrites)
      applyKickPhaseToConfig(config, KICK_PHASES.EXTENSION, {
        side: 'right',
      });

      expect(config.rotations.size).toBeGreaterThanOrEqual(chamberSize);
    });

    it('should work with fluent KeyframeConfig API', () => {
      config.rotate(BoneName.SPINE_UPPER, 0, 0.2, 0);

      applyKickPhaseToConfig(config, KICK_PHASES.EXTENSION, {
        side: 'right',
        highlightKickingFoot: true,
        includeAnkle: true,
      });

      config
        .position(BoneName.FOOT_R, 0, 1.2, 0.5)
        .setFacialExpression('focused');

      expect(config.rotations.size).toBeGreaterThan(3);
      expect(config.positions.has(BoneName.FOOT_R)).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle kick with all options enabled', () => {
      expect(() => {
        applyKickPhaseToConfig(config, KICK_PHASES.EXTENSION, {
          includeAnkle: true,
          includePelvis: true,
          resetFoot: true,
          side: 'right',
          highlightKickingFoot: true,
        });
      }).not.toThrow();

      expect(config.rotations.size).toBeGreaterThan(0);
    });

    it('should handle kick with minimal options', () => {
      expect(() => {
        applyKickPhaseToConfig(config, KICK_PHASES.CHAMBER, {});
      }).not.toThrow();

      expect(config.rotations.size).toBeGreaterThan(0);
    });

    it('should handle both kick sides', () => {
      const sides: KickSide[] = ['left', 'right'];

      sides.forEach((side) => {
        const testConfig = new KeyframeConfig();
        expect(() => {
          applyKickPhaseToConfig(testConfig, KICK_PHASES.EXTENSION, { side });
        }).not.toThrow();

        expect(testConfig.rotations.size).toBeGreaterThan(0);
      });
    });

    it('should handle rotational kick with specific function', () => {
      expect(() => {
        applyRoundhousePhaseToConfig(config, KICK_PHASES.ROUNDHOUSE_CHAMBER, {
          side: 'left',
        });
      }).not.toThrow();

      expect(config.rotations.size).toBeGreaterThan(0);
    });

    it('should handle phase without optional properties', () => {
      const minimalPhase = {
        hip: [1.0, 0, 0] as const,
        knee: [0, 0, 2.0] as const,
      };

      expect(() => {
        applyKickPhaseToConfig(config, minimalPhase, {
          side: 'right',
        });
      }).not.toThrow();

      expect(config.rotations.size).toBeGreaterThan(0);
    });
  });
});
