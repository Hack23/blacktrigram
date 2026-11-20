import * as THREE from "three";
import { PlayerArchetype } from "../../../../types/common";
import { KOREAN_COLORS as COLORS } from "../../../../types/constants";
import type { HandAnimationState } from "../../../../types/hand-animation";
import type { SkeletalRig } from "../../../../types/skeletal";
import { getArchetypeSkinTone } from "../../../../utils/colorUtils";
import { bindFighterRig, FIGHTER_FINGERS, FighterMeshGeometry } from "./fighterMeshGeometry";

interface Costume {
  readonly jacket: number;
  readonly panels: number;
  readonly pants: number;
  readonly accent: number;
  readonly build: number;
  readonly hem: number;
}

const COSTUMES: Readonly<Record<PlayerArchetype, Costume>> = {
  [PlayerArchetype.MUSA]: { jacket: COLORS.UI_STEEL_GRAY_DARK, panels: COLORS.UI_STEEL_GRAY, pants: COLORS.UI_DISABLED_BORDER, accent: COLORS.ACCENT_GOLD, build: 1.07, hem: 0.09 },
  [PlayerArchetype.AMSALJA]: { jacket: COLORS.TRIGRAM_GON_PRIMARY, panels: COLORS.UI_DISABLED_FILL, pants: COLORS.UI_DISABLED_BORDER, accent: COLORS.ACCENT_CYAN, build: 0.91, hem: 0.13 },
  [PlayerArchetype.HACKER]: { jacket: COLORS.KOREAN_BLUE, panels: COLORS.UI_STEEL_GRAY, pants: COLORS.UI_DISABLED_BORDER, accent: COLORS.TRIGRAM_TAE_PRIMARY, build: 0.96, hem: 0.07 },
  [PlayerArchetype.JEONGBO_YOWON]: { jacket: COLORS.UI_STEEL_GRAY_DARK, panels: COLORS.UI_DISABLED_BORDER, pants: COLORS.UI_DISABLED_FILL, accent: COLORS.TEXT_SECONDARY, build: 1, hem: 0.15 },
  [PlayerArchetype.JOJIK_POKRYEOKBAE]: { jacket: COLORS.UI_DISABLED_BG, panels: COLORS.UI_STEEL_GRAY_DARK, pants: COLORS.UI_BACKGROUND_LIGHT, accent: COLORS.ACCENT_RED, build: 1.16, hem: 0.08 },
};

const FOOT_OFFSET = { sole: -0.035, heel: -0.068, toe: 0.158 } as const;
const SIDES = [
  { suffix: "L", sign: -1 },
  { suffix: "R", sign: 1 },
] as const;

function addTorso(body: FighterMeshGeometry, costume: Costume): void {
  const { build, jacket, hem, pants } = costume;
  const chestWidth = Math.abs(body.at("upper_arm_R").x) - 0.026;
  const waist = chestWidth * 0.73;
  const depth = 0.11 * build;
  body.tube({ joints: ["pelvis", "spine_lower"], axis: "y", color: pants, rings: [
    { center: body.at("pelvis", 0, -0.19), radius: [waist * 0.82, depth * 0.66], blend: 0 },
    { center: body.at("pelvis", 0, -0.08), radius: [waist + 0.018, depth], blend: 0 },
    { center: body.at("pelvis", 0, 0.018), radius: [waist, depth * 0.94], blend: 0.1 },
  ] });
  body.tube({ joints: ["pelvis", "spine_middle"], axis: "y", color: jacket, rings: [
    { center: body.at("pelvis", 0, -hem), radius: [waist + 0.024, depth * 1.06], blend: 0, shade: 0.76 },
    { center: body.at("pelvis", 0, -0.03), radius: [waist + 0.018, depth * 1.04], blend: 0 },
    { center: body.at("spine_lower", 0, -0.015), radius: [waist, depth], blend: 0.3 },
    { center: body.at("spine_middle", 0, -0.045), radius: [chestWidth * 0.89, depth * 1.14], blend: 1 },
  ] });
  body.tube({ joints: ["spine_middle", "spine_upper"], axis: "y", color: jacket, rings: [
    { center: body.at("spine_middle", 0, -0.045), radius: [chestWidth * 0.89, depth * 1.14], blend: 0 },
    { center: body.at("spine_upper", 0, -0.075), radius: [chestWidth, depth * 1.21], blend: 0.58, shade: 1.14 },
    { center: body.at("spine_upper", 0, 0.02), radius: [chestWidth * 1.02, depth], blend: 1 },
    { center: body.at("neck", 0, 0.018), radius: [0.087 * build, 0.074 * build], blend: 1, shade: 0.82 },
  ] });
}

