import React, { useState, useCallback, useEffect } from "react";
import { IntroScreen } from "./components/intro/IntroScreen";
import { GameUI } from "./components/game/GameUI";
import { TrainingScreen } from "./components/training/TrainingScreen";
import {
  createPlayerState,
  type GamePhase,
  type PlayerState,
  type TrigramStance,
} from "./types";
import "./App.css";

interface AppState {
  readonly gamePhase: GamePhase;
  readonly players: readonly [PlayerState, PlayerState];
  readonly gameTime: number;
  readonly currentRound: number;
  readonly timeRemaining: number;
  readonly combatLog: readonly string[];
  readonly isPaused: boolean;
}

export default function App(): React.ReactElement {
  // Initialize player states using helper function
  const player1 = createPlayerState("player1", { x: 200, y: 400 }, "geon", {
    health: 100,
    maxHealth: 100,
    ki: 50,
    maxKi: 100,
    facing: "right",
  });

  const player2 = createPlayerState("player2", { x: 600, y: 400 }, "gon", {
    health: 100,
    maxHealth: 100,
    ki: 50,
    maxKi: 100,
    facing: "left",
  });

  const [appState, setAppState] = useState<AppState>({
    gamePhase: "intro",
    players: [player1, player2],
    gameTime: 0,
    currentRound: 1,
    timeRemaining: 90,
    combatLog: [],
    isPaused: false, // Add missing isPaused property
  });

  // Game loop for combat phase
  useEffect(() => {
    if (appState.gamePhase !== "combat" || appState.isPaused) return;

    const gameLoop = setInterval(() => {
      setAppState((prev) => ({
        ...prev,
        gameTime: prev.gameTime + 1,
        timeRemaining: Math.max(0, prev.timeRemaining - 1),
      }));
    }, 1000);

    return () => clearInterval(gameLoop);
  }, [appState.gamePhase, appState.isPaused]);

  const handleGamePhaseChange = useCallback((phase: GamePhase) => {
    setAppState((prev) => ({
      ...prev,
      gamePhase: phase,
      // Reset game state when entering combat
      ...(phase === "combat" && {
        gameTime: 0,
        timeRemaining: 180,
        combatLog: ["전투 시작! (Combat Started!)"],
        players: [
          createPlayerState("player1", { x: 200, y: 300 }, "geon"),
          createPlayerState("player2", { x: 600, y: 300 }, "gon"),
        ],
      }),
    }));
  }, []);

  const handleStanceChange = useCallback(
    (playerIndex: number, stance: TrigramStance): void => {
      setAppState((prev) => ({
        ...prev,
        players: [
          playerIndex === 0
            ? { ...prev.players[0], stance, lastStanceChangeTime: Date.now() }
            : prev.players[0],
          playerIndex === 1
            ? { ...prev.players[1], stance, lastStanceChangeTime: Date.now() }
            : prev.players[1],
        ] as [PlayerState, PlayerState],
      }));
    },
    []
  );

  // Add separate handler for training screen
  const handleTrainingStanceChange = useCallback(
    (stance: TrigramStance): void => {
      handleStanceChange(0, stance); // Always update player 0 in training
    },
    [handleStanceChange]
  );

  const handleStartMatch = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      isPaused: false,
      combatLog: [...prev.combatLog, "경기 시작! (Match Started!)"],
    }));
  }, []);

  const handleResetMatch = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      gameTime: 0,
      timeRemaining: 180,
      currentRound: 1,
      isPaused: false,
      players: [
        createPlayerState("player1", { x: 200, y: 300 }, "geon"),
        createPlayerState("player2", { x: 600, y: 300 }, "gon"),
      ],
      combatLog: ["경기 재시작! (Match Reset!)"],
    }));
  }, []);

  const handleTogglePause = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
      combatLog: [
        ...prev.combatLog,
        prev.isPaused ? "경기 재개 (Resumed)" : "일시정지 (Paused)",
      ],
    }));
  }, []);

  // Wrap the entire app with AudioManagerProvider
  const renderCurrentPhase = (): React.ReactElement => {
    switch (appState.gamePhase) {
      case "intro":
        return <IntroScreen onGamePhaseChange={handleGamePhaseChange} />;

      case "training":
        return (
          <TrainingScreen
            onGamePhaseChange={handleGamePhaseChange}
            onStanceChange={handleTrainingStanceChange}
            selectedStance={appState.players[0].stance}
          />
        );

      case "combat":
      case "philosophy":
        return (
          <GameUI
            players={appState.players}
            gamePhase={appState.gamePhase}
            onGamePhaseChange={handleGamePhaseChange}
            gameTime={appState.gameTime}
            currentRound={appState.currentRound}
            timeRemaining={appState.timeRemaining}
            onStanceChange={handleStanceChange}
            combatLog={appState.combatLog}
            onStartMatch={handleStartMatch}
            onResetMatch={handleResetMatch}
            onTogglePause={handleTogglePause}
          />
        );

      default:
        return <IntroScreen onGamePhaseChange={handleGamePhaseChange} />;
    }
  };

  // Remove AudioManagerProvider wrapper for now
  return renderCurrentPhase();
}
