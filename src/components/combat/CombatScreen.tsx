import { HitEffect, PlayerState } from "@/systems";
import { CombatSystem } from "@/systems/CombatSystem";
import { GameMode, PlayerArchetype, Position, TrigramStance } from "@/types";
import "@pixi/layout";
import { LayoutContainer } from "@pixi/layout/components";
import "@pixi/layout/react";
import { extend } from "@pixi/react";
import { Container } from "pixi.js";
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

// Register custom components for use as JSX tags in @pixi/react
extend({
  Container,
  LayoutContainer,
});

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
  const [roundDisplayStatus, setRoundDisplayStatus] = useState<
    "start" | "fight" | "ko" | "end" | null
  >(null);

  // Match timing
  const matchStartTimeRef = useRef(Date.now());

  // Combat system
  const combatSystem = useMemo(() => new CombatSystem(), []);

  // Fixed player positions for 2-player combat
  const [playerPositions, setPlayerPositions] = useState<Position[]>([
    { x: width * 0.3, y: height * 0.6 }, // Player 1 - moved more inward and up
    { x: width * 0.7, y: height * 0.6 }, // Player 2 - moved more inward and up
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

  // Responsive layout detection
  const isMobile = useMemo(() => width < 768, [width]);

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

  // ✅ FIXED: Properly handle hit effect completion
  const handleEffectComplete = useCallback((effectId: string) => {
    setHitEffects((prev) => prev.filter((effect) => effect.id !== effectId));
  }, []);

  // ✅ FIXED: Create hit effect with proper integration
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

  // ✅ FIXED: Add hit effect helper with proper usage
  const addHitEffect = useCallback(
    (type: HitEffectType, position: Position, intensity: number = 1) => {
      const effect = createHitEffect(
        `effect_${Date.now()}`,
        type,
        position,
        intensity
      );
      setHitEffects((prev) => [...prev, effect]);

      // Auto-remove effect after duration
      setTimeout(() => {
        handleEffectComplete(effect.id);
      }, effect.duration);
    },
    [createHitEffect, handleEffectComplete]
  );

  // Update player 1 position based on movement
  useEffect(() => {
    setPlayerPositions((prev) => [player1Movement.position, prev[1]]);
    onPlayerUpdate(0, { position: player1Movement.position });
  }, [player1Movement.position, onPlayerUpdate]);

  // Round Management
  useEffect(() => {
    if (isPaused) return;

    if (timeRemaining <= 0 && !roundEnded) {
      setRoundEnded(true);
      setRoundStarted(false);
      setRoundDisplayStatus("end");

      // Determine winner by health
      const winner = validPlayers[0].health > validPlayers[1].health ? 0 : 1;
      addCombatMessage("라운드 종료!", "Round Over!");

      setTimeout(() => {
        onGameEnd(winner);
      }, 2500);
    } else if (
      timeRemaining > 0 &&
      !roundStarted &&
      !roundEnded &&
      currentRound > 0
    ) {
      setRoundStarted(true);
      addCombatMessage("라운드 시작!", "Round Start!");

      setRoundDisplayStatus("start");
      const fightTimer = setTimeout(() => setRoundDisplayStatus("fight"), 1500);

      return () => clearTimeout(fightTimer);
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

  // ✅ FIXED: Enhanced combat system integration with proper hit effects
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

    // ✅ FIXED: Use addHitEffect instead of creating manually
    const effectType = result.hit
      ? result.isCritical
        ? HitEffectType.CRITICAL_HIT
        : HitEffectType.HIT
      : HitEffectType.MISS;

    addHitEffect(effectType, player1Movement.position, result.hit ? 1 : 0.5);

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
    player1Movement.position,
    onPlayerUpdate,
    validPlayers,
    isExecutingTechnique,
    addCombatMessage,
    combatSystem,
    roundStarted,
    roundEnded,
    addHitEffect, // ✅ Now properly used
  ]);

  // Handle defend with Korean feedback
  const handleDefend = useCallback(() => {
    if (!roundStarted || roundEnded) return;

    onPlayerUpdate(0, { isBlocking: true });
    addCombatMessage("방어 자세", "Defensive Stance");

    // Add defensive effect
    addHitEffect(HitEffectType.BLOCK, player1Movement.position, 0.8);

    setTimeout(() => {
      onPlayerUpdate(0, { isBlocking: false });
    }, 1000);
  }, [
    onPlayerUpdate,
    addCombatMessage,
    roundStarted,
    roundEnded,
    addHitEffect,
    player1Movement.position,
  ]);

  // ✅ FIXED: Handle technique execution with proper effects
  const handleTechniqueExecute = useCallback(() => {
    if (isExecutingTechnique || !roundStarted || roundEnded) return;
    if (validPlayers[0].ki < 10 || validPlayers[0].stamina < 15) {
      addCombatMessage("기력/체력 부족", "Insufficient Ki/Stamina");
      return;
    }

    setIsExecutingTechnique(true);

    // Add technique effect
    addHitEffect(HitEffectType.CRITICAL_HIT, player1Movement.position, 1.5);

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
    player1Movement.position,
    playerPositions,
    onPlayerUpdate,
    validPlayers,
    isExecutingTechnique,
    addCombatMessage,
    roundStarted,
    roundEnded,
    addHitEffect, // ✅ Now properly used
  ]);

  // Handle stance switch with Korean feedback
  const handleStanceSwitch = useCallback(
    (stance: any) => {
      if (!roundStarted || roundEnded) return;

      onPlayerUpdate(0, { currentStance: stance });
      addCombatMessage(`자세 변경: ${stance}`, `Stance Change: ${stance}`);

      // Add stance change effect
      addHitEffect(HitEffectType.STATUS_EFFECT, player1Movement.position, 0.6);
    },
    [
      onPlayerUpdate,
      addCombatMessage,
      roundStarted,
      roundEnded,
      addHitEffect,
      player1Movement.position,
    ]
  );

  // ✅ FIXED: AI combat handlers with proper effect integration
  const handleAIAttack = useCallback(() => {
    addHitEffect(HitEffectType.HIT, playerPositions[1], 1);

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
    addCombatMessage,
    addHitEffect, // ✅ Now properly used
  ]);

  const handleAIDefend = useCallback(() => {
    onPlayerUpdate(1, { isBlocking: true });
    addCombatMessage("AI 방어 자세", "AI Defensive Stance");

    // Add AI defensive effect
    addHitEffect(HitEffectType.BLOCK, playerPositions[1], 0.8);

    setTimeout(() => {
      onPlayerUpdate(1, { isBlocking: false });
    }, 1000);
  }, [onPlayerUpdate, addCombatMessage, addHitEffect, playerPositions]);

  const handleAITechnique = useCallback(() => {
    if (validPlayers[1].ki < 10 || validPlayers[1].stamina < 15) {
      handleAIAttack(); // Fallback to basic attack
      return;
    }

    addHitEffect(HitEffectType.CRITICAL_HIT, playerPositions[1], 1.5);

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
    addCombatMessage,
    handleAIAttack,
    addHitEffect, // ✅ Now properly used
  ]);

  const moveAIPlayer = useCallback(
    (targetPos: Position) => {
      const currentPos = playerPositions[1];
      const speed = 2;

      const dx = targetPos.x - currentPos.x;
      const dy = targetPos.y - currentPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) {
        const newPos = {
          x: currentPos.x + (dx / distance) * speed,
          y: currentPos.y + (dy / distance) * speed,
        };

        // Keep AI within safer bounds - more margin from edges
        newPos.x = Math.max(width * 0.15, Math.min(width * 0.85, newPos.x));
        newPos.y = Math.max(height * 0.25, Math.min(height * 0.75, newPos.y));

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

  // Check game end conditions
  const checkGameEnd = useCallback(() => {
    if (roundEnded) return;

    const p1Defeated = validPlayers[0].health <= 0;
    const p2Defeated = validPlayers[1].health <= 0;

    if (p1Defeated || p2Defeated) {
      setRoundEnded(true);
      setRoundStarted(false);
      setRoundDisplayStatus("ko");
      const winner = p1Defeated ? 1 : 0;
      addCombatMessage(
        p1Defeated ? "플레이어 1 패배" : "플레이어 1 승리!",
        p1Defeated ? "Player 1 Defeated" : "Player 1 Victory!"
      );
      setTimeout(() => onGameEnd(winner), 2500);
    }
  }, [validPlayers, onGameEnd, addCombatMessage, roundEnded]);

  // Check game end on health changes
  useEffect(() => {
    checkGameEnd();
  }, [validPlayers[0].health, validPlayers[1].health, checkGameEnd]);

  // Calculate match duration
  const matchDuration = useMemo(
    () => Math.floor((Date.now() - matchStartTimeRef.current) / 1000),
    []
  );

  // Get player animation state
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

  // Centralized layout constants for easier tweaking
  const layoutConstants = {
    padding: 10,
    hudHeight: 120,
    controlsHeight: 100,
    footerHeight: 40,
  };

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
      {/* Dojang Background Layer - Stays in the back */}
      <DojangBackground
        width={width}
        height={height}
        lighting="cyberpunk"
        animate={true}
      />

      {/* Main Combat Layout: A vertical flex container for all UI */}
      <pixiContainer
        layout={{
          width,
          height,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between", // Pushes content to top and bottom
          padding: layoutConstants.padding,
        }}
      >
        {/* Top HUD Area: Fixed height */}
        <pixiContainer
          layout={{
            width: "100%",
            height: layoutConstants.hudHeight,
            alignItems: "flex-start", // Align items to the top of the container
            justifyContent: "center",
            flexShrink: 0, // Prevents this container from shrinking
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

        {/* Combat Arena Area: Flexible height, fills remaining space */}
        <pixiContainer
          data-testid="combat-arena"
          layout={{
            width: "100%",
            flexGrow: 1, // Allows this container to take up available vertical space
            position: "relative", // For absolute positioning of players and effects
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Player 1 Visuals */}
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
            onPlayerClick={() => console.log("Player 1 clicked")}
            animationState={getPlayerAnimationState(0)}
            data-testid="combat-player-1"
          />

          {/* Player 2 Visuals */}
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
            onPlayerClick={() => console.log("Player 2 clicked")}
            animationState={getPlayerAnimationState(1)}
            data-testid="combat-player-2"
          />

          {/* Hit Effects Layer */}
          <HitEffectsLayer
            effects={hitEffects}
            onEffectComplete={handleEffectComplete}
          />

          {/* Round Status Display */}
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

        {/* Bottom UI Area: Contains controls and stats */}
        <pixiContainer
          layout={{
            width: "100%",
            height: layoutConstants.controlsHeight,
            flexDirection: "row",
            alignItems: "flex-end", // Align to the bottom of the container
            justifyContent: "space-between",
            gap: 20,
            flexShrink: 0,
            paddingBottom: layoutConstants.footerHeight + 10, // Add padding to not overlap with footer
          }}
        >
          <CombatControls
            onAttack={handleAttack}
            onDefend={handleDefend}
            onSwitchStance={handleStanceSwitch}
            onTechniqueExecute={handleTechniqueExecute}
            player={validPlayers[0]}
            isExecutingTechnique={isExecutingTechnique}
            width={isMobile ? width * 0.45 : 400}
            height={isMobile ? 90 : 120}
          />
          <CombatStatsPanel
            players={validPlayers}
            combatLog={combatMessages.map((msg, index) => ({
              id: `msg-${index}`,
              timestamp: Date.now() - index * 1000,
              korean: msg.split(" | ")[0] || msg,
              english: msg.split(" | ")[1] || msg,
              type: msg.includes("공격")
                ? "attack"
                : msg.includes("방어")
                ? "defend"
                : msg.includes("기술")
                ? "technique"
                : "info",
            }))}
            matchDuration={matchDuration}
            totalDamageDealt={{
              player1: validPlayers[0].totalDamageDealt || 0,
              player2: validPlayers[1].totalDamageDealt || 0,
            }}
            criticalHits={{
              player1: Math.floor((validPlayers[0].totalDamageDealt || 0) / 50),
              player2: Math.floor((validPlayers[1].totalDamageDealt || 0) / 50),
            }}
            perfectStrikes={{
              player1: validPlayers[0].perfectStrikes || 0,
              player2: validPlayers[1].perfectStrikes || 0,
            }}
            width={isMobile ? width * 0.45 : 400}
            height={isMobile ? 90 : 120}
          />
        </pixiContainer>

        {/* Footer Area: Fixed height for instructions and menu button */}
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
            isMobile={isMobile}
            width={width}
            height={layoutConstants.footerHeight}
          />
        </pixiContainer>
      </pixiContainer>

      {/* Pause Overlay - Centered on the whole screen */}
      {isPaused && <PauseOverlay isMobile={isMobile} />}
    </pixiContainer>
  );
};

export default CombatScreen;
