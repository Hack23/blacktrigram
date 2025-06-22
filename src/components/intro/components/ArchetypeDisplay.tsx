import type { Texture } from "pixi.js";
import React from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import { ResponsivePixiContainer } from "../../ui/base/ResponsivePixiComponents";

// Shape matching ARCHETYPE_DATA entries
export interface ArchetypeDataShape {
  readonly id: string;
  readonly korean: string;
  readonly english: string;
  readonly description: string;
  readonly color: number;
  readonly textureKey: string;
}

export interface ArchetypeDisplayProps {
  readonly archetype: ArchetypeDataShape;
  readonly texture: Texture | null;
  readonly total: number;
  readonly index: number;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly width: number;
  readonly isMobile: boolean;
}

const ArchetypeDisplay: React.FC<ArchetypeDisplayProps> = React.memo(
  ({ archetype, texture, total, index, onPrev, onNext, width, isMobile }) => (
    <ResponsivePixiContainer
      x={0}
      y={0}
      screenWidth={width}
      screenHeight={isMobile ? 300 : 400}
      data-testid={`archetype-display-${archetype.id}`}
    >
      <pixiContainer
        layout={{
          width,
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: 24,
        }}
        aria-label="Archetype selection"
      >
        {texture && (
          <pixiSprite
            texture={texture}
            width={isMobile ? 120 : 180}
            height={isMobile ? 200 : 300}
            anchor={0.5}
            x={isMobile ? width / 2 : 90}
            y={isMobile ? 110 : 150}
          />
        )}
        <pixiContainer
          layout={{
            flexDirection: "column",
            alignItems: isMobile ? "center" : "flex-start",
            gap: 8,
          }}
        >
          <pixiText
            text={`${archetype.korean} - ${archetype.english}`}
            style={{
              fontSize: 18,
              fill: archetype.color,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR, NanumGothic, sans-serif",
            }}
          />
          <pixiText
            text={archetype.description}
            style={{
              fontSize: 14,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              wordWrap: true,
              wordWrapWidth: width * 0.6,
            }}
          />
          <pixiText
            text={`${index + 1} / ${total}`}
            style={{
              fontSize: 12,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
          />
          <pixiContainer layout={{ flexDirection: "row", gap: 12 }}>
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.beginFill(KOREAN_COLORS.ACCENT_GOLD, 0.8);
                g.roundRect(0, 0, 40, 40, 8);
                g.endFill();
              }}
              interactive
              onPointerDown={onPrev}
              tabIndex={0}
              aria-label="Previous archetype"
            />
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.beginFill(KOREAN_COLORS.ACCENT_GOLD, 0.8);
                g.roundRect(0, 0, 40, 40, 8);
                g.endFill();
              }}
              interactive
              onPointerDown={onNext}
              tabIndex={0}
              aria-label="Next archetype"
            />
          </pixiContainer>
        </pixiContainer>
      </pixiContainer>
    </ResponsivePixiContainer>
  )
);

export default ArchetypeDisplay;
