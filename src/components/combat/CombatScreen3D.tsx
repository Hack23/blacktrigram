/**
 * CombatScreen3D - Three.js-based combat screen
 * 
 * Maintains all existing combat logic and state management
 * Uses Html overlays for UI and 3D meshes for game objects
 */

import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as THREE from "three";
import { useWebGLContextLossHandler } from "../../hooks/useWebGLContextLossHandler";
import { HitEffect, PlayerState } from "../../systems";
import { CombatSystem } from "../../systems/CombatSystem";
import {
  AdaptiveDifficulty,
  getPersonalityByArchetype,
} from "../../systems/ai";
import { HitEffectType } from "../../systems/effects";
import { GameMode, PlayerArchetype, Position, TrigramStance, VitalPointSeverity } from "../../types";
import { KOREAN_COLORS, FONT_FAMILY } from "../../types/constants";
import { usePlayerMovement } from "../../utils/inputSystem";
import { createPlayerFromArchetype } from "../../utils/playerUtils";
import { PerformanceOverlay3D } from "../../utils/performance";
import { VolumeControl } from "../ui/VolumeControl";
// TODO: Create HTML versions of these UI components for Three.js
// import { CombatControls } from "./components/CombatControls";
// import { CombatFooter } from "./components/CombatFooter";
// import { CombatHUD } from "./components/CombatHUD";
// import { CombatStatsPanel } from "./components/CombatStatsPanel";
import { useAICombat } from "./hooks/useAICombat";
import { useCombatActions } from "./hooks/useCombatActions";
import { useCombatAudio } from "./hooks/useCombatAudio";
import { useCombatLayout } from "./hooks/useCombatLayout";
import { useCombatState } from "./hooks/useCombatState";
import CombatArena3D from "./components/CombatArena3D";
import HitEffects3D from "./components/HitEffects3D";
import Player3DModel from "./components/Player3DModel";

/**
 * Props for the CombatScreen3D component.
 * Provides all state and callbacks required for the 3D combat screen.
 */
export interface CombatScreen3DProps {
  /**
   * Array of player states (expects exactly 2 players).
   * Each PlayerState contains all combat and status information for a player.
   */
  readonly players: readonly PlayerState[];
  /**
   * Callback to update a player's state by index.
   * @param playerIndex - Index of the player to update (0 or 1).
   * @param updates - Partial PlayerState with updated fields.
   */
  readonly onPlayerUpdate: (
    playerIndex: number,
    updates: Partial<PlayerState>
  ) => void;
  /**
   * Current round number (1-based).
   */
  readonly currentRound: number;
  /**
   * Remaining time in seconds for the current round.
   */
  readonly timeRemaining: number;
  /**
   * Whether combat is currently paused.
   */
  readonly isPaused: boolean;
  /**
   * Callback when the user exits to the menu.
   */
  readonly onReturnToMenu: () => void;
  /**
   * Callback when the match ends, with the winner's index (0 or 1).
   * @param winner - Index of the winning player.
   */
  readonly onGameEnd: (winner: number) => void;
  /**
   * Optional game mode (affects rules/behavior).
   */
  readonly gameMode?: GameMode;
  /**
   * Canvas width in pixels. Defaults to 1200.
   */
  readonly width?: number;
  /**
   * Canvas height in pixels. Defaults to 800.
   */
  readonly height?: number;
}

/**
 * CombatScreen3D Component
 * Three.js-based combat screen with 3D characters and effects
 */
