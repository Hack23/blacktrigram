import { PlayerState } from "@/systems";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAudio } from "../../audio/AudioProvider";
import { TrigramStance } from "../../types/common";
import { KOREAN_COLORS } from "../../types/constants";
import { usePlayerMovement } from "../../utils/inputSystem";
import { DojangBackground } from "../game/DojangBackground";
import { ResponsivePixiPanel } from "../ui/base/ResponsivePixiComponents";
import { PlayerAnimationState, PlayerVisuals } from "../ui/PlayerVisuals";
import { StanceIndicator } from "../ui/StanceIndicator";

// Extend PIXI components for use with React
extend({
  Container,
  Graphics,
  Text,
});

export interface TrainingScreenProps {
  readonly player: PlayerState;
  readonly onPlayerUpdate: (updates: Partial<PlayerState>) => void;
  readonly onReturnToMenu: () => void;
  readonly width: number;
  readonly height: number;
  readonly x?: number;
  readonly y?: number;
}

// Training dummy state interface
interface TrainingDummy {
  readonly health: number;
  readonly maxHealth: number;
  readonly position: { x: number; y: number };
  readonly isActive: boolean;
}

// Training mode types
type TrainingMode = "basics" | "advanced" | "free";

export const TrainingScreen: React.FC<TrainingScreenProps> = (props) => {
  // pull dimensions out of props
  const {
    width = 0,
    height = 0,
    player,
    onPlayerUpdate,
    onReturnToMenu,
    x = 0,
    y = 0,
  } = props;

  const audio = useAudio();
  const [selectedStance, setSelectedStance] = useState<TrigramStance>(
    TrigramStance.GEON
  );
  const [isTraining, setIsTraining] = useState(false);
  const [trainingMode, setTrainingMode] = useState<TrainingMode>("basics");
  const [trainingStats, setTrainingStats] = useState({
    techniquesExecuted: 0,
    perfectStrikes: 0,
    totalDamage: 0,
    sessionTime: 0,
    attempts: 0,
  });

  // Track last action for animation states
  const [lastActionTime, setLastActionTime] = useState<number>(0);
  const [currentAnimation, setCurrentAnimation] =
    useState<PlayerAnimationState>("idle");

  // Initialize training dummy state
  const [dummy, setDummy] = useState<TrainingDummy>({
    health: 100,
    maxHealth: 100,
    position: { x: width * 0.7, y: height * 0.5 },
    isActive: true,
  });

  // Player movement system
  const { movementState: playerMovement, isKeyPressed } = usePlayerMovement(
    { x: width * 0.25, y: height * 0.5 },
    { width, height }
  );

  // Update player position
  useEffect(() => {
    onPlayerUpdate({ position: playerMovement.position });
  }, [playerMovement.position, onPlayerUpdate]);

  // Animation state management
  useEffect(() => {
    const now = Date.now();

    if (playerMovement.isMoving) {
      setCurrentAnimation("walk");
    } else if (now - lastActionTime < 1000) {
      // Show attack animation for 1 second after technique
      setCurrentAnimation("attack");
    } else {
      setCurrentAnimation("idle");
    }
  }, [playerMovement.isMoving, lastActionTime]);

  // Training input handling
  useEffect(() => {
    const handleTrainingInput = () => {
      // Attack with Space or Ctrl
      if (isKeyPressed("Space") || isKeyPressed("ControlLeft")) {
        handleTechniqueExecute();
      }

      // Stance changes with number keys
      if (isKeyPressed("Digit1")) handleStanceChange(TrigramStance.GEON);
      if (isKeyPressed("Digit2")) handleStanceChange(TrigramStance.TAE);
      if (isKeyPressed("Digit3")) handleStanceChange(TrigramStance.LI);
      if (isKeyPressed("Digit4")) handleStanceChange(TrigramStance.JIN);
      if (isKeyPressed("Digit5")) handleStanceChange(TrigramStance.SON);
      if (isKeyPressed("Digit6")) handleStanceChange(TrigramStance.GAM);
      if (isKeyPressed("Digit7")) handleStanceChange(TrigramStance.GAN);
      if (isKeyPressed("Digit8")) handleStanceChange(TrigramStance.GON);

      // Toggle training mode with 'T'
      if (isKeyPressed("KeyT")) handleToggleTraining();

      // Mode switching with M key
      if (isKeyPressed("KeyM")) {
        const modes: TrainingMode[] = ["basics", "advanced", "free"];
        const currentIndex = modes.indexOf(trainingMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        handleTrainingModeChange(nextMode);
      }
    };

    const interval = setInterval(handleTrainingInput, 100);
    return () => clearInterval(interval);
  }, [isKeyPressed]);

  // Responsive design calculations
  const { isMobile } = useMemo(() => {
    const isMobile = width < 768;
    return { isMobile };
  }, [width]);

  // Training session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining) {
      interval = setInterval(() => {
        setTrainingStats((prev) => ({
          ...prev,
          sessionTime: prev.sessionTime + 1,
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTraining]);

  // Handle technique execution
  const handleTechniqueExecute = useCallback(() => {
    if (!dummy.isActive) return;

    try {
      // Calculate distance to dummy
      const distance = Math.sqrt(
        Math.pow(playerMovement.position.x - dummy.position.x, 2) +
          Math.pow(playerMovement.position.y - dummy.position.y, 2)
      );

      // Only execute if close enough to dummy
      if (distance > 150) return; // Training range

      // Calculate damage based on stance and accuracy
      const baseDamage = Math.random() * 20 + 10;
      const isPerfect = Math.random() > 0.7;
      const finalDamage = isPerfect ? baseDamage * 1.5 : baseDamage;

      // Update dummy health
      setDummy((prev) => ({
        ...prev,
        health: Math.max(0, prev.health - finalDamage),
      }));

      // Update training stats
      setTrainingStats((prev) => ({
        ...prev,
        techniquesExecuted: prev.techniquesExecuted + 1,
        attempts: prev.attempts + 1,
        perfectStrikes: isPerfect
          ? prev.perfectStrikes + 1
          : prev.perfectStrikes,
        totalDamage: prev.totalDamage + finalDamage,
      }));

      // Set last action time for animation
      setLastActionTime(Date.now());

      // Safe audio playback
      try {
        if (isPerfect) {
          audio.playSFX("critical_hit");
        } else {
          audio.playSFX("hit_light");
        }
      } catch (audioError) {
        console.warn("Audio playback failed:", audioError);
      }

      // Safe player update
      try {
        onPlayerUpdate({
          ki: Math.max(0, player.ki - 5),
          stamina: Math.max(0, player.stamina - 8),
          lastActionTime: Date.now(),
        });
      } catch (updateError) {
        console.error("Player update failed:", updateError);
      }

      // Reset dummy if health reaches zero
      if (dummy.health - finalDamage <= 0) {
        setTimeout(() => {
          setDummy((prev) => ({ ...prev, health: prev.maxHealth }));
        }, 2000);
      }
    } catch (error) {
      console.error("Technique execution failed:", error);
    }
  }, [dummy, audio, onPlayerUpdate, player, playerMovement.position]);

  // Handle stance changes
  const handleStanceChange = useCallback(
    (newStance: TrigramStance) => {
      setSelectedStance(newStance);
      onPlayerUpdate({ currentStance: newStance });
      audio.playSFX("stance_change");
    },
    [onPlayerUpdate, audio]
  );

  // Toggle training mode
  const handleToggleTraining = useCallback(() => {
    const newTrainingState = !isTraining;
    setIsTraining(newTrainingState);

    if (newTrainingState) {
      // Start training session
      setTrainingStats({
        techniquesExecuted: 0,
        perfectStrikes: 0,
        totalDamage: 0,
        sessionTime: 0,
        attempts: 0,
      });
      audio.playSFX("match_start");
    } else {
      audio.playSFX("match_end");
    }
  }, [isTraining, audio]);

  // Handle training mode changes
  const handleTrainingModeChange = useCallback(
    (mode: TrainingMode) => {
      setTrainingMode(mode);
      audio.playSFX("menu_select");

      // Reset stats when changing modes
      setTrainingStats({
        techniquesExecuted: 0,
        perfectStrikes: 0,
        totalDamage: 0,
        sessionTime: 0,
        attempts: 0,
      });
    },
    [audio]
  );

  // Reset training dummy
  const handleResetDummy = useCallback(() => {
    setDummy((prev) => ({
      ...prev,
      health: prev.maxHealth,
    }));
    audio.playSFX("ki_charge");
  }, [audio]);

  // Get Korean stance names
  const getStanceNames = useCallback((stance: TrigramStance) => {
    const stanceNames = {
      [TrigramStance.GEON]: { korean: "건", technique: "천둥벽력" },
      [TrigramStance.TAE]: { korean: "태", technique: "유수연타" },
      [TrigramStance.LI]: { korean: "리", technique: "화염지창" },
      [TrigramStance.JIN]: { korean: "진", technique: "벽력일섬" },
      [TrigramStance.SON]: { korean: "손", technique: "선풍연격" },
      [TrigramStance.GAM]: { korean: "감", technique: "수류반격" },
      [TrigramStance.GAN]: { korean: "간", technique: "반석방어" },
      [TrigramStance.GON]: { korean: "곤", technique: "대지포옹" },
    };
    return stanceNames[stance] || { korean: "Unknown", technique: "Unknown" };
  }, []);

  // Get current stance info for display
  const currentStanceInfo = getStanceNames(selectedStance);

  return (
    <pixiContainer x={x} y={y} interactive={true} data-testid="training-screen">
      <DojangBackground
        width={width}
        height={height}
        lighting="traditional"
        animate={true}
        data-testid="dojang-background"
      />

      {/* Movement instructions */}
      <pixiContainer x={10} y={10} data-testid="training-instructions">
        <pixiText
          text="이동: ↑↓←→ | 공격: Space/Ctrl | 자세변경: 1-8 | 훈련모드: T | 더미에 가까이 가서 공격하세요"
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontFamily: "Noto Sans KR",
          }}
        />
      </pixiContainer>

      <pixiContainer x={width / 2} y={50} data-testid="training-header">
        <pixiText
          text="흑괘 무술 도장"
          style={{
            fontSize: isMobile ? 20 : 24,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            align: "center",
          }}
          anchor={0.5}
          data-testid="training-title"
        />
      </pixiContainer>

      {/* Training Mode Indicator */}
      <pixiContainer x={width / 2} y={80} data-testid="training-mode-indicator">
        <pixiText
          text={`훈련 모드: ${
            isTraining ? "활성" : "비활성"
          } | 수준: ${trainingMode}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: isTraining
              ? KOREAN_COLORS.POSITIVE_GREEN
              : KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
            fontFamily: "Noto Sans KR",
          }}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Training Player (moveable) */}
      <PlayerVisuals
        playerState={player}
        x={playerMovement.position.x}
        y={playerMovement.position.y}
        scale={isMobile ? 1.0 : 1.2}
        renderMode="training"
        facing="right"
        showDetails={true}
        showVitalPoints={true}
        showKiAura={true}
        showStanceIndicator={true}
        showArchetypeSymbol={true}
        interactive={true}
        onVitalPointClick={(vitalPointId) => {
          console.log(`Vital point clicked: ${vitalPointId}`);
          handleTechniqueExecute();
        }}
        onPlayerClick={() => {
          console.log("Player clicked in training");
        }}
        highlightedVitalPoints={[
          trainingMode === "basics" ? "chest_solar" : "head_temple",
        ]}
        animationState={currentAnimation}
        data-testid="training-player"
      />

      {/* Training Dummy */}
      <pixiContainer
        x={dummy.position.x}
        y={dummy.position.y}
        interactive={true}
        onPointerDown={handleTechniqueExecute}
        data-testid="training-dummy-container"
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();

            // Dummy body
            const bodyColor =
              dummy.health > 50
                ? KOREAN_COLORS.UI_STEEL_GRAY
                : KOREAN_COLORS.WARNING_ORANGE;

            g.fill({ color: bodyColor, alpha: 0.8 });
            g.roundRect(-25, -50, 50, 100, 8);
            g.fill();

            // Damage indicators
            if (dummy.health < dummy.maxHealth) {
              g.fill({ color: KOREAN_COLORS.ACCENT_RED, alpha: 0.3 });
              g.circle(0, 0, 60);
              g.fill();
            }

            // Border
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.6,
            });
            g.roundRect(-25, -50, 50, 100, 8);
            g.stroke();
          }}
          data-testid="training-dummy"
        />

        {/* Dummy Health Bar */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            const barWidth = 60;
            const barHeight = 8;
            const barY = -70;

            // Background
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
            g.roundRect(-barWidth / 2, barY, barWidth, barHeight, 3);
            g.fill();

            // Health fill
            const healthPercent = dummy.health / dummy.maxHealth;
            const healthWidth = barWidth * healthPercent;
            const healthColor =
              healthPercent > 0.6
                ? KOREAN_COLORS.POSITIVE_GREEN
                : healthPercent > 0.3
                ? KOREAN_COLORS.WARNING_YELLOW
                : KOREAN_COLORS.NEGATIVE_RED;

            g.fill({ color: healthColor, alpha: 0.9 });
            g.roundRect(-barWidth / 2, barY, healthWidth, barHeight, 3);
            g.fill();
          }}
        />

        <pixiText
          text={`${Math.ceil(dummy.health)}/${dummy.maxHealth}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
          }}
          x={0}
          y={-85}
          anchor={0.5}
        />

        <pixiText
          text="훈련 더미"
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
            fontFamily: "Noto Sans KR",
          }}
          x={0}
          y={60}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Distance indicator */}
      <pixiContainer
        x={width / 2}
        y={height - 120}
        data-testid="distance-indicator"
      >
        <pixiText
          text={`더미까지 거리: ${Math.round(
            Math.sqrt(
              Math.pow(playerMovement.position.x - dummy.position.x, 2) +
                Math.pow(playerMovement.position.y - dummy.position.y, 2)
            )
          )} (150 이하에서 공격 가능)`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
            fontFamily: "Noto Sans KR",
          }}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Current Stance Display */}
      <pixiContainer
        x={width / 2}
        y={height - 90}
        data-testid="current-stance-display"
      >
        <pixiText
          text={`현재 자세: ${currentStanceInfo.korean} (${currentStanceInfo.technique})`}
          style={{
            fontSize: isMobile ? 11 : 13,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            align: "center",
            fontFamily: "Noto Sans KR",
            fontWeight: "bold",
          }}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Current Stance Indicator */}
      <StanceIndicator
        stance={selectedStance}
        x={isMobile ? width / 2 : width * 0.25}
        y={height - (isMobile ? 140 : 160)}
        data-testid="current-stance-indicator"
      />

      {/* Training Controls Panel */}
      <ResponsivePixiPanel
        title="훈련 제어"
        x={isMobile ? 10 : 20}
        y={isMobile ? 100 : 120}
        width={isMobile ? width * 0.45 : 250}
        height={isMobile ? 200 : 240}
        screenWidth={width}
        screenHeight={height}
        data-testid="training-controls"
      >
        <pixiContainer x={10} y={30}>
          {/* Training Stats */}
          <pixiText
            text="훈련 통계"
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
          />

          <pixiText
            text={`시도: ${trainingStats.attempts}`}
            style={{
              fontSize: isMobile ? 9 : 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
            }}
            y={20}
          />

          <pixiText
            text={`완벽한 타격: ${trainingStats.perfectStrikes}`}
            style={{
              fontSize: isMobile ? 9 : 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
            }}
            y={35}
          />

          <pixiText
            text={`총 데미지: ${Math.round(trainingStats.totalDamage)}`}
            style={{
              fontSize: isMobile ? 9 : 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
            }}
            y={50}
          />

          <pixiText
            text={`정확도: ${
              trainingStats.attempts > 0
                ? Math.round(
                    (trainingStats.perfectStrikes / trainingStats.attempts) *
                      100
                  )
                : 0
            }%`}
            style={{
              fontSize: isMobile ? 9 : 10,
              fill: KOREAN_COLORS.ACCENT_CYAN,
              fontFamily: "Noto Sans KR",
            }}
            y={65}
          />

          <pixiText
            text={`세션 시간: ${Math.floor(
              trainingStats.sessionTime / 60
            )}:${String(trainingStats.sessionTime % 60).padStart(2, "0")}`}
            style={{
              fontSize: isMobile ? 9 : 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
            }}
            y={80}
          />

          {/* Control Buttons */}
          <pixiContainer
            x={0}
            y={100}
            interactive={true}
            onPointerDown={handleToggleTraining}
            data-testid="toggle-training-button"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: isTraining
                    ? KOREAN_COLORS.ACCENT_RED
                    : KOREAN_COLORS.POSITIVE_GREEN,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, 80, 25, 4);
                g.fill();
              }}
            />
            <pixiText
              text={isTraining ? "훈련 종료" : "훈련 시작"}
              style={{
                fontSize: isMobile ? 9 : 10,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                align: "center",
                fontFamily: "Noto Sans KR",
              }}
              x={40}
              y={12.5}
              anchor={0.5}
            />
          </pixiContainer>

          {/* Reset Button */}
          <pixiContainer
            x={90}
            y={100}
            interactive={true}
            onPointerDown={handleResetDummy}
            data-testid="reset-dummy-button"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({ color: KOREAN_COLORS.ACCENT_GREEN, alpha: 0.8 });
                g.roundRect(0, 0, 80, 25, 4);
                g.fill();
              }}
            />
            <pixiText
              text="더미 리셋"
              style={{
                fontSize: isMobile ? 9 : 10,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                align: "center",
                fontFamily: "Noto Sans KR",
              }}
              x={40}
              y={12.5}
              anchor={0.5}
            />
          </pixiContainer>
        </pixiContainer>
      </ResponsivePixiPanel>

      {/* Return to Menu Button */}
      <pixiContainer
        x={width - (isMobile ? 80 : 120)}
        y={isMobile ? 10 : 20}
        interactive={true}
        onPointerDown={onReturnToMenu}
        data-testid="return-menu-button"
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_STEEL_GRAY, alpha: 0.8 });
            g.roundRect(0, 0, isMobile ? 70 : 100, isMobile ? 30 : 40, 8);
            g.fill();
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.8,
            });
            g.roundRect(0, 0, isMobile ? 70 : 100, isMobile ? 30 : 40, 8);
          }}
        />
        <pixiText
          text="메뉴로"
          style={{
            fontSize: isMobile ? 10 : 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
          }}
          x={(isMobile ? 70 : 100) / 2}
          y={(isMobile ? 30 : 40) / 2}
          anchor={0.5}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

const TrainingScreenWrapper: React.FC<TrainingScreenProps> = (props) => {
  return <TrainingScreen {...props} />;
};

export default TrainingScreenWrapper;
