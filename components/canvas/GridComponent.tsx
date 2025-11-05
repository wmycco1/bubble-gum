// ═══════════════════════════════════════════════════════════════
// GRID COMPONENT (ADVANCED)
// ═══════════════════════════════════════════════════════════════
// Version: 2.1.0 - Added resize handles
// Features:
// - Per-column drop zones
// - Customizable column count (1-12)
// - Custom column widths (columnWidths array)
// - Drag components to specific columns
// - Visual resize handles between columns
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { RenderComponent } from '@/components/editor/RenderComponent';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { useDroppable } from '@dnd-kit/core';
import { useState } from 'react';

interface GridComponentProps {
  component: CanvasComponent;
}

/**
 * Grid Column Drop Zone with Resize Handle
 * Each column is a separate droppable zone with resize capability
 */
function GridColumn({
  gridId,
  columnIndex,
  columnChildren,
  columnWidth,
  totalColumns,
  onResizeStart,
}: {
  gridId: string;
  columnIndex: number;
  columnChildren: CanvasComponent[];
  columnWidth?: string;
  totalColumns: number;
  onResizeStart?: (columnIndex: number) => void;
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
  const isLastColumn = columnIndex === totalColumns - 1;

  return (
    <div className="relative">
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

      {/* Resize Handle (except for last column) */}
      {!isLastColumn && (
        <div
          className="absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-400 transition-colors z-10 flex items-center justify-center group"
          style={{ transform: 'translateX(50%)' }}
          title="Drag to resize column"
          onMouseDown={() => onResizeStart?.(columnIndex)}
        >
          <div className="w-1 h-8 bg-slate-300 group-hover:bg-blue-500 rounded-full transition-colors" />
        </div>
      )}
    </div>
  );
}

export function GridComponent({ component }: GridComponentProps) {
  const { props, style, children } = component;
  const [resizing, setResizing] = useState<number | null>(null);

  // Get column configuration from props
  const columns = (props.columns as number) || 3;
  const columnWidths = (props.columnWidths as string[]) || Array.from({ length: columns }, () => '1fr');
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

  // Handle resize start
  const handleResizeStart = (columnIndex: number) => {
    setResizing(columnIndex);
    console.log('🔄 Resize started for column:', columnIndex);
    // TODO: Implement actual resize logic with mouse move
    // For now, just show visual feedback
  };

  // Remove Tailwind spacing classes if custom spacing is set
  const baseClassName = 'grid p-6 border-2 border-solid rounded-lg min-h-[200px] bg-slate-50 relative';

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
          totalColumns={columns}
          onResizeStart={handleResizeStart}
        />
      ))}

      {/* Resize indicator */}
      {resizing !== null && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs pointer-events-none">
          Resizing Column {resizing + 1}
        </div>
      )}
    </div>
  );
}
