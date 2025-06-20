import { Position } from "@/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { CombatScreenProps } from "../../types/components";
import { KOREAN_COLORS } from "../../types/constants";
import { HitEffect, HitEffectType } from "../../types/effects";
import { extendPixiComponents } from "../../utils/pixiExtensions";
import { DojangBackground } from "../game";
import { HitEffectsLayer } from "../ui";
import { ResponsivePixiPanel } from "../ui/base/ResponsivePixiComponents";
import {
  CombatArena,
  CombatControls,
  CombatHUD,
  PlayerStatusPanel,
} from "./components";
import CombatStats from "./components/CombatStats";

// Ensure PixiJS components are extended
extendPixiComponents();

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

  // Create hit effect
  const createHitEffect = useCallback(
    (
      id: string,
      type: HitEffectType,
      position: Position,
      intensity: number
    ): HitEffect => ({
      id,
      type,
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

  // Handle attack
  const handleAttack = useCallback(() => {
    const effect = createHitEffect(
      `attack_${Date.now()}`,
      HitEffectType.HIT,
      { x: 400, y: 300 },
      1
    );
    setHitEffects((prev) => [...prev, effect]);
  }, [createHitEffect]);

  // Handle defend
  const handleDefend = useCallback(() => {
    // Defend logic
  }, []);

  // Handle technique execution
  const handleTechniqueExecute = useCallback(() => {
    setIsExecutingTechnique(true);
    setTimeout(() => setIsExecutingTechnique(false), 500);
  }, []);

  // Handle stance switch
  const handleStanceSwitch = useCallback(
    (stance: any) => {
      setIsExecutingTechnique(true);
      onPlayerUpdate(0, { currentStance: stance });
    },
    [onPlayerUpdate]
  );

  // Handle effect completion
  const handleEffectComplete = useCallback((effectId: string) => {
    setHitEffects((prev) => prev.filter((effect) => effect.id !== effectId));
  }, []);

  // Ensure we have valid players
  const validPlayers = useMemo(() => {
    if (players.length < 2) {
      const dummyPlayer = {
        ...players[0],
        id: "dummy_player",
        name: { korean: "더미", english: "Dummy" },
      };
      return [players[0], dummyPlayer];
    }
    return [players[0], players[1]];
  }, [players]);

  // Add hit effect
  const addHitEffect = useCallback(
    (type: HitEffectType, position: Position) => {
      const effect = createHitEffect(`effect_${Date.now()}`, type, position, 1);
      setHitEffects((prev) => [...prev, effect]);
    },
    [createHitEffect]
  );

  // Check game end conditions
  const checkGameEnd = useCallback(() => {
    if (validPlayers[0].health <= 0) {
      onGameEnd(1);
    } else if (validPlayers[1].health <= 0) {
      onGameEnd(0);
    }
  }, [validPlayers, onGameEnd]);

  // Check game end on player health changes
  useEffect(() => {
    checkGameEnd();
  }, [validPlayers[0].health, validPlayers[1].health, checkGameEnd]);

  // Responsive layout
  const { isMobile, isTablet } = useMemo(
    () => ({
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
    }),
    [width]
  );

  // Handle player click
  const handlePlayerClick = (idx: number) => {
    setSelectedPlayer(idx);
    addHitEffect(HitEffectType.HIT, { x: 100 + idx * 200, y: 200 });
  };

  return (
    <pixiContainer x={x} y={y} data-testid="combat-screen">
      {/* Background */}
      <DojangBackground
        width={width}
        height={height}
        lighting="cyberpunk"
        animate={true}
      />

      {/* Grid overlay */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.1 });
          const patternSize = isMobile ? 100 : isTablet ? 125 : 150;
          const circleSize = isMobile ? 25 : isTablet ? 32 : 40;

          for (let x = 0; x < width; x += patternSize) {
            for (let y = 0; y < height; y += patternSize) {
              g.circle(x + patternSize / 2, y + patternSize / 2, circleSize);
              g.stroke();
            }
          }
        }}
      />

      <CombatArena
        players={validPlayers}
        width={width}
        height={height * (isMobile ? 0.65 : 0.75)}
        y={height * (isMobile ? 0.2 : 0.15)}
        onPlayerClick={handlePlayerClick}
      />

      <CombatHUD
        player1={validPlayers[0]}
        player2={validPlayers[1]}
        currentRound={currentRound}
        timeRemaining={timeRemaining}
        maxRounds={3}
        isPaused={isPaused}
        width={width}
        height={isMobile ? 80 : 120}
        y={0}
      />

      {/* Player 1 Status Panel */}
      <ResponsivePixiPanel
        title={validPlayers[0].name.korean}
        x={isMobile ? 10 : 20}
        y={height * (isMobile ? 0.15 : 0.2)}
        width={isMobile ? width * 0.4 : 180}
        height={isMobile ? 200 : 300}
        data-testid="player1-status"
        screenWidth={width}
        screenHeight={height}
      >
        <PlayerStatusPanel
          player={validPlayers[0]}
          position="left"
          x={0}
          y={0}
          width={isMobile ? width * 0.4 - 20 : 160}
          height={isMobile ? 180 : 280}
          isSelected={selectedPlayer === 0}
        />
      </ResponsivePixiPanel>

      {/* Player 2 Status Panel */}
      <ResponsivePixiPanel
        title={validPlayers[1].name.korean}
        x={width - (isMobile ? width * 0.4 + 10 : 200)}
        y={height * (isMobile ? 0.15 : 0.2)}
        width={isMobile ? width * 0.4 : 180}
        height={isMobile ? 200 : 300}
        data-testid="player2-status"
        screenWidth={width}
        screenHeight={height}
      >
        <PlayerStatusPanel
          player={validPlayers[1]}
          position="right"
          x={0}
          y={0}
          width={isMobile ? width * 0.4 - 20 : 160}
          height={isMobile ? 180 : 280}
          isSelected={selectedPlayer === 1}
        />
      </ResponsivePixiPanel>

      {/* Combat Stats Panel */}
      <ResponsivePixiPanel
        title="전투 통계"
        x={isMobile ? 10 : width / 2 - 150}
        y={height - (isMobile ? 160 : 180)}
        width={isMobile ? width - 20 : 300}
        height={isMobile ? 100 : 160}
        data-testid="combat-stats-panel"
        screenWidth={width}
        screenHeight={height}
      >
        <CombatStats
          players={validPlayers}
          combatLog={combatLog}
          x={0}
          y={0}
          width={isMobile ? width - 40 : 280}
        />
      </ResponsivePixiPanel>

      {/* Combat Controls */}
      <pixiContainer
        x={isMobile ? 10 : 20}
        y={height - (isMobile ? 50 : 140)}
        data-testid="combat-controls-container"
      >
        <CombatControls
          onAttack={handleAttack}
          onDefend={handleDefend}
          onSwitchStance={handleStanceSwitch}
          player={validPlayers[0]}
          onTechniqueExecute={handleTechniqueExecute}
          isExecutingTechnique={isExecutingTechnique}
          width={isMobile ? width - 20 : 400}
          height={isMobile ? 40 : 120}
          x={0}
          y={0}
        />
      </pixiContainer>

      {/* Hit Effects Layer */}
      <HitEffectsLayer
        effects={hitEffects}
        onEffectComplete={handleEffectComplete}
      />

      {/* Return to Menu Button */}
      <pixiContainer
        x={width - (isMobile ? 80 : 150)}
        y={isMobile ? 10 : 20}
        interactive={true}
        onPointerDown={onReturnToMenu}
        data-testid="return-menu-button"
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_STEEL_GRAY, alpha: 0.8 });
            g.roundRect(0, 0, isMobile ? 70 : 120, isMobile ? 35 : 45, 8);
            g.fill();
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.8,
            });
            g.roundRect(0, 0, isMobile ? 70 : 120, isMobile ? 35 : 45, 8);
            g.stroke();
          }}
        />
        <pixiText
          text="메뉴로"
          style={{
            fontSize: isMobile ? 12 : 16,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
            fontWeight: "bold",
          }}
          x={(isMobile ? 70 : 120) / 2}
          y={(isMobile ? 35 : 45) / 2}
          anchor={0.5}
          data-testid="return-menu-button-text"
        />
      </pixiContainer>

      {/* Pause Overlay */}
      {isPaused && (
        <pixiContainer x={0} y={0} data-testid="pause-overlay">
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
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default CombatScreen;
