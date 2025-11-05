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

import type { CanvasComponent, Breakpoint } from '@/lib/editor/types';
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { RenderComponent } from './RenderComponent';

// Responsive canvas widths
const CANVAS_WIDTHS: Record<Breakpoint, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

interface CanvasProps {
  components: CanvasComponent[];
  selectedId: string | null;
  deviceMode: Breakpoint;
  zoom: number;
  onSelectComponent: (id: string) => void;
  onDeleteComponent: (id: string) => void;
  onMoveComponent: (fromIndex: number, toIndex: number) => void;
}

export function Canvas({
  components,
  selectedId,
  deviceMode = 'desktop',
  zoom = 1,
  onSelectComponent, // Note: Currently unused - RenderComponent uses canvas-store directly
  onDeleteComponent, // Note: Currently unused - RenderComponent uses canvas-store directly
  onMoveComponent,
}: CanvasProps) {
  // Suppress unused variable warnings - these are here for API consistency
  void onSelectComponent;
  void onDeleteComponent;

  const canvasWidth = CANVAS_WIDTHS[deviceMode];
  const canvasStyle = {
    width: canvasWidth,
    transform: `scale(${zoom})`,
    transformOrigin: 'top center',
    transition: 'width 0.3s ease, transform 0.3s ease',
  };

  // Configure sensors to allow clicks while enabling drag
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating drag
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms for touch, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

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

  // Make canvas droppable for palette components
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: 'canvas',
  });

  if (components.length === 0) {
    return (
      <div
        ref={setDroppableRef}
        className={`flex min-h-[600px] items-center justify-center rounded-lg border-2 border-dashed ${
          isOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'
        } transition-colors`}
      >
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
            Drag components from the left sidebar or click to add
          </p>
          <div className="text-xs text-slate-500 space-y-1">
            <p>💡 Tip: Try dragging a Text or Button component here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-slate-50 p-8 min-h-screen">
      <div
        ref={setDroppableRef}
        className={`min-h-[600px] rounded-lg border ${
          isOver ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'
        } shadow-sm mx-auto transition-colors`}
        style={canvasStyle}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                  deviceMode={deviceMode}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
