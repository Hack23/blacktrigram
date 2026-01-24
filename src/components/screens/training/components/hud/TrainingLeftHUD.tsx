/**
 * TrainingLeftHUD - Left side HUD for training screen
 *
 * Contains:
 * - Anatomy Display controls
 * - Guard Indicator
 *
 * Gaming Layout Best Practice:
 * - Width: Resolution-based 14-18% of screen
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
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import {
  getHUDHeight,
  getResponsivePadding,
  getResponsiveSize,
} from "../../../../../utils/responsiveLayout";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
import { GuardIndicator } from "../../../../shared/three/indicators/GuardIndicator";
import AnatomyControlsOverlayHtml from "../AnatomyControlsOverlayHtml";
import type { AnatomyLayer } from "../AnatomyOverlay3D";

export interface TrainingLeftHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Whether mobile controls should be shown (NOT for sizing) */
  readonly isMobile?: boolean;
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
 * Uses resolution-based sizing for width calculation.
 */
export const TrainingLeftHUD: React.FC<TrainingLeftHUDProps> = ({
  width,
  height,
  isMobile = false,
  positionScale,
  visibleAnatomyLayers,
  onAnatomyLayerToggle,
  currentStanceIndex,
  isInGuard,
}) => {
  // isMobile only used for theme selection (valid use case for UI styling)
  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile,
  });

  // Layout calculations for left HUD with resolution-based sizing
  const layout = React.useMemo(() => {
    // Resolution-based width: 14-18% of screen
    const hudWidthPercent = getResponsiveSize(width, {
      mobile: 18,
      tablet: 16,
      desktop: 14,
    });
    const hudWidth = Math.round((width * hudWidthPercent) / 100);

    // Top/bottom offsets using resolution-based height calculations
    const scaledTopHeight = getHUDHeight(height, 0.06) * positionScale; // ~6% for top
    const scaledBottomHeight = getHUDHeight(height, 0.11) * positionScale; // ~11% for bottom

    // Calculate available height between top and bottom HUDs
    const topOffset = scaledTopHeight;
    const bottomOffset = scaledBottomHeight;
    const availableHeight = height - topOffset - bottomOffset;

    // Resolution-based padding and gap
    const padding = getResponsivePadding(width) * positionScale;
    const gap = getResponsiveSize(width, {
      mobile: 12,
      tablet: 15,
      desktop: 18,
    }) * positionScale;

    return {
      hudWidth,
      topOffset,
      bottomOffset,
      availableHeight,
      padding,
      gap,
    };
  }, [width, height, positionScale]);

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
        borderRight: `2px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.4)}`,
        background: `linear-gradient(90deg, ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.85)} 0%, ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.4)} 100%)`,
        backdropFilter: "blur(8px)",
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
