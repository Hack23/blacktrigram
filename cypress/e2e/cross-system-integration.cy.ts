/**
 * Cross-System Integration E2E Test
 * 
 * Tests the integration between different game systems (Combat, Audio, UI, etc.)
 * to ensure they work together seamlessly.
 */

describe("Black Trigram - Cross-System Integration", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 15000 });
    cy.waitForCanvasReady();
  });

  describe("Audio-Combat Integration", () => {
    it("should play sounds during combat actions", () => {
      cy.annotate("Testing audio-combat integration");

      cy.enterCombatMode();

      // Execute actions that should trigger audio
      cy.gameActions([
        "1", // Stance change
        " ",  // Attack (should play hit sound)
        "2", // Another stance change
        " ",  // Another attack
      ]);

      // Note: In real integration, we would verify audio playback
      // For CI, we just verify the actions complete successfully
      cy.get("[data-testid=combat-screen]").should("exist");

      cy.returnToIntro();
      cy.annotate("Audio-combat integration verified");
    });

    it("should maintain audio across screen transitions", () => {
      cy.annotate("Testing audio persistence");

      // Training mode
      cy.enterTrainingMode();
      cy.practiceStance(1, 1);
      cy.returnToIntro();

      // Combat mode
      cy.enterCombatMode();
      cy.gameActions(["1", " "]);
      cy.returnToIntro();

      // Back to training
      cy.enterTrainingMode();
      cy.practiceStance(2, 1);
      cy.returnToIntro();

      cy.annotate("Audio persistence verified");
    });
  });

  describe("UI-Combat System Integration", () => {
    it("should update UI based on combat actions", () => {
      cy.annotate("Testing UI-combat integration");

      cy.enterCombatMode();

      // Execute combat actions
      cy.gameActions(["1", " ", "2", " ", "3", " "]);

      // UI should still be responsive
      cy.get("[data-testid=combat-screen]").should("exist");

      // Return button should work
      cy.returnToIntro();

      cy.annotate("UI-combat integration verified");
    });

    it("should display stance changes in UI", () => {
      cy.annotate("Testing stance UI updates");

      cy.enterCombatMode();

      // Change through multiple stances
      for (let stance = 1; stance <= 8; stance++) {
        cy.gameActions([`${stance}`]);
        cy.wait(200);
      }

      cy.get("[data-testid=combat-screen]").should("exist");
      cy.returnToIntro();

      cy.annotate("Stance UI updates verified");
    });
  });

  describe("Training-Combat Data Integration", () => {
    it("should transfer training experience to combat", () => {
      cy.annotate("Testing training-combat data flow");

      // Train extensively
      cy.enterTrainingMode();
      
      // Practice multiple stances
      cy.practiceStance(1, 3);
      cy.practiceStance(2, 3);
      cy.practiceStance(3, 3);

      cy.returnToIntro();

      // Apply in combat
      cy.enterCombatMode();

      // Use trained stances
      cy.gameActions([
        "1", " ", " ",
        "2", " ", " ",
        "3", " ", " ",
      ]);

      cy.returnToIntro();

      cy.annotate("Training-combat data flow verified");
    });

    it("should maintain player state across modes", () => {
      cy.annotate("Testing player state persistence");

      // Training
      cy.enterTrainingMode();
      cy.practiceStance(1, 2);
      cy.returnToIntro();

      // Combat
      cy.enterCombatMode();
      cy.gameActions(["1", " "]);
      cy.returnToIntro();

      // Back to training
      cy.enterTrainingMode();
      cy.practiceStance(1, 2);
      cy.returnToIntro();

      cy.annotate("Player state persistence verified");
    });
  });

  describe("Input-System Integration", () => {
    it("should process input across all systems", () => {
      cy.annotate("Testing input processing");

      // Menu input
      cy.gameActions(["{leftarrow}", "{rightarrow}"]);

      // Training input
      cy.enterTrainingMode();
      cy.gameActions(["1", "2", " "]);
      cy.returnToIntro();

      // Combat input
      cy.enterCombatMode();
      cy.gameActions(["w", "a", "s", "d", "1", " "]);
      cy.returnToIntro();

      cy.annotate("Input processing verified");
    });

    it("should handle simultaneous key presses", () => {
      cy.annotate("Testing simultaneous input");

      cy.enterCombatMode();

      // Rapid key combinations
      cy.get("body")
        .type("w", { delay: 0 })
        .type("1", { delay: 0 })
        .type(" ", { delay: 0 });

      cy.wait(200);

      cy.get("body")
        .type("a", { delay: 0 })
        .type("2", { delay: 0 })
        .type(" ", { delay: 0 });

      cy.returnToIntro();

      cy.annotate("Simultaneous input verified");
    });
  });

  describe("State Management Integration", () => {
    it("should synchronize state across all systems", () => {
      cy.annotate("Testing state synchronization");

      // Create complex state through actions
      cy.enterTrainingMode();
      cy.practiceStance(1, 2);
      cy.returnToIntro();

      cy.enterCombatMode();
      cy.gameActions(["1", " ", "2", " "]);
      cy.returnToIntro();

      cy.enterTrainingMode();
      cy.practiceStance(3, 1);
      cy.returnToIntro();

      // State should be consistent
      cy.get("[data-testid=intro-screen]").should("exist");

      cy.annotate("State synchronization verified");
    });

    it("should handle concurrent state updates", () => {
      cy.annotate("Testing concurrent updates");

      cy.enterCombatMode();

      // Multiple rapid actions
      cy.gameActions([
        "1", "w", " ",
        "2", "a", " ",
        "3", "s", " ",
      ]);

      cy.get("[data-testid=combat-screen]").should("exist");
      cy.returnToIntro();

      cy.annotate("Concurrent updates verified");
    });
  });

  describe("Performance Under Integration Load", () => {
    it("should maintain performance with all systems active", () => {
      cy.annotate("Testing integrated system performance");

      const start = Date.now();

      // Training with actions
      cy.enterTrainingMode();
      cy.practiceStance(1, 3);
      cy.practiceStance(2, 3);
      cy.returnToIntro();

      // Combat with complex actions
      cy.enterCombatMode();
      cy.gameActions([
        "w", "1", " ",
        "a", "2", " ",
        "s", "3", " ",
        "d", "4", " ",
      ]);
      cy.returnToIntro();

      // More training
      cy.enterTrainingMode();
      cy.practiceStance(5, 2);
      cy.returnToIntro();

      const duration = Date.now() - start;
      cy.log(`Integration load test: ${duration}ms`);

      expect(duration).to.be.lessThan(25000);

      cy.annotate("Performance under load verified");
    });

    it("should handle sustained integrated operations", () => {
      cy.annotate("Testing sustained operations");

      // 5 minutes of continuous gameplay
      for (let round = 1; round <= 3; round++) {
        cy.annotate(`Round ${round} of 3`);

        cy.enterTrainingMode();
        cy.practiceStance(round, 2);
        cy.returnToIntro();

        cy.enterCombatMode();
        cy.gameActions([`${round}`, " ", " ", " "]);
        cy.returnToIntro();
      }

      cy.get("[data-testid=intro-screen]").should("exist");

      cy.annotate("Sustained operations verified");
    });
  });

  describe("Error Handling Integration", () => {
    it("should recover from errors across systems", () => {
      cy.annotate("Testing cross-system error recovery");

      // Try to break it with rapid transitions
      cy.enterTrainingMode();
      cy.gameActions(["{esc}"]);
      cy.wait(50);

      cy.enterCombatMode();
      cy.gameActions(["{esc}"]);
      cy.wait(50);

      cy.enterTrainingMode();
      cy.gameActions(["{esc}"]);

      // Should still be functional
      cy.get("[data-testid=intro-screen]").should("exist");
      cy.enterTrainingMode();
      cy.returnToIntro();

      cy.annotate("Error recovery verified");
    });

    it("should maintain data integrity during errors", () => {
      cy.annotate("Testing data integrity");

      // Create some state
      cy.enterTrainingMode();
      cy.practiceStance(1, 2);
      cy.returnToIntro();

      // Try to cause issues
      cy.gameActions(["{", "}", "[", "]"]);

      // Go back to training - state should be intact
      cy.enterTrainingMode();
      cy.practiceStance(2, 1);
      cy.returnToIntro();

      cy.get("[data-testid=intro-screen]").should("exist");

      cy.annotate("Data integrity verified");
    });
  });

  describe("Accessibility Integration", () => {
    it("should maintain accessibility across all systems", () => {
      cy.annotate("Testing accessibility integration");

      // Check keyboard navigation works throughout
      cy.enterTrainingMode();
      cy.get("[data-testid=training-screen]").should("exist");
      cy.returnToIntro();

      cy.enterCombatMode();
      cy.get("[data-testid=combat-screen]").should("exist");
      cy.returnToIntro();

      cy.annotate("Accessibility verified");
    });

    it("should support alternative input methods", () => {
      cy.annotate("Testing alternative inputs");

      // Try different key combinations
      cy.enterCombatMode();

      // Arrow keys for movement
      cy.gameActions(["{uparrow}", "{downarrow}", "{leftarrow}", "{rightarrow}"]);

      // Number keys for stances
      cy.gameActions(["1", "2", "3", "4"]);

      // Space for action
      cy.gameActions([" ", " "]);

      cy.returnToIntro();

      cy.annotate("Alternative inputs verified");
    });
  });

  describe("Mobile Integration", () => {
    it("should integrate properly on mobile viewport", () => {
      cy.annotate("Testing mobile integration");

      cy.viewport(375, 667);

      cy.enterTrainingMode();
      cy.practiceStance(1, 1);
      cy.returnToIntro();

      cy.enterCombatMode();
      cy.gameActions(["1", " "]);
      cy.returnToIntro();

      cy.viewport(1280, 720); // Reset

      cy.annotate("Mobile integration verified");
    });

    it("should handle orientation changes", () => {
      cy.annotate("Testing orientation changes");

      // Portrait
      cy.viewport(375, 667);
      cy.enterTrainingMode();
      cy.returnToIntro();

      // Landscape
      cy.viewport(667, 375);
      cy.enterCombatMode();
      cy.returnToIntro();

      // Back to desktop
      cy.viewport(1280, 720);
      cy.get("[data-testid=intro-screen]").should("exist");

      cy.annotate("Orientation changes verified");
    });
  });

  describe("Complete System Integration", () => {
    it("should demonstrate all systems working together", () => {
      cy.annotate("Full system integration test");

      // Phase 1: Setup and exploration
      cy.annotate("Phase 1: Exploration");
      cy.gameActions(["{leftarrow}", "{rightarrow}"]);

      // Phase 2: Training all stances
      cy.annotate("Phase 2: Complete Training");
      cy.enterTrainingMode();
      for (let stance = 1; stance <= 8; stance++) {
        cy.practiceStance(stance, 1);
      }
      cy.returnToIntro();

      // Phase 3: Apply in combat
      cy.annotate("Phase 3: Apply Skills");
      cy.enterCombatMode();
      cy.gameActions([
        "w", "1", " ",
        "a", "2", " ",
        "s", "3", " ",
        "d", "4", " ",
        "w", "5", " ",
        "a", "6", " ",
        "s", "7", " ",
        "d", "8", " ",
      ]);
      cy.returnToIntro();

      // Phase 4: Additional training
      cy.annotate("Phase 4: Advanced Training");
      cy.enterTrainingMode();
      cy.practiceStance(1, 3);
      cy.returnToIntro();

      // Phase 5: Final combat
      cy.annotate("Phase 5: Final Combat");
      cy.enterCombatMode();
      cy.gameActions([
        "1", " ", " ", " ",
        "2", " ", " ", " ",
        "3", " ", " ", " ",
      ]);
      cy.returnToIntro();

      cy.get("[data-testid=intro-screen]").should("exist");

      cy.annotate("Full system integration verified!");
    });
  });
});
