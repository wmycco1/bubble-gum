// ═══════════════════════════════════════════════════════════════
// AUTOSAVE HOOK TESTS
// ═══════════════════════════════════════════════════════════════
// Enterprise-grade tests for useAutoSave hook
// Coverage: Debouncing, Retry, Offline, Abort, Manual Save
// ═══════════════════════════════════════════════════════════════

/**
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAutoSave } from '@/lib/hooks/useAutoSave';
import type { AutoSaveOptions } from '@/lib/hooks/useAutoSave';

describe('useAutoSave', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset navigator.onLine to true
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Debouncing Tests
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('Debouncing', () => {
    it('should debounce saves - 5 rapid changes result in 1 save', async () => {
      const saveFn = vi.fn().mockResolvedValue(undefined);
      const options: AutoSaveOptions<{ count: number }> = {
        data: { count: 0 },
        onSave: saveFn,
        debounceMs: 1000,
        enabled: true,
      };

      const { result, rerender } = renderHook((props) => useAutoSave(props), {
        initialProps: options,
      });

      // Initial status should be idle
      expect(result.current.status).toBe('idle');
      expect(saveFn).not.toHaveBeenCalled();

      // Make 5 rapid changes within debounce window
      act(() => {
        rerender({ ...options, data: { count: 1 } });
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      act(() => {
        rerender({ ...options, data: { count: 2 } });
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      act(() => {
        rerender({ ...options, data: { count: 3 } });
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      act(() => {
        rerender({ ...options, data: { count: 4 } });
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });

      act(() => {
        rerender({ ...options, data: { count: 5 } });
      });

      // Should not have saved yet
      expect(saveFn).not.toHaveBeenCalled();

      // Wait for debounce to complete
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Should have saved only once with the last value
      await waitFor(() => {
        expect(saveFn).toHaveBeenCalledTimes(1);
      });
      expect(saveFn).toHaveBeenCalledWith(
        { count: 5 },
        expect.any(AbortSignal)
      );
    });

    it('should respect custom debounce time', async () => {
      const saveFn = vi.fn().mockResolvedValue(undefined);
      const options: AutoSaveOptions<{ value: string }> = {
        data: { value: 'test' },
        onSave: saveFn,
        debounceMs: 5000, // 5 seconds
        enabled: true,
      };

      renderHook(() => useAutoSave(options));

      expect(saveFn).not.toHaveBeenCalled();

      // Advance 4 seconds - should not save yet
      await act(async () => {
        vi.advanceTimersByTime(4000);
      });
      expect(saveFn).not.toHaveBeenCalled();

      // Advance 1 more second - should save now
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(saveFn).toHaveBeenCalledTimes(1);
      });
    });

    it('should not save when data has not changed', async () => {
      const saveFn = vi.fn().mockResolvedValue(undefined);
      const data = { value: 'test' };
      const options: AutoSaveOptions<{ value: string }> = {
        data,
        onSave: saveFn,
        debounceMs: 1000,
        enabled: true,
      };

      const { rerender } = renderHook((props) => useAutoSave(props), {
        initialProps: options,
      });

      // Wait for initial debounce + save
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(saveFn).toHaveBeenCalledTimes(1);
      });

      // Clear mock
      saveFn.mockClear();

      // Trigger rerender with same data
      act(() => {
        rerender({ ...options, data });
      });

      // Wait for debounce
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Should not save again (no changes)
      expect(saveFn).not.toHaveBeenCalled();
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Retry Logic Tests
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('Retry Logic', () => {
    it('should retry on error with exponential backoff', async () => {
      const saveFn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(undefined); // Third attempt succeeds

      const onSaveError = vi.fn();
      const options: AutoSaveOptions<{ value: string }> = {
        data: { value: 'test' },
        onSave: saveFn,
        debounceMs: 1000,
        enabled: true,
        maxRetries: 3,
        retryDelayMs: 1000,
        onSaveError,
      };

      const { result } = renderHook(() => useAutoSave(options));

      // Initial status
      expect(result.current.status).toBe('idle');

      // Trigger save
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // First attempt fails
      await waitFor(() => {
        expect(result.current.status).toBe('retrying');
      });
      expect(result.current.retryCount).toBe(1);

      // Wait for first retry (1000ms * 2^0 = 1000ms)
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Second attempt fails
      await waitFor(() => {
        expect(result.current.status).toBe('retrying');
      });
      expect(result.current.retryCount).toBe(2);

      // Wait for second retry (1000ms * 2^1 = 2000ms)
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      // Third attempt succeeds
      await waitFor(() => {
        expect(result.current.status).toBe('saved');
      });
      expect(result.current.retryCount).toBe(0);
      expect(saveFn).toHaveBeenCalledTimes(3);
      expect(onSaveError).not.toHaveBeenCalled();
    });

    it('should set error status after max retries', async () => {
      const saveFn = vi.fn().mockRejectedValue(new Error('Persistent error'));
      const onSaveError = vi.fn();
      const options: AutoSaveOptions<{ value: string }> = {
        data: { value: 'test' },
        onSave: saveFn,
        debounceMs: 1000,
        enabled: true,
        maxRetries: 2,
        retryDelayMs: 1000,
        onSaveError,
      };

      const { result } = renderHook(() => useAutoSave(options));

      // Trigger save
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // First attempt fails
      await waitFor(() => {
        expect(result.current.status).toBe('retrying');
      });

      // Wait for first retry
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Second attempt fails
      await waitFor(() => {
        expect(result.current.status).toBe('retrying');
      });

      // Wait for second retry
      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      // Max retries reached - should be error
      await waitFor(() => {
        expect(result.current.status).toBe('error');
      });
      expect(result.current.error).toEqual(new Error('Persistent error'));
      expect(saveFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
      expect(onSaveError).toHaveBeenCalledWith(new Error('Persistent error'));
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // AbortController Tests
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('AbortController', () => {
    it('should cancel save on unmount', async () => {
      const saveFn = vi.fn(
        (_data: { value: string }, signal: AbortSignal): Promise<void> =>
          new Promise((resolve, reject) => {
            signal.addEventListener('abort', () => {
              reject(new Error('AbortError'));
            });
            setTimeout(resolve, 5000);
          })
      );

      const options: AutoSaveOptions<{ value: string }> = {
        data: { value: 'test' },
        onSave: saveFn,
        debounceMs: 1000,
        enabled: true,
      };

      const { unmount } = renderHook(() => useAutoSave(options));

      // Trigger save
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Unmount while save is in progress
      unmount();

      // Verify save was called
      expect(saveFn).toHaveBeenCalled();

      // Verify AbortSignal was aborted
      const signal = saveFn.mock.calls[0]?.[1] as AbortSignal;
      expect(signal?.aborted).toBe(true);
    });

    it('should abort previous save when new save starts', async () => {
      let abortedCount = 0;
      const saveFn = vi.fn(
        (_data: { count: number }, signal: AbortSignal): Promise<void> =>
          new Promise((resolve) => {
            signal.addEventListener('abort', () => {
              abortedCount++;
            });
            setTimeout(resolve, 5000);
          })
      );

      const options: AutoSaveOptions<{ count: number }> = {
        data: { count: 0 },
        onSave: saveFn,
        debounceMs: 1000,
        enabled: true,
      };

      const { rerender } = renderHook((props) => useAutoSave(props), {
        initialProps: options,
      });

      // Trigger first save
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(saveFn).toHaveBeenCalledTimes(1);
      });

      // Trigger second save before first completes
      act(() => {
        rerender({ ...options, data: { count: 1 } });
      });

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(saveFn).toHaveBeenCalledTimes(2);
      });

      // First save should have been aborted
      expect(abortedCount).toBe(1);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Offline Detection Tests
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('Offline Detection', () => {
    it('should queue saves when offline', async () => {
      const saveFn = vi.fn().mockResolvedValue(undefined);
      const options: AutoSaveOptions<{ value: string }> = {
        data: { value: 'test' },
        onSave: saveFn,
        debounceMs: 1000,
        enabled: true,
      };

      const { result } = renderHook(() => useAutoSave(options));

      // Set offline
      act(() => {
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          value: false,
        });
        window.dispatchEvent(new Event('offline'));
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
        expect(result.current.status).toBe('offline');
      });

      // Trigger save while offline
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Should not have saved
      expect(saveFn).not.toHaveBeenCalled();
      expect(result.current.status).toBe('offline');
    });

    it('should execute queued save when coming back online', async () => {
      const saveFn = vi.fn().mockResolvedValue(undefined);
      const options: AutoSaveOptions<{ value: string }> = {
        data: { value: 'test' },
        onSave: saveFn,
        debounceMs: 1000,
        enabled: true,
      };

      const { result } = renderHook(() => useAutoSave(options));

      // Set offline
      act(() => {
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          value: false,
        });
        window.dispatchEvent(new Event('offline'));
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
      });

      // Trigger save while offline
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(saveFn).not.toHaveBeenCalled();

      // Go back online
      act(() => {
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          value: true,
        });
        window.dispatchEvent(new Event('online'));
      });

      await waitFor(() => {
        expect(result.current.isOnline).toBe(true);
      });

      // Queued save should execute
      await waitFor(() => {
        expect(saveFn).toHaveBeenCalled();
      });
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Manual Save Tests
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('Manual Save', () => {
    it('should save immediately when saveNow is called', async () => {
      const saveFn = vi.fn().mockResolvedValue(undefined);
      const options: AutoSaveOptions<{ value: string }> = {
        data: { value: 'test' },
        onSave: saveFn,
        debounceMs: 10000, // Long debounce
        enabled: true,
      };

      const { result } = renderHook(() => useAutoSave(options));

      expect(saveFn).not.toHaveBeenCalled();

      // Call saveNow (should skip debounce)
      await act(async () => {
        await result.current.saveNow();
      });

      // Should have saved immediately
      expect(saveFn).toHaveBeenCalledTimes(1);
      expect(result.current.status).toBe('saved');
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Enabled/Disabled Tests
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('Enabled/Disabled', () => {
    it('should not save when disabled', async () => {
      const saveFn = vi.fn().mockResolvedValue(undefined);
      const options: AutoSaveOptions<{ value: string }> = {
        data: { value: 'test' },
        onSave: saveFn,
        debounceMs: 1000,
        enabled: false,
      };

      renderHook(() => useAutoSave(options));

      // Wait for debounce
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Should not have saved
      expect(saveFn).not.toHaveBeenCalled();
    });

    it('should save when re-enabled', async () => {
      const saveFn = vi.fn().mockResolvedValue(undefined);
      const options: AutoSaveOptions<{ value: string }> = {
        data: { value: 'test' },
        onSave: saveFn,
        debounceMs: 1000,
        enabled: false,
      };

      const { rerender } = renderHook((props) => useAutoSave(props), {
        initialProps: options,
      });

      // Wait for debounce
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(saveFn).not.toHaveBeenCalled();

      // Enable
      act(() => {
        rerender({ ...options, enabled: true });
      });

      // Wait for debounce and all promises
      await act(async () => {
        vi.advanceTimersByTime(1000);
        await Promise.resolve(); // Allow promises to resolve
      });

      // Should have saved
      expect(saveFn).toHaveBeenCalledTimes(1);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Callbacks Tests
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('Callbacks', () => {
    it('should call onSaveStart callback', async () => {
      const saveFn = vi.fn().mockResolvedValue(undefined);
      const onSaveStart = vi.fn();
      const options: AutoSaveOptions<{ value: string }> = {
        data: { value: 'test' },
        onSave: saveFn,
        debounceMs: 1000,
        enabled: true,
        onSaveStart,
      };

      renderHook(() => useAutoSave(options));

      // Trigger save and wait for promises
      await act(async () => {
        vi.advanceTimersByTime(1000);
        await Promise.resolve();
      });

      expect(onSaveStart).toHaveBeenCalled();
    });

    it('should call onSaveSuccess callback', async () => {
      const saveFn = vi.fn().mockResolvedValue(undefined);
      const onSaveSuccess = vi.fn();
      const options: AutoSaveOptions<{ value: string }> = {
        data: { value: 'test' },
        onSave: saveFn,
        debounceMs: 1000,
        enabled: true,
        onSaveSuccess,
      };

      renderHook(() => useAutoSave(options));

      // Trigger save and wait for promises
      await act(async () => {
        vi.advanceTimersByTime(1000);
        await Promise.resolve();
      });

      expect(onSaveSuccess).toHaveBeenCalled();
    });

    it('should call onSaveError callback on failure', async () => {
      const saveFn = vi.fn().mockRejectedValue(new Error('Save failed'));
      const onSaveError = vi.fn();
      const options: AutoSaveOptions<{ value: string }> = {
        data: { value: 'test' },
        onSave: saveFn,
        debounceMs: 1000,
        enabled: true,
        maxRetries: 0, // No retries
        onSaveError,
      };

      renderHook(() => useAutoSave(options));

      // Trigger save and wait for promises
      await act(async () => {
        vi.advanceTimersByTime(1000);
        await Promise.resolve();
      });

      expect(onSaveError).toHaveBeenCalledWith(new Error('Save failed'));
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Status Transitions Tests
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('Status Transitions', () => {
    it('should transition: idle → saving → saved → idle', async () => {
      const saveFn = vi.fn().mockResolvedValue(undefined);
      const options: AutoSaveOptions<{ value: string }> = {
        data: { value: 'test' },
        onSave: saveFn,
        debounceMs: 1000,
        enabled: true,
      };

      const { result } = renderHook(() => useAutoSave(options));

      // Initial state
      expect(result.current.status).toBe('idle');

      // Trigger save and wait for promises
      await act(async () => {
        vi.advanceTimersByTime(1000);
        await Promise.resolve();
      });

      // Should be saved
      expect(result.current.status).toBe('saved');

      // Wait for auto-transition to idle (3 seconds)
      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.status).toBe('idle');
    });

    it('should set lastSaved timestamp', async () => {
      const saveFn = vi.fn().mockResolvedValue(undefined);
      const options: AutoSaveOptions<{ value: string }> = {
        data: { value: 'test' },
        onSave: saveFn,
        debounceMs: 1000,
        enabled: true,
      };

      const { result } = renderHook(() => useAutoSave(options));

      expect(result.current.lastSaved).toBeNull();

      // Trigger save and wait for promises
      await act(async () => {
        vi.advanceTimersByTime(1000);
        await Promise.resolve();
      });

      expect(result.current.lastSaved).toBeInstanceOf(Date);
    });
  });
});
