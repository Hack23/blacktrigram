import React, { useCallback, useState, useMemo } from "react";
import { Container, Graphics, Text } from "@pixi/react";
import type { CombatControlsProps, TrigramStance } from "../../../types";
import {
  KOREAN_COLORS,
  TRIGRAM_DATA,
  TRIGRAM_STANCES_ORDER,
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  COMBAT_CONTROLS,
} from "../../../types/constants";
import * as PIXI from "pixi.js"; // Import PIXI for PIXI.Graphics

export const CombatControls: React.FC<CombatControlsProps> = ({
  players, // Now used
  player,
  onStanceChange,
  isExecutingTechnique,
  isPaused,
  showVitalPoints, // Now used
  width = 800, // Default width
  height = 100, // Default height
  ...props
}) => {
  const [hoveredStance, setHoveredStance] = useState<TrigramStance | null>(
    null
  );

  const handleStanceClick = useCallback(
    (stance: TrigramStance) => {
      if (!isExecutingTechnique && !isPaused) {
        // Determine player index - assuming 'player' prop is the one to control
        const playerIndex = players.findIndex((p) => p.id === player.id);
        if (playerIndex !== -1) {
          onStanceChange(playerIndex as 0 | 1, stance);
        }
      }
    },
    [onStanceChange, isExecutingTechnique, isPaused, player, players]
  );

  const buttonWidth = width / TRIGRAM_STANCES_ORDER.length - 10;
  const buttonHeight = height - 20;

  const drawButton = useCallback(
    (g: PIXI.Graphics, stance: TrigramStance, isCurrent: boolean) => {
      const stanceData = TRIGRAM_DATA[stance];
      const isDisabled = isExecutingTechnique || isPaused;
      const isHover = hoveredStance === stance;

      let fillColor =
        stanceData?.theme?.primary || KOREAN_COLORS.UI_BACKGROUND_MEDIUM; // Fixed theme access
      let lineColor = stanceData?.theme?.secondary || KOREAN_COLORS.UI_BORDER; // Fixed theme access
      let alpha = isDisabled ? 0.5 : 1;

      if (isCurrent) {
        fillColor = stanceData?.theme?.active || KOREAN_COLORS.PRIMARY_CYAN; // Fixed theme access and color
        lineColor = stanceData?.theme?.secondary || KOREAN_COLORS.WHITE_SOLID; // Fixed color
      } else if (isHover && !isDisabled) {
        fillColor =
          stanceData?.theme?.hover || KOREAN_COLORS.UI_BACKGROUND_LIGHT; // Fixed theme access
        lineColor = stanceData?.theme?.secondary || KOREAN_COLORS.PRIMARY_CYAN; // Fixed color
      }

      g.clear();
      g.beginFill(fillColor, alpha);
      g.lineStyle(2, lineColor, alpha);
      g.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
      g.endFill();
    },
    [buttonWidth, buttonHeight, hoveredStance, isExecutingTechnique, isPaused]
  );

  // Fix text style
  const textStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.small,
        fill: KOREAN_COLORS.TEXT_PRIMARY,
        fontWeight: FONT_WEIGHTS.regular.toString() as PIXI.TextStyleFontWeight, // Fixed: use lowercase
        align: "center",
      }),
    []
  );

  return (
    <Container x={props.x} y={props.y} width={width} height={height}>
      {TRIGRAM_STANCES_ORDER.map((stance, index) => {
        const stanceDetail = COMBAT_CONTROLS.stanceControls[
          (index + 1).toString()
        ] as { stance: TrigramStance; korean: string; technique: string };
        const isCurrentStance = player.currentStance === stance;

        return (
          <Container
            key={stance}
            x={index * (buttonWidth + 10) + 5}
            y={10}
            interactive={!isExecutingTechnique && !isPaused}
            buttonMode={!isExecutingTechnique && !isPaused}
            pointertap={() => handleStanceClick(stance)}
            pointerover={() => setHoveredStance(stance)}
            pointerout={() => setHoveredStance(null)}
          >
            <Graphics
              draw={(g: PIXI.Graphics) =>
                drawButton(g, stance, isCurrentStance)
              }
            />
            <Text
              text={TRIGRAM_DATA[stance]?.symbol || ""}
              anchor={0.5}
              x={buttonWidth / 2}
              y={buttonHeight / 2 - 10}
              style={{
                ...textStyle,
                fontSize: FONT_SIZES.large,
                fill: isCurrentStance
                  ? KOREAN_COLORS.BLACK_SOLID
                  : KOREAN_COLORS.TEXT_PRIMARY,
              }}
            />
            <Text
              text={
                stanceDetail?.korean ||
                TRIGRAM_DATA[stance]?.name.korean ||
                stance
              }
              anchor={0.5}
              x={buttonWidth / 2}
              y={buttonHeight / 2 + 10}
              style={{
                ...textStyle,
                fontSize: FONT_SIZES.small,
                fill: isCurrentStance
                  ? KOREAN_COLORS.BLACK_SOLID
                  : KOREAN_COLORS.TEXT_SECONDARY,
              }}
            />
          </Container>
        );
      })}
      {showVitalPoints && ( // Example of using showVitalPoints
        <Graphics
          x={10}
          y={10}
          draw={(g: PIXI.Graphics) => {
            g.beginFill(KOREAN_COLORS.POSITIVE_GREEN, 0.5);
            g.drawCircle(0, 0, 5);
            g.endFill();
          }}
        />
      )}
    </Container>
  );
};

export default CombatControls;
