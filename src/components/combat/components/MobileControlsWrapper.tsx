/**
 * MobileControlsWrapper - Mobile touch controls container
 *
 * Wraps all mobile-specific touch controls including:
 * - Virtual D-Pad for movement
 * - Action buttons (attack/block)
 * - Stance wheel for trigram stance selection
 * - Gesture recognizer for swipe actions
 *
 * Only rendered on mobile devices (isMobile=true)
 *
 * @module components/combat/components/MobileControlsWrapper
 * @category Combat UI
 * @korean 모바일컨트롤래퍼
 */

import React from "react";
import {
  ActionButtons,
  GestureRecognizer,
  StanceWheel,
  VirtualDPad,
} from "../../mobile";
import { ButtonEventType } from "../../mobile/ActionButtons";
import { Direction, DPadEventType } from "../../mobile/VirtualDPad";
import { GestureEvent } from "../../../hooks/useTouchControls";

export interface MobileControlsWrapperProps {
  /** Whether mobile controls are enabled */
  readonly enabled: boolean;
  /** Current stance index (0-7) */
  readonly currentStanceIndex: number;
  /** Whether stance wheel is expanded */
  readonly stanceWheelExpanded: boolean;
  /** D-Pad movement handler */
  readonly onMove: (direction: Direction | null, eventType: DPadEventType) => void;
  /** Attack button handler */
  readonly onAttack: () => void;
  /** Block button handler */
  readonly onBlock: (eventType: ButtonEventType) => void;
  /** Stance change handler */
  readonly onStanceChange: (stanceIndex: number) => void;
  /** Stance wheel toggle handler */
  readonly onStanceWheelToggle: () => void;
  /** Gesture handler */
  readonly onGesture: (gesture: GestureEvent) => void;
}

/**
 * MobileControlsWrapper - Container for all mobile touch controls
 *
 * Provides virtual controls for mobile combat gameplay:
 * - Virtual D-Pad (bottom-left) for 8-direction movement
 * - Action Buttons (bottom-right) for attack/block
 * - Stance Wheel (right-center) for trigram stance selection
 * - Gesture Recognition for swipe-based actions
 *
 * @example
 * ```tsx
 * <MobileControlsWrapper
 *   enabled={mobileControlsEnabled}
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
export const MobileControlsWrapper: React.FC<MobileControlsWrapperProps> = ({
  enabled,
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
      {/* Virtual D-Pad - Bottom-left for movement */}
      <VirtualDPad
        onMove={onMove}
        disabled={!enabled}
        opacity={0.8}
      />

      {/* Action Buttons - Bottom-right for attack/block */}
      <ActionButtons
        onAttack={onAttack}
        onBlock={onBlock}
        disabled={!enabled}
        opacity={0.8}
      />

      {/* Stance Wheel - Right-center for trigram stance selection */}
      <StanceWheel
        currentStance={currentStanceIndex}
        onStanceChange={onStanceChange}
        expanded={stanceWheelExpanded}
        onToggle={onStanceWheelToggle}
        disabled={!enabled}
        opacity={0.8}
      />

      {/* Gesture Recognizer - Full-screen swipe detection */}
      <GestureRecognizer
        onGesture={onGesture}
        enabled={enabled}
        showFeedback={true}
        minSwipeDistance={50}
      />
    </>
  );
};

export default MobileControlsWrapper;
