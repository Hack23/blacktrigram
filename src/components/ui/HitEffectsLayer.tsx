import { HitEffect } from "@/systems";
import * as PIXI from "pixi.js";
import React, { useCallback, useEffect, useState } from "react";
import { HitEffectType } from "../../systems/effects";
import { KOREAN_COLORS } from "../../types/constants";

export interface HitEffectsLayerProps {
  readonly effects: readonly HitEffect[];
  readonly onEffectComplete?: (effectId: string) => void;
}

// Helper function to draw a dashed line since Graphics.dashedLineTo doesn't exist in PixiJS
const drawDashedLine = (
  g: PIXI.Graphics,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  dashSize = 5,
  gapSize = 5
) => {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const dashCount = Math.floor(distance / (dashSize + gapSize));
  const dashX = (dx / distance) * (dashSize + gapSize);
  const dashY = (dy / distance) * (dashSize + gapSize);

  g.moveTo(fromX, fromY);

  for (let i = 0; i < dashCount; i++) {
    const startX = fromX + i * dashX;
    const startY = fromY + i * dashY;
    const endX = startX + dashX * (dashSize / (dashSize + gapSize));
    const endY = startY + dashY * (dashSize / (dashSize + gapSize));

    g.moveTo(startX, startY);
    g.lineTo(endX, endY);
  }
};

