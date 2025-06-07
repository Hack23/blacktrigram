// Hit effects layer for combat feedback

import React, { useMemo } from "react";
import { Container, Graphics, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import type { HitEffect } from "../../types";
import { KOREAN_COLORS, FONT_FAMILY, FONT_SIZES } from "../../types/constants";

interface HitEffectsLayerProps {
  effects: readonly HitEffect[];
}

export const HitEffectsLayer: React.FC<HitEffectsLayerProps> = ({
  effects,
}) => {
  const activeEffects = useMemo(() => {
    const now = Date.now();
    return effects.filter((effect) => now - effect.timestamp < effect.duration);
  }, [effects]);

  const textStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.medium,
        fill: KOREAN_COLORS.TEXT_ACCENT,
        stroke: KOREAN_COLORS.BLACK_SOLID,
        align: "center",
      }),
    []
  );

  return (
    <Container>
      {activeEffects.map((effect) => {
        const now = Date.now();
        const elapsed = now - effect.timestamp;
        const progress = elapsed / effect.duration;
        const alpha = 1 - progress;
        const yOffset = -progress * 30; // Float upward

        return (
          <Container
            key={effect.id}
            x={effect.position.x}
            y={effect.position.y + yOffset}
            alpha={alpha}
          >
            {/* Hit flash effect */}
            <Graphics
              draw={(g: PIXI.Graphics) => {
                g.clear();
                const radius = effect.type === "critical" ? 20 : 15;
                g.beginFill(effect.color, 0.6);
                g.drawCircle(0, 0, radius * (1 - progress * 0.5));
                g.endFill();
              }}
            />

            {/* Damage text */}
            <Text
              text={effect.damage.toString()}
              anchor={0.5}
              style={{
                ...textStyle,
                fill:
                  effect.type === "critical"
                    ? KOREAN_COLORS.ACCENT_RED
                    : KOREAN_COLORS.TEXT_ACCENT,
                fontSize:
                  effect.type === "critical"
                    ? FONT_SIZES.large
                    : FONT_SIZES.medium,
              }}
              y={-10}
            />
          </Container>
        );
      })}
    </Container>
  );
};

export default HitEffectsLayer;
