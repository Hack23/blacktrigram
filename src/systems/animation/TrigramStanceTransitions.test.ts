/**
 * Tests for Trigram Stance Transition System
 * 
 * Validates trigram-specific animation transitions including:
 * - Transition duration calculation based on stance distance
 * - Complete stance-to-stance transition animations
 * - Footwork keyframes and weight transfer
 * - Guard pose blending
 * - Laterality support
 * - All 64 stance-to-stance combinations
 * 
 * @module systems/animation/TrigramStanceTransitions.test
 * @category Animation System Tests
 * @korean 팔괘자세전환테스트
 */

import { describe, it, expect, beforeAll, vi } from "vitest";
import { TrigramStance } from "../../types/common";
import {
  calculateTransitionDuration,
  transitionBetweenStances,
  initializeStanceTransitions,
  getStanceTransition,
  TRIGRAM_STANCES_ORDER,
  STANCE_TRANSITIONS,
} from "./TrigramStanceTransitions";
import type { StanceLaterality } from "../trigram/types";
import { getGuardPoseForStance } from "./StanceGuardPoses";

describe("TrigramStanceTransitions", () => {
  beforeAll(() => {
    // Ensure transitions are initialized before tests
    initializeStanceTransitions();
  });

  describe("calculateTransitionDuration", () => {
    it("should return 0.3s for same stance (laterality change)", () => {
      const duration = calculateTransitionDuration(
        TrigramStance.GEON,
        TrigramStance.GEON
      );
      expect(duration).toBe(0.3);
    });

    it("should return 0.2s for adjacent stances (1 step apart)", () => {
      // Geon → Tae (adjacent in wheel)
      const duration = calculateTransitionDuration(
        TrigramStance.GEON,
        TrigramStance.TAE
      );
      expect(duration).toBeCloseTo(0.2, 2);
    });

    it("should return 0.2s for adjacent stances (2 steps apart)", () => {
      // Geon → Li (2 steps apart in wheel)
      const duration = calculateTransitionDuration(
        TrigramStance.GEON,
        TrigramStance.LI
      );
      expect(duration).toBeCloseTo(0.2, 2);
    });

    it("should return 0.3s for medium distance stances (3 steps apart)", () => {
      // Geon → Jin (3 steps apart in wheel)
      const duration = calculateTransitionDuration(
        TrigramStance.GEON,
        TrigramStance.JIN
      );
      expect(duration).toBeCloseTo(0.3, 2);
    });

    it("should return 0.4s for opposite stances (4 steps apart)", () => {
      // Geon → Son (4 steps apart - opposite side of wheel)
      const duration = calculateTransitionDuration(
        TrigramStance.GEON,
        TrigramStance.SON
      );
      expect(duration).toBeCloseTo(0.4, 2);
    });

    it("should handle circular distance correctly (wrap around)", () => {
      // Gon → Geon (1 step wrapping around)
      const duration = calculateTransitionDuration(
        TrigramStance.GON,
        TrigramStance.GEON
      );
      expect(duration).toBeCloseTo(0.2, 2);
    });

    it("should return same duration regardless of direction", () => {
      const forward = calculateTransitionDuration(
        TrigramStance.GEON,
        TrigramStance.TAE
      );
      const backward = calculateTransitionDuration(
        TrigramStance.TAE,
        TrigramStance.GEON
      );
      expect(forward).toBe(backward);
    });

    it("should handle all stance pairs consistently", () => {
      const stances = Object.values(TrigramStance);
      
      stances.forEach(from => {
        stances.forEach(to => {
          const duration = calculateTransitionDuration(from, to);
          
          // Durations should be one of the valid values
          expect([0.2, 0.3, 0.4]).toContain(duration);
        });
      });
    });
  });

  describe("transitionBetweenStances", () => {
    describe("basic transition properties", () => {
      it("should generate transition for adjacent stances (Geon→Tae)", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        expect(transition).toBeDefined();
        expect(transition.name).toContain("geon_to_tae");
        expect(transition.koreanName).toContain("geon");
        expect(transition.koreanName).toContain("tae");
        expect(transition.type).toBe("stance");
      });

      it("should use correct duration for adjacent stances", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        expect(transition.duration).toBeCloseTo(0.2, 2);
      });

      it("should generate longer transition for opposite stances (Geon→Son)", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.SON,
          "left"
        );
        
        expect(transition.duration).toBeCloseTo(0.4, 2);
      });

      it("should include laterality in Korean name", () => {
        const leftTransition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "left"
        );
        const rightTransition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        expect(leftTransition.koreanName).toContain("왼"); // Left
        expect(rightTransition.koreanName).toContain("오른"); // Right
      });

      it("should not loop", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        expect(transition.loop).toBe(false);
      });
    });

    describe("keyframe structure", () => {
      it("should have at least 4 keyframes (start, weight transfer, guard blend, end)", () => {
        const transition = transitionBetweenStances(
          TrigramStance.LI,
          TrigramStance.GAM,
          "right"
        );
        
        expect(transition.keyframes.length).toBeGreaterThanOrEqual(4);
      });

      it("should have keyframes at expected time points", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        const times = transition.keyframes.map(kf => kf.time);
        
        // Should have keyframe at start (0)
        expect(times).toContain(0);
        
        // Should have keyframe at end (duration)
        expect(times).toContain(transition.duration);
        
        // Should have intermediate keyframes
        expect(times.length).toBeGreaterThanOrEqual(4);
        
        // Times should be in ascending order
        for (let i = 1; i < times.length; i++) {
          expect(times[i]).toBeGreaterThan(times[i - 1]);
        }
      });

      it("should include weight transfer phase (~40% of duration)", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        const weightTransferTime = transition.duration * 0.4;
        const times = transition.keyframes.map(kf => kf.time);
        
        // Should have a keyframe close to 40% mark
        const hasWeightTransferKeyframe = times.some(
          t => Math.abs(t - weightTransferTime) < 0.01
        );
        expect(hasWeightTransferKeyframe).toBe(true);
      });

      it("should include guard blend phase (~70% of duration)", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        const guardBlendTime = transition.duration * 0.7;
        const times = transition.keyframes.map(kf => kf.time);
        
        // Should have a keyframe close to 70% mark
        const hasGuardBlendKeyframe = times.some(
          t => Math.abs(t - guardBlendTime) < 0.01
        );
        expect(hasGuardBlendKeyframe).toBe(true);
      });
    });

    describe("bone rotations and positions", () => {
      it("should have bone rotations in start frame", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        const startFrame = transition.keyframes[0];
        expect(startFrame.boneRotations.size).toBeGreaterThan(0);
      });

      it("should have bone rotations in end frame", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        const endFrame = transition.keyframes[transition.keyframes.length - 1];
        expect(endFrame.boneRotations.size).toBeGreaterThan(0);
      });

      it("should have bone positions for feet", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        const startFrame = transition.keyframes[0];
        expect(startFrame.bonePositions.size).toBeGreaterThan(0);
      });

      it("should include arm bone rotations (shoulders, elbows, wrists)", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        const startFrame = transition.keyframes[0];
        const boneNames = Array.from(startFrame.boneRotations.keys());
        
        // Should have shoulder rotations
        expect(boneNames.some(name => name.includes("shoulder"))).toBe(true);
        
        // Should have elbow rotations
        expect(boneNames.some(name => name.includes("elbow"))).toBe(true);
      });

      it("should include leg bone rotations (hips, knees, feet)", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        const startFrame = transition.keyframes[0];
        const boneNames = Array.from(startFrame.boneRotations.keys());
        
        // Should have hip rotations
        expect(boneNames.some(name => name.includes("hip"))).toBe(true);
        
        // Should have knee rotations
        expect(boneNames.some(name => name.includes("knee"))).toBe(true);
        
        // Should have foot rotations
        expect(boneNames.some(name => name.includes("foot"))).toBe(true);
      });

      it("should include torso and pelvis rotations", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        const startFrame = transition.keyframes[0];
        const boneNames = Array.from(startFrame.boneRotations.keys());
        
        // Should have spine rotation
        expect(boneNames.some(name => name.includes("spine"))).toBe(true);
        
        // Should have pelvis rotation
        expect(boneNames.some(name => name.includes("pelvis"))).toBe(true);
      });
    });

    describe("guard pose blending", () => {
      it("should blend from source guard to target guard", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        const startFrame = transition.keyframes[0];
        const endFrame = transition.keyframes[transition.keyframes.length - 1];
        
        // Verify bones are animated (rotations change during transition)
        expect(startFrame.boneRotations.size).toBeGreaterThan(0);
        expect(endFrame.boneRotations.size).toBeGreaterThan(0);
        
        // Start and end frames should have different rotations for at least some bones
        // (since we're transitioning between different stances)
        let hasChangedRotation = false;
        startFrame.boneRotations.forEach((startRot, boneName) => {
          const endRot = endFrame.boneRotations.get(boneName);
          if (endRot) {
            if (
              Math.abs(startRot.x - endRot.x) > 0.01 ||
              Math.abs(startRot.y - endRot.y) > 0.01 ||
              Math.abs(startRot.z - endRot.z) > 0.01
            ) {
              hasChangedRotation = true;
            }
          }
        });
        
        expect(hasChangedRotation).toBe(true);
      });

      it("should have intermediate blending in middle keyframes", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        expect(transition.keyframes.length).toBeGreaterThanOrEqual(3);
        
        // Middle keyframes should exist
        const middleFrames = transition.keyframes.slice(1, -1);
        expect(middleFrames.length).toBeGreaterThan(0);
        
        // Middle keyframes should have bone rotations
        middleFrames.forEach(frame => {
          expect(frame.boneRotations.size).toBeGreaterThan(0);
        });
      });
    });

    describe("laterality support", () => {
      it("should generate different transitions for left vs right laterality", () => {
        const leftTransition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "left"
        );
        const rightTransition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        // Names should be different
        expect(leftTransition.name).not.toBe(rightTransition.name);
        expect(leftTransition.koreanName).not.toBe(rightTransition.koreanName);
        
        // Both should have same duration
        expect(leftTransition.duration).toBe(rightTransition.duration);
      });

      it("should apply laterality to both from and to stances", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "left"
        );
        
        // Transition should be named with left laterality
        expect(transition.name).toContain("left");
        expect(transition.koreanName).toContain("왼");
      });
    });

    describe("footwork and weight transfer", () => {
      it("should adjust foot positions based on stance width", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.GAM,
          "right"
        );
        
        const startFrame = transition.keyframes[0];
        const endFrame = transition.keyframes[transition.keyframes.length - 1];
        
        // Should have foot positions in both frames
        expect(startFrame.bonePositions.size).toBeGreaterThan(0);
        expect(endFrame.bonePositions.size).toBeGreaterThan(0);
        
        // Foot positions should change (different stance widths)
        const startLeftFoot = startFrame.bonePositions.get("foot_L");
        const endLeftFoot = endFrame.bonePositions.get("foot_L");
        
        if (startLeftFoot && endLeftFoot) {
          // Positions should be different (unless stances have same width)
          const positionChanged = 
            Math.abs(startLeftFoot.x - endLeftFoot.x) > 0.001 ||
            Math.abs(startLeftFoot.y - endLeftFoot.y) > 0.001 ||
            Math.abs(startLeftFoot.z - endLeftFoot.z) > 0.001;
          
          // Get guard poses to check if widths are different
          const fromGuard = getGuardPoseForStance(TrigramStance.GEON, "right");
          const toGuard = getGuardPoseForStance(TrigramStance.GAM, "right");
          
          // Some stances may have the same width, so we only test when they differ
          if (fromGuard && toGuard && fromGuard.stanceWidth !== toGuard.stanceWidth) {
            expect(positionChanged).toBe(true);
          }
        }
      });

      it("should include knee bending for weight transfer", () => {
        const transition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.TAE,
          "right"
        );
        
        // Weight transfer keyframe should have knee rotations
        const weightTransferFrame = transition.keyframes[1]; // Second keyframe
        const kneeRotations = Array.from(weightTransferFrame.boneRotations.keys())
          .filter(name => name.includes("knee"));
        
        expect(kneeRotations.length).toBeGreaterThan(0);
      });
    });

    describe("all stance combinations", () => {
      it("should generate all 64 stance-to-stance transitions (8×8)", () => {
        const stances = Object.values(TrigramStance);
        
        stances.forEach(from => {
          stances.forEach(to => {
            // Test right laterality (left is tested separately)
            const transition = transitionBetweenStances(from, to, "right");
            
            expect(transition).toBeDefined();
            expect(transition.name).toBeDefined();
            expect(transition.keyframes.length).toBeGreaterThan(0);
            expect(transition.duration).toBeGreaterThan(0);
          });
        });
      });

      it("should generate transitions for all stances with both lateralities", () => {
        const stances = Object.values(TrigramStance);
        const lateralities: StanceLaterality[] = ["left", "right"];
        
        let transitionCount = 0;
        
        stances.forEach(from => {
          stances.forEach(to => {
            lateralities.forEach(laterality => {
              const transition = transitionBetweenStances(from, to, laterality);
              
              expect(transition).toBeDefined();
              transitionCount++;
            });
          });
        });
        
        // Should have 8 × 8 × 2 = 128 transitions
        expect(transitionCount).toBe(128);
      });

      it("should handle same-stance transitions with different laterality", () => {
        const sameStanceTransition = transitionBetweenStances(
          TrigramStance.GEON,
          TrigramStance.GEON,
          "left"
        );
        
        expect(sameStanceTransition.duration).toBeCloseTo(0.3, 2);
        expect(sameStanceTransition.keyframes.length).toBeGreaterThanOrEqual(4);
      });
    });

    describe("error handling", () => {
      it("should throw error for invalid from stance", () => {
        expect(() => {
          transitionBetweenStances(
            "invalid" as TrigramStance,
            TrigramStance.TAE,
            "right"
          );
        }).toThrow();
      });

      it("should throw error for invalid to stance", () => {
        expect(() => {
          transitionBetweenStances(
            TrigramStance.GEON,
            "invalid" as TrigramStance,
            "right"
          );
        }).toThrow();
      });

      it("should warn and use default duration for stance not in TRIGRAM_STANCES_ORDER", () => {
        // Create a spy to capture console.warn calls
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        
        // Use a stance that's technically valid but may not be in the order array
        // This simulates the runtime scenario where indexOf returns -1
        const duration = calculateTransitionDuration(
          "invalid_stance" as TrigramStance,
          TrigramStance.TAE
        );
        
        // Should have warned about invalid stance
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining("Invalid stance in transition")
        );
        
        // Should return default duration (0.3)
        expect(duration).toBe(0.3);
        
        warnSpy.mockRestore();
      });
    });
  });

  describe("initializeStanceTransitions", () => {
    it("should populate STANCE_TRANSITIONS map", () => {
      expect(STANCE_TRANSITIONS.size).toBeGreaterThan(0);
    });

    it("should create 128 transitions (8×8×2 laterality)", () => {
      expect(STANCE_TRANSITIONS.size).toBe(128);
    });

    it("should create transitions for all stance pairs with both lateralities", () => {
      const stances = Object.values(TrigramStance);
      const lateralities: StanceLaterality[] = ["left", "right"];
      
      stances.forEach(from => {
        stances.forEach(to => {
          lateralities.forEach(laterality => {
            const key = `${from}_${to}_${laterality}`;
            expect(STANCE_TRANSITIONS.has(key)).toBe(true);
          });
        });
      });
    });

    it("should store transitions with correct keys", () => {
      const transition = STANCE_TRANSITIONS.get("geon_tae_right");
      
      expect(transition).toBeDefined();
      expect(transition?.name).toContain("geon_to_tae");
    });
  });

  describe("getStanceTransition", () => {
    it("should retrieve existing transition", () => {
      const transition = getStanceTransition(
        TrigramStance.GEON,
        TrigramStance.TAE,
        "right"
      );
      
      expect(transition).toBeDefined();
      expect(transition?.name).toContain("geon_to_tae");
    });

    it("should return undefined for non-existent transition", () => {
      const transition = getStanceTransition(
        "invalid" as TrigramStance,
        TrigramStance.TAE,
        "right"
      );
      
      expect(transition).toBeUndefined();
    });

    it("should retrieve transitions for both lateralities", () => {
      const leftTransition = getStanceTransition(
        TrigramStance.GEON,
        TrigramStance.TAE,
        "left"
      );
      const rightTransition = getStanceTransition(
        TrigramStance.GEON,
        TrigramStance.TAE,
        "right"
      );
      
      expect(leftTransition).toBeDefined();
      expect(rightTransition).toBeDefined();
      expect(leftTransition?.name).not.toBe(rightTransition?.name);
    });

    it("should retrieve all 64 stance pair transitions", () => {
      const stances = Object.values(TrigramStance);
      
      stances.forEach(from => {
        stances.forEach(to => {
          const transition = getStanceTransition(from, to, "right");
          
          expect(transition).toBeDefined();
          expect(transition?.keyframes.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("TRIGRAM_STANCES_ORDER", () => {
    it("should contain all 8 trigram stances", () => {
      expect(TRIGRAM_STANCES_ORDER.length).toBe(8);
    });

    it("should contain all unique stances", () => {
      const uniqueStances = new Set(TRIGRAM_STANCES_ORDER);
      expect(uniqueStances.size).toBe(8);
    });

    it("should contain each trigram stance exactly once", () => {
      const stances = Object.values(TrigramStance);
      
      stances.forEach(stance => {
        const count = TRIGRAM_STANCES_ORDER.filter(s => s === stance).length;
        expect(count).toBe(1);
      });
    });

    it("should match traditional Bagua order", () => {
      expect(TRIGRAM_STANCES_ORDER[0]).toBe(TrigramStance.GEON);
      expect(TRIGRAM_STANCES_ORDER[1]).toBe(TrigramStance.TAE);
      expect(TRIGRAM_STANCES_ORDER[2]).toBe(TrigramStance.LI);
      expect(TRIGRAM_STANCES_ORDER[3]).toBe(TrigramStance.JIN);
      expect(TRIGRAM_STANCES_ORDER[4]).toBe(TrigramStance.SON);
      expect(TRIGRAM_STANCES_ORDER[5]).toBe(TrigramStance.GAM);
      expect(TRIGRAM_STANCES_ORDER[6]).toBe(TrigramStance.GAN);
      expect(TRIGRAM_STANCES_ORDER[7]).toBe(TrigramStance.GON);
    });
  });

  describe("integration with guard poses", () => {
    it("should use actual guard poses from StanceGuardPoses", () => {
      // This test verifies that the transition system correctly integrates
      // with the existing guard pose system
      const transition = transitionBetweenStances(
        TrigramStance.GEON,
        TrigramStance.TAE,
        "right"
      );
      
      // Should have successfully created transition (no errors thrown)
      expect(transition).toBeDefined();
      expect(transition.keyframes.length).toBeGreaterThan(0);
    });

    it("should handle all stances that have guard poses defined", () => {
      const stances = Object.values(TrigramStance);
      
      // All stances should have working transitions
      stances.forEach(from => {
        stances.forEach(to => {
          expect(() => {
            transitionBetweenStances(from, to, "right");
          }).not.toThrow();
        });
      });
    });
  });
});
