/**
 * TrainingLeftHUD - Left side HUD for training screen
 *
 * Contains:
 * - Anatomy Display controls
 * - Guard Indicator
 *
 * Gaming Layout Best Practice:
 * - Width: 15% of screen (mobile: 20%)
 * - Height: 100% minus top/bottom HUD heights
 * - Leaves 70% center for arena
 *
 * Responsible for sizing and positioning all left-side UI elements.
 *
 * @korean 훈련화면 왼쪽 HUD - 해부학 표시 및 가드 표시기
 */

import React from "react";
import { TRIGRAM_STANCES_ORDER } from "../../../../../systems/trigram/types";
import { TrigramStance } from "../../../../../types/common";
import { GuardIndicator } from "../../../../shared/three/indicators/GuardIndicator";
import AnatomyControlsOverlayHtml from "../AnatomyControlsOverlayHtml";
import type { AnatomyLayer } from "../AnatomyOverlay3D";

/** HUD width percentage of screen (gaming standard: 15-20%) */
const HUD_WIDTH_PERCENT_DESKTOP = 15;
const HUD_WIDTH_PERCENT_MOBILE = 20;

/** Top/Bottom HUD reserved heights */
const TOP_HUD_HEIGHT_DESKTOP = 140;
const TOP_HUD_HEIGHT_MOBILE = 120;
const BOTTOM_HUD_HEIGHT_DESKTOP = 120;
const BOTTOM_HUD_HEIGHT_MOBILE = 100;

export interface TrainingLeftHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Whether mobile layout is active */
  readonly isMobile: boolean;
  /** Position scale multiplier for large displays */
  readonly positionScale: number;
  /** Currently visible anatomy layers */
  readonly visibleAnatomyLayers: readonly AnatomyLayer[];
  /** Handler for toggling anatomy layers */
  readonly onAnatomyLayerToggle: (layer: AnatomyLayer) => void;
  /** Current stance index (0-7) */
  readonly currentStanceIndex: number;
  /** Whether player is in guard stance */
  readonly isInGuard: boolean;
}

/**
 * TrainingLeftHUD Component
 *
 * Left side of the training screen containing anatomy controls and guard indicator.
 * Takes 15% of screen width (20% on mobile), positioned between top and bottom HUDs.
 */
export const TrainingLeftHUD: React.FC<TrainingLeftHUDProps> = ({
  width,
  height,
  isMobile,
  positionScale,
  visibleAnatomyLayers,
  onAnatomyLayerToggle,
  currentStanceIndex,
  isInGuard,
}) => {
  // Layout calculations for left HUD with proper gaming proportions
  const layout = React.useMemo(() => {
    // Width: 15-20% of screen
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
    const padding = isMobile ? 10 : 15 * positionScale;
    const gap = isMobile ? 12 : 18 * positionScale;

    return {
      hudWidth,
      topOffset,
      bottomOffset,
      availableHeight,
      padding,
      gap,
    };
  }, [width, height, isMobile, positionScale]);

  const currentStance: TrigramStance =
    TRIGRAM_STANCES_ORDER[currentStanceIndex];

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: `${layout.topOffset}px`,
        width: `${layout.hudWidth}px`,
        height: `${layout.availableHeight}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        pointerEvents: "none",
        padding: `${layout.padding}px`,
        boxSizing: "border-box",
        gap: `${layout.gap}px`,
      }}
      data-testid="training-left-hud"
    >
      {/* Anatomy Controls */}
      <div
        style={{
          pointerEvents: "all",
          display: "flex",
          flexDirection: "column",
          gap: `${layout.gap}px`,
          maxWidth: "100%",
        }}
        data-testid="training-left-hud-anatomy-section"
      >
        <AnatomyControlsOverlayHtml
          visibleLayers={visibleAnatomyLayers as AnatomyLayer[]}
          onLayerToggle={onAnatomyLayerToggle}
          isMobile={isMobile}
        />
      </div>

      {/* Guard Indicator */}
      <div
        style={{ pointerEvents: "none", maxWidth: "100%" }}
        data-testid="training-left-hud-guard-section"
      >
        <GuardIndicator
          currentStance={currentStance}
          isInGuard={isInGuard}
          position="left"
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default TrainingLeftHUD;
