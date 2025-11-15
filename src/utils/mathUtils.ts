/**
 * Math utility functions for the game
 */

import type { Position } from "../types";

/**
 * Calculate the Euclidean distance between two positions
 * @param pos1 - First position
 * @param pos2 - Second position
 * @returns The distance between the two positions
 */
export function calculateDistance(pos1: Position, pos2: Position): number {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}
