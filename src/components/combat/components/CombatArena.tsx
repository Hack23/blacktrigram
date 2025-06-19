import React, { useCallback } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import { Player } from "./Player";
import type { PlayerState } from "../../../types/player";
import { KOREAN_COLORS } from "../../../types/constants";
import * as PIXI from "pixi.js";

extend({ Container, Graphics });

/**
 * @interface CombatArenaProps
 * @description Combat arena component props for Korean martial arts combat visualization
 */
export interface CombatArenaProps {
  readonly players: readonly PlayerState[];
  readonly onPlayerClick?: (idx: number) => void;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
}

/**
 * CombatArena Component
 *
 * @description Renders the main combat arena with Korean martial arts aesthetics,
 * including traditional octagonal boundaries and player positioning
 *
 * @param props - Arena configuration and player data
 * @returns JSX element representing the combat arena
 *
 * @example
 * ```tsx
 * <CombatArena
 *   players={[player1, player2]}
 *   onPlayerClick={(idx) => selectPlayer(idx)}
 *   width={1200}
 *   height={800}
 * />
 * ```
 */
export const CombatArena: React.FC<CombatArenaProps> = ({
  players,
  onPlayerClick = () => {},
  width = 800,
  height = 600,
  x = 0,
  y = 0,
}) => {
  usePixiExtensions();

  const drawArenaBackground = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Arena floor
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.3 });
      g.rect(0, 0, width, height);
      g.fill();

      // Center line
      g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.5 });
      g.moveTo(width / 2, 50);
      g.lineTo(width / 2, height - 50);
      g.stroke();

      // Combat boundaries
      g.stroke({ width: 3, color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.4 });
      g.rect(50, 50, width - 100, height - 100);
      g.stroke();
    },
    [width, height]
  );

  const drawOctagonalBoundary = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Octagonal boundary for traditional Korean martial arts
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.35;
      const sides = 8;

      const points: [number, number][] = [];
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides;
        points.push([
          centerX + radius * Math.cos(angle),
          centerY + radius * Math.sin(angle),
        ]);
      }

      g.stroke({ width: 3, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
      g.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        g.lineTo(points[i][0], points[i][1]);
      }
      g.lineTo(points[0][0], points[0][1]); // Close the octagon
      g.stroke();
    },
    [width, height]
  );

  return (
    <pixiContainer x={x} y={y} data-testid="combat-arena">
      {/* Arena background */}
      <pixiGraphics draw={drawArenaBackground} />

      {/* Octagonal arena boundaries */}
      <pixiGraphics
        draw={drawOctagonalBoundary}
        data-testid="arena-boundaries"
      />

      {/* Traditional Korean Corner Markers with Trigram Symbols */}
      {[
        { x: 75, y: 125, symbol: "☰" },
        { x: width - 75, y: 125, symbol: "☱" },
        { x: 75, y: height - 125, symbol: "☷" },
        { x: width - 75, y: height - 125, symbol: "☶" },
      ].map(({ x: cornerX, y: cornerY, symbol }, index) => (
        <pixiContainer
          key={index}
          x={cornerX}
          y={cornerY}
          data-testid={`corner-marker-${index}`}
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
              g.circle(0, 0, 12);
              g.fill();

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.UI_BORDER,
                alpha: 0.6,
              });
              g.circle(0, 0, 12);
              g.stroke();
            }}
          />
          <pixiText
            text={symbol}
            style={{
              fontSize: 14,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              align: "center",
            }}
            anchor={0.5}
          />
        </pixiContainer>
      ))}

      {/* Central Taegeuk Symbol */}
      <pixiContainer x={width / 2} y={height / 2} data-testid="central-taegeuk">
        <pixiGraphics
          draw={(g) => {
            g.clear();

            // Taegeuk background circle
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_LIGHT, alpha: 0.3 });
            g.circle(0, 0, 30);
            g.fill();

            // Yin-Yang pattern
            g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.6 });
            g.arc(0, 0, 30, 0, Math.PI);
            g.arc(0, -15, 15, Math.PI, 0, true);
            g.arc(0, 15, 15, 0, Math.PI, true);
            g.fill();

            // Small circles
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
            g.circle(0, -15, 5);
            g.fill();

            g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
            g.circle(0, 15, 5);
            g.fill();
          }}
        />
      </pixiContainer>

      {/* Players */}
      {players.map((player, index) => {
        const playerX = index === 0 ? width * 0.25 : width * 0.75;
        const playerY = height * 0.5;

        return (
          <Player
            key={player.id}
            playerState={player}
            playerIndex={index}
            onClick={() => onPlayerClick(index)}
            x={playerX}
            y={playerY}
          />
        );
      })}
    </pixiContainer>
  );
};

export default CombatArena;
