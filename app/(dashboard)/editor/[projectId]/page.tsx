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
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { useCanvasStore, useUndo, useRedo } from '@/lib/editor/canvas-store';
import { convertArrayOldToNew, convertArrayNewToOld } from '@/lib/editor/adapter';
import { useAutoSave } from '@/lib/hooks/useAutoSave';

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
  const getComponentById = useCanvasStore((state) => state.getComponentById);

  // Undo/Redo hooks (only for keyboard shortcuts)
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

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Auto-Save Integration (NEW!)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const { isSaving, lastSaved, error: autoSaveError, saveNow } = useAutoSave({
    data: components,
    onSave: async (data) => {
      if (!homepage) {
        console.warn('💾 Auto-save: No homepage found, skipping save');
        return;
      }

      // Convert NEW components to OLD format for DB
      const oldComponents = convertArrayNewToOld(data);

      await updatePageContent.mutateAsync({
        id: homepage.id,
        content: oldComponents,
      });

      console.log('💾 Auto-save: Saved', oldComponents.length, 'components to database');
    },
    delay: 10000, // 10 seconds
    enabled: !!homepage, // Only enable when homepage is available
  });

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
          // Convert DB components to Store components
          const canvasComponents = convertArrayOldToNew(content as any[]);
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
      {/* EditorToolbar - Replaces custom header */}
      <EditorToolbar
        projectId={params.projectId}
        projectName={project.name}
        isSaving={isSaving}
        lastSaved={lastSaved}
        saveError={autoSaveError}
        onSaveNow={saveNow}
      />

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
