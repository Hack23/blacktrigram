import React from "react";
import * as PIXI from "pixi.js";
import { usePixiExtensions } from "../../../../../utils/pixiExtensions";
import { KOREAN_COLORS } from "../../../../../types/constants";
import type { KoreanTechnique } from "../../../../../types/combat";

export interface KoreanTechniqueTextProps {
  readonly technique: KoreanTechnique;
  readonly showDetails?: boolean;
  readonly compact?: boolean;
  readonly x?: number;
  readonly y?: number;
}

export const KoreanTechniqueText: React.FC<KoreanTechniqueTextProps> = ({
  technique,
  showDetails = false,
  compact = false,
  x = 0,
  y = 0,
}) => {
  usePixiExtensions();

  const nameStyle = new PIXI.TextStyle({
    fontSize: compact ? 14 : 18,
    fill: KOREAN_COLORS.ACCENT_GOLD,
    fontWeight: "bold",
  });

  const detailStyle = new PIXI.TextStyle({
    fontSize: 12,
    fill: KOREAN_COLORS.TEXT_SECONDARY,
  });

  return (
    <pixiContainer x={x} y={y}>
      <pixiText text={technique.koreanName} style={nameStyle} y={0} />
      {!compact && (
        <pixiText text={technique.englishName} style={detailStyle} y={20} />
      )}
      {showDetails && (
        <>
          <pixiText
            text={`위력: ${technique.damage || 0}`}
            style={detailStyle}
            y={compact ? 20 : 40}
          />
          <pixiText
            text={`기력: ${technique.kiCost}`}
            style={detailStyle}
            y={compact ? 35 : 55}
          />
        </>
      )}
    </pixiContainer>
  );
};

export default KoreanTechniqueText;
