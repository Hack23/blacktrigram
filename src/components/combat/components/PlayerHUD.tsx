/**
 * PlayerHUD Component - Combined health and stamina display
 * 
 * Displays a complete player HUD with:
 * - Player name (Korean/English)
 * - Health bar (segmented, color-coded)
 * - Stamina bar (segmented, cyan-themed)
 * - Current stance indicator
 * - Responsive positioning (top-left for player 1, top-right for player 2)
 */

import React from "react";
import { PlayerState } from "../../../systems/player";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";
import { HealthBar } from "./HealthBar";
import { StaminaBar } from "./StaminaBar";

export interface PlayerHUDProps {
  /** Player state with health, stamina, and other data */
  readonly player: PlayerState;
  /** Player position: 'left' for player 1, 'right' for player 2 */
  readonly position: "left" | "right";
  /** Whether to use mobile-optimized sizing */
  readonly isMobile: boolean;
}

/**
 * Convert hex color to CSS RGB string
 */
const hexToRgb = (hex: number): string => {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return `rgb(${r}, ${g}, ${b})`;
};

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
  const fontSize = isMobile ? 12 : 14;
  const gap = isMobile ? "6px" : "8px";

  return (
    <div
      data-testid={`player-hud-${playerId}`}
      style={{
        position: "absolute",
        top: isMobile ? "10px" : "15px",
        left: isLeft ? (isMobile ? "10px" : "15px") : "auto",
        right: isLeft ? "auto" : (isMobile ? "10px" : "15px"),
        display: "flex",
        flexDirection: "column",
        gap,
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {/* Player Name */}
      <div
        data-testid={`player-name-${playerId}`}
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: "bold",
          fontFamily: FONT_FAMILY.KOREAN,
          color: hexToRgb(KOREAN_COLORS.ACCENT_GOLD),
          textAlign: isLeft ? "left" : "right",
          textShadow: `0 0 8px ${hexToRgb(KOREAN_COLORS.ACCENT_GOLD)}66`,
          marginBottom: "2px",
        }}
      >
        {player.name.korean} | {player.name.english}
      </div>

      {/* Health Bar */}
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

      {/* Current Stance Indicator */}
      <div
        data-testid={`stance-indicator-${playerId}`}
        style={{
          fontSize: isMobile ? "10px" : "11px",
          fontFamily: FONT_FAMILY.KOREAN,
          color: hexToRgb(KOREAN_COLORS.TEXT_SECONDARY),
          textAlign: isLeft ? "left" : "right",
          marginTop: "2px",
        }}
      >
        자세 | Stance: {player.currentStance}
      </div>
    </div>
  );
};

export default PlayerHUD;
