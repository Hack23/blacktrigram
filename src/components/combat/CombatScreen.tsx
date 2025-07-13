import { HitEffect, PlayerState } from "@/systems";
import { CombatSystem } from "@/systems/CombatSystem";
import { GameMode, PlayerArchetype, Position, TrigramStance } from "@/types";
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
  // Combat state
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([]);
  const [isExecutingTechnique, setIsExecutingTechnique] = useState(false);
  const [combatMessages, setCombatMessages] = useState<string[]>([]);
  const [roundStarted, setRoundStarted] = useState(false);
  const [roundEnded, setRoundEnded] = useState(false);

  // Combat system
  const combatSystem = useMemo(() => new CombatSystem(), []);

  // Fixed player positions for 2-player combat
  const [playerPositions, setPlayerPositions] = useState<Position[]>([
    { x: width * 0.25, y: height * 0.7 }, // Player 1 - left side
    { x: width * 0.75, y: height * 0.7 }, // Player 2 - right side
  ]);

  // AI state for Player 2
  const [aiState, setAiState] = useState({
    nextAction: Date.now() + 1000, // Next AI action time
    actionCooldown: 1500, // AI action frequency
    isMoving: false,
    targetPosition: { x: width * 0.75, y: height * 0.7 },
    aggressionLevel: 0.3, // 0.0 = passive, 1.0 = very aggressive
  });

  // Player 1 movement system
  const { movementState: player1Movement, isKeyPressed } = usePlayerMovement(
    playerPositions[0],
    { width, height }
  );

  // Ensure exactly 2 players with complete PlayerState objects - MOVED UP
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
    const player2 =
      players[1] || createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

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

  // Enhanced bilingual combat messages
  const addCombatMessage = useCallback((korean: string, english: string) => {
    const message = `${korean} | ${english}`;
    setCombatMessages((prev) => [message, ...prev.slice(0, 4)]);
  }, []);

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

  // Update player 1 position based on movement
  useEffect(() => {
    setPlayerPositions((prev) => [player1Movement.position, prev[1]]);
    onPlayerUpdate(0, { position: player1Movement.position });
  }, [player1Movement.position, onPlayerUpdate]);

  // Round Management
  useEffect(() => {
    if (timeRemaining <= 0 && !roundEnded) {
      setRoundEnded(true);
      setRoundStarted(false);

      // Determine winner by health
      const winner = validPlayers[0].health > validPlayers[1].health ? 0 : 1;
      addCombatMessage("라운드 종료!", "Round Over!");

      setTimeout(() => {
        onGameEnd(winner);
      }, 2000);
    } else if (timeRemaining > 25 && !roundStarted) {
      setRoundStarted(true);
      setRoundEnded(false);
      addCombatMessage("라운드 시작!", "Round Start!");
    }
  }, [
    timeRemaining,
    roundEnded,
    roundStarted,
    validPlayers,
    onGameEnd,
    addCombatMessage,
  ]);

  // Enhanced combat system integration
  const handleAttack = useCallback(() => {
    if (isExecutingTechnique || !roundStarted || roundEnded) return;

    setIsExecutingTechnique(true);

    // Create basic attack technique
    const basicAttack = {
      id: "basic_attack",
      name: {
        korean: "기본공격",
        english: "Basic Attack",
        romanized: "gibon_gonggyeok",
      },
      koreanName: "기본공격",
      englishName: "Basic Attack",
      romanized: "gibon_gonggyeok",
      description: { korean: "기본 공격", english: "Basic attack" },
      stance: validPlayers[0].currentStance,
      type: "attack" as const,
      damageType: "physical" as const,
      damage: 15,
      kiCost: 5,
      staminaCost: 8,
      accuracy: 0.8,
      range: 1.0,
      executionTime: 400,
      recoveryTime: 300,
      critChance: 0.1,
      critMultiplier: 1.5,
      effects: [],
    };

    // Use combat system for proper calculation
    const result = combatSystem.resolveAttack(
      validPlayers[0],
      validPlayers[1],
      basicAttack
    );

    const effect = createHitEffect(
      `attack_${Date.now()}`,
      result.hit ? HitEffectType.HIT : HitEffectType.MISS,
      player1Movement.position,
      result.hit ? 1 : 0.5
    );
    setHitEffects((prev) => [...prev, effect]);

    if (result.hit) {
      // Apply damage through combat system
      const { updatedAttacker, updatedDefender } =
        combatSystem.applyCombatResult(
          result,
          validPlayers[0],
          validPlayers[1]
        );

      onPlayerUpdate(0, updatedAttacker);
      onPlayerUpdate(1, updatedDefender);

      if (result.isCritical) {
        addCombatMessage("치명타 공격!", "Critical Hit!");
      } else {
        addCombatMessage("공격 성공!", "Attack Hit!");
      }
    } else {
      addCombatMessage("공격 빗나감", "Attack Missed");
    }

    setTimeout(() => setIsExecutingTechnique(false), 500);
  }, [
    createHitEffect,
    player1Movement.position,
    onPlayerUpdate,
    validPlayers,
    isExecutingTechnique,
    addCombatMessage,
    combatSystem,
    roundStarted,
    roundEnded,
  ]);

  // Handle defend with Korean feedback
  const handleDefend = useCallback(() => {
    if (!roundStarted || roundEnded) return;

    onPlayerUpdate(0, { isBlocking: true });
    addCombatMessage("방어 자세", "Defensive Stance");
    setTimeout(() => {
      onPlayerUpdate(0, { isBlocking: false });
    }, 1000);
  }, [onPlayerUpdate, addCombatMessage, roundStarted, roundEnded]);

  // Handle technique execution with Korean feedback
  const handleTechniqueExecute = useCallback(() => {
    if (isExecutingTechnique || !roundStarted || roundEnded) return;
    if (validPlayers[0].ki < 10 || validPlayers[0].stamina < 15) {
      addCombatMessage("기력/체력 부족", "Insufficient Ki/Stamina");
      return;
    }

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
    roundStarted,
    roundEnded,
  ]);

  // Handle stance switch with Korean feedback
  const handleStanceSwitch = useCallback(
    (stance: any) => {
      if (!roundStarted || roundEnded) return;

      onPlayerUpdate(0, { currentStance: stance });
      addCombatMessage(`자세 변경: ${stance}`, `Stance Change: ${stance}`);
    },
    [onPlayerUpdate, addCombatMessage, roundStarted, roundEnded]
  );

  const handleAIAttack = useCallback(() => {
    const effect = createHitEffect(
      `ai_attack_${Date.now()}`,
      HitEffectType.HIT,
      playerPositions[1],
      1
    );
    setHitEffects((prev) => [...prev, effect]);

    const distance = Math.sqrt(
      Math.pow(playerPositions[0].x - playerPositions[1].x, 2) +
        Math.pow(playerPositions[0].y - playerPositions[1].y, 2)
    );

    if (distance < 120) {
      // AI attack hits
      const damage = 10 + Math.random() * 15;
      onPlayerUpdate(0, {
        health: Math.max(0, validPlayers[0].health - damage),
        hitsTaken: validPlayers[0].hitsTaken + 1,
      });
      addCombatMessage("AI 공격 성공!", "AI Attack Hit!");
    } else {
      addCombatMessage("AI 공격 빗나감", "AI Attack Missed");
    }
  }, [
    playerPositions,
    validPlayers,
    onPlayerUpdate,
    createHitEffect,
    addCombatMessage,
  ]);

  const handleAIDefend = useCallback(() => {
    onPlayerUpdate(1, { isBlocking: true });
    addCombatMessage("AI 방어 자세", "AI Defensive Stance");
    setTimeout(() => {
      onPlayerUpdate(1, { isBlocking: false });
    }, 1000);
  }, [onPlayerUpdate, addCombatMessage]);

  const handleAITechnique = useCallback(() => {
    if (validPlayers[1].ki < 10 || validPlayers[1].stamina < 15) {
      handleAIAttack(); // Fallback to basic attack
      return;
    }

    const effect = createHitEffect(
      `ai_technique_${Date.now()}`,
      HitEffectType.CRITICAL_HIT,
      playerPositions[1],
      1.5
    );
    setHitEffects((prev) => [...prev, effect]);

    const distance = Math.sqrt(
      Math.pow(playerPositions[0].x - playerPositions[1].x, 2) +
        Math.pow(playerPositions[0].y - playerPositions[1].y, 2)
    );

    if (distance < 150) {
      const damage = 20 + Math.random() * 20;
      onPlayerUpdate(0, {
        health: Math.max(0, validPlayers[0].health - damage),
        hitsTaken: validPlayers[0].hitsTaken + 1,
      });
      addCombatMessage("AI 특수 기술!", "AI Special Technique!");
    }

    // Consume AI resources
    onPlayerUpdate(1, {
      ki: Math.max(0, validPlayers[1].ki - 10),
      stamina: Math.max(0, validPlayers[1].stamina - 15),
    });
  }, [
    playerPositions,
    validPlayers,
    onPlayerUpdate,
    createHitEffect,
    addCombatMessage,
    handleAIAttack,
  ]);

  const moveAIPlayer = useCallback(
    (targetPos: Position) => {
      const currentPos = playerPositions[1];
      const speed = 2; // AI movement speed

      const dx = targetPos.x - currentPos.x;
      const dy = targetPos.y - currentPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) {
        const newPos = {
          x: currentPos.x + (dx / distance) * speed,
          y: currentPos.y + (dy / distance) * speed,
        };

        // Keep AI within bounds
        newPos.x = Math.max(50, Math.min(width - 50, newPos.x));
        newPos.y = Math.max(50, Math.min(height - 50, newPos.y));

        setPlayerPositions((prev) => [prev[0], newPos]);
        onPlayerUpdate(1, { position: newPos });
      }
    },
    [playerPositions, width, height, onPlayerUpdate]
  );

  // Execute AI Actions
  const executeAIAction = useCallback(
    (action: string, targetPos: Position) => {
      switch (action) {
        case "attack":
          handleAIAttack();
          break;
        case "defend":
          handleAIDefend();
          break;
        case "technique":
          handleAITechnique();
          break;
        case "approach":
        case "retreat":
        case "circle":
          moveAIPlayer(targetPos);
          break;
      }
    },
    [handleAIAttack, handleAIDefend, handleAITechnique, moveAIPlayer]
  );

  // AI System - Enhanced for Korean martial arts
  useEffect(() => {
    if (isPaused || !roundStarted || roundEnded) return;

    const aiInterval = setInterval(() => {
      const now = Date.now();
      if (now < aiState.nextAction) return;

      const player1Pos = playerPositions[0];
      const player2Pos = playerPositions[1];
      const distanceToPlayer = Math.sqrt(
        Math.pow(player1Pos.x - player2Pos.x, 2) +
          Math.pow(player1Pos.y - player2Pos.y, 2)
      );

      // AI Decision Making
      let aiAction = "idle";
      let newTargetPosition = aiState.targetPosition;

      if (validPlayers[1].health < validPlayers[1].maxHealth * 0.3) {
        // Defensive when low health
        aiAction = "retreat";
        newTargetPosition = {
          x: Math.max(
            width * 0.1,
            player2Pos.x + (player2Pos.x > player1Pos.x ? 50 : -50)
          ),
          y: player2Pos.y,
        };
      } else if (distanceToPlayer < 100) {
        // Close combat
        const random = Math.random();
        if (random < 0.4) {
          aiAction = "attack";
        } else if (random < 0.7) {
          aiAction = "defend";
        } else {
          aiAction = "technique";
        }
      } else if (distanceToPlayer > 200) {
        // Move closer
        aiAction = "approach";
        newTargetPosition = {
          x: player1Pos.x + (Math.random() - 0.5) * 100,
          y: player1Pos.y + (Math.random() - 0.5) * 50,
        };
      } else {
        // Medium distance - tactical movement
        aiAction = "circle";
        const angle = Math.atan2(
          player1Pos.y - player2Pos.y,
          player1Pos.x - player2Pos.x
        );
        newTargetPosition = {
          x: player1Pos.x + Math.cos(angle + Math.PI / 2) * 150,
          y: player1Pos.y + Math.sin(angle + Math.PI / 2) * 150,
        };
      }

      // Execute AI action
      executeAIAction(aiAction, newTargetPosition);

      // Set next action time
      setAiState((prev) => ({
        ...prev,
        nextAction: now + prev.actionCooldown + Math.random() * 500,
        targetPosition: newTargetPosition,
      }));
    }, 100); // Check AI every 100ms

    return () => clearInterval(aiInterval);
  }, [
    isPaused,
    roundStarted,
    roundEnded,
    playerPositions,
    validPlayers,
    aiState.nextAction,
    aiState.actionCooldown,
    aiState.targetPosition,
    width,
    executeAIAction,
  ]);

  // Combat input handling for Player 1
  useEffect(() => {
    const handleCombatInput = () => {
      if (isPaused || !roundStarted || roundEnded) return;

      // Attack with Space or Ctrl
      if (isKeyPressed("Space") || isKeyPressed("ControlLeft")) {
        handleAttack();
      }

      // Defend with Shift
      if (isKeyPressed("ShiftLeft")) {
        handleDefend();
      }

      // Technique with Alt
      if (isKeyPressed("AltLeft")) {
        handleTechniqueExecute();
      }

      // Stance changes with number keys
      for (let i = 1; i <= 8; i++) {
        if (isKeyPressed(`Digit${i}`)) {
          // Map numbers to trigram stances
          const stances = Object.values(TrigramStance);
          if (stances[i - 1]) {
            handleStanceSwitch(stances[i - 1]);
          }
        }
      }
    };

    const interval = setInterval(handleCombatInput, 100);
    return () => clearInterval(interval);
  }, [
    isKeyPressed,
    isPaused,
    roundStarted,
    roundEnded,
    handleAttack,
    handleDefend,
    handleTechniqueExecute,
    handleStanceSwitch,
  ]);

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

      {/* Round Status Messages */}
      {!roundStarted && timeRemaining > 25 && (
        <pixiContainer x={width / 2} y={height / 2} data-testid="round-ready">
          <pixiText
            text="준비하세요!"
            style={{
              fontSize: 36,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
              align: "center",
              fontFamily: "Noto Sans KR",
            }}
            anchor={0.5}
            y={-20}
          />
          <pixiText
            text="GET READY!"
            style={{
              fontSize: 24,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              fontWeight: "bold",
              align: "center",
            }}
            anchor={0.5}
            y={20}
          />
        </pixiContainer>
      )}

      {/* Round End Message */}
      {roundEnded && (
        <pixiContainer x={width / 2} y={height / 2} data-testid="round-end">
          <pixiText
            text="라운드 종료!"
            style={{
              fontSize: 36,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
              align: "center",
              fontFamily: "Noto Sans KR",
            }}
            anchor={0.5}
            y={-20}
          />
          <pixiText
            text="ROUND OVER!"
            style={{
              fontSize: 24,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              fontWeight: "bold",
              align: "center",
            }}
            anchor={0.5}
            y={20}
          />
        </pixiContainer>
      )}

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
          text="조작법 | Controls: 이동 ↑↓←→ | 공격 Space | 방어 Shift | 특수기 Alt | 자세 1-8 | Movement ↑↓←→ | Attack Space | Defend Shift | Technique Alt | Stance 1-8"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontFamily: "Noto Sans KR",
          }}
          x={10}
          y={12}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Return to Menu Button */}
      <pixiContainer x={20} y={20} data-testid="return-menu-button">
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.8 });
            g.roundRect(0, 0, 140, 50, 8);
            g.fill();
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.6,
            });
            g.roundRect(0, 0, 140, 50, 8);
            g.stroke();
          }}
          interactive={true}
          onPointerDown={onReturnToMenu}
          cursor="pointer"
        />
        <pixiText
          text="메뉴로 돌아가기"
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.ACCENT_GOLD,
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
            g.stroke();
          }}
        />
      </pixiContainer>

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
              g.roundRect(-100, -50, 200, 100, 10);
              g.fill();
              g.stroke({
                width: 3,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.8,
              });
              g.roundRect(-100, -50, 200, 100, 10);
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
        x={10}
        y={height - 200}
        width={280}
        height={120}
      />
    </pixiContainer>
  );
};

export default CombatScreen;
