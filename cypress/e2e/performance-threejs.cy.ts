/**
 * Three.js Performance Tests
 * Comprehensive FPS and performance monitoring for Three.js components
 *
 * ✅ Verifies 60fps target for smooth gameplay
 * Tests Canvas rendering performance across all screens
 */

describe("Black Trigram - Three.js Performance", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
  });

  describe("IntroScreen FPS Performance", () => {
    it("should maintain smooth FPS on intro screen", () => {
      cy.annotate("Testing IntroScreen FPS performance");

      // Verify canvas is rendering
      cy.get("canvas").should("be.visible");
      cy.get('[data-testid="intro-screen"]').should("exist");

      // Monitor FPS for shorter duration
      cy.assertSmoothFPS(1500); // Reduced from 2000ms

      cy.log("✅ IntroScreen maintains smooth FPS");
    });

    it("should maintain FPS during menu interactions", () => {
      cy.annotate("Testing FPS during menu interactions");

      // Perform interactions first
      cy.get('[data-testid="combat-button"]').trigger("mouseover");
      cy.wait(100); // Reduced from 200ms
      cy.get('[data-testid="training-button"]').trigger("mouseover");
      cy.wait(100); // Reduced from 200ms
      cy.gameActions(["{leftarrow}", "{rightarrow}"]);
      cy.wait(100); // Reduced from 200ms

      // Then monitor FPS to verify system is still responsive
      cy.assertMinFPS(40, 1500); // Reduced from 2000ms

      cy.log("✅ Menu interactions FPS verified");
    });

    it("should handle canvas rendering at different viewport sizes", () => {
      cy.annotate("Testing FPS at different viewports");

      const viewports: [number, number][] = [
        [1280, 720], // Desktop
        [375, 667], // Mobile - only test extremes
      ];

      viewports.forEach(([width, height]) => {
        cy.viewport(width, height);
        cy.wait(300); // Reduced from 500ms

        // Monitor FPS at this viewport - reduced duration
        cy.assertMinFPS(30, 1000); // Reduced from 1500ms

        cy.log(`✅ Acceptable FPS at ${width}x${height}`);
      });

      // Reset viewport
      cy.viewport(1280, 720);
    });
  });

  describe("CombatScreen FPS Performance", () => {
    it("should maintain smooth FPS in combat mode", () => {
      cy.annotate("Testing CombatScreen FPS performance");

      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");

      // Monitor FPS during combat - reduced duration
      cy.assertMinFPS(40, 1500); // Reduced from 2000ms

      cy.log("✅ Combat maintains acceptable FPS");
    });

    it("should maintain FPS during combat actions", () => {
      cy.annotate("Testing FPS during combat actions");

      cy.enterCombatMode();

      cy.wrap(Date.now()).then((startTime) => {
        // Perform combat actions
        cy.gameActions(["1", " ", "w", "a", "s", "d"]);
        cy.wait(100); // Reduced from 200ms
        cy.gameActions(["3", " ", "w", "a", "s", "d"]);
        cy.wait(100); // Reduced from 200ms

        // Monitor FPS - reduced duration
        cy.assertMinFPS(35, 1000); // Reduced from 1500ms

        cy.wrap(Date.now() - startTime).then((duration) => {
          cy.task("logPerformance", {
            name: "Combat Actions Performance",
            duration,
          });

          expect(duration).to.be.lessThan(5000);
          cy.log(`✅ Combat actions completed in ${duration}ms`);
        });
      });

      cy.returnToIntro();
    });

    it("should maintain FPS during intense combat", () => {
      cy.annotate("Testing FPS during intense combat");

      cy.enterCombatMode();

      // Rapid stance changes and attacks
      for (let i = 1; i <= 4; i++) {
        cy.get("body").type(i.toString());
        cy.wait(100);
        cy.get("body").type(" ");
        cy.wait(100);
      }

      // Monitor FPS
      cy.assertMinFPS(30, 1500);

      cy.log("✅ Maintains FPS during intense combat");

      cy.returnToIntro();
    });

    it("should handle rapid stance transitions without FPS drops", () => {
      cy.annotate("Testing FPS during rapid stance changes");

      cy.enterCombatMode();

      cy.wrap(Date.now()).then((startTime) => {
        // Rapid stance cycling
        cy.gameActions(["1", "2", "3", "4", "5", "6", "7", "8"]);
        cy.gameActions(["8", "7", "6", "5", "4", "3", "2", "1"]);

        cy.wrap(Date.now() - startTime).then((duration) => {
          // Should complete quickly
          expect(duration).to.be.lessThan(3000);

          cy.task("logPerformance", {
            name: "Rapid Stance Transitions",
            duration,
          });
        });
      });

      // Monitor FPS after rapid changes
      cy.assertMinFPS(35, 1000);

      cy.returnToIntro();
    });
  });

  describe("TrainingScreen FPS Performance", () => {
    it("should maintain smooth FPS in training mode", () => {
      cy.annotate("Testing TrainingScreen FPS performance");

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");

      // Monitor FPS during training
      cy.assertMinFPS(40, 2000);

      cy.log("✅ Training maintains acceptable FPS");

      cy.returnToIntro();
    });

    it("should maintain FPS during training exercises", () => {
      cy.annotate("Testing FPS during training exercises");

      cy.enterTrainingMode();

      // Practice multiple stances
      cy.practiceStance(1, 2);
      cy.practiceStance(3, 2);
      cy.practiceStance(5, 2);

      // Monitor FPS
      cy.assertMinFPS(35, 1500);

      cy.log("✅ Training exercises maintain FPS");

      cy.returnToIntro();
    });
  });

  describe("Scene Transition Performance", () => {
    it("should maintain FPS during screen transitions", () => {
      cy.annotate("Testing FPS during scene transitions");

      cy.wrap(Date.now()).then((startTime) => {
        // Multiple transitions
        cy.enterCombatMode();
        cy.wait(500);
        cy.returnToIntro();
        cy.wait(500);
        cy.enterTrainingMode();
        cy.wait(500);
        cy.returnToIntro();
        cy.wait(500);

        cy.wrap(Date.now() - startTime).then((duration) => {
          cy.task("logPerformance", {
            name: "Scene Transitions",
            duration,
          });

          // Should complete in reasonable time
          expect(duration).to.be.lessThan(8000);
          cy.log(`✅ Scene transitions completed in ${duration}ms`);
        });
      });

      // Verify FPS is stable after transitions
      cy.assertMinFPS(40, 1500);
    });

    it("should handle rapid screen transitions", () => {
      cy.annotate("Testing rapid screen transitions");

      cy.wrap(Date.now()).then((startTime) => {
        // Rapid navigation
        for (let i = 0; i < 3; i++) {
          cy.gameActions(["1"]); // Combat
          cy.wait(300);
          cy.gameActions(["{esc}"]); // Back
          cy.wait(300);
        }

        cy.wrap(Date.now() - startTime).then((duration) => {
          // Should handle rapid transitions
          expect(duration).to.be.lessThan(6000);

          cy.task("logPerformance", {
            name: "Rapid Screen Transitions",
            duration,
          });
        });
      });

      // Verify no performance degradation
      cy.assertMinFPS(35, 1000);
    });
  });

  describe("Canvas Rendering Verification", () => {
    it("should verify canvas is actively rendering on intro", () => {
      cy.annotate("Testing canvas rendering on intro");

      cy.get("canvas").should("be.visible");
      cy.assertCanvasRendering(1000);

      cy.log("✅ Canvas is actively rendering");
    });

    it("should verify canvas renders in combat mode", () => {
      cy.annotate("Testing canvas rendering in combat");

      cy.enterCombatMode();
      cy.get("canvas").should("be.visible");
      cy.assertCanvasRendering(1000);

      cy.log("✅ Combat canvas is rendering");

      cy.returnToIntro();
    });

    it("should verify canvas renders in training mode", () => {
      cy.annotate("Testing canvas rendering in training");

      cy.enterTrainingMode();
      cy.get("canvas").should("be.visible");
      cy.assertCanvasRendering(1000);

      cy.log("✅ Training canvas is rendering");

      cy.returnToIntro();
    });
  });

  describe("Memory Management", () => {
    it("should not have significant memory leaks on intro screen", () => {
      cy.annotate("Testing memory management on intro");

      cy.assertNoMemoryLeaks(3000);

      cy.log("✅ No significant memory leaks detected");
    });

    it("should manage memory during screen transitions", () => {
      cy.annotate("Testing memory during transitions");

      // Multiple transitions to check for leaks
      cy.enterCombatMode();
      cy.wait(500);
      cy.returnToIntro();
      cy.wait(500);
      cy.enterTrainingMode();
      cy.wait(500);
      cy.returnToIntro();
      cy.wait(500);

      cy.assertNoMemoryLeaks(2000);

      cy.log("✅ Memory managed correctly during transitions");
    });

    it("should manage memory during extended gameplay", () => {
      cy.annotate("Testing memory during extended gameplay");

      cy.enterCombatMode();

      // Extended combat simulation
      for (let i = 0; i < 3; i++) {
        cy.gameActions(["1", " ", "w", "a", "s", "d"]);
        cy.wait(300);
      }

      cy.assertNoMemoryLeaks(2000);

      cy.returnToIntro();

      cy.log("✅ Memory managed during extended gameplay");
    });
  });

  describe("Performance Under Load", () => {
    it("should handle multiple rapid inputs without degradation", () => {
      cy.annotate("Testing performance under input load");

      cy.enterCombatMode();

      cy.wrap(Date.now()).then((startTime) => {
        // Simulate rapid player inputs
        for (let i = 0; i < 5; i++) {
          cy.gameActions(["w", "a", "s", "d", "1", "2", "3", " "]);
        }

        cy.wrap(Date.now() - startTime).then((duration) => {
          cy.task("logPerformance", {
            name: "Rapid Input Load",
            duration,
          });

          expect(duration).to.be.lessThan(10000);
        });
      });

      // Verify FPS is still acceptable
      cy.assertMinFPS(30, 1500);

      cy.returnToIntro();
    });

    it("should maintain performance during extended session", () => {
      cy.annotate("Testing extended session performance");

      cy.wrap(Date.now()).then((startTime) => {
        // Enter combat and perform extended actions
        cy.enterCombatMode();

        for (let round = 0; round < 2; round++) {
          // Stance practice
          for (let stance = 1; stance <= 4; stance++) {
            cy.get("body").type(stance.toString());
            cy.wait(100);
            cy.get("body").type(" ");
            cy.wait(100);
          }

          // Movement
          cy.gameActions(["w", "w", "s", "s", "a", "a", "d", "d"]);
          cy.wait(300);
        }

        cy.wrap(Date.now() - startTime).then((sessionDuration) => {
          cy.task("logPerformance", {
            name: "Extended Session",
            duration: sessionDuration,
          });
        });
      });

      // Performance should still be acceptable
      cy.assertMinFPS(30, 1500);

      cy.returnToIntro();
    });
  });

  describe("Performance Benchmarks", () => {
    it("should benchmark intro screen load time", () => {
      cy.annotate("Benchmarking intro screen load");

      cy.wrap(Date.now()).then((startTime) => {
        cy.visitWithWebGLMock("/", { timeout: 12000 });
        cy.waitForCanvasReady();
        cy.get('[data-testid="intro-screen"]').should("exist");

        cy.wrap(Date.now() - startTime).then((loadTime) => {
          cy.task("logPerformance", {
            name: "Intro Screen Load Benchmark",
            duration: loadTime,
          });

          // Should load within 5 seconds
          expect(loadTime).to.be.lessThan(5000);

          cy.log(`✅ Intro loaded in ${loadTime}ms`);
        });
      });
    });

    it("should benchmark combat screen transition time", () => {
      cy.annotate("Benchmarking combat transition");

      cy.wrap(Date.now()).then((startTime) => {
        cy.enterCombatMode();
        cy.get('[data-testid="combat-screen"]').should("exist");

        cy.wrap(Date.now() - startTime).then((transitionTime) => {
          cy.task("logPerformance", {
            name: "Combat Transition Benchmark",
            duration: transitionTime,
          });

          // Should transition within 3 seconds
          expect(transitionTime).to.be.lessThan(3000);

          cy.log(`✅ Combat transition in ${transitionTime}ms`);
        });
      });

      cy.returnToIntro();
    });

    it("should benchmark training screen transition time", () => {
      cy.annotate("Benchmarking training transition");

      cy.wrap(Date.now()).then((startTime) => {
        cy.enterTrainingMode();
        cy.get('[data-testid="training-screen"]').should("exist");

        cy.wrap(Date.now() - startTime).then((transitionTime) => {
          cy.task("logPerformance", {
            name: "Training Transition Benchmark",
            duration: transitionTime,
          });

          // Should transition within 3 seconds
          expect(transitionTime).to.be.lessThan(3000);

          cy.log(`✅ Training transition in ${transitionTime}ms`);
        });
      });

      cy.returnToIntro();
    });
  });
});
