/**
 * Tests for StyledHUDPanel component
 * 
 * Verifies the design system-based HUD panel component
 * with variants, padding, hover effects, and style merging.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StyledHUDPanel } from './StyledHUDPanel';
import { SPACING, BORDER_RADIUS, BORDERS, GRADIENTS, TRANSITIONS } from '../../../types/constants/designSystem';

describe('StyledHUDPanel', () => {
  it('should render children correctly', () => {
    render(
      <StyledHUDPanel>
        <div data-testid="child-content">Test Content</div>
      </StyledHUDPanel>
    );
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply default variant styles', () => {
    const { container } = render(
      <StyledHUDPanel>
        <div>Content</div>
      </StyledHUDPanel>
    );
    
    const panel = container.firstChild as HTMLElement;
    expect(panel).toBeInTheDocument();
    expect(panel.tagName).toBe('DIV');
  });

  it('should apply accent variant styles', () => {
    const { container } = render(
      <StyledHUDPanel variant="accent">
        <div>Content</div>
      </StyledHUDPanel>
    );
    
    const panel = container.firstChild as HTMLElement;
    expect(panel).toBeInTheDocument();
    // Accent variant should have different border
    const style = panel.getAttribute('style');
    expect(style).toBeTruthy();
  });

  it('should apply correct padding from SPACING scale', () => {
    const { container } = render(
      <StyledHUDPanel padding="md">
        <div>Content</div>
      </StyledHUDPanel>
    );
    
    const panel = container.firstChild as HTMLElement;
    const style = panel.getAttribute('style');
    expect(style).toContain(SPACING.md);
  });

  it('should apply different padding levels correctly', () => {
    const { container: containerSm } = render(
      <StyledHUDPanel padding="sm">
        <div>Small Padding</div>
      </StyledHUDPanel>
    );
    
    const { container: containerLg } = render(
      <StyledHUDPanel padding="lg">
        <div>Large Padding</div>
      </StyledHUDPanel>
    );
    
    const panelSm = containerSm.firstChild as HTMLElement;
    const panelLg = containerLg.firstChild as HTMLElement;
    
    expect(panelSm.getAttribute('style')).toContain(SPACING.sm);
    expect(panelLg.getAttribute('style')).toContain(SPACING.lg);
  });

  it('should apply pointerEvents prop correctly', () => {
    const { container: containerNone } = render(
      <StyledHUDPanel pointerEvents="none">
        <div>No Pointer Events</div>
      </StyledHUDPanel>
    );
    
    const { container: containerAll } = render(
      <StyledHUDPanel pointerEvents="all">
        <div>All Pointer Events</div>
      </StyledHUDPanel>
    );
    
    const panelNone = containerNone.firstChild as HTMLElement;
    const panelAll = containerAll.firstChild as HTMLElement;
    
    expect(panelNone.getAttribute('style')).toContain('pointer-events: none');
    expect(panelAll.getAttribute('style')).toContain('pointer-events: all');
  });

  it('should merge custom styles correctly', () => {
    const customStyle: React.CSSProperties = {
      width: '500px',
      height: '300px',
    };
    
    const { container } = render(
      <StyledHUDPanel style={customStyle}>
        <div>Custom Style</div>
      </StyledHUDPanel>
    );
    
    const panel = container.firstChild as HTMLElement;
    const style = panel.getAttribute('style');
    expect(style).toContain('width: 500px');
    expect(style).toContain('height: 300px');
  });

  it('should apply className prop correctly', () => {
    render(
      <StyledHUDPanel className="custom-class">
        <div>Custom Class</div>
      </StyledHUDPanel>
    );
    
    const panel = document.querySelector('.custom-class');
    expect(panel).toBeInTheDocument();
  });

  it('should use design system constants for border radius', () => {
    const { container } = render(
      <StyledHUDPanel>
        <div>Content</div>
      </StyledHUDPanel>
    );
    
    const panel = container.firstChild as HTMLElement;
    const style = panel.getAttribute('style');
    expect(style).toContain(BORDER_RADIUS.md);
  });

  it('should use design system transition constants', () => {
    const { container } = render(
      <StyledHUDPanel>
        <div>Content</div>
      </StyledHUDPanel>
    );
    
    const panel = container.firstChild as HTMLElement;
    const style = panel.getAttribute('style');
    // Should include transitions from TRANSITIONS constant
    expect(style).toContain('transition');
  });

  it('should handle multiple children correctly', () => {
    render(
      <StyledHUDPanel>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </StyledHUDPanel>
    );
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('should render with no children', () => {
    const { container } = render(<StyledHUDPanel />);
    const panel = container.firstChild as HTMLElement;
    expect(panel).toBeInTheDocument();
    expect(panel.children.length).toBe(0);
  });
});
