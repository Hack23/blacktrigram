/**
 * Enhanced Player3D component with stance transition animations
 * 
 * Demonstrates integration of stance change visual effects:
 * - StanceAuraParticles for particle system
 * - StanceSymbol3D for floating trigram symbol
 * - StanceTransitionEffect for smooth transitions
 * 
 * This wrapper can be used to enhance Player3DUnified with automatic
 * stance change detection and visual effects.
 * 
 * @module components/three/Player3DWithTransitions
 * @category 3D Components
 * @korean 자세전환플레이어3D
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { TrigramStance } from "../../types/common";
import type { Player3DUnifiedProps } from "../../types/player-visual";
import { useAudio } from "../../audio/AudioProvider";
import Player3DUnified from "./Player3DUnified";
import StanceAuraParticles from "./StanceAuraParticles";
import StanceSymbol3D from "./StanceSymbol3D";
import StanceTransitionEffect from "./StanceTransitionEffect";

/**
 * Props for Player3DWithTransitions component
 */
export interface Player3DWithTransitionsProps extends Player3DUnifiedProps {
  /** Enable stance transition effects (default: true) */
  readonly enableTransitionEffects?: boolean;
  /** Enable particle effects (default: true) */
  readonly enableParticles?: boolean;
  /** Enable floating stance symbol (default: true) */
  readonly enableStanceSymbol?: boolean;
  /** Enable stance change audio (default: true) */
  readonly enableStanceAudio?: boolean;
  /** Transition duration in seconds (default: 0.5) */
  readonly transitionDuration?: number;
  /** Callback when stance transition starts */
  readonly onStanceTransitionStart?: (fromStance: TrigramStance, toStance: TrigramStance) => void;
  /** Callback when stance transition completes */
  readonly onStanceTransitionComplete?: (stance: TrigramStance) => void;
}

/**
 * Player3DWithTransitions Component
 * 
 * Enhanced player component with automatic stance change detection and visual effects.
 * Wraps Player3DUnified and adds:
 * - Particle system for stance aura
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
 *   enableParticles={true}
 *   enableStanceSymbol={true}
 *   onStanceTransitionComplete={(stance) => console.log('Transitioned to:', stance)}
 * />
 * ```
 */
export const Player3DWithTransitions: React.FC<Player3DWithTransitionsProps> = ({
  stance,
  ki,
  isMobile = false,
  enableTransitionEffects = true,
  enableParticles = true,
  enableStanceSymbol = true,
  enableStanceAudio = true,
  transitionDuration = 0.5,
  onStanceTransitionStart,
  onStanceTransitionComplete,
  ...playerProps
}) => {
  const audio = useAudio();
  const [previousStance, setPreviousStance] = useState<TrigramStance | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isFirstRenderRef = useRef(true);

  // Detect stance changes
  useEffect(() => {
    // Skip transition effect on first render
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      setPreviousStance(stance);
      return;
    }

    // Check if stance actually changed
    if (previousStance !== null && previousStance !== stance) {
      // Trigger transition
      setIsTransitioning(true);
      
      // Callback for transition start
      onStanceTransitionStart?.(previousStance, stance);

      // Play stance change SFX if enabled
      if (enableStanceAudio && audio.isAudioReady) {
        audio.playSFX("stance_change");
      }

      // Update previous stance
      setPreviousStance(stance);
    }
  }, [stance, previousStance, audio, enableStanceAudio, onStanceTransitionStart]);

  // Handle transition completion
  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
    onStanceTransitionComplete?.(stance);
  }, [stance, onStanceTransitionComplete]);

  // Calculate particle intensity based on Ki
  const particleIntensity = ki / 100;

  return (
    <group data-testid="player3d-with-transitions">
      {/* Base player model */}
      <Player3DUnified
        stance={stance}
        ki={ki}
        isMobile={isMobile}
        {...playerProps}
      />

      {/* Particle effects (stance-specific aura) */}
      {enableParticles && (
        <StanceAuraParticles
          stance={stance}
          intensity={particleIntensity}
          count={isMobile ? 100 : 200} // Reduce particle count on mobile
          animated={true}
          spread={2.0}
        />
      )}

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
          fromStance={previousStance}
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
