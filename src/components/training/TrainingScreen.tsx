import { PlayerState } from "@/systems";
import { usePlayerMovement } from "@/utils/inputSystem";
import "@pixi/layout";
import { extend } from "@pixi/react";
import { Container } from "pixi.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Position } from "../../types/common";
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
const calculateLayoutConstants = (
  isMobile: boolean,
  width: number,
  height: number
) => ({
  padding: isMobile ? 10 : 20,
  headerHeight: isMobile ? 50 : 60,
  footerHeight: isMobile ? 40 : 50,
  leftPanelWidth: isMobile ? width * 0.95 : Math.min(width * 0.25, 300),
  rightPanelWidth: isMobile ? width * 0.95 : Math.min(width * 0.25, 280),
  centerAreaWidth: isMobile ? width * 0.95 : width * 0.5,
  centerAreaHeight: height - 120, // Account for header and footer
  componentGap: isMobile ? 8 : 15,
  panelHeight: isMobile ? 120 : 150,
  modeSelectorHeight: isMobile ? 40 : 50,
});

export const TrainingScreen: React.FC<TrainingScreenProps> = ({
  player,
  onPlayerUpdate,
  onReturnToMenu,
  width,
  height,
  x = 0,
  y = 0,
}) => {
  const [trainingMode, setTrainingMode] = useState<TrainingMode>("basics");
  const [isTraining, setIsTraining] = useState(false);
  const [selectedVitalPoint, setSelectedVitalPoint] = useState<string | null>(
    null
  );
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const isMobile = width < 768;
  const layout = useMemo(
    () => calculateLayoutConstants(isMobile, width, height),
    [isMobile, width, height]
  );

  // ✅ FIXED: Use similar arena bounds calculation as CombatScreen
  const arenaBounds = useMemo(
    () => ({
      x: 0, // Use relative coordinates like CombatScreen
      y: 0,
      width: layout.centerAreaWidth - layout.padding * 2,
      height: layout.centerAreaHeight - layout.padding * 2,
    }),
    [layout]
  );

  // ✅ FIXED: Use position state like CombatScreen
  const [playerPositions, setPlayerPositions] = useState<Position[]>([
    {
      x: arenaBounds.width * 0.25,
      y: arenaBounds.height * 0.6,
    },
  ]);

  // ✅ FIXED: Use movement hook with proper configuration like CombatScreen
  const { playerPosition, isMoving } = usePlayerMovement({
    enabled: true,
    bounds: arenaBounds,
    onPositionChange: (newPosition: Position) => {
      setPlayerPositions([newPosition]);
      onPlayerUpdate({ position: newPosition });
    },
    initialPosition: playerPositions[0],
    moveSpeed: 300,
  });

  // ✅ FIXED: Add combat input handling similar to CombatScreen
  useEffect(() => {
    const handleCombatInput = (event: KeyboardEvent) => {
      if (!isTraining) return;

      const key = event.key.toLowerCase();

      // Handle stance changes (1-8)
      if (key >= "1" && key <= "8") {
        const stanceIndex = parseInt(key) - 1;
        const stances = [
          "geon",
          "tae",
          "li",
          "jin",
          "son",
          "gam",
          "gan",
          "gon",
        ];
        onPlayerUpdate({
          currentStance: stances[stanceIndex] as any,
          lastActionTime: Date.now(),
        });
        event.preventDefault();
      }

      // Handle attacks
      if (key === " ") {
        // Space key
        handleDummyHit(
          Math.sqrt(
            Math.pow(playerPosition.x - arenaBounds.width * 0.75, 2) +
              Math.pow(playerPosition.y - arenaBounds.height * 0.6, 2)
          )
        );
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleCombatInput);
    return () => window.removeEventListener("keydown", handleCombatInput);
  }, [isTraining, playerPosition, arenaBounds, onPlayerUpdate]);

  // ✅ FIXED: Update player position when movement changes like CombatScreen
  useEffect(() => {
    setPlayerPositions([playerPosition]);
    onPlayerUpdate({ position: playerPosition });
  }, [playerPosition, onPlayerUpdate]);

  // Training handlers
  const handleStartTraining = useCallback(() => {
    setIsTraining(true);
    setScore(0);
    setCombo(0);
    setFeedback("훈련 시작!");
    setShowFeedback(true);
  }, []);

  const handleStopTraining = useCallback(() => {
    setIsTraining(false);
    setFeedback("훈련 종료");
    setShowFeedback(true);
  }, []);

  const handleDummyHit = useCallback(
    (distance: number): boolean => {
      if (!isTraining) return false;

      // Calculate hit accuracy based on distance
      const accuracy = Math.max(0, 1 - distance / 150);

      if (accuracy > 0.5) {
        const points = Math.round(accuracy * 100);
        setScore((prev) => prev + points);
        setCombo((prev) => prev + 1);

        if (accuracy > 0.9) {
          setFeedback("완벽한 타격!");
        } else if (accuracy > 0.7) {
          setFeedback("좋은 타격!");
        } else {
          setFeedback("타격 성공");
        }
        setShowFeedback(true);
        return true;
      } else {
        setCombo(0);
        setFeedback("빗나감");
        setShowFeedback(true);
        return false;
      }
    },
    [isTraining]
  );

  // Hide feedback after delay
  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => setShowFeedback(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onReturnToMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReturnToMenu]);

  return (
    <pixiContainer x={x} y={y} data-testid="training-screen">
      {/* Background */}
      <DojangBackground
        width={width}
        height={height}
        lighting="traditional"
        animate={true}
        data-testid="training-background"
      />

      {/* Header Overlay */}
      <pixiContainer x={0} y={0} data-testid="training-header">
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
            g.rect(0, 0, width, layout.headerHeight);
            g.fill();

            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.8,
            });
            g.moveTo(0, layout.headerHeight - 2);
            g.lineTo(width, layout.headerHeight - 2);
            g.stroke();
          }}
        />

        <pixiText
          text="훈련장 (Training Dojang)"
          style={{
            fontSize: isMobile ? 16 : 20,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
          }}
          x={width / 2}
          y={layout.headerHeight / 2}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Main Layout Container */}
      <pixiContainer
        y={layout.headerHeight}
        layout={{
          width,
          height: height - layout.headerHeight,
          flexDirection: isMobile ? "column" : "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: layout.padding,
          gap: layout.componentGap,
        }}
      >
        {/* Left Panel - Controls and Mode Selection */}
        <pixiContainer
          layout={{
            width: layout.leftPanelWidth,
            height: isMobile
              ? "auto"
              : height - layout.headerHeight - layout.padding * 2,
            flexDirection: "column",
            gap: layout.componentGap,
            flexShrink: 0,
          }}
          data-testid="left-panel"
        >
          {/* Training Mode Selector */}
          <TrainingModeSelector
            currentMode={trainingMode}
            onModeChange={setTrainingMode}
            x={0}
            y={0}
            width={layout.leftPanelWidth}
            height={layout.modeSelectorHeight}
            isMobile={isMobile}
          />

          {/* Training Controls */}
          <TrainingControlsPanel
            isTraining={isTraining}
            onStartTraining={handleStartTraining}
            onStopTraining={handleStopTraining}
            width={layout.leftPanelWidth}
            height={layout.panelHeight}
            isMobile={isMobile}
          />

          {/* Training Stats */}
          <TrainingStatsPanel
            player={player}
            score={score}
            combo={combo}
            isTraining={isTraining}
            width={layout.leftPanelWidth}
            height={layout.panelHeight}
            isMobile={isMobile}
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
                g.roundRect(0, 0, layout.leftPanelWidth, 40, 8);
                g.fill();

                g.stroke({
                  width: 2,
                  color: KOREAN_COLORS.TEXT_PRIMARY,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, layout.leftPanelWidth, 40, 8);
                g.stroke();
              }}
            />
            <pixiText
              text="메뉴로 돌아가기 (ESC)"
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                fontWeight: "bold",
                fontFamily: "Noto Sans KR",
                align: "center",
              }}
              x={layout.leftPanelWidth / 2}
              y={20}
              anchor={0.5}
            />
          </pixiContainer>
        </pixiContainer>

        {/* Center Area - Training Arena */}
        <pixiContainer
          x={
            isMobile
              ? layout.padding
              : layout.leftPanelWidth + layout.componentGap
          }
          y={layout.padding}
          layout={{
            width: layout.centerAreaWidth - layout.padding * 2,
            height: layout.centerAreaHeight - layout.padding * 2,
            position: "relative",
          }}
          data-testid="training-arena"
        >
          {/* Arena Background */}
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.3 });
              g.roundRect(
                0,
                0,
                layout.centerAreaWidth,
                height - layout.headerHeight - layout.padding * 2,
                12
              );
              g.fill();

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.6,
              });
              g.roundRect(
                0,
                0,
                layout.centerAreaWidth,
                height - layout.headerHeight - layout.padding * 2,
                12
              );
              g.stroke();

              // Add training grid
              g.stroke({
                width: 1,
                color: KOREAN_COLORS.PRIMARY_CYAN,
                alpha: 0.2,
              });
              const gridSize = 40;
              for (let i = 0; i < layout.centerAreaWidth; i += gridSize) {
                g.moveTo(i, 0);
                g.lineTo(i, height - layout.headerHeight - layout.padding * 2);
              }
              for (
                let j = 0;
                j < height - layout.headerHeight - layout.padding * 2;
                j += gridSize
              ) {
                g.moveTo(0, j);
                g.lineTo(layout.centerAreaWidth, j);
              }
              g.stroke();
            }}
            data-testid="arena-background"
          />

          {/* ✅ FIXED: Player Character with correct position tracking */}
          <PlayerVisuals
            playerState={player}
            x={playerPosition.x}
            y={playerPosition.y}
            scale={isMobile ? 0.8 : 1.0}
            showDetails={true}
            showKoreanLabels={true}
            renderMode="training"
            showVitalPoints={trainingMode === "advanced"}
            showStanceIndicator={true}
            showArchetypeSymbol={true}
            interactive={false}
            facing="right"
            animationState={isMoving ? "walk" : "idle"}
          />

          {/* ✅ FIXED: Training Dummy with relative positioning */}
          <TrainingDummy
            x={arenaBounds.width * 0.75}
            y={arenaBounds.height * 0.6}
            playerPosition={playerPosition}
            trainingMode={trainingMode}
            onHit={handleDummyHit}
            isTraining={isTraining}
            selectedVitalPoint={selectedVitalPoint}
            scale={isMobile ? 0.8 : 1.0}
          />

          {/* Training Feedback - Centered in arena */}
          <TrainingFeedback
            feedback={feedback}
            score={score}
            combo={combo}
            x={layout.centerAreaWidth / 2}
            y={100}
            visible={showFeedback}
            isMobile={isMobile}
          />

          {/* Movement Instructions */}
          <pixiContainer
            x={layout.centerAreaWidth / 2}
            y={height - layout.headerHeight - layout.padding * 2 - 60}
            data-testid="movement-instructions"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
                g.roundRect(-100, -20, 200, 40, 8);
                g.fill();

                g.stroke({
                  width: 1,
                  color: KOREAN_COLORS.ACCENT_CYAN,
                  alpha: 0.6,
                });
                g.roundRect(-100, -20, 200, 40, 8);
                g.stroke();
              }}
            />
            <pixiText
              text="WASD로 이동, Space로 공격"
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                fontFamily: "Noto Sans KR",
                align: "center",
              }}
              anchor={0.5}
              y={-8}
            />
            <pixiText
              text="Move with WASD, Attack with Space"
              style={{
                fontSize: isMobile ? 8 : 10,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
                fontStyle: "italic",
                align: "center",
              }}
              anchor={0.5}
              y={8}
            />
          </pixiContainer>

          {/* ✅ FIXED: Training status overlay with correct position data */}
          <pixiContainer x={10} y={10}>
            <pixiText
              text={`Stance: ${player.currentStance || "geon"} | Training: ${
                isTraining ? "ON" : "OFF"
              }`}
              style={{
                fontSize: 12,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                fontFamily: "Noto Sans KR",
              }}
            />
            <pixiText
              text={`Position: (${Math.round(playerPosition.x)}, ${Math.round(
                playerPosition.y
              )})`}
              style={{
                fontSize: 10,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
              }}
              y={15}
            />
          </pixiContainer>
        </pixiContainer>

        {/* Right Panel - Vital Point Training (Desktop only) */}
        {!isMobile && (
          <pixiContainer
            layout={{
              width: layout.rightPanelWidth,
              height: height - layout.headerHeight - layout.padding * 2,
              flexDirection: "column",
              gap: layout.componentGap,
              flexShrink: 0,
            }}
            data-testid="right-panel"
          >
            <VitalPointTrainingPanel
              selectedVitalPoint={selectedVitalPoint}
              onVitalPointSelect={setSelectedVitalPoint}
              width={layout.rightPanelWidth}
              height={
                height -
                layout.headerHeight -
                layout.padding * 2 -
                layout.componentGap
              }
              isMobile={false}
            />
          </pixiContainer>
        )}

        {/* Mobile Vital Point Panel (Bottom) */}
        {isMobile && trainingMode === "advanced" && (
          <pixiContainer
            layout={{
              width: layout.leftPanelWidth,
              height: 200,
              flexShrink: 0,
            }}
            data-testid="mobile-vital-point-panel"
          >
            <VitalPointTrainingPanel
              selectedVitalPoint={selectedVitalPoint}
              onVitalPointSelect={setSelectedVitalPoint}
              width={layout.leftPanelWidth}
              height={200}
              isMobile={true}
            />
          </pixiContainer>
        )}
      </pixiContainer>
    </pixiContainer>
  );
};

export default TrainingScreen;
