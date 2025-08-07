// NOTE: Improvements:
// - Remove unused import { isMobile } from "pixi.js"
// - Strongly type addCombatMessage params
// - Introduce CombatMessage interface
// - Guard attack by distance, stamina, ki
// - Early KO detection and unified round end path
// - Minor layout / effect layering order adjustments
// - Prevent duplicate attack execution
// - Typed basic attack object
// - Narrow roundDisplayStatus union
// - Clearer player validity fallback
// - Fix stale player refs in callbacks

import { useAICombat } from "@/hooks/useAICombat";
import { useHitEffects } from "@/hooks/useHitEffects";
import { KoreanTechnique, PlayerState } from "@/systems";
import { CombatSystem } from "@/systems/CombatSystem";
import { GameMode, PlayerArchetype, Position } from "@/types";
import { TrigramStance } from "@/types/common";
import "@pixi/layout";
import { LayoutContainer } from "@pixi/layout/components";
import "@pixi/layout/react";
import { extend, useTick } from "@pixi/react";
import { Container } from "pixi.js"; // removed isMobile import
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HitEffectType } from "../../systems/effects";
import { usePlayerMovement } from "../../utils/inputSystem";
import { extendPixiComponents } from "../../utils/pixiExtensions";
import { createPlayerFromArchetype } from "../../utils/playerUtils";
import { DojangBackground } from "../game/DojangBackground";
import { HitEffectsLayer } from "../ui/HitEffectsLayer";
import { PlayerVisuals } from "../ui/PlayerVisuals";
import { CombatControls } from "./components/CombatControls";
import { CombatFooter } from "./components/CombatFooter";
import { CombatHUD } from "./components/CombatHUD";
import { CombatStatsPanel } from "./components/CombatStatsPanel";
import { PauseOverlay } from "./components/PauseOverlay";
import { RoundStatusDisplay } from "./components/RoundStatusDisplay";

// Register custom components
extend({
  Container,
  LayoutContainer,
});
extendPixiComponents();

export interface CombatScreenProps {
  readonly players: readonly PlayerState[];
  readonly onPlayerUpdate: (
    playerIndex: number,
    updates: Partial<PlayerState>
  ) => void;
  readonly currentRound: number;
  readonly timeRemaining: number;
  readonly isPaused: boolean;
  readonly onReturnToMenu: () => void;
  readonly onGameEnd: (winner: number) => void;
  readonly gameMode?: GameMode;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
}

interface CombatMessage {
  readonly id: string;
  readonly ko: string;
  readonly en: string;
  readonly ts: number;
  readonly type?: "attack" | "defend" | "tech" | "info" | "stance";
}

