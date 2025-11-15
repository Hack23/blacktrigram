import { describe, it, expect } from "vitest";
import { calculateDistance } from "./mathUtils";

describe("mathUtils", () => {
  describe("calculateDistance", () => {
    it("should calculate distance between two points", () => {
      const pos1 = { x: 0, y: 0 };
      const pos2 = { x: 3, y: 4 };

      const distance = calculateDistance(pos1, pos2);

      expect(distance).toBe(5); // 3-4-5 triangle
    });

    it("should return 0 for identical positions", () => {
      const pos1 = { x: 10, y: 20 };
      const pos2 = { x: 10, y: 20 };

      const distance = calculateDistance(pos1, pos2);

      expect(distance).toBe(0);
    });

    it("should handle negative coordinates", () => {
      const pos1 = { x: -3, y: -4 };
      const pos2 = { x: 0, y: 0 };

      const distance = calculateDistance(pos1, pos2);

      expect(distance).toBe(5);
    });

    it("should calculate horizontal distance", () => {
      const pos1 = { x: 0, y: 5 };
      const pos2 = { x: 10, y: 5 };

      const distance = calculateDistance(pos1, pos2);

      expect(distance).toBe(10);
    });

    it("should calculate vertical distance", () => {
      const pos1 = { x: 5, y: 0 };
      const pos2 = { x: 5, y: 10 };

      const distance = calculateDistance(pos1, pos2);

      expect(distance).toBe(10);
    });

    it("should handle decimal coordinates", () => {
      const pos1 = { x: 1.5, y: 2.5 };
      const pos2 = { x: 4.5, y: 6.5 };

      const distance = calculateDistance(pos1, pos2);

      expect(distance).toBe(5);
    });
  });
});
