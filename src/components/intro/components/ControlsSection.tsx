import "@pixi/layout";
import { extend } from "@pixi/react";
import { FancyButton } from "@pixi/ui";
import { Container, Graphics, Text } from "pixi.js";
import React, { useCallback, useEffect, useRef } from "react";
import { KOREAN_COLORS } from "../../../types/constants";

extend({ Container, FancyButton, Graphics, Text });

// Combat controls organized by category
const CONTROL_CATEGORIES = {
  stances: {
    title: { korean: "팔괘 자세", english: "Trigram Stances" },
    icon: "☰",
    controls: [
      { key: "1", action: "건 (Heaven) - Direct Force", symbol: "☰" },
      { key: "2", action: "태 (Lake) - Fluid Adaptation", symbol: "☱" },
      { key: "3", action: "리 (Fire) - Precise Strike", symbol: "☲" },
      { key: "4", action: "진 (Thunder) - Explosive Power", symbol: "☳" },
      { key: "5", action: "손 (Wind) - Continuous Pressure", symbol: "☴" },
      { key: "6", action: "감 (Water) - Flow & Counter", symbol: "☵" },
      { key: "7", action: "간 (Mountain) - Solid Defense", symbol: "☶" },
      { key: "8", action: "곤 (Earth) - Ground & Control", symbol: "☷" },
    ],
  },
  combat: {
    title: { korean: "전투 조작", english: "Combat Controls" },
    icon: "⚔",
    controls: [
      { key: "SPACE", action: "Execute Technique", symbol: "▶" },
      { key: "SHIFT", action: "Guard / Block", symbol: "🛡" },
      { key: "CTRL", action: "Vital Point Mode", symbol: "◎" },
      { key: "TAB", action: "Switch Archetype", symbol: "↹" },
    ],
  },
  movement: {
    title: { korean: "이동", english: "Movement" },
    icon: "➜",
    controls: [
      { key: "WASD / ↑↓←→", action: "Move / Position", symbol: "✦" },
      { key: "Double Tap", action: "Dash / Dodge", symbol: "»" },
    ],
  },
};

export interface ControlsSectionProps {
  readonly onBack: () => void;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
}

