/**
 * Physical Attributes Validation Report Script
 *
 * Validates all archetype physical attributes against anatomical formulas
 * and produces recommendations for corrections.
 *
 * Run with: npx tsx scripts/validate-physical-attributes.ts
 *
 * @module scripts/validate-physical-attributes
 * @korean 신체속성검증스크립트
 */

import {
  AMSALJA_PHYSICAL,
  HACKER_PHYSICAL,
  JEONGBO_PHYSICAL,
  JOJIK_PHYSICAL,
  MUSA_PHYSICAL,
} from "../src/data/archetypePhysicalAttributes";
import {
  ANATOMICAL_RANGES,
  calculateBMI,
  calculateExpectedArmLength,
  calculateExpectedLegLength,
  calculateExpectedMuscleMass,
  suggestCorrectedAttributes,
  validatePhysicalAttributes,
} from "../src/utils/physicalAttributeValidation";

const archetypes = [
  { name: "MUSA (무사)", data: MUSA_PHYSICAL },
  { name: "AMSALJA (암살자)", data: AMSALJA_PHYSICAL },
  { name: "HACKER (해커)", data: HACKER_PHYSICAL },
  { name: "JEONGBO (정보요원)", data: JEONGBO_PHYSICAL },
  { name: "JOJIK (조직폭력배)", data: JOJIK_PHYSICAL },
];

console.log("=".repeat(60));
console.log("BLACK TRIGRAM - Physical Attributes Validation Report");
console.log("흑괘 신체 속성 검증 보고서");
console.log("=".repeat(60));
console.log("");

// Anatomical reference formulas
console.log("📐 ANATOMICAL REFERENCE FORMULAS:");
console.log(
  `   Arm Length = Height × ${ANATOMICAL_RANGES.ARM_LENGTH_RATIO.typical} (range: ${ANATOMICAL_RANGES.ARM_LENGTH_RATIO.min}-${ANATOMICAL_RANGES.ARM_LENGTH_RATIO.max})`,
);
console.log(
  `   Leg Length = Height × ${ANATOMICAL_RANGES.LEG_LENGTH_RATIO.typical} (range: ${ANATOMICAL_RANGES.LEG_LENGTH_RATIO.min}-${ANATOMICAL_RANGES.LEG_LENGTH_RATIO.max})`,
);
console.log(
  `   Torso Length = Height × ${ANATOMICAL_RANGES.TORSO_LENGTH_RATIO.typical} (range: ${ANATOMICAL_RANGES.TORSO_LENGTH_RATIO.min}-${ANATOMICAL_RANGES.TORSO_LENGTH_RATIO.max})`,
);
console.log(
  `   Shoulder Width = Height × ${ANATOMICAL_RANGES.SHOULDER_WIDTH_RATIO.typical} (range: ${ANATOMICAL_RANGES.SHOULDER_WIDTH_RATIO.min}-${ANATOMICAL_RANGES.SHOULDER_WIDTH_RATIO.max})`,
);
console.log(
  `   Muscle Mass = Weight × ${ANATOMICAL_RANGES.MUSCLE_MASS_RATIO.typical} (range: ${ANATOMICAL_RANGES.MUSCLE_MASS_RATIO.min}-${ANATOMICAL_RANGES.MUSCLE_MASS_RATIO.max})`,
);
console.log("");

let totalIssues = 0;
const corrections: {
  archetype: string;
  field: string;
  current: number;
  suggested: number;
}[] = [];

