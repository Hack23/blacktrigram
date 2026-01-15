/**
 * TrainingFeedbackOverlayHtml - Html overlay for training feedback messages
 * 
 * Displays temporary feedback messages for hits, misses, and achievements
 */

import React from "react";
import { FONT_FAMILY } from "../../../../types/constants";
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
 * Html overlay for displaying training feedback
 */
export const TrainingFeedbackOverlayHtml: React.FC<TrainingFeedbackOverlayHtmlProps> = ({
  message,
  isMobile,
}) => {
  return (
    <div
      className={`training-feedback ${isMobile ? "mobile" : "desktop"}`}
      style={{
        fontFamily: FONT_FAMILY.KOREAN,
        fontWeight: "bold",
      }}
      data-testid="training-feedback-html"
    >
      {message}
    </div>
  );
};

export default TrainingFeedbackOverlayHtml;