function addLimbs(
  body: FighterMeshGeometry,
  costume: Costume,
  shape: THREE.BufferGeometry,
  skin: number,
  bareHands: boolean,
): void {
  const { build, jacket, pants, panels, accent } = costume;
  for (const { suffix, sign } of SIDES) {
    const upper = `upper_arm_${suffix}`, elbow = `elbow_${suffix}`;
    const forearm = `forearm_${suffix}`, wrist = `wrist_${suffix}`, hand = `hand_${suffix}`;
    const hip = `hip_${suffix}`, thigh = `thigh_${suffix}`, knee = `knee_${suffix}`;
    const shin = `shin_${suffix}`, foot = `foot_${suffix}`;
    body.tube({ joints: [upper, elbow], axis: "x", color: jacket, rings: [
      { center: body.at(upper, -sign * 0.066), radius: [0.047 * build, 0.061 * build], blend: 0 },
      { center: body.at(upper, sign * 0.01), radius: [0.099 * build, 0.094 * build], blend: 0, shade: 1.15 },
      { center: body.at(upper, sign * 0.115), radius: [0.072 * build, 0.076 * build], blend: 0 },
      { center: body.at(elbow, -sign * 0.048), radius: [0.058 * build, 0.059 * build], blend: 0.2 },
      { center: body.at(elbow), radius: [0.056 * build, 0.056 * build], blend: 0.68, shade: 0.81 },
    ] });
    body.tube({ joints: [upper, elbow], axis: "x", color: jacket, rings: [
      { center: body.at(elbow), radius: [0.056 * build, 0.056 * build], blend: 0.68, shade: 0.81 },
      { center: body.at(forearm), radius: [0.065 * build, 0.067 * build], blend: 1 },
    ] });
    body.tube({ joints: [elbow, forearm], axis: "x", color: panels, rings: [
      { center: body.at(forearm), radius: [0.065 * build, 0.067 * build], blend: 0 },
      { center: body.at(forearm, sign * 0.07), radius: [0.062 * build, 0.061 * build], blend: 1 },
      { center: body.at(wrist), radius: [0.039 * build, 0.041 * build], blend: 1, shade: 0.72 },
    ] });
    body.detail({ joint: wrist, geometry: shape, at: body.at(wrist, sign * 0.005), size: [0.041, 0.043 * build, 0.047 * build], color: accent });
    const handColor = bareHands ? skin : COLORS.UI_DISABLED_BORDER;
    body.detail({ joint: hand, geometry: shape, at: body.at(hand, sign * 0.012), size: [0.053, 0.027 * build, 0.046], color: handColor });
    body.detail({ joint: hand, geometry: shape, at: body.at(hand, sign * 0.02, -0.014, -0.037), size: [0.036, 0.017, 0.016], color: handColor });
    FIGHTER_FINGERS.forEach((finger, index) => {
      const joint = `${finger}_${suffix}`;
      const length = [0.028, 0.032, 0.029, 0.022][index];
      body.detail({ joint, geometry: shape, at: body.at(joint, sign * length * 0.62), size: [length, 0.013, 0.011], color: handColor });
    });

    body.tube({ joints: [hip, thigh], axis: "y", color: pants, rings: [
      { center: body.at(hip, 0, 0.042), radius: [0.096 * build, 0.094 * build], blend: 0 },
      { center: body.at(thigh, 0, 0.035), radius: [0.104 * build, 0.108 * build], blend: 0.33 },
      { center: body.at(thigh, 0, -0.045), radius: [0.101 * build, 0.103 * build], blend: 1 },
      { center: body.at(knee, 0, 0.063), radius: [0.073 * build, 0.08 * build], blend: 1 },
    ] });
    body.tube({ joints: [thigh, knee], axis: "y", color: pants, rings: [
      { center: body.at(knee, 0, 0.063), radius: [0.073 * build, 0.08 * build], blend: 0 },
      { center: body.at(knee), radius: [0.07 * build, 0.071 * build], blend: 0.58, shade: 0.81 },
      { center: body.at(shin, 0, -0.07), radius: [0.078 * build, 0.085 * build], blend: 1 },
    ] });
    body.tube({ joints: [knee, shin], axis: "y", color: pants, rings: [
      { center: body.at(shin, 0, -0.07), radius: [0.078 * build, 0.085 * build], blend: 0 },
      { center: body.at(foot, 0, 0.13, -0.025), radius: [0.063 * build, 0.067 * build], blend: 1 },
      { center: body.at(foot, 0, 0.02, -0.025), radius: [0.05 * build, 0.052 * build], blend: 1, shade: 0.75 },
    ] });
    body.detail({ joint: foot, geometry: shape, at: body.at(foot, 0, 0.015, 0.045), size: [0.065 * build, 0.052, 0.117], color: panels });
    body.detail({ joint: foot, geometry: shape, at: body.at(foot, 0, -0.021, 0.045), size: [0.068 * build, 0.014, 0.119], color: COLORS.UI_BACKGROUND_MEDIUM });
  }
}

