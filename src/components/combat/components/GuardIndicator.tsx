/**
 * GuardIndicator - Visual indicator showing current fighting stance guard position
 * Displays Korean traditional stance name, English translation, and guard characteristics
 * 
 * @module components/combat/components/GuardIndicator
 * @category Combat UI
 * @korean 방어자세표시기
 */

import React, { useMemo } from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { Z_INDEX } from "../../../types/LayoutTypes";
import { TrigramStance } from "../../../types/common";
import { STANCE_GUARD_CONFIGS } from "../../../systems/animation/StanceGuardPoses";
import { TRIGRAM_DATA } from "../../../systems/trigram/types";

/**
 * Props for GuardIndicator component
 */
export interface GuardIndicatorProps {
  /** Current trigram stance */
  readonly currentStance: TrigramStance;
  /** Whether player is in guard animation state */
  readonly isInGuard: boolean;
  /** Player position: 'left' for player 1, 'right' for player 2 */
  readonly position: "left" | "right";
  /** Whether to use mobile-optimized sizing */
  readonly isMobile?: boolean;
}

/**
 * Get guard height label based on arm positions
 */
function getGuardHeight(stance: TrigramStance): {
  korean: string;
  english: string;
} {
  const config = STANCE_GUARD_CONFIGS[stance];
  const shoulderY = config.guardPose.leftArm.shoulder.x; // x is vertical in Euler

  if (shoulderY < -0.4) {
    return { korean: "고위", english: "High" };
  } else if (shoulderY < -0.2) {
    return { korean: "중위", english: "Mid" };
  } else {
    return { korean: "저위", english: "Low" };
  }
}

/**
 * Get traditional Korean stance name from guard config
 */
function getTraditionalStanceName(stance: TrigramStance): {
  korean: string;
  romanized: string;
} {
  const stanceNames: Record<TrigramStance, { korean: string; romanized: string }> = {
    [TrigramStance.GEON]: { korean: "앞서기", romanized: "Ap Seogi" },
    [TrigramStance.TAE]: { korean: "앞굽이", romanized: "Ap Koobi" },
    [TrigramStance.LI]: { korean: "주춤", romanized: "Juchum Seogi" },
    [TrigramStance.JIN]: { korean: "뒤굽이", romanized: "Dwi Koobi" },
    [TrigramStance.SON]: { korean: "범서기", romanized: "Beom Seogi" },
    [TrigramStance.GAM]: { korean: "학다리", romanized: "Hak Dari Seogi" },
    [TrigramStance.GAN]: { korean: "모아서기", romanized: "Moa Seogi" },
    [TrigramStance.GON]: { korean: "중하", romanized: "Joong Ha Seogi" },
  };
  return stanceNames[stance];
}

/**
 * Get weight distribution icon
 */
function getWeightIcon(weight: "forward" | "neutral" | "back"): string {
  switch (weight) {
    case "forward":
      return "▲"; // Forward lean
    case "back":
      return "▼"; // Back lean
    case "neutral":
      return "●"; // Centered
  }
}

/**
 * GuardIndicator Component
 * 
 * Displays current guard position information with Korean martial arts terminology.
 * Shows only when player is in a stance guard animation state.
 * 
 * Features:
 * - Traditional Korean stance name (앞서기, 앞굽이, etc.)
 * - Romanized pronunciation
 * - Guard height indicator (High/Mid/Low)
 * - Weight distribution visualization
 * - Korean cyberpunk styling with glow effects
 * - Responsive mobile layout
 * - Accessible with proper ARIA labels
 * 
 * @example
 * ```tsx
 * <GuardIndicator
 *   currentStance={TrigramStance.GEON}
 *   isInGuard={true}
 *   position="left"
 *   isMobile={false}
 * />
 * ```
 * 
 * @public
 * @korean 방어자세표시기
 */
