/**
 * ArchetypeDisplayThree - Improved archetype display using Three.js Korean UI components
 * 
 * Replaces ArchetypeDisplayHTML with reusable ArchetypeCard and KoreanButton components
 */

import React, { useCallback, useMemo } from "react";
import { PlayerArchetype } from "../../../types/common";
import { ArchetypeCard, KoreanButton, KoreanText as KoreanText3D } from "../../three";

// Shared constant for archetype ID to enum mapping
const ARCHETYPE_ID_TO_ENUM: Record<string, PlayerArchetype> = {
  musa: PlayerArchetype.MUSA,
  amsalja: PlayerArchetype.AMSALJA,
  hacker: PlayerArchetype.HACKER,
  jeongbo_yowon: PlayerArchetype.JEONGBO_YOWON,
  jojik_pokryeokbae: PlayerArchetype.JOJIK_POKRYEOKBAE,
};

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
}

export interface ArchetypeDisplayThreeProps {
  readonly archetypes: readonly ArchetypeDataShape[];
  readonly selectedIndex: number;
  readonly onArchetypeChange: (index: number) => void;
  readonly onPlaySFX: (sound: string) => void;
  readonly position?: [number, number, number];
  readonly width?: number;
}

/**
 * ArchetypeDisplayThree Component
 * 
 * Uses the new Three.js Korean UI ArchetypeCard component for consistent theming.
 * Displays player archetype with navigation buttons.
 * 
 * @example
 * ```tsx
 * <ArchetypeDisplayThree
 *   archetypes={archetypeData}
 *   selectedIndex={0}
 *   onArchetypeChange={handleChange}
 *   onPlaySFX={audio.playSFX}
 *   position={[0, -1, 0]}
 * />
 * ```
 */
export const ArchetypeDisplayThree: React.FC<ArchetypeDisplayThreeProps> = ({
  archetypes,
  selectedIndex,
  onArchetypeChange,
  onPlaySFX,
  position = [0, 0, 0],
  width = 400,
}) => {
  const selectedArchetype = archetypes[selectedIndex];

  // Map archetype ID to PlayerArchetype enum
  const archetypeEnum = useMemo(() => {
    return ARCHETYPE_ID_TO_ENUM[selectedArchetype.id] ?? PlayerArchetype.MUSA;
  }, [selectedArchetype.id]);

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

  const handleSelect = useCallback(
    (archetype: PlayerArchetype) => {
      const index = archetypes.findIndex((a) => {
        return ARCHETYPE_ID_TO_ENUM[a.id] === archetype;
      });
      if (index >= 0) {
        onArchetypeChange(index);
        onPlaySFX("menu_select");
      }
    },
    [archetypes, onArchetypeChange, onPlaySFX]
  );

  return (
    <>
      {/* Title */}
      <KoreanText3D
        korean="플레이어 원형 선택"
        english="Select Player Archetype"
        size="large"
        position={[position[0], position[1] + 2.5, position[2]]}
        testId="archetype-title"
      />

      {/* Archetype Card */}
      <ArchetypeCard
        archetype={archetypeEnum}
        onSelect={handleSelect}
        isSelected={true}
        position={position}
        width={width}
        showStats={true}
        testId="archetype-card-display"
      />

      {/* Navigation Buttons */}
      <KoreanButton
        korean="◀ 이전"
        english="Previous"
        onClick={handlePrevious}
        variant="secondary"
        size="sm"
        position={[position[0] - 2.5, position[1] - 2, position[2]]}
        testId="archetype-prev-button"
      />

      <KoreanButton
        korean="다음 ▶"
        english="Next"
        onClick={handleNext}
        variant="secondary"
        size="sm"
        position={[position[0] + 2.5, position[1] - 2, position[2]]}
        testId="archetype-next-button"
      />

      {/* Selection indicator */}
      <KoreanText3D
        korean={`${selectedIndex + 1} / ${archetypes.length}`}
        english=""
        size="small"
        position={[position[0], position[1] - 2.8, position[2]]}
        testId="archetype-counter"
      />
    </>
  );
};

ArchetypeDisplayThree.displayName = "ArchetypeDisplayThree";
