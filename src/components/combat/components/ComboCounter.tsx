/**
 * ComboCounter - Combo counter display component
 * 
 * Displays the current combo count with Korean-English bilingual text.
 * Animates on combo increment and shows milestone indicators.
 * 
 * Uses Html overlay from @react-three/drei for rendering within 3D scenes.
 * 
 * @module components/combat/components/ComboCounter
 * @category Combat UI
 * @korean 콤보카운터
 */

import { Html } from "@react-three/drei";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";
import { hexColorToCSS, hexToRgbaString } from "../../../utils/colorUtils";

/**
 * Props for the ComboCounter component
 */
export interface ComboCounterProps {
  /** Current combo count */
  readonly combo: number;
  /** Whether to use mobile-optimized sizing */
  readonly isMobile?: boolean;
  /** Position in screen space (x, y in pixels) */
  readonly position?: { x: number; y: number };
  /** Minimum combo to display (default: 2) */
  readonly minDisplayCombo?: number;
}

/**
 * Get combo tier color based on combo count
 */
function getComboColor(combo: number): string {
  if (combo >= 10) {
    // Rainbow effect for high combos - use magenta
    return hexColorToCSS(KOREAN_COLORS.SECONDARY_MAGENTA);
  }
  if (combo >= 7) {
    // Critical tier - red
    return hexColorToCSS(KOREAN_COLORS.ACCENT_RED);
  }
  if (combo >= 5) {
    // High tier - gold
    return hexColorToCSS(KOREAN_COLORS.ACCENT_GOLD);
  }
  if (combo >= 3) {
    // Medium tier - cyan
    return hexColorToCSS(KOREAN_COLORS.PRIMARY_CYAN);
  }
  // Low tier - white
  return hexColorToCSS(KOREAN_COLORS.TEXT_PRIMARY);
}

/**
 * Get glow color based on combo tier
 */
function getGlowColor(combo: number): string {
  if (combo >= 10) {
    return hexToRgbaString(KOREAN_COLORS.SECONDARY_MAGENTA, 0.8);
  }
  if (combo >= 7) {
    return hexToRgbaString(KOREAN_COLORS.ACCENT_RED, 0.8);
  }
  if (combo >= 5) {
    return hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.8);
  }
  if (combo >= 3) {
    return hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6);
  }
  return hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, 0.4);
}

/**
 * Get combo milestone text
 */
function getComboMilestone(combo: number): { korean: string; english: string } | null {
  if (combo === 5) {
    return { korean: "훌륭합니다!", english: "Great!" };
  }
  if (combo === 10) {
    return { korean: "놀라운 연속 공격!", english: "Amazing!" };
  }
  if (combo === 15) {
    return { korean: "전설적인 공격!", english: "Legendary!" };
  }
  if (combo === 20) {
    return { korean: "신의 일격!", english: "GODLIKE!" };
  }
  return null;
}

/**
 * ComboCounter Component
 * 
 * Displays the current combo count with animations and milestone indicators.
 * Only visible when combo >= minDisplayCombo (default: 2).
 * 
 * @example
 * ```tsx
 * <ComboCounter
 *   combo={5}
 *   isMobile={isMobile}
 *   position={{ x: 600, y: 100 }}
 * />
 * ```
 */
export const ComboCounter: React.FC<ComboCounterProps> = ({
  combo,
  isMobile = false,
  position: _position = { x: 0, y: 0 },
  minDisplayCombo = 2,
}) => {
  // Animation state
  const [scale, setScale] = useState(1);
  const [showMilestone, setShowMilestone] = useState(false);
  const prevComboRef = useRef(combo);
  const milestoneTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate 3D position - center top of screen
  const position3D: [number, number, number] = useMemo(() => {
    // Position at top center of scene
    return [0, 4.5, 0];
  }, []);

  // Animate on combo change
  useEffect(() => {
    if (combo > prevComboRef.current) {
      // Scale up on combo increment
      setScale(1.3);
      setTimeout(() => setScale(1), 150);

      // Check for milestone
      const milestone = getComboMilestone(combo);
      if (milestone) {
        setShowMilestone(true);
        if (milestoneTimeoutRef.current) {
          clearTimeout(milestoneTimeoutRef.current);
        }
        milestoneTimeoutRef.current = setTimeout(() => {
          setShowMilestone(false);
        }, 1500);
      }
    }
    prevComboRef.current = combo;
  }, [combo]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (milestoneTimeoutRef.current) {
        clearTimeout(milestoneTimeoutRef.current);
      }
    };
  }, []);

  // Don't render if combo is below minimum
  if (combo < minDisplayCombo) {
    return null;
  }

  const milestone = getComboMilestone(combo);
  const comboColor = getComboColor(combo);
  const glowColor = getGlowColor(combo);
  // Get background color with alpha for milestone box
  const getMilestoneBackground = (comboVal: number): string => {
    if (comboVal >= 10) {
      return hexToRgbaString(KOREAN_COLORS.SECONDARY_MAGENTA, 0.3);
    }
    if (comboVal >= 7) {
      return hexToRgbaString(KOREAN_COLORS.ACCENT_RED, 0.3);
    }
    if (comboVal >= 5) {
      return hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.3);
    }
    if (comboVal >= 3) {
      return hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3);
    }
    return hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, 0.3);
  };

  // Font sizes
  const mainFontSize = isMobile ? 32 : 48;
  const subFontSize = isMobile ? 16 : 20;
  const milestoneFontSize = isMobile ? 20 : 28;

  return (
    <Html
      position={position3D}
      center
      distanceFactor={10}
      style={{ pointerEvents: "none" }}
    >
      <div
        data-testid="combo-counter"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${scale})`,
          transition: "transform 0.15s ease-out",
        }}
      >
        {/* Main combo number */}
        <div
          style={{
            fontSize: `${mainFontSize}px`,
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
            color: comboColor,
            textShadow: `
              0 0 15px ${glowColor},
              0 0 30px ${glowColor},
              3px 3px 6px rgba(0, 0, 0, 0.9)
            `,
            lineHeight: 1,
          }}
        >
          {combo}
        </div>

        {/* Korean text */}
        <div
          style={{
            fontSize: `${subFontSize}px`,
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
            color: comboColor,
            textShadow: `0 0 10px ${glowColor}, 2px 2px 4px rgba(0, 0, 0, 0.8)`,
            marginTop: "4px",
          }}
        >
          연속 타격!
        </div>

        {/* English text */}
        <div
          style={{
            fontSize: `${subFontSize - 4}px`,
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
            color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY),
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
          }}
        >
          {combo} HIT COMBO!
        </div>

        {/* Milestone indicator */}
        {showMilestone && milestone && (
          <div
            style={{
              marginTop: "8px",
              padding: "4px 16px",
              background: getMilestoneBackground(combo),
              borderRadius: "4px",
              border: `2px solid ${comboColor}`,
              animation: "pulse 0.5s ease-in-out infinite",
            }}
          >
            <div
              style={{
                fontSize: `${milestoneFontSize}px`,
                fontWeight: "bold",
                fontFamily: FONT_FAMILY.KOREAN,
                color: comboColor,
                textShadow: `0 0 10px ${glowColor}`,
              }}
            >
              {milestone.korean}
            </div>
            <div
              style={{
                fontSize: `${milestoneFontSize - 6}px`,
                fontWeight: "bold",
                fontFamily: FONT_FAMILY.KOREAN,
                color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY),
              }}
            >
              {milestone.english}
            </div>
          </div>
        )}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </Html>
  );
};

export default ComboCounter;
