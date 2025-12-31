/**
 * PlayerHUD Component - Combined combat readiness, health and stamina display
 *
 * Displays a complete player HUD with:
 * - Archetype icon/image
 * - Player name (Korean/English)
 * - Combat Readiness bar (10-segment, multi-factor)
 * - Health bar (segmented, color-coded)
 * - Stamina bar (segmented, cyan-themed)
 * - Current stance indicator
 * - Responsive positioning (top-left for player 1, top-right for player 2)
 * 
 * Performance optimized with React.memo for 60fps rendering.
 */

import React, { useMemo, useCallback } from "react";
import { PlayerState } from "../../../systems/player";
import {
  ARCHETYPE_ASSETS,
  FALLBACK_ARCHETYPE_IMAGE,
  FONT_FAMILY,
  KOREAN_COLORS,
} from "../../../types/constants";
import { Z_INDEX } from "../../../types/LayoutTypes";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { BreathingIndicator } from "./BreathingIndicator";
import { HealthBar } from "./HealthBar";
import { StaminaBar } from "./StaminaBar";
import { CombatReadinessBar } from "./CombatReadinessBar";

export interface PlayerHUDProps {
  /** Player state with health, stamina, and other data */
  readonly player: PlayerState;
  /** Player position: 'left' for player 1, 'right' for player 2 */
  readonly position: "left" | "right";
  /** Whether to use mobile-optimized sizing */
  readonly isMobile: boolean;
}

/**
 * PlayerHUD - Complete player status display with health and stamina bars
 * Performance optimized with React.memo
 */
