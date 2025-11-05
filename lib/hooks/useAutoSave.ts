// ═══════════════════════════════════════════════════════════════
// ENTERPRISE-GRADE AUTO-SAVE HOOK
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Production-ready with retry, offline support
// Features:
// - Debounced save with AbortController
// - Retry mechanism with exponential backoff
// - Offline detection and queueing
// - Race condition handling
// - Performance optimized (shallow comparison)
// - TypeScript strict mode compatible
// ═══════════════════════════════════════════════════════════════

import { useEffect, useRef, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline' | 'retrying';

export interface AutoSaveOptions<T> {
  data: T;
  onSave: (data: T, signal: AbortSignal) => Promise<void>;
  debounceMs?: number;        // Default: 10000 (10 sec)
  enabled?: boolean;          // Can be disabled
  maxRetries?: number;        // Default: 3
  retryDelayMs?: number;      // Default: 1000 (1 sec)
  onSaveStart?: () => void;   // Callback when save starts
  onSaveSuccess?: () => void; // Callback on success
  onSaveError?: (error: Error) => void; // Error handler
}

export interface AutoSaveReturn {
  status: SaveStatus;
  lastSaved: Date | null;
  error: Error | null;
  saveNow: () => Promise<void>;
  retryCount: number;
  isOnline: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Hook Implementation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Enterprise-grade auto-save hook with retry and offline support
 *
 * @example
 * ```typescript
 * const { status, lastSaved, saveNow } = useAutoSave({
 *   data: components,
 *   onSave: async (data, signal) => {
 *     await saveToDb(data, { signal });
 *   },
 *   debounceMs: 10000,
 *   enabled: !isEditingText && !isDragging,
 *   maxRetries: 3,
 *   onSaveSuccess: () => console.log('Saved!'),
 *   onSaveError: (error) => console.error('Failed:', error),
 * });
 * ```
 */
export function useAutoSave<T>({
  data,
  onSave,
  debounceMs = 10000,
  enabled = true,
  maxRetries = 3,
  retryDelayMs = 1000,
  onSaveStart,
  onSaveSuccess,
  onSaveError,
}: AutoSaveOptions<T>): AutoSaveReturn {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // State
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Refs for managing save operations
  const abortControllerRef = useRef<AbortController | null>(null);
  const previousDataRef = useRef<T>(data);
  const dataHashRef = useRef<string>('');
  const saveCountRef = useRef(0);
  const queuedSaveRef = useRef<boolean>(false);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Online/Offline Detection
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Network online');
      setIsOnline(true);
      setStatus('idle');

      // Execute queued save
      if (queuedSaveRef.current) {
        console.log('📤 Executing queued save');
        queuedSaveRef.current = false;
        performSaveWithRetry();
      }
    };

    const handleOffline = () => {
      console.log('📡 Network offline');
      setIsOnline(false);
      setStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Shallow Comparison (Performance Optimization)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const hasDataChanged = useCallback((): boolean => {
    const currentHash = JSON.stringify(data);

    if (currentHash === dataHashRef.current) {
      return false;
    }

    dataHashRef.current = currentHash;
    return true;
  }, [data]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Save with Retry Logic
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const performSaveWithRetry = useCallback(async (attempt: number = 0) => {
    // Check if save is needed
    if (!hasDataChanged() && lastSaved !== null) {
      console.log('💾 Auto-save: No changes detected, skipping save');
      setStatus('idle');
      return;
    }

    // Check online status
    if (!isOnline) {
      console.log('📡 Auto-save: Offline, queueing save for later');
      queuedSaveRef.current = true;
      setStatus('offline');
      return;
    }

    // Cancel any existing save operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Update status
    setStatus(attempt > 0 ? 'retrying' : 'saving');
    setRetryCount(attempt);
    setError(null);

    // Call onSaveStart callback
    onSaveStart?.();

    try {
      await onSave(data, abortController.signal);

      // Check if save was aborted
      if (abortController.signal.aborted) {
        console.log('💾 Auto-save: Aborted');
        return;
      }

      // Success!
      const now = new Date();
      setLastSaved(now);
      setStatus('saved');
      setRetryCount(0);
      previousDataRef.current = data;
      saveCountRef.current++;
      queuedSaveRef.current = false;

      console.log(`✅ Auto-save: Saved successfully (#${saveCountRef.current})`);

      // Call onSaveSuccess callback
      onSaveSuccess?.();

      // Auto-transition to idle after 3 seconds
      setTimeout(() => {
        setStatus((prev) => (prev === 'saved' ? 'idle' : prev));
      }, 3000);
    } catch (err) {
      // Handle abort (not an error)
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('💾 Auto-save: Aborted');
        return;
      }

      // Handle error
      const saveError = err instanceof Error ? err : new Error('Save failed');
      console.error('❌ Auto-save: Failed', saveError);

      // Check if we should retry
      if (attempt < maxRetries) {
        const delay = retryDelayMs * Math.pow(2, attempt); // Exponential backoff
        console.log(`🔄 Auto-save: Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);

        setTimeout(() => {
          performSaveWithRetry(attempt + 1);
        }, delay);
      } else {
        // Max retries reached
        setStatus('error');
        setError(saveError);
        setRetryCount(0);

        // Call onSaveError callback
        onSaveError?.(saveError);

        console.error(`❌ Auto-save: Max retries (${maxRetries}) reached, giving up`);
      }
    }
  }, [data, isOnline, lastSaved, hasDataChanged, onSave, onSaveStart, onSaveSuccess, onSaveError, maxRetries, retryDelayMs]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Manual Save (Skip Debounce)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const saveNow = useCallback(async () => {
    console.log('💾 Manual save triggered');
    await performSaveWithRetry(0);
  }, [performSaveWithRetry]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Debounced Auto-Save
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Create debounced save function
  const debouncedSave = useCallback(
    debounce(() => {
      performSaveWithRetry(0);
    }, debounceMs),
    [performSaveWithRetry, debounceMs]
  );

  // Trigger debounced save when data changes
  useEffect(() => {
    if (!enabled) {
      console.log('💾 Auto-save: Disabled');
      return;
    }

    // Trigger debounced save
    debouncedSave();

    // Cleanup
    return () => {
      debouncedSave.cancel();
    };
  }, [data, enabled, debouncedSave]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Cleanup on Unmount
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  useEffect(() => {
    return () => {
      // Cancel any pending save operations
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Cancel debounced save
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Return
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return {
    status,
    lastSaved,
    error,
    saveNow,
    retryCount,
    isOnline,
  };
}
