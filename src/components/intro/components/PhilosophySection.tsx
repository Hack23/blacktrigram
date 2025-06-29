import "@pixi/layout";
import {
  LayoutContainer,
  LayoutGraphics,
  LayoutText,
} from "@pixi/layout/components";
import "@pixi/layout/react";
import { extend } from "@pixi/react";
import { FancyButton, ScrollBox } from "@pixi/ui";
import { Container, FederatedPointerEvent, Graphics, Text } from "pixi.js";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { KOREAN_COLORS } from "../../../types/constants";

// Extend with both regular PIXI and layout components
extend({
  Container,
  LayoutContainer,
  ScrollBox,
  FancyButton,
  Graphics,
  LayoutGraphics,
  Text,
  LayoutText,
});

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
      content: `Korean traditional martial arts are based on deep understanding 
of vital points (급소). Knowing and utilizing over 70 major 
vital points precisely is the core of martial arts mastery.`,
    },
  ],
};

export interface PhilosophySectionProps {
  readonly onBack: () => void;
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
  width = 800,
  height = 600,
}) => {
  const [selectedTrigram, setSelectedTrigram] = useState<string | null>(null);
  const backButtonRef = useRef<FancyButton | null>(null); // FancyButton from @pixi/ui
  const isMobile = width < 768;
  const padding = isMobile ? 20 : 40;

  // Layout configuration object similar to IntroScreen
  const defaults = useMemo(
    () => ({
      backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
      backgroundAlpha: 0.9,
      borderRadius: 12,
    }),
    []
  );

  // Main layout configuration
  const rootLayout = useMemo(
    () => ({
      width,
      height,
      flexDirection: "column" as const,
      alignItems: "center" as const,
      backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
      backgroundAlpha: 0.95,
      borderRadius: 16,
      padding,
    }),
    [width, height, padding]
  );

  // Header layout
  const headerLayout = useMemo(
    () => ({
      ...defaults,
      width: width - padding * 2,
      flexBasis: 100,
      flexDirection: "column" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      margin: 10,
    }),
    [defaults, width, padding]
  );

  // Content area layout
  const contentLayout = useMemo(
    () => ({
      ...defaults,
      width: width - padding * 2,
      flexGrow: 1,
      flexDirection: "column" as const,
      padding: 20,
      gap: 20,
    }),
    [defaults, width, padding]
  );

  // Footer layout for back button
  const footerLayout = useMemo(
    () => ({
      ...defaults,
      width: width - padding * 2,
      flexBasis: 60,
      flexDirection: "row" as const,
      justifyContent: "flex-end" as const,
      alignItems: "center" as const,
      padding: 20,
    }),
    [defaults, width, padding]
  );

  // Create button views for FancyButton with proper text
  const buttonViews = useMemo(
    () => ({
      defaultView: (() => {
        const g = new Graphics();
        g.roundRect(0, 0, 140, 40, 8);
        g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.9 });
        g.stroke({
          width: 2,
          color: KOREAN_COLORS.ACCENT_GOLD,
          alpha: 0.8,
        });
        g.roundRect(0, 0, 140, 40, 8);
        g.stroke();
        return g;
      })(),
      hoverView: (() => {
        const g = new Graphics();
        g.roundRect(0, 0, 140, 40, 8);
        g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_LIGHT });
        g.stroke({
          width: 2,
          color: KOREAN_COLORS.ACCENT_GOLD,
          alpha: 1.0,
        });
        g.roundRect(0, 0, 140, 40, 8);
        g.stroke();
        return g;
      })(),
      pressedView: (() => {
        const g = new Graphics();
        g.roundRect(0, 0, 140, 40, 8);
        g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK });
        g.stroke({
          width: 2,
          color: KOREAN_COLORS.ACCENT_GOLD,
          alpha: 0.6,
        });
        g.roundRect(0, 0, 140, 40, 8);
        g.stroke();
        return g;
      })(),
      buttonText: (() => {
        const text = new Text({
          text: "돌아가기\nBack",
          style: {
            fontSize: 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontFamily: "Noto Sans KR, sans-serif",
            align: "center",
            lineHeight: 16,
          },
        });
        text.anchor.set(0.5);
        return text;
      })(),
    }),
    []
  );

  // Trigram card component using layout containers
  const TrigramCard: React.FC<{
    trigram: TrigramData;
  }> = useCallback(
    ({ trigram }) => {
      const isSelected = selectedTrigram === trigram.symbol;
      const cardWidth = isMobile ? 140 : 160;
      const cardHeight = isSelected ? 140 : 100;

      const cardLayout = {
        ...defaults,
        width: cardWidth,
        height: cardHeight,
        flexDirection: "column" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        margin: 8,
        backgroundColor: isSelected
          ? KOREAN_COLORS.ACCENT_GOLD
          : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
        backgroundAlpha: 0.9,
        borderRadius: 8,
      };

      return (
        <layoutContainer
          layout={cardLayout}
          interactive
          cursor="pointer"
          onPointerTap={() =>
            setSelectedTrigram(isSelected ? null : trigram.symbol)
          }
          onPointerOver={(e: FederatedPointerEvent) => {
            if (!isSelected) {
              e.currentTarget.alpha = 0.8;
            }
          }}
          onPointerOut={(e: FederatedPointerEvent) => {
            e.currentTarget.alpha = 1;
          }}
          data-testid={`trigram-${trigram.english.toLowerCase()}`}
        >
          {/* Trigram symbol */}
          <layoutText
            text={trigram.symbol}
            style={{
              fontSize: 32,
              fill: isSelected
                ? KOREAN_COLORS.UI_BACKGROUND_DARK
                : KOREAN_COLORS.PRIMARY_CYAN,
            }}
            layout={{
              marginBottom: 5,
            }}
          />

          {/* Korean name */}
          <layoutText
            text={trigram.name}
            style={{
              fontSize: 14,
              fill: isSelected
                ? KOREAN_COLORS.UI_BACKGROUND_DARK
                : KOREAN_COLORS.TEXT_PRIMARY,
              fontFamily: "Noto Sans KR, sans-serif",
              fontWeight: "bold",
            }}
            layout={{
              marginBottom: 3,
            }}
          />

          {/* English name */}
          <layoutText
            text={trigram.english}
            style={{
              fontSize: 12,
              fill: isSelected
                ? KOREAN_COLORS.UI_BACKGROUND_DARK
                : KOREAN_COLORS.TEXT_SECONDARY,
            }}
            layout={{
              marginBottom: isSelected ? 8 : 0,
            }}
          />

          {/* Meaning (only when selected) */}
          {isSelected && (
            <layoutText
              text={trigram.meaning}
              style={{
                fontSize: 11,
                fill: KOREAN_COLORS.UI_BACKGROUND_DARK,
                fontFamily: "Noto Sans KR, sans-serif",
                align: "center",
                wordWrap: true,
                wordWrapWidth: cardWidth - 20,
              }}
              layout={{
                marginTop: 5,
              }}
            />
          )}
        </layoutContainer>
      );
    },
    [selectedTrigram, isMobile, defaults]
  );

  // Create back button component that handles FancyButton properly
  const BackButton: React.FC = useCallback(() => {
    return (
      <pixiFancyButton
        ref={backButtonRef}
        defaultView={buttonViews.defaultView}
        hoverView={buttonViews.hoverView}
        pressedView={buttonViews.pressedView}
        text={buttonViews.buttonText}
        data-testid="philosophy-back-button"
      />
    );
  }, [buttonViews]);

  // Connect the onPress handler using useEffect
  useEffect(() => {
    if (backButtonRef.current) {
      const button = backButtonRef.current;

      // Clear any existing connections
      button.onPress.disconnectAll();

      // Connect the onBack handler
      button.onPress.connect(onBack);

      return () => {
        // Cleanup on unmount
        if (button.destroyed) return;
        button.onPress.disconnectAll();
      };
    }
  }, [onBack]);

  return (
    <layoutContainer layout={rootLayout} data-testid="philosophy-section">
      {/* Header Section */}
      <layoutContainer layout={headerLayout}>
        <layoutText
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
          layout={{
            marginBottom: 10,
          }}
        />
        <layoutText
          text={PHILOSOPHY_CONTENT.title.english}
          style={{
            fontSize: isMobile ? 16 : 20,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          layout={{
            marginBottom: 0,
          }}
        />
      </layoutContainer>

      {/* Content Area with Scrollable Sections */}
      <layoutContainer layout={contentLayout}>
        {PHILOSOPHY_CONTENT.sections.map((section) => {
          const sectionLayout = {
            ...defaults,
            width: width - padding * 4,
            flexDirection: "column" as const,
            padding: 20,
            margin: 10,
            backgroundColor: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
            backgroundAlpha: 0.8,
            borderRadius: 12,
          };

          return (
            <layoutContainer key={section.id} layout={sectionLayout}>
              {/* Section Header */}
              <layoutContainer
                layout={{
                  width: width - padding * 6,
                  flexBasis: 80,
                  flexDirection: "column" as const,
                  marginBottom: 15,
                }}
              >
                <layoutText
                  text={section.title}
                  style={{
                    fontSize: isMobile ? 20 : 24,
                    fill: KOREAN_COLORS.PRIMARY_CYAN,
                    fontFamily: "Noto Sans KR, sans-serif",
                    fontWeight: "bold",
                  }}
                  layout={{
                    marginBottom: 5,
                  }}
                />
                <layoutText
                  text={section.subtitle}
                  style={{
                    fontSize: isMobile ? 14 : 16,
                    fill: KOREAN_COLORS.TEXT_SECONDARY,
                  }}
                  layout={{
                    marginBottom: 0,
                  }}
                />
              </layoutContainer>

              {/* Section Content */}
              {section.content && (
                <layoutContainer
                  layout={{
                    width: width - padding * 6,
                    flexGrow: 0.5,
                    marginBottom: section.trigrams ? 20 : 0,
                  }}
                >
                  <layoutText
                    text={section.content}
                    style={{
                      fontSize: isMobile ? 13 : 15,
                      fill: KOREAN_COLORS.TEXT_PRIMARY,
                      fontFamily: "Noto Sans KR, sans-serif",
                      lineHeight: 24,
                      wordWrap: true,
                      wordWrapWidth: width - padding * 6,
                    }}
                    layout={{
                      width: width - padding * 6,
                    }}
                  />
                </layoutContainer>
              )}

              {/* Trigram Grid */}
              {section.trigrams && (
                <layoutContainer
                  layout={{
                    width: width - padding * 6,
                    flexGrow: 0.5,
                    flexDirection: "row" as const,
                    flexWrap: "wrap" as const,
                    justifyContent: "center" as const,
                    gap: 10,
                    padding: 10,
                  }}
                >
                  {section.trigrams.map((trigram) => (
                    <TrigramCard key={trigram.symbol} trigram={trigram} />
                  ))}
                </layoutContainer>
              )}
            </layoutContainer>
          );
        })}
      </layoutContainer>

      {/* Footer with Back Button */}
      <layoutContainer layout={footerLayout}>
        <BackButton />
      </layoutContainer>
    </layoutContainer>
  );
};

export default PhilosophySection;
