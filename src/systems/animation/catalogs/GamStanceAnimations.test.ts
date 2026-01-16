/**
 * Test suite for Gam (Water) Stance Animations
 *
 * Tests idle breathing, movement animations, and water-like flow characteristics
 * for the Gam trigram stance system.
 *
 * @module systems/animation/catalogs/__tests__/GamStanceAnimations
 * @category Testing
 */

import { describe, it, expect } from "vitest";
import { BoneName } from "@/types/skeletal";
import {
  GAM_IDLE_FLOWING,
  GAM_YIELDING_SIDESTEP,
  GAM_FLOWING_RETREAT_STEP,
  GAM_STANCE_ANIMATIONS,
} from "./GamStanceAnimations";

describe("Gam Stance Animations", () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // GAM_IDLE_FLOWING Tests
  // ═══════════════════════════════════════════════════════════════════════════

  describe("GAM_IDLE_FLOWING (감괘 흐름 자세)", () => {
    it("should have correct duration for flowing cycle", () => {
      expect(GAM_IDLE_FLOWING.duration).toBe(2.6);
      expect(GAM_IDLE_FLOWING.loop).toBe(true);
    });

    it("should have correct name and Korean translation", () => {
      expect(GAM_IDLE_FLOWING.name).toBe("gam_idle_flowing");
      expect(GAM_IDLE_FLOWING.koreanName).toBe("감괘 흐름 자세");
    });

    it("should have at least 5 keyframes for complete breathing cycle", () => {
      expect(GAM_IDLE_FLOWING.keyframes.length).toBeGreaterThanOrEqual(5);
    });

    it("should start and end at the same position (looping)", () => {
      const firstFrame = GAM_IDLE_FLOWING.keyframes[0];
      const lastFrame =
        GAM_IDLE_FLOWING.keyframes[GAM_IDLE_FLOWING.keyframes.length - 1];

      // Check pelvis returns to neutral
      const firstPelvis = firstFrame.boneRotations.get(BoneName.PELVIS);
      const lastPelvis = lastFrame.boneRotations.get(BoneName.PELVIS);

      expect(firstPelvis).toBeDefined();
      expect(lastPelvis).toBeDefined();

      if (firstPelvis && lastPelvis) {
        expect(Math.abs(firstPelvis.z - lastPelvis.z)).toBeLessThan(0.01);
      }
    });

    it("should demonstrate subtle weight shifts (< 3 degrees)", () => {
      const hipRotations = GAM_IDLE_FLOWING.keyframes.map((f) => {
        const rotation = f.boneRotations.get(BoneName.PELVIS);
        return rotation ? rotation.z : 0;
      });

      // All shifts should be minimal (< 0.05 radians ≈ 3 degrees)
      hipRotations.forEach((rotation) => {
        expect(Math.abs(rotation)).toBeLessThan(0.05);
      });
    });

    it("should maintain relaxed shoulders throughout", () => {
      GAM_IDLE_FLOWING.keyframes.forEach((frame) => {
        const leftShoulder = frame.boneRotations.get(BoneName.SHOULDER_L);
        const rightShoulder = frame.boneRotations.get(BoneName.SHOULDER_R);

        expect(leftShoulder).toBeDefined();
        expect(rightShoulder).toBeDefined();

        if (leftShoulder && rightShoulder) {
          // Shoulders should be low (positive x rotation, small values)
          expect(leftShoulder.x).toBeGreaterThanOrEqual(0);
          expect(leftShoulder.x).toBeLessThan(0.2); // < 11 degrees
          expect(rightShoulder.x).toBeGreaterThanOrEqual(0);
          expect(rightShoulder.x).toBeLessThan(0.2);
        }
      });
    });

    it("should have keyframes at expected times", () => {
      const times = GAM_IDLE_FLOWING.keyframes.map((f) => f.time);

      expect(times).toContain(0); // Start
      expect(times).toContain(0.65); // Weight shift left
      expect(times).toContain(1.3); // Return center
      expect(times).toContain(1.95); // Weight shift right
      expect(times).toContain(2.6); // Complete cycle
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // GAM_YIELDING_SIDESTEP Tests
  // ═══════════════════════════════════════════════════════════════════════════

  describe("GAM_YIELDING_SIDESTEP (물의 양보)", () => {
    it("should have correct timing for yielding movement", () => {
      expect(GAM_YIELDING_SIDESTEP.duration).toBeCloseTo(0.583, 3);
      expect(GAM_YIELDING_SIDESTEP.loop).toBe(false);
    });

    it("should have correct name and Korean translation", () => {
      expect(GAM_YIELDING_SIDESTEP.name).toBe("gam_yielding_sidestep");
      expect(GAM_YIELDING_SIDESTEP.koreanName).toBe("물의 양보");
    });

    it("should have at least 3 keyframes for movement phases", () => {
      expect(GAM_YIELDING_SIDESTEP.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it("should demonstrate lateral weight shift", () => {
      const firstFrame = GAM_YIELDING_SIDESTEP.keyframes[0];
      const lastFrame =
        GAM_YIELDING_SIDESTEP.keyframes[
          GAM_YIELDING_SIDESTEP.keyframes.length - 1
        ];

      const firstPos = firstFrame.bonePositions.get(BoneName.PELVIS);
      const lastPos = lastFrame.bonePositions.get(BoneName.PELVIS);

      if (firstPos && lastPos) {
        // Pelvis should move laterally (x-axis)
        expect(Math.abs(lastPos.x - firstPos.x)).toBeGreaterThan(0.1);

        // Lateral movement should be more than vertical
        expect(Math.abs(lastPos.x - firstPos.x)).toBeGreaterThan(
          Math.abs(lastPos.y - firstPos.y)
        );
      }
    });

    it("should maintain upper body centeredness", () => {
      GAM_YIELDING_SIDESTEP.keyframes.forEach((frame) => {
        const spineRotation = frame.boneRotations.get(BoneName.SPINE_UPPER);

        if (spineRotation) {
          // Spine should remain mostly upright (minimal y rotation)
          expect(Math.abs(spineRotation.y)).toBeLessThan(0.1); // < 6 degrees
        }
      });
    });

    it("should have smooth weight transfer through knees", () => {
      const kneeRotations = GAM_YIELDING_SIDESTEP.keyframes.map((f) => {
        const leftKnee = f.boneRotations.get(BoneName.KNEE_L);
        const rightKnee = f.boneRotations.get(BoneName.KNEE_R);
        return {
          left: leftKnee ? leftKnee.x : 0,
          right: rightKnee ? rightKnee.x : 0,
        };
      });

      // Knees should show load transfer (values change)
      const leftValues = kneeRotations.map((k) => k.left);
      const rightValues = kneeRotations.map((k) => k.right);

      const leftRange = Math.max(...leftValues) - Math.min(...leftValues);
      const rightRange = Math.max(...rightValues) - Math.min(...rightValues);

      // Should have some variation showing weight transfer
      expect(leftRange).toBeGreaterThan(0.05);
      expect(rightRange).toBeGreaterThan(0.05);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // GAM_FLOWING_RETREAT_STEP Tests
  // ═══════════════════════════════════════════════════════════════════════════

  describe("GAM_FLOWING_RETREAT_STEP (수류 후퇴)", () => {
    it("should have correct timing for retreat movement", () => {
      expect(GAM_FLOWING_RETREAT_STEP.duration).toBeCloseTo(0.75, 3);
      expect(GAM_FLOWING_RETREAT_STEP.loop).toBe(false);
    });

    it("should have correct name and Korean translation", () => {
      expect(GAM_FLOWING_RETREAT_STEP.name).toBe("gam_flowing_retreat_step");
      expect(GAM_FLOWING_RETREAT_STEP.koreanName).toBe("수류 후퇴");
    });

    it("should have at least 3 keyframes for retreat phases", () => {
      expect(
        GAM_FLOWING_RETREAT_STEP.keyframes.length
      ).toBeGreaterThanOrEqual(3);
    });

    it("should demonstrate backward movement", () => {
      const firstFrame = GAM_FLOWING_RETREAT_STEP.keyframes[0];
      const lastFrame =
        GAM_FLOWING_RETREAT_STEP.keyframes[
          GAM_FLOWING_RETREAT_STEP.keyframes.length - 1
        ];

      const firstPos = firstFrame.bonePositions.get(BoneName.PELVIS);
      const lastPos = lastFrame.bonePositions.get(BoneName.PELVIS);

      if (firstPos && lastPos) {
        // Pelvis should move backward (negative z-axis)
        expect(lastPos.z).toBeLessThan(firstPos.z);

        // Backward movement should be significant
        expect(Math.abs(lastPos.z - firstPos.z)).toBeGreaterThan(0.2);
      }
    });

    it("should maintain hands forward to maintain contact", () => {
      // Check mid and end frames for forward hand position
      const frames = GAM_FLOWING_RETREAT_STEP.keyframes.filter(
        (f) => f.time > 0.2
      );

      frames.forEach((frame) => {
        const leftElbow = frame.boneRotations.get(BoneName.ELBOW_L);
        const rightElbow = frame.boneRotations.get(BoneName.ELBOW_R);

        if (leftElbow && rightElbow) {
          // Elbows should be extended (negative z for left, positive for right)
          // Values should be significant showing arms extended forward
          expect(Math.abs(leftElbow.z)).toBeGreaterThan(0.4); // > 23 degrees
          expect(Math.abs(rightElbow.z)).toBeGreaterThan(0.4);
        }
      });
    });

    it("should show gradual backward lean", () => {
      const spineRotations = GAM_FLOWING_RETREAT_STEP.keyframes.map((f) => {
        const spine = f.boneRotations.get(BoneName.SPINE_UPPER);
        return spine ? spine.x : 0;
      });

      // Spine should lean back (negative x rotation) during retreat
      const midFrameSpine =
        spineRotations[Math.floor(spineRotations.length / 2)];
      expect(midFrameSpine).toBeLessThan(0);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Water-Like Flow Characteristics Tests
  // ═══════════════════════════════════════════════════════════════════════════

  describe("Water-Like Flow Characteristics", () => {
    it("all animations should exhibit smooth transitions", () => {
      const animations = [
        GAM_IDLE_FLOWING,
        GAM_YIELDING_SIDESTEP,
        GAM_FLOWING_RETREAT_STEP,
      ];

      animations.forEach((animation) => {
        // Check time deltas are reasonable (not instant jumps)
        for (let i = 1; i < animation.keyframes.length; i++) {
          const timeDelta =
            animation.keyframes[i].time - animation.keyframes[i - 1].time;
          expect(timeDelta).toBeGreaterThan(0);
          expect(timeDelta).toBeLessThan(2); // No frame gaps > 2 seconds
        }
      });
    });

    it("movement animations should show continuous flow (no sudden stops)", () => {
      const movements = [GAM_YIELDING_SIDESTEP, GAM_FLOWING_RETREAT_STEP];

      movements.forEach((animation) => {
        // Position should change gradually
        const positions = animation.keyframes.map((f) =>
          f.bonePositions.get(BoneName.PELVIS)
        );

        for (let i = 1; i < positions.length; i++) {
          const prev = positions[i - 1];
          const curr = positions[i];

          if (prev && curr) {
            // Calculate Euclidean movement magnitude
            const dx = curr.x - prev.x;
            const dy = curr.y - prev.y;
            const dz = curr.z - prev.z;
            const totalMovement = Math.sqrt(dx * dx + dy * dy + dz * dz);

            // Should have some movement between frames
            if (i < positions.length - 1) {
              // Not last frame
              expect(totalMovement).toBeGreaterThan(0);
            }
          }
        }
      });
    });

    it("idle animation should maintain stable base", () => {
      // Pelvis vertical position should remain relatively constant
      const pelvisYPositions = GAM_IDLE_FLOWING.keyframes.map((f) => {
        const pos = f.bonePositions.get(BoneName.PELVIS);
        return pos ? pos.y : 0;
      });

      const yRange = Math.max(...pelvisYPositions) - Math.min(...pelvisYPositions);
      
      // Y variation should be minimal (stable stance)
      expect(yRange).toBeLessThan(0.05);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Export Structure Tests
  // ═══════════════════════════════════════════════════════════════════════════

  describe("GAM_STANCE_ANIMATIONS Export", () => {
    it("should export correct structure", () => {
      expect(GAM_STANCE_ANIMATIONS).toBeDefined();
      expect(GAM_STANCE_ANIMATIONS.idle).toBe(GAM_IDLE_FLOWING);
      expect(GAM_STANCE_ANIMATIONS.movement).toBeDefined();
    });

    it("should include all movement animations", () => {
      expect(GAM_STANCE_ANIMATIONS.movement.yieldingSidestep).toBe(
        GAM_YIELDING_SIDESTEP
      );
      expect(GAM_STANCE_ANIMATIONS.movement.flowingRetreat).toBe(
        GAM_FLOWING_RETREAT_STEP
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Anatomical Safety Tests
  // ═══════════════════════════════════════════════════════════════════════════

  describe("Anatomical Safety Limits", () => {
    const MAX_SHOULDER_ROTATION = 1.57; // ±90°
    const MAX_WRIST_FLEXION = 1.22; // ±70°
    const MAX_SPINE_ROTATION = 0.79; // ±45°

    it("should respect shoulder rotation limits", () => {
      const animations = [
        GAM_IDLE_FLOWING,
        GAM_YIELDING_SIDESTEP,
        GAM_FLOWING_RETREAT_STEP,
      ];

      animations.forEach((animation) => {
        animation.keyframes.forEach((frame) => {
          const leftShoulder = frame.boneRotations.get(BoneName.SHOULDER_L);
          const rightShoulder = frame.boneRotations.get(BoneName.SHOULDER_R);

          if (leftShoulder) {
            expect(Math.abs(leftShoulder.y)).toBeLessThanOrEqual(
              MAX_SHOULDER_ROTATION
            );
            expect(Math.abs(leftShoulder.z)).toBeLessThanOrEqual(
              MAX_SHOULDER_ROTATION
            );
          }

          if (rightShoulder) {
            expect(Math.abs(rightShoulder.y)).toBeLessThanOrEqual(
              MAX_SHOULDER_ROTATION
            );
            expect(Math.abs(rightShoulder.z)).toBeLessThanOrEqual(
              MAX_SHOULDER_ROTATION
            );
          }
        });
      });
    });

    it("should respect wrist flexion limits", () => {
      const animations = [
        GAM_IDLE_FLOWING,
        GAM_YIELDING_SIDESTEP,
        GAM_FLOWING_RETREAT_STEP,
      ];

      animations.forEach((animation) => {
        animation.keyframes.forEach((frame) => {
          const leftWrist = frame.boneRotations.get(BoneName.WRIST_L);
          const rightWrist = frame.boneRotations.get(BoneName.WRIST_R);

          if (leftWrist) {
            expect(Math.abs(leftWrist.x)).toBeLessThanOrEqual(MAX_WRIST_FLEXION);
            expect(Math.abs(leftWrist.y)).toBeLessThanOrEqual(MAX_WRIST_FLEXION);
          }

          if (rightWrist) {
            expect(Math.abs(rightWrist.x)).toBeLessThanOrEqual(MAX_WRIST_FLEXION);
            expect(Math.abs(rightWrist.y)).toBeLessThanOrEqual(MAX_WRIST_FLEXION);
          }
        });
      });
    });

    it("should respect spine rotation limits", () => {
      const animations = [
        GAM_IDLE_FLOWING,
        GAM_YIELDING_SIDESTEP,
        GAM_FLOWING_RETREAT_STEP,
      ];

      animations.forEach((animation) => {
        animation.keyframes.forEach((frame) => {
          const spine = frame.boneRotations.get(BoneName.SPINE_UPPER);

          if (spine) {
            expect(Math.abs(spine.y)).toBeLessThanOrEqual(MAX_SPINE_ROTATION);
          }
        });
      });
    });
  });
});
