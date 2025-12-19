/**
 * Unit tests for HandPoses system
 * 
 * Tests Korean martial arts hand poses, finger curl/spread interpolation,
 * and hand animation state management.
 * 
 * @module systems/animation/HandPoses.test
 * @category Tests
 * @korean 손자세테스트
 */

import { describe, it, expect } from "vitest";
import * as THREE from "three";
import {
  HAND_POSES,
  FIST_POSE,
  KNIFE_HAND_POSE,
  SPEAR_HAND_POSE,
  PALM_HEEL_POSE,
  GRAPPLING_POSE,
  OPEN_POSE,
  getHandPose,
  getTechniqueHandPose,
  interpolateFingerCurl,
  interpolateFingerSpread,
  interpolateWristRotation,
  createInitialHandAnimationState,
  updateHandAnimationState,
  setHandHighlight,
  TECHNIQUE_HAND_POSES,
} from "./HandPoses";
import { HandPoseType } from "../../types/hand-animation";

describe("HandPoses System", () => {
  describe("Hand Pose Definitions", () => {
    it("should define all 6 Korean martial arts hand poses", () => {
      expect(HAND_POSES).toBeDefined();
      expect(Object.keys(HAND_POSES).length).toBe(6);
      expect(HAND_POSES[HandPoseType.FIST]).toBe(FIST_POSE);
      expect(HAND_POSES[HandPoseType.KNIFE_HAND]).toBe(KNIFE_HAND_POSE);
      expect(HAND_POSES[HandPoseType.SPEAR_HAND]).toBe(SPEAR_HAND_POSE);
      expect(HAND_POSES[HandPoseType.PALM_HEEL]).toBe(PALM_HEEL_POSE);
      expect(HAND_POSES[HandPoseType.GRAPPLING]).toBe(GRAPPLING_POSE);
      expect(HAND_POSES[HandPoseType.OPEN]).toBe(OPEN_POSE);
    });

    it("should have correct Korean names for all poses", () => {
      expect(FIST_POSE.nameKorean).toBe("주먹");
      expect(KNIFE_HAND_POSE.nameKorean).toBe("수도");
      expect(SPEAR_HAND_POSE.nameKorean).toBe("관수");
      expect(PALM_HEEL_POSE.nameKorean).toBe("장력");
      expect(GRAPPLING_POSE.nameKorean).toBe("잡기");
      expect(OPEN_POSE.nameKorean).toBe("펴기");
    });

    it("should have correct martial art origins", () => {
      expect(FIST_POSE.martialArtOrigin).toBe("taekwondo");
      expect(KNIFE_HAND_POSE.martialArtOrigin).toBe("hapkido");
      expect(SPEAR_HAND_POSE.martialArtOrigin).toBe("traditional");
      expect(PALM_HEEL_POSE.martialArtOrigin).toBe("taekwondo");
      expect(GRAPPLING_POSE.martialArtOrigin).toBe("hapkido");
      expect(OPEN_POSE.martialArtOrigin).toBe("traditional");
    });

    it("should have correct striking surfaces", () => {
      expect(FIST_POSE.strikingSurface).toBe("knuckles");
      expect(KNIFE_HAND_POSE.strikingSurface).toBe("knife_edge");
      expect(SPEAR_HAND_POSE.strikingSurface).toBe("fingertips");
      expect(PALM_HEEL_POSE.strikingSurface).toBe("palm_heel");
      expect(GRAPPLING_POSE.strikingSurface).toBe("whole_hand");
      expect(OPEN_POSE.strikingSurface).toBe("whole_hand");
    });
  });

  describe("Fist Pose (주먹)", () => {
    it("should have all fingers fully curled", () => {
      expect(FIST_POSE.fingerCurl.thumb).toBe(0.8);
      expect(FIST_POSE.fingerCurl.index).toBe(1.0);
      expect(FIST_POSE.fingerCurl.middle).toBe(1.0);
      expect(FIST_POSE.fingerCurl.ring).toBe(1.0);
      expect(FIST_POSE.fingerCurl.pinky).toBe(1.0);
    });

    it("should have fingers together", () => {
      expect(FIST_POSE.fingerSpread.thumbIndex).toBe(0.0);
      expect(FIST_POSE.fingerSpread.indexMiddle).toBe(0.0);
      expect(FIST_POSE.fingerSpread.middleRing).toBe(0.0);
      expect(FIST_POSE.fingerSpread.ringPinky).toBe(0.0);
    });

    it("should have neutral wrist rotation", () => {
      expect(FIST_POSE.wristRotation.x).toBe(0);
      expect(FIST_POSE.wristRotation.y).toBe(0);
      expect(FIST_POSE.wristRotation.z).toBe(0);
    });
  });

  describe("Knife-Hand Pose (수도)", () => {
    it("should have fingers extended except thumb", () => {
      expect(KNIFE_HAND_POSE.fingerCurl.thumb).toBe(0.5); // Thumb tucked
      expect(KNIFE_HAND_POSE.fingerCurl.index).toBe(0.0);
      expect(KNIFE_HAND_POSE.fingerCurl.middle).toBe(0.0);
      expect(KNIFE_HAND_POSE.fingerCurl.ring).toBe(0.0);
      expect(KNIFE_HAND_POSE.fingerCurl.pinky).toBe(0.0);
    });

    it("should have edge-down wrist rotation", () => {
      expect(KNIFE_HAND_POSE.wristRotation.z).toBeCloseTo(-Math.PI / 2, 5);
    });
  });

  describe("Spear-Hand Pose (관수)", () => {
    it("should have all fingers fully extended", () => {
      expect(SPEAR_HAND_POSE.fingerCurl.thumb).toBe(0.0);
      expect(SPEAR_HAND_POSE.fingerCurl.index).toBe(0.0);
      expect(SPEAR_HAND_POSE.fingerCurl.middle).toBe(0.0);
      expect(SPEAR_HAND_POSE.fingerCurl.ring).toBe(0.0);
      expect(SPEAR_HAND_POSE.fingerCurl.pinky).toBe(0.0);
    });

    it("should have fingers pressed together", () => {
      expect(SPEAR_HAND_POSE.fingerSpread.thumbIndex).toBe(0.0);
      expect(SPEAR_HAND_POSE.fingerSpread.indexMiddle).toBe(0.0);
    });
  });

  describe("Palm-Heel Pose (장력)", () => {
    it("should have fingers half curled", () => {
      expect(PALM_HEEL_POSE.fingerCurl.thumb).toBe(0.3);
      expect(PALM_HEEL_POSE.fingerCurl.index).toBe(0.5);
      expect(PALM_HEEL_POSE.fingerCurl.middle).toBe(0.5);
      expect(PALM_HEEL_POSE.fingerCurl.ring).toBe(0.5);
      expect(PALM_HEEL_POSE.fingerCurl.pinky).toBe(0.5);
    });

    it("should have wrist extended back", () => {
      expect(PALM_HEEL_POSE.wristRotation.x).toBeCloseTo(-0.3, 5);
    });
  });

  describe("getHandPose", () => {
    it("should return correct pose for each HandPoseType", () => {
      expect(getHandPose(HandPoseType.FIST)).toBe(FIST_POSE);
      expect(getHandPose(HandPoseType.KNIFE_HAND)).toBe(KNIFE_HAND_POSE);
      expect(getHandPose(HandPoseType.SPEAR_HAND)).toBe(SPEAR_HAND_POSE);
      expect(getHandPose(HandPoseType.PALM_HEEL)).toBe(PALM_HEEL_POSE);
      expect(getHandPose(HandPoseType.GRAPPLING)).toBe(GRAPPLING_POSE);
      expect(getHandPose(HandPoseType.OPEN)).toBe(OPEN_POSE);
    });
  });

  describe("Technique Hand Pose Mappings", () => {
    it("should map jab technique to fist pose", () => {
      const techPose = getTechniqueHandPose("jab");
      expect(techPose.leftHandPose).toBe(HandPoseType.FIST);
      expect(techPose.rightHandPose).toBe(HandPoseType.FIST);
    });

    it("should map knife_hand_strike to knife-hand pose", () => {
      const techPose = getTechniqueHandPose("knife_hand_strike");
      expect(techPose.leftHandPose).toBe(HandPoseType.KNIFE_HAND);
      expect(techPose.rightHandPose).toBe(HandPoseType.OPEN);
    });

    it("should map spear_hand_thrust to spear-hand pose", () => {
      const techPose = getTechniqueHandPose("spear_hand_thrust");
      expect(techPose.leftHandPose).toBe(HandPoseType.SPEAR_HAND);
    });

    it("should map palm_heel_strike to palm-heel pose", () => {
      const techPose = getTechniqueHandPose("palm_heel_strike");
      expect(techPose.leftHandPose).toBe(HandPoseType.PALM_HEEL);
    });

    it("should default to open pose for unknown technique", () => {
      const techPose = getTechniqueHandPose("unknown_technique");
      expect(techPose.leftHandPose).toBe(HandPoseType.OPEN);
      expect(techPose.rightHandPose).toBe(HandPoseType.OPEN);
    });

    it("should have appropriate transition durations", () => {
      expect(TECHNIQUE_HAND_POSES.jab.transitionDuration).toBe(0.1);
      expect(TECHNIQUE_HAND_POSES.knife_hand_strike.transitionDuration).toBe(0.15);
      expect(TECHNIQUE_HAND_POSES.grab.transitionDuration).toBe(0.2);
    });
  });

  describe("interpolateFingerCurl", () => {
    it("should interpolate from open to fist at 0% progress", () => {
      const from = OPEN_POSE.fingerCurl;
      const to = FIST_POSE.fingerCurl;
      const result = interpolateFingerCurl(from, to, 0);
      
      expect(result.thumb).toBeCloseTo(from.thumb, 5);
      expect(result.index).toBeCloseTo(from.index, 5);
      expect(result.middle).toBeCloseTo(from.middle, 5);
      expect(result.ring).toBeCloseTo(from.ring, 5);
      expect(result.pinky).toBeCloseTo(from.pinky, 5);
    });

    it("should interpolate from open to fist at 100% progress", () => {
      const from = OPEN_POSE.fingerCurl;
      const to = FIST_POSE.fingerCurl;
      const result = interpolateFingerCurl(from, to, 1);
      
      expect(result.thumb).toBeCloseTo(to.thumb, 5);
      expect(result.index).toBeCloseTo(to.index, 5);
      expect(result.middle).toBeCloseTo(to.middle, 5);
      expect(result.ring).toBeCloseTo(to.ring, 5);
      expect(result.pinky).toBeCloseTo(to.pinky, 5);
    });

    it("should interpolate from open to fist at 50% progress", () => {
      const from = OPEN_POSE.fingerCurl;
      const to = FIST_POSE.fingerCurl;
      const result = interpolateFingerCurl(from, to, 0.5);
      
      // At 50%, should be halfway between open (0.2) and fist (0.8 or 1.0)
      expect(result.thumb).toBeCloseTo(0.5, 1); // (0.2 + 0.8) / 2 = 0.5
      expect(result.index).toBeCloseTo(0.6, 1); // (0.2 + 1.0) / 2 = 0.6
    });

    it("should clamp progress to [0, 1] range", () => {
      const from = OPEN_POSE.fingerCurl;
      const to = FIST_POSE.fingerCurl;
      
      // Test negative progress
      const resultNeg = interpolateFingerCurl(from, to, -0.5);
      expect(resultNeg.thumb).toBeCloseTo(from.thumb, 5);
      
      // Test progress > 1
      const resultPos = interpolateFingerCurl(from, to, 1.5);
      expect(resultPos.thumb).toBeCloseTo(to.thumb, 5);
    });
  });

  describe("interpolateFingerSpread", () => {
    it("should interpolate spread values correctly", () => {
      const from = OPEN_POSE.fingerSpread;
      const to = FIST_POSE.fingerSpread;
      const result = interpolateFingerSpread(from, to, 0.5);
      
      // Should be halfway between natural spread and together
      expect(result.thumbIndex).toBeLessThan(from.thumbIndex);
      expect(result.thumbIndex).toBeGreaterThan(to.thumbIndex);
    });
  });

  describe("interpolateWristRotation", () => {
    it("should interpolate wrist rotation correctly", () => {
      const from = new THREE.Euler(0, 0, 0);
      const to = new THREE.Euler(0.5, 0, -Math.PI / 2);
      const result = interpolateWristRotation(from, to, 0.5);
      
      expect(result.x).toBeCloseTo(0.25, 5);
      expect(result.z).toBeCloseTo(-Math.PI / 4, 5);
    });

    it("should clamp progress to [0, 1] range", () => {
      const from = new THREE.Euler(0, 0, 0);
      const to = new THREE.Euler(1, 0, 0);
      
      const resultNeg = interpolateWristRotation(from, to, -0.5);
      expect(resultNeg.x).toBeCloseTo(0, 5);
      
      const resultPos = interpolateWristRotation(from, to, 1.5);
      expect(resultPos.x).toBeCloseTo(1, 5);
    });
  });

  describe("Hand Animation State", () => {
    it("should create initial state with open pose", () => {
      const state = createInitialHandAnimationState();
      expect(state.currentPose).toBe(HandPoseType.OPEN);
      expect(state.targetPose).toBeNull();
      expect(state.transitionProgress).toBe(1.0);
      expect(state.isHighlighted).toBe(false);
      expect(state.highlightMode).toBeNull();
    });

    it("should create initial state with custom pose", () => {
      const state = createInitialHandAnimationState(HandPoseType.FIST);
      expect(state.currentPose).toBe(HandPoseType.FIST);
      expect(state.currentFingerCurl.thumb).toBe(0.8);
      expect(state.currentFingerCurl.index).toBe(1.0);
    });

    it("should update state with no transition when target is current", () => {
      const state = createInitialHandAnimationState(HandPoseType.OPEN);
      const updated = updateHandAnimationState(state, HandPoseType.OPEN, 0.1);
      
      expect(updated.currentPose).toBe(HandPoseType.OPEN);
      expect(updated.targetPose).toBeNull();
      expect(updated.transitionProgress).toBe(1.0);
    });

    it("should start transition to new pose", () => {
      const state = createInitialHandAnimationState(HandPoseType.OPEN);
      const updated = updateHandAnimationState(state, HandPoseType.FIST, 0.0, 0.2);
      
      expect(updated.currentPose).toBe(HandPoseType.OPEN);
      expect(updated.targetPose).toBe(HandPoseType.FIST);
      expect(updated.transitionProgress).toBe(0.0);
    });

    it("should progress transition over time", () => {
      const state = createInitialHandAnimationState(HandPoseType.OPEN);
      const state1 = updateHandAnimationState(state, HandPoseType.FIST, 0.0, 0.2);
      const state2 = updateHandAnimationState(state1, HandPoseType.FIST, 0.1, 0.2);
      
      expect(state2.transitionProgress).toBeCloseTo(0.5, 1); // 0.1s / 0.2s = 50%
      expect(state2.currentFingerCurl.index).toBeGreaterThan(0.2); // Partway to 1.0
      expect(state2.currentFingerCurl.index).toBeLessThan(1.0);
    });

    it("should complete transition when progress reaches 1.0", () => {
      const state = createInitialHandAnimationState(HandPoseType.OPEN);
      const state1 = updateHandAnimationState(state, HandPoseType.FIST, 0.0, 0.2);
      const state2 = updateHandAnimationState(state1, HandPoseType.FIST, 0.2, 0.2);
      
      expect(state2.transitionProgress).toBe(1.0);
      expect(state2.currentPose).toBe(HandPoseType.FIST);
      expect(state2.targetPose).toBeNull();
      expect(state2.currentFingerCurl.thumb).toBe(0.8);
      expect(state2.currentFingerCurl.index).toBe(1.0);
    });
  });

  describe("Hand Highlighting", () => {
    it("should set hand highlight mode", () => {
      const state = createInitialHandAnimationState();
      const highlighted = setHandHighlight(state, true, "knuckles");
      
      expect(highlighted.isHighlighted).toBe(true);
      expect(highlighted.highlightMode).toBe("knuckles");
    });

    it("should clear highlight mode when disabled", () => {
      const state = createInitialHandAnimationState();
      const highlighted = setHandHighlight(state, true, "fingertips");
      const cleared = setHandHighlight(highlighted, false);
      
      expect(cleared.isHighlighted).toBe(false);
      expect(cleared.highlightMode).toBeNull();
    });

    it("should support different highlight modes", () => {
      const state = createInitialHandAnimationState();
      
      const knuckles = setHandHighlight(state, true, "knuckles");
      expect(knuckles.highlightMode).toBe("knuckles");
      
      const palm = setHandHighlight(state, true, "palm");
      expect(palm.highlightMode).toBe("palm");
      
      const knifeEdge = setHandHighlight(state, true, "knife_edge");
      expect(knifeEdge.highlightMode).toBe("knife_edge");
      
      const fingertips = setHandHighlight(state, true, "fingertips");
      expect(fingertips.highlightMode).toBe("fingertips");
    });
  });
});
