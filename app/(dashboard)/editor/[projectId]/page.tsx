'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - EDITOR PAGE (MIGRATED TO CANVAS-STORE)
// ═══════════════════════════════════════════════════════════════
// Version: 3.0.0 - Added keyboard shortcuts with visual feedback
// Changes:
// - Removed ALL local useState (components, selectedId, deviceMode, zoom)
// - Using canvas-store for state management
// - Enabled Undo/Redo functionality
// - Added keyboard shortcuts hook (Ctrl+Z, Ctrl+Y, Delete, Ctrl+D, Ctrl+S, Escape)
// - Using type adapter for OLD/NEW component compatibility
// - Added toast notifications for user feedback
// ═══════════════════════════════════════════════════════════════

import { use, useEffect, useCallback, useMemo, useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Canvas } from '@/components/editor/Canvas';
import { ComponentPalette } from '@/components/editor/ComponentPalette';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { ConflictResolutionModal } from '@/components/editor/ConflictResolutionModal';
import { AIChat } from '@/components/editor/AIChat';
import { DragDropContextProvider } from '@/components/editor/DragDropContext';
import { ResizablePanel } from '@/components/editor/ResizablePanel';
import {
  useCanvasStore,
  useUndo,
  useRedo,
  hasLocalStorageConflict,
  getPersistedCanvasState,
} from '@/lib/editor/canvas-store';
// Adapter removed - all data now in atomic component format
import { useAutoSave } from '@/lib/hooks/useAutoSave';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import toast, { Toaster } from 'react-hot-toast';
import { logger } from '@/lib/utils/logger';

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
  // Conflict Resolution State
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictResolved, setConflictResolved] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

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

  // Smart save detection (disable during drag operations)
  const isDragging = useCanvasStore((state) => state.isDragging);

  const { status, lastSaved, error: autoSaveError, saveNow, retryCount, isOnline } = useAutoSave({
    data: components,
    onSave: async (data, signal) => {
      if (!homepage) {
        console.warn('💾 Auto-save: No homepage found, skipping save');
        return;
      }

      // Save components directly (no conversion needed - DB accepts JSON)
      // Note: We used to convert to OLD format, but that filtered out new component types
      // The database content field is JSONB and can store any component type

      // Note: tRPC doesn't support AbortSignal directly, but we track it
      if (signal.aborted) {
        throw new Error('Save aborted');
      }

      await updatePageContent.mutateAsync({
        id: homepage.id,
        content: data as unknown[], // Save components in native format
      });

      logger.debug(`💾 Auto-save: Saved ${data.length} components to database`);
    },
    debounceMs: 10000, // 10 seconds
    enabled: !!homepage && !isDragging, // Disable during drag operations
    maxRetries: 3,
    retryDelayMs: 1000,
    onSaveSuccess: () => {
      logger.debug('✅ Auto-save: Success callback');
    },
    onSaveError: (error) => {
      console.error('❌ Auto-save: Error callback', error);
    },
  });

  // Load page content from DB when homepage is available
  // V7.8 FIX: Database is authoritative source, always overwrites localStorage
  useEffect(() => {
    // Wait for persist hydration to complete before loading from DB
    // This ensures we load DB data AFTER localStorage, so DB overwrites localStorage
    const hasHydrated = useCanvasStore.getState()._hasHydrated;

    if (!hasHydrated) {
      logger.debug('⏳ Waiting for persist hydration to complete before loading from DB');
      return;
    }

    // Skip if no DB content or already resolved
    if (!homepage?.content || conflictResolved) {
      return;
    }

    // REMOVED: components.length > 0 check
    // Reason: Database should ALWAYS overwrite localStorage (DB is source of truth)
    // Old buggy code: if (!homepage?.content || components.length > 0 || conflictResolved)
    // This caused localStorage data to persist even when DB had different data

    try {
      const content = Array.isArray(homepage.content)
        ? homepage.content
        : typeof homepage.content === 'string'
          ? JSON.parse(homepage.content)
          : [];

      // Detect format: NEW format has 'style' property, OLD format has specific DB shape
      // All data is now in atomic component format (adapters removed)
      const loadedComponents = content.length > 0 ? content : [];
      if (loadedComponents.length > 0) {
        logger.debug('📥 Loading components from DB', { count: loadedComponents.length });
      }

      // Check for localStorage conflict
      const hasConflict = hasLocalStorageConflict(loadedComponents);

      if (hasConflict && !conflictResolved) {
        console.warn('⚠️ Conflict detected, showing modal');
        setShowConflictModal(true);
        return;
      }

      // No conflict, load from database
      if (loadedComponents.length > 0) {
        loadComponents(loadedComponents);
        logger.debug(`✅ Loaded ${loadedComponents.length} components into canvas-store`);
        setConflictResolved(true);
      }
    } catch (error) {
      console.error('❌ Failed to parse homepage content:', error);
    }
  }, [homepage?.content, loadComponents, conflictResolved]);
  // REMOVED: components.length from dependencies (would cause infinite loop)
  // Only re-run when DB content changes (homepage.content) or conflict is resolved

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Keyboard Shortcuts (Using useKeyboardShortcuts hook)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  useKeyboardShortcuts({
    shortcuts: [
      // Undo
      {
        key: 'z',
        ctrl: true,
        handler: () => {
          undo();
          toast.success('Undone', { duration: 1500, icon: '↶' });
        },
        description: 'Undo last action',
        enabled: canUndo,
      },
      // Redo (Ctrl+Y)
      {
        key: 'y',
        ctrl: true,
        handler: () => {
          redo();
          toast.success('Redone', { duration: 1500, icon: '↷' });
        },
        description: 'Redo last action',
        enabled: canRedo,
      },
      // Redo (Ctrl+Shift+Z for Mac users)
      {
        key: 'z',
        ctrl: true,
        shift: true,
        handler: () => {
          redo();
          toast.success('Redone', { duration: 1500, icon: '↷' });
        },
        description: 'Redo last action',
        enabled: canRedo,
      },
      // Delete component
      {
        key: 'Delete',
        handler: () => {
          if (selectedComponentId) {
            const component = getComponentById(selectedComponentId);
            deleteComponent(selectedComponentId);
            toast.success(`Deleted ${component?.type || 'component'}`, {
              duration: 2000,
              icon: '🗑️',
            });
          }
        },
        description: 'Delete selected component',
        enabled: !!selectedComponentId,
      },
      // Delete component (Backspace alternative)
      {
        key: 'Backspace',
        handler: () => {
          if (selectedComponentId) {
            const component = getComponentById(selectedComponentId);
            deleteComponent(selectedComponentId);
            toast.success(`Deleted ${component?.type || 'component'}`, {
              duration: 2000,
              icon: '🗑️',
            });
          }
        },
        description: 'Delete selected component',
        enabled: !!selectedComponentId,
      },
      // Duplicate component
      {
        key: 'd',
        ctrl: true,
        handler: () => {
          if (selectedComponentId) {
            const component = getComponentById(selectedComponentId);
            if (component) {
              // Use duplicateComponent action from store
              useCanvasStore.getState().duplicateComponent(selectedComponentId);
              toast.success(`Duplicated ${component.type}`, {
                duration: 2000,
                icon: '📋',
              });
            }
          }
        },
        description: 'Duplicate selected component',
        enabled: !!selectedComponentId,
      },
      // Save
      {
        key: 's',
        ctrl: true,
        handler: () => {
          saveNow();
          toast.promise(
            saveNow(),
            {
              loading: 'Saving...',
              success: 'Saved successfully!',
              error: 'Failed to save',
            },
            { duration: 2000 }
          );
        },
        description: 'Save changes',
      },
      // Toggle AI Chat
      {
        key: 'k',
        ctrl: true,
        handler: () => {
          setIsAIChatOpen((prev) => !prev);
          toast(isAIChatOpen ? 'AI Chat closed' : 'AI Chat opened', {
            duration: 1000,
            icon: '🤖',
          });
        },
        description: 'Toggle AI Assistant',
      },
      // Deselect
      {
        key: 'Escape',
        handler: () => {
          if (selectedComponentId) {
            selectComponent(null);
            toast('Deselected', { duration: 1000, icon: '✓' });
          }
        },
        description: 'Deselect component',
        enabled: !!selectedComponentId,
      },
    ],
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Handlers
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Handle restoring from localStorage backup
   */
  const handleRestoreFromLocal = useCallback(() => {
    logger.debug('🔄 Restoring from localStorage backup');
    // localStorage components are already loaded by Zustand persist middleware
    // Just need to mark conflict as resolved
    setShowConflictModal(false);
    setConflictResolved(true);
    toast.success('Restored from local backup', { duration: 3000 });
  }, []);

  /**
   * Handle discarding localStorage and using database version
   */
  const handleDiscardLocal = useCallback(() => {
    logger.debug('🗑️ Discarding localStorage, using database');

    if (!homepage?.content) return;

    try {
      const content = Array.isArray(homepage.content)
        ? homepage.content
        : typeof homepage.content === 'string'
          ? JSON.parse(homepage.content)
          : [];

      // All data is now in atomic component format (adapters removed)
      loadComponents(content);
      setShowConflictModal(false);
      setConflictResolved(true);
      toast.success('Loaded from database', { duration: 3000 });
    } catch (error) {
      console.error('❌ Failed to load database version:', error);
      toast.error('Failed to load database version');
    }
  }, [homepage?.content, loadComponents]);

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
  // Conflict Modal Data (must be before early returns - Rules of Hooks)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Get persisted state for conflict modal
  const persistedState = getPersistedCanvasState();
  const localCount = persistedState?.components?.length || 0;
  const dbCount = useMemo(() => {
    if (!homepage?.content) return 0;
    try {
      const content = Array.isArray(homepage.content)
        ? homepage.content
        : typeof homepage.content === 'string'
          ? JSON.parse(homepage.content)
          : [];
      return content.length;
    } catch {
      return 0;
    }
  }, [homepage?.content]);

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
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#fff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Conflict Resolution Modal */}
      <ConflictResolutionModal
        isOpen={showConflictModal}
        localCount={localCount}
        databaseCount={dbCount}
        onRestore={handleRestoreFromLocal}
        onDiscard={handleDiscardLocal}
        onClose={() => setShowConflictModal(false)}
      />

      {/* EditorToolbar - Replaces custom header */}
      <EditorToolbar
        projectId={params.projectId}
        projectName={project.name}
        status={status}
        lastSaved={lastSaved}
        saveError={autoSaveError}
        retryCount={retryCount}
        isOnline={isOnline}
        onSaveNow={saveNow}
        isAIChatOpen={isAIChatOpen}
        onToggleAIChat={() => setIsAIChatOpen((prev) => !prev)}
      />

      {/* Editor Layout with Drag & Drop */}
      <DragDropContextProvider>
        <div className="flex flex-1 overflow-hidden">
          {/* Component Palette - Left Resizable Panel */}
          <ResizablePanel
            id="component-palette"
            position="left"
            defaultWidth={280}
            minWidth={200}
            maxWidth={400}
            collapsible={true}
          >
            <div className="h-full overflow-y-auto">
              <ComponentPalette />
            </div>
          </ResizablePanel>

          {/* Canvas - Center (flex-1 fills remaining space) */}
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
                  deviceMode={deviceMode}
                  zoom={zoom}
                  onSelectComponent={selectComponent}
                  onDeleteComponent={deleteComponent}
                  onMoveComponent={handleMoveComponent}
                />
              </div>
            </div>
          </div>

          {/* Properties Panel - Right Resizable Panel */}
          <ResizablePanel
            id="properties-panel"
            position="right"
            defaultWidth={360}
            minWidth={280}
            maxWidth={500}
            collapsible={true}
          >
            <div className="h-full overflow-y-auto">
              <PropertiesPanel
                component={selectedComponent}
                onUpdate={(props) => {
                  if (selectedComponentId) {
                    handleUpdateComponent(selectedComponentId, props);
                  }
                }}
              />
            </div>
          </ResizablePanel>
        </div>
      </DragDropContextProvider>

      {/* AI Chat Panel */}
      <AIChat
        projectId={params.projectId}
        pageId={homepage?.id || ''}
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
    </div>
  );
}
