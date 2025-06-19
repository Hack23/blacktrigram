import React, { useState, useCallback, useMemo, useEffect } from "react";
import { DojangBackground } from "../combat/backgrounds/DojangBackground"; // Fix import path
import { StanceIndicator } from "../ui/StanceIndicator";
import {
  ResponsivePixiContainer,
  ResponsivePixiButton,
  ResponsivePixiPanel,
} from "../ui/base/ResponsivePixiComponents";
import { KOREAN_COLORS } from "../../types/constants";
import { TrigramStance } from "../../types/enums";
import type { PlayerState } from "../../types/player";
import { AudioProvider, useAudio } from "../../audio/AudioProvider";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";

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
    attempts: 0, // Add attempts counter for tests
  });

  // Initialize training dummy state
  const [dummy, setDummy] = useState<TrainingDummy>({
    health: 100,
    maxHealth: 100,
    position: { x: width * 0.7, y: height * 0.5 },
    isActive: true,
  });

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

  // Handle technique execution - Fixed to properly update PlayerState
  // Add better error boundaries for audio
  const handleTechniqueExecute = useCallback(() => {
    if (!dummy.isActive) return;

    try {
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

      // Safe audio playback
      try {
        if (isPerfect) {
          audio.playSFX("perfect_strike");
        } else {
          audio.playSFX("attack_medium");
        }
      } catch (audioError) {
        console.warn("Audio playback failed:", audioError);
      }

      // Safe player update
      try {
        onPlayerUpdate({
          experiencePoints:
            (player.experiencePoints || 0) + (isPerfect ? 15 : 10),
          health: player.health,
          stamina: Math.max(0, player.stamina - 5),
          balance: player.balance,
          consciousness: player.consciousness,
          pain: player.pain,
        });
      } catch (updateError) {
        console.warn("Player update failed:", updateError);
      }

      // Reset dummy if health reaches zero
      if (dummy.health - finalDamage <= 0) {
        setTimeout(() => {
          setDummy((prev) => ({
            ...prev,
            health: prev.maxHealth,
          }));
        }, 2000);
      }
    } catch (error) {
      console.error("Technique execution failed:", error);
    }
  }, [dummy, audio, onPlayerUpdate, player]);

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
    setIsTraining(!isTraining);
    if (!isTraining) {
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

  // Reset training dummy
  const handleResetDummy = useCallback(() => {
    setDummy((prev) => ({
      ...prev,
      health: prev.maxHealth,
    }));
    audio.playSFX("ki_charge");
  }, [audio]);

  // Handle training evaluation
  const handleEvaluate = useCallback(() => {
    audio.playSFX("menu_select");
    // Training evaluation logic here
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

  // list of available stances
  const trigramStances = Object.values(TrigramStance);

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={width}
      screenHeight={height}
      data-testid="training-screen"
    >
      {/* Dojang Background */}
      <DojangBackground
        width={width}
        height={height}
        lighting="normal"
        animate={true}
        data-testid="dojang-background"
      />

      {/* Training Header */}
      <pixiContainer x={width / 2} y={30} data-testid="training-header">
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

      {/* Training Area Grid */}
      <pixiContainer data-testid="training-area">
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.2,
            });

            // Draw training mat grid
            const gridSize = isMobile ? 40 : 60;
            for (let i = 0; i < width; i += gridSize) {
              g.moveTo(i, 0);
              g.lineTo(i, height);
            }
            for (let j = 0; j < height; j += gridSize) {
              g.moveTo(0, j);
              g.lineTo(width, j);
            }
            g.stroke();

            // Training circle
            g.stroke({
              width: 3,
              color: KOREAN_COLORS.PRIMARY_CYAN,
              alpha: 0.5,
            });
            g.circle(width * 0.5, height * 0.6, Math.min(width, height) * 0.15);
            g.stroke();
          }}
          data-testid="training-grid"
        />
      </pixiContainer>

      {/* Training Mode Selection Panel */}
      <ResponsivePixiPanel
        title="수련 모드 선택"
        x={isMobile ? 10 : 20}
        y={isMobile ? 60 : 80}
        width={isMobile ? width * 0.45 : 250}
        height={isMobile ? 100 : 120}
        screenWidth={width}
        screenHeight={height}
        data-testid="training-mode-stances"
      >
        <pixiText
          text="훈련 모드:"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
          }}
          x={10}
          y={10}
          data-testid="mode-title"
        />

        {/* Mode Selection Buttons */}
        <ResponsivePixiButton
          text="기초"
          x={10}
          y={30}
          width={60}
          height={25}
          screenWidth={width}
          screenHeight={height}
          variant={trainingMode === "basics" ? "primary" : "secondary"}
          onClick={() => setTrainingMode("basics")}
          data-testid="mode-basics"
        />

        <ResponsivePixiButton
          text="고급"
          x={80}
          y={30}
          width={60}
          height={25}
          screenWidth={width}
          screenHeight={height}
          variant={trainingMode === "advanced" ? "primary" : "secondary"}
          onClick={() => setTrainingMode("advanced")}
          data-testid="mode-advanced"
        />

        <ResponsivePixiButton
          text="자유"
          x={150}
          y={30}
          width={60}
          height={25}
          screenWidth={width}
          screenHeight={height}
          variant={trainingMode === "free" ? "primary" : "secondary"}
          onClick={() => setTrainingMode("free")}
          data-testid="mode-free"
        />

        {/* Display current mode for testing */}
        <pixiText
          text={`현재 모드: ${trainingMode}`}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          x={10}
          y={65}
          data-testid="training-mode-display"
        />
      </ResponsivePixiPanel>

      {/* Player Character */}
      <pixiContainer
        x={width * 0.25}
        y={height * 0.5}
        data-testid="training-player"
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();

            // Player body
            g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.8 });
            g.circle(0, -40, 15); // Head
            g.rect(-8, -25, 16, 40); // Body
            g.rect(-6, 15, 5, 25); // Left leg
            g.rect(1, 15, 5, 25); // Right leg
            g.rect(-15, -20, 10, 5); // Left arm
            g.rect(5, -20, 10, 5); // Right arm
            g.fill();

            // Player outline
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.6,
            });
            g.circle(0, -40, 15);
            g.rect(-8, -25, 16, 40);
            g.stroke();

            // Stance indicator glow
            if (isTraining) {
              g.fill({ color: KOREAN_COLORS.ACCENT_GREEN, alpha: 0.3 });
              g.circle(0, 0, 50);
              g.fill();
            }
          }}
          scale={{ x: isMobile ? 0.8 : 1.0, y: isMobile ? 0.8 : 1.0 }}
        />

        <pixiText
          text={player.name.korean}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
            fontWeight: "bold",
          }}
          x={0}
          y={-80}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Training Dummy Container */}
      <ResponsivePixiContainer
        x={dummy.position.x}
        y={dummy.position.y}
        screenWidth={width}
        screenHeight={height}
        data-testid="training-dummy-container"
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();

            // Dummy body
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.8 });
            g.roundRect(-30, -60, 60, 120, 10);
            g.fill();

            // Dummy head
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_LIGHT, alpha: 0.9 });
            g.circle(0, -80, 25);
            g.fill();

            // Target zones (vital points)
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.6,
            });
            g.circle(0, -80, 15); // Head
            g.circle(0, -40, 10); // Chest
            g.circle(0, -10, 8); // Solar plexus
            g.circle(0, 20, 12); // Abdomen
            g.stroke();

            // Damage indicator
            if (dummy.health < dummy.maxHealth) {
              g.fill({ color: KOREAN_COLORS.ACCENT_RED, alpha: 0.4 });
              g.circle(0, 0, 40);
              g.fill();
            }
          }}
          interactive={true}
          onPointerDown={handleTechniqueExecute}
          data-testid="training-dummy"
        />

        {/* Dummy Health Display */}
        <pixiGraphics
          draw={(g) => {
            g.clear();

            // Health bar background
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
            g.rect(-40, -100, 80, 8);
            g.fill();

            // Health bar fill
            const healthPercent = dummy.health / dummy.maxHealth;
            g.fill({
              color:
                healthPercent > 0.5
                  ? KOREAN_COLORS.ACCENT_GREEN
                  : healthPercent > 0.25
                  ? KOREAN_COLORS.ACCENT_GOLD
                  : KOREAN_COLORS.ACCENT_RED,
              alpha: 0.9,
            });
            g.rect(-40, -100, 80 * healthPercent, 8);
            g.fill();

            // Health bar border
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.8,
            });
            g.rect(-40, -100, 80, 8);
            g.stroke();
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
          y={-115}
          anchor={0.5}
        />
      </ResponsivePixiContainer>

      {/* Trigram Wheel for Stance Selection */}
      <ResponsivePixiContainer
        data-testid="training-trigram-wheel"
        x={1050}
        y={650}
      >
        {trigramStances.map((stance) => (
          <pixiContainer
            key={stance}
            data-testid={`trigram-stance-${stance}`}
            interactive={true}
            onPointerDown={() => handleStanceChange(stance)}
          >
            {/* Optionally draw a simple indicator */}
            <pixiText
              text={stance}
              style={{ fontSize: 14, fill: KOREAN_COLORS.TEXT_PRIMARY }}
              anchor={0.5}
            />
          </pixiContainer>
        ))}
      </ResponsivePixiContainer>

      {/* Stance Selection Area for Testing */}
      <pixiContainer
        x={width - (isMobile ? 120 : 150)}
        y={height - (isMobile ? 200 : 220)}
        data-testid="stance-selection"
      >
        <pixiText
          text="자세 선택"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
          }}
          anchor={0.5}
        />

        {/* Individual stance buttons for testing */}
        <ResponsivePixiButton
          text="건"
          x={-40}
          y={20}
          width={25}
          height={25}
          screenWidth={width}
          screenHeight={height}
          variant={
            selectedStance === TrigramStance.GEON ? "primary" : "secondary"
          }
          onClick={() => handleStanceChange(TrigramStance.GEON)}
          data-testid="stance-geon-button"
        />
      </pixiContainer>

      {/* Current Stance Indicator */}
      <StanceIndicator
        stance={selectedStance}
        x={isMobile ? width / 2 : width * 0.25}
        y={height - (isMobile ? 120 : 140)}
        data-testid="current-stance-indicator"
      />

      {/* Training Controls Panel */}
      <ResponsivePixiPanel
        title="훈련 제어"
        x={isMobile ? 10 : 20}
        y={isMobile ? 200 : 220}
        width={isMobile ? width * 0.45 : 250}
        height={isMobile ? 140 : 180}
        screenWidth={width}
        screenHeight={height}
        data-testid="training-controls"
      >
        {/* Training Toggle Button */}
        <ResponsivePixiButton
          text={isTraining ? "훈련 정지" : "훈련 시작"}
          x={10}
          y={10}
          width={isMobile ? width * 0.35 : 200}
          height={35}
          screenWidth={width}
          screenHeight={height}
          variant={isTraining ? "secondary" : "primary"}
          onClick={handleToggleTraining}
          data-testid="start-training-button"
        />

        {/* Execute Technique Button */}
        {isTraining && (
          <ResponsivePixiButton
            text={`${getStanceNames(selectedStance).technique} 실행`}
            x={10}
            y={55}
            width={isMobile ? width * 0.35 : 200}
            height={35}
            screenWidth={width}
            screenHeight={height}
            variant="primary"
            onClick={handleTechniqueExecute}
            data-testid="execute-technique-button"
          />
        )}

        {/* Reset Dummy Button */}
        <ResponsivePixiButton
          text="더미 리셋"
          x={10}
          y={100}
          width={isMobile ? width * 0.35 : 200}
          height={30}
          screenWidth={width}
          screenHeight={height}
          variant="secondary"
          onClick={handleResetDummy}
          data-testid="reset-dummy-button"
        />

        {/* Evaluate Button */}
        <ResponsivePixiButton
          text="평가"
          x={10}
          y={140}
          width={isMobile ? width * 0.35 : 200}
          height={30}
          screenWidth={width}
          screenHeight={height}
          variant="secondary"
          onClick={handleEvaluate}
          data-testid="evaluate-button"
        />
      </ResponsivePixiPanel>

      {/* Training Statistics Panel */}
      <ResponsivePixiPanel
        title="훈련 통계"
        x={width - (isMobile ? width * 0.45 + 10 : 270)}
        y={isMobile ? 200 : 220}
        width={isMobile ? width * 0.45 : 250}
        height={isMobile ? 140 : 180}
        screenWidth={width}
        screenHeight={height}
        data-testid="training-stats-panel"
      >
        <pixiText
          text="훈련 통계"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
          }}
          x={10}
          y={-5}
          data-testid="stats-title"
        />

        <pixiText
          text={`시도: ${trainingStats.attempts}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
          }}
          x={10}
          y={15}
          data-testid="attempts-count"
        />

        <pixiText
          text={`기술 실행: ${trainingStats.techniquesExecuted}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
          }}
          x={10}
          y={35}
        />

        <pixiText
          text={`완벽한 타격: ${trainingStats.perfectStrikes}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.ACCENT_GREEN,
          }}
          x={10}
          y={55}
        />

        <pixiText
          text={`총 데미지: ${Math.ceil(trainingStats.totalDamage)}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.ACCENT_GOLD,
          }}
          x={10}
          y={75}
        />

        <pixiText
          text={`세션 시간: ${Math.floor(
            trainingStats.sessionTime / 60
          )}:${String(trainingStats.sessionTime % 60).padStart(2, "0")}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          x={10}
          y={95}
          data-testid="session-time"
        />

        {/* Current stance info */}
        <pixiText
          text={`현재 자세: ${getStanceNames(selectedStance).korean}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.PRIMARY_CYAN,
            fontWeight: "bold",
          }}
          x={10}
          y={115}
        />

        {/* Player experience display */}
        <pixiText
          text={`경험치: ${player.experiencePoints || 0}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.ACCENT_CYAN,
          }}
          x={10}
          y={135}
        />

        {/* Feedback message placeholder */}
        <pixiText
          text="계속 연습하세요!"
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontStyle: "italic",
          }}
          x={10}
          y={155}
          data-testid="feedback-message"
        />
      </ResponsivePixiPanel>

      {/* Return to Menu Button */}
      <ResponsivePixiButton
        text="메뉴로 돌아가기"
        x={isMobile ? width / 2 - 80 : width / 2 - 100}
        y={height - (isMobile ? 40 : 50)}
        width={isMobile ? 160 : 200}
        height={isMobile ? 30 : 40}
        screenWidth={width}
        screenHeight={height}
        variant="secondary"
        onClick={onReturnToMenu}
        data-testid="return-to-menu-button" // Fix: Consistent naming
      />

      {/* Training Status Overlay */}
      {isTraining && (
        <pixiContainer x={width / 2} y={50} data-testid="training-status">
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.ACCENT_GREEN, alpha: 0.8 });
              g.roundRect(-60, -15, 120, 30, 8);
              g.fill();
            }}
          />
          <pixiText
            text="훈련 중"
            style={{
              fontSize: isMobile ? 14 : 16,
              fill: KOREAN_COLORS.BLACK_SOLID,
              fontWeight: "bold",
              align: "center",
            }}
            anchor={0.5}
          />
        </pixiContainer>
      )}
    </ResponsivePixiContainer>
  );
};

const TrainingScreenWrapper: React.FC<TrainingScreenProps> = (props) => {
  return (
    <AudioProvider>
      <TrainingScreen {...props} width={props.width} height={props.height} />
    </AudioProvider>
  );
};

export default TrainingScreenWrapper;
