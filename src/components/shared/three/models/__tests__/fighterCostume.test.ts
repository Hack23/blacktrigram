import { Vector3 } from "three";
import { describe, expect, it } from "vitest";
import { getArchetypePhysicalAttributes } from "../../../../../data/archetypePhysicalAttributes";
import { createScaledHumanoidRig } from "../../../../../systems/animation";
import { createInitialHandAnimationState } from "../../../../../systems/animation/builders/HandPoses";
import { ALL_TRIGRAM_IDLE_ANIMATIONS } from "../../../../../systems/animation/catalogs/StanceIdleAnimations";
import { PlayerArchetype } from "../../../../../types/common";
import { HandPoseType } from "../../../../../types/hand-animation";
import { BoneName } from "../../../../../types/skeletal";
import { createFighterCostume, getBootSupportHeight, updateFighterCostume } from "../fighterCostume";

function createCostume(archetype: PlayerArchetype, mobile = false) {
  const rig = createScaledHumanoidRig(getArchetypePhysicalAttributes(archetype));
  const mesh = createFighterCostume(rig, archetype, mobile);
  return {
    rig, mesh,
    dispose: () => { mesh.geometry.dispose(); mesh.material.dispose(); mesh.skeleton.dispose(); },
  };
}

describe("fighter costumes", () => {
  it("binds the full roster with normalized weights and distinct silhouettes at both detail levels", () => {
    const sizes = new Set<number>();
    for (const archetype of Object.values(PlayerArchetype)) {
      const desktop = createCostume(archetype);
      const mobile = createCostume(archetype, true);
      try {
        desktop.mesh.geometry.computeBoundingBox();
        const bounds = desktop.mesh.geometry.boundingBox;
        if (!bounds) throw new Error("Missing costume geometry bounds");
        sizes.add(Number(bounds.max.y.toFixed(3)));
        const vertices = desktop.mesh.geometry.getAttribute("position").count;
        const weights = desktop.mesh.geometry.getAttribute("skinWeight");
        const joints = desktop.mesh.geometry.getAttribute("skinIndex");
        expect(vertices).toBeLessThan(8_000);
        expect(mobile.mesh.geometry.getAttribute("position").count).toBeLessThan(vertices);
        expect(Array.isArray(desktop.mesh.material)).toBe(false);
        for (let i = 0; i < vertices; i++) {
          expect(weights.getX(i) + weights.getY(i)).toBeCloseTo(1);
          expect(joints.getX(i)).toBeLessThan(desktop.mesh.skeleton.bones.length);
          expect(joints.getY(i)).toBeLessThan(desktop.mesh.skeleton.bones.length);
        }
      } finally {
        desktop.dispose();
        mobile.dispose();
      }
    }
    expect(sizes.size).toBe(Object.values(PlayerArchetype).length);
  });

  it("deforms the actual boot geometry and keeps each fighter's visual rig independent", () => {
    const first = createCostume(PlayerArchetype.MUSA);
    const second = createCostume(PlayerArchetype.MUSA);
    try {
      const leg = first.rig.bones.get(BoneName.THIGH_L);
      const foot = first.mesh.skeleton.getBoneByName(BoneName.FOOT_L);
      if (!leg || !foot) throw new Error("Missing leg bones");
      const point = new Vector3();
      const restHeight = getBootSupportHeight(foot, point);
      const joints = first.mesh.geometry.getAttribute("skinIndex");
      const footIndex = first.mesh.skeleton.bones.indexOf(foot);
      let bootVertex = 0;
      while (bootVertex < joints.count && joints.getX(bootVertex) !== footIndex) bootVertex++;
      expect(bootVertex).toBeLessThan(joints.count);
      const originalVertex = first.mesh.getVertexPosition(bootVertex, new Vector3());
      const open = createInitialHandAnimationState(HandPoseType.OPEN);
      const fist = createInitialHandAnimationState(HandPoseType.FIST);
      const sourceFoot = first.rig.bones.get(BoneName.FOOT_L);
      if (!sourceFoot) throw new Error("Missing source boot");
      sourceFoot.position.x += 0.5;
      leg.rotation.x = -1;
      updateFighterCostume(first.mesh, first.rig, fist, open);
      first.mesh.updateMatrixWorld(true);
      expect(foot.position.x).toBe(sourceFoot.restPosition.x);
      expect(getBootSupportHeight(foot, point)).toBeGreaterThan(restHeight + 0.1);
      expect(first.mesh.getVertexPosition(bootVertex, point).distanceTo(originalVertex)).toBeGreaterThan(0.1);
      expect(second.mesh.getVertexPosition(bootVertex, point).distanceTo(originalVertex)).toBeCloseTo(0);
      expect(first.mesh.skeleton.getBoneByName("index_L")?.rotation.z).toBeGreaterThan(1);
      expect(first.mesh.skeleton.getBoneByName("index_R")?.rotation.z).toBeCloseTo(-open.currentFingerCurl.index * 1.6);
    } finally {
      first.dispose();
      second.dispose();
    }
  });

  it("keeps both boots beneath the fighter throughout all eight idle poses", () => {
    const { rig, mesh, dispose } = createCostume(PlayerArchetype.MUSA);
    try {
      const open = createInitialHandAnimationState(HandPoseType.OPEN);
      const probe = new Vector3();
      const left = mesh.skeleton.getBoneByName(BoneName.FOOT_L);
      const right = mesh.skeleton.getBoneByName(BoneName.FOOT_R);
      if (!left || !right) throw new Error("Missing foot rig");
      for (const clip of ALL_TRIGRAM_IDLE_ANIMATIONS) {
        for (const frame of clip.keyframes) {
          expect(frame.bonePositions?.has(BoneName.FOOT_L) ?? false).toBe(false);
          expect(frame.bonePositions?.has(BoneName.FOOT_R) ?? false).toBe(false);
          for (const [name, bone] of rig.bones) {
            bone.rotation.copy(frame.boneRotations.get(name) ?? bone.restRotation);
            bone.position.copy(bone.restPosition);
            const offset = frame.bonePositions?.get(name);
            if (offset) bone.position.add(offset);
          }
          updateFighterCostume(mesh, rig, open, open);
          mesh.updateMatrixWorld(true);
          expect(Math.abs(getBootSupportHeight(left, probe) - getBootSupportHeight(right, probe)), clip.name).toBeLessThan(0.16);
        }
      }
    } finally {
      dispose();
    }
  });
});
