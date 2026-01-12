describe('IntroScreen Fix Verification', () => {
  it('should render UI overlay immediately on initial load', () => {
    cy.visit('/');
    
    // Wait for IntroScreen to mount
    cy.get('[data-testid="intro-screen"]', { timeout: 10000 }).should('be.visible');
    
    // Verify Canvas is present
    cy.get('canvas').should('exist');
    
    // Verify main UI elements are visible immediately (no delay needed)
    cy.get('[data-testid="main-title-container"]').should('be.visible');
    cy.get('[data-testid="logo-section"]').should('be.visible');
    cy.get('[data-testid="main-logo"]').should('be.visible');
    cy.get('[data-testid="trigram-symbols"]').should('be.visible');
    cy.get('[data-testid="menu-section-container"]').should('be.visible');
    cy.get('[data-testid="archetype-section-container"]').should('be.visible');
    cy.get('[data-testid="intro-footer"]').should('be.visible');
    
    // Take screenshot for verification
    cy.screenshot('intro-screen-fix-verified', { 
      capture: 'viewport',
      overwrite: true 
    });
  });
});
