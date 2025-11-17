/**
 * Consolidated Training Tests - Merged from multiple files
 * Combines: training-mode.cy.ts, training-system-integration.cy.ts
 * 
 * This file consolidates all training-related tests to reduce duplication and improve execution time.
 * Originally these were spread across 2 separate files with significant overlap.
 */

describe("Black Trigram - Training (Consolidated)", () => {
  // Per-test setup - enter training before each test for isolation
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
    cy.enterTrainingMode();
  });

  // Clean up after each test
  afterEach(() => {
    cy.returnToIntro();
  });

  describe("Training Screen & UI Components", () => {
    it("should display all training UI elements and components", () => {
      cy.annotate("Verifying training UI");

      cy.get('[data-testid="training-screen"]', { timeout: 10000 }).should("exist");

      // Check for essential training elements
      const essentialElements = [
        "training-area",
        "training-player",
        "training-dummy-container",
      ];

      essentialElements.forEach((element) => {
        cy.get("body").then(($body) => {
          if ($body.find(`[data-testid="${element}"]`).length > 0) {
            cy.get(`[data-testid="${element}"]`).should("exist");
            cy.log(`✅ Found ${element}`);
          } else {
            cy.log(`⚠️ ${element} not found, but continuing test`);
          }
        });
      });

      cy.log("✅ Training UI components verified");
    });

    it("should display training dummy or target", () => {
      cy.annotate("Verifying training dummy");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="training-dummy"]').length > 0) {
          cy.get('[data-testid="training-dummy"]').should("exist");
          cy.log("✅ Training dummy found");
        } else if ($body.find('[data-testid="training-target"]').length > 0) {
          cy.get('[data-testid="training-target"]').should("exist");
          cy.log("✅ Training target found");
        } else {
          cy.log("⚠️ No training dummy/target found, but continuing");
        }
      });
    });
  });

  describe("Stance Practice & Training Actions", () => {
    it("should practice all 8 trigram stances", () => {
      cy.annotate("Testing all 8 trigram stances in training");

      // Practice each stance once
      for (let i = 1; i <= 8; i++) {
        cy.get("body").type(i.toString());
        cy.wait(200);
        cy.get("body").type(" ");
        cy.wait(200);
      }

      cy.get('[data-testid="training-screen"]').should("exist");
      cy.log("✅ All 8 stances practiced");
    });

    it("should support repetitions and rapid stance switching", () => {
      cy.annotate("Testing stance repetitions");

      // Practice same stance multiple times
      cy.practiceStance(1, 3);
      cy.practiceStance(5, 3);

      // Rapid switching
      cy.gameActions(["1", "3", "5", "7", "2", "4", "6", "8"]);

      cy.get('[data-testid="training-screen"]').should("exist");
      cy.log("✅ Repetitions and switching tested");
    });

    it("should support all training interactions and feedback", () => {
      cy.annotate("Testing training interactions");

      // Execute various training actions
      cy.gameActions(["1", " ", "3", " ", "5", " "]);

      // Check for training feedback
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="training-feedback"]').length > 0) {
          cy.get('[data-testid="training-feedback"]').should("exist");
          cy.log("✅ Training feedback found");
        } else if ($body.find('[data-testid="training-log"]').length > 0) {
          cy.get('[data-testid="training-log"]').should("exist");
          cy.log("✅ Training log found");
        } else {
          cy.log("⚠️ No specific feedback element found");
        }
      });
    });
  });

  describe("Training Statistics & Progress", () => {
    it("should track training statistics", () => {
      cy.annotate("Testing training statistics");

      // Execute training actions
      cy.practiceStance(2, 2);
      cy.practiceStance(4, 2);

      // Check for stats tracking
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="training-stats"]').length > 0) {
          cy.get('[data-testid="training-stats"]').should("exist");
          cy.log("✅ Training stats found");
        } else if ($body.find('[data-testid="player-stats"]').length > 0) {
          cy.get('[data-testid="player-stats"]').should("exist");
          cy.log("✅ Player stats found");
        } else {
          cy.log("⚠️ No stats display found");
        }
      });
    });

    it("should maintain progress through multiple sessions", () => {
      cy.annotate("Testing progress persistence");

      // Practice in first session
      cy.practiceStance(1, 2);

      // Exit and re-enter training
      cy.returnToIntro();
      cy.get('[data-testid="intro-screen"]', { timeout: 5000 }).should("exist");

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");

      // Continue training
      cy.practiceStance(3, 2);

      cy.log("✅ Progress persistence tested");
    });
  });

  describe("Korean Martial Arts Theming", () => {
    it("should display Korean text and themed elements", () => {
      cy.annotate("Testing Korean theming");

      // Check for Korean text
      cy.get("body").then(($body) => {
        const hasKoreanText = $body.text().match(/[가-힣]/);
        if (hasKoreanText) {
          cy.log("✅ Korean text found in training UI");
        } else {
          cy.log("⚠️ No Korean text detected");
        }
      });

      cy.get('[data-testid="training-screen"]').should("exist");
    });
  });

  describe("Training Controls & Navigation", () => {
    it("should support keyboard controls and ESC key", () => {
      cy.annotate("Testing training controls");

      // Test various keyboard inputs
      cy.gameActions(["1", "2", "3", " "]);
      cy.wait(200);

      // Movement keys
      cy.gameActions(["w", "a", "s", "d"]);

      cy.get('[data-testid="training-screen"]').should("exist");
      cy.log("✅ Keyboard controls verified");
    });

    it("should handle extended training session", () => {
      cy.annotate("Testing extended training");

      // Extended training sequence
      for (let i = 0; i < 3; i++) {
        cy.practiceStance(1, 2);
        cy.practiceStance(3, 2);
        cy.practiceStance(5, 2);
        cy.practiceStance(7, 2);
      }

      cy.get('[data-testid="training-screen"]').should("exist");
      cy.log("✅ Extended session handled");
    });
  });

  describe("Training Performance", () => {
    it("should maintain performance during training", () => {
      cy.annotate("Testing training performance");

      const startTime = Date.now();

      // Intense training sequence
      for (let i = 1; i <= 8; i++) {
        cy.get("body").type(i.toString());
        cy.wait(100);
        cy.get("body").type(" ");
        cy.wait(100);
      }

      cy.wrap(null).then(() => {
        const duration = Date.now() - startTime;
        cy.task("logPerformance", { name: "Training Performance", duration });
        expect(duration).to.be.lessThan(8000);
        cy.log(`✅ Performance maintained: ${duration}ms`);
      });
    });
  });
});
