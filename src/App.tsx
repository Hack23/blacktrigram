import { lazy, useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { useAudio } from "./audio/AudioProvider";
import { CombatScreen3D as CombatScreen } from "./components/combat/CombatScreen3D";
import { EndScreen3D } from "./components/endscreen";
import { IntroScreenThreeJS as IntroScreen } from "./components/intro/IntroScreenThreeJS";
import { ControlsScreenThreeJS as ControlsScreen } from "./components/screens/ControlsScreenThreeJS";
import { PhilosophyScreenThreeJS as PhilosophyScreen } from "./components/screens/PhilosophyScreenThreeJS";
import { SplashScreen } from "./components/ui/SplashScreen";
import { ErrorModal } from "./components/ui/ErrorModal";
import { useWebGLContextLossHandler } from "./hooks/useWebGLContextLossHandler";
import { PlayerState } from "./systems";
import { MatchStatistics } from "./systems/combat";
import { GameMode, PlayerArchetype } from "./types/common";
import { createPlayerFromArchetype } from "./utils/playerUtils";

// Lazy load heavy screens
const TrainingScreen = lazy(
  () => import("./components/training/TrainingScreen3D").then(m => ({ default: m.TrainingScreen3D }))
);

function App() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<PlayerArchetype>(
    PlayerArchetype.MUSA
  );
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameWinner, setGameWinner] = useState<PlayerState | null>(null);
  const [matchStats, setMatchStats] = useState<MatchStatistics | null>(null);
  const [appReady, setAppReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showAudioError, setShowAudioError] = useState(false);

  const audio = useAudio();

  // Handle WebGL context loss and restoration
  useWebGLContextLossHandler({
    onContextLost: () => {
      console.warn('⚠️ WebGL context lost - This may affect 3D rendering');
    },
    onContextRestored: () => {
      console.log('✅ WebGL context restored - 3D rendering should resume');
    },
    autoRestore: true,
  });

  // Add responsive screen size detection
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        window.focus();

        window.addEventListener("error", (e) => {
          console.error("Global error:", e.error);
        });

        window.addEventListener("unhandledrejection", (e) => {
          console.error("Unhandled promise rejection:", e.reason);
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
        setAppReady(true);
      }
    };

    initializeApp();
  }, []);

  // Shared audio initialization logic for splash and retry
  const initializeAudioWithRetry = useCallback(async () => {
    if (!appReady) {
      console.warn("App not ready yet, please wait...");
      return false;
    }
    try {
      await audio.initializeAudio();
      console.log("🎵 Audio initialized");
      return true;
    } catch (error) {
      console.error("Failed to initialize audio:", error);
      return false;
    }
  }, [audio, appReady]);

  // Handle splash screen start - initialize audio on user gesture
  const handleSplashStart = useCallback(async () => {
    setShowAudioError(false);
    const success = await initializeAudioWithRetry();
    if (success) {
      setShowSplash(false);
    } else {
      setShowAudioError(true);
    }
  }, [initializeAudioWithRetry]);

  const handleAudioErrorRetry = useCallback(async () => {
    setShowAudioError(false);
    const success = await initializeAudioWithRetry();
    if (success) {
      setShowSplash(false);
    } else {
      setShowAudioError(true);
    }
  }, [initializeAudioWithRetry]);

  const handleAudioErrorContinue = useCallback(() => {
    // Continue without sound
    setShowAudioError(false);
    setShowSplash(false);
    console.log("Continuing without audio (silent mode)");
  }, []);

  // ✅ SIMPLIFIED: Handle game mode selection directly
  const handleGameStart = useCallback(
    (mode: GameMode, archetype?: PlayerArchetype) => {
      console.log("🎮 Starting game mode:", mode, "with archetype:", archetype);

      // ✅ NEW: Handle controls and philosophy as separate modes
      if (mode === GameMode.CONTROLS || mode === GameMode.PHILOSOPHY) {
        setGameMode(mode);
        setIsGameActive(false); // These are not game modes, just screens
      } else {
        setGameMode(mode);
        setIsGameActive(true);
      }

      setGameWinner(null);
      setMatchStats(null);
      if (archetype) {
        setSelectedArchetype(archetype);
      }
    },
    []
  );

  const handleGameEnd = useCallback(
    (winner: number) => {
      setIsGameActive(false);
      setGameWinner(createPlayerFromArchetype(selectedArchetype, winner));

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
    },
    [selectedArchetype]
  );

  const handleReturnToMenu = useCallback(() => {
    setGameMode(null);
    setIsGameActive(false);
    setGameWinner(null);
    setMatchStats(null);
  }, []);

  const renderCurrentScreen = () => {
    if (gameWinner && matchStats) {
      // ✅ NEW: Use EndScreen3D component
      return (
        <EndScreen3D
          winner={gameWinner}
          matchStats={matchStats}
          onReturnToMenu={handleReturnToMenu}
          width={screenSize.width}
          height={screenSize.height}
        />
      );
    }

    // ✅ NEW: Handle standalone screens first
    if (gameMode === GameMode.CONTROLS) {
      return (
        <ControlsScreen
          onReturnToMenu={handleReturnToMenu}
          width={screenSize.width}
          height={screenSize.height}
        />
      );
    }

    if (gameMode === GameMode.PHILOSOPHY) {
      return (
        <PhilosophyScreen
          onReturnToMenu={handleReturnToMenu}
          width={screenSize.width}
          height={screenSize.height}
        />
      );
    }

    // ✅ SIMPLIFIED: Only active game modes use isGameActive
    if (isGameActive && gameMode) {
      switch (gameMode) {
        case GameMode.TRAINING:
          return (
            <TrainingScreen
              onPlayerUpdate={(updates) => {
                console.log("Training player updated:", updates);
              }}
              onReturnToMenu={handleReturnToMenu}
              width={screenSize.width}
              height={screenSize.height}
            />
          );
        case GameMode.VERSUS:
        case GameMode.PRACTICE:
          const player1 = createPlayerFromArchetype(selectedArchetype, 0);
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
              onArchetypeSelect={setSelectedArchetype}
              selectedArchetype={selectedArchetype}
              width={screenSize.width}
              height={screenSize.height}
            />
          );
      }
    }

    // ✅ SIMPLIFIED: Default to intro screen
    return (
      <IntroScreen
        onMenuSelect={handleGameStart}
        onArchetypeSelect={setSelectedArchetype}
        selectedArchetype={selectedArchetype}
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

  // Show splash screen first to get user gesture for audio
  if (showSplash) {
    return (
      <div className="app" data-testid="app-container">
        <SplashScreen
          onStart={handleSplashStart}
          width={screenSize.width}
          height={screenSize.height}
        />
        {showAudioError && (
          <ErrorModal
            message="오디오 초기화에 실패했습니다. 재시도하거나 소리 없이 계속할 수 있습니다. | Audio initialization failed. You can retry or continue without sound."
            onRetry={handleAudioErrorRetry}
            onContinue={handleAudioErrorContinue}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className="app"
      tabIndex={0}
      ref={containerRef}
      style={{
        outline: "none",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
      data-testid="app-container"
    >
      {/* All screens now use Three.js or pure React/HTML */}
      {renderCurrentScreen()}
    </div>
  );
}

export default App;
