import { PlayerState } from "@/systems";
import { usePlayerMovement } from "@/utils/inputSystem";
import "@pixi/layout";
import { extend } from "@pixi/react";
import { Container } from "pixi.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { KOREAN_COLORS } from "../../types/constants";
import { DojangBackground } from "../game";
import { PlayerVisuals } from "../ui/PlayerVisuals";
import TrainingControlsPanel from "./components/TrainingControlsPanel";
import TrainingDummy from "./components/TrainingDummy";
import TrainingFeedback from "./components/TrainingFeedback";
import TrainingModeSelector from "./components/TrainingModeSelector";
import TrainingStatsPanel from "./components/TrainingStatsPanel";
import VitalPointTrainingPanel from "./components/VitalPointTrainingPanel";

// Extend PIXI components for use with React
extend({ Container });

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

// Extract layout calculation to separate function
const calculateLayoutConstants = (isMobile: boolean, width: number) => ({
  padding: isMobile ? 10 : 20,
  headerHeight: isMobile ? 60 : 80,
  footerHeight: isMobile ? 40 : 50,
  leftPanelWidth: isMobile
    ? Math.min(width * 0.4, 300)
    : Math.min(width * 0.3, 350),
  rightPanelWidth: isMobile ? 0 : Math.min(width * 0.25, 280),
  componentGap: isMobile ? 8 : 15,
  modeSelectorHeight: isMobile ? 40 : 50,
  controlsPanelHeight: isMobile ? 70 : 90,
  statsPanelHeight: isMobile ? 100 : 130,
  vitalPointPanelHeight: isMobile ? 120 : 160,
});

// Extract dummy positions calculation
const calculateDummyPositions = (trainingAreaWidth: number, height: number) => [
  { x: trainingAreaWidth * 0.3, y: height * 0.4 },
  { x: trainingAreaWidth * 0.6, y: height * 0.6 },
  { x: trainingAreaWidth * 0.8, y: height * 0.45 },
];

// Extract feedback provider function
const createFeedbackProvider = (
  setFeedback: (feedback: string) => void,
  setShowFeedback: (show: boolean) => void
) => {
  return useCallback(
    (korean: string, english: string) => {
      setFeedback(`${korean} | ${english}`);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    },
    [setFeedback, setShowFeedback]
  );
};

