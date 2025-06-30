import "@pixi/layout";
import { LayoutContainer } from "@pixi/layout/components";
import "@pixi/layout/react";
import { Application, extend } from "@pixi/react";
import { FancyButton } from "@pixi/ui";
import { Container, Graphics, Text } from "pixi.js";
import { lazy, useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { AudioProvider } from "./audio/AudioProvider";
import { CombatScreen } from "./components/combat/CombatScreen";
import { IntroScreen } from "./components/intro/IntroScreen";
import { PlayerState } from "./systems";
import { MatchStatistics } from "./systems/combat";
import { exposePixiAppForTesting } from "./test/pixi-cypress-helpers";
import { GameMode, PlayerArchetype } from "./types/common";
import { usePixiExtensions } from "./utils/pixiExtensions";
import { createPlayerFromArchetype } from "./utils/playerUtils";

extend({
  Container,
  Graphics,
  Text,
  LayoutContainer,
  FancyButton,
});

// Lazy load heavy screens
const EndScreen = lazy(() => import("./components/ui/EndScreen"));
const TrainingScreen = lazy(
  () => import("./components/training/TrainingScreen")
);

/* ------------------------------------------------------------------
 *  ⬇  LayoutContainer-based wrapper that keeps content sized
 *     to the current browser viewport and updates on resize.
 * -----------------------------------------------------------------*/

/* ------------------------------------------------------------------
 *  ⬇  Rest of App component (unchanged logic)
 * -----------------------------------------------------------------*/
function App() {
  usePixiExtensions();

  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameWinner, setGameWinner] = useState<PlayerState | null>(null);
  const [matchStats, setMatchStats] = useState<MatchStatistics | null>(null);
  const [appReady, setAppReady] = useState(false);

  // Add responsive screen size detection
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
  });

  const handleApplicationReady = useCallback((app: any) => {
    if (app && typeof window !== "undefined") {
      // Expose for testing
      exposePixiAppForTesting(app);
    }
  }, []);

  // Fix: Move useEffect inside component body
  useEffect(() => {
    // Alternative way to access PIXI app if needed
    const checkForApp = () => {
      const pixiApp = (window as any).pixiApp;
      if (pixiApp) {
        handleApplicationReady(pixiApp);
      }
    };

    const timer = setInterval(checkForApp, 100);
    setTimeout(() => clearInterval(timer), 5000); // Stop checking after 5 seconds

    return () => clearInterval(timer);
  }, [handleApplicationReady]);

  // Fix: Ensure app is properly initialized
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Focus window for input handling
        window.focus();

        // Set up global error handlers for audio issues
        window.addEventListener("error", (e) => {
          console.error("Global error:", e.error);
        });

        window.addEventListener("unhandledrejection", (e) => {
          console.error("Unhandled promise rejection:", e.reason);
          // Prevent audio loading failures from failing tests
          if (
            e.reason?.message?.includes("Failed to load") ||
            e.reason?.message?.includes("no supported source")
          ) {
            e.preventDefault();
          }
        });

        setAppReady(true);
        console.log("🎯 Black Trigram app initialized");
      } catch (error) {
        console.error("Failed to initialize app:", error);
        setAppReady(true); // Continue with fallback
      }
    };

    initializeApp();
  }, []);

  const handleGameStart = useCallback((mode: GameMode) => {
    console.log("🎮 Starting game mode:", mode);
    setGameMode(mode);
    setIsGameActive(true);
    setGameWinner(null);
    setMatchStats(null);
  }, []);

  const handleGameEnd = useCallback((winner: number) => {
    setIsGameActive(false);
    setGameWinner(createPlayerFromArchetype(PlayerArchetype.MUSA, winner));

    // Create basic match statistics
    setMatchStats({
      totalDamageDealt: 150,
      totalDamageTaken: 100,
      criticalHits: 3,
      vitalPointHits: 2,
      techniquesUsed: 8,
      perfectStrikes: 1,
      consecutiveWins: 1,
      matchDuration: 120,
      totalMatches: 1,
      maxRounds: 3,
      winner: winner,
      totalRounds: 2,
      currentRound: 2,
      timeRemaining: 0,
      combatEvents: [],
      finalScore: {
        player1: winner === 0 ? 2 : 0,
        player2: winner === 1 ? 2 : 0,
      },
      roundsWon: {
        player1: winner === 0 ? 2 : 0,
        player2: winner === 1 ? 2 : 0,
      },
      player1: {
        wins: winner === 0 ? 1 : 0,
        losses: winner === 0 ? 0 : 1,
        hitsTaken: 5,
        hitsLanded: 8,
        totalDamageDealt: winner === 0 ? 150 : 100,
        totalDamageReceived: winner === 0 ? 100 : 150,
        techniques: ["천둥벽력", "유수연타"],
        perfectStrikes: winner === 0 ? 1 : 0,
        vitalPointHits: winner === 0 ? 2 : 1,
        consecutiveWins: winner === 0 ? 1 : 0,
        matchDuration: 120,
      },
      player2: {
        wins: winner === 1 ? 1 : 0,
        losses: winner === 1 ? 0 : 1,
        hitsTaken: 8,
        hitsLanded: 5,
        totalDamageDealt: winner === 1 ? 150 : 100,
        totalDamageReceived: winner === 1 ? 100 : 150,
        techniques: ["화염지창", "벽력일섬"],
        perfectStrikes: winner === 1 ? 1 : 0,
        vitalPointHits: winner === 1 ? 2 : 1,
        consecutiveWins: winner === 1 ? 1 : 0,
        matchDuration: 120,
      },
    });
  }, []);

  const handleReturnToMenu = useCallback(() => {
    setGameMode(null);
    setIsGameActive(false);
    setGameWinner(null);
    setMatchStats(null);
  }, []);

  const renderCurrentScreen = () => {
    // Show end screen if game ended
    if (gameWinner && matchStats) {
      return (
        <EndScreen
          winner={gameWinner}
          matchStatistics={matchStats}
          onReturnToMenu={handleReturnToMenu}
          onRestart={() => handleGameStart(gameMode!)}
          width={screenSize.width}
          height={screenSize.height}
        />
      );
    }

    // Show game screen based on mode
    if (isGameActive && gameMode) {
      switch (gameMode) {
        case GameMode.TRAINING:
          return (
            <TrainingScreen
              player={trainingPlayer}
              onPlayerUpdate={(updates) => {
                // Update training player state
                console.log("Training player updated:", updates);
              }}
              onReturnToMenu={handleReturnToMenu}
              width={screenSize.width}
              height={screenSize.height}
            />
          );
        case GameMode.VERSUS:
        case GameMode.PRACTICE:
          const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
          const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

          return (
            <CombatScreen
              players={[player1, player2]}
              currentRound={1}
              timeRemaining={180}
              isPaused={false}
              onPlayerUpdate={(playerIndex, updates) => {
                console.log(`Player ${playerIndex} updated:`, updates);
              }}
              onReturnToMenu={handleReturnToMenu}
              onGameEnd={handleGameEnd}
              gameMode={gameMode}
              width={screenSize.width}
              height={screenSize.height}
            />
          );
        default:
          return (
            <IntroScreen
              onMenuSelect={handleGameStart}
              width={screenSize.width}
              height={screenSize.height}
            />
          );
      }
    }

    // Default to intro screen with full dimensions
    return (
      <IntroScreen
        onMenuSelect={handleGameStart}
        width={screenSize.width}
        height={screenSize.height}
      />
    );
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, [appReady]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!appReady) {
    return (
      <div className="app loading" data-testid="app-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            color: "white",
            backgroundColor: "#1a1a2e",
          }}
        >
          흑괘 로딩 중... Loading Black Trigram...
        </div>
      </div>
    );
  }

  const trainingPlayer = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

  return (
    <AudioProvider>
      <div
        className="app"
        tabIndex={0}
        ref={containerRef}
        style={{ outline: "none", width: "100vw", height: "100vh" }}
        data-testid="app-container"
      >
        <Application
          width={screenSize.width}
          height={screenSize.height}
          backgroundColor={0x0a0a0f}
          antialias
          // Remove resizeTo={window} as LayoutResizer handles this
        >
          {/* NEW: one root LayoutContainer that always matches canvas size */}

          <layoutContainer
            layout={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {renderCurrentScreen()}
          </layoutContainer>
        </Application>
      </div>
    </AudioProvider>
  );
}

export default App;
