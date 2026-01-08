/**
 * Enhanced Player3D component with stance transition animations
 *
 * Demonstrates integration of stance change visual effects:
 * - StanceSymbol3D for floating trigram symbol
 * - StanceTransitionEffect for smooth transitions
 *
 * This wrapper can be used to enhance SkeletalPlayer3D with automatic
 * stance change detection and visual effects.
 *
 * @module components/three/Player3DWithTransitions
 * @category 3D Components
 * @korean 자세전환플레이어3D
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "../../../../audio/AudioProvider";
import { TrigramStance } from "../../../../types/common";
import type { Player3DUnifiedProps } from "../../../../types/player-visual";
import { SkeletalPlayer3D } from "./SkeletalPlayer3D";
import StanceSymbol3D from "../effects/StanceSymbol3D";
import StanceTransitionEffect from "../effects/StanceTransitionEffect";

/**
 * Props for Player3DWithTransitions component
 */
export interface Player3DWithTransitionsProps extends Player3DUnifiedProps {
  /** Enable stance transition effects (default: true) */
  readonly enableTransitionEffects?: boolean;
  /** Enable floating stance symbol (default: true) */
  readonly enableStanceSymbol?: boolean;
  /** Enable stance change audio (default: true) */
  readonly enableStanceAudio?: boolean;
  /** Transition duration in seconds (default: 0.5) */
  readonly transitionDuration?: number;
  /** Callback when stance transition starts */
  readonly onStanceTransitionStart?: (
    fromStance: TrigramStance,
    toStance: TrigramStance
  ) => void;
  /** Callback when stance transition completes */
  readonly onStanceTransitionComplete?: (stance: TrigramStance) => void;
}

/**
 * Audio asset IDs for stance transitions
 */
const AUDIO_ASSETS = {
  STANCE_CHANGE: "stance_change",
} as const;

/**
 * Player3DWithTransitions Component
 *
 * Enhanced player component with automatic stance change detection and visual effects.
 * Wraps SkeletalPlayer3D and adds:
 * - Floating trigram symbol
 * - Smooth transition effects
 * - Audio synchronization
 *
 * Performance optimized:
 * - Effects can be individually disabled for mobile
 * - Uses stance change detection to minimize updates
 * - Reuses components efficiently
 *
 * @example
 * ```tsx
 * <Player3DWithTransitions
 *   playerId="player1"
 *   archetype={PlayerArchetype.MUSA}
 *   stance={currentStance}
 *   position={[0, 0, 0]}
 *   rotation={0}
 *   health={85}
 *   maxHealth={100}
 *   stamina={60}
 *   ki={40}
 *   pain={20}
 *   balance="READY"
 *   consciousness={100}
 *   bloodLoss={0}
 *   currentAnimation="idle"
 *   isMobile={false}
 *   enableTransitionEffects={true}
 *   enableStanceSymbol={true}
 *   onStanceTransitionComplete={(stance) => console.log('Transitioned to:', stance)}
 * />
 * ```
 */
export const Player3DWithTransitions: React.FC<
  Player3DWithTransitionsProps
> = ({
  stance,
  ki,
  isMobile = false,
  enableTransitionEffects = true,
  enableStanceSymbol = true,
  enableStanceAudio = true,
  transitionDuration = 0.5,
  onStanceTransitionStart,
  onStanceTransitionComplete,
  ...playerProps
}) => {
  const audio = useAudio();
  const prevStanceRef = useRef<TrigramStance>(stance);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fromStance, setFromStance] = useState<TrigramStance>(stance);

  // Detect stance changes - external effect (audio) justifies useEffect
   
  useEffect(() => {
    const previousStance = prevStanceRef.current;

    // Only trigger if stance actually changed
    if (previousStance !== stance) {
      prevStanceRef.current = stance;

      // External effects: audio playback (external system) and callbacks
      // These setState calls are intentional - triggered by prop change, not creating infinite loops
      setIsTransitioning(true);
      setFromStance(previousStance);
      onStanceTransitionStart?.(previousStance, stance);

      // External system: audio playback
      if (enableStanceAudio) {
        audio.playSFX(AUDIO_ASSETS.STANCE_CHANGE);
      }
    }
  }, [stance, audio, enableStanceAudio, onStanceTransitionStart]);

  // Handle transition completion
  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
    onStanceTransitionComplete?.(stance);
  }, [stance, onStanceTransitionComplete]);

  return (
    <group data-testid="player3d-with-transitions">
      {/* Base player model */}
      <SkeletalPlayer3D
        stance={stance}
        ki={ki}
        isMobile={isMobile}
        {...playerProps}
      />

      {/* Floating stance symbol */}
      {enableStanceSymbol && (
        <StanceSymbol3D
          stance={stance}
          heightOffset={2.5}
          animated={true}
          scale={isMobile ? 0.8 : 1.0} // Smaller on mobile
          showName={!isMobile} // Hide Korean name on mobile for clarity
        />
      )}

      {/* Stance transition effect */}
      {enableTransitionEffects && isTransitioning && (
        <StanceTransitionEffect
          fromStance={fromStance}
          toStance={stance}
          onTransitionComplete={handleTransitionComplete}
          duration={transitionDuration}
          showNameOverlay={!isMobile} // Hide overlay on mobile
        />
      )}
    </group>
  );
};

export default Player3DWithTransitions;
