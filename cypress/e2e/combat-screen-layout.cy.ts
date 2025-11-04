describe("CombatScreen Visual Layout Test", () => {
  it("should display complete combat screen with all components visible", () => {
    // Visit the app
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();

    // Enter combat mode
    cy.enterCombatMode();

    // Wait for combat screen to fully load
    cy.wait(1000);

    // Verify all major components are present
    cy.get('[data-testid="combat-screen"]').should("exist");
    cy.get('[data-testid="combat-hud"]').should("exist");
    cy.get('[data-testid="combat-arena"]').should("exist");
    cy.get('[data-testid="combat-controls"]').should("exist");
    cy.get('[data-testid="combat-stats"]').should("exist");

    // Verify player components
    cy.get('[data-testid="combat-player-1"]').should("exist");
    cy.get('[data-testid="combat-player-2"]').should("exist");

    // Verify HUD components
    cy.get('[data-testid="round-timer"]').should("exist");
    cy.get('[data-testid="player1-stance-indicator"]').should("exist");
    cy.get('[data-testid="player2-stance-indicator"]').should("exist");

    // Verify control buttons
    cy.get('[data-testid="attack-button"]').should("exist");
    cy.get('[data-testid="defend-button"]').should("exist");
    cy.get('[data-testid="technique-button"]').should("exist");
    cy.get('[data-testid="stance-button"]').should("exist");

    // Take a screenshot of the complete combat screen
    cy.screenshot("combat-screen-complete-layout", {
      capture: "fullPage",
      overwrite: true,
    });

    // Verify Korean bilingual text is visible
    cy.contains("전투").should("be.visible");
    cy.contains("Combat").should("be.visible");
  });

  it("should display combat screen at different viewport sizes", () => {
    // Desktop view
    cy.viewport(1920, 1080);
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
    cy.enterCombatMode();
    cy.wait(1000);
    
    cy.get('[data-testid="combat-screen"]').should("exist");
    cy.screenshot("combat-screen-desktop-1920x1080", {
      capture: "fullPage",
      overwrite: true,
    });

    // Return and test tablet view
    cy.returnToIntro();
    cy.wait(500);
    
    cy.viewport(768, 1024);
    cy.enterCombatMode();
    cy.wait(1000);
    
    cy.get('[data-testid="combat-screen"]').should("exist");
    cy.screenshot("combat-screen-tablet-768x1024", {
      capture: "fullPage",
      overwrite: true,
    });
  });

  it("should display all combat UI elements during active combat", () => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
    cy.enterCombatMode();
    cy.wait(1000);

    // Perform some combat actions
    cy.get("body").type("1"); // Select stance
    cy.wait(300);
    cy.get("body").type(" "); // Attack
    cy.wait(500);

    // Take screenshot during active combat
    cy.screenshot("combat-screen-active-combat", {
      capture: "fullPage",
      overwrite: true,
    });

    // Verify combat stats are visible
    cy.get('[data-testid="combat-stats"]').should("exist");
  });
});
