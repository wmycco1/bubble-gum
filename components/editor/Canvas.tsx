'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - CANVAS (MIGRATED TO NEW SYSTEM)
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Now uses NEW CanvasComponent and RenderComponent
// Changes:
// - Uses RenderComponent instead of ComponentRenderer
// - Works with NEW CanvasComponent types
// - Simplified: drag/drop/delete handled by RenderComponent
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { RenderComponent } from './RenderComponent';

interface CanvasProps {
  components: CanvasComponent[];
  selectedId: string | null;
  onSelectComponent: (id: string) => void;
  onDeleteComponent: (id: string) => void;
  onMoveComponent: (fromIndex: number, toIndex: number) => void;
}

export function Canvas({
  components,
  selectedId,
  onSelectComponent, // Note: Currently unused - RenderComponent uses canvas-store directly
  onDeleteComponent, // Note: Currently unused - RenderComponent uses canvas-store directly
  onMoveComponent,
}: CanvasProps) {
  // Suppress unused variable warnings - these are here for API consistency
  void onSelectComponent;
  void onDeleteComponent;
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = components.findIndex((c) => c.id === active.id);
      const newIndex = components.findIndex((c) => c.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onMoveComponent(oldIndex, newIndex);
      }
    }
  };

  if (components.length === 0) {
    return (
      <div className="flex min-h-[600px] items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white">
        <div className="text-center max-w-md">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
            <svg
              className="h-8 w-8 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No components yet
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Start building by adding components from the left sidebar
          </p>
          <div className="text-xs text-slate-500 space-y-1">
            <p>💡 Tip: Try adding a Text or Button component first</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] rounded-lg border border-slate-200 bg-white shadow-sm">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={components.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-0">
            {components.map((component) => (
              <RenderComponent
                key={component.id}
                component={component}
                isSelected={selectedId === component.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
