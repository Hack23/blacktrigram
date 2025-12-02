/**
 * ActionFeedback - Combat action feedback display component
 * 
 * Displays action indicators like "Perfect!", "Critical!", "Blocked", "Dodged",
 * and technique names with Korean-English bilingual text.
 * 
 * Uses Html overlay from @react-three/drei for rendering within 3D scenes.
 * 
 * @module components/combat/components/ActionFeedback
 * @category Combat UI
 * @korean 액션피드백
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";
import { ActionFeedback as ActionFeedbackData, ActionFeedbackType } from "../../../hooks/useActionFeedback";

/**
 * Props for the ActionFeedback component
 */
export interface ActionFeedbackProps {
  /** Array of action feedbacks to display */
  readonly feedbacks: readonly ActionFeedbackData[];
  /** Whether to use mobile-optimized sizing */
  readonly isMobile?: boolean;
  /** Arena bounds for 3D positioning */
  readonly arenaBounds?: { x: number; y: number; width: number; height: number };
  /** Duration of animation in ms (default: 1200) */
  readonly animationDuration?: number;
}

/**
 * Props for technique name display
 */
export interface TechniqueNameProps {
  /** Korean technique name */
  readonly korean: string;
  /** English technique name */
  readonly english: string;
  /** Whether to use mobile-optimized sizing */
  readonly isMobile?: boolean;
  /** Animation duration in ms */
  readonly duration?: number;
  /** Callback when animation completes */
  readonly onComplete?: () => void;
}

/**
 * Get color based on feedback type
 */
function getFeedbackColor(type: ActionFeedbackType): string {
  switch (type) {
    case "perfect":
      return `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`;
    case "critical":
      return `#${KOREAN_COLORS.ACCENT_RED.toString(16).padStart(6, "0")}`;
    case "blocked":
      return `#${KOREAN_COLORS.ACCENT_CYAN.toString(16).padStart(6, "0")}`;
    case "dodged":
      return `#${KOREAN_COLORS.ACCENT_GREEN.toString(16).padStart(6, "0")}`;
    case "technique":
      return `#${KOREAN_COLORS.SECONDARY_MAGENTA.toString(16).padStart(6, "0")}`;
    case "combo_milestone":
      return `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`;
    default:
      return `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}`;
  }
}

/**
 * Get glow color based on feedback type
 */
function getGlowColor(type: ActionFeedbackType): string {
  switch (type) {
    case "perfect":
      return "rgba(255, 215, 0, 0.8)";
    case "critical":
      return "rgba(255, 51, 51, 0.8)";
    case "blocked":
      return "rgba(0, 255, 255, 0.6)";
    case "dodged":
      return "rgba(0, 255, 51, 0.6)";
    case "technique":
      return "rgba(255, 0, 255, 0.8)";
    case "combo_milestone":
      return "rgba(255, 215, 0, 0.8)";
    default:
      return "rgba(255, 255, 255, 0.4)";
  }
}

/**
 * Individual action feedback display
 */
interface SingleFeedbackProps {
  readonly feedback: ActionFeedbackData;
  readonly isMobile: boolean;
  readonly arenaBounds: { x: number; y: number; width: number; height: number };
  readonly animationDuration: number;
}

const SingleFeedback: React.FC<SingleFeedbackProps> = ({
  feedback,
  isMobile,
  arenaBounds,
  animationDuration,
}) => {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(feedback.timestamp);

  // Calculate 3D position from 2D screen coordinates
  const position3D: [number, number, number] = useMemo(() => {
    const relX = (feedback.position.x - arenaBounds.x) / arenaBounds.width;
    const relZ = (feedback.position.y - arenaBounds.y) / arenaBounds.height;
    const x = relX * 16 - 8; // Map 0-1 to -8 to 8
    const y = 2.5 + progress * 1.5; // Float upward
    const z = relZ * 8 - 4; // Map 0-1 to -4 to 4
    return [x, y, z];
  }, [feedback.position, arenaBounds, progress]);

  // Update progress using useFrame
  useFrame(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const newProgress = Math.min(elapsed / animationDuration, 1);
    setProgress(newProgress);
  });

  // Don't render if expired
  if (progress >= 1) return null;

  const opacity = 1 - progress;
  const scale = 1 + (progress < 0.2 ? progress * 2 : (1 - progress) * 0.5);
  const fontSize = isMobile ? 18 : 24;
  const color = getFeedbackColor(feedback.type);
  const glowColor = getGlowColor(feedback.type);

  return (
    <Html
      position={position3D}
      center
      distanceFactor={10}
      style={{ pointerEvents: "none" }}
    >
      <div
        data-testid={`action-feedback-${feedback.id}`}
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: "bold",
          fontFamily: FONT_FAMILY.KOREAN,
          color,
          opacity,
          transform: `scale(${scale})`,
          textShadow: `
            0 0 10px ${glowColor},
            0 0 20px ${glowColor},
            2px 2px 4px rgba(0, 0, 0, 0.9)
          `,
          whiteSpace: "nowrap",
          userSelect: "none",
          textAlign: "center",
        }}
      >
        {feedback.textKorean} | {feedback.text}
      </div>
    </Html>
  );
};

