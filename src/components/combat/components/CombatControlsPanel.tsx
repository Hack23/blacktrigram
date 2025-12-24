/**
 * CombatControlsPanel - Displays controls guide and combat messages log
 *
 * Shows keyboard/touch controls on the left and scrolling combat log on the right.
 * Positioned at the bottom of the combat screen above the back button.
 *
 * @module components/combat/components/CombatControlsPanel
 * @category Combat UI
 * @korean 전투컨트롤패널
 */

import React from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";

export interface CombatControlsPanelProps {
  /** Combat message log (most recent messages) */
  readonly combatMessages: readonly string[];
  /** Whether to use mobile-optimized sizing */
  readonly isMobile: boolean;
}

/**
 * CombatControlsPanel - Controls guide and combat log display
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
}) => {
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
          background: "rgba(10, 10, 15, 0.8)",
          border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1)}`,
          borderRadius: "8px",
          padding: "10px",
          color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
          fontFamily: FONT_FAMILY.KOREAN,
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
          background: "rgba(10, 10, 15, 0.8)",
          border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1)}`,
          borderRadius: "8px",
          padding: "10px",
          color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
          fontFamily: FONT_FAMILY.KOREAN,
          maxHeight: "140px",
          overflow: "auto",
        }}
      >
        {combatMessages.slice(-5).map((msg, idx) => (
          <div
            key={`msg-${idx}-${msg.slice(0, 20)}`}
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