const PlayerHUDComponent: React.FC<PlayerHUDProps> = ({
  player,
  position,
  isMobile,
}) => {
  const playerId = player.id;
  const isLeft = position === "left";

  // Memoize responsive sizing to avoid recalculation
  const layout = useMemo(() => ({
    fontSize: isMobile ? 11 : 13,
    gap: isMobile ? "6px" : "8px",
    iconSize: isMobile ? 40 : 50,
    top: isMobile ? "8px" : "10px",
    horizontal: isMobile ? "8px" : "12px",
  }), [isMobile]);

  // Get archetype image path (memoized)
  const archetypeImagePath = useMemo(() => {
    const archetypeKey = player.archetype.toLowerCase();
    const assets =
      ARCHETYPE_ASSETS[archetypeKey as keyof typeof ARCHETYPE_ASSETS];
    return assets?.image ?? FALLBACK_ARCHETYPE_IMAGE;
  }, [player.archetype]);

  // Memoize style objects to prevent recreating on every render
  const containerStyle = useMemo(() => ({
    position: "absolute" as const,
    top: layout.top,
    left: isLeft ? layout.horizontal : "auto",
    right: isLeft ? "auto" : layout.horizontal,
    display: "flex",
    flexDirection: "column" as const,
    gap: layout.gap,
    pointerEvents: "none" as const,
    zIndex: Z_INDEX.HUD,
    maxWidth: isMobile ? "220px" : "300px",
  }), [layout, isLeft, isMobile]);

  const iconContainerStyle = useMemo(() => {
    const direction = isLeft ? "row" : "row-reverse";
    return {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexDirection: direction as "row" | "row-reverse",
    };
  }, [isLeft]);

  const iconStyle = useMemo(() => ({
    width: `${layout.iconSize}px`,
    height: `${layout.iconSize}px`,
    borderRadius: "8px",
    overflow: "hidden",
    border: `2px solid ${hexToRgbaString(
      KOREAN_COLORS.ACCENT_GOLD,
      1
    )}`,
    boxShadow: `0 0 10px ${hexToRgbaString(
      KOREAN_COLORS.ACCENT_GOLD,
      0.5
    )}`,
    flexShrink: 0,
  }), [layout.iconSize]);

  const nameStyle = useMemo(() => {
    const textAlign = isLeft ? "left" : "right";
    return {
      fontSize: `${layout.fontSize}px`,
      fontWeight: "bold" as const,
      fontFamily: FONT_FAMILY.KOREAN,
      color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
      textAlign: textAlign as "left" | "right",
      textShadow: "0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
      padding: "2px 6px",
      background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.7),
      borderRadius: "4px",
      whiteSpace: "nowrap" as const,
    };
  }, [layout.fontSize, isLeft]);

  const stanceStyle = useMemo(() => {
    const textAlign = isLeft ? "left" : "right";
    return {
      fontSize: isMobile ? "10px" : "12px",
      fontFamily: FONT_FAMILY.KOREAN,
      color: hexToRgbaString(KOREAN_COLORS.ACCENT_CYAN, 1),
      textAlign: textAlign as "left" | "right",
      textShadow: "0 0 4px rgba(0,0,0,0.8)",
      padding: "4px 8px",
      backgroundColor: hexToRgbaString(
        KOREAN_COLORS.UI_BACKGROUND_DARK,
        0.8
      ),
      borderRadius: "4px",
      marginTop: "2px",
    };
  }, [isMobile, isLeft]);

  // Memoize error handler to prevent recreating on every render
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (!target.src.endsWith(FALLBACK_ARCHETYPE_IMAGE)) {
      target.src = FALLBACK_ARCHETYPE_IMAGE;
    }
  }, []);

  return (
    <div
      data-testid={`player-hud-${playerId}`}
      style={containerStyle}
    >
      {/* Player Name with Archetype Icon */}
      <div
        data-testid={`player-name-${playerId}`}
        style={iconContainerStyle}
      >
        {/* Archetype Icon */}
        <div
          data-testid={`archetype-icon-${playerId}`}
          style={iconStyle}
        >
          <img
            src={archetypeImagePath}
            alt={`${player.name.english} archetype`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={handleImageError}
          />
        </div>
        {/* Player Name */}
        <div
          style={nameStyle}
        >
          {player.name.korean} | {player.name.english}
        </div>
      </div>

      {/* Combat Readiness Bar - shows overall combat capability */}
      <CombatReadinessBar
        player={player}
        playerId={playerId}
        isMobile={isMobile}
      />

      {/* Health Bar - shows aggregate body health */}
      <HealthBar
        current={player.health}
        max={player.maxHealth}
        playerId={playerId}
        isMobile={isMobile}
      />

      {/* Stamina Bar */}
      <StaminaBar
        current={player.stamina}
        max={player.maxStamina}
        playerId={playerId}
        isMobile={isMobile}
      />

      {/* Breathing Disruption Indicator */}
      <BreathingIndicator player={player} isMobile={isMobile} />

      {/* Current Stance Indicator */}
      <div
        data-testid={`stance-indicator-${playerId}`}
        style={stanceStyle}
      >
        자세 | Stance: {player.currentStance}
      </div>
    </div>
  );
};

/**
 * Memoized PlayerHUD with custom comparison
 * Only re-renders when relevant props change
 */
export const PlayerHUD = React.memo(
  PlayerHUDComponent,
  (prevProps, nextProps) => {
    // Compare player state
    const healthSame = prevProps.player.health === nextProps.player.health;
    const staminaSame = prevProps.player.stamina === nextProps.player.stamina;
    const archetypeSame = prevProps.player.archetype === nextProps.player.archetype;
    const stanceSame = prevProps.player.currentStance === nextProps.player.currentStance;
    const idSame = prevProps.player.id === nextProps.player.id;
    const nameSame = 
      prevProps.player.name.korean === nextProps.player.name.korean &&
      prevProps.player.name.english === nextProps.player.name.english;
    
    // Compare statusEffects for BreathingIndicator updates
    const statusEffectsSame = 
      prevProps.player.statusEffects.length === nextProps.player.statusEffects.length &&
      prevProps.player.statusEffects.every((effect, index) => 
        effect === nextProps.player.statusEffects[index]
      );
    
    // Compare other props
    const positionSame = prevProps.position === nextProps.position;
    const mobileSame = prevProps.isMobile === nextProps.isMobile;

    // Return true if all relevant props are the same (skip re-render)
    return (
      healthSame &&
      staminaSame &&
      archetypeSame &&
      stanceSame &&
      idSame &&
      nameSame &&
      statusEffectsSame &&
      positionSame &&
      mobileSame
    );
  }
);

export default PlayerHUD;
