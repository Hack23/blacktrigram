/**
 * Stance Change Animation System - Usage Examples
 * 
 * Demonstrates how to use the stance transition components in your game scenes.
 * 
 * @module components/three/StanceAnimationExamples
 * @category Examples
 * @korean 자세애니메이션예제
 */

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { TrigramStance, PlayerArchetype } from "../../types/common";
import { KOREAN_COLORS } from "../../types/constants";
import {
  Player3DWithTransitions,
  StanceAuraParticles,
  StanceSymbol3D,
  StanceTransitionEffect,
} from "./index";

/**
 * Example 1: Basic Player with Stance Transitions
 * 
 * Shows the simplest way to use Player3DWithTransitions.
 * All effects are enabled by default.
 */
export const BasicStanceTransitionExample: React.FC = () => {
  const [currentStance, setCurrentStance] = useState(TrigramStance.GEON);

  // Cycle through stances for demo
  const nextStance = () => {
    const stances = [
      TrigramStance.GEON,
      TrigramStance.TAE,
      TrigramStance.LI,
      TrigramStance.JIN,
      TrigramStance.SON,
      TrigramStance.GAM,
      TrigramStance.GAN,
      TrigramStance.GON,
    ];
    const currentIndex = stances.indexOf(currentStance);
    const nextIndex = (currentIndex + 1) % stances.length;
    setCurrentStance(stances[nextIndex]);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} color={KOREAN_COLORS.PRIMARY_CYAN} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <PerspectiveCamera makeDefault position={[0, 2, 8]} />

        <Player3DWithTransitions
          playerId="demo-player"
          archetype={PlayerArchetype.MUSA}
          stance={currentStance}
          position={[0, 0, 0]}
          rotation={0}
          health={85}
          maxHealth={100}
          stamina={70}
          ki={80}
          pain={10}
          balance="READY"
          consciousness={100}
          bloodLoss={0}
          isBlocking={false}
          currentAnimation="idle"
          isMobile={false}
          onStanceTransitionComplete={(stance) => {
            console.log("Transitioned to:", stance);
          }}
        />
      </Canvas>

      <button
        onClick={nextStance}
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 24px",
          fontSize: "16px",
          background: "#00ffff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Change Stance (Press 1-8)
      </button>
    </div>
  );
};

/**
 * Example 2: Individual Components
 * 
 * Shows how to use individual stance effect components separately.
 * Useful when you want more control over the visual effects.
 */
export const IndividualComponentsExample: React.FC = () => {
  const stance = TrigramStance.GEON;
  const prevStance: TrigramStance | null = null;
  const showTransition = false;

  return (
    <Canvas gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <PerspectiveCamera makeDefault position={[0, 2, 8]} />

      <group>
        {/* Particle system - always visible */}
        <StanceAuraParticles
          stance={stance}
          intensity={0.8}
          count={200}
          animated={true}
        />

        {/* Floating symbol - always visible */}
        <StanceSymbol3D
          stance={stance}
          heightOffset={2.5}
          animated={true}
          showName={true}
        />

        {/* Transition effect - only during stance change */}
        {showTransition && (
          <StanceTransitionEffect
            fromStance={prevStance}
            toStance={stance}
            onTransitionComplete={() => console.log('Transition complete')}
            duration={0.5}
            showNameOverlay={true}
          />
        )}
      </group>

      {/* Stance selector buttons would go here */}
    </Canvas>
  );
};

/**
 * Example 3: Mobile Optimized
 * 
 * Shows how to optimize effects for mobile devices.
 * Reduces particle count and disables some effects.
 */
export const MobileOptimizedExample: React.FC = () => {
  const stance = TrigramStance.GEON;
  const isMobile = true; // Detect based on screen width in real app

  return (
    <Canvas gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <PerspectiveCamera makeDefault position={[0, 2, 8]} />

      <Player3DWithTransitions
        playerId="mobile-player"
        archetype={PlayerArchetype.MUSA}
        stance={stance}
        position={[0, 0, 0]}
        rotation={0}
        health={100}
        maxHealth={100}
        stamina={100}
        ki={80}
        pain={0}
        balance="READY"
        consciousness={100}
        bloodLoss={0}
        isBlocking={false}
        currentAnimation="idle"
        isMobile={isMobile}
        // Reduce effects for mobile performance
        enableParticles={true} // Automatically reduces to 100 particles
        enableStanceSymbol={true} // Automatically scales down and hides name
        enableTransitionEffects={true} // Automatically hides overlay
      />
    </Canvas>
  );
};

/**
 * Example 4: Performance Mode
 * 
 * Shows how to disable effects for maximum performance.
 * Useful for low-end devices or when many players are on screen.
 */
