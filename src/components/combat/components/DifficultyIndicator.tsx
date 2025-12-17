/**
 * DifficultyIndicator Component - AI Difficulty Tier Display
 *
 * Shows the current AI difficulty tier with Korean-English bilingual text
 * and color-coded visual feedback based on tier level.
 *
 * **Korean Philosophy (난이도 표시)**:
 * Provides transparent feedback to player about AI challenge level,
 * helping them understand their skill progression.
 */

import React from "react";
import { DifficultyTier } from "../../../systems/ai";
import { FONT_FAMILY } from "../../../types/constants";

export interface DifficultyIndicatorProps {
  /** Current difficulty tier (1-5) */
  readonly tier: DifficultyTier;
  /** Whether to use mobile-optimized sizing */
  readonly isMobile: boolean;
}

/**
 * Get tier display name with Korean and English
 */
function getTierName(tier: DifficultyTier): { korean: string; english: string } {
  switch (tier) {
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
}

/**
 * Get color for difficulty tier
 */
function getTierColor(tier: DifficultyTier): string {
  switch (tier) {
    case DifficultyTier.BEGINNER:
      return "#4CAF50"; // Green - Easy
    case DifficultyTier.NOVICE:
      return "#8BC34A"; // Light Green
    case DifficultyTier.INTERMEDIATE:
      return "#FFC107"; // Yellow/Gold - Medium
    case DifficultyTier.ADVANCED:
      return "#FF9800"; // Orange
    case DifficultyTier.EXPERT:
      return "#F44336"; // Red - Hard
    default:
      return "#FFC107"; // Default to medium
  }
}

/**
 * DifficultyIndicator - Visual feedback for current AI difficulty tier
 * 
 * Positioned below Player 2 HUD to avoid overlap
 * Calculates vertical offset based on HUD height (name + health + stamina + stance)
 */
export const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({
  tier,
  isMobile,
}) => {
  const tierName = getTierName(tier);
  const tierColor = getTierColor(tier);
  
  // Responsive sizing
  const fontSize = isMobile ? 11 : 13;
  const padding = isMobile ? "6px 10px" : "8px 12px";
  
  // Position below Player 2 HUD to avoid overlap
  // Player HUD consists of: name (20px) + health bar (20px) + stamina bar (20px) + stance (15px) + gaps (18px) ≈ 93px
  const topOffset = isMobile ? 100 : 110;

  return (
    <div
      data-testid="difficulty-indicator"
      style={{
        position: "absolute",
        top: `${topOffset}px`,
        right: isMobile ? "8px" : "12px",
        padding,
        background: `${tierColor}22`, // 13% opacity
        border: `2px solid ${tierColor}`,
        borderRadius: "4px",
        fontFamily: FONT_FAMILY.KOREAN,
        fontSize: `${fontSize}px`,
        color: tierColor,
        textShadow: "0 0 4px rgba(0,0,0,0.8)",
        pointerEvents: "none",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        transition: "all 0.3s ease-in-out", // Smooth color/border transitions
        boxShadow: `0 0 8px ${tierColor}44`, // Subtle glow effect
      }}
    >
      <div
        data-testid="difficulty-label"
        style={{
          fontSize: isMobile ? "9px" : "10px",
          opacity: 0.8,
          letterSpacing: "0.5px",
        }}
      >
        AI Difficulty
      </div>
      <div
        data-testid="difficulty-tier"
        style={{
          fontWeight: "bold",
          whiteSpace: "nowrap",
          letterSpacing: "0.5px",
        }}
      >
        {tierName.korean} | {tierName.english}
      </div>
    </div>
  );
};
