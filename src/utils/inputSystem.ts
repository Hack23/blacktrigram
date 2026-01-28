import { COMBAT_CONTROLS } from "@/systems/types";
import type { Position } from "@/types/common";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { MovementInput } from "../systems/physics/MovementPhysics";
import { MovementPhysics } from "../systems/physics/MovementPhysics";
import { TrigramStance } from "../types/common";
import { calculateArenaBounds, DEFAULT_PHYSICS_ARENA_BOUNDS } from "../types/PhysicsTypes";
import type { MovementArenaBounds } from "../types/PhysicsTypes";

/**
 * Configuration interface for the input system and player movement.
 * Uses physics-first approach: all positions and velocities are in meters.
 *
 * **Korean**: 입력 시스템 설정 (Input System Configuration)
 *
 * ## Physics-First Architecture
 *
 * This interface requires worldWidthMeters and worldDepthMeters to enable
 * the new physics-first coordinate system. Without these properties, the
 * movement system cannot properly convert between physics (meters) and
 * rendering (pixels).
 *
 * ### Migration Guide
 *
 * Existing code must be updated to pass world dimensions:
 *
 * ```typescript
 * // Before (incorrect):
 * const config = { bounds: { x: 0, y: 0, width: 960, height: 480 } };
 *
 * // After (correct):
 * const config = {
 *   bounds: {
 *     worldWidthMeters: 10,   // From layout hook
 *     worldDepthMeters: 10    // From layout hook
 *   }
 * };
 * ```
 *
 * ### Fallback Behavior
 *
 * If worldWidthMeters/worldDepthMeters are not provided, the system falls back
 * to DEFAULT_PHYSICS_ARENA_BOUNDS (10m × 7.5m) to ensure movement stays bounded.
 * Callers SHOULD provide these values from their layout hooks (useCombatLayout, 
 * useTrainingLayout) for proper arena sizing.
 */
export interface InputSystemConfig {
  /** Whether the input system is enabled and processing input */
  readonly enabled?: boolean;

  /**
   * Arena world dimensions in meters for physics calculations.
   *
   * **REQUIRED for physics-first coordinate system to work.**
   *
   * These values must come from layout hooks:
   * - CombatScreen3D: Use arenaBounds.worldWidthMeters/worldDepthMeters from useCombatLayout()
   * - TrainingScreen3D: Use trainingAreaBounds.worldWidthMeters/worldDepthMeters from useTrainingLayout()
   */
  readonly bounds?: {
    /** Physical arena width in meters (e.g., 6m mobile, 10m desktop, 14m 4K) */
    readonly worldWidthMeters: number;
    /** Physical arena depth in meters (e.g., 6m mobile, 10m desktop, 14m 4K) */
    readonly worldDepthMeters: number;
  };

  /** Callback invoked when player position changes (position in meters) */
  readonly onPositionChange?: (position: Position) => void;

  /** Initial player position in METERS (x = lateral, y = forward/backward) */
  readonly initialPositionMeters?: Position;

  // Physics-based movement parameters (always enabled)
  /** Current trigram stance affecting movement speed */
  readonly currentStance?: TrigramStance;

  /** Leg injury factor (0-1, where 1 is fully injured) affecting movement speed */
  readonly legInjuryFactor?: number;

  /** Whether player is running (sprint mode) */
  readonly isRunning?: boolean;

  /** Whether to use tactical step mode (30cm grid quantization) */
  readonly useTacticalSteps?: boolean;

  // Speed modifier overrides from SpeedModifierSystem
  /** Final calculated maximum speed in meters per second */
  readonly maxSpeedOverride?: number;

  /** Final calculated acceleration in meters per second squared */
  readonly accelerationOverride?: number;
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
  /** Player position in METERS (x = lateral, y = forward/backward in arena) */
  readonly playerPosition: Position;
  readonly movementState: MovementState;
  readonly isMoving: boolean;
  readonly isKeyPressed: (key: string) => boolean;
  /** Velocity in m/s (x = lateral, y = forward/backward) */
  readonly velocity?: { x: number; y: number };
  /** Current speed magnitude in m/s */
  readonly speed?: number;
}

