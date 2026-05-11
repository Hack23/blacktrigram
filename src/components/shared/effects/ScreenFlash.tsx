/* eslint-disable react-refresh/only-export-components */
/**
 * Screen flash effect for explosive impacts
 *
 * Provides fullscreen flash effects for Jin (Thunder) trigram techniques
 * with Korean cyberpunk color scheme.
 *
 * **Korean Martial Arts Context:**
 * - 진괘 (Jin): Thunder trigram explosive release
 * - 화면 섬광 (Screen Flash): Visual impact emphasis
 * - 폭발 효과 (Explosive Effect): Thunder burst visualization
 *
 * @module components/shared/effects/ScreenFlash
 * @korean 화면섬광
 */

import React, { useEffect, useState } from "react";
import { useKoreanTheme } from "../../shared/base/useKoreanTheme";
import { KOREAN_COLORS } from "@/types/constants";

/**
 * Screen flash configuration
 */
export interface ScreenFlashConfig {
  /** Flash intensity (0-1) */
  readonly intensity: number;
  /** Duration in milliseconds */
  readonly duration: number;
  /** Flash color (hex number) */
  readonly color?: number;
  /** Fade curve: 'linear' | 'ease-out' | 'ease-in-out' */
  readonly fadeCurve?: "linear" | "ease-out" | "ease-in-out";
}

/**
 * Props for ScreenFlash component
 */
export interface ScreenFlashProps {
  /** Whether flash is active */
  readonly active: boolean;
  /** Flash configuration */
  readonly config: ScreenFlashConfig;
  /** Callback when flash completes */
  readonly onComplete?: () => void;
}

/**
 * ScreenFlash component - Fullscreen flash overlay
 *
 * Renders a fullscreen overlay with fade-out animation for explosive impacts.
 * Uses Korean cyberpunk color palette for authentic Jin technique feel.
 */
export const ScreenFlash: React.FC<ScreenFlashProps> = ({
  active,
  config,
  onComplete,
}) => {
  const { colors } = useKoreanTheme();
  const [opacity, setOpacity] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!active) {
      setOpacity(0);
      setIsAnimating(false);
      return;
    }

    setOpacity(config.intensity);
    setIsAnimating(true);

    const startTime = Date.now();
    const fadeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / config.duration;

      if (progress >= 1) {
        setOpacity(0);
        setIsAnimating(false);
        clearInterval(fadeInterval);
        if (onComplete) {
          onComplete();
        }
        return;
      }

      let fadeProgress: number;
      switch (config.fadeCurve) {
        case "ease-out":
          fadeProgress = 1 - Math.pow(1 - progress, 3);
          break;
        case "ease-in-out":
          fadeProgress =
            progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          break;
        default:
          fadeProgress = progress;
      }

      setOpacity(config.intensity * (1 - fadeProgress));
    }, 16); // ~60fps

    return () => clearInterval(fadeInterval);
  }, [active, config, onComplete]);

  if (!isAnimating && opacity === 0) {
    return null;
  }

  const color = config.color ?? colors.ACCENT_GOLD;
  const r = (color >> 16) & 255;
  const g = (color >> 8) & 255;
  const b = color & 255;

  return (
    <div
      data-testid="screen-flash"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: `rgb(${r}, ${g}, ${b})`,
        opacity,
        pointerEvents: "none",
        zIndex: 9999,
        transition: "opacity 0.016s linear",
      }}
    />
  );
};

/**
 * Predefined flash profiles for Jin techniques
 */
export const JIN_FLASH_PROFILES = {
  /** Light flash for quick strikes */
  light: {
    intensity: 0.4,
    duration: 150,
    color: KOREAN_COLORS.PRIMARY_CYAN,
    fadeCurve: "ease-out" as const,
  },
  /** Medium flash for standard impacts */
  medium: {
    intensity: 0.5,
    duration: 200,
    color: KOREAN_COLORS.ACCENT_GOLD,
    fadeCurve: "ease-out" as const,
  },
  /** Heavy flash for powerful techniques */
  heavy: {
    intensity: 0.6,
    duration: 250,
    color: KOREAN_COLORS.ACCENT_RED,
    fadeCurve: "ease-out" as const,
  },
  /** Explosive flash for maximum impact */
  explosive: {
    intensity: 0.8,
    duration: 300,
    color: KOREAN_COLORS.ACCENT_GOLD,
    fadeCurve: "ease-in-out" as const,
  },
} as const;

/**
 * React hook for screen flash effects
 */
export const useScreenFlash = () => {
  const [flashConfig, setFlashConfig] = useState<ScreenFlashConfig | null>(
    null,
  );
  const [isActive, setIsActive] = useState(false);

  const trigger = (config: ScreenFlashConfig) => {
    setFlashConfig(config);
    setIsActive(true);
  };

  const triggerProfile = (profile: keyof typeof JIN_FLASH_PROFILES) => {
    trigger(JIN_FLASH_PROFILES[profile]);
  };

  const handleComplete = () => {
    setIsActive(false);
  };

  return {
    /** Trigger flash with custom configuration */
    flash: trigger,
    /** Trigger flash using predefined profile */
    flashProfile: triggerProfile,
    /** Flash component to render */
    FlashComponent: flashConfig ? (
      <ScreenFlash
        active={isActive}
        config={flashConfig}
        onComplete={handleComplete}
      />
    ) : null,
    /** Whether flash is currently active */
    isActive,
  };
};

/**
 * Calculate flash intensity from Jin technique properties
 */
export const calculateJinFlashIntensity = (
  techniqueIntensity: number,
  explosivePower: number,
): number => {
  return Math.min(1.0, techniqueIntensity * explosivePower * 0.6);
};

export default ScreenFlash;
