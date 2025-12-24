import React, { useCallback, useMemo, useState } from "react";
import { PlayerArchetype } from "../../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { hexToRgbaString, hexColorToCSS } from "../../../utils/colorUtils";
import { ArchetypeCardGrid } from "./ArchetypeCardGrid";
import { ArchetypeDisplayHTML, ArchetypeDataShape } from "./ArchetypeDisplayHTML";

export interface EnhancedArchetypeDisplayProps {
  readonly archetypes: readonly ArchetypeDataShape[];
  readonly selectedIndex: number;
  readonly onArchetypeChange: (index: number) => void;
  readonly onPlaySFX: (sound: string) => void;
  readonly width?: number;
  readonly height?: number;
  readonly isMobile?: boolean;
  readonly allowDetailedView?: boolean; // Allow switching to card grid view
}

/**
 * EnhancedArchetypeDisplay - Provides both compact and detailed card view modes
 * Can switch between ArchetypeDisplayHTML (compact) and ArchetypeCardGrid (detailed)
 */
export const EnhancedArchetypeDisplay: React.FC<
  EnhancedArchetypeDisplayProps
> = React.memo(
  ({
    archetypes,
    selectedIndex,
    onArchetypeChange,
    onPlaySFX,
    width = 800,
    height = 300,
    isMobile = false,
    allowDetailedView = true,
  }) => {
    const [viewMode, setViewMode] = useState<"compact" | "detailed">("compact");

    // Convert archetype data to card data format
    const cardData = useMemo(() => {
      return archetypes.map((archetype) => ({
        archetype: Object.values(PlayerArchetype).find(
          (key) => key === archetype.id
        ) as PlayerArchetype,
        id: archetype.id,
        korean: archetype.korean,
        english: archetype.english,
        description: archetype.description,
        color: archetype.color,
        textureKey: archetype.textureKey,
        stats: archetype.stats,
        philosophy: archetype.philosophy,
        specialAbilities: archetype.specialAbilities ?? [], // Use actual data or empty array
      }));
    }, [archetypes]);

    // Get current archetype
    const currentArchetype = useMemo(() => {
      const archetype = archetypes[selectedIndex];
      return Object.values(PlayerArchetype).find(
        (key) => key === archetype.id
      ) as PlayerArchetype;
    }, [archetypes, selectedIndex]);

    // Toggle view mode
    const handleToggleView = useCallback(() => {
      setViewMode((prev) => (prev === "compact" ? "detailed" : "compact"));
      onPlaySFX("menu_hover");
    }, [onPlaySFX]);

    // Handle archetype change from card grid
    const handleArchetypeChangeFromGrid = useCallback(
      (archetype: PlayerArchetype) => {
        const index = archetypes.findIndex((a) => a.id === archetype);
        if (index !== -1) {
          onArchetypeChange(index);
        }
      },
      [archetypes, onArchetypeChange]
    );

    // Memoize colors
    const colors = useMemo(
      () => ({
        toggleButton: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.9),
        toggleText: hexColorToCSS(KOREAN_COLORS.UI_BACKGROUND_DARK),
      }),
      []
    );

    // Adjust height for detailed view
    const detailedHeight = Math.max(height * 2, 600);

    return (
      <div
        style={{
          width: `${width}px`,
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "10px" : "16px",
        }}
        data-testid="enhanced-archetype-display"
      >
        {/* View toggle button (only show if allowed and not mobile) */}
        {allowDetailedView && !isMobile && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <button
              onClick={handleToggleView}
              style={{
                padding: "8px 16px",
                fontSize: "12px",
                backgroundColor: colors.toggleButton,
                color: colors.toggleText,
                border: "none",
                borderRadius: "6px",
                fontFamily: FONT_FAMILY.KOREAN,
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              data-testid="view-toggle-button"
            >
              {viewMode === "compact"
                ? "상세 보기 | Detailed View"
                : "간단 보기 | Compact View"}
            </button>
          </div>
        )}

        {/* Render appropriate view */}
        {viewMode === "compact" ? (
          <ArchetypeDisplayHTML
            archetypes={archetypes}
            selectedIndex={selectedIndex}
            onArchetypeChange={onArchetypeChange}
            onPlaySFX={onPlaySFX}
            width={width}
            height={height}
            isMobile={isMobile}
          />
        ) : (
          <ArchetypeCardGrid
            archetypes={cardData}
            selectedArchetype={currentArchetype}
            onArchetypeChange={handleArchetypeChangeFromGrid}
            onPlaySFX={onPlaySFX}
            width={width}
            height={detailedHeight}
            isMobile={isMobile}
          />
        )}
      </div>
    );
  }
);

EnhancedArchetypeDisplay.displayName = "EnhancedArchetypeDisplay";

