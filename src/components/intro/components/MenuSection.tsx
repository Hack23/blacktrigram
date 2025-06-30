import "@pixi/layout";
import { LayoutContainer } from "@pixi/layout/components";
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

// Extend layout and base Pixi components for @pixi/react
extend({
  Container,
  LayoutContainer,
  Graphics,
  Text,
  FancyButton,
});

interface MenuButtonProps {
  readonly item: { mode: GameMode; korean: string; english: string };
  readonly isSelected: boolean;
  readonly onSelect: (mode: GameMode) => void;
  readonly buttonWidth: number;
  readonly buttonHeight: number;
  readonly isMobile: boolean;
  readonly setButtonRef: (el: FancyButton | null) => void;
}

/**
 * A memoized, reusable menu button component with Korean cyberpunk styling.
 */
const MenuButton: React.FC<MenuButtonProps> = React.memo(
  ({
    item,
    isSelected,
    onSelect,
    buttonWidth,
    buttonHeight,
    isMobile,
    setButtonRef,
  }) => {
    const createButtonGraphics = useCallback(
      (color: number, alpha: number = 1): Graphics => {
        const graphics = new Graphics();
        graphics.roundRect(0, 0, buttonWidth, buttonHeight, 8);
        graphics.fill({ color, alpha });
        graphics.stroke({
          width: 2,
          color: KOREAN_COLORS.ACCENT_GOLD,
          alpha: alpha * 0.8,
        });
        return graphics;
      },
      [buttonWidth, buttonHeight]
    );

    const defaultView = useMemo(
      () =>
        createButtonGraphics(
          isSelected
            ? KOREAN_COLORS.ACCENT_GOLD
            : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
          isSelected ? 0.9 : 0.8
        ),
      [isSelected, createButtonGraphics]
    );

    const hoverView = useMemo(
      () =>
        createButtonGraphics(
          isSelected
            ? KOREAN_COLORS.ACCENT_GOLD
            : KOREAN_COLORS.UI_BACKGROUND_LIGHT,
          1
        ),
      [isSelected, createButtonGraphics]
    );

    const pressedView = useMemo(
      () =>
        createButtonGraphics(
          isSelected
            ? KOREAN_COLORS.ACCENT_YELLOW
            : KOREAN_COLORS.UI_BACKGROUND_DARK,
          1
        ),
      [isSelected, createButtonGraphics]
    );

    const buttonText = useMemo(
      () =>
        new Text({
          text: `${item.korean} | ${item.english}`,
          style: {
            fontSize: isMobile ? 16 : 18,
            fill: isSelected
              ? KOREAN_COLORS.UI_BACKGROUND_DARK
              : KOREAN_COLORS.TEXT_PRIMARY,
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: isSelected ? "bold" : "normal",
            align: "center",
          },
        }),
      [item.korean, item.english, isSelected, isMobile]
    );

    const buttonRef = useRef<FancyButton | null>(null);
    const [marginLeft, setMarginLeft] = useState(isSelected ? 20 : 0);
    const targetMargin = isSelected ? 20 : 0;

    useTick((ticker: Ticker) => {
      const difference = targetMargin - marginLeft;
      // Stop updating if we are close enough to the target
      if (Math.abs(difference) < 0.5) {
        if (marginLeft !== targetMargin) {
          setMarginLeft(targetMargin);
        }
        return;
      }
      // Animate with a simple easing function
      setMarginLeft(marginLeft + difference * 0.2 * ticker.deltaTime);
    });

    useEffect(() => {
      if (buttonRef.current) {
        const button = buttonRef.current;
        button.onPress.disconnectAll();
        button.onPress.connect(() => onSelect(item.mode));
        setButtonRef(button); // Pass ref to parent

        return () => {
          if (button && !button.destroyed) {
            button.onPress.disconnectAll();
          }
          setButtonRef(null); // Clean up ref in parent
        };
      }
    }, [item.mode, onSelect, setButtonRef]);

    return (
      <layoutContainer
        layout={{
          flexDirection: "row" as const,
          alignItems: "center" as const,
          marginLeft: marginLeft,
        }}
      >
        {/* Selection indicator */}
        {isSelected && (
          <pixiText
            text="▶"
            style={{
              fontSize: 20,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
            }}
            layout={{
              marginRight: 15,
            }}
          />
        )}

        <pixiFancyButton
          ref={buttonRef}
          defaultView={defaultView}
          hoverView={hoverView}
          pressedView={pressedView}
          text={buttonText}
          data-testid={`menu-button-${item.mode}`}
        />
      </layoutContainer>
    );
  }
);

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
  const buttonsRef = useRef<(FancyButton | null)[]>([]);
  const isMobile = width < 768;
  const buttonWidth = Math.min(width - 80, 320);
  const buttonHeight = isMobile ? 45 : 55;

  const menuLayout = useMemo(
    () => ({
      width,
      height,
      flexDirection: "column" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: isMobile ? 12 : 16,
      padding: isMobile ? 10 : 20,
      backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
      backgroundAlpha: 0.9,
      borderRadius: 16,
    }),
    [width, height, isMobile]
  );

  return (
    <layoutContainer layout={menuLayout} data-testid="menu-section">
      {/* Title */}
      <pixiText
        text="격투가의 길"
        style={{
          fontSize: isMobile ? 20 : 24,
          fill: KOREAN_COLORS.ACCENT_GOLD,
          fontFamily: "Noto Sans KR, sans-serif",
          fontWeight: "bold",
          dropShadow: {
            alpha: 0.5,
            angle: 45,
            blur: 4,
            color: 0x000000,
            distance: 2,
          },
        }}
        anchor={0.5}
        layout={{
          alignSelf: "center",
          marginBottom: 10,
        }}
      />

      {/* Subtitle */}
      <pixiText
        text="한국 무술의 정수를 담은 격투 시뮬레이터"
        style={{
          fontSize: isMobile ? 12 : 14,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
          fontFamily: "Noto Sans KR, sans-serif",
          align: "center",
          wordWrap: true,
          wordWrapWidth: width - 80,
        }}
        anchor={0.5}
        layout={{
          alignSelf: "center",
          marginBottom: 20,
        }}
      />

      {/* Menu buttons */}
      <layoutContainer
        layout={{
          flexDirection: "column" as const,
          alignItems: "flex-start" as const,
          gap: isMobile ? 10 : 12,
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
            setButtonRef={(el) => (buttonsRef.current[index] = el)}
          />
        ))}
      </layoutContainer>

      {/* Footer hint */}
      <pixiText
        text="↑↓ 키로 선택, Enter로 확인"
        style={{
          fontSize: isMobile ? 10 : 12,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
          fontStyle: "italic",
        }}
        anchor={0.5}
        layout={{
          alignSelf: "center",
          marginTop: 15,
        }}
      />
    </layoutContainer>
  );
};

export default MenuSection;
