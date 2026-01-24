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
import { HUD_HEIGHT, HUD_WIDTH_PERCENT } from "../../../../../types/LayoutTypes";
import { SPACING, BORDERS, GRADIENTS, HUD_STYLE } from "../../../../../types/constants/designSystem";
import { GuardIndicator } from "../../../../shared/three/indicators/GuardIndicator";
import AnatomyControlsOverlayHtml from "../AnatomyControlsOverlayHtml";
import type { AnatomyLayer } from "../AnatomyOverlay3D";



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
    const hudWidth = isMobile
      ? width * HUD_WIDTH_PERCENT.LEFT_MOBILE
      : width * HUD_WIDTH_PERCENT.LEFT_DESKTOP;

    // Scale factors for 4K (positionScale: 1.0-1.5)
    const scaledTopHeight = isMobile
      ? HUD_HEIGHT.TRAINING_TOP_MOBILE
      : HUD_HEIGHT.TRAINING_TOP_DESKTOP * positionScale;
    const scaledBottomHeight = isMobile
      ? HUD_HEIGHT.TRAINING_BOTTOM_MOBILE
      : HUD_HEIGHT.TRAINING_BOTTOM_DESKTOP * positionScale;

    // Calculate available height between top and bottom HUDs
    const topOffset = scaledTopHeight;
    const bottomOffset = scaledBottomHeight;
    const availableHeight = height - topOffset - bottomOffset;

    // Internal padding from design system
    const padding = isMobile ? parseInt(SPACING.xs, 10) : parseInt(SPACING.md, 10) * positionScale;
    const gap = isMobile ? parseInt(SPACING.sm, 10) : parseInt(SPACING.lg, 10) * positionScale;

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
        justifyContent: "flex-start",
        alignItems: "stretch",
        pointerEvents: "none",
        padding: `${layout.padding}px`,
        boxSizing: "border-box",
        gap: `${layout.gap}px`,
        // Cyberpunk border - right edge only for left HUD
        borderRight: BORDERS.default,
        background: GRADIENTS.horizontal(0.85),
        backdropFilter: HUD_STYLE.backdropFilter,
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
