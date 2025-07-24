import { COMBAT_CONTROLS } from "@/systems/types";
import type { Position } from "@/types/common";
import { useCallback, useEffect, useRef, useState } from "react";
import { TrigramStance } from "../types/common";

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
}

export interface MovementState {
  readonly up: boolean;
  readonly down: boolean;
  readonly left: boolean;
  readonly right: boolean;
  readonly position: Position; // Add position to movement state
  readonly isMoving: boolean; // Add isMoving to movement state
}

export interface PlayerMovementResult {
  readonly playerPosition: Position;
  readonly movementState: MovementState;
  readonly isMoving: boolean;
  readonly isKeyPressed: (key: string) => boolean;
}

/**
 * Hook for handling player movement input - supports both config and legacy APIs
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
    moveSpeed = 300, // Increased default speed
  } = config;

  const [playerPosition, setPlayerPosition] =
    useState<Position>(initialPosition);
  const [keyState, setKeyState] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  // Track pressed keys for combat system
  const pressedKeys = useRef<Set<string>>(new Set());
  const lastUpdateTime = useRef<number>(performance.now());
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
  const updatePosition = useCallback(() => {
    if (!enabled || !isMoving) {
      animationFrameId.current = null;
      return;
    }

    const now = performance.now();
    const deltaTime = Math.min(now - lastUpdateTime.current, 50);
    lastUpdateTime.current = now;

    if (deltaTime <= 0) {
      animationFrameId.current = requestAnimationFrame(updatePosition);
      return;
    }

    const speed = moveSpeed * (deltaTime / 1000);
    let newX = playerPosition.x;
    let newY = playerPosition.y;

    // Apply movement with diagonal adjustment
    const diagonalFactor =
      (keyState.left || keyState.right) && (keyState.up || keyState.down)
        ? 0.707
        : 1;
    const adjustedSpeed = speed * diagonalFactor;

    if (keyState.left) newX -= adjustedSpeed;
    if (keyState.right) newX += adjustedSpeed;
    if (keyState.up) newY -= adjustedSpeed;
    if (keyState.down) newY += adjustedSpeed;

    // ✅ FIXED: Proper bounds checking
    if (bounds) {
      newX = Math.max(bounds.x, Math.min(bounds.x + bounds.width - 60, newX));
      newY = Math.max(bounds.y, Math.min(bounds.y + bounds.height - 180, newY));
    }

    const newPosition = { x: newX, y: newY };

    // Only update if position actually changed
    if (
      newPosition.x !== playerPosition.x ||
      newPosition.y !== playerPosition.y
    ) {
      setPlayerPosition(newPosition);
      onPositionChange?.(newPosition);
    }

    // Continue animation if still moving
    if (isMoving) {
      animationFrameId.current = requestAnimationFrame(updatePosition);
    } else {
      animationFrameId.current = null;
    }
  }, [
    enabled,
    playerPosition,
    keyState,
    bounds,
    onPositionChange,
    moveSpeed,
    isMoving,
  ]);

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
    this.actionCallbacks.get(action)!.push(callback);
  }

  unregisterAction(action: string, callback?: () => void) {
    if (!this.actionCallbacks.has(action)) return;

    if (callback) {
      const callbacks = this.actionCallbacks.get(action)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
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
  // Fix: Use proper type assertion and key validation
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
