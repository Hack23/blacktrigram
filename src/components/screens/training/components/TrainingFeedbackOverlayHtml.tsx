/**
 * TrainingFeedbackOverlayHtml - Html overlay for training feedback messages
 * 
 * Displays temporary feedback messages for hits, misses, and achievements
 * with consistent Korean martial arts cyberpunk theming.
 * 
 * @module components/screens/training/components/TrainingFeedbackOverlayHtml
 * @category Training UI
 * @korean 훈련피드백오버레이
 */

import React from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import "../training.css";

/**
 * Props for TrainingFeedbackOverlayHtml component
 */
export interface TrainingFeedbackOverlayHtmlProps {
  /** Feedback message to display */
  readonly message: string;
  /** Whether on mobile device */
  readonly isMobile: boolean;
}

/**
 * TrainingFeedbackOverlayHtml Component
 * Html overlay for displaying training feedback with Korean theming
 * 
 * @korean 훈련피드백오버레이컴포넌트
 */
export const TrainingFeedbackOverlayHtml = React.memo<TrainingFeedbackOverlayHtmlProps>(
  ({
    message,
    isMobile,
  }) => {
  return (
    <div
      className={`training-feedback ${isMobile ? "mobile" : "desktop"}`}
      style={{
        fontFamily: FONT_FAMILY.KOREAN,
        fontWeight: "bold",
        color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD),
        textShadow: `0 2px 10px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.5)}`,
      }}
      data-testid="training-feedback-html"
    >
      {message}
    </div>
  );
},
(prevProps, nextProps) => {
  // Only re-render if message or mobile state changes
  return (
    prevProps.message === nextProps.message &&
    prevProps.isMobile === nextProps.isMobile
  );
});

TrainingFeedbackOverlayHtml.displayName = "TrainingFeedbackOverlayHtml";

export default TrainingFeedbackOverlayHtml;
