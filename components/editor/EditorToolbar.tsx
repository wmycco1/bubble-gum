'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - EDITOR TOOLBAR
// ═══════════════════════════════════════════════════════════════
// Version: 3.0.0 - Added keyboard shortcuts help
// Top toolbar with undo/redo, device modes, and actions
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCanvasStore, useUndo, useRedo } from '@/lib/editor/canvas-store';
import { SaveIndicator } from '@/components/editor/SaveIndicator';
import { KeyboardShortcutsHelp } from '@/components/editor/KeyboardShortcutsHelp';
import type { SaveStatus } from '@/lib/hooks/useAutoSave';

interface EditorToolbarProps {
  projectId: string;
  projectName?: string;
  status?: SaveStatus;
  lastSaved?: Date | null;
  saveError?: Error | null;
  retryCount?: number;
  isOnline?: boolean;
  onSaveNow?: () => Promise<void>;
  isAIChatOpen?: boolean;
  onToggleAIChat?: () => void;
}

export function EditorToolbar({
  projectId: _projectId, // Keep for future use (e.g., project-specific settings)
  projectName = 'Untitled Project',
  status = 'idle',
  lastSaved = null,
  saveError = null,
  retryCount = 0,
  isOnline = true,
  onSaveNow,
  isAIChatOpen = false,
  onToggleAIChat
}: EditorToolbarProps) {
  const isSaving = status === 'saving' || status === 'retrying';
  const { deviceMode, setDeviceMode, zoom, setZoom } = useCanvasStore();
  const { undo, canUndo } = useUndo();
  const { redo, canRedo } = useRedo();

  // Keyboard shortcuts help modal state
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  const handleSave = async () => {
    if (onSaveNow) {
      await onSaveNow();
    }
  };

  const handlePreview = () => {
    // TODO: Implement preview
    alert('Preview functionality coming soon!');
  };

  return (
    <>
      {/* Keyboard Shortcuts Help Modal */}
      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
        showTriggerHint={false}
      />

      {/* Floating trigger button (only when modal is closed) */}
      {!showShortcutsHelp && (
        <button
          onClick={() => setShowShortcutsHelp(true)}
          className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
          aria-label="Show keyboard shortcuts"
        >
          <span>⌨️</span>
          <span>Keyboard Shortcuts</span>
          <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">?</kbd>
        </button>
      )}

      <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
        {/* Left: Back button and project info */}
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="sm" aria-label="Back to projects">
              ← Back
            </Button>
          </Link>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">{projectName}</span>
            <span className="text-xs text-slate-600">Editing: Home Page</span>
          </div>
        </div>

      {/* Center: Tools */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => undo()}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          ↶
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => redo()}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          ↷
        </Button>

        <div className="mx-2 h-6 w-px bg-slate-200" />

        {/* Device Mode */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
          <Button
            variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDeviceMode('desktop')}
            title="Desktop"
          >
            🖥️
          </Button>
          <Button
            variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDeviceMode('tablet')}
            title="Tablet"
          >
            📱
          </Button>
          <Button
            variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDeviceMode('mobile')}
            title="Mobile"
          >
            📱
          </Button>
        </div>

        <div className="mx-2 h-6 w-px bg-slate-200" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
            disabled={zoom <= 0.25}
          >
            −
          </Button>
          <span className="w-16 text-center text-sm text-slate-700">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.min(2, zoom + 0.25))}
            disabled={zoom >= 2}
          >
            +
          </Button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Auto-save status with new SaveIndicator component */}
        <SaveIndicator
          status={status}
          lastSavedAt={lastSaved}
          error={saveError?.message}
          retryCount={retryCount}
          isOnline={isOnline}
        />

        <div className="mx-2 h-6 w-px bg-slate-200" />

        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save now (Ctrl+S)"
        >
          💾 Save Now
        </Button>

        <Button
          size="sm"
          variant={isAIChatOpen ? 'default' : 'outline'}
          onClick={onToggleAIChat}
          aria-label="Toggle AI Assistant (Ctrl+K)"
        >
          🤖 AI Assistant
        </Button>

        <Button
          size="sm"
          onClick={handlePreview}
          disabled
          aria-label="Preview site"
        >
          Preview
        </Button>

        <Button
          size="sm"
          variant="secondary"
          disabled
          aria-label="Publish site"
        >
          Publish
        </Button>
      </div>
    </div>
    </>
  );
}
