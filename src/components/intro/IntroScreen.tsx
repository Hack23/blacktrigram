import React, { useState, useCallback } from "react";
import { Container } from "@pixi/react";
import type { IntroScreenProps, PlayerArchetype } from "../../types";
import { GAME_CONFIG } from "../../types/constants";
import { MenuSection } from "./components/MenuSection";
import { PhilosophySection } from "./components/PhilosophySection";
import { ControlsSection } from "./components/ControlsSection";

type IntroView = "menu" | "philosophy" | "controls" | "training" | "credits";

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onGamePhaseChange,
  onStartCombat,
  onStartTraining,
  onArchetypeSelect,
  width = GAME_CONFIG.CANVAS_WIDTH,
  height = GAME_CONFIG.CANVAS_HEIGHT,
  ...props
}) => {
  const [currentView, setCurrentView] = useState<IntroView>("menu");
  const [selectedArchetype, setSelectedArchetype] =
    useState<PlayerArchetype>("musa");

  const handleArchetypeSelect = useCallback(
    (archetype: PlayerArchetype) => {
      setSelectedArchetype(archetype);
      if (onArchetypeSelect) {
        onArchetypeSelect(archetype);
      }
    },
    [onArchetypeSelect]
  );

  const handleStartCombat = useCallback(() => {
    if (onStartCombat) {
      onStartCombat();
    } else {
      onGamePhaseChange("combat");
    }
  }, [onStartCombat, onGamePhaseChange]);

  const handleStartTraining = useCallback(() => {
    if (onStartTraining) {
      onStartTraining();
    } else {
      onGamePhaseChange("training");
    }
  }, [onStartTraining, onGamePhaseChange]);

  const renderCurrentView = () => {
    switch (currentView) {
      case "philosophy":
        return (
          <PhilosophySection
            onGamePhaseChange={onGamePhaseChange}
            onBackToMenu={() => setCurrentView("menu")}
            selectedArchetype={selectedArchetype}
            onArchetypeSelect={handleArchetypeSelect}
            x={0}
            y={0}
            width={width}
            height={height}
          />
        );
      case "controls":
        return (
          <ControlsSection
            title="게임 조작법 (Game Controls)"
            onBackToMenu={() => setCurrentView("menu")}
            x={0}
            y={0}
            width={width}
            height={height}
          />
        );
      case "menu":
      default:
        return (
          <MenuSection
            onStartCombat={handleStartCombat}
            onStartTraining={handleStartTraining}
            onShowPhilosophy={() => setCurrentView("philosophy")}
            onShowControls={() => setCurrentView("controls")}
            onShowTraining={() => setCurrentView("training")}
            onShowCredits={() => setCurrentView("credits")}
            x={0}
            y={0}
            width={width}
            height={height}
          />
        );
    }
  };

  return (
    <Container width={width} height={height} {...props}>
      {renderCurrentView()}
    </Container>
  );
};

export default IntroScreen;
