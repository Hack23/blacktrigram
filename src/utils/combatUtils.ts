/**
 * @fileoverview Combat utility functions for Korean martial arts game
 * @description Helper functions for grid validation, distance calculation, and movement logic
 */

import type { GridPosition, OctagonalGrid } from "../types/combat";

/**
 * Validates if a position is valid within the octagonal grid
 */
export function validatePosition(
  position: GridPosition,
  grid: OctagonalGrid
): boolean {
  const { row, col } = position;

  if (row < 0 || row >= grid.size || col < 0 || col >= grid.size) {
    return false;
  }

  return grid.validPositions[row][col];
}

/**
 * Calculates Euclidean distance between two grid positions
 */
export function calculateDistance(
  pos1: GridPosition,
  pos2: GridPosition
): number {
  const dx = pos1.col - pos2.col;
  const dy = pos1.row - pos2.row;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Checks if a move from one position to another is valid
 */
export function isValidMove(
  from: GridPosition,
  to: GridPosition,
  grid: OctagonalGrid
): boolean {
  // Check if destination is valid
  if (!validatePosition(to, grid)) {
    return false;
  }

  // Check if move is within one step (adjacent cells)
  const distance = calculateDistance(from, to);
  return distance <= Math.sqrt(2); // Allow diagonal moves
}
