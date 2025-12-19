/**
 * Facial expression system for realistic combat emotion
 * 
 * Manages facial expression state based on combat conditions:
 * - Health, stamina, pain, consciousness levels
 * - Recent combat events (hits taken/landed)
 * - Dynamic expression transitions
 * 
 * @module systems/animation/FacialExpressions
 * @category Animation System
 * @korean 얼굴표정시스템
 */

import {
  FacialExpression,
  type ExpressionState,
  type FacialDamageState,
  DEFAULT_FACIAL_DAMAGE,
  DEFAULT_EXPRESSION_STATE,
} from "../../types/facial";

/**
 * Expression transition configuration
 * 
 * @public
 * @korean 표정전환설정
 */
export interface ExpressionTransitionConfig {
  /** Default transition time in seconds */
  readonly defaultTransitionTime: number;
  
  /** Quick transition time for immediate reactions */
  readonly quickTransitionTime: number;
  
  /** Slow transition time for gradual changes */
  readonly slowTransitionTime: number;
}

/**
 * Default expression transition configuration
 * 
 * @public
 * @korean 기본표정전환설정
 */
export const DEFAULT_TRANSITION_CONFIG: ExpressionTransitionConfig = {
  defaultTransitionTime: 0.2,
  quickTransitionTime: 0.1,
  slowTransitionTime: 0.5,
};

/**
 * Get facial expression based on current combat state
 * 
 * Evaluates fighter's physical and mental state to determine appropriate
 * facial expression. Priority order:
 * 1. Defeated (unconscious)
 * 2. Pained (just hit)
 * 3. Exhausted (low stamina)
 * 4. Victorious (just landed hit)
 * 5. Focused (high resources)
 * 6. Neutral (default)
 * 
 * @param health - Current health (0-100)
 * @param maxHealth - Maximum health
 * @param stamina - Current stamina (0-100)
 * @param pain - Pain level (0-100)
 * @param consciousness - Consciousness level (0-100)
 * @param justHit - Whether fighter was just hit
 * @param justLanded - Whether fighter just landed a hit
 * @returns Appropriate facial expression for combat state
 * 
 * @example
 * ```typescript
 * const expression = getExpressionFromCombatState(
 *   85,  // health
 *   100, // maxHealth
 *   60,  // stamina
 *   20,  // pain
 *   100, // consciousness
 *   false, // justHit
 *   true   // justLanded
 * );
 * // Returns: FacialExpression.VICTORIOUS
 * ```
 * 
 * @public
 * @korean 전투상태로부터표정가져오기
 */
export const getExpressionFromCombatState = (
  health: number,
  maxHealth: number,
  stamina: number,
  pain: number,
  consciousness: number,
  justHit: boolean,
  justLanded: boolean
): FacialExpression => {
  // Knocked out
  if (consciousness < 20) {
    return FacialExpression.DEFEATED;
  }

  // Just got hit (priority if pain is significant)
  if (justHit && pain > 50) {
    return FacialExpression.PAINED;
  }

  // Low stamina (exhausted)
  if (stamina < 30) {
    return FacialExpression.EXHAUSTED;
  }

  // Just landed a hit (brief satisfaction)
  if (justLanded) {
    return FacialExpression.VICTORIOUS;
  }

  // High focus (ready to fight)
  const healthPercentage = (health / maxHealth) * 100;
  if (stamina > 70 && healthPercentage > 60) {
    return FacialExpression.FOCUSED;
  }

  // Default calm state
  return FacialExpression.NEUTRAL;
};

/**
 * Create new expression state with transition
 * 
 * @param currentState - Current expression state
 * @param newExpression - New expression to transition to
 * @param transitionTime - Time to transition (seconds)
 * @returns New expression state with transition initialized
 * 
 * @public
 * @korean 새표정상태생성
 */