export const ControlsSection: React.FC<ControlsSectionProps> = ({
  onBack,
  x = 0,
  y = 0,
  width = 800,
  height = 600,
}) => {
  const containerRef = useRef<PIXI.Container | null>(null);
  const backButtonRef = useRef<FancyButton | null>(null);
  const isMobile = width < 768;
  const padding = isMobile ? 20 : 40;
  const contentWidth = width - padding * 2;

  // Create back button using @pixi/ui FancyButton
  useEffect(() => {
    if (!containerRef.current || backButtonRef.current) return;

    const backButton = new FancyButton({
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
      text: new Text({
        text: "돌아가기\nBack",
        style: {
          fontSize: 14,
          fill: KOREAN_COLORS.TEXT_PRIMARY,
          fontFamily: "Noto Sans KR, sans-serif",
          align: "center",
          lineHeight: 16,
        },
      }),
      padding: 10,
      animations: {
        hover: {
          props: { scale: { x: 1.05, y: 1.05 } },
          duration: 150,
        },
        pressed: {
          props: { scale: { x: 0.95, y: 0.95 } },
          duration: 100,
        },
      },
    });

    // Add event handler
    backButton.onPress.connect(onBack);

    // Position at bottom right
    backButton.x = width - padding - 140;
    backButton.y = height - padding - 40;

    containerRef.current.addChild(backButton);
    backButtonRef.current = backButton;

    return () => {
      if (backButtonRef.current) {
        backButtonRef.current.destroy();
        backButtonRef.current = null;
      }
    };
  }, [onBack, width, height, padding]);

  const KeyBadge: React.FC<{ keyText: string; symbol?: string }> = useCallback(
    ({ keyText, symbol }) => (
      <pixiContainer>
        <pixiGraphics
          draw={useCallback(
            (g: Graphics) => {
              const badgeWidth = keyText.length * 8 + 20;
              g.clear();
              g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.9 });
              g.roundRect(0, 0, badgeWidth, 28, 6);
              g.fill();
            },
            [keyText]
          )}
        >
          <pixiText
            text={keyText}
            style={{
              fontSize: 14,
              fill: KOREAN_COLORS.UI_BACKGROUND_DARK,
              fontFamily: "monospace",
              fontWeight: "bold",
            }}
            x={(keyText.length * 8 + 20) / 2}
            y={14}
            anchor={0.5}
          />
        </pixiGraphics>
        {symbol && (
          <pixiText
            text={symbol}
            style={{
              fontSize: 18,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
            }}
            x={keyText.length * 8 + 20 + 12}
            y={14}
            anchor={[0, 0.5]}
          />
        )}
      </pixiContainer>
    ),
    []
  );

  return (
    <pixiContainer
      ref={containerRef}
      x={x}
      y={y}
      data-testid="controls-section"
    >
      {/* Background */}
      <pixiGraphics
        draw={useCallback(
          (g: Graphics) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.95 });
            g.roundRect(0, 0, width, height, 16);
            g.fill();

            // Border gradient effect
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.4,
            });
            g.roundRect(0, 0, width, height, 16);
            g.stroke();
          },
          [width, height]
        )}
      />

      {/* Header */}
      <pixiContainer>
        <pixiText
          text="조작법"
          style={{
            fontSize: isMobile ? 28 : 36,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: "bold",
            dropShadow: {
              color: 0x000000,
              blur: 4,
              distance: 2,
              angle: Math.PI / 4,
            },
          }}
          anchor={0.5}
          x={width / 2}
          y={40}
        />
        <pixiText
          text="Controls"
          style={{
            fontSize: isMobile ? 16 : 20,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Arial, sans-serif",
          }}
          anchor={0.5}
          x={width / 2}
          y={isMobile ? 70 : 80}
        />
      </pixiContainer>

      {/* Controls grid */}
      <pixiContainer x={padding} y={100}>
        {Object.entries(CONTROL_CATEGORIES).map(
          ([categoryKey, category], catIndex) => (
            <React.Fragment key={categoryKey}>
              <pixiContainer
                x={
                  isMobile
                    ? 0
                    : catIndex % 2 === 0
                    ? 0
                    : (contentWidth - 32) / 2 + 32
                }
                y={isMobile ? catIndex * 220 : Math.floor(catIndex / 2) * 220}
              >
                {/* Category background */}
                <pixiGraphics
                  draw={useCallback(
                    (g: Graphics) => {
                      g.clear();
                      g.roundRect(
                        0,
                        0,
                        isMobile ? contentWidth : (contentWidth - 32) / 2,
                        180,
                        8
                      );
                      g.fill({
                        color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                        alpha: 0.9,
                      });
                    },
                    [isMobile, contentWidth]
                  )}
                />

                {/* Category header */}
                <pixiContainer x={16} y={16}>
                  <pixiText
                    text={category.icon}
                    style={{
                      fontSize: 24,
                      fill: KOREAN_COLORS.PRIMARY_CYAN,
                    }}
                  />
                  <pixiContainer x={40}>
                    <pixiText
                      text={category.title.korean}
                      style={{
                        fontSize: isMobile ? 16 : 18,
                        fill: KOREAN_COLORS.PRIMARY_CYAN,
                        fontFamily: "Noto Sans KR, sans-serif",
                        fontWeight: "bold",
                      }}
                    />
                    <pixiText
                      text={category.title.english}
                      style={{
                        fontSize: isMobile ? 12 : 14,
                        fill: KOREAN_COLORS.TEXT_SECONDARY,
                      }}
                      y={20}
                    />
                  </pixiContainer>
                </pixiContainer>

                {/* Control items */}
                <pixiContainer x={16} y={60}>
                  {category.controls.map((control, index) => {
                    const controlKey = `${categoryKey}-${index}`;
                    return (
                      <React.Fragment key={controlKey}>
                        <pixiContainer y={index * 36}>
                          <KeyBadge
                            keyText={control.key}
                            symbol={control.symbol}
                          />
                          <pixiText
                            text={control.action}
                            style={{
                              fontSize: isMobile ? 13 : 15,
                              fill: KOREAN_COLORS.TEXT_PRIMARY,
                              fontFamily: "Noto Sans KR, sans-serif",
                            }}
                            x={120}
                            y={14}
                            anchor={[0, 0.5]}
                          />
                        </pixiContainer>
                      </React.Fragment>
                    );
                  })}
                </pixiContainer>
              </pixiContainer>
            </React.Fragment>
          )
        )}
      </pixiContainer>
    </pixiContainer>
  );
};

export default ControlsSection;
