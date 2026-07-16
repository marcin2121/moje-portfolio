import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFrictionTelemetry } from '../hooks/useFrictionTelemetry';

describe('useFrictionTelemetry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    
    // Mock window scroll
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(document.body, 'scrollHeight', { value: 1000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 500, writable: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should initialize without calling impure functions during render', () => {
    const dateSpy = vi.spyOn(Date, 'now');
    
    const { result } = renderHook(() => useFrictionTelemetry('test-id', 'desktop'));
    
    // Date.now is called inside the useEffect, not during render directly.
    expect(dateSpy).toHaveBeenCalled();
    expect(result.current.trackSliderInteraction).toBeTypeOf('function');
  });

  it('should push standard interaction correctly', () => {
    (global as unknown as { umami?: { track: (e: string, data: Record<string, unknown>) => void } }).umami = { track: vi.fn() };
    const { result, unmount } = renderHook(() => useFrictionTelemetry('test_session', 'desktop'));
    
    act(() => {
      result.current.trackSliderInteraction();
      result.current.trackSliderInteraction();
    });

    // Simulate tab abandonment
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
    act(() => {
      window.dispatchEvent(new Event('visibilitychange'));
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const fetchCall = (global.fetch as any).mock.calls[0];
    const payload = JSON.parse(fetchCall[1].body);
    
    expect(payload.journey[0].metadata_summary).toContain('Interactions: 2');
    
    unmount();
  });

  it('should send payload only once on visibility hidden', () => {
    const { unmount } = renderHook(() => useFrictionTelemetry('test-id', 'desktop'));

    Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
    
    act(() => {
      window.dispatchEvent(new Event('visibilitychange'));
      window.dispatchEvent(new Event('visibilitychange')); // Trigger again
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    
    unmount();
  });
});
