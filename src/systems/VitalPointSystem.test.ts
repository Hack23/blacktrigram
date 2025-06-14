import { describe, it, expect, beforeEach } from "vitest";
import { VitalPointSystem } from "./VitalPointSystem";
import { HitDetection } from "./vitalpoint/HitDetection";
import { KOREAN_VITAL_POINTS } from "./vitalpoint/KoreanVitalPoints";
import { VitalPointSeverity } from "../types/enums";
import type { PlayerState } from "../types/player";

/**
 * ## Vital Point System Test Suite
 *
 * **Business Purpose:**
 * Validates the anatomical targeting system that provides realistic Korean martial arts
 * vital point combat mechanics based on traditional Korean anatomy knowledge.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("VitalPointSystem", () => {
  let vitalPointSystem: VitalPointSystem;
  let mockPlayer: PlayerState;

  beforeEach(() => {
    vitalPointSystem = new VitalPointSystem();
    mockPlayer = {
      id: "test-player",
      name: { korean: "테스트", english: "Test" },
      // ...existing code...
      vitalPoints: KOREAN_VITAL_POINTS.slice(0, 3),
    };
  });

  describe("Vital Point Hit Detection", () => {
    it("should detect hits on Korean vital points accurately", () => {
      const hitResult = vitalPointSystem.processHit(
        mockPlayer,
        { x: 0, y: -50 }, // Crown point position
        30 // Required force
      );

      expect(hitResult.hit).toBe(true);
      expect(hitResult.vitalPoint?.korean.korean).toBe("백회혈");
      expect(hitResult.severity).toBe(VitalPointSeverity.CRITICAL);
    });

    it("should handle Korean anatomy correctly", () => {
      const vitalPoint = KOREAN_VITAL_POINTS[0]; // 백회혈
      expect(vitalPoint.korean.korean).toBe("백회혈");
      expect(vitalPoint.korean.english).toBe("Crown Point");
      expect(vitalPoint.severity).toBe(VitalPointSeverity.CRITICAL);
    });

    it("should calculate damage based on Korean martial arts principles", () => {
      const hitResult = vitalPointSystem.processHit(
        mockPlayer,
        { x: -30, y: 70 }, // 인영 position
        20
      );

      expect(hitResult.damage).toBeGreaterThan(0);
      expect(hitResult.effects).toBeDefined();
    });
  });

  describe("Korean Vital Points Integration", () => {
    it("should validate all Korean vital points have proper structure", () => {
      KOREAN_VITAL_POINTS.forEach((point) => {
        expect(point.korean.korean).toMatch(/[\u3131-\u318E\uAC00-\uD7A3]/);
        expect(point.korean.english).toBeTruthy();
        expect(point.position).toBeDefined();
        expect(point.severity).toBeDefined();
      });
    });
  });
});
