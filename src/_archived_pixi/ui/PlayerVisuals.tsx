import { PLAYER_ARCHETYPES_DATA, PlayerState } from "@/systems";
import { KOREAN_COLORS } from "@/types/constants";
import { usePixiExtensions } from "@/utils/pixiExtensions";
import { extend } from "@pixi/react";
import * as PIXI from "pixi.js";
import React, { useCallback, useMemo } from "react";
import { TrigramStance } from "../../types/common";
import { FONT_FAMILY } from "../../types/constants/typography";
import { getArchetypeColors } from "../../utils/colorUtils"; // Fixed import path

// Extend PIXI components for React
extend({
  Container: PIXI.Container,
  Graphics: PIXI.Graphics,
  Text: PIXI.Text,
});

export interface PlayerVisualsProps {
  readonly playerState: PlayerState;
  readonly x?: number;
  readonly y?: number;
  readonly scale?: number;
  readonly showDetails?: boolean;
  readonly showKoreanLabels?: boolean;
  readonly animationState?: PlayerAnimationState;
  readonly renderMode?: PlayerRenderContext;
  readonly facing?: PlayerFacing;
  readonly showVitalPoints?: boolean;
  readonly showStanceIndicator?: boolean;
  readonly showArchetypeSymbol?: boolean;
  readonly interactive?: boolean;
  readonly onVitalPointClick?: (vitalPointId: string) => void;
  readonly onPlayerClick?: () => void;
  readonly highlightedVitalPoints?: readonly string[];
  readonly showKiAura?: boolean;
  readonly showStatusEffectVisuals?: boolean;
}

export type PlayerAnimationState =
  | "idle"
  | "attack"
  | "defend"
  | "hit"
  | "stance_change"
  | "technique_windup"
  | "technique_execute"
  | "technique_recover"
  | "knocked_down"
  | "getting_up"
  | "victory"
  | "defeat"
  | "walk";

export type PlayerRenderContext =
  | "combat"
  | "training"
  | "selection"
  | "preview"
  | "demonstration";

export type PlayerFacing = "left" | "right" | "forward";

// Vital point data for training mode
const VITAL_POINTS = [
  {
    id: "head_temple",
    x: 0,
    y: -55,
    korean: "태양혈",
    english: "Temple",
    difficulty: 4,
  },
  {
    id: "neck_carotid",
    x: -8,
    y: -35,
    korean: "경동맥",
    english: "Carotid",
    difficulty: 5,
  },
  {
    id: "throat_center",
    x: 0,
    y: -30,
    korean: "인영",
    english: "Throat",
    difficulty: 3,
  },
  {
    id: "chest_solar",
    x: 0,
    y: -5,
    korean: "단중",
    english: "Solar Plexus",
    difficulty: 2,
  },
  {
    id: "abdomen_center",
    x: 0,
    y: 15,
    korean: "중완",
    english: "Abdomen",
    difficulty: 2,
  },
  {
    id: "knee_cap",
    x: -5,
    y: 50,
    korean: "슬개골",
    english: "Kneecap",
    difficulty: 2,
  },
  {
    id: "ankle_inner",
    x: -10,
    y: 70,
    korean: "내과",
    english: "Inner Ankle",
    difficulty: 3,
  },
  {
    id: "wrist_pressure",
    x: -25,
    y: 5,
    korean: "신문",
    english: "Wrist Point",
    difficulty: 3,
  },
] as const;

// Helper function to get trigram symbol
const getTrigramSymbol = (stance: TrigramStance): string => {
  const symbols = {
    [TrigramStance.GEON]: "☰", // Heaven
    [TrigramStance.TAE]: "☱", // Lake
    [TrigramStance.LI]: "☲", // Fire
    [TrigramStance.JIN]: "☳", // Thunder
    [TrigramStance.SON]: "☴", // Wind
    [TrigramStance.GAM]: "☵", // Water
    [TrigramStance.GAN]: "☶", // Mountain
    [TrigramStance.GON]: "☷", // Earth
  };
  return symbols[stance] || "☰";
};

