'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - EDITOR TOOLBAR
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Integrated with auto-save
// Top toolbar with undo/redo, device modes, and actions
// ═══════════════════════════════════════════════════════════════

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCanvasStore, useUndo, useRedo } from '@/lib/editor/canvas-store';

interface EditorToolbarProps {
  projectId: string;
  projectName?: string;
  isSaving?: boolean;
  lastSaved?: Date | null;
  saveError?: Error | null;
  onSaveNow?: () => Promise<void>;
}

export function EditorToolbar({
  projectId: _projectId, // Keep for future use (e.g., project-specific settings)
  projectName = 'Untitled Project',
  isSaving = false,
  lastSaved = null,
  saveError = null,
  onSaveNow
}: EditorToolbarProps) {
  const { deviceMode, setDeviceMode, zoom, setZoom } = useCanvasStore();
  const { undo, canUndo } = useUndo();
  const { redo, canRedo } = useRedo();

  const handleSave = async () => {
    if (onSaveNow) {
      await onSaveNow();
    }
  };

  const handlePreview = () => {
    // TODO: Implement preview
    alert('Preview functionality coming soon!');
  };

  // Format last saved time
  const formatLastSaved = (date: Date | null): string => {
    if (!date) return 'Never';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 10) return 'Just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
      {/* Left: Back button and project info */}
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
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
        {/* Auto-save status */}
        <div className="flex flex-col text-xs">
          <span className="text-slate-600">
            {isSaving ? 'Saving...' : `Saved ${formatLastSaved(lastSaved)}`}
          </span>
          {saveError && (
            <span className="text-red-600" title={saveError.message}>
              ⚠️ Save failed
            </span>
          )}
        </div>

        <div className="mx-2 h-6 w-px bg-slate-200" />

        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? '💾 Saving...' : '💾 Save Now'}
        </Button>

        <Button
          size="sm"
          onClick={handlePreview}
          disabled
        >
          Preview
        </Button>

        <Button
          size="sm"
          variant="secondary"
          disabled
        >
          Publish
        </Button>
      </div>
    </div>
  );
}
