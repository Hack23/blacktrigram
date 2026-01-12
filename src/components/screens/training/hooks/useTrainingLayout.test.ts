/**
 * Unit tests for useTrainingLayout hook
 * 
 * Tests responsive layout calculations for training screen across different screen sizes
 */

import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTrainingLayout } from './useTrainingLayout';

// Mock deviceDetection module
vi.mock('../../../../utils/deviceDetection', () => ({
  shouldUseMobileControls: vi.fn(() => false),
}));

describe('useTrainingLayout', () => {
  describe('Screen size detection', () => {
    it('should detect mobile screen size (<768px)', () => {
      const { result } = renderHook(() => useTrainingLayout(375, 667));
      
      expect(result.current.screenSize).toBe('mobile');
      expect(result.current.isMobile).toBe(false); // Mocked to false
    });

    it('should detect tablet screen size (768-1024px)', () => {
      const { result } = renderHook(() => useTrainingLayout(768, 1024));
      
      expect(result.current.screenSize).toBe('tablet');
    });

    it('should detect desktop screen size (1024-1440px)', () => {
      const { result } = renderHook(() => useTrainingLayout(1200, 800));
      
      expect(result.current.screenSize).toBe('desktop');
    });

    it('should detect large screen size (1440-1920px)', () => {
      const { result } = renderHook(() => useTrainingLayout(1680, 1050));
      
      expect(result.current.screenSize).toBe('large');
    });

    it('should detect xlarge screen size (≥1920px)', () => {
      const { result } = renderHook(() => useTrainingLayout(1920, 1080));
      
      expect(result.current.screenSize).toBe('xlarge');
    });
  });

  describe('Layout constants', () => {
    it('should provide layout constants for mobile', () => {
      const { result } = renderHook(() => useTrainingLayout(375, 667));
      
      expect(result.current.layoutConstants).toHaveProperty('padding');
      expect(result.current.layoutConstants).toHaveProperty('headerHeight');
      expect(result.current.layoutConstants).toHaveProperty('contentAreaHeight');
      expect(result.current.layoutConstants).toHaveProperty('buttonHeight');
      expect(result.current.layoutConstants).toHaveProperty('sectionSpacing');
      expect(result.current.layoutConstants).toHaveProperty('controlsHeight');
      expect(result.current.layoutConstants).toHaveProperty('footerHeight');
    });

    it('should provide different values for desktop vs large desktop', () => {
      const { result: desktopResult } = renderHook(() => useTrainingLayout(1200, 800));
      const { result: largeResult } = renderHook(() => useTrainingLayout(1920, 1080));
      
      // Large desktop should have larger values
      expect(largeResult.current.layoutConstants.headerHeight).toBeGreaterThan(
        desktopResult.current.layoutConstants.headerHeight
      );
      expect(largeResult.current.layoutConstants.buttonHeight).toBeGreaterThan(
        desktopResult.current.layoutConstants.buttonHeight
      );
    });
  });

  describe('Training area bounds', () => {
    it('should provide training area bounds', () => {
      const { result } = renderHook(() => useTrainingLayout(1200, 800));
      
      expect(result.current.trainingAreaBounds).toHaveProperty('x');
      expect(result.current.trainingAreaBounds).toHaveProperty('y');
      expect(result.current.trainingAreaBounds).toHaveProperty('width');
      expect(result.current.trainingAreaBounds).toHaveProperty('height');
      expect(result.current.trainingAreaBounds).toHaveProperty('scale');
    });

    it('should calculate training area bounds for 1920x1080 (primary desktop)', () => {
      const { result } = renderHook(() => useTrainingLayout(1920, 1080));
      
      const bounds = result.current.trainingAreaBounds;
      
      // Desktop uses 80% width
      expect(bounds.width).toBe(1920 * 0.8);
      expect(bounds.x).toBe(1920 * 0.1);
      expect(bounds.scale).toBe(1.0); // Desktop full scale
    });

    it('should calculate training area bounds for 1366x768 (secondary desktop)', () => {
      const { result } = renderHook(() => useTrainingLayout(1366, 768));
      
      const bounds = result.current.trainingAreaBounds;
      
      // Desktop uses 80% width
      expect(bounds.width).toBe(1366 * 0.8);
      expect(bounds.scale).toBe(1.0); // Desktop full scale
    });

    it('should maintain consistent scaling for desktop screens', () => {
      const { result: result1 } = renderHook(() => useTrainingLayout(1200, 800));
      const { result: result2 } = renderHook(() => useTrainingLayout(1920, 1080));
      const { result: result3 } = renderHook(() => useTrainingLayout(3840, 2160));
      
      // All desktop/large screens should use scale 1.0
      expect(result1.current.trainingAreaBounds.scale).toBe(1.0);
      expect(result2.current.trainingAreaBounds.scale).toBe(1.0);
      expect(result3.current.trainingAreaBounds.scale).toBe(1.0);
    });
  });

  describe('Responsive behavior', () => {
    it('should adapt content area height based on screen height', () => {
      const { result: shortScreen } = renderHook(() => useTrainingLayout(1920, 800));
      const { result: tallScreen } = renderHook(() => useTrainingLayout(1920, 1200));
      
      // Taller screen should have more content area height
      expect(tallScreen.current.trainingAreaBounds.height).toBeGreaterThan(
        shortScreen.current.trainingAreaBounds.height
      );
    });

    it('should recalculate when dimensions change', () => {
      const { result, rerender } = renderHook(
        ({ width, height }) => useTrainingLayout(width, height),
        { initialProps: { width: 1200, height: 800 } }
      );
      
      const initialBounds = result.current.trainingAreaBounds;
      
      // Change dimensions
      rerender({ width: 1920, height: 1080 });
      
      const newBounds = result.current.trainingAreaBounds;
      
      // Bounds should be different
      expect(newBounds.width).not.toBe(initialBounds.width);
      expect(newBounds.height).not.toBe(initialBounds.height);
    });
  });

  describe('Integration with ResponsiveScaling system', () => {
    it('should use centralized screen size detection', () => {
      // Test that hook properly categorizes standard desktop resolutions
      const resolutions = [
        { width: 1920, height: 1080, expectedSize: 'xlarge' }, // Full HD
        { width: 1366, height: 768, expectedSize: 'desktop' }, // HD
        { width: 1680, height: 1050, expectedSize: 'large' }, // WSXGA+
      ];
      
      resolutions.forEach(({ width, height, expectedSize }) => {
        const { result } = renderHook(() => useTrainingLayout(width, height));
        expect(result.current.screenSize).toBe(expectedSize);
      });
    });
  });
});
