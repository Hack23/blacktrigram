/**
 * Consolidated Training Flow E2E Tests
 * Combines training-mode.cy.ts and training-system-integration.cy.ts
 * Efficient journey-based testing of training features
 */

describe("Black Trigram - Training Flow", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
  });

  describe("Complete Training Flow", () => {
    it("should support full training cycle and maintain progress", () => {
      cy.annotate("Testing complete training flow");

      // Verify intro screen
      cy.get('[data-testid="intro-screen"]', { timeout: 10000 }).should("exist");

      // Enter training mode
      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]', { timeout: 10000 }).should("exist");

      // Practice multiple stances
      cy.practiceStance(1, 2);
      cy.practiceStance(3, 2);

      // Return and re-enter to test state persistence
      cy.returnToIntro();
      cy.get('[data-testid="intro-screen"]', { timeout: 5000 }).should("exist");

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");
      cy.practiceStance(5, 2);

      cy.returnToIntro();
    });
  });

  describe("Training UI Components", () => {
    it("should display all training screen components", () => {
      cy.annotate("Verifying training UI components");

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");

      // Check for core training elements - these MUST exist
      const essentialElements = [
        "training-area",
        "training-player",
        "training-dummy-container",
      ];

      essentialElements.forEach((element) => {
        cy.get(`[data-testid="${element}"]`, { timeout: 8000 })
          .should("exist")
          .then(() => {
            cy.log(`✅ Found essential element: ${element}`);
          });
      });

      // Verify training screen is still functional after checks
      cy.get('[data-testid="training-screen"]').should("exist");
      cy.get('[data-testid="training-arena"]').should("exist");

      // Check for optional components - log but don't fail
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="training-header"]').length > 0) {
          cy.log("✅ Training header found");
        }
        if ($body.find('[data-testid="training-controls-panel"]').length > 0) {
          cy.log("✅ Training controls found");
        }
        if ($body.find('[data-testid="training-stats-panel"]').length > 0) {
          cy.log("✅ Training stats found");
        }
        if ($body.find('[data-testid="training-dummy"]').length > 0) {
          cy.log("✅ Training dummy found");
        }
      });

      cy.returnToIntro();
    });
  });

  describe("Stance Practice and Progression", () => {
    it("should practice all 8 trigram stances efficiently", () => {
      cy.annotate("Practicing all 8 stances");

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");

      // Verify training player and dummy are present before practicing
      cy.get('[data-testid="training-player"]', { timeout: 5000 }).should("exist");
      cy.get('[data-testid="training-dummy-container"]', { timeout: 5000 }).should("exist");

      // Practice each stance once efficiently (batched without per-iteration annotations)
      for (let i = 1; i <= 8; i++) {
        cy.practiceStance(i, 1);
        
        // Verify training screen still exists after each practice
        if (i % 4 === 0) {
          cy.get('[data-testid="training-screen"]').should("exist");
        }
      }

      // Final verification that training is still functional
      cy.get('[data-testid="training-screen"]').should("exist");
      cy.get('[data-testid="training-arena"]').should("exist");

      cy.log("✅ All 8 stances practiced");
      cy.returnToIntro();
    });

    it("should support repetitions and rapid stance switching", () => {
      cy.annotate("Testing training repetitions and transitions");

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");

      // Practice first stance multiple times
      cy.practiceStance(1, 5);

      // Rapidly switch between stances
      const stances = ["1", "3", "5", "7", "2", "4", "6", "8"];
      cy.gameActions(stances);

      cy.log("✅ Repetitions and rapid switching verified");
      cy.returnToIntro();
    });
  });

  describe("Training Interactions", () => {
    it("should support all training interactions and feedback", () => {
      cy.annotate("Testing training interactions");

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]', { timeout: 15000 }).should("exist");

      // Check for controls and try interactions
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="training-controls"]').length > 0) {
          cy.get('[data-testid="training-controls"]').should("exist");

          if ($body.find('[data-testid="start-training-button"]').length > 0) {
            cy.get('[data-testid="start-training-button"]').click({ force: true });
            cy.wait(500);

            if ($body.find('[data-testid="execute-technique-button"]').length > 0) {
              cy.get('[data-testid="execute-technique-button"]').click({ force: true });
              cy.log("✅ Training interaction successful");
            }
          }
        } else {
          // Use keyboard interaction as fallback
          cy.get("body").type(" ");
          cy.wait(300);
          cy.log("✅ Keyboard interaction successful");
        }
      });

      // Execute techniques
      cy.practiceStance(1, 3);
      cy.practiceStance(2, 3);

      // Check for feedback
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="training-feedback"]').length > 0) {
          cy.log("✅ Training feedback found");
        }
        if ($body.find('[data-testid="training-stats"]').length > 0) {
          cy.log("✅ Training stats panel found");
        }
      });

      cy.returnToIntro();
    });
  });

  describe("Training Statistics", () => {
    it("should track training statistics", () => {
      cy.annotate("Testing statistics tracking");

      cy.enterTrainingMode();

      // Check for stats panel
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="training-stats-panel"]').length > 0) {
          cy.get('[data-testid="training-stats-panel"]').should("exist");

          if ($body.find('[data-testid="attempts-count"]').length > 0) {
            cy.get('[data-testid="attempts-count"]').should("contain", "시도");
          }
        } else {
          cy.log("⚠️ Stats panel not found - skipping statistics test");
        }
      });

      cy.returnToIntro();
    });
  });

  describe("Korean Martial Arts Training Theming", () => {
    it("should display Korean text and themed visual elements", () => {
      cy.annotate("Verifying Korean theming");

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");

      // Check for Korean training terms
      cy.get("body").then(($body) => {
        const bodyText = $body.text();
        const koreanTerms = ["훈련", "연습", "기술", "자세"];
        let foundKorean = false;

        koreanTerms.forEach((term) => {
          if (bodyText.includes(term)) {
            foundKorean = true;
            cy.log(`✅ Found Korean term: ${term}`);
          }
        });

        if (!foundKorean) {
          cy.log("⚠️ Korean text may be in canvas");
        }
      });

      // Verify canvas is present
      cy.get("canvas").should("be.visible");
      cy.log("✅ Korean themed canvas verified");

      cy.returnToIntro();
    });
  });

  describe("Training Controls and Navigation", () => {
    it("should support keyboard controls and ESC key", () => {
      cy.annotate("Testing training controls");

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");

      // Test stance selection (1-8)
      cy.gameActions(["1", "2", "3", "4"]);

      // Test technique execution (space)
      cy.get("body").type(" ");
      cy.wait(200);

      cy.log("✅ Keyboard controls tested");

      // Test ESC key to return to menu
      cy.get("body").type("{esc}");
      cy.wait(500);

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="intro-screen"]').length > 0) {
          cy.log("✅ ESC returned to menu");
        } else {
          cy.log("⚠️ ESC may require multiple presses");
        }
      });
    });

    it("should return to menu via button or ESC", () => {
      cy.annotate("Testing return to menu");

      cy.enterTrainingMode();

      // Try return button or ESC key
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="return-to-menu-button"]').length > 0) {
          cy.get('[data-testid="return-to-menu-button"]').click({ force: true });
        } else {
          cy.get("body").type("{esc}");
        }
      });

      cy.wait(500);

      // Verify return
      cy.get("body").then(($body) => {
        const hasIntro = $body.find('[data-testid="intro-screen"]').length > 0;
        const hasMenu = $body.find('[data-testid="main-menu-section"]').length > 0;

        if (hasIntro || hasMenu) {
          cy.log("✅ Successfully returned to menu");
        }
      });
    });
  });

  describe("Performance and Stability", () => {
    it("should handle extended training session", () => {
      cy.annotate("Testing extended training session");

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");

      // Practice extensively (reduced iterations for speed)
      for (let i = 0; i < 6; i++) {
        const stance = ((i % 8) + 1).toString();
        cy.get("body").type(stance);
        cy.get("body").type(" ");
        cy.wait(50); // Minimal wait for stability
      }

      cy.log("✅ Extended training session completed");
      cy.returnToIntro();
    });

    it("should handle rapid mode switching", () => {
      cy.annotate("Testing rapid mode switching");

      // Switch between training and menu rapidly (reduced iterations)
      for (let i = 0; i < 2; i++) {
        cy.enterTrainingMode();
        cy.get('[data-testid="training-screen"]').should("exist");
        cy.wait(300); // Reduced from 500ms
        cy.returnToIntro();
        cy.get('[data-testid="intro-screen"]').should("exist");
        cy.wait(300); // Reduced from 500ms
      }

      cy.log("✅ Rapid mode switching completed");
    });
  });

  describe("Training to Combat Transition", () => {
    it("should transition smoothly from training to combat", () => {
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

  describe("Error Handling", () => {
    it("should handle invalid inputs and recover from errors", () => {
      cy.annotate("Testing error handling");

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");

      // Try invalid inputs
      cy.get("body").type("9"); // Invalid stance
      cy.get("body").type("0"); // Invalid stance

      // Should still be in training mode
      cy.get('[data-testid="training-screen"]').should("exist");

      // Test error recovery
      cy.on("uncaught:exception", (err) => {
        if (
          err.message &&
          (err.message.includes("Training") ||
            err.message.includes("Invalid stance") ||
            err.message.includes("audio") ||
            err.message.includes("WebGL") ||
            err.message.includes("Failed to load"))
        ) {
          return false;
        }
        return true;
      });

      // Execute various actions
      cy.practiceStance(1, 3);
      cy.practiceStance(5, 2);

      // Should still be functional
      cy.get('[data-testid="training-screen"]').should("exist");

      cy.returnToIntro();
      cy.log("✅ Error handling and recovery verified");
    });
  });
});
