// Hit effects layer for combat feedback

import React, { useCallback, useEffect } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import type { HitEffect } from "../../../types/effects";
import { HitEffectType } from "../../../types/effects";
import { KOREAN_COLORS } from "../../../types/constants";
import * as PIXI from "pixi.js";

extend({ Container, Graphics, Text });

export interface HitEffectsLayerProps {
  readonly effects: readonly HitEffect[];
  readonly onEffectComplete: (effectId: string) => void;
}

export const HitEffectsLayer: React.FC<HitEffectsLayerProps> = ({
  effects,
  onEffectComplete,
}) => {
  usePixiExtensions();

  useEffect(() => {
    effects.forEach((effect) => {
      const elapsed = Date.now() - effect.startTime;
      if (elapsed >= effect.duration) {
        onEffectComplete(effect.id);
      }
    });
  }, [effects, onEffectComplete]);

  const getEffectColor = (type: HitEffectType): number => {
    switch (type) {
      case HitEffectType.CRITICAL:
        return KOREAN_COLORS.NEGATIVE_RED;
      case HitEffectType.HIT_NORMAL:
        return KOREAN_COLORS.WARNING_YELLOW;
      case HitEffectType.BLOCK:
        return KOREAN_COLORS.ACCENT_BLUE;
      case HitEffectType.MISS:
        return KOREAN_COLORS.UI_GRAY;
      default:
        return KOREAN_COLORS.TEXT_PRIMARY;
    }
  };

  const drawEffect = useCallback(
    (effect: HitEffect) => (g: PIXI.Graphics) => {
      g.clear();

      const elapsed = Date.now() - effect.startTime;
      const progress = elapsed / effect.duration;
      const alpha = Math.max(0, 1 - progress);
      const scale = 1 + progress * 0.5;

      const color = getEffectColor(effect.type);

      if (effect.type === HitEffectType.CRITICAL) {
        // Explosive effect for critical hits
        g.fill({ color, alpha: alpha * 0.8 });
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const distance = 20 * scale;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          g.circle(x, y, 3);
        }
        g.fill();
      } else {
        // Simple impact effect
        g.fill({ color, alpha: alpha * 0.6 });
        g.circle(0, 0, 10 * scale);
        g.fill();
      }
    },
    []
  );

  return (
    <pixiContainer data-testid="hit-effects-layer">
      {effects.map((effect) => {
        const elapsed = Date.now() - effect.startTime;
        const progress = elapsed / effect.duration;
        const alpha = Math.max(0, 1 - progress);
        const yOffset = -progress * 30; // Float upward

        return (
          <pixiContainer
            key={effect.id}
            x={effect.position.x}
            y={effect.position.y + yOffset}
            alpha={alpha}
          >
            <pixiGraphics draw={drawEffect(effect)} />

            {effect.text && (
              <pixiText
                text={effect.text}
                style={{
                  fontSize: 14,
                  fill: getEffectColor(effect.type),
                  fontWeight: "bold",
                  align: "center",
                }}
                anchor={0.5}
                y={-20}
              />
            )}
          </pixiContainer>
        );
      })}
    </pixiContainer>
  );
};

export default HitEffectsLayer;
