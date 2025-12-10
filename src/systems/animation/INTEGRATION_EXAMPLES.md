/**
 * Integration Guide: Unified Player Animation State Manager
 * 
 * This document demonstrates how to integrate the animation state machine
 * into CombatScreen3D and TrainingScreen3D for movement, stance changes, and attacks.
 * 
 * @module systems/animation/IntegrationGuide
 * @category Documentation
 * @korean 애니메이션통합가이드
 */

import { usePlayerAnimation } from "../../hooks/usePlayerAnimation";
import { useFrame } from "@react-three/fiber";
import type { PlayerState } from "../../systems";
import type { AnimationState } from "../../systems/animation/types";

/**
 * Example: Basic Animation Integration in CombatScreen3D
 * 
 * This demonstrates how to integrate the animation state machine
 * with existing combat logic and player movement.
 */
export function CombatScreen3DIntegrationExample() {
  /*
   * STEP 1: Initialize animation state machine for each player
   * 
   * Create separate animation hooks for player 1 and player 2.
   * The hook will automatically handle frame timing and transitions.
   */
  const player1Animation = usePlayerAnimation({
    events: {
      onAnimationStart: (state) => {
        console.log(`Player 1 animation started: ${state}`);
        // Optional: trigger audio effects for animation start
        // audio.playSFX(`animation_${state}`);
      },
      onFrame: (frame, state) => {
        // Execute game logic at specific frames
        if (state === "attack" && frame === 6) {
          // Attack hits at frame 6 (midpoint of 12-frame attack)
          executeAttackLogic(player1State);
        }
      },
      onAnimationComplete: (state) => {
        console.log(`Player 1 animation completed: ${state}`);
        // Optional: chain animations or update combat state
      },
    },
  });

  const player2Animation = usePlayerAnimation({
    events: {
      onAnimationStart: (state) => {
        console.log(`Player 2 animation started: ${state}`);
      },
      onFrame: (frame, state) => {
        if (state === "attack" && frame === 6) {
          executeAttackLogic(player2State);
        }
      },
    },
  });

  /*
   * STEP 2: Update animations in useFrame (60fps game loop)
   * 
   * Call the update method every frame to advance animation timing.
   * The animation system handles frame counting, looping, and transitions.
   */
  useFrame((state, delta) => {
    // Update both player animations
    const p1Result = player1Animation.update(delta);
    const p2Result = player2Animation.update(delta);

    // Optional: Use animation results to update visual effects
    if (p1Result.justCompleted && p1Result.state === "attack") {
      // Show attack completion effect
    }
  });

  /*
   * STEP 3: Trigger animations from game events
   * 
   * Call transitionTo() when player actions occur.
   * The animation system automatically validates transitions and priorities.
   */

  // Movement: Idle <-> Walk <-> Run
  const handlePlayerMovement = (isMoving: boolean, isRunning: boolean) => {
    if (!isMoving) {
      player1Animation.transitionTo("idle");
    } else if (isRunning) {
      player1Animation.transitionTo("run");
    } else {
      player1Animation.transitionTo("walk");
    }
  };

  // Attack: Triggers attack animation
  const handleAttack = () => {
    // Animation system will check if transition is allowed
    const success = player1Animation.transitionTo("attack");
    if (success) {
      // Attack animation started, update combat state
      updateCombatState({ isExecutingTechnique: true });
    }
  };

  // Defend: Triggers defend animation
  const handleDefend = () => {
    player1Animation.transitionTo("defend");
  };

  // Stance Change: Triggers stance change animation
  const handleStanceChange = (newStance: string) => {
    player1Animation.transitionTo("stance_change");
    // Update player stance in combat state
    updatePlayerStance(newStance);
  };

  // Hit: High priority, can interrupt other animations
  const handlePlayerHit = () => {
    // Hit animation has high priority and can interrupt attacks
    player1Animation.transitionTo("hit");
  };

  /*
   * STEP 4: Pass animation state to Player3DUnified
   * 
   * Use the current animation state from the hook when rendering the 3D player.
   */
  const renderPlayer = () => {
    return (
      <Player3DUnified
        playerId="player1"
        archetype={player1State.archetype}
        stance={player1State.currentStance}
        position={player1Position3D}
        rotation={0}
        health={player1State.health}
        maxHealth={player1State.maxHealth}
        stamina={player1State.stamina}
        ki={player1State.ki}
        pain={player1State.pain}
        balance={getBalanceState(player1State.balance)}
        consciousness={player1State.consciousness}
        isBlocking={player1State.isBlocking}
        isStunned={player1State.isStunned}
        // Use animation state from hook
        currentAnimation={player1Animation.currentState as any}
        isMobile={isMobile}
        facing="right"
      />
    );
  };
}

/**
 * Example: Movement Integration
 * 
 * Demonstrates how to sync movement with animation system.
 */
export function MovementIntegrationExample() {
  const playerAnimation = usePlayerAnimation();

  // Existing movement hook
  usePlayerMovement({
    enabled: true,
    bounds: arenaBounds,
    onPositionChange: (newPosition) => {
      // Update player position
      setPlayerPosition(newPosition);
    },
    onMoveStart: () => {
      // Trigger walk animation when movement starts
      playerAnimation.transitionTo("walk");
    },
    onMoveStop: () => {
      // Return to idle when movement stops
      playerAnimation.transitionTo("idle");
    },
    initialPosition: { x: 0, y: 0 },
    moveSpeed: 300,
  });
}

/**
 * Example: Combat Integration
 * 
 * Demonstrates how to sync combat actions with animation system.
 */
