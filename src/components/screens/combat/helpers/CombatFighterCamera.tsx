import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { MathUtils } from "three";
import { MAX_VISUAL_FRAME_DELTA_SECONDS } from "../../../../systems/animation";
import { getCombatFraming, type WorldPoint } from "./combatCameraFraming";

const FRAMING_HEIGHT = 1.05;
const CAMERA_PITCH = 0.39;
const FRAME_DAMPING = 5;

/** Follow stable gameplay positions, not cosmetic lunge offsets or hit reactions. */
export function CombatFighterCamera({ first, second, fov, worldWidth, worldDepth }: {
  readonly first: WorldPoint;
  readonly second: WorldPoint;
  readonly fov: number;
  readonly worldWidth: number;
  readonly worldDepth: number;
}): null {
  const aspect = useThree((state) => state.size.width / Math.max(state.size.height, 1));
  const target = useMemo(() => getCombatFraming(first, second, aspect, fov), [first, second, aspect, fov]);
  const fixed = useMemo(() => getCombatFraming(
    [-worldWidth / 2, 0, -worldDepth / 2], [worldWidth / 2, 0, worldDepth / 2], aspect, fov,
  ), [worldWidth, worldDepth, aspect, fov]);
  const current = useRef({ x: 0, z: 0, distance: 0 });
  const reducedMotion = useRef(false);
  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    const update = () => { reducedMotion.current = query.matches; };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useFrame(({ camera }, delta) => {
    if (aspect === 0) return;
    if (reducedMotion.current) {
      camera.position.set(fixed.x, FRAMING_HEIGHT + fixed.distance * CAMERA_PITCH, fixed.z + fixed.distance);
      camera.lookAt(fixed.x, FRAMING_HEIGHT, fixed.z);
      current.current.distance = 0;
      return;
    }
    const frame = current.current;
    const alpha = frame.distance === 0 ? 1 :
      1 - Math.exp(-FRAME_DAMPING * Math.min(delta, MAX_VISUAL_FRAME_DELTA_SECONDS));
    frame.x = MathUtils.lerp(frame.x, target.x, alpha);
    frame.z = MathUtils.lerp(frame.z, target.z, alpha);
    // Zoom out immediately to keep fighters on-screen, but ease the zoom in.
    frame.distance = Math.max(target.distance, MathUtils.lerp(frame.distance, target.distance, alpha));
    camera.position.set(frame.x, FRAMING_HEIGHT + frame.distance * CAMERA_PITCH, frame.z + frame.distance);
    camera.lookAt(frame.x, FRAMING_HEIGHT, frame.z);
  }, -2);
  return null;
}
