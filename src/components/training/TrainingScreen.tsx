import { PlayerState } from "@/systems";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAudio } from "../../audio/AudioProvider";
import { TrigramStance } from "../../types/common";
import { KOREAN_COLORS } from "../../types/constants";
import { usePlayerMovement } from "../../utils/inputSystem";
import { DojangBackground } from "../game/DojangBackground";
import { KoreanHeader } from "../ui/KoreanHeader";
import { PlayerVisuals } from "../ui/PlayerVisuals";
import { TrainingControlsPanel } from "./components/TrainingControlsPanel";
import { TrainingDummy } from "./components/TrainingDummy";
import { TrainingFeedback } from "./components/TrainingFeedback";
import { TrainingModeSelector } from "./components/TrainingModeSelector";
import { TrainingStatsPanel } from "./components/TrainingStatsPanel";

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

// Training mode types
type TrainingMode = "basics" | "advanced" | "free";

export const TrainingScreen: React.FC<TrainingScreenProps> = ({
  player,
  onPlayerUpdate,
  onReturnToMenu,
  width,
  height,
  x = 0,
  y = 0,
}) => {
  const audio = useAudio();
  const [trainingMode, setTrainingMode] = useState<TrainingMode>("basics");
  const [isTraining, setIsTraining] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState<string>("");

  // Layout constants
  const layoutConstants = useMemo(
    () => ({
      padding: 20,
      headerHeight: 80,
      controlsHeight: 120,
      footerHeight: 60,
    }),
    []
  );

  // Responsive layout detection
  const isMobile = useMemo(() => width < 768, [width]);

  // Player movement system
  const { movementState: playerMovement } = usePlayerMovement(
    { x: width * 0.3, y: height * 0.6 },
    { width, height }
  );

  // Training session management
  const startTraining = useCallback(() => {
    setIsTraining(true);
    setScore(0);
    setCombo(0);
    setFeedback("훈련 시작! | Training Started!");
    audio.playSFX("training_start");
  }, [audio]);

  const stopTraining = useCallback(() => {
    setIsTraining(false);
    setFeedback("훈련 완료! | Training Complete!");
    audio.playSFX("training_end");
  }, [audio]);

  // Handle training attacks
  const handleTrainingAttack = useCallback(
    (distance: number): boolean => {
      if (!isTraining) return false;

      if (distance < 100) {
        // Successful hit
        const points = 10 + combo * 2;
        setScore((prev) => prev + points);
        setCombo((prev) => prev + 1);
        setFeedback(`좋은 공격! +${points}점 | Good Hit! +${points} points`);
        audio.playSFX("hit_success");
        return true;
      } else {
        // Miss
        setCombo(0);
        setFeedback("빗나감! | Missed!");
        audio.playSFX("miss");
        return false;
      }
    },
    [isTraining, combo, audio]
  );

  // Handle stance changes
  const handleStanceChange = useCallback(
    (stance: TrigramStance) => {
      onPlayerUpdate({ currentStance: stance });
      setFeedback(`자세 변경: ${stance} | Stance Changed: ${stance}`);
      audio.playSFX("stance_change");
    },
    [onPlayerUpdate, audio]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onReturnToMenu();
        return;
      }

      if (event.key === " ") {
        const distance = Math.sqrt(
          Math.pow(playerMovement.position.x - width * 0.7, 2) +
            Math.pow(playerMovement.position.y - height * 0.6, 2)
        );
        handleTrainingAttack(distance);
      }

      if (event.key === "Enter") {
        if (isTraining) {
          stopTraining();
        } else {
          startTraining();
        }
      }

      // Stance changes (1-8)
      const stanceKey = parseInt(event.key);
      if (stanceKey >= 1 && stanceKey <= 8) {
        const stances = Object.values(TrigramStance);
        if (stances[stanceKey - 1]) {
          handleStanceChange(stances[stanceKey - 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleTrainingAttack,
    handleStanceChange,
    isTraining,
    startTraining,
    stopTraining,
    onReturnToMenu,
    playerMovement.position,
    width,
    height,
  ]);

  // Get player animation state
  const getPlayerAnimationState = useCallback(() => {
    if (playerMovement.isMoving) return "walk";
    if (isTraining) return "idle";
    return "idle";
  }, [playerMovement.isMoving, isTraining]);

  return (
    <pixiContainer
      data-testid="training-screen"
      layout={{
        width,
        height,
        position: "absolute",
        top: y,
        left: x,
      }}
    >
      {/* Dojang Background */}
      <DojangBackground
        width={width}
        height={height}
        lighting="traditional"
        animate={true}
      />

      {/* Main Layout Container */}
      <pixiContainer
        layout={{
          width,
          height,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: layoutConstants.padding,
        }}
      >
        {/* Header Section with Korean Title */}
        <pixiContainer
          layout={{
            width: "100%",
            height: layoutConstants.headerHeight,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          data-testid="training-header"
        >
          <KoreanHeader
            title={{ korean: "훈련장", english: "Training Dojang" }}
            subtitle={{
              korean: "무술 수련의 장",
              english: "Place of Martial Arts Practice",
            }}
            x={0}
            y={0}
            data-testid="training-title"
          />

          {/* Training Mode Selector */}
          <TrainingModeSelector
            currentMode={trainingMode}
            onModeChange={setTrainingMode}
            x={0}
            y={40}
            width={isMobile ? width * 0.8 : 400}
            height={30}
            isMobile={isMobile}
            data-testid="mode-selector"
          />
        </pixiContainer>

        {/* Training Arena */}
        <pixiContainer
          data-testid="training-arena"
          layout={{
            width: "100%",
            flexGrow: 1,
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Player Visuals */}
          <PlayerVisuals
            playerState={{
              ...player,
              position: playerMovement.position,
            }}
            x={playerMovement.position.x}
            y={playerMovement.position.y}
            scale={isMobile ? 0.8 : 1.0}
            renderMode="training"
            facing="right"
            showDetails={true}
            showVitalPoints={trainingMode === "advanced"}
            showKiAura={true}
            showKoreanLabels={true}
            interactive={true}
            onPlayerClick={() => console.log("Player clicked")}
            animationState={getPlayerAnimationState()}
            data-testid="training-player"
          />

          {/* Training Dummy */}
          <TrainingDummy
            x={width * 0.7}
            y={height * 0.6}
            playerPosition={playerMovement.position}
            trainingMode={trainingMode}
            onHit={handleTrainingAttack}
            isTraining={isTraining}
            data-testid="training-dummy"
          />

          {/* Training Feedback Display */}
          <TrainingFeedback
            feedback={feedback}
            score={score}
            combo={combo}
            x={width / 2}
            y={height * 0.3}
            visible={!!feedback}
            isMobile={isMobile}
            data-testid="feedback-display"
          />
        </pixiContainer>

        {/* Controls Section */}
        <pixiContainer
          layout={{
            width: "100%",
            height: layoutConstants.controlsHeight,
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 20,
            flexShrink: 0,
          }}
          data-testid="training-controls"
        >
          {/* Training Controls Panel */}
          <TrainingControlsPanel
            isTraining={isTraining}
            onStartTraining={startTraining}
            onStopTraining={stopTraining}
            width={isMobile ? width * 0.45 : 300}
            height={layoutConstants.controlsHeight - 10}
            isMobile={isMobile}
            data-testid="training-controls-panel"
          />

          {/* Player Status Panel */}
          <TrainingStatsPanel
            player={player}
            score={score}
            combo={combo}
            isTraining={isTraining}
            width={isMobile ? width * 0.45 : 300}
            height={layoutConstants.controlsHeight - 10}
            isMobile={isMobile}
            data-testid="player-status-panel"
          />
        </pixiContainer>

        {/* Footer Section */}
        <pixiContainer
          layout={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: layoutConstants.footerHeight,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 20,
            paddingRight: 20,
          }}
          data-testid="training-footer"
        >
          {/* Footer Background */}
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
              g.rect(0, 0, width, layoutConstants.footerHeight);
              g.fill();

              g.stroke({
                width: 1,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.5,
              });
              g.moveTo(0, 0);
              g.lineTo(width, 0);
              g.stroke();
            }}
            layout={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />

          {/* Instructions */}
          <pixiText
            text={
              isMobile
                ? "ESC - 메뉴 | Menu"
                : "ESC - 메뉴로 돌아가기 | Return to Menu • Enter - 훈련 시작/중지 | Start/Stop Training"
            }
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
            }}
          />

          {/* Return Button */}
          <pixiContainer
            interactive={true}
            onPointerDown={onReturnToMenu}
            data-testid="return-button"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({ color: KOREAN_COLORS.ACCENT_RED, alpha: 0.8 });
                g.roundRect(0, 0, isMobile ? 80 : 120, 30, 5);
                g.fill();

                g.stroke({
                  width: 2,
                  color: KOREAN_COLORS.TEXT_PRIMARY,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, isMobile ? 80 : 120, 30, 5);
                g.stroke();
              }}
            />
            <pixiText
              text="메뉴로"
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                fontWeight: "bold",
                fontFamily: "Noto Sans KR",
              }}
              x={(isMobile ? 80 : 120) / 2}
              y={15}
              anchor={0.5}
            />
          </pixiContainer>
        </pixiContainer>
      </pixiContainer>
    </pixiContainer>
  );
};

export default TrainingScreen;
