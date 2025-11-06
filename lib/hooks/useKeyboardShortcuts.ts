// ═══════════════════════════════════════════════════════════════
// GLOBAL KEYBOARD SHORTCUTS HOOK
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - Enterprise-grade keyboard shortcuts system
// Features:
// - Flexible shortcut configuration
// - Edge case handling (text inputs, modals)
// - Prevent default behavior control
// - Enable/disable shortcuts dynamically
// - Cross-platform support (Ctrl/Cmd)
// - TypeScript strict mode compatible
// ═══════════════════════════════════════════════════════════════

import { useEffect, useCallback, useRef } from 'react';
import { logger } from '@/lib/utils/logger';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ShortcutConfig {
  /** Keyboard key (e.g., 'z', 's', 'Delete', 'Escape') */
  key: string;

  /** Require Ctrl (Windows/Linux) or Cmd (Mac) */
  ctrl?: boolean;

  /** Require Shift key */
  shift?: boolean;

  /** Require Alt/Option key */
  alt?: boolean;

  /** Handler function when shortcut is triggered */
  handler: () => void;

  /** Human-readable description for help UI */
  description: string;

  /** Whether this shortcut is enabled (default: true) */
  enabled?: boolean;

  /** Prevent default browser behavior (default: true) */
  preventDefault?: boolean;

  /** Allow shortcut in text inputs (default: false) */
  allowInInput?: boolean;
}

export interface UseKeyboardShortcutsOptions {
  /** List of keyboard shortcuts */
  shortcuts: ShortcutConfig[];

  /** Whether shortcuts are globally enabled (default: true) */
  enabled?: boolean;

  /** Custom function to check if shortcuts should be disabled */
  shouldDisable?: () => boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Hook Implementation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Enterprise-grade keyboard shortcuts hook
 *
 * @example
 * ```typescript
 * useKeyboardShortcuts({
 *   shortcuts: [
 *     {
 *       key: 'z',
 *       ctrl: true,
 *       handler: () => undo(),
 *       description: 'Undo last action',
 *       enabled: canUndo,
 *     },
 *     {
 *       key: 's',
 *       ctrl: true,
 *       handler: () => save(),
 *       description: 'Save changes',
 *     },
 *   ],
 *   enabled: !isModalOpen,
 * });
 * ```
 */
export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
  shouldDisable,
}: UseKeyboardShortcutsOptions): void {
  // Store shortcuts in ref to avoid re-creating event listener
  const shortcutsRef = useRef(shortcuts);

  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Edge Case Detection
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Check if we're currently in a text input context
   */
  const isInTextInput = useCallback((target: EventTarget | null): boolean => {
    if (!target || !(target instanceof HTMLElement)) {
      return false;
    }

    const tagName = target.tagName.toLowerCase();
    const isContentEditable = target.isContentEditable;

    // Check if target is an input element
    const isInput = tagName === 'input' || tagName === 'textarea';

    // Check if target is a select (should also disable shortcuts)
    const isSelect = tagName === 'select';

    return isInput || isSelect || isContentEditable;
  }, []);

  /**
   * Check if we're currently in a modal context
   */
  const isInModal = useCallback((): boolean => {
    // Check for common modal ARIA attributes
    const hasModal = document.querySelector('[role="dialog"],[role="alertdialog"]');
    return !!hasModal;
  }, []);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Shortcut Matching
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Check if keyboard event matches a shortcut configuration
   */
  const matchesShortcut = useCallback(
    (event: KeyboardEvent, config: ShortcutConfig): boolean => {
      // Normalize key for comparison
      const eventKey = event.key.toLowerCase();
      const configKey = config.key.toLowerCase();

      // Check key match
      if (eventKey !== configKey) {
        return false;
      }

      // Check modifiers
      const ctrlMatch = config.ctrl ? (event.ctrlKey || event.metaKey) : true;
      const shiftMatch = config.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = config.alt ? event.altKey : !event.altKey;

      return ctrlMatch && shiftMatch && altMatch;
    },
    []
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Event Handler
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Global disable check
      if (!enabled) {
        return;
      }

      // Custom disable check
      if (shouldDisable && shouldDisable()) {
        return;
      }

      // Check if we're in a text input (unless shortcut explicitly allows it)
      const inTextInput = isInTextInput(event.target);

      // Check if we're in a modal (future use for modal-specific shortcuts)
      // const inModal = isInModal();

      // Iterate through shortcuts to find a match
      for (const shortcut of shortcutsRef.current) {
        // Skip if shortcut is disabled
        if (shortcut.enabled === false) {
          continue;
        }

        // Skip if we're in a text input and shortcut doesn't allow it
        if (inTextInput && !shortcut.allowInInput) {
          continue;
        }

        // Check if event matches this shortcut
        if (matchesShortcut(event, shortcut)) {
          // Prevent default browser behavior (unless disabled)
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }

          // Execute handler
          try {
            shortcut.handler();
            logger.debug(`⌨️ Keyboard shortcut: ${shortcut.description}`);
          } catch (error) {
            console.error('❌ Keyboard shortcut handler failed:', error);
          }

          // Stop processing after first match
          return;
        }
      }
    },
    [enabled, shouldDisable, isInTextInput, isInModal, matchesShortcut]
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Event Listener Setup
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  useEffect(() => {
    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Utility Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Format shortcut for display (e.g., "Ctrl+Z", "Cmd+Shift+S")
 */
export function formatShortcut(config: ShortcutConfig): string {
  const parts: string[] = [];

  // Detect OS for proper modifier display
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  if (config.ctrl) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }

  if (config.shift) {
    parts.push(isMac ? '⇧' : 'Shift');
  }

  if (config.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }

  // Capitalize key for display
  const key = config.key === ' ' ? 'Space' : config.key.charAt(0).toUpperCase() + config.key.slice(1);
  parts.push(key);

  return parts.join('+');
}

/**
 * Get all enabled shortcuts from a list
 */
export function getEnabledShortcuts(shortcuts: ShortcutConfig[]): ShortcutConfig[] {
  return shortcuts.filter((s) => s.enabled !== false);
}

/**
 * Group shortcuts by category (for help UI)
 */
export interface ShortcutGroup {
  category: string;
  shortcuts: ShortcutConfig[];
}

export function groupShortcuts(
  shortcuts: ShortcutConfig[],
  categorizer: (shortcut: ShortcutConfig) => string
): ShortcutGroup[] {
  const groups = new Map<string, ShortcutConfig[]>();

  for (const shortcut of shortcuts) {
    const category = categorizer(shortcut);
    const existing = groups.get(category) || [];
    existing.push(shortcut);
    groups.set(category, existing);
  }

  return Array.from(groups.entries()).map(([category, shortcuts]) => ({
    category,
    shortcuts,
  }));
}
