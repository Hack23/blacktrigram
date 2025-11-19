import { PlayerState } from "@/systems";
import { usePlayerMovement } from "@/utils/inputSystem";
import "@pixi/layout";
import { extend } from "@pixi/react";
import { Container } from "pixi.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAudio } from "../../audio/AudioProvider";
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

  const audio = useAudio();

  // Audio lifecycle management for training screen
  useEffect(() => {
    // Fade in background music when entering training screen
    const startMusic = async () => {
      await audio.playMusic("cyberpunk_fusion");
      await audio.fadeIn("cyberpunk_fusion", 2000);
    };
    void startMusic().catch((err) => console.warn("Failed to start training music:", err));

    return () => {
      // Fade out music when leaving training screen
      void audio.fadeOut(2000).then(() => audio.stopMusic()).catch((err) => console.warn("Failed to stop training music:", err));
    };
  }, [audio]);

  const arenaBounds = useMemo(
    () => ({
      x: 0, // Use relative coordinates like CombatScreen
      y: 0,
      width: layout.centerAreaWidth - layout.padding * 2,
      height: layout.centerAreaHeight - layout.padding * 2,
    }),
    [layout]
  );

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

  useEffect(() => {
    setPlayerPositions([playerPosition]);
    onPlayerUpdate({ position: playerPosition });
  }, [playerPosition, onPlayerUpdate]);

  // Training handlers - define before combat input useEffect
  const handleStartTraining = useCallback(() => {
    setIsTraining(true);
    setScore(0);
    setCombo(0);
    setFeedback("훈련 시작!");
    setShowFeedback(true);
    audio.playSFX("menu_select");
  }, [audio]);

  const handleStopTraining = useCallback(() => {
    setIsTraining(false);
    setFeedback("훈련 종료");
    setShowFeedback(true);
    audio.playSFX("menu_back");
  }, [audio]);

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
          audio.playSFX("ki_release"); // Perfect strike gets ki release sound
        } else if (accuracy > 0.7) {
          setFeedback("좋은 타격!");
          audio.playSFX("ki_charge"); // Good strike gets ki charge sound
        } else {
          setFeedback("타격 성공");
          audio.playSFX("menu_click"); // Regular hit gets click sound
        }
        setShowFeedback(true);
        return true;
      } else {
        setCombo(0);
        setFeedback("빗나감");
        setShowFeedback(true);
        audio.playSFX("menu_navigate"); // Miss gets navigate sound
        return false;
      }
    },
    [isTraining, audio]
  );

  // ✅ FIXED: Add combat input handling similar to CombatScreen (after handlers)
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
        // Play stance change sound
        audio.playSFX("stance_change_1");
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
  }, [isTraining, playerPosition, arenaBounds, onPlayerUpdate, handleDummyHit, audio]);

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
      <DojangBackground
        width={width}
        height={height}
        lighting="traditional"
        animate={true}
        data-testid="training-background"
      />

      <pixiContainer x={0} y={0} data-testid="training-header">
        <pixiGraphics
          draw={(g) => {
            g.clear();
            // Reduced opacity to show more background
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.7 });
            g.rect(0, 0, width, layout.headerHeight);
            g.fill();

            // Subtle Korean-inspired border
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.6,
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
            // Add subtle glow effect
            dropShadow: {
              color: KOREAN_COLORS.UI_BACKGROUND_DARK,
              distance: 2,
              alpha: 0.8,
              blur: 3,
            },
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
        {/* ✅ IMPROVED: More transparent left panel */}
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
          {/* Semi-transparent panel background */}
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.4 });
              g.roundRect(
                0,
                0,
                layout.leftPanelWidth,
                height - layout.headerHeight - layout.padding * 2,
                12
              );
              g.fill();

              g.stroke({
                width: 1,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.3,
              });
              g.roundRect(
                0,
                0,
                layout.leftPanelWidth,
                height - layout.headerHeight - layout.padding * 2,
                12
              );
              g.stroke();
            }}
          />

          {/* Training Mode Selector */}
          <TrainingModeSelector
            currentMode={trainingMode}
            onModeChange={(mode) => {
              setTrainingMode(mode);
              audio.playSFX("menu_navigate");
            }}
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
            onPointerDown={() => {
              audio.playSFX("menu_back");
              onReturnToMenu();
            }}
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
          {/* Add training-area alias for E2E test compatibility */}
          <pixiContainer
            data-testid="training-area"
            layout={{ position: "absolute", width: "100%", height: "100%" }}
            alpha={0}
            interactive={false}
          />
          <pixiGraphics
            draw={(g) => {
              g.clear();

              // Only draw subtle training area boundary - no solid background
              g.stroke({
                width: 2,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.3,
              });
              g.roundRect(
                0,
                0,
                layout.centerAreaWidth,
                height - layout.headerHeight - layout.padding * 2,
                12
              );
              g.stroke();

              // Add only corner markers for training area reference
              const cornerSize = 20;
              const corners = [
                { x: cornerSize, y: cornerSize },
                { x: layout.centerAreaWidth - cornerSize, y: cornerSize },
                {
                  x: cornerSize,
                  y:
                    height -
                    layout.headerHeight -
                    layout.padding * 2 -
                    cornerSize,
                },
                {
                  x: layout.centerAreaWidth - cornerSize,
                  y:
                    height -
                    layout.headerHeight -
                    layout.padding * 2 -
                    cornerSize,
                },
              ];

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.PRIMARY_CYAN,
                alpha: 0.4,
              });

              corners.forEach((corner) => {
                // Draw L-shaped corner markers
                g.moveTo(corner.x - 10, corner.y);
                g.lineTo(corner.x, corner.y);
                g.lineTo(corner.x, corner.y - 10);
              });
              g.stroke();

              // Optional: Add center point marker for reference
              const centerX = layout.centerAreaWidth / 2;
              const centerY =
                (height - layout.headerHeight - layout.padding * 2) / 2;

              g.fill({ color: KOREAN_COLORS.ACCENT_CYAN, alpha: 0.3 });
              g.circle(centerX, centerY, 4);
              g.fill();
            }}
            data-testid="arena-background"
          />

          {/* Training player container wrapper for E2E test compatibility */}
          <pixiContainer
            data-testid="training-player"
            layout={{ position: "relative" }}
          >
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
          </pixiContainer>

          {/* Training dummy container wrapper for E2E test compatibility */}
          <pixiContainer
            data-testid="training-dummy-container"
            layout={{ position: "relative" }}
          >
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
          </pixiContainer>

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

          <pixiContainer
            x={layout.centerAreaWidth / 2}
            y={height - layout.headerHeight - layout.padding * 2 - 60}
            data-testid="movement-instructions"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                // More transparent background to show dojang
                g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.6 });
                g.roundRect(-120, -25, 240, 50, 8);
                g.fill();

                g.stroke({
                  width: 1,
                  color: KOREAN_COLORS.ACCENT_CYAN,
                  alpha: 0.8,
                });
                g.roundRect(-120, -25, 240, 50, 8);
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
                fontWeight: "bold",
                // Add text shadow for better readability
                dropShadow: {
                  color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                  distance: 1,
                  alpha: 0.8,
                  blur: 2,
                },
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
                dropShadow: {
                  color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                  distance: 1,
                  alpha: 0.6,
                  blur: 1,
                },
              }}
              anchor={0.5}
              y={8}
            />
          </pixiContainer>

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
            {/* Semi-transparent panel background */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.4 });
                g.roundRect(
                  0,
                  0,
                  layout.rightPanelWidth,
                  height - layout.headerHeight - layout.padding * 2,
                  12
                );
                g.fill();

                g.stroke({
                  width: 1,
                  color: KOREAN_COLORS.ACCENT_GOLD,
                  alpha: 0.3,
                });
                g.roundRect(
                  0,
                  0,
                  layout.rightPanelWidth,
                  height - layout.headerHeight - layout.padding * 2,
                  12
                );
                g.stroke();
              }}
            />

            <VitalPointTrainingPanel
              selectedVitalPoint={selectedVitalPoint}
              onVitalPointSelect={(point) => {
                setSelectedVitalPoint(point);
                audio.playSFX("menu_click");
              }}
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
              onVitalPointSelect={(point) => {
                setSelectedVitalPoint(point);
                audio.playSFX("menu_click");
              }}
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
