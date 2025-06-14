import React, { useCallback, useMemo } from "react";
import * as PIXI from "pixi.js";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import {
  KOREAN_COLORS,
  PLAYER_ARCHETYPES_DATA,
  TRIGRAM_DATA,
} from "../../../types/constants";
import type { PlayerState } from "../../../types/player";

export interface PlayerStatusPanelProps {
  readonly player: PlayerState;
  readonly position: "left" | "right";
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly isSelected?: boolean;
}

export const PlayerStatusPanel: React.FC<PlayerStatusPanelProps> = ({
  player,
  position,
  x = 0,
  y = 0,
  width = 200,
  height = 350,
  isSelected = false,
}) => {
  usePixiExtensions();

  const archetypeData = PLAYER_ARCHETYPES_DATA[player.archetype];
  const stanceData = TRIGRAM_DATA[player.currentStance];

  // Calculate all status percentages
  const healthPercent = player.health / player.maxHealth;
  const kiPercent = player.ki / player.maxKi;
  const staminaPercent = player.stamina / player.maxStamina;
  const balancePercent = player.balance / 100;
  const consciousnessPercent = player.consciousness / 100;

  // Calculate derived stats
  const totalCombatRating = useMemo(() => {
    return Math.round(
      (healthPercent * 30 +
        kiPercent * 25 +
        staminaPercent * 25 +
        balancePercent * 20) *
        100
    );
  }, [healthPercent, kiPercent, staminaPercent, balancePercent]);

  const combatReadiness = useMemo(() => {
    if (totalCombatRating > 80)
      return { text: "최상", color: KOREAN_COLORS.POSITIVE_GREEN };
    if (totalCombatRating > 60)
      return { text: "양호", color: KOREAN_COLORS.ACCENT_YELLOW };
    if (totalCombatRating > 40)
      return { text: "보통", color: KOREAN_COLORS.WARNING_ORANGE };
    if (totalCombatRating > 20)
      return { text: "위험", color: KOREAN_COLORS.WARNING_YELLOW };
    return { text: "치명", color: KOREAN_COLORS.NEGATIVE_RED };
  }, [totalCombatRating]);

  // Status colors based on values
  const getStatusColor = useCallback((percent: number) => {
    if (percent > 0.7) return KOREAN_COLORS.POSITIVE_GREEN;
    if (percent > 0.4) return KOREAN_COLORS.WARNING_YELLOW;
    if (percent > 0.2) return KOREAN_COLORS.WARNING_ORANGE;
    return KOREAN_COLORS.NEGATIVE_RED;
  }, []);

  // Enhanced panel background with Korean traditional elements
  const panelDraw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Main panel background
      g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95);
      g.lineStyle(
        3,
        isSelected ? KOREAN_COLORS.ACCENT_GOLD : KOREAN_COLORS.UI_BORDER,
        0.8
      );
      g.drawRoundedRect(0, 0, width, height, 12);
      g.endFill();

      // Archetype color accent
      g.beginFill(archetypeData.colors.primary, 0.3);
      g.drawRoundedRect(5, 5, width - 10, 25, 8);
      g.endFill();

      // Selection glow effect
      if (isSelected) {
        g.lineStyle(4, KOREAN_COLORS.ACCENT_GOLD, 0.8);
        g.drawRoundedRect(-2, -2, width + 4, height + 4, 14);

        // Pulsing inner glow
        g.lineStyle(6, KOREAN_COLORS.ACCENT_GOLD, 0.2);
        g.drawRoundedRect(-4, -4, width + 8, height + 8, 16);
      }
    },
    [width, height, isSelected, archetypeData.colors.primary]
  );

  // Enhanced status bar with segments and glow
  const drawEnhancedStatusBar = useCallback(
    (
      g: PIXI.Graphics,
      value: number,
      maxValue: number,
      barWidth: number,
      barHeight: number,
      color: number
    ) => {
      g.clear();

      // Background
      g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9);
      g.drawRoundedRect(0, 0, barWidth, barHeight, barHeight / 2);
      g.endFill();

      // Fill
      const fillWidth = Math.max(0, (value / maxValue) * (barWidth - 4));
      if (fillWidth > 0) {
        g.beginFill(color, 0.9);
        g.drawRoundedRect(2, 2, fillWidth, barHeight - 4, (barHeight - 4) / 2);
        g.endFill();

        // Glow effect on fill
        g.lineStyle(1, color, 0.6);
        g.drawRoundedRect(2, 2, fillWidth, barHeight - 4, (barHeight - 4) / 2);
      }

      // Outer border
      g.lineStyle(1, color, 0.8);
      g.drawRoundedRect(0, 0, barWidth, barHeight, barHeight / 2);
    },
    []
  );

  // Combat effectiveness indicator
  const drawCombatReadiness = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Background circle
      g.beginFill(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8);
      g.drawCircle(35, 35, 30);
      g.endFill();

      // Readiness arc
      const arcAngle = (totalCombatRating / 100) * Math.PI * 2;
      g.lineStyle(4, combatReadiness.color, 0.9);
      g.arc(35, 35, 25, -Math.PI / 2, -Math.PI / 2 + arcAngle);

      // Inner glow
      g.lineStyle(2, combatReadiness.color, 0.3);
      g.drawCircle(35, 35, 20);
    },
    [totalCombatRating, combatReadiness.color]
  );

  return (
    <pixiContainer x={x} y={y} data-testid={`player-status-panel-${position}`}>
      {/* Enhanced Main Panel */}
      <pixiGraphics draw={panelDraw} />

      {/* Player Header Section */}
      <pixiContainer x={12} y={10}>
        <pixiText
          text={player.name.korean}
          style={{
            fontSize: 16,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
          }}
        />
        <pixiText
          text={archetypeData.name.korean}
          style={{
            fontSize: 12,
            fill: archetypeData.colors.primary,
            fontWeight: "bold",
          }}
          y={20}
        />
      </pixiContainer>

      {/* Combat Readiness Indicator */}
      <pixiContainer x={width - 80} y={10}>
        <pixiGraphics draw={drawCombatReadiness} />
        <pixiText
          text={`${totalCombatRating}`}
          style={{
            fontSize: 14,
            fill: combatReadiness.color,
            fontWeight: "bold",
            align: "center",
          }}
          x={35}
          y={30}
          anchor={0.5}
        />
        <pixiText
          text={combatReadiness.text}
          style={{
            fontSize: 8,
            fill: combatReadiness.color,
            align: "center",
          }}
          x={35}
          y={42}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Main Health Bar */}
      <pixiContainer x={12} y={55}>
        <pixiText
          text="체력 Health"
          style={{
            fontSize: 11,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontWeight: "bold",
          }}
        />
        <pixiGraphics
          draw={(g) =>
            drawEnhancedStatusBar(
              g,
              player.health,
              player.maxHealth,
              width - 24,
              16,
              getStatusColor(healthPercent)
            )
          }
          y={14}
        />
        <pixiText
          text={`${Math.round(player.health)}/${player.maxHealth} (${Math.round(
            healthPercent * 100
          )}%)`}
          style={{
            fontSize: 9,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
          }}
          x={(width - 24) / 2}
          y={20}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Ki Energy Bar */}
      <pixiContainer x={12} y={95}>
        <pixiText
          text="기력 Ki Energy"
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
              KOREAN_COLORS.PRIMARY_CYAN
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
          y={17}
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
