/**
 * Test suite for Gam (Water) Technique Combat Animations
 *
 * Tests counter and takedown animations, redirection mechanics, and
 * water-flow combat principles for the Gam trigram technique system.
 *
 * @module systems/animation/catalogs/__tests__/GamTechniqueAnimations
 * @category Testing
 */

import { describe, it, expect } from "vitest";
import { BoneName } from "@/types/skeletal";
import {
  GAM_WATER_FLOW_COUNTER_ANIMATION,
  GAM_FLOWING_TAKEDOWN,
  GAM_TECHNIQUE_ANIMATIONS,
} from "./GamTechniqueAnimations";

describe("Gam Technique Combat Animations", () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // GAM_WATER_FLOW_COUNTER_ANIMATION Tests
  // ═══════════════════════════════════════════════════════════════════════════

  describe("GAM_WATER_FLOW_COUNTER_ANIMATION (수류반격)", () => {
    it("should have correct timing for adaptive counter", () => {
      expect(GAM_WATER_FLOW_COUNTER_ANIMATION.duration).toBeCloseTo(1.4, 2);
      expect(GAM_WATER_FLOW_COUNTER_ANIMATION.loop).toBe(false);
    });

    it("should have correct name and Korean translation", () => {
      expect(GAM_WATER_FLOW_COUNTER_ANIMATION.name).toBe(
        "gam_water_flow_counter"
      );
      expect(GAM_WATER_FLOW_COUNTER_ANIMATION.koreanName).toBe("수류반격");
    });

    it("should have at least 6 keyframes for 3-phase technique", () => {
      // Receive (6 frames) + Redirect (10 frames) + Counter (8 frames) = 24 total
      expect(
        GAM_WATER_FLOW_COUNTER_ANIMATION.keyframes.length
      ).toBeGreaterThanOrEqual(6);
    });

    it("should demonstrate yielding in receive phase", () => {
      // Check keyframe around 350ms (end of receive phase)
      const receiveFrame = GAM_WATER_FLOW_COUNTER_ANIMATION.keyframes.find(
        (f) => Math.abs(f.time - 0.35) < 0.05
      );

      expect(receiveFrame).toBeDefined();

      if (receiveFrame) {
        const spineRotation = receiveFrame.boneRotations.get(
          BoneName.SPINE_UPPER
        );

        expect(spineRotation).toBeDefined();

        if (spineRotation) {
          // Spine should yield away (negative y rotation)
          expect(spineRotation.y).toBeLessThan(0);
          expect(spineRotation.y).toBeGreaterThanOrEqual(-0.2); // Within -12°
        }
      }
    });

    it("should show circular redirection path", () => {
      const keyframes = GAM_WATER_FLOW_COUNTER_ANIMATION.keyframes;
      const spineRotations = keyframes.map((f) => {
        const spine = f.boneRotations.get(BoneName.SPINE_UPPER);
        return spine ? spine.y : 0;
      });

      // Should go negative (yield) then positive (counter) - circular path
      const minRotation = Math.min(...spineRotations);
      const maxRotation = Math.max(...spineRotations);

      // Yield phase should show negative rotation
      expect(minRotation).toBeLessThan(-0.15); // < -9°

      // Counter phase should show positive rotation
      expect(maxRotation).toBeGreaterThan(0.15); // > 9°

      // Total circular arc should be significant
      expect(maxRotation - minRotation).toBeGreaterThan(0.4); // > 23° total arc
    });

    it("should maintain both hands engaged throughout", () => {
      GAM_WATER_FLOW_COUNTER_ANIMATION.keyframes.forEach((frame) => {
        const leftElbow = frame.boneRotations.get(BoneName.ELBOW_L);
        const rightElbow = frame.boneRotations.get(BoneName.ELBOW_R);

        expect(leftElbow).toBeDefined();
        expect(rightElbow).toBeDefined();

        if (leftElbow && rightElbow) {
          // Both elbows should show significant bend (control position)
          expect(Math.abs(leftElbow.z)).toBeGreaterThan(0.4); // > ~23°
          expect(Math.abs(rightElbow.z)).toBeGreaterThan(0.3); // > ~17°
        }
      });
    });

    it("should complete full counter in final phase", () => {
      const finalFrame =
        GAM_WATER_FLOW_COUNTER_ANIMATION.keyframes[
          GAM_WATER_FLOW_COUNTER_ANIMATION.keyframes.length - 1
        ];

      const spineRotation = finalFrame.boneRotations.get(BoneName.SPINE_UPPER);

      expect(spineRotation).toBeDefined();

      if (spineRotation) {
        // Spine should be rotated into counter position (positive y)
        expect(spineRotation.y).toBeGreaterThan(0.2); // > 11°
      }
    });

    it("should use opponent's momentum (position changes reflect flow)", () => {
      const positions = GAM_WATER_FLOW_COUNTER_ANIMATION.keyframes.map((f) =>
        f.bonePositions.get(BoneName.PELVIS)
      );

      // Should have movement data for some frames
      const positionsWithData = positions.filter((p) => p !== undefined);
      expect(positionsWithData.length).toBeGreaterThan(0);

      // Check that there's movement representing flow with opponent
      if (positionsWithData.length >= 2) {
        // Helper to determine if a position represents meaningful movement
        const hasNonZeroPosition = (
          pos: { x: number; y: number; z: number }
        ): boolean =>
          Math.abs(pos.x) > 0.001 ||
          Math.abs(pos.y) > 0.001 ||
          Math.abs(pos.z) > 0.001;

        // Check for any non-zero positions indicating flow movement
        let hasMovement = false;
        for (const pos of positionsWithData) {
          if (pos && hasNonZeroPosition(pos)) {
            hasMovement = true;
            break;
          }
        }

        // At least some frames should show positional flow
        expect(hasMovement).toBe(true);
      }
    });

    it("should have keyframes at critical phase transitions", () => {
      const times = GAM_WATER_FLOW_COUNTER_ANIMATION.keyframes.map(
        (f) => f.time
      );

      expect(times).toContain(0); // Start
      // Should have frames around phase transitions
      const hasReceiveEnd = times.some((t) => Math.abs(t - 0.35) < 0.05);
      const hasRedirectMid = times.some((t) => Math.abs(t - 0.65) < 0.1);
      const hasCounterStart = times.some((t) => Math.abs(t - 0.95) < 0.1);

      expect(hasReceiveEnd || hasRedirectMid || hasCounterStart).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // GAM_FLOWING_TAKEDOWN Tests
  // ═══════════════════════════════════════════════════════════════════════════

  describe("GAM_FLOWING_TAKEDOWN (수류 넘어뜨리기)", () => {
    it("should have correct timing for takedown sequence", () => {
      expect(GAM_FLOWING_TAKEDOWN.duration).toBeCloseTo(1.517, 3);
      expect(GAM_FLOWING_TAKEDOWN.loop).toBe(false);
    });

    it("should have correct name and Korean translation", () => {
      expect(GAM_FLOWING_TAKEDOWN.name).toBe("gam_flowing_takedown");
      expect(GAM_FLOWING_TAKEDOWN.koreanName).toBe("수류 넘어뜨리기");
    });

    it("should have at least 6 keyframes for 3-phase takedown", () => {
      // Blend (8 frames) + Off-balance (8 frames) + Takedown (10 frames) = 26 total
      expect(GAM_FLOWING_TAKEDOWN.keyframes.length).toBeGreaterThanOrEqual(6);
    });

    it("should show blending motion in initial phase", () => {
      // Check keyframe around 444ms (end of blend phase)
      const blendFrame = GAM_FLOWING_TAKEDOWN.keyframes.find(
        (f) => Math.abs(f.time - 0.444) < 0.05
      );

      expect(blendFrame).toBeDefined();

      if (blendFrame) {
        const leftElbow = blendFrame.boneRotations.get(BoneName.ELBOW_L);
        const rightElbow = blendFrame.boneRotations.get(BoneName.ELBOW_R);

        expect(leftElbow).toBeDefined();
        expect(rightElbow).toBeDefined();

        if (leftElbow && rightElbow) {
          // Elbows should be deeply bent for wrapping/blending
          expect(Math.abs(leftElbow.z)).toBeGreaterThan(0.8); // > 46°
          expect(Math.abs(rightElbow.z)).toBeGreaterThan(0.8);
        }
      }
    });

    it("should demonstrate subtle off-balancing shift", () => {
      // Compare middle frames (off-balance phase)
      const midFrames = GAM_FLOWING_TAKEDOWN.keyframes.filter(
        (f) => f.time > 0.4 && f.time < 0.9
      );

      expect(midFrames.length).toBeGreaterThan(0);

      midFrames.forEach((frame) => {
        const pelvisRotation = frame.boneRotations.get(BoneName.PELVIS);

        if (pelvisRotation) {
          // Pelvis should show subtle shifts (not extreme)
          // Y rotation for off-balancing, but should be controlled
          expect(Math.abs(pelvisRotation.y)).toBeLessThan(0.4); // < 23°
        }
      });
    });

    it("should show descending motion in takedown phase", () => {
      // Check later frames for vertical descent
      const takedownFrames = GAM_FLOWING_TAKEDOWN.keyframes.filter(
        (f) => f.time > 0.9
      );

      expect(takedownFrames.length).toBeGreaterThan(0);

      // Check knee bends increase (more negative x rotation)
      takedownFrames.forEach((frame) => {
        const leftKnee = frame.boneRotations.get(BoneName.KNEE_L);
        const rightKnee = frame.boneRotations.get(BoneName.KNEE_R);

        if (leftKnee && rightKnee) {
          // Knees should be deeply bent for descent
          expect(leftKnee.x).toBeLessThan(-0.3); // < -17°
          expect(rightKnee.x).toBeLessThan(-0.3);
        }
      });

      // Check pelvis descends
      const positions = takedownFrames.map((f) =>
        f.bonePositions.get(BoneName.PELVIS)
      );

      const positionsWithData = positions.filter((p) => p !== undefined);

      if (positionsWithData.length >= 2) {
        const firstPos = positionsWithData[0];
        const lastPos = positionsWithData[positionsWithData.length - 1];

        if (firstPos && lastPos) {
          // Pelvis should descend (negative y)
          expect(lastPos.y).toBeLessThan(firstPos.y);
        }
      }
    });

    it("should maintain control throughout takedown", () => {
      // Arms should maintain engagement (elbow bends) throughout
      GAM_FLOWING_TAKEDOWN.keyframes.forEach((frame) => {
        const leftElbow = frame.boneRotations.get(BoneName.ELBOW_L);
        const rightElbow = frame.boneRotations.get(BoneName.ELBOW_R);

        if (leftElbow && rightElbow) {
          // Elbows should show control (bent positions)
          expect(Math.abs(leftElbow.z)).toBeGreaterThan(0.3); // > 17°
          expect(Math.abs(rightElbow.z)).toBeGreaterThan(0.3);
        }
      });
    });

    it("should end in ground control position", () => {
      const finalFrame =
        GAM_FLOWING_TAKEDOWN.keyframes[
          GAM_FLOWING_TAKEDOWN.keyframes.length - 1
        ];

      // Check knees are deeply bent (kneeling)
      const leftKnee = finalFrame.boneRotations.get(BoneName.KNEE_L);
      const rightKnee = finalFrame.boneRotations.get(BoneName.KNEE_R);

      expect(leftKnee).toBeDefined();
      expect(rightKnee).toBeDefined();

      if (leftKnee && rightKnee) {
        // Deep knee bends for kneeling position
        expect(leftKnee.x).toBeLessThan(-0.7); // < -40°
        expect(rightKnee.x).toBeLessThan(-0.7);
      }

      // Check pelvis is lowered
      const pelvisPos = finalFrame.bonePositions.get(BoneName.PELVIS);

      if (pelvisPos) {
        // Pelvis should be significantly lowered
        expect(pelvisPos.y).toBeLessThan(-0.1);
      }
    });

    it("should use minimum force (smooth gradual movements)", () => {
      // Check that rotation changes are gradual, not sudden
      for (let i = 1; i < GAM_FLOWING_TAKEDOWN.keyframes.length; i++) {
        const prevFrame = GAM_FLOWING_TAKEDOWN.keyframes[i - 1];
        const currFrame = GAM_FLOWING_TAKEDOWN.keyframes[i];

        const prevSpine = prevFrame.boneRotations.get(BoneName.SPINE_UPPER);
        const currSpine = currFrame.boneRotations.get(BoneName.SPINE_UPPER);

        if (prevSpine && currSpine) {
          // Spine rotation changes should be smooth
          const rotationChange = Math.abs(currSpine.y - prevSpine.y);

          // No sudden jumps (> 20° per frame)
          expect(rotationChange).toBeLessThan(0.35);
        }
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Water-Flow Combat Principles Tests
  // ═══════════════════════════════════════════════════════════════════════════

  describe("Water-Flow Combat Principles", () => {
    it("techniques should exhibit continuous flow (no sudden stops)", () => {
      const techniques = [
        GAM_WATER_FLOW_COUNTER_ANIMATION,
        GAM_FLOWING_TAKEDOWN,
      ];

      techniques.forEach((technique) => {
        // Check time progression is smooth
        for (let i = 1; i < technique.keyframes.length; i++) {
          const timeDelta =
            technique.keyframes[i].time - technique.keyframes[i - 1].time;

          expect(timeDelta).toBeGreaterThan(0);
          // Frame spacing should be reasonable (< 0.5s between keyframes)
          expect(timeDelta).toBeLessThan(0.5);
        }
      });
    });

    it("counter animation should show force redirection (circular motion)", () => {
      const spineRotations = GAM_WATER_FLOW_COUNTER_ANIMATION.keyframes.map(
        (f) => {
          const spine = f.boneRotations.get(BoneName.SPINE_UPPER);
          return spine ? spine.y : 0;
        }
      );

      // Calculate direction changes (sign changes indicate circular motion)
      let directionChanges = 0;
      for (let i = 1; i < spineRotations.length - 1; i++) {
        const prev = spineRotations[i - 1];
        const curr = spineRotations[i];
        const next = spineRotations[i + 1];

        const delta1 = curr - prev;
        const delta2 = next - curr;

        // If signs differ, direction changed
        if (delta1 * delta2 < 0) {
          directionChanges++;
        }
      }

      // Should have at least one direction change (circular path)
      expect(directionChanges).toBeGreaterThan(0);
    });

    it("takedown should show adaptive blending (matching opponent)", () => {
      // Early frames should show engagement without resistance
      const earlyFrames = GAM_FLOWING_TAKEDOWN.keyframes.filter(
        (f) => f.time < 0.5
      );

      earlyFrames.forEach((frame) => {
        const pelvisRotation = frame.boneRotations.get(BoneName.PELVIS);

        if (pelvisRotation) {
          // Pelvis rotations should be controlled (matching, not forcing)
          expect(Math.abs(pelvisRotation.y)).toBeLessThan(0.25); // < 14°
        }
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Export Structure Tests
  // ═══════════════════════════════════════════════════════════════════════════

  describe("GAM_TECHNIQUE_ANIMATIONS Export", () => {
    it("should export correct structure", () => {
      expect(GAM_TECHNIQUE_ANIMATIONS).toBeDefined();
      expect(GAM_TECHNIQUE_ANIMATIONS.counter).toBe(
        GAM_WATER_FLOW_COUNTER_ANIMATION
      );
      expect(GAM_TECHNIQUE_ANIMATIONS.takedown).toBe(GAM_FLOWING_TAKEDOWN);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Anatomical Safety Tests
  // ═══════════════════════════════════════════════════════════════════════════

  describe("Anatomical Safety Limits for Combat", () => {
    const MAX_SHOULDER_ROTATION = 1.57; // ±90°
    const MAX_WRIST_FLEXION = 1.22; // ±70°
    const MAX_SPINE_ROTATION = 0.79; // ±45°
    const MAX_ELBOW_EXTENSION = 3.14; // 180° max (full extension)

    it("should respect shoulder rotation limits in counter", () => {
      GAM_WATER_FLOW_COUNTER_ANIMATION.keyframes.forEach((frame) => {
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

    it("should respect shoulder rotation limits in takedown", () => {
      GAM_FLOWING_TAKEDOWN.keyframes.forEach((frame) => {
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

    it("should respect wrist flexion limits", () => {
      const techniques = [
        GAM_WATER_FLOW_COUNTER_ANIMATION,
        GAM_FLOWING_TAKEDOWN,
      ];

      techniques.forEach((technique) => {
        technique.keyframes.forEach((frame) => {
          const leftWrist = frame.boneRotations.get(BoneName.WRIST_L);
          const rightWrist = frame.boneRotations.get(BoneName.WRIST_R);

          if (leftWrist) {
            expect(Math.abs(leftWrist.x)).toBeLessThanOrEqual(
              MAX_WRIST_FLEXION
            );
            expect(Math.abs(leftWrist.y)).toBeLessThanOrEqual(
              MAX_WRIST_FLEXION
            );
          }

          if (rightWrist) {
            expect(Math.abs(rightWrist.x)).toBeLessThanOrEqual(
              MAX_WRIST_FLEXION
            );
            expect(Math.abs(rightWrist.y)).toBeLessThanOrEqual(
              MAX_WRIST_FLEXION
            );
          }
        });
      });
    });

    it("should respect spine rotation limits", () => {
      const techniques = [
        GAM_WATER_FLOW_COUNTER_ANIMATION,
        GAM_FLOWING_TAKEDOWN,
      ];

      techniques.forEach((technique) => {
        technique.keyframes.forEach((frame) => {
          const spine = frame.boneRotations.get(BoneName.SPINE_UPPER);

          if (spine) {
            expect(Math.abs(spine.y)).toBeLessThanOrEqual(MAX_SPINE_ROTATION);
          }
        });
      });
    });

    it("should not hyperextend elbows", () => {
      const techniques = [
        GAM_WATER_FLOW_COUNTER_ANIMATION,
        GAM_FLOWING_TAKEDOWN,
      ];

      techniques.forEach((technique) => {
        technique.keyframes.forEach((frame) => {
          const leftElbow = frame.boneRotations.get(BoneName.ELBOW_L);
          const rightElbow = frame.boneRotations.get(BoneName.ELBOW_R);

          if (leftElbow) {
            expect(Math.abs(leftElbow.z)).toBeLessThanOrEqual(
              MAX_ELBOW_EXTENSION
            );
          }

          if (rightElbow) {
            expect(Math.abs(rightElbow.z)).toBeLessThanOrEqual(
              MAX_ELBOW_EXTENSION
            );
          }
        });
      });
    });
  });
});
