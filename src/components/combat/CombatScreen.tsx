import { HitEffect, PlayerState } from "@/systems";
import { CombatSystem } from "@/systems/CombatSystem";
import {
  AdaptiveDifficulty,
  getPersonalityByArchetype,
} from "@/systems/ai";
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
import { KOREAN_COLORS, FONT_FAMILY } from "../../types/constants";
import { usePlayerMovement } from "../../utils/inputSystem";
import { extendPixiComponents } from "../../utils/pixiExtensions";
import { createPlayerFromArchetype } from "../../utils/playerUtils";
import { DojangBackground } from "../game/DojangBackground";
import { CombatArena } from "./components/CombatArena";
import { CombatControls } from "./components/CombatControls";
import { CombatFooter } from "./components/CombatFooter";
import { CombatHUD } from "./components/CombatHUD";
import { CombatStatsPanel } from "./components/CombatStatsPanel";
import { PauseOverlay } from "./components/PauseOverlay";
import { useAICombat } from "./hooks/useAICombat";
import { useCombatActions } from "./hooks/useCombatActions";
import { useCombatAudio } from "./hooks/useCombatAudio";
import { useCombatLayout } from "./hooks/useCombatLayout";
import { useCombatState } from "./hooks/useCombatState";

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
  // Performance: Add performance marks for profiling (development only)
  if (import.meta.env.DEV) {
    performance.mark('combat-render-start');
  }

  // Optimized layout calculations using custom hook
  const { layoutConstants, arenaBounds, isMobile } = useCombatLayout(width, height);

  // Consolidated state management using useReducer
  const { state: combatState, actions: combatActions } = useCombatState();

  // Combat audio system
  const combatAudio = useCombatAudio();

  // Player positions state (still needed for movement)
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

  // Match timing
  const matchStartTimeRef = useRef(Date.now());

  // Combat system
  const combatSystem = useMemo(() => new CombatSystem(), []);

  const { playerPosition, isMoving } = usePlayerMovement({
    enabled: !isPaused && combatState.roundStarted && !combatState.roundEnded,
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
    combatActions.addCombatMessage(message);
  }, [combatActions]);

  // Initialize AI systems
  const adaptiveDifficulty = useMemo(() => new AdaptiveDifficulty(), []);

  // Persist adaptiveDifficulty metrics between sessions (issue #2529728004)
  useEffect(() => {
    // Load saved metrics on mount
    try {
      const savedMetrics = localStorage.getItem("ai_difficulty_metrics");
      if (savedMetrics) {
        adaptiveDifficulty.importMetrics(savedMetrics);
      }
    } catch (err) {
      // Gracefully handle localStorage errors
      console.warn("Failed to load AI difficulty metrics:", err);
    }
    // Save metrics on unmount
    return () => {
      try {
        const metrics = adaptiveDifficulty.exportMetrics();
        localStorage.setItem("ai_difficulty_metrics", metrics);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'QuotaExceededError') {
          console.warn("AI difficulty metrics: localStorage quota exceeded");
        } else {
          console.warn("Failed to save AI difficulty metrics:", err);
        }
      }
    };
  }, [adaptiveDifficulty]);

  const aiPersonality = useMemo(
    () => getPersonalityByArchetype(validPlayers[1].archetype),
    [validPlayers]
  );

  // AI Stance change handler
  const handleAIStanceChange = useCallback(
    (stance: TrigramStance) => {
      onPlayerUpdate(1, { currentStance: stance });
      addCombatMessage(
        `AI 자세 변경: ${stance}`,
        `AI Stance Change: ${stance}`
      );
    },
    [onPlayerUpdate, addCombatMessage]
  );

  // ✅ FIXED: Properly handle hit effect completion
  const handleEffectComplete = useCallback((effectId: string) => {
    combatActions.removeHitEffect(effectId);
  }, [combatActions]);

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
      combatActions.addHitEffect(effect);

      // Auto-remove effect after duration
      setTimeout(() => {
        handleEffectComplete(effect.id);
      }, effect.duration);
    },
    [createHitEffect, handleEffectComplete, combatActions]
  );

  // Combat action handlers using custom hook
  const {
    handleAttack,
    handleDefend,
    handleTechniqueExecute,
    handleStanceSwitch,
    handleAIAttack,
    handleAIDefend,
    handleAITechnique,
    moveAIPlayer,
  } = useCombatActions({
    validPlayers,
    playerPositions: [playerPositions[0], playerPositions[1]],
    combatState,
    combatActions,
    combatSystem,
    onPlayerUpdate,
    addCombatMessage,
    addHitEffect,
    arenaBounds,
    combatAudio,
  });

  // Update player 1 position based on movement
  useEffect(() => {
    setPlayerPositions((prev) => [playerPosition, prev[1]]);
    onPlayerUpdate(0, { position: playerPosition });
  }, [playerPosition, onPlayerUpdate]);

  // Round Management
  useEffect(() => {
    if (isPaused) return;

    if (timeRemaining <= 0 && !combatState.roundEnded) {
      combatActions.setRoundEnded(true);
      combatActions.setRoundStarted(false);
      combatActions.setRoundDisplayStatus("end");

      // Stop combat music on round end
      combatAudio.stopCombatMusic(1000);

      // Determine winner by health
      const winner = validPlayers[0].health > validPlayers[1].health ? 0 : 1;
      addCombatMessage("라운드 종료!", "Round Over!");

      setTimeout(() => {
        onGameEnd(winner);
      }, 2500);
    } else if (
      timeRemaining > 0 &&
      !combatState.roundStarted &&
      !combatState.roundEnded &&
      currentRound > 0
    ) {
      combatActions.setRoundStarted(true);
      addCombatMessage("라운드 시작!", "Round Start!");

      // Play combat music with fade-in when round starts
      const player = validPlayers[0];
      if (player?.archetype) {
        const playerArchetype = player.archetype.toLowerCase();
        combatAudio.playArchetypeMusic(playerArchetype, 2000);
      } else {
        combatAudio.playCombatMusic(2000);
      }

      combatActions.setRoundDisplayStatus("start");
      const fightTimer = setTimeout(() => combatActions.setRoundDisplayStatus("fight"), 1500);

      return () => clearTimeout(fightTimer);
    }
  }, [
    timeRemaining,
    combatState.roundEnded,
    combatState.roundStarted,
    validPlayers,
    onGameEnd,
    addCombatMessage,
    currentRound,
    isPaused,
    combatActions,
    combatAudio,
  ]);

  // Execute AI Actions
  const executeAIActionCallback = useCallback(
    (action: string, targetPos?: Position) => {
      switch (action) {
        case "attack":
          handleAIAttack();
          break;
        case "defend":
          handleAIDefend();
          break;
        case "technique":
        case "combo":
          handleAITechnique();
          break;
        case "approach":
        case "retreat":
        case "circle":
          if (targetPos) {
            moveAIPlayer(targetPos);
          }
          break;
        case "feint":
          // Feint: quick move towards player then retreat (fix for issue #2529467001, #2529728016)
          {
            const playerPos = validPlayers[0].position;
            
            // Quick approach: move near the player
            const feintOffset = 50;
            const feintPos = {
              x: playerPos.x + (Math.random() - 0.5) * feintOffset,
              y: playerPos.y + (Math.random() - 0.5) * feintOffset,
            };
            moveAIPlayer(feintPos);
            addCombatMessage("AI 페인트", "AI Feint");
            
            // Schedule retreat after short delay with cleanup
            setTimeout(() => {
              // Check if still in valid state before executing retreat
              if (!combatState.roundEnded && combatState.roundStarted && validPlayers.length >= 2) {
                // Recalculate positions at retreat time to account for movement
                const currentPlayerPos = validPlayers[0].position;
                const currentAiPos = validPlayers[1].position;
                const dx = currentAiPos.x - currentPlayerPos.x;
                const dy = currentAiPos.y - currentPlayerPos.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const retreatDistance = 80;
                const retreatPos = {
                  x: Math.max(
                    arenaBounds.x,
                    Math.min(
                      arenaBounds.x + arenaBounds.width - 60,
                      currentPlayerPos.x + (dx / dist) * retreatDistance
                    )
                  ),
                  y: Math.max(
                    arenaBounds.y,
                    Math.min(
                      arenaBounds.y + arenaBounds.height - 180,
                      currentPlayerPos.y + (dy / dist) * retreatDistance
                    )
                  ),
                };
                moveAIPlayer(retreatPos);
              }
            }, 200);
          }
          break;
        case "counter":
          // Counter attack when player attacks
          handleAIAttack();
          addCombatMessage("AI 반격!", "AI Counter!");
          break;
      }
    },
    [handleAIAttack, handleAIDefend, handleAITechnique, moveAIPlayer, addCombatMessage, validPlayers, arenaBounds, combatState.roundEnded, combatState.roundStarted]
  );

  // Enhanced AI Combat System with strategic decision-making
  useAICombat({
    player: validPlayers[1],
    opponent: validPlayers[0],
    personality: aiPersonality,
    adaptiveDifficulty,
    isPaused,
    roundStarted: combatState.roundStarted,
    roundEnded: combatState.roundEnded,
    arenaBounds,
    onExecuteAction: executeAIActionCallback,
    onStanceChange: handleAIStanceChange,
  });

  // Update adaptive difficulty metrics after round ends (fix for issue #2529467017)
  useEffect(() => {
    if (combatState.roundEnded && validPlayers.length === 2) {
      const player = validPlayers[0];
      const totalAttacks = (player.hitsLanded ?? 0) + (player.hitsTaken ?? 0);
      
      // Only update metrics if there was at least one attack (issue #2529728006, #2529728014)
      if (totalAttacks === 0) return;
      
      // Use available properties from PlayerState (issue #2529728002)
      adaptiveDifficulty.updateSkillMetrics({
        hitsLanded: player.hitsLanded ?? 0,
        totalAttacks,
        combosExecuted: player.comboCount ?? 0,
        perfectBlockCount: 0, // Not yet tracked in PlayerState
        avgReactionTimeMs: 500, // Default value; not yet tracked in PlayerState
        vitalPointsHit: player.vitalPointHits ?? 0,
        effectiveStanceChanges: 0, // Not yet tracked in PlayerState
        damageDealt: player.totalDamageDealt ?? 0,
        damageTaken: player.totalDamageReceived ?? 0,
      });
    }
  }, [combatState.roundEnded, adaptiveDifficulty, validPlayers]);

  // Force position updates to sync properly
  useEffect(() => {
    setPlayerPositions((prev) => [playerPosition, prev[1]]);
    onPlayerUpdate(0, { position: playerPosition });
  }, [playerPosition, onPlayerUpdate]);

  // Check game end conditions
  const checkGameEnd = useCallback(() => {
    if (combatState.roundEnded) return;

    const p1Defeated = validPlayers[0].health <= 0;
    const p2Defeated = validPlayers[1].health <= 0;

    if (p1Defeated || p2Defeated) {
      combatActions.setRoundEnded(true);
      combatActions.setRoundStarted(false);
      combatActions.setRoundDisplayStatus("ko");
      const winner = p1Defeated ? 1 : 0;
      addCombatMessage(
        p1Defeated ? "플레이어 1 패배" : "플레이어 1 승리!",
        p1Defeated ? "Player 1 Defeated" : "Player 1 Victory!"
      );
      setTimeout(() => onGameEnd(winner), 2500);
    }
  }, [validPlayers, onGameEnd, addCombatMessage, combatState.roundEnded, combatActions]);

  // Check game end on health changes
  useEffect(() => {
    checkGameEnd();
  }, [validPlayers[0].health, validPlayers[1].health, checkGameEnd]);

  // Calculate match duration
  const matchDuration = useMemo(
    () => Math.floor((Date.now() - matchStartTimeRef.current) / 1000),
    []
  );

  // Keyboard input handling for combat
  useEffect(() => {
    const handleCombatInput = (event: KeyboardEvent) => {
      // Prevent handling if round hasn't started or already ended
      if (!combatState.roundStarted || combatState.roundEnded || combatState.isExecutingTechnique) {
        // Allow ESC even when round hasn't started
        if (event.key === "Escape") {
          onReturnToMenu();
          event.preventDefault();
        }
        return;
      }

      const key = event.key.toLowerCase();

      // Stance changes (1-8)
      if (key >= "1" && key <= "8") {
        const stanceIndex = parseInt(key) - 1;
        const stances: TrigramStance[] = [
          TrigramStance.GEON,
          TrigramStance.TAE,
          TrigramStance.LI,
          TrigramStance.JIN,
          TrigramStance.SON,
          TrigramStance.GAM,
          TrigramStance.GAN,
          TrigramStance.GON,
        ];
        handleStanceSwitch(stances[stanceIndex]);
        event.preventDefault();
      }

      // Attack with Space
      if (key === " ") {
        handleAttack();
        event.preventDefault();
      }

      // Defend with Shift
      if (event.key === "Shift") {
        handleDefend();
        event.preventDefault();
      }

      // ESC to return to menu
      if (event.key === "Escape") {
        onReturnToMenu();
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleCombatInput);
    return () => window.removeEventListener("keydown", handleCombatInput);
  }, [
    combatState.roundStarted,
    combatState.roundEnded,
    combatState.isExecutingTechnique,
    handleStanceSwitch,
    handleAttack,
    handleDefend,
    onReturnToMenu,
  ]);

  // Performance: Mark render end (development only)
  if (import.meta.env.DEV) {
    performance.mark('combat-render-end');
    performance.measure('combat-render', 'combat-render-start', 'combat-render-end');
  }

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
        x={combatState.screenShake.x}
        y={combatState.screenShake.y}
        layout={{
          width,
          height,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between", // Pushes content to top and bottom
          padding: layoutConstants.padding,
        }}
      >
        {/* Combat Title Header */}
        <pixiContainer
          layout={{
            width: "100%",
            height: 40,
            flexShrink: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <pixiText
            text="전투 | Combat"
            style={{
              fontSize: isMobile ? 18 : 24,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.KOREAN,
              align: "center",
            }}
            anchor={0.5}
            x={width / 2}
            y={20}
          />
        </pixiContainer>

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

        {/* Combat Arena Area: Flexible height, fills remaining space */}
        <CombatArena
          width={width}
          height={height - layoutConstants.hudHeight - layoutConstants.controlsHeight - layoutConstants.footerHeight - layoutConstants.padding * 2}
          players={validPlayers}
          playerPositions={[playerPositions[0], playerPositions[1]]}
          hitEffects={combatState.hitEffects}
          comboCount={combatState.comboCount}
          roundDisplayStatus={combatState.roundDisplayStatus}
          currentRound={currentRound}
          isMobile={isMobile}
          isExecutingTechnique={combatState.isExecutingTechnique}
          isMoving={isMoving}
          onEffectComplete={handleEffectComplete}
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
              isExecutingTechnique={combatState.isExecutingTechnique}
              width={isMobile ? width * 0.45 : 400}
              height={isMobile ? 120 : 140}
              x={0}
              y={0}
            />
            <CombatStatsPanel
              players={validPlayers}
              combatLog={combatState.combatMessages.map((msg, index) => ({
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
