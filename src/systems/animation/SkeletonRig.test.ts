/**
 * Unit tests for SkeletonRig
 *
 * Tests bone creation, humanoid rig structure, joint constraints,
 * and bone transformation calculations.
 */

import * as THREE from "three";
import { describe, expect, it } from "vitest";
import {
  AMSALJA_PHYSICAL,
  HACKER_PHYSICAL,
  JEONGBO_PHYSICAL,
  JOJIK_PHYSICAL,
  MUSA_PHYSICAL,
} from "../../data/archetypePhysicalAttributes";
import { BoneName } from "../../types/skeletal";
import {
  applyJointConstraint,
  BONE_CHAINS,
  createBone,
  createHumanoidRig,
  createScaledHumanoidRig,
  getBoneWorldPosition,
  getBoneWorldRotation,
  JOINT_CONSTRAINTS,
  resetBoneToRestPose,
  resetRigToRestPose,
} from "./SkeletonRig";

describe("SkeletonRig", () => {
  describe("createBone", () => {
    it("should create a bone with specified properties", () => {
      const bone = createBone("test_bone", null, [1, 2, 3], 0.5);

      expect(bone.name).toBe("test_bone");
      expect(bone.parent).toBeNull();
      expect(bone.position.toArray()).toEqual([1, 2, 3]);
      expect(bone.length).toBe(0.5);
      expect(bone.children).toEqual([]);
    });

    it("should add child bone to parent's children array", () => {
      const parent = createBone("parent", null, [0, 0, 0]);
      const child = createBone("child", parent, [1, 0, 0]);

      expect(parent.children).toContain(child);
      expect(child.parent).toBe(parent);
    });

    it("should initialize rest pose", () => {
      const bone = createBone("test", null, [1, 2, 3]);

      expect(bone.restPosition.toArray()).toEqual([1, 2, 3]);
      expect(bone.restRotation.toArray()).toEqual([0, 0, 0, "XYZ"]);
    });

    it("should initialize scale to 1,1,1", () => {
      const bone = createBone("test", null, [0, 0, 0]);

      expect(bone.scale.toArray()).toEqual([1, 1, 1]);
    });
  });

  describe("createHumanoidRig", () => {
    it("should create rig with 28 bones", () => {
      const rig = createHumanoidRig();

      expect(rig.boneCount).toBe(28);
      expect(rig.bones.size).toBe(28);
    });

    it("should have root bone at pelvis", () => {
      const rig = createHumanoidRig();

      expect(rig.root.name).toBe(BoneName.PELVIS);
      expect(rig.root.parent).toBeNull();
    });

    it("should have complete spine chain", () => {
      const rig = createHumanoidRig();

      const pelvis = rig.bones.get(BoneName.PELVIS);
      const spineLower = rig.bones.get(BoneName.SPINE_LOWER);
      const spineMiddle = rig.bones.get(BoneName.SPINE_MIDDLE);
      const spineUpper = rig.bones.get(BoneName.SPINE_UPPER);

      expect(spineLower?.parent).toBe(pelvis);
      expect(spineMiddle?.parent).toBe(spineLower);
      expect(spineUpper?.parent).toBe(spineMiddle);
    });

    it("should have complete left arm chain", () => {
      const rig = createHumanoidRig();

      const shoulder = rig.bones.get(BoneName.SHOULDER_L);
      const upperArm = rig.bones.get(BoneName.UPPER_ARM_L);
      const elbow = rig.bones.get(BoneName.ELBOW_L);
      const forearm = rig.bones.get(BoneName.FOREARM_L);
      const wrist = rig.bones.get(BoneName.WRIST_L);
      const hand = rig.bones.get(BoneName.HAND_L);

      expect(upperArm?.parent).toBe(shoulder);
      expect(elbow?.parent).toBe(upperArm);
      expect(forearm?.parent).toBe(elbow);
      expect(wrist?.parent).toBe(forearm);
      expect(hand?.parent).toBe(wrist);
    });

    it("should have complete right arm chain", () => {
      const rig = createHumanoidRig();

      const shoulder = rig.bones.get(BoneName.SHOULDER_R);
      const upperArm = rig.bones.get(BoneName.UPPER_ARM_R);
      const elbow = rig.bones.get(BoneName.ELBOW_R);
      const forearm = rig.bones.get(BoneName.FOREARM_R);
      const wrist = rig.bones.get(BoneName.WRIST_R);
      const hand = rig.bones.get(BoneName.HAND_R);

      expect(upperArm?.parent).toBe(shoulder);
      expect(elbow?.parent).toBe(upperArm);
      expect(forearm?.parent).toBe(elbow);
      expect(wrist?.parent).toBe(forearm);
      expect(hand?.parent).toBe(wrist);
    });

    it("should have complete left leg chain", () => {
      const rig = createHumanoidRig();

      const hip = rig.bones.get(BoneName.HIP_L);
      const thigh = rig.bones.get(BoneName.THIGH_L);
      const knee = rig.bones.get(BoneName.KNEE_L);
      const shin = rig.bones.get(BoneName.SHIN_L);
      const foot = rig.bones.get(BoneName.FOOT_L);

      expect(thigh?.parent).toBe(hip);
      expect(knee?.parent).toBe(thigh);
      expect(shin?.parent).toBe(knee);
      expect(foot?.parent).toBe(shin);
    });

    it("should have complete right leg chain", () => {
      const rig = createHumanoidRig();

      const hip = rig.bones.get(BoneName.HIP_R);
      const thigh = rig.bones.get(BoneName.THIGH_R);
      const knee = rig.bones.get(BoneName.KNEE_R);
      const shin = rig.bones.get(BoneName.SHIN_R);
      const foot = rig.bones.get(BoneName.FOOT_R);

      expect(thigh?.parent).toBe(hip);
      expect(knee?.parent).toBe(thigh);
      expect(shin?.parent).toBe(knee);
      expect(foot?.parent).toBe(shin);
    });

    it("should have head and neck", () => {
      const rig = createHumanoidRig();

      const neck = rig.bones.get(BoneName.NECK);
      const head = rig.bones.get(BoneName.HEAD);
      const spineUpper = rig.bones.get(BoneName.SPINE_UPPER);

      expect(neck?.parent).toBe(spineUpper);
      expect(head?.parent).toBe(neck);
    });

    it("should be under 30 bone limit for performance", () => {
      const rig = createHumanoidRig();

      expect(rig.boneCount).toBeLessThanOrEqual(30);
    });
  });

  describe("applyJointConstraint", () => {
    it("should clamp bone rotation within constraints", () => {
      const bone = createBone("test", null, [0, 0, 0]);
      bone.rotation.set(3, 3, 3); // Set to values outside constraints

      const constraint = {
        boneName: "test",
        minRotation: new THREE.Vector3(-1, -1, -1),
        maxRotation: new THREE.Vector3(1, 1, 1),
        canTwist: true,
      };

      applyJointConstraint(bone, constraint);

      expect(bone.rotation.x).toBeLessThanOrEqual(1);
      expect(bone.rotation.y).toBeLessThanOrEqual(1);
      expect(bone.rotation.z).toBeLessThanOrEqual(1);
      expect(bone.rotation.x).toBeGreaterThanOrEqual(-1);
      expect(bone.rotation.y).toBeGreaterThanOrEqual(-1);
      expect(bone.rotation.z).toBeGreaterThanOrEqual(-1);
    });

    it("should prevent negative elbow bend", () => {
      const bone = createBone(BoneName.ELBOW_R, null, [0, 0, 0]);
      bone.rotation.set(0, 0, -3); // Try to bend backward

      const constraint = JOINT_CONSTRAINTS.find(
        (c) => c.boneName === BoneName.ELBOW_R
      );
      if (constraint) {
        applyJointConstraint(bone, constraint);
      }

      expect(bone.rotation.z).toBeGreaterThanOrEqual(0);
    });

    it("should prevent negative knee bend", () => {
      const bone = createBone(BoneName.KNEE_L, null, [0, 0, 0]);
      bone.rotation.set(1, 0, 0); // Try to bend forward

      const constraint = JOINT_CONSTRAINTS.find(
        (c) => c.boneName === BoneName.KNEE_L
      );
      if (constraint) {
        applyJointConstraint(bone, constraint);
      }

      expect(bone.rotation.x).toBeLessThanOrEqual(0);
    });
  });

  describe("getBoneWorldPosition", () => {
    it("should return local position for root bone", () => {
      const root = createBone("root", null, [5, 10, 15]);

      const worldPos = getBoneWorldPosition(root);

      expect(worldPos.toArray()).toEqual([5, 10, 15]);
    });

    it("should accumulate positions through parent chain", () => {
      const root = createBone("root", null, [1, 0, 0]);
      const child = createBone("child", root, [2, 0, 0]);
      const grandchild = createBone("grandchild", child, [3, 0, 0]);

      const worldPos = getBoneWorldPosition(grandchild);

      expect(worldPos.x).toBe(6); // 1 + 2 + 3
      expect(worldPos.y).toBe(0);
      expect(worldPos.z).toBe(0);
    });
  });

  describe("getBoneWorldRotation", () => {
    it("should return local rotation for root bone with small angles", () => {
      const root = createBone("root", null, [0, 0, 0]);
      // Use small angles to avoid Euler angle edge cases
      root.rotation.set(0.1, 0.2, 0.3);

      const worldRot = getBoneWorldRotation(root);

      // For a single bone, world rotation equals local rotation
      expect(worldRot.x).toBeCloseTo(0.1, 5);
      expect(worldRot.y).toBeCloseTo(0.2, 5);
      expect(worldRot.z).toBeCloseTo(0.3, 5);
    });

    it("should compose rotations through parent chain using quaternions", () => {
      const root = createBone("root", null, [0, 0, 0]);
      root.rotation.set(0.5, 0, 0); // 0.5 radians around X

      const child = createBone("child", root, [0, 0, 0]);
      child.rotation.set(0.5, 0, 0); // Another 0.5 radians around X

      const worldRot = getBoneWorldRotation(child);

      // Quaternion multiplication of two X rotations should give combined X rotation
      // For small angles: 0.5 + 0.5 = 1.0 (approximately)
      expect(worldRot.x).toBeCloseTo(1.0, 1);
    });
  });

  describe("resetBoneToRestPose", () => {
    it("should reset bone to rest position and rotation", () => {
      const bone = createBone("test", null, [5, 10, 15]);
      bone.position.set(1, 2, 3);
      bone.rotation.set(0.5, 1.0, 1.5);
      bone.scale.set(2, 2, 2);

      resetBoneToRestPose(bone);

      expect(bone.position.toArray()).toEqual([5, 10, 15]);
      expect(bone.rotation.toArray()).toEqual([0, 0, 0, "XYZ"]);
      expect(bone.scale.toArray()).toEqual([1, 1, 1]);
    });
  });

  describe("resetRigToRestPose", () => {
    it("should reset all bones in rig to rest pose", () => {
      const rig = createHumanoidRig();

      // Modify some bones
      const elbow = rig.bones.get(BoneName.ELBOW_R);
      if (elbow) {
        elbow.rotation.set(0, 0, 1.5);
      }

      const knee = rig.bones.get(BoneName.KNEE_L);
      if (knee) {
        knee.rotation.set(-1.5, 0, 0);
      }

      resetRigToRestPose(rig);

      // Check that bones are reset
      expect(elbow?.rotation.toArray()).toEqual([0, 0, 0, "XYZ"]);
      expect(knee?.rotation.toArray()).toEqual([0, 0, 0, "XYZ"]);
    });
  });

  describe("JOINT_CONSTRAINTS", () => {
    it("should have constraints for key joints", () => {
      const constraintBones = JOINT_CONSTRAINTS.map((c) => c.boneName);

      expect(constraintBones).toContain(BoneName.ELBOW_L);
      expect(constraintBones).toContain(BoneName.ELBOW_R);
      expect(constraintBones).toContain(BoneName.KNEE_L);
      expect(constraintBones).toContain(BoneName.KNEE_R);
      expect(constraintBones).toContain(BoneName.SHOULDER_L);
      expect(constraintBones).toContain(BoneName.SHOULDER_R);
      expect(constraintBones).toContain(BoneName.HIP_L);
      expect(constraintBones).toContain(BoneName.HIP_R);
    });

    it("should have reasonable rotation limits", () => {
      JOINT_CONSTRAINTS.forEach((constraint) => {
        // Min should be less than or equal to max
        expect(constraint.minRotation.x).toBeLessThanOrEqual(
          constraint.maxRotation.x
        );
        expect(constraint.minRotation.y).toBeLessThanOrEqual(
          constraint.maxRotation.y
        );
        expect(constraint.minRotation.z).toBeLessThanOrEqual(
          constraint.maxRotation.z
        );

        // Constraints should be reasonable (not too extreme)
        expect(Math.abs(constraint.minRotation.x)).toBeLessThanOrEqual(Math.PI);
        expect(Math.abs(constraint.maxRotation.x)).toBeLessThanOrEqual(Math.PI);
      });
    });
  });

  describe("BONE_CHAINS", () => {
    it("should define chains for all limbs", () => {
      const chainNames = BONE_CHAINS.map((c) => c.name);

      expect(chainNames).toContain("left_arm");
      expect(chainNames).toContain("right_arm");
      expect(chainNames).toContain("left_leg");
      expect(chainNames).toContain("right_leg");
      expect(chainNames).toContain("spine");
    });

    it("should have valid bone sequences in chains", () => {
      BONE_CHAINS.forEach((chain) => {
        expect(chain.bones.length).toBeGreaterThan(1);
        expect(chain.bones[0]).toBe(chain.startBone);
        expect(chain.bones[chain.bones.length - 1]).toBe(chain.endBone);
      });
    });

    it("should have arm chains with 6 bones each", () => {
      const leftArm = BONE_CHAINS.find((c) => c.name === "left_arm");
      const rightArm = BONE_CHAINS.find((c) => c.name === "right_arm");

      expect(leftArm?.bones.length).toBe(6);
      expect(rightArm?.bones.length).toBe(6);
    });

    it("should have leg chains with 5 bones each", () => {
      const leftLeg = BONE_CHAINS.find((c) => c.name === "left_leg");
      const rightLeg = BONE_CHAINS.find((c) => c.name === "right_leg");

      expect(leftLeg?.bones.length).toBe(5);
      expect(rightLeg?.bones.length).toBe(5);
    });

    it("should have spine chain with 6 bones", () => {
      const spine = BONE_CHAINS.find((c) => c.name === "spine");

      expect(spine?.bones.length).toBe(6);
    });
  });

  describe("createScaledHumanoidRig", () => {
    it("should create scaled rig with 28 bones", () => {
      const rig = createScaledHumanoidRig(MUSA_PHYSICAL);

      expect(rig.boneCount).toBe(28);
      expect(rig.bones.size).toBe(28);
    });

    it("should scale bones based on physical attributes", () => {
      const amsaljaRig = createScaledHumanoidRig(AMSALJA_PHYSICAL);
      const jojikRig = createScaledHumanoidRig(JOJIK_PHYSICAL);

      // Amsalja has longer legs
      const amsaljaThigh = amsaljaRig.bones.get(BoneName.THIGH_L);
      const jojikThigh = jojikRig.bones.get(BoneName.THIGH_L);

      expect(amsaljaThigh?.length).toBeGreaterThan(jojikThigh?.length ?? 0);
    });

    it("should apply wider shoulders for wider archetype", () => {
      const amsaljaRig = createScaledHumanoidRig(AMSALJA_PHYSICAL);
      const jojikRig = createScaledHumanoidRig(JOJIK_PHYSICAL);

      // Check shoulder positions (Jojik has wider shoulders)
      const amsaljaShoulder = amsaljaRig.bones.get(BoneName.SHOULDER_L);
      const jojikShoulder = jojikRig.bones.get(BoneName.SHOULDER_L);

      // Jojik's shoulder should be further from center
      expect(Math.abs(jojikShoulder?.position.x ?? 0)).toBeGreaterThan(
        Math.abs(amsaljaShoulder?.position.x ?? 0)
      );
    });

    it("should scale head size appropriately", () => {
      const amsaljaRig = createScaledHumanoidRig(AMSALJA_PHYSICAL);
      const jojikRig = createScaledHumanoidRig(JOJIK_PHYSICAL);

      // Jojik has larger head
      const amsaljaHead = amsaljaRig.bones.get(BoneName.HEAD);
      const jojikHead = jojikRig.bones.get(BoneName.HEAD);

      expect(jojikHead?.length).toBeGreaterThan(amsaljaHead?.length ?? 0);
    });

    it("should scale neck length appropriately", () => {
      const amsaljaRig = createScaledHumanoidRig(AMSALJA_PHYSICAL);
      const jojikRig = createScaledHumanoidRig(JOJIK_PHYSICAL);

      // Amsalja and Jojik both have 11cm necks (same length)
      const amsaljaNeck = amsaljaRig.bones.get(BoneName.NECK);
      const jojikNeck = jojikRig.bones.get(BoneName.NECK);

      // Both should have similar neck lengths since attributes are equal (11cm)
      expect(amsaljaNeck?.length).toBeCloseTo(jojikNeck?.length ?? 0, 1);
    });

    it("should maintain bone hierarchy with scaling", () => {
      const rig = createScaledHumanoidRig(MUSA_PHYSICAL);

      // Check spine hierarchy
      const pelvis = rig.bones.get(BoneName.PELVIS);
      const spineLower = rig.bones.get(BoneName.SPINE_LOWER);
      const spineUpper = rig.bones.get(BoneName.SPINE_UPPER);
      const neck = rig.bones.get(BoneName.NECK);
      const head = rig.bones.get(BoneName.HEAD);

      expect(spineLower?.parent).toBe(pelvis);
      expect(neck?.parent).toBe(spineUpper);
      expect(head?.parent).toBe(neck);
    });

    it("should scale all archetypes without errors", () => {
      const profiles = [
        MUSA_PHYSICAL,
        AMSALJA_PHYSICAL,
        HACKER_PHYSICAL,
        JEONGBO_PHYSICAL,
        JOJIK_PHYSICAL,
      ];

      profiles.forEach((profile) => {
        const rig = createScaledHumanoidRig(profile);
        expect(rig.boneCount).toBe(28);
        expect(rig.bones.size).toBe(28);
        expect(rig.root.name).toBe(BoneName.PELVIS);
      });
    });
  });
});
