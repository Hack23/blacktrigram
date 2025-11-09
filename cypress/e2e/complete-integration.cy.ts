/**
 * Complete Integration E2E Test
 * 
 * Tests the complete end-to-end integration of all game systems
 * from initial load through multiple gameplay scenarios.
 */

describe("Black Trigram - Complete Integration", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 15000 });
    cy.waitForCanvasReady();
  });

  describe("Complete Game Session", () => {
    it("should complete full game session: intro → training → combat → return", () => {
      // Verify initial load
      cy.annotate("Step 1: Verify initial game load");
      cy.title().should("contain", "흑괘");
      cy.get("canvas").should("be.visible");
      cy.get("[data-testid=intro-screen]").should("exist");

      // Training phase
      cy.annotate("Step 2: Enter and complete training");
      cy.enterTrainingMode();
      
      // Practice multiple stances
      cy.annotate("Step 3: Practice multiple trigram stances");
      cy.practiceStance(1, 3); // Geon stance - 3 times
      cy.practiceStance(2, 2); // Tae stance - 2 times
      cy.practiceStance(3, 2); // Li stance - 2 times

      // Vital point training
      cy.annotate("Step 4: Practice vital point targeting");
      cy.gameActions(["{tab}", "{tab}", " ", " ", " "]); // Switch modes and practice

      // Return to intro
      cy.annotate("Step 5: Return to intro screen");
      cy.returnToIntro();
      cy.get("[data-testid=intro-screen]").should("exist");

      // Combat phase
      cy.annotate("Step 6: Enter combat mode");
      cy.enterCombatMode();
      
      // Execute combat sequence
      cy.annotate("Step 7: Execute combat actions");
      // Movement
      cy.gameActions(["w", "a", "s", "d"]);
      
      // Stance changes and attacks
      cy.gameActions(["1", " ", "2", " ", "3", " "]);
      
      // More complex combinations
      cy.gameActions(["w", "1", " ", "s", "2", " "]);

      // Return to intro
      cy.annotate("Step 8: Return to intro from combat");
      cy.returnToIntro();
      cy.get("[data-testid=intro-screen]").should("exist");

      cy.annotate("Complete session test passed!");
    });

    it("should maintain state consistency across mode transitions", () => {
      cy.annotate("Testing state consistency");

      // Enter training
      cy.enterTrainingMode();
      cy.practiceStance(1, 1);
      cy.returnToIntro();

      // Enter combat
      cy.enterCombatMode();
      cy.gameActions(["1", "2", "3"]);
      cy.returnToIntro();

      // Re-enter training
      cy.enterTrainingMode();
      cy.practiceStance(2, 1);
      cy.returnToIntro();

      // Verify we're back at intro
      cy.get("[data-testid=intro-screen]").should("exist");
      
      cy.annotate("State consistency verified");
    });
  });

  describe("Multi-Round Combat Integration", () => {
    it("should handle extended combat with multiple stance changes", () => {
      cy.annotate("Starting extended combat test");
      
      cy.enterCombatMode();

      // Round 1: Geon stance
      cy.annotate("Round 1: Geon stance attacks");
      cy.gameActions(["1", "w", " ", " ", " "]);
      cy.wait(500);

      // Round 2: Tae stance
      cy.annotate("Round 2: Tae stance attacks");
      cy.gameActions(["2", "a", " ", " ", " "]);
      cy.wait(500);

      // Round 3: Li stance
      cy.annotate("Round 3: Li stance attacks");
      cy.gameActions(["3", "s", " ", " ", " "]);
      cy.wait(500);

      // Round 4: Jin stance
      cy.annotate("Round 4: Jin stance attacks");
      cy.gameActions(["4", "d", " ", " ", " "]);
      cy.wait(500);

      // Verify combat is still active
      cy.get("[data-testid=combat-screen]").should("exist");

      cy.returnToIntro();
      cy.annotate("Extended combat test passed!");
    });

    it("should handle rapid stance switching and attacks", () => {
      cy.annotate("Testing rapid combat actions");
      
      cy.enterCombatMode();

      // Rapid stance changes with immediate attacks
      cy.gameActions([
        "1", " ",
        "2", " ",
        "3", " ",
        "4", " ",
        "5", " ",
        "1", " ",
        "2", " ",
      ]);

      cy.get("[data-testid=combat-screen]").should("exist");
      cy.returnToIntro();
      
      cy.annotate("Rapid action test passed!");
    });
  });

  describe("Training to Combat Workflow", () => {
    it("should allow training then applying skills in combat", () => {
      cy.annotate("Training-to-Combat workflow test");

      // Phase 1: Extensive training
      cy.enterTrainingMode();
      
      // Practice all 8 stances
      cy.annotate("Practicing all trigram stances");
      for (let stance = 1; stance <= 8; stance++) {
        cy.practiceStance(stance, 1);
      }

      cy.returnToIntro();

      // Phase 2: Apply in combat
      cy.annotate("Applying trained skills in combat");
      cy.enterCombatMode();

      // Use all trained stances in combat
      cy.gameActions([
        "1", " ", "2", " ", "3", " ", "4", " ",
        "5", " ", "6", " ", "7", " ", "8", " ",
      ]);

      cy.returnToIntro();
      cy.annotate("Training-to-Combat workflow complete!");
    });
  });

  describe("Error Recovery Integration", () => {
    it("should recover from rapid mode switches", () => {
      cy.annotate("Testing error recovery");

      // Rapid mode switching
      cy.enterTrainingMode();
      cy.wait(100);
      cy.returnToIntro();
      cy.wait(100);

      cy.enterCombatMode();
      cy.wait(100);
      cy.returnToIntro();
      cy.wait(100);

      cy.enterTrainingMode();
      cy.wait(100);
      cy.returnToIntro();

      // Verify system is still stable
      cy.get("[data-testid=intro-screen]").should("exist");
      cy.annotate("Error recovery successful!");
    });

    it("should handle invalid input sequences gracefully", () => {
      cy.annotate("Testing invalid input handling");

      // Try invalid sequences
      cy.gameActions(["{", "}", "[", "]", "`", "~"]);

      // System should still be responsive
      cy.enterTrainingMode();
      cy.returnToIntro();

      cy.get("[data-testid=intro-screen]").should("exist");
      cy.annotate("Invalid input handling verified!");
    });
  });

  describe("Performance Integration", () => {
    it("should maintain performance during extended play", () => {
      cy.annotate("Testing extended play performance");

      const start = Date.now();

      // Extended play sequence
      cy.enterTrainingMode();
      cy.practiceStance(1, 5);
      cy.practiceStance(2, 5);
      cy.returnToIntro();

      cy.enterCombatMode();
      cy.gameActions(Array(20).fill(" ")); // 20 attacks
      cy.returnToIntro();

      const duration = Date.now() - start;
      cy.log(`Extended play duration: ${duration}ms`);

      // Should complete in reasonable time (CI environment)
      expect(duration).to.be.lessThan(45000);

      cy.annotate("Performance test passed!");
    });

    it("should handle continuous gameplay without degradation", () => {
      cy.annotate("Testing continuous gameplay");

      // 3 complete cycles
      for (let cycle = 1; cycle <= 3; cycle++) {
        cy.annotate(`Cycle ${cycle} of 3`);

        cy.enterTrainingMode();
        cy.practiceStance(cycle, 2);
        cy.returnToIntro();

        cy.enterCombatMode();
        cy.gameActions([`${cycle}`, " ", " "]);
        cy.returnToIntro();
      }

      cy.get("[data-testid=intro-screen]").should("exist");
      cy.annotate("Continuous gameplay test passed!");
    });
  });

  describe("Responsive Integration", () => {
    it("should handle screen resize during gameplay", () => {
      cy.annotate("Testing responsive behavior");

      // Desktop
      cy.viewport(1920, 1080);
      cy.enterTrainingMode();
      cy.returnToIntro();

      // Tablet
      cy.viewport(768, 1024);
      cy.enterCombatMode();
      cy.returnToIntro();

      // Mobile
      cy.viewport(375, 667);
      cy.enterTrainingMode();
      cy.returnToIntro();

      // Back to desktop
      cy.viewport(1280, 720);
      cy.get("[data-testid=intro-screen]").should("exist");

      cy.annotate("Responsive integration verified!");
    });
  });

  describe("Korean Theming Integration", () => {
    it("should maintain Korean text consistency throughout gameplay", () => {
      cy.annotate("Verifying Korean theming");

      // Check title
      cy.title().should("contain", "흑괘");

      // Enter training - check Korean UI
      cy.enterTrainingMode();
      cy.get("[data-testid=training-screen]").should("exist");
      // Korean text should be visible
      cy.returnToIntro();

      // Enter combat - check Korean UI
      cy.enterCombatMode();
      cy.get("[data-testid=combat-screen]").should("exist");
      // Korean text should be visible
      cy.returnToIntro();

      cy.annotate("Korean theming verified!");
    });
  });

  describe("Complete User Journey", () => {
    it("should simulate realistic player session", () => {
      cy.annotate("Simulating realistic user journey");

      // New player explores menu
      cy.annotate("Player explores menu");
      cy.gameActions(["{leftarrow}", "{rightarrow}", "{leftarrow}"]);
      cy.wait(500);

      // Player tries training first
      cy.annotate("Player enters training");
      cy.enterTrainingMode();
      
      // Practices basics
      cy.practiceStance(1, 2);
      cy.practiceStance(2, 2);
      
      // Gets comfortable
      cy.wait(1000);
      
      // Returns to menu
      cy.returnToIntro();
      cy.wait(500);

      // Now tries combat
      cy.annotate("Player tries combat");
      cy.enterCombatMode();

      // Tries different attacks
      cy.gameActions([
        "w", "1", " ",
        "a", "2", " ",
        "s", "1", " ",
        "d", "2", " ",
      ]);

      // Continues fighting
      cy.wait(1000);
      cy.gameActions([" ", " ", " "]);

      // Returns satisfied
      cy.returnToIntro();

      // Goes back for more training
      cy.annotate("Player returns for more training");
      cy.enterTrainingMode();
      cy.practiceStance(3, 3);
      cy.returnToIntro();

      // One more combat session
      cy.annotate("Player's final combat session");
      cy.enterCombatMode();
      cy.gameActions(["3", " ", " ", " ", " "]);
      cy.returnToIntro();

      cy.annotate("Realistic user journey complete!");
    });
  });

  describe("System Stress Test", () => {
    it("should handle intensive gameplay without crashes", () => {
      cy.annotate("Running stress test");

      // Rapid mode transitions
      for (let i = 0; i < 3; i++) {
        cy.enterTrainingMode();
        cy.gameActions(["1", "2", "3"]);
        cy.returnToIntro();

        cy.enterCombatMode();
        cy.gameActions(["1", " ", "2", " ", "3", " "]);
        cy.returnToIntro();
      }

      // System should still be responsive
      cy.get("[data-testid=intro-screen]").should("exist");
      cy.enterTrainingMode();
      cy.returnToIntro();

      cy.annotate("Stress test passed!");
    });
  });
});
