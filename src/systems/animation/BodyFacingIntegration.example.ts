/**
 * Body Facing System Integration Example
 * 
 * Demonstrates how to integrate body facing direction system with:
 * - Player state initialization
 * - Combat loop updates
 * - Attack/defend animation locking
 * - 180° turn animation handling
 * 
 * @module systems/animation/examples/BodyFacingIntegration
 * @category Integration Examples
 * @korean 몸향하기통합예제
 */

import {
  bodyFacingSystem,
  createDefaultBodyFacing,
  lockFacing,
  unlockFacing,
  isTurning,
  getFacingAngleRadians,
  getHeadAngleRadians,
} from "../BodyFacingSystem";
import type { PlayerState } from "../../player";
import type { Position } from "@/types";

/**
 * Example: Initialize player with body facing
 * 
 * When creating a new player, add body facing state.
 */
export function examplePlayerInitialization(): PlayerState {
  // Create base player (assuming this function exists)
  const basePlayer = createBasePlayer();
  
  // Add body facing - initially facing right (0°)
  const playerWithFacing: PlayerState = {
    ...basePlayer,
    bodyFacing: createDefaultBodyFacing(0),
  };
  
  return playerWithFacing;
}

/**
 * Example: Update body facing in game loop
 * 
 * Called every frame at 60fps to smoothly rotate toward opponent.
 */
export function exampleGameLoopUpdate(
  player: PlayerState,
  opponent: PlayerState,
  deltaTime: number,
  currentTime: number
): PlayerState {
  // Skip if player has no body facing initialized
  if (!player.bodyFacing) {
    return player;
  }
  
  // Update body facing to track opponent
  const updatedFacing = bodyFacingSystem.update(
    player.bodyFacing,
    player.position,
    opponent.position,
    deltaTime,
    currentTime
  );
  
  return {
    ...player,
    bodyFacing: updatedFacing,
  };
}

/**
 * Example: Lock facing during attack
 * 
 * When player starts attack animation, lock facing direction.
 */
export function exampleAttackStart(player: PlayerState): PlayerState {
  if (!player.bodyFacing) {
    return player;
  }
  
  // Lock facing so player doesn't rotate during attack
  const lockedFacing = lockFacing(player.bodyFacing);
  
  return {
    ...player,
    bodyFacing: lockedFacing,
  };
}

/**
 * Example: Unlock facing after attack completes
 * 
 * When attack animation finishes, unlock facing to resume tracking.
 */
export function exampleAttackComplete(player: PlayerState): PlayerState {
  if (!player.bodyFacing) {
    return player;
  }
  
  // Unlock facing to resume opponent tracking
  const unlockedFacing = unlockFacing(player.bodyFacing);
  
  return {
    ...player,
    bodyFacing: unlockedFacing,
  };
}

/**
 * Example: Check for 180° turn in progress
 * 
 * Prevent movement and other actions during turn animation.
 */
export function exampleMovementCheck(player: PlayerState): boolean {
  if (!player.bodyFacing) {
    return true; // No facing system, allow movement
  }
  
  // Don't allow movement during 180° turn
  if (isTurning(player.bodyFacing)) {
    console.log("Cannot move during 180° turn animation");
    return false;
  }
  
  return true; // Movement allowed
}

/**
 * Example: Apply rotations to Three.js mesh
 * 
 * Use in Three.js component to apply body/head rotations.
 */
export function exampleThreeJSRotation(
  player: PlayerState,
  torsoMesh: THREE.Mesh,
  headMesh: THREE.Mesh
): void {
  if (!player.bodyFacing) {
    return;
  }
  
  // Apply torso rotation (Y-axis for horizontal rotation)
  const torsoRotation = getFacingAngleRadians(player.bodyFacing);
  torsoMesh.rotation.y = torsoRotation;
  
  // Apply head rotation (includes offset for independent tracking)
  const headRotation = getHeadAngleRadians(player.bodyFacing);
  headMesh.rotation.y = headRotation;
}

/**
 * Example: Complete combat integration
 * 
 * Shows full integration pattern in a combat component.
 */
export class ExampleCombatIntegration {
  private player: PlayerState;
  private opponent: PlayerState;
  private lastUpdateTime: number;
  
  constructor(player: PlayerState, opponent: PlayerState) {
    // Initialize players with body facing
    this.player = {
      ...player,
      bodyFacing: player.bodyFacing ?? createDefaultBodyFacing(0),
    };
    
    this.opponent = {
      ...opponent,
      bodyFacing: opponent.bodyFacing ?? createDefaultBodyFacing(180),
    };
    
    this.lastUpdateTime = Date.now();
  }
  