/**
 * Hook for handling player movement with physics-first approach.
 * All positions and velocities are in METERS - no pixel conversions.
 *
 * **Korean**: 플레이어 이동 훅 (Player Movement Hook)
 *
 * @param config - Physics-first configuration with positions in meters
 * @returns Movement state and physics data (all in meters)
 */
export function usePlayerMovement(
  config: InputSystemConfig,
): PlayerMovementResult {
  const {
    enabled = true,
    bounds,
    onPositionChange,
    initialPositionMeters = { x: 0, y: 0 },
    currentStance = TrigramStance.GEON,
    legInjuryFactor = 0,
    isRunning: isRunningProp = false,
    useTacticalSteps = false,
    maxSpeedOverride,
    accelerationOverride,
  } = config;

  // Position in METERS (x = lateral position, y = forward/backward position)
  const [playerPosition, setPlayerPosition] = useState<Position>(
    initialPositionMeters,
  );
  const [keyState, setKeyState] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  // Physics state for render (velocity and speed in m/s)
  const [velocity, setVelocity] = useState<
    { x: number; y: number } | undefined
  >(undefined);
  const [speed, setSpeed] = useState<number | undefined>(undefined);

  // Auto-run detection: track how long movement keys have been held
  // After sustained movement, automatically transition from walking to running
  const movementStartTimeRef = useRef<number | null>(null);
  const AUTO_RUN_THRESHOLD_MS = 300; // Transition to run after 300ms of sustained movement

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
  // All positions are in METERS - no pixel conversion needed
  useEffect(() => {
    if (!physicsEngineRef.current) {
      // Use arena width for physics-aware speed scaling, default to 10m if not provided
      const arenaWidth = bounds?.worldWidthMeters ?? 10.0;
      physicsEngineRef.current = new MovementPhysics(arenaWidth);
      // Initial position in meters (x = lateral, z = forward/backward)
      physicsStateRef.current = {
        position: new THREE.Vector3(
          initialPositionMeters.x,
          0,
          initialPositionMeters.y,
        ),
        velocity: new THREE.Vector3(0, 0, 0),
        acceleration: 0,
        maxSpeed: 6.0, // Default to BASE_WALK_SPEED (6.0 m/s for responsive combat)
        currentStance,
        legInjuryFactor: legInjuryFactor ?? 0,
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Compute arena bounds synchronously when bounds dimensions change
  // Uses useMemo to ensure bounds are available immediately (not after effect runs)
  // Falls back to default arena bounds if invalid or missing
  const arenaBounds = useMemo<MovementArenaBounds | undefined>(() => {
    if (bounds?.worldWidthMeters != null && bounds?.worldDepthMeters != null) {
      try {
        return calculateArenaBounds(
          {
            worldWidthMeters: bounds.worldWidthMeters,
            worldDepthMeters: bounds.worldDepthMeters,
          },
          0.3 // 0.3m character radius
        );
      } catch (error) {
        // If validation fails, log error and fall back to default bounds
        console.warn("Failed to calculate arena bounds:", error);
      }
    }
    
    // Fallback: use default arena bounds to ensure movement stays bounded
    try {
      return calculateArenaBounds(
        {
          worldWidthMeters: DEFAULT_PHYSICS_ARENA_BOUNDS.worldWidthMeters,
          worldDepthMeters: DEFAULT_PHYSICS_ARENA_BOUNDS.worldDepthMeters,
        },
        0.3 // 0.3m character radius
      );
    } catch (error) {
      // Should never happen with default bounds, but handle gracefully
      console.error("Failed to calculate default arena bounds:", error);
      return undefined;
    }
  }, [bounds?.worldWidthMeters, bounds?.worldDepthMeters]);

  // Update physics engine arena width when bounds change (legacy)
  useEffect(() => {
    if (!physicsEngineRef.current) {
      return;
    }

    const width = bounds?.worldWidthMeters;
    if (width == null) {
      return;
    }

    // Validate width before applying to physics engine to avoid runtime errors
    if (!Number.isFinite(width) || width <= 0) {
      console.warn(
        "Ignoring invalid worldWidthMeters when updating arena width:",
        width,
      );
      return;
    }

    try {
      physicsEngineRef.current.setArenaWidth(width);
    } catch (error) {
      console.warn("Failed to update physics arena width:", error);
    }
  }, [bounds?.worldWidthMeters]);

  // Track pressed keys for combat system
  const pressedKeys = useRef<Set<string>>(new Set());
  // Use useState lazy initializer for performance.now() to avoid impure function during render
  const [initialTime] = useState(() => performance.now());
  const lastUpdateTime = useRef(initialTime);
  const animationFrameId = useRef<number | null>(null);

  // Refs to track last reported position/velocity to avoid useCallback dependency issues
  // This prevents the animation frame from being cancelled every frame due to callback recreation
  const lastReportedPositionRef = useRef<Position>(initialPositionMeters);
  const lastReportedVelocityRef = useRef<{ x: number; y: number } | undefined>(
    undefined,
  );
  const lastReportedSpeedRef = useRef<number | undefined>(undefined);

  // Ref to track keyState for physics loop - avoids recreating callback on key changes
  const keyStateRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  });

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
      // Update both ref (for physics loop) and state (for React re-render)
      switch (key) {
        case "w":
        case "arrowup":
          keyStateRef.current.up = true;
          setKeyState((prev) => ({ ...prev, up: true }));
          event.preventDefault();
          break;
        case "s":
        case "arrowdown":
          keyStateRef.current.down = true;
          setKeyState((prev) => ({ ...prev, down: true }));
          event.preventDefault();
          break;
        case "a":
        case "arrowleft":
          keyStateRef.current.left = true;
          setKeyState((prev) => ({ ...prev, left: true }));
          event.preventDefault();
          break;
        case "d":
        case "arrowright":
          keyStateRef.current.right = true;
          setKeyState((prev) => ({ ...prev, right: true }));
          event.preventDefault();
          break;
      }
    },
    [enabled],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const key = event.key.toLowerCase();
      pressedKeys.current.delete(key);

      // ✅ FIXED: Handle key release for all movement keys
      // Update both ref (for physics loop) and state (for React re-render)
      switch (key) {
        case "w":
        case "arrowup":
          keyStateRef.current.up = false;
          setKeyState((prev) => ({ ...prev, up: false }));
          break;
        case "s":
        case "arrowdown":
          keyStateRef.current.down = false;
          setKeyState((prev) => ({ ...prev, down: false }));
          break;
        case "a":
        case "arrowleft":
          keyStateRef.current.left = false;
          setKeyState((prev) => ({ ...prev, left: false }));
          break;
        case "d":
        case "arrowright":
          keyStateRef.current.right = false;
          setKeyState((prev) => ({ ...prev, right: false }));
          break;
      }
    },
    [enabled],
  );

  // ✅ FIXED: Proper movement calculation with correct bounds
  // Use a ref to store the callback to avoid reference before declaration issue
  const updatePositionRef = useRef<(() => void) | null>(null);

  const updatePosition = useCallback(() => {
    // Check if any movement keys are pressed using ref (not stale state)
    const keys = keyStateRef.current;
    const isCurrentlyMoving = keys.up || keys.down || keys.left || keys.right;

    if (!enabled || !isCurrentlyMoving) {
      animationFrameId.current = null;
      return;
    }

    const now = performance.now();
    const deltaTime = Math.min(now - (lastUpdateTime.current ?? now), 50);
    lastUpdateTime.current = now;

    if (deltaTime <= 0) {
      animationFrameId.current = requestAnimationFrame(() =>
        updatePositionRef.current?.(),
      );
      return;
    }

    // Physics-based movement (always enabled for realistic combat)
    if (physicsEngineRef.current && physicsStateRef.current) {
      // Apply speed modifiers if provided by SpeedModifierSystem
      // BUG FIX: Now properly passing maxSpeedOverride to physics engine
      if (maxSpeedOverride !== undefined) {
        physicsEngineRef.current.setMaxSpeed(maxSpeedOverride);
      }

      if (accelerationOverride !== undefined) {
        physicsEngineRef.current.setAcceleration(accelerationOverride);
      }

      // Convert key state to physics input (using ref to avoid callback recreation)
      // Screen coordinates: UP/W = toward top of screen, DOWN/S = toward bottom
      // Physics Z-axis: negative Z = toward top, positive Z = toward bottom
      const keys = keyStateRef.current;
      const forward = keys.up ? -1 : keys.down ? 1 : 0;
      const lateral = keys.right ? 1 : keys.left ? -1 : 0;
      const isCurrentlyMoving = forward !== 0 || lateral !== 0;

      // Auto-run detection: transition to running after sustained movement
      const now = performance.now();
      if (isCurrentlyMoving) {
        movementStartTimeRef.current ??= now;
      } else {
        movementStartTimeRef.current = null;
      }

      // Determine if player should be running (auto-run after threshold)
      const movementDuration = movementStartTimeRef.current
        ? now - movementStartTimeRef.current
        : 0;
      const shouldRun =
        isRunningProp || movementDuration > AUTO_RUN_THRESHOLD_MS;

      const physicsInput: MovementInput = {
        forward,
        lateral,
        isRunning: shouldRun,
        isMoving: isCurrentlyMoving,
        useTacticalSteps,
      };

      // Update physics state
      const state = physicsStateRef.current;
      state.currentStance = currentStance;
      state.legInjuryFactor = legInjuryFactor;

      // Clamp delta time to 1/30s (≈33.33ms) to match usePlayerMovement and prevent instability
      const clampedDeltaTimeMs = Math.min(deltaTime, 1000 / 30);

      // Use arena bounds computed via useMemo (available synchronously)
      physicsEngineRef.current.updateMovement(
        state,
        physicsInput,
        clampedDeltaTimeMs / 1000,
        arenaBounds, // Use memoized bounds
      );

      // Position in meters (x = lateral, y = forward/backward)
      const newPosition = { x: state.position.x, y: state.position.z };

      // Velocity in m/s (x = lateral, y = forward/backward)
      const newVelocity = { x: state.velocity.x, y: state.velocity.z };
      const newSpeed = state.velocity.length();

      // Use refs for comparison to avoid recreating callback on every frame
      // This prevents the animation frame from being cancelled due to useCallback recreation
      const lastPos = lastReportedPositionRef.current;
      if (newPosition.x !== lastPos.x || newPosition.y !== lastPos.y) {
        lastReportedPositionRef.current = newPosition;
        setPlayerPosition(newPosition);
        onPositionChange?.(newPosition);
      }

      // Update velocity and speed if changed (with epsilon tolerance for floating-point stability)
      const EPSILON = 0.001;
      const lastVel = lastReportedVelocityRef.current;
      const velocityChanged =
        !lastVel ||
        Math.abs(lastVel.x - newVelocity.x) > EPSILON ||
        Math.abs(lastVel.y - newVelocity.y) > EPSILON;
      if (velocityChanged) {
        lastReportedVelocityRef.current = newVelocity;
        setVelocity(newVelocity);
      }
      // Initialize speed when undefined, then update only on significant changes
      const lastSpd = lastReportedSpeedRef.current;
      if (lastSpd === undefined || Math.abs(lastSpd - newSpeed) > EPSILON) {
        lastReportedSpeedRef.current = newSpeed;
        setSpeed(newSpeed);
      }
    }

    // Continue animation if still moving (check ref, not stale closure)
    const stillMoving =
      keyStateRef.current.up ||
      keyStateRef.current.down ||
      keyStateRef.current.left ||
      keyStateRef.current.right;
    if (stillMoving) {
      animationFrameId.current = requestAnimationFrame(() =>
        updatePositionRef.current?.(),
      );
    } else {
      animationFrameId.current = null;
    }
    // NOTE: playerPosition, velocity, speed, keyState, isMoving intentionally excluded from deps
    // Using refs (lastReportedPositionRef, lastReportedVelocityRef, lastReportedSpeedRef, keyStateRef)
    // for comparison to prevent animation frame cancellation on every state update.
    // arenaBounds is computed from bounds and automatically updates when bounds changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    // playerPosition - excluded, using ref
    // keyState - excluded, using keyStateRef
    // isMoving - excluded, using keyStateRef for movement check
    // arenaBounds - excluded, derived from bounds (below)
    bounds,
    onPositionChange,
    currentStance,
    legInjuryFactor,
    isRunningProp,
    useTacticalSteps,
    // velocity - excluded, using ref
    // speed - excluded, using ref
    maxSpeedOverride,
    accelerationOverride,
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
      // Use ref to avoid dependency on updatePosition callback
      animationFrameId.current = requestAnimationFrame(() => {
        updatePositionRef.current?.();
      });
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
    // Only depend on isMoving - updatePositionRef is stable
  }, [isMoving]);

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
