// Underground dojang background for Korean martial arts

import React, { useCallback, useMemo } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { KOREAN_COLORS } from "../../../types/constants";
import * as PIXI from "pixi.js";

extend({ Container, Graphics, Text });

export interface DojangBackgroundProps {
  readonly width: number;
  readonly height: number;
  readonly lighting?: "normal" | "cyberpunk" | "traditional";
  readonly animate?: boolean;
  readonly showPattern?: boolean;
}

export const DojangBackground: React.FC<DojangBackgroundProps> = ({
  width,
  height,
  lighting = "normal",
  animate = false,
  showPattern = true, // Now actually used
}) => {
  // Animation time for effects - now actually used
  const animationTime = useMemo(() => {
    return animate ? Date.now() * 0.001 : 0;
  }, [animate]);

  // Main background with Korean traditional colors
  const drawMainBackground = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Create gradient based on lighting mode
      switch (lighting) {
        case "cyberpunk":
          g.fill({ color: 0x0a0a0f });
          g.rect(0, 0, width, height);
          g.fill();
          break;

        case "traditional":
          g.fill({ color: 0x2d1810 });
          g.rect(0, 0, width, height);
          g.fill();
          break;

        default: // normal
          g.fill({ color: 0x1a1a2e });
          g.rect(0, 0, width, height);
          g.fill();
      }
    },
    [width, height, lighting]
  );

  // Traditional Korean patterns - Fix: Use showPattern variable
  const drawKoreanPatterns = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      if (!showPattern) return; // Now properly used

      // Taegeuk (태극) pattern in corners
      const taegeukSize = 40;
      const corners = [
        [50, 50],
        [width - 50, 50],
        [50, height - 50],
        [width - 50, height - 50],
      ];

      corners.forEach(([x, y]) => {
        // Outer circle
        g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.4 });
        g.circle(x, y, taegeukSize);
        g.stroke();

        // Yin-yang pattern
        g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.3 });
        g.arc(x, y, taegeukSize - 5, 0, Math.PI);
        g.arc(
          x,
          y - (taegeukSize - 5) / 2,
          (taegeukSize - 5) / 2,
          Math.PI,
          0,
          true
        );
        g.arc(
          x,
          y + (taegeukSize - 5) / 2,
          (taegeukSize - 5) / 2,
          0,
          Math.PI,
          true
        );
        g.fill();

        // Small circles
        g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.6 });
        g.circle(x, y - (taegeukSize - 5) / 4, 5);
        g.fill();

        g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
        g.circle(x, y + (taegeukSize - 5) / 4, 5);
        g.fill();
      });

      // Trigram symbols on walls - Fix: Use animationTime variable
      const trigrams = ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"];
      const trigramSpacing = width / (trigrams.length + 1);

      trigrams.forEach((_, index) => {
        const trigramX = trigramSpacing * (index + 1);
        const alpha = animate
          ? 0.3 + Math.sin(animationTime + index) * 0.2 // Now uses animationTime
          : 0.4;

        // Simple decorative lines representing trigrams
        g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha });
        for (let i = 0; i < 3; i++) {
          g.moveTo(trigramX - 10, 20 + i * 8);
          g.lineTo(trigramX + 10, 20 + i * 8);
        }
        g.stroke();
      });
    },
    [width, height, showPattern, animate, animationTime] // Fix: Added missing dependencies
  );

  // Dojang floor pattern
  const drawFloorPattern = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Traditional Korean floor tiles pattern
      const tileSize = 60;
      const tilesX = Math.ceil(width / tileSize);
      const tilesY = Math.ceil(height / tileSize);

      for (let x = 0; x < tilesX; x++) {
        for (let y = 0; y < tilesY; y++) {
          const tileX = x * tileSize;
          const tileY = y * tileSize;

          // Alternating tile pattern
          const isAlternate = (x + y) % 2 === 0;
          const tileAlpha = isAlternate ? 0.1 : 0.05;

          g.fill({
            color: KOREAN_COLORS.UI_BACKGROUND_LIGHT,
            alpha: tileAlpha,
          });
          g.rect(tileX, tileY, tileSize, tileSize);
          g.fill();

          // Tile borders
          g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.1 });
          g.rect(tileX, tileY, tileSize, tileSize);
          g.stroke();
        }
      }

      // Center arena marking - octagonal combat area
      const centerX = width / 2;
      const centerY = height / 2;
      const arenaRadius = Math.min(width, height) * 0.3;

      // Octagonal arena boundary
      g.stroke({ width: 3, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });

      const octagonPoints: number[] = [];
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 8;
        octagonPoints.push(
          centerX + Math.cos(angle) * arenaRadius,
          centerY + Math.sin(angle) * arenaRadius
        );
      }

      g.poly(octagonPoints);
      g.stroke();

      // Inner circle for precise positioning
      g.stroke({ width: 2, color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.6 });
      g.circle(centerX, centerY, arenaRadius * 0.8);
      g.stroke();

      // Center point
      g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
      g.circle(centerX, centerY, 8);
      g.fill();
    },
    [width, height]
  );

  // Enhanced lighting effects - Fix: Use animationTime properly
  const drawLightingEffects = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      if (lighting === "cyberpunk") {
        // Cyberpunk neon grid overlay
        const pulse = animate ? 0.5 + Math.sin(animationTime * 2) * 0.3 : 0.5;

        // Neon grid lines
        if (animate) {
          g.stroke({
            width: 2,
            color: KOREAN_COLORS.ACCENT_CYAN,
            alpha: pulse * 0.6,
          });
          g.moveTo(0, 50);
          g.lineTo(width, 50);
          g.moveTo(0, height - 50);
          g.lineTo(width, height - 50);
          g.stroke();
        }
      }

      if (lighting === "traditional") {
        // Warm traditional lighting from paper lanterns
        const lanternPositions = [
          [width * 0.2, height * 0.2],
          [width * 0.8, height * 0.2],
          [width * 0.2, height * 0.8],
          [width * 0.8, height * 0.8],
        ];

        lanternPositions.forEach(([x, y]) => {
          const lightRadius = animate
            ? 80 + Math.sin(animationTime + x) * 20 // Now uses animationTime
            : 80;

          // Warm light glow
          g.fill({ color: 0xffaa00, alpha: 0.1 });
          g.circle(x, y, lightRadius);
          g.fill();

          // Lantern representation
          g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.6 });
          g.rect(x - 8, y - 12, 16, 24);
          g.fill();
        });
      }
    },
    [width, height, lighting, animate, animationTime]
  );

  // Atmospheric particles/effects - Fix: Use animationTime throughout
  const drawAtmosphericEffects = useCallback(
    (g: PIXI.Graphics) => {
      if (!animate) return;

      g.clear();

      // Floating particles or energy wisps
      for (let i = 0; i < 20; i++) {
        const x = Math.sin(animationTime * 0.5 + i) * width * 0.4 + width / 2;
        const y = Math.cos(animationTime * 0.3 + i) * height * 0.3 + height / 2;
        const alpha = Math.sin(animationTime * 2 + i) * 0.3 + 0.3;

        g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha: alpha * 0.4 });
        g.circle(x, y, 2);
        g.fill();
      }

      // Energy flow lines for cyberpunk mode
      if (lighting === "cyberpunk") {
        g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_CYAN, alpha: 0.3 });

        for (let i = 0; i < 5; i++) {
          const offset = animationTime * 50 + i * 100; // Now uses animationTime
          const y = offset % height;

          g.moveTo(0, y);
          g.lineTo(width, y);
        }
        g.stroke();
      }
    },
    [animate, animationTime, width, height, lighting]
  );

  return (
    <pixiContainer data-testid="dojang-background">
      {/* Main background */}
      <pixiGraphics draw={drawMainBackground} />

      {/* Floor pattern */}
      <pixiGraphics draw={drawFloorPattern} />

      {/* Korean traditional patterns - Fix: Only show when showPattern is true */}
      {showPattern && <pixiGraphics draw={drawKoreanPatterns} />}

      {/* Lighting effects */}
      <pixiGraphics draw={drawLightingEffects} />

      {/* Atmospheric effects - Fix: Only show when animate is true */}
      {animate && <pixiGraphics draw={drawAtmosphericEffects} />}

      {/* Dojang nameplate */}
      <pixiContainer x={width / 2} y={30} data-testid="dojang-nameplate">
        <pixiText
          text="흑괘 무술 도장"
          style={{
            fontSize: 16,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            align: "center",
            fontFamily: '"Noto Sans KR", Arial, sans-serif',
          }}
          anchor={0.5}
        />

        <pixiText
          text="Black Trigram Martial Arts Dojang"
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
          }}
          anchor={0.5}
          y={20}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default DojangBackground;
