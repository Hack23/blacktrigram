/**
 * Breathing Disruption System exports.
 * 
 * **Korean**: 호흡곤란 시스템 내보내기
 * 
 * @module systems/breathing
 * @category Combat Systems
 */

export {
  BreathingDisruptionSystem,
  BreathingDisruptionLevel,
  type BreathingDisruptionEffect,
} from "./BreathingDisruptionSystem";

export {
  causesBreathingDisruption,
  getBreathingDisruptionLevel,
  applyBreathingDisruptionFromVitalPoint,
  applyBreathingDisruptionFromTorsoDamage,
  updateBreathingDisruption,
  upgradeLegacyBreathlessness,
} from "./integration";
