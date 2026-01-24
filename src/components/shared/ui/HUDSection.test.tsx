/**
 * Tests for HUDSection component
 */

import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HUDSection } from './HUDSection';

describe('HUDSection', () => {
  describe('rendering', () => {
    it('should render children', () => {
      const { getByText } = render(
        <HUDSection>
          <div>Test Content</div>
        </HUDSection>
      );

      expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('should render without title', () => {
      const { getByText, queryByTestId } = render(
        <HUDSection dataTestId="test-section">
          <div>Content</div>
        </HUDSection>
      );

      expect(getByText('Content')).toBeInTheDocument();
      expect(queryByTestId('test-section-title')).not.toBeInTheDocument();
    });

    it('should apply data-testid', () => {
      const { getByTestId } = render(
        <HUDSection dataTestId="test-section">
          <div>Content</div>
        </HUDSection>
      );

      expect(getByTestId('test-section')).toBeInTheDocument();
    });
  });

  describe('bilingual titles', () => {
    it('should render English title only', () => {
      const { getByText } = render(
        <HUDSection title="Statistics">
          <div>Content</div>
        </HUDSection>
      );

      expect(getByText('Statistics')).toBeInTheDocument();
    });

    it('should render Korean title only', () => {
      const { getByText } = render(
        <HUDSection titleKorean="통계">
          <div>Content</div>
        </HUDSection>
      );

      expect(getByText('통계')).toBeInTheDocument();
    });

    it('should render both Korean and English titles with separator', () => {
      const { getByText } = render(
        <HUDSection title="Statistics" titleKorean="통계">
          <div>Content</div>
        </HUDSection>
      );

      expect(getByText('통계')).toBeInTheDocument();
      expect(getByText('Statistics')).toBeInTheDocument();
      expect(getByText('|')).toBeInTheDocument();
    });

    it('should apply title data-testid when provided', () => {
      const { getByTestId } = render(
        <HUDSection title="Test" dataTestId="section">
          <div>Content</div>
        </HUDSection>
      );

      expect(getByTestId('section-title')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('should apply primary variant styles', () => {
      const { container } = render(
        <HUDSection variant="primary">
          <div>Content</div>
        </HUDSection>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.border).toContain('2px solid');
    });

    it('should apply secondary variant styles', () => {
      const { container } = render(
        <HUDSection variant="secondary">
          <div>Content</div>
        </HUDSection>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.border).toContain('2px solid');
    });

    it('should default to primary variant', () => {
      const { container } = render(
        <HUDSection>
          <div>Content</div>
        </HUDSection>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.border).toContain('2px solid');
    });
  });

  describe('styling props', () => {
    it('should apply custom padding', () => {
      const { container } = render(
        <HUDSection padding={20}>
          <div>Content</div>
        </HUDSection>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.padding).toBe('20px');
    });

    it('should apply default padding', () => {
      const { container } = render(
        <HUDSection>
          <div>Content</div>
        </HUDSection>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.padding).toBe('12px');
    });

    it('should apply custom gap', () => {
      const { container } = render(
        <HUDSection gap={16}>
          <div>Content</div>
        </HUDSection>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.gap).toBe('16px');
    });

    it('should apply default gap', () => {
      const { container } = render(
        <HUDSection>
          <div>Content</div>
        </HUDSection>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.gap).toBe('8px');
    });

    it('should merge custom styles', () => {
      const { container } = render(
        <HUDSection style={{ opacity: 0.8, marginTop: '10px' }}>
          <div>Content</div>
        </HUDSection>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.opacity).toBe('0.8');
      expect(element.style.marginTop).toBe('10px');
    });
  });

  describe('pointer events', () => {
    it('should enable pointer events by default', () => {
      const { container } = render(
        <HUDSection>
          <div>Content</div>
        </HUDSection>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.pointerEvents).toBe('auto');
    });

    it('should disable pointer events when pointerEvents is false', () => {
      const { container } = render(
        <HUDSection pointerEvents={false}>
          <div>Content</div>
        </HUDSection>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.pointerEvents).toBe('none');
    });

    it('should enable pointer events when explicitly set to true', () => {
      const { container } = render(
        <HUDSection pointerEvents={true}>
          <div>Content</div>
        </HUDSection>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.pointerEvents).toBe('auto');
    });
  });

  describe('responsive behavior', () => {
    it('should use mobile theme when isMobile is true', () => {
      const { container } = render(
        <HUDSection isMobile={true}>
          <div>Content</div>
        </HUDSection>
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should use desktop theme when isMobile is false', () => {
      const { container } = render(
        <HUDSection isMobile={false}>
          <div>Content</div>
        </HUDSection>
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('common styles', () => {
    it('should apply border-radius', () => {
      const { container } = render(
        <HUDSection>
          <div>Content</div>
        </HUDSection>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.borderRadius).toBe('8px');
    });

    it('should use flex layout', () => {
      const { container } = render(
        <HUDSection>
          <div>Content</div>
        </HUDSection>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.display).toBe('flex');
      expect(element.style.flexDirection).toBe('column');
    });

    it('should apply background color', () => {
      const { container } = render(
        <HUDSection>
          <div>Content</div>
        </HUDSection>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.background).toBeTruthy();
    });
  });

  describe('multiple children', () => {
    it('should render multiple children with gap', () => {
      const { getByText } = render(
        <HUDSection gap={10}>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </HUDSection>
      );

      expect(getByText('Child 1')).toBeInTheDocument();
      expect(getByText('Child 2')).toBeInTheDocument();
      expect(getByText('Child 3')).toBeInTheDocument();
    });
  });
});
