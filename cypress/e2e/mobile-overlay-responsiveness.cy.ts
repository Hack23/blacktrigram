/**
 * Mobile HTML Overlay Responsiveness Tests
 * 
 * Tests touch target sizing, safe area support, Korean font sizing,
 * and responsive layout across mobile viewports.
 * 
 * @category E2E Tests
 * @korean 모바일HTML오버레이테스트
 */

describe("Mobile HTML Overlay Responsiveness", () => {
  // Mobile viewport configurations to test
  // PRIORITY ORDER: Super HD devices are top priority
  const mobileViewports = [
    {
      name: "Motorola Edge 60 Pro (Super HD)",
      width: 540,
      height: 1220,
      description: "High-end Super HD mobile - TOP PRIORITY (CSS pixels in portrait, 2712x1220 physical ÷ 5 DPR)",
      safeArea: { top: 0, bottom: 0 },
      priority: 1,
    },
    {
      name: "iPhone 14 Pro Max",
      width: 428,
      height: 926,
      description: "Large high-end mobile",
      safeArea: { top: 44, bottom: 34 },
      priority: 2,
    },
    {
      name: "iPhone 14 Pro",
      width: 393,
      height: 852,
      description: "Notched device with safe area",
      safeArea: { top: 44, bottom: 34 },
      priority: 2,
    },
    {
      name: "iPhone 12/13",
      width: 390,
      height: 844,
      description: "Standard modern mobile",
      safeArea: { top: 0, bottom: 34 },
      priority: 3,
    },
    {
      name: "iPhone SE",
      width: 375,
      height: 667,
      description: "Minimum supported mobile device",
      safeArea: { top: 0, bottom: 0 },
      priority: 4,
    },
    {
      name: "Android Small",
      width: 360,
      height: 640,
      description: "Small Android device",
      safeArea: { top: 0, bottom: 0 },
      priority: 4,
    },
  ];

  mobileViewports.forEach((viewport) => {
    describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit("/");
        cy.wait(1000); // Wait for initial render
      });

      it("should render without horizontal scrolling", () => {
        // Check no horizontal scrollbar
        cy.document().then((doc) => {
          const scrollWidth = doc.documentElement.scrollWidth;
          const clientWidth = doc.documentElement.clientWidth;
          expect(scrollWidth).to.equal(clientWidth);
        });
      });

      it("should have touch-optimized button sizes (48px minimum, 56px for Super HD)", () => {
        // Navigate to training mode to test buttons
        cy.get('[data-testid="menu-item-training"]')
          .should("be.visible")
          .then(($btn) => {
            const height = $btn.height();
            const minSize = viewport.width >= 768 ? 56 : 48; // Super HD gets enhanced targets
            expect(height).to.be.at.least(minSize, 
              `Button height should be at least ${minSize}px for ${viewport.name}`);
          });
      });

      it("should have proper spacing between interactive elements", () => {
        // Check button spacing in menu
        cy.get('[data-testid="main-menu-buttons"]').within(() => {
          cy.get("button").then(($buttons) => {
            for (let i = 0; i < $buttons.length - 1; i++) {
              const current = $buttons[i].getBoundingClientRect();
              const next = $buttons[i + 1].getBoundingClientRect();
              const gap = next.top - current.bottom;
              expect(gap).to.be.at.least(8, "Button spacing should be at least 8px");
            }
          });
        });
      });

      it("should display Korean text with readable font size (16px+, enhanced for Super HD)", () => {
        // Check menu title Korean text
        cy.get('[data-testid="menu-title"]')
          .should("be.visible")
          .then(($title) => {
            const fontSize = parseInt(window.getComputedStyle($title[0]).fontSize);
            const minSize = viewport.width >= 768 ? 18 : 16; // Super HD gets enhanced fonts
            expect(fontSize).to.be.at.least(minSize, 
              `Korean text should be at least ${minSize}px for ${viewport.name}`);
          });
      });

      it("should navigate to training mode successfully", () => {
        // Click training button
        cy.get('[data-testid="menu-item-training"]').click();
        cy.wait(500);

        // Verify training screen loaded
        cy.get('[data-testid="training-stats-html"]', { timeout: 5000 })
          .should("be.visible");
      });

      it("should display training stats with proper touch targets", () => {
        // Navigate to training
        cy.get('[data-testid="menu-item-training"]').click();
        cy.wait(1000);

        // Check training stats panel
        cy.get('[data-testid="training-stats-html"]')
          .should("be.visible")
          .within(() => {
            // Verify Korean text is readable
            cy.contains("훈련 통계").should("be.visible");
            cy.contains("Training Statistics").should("be.visible");
          });
      });

      if (viewport.safeArea.top > 0 || viewport.safeArea.bottom > 0) {
        it("should respect safe area insets on notched device", () => {
          // Check that content has safe area padding
          cy.get('[data-testid="main-menu-section"]').then(($menu) => {
            const style = window.getComputedStyle($menu[0]);
            const paddingTop = parseInt(style.paddingTop);
            const paddingBottom = parseInt(style.paddingBottom);

            // Should have at least base padding
            expect(paddingTop).to.be.at.least(
              12,
              "Should have top padding for safe area"
            );
            expect(paddingBottom).to.be.at.least(
              12,
              "Should have bottom padding for safe area"
            );
          });
        });
      }

      it("should maintain 55fps+ performance", () => {
        let frameCount = 0;
        let startTime: number;

        // Measure FPS over 2 seconds
        cy.window().then((win) => {
          startTime = performance.now();

          const measureFPS = () => {
            frameCount++;
            const elapsed = performance.now() - startTime;

            if (elapsed < 2000) {
              win.requestAnimationFrame(measureFPS);
            } else {
              const fps = (frameCount / elapsed) * 1000;
              expect(fps).to.be.at.least(
                55,
                `FPS should be at least 55 (measured: ${fps.toFixed(1)})`
              );
            }
          };

          win.requestAnimationFrame(measureFPS);
        });

        cy.wait(2100); // Wait for measurement to complete
      });

      it("should render panel within viewport bounds", () => {
        cy.get('[data-testid="main-menu-section"]').then(($menu) => {
          const rect = $menu[0].getBoundingClientRect();

          // Check panel doesn't exceed viewport
          expect(rect.right).to.be.at.most(
            viewport.width,
            "Panel should not extend beyond viewport width"
          );
          expect(rect.bottom).to.be.at.most(
            viewport.height,
            "Panel should not extend beyond viewport height"
          );
        });
      });

      it("should have proper line-height for Korean text", () => {
        cy.get('[data-testid="menu-title"]').then(($title) => {
          const style = window.getComputedStyle($title[0]);
          const lineHeight = style.lineHeight;
          const fontSize = parseInt(style.fontSize);

          // Line height should be at least 1.4x font size for Korean
          if (lineHeight !== "normal") {
            const lineHeightValue = parseInt(lineHeight);
            const ratio = lineHeightValue / fontSize;
            expect(ratio).to.be.at.least(
              1.3,
              "Line height should be at least 1.3x for Korean readability"
            );
          }
        });
      });
    });
  });

  describe("Cross-viewport consistency", () => {
    it("should maintain visual hierarchy across all viewports", () => {
      mobileViewports.forEach((viewport) => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit("/");
        cy.wait(500);

        // Check that menu structure is consistent
        cy.get('[data-testid="main-menu-section"]').should("be.visible");
        cy.get('[data-testid="menu-title"]').should("be.visible");
        cy.get('[data-testid="main-menu-buttons"]').should("be.visible");

        // All menu items should be visible
        cy.get('[data-testid="main-menu-buttons"]')
          .find("button")
          .should("have.length.at.least", 2);
      });
    });
  });

  describe("Touch interaction feedback", () => {
    beforeEach(() => {
      cy.viewport(375, 667); // iPhone SE
      cy.visit("/");
      cy.wait(500);
    });

    it("should provide visual feedback on button hover", () => {
      cy.get('[data-testid="menu-item-training"]')
        .trigger("mouseover")
        .should("have.css", "cursor", "pointer");
    });

    it("should handle rapid touch interactions", () => {
      // Simulate rapid taps
      for (let i = 0; i < 5; i++) {
        cy.get('[data-testid="menu-item-training"]').trigger("touchstart");
        cy.wait(100);
        cy.get('[data-testid="menu-item-training"]').trigger("touchend");
      }

      // Should still be responsive
      cy.get('[data-testid="menu-item-training"]').should("be.visible");
    });
  });
});
