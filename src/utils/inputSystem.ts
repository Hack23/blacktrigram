import { COMBAT_CONTROLS } from "@/systems/types";
import type { Position } from "@/types/common";
import { useCallback, useEffect, useRef, useState } from "react";
import { TrigramStance } from "../types/common";
import { MovementPhysics } from "../systems/physics/MovementPhysics";
import type { MovementInput } from "../systems/physics/MovementPhysics";
import * as THREE from "three";

export interface InputSystemConfig {
  readonly enabled?: boolean;
  readonly bounds?: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly onPositionChange?: (position: Position) => void;
  readonly initialPosition?: Position;
  readonly moveSpeed?: number;
  // Physics-based movement parameters (always enabled)
  readonly currentStance?: TrigramStance;
  readonly legInjuryFactor?: number;
  readonly isRunning?: boolean;
  readonly useTacticalSteps?: boolean;
}

export interface MovementState {
  readonly up: boolean;
  readonly down: boolean;
  readonly left: boolean;
  readonly right: boolean;
  readonly position: Position;
  readonly isMoving: boolean; // Add isMoving to movement state
}

export interface PlayerMovementResult {
  readonly playerPosition: Position;
  readonly movementState: MovementState;
  readonly isMoving: boolean;
  readonly isKeyPressed: (key: string) => boolean;
  readonly velocity?: { x: number; y: number }; // For physics mode
  readonly speed?: number; // Current speed in m/s for physics mode
}

/**
 * Hook for handling player movement input - supports both config and legacy APIs
 * Now with physics-based movement as the default, always-on system for realistic acceleration/deceleration
 * 
 * **Korean**: 플레이어 이동 훅 (Player Movement Hook)
 * 
 * @param configOrPosition - Configuration object or legacy position
 * @param legacyBounds - Legacy bounds for backward compatibility
 * @returns Movement state and physics data
 */
