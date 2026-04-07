/**
 * CombatControlsPanel - Displays controls guide and combat messages log
 *
 * Shows keyboard/touch controls on the left and scrolling combat log on the right.
 * Positioned at the bottom of the combat screen above the back button.
 *
 * Refactored to use useKoreanTheme for consistent theming.
 *
 * @module components/combat/components/CombatControlsPanel
 * @category Combat UI
 * @korean 전투컨트롤패널
 */

import React from "react";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
import { hexToRgbaString } from "../../../../../utils/colorUtils";

export interface CombatControlsPanelProps {
  /** Combat message log (most recent messages) */
  readonly combatMessages: readonly string[];
  /** Whether to use mobile-optimized sizing */
  readonly isMobile: boolean;
  /** Screen height for responsive sizing */
  readonly height?: number;
}

/**
 * CombatControlsPanel - Controls guide and combat log display
 * 
 * Uses useKoreanTheme for consistent styling.
 *
 * @example
 * ```tsx
 * <CombatControlsPanel
 *   combatMessages={combatState.combatMessages}
 *   isMobile={false}
 * />
 * ```
 */
export const CombatControlsPanel: React.FC<CombatControlsPanelProps> = ({
  combatMessages,
  isMobile,
  height,
}) => {
  const theme = useKoreanTheme({ variant: "primary", size: "sm", isMobile });
  const panelBackground = hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.8);
  
  return (
    <div
      data-testid="combat-controls-panel"
      style={{
        position: "absolute",
        bottom: isMobile ? "90px" : "100px",
        left: isMobile ? "5px" : "15px",
        right: isMobile ? "5px" : "15px",
        display: "flex",
        justifyContent: "space-between",
        pointerEvents: "auto",
        zIndex: 50,
      }}
    >
      {/* Controls Guide */}
      <div
        data-testid="combat-controls-guide"
        style={{
          width: isMobile ? "45%" : "400px",
          background: panelBackground,
          border: `2px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 1)}`,
          borderRadius: "8px",
          padding: "10px",
          color: hexToRgbaString(theme.colors.PRIMARY_CYAN, 1),
          fontFamily: theme.fontFamily.KOREAN,
        }}
      >
        <div style={{ fontSize: isMobile ? "10px" : "12px" }}>
          조작법 | Controls: A/D - Attack/Defend | 1-8 - Stances
        </div>
      </div>

      {/* Combat Message Log */}
      <div
        data-testid="combat-message-log"
        style={{
          width: isMobile ? "45%" : "400px",
          background: panelBackground,
          border: `2px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 1)}`,
          borderRadius: "8px",
          padding: "10px",
          color: hexToRgbaString(theme.colors.PRIMARY_CYAN, 1),
          fontFamily: theme.fontFamily.KOREAN,
          maxHeight: height ? `${Math.round(height * 0.18)}px` : "18vh",
          overflow: "auto",
        }}
      >
        {combatMessages.slice(-5).map((msg, idx) => (
          <div
            key={`msg-${idx}`}
            style={{ fontSize: "12px", marginBottom: "4px" }}
          >
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombatControlsPanel;
