import React from "react";
import { KOREAN_COLORS } from "../../../../types/constants/colors";
import { hexToRgbaString } from "../../../../utils/colorUtils";
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
 * @public
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
            <button
              key={topic.id}
              onClick={() => onTopicChange(topic.id)}
              style={{
                padding: isMobile ? "10px 16px" : "12px 20px",
                background: isActive
                  ? hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.3)
                  : hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.7),
                border: `2px solid ${
                  isActive
                    ? `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`
                    : hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.4)
                }`,
                borderRadius: "8px",
                color: isActive
                  ? `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`
                  : `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}`,
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px",
                minWidth: isMobile ? "80px" : "100px",
                boxShadow: isActive
                  ? `0 0 15px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.4)}`
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = hexToRgbaString(
                    KOREAN_COLORS.PRIMARY_CYAN,
                    0.2
                  );
                  e.currentTarget.style.borderColor = `#${KOREAN_COLORS.PRIMARY_CYAN.toString(
                    16
                  ).padStart(6, "0")}`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = hexToRgbaString(
                    KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                    0.7
                  );
                  e.currentTarget.style.borderColor = hexToRgbaString(
                    KOREAN_COLORS.PRIMARY_CYAN,
                    0.4
                  );
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
              aria-label={`View ${topic.korean} ${topic.english} section`}
              aria-current={isActive ? "page" : undefined}
              data-testid={`topic-button-${topic.id}`}
            >
              <span>{topic.korean}</span>
              <span
                style={{
                  fontSize: isMobile ? "11px" : "12px",
                  opacity: 0.8,
                }}
              >
                {topic.english}
              </span>
            </button>
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
        <button
          onClick={onReturn}
          style={{
            padding: isMobile ? "10px 20px" : "12px 24px",
            background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.9),
            border: `2px solid ${hexToRgbaString(KOREAN_COLORS.KOREAN_RED, 0.8)}`,
            borderRadius: "8px",
            color: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}`,
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = hexToRgbaString(
              KOREAN_COLORS.KOREAN_RED,
              0.2
            );
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = `0 0 15px ${hexToRgbaString(
              KOREAN_COLORS.KOREAN_RED,
              0.4
            )}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = hexToRgbaString(
              KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
              0.9
            );
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
          aria-label="Return to main menu"
          data-testid="return-button"
        >
          <span>돌아가기</span>
          <span
            style={{
              fontSize: isMobile ? "11px" : "12px",
              opacity: 0.8,
            }}
          >
            Return
          </span>
        </button>
      </div>
    </nav>
  );
};

export default PhilosophyNavigation;
