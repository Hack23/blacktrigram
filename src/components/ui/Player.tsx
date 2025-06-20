// Complete Player UI component with Korean martial arts character rendering

import React, { useCallback, useMemo } from "react";
import type { PlayerProps } from "../../types/components";
import { KOREAN_COLORS } from "../../types/constants";
import { PlayerArchetype, TrigramStance } from "../../types/enums";
import usePixiExtensions from "../../utils/pixiExtensions";

export const Player: React.FC<PlayerProps> = ({
  playerState,
  playerIndex,
  onClick,
  x = 0,
  y = 0,
  width = 200,
  height = 300,
}) => {
  usePixiExtensions();

  // Calculate health percentage
  const healthPercentage = useMemo(() => {
    return playerState.maxHealth > 0
      ? playerState.health / playerState.maxHealth
      : 0;
  }, [playerState.health, playerState.maxHealth]);

  // Calculate ki percentage
  const kiPercentage = useMemo(() => {
    return playerState.maxKi > 0 ? playerState.ki / playerState.maxKi : 0;
  }, [playerState.ki, playerState.maxKi]);

  // Calculate stamina percentage
  const staminaPercentage = useMemo(() => {
    return playerState.maxStamina > 0
      ? playerState.stamina / playerState.maxStamina
      : 0;
  }, [playerState.stamina, playerState.maxStamina]);

  // Get archetype color
  const getArchetypeColor = useCallback((archetype: PlayerArchetype) => {
    switch (archetype) {
      case PlayerArchetype.MUSA:
        return KOREAN_COLORS.TRIGRAM_GEON_PRIMARY;
      case PlayerArchetype.AMSALJA:
        return KOREAN_COLORS.TRIGRAM_SON_PRIMARY;
      case PlayerArchetype.HACKER:
        return KOREAN_COLORS.PRIMARY_CYAN;
      case PlayerArchetype.JEONGBO_YOWON:
        return KOREAN_COLORS.TRIGRAM_TAE_PRIMARY;
      case PlayerArchetype.JOJIK_POKRYEOKBAE:
        return KOREAN_COLORS.TRIGRAM_JIN_PRIMARY;
      default:
        return KOREAN_COLORS.TEXT_PRIMARY;
    }
  }, []);

  // Get stance symbol
  const getStanceSymbol = useCallback((stance: TrigramStance) => {
    switch (stance) {
      case TrigramStance.GEON:
        return "☰";
      case TrigramStance.TAE:
        return "☱";
      case TrigramStance.LI:
        return "☲";
      case TrigramStance.JIN:
        return "☳";
      case TrigramStance.SON:
        return "☴";
      case TrigramStance.GAM:
        return "☵";
      case TrigramStance.GAN:
        return "☶";
      case TrigramStance.GON:
        return "☷";
      default:
        return "☰";
    }
  }, []);

  // Draw health bar
  const drawHealthBar = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Background
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
      g.rect(0, 0, width - 20, 15);
      g.fill();

      // Health fill
      const healthColor =
        healthPercentage > 0.6
          ? KOREAN_COLORS.POSITIVE_GREEN
          : healthPercentage > 0.3
          ? KOREAN_COLORS.ACCENT_YELLOW
          : KOREAN_COLORS.NEGATIVE_RED;

      g.fill({ color: healthColor, alpha: 0.9 });
      g.rect(2, 2, (width - 24) * healthPercentage, 11);
      g.fill();

      // Border
      g.stroke({ width: 1, color: KOREAN_COLORS.TEXT_SECONDARY, alpha: 0.6 });
      g.rect(0, 0, width - 20, 15);
      g.stroke();
    },
    [healthPercentage, width]
  );

  // Draw ki bar
  const drawKiBar = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Background
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
      g.rect(0, 0, width - 20, 12);
      g.fill();

      // Ki fill
      g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.8 });
      g.rect(2, 2, (width - 24) * kiPercentage, 8);
      g.fill();

      // Border
      g.stroke({ width: 1, color: KOREAN_COLORS.TEXT_SECONDARY, alpha: 0.6 });
      g.rect(0, 0, width - 20, 12);
      g.stroke();
    },
    [kiPercentage, width]
  );

  // Draw stamina bar
  const drawStaminaBar = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Background
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
      g.rect(0, 0, width - 20, 12);
      g.fill();

      // Stamina fill
      g.fill({ color: KOREAN_COLORS.ACCENT_YELLOW, alpha: 0.8 });
      g.rect(2, 2, (width - 24) * staminaPercentage, 8);
      g.fill();

      // Border
      g.stroke({ width: 1, color: KOREAN_COLORS.TEXT_SECONDARY, alpha: 0.6 });
      g.rect(0, 0, width - 20, 12);
      g.stroke();
    },
    [staminaPercentage, width]
  );

  // Draw player background
  const drawPlayerBackground = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      const archetypeColor = getArchetypeColor(playerState.archetype);

      // Main background
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
      g.roundRect(0, 0, width, height, 8);
      g.fill();

      // Archetype accent border
      g.stroke({ width: 2, color: archetypeColor, alpha: 0.8 });
      g.roundRect(0, 0, width, height, 8);
      g.stroke();

      // Status indicator
      if (!playerState.isAlive) {
        g.fill({ color: KOREAN_COLORS.NEGATIVE_RED, alpha: 0.3 });
        g.roundRect(0, 0, width, height, 8);
        g.fill();
      } else if (playerState.isBlocking) {
        g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.2 });
        g.roundRect(0, 0, width, height, 8);
        g.fill();
      }
    },
    [width, height, playerState, getArchetypeColor]
  );

  // Fix: Properly structure the status effects rendering
  const drawStatusEffects = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      
      if (playerState.statusEffects && playerState.statusEffects.length > 0) {
        playerState.statusEffects.forEach((effect, index) => {
          let effectColor = KOREAN_COLORS.TEXT_SECONDARY;
          
          // Fix: Use proper switch statement syntax
          switch (effect.type) {
            case "poison":
              effectColor = KOREAN_COLORS.POSITIVE_GREEN;
              break;
            case "burn":
              effectColor = KOREAN_COLORS.NEGATIVE_RED;
              break;
            case "stun":
              effectColor = KOREAN_COLORS.ACCENT_YELLOW;
              break;
            case "bleed":
              effectColor = KOREAN_COLORS.NEGATIVE_RED_DARK;
              break;
            case "strengthened":
              effectColor = KOREAN_COLORS.POSITIVE_GREEN;
              break;
            case "weakened":
              effectColor = KOREAN_COLORS.NEGATIVE_RED_LIGHT;
              break;
            default:
              effectColor = KOREAN_COLORS.TEXT_SECONDARY;
              break;
          }

          g.fill({ color: effectColor, alpha: 0.8 });
          g.circle(10 + index * 15, 10, 5);
          g.fill();
        });
      }
    },
    [playerState.statusEffects]
  );

  return (
    <pixiContainer
      x={x}
      y={y}
      interactive={true}
      onPointerDown={onClick}
      data-testid={`player-${playerIndex}`}
    >
      {/* Player Background */}
      <pixiGraphics draw={drawPlayerBackground} />

      {/* Player Name */}
      <pixiText
        text={`${playerState.name.korean} (${playerState.name.english})`}
        style={{
          fontSize: 14,
          fill: getArchetypeColor(playerState.archetype),
          fontWeight: "bold",
          align: "center",
        }}
        x={width / 2}
        y={15}
        anchor={0.5}
      />

      {/* Archetype */}
      <pixiText
        text={playerState.archetype}
        style={{
          fontSize: 12,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
          align: "center",
        }}
        x={width / 2}
        y={35}
        anchor={0.5}
      />

      {/* Current Stance */}
      <pixiContainer x={10} y={55}>
        <pixiText
          text={`${getStanceSymbol(playerState.currentStance)}`}
          style={{
            fontSize: 20,
            fill: getArchetypeColor(playerState.archetype),
            align: "center",
          }}
          x={0}
          y={0}
        />
        <pixiText
          text={playerState.currentStance}
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          x={25}
          y={8}
        />
      </pixiContainer>

      {/* Health Bar */}
      <pixiContainer x={10} y={85}>
        <pixiText
          text="체력"
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          x={0}
          y={-12}
        />
        <pixiGraphics draw={drawHealthBar} />
        <pixiText
          text={`${playerState.health}/${playerState.maxHealth}`}
          style={{
            fontSize: 9,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "right",
          }}
          x={width - 25}
          y={2}
        />
      </pixiContainer>

      {/* Ki Bar */}
      <pixiContainer x={10} y={110}>
        <pixiText
          text="기"
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          x={0}
          y={-12}
        />
        <pixiGraphics draw={drawKiBar} />
        <pixiText
          text={`${playerState.ki}/${playerState.maxKi}`}
          style={{
            fontSize: 9,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "right",
          }}
          x={width - 25}
          y={2}
        />
      </pixiContainer>

      {/* Stamina Bar */}
      <pixiContainer x={10} y={135}>
        <pixiText
          text="체력"
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          x={0}
          y={-12}
        />
        <pixiGraphics draw={drawStaminaBar} />
        <pixiText
          text={`${playerState.stamina}/${playerState.maxStamina}`}
          style={{
            fontSize: 9,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "right",
          }}
          x={width - 25}
          y={2}
        />
      </pixiContainer>

      {/* Status Effects */}
      <pixiContainer x={10} y={165}>
        <pixiText
          text="상태"
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          x={0}
          y={-12}
        />
        <pixiGraphics draw={drawStatusEffects} />
      </pixiContainer>

      {/* Combat Stats */}
      <pixiContainer x={10} y={200}>
        <pixiText
          text={`공격력: ${playerState.combatStats.totalDamage}`}
          style={{
            fontSize: 9,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          x={0}
          y={0}
        />
        <pixiText
          text={`크리티컬: ${playerState.combatStats.criticalHits}`}
          style={{
            fontSize: 9,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          x={0}
          y={15}
        />
        <pixiText
          text={`급소: ${playerState.combatStats.vitalPointHits}`}
          style={{
            fontSize: 9,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          x={0}
          y={30}
        />
      </pixiContainer>

      {/* Position indicator */}
      <pixiText
        text={`위치: (${Math.round(playerState.position.x)}, ${Math.round(
          playerState.position.y
        )})`}
        style={{
          fontSize: 8,
          fill: KOREAN_COLORS.TEXT_TERTIARY,
        }}
        x={10}
        y={height - 15}
      />
    </pixiContainer>
  );
};

export default Player;