export const createExpressionTransition = (
  currentState: ExpressionState,
  newExpression: FacialExpression,
  transitionTime?: number
): ExpressionState => {
  // No transition needed if same expression
  if (currentState.expression === newExpression) {
    return currentState;
  }

  return {
    expression: newExpression,
    intensity: 1.0,
    transitionTime: transitionTime ?? DEFAULT_TRANSITION_CONFIG.defaultTransitionTime,
    previousExpression: currentState.expression,
    transitionProgress: 0,
  };
};

/**
 * Update expression state during transition
 * 
 * @param state - Current expression state
 * @param deltaTime - Time since last update (seconds)
 * @returns Updated expression state with transition progress
 * 
 * @public
 * @korean 표정상태업데이트
 */
export const updateExpressionState = (
  state: ExpressionState,
  deltaTime: number
): ExpressionState => {
  // No transition in progress
  if (state.transitionProgress === undefined || state.transitionProgress >= 1.0) {
    return state;
  }

  // Calculate new progress
  const progressIncrement = deltaTime / state.transitionTime;
  const newProgress = Math.min(state.transitionProgress + progressIncrement, 1.0);

  // Transition complete
  if (newProgress >= 1.0) {
    return {
      expression: state.expression,
      intensity: state.intensity,
      transitionTime: state.transitionTime,
      previousExpression: undefined,
      transitionProgress: undefined,
    };
  }

  // Transition in progress
  return {
    ...state,
    transitionProgress: newProgress,
  };
};

/**
 * Calculate facial damage from hit
 * 
 * Updates facial damage state based on hit location and damage amount.
 * Different facial regions accumulate damage independently.
 * 
 * @param currentDamage - Current facial damage state
 * @param hitLocation - Location of hit on face ("left_eye", "right_eye", "mouth", "nose", etc.)
 * @param damageAmount - Amount of damage dealt (0-100)
 * @returns Updated facial damage state
 * 
 * @example
 * ```typescript
 * const damage = calculateFacialDamage(
 *   DEFAULT_FACIAL_DAMAGE,
 *   "left_eye",
 *   25
 * );
 * // Returns damage state with left eye swelling increased
 * ```
 * 
 * @public
 * @korean 얼굴손상계산
 */
export const calculateFacialDamage = (
  currentDamage: FacialDamageState,
  hitLocation: string,
  damageAmount: number
): FacialDamageState => {
  const damageIntensity = Math.min(damageAmount / 100, 1.0);
  const newDamage = { ...currentDamage };

  switch (hitLocation.toLowerCase()) {
    case "left_eye":
    case "temple_left":
      newDamage.leftEyeSwelling = Math.min(
        currentDamage.leftEyeSwelling + damageIntensity * 0.3,
        1.0
      );
      newDamage.leftCheekBruise = Math.min(
        currentDamage.leftCheekBruise + damageIntensity * 0.2,
        1.0
      );
      break;

    case "right_eye":
    case "temple_right":
      newDamage.rightEyeSwelling = Math.min(
        currentDamage.rightEyeSwelling + damageIntensity * 0.3,
        1.0
      );
      newDamage.rightCheekBruise = Math.min(
        currentDamage.rightCheekBruise + damageIntensity * 0.2,
        1.0
      );
      break;

    case "mouth":
    case "jaw":
    case "chin":
      newDamage.mouthBleeding = Math.min(
        currentDamage.mouthBleeding + damageIntensity * 0.4,
        1.0
      );
      newDamage.jawBruise = Math.min(
        currentDamage.jawBruise + damageIntensity * 0.3,
        1.0
      );
      break;

    case "nose":
      newDamage.noseBleeding = Math.min(
        currentDamage.noseBleeding + damageIntensity * 0.5,
        1.0
      );
      break;

    case "forehead":
    case "crown":
      newDamage.foreheadBruise = Math.min(
        currentDamage.foreheadBruise + damageIntensity * 0.3,
        1.0
      );
      break;

    case "cheek_left":
      newDamage.leftCheekBruise = Math.min(
        currentDamage.leftCheekBruise + damageIntensity * 0.4,
        1.0
      );
      break;

    case "cheek_right":
      newDamage.rightCheekBruise = Math.min(
        currentDamage.rightCheekBruise + damageIntensity * 0.4,
        1.0
      );
      break;

    default:
      // General facial hit - add minor bruising
      newDamage.leftCheekBruise = Math.min(
        currentDamage.leftCheekBruise + damageIntensity * 0.1,
        1.0
      );
      newDamage.rightCheekBruise = Math.min(
        currentDamage.rightCheekBruise + damageIntensity * 0.1,
        1.0
      );
      break;
  }

  // Update total facial damage
  newDamage.totalFacialDamage = Math.min(
    currentDamage.totalFacialDamage + damageAmount,
    100
  );

  return newDamage;
};

