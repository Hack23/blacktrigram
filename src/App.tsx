import React, { Suspense, useMemo } from "react";
import { Application as PixiApplication } from "@pixi/react";
import { AudioManager } from "./audio/AudioManager";
import { AudioProvider } from "./audio/AudioProvider";
import { GameEngine } from "./components/game/GameEngine";
import { GAME_CONFIG } from "./types/constants";
import { createPlayerState } from "./utils/playerUtils";
import type { PlayerState, GamePhase, KoreanText, GameState } from "./types";
import "./App.css";

const App: React.FC = () => {
  const [gamePhase, setGamePhase] = React.useState<GamePhase>("intro");

  const initialPlayer1Name: KoreanText = {
    korean: "선수1",
    english: "Player 1",
  };
  const initialPlayer2Name: KoreanText = {
    korean: "선수2",
    english: "Player 2",
  };

  const [player1, setPlayer1] = React.useState<PlayerState>(() =>
    createPlayerState("player1", "musa", initialPlayer1Name)
  );
  const [player2, setPlayer2] = React.useState<PlayerState>(() =>
    createPlayerState("player2", "amsalja", initialPlayer2Name)
  );

  const audioManager = useMemo(() => {
    return new AudioManager();
  }, []);

  const handlePlayerUpdate = (
    playerIndex: number,
    updates: Partial<PlayerState>
  ) => {
    if (playerIndex === 0) {
      setPlayer1((prevPlayer) => ({ ...prevPlayer, ...updates }));
    } else if (playerIndex === 1) {
      setPlayer2((prevPlayer) => ({ ...prevPlayer, ...updates }));
    }
  };

  const handleGamePhaseChange = (newPhase: GamePhase | string) => {
    setGamePhase(newPhase as GamePhase);
    if (newPhase === "combat") {
      setPlayer1((prev) =>
        createPlayerState(prev.id, prev.archetype, prev.name)
      );
      setPlayer2((prev) =>
        createPlayerState(prev.id, prev.archetype, prev.name)
      );
    }
  };

  const handleGameStateChange = (state: Partial<GameState>) => {
    // Handle game state changes
    console.log("Game state changed:", state);

    // Update any global state management here
    if (state.phase) {
      // Handle phase changes
      console.log("Game phase changed to:", state.phase);
    }

    if (state.isPaused !== undefined) {
      // Handle pause state changes
      console.log("Game pause state:", state.isPaused);
    }

    // Additional state handling logic as needed
  };

  return (
    <AudioProvider manager={audioManager}>
      <div className="app-container">
        <PixiApplication
          width={GAME_CONFIG.CANVAS_WIDTH}
          height={GAME_CONFIG.CANVAS_HEIGHT}
          options={{ backgroundColor: GAME_CONFIG.BACKGROUND_COLOR }}
        >
          <Suspense fallback={null}>
            <GameEngine
              gamePhase={gamePhase}
              player1={player1}
              player2={player2}
              onGamePhaseChange={handleGamePhaseChange}
              onPlayerUpdate={handlePlayerUpdate}
              onGameStateChange={handleGameStateChange}
            />
          </Suspense>
        </PixiApplication>
      </div>
    </AudioProvider>
  );
};

export default App;
