import React, { useCallback } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import type { PlayerState } from "../../../types/player";
import { KOREAN_COLORS, TRIGRAM_DATA } from "../../../types/constants";
import * as PIXI from "pixi.js";

extend({ Container, Graphics, Text });

export interface PlayerStatusPanelProps {
  readonly player: PlayerState;
  readonly position: "left" | "right";
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly isSelected?: boolean;
}

const getStatusColor = (percent: number): number => {
  if (percent > 0.6) return KOREAN_COLORS.POSITIVE_GREEN;
  if (percent > 0.3) return KOREAN_COLORS.WARNING_YELLOW;
  return KOREAN_COLORS.NEGATIVE_RED;
};

const drawEnhancedStatusBar = (
  g: PIXI.Graphics,
  current: number,
  max: number,
  width: number,
  height: number,
  color: number
): void => {
  g.clear();

  // Background
  g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_LIGHT, alpha: 0.5 });
  g.rect(0, 0, width, height);
  g.fill();

  // Status fill
  const percent = current / max;
  g.fill({ color, alpha: 0.9 });
  g.rect(0, 0, width * percent, height);
  g.fill();

  // Border
  g.stroke({ width: 1, color: KOREAN_COLORS.UI_BORDER, alpha: 0.6 });
  g.rect(0, 0, width, height);
  g.stroke();
};

