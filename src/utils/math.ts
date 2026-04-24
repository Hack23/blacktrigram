/**
 * Mathematical utility functions for Black Trigram
 * 
 * Provides shared mathematical operations used across combat, training,
 * and physics systems to ensure consistency and follow DRY principles.
 * 
 * **Korean**: 수학 유틸리티 함수
 * 
 * @module utils/math
 * @korean 수학유틸리티
 */

/**
 * Calculate 3D Euclidean distance between two positions
 * 
 * Uses the standard 3D distance formula: √(dx² + dy² + dz²)
 * This is used throughout the combat and training systems to calculate
 * distance between combatants, ensuring consistent distance calculations.
 * 
 * **Korean**: 3D 유클리드 거리 계산
 * 
 * @param pos1 - First position as [x, y, z] tuple
 * @param pos2 - Second position as [x, y, z] tuple
 * @returns The 3D Euclidean distance in meters
 * 
 * @example
 * const distance = calculateDistance3D([0, 0, 0], [3, 4, 0]);
 * // Returns: 5.0 (3-4-5 triangle)
 * 
 * @public
 * @category Math Utilities
 * @korean 3D거리계산
 */
export function calculateDistance3D(
  pos1: [number, number, number],
  pos2: [number, number, number]
): number {
  const dx = pos1[0] - pos2[0];
  const dy = pos1[1] - pos2[1];
  const dz = pos1[2] - pos2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate squared 3D distance between two positions
 * 
 * Optimized version that avoids the expensive square root operation.
 * Useful when comparing distances (A > B) where the square root is unnecessary.
 * 
 * **Korean**: 3D 거리 제곱 계산
 * 
 * @param pos1 - First position as [x, y, z] tuple
 * @param pos2 - Second position as [x, y, z] tuple
 * @returns The squared 3D distance in meters²
 * 
 * @example
 * const distSq = calculateDistance3DSquared([0, 0, 0], [3, 4, 0]);
 * // Returns: 25.0
 * 
 * @public
 * @category Math Utilities
 * @korean 3D거리제곱계산
 */
export function calculateDistance3DSquared(
  pos1: [number, number, number],
  pos2: [number, number, number]
): number {
  const dx = pos1[0] - pos2[0];
  const dy = pos1[1] - pos2[1];
  const dz = pos1[2] - pos2[2];
  return dx * dx + dy * dy + dz * dz;
}

/**
 * Convert degrees to radians
 * 
 * Used throughout animation systems for bone rotations where angles are
 * specified in degrees for readability but need to be converted to radians
 * for Three.js rendering.
 * 
 * **Korean**: 각도를 라디안으로 변환
 * 
 * @param degrees - Angle in degrees (0-360)
 * @returns Angle in radians (0-2π)
 * 
 * @example
 * const rightAngle = toRadians(90);
 * // Returns: approximately 1.5708 (π/2)
 * 
 * @example
 * const straightAngle = toRadians(180);
 * // Returns: approximately 3.1416 (π)
 * 
 * @public
 * @category Math Utilities
 * @korean 각도변환
 */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
