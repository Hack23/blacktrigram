/**
 * Tests for Gon (Earth) Technique Animations
 *
 * Validates throwing and ground control animations for the Gon trigram.
 * Ensures proper Ssireum biomechanics and timing for combat techniques.
 *
 * @module systems/animation/catalogs/__tests__/GonTechniqueAnimations.test
 */

import { describe, it, expect } from "vitest";
import {
  GON_EARTH_EMBRACE_ANIMATION,
  GON_GROUND_CONTROL_TRANSITION,
} from "./GonTechniqueAnimations";
import { BoneName } from "@/types/skeletal";

describe("Gon Technique Animations", () => {
  describe("GON_EARTH_EMBRACE_ANIMATION", () => {
    it("should have correct animation properties", () => {
      expect(GON_EARTH_EMBRACE_ANIMATION.name).toBe("gon_earth_embrace");
      expect(GON_EARTH_EMBRACE_ANIMATION.koreanName).toBe("대지포옹");
      expect(GON_EARTH_EMBRACE_ANIMATION.duration).toBeCloseTo(1.867, 3);
      expect(GON_EARTH_EMBRACE_ANIMATION.loop).toBe(false);
      expect(GON_EARTH_EMBRACE_ANIMATION.type).toBe("attack");
    });

    it("should have keyframes for all four phases", () => {
      // Should have at least: start, close, lift, throw, control
      expect(GON_EARTH_EMBRACE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(7);
      
      // Check key timing points
      expect(GON_EARTH_EMBRACE_ANIMATION.keyframes[0].time).toBe(0); // Start
      expect(GON_EARTH_EMBRACE_ANIMATION.keyframes.some(kf => kf.time >= 0.54 && kf.time <= 0.55)).toBe(true); // Close
      expect(GON_EARTH_EMBRACE_ANIMATION.keyframes.some(kf => kf.time >= 1.08 && kf.time <= 1.09)).toBe(true); // Lift
      expect(GON_EARTH_EMBRACE_ANIMATION.keyframes.some(kf => kf.time >= 1.62 && kf.time <= 1.63)).toBe(true); // Throw
      expect(GON_EARTH_EMBRACE_ANIMATION.keyframes.some(kf => kf.time >= 1.86 && kf.time <= 1.87)).toBe(true); // Control
    });

    describe("Close Phase", () => {
      it("should lower stance during close phase", () => {
        const startFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes[0];
        const closeFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 0.54 && kf.time <= 0.55
        );
        
        expect(closeFrame).toBeDefined();
        
        if (closeFrame) {
          const startKneeL = startFrame.boneRotations.get(BoneName.KNEE_L);
          const closeKneeL = closeFrame.boneRotations.get(BoneName.KNEE_L);
          
          expect(startKneeL).toBeDefined();
          expect(closeKneeL).toBeDefined();
          
          // Knees should bend deeper during close
          if (startKneeL && closeKneeL) {
            expect(closeKneeL.x).toBeLessThan(startKneeL.x);
          }
        }
      });

      it("should extend arms for grab during close", () => {
        const closeFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 0.54 && kf.time <= 0.55
        );
        
        expect(closeFrame).toBeDefined();
        
        if (closeFrame) {
          const shoulderL = closeFrame.boneRotations.get(BoneName.SHOULDER_L);
          const shoulderR = closeFrame.boneRotations.get(BoneName.SHOULDER_R);
          
          expect(shoulderL).toBeDefined();
          expect(shoulderR).toBeDefined();
          
          // Shoulders should be forward (positive X)
          if (shoulderL && shoulderR) {
            expect(shoulderL.x).toBeGreaterThan(0.7); // Greater than 40°
            expect(shoulderR.x).toBeGreaterThan(0.7);
          }
        }
      });
    });

    describe("Lift Phase", () => {
      it("should extend legs during lift phase", () => {
        const closeFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 0.54 && kf.time <= 0.55
        );
        const liftFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 1.08 && kf.time <= 1.09
        );
        
        expect(closeFrame).toBeDefined();
        expect(liftFrame).toBeDefined();
        
        if (closeFrame && liftFrame) {
          const closeKneeL = closeFrame.boneRotations.get(BoneName.KNEE_L);
          const liftKneeL = liftFrame.boneRotations.get(BoneName.KNEE_L);
          
          expect(closeKneeL).toBeDefined();
          expect(liftKneeL).toBeDefined();
          
          // Knees should straighten during lift
          if (closeKneeL && liftKneeL) {
            expect(liftKneeL.x).toBeGreaterThan(closeKneeL.x);
          }
        }
      });

      it("should lean back during lift", () => {
        const liftFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 1.08 && kf.time <= 1.09
        );
        
        expect(liftFrame).toBeDefined();
        
        if (liftFrame) {
          const spineUpper = liftFrame.boneRotations.get(BoneName.SPINE_UPPER);
          
          expect(spineUpper).toBeDefined();
          
          // Spine should lean back (negative X)
          if (spineUpper) {
            expect(spineUpper.x).toBeLessThan(0);
          }
        }
      });
    });

    describe("Throw Phase", () => {
      it("should demonstrate torso rotation in throw", () => {
        const throwFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 1.62 && kf.time <= 1.63
        );
        
        expect(throwFrame).toBeDefined();
        
        if (throwFrame) {
          const pelvis = throwFrame.boneRotations.get(BoneName.PELVIS);
          const spineUpper = throwFrame.boneRotations.get(BoneName.SPINE_UPPER);
          
          expect(pelvis).toBeDefined();
          expect(spineUpper).toBeDefined();
          
          // Should have significant Y-axis rotation
          if (pelvis && spineUpper) {
            expect(Math.abs(pelvis.y)).toBeGreaterThan(0.5); // Greater than 28°
            expect(Math.abs(spineUpper.y)).toBeGreaterThan(0.5);
          }
        }
      });

      it("should maintain arm control during throw", () => {
        const throwFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 1.62 && kf.time <= 1.63
        );
        
        expect(throwFrame).toBeDefined();
        
        if (throwFrame) {
          const shoulderL = throwFrame.boneRotations.get(BoneName.SHOULDER_L);
          const shoulderR = throwFrame.boneRotations.get(BoneName.SHOULDER_R);
          
          expect(shoulderL).toBeDefined();
          expect(shoulderR).toBeDefined();
          
          // Arms should be pulling across body
          if (shoulderL && shoulderR) {
            expect(Math.abs(shoulderL.y)).toBeGreaterThan(0.5);
            expect(Math.abs(shoulderR.y)).toBeGreaterThan(0.5);
          }
        }
      });
    });

    describe("Control Phase", () => {
      it("should follow to ground maintaining control", () => {
        const controlFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 1.86 && kf.time <= 1.87
        );
        
        expect(controlFrame).toBeDefined();
        
        if (controlFrame) {
          const kneeL = controlFrame.boneRotations.get(BoneName.KNEE_L);
          const kneeR = controlFrame.boneRotations.get(BoneName.KNEE_R);
          
          expect(kneeL).toBeDefined();
          expect(kneeR).toBeDefined();
          
          // Should be in lower stance
          if (kneeL && kneeR) {
            expect(kneeL.x).toBeLessThan(-0.6); // Less than -34°
            expect(kneeR.x).toBeLessThan(-0.7); // Less than -40°
          }
        }
      });
    });
  });

  describe("GON_GROUND_CONTROL_TRANSITION", () => {
    it("should have correct animation properties", () => {
      expect(GON_GROUND_CONTROL_TRANSITION.name).toBe("gon_ground_control_transition");
      expect(GON_GROUND_CONTROL_TRANSITION.koreanName).toBe("땅 장악");
      expect(GON_GROUND_CONTROL_TRANSITION.duration).toBeCloseTo(2.0, 1);
      expect(GON_GROUND_CONTROL_TRANSITION.loop).toBe(false);
      expect(GON_GROUND_CONTROL_TRANSITION.type).toBe("attack");
    });

    it("should have keyframes for all three phases", () => {
      // Should have at least: start, takedown, transition, control
      expect(GON_GROUND_CONTROL_TRANSITION.keyframes.length).toBeGreaterThanOrEqual(6);
      
      // Check key timing points
      expect(GON_GROUND_CONTROL_TRANSITION.keyframes[0].time).toBe(0); // Start
      expect(GON_GROUND_CONTROL_TRANSITION.keyframes.some(kf => kf.time >= 0.66 && kf.time <= 0.67)).toBe(true); // Takedown
      expect(GON_GROUND_CONTROL_TRANSITION.keyframes.some(kf => kf.time >= 1.33 && kf.time <= 1.34)).toBe(true); // Transition
      expect(GON_GROUND_CONTROL_TRANSITION.keyframes.some(kf => kf.time >= 2.0)).toBe(true); // Control
    });

    describe("Takedown Phase", () => {
      it("should drive opponent down", () => {
        const startFrame = GON_GROUND_CONTROL_TRANSITION.keyframes[0];
        const takedownFrame = GON_GROUND_CONTROL_TRANSITION.keyframes.find(kf => 
          kf.time >= 0.66 && kf.time <= 0.67
        );
        
        expect(takedownFrame).toBeDefined();
        
        if (takedownFrame) {
          const startPelvis = startFrame.bonePositions.get(BoneName.PELVIS);
          const takedownPelvis = takedownFrame.bonePositions.get(BoneName.PELVIS);
          
          expect(startPelvis).toBeDefined();
          expect(takedownPelvis).toBeDefined();
          
          // Pelvis should be lower
          if (startPelvis && takedownPelvis) {
            expect(takedownPelvis.y).toBeLessThan(startPelvis.y);
          }
        }
      });

      it("should lower knees significantly", () => {
        const takedownFrame = GON_GROUND_CONTROL_TRANSITION.keyframes.find(kf => 
          kf.time >= 0.66 && kf.time <= 0.67
        );
        
        expect(takedownFrame).toBeDefined();
        
        if (takedownFrame) {
          const kneeL = takedownFrame.boneRotations.get(BoneName.KNEE_L);
          const kneeR = takedownFrame.boneRotations.get(BoneName.KNEE_R);
          
          expect(kneeL).toBeDefined();
          expect(kneeR).toBeDefined();
          
          // Very deep knee bends for ground level
          if (kneeL && kneeR) {
            expect(kneeL.x).toBeLessThan(-1.0); // Less than -57°
            expect(kneeR.x).toBeLessThan(-1.0);
          }
        }
      });
    });

    describe("Transition Phase", () => {
      it("should move to side control position", () => {
        const takedownFrame = GON_GROUND_CONTROL_TRANSITION.keyframes.find(kf => 
          kf.time >= 0.66 && kf.time <= 0.67
        );
        const transitionFrame = GON_GROUND_CONTROL_TRANSITION.keyframes.find(kf => 
          kf.time >= 1.33 && kf.time <= 1.34
        );
        
        expect(takedownFrame).toBeDefined();
        expect(transitionFrame).toBeDefined();
        
        if (takedownFrame && transitionFrame) {
          const takedownPos = takedownFrame.bonePositions.get(BoneName.PELVIS);
          const transitionPos = transitionFrame.bonePositions.get(BoneName.PELVIS);
          
          expect(takedownPos).toBeDefined();
          expect(transitionPos).toBeDefined();
          
          // Should shift laterally
          if (takedownPos && transitionPos) {
            const lateralShift = Math.abs(transitionPos.x - takedownPos.x);
            expect(lateralShift).toBeGreaterThan(0.05);
          }
        }
      });

      it("should establish chest position over opponent", () => {
        const transitionFrame = GON_GROUND_CONTROL_TRANSITION.keyframes.find(kf => 
          kf.time >= 1.33 && kf.time <= 1.34
        );
        
        expect(transitionFrame).toBeDefined();
        
        if (transitionFrame) {
          const spineUpper = transitionFrame.boneRotations.get(BoneName.SPINE_UPPER);
          
          expect(spineUpper).toBeDefined();
          
          // Chest should be forward (positive X)
          if (spineUpper) {
            expect(spineUpper.x).toBeGreaterThan(0.4); // Greater than 23°
          }
        }
      });
    });

    describe("Control Phase", () => {
      it("should apply full body weight at end", () => {
        const controlFrame = GON_GROUND_CONTROL_TRANSITION.keyframes[
          GON_GROUND_CONTROL_TRANSITION.keyframes.length - 1
        ];
        
        const spineUpper = controlFrame.boneRotations.get(BoneName.SPINE_UPPER);
        const shoulderL = controlFrame.boneRotations.get(BoneName.SHOULDER_L);
        const shoulderR = controlFrame.boneRotations.get(BoneName.SHOULDER_R);
        
        expect(spineUpper).toBeDefined();
        expect(shoulderL).toBeDefined();
        expect(shoulderR).toBeDefined();
        
        // Chest pressure (forward lean)
        if (spineUpper) {
          expect(spineUpper.x).toBeGreaterThan(0.6); // Greater than 34°
        }
        
        // Arms locked in control
        if (shoulderL && shoulderR) {
          expect(shoulderL.x).toBeGreaterThan(1.0); // Greater than 57°
          expect(shoulderR.x).toBeGreaterThan(1.0);
        }
      });

      it("should maintain stable base with legs", () => {
        const controlFrame = GON_GROUND_CONTROL_TRANSITION.keyframes[
          GON_GROUND_CONTROL_TRANSITION.keyframes.length - 1
        ];
        
        const kneeL = controlFrame.boneRotations.get(BoneName.KNEE_L);
        const kneeR = controlFrame.boneRotations.get(BoneName.KNEE_R);
        
        expect(kneeL).toBeDefined();
        expect(kneeR).toBeDefined();
        
        // Stable base position
        if (kneeL && kneeR) {
          expect(kneeL.x).toBeLessThan(-0.5); // Bent for stability
          expect(kneeR.x).toBeLessThan(-0.5);
        }
      });
    });
  });

  describe("General Technique Animation Integrity", () => {
    it("all animations should have valid Korean names", () => {
      expect(GON_EARTH_EMBRACE_ANIMATION.koreanName).toBeTruthy();
      expect(GON_GROUND_CONTROL_TRANSITION.koreanName).toBeTruthy();
      
      // Should be in Korean (Unicode Korean range)
      expect(GON_EARTH_EMBRACE_ANIMATION.koreanName).toMatch(/[가-힣]/);
      expect(GON_GROUND_CONTROL_TRANSITION.koreanName).toMatch(/[가-힣]/);
    });

    it("all animations should have non-empty keyframes", () => {
      expect(GON_EARTH_EMBRACE_ANIMATION.keyframes.length).toBeGreaterThan(0);
      expect(GON_GROUND_CONTROL_TRANSITION.keyframes.length).toBeGreaterThan(0);
    });

    it("all animations should have keyframes in chronological order", () => {
      [GON_EARTH_EMBRACE_ANIMATION, GON_GROUND_CONTROL_TRANSITION].forEach((animation) => {
        for (let i = 1; i < animation.keyframes.length; i++) {
          expect(animation.keyframes[i].time).toBeGreaterThanOrEqual(animation.keyframes[i - 1].time);
        }
      });
    });

    it("all animations should be marked as attack type", () => {
      expect(GON_EARTH_EMBRACE_ANIMATION.type).toBe("attack");
      expect(GON_GROUND_CONTROL_TRANSITION.type).toBe("attack");
    });

    it("all animations should not loop", () => {
      expect(GON_EARTH_EMBRACE_ANIMATION.loop).toBe(false);
      expect(GON_GROUND_CONTROL_TRANSITION.loop).toBe(false);
    });
  });
});
