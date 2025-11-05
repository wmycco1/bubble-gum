'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - EDITOR PAGE (MIGRATED TO CANVAS-STORE)
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Migrated to Zustand canvas-store
// Changes:
// - Removed ALL local useState (components, selectedId, deviceMode, zoom)
// - Using canvas-store for state management
// - Enabled Undo/Redo functionality
// - Added keyboard shortcuts (Ctrl+Z, Ctrl+Y, Delete)
// - Using type adapter for OLD/NEW component compatibility
// ═══════════════════════════════════════════════════════════════

import { use, useEffect, useCallback, useMemo } from 'react';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Canvas } from '@/components/editor/Canvas';
import { ComponentPalette } from '@/components/editor/ComponentPalette';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { useCanvasStore, useUndo, useRedo } from '@/lib/editor/canvas-store';
import { convertArrayOldToNew, convertArrayNewToOld } from '@/lib/editor/adapter';
import type { PageComponent } from '@/types/components';

interface EditorPageProps {
  params: Promise<{ projectId: string }>;
}

export default function EditorPage(props: EditorPageProps) {
  const params = use(props.params);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Canvas Store Integration (NEW!)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Selective subscriptions for optimal performance
  const components = useCanvasStore((state) => state.components);
  const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);
  const deviceMode = useCanvasStore((state) => state.deviceMode);
  const zoom = useCanvasStore((state) => state.zoom);

  // Actions
  const loadComponents = useCanvasStore((state) => state.loadComponents);
  const updateComponentProps = useCanvasStore((state) => state.updateComponentProps);
  const deleteComponent = useCanvasStore((state) => state.deleteComponent);
  const moveComponent = useCanvasStore((state) => state.moveComponent);
  const selectComponent = useCanvasStore((state) => state.selectComponent);
  const setDeviceMode = useCanvasStore((state) => state.setDeviceMode);
  const setZoom = useCanvasStore((state) => state.setZoom);
  const getComponentById = useCanvasStore((state) => state.getComponentById);

  // Undo/Redo hooks
  const { undo, canUndo } = useUndo();
  const { redo, canRedo } = useRedo();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Data Fetching
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const { data: project, isLoading: projectLoading } = trpc.project.getById.useQuery({
    id: params.projectId,
  });

  const updatePageContent = trpc.page.updateContent.useMutation();

  const homepage = project?.pages.find((p) => p.slug === 'index');

  // Load page content from DB when homepage is available
  useEffect(() => {
    if (homepage?.content && components.length === 0) {
      try {
        const content = Array.isArray(homepage.content)
          ? homepage.content
          : typeof homepage.content === 'string'
            ? JSON.parse(homepage.content)
            : [];

        if (content.length > 0) {
          console.log('📥 Loading components from DB:', content);
          // Convert OLD PageComponents to NEW CanvasComponents
          const canvasComponents = convertArrayOldToNew(content as PageComponent[]);
          loadComponents(canvasComponents);
          console.log('✅ Loaded', canvasComponents.length, 'components into canvas-store');
        }
      } catch (error) {
        console.error('❌ Failed to parse homepage content:', error);
      }
    }
  }, [homepage?.content, components.length, loadComponents]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Keyboard Shortcuts (NEW!)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z (Windows/Linux) or Cmd+Z (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey && canUndo) {
        e.preventDefault();
        undo();
        console.log('⎌ Undo');
        return;
      }

      // Redo: Ctrl+Y (Windows/Linux) or Cmd+Shift+Z (Mac)
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        if (canRedo) {
          e.preventDefault();
          redo();
          console.log('⎌ Redo');
        }
        return;
      }

      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentId) {
        // Don't delete if user is typing in an input
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }

        e.preventDefault();
        deleteComponent(selectedComponentId);
        console.log('🗑️ Deleted component:', selectedComponentId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, selectedComponentId, undo, redo, deleteComponent]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Handlers
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Save current state to database
   * Converts NEW CanvasComponents back to OLD PageComponents for DB compatibility
   */
  const handleSave = useCallback(async () => {
    if (!homepage) return;

    try {
      // Convert NEW components to OLD format for DB
      const oldComponents = convertArrayNewToOld(components);

      await updatePageContent.mutateAsync({
        id: homepage.id,
        content: oldComponents,
      });

      console.log('💾 Saved', oldComponents.length, 'components to database');
    } catch (error) {
      console.error('❌ Save failed:', error);
    }
  }, [homepage, components, updatePageContent]);

  /**
   * Handle component property updates from PropertiesPanel
   */
  const handleUpdateComponent = useCallback(
    (id: string, props: Record<string, unknown>) => {
      updateComponentProps(id, props);
    },
    [updateComponentProps]
  );

  /**
   * Handle component drag & drop reordering
   */
  const handleMoveComponent = useCallback(
    (fromIndex: number, toIndex: number) => {
      const fromComponent = components[fromIndex];
      if (!fromComponent) return;

      moveComponent(fromComponent.id, null, toIndex);
    },
    [components, moveComponent]
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Computed Values
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const selectedComponent = useMemo(() => {
    return selectedComponentId ? getComponentById(selectedComponentId) : undefined;
  }, [selectedComponentId, getComponentById]);

  // Device width mapping
  const deviceWidth = useMemo(() => {
    switch (deviceMode) {
      case 'desktop':
        return '1440px';
      case 'tablet':
        return '768px';
      case 'mobile':
        return '375px';
      default:
        return '1440px';
    }
  }, [deviceMode]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Debug Logging
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  useEffect(() => {
    console.log('📊 EditorPage State:', {
      componentsCount: components.length,
      selectedComponentId,
      selectedComponent: selectedComponent?.type,
      deviceMode,
      zoom,
      canUndo,
      canRedo,
    });
  }, [components.length, selectedComponentId, selectedComponent, deviceMode, zoom, canUndo, canRedo]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Loading & Error States
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (projectLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-900 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Project not found</h2>
          <Link href="/projects" className="mt-4 inline-block">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Render
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Header with Toolbar */}
      <header className="border-b border-slate-200 bg-white">
        {/* Top bar - Project info and actions */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                ← Back
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">{project.name}</h1>
              <p className="text-sm text-slate-600">Editing: Home Page</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => undo()}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              ↶ Undo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => redo()}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
            >
              ↷ Redo
            </Button>

            <div className="mx-2 h-6 w-px bg-slate-200" />

            {/* Save */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={updatePageContent.isPending}
            >
              {updatePageContent.isPending ? 'Saving...' : '💾 Save'}
            </Button>

            {/* Future actions */}
            <Button size="sm" disabled>
              Preview
            </Button>
            <Button size="sm" variant="secondary" disabled>
              Publish
            </Button>
          </div>
        </div>

        {/* Toolbar - Device modes and zoom */}
        <div className="flex items-center justify-center gap-4 border-t border-slate-100 px-6 py-2">
          {/* Device Mode */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
            <Button
              variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceMode('desktop')}
              title="Desktop (1440px)"
              className="h-8"
            >
              🖥️ Desktop
            </Button>
            <Button
              variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceMode('tablet')}
              title="Tablet (768px)"
              className="h-8"
            >
              📱 Tablet
            </Button>
            <Button
              variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceMode('mobile')}
              title="Mobile (375px)"
              className="h-8"
            >
              📱 Mobile
            </Button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              disabled={zoom <= 0.5}
              className="h-8 w-8 p-0"
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
              className="h-8 w-8 p-0"
            >
              +
            </Button>
          </div>

          {/* Status indicators */}
          <div className="ml-4 flex items-center gap-2 text-xs text-slate-600">
            {canUndo && <span title="History available">📝 {components.length} components</span>}
          </div>
        </div>
      </header>

      {/* Editor Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Component Palette - Left Sidebar */}
        <div className="w-64 border-r border-slate-200 bg-white overflow-y-auto">
          <ComponentPalette />
        </div>

        {/* Canvas - Center */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100">
          <div className="flex items-center justify-center min-h-full">
            <div
              className="transition-all duration-200"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                width: deviceWidth,
                maxWidth: '100%',
              }}
            >
              <Canvas
                components={components}
                selectedId={selectedComponentId}
                onSelectComponent={selectComponent}
                onDeleteComponent={deleteComponent}
                onMoveComponent={handleMoveComponent}
              />
            </div>
          </div>
        </div>

        {/* Properties Panel - Right Sidebar */}
        <div className="w-80 border-l border-slate-200 bg-white overflow-y-auto">
          <PropertiesPanel
            component={selectedComponent}
            onUpdate={(props) => {
              if (selectedComponentId) {
                handleUpdateComponent(selectedComponentId, props);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
