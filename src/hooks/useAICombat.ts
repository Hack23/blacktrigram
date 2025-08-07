import { PlayerState } from "@/systems";
import { TrigramStance } from "@/types";
import { Position } from "@/types/common";
import { useCallback, useEffect, useRef } from "react";

/**
 * Core hook config (backward compatible)
 */
interface AIConfig {
  readonly enabled: boolean;
  readonly arena: { x: number; y: number; width: number; height: number };
  readonly getPlayers: () => [PlayerState, PlayerState];
  readonly getPositions: () => Position[];
  readonly setAIPosition: (pos: Position) => void;
  readonly onAttack: () => void;
  readonly onDefend: () => void;
  readonly onTechnique: () => void;
  readonly onStanceChange?: (stance: TrigramStance) => void;
  readonly tickMs?: number;
}

/**
 * Extra behavior tuning (optional)
 */
interface AIBehaviorConfig {
  readonly seed?: number;
  readonly reactionTimeMs?: number; // Base decision interval
  readonly varianceMs?: number; // Added randomness per decision
  readonly aggression?: number; // 0–1
  readonly defenseBias?: number; // 0–1
  readonly techniqueBias?: number; // 0–1
  readonly retreatHealthRatio?: number; // Retreat below (% max)
  readonly engageDistance?: number; // Will close if farther than this
  readonly idealDistanceMin?: number;
  readonly idealDistanceMax?: number;
  readonly circleDistance?: number;
  readonly stanceSwitchIntervalMs?: number;
  readonly allowStanceSwitch?: boolean;
  readonly retreatDistanceAdd?: number;
}

/**
 * Action weights container
 */
interface ActionWeights {
  attack: number;
  defend: number;
  technique: number;
  approach: number;
  retreat: number;
  circle: number;
}

function pseudoRandom(seedRef: React.MutableRefObject<number>): number {
  // xorshift32
  let x = seedRef.current || 123456789;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  seedRef.current = x;
  return (x >>> 0) / 0xffffffff;
}

/**
 * Improved AI combat hook
 */