archetypes.forEach(({ name, data }) => {
  console.log("-".repeat(60));
  console.log(`📊 ${name}`);
  console.log(
    `   Height: ${data.totalHeight} cm | Weight: ${data.weight} kg | BMI: ${calculateBMI(data.totalHeight, data.weight).toFixed(1)}`,
  );
  console.log("");

  // Calculate expected values
  const expectedArm = calculateExpectedArmLength(data.totalHeight);
  const expectedLeg = calculateExpectedLegLength(data.totalHeight);
  const expectedTorso =
    data.totalHeight * ANATOMICAL_RANGES.TORSO_LENGTH_RATIO.typical;
  const expectedShoulder =
    data.totalHeight * ANATOMICAL_RANGES.SHOULDER_WIDTH_RATIO.typical;
  const expectedMuscle = calculateExpectedMuscleMass(data.weight);
  const expectedHead =
    data.totalHeight * ANATOMICAL_RANGES.HEAD_SIZE_RATIO.typical;
  const expectedNeck =
    data.totalHeight * ANATOMICAL_RANGES.NECK_LENGTH_RATIO.typical;

  // Validate
  const result = validatePhysicalAttributes(data);
  const suggestions = suggestCorrectedAttributes(data);

  // Arm length
  const armRatio = data.armLength / data.totalHeight;
  const armValid =
    armRatio >= ANATOMICAL_RANGES.ARM_LENGTH_RATIO.min &&
    armRatio <= ANATOMICAL_RANGES.ARM_LENGTH_RATIO.max;
  const armIcon = armValid ? "✓" : "✗";
  console.log(
    `   ${armIcon} Arm Length: ${data.armLength} cm (expected: ${Math.round(expectedArm)} cm, ratio: ${(armRatio * 100).toFixed(1)}%)`,
  );
  if (!armValid) {
    totalIssues++;
    corrections.push({
      archetype: name,
      field: "armLength",
      current: data.armLength,
      suggested: Math.round(expectedArm),
    });
  }

  // Leg length
  const legRatio = data.legLength / data.totalHeight;
  const legValid =
    legRatio >= ANATOMICAL_RANGES.LEG_LENGTH_RATIO.min &&
    legRatio <= ANATOMICAL_RANGES.LEG_LENGTH_RATIO.max;
  const legIcon = legValid ? "✓" : "✗";
  console.log(
    `   ${legIcon} Leg Length: ${data.legLength} cm (expected: ${Math.round(expectedLeg)} cm, ratio: ${(legRatio * 100).toFixed(1)}%)`,
  );
  if (!legValid) {
    totalIssues++;
    corrections.push({
      archetype: name,
      field: "legLength",
      current: data.legLength,
      suggested: Math.round(expectedLeg),
    });
  }

  // Torso length
  const torsoRatio = data.torsoLength / data.totalHeight;
  const torsoValid =
    torsoRatio >= ANATOMICAL_RANGES.TORSO_LENGTH_RATIO.min &&
    torsoRatio <= ANATOMICAL_RANGES.TORSO_LENGTH_RATIO.max;
  const torsoIcon = torsoValid ? "✓" : "✗";
  console.log(
    `   ${torsoIcon} Torso Length: ${data.torsoLength} cm (expected: ${Math.round(expectedTorso)} cm, ratio: ${(torsoRatio * 100).toFixed(1)}%)`,
  );
  if (!torsoValid) {
    totalIssues++;
    corrections.push({
      archetype: name,
      field: "torsoLength",
      current: data.torsoLength,
      suggested: Math.round(expectedTorso),
    });
  }

  // Shoulder width
  const shoulderRatio = data.shoulderWidth / data.totalHeight;
  const shoulderValid =
    shoulderRatio >= ANATOMICAL_RANGES.SHOULDER_WIDTH_RATIO.min &&
    shoulderRatio <= ANATOMICAL_RANGES.SHOULDER_WIDTH_RATIO.max;
  const shoulderIcon = shoulderValid ? "✓" : "✗";
  console.log(
    `   ${shoulderIcon} Shoulder Width: ${data.shoulderWidth} cm (expected: ${Math.round(expectedShoulder)} cm, ratio: ${(shoulderRatio * 100).toFixed(1)}%)`,
  );
  if (!shoulderValid) {
    totalIssues++;
    corrections.push({
      archetype: name,
      field: "shoulderWidth",
      current: data.shoulderWidth,
      suggested: Math.round(expectedShoulder),
    });
  }

  // Muscle mass
  const muscleRatio = data.muscleMass / data.weight;
  const muscleValid =
    muscleRatio >= ANATOMICAL_RANGES.MUSCLE_MASS_RATIO.min &&
    muscleRatio <= ANATOMICAL_RANGES.MUSCLE_MASS_RATIO.max;
  const muscleIcon = muscleValid ? "✓" : "✗";
  console.log(
    `   ${muscleIcon} Muscle Mass: ${data.muscleMass} kg (expected: ${Math.round(expectedMuscle)} kg, ratio: ${(muscleRatio * 100).toFixed(1)}%)`,
  );
  if (!muscleValid) {
    totalIssues++;
    corrections.push({
      archetype: name,
      field: "muscleMass",
      current: data.muscleMass,
      suggested: Math.round(expectedMuscle),
    });
  }

  // Fat mass
  const fatRatio = data.fatMass / data.weight;
  const fatValid =
    fatRatio >= ANATOMICAL_RANGES.FAT_MASS_RATIO.min &&
    fatRatio <= ANATOMICAL_RANGES.FAT_MASS_RATIO.max;
  const fatIcon = fatValid ? "✓" : "✗";
  console.log(
    `   ${fatIcon} Fat Mass: ${data.fatMass} kg (ratio: ${(fatRatio * 100).toFixed(1)}%)`,
  );
  if (!fatValid) {
    totalIssues++;
    const expectedFat = Math.round(
      data.weight * ANATOMICAL_RANGES.FAT_MASS_RATIO.typical,
    );
    corrections.push({
      archetype: name,
      field: "fatMass",
      current: data.fatMass,
      suggested: expectedFat,
    });
  }

  // Head size
  const headRatio = data.headSize / data.totalHeight;
  const headValid =
    headRatio >= ANATOMICAL_RANGES.HEAD_SIZE_RATIO.min &&
    headRatio <= ANATOMICAL_RANGES.HEAD_SIZE_RATIO.max;
  const headIcon = headValid ? "✓" : "✗";
  console.log(
    `   ${headIcon} Head Size: ${data.headSize} cm (expected: ${Math.round(expectedHead)} cm, ratio: ${(headRatio * 100).toFixed(1)}%)`,
  );
  if (!headValid) {
    totalIssues++;
    corrections.push({
      archetype: name,
      field: "headSize",
      current: data.headSize,
      suggested: Math.round(expectedHead),
    });
  }

  // Neck length
  const neckRatio = data.neckLength / data.totalHeight;
  const neckValid =
    neckRatio >= ANATOMICAL_RANGES.NECK_LENGTH_RATIO.min &&
    neckRatio <= ANATOMICAL_RANGES.NECK_LENGTH_RATIO.max;
  const neckIcon = neckValid ? "✓" : "✗";
  console.log(
    `   ${neckIcon} Neck Length: ${data.neckLength} cm (expected: ${Math.round(expectedNeck)} cm, ratio: ${(neckRatio * 100).toFixed(1)}%)`,
  );
  if (!neckValid) {
    totalIssues++;
    corrections.push({
      archetype: name,
      field: "neckLength",
      current: data.neckLength,
      suggested: Math.round(expectedNeck),
    });
  }

  console.log("");
});

console.log("=".repeat(60));
console.log("📋 SUMMARY");
console.log("=".repeat(60));
console.log(`Total issues found: ${totalIssues}`);
console.log("");

if (corrections.length > 0) {
  console.log("📝 RECOMMENDED CORRECTIONS:");
  corrections.forEach(({ archetype, field, current, suggested }) => {
    console.log(`   ${archetype}.${field}: ${current} → ${suggested}`);
  });
  console.log("");

  // Generate TypeScript patch
  console.log("📄 SUGGESTED CODE CHANGES:");
  console.log("");
  corrections.forEach(({ archetype, field, current, suggested }) => {
    const constName = archetype.split(" ")[0];
    console.log(`// ${archetype}`);
    console.log(`// ${field}: ${current} → ${suggested}`);
  });
}

console.log("");
console.log("=".repeat(60));
console.log("Validation complete. | 검증 완료.");
console.log("=".repeat(60));
