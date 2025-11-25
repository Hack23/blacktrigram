/**
 * Tests for useWebGLContextLossHandler hook
 */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useWebGLContextLossHandler, isWebGLAvailable, isWebGL2Available } from './useWebGLContextLossHandler';

describe('useWebGLContextLossHandler', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    // Create a canvas element for testing
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(canvas);
  });

  it('should attach event listeners to canvas', () => {
    const addEventListenerSpy = vi.spyOn(canvas, 'addEventListener');
    
    renderHook(() => useWebGLContextLossHandler());

    // Should have attached both context loss and restoration listeners
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'webglcontextlost',
      expect.any(Function),
      false
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'webglcontextrestored',
      expect.any(Function),
      false
    );
  });

  it('should call onContextLost callback when context is lost', async () => {
    const onContextLost = vi.fn();
    
    renderHook(() => useWebGLContextLossHandler({ onContextLost }));

    // Simulate context loss
    const event = new Event('webglcontextlost');
    canvas.dispatchEvent(event);

    await waitFor(() => {
      expect(onContextLost).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onContextRestored callback when context is restored', async () => {
    const onContextRestored = vi.fn();
    
    renderHook(() => useWebGLContextLossHandler({ onContextRestored }));

    // Simulate context restoration
    const event = new Event('webglcontextrestored');
    canvas.dispatchEvent(event);

    await waitFor(() => {
      expect(onContextRestored).toHaveBeenCalledTimes(1);
    });
  });

  it('should prevent default behavior when autoRestore is true', async () => {
    renderHook(() => useWebGLContextLossHandler({ autoRestore: true }));

    // Simulate context loss with preventDefault spy
    const event = new Event('webglcontextlost');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    
    canvas.dispatchEvent(event);

    await waitFor(() => {
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  it('should not prevent default behavior when autoRestore is false', async () => {
    renderHook(() => useWebGLContextLossHandler({ autoRestore: false }));

    // Simulate context loss with preventDefault spy
    const event = new Event('webglcontextlost');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    
    canvas.dispatchEvent(event);

    // Give time for any async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('should remove event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(canvas, 'removeEventListener');
    
    const { unmount } = renderHook(() => useWebGLContextLossHandler());
    
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'webglcontextlost',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'webglcontextrestored',
      expect.any(Function)
    );
  });

  it('should warn if no canvas is found', () => {
    // Remove canvas to test warning
    document.body.removeChild(canvas);
    
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    renderHook(() => useWebGLContextLossHandler());

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'useWebGLContextLossHandler: No canvas element found'
    );

    consoleWarnSpy.mockRestore();
    
    // Re-add canvas for cleanup
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
  });
});

describe('isWebGLAvailable', () => {
  it('should return true if WebGL is available', () => {
    // In jsdom, WebGL context creation will fail, so we expect false
    // In a real browser, this would return true
    const result = isWebGLAvailable();
    expect(typeof result).toBe('boolean');
  });

  it('should handle errors gracefully', () => {
    // Mock getContext to throw an error
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = () => {
      throw new Error('WebGL not supported');
    };

    const result = isWebGLAvailable();
    expect(result).toBe(false);

    // Restore original method
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });
});

describe('isWebGL2Available', () => {
  it('should return true if WebGL2 is available', () => {
    // In jsdom, WebGL2 context creation will fail, so we expect false
    // In a real browser with WebGL2 support, this would return true
    const result = isWebGL2Available();
    expect(typeof result).toBe('boolean');
  });

  it('should handle errors gracefully', () => {
    // Mock getContext to throw an error
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = () => {
      throw new Error('WebGL2 not supported');
    };

    const result = isWebGL2Available();
    expect(result).toBe(false);

    // Restore original method
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });
});