export function CombatIntegrationExample() {
  const playerAnimation = usePlayerAnimation({
    events: {
      onFrame: (frame, state) => {
        // Execute attack at specific frame
        if (state === "attack" && frame === 6) {
          // This is frame 6 of 12 - the midpoint where attack connects
          executeCombatAttack();
        }
      },
      onAnimationComplete: (state) => {
        // Handle animation completion
        if (state === "attack") {
          // Attack animation finished, return to idle
          updateCombatState({ isExecutingTechnique: false });
        } else if (state === "defend") {
          // Defend animation finished
          updateCombatState({ isBlocking: false });
        } else if (state === "hit") {
          // Hit animation finished, check if player is KO'd
          if (playerState.health <= 0) {
            playerAnimation.transitionTo("ko");
          }
        }
      },
    },
  });

  const handleAttackInput = () => {
    // Check if attack is allowed (stamina, cooldown, etc.)
    if (!canAttack()) {
      return;
    }

    // Trigger attack animation
    const success = playerAnimation.transitionTo("attack");
    if (success) {
      // Update combat state
      updateCombatState({ isExecutingTechnique: true });
      // Play attack sound
      audio.playSFX("attack");
      // Consume stamina
      updatePlayerStamina(-8);
    }
  };

  const handleDefendInput = () => {
    playerAnimation.transitionTo("defend");
    updateCombatState({ isBlocking: true });
    audio.playSFX("block");
  };

  const handleHitReceived = (damage: number) => {
    // Hit animation has high priority
    playerAnimation.transitionTo("hit");
    updatePlayerHealth(-damage);
    audio.playSFX("hit");
  };
}

/**
 * Example: Stance Change Integration
 * 
 * Demonstrates how to sync stance changes with animation system.
 */
export function StanceChangeIntegrationExample() {
  const playerAnimation = usePlayerAnimation({
    events: {
      onAnimationComplete: (state) => {
        if (state === "stance_change") {
          // Stance change animation completed
          // Update combat state to new stance
          updateCombatState({ currentStance: pendingStance });
        }
      },
    },
  });

  const [pendingStance, setPendingStance] = useState<TrigramStance | null>(
    null
  );

  const handleStanceChange = (newStance: TrigramStance) => {
    // Store pending stance
    setPendingStance(newStance);

    // Trigger stance change animation
    const success = playerAnimation.transitionTo("stance_change");
    if (success) {
      audio.playSFX("stance_change");
      showStanceChangeIndicator(newStance);
    }
  };
}

/**
 * Example: TrainingScreen3D Integration
 * 
 * Similar to CombatScreen3D but with training-specific features.
 */
export function TrainingScreen3DIntegrationExample() {
  const playerAnimation = usePlayerAnimation({
    events: {
      onFrame: (frame, state) => {
        if (state === "attack" && frame === 6) {
          // Check if attack hits training dummy
          checkTrainingDummyHit();
        }
      },
      onAnimationComplete: (state) => {
        if (state === "attack") {
          // Update training stats
          incrementAttackCount();
        }
      },
    },
  });

  useFrame((state, delta) => {
    playerAnimation.update(delta);
  });

  const handleTrainingAttack = () => {
    playerAnimation.transitionTo("attack");
  };

  const handleTrainingStanceChange = (stance: TrigramStance) => {
    playerAnimation.transitionTo("stance_change");
    setPlayerStance(stance);
  };
}

/**
 * Priority System Examples
 * 
 * The animation system automatically handles priorities:
 * 
 * Priority order: ko (7) > hit (6) > attack (5) > defend (4) > stance_change (3) > run (2) > walk (1) > idle (0)
 */

// Example 1: Hit interrupts attack
function exampleHitInterruptsAttack() {
  const animation = usePlayerAnimation();

  animation.transitionTo("attack"); // Success
  animation.transitionTo("hit"); // Success - hit has higher priority

  // Now in "hit" state
  console.log(animation.currentState); // "hit"
}

// Example 2: Attack cannot interrupt hit
function exampleAttackCannotInterruptHit() {
  const animation = usePlayerAnimation();

  animation.transitionTo("hit"); // Success
  const success = animation.transitionTo("attack"); // Fails - attack has lower priority

  console.log(success); // false
  console.log(animation.currentState); // Still "hit"
}

// Example 3: KO is terminal
function exampleKOIsTerminal() {
  const animation = usePlayerAnimation();

  animation.transitionTo("ko"); // Success
  animation.transitionTo("idle"); // Fails - KO is terminal

  // Must manually reset to leave KO state
  animation.reset(); // Back to idle
}

/**
 * Helper functions referenced in examples
 * (These would be actual implementations in your code)
 */
declare function executeAttackLogic(player: PlayerState): void;
declare function updateCombatState(updates: Partial<any>): void;
declare function updatePlayerStance(stance: string): void;
declare function getBalanceState(balance: number): string;
declare function executeCombatAttack(): void;
declare function canAttack(): boolean;
declare function updatePlayerStamina(delta: number): void;
declare function updatePlayerHealth(delta: number): void;
declare function showStanceChangeIndicator(stance: any): void;
declare function checkTrainingDummyHit(): void;
declare function incrementAttackCount(): void;
declare function setPlayerStance(stance: any): void;
declare const player1State: PlayerState;
declare const player2State: PlayerState;
declare const player1Position3D: [number, number, number];
declare const isMobile: boolean;
declare const arenaBounds: any;
declare const audio: any;
declare const setPlayerPosition: any;
declare const usePlayerMovement: any;
declare const Player3DUnified: any;
declare const TrigramStance: any;
declare const pendingStance: any;
