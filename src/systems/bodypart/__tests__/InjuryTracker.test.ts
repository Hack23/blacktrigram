/**
 * Injury Tracker System Tests
 * 
 * Tests for injury tracking, progressive bruising, and trauma visualization.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as THREE from "three";
import {
  InjuryTracker,
  InjuryLocation,
  DEFAULT_INJURY_TRACKER_CONFIG,
} from "../InjuryTracker";
import { BodyPart } from "../types";
import { InjuryType } from "../../../types/injury";
import { BodyRegion } from "../../../types/common";

describe("InjuryTracker", () => {
  let tracker: InjuryTracker;

  beforeEach(() => {
    tracker = new InjuryTracker();
  });

  describe("recordInjury", () => {
    it("should create a new injury when damage exceeds minimum threshold", () => {
      const position = new THREE.Vector3(0, 1.5, 0);
      const injury = tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        position,
        25,
        InjuryType.BRUISE
      );

      expect(injury).not.toBeNull();
      expect(injury!.bodyPart).toBe(BodyPart.TORSO_UPPER);
      expect(injury!.bodyRegion).toBe(BodyRegion.TORSO);
      expect(injury!.severity).toBe(25);
      expect(injury!.hitCount).toBe(1);
      expect(injury!.type).toBe(InjuryType.BRUISE);
      expect(injury!.position).toEqual(position);
    });

    it("should not track injuries below minimum damage threshold", () => {
      const position = new THREE.Vector3(0, 1.5, 0);
      const result = tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        position,
        3, // Below threshold of 5
        InjuryType.BRUISE
      );

      expect(result).toBeNull();
      const injuries = tracker.getInjuries();
      expect(injuries).toHaveLength(0);
    });

    it("should implement progressive bruising - update existing injury on repeated hits", () => {
      const position = new THREE.Vector3(0, 1.5, 0);

      // First hit
      const injury1 = tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        position,
        20,
        InjuryType.BRUISE
      );

      expect(injury1).not.toBeNull();
      expect(injury1!.hitCount).toBe(1);
      expect(injury1!.severity).toBe(20);

      // Second hit to same location (within threshold)
      const nearbyPosition = new THREE.Vector3(0.1, 1.5, 0);
      const injury2 = tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        nearbyPosition,
        20,
        InjuryType.BRUISE
      );

      // Should update existing injury
      expect(injury2).not.toBeNull();
      expect(injury2!.id).toBe(injury1!.id);
      expect(injury2!.hitCount).toBe(2);
      expect(injury2!.severity).toBeGreaterThan(20);
      expect(injury2!.severity).toBeLessThanOrEqual(30); // 20 + 20/2 = 30
    });

    it("should create separate injuries for hits to different locations", () => {
      const position1 = new THREE.Vector3(0, 1.5, 0);
      const position2 = new THREE.Vector3(2, 1.5, 0); // Far from position1

      tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        position1,
        20,
        InjuryType.BRUISE
      );

      tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        position2,
        20,
        InjuryType.BRUISE
      );

      const injuries = tracker.getInjuries();
      expect(injuries).toHaveLength(2);
    });

    it("should cap severity at 100", () => {
      const position = new THREE.Vector3(0, 1.5, 0);

      // First hit with high damage
      tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        position,
        80,
        InjuryType.BRUISE
      );

      // Multiple additional hits
      for (let i = 0; i < 5; i++) {
        const nearbyPos = new THREE.Vector3(0.1 * i, 1.5, 0);
        tracker.recordInjury(
          BodyPart.TORSO_UPPER,
          BodyRegion.TORSO,
          nearbyPos,
          50,
          InjuryType.BRUISE
        );
      }

      const injuries = tracker.getInjuries();
      expect(injuries[0].severity).toBeLessThanOrEqual(100);
    });

    it("should enforce max injuries limit", () => {
      const config = {
        ...DEFAULT_INJURY_TRACKER_CONFIG,
        maxInjuries: 5,
      };
      const limitedTracker = new InjuryTracker(config);

      // Create more injuries than limit
      for (let i = 0; i < 10; i++) {
        const position = new THREE.Vector3(i * 2, 1.5, 0);
        limitedTracker.recordInjury(
          BodyPart.TORSO_UPPER,
          BodyRegion.TORSO,
          position,
          20,
          InjuryType.BRUISE
        );
      }

      const injuries = limitedTracker.getInjuries();
      expect(injuries.length).toBeLessThanOrEqual(5);
    });
  });

  describe("findNearbyInjury", () => {
    it("should find injury within threshold distance", () => {
      const position1 = new THREE.Vector3(0, 1.5, 0);
      const position2 = new THREE.Vector3(0.3, 1.5, 0); // 0.3 units away

      tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        position1,
        20,
        InjuryType.BRUISE
      );

      const nearby = tracker.findNearbyInjury(
        BodyPart.TORSO_UPPER,
        position2,
        0.5 // threshold
      );

      expect(nearby).toBeDefined();
      expect(nearby?.position.distanceTo(position1)).toBeLessThan(0.5);
    });

    it("should not find injury beyond threshold distance", () => {
      const position1 = new THREE.Vector3(0, 1.5, 0);
      const position2 = new THREE.Vector3(2, 1.5, 0); // 2 units away

      tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        position1,
        20,
        InjuryType.BRUISE
      );

      const nearby = tracker.findNearbyInjury(
        BodyPart.TORSO_UPPER,
        position2,
        0.5 // threshold
      );

      expect(nearby).toBeNull();
    });

    it("should only match injuries on same body part", () => {
      const position = new THREE.Vector3(0, 1.5, 0);

      tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        position,
        20,
        InjuryType.BRUISE
      );

      const nearby = tracker.findNearbyInjury(
        BodyPart.ARM_LEFT, // Different body part
        position,
        0.5
      );

      expect(nearby).toBeNull();
    });
  });

  describe("getInjuries", () => {
    it("should return all tracked injuries", () => {
      tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        new THREE.Vector3(0, 1.5, 0),
        20,
        InjuryType.BRUISE
      );

      tracker.recordInjury(
        BodyPart.HEAD,
        BodyRegion.HEAD,
        new THREE.Vector3(0, 2.5, 0),
        15,
        InjuryType.CUT
      );

      const injuries = tracker.getInjuries();
      expect(injuries).toHaveLength(2);
    });

    it("should return empty array when no injuries", () => {
      const injuries = tracker.getInjuries();
      expect(injuries).toHaveLength(0);
    });
  });

  describe("getInjuriesByBodyPart", () => {
    it("should filter injuries by body part", () => {
      tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        new THREE.Vector3(0, 1.5, 0),
        20,
        InjuryType.BRUISE
      );

      tracker.recordInjury(
        BodyPart.HEAD,
        BodyRegion.HEAD,
        new THREE.Vector3(0, 2.5, 0),
        15,
        InjuryType.CUT
      );

      tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        new THREE.Vector3(1, 1.5, 0),
        10,
        InjuryType.BRUISE
      );

      const torsoInjuries = tracker.getInjuriesByBodyPart(BodyPart.TORSO_UPPER);
      expect(torsoInjuries).toHaveLength(2);
      expect(torsoInjuries.every((i) => i.bodyPart === BodyPart.TORSO_UPPER)).toBe(true);

      const headInjuries = tracker.getInjuriesByBodyPart(BodyPart.HEAD);
      expect(headInjuries).toHaveLength(1);
    });
  });

  describe("getBruiseColor", () => {
    it("should return yellow for light bruising (severity < 20)", () => {
      const color = tracker.getBruiseColor(15, 1);
      expect(color).toBe("#ffeb3b");
    });

    it("should return purple for moderate bruising (severity < 50)", () => {
      const color = tracker.getBruiseColor(35, 1);
      expect(color).toBe("#9c27b0");
    });

    it("should return dark red for severe bruising (severity >= 50)", () => {
      const color = tracker.getBruiseColor(60, 1);
      expect(color).toBe("#b71c1c");
    });

    it("should darken bruise with increased hit count", () => {
      // Low severity but high hit count should darken
      const color = tracker.getBruiseColor(10, 5);
      // 10 + (5-1)*10 = 50, should be dark red
      expect(color).toBe("#b71c1c");
    });

    it("should show progressive darkening (acceptance criteria)", () => {
      // First hit: Yellow
      const color1 = tracker.getBruiseColor(15, 1);
      expect(color1).toBe("#ffeb3b");

      // Second hit: Purple (15 + (2-1)*10 = 25)
      const color2 = tracker.getBruiseColor(15, 2);
      expect(color2).toBe("#9c27b0");

      // Fifth hit: Dark red (15 + (5-1)*10 = 55)
      const color5 = tracker.getBruiseColor(15, 5);
      expect(color5).toBe("#b71c1c");
    });
  });

  describe("shouldShowBloodEffect", () => {
    it("should trigger blood effects when damage > 30", () => {
      expect(tracker.shouldShowBloodEffect(31)).toBe(true);
      expect(tracker.shouldShowBloodEffect(50)).toBe(true);
      expect(tracker.shouldShowBloodEffect(100)).toBe(true);
    });

    it("should not trigger blood effects when damage <= 30", () => {
      expect(tracker.shouldShowBloodEffect(30)).toBe(false);
      expect(tracker.shouldShowBloodEffect(20)).toBe(false);
      expect(tracker.shouldShowBloodEffect(5)).toBe(false);
    });
  });

  describe("clearInjuries", () => {
    it("should remove all injuries", () => {
      tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        new THREE.Vector3(0, 1.5, 0),
        20,
        InjuryType.BRUISE
      );

      tracker.recordInjury(
        BodyPart.HEAD,
        BodyRegion.HEAD,
        new THREE.Vector3(0, 2.5, 0),
        15,
        InjuryType.CUT
      );

      tracker.clearInjuries();

      const injuries = tracker.getInjuries();
      expect(injuries).toHaveLength(0);
    });

    it("should reset ID counter", () => {
      tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        new THREE.Vector3(0, 1.5, 0),
        20,
        InjuryType.BRUISE
      );

      tracker.clearInjuries();

      const injury = tracker.recordInjury(
        BodyPart.HEAD,
        BodyRegion.HEAD,
        new THREE.Vector3(0, 2.5, 0),
        15,
        InjuryType.CUT
      );

      expect(injury).not.toBeNull();
      expect(injury!.id).toBe("injury-0");
    });
  });

  describe("removeExpiredInjuries", () => {
    it("should remove injuries older than expiration time", () => {
      vi.useFakeTimers();
      const config = {
        ...DEFAULT_INJURY_TRACKER_CONFIG,
        injuryExpirationTimeMs: 100, // 100ms for testing
      };
      const trackerWithExpiration = new InjuryTracker(config);

      trackerWithExpiration.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        new THREE.Vector3(0, 1.5, 0),
        20,
        InjuryType.BRUISE
      );

      // Fast-forward time past expiration
      vi.advanceTimersByTime(150);
      
      trackerWithExpiration.removeExpiredInjuries();
      const injuries = trackerWithExpiration.getInjuries();
      expect(injuries).toHaveLength(0);
      
      vi.useRealTimers();
    });

    it("should keep recent injuries", () => {
      tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        new THREE.Vector3(0, 1.5, 0),
        20,
        InjuryType.BRUISE
      );

      tracker.removeExpiredInjuries();

      const injuries = tracker.getInjuries();
      expect(injuries).toHaveLength(1);
    });
  });

  describe("getInjuryCount", () => {
    it("should return correct count", () => {
      expect(tracker.getInjuryCount()).toBe(0);

      tracker.recordInjury(
        BodyPart.TORSO_UPPER,
        BodyRegion.TORSO,
        new THREE.Vector3(0, 1.5, 0),
        20,
        InjuryType.BRUISE
      );

      expect(tracker.getInjuryCount()).toBe(1);

      tracker.recordInjury(
        BodyPart.HEAD,
        BodyRegion.HEAD,
        new THREE.Vector3(0, 2.5, 0),
        15,
        InjuryType.CUT
      );

      expect(tracker.getInjuryCount()).toBe(2);
    });
  });

  describe("E2E: Progressive bruising scenario", () => {
    it("should demonstrate progressive bruising over 5 strikes to same location", () => {
      const strikes: InjuryLocation[] = [];

      // Strike torso 5 times at same location
      for (let i = 0; i < 5; i++) {
        const nearbyPos = new THREE.Vector3(0.1 * i, 1.5, 0);
        const injury = tracker.recordInjury(
          BodyPart.TORSO_UPPER,
          BodyRegion.TORSO,
          nearbyPos,
          15,
          InjuryType.BRUISE
        );
        if (injury) {
          strikes.push(injury);
        }
      }

      // Should have only one injury (cumulative)
      const injuries = tracker.getInjuries();
      expect(injuries).toHaveLength(1);

      // Should have high hit count
      const cumulativeInjury = injuries[0];
      expect(cumulativeInjury.hitCount).toBe(5);

      // Severity should increase progressively
      expect(cumulativeInjury.severity).toBeGreaterThan(15);

      // Color should darken (yellow -> purple -> dark red)
      const color = tracker.getBruiseColor(
        cumulativeInjury.severity,
        cumulativeInjury.hitCount
      );
      // With severity ~45 and hitCount 5, effective severity = 45 + (5-1)*10 = 85
      expect(color).toBe("#b71c1c"); // Dark red
    });
  });
});