export const PlayerVisuals: React.FC<PlayerVisualsProps> = ({
  playerState,
  x = 0,
  y = 0,
  scale = 1.0,
  showDetails = true,
  showKoreanLabels = false,
  animationState = "idle",
  renderMode = "combat",
  facing = "forward",
  showVitalPoints = false,
  showStanceIndicator = true,
  showArchetypeSymbol = true,
  interactive = false,
  onVitalPointClick,
  onPlayerClick,
  highlightedVitalPoints = [],
  showKiAura = true,
  showStatusEffectVisuals = true,
}) => {
  usePixiExtensions();

  const archetypeData = useMemo(() => {
    return PLAYER_ARCHETYPES_DATA[playerState.archetype];
  }, [playerState.archetype]);

  const archetypeColors = useMemo(() => {
    return getArchetypeColors(playerState.archetype);
  }, [playerState.archetype]);

  // Calculate visual states
  const visualStates = useMemo(() => {
    const healthPercent = playerState.health / playerState.maxHealth;
    const kiPercent = playerState.ki / playerState.maxKi;
    const staminaPercent = playerState.stamina / playerState.maxStamina;

    return {
      healthPercent,
      kiPercent,
      staminaPercent,
      isLowHealth: healthPercent < 0.3,
      isHighKi: kiPercent > 0.8,
      isExhausted: staminaPercent < 0.2,
      shouldPulse:
        renderMode === "training" && animationState === "technique_execute",
      shouldGlow:
        playerState.isBlocking ||
        playerState.isCountering ||
        (showKiAura && kiPercent > 0.7),
    };
  }, [playerState, renderMode, animationState, showKiAura]);

  // Animation timing
  const animationTime = useMemo(() => Date.now() * 0.001, []);

  // Get stance-specific body positioning
  const getStanceBodyModifications = useCallback((stance: TrigramStance) => {
    const stanceModifications = {
      [TrigramStance.GEON]: {
        bodyRotation: 0,
        armPosition: 0,
        legStance: "normal" as const,
      },
      [TrigramStance.TAE]: {
        bodyRotation: -5,
        armPosition: 10,
        legStance: "wide" as const,
      },
      [TrigramStance.LI]: {
        bodyRotation: 5,
        armPosition: -10,
        legStance: "forward" as const,
      },
      [TrigramStance.JIN]: {
        bodyRotation: 0,
        armPosition: 20,
        legStance: "combat" as const,
      },
      [TrigramStance.SON]: {
        bodyRotation: -10,
        armPosition: -5,
        legStance: "light" as const,
      },
      [TrigramStance.GAM]: {
        bodyRotation: 0,
        armPosition: -15,
        legStance: "low" as const,
      },
      [TrigramStance.GAN]: {
        bodyRotation: 10,
        armPosition: 15,
        legStance: "defensive" as const,
      },
      [TrigramStance.GON]: {
        bodyRotation: 0,
        armPosition: 5,
        legStance: "grounded" as const,
      },
    };
    return (
      stanceModifications[stance] || stanceModifications[TrigramStance.GEON]
    );
  }, []);

  const stanceModifications = getStanceBodyModifications(
    playerState.currentStance
  );

  // Enhanced player body drawing
  const drawPlayerBody = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Body color based on health and states
      let bodyColor = archetypeColors.primary;
      if (playerState.isStunned) bodyColor = KOREAN_COLORS.WARNING_YELLOW;
      else if (visualStates.isLowHealth) bodyColor = KOREAN_COLORS.ACCENT_RED;
      else if (visualStates.isHighKi) bodyColor = KOREAN_COLORS.PRIMARY_CYAN;

      // Ki aura effect
      if (visualStates.shouldGlow && showKiAura) {
        const auraAlpha = 0.3 + Math.sin(animationTime * 3) * 0.2;
        g.fill({ color: KOREAN_COLORS.ACCENT_CYAN, alpha: auraAlpha });
        g.circle(0, -20, 45 + Math.sin(animationTime * 2) * 5);
        g.fill();
      }

      // Main body (torso)
      g.fill({ color: bodyColor, alpha: 0.9 });
      const bodyWidth = renderMode === "training" ? 30 : 25;
      const bodyHeight = renderMode === "training" ? 50 : 40;
      g.roundRect(-bodyWidth / 2, -25, bodyWidth, bodyHeight, 8);
      g.fill();

      // Head
      const headColor = visualStates.isLowHealth
        ? KOREAN_COLORS.ACCENT_RED
        : archetypeColors.secondary;
      g.fill({ color: headColor, alpha: 0.8 });
      g.circle(0, -45, renderMode === "training" ? 18 : 15);
      g.fill();

      // Arms - position based on stance and animation
      const armOffset = stanceModifications.armPosition;
      const armY = animationState === "attack" ? -15 : -10;

      g.stroke({
        width: renderMode === "training" ? 10 : 8,
        color: bodyColor,
        alpha: 0.8,
      });
      // Left arm
      g.moveTo(-bodyWidth / 2, armY);
      g.lineTo(-bodyWidth / 2 - 25 - armOffset, armY + 20);
      // Right arm
      g.moveTo(bodyWidth / 2, armY);
      g.lineTo(bodyWidth / 2 + 25 + armOffset, armY + 20);
      g.stroke();

      // Legs - position based on stance
      const legWidth = stanceModifications.legStance === "wide" ? 20 : 15;
      g.stroke({
        width: renderMode === "training" ? 10 : 8,
        color: bodyColor,
        alpha: 0.8,
      });
      // Left leg
      g.moveTo(-bodyWidth / 4, 20);
      g.lineTo(-bodyWidth / 4 - legWidth, 60);
      // Right leg
      g.moveTo(bodyWidth / 4, 20);
      g.lineTo(bodyWidth / 4 + legWidth, 60);
      g.stroke();

      // Combat state indicators
      if (playerState.isBlocking) {
        g.stroke({ width: 3, color: KOREAN_COLORS.PRIMARY_BLUE, alpha: 0.8 });
        g.roundRect(
          -bodyWidth / 2 - 5,
          -30,
          bodyWidth + 10,
          bodyHeight + 10,
          10
        );
        g.stroke();
      }

      if (playerState.isCountering) {
        g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_PURPLE, alpha: 0.9 });
        for (let i = 0; i < 4; i++) {
          const angle = (animationTime * 2 + (i * Math.PI) / 2) % (Math.PI * 2);
          const x1 = Math.cos(angle) * 20;
          const y1 = Math.sin(angle) * 20;
          const x2 = Math.cos(angle) * 35;
          const y2 = Math.sin(angle) * 35;
          g.moveTo(x1, y1 - 20);
          g.lineTo(x2, y2 - 20);
        }
        g.stroke();
      }

      // Archetype symbol on chest
      if (showArchetypeSymbol && renderMode !== "preview") {
        g.fill({ color: archetypeColors.primary, alpha: 0.7 });
        g.circle(0, -5, 8);
        g.fill();
      }

      // Facing direction indicator
      if (facing !== "forward") {
        g.scale.x = facing === "left" ? -1 : 1;
      }

      // Animation-specific effects
      if (animationState === "technique_execute") {
        const pulseScale = 1 + Math.sin(animationTime * 10) * 0.1;
        g.scale.set(pulseScale);
      }

      if (animationState === "hit") {
        g.tint = KOREAN_COLORS.ACCENT_RED;
        g.alpha = 0.7 + Math.sin(animationTime * 15) * 0.3;
      }
    },
    [
      archetypeColors,
      playerState,
      visualStates,
      animationState,
      renderMode,
      facing,
      showKiAura,
      showArchetypeSymbol,
      stanceModifications,
      animationTime,
    ]
  );

  // Vital points for training mode
  const drawVitalPoints = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      if (!showVitalPoints || renderMode !== "training") return;

      VITAL_POINTS.forEach((point) => {
        const isHighlighted = highlightedVitalPoints.includes(point.id);
        const alpha = isHighlighted ? 0.9 : 0.6;
        const radius = isHighlighted ? 6 : 4;

        // Difficulty-based colors
        const difficultyColors = {
          1: KOREAN_COLORS.POSITIVE_GREEN,
          2: KOREAN_COLORS.ACCENT_CYAN,
          3: KOREAN_COLORS.WARNING_YELLOW,
          4: KOREAN_COLORS.ACCENT_GOLD,
          5: KOREAN_COLORS.ACCENT_RED,
        };

        const pointColor =
          difficultyColors[point.difficulty as keyof typeof difficultyColors];

        g.fill({ color: pointColor, alpha });
        g.circle(point.x, point.y, radius);
        g.fill();

        // Pulsing effect for highlighted points
        if (isHighlighted) {
          const pulseRadius = radius + Math.sin(animationTime * 4) * 2;
          g.stroke({ width: 2, color: pointColor, alpha: 0.8 });
          g.circle(point.x, point.y, pulseRadius);
          g.stroke();
        }
      });
    },
    [showVitalPoints, renderMode, highlightedVitalPoints, animationTime]
  );

  // Status effects visualization
  const drawStatusEffects = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      if (!showStatusEffectVisuals || playerState.statusEffects.length === 0)
        return;

      playerState.statusEffects.forEach((effect, index) => {
        const effectX = -30 + index * 15;
        const effectY = -70;

        let effectColor: number;
        switch (effect.type) {
          case "poison":
            effectColor = KOREAN_COLORS.POSITIVE_GREEN;
            break;
          case "burn":
            effectColor = KOREAN_COLORS.ACCENT_RED;
            break;
          case "stun":
            effectColor = KOREAN_COLORS.WARNING_YELLOW;
            break;
          case "strengthened":
            effectColor = KOREAN_COLORS.ACCENT_GOLD;
            break;
          case "weakened":
            effectColor = KOREAN_COLORS.UI_GRAY;
            break;
          default:
            effectColor = KOREAN_COLORS.NEUTRAL_GRAY;
            break;
        }

        const pulseAlpha = 0.7 + Math.sin(animationTime * 3 + index) * 0.3;
        g.fill({ color: effectColor, alpha: pulseAlpha });
        g.circle(effectX, effectY, 5);
        g.fill();
      });
    },
    [showStatusEffectVisuals, playerState.statusEffects, animationTime]
  );

  // Stance indicator
  const drawStanceIndicator = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      if (!showStanceIndicator || renderMode === "preview") return;

      const stanceY = renderMode === "training" ? 80 : 70;

      // Stance circle background
      g.fill({ color: archetypeColors.primary, alpha: 0.3 });
      g.circle(0, stanceY, 15);
      g.fill();

      g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
      g.circle(0, stanceY, 15);
      g.stroke();
    },
    [showStanceIndicator, renderMode, archetypeColors]
  );

  // Health bar for combat context
  const drawContextualHealthBar = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      if (!showDetails || renderMode === "preview") return;

      const barY = renderMode === "training" ? -85 : -75;
      const barWidth = renderMode === "training" ? 60 : 50;
      const barHeight = 6;

      // Background
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
      g.roundRect(-barWidth / 2, barY, barWidth, barHeight, 2);
      g.fill();

      // Health fill
      const healthWidth = barWidth * visualStates.healthPercent;
      const healthColor = visualStates.isLowHealth
        ? KOREAN_COLORS.ACCENT_RED
        : KOREAN_COLORS.POSITIVE_GREEN;

      g.fill({ color: healthColor, alpha: 0.9 });
      g.roundRect(-barWidth / 2, barY, healthWidth, barHeight, 2);
      g.fill();
    },
    [showDetails, renderMode, visualStates]
  );

  // Handle vital point clicks
  const handleVitalPointClick = useCallback(
    (event: PIXI.FederatedPointerEvent) => {
      if (!showVitalPoints || !onVitalPointClick) return;

      const localPos = event.getLocalPosition(event.currentTarget);

      // Find clicked vital point
      const clickedPoint = VITAL_POINTS.find((point) => {
        const distance = Math.sqrt(
          Math.pow(localPos.x - point.x, 2) + Math.pow(localPos.y - point.y, 2)
        );
        return distance <= 10; // Click tolerance
      });

      if (clickedPoint) {
        onVitalPointClick(clickedPoint.id);
      }
    },
    [showVitalPoints, onVitalPointClick]
  );

  // Text styles
  const nameTextStyle = useMemo(
    () => ({
      fontSize: renderMode === "training" ? 14 : 12,
      fill: KOREAN_COLORS.TEXT_PRIMARY,
      fontFamily: FONT_FAMILY.KOREAN,
      align: "center" as const,
      fontWeight: "bold" as const,
    }),
    [renderMode]
  );

  const stanceTextStyle = useMemo(
    () => ({
      fontSize: renderMode === "training" ? 12 : 10,
      fill: KOREAN_COLORS.ACCENT_GOLD,
      fontFamily: FONT_FAMILY.KOREAN,
      align: "center" as const,
    }),
    [renderMode]
  );

  // Helper functions for Korean text
  const getStanceKoreanName = useCallback((stance: TrigramStance): string => {
    const stanceNames = {
      [TrigramStance.GEON]: "건괘", // Heaven
      [TrigramStance.TAE]: "태괘", // Lake
      [TrigramStance.LI]: "리괘", // Fire
      [TrigramStance.JIN]: "진괘", // Thunder
      [TrigramStance.SON]: "손괘", // Wind
      [TrigramStance.GAM]: "감괘", // Water
      [TrigramStance.GAN]: "간괘", // Mountain
      [TrigramStance.GON]: "곤괘", // Earth
    };
    return stanceNames[stance] || "알 수 없음";
  }, []);

  const getStanceEnglishName = useCallback((stance: TrigramStance): string => {
    const stanceNames = {
      [TrigramStance.GEON]: "Heaven Stance",
      [TrigramStance.TAE]: "Lake Stance",
      [TrigramStance.LI]: "Fire Stance",
      [TrigramStance.JIN]: "Thunder Stance",
      [TrigramStance.SON]: "Wind Stance",
      [TrigramStance.GAM]: "Water Stance",
      [TrigramStance.GAN]: "Mountain Stance",
      [TrigramStance.GON]: "Earth Stance",
    };
    return stanceNames[stance] || "Unknown";
  }, []);

  return (
    <pixiContainer
      x={x}
      y={y}
      scale={scale}
      interactive={interactive}
      onPointerDown={onPlayerClick}
      data-testid={`player-visuals-${renderMode}`}
    >
      {/* Main player body */}
      <pixiGraphics draw={drawPlayerBody} />

      {/* Vital points (training mode) */}
      <pixiGraphics
        draw={drawVitalPoints}
        interactive={showVitalPoints}
        onPointerDown={handleVitalPointClick}
        data-testid="vital-points-layer"
      />

      {/* Status effects */}
      <pixiGraphics draw={drawStatusEffects} />

      {/* Stance indicator */}
      <pixiGraphics draw={drawStanceIndicator} />

      {/* Contextual health bar */}
      <pixiGraphics draw={drawContextualHealthBar} />

      {/* Player name (Korean) */}
      {showDetails && (
        <pixiText
          text={playerState.name.korean}
          style={nameTextStyle}
          x={0}
          y={renderMode === "training" ? -105 : -95}
          anchor={0.5}
          data-testid="player-name"
        />
      )}

      {/* Player name (English) */}
      {showDetails && !showKoreanLabels && (
        <pixiText
          text={playerState.name.english}
          style={{
            ...nameTextStyle,
            fontSize: renderMode === "training" ? 12 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          x={0}
          y={renderMode === "training" ? -90 : -80}
          anchor={0.5}
          data-testid="player-name-english"
        />
      )}

      {/* Archetype name */}
      {showDetails && renderMode === "training" && (
        <pixiText
          text={archetypeData.name.korean}
          style={{
            fontSize: 10,
            fill: archetypeColors.primary,
            fontFamily: FONT_FAMILY.KOREAN,
            align: "center" as const,
          }}
          x={0}
          y={-90}
          anchor={0.5}
          data-testid="player-archetype"
        />
      )}

      {/* Current stance text */}
      {showStanceIndicator && (
        <pixiText
          text={
            showKoreanLabels
              ? getStanceKoreanName(playerState.currentStance)
              : `${getStanceEnglishName(playerState.currentStance)}`
          }
          style={stanceTextStyle}
          x={0}
          y={renderMode === "training" ? 105 : 90}
          anchor={0.5}
          data-testid="player-stance-text"
        />
      )}

      {/* Combat state text */}
      {(playerState.isBlocking ||
        playerState.isStunned ||
        playerState.isCountering) && (
        <pixiText
          text={
            playerState.isBlocking
              ? "방어"
              : playerState.isStunned
              ? "기절"
              : playerState.isCountering
              ? "반격"
              : ""
          }
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.WARNING_YELLOW,
            fontFamily: FONT_FAMILY.KOREAN,
            align: "center" as const,
            fontWeight: "bold" as const,
          }}
          x={0}
          y={20}
          anchor={0.5}
          data-testid="combat-state-text"
        />
      )}

      {/* Consciousness indicator */}
      {playerState.consciousness <= 0 && (
        <pixiText
          text="의식잃음"
          style={{
            fontSize: 14,
            fill: KOREAN_COLORS.NEGATIVE_RED,
            fontFamily: FONT_FAMILY.KOREAN,
            align: "center" as const,
            fontWeight: "bold" as const,
          }}
          x={0}
          y={0}
          anchor={0.5}
          data-testid="unconscious-indicator"
        />
      )}

      {/* Trigram symbol */}
      {showDetails && (
        <pixiText
          text={getTrigramSymbol(playerState.currentStance)}
          style={
            new PIXI.TextStyle({
              fontSize: 16,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              align: "center",
              fontWeight: "bold",
            })
          }
          anchor={0.5}
          x={0}
          y={80}
          data-testid="trigram-symbol"
        />
      )}
    </pixiContainer>
  );
};

export default PlayerVisuals;
