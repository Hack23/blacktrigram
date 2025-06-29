import "@pixi/layout";
import {
  LayoutContainer,
  LayoutGraphics,
  LayoutText,
} from "@pixi/layout/components";
import "@pixi/layout/react";
import { extend } from "@pixi/react";
import { FancyButton } from "@pixi/ui";
import { Container, Graphics, Text } from "pixi.js";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import { createGraphicsContext } from "../../../utils/pixiExtensions";

extend({
  Container,
  LayoutContainer,
  FancyButton,
  Graphics,
  LayoutGraphics,
  Text,
  LayoutText,
});

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
  readonly width?: number;
  readonly height?: number;
}

export const ControlsSection: React.FC<ControlsSectionProps> = ({
  onBack,
  width = 800,
  height = 600,
}) => {
  const backButtonRef = useRef<FancyButton | null>(null);
  const isMobile = width < 768;
  const padding = isMobile ? 20 : 40;

  // Layout configuration objects
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

  // Content grid layout
  const contentLayout = useMemo(
    () => ({
      ...defaults,
      width: width - padding * 2,
      flexGrow: 1,
      flexDirection: isMobile ? ("column" as const) : ("row" as const),
      flexWrap: "wrap" as const,
      justifyContent: "space-around" as const,
      alignItems: "flex-start" as const,
      gap: 20,
      padding: 20,
    }),
    [defaults, width, padding, isMobile]
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

  // Create button views for FancyButton
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

  // Key badge component using layout containers
  const KeyBadge: React.FC<{ keyText: string; symbol?: string }> = useCallback(
    ({ keyText, symbol }) => {
      const badgeWidth = Math.max(keyText.length * 8 + 20, 60);

      const badgeLayout = {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 8,
      };

      const badgeContext = useMemo(() => {
        return createGraphicsContext((g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.9 });
          g.roundRect(0, 0, badgeWidth, 28, 6);
          g.fill();
        });
      }, [badgeWidth]);

      return (
        <layoutContainer layout={badgeLayout}>
          <layoutContainer
            layout={{
              width: badgeWidth,
              height: 28,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <layoutGraphics context={badgeContext} />
            <layoutText
              text={keyText}
              style={{
                fontSize: 14,
                fill: KOREAN_COLORS.UI_BACKGROUND_DARK,
                fontFamily: "monospace",
                fontWeight: "bold",
              }}
              anchor={0.5}
            />
          </layoutContainer>
          {symbol && (
            <layoutText
              text={symbol}
              style={{
                fontSize: 18,
                fill: KOREAN_COLORS.PRIMARY_CYAN,
              }}
              layout={{
                marginLeft: 4,
              }}
            />
          )}
        </layoutContainer>
      );
    },
    []
  );

  // Category card component using layout containers
  const CategoryCard: React.FC<{
    category: typeof CONTROL_CATEGORIES.stances;
    categoryKey: string;
  }> = useCallback(
    ({ category, categoryKey }) => {
      const cardWidth = isMobile
        ? width - padding * 4
        : (width - padding * 4) / 3 - 20;

      const cardLayout = {
        ...defaults,
        width: cardWidth,
        minHeight: 200,
        flexDirection: "column" as const,
        padding: 20,
        margin: 10,
        backgroundColor: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
        backgroundAlpha: 0.9,
        borderRadius: 12,
      };

      const headerLayout = {
        width: cardWidth - 40,
        flexBasis: 60,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        marginBottom: 15,
        gap: 12,
      };

      const controlsLayout = {
        width: cardWidth - 40,
        flexGrow: 1,
        flexDirection: "column" as const,
        gap: 12,
      };

      const controlItemLayout = {
        width: cardWidth - 40,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 16,
      };

      return (
        <layoutContainer
          layout={cardLayout}
          data-testid={`category-${categoryKey}`}
        >
          {/* Category header */}
          <layoutContainer layout={headerLayout}>
            <layoutText
              text={category.icon}
              style={{
                fontSize: 24,
                fill: KOREAN_COLORS.PRIMARY_CYAN,
              }}
            />
            <layoutContainer
              layout={{
                flexDirection: "column" as const,
                flexGrow: 1,
              }}
            >
              <layoutText
                text={category.title.korean}
                style={{
                  fontSize: isMobile ? 16 : 18,
                  fill: KOREAN_COLORS.PRIMARY_CYAN,
                  fontFamily: "Noto Sans KR, sans-serif",
                  fontWeight: "bold",
                }}
                layout={{
                  marginBottom: 3,
                }}
              />
              <layoutText
                text={category.title.english}
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                }}
              />
            </layoutContainer>
          </layoutContainer>

          {/* Control items */}
          <layoutContainer layout={controlsLayout}>
            {category.controls.map((control, index) => (
              <layoutContainer
                key={`${categoryKey}-${index}`}
                layout={controlItemLayout}
              >
                <KeyBadge keyText={control.key} symbol={control.symbol} />
                <layoutText
                  text={control.action}
                  style={{
                    fontSize: isMobile ? 13 : 15,
                    fill: KOREAN_COLORS.TEXT_PRIMARY,
                    fontFamily: "Noto Sans KR, sans-serif",
                    wordWrap: true,
                    wordWrapWidth: isMobile ? 150 : 200,
                  }}
                  layout={{
                    flexGrow: 1,
                  }}
                />
              </layoutContainer>
            ))}
          </layoutContainer>
        </layoutContainer>
      );
    },
    [defaults, width, height, padding, isMobile, KeyBadge]
  );

  // Create back button component
  const BackButton: React.FC = useCallback(() => {
    return (
      <pixiFancyButton
        ref={backButtonRef}
        defaultView={buttonViews.defaultView}
        hoverView={buttonViews.hoverView}
        pressedView={buttonViews.pressedView}
        text={buttonViews.buttonText}
        data-testid="controls-back-button"
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
    <layoutContainer layout={rootLayout} data-testid="controls-section">
      {/* Header Section */}
      <layoutContainer layout={headerLayout}>
        <layoutText
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
            },
          }}
          layout={{
            marginBottom: 10,
          }}
        />
        <layoutText
          text="Controls"
          style={{
            fontSize: isMobile ? 16 : 20,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          layout={{
            marginBottom: 0,
          }}
        />
      </layoutContainer>

      {/* Content Area with Control Categories */}
      <layoutContainer layout={contentLayout}>
        {Object.entries(CONTROL_CATEGORIES).map(([categoryKey, category]) => (
          <CategoryCard
            key={categoryKey}
            category={category}
            categoryKey={categoryKey}
          />
        ))}
      </layoutContainer>

      {/* Footer with Back Button */}
      <layoutContainer layout={footerLayout}>
        <BackButton />
      </layoutContainer>
    </layoutContainer>
  );
};

export default ControlsSection;
