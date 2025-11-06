'use client';

// ═══════════════════════════════════════════════════════════════
// DRAG & DROP CONTEXT
// ═══════════════════════════════════════════════════════════════
// Wrapper for @dnd-kit drag and drop functionality
// Handles component dragging from palette to canvas
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import type { ComponentType } from '@/lib/editor/types';
import { logger } from '@/lib/utils/logger';

interface DragDropContextProviderProps {
  children: ReactNode;
}

export function DragDropContextProvider({ children }: DragDropContextProviderProps) {
  const [activeType, setActiveType] = useState<ComponentType | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const addComponent = useCanvasStore((state) => state.addComponent);
  const getComponentById = useCanvasStore((state) => state.getComponentById);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduced from 8px to 3px for more responsive drag
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Extract component type from drag data
    if (active.data.current?.type) {
      setActiveType(active.data.current.type as ComponentType);
    }

    // Store active component ID for existing components
    if (active.data.current?.dragType === 'canvas-component') {
      setActiveId(active.id as string);
    } else {
      setActiveId(null);
    }

    logger.debug('🎯 Drag started:', { id: active.id, type: active.data.current?.type });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;

    if (over) {
      logger.debug('📍 Dragging over', { id: over.id });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      logger.debug('❌ Dropped outside valid area');
      setActiveType(null);
      return;
    }

    const dragType = active.data.current?.dragType;
    const droppedOn = over.id as string;
    const dropData = over.data.current;

    logger.debug('✅ Drag ended:', {
      dragType,
      activeId: active.id,
      droppedOn,
      dropData,
    });

    // CASE 1: Dragging from palette (new component)
    if (dragType === 'palette') {
      const componentType = active.data.current?.type as ComponentType;

      // Check if dropped on a container/grid
      if (dropData?.accepts && dropData.accepts.includes(componentType)) {
        const parentId = dropData.parentId;
        const index = dropData.index ?? 0;
        const columnIndex = dropData.columnIndex;

        logger.debug('➕ Adding component to parent:', { componentType, parentId, index, columnIndex });

        // Add the component
        addComponent(componentType, parentId, index);

        // If dropped into a Grid column, update the newly added component with columnIndex
        if (columnIndex !== undefined) {
          const state = useCanvasStore.getState();
          const parent = state.components.find((c) => c.id === parentId);
          if (parent && parent.children) {
            const newComponent = parent.children[parent.children.length - 1];
            if (newComponent) {
              const updateComponent = state.updateComponent;
              updateComponent(newComponent.id, {
                props: { ...newComponent.props, columnIndex },
              });
            }
          }
        }
      } else if (droppedOn === 'canvas') {
        // Dropped on main canvas
        logger.debug('➕ Adding component to canvas');
        addComponent(componentType);
      }
    }

    // CASE 2: Moving existing component to a container (re-parenting)
    else if (dragType === 'canvas-component') {
      const draggedComponentId = active.id as string;
      const state = useCanvasStore.getState();

      // Get the component being dragged to check its type
      const draggedComponent = state.getComponentById(draggedComponentId);

      // Check if dropped on a container/grid drop zone
      if (dropData?.parentId && dropData?.accepts && draggedComponent) {
        const targetParentId = dropData.parentId;
        const columnIndex = dropData.columnIndex;
        const componentType = draggedComponent.type;

        // Check if the target container accepts this component type
        const isAccepted = Array.isArray(dropData.accepts) && dropData.accepts.includes(componentType);

        if (isAccepted) {
          logger.debug('🔄 Re-parenting component:', {
            componentId: draggedComponentId,
            componentType,
            newParentId: targetParentId,
            columnIndex,
          });

          // Use moveComponent to handle re-parenting
          state.moveComponent(draggedComponentId, targetParentId, columnIndex ?? 0);

          // If dropped into Grid column, update columnIndex
          if (columnIndex !== undefined) {
            const parent = state.getComponentById(targetParentId);
            if (parent && parent.children) {
              const movedComponent = parent.children.find((c) => c.id === draggedComponentId);
              if (movedComponent) {
                state.updateComponent(movedComponent.id, {
                  props: { ...movedComponent.props, columnIndex },
                });
              }
            }
          }
        } else {
          logger.debug('⚠️ Component type not accepted by target:', {
            componentType,
            accepts: dropData.accepts,
          });
        }
      }
      // CASE 3: Reordering at root level (canvas)
      else if (active.id !== over.id && droppedOn === 'canvas') {
        const components = state.components;
        const oldIndex = components.findIndex((c) => c.id === draggedComponentId);
        const newIndex = components.findIndex((c) => c.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          logger.debug('🔄 Reordering components:', { from: oldIndex, to: newIndex });

          // Reorder components array
          const newComponents = [...components];
          const [movedComponent] = newComponents.splice(oldIndex, 1);
          newComponents.splice(newIndex, 0, movedComponent!);

          // Update store
          state.setComponents(newComponents);
        }
      }
    }

    setActiveType(null);
    setActiveId(null);
  };

  // Get the active component for overlay
  const activeComponent = activeId ? getComponentById(activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}

      {/* Drag Overlay - smooth mechanical animation (GPU accelerated) */}
      <DragOverlay
        dropAnimation={{
          duration: 200, // Faster, more snappy
          easing: 'cubic-bezier(0.2, 0, 0, 1)', // Natural ease-out curve
        }}
      >
        {activeType || activeComponent ? (
          <div
            className="rounded-lg border-2 border-blue-500 bg-blue-50 px-4 py-3 shadow-lg opacity-95 cursor-grabbing"
            style={{
              willChange: 'transform', // GPU acceleration hint
              transform: 'translateZ(0)', // Force GPU layer
            }}
          >
            <div className="text-sm font-medium text-blue-900">
              {activeComponent ? (
                <>
                  <span className="font-bold">{activeComponent.type}</span>
                  {activeComponent.props.text && (
                    <span className="ml-2 text-xs text-slate-600">
                      ({String(activeComponent.props.text).substring(0, 20)}...)
                    </span>
                  )}
                </>
              ) : (
                <span className="font-bold">{activeType}</span>
              )}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
