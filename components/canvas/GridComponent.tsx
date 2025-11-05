// ═══════════════════════════════════════════════════════════════
// GRID COMPONENT (ADVANCED)
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Advanced column management
// Features:
// - Per-column drop zones
// - Customizable column count (1-6)
// - Custom column widths (columnWidths array)
// - Drag components to specific columns
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { RenderComponent } from '@/components/editor/RenderComponent';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { useDroppable } from '@dnd-kit/core';

interface GridComponentProps {
  component: CanvasComponent;
}

/**
 * Grid Column Drop Zone
 * Each column is a separate droppable zone
 */
function GridColumn({
  gridId,
  columnIndex,
  columnChildren,
  columnWidth,
}: {
  gridId: string;
  columnIndex: number;
  columnChildren: CanvasComponent[];
  columnWidth?: string;
}) {
  const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);

  const { setNodeRef, isOver } = useDroppable({
    id: `grid-${gridId}-col-${columnIndex}`,
    data: {
      parentId: gridId,
      columnIndex,
      accepts: ['Text', 'Heading', 'Button', 'Image', 'Link', 'Icon', 'Card', 'Form', 'Input', 'Textarea', 'Checkbox', 'Submit'],
    },
  });

  const isEmpty = columnChildren.length === 0;

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-2 p-3 rounded border-2 border-dashed min-h-[150px] transition-colors ${
        isOver
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-200 bg-white'
      }`}
      style={{ width: columnWidth }}
    >
      {isEmpty ? (
        <div className="flex items-center justify-center h-full text-xs text-slate-400">
          {isOver ? 'Drop here' : `Column ${columnIndex + 1}`}
        </div>
      ) : (
        columnChildren.map((child) => (
          <RenderComponent
            key={child.id}
            component={child}
            isSelected={child.id === selectedComponentId}
          />
        ))
      )}
    </div>
  );
}

export function GridComponent({ component }: GridComponentProps) {
  const { props, style, children } = component;

  // Get column configuration from props
  const columns = (props.columns as number) || 3;
  const columnWidths = (props.columnWidths as string[]) || [];
  const gap = (props.gap as string) || '1.5rem';

  // Organize children by column
  // If children have columnIndex, use it; otherwise distribute evenly
  const childrenByColumn: CanvasComponent[][] = Array.from({ length: columns }, () => []);

  children?.forEach((child, index) => {
    const columnIndex = (child.props?.columnIndex as number | undefined) ?? (index % columns);
    if (columnIndex >= 0 && columnIndex < columns) {
      childrenByColumn[columnIndex]?.push(child);
    }
  });

  // Generate grid template columns based on columnWidths or equal distribution
  const gridTemplateColumns =
    columnWidths.length > 0
      ? columnWidths.slice(0, columns).join(' ')
      : `repeat(${columns}, 1fr)`;

  // Remove Tailwind spacing classes if custom spacing is set
  const baseClassName = 'grid p-6 border-2 border-solid rounded-lg min-h-[200px] bg-slate-50';

  const wrapperClassName = mergeClassNameWithSpacing(baseClassName, style);

  return (
    <div
      className={wrapperClassName}
      style={{
        ...(style as React.CSSProperties),
        gridTemplateColumns,
        gap,
      }}
    >
      {Array.from({ length: columns }).map((_, columnIndex) => (
        <GridColumn
          key={columnIndex}
          gridId={component.id}
          columnIndex={columnIndex}
          columnChildren={childrenByColumn[columnIndex] || []}
          columnWidth={columnWidths[columnIndex]}
        />
      ))}
    </div>
  );
}
