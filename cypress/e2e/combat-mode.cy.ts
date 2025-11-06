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

  it("should display combat HUD components", () => {
    cy.annotate("Verifying combat HUD is present");

    // Check for combat screen
    cy.get('[data-testid="combat-screen"]').should("exist");

    // Check for HUD elements
    cy.get('[data-testid="combat-hud"]').should("exist");
    cy.get('[data-testid="round-timer"]').should("exist");
    cy.get('[data-testid="player1-stance-indicator"]').should("exist");
    cy.get('[data-testid="player2-stance-indicator"]').should("exist");

    // Return to intro
    cy.returnToIntro();
  });

  it("should display combat controls", () => {
    cy.annotate("Verifying combat controls are present");

    // Check for combat controls
    cy.get('[data-testid="combat-controls"]').should("exist");
    cy.get('[data-testid="attack-button"]').should("exist");
    cy.get('[data-testid="defend-button"]').should("exist");
    cy.get('[data-testid="technique-button"]').should("exist");
    cy.get('[data-testid="stance-button"]').should("exist");

    // Return to intro
    cy.returnToIntro();
  });

  it("should display combat stats panel", () => {
    cy.annotate("Verifying combat stats panel is present");

    // Check for combat stats
    cy.get('[data-testid="combat-stats"]').should("exist");

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
    cy.annotate("Checking for combat feedback");

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

  it("should test combo system by performing multiple attacks", () => {
    cy.annotate("Testing combo system");

    // Perform multiple quick attacks to trigger combo
    cy.get("body").type("1"); // Select stance
    cy.wait(200);
    
    // Execute rapid attacks
    for (let i = 0; i < 5; i++) {
      cy.get("body").type(" "); // Attack
      cy.wait(400); // Wait less than combo timeout
    }

    // Check that combat screen still exists (combo didn't crash)
    cy.get('[data-testid="combat-screen"]').should("exist");

    // Return to intro
    cy.returnToIntro();
  });

  it("should test defensive actions", () => {
    cy.annotate("Testing defensive actions");

    // Select a stance
    cy.get("body").type("1");
    cy.wait(300);

    // Try to execute defense (Shift key simulation via gameActions)
    // Note: Shift handling may need specific implementation
    
    // Execute some attacks after defense
    cy.get("body").type(" ");
    cy.wait(300);

    // Check combat screen still exists
    cy.get('[data-testid="combat-screen"]').should("exist");

    // Return to intro
    cy.returnToIntro();
  });

  it("should test player movement during combat", () => {
    cy.annotate("Testing player movement");

    // Test all movement directions
    cy.gameActions(["w", "w", "a", "a", "s", "s", "d", "d"]);

    // Perform an attack after movement
    cy.get("body").type("1");
    cy.wait(200);
    cy.get("body").type(" ");
    cy.wait(300);

    // Check combat screen still exists
    cy.get('[data-testid="combat-screen"]').should("exist");

    // Return to intro
    cy.returnToIntro();
  });

  it("should verify AI opponent is active", () => {
    cy.annotate("Testing AI opponent behavior");

    // Wait for AI to potentially perform actions
    cy.wait(2000);

    // Check that combat screen is still intact
    cy.get('[data-testid="combat-screen"]').should("exist");
    cy.get('[data-testid="combat-hud"]').should("exist");

    // Return to intro
    cy.returnToIntro();
  });

  it("should test combat flow with mixed actions", () => {
    cy.annotate("Testing complete combat flow");

    // Perform a realistic combat sequence
    cy.get("body").type("1"); // Stance 1
    cy.wait(300);
    cy.get("body").type(" "); // Attack
    cy.wait(400);
    
    cy.gameActions(["w", "a"]); // Move
    cy.wait(300);
    
    cy.get("body").type("3"); // Change stance
    cy.wait(300);
    cy.get("body").type(" "); // Attack
    cy.wait(400);
    
    cy.gameActions(["s", "d"]); // Move
    cy.wait(300);
    
    cy.get("body").type("5"); // Another stance
    cy.wait(300);
    cy.get("body").type(" "); // Attack
    cy.wait(400);

    // Verify all components still work
    cy.get('[data-testid="combat-screen"]').should("exist");
    cy.get('[data-testid="combat-controls"]').should("exist");
    cy.get('[data-testid="combat-stats"]').should("exist");

    // Return to intro
    cy.returnToIntro();
  });
});
