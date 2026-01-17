/**
 * TechniqueBarContainer - Positioned container for TechniqueBar
 * 
 * Provides consistent positioning and styling for TechniqueBar across
 * Combat and Training screens. Handles responsive positioning and z-index.
 * 
 * Eliminates 60+ lines of duplicate code between CombatScreen3D and TrainingScreen3D.
 * 
 * @module components/combat/components/TechniqueBarContainer
 * @category Combat UI
 * @korean 기술바컨테이너
 */

import React, { useMemo } from "react";
import { TechniqueBar, type TechniqueBarProps } from "../indicators/TechniqueBar";
import { getTechniqueBarBottom, LAYOUT_BOTTOM_POSITIONS } from "../../../../../types/constants/layout";
import { Z_INDEX } from "../../../../../types/LayoutTypes";

export interface TechniqueBarContainerProps extends TechniqueBarProps {
  /** Whether to show the TechniqueBar (allows conditional rendering) */
  readonly visible?: boolean;
}

/**
 * TechniqueBarContainer - Positioned wrapper for TechniqueBar
 * 
 * Provides consistent positioning, styling, and pointer event handling
 * for the TechniqueBar across different screen contexts (Combat and Training).
 * 
 * Features:
 * - Memoized styles for performance
 * - Centralized positioning using layout constants
 * - Semantic z-index (Z_INDEX.TECHNIQUE_BAR)
 * - Pointer event handling (container non-interactive, inner interactive)
 * 
 * @example
 * ```tsx
 * <TechniqueBarContainer
 *   visible={combatState.roundStarted && !combatState.roundEnded}
 *   techniques={availableTechniques}
 *   player={player}
 *   selectedIndex={selectedIndex}
 *   cooldowns={cooldownsMap}
 *   onTechniqueSelect={handleSelect}
 *   onTechniqueHover={handleHover}
 *   isMobile={isMobile}
 *   screenWidth={width}
 *   screenHeight={height}
 * />
 * ```
 */
export const TechniqueBarContainer: React.FC<TechniqueBarContainerProps> = ({
  visible = true,
  ...techniqueBarProps
}) => {
  const { isMobile } = techniqueBarProps;

  // Memoize container styles to prevent unnecessary re-renders
  // Positioned at bottom to minimize arena obstruction (gameplay priority)
  const containerStyle = useMemo(() => ({
    position: "absolute" as const,
    left: 0,
    bottom: getTechniqueBarBottom(isMobile),
    width: "100%",
    height: `${LAYOUT_BOTTOM_POSITIONS.TECHNIQUE_BAR_HEIGHT}px`,
    pointerEvents: "none" as const,
    zIndex: Z_INDEX.TECHNIQUE_BAR,
    display: "flex",
    justifyContent: "center" as const,
    alignItems: "flex-end" as const,
    // Semi-transparent background to not fully obstruct arena
    background: "linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%)",
  }), [isMobile]);

  // Memoize inner div style for pointer events
  const innerStyle = useMemo(() => ({
    pointerEvents: "auto" as const,
  }), []);

  if (!visible) {
    return null;
  }

  return (
    <div style={containerStyle} data-testid="technique-bar-container">
      <div style={innerStyle}>
        <TechniqueBar {...techniqueBarProps} />
      </div>
    </div>
  );
};

export default TechniqueBarContainer;
