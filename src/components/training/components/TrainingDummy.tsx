import React, { useEffect, useState } from "react";
import { Position } from "../../../types/common";
import { KOREAN_COLORS } from "../../../types/constants";
import { extendPixiComponents } from "../../../utils/pixiExtensions";

extendPixiComponents();

export interface TrainingDummyProps {
  readonly x: number;
  readonly y: number;
  readonly playerPosition: Position;
  readonly trainingMode: "basics" | "advanced" | "free";
  readonly onHit: (distance: number) => boolean;
  readonly isTraining: boolean;
}

export const TrainingDummy: React.FC<TrainingDummyProps> = ({
  x,
  y,
  playerPosition,
  trainingMode,
  onHit,
  isTraining,
}) => {
  const [health, setHealth] = useState(100);
  const [maxHealth] = useState(100);

  // Auto-reset dummy when health reaches 0
  useEffect(() => {
    if (health <= 0) {
      setTimeout(() => {
        setHealth(maxHealth);
      }, 1000);
    }
  }, [health, maxHealth]);

  // Handle hit detection
  const handleHit = () => {
    if (!isTraining) return;

    const distance = Math.sqrt(
      Math.pow(playerPosition.x - x, 2) + Math.pow(playerPosition.y - y, 2)
    );

    const hit = onHit(distance);
    if (hit) {
      setHealth((prev) => Math.max(0, prev - 15));
    }
  };

  return (
    <pixiContainer x={x} y={y} data-testid="training-dummy">
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
          const healthPercent = health / maxHealth;
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
        interactive={isTraining}
        onPointerDown={handleHit}
      />

      {/* Dummy Health Display */}
      <pixiText
        text={`${Math.round(health)}/${maxHealth}`}
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
  );
};

export default TrainingDummy;
