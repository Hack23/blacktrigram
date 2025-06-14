describe("Black Trigram Combat Mode", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();

    // Enter combat mode using the fixed navigation
    cy.enterCombatMode();
  });

  it("should display combat screen elements", () => {
    cy.annotate("Checking combat screen elements");

    // Check for combat screen marker
    cy.get('[data-testid="combat-screen"]').should("exist");

    // Check for combat text in the overlay
    cy.contains("Combat").should("be.visible");
    cy.contains("전투").should("be.visible");

    // Return to intro
    cy.returnToIntro();
  });

  it("should support stance changes during combat", () => {
    cy.annotate("Testing stance changes in combat");

    // Use keyboard to change stances (1-8)
    for (let i = 1; i <= 8; i++) {
      cy.get("body").type(`${i}`);
      cy.wait(200);
    }

    // Return to intro
    cy.returnToIntro();
  });

  it("should support basic attacks", () => {
    cy.annotate("Testing basic attacks");

    // Select a stance and execute attacks
    cy.get("body").type("1"); // First stance
    cy.wait(300);
    cy.get("body").type(" "); // Execute attack
    cy.wait(300);

    // Try a different stance
    cy.get("body").type("3");
    cy.wait(300);
    cy.get("body").type(" ");
    cy.wait(300);

    // Try movement keys
    cy.gameActions(["w", "a", "s", "d"]);

    // Return to intro
    cy.returnToIntro();
  });

  it("should display combat log or feedback", () => {
    // Check for combat screen
    cy.get('[data-testid="combat-screen"]').should("exist");

    // Perform actions that would generate combat log entries
    cy.get("body").type("1"); // Select first stance
    cy.wait(300);
    cy.get("body").type(" "); // Execute attack
    cy.wait(500);

    // Look for combat feedback - check for Korean text
    cy.contains("전투").should("be.visible");

    // Return to intro
    cy.returnToIntro();
  });

  it("should handle rapid combat inputs", () => {
    cy.annotate("Testing rapid combat inputs");

    // Rapidly test all stances and attacks
    cy.gameActions([
      "1",
      " ",
      "2",
      " ",
      "3",
      " ",
      "4",
      " ",
      "5",
      " ",
      "6",
      " ",
      "7",
      " ",
      "8",
      " ",
    ]);

    // Try movement combined with attacks
    cy.gameActions(["w", "1", "a", "2", "s", "3", "d", "4"]);

    // Return to intro
    cy.returnToIntro();
  });
});
