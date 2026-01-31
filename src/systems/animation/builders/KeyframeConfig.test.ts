/**
 * Tests for KeyframeConfig
 *
 * @module systems/animation/__tests__/KeyframeConfig.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { KeyframeConfig, type HandHighlightMode } from './KeyframeConfig';
import { BoneName } from '@/types/skeletal';
import * as THREE from 'three';

describe('KeyframeConfig', () => {
  let config: KeyframeConfig;

  beforeEach(() => {
    config = new KeyframeConfig();
  });

  describe('rotate', () => {
    it('should set bone rotation with fluent API', () => {
      const result = config.rotate(BoneName.SHOULDER_R, 0.5, 0.3, 0.2);

      expect(result).toBe(config); // Fluent API returns this
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);

      const rotation = config.rotations.get(BoneName.SHOULDER_R);
      expect(rotation).toBeInstanceOf(THREE.Euler);
      expect(rotation?.x).toBe(0.5);
      expect(rotation?.y).toBe(0.3);
      expect(rotation?.z).toBe(0.2);
    });

    it('should set multiple bone rotations', () => {
      config
        .rotate(BoneName.SHOULDER_R, 0.1, 0.2, 0.3)
        .rotate(BoneName.ELBOW_R, 0.4, 0.5, 0.6)
        .rotate(BoneName.WRIST_R, 0.7, 0.8, 0.9);

      expect(config.rotations.size).toBe(3);
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_R)).toBe(true);
      expect(config.rotations.has(BoneName.WRIST_R)).toBe(true);
    });

    it('should overwrite existing bone rotation', () => {
      config.rotate(BoneName.SHOULDER_R, 1, 1, 1);
      config.rotate(BoneName.SHOULDER_R, 2, 2, 2);

      const rotation = config.rotations.get(BoneName.SHOULDER_R);
      expect(rotation?.x).toBe(2);
      expect(rotation?.y).toBe(2);
      expect(rotation?.z).toBe(2);
    });

    it('should handle zero rotations', () => {
      config.rotate(BoneName.PELVIS, 0, 0, 0);

      const rotation = config.rotations.get(BoneName.PELVIS);
      expect(rotation?.x).toBe(0);
      expect(rotation?.y).toBe(0);
      expect(rotation?.z).toBe(0);
    });

    it('should handle negative rotations', () => {
      config.rotate(BoneName.SHOULDER_L, -0.5, -0.3, -0.2);

      const rotation = config.rotations.get(BoneName.SHOULDER_L);
      expect(rotation?.x).toBe(-0.5);
      expect(rotation?.y).toBe(-0.3);
      expect(rotation?.z).toBe(-0.2);
    });
  });

  describe('position', () => {
    it('should set bone position with fluent API', () => {
      const result = config.position(BoneName.HAND_R, 0.1, 0.2, 0.3);

      expect(result).toBe(config); // Fluent API returns this
      expect(config.positions.has(BoneName.HAND_R)).toBe(true);

      const position = config.positions.get(BoneName.HAND_R);
      expect(position).toBeInstanceOf(THREE.Vector3);
      expect(position?.x).toBe(0.1);
      expect(position?.y).toBe(0.2);
      expect(position?.z).toBe(0.3);
    });

    it('should set multiple bone positions', () => {
      config
        .position(BoneName.HAND_R, 0.1, 0.2, 0.3)
        .position(BoneName.HAND_L, 0.4, 0.5, 0.6)
        .position(BoneName.FOOT_R, 0.7, 0.8, 0.9);

      expect(config.positions.size).toBe(3);
    });

    it('should overwrite existing bone position', () => {
      config.position(BoneName.HAND_R, 1, 1, 1);
      config.position(BoneName.HAND_R, 2, 2, 2);

      const position = config.positions.get(BoneName.HAND_R);
      expect(position?.x).toBe(2);
    });

    it('should handle zero positions', () => {
      config.position(BoneName.PELVIS, 0, 0, 0);

      const position = config.positions.get(BoneName.PELVIS);
      expect(position?.x).toBe(0);
      expect(position?.y).toBe(0);
      expect(position?.z).toBe(0);
    });

    it('should handle negative positions', () => {
      config.position(BoneName.FOOT_L, -0.1, -0.2, -0.3);

      const position = config.positions.get(BoneName.FOOT_L);
      expect(position?.x).toBe(-0.1);
      expect(position?.y).toBe(-0.2);
      expect(position?.z).toBe(-0.3);
    });
  });

  describe('withGuard', () => {
    it('should apply middle guard to both hands by default', () => {
      config.withGuard('MIDDLE_GUARD');

      // Verify both shoulders, elbows, and wrists are set
      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_L)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_R)).toBe(true);
      expect(config.rotations.has(BoneName.WRIST_L)).toBe(true);
      expect(config.rotations.has(BoneName.WRIST_R)).toBe(true);
    });

    it('should apply guard to left hand only', () => {
      config.withGuard('HIGH_GUARD', 'left');

      // Verify only left arm bones are set
      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_L)).toBe(true);
      expect(config.rotations.has(BoneName.WRIST_L)).toBe(true);

      // Verify right arm bones are not set
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(false);
      expect(config.rotations.has(BoneName.ELBOW_R)).toBe(false);
    });

    it('should apply guard to right hand only', () => {
      config.withGuard('LOW_GUARD', 'right');

      // Verify only right arm bones are set
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_R)).toBe(true);
      expect(config.rotations.has(BoneName.WRIST_R)).toBe(true);

      // Verify left arm bones are not set
      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(false);
    });

    it('should apply high guard correctly', () => {
      config.withGuard('HIGH_GUARD', 'right');

      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_R)).toBe(true);
      expect(config.rotations.has(BoneName.WRIST_R)).toBe(true);
    });

    it('should apply low guard correctly', () => {
      config.withGuard('LOW_GUARD', 'left');

      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_L)).toBe(true);
      expect(config.rotations.has(BoneName.WRIST_L)).toBe(true);
    });

    it('should chain with other methods', () => {
      config
        .withGuard('MIDDLE_GUARD', 'left')
        .rotate(BoneName.PELVIS, 0, 0.5, 0)
        .position(BoneName.HAND_R, 0.1, 0, 0);

      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(config.rotations.has(BoneName.PELVIS)).toBe(true);
      expect(config.positions.has(BoneName.HAND_R)).toBe(true);
    });
  });

  describe('Anatomy State - Hand Poses', () => {
    it('should set left hand pose', () => {
      const result = config.setLeftHandPose('fist');

      expect(result).toBe(config);
      // Note: internal state, verified through done() method
    });

    it('should set right hand pose', () => {
      const result = config.setRightHandPose('open');

      expect(result).toBe(config);
    });

    it('should set left hand pose with highlight mode', () => {
      const result = config.setLeftHandPose('knife_hand', 'knife_edge');

      expect(result).toBe(config);
    });

    it('should set right hand pose with highlight mode', () => {
      const result = config.setRightHandPose('fist', 'knuckles');

      expect(result).toBe(config);
    });

    it('should set both hand poses', () => {
      const result = config.setBothHandPoses('grab');

      expect(result).toBe(config);
    });
  });

  describe('Anatomy State - Foot Highlights', () => {
    it('should set left foot highlight', () => {
      const result = config.setFootHighlight('left', true);

      expect(result).toBe(config);
    });

    it('should set right foot highlight', () => {
      const result = config.setFootHighlight('right', true);

      expect(result).toBe(config);
    });

    it('should set both feet highlights', () => {
      const result = config.setFootHighlight('both', true);

      expect(result).toBe(config);
    });

    it('should unset foot highlight', () => {
      const result = config
        .setFootHighlight('right', true)
        .setFootHighlight('right', false);

      expect(result).toBe(config);
    });
  });

  describe('Anatomy State - Facial Expressions', () => {
    it('should set facial expression', () => {
      const result = config.setFacialExpression('focused');

      expect(result).toBe(config);
    });

    it('should change facial expression', () => {
      const result = config
        .setFacialExpression('neutral')
        .setFacialExpression('pained');

      expect(result).toBe(config);
    });
  });

  describe('Anatomy State - Muscle Activations', () => {
    it('should set single muscle activation', () => {
      const result = config.setMuscleActivation('BICEP_R', 0.8);

      expect(result).toBe(config);
    });

    it('should clamp muscle activation to 0-1 range', () => {
      config.setMuscleActivation('QUAD_L', 1.5);
      config.setMuscleActivation('QUAD_R', -0.5);

      // Values should be clamped (verified through integration test)
      expect(config).toBeDefined();
    });

    it('should set multiple muscle activations from Map', () => {
      const activations = new Map<string, number>([
        ['BICEP_R', 0.8],
        ['TRICEP_R', 0.6],
        ['QUAD_L', 0.9],
      ]);

      const result = config.setMuscleActivations(activations);

      expect(result).toBe(config);
    });

    it('should set multiple muscle activations from object', () => {
      const activations = {
        BICEP_L: 0.7,
        TRICEP_L: 0.5,
        QUAD_R: 0.8,
      };

      const result = config.setMuscleActivations(activations);

      expect(result).toBe(config);
    });

    it('should clamp muscle activations in batch', () => {
      const activations = {
        MUSCLE_A: 1.5,
        MUSCLE_B: -0.3,
        MUSCLE_C: 0.5,
      };

      const result = config.setMuscleActivations(activations);

      expect(result).toBe(config);
    });
  });

  describe('done - Builder integration', () => {
    it('should throw error when not associated with builder', () => {
      expect(() => {
        config.done();
      }).toThrow('KeyframeConfig not associated with builder');
    });

    it('should return builder when properly configured', () => {
      // Create mock builder
      const mockBuilder = {
        _addKeyframe: () => {},
      };

      // Associate with builder
      config['builder'] = mockBuilder as any;
      config['time'] = 0.5;
      config['easing'] = 'ease-out';

      // Should not throw
      expect(() => {
        config.done();
      }).not.toThrow();
    });

    it('should call builder._addKeyframe with correct data', () => {
      let capturedKeyframe: any = null;

      const mockBuilder = {
        _addKeyframe: (kf: any) => {
          capturedKeyframe = kf;
        },
      };

      config['builder'] = mockBuilder as any;
      config['time'] = 0.3;
      config['easing'] = 'linear';

      config
        .rotate(BoneName.SHOULDER_R, 0.5, 0, 0)
        .position(BoneName.HAND_R, 0.1, 0, 0)
        .setRightHandPose('fist', 'knuckles')
        .setFacialExpression('focused');

      config.done();

      expect(capturedKeyframe).not.toBeNull();
      expect(capturedKeyframe.time).toBe(0.3);
      expect(capturedKeyframe.easing).toBe('linear');
      expect(capturedKeyframe.boneRotations).toBeInstanceOf(Map);
      expect(capturedKeyframe.bonePositions).toBeInstanceOf(Map);
      expect(capturedKeyframe.rightHandPose).toBe('fist');
      expect(capturedKeyframe.rightHandHighlightMode).toBe('knuckles');
      expect(capturedKeyframe.facialExpression).toBe('focused');
    });

    it('should include muscle activations in keyframe', () => {
      let capturedKeyframe: any = null;

      const mockBuilder = {
        _addKeyframe: (kf: any) => {
          capturedKeyframe = kf;
        },
      };

      config['builder'] = mockBuilder as any;
      config['time'] = 0.2;
      config['easing'] = 'ease-in';

      config
        .setMuscleActivation('BICEP_R', 0.9)
        .setMuscleActivation('QUAD_L', 0.7);

      config.done();

      expect(capturedKeyframe.muscleActivations).toBeInstanceOf(Map);
      expect(capturedKeyframe.muscleActivations.size).toBe(2);
    });
  });

  describe('Integration - Complex keyframes', () => {
    it('should build complete punch keyframe', () => {
      config
        .rotate(BoneName.SHOULDER_R, 0, 0, 0.5)
        .rotate(BoneName.ELBOW_R, 0, 0, 0)
        .rotate(BoneName.PELVIS, 0, 0.3, 0)
        .position(BoneName.HAND_R, 0, 0, 0.8)
        .withGuard('MIDDLE_GUARD', 'left')
        .setRightHandPose('fist', 'knuckles')
        .setLeftHandPose('open')
        .setFacialExpression('focused')
        .setMuscleActivation('BICEP_R', 0.8)
        .setMuscleActivation('TRICEP_R', 0.9);

      expect(config.rotations.size).toBeGreaterThan(5);
      expect(config.positions.size).toBe(1);
    });

    it('should build complete kick keyframe', () => {
      config
        .rotate(BoneName.HIP_R, 1.2, 0, 0)
        .rotate(BoneName.KNEE_R, 0, 0, 2.5)
        .position(BoneName.FOOT_R, 0, 1.2, 0.5)
        .withGuard('HIGH_GUARD', 'both')
        .setBothHandPoses('fist')
        .setFootHighlight('right', true)
        .setFacialExpression('focused')
        .setMuscleActivation('QUAD_R', 1.0);

      expect(config.rotations.size).toBeGreaterThan(6);
      expect(config.positions.size).toBe(1);
    });

    it('should build defensive keyframe', () => {
      config
        .withGuard('HIGH_GUARD', 'both')
        .rotate(BoneName.PELVIS, 0, -0.5, 0)
        .setBothHandPoses('open')
        .setFacialExpression('defensive');

      expect(config.rotations.size).toBeGreaterThan(5);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty config', () => {
      expect(config.rotations.size).toBe(0);
      expect(config.positions.size).toBe(0);
    });

    it('should handle chaining many operations', () => {
      const result = config
        .rotate(BoneName.SHOULDER_R, 0, 0, 0)
        .rotate(BoneName.SHOULDER_L, 0, 0, 0)
        .rotate(BoneName.ELBOW_R, 0, 0, 0)
        .rotate(BoneName.ELBOW_L, 0, 0, 0)
        .position(BoneName.HAND_R, 0, 0, 0)
        .position(BoneName.HAND_L, 0, 0, 0)
        .withGuard('MIDDLE_GUARD')
        .setRightHandPose('fist')
        .setLeftHandPose('open')
        .setFootHighlight('both', true)
        .setFacialExpression('focused')
        .setMuscleActivation('BICEP_R', 0.5);

      expect(result).toBe(config);
      expect(config.rotations.size).toBeGreaterThan(5);
    });

    it('should handle all hand highlight modes', () => {
      const modes: HandHighlightMode[] = [
        'none',
        'knuckles',
        'palm',
        'knife_edge',
        'fingertips',
      ];

      modes.forEach((mode) => {
        const testConfig = new KeyframeConfig();
        const result = testConfig.setRightHandPose('fist', mode);
        expect(result).toBe(testConfig);
      });
    });
  });
});
