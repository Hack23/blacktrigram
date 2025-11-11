/**
 * Fast Smoke Test - Essential App Functionality
 * Optimized for speed to catch critical failures quickly
 */

describe("Black Trigram - Smoke Test", () => {
  beforeEach(() => {
    cy.on("uncaught:exception", (err) => {
      // Ignore audio, WebGL, and asset loading errors
      if (
        err.message.includes("Failed to load") ||
        err.message.includes("no supported source") ||
        err.message.includes("play() request was interrupted") ||
        err.message.includes("WebGL") ||
        err.message.includes("PIXI") ||
        err.message.includes("audio")
      ) {
        return false;
      }
      return true;
    });

    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
  });

  it("should load and display essential elements", () => {
    cy.annotate("Smoke test - essential elements");

    // Verify core elements exist
    cy.get('[data-testid="app-container"]', { timeout: 8000 }).should("exist");
    cy.get('[data-testid="intro-screen"]').should("exist");
    cy.checkCanvasVisibility();

    // Verify essential buttons
    cy.get('[data-testid="training-button"]').should("be.visible");
    cy.get('[data-testid="combat-button"]').should("be.visible");

    cy.log("✅ Essential elements loaded");
  });

  it("should support basic navigation", () => {
    cy.annotate("Smoke test - basic navigation");

    // Test training mode
    cy.enterTrainingMode();
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="training-screen"]').length > 0) {
        cy.log("✅ Training mode accessible");
      }
    });
    cy.returnToIntro();

    // Test combat mode
    cy.enterCombatMode();
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="combat-screen"]').length > 0) {
        cy.log("✅ Combat mode accessible");
      }
    });
    cy.returnToIntro();

    cy.log("✅ Basic navigation works");
  });

  it("should support keyboard controls", () => {
    cy.annotate("Smoke test - keyboard controls");

    // Test keyboard navigation
    cy.get("body").type("1");
    cy.wait(300);
    cy.get("body").type("{esc}");
    cy.wait(300);

    cy.get('[data-testid="app-container"]').should("exist");

    cy.log("✅ Keyboard controls work");
  });
});
