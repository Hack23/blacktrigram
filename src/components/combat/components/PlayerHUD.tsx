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
 */

import React, { useMemo } from "react";
import { PlayerState } from "../../../systems/player";
import {
  ARCHETYPE_ASSETS,
  FALLBACK_ARCHETYPE_IMAGE,
  FONT_FAMILY,
  KOREAN_COLORS,
} from "../../../types/constants";
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
 */
export const PlayerHUD: React.FC<PlayerHUDProps> = ({
  player,
  position,
  isMobile,
}) => {
  const playerId = player.id;
  const isLeft = position === "left";

  // Responsive sizing
  const fontSize = isMobile ? 11 : 13;
  const gap = isMobile ? "6px" : "8px";
  const iconSize = isMobile ? 40 : 50;

  // Get archetype image path
  const archetypeImagePath = useMemo(() => {
    const archetypeKey = player.archetype.toLowerCase();
    const assets =
      ARCHETYPE_ASSETS[archetypeKey as keyof typeof ARCHETYPE_ASSETS];
    return assets?.image ?? FALLBACK_ARCHETYPE_IMAGE;
  }, [player.archetype]);

  return (
    <div
      data-testid={`player-hud-${playerId}`}
      style={{
        position: "absolute",
        top: isMobile ? "8px" : "10px",
        left: isLeft ? (isMobile ? "8px" : "12px") : "auto",
        right: isLeft ? "auto" : isMobile ? "8px" : "12px",
        display: "flex",
        flexDirection: "column",
        gap,
        pointerEvents: "none",
        zIndex: 100,
        maxWidth: isMobile ? "220px" : "300px",
      }}
    >
      {/* Player Name with Archetype Icon */}
      <div
        data-testid={`player-name-${playerId}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexDirection: isLeft ? "row" : "row-reverse",
        }}
      >
        {/* Archetype Icon */}
        <div
          data-testid={`archetype-icon-${playerId}`}
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
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
          }}
        >
          <img
            src={archetypeImagePath}
            alt={`${player.name.english} archetype`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.endsWith(FALLBACK_ARCHETYPE_IMAGE)) {
                target.src = FALLBACK_ARCHETYPE_IMAGE;
              }
            }}
          />
        </div>
        {/* Player Name */}
        <div
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
            color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
            textAlign: isLeft ? "left" : "right",
            textShadow: "0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
            padding: "2px 6px",
            background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.7),
            borderRadius: "4px",
            whiteSpace: "nowrap",
          }}
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
        style={{
          fontSize: isMobile ? "10px" : "12px",
          fontFamily: FONT_FAMILY.KOREAN,
          color: hexToRgbaString(KOREAN_COLORS.ACCENT_CYAN, 1),
          textAlign: isLeft ? "left" : "right",
          textShadow: "0 0 4px rgba(0,0,0,0.8)",
          padding: "4px 8px",
          backgroundColor: hexToRgbaString(
            KOREAN_COLORS.UI_BACKGROUND_DARK,
            0.8
          ),
          borderRadius: "4px",
          marginTop: "2px",
        }}
      >
        자세 | Stance: {player.currentStance}
      </div>
    </div>
  );
};

export default PlayerHUD;
