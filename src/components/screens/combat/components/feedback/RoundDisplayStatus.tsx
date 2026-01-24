/**
 * RoundDisplayStatus - Brief round status messages
 * 
 * Displays quick status messages like "라운드 시작!", "전투!", "라운드 종료", "K.O.!"
 * Rendered as a fullscreen overlay outside the Canvas.
 * 
 * @korean 라운드 상태 표시 - 간단한 라운드 상태 메시지
 */

import React from "react";
import { Z_INDEX } from "../../../../../types/LayoutTypes";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";

export type RoundDisplayStatus = "start" | "fight" | "end" | "ko" | null;

export interface RoundDisplayStatusProps {
  /** Current round status to display */
  readonly status: RoundDisplayStatus;
  /** Whether mobile layout is active */
  readonly isMobile?: boolean;
}

/**
 * RoundDisplayStatus Component
 * 
 * Large centered text overlay showing brief round status messages.
 * Auto-fades based on combatState.roundDisplayStatus timing.
 */
export const RoundDisplayStatus: React.FC<RoundDisplayStatusProps> = ({
  status,
  isMobile = false,
}) => {
  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile,
  });

  if (!status) {
    return null;
  }

  const statusMessages: Record<Exclude<RoundDisplayStatus, null>, string> = {
    start: "라운드 시작!",
    fight: "전투!",
    end: "라운드 종료",
    ko: "K.O.!",
  };

  const fontSize = isMobile ? "48px" : "72px";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: Z_INDEX.MODAL,
      }}
      data-testid="round-display-status"
    >
      <div
        style={{
          fontSize,
          fontWeight: "bold",
          fontFamily: theme.koreanTypography.fontFamily,
          lineHeight: theme.koreanTypography.lineHeight,
          letterSpacing: theme.koreanTypography.letterSpacing,
          wordBreak: theme.koreanTypography.wordBreak,
          textAlign: "center",
          color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
          textShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
        }}
        data-testid={`round-display-status-${status}`}
      >
        {statusMessages[status]}
      </div>
    </div>
  );
};

export default RoundDisplayStatus;
