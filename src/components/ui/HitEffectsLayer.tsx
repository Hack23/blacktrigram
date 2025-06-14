import React, { useEffect, useState } from "react";
import { usePixiExtensions } from "../../utils/pixiExtensions";
import type { DisplayHitEffect } from "../../types/effects"; // Fix: Remove unused HitEffect import
import { KOREAN_COLORS } from "../../types/constants";
import type { HitEffectsLayerProps } from "../../types/components";

export const HitEffectsLayer: React.FC<HitEffectsLayerProps> = ({
  effects,
  onEffectComplete,
  // Fix: Remove unused width and height parameters
}) => {
  usePixiExtensions();

  const [displayEffects, setDisplayEffects] = useState<DisplayHitEffect[]>([]);

  useEffect(() => {
    // Fix: Update display effects with all required properties
    const updatedEffects = effects.map(
      (effect) =>
        ({
          ...effect, // Include all base HitEffect properties
          opacity: Math.max(
            0,
            1 - (Date.now() - effect.timestamp) / effect.duration
          ),
          scale: 1 + ((Date.now() - effect.timestamp) / effect.duration) * 0.5,
          startTime: effect.timestamp, // Fix: Use timestamp as startTime
          displayAlpha: 1,
          displayY: effect.position?.y || 0,
          displaySize: 1,
          // Ensure required DisplayHitEffect properties are present
          attackerId: effect.attackerId || "unknown",
          defenderId: effect.defenderId || "unknown",
        } satisfies DisplayHitEffect)
    );

    setDisplayEffects(updatedEffects);

    // Clean up expired effects
    effects.forEach((effect) => {
      if (Date.now() - effect.timestamp > effect.duration) {
        onEffectComplete(effect.id);
      }
    });
  }, [effects, onEffectComplete]);

  return (
    <pixiContainer data-testid="hit-effects-layer">
      {displayEffects.map((effect) => (
        <pixiContainer
          key={effect.id}
          x={effect.position?.x || 0}
          y={effect.displayY}
          alpha={effect.opacity}
        >
          <pixiText
            text={effect.text || effect.type}
            style={{
              fontSize: 16 * effect.scale,
              fill: KOREAN_COLORS.CRITICAL_HIT,
              fontWeight: "bold",
              align: "center",
            }}
            anchor={0.5}
          />
        </pixiContainer>
      ))}
    </pixiContainer>
  );
};

export default HitEffectsLayer;
