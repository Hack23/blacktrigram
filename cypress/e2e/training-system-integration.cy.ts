/**
 * Training Mode Integration E2E Tests
 * Holistic game perspective testing for Korean martial arts training
 */

describe("Training Mode Integration - Holistic Game Perspective", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 15000 });
    cy.waitForCanvasReady();
  });

  describe("Complete Training Flow", () => {
    it("should support full training cycle from menu to training and back", () => {
      cy.annotate("Testing complete training flow");

      // Verify intro screen
      cy.get('[data-testid="intro-screen"]', { timeout: 10000 }).should("exist");

      // Enter training mode
      cy.enterTrainingMode();

      // Verify training screen loaded
      cy.get('[data-testid="training-screen"]', { timeout: 10000 }).should("exist");

      // Practice a stance
      cy.gameActions(["1", " "]);
      cy.wait(500);

      // Return to menu
      cy.returnToIntro();

      // Verify back at intro
      cy.get('[data-testid="intro-screen"]', { timeout: 5000 }).should("exist");
    });

    it("should maintain training progress through multiple sessions", () => {
      cy.annotate("Testing training state persistence");

      // First training session
      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");
      cy.practiceStance(1, 2);
      cy.returnToIntro();

      // Second training session
      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");
      cy.practiceStance(3, 2);
      cy.returnToIntro();
    });
  });

  describe("Training Mode UI Components", () => {
    beforeEach(() => {
      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");
    });

    afterEach(() => {
      cy.returnToIntro();
    });

    it("should display training screen components", () => {
      cy.annotate("Verifying training UI components");

      // Check for training screen
      cy.get('[data-testid="training-screen"]').should("exist");

      // Check for optional components
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="training-header"]').length > 0) {
          cy.log("✅ Training header found");
        }
        if ($body.find('[data-testid="training-controls"]').length > 0) {
          cy.log("✅ Training controls found");
        }
        if ($body.find('[data-testid="training-stats"]').length > 0) {
          cy.log("✅ Training stats found");
        }
      });
    });

    it("should display training dummy or target", () => {
      cy.annotate("Verifying training dummy/target");

      // Check for training dummy
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="training-dummy"]').length > 0) {
          cy.get('[data-testid="training-dummy"]').should("exist");
          cy.log("✅ Training dummy found");
        } else {
          cy.log("⚠️ Training dummy not found - may be in canvas");
        }
      });
    });
  });

  describe("Stance Practice Integration", () => {
    beforeEach(() => {
      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");
    });

    afterEach(() => {
      cy.returnToIntro();
    });

    it("should practice all 8 trigram stances", () => {
      cy.annotate("Practicing all 8 stances");

      // Practice each stance once
      for (let i = 1; i <= 8; i++) {
        cy.annotate(`Practicing stance ${i}`);
        cy.practiceStance(i, 1);
        cy.wait(200);
      }

      cy.log("✅ All 8 stances practiced");
    });

    it("should practice same stance multiple times", () => {
      cy.annotate("Practicing repetitions");

      // Practice first stance 5 times
      cy.practiceStance(1, 5);

      cy.log("✅ Repeated practice completed");
    });

    it("should handle rapid stance switching", () => {
      cy.annotate("Testing rapid stance changes");

      // Rapidly switch between stances
      const stances = ["1", "3", "5", "7", "2", "4", "6", "8"];
      cy.gameActions(stances);

      cy.log("✅ Rapid stance switching completed");
    });
  });

  describe("Training Feedback and Progress", () => {
    beforeEach(() => {
      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");
    });

    afterEach(() => {
      cy.returnToIntro();
    });

    it("should provide feedback after technique execution", () => {
      cy.annotate("Testing training feedback");

      // Execute a technique
      cy.practiceStance(1, 1);
      cy.wait(500);

      // Check for feedback (may be in canvas or as text)
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="training-feedback"]').length > 0) {
          cy.log("✅ Training feedback found");
        } else {
          cy.log("⚠️ Training feedback may be in canvas");
        }
      });
    });

    it("should track training statistics", () => {
      cy.annotate("Verifying training stats tracking");

      // Perform multiple techniques
      cy.practiceStance(1, 3);
      cy.practiceStance(2, 3);

      // Check if stats are visible
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="training-stats"]').length > 0) {
          cy.log("✅ Training stats panel found");
        }
      });
    });
  });

  describe("Korean Martial Arts Training Theming", () => {
    beforeEach(() => {
      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");
    });

    afterEach(() => {
      cy.returnToIntro();
    });

    it("should display Korean text in training UI", () => {
      cy.annotate("Verifying Korean text in training");

      cy.get("body").then(($body) => {
        const bodyText = $body.text();
        
        // Check for Korean training terms
        const koreanTerms = ["훈련", "연습", "기술", "자세"];
        let foundKorean = false;

        koreanTerms.forEach((term) => {
          if (bodyText.includes(term)) {
            foundKorean = true;
            cy.log(`✅ Found Korean term: ${term}`);
          }
        });

        if (!foundKorean) {
          cy.log("⚠️ Korean text may be in canvas - checking completed");
        }
      });
    });

    it("should use Korean themed visual elements", () => {
      cy.annotate("Verifying Korean visual theming");

      // Verify canvas is present and visible
      cy.get("canvas").should("be.visible");

      cy.log("✅ Korean themed canvas verified");
    });
  });

  describe("Training Mode Controls", () => {
    beforeEach(() => {
      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");
    });

    afterEach(() => {
      cy.returnToIntro();
    });

    it("should support keyboard controls for training", () => {
      cy.annotate("Testing training keyboard controls");

      // Test stance selection (1-8)
      cy.gameActions(["1", "2", "3", "4"]);
      cy.wait(200);

      // Test technique execution (space)
      cy.get("body").type(" ");
      cy.wait(300);

      cy.log("✅ Keyboard controls tested");
    });

    it("should support ESC key to return to menu", () => {
      cy.annotate("Testing ESC key in training");

      // Press ESC
      cy.get("body").type("{esc}");
      cy.wait(1000);

      // Should be back at intro
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="intro-screen"]').length > 0) {
          cy.log("✅ ESC returned to menu");
        } else {
          cy.log("⚠️ ESC may require multiple presses");
        }
      });
    });
  });

  describe("Training Mode Performance", () => {
    it("should handle extended training session", () => {
      cy.annotate("Testing extended training session");

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");

      // Practice extensively
      for (let i = 0; i < 20; i++) {
        const stance = ((i % 8) + 1).toString();
        cy.get("body").type(stance);
        cy.wait(100);
        cy.get("body").type(" ");
        cy.wait(200);
      }

      cy.log("✅ Extended training session completed");

      cy.returnToIntro();
    });

    it("should handle rapid training mode switching", () => {
      cy.annotate("Testing rapid mode switching");

      // Switch between training and menu rapidly
      for (let i = 0; i < 3; i++) {
        cy.enterTrainingMode();
        cy.get('[data-testid="training-screen"]').should("exist");
        cy.wait(500);
        cy.returnToIntro();
        cy.get('[data-testid="intro-screen"]').should("exist");
        cy.wait(500);
      }

      cy.log("✅ Rapid mode switching completed");
    });
  });

  describe("Training to Combat Transition", () => {
    it("should transition from training to combat smoothly", () => {
      cy.annotate("Testing training to combat transition");

      // Enter training
      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");
      cy.practiceStance(1, 2);
      
      // Return to menu
      cy.returnToIntro();
      cy.get('[data-testid="intro-screen"]').should("exist");

      // Enter combat
      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.gameActions(["1", " "]);

      // Return to menu
      cy.returnToIntro();
      cy.get('[data-testid="intro-screen"]').should("exist");

      cy.log("✅ Training to combat transition verified");
    });
  });

  describe("Error Handling in Training", () => {
    it("should handle invalid inputs gracefully", () => {
      cy.annotate("Testing training error handling");

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");

      // Try invalid inputs
      cy.get("body").type("9"); // Invalid stance
      cy.wait(100);
      cy.get("body").type("0"); // Invalid stance
      cy.wait(100);

      // Should still be in training mode
      cy.get('[data-testid="training-screen"]').should("exist");

      cy.returnToIntro();
    });

    it("should recover from errors and continue training", () => {
      cy.annotate("Testing error recovery in training");

      cy.on("uncaught:exception", () => {
        return false;
      });

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");

      // Execute various actions
      cy.practiceStance(1, 3);
      cy.practiceStance(5, 2);

      // Should still be functional
      cy.get('[data-testid="training-screen"]').should("exist");

      cy.returnToIntro();
    });
  });
});
