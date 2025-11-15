/**
 * Type guard functions for combat system
 * Provides runtime type checking for better type safety
 */

import { PlayerArchetype, VitalPointCategory } from "../../types/common";
import { VitalPoint } from "../vitalpoint/types";

/**
 * Type guard to check if a value is a valid PlayerArchetype
 * @param value - Value to check
 * @returns True if value is a valid PlayerArchetype
 */
export function isValidArchetype(value: unknown): value is PlayerArchetype {
  if (typeof value !== "string") {
    return false;
  }
  
  return Object.values(PlayerArchetype).includes(value as PlayerArchetype);
}

/**
 * Type guard to check if a value is a valid VitalPoint
 * @param value - Value to check
 * @returns True if value is a valid VitalPoint
 */
export function isVitalPoint(value: unknown): value is VitalPoint {
  if (!value || typeof value !== "object") {
    return false;
  }
  
  const obj = value as Record<string, unknown>;
  
  return (
    typeof obj.id === "string" &&
    typeof obj.category === "string" &&
    Object.values(VitalPointCategory).includes(obj.category as VitalPointCategory) &&
    typeof obj.severity === "string" &&
    obj.position !== undefined &&
    typeof obj.position === "object" &&
    Array.isArray(obj.effects)
  );
}

/**
 * Type guard to check if a value is a valid VitalPointCategory
 * @param value - Value to check
 * @returns True if value is a valid VitalPointCategory
 */
export function isVitalPointCategory(value: unknown): value is VitalPointCategory {
  if (typeof value !== "string") {
    return false;
  }
  
  return Object.values(VitalPointCategory).includes(value as VitalPointCategory);
}
