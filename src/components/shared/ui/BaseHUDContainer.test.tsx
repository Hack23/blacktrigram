/**
 * Tests for BaseHUDContainer component
 */

import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BaseHUDContainer } from './BaseHUDContainer';

describe('BaseHUDContainer', () => {
  describe('rendering', () => {
    it('should render children', () => {
      const { getByText } = render(
        <BaseHUDContainer position="left" width={300} height={800}>
          <div>Test Content</div>
        </BaseHUDContainer>
      );

      expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply data-testid', () => {
      const { getByTestId } = render(
        <BaseHUDContainer
          position="left"
          width={300}
          height={800}
          dataTestId="test-hud"
        >
          <div>Content</div>
        </BaseHUDContainer>
      );

      expect(getByTestId('test-hud')).toBeInTheDocument();
    });
  });

  describe('left position', () => {
    it('should apply left position styles', () => {
      const { container } = render(
        <BaseHUDContainer position="left" width={300} height={800} topOffset={70}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.position).toBe('absolute');
      expect(element.style.left).toBe('0px');
      expect(element.style.top).toBe('70px');
      expect(element.style.width).toBe('300px');
      expect(element.style.height).toBe('800px');
    });

    it('should apply right border for left position', () => {
      const { container } = render(
        <BaseHUDContainer position="left" width={300} height={800}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.borderRight).toContain('2px solid');
    });

    it('should apply left-to-right gradient', () => {
      const { container } = render(
        <BaseHUDContainer position="left" width={300} height={800}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.background).toContain('linear-gradient(90deg');
    });
  });

  describe('right position', () => {
    it('should apply right position styles', () => {
      const { container } = render(
        <BaseHUDContainer position="right" width={300} height={800} topOffset={70}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.position).toBe('absolute');
      expect(element.style.right).toBe('0px');
      expect(element.style.top).toBe('70px');
      expect(element.style.width).toBe('300px');
      expect(element.style.height).toBe('800px');
    });

    it('should apply left border for right position', () => {
      const { container } = render(
        <BaseHUDContainer position="right" width={300} height={800}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.borderLeft).toContain('2px solid');
    });

    it('should apply right-to-left gradient', () => {
      const { container } = render(
        <BaseHUDContainer position="right" width={300} height={800}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.background).toContain('linear-gradient(270deg');
    });
  });

  describe('top position', () => {
    it('should apply top position styles', () => {
      const { container } = render(
        <BaseHUDContainer position="top" width={1920} height={70}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.position).toBe('absolute');
      expect(element.style.top).toBe('0px');
      expect(element.style.left).toBe('0px');
      expect(element.style.width).toBe('100%');
      expect(element.style.height).toBe('70px');
    });

    it('should apply bottom border for top position', () => {
      const { container } = render(
        <BaseHUDContainer position="top" width={1920} height={70}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.borderBottom).toContain('2px solid');
    });

    it('should use row flex direction for top position', () => {
      const { container } = render(
        <BaseHUDContainer position="top" width={1920} height={70}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.flexDirection).toBe('row');
    });
  });

  describe('bottom position', () => {
    it('should apply bottom position styles', () => {
      const { container } = render(
        <BaseHUDContainer position="bottom" width={1920} height={130}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.position).toBe('absolute');
      expect(element.style.bottom).toBe('0px');
      expect(element.style.left).toBe('0px');
      expect(element.style.width).toBe('100%');
      expect(element.style.height).toBe('130px');
    });

    it('should apply top border for bottom position', () => {
      const { container } = render(
        <BaseHUDContainer position="bottom" width={1920} height={130}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.borderTop).toContain('2px solid');
    });
  });

  describe('styling props', () => {
    it('should apply custom padding', () => {
      const { container } = render(
        <BaseHUDContainer position="left" width={300} height={800} padding={20}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.padding).toBe('20px');
    });

    it('should apply custom gap', () => {
      const { container } = render(
        <BaseHUDContainer position="left" width={300} height={800} gap={16}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.gap).toBe('16px');
    });

    it('should apply custom zIndex', () => {
      const { container } = render(
        <BaseHUDContainer position="left" width={300} height={800} zIndex={100}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.zIndex).toBe('100');
    });

    it('should merge custom styles', () => {
      const { container } = render(
        <BaseHUDContainer
          position="left"
          width={300}
          height={800}
          style={{ opacity: 0.5, border: '5px solid red' }}
        >
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.opacity).toBe('0.5');
      expect(element.style.border).toBe('5px solid red');
    });
  });

  describe('responsive behavior', () => {
    it('should use mobile theme when isMobile is true', () => {
      const { container } = render(
        <BaseHUDContainer position="left" width={300} height={800} isMobile={true}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should use desktop theme when isMobile is false', () => {
      const { container } = render(
        <BaseHUDContainer position="left" width={300} height={800} isMobile={false}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('common styles', () => {
    it('should apply backdrop blur', () => {
      const { container } = render(
        <BaseHUDContainer position="left" width={300} height={800}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.backdropFilter).toBe('blur(8px)');
    });

    it('should disable pointer events by default', () => {
      const { container } = render(
        <BaseHUDContainer position="left" width={300} height={800}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.pointerEvents).toBe('none');
    });

    it('should use box-sizing border-box', () => {
      const { container } = render(
        <BaseHUDContainer position="left" width={300} height={800}>
          <div>Content</div>
        </BaseHUDContainer>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.boxSizing).toBe('border-box');
    });
  });
});
