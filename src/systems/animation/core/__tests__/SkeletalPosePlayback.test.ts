import { Euler, Quaternion, Vector3 } from "three";
import { describe, expect, it } from "vitest";
import { BoneName, type AnimationKeyframe, type SkeletalAnimation } from "../../../../types/skeletal";
import { createHumanoidRig } from "../../builders/SkeletonRig";
import { prepareSkeletalPose, SkeletalPosePlayback } from "../SkeletalPosePlayback";

function frame(time: number, x?: number, y?: number): AnimationKeyframe {
  return {
    time,
    boneRotations: new Map(x === undefined ? [] : [[BoneName.HEAD, new Euler(x, 0, 0)]]),
    bonePositions: new Map(y === undefined ? [] : [[BoneName.PELVIS, new Vector3(0, y, 0)]]),
  };
}

function clip(...keyframes: AnimationKeyframe[]): SkeletalAnimation {
  return { name: "test", koreanName: "테스트", duration: 1, loop: false, type: "idle", keyframes };
}

describe("skeletal pose playback", () => {
  it("interpolates independently keyed channels through internal holes and back to rest", () => {
    const rig = createHumanoidRig();
    const head = rig.bones.get(BoneName.HEAD);
    if (!head) throw new Error("Missing test rig head");
    head.restRotation.x = 0.2;
    const restY = rig.root.restPosition.y;
    const player = new SkeletalPosePlayback(rig);
    const pose = prepareSkeletalPose(clip(
      frame(0), frame(0.25, 0.6, -0.2), frame(0.5), frame(0.75, 1, -0.1), frame(1),
    ));

    player.apply(pose, 0.125);
    expect(head.rotation.x).toBeCloseTo(0.4);
    expect(rig.root.position.y).toBeCloseTo(restY - 0.1);
    player.apply(pose, 0.5);
    expect(head.rotation.x).toBeCloseTo(0.8);
    expect(rig.root.position.y).toBeCloseTo(restY - 0.15);
    player.apply(pose, 0.875);
    expect(head.rotation.x).toBeCloseTo(0.6);
    expect(rig.root.position.y).toBeCloseTo(restY - 0.05);
    player.apply(pose, 1.1);
    expect(head.rotation.x).toBeCloseTo(0.2);
    expect(rig.root.position.y).toBeCloseTo(restY);
  });

  it("samples exact time, including the terminal key in a formerly shared cache bucket", () => {
    const rig = createHumanoidRig();
    const player = new SkeletalPosePlayback(rig);
    const pose = prepareSkeletalPose(clip(frame(0, 0, 0), frame(0.997, 0.3, -0.1), frame(1, 0.8, -0.3)));

    player.apply(pose, 0.998);
    const first = rig.root.position.y;
    player.apply(pose, 1);
    expect(rig.root.position.y).toBeCloseTo(rig.root.restPosition.y - 0.3);
    expect(rig.root.position.y).toBeLessThan(first);
    player.apply(pose, 0.998);
    expect(rig.root.position.y).toBeCloseTo(first, 9);
    player.apply(prepareSkeletalPose(clip(frame(0, 0, 0), frame(1, 0, 0.2))), 1);
    expect(rig.root.position.y).toBeCloseTo(rig.root.restPosition.y + 0.2);
  });

  it("slerps across the shortest arc and resumes an interrupted blend from its displayed pose", () => {
    const rig = createHumanoidRig();
    const head = rig.bones.get(BoneName.HEAD);
    if (!head) throw new Error("Missing test rig head");
    const player = new SkeletalPosePlayback(rig);
    const source = prepareSkeletalPose(clip(frame(0, 3.1, -0.2), frame(1, -3.1, -0.2)));
    const empty = prepareSkeletalPose(clip(frame(0)));

    player.apply(source, 0.5);
    expect(Math.abs(head.rotation.x)).toBeCloseTo(Math.PI);
    player.capture();
    player.apply(empty, 0, 0.5);
    const halfwayRotation = new Quaternion().setFromEuler(head.rotation);
    const halfwayPosition = rig.root.position.y;
    player.capture();
    player.apply(source, 0.1, 0);
    expect(halfwayRotation.angleTo(new Quaternion().setFromEuler(head.rotation))).toBeCloseTo(0);
    expect(rig.root.position.y).toBeCloseTo(halfwayPosition);
    player.apply(empty, 0);
    expect(head.rotation.x).toBeCloseTo(0);
    expect(rig.root.position.y).toBeCloseTo(rig.root.restPosition.y);
  });

  it("stays within a 5ms per-frame CPU sampling budget across two rigs", () => {
    const pose = prepareSkeletalPose(clip(...Array.from({ length: 20 }, (_, i) => frame(i / 19, i / 20, -i / 40))));
    const left = new SkeletalPosePlayback(createHumanoidRig());
    const right = new SkeletalPosePlayback(createHumanoidRig());
    left.capture();
    right.capture();
    const start = performance.now();
    for (let i = 0; i < 300; i++) {
      left.apply(pose, i / 299, 0.5);
      right.apply(pose, 1 - i / 299, 0.5);
    }
    expect((performance.now() - start) / 300).toBeLessThan(5);
  });
});
