import "@pixi/layout";
import { extend } from "@pixi/react";
import { FancyButton, List, MaskedFrame, ProgressBar } from "@pixi/ui";
import * as PIXI from "pixi.js";
import React, { useCallback, useEffect, useRef } from "react";
import { ArchetypeDisplayProps } from "..";
import { KOREAN_COLORS } from "../../../types/constants";

// Extend PIXI components for React
extend({ Container: PIXI.Container });

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
    texture,
    total,
    index,
    onPrev,
    onNext,
    width,
    height,
    x,
    y,
  }) => {
    const isMobile = width < 768;
    const containerRef = useRef<PIXI.Container | null>(null);
    const imageSize = isMobile ? MOBILE_IMAGE_SIZE : IMAGE_SIZE;

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
            isDisabled ? KOREAN_COLORS.UI_BACKGROUND_MEDIUM : archetype.color,
            isDisabled ? 0.4 : 0.8
          ),
          hoverView: createButtonGraphics(
            44,
            44,
            isDisabled ? KOREAN_COLORS.UI_BACKGROUND_MEDIUM : archetype.color,
            isDisabled ? 0.4 : 1
          ),
          pressedView: createButtonGraphics(
            38,
            38,
            isDisabled ? KOREAN_COLORS.UI_BACKGROUND_MEDIUM : archetype.color,
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
      [archetype.color, onPrev, onNext, index, total]
    );

    // Create portrait with MaskedFrame
    const createPortrait = useCallback(() => {
      if (!texture) {
        // Create placeholder with Korean text
        const placeholder = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.roundRect(0, 0, imageSize, imageSize, 8);
        bg.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM });

        const text = new PIXI.Text({
          text: archetype.korean,
          style: {
            fontFamily: "Noto Sans KR, sans-serif",
            fontSize: imageSize / 4,
            fill: archetype.color,
            fontWeight: "bold",
          },
        });
        text.anchor.set(0.5);
        text.position.set(imageSize / 2, imageSize / 2);

        placeholder.addChild(bg, text);
        return placeholder;
      }

      const sprite = new PIXI.Sprite(texture);
      sprite.width = imageSize;
      sprite.height = imageSize;

      const maskedFrame = new MaskedFrame({
        target: sprite,
        mask: createRoundedRectMask(imageSize, 8),
        borderWidth: 3,
        borderColor: archetype.color,
      });

      // Add subtle glow effect using ColorMatrixFilter instead
      const colorMatrix = new PIXI.ColorMatrixFilter();
      colorMatrix.brightness(1.1, false);

      // Apply a subtle tint using the color matrix
      colorMatrix.tint(archetype.color, true);

      maskedFrame.filters = [colorMatrix];

      return maskedFrame;
    }, [texture, archetype, imageSize]);

    // Create selection progress bar with enhanced styling
    const createSelectionBar = useCallback(() => {
      const progressBar = new ProgressBar({
        bg: createProgressBg(200, 8),
        fill: createProgressFill(archetype.color),
        fillPaddings: { top: 2, right: 2, bottom: 2, left: 2 },
        progress: ((index + 1) / total) * 100,
      });

      // Set size using layout properties
      progressBar.layout = {
        width: isMobile ? 150 : 200,
        height: 8,
      };

      return progressBar;
    }, [index, total, archetype.color, isMobile]);

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
        text: `${archetype.korean} - ${archetype.english}`,
        style: {
          fontFamily: "Noto Sans KR, sans-serif",
          fontSize: isMobile ? 18 : 24,
          fill: archetype.color,
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
        text: archetype.romanization,
        style: {
          fontFamily: "Noto Sans KR, sans-serif",
          fontSize: isMobile ? 12 : 14,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
          align: "center",
        },
      });
      romanText.anchor.set(0.5, 0);
      romanText.y = titleText.height + 4;

      // Description text
      const descText = new PIXI.Text({
        text: archetype.description,
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
      descText.anchor.set(0.5, 0);
      descText.y = romanText.y + romanText.height + 12;

      // Stats container with enhanced visual design
      const statsContainer = new PIXI.Container();
      statsContainer.y = descText.y + descText.height + 16;

      const statNames = [
        { key: "strength", label: "Strength", icon: "💪" },
        { key: "precision", label: "Precision", icon: "🎯" },
        { key: "defense", label: "Defense", icon: "🛡️" },
        { key: "agility", label: "Agility", icon: "⚡" },
      ] as const;

      statNames.forEach((stat, idx) => {
        const statValue = archetype.stats[stat.key];

        const statBar = new ProgressBar({
          bg: createProgressBg(150, 6),
          fill: createProgressFill(archetype.color, (150 * statValue) / 100),
          fillPaddings: { top: 1, right: 1, bottom: 1, left: 1 },
          progress: statValue,
        });

        // Set size using layout
        statBar.layout = {
          width: 150,
          height: 6,
        };

        const statLabel = new PIXI.Text({
          text: `${stat.icon} ${stat.label}`,
          style: {
            fontSize: 11,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Noto Sans KR, sans-serif",
          },
        });

        const statValueText = new PIXI.Text({
          text: `${statValue}%`,
          style: {
            fontSize: 10,
            fill: archetype.color,
            fontWeight: "bold",
          },
        });

        statBar.y = idx * 20;
        statLabel.y = idx * 20 - 2;
        statLabel.x = -60;
        statValueText.y = idx * 20 - 2;
        statValueText.x = 100;

        statsContainer.addChild(statLabel, statBar, statValueText);
      });

      container.addChild(titleText, romanText, descText, statsContainer);

      // Center stats container
      statsContainer.x = -statsContainer.width / 2;

      return container;
    }, [archetype, isMobile]);

    // Main content list with enhanced layout
    const createContentList = useCallback(() => {
      const portrait = createPortrait();
      const info = createInfoContainer();
      const selectionBar = createSelectionBar();

      const items: PIXI.Container[] = [];

      if (!isMobile) {
        // Desktop layout: horizontal with selection bar at bottom
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

        const wrapper = new PIXI.Container();
        wrapper.layout = {
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        };

        wrapper.addChild(mainContent, selectionBar);
        items.push(wrapper);
      } else {
        // Mobile layout: vertical with nav at bottom
        const navContainer = new PIXI.Container();
        navContainer.layout = {
          flexDirection: "row",
          justifyContent: "center",
          gap: 20,
        };

        const prevBtn = createNavButton("prev");
        const nextBtn = createNavButton("next");
        navContainer.addChild(prevBtn, nextBtn);

        items.push(portrait, info, selectionBar, navContainer);
      }

      return new List({
        type: isMobile ? "vertical" : "horizontal",
        elementsMargin: isMobile ? 16 : 0,
        vertPadding: 20,
        horPadding: 20,
        children: items,
      });
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

      // Create background panel
      const bgPanel = new PIXI.Graphics();
      bgPanel.roundRect(0, 0, width * 0.9, height * 0.8, 12);
      bgPanel.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });

      // Create and add the main content
      const contentList = createContentList();

      containerRef.current.addChild(bgPanel, contentList);

      // Center everything
      bgPanel.x = width * 0.05;
      bgPanel.y = height * 0.1;
      contentList.x = width / 2 - contentList.width / 2;
      contentList.y = height / 2 - contentList.height / 2;
    }, [createContentList, width, height]);

    return <pixiContainer ref={containerRef} x={x} y={y} />;
  }
);

ArchetypeDisplay.displayName = "ArchetypeDisplay";

export default ArchetypeDisplay;
