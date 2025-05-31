import React, { useCallback } from "react";
import type { Graphics as PixiGraphics } from "pixi.js";
import {
  PixiContainerComponent,
  PixiGraphicsComponent,
  PixiTextComponent,
} from "../ui/base/PixiComponents";
import { KOREAN_COLORS, type HitEffect } from "../../types";

export interface HitEffectsLayerProps {
  readonly effects: readonly HitEffect[];
  readonly currentTime: number;
}

export function HitEffectsLayer({
  effects,
  currentTime,
}: HitEffectsLayerProps): React.ReactElement {
  const getEffectAlpha = useCallback(
    (effect: HitEffect): number => {
      const elapsed = currentTime - effect.startTime;
      const progress = elapsed / effect.duration;
      return Math.max(0, 1 - progress);
    },
    [currentTime]
  );

  const getEffectScale = useCallback(
    (effect: HitEffect): number => {
      const elapsed = currentTime - effect.startTime;
      const progress = elapsed / effect.duration;
      return 1 + progress * 0.5; // Grow slightly over time
    },
    [currentTime]
  );

  const getDamageColor = useCallback((damage: number): number => {
    if (damage > 30) return KOREAN_COLORS.CRITICAL_RED;
    if (damage > 20) return KOREAN_COLORS.Red;
    if (damage > 10) return KOREAN_COLORS.Orange;
    return KOREAN_COLORS.DAMAGE_YELLOW;
  }, []);

  const getKoreanHitText = useCallback((effect: HitEffect): string => {
    switch (effect.type) {
      case "critical":
        return "치명타!";
      case "heavy":
        return "강타!";
      case "medium":
        return "타격!";
      case "light":
        return "경타";
      case "block":
        return "방어!";
      case "miss":
        return "빗나감";
      default:
        return "타격";
    }
  }, []);

  return (
    <PixiContainerComponent>
      {effects.map((effect) => {
        const alpha = getEffectAlpha(effect);
        const scale = getEffectScale(effect);

        if (alpha <= 0) return null;

        return (
          <PixiContainerComponent
            key={effect.id}
            x={effect.position.x}
            y={effect.position.y}
            alpha={alpha}
          >
            {/* Impact circle effect */}
            <PixiGraphicsComponent
              draw={(g: PixiGraphics) => {
                g.clear();

                // Outer impact ring
                g.setStrokeStyle({
                  color: effect.color,
                  width: 3,
                  alpha: alpha * 0.8,
                });
                g.circle(0, 0, 20 * scale);
                g.stroke();

                // Inner impact flash
                if (effect.type === "critical") {
                  g.setFillStyle({
                    color: KOREAN_COLORS.CRITICAL_RED,
                    alpha: alpha * 0.4,
                  });
                  g.circle(0, 0, 15 * scale);
                  g.fill();
                }
              }}
            />

            {/* Damage number */}
            <PixiTextComponent
              text={effect.damage.toString()}
              y={-30 * scale}
              anchor={{ x: 0.5, y: 0.5 }}
              style={{
                fontFamily: "Noto Sans KR, Arial, sans-serif",
                fontSize: 16 + (effect.damage > 20 ? 4 : 0),
                fill: getDamageColor(effect.damage),
                fontWeight: "bold",
              }}
            />

            {/* Korean hit text */}
            <PixiTextComponent
              text={getKoreanHitText(effect)}
              y={20 * scale}
              anchor={{ x: 0.5, y: 0.5 }}
              style={{
                fontFamily: "Noto Sans KR, Arial, sans-serif",
                fontSize: 12,
                fill: KOREAN_COLORS.WHITE,
                fontWeight: "bold",
              }}
            />
          </PixiContainerComponent>
        );
      })}
    </PixiContainerComponent>
  );
}
