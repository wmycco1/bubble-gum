'use client';

import type { PageComponent } from '@/types/components';
import type { DragEndEvent } from '@dnd-kit/core';
import { ComponentRenderer } from './ComponentRenderer';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

interface CanvasProps {
  components: PageComponent[];
  selectedId: string | null;
  onSelectComponent: (id: string) => void;
  onDeleteComponent: (id: string) => void;
  onMoveComponent: (fromIndex: number, toIndex: number) => void;
}

export function Canvas({
  components,
  selectedId,
  onSelectComponent,
  onDeleteComponent,
  onMoveComponent,
}: CanvasProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = components.findIndex((c) => c.id === active.id);
      const newIndex = components.findIndex((c) => c.id === over.id);
      onMoveComponent(oldIndex, newIndex);
    }
  };

  if (components.length === 0) {
    return (
      <div className="flex min-h-[600px] items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
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
          <h3 className="mt-2 text-sm font-semibold text-slate-900">
            No components yet
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Add components from the left sidebar to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl rounded-lg border border-slate-200 bg-white shadow-sm">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={components.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-0">
            {components.map((component) => (
              <SortableItem key={component.id} id={component.id}>
                <div
                  className={`group relative border-2 transition-all ${
                    selectedId === component.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-transparent hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  onClick={() => onSelectComponent(component.id)}
                >
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteComponent(component.id);
                    }}
                    className="absolute right-2 top-2 z-10 rounded bg-red-500 px-2 py-1 text-xs text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                  >
                    Delete
                  </button>

                  {/* Component Content */}
                  <ComponentRenderer component={component} />
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
