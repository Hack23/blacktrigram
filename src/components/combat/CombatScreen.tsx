import { HitEffect, PlayerState } from "@/systems";
import { GameMode, Position } from "@/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { HitEffectType } from "../../systems/effects";
import { KOREAN_COLORS } from "../../types/constants";
import { usePlayerMovement } from "../../utils/inputSystem";
import { extendPixiComponents } from "../../utils/pixiExtensions";
import { DojangBackground } from "../game/DojangBackground";
import { GameEngine } from "../game/GameEngine";
import { HitEffectsLayer } from "../ui/HitEffectsLayer";
import { PlayerVisuals } from "../ui/PlayerVisuals";
import { CombatControls } from "./components/CombatControls";
import { CombatHUD } from "./components/CombatHUD";
import { CombatStatsPanel } from "./components/CombatStatsPanel";

// Ensure PixiJS components are extended
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
  const [combatMessages, setCombatMessages] = useState<string[]>([]); // Korean + English messages
  const [playerPositions, setPlayerPositions] = useState<Position[]>([
    { x: width * 0.3, y: height * 0.6 },
    { x: width * 0.7, y: height * 0.6 },
  ]);

  // Player 1 movement system
  const { movementState: player1Movement, isKeyPressed } = usePlayerMovement(
    playerPositions[0],
    { width, height }
  );

  // Update player 1 position based on movement
  useEffect(() => {
    setPlayerPositions((prev) => [player1Movement.position, prev[1]]);
    onPlayerUpdate(0, { position: player1Movement.position });
  }, [player1Movement.position, onPlayerUpdate]);

  // Combat input handling
  useEffect(() => {
    const handleCombatInput = () => {
      if (isPaused) return;

      // Attack with Space or Ctrl
      if (isKeyPressed("Space") || isKeyPressed("ControlLeft")) {
        handleAttack();
      }
    };

    const interval = setInterval(handleCombatInput, 100);
    return () => clearInterval(interval);
  }, [isKeyPressed, isPaused]);

  // Create hit effect with Korean/English feedback
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

  // Add combat message in Korean and English
  const addCombatMessage = useCallback((korean: string, english: string) => {
    const message = `${korean} | ${english}`;
    setCombatMessages((prev) => [message, ...prev.slice(0, 4)]);
  }, []);

  // Handle attack with Korean feedback
  const handleAttack = useCallback(() => {
    if (isExecutingTechnique) return;

    setIsExecutingTechnique(true);

    const effect = createHitEffect(
      `attack_${Date.now()}`,
      HitEffectType.HIT,
      player1Movement.position,
      1
    );
    setHitEffects((prev) => [...prev, effect]);

    // Calculate distance for hit detection
    const distance = Math.sqrt(
      Math.pow(playerPositions[0].x - playerPositions[1].x, 2) +
        Math.pow(playerPositions[0].y - playerPositions[1].y, 2)
    );

    if (distance < 100) {
      // Attack hits
      onPlayerUpdate(1, {
        health: Math.max(0, players[1].health - 15),
        hitsTaken: players[1].hitsTaken + 1,
      });
      addCombatMessage("공격 성공!", "Attack Hit!");
    } else {
      addCombatMessage("공격 빗나감", "Attack Missed");
    }

    setTimeout(() => setIsExecutingTechnique(false), 500);
  }, [
    createHitEffect,
    player1Movement.position,
    playerPositions,
    onPlayerUpdate,
    players,
    isExecutingTechnique,
    addCombatMessage,
  ]);

  // Handle defend with Korean feedback
  const handleDefend = useCallback(() => {
    onPlayerUpdate(0, { isBlocking: true });
    addCombatMessage("방어 자세", "Defensive Stance");
    setTimeout(() => {
      onPlayerUpdate(0, { isBlocking: false });
    }, 1000);
  }, [onPlayerUpdate, addCombatMessage]);

  // Handle technique execution with Korean feedback
  const handleTechniqueExecute = useCallback(() => {
    if (isExecutingTechnique) return;

    setIsExecutingTechnique(true);

    const effect = createHitEffect(
      `technique_${Date.now()}`,
      HitEffectType.CRITICAL_HIT,
      player1Movement.position,
      1.5
    );
    setHitEffects((prev) => [...prev, effect]);

    const distance = Math.sqrt(
      Math.pow(playerPositions[0].x - playerPositions[1].x, 2) +
        Math.pow(playerPositions[0].y - playerPositions[1].y, 2)
    );

    if (distance < 120) {
      onPlayerUpdate(1, {
        health: Math.max(0, players[1].health - 25),
        hitsTaken: players[1].hitsTaken + 1,
      });
      addCombatMessage("특수 기술 성공!", "Special Technique Hit!");
    } else {
      addCombatMessage("기술 실패", "Technique Failed");
    }

    // Consume resources
    onPlayerUpdate(0, {
      ki: Math.max(0, players[0].ki - 10),
      stamina: Math.max(0, players[0].stamina - 15),
    });

    setTimeout(() => setIsExecutingTechnique(false), 800);
  }, [
    createHitEffect,
    player1Movement.position,
    playerPositions,
    onPlayerUpdate,
    players,
    isExecutingTechnique,
    addCombatMessage,
  ]);

  // Handle stance switch with Korean feedback
  const handleStanceSwitch = useCallback(
    (stance: any) => {
      onPlayerUpdate(0, { currentStance: stance });
      addCombatMessage(`자세 변경: ${stance}`, `Stance Change: ${stance}`);
    },
    [onPlayerUpdate, addCombatMessage]
  );

  // Handle effect completion
  const handleEffectComplete = useCallback((effectId: string) => {
    setHitEffects((prev) => prev.filter((effect) => effect.id !== effectId));
  }, []);

  // Ensure valid players
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

  // Add hit effect helper
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
      addCombatMessage("플레이어 1 패배", "Player 1 Defeated");
      onGameEnd(1);
    } else if (validPlayers[1].health <= 0) {
      addCombatMessage("플레이어 1 승리!", "Player 1 Victory!");
      onGameEnd(0);
    }
  }, [validPlayers, onGameEnd, addCombatMessage]);

  // Check game end on health changes
  useEffect(() => {
    checkGameEnd();
  }, [validPlayers[0].health, validPlayers[1].health, checkGameEnd]);

  // Responsive layout
  const isMobile = useMemo(() => width < 768, [width]);

  // Handle player click
  const handlePlayerClick = useCallback(
    (idx: number) => {
      setSelectedPlayer(idx);
      addHitEffect(HitEffectType.HIT, { x: 100 + idx * 200, y: 200 });
    },
    [addHitEffect]
  );

  // Get proper animation state
  const getPlayerAnimationState = useCallback(
    (playerIndex: number) => {
      const player = validPlayers[playerIndex];

      if (player.health <= 0) return "defeat";
      if (player.isBlocking) return "defend";
      if (isExecutingTechnique && selectedPlayer === playerIndex)
        return "technique_execute";
      if (playerIndex === 0 && player1Movement.isMoving) return "idle"; // Fix: use valid animation state

      return "idle";
    },
    [
      validPlayers,
      isExecutingTechnique,
      selectedPlayer,
      player1Movement.isMoving,
    ]
  );

  return (
    <pixiContainer x={x} y={y} data-testid="combat-screen">
      {/* Dojang Background */}
      <DojangBackground
        width={width}
        height={height}
        lighting="cyberpunk"
        animate={true}
      />

      {/* Game Engine for physics and combat logic */}
      <GameEngine
        width={width}
        height={height}
        player1={validPlayers[0]}
        player2={validPlayers[1]}
        onPlayerUpdate={(playerId, updates) => {
          const playerIndex = playerId === validPlayers[0].id ? 0 : 1;
          onPlayerUpdate(playerIndex, updates);
        }}
      />

      {/* Movement Instructions - Korean + English */}
      <pixiContainer x={10} y={10} data-testid="movement-instructions">
        <pixiText
          text="이동: ↑↓←→ | 공격: Space | 방어: Shift | Movement: ↑↓←→ | Attack: Space | Defend: Shift"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontFamily: "Noto Sans KR",
          }}
        />
      </pixiContainer>

      {/* Combat HUD */}
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

      {/* Combat Stats Panel */}
      <CombatStatsPanel
        players={validPlayers}
        combatLog={combatMessages}
        x={width - 300}
        y={height - 160}
        width={280}
        height={140}
      />

      {/* Combat Controls */}
      <CombatControls
        onAttack={handleAttack}
        onDefend={handleDefend}
        onSwitchStance={handleStanceSwitch}
        onTechniqueExecute={handleTechniqueExecute}
        player={validPlayers[0]}
        isExecutingTechnique={isExecutingTechnique}
        x={20}
        y={height - 140}
        width={isMobile ? 300 : 400}
        height={120}
      />

      {/* Hit Effects Layer */}
      <HitEffectsLayer
        effects={hitEffects}
        onEffectComplete={handleEffectComplete}
      />

      {/* Pause Overlay */}
      {isPaused && (
        <pixiContainer x={width / 2} y={height / 2} data-testid="pause-overlay">
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
              g.rect(-150, -50, 300, 100);
              g.fill();
              g.stroke({
                width: 2,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.8,
              });
              g.rect(-150, -50, 300, 100);
              g.stroke();
            }}
          />
          <pixiText
            text="일시정지 | PAUSED"
            style={{
              fontSize: 24,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
              align: "center",
              fontFamily: "Noto Sans KR",
            }}
            anchor={0.5}
          />
          <pixiText
            text="아무 키나 눌러서 계속 | Press any key to continue"
            style={{
              fontSize: 14,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "center",
              fontFamily: "Noto Sans KR",
            }}
            y={25}
            anchor={0.5}
          />
        </pixiContainer>
      )}

      {/* Return to Menu Button */}
      <pixiContainer x={20} y={20} data-testid="return-menu-button">
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.9 });
            g.roundRect(0, 0, 120, 40, 5);
            g.fill();
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.8,
            });
            g.roundRect(0, 0, 120, 40, 5);
            g.stroke();
          }}
          interactive={true}
          onPointerDown={onReturnToMenu}
        />
        <pixiText
          text="메뉴로 | Menu"
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
            align: "center",
            fontFamily: "Noto Sans KR",
          }}
          x={60}
          y={20}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Player 1 Visual */}
      <PlayerVisuals
        playerState={validPlayers[0]}
        x={playerPositions[0].x}
        y={playerPositions[0].y}
        scale={isMobile ? 0.8 : 1.0}
        renderMode="combat"
        facing="right"
        showDetails={true}
        showVitalPoints={false}
        showKiAura={true}
        interactive={true}
        onPlayerClick={() => handlePlayerClick(0)}
        animationState={getPlayerAnimationState(0)}
        data-testid="combat-player-1"
      />

      {/* Player 2 Visual */}
      <PlayerVisuals
        playerState={validPlayers[1]}
        x={playerPositions[1].x}
        y={playerPositions[1].y}
        scale={isMobile ? 0.8 : 1.0}
        renderMode="combat"
        facing="left"
        showDetails={true}
        showVitalPoints={false}
        showKiAura={true}
        interactive={true}
        onPlayerClick={() => handlePlayerClick(1)}
        animationState={getPlayerAnimationState(1)}
        data-testid="combat-player-2"
      />
    </pixiContainer>
  );
};

export default CombatScreen;
