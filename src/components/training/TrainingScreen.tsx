import { PlayerState } from "@/systems";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AudioProvider, useAudio } from "../../audio/AudioProvider";
import { TrigramStance } from "../../types/common";
import { KOREAN_COLORS } from "../../types/constants";
import { DojangBackground } from "../game/DojangBackground";
import { ResponsivePixiPanel } from "../ui/base/ResponsivePixiComponents";
import { PlayerVisuals } from "../ui/PlayerVisuals";
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
    <pixiContainer
      x={x}
      y={y}
      interactive={true} /* Make the entire container interactive */
      data-testid="training-screen"
    >
      <DojangBackground
        width={width}
        height={height}
        lighting="normal"
        animate={true}
        data-testid="dojang-background"
      />

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

        <pixiContainer
          x={10}
          y={30}
          data-testid="mode-basics-container"
          interactive={true}
          onPointerDown={() => setTrainingMode("basics")}
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color:
                  trainingMode === "basics"
                    ? KOREAN_COLORS.PRIMARY_CYAN
                    : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                alpha: 0.8,
              });
              g.roundRect(0, 0, 60, 25, 5);
              g.fill();
            }}
          />
          <pixiText
            text="기초"
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              align: "center",
            }}
            x={30}
            y={12.5}
            anchor={0.5}
          />
        </pixiContainer>

        <pixiContainer
          x={80}
          y={30}
          data-testid="mode-advanced-container"
          interactive={true}
          onPointerDown={() => setTrainingMode("advanced")}
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color:
                  trainingMode === "advanced"
                    ? KOREAN_COLORS.PRIMARY_CYAN
                    : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                alpha: 0.8,
              });
              g.roundRect(0, 0, 60, 25, 5);
              g.fill();
            }}
          />
          <pixiText
            text="고급"
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              align: "center",
            }}
            x={30}
            y={12.5}
            anchor={0.5}
          />
        </pixiContainer>

        <pixiContainer
          x={150}
          y={30}
          data-testid="mode-free-container"
          interactive={true}
          onPointerDown={() => setTrainingMode("free")}
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color:
                  trainingMode === "free"
                    ? KOREAN_COLORS.PRIMARY_CYAN
                    : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                alpha: 0.8,
              });
              g.roundRect(0, 0, 60, 25, 5);
              g.fill();
            }}
          />
          <pixiText
            text="자유"
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              align: "center",
            }}
            x={30}
            y={12.5}
            anchor={0.5}
          />
        </pixiContainer>

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

      <PlayerVisuals
        playerState={player}
        x={width * 0.25}
        y={height * 0.5}
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
          // Add vital point training logic here
          handleTechniqueExecute();
        }}
        onPlayerClick={() => {
          console.log("Player clicked in training");
        }}
        highlightedVitalPoints={[
          // Highlight based on current stance or training mode
          trainingMode === "basics" ? "chest_solar" : "head_temple",
        ]}
        animationState={
          isTraining && trainingStats.attempts > 0
            ? "technique_execute"
            : "idle"
        }
        data-testid="training-player"
      />

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
          data-testid="training-dummy"
        />

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
      </pixiContainer>

      <pixiContainer x={1050} y={650} data-testid="training-trigram-wheel">
        {trigramStances.map((stance) => (
          <pixiContainer
            key={stance}
            data-testid={`trigram-stance-${stance}`}
            interactive={true}
            onPointerDown={() => handleStanceChange(stance)}
          >
            <pixiText
              text={stance}
              style={{ fontSize: 14, fill: KOREAN_COLORS.TEXT_PRIMARY }}
              anchor={0.5}
            />
          </pixiContainer>
        ))}
      </pixiContainer>

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

        <pixiContainer
          x={-40}
          y={20}
          interactive={true}
          onPointerDown={() => handleStanceChange(TrigramStance.GEON)}
          data-testid="stance-geon-button-container"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color:
                  selectedStance === TrigramStance.GEON
                    ? KOREAN_COLORS.PRIMARY_CYAN
                    : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                alpha: 0.8,
              });
              g.roundRect(0, 0, 25, 25, 5);
              g.fill();
            }}
          />
          <pixiText
            text="건"
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              align: "center",
            }}
            x={12.5}
            y={12.5}
            anchor={0.5}
          />
        </pixiContainer>
      </pixiContainer>

      <StanceIndicator
        stance={selectedStance}
        x={isMobile ? width / 2 : width * 0.25}
        y={height - (isMobile ? 120 : 140)}
        data-testid="current-stance-indicator"
      />

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
        <pixiContainer
          x={10}
          y={10}
          interactive={true}
          onPointerDown={handleToggleTraining}
          data-testid="start-training-button-container"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color: isTraining
                  ? KOREAN_COLORS.ACCENT_RED
                  : KOREAN_COLORS.ACCENT_GREEN,
                alpha: 0.8,
              });
              g.roundRect(0, 0, isMobile ? width * 0.35 : 200, 35, 5);
              g.fill();
            }}
          />
          <pixiText
            text={isTraining ? "훈련 정지" : "훈련 시작"}
            style={{
              fontSize: isMobile ? 12 : 14,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              align: "center",
            }}
            x={(isMobile ? width * 0.35 : 200) / 2}
            y={17.5}
            anchor={0.5}
          />
        </pixiContainer>

        {isTraining && (
          <pixiContainer
            x={10}
            y={55}
            interactive={true}
            onPointerDown={handleTechniqueExecute}
            data-testid="execute-technique-button-container"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({ color: KOREAN_COLORS.ACCENT_CYAN, alpha: 0.8 });
                g.roundRect(0, 0, isMobile ? width * 0.35 : 200, 35, 5);
                g.fill();
              }}
            />
            <pixiText
              text={`${getStanceNames(selectedStance).technique} 실행`}
              style={{
                fontSize: isMobile ? 12 : 14,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                align: "center",
              }}
              x={(isMobile ? width * 0.35 : 200) / 2}
              y={17.5}
              anchor={0.5}
            />
          </pixiContainer>
        )}

        <pixiContainer
          x={10}
          y={100}
          interactive={true}
          onPointerDown={handleResetDummy}
          data-testid="reset-dummy-button-container"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.8 });
              g.roundRect(0, 0, isMobile ? width * 0.35 : 200, 30, 5);
              g.fill();
            }}
          />
          <pixiText
            text="더미 리셋"
            style={{
              fontSize: isMobile ? 12 : 14,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              align: "center",
            }}
            x={(isMobile ? width * 0.35 : 200) / 2}
            y={15}
            anchor={0.5}
          />
        </pixiContainer>

        <pixiContainer
          x={10}
          y={140}
          interactive={true}
          onPointerDown={handleEvaluate}
          data-testid="evaluate-button-container"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.8 });
              g.roundRect(0, 0, isMobile ? width * 0.35 : 200, 30, 5);
              g.fill();
            }}
          />
          <pixiText
            text="평가"
            style={{
              fontSize: isMobile ? 12 : 14,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              align: "center",
            }}
            x={(isMobile ? width * 0.35 : 200) / 2}
            y={15}
            anchor={0.5}
          />
        </pixiContainer>
      </ResponsivePixiPanel>

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

        <pixiText
          text={`경험치: ${player.experiencePoints || 0}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.ACCENT_CYAN,
          }}
          x={10}
          y={135}
        />

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

      <pixiContainer
        x={isMobile ? width / 2 - 80 : width / 2 - 100}
        y={height - (isMobile ? 40 : 50)}
        interactive={true}
        onPointerDown={onReturnToMenu}
        data-testid="return-to-menu-button-container"
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.8 });
            g.roundRect(0, 0, isMobile ? 160 : 200, isMobile ? 30 : 40, 5);
            g.fill();
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.PRIMARY_CYAN,
              alpha: 0.8,
            });
            g.roundRect(0, 0, isMobile ? 160 : 200, isMobile ? 30 : 40, 5);
            g.stroke();
          }}
        />
        <pixiText
          text="메뉴로 돌아가기"
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
          }}
          x={(isMobile ? 160 : 200) / 2}
          y={(isMobile ? 30 : 40) / 2}
          anchor={0.5}
        />
      </pixiContainer>

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
    </pixiContainer>
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
