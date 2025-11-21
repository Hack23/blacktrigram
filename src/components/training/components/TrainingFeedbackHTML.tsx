/**
 * TrainingFeedbackHTML - Html overlay for training feedback messages
 * 
 * Displays temporary feedback messages for hits, misses, and achievements
 */

import React from "react";
import { FONT_FAMILY } from "../../../types/constants";

/**
 * Props for TrainingFeedbackHTML component
 */
export interface TrainingFeedbackHTMLProps {
  /** Feedback message to display */
  readonly message: string;
  /** Whether on mobile device */
  readonly isMobile: boolean;
}

/**
 * TrainingFeedbackHTML Component
 * Html overlay for displaying training feedback
 */
export const TrainingFeedbackHTML: React.FC<TrainingFeedbackHTMLProps> = ({
  message,
  isMobile,
}) => {
  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.9)",
        border: "3px solid #ffd700",
        borderRadius: "16px",
        padding: isMobile ? "20px 30px" : "30px 50px",
        fontFamily: FONT_FAMILY.KOREAN,
        color: "#ffd700",
        fontSize: isMobile ? "20px" : "28px",
        fontWeight: "bold",
        textAlign: "center",
        boxShadow: "0 0 30px rgba(255, 215, 0, 0.5)",
        animation: "feedbackPulse 0.5s ease-in-out",
        minWidth: isMobile ? "200px" : "300px",
      }}
      data-testid="training-feedback-html"
    >
      {message}
      <style>
        {`
          @keyframes feedbackPulse {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default TrainingFeedbackHTML;
