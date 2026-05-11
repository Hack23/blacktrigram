import React, { useCallback, useMemo, useState } from "react";
import { PlayerArchetype } from "../../../../types/common";
import { BaseButtonOverlayHtml } from "../../../shared/base/BaseButtonOverlayHtml";
import { ArchetypeCardGrid } from "./ArchetypeCardGridOverlayHtml";
import {
  ArchetypeDataShape,
  ArchetypeDisplayOverlayHtml,
} from "./ArchetypeDisplayOverlayHtml";

export interface EnhancedArchetypeDisplayProps {
  readonly archetypes: readonly ArchetypeDataShape[];
  readonly selectedIndex: number;
  readonly onArchetypeChange: (index: number) => void;
  readonly onPlaySFX: (sound: string) => void;
  readonly width?: number;
  readonly height?: number;
  readonly isMobile?: boolean; // For controls/haptics only, use width for layout sizing
  readonly allowDetailedView?: boolean; // Allow switching to card grid view
}

/**
 * EnhancedArchetypeDisplay - Provides both compact and detailed card view modes
 * Can switch between ArchetypeDisplayOverlayHtml (compact) and ArchetypeCardGrid (detailed)
 */
export const EnhancedArchetypeDisplay: React.FC<EnhancedArchetypeDisplayProps> =
  React.memo(
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
      const [viewMode, setViewMode] = useState<"compact" | "detailed">(
        "compact",
      );

      const isSmallScreen = width < 768;

      const cardData = useMemo(() => {
        return archetypes.map((archetype) => ({
          archetype: Object.values(PlayerArchetype).find(
            (key) => key === archetype.id,
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

      const currentArchetype = useMemo(() => {
        const archetype = archetypes[selectedIndex];
        return Object.values(PlayerArchetype).find(
          (key) => key === archetype.id,
        ) as PlayerArchetype;
      }, [archetypes, selectedIndex]);

      const handleToggleView = useCallback(() => {
        setViewMode((prev) => (prev === "compact" ? "detailed" : "compact"));
        onPlaySFX("menu_hover");
      }, [onPlaySFX]);

      const handleArchetypeChangeFromGrid = useCallback(
        (archetype: PlayerArchetype) => {
          const index = archetypes.findIndex((a) => a.id === archetype);
          if (index !== -1) {
            onArchetypeChange(index);
          }
        },
        [archetypes, onArchetypeChange],
      );

      const detailedHeight = useMemo(
        () => Math.max(height * 2, 600),
        [height],
      );

      return (
        <div
          style={{
            width: `${width}px`,
            display: "flex",
            flexDirection: "column",
            gap: isSmallScreen ? "10px" : "16px",
          }}
          data-testid="enhanced-archetype-display"
        >
          {/* View toggle button (only show if allowed and not small screen) */}
          {allowDetailedView && !isSmallScreen && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <BaseButtonOverlayHtml
                korean={viewMode === "compact" ? "상세 보기" : "간단 보기"}
                english={viewMode === "compact" ? "Detailed View" : "Compact View"}
                onClick={handleToggleView}
                variant="secondary"
                size="sm"
                testId="view-toggle-button"
                ariaLabel={`Toggle ${viewMode === "compact" ? "detailed" : "compact"} view`}
              />
            </div>
          )}

          {/* Render appropriate view */}
          {viewMode === "compact" ? (
            <ArchetypeDisplayOverlayHtml
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
    },
  );

EnhancedArchetypeDisplay.displayName = "EnhancedArchetypeDisplay";

export default EnhancedArchetypeDisplay;
