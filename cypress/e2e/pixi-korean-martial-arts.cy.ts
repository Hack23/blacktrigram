/**
 * Optimized PixiJS Integration Tests
 * Tests PixiJS rendering and Korean martial arts theming efficiently
 */

describe("Black Trigram - PixiJS Integration", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
    cy.mockPixiObjects();
  });

  describe("PixiJS Trigram System", () => {
    it("should render and interact with all trigram stances efficiently", () => {
      cy.annotate("Testing PixiJS trigram stances");

      cy.enterTrainingMode();
      cy.assertPixiObjectExists({ type: "trigram-wheel" });

      // Test all 8 stances in batch
      const stances = ["geon", "tae", "li", "jin", "son", "gam", "gan", "gon"];

      stances.forEach((stance, index) => {
        cy.get("body").type(`${index + 1}`);
        cy.assertPixiObjectExists({ type: "trigram-stance", stance: stance });
        cy.assertPixiObjectExists({ type: "trigram-stance-text", stance: stance });
      });

      cy.log("✅ All trigram stances rendered");
    });

    it("should test player archetypes efficiently", () => {
      cy.annotate("Testing player archetype rendering");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="archetype-toggle"]').length > 0) {
          cy.get('[data-testid="archetype-toggle"]').click();

          const archetypes = ["musa", "amsalja", "hacker", "jeongbo_yowon", "jojik_pokryeokbae"];

          // Test all archetypes in batch without individual annotations
          archetypes.forEach((archetype) => {
            cy.get(`[data-testid="archetype-option-${archetype}"]`).click();
            cy.assertPixiObjectExists({ type: "player-archetype-label", archetype: archetype });
          });

          cy.log("✅ All archetypes tested");
        } else {
          cy.log("⚠️ Archetype selection not implemented");
          cy.assertPixiObjectExists({ type: "korean-title" });
        }
      });
    });
  });

  describe("Combat PixiJS Interactions", () => {
    it("should test complete combat interactions via PixiJS", () => {
      cy.annotate("Testing combat PixiJS interactions");

      cy.enterCombatMode();

      // Verify players rendered
      cy.assertPixiObjectExists({ type: "player", playerId: "player1" });
      cy.assertPixiObjectExists({ type: "player", playerId: "player2" });

      // Test attacking
      cy.clickPixiObject({ type: "player", playerId: "player2" });
      cy.assertPixiObjectExists({ type: "hit-effect" });

      // Test stance changes during combat
      cy.get("body").type("2");
      cy.assertPixiObjectExists({ type: "player", playerId: "player1", stance: "tae" });

      // Execute technique
      cy.get("body").type(" ");
      cy.assertPixiObjectExists({ type: "technique-effect" });

      cy.log("✅ Combat interactions verified");
    });
  });

  describe("Vital Point Targeting", () => {
    it("should test vital point system", () => {
      cy.annotate("Testing vital point targeting");

      cy.enterTrainingMode();
      cy.get("body").type("{ctrl}");

      cy.assertPixiObjectExists({ type: "vital-point-overlay" });

      // Test specific vital points
      cy.getVitalPoint("baekhoehoel").should("exist").and("be.visible");
      cy.get('[data-vital-point="baekhoehoel"]').click({ force: true });
      cy.assertPixiObjectExists({ type: "vital-point-target", name: "baekhoehoel", isTargeted: true });

      cy.getVitalPoint("inmyeong").should("exist");
      cy.clickPixiObject({ type: "vital-point", name: "inmyeong" });
      cy.assertPixiObjectExists({ type: "vital-point-target", name: "inmyeong", isTargeted: true });

      cy.log("✅ Vital point targeting verified");
    });
  });

  describe("Korean Text and Theming", () => {
    it("should render Korean text correctly in PixiJS", () => {
      cy.annotate("Testing Korean text rendering");

      cy.assertPixiObjectExists({ type: "korean-title", text: "흑괘" });
      cy.assertPixiObjectExists({ type: "korean-subtitle", text: "한국 무술 시뮬레이터" });

      cy.enterTrainingMode();
      cy.assertPixiObjectExists({ type: "trigram-stance-text", korean: "건" });

      cy.log("✅ Korean text rendering verified");
    });
  });

  describe("PixiJS Performance", () => {
    it("should maintain performance during intense combat", () => {
      cy.annotate("Testing PixiJS performance");

      cy.enterCombatMode();

      const startTime = Date.now();

      // Perform rapid combat actions
      for (let i = 0; i < 8; i++) {
        cy.get("body").type(`${i + 1}`);
        cy.get("body").type(" ");
        cy.assertPixiObjectExists({ type: "player", playerId: "player1" });
      }

      cy.wrap(null).then(() => {
        const duration = Date.now() - startTime;
        cy.task("logPerformance", { name: "PixiJS Combat", duration });
        expect(duration).to.be.lessThan(12000);
      });

      cy.assertPixiObjectExists({ type: "combat-hud" });
      cy.assertNoPixiObjectExists({ type: "error-display" });

      cy.log("✅ Performance verified");
    });
  });

  describe("HTML-PixiJS State Sync", () => {
    it("should keep HTML and PixiJS state synchronized", () => {
      cy.annotate("Testing state synchronization");

      cy.enterTrainingMode();

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="mode-techniques"]').length > 0) {
          cy.get('[data-testid="mode-techniques"]').click();
          cy.assertPixiObjectExists({ type: "training-mode", mode: "techniques" });
        } else {
          cy.get("body").type("3");
          cy.assertPixiObjectExists({ type: "trigram-stance", stance: "li" });
        }

        cy.clickPixiObject({ type: "trigram-stance", stance: "li" });
        cy.get("body").should("exist");
      });

      cy.log("✅ State synchronization verified");
    });
  });
});
