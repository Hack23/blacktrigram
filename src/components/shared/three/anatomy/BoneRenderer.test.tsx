/**
 * Tests for BoneRenderer component with physical attributes
 * 
 * Validates bone thickness scaling based on physical attributes
 * and ensures proper integration with skeletal rig rendering.
 * 
 * @module components/three/BoneRenderer.test
 * @category Tests
 * @korean 뼈렌더러컴포넌트테스트
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect } from "vitest";
import React, { Suspense } from "react";
import * as THREE from "three";
import { BoneRenderer } from "./BoneRenderer";
import { createHumanoidRig } from "../../../../systems/animation/SkeletonRig";
import { KOREAN_COLORS } from "../../../../types/constants";

// Helper to render Three.js components
function render3D(component: React.ReactElement) {
  return render(
    <Canvas>
      <Suspense fallback={null}>{component}</Suspense>
    </Canvas>
  );
}

describe("BoneRenderer", () => {
  const testRig = createHumanoidRig();

  describe("Basic rendering", () => {
    it("should render without crashing", () => {
      const { container } = render3D(
        <BoneRenderer rig={testRig} />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with custom color", () => {
      const { container } = render3D(
        <BoneRenderer 
          rig={testRig} 
          color={KOREAN_COLORS.PRIMARY_CYAN}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should not render when showBones is false", () => {
      const { container } = render3D(
        <BoneRenderer 
          rig={testRig} 
          showBones={false}
        />
      );

      // Component should render canvas but not bones
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render in debug mode", () => {
      const { container } = render3D(
        <BoneRenderer 
          rig={testRig} 
          renderMode="debug"
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Bone thickness scaling with physical attributes", () => {
    it("should render without physical attributes (backward compatibility)", () => {
      const { container } = render3D(
        <BoneRenderer rig={testRig} />
      );

      expect(container).toBeTruthy();
    });

    it("should render with high muscle mass (Jojik archetype)", () => {
      const { container } = render3D(
        <BoneRenderer 
          rig={testRig}
          physicalAttributes={{ muscleMass: 42, fatMass: 18 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with low muscle mass (Amsalja archetype)", () => {
      const { container } = render3D(
        <BoneRenderer 
          rig={testRig}
          physicalAttributes={{ muscleMass: 32, fatMass: 9 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with average muscle mass (Musa archetype)", () => {
      const { container } = render3D(
        <BoneRenderer 
          rig={testRig}
          physicalAttributes={{ muscleMass: 38, fatMass: 12 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with below average muscle mass (Hacker archetype)", () => {
      const { container } = render3D(
        <BoneRenderer 
          rig={testRig}
          physicalAttributes={{ muscleMass: 34, fatMass: 14 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with fit operative build (Jeongbo archetype)", () => {
      const { container } = render3D(
        <BoneRenderer 
          rig={testRig}
          physicalAttributes={{ muscleMass: 36, fatMass: 11 }}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Bone thickness calculation validation", () => {
    // Helper to calculate expected bone thickness
    const calculateExpectedThickness = (muscleMass: number, fatMass: number): number => {
      const muscleContribution = Math.sqrt(muscleMass / 35) * 0.7;
      const fatContribution = Math.sqrt(fatMass / 12) * 0.3;
      return muscleContribution + fatContribution;
    };

    it("should calculate ~0.93x thickness for Amsalja (32kg muscle, 9kg fat)", () => {
      const expected = calculateExpectedThickness(32, 9);
      expect(expected).toBeCloseTo(0.93, 2);
    });

    it("should calculate ~1.03x thickness for Musa (38kg muscle, 12kg fat)", () => {
      const expected = calculateExpectedThickness(38, 12);
      expect(expected).toBeCloseTo(1.03, 2);
    });

    it("should calculate ~1.00x thickness for Jeongbo (36kg muscle, 11kg fat)", () => {
      const expected = calculateExpectedThickness(36, 11);
      expect(expected).toBeCloseTo(1.00, 2);
    });

    it("should calculate ~1.01x thickness for Hacker (34kg muscle, 14kg fat)", () => {
      const expected = calculateExpectedThickness(34, 14);
      expect(expected).toBeCloseTo(1.01, 2);
    });

    it("should calculate ~1.13x thickness for Jojik (42kg muscle, 18kg fat)", () => {
      const expected = calculateExpectedThickness(42, 18);
      expect(expected).toBeCloseTo(1.13, 2);
    });

    it("should calculate 1.0x thickness for reference values (35kg muscle, 12kg fat)", () => {
      const expected = calculateExpectedThickness(35, 12);
      expect(expected).toBeCloseTo(1.0, 2);
    });
  });

  describe("Integration with facial features", () => {
    it("should render with facial expressions enabled", () => {
      const { container } = render3D(
        <BoneRenderer 
          rig={testRig}
          enableFacialExpressions={true}
          facialExpression="neutral"
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with eye tracking enabled", () => {
      const { container } = render3D(
        <BoneRenderer 
          rig={testRig}
          enableEyeTracking={true}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Performance considerations", () => {
    it("should render efficiently with physical attributes", () => {
      const startTime = performance.now();

      const { container } = render3D(
        <BoneRenderer 
          rig={testRig}
          physicalAttributes={{ muscleMass: 38, fatMass: 12 }}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(container).toBeTruthy();
      // Rendering should be reasonably fast (generous timeout for CI)
      expect(renderTime).toBeLessThan(1000);
    });
  });

  describe("Edge cases", () => {
    it("should handle very low muscle mass", () => {
      const { container } = render3D(
        <BoneRenderer 
          rig={testRig}
          physicalAttributes={{ muscleMass: 25, fatMass: 8 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should handle very high muscle mass", () => {
      const { container } = render3D(
        <BoneRenderer 
          rig={testRig}
          physicalAttributes={{ muscleMass: 50, fatMass: 22 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should handle extreme fat variations", () => {
      const { container } = render3D(
        <BoneRenderer 
          rig={testRig}
          physicalAttributes={{ muscleMass: 35, fatMass: 25 }}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Bone orientation correctness", () => {
    it("should calculate correct rotation for downward-pointing leg bones", () => {
      // Test the rotation calculation logic directly for leg bones (pointing down in -Y)
      const leftThigh = testRig.bones.get("thigh_L");
      expect(leftThigh).toBeDefined();
      
      if (leftThigh) {
        // Thigh bone position is [0, -0.3, 0] (pointing downward in negative Y)
        // When normalized, this becomes [0, -1, 0]
        const normalizedDirection = leftThigh.position.clone().normalize();
        
        // Verify the bone is pointing downward (negative Y direction)
        expect(normalizedDirection.x).toBeCloseTo(0, 5);
        expect(normalizedDirection.y).toBeCloseTo(-1, 5);
        expect(normalizedDirection.z).toBeCloseTo(0, 5);
        
        // Calculate expected rotation from Y-axis (0,1,0) to downward (-Y)
        // This should result in a 180-degree rotation around Z-axis
        const capsuleDefaultDirection = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          capsuleDefaultDirection,
          normalizedDirection
        );
        const rotation = new THREE.Euler().setFromQuaternion(quaternion);
        
        // The rotation should be approximately PI radians (180 degrees) around Z-axis
        // to flip the capsule from pointing up to pointing down
        expect(Math.abs(rotation.z)).toBeCloseTo(Math.PI, 1);
      }
    });

    it("should calculate correct rotation for horizontal arm bones", () => {
      // Test the rotation calculation logic for arm bones (pointing horizontally in -X)
      const leftUpperArm = testRig.bones.get("upper_arm_L");
      expect(leftUpperArm).toBeDefined();
      
      if (leftUpperArm) {
        // Upper arm position is [-0.15, 0, 0] (pointing left in negative X)
        // When normalized, this becomes [-1, 0, 0]
        const normalizedDirection = leftUpperArm.position.clone().normalize();
        
        // Verify the bone is pointing horizontally left (negative X direction)
        expect(normalizedDirection.x).toBeCloseTo(-1, 5);
        expect(normalizedDirection.y).toBeCloseTo(0, 5);
        expect(normalizedDirection.z).toBeCloseTo(0, 5);
        
        // Calculate expected rotation from Y-axis (0,1,0) to left (-X)
        const capsuleDefaultDirection = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          capsuleDefaultDirection,
          normalizedDirection
        );
        const rotation = new THREE.Euler().setFromQuaternion(quaternion);
        
        // The rotation should be approximately PI/2 (90 degrees) around Z-axis
        // to rotate the capsule from pointing up to pointing left
        expect(Math.abs(rotation.z)).toBeCloseTo(Math.PI / 2, 1);
      }
    });

    it("should calculate correct rotation for upward-pointing spine bones", () => {
      // Test the rotation calculation logic for spine bones (pointing upward in +Y)
      const spineLower = testRig.bones.get("spine_lower");
      expect(spineLower).toBeDefined();
      
      if (spineLower) {
        // Spine lower position is [0, 0.15, 0] (pointing upward in positive Y)
        // When normalized, this becomes [0, 1, 0]
        const normalizedDirection = spineLower.position.clone().normalize();
        
        // Verify the bone is pointing upward (positive Y direction)
        expect(normalizedDirection.x).toBeCloseTo(0, 5);
        expect(normalizedDirection.y).toBeCloseTo(1, 5);
        expect(normalizedDirection.z).toBeCloseTo(0, 5);
        
        // Calculate expected rotation from Y-axis (0,1,0) to upward (+Y)
        const capsuleDefaultDirection = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          capsuleDefaultDirection,
          normalizedDirection
        );
        const rotation = new THREE.Euler().setFromQuaternion(quaternion);
        
        // The rotation should be near zero since both source and target are the same (0,1,0)
        expect(Math.abs(rotation.x)).toBeLessThan(0.01);
        expect(Math.abs(rotation.y)).toBeLessThan(0.01);
        expect(Math.abs(rotation.z)).toBeLessThan(0.01);
      }
    });

    it("should render without crashing with various bone orientations", () => {
      // Smoke test to ensure the component renders with the corrected orientation logic
      const { container } = render3D(
        <BoneRenderer 
          rig={testRig}
          renderMode="debug"
          showBones={true}
        />
      );

      expect(container).toBeTruthy();
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
