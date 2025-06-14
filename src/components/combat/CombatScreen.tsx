import React, { useState, useCallback, useMemo } from "react";
import type { CombatScreenProps } from "../../types/combat";
import type { PlayerState } from "../../types/player";
import type { Position } from "../../types/common";
import type { HitEffect } from "../../types/effects";
import { CombatArena } from "./components/CombatArena";
import { CombatControls } from "./components/CombatControls";
import { CombatHUD } from "./components/CombatHUD";
import { HitEffectsLayer } from "../ui/HitEffectsLayer";
import { DojangBackground } from "../game/DojangBackground";
import { CombatStats, PlayerStatusPanel } from "./components/";
import {
  ResponsivePixiContainer,
  ResponsivePixiButton,
  ResponsivePixiPanel,
} from "../ui/base/ResponsivePixiComponents";
import { KOREAN_COLORS } from "../../types/constants";

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
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([]);
  const [isExecutingTechnique, setIsExecutingTechnique] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [combatLog] = useState<string[]>([]);

  const createHitEffect = useCallback(
    (
      id: string,
      type: "hit" | "critical" | "block" | "miss",
      position: Position,
      intensity: number
    ): HitEffect => ({
      id,
      type: type as any,
      attackerId: "player1",
      defenderId: "player2",
      timestamp: Date.now(),
      duration: 1000,
      position,
      intensity,
      startTime: Date.now(),
    }),
    []
  );

  const handleAttack = useCallback(() => {
    const effect = createHitEffect(
      `attack_${Date.now()}`,
      "hit",
      { x: 400, y: 300 },
      1.0
    );
    setHitEffects((prev) => [...prev, effect]);
  }, [createHitEffect]);

  const handleDefend = useCallback(() => {
    console.log("Defending");
  }, []);

  const handleTechniqueExecute = useCallback((technique: any) => {
    setIsExecutingTechnique(true);
    console.log("Executing technique:", technique.name);
    setTimeout(() => setIsExecutingTechnique(false), 500);
  }, []);

  const handleStanceSwitch = useCallback(
    (stance: any) => {
      setIsExecutingTechnique(true);
      console.log("Switching to stance:", stance);
      onPlayerUpdate(0, { currentStance: stance });
    },
    [onPlayerUpdate]
  );

  const handleGuard = useCallback(() => {
    console.log("Guarding");
  }, []);

  const handlePauseToggle = useCallback(() => {
    setIsExecutingTechnique(true);
    setTimeout(() => setIsExecutingTechnique(false), 800);
  }, []);

  const handleEffectComplete = useCallback((effectId: string) => {
    setHitEffects((prev) => prev.filter((effect) => effect.id !== effectId));
  }, []);

  const validatedPlayers = useMemo(() => {
    if (players.length < 2) {
      console.warn("CombatScreen: Not enough players provided");
      const dummyPlayer: PlayerState = {
        ...players[0],
        id: "dummy_player",
        name: { korean: "더미", english: "Dummy" },
      };
      return [players[0], dummyPlayer] as const;
    }
    return [players[0], players[1]] as const;
  }, [players]);

  const addHitEffect = useCallback(
    (type: "hit" | "critical" | "block" | "miss", position: Position) => {
      const effect = createHitEffect(
        `effect_${Date.now()}`,
        type,
        position,
        1.0
      );
      setHitEffects((prev) => [...prev, effect]);
    },
    [createHitEffect]
  );

  const handleGameEndLogic = useCallback(() => {
    if (validatedPlayers[0].health <= 0) {
      onGameEnd(1);
    } else if (validatedPlayers[1].health <= 0) {
      onGameEnd(0);
    }
  }, [validatedPlayers, onGameEnd]);

  React.useEffect(() => {
    handleGameEndLogic();
  }, [handleGameEndLogic]);

  const { isMobile, isTablet } = useMemo(() => {
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    return { isMobile, isTablet };
  }, [width, height]);

  const handlePlayerClick = (idx: number) => {
    setSelectedPlayer(idx);
    addHitEffect("hit", { x: 100 + idx * 200, y: 200 });
  };

  return (
    <ResponsivePixiContainer x={x} y={y} data-testid="combat-screen">
      <DojangBackground
        width={width}
        height={height}
        lighting="cyberpunk"
        animate={true}
      />

      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.1 });
          const patternSize = isMobile ? 100 : isTablet ? 125 : 150;
          const circleSize = isMobile ? 25 : isTablet ? 32 : 40;

          for (let i = 0; i < width; i += patternSize) {
            for (let j = 0; j < height; j += patternSize) {
              g.circle(i + patternSize / 2, j + patternSize / 2, circleSize);
              g.stroke();
            }
          }
        }}
      />

      <CombatArena
        players={validatedPlayers}
        width={width}
        height={height * (isMobile ? 0.65 : 0.75)}
        y={height * (isMobile ? 0.2 : 0.15)}
        onPlayerClick={handlePlayerClick}
      />

      <CombatHUD
        player1={validatedPlayers[0]}
        player2={validatedPlayers[1]}
        currentRound={currentRound}
        timeRemaining={timeRemaining}
        maxRounds={3}
        isPaused={isPaused}
        width={width}
        height={isMobile ? 80 : 120}
        y={0}
      />

      <ResponsivePixiPanel
        title={validatedPlayers[0].name.korean}
        x={isMobile ? 10 : 20}
        y={height * (isMobile ? 0.15 : 0.2)}
        width={isMobile ? width * 0.4 : 180}
        height={isMobile ? 200 : 300}
        data-testid="player1-status"
      >
        <PlayerStatusPanel
          player={validatedPlayers[0]}
          position="left"
          x={0}
          y={0}
          width={isMobile ? width * 0.4 - 20 : 160}
          height={isMobile ? 180 : 280}
          isSelected={selectedPlayer === 0}
        />
      </ResponsivePixiPanel>

      <ResponsivePixiPanel
        title={validatedPlayers[1].name.korean}
        x={width - (isMobile ? width * 0.4 + 10 : 200)}
        y={height * (isMobile ? 0.15 : 0.2)}
        width={isMobile ? width * 0.4 : 180}
        height={isMobile ? 200 : 300}
        data-testid="player2-status"
      >
        <PlayerStatusPanel
          player={validatedPlayers[1]}
          position="right"
          x={0}
          y={0}
          width={isMobile ? width * 0.4 - 20 : 160}
          height={isMobile ? 180 : 280}
          isSelected={selectedPlayer === 1}
        />
      </ResponsivePixiPanel>

      <ResponsivePixiPanel
        title="전투 통계"
        x={isMobile ? 10 : width / 2 - 150}
        y={height - (isMobile ? 160 : 180)}
        width={isMobile ? width - 20 : 300}
        height={isMobile ? 100 : 160}
        data-testid="combat-stats-panel"
      >
        <CombatStats
          players={validatedPlayers}
          combatLog={combatLog}
          x={0}
          y={0}
          width={isMobile ? width - 40 : 280}
          height={isMobile ? 80 : 140}
        />
      </ResponsivePixiPanel>

      <ResponsivePixiContainer
        x={isMobile ? 10 : 20}
        y={height - (isMobile ? 50 : 140)}
        data-testid="combat-controls-container"
      >
        <CombatControls
          onAttack={handleAttack}
          onDefend={handleDefend}
          onSwitchStance={handleStanceSwitch}
          onPauseToggle={handlePauseToggle}
          isPaused={isPaused}
          player={validatedPlayers[0]}
          onTechniqueExecute={handleTechniqueExecute}
          onGuard={handleGuard}
          isExecutingTechnique={isExecutingTechnique}
          width={isMobile ? width - 20 : 400}
          height={isMobile ? 40 : 120}
          x={0}
          y={0}
        />
      </ResponsivePixiContainer>

      <HitEffectsLayer
        effects={hitEffects}
        onEffectComplete={handleEffectComplete}
      />

      <ResponsivePixiButton
        text="메뉴로"
        x={width - (isMobile ? 80 : 150)}
        y={isMobile ? 10 : 20}
        width={isMobile ? 70 : 120}
        height={isMobile ? 35 : 45}
        variant="secondary"
        onClick={onReturnToMenu}
        data-testid="return-menu-button"
      />

      {isPaused && (
        <ResponsivePixiContainer x={0} y={0} data-testid="pause-overlay">
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
              g.rect(0, 0, width, height);
              g.fill();
            }}
          />
          <pixiText
            text="일시 정지"
            style={{
              fontSize: isMobile ? 32 : 48,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
              align: "center",
            }}
            x={width / 2}
            y={height / 2 - 30}
            anchor={0.5}
          />
          <pixiText
            text="PAUSED"
            style={{
              fontSize: isMobile ? 16 : 24,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "center",
            }}
            x={width / 2}
            y={height / 2 + 20}
            anchor={0.5}
          />
        </ResponsivePixiContainer>
      )}
    </ResponsivePixiContainer>
  );
};

export default CombatScreen;
