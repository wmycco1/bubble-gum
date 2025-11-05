// ═══════════════════════════════════════════════════════════════
// CONTAINER COMPONENT
// ═══════════════════════════════════════════════════════════════
// NEW system: Layout wrapper with children support
// Features: Padding, border, can contain other components
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { RenderComponent } from '@/components/editor/RenderComponent';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { useDroppable } from '@dnd-kit/core';

interface ContainerComponentProps {
  component: CanvasComponent;
}

export function ContainerComponent({ component }: ContainerComponentProps) {
  const { style, children } = component;
  const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);

  // Make container droppable
  const { setNodeRef, isOver } = useDroppable({
    id: `container-${component.id}`,
    data: {
      parentId: component.id,
      accepts: ['Text', 'Heading', 'Button', 'Image', 'Link', 'Icon', 'Card', 'Grid', 'Form', 'Input', 'Textarea', 'Checkbox', 'Submit'],
      index: children?.length || 0,
    },
  });

  // Remove Tailwind spacing classes if custom spacing is set
  const baseClassName = 'flex flex-col gap-4 p-6 border-2 border-dashed rounded-lg min-h-[150px]';
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
        <div className="flex items-center justify-center text-sm text-slate-400 py-8">
          {isOver ? 'Drop here' : 'Drag components here'}
        </div>
      )}
    </div>
  );
}
