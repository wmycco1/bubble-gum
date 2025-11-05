// ═══════════════════════════════════════════════════════════════
// AUTO-SAVE HOOK
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Features:
// - Debounced save (configurable delay)
// - Track last saved time
// - Prevent unnecessary saves
// - Error handling
// ═══════════════════════════════════════════════════════════════

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number; // milliseconds
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  error: Error | null;
  saveNow: () => Promise<void>;
}

/**
 * Auto-save hook with debouncing
 *
 * @example
 * const { isSaving, lastSaved, saveNow } = useAutoSave({
 *   data: components,
 *   onSave: async (data) => { await saveToDb(data); },
 *   delay: 10000, // 10 seconds
 * });
 */
export function useAutoSave<T>({
  data,
  onSave,
  delay = 10000,
  enabled = true,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const previousDataRef = useRef<T>(data);
  const saveCountRef = useRef(0);

  /**
   * Perform the save operation
   */
  const performSave = useCallback(async () => {
    if (!enabled) return;

    // Check if data actually changed
    const hasChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current);
    if (!hasChanged && lastSaved !== null) {
      console.log('💾 Auto-save: No changes detected, skipping save');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(data);
      setLastSaved(new Date());
      previousDataRef.current = data;
      saveCountRef.current++;
      console.log(`✅ Auto-save: Saved successfully (#${saveCountRef.current})`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Save failed');
      setError(error);
      console.error('❌ Auto-save: Failed to save', error);
    } finally {
      setIsSaving(false);
    }
  }, [data, onSave, enabled, lastSaved]);

  /**
   * Manual save (skip debounce)
   */
  const saveNow = useCallback(async () => {
    // Clear any pending auto-save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await performSave();
  }, [performSave]);

  /**
   * Auto-save with debouncing
   */
  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      performSave();
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, performSave]);

  return {
    isSaving,
    lastSaved,
    error,
    saveNow,
  };
}
