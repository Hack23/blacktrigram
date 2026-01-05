/**
 * Tests for stance transition system
 * 
 * Validates the 64-transition matrix generation, distance calculations,
 * and keyframe generation for all trigram stance transitions.
 * 
 * @module systems/animation/AnimationTransitions.stance.test
 * @category Testing
 * @korean 자세전환테스트
 */

import { describe, it, expect, beforeAll } from "vitest";
import { TrigramStance } from "../../types/common";
import {
  calculateStanceDistance,
  determineTransitionType,
  createStanceTransition,
  getStanceTransition,
  getTransitionsFromStance,
  STANCE_TRANSITIONS,
  TRIGRAM_STANCES_ORDER,
  initializeStanceTransitions,
} from "./AnimationTransitions";

describe("AnimationTransitions - Stance Transition System", () => {
  beforeAll(() => {
    // Ensure transitions are initialized
    initializeStanceTransitions();
  });

  describe("calculateStanceDistance", () => {
    it("should return 0 for same stance", () => {
      expect(calculateStanceDistance(TrigramStance.GEON, TrigramStance.GEON)).toBe(0);
      expect(calculateStanceDistance(TrigramStance.TAE, TrigramStance.TAE)).toBe(0);
    });

    it("should return 1 for adjacent stances", () => {
      // Adjacent pairs in the wheel
      expect(calculateStanceDistance(TrigramStance.GEON, TrigramStance.TAE)).toBe(1);
      expect(calculateStanceDistance(TrigramStance.TAE, TrigramStance.LI)).toBe(1);
      expect(calculateStanceDistance(TrigramStance.GON, TrigramStance.GEON)).toBe(1); // Wraps around
    });

    it("should return 4 for opposite stances", () => {
      // Stances directly opposite on the wheel (4 steps apart)
      expect(calculateStanceDistance(TrigramStance.GEON, TrigramStance.SON)).toBe(4);
      expect(calculateStanceDistance(TrigramStance.TAE, TrigramStance.GAM)).toBe(4);
      expect(calculateStanceDistance(TrigramStance.LI, TrigramStance.GAN)).toBe(4);
      expect(calculateStanceDistance(TrigramStance.JIN, TrigramStance.GON)).toBe(4);
    });

    it("should handle distance symmetrically", () => {
      // Distance from A to B should equal distance from B to A
      expect(
        calculateStanceDistance(TrigramStance.GEON, TrigramStance.LI)
      ).toBe(
        calculateStanceDistance(TrigramStance.LI, TrigramStance.GEON)
      );
    });

    it("should calculate shortest path around circular wheel", () => {
      // From GEON (index 0) to GON (index 7) should be 1 (wraps around)
      expect(calculateStanceDistance(TrigramStance.GEON, TrigramStance.GON)).toBe(1);
      
      // From TAE (index 1) to GEON (index 0) should be 1
      expect(calculateStanceDistance(TrigramStance.TAE, TrigramStance.GEON)).toBe(1);
    });
  });

  describe("determineTransitionType", () => {
    it('should return "self" for same stance', () => {
      expect(determineTransitionType(TrigramStance.GEON, TrigramStance.GEON)).toBe("self");
    });

    it('should return "direct" for adjacent stances', () => {
      expect(determineTransitionType(TrigramStance.GEON, TrigramStance.TAE)).toBe("direct");
      expect(determineTransitionType(TrigramStance.LI, TrigramStance.JIN)).toBe("direct");
    });

    it('should return "direct" for near-adjacent stances (distance 2)', () => {
      expect(determineTransitionType(TrigramStance.GEON, TrigramStance.LI)).toBe("direct");
    });

    it('should return "indirect" for opposite stances', () => {
      expect(determineTransitionType(TrigramStance.GEON, TrigramStance.SON)).toBe("indirect");
      expect(determineTransitionType(TrigramStance.TAE, TrigramStance.GAM)).toBe("indirect");
    });
  });

  describe("createStanceTransition", () => {
    it("should create self-transition with 0 duration", () => {
      const transition = createStanceTransition(TrigramStance.GEON, TrigramStance.GEON);
      
      expect(transition.type).toBe("self");
      expect(transition.duration).toBe(0);
      expect(transition.keyframes).toHaveLength(1);
      expect(transition.keyframes[0].stance).toBe(TrigramStance.GEON);
    });

    it("should create direct transition with 600ms duration", () => {
      const transition = createStanceTransition(TrigramStance.GEON, TrigramStance.TAE);
      
      expect(transition.type).toBe("direct");
      expect(transition.duration).toBe(600);
      expect(transition.keyframes.length).toBeGreaterThan(1);
    });

    it("should create indirect transition with 600ms duration", () => {
      const transition = createStanceTransition(TrigramStance.GEON, TrigramStance.SON);
      
      expect(transition.type).toBe("indirect");
      expect(transition.duration).toBe(600);
      expect(transition.keyframes.length).toBeGreaterThan(1);
    });

    it("should have keyframes spanning 0 to 36 frames", () => {
      const transition = createStanceTransition(TrigramStance.GEON, TrigramStance.TAE);
      
      const frames = transition.keyframes.map(kf => kf.frame);
      expect(frames[0]).toBe(0);
      expect(frames[frames.length - 1]).toBe(36);
    });

    it("should start at source stance with full blend", () => {
      const transition = createStanceTransition(TrigramStance.GEON, TrigramStance.TAE);
      
      const firstKeyframe = transition.keyframes[0];
      expect(firstKeyframe.frame).toBe(0);
      expect(firstKeyframe.stance).toBe(TrigramStance.GEON);
      expect(firstKeyframe.blend).toBe(1.0);
    });

    it("should end at target stance with full blend", () => {
      const transition = createStanceTransition(TrigramStance.GEON, TrigramStance.TAE);
      
      const lastKeyframe = transition.keyframes[transition.keyframes.length - 1];
      expect(lastKeyframe.frame).toBe(36);
      expect(lastKeyframe.stance).toBe(TrigramStance.TAE);
      expect(lastKeyframe.blend).toBe(1.0);
    });

    it("should include neutral position in keyframes", () => {
      const transition = createStanceTransition(TrigramStance.GEON, TrigramStance.TAE);
      
      const hasNeutral = transition.keyframes.some(kf => kf.stance === 'neutral');
      expect(hasNeutral).toBe(true);
    });

    it("should have bilingual description", () => {
      const transition = createStanceTransition(TrigramStance.GEON, TrigramStance.TAE);
      
      expect(transition.description.korean).toBeTruthy();
      expect(transition.description.english).toBeTruthy();
    });
  });

  describe("Stance Transition Matrix", () => {
    it("should initialize 64 transitions (8x8 matrix)", () => {
      expect(STANCE_TRANSITIONS.size).toBe(64);
    });

    it("should have transition for every stance pair", () => {
      for (const from of TRIGRAM_STANCES_ORDER) {
        for (const to of TRIGRAM_STANCES_ORDER) {
          const key = `${from}_${to}`;
          expect(STANCE_TRANSITIONS.has(key)).toBe(true);
        }
      }
    });

    it("should have 8 self-transitions with 0 duration", () => {
      let selfTransitionCount = 0;
      
      for (const stance of TRIGRAM_STANCES_ORDER) {
        const transition = getStanceTransition(stance, stance);
        expect(transition).toBeDefined();
        expect(transition?.type).toBe("self");
        expect(transition?.duration).toBe(0);
        selfTransitionCount++;
      }
      
      expect(selfTransitionCount).toBe(8);
    });

    it("should have correct transition types distribution", () => {
      const typeCounts = { self: 0, direct: 0, indirect: 0 };
      
      for (const from of TRIGRAM_STANCES_ORDER) {
        for (const to of TRIGRAM_STANCES_ORDER) {
          const transition = getStanceTransition(from, to);
          if (transition) {
            typeCounts[transition.type]++;
          }
        }
      }
      
      expect(typeCounts.self).toBe(8); // 8 self-transitions
      expect(typeCounts.direct).toBeGreaterThan(0); // Some direct transitions
      expect(typeCounts.indirect).toBeGreaterThan(0); // Some indirect transitions
      expect(typeCounts.self + typeCounts.direct + typeCounts.indirect).toBe(64);
    });
  });

  describe("getStanceTransition", () => {
    it("should retrieve existing transition", () => {
      const transition = getStanceTransition(TrigramStance.GEON, TrigramStance.TAE);
      
      expect(transition).toBeDefined();
      expect(transition?.from).toBe(TrigramStance.GEON);
      expect(transition?.to).toBe(TrigramStance.TAE);
    });

    it("should retrieve self-transition", () => {
      const transition = getStanceTransition(TrigramStance.LI, TrigramStance.LI);
      
      expect(transition).toBeDefined();
      expect(transition?.type).toBe("self");
    });

    it("should return undefined for invalid stances", () => {
      const transition = getStanceTransition("invalid" as TrigramStance, TrigramStance.GEON);
      
      expect(transition).toBeUndefined();
    });
  });

  describe("getTransitionsFromStance", () => {
    it("should return 8 transitions from any stance", () => {
      for (const stance of TRIGRAM_STANCES_ORDER) {
        const transitions = getTransitionsFromStance(stance);
        expect(transitions).toHaveLength(8);
      }
    });

    it("should include self-transition", () => {
      const transitions = getTransitionsFromStance(TrigramStance.GEON);
      
      const selfTransition = transitions.find(
        t => t.from === TrigramStance.GEON && t.to === TrigramStance.GEON
      );
      
      expect(selfTransition).toBeDefined();
    });

    it("should include all other stances as targets", () => {
      const transitions = getTransitionsFromStance(TrigramStance.GEON);
      
      const targetStances = transitions.map(t => t.to);
      for (const stance of TRIGRAM_STANCES_ORDER) {
        expect(targetStances).toContain(stance);
      }
    });
  });

  describe("Transition Keyframe Quality", () => {
    it("should have monotonically increasing frame numbers", () => {
      const transition = createStanceTransition(TrigramStance.GEON, TrigramStance.TAE);
      
      for (let i = 1; i < transition.keyframes.length; i++) {
        expect(transition.keyframes[i].frame).toBeGreaterThan(
          transition.keyframes[i - 1].frame
        );
      }
    });

    it("should have valid blend weights (0.0 to 1.0)", () => {
      const transition = createStanceTransition(TrigramStance.GEON, TrigramStance.TAE);
      
      for (const keyframe of transition.keyframes) {
        expect(keyframe.blend).toBeGreaterThanOrEqual(0.0);
        expect(keyframe.blend).toBeLessThanOrEqual(1.0);
      }
    });

    it("should have at least 3 keyframes for non-self transitions", () => {
      for (const from of TRIGRAM_STANCES_ORDER) {
        for (const to of TRIGRAM_STANCES_ORDER) {
          if (from === to) continue; // Skip self-transitions
          
          const transition = getStanceTransition(from, to);
          expect(transition?.keyframes.length).toBeGreaterThanOrEqual(3);
        }
      }
    });
  });

  describe("Performance Requirements", () => {
    it("should generate all transitions quickly", () => {
      const startTime = performance.now();
      
      // Reinitialize to test performance
      STANCE_TRANSITIONS.clear();
      initializeStanceTransitions();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete in less than 100ms
      expect(duration).toBeLessThan(100);
    });

    it("should retrieve transitions quickly", () => {
      const startTime = performance.now();
      
      // Retrieve 1000 random transitions
      for (let i = 0; i < 1000; i++) {
        const fromIndex = Math.floor(Math.random() * TRIGRAM_STANCES_ORDER.length);
        const toIndex = Math.floor(Math.random() * TRIGRAM_STANCES_ORDER.length);
        
        getStanceTransition(
          TRIGRAM_STANCES_ORDER[fromIndex],
          TRIGRAM_STANCES_ORDER[toIndex]
        );
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete in less than 10ms (very fast Map lookups)
      expect(duration).toBeLessThan(10);
    });
  });

  describe("Korean Terminology", () => {
    it("should have Korean descriptions for all transitions", () => {
      for (const from of TRIGRAM_STANCES_ORDER) {
        for (const to of TRIGRAM_STANCES_ORDER) {
          const transition = getStanceTransition(from, to);
          
          expect(transition?.description.korean).toBeTruthy();
          expect(transition?.description.korean.length).toBeGreaterThan(0);
        }
      }
    });

    it("should have English descriptions for all transitions", () => {
      for (const from of TRIGRAM_STANCES_ORDER) {
        for (const to of TRIGRAM_STANCES_ORDER) {
          const transition = getStanceTransition(from, to);
          
          expect(transition?.description.english).toBeTruthy();
          expect(transition?.description.english.length).toBeGreaterThan(0);
        }
      }
    });
  });
});
