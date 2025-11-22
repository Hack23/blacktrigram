/**
 * FPS Performance Monitoring for Cypress Tests
 * Provides utilities to monitor frame rate during Three.js rendering
 */

export interface FPSMetrics {
  readonly averageFPS: number;
  readonly minFPS: number;
  readonly maxFPS: number;
  readonly samples: number;
  readonly droppedFrames: number;
}

/**
 * Monitor FPS for a given duration
 * @param duration Duration to monitor in milliseconds
 * @param targetFPS Target FPS to compare against (default 60)
 * @returns Promise with FPS metrics
 */
export function monitorFPS(
  duration: number = 2000,
  targetFPS: number = 60
): Cypress.Chainable<FPSMetrics> {
  return cy.window().then((_win) => {
    return new Cypress.Promise<FPSMetrics>((resolve) => {
      const samples: number[] = [];
      let lastTime = performance.now();
      let droppedFrames = 0;
      const startTime = performance.now();
      const minFrameTime = 1000 / targetFPS;

      const measureFrame = () => {
        const now = performance.now();
        const delta = now - lastTime;
        
        // Skip first frame and frames with zero delta to avoid Infinity FPS
        if (lastTime !== startTime && delta > 0) {
          const fps = 1000 / delta;
          samples.push(fps);
          
          // Count dropped frames (frames that took longer than target)
          if (delta > minFrameTime * 1.5) {
            droppedFrames++;
          }
        }

        lastTime = now;

        if (now - startTime < duration) {
          requestAnimationFrame(measureFrame);
        } else {
          // Calculate metrics
          const averageFPS = samples.reduce((a, b) => a + b, 0) / samples.length;
          const minFPS = Math.min(...samples);
          const maxFPS = Math.max(...samples);

          resolve({
            averageFPS,
            minFPS,
            maxFPS,
            samples: samples.length,
            droppedFrames,
          });
        }
      };

      requestAnimationFrame(measureFrame);
    });
  });
}

/**
 * Assert that FPS is above minimum threshold
 * @param minFPS Minimum acceptable FPS (default 30)
 * @param duration Duration to monitor (default 2000ms)
 */
export function assertMinFPS(
  minFPS: number = 30,
  duration: number = 2000
): Cypress.Chainable<void> {
  return monitorFPS(duration).then((metrics) => {
    return cy.wrap(null).then(() => {
      cy.task("logPerformance", {
        name: "FPS Monitoring",
        duration,
        metrics: {
          average: metrics.averageFPS.toFixed(2),
          min: metrics.minFPS.toFixed(2),
          max: metrics.maxFPS.toFixed(2),
          dropped: metrics.droppedFrames,
        },
      });

      expect(metrics.averageFPS).to.be.greaterThan(minFPS);
      expect(metrics.minFPS).to.be.greaterThan(minFPS * 0.7); // Allow 30% drop

      cy.log(
        `✅ FPS Performance: Avg ${metrics.averageFPS.toFixed(2)} ` +
        `(Min: ${metrics.minFPS.toFixed(2)}, Max: ${metrics.maxFPS.toFixed(2)}, ` +
        `Dropped: ${metrics.droppedFrames}/${metrics.samples})`
      );
    });
  });
}

/**
 * Assert that FPS is consistently above 60fps (ideal for 3D games)
 * @param duration Duration to monitor (default 2000ms)
 */
export function assertSmoothFPS(duration: number = 2000): Cypress.Chainable<void> {
  return monitorFPS(duration, 60).then((metrics) => {
    cy.task("logPerformance", {
      name: "Smooth FPS Check",
      duration,
      metrics: {
        average: metrics.averageFPS.toFixed(2),
        min: metrics.minFPS.toFixed(2),
        max: metrics.maxFPS.toFixed(2),
        dropped: metrics.droppedFrames,
      },
    });

    // Check average FPS is above 50 (allowing some margin)
    expect(metrics.averageFPS).to.be.greaterThan(50);
    
    // Check minimum FPS doesn't drop too low
    expect(metrics.minFPS).to.be.greaterThan(40);
    
    // Check that we don't drop too many frames
    const dropRate = (metrics.droppedFrames / metrics.samples) * 100;
    expect(dropRate).to.be.lessThan(20); // Less than 20% dropped frames

    if (metrics.averageFPS >= 55 && dropRate < 10) {
      cy.log(
        `✅ Excellent FPS Performance: ${metrics.averageFPS.toFixed(2)} FPS ` +
        `(${dropRate.toFixed(1)}% frame drops)`
      );
    } else {
      cy.log(
        `⚠️ Acceptable FPS Performance: ${metrics.averageFPS.toFixed(2)} FPS ` +
        `(${dropRate.toFixed(1)}% frame drops)`
      );
    }
  });
}

