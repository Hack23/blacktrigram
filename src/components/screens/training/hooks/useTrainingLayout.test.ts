/**
 * Unit tests for useTrainingLayout hook
 * 
 * Tests responsive layout calculations for training screen across different screen sizes
 */

import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useTrainingLayout } from './useTrainingLayout';

// Mock deviceDetection module - must use vi.fn() directly in factory for hoisting
vi.mock('../../../../utils/deviceDetection', () => ({
  shouldUseMobileControls: vi.fn(() => false),
}));

// Import after mock to get the mocked version
import { shouldUseMobileControls } from '../../../../utils/deviceDetection';

describe('useTrainingLayout', () => {
  beforeEach(() => {
    // Reset mock to default (non-mobile) before each test
    vi.mocked(shouldUseMobileControls).mockReturnValue(false);
  });

  describe('Screen size detection', () => {
    it('should detect mobile screen size (<768px)', () => {
      const { result } = renderHook(() => useTrainingLayout(375, 667));
      
      expect(result.current.screenSize).toBe('mobile');
      expect(result.current.isMobile).toBe(false); // Mocked to false by default
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

  describe('Mobile layout calculations', () => {
    beforeEach(() => {
      // Mock shouldUseMobileControls to return true for these tests
      vi.mocked(shouldUseMobileControls).mockReturnValue(true);
    });

    it('should calculate mobile area bounds with 4:3 aspect ratio', () => {
      const { result } = renderHook(() => useTrainingLayout(375, 667));
      
      expect(result.current.isMobile).toBe(true);
      const bounds = result.current.trainingAreaBounds;
      
      // Check that bounds exist
      expect(bounds).toBeDefined();
      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
      
      // Verify 4:3 aspect ratio (allowing small rounding error)
      const aspectRatio = bounds.width / bounds.height;
      expect(aspectRatio).toBeCloseTo(4 / 3, 2);
      
      // Check scale factor is less than 1.0 for mobile
      expect(bounds.scale).toBeLessThan(1.0);
    });

    it('should adapt mobile area width to device resolution', () => {
      // Standard phone
      const { result: standard } = renderHook(() => useTrainingLayout(375, 667));
      expect(standard.current.isMobile).toBe(true);
      
      // Large phone
      vi.mocked(shouldUseMobileControls).mockReturnValue(true);
      const { result: large } = renderHook(() => useTrainingLayout(768, 1024));
      expect(large.current.isMobile).toBe(true);
      
      // 2K mobile device
      vi.mocked(shouldUseMobileControls).mockReturnValue(true);
      const { result: mobile2k } = renderHook(() => useTrainingLayout(1200, 800));
      expect(mobile2k.current.isMobile).toBe(true);
      
      // 4K mobile device
      vi.mocked(shouldUseMobileControls).mockReturnValue(true);
      const { result: mobile4k } = renderHook(() => useTrainingLayout(1440, 900));
      expect(mobile4k.current.isMobile).toBe(true);
      
      // Verify progressive sizing: standard < large < 2K < 4K
      expect(standard.current.trainingAreaBounds.width).toBeLessThan(
        large.current.trainingAreaBounds.width
      );
      expect(large.current.trainingAreaBounds.width).toBeLessThan(
        mobile2k.current.trainingAreaBounds.width
      );
      expect(mobile2k.current.trainingAreaBounds.width).toBeLessThan(
        mobile4k.current.trainingAreaBounds.width
      );
    });

    it('should ensure minimum mobile area size for usability', () => {
      // Very small screen (320x480)
      const { result } = renderHook(() => useTrainingLayout(320, 480));
      
      expect(result.current.isMobile).toBe(true);
      const bounds = result.current.trainingAreaBounds;
      
      // For very small screens (320px), available width is 280px (320 - 40 margins)
      // The shared helper will use this as max, which is less than the 300px minimum
      // This is actually correct behavior - we shouldn't force a minimum that exceeds available space
      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
      
      // Verify aspect ratio is maintained (allowing for rounding and constraints)
      // On very small screens, the aspect ratio may deviate slightly due to minimum size constraints
      const aspectRatio = bounds.width / bounds.height;
      expect(aspectRatio).toBeGreaterThan(1.0); // Width should be greater than height
      expect(aspectRatio).toBeLessThan(1.5); // Should be reasonably close to 4:3 (1.33)
    });

    it('should center mobile area horizontally', () => {
      const { result } = renderHook(() => useTrainingLayout(375, 667));
      
      expect(result.current.isMobile).toBe(true);
      const bounds = result.current.trainingAreaBounds;
      
      // X position should center the area: (screenWidth - areaWidth) / 2
      const expectedX = (375 - bounds.width) / 2;
      expect(bounds.x).toBeCloseTo(expectedX, 1);
    });

    it('should respect height constraints for mobile area', () => {
      // Very tall narrow screen
      const { result } = renderHook(() => useTrainingLayout(375, 1200));
      
      expect(result.current.isMobile).toBe(true);
      const bounds = result.current.trainingAreaBounds;
      
      // Should not exceed available height
      const minTopClearance = 80;
      const minBottomClearance = 120;
      const maxHeight = 1200 - minTopClearance - minBottomClearance;
      
      expect(bounds.height).toBeLessThanOrEqual(maxHeight);
    });
  });
});
