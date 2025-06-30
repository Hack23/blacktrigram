import "@pixi/layout";
import { LayoutContainer, LayoutText } from "@pixi/layout/components";
import "@pixi/layout/react";
import { extend, useTick } from "@pixi/react";
import { FancyButton } from "@pixi/ui";
import { Container, Graphics, Text, Ticker } from "pixi.js";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GameMode } from "../../../types/common";
import { KOREAN_COLORS } from "../../../types/constants";

// ✅ FIXED: Proper component extension
extend({
  Container,
  LayoutContainer,
  Graphics,
  Text,
  LayoutText,
  FancyButton,
});

interface MenuButtonProps {
  readonly item: { mode: GameMode; korean: string; english: string };
  readonly isSelected: boolean;
  readonly onSelect: (mode: GameMode) => void;
  readonly buttonWidth: number;
  readonly buttonHeight: number;
  readonly isMobile: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = React.memo(
  ({ item, isSelected, onSelect, buttonWidth, buttonHeight, isMobile }) => {
    const buttonRef = useRef<FancyButton | null>(null);

    // ✅ FIXED: Bounded animation with proper validation
    const [animationOffset, setAnimationOffset] = useState(0);
    const targetOffset = isSelected ? 20 : 0;

    // Smooth animation with bounds checking
    useTick((ticker: Ticker) => {
      const difference = targetOffset - animationOffset;
      if (Math.abs(difference) < 0.1) {
        if (animationOffset !== targetOffset) {
          setAnimationOffset(targetOffset);
        }
        return;
      }

      // ✅ FIXED: Bounded animation with clamping
      const newOffset = animationOffset + difference * 0.15 * ticker.deltaTime;
      const clampedOffset = Math.max(0, Math.min(30, newOffset)); // Clamp between 0-30
      setAnimationOffset(clampedOffset);
    });

    // Create button graphics using PIXI v8 API
    const createButtonGraphics = useCallback(
      (color: number, alpha: number = 1): Graphics => {
        const graphics = new Graphics();
        graphics.roundRect(0, 0, buttonWidth, buttonHeight, 8);
        graphics.fill({ color, alpha });

        // Add stroke for selected state
        if (isSelected) {
          graphics.roundRect(0, 0, buttonWidth, buttonHeight, 8);
          graphics.stroke({
            width: 2,
            color: KOREAN_COLORS.ACCENT_GOLD,
            alpha: 0.8,
          });
        }
        return graphics;
      },
      [buttonWidth, buttonHeight, isSelected]
    );

    // Button view states
    const buttonViews = useMemo(
      () => ({
        defaultView: createButtonGraphics(
          isSelected
            ? KOREAN_COLORS.ACCENT_GOLD
            : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
          isSelected ? 0.9 : 0.8
        ),
        hoverView: createButtonGraphics(
          isSelected
            ? KOREAN_COLORS.ACCENT_GOLD
            : KOREAN_COLORS.UI_BACKGROUND_LIGHT,
          1
        ),
        pressedView: createButtonGraphics(
          isSelected
            ? KOREAN_COLORS.ACCENT_YELLOW
            : KOREAN_COLORS.UI_BACKGROUND_DARK,
          1
        ),
      }),
      [createButtonGraphics, isSelected]
    );

    // Button text style
    const textStyle = useMemo(
      () => ({
        fontSize: isMobile ? 14 : 16,
        fill: isSelected
          ? KOREAN_COLORS.UI_BACKGROUND_DARK
          : KOREAN_COLORS.TEXT_PRIMARY,
        fontFamily: "Noto Sans KR, sans-serif",
        fontWeight: isSelected ? "bold" : "normal",
        align: "center" as const,
      }),
      [isSelected, isMobile]
    );

    const buttonText = `${item.korean} | ${item.english}`;

    // Connect button handler
    useEffect(() => {
      if (buttonRef.current) {
        const button = buttonRef.current;
        button.onPress.disconnectAll();
        button.onPress.connect(() => onSelect(item.mode));

        return () => {
          if (button && !button.destroyed) {
            button.onPress.disconnectAll();
          }
        };
      }
    }, [item.mode, onSelect]);

    // ✅ FIXED: Proper layout hierarchy with constrained dimensions
    return (
      <layoutContainer
        layout={{
          width: buttonWidth + 60, // Fixed container width
          height: buttonHeight + 8, // Fixed container height with padding
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: Math.round(animationOffset), // Use padding instead of margin
        }}
        data-testid={`menu-button-container-${item.mode}`}
      >
        {/* Selection indicator */}
        <layoutContainer
          layout={{
            width: 20,
            height: buttonHeight,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isSelected && (
            <layoutText
              text="▶"
              style={{
                fontSize: 18,
                fill: KOREAN_COLORS.ACCENT_GOLD,
                fontWeight: "bold",
              }}
            />
          )}
        </layoutContainer>

        {/* Button */}
        <layoutContainer
          layout={{
            width: buttonWidth,
            height: buttonHeight,
          }}
        >
          <pixiFancyButton
            ref={buttonRef}
            defaultView={buttonViews.defaultView}
            hoverView={buttonViews.hoverView}
            pressedView={buttonViews.pressedView}
            text={buttonText}
            textStyle={textStyle}
            data-testid={`menu-button-${item.mode}`}
            animations={{
              hover: { props: { scale: { x: 1.02, y: 1.02 } }, duration: 150 },
              pressed: {
                props: { scale: { x: 0.98, y: 0.98 } },
                duration: 100,
              },
            }}
          />
        </layoutContainer>
      </layoutContainer>
    );
  }
);

MenuButton.displayName = "MenuButton";

export interface MenuSectionProps {
  readonly menuItems: ReadonlyArray<{
    mode: GameMode;
    korean: string;
    english: string;
    description?: string;
  }>;
  readonly selectedIndex: number;
  readonly onModeSelect: (mode: GameMode) => void;
  readonly width: number;
  readonly height: number;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  selectedIndex,
  onModeSelect,
  width,
  height,
}) => {
  const isMobile = width < 768;
  const buttonWidth = Math.min(width - 100, 300);
  const buttonHeight = isMobile ? 40 : 50;

  // ✅ FIXED: Validate and constrain dimensions
  const safeWidth = Math.max(200, Math.min(800, width));
  const safeHeight = Math.max(200, Math.min(800, height));
  const contentWidth = safeWidth - (isMobile ? 40 : 80);

  // Calculate total content height
  const titleHeight = 60;
  const subtitleHeight = 40;
  const buttonAreaHeight = (buttonHeight + 12) * menuItems.length + 20;
  const footerHeight = 30;
  const totalContentHeight =
    titleHeight + subtitleHeight + buttonAreaHeight + footerHeight;

  // ✅ FIXED: Proper root layout with explicit dimensions
  const rootLayout = useMemo(
    () => ({
      width: safeWidth,
      height: Math.min(safeHeight, totalContentHeight + 40), // Ensure content fits
      flexDirection: "column" as const,
      alignItems: "center" as const,
      justifyContent: "flex-start" as const,
      backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
      backgroundAlpha: 0.95,
      borderRadius: 16,
      padding: isMobile ? 20 : 30,
      gap: isMobile ? 8 : 12,
    }),
    [safeWidth, safeHeight, totalContentHeight, isMobile]
  );

  return (
    <layoutContainer layout={rootLayout} data-testid="menu-section">
      {/* Title Section */}
      <layoutContainer
        layout={{
          width: contentWidth,
          height: titleHeight,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <layoutText
          text="격투가의 길"
          style={{
            fontSize: isMobile ? 20 : 24,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: "bold",
            dropShadow: {
              color: 0x000000,
              blur: 4,
              distance: 2,
            },
          }}
        />
      </layoutContainer>

      {/* Subtitle Section */}
      <layoutContainer
        layout={{
          width: contentWidth,
          height: subtitleHeight,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <layoutText
          text="한국 무술의 정수를 담은 격투 시뮬레이터"
          style={{
            fontSize: isMobile ? 11 : 13,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Noto Sans KR, sans-serif",
            align: "center",
            wordWrap: true,
            wordWrapWidth: contentWidth - 20,
          }}
        />
      </layoutContainer>

      {/* Menu Buttons Section */}
      <layoutContainer
        layout={{
          width: contentWidth,
          height: buttonAreaHeight,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: isMobile ? 8 : 12,
          padding: 10,
        }}
      >
        {menuItems.map((item, index) => (
          <MenuButton
            key={item.mode}
            item={item}
            isSelected={index === selectedIndex}
            onSelect={onModeSelect}
            buttonWidth={buttonWidth}
            buttonHeight={buttonHeight}
            isMobile={isMobile}
          />
        ))}
      </layoutContainer>

      {/* Footer Section */}
      <layoutContainer
        layout={{
          width: contentWidth,
          height: footerHeight,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <layoutText
          text="↑↓ 키로 선택, Enter로 확인"
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontStyle: "italic",
          }}
        />
      </layoutContainer>
    </layoutContainer>
  );
};

export default MenuSection;
