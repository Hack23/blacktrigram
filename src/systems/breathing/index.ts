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

export {
  type BreathingIndicatorConfig,
  type BreathingPostureState,
  type BreathingAudioEffect,
  BREATHING_INDICATOR_CONFIGS,
  BREATHING_POSTURE_STATES,
  BREATHING_AUDIO_EFFECTS,
  createBreathingIndicator,
  getBreathingPosture,
  getBreathingAudio,
} from "./feedback";
