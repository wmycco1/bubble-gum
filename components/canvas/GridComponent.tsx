// ═══════════════════════════════════════════════════════════════
// GRID COMPONENT
// ═══════════════════════════════════════════════════════════════
// NEW system: Responsive grid layout with children support
// Features: 3-column grid (default), responsive
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { RenderComponent } from '@/components/editor/RenderComponent';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { useDroppable } from '@dnd-kit/core';

interface GridComponentProps {
  component: CanvasComponent;
}

export function GridComponent({ component }: GridComponentProps) {
  const { style, children } = component;
  const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);

  // Make grid droppable
  const { setNodeRef, isOver } = useDroppable({
    id: `grid-${component.id}`,
    data: {
      parentId: component.id,
      accepts: ['Text', 'Heading', 'Button', 'Image', 'Link', 'Icon', 'Card', 'Form', 'Input', 'Textarea', 'Checkbox', 'Submit'],
      index: children?.length || 0,
    },
  });

  // Remove Tailwind spacing classes if custom spacing is set
  const baseClassName = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 border-2 border-dashed rounded-lg min-h-[200px]';
  const stateClassName = isOver
    ? 'border-blue-500 bg-blue-50'
    : 'border-slate-300 bg-slate-50';

  const wrapperClassName = mergeClassNameWithSpacing(
    `${baseClassName} ${stateClassName} transition-colors`,
    style
  );

  return (
    <div ref={setNodeRef} className={wrapperClassName} style={style as React.CSSProperties}>
      {children && children.length > 0 ? (
        children.map((child) => (
          <RenderComponent
            key={child.id}
            component={child}
            isSelected={child.id === selectedComponentId}
          />
        ))
      ) : (
        <div className="col-span-full flex items-center justify-center text-sm text-slate-400 py-8">
          {isOver ? 'Drop here for grid layout' : 'Drag components here for grid layout'}
        </div>
      )}
    </div>
  );
}