export const CombatScreen: React.FC<CombatScreenProps> = ({
  players,
  onPlayerUpdate,
  currentRound,
  timeRemaining,
  isPaused,
  onReturnToMenu,
  onGameEnd,
  width = 1200,
  height = 800,
  x = 0,
  y = 0,
}) => {
  // State
  const [isExecutingTechnique, setIsExecutingTechnique] = useState(false);
  const [combatMessages, setCombatMessages] = useState<CombatMessage[]>([]);
  const [roundStarted, setRoundStarted] = useState(false);
  const [roundEnded, setRoundEnded] = useState(false);
  const [roundDisplayStatus, setRoundDisplayStatus] = useState<
    "start" | "fight" | "ko" | "end" | null
  >(null);

  // Combat system
  const combatSystem = useMemo(() => new CombatSystem(), []);

  // Hit effects (from hook) - renamed to avoid redeclare conflict
  const {
    effects: hitEffects,
    addHitEffect,
    startEffects,
    stopEffects,
  } = useHitEffects({ defaultDuration: 900, maxEffects: 60 });

  useEffect(() => {
    startEffects();
    return () => stopEffects();
  }, [startEffects, stopEffects]);

  // Arena bounds
  const arenaBounds = useMemo(
    () => ({
      x: width * 0.1,
      y: height * 0.2,
      width: width * 0.8,
      height: height * 0.6,
    }),
    [width, height]
  );

  const [playerPositions, setPlayerPositions] = useState<Position[]>([
    {
      x: arenaBounds.x + arenaBounds.width * 0.3,
      y: arenaBounds.y + arenaBounds.height * 0.6,
    },
    {
      x: arenaBounds.x + arenaBounds.width * 0.7,
      y: arenaBounds.y + arenaBounds.height * 0.6,
    },
  ]);

  const { playerPosition, isMoving } = usePlayerMovement({
    enabled: !isPaused && roundStarted && !roundEnded,
    bounds: arenaBounds,
    onPositionChange: (newPosition: Position) => {
      setPlayerPositions((prev) => [newPosition, prev[1]]);
      onPlayerUpdate(0, { position: newPosition });
    },
    initialPosition: playerPositions[0],
    moveSpeed: 300,
  });

  // screen classification (kept)
  const isMobileViewport = useMemo(() => width < 768, [width]);

  const validPlayers = useMemo<[PlayerState, PlayerState]>(() => {
    const fallback1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    const fallback2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);
    const p1 = players[0] ?? fallback1;
    const p2 = players[1] ?? fallback2;
    return [
      { ...p1, position: playerPositions[0] },
      { ...p2, position: playerPositions[1] },
    ];
  }, [players, playerPositions]);

  const addCombatMessage = useCallback(
    (k: string, e: string, type: CombatMessage["type"] = "info") => {
      setCombatMessages((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
          ko: k,
          en: e,
          ts: Date.now(),
          type,
        },
        ...prev.slice(0, 24),
      ]);
    },
    []
  );

  // Placeholder (hook handles lifecycle)
  const handleEffectComplete = useCallback((_id: string) => {}, []);

  // Update player position
  useEffect(() => {
    onPlayerUpdate(0, { position: playerPosition });
  }, [playerPosition, onPlayerUpdate]);

  // Auto KO detection
  useEffect(() => {
    if (roundEnded) return;
    const [p1, p2] = validPlayers;
    if (p1.health <= 0 || p2.health <= 0) {
      setRoundEnded(true);
      setRoundDisplayStatus("ko");
      const winner = p1.health > 0 ? 0 : 1;
      addCombatMessage("결정타!", "Knockout!", "info");
      setTimeout(() => onGameEnd(winner), 1600);
    }
  }, [validPlayers, roundEnded, addCombatMessage, onGameEnd]);

  // Round logic
  useEffect(() => {
    if (isPaused) return;
    if (timeRemaining <= 0 && !roundEnded) {
      setRoundEnded(true);
      setRoundStarted(false);
      setRoundDisplayStatus("end");
      const winner = validPlayers[0].health >= validPlayers[1].health ? 0 : 1;
      addCombatMessage("라운드 종료", "Round Over", "info");
      setTimeout(() => onGameEnd(winner), 2000);
      return;
    }
    if (timeRemaining > 0 && !roundStarted && !roundEnded && currentRound > 0) {
      setRoundStarted(true);
      addCombatMessage("라운드 시작!", "Round Start!", "info");
      setRoundDisplayStatus("start");
      const t = setTimeout(() => setRoundDisplayStatus("fight"), 1200);
      return () => clearTimeout(t);
    }
  }, [
    timeRemaining,
    roundEnded,
    roundStarted,
    validPlayers,
    onGameEnd,
    addCombatMessage,
    currentRound,
    isPaused,
  ]);

  // Distance helper
  const distanceBetween = useCallback(
    (a: Position, b: Position) => Math.hypot(a.x - b.x, a.y - b.y),
    []
  );

  const handleAttack = useCallback(() => {
    if (
      isExecutingTechnique ||
      !roundStarted ||
      roundEnded ||
      validPlayers[0].stamina < 5
    )
      return;

    const [attacker, defender] = validPlayers;
    const dist = distanceBetween(attacker.position, defender.position);
    const inRange = dist < 180;

    // Build a minimal technique object satisfying KoreanTechnique interface
    const baseTechnique = {
      id: "basic_attack",
      koreanName: "기본공격",
      englishName: "Basic Attack",
      romanized: "gibon_gonggyeok",
      description: "Basic close-range strike",
      stance: attacker.currentStance,
      type: "attack",
      damageType: "physical",
      baseDamage: 15,
      kiCost: 2,
      staminaCost: 6,
      accuracy: 0.8,
      range: 1.0,
      executionTime: 300,
      recoveryTime: 250,
      critChance: 0.1,
      critMultiplier: 1.5,
      effects: [],
    } as unknown as KoreanTechnique;

    const kiCost = (baseTechnique as any).kiCost ?? 2;
    const staminaCost = (baseTechnique as any).staminaCost ?? 6;

    if (!inRange) {
      addCombatMessage("사거리 밖", "Out of range", "attack");
      addHitEffect(HitEffectType.MISS, attacker.position, 0.6);
      return;
    }

    setIsExecutingTechnique(true);

    const result = combatSystem.resolveAttack(
      attacker,
      defender,
      baseTechnique
    );

    const isCritical =
      (result as any).isCritical !== undefined
        ? (result as any).isCritical
        : (result as any).critical;

    addHitEffect(
      result.hit
        ? isCritical
          ? HitEffectType.CRITICAL_HIT
          : HitEffectType.HIT
        : HitEffectType.MISS,
      defender.position,
      result.hit ? (isCritical ? 1.3 : 1.0) : 0.5
    );

    // Resolve damage field normalization
    const damageValue =
      (result as any).damageDealt !== undefined
        ? (result as any).damageDealt
        : (result as any).damage ?? 0;

    if (result.hit) {
      const { updatedAttacker, updatedDefender } =
        combatSystem.applyCombatResult(result, attacker, defender);

      onPlayerUpdate(0, {
        ...updatedAttacker,
        stamina: Math.max(0, attacker.stamina - staminaCost),
        ki: Math.max(0, attacker.ki - kiCost),
        totalDamageDealt: (attacker.totalDamageDealt || 0) + damageValue,
      });

      onPlayerUpdate(1, {
        ...updatedDefender,
        totalDamageReceived: (defender.totalDamageReceived || 0) + damageValue,
      });

      addCombatMessage(
        isCritical ? "치명타!" : "명중!",
        isCritical ? "Critical!" : "Hit!",
        "attack"
      );
    } else {
      onPlayerUpdate(0, {
        stamina: Math.max(0, attacker.stamina - staminaCost / 2),
      });
      addCombatMessage("공격 실패", "Attack Missed", "attack");
    }

    setTimeout(() => setIsExecutingTechnique(false), 450);
  }, [
    isExecutingTechnique,
    roundStarted,
    roundEnded,
    validPlayers,
    distanceBetween,
    combatSystem,
    addCombatMessage,
    addHitEffect,
    onPlayerUpdate,
  ]);

  const handleDefend = useCallback(() => {
    if (!roundStarted || roundEnded) return;
    const [attacker] = validPlayers;
    if (attacker.isBlocking) return;
    onPlayerUpdate(0, { isBlocking: true });
    addCombatMessage("방어 자세", "Guard Up", "defend");
    addHitEffect(HitEffectType.BLOCK, attacker.position, 0.9);
    setTimeout(() => onPlayerUpdate(0, { isBlocking: false }), 800);
  }, [
    roundStarted,
    roundEnded,
    validPlayers,
    onPlayerUpdate,
    addCombatMessage,
    addHitEffect,
  ]);

  const handleTechniqueExecute = useCallback(() => {
    if (
      isExecutingTechnique ||
      !roundStarted ||
      roundEnded ||
      validPlayers[0].ki < 10 ||
      validPlayers[0].stamina < 15
    ) {
      if (validPlayers[0].ki < 10 || validPlayers[0].stamina < 15) {
        addCombatMessage("기/체력 부족", "Insufficient Ki/Stamina", "tech");
      }
      return;
    }

    const [attacker, defender] = validPlayers;
    const dist = distanceBetween(attacker.position, defender.position);
    const inRange = dist < 220;

    setIsExecutingTechnique(true);
    addHitEffect(HitEffectType.CRITICAL_HIT, attacker.position, 1.4);

    if (inRange) {
      const bonus = 25;
      onPlayerUpdate(1, {
        health: Math.max(0, defender.health - bonus),
        hitsTaken: defender.hitsTaken + 1,
        totalDamageReceived: (defender.totalDamageReceived || 0) + bonus,
      });
      onPlayerUpdate(0, {
        ki: attacker.ki - 10,
        stamina: attacker.stamina - 15,
        totalDamageDealt: (attacker.totalDamageDealt || 0) + bonus,
      });
      addCombatMessage("특수 명중!", "Technique Hit!", "tech");
    } else {
      onPlayerUpdate(0, {
        ki: attacker.ki - 5,
        stamina: attacker.stamina - 10,
      });
      addCombatMessage("실패", "Technique Failed", "tech");
    }

    setTimeout(() => setIsExecutingTechnique(false), 800);
  }, [
    isExecutingTechnique,
    roundStarted,
    roundEnded,
    validPlayers,
    addCombatMessage,
    addHitEffect,
    onPlayerUpdate,
    distanceBetween,
  ]);

  const handleStanceSwitch = useCallback(
    (stance: TrigramStance) => {
      if (!roundStarted || roundEnded) return;
      onPlayerUpdate(0, { currentStance: stance });
      addCombatMessage(`자세 변경: ${stance}`, `Stance: ${stance}`, "stance");
      addHitEffect(HitEffectType.STATUS_EFFECT, playerPosition, 0.4);
    },
    [
      roundStarted,
      roundEnded,
      onPlayerUpdate,
      addCombatMessage,
      addHitEffect,
      playerPosition,
    ]
  );

  // AI callbacks remain (light refine)
  const handleAIAttack = useCallback(() => {
    const [, ai] = validPlayers;
    addHitEffect(HitEffectType.HIT, ai.position, 1);
    const dist = distanceBetween(validPlayers[0].position, ai.position);
    if (dist < 140) {
      const dmg = 10 + Math.random() * 12;
      onPlayerUpdate(0, {
        health: Math.max(0, validPlayers[0].health - dmg),
        hitsTaken: validPlayers[0].hitsTaken + 1,
      });
      addCombatMessage("AI 명중", "AI Hit", "attack");
    } else {
      addCombatMessage("AI 빗나감", "AI Miss", "attack");
    }
  }, [
    validPlayers,
    onPlayerUpdate,
    addCombatMessage,
    addHitEffect,
    distanceBetween,
  ]);

  const handleAIDefend = useCallback(() => {
    const [, ai] = validPlayers;
    onPlayerUpdate(1, { isBlocking: true });
    addCombatMessage("AI 방어", "AI Guard", "defend");
    addHitEffect(HitEffectType.BLOCK, ai.position, 0.8);
    setTimeout(() => onPlayerUpdate(1, { isBlocking: false }), 700);
  }, [validPlayers, onPlayerUpdate, addCombatMessage, addHitEffect]);

  const handleAITechnique = useCallback(() => {
    const [, ai] = validPlayers;
    if (ai.ki < 10 || ai.stamina < 15) {
      handleAIAttack();
      return;
    }
    addHitEffect(HitEffectType.CRITICAL_HIT, ai.position, 1.2);
    const dist = distanceBetween(validPlayers[0].position, ai.position);
    if (dist < 160) {
      const dmg = 18 + Math.random() * 15;
      onPlayerUpdate(0, {
        health: Math.max(0, validPlayers[0].health - dmg),
        hitsTaken: validPlayers[0].hitsTaken + 1,
      });
      onPlayerUpdate(1, { ki: ai.ki - 10, stamina: ai.stamina - 15 });
      addCombatMessage("AI 기술!", "AI Technique!", "tech");
    } else {
      onPlayerUpdate(1, { ki: ai.ki - 5, stamina: ai.stamina - 10 });
      addCombatMessage("AI 실패", "AI Fail", "tech");
    }
  }, [
    validPlayers,
    onPlayerUpdate,
    addCombatMessage,
    addHitEffect,
    distanceBetween,
    handleAIAttack,
  ]);

  const frameRef = useRef(0);
  useTick(() => {
    frameRef.current++;
  });

  useAICombat({
    enabled: !isPaused && roundStarted && !roundEnded,
    arena: arenaBounds,
    getPlayers: () => validPlayers,
    getPositions: () => playerPositions,
    setAIPosition: (pos) => setPlayerPositions((prev) => [prev[0], pos]),
    onAttack: handleAIAttack,
    onDefend: handleAIDefend,
    onTechnique: handleAITechnique,
    tickMs: 60,
  });

  const getPlayerAnimationState = useCallback(
    (index: number) => {
      const p = validPlayers[index];
      if (p.health <= 0) return "defeat";
      if (p.isBlocking) return "defend";
      if (isExecutingTechnique && index === 0) return "technique_execute";
      if (index === 0 && isMoving) return "walk";
      return "idle";
    },
    [validPlayers, isExecutingTechnique, isMoving]
  );

  const layoutConstants = {
    padding: 10,
    hudHeight: 120,
    controlsHeight: 100,
    footerHeight: 40,
  };

  const matchDuration = Math.max(0, 180 - timeRemaining);

  return (
    <pixiContainer
      data-testid="combat-screen"
      layout={{
        width,
        height,
        position: "absolute",
        top: y,
        left: x,
      }}
    >
      <DojangBackground
        width={width}
        height={height}
        lighting="cyberpunk"
        animate={true}
      />

      {/* Foreground Layer */}
      <pixiContainer
        layout={{
          width,
          height,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: layoutConstants.padding,
        }}
      >
        {/* HUD */}
        <pixiContainer
          layout={{
            width: "100%",
            height: layoutConstants.hudHeight,
            alignItems: "flex-start",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CombatHUD
            player1={validPlayers[0]}
            player2={validPlayers[1]}
            timeRemaining={timeRemaining}
            currentRound={currentRound}
            maxRounds={3}
            gameScore={{
              player1: validPlayers[0].wins || 0,
              player2: validPlayers[1].wins || 0,
            }}
            roundsWon={{
              player1: validPlayers[0].wins || 0,
              player2: validPlayers[1].wins || 0,
            }}
            isPaused={isPaused}
            onPauseToggle={() => console.log("Pause toggled")}
            width={width - layoutConstants.padding * 2}
            height={layoutConstants.hudHeight}
          />
        </pixiContainer>

        {/* Arena */}
        <pixiContainer
          data-testid="combat-arena"
          layout={{
            width: "100%",
            flexGrow: 1,
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Hit effects behind players */}
          <HitEffectsLayer
            effects={hitEffects}
            onEffectComplete={handleEffectComplete}
          />

          {/* Players */}
          <PlayerVisuals
            playerState={validPlayers[0]}
            x={playerPositions[0].x}
            y={playerPositions[0].y}
            scale={isMobileViewport ? 0.8 : 1.0}
            renderMode="combat"
            facing="right"
            showDetails={true}
            showVitalPoints={false}
            showKiAura={true}
            showKoreanLabels={true}
            interactive={true}
            onPlayerClick={() => console.log("Player 1 clicked")}
            animationState={getPlayerAnimationState(0)}
            data-testid="combat-player-1"
          />
          <PlayerVisuals
            playerState={validPlayers[1]}
            x={playerPositions[1].x}
            y={playerPositions[1].y}
            scale={isMobileViewport ? 0.8 : 1.0}
            renderMode="combat"
            facing="left"
            showDetails={true}
            showVitalPoints={false}
            showKiAura={true}
            showKoreanLabels={true}
            interactive={true}
            onPlayerClick={() => console.log("Player 2 clicked")}
            animationState={getPlayerAnimationState(1)}
            data-testid="combat-player-2"
          />

          {roundDisplayStatus && (
            <RoundStatusDisplay
              status={roundDisplayStatus}
              round={currentRound}
              width={width}
              height={height}
              onAnimationComplete={() => setRoundDisplayStatus(null)}
            />
          )}
        </pixiContainer>

        {/* Controls + Stats */}
        <pixiContainer
          layout={{
            width: "100%",
            height: layoutConstants.controlsHeight,
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
            flexShrink: 0,
            paddingBottom: layoutConstants.footerHeight + 10,
          }}
        >
          <CombatControls
            onAttack={handleAttack}
            onDefend={handleDefend}
            onSwitchStance={handleStanceSwitch}
            onTechniqueExecute={handleTechniqueExecute}
            player={validPlayers[0]}
            isExecutingTechnique={isExecutingTechnique}
            width={isMobileViewport ? width * 0.45 : 400}
            height={isMobileViewport ? 90 : 120}
          />
          <CombatStatsPanel
            players={validPlayers}
            combatLog={combatMessages.map((m) => ({
              id: m.id,
              timestamp: m.ts,
              korean: m.ko,
              english: m.en,
              type:
                m.type === "attack"
                  ? "attack"
                  : m.type === "defend"
                  ? "defend"
                  : m.type === "tech"
                  ? "technique"
                  : m.type === "stance"
                  ? "stance"
                  : "info",
            }))}
            matchDuration={matchDuration}
            totalDamageDealt={{
              player1: validPlayers[0].totalDamageDealt || 0,
              player2: validPlayers[1].totalDamageDealt || 0,
            }}
            criticalHits={{
              player1: Math.floor((validPlayers[0].totalDamageDealt || 0) / 60),
              player2: Math.floor((validPlayers[1].totalDamageDealt || 0) / 60),
            }}
            perfectStrikes={{
              player1: validPlayers[0].perfectStrikes || 0,
              player2: validPlayers[1].perfectStrikes || 0,
            }}
            width={isMobileViewport ? width * 0.45 : 400}
            height={isMobileViewport ? 90 : 120}
          />
        </pixiContainer>

        {/* Footer */}
        <pixiContainer
          layout={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: layoutConstants.footerHeight,
          }}
        >
          <CombatFooter
            onReturnToMenu={onReturnToMenu}
            isMobile={isMobileViewport}
            width={width}
            height={layoutConstants.footerHeight}
          />
        </pixiContainer>
      </pixiContainer>

      {isPaused && <PauseOverlay isMobile={isMobileViewport} />}
    </pixiContainer>
  );
};

export default CombatScreen;
