import { HitEffect } from "@/systems";
import { HitEffectType } from "@/systems/effects";
import { useCallback, useRef, useState } from "react";
// FIX: Import Position from types instead of systems
import { Position } from "@/types";

interface UseHitEffectsOptions {
  readonly defaultDuration?: number;
  readonly maxEffects?: number;
}

export function useHitEffects(options: UseHitEffectsOptions = {}) {
  const { defaultDuration = 900, maxEffects = 40 } = options;
  const [effects, setEffects] = useState<HitEffect[]>([]);
  const cleanupRef = useRef<number | null>(null);

  const add = useCallback(
    (type: HitEffectType, position: Position, intensity = 1) => {
      const now = performance.now();
      const effect: HitEffect = {
        id: `hit_${now}_${Math.random().toString(36).slice(2)}`,
        type,
        attackerId: "p1",
        defenderId: "p2",
        timestamp: now,
        duration: defaultDuration,
        position,
        intensity,
        startTime: now,
      };
      setEffects((prev) => {
        const next = [...prev, effect];
        if (next.length > maxEffects) next.shift();
        return next;
      });
    },
    [defaultDuration, maxEffects]
  );

  const prune = useCallback(() => {
    const now = performance.now();
    setEffects((prev) => prev.filter((e) => now - e.startTime < e.duration));
    cleanupRef.current = requestAnimationFrame(prune);
  }, []);

  const start = useCallback(() => {
    if (cleanupRef.current == null)
      cleanupRef.current = requestAnimationFrame(prune);
  }, [prune]);

  const stop = useCallback(() => {
    if (cleanupRef.current != null) cancelAnimationFrame(cleanupRef.current);
    cleanupRef.current = null;
  }, []);

  return { effects, addHitEffect: add, startEffects: start, stopEffects: stop };
}
