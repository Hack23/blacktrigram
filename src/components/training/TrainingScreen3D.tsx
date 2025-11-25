/**
 * TrainingScreen3D - Three.js-based training screen
 * 
 * Provides 3D training dummy with vital point targeting and Html UI overlays
 */

import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useWebGLContextLossHandler } from "../../hooks/useWebGLContextLossHandler";
import { PlayerState } from "../../systems";
import { useAudio } from "../../audio/AudioProvider";
import { Position, TrigramStance } from "../../types/common";
import { KOREAN_COLORS } from "../../types/constants";
import { usePlayerMovement } from "../../utils/inputSystem";
import TrainingArena3D from "./components/TrainingArena3D";
import TrainingDummy3D from "./components/TrainingDummy3D";
import TrainingHitEffects3D from "./components/TrainingHitEffects3D";
import TrainingControlsHTML from "./components/TrainingControlsHTML";
import TrainingStatsHTML, { type TrainingStats } from "./components/TrainingStatsHTML";
import VitalPointTrainingHTML from "./components/VitalPointTrainingHTML";
import TrainingModeSelectorHTML, { type TrainingMode } from "./components/TrainingModeSelectorHTML";
import TrainingFeedbackHTML from "./components/TrainingFeedbackHTML";

/**
 * Props for the TrainingScreen3D component
 */
export interface TrainingScreen3DProps {
  /** Callback to update player state */
  readonly onPlayerUpdate: (updates: Partial<PlayerState>) => void;
  /** Callback when returning to menu */
  readonly onReturnToMenu: () => void;
  /** Canvas width in pixels. Defaults to 1200 */
  readonly width?: number;
  /** Canvas height in pixels. Defaults to 800 */
  readonly height?: number;
}

/**
 * Hit effect state
 */
interface HitEffect {
  readonly id: number;
  readonly position: [number, number, number];
  readonly type: "success" | "perfect" | "miss";
  readonly visible: boolean;
}

/**
 * TrainingScreen3D Component
 * Three.js-based training screen with 3D dummy and Html UI
 */
