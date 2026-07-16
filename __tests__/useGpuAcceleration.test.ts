import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';

describe('useGpuAcceleration', () => {
  beforeEach(() => {
    vi.resetModules(); // Ensure we reset the singleton cachedGpuStatus
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true if WebGL is available and not a software renderer', async () => {
    const mockGetContext = vi.fn().mockReturnValue({
      getExtension: vi.fn().mockReturnValue({ UNMASKED_RENDERER_WEBGL: 123 }),
      getParameter: vi.fn().mockReturnValue('NVIDIA GeForce GTX 1080'),
    });
    
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return { getContext: mockGetContext } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    const { useGpuAcceleration } = await import('../hooks/useGpuAcceleration');
    const { result } = renderHook(() => useGpuAcceleration());

    expect(result.current).toBe(true);
    expect(mockGetContext).toHaveBeenCalledWith('webgl', { failIfMajorPerformanceCaveat: true });
  });

  it('should return false if WebGL returns a software renderer', async () => {
    const mockGetContext = vi.fn().mockReturnValue({
      getExtension: vi.fn().mockReturnValue({ UNMASKED_RENDERER_WEBGL: 123 }),
      getParameter: vi.fn().mockReturnValue('SwiftShader Device'),
    });
    
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return { getContext: mockGetContext } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    const { useGpuAcceleration } = await import('../hooks/useGpuAcceleration');
    const { result } = renderHook(() => useGpuAcceleration());

    expect(result.current).toBe(false);
  });

  it('should return false if WebGL context is null', async () => {
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return { getContext: vi.fn().mockReturnValue(null) } as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    const { useGpuAcceleration } = await import('../hooks/useGpuAcceleration');
    const { result } = renderHook(() => useGpuAcceleration());

    expect(result.current).toBe(false);
  });

  it('should catch errors and default to true (GPU detection try/catch block test)', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        throw new Error('Canvas creation failed or security error');
      }
      return originalCreateElement(tagName);
    });

    const { useGpuAcceleration } = await import('../hooks/useGpuAcceleration');
    const { result } = renderHook(() => useGpuAcceleration());

    // Should catch the error, warn, and return true by default
    expect(result.current).toBe(true);
    expect(consoleWarnSpy).toHaveBeenCalledWith('GPU check failed:', expect.any(Error));
  });
});
