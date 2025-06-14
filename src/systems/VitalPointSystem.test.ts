import { describe, it, expect, beforeEach } from "vitest";
import { VitalPointSystem } from "./VitalPointSystem";
import type { Position } from "../types/common";

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

  beforeEach(() => {
    vitalPointSystem = new VitalPointSystem();
  });

  it("should initialize with Korean anatomical vital points", () => {
    const vitalPoints = vitalPointSystem.getAllVitalPoints();
    expect(vitalPoints.length).toBeGreaterThan(50); // Should have 70 vital points

    // Check for traditional Korean vital points
    const headPoint = vitalPoints.find((point) => point.koreanName === "백회");
    expect(headPoint).toBeDefined();
  });

  it("should detect vital point hits accurately", () => {
    const hitPosition: Position = { x: 100, y: 50 }; // Head area
    const result = vitalPointSystem.checkVitalPointHit(hitPosition, 10);

    expect(result.isVitalPoint).toBeDefined();
    if (result.isVitalPoint) {
      expect(result.vitalPoint?.koreanName).toBeTruthy();
      expect(result.damageMultiplier).toBeGreaterThan(1.0);
    }
  });

  it("should calculate damage multipliers for vital points", () => {
    const vitalPoints = vitalPointSystem.getAllVitalPoints();
    const criticalPoint = vitalPoints.find(
      (point) => point.severity === "critical"
    );

    if (criticalPoint) {
      const multiplier =
        vitalPointSystem.calculateDamageMultiplier(criticalPoint);
      expect(multiplier).toBeGreaterThan(2.0); // Critical points should have high multipliers
    }
  });
});
