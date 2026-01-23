/**
 * CombatRightHUD - Right side HUD for combat screen (Player 2 / AI)
 *
 * Contains:
 * - Player 2 / AI health/ki/stamina bars
 * - Stance indicator
 * - Guard indicator
 * - Speed indicator
 * - AI Difficulty indicator
 * - Body part health (optional)
 *
 * Gaming Layout Best Practice:
 * - Width: 14% of screen (mobile: 18%)
 * - Height: 100% minus top/bottom HUD heights
 * - Leaves 72% center for arena
 *
 * @korean 전투화면 오른쪽 HUD - 플레이어 2 / AI 상태
 */

import React from "react";
import { PlayerState } from "../../../../../systems";
import { DifficultyTier } from "../../../../../systems/ai";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
import { GuardIndicator } from "../../../../shared/three/indicators/GuardIndicator";

/** HUD width - slightly narrower for more arena space */
const HUD_WIDTH_PERCENT_DESKTOP = 14;
const HUD_WIDTH_PERCENT_MOBILE = 18;

/** Top/Bottom bar heights (must match those components) */
const TOP_HUD_HEIGHT_DESKTOP = 70;
const TOP_HUD_HEIGHT_MOBILE = 55;
const BOTTOM_HUD_HEIGHT_DESKTOP = 120;
const BOTTOM_HUD_HEIGHT_MOBILE = 100;

export interface CombatRightHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Whether mobile layout is active */
  readonly isMobile: boolean;
  /** Position scale multiplier for large displays */
  readonly positionScale: number;
  /** Player 2 state */
  readonly player: PlayerState;
  /** Whether player is in guard stance */
  readonly isInGuard: boolean;
  /** Player speed modifiers */
  readonly speedModifiers: {
    finalSpeed: number;
    baseSpeed: number;
  };
  /** Current AI difficulty tier */
  readonly difficultyTier: DifficultyTier;
}

/**
 * CombatRightHUD Component
 *
 * Right side of the combat screen containing Player 2 / AI stats.
 * Takes 14% of screen width (18% on mobile), positioned between top and bottom HUDs.
 */
