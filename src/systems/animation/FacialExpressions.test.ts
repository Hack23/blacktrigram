/**
 * Unit tests for FacialExpressions system
 * 
 * Tests facial expression calculation from combat state,
 * expression transitions, and facial damage tracking.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  getExpressionFromCombatState,
  createExpressionTransition,
  updateExpressionState,
  calculateFacialDamage,
  resetFacialDamage,
  getExpressionIntensity,
  createDefaultExpressionState,
  createDefaultFacialDamage,
  DEFAULT_TRANSITION_CONFIG,
} from "./FacialExpressions";
import {
  FacialExpression,
  DEFAULT_FACIAL_DAMAGE,
  type FacialDamageState,
  type ExpressionState,
} from "../../types/facial";

describe("FacialExpressions", () => {
  describe("getExpressionFromCombatState", () => {
    it("should return DEFEATED when consciousness < 20", () => {
      const expression = getExpressionFromCombatState(
        50, // health
        100, // maxHealth
        50, // stamina
        30, // pain
        15, // consciousness (low)
        false, // justHit
        false // justLanded
      );
      expect(expression).toBe(FacialExpression.DEFEATED);
    });

    it("should return PAINED when just hit", () => {
      const expression = getExpressionFromCombatState(
        70, // health
        100, // maxHealth
        60, // stamina
        60, // pain (ignored - reserved for future intensity calculation)
        100, // consciousness
        true, // justHit
        false // justLanded
      );
      expect(expression).toBe(FacialExpression.PAINED);
    });

    it("should return EXHAUSTED when stamina < 30", () => {
      const expression = getExpressionFromCombatState(
        80, // health
        100, // maxHealth
        25, // stamina (low)
        20, // pain
        100, // consciousness
        false, // justHit
        false // justLanded
      );
      expect(expression).toBe(FacialExpression.EXHAUSTED);
    });

    it("should return VICTORIOUS when just landed a hit", () => {
      const expression = getExpressionFromCombatState(
        85, // health
        100, // maxHealth
        70, // stamina
        10, // pain
        100, // consciousness
        false, // justHit
        true // justLanded
      );
      expect(expression).toBe(FacialExpression.VICTORIOUS);
    });

    it("should return FOCUSED when high resources", () => {
      const expression = getExpressionFromCombatState(
        90, // health (high)
        100, // maxHealth
        80, // stamina (high)
        5, // pain (low)
        100, // consciousness
        false, // justHit
        false // justLanded
      );
      expect(expression).toBe(FacialExpression.FOCUSED);
    });

    it("should return NEUTRAL as default state", () => {
      const expression = getExpressionFromCombatState(
        50, // health (medium)
        100, // maxHealth
        50, // stamina (medium)
        30, // pain (medium)
        100, // consciousness
        false, // justHit
        false // justLanded
      );
      expect(expression).toBe(FacialExpression.NEUTRAL);
    });

    it("should prioritize PAINED over EXHAUSTED", () => {
      const expression = getExpressionFromCombatState(
        50, // health
        100, // maxHealth
        20, // stamina (low)
        70, // pain (high)
        100, // consciousness
        true, // justHit
        false // justLanded
      );
      expect(expression).toBe(FacialExpression.PAINED);
    });
  });

  describe("createExpressionTransition", () => {
    it("should create transition from current to new expression", () => {
      const currentState: ExpressionState = {
        expression: FacialExpression.NEUTRAL,
        intensity: 1.0,
        transitionTime: 0.2,
      };

      const newState = createExpressionTransition(
        currentState,
        FacialExpression.PAINED,
        0.3
      );

      expect(newState.expression).toBe(FacialExpression.PAINED);
      expect(newState.previousExpression).toBe(FacialExpression.NEUTRAL);
      expect(newState.transitionProgress).toBe(0);
      expect(newState.transitionTime).toBe(0.3);
    });

    it("should not create transition if same expression", () => {
      const currentState: ExpressionState = {
        expression: FacialExpression.FOCUSED,
        intensity: 1.0,
        transitionTime: 0.2,
      };

      const newState = createExpressionTransition(
        currentState,
        FacialExpression.FOCUSED
      );

      expect(newState).toEqual(currentState);
    });

    it("should use default transition time if not provided", () => {
      const currentState: ExpressionState = {
        expression: FacialExpression.NEUTRAL,
        intensity: 1.0,
        transitionTime: 0.2,
      };

      const newState = createExpressionTransition(
        currentState,
        FacialExpression.EXHAUSTED
      );

      expect(newState.transitionTime).toBe(
        DEFAULT_TRANSITION_CONFIG.defaultTransitionTime
      );
    });
  });

  describe("updateExpressionState", () => {
    it("should progress transition over time", () => {
      let state: ExpressionState = {
        expression: FacialExpression.PAINED,
        intensity: 1.0,
        transitionTime: 0.4,
        previousExpression: FacialExpression.NEUTRAL,
        transitionProgress: 0,
      };

      // Update with 0.1 seconds (25% of 0.4s)
      state = updateExpressionState(state, 0.1);
      expect(state.transitionProgress).toBeCloseTo(0.25, 2);

      // Update with another 0.1 seconds (50% total)
      state = updateExpressionState(state, 0.1);
      expect(state.transitionProgress).toBeCloseTo(0.5, 2);
    });

    it("should complete transition when time exceeds duration", () => {
      let state: ExpressionState = {
        expression: FacialExpression.FOCUSED,
        intensity: 1.0,
        transitionTime: 0.2,
        previousExpression: FacialExpression.NEUTRAL,
        transitionProgress: 0.8,
      };

      // Update with enough time to complete
      state = updateExpressionState(state, 0.1);

      expect(state.transitionProgress).toBeUndefined();
      expect(state.previousExpression).toBeUndefined();
    });

    it("should not update if no transition in progress", () => {
      const state: ExpressionState = {
        expression: FacialExpression.NEUTRAL,
        intensity: 1.0,
        transitionTime: 0.2,
      };

      const updatedState = updateExpressionState(state, 0.1);
      expect(updatedState).toEqual(state);
    });
  });

  describe("calculateFacialDamage", () => {
    let initialDamage: FacialDamageState;

    beforeEach(() => {
      initialDamage = { ...DEFAULT_FACIAL_DAMAGE };
    });

    it("should increase left eye swelling on left eye hit", () => {
      const damage = calculateFacialDamage(initialDamage, "left_eye", 40);
      
      expect(damage.leftEyeSwelling).toBeGreaterThan(0);
      expect(damage.leftCheekBruise).toBeGreaterThan(0);
      expect(damage.rightEyeSwelling).toBe(0);
    });

    it("should increase right eye swelling on right eye hit", () => {
      const damage = calculateFacialDamage(initialDamage, "right_eye", 30);
      
      expect(damage.rightEyeSwelling).toBeGreaterThan(0);
      expect(damage.rightCheekBruise).toBeGreaterThan(0);
      expect(damage.leftEyeSwelling).toBe(0);
    });

    it("should increase mouth bleeding on mouth/jaw hit", () => {
      const damage = calculateFacialDamage(initialDamage, "mouth", 50);
      
      expect(damage.mouthBleeding).toBeGreaterThan(0);
      expect(damage.jawBruise).toBeGreaterThan(0);
    });

    it("should increase nose bleeding on nose hit", () => {
      const damage = calculateFacialDamage(initialDamage, "nose", 60);
      
      expect(damage.noseBleeding).toBeGreaterThan(0);
    });

    it("should accumulate damage on multiple hits", () => {
      let damage = initialDamage;
      
      damage = calculateFacialDamage(damage, "left_eye", 20);
      const firstSwelling = damage.leftEyeSwelling;
      
      damage = calculateFacialDamage(damage, "left_eye", 20);
      
      expect(damage.leftEyeSwelling).toBeGreaterThan(firstSwelling);
    });

    it("should cap damage values at 1.0", () => {
      let damage = initialDamage;
      
      // Apply massive damage multiple times
      for (let i = 0; i < 10; i++) {
        damage = calculateFacialDamage(damage, "left_eye", 100);
      }
      
      expect(damage.leftEyeSwelling).toBeLessThanOrEqual(1.0);
      expect(damage.leftCheekBruise).toBeLessThanOrEqual(1.0);
    });

    it("should update total facial damage", () => {
      let damage = initialDamage;
      
      damage = calculateFacialDamage(damage, "left_eye", 25);
      expect(damage.totalFacialDamage).toBe(25);
      
      damage = calculateFacialDamage(damage, "mouth", 30);
      expect(damage.totalFacialDamage).toBe(55);
    });

    it("should handle unknown hit locations with general bruising", () => {
      const damage = calculateFacialDamage(initialDamage, "unknown_location", 30);
      
      expect(damage.leftCheekBruise).toBeGreaterThan(0);
      expect(damage.rightCheekBruise).toBeGreaterThan(0);
    });
  });

  describe("resetFacialDamage", () => {
    let damagedState: FacialDamageState;

    beforeEach(() => {
      damagedState = {
        leftEyeSwelling: 0.5,
        rightEyeSwelling: 0.3,
        mouthBleeding: 0.6,
        noseBleeding: 0.4,
        leftCheekBruise: 0.7,
        rightCheekBruise: 0.5,
        foreheadBruise: 0.3,
        jawBruise: 0.6,
        totalFacialDamage: 75,
      };
    });

    it("should completely reset damage when partialReset is false", () => {
      const reset = resetFacialDamage(damagedState, false);
      
      expect(reset).toEqual(DEFAULT_FACIAL_DAMAGE);
    });

    it("should partially reset damage when partialReset is true", () => {
      const reset = resetFacialDamage(damagedState, true, 0.5);
      
      expect(reset.leftEyeSwelling).toBeCloseTo(0.25, 2);
      expect(reset.mouthBleeding).toBeCloseTo(0.3, 2);
      expect(reset.totalFacialDamage).toBeCloseTo(37.5, 1);
    });

    it("should reduce damage to zero with 100% reset percentage", () => {
      const reset = resetFacialDamage(damagedState, true, 1.0);
      
      expect(reset.leftEyeSwelling).toBe(0);
      expect(reset.mouthBleeding).toBe(0);
      expect(reset.totalFacialDamage).toBe(0);
    });
  });

  describe("getExpressionIntensity", () => {
    it("should return high intensity for pained expression with high pain", () => {
      const intensity = getExpressionIntensity(
        FacialExpression.PAINED,
        80,
        50
      );
      
      expect(intensity).toBeCloseTo(0.8, 1);
    });

    it("should return high intensity for exhausted expression with low stamina", () => {
      const intensity = getExpressionIntensity(
        FacialExpression.EXHAUSTED,
        50,
        20
      );
      
      expect(intensity).toBeCloseTo(0.8, 1);
    });

    it("should return high intensity for focused expression with high stamina", () => {
      const intensity = getExpressionIntensity(
        FacialExpression.FOCUSED,
        50,
        90
      );
      
      expect(intensity).toBeCloseTo(0.9, 1);
    });

    it("should return fixed intensity for victorious expression", () => {
      const intensity = getExpressionIntensity(
        FacialExpression.VICTORIOUS,
        50,
        50
      );
      
      expect(intensity).toBe(0.7);
    });

    it("should return full intensity for defeated expression", () => {
      const intensity = getExpressionIntensity(
        FacialExpression.DEFEATED,
        0,
        0
      );
      
      expect(intensity).toBe(1.0);
    });

    it("should return full intensity for neutral expression", () => {
      const intensity = getExpressionIntensity(
        FacialExpression.NEUTRAL,
        50,
        50
      );
      
      expect(intensity).toBe(1.0);
    });
  });

  describe("createDefaultExpressionState", () => {
    it("should create neutral expression state", () => {
      const state = createDefaultExpressionState();
      
      expect(state.expression).toBe(FacialExpression.NEUTRAL);
      expect(state.intensity).toBe(1.0);
      expect(state.transitionTime).toBe(0.2);
      expect(state.previousExpression).toBeUndefined();
      expect(state.transitionProgress).toBeUndefined();
    });
  });

  describe("createDefaultFacialDamage", () => {
    it("should create zero-damage state", () => {
      const damage = createDefaultFacialDamage();
      
      expect(damage.leftEyeSwelling).toBe(0);
      expect(damage.rightEyeSwelling).toBe(0);
      expect(damage.mouthBleeding).toBe(0);
      expect(damage.noseBleeding).toBe(0);
      expect(damage.leftCheekBruise).toBe(0);
      expect(damage.rightCheekBruise).toBe(0);
      expect(damage.foreheadBruise).toBe(0);
      expect(damage.jawBruise).toBe(0);
      expect(damage.totalFacialDamage).toBe(0);
    });
  });
});
