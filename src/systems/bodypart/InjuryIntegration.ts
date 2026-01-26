/**
 * Injury Integration Utilities
 * 
 * **Korean**: 부상 통합 유틸리티
 * 
 * Utilities to convert between InjuryTracker format and TraumaOverlay3D format,
 * enabling seamless integration of injury tracking with visual trauma display.
 * 
 * @module systems/bodypart/InjuryIntegration
 * @category Body Part System
 * @korean 부상통합
 */

import { InjuryLocation } from "./InjuryTracker";
import { Injury } from "../../types/injury";

/**
 * Convert InjuryLocation to TraumaOverlay3D Injury format.
 * 
 * **Korean**: InjuryLocation을 TraumaOverlay3D Injury 형식으로 변환
 * 
 * @param injuryLocation - Injury from InjuryTracker
 * @param playerId - Optional player ID for multi-player scenarios
 * @returns Injury in TraumaOverlay3D format
 * 
 * @public
 */
export function convertInjuryForVisualization(
  injuryLocation: InjuryLocation,
  playerId?: string | number
): Injury {
  return {
    id: injuryLocation.id,
    region: injuryLocation.bodyRegion,
    type: injuryLocation.type,
    position: [
      injuryLocation.position.x,
      injuryLocation.position.y,
      injuryLocation.position.z,
    ],
    severity: injuryLocation.severity / 100, // Convert 0-100 to 0-1
    hitCount: injuryLocation.hitCount,
    timestamp: injuryLocation.timestamp,
    playerId,
  };
}

/**
 * Convert array of InjuryLocations to TraumaOverlay3D Injuries.
 * 
 * **Korean**: InjuryLocation 배열을 TraumaOverlay3D Injuries로 변환
 * 
 * @param injuryLocations - Array of injuries from InjuryTracker
 * @param playerId - Optional player ID
 * @returns Array of injuries in TraumaOverlay3D format
 * 
 * @public
 */
export function convertInjuriesForVisualization(
  injuryLocations: InjuryLocation[],
  playerId?: string | number
): Injury[] {
  return injuryLocations.map((loc) =>
    convertInjuryForVisualization(loc, playerId)
  );
}