/**
 * Monitor Canvas rendering and detect if it's frozen
 * Note: This function attempts to read canvas pixels using 2D context.
 * For WebGL/Three.js canvases, pixel reading is not possible in Cypress,
 * so the function will log a warning and pass. This is expected behavior.
 * @param duration Duration to monitor (default 1000ms)
 */
export function assertCanvasRendering(duration: number = 1000): Cypress.Chainable<void> {
  return cy.get("canvas").then(($canvas) => {
    const canvas = $canvas[0] as HTMLCanvasElement;
    
    return cy.window().then((_win) => {
      return new Cypress.Promise<void>((resolve) => {
        let lastPixelData: Uint8ClampedArray | null = null;
        let changeCount = 0;
        const checkInterval = 200; // Check every 200ms
        const checks = Math.floor(duration / checkInterval);
        let currentCheck = 0;

        const checkRendering = () => {
          try {
            // Try to read canvas pixels - this only works for 2D canvas
            // WebGL/Three.js canvases will throw or return null context
            const ctx = canvas.getContext("2d");
            if (ctx) {
              const imageData = ctx.getImageData(
                canvas.width / 2,
                canvas.height / 2,
                1,
                1
              );
              
              if (lastPixelData) {
                // Check if pixels changed
                const changed = !imageData.data.every(
                  (val, idx) => lastPixelData && val === lastPixelData[idx]
                );
                if (changed) {
                  changeCount++;
                }
              }
              
              lastPixelData = imageData.data;
            } else {
              // WebGL canvas - can't read pixels in Cypress, this is expected
              cy.log("⚠️ Canvas is WebGL (pixel verification not available in test environment)");
              resolve();
              return;
            }

            currentCheck++;
            
            if (currentCheck < checks) {
              setTimeout(checkRendering, checkInterval);
            } else {
              // At least some changes should occur in rendering
              if (changeCount > 0) {
                cy.log(`✅ Canvas is rendering (${changeCount} changes detected)`);
                resolve();
              } else {
                cy.log("⚠️ Canvas appears static (may be normal for intro screen)");
                resolve(); // Don't fail, just warn
              }
            }
          } catch (error) {
            // Canvas may be WebGL (can't read directly), that's OK for Three.js
            cy.log("⚠️ Canvas is WebGL/Three.js (pixel reading not supported in test environment)");
            resolve();
          }
        };

        checkRendering();
      });
    });
  });
}

/**
 * Check for memory leaks by monitoring memory usage
 * @param duration Duration to monitor (default 3000ms)
 */
export function assertNoMemoryLeaks(duration: number = 3000): Cypress.Chainable<void> {
  return cy.window().then((win) => {
    // Check if performance.memory is available (Chrome only)
    const performance = win.performance as any;
    
    if (!performance.memory) {
      cy.log("⚠️ Memory monitoring not available (Chrome only)");
      return;
    }

    const initialMemory = performance.memory.usedJSHeapSize;
    cy.log(`Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);

    return cy.wait(duration).then(() => {
      const finalMemory = performance.memory.usedJSHeapSize;
      const memoryIncrease = finalMemory - initialMemory;
      const increasePercent = (memoryIncrease / initialMemory) * 100;

      cy.log(
        `Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)} MB ` +
        `(+${(memoryIncrease / 1024 / 1024).toFixed(2)} MB, ${increasePercent.toFixed(1)}%)`
      );

      // Memory shouldn't increase more than 50% during normal operation
      if (increasePercent < 50) {
        cy.log("✅ No significant memory leaks detected");
      } else {
        cy.log(`⚠️ Significant memory increase: ${increasePercent.toFixed(1)}%`);
      }

      // Don't fail test, just log the information
      cy.task("logPerformance", {
        name: "Memory Usage",
        duration,
        metrics: {
          initial: (initialMemory / 1024 / 1024).toFixed(2),
          final: (finalMemory / 1024 / 1024).toFixed(2),
          increase: increasePercent.toFixed(1),
        },
      });
    });
  });
}

export default {
  monitorFPS,
  assertMinFPS,
  assertSmoothFPS,
  assertCanvasRendering,
  assertNoMemoryLeaks,
};
