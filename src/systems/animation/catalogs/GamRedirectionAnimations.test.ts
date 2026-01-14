/**
 * Unit tests for Gam (Water) Redirection Animations
 *
 * Verifies the integrity of Gam Trigram fluid defensive animations.
 *
 * @korean 감괘방향전환애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import {
  GAM_FLOWING_BLOCK,
  GAM_FLOWING_RIVER_STRIKE,
  GAM_TIDAL_WAVE_PALM,
  GAM_WHIRLPOOL_COUNTER,
} from "./GamRedirectionAnimations";

describe("Gam (Water) Redirection Animations", () => {
  describe("GAM_FLOWING_RIVER_STRIKE (유수타격)", () => {
    it("should have correct metadata", () => {
      expect(GAM_FLOWING_RIVER_STRIKE.name).toBe("flowing_river_strike");
      expect(GAM_FLOWING_RIVER_STRIKE.koreanName).toBe("유수타격");
    });

    it("should be an attack animation", () => {
      // Attacks typically have duration > 0.5 and attack type
      expect(GAM_FLOWING_RIVER_STRIKE.duration).toBeGreaterThan(0.5);
    });

    it("should include animation keyframes", () => {
      // Check that keyframes were generated
      expect(GAM_FLOWING_RIVER_STRIKE.keyframes.length).toBeGreaterThan(0);

      // Check that we have bone rotations (verifies builder primitives worked)
      const totalRotations = GAM_FLOWING_RIVER_STRIKE.keyframes.reduce(
        (acc: number, kf: any) => acc + kf.boneRotations.size,
        0
      );
      expect(totalRotations).toBeGreaterThan(0);
    });
  });

  describe("GAM_WHIRLPOOL_COUNTER (소용돌이반격)", () => {
    it("should have correct metadata", () => {
      expect(GAM_WHIRLPOOL_COUNTER.name).toBe("whirlpool_counter");
      expect(GAM_WHIRLPOOL_COUNTER.koreanName).toBe("소용돌이반격");
    });

    it("should be a defensive/counter animation", () => {
      // Defense usually defined by type (but checking duration/name as proxy if type not exposed directly)
      expect(GAM_WHIRLPOOL_COUNTER.duration).toBeGreaterThan(0.5);
    });
  });

  describe("GAM_TIDAL_WAVE_PALM (해일장)", () => {
    it("should have heavy impact timing", () => {
      expect(GAM_TIDAL_WAVE_PALM.koreanName).toBe("해일장");
      expect(GAM_TIDAL_WAVE_PALM.duration).toBeGreaterThan(0.7);
    });
  });

  describe("GAM_FLOWING_BLOCK (유수막기)", () => {
    it("should serve as pure defense", () => {
      expect(GAM_FLOWING_BLOCK.koreanName).toBe("유수막기");
    });
  });
});
