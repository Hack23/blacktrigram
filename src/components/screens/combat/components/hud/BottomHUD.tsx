/**
 * BottomHUD - Bottom HUD container for combat controls
 *
 * Organizes all bottom-level HUD elements:
 * - Technique bar (bottom center)
 * - Combat controls and stats (bottom left)
 * - Mobile controls (mobile only)
 * - AI difficulty indicator
 *
 * 하단 HUD - 전투 컨트롤 컨테이너
 */

import React from "react";
import { Technique } from "../../../../../types";
import { PlayerState } from "../../../../../systems/player";
import { DifficultyTier } from "../../../../../systems/ai/AdaptiveDifficulty";
import { CombatControlsPanel } from "../controls/CombatControlsPanel";
import { DifficultyIndicator } from "./DifficultyIndicator";
import { TechniqueBarContainer } from "../../../../shared/three/ui/TechniqueBarContainer";
import { MobileControlsWrapper } from "./MobileControlsWrapper";
import { Direction, DPadEventType } from "../../../../shared/mobile/VirtualDPad";
import { ButtonEventType } from "../../../../shared/mobile/ActionButtons";
import { GestureEvent } from "../../../../../hooks/useTouchControls";

/**
 * Props for the BottomHUD component.
 * Contains state for technique bar, controls, and mobile interactions.
 */
export interface BottomHUDProps {
  /** Screen width for responsive positioning */
  readonly width: number;
  /** Screen height for responsive positioning */
  readonly height: number;
  /** Mobile layout flag */
  readonly isMobile: boolean;

  /** Technique bar state */
  readonly techniqueBarVisible: boolean;
  readonly availableTechniques: readonly Technique[];
  readonly player: PlayerState;
  readonly selectedTechniqueIndex: number;
  readonly techniqueCooldowns: ReadonlyMap<string, number>;
  readonly onTechniqueSelect: (index: number) => void;
  readonly onTechniqueHover: (technique: Technique | null) => void;

  /** Combat controls state */
  readonly combatMessages: readonly string[];

  /** AI difficulty state */
  readonly currentDifficultyTier: DifficultyTier;

  /** Mobile controls state (only used when isMobile=true) */
  readonly mobileControlsEnabled: boolean;
  readonly currentStanceIndex: number;
  readonly stanceWheelExpanded: boolean;
  readonly onMove: (direction: Direction | null, eventType: DPadEventType) => void;
  readonly onAttack: () => void;
  readonly onBlock: (eventType: ButtonEventType) => void;
  readonly onStanceChange: (stanceIndex: number) => void;
  readonly onStanceWheelToggle: () => void;
  readonly onGesture: (gesture: GestureEvent) => void;
}

/**
 * BottomHUD Component
 *
 * Organizes all bottom-level HUD elements including technique bar,
 * combat controls, and mobile touch controls.
 *
 * @example
 * ```tsx
 * <BottomHUD
 *   width={1200}
 *   height={800}
 *   isMobile={false}
 *   techniqueBarVisible={combatState.roundStarted && !combatState.roundEnded}
 *   availableTechniques={techniqueSelection.availableTechniques}
 *   player={validPlayers[0]}
 *   selectedTechniqueIndex={techniqueSelection.selectedIndex}
 *   techniqueCooldowns={cooldownsMap}
 *   onTechniqueSelect={techniqueSelection.selectTechnique}
 *   onTechniqueHover={(tech) => {}}
 *   combatMessages={combatState.combatMessages}
 *   currentDifficultyTier={currentDifficultyTier}
 *   mobileControlsEnabled={mobileControlsEnabled}
 *   currentStanceIndex={currentStanceIndex}
 *   stanceWheelExpanded={stanceWheelExpanded}
 *   onMove={handleMobileMove}
 *   onAttack={handleMobileAttack}
 *   onBlock={handleMobileBlock}
 *   onStanceChange={handleMobileStanceChange}
 *   onStanceWheelToggle={() => setStanceWheelExpanded(!stanceWheelExpanded)}
 *   onGesture={handleMobileGesture}
 * />
 * ```
 */
export const BottomHUD: React.FC<BottomHUDProps> = ({
  width,
  height,
  isMobile,
  techniqueBarVisible,
  availableTechniques,
  player,
  selectedTechniqueIndex,
  techniqueCooldowns,
  onTechniqueSelect,
  onTechniqueHover,
  combatMessages,
  currentDifficultyTier,
  mobileControlsEnabled,
  currentStanceIndex,
  stanceWheelExpanded,
  onMove,
  onAttack,
  onBlock,
  onStanceChange,
  onStanceWheelToggle,
  onGesture,
}) => {
  return (
    <>
      {/* Technique Bar - Bottom Center */}
      <TechniqueBarContainer
        visible={techniqueBarVisible}
        techniques={availableTechniques}
        player={player}
        selectedIndex={selectedTechniqueIndex}
        cooldowns={techniqueCooldowns}
        onTechniqueSelect={onTechniqueSelect}
        onTechniqueHover={onTechniqueHover}
        isMobile={isMobile}
        screenWidth={width}
        screenHeight={height}
      />

      {/* Combat Controls and Stats */}
      <CombatControlsPanel
        combatMessages={combatMessages}
        isMobile={isMobile}
      />

      {/* AI Difficulty Indicator */}
      <DifficultyIndicator tier={currentDifficultyTier} isMobile={isMobile} />

      {/* Mobile Touch Controls - Only shown on mobile devices */}
      {isMobile && (
        <MobileControlsWrapper
          enabled={mobileControlsEnabled}
          currentStanceIndex={currentStanceIndex}
          stanceWheelExpanded={stanceWheelExpanded}
          onMove={onMove}
          onAttack={onAttack}
          onBlock={onBlock}
          onStanceChange={onStanceChange}
          onStanceWheelToggle={onStanceWheelToggle}
          onGesture={onGesture}
        />
      )}
    </>
  );
};

export default BottomHUD;
