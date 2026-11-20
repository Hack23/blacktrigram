import { PerspectiveCamera, Vector3 } from "three";
import { describe, expect, it } from "vitest";
import { getCombatFraming, type WorldPoint } from "./combatCameraFraming";

describe("combat fighter framing", () => {
  it.each([[16 / 9, 42], [9 / 16, 54]])(
    "keeps fighters inside the visible field at aspect %s",
    (aspect, fov) => {
      const first: WorldPoint = [-3.6, 0, 0.4];
      const second: WorldPoint = [3.1, 0, 2.4];
      const { x, z, distance } = getCombatFraming(first, second, aspect, fov);
      const camera = new PerspectiveCamera(fov, aspect, 0.1, 100);
      camera.position.set(x, 1.05 + distance * 0.39, z + distance);
      camera.lookAt(x, 1.05, z);
      camera.updateMatrixWorld();
      for (const fighter of [first, second]) {
        for (const y of [0, 1.95]) {
          const point = new Vector3(fighter[0], y, fighter[2]).project(camera);
          expect(Math.abs(point.x)).toBeLessThan(aspect < 1 ? 0.86 : 0.65);
          expect(Math.abs(point.y)).toBeLessThan(0.85);
        }
      }
    },
  );

  it("limits close-up magnification when fighters overlap", () => {
    const { distance } = getCombatFraming([2, 0, 2], [2, 0, 2], 16 / 9, 42);
    expect(distance).toBeGreaterThan(4);
    expect(distance).toBeLessThan(5);
  });
});
