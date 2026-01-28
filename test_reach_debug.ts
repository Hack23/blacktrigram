import { getArchetypePhysicalAttributes } from "./src/data/archetypePhysicalAttributes";
import { PlayerArchetype } from "./src/types/common";
import { TrigramStance } from "./src/types/common";
import { physicalReachCalculator } from "./src/systems/physics/PhysicalReachCalculator";
import { AnimationType } from "./src/systems/animation";
import { calculateBodyRadius } from "./src/utils/skeletonScaling";

const jojikPhysical = getArchetypePhysicalAttributes(PlayerArchetype.JOJIK_POKRYEOKBAE);
const hackerPhysical = getArchetypePhysicalAttributes(PlayerArchetype.HACKER);

console.log("Jojik Physical Attributes:");
console.log("  Shoulder Width:", jojikPhysical.shoulderWidth, "cm");
console.log("  Arm Length:", jojikPhysical.armLength, "cm");

console.log("\nHacker Physical Attributes:");
console.log("  Shoulder Width:", hackerPhysical.shoulderWidth, "cm");
console.log("  Arm Length:", hackerPhysical.armLength, "cm");

const jojikRadius = calculateBodyRadius(jojikPhysical);
const hackerRadius = calculateBodyRadius(hackerPhysical);

console.log("\nBody Radii:");
console.log("  Jojik:", jojikRadius.toFixed(3), "m");
console.log("  Hacker:", hackerRadius.toFixed(3), "m");
console.log("  Combined:", (jojikRadius + hackerRadius).toFixed(3), "m");

const maxReach = physicalReachCalculator.calculateMaxReach(
  jojikPhysical,
  AnimationType.JAB,
  TrigramStance.GEON
);

console.log("\nJojik JAB Max Reach:", maxReach.toFixed(3), "m");

const testDistance = 1.0;
const effectiveDistance = testDistance - jojikRadius - hackerRadius;
console.log("\nTest Distance:", testDistance, "m (center-to-center)");
console.log("Effective Distance:", effectiveDistance.toFixed(3), "m");
console.log("Can Hit:", effectiveDistance <= maxReach);
