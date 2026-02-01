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
      expect(GON_EARTH_EMBRACE_ANIMATION.duration).toBeCloseTo(1.1, 2); // Updated: 1100ms (was 1867ms)
      expect(GON_EARTH_EMBRACE_ANIMATION.loop).toBe(false);
      expect(GON_EARTH_EMBRACE_ANIMATION.type).toBe("attack");
    });

    it("should have keyframes for all phases", () => {
      // Should have at least: start, setup, penetration, lift, rotation, impact
      expect(GON_EARTH_EMBRACE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(9); // Updated: 9 keyframes
      
      // Check key timing points - UPDATED for faster animation
      expect(GON_EARTH_EMBRACE_ANIMATION.keyframes[0].time).toBe(0); // Start
      expect(GON_EARTH_EMBRACE_ANIMATION.keyframes.some(kf => kf.time >= 0.20 && kf.time <= 0.21)).toBe(true); // Penetration (200ms)
      expect(GON_EARTH_EMBRACE_ANIMATION.keyframes.some(kf => kf.time >= 0.42 && kf.time <= 0.43)).toBe(true); // Grip (420ms)
      expect(GON_EARTH_EMBRACE_ANIMATION.keyframes.some(kf => kf.time >= 0.65 && kf.time <= 0.66)).toBe(true); // Lift (650ms)
      expect(GON_EARTH_EMBRACE_ANIMATION.keyframes.some(kf => kf.time >= 0.88 && kf.time <= 0.89)).toBe(true); // Rotation (880ms)
      expect(GON_EARTH_EMBRACE_ANIMATION.keyframes.some(kf => kf.time >= 1.09 && kf.time <= 1.11)).toBe(true); // Impact (1100ms)
    });

    describe("Setup Phase", () => {
      it("should lower stance during setup phase", () => {
        const startFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes[0];
        const setupFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 0.11 && kf.time <= 0.13 // 120ms setup drop
        );
        
        expect(setupFrame).toBeDefined();
        
        if (setupFrame) {
          const startKneeL = startFrame.boneRotations.get(BoneName.KNEE_L);
          const setupKneeL = setupFrame.boneRotations.get(BoneName.KNEE_L);
          
          expect(startKneeL).toBeDefined();
          expect(setupKneeL).toBeDefined();
          
          // Knees should bend DEEPER during heavy drop
          if (startKneeL && setupKneeL) {
            expect(setupKneeL.x).toBeLessThan(startKneeL.x);
          }
        }
      });

      it("should extend arms for grab during penetration", () => {
        const penetrationFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 0.41 && kf.time <= 0.43 // 420ms secure grip
        );
        
        expect(penetrationFrame).toBeDefined();
        
        if (penetrationFrame) {
          const shoulderL = penetrationFrame.boneRotations.get(BoneName.SHOULDER_L);
          const shoulderR = penetrationFrame.boneRotations.get(BoneName.SHOULDER_R);
          
          expect(shoulderL).toBeDefined();
          expect(shoulderR).toBeDefined();
          
          // Shoulders should be forward (positive X) and WRAPPED
          if (shoulderL && shoulderR) {
            expect(shoulderL.x).toBeGreaterThan(0.8); // Greater than 46° (was 0.7)
            expect(shoulderR.x).toBeGreaterThan(0.8);
          }
        }
      });
    });

    describe("Explosive Lift Phase", () => {
      it("should extend legs EXPLOSIVELY during lift phase", () => {
        const gripFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 0.41 && kf.time <= 0.43 // 420ms grip
        );
        const liftFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 0.64 && kf.time <= 0.66 // 650ms peak lift
        );
        
        expect(gripFrame).toBeDefined();
        expect(liftFrame).toBeDefined();
        
        if (gripFrame && liftFrame) {
          const gripKneeL = gripFrame.boneRotations.get(BoneName.KNEE_L);
          const liftKneeL = liftFrame.boneRotations.get(BoneName.KNEE_L);
          
          expect(gripKneeL).toBeDefined();
          expect(liftKneeL).toBeDefined();
          
          // Knees should straighten DRAMATICALLY during explosive lift
          if (gripKneeL && liftKneeL) {
            expect(liftKneeL.x).toBeGreaterThan(gripKneeL.x); // Much less negative
            expect(Math.abs(liftKneeL.x)).toBeLessThan(0.2); // Nearly straight (-10°)
          }
        }
      });

      it("should lean back during lift for throw preparation", () => {
        const liftFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 0.64 && kf.time <= 0.66 // 650ms peak lift
        );
        
        expect(liftFrame).toBeDefined();
        
        if (liftFrame) {
          const spineUpper = liftFrame.boneRotations.get(BoneName.SPINE_UPPER);
          
          expect(spineUpper).toBeDefined();
          
          // Spine should lean back (negative X) AND begin rotation (positive Y)
          if (spineUpper) {
            expect(spineUpper.x).toBeLessThan(0); // Negative = lean back
            expect(spineUpper.y).toBeGreaterThan(0); // Rotation starting
          }
        }
      });
    });

    describe("Rotation Phase", () => {
      it("should demonstrate MASSIVE torso rotation in throw", () => {
        const rotationFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 0.87 && kf.time <= 0.89 // 880ms maximum rotation
        );
        
        expect(rotationFrame).toBeDefined();
        
        if (rotationFrame) {
          const pelvis = rotationFrame.boneRotations.get(BoneName.PELVIS);
          const spineUpper = rotationFrame.boneRotations.get(BoneName.SPINE_UPPER);
          
          expect(pelvis).toBeDefined();
          expect(spineUpper).toBeDefined();
          
          // Should have EXTREME Y-axis rotation (80°+)
          if (pelvis && spineUpper) {
            expect(pelvis.y).toBeGreaterThan(1.2); // Greater than 68° (1.2 rad ≈ 69°)
            expect(Math.abs(spineUpper.y)).toBeGreaterThan(1.3); // Greater than 74° (1.3 rad ≈ 74°)
          }
        }
      });

      it("should maintain arm control during rotation", () => {
        const rotationFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 0.87 && kf.time <= 0.89 // 880ms maximum rotation
        );
        
        expect(rotationFrame).toBeDefined();
        
        if (rotationFrame) {
          const shoulderL = rotationFrame.boneRotations.get(BoneName.SHOULDER_L);
          const shoulderR = rotationFrame.boneRotations.get(BoneName.SHOULDER_R);
          
          expect(shoulderL).toBeDefined();
          expect(shoulderR).toBeDefined();
          
          // Arms should be pulling across body with rotation
          if (shoulderL && shoulderR) {
            expect(Math.abs(shoulderL.y)).toBeGreaterThan(0.8); // Greater rotation
            expect(Math.abs(shoulderR.y)).toBeGreaterThan(0.8);
          }
        }
      });
    });

    describe("Impact Phase", () => {
      it("should follow to ground SLAMMING with control", () => {
        const impactFrame = GON_EARTH_EMBRACE_ANIMATION.keyframes.find(kf => 
          kf.time >= 1.09 && kf.time <= 1.11 // 1100ms ground IMPACT
        );
        
        expect(impactFrame).toBeDefined();
        
        if (impactFrame) {
          const kneeL = impactFrame.boneRotations.get(BoneName.KNEE_L);
          const kneeR = impactFrame.boneRotations.get(BoneName.KNEE_R);
          
          expect(kneeL).toBeDefined();
          expect(kneeR).toBeDefined();
          
          // Should be in LOWER stance for ground control
          if (kneeL && kneeR) {
            expect(kneeL.x).toBeLessThan(-0.8); // Less than -46° (deeper!)
            expect(kneeR.x).toBeLessThan(-0.9); // Less than -51° (control position)
          }
        }
      });
    });
  });

  describe("GON_GROUND_CONTROL_TRANSITION", () => {
    it("should have correct animation properties", () => {
      expect(GON_GROUND_CONTROL_TRANSITION.name).toBe("gon_ground_control_transition");
      expect(GON_GROUND_CONTROL_TRANSITION.koreanName).toBe("땅 장악");
      expect(GON_GROUND_CONTROL_TRANSITION.duration).toBeCloseTo(1.2, 2); // Updated: 1200ms (was 2000ms)
      expect(GON_GROUND_CONTROL_TRANSITION.loop).toBe(false);
      expect(GON_GROUND_CONTROL_TRANSITION.type).toBe("attack");
    });

    it("should have keyframes for all three phases", () => {
      // Should have at least: start, takedown, transition, dominance
      expect(GON_GROUND_CONTROL_TRANSITION.keyframes.length).toBeGreaterThanOrEqual(6); // 6 keyframes
      
      // Check key timing points - UPDATED for faster animation
      expect(GON_GROUND_CONTROL_TRANSITION.keyframes[0].time).toBe(0); // Start
      expect(GON_GROUND_CONTROL_TRANSITION.keyframes.some(kf => kf.time >= 0.34 && kf.time <= 0.36)).toBe(true); // Takedown (350ms)
      expect(GON_GROUND_CONTROL_TRANSITION.keyframes.some(kf => kf.time >= 0.51 && kf.time <= 0.53)).toBe(true); // Transition (520ms)
      expect(GON_GROUND_CONTROL_TRANSITION.keyframes.some(kf => kf.time >= 0.69 && kf.time <= 0.71)).toBe(true); // Side control (700ms)
      expect(GON_GROUND_CONTROL_TRANSITION.keyframes.some(kf => kf.time >= 1.19 && kf.time <= 1.21)).toBe(true); // Dominance (1200ms)
    });

    describe("Takedown Phase", () => {
      it("should drive opponent down FORCEFULLY", () => {
        const startFrame = GON_GROUND_CONTROL_TRANSITION.keyframes[0];
        const takedownFrame = GON_GROUND_CONTROL_TRANSITION.keyframes.find(kf => 
          kf.time >= 0.34 && kf.time <= 0.36 // 350ms opponent flattened
        );
        
        expect(takedownFrame).toBeDefined();
        
        if (takedownFrame) {
          const startPelvis = startFrame.bonePositions.get(BoneName.PELVIS);
          const takedownPelvis = takedownFrame.bonePositions.get(BoneName.PELVIS);
          
          expect(startPelvis).toBeDefined();
          expect(takedownPelvis).toBeDefined();
          
          // Pelvis should be MUCH lower (crushing down)
          if (startPelvis && takedownPelvis) {
            expect(takedownPelvis.y).toBeLessThan(startPelvis.y);
            expect(takedownPelvis.y).toBeLessThan(-0.20); // Very low position
          }
        }
      });

      it("should lower knees EXTREMELY for crushing pressure", () => {
        const takedownFrame = GON_GROUND_CONTROL_TRANSITION.keyframes.find(kf => 
          kf.time >= 0.34 && kf.time <= 0.36 // 350ms ground crushing
        );
        
        expect(takedownFrame).toBeDefined();
        
        if (takedownFrame) {
          const kneeL = takedownFrame.boneRotations.get(BoneName.KNEE_L);
          const kneeR = takedownFrame.boneRotations.get(BoneName.KNEE_R);
          
          expect(kneeL).toBeDefined();
          expect(kneeR).toBeDefined();
          
          // VERY deep knee bends for CRUSHING ground level
          if (kneeL && kneeR) {
            expect(kneeL.x).toBeLessThan(-1.10); // Less than -63° (1.1 rad = -63°)
            expect(kneeR.x).toBeLessThan(-1.15); // Less than -66° (1.15 rad = -66°) - even deeper!
          }
        }
      });
    });

    describe("Transition Phase", () => {
      it("should move EXPLOSIVELY to side control position", () => {
        const takedownFrame = GON_GROUND_CONTROL_TRANSITION.keyframes.find(kf => 
          kf.time >= 0.34 && kf.time <= 0.36 // 350ms flattened
        );
        const transitionFrame = GON_GROUND_CONTROL_TRANSITION.keyframes.find(kf => 
          kf.time >= 0.69 && kf.time <= 0.71 // 700ms side control locked
        );
        
        expect(takedownFrame).toBeDefined();
        expect(transitionFrame).toBeDefined();
        
        if (takedownFrame && transitionFrame) {
          const takedownPos = takedownFrame.bonePositions.get(BoneName.PELVIS);
          const transitionPos = transitionFrame.bonePositions.get(BoneName.PELVIS);
          
          expect(takedownPos).toBeDefined();
          expect(transitionPos).toBeDefined();
          
          // Should shift laterally to side control
          if (takedownPos && transitionPos) {
            const lateralShift = Math.abs(transitionPos.x - takedownPos.x);
            expect(lateralShift).toBeGreaterThan(0.10); // Significant lateral movement
          }
        }
      });

      it("should establish HEAVY chest position over opponent", () => {
        const transitionFrame = GON_GROUND_CONTROL_TRANSITION.keyframes.find(kf => 
          kf.time >= 0.69 && kf.time <= 0.71 // 700ms side control
        );
        
        expect(transitionFrame).toBeDefined();
        
        if (transitionFrame) {
          const spineUpper = transitionFrame.boneRotations.get(BoneName.SPINE_UPPER);
          
          expect(spineUpper).toBeDefined();
          
          // Chest should be forward (positive X) for pressure
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