function addHead(body: FighterMeshGeometry, shape: THREE.BufferGeometry, archetype: PlayerArchetype, skin: number): void {
  const { accent, jacket, build, panels } = COSTUMES[archetype];
  const head = body.at("head");
  const neck = body.at("neck", 0, 0.035);
  const step = head.y - neck.y;
  body.detail({ joint: "neck", geometry: shape, at: neck, size: [0.076 * build, step * 0.64, 0.073 * build], color: jacket });
  const detail = (offset: readonly [number, number, number], size: readonly [number, number, number], color: number, roll = 0) =>
    body.detail({ joint: "head", geometry: shape, at: body.at("head", ...offset), size, color, roll });
  if (archetype === PlayerArchetype.AMSALJA) {
    detail([0, 0.025, -0.021], [0.132, 0.154, 0.119], jacket);
    detail([0, -0.035, 0.059], [0.096, 0.085, 0.063], panels);
    detail([0, 0.016, 0.082], [0.091, 0.039, 0.044], skin);
  } else {
    detail([0, 0.016, 0], [0.099 * build, 0.118, 0.096], skin);
    detail([0, -0.043, 0.042], [0.075 * build, 0.059, 0.058], skin);
    detail([0, -0.011, 0.094], [0.021, 0.032, 0.027], skin, -0.09);
    detail([0, -0.054, 0.091], [0.033, 0.006, 0.01], COLORS.SECONDARY_BROWN_DARK);
    detail([0, 0.077, -0.019], [0.104 * build, 0.073, 0.105], COLORS.UI_BACKGROUND_MEDIUM, 0.12);
  }
  for (const { sign } of SIDES) {
    if (archetype === PlayerArchetype.MUSA) {
      detail([sign * 0.095, 0.038, -0.008], [0.031, 0.057, 0.058], panels);
    } else if (archetype !== PlayerArchetype.AMSALJA) {
      detail([sign * 0.09 * build, -0.007, -0.005], [0.022, 0.034, 0.027], skin);
    }
    const glasses = archetype === PlayerArchetype.HACKER || archetype === PlayerArchetype.JEONGBO_YOWON;
    detail([sign * 0.044, 0.025, archetype === PlayerArchetype.AMSALJA ? 0.118 : 0.093],
      glasses ? [0.047, 0.024, 0.017] : [0.024, 0.008, 0.01], COLORS.UI_BACKGROUND_MEDIUM, sign * 0.09);
    if (glasses) {
      detail([sign * 0.044, 0.028, 0.105], [0.034, 0.012, 0.012], archetype === PlayerArchetype.HACKER ? COLORS.TRIGRAM_TAE_PRIMARY : panels);
    }
  }
  if (archetype === PlayerArchetype.MUSA) {
    detail([0, 0.074, -0.005], [0.119, 0.083, 0.114], jacket);
    detail([0, 0.065, 0.082], [0.104, 0.021, 0.049], panels);
    detail([0, 0.073, 0.12], [0.025, 0.022, 0.015], accent);
  }
}

function addTailoring(body: FighterMeshGeometry, shape: THREE.BufferGeometry, box: THREE.BufferGeometry, archetype: PlayerArchetype): void {
  const { accent, panels, build } = COSTUMES[archetype];
  const isMusa = archetype === PlayerArchetype.MUSA;
  const isOperative = archetype === PlayerArchetype.JEONGBO_YOWON;
  const isBrawler = archetype === PlayerArchetype.JOJIK_POKRYEOKBAE;
  const chest = 0.12 * build;
  for (const { suffix, sign } of SIDES) {
    body.detail({ joint: "spine_upper", geometry: shape, at: body.at("spine_upper", sign * 0.102 * build, -0.064, chest),
      size: [0.086 * build, 0.116, isMusa ? 0.043 : 0.023], color: panels, roll: sign * (isBrawler ? 0.44 : 0.2) });
    body.detail({ joint: `upper_arm_${suffix}`, geometry: shape, at: body.at(`upper_arm_${suffix}`, sign * 0.014, 0.009, 0.057),
      size: [isMusa ? 0.099 : 0.066, 0.077 * build, 0.053 * build], color: panels });
    if (isMusa || isBrawler) {
      body.detail({ joint: `knee_${suffix}`, geometry: shape, at: body.at(`knee_${suffix}`, 0, 0.016, 0.062 * build),
        size: [0.067 * build, 0.079, 0.043], color: panels });
    }
  }
  // The crossing forms are a Hanbok-inspired collar on Musa and tailored
  // lapels on the operative, not painted labels or floating accessories.
  body.detail({ joint: "spine_upper", geometry: isOperative ? box : shape, at: body.at("spine_upper", -0.039, -0.027, chest + 0.01),
    size: [0.04, 0.14, 0.027], color: isOperative || isMusa ? COLORS.TEXT_SECONDARY : panels, roll: 0.36 });
  body.detail({ joint: "spine_upper", geometry: shape, at: body.at("spine_upper", 0.033, -0.087, chest + 0.016),
    size: [0.028, 0.16, 0.027], color: isOperative ? COLORS.UI_BACKGROUND_MEDIUM : panels, roll: isOperative ? 0 : -0.45 });
  body.detail({ joint: "pelvis", geometry: shape, at: body.at("pelvis", 0, -0.032, 0.012),
    size: [0.16 * build, 0.036, 0.123 * build], color: COLORS.UI_BACKGROUND_MEDIUM });
  body.detail({ joint: "pelvis", geometry: box, at: body.at("pelvis", 0, -0.03, 0.131 * build),
    size: [0.059, 0.042, 0.022], color: panels });
  for (let row = 0; row < 3; row++) {
    body.detail({ joint: "spine_upper", geometry: box, at: body.at("spine_upper", -0.116 * build, -0.059 - 0.013 * row, chest + 0.04),
      size: [0.035, 0.005, 0.008], color: accent });
  }
  // Shoulder-side patch stays legible when the fighters face each other.
  body.detail({ joint: "upper_arm_L", geometry: box, at: body.at("upper_arm_L", -0.063, 0.007, 0.101 * build),
    size: [0.052, 0.019, 0.014], color: accent, roll: 0.15 });
}