export const HitEffectsLayer: React.FC<HitEffectsLayerProps> = ({
  effects,
  onEffectComplete,
}) => {
  const [activeEffects, setActiveEffects] = useState<readonly HitEffect[]>([]);

  // Process effects
  useEffect(() => {
    setActiveEffects(effects);

    // Clean up expired effects
    const timer = setInterval(() => {
      const now = Date.now();
      setActiveEffects((prev) => {
        const remaining = prev.filter((effect) => {
          const elapsed = now - effect.startTime;
          return elapsed < effect.duration;
        });

        // Report completed effects
        prev
          .filter((effect) => {
            const elapsed = now - effect.startTime;
            return elapsed >= effect.duration;
          })
          .forEach((effect) => {
            onEffectComplete?.(effect.id);
          });

        return remaining;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [effects, onEffectComplete]);

  const renderEffect = useCallback((effect: HitEffect) => {
    const progress = Math.min(
      (Date.now() - effect.startTime) / effect.duration,
      1
    );
    const alpha = 1 - progress;

    return (
      <pixiContainer key={effect.id} data-testid={`hit-effect-${effect.id}`}>
        <pixiGraphics
          draw={(g) => {
            g.clear();

            // Ensure position is defined before using it
            if (!effect.position) {
              console.warn("Hit effect position is undefined", effect);
              return;
            }

            // Use enum values directly for type safety
            const effectType = effect.type;

            switch (effectType) {
              case HitEffectType.HIT:
                // Hit flash
                g.fill({ color: KOREAN_COLORS.ACCENT_RED, alpha: alpha * 0.5 });
                g.circle(
                  effect.position.x,
                  effect.position.y,
                  50 * effect.intensity
                );
                g.fill();
                g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_RED, alpha });
                g.circle(
                  effect.position.x,
                  effect.position.y,
                  60 * effect.intensity
                );
                g.stroke();
                break;

              case HitEffectType.CRITICAL_HIT:
                // Critical hit flash (larger, more intense)
                g.fill({
                  color: KOREAN_COLORS.ACCENT_GOLD,
                  alpha: alpha * 0.7,
                });
                g.circle(
                  effect.position.x,
                  effect.position.y,
                  70 * effect.intensity
                );
                g.fill();
                g.stroke({ width: 3, color: KOREAN_COLORS.ACCENT_RED, alpha });
                g.circle(
                  effect.position.x,
                  effect.position.y,
                  80 * effect.intensity
                );
                g.stroke();

                // Draw X mark for critical
                g.stroke({ width: 4, color: KOREAN_COLORS.ACCENT_RED, alpha });
                g.moveTo(effect.position.x - 30, effect.position.y - 30);
                g.lineTo(effect.position.x + 30, effect.position.y + 30);
                g.moveTo(effect.position.x + 30, effect.position.y - 30);
                g.lineTo(effect.position.x - 30, effect.position.y + 30);
                g.stroke();
                break;

              case HitEffectType.BLOCK:
                // Block effect (shield-like)
                g.stroke({ width: 3, color: KOREAN_COLORS.ACCENT_CYAN, alpha });
                g.arc(
                  effect.position.x,
                  effect.position.y,
                  40 * effect.intensity,
                  0,
                  Math.PI
                );
                g.stroke();

                // Use our helper function instead of dashedLineTo
                g.stroke({
                  width: 2,
                  color: KOREAN_COLORS.ACCENT_CYAN,
                  alpha: alpha * 0.7,
                });
                drawDashedLine(
                  g,
                  effect.position.x - 50,
                  effect.position.y,
                  effect.position.x + 50,
                  effect.position.y,
                  5,
                  5
                );
                drawDashedLine(
                  g,
                  effect.position.x,
                  effect.position.y - 30,
                  effect.position.y + 20,
                  5,
                  5
                );
                g.stroke();
                break;

              case HitEffectType.MISS:
                // Miss effect (swish lines)
                g.stroke({
                  width: 2,
                  color: KOREAN_COLORS.TEXT_TERTIARY,
                  alpha,
                });
                g.moveTo(effect.position.x - 40, effect.position.y - 20);
                g.lineTo(effect.position.x + 40, effect.position.y + 10);
                g.moveTo(effect.position.x - 35, effect.position.y);
                g.lineTo(effect.position.x + 45, effect.position.y - 15);
                g.stroke();

                g.fill({
                  color: KOREAN_COLORS.TEXT_TERTIARY,
                  alpha: alpha * 0.3,
                });
                g.circle(
                  effect.position.x,
                  effect.position.y,
                  30 * effect.intensity
                );
                g.fill();
                break;

              case HitEffectType.VITAL_POINT_STRIKE:
                // Vital point strike (pulsing circle with crosshairs)
                g.fill({
                  color: KOREAN_COLORS.SECONDARY_MAGENTA,
                  alpha: alpha * 0.5,
                });
                g.circle(
                  effect.position.x,
                  effect.position.y,
                  45 * effect.intensity
                );
                g.fill();

                g.stroke({
                  width: 2,
                  color: KOREAN_COLORS.SECONDARY_MAGENTA,
                  alpha,
                });
                g.circle(
                  effect.position.x,
                  effect.position.y,
                  25 * effect.intensity
                );
                g.circle(
                  effect.position.x,
                  effect.position.y,
                  35 * effect.intensity
                );
                g.circle(
                  effect.position.x,
                  effect.position.y,
                  55 * effect.intensity
                );
                g.stroke();

                // Crosshair
                g.stroke({
                  width: 1,
                  color: KOREAN_COLORS.SECONDARY_MAGENTA,
                  alpha: alpha * 0.8,
                });
                g.moveTo(effect.position.x - 60, effect.position.y);
                g.lineTo(effect.position.x + 60, effect.position.y);
                g.moveTo(effect.position.x, effect.position.y - 60);
                g.lineTo(effect.position.x, effect.position.y + 60);
                g.stroke();
                break;

              case HitEffectType.PARRY:
                // Parry effect (deflection arc)
                g.stroke({ width: 3, color: KOREAN_COLORS.ACCENT_GOLD, alpha });
                g.arc(
                  effect.position.x,
                  effect.position.y,
                  35 * effect.intensity,
                  -Math.PI / 4,
                  Math.PI / 4
                );
                g.stroke();

                // Deflection sparks
                for (let i = 0; i < 3; i++) {
                  const angle = (Math.PI / 6) * (i - 1);
                  const sparkX = effect.position.x + Math.cos(angle) * 40;
                  const sparkY = effect.position.y + Math.sin(angle) * 40;
                  g.fill({
                    color: KOREAN_COLORS.ACCENT_GOLD,
                    alpha: alpha * 0.8,
                  });
                  g.circle(sparkX, sparkY, 3);
                  g.fill();
                }
                break;

              case HitEffectType.COUNTER:
                // Counter effect (spinning energy) - using PRIMARY_CYAN instead of missing SECONDARY_CYAN
                g.stroke({
                  width: 2,
                  color: KOREAN_COLORS.PRIMARY_CYAN,
                  alpha,
                });
                const rotation = progress * Math.PI * 4;
                for (let i = 0; i < 4; i++) {
                  const angle = rotation + (Math.PI / 2) * i;
                  const x1 = effect.position.x + Math.cos(angle) * 20;
                  const y1 = effect.position.y + Math.sin(angle) * 20;
                  const x2 = effect.position.x + Math.cos(angle) * 40;
                  const y2 = effect.position.y + Math.sin(angle) * 40;
                  g.moveTo(x1, y1);
                  g.lineTo(x2, y2);
                }
                g.stroke();
                break;

              case HitEffectType.GENERAL_DAMAGE:
              case HitEffectType.STATUS_EFFECT:
              default:
                // Default effect as fallback
                g.fill({
                  color: KOREAN_COLORS.ACCENT_GREEN,
                  alpha: alpha * 0.5,
                });
                g.circle(
                  effect.position.x,
                  effect.position.y,
                  40 * effect.intensity
                );
                g.fill();
                break;
            }
          }}
        />
      </pixiContainer>
    );
  }, []);

  return (
    <pixiContainer data-testid="hit-effects-layer">
      {activeEffects.map((effect) => renderEffect(effect))}
    </pixiContainer>
  );
};

export default HitEffectsLayer;