export const PerformanceModeExample: React.FC = () => {
  const stance = TrigramStance.GEON;

  return (
    <Canvas gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <PerspectiveCamera makeDefault position={[0, 2, 8]} />

      <Player3DWithTransitions
        playerId="performance-player"
        archetype={PlayerArchetype.MUSA}
        stance={stance}
        position={[0, 0, 0]}
        rotation={0}
        health={100}
        maxHealth={100}
        stamina={100}
        ki={80}
        pain={0}
        balance="READY"
        consciousness={100}
        bloodLoss={0}
        isBlocking={false}
        currentAnimation="idle"
        isMobile={false}
        // Disable all effects for maximum performance
        enableParticles={false}
        enableStanceSymbol={false}
        enableTransitionEffects={false}
        enableStanceAudio={false}
      />
    </Canvas>
  );
};

/**
 * Example 5: Custom Transition with Callbacks
 * 
 * Shows how to use callbacks to sync game logic with stance transitions.
 */
export const CustomTransitionExample: React.FC = () => {
  const [stance, setStance] = useState(TrigramStance.GEON);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Example usage (in real app, would be triggered by UI)
  useEffect(() => {
    // Demonstrate transition after 2 seconds
    const timer = setTimeout(() => {
      if (!isTransitioning) {
        setStance(TrigramStance.TAE);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isTransitioning]);

  return (
    <Canvas gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <PerspectiveCamera makeDefault position={[0, 2, 8]} />

      <Player3DWithTransitions
        playerId="callback-player"
        archetype={PlayerArchetype.MUSA}
        stance={stance}
        position={[0, 0, 0]}
        rotation={0}
        health={100}
        maxHealth={100}
        stamina={100}
        ki={80}
        pain={0}
        balance="READY"
        consciousness={100}
        bloodLoss={0}
        isBlocking={false}
        currentAnimation="idle"
        isMobile={false}
        transitionDuration={0.5}
        onStanceTransitionStart={(from, to) => {
          console.log(`Transitioning from ${from} to ${to}`);
          setIsTransitioning(true);
          // Disable stance changes during transition
          // Play transition sound
          // Update game state
        }}
        onStanceTransitionComplete={(stance) => {
          console.log(`Completed transition to ${stance}`);
          setIsTransitioning(false);
          // Re-enable stance changes
          // Apply stance bonuses
          // Update UI
        }}
      />
    </Canvas>
  );
};

/**
 * Keyboard Controls Helper
 * 
 * Maps keyboard 1-8 keys to stance changes.
 * Use this in your game to enable keyboard stance switching.
 */
export const useStanceKeyboardControls = (
  onStanceChange: (stance: TrigramStance) => void
) => {
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const stanceMap: Record<string, TrigramStance> = {
        "1": TrigramStance.GEON,
        "2": TrigramStance.TAE,
        "3": TrigramStance.LI,
        "4": TrigramStance.JIN,
        "5": TrigramStance.SON,
        "6": TrigramStance.GAM,
        "7": TrigramStance.GAN,
        "8": TrigramStance.GON,
      };

      const stance = stanceMap[event.key];
      if (stance) {
        event.preventDefault();
        onStanceChange(stance);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onStanceChange]);
};

/**
 * Example 6: With Keyboard Controls
 * 
 * Complete example with keyboard stance switching (1-8 keys).
 */
export const KeyboardControlExample: React.FC = () => {
  const [stance, setStance] = useState(TrigramStance.GEON);

  // Enable keyboard controls
  useStanceKeyboardControls(setStance);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <PerspectiveCamera makeDefault position={[0, 2, 8]} />

        <Player3DWithTransitions
          playerId="keyboard-player"
          archetype={PlayerArchetype.MUSA}
          stance={stance}
          position={[0, 0, 0]}
          rotation={0}
          health={100}
          maxHealth={100}
          stamina={100}
          ki={80}
          pain={0}
          balance="READY"
          consciousness={100}
          bloodLoss={0}
          isBlocking={false}
          currentAnimation="idle"
          isMobile={false}
        />
      </Canvas>

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "white",
          background: "rgba(0, 0, 0, 0.7)",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        <h3>Keyboard Controls</h3>
        <p>Press 1-8 to change stance:</p>
        <ul>
          <li>1 - 건 (Heaven)</li>
          <li>2 - 태 (Lake)</li>
          <li>3 - 리 (Fire)</li>
          <li>4 - 진 (Thunder)</li>
          <li>5 - 손 (Wind)</li>
          <li>6 - 감 (Water)</li>
          <li>7 - 간 (Mountain)</li>
          <li>8 - 곤 (Earth)</li>
        </ul>
      </div>
    </div>
  );
};

export default {
  BasicStanceTransitionExample,
  IndividualComponentsExample,
  MobileOptimizedExample,
  PerformanceModeExample,
  CustomTransitionExample,
  KeyboardControlExample,
};