export const TrainingScreen: React.FC<TrainingScreenProps> = ({
  player,
  onPlayerUpdate,
  onReturnToMenu,
  width,
  height,
  x = 0,
  y = 0,
}) => {
  // Training state
  const [isTraining, setIsTraining] = useState(false);
  const [trainingMode, setTrainingMode] = useState<TrainingMode>("basics");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedVitalPoint, setSelectedVitalPoint] = useState<string | null>(
    null
  );

  // Enhanced player movement system
  const { movementState } = usePlayerMovement(
    player.position || { x: width * 0.25, y: height * 0.7 },
    { width, height }
  );

  // Determine if the device is mobile based on screen width
  const isMobile = width < 768;

  // Memoized layout constants
  const layoutConstants = useMemo(
    () => calculateLayoutConstants(isMobile, width),
    [isMobile, width]
  );

  // Calculate training area dimensions
  const trainingAreaWidth = useMemo(
    () =>
      width -
      layoutConstants.leftPanelWidth -
      layoutConstants.rightPanelWidth -
      layoutConstants.padding * 3,
    [width, layoutConstants]
  );

  // Training dummy positions with better spacing
  const dummyPositions = useMemo(
    () => calculateDummyPositions(trainingAreaWidth, height),
    [trainingAreaWidth, height]
  );

  // Enhanced visual effects system
  const [visualEffects, setVisualEffects] = useState<
    Array<{
      id: string;
      type: "hit" | "miss" | "perfect" | "combo";
      position: { x: number; y: number };
      timestamp: number;
    }>
  >([]);

  // Enhanced feedback system
  const provideFeedback = createFeedbackProvider(setFeedback, setShowFeedback);

  // Training controls - extracted to reduce complexity
  const trainingControls = useMemo(
    () => ({
      handleStartTraining: () => {
        setIsTraining(true);
        setScore(0);
        setCombo(0);
        provideFeedback("훈련 시작!", "Training Started!");
      },
      handleStopTraining: () => {
        setIsTraining(false);
        setCombo(0);
        provideFeedback("훈련 종료", "Training Ended");
      },
      handleModeChange: (mode: TrainingMode) => {
        setTrainingMode(mode);
        setScore(0);
        setCombo(0);
        setSelectedVitalPoint(null);
        const modeNames = {
          basics: "기초 훈련",
          advanced: "고급 훈련",
          free: "자유 훈련",
        };
        provideFeedback(
          `${modeNames[mode]} 모드`,
          `${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`
        );
      },
    }),
    [provideFeedback]
  );

  // Update player position when movement changes
  useEffect(() => {
    onPlayerUpdate({ position: movementState.position });
  }, [movementState.position, onPlayerUpdate]);

  // Enhanced feedback messages
  const handleHitFeedback = useCallback(
    (accuracy: number) => {
      if (accuracy > 0.9) {
        provideFeedback("완벽한 타격!", "Perfect Strike!");
      } else if (accuracy > 0.7) {
        provideFeedback("정확한 타격!", "Accurate Strike!");
      } else {
        provideFeedback("타격 성공", "Strike Hit");
      }
    },
    [provideFeedback]
  );

  // Training hit detection with enhanced scoring
  const handleDummyHit = useCallback(
    (distance: number): boolean => {
      if (!isTraining) return false;

      const maxDistance = trainingMode === "advanced" ? 80 : 120;
      const hit = distance <= maxDistance;

      if (hit) {
        const accuracy = Math.max(0, 1 - distance / maxDistance);
        const basePoints = Math.floor(accuracy * 100);
        const comboMultiplier = Math.floor(combo / 5) + 1;
        const points = basePoints * comboMultiplier;

        setScore((prev) => prev + points);
        setCombo((prev) => prev + 1);

        // Enhanced visual feedback
        const effectType =
          accuracy > 0.9 ? "perfect" : accuracy > 0.7 ? "hit" : "hit";
        setVisualEffects((prev) => [
          ...prev,
          {
            id: `effect_${Date.now()}`,
            type: effectType,
            position: { x: width * 0.6, y: height * 0.5 },
            timestamp: Date.now(),
          },
        ]);

        handleHitFeedback(accuracy);

        // Resource management
        if (player.stamina > 10) {
          onPlayerUpdate({
            stamina: player.stamina - 8,
            totalDamageDealt: (player.totalDamageDealt || 0) + points,
          });
        }
      } else {
        setCombo(0);
        setVisualEffects((prev) => [
          ...prev,
          {
            id: `miss_${Date.now()}`,
            type: "miss",
            position: { x: width * 0.6, y: height * 0.5 },
            timestamp: Date.now(),
          },
        ]);
        provideFeedback("빗나감", "Miss");
      }

      return hit;
    },
    [
      isTraining,
      trainingMode,
      combo,
      player.stamina,
      player.totalDamageDealt,
      onPlayerUpdate,
      width,
      height,
      handleHitFeedback,
    ]
  );

  // Vital point selection handler
  const handleVitalPointSelect = useCallback(
    (vitalPointId: string) => {
      setSelectedVitalPoint(vitalPointId);
      if (trainingMode === "advanced") {
        provideFeedback("급소 선택됨", "Vital Point Selected");
      }
    },
    [trainingMode, provideFeedback]
  );

  // Enhanced keyboard controls for training
  useEffect(() => {
    const handleTrainingInput = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (isTraining) {
          trainingControls.handleStopTraining();
        } else {
          trainingControls.handleStartTraining();
        }
      } else if (event.key === "Tab") {
        event.preventDefault();
        const modes: TrainingMode[] = ["basics", "advanced", "free"];
        const currentIndex = modes.indexOf(trainingMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        trainingControls.handleModeChange(modes[nextIndex]);
      }
    };

    window.addEventListener("keydown", handleTrainingInput);
    return () => window.removeEventListener("keydown", handleTrainingInput);
  }, [
    isTraining,
    trainingMode,
    trainingControls.handleStartTraining,
    trainingControls.handleStopTraining,
    trainingControls.handleModeChange,
  ]);

  // Reset combo after inactivity
  useEffect(() => {
    if (combo > 0 && isTraining) {
      const comboTimer = setTimeout(() => {
        setCombo(0);
      }, 3000);
      return () => clearTimeout(comboTimer);
    }
  }, [combo, isTraining]);

  // Clean up visual effects
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setVisualEffects((prev) =>
        prev.filter((effect) => now - effect.timestamp < 2000)
      );
    }, 100);
    return () => clearInterval(cleanup);
  }, []);

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
      {/* Enhanced background with depth */}
      <DojangBackground
        width={width}
        height={height}
        lighting="traditional"
        animate={true}
      />

      {/* Main layout container */}
      <pixiContainer
        layout={{
          width,
          height,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: layoutConstants.padding,
          gap: layoutConstants.padding,
        }}
      >
        {/* Left Control Panel */}
        <pixiContainer
          layout={{
            width: layoutConstants.leftPanelWidth,
            height: height - layoutConstants.padding * 2,
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
            gap: layoutConstants.componentGap,
          }}
          data-testid="training-left-panel"
        >
          {/* Training Mode Selector */}
          <TrainingModeSelector
            currentMode={trainingMode}
            onModeChange={trainingControls.handleModeChange}
            x={0}
            y={0}
            width={layoutConstants.leftPanelWidth}
            height={layoutConstants.modeSelectorHeight}
            isMobile={isMobile}
          />

          {/* Training Controls */}
          <TrainingControlsPanel
            isTraining={isTraining}
            onStartTraining={trainingControls.handleStartTraining}
            onStopTraining={trainingControls.handleStopTraining}
            width={layoutConstants.leftPanelWidth}
            height={layoutConstants.controlsPanelHeight}
            isMobile={isMobile}
          />

          {/* Training Statistics */}
          <TrainingStatsPanel
            player={player}
            score={score}
            combo={combo}
            isTraining={isTraining}
            width={layoutConstants.leftPanelWidth}
            height={layoutConstants.statsPanelHeight}
            isMobile={isMobile}
          />

          {/* Vital Point Training Panel (Advanced Mode) */}
          {trainingMode === "advanced" && (
            <VitalPointTrainingPanel
              selectedVitalPoint={selectedVitalPoint}
              onVitalPointSelect={handleVitalPointSelect}
              width={layoutConstants.leftPanelWidth}
              height={layoutConstants.vitalPointPanelHeight}
              isMobile={isMobile}
            />
          )}
        </pixiContainer>

        {/* Central Training Area */}
        <pixiContainer
          layout={{
            width: trainingAreaWidth,
            height: height - layoutConstants.padding * 2,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
          data-testid="training-area"
        >
          {/* Enhanced Training Area Background */}
          <pixiGraphics
            draw={(g) => {
              g.clear();

              // Main training area background
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.15 });
              g.roundRect(
                0,
                0,
                trainingAreaWidth,
                height - layoutConstants.padding * 2,
                15
              );
              g.fill();

              // Dynamic border based on training state
              const borderColor = isTraining
                ? KOREAN_COLORS.ACCENT_GREEN
                : trainingMode === "advanced"
                ? KOREAN_COLORS.SECONDARY_MAGENTA
                : KOREAN_COLORS.PRIMARY_CYAN;

              g.stroke({ width: 2, color: borderColor, alpha: 0.6 });
              g.roundRect(
                0,
                0,
                trainingAreaWidth,
                height - layoutConstants.padding * 2,
                15
              );
              g.stroke();

              // Grid for advanced mode
              if (trainingMode === "advanced") {
                g.stroke({
                  width: 1,
                  color: KOREAN_COLORS.TEXT_TERTIARY,
                  alpha: 0.1,
                });
                const gridSize = 60;
                for (let i = gridSize; i < trainingAreaWidth; i += gridSize) {
                  g.moveTo(i, 20);
                  g.lineTo(i, height - layoutConstants.padding * 2 - 20);
                }
                for (
                  let i = gridSize;
                  i < height - layoutConstants.padding * 2;
                  i += gridSize
                ) {
                  g.moveTo(20, i);
                  g.lineTo(trainingAreaWidth - 20, i);
                }
                g.stroke();
              }
            }}
            layout={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />

          {/* Player Character */}
          <PlayerVisuals
            playerState={player}
            x={
              movementState.position.x -
              layoutConstants.leftPanelWidth -
              layoutConstants.padding
            }
            y={movementState.position.y - layoutConstants.padding}
            scale={isMobile ? 0.9 : 1.2}
            showDetails={true}
            showKoreanLabels={true}
            animationState={
              movementState.isMoving
                ? "walk"
                : isTraining
                ? "stance_change"
                : "idle"
            }
            renderMode="training"
            showVitalPoints={trainingMode === "advanced"}
            showStanceIndicator={true}
            showArchetypeSymbol={true}
            showKiAura={isTraining}
            onVitalPointClick={handleVitalPointSelect}
            highlightedVitalPoints={
              selectedVitalPoint ? [selectedVitalPoint] : []
            }
          />

          {/* Enhanced Training Dummies */}
          {dummyPositions.map((pos, index) => (
            <TrainingDummy
              key={`dummy-${index}`}
              x={pos.x}
              y={pos.y}
              playerPosition={{
                x:
                  movementState.position.x -
                  layoutConstants.leftPanelWidth -
                  layoutConstants.padding,
                y: movementState.position.y - layoutConstants.padding,
              }}
              trainingMode={trainingMode}
              onHit={handleDummyHit}
              isTraining={isTraining}
              selectedVitalPoint={selectedVitalPoint}
              scale={isMobile ? 0.8 : 1.0}
            />
          ))}

          {/* Enhanced Visual Effects Layer */}
          {visualEffects.map((effect) => (
            <pixiContainer
              key={effect.id}
              x={effect.position.x}
              y={effect.position.y}
              data-testid={`visual-effect-${effect.type}`}
            >
              <pixiGraphics
                draw={(g) => {
                  const age = Date.now() - effect.timestamp;
                  const alpha = Math.max(0, 1 - age / 2000);
                  const scale = 1 + (age / 2000) * 0.5;

                  g.clear();

                  switch (effect.type) {
                    case "perfect":
                      g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha });
                      g.star(0, 0, 8, 15 * scale, 8 * scale);
                      g.fill();
                      break;
                    case "hit":
                      g.fill({ color: KOREAN_COLORS.ACCENT_GREEN, alpha });
                      g.circle(0, 0, 10 * scale);
                      g.fill();
                      break;
                    case "miss":
                      g.stroke({
                        width: 3,
                        color: KOREAN_COLORS.ACCENT_RED,
                        alpha,
                      });
                      g.moveTo(-8 * scale, -8 * scale);
                      g.lineTo(8 * scale, 8 * scale);
                      g.moveTo(8 * scale, -8 * scale);
                      g.lineTo(-8 * scale, 8 * scale);
                      g.stroke();
                      break;
                    case "combo":
                      g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha });
                      g.circle(0, 0, 12 * scale);
                      g.fill();
                      break;
                  }
                }}
              />
            </pixiContainer>
          ))}

          {/* Enhanced Training Feedback */}
          <TrainingFeedback
            feedback={feedback}
            score={score}
            combo={combo}
            x={trainingAreaWidth / 2}
            y={100}
            visible={showFeedback}
            isMobile={isMobile}
          />

          {/* Enhanced Training Instructions */}
          {!isTraining && (
            <pixiContainer
              x={trainingAreaWidth / 2}
              y={height / 2 - 60}
              data-testid="training-instructions"
            >
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                    alpha: 0.95,
                  });
                  g.roundRect(-160, -70, 320, 140, 15);
                  g.fill();

                  g.stroke({
                    width: 3,
                    color: KOREAN_COLORS.ACCENT_GOLD,
                    alpha: 0.9,
                  });
                  g.roundRect(-160, -70, 320, 140, 15);
                  g.stroke();
                }}
              />

              <pixiText
                text="훈련 준비 완료"
                style={{
                  fontSize: isMobile ? 16 : 22,
                  fill: KOREAN_COLORS.ACCENT_GOLD,
                  fontWeight: "bold",
                  fontFamily: "Noto Sans KR",
                  align: "center",
                }}
                anchor={0.5}
                y={-35}
              />

              <pixiText
                text="Training Ready"
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  fontStyle: "italic",
                  align: "center",
                }}
                anchor={0.5}
                y={-15}
              />

              <pixiText
                text={`현재 모드: ${
                  trainingMode === "basics"
                    ? "기초 훈련"
                    : trainingMode === "advanced"
                    ? "고급 훈련"
                    : "자유 훈련"
                }`}
                style={{
                  fontSize: isMobile ? 11 : 13,
                  fill: KOREAN_COLORS.PRIMARY_CYAN,
                  align: "center",
                  fontFamily: "Noto Sans KR",
                  fontWeight: "bold",
                }}
                anchor={0.5}
                y={5}
              />

              <pixiText
                text="Enter 키로 시작 • Tab으로 모드 변경 • WASD로 이동"
                style={{
                  fontSize: isMobile ? 9 : 11,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  align: "center",
                  fontFamily: "Noto Sans KR",
                }}
                anchor={0.5}
                y={25}
              />

              <pixiText
                text="Press Enter to Start • Tab to Change Mode • WASD to Move"
                style={{
                  fontSize: isMobile ? 8 : 10,
                  fill: KOREAN_COLORS.TEXT_TERTIARY,
                  align: "center",
                  fontStyle: "italic",
                }}
                anchor={0.5}
                y={45}
              />
            </pixiContainer>
          )}
        </pixiContainer>

        {/* Right Panel for Desktop (performance metrics, tips) */}
        {!isMobile && layoutConstants.rightPanelWidth > 0 && (
          <pixiContainer
            layout={{
              width: layoutConstants.rightPanelWidth,
              height: height - layoutConstants.padding * 2,
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "flex-start",
              gap: layoutConstants.componentGap,
            }}
            data-testid="training-right-panel"
          >
            {/* Performance Analysis Panel */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
                g.roundRect(0, 0, layoutConstants.rightPanelWidth, 140, 8);
                g.fill();

                g.stroke({
                  width: 2,
                  color: KOREAN_COLORS.ACCENT_CYAN,
                  alpha: 0.7,
                });
                g.roundRect(0, 0, layoutConstants.rightPanelWidth, 140, 8);
                g.stroke();
              }}
            />

            <pixiText
              text="성과 분석"
              style={{
                fontSize: 14,
                fill: KOREAN_COLORS.ACCENT_CYAN,
                fontWeight: "bold",
                fontFamily: "Noto Sans KR",
              }}
              x={15}
              y={15}
            />

            <pixiText
              text="Performance Analysis"
              style={{
                fontSize: 10,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
                fontStyle: "italic",
              }}
              x={15}
              y={30}
            />

            {/* Accuracy Display */}
            <pixiText
              text={`정확도: ${
                combo > 0 ? Math.round((score / (combo * 100)) * 100) : 0
              }%`}
              style={{
                fontSize: 12,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                fontFamily: "Noto Sans KR",
              }}
              x={15}
              y={55}
            />

            <pixiText
              text={`최고 연타: ${combo}회`}
              style={{
                fontSize: 12,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                fontFamily: "Noto Sans KR",
              }}
              x={15}
              y={75}
            />

            <pixiText
              text={`총 점수: ${score}점`}
              style={{
                fontSize: 12,
                fill: KOREAN_COLORS.ACCENT_GOLD,
                fontFamily: "Noto Sans KR",
              }}
              x={15}
              y={95}
            />
          </pixiContainer>
        )}
      </pixiContainer>

      {/* Enhanced Footer */}
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
        {/* Footer background */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
            g.rect(0, 0, width, layoutConstants.footerHeight);
            g.fill();

            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.7,
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

        {/* Enhanced controls text */}
        <pixiText
          text={
            isMobile
              ? "ESC-메뉴 • Enter-훈련 • Tab-모드"
              : "ESC-메뉴로 돌아가기 | Return to Menu • Enter-훈련 시작/중지 | Start/Stop • Tab-모드 변경 | Change Mode • WASD-이동 | Move"
          }
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Noto Sans KR",
            fontWeight: "500",
          }}
        />

        {/* Enhanced return button */}
        <pixiContainer
          interactive={true}
          onPointerDown={onReturnToMenu}
          data-testid="return-button"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.ACCENT_RED, alpha: 0.9 });
              g.roundRect(
                0,
                0,
                isMobile ? 80 : 120,
                layoutConstants.footerHeight - 10,
                8
              );
              g.fill();

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.TEXT_PRIMARY,
                alpha: 0.9,
              });
              g.roundRect(
                0,
                0,
                isMobile ? 80 : 120,
                layoutConstants.footerHeight - 10,
                8
              );
              g.stroke();
            }}
          />
          <pixiText
            text="메뉴로 | Menu"
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
              align: "center",
            }}
            x={(isMobile ? 80 : 120) / 2}
            y={(layoutConstants.footerHeight - 10) / 2}
            anchor={0.5}
          />
        </pixiContainer>
      </pixiContainer>
    </pixiContainer>
  );
};

export default TrainingScreen;
