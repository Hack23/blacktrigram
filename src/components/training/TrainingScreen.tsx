import { PlayerState } from "@/systems";
import { usePlayerMovement } from "@/utils/inputSystem";
import "@pixi/layout";
import { extend } from "@pixi/react";
import { Container } from "pixi.js";
import React, { useCallback, useEffect, useState } from "react";
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
    player.position || { x: width * 0.2, y: height * 0.7 },
    { width, height }
  );

  // Responsive layout detection
  const isMobile = width < 768;

  // Enhanced visual feedback system
  const [visualEffects, setVisualEffects] = useState<
    Array<{
      id: string;
      type: "hit" | "miss" | "perfect" | "combo";
      position: { x: number; y: number };
      timestamp: number;
    }>
  >([]);

  // Enhanced layout with better proportions and missing properties
  const layoutConstants = {
    padding: isMobile ? 15 : 25,
    headerHeight: isMobile ? 70 : 90,
    footerHeight: isMobile ? 50 : 60,
    leftPanelWidth: isMobile ? width * 0.35 : Math.min(380, width * 0.28),
    rightPanelWidth: isMobile ? 0 : Math.min(320, width * 0.22),
    trainingAreaMargin: isMobile ? 10 : 20,
    componentGap: isMobile ? 12 : 18,
    // Add missing properties
    controlsPanelHeight: isMobile ? 80 : 100,
    statsPanelHeight: isMobile ? 120 : 150,
    vitalPointPanelHeight: isMobile ? 100 : 130,
  };

  // Enhanced training area calculations
  const trainingAreaWidth =
    width -
    layoutConstants.leftPanelWidth -
    layoutConstants.rightPanelWidth -
    layoutConstants.padding * 2 -
    layoutConstants.trainingAreaMargin * 2;

  // Training dummy positions
  const dummyPositions = [
    { x: width * 0.6, y: height * 0.4 },
    { x: width * 0.7, y: height * 0.6 },
    { x: width * 0.8, y: height * 0.5 },
  ];

  // Update player position when movement changes
  useEffect(() => {
    onPlayerUpdate({ position: movementState.position });
  }, [movementState.position, onPlayerUpdate]);

  // Training controls
  const handleStartTraining = useCallback(() => {
    setIsTraining(true);
    setScore(0);
    setCombo(0);
    provideFeedback("훈련 시작!", "Training Started!");
  }, []);

  const handleStopTraining = useCallback(() => {
    setIsTraining(false);
    setCombo(0);
    provideFeedback("훈련 종료", "Training Ended");
  }, []);

  const handleModeChange = useCallback((mode: TrainingMode) => {
    setTrainingMode(mode);
    setScore(0);
    setCombo(0);
    const modeNames = {
      basics: "기초 훈련",
      advanced: "고급 훈련",
      free: "자유 훈련",
    };
    provideFeedback(
      `${modeNames[mode]} 모드`,
      `${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`
    );
  }, []);

  // Enhanced feedback system
  const provideFeedback = useCallback((korean: string, english: string) => {
    setFeedback(`${korean} | ${english}`);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  }, []);

  // Training hit detection with scoring
  const handleDummyHit = useCallback(
    (distance: number): boolean => {
      if (!isTraining) return false;

      const maxDistance = trainingMode === "advanced" ? 80 : 120;
      const hit = distance <= maxDistance;

      if (hit) {
        const accuracy = Math.max(0, 1 - distance / maxDistance);
        const points = Math.floor(accuracy * 100);

        setScore((prev) => prev + points * (combo + 1));
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

        // Enhanced feedback messages
        if (accuracy > 0.9) {
          provideFeedback("완벽한 타격!", "Perfect Strike!");
        } else if (accuracy > 0.7) {
          provideFeedback("정확한 타격!", "Accurate Strike!");
        } else {
          provideFeedback("타격 성공", "Strike Hit");
        }

        // Resource management
        if (player.stamina > 10) {
          onPlayerUpdate({
            stamina: player.stamina - 10,
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
    [trainingMode]
  );

  // Enhanced keyboard controls for training
  useEffect(() => {
    const handleTrainingInput = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (isTraining) {
          handleStopTraining();
        } else {
          handleStartTraining();
        }
      } else if (event.key === "Tab") {
        event.preventDefault();
        const modes: TrainingMode[] = ["basics", "advanced", "free"];
        const currentIndex = modes.indexOf(trainingMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        handleModeChange(modes[nextIndex]);
      }
    };

    window.addEventListener("keydown", handleTrainingInput);
    return () => window.removeEventListener("keydown", handleTrainingInput);
  }, [
    isTraining,
    trainingMode,
    handleStartTraining,
    handleStopTraining,
    handleModeChange,
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

      {/* Atmospheric overlay for training focus */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          if (isTraining) {
            // Subtle training focus overlay
            g.fill({ color: KOREAN_COLORS.ACCENT_GREEN, alpha: 0.05 });
            g.rect(0, 0, width, height);
            g.fill();
          }
        }}
      />

      {/* Enhanced main layout */}
      <pixiContainer
        layout={{
          width,
          height,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: layoutConstants.padding,
          gap: layoutConstants.trainingAreaMargin,
        }}
      >
        {/* Enhanced Left Panel */}
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
          {/* Panel background for visual cohesion */}
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.4 });
              g.roundRect(
                0,
                0,
                layoutConstants.leftPanelWidth,
                height - layoutConstants.padding * 2,
                12
              );
              g.fill();

              g.stroke({
                width: 1,
                color: KOREAN_COLORS.PRIMARY_CYAN,
                alpha: 0.3,
              });
              g.roundRect(
                0,
                0,
                layoutConstants.leftPanelWidth,
                height - layoutConstants.padding * 2,
                12
              );
              g.stroke();
            }}
            layout={{ position: "absolute", top: 0, left: 0 }}
          />

          {/* Training Mode Selector */}
          <TrainingModeSelector
            currentMode={trainingMode}
            onModeChange={handleModeChange}
            x={10}
            y={10}
            width={layoutConstants.leftPanelWidth - 20}
            height={isMobile ? 45 : 55}
            isMobile={isMobile}
          />

          {/* Training Controls */}
          <TrainingControlsPanel
            isTraining={isTraining}
            onStartTraining={handleStartTraining}
            onStopTraining={handleStopTraining}
            width={layoutConstants.leftPanelWidth - 20}
            height={layoutConstants.controlsPanelHeight}
            isMobile={isMobile}
          />

          {/* Training Statistics */}
          <TrainingStatsPanel
            player={player}
            score={score}
            combo={combo}
            isTraining={isTraining}
            width={layoutConstants.leftPanelWidth - 20}
            height={layoutConstants.statsPanelHeight}
            isMobile={isMobile}
          />

          {/* Vital Point Training Panel (Advanced Mode) */}
          {trainingMode === "advanced" && (
            <VitalPointTrainingPanel
              selectedVitalPoint={selectedVitalPoint}
              onVitalPointSelect={handleVitalPointSelect}
              width={layoutConstants.leftPanelWidth - 20}
              height={layoutConstants.vitalPointPanelHeight}
              isMobile={isMobile}
            />
          )}
        </pixiContainer>

        {/* Enhanced Central Training Area */}
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

              // Main training area
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.2 });
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

              g.stroke({ width: 3, color: borderColor, alpha: 0.7 });
              g.roundRect(
                0,
                0,
                trainingAreaWidth,
                height - layoutConstants.padding * 2,
                15
              );
              g.stroke();

              // Korean traditional corner decorations
              const cornerSize = 20;
              g.stroke({
                width: 2,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.4,
              });
              // Top-left corner
              g.moveTo(cornerSize, cornerSize);
              g.lineTo(cornerSize, 0);
              g.lineTo(0, 0);
              g.lineTo(0, cornerSize);
              // Top-right corner
              g.moveTo(trainingAreaWidth - cornerSize, 0);
              g.lineTo(trainingAreaWidth, 0);
              g.lineTo(trainingAreaWidth, cornerSize);
              // Bottom-right corner
              g.moveTo(
                trainingAreaWidth,
                height - layoutConstants.padding * 2 - cornerSize
              );
              g.lineTo(trainingAreaWidth, height - layoutConstants.padding * 2);
              g.lineTo(
                trainingAreaWidth - cornerSize,
                height - layoutConstants.padding * 2
              );
              // Bottom-left corner
              g.moveTo(cornerSize, height - layoutConstants.padding * 2);
              g.lineTo(0, height - layoutConstants.padding * 2);
              g.lineTo(0, height - layoutConstants.padding * 2 - cornerSize);
              g.stroke();

              // Enhanced grid for advanced mode
              if (trainingMode === "advanced") {
                g.stroke({
                  width: 1,
                  color: KOREAN_COLORS.TEXT_TERTIARY,
                  alpha: 0.15,
                });
                const gridSize = isMobile ? 50 : 70;
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

          {/* Player Character with enhanced positioning */}
          <PlayerVisuals
            playerState={player}
            x={
              movementState.position.x -
              layoutConstants.leftPanelWidth -
              layoutConstants.padding -
              layoutConstants.trainingAreaMargin
            }
            y={movementState.position.y - layoutConstants.padding}
            scale={isMobile ? 0.85 : 1.1}
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

          {/* Enhanced Training Dummies with better positioning */}
          {dummyPositions.map((pos, index) => (
            <TrainingDummy
              key={`dummy-${index}`}
              x={
                pos.x -
                layoutConstants.leftPanelWidth -
                layoutConstants.padding -
                layoutConstants.trainingAreaMargin
              }
              y={pos.y - layoutConstants.padding}
              playerPosition={movementState.position}
              trainingMode={trainingMode}
              onHit={handleDummyHit}
              isTraining={isTraining}
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
            y={120}
            visible={showFeedback}
            isMobile={isMobile}
          />

          {/* Enhanced Training Instructions */}
          {!isTraining && (
            <pixiContainer
              x={trainingAreaWidth / 2}
              y={height / 2 - 80}
              data-testid="training-instructions"
            >
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                    alpha: 0.95,
                  });
                  g.roundRect(-180, -80, 360, 160, 15);
                  g.fill();

                  // Enhanced border with Korean pattern
                  g.stroke({
                    width: 3,
                    color: KOREAN_COLORS.ACCENT_GOLD,
                    alpha: 0.9,
                  });
                  g.roundRect(-180, -80, 360, 160, 15);
                  g.stroke();

                  g.stroke({
                    width: 1,
                    color: KOREAN_COLORS.PRIMARY_CYAN,
                    alpha: 0.6,
                  });
                  g.roundRect(-170, -70, 340, 140, 12);
                  g.stroke();
                }}
              />

              <pixiText
                text="훈련 준비 완료"
                style={{
                  fontSize: isMobile ? 18 : 24,
                  fill: KOREAN_COLORS.ACCENT_GOLD,
                  fontWeight: "bold",
                  fontFamily: "Noto Sans KR",
                  align: "center",
                  dropShadow: {
                    color: KOREAN_COLORS.BLACK,
                    distance: 2,
                    alpha: 0.8,
                  },
                }}
                anchor={0.5}
                y={-40}
              />

              <pixiText
                text="Training Ready"
                style={{
                  fontSize: isMobile ? 14 : 16,
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
                  fontSize: isMobile ? 12 : 14,
                  fill: KOREAN_COLORS.PRIMARY_CYAN,
                  align: "center",
                  fontFamily: "Noto Sans KR",
                  fontWeight: "bold",
                }}
                anchor={0.5}
                y={10}
              />

              <pixiText
                text="Enter 키로 시작 • Tab으로 모드 변경 • WASD로 이동"
                style={{
                  fontSize: isMobile ? 10 : 12,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  align: "center",
                  fontFamily: "Noto Sans KR",
                }}
                anchor={0.5}
                y={35}
              />

              <pixiText
                text="Press Enter to Start • Tab to Change Mode • WASD to Move"
                style={{
                  fontSize: isMobile ? 9 : 11,
                  fill: KOREAN_COLORS.TEXT_TERTIARY,
                  align: "center",
                  fontStyle: "italic",
                }}
                anchor={0.5}
                y={55}
              />
            </pixiContainer>
          )}
        </pixiContainer>

        {/* New Right Panel for Desktop (performance metrics, tips) */}
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
            {/* Performance Panel */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
                g.roundRect(0, 0, layoutConstants.rightPanelWidth, 150, 8);
                g.fill();

                g.stroke({
                  width: 2,
                  color: KOREAN_COLORS.ACCENT_CYAN,
                  alpha: 0.7,
                });
                g.roundRect(0, 0, layoutConstants.rightPanelWidth, 150, 8);
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

            {/* Training Tips Panel */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
                g.roundRect(
                  0,
                  y + 170,
                  layoutConstants.rightPanelWidth,
                  200,
                  8
                );
                g.fill();

                g.stroke({
                  width: 2,
                  color: KOREAN_COLORS.SECONDARY_MAGENTA,
                  alpha: 0.7,
                });
                g.roundRect(
                  0,
                  y + 170,
                  layoutConstants.rightPanelWidth,
                  200,
                  8
                );
                g.stroke();
              }}
            />

            <pixiText
              text="훈련 조언"
              style={{
                fontSize: 14,
                fill: KOREAN_COLORS.SECONDARY_MAGENTA,
                fontWeight: "bold",
                fontFamily: "Noto Sans KR",
              }}
              x={15}
              y={185}
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
          paddingLeft: 25,
          paddingRight: 25,
        }}
        data-testid="training-footer"
      >
        {/* Enhanced footer background */}
        <pixiGraphics
          draw={(g) => {
            g.clear();

            // Solid background instead of gradient for PixiJS v8 compatibility
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
            g.rect(0, 0, width, layoutConstants.footerHeight);
            g.fill();

            // Top border with Korean pattern
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.7,
            });
            g.moveTo(0, 0);
            g.lineTo(width, 0);
            g.stroke();

            // Decorative elements
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.PRIMARY_CYAN,
              alpha: 0.4,
            });
            for (let i = 50; i < width; i += 100) {
              g.moveTo(i, 2);
              g.lineTo(i + 20, 2);
            }
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

        {/* Enhanced controls text with better formatting */}
        <pixiText
          text={
            isMobile
              ? "ESC-메뉴 • Enter-훈련 • Tab-모드"
              : "ESC-메뉴로 돌아가기 | Return to Menu • Enter-훈련 시작/중지 | Start/Stop • Tab-모드 변경 | Change Mode • WASD-이동 | Move"
          }
          style={{
            fontSize: isMobile ? 11 : 13,
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
                isMobile ? 90 : 140,
                layoutConstants.footerHeight - 15,
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
                isMobile ? 90 : 140,
                layoutConstants.footerHeight - 15,
                8
              );
              g.stroke();

              // Inner highlight
              g.stroke({
                width: 1,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.5,
              });
              g.roundRect(
                2,
                2,
                (isMobile ? 90 : 140) - 4,
                layoutConstants.footerHeight - 19,
                6
              );
              g.stroke();
            }}
          />
          <pixiText
            text="메뉴로 | Menu"
            style={{
              fontSize: isMobile ? 11 : 14,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
              align: "center",
            }}
            x={(isMobile ? 90 : 140) / 2}
            y={(layoutConstants.footerHeight - 15) / 2}
            anchor={0.5}
          />
        </pixiContainer>
      </pixiContainer>
    </pixiContainer>
  );
};

export default TrainingScreen;