export const PlayerStatusPanel: React.FC<PlayerStatusPanelProps> = ({
  player,
  position,
  x = 0,
  y = 0,
  width = 180,
  height = 300,
  isSelected = false,
}) => {
  usePixiExtensions();

  const stanceData = TRIGRAM_DATA[player.currentStance];
  const healthPercent = player.health / player.maxHealth;
  const kiPercent = player.ki / player.maxKi;
  const staminaPercent = player.stamina / player.maxStamina;
  const balancePercent = player.balance / 100;
  const consciousnessPercent = player.consciousness / 100;

  const drawPanel = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Background
      g.fill({
        color: KOREAN_COLORS.UI_BACKGROUND_DARK,
        alpha: isSelected ? 0.95 : 0.85,
      });
      g.roundRect(0, 0, width, height, 10);
      g.fill();

      // Border
      const borderColor = isSelected
        ? KOREAN_COLORS.ACCENT_GOLD
        : position === "left"
        ? KOREAN_COLORS.PLAYER_1_COLOR
        : KOREAN_COLORS.PLAYER_2_COLOR;

      g.stroke({ width: isSelected ? 3 : 2, color: borderColor, alpha: 0.8 });
      g.roundRect(0, 0, width, height, 10);
      g.stroke();
    },
    [width, height, isSelected, position]
  );

  return (
    <pixiContainer x={x} y={y} data-testid="player-status-panel">
      <pixiGraphics draw={drawPanel} />

      {/* Player name */}
      <pixiContainer x={12} y={15}>
        <pixiText
          text={player.name.korean}
          style={{
            fontSize: 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
            align: "center",
          }}
          x={(width - 24) / 2}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Health Bar */}
      <pixiContainer x={12} y={45}>
        <pixiText
          text="체력 Health"
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
        />
        <pixiGraphics
          draw={(g) =>
            drawEnhancedStatusBar(
              g,
              player.health,
              player.maxHealth,
              width - 24,
              12,
              getStatusColor(healthPercent)
            )
          }
          y={12}
        />
        <pixiText
          text={`${Math.round(player.health)}/${player.maxHealth} (${Math.round(
            healthPercent * 100
          )}%)`}
          style={{
            fontSize: 8,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
          }}
          x={(width - 24) / 2}
          y={27}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Ki Bar */}
      <pixiContainer x={12} y={85}>
        <pixiText
          text="기력 Ki"
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
        />
        <pixiGraphics
          draw={(g) =>
            drawEnhancedStatusBar(
              g,
              player.ki,
              player.maxKi,
              width - 24,
              12,
              getStatusColor(kiPercent)
            )
          }
          y={12}
        />
        <pixiText
          text={`${Math.round(player.ki)}/${player.maxKi} (${Math.round(
            kiPercent * 100
          )}%)`}
          style={{
            fontSize: 8,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
          }}
          x={(width - 24) / 2}
          y={27}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Stamina Bar */}
      <pixiContainer x={12} y={130}>
        <pixiText
          text="체력 Stamina"
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
        />
        <pixiGraphics
          draw={(g) =>
            drawEnhancedStatusBar(
              g,
              player.stamina,
              player.maxStamina,
              width - 24,
              12,
              getStatusColor(staminaPercent)
            )
          }
          y={12}
        />
        <pixiText
          text={`${Math.round(player.stamina)}/${
            player.maxStamina
          } (${Math.round(staminaPercent * 100)}%)`}
          style={{
            fontSize: 8,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
          }}
          x={(width - 24) / 2}
          y={17}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Balance & Consciousness Dual Bars */}
      <pixiContainer x={12} y={165}>
        <pixiText
          text="균형 & 의식 Balance & Mind"
          style={{
            fontSize: 9,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
        />

        {/* Balance */}
        <pixiContainer y={12}>
          <pixiGraphics
            draw={(g) =>
              drawEnhancedStatusBar(
                g,
                player.balance,
                100,
                (width - 30) / 2,
                10,
                getStatusColor(balancePercent)
              )
            }
          />
          <pixiText
            text={`${Math.round(balancePercent * 100)}%`}
            style={{
              fontSize: 7,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
              align: "center",
            }}
            x={(width - 30) / 4}
            y={12}
            anchor={0.5}
          />
        </pixiContainer>

        {/* Consciousness */}
        <pixiContainer x={(width - 30) / 2 + 6} y={12}>
          <pixiGraphics
            draw={(g) =>
              drawEnhancedStatusBar(
                g,
                player.consciousness,
                100,
                (width - 30) / 2,
                10,
                getStatusColor(consciousnessPercent)
              )
            }
          />
          <pixiText
            text={`${Math.round(consciousnessPercent * 100)}%`}
            style={{
              fontSize: 7,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
              align: "center",
            }}
            x={(width - 30) / 4}
            y={12}
            anchor={0.5}
          />
        </pixiContainer>
      </pixiContainer>

      {/* Current Stance Display */}
      <pixiContainer x={12} y={200}>
        <pixiText
          text="현재 자세 Current Stance"
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
          }}
        />
        <pixiContainer y={18}>
          {/* Enhanced stance circle */}
          <pixiGraphics
            draw={(g) => {
              g.clear();
              // Main circle
              g.beginFill(stanceData.theme.primary, 0.8);
              g.drawCircle(25, 25, 18);
              g.endFill();
              // Border
              g.lineStyle(2, stanceData.theme.secondary, 0.9);
              g.drawCircle(25, 25, 18);
            }}
          />
          <pixiText
            text={stanceData.symbol}
            style={{
              fontSize: 16,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              align: "center",
            }}
            x={25}
            y={25}
            anchor={0.5}
          />
          <pixiText
            text={stanceData.name.korean}
            style={{
              fontSize: 11,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
            }}
            x={55}
            y={18}
          />
          <pixiText
            text={stanceData.name.english}
            style={{
              fontSize: 9,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
            x={55}
            y={30}
          />
        </pixiContainer>
      </pixiContainer>

      {/* Enhanced Combat Statistics */}
      <pixiContainer x={12} y={260}>
        <pixiText
          text="전투 통계 Combat Stats"
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
          }}
        />

        {/* Stats grid */}
        <pixiContainer y={15}>
          {/* Hits landed */}
          <pixiText
            text={`명중: ${player.hitsLanded || 0}`}
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.POSITIVE_GREEN,
            }}
          />

          {/* Hits taken */}
          <pixiText
            text={`피격: ${player.hitsTaken || 0}`}
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.NEGATIVE_RED,
            }}
            x={75}
          />

          {/* Damage dealt */}
          <pixiText
            text={`가한 피해: ${Math.round(player.totalDamageDealt || 0)}`}
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
            y={12}
          />

          {/* Damage received */}
          <pixiText
            text={`받은 피해: ${Math.round(player.totalDamageReceived || 0)}`}
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
            y={24}
          />

          {/* Accuracy percentage - Fix safe calculation */}
          <pixiText
            text={`정확도: ${Math.round(
              ((player.hitsLanded || 0) /
                Math.max(
                  1,
                  (player.hitsLanded || 0) + (player.hitsTaken || 0)
                )) *
                100
            )}%`}
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.ACCENT_CYAN,
            }}
            y={36}
          />
        </pixiContainer>
      </pixiContainer>

      {/* Status Effects Display */}
      {player.statusEffects && player.statusEffects.length > 0 && (
        <pixiContainer x={12} y={height - 50}>
          <pixiText
            text="상태 효과 Status Effects"
            style={{
              fontSize: 9,
              fill: KOREAN_COLORS.WARNING_YELLOW,
              fontWeight: "bold",
            }}
          />
          <pixiContainer y={12}>
            {player.statusEffects.slice(0, 4).map((effect, index) => (
              <pixiGraphics
                key={effect.id}
                draw={(g) => {
                  g.clear();
                  const effectColor =
                    effect.type === "stun"
                      ? KOREAN_COLORS.WARNING_YELLOW
                      : effect.type === "poison"
                      ? KOREAN_COLORS.POSITIVE_GREEN
                      : KOREAN_COLORS.NEGATIVE_RED;

                  // Effect icon background
                  g.beginFill(effectColor, 0.8);
                  g.drawRoundedRect(index * 25, 0, 20, 20, 4);
                  g.endFill();

                  // Border
                  g.lineStyle(1, effectColor, 1.0);
                  g.drawRoundedRect(index * 25, 0, 20, 20, 4);
                }}
              />
            ))}
          </pixiContainer>
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default PlayerStatusPanel;
