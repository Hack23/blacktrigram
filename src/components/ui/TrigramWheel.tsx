import React, { useCallback, useState } from "react";
import { Application } from "@pixi/react";
import type { Graphics as PixiGraphics } from "pixi.js";
import {
  PixiContainerComponent,
  PixiGraphicsComponent,
  PixiTextComponent,
} from "./base/PixiComponents";
import {
  KOREAN_COLORS,
  TRIGRAM_DATA,
  TRIGRAM_STANCES_ORDER,
  type TrigramWheelProps,
} from "../../types";

export function TrigramWheel({
  selectedStance,
  onStanceSelect,
  onStanceChange,
  radius = 150,
  isEnabled = true,
  playerKi = 100,
  playerMaxKi = 100,
}: TrigramWheelProps): React.ReactElement {
  const [hoveredStance, setHoveredStance] = useState<string | null>(null);

  const handleStanceClick = useCallback(
    (stance: string) => {
      if (isEnabled) {
        onStanceChange(stance as any);
        if (onStanceSelect) {
          onStanceSelect(stance as any);
        }
      }
    },
    [isEnabled, onStanceChange, onStanceSelect]
  );

  // Helper functions for drawing
  const drawWheelBackground = useCallback(
    (g: PixiGraphics) => {
      g.clear();
      g.setStrokeStyle({ color: KOREAN_COLORS.GOLD, width: 2, alpha: 0.5 });
      g.circle(0, 0, radius * 0.9);
      g.stroke();
    },
    [radius]
  );

  const drawSelectedIndicator = useCallback(
    (g: PixiGraphics) => {
      if (!selectedStance) return;

      g.clear();
      const selectedIndex = TRIGRAM_STANCES_ORDER.indexOf(selectedStance);
      const angle = (selectedIndex / 8) * Math.PI * 2 - Math.PI / 2;
      const indicatorRadius = radius * 0.75;
      const x = Math.cos(angle) * indicatorRadius;
      const y = Math.sin(angle) * indicatorRadius;

      g.setStrokeStyle({ color: KOREAN_COLORS.GOLD, width: 3 });
      g.circle(x, y, 25);
      g.stroke();
    },
    [selectedStance, radius]
  );

  return (
    <Application
      width={radius * 2.5}
      height={radius * 2.5}
      backgroundColor={0x000000}
    >
      <PixiContainerComponent x={radius * 1.25} y={radius * 1.25}>
        {/* Background wheel */}
        <PixiGraphicsComponent draw={drawWheelBackground} />

        {/* Selection indicator */}
        <PixiGraphicsComponent draw={drawSelectedIndicator} />

        {/* Trigram positions */}
        {TRIGRAM_STANCES_ORDER.map((stance, index) => {
          const angle = (index / 8) * Math.PI * 2 - Math.PI / 2;
          const stanceRadius = radius * 0.75;
          const stanceX = Math.cos(angle) * stanceRadius;
          const stanceY = Math.sin(angle) * stanceRadius;

          const trigram = TRIGRAM_DATA[stance];
          const technique = trigram.technique;
          const hasEnoughKi = playerKi >= technique.kiCost;
          const isSelected = stance === selectedStance;
          const isHovered = stance === hoveredStance;

          return (
            <PixiContainerComponent
              key={stance}
              x={stanceX}
              y={stanceY}
              interactive={isEnabled && hasEnoughKi}
              onClick={() => handleStanceClick(stance)}
              onPointerEnter={() => setHoveredStance(stance)}
              onPointerLeave={() => setHoveredStance(null)}
            >
              {/* Stance background */}
              <PixiGraphicsComponent
                draw={(g: PixiGraphics) => {
                  g.clear();

                  const bgAlpha = isSelected ? 0.8 : isHovered ? 0.6 : 0.4;
                  const bgColor = hasEnoughKi
                    ? trigram.color
                    : KOREAN_COLORS.GRAY_DARK;

                  g.setFillStyle({ color: bgColor, alpha: bgAlpha });
                  g.circle(0, 0, 20);
                  g.fill();

                  if (isSelected) {
                    g.setStrokeStyle({ color: KOREAN_COLORS.GOLD, width: 2 });
                    g.circle(0, 0, 20);
                    g.stroke();
                  }
                }}
              />

              {/* Trigram symbol */}
              <PixiTextComponent
                text={trigram.symbol}
                anchor={{ x: 0.5, y: 0.5 }}
                style={{
                  fontFamily: "serif",
                  fontSize: 16,
                  fill: hasEnoughKi
                    ? KOREAN_COLORS.WHITE
                    : KOREAN_COLORS.GRAY_LIGHT,
                  fontWeight: "bold",
                }}
              />

              {/* Ki cost indicator */}
              <PixiTextComponent
                text={technique.kiCost.toString()}
                y={25}
                anchor={{ x: 0.5, y: 0.5 }}
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: 10,
                  fill: hasEnoughKi ? KOREAN_COLORS.CYAN : KOREAN_COLORS.Red,
                  fontWeight: "bold",
                }}
              />
            </PixiContainerComponent>
          );
        })}

        {/* Center yin-yang symbol */}
        <PixiTextComponent
          text="☯"
          anchor={{ x: 0.5, y: 0.5 }}
          style={{
            fontFamily: "serif",
            fontSize: 24,
            fill: KOREAN_COLORS.GOLD,
          }}
        />

        {/* Ki display */}
        <PixiTextComponent
          text={`기: ${playerKi}/${playerMaxKi}`}
          y={radius + 20}
          anchor={{ x: 0.5, y: 0.5 }}
          style={{
            fontFamily: "Noto Sans KR, Arial, sans-serif",
            fontSize: 12,
            fill: KOREAN_COLORS.WHITE,
            fontWeight: "bold",
          }}
        />
      </PixiContainerComponent>
    </Application>
  );
}
