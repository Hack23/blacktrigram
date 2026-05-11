/**
 * Physical Attributes Validation Utility
 *
 * **Korean**: 신체 속성 검증 유틸리티
 *
 * Validates physical attributes against anatomical formulas to ensure
 * realistic body proportions for Korean adult males.
 *
 * ## Anatomical References
 *
 * Based on Korean anthropometric studies and human proportion canon:
 * - Arm length: ~44% of height (shoulder to fingertip)
 * - Leg length: ~48-53% of height (ground to hip)
 * - Torso length: ~32-34% of height
 * - Head size: ~12.5% of height (8-head proportion)
 * - Shoulder width: ~23-27% of height for males
 *
 * ## Weight Composition
 *
 * For athletic males:
 * - Muscle mass: 35-45% of body weight
 * - Fat mass: 10-20% for athletes, 15-25% for average
 * - Bone/organs: ~40-45% of weight
 *
 * @module utils/physicalAttributeValidation
 * @category Validation
 * @korean 신체속성검증
 */

import type { PhysicalAttributes } from "@/types";

/**
 * Anatomical proportion ranges for Korean adult males.
 *
 * @korean 해부학적비율범위
 */
export const ANATOMICAL_RANGES = {
  // Height proportions (as fraction of total height)
  ARM_LENGTH_RATIO: { min: 0.4, max: 0.47, typical: 0.43 }, // Shoulder to fingertip
  LEG_LENGTH_RATIO: { min: 0.48, max: 0.56, typical: 0.52 }, // Ground to hip
  TORSO_LENGTH_RATIO: { min: 0.3, max: 0.36, typical: 0.33 },
  HEAD_SIZE_RATIO: { min: 0.11, max: 0.14, typical: 0.125 },
  NECK_LENGTH_RATIO: { min: 0.045, max: 0.065, typical: 0.055 },
  SHOULDER_WIDTH_RATIO: { min: 0.22, max: 0.3, typical: 0.255 },

  // Weight composition (as fraction of body weight)
  MUSCLE_MASS_RATIO: { min: 0.35, max: 0.52, typical: 0.43 }, // Athletes
  FAT_MASS_RATIO: { min: 0.08, max: 0.25, typical: 0.15 },

  // Combined (muscle + fat) should be reasonable portion of weight
  SOFT_TISSUE_RATIO: { min: 0.5, max: 0.7, typical: 0.58 },

  // BMI range for healthy adult
  BMI: { min: 18.5, max: 30, typical: 23.5 },
} as const;

/**
 * Validation result for a single attribute.
 */
export interface AttributeValidation {
  readonly attribute: string;
  readonly value: number;
  readonly expected: { min: number; max: number; typical: number };
  readonly isValid: boolean;
  readonly deviation: number; // Percentage deviation from typical
  readonly suggestion?: string;
}

/**
 * Complete validation result for physical attributes.
 */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly validations: readonly AttributeValidation[];
  readonly summary: string;
}

/**
 * Calculate expected arm length from height.
 *
 * Formula: armLength = height * 0.43 (typical Korean male)
 * Arm span is roughly equal to height; each arm is ~43% from shoulder.
 *
 * @param height - Total height in cm
 * @returns Expected arm length in cm
 * @korean 예상팔길이계산
 */
export function calculateExpectedArmLength(height: number): number {
  return height * ANATOMICAL_RANGES.ARM_LENGTH_RATIO.typical;
}

/**
 * Calculate expected leg length from height.
 *
 * Formula: legLength = height * 0.52 (typical, can vary 0.48-0.56)
 * Korean adults tend toward longer leg proportions.
 *
 * @param height - Total height in cm
 * @returns Expected leg length in cm
 * @korean 예상다리길이계산
 */
export function calculateExpectedLegLength(height: number): number {
  return height * ANATOMICAL_RANGES.LEG_LENGTH_RATIO.typical;
}

/**
 * Calculate expected torso length from height.
 *
 * Formula: torsoLength = height * 0.33
 *
 * @param height - Total height in cm
 * @returns Expected torso length in cm
 * @korean 예상몸통길이계산
 */
export function calculateExpectedTorsoLength(height: number): number {
  return height * ANATOMICAL_RANGES.TORSO_LENGTH_RATIO.typical;
}

/**
 * Calculate expected shoulder width from height.
 *
 * Formula: shoulderWidth = height * 0.255 (males)
 *
 * @param height - Total height in cm
 * @returns Expected shoulder width in cm
 * @korean 예상어깨너비계산
 */
export function calculateExpectedShoulderWidth(height: number): number {
  return height * ANATOMICAL_RANGES.SHOULDER_WIDTH_RATIO.typical;
}

