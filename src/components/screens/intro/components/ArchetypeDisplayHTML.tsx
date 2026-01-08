import React, { useCallback, useMemo } from "react";
import { FALLBACK_ARCHETYPE_IMAGE, FONT_FAMILY, KOREAN_COLORS } from "../../../../../types/constants";
import { hexToRgbaString } from "../../../../../utils/colorUtils";
import "./MenuSection.css";

// Enhanced shape matching PLAYER_ARCHETYPES_DATA entries
export interface ArchetypeDataShape {
  readonly id: string;
  readonly korean: string;
  readonly english: string;
  readonly description: string;
  readonly color: number;
  readonly textureKey: string;
  readonly stats: {
    readonly attackPower: number;
    readonly defense: number;
    readonly speed: number;
    readonly technique: number;
  };
  readonly philosophy: {
    readonly korean: string;
    readonly english: string;
  };
  readonly specialAbilities?: readonly string[]; // Optional special abilities
}

export interface ArchetypeDisplayHTMLProps {
  readonly archetypes: readonly ArchetypeDataShape[];
  readonly selectedIndex: number;
  readonly onArchetypeChange: (index: number) => void;
  readonly onPlaySFX: (sound: string) => void;
  readonly width?: number;
  readonly height?: number;
  readonly isMobile?: boolean;
}

/**
 * HTML-based ArchetypeDisplay component for Three.js integration
 */
