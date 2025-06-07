import React, { useMemo } from "react";
import { Container, Graphics, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import type { PlayerVisualsProps, TrigramStance } from "../../types";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  TRIGRAM_DATA,
} from "../../types/constants";

export const PlayerVisuals: React.FC<PlayerVisualsProps> = ({
  playerState,
  playerIndex,
  showVitalPoints = false,
  x = 0,
  y = 0,
  ...props
}) => {
  const { name, currentStance, health, maxHealth } = playerState;

  const playerColor = useMemo(() => {
    const stanceData = TRIGRAM_DATA[currentStance as TrigramStance];
    return stanceData?.theme?.primary || KOREAN_COLORS.UI_STEEL_GRAY;
  }, [currentStance]);

  const healthRatio = health / maxHealth;
  const playerSize = 40;

  const drawPlayer = React.useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Player body (simplified representation)
      g.beginFill(playerColor, 0.8);
      g.lineStyle(2, KOREAN_COLORS.UI_BORDER);
      g.drawCircle(0, 0, playerSize);
      g.endFill();

      // Health indicator
      if (healthRatio < 0.3) {
        g.beginFill(KOREAN_COLORS.NEGATIVE_RED, 0.5);
        g.drawCircle(0, 0, playerSize + 5);
        g.endFill();
      }

      // Stance indicator
      // Note: For actual symbol rendering, you'd use Text component
    },
    [playerColor, healthRatio, playerSize, currentStance]
  );

  const textStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.small,
        fill: KOREAN_COLORS.TEXT_PRIMARY,
        align: "center",
      }),
    []
  );

  return (
    <Container x={x} y={y} {...props}>
      <Graphics draw={drawPlayer} />

      <Text
        text={TRIGRAM_DATA[currentStance as TrigramStance]?.symbol || "○"}
        anchor={0.5}
        x={0}
        y={0}
        style={{
          ...textStyle,
          fontSize: FONT_SIZES.large,
          fill: KOREAN_COLORS.WHITE_SOLID,
        }}
      />

      <Text
        text={name.korean}
        anchor={0.5}
        x={0}
        y={playerSize + 15}
        style={textStyle}
      />

      {showVitalPoints && (
        <Container>
          {/* Vital points representation */}
          <Graphics
            draw={(g: PIXI.Graphics) => {
              g.beginFill(KOREAN_COLORS.ACCENT_RED, 0.7);
              g.drawCircle(-15, -10, 2); // Head
              g.drawCircle(0, 5, 2); // Heart
              g.drawCircle(15, -10, 2); // Shoulder
              g.endFill();
            }}
          />
        </Container>
      )}
    </Container>
  );
};

export default PlayerVisuals;