export function usePlayerMovement(
  configOrPosition: InputSystemConfig | Position,
  legacyBounds?: { width: number; height: number }
): PlayerMovementResult {
  // Handle legacy API (position, bounds) for CombatScreen compatibility
  const config: InputSystemConfig =
    typeof configOrPosition === "object" && "x" in configOrPosition
      ? {
          enabled: true,
          bounds: legacyBounds
            ? {
                x: 0,
                y: 0,
                width: legacyBounds.width,
                height: legacyBounds.height,
              }
            : undefined,
          initialPosition: configOrPosition,
          moveSpeed: 200,
        }
      : configOrPosition;

  const {
    enabled = true,
    bounds,
    onPositionChange,
    initialPosition = { x: 0, y: 0 },
    currentStance = TrigramStance.GEON,
    legInjuryFactor = 0,
    isRunning: isRunningProp = false,
    useTacticalSteps = false,
  } = config;

  const [playerPosition, setPlayerPosition] =
    useState<Position>(initialPosition);
  const [keyState, setKeyState] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  // Physics state for render (velocity and speed)
  const [velocity, setVelocity] = useState<{ x: number; y: number } | undefined>(undefined);
  const [speed, setSpeed] = useState<number | undefined>(undefined);

  // Physics-based movement state (always initialized for realistic combat)
  const physicsEngineRef = useRef<MovementPhysics | null>(null);
  const physicsStateRef = useRef<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    acceleration: number;
    maxSpeed: number;
    currentStance: TrigramStance;
    legInjuryFactor: number;
  } | null>(null);

  // Initialize physics engine once on mount (always enabled)
  // Note: stance and legInjuryFactor are updated dynamically in updatePosition callback
  // Note: initialPosition only used for initial state; position updates happen in updatePosition
  useEffect(() => {
    if (!physicsEngineRef.current) {
      physicsEngineRef.current = new MovementPhysics();
      // Convert 2D position to 3D (y becomes z for 3D)
      physicsStateRef.current = {
        position: new THREE.Vector3(initialPosition.x / 100, 0, initialPosition.y / 100),
        velocity: new THREE.Vector3(0, 0, 0),
        acceleration: 0,
        maxSpeed: 2.0,
        currentStance,
        legInjuryFactor: legInjuryFactor ?? 0,
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track pressed keys for combat system
  const pressedKeys = useRef<Set<string>>(new Set());
  // Use useState lazy initializer for performance.now() to avoid impure function during render
  const [initialTime] = useState(() => performance.now());
  const lastUpdateTime = useRef(initialTime);
  const animationFrameId = useRef<number | null>(null);

  // Calculate if currently moving
  const isMoving =
    keyState.up || keyState.down || keyState.left || keyState.right;

  // Create complete movement state
  const movementState: MovementState = {
    ...keyState,
    position: playerPosition,
    isMoving,
  };

  // Key press checker for combat system
  const isKeyPressed = useCallback((key: string): boolean => {
    return pressedKeys.current.has(key);
  }, []);

  // Enhanced keyboard event handlers
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const key = event.key.toLowerCase();
      pressedKeys.current.add(key);

      // ✅ FIXED: Add all movement keys including WASD and arrows
      switch (key) {
        case "w":
        case "arrowup":
          setKeyState((prev) => ({ ...prev, up: true }));
          event.preventDefault();
          break;
        case "s":
        case "arrowdown":
          setKeyState((prev) => ({ ...prev, down: true }));
          event.preventDefault();
          break;
        case "a":
        case "arrowleft":
          setKeyState((prev) => ({ ...prev, left: true }));
          event.preventDefault();
          break;
        case "d":
        case "arrowright":
          setKeyState((prev) => ({ ...prev, right: true }));
          event.preventDefault();
          break;
      }
    },
    [enabled]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const key = event.key.toLowerCase();
      pressedKeys.current.delete(key);

      // ✅ FIXED: Handle key release for all movement keys
      switch (key) {
        case "w":
        case "arrowup":
          setKeyState((prev) => ({ ...prev, up: false }));
          break;
        case "s":
        case "arrowdown":
          setKeyState((prev) => ({ ...prev, down: false }));
          break;
        case "a":
        case "arrowleft":
          setKeyState((prev) => ({ ...prev, left: false }));
          break;
        case "d":
        case "arrowright":
          setKeyState((prev) => ({ ...prev, right: false }));
          break;
      }
    },
    [enabled]
  );

  // ✅ FIXED: Proper movement calculation with correct bounds
  // Use a ref to store the callback to avoid reference before declaration issue
  const updatePositionRef = useRef<(() => void) | null>(null);

  const updatePosition = useCallback(() => {
    if (!enabled || !isMoving) {
      animationFrameId.current = null;
      return;
    }

    const now = performance.now();
    const deltaTime = Math.min(now - (lastUpdateTime.current ?? now), 50);
    lastUpdateTime.current = now;

    if (deltaTime <= 0) {
      animationFrameId.current = requestAnimationFrame(() =>
        updatePositionRef.current?.()
      );
      return;
    }

    // Physics-based movement (always enabled for realistic combat)
    if (physicsEngineRef.current && physicsStateRef.current) {
      // Convert key state to physics input
      const forward = keyState.up ? 1 : keyState.down ? -1 : 0;
      const lateral = keyState.right ? 1 : keyState.left ? -1 : 0;
      
      const physicsInput: MovementInput = {
        forward,
        lateral,
        isRunning: isRunningProp,
        isMoving: forward !== 0 || lateral !== 0,
        useTacticalSteps,
      };

      // Update physics state
      const state = physicsStateRef.current;
      state.currentStance = currentStance;
      state.legInjuryFactor = legInjuryFactor;
      
      // Clamp delta time to 1/30s (≈33.33ms) to match usePlayerMovement and prevent instability
      const clampedDeltaTimeMs = Math.min(deltaTime, 1000 / 30);
      physicsEngineRef.current.updateMovement(state, physicsInput, clampedDeltaTimeMs / 1000);

      // Convert 3D position back to 2D pixel coordinates (z becomes y)
      let newX = state.position.x * 100;
      let newY = state.position.z * 100;

      // Apply bounds
      if (bounds) {
        newX = Math.max(bounds.x, Math.min(bounds.x + bounds.width - 60, newX));
        newY = Math.max(bounds.y, Math.min(bounds.y + bounds.height - 180, newY));
        // Update 3D position to match clamped 2D position
        state.position.x = newX / 100;
        state.position.z = newY / 100;
      }

      const newPosition = { x: newX, y: newY };

      // Update velocity and speed state for render
      const newVelocity = { x: state.velocity.x, y: state.velocity.z };
      const newSpeed = state.velocity.length();
      
      if (newPosition.x !== playerPosition.x || newPosition.y !== playerPosition.y) {
        setPlayerPosition(newPosition);
        onPositionChange?.(newPosition);
      }
      
      // Update velocity and speed if changed (with epsilon tolerance for floating-point stability)
      const EPSILON = 0.001;
      const velocityChanged = !velocity || 
        Math.abs(velocity.x - newVelocity.x) > EPSILON || 
        Math.abs(velocity.y - newVelocity.y) > EPSILON;
      if (velocityChanged) {
        setVelocity(newVelocity);
      }
      // Initialize speed when undefined, then update only on significant changes
      if (speed === undefined || Math.abs(speed - newSpeed) > EPSILON) {
        setSpeed(newSpeed);
      }
    }

    // Continue animation if still moving
    if (isMoving) {
      animationFrameId.current = requestAnimationFrame(() =>
        updatePositionRef.current?.()
      );
    } else {
      animationFrameId.current = null;
    }
  }, [
    enabled,
    playerPosition,
    keyState,
    bounds,
    onPositionChange,
    isMoving,
    currentStance,
    legInjuryFactor,
    isRunningProp,
    useTacticalSteps,
    velocity,
    speed,
  ]);

  // Keep updatePositionRef in sync via useEffect (not during render)
  useEffect(() => {
    updatePositionRef.current = updatePosition;
  }, [updatePosition]);

  // Handle keyboard input
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [enabled, handleKeyDown, handleKeyUp]);

  // Start animation loop when movement begins
  useEffect(() => {
    if (isMoving && !animationFrameId.current) {
      lastUpdateTime.current = performance.now();
      animationFrameId.current = requestAnimationFrame(updatePosition);
    } else if (!isMoving && animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [isMoving, updatePosition]);

  return {
    playerPosition,
    movementState,
    isMoving,
    isKeyPressed,
    velocity,
    speed,
  };
}

export interface InputEvent {
  readonly type: "keydown" | "keyup" | "click" | "touchstart" | "touchend";
  readonly key?: string;
  readonly target?: EventTarget | null;
  readonly timestamp: number;
}

export interface CombatInput {
  readonly stanceChange?: TrigramStance;
  readonly attack?: boolean;
  readonly block?: boolean;
  readonly movement?: MovementState;
  readonly timestamp: number;
}

/**
 * Input system for combat controls
 */
export class InputSystem {
  private actionCallbacks = new Map<string, (() => void)[]>();
  private isEnabled = true;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isEnabled) return;

    const key = event.key;
    this.triggerAction(`keydown:${key}`);
    this.triggerAction("keydown");
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (!this.isEnabled) return;

    const key = event.key;
    this.triggerAction(`keyup:${key}`);
    this.triggerAction("keyup");
  }

  registerAction(action: string, callback: () => void) {
    if (!this.actionCallbacks.has(action)) {
      this.actionCallbacks.set(action, []);
    }
    const callbacks = this.actionCallbacks.get(action);
    if (callbacks) {
      callbacks.push(callback);
    }
  }

  unregisterAction(action: string, callback?: () => void) {
    if (!this.actionCallbacks.has(action)) return;

    if (callback) {
      const callbacks = this.actionCallbacks.get(action);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    } else {
      this.actionCallbacks.delete(action);
    }
  }

  clearActions() {
    this.actionCallbacks.clear();
  }

  isActionActive(action: string): boolean {
    return this.actionCallbacks.has(action);
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  private triggerAction(action: string) {
    const callbacks = this.actionCallbacks.get(action);
    if (callbacks) {
      callbacks.forEach((callback) => callback());
    }
  }

  destroy() {
    window.removeEventListener("keydown", this.handleKeyDown.bind(this));
    window.removeEventListener("keyup", this.handleKeyUp.bind(this));
    this.clearActions();
  }
}