/** Generates the roster costume in bind space and binds it to the existing pose rig. */
export function createFighterCostume(rig: SkeletalRig, archetype: PlayerArchetype, mobile: boolean): THREE.SkinnedMesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> {
  const bind = bindFighterRig(rig);
  const body = new FighterMeshGeometry(bind.indices, bind.positions, mobile ? 8 : 12);
  const shape = new THREE.SphereGeometry(1, mobile ? 8 : 12, mobile ? 6 : 8);
  const box = new THREE.BoxGeometry(1, 1, 1);
  const skin = getArchetypeSkinTone(archetype);
  try {
    addTorso(body, COSTUMES[archetype]);
    addLimbs(body, COSTUMES[archetype], shape, skin, archetype === PlayerArchetype.JEONGBO_YOWON || archetype === PlayerArchetype.JOJIK_POKRYEOKBAE);
    addHead(body, shape, archetype, skin);
    addTailoring(body, shape, box, archetype);
    const mesh = new THREE.SkinnedMesh(body.finish(), new THREE.MeshStandardMaterial({
      vertexColors: true, roughness: 0.72, metalness: 0.06,
    }));
    mesh.name = `fighter-costume-${archetype}`;
    mesh.add(bind.root);
    mesh.bind(new THREE.Skeleton(bind.bones));
    // The small fixed roster can lunge past the bind-pose frustum bounds.
    mesh.frustumCulled = false;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  } finally {
    shape.dispose();
    box.dispose();
  }
}

/** Lowest support point of the skinned boot's sole in world space. */
export function getBootSupportHeight(foot: THREE.Bone, point: THREE.Vector3): number {
  const heel = point.set(0, FOOT_OFFSET.sole, FOOT_OFFSET.heel).applyMatrix4(foot.matrixWorld).y;
  const toe = point.set(0, FOOT_OFFSET.sole, FOOT_OFFSET.toe).applyMatrix4(foot.matrixWorld).y;
  return Math.min(heel, toe);
}

/** Copies the sampled animation pose into the mesh's independent skin rig. */
export function updateFighterCostume(
  mesh: THREE.SkinnedMesh,
  rig: SkeletalRig,
  leftHand: HandAnimationState,
  rightHand: HandAnimationState,
): void {
  for (const bone of mesh.skeleton.bones) {
    const source = rig.bones.get(bone.name);
    if (!source) continue;
    // Keep costume segments at bind length; only the root can translate.
    // Legacy clips also contain independent screen-sized ankle offsets.
    bone.position.copy(source.parent ? source.restPosition : source.position);
    bone.rotation.copy(source.rotation);
  }
  for (const { suffix, sign } of SIDES) {
    const { currentFingerCurl, currentFingerSpread } = suffix === "L" ? leftHand : rightHand;
    FIGHTER_FINGERS.forEach((finger, index) => {
      const bone = mesh.skeleton.getBoneByName(`${finger}_${suffix}`);
      if (!bone) return;
      const spread = index < 2 ? currentFingerSpread.indexMiddle : currentFingerSpread.ringPinky;
      bone.rotation.set(0, -sign * (index - 1.5) * 0.23 * spread, -sign * currentFingerCurl[finger] * 1.6);
    });
  }
}