export const TrainingScreen3D: React.FC<TrainingScreen3DProps> = ({
  onPlayerUpdate,
  onReturnToMenu,
  width = 1200,
  height = 800,
}) => {
  // Handle WebGL context loss and restoration
  useWebGLContextLossHandler({
    onContextLost: useCallback(() => {
      console.warn('⚠️ WebGL context lost in TrainingScreen');
    }, []),
    onContextRestored: useCallback(() => {
      console.log('✅ WebGL context restored in TrainingScreen');
    }, []),
    autoRestore: true,
  });

  // Training state
  const [trainingMode, setTrainingMode] = useState<TrainingMode>("basics");
  const [isTraining, setIsTraining] = useState(false);
  const [selectedVitalPoint, setSelectedVitalPoint] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([]);
  const [nextEffectId, setNextEffectId] = useState(0);
  
  // Training statistics
  const [stats, setStats] = useState<TrainingStats>({
    score: 0,
    combo: 0,
    hits: 0,
    misses: 0,
    accuracy: 0,
  });

  // Responsive detection
  const isMobile = useMemo(() => width < 768, [width]);

  // Audio context
  const audio = useAudio();

  // Audio lifecycle management
  useEffect(() => {
    let audioStarted = false;
    
    const startMusic = async () => {
      try {
        await audio.fadeIn("cyberpunk_fusion", 2000);
        audioStarted = true;
      } catch (err) {
        console.warn("Failed to start training music:", err);
        // Show user-visible feedback that audio failed
        setFeedback("오디오 초기화 실패 | Audio initialization failed");
        setShowFeedback(true);
      }
    };
    
    void startMusic();

    return () => {
      if (audioStarted) {
        void audio.fadeOut(2000).then(() => audio.stopMusic()).catch((err) => 
          console.warn("Failed to stop training music:", err)
        );
      }
    };
  }, [audio]);

  // Arena bounds for player movement
  const arenaBounds = useMemo(
    () => ({
      x: -8,
      y: -6,
      width: 16,
      height: 12,
    }),
    []
  );

  // Initial player position in 3D space
  const initialPosition = useMemo<Position>(
    () => ({
      x: -5,
      y: 0,
    }),
    []
  );

  // Player movement with input system
  const { playerPosition } = usePlayerMovement({
    enabled: isTraining,
    bounds: arenaBounds,
    onPositionChange: (newPosition: Position) => {
      onPlayerUpdate({ position: newPosition });
    },
    initialPosition,
    moveSpeed: 300,
  });

  // Convert 2D position to 3D
  const player3DPosition = useMemo<[number, number, number]>(
    () => [playerPosition.x, 0, playerPosition.y],
    [playerPosition]
  );

  // Training handlers
  const handleStartTraining = useCallback(() => {
    setIsTraining(true);
    setStats({
      score: 0,
      combo: 0,
      hits: 0,
      misses: 0,
      accuracy: 0,
    });
    setFeedback("훈련 시작! | Training Start!");
    setShowFeedback(true);
    audio.playSFX("menu_select");
  }, [audio]);

  const handleStopTraining = useCallback(() => {
    setIsTraining(false);
    setFeedback("훈련 종료 | Training End");
    setShowFeedback(true);
    audio.playSFX("menu_back");
  }, [audio]);

  const handleDummyHit = useCallback(
    (_vitalPointId: string, accuracy: number): boolean => {
      if (!isTraining) return false;

      // Determine hit position (dummy is at [5, 0, 0])
      const hitPosition: [number, number, number] = [5, 1.5, 0];
      
      let effectType: "success" | "perfect" | "miss";

      if (accuracy > 0.5) {
        const points = Math.round(accuracy * 100);
        
        setStats((prev) => {
          const newHits = prev.hits + 1;
          const totalAttempts = newHits + prev.misses;
          return {
            score: prev.score + points,
            combo: prev.combo + 1,
            hits: newHits,
            misses: prev.misses,
            accuracy: totalAttempts > 0 ? (newHits / totalAttempts) * 100 : 0,
          };
        });

        if (accuracy > 0.9) {
          setFeedback("완벽한 타격! | Perfect Strike!");
          audio.playSFX("ki_release");
          effectType = "perfect";
        } else if (accuracy > 0.7) {
          setFeedback("좋은 타격! | Good Strike!");
          audio.playSFX("ki_charge");
          effectType = "success";
        } else {
          setFeedback("타격 성공 | Strike Success");
          audio.playSFX("menu_click");
          effectType = "success";
        }
        
        setShowFeedback(true);
        
        // Add hit effect
        setHitEffects((prev) => [
          ...prev,
          {
            id: nextEffectId,
            position: hitPosition,
            type: effectType,
            visible: true,
          },
        ]);
        setNextEffectId((prev) => prev + 1);
        
        return true;
      } else {
        setStats((prev) => {
          const newMisses = prev.misses + 1;
          const totalAttempts = prev.hits + newMisses;
          return {
            ...prev,
            combo: 0,
            misses: newMisses,
            accuracy: totalAttempts > 0 ? (prev.hits / totalAttempts) * 100 : 0,
          };
        });
        setFeedback("빗나감 | Miss");
        setShowFeedback(true);
        audio.playSFX("menu_navigate");
        
        // Add miss effect
        setHitEffects((prev) => [
          ...prev,
          {
            id: nextEffectId,
            position: hitPosition,
            type: "miss",
            visible: true,
          },
        ]);
        setNextEffectId((prev) => prev + 1);
        
        return false;
      }
    },
    [isTraining, audio, nextEffectId]
  );

  // Consolidated keyboard input handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      // ESC key - return to menu
      if (key === "escape") {
        onReturnToMenu();
        return;
      }

      // Training mode controls only work when training is active
      if (!isTraining) return;

      // Handle stance changes (1-8)
      if (key >= "1" && key <= "8") {
        const stanceIndex = parseInt(key) - 1;
        const stances: readonly TrigramStance[] = [
          TrigramStance.GEON,
          TrigramStance.TAE,
          TrigramStance.LI,
          TrigramStance.JIN,
          TrigramStance.SON,
          TrigramStance.GAM,
          TrigramStance.GAN,
          TrigramStance.GON,
        ];
        onPlayerUpdate({
          currentStance: stances[stanceIndex],
          lastActionTime: Date.now(),
        });
        audio.playSFX("stance_change_1");
        event.preventDefault();
      }

      // Handle attacks (Space key)
      if (key === " ") {
        // Calculate distance to dummy (at position [5, 0, 0])
        // Use squared distance to avoid expensive Math.sqrt
        const dx = player3DPosition[0] - 5;
        const dz = player3DPosition[2] - 0;
        const squaredDistance = dx * dx + dz * dz;
        const accuracy = Math.max(0, 1 - squaredDistance / 64);
        
        handleDummyHit(selectedVitalPoint ?? "generic", accuracy);
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTraining, player3DPosition, selectedVitalPoint, onPlayerUpdate, handleDummyHit, audio, onReturnToMenu]);

  // Hide feedback after delay
  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => setShowFeedback(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  // Handle hit effect completion
  const handleEffectComplete = useCallback((effectId: number) => {
    setHitEffects((prev) => prev.filter((effect) => effect.id !== effectId));
  }, []);

  // Memoize camera configuration for stable reference
  const cameraConfig = useMemo(
    () => ({
      position: [0, 8, 12] as [number, number, number],
      fov: 60,
    }),
    []
  );

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
      }}
      data-testid="training-screen-3d"
    >
      <Canvas
        style={{ width, height }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor(KOREAN_COLORS.UI_BACKGROUND_DARK, 1);
        }}
        camera={cameraConfig}
      >
        {/* Korean-themed lighting (오방색 - Five Cardinal Colors) */}
        <ambientLight intensity={0.4} color={KOREAN_COLORS.PRIMARY_CYAN} />
        
        {/* Main directional light - Center (황색/Yellow) */}
        <directionalLight
          position={[0, 10, 5]}
          intensity={1}
          color={KOREAN_COLORS.SECONDARY_YELLOW}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        {/* East (청색/Blue-Green) */}
        <pointLight
          position={[10, 5, 0]}
          intensity={0.6}
          color={KOREAN_COLORS.ACCENT_GREEN}
          distance={20}
        />
        
        {/* West (백색/White) */}
        <pointLight
          position={[-10, 5, 0]}
          intensity={0.6}
          color={KOREAN_COLORS.WHITE_SOLID}
          distance={20}
        />
        
        {/* South (적색/Red) */}
        <pointLight
          position={[0, 5, 10]}
          intensity={0.5}
          color={KOREAN_COLORS.ACCENT_RED}
          distance={20}
        />
        
        {/* North (흑색/Black) - dim for depth */}
        <pointLight
          position={[0, 5, -10]}
          intensity={0.3}
          color={KOREAN_COLORS.UI_BACKGROUND_MEDIUM}
          distance={20}
        />

        {/* Training arena ground */}
        <TrainingArena3D />

        {/* Training dummy at fixed position */}
        <TrainingDummy3D
          position={[5, 0, 0]}
          selectedVitalPoint={selectedVitalPoint}
          isTraining={isTraining}
        />

        {/* Player model (simplified for now) */}
        <group position={player3DPosition}>
          <mesh castShadow receiveShadow>
            <capsuleGeometry args={[0.4, 1.2, 16, 32]} />
            <meshStandardMaterial
              color={KOREAN_COLORS.ACCENT_GOLD}
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
        </group>

        {/* Hit effects */}
        {hitEffects.map((effect) => (
          <TrainingHitEffects3D
            key={effect.id}
            position={effect.position}
            type={effect.type}
            visible={effect.visible}
            onComplete={() => handleEffectComplete(effect.id)}
          />
        ))}

        {/* Html UI Overlays */}
        <Html fullscreen>
          <div
            style={{
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              position: "relative",
            }}
          >
            {/* Top Left - Training Controls */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                pointerEvents: "all",
              }}
            >
              <TrainingControlsHTML
                isTraining={isTraining}
                onStartTraining={handleStartTraining}
                onStopTraining={handleStopTraining}
                isMobile={isMobile}
              />
            </div>

            {/* Top Right - Training Stats */}
            <div
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                pointerEvents: "all",
              }}
            >
              <TrainingStatsHTML
                stats={stats}
                isMobile={isMobile}
              />
            </div>

            {/* Bottom Left - Mode Selector */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                pointerEvents: "all",
              }}
            >
              <TrainingModeSelectorHTML
                currentMode={trainingMode}
                onModeChange={setTrainingMode}
                isMobile={isMobile}
              />
            </div>

            {/* Bottom Right - Vital Point Panel */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                pointerEvents: "all",
              }}
            >
              <VitalPointTrainingHTML
                selectedVitalPoint={selectedVitalPoint}
                onVitalPointSelect={setSelectedVitalPoint}
                isMobile={isMobile}
              />
            </div>

            {/* Center - Feedback Message */}
            {showFeedback && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              >
                <TrainingFeedbackHTML
                  message={feedback}
                  isMobile={isMobile}
                />
              </div>
            )}
          </div>
        </Html>
      </Canvas>
    </div>
  );
};

export default TrainingScreen3D;
