import { describe, it, expect } from "vitest";
import { KoreanCulture } from "./KoreanCulture";
import { TrigramStance, PlayerArchetype } from "../../types/enums";

/**
 * ## Korean Culture System Test Suite
 *
 * **Business Purpose:**
 * Validates the cultural authenticity engine that ensures Black Trigram maintains
 * respectful and accurate Korean martial arts representation. Tests ensure that:
 * - Korean terminology is used correctly throughout the system
 * - Traditional Korean martial arts principles are properly implemented
 * - Cultural elements enhance rather than stereotype Korean traditions
 * - Educational content provides authentic Korean martial arts knowledge
 *
 * **Korean Martial Arts Integration:**
 * - Tests authentic Korean martial arts terminology accuracy
 * - Validates traditional Korean cultural elements in gameplay
 * - Ensures respectful representation of Korean martial arts philosophy
 * - Verifies educational value of Korean martial arts content
 *
 * **Business Value:**
 * These tests ensure cultural authenticity provides meaningful educational value
 * while maintaining respectful and accurate Korean martial arts representation.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("KoreanCulture", () => {
  let culture: KoreanCulture;

  beforeEach(() => {
    culture = new KoreanCulture();
  });

  /**
   * **Business Requirement:** Korean terminology must be authentic and
   * properly used throughout the martial arts experience
   */
  describe("Korean Terminology Validation", () => {
    it("should provide authentic Korean stance names", () => {
      expect(culture.getStanceName(TrigramStance.GEON)).toEqual({
        korean: "건",
        english: "Heaven",
        description: expect.stringContaining("하늘"),
      });

      expect(culture.getStanceName(TrigramStance.LI)).toEqual({
        korean: "리",
        english: "Fire",
        description: expect.stringContaining("불"),
      });
    });

    it("should provide correct archetype terminology", () => {
      const musaInfo = culture.getArchetypeInfo(PlayerArchetype.MUSA);
      expect(musaInfo.korean).toBe("무사");
      expect(musaInfo.description).toContain("전통");

      const amsaljaInfo = culture.getArchetypeInfo(PlayerArchetype.AMSALJA);
      expect(amsaljaInfo.korean).toBe("암살자");
      expect(amsaljaInfo.philosophy).toContain("효율");
    });

    it("should validate Korean technique names", () => {
      const techniques = culture.getTechniquesByStance(TrigramStance.GEON);

      techniques.forEach((technique) => {
        expect(technique.koreanName).toMatch(/[\u3131-\u318E\uAC00-\uD7A3]/);
        expect(technique.englishName).toBeTruthy();
        expect(technique.culturalContext).toBeTruthy();
      });
    });
  });

  /**
   * **Business Requirement:** Traditional Korean martial arts principles must be
   * accurately represented and educationally valuable
   */
  describe("Traditional Martial Arts Principles", () => {
    it("should explain trigram philosophy correctly", () => {
      const philosophy = culture.getTrigramPhilosophy(TrigramStance.GEON);

      expect(philosophy.iChingOrigin).toBeTruthy();
      expect(philosophy.martialApplication).toBeTruthy();
      expect(philosophy.energyFlow).toBeTruthy();
      expect(philosophy.culturalSignificance).toBeTruthy();
    });

    it("should provide traditional training methods", () => {
      const methods = culture.getTraditionalTrainingMethods();

      expect(methods).toContain(
        expect.objectContaining({
          name: expect.stringMatching(/[\u3131-\u318E\uAC00-\uD7A3]/),
          description: expect.any(String),
          culturalContext: expect.any(String),
        })
      );
    });

    it("should validate cultural appropriateness", () => {
      const validation = culture.validateCulturalAccuracy({
        terminology: "무사",
        context: "martial_arts",
        usage: "player_archetype",
      });

      expect(validation.isAppropriate).toBe(true);
      expect(validation.accuracy).toBeGreaterThan(0.8);
    });
  });

  /**
   * **Business Requirement:** Korean martial arts education must provide
   * meaningful learning opportunities and cultural understanding
   */
  describe("Educational Content", () => {
    it("should provide historical context for techniques", () => {
      const history = culture.getTechniqueHistory("천둥벽력");

      expect(history.period).toBeTruthy();
      expect(history.origin).toBeTruthy();
      expect(history.evolution).toBeTruthy();
      expect(history.modernApplication).toBeTruthy();
    });

    it("should explain Korean martial arts etiquette", () => {
      const etiquette = culture.getMartialArtsEtiquette();

      expect(etiquette.bowingProtocol).toBeTruthy();
      expect(etiquette.respectTerms).toBeTruthy();
      expect(etiquette.dojangBehavior).toBeTruthy();
      expect(etiquette.teacherStudentRelation).toBeTruthy();
    });

    it("should provide progression guidance", () => {
      const guidance = culture.getProgressionGuidance(1); // Beginner level

      expect(guidance.currentFocus).toBeTruthy();
      expect(guidance.nextSteps).toBeTruthy();
      expect(guidance.culturalMilestones).toBeTruthy();
      expect(guidance.respectfulPractice).toBeTruthy();
    });
  });

  /**
   * **Business Requirement:** Cultural representation must avoid stereotypes
   * and provide respectful, authentic Korean martial arts experience
   */
  describe("Cultural Sensitivity", () => {
    it("should avoid martial arts stereotypes", () => {
      const stereotypeCheck = culture.checkForStereotypes([
        "mysterious ancient technique",
        "mystical Asian wisdom",
        "inscrutable master",
      ]);

      expect(stereotypeCheck.hasStereotypes).toBe(true);
      expect(stereotypeCheck.suggestions.length).toBeGreaterThan(0);
    });

    it("should provide culturally sensitive alternatives", () => {
      const alternatives = culture.getSensitiveAlternatives("ancient secret");

      expect(alternatives.length).toBeGreaterThan(0);
      expect(alternatives[0]).toMatch(/전통|기법|수련/);
    });

    it("should maintain respectful tone in descriptions", () => {
      const toneCheck = culture.validateTone(
        "The mighty warrior uses ancient Korean secrets to defeat enemies"
      );

      expect(toneCheck.isRespectful).toBe(false);
      expect(toneCheck.improvements).toBeTruthy();
    });
  });
});
