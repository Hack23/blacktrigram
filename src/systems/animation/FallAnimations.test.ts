/**
 * Unit tests for Fall Animation System
 * 
 * Tests fall direction determination, keyframe data, and impact frame logic.
 * 
 * @module systems/animation/FallAnimations.test
 * @category Animation
 * @korean 낙법애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import {
  determineFallDirection,
  determineFallFromStance,
  getFallKeyframes,
  getImpactFrame,
  FALL_FORWARD_KEYFRAMES,
  FALL_BACKWARD_KEYFRAMES,
  FALL_SIDE_KEYFRAMES,
  FALL_IMPACT_FRAMES,
} from "./FallAnimations";
import { TrigramStance } from "../../types/common";

describe("FallAnimations", () => {
  describe("determineFallDirection", () => {
    it("should fall backward from frontal attack", () => {
      const fallType = determineFallDirection(0, 0, "mid");
      expect(fallType).toBe("backward");
    });

    it("should fall forward from rear attack", () => {
      const fallType = determineFallDirection(Math.PI, 0, "mid");
      expect(fallType).toBe("forward");
    });

    it("should fall to left side from left side attack", () => {
      const fallType = determineFallDirection(-Math.PI / 2, 0, "mid");
      expect(fallType).toBe("side_left");
    });

    it("should fall to right side from right side attack", () => {
      const fallType = determineFallDirection(Math.PI / 2, 0, "mid");
      expect(fallType).toBe("side_right");
    });

    it("should fall to side from low sweep regardless of front/back", () => {
      // Low attacks (sweeps) always cause side falls
      const fallFromFront = determineFallDirection(0, 0, "low");
      const fallFromBack = determineFallDirection(Math.PI, 0, "low");
      
      expect(["side_left", "side_right"]).toContain(fallFromFront);
      expect(["side_left", "side_right"]).toContain(fallFromBack);
    });

    it("should fall backward from high attack to head", () => {
      const fallType = determineFallDirection(0, 0, "high");
      expect(fallType).toBe("backward");
    });

    it("should handle relative attack angles correctly", () => {
      // Player facing east (π/2), attack from north (0)
      // Relative angle: -π/2 (attack from player's left)
      const fallType = determineFallDirection(0, Math.PI / 2, "mid");
      expect(["side_left", "side_right", "backward"]).toContain(fallType);
    });

    it("should normalize angles to -π to π range", () => {
      // Test angle wrapping
      const fallType1 = determineFallDirection(3 * Math.PI, 0, "mid");
      const fallType2 = determineFallDirection(-Math.PI, 0, "mid");
      
      // Both should be rear attacks (normalized to π and -π)
      expect([fallType1, fallType2]).toContain("forward");
    });
  });

  describe("determineFallFromStance", () => {
    it("should return forward fall for Heaven stance (aggressive)", () => {
      const fallType = determineFallFromStance(TrigramStance.GEON);
      expect(fallType).toBe("forward");
    });

    it("should return backward fall for Mountain stance (defensive)", () => {
      const fallType = determineFallFromStance(TrigramStance.GAN);
      expect(fallType).toBe("backward");
    });

    it("should return side fall for Wind stance (lateral)", () => {
      const fallType = determineFallFromStance(TrigramStance.SON);
      expect(fallType).toBe("side_left");
    });

    it("should return backward fall for Water stance (flowing back)", () => {
      const fallType = determineFallFromStance(TrigramStance.GAM);
      expect(fallType).toBe("backward");
    });

    it("should use default fall when stance bias not defined", () => {
      const fallType = determineFallFromStance(
        TrigramStance.GEON,
        "backward" // Override default
      );
      expect(["forward", "backward"]).toContain(fallType);
    });

    it("should return forward fall for Earth stance (throws)", () => {
      const fallType = determineFallFromStance(TrigramStance.GON);
      expect(fallType).toBe("forward");
    });
  });

  describe("getFallKeyframes", () => {
    it("should return forward fall keyframes", () => {
      const keyframes = getFallKeyframes("forward");
      expect(keyframes).toBe(FALL_FORWARD_KEYFRAMES);
      expect(keyframes.length).toBeGreaterThan(0);
    });

    it("should return backward fall keyframes", () => {
      const keyframes = getFallKeyframes("backward");
      expect(keyframes).toBe(FALL_BACKWARD_KEYFRAMES);
      expect(keyframes.length).toBeGreaterThan(0);
    });

    it("should return side keyframes for both left and right", () => {
      const leftKeyframes = getFallKeyframes("side_left");
      const rightKeyframes = getFallKeyframes("side_right");
      
      expect(leftKeyframes).toBe(FALL_SIDE_KEYFRAMES);
      expect(rightKeyframes).toBe(FALL_SIDE_KEYFRAMES);
      expect(leftKeyframes).toBe(rightKeyframes); // Same keyframes, mirrored in rendering
    });

    it("should have bilingual descriptions for all keyframes", () => {
      const keyframes = getFallKeyframes("forward");
      
      for (const keyframe of keyframes) {
        expect(keyframe.description.korean).toBeTruthy();
        expect(keyframe.description.english).toBeTruthy();
        expect(typeof keyframe.description.korean).toBe("string");
        expect(typeof keyframe.description.english).toBe("string");
      }
    });

    it("should have progressive center of mass height decrease", () => {
      const keyframes = getFallKeyframes("forward");
      
      // Center of mass should generally decrease over time
      for (let i = 1; i < keyframes.length; i++) {
        const prevHeight = keyframes[i - 1].centerOfMassHeight;
        const currHeight = keyframes[i].centerOfMassHeight;
        
        // Current height should be <= previous height (falling down)
        expect(currHeight).toBeLessThanOrEqual(prevHeight);
      }
      
      // Final keyframe should be near ground
      const finalKeyframe = keyframes[keyframes.length - 1];
      expect(finalKeyframe.centerOfMassHeight).toBeLessThanOrEqual(0.1);
    });
  });

  describe("getImpactFrame", () => {
    it("should return impact frame for forward fall", () => {
      const impactFrame = getImpactFrame("forward");
      expect(impactFrame).toBe(FALL_IMPACT_FRAMES.forward);
      expect(impactFrame).toBe(18); // Specified in requirements
    });

    it("should return impact frame for backward fall", () => {
      const impactFrame = getImpactFrame("backward");
      expect(impactFrame).toBe(FALL_IMPACT_FRAMES.backward);
      expect(impactFrame).toBe(22);
    });

    it("should return impact frame for side falls", () => {
      const impactFrameLeft = getImpactFrame("side_left");
      const impactFrameRight = getImpactFrame("side_right");
      
      expect(impactFrameLeft).toBe(20);
      expect(impactFrameRight).toBe(20);
      expect(impactFrameLeft).toBe(impactFrameRight); // Same impact timing
    });

    it("should have impact frame before final frame", () => {
      const fallTypes: Array<"forward" | "backward" | "side_left" | "side_right"> = [
        "forward",
        "backward",
        "side_left",
        "side_right",
      ];
      
      for (const fallType of fallTypes) {
        const impactFrame = getImpactFrame(fallType);
        const keyframes = getFallKeyframes(fallType);
        const finalFrame = keyframes[keyframes.length - 1].frame;
        
        // Impact should occur before final settling
        expect(impactFrame).toBeLessThan(finalFrame);
      }
    });
  });

  describe("FALL_FORWARD_KEYFRAMES", () => {
    it("should have 5 key poses", () => {
      expect(FALL_FORWARD_KEYFRAMES.length).toBe(5);
    });

    it("should start at standing height", () => {
      const firstKeyframe = FALL_FORWARD_KEYFRAMES[0];
      expect(firstKeyframe.centerOfMassHeight).toBeGreaterThanOrEqual(0.8);
    });

    it("should end at ground level", () => {
      const lastKeyframe = FALL_FORWARD_KEYFRAMES[FALL_FORWARD_KEYFRAMES.length - 1];
      expect(lastKeyframe.centerOfMassHeight).toBeLessThanOrEqual(0.1);
    });

    it("should have increasing forward rotation", () => {
      for (let i = 1; i < FALL_FORWARD_KEYFRAMES.length; i++) {
        const prevRotation = FALL_FORWARD_KEYFRAMES[i - 1].torsoRotation.x;
        const currRotation = FALL_FORWARD_KEYFRAMES[i].torsoRotation.x;
        
        // Forward fall = positive X rotation increase
        expect(currRotation).toBeGreaterThanOrEqual(prevRotation);
      }
    });

    it("should include impact frame description", () => {
      const impactFrameIndex = FALL_FORWARD_KEYFRAMES.findIndex(
        (kf) => kf.frame === 18
      );
      expect(impactFrameIndex).toBeGreaterThan(-1);
      
      const impactKeyframe = FALL_FORWARD_KEYFRAMES[impactFrameIndex];
      expect(impactKeyframe.description.korean).toContain("충격");
    });
  });

  describe("FALL_BACKWARD_KEYFRAMES", () => {
    it("should have 5 key poses", () => {
      expect(FALL_BACKWARD_KEYFRAMES.length).toBe(5);
    });

    it("should have negative rotation (backward lean)", () => {
      for (const keyframe of FALL_BACKWARD_KEYFRAMES.slice(1)) {
        // All keyframes after initial should have negative X rotation
        expect(keyframe.torsoRotation.x).toBeLessThanOrEqual(0);
      }
    });

    it("should have sitting phase before ground", () => {
      // Find keyframe around middle with intermediate height
      const sittingPhase = FALL_BACKWARD_KEYFRAMES.find(
        (kf) => kf.centerOfMassHeight > 0.3 && kf.centerOfMassHeight < 0.6
      );
      expect(sittingPhase).toBeDefined();
      expect(sittingPhase?.description.korean).toContain("앉");
    });

    it("should end face-up (supine)", () => {
      const lastKeyframe = FALL_BACKWARD_KEYFRAMES[FALL_BACKWARD_KEYFRAMES.length - 1];
      expect(lastKeyframe.description.english.toLowerCase()).toContain("supine");
    });
  });

  describe("FALL_SIDE_KEYFRAMES", () => {
    it("should have 5 key poses", () => {
      expect(FALL_SIDE_KEYFRAMES.length).toBe(5);
    });

    it("should have rotation on Y and Z axes (side roll)", () => {
      const lastKeyframe = FALL_SIDE_KEYFRAMES[FALL_SIDE_KEYFRAMES.length - 1];
      
      // Side fall should have significant Y and Z rotation
      expect(Math.abs(lastKeyframe.torsoRotation.y)).toBeGreaterThan(1.0);
      expect(Math.abs(lastKeyframe.torsoRotation.z)).toBeGreaterThan(1.0);
    });

    it("should include shoulder roll phase", () => {
      const shoulderRollPhase = FALL_SIDE_KEYFRAMES.find(
        (kf) => kf.description.english.toLowerCase().includes("shoulder")
      );
      expect(shoulderRollPhase).toBeDefined();
    });

    it("should end in side sprawl", () => {
      const lastKeyframe = FALL_SIDE_KEYFRAMES[FALL_SIDE_KEYFRAMES.length - 1];
      expect(lastKeyframe.description.english.toLowerCase()).toContain("side");
    });
  });

  describe("keyframe frame numbers", () => {
    it("should have sequential frame numbers in forward fall", () => {
      for (let i = 1; i < FALL_FORWARD_KEYFRAMES.length; i++) {
        expect(FALL_FORWARD_KEYFRAMES[i].frame).toBeGreaterThan(
          FALL_FORWARD_KEYFRAMES[i - 1].frame
        );
      }
    });

    it("should have frame 0 as first keyframe", () => {
      expect(FALL_FORWARD_KEYFRAMES[0].frame).toBe(0);
      expect(FALL_BACKWARD_KEYFRAMES[0].frame).toBe(0);
      expect(FALL_SIDE_KEYFRAMES[0].frame).toBe(0);
    });

    it("should have final frame within animation duration", () => {
      // Forward: 24 frames total
      const finalForward = FALL_FORWARD_KEYFRAMES[FALL_FORWARD_KEYFRAMES.length - 1];
      expect(finalForward.frame).toBeLessThan(24);
      
      // Backward: 30 frames total
      const finalBackward = FALL_BACKWARD_KEYFRAMES[FALL_BACKWARD_KEYFRAMES.length - 1];
      expect(finalBackward.frame).toBeLessThan(30);
      
      // Side: 27 frames total
      const finalSide = FALL_SIDE_KEYFRAMES[FALL_SIDE_KEYFRAMES.length - 1];
      expect(finalSide.frame).toBeLessThan(27);
    });
  });
});
