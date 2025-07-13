import { useCallback, useEffect, useState } from "react";
import { Position } from "../types/common";

export interface InputState {
  keys: Set<string>;
  mousePosition: Position;
  isMouseDown: boolean;
}

export interface MovementState {
  position: Position;
  velocity: Position;
  isMoving: boolean;
}

export const useInputSystem = () => {
  const [inputState, setInputState] = useState<InputState>({
    keys: new Set(),
    mousePosition: { x: 0, y: 0 },
    isMouseDown: false,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setInputState((prev) => ({
        ...prev,
        keys: new Set([...prev.keys, event.code]),
      }));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setInputState((prev) => {
        const newKeys = new Set(prev.keys);
        newKeys.delete(event.code);
        return { ...prev, keys: newKeys };
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      setInputState((prev) => ({
        ...prev,
        mousePosition: { x: event.clientX, y: event.clientY },
      }));
    };

    const handleMouseDown = () => {
      setInputState((prev) => ({ ...prev, isMouseDown: true }));
    };

    const handleMouseUp = () => {
      setInputState((prev) => ({ ...prev, isMouseDown: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const isKeyPressed = useCallback(
    (key: string) => {
      return inputState.keys.has(key);
    },
    [inputState.keys]
  );

  return {
    inputState,
    isKeyPressed,
  };
};

export const usePlayerMovement = (
  initialPosition: Position,
  bounds: { width: number; height: number }
) => {
  const [movementState, setMovementState] = useState<MovementState>({
    position: initialPosition,
    velocity: { x: 0, y: 0 },
    isMoving: false,
  });

  const { isKeyPressed } = useInputSystem();

  const updateMovement = useCallback(() => {
    const speed = 3; // pixels per frame
    let newVelocity = { x: 0, y: 0 };
    let isMoving = false;

    // Arrow key movement
    if (isKeyPressed("ArrowUp") || isKeyPressed("KeyW")) {
      newVelocity.y = -speed;
      isMoving = true;
    }
    if (isKeyPressed("ArrowDown") || isKeyPressed("KeyS")) {
      newVelocity.y = speed;
      isMoving = true;
    }
    if (isKeyPressed("ArrowLeft") || isKeyPressed("KeyA")) {
      newVelocity.x = -speed;
      isMoving = true;
    }
    if (isKeyPressed("ArrowRight") || isKeyPressed("KeyD")) {
      newVelocity.x = speed;
      isMoving = true;
    }

    setMovementState((prev) => {
      const newPosition = {
        x: Math.max(
          50,
          Math.min(bounds.width - 50, prev.position.x + newVelocity.x)
        ),
        y: Math.max(
          50,
          Math.min(bounds.height - 50, prev.position.y + newVelocity.y)
        ),
      };

      return {
        position: newPosition,
        velocity: newVelocity,
        isMoving,
      };
    });
  }, [isKeyPressed, bounds]);

  useEffect(() => {
    const interval = setInterval(updateMovement, 16); // ~60fps
    return () => clearInterval(interval);
  }, [updateMovement]);

  return {
    movementState,
    isKeyPressed,
  };
};
