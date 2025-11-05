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

interface DragDropContextProviderProps {
  children: ReactNode;
}

export function DragDropContextProvider({ children }: DragDropContextProviderProps) {
  const [activeType, setActiveType] = useState<ComponentType | null>(null);
  const addComponent = useCanvasStore((state) => state.addComponent);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Extract component type from drag data
    if (active.data.current?.type) {
      setActiveType(active.data.current.type as ComponentType);
    }

    console.log('🎯 Drag started:', { id: active.id, type: active.data.current?.type });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;

    if (over) {
      console.log('📍 Dragging over:', over.id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      console.log('❌ Dropped outside valid area');
      setActiveType(null);
      return;
    }

    const draggedType = active.data.current?.type as ComponentType;
    const droppedOn = over.id as string;
    const dropData = over.data.current;

    console.log('✅ Drag ended:', {
      draggedType,
      droppedOn,
      dropData,
    });

    // Check if dropped on a container/grid
    if (dropData?.accepts && dropData.accepts.includes(draggedType)) {
      const parentId = dropData.parentId;
      const index = dropData.index ?? 0;

      console.log('➕ Adding component to parent:', { draggedType, parentId, index });
      addComponent(draggedType, parentId, index);
    } else if (droppedOn === 'canvas') {
      // Dropped on main canvas
      console.log('➕ Adding component to canvas');
      addComponent(draggedType);
    }

    setActiveType(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}

      {/* Drag Overlay - shows ghost preview while dragging */}
      <DragOverlay>
        {activeType ? (
          <div className="rounded-lg border-2 border-blue-500 bg-blue-50 px-4 py-3 shadow-lg opacity-80">
            <div className="text-sm font-medium text-blue-900">
              {activeType}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