export const GuardIndicator: React.FC<GuardIndicatorProps> = ({
  currentStance,
  isInGuard,
  position,
  isMobile = false,
}) => {
  const isLeft = position === "left";

  // Get guard configuration
  const config = useMemo(
    () => STANCE_GUARD_CONFIGS[currentStance],
    [currentStance]
  );

  const trigramData = useMemo(
    () => TRIGRAM_DATA[currentStance],
    [currentStance]
  );

  const stanceName = useMemo(
    () => getTraditionalStanceName(currentStance),
    [currentStance]
  );

  const guardHeight = useMemo(
    () => getGuardHeight(currentStance),
    [currentStance]
  );

  const weightIcon = useMemo(
    () => getWeightIcon(config.guardPose.weight),
    [config.guardPose.weight]
  );

  // Memoize responsive sizing
  const layout = useMemo(() => ({
    fontSize: isMobile ? 10 : 12,
    titleSize: isMobile ? 13 : 16,
    iconSize: isMobile ? 14 : 18,
    padding: isMobile ? "6px 10px" : "8px 12px",
    gap: isMobile ? "3px" : "4px",
    bottom: isMobile ? "45px" : "60px",
    horizontal: isMobile ? "8px" : "12px",
  }), [isMobile]);

  // Container style with responsive positioning
  const containerStyle = useMemo(() => ({
    position: "absolute" as const,
    bottom: layout.bottom,
    left: isLeft ? layout.horizontal : "auto",
    right: isLeft ? "auto" : layout.horizontal,
    display: "flex",
    flexDirection: "column" as const,
    gap: layout.gap,
    backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.85),
    border: `1px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6)}`,
    borderRadius: "6px",
    padding: layout.padding,
    pointerEvents: "none" as const,
    zIndex: Z_INDEX.HUD,
    minWidth: isMobile ? "140px" : "180px",
    boxShadow: `0 0 15px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3)}`,
  }), [layout, isLeft, isMobile]);

  // Don't render if not in guard state
  if (!isInGuard) return null;

  return (
    <div
      data-testid="guard-indicator"
      role="status"
      aria-live="polite"
      aria-label={`Guard position: ${stanceName.romanized}, ${guardHeight.english} guard, ${config.guardPose.weight} weight`}
      style={containerStyle}
    >
      {/* Title: GUARD with trigram symbol */}
      <div
        style={{
          fontSize: layout.titleSize,
          color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
          fontWeight: "bold",
          textAlign: "center",
          textShadow: `0 0 10px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.6)}`,
          borderBottom: `1px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.4)}`,
          paddingBottom: layout.gap,
        }}
      >
        {trigramData.symbol} GUARD
      </div>

      {/* Traditional stance name (Korean) */}
      <div
        style={{
          fontSize: layout.fontSize,
          color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
          textAlign: "center",
          fontWeight: "600",
        }}
      >
        {stanceName.korean}
      </div>

      {/* Romanized name */}
      <div
        style={{
          fontSize: layout.fontSize,
          color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.8),
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        {stanceName.romanized}
      </div>

      {/* Guard characteristics row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: layout.gap,
          paddingTop: layout.gap,
          borderTop: `1px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3)}`,
        }}
      >
        {/* Guard height */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: layout.iconSize,
              color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
            }}
          >
            ⚔️
          </div>
          <div
            style={{
              fontSize: layout.fontSize - 1,
              color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.9),
            }}
          >
            {guardHeight.korean}
          </div>
          <div
            style={{
              fontSize: layout.fontSize - 2,
              color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.6),
            }}
          >
            {guardHeight.english}
          </div>
        </div>

        {/* Weight distribution */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: layout.iconSize,
              color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
            }}
          >
            {weightIcon}
          </div>
          <div
            style={{
              fontSize: layout.fontSize - 1,
              color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.9),
            }}
          >
            {config.guardPose.weight === "forward" && "전방"}
            {config.guardPose.weight === "neutral" && "중립"}
            {config.guardPose.weight === "back" && "후방"}
          </div>
          <div
            style={{
              fontSize: layout.fontSize - 2,
              color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.6),
              textTransform: "capitalize" as const,
            }}
          >
            {config.guardPose.weight}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Memoized GuardIndicator to prevent unnecessary re-renders
 */
export default React.memo(GuardIndicator);
