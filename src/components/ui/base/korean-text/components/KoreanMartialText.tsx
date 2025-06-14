import React from "react";
import * as PIXI from "pixi.js";
import { usePixiExtensions } from "../../../../../utils/pixiExtensions";
import { KOREAN_COLORS } from "../../../../../types/constants";
import type { KoreanText } from "../../../../../types/korean-text";

export interface KoreanMartialTextProps {
  readonly technique: KoreanText;
  readonly stance: string;
  readonly power?: number;
  readonly showStats?: boolean;
  readonly x?: number;
  readonly y?: number;
}

export const KoreanMartialText: React.FC<KoreanMartialTextProps> = ({
  technique,
  stance,
  power = 0,
  showStats = false,
  x = 0,
  y = 0,
}) => {
  usePixiExtensions();

  const techniqueStyle = new PIXI.TextStyle({
    fontSize: 20,
    fill: KOREAN_COLORS.ACCENT_GOLD,
    fontWeight: "bold",
  });

  const stanceStyle = new PIXI.TextStyle({
    fontSize: 14,
    fill: KOREAN_COLORS.PRIMARY_CYAN,
  });

  const statsStyle = new PIXI.TextStyle({
    fontSize: 12,
    fill: KOREAN_COLORS.TEXT_SECONDARY,
  });

  return (
    <pixiContainer x={x} y={y}>
      <pixiText text={technique.korean} style={techniqueStyle} y={0} />
      <pixiText text={`${stance} 자세`} style={stanceStyle} y={25} />
      {showStats && (
        <pixiText text={`위력: ${power}%`} style={statsStyle} y={45} />
      )}
    </pixiContainer>
  );
};

export default KoreanMartialText;
