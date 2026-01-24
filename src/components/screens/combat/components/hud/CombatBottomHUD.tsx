/**
 * CombatBottomHUD - Bottom bar for combat screen
 *
 * Contains:
 * - Technique Bar (centered)
 * - Volume Control (bottom-right, compact)
 * - Combat Messages (above technique bar)
 *
 * Gaming Layout Best Practice:
 * - Width: 100% of screen
 * - Height: Resolution-based ~10% of screen height (40-120px range)
 *
 * @korean 전투화면 하단 바 - 기술 바, 음량, 전투 메시지
 */

import React from "react";
import { PlayerState } from "../../../../../systems";
import { Technique } from "../../../../../types";
import { Z_INDEX } from "../../../../../types/LayoutTypes";
import { SPACING, SPACING_ADJUSTMENTS, BORDER_RADIUS, TYPOGRAPHY, TYPOGRAPHY_NUMERIC, HIERARCHY, BORDERS, GRADIENTS, HUD_STYLE ,
  OPACITY,
  COMBAT_UI_DIMENSIONS,
  COMBAT_UI_DIMENSIONS_NUMERIC,
  TEXT_EFFECTS,
  FONT_SIZE_MULTIPLIERS,
} from "../../../../../types/constants/designSystem";
import {
  BREAKPOINTS,
  getHUDHeight,
  getResponsiveFontSize,
  getResponsivePadding,
  shouldShowMobileControls,
} from "../../../../../utils/responsiveLayout";
import { TechniqueBar } from "../../../../shared/three/ui/TechniqueBar";
import { VolumeControl } from "../../../../shared/ui/VolumeControl";

export interface CombatBottomHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Whether mobile controls should be shown (NOT for sizing) */
  readonly isMobile?: boolean;
  /** Position scale multiplier for large displays */
  readonly positionScale: number;
  /** Whether technique bar should be visible */
  readonly visible: boolean;
  /** Available techniques for the technique bar */
  readonly techniques: readonly Technique[];
  /** Player state for technique availability checks */
  readonly player: PlayerState;
  /** Currently selected technique index */
  readonly selectedIndex: number;
  /** Active technique cooldowns */
  readonly cooldowns: Map<string, number>;
  /** Handler for technique selection */
  readonly onTechniqueSelect: (index: number) => void;
  /** Combat messages to display */
  readonly combatMessages?: readonly string[];
}

/**
 * CombatBottomHUD Component
 *
 * Compact bottom bar with centered technique bar, volume control,
 * and combat messages. Uses resolution-based sizing for all elements.
 */
