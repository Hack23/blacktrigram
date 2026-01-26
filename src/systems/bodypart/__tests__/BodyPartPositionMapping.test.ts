/**
 * Body Part Position Mapping Tests
 */

import { describe, it, expect } from "vitest";
import * as THREE from "three";
import {
  getBodyPartPosition,
  getBodyRegionPosition,
  mapBodyRegionToBodyPart,
  addRandomOffset,
  getInjuryPositionWithOffset,
  isPositionInBodyPart,
  CHARACTER_DIMENSIONS,
} from "../BodyPartPositionMapping";
import { BodyPart } from "../types";
import { BodyRegion } from "../../../types/common";

describe("BodyPartPositionMapping", () => {
  describe("CHARACTER_DIMENSIONS", () => {
    it("should have realistic proportions", () => {
      expect(CHARACTER_DIMENSIONS.HEIGHT).toBe(2.0);
      expect(CHARACTER_DIMENSIONS.SHOULDER_WIDTH).toBe(0.6);
      expect(CHARACTER_DIMENSIONS.HEAD_HEIGHT).toBe(0.3);
    });
  });

  describe("getBodyPartPosition", () => {
    it("should return correct position for head", () => {
      const pos = getBodyPartPosition(BodyPart.HEAD);
      expect(pos.y).toBeGreaterThan(1.5); // Head should be high
      expect(pos.x).toBe(0); // Centered
    });

    it("should return correct position for torso upper", () => {
      const pos = getBodyPartPosition(BodyPart.TORSO_UPPER);
      expect(pos.y).toBeGreaterThan(1.0);
      expect(pos.y).toBeLessThan(1.5);
      expect(pos.x).toBe(0);
    });

    it("should return correct position for left arm", () => {
      const pos = getBodyPartPosition(BodyPart.ARM_LEFT);
      expect(pos.x).toBeLessThan(0); // Left side is negative X
      expect(pos.y).toBeGreaterThan(1.0); // Arms at chest level
    });

    it("should return correct position for right arm", () => {
      const pos = getBodyPartPosition(BodyPart.ARM_RIGHT);
      expect(pos.x).toBeGreaterThan(0); // Right side is positive X
      expect(pos.y).toBeGreaterThan(1.0);
    });

    it("should return correct position for left leg", () => {
      const pos = getBodyPartPosition(BodyPart.LEG_LEFT);
      expect(pos.x).toBeLessThan(0);
      expect(pos.y).toBeLessThan(1.0); // Legs are lower
    });

    it("should return correct position for right leg", () => {
      const pos = getBodyPartPosition(BodyPart.LEG_RIGHT);
      expect(pos.x).toBeGreaterThan(0);
      expect(pos.y).toBeLessThan(1.0);
    });

    it("should return positions in logical vertical order", () => {
      const head = getBodyPartPosition(BodyPart.HEAD);
      const neck = getBodyPartPosition(BodyPart.NECK);
      const torsoUpper = getBodyPartPosition(BodyPart.TORSO_UPPER);
      const torsoLower = getBodyPartPosition(BodyPart.TORSO_LOWER);
      const leg = getBodyPartPosition(BodyPart.LEG_LEFT);

      expect(head.y).toBeGreaterThan(neck.y);
      expect(neck.y).toBeGreaterThan(torsoUpper.y);
      expect(torsoUpper.y).toBeGreaterThan(torsoLower.y);
      expect(torsoLower.y).toBeGreaterThan(leg.y);
    });
  });

  describe("getBodyRegionPosition", () => {
    it("should return position for each body region", () => {
      const regions = [
        BodyRegion.HEAD,
        BodyRegion.NECK,
        BodyRegion.TORSO,
        BodyRegion.CORE,
        BodyRegion.LEFT_ARM,
        BodyRegion.RIGHT_ARM,
        BodyRegion.LEFT_LEG,
        BodyRegion.RIGHT_LEG,
      ];

      for (const region of regions) {
        const pos = getBodyRegionPosition(region);
        expect(pos).toBeInstanceOf(THREE.Vector3);
        expect(pos.y).toBeGreaterThan(0);
        expect(pos.y).toBeLessThanOrEqual(2.0);
      }
    });

    it("should return symmetric positions for left/right pairs", () => {
      const leftArm = getBodyRegionPosition(BodyRegion.LEFT_ARM);
      const rightArm = getBodyRegionPosition(BodyRegion.RIGHT_ARM);

      expect(leftArm.x).toBeLessThan(0);
      expect(rightArm.x).toBeGreaterThan(0);
      expect(Math.abs(leftArm.x)).toBe(Math.abs(rightArm.x));
      expect(leftArm.y).toBe(rightArm.y);

      const leftLeg = getBodyRegionPosition(BodyRegion.LEFT_LEG);
      const rightLeg = getBodyRegionPosition(BodyRegion.RIGHT_LEG);

      expect(leftLeg.x).toBeLessThan(0);
      expect(rightLeg.x).toBeGreaterThan(0);
      expect(Math.abs(leftLeg.x)).toBe(Math.abs(rightLeg.x));
      expect(leftLeg.y).toBe(rightLeg.y);
    });
  });

  describe("mapBodyRegionToBodyPart", () => {
    it("should map HEAD region to HEAD part", () => {
      expect(mapBodyRegionToBodyPart(BodyRegion.HEAD)).toBe(BodyPart.HEAD);
    });

    it("should map NECK region to NECK part", () => {
      expect(mapBodyRegionToBodyPart(BodyRegion.NECK)).toBe(BodyPart.NECK);
    });

    it("should map TORSO region to TORSO_UPPER part", () => {
      expect(mapBodyRegionToBodyPart(BodyRegion.TORSO)).toBe(BodyPart.TORSO_UPPER);
    });

    it("should map CORE region to TORSO_LOWER part", () => {
      expect(mapBodyRegionToBodyPart(BodyRegion.CORE)).toBe(BodyPart.TORSO_LOWER);
    });

    it("should map LEFT_ARM region to ARM_LEFT part", () => {
      expect(mapBodyRegionToBodyPart(BodyRegion.LEFT_ARM)).toBe(BodyPart.ARM_LEFT);
    });

    it("should map RIGHT_ARM region to ARM_RIGHT part", () => {
      expect(mapBodyRegionToBodyPart(BodyRegion.RIGHT_ARM)).toBe(BodyPart.ARM_RIGHT);
    });

    it("should map LEFT_LEG region to LEG_LEFT part", () => {
      expect(mapBodyRegionToBodyPart(BodyRegion.LEFT_LEG)).toBe(BodyPart.LEG_LEFT);
    });

    it("should map RIGHT_LEG region to LEG_RIGHT part", () => {
      expect(mapBodyRegionToBodyPart(BodyRegion.RIGHT_LEG)).toBe(BodyPart.LEG_RIGHT);
    });
  });

  describe("addRandomOffset", () => {
    it("should add random offset within max bounds", () => {
      const basePosition = new THREE.Vector3(0, 1.5, 0);
      const maxOffset = 0.1;

      for (let i = 0; i < 10; i++) {
        const offsetPosition = addRandomOffset(basePosition, maxOffset);
        const distance = offsetPosition.distanceTo(basePosition);
        expect(distance).toBeLessThanOrEqual(maxOffset * Math.sqrt(3)); // Max diagonal distance
      }
    });

    it("should not modify original position", () => {
      const basePosition = new THREE.Vector3(0, 1.5, 0);
      const originalY = basePosition.y;

      addRandomOffset(basePosition, 0.1);

      expect(basePosition.y).toBe(originalY);
    });

    it("should create different positions on multiple calls", () => {
      const basePosition = new THREE.Vector3(0, 1.5, 0);
      
      // Mock Math.random to return deterministic values for testing
      const randomValues = [0.3, 0.7, 0.2, 0.8, 0.5, 0.1];
      let callIndex = 0;
      const mathRandomSpy = vi.spyOn(Math, 'random').mockImplementation(() => {
        return randomValues[callIndex++ % randomValues.length];
      });
      
      const positions: THREE.Vector3[] = [];

      for (let i = 0; i < 3; i++) {
        positions.push(addRandomOffset(basePosition, 0.1));
      }

      // With deterministic random values, positions should be different
      const allSame = positions.every((pos) =>
        pos.equals(positions[0])
      );
      expect(allSame).toBe(false);
      
      mathRandomSpy.mockRestore();
    });
  });

  describe("getInjuryPositionWithOffset", () => {
    it("should return position near body region with randomization", () => {
      const region = BodyRegion.TORSO;
      const basePosition = getBodyRegionPosition(region);

      for (let i = 0; i < 5; i++) {
        const injuryPos = getInjuryPositionWithOffset(region, 0.1);
        const distance = injuryPos.distanceTo(basePosition);
        expect(distance).toBeLessThanOrEqual(0.2); // Within max offset range
      }
    });

    it("should create varied injury positions", () => {
      const positions: THREE.Vector3[] = [];

      for (let i = 0; i < 10; i++) {
        positions.push(getInjuryPositionWithOffset(BodyRegion.TORSO, 0.1));
      }

      // Check positions have some variance
      const allSame = positions.every((pos) => pos.equals(positions[0]));
      expect(allSame).toBe(false);
    });
  });

  describe("isPositionInBodyPart", () => {
    it("should return true for position at body part center", () => {
      const headPosition = getBodyPartPosition(BodyPart.HEAD);
      expect(isPositionInBodyPart(headPosition, BodyPart.HEAD)).toBe(true);
    });

    it("should return true for position within tolerance", () => {
      const headPosition = getBodyPartPosition(BodyPart.HEAD);
      const nearbyPosition = headPosition.clone().add(new THREE.Vector3(0.1, 0.1, 0));

      expect(isPositionInBodyPart(nearbyPosition, BodyPart.HEAD, 0.3)).toBe(true);
    });

    it("should return false for position beyond tolerance", () => {
      const headPosition = getBodyPartPosition(BodyPart.HEAD);
      const farPosition = headPosition.clone().add(new THREE.Vector3(1, 1, 0));

      expect(isPositionInBodyPart(farPosition, BodyPart.HEAD, 0.3)).toBe(false);
    });

    it("should return false for position on different body part", () => {
      const headPosition = getBodyPartPosition(BodyPart.HEAD);
      expect(isPositionInBodyPart(headPosition, BodyPart.LEG_LEFT)).toBe(false);
    });
  });
});
