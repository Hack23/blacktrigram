/**
 * Unit tests for SkeletonRig system
 * 
 * Tests bone creation, hierarchy, transformations, and utilities
 */

import { describe, it, expect } from "vitest";
import * as THREE from "three";
import {
  createBone,
  createHumanoidRig,
  updateBoneWorldMatrices,
  getBoneWorldPosition,
  getBoneWorldRotation,
  resetBone,
  resetRigToBind,
  cloneRig,
} from "./SkeletonRig";

describe("SkeletonRig", () => {
  describe("createBone", () => {
    it("should create a bone with correct properties", () => {
      const bone = createBone("pelvis", null, [0, 1, 0]);

      expect(bone.name).toBe("pelvis");
      expect(bone.parent).toBeNull();
      expect(bone.position.toArray()).toEqual([0, 1, 0]);
      expect(bone.rotation.toArray()).toEqual([0, 0, 0, "XYZ"]);
      expect(bone.scale.toArray()).toEqual([1, 1, 1]);
      expect(bone.children).toEqual([]);
      expect(bone.worldMatrix).toBeInstanceOf(THREE.Matrix4);
    });

    it("should add bone to parent's children", () => {
      const parent = createBone("pelvis", null, [0, 1, 0]);
      const child = createBone("spine_lower", parent, [0, 0.15, 0]);

      expect(parent.children).toContain(child);
      expect(child.parent).toBe(parent);
    });

    it("should handle multiple children", () => {
      const parent = createBone("pelvis", null, [0, 1, 0]);
      const child1 = createBone("spine_lower", parent, [0, 0.15, 0]);
      const child2 = createBone("hip_L", parent, [-0.1, -0.1, 0]);

      expect(parent.children).toHaveLength(2);
      expect(parent.children).toContain(child1);
      expect(parent.children).toContain(child2);
    });
  });

  describe("createHumanoidRig", () => {
    it("should create a complete humanoid rig", () => {
      const rig = createHumanoidRig();

      expect(rig.root).toBeDefined();
      expect(rig.root.name).toBe("pelvis");
      expect(rig.bones.size).toBe(30); // 30 bones total
    });

    it("should have all required bones", () => {
      const rig = createHumanoidRig();

      // Root and spine
      expect(rig.bones.has("pelvis")).toBe(true);
      expect(rig.bones.has("spine_lower")).toBe(true);
      expect(rig.bones.has("spine_middle")).toBe(true);
      expect(rig.bones.has("spine_upper")).toBe(true);

      // Head
      expect(rig.bones.has("neck")).toBe(true);
      expect(rig.bones.has("head")).toBe(true);

      // Left arm
      expect(rig.bones.has("shoulder_L")).toBe(true);
      expect(rig.bones.has("upper_arm_L")).toBe(true);
      expect(rig.bones.has("elbow_L")).toBe(true);
      expect(rig.bones.has("forearm_L")).toBe(true);
      expect(rig.bones.has("wrist_L")).toBe(true);
      expect(rig.bones.has("hand_L")).toBe(true);

      // Right arm
      expect(rig.bones.has("shoulder_R")).toBe(true);
      expect(rig.bones.has("upper_arm_R")).toBe(true);
      expect(rig.bones.has("elbow_R")).toBe(true);
      expect(rig.bones.has("forearm_R")).toBe(true);
      expect(rig.bones.has("wrist_R")).toBe(true);
      expect(rig.bones.has("hand_R")).toBe(true);

      // Left leg
      expect(rig.bones.has("hip_L")).toBe(true);
      expect(rig.bones.has("thigh_L")).toBe(true);
      expect(rig.bones.has("knee_L")).toBe(true);
      expect(rig.bones.has("shin_L")).toBe(true);
      expect(rig.bones.has("ankle_L")).toBe(true);
      expect(rig.bones.has("foot_L")).toBe(true);

      // Right leg
      expect(rig.bones.has("hip_R")).toBe(true);
      expect(rig.bones.has("thigh_R")).toBe(true);
      expect(rig.bones.has("knee_R")).toBe(true);
      expect(rig.bones.has("shin_R")).toBe(true);
      expect(rig.bones.has("ankle_R")).toBe(true);
      expect(rig.bones.has("foot_R")).toBe(true);
    });

    it("should have correct bone hierarchy", () => {
      const rig = createHumanoidRig();

      // Check spine chain
      const spineLower = rig.bones.get("spine_lower")!;
      expect(spineLower.parent?.name).toBe("pelvis");

      const spineMiddle = rig.bones.get("spine_middle")!;
      expect(spineMiddle.parent?.name).toBe("spine_lower");

      const spineUpper = rig.bones.get("spine_upper")!;
      expect(spineUpper.parent?.name).toBe("spine_middle");

      // Check arm chain
      const shoulderR = rig.bones.get("shoulder_R")!;
      expect(shoulderR.parent?.name).toBe("spine_upper");

      const upperArmR = rig.bones.get("upper_arm_R")!;
      expect(upperArmR.parent?.name).toBe("shoulder_R");

      const elbowR = rig.bones.get("elbow_R")!;
      expect(elbowR.parent?.name).toBe("upper_arm_R");

      // Check leg chain
      const hipL = rig.bones.get("hip_L")!;
      expect(hipL.parent?.name).toBe("pelvis");

      const thighL = rig.bones.get("thigh_L")!;
      expect(thighL.parent?.name).toBe("hip_L");

      const kneeL = rig.bones.get("knee_L")!;
      expect(kneeL.parent?.name).toBe("thigh_L");
    });
  });

  describe("updateBoneWorldMatrices", () => {
    it("should update world matrices for bone hierarchy", () => {
      const parent = createBone("pelvis", null, [0, 1, 0]);
      const child = createBone("spine_lower", parent, [0, 0.15, 0]);

      updateBoneWorldMatrices(parent);

      // Parent world position should match local position
      const parentWorldPos = new THREE.Vector3();
      parentWorldPos.setFromMatrixPosition(parent.worldMatrix);
      expect(parentWorldPos.toArray()).toEqual([0, 1, 0]);

      // Child world position should be parent + child local
      const childWorldPos = new THREE.Vector3();
      childWorldPos.setFromMatrixPosition(child.worldMatrix);
      expect(childWorldPos.y).toBeCloseTo(1.15);
    });

    it("should handle rotation in world matrices", () => {
      const parent = createBone("pelvis", null, [0, 0, 0]);
      parent.rotation.set(0, Math.PI / 2, 0); // 90 degree Y rotation

      const child = createBone("spine_lower", parent, [1, 0, 0]);

      updateBoneWorldMatrices(parent);

      // Child should be rotated by parent's rotation
      // 90 degree Y rotation: X becomes -Z (right-hand rule)
      const childWorldPos = getBoneWorldPosition(child);
      expect(childWorldPos.x).toBeCloseTo(0, 5);
      expect(childWorldPos.z).toBeCloseTo(-1, 5); // Rotated from X to -Z
    });
  });

  describe("getBoneWorldPosition", () => {
    it("should return correct world position", () => {
      const rig = createHumanoidRig();
      updateBoneWorldMatrices(rig.root);

      const headBone = rig.bones.get("head")!;
      const worldPos = getBoneWorldPosition(headBone);

      // Head should be at pelvis + spine chain + neck + head
      // Approximate: 0.9 + 0.15 + 0.2 + 0.2 + 0.15 + 0.2 = 1.8
      expect(worldPos.y).toBeCloseTo(1.8, 1);
    });
  });

  describe("getBoneWorldRotation", () => {
    it("should return correct world rotation", () => {
      const parent = createBone("pelvis", null, [0, 0, 0]);
      parent.rotation.set(0, Math.PI / 4, 0);

      updateBoneWorldMatrices(parent);

      const rotation = getBoneWorldRotation(parent);
      expect(rotation.y).toBeCloseTo(Math.PI / 4, 5);
    });
  });

  describe("resetBone", () => {
    it("should reset bone rotation to zero", () => {
      const bone = createBone("pelvis", null, [0, 1, 0]);
      bone.rotation.set(0.5, 0.3, 0.2);

      resetBone(bone);

      expect(bone.rotation.toArray()).toEqual([0, 0, 0, "XYZ"]);
    });

    it("should keep position unchanged", () => {
      const bone = createBone("pelvis", null, [0, 1, 0]);
      bone.rotation.set(0.5, 0.3, 0.2);

      resetBone(bone);

      expect(bone.position.toArray()).toEqual([0, 1, 0]);
    });
  });

  describe("resetRigToBind", () => {
    it("should reset all bones in rig", () => {
      const rig = createHumanoidRig();

      // Rotate some bones
      rig.bones.get("shoulder_R")!.rotation.set(0.5, 0, 0);
      rig.bones.get("elbow_R")!.rotation.set(0, 0, -1.5);
      rig.bones.get("knee_L")!.rotation.set(0, 0, 0.3);

      resetRigToBind(rig);

      // All bones should have zero rotation
      rig.bones.forEach((bone) => {
        expect(bone.rotation.toArray()).toEqual([0, 0, 0, "XYZ"]);
      });
    });
  });

  describe("cloneRig", () => {
    it("should create independent copy of rig", () => {
      const original = createHumanoidRig();
      const cloned = cloneRig(original);

      expect(cloned.root).not.toBe(original.root);
      expect(cloned.bones.size).toBe(original.bones.size);
    });

    it("should have independent bone instances", () => {
      const original = createHumanoidRig();
      const cloned = cloneRig(original);

      const originalElbow = original.bones.get("elbow_R")!;
      const clonedElbow = cloned.bones.get("elbow_R")!;

      expect(clonedElbow).not.toBe(originalElbow);

      // Modify original
      originalElbow.rotation.set(0, 0, -1.5);

      // Cloned should be unaffected
      expect(clonedElbow.rotation.toArray()).toEqual([0, 0, 0, "XYZ"]);
    });

    it("should preserve bone hierarchy", () => {
      const original = createHumanoidRig();
      const cloned = cloneRig(original);

      const clonedElbow = cloned.bones.get("elbow_R")!;
      expect(clonedElbow.parent?.name).toBe("upper_arm_R");

      const clonedUpperArm = cloned.bones.get("upper_arm_R")!;
      expect(clonedUpperArm.children).toContain(clonedElbow);
    });

    it("should clone positions and rotations", () => {
      const original = createHumanoidRig();
      const originalElbow = original.bones.get("elbow_R")!;
      originalElbow.rotation.set(0, 0, -1.5);

      const cloned = cloneRig(original);
      const clonedElbow = cloned.bones.get("elbow_R")!;

      expect(clonedElbow.rotation.z).toBeCloseTo(-1.5, 5);
      expect(clonedElbow.position.toArray()).toEqual(
        originalElbow.position.toArray()
      );
    });
  });

  describe("Performance", () => {
    it("should handle 30 bones efficiently", () => {
      const startTime = performance.now();

      const rig = createHumanoidRig();
      updateBoneWorldMatrices(rig.root);

      const endTime = performance.now();
      const elapsed = endTime - startTime;

      // Should complete in under 5ms for 60fps compatibility
      expect(elapsed).toBeLessThan(5);
    });

    it("should handle 100 updates efficiently", () => {
      const rig = createHumanoidRig();

      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        // Simulate animation update
        const elbow = rig.bones.get("elbow_R")!;
        elbow.rotation.z = Math.sin(i * 0.1);
        updateBoneWorldMatrices(rig.root);
      }

      const endTime = performance.now();
      const elapsed = endTime - startTime;

      // 100 updates should be fast (target: < 50ms)
      expect(elapsed).toBeLessThan(50);
    });
  });
});