/**
 * ActionFeedback Component
 * 
 * Renders multiple action feedback indicators in the 3D scene.
 * Each indicator floats upward and fades out over time.
 * 
 * @example
 * ```tsx
 * <ActionFeedback
 *   feedbacks={actionFeedbacks}
 *   isMobile={isMobile}
 *   arenaBounds={arenaBounds}
 * />
 * ```
 */
export const ActionFeedback: React.FC<ActionFeedbackProps> = ({
  feedbacks,
  isMobile = false,
  arenaBounds = { x: 0, y: 0, width: 1200, height: 800 },
  animationDuration = 1200,
}) => {
  // Track currently visible feedbacks
  const [visibleFeedbacks, setVisibleFeedbacks] = useState<ActionFeedbackData[]>([]);

  // Update visible feedbacks when feedbacks prop changes
  useEffect(() => {
    setVisibleFeedbacks([...feedbacks]);
  }, [feedbacks]);

  return (
    <group data-testid="action-feedback-container">
      {visibleFeedbacks.map((feedback) => (
        <SingleFeedback
          key={feedback.id}
          feedback={feedback}
          isMobile={isMobile}
          arenaBounds={arenaBounds}
          animationDuration={animationDuration}
        />
      ))}
    </group>
  );
};

/**
 * TechniqueName Component
 * 
 * Displays the current technique name in Korean and English.
 * Appears at the center of the screen with a dramatic animation.
 * 
 * @example
 * ```tsx
 * <TechniqueName
 *   korean="천둥벽력"
 *   english="Thunder Strike"
 *   isMobile={isMobile}
 *   duration={2000}
 * />
 * ```
 */
export const TechniqueName: React.FC<TechniqueNameProps> = ({
  korean,
  english,
  isMobile = false,
  duration = 2000,
  onComplete,
}) => {
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.5);
  const startTimeRef = useRef(Date.now());

  // Animation phases: fade in (0-20%), hold (20-80%), fade out (80-100%)
  useFrame(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);

    if (progress < 0.2) {
      // Fade in
      const fadeInProgress = progress / 0.2;
      setOpacity(fadeInProgress);
      setScale(0.5 + fadeInProgress * 0.5);
    } else if (progress < 0.8) {
      // Hold
      setOpacity(1);
      setScale(1);
    } else {
      // Fade out
      const fadeOutProgress = (progress - 0.8) / 0.2;
      setOpacity(1 - fadeOutProgress);
      setScale(1 + fadeOutProgress * 0.2);
    }

    if (progress >= 1 && onComplete) {
      onComplete();
    }
  });

  // Position at center of scene, slightly below top
  const position3D: [number, number, number] = [0, 3.5, 0];

  const mainFontSize = isMobile ? 28 : 42;
  const subFontSize = isMobile ? 16 : 24;
  const color = `#${KOREAN_COLORS.SECONDARY_MAGENTA.toString(16).padStart(6, "0")}`;
  const glowColor = "rgba(255, 0, 255, 0.8)";

  return (
    <Html
      position={position3D}
      center
      distanceFactor={10}
      style={{ pointerEvents: "none" }}
    >
      <div
        data-testid="technique-name"
        style={{
          textAlign: "center",
          opacity,
          transform: `scale(${scale})`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Korean name */}
        <div
          style={{
            fontSize: `${mainFontSize}px`,
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
            color,
            textShadow: `
              0 0 15px ${glowColor},
              0 0 30px ${glowColor},
              3px 3px 6px rgba(0, 0, 0, 0.9)
            `,
            letterSpacing: "4px",
          }}
        >
          {korean}
        </div>

        {/* Divider */}
        <div
          style={{
            width: "60px",
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            margin: "8px auto",
          }}
        />

        {/* English name */}
        <div
          style={{
            fontSize: `${subFontSize}px`,
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
            color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}`,
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          {english}
        </div>
      </div>
    </Html>
  );
};

export default ActionFeedback;
