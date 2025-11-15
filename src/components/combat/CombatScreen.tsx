import { HitEffect, PlayerState } from "@/systems";
import { CombatSystem } from "@/systems/CombatSystem";
import { GameMode, PlayerArchetype, Position } from "@/types";
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
import { calculateDistance } from "../../utils/mathUtils";
import { extendPixiComponents } from "../../utils/pixiExtensions";
import { createPlayerFromArchetype } from "../../utils/playerUtils";
import { DojangBackground } from "../game/DojangBackground";
import { CombatArena } from "./components/CombatArena";
import { CombatControls } from "./components/CombatControls";
import { CombatFooter } from "./components/CombatFooter";
import { CombatHUD } from "./components/CombatHUD";
import { CombatStatsPanel } from "./components/CombatStatsPanel";
import { PauseOverlay } from "./components/PauseOverlay";
import { useCombatLayout } from "./hooks/useCombatLayout";
import { useAICombat } from "./hooks/useAICombat";

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
  const [comboCount, setComboCount] = useState(0);
  const [lastHitTime, setLastHitTime] = useState(0);
  const [screenShake, setScreenShake] = useState({ x: 0, y: 0 });

  // Match timing
  const matchStartTimeRef = useRef(Date.now());

  // Combat system
  const combatSystem = useMemo(() => new CombatSystem(), []);

  // Use optimized layout hook
  const { isMobile, layoutConstants, arenaBounds } = useCombatLayout(
    width,
    height
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
    setPlayerPositions((prev) => [playerPosition, prev[1]]);
    onPlayerUpdate(0, { position: playerPosition });
  }, [playerPosition, onPlayerUpdate]);

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

  // ✅ FIXED: Enhanced combat system integration with proper hit effects and combo tracking
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

    addHitEffect(effectType, playerPosition, result.hit ? 1 : 0.5);

    if (result.hit) {
      // Combo tracking: reset combo if too much time passed
      const now = Date.now();
      const timeSinceLastHit = now - lastHitTime;
      const newCombo = timeSinceLastHit < 2000 ? comboCount + 1 : 1;
      setComboCount(newCombo);
      setLastHitTime(now);

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
      } else if (newCombo > 2) {
        addCombatMessage(`${newCombo} 연속 공격!`, `${newCombo} Hit Combo!`);
      } else {
        addCombatMessage("공격 성공!", "Attack Hit!");
      }
    } else {
      // Reset combo on miss
      setComboCount(0);
      addCombatMessage("공격 빗나감", "Attack Missed");
    }

    setTimeout(() => setIsExecutingTechnique(false), 500);
  }, [
    playerPosition,
    onPlayerUpdate,
    validPlayers,
    isExecutingTechnique,
    addCombatMessage,
    combatSystem,
    roundStarted,
    roundEnded,
    addHitEffect,
    comboCount,
    lastHitTime,
  ]);

  // Handle defend with Korean feedback
  const handleDefend = useCallback(() => {
    if (!roundStarted || roundEnded) return;

    onPlayerUpdate(0, { isBlocking: true });
    addCombatMessage("방어 자세", "Defensive Stance");

    // Add defensive effect
    addHitEffect(HitEffectType.BLOCK, playerPosition, 0.8);

    setTimeout(() => {
      onPlayerUpdate(0, { isBlocking: false });
    }, 1000);
  }, [
    onPlayerUpdate,
    addCombatMessage,
    roundStarted,
    roundEnded,
    addHitEffect,
    playerPosition,
  ]);

  // ✅ FIXED: Handle technique execution with proper effects and screen shake
  const handleTechniqueExecute = useCallback(() => {
    if (isExecutingTechnique || !roundStarted || roundEnded) return;
    if (validPlayers[0].ki < 10 || validPlayers[0].stamina < 15) {
      addCombatMessage("기력/체력 부족", "Insufficient Ki/Stamina");
      return;
    }

    setIsExecutingTechnique(true);

    // Add technique effect
    addHitEffect(HitEffectType.CRITICAL_HIT, playerPosition, 1.5);

    // Screen shake effect for impact
    const shakeIntensity = 8;
    const shakeFrames = [
      { x: shakeIntensity, y: -shakeIntensity * 0.5 },
      { x: -shakeIntensity * 0.7, y: shakeIntensity * 0.8 },
      { x: shakeIntensity * 0.5, y: shakeIntensity * 0.3 },
      { x: -shakeIntensity * 0.3, y: -shakeIntensity * 0.6 },
      { x: 0, y: 0 },
    ];

    shakeFrames.forEach((shake, index) => {
      setTimeout(() => setScreenShake(shake), index * 50);
    });

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
    playerPosition,
    playerPositions,
    onPlayerUpdate,
    validPlayers,
    isExecutingTechnique,
    addCombatMessage,
    roundStarted,
    roundEnded,
    addHitEffect,
  ]);

  // Handle stance switch with Korean feedback
  const handleStanceSwitch = useCallback(
    (stance: any) => {
      if (!roundStarted || roundEnded) return;

      onPlayerUpdate(0, { currentStance: stance });
      addCombatMessage(`자세 변경: ${stance}`, `Stance Change: ${stance}`);

      // Add stance change effect
      addHitEffect(HitEffectType.STATUS_EFFECT, playerPosition, 0.6);
    },
    [
      onPlayerUpdate,
      addCombatMessage,
      roundStarted,
      roundEnded,
      addHitEffect,
      playerPosition,
    ]
  );

  // Memoized AI callbacks to prevent interval recreation
  const aiCallbacks = useMemo(
    () => ({
      onAttack: () => {
        addHitEffect(HitEffectType.HIT, playerPositions[1], 1);

        const distance = calculateDistance(playerPositions[0], playerPositions[1]);

        if (distance < 120) {
          const damage = 10 + Math.random() * 15;
          onPlayerUpdate(0, {
            health: Math.max(0, validPlayers[0].health - damage),
            hitsTaken: validPlayers[0].hitsTaken + 1,
          });
          addCombatMessage("AI 공격 성공!", "AI Attack Hit!");
        } else {
          addCombatMessage("AI 공격 빗나감", "AI Attack Missed");
        }
      },

      onDefend: () => {
        onPlayerUpdate(1, { isBlocking: true });
        addCombatMessage("AI 방어 자세", "AI Defensive Stance");
        addHitEffect(HitEffectType.BLOCK, playerPositions[1], 0.8);

        setTimeout(() => {
          onPlayerUpdate(1, { isBlocking: false });
        }, 1000);
      },

      onTechnique: () => {
        if (validPlayers[1].ki < 10 || validPlayers[1].stamina < 15) {
          // Fallback to basic attack
          addHitEffect(HitEffectType.HIT, playerPositions[1], 1);
          const distance = calculateDistance(playerPositions[0], playerPositions[1]);
          if (distance < 120) {
            const damage = 10 + Math.random() * 15;
            onPlayerUpdate(0, {
              health: Math.max(0, validPlayers[0].health - damage),
              hitsTaken: validPlayers[0].hitsTaken + 1,
            });
            addCombatMessage("AI 공격 성공!", "AI Attack Hit!");
          }
          return;
        }

        addHitEffect(HitEffectType.CRITICAL_HIT, playerPositions[1], 1.5);

        const distance = calculateDistance(playerPositions[0], playerPositions[1]);

        if (distance < 150) {
          const damage = 20 + Math.random() * 20;
          onPlayerUpdate(0, {
            health: Math.max(0, validPlayers[0].health - damage),
            hitsTaken: validPlayers[0].hitsTaken + 1,
          });
          addCombatMessage("AI 특수 기술!", "AI Special Technique!");
        }

        onPlayerUpdate(1, {
          ki: Math.max(0, validPlayers[1].ki - 10),
          stamina: Math.max(0, validPlayers[1].stamina - 15),
        });
      },

      onMove: (targetPos: Position) => {
        const currentPos = playerPositions[1];
        const speed = 4;

        const dx = targetPos.x - currentPos.x;
        const dy = targetPos.y - currentPos.y;
        const distance = calculateDistance(currentPos, targetPos);

        if (distance > 5) {
          const newPos = {
            x: currentPos.x + (dx / distance) * speed,
            y: currentPos.y + (dy / distance) * speed,
          };

          // Keep AI within bounds
          newPos.x = Math.max(
            arenaBounds.x,
            Math.min(arenaBounds.x + arenaBounds.width - 60, newPos.x)
          );
          newPos.y = Math.max(
            arenaBounds.y,
            Math.min(arenaBounds.y + arenaBounds.height - 180, newPos.y)
          );

          setPlayerPositions((prev) => [prev[0], newPos]);
          onPlayerUpdate(1, { position: newPos });
        }
      },
    }),
    [playerPositions, validPlayers, onPlayerUpdate, addCombatMessage, addHitEffect, arenaBounds]
  );

  // AI Combat System - Using extracted hook with memoized callbacks
  useAICombat(
    !isPaused && roundStarted && !roundEnded,
    [playerPositions[0], playerPositions[1]],
    validPlayers,
    arenaBounds,
    aiCallbacks
  );

  // Force position updates to sync properly
  useEffect(() => {
    setPlayerPositions((prev) => [playerPosition, prev[1]]);
    onPlayerUpdate(0, { position: playerPosition });
  }, [playerPosition, onPlayerUpdate]);

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
      if (playerIndex === 0 && isMoving) return "walk";

      return "idle";
    },
    [validPlayers, isExecutingTechnique, isMoving]
  );

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
        x={screenShake.x}
        y={screenShake.y}
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
            healthBarHeight={layoutConstants.healthBarHeight}
            x={0}
            y={0}
          />
        </pixiContainer>

        {/* Combat Arena Area - Extracted to component for performance */}
        <CombatArena
          players={validPlayers}
          playerPositions={[playerPositions[0], playerPositions[1]]}
          hitEffects={hitEffects}
          comboCount={comboCount}
          roundDisplayStatus={roundDisplayStatus}
          currentRound={currentRound}
          width={width}
          height={height}
          arenaHeight={
            height -
            layoutConstants.hudHeight -
            layoutConstants.controlsHeight -
            layoutConstants.footerHeight -
            layoutConstants.padding * 2
          }
          isMobile={isMobile}
          getPlayerAnimationState={getPlayerAnimationState}
          onEffectComplete={handleEffectComplete}
          onRoundAnimationComplete={() => setRoundDisplayStatus(null)}
        />

        {/* Bottom UI Area: Contains controls and stats */}
        <pixiContainer
          layout={{
            width: "100%",
            height: layoutConstants.controlsHeight + layoutConstants.footerHeight,
            flexDirection: "column",
            flexShrink: 0,
            gap: 5,
          }}
        >
          {/* Controls and Stats Row */}
          <pixiContainer
            layout={{
              width: "100%",
              height: layoutConstants.controlsHeight,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              paddingLeft: 10,
              paddingRight: 10,
              flexShrink: 0,
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
              height={isMobile ? 120 : 140}
              x={0}
              y={0}
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
              height={isMobile ? 120 : 140}
              x={0}
              y={0}
            />
          </pixiContainer>

          {/* Footer Area: Fixed height for instructions and menu button */}
          <pixiContainer
            layout={{
              width: "100%",
              height: layoutConstants.footerHeight,
              flexShrink: 0,
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
      </pixiContainer>

      {/* Pause Overlay - Centered on the whole screen */}
      {isPaused && <PauseOverlay isMobile={isMobile} />}
    </pixiContainer>
  );
};

export default CombatScreen;
