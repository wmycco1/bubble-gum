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
import { useDroppable } from '@dnd-kit/core';
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
  onMoveComponent, // Note: Currently unused - removed nested DndContext for palette drag
}: CanvasProps) {
  // Suppress unused variable warnings - these are here for API consistency
  void onSelectComponent;
  void onDeleteComponent;
  void onMoveComponent;

  const canvasWidth = CANVAS_WIDTHS[deviceMode];
  const canvasStyle = {
    width: canvasWidth,
    transform: `scale(${zoom})`,
    transformOrigin: 'top center',
    transition: 'width 0.3s ease, transform 0.3s ease',
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
        data-canvas-container
        className={`min-h-[600px] rounded-lg border ${
          isOver ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'
        } shadow-sm mx-auto transition-colors`}
        style={canvasStyle}
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
      </div>
    </div>
  );
}
