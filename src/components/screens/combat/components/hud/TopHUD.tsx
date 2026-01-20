/**
 * TopHUD - Top HUD container for global combat information
 *
 * Organizes all top-level HUD elements:
 * - Combat title (centered)
 * - Combat timer (below title)
 * - Round announcements
 * - Volume control (top-right)
 * - Back button (top-right)
 *
 * 상단 HUD - 전역 전투 정보 컨테이너
 */

import React from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../../types/constants";
import { getBackButtonTop } from "../../../../../types/constants/layout";
import { Z_INDEX } from "../../../../../types/LayoutTypes";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import { ResponsiveContainer } from "../../../../shared/base/ResponsiveContainer";
import { VolumeControl } from "../../../../shared/ui/VolumeControl";
import { CombatTimer } from "./CombatTimer";

/**
 * Props for the TopHUD component.
 * Contains state for title, timer, and top-level controls.
 */
export interface TopHUDProps {
  /** Screen width for responsive positioning */
  readonly width: number;
  /** Screen height for responsive positioning */
  readonly height: number;
  /** Mobile layout flag */
  readonly isMobile: boolean;
  /** Position scale for large displays (1.0, 1.25, 1.5 for 4K) */
  readonly positionScale: number;

  /** Combat timer state */
  readonly timerState: {
    readonly formattedTime: string;
    readonly warningLevel: "none" | "warning" | "urgent";
    readonly isTimeUp: boolean;
  };
  /** Whether to show the timer */
  readonly showTimer: boolean;

  /** Back button callback */
  readonly onReturnToMenu: () => void;
  /** Audio play callback for hover effects */
  readonly onAudioHover: () => void;
}

/**
 * TopHUD Component
 *
 * Organizes all top-level HUD elements including title, timer, and controls.
 * Uses ResponsiveContainer for consistent positioning across screen sizes.
 *
 * @example
 * ```tsx
 * <TopHUD
 *   width={1200}
 *   height={800}
 *   isMobile={false}
 *   positionScale={1.0}
 *   timerState={timerState}
 *   showTimer={combatState.roundStarted && !combatState.roundEnded}
 *   onReturnToMenu={handleReturnToMenu}
 *   onAudioHover={() => audio.playSFX("menu_hover")}
 * />
 * ```
 */
export const TopHUD: React.FC<TopHUDProps> = ({
  width,
  height,
  isMobile,
  positionScale,
  timerState,
  showTimer,
  onReturnToMenu,
  onAudioHover,
}) => {
  return (
    <>
      {/* Combat Title - Top Center */}
      <ResponsiveContainer
        position={{ base: { x: 0, y: 10 * positionScale } }}
        containerWidth={width}
        useSafeArea
        safeAreaEdge="top"
        zIndex={Z_INDEX.HUD}
        style={{
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: isMobile ? "18px" : "24px",
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: FONT_FAMILY.KOREAN,
            color: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
            textShadow: "0 0 4px rgba(0,0,0,0.8)",
          }}
        >
          전투 | Combat
        </div>
      </ResponsiveContainer>

      {/* Combat Timer - Below Title */}
      {showTimer && (
        <CombatTimer
          formattedTime={timerState.formattedTime}
          warningLevel={timerState.warningLevel}
          isTimeUp={timerState.isTimeUp}
          isMobile={isMobile}
          style={{ top: isMobile ? "45px" : "50px" }}
        />
      )}

      {/* Volume Control - Top Right */}
      <VolumeControl position="bottom-right" compact={isMobile} />

      {/* Back Button - Top Right Corner */}
      <ResponsiveContainer
        position={{
          base: {
            x: width - (isMobile ? 100 : 150),
            y: getBackButtonTop(isMobile),
          },
        }}
        containerWidth={width}
        useSafeArea
        safeAreaEdge="top"
        zIndex={Z_INDEX.HUD}
        style={{
          pointerEvents: "auto",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            textAlign: "center",
            background: "rgba(10, 10, 15, 0.85)",
            border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)}`,
            borderRadius: "8px",
            padding: isMobile ? "6px 10px" : "8px 12px",
          }}
        >
          <style>
            {`
              .combat-return-menu-btn {
                background: ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.9)};
                color: ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 1)};
                border: none;
                border-radius: 8px;
                padding: ${isMobile ? "8px 12px" : "10px 16px"};
                font-size: ${isMobile ? "12px" : "14px"};
                font-family: ${FONT_FAMILY.KOREAN};
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s ease;
                min-height: 36px;
                white-space: nowrap;
              }
              .combat-return-menu-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 0 20px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)};
              }
            `}
          </style>
          <button
            onClick={onReturnToMenu}
            onMouseEnter={onAudioHover}
            className="combat-return-menu-btn"
            data-testid="return-to-menu-button"
            aria-label="Return to main menu"
          >
            {isMobile ? "메뉴 | Menu" : "메뉴로 | Return to Menu"}
          </button>
        </div>
      </ResponsiveContainer>
    </>
  );
};

export default TopHUD;
