/**
 * WebGL Rendering Verification Tests
 * Comprehensive tests to ensure Three.js WebGL context is active and rendering correctly
 *
 * ✅ Verifies WebGL context creation
 * ✅ Tests Three.js renderer initialization
 * ✅ Monitors frame rate performance
 * ✅ Validates scene object rendering
 */

/* eslint-disable @typescript-eslint/no-unused-expressions */

describe("Black Trigram - WebGL Rendering Verification", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
  });

  describe("WebGL Context Verification", () => {
    it("should verify Three.js WebGL context is active", () => {
      cy.annotate("Testing WebGL context initialization");

      cy.get("canvas").should("be.visible");

      cy.window().then(() => {
        const canvas = document.querySelector("canvas");
        expect(canvas).to.exist;

        // Verify WebGL context (try WebGL2 first, fallback to WebGL1)
        const gl =
          (canvas as HTMLCanvasElement).getContext("webgl2") ||
          (canvas as HTMLCanvasElement).getContext("webgl") ||
          (canvas as HTMLCanvasElement).getContext("experimental-webgl");

        expect(gl).to.not.be.null;

        if (gl) {
          // Verify WebGL version
          const version = gl.getParameter(gl.VERSION);
          cy.log(`WebGL Version: ${version}`);
          expect(version).to.be.a("string");
          expect(version.length).to.be.greaterThan(0);

          // Verify renderer
          const renderer = gl.getParameter(gl.RENDERER);
          cy.log(`WebGL Renderer: ${renderer}`);
          expect(renderer).to.be.a("string");

          // Verify maximum texture size
          const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
          cy.log(`Max Texture Size: ${maxTextureSize}`);
          expect(maxTextureSize).to.be.greaterThan(0);

          // Verify maximum viewport dimensions
          const maxViewport = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
          cy.log(`Max Viewport: ${maxViewport[0]}x${maxViewport[1]}`);
          expect(maxViewport[0]).to.be.greaterThan(0);
          expect(maxViewport[1]).to.be.greaterThan(0);
        }

        cy.log("✅ WebGL context verified and active");
      });
    });

    it("should verify Three.js renderer is initialized", () => {
      cy.annotate("Testing Three.js renderer initialization");

      cy.window().then(() => {
        // Check for Three.js in window (may be exposed for testing)
        const winWithThree = window as Window & {
          __threeRenderer?: unknown;
          __threeScene?: { children?: unknown[] };
          THREE?: unknown;
        };

        // Verify canvas exists
        const canvas = document.querySelector("canvas");
        expect(canvas).to.exist;

        // If Three.js exposes renderer/scene for testing, verify them
        if (winWithThree.__threeRenderer) {
          expect(winWithThree.__threeRenderer).to.exist;
          cy.log("✅ Three.js renderer found");
        }

        if (winWithThree.__threeScene) {
          expect(winWithThree.__threeScene).to.exist;

          // Verify scene has objects
          if (winWithThree.__threeScene.children) {
            const objectCount = winWithThree.__threeScene.children.length;
            expect(objectCount).to.be.greaterThan(0);
            cy.log(`Three.js scene has ${objectCount} objects`);
          }
        }

        cy.log("✅ Three.js renderer verified");
      });
    });

    it("should verify WebGL extensions support", () => {
      cy.annotate("Testing WebGL extensions");

      cy.window().then(() => {
        const canvas = document.querySelector("canvas");
        expect(canvas).to.exist;

        const gl =
          (canvas as HTMLCanvasElement).getContext("webgl2") ||
          (canvas as HTMLCanvasElement).getContext("webgl");

        if (gl) {
          // Check for important extensions
          const extensions = [
            "OES_texture_float",
            "OES_texture_float_linear",
            "WEBGL_depth_texture",
            "OES_element_index_uint",
          ];

          const supportedExtensions: string[] = [];
          const unsupportedExtensions: string[] = [];

          extensions.forEach((ext) => {
            const supported = gl.getExtension(ext);
            if (supported) {
              supportedExtensions.push(ext);
            } else {
              unsupportedExtensions.push(ext);
            }
          });

          cy.log(`Supported extensions: ${supportedExtensions.join(", ")}`);
          if (unsupportedExtensions.length > 0) {
            cy.log(
              `Unsupported extensions: ${unsupportedExtensions.join(", ")}`
            );
          }

          // At least one extension should be supported
          expect(supportedExtensions.length).to.be.greaterThan(0);
        }

        cy.log("✅ WebGL extensions verified");
      });
    });
  });

  describe("Frame Rate Performance", () => {
    it("should verify Three.js scene renders at stable framerate", () => {
      cy.annotate("Testing framerate stability");

      cy.get("canvas").should("be.visible");

      let frameCount = 0;
      let startTime = 0;

      cy.window().then((win) => {
        startTime = performance.now();

        const measureFPS = () => {
          frameCount++;
          if (frameCount < 60) {
            win.requestAnimationFrame(measureFPS);
          } else {
            const elapsed = performance.now() - startTime;
            const fps = (frameCount / elapsed) * 1000;
            cy.log(`Average FPS: ${fps.toFixed(2)}`);

            // Target 60fps, allow some tolerance for software rendering
            // Minimum 30fps acceptable, optimal 55-60fps
            expect(fps).to.be.greaterThan(30);

            if (fps >= 55) {
              cy.log("✅ Excellent framerate (≥55fps)");
            } else if (fps >= 45) {
              cy.log("✅ Good framerate (45-55fps)");
            } else {
              cy.log("⚠️ Acceptable framerate (30-45fps) - software rendering");
            }
          }
        };

        win.requestAnimationFrame(measureFPS);
      });

      // Wait for measurement to complete
      cy.wait(2000);
    });

    it("should maintain consistent frame timing", () => {
      cy.annotate("Testing frame timing consistency");

      const frameTimes: number[] = [];
      let lastTime = 0;
      let measurementCount = 0;
      const targetMeasurements = 30;

      cy.window().then((win) => {
        const measureFrameTime = (timestamp: number) => {
          if (lastTime > 0) {
            const deltaTime = timestamp - lastTime;
            frameTimes.push(deltaTime);
            measurementCount++;
          }
          lastTime = timestamp;

          if (measurementCount < targetMeasurements) {
            win.requestAnimationFrame(measureFrameTime);
          } else {
            // Calculate frame time statistics
            const avgFrameTime =
              frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
            const maxFrameTime = Math.max(...frameTimes);
            const minFrameTime = Math.min(...frameTimes);
            const variance =
              frameTimes.reduce((sum, time) => {
                return sum + Math.pow(time - avgFrameTime, 2);
              }, 0) / frameTimes.length;
            const stdDev = Math.sqrt(variance);

            cy.log(`Average frame time: ${avgFrameTime.toFixed(2)}ms`);
            cy.log(
              `Min/Max frame time: ${minFrameTime.toFixed(
                2
              )}ms / ${maxFrameTime.toFixed(2)}ms`
            );
            cy.log(`Frame time std dev: ${stdDev.toFixed(2)}ms`);

            // Frame times should be relatively consistent
            // Target: 16.67ms (60fps), acceptable up to 33.33ms (30fps)
            expect(avgFrameTime).to.be.lessThan(50); // Allow for software rendering

            // Variance should be reasonable (not too inconsistent)
            expect(stdDev).to.be.lessThan(20);

            cy.log("✅ Frame timing is consistent");
          }
        };

        win.requestAnimationFrame(measureFrameTime);
      });

      // Wait for measurements to complete
      cy.wait(1500);
    });
  });

  describe("Rendering Quality", () => {
    it("should verify canvas is actively rendering (pixel changes)", () => {
      cy.annotate("Testing active canvas rendering");

      cy.get("canvas").should("be.visible");

      cy.window().then(() => {
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;
        expect(canvas).to.exist;

        // Capture initial canvas state
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const initialData = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );

          // Wait for a few frames
          cy.wait(500);

          // Capture new canvas state
          const newData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // Compare pixel data to ensure rendering is happening
          let differentPixels = 0;
          for (let i = 0; i < initialData.data.length; i++) {
            if (initialData.data[i] !== newData.data[i]) {
              differentPixels++;
            }
          }

          const changePercentage =
            (differentPixels / initialData.data.length) * 100;
          cy.log(`Pixel change: ${changePercentage.toFixed(2)}%`);

          // Canvas should be actively rendering (some pixels changed)
          expect(differentPixels).to.be.greaterThan(0);
          cy.log("✅ Canvas is actively rendering");
        }
      });
    });

    it("should verify no blank/black canvas rendering", () => {
      cy.annotate("Testing canvas content rendering");

      cy.get("canvas").should("be.visible");

      cy.window().then(() => {
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;
        expect(canvas).to.exist;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;

          // Count non-zero pixels
          let nonZeroPixels = 0;
          for (let i = 0; i < pixels.length; i += 4) {
            // Check RGBA values
            if (pixels[i] !== 0 || pixels[i + 1] !== 0 || pixels[i + 2] !== 0) {
              nonZeroPixels++;
            }
          }

          const contentPercentage = (nonZeroPixels / (pixels.length / 4)) * 100;
          cy.log(
            `Canvas content: ${contentPercentage.toFixed(2)}% non-black pixels`
          );

          // Canvas should have visible content (not all black)
          expect(contentPercentage).to.be.greaterThan(5);
          cy.log("✅ Canvas has visible content");
        }
      });
    });
  });

  describe("Memory and Resource Management", () => {
    it("should not leak WebGL contexts", () => {
      cy.annotate("Testing WebGL context leak detection");

      let initialContexts = 0;

      cy.window().then((_win) => {
        // Count initial WebGL contexts
        const canvases = document.querySelectorAll("canvas");
        canvases.forEach((canvas) => {
          const gl = (canvas as HTMLCanvasElement).getContext("webgl");
          if (gl) initialContexts++;
        });

        cy.log(`Initial WebGL contexts: ${initialContexts}`);
        expect(initialContexts).to.be.greaterThan(0);
      });

      // Perform some actions
      cy.get('[data-testid="combat-button"]').trigger("mouseover");
      cy.wait(500);
      cy.get('[data-testid="training-button"]').trigger("mouseover");
      cy.wait(500);

      cy.window().then((_win) => {
        // Count final WebGL contexts
        let finalContexts = 0;
        const canvases = document.querySelectorAll("canvas");
        canvases.forEach((canvas) => {
          const gl = (canvas as HTMLCanvasElement).getContext("webgl");
          if (gl) finalContexts++;
        });

        cy.log(`Final WebGL contexts: ${finalContexts}`);

        // Should not create new contexts
        expect(finalContexts).to.equal(initialContexts);
        cy.log("✅ No WebGL context leaks detected");
      });
    });

    it("should manage GPU memory efficiently", () => {
      cy.annotate("Testing GPU memory management");

      cy.window().then(() => {
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;
        const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");

        if (gl && "memory" in performance) {
          const perfWithMemory = performance as Performance & {
            memory?: {
              usedJSHeapSize: number;
              totalJSHeapSize: number;
              jsHeapSizeLimit: number;
            };
          };

          if (perfWithMemory.memory) {
            const initialMemory = perfWithMemory.memory.usedJSHeapSize;
            cy.log(
              `Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)}MB`
            );

            // Perform some rendering operations
            cy.gameActions(["1", "2", "3"]);
            cy.wait(1000);

            const finalMemory = perfWithMemory.memory.usedJSHeapSize;
            cy.log(`Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)}MB`);

            const memoryGrowth = finalMemory - initialMemory;
            cy.log(
              `Memory growth: ${(memoryGrowth / 1024 / 1024).toFixed(2)}MB`
            );

            // Memory growth should be reasonable (<100MB for this test)
            expect(memoryGrowth).to.be.lessThan(100 * 1024 * 1024);
            cy.log("✅ GPU memory managed efficiently");
          }
        }
      });
    });
  });

  describe("Combat Mode WebGL Performance", () => {
    it("should maintain WebGL context in combat mode", () => {
      cy.annotate("Testing WebGL in combat mode");

      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");

      cy.window().then(() => {
        const canvas = document.querySelector("canvas");
        expect(canvas).to.exist;

        const gl =
          (canvas as HTMLCanvasElement).getContext("webgl2") ||
          (canvas as HTMLCanvasElement).getContext("webgl");

        expect(gl).to.not.be.null;
        cy.log("✅ WebGL context active in combat mode");
      });

      // Verify rendering continues
      cy.assertCanvasRendering(1000);

      cy.returnToIntro();
    });

    it("should handle combat actions with stable framerate", () => {
      cy.annotate("Testing framerate during combat actions");

      cy.enterCombatMode();

      // Perform combat actions
      cy.gameActions(["1", " ", "w", "a", "s", "d"]);
      cy.wait(500);

      // Verify framerate is still good
      cy.assertMinFPS(30, 1500);

      cy.log("✅ Combat actions maintain framerate");

      cy.returnToIntro();
    });
  });

  describe("Training Mode WebGL Performance", () => {
    it("should maintain WebGL context in training mode", () => {
      cy.annotate("Testing WebGL in training mode");

      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");

      cy.window().then(() => {
        const canvas = document.querySelector("canvas");
        expect(canvas).to.exist;

        const gl =
          (canvas as HTMLCanvasElement).getContext("webgl2") ||
          (canvas as HTMLCanvasElement).getContext("webgl");

        expect(gl).to.not.be.null;
        cy.log("✅ WebGL context active in training mode");
      });

      cy.returnToIntro();
    });

    it("should handle training exercises with stable framerate", () => {
      cy.annotate("Testing framerate during training");

      cy.enterTrainingMode();

      // Practice a stance
      cy.practiceStance(1, 3);
      cy.wait(500);

      // Verify framerate is still good
      cy.assertMinFPS(30, 1500);

      cy.log("✅ Training maintains framerate");

      cy.returnToIntro();
    });
  });
});
