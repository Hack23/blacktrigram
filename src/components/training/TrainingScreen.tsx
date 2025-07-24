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
  const [trainingDummy, setTrainingDummy] = useState<TrainingDummy>({
    health: 100,
    maxHealth: 100,
    position: { x: width * 0.7, y: height * 0.6 },
    isActive: true,
  });
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
  const handleTrainingAttack = useCallback(() => {
    if (!isTraining) return;

    const distance = Math.sqrt(
      Math.pow(playerMovement.position.x - trainingDummy.position.x, 2) +
        Math.pow(playerMovement.position.y - trainingDummy.position.y, 2)
    );

    if (distance < 100) {
      // Successful hit
      const points = 10 + combo * 2;
      setScore((prev) => prev + points);
      setCombo((prev) => prev + 1);
      setFeedback(`좋은 공격! +${points}점 | Good Hit! +${points} points`);
      audio.playSFX("hit_success");

      // Damage dummy
      setTrainingDummy((prev) => ({
        ...prev,
        health: Math.max(0, prev.health - 15),
      }));
    } else {
      // Miss
      setCombo(0);
      setFeedback("빗나감! | Missed!");
      audio.playSFX("miss");
    }
  }, [
    isTraining,
    playerMovement.position,
    trainingDummy.position,
    combo,
    audio,
  ]);

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
        handleTrainingAttack();
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
  ]);

  // Auto-reset dummy when health reaches 0
  useEffect(() => {
    if (trainingDummy.health <= 0) {
      setTimeout(() => {
        setTrainingDummy((prev) => ({
          ...prev,
          health: prev.maxHealth,
        }));
        setFeedback("더미 리셋! | Dummy Reset!");
      }, 1000);
    }
  }, [trainingDummy.health]);

  // Get player animation state
  const getPlayerAnimationState = useCallback((): PlayerAnimationState => {
    if (playerMovement.isMoving) return "walk";
    if (isTraining) return "idle"; // Fixed: changed from "combat_ready" to "idle"
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
        lighting="traditional" // Fixed: changed from "training" to "traditional"
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
        {/* Header Section */}
        <pixiContainer
          layout={{
            width: "100%",
            height: layoutConstants.headerHeight,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
          data-testid="training-header"
        >
          {/* Title and Mode Selector */}
          <pixiContainer
            layout={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <pixiText
              text="훈련장 | Training Dojang"
              style={{
                fontSize: isMobile ? 18 : 24,
                fill: KOREAN_COLORS.ACCENT_GOLD,
                fontWeight: "bold",
                fontFamily: "Noto Sans KR",
              }}
              data-testid="training-title"
            />

            {/* Training Mode Selector */}
            <pixiContainer
              layout={{
                flexDirection: "row",
                gap: 10,
              }}
            >
              {(["basics", "advanced", "free"] as TrainingMode[]).map(
                (mode) => (
                  <pixiContainer
                    key={mode}
                    interactive={true}
                    onPointerDown={() => setTrainingMode(mode)}
                    data-testid={`mode-${mode}`}
                  >
                    <pixiGraphics
                      draw={(g) => {
                        g.clear();
                        const isSelected = trainingMode === mode;
                        g.fill({
                          color: isSelected
                            ? KOREAN_COLORS.ACCENT_GOLD
                            : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                          alpha: 0.8,
                        });
                        g.roundRect(0, 0, isMobile ? 60 : 80, 25, 5);
                        g.fill();

                        g.stroke({
                          width: 1,
                          color: isSelected
                            ? KOREAN_COLORS.PRIMARY_CYAN
                            : KOREAN_COLORS.TEXT_SECONDARY,
                          alpha: 0.8,
                        });
                        g.roundRect(0, 0, isMobile ? 60 : 80, 25, 5);
                        g.stroke();
                      }}
                    />
                    <pixiText
                      text={
                        mode === "basics"
                          ? "기초"
                          : mode === "advanced"
                          ? "고급"
                          : "자유"
                      }
                      style={{
                        fontSize: isMobile ? 10 : 12,
                        fill:
                          trainingMode === mode
                            ? KOREAN_COLORS.UI_BACKGROUND_DARK
                            : KOREAN_COLORS.TEXT_PRIMARY,
                        fontWeight: "bold",
                        fontFamily: "Noto Sans KR",
                      }}
                      x={(isMobile ? 60 : 80) / 2}
                      y={12.5}
                      anchor={0.5}
                    />
                  </pixiContainer>
                )
              )}
            </pixiContainer>
          </pixiContainer>

          {/* Score and Status */}
          <pixiContainer
            layout={{
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            <pixiText
              text={`점수: ${score} | Score: ${score}`}
              style={{
                fontSize: isMobile ? 14 : 18,
                fill: KOREAN_COLORS.PRIMARY_CYAN,
                fontWeight: "bold",
                fontFamily: "Noto Sans KR",
              }}
            />
            <pixiText
              text={`연속: ${combo} | Combo: ${combo}`}
              style={{
                fontSize: isMobile ? 12 : 16,
                fill: KOREAN_COLORS.SECONDARY_YELLOW,
                fontWeight: "bold",
                fontFamily: "Noto Sans KR",
              }}
            />
            <pixiText
              text={isTraining ? "훈련 중 | Training" : "대기 중 | Waiting"}
              style={{
                fontSize: isMobile ? 10 : 14,
                fill: isTraining
                  ? KOREAN_COLORS.ACCENT_GREEN
                  : KOREAN_COLORS.TEXT_SECONDARY,
                fontStyle: "italic",
                fontFamily: "Noto Sans KR",
              }}
            />
          </pixiContainer>
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
          <pixiContainer
            x={trainingDummy.position.x}
            y={trainingDummy.position.y}
            data-testid="training-dummy"
          >
            {/* Dummy Visualization */}
            <pixiGraphics
              draw={(g) => {
                g.clear();

                // Dummy body
                g.fill({
                  color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.8,
                });
                g.circle(0, 0, 30);
                g.fill();

                // Health indicator
                const healthPercent =
                  trainingDummy.health / trainingDummy.maxHealth;
                g.fill({ color: KOREAN_COLORS.ACCENT_RED, alpha: 0.9 });
                g.arc(0, 0, 35, 0, Math.PI * 2 * healthPercent);
                g.fill();

                // Border
                g.stroke({
                  width: 2,
                  color: KOREAN_COLORS.TEXT_PRIMARY,
                  alpha: 0.8,
                });
                g.circle(0, 0, 30);
                g.stroke();

                // Vital points (if advanced mode)
                if (trainingMode === "advanced") {
                  g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.6 });
                  // Draw some vital points
                  g.circle(-10, -15, 3); // Head
                  g.circle(0, -5, 3); // Neck
                  g.circle(8, 0, 3); // Shoulder
                  g.circle(-8, 10, 3); // Torso
                  g.fill();
                }
              }}
            />

            {/* Dummy Health Display */}
            <pixiText
              text={`${Math.round(trainingDummy.health)}/${
                trainingDummy.maxHealth
              }`}
              style={{
                fontSize: 12,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                fontWeight: "bold",
                align: "center",
              }}
              x={0}
              y={-50}
              anchor={0.5}
            />
          </pixiContainer>

          {/* Feedback Display */}
          {feedback && (
            <pixiContainer
              x={width / 2}
              y={height * 0.3}
              data-testid="feedback-display"
            >
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                    alpha: 0.8,
                  });
                  g.roundRect(-100, -15, 200, 30, 8);
                  g.fill();

                  g.stroke({
                    width: 2,
                    color: KOREAN_COLORS.ACCENT_GOLD,
                    alpha: 0.8,
                  });
                  g.roundRect(-100, -15, 200, 30, 8);
                  g.stroke();
                }}
              />
              <pixiText
                text={feedback}
                style={{
                  fontSize: isMobile ? 12 : 16,
                  fill: KOREAN_COLORS.TEXT_PRIMARY,
                  fontWeight: "bold",
                  align: "center",
                  fontFamily: "Noto Sans KR",
                }}
                anchor={0.5}
              />
            </pixiContainer>
          )}
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
          <ResponsivePixiPanel
            title="훈련 조작 | Training Controls"
            width={isMobile ? width * 0.45 : 300}
            height={layoutConstants.controlsHeight - 10}
            screenWidth={width}
            screenHeight={height}
            data-testid="training-controls-panel"
          >
            {/* Start/Stop Button */}
            <pixiContainer x={20} y={20}>
              <pixiContainer
                interactive={true}
                onPointerDown={isTraining ? stopTraining : startTraining}
                data-testid="start-stop-button"
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
                    g.roundRect(0, 0, isMobile ? 100 : 120, 35, 8);
                    g.fill();

                    g.stroke({
                      width: 2,
                      color: KOREAN_COLORS.TEXT_PRIMARY,
                      alpha: 0.8,
                    });
                    g.roundRect(0, 0, isMobile ? 100 : 120, 35, 8);
                    g.stroke();
                  }}
                />
                <pixiText
                  text={isTraining ? "중지" : "시작"}
                  style={{
                    fontSize: isMobile ? 12 : 16,
                    fill: KOREAN_COLORS.TEXT_PRIMARY,
                    fontWeight: "bold",
                    fontFamily: "Noto Sans KR",
                  }}
                  x={(isMobile ? 100 : 120) / 2}
                  y={17.5}
                  anchor={0.5}
                />
              </pixiContainer>
            </pixiContainer>

            {/* Instructions */}
            <pixiContainer x={20} y={70}>
              <pixiText
                text="조작법:"
                style={{
                  fontSize: isMobile ? 10 : 12,
                  fill: KOREAN_COLORS.ACCENT_GOLD,
                  fontWeight: "bold",
                  fontFamily: "Noto Sans KR",
                }}
              />
              <pixiText
                text="WASD - 이동 | Move"
                style={{
                  fontSize: isMobile ? 8 : 10,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  fontFamily: "Noto Sans KR",
                }}
                y={15}
              />
              <pixiText
                text="Space - 공격 | Attack"
                style={{
                  fontSize: isMobile ? 8 : 10,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  fontFamily: "Noto Sans KR",
                }}
                y={25}
              />
              <pixiText
                text="1-8 - 자세 변경 | Stance"
                style={{
                  fontSize: isMobile ? 8 : 10,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  fontFamily: "Noto Sans KR",
                }}
                y={35}
              />
            </pixiContainer>
          </ResponsivePixiPanel>

          {/* Player Status Panel */}
          <ResponsivePixiPanel
            title="플레이어 상태 | Player Status"
            width={isMobile ? width * 0.45 : 300}
            height={layoutConstants.controlsHeight - 10}
            screenWidth={width}
            screenHeight={height}
            data-testid="player-status-panel"
          >
            {/* Current Stance */}
            <pixiContainer x={20} y={20}>
              <pixiText
                text="현재 자세:"
                style={{
                  fontSize: isMobile ? 10 : 12,
                  fill: KOREAN_COLORS.ACCENT_GOLD,
                  fontWeight: "bold",
                  fontFamily: "Noto Sans KR",
                }}
              />
              <StanceIndicator
                stance={player.currentStance}
                size={isMobile ? 30 : 40}
                showDetails={true}
                x={80}
                y={0}
                data-testid="current-stance-indicator"
              />
            </pixiContainer>

            {/* Player Resources */}
            <pixiContainer x={20} y={60}>
              <pixiText
                text={`기력: ${Math.round(player.ki)}/${player.maxKi}`}
                style={{
                  fontSize: isMobile ? 9 : 11,
                  fill: KOREAN_COLORS.PRIMARY_CYAN,
                  fontFamily: "Noto Sans KR",
                }}
              />
              <pixiText
                text={`체력: ${Math.round(player.stamina)}/${
                  player.maxStamina
                }`}
                style={{
                  fontSize: isMobile ? 9 : 11,
                  fill: KOREAN_COLORS.SECONDARY_YELLOW,
                  fontFamily: "Noto Sans KR",
                }}
                y={12}
              />
              <pixiText
                text={`생명력: ${Math.round(player.health)}/${
                  player.maxHealth
                }`}
                style={{
                  fontSize: isMobile ? 9 : 11,
                  fill: KOREAN_COLORS.ACCENT_RED,
                  fontFamily: "Noto Sans KR",
                }}
                y={24}
              />
            </pixiContainer>
          </ResponsivePixiPanel>
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
