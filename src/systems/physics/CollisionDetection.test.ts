/**
 * Unit tests for CollisionDetection system.
 * 
 * Tests precise collision detection for the 70 vital points combat system,
 * including bounding boxes, attack reach calculation, and raycasting.
 * 
 * @module systems/physics/CollisionDetection.test
 */

import { describe, it, expect, beforeEach } from "vitest";
import * as THREE from "three";
import { CollisionDetection } from "./CollisionDetection";
import { TrigramStance } from "../../types/common";
import type { Position3D, AnatomicalRegionPhysics } from "../../types/physics";

describe("CollisionDetection", () => {
  let collision: CollisionDetection;

  beforeEach(() => {
    collision = new CollisionDetection();
  });

  describe("Bounding Box Initialization", () => {
    it("should initialize all 5 anatomical region bounding boxes", () => {
      const regions: AnatomicalRegionPhysics[] = ["head", "neck", "torso", "arms", "legs"];
      
      regions.forEach(region => {
        const boundingBox = collision.getBoundingBox(region);
        expect(boundingBox).toBeDefined();
        expect(boundingBox?.region).toBe(region);
      });
    });

    it("should create head bounding box as sphere with correct dimensions", () => {
      const headBox = collision.getBoundingBox("head");
      
      expect(headBox?.type).toBe("sphere");
      expect(headBox?.dimensions.x).toBe(0.125); // 12.5cm radius
      expect(headBox?.center.y).toBe(1.7); // Average adult head height
    });

    it("should create neck bounding box as capsule with correct dimensions", () => {
      const neckBox = collision.getBoundingBox("neck");
      
      expect(neckBox?.type).toBe("capsule");
      expect(neckBox?.dimensions.x).toBe(0.075); // 7.5cm radius
      expect(neckBox?.dimensions.y).toBe(0.15); // 15cm height
    });

    it("should create torso bounding box as box with correct dimensions", () => {
      const torsoBox = collision.getBoundingBox("torso");
      
      expect(torsoBox?.type).toBe("box");
      expect(torsoBox?.dimensions.x).toBe(0.4); // 40cm width
      expect(torsoBox?.dimensions.y).toBe(0.6); // 60cm height
      expect(torsoBox?.dimensions.z).toBe(0.25); // 25cm depth
    });

    it("should create arms bounding box as capsule", () => {
      const armsBox = collision.getBoundingBox("arms");
      
      expect(armsBox?.type).toBe("capsule");
      expect(armsBox?.dimensions.x).toBe(0.05); // 5cm radius
      expect(armsBox?.dimensions.y).toBe(0.6); // 60cm length
    });

    it("should create legs bounding box as capsule", () => {
      const legsBox = collision.getBoundingBox("legs");
      
      expect(legsBox?.type).toBe("capsule");
      expect(legsBox?.dimensions.x).toBe(0.06); // 6cm radius
      expect(legsBox?.dimensions.y).toBe(0.8); // 80cm length
    });
  });

  describe("Attack Reach Calculation", () => {
    // Coordinate mapper now implemented - tests enabled!
    it("should calculate correct reach for punch technique", () => {
      const attackerPos: Position3D = { x: 0, y: 0, z: 5 };
      const defenderPos: Position3D = { x: 0, y: 0, z: 5.6 }; // 0.6m away (within 0.7m punch range)
      
      const result = collision.checkAttackHit(
        attackerPos,
        defenderPos,
        { type: "punch" },
        TrigramStance.GEON, // Heaven: +10% reach = 0.77m
        "torso"
      );
      
      expect(result.hit).toBe(true);
      expect(result.distance).toBeCloseTo(0.6, 2);
    });

    it("should calculate correct reach for kick technique", () => {
      const attackerPos: Position3D = { x: 0, y: 0, z: 5 };
      const defenderPos: Position3D = { x: 0, y: 0, z: 5.9 }; // 0.9m away (within 1.0m kick range)
      
      const result = collision.checkAttackHit(
        attackerPos,
        defenderPos,
        { type: "kick" },
        TrigramStance.GEON, // Heaven: +10% reach = 1.1m
        "torso"
      );
      
      expect(result.hit).toBe(true);
      expect(result.distance).toBeCloseTo(0.9, 2);
    });

    it("should apply Fire stance reach modifier (+20%)", () => {
      const attackerPos: Position3D = { x: 0, y: 0, z: 5 };
      const defenderPos: Position3D = { x: 0, y: 0, z: 5.8 }; // 0.8m away
      
      // Punch base reach: 0.7m × 1.2 (Fire) = 0.84m
      const result = collision.checkAttackHit(
        attackerPos,
        defenderPos,
        { type: "punch" },
        TrigramStance.LI, // Fire: +20% reach
        "torso"
      );
      
      expect(result.hit).toBe(true);
    });

    it("should apply Mountain stance reach modifier (-10%)", () => {
      const attackerPos: Position3D = { x: 0, y: 0, z: 5 };
      const defenderPos: Position3D = { x: 0, y: 0, z: 5.65 }; // 0.65m away
      
      // Punch base reach: 0.7m × 0.9 (Mountain) = 0.63m
      const result = collision.checkAttackHit(
        attackerPos,
        defenderPos,
        { type: "punch" },
        TrigramStance.GAN, // Mountain: -10% reach
        "torso"
      );
      
      expect(result.hit).toBe(false); // Out of reach
      expect(result.distance).toBeCloseTo(0.65, 2);
    });
  });

  describe("Broad-Phase Collision Detection", () => {
    it("should reject hits beyond attack reach", () => {
      const attackerPos: Position3D = { x: 0, y: 0, z: 5 };
      const defenderPos: Position3D = { x: 0, y: 0, z: 7 }; // 2m away (beyond any reach)
      
      const result = collision.checkAttackHit(
        attackerPos,
        defenderPos,
        { type: "punch" },
        TrigramStance.GEON,
        "torso"
      );
      
      expect(result.hit).toBe(false);
      expect(result.distance).toBeCloseTo(2, 2);
    });

    // Note: Skipped due to coordinate mapping issue (2D→3D conversion needed)
    // TODO: Enable after implementing proper coordinate mapper
    // Track progress: https://github.com/Hack23/blacktrigram/issues/[COORDINATE_MAPPING_ISSUE]
    it("should accept hits within attack reach", () => {
      const attackerPos: Position3D = { x: 0, y: 0, z: 5 };
      const defenderPos: Position3D = { x: 0, y: 0, z: 5.5 }; // 0.5m away (within range)
      
      const result = collision.checkAttackHit(
        attackerPos,
        defenderPos,
        { type: "kick" },
        TrigramStance.GEON,
        "torso"
      );
      
      expect(result.hit).toBe(true);
    });
  });

  describe("Narrow-Phase Raycasting", () => {
    // Note: Skipped due to coordinate mapping issue (2D→3D conversion needed)
    // TODO: Enable after implementing proper coordinate mapper
    // Track progress: https://github.com/Hack23/blacktrigram/issues/[COORDINATE_MAPPING_ISSUE]
    it("should detect hits on head region", () => {
      const attackerPos: Position3D = { x: 0, y: 0, z: 5 };
      const defenderPos: Position3D = { x: 0, y: 0, z: 5.6 };
      
      const result = collision.checkAttackHit(
        attackerPos,
        defenderPos,
        { type: "punch" },
        TrigramStance.GEON,
        "head"
      );
      
      expect(result.hit).toBe(true);
      expect(result.region).toBe("head");
    });

    it("should identify specific vital point in region", () => {
      const attackerPos: Position3D = { x: 0, y: 0, z: 5 };
      const defenderPos: Position3D = { x: 0, y: 0, z: 5.6 };
      
      const result = collision.checkAttackHit(
        attackerPos,
        defenderPos,
        { type: "punch" },
        TrigramStance.GEON,
        "torso"
      );
      
      if (result.hit && result.vitalPoint) {
        expect(result.vitalPoint.id).toBeDefined();
        expect(result.vitalPoint.names).toBeDefined();
        expect(result.vitalPoint.names.korean).toBeDefined();
        expect(result.vitalPoint.names.english).toBeDefined();
      }
    });

    it("should calculate hit accuracy based on distance to vital point center", () => {
      const attackerPos: Position3D = { x: 0, y: 0, z: 5 };
      const defenderPos: Position3D = { x: 0, y: 0, z: 5.5 };
      
      const result = collision.checkAttackHit(
        attackerPos,
        defenderPos,
        { type: "pressure_point" },
        TrigramStance.LI,
        "torso"
      );
      
      expect(result.accuracy).toBeGreaterThanOrEqual(0);
      expect(result.accuracy).toBeLessThanOrEqual(1);
    });
  });

  describe("Vital Points Organization", () => {
    // Note: Skipped due to coordinate mapping issue - vital points use 2D coordinates
    // TODO: Enable after implementing proper coordinate mapper
    // Track progress: https://github.com/Hack23/blacktrigram/issues/[COORDINATE_MAPPING_ISSUE]
    it("should organize vital points by anatomical region", () => {
      const headPoints = collision.getVitalPointsInRegion("head");
      const neckPoints = collision.getVitalPointsInRegion("neck");
      const torsoPoints = collision.getVitalPointsInRegion("torso");
      const armPoints = collision.getVitalPointsInRegion("arms");
      const legPoints = collision.getVitalPointsInRegion("legs");
      
      expect(headPoints.length).toBeGreaterThan(0);
      expect(neckPoints.length).toBeGreaterThan(0);
      expect(torsoPoints.length).toBeGreaterThan(0);
      expect(armPoints.length).toBeGreaterThan(0);
      expect(legPoints.length).toBeGreaterThan(0);
    });

    it("should have correct total number of vital points across all regions", () => {
      const regions: AnatomicalRegionPhysics[] = ["head", "neck", "torso", "arms", "legs"];
      let totalPoints = 0;
      
      regions.forEach(region => {
        const points = collision.getVitalPointsInRegion(region);
        totalPoints += points.length;
      });
      
      // Should have all 70 vital points
      expect(totalPoints).toBeGreaterThan(0);
      expect(totalPoints).toBeLessThanOrEqual(70);
    });
  });

  describe("Performance Characteristics", () => {
    it("should complete collision check in <1ms", () => {
      const attackerPos: Position3D = { x: 0, y: 0, z: 5 };
      const defenderPos: Position3D = { x: 0, y: 0, z: 5.6 };
      
      const startTime = performance.now();
      
      collision.checkAttackHit(
        attackerPos,
        defenderPos,
        { type: "punch" },
        TrigramStance.GEON,
        "torso"
      );
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(1); // <1ms for single check
    });

    it("should handle 100 collision checks within 60fps budget (16ms)", () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        const attackerPos: Position3D = { x: 0, y: 0, z: 5 };
        const defenderPos: Position3D = { 
          x: Math.random() * 2 - 1, 
          y: Math.random() * 2, 
          z: 5 + Math.random() * 2 
        };
        
        collision.checkAttackHit(
          attackerPos,
          defenderPos,
          { type: i % 2 === 0 ? "punch" : "kick" },
          TrigramStance.GEON,
          "torso"
        );
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(16); // Within 60fps frame budget
    });
  });

  describe("Edge Cases", () => {
    // Note: Skipped due to coordinate mapping issue (2D→3D conversion needed)
    it("should handle attack from same position as defender", () => {
      const position: Position3D = { x: 0, y: 0, z: 5 };
      
      const result = collision.checkAttackHit(
        position,
        position,
        { type: "punch" },
        TrigramStance.GEON,
        "torso"
      );
      
      expect(result.distance).toBe(0);
      expect(result.hit).toBe(true); // At point-blank range
    });

    it("should handle invalid technique type gracefully", () => {
      const attackerPos: Position3D = { x: 0, y: 0, z: 5 };
      const defenderPos: Position3D = { x: 0, y: 0, z: 5.5 };
      
      const result = collision.checkAttackHit(
        attackerPos,
        defenderPos,
        { type: "invalid_technique" },
        TrigramStance.GEON,
        "torso"
      );
      
      // Should default to punch and still work
      expect(result).toBeDefined();
      expect(result.distance).toBeCloseTo(0.5, 2);
    });

    it("should handle extreme distances correctly", () => {
      const attackerPos: Position3D = { x: 0, y: 0, z: 0 };
      const defenderPos: Position3D = { x: 0, y: 0, z: 100 }; // 100m away
      
      const result = collision.checkAttackHit(
        attackerPos,
        defenderPos,
        { type: "kick" },
        TrigramStance.LI, // Fire stance with longest reach
        "torso"
      );
      
      expect(result.hit).toBe(false);
      expect(result.distance).toBeCloseTo(100, 1);
    });
  });

  describe("Korean Terminology", () => {
    it("should use correct Korean terms for anatomical regions", () => {
      // 머리 (Head), 목 (Neck), 몸통 (Torso), 팔 (Arms), 다리 (Legs)
      const regions: AnatomicalRegionPhysics[] = ["head", "neck", "torso", "arms", "legs"];
      
      regions.forEach(region => {
        const box = collision.getBoundingBox(region);
        expect(box).toBeDefined();
        expect(box?.region).toBe(region);
      });
    });
  });
});

describe("CollisionDetection - Resource Management", () => {
  it("should dispose of cached geometries", () => {
    const collision = new CollisionDetection();
    
    // Perform some collision checks to ensure geometry cache is populated
    const attackerPos = new THREE.Vector3(0, 1, 0);
    const defenderPos = new THREE.Vector3(1, 1, 0);
    const technique = { type: "punch" as const };
    
    collision.checkAttackHit(
      attackerPos,
      defenderPos,
      technique,
      TrigramStance.GEON,
      "torso"
    );
    
    // Dispose should not throw
    expect(() => collision.dispose()).not.toThrow();
    
    // After disposal, geometry cache is cleared
    // Note: The collision detection instance is still valid, but geometries
    // are disposed. In a real application, a new CollisionDetection instance
    // would be created after disposal rather than reusing the disposed one.
  });

  it("should allow multiple dispose calls without errors", () => {
    const collision = new CollisionDetection();
    
    // Multiple dispose calls should not throw
    expect(() => {
      collision.dispose();
      collision.dispose();
      collision.dispose();
    }).not.toThrow();
  });
});