export const CombatBottomHUD: React.FC<CombatBottomHUDProps> = ({
  width,
  height,
  isMobile = false,
  positionScale,
  visible,
  techniques,
  player,
  selectedIndex,
  cooldowns,
  onTechniqueSelect,
  combatMessages = [],
}) => {
  // isMobile only used for mobile controls visibility
  const showMobileControls = shouldShowMobileControls(width, isMobile);

  const layout = React.useMemo(() => {
    // Resolution-based HUD height (10% of screen height, 40-120px range)
    const hudHeight = getHUDHeight(height, 0.1) * positionScale;
    
    // Resolution-based padding
    const padding = getResponsivePadding(width) * positionScale;
    
    // Resolution-based font sizes (using design system as minimum)
    const baseFontSize = getResponsiveFontSize(width);
    const titleFontSize = Math.max(TYPOGRAPHY_NUMERIC.nano, baseFontSize * FONT_SIZE_MULTIPLIERS.titleSmall);
    const messageFontSize = Math.max(TYPOGRAPHY_NUMERIC.caption, baseFontSize * FONT_SIZE_MULTIPLIERS.messageSmall);
    
    // Resolution-based widths (using design system constants as reference)
    const minMessageWidth = width < BREAKPOINTS.mobile 
      ? COMBAT_UI_DIMENSIONS_NUMERIC.combatLogMinMobile
      : COMBAT_UI_DIMENSIONS_NUMERIC.combatLogMinDesktop;
    const maxMessageWidth = width < BREAKPOINTS.mobile 
      ? Math.min(
          width * COMBAT_UI_DIMENSIONS.combatLogMaxWidthPercentMobile,
          parseInt(COMBAT_UI_DIMENSIONS.combatLogMaxMobile, 10)
        )
      : COMBAT_UI_DIMENSIONS_NUMERIC.combatLogMaxDesktop;
    const maxTechniqueBarWidth = width < BREAKPOINTS.mobile 
      ? COMBAT_UI_DIMENSIONS.techniqueBarWidthMobile 
      : COMBAT_UI_DIMENSIONS.techniqueBarWidthDesktop;
    
    // Resolution-based message padding (using design system spacing)
    const messagePadding = width < BREAKPOINTS.mobile 
      ? `${SPACING_ADJUSTMENTS.compact} ${SPACING.sm}` 
      : `${SPACING.xs} ${SPACING.md}`;


    return {
      hudHeight,
      padding,
      titleFontSize,
      messageFontSize,
      minMessageWidth,
      maxMessageWidth,
      maxTechniqueBarWidth,
      messagePadding,
    };
  }, [width, height, positionScale]);

  // Only show last 3 combat messages
  const recentMessages = combatMessages.slice(-3);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: `${layout.hudHeight}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        pointerEvents: "none",
        padding: `${layout.padding}px`,
        boxSizing: "border-box",
        borderTop: BORDERS.default,
        background: GRADIENTS.verticalReverse(0.9),
        backdropFilter: HUD_STYLE.backdropFilter,
      }}
      data-testid="combat-bottom-hud"
    >
      {/* Combat Messages - styled box above technique bar */}
      {recentMessages.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: `${layout.padding}px`,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: SPACING_ADJUSTMENTS.micro,
            zIndex: Z_INDEX.HUD,
            padding: layout.messagePadding,
            background: HUD_STYLE.background,
            border: BORDERS.muted,
            borderRadius: BORDER_RADIUS.md,
            boxShadow: HUD_STYLE.shadow,
            minWidth: `${layout.minMessageWidth}px`,
            maxWidth: typeof layout.maxMessageWidth === 'number' 
              ? `${layout.maxMessageWidth}px` 
              : layout.maxMessageWidth,
          }}
          data-testid="combat-bottom-hud-messages"
        >
          <div
            style={{
              fontSize: `${layout.titleFontSize}px`,
              fontFamily: TYPOGRAPHY.caption.fontFamily,
              color: HIERARCHY.accent70.color,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: SPACING_ADJUSTMENTS.tiny,
            }}
          >
            전투 기록 | Combat Log
          </div>
          {recentMessages.map((message, index) => (
            <div
              key={index}
              style={{
                fontSize: `${layout.messageFontSize}px`,
                fontFamily: TYPOGRAPHY.bodySmall.fontFamily,
                color: HIERARCHY.primary.color,
                textShadow: TEXT_EFFECTS.darkShadow,
                opacity: OPACITY.base + index * OPACITY.increment,
                textAlign: "center",
              }}
            >
              {message}
            </div>
          ))}
        </div>
      )}

      {/* Technique Bar - centered, embedded mode for proper containment */}
      {visible && (
        <div
          style={{
            pointerEvents: "all",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            maxWidth: layout.maxTechniqueBarWidth,
          }}
          data-testid="combat-bottom-hud-technique-section"
        >
          <TechniqueBar
            techniques={techniques as Technique[]}
            player={player}
            selectedIndex={selectedIndex}
            cooldowns={cooldowns}
            onTechniqueSelect={onTechniqueSelect}
            onTechniqueHover={(_tech) => {}}
            isMobile={showMobileControls}
            screenWidth={width}
            screenHeight={height}
            embedded={true}
          />
        </div>
      )}

      {/* Volume Control - bottom right corner */}
      <div
        style={{
          position: "absolute",
          right: `${layout.padding * 1.5}px`,
          bottom: `${layout.padding}px`,
          pointerEvents: "all",
        }}
        data-testid="combat-bottom-hud-volume-section"
      >
        <VolumeControl position="bottom-right" compact={true} />
      </div>
    </div>
  );
};

export default CombatBottomHUD;