export const ArchetypeDisplayHTML: React.FC<ArchetypeDisplayHTMLProps> =
  React.memo(
    ({
      archetypes,
      selectedIndex,
      onArchetypeChange,
      onPlaySFX,
      width = 800,
      height = 300,
      isMobile = false,
    }) => {
      const selectedArchetype = archetypes[selectedIndex];

      // Responsive sizing with large desktop support
      const isLargeContainer = width >= 1100;
      const archImageWidth = isMobile ? 140 : isLargeContainer ? 120 : 180;
      const archImageHeight = isMobile ? 200 : isLargeContainer ? 170 : 260;
      const containerPadding = isMobile ? 20 : isLargeContainer ? 12 : 20;
      const contentGap = isMobile ? 10 : isLargeContainer ? 8 : 16;
      const infoGap = isMobile ? 8 : isLargeContainer ? 6 : 12;
      const titleFontSize = isMobile ? 14 : isLargeContainer ? 14 : 18;
      const philosophyFontSize = isMobile ? 10 : isLargeContainer ? 10 : 12;
      const statLabelFontSize = isMobile ? 9 : isLargeContainer ? 9 : 11;
      const statBarHeight = isMobile ? 10 : isLargeContainer ? 10 : 12;

      const handlePrevious = useCallback(() => {
        const newIndex =
          selectedIndex === 0 ? archetypes.length - 1 : selectedIndex - 1;
        onArchetypeChange(newIndex);
        onPlaySFX("menu_hover");
      }, [selectedIndex, archetypes.length, onArchetypeChange, onPlaySFX]);

      const handleNext = useCallback(() => {
        const newIndex = (selectedIndex + 1) % archetypes.length;
        onArchetypeChange(newIndex);
        onPlaySFX("menu_hover");
      }, [selectedIndex, archetypes.length, onArchetypeChange, onPlaySFX]);

      // Convert real stats to 0-1 scale for visualization
      const combatStats = useMemo(() => {
        const maxStatValue = 100;
        return [
          {
            korean: "공격",
            english: "Attack",
            value: selectedArchetype.stats.attackPower / maxStatValue,
            rawValue: selectedArchetype.stats.attackPower,
          },
          {
            korean: "방어",
            english: "Defense",
            value: selectedArchetype.stats.defense / maxStatValue,
            rawValue: selectedArchetype.stats.defense,
          },
          {
            korean: "속도",
            english: "Speed",
            value: selectedArchetype.stats.speed / maxStatValue,
            rawValue: selectedArchetype.stats.speed,
          },
          {
            korean: "기술",
            english: "Technique",
            value: selectedArchetype.stats.technique / maxStatValue,
            rawValue: selectedArchetype.stats.technique,
          },
        ];
      }, [selectedArchetype.stats]);

      // Memoize RGBA color calculations
      const colors = useMemo(
        () => ({
          archetypeColor: `#${selectedArchetype.color
            .toString(16)
            .padStart(6, "0")}`,
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
          border: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.7),
          titleGold: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(
            6,
            "0"
          )}`,
          statsBackground: hexToRgbaString(
            KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
            0.9
          ),
          statsBorder: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.5),
          statBarBackground: hexToRgbaString(
            KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
            1
          ),
          statBarFill: hexToRgbaString(selectedArchetype.color, 0.9),
        }),
        [selectedArchetype.color]
      );

      // Get archetype image path
      const archetypeImagePath = useMemo(() => {
        return `/assets/visual/archetypes/${selectedArchetype.textureKey}.png`;
      }, [selectedArchetype.textureKey]);

      return (
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: `${contentGap}px`,
            background: colors.background,
            borderRadius: "8px",
            border: `2px solid ${colors.archetypeColor}`,
            padding: `${containerPadding}px`,
            position: "relative",
            overflow: "hidden",
          }}
          data-testid="archetype-display-container"
        >
          {/* Left Side - Character Image and Navigation */}
          <div
            style={{
              width: `${archImageWidth + 40}px`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: `${infoGap}px`,
              flexShrink: 0,
            }}
            data-testid="archetype-image-section"
          >
            {/* Character Image */}
            <div
              style={{
                width: `${archImageWidth + 20}px`,
                height: `${archImageHeight + 20}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                background: `radial-gradient(circle, ${colors.archetypeColor}26, transparent)`,
                borderRadius: "4px",
                border: `2px solid ${colors.archetypeColor}`,
              }}
              data-testid="archetype-image-container"
            >
              <img
                src={archetypeImagePath}
                alt={`${selectedArchetype.korean} - ${selectedArchetype.english}`}
                style={{
                  width: `${archImageWidth}px`,
                  height: `${archImageHeight}px`,
                  objectFit: "contain",
                  cursor: "pointer",
                }}
                onClick={handleNext}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${selectedArchetype.korean} ${selectedArchetype.english} - Click or press Enter to cycle to next archetype`}
                data-testid="archetype-image"
                onError={(e) => {
                  // Fallback if image doesn't load: use Black Trigram logo, prevent infinite loop
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.endsWith(FALLBACK_ARCHETYPE_IMAGE)) {
                    target.src = FALLBACK_ARCHETYPE_IMAGE;
                    target.alt = `${selectedArchetype.korean} (image unavailable)`;
                  }
                }}
              />
            </div>

            {/* Navigation Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                width: "100%",
              }}
              data-testid="archetype-navigation"
            >
              <button
                onClick={handlePrevious}
                aria-label="Previous archetype"
                className="archetype-nav-button"
                style={{
                  flex: 1,
                  height: "30px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(
                    6,
                    "0"
                  )}`,
                  background: colors.statsBackground,
                  border: `1px solid ${hexToRgbaString(
                    KOREAN_COLORS.ACCENT_GOLD,
                    0.7
                  )}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                data-testid="prev-archetype-button"
              >
                ◀
              </button>
              <button
                onClick={handleNext}
                aria-label="Next archetype"
                className="archetype-nav-button"
                style={{
                  flex: 1,
                  height: "30px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(
                    6,
                    "0"
                  )}`,
                  background: colors.statsBackground,
                  border: `1px solid ${hexToRgbaString(
                    KOREAN_COLORS.ACCENT_GOLD,
                    0.7
                  )}`,
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                data-testid="next-archetype-button"
              >
                ▶
              </button>
            </div>
          </div>

          {/* Right Side - Archetype Information */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              gap: `${infoGap}px`,
              minWidth: 0,
              overflow: "hidden",
            }}
            data-testid="archetype-info"
          >
            {/* Header with name and counter */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: `${titleFontSize}px`,
                  fontWeight: "bold",
                  fontFamily: FONT_FAMILY.KOREAN,
                  color: colors.archetypeColor,
                }}
                data-testid="archetype-title"
              >
                {selectedArchetype.korean} | {selectedArchetype.english}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  fontFamily: FONT_FAMILY.PRIMARY,
                  color: colors.archetypeColor,
                }}
                data-testid="archetype-counter"
              >
                {selectedIndex + 1} / {archetypes.length}
              </div>
            </div>

            {/* Philosophy */}
            <div
              style={{
                fontSize: `${philosophyFontSize}px`,
                fontStyle: "italic",
                fontFamily: FONT_FAMILY.KOREAN,
                color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(
                  6,
                  "0"
                )}`,
                lineHeight: "1.4",
              }}
              data-testid="archetype-philosophy"
            >
              {selectedArchetype.philosophy.korean} |{" "}
              {selectedArchetype.philosophy.english}
            </div>

            {/* Combat Stats */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
              data-testid="combat-stats"
            >
              <div
                style={{
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "bold",
                  fontFamily: FONT_FAMILY.KOREAN,
                  color: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(
                    6,
                    "0"
                  )}`,
                }}
              >
                전투 능력치 | Combat Stats
              </div>

              {/* Individual stat bars */}
              {combatStats.map((stat) => (
                <div
                  key={stat.korean}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  {/* Stat label */}
                  <div
                    style={{
                      width: "80px",
                      fontSize: `${statLabelFontSize}px`,
                      fontFamily: FONT_FAMILY.KOREAN,
                      color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(
                        16
                      ).padStart(6, "0")}`,
                      flexShrink: 0,
                    }}
                  >
                    {stat.korean} | {stat.english}
                  </div>

                  {/* Stat bar container */}
                  <div
                    style={{
                      flex: 1,
                      height: `${statBarHeight}px`,
                      background: colors.statBarBackground,
                      borderRadius: "2px",
                      position: "relative",
                      border: `1px solid ${colors.archetypeColor}`,
                    }}
                  >
                    <div
                      style={{
                        width: `${stat.value * 100}%`,
                        height: "100%",
                        background: colors.statBarFill,
                        borderRadius: "2px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>

                  {/* Stat value */}
                  <div
                    style={{
                      width: "30px",
                      fontSize: isMobile ? "9px" : "11px",
                      fontWeight: "bold",
                      fontFamily: FONT_FAMILY.PRIMARY,
                      color: colors.archetypeColor,
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {stat.rawValue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  );

ArchetypeDisplayHTML.displayName = "ArchetypeDisplayHTML";

export default ArchetypeDisplayHTML;