  /**
   * Update loop called every frame
   */
  update(): void {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds
    
    // Update both players' facing directions
    if (!this.player.bodyFacing?.isLocked) {
      this.player = exampleGameLoopUpdate(
        this.player,
        this.opponent,
        deltaTime,
        currentTime
      );
    }
    
    if (!this.opponent.bodyFacing?.isLocked) {
      this.opponent = exampleGameLoopUpdate(
        this.opponent,
        this.player,
        deltaTime,
        currentTime
      );
    }
    
    this.lastUpdateTime = currentTime;
  }
  
  /**
   * Execute attack with facing lock
   */
  executeAttack(attacker: 'player' | 'opponent'): void {
    if (attacker === 'player') {
      // Lock player facing during attack
      this.player = exampleAttackStart(this.player);
      
      // Execute attack animation...
      
      // After attack completes (in animation callback):
      // this.player = exampleAttackComplete(this.player);
    } else {
      // Lock opponent facing during attack
      this.opponent = exampleAttackStart(this.opponent);
      
      // Execute attack animation...
      
      // After attack completes:
      // this.opponent = exampleAttackComplete(this.opponent);
    }
  }
  
  /**
   * Check if player can move
   */
  canMove(entity: 'player' | 'opponent'): boolean {
    const target = entity === 'player' ? this.player : this.opponent;
    return exampleMovementCheck(target);
  }
  
  /**
   * Get current state
   */
  getState(): { player: PlayerState; opponent: PlayerState } {
    return {
      player: this.player,
      opponent: this.opponent,
    };
  }
}

/**
 * Example usage in React component with useFrame
 */
export function exampleReactThreeComponent() {
  // This is pseudocode showing the integration pattern
  
  /*
  import { useFrame } from '@react-three/fiber';
  import { useRef, useState } from 'react';
  import * as THREE from 'three';
  
  function CombatCharacter({ player, opponent }) {
    const torsoRef = useRef<THREE.Mesh>(null);
    const headRef = useRef<THREE.Mesh>(null);
    const [playerState, setPlayerState] = useState(player);
    
    // Update body facing every frame
    useFrame((state, delta) => {
      const currentTime = Date.now();
      
      // Update facing direction
      const updatedPlayer = exampleGameLoopUpdate(
        playerState,
        opponent,
        delta,
        currentTime
      );
      setPlayerState(updatedPlayer);
      
      // Apply rotations to meshes
      if (torsoRef.current && headRef.current) {
        exampleThreeJSRotation(
          updatedPlayer,
          torsoRef.current,
          headRef.current
        );
      }
    });
    
    return (
      <group>
        <mesh ref={torsoRef}>
          <boxGeometry args={[1, 2, 0.5]} />
          <meshStandardMaterial color="#00ffff" />
        </mesh>
        <mesh ref={headRef} position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
      </group>
    );
  }
  */
}

/**
 * Example: Manual facing control (optional)
 * 
 * Allow player to manually control facing direction with keyboard.
 */
export function exampleManualFacingControl(
  player: PlayerState,
  targetAngle: number,
  deltaTime: number,
  currentTime: number
): PlayerState {
  if (!player.bodyFacing) {
    return player;
  }
  
  // Manually set target angle (e.g., from arrow keys)
  const manualFacing = {
    ...player.bodyFacing,
    targetAngle,
  };
  
  // Update with manual target
  const updatedFacing = bodyFacingSystem.update(
    manualFacing,
    player.position,
    { x: player.position.x + Math.cos(targetAngle * Math.PI / 180) * 100, y: player.position.y + Math.sin(targetAngle * Math.PI / 180) * 100 },
    deltaTime,
    currentTime
  );
  
  return {
    ...player,
    bodyFacing: updatedFacing,
  };
}

// Mock function for example purposes
function createBasePlayer(): PlayerState {
  return {
    id: "example-player",
    name: { korean: "예제", english: "Example" },
    archetype: "musa" as const,
    health: 100,
    maxHealth: 100,
    ki: 100,
    maxKi: 100,
    stamina: 100,
    maxStamina: 100,
    energy: 100,
    maxEnergy: 100,
    attackPower: 15,
    defense: 10,
    speed: 10,
    technique: 12,
    pain: 0,
    consciousness: 100,
    balance: 100,
    momentum: 0,
    currentStance: "geon" as const,
    combatState: "idle" as const,
    position: { x: 100, y: 200 },
    isBlocking: false,
    isStunned: false,
    isCountering: false,
    lastActionTime: 0,
    recoveryTime: 0,
    lastStanceChangeTime: 0,
    statusEffects: [],
    activeEffects: [],
    vitalPoints: [],
    totalDamageReceived: 0,
    totalDamageDealt: 0,
    hitsTaken: 0,
    hitsLanded: 0,
    perfectStrikes: 0,
    vitalPointHits: 0,
  };
}