export const CombatRightHUD: React.FC<CombatRightHUDProps> = ({
  width,
  height,
  isMobile,
  positionScale,
  player,
  isInGuard,
  speedModifiers,
  difficultyTier,
}) => {
  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile,
  });

  // Layout calculations for right HUD with proper gaming proportions
  const layout = React.useMemo(() => {
    // Width: 14-18% of screen
    const hudWidthPercent = isMobile
      ? HUD_WIDTH_PERCENT_MOBILE
      : HUD_WIDTH_PERCENT_DESKTOP;
    const hudWidth = Math.round((width * hudWidthPercent) / 100);

    // Scale factors for 4K (positionScale: 1.0-1.5)
    const scaledTopHeight = isMobile
      ? TOP_HUD_HEIGHT_MOBILE
      : TOP_HUD_HEIGHT_DESKTOP * positionScale;
    const scaledBottomHeight = isMobile
      ? BOTTOM_HUD_HEIGHT_MOBILE
      : BOTTOM_HUD_HEIGHT_DESKTOP * positionScale;

    // Calculate available height between top and bottom HUDs
    const topOffset = scaledTopHeight;
    const bottomOffset = scaledBottomHeight;
    const availableHeight = height - topOffset - bottomOffset;

    // Internal padding
    const padding = isMobile ? 8 : 12 * positionScale;
    const gap = isMobile ? 10 : 14 * positionScale;

    return {
      hudWidth,
      topOffset,
      bottomOffset,
      availableHeight,
      padding,
      gap,
    };
  }, [width, height, isMobile, positionScale]);

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: `${layout.topOffset}px`,
        width: `${layout.hudWidth}px`,
        height: `${layout.availableHeight}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        pointerEvents: "none",
        padding: `${layout.padding}px`,
        boxSizing: "border-box",
        gap: `${layout.gap}px`,
        // Cyberpunk border - left edge only for right HUD
        borderLeft: `2px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.4)}`,
        background: `linear-gradient(270deg, ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.85)} 0%, ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.4)} 100%)`,
        backdropFilter: "blur(8px)",
      }}
      data-testid="combat-right-hud"
    >
      {/* Player 2 Stats - simple embedded layout */}
      <div
        style={{
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          gap: `${layout.gap}px`,
        }}
        data-testid="combat-right-hud-player-section"
      >
        {/* Player Name */}
        <div
          style={{
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: "bold",
            fontFamily: theme.koreanTypography.fontFamily,
            color: hexToRgbaString(theme.colors.PRIMARY_RED, 1),
            textAlign: "center",
            textShadow: `0 0 5px ${hexToRgbaString(theme.colors.PRIMARY_RED, 0.5)}`,
          }}
        >
          {player.name.korean} | {player.name.english}
        </div>

        {/* Health Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div
            style={{
              fontSize: isMobile ? "9px" : "10px",
              color: hexToRgbaString(theme.colors.TEXT_SECONDARY, 0.8),
              textAlign: "right",
            }}
          >
            체력 | Health
          </div>
          <div
            style={{
              height: isMobile ? "8px" : "10px",
              background: hexToRgbaString(
                theme.colors.UI_BACKGROUND_MEDIUM,
                0.8,
              ),
              borderRadius: "4px",
              overflow: "hidden",
              border: `1px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.4)}`,
            }}
          >
            <div
              style={{
                width: `${(player.health / player.maxHealth) * 100}%`,
                height: "100%",
                marginLeft: "auto",
                background: `linear-gradient(270deg, ${hexToRgbaString(theme.colors.PRIMARY_RED, 1)} 0%, ${hexToRgbaString(theme.colors.SECONDARY_ORANGE, 1)} 100%)`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Stamina Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div
            style={{
              fontSize: isMobile ? "9px" : "10px",
              color: hexToRgbaString(theme.colors.TEXT_SECONDARY, 0.8),
              textAlign: "right",
            }}
          >
            기력 | Stamina
          </div>
          <div
            style={{
              height: isMobile ? "6px" : "8px",
              background: hexToRgbaString(
                theme.colors.UI_BACKGROUND_MEDIUM,
                0.8,
              ),
              borderRadius: "3px",
              overflow: "hidden",
              border: `1px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.3)}`,
            }}
          >
            <div
              style={{
                width: `${(player.stamina / player.maxStamina) * 100}%`,
                height: "100%",
                marginLeft: "auto",
                background: `linear-gradient(270deg, ${hexToRgbaString(theme.colors.ACCENT_GOLD, 1)} 0%, ${hexToRgbaString(theme.colors.SECONDARY_YELLOW, 1)} 100%)`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>

        {/* Ki Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <div
            style={{
              fontSize: isMobile ? "9px" : "10px",
              color: hexToRgbaString(theme.colors.TEXT_SECONDARY, 0.8),
              textAlign: "right",
            }}
          >
            기 | Ki
          </div>
          <div
            style={{
              height: isMobile ? "6px" : "8px",
              background: hexToRgbaString(
                theme.colors.UI_BACKGROUND_MEDIUM,
                0.8,
              ),
              borderRadius: "3px",
              overflow: "hidden",
              border: `1px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.3)}`,
            }}
          >
            <div
              style={{
                width: `${(player.ki / player.maxKi) * 100}%`,
                height: "100%",
                marginLeft: "auto",
                background: `linear-gradient(270deg, ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 1)} 0%, ${hexToRgbaString(theme.colors.ACCENT_BLUE, 1)} 100%)`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* AI Difficulty Indicator */}
      <div
        style={{ pointerEvents: "none" }}
        data-testid="combat-right-hud-difficulty-section"
      >
        <DifficultyIndicatorEmbedded
          tier={difficultyTier}
          isMobile={isMobile}
        />
      </div>

      {/* Speed Indicator - simplified */}
      <div
        style={{
          pointerEvents: "none",
          padding: isMobile ? "4px 6px" : "6px 8px",
          background: hexToRgbaString(theme.colors.UI_BACKGROUND_MEDIUM, 0.7),
          borderRadius: "4px",
          border: `1px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.3)}`,
          textAlign: "right",
        }}
        data-testid="combat-right-hud-speed-section"
      >
        <div
          style={{
            fontSize: isMobile ? "9px" : "10px",
            color: hexToRgbaString(theme.colors.TEXT_SECONDARY, 0.8),
          }}
        >
          속도 | Speed
        </div>
        <div
          style={{
            fontSize: isMobile ? "11px" : "13px",
            fontWeight: "bold",
            color:
              speedModifiers.finalSpeed >= speedModifiers.baseSpeed
                ? hexToRgbaString(theme.colors.ACCENT_GREEN, 1)
                : hexToRgbaString(theme.colors.PRIMARY_RED, 1),
          }}
        >
          {Math.round(
            (speedModifiers.finalSpeed / speedModifiers.baseSpeed) * 100,
          )}
          %
        </div>
      </div>

      {/* Guard Indicator - at bottom of HUD */}
      <div
        style={{
          pointerEvents: "none",
          marginTop: "auto",
        }}
        data-testid="combat-right-hud-guard-section"
      >
        <GuardIndicator
          currentStance={player.currentStance}
          isInGuard={isInGuard}
          position="right"
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

/**
 * Embedded version of DifficultyIndicator for use in HUD
 * Uses relative positioning instead of absolute
 */
const DifficultyIndicatorEmbedded: React.FC<{
  tier: DifficultyTier;
  isMobile: boolean;
}> = ({ tier, isMobile }) => {
  const theme = useKoreanTheme({ variant: "primary", size: "small", isMobile });

  const getTierName = (t: DifficultyTier) => {
    switch (t) {
      case DifficultyTier.BEGINNER:
        return { korean: "초보", english: "Beginner" };
      case DifficultyTier.NOVICE:
        return { korean: "입문", english: "Novice" };
      case DifficultyTier.INTERMEDIATE:
        return { korean: "중급", english: "Intermediate" };
      case DifficultyTier.ADVANCED:
        return { korean: "고급", english: "Advanced" };
      case DifficultyTier.EXPERT:
        return { korean: "전문", english: "Expert" };
      default:
        return { korean: "중급", english: "Intermediate" };
    }
  };

  const getTierColor = (t: DifficultyTier): number => {
    switch (t) {
      case DifficultyTier.BEGINNER:
        return theme.colors.POSITIVE_GREEN;
      case DifficultyTier.NOVICE:
        return theme.colors.ACCENT_GREEN;
      case DifficultyTier.INTERMEDIATE:
        return theme.colors.ACCENT_GOLD;
      case DifficultyTier.ADVANCED:
        return theme.colors.SECONDARY_ORANGE;
      case DifficultyTier.EXPERT:
        return theme.colors.NEGATIVE_RED;
      default:
        return theme.colors.ACCENT_GOLD;
    }
  };

  const tierName = getTierName(tier);
  const tierColor = getTierColor(tier);
  const colorCSS = `#${tierColor.toString(16).padStart(6, "0")}`;

  return (
    <div
      style={{
        padding: isMobile ? "4px 8px" : "6px 10px",
        background: hexToRgbaString(tierColor, 0.15),
        border: `2px solid ${colorCSS}`,
        borderRadius: "4px",
        fontFamily: theme.fontFamily.KOREAN,
        fontSize: isMobile ? "10px" : "12px",
        color: colorCSS,
        textAlign: "center",
        boxShadow: `0 0 8px ${hexToRgbaString(tierColor, 0.3)}`,
      }}
      data-testid="difficulty-indicator-embedded"
    >
      <div style={{ fontSize: isMobile ? "8px" : "9px", opacity: 0.8 }}>
        AI 난이도
      </div>
      <div style={{ fontWeight: "bold" }}>
        {tierName.korean} | {tierName.english}
      </div>
    </div>
  );
};

export default CombatRightHUD;
