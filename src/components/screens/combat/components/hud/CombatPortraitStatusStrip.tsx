/**
 * CombatPortraitStatusStrip - Compact two-player HP/stamina strip for portrait mobile.
 *
 * When the viewport is portrait mobile we hide `CombatLeftHUD` and
 * `CombatRightHUD` (they occlude the 3D arena on narrow screens). This strip
 * replaces them with a minimal, **always visible** health+stamina bar for
 * both players, rendered as a single horizontal band directly under the
 * top HUD.
 *
 * UX goals (game-UI best practice for narrow portrait):
 * - Both bars fit on a single row on viewports as narrow as 320 px.
 * - Clear left/right grouping (P1 on the left, P2 on the right) mirrors the
 *   fighters' on-screen positions.
 * - Low visual weight (no side HUD backgrounds, no icons) so the strip does
 *   not re-introduce the occlusion problem it was meant to solve.
 * - Korean + English bilingual micro-labels (체 / ST).
 *
 * 세로 모드 휴대폰 전용 상/하단 상태 바
 *
 * @module components/screens/combat/components/hud/CombatPortraitStatusStrip
 */

import React, { useMemo } from "react";
import { PlayerState } from "../../../../../systems";
import {
  BORDERS,
  FONT_SIZE_MULTIPLIERS,
  GRADIENTS,
  HIERARCHY,
  HUD_STYLE,
  TYPOGRAPHY,
  TYPOGRAPHY_NUMERIC,
} from "../../../../../types/constants/designSystem";
import { KOREAN_COLORS } from "../../../../../types/constants/colors";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import {
  getResponsiveFontSize,
  getResponsivePadding,
} from "../../../../../utils/responsiveLayout";

export interface CombatPortraitStatusStripProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Player 1 state */
  readonly player1: PlayerState;
  /** Player 2 (AI) state */
  readonly player2: PlayerState;
  /** Position scale multiplier for large displays */
  readonly positionScale: number;
  /** Y offset from top of screen (should equal top HUD height) */
  readonly topOffset: number;
}

/** Single compact HP + stamina pill for one fighter. */
const PlayerPill: React.FC<{
  readonly player: PlayerState;
  readonly side: "left" | "right";
  readonly fontSize: number;
  readonly barHeight: number;
  readonly testId: string;
}> = ({ player, side, fontSize, barHeight, testId }) => {
  const healthPercent = Math.max(
    0,
    Math.min(100, (player.health / player.maxHealth) * 100),
  );
  const staminaPercent = Math.max(
    0,
    Math.min(100, (player.stamina / player.maxStamina) * 100),
  );

  const healthColor =
    healthPercent > 50
      ? KOREAN_COLORS.HEALTH_FULL
      : healthPercent > 25
        ? KOREAN_COLORS.HEALTH_MEDIUM
        : KOREAN_COLORS.HEALTH_LOW;

  return (
    <div
      data-testid={testId}
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: side === "left" ? "flex-start" : "flex-end",
        gap: "2px",
        minWidth: 0,
      }}
    >
      {/* Name + side indicator */}
      <div
        style={{
          fontSize: `${fontSize}px`,
          color: HIERARCHY.accent.color,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
      >
        {side === "left" ? "P1" : "P2"}
      </div>
      {/* HP bar */}
      <div
        role="progressbar"
        aria-label={`Player ${side === "left" ? 1 : 2} health`}
        aria-valuenow={Math.max(
          0,
          Math.min(player.maxHealth, Math.ceil(player.health)),
        )}
        aria-valuemin={0}
        aria-valuemax={player.maxHealth}
        style={{
          width: "100%",
          height: `${barHeight}px`,
          backgroundColor: hexToRgbaString(
            KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
            1,
          ),
          borderRadius: "2px",
          overflow: "hidden",
          border: `1px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.5)}`,
        }}
      >
        <div
          data-testid={`${testId}-hp-fill`}
          style={{
            width: `${healthPercent}%`,
            height: "100%",
            backgroundColor: hexToRgbaString(healthColor, 1),
            transition: "width 0.2s ease-out, background-color 0.3s ease-out",
          }}
        />
      </div>
      {/* Stamina bar (thinner) */}
      <div
        role="progressbar"
        aria-label={`Player ${side === "left" ? 1 : 2} stamina`}
        aria-valuenow={Math.max(
          0,
          Math.min(player.maxStamina, Math.ceil(player.stamina)),
        )}
        aria-valuemin={0}
        aria-valuemax={player.maxStamina}
        style={{
          width: "100%",
          height: `${Math.max(3, Math.floor(barHeight * 0.5))}px`,
          backgroundColor: hexToRgbaString(
            KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
            1,
          ),
          borderRadius: "2px",
          overflow: "hidden",
          border: `1px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.4)}`,
        }}
      >
        <div
          data-testid={`${testId}-sp-fill`}
          style={{
            width: `${staminaPercent}%`,
            height: "100%",
            backgroundColor: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
            transition: "width 0.2s ease-out",
          }}
        />
      </div>
    </div>
  );
};

/**
 * Compact two-player HP/stamina strip, only rendered for portrait mobile.
 */
export const CombatPortraitStatusStrip: React.FC<
  CombatPortraitStatusStripProps
> = ({ width, height, player1, player2, positionScale, topOffset }) => {
  const layout = useMemo(() => {
    // Tighter strip on extra-small phones (<380 px) so the arena retains
    // usable vertical space.
    const isExtraSmall = width < 380;
    const minStripHeight = isExtraSmall ? 28 : 36;
    const stripHeight = Math.max(
      minStripHeight,
      Math.round(height * 0.055 * positionScale),
    );
    const padding = getResponsivePadding(width) * positionScale;
    const fontSize = Math.max(
      TYPOGRAPHY_NUMERIC.caption,
      getResponsiveFontSize(width) *
        positionScale *
        FONT_SIZE_MULTIPLIERS.bodySmall,
    );
    // Reserve a narrow center gap between the two pills.
    const centerGap = Math.max(6, padding);
    const barHeight = Math.max(6, Math.floor(stripHeight * 0.28));

    return { stripHeight, padding, fontSize, centerGap, barHeight };
  }, [width, height, positionScale]);

  return (
    <div
      data-testid="combat-portrait-status-strip"
      style={{
        position: "absolute",
        top: `${topOffset}px`,
        left: 0,
        width: "100%",
        height: `${layout.stripHeight}px`,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: `${layout.centerGap}px`,
        padding: `4px ${layout.padding}px`,
        pointerEvents: "none",
        boxSizing: "border-box",
        borderBottom: BORDERS.muted,
        background: GRADIENTS.vertical(0.85),
        backdropFilter: HUD_STYLE.backdropFilter,
      }}
    >
      <PlayerPill
        player={player1}
        side="left"
        fontSize={layout.fontSize}
        barHeight={layout.barHeight}
        testId="combat-portrait-p1"
      />
      <PlayerPill
        player={player2}
        side="right"
        fontSize={layout.fontSize}
        barHeight={layout.barHeight}
        testId="combat-portrait-p2"
      />
    </div>
  );
};

export default CombatPortraitStatusStrip;
