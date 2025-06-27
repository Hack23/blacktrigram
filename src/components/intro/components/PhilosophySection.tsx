import "@pixi/layout";
import type { PixiReactElementProps } from "@pixi/react";
import { extend } from "@pixi/react";
import { FancyButton, ScrollBox } from "@pixi/ui";
import { Container, FederatedPointerEvent, Graphics, Text } from "pixi.js";
import React, { useCallback, useMemo, useState } from "react";
import { KOREAN_COLORS } from "../../../types/constants";

// Extend all necessary components including ScrollBox
extend({ Container, ScrollBox, FancyButton, Graphics, Text });

// Add module declaration for the custom JSX elements
declare module "@pixi/react" {
  interface PixiElements {
    scrollBox: PixiReactElementProps<typeof ScrollBox>;
    fancyButton: PixiReactElementProps<typeof FancyButton>;
  }
}

const PHILOSOPHY_CONTENT = {
  title: { korean: "무술 철학", english: "Martial Philosophy" },
  sections: [
    {
      id: "black-trigram",
      title: "흑괘 (Black Trigram)",
      subtitle: "The Way of Eight Forces",
      content: `팔괘는 고대 중국의 역경(I Ching)에서 유래한 여덟 가지 기본 기호로, 
우주의 모든 현상을 나타냅니다. 한국 무술에서는 이를 전투 자세와 
연결하여 몸과 마음의 조화를 추구합니다.

The eight trigrams represent fundamental forces of nature, 
adapted into Korean martial arts as combat stances that 
harmonize body and mind.`,
    },
    {
      id: "eight-trigrams",
      title: "팔괘의 의미",
      subtitle: "Meaning of the Eight Trigrams",
      trigrams: [
        {
          symbol: "☰",
          name: "건 (Geon)",
          english: "Heaven",
          meaning: "직접적인 힘 (Direct Force)",
        },
        {
          symbol: "☱",
          name: "태 (Tae)",
          english: "Lake",
          meaning: "유연한 적응 (Fluid Adaptation)",
        },
        {
          symbol: "☲",
          name: "리 (Li)",
          english: "Fire",
          meaning: "정밀한 공격 (Precise Strike)",
        },
        {
          symbol: "☳",
          name: "진 (Jin)",
          english: "Thunder",
          meaning: "폭발적인 힘 (Explosive Power)",
        },
        {
          symbol: "☴",
          name: "손 (Son)",
          english: "Wind",
          meaning: "지속적인 압박 (Continuous Pressure)",
        },
        {
          symbol: "☵",
          name: "감 (Gam)",
          english: "Water",
          meaning: "흐름과 반격 (Flow & Counter)",
        },
        {
          symbol: "☶",
          name: "간 (Gan)",
          english: "Mountain",
          meaning: "견고한 방어 (Solid Defense)",
        },
        {
          symbol: "☷",
          name: "곤 (Gon)",
          english: "Earth",
          meaning: "포용과 제압 (Ground & Control)",
        },
      ],
    },
    {
      id: "martial-spirit",
      title: "무도의 정신",
      subtitle: "Spirit of the Martial Way",
      content: `무술은 단순한 격투가 아닌, 자신을 수양하고 상대를 존중하는 도(道)입니다.
진정한 무술가는 힘보다는 지혜를, 폭력보다는 평화를 추구합니다.

Martial arts is not merely combat, but a Way (道) of self-cultivation 
and respect for others. True martial artists seek wisdom over strength, 
peace over violence.`,
    },
    {
      id: "vital-points",
      title: "급소와 인체학",
      subtitle: "Vital Points and Anatomy",
      content: `한국 전통 무술은 인체의 급소(急所)에 대한 깊은 이해를 바탕으로 합니다.
70개 이상의 주요 급소를 정확히 알고 활용하는 것이 무술의 핵심입니다.

Korean traditional martial arts are based on deep understanding 
of vital points (급소). Knowing and utilizing over 70 major 
vital points precisely is the core of martial arts mastery.`,
    },
  ],
};

export interface PhilosophySectionProps {
  readonly onBack: () => void;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
}

