'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - EDITOR TOOLBAR
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Top toolbar with undo/redo, device modes, and actions
// ═══════════════════════════════════════════════════════════════

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCanvasStore, useUndo, useRedo } from '@/lib/editor/canvas-store';

interface EditorToolbarProps {
  projectId: string;
}

export function EditorToolbar({ projectId }: EditorToolbarProps) {
  const { deviceMode, setDeviceMode, zoom, setZoom } = useCanvasStore();
  const { undo, canUndo } = useUndo();
  const { redo, canRedo } = useRedo();

  const handleSave = async () => {
    // TODO: Implement save functionality
    alert('Save functionality coming soon!');
  };

  const handlePreview = () => {
    // TODO: Implement preview
    alert('Preview functionality coming soon!');
  };

  return (
    <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
      {/* Left: Back button */}
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="sm">
            ← Back to Projects
          </Button>
        </Link>
        <div className="h-6 w-px bg-slate-200" />
        <span className="text-sm font-medium text-slate-700">Project #{projectId}</span>
      </div>

      {/* Center: Tools */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          ↶
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
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
        <Button variant="outline" size="sm" onClick={handlePreview}>
          👁️ Preview
        </Button>
        <Button size="sm" onClick={handleSave}>
          💾 Save
        </Button>
      </div>
    </div>
  );
}