/**
 * Calculate expected muscle mass from weight (for athletes).
 *
 * Formula: muscleMass = weight * 0.43 (trained male athlete)
 *
 * @param weight - Body weight in kg
 * @returns Expected muscle mass in kg
 * @korean 예상근육량계산
 */
export function calculateExpectedMuscleMass(weight: number): number {
  return weight * ANATOMICAL_RANGES.MUSCLE_MASS_RATIO.typical;
}

/**
 * Calculate BMI from height and weight.
 *
 * Formula: BMI = weight / (height in meters)²
 *
 * @param height - Total height in cm
 * @param weight - Body weight in kg
 * @returns BMI value
 * @korean BMI계산
 */
export function calculateBMI(height: number, weight: number): number {
  const heightMeters = height / 100;
  return weight / (heightMeters * heightMeters);
}

/**
 * Validate a single proportion against expected range.
 */
function validateProportion(
  attribute: string,
  actual: number,
  reference: number,
  range: { min: number; max: number; typical: number },
): AttributeValidation {
  const actualRatio = actual / reference;
  const isValid = actualRatio >= range.min && actualRatio <= range.max;
  const deviation = ((actualRatio - range.typical) / range.typical) * 100;

  let suggestion: string | undefined;
  if (!isValid) {
    const expectedMin = Math.round(reference * range.min);
    const expectedMax = Math.round(reference * range.max);
    suggestion = `Expected ${expectedMin}-${expectedMax} cm`;
  }

  return {
    attribute,
    value: actual,
    expected: {
      min: Math.round(reference * range.min),
      max: Math.round(reference * range.max),
      typical: Math.round(reference * range.typical),
    },
    isValid,
    deviation: Math.round(deviation * 10) / 10,
    suggestion,
  };
}

/**
 * Validate physical attributes against anatomical formulas.
 *
 * @param attrs - Physical attributes to validate
 * @returns Validation result with details
 * @korean 신체속성검증
 */
export function validatePhysicalAttributes(
  attrs: PhysicalAttributes,
): ValidationResult {
  const validations: AttributeValidation[] = [];

  validations.push(
    validateProportion(
      "armLength",
      attrs.armLength,
      attrs.totalHeight,
      ANATOMICAL_RANGES.ARM_LENGTH_RATIO,
    ),
  );

  validations.push(
    validateProportion(
      "legLength",
      attrs.legLength,
      attrs.totalHeight,
      ANATOMICAL_RANGES.LEG_LENGTH_RATIO,
    ),
  );

  validations.push(
    validateProportion(
      "torsoLength",
      attrs.torsoLength,
      attrs.totalHeight,
      ANATOMICAL_RANGES.TORSO_LENGTH_RATIO,
    ),
  );

  validations.push(
    validateProportion(
      "shoulderWidth",
      attrs.shoulderWidth,
      attrs.totalHeight,
      ANATOMICAL_RANGES.SHOULDER_WIDTH_RATIO,
    ),
  );

  validations.push(
    validateProportion(
      "headSize",
      attrs.headSize,
      attrs.totalHeight,
      ANATOMICAL_RANGES.HEAD_SIZE_RATIO,
    ),
  );

  validations.push(
    validateProportion(
      "neckLength",
      attrs.neckLength,
      attrs.totalHeight,
      ANATOMICAL_RANGES.NECK_LENGTH_RATIO,
    ),
  );

  validations.push(
    validateProportion(
      "muscleMass",
      attrs.muscleMass,
      attrs.weight,
      ANATOMICAL_RANGES.MUSCLE_MASS_RATIO,
    ),
  );

  validations.push(
    validateProportion(
      "fatMass",
      attrs.fatMass,
      attrs.weight,
      ANATOMICAL_RANGES.FAT_MASS_RATIO,
    ),
  );

  const bmi = calculateBMI(attrs.totalHeight, attrs.weight);
  const bmiValid =
    bmi >= ANATOMICAL_RANGES.BMI.min && bmi <= ANATOMICAL_RANGES.BMI.max;
  validations.push({
    attribute: "BMI",
    value: Math.round(bmi * 10) / 10,
    expected: ANATOMICAL_RANGES.BMI,
    isValid: bmiValid,
    deviation:
      Math.round(
        ((bmi - ANATOMICAL_RANGES.BMI.typical) /
          ANATOMICAL_RANGES.BMI.typical) *
          1000,
      ) / 10,
    suggestion: bmiValid
      ? undefined
      : `BMI ${bmi.toFixed(1)} outside healthy range`,
  });

  const softTissueRatio = (attrs.muscleMass + attrs.fatMass) / attrs.weight;
  const softTissueValid =
    softTissueRatio >= ANATOMICAL_RANGES.SOFT_TISSUE_RATIO.min &&
    softTissueRatio <= ANATOMICAL_RANGES.SOFT_TISSUE_RATIO.max;
  validations.push({
    attribute: "softTissueRatio",
    value: Math.round(softTissueRatio * 100),
    expected: {
      min: Math.round(ANATOMICAL_RANGES.SOFT_TISSUE_RATIO.min * 100),
      max: Math.round(ANATOMICAL_RANGES.SOFT_TISSUE_RATIO.max * 100),
      typical: Math.round(ANATOMICAL_RANGES.SOFT_TISSUE_RATIO.typical * 100),
    },
    isValid: softTissueValid,
    deviation:
      Math.round(
        ((softTissueRatio - ANATOMICAL_RANGES.SOFT_TISSUE_RATIO.typical) /
          ANATOMICAL_RANGES.SOFT_TISSUE_RATIO.typical) *
          1000,
      ) / 10,
    suggestion: softTissueValid
      ? undefined
      : `Muscle+fat should be 50-70% of weight`,
  });

  const isValid = validations.every((v) => v.isValid);
  const invalidCount = validations.filter((v) => !v.isValid).length;

  const summary = isValid
    ? "All proportions are anatomically valid"
    : `${invalidCount} attribute(s) outside expected range`;

  return { isValid, validations, summary };
}