/**
 * Get stance from keyboard input
 */
export function getStanceFromKey(key: string): TrigramStance | null {
  const stanceKey = key as keyof typeof COMBAT_CONTROLS.stanceControls;

  if (stanceKey in COMBAT_CONTROLS.stanceControls) {
    return COMBAT_CONTROLS.stanceControls[stanceKey].stance;
  }

  return null;
}

/**
 * Process combat input and return structured combat data
 */
export function processCombatInput(event: KeyboardEvent): CombatInput | null {
  const key = event.key;
  const timestamp = performance.now();

  // Check for stance change (1-8 keys)
  const stance = getStanceFromKey(key);
  if (stance) {
    return {
      stanceChange: stance,
      timestamp,
    };
  }

  // Check for combat actions
  switch (key.toLowerCase()) {
    case " ": // Space for attack
      return {
        attack: true,
        timestamp,
      };
    case "shift":
      return {
        block: true,
        timestamp,
      };
    default:
      return null;
  }
}

/**
 * Hook for combat input handling
 */
export function useCombatInput(onCombatInput: (input: CombatInput) => void) {
  const isEnabled = useRef<boolean>(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isEnabled.current) return;

      const combatInput = processCombatInput(event);
      if (combatInput) {
        onCombatInput(combatInput);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCombatInput]);

  return {
    enable: () => {
      isEnabled.current = true;
    },
    disable: () => {
      isEnabled.current = false;
    },
  };
}
