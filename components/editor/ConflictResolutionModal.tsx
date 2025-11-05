'use client';

// ═══════════════════════════════════════════════════════════════
// CONFLICT RESOLUTION MODAL
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Purpose: Resolve conflicts between localStorage and database
// Features:
// - Show conflict details (local vs database component counts)
// - Restore from auto-backup or discard
// - Accessible (ARIA labels, focus management)
// - Mobile-friendly
// ═══════════════════════════════════════════════════════════════

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ConflictResolutionModalProps {
  /** Whether the modal is open */
  isOpen: boolean;

  /** Number of components in localStorage */
  localCount: number;

  /** Number of components in database */
  databaseCount: number;

  /** Callback when user chooses to restore from localStorage */
  onRestore: () => void;

  /** Callback when user chooses to discard localStorage */
  onDiscard: () => void;

  /** Optional callback when modal is closed without action */
  onClose?: () => void;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function ConflictResolutionModal({
  isOpen,
  localCount,
  databaseCount,
  onRestore,
  onDiscard,
  onClose,
}: ConflictResolutionModalProps) {
  if (!isOpen) return null;

  const handleRestore = () => {
    onRestore();
    onClose?.();
  };

  const handleDiscard = () => {
    onDiscard();
    onClose?.();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="conflict-modal-title"
        aria-describedby="conflict-modal-description"
      >
        <div
          className={cn(
            'relative w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl',
            'animate-in fade-in-0 zoom-in-95 duration-200'
          )}
        >
          {/* Header */}
          <div className="flex items-start gap-4 border-b border-slate-200 bg-orange-50 px-6 py-4">
            <div className="flex-shrink-0 rounded-full bg-orange-100 p-3">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2
                id="conflict-modal-title"
                className="text-lg font-semibold text-slate-900"
              >
                Unsaved Changes Detected
              </h2>
              <p
                id="conflict-modal-description"
                className="mt-1 text-sm text-slate-600"
              >
                Your browser has local changes that haven't been saved to the database.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Conflict Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <div className="text-xs font-medium text-slate-500">Local Backup</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">
                    {localCount}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-600">components</div>
                </div>
                <div className="text-slate-400">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <div className="text-xs font-medium text-slate-500">Database</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">
                    {databaseCount}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-600">components</div>
                </div>
                <div className="text-slate-400">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="mt-4 rounded-md bg-blue-50 p-3">
              <div className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs text-blue-900">
                  This usually happens when you refreshed the page before auto-save completed.
                  Choose whether to restore your local changes or use what's in the database.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row-reverse">
            <Button
              onClick={handleRestore}
              className="w-full sm:w-auto"
              aria-label="Restore local changes"
            >
              Restore Local Changes
            </Button>
            <Button
              onClick={handleDiscard}
              variant="outline"
              className="w-full sm:w-auto"
              aria-label="Discard local changes and use database"
            >
              Use Database Version
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
