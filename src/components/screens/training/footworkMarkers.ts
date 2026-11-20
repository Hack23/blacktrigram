import type { FootworkDrill } from "./components/FootworkDrillsOverlayHtml";

type Point = [number, number, number];

export type FootworkDrillPattern = Exclude<FootworkDrill, "free_practice"> | "none";

const PATTERNS: Readonly<Record<FootworkDrillPattern, readonly (readonly [number, number])[]>> = {
  circular_left: [[2, 0], [0, -2], [-2, 0], [0, 2]],
  circular_right: [[2, 0], [0, 2], [-2, 0], [0, -2]],
  pivot_combo: [[0, 0], [-0.5, 0.5], [0, 0], [0.5, 0.5]],
  triangle_step: [[0, 0], [0, -0.6], [0.45, 0], [0, 0]],
  slide_drill: [[0, 0], [0, -0.3], [0.3, 0], [0, 0.3], [-0.3, 0]],
  shuffle_practice: [[0, 0], [0, -0.24], [0, -0.48], [0, -0.72]],
  none: [],
};

/** Returns the same numbered waypoints for the scene, HUD, and drill progress. */
export function getFootworkMarkers(pattern: FootworkDrillPattern, [x, y, z]: Point): readonly { readonly position: Point; readonly label: string }[] {
  return PATTERNS[pattern].map(([dx, dz], index) => ({
    position: [x + dx, y, z + dz],
    label: String(index + 1),
  }));
}
