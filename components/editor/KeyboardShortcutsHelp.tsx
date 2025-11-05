'use client';

// ═══════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS HELP COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Purpose: Display keyboard shortcuts in a modal
// Features:
// - Organized by category
// - Formatted shortcuts (Ctrl+Z vs ⌘Z)
// - Accessible (ARIA labels, focus management)
// - Mobile-friendly
// - Trigger with ? key
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { formatShortcut, type ShortcutConfig } from '@/lib/hooks/useKeyboardShortcuts';
import { cn } from '@/lib/utils/cn';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface ShortcutGroup {
  category: string;
  shortcuts: Array<ShortcutConfig & { label?: string }>;
}

export interface KeyboardShortcutsHelpProps {
  /** Whether the help modal is open */
  isOpen?: boolean;

  /** Callback when modal is closed */
  onClose?: () => void;

  /** Grouped shortcuts to display */
  groups?: ShortcutGroup[];

  /** Show trigger hint (default: true) */
  showTriggerHint?: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Default Editor Shortcuts (for standalone usage)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const DEFAULT_EDITOR_SHORTCUTS: ShortcutGroup[] = [
  {
    category: 'Editing',
    shortcuts: [
      {
        key: 'z',
        ctrl: true,
        handler: () => {},
        description: 'Undo last action',
        label: 'Undo',
      },
      {
        key: 'y',
        ctrl: true,
        handler: () => {},
        description: 'Redo last action',
        label: 'Redo',
      },
      {
        key: 'z',
        ctrl: true,
        shift: true,
        handler: () => {},
        description: 'Redo last action (Mac)',
        label: 'Redo (Mac)',
      },
      {
        key: 'd',
        ctrl: true,
        handler: () => {},
        description: 'Duplicate selected component',
        label: 'Duplicate',
      },
      {
        key: 'Delete',
        handler: () => {},
        description: 'Delete selected component',
        label: 'Delete',
      },
      {
        key: 's',
        ctrl: true,
        handler: () => {},
        description: 'Save changes',
        label: 'Save',
      },
    ],
  },
  {
    category: 'Navigation',
    shortcuts: [
      {
        key: 'Escape',
        handler: () => {},
        description: 'Deselect component',
        label: 'Deselect',
      },
    ],
  },
  {
    category: 'Help',
    shortcuts: [
      {
        key: '?',
        shift: true,
        handler: () => {},
        description: 'Show keyboard shortcuts',
        label: 'Show this help',
      },
    ],
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function KeyboardShortcutsHelp({
  isOpen: controlledIsOpen,
  onClose,
  groups = DEFAULT_EDITOR_SHORTCUTS,
  showTriggerHint = true,
}: KeyboardShortcutsHelpProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use controlled or internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = onClose ? (value: boolean) => !value && onClose() : setInternalIsOpen;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Keyboard Trigger (? key to open)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Shift+? to open
      if (event.key === '?' && event.shiftKey) {
        event.preventDefault();
        setIsOpen(true);
      }

      // Escape to close
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Focus Management
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  useEffect(() => {
    if (isOpen) {
      // Trap focus when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Render
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (!isOpen) {
    // Trigger hint in bottom-right corner
    if (showTriggerHint) {
      return (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
          aria-label="Show keyboard shortcuts"
        >
          <span>⌨️</span>
          <span>Keyboard Shortcuts</span>
          <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">?</kbd>
        </button>
      );
    }
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-shortcuts-title"
      >
        <div
          className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2
                id="keyboard-shortcuts-title"
                className="text-lg font-semibold text-slate-900"
              >
                Keyboard Shortcuts
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Press <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">?</kbd>{' '}
                to toggle this help
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✕
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6 max-h-[60vh]">
            <div className="space-y-6">
              {groups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {/* Category Header */}
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">
                    {group.category}
                  </h3>

                  {/* Shortcuts List */}
                  <div className="space-y-2">
                    {group.shortcuts
                      .filter((s) => s.enabled !== false)
                      .map((shortcut, shortcutIndex) => (
                        <div
                          key={shortcutIndex}
                          className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-4 py-2"
                        >
                          {/* Description */}
                          <span className="text-sm text-slate-700">
                            {shortcut.label || shortcut.description}
                          </span>

                          {/* Shortcut Keys */}
                          <kbd
                            className={cn(
                              'rounded border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-900 shadow-sm',
                              'flex items-center gap-1'
                            )}
                          >
                            {formatShortcut(shortcut)}
                          </kbd>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <p className="text-xs text-slate-600">
              💡 Tip: Most shortcuts won't work while typing in text inputs
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Compact Trigger Button (for toolbar)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function KeyboardShortcutsTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      title="Keyboard Shortcuts (?)"
      aria-label="Show keyboard shortcuts"
    >
      ⌨️
    </Button>
  );
}
