import { HitEffect, PlayerState } from "@/systems";
import { GameMode, PlayerArchetype, Position } from "@/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { HitEffectType } from "../../systems/effects";
import { KOREAN_COLORS } from "../../types/constants";
import { usePlayerMovement } from "../../utils/inputSystem";
import { extendPixiComponents } from "../../utils/pixiExtensions";
import { createPlayerFromArchetype } from "../../utils/playerUtils";
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
  const [combatMessages, setCombatMessages] = useState<string[]>([]);

  // Fixed player positions - only 2 players
  const [playerPositions, setPlayerPositions] = useState<Position[]>([
    { x: width * 0.25, y: height * 0.7 }, // Player 1 - left side
    { x: width * 0.75, y: height * 0.7 }, // Player 2 - right side
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

      // Defend with Shift
      if (isKeyPressed("ShiftLeft")) {
        handleDefend();
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

  // Enhanced bilingual combat messages
  const addCombatMessage = useCallback((korean: string, english: string) => {
    const message = `${korean} | ${english}`;
    setCombatMessages((prev) => [message, ...prev.slice(0, 4)]);
  }, []);

  // Ensure exactly 2 players with complete PlayerState objects
  const validPlayers = useMemo((): [PlayerState, PlayerState] => {
    if (players.length === 0) {
      // Create default players using the utility function
      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      return [
        {
          ...player1,
          position: playerPositions[0],
        },
        {
          ...player2,
          position: playerPositions[1],
        },
      ];
    }

    // Use existing players but ensure complete PlayerState
    const player1 = players[0];
    const player2 = players[1] || createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

    return [
      {
        ...player1,
        position: playerPositions[0],
      },
      {
        ...player2,
        position: playerPositions[1],
      },
    ];
  }, [players, playerPositions]);

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

    if (distance < 120) {
      // Attack hits
      onPlayerUpdate(1, {
        health: Math.max(0, validPlayers[1].health - 15),
        hitsTaken: validPlayers[1].hitsTaken + 1,
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
    validPlayers,
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

    if (distance < 150) {
      onPlayerUpdate(1, {
        health: Math.max(0, validPlayers[1].health - 25),
        hitsTaken: validPlayers[1].hitsTaken + 1,
      });
      addCombatMessage("특수 기술 성공!", "Special Technique Hit!");
    } else {
      addCombatMessage("기술 실패", "Technique Failed");
    }

    // Consume resources
    onPlayerUpdate(0, {
      ki: Math.max(0, validPlayers[0].ki - 10),
      stamina: Math.max(0, validPlayers[0].stamina - 15),
    });

    setTimeout(() => setIsExecutingTechnique(false), 800);
  }, [
    createHitEffect,
    player1Movement.position,
    playerPositions,
    onPlayerUpdate,
    validPlayers,
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
      addHitEffect(HitEffectType.HIT, playerPositions[idx]);
      addCombatMessage(
        `플레이어 ${idx + 1} 선택됨`,
        `Player ${idx + 1} Selected`
      );
    },
    [addHitEffect, playerPositions, addCombatMessage]
  );

  // Get proper animation state
  const getPlayerAnimationState = useCallback(
    (playerIndex: number) => {
      const player = validPlayers[playerIndex];

      if (player.health <= 0) return "defeat";
      if (player.isBlocking) return "defend";
      if (isExecutingTechnique && playerIndex === 0) return "technique_execute";
      if (playerIndex === 0 && player1Movement.isMoving) return "walk";

      return "idle";
    },
    [validPlayers, isExecutingTechnique, player1Movement.isMoving]
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

      {/* Enhanced Movement Instructions - Korean + English */}
      <pixiContainer x={10} y={height - 30} data-testid="movement-instructions">
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
            g.roundRect(0, 0, width - 20, 25, 5);
            g.fill();
          }}
        />
        <pixiText
          text="조작법 | Controls: 이동 ↑↓←→ | 공격 Space | 방어 Shift | Movement ↑↓←→ | Attack Space | Defend Shift"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontFamily: "Noto Sans KR",
          }}
          x={10}
          y={12}
          anchor={{ x: 0, y: 0.5 }}
        />
      </pixiContainer>

      {/* Combat HUD with enhanced Korean/English support */}
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

      {/* Combat Stats Panel with bilingual support */}
      <CombatStatsPanel
        players={validPlayers}
        combatLog={combatMessages}
        x={width - 300}
        y={height - 180}
        width={280}
        height={160}
      />

      {/* Combat Controls with Korean/English labels */}
      <CombatControls
        onAttack={handleAttack}
        onDefend={handleDefend}
        onSwitchStance={handleStanceSwitch}
        onTechniqueExecute={handleTechniqueExecute}
        player={validPlayers[0]}
        isExecutingTechnique={isExecutingTechnique}
        x={20}
        y={height - 160}
        width={isMobile ? 300 : 400}
        height={140}
      />

      {/* Hit Effects Layer */}
      <HitEffectsLayer
        effects={hitEffects}
        onEffectComplete={handleEffectComplete}
      />

      {/* Enhanced Pause Overlay with Korean/English */}
      {isPaused && (
        <pixiContainer x={width / 2} y={height / 2} data-testid="pause-overlay">
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
              g.roundRect(-200, -80, 400, 160, 10);
              g.fill();
              g.stroke({
                width: 3,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.8,
              });
              g.roundRect(-200, -80, 400, 160, 10);
              g.stroke();
            }}
          />
          <pixiText
            text="일시정지"
            style={{
              fontSize: 32,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
              align: "center",
              fontFamily: "Noto Sans KR",
            }}
            anchor={0.5}
            y={-20}
          />
          <pixiText
            text="PAUSED"
            style={{
              fontSize: 24,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              fontWeight: "bold",
              align: "center",
            }}
            anchor={0.5}
            y={10}
          />
          <pixiText
            text="아무 키나 눌러서 계속 | Press any key to continue"
            style={{
              fontSize: 14,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "center",
              fontFamily: "Noto Sans KR",
            }}
            y={45}
            anchor={0.5}
          />
        </pixiContainer>
      )}

      {/* Enhanced Return to Menu Button with Korean/English */}
      <pixiContainer x={20} y={20} data-testid="return-menu-button">
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.9 });
            g.roundRect(0, 0, 140, 50, 8);
            g.fill();
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.8,
            });
            g.roundRect(0, 0, 140, 50, 8);
            g.stroke();
          }}
          interactive={true}
          onPointerDown={onReturnToMenu}
        />
        <pixiText
          text="메뉴로 돌아가기"
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
            align: "center",
            fontFamily: "Noto Sans KR",
          }}
          x={70}
          y={15}
          anchor={0.5}
        />
        <pixiText
          text="Return to Menu"
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
            fontStyle: "italic",
          }}
          x={70}
          y={35}
          anchor={0.5}
        />
      </pixiContainer>

      {/* ONLY 2 PLAYERS - Player 1 Visual (Left) */}
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
        showKoreanLabels={true}
        interactive={true}
        onPlayerClick={() => handlePlayerClick(0)}
        animationState={getPlayerAnimationState(0)}
        data-testid="combat-player-1"
      />

      {/* ONLY 2 PLAYERS - Player 2 Visual (Right) */}
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
        showKoreanLabels={true}
        interactive={true}
        onPlayerClick={() => handlePlayerClick(1)}
        animationState={getPlayerAnimationState(1)}
        data-testid="combat-player-2"
      />

      {/* Combat Arena Center Marker */}
      <pixiContainer x={width / 2} y={height * 0.7} data-testid="arena-center">
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.3,
            });
            g.circle(0, 0, 50);
            g.moveTo(-50, 0);
            g.lineTo(50, 0);
            g.moveTo(0, -50);
            g.lineTo(0, 50);
            g.stroke();
          }}
        />
        <pixiText
          text="중앙 | Center"
          style={{
            fontSize: 8,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
            align: "center",
            fontFamily: "Noto Sans KR",
          }}
          anchor={0.5}
          y={60}
        />
      </pixiContainer>

      {/* Combat Distance Indicator */}
      <pixiContainer x={width / 2} y={50} data-testid="distance-indicator">
        <pixiText
          text={`거리 | Distance: ${Math.round(
            Math.sqrt(
              Math.pow(playerPositions[0].x - playerPositions[1].x, 2) +
                Math.pow(playerPositions[0].y - playerPositions[1].y, 2)
            )
          )}px`}
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
            fontFamily: "Noto Sans KR",
          }}
          anchor={0.5}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default CombatScreen;
