import React from "react";
import { KOREAN_COLORS } from "../../../../types/constants/colors";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import { BaseButtonOverlayHtml } from "../../../shared/base/BaseButtonOverlayHtml";
import type { PhilosophyTopic } from "../hooks/usePhilosophyState";

export interface PhilosophyNavigationProps {
  readonly currentTopic: PhilosophyTopic;
  readonly onTopicChange: (topic: PhilosophyTopic) => void;
  readonly onReturn: () => void;
  readonly isMobile?: boolean;
}

/**
 * Philosophy Navigation Component
 * 
 * **Korean**: 철학 네비게이션
 * 
 * Provides navigation controls for the Philosophy Screen:
 * - Topic selection (Trigrams, Values, Archetypes)
 * - Return to main menu button
 * - Keyboard shortcut hints
 * 
 * Features:
 * - Active topic highlighting
 * - Hover effects with Korean cyberpunk styling
 * - Responsive layout for mobile and desktop
 * - Accessibility with ARIA labels
 * 
 * @example
 * ```typescript
 * <PhilosophyNavigation
 *   currentTopic="trigrams"
 *   onTopicChange={(topic) => setTopic(topic)}
 *   onReturn={() => returnToMenu()}
 *   isMobile={false}
 * />
 * ```
 * 
 * @category Philosophy Components
 */
export const PhilosophyNavigation: React.FC<PhilosophyNavigationProps> = ({
  currentTopic,
  onTopicChange,
  onReturn,
  isMobile = false,
}) => {
  const topics: Array<{ id: PhilosophyTopic; korean: string; english: string }> = [
    { id: "trigrams", korean: "팔괘", english: "Trigrams" },
    { id: "values", korean: "가치관", english: "Values" },
    { id: "archetypes", korean: "무사 유형", english: "Archetypes" },
  ];

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: isMobile ? "15px" : "20px",
        padding: isMobile ? "15px" : "20px",
        background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
        borderRadius: "10px",
        border: `2px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.6)}`,
      }}
      role="navigation"
      aria-label="Philosophy section navigation"
      data-testid="philosophy-navigation"
    >
      {/* Topic selection buttons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: isMobile ? "center" : "flex-start",
        }}
      >
        {topics.map((topic) => {
          const isActive = currentTopic === topic.id;

          return (
            <div
              key={topic.id}
              style={{
                position: "relative",
              }}
            >
              <BaseButtonOverlayHtml
                korean={topic.korean}
                english={topic.english}
                onClick={() => onTopicChange(topic.id)}
                variant={isActive ? "primary" : "secondary"}
                size={isMobile ? "sm" : "md"}
                isMobile={isMobile}
                testId={`topic-button-${topic.id}`}
                ariaLabel={`View ${topic.korean} ${topic.english} section`}
                ariaCurrent={isActive ? "page" : undefined}
                style={{
                  minWidth: isMobile ? "80px" : "100px",
                  boxShadow: isActive
                    ? `0 0 15px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.4)}`
                    : undefined,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Return button and keyboard hints */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Keyboard hints */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              fontSize: "11px",
              color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}`,
            }}
            aria-label="Keyboard shortcuts"
          >
            <span
              style={{
                padding: "4px 8px",
                background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8),
                borderRadius: "4px",
                border: `1px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.5)}`,
                fontWeight: "bold",
              }}
            >
              ESC
            </span>
            <span
              style={{
                padding: "4px 8px",
                background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8),
                borderRadius: "4px",
                border: `1px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.5)}`,
                fontWeight: "bold",
              }}
            >
              M
            </span>
          </div>
        )}

        {/* Return button */}
        <BaseButtonOverlayHtml
          korean="돌아가기"
          english="Return"
          onClick={onReturn}
          variant="danger"
          size={isMobile ? "sm" : "md"}
          isMobile={isMobile}
          testId="return-button"
          ariaLabel="Return to main menu"
        />
      </div>
    </nav>
  );
};

export default PhilosophyNavigation;