// Type for trigram data
type TrigramData = {
  symbol: string;
  name: string;
  english: string;
  meaning: string;
};

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  onBack,
  x = 0,
  y = 0,
  width = 800,
  height = 600,
}) => {
  const [selectedTrigram, setSelectedTrigram] = useState<string | null>(null);
  const isMobile = width < 768;
  const padding = isMobile ? 20 : 40;
  const contentWidth = width - padding * 2;
  const scrollHeight = height - 180; // Reserve space for header and back button

  // Memoized layout configurations
  const containerLayout = useMemo(
    () => ({
      width,
      height,
      position: { x, y },
    }),
    [width, height, x, y]
  );

  // Create button views for FancyButton
  const buttonViews = useMemo(
    () => ({
      defaultView: (() => {
        const g = new Graphics();
        g.roundRect(0, 0, 140, 40, 8);
        g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.9 });
        return g;
      })(),
      hoverView: (() => {
        const g = new Graphics();
        g.roundRect(0, 0, 140, 40, 8);
        g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_LIGHT });
        return g;
      })(),
      pressedView: (() => {
        const g = new Graphics();
        g.roundRect(0, 0, 140, 40, 8);
        g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK });
        return g;
      })(),
    }),
    []
  );

  // Trigram card component
  const TrigramCard: React.FC<{
    trigram: TrigramData;
  }> = useCallback(
    ({ trigram }) => {
      const isSelected = selectedTrigram === trigram.symbol;
      const cardWidth = isMobile
        ? (contentWidth - 16) / 2
        : (contentWidth - 48) / 4;

      return (
        <pixiContainer
          interactive
          cursor="pointer"
          onpointertap={() =>
            setSelectedTrigram(isSelected ? null : trigram.symbol)
          }
          data-testid={`trigram-${trigram.english.toLowerCase()}`}
        >
          {/* Card background */}
          <pixiGraphics
            draw={useCallback(
              (g: Graphics) => {
                g.clear();
                g.roundRect(0, 0, cardWidth, isSelected ? 140 : 100, 8);
                g.fill({
                  color: isSelected
                    ? KOREAN_COLORS.ACCENT_GOLD
                    : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.9,
                });
              },
              [cardWidth, isSelected]
            )}
            interactive
            onpointerover={(e: FederatedPointerEvent) => {
              if (!isSelected) {
                e.currentTarget.alpha = 0.8;
              }
            }}
            onpointerout={(e: FederatedPointerEvent) => {
              e.currentTarget.alpha = 1;
            }}
          />

          {/* Trigram symbol */}
          <pixiText
            text={trigram.symbol}
            style={{
              fontSize: 32,
              fill: isSelected
                ? KOREAN_COLORS.UI_BACKGROUND_DARK
                : KOREAN_COLORS.PRIMARY_CYAN,
            }}
            anchor={0.5}
            x={cardWidth / 2}
            y={25}
          />

          {/* Korean name */}
          <pixiText
            text={trigram.name}
            style={{
              fontSize: 14,
              fill: isSelected
                ? KOREAN_COLORS.UI_BACKGROUND_DARK
                : KOREAN_COLORS.TEXT_PRIMARY,
              fontFamily: "Noto Sans KR, sans-serif",
              fontWeight: "bold",
            }}
            anchor={0.5}
            x={cardWidth / 2}
            y={55}
          />

          {/* English name */}
          <pixiText
            text={trigram.english}
            style={{
              fontSize: 12,
              fill: isSelected
                ? KOREAN_COLORS.UI_BACKGROUND_DARK
                : KOREAN_COLORS.TEXT_SECONDARY,
            }}
            anchor={0.5}
            x={cardWidth / 2}
            y={75}
          />

          {/* Meaning (only when selected) */}
          {isSelected && (
            <pixiText
              text={trigram.meaning}
              style={{
                fontSize: 11,
                fill: KOREAN_COLORS.UI_BACKGROUND_DARK,
                fontFamily: "Noto Sans KR, sans-serif",
                align: "center",
                wordWrap: true,
                wordWrapWidth: cardWidth - 20,
              }}
              anchor={0.5}
              x={cardWidth / 2}
              y={110}
            />
          )}
        </pixiContainer>
      );
    },
    [selectedTrigram, isMobile, contentWidth]
  );

  return (
    <pixiContainer {...containerLayout} data-testid="philosophy-section">
      {/* Main background */}
      <pixiGraphics
        draw={useCallback(
          (g: Graphics) => {
            g.clear();
            g.roundRect(0, 0, width, height, 16);
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.95 });

            // Decorative border
            g.roundRect(0, 0, width, height, 16);
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.4,
            });
          },
          [width, height]
        )}
      />

      {/* Header */}
      <pixiContainer x={width / 2} y={padding}>
        <pixiText
          text={PHILOSOPHY_CONTENT.title.korean}
          style={{
            fontSize: isMobile ? 28 : 36,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: "bold",
            dropShadow: {
              color: 0x000000,
              blur: 4,
              distance: 2,
            },
          }}
          anchor={0.5}
        />
        <pixiText
          text={PHILOSOPHY_CONTENT.title.english}
          style={{
            fontSize: isMobile ? 16 : 20,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          anchor={0.5}
          y={isMobile ? 35 : 45}
        />
      </pixiContainer>

      {/* ScrollBox for content - using lowercase element name */}
      <pixiScrollBox
        width={contentWidth}
        height={scrollHeight}
        x={padding}
        y={padding + 80}
        background={KOREAN_COLORS.UI_BACKGROUND_DARK}
        elementsMargin={16}
        padding={10}
        radius={8}
        disableDynamicRendering={false}
      >
        {/* Content container */}
        <pixiContainer>
          {PHILOSOPHY_CONTENT.sections.map((section, sectionIndex) => (
            <pixiContainer
              key={section.id}
              y={sectionIndex * 300} // Approximate spacing
            >
              {/* Section background */}
              <pixiGraphics
                draw={(g: Graphics) => {
                  g.clear();
                  const sectionHeight = section.trigrams ? 400 : 200;
                  g.roundRect(0, 0, contentWidth - 40, sectionHeight, 12);
                  g.fill({
                    color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                    alpha: 0.8,
                  });
                }}
              />

              {/* Section header */}
              <pixiContainer x={20} y={20}>
                <pixiText
                  text={section.title}
                  style={{
                    fontSize: isMobile ? 20 : 24,
                    fill: KOREAN_COLORS.PRIMARY_CYAN,
                    fontFamily: "Noto Sans KR, sans-serif",
                    fontWeight: "bold",
                  }}
                />
                <pixiText
                  text={section.subtitle}
                  style={{
                    fontSize: isMobile ? 14 : 16,
                    fill: KOREAN_COLORS.TEXT_SECONDARY,
                  }}
                  y={30}
                />
              </pixiContainer>

              {/* Section content */}
              {section.content && (
                <pixiText
                  text={section.content}
                  x={20}
                  y={70}
                  style={{
                    fontSize: isMobile ? 13 : 15,
                    fill: KOREAN_COLORS.TEXT_PRIMARY,
                    fontFamily: "Noto Sans KR, sans-serif",
                    lineHeight: 24,
                    wordWrap: true,
                    wordWrapWidth: contentWidth - 80,
                  }}
                />
              )}

              {/* Trigram grid */}
              {section.trigrams && (
                <pixiContainer x={20} y={100}>
                  {section.trigrams.map((trigram, index) => {
                    const cardWidth = isMobile
                      ? (contentWidth - 56) / 2
                      : (contentWidth - 88) / 4;
                    const col = index % (isMobile ? 2 : 4);
                    const row = Math.floor(index / (isMobile ? 2 : 4));
                    const xPos = col * (cardWidth + 16);
                    const yPos = row * 120;

                    return (
                      <pixiContainer key={trigram.symbol} x={xPos} y={yPos}>
                        <TrigramCard trigram={trigram} />
                      </pixiContainer>
                    );
                  })}
                </pixiContainer>
              )}
            </pixiContainer>
          ))}
        </pixiContainer>
      </pixiScrollBox>

      {/* Back button using FancyButton - using lowercase element name */}
      <pixiFancyButton
        x={width - padding - 140}
        y={height - padding - 40}
        defaultView={buttonViews.defaultView}
        hoverView={buttonViews.hoverView}
        pressedView={buttonViews.pressedView}
        onPress={onBack}
        text="돌아가기\nBack"
        textStyle={{
          fontSize: 14,
          fill: KOREAN_COLORS.TEXT_PRIMARY,
          fontFamily: "Noto Sans KR, sans-serif",
          align: "center",
          lineHeight: 16,
        }}
        data-testid="philosophy-back-button"
      />
    </pixiContainer>
  );
};

export default PhilosophySection;
