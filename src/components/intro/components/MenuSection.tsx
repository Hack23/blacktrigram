import { LayoutOptions } from "@pixi/layout";
import { useTick } from "@pixi/react";
import { FancyButton } from "@pixi/ui";
import { Graphics, Ticker } from "pixi.js";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GameMode } from "../../../types/common";
import { KOREAN_COLORS } from "../../../types/constants";
import "../../../utils/pixiExtensions";

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

    // ✅ FIXED: Wrap entire button in layoutContainer with proper structure
    return (
      <layoutContainer
        layout={{
          width: buttonWidth,
          height: buttonHeight,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingLeft: animationOffset,
        }}
      >
        {/* Selection indicator */}
        {isSelected && (
          <layoutText
            text="▶"
            style={{
              fontSize: 18,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
            }}
            layout={{
              width: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        )}

        {/* ✅ FIXED: Wrap pixiFancyButton in layoutContainer not layoutView */}
        <layoutContainer
          layout={{
            width: buttonWidth - (isSelected ? 32 : 8),
            height: buttonHeight,
          }}
        >
          <pixiFancyButton
            ref={buttonRef}
            views={buttonViews}
            text={`${item.korean} | ${item.english}`}
            style={textStyle}
            animations={{
              hover: {
                props: { scale: { x: 1.02, y: 1.02 } },
                duration: 150,
              },
              pressed: {
                props: { scale: { x: 0.98, y: 0.98 } },
                duration: 100,
              },
            }}
            data-testid={`menu-button-${item.mode}`}
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
  const contentWidth = Math.min(width * 0.9, 400);

  // add this import so you can refer to the proper LayoutOptions type
  // annotate with the correct Pixi LayoutOptions (minus the 'target' property)
  const rootLayout = useMemo<Omit<LayoutOptions, "target">>(
    () => ({
      width: contentWidth,
      height: contentWidth, // optional, or you can omit
      padding: isMobile ? 16 : 24,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: isMobile ? 12 : 16,
      backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
      borderRadius: 12,
    }),
    [contentWidth, isMobile]
  );

  return (
    <layoutContainer
      layout={{
        width,
        height, // use the prop you destructured
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <layoutContainer layout={rootLayout}>
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

        <layoutText
          text="한국 무술 시뮬레이터"
          style={{
            fontSize: isMobile ? 11 : 13,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Noto Sans KR, sans-serif",
            align: "center",
            wordWrap: true,
            wordWrapWidth: contentWidth - 20,
          }}
        />

        {/* Menu Buttons Section */}
        <layoutContainer
          layout={{
            width: "100%",
            flexDirection: "column",
            gap: isMobile ? 8 : 12,
          }}
        >
          {menuItems.map((item, i) => (
            <MenuButton
              key={item.mode}
              item={item}
              isSelected={i === selectedIndex}
              onSelect={onModeSelect}
              buttonWidth={contentWidth}
              buttonHeight={isMobile ? 40 : 50}
              isMobile={isMobile}
            />
          ))}
        </layoutContainer>

        <layoutText
          text="↑↓키 선택 · Enter 확인"
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
