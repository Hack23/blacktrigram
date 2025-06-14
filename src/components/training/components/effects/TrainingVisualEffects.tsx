/**
 * ## Training Visual Effects Component
 *
 * **Business Purpose:**
 * Provides stunning visual feedback for Korean martial arts training
 * with authentic cultural elements and cyberpunk aesthetics.
 */

import React, { useCallback } from "react";
import { usePixiExtensions } from "../../../../utils/pixiExtensions";
import { KOREAN_COLORS } from "../../../../types/constants";

export interface TrainingVisualEffectsProps {
  readonly isTraining: boolean;
  readonly currentCombo: number;
  readonly lastTechniqueResult?: "hit" | "miss" | "critical" | "perfect";
  readonly screenWidth: number;
  readonly screenHeight: number;
}

export const TrainingVisualEffects: React.FC<TrainingVisualEffectsProps> = ({
  isTraining,
  currentCombo,
  lastTechniqueResult,
  screenWidth,
  screenHeight,
}) => {
  usePixiExtensions();

  const drawKiEnhancement = useCallback(
    (g: any) => {
      if (!isTraining || currentCombo < 5) return;

      g.clear();
      const time = Date.now() * 0.005;
      const alpha = Math.sin(time) * 0.3 + 0.7;

      // Ki energy flowing effect
      g.stroke({ width: 3, color: KOREAN_COLORS.PRIMARY_CYAN, alpha });
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time;
        const radius = 100 + Math.sin(time + i) * 20;
        const x = screenWidth / 2 + Math.cos(angle) * radius;
        const y = screenHeight / 2 + Math.sin(angle) * radius;

        g.circle(x, y, 5);
        g.stroke();
      }
    },
    [isTraining, currentCombo, screenWidth, screenHeight]
  );

  return (
    <pixiContainer data-testid="training-visual-effects">
      {/* Ki enhancement effects for high combos */}
      <pixiGraphics draw={drawKiEnhancement} />

      {/* Technique result effects */}
      {lastTechniqueResult === "perfect" && (
        <pixiContainer x={screenWidth / 2} y={screenHeight / 2}>
          <pixiText
            text="완벽!"
            style={{
              fontSize: 48,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
              align: "center",
            }}
            anchor={0.5}
            alpha={1}
          />
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default TrainingVisualEffects;
