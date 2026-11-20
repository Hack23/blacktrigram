export type WorldPoint = readonly [number, number, number];

/** Fits both fighters inside the part of the screen not occupied by the HUD. */
export function getCombatFraming(
  first: WorldPoint,
  second: WorldPoint,
  aspect: number,
  fov: number,
): { readonly x: number; readonly z: number; readonly distance: number } {
  const horizontalFov = Math.tan(fov * Math.PI / 360) * Math.max(aspect, 0.01);
  const halfWidth = Math.abs(first[0] - second[0]) * 0.5 + 0.95;
  const halfDepth = Math.abs(first[2] - second[2]) * 0.5;
  return {
    x: (first[0] + second[0]) * 0.5,
    z: (first[2] + second[2]) * 0.5,
    distance: Math.max(4.5, halfWidth / (horizontalFov * (aspect < 1 ? 0.86 : 0.65))) + halfDepth,
  };
}
