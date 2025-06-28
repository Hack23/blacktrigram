import { PlayerArchetypeData } from "@/systems";
import { PlayerArchetype } from "@/types";
import "@pixi/layout";
import { extend } from "@pixi/react";
import { FancyButton, MaskedFrame, ProgressBar, ScrollBox } from "@pixi/ui";
import * as PIXI from "pixi.js";
import React, { useCallback, useEffect, useRef } from "react";
import { KOREAN_COLORS } from "../../../types/constants";

// Extend PIXI components for React
extend({ Container: PIXI.Container });

// Define the proper props interface
export interface ArchetypeDisplayProps {
  archetype: PlayerArchetype;
  archetypeData: PlayerArchetypeData;
  texture?: PIXI.Texture | null;
  total: number;
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect?: (archetype: PlayerArchetype) => void;
  isSelected?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

// Helper function to create button graphics
const createButtonGraphics = (
  width: number,
  height: number,
  color: number,
  alpha: number = 1
): PIXI.Graphics => {
  const graphics = new PIXI.Graphics();
  graphics.roundRect(0, 0, width, height, 8);
  graphics.fill({ color, alpha });
  return graphics;
};

// Helper function to create rounded rectangle mask
const createRoundedRectMask = (size: number, radius: number): PIXI.Graphics => {
  const mask = new PIXI.Graphics();
  mask.roundRect(0, 0, size, size, radius);
  mask.fill(0xffffff);
  return mask;
};

// Helper function to create progress bar background
const createProgressBg = (width: number, height: number): PIXI.Graphics => {
  const bg = new PIXI.Graphics();
  bg.roundRect(0, 0, width, height, height / 2);
  bg.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
  return bg;
};

// Helper function to create progress bar fill
const createProgressFill = (
  color: number,
  width: number = 200
): PIXI.Graphics => {
  const fill = new PIXI.Graphics();
  fill.roundRect(0, 0, width, 8, 4);
  fill.fill(color);
  return fill;
};

// Constants
const IMAGE_SIZE = 120;
const MOBILE_IMAGE_SIZE = 80;

export const ArchetypeDisplay: React.FC<ArchetypeDisplayProps> = React.memo(
  ({
    archetype,
    archetypeData,
    texture,
    total,
    index,
    onPrev,
    onNext,
    onSelect,
    isSelected = false,
    width = 800,
    height = 600,
    x = 0,
    y = 0,
  }) => {
    const isMobile = width < 768;
    const containerRef = useRef<PIXI.Container | null>(null);
    const imageSize = isMobile ? MOBILE_IMAGE_SIZE : IMAGE_SIZE;

    // Get the primary color from archetypeData
    const primaryColor = archetypeData.colors.primary;

    // Create fancy navigation buttons with enhanced styling
    const createNavButton = useCallback(
      (direction: "prev" | "next") => {
        const icon = direction === "prev" ? "◀" : "▶";
        const onClick = direction === "prev" ? onPrev : onNext;
        const isDisabled =
          direction === "prev" ? index === 0 : index === total - 1;

        const button = new FancyButton({
          defaultView: createButtonGraphics(
            40,
            40,
            isDisabled ? KOREAN_COLORS.UI_BACKGROUND_MEDIUM : primaryColor,
            isDisabled ? 0.4 : 0.8
          ),
          hoverView: createButtonGraphics(
            44,
            44,
            isDisabled ? KOREAN_COLORS.UI_BACKGROUND_MEDIUM : primaryColor,
            isDisabled ? 0.4 : 1
          ),
          pressedView: createButtonGraphics(
            38,
            38,
            isDisabled ? KOREAN_COLORS.UI_BACKGROUND_MEDIUM : primaryColor,
            isDisabled ? 0.3 : 0.6
          ),
          text: new PIXI.Text({
            text: icon,
            style: {
              fontSize: 20,
              fill: isDisabled
                ? KOREAN_COLORS.TEXT_SECONDARY
                : KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              align: "center",
            },
          }),
          animations: {
            hover: {
              props: { scale: { x: 1.1, y: 1.1 } },
              duration: 150,
            },
            pressed: {
              props: { scale: { x: 0.95, y: 0.95 } },
              duration: 100,
            },
          },
        });

        button.enabled = !isDisabled;
        if (!isDisabled) {
          button.onPress.connect(() => onClick());
        }

        // Add layout for proper sizing
        button.layout = {
          width: 40,
          height: 40,
        };

        return button;
      },
      [primaryColor, onPrev, onNext, index, total]
    );

    // Create portrait with MaskedFrame
    const createPortrait = useCallback(() => {
      const portraitContainer = new PIXI.Container();

      // Add select button functionality
      const selectButton = new FancyButton({
        defaultView:
          texture ||
          createButtonGraphics(
            imageSize,
            imageSize,
            KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
            1
          ),
        hoverView:
          texture ||
          createButtonGraphics(imageSize, imageSize, primaryColor, 0.8),
        pressedView:
          texture ||
          createButtonGraphics(imageSize, imageSize, primaryColor, 0.6),
      });

      if (!texture) {
        // Create placeholder with Korean text
        const text = new PIXI.Text({
          text: archetypeData.name.korean,
          style: {
            fontFamily: "Noto Sans KR, sans-serif",
            fontSize: imageSize / 4,
            fill: primaryColor,
            fontWeight: "bold",
          },
        });
        text.anchor.set(0.5);
        text.position.set(imageSize / 2, imageSize / 2);
        selectButton.addChild(text);
      } else {
        const sprite = new PIXI.Sprite(texture);
        sprite.width = imageSize;
        sprite.height = imageSize;

        const maskedFrame = new MaskedFrame({
          target: sprite,
          mask: createRoundedRectMask(imageSize, 8),
          borderWidth: isSelected ? 5 : 3,
          borderColor: isSelected ? KOREAN_COLORS.ACCENT_GOLD : primaryColor,
        });

        // Add subtle glow effect using ColorMatrixFilter
        const colorMatrix = new PIXI.ColorMatrixFilter();
        colorMatrix.brightness(isSelected ? 1.2 : 1.1, false);
        colorMatrix.tint(primaryColor, true);
        maskedFrame.filters = [colorMatrix];

        selectButton.addChild(maskedFrame);
      }

      // Handle selection
      if (onSelect) {
        selectButton.onPress.connect(() => onSelect(archetype));
      }

      selectButton.layout = {
        width: imageSize,
        height: imageSize,
      };

      portraitContainer.addChild(selectButton);

      // Add selection indicator
      if (isSelected) {
        const selectedIndicator = new PIXI.Text({
          text: "✓ 선택됨",
          style: {
            fontFamily: "Noto Sans KR, sans-serif",
            fontSize: 12,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
          },
        });
        selectedIndicator.anchor.set(0.5);
        selectedIndicator.position.set(imageSize / 2, imageSize + 10);
        portraitContainer.addChild(selectedIndicator);
      }

      return portraitContainer;
    }, [
      texture,
      archetypeData,
      archetype,
      imageSize,
      onSelect,
      isSelected,
      primaryColor,
    ]);

    // Create selection progress bar with enhanced styling
    const createSelectionBar = useCallback(() => {
      const progressBar = new ProgressBar({
        bg: createProgressBg(200, 8),
        fill: createProgressFill(primaryColor),
        fillPaddings: { top: 2, right: 2, bottom: 2, left: 2 },
        progress: ((index + 1) / total) * 100,
      });

      // Set size using layout properties
      progressBar.layout = {
        width: isMobile ? 150 : 200,
        height: 8,
      };

      return progressBar;
    }, [index, total, primaryColor, isMobile]);

    // Create info container with enhanced layout
    const createInfoContainer = useCallback(() => {
      const container = new PIXI.Container();

      // Apply layout for better organization
      container.layout = {
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      };

      // Title text
      const titleText = new PIXI.Text({
        text: `${archetypeData.name.korean} - ${archetypeData.name.english}`,
        style: {
          fontFamily: "Noto Sans KR, sans-serif",
          fontSize: isMobile ? 18 : 24,
          fill: isSelected ? KOREAN_COLORS.ACCENT_GOLD : primaryColor,
          fontWeight: "bold",
          align: "center",
          dropShadow: {
            color: 0x000000,
            alpha: 0.5,
            blur: 4,
            distance: 2,
          },
        },
      });
      titleText.anchor.set(0.5, 0);

      // Romanization text
      const romanText = new PIXI.Text({
        text: archetype.toLowerCase().replace(/_/g, " "),
        style: {
          fontFamily: "Noto Sans KR, sans-serif",
          fontSize: isMobile ? 12 : 14,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
          align: "center",
        },
      });
      romanText.anchor.set(0.5, 0);

      // Description text with scrollbox for long text
      const descriptionContainer = new PIXI.Container();
      const descText = new PIXI.Text({
        text: archetypeData.description.korean,
        style: {
          fontFamily: "Noto Sans KR, sans-serif",
          fontSize: isMobile ? 12 : 14,
          fill: KOREAN_COLORS.TEXT_PRIMARY,
          align: "center",
          wordWrap: true,
          wordWrapWidth: isMobile ? 200 : 300,
          lineHeight: 20,
        },
      });

      // Use ScrollBox if description is long
      if (descText.height > 100) {
        const scrollBox = new ScrollBox({
          width: isMobile ? 220 : 320,
          height: 100,
          items: [descText],
        });
        descriptionContainer.addChild(scrollBox);
      } else {
        descText.anchor.set(0.5, 0);
        descriptionContainer.addChild(descText);
      }

      // Stats container with enhanced visual design
      const statsContainer = new PIXI.Container();
      statsContainer.layout = {
        flexDirection: "column",
        gap: 4,
      };

      const statNames = [
        { key: "attackPower", label: "Strength", icon: "💪" },
        { key: "technique", label: "Precision", icon: "🎯" },
        { key: "defense", label: "Defense", icon: "🛡️" },
        { key: "speed", label: "Agility", icon: "⚡" },
      ] as const;

      statNames.forEach((stat) => {
        const statValue = archetypeData.stats[stat.key];
        const statRow = new PIXI.Container();
        statRow.layout = {
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          width: 250,
        };

        const statLabel = new PIXI.Text({
          text: `${stat.icon} ${stat.label}`,
          style: {
            fontSize: 11,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Noto Sans KR, sans-serif",
          },
        });
        statLabel.layout = { width: 80 };

        const statBar = new ProgressBar({
          bg: createProgressBg(120, 6),
          fill: createProgressFill(primaryColor, (120 * statValue) / 100),
          fillPaddings: { top: 1, right: 1, bottom: 1, left: 1 },
          progress: statValue,
        });
        statBar.layout = {
          width: 120,
          height: 6,
        };

        const statValueText = new PIXI.Text({
          text: `${statValue}%`,
          style: {
            fontSize: 10,
            fill: primaryColor,
            fontWeight: "bold",
          },
        });
        statValueText.layout = { width: 40 };

        statRow.addChild(statLabel, statBar, statValueText);
        statsContainer.addChild(statRow);
      });

      container.addChild(
        titleText,
        romanText,
        descriptionContainer,
        statsContainer
      );
      return container;
    }, [archetypeData, archetype, isMobile, isSelected, primaryColor]);

    // Main content list with enhanced layout
    const createContentList = useCallback(() => {
      const portrait = createPortrait();
      const info = createInfoContainer();
      const selectionBar = createSelectionBar();

      const contentContainer = new PIXI.Container();

      if (!isMobile) {
        // Desktop layout: horizontal with selection bar at bottom
        contentContainer.layout = {
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        };

        const mainContent = new PIXI.Container();
        mainContent.layout = {
          flexDirection: "row",
          alignItems: "center",
          gap: 24,
        };

        mainContent.addChild(
          createNavButton("prev"),
          portrait,
          info,
          createNavButton("next")
        );

        contentContainer.addChild(mainContent, selectionBar);
      } else {
        // Mobile layout: vertical with nav at bottom
        contentContainer.layout = {
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        };

        const navContainer = new PIXI.Container();
        navContainer.layout = {
          flexDirection: "row",
          justifyContent: "center",
          gap: 20,
        };

        navContainer.addChild(createNavButton("prev"), createNavButton("next"));

        contentContainer.addChild(portrait, info, selectionBar, navContainer);
      }

      return contentContainer;
    }, [
      isMobile,
      createNavButton,
      createPortrait,
      createInfoContainer,
      createSelectionBar,
    ]);

    // Build the display
    useEffect(() => {
      if (!containerRef.current) return;

      // Clear existing children
      containerRef.current.removeChildren();

      // Create main container with layout
      const mainContainer = new PIXI.Container();
      mainContainer.layout = {
        width: width * 0.9,
        height: height * 0.8,
        padding: 20,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
      };

      // Create background graphics
      const background = new PIXI.Graphics();
      background.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
      background.roundRect(0, 0, width * 0.9, height * 0.8, 12);
      background.fill();
      mainContainer.addChild(background);

      // Create and add the main content
      const contentList = createContentList();
      mainContainer.addChild(contentList);

      containerRef.current.addChild(mainContainer);

      // Center the main container
      mainContainer.x = width * 0.05;
      mainContainer.y = height * 0.1;
    }, [createContentList, width, height]);

    return <pixiContainer ref={containerRef} x={x} y={y} />;
  }
);

ArchetypeDisplay.displayName = "ArchetypeDisplay";

export default ArchetypeDisplay;
