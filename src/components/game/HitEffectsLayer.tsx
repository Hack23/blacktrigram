// Hit effects layer for combat feedback

import React from "react";
import { usePixiExtensions } from "../../utils/pixiExtensions";
import { KOREAN_COLORS } from "../../types/constants";
import type { HitEffect } from "../../types/effects";

export interface HitEffectsLayerProps {
  readonly effects: readonly HitEffect[];
  readonly onEffectComplete?: (effectId: string) => void;
  readonly width?: number;
  readonly height?: number;
}

export const HitEffectsLayer: React.FC<HitEffectsLayerProps> = ({
  effects,
  onEffectComplete,
  width = 800, // Fix: Use the parameter in a log
  height = 600, // Fix: Use the parameter in a log
}) => {
  usePixiExtensions();

  // Fix: Use the parameters
  React.useEffect(() => {
    effects.forEach((effect) => {
      if (effect.duration <= 0) {
        onEffectComplete?.(effect.id);
      }
    });
  }, [effects, onEffectComplete]);

  // Fix: Use width and height parameters
  React.useEffect(() => {
    console.log(`Hit effects layer size: ${width}x${height}`);
  }, [width, height]);

  // Fix: Define getEffectColor function
  const getEffectColor = (type: string): number => {
    switch (type) {
      case "critical_hit":
        return KOREAN_COLORS.CRITICAL_HIT;
      case "vital_point_strike":
        return KOREAN_COLORS.VITAL_POINT_HIT;
      case "block":
        return KOREAN_COLORS.BLOCKED_ATTACK;
      case "miss":
        return KOREAN_COLORS.UI_GRAY;
      default:
        return KOREAN_COLORS.TEXT_PRIMARY;
    }
  };

  return (
    <pixiContainer data-testid="hit-effects-layer">
      {effects.map((effect) => {
        const color = getEffectColor(effect.type);
        const alpha = Math.max(0, Math.min(1, effect.alpha || 1));
        const size = (effect.size || 1) * effect.intensity;

        return (
          <pixiContainer
            key={effect.id}
            x={effect.position?.x || 0}
            y={effect.position?.y || 0}
            alpha={alpha}
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.beginFill(color, 0.8);
                g.drawCircle(0, 0, 10 * size);
                g.endFill();

                g.lineStyle(2, color, 0.6);
                g.drawCircle(0, 0, 15 * size);
              }}
            />

            {effect.text && (
              <pixiText
                text={
                  typeof effect.text === "string"
                    ? effect.text
                    : effect.text.korean
                }
                style={{
                  fontSize: 12 * size,
                  fill: color,
                  fontWeight: "bold",
                  align: "center",
                  stroke: color,
                }}
                anchor={0.5}
                y={-20 * size}
              />
            )}
          </pixiContainer>
        );
      })}
    </pixiContainer>
  );
};

export default HitEffectsLayer;