export function useAICombat(
  config: AIConfig & { behavior?: Partial<AIBehaviorConfig> }
) {
  const {
    enabled,
    arena,
    getPlayers,
    getPositions,
    setAIPosition,
    onAttack,
    onDefend,
    onTechnique,
    onStanceChange,
    tickMs = 60,
    behavior = {},
  } = config;

  const settings: AIBehaviorConfig = {
    seed: behavior.seed ?? Date.now(),
    reactionTimeMs: behavior.reactionTimeMs ?? 550,
    varianceMs: behavior.varianceMs ?? 250,
    aggression: clamp01(behavior.aggression ?? 0.55),
    defenseBias: clamp01(behavior.defenseBias ?? 0.35),
    techniqueBias: clamp01(behavior.techniqueBias ?? 0.25),
    retreatHealthRatio: clamp01(behavior.retreatHealthRatio ?? 0.3),
    engageDistance: behavior.engageDistance ?? 260,
    idealDistanceMin: behavior.idealDistanceMin ?? 110,
    idealDistanceMax: behavior.idealDistanceMax ?? 155,
    circleDistance: behavior.circleDistance ?? 200,
    stanceSwitchIntervalMs: behavior.stanceSwitchIntervalMs ?? 4000,
    allowStanceSwitch: behavior.allowStanceSwitch ?? true,
    retreatDistanceAdd: behavior.retreatDistanceAdd ?? 140,
  };

  const seedRef = useRef(settings.seed!);
  const nextDecisionAtRef = useRef(
    performance.now() + settings.reactionTimeMs!
  );
  const nextStanceSwitchAtRef = useRef(
    performance.now() + settings.stanceSwitchIntervalMs!
  );
  const lastActionRef = useRef<string>("idle");
  const mountedRef = useRef(true);

  const frameAccumRef = useRef(0);
  const lastTsRef = useRef(performance.now());

  const clampPos = useCallback(
    (x: number, y: number): Position => ({
      x: Math.min(arena.x + arena.width - 60, Math.max(arena.x, x)),
      y: Math.min(arena.y + arena.height - 180, Math.max(arena.y, y)),
    }),
    [arena]
  );

  const moveToward = useCallback(
    (from: Position, to: Position, speed: number) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) return from;
      const nx = from.x + (dx / dist) * speed;
      const ny = from.y + (dy / dist) * speed;
      return clampPos(nx, ny);
    },
    [clampPos]
  );

  const weightedChoice = (
    weights: ActionWeights,
    rng: () => number
  ): "attack" | "defend" | "technique" | "approach" | "retreat" | "circle" => {
    const entries: [keyof ActionWeights, number][] = Object.entries(
      weights
    ) as any;
    const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
    let roll = rng() * total;
    for (const [k, v] of entries) {
      if ((roll -= v) <= 0) return k;
    }
    return "circle";
  };

  const maybeSwitchStance = useCallback(
    (now: number, ai: PlayerState, rng: () => number) => {
      if (!settings.allowStanceSwitch || !onStanceChange) return;
      if (now < nextStanceSwitchAtRef.current) return;
      nextStanceSwitchAtRef.current =
        now +
        settings.stanceSwitchIntervalMs! +
        rng() * settings.stanceSwitchIntervalMs!;

      // Pick a stance different from current
      const pool = Object.values(TrigramStance).filter(
        (s) => s !== ai.currentStance
      );
      const pick = pool[Math.floor(rng() * pool.length)];
      onStanceChange(pick);
    },
    [
      onStanceChange,
      settings.allowStanceSwitch,
      settings.stanceSwitchIntervalMs,
    ]
  );

  const decideAndAct = useCallback(
    (now: number) => {
      const rng = () => pseudoRandom(seedRef);
      const players = getPlayers?.();
      if (!players || players.length < 2) return;
      const [player, ai] = players;
      if (!ai || !player) return;

      const [pPos, aiPos] = getPositions();
      const distance = Math.hypot(pPos.x - aiPos.x, pPos.y - aiPos.y);

      // Retreat condition
      const aiHealthRatio = ai.health / (ai.maxHealth || 1);
      const shouldRetreat = aiHealthRatio < settings.retreatHealthRatio!;

      // Build dynamic weights
      const weights: ActionWeights = {
        attack: 0,
        defend: 0,
        technique: 0,
        approach: 0,
        retreat: 0,
        circle: 0,
      };

      // Base aggression shaping
      if (distance < settings.idealDistanceMin!) {
        // Too close: may strike or circle / retreat
        weights.attack += settings.aggression! * 1.2;
        weights.defend += settings.defenseBias! * 0.8;
        weights.technique += settings.techniqueBias! * 0.6;
        weights.retreat += shouldRetreat ? 2.0 : 0.4;
        weights.circle += 0.8;
      } else if (distance > settings.idealDistanceMax!) {
        // Too far: approach oriented
        weights.approach += 1.5;
        weights.attack += settings.aggression! * 0.6;
        weights.technique += settings.techniqueBias! * 0.5;
        weights.circle += 0.4;
        if (distance > settings.engageDistance!) {
          weights.approach += 1.0;
        }
      } else {
        // In optimal band
        weights.attack += settings.aggression! * 1.4;
        weights.technique += settings.techniqueBias! * 1.1;
        weights.defend += settings.defenseBias! * 0.6;
        weights.circle += 1.0;
      }

      // Defensive pressure if recently acted or low stamina
      if (ai.stamina < (ai.maxStamina || 100) * 0.25) {
        weights.defend += 1.2;
        weights.attack *= 0.8;
        weights.technique *= 0.7;
      }

      if (shouldRetreat) {
        weights.retreat += 2.5;
        weights.defend += 1.0;
      }

      // Cooldown gating: reduce repeating same action
      if (lastActionRef.current === "attack") weights.attack *= 0.75;
      if (lastActionRef.current === "technique") weights.technique *= 0.6;

      const choice = weightedChoice(weights, rng);
      lastActionRef.current = choice;

      // Movement speed scaling
      const baseSpeed = 7 + settings.aggression! * 3;

      switch (choice) {
        case "attack":
          onAttack();
          break;
        case "defend":
          onDefend();
          break;
        case "technique":
          onTechnique();
          break;
        case "approach": {
          const next = moveToward(aiPos, pPos, baseSpeed);
          setAIPosition(next);
          break;
        }
        case "retreat": {
          const awayDx = aiPos.x - pPos.x;
          const dir = awayDx >= 0 ? 1 : -1;
          const target: Position = {
            x: aiPos.x + dir * settings.retreatDistanceAdd!,
            y: aiPos.y,
          };
          const next = moveToward(aiPos, target, baseSpeed * 0.9);
          setAIPosition(next);
          break;
        }
        case "circle": {
          const angle =
            Math.atan2(pPos.y - aiPos.y, pPos.x - aiPos.x) +
            (rng() > 0.5 ? Math.PI / 2 : -Math.PI / 2);
          const target: Position = {
            x: pPos.x + Math.cos(angle) * settings.circleDistance!,
            y: pPos.y + Math.sin(angle) * (settings.circleDistance! * 0.6),
          };
          const next = moveToward(aiPos, target, baseSpeed * 0.85);
          setAIPosition(next);
          break;
        }
      }

      maybeSwitchStance(now, ai, rng);

      // Schedule next decision
      nextDecisionAtRef.current =
        now +
        settings.reactionTimeMs! +
        rng() * settings.varianceMs! * (shouldRetreat ? 1.2 : 1);
    },
    [
      getPlayers,
      getPositions,
      moveToward,
      onAttack,
      onDefend,
      onTechnique,
      setAIPosition,
      maybeSwitchStance,
      settings.aggression,
      settings.circleDistance,
      settings.defenseBias,
      settings.engageDistance,
      settings.idealDistanceMax,
      settings.idealDistanceMin,
      settings.reactionTimeMs,
      settings.retreatDistanceAdd,
      settings.retreatHealthRatio,
      settings.techniqueBias,
      settings.varianceMs,
    ]
  );

  useEffect(() => {
    mountedRef.current = true;
    if (!enabled) return () => void (mountedRef.current = false);

    const loop = (ts: number) => {
      if (!mountedRef.current) return;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;
      frameAccumRef.current += dt;

      if (frameAccumRef.current >= tickMs) {
        frameAccumRef.current = 0;

        if (ts >= nextDecisionAtRef.current) {
          decideAndAct(ts);
        }
      }

      requestAnimationFrame(loop);
    };

    const raf = requestAnimationFrame(loop);
    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(raf);
    };
  }, [enabled, decideAndAct, tickMs]);

  // Helper for external debug if needed later
  return {
    getLastAction: () => lastActionRef.current,
  };
}

/* Helpers */
function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