/**
 * Reset facial damage (for new round or healing)
 * 
 * @param partialReset - If true, only reduces damage by percentage (healing)
 * @param resetPercentage - Percentage to reduce damage (0-1)
 * @returns Fresh facial damage state
 * 
 * @public
 * @korean 얼굴손상초기화
 */
export const resetFacialDamage = (
  currentDamage: FacialDamageState,
  partialReset = false,
  resetPercentage = 1.0
): FacialDamageState => {
  if (!partialReset) {
    return DEFAULT_FACIAL_DAMAGE;
  }

  // Partial healing - reduce all damage values
  const healingFactor = 1.0 - resetPercentage;
  return {
    leftEyeSwelling: currentDamage.leftEyeSwelling * healingFactor,
    rightEyeSwelling: currentDamage.rightEyeSwelling * healingFactor,
    mouthBleeding: currentDamage.mouthBleeding * healingFactor,
    noseBleeding: currentDamage.noseBleeding * healingFactor,
    leftCheekBruise: currentDamage.leftCheekBruise * healingFactor,
    rightCheekBruise: currentDamage.rightCheekBruise * healingFactor,
    foreheadBruise: currentDamage.foreheadBruise * healingFactor,
    jawBruise: currentDamage.jawBruise * healingFactor,
    totalFacialDamage: currentDamage.totalFacialDamage * healingFactor,
  };
};

/**
 * Get expression intensity based on combat state
 * 
 * Expression intensity affects degree of facial movement.
 * Higher pain/damage = more intense expressions.
 * 
 * @param expression - Current facial expression
 * @param pain - Pain level (0-100)
 * @param stamina - Stamina level (0-100)
 * @returns Expression intensity (0-1)
 * 
 * @public
 * @korean 표정강도가져오기
 */
export const getExpressionIntensity = (
  expression: FacialExpression,
  pain: number,
  stamina: number
): number => {
  switch (expression) {
    case FacialExpression.PAINED:
      // Higher pain = more intense pained expression
      return Math.min(pain / 100, 1.0);

    case FacialExpression.EXHAUSTED:
      // Lower stamina = more intense exhaustion
      return Math.min(1.0 - stamina / 100, 1.0);

    case FacialExpression.FOCUSED:
      // High stamina = more intense focus
      return Math.min(stamina / 100, 1.0);

    case FacialExpression.VICTORIOUS:
      // Brief, moderate intensity
      return 0.7;

    case FacialExpression.DEFEATED:
      // Full intensity (unconscious)
      return 1.0;

    case FacialExpression.NEUTRAL:
    default:
      // Default intensity
      return 1.0;
  }
};

/**
 * Create default expression state
 * 
 * @returns Default neutral expression state
 * 
 * @public
 * @korean 기본표정상태생성
 */
export const createDefaultExpressionState = (): ExpressionState => {
  return { ...DEFAULT_EXPRESSION_STATE };
};

/**
 * Create default facial damage state
 * 
 * @returns Default facial damage state with no damage
 * 
 * @public
 * @korean 기본얼굴손상생성
 */
export const createDefaultFacialDamage = (): FacialDamageState => {
  return { ...DEFAULT_FACIAL_DAMAGE };
};