/**
 * Mutable version of PhysicalAttributes for building suggestions.
 * @internal
 */
type MutablePhysicalAttributes = {
  -readonly [K in keyof PhysicalAttributes]?: PhysicalAttributes[K];
};

/**
 * Suggest corrections for physical attributes.
 *
 * @param attrs - Physical attributes to correct
 * @returns Suggested corrected attributes
 * @korean 신체속성교정제안
 */
export function suggestCorrectedAttributes(
  attrs: PhysicalAttributes,
): Partial<PhysicalAttributes> {
  const suggestions: MutablePhysicalAttributes = {};

  const expectedArm = calculateExpectedArmLength(attrs.totalHeight);
  const expectedLeg = calculateExpectedLegLength(attrs.totalHeight);
  const expectedTorso = calculateExpectedTorsoLength(attrs.totalHeight);
  const expectedShoulder = calculateExpectedShoulderWidth(attrs.totalHeight);
  const expectedMuscle = calculateExpectedMuscleMass(attrs.weight);
  if (Math.abs(attrs.armLength - expectedArm) / expectedArm > 0.1) {
    suggestions.armLength = Math.round(expectedArm);
  }
  if (Math.abs(attrs.legLength - expectedLeg) / expectedLeg > 0.1) {
    suggestions.legLength = Math.round(expectedLeg);
  }
  if (Math.abs(attrs.torsoLength - expectedTorso) / expectedTorso > 0.1) {
    suggestions.torsoLength = Math.round(expectedTorso);
  }
  if (
    Math.abs(attrs.shoulderWidth - expectedShoulder) / expectedShoulder >
    0.1
  ) {
    suggestions.shoulderWidth = Math.round(expectedShoulder);
  }
  if (Math.abs(attrs.muscleMass - expectedMuscle) / expectedMuscle > 0.15) {
    suggestions.muscleMass = Math.round(expectedMuscle);
  }

  return suggestions;
}

/**
 * Print validation report to console.
 *
 * @param name - Archetype name
 * @param attrs - Physical attributes
 * @korean 검증리포트출력
 */
export function printValidationReport(
  name: string,
  attrs: PhysicalAttributes,
): void {
  const result = validatePhysicalAttributes(attrs);

  console.log(`\n=== ${name} Physical Attributes Validation ===`);
  console.log(`Height: ${attrs.totalHeight}cm, Weight: ${attrs.weight}kg`);
  console.log(`Result: ${result.summary}`);
  console.log("");

  result.validations.forEach((v) => {
    const status = v.isValid ? "✓" : "✗";
    const devStr = v.deviation > 0 ? `+${v.deviation}%` : `${v.deviation}%`;
    console.log(
      `  ${status} ${v.attribute}: ${v.value} ` +
        `(expected ${v.expected.typical}, deviation ${devStr})` +
        (v.suggestion ? ` - ${v.suggestion}` : ""),
    );
  });

  const suggestions = suggestCorrectedAttributes(attrs);
  if (Object.keys(suggestions).length > 0) {
    console.log("\nSuggested corrections:");
    Object.entries(suggestions).forEach(([key, value]) => {
      console.log(
        `  ${key}: ${attrs[key as keyof PhysicalAttributes]} → ${value}`,
      );
    });
  }
}
