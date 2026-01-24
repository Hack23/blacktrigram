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
 * - Leaves 72% center for arena
 *
 * Responsible for sizing and positioning all left-side UI elements.
 * Now uses shared HUD utilities with resolution-based sizing.
 *
 * @korean 훈련화면 왼쪽 HUD - 해부학 표시 및 가드 표시기
 */

import React from "react";
import { useHUDLayout } from "../../../../../hooks/useHUDLayout";
import { TRIGRAM_STANCES_ORDER } from "../../../../../systems/trigram/types";
import { TrigramStance } from "../../../../../types/common";
import { BaseHUDContainer } from "../../../../shared/ui/BaseHUDContainer";
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
 * Uses resolution-based sizing for smooth scaling across all screen sizes.
 * Uses shared HUD utilities for consistent layout and styling.
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
  // Use shared HUD layout hook
  const layout = useHUDLayout(
    width,
    height,
    positionScale,
    'left',
    'training'
  );

  const currentStance: TrigramStance =
    TRIGRAM_STANCES_ORDER[currentStanceIndex];

  return (
    <BaseHUDContainer
      position="left"
      width={layout.hudWidth}
      height={layout.availableHeight}
      topOffset={layout.topOffset}
      padding={layout.padding}
      gap={layout.gap}
      dataTestId="training-left-hud"
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
    </BaseHUDContainer>
  );
};

export default TrainingLeftHUD;
