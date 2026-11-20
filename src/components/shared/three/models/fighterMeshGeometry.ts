import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { SkeletalRig } from "../../../../types/skeletal";

type Pair = readonly [first: number, second: number];

export const FIGHTER_FINGERS = ["index", "middle", "ring", "pinky"] as const;

export interface CostumeRing {
  readonly center: THREE.Vector3;
  readonly radius: Pair;
  readonly blend: number;
  readonly shade?: number;
}

/**
 * Collects indexed costume surfaces in bind space. Each ring can blend between
 * two neighboring bones; rigid details use a single influence.
 */
export class FighterMeshGeometry {
  private readonly surfaces: THREE.BufferGeometry[] = [];
  private readonly color = new THREE.Color();
  private readonly transform = new THREE.Quaternion();
  private readonly axisU = new THREE.Vector3();
  private readonly axisV = new THREE.Vector3();

  constructor(
    private readonly bones: ReadonlyMap<string, number>,
    private readonly bindPositions: ReadonlyMap<string, THREE.Vector3>,
    private readonly sides: number,
  ) {}

  /** Position a costume detail relative to a named joint in bind space. */
  at(name: string, x = 0, y = 0, z = 0): THREE.Vector3 {
    const origin = this.bindPositions.get(name);
    if (!origin) throw new Error(`Missing fighter bind joint: ${name}`);
    return new THREE.Vector3(origin.x + x, origin.y + y, origin.z + z);
  }

  private index(name: string): number {
    const index = this.bones.get(name);
    if (index === undefined) throw new Error(`Missing fighter skin joint: ${name}`);
    return index;
  }

  tube(options: {
    readonly joints: readonly [string, string];
    readonly rings: readonly CostumeRing[];
    readonly axis: "x" | "y";
    readonly color: number;
  }): void {
    const { joints, rings, axis, color } = options;
    this.axisU.set(axis === "y" ? 1 : 0, axis === "x" ? 1 : 0, 0);
    const first = rings[0];
    const last = rings[rings.length - 1];
    // Choose the second axis so the same index winding faces outward on
    // descending legs, ascending torso surfaces, and both mirrored sleeves.
    const sign = last.center[axis] >= first.center[axis] ? 1 : -1;
    this.axisV.set(0, 0, axis === "y" ? -sign : sign);

    const positions: number[] = [];
    const indices: number[] = [];
    const skinIndices: number[] = [];
    const weights: number[] = [];
    const colors: number[] = [];
    const firstIndex = this.index(joints[0]);
    const secondIndex = this.index(joints[1]);
    rings.forEach(({ center, radius, blend, shade = 1 }, row) => {
      for (let column = 0; column < this.sides; column++) {
        const angle = (column / this.sides) * Math.PI * 2;
        const u = Math.cos(angle) * radius[0];
        const v = Math.sin(angle) * radius[1];
        positions.push(center.x + u * this.axisU.x, center.y + u * this.axisU.y, center.z + v * this.axisV.z);
        skinIndices.push(firstIndex, secondIndex, 0, 0);
        weights.push(1 - blend, blend, 0, 0);
        this.color.setHex(color).multiplyScalar(shade);
        colors.push(this.color.r, this.color.g, this.color.b);
        if (row === 0) continue;
        const a = (row - 1) * this.sides + column;
        const b = (row - 1) * this.sides + (column + 1) % this.sides;
        indices.push(a, b, a + this.sides, b, b + this.sides, a + this.sides);
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    this.addSurface(geometry, colors, skinIndices, weights);
  }

  detail(options: {
    readonly joint: string;
    readonly geometry: THREE.BufferGeometry;
    readonly at: THREE.Vector3;
    readonly size: readonly [number, number, number];
    readonly color: number;
    readonly roll?: number;
  }): void {
    const { joint, geometry, at, size, color, roll = 0 } = options;
    const surface = geometry.clone();
    surface.scale(...size);
    if (roll !== 0) {
      this.transform.setFromAxisAngle(this.axisV.set(0, 0, 1), roll);
      surface.applyQuaternion(this.transform);
    }
    surface.translate(at.x, at.y, at.z);
    surface.deleteAttribute("uv");
    const index = this.index(joint);
    const colors: number[] = [];
    const skinIndices: number[] = [];
    const weights: number[] = [];
    this.color.setHex(color);
    for (let i = 0; i < surface.getAttribute("position").count; i++) {
      colors.push(this.color.r, this.color.g, this.color.b);
      skinIndices.push(index, 0, 0, 0);
      weights.push(1, 0, 0, 0);
    }
    this.addSurface(surface, colors, skinIndices, weights);
  }

  private addSurface(
    geometry: THREE.BufferGeometry,
    colors: number[],
    skinIndices: number[],
    weights: number[],
  ): void {
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(skinIndices, 4));
    geometry.setAttribute("skinWeight", new THREE.Float32BufferAttribute(weights, 4));
    this.surfaces.push(geometry);
  }

  /** Merge surfaces into one draw and release all construction geometry. */
  finish(): THREE.BufferGeometry {
    const merged = mergeGeometries(this.surfaces);
    this.surfaces.forEach((surface) => surface.dispose());
    this.surfaces.length = 0;
    if (!merged) throw new Error("Fighter costume surfaces use incompatible attributes");
    return merged;
  }
}

/** Create independent Three.js bones in the animation rig's bind pose. */
export function bindFighterRig(rig: SkeletalRig): {
  readonly root: THREE.Bone;
  readonly bones: THREE.Bone[];
  readonly indices: ReadonlyMap<string, number>;
  readonly positions: ReadonlyMap<string, THREE.Vector3>;
} {
  const bones: THREE.Bone[] = [];
  const byName = new Map<string, THREE.Bone>();
  const indices = new Map<string, number>();
  const positions = new Map<string, THREE.Vector3>();
  for (const [name, source] of rig.bones) {
    const bone = new THREE.Bone();
    bone.name = name;
    bone.position.copy(source.restPosition);
    bone.rotation.copy(source.restRotation);
    if (source.parent) {
      const parent = byName.get(source.parent.name);
      if (!parent) throw new Error(`Fighter bind hierarchy is not parent-first: ${name}`);
      parent.add(bone);
    }
    byName.set(name, bone);
    indices.set(name, bones.length);
    bones.push(bone);
  }
  const root = byName.get(rig.root.name);
  if (!root) throw new Error("Fighter rig has no root");
  for (const [suffix, sign] of [["L", -1], ["R", 1]] as const) {
    const hand = byName.get(`hand_${suffix}`);
    if (!hand) throw new Error(`Fighter rig has no ${suffix} hand`);
    FIGHTER_FINGERS.forEach((finger, index) => {
      const joint = new THREE.Bone();
      joint.name = `${finger}_${suffix}`;
      joint.position.set(sign * 0.049, 0, (index - 1.5) * 0.02);
      hand.add(joint);
      indices.set(joint.name, bones.length);
      bones.push(joint);
    });
  }
  root.updateMatrixWorld(true);
  for (const bone of bones) {
    positions.set(bone.name, new THREE.Vector3().setFromMatrixPosition(bone.matrixWorld));
  }
  return { root, bones, indices, positions };
}
