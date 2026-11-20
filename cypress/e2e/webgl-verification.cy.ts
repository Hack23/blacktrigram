describe("Training WebGL2 smoke", () => {
  it("renders real WebGL2 frames through a Training round trip", () => {
    const draws = { count: 0 };
    cy.visit("/", {
      onBeforeLoad(win) {
        const prototype = win.WebGL2RenderingContext.prototype;
        const drawElements = prototype.drawElements;
        prototype.drawElements = function (this: WebGL2RenderingContext, ...args: Parameters<typeof drawElements>) {
          drawElements.apply(this, args);
          draws.count += 1;
        };
      },
    });
    cy.get('[data-testid="splash-start-button"]', { timeout: 15000 }).click();
    cy.get('[data-testid="intro-screen"]', { timeout: 15000 }).should("be.visible");
    cy.get("body").type("t");

    cy.get<HTMLCanvasElement>('[data-testid="training-screen-3d"] canvas', { timeout: 15000 }).should(($canvas) => {
      const canvas = $canvas[0];
      const gl = canvas.getContext("webgl2");
      if (!gl) throw new Error("Training did not initialize WebGL2");
      expect(gl.isContextLost()).to.equal(false);
      expect(gl.drawingBufferWidth).to.be.greaterThan(0);
    });
    cy.then(() => {
      const before = draws.count;
      cy.wrap(draws).its("count", { timeout: 15000 }).should("be.greaterThan", before);
    });

    cy.get('[data-testid="training-toggle-targets"]').click()
      .should("have.attr", "aria-pressed", "true");
    cy.get('[data-testid="vital-point-overlay-controls"]').should("be.visible");
    cy.get('[data-testid="training-toggle-targets"]').click()
      .should("have.attr", "aria-pressed", "false");
    cy.get('[data-testid="return-to-menu-button"]').click();
    cy.get('[data-testid="intro-screen"]').should("be.visible");
  });
});