export const CombatScreen3D: React.FC<CombatScreen3DProps> = ({
  players,
  onPlayerUpdate,
  currentRound,
  timeRemaining,
  isPaused,
  onReturnToMenu,
  onGameEnd,
  width = 1200,
  height = 800,
}) => {
  // Handle WebGL context loss and restoration
  useWebGLContextLossHandler({
    onContextLost: () => {
      console.warn('⚠️ WebGL context lost in CombatScreen');
    },
    onContextRestored: () => {
      console.log('✅ WebGL context restored in CombatScreen');
    },
    autoRestore: true,
  });

  // Performance marks - only in dev mode and memoized
  useEffect(() => {
    if (import.meta.env.DEV) {
      performance.mark("combat-3d-render-start");
      return () => {
        performance.mark("combat-3d-render-end");
        performance.measure(
          "combat-3d-render",
          "combat-3d-render-start",
          "combat-3d-render-end"
        );
      };
    }
  }, []);

  // Layout calculations
  const { layoutConstants: _layoutConstants, arenaBounds, isMobile } = useCombatLayout(width, height);

  // Combat state management
  const { state: combatState, actions: combatActions } = useCombatState();

  // Combat audio
  const combatAudio = useCombatAudio();

  // Player positions
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

  // Convert 2D positions to 3D world coordinates
  const player1Position3D: [number, number, number] = useMemo(() => {
    const relX = (playerPositions[0].x - arenaBounds.x) / arenaBounds.width;
    const relZ = (playerPositions[0].y - arenaBounds.y) / arenaBounds.height;
    const x = relX * 16 - 8; // Map 0-1 to -8 to 8
    const z = relZ * 8 - 4;  // Map 0-1 to -4 to 4
    return [x, 0, z];
  }, [playerPositions, arenaBounds]);

  const player2Position3D: [number, number, number] = useMemo(() => {
    const relX = (playerPositions[1].x - arenaBounds.x) / arenaBounds.width;
    const relZ = (playerPositions[1].y - arenaBounds.y) / arenaBounds.height;
    const x = relX * 16 - 8; // Map 0-1 to -8 to 8
    const z = relZ * 8 - 4;  // Map 0-1 to -4 to 4
    return [x, 0, z];
  }, [playerPositions, arenaBounds]);

  // Combat system
  const combatSystem = useMemo(() => new CombatSystem(), []);

  // Player movement
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

  // Valid players with complete state
  const validPlayers = useMemo((): [PlayerState, PlayerState] => {
    if (players.length === 0) {
      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      return [
        { ...player1, position: playerPositions[0] },
        { ...player2, position: playerPositions[1] },
      ];
    }

    const player1 = players[0];
    const player2 =
      players[1] || createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

    return [
      { ...player1, position: playerPositions[0] },
      { ...player2, position: playerPositions[1] },
    ];
  }, [players, playerPositions]);

  // Combat messages
  const addCombatMessage = useCallback(
    (korean: string, english: string) => {
      const message = `${korean} | ${english}`;
      combatActions.addCombatMessage(message);
    },
    [combatActions]
  );

  // AI systems
  const adaptiveDifficulty = useMemo(() => new AdaptiveDifficulty(), []);

  // Persist AI difficulty metrics
  useEffect(() => {
    try {
      const savedMetrics = localStorage.getItem("ai_difficulty_metrics");
      if (savedMetrics) {
        adaptiveDifficulty.importMetrics(savedMetrics);
      }
    } catch (err) {
      console.warn("Failed to load AI difficulty metrics:", err);
    }

    return () => {
      try {
        const metrics = adaptiveDifficulty.exportMetrics();
        localStorage.setItem("ai_difficulty_metrics", metrics);
      } catch (err) {
        console.warn("Failed to save AI difficulty metrics:", err);
      }
    };
  }, [adaptiveDifficulty]);

  const aiPersonality = useMemo(
    () => getPersonalityByArchetype(validPlayers[1].archetype),
    [validPlayers]
  );

  // AI stance change handler
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

  // Hit effect handlers
  const handleEffectComplete = useCallback(
    (effectId: string) => {
      combatActions.removeHitEffect(effectId);
    },
    [combatActions]
  );

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

  const addHitEffect = useCallback(
    (type: HitEffectType, position: Position, intensity: number = 1) => {
      const effect = createHitEffect(
        `effect_${Date.now()}`,
        type,
        position,
        intensity
      );
      combatActions.addHitEffect(effect);
    },
    [createHitEffect, combatActions]
  );

  // Combat action handlers
  const {
    handleAttack,
    handleDefend,
    handleTechniqueExecute: _handleTechniqueExecute,
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

  // Update player 1 position
  useEffect(() => {
    setPlayerPositions((prev) => [playerPosition, prev[1]]);
    onPlayerUpdate(0, { position: playerPosition });
  }, [playerPosition, onPlayerUpdate]);

  // Round management
  useEffect(() => {
    if (isPaused) return;

    if (timeRemaining <= 0 && !combatState.roundEnded) {
      combatActions.setRoundEnded(true);
      combatActions.setRoundStarted(false);
      combatActions.setRoundDisplayStatus("end");

      combatAudio.stopCombatMusic(1000);

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

      const player = validPlayers[0];
      if (player?.archetype) {
        const playerArchetype = player.archetype.toLowerCase();
        combatAudio.playArchetypeMusic(playerArchetype, 2000);
      } else {
        combatAudio.playCombatMusic(2000);
      }

      combatActions.setRoundDisplayStatus("start");
      const fightTimer = setTimeout(
        () => combatActions.setRoundDisplayStatus("fight"),
        1500
      );

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

  // AI action execution
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
          {
            const playerPos = validPlayers[0].position;
            const feintOffset = 50;
            const feintPos = {
              x: playerPos.x + (Math.random() - 0.5) * feintOffset,
              y: playerPos.y + (Math.random() - 0.5) * feintOffset,
            };
            moveAIPlayer(feintPos);
            addCombatMessage("AI 페인트", "AI Feint");

            setTimeout(() => {
              if (
                !combatState.roundEnded &&
                combatState.roundStarted &&
                validPlayers.length >= 2
              ) {
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
          handleAIAttack();
          addCombatMessage("AI 반격!", "AI Counter!");
          break;
      }
    },
    [
      handleAIAttack,
      handleAIDefend,
      handleAITechnique,
      moveAIPlayer,
      addCombatMessage,
      validPlayers,
      arenaBounds,
      combatState.roundEnded,
      combatState.roundStarted,
    ]
  );

  // AI Combat System
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

  // Update adaptive difficulty metrics
  useEffect(() => {
    if (combatState.roundEnded && validPlayers.length === 2) {
      const player = validPlayers[0];
      const totalAttacks = (player.hitsLanded ?? 0) + (player.hitsTaken ?? 0);

      if (totalAttacks === 0) return;

      adaptiveDifficulty.updateSkillMetrics({
        hitsLanded: player.hitsLanded ?? 0,
        totalAttacks,
        combosExecuted: player.comboCount ?? 0,
        perfectBlockCount: 0,
        avgReactionTimeMs: 500,
        vitalPointsHit: player.vitalPointHits ?? 0,
        effectiveStanceChanges: 0,
        damageDealt: player.totalDamageDealt ?? 0,
        damageTaken: player.totalDamageReceived ?? 0,
      });
    }
  }, [combatState.roundEnded, adaptiveDifficulty, validPlayers]);

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
  }, [
    validPlayers,
    onGameEnd,
    addCombatMessage,
    combatState.roundEnded,
    combatActions,
  ]);

  useEffect(() => {
    checkGameEnd();
  }, [validPlayers[0].health, validPlayers[1].health, checkGameEnd]);

  // Keyboard input handling
  useEffect(() => {
    const handleCombatInput = (event: KeyboardEvent) => {
      if (
        !combatState.roundStarted ||
        combatState.roundEnded ||
        combatState.isExecutingTechnique
      ) {
        if (event.key === "Escape") {
          onReturnToMenu();
          event.preventDefault();
        }
        return;
      }

      const key = event.key.toLowerCase();

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

      if (key === " ") {
        handleAttack();
        event.preventDefault();
      }

      if (event.key === "Shift") {
        handleDefend();
        event.preventDefault();
      }

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

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
        backgroundColor: "#0a0a0a",
      }}
      data-testid="combat-screen"
    >
      {/* Three.js Canvas for 3D rendering */}
      <Canvas
        camera={{ position: [0, 8, 12], fov: 60 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        shadows
        onCreated={({ gl, scene }) => {
          gl.setClearColor(KOREAN_COLORS.UI_BACKGROUND_DARK, 1);
          scene.fog = new THREE.Fog(
            KOREAN_COLORS.UI_BACKGROUND_DARK,
            15,
            35
          );
        }}
      >
        {/* 3D Combat Arena */}
        <CombatArena3D lighting="cyberpunk" />

        {/* Player 1 */}
        <Player3DModel
          playerState={validPlayers[0]}
          position={player1Position3D}
          animationState={
            combatState.isExecutingTechnique
              ? "technique_execute"
              : isMoving
              ? "walk"
              : "idle"
          }
          facing="right"
          showVitalPoints={true}
          vitalPointSeverityFilter={[
            VitalPointSeverity.CRITICAL,
            VitalPointSeverity.MAJOR,
          ]}
        />

        {/* Player 2 (AI) */}
        <Player3DModel
          playerState={validPlayers[1]}
          position={player2Position3D}
          animationState="idle"
          facing="left"
          showVitalPoints={true}
          vitalPointSeverityFilter={[
            VitalPointSeverity.CRITICAL,
            VitalPointSeverity.MAJOR,
          ]}
        />

        {/* Hit Effects */}
        <HitEffects3D
          effects={combatState.hitEffects}
          onEffectComplete={handleEffectComplete}
          arenaBounds={arenaBounds}
        />

        {/* Performance Overlay (Development Only) */}
        {import.meta.env.DEV && (
          <PerformanceOverlay3D
            position={[-7, 4, 0]}
            visible={true}
          />
        )}

        {/* Round display status overlay */}
        {combatState.roundDisplayStatus && combatState.roundDisplayStatus !== null && (
          <Html fullscreen>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "72px",
                fontWeight: "bold",
                fontFamily: FONT_FAMILY.KOREAN,
                color: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
                textShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
                pointerEvents: "none",
                zIndex: 1000,
              }}
            >
              {combatState.roundDisplayStatus === "start" && "라운드 시작!"}
              {combatState.roundDisplayStatus === "fight" && "전투!"}
              {combatState.roundDisplayStatus === "end" && "라운드 종료"}
              {combatState.roundDisplayStatus === "ko" && "K.O.!"}
            </div>
          </Html>
        )}
      </Canvas>

      {/* Html UI Overlays (positioned absolutely over Canvas) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {/* Combat Title */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: isMobile ? "18px" : "24px",
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
            color: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
            textShadow: "0 0 4px rgba(0,0,0,0.8)",
          }}
        >
          전투 | Combat
        </div>

        {/* Volume Control */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          <VolumeControl position="top-right" compact={isMobile} />
        </div>

        {/* Combat HUD */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "10px",
            right: "10px",
          }}
        >
          {/* TODO: Replace with CombatHUDHTML component */}
          <div style={{
            background: "rgba(10, 10, 15, 0.9)",
            border: "2px solid #00ffff",
            borderRadius: "8px",
            padding: "15px",
            fontFamily: FONT_FAMILY.KOREAN,
            color: "#00ffff",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <div>
                <div>{validPlayers[0].name.korean} | {validPlayers[0].name.english}</div>
                <div>HP: {validPlayers[0].health}/{validPlayers[0].maxHealth}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div>Round {currentRound}/3</div>
                <div>Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div>{validPlayers[1].name.korean} | {validPlayers[1].name.english}</div>
                <div>HP: {validPlayers[1].health}/{validPlayers[1].maxHealth}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Combat Controls and Stats */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "10px",
            right: "10px",
            display: "flex",
            justifyContent: "space-between",
            pointerEvents: "auto",
          }}
        >
          {/* TODO: Replace with CombatControlsHTML component */}
          <div style={{ 
            width: isMobile ? "45%" : "400px",
            background: "rgba(10, 10, 15, 0.8)",
            border: "2px solid #00ffff",
            borderRadius: "8px",
            padding: "10px",
            color: "#00ffff",
            fontFamily: FONT_FAMILY.KOREAN,
          }}>
            <div>Controls: A/D - Attack/Defend | 1-8 - Stances</div>
          </div>
          {/* TODO: Replace with CombatStatsPanelHTML component */}
          <div style={{ 
            width: isMobile ? "45%" : "400px",
            background: "rgba(10, 10, 15, 0.8)",
            border: "2px solid #00ffff",
            borderRadius: "8px",
            padding: "10px",
            color: "#00ffff",
            fontFamily: FONT_FAMILY.KOREAN,
            maxHeight: "140px",
            overflow: "auto",
          }}>
            {combatState.combatMessages.slice(-5).map((msg, i) => (
              <div key={i} style={{ fontSize: "12px", marginBottom: "4px" }}>{msg}</div>
            ))}
          </div>
        </div>

        {/* Combat Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: 0,
            right: 0,
            pointerEvents: "auto",
          }}
        >
          {/* TODO: Replace with CombatFooterHTML component */}
          <div style={{ 
            textAlign: "center",
            background: "rgba(10, 10, 15, 0.8)",
            border: "2px solid #00ffff",
            borderRadius: "8px",
            padding: "8px",
            margin: "0 10px",
          }}>
            <button 
              onClick={onReturnToMenu}
              style={{
                background: "#00ffff",
                color: "#0a0a0f",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                fontFamily: FONT_FAMILY.KOREAN,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              메뉴로 | Return to Menu
            </button>
          </div>
        </div>

        {/* Pause Overlay */}
        {isPaused && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "48px",
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.KOREAN,
              color: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}`,
              textShadow: "0 0 10px rgba(0,0,0,0.8)",
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: "20px 40px",
              borderRadius: "10px",
            }}
          >
            일시정지 | Paused
          </div>
        )}
      </div>
    </div>
  );
};

export default CombatScreen3D;
