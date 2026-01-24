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
 * - Height: Compact ~100-120px
 *
 * @korean 전투화면 하단 바 - 기술 바, 음량, 전투 메시지
 */

import React from "react";
import { PlayerState } from "../../../../../systems";
import { Technique } from "../../../../../types";
import { Z_INDEX } from "../../../../../types/LayoutTypes";
import { SPACING, TYPOGRAPHY, HIERARCHY, BORDERS, GRADIENTS } from "../../../../../types/constants/designSystem";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
import { TechniqueBar } from "../../../../shared/three/ui/TechniqueBar";
import { VolumeControl } from "../../../../shared/ui/VolumeControl";

/** Bottom HUD height - fits technique cards (100px desktop, 80px mobile) + padding */
const BOTTOM_HUD_HEIGHT_DESKTOP = 120;
const BOTTOM_HUD_HEIGHT_MOBILE = 100;

export interface CombatBottomHUDProps {
  /** Screen width for layout calculations */
  readonly width: number;
  /** Screen height for layout calculations */
  readonly height: number;
  /** Whether mobile layout is active */
  readonly isMobile: boolean;
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
 * and combat messages.
 */
export const CombatBottomHUD: React.FC<CombatBottomHUDProps> = ({
  width,
  height,
  isMobile,
  positionScale,
  visible,
  techniques,
  player,
  selectedIndex,
  cooldowns,
  onTechniqueSelect,
  combatMessages = [],
}) => {
  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile,
  });

  const layout = React.useMemo(() => {
    const hudHeight = isMobile
      ? BOTTOM_HUD_HEIGHT_MOBILE
      : BOTTOM_HUD_HEIGHT_DESKTOP * positionScale;
    const padding = isMobile ? parseInt(SPACING.xs, 10) : parseInt(SPACING.sm, 10) * positionScale;

    return { hudHeight, padding };
  }, [isMobile, positionScale]);

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
        backdropFilter: "blur(8px)",
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
            gap: "3px",
            zIndex: Z_INDEX.HUD,
            padding: isMobile ? `${parseInt(SPACING.xxs, 10) + 2}px ${SPACING.sm}` : `${SPACING.xs} ${SPACING.md}`,
            background: hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.85),
            border: BORDERS.muted,
            borderRadius: parseInt(SPACING.xxs, 10) + 2 + 'px',
            boxShadow: `0 0 10px ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.2)}`,
            minWidth: isMobile ? "200px" : "280px",
            maxWidth: isMobile ? "90%" : "500px",
          }}
          data-testid="combat-bottom-hud-messages"
        >
          <div
            style={{
              fontSize: isMobile ? TYPOGRAPHY.nano.fontSize : TYPOGRAPHY.micro.fontSize,
              fontFamily: TYPOGRAPHY.caption.fontFamily,
              color: HIERARCHY.accent70.color,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "2px",
            }}
          >
            전투 기록 | Combat Log
          </div>
          {recentMessages.map((message, index) => (
            <div
              key={index}
              style={{
                fontSize: isMobile ? TYPOGRAPHY.caption.fontSize : TYPOGRAPHY.bodySmall.fontSize,
                fontFamily: TYPOGRAPHY.bodySmall.fontFamily,
                color: HIERARCHY.primary.color,
                textShadow: "0 0 4px rgba(0,0,0,0.8)",
                opacity: 0.7 + index * 0.1,
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
            maxWidth: isMobile ? "100%" : "70%",
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
            isMobile={isMobile}
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
