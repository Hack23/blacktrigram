import React, { useEffect } from "react";
import { PhilosophySection } from "./PhilosophySection";

export interface PhilosophyScreenProps {
  readonly onReturnToMenu: () => void;
  readonly width?: number;
  readonly height?: number;
}

export const PhilosophyScreen: React.FC<PhilosophyScreenProps> = ({
  onReturnToMenu,
  width = 1200,
  height = 800,
}) => {
  // Enhanced keyboard handling for screen-level navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key.toLowerCase() === "m") {
        event.preventDefault();
        onReturnToMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReturnToMenu]);

  return (
    <pixiContainer
      width={width}
      height={height}
      data-testid="philosophy-screen"
    >
      {/* Full-screen philosophy section */}
      <PhilosophySection
        onBack={onReturnToMenu}
        x={0}
        y={0}
        width={width}
        height={height}
      />
    </pixiContainer>
  );
};

export default PhilosophyScreen;
