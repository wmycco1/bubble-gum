// ═══════════════════════════════════════════════════════════════
// GRID COMPONENT (ADVANCED)
// ═══════════════════════════════════════════════════════════════
// Version: 2.2.0 - Functional resize with mouse drag
// Features:
// - Per-column drop zones
// - Customizable column count (1-12)
// - Custom column widths (columnWidths array)
// - Drag components to specific columns
// - Functional resize handles with mouse drag
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { RenderComponent } from '@/components/editor/RenderComponent';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { useDroppable } from '@dnd-kit/core';
import { useState, useRef } from 'react';
import { logger } from '@/lib/utils/logger';

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
  totalColumns,
  onResizeStart,
}: {
  gridId: string;
  columnIndex: number;
  columnChildren: CanvasComponent[];
  totalColumns: number;
  onResizeStart?: (columnIndex: number, e: React.MouseEvent) => void;
}) {
  const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);

  const { setNodeRef, isOver } = useDroppable({
    id: `grid-${gridId}-col-${columnIndex}`,
    data: {
      parentId: gridId,
      columnIndex,
      accepts: [
        // Basic components
        'Text', 'Heading', 'Button', 'Image', 'Link', 'Icon',
        // Container/Layout components (allow nesting)
        'Container', 'Card', 'InnerSection',
        // Section components
        'Hero', 'Features', 'CTA', 'Testimonial', 'Pricing', 'FAQ', 'Team',
        // Form components
        'Form', 'Input', 'Textarea', 'Checkbox', 'Submit',
        // Other components
        'Spacer', 'Divider', 'Banner', 'HTML', 'Video', 'Iframe'
      ],
    },
  });

  const isEmpty = columnChildren.length === 0;
  const isLastColumn = columnIndex === totalColumns - 1;

  return (
    <div className="relative">
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 p-3 rounded border-2 border-dashed min-h-[150px] transition-all duration-200 ease-out ${
          isOver
            ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-md'
            : 'border-slate-200 bg-white scale-100'
        }`}
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
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onResizeStart?.(columnIndex, e);
          }}
        >
          <div className="w-1 h-8 bg-slate-300 group-hover:bg-blue-500 rounded-full transition-colors" />
        </div>
      )}
    </div>
  );
}

export function GridComponent({ component }: GridComponentProps) {
  const { props, style, children } = component;
  const updateComponent = useCanvasStore((state) => state.updateComponent);

  const [resizing, setResizing] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthsRef = useRef<number[]>([]);

  // Get column configuration from props
  const columns = (props.columns as number) || 3;
  const columnWidths = (props.columnWidths as string[]) || Array.from({ length: columns }, () => '1fr');
  const gap = (props.gap as string) || '1.5rem';
  const justifyContent = (props.justifyContent as string) || undefined;
  const alignItems = (props.alignItems as string) || undefined;

  // Organize children by column
  // If children have columnIndex, use it; otherwise distribute evenly
  const childrenByColumn: CanvasComponent[][] = Array.from({ length: columns }, () => []);

  children?.forEach((child, index) => {
    const columnIndex = (child.props?.columnIndex as number | undefined) ?? (index % columns);
    if (columnIndex >= 0 && columnIndex < columns) {
      childrenByColumn[columnIndex]?.push(child);
    }
  });

  // Convert columnWidths to pixels for resize calculations
  const getPixelWidths = (): number[] => {
    if (!gridRef.current) return [];
    const gridElement = gridRef.current;
    const gridWidth = gridElement.offsetWidth;
    const gapValue = parseFloat(gap) * 16; // Convert rem to px (assuming 16px base)
    const totalGap = gapValue * (columns - 1);
    const availableWidth = gridWidth - totalGap;

    // Calculate pixel width for each column
    const pixelWidths: number[] = [];
    const frUnits: number[] = [];
    const fixedWidths: number[] = [];

    columnWidths.forEach((width, i) => {
      if (width.endsWith('fr')) {
        frUnits[i] = parseFloat(width);
        fixedWidths[i] = 0;
      } else if (width.endsWith('px')) {
        frUnits[i] = 0;
        fixedWidths[i] = parseFloat(width);
      } else if (width.endsWith('rem')) {
        frUnits[i] = 0;
        fixedWidths[i] = parseFloat(width) * 16;
      } else {
        frUnits[i] = 1;
        fixedWidths[i] = 0;
      }
    });

    const totalFixed = fixedWidths.reduce((sum, w) => sum + w, 0);
    const totalFr = frUnits.reduce((sum, fr) => sum + fr, 0);
    const remainingWidth = availableWidth - totalFixed;
    const frValue = totalFr > 0 ? remainingWidth / totalFr : 0;

    columnWidths.forEach((_, i) => {
      if ((frUnits[i] ?? 0) > 0) {
        pixelWidths[i] = (frUnits[i] ?? 0) * frValue;
      } else {
        pixelWidths[i] = fixedWidths[i] ?? 0;
      }
    });

    return pixelWidths;
  };

  // Handle resize start
  const handleResizeStart = (columnIndex: number, e: React.MouseEvent) => {
    setResizing(columnIndex);
    startXRef.current = e.clientX;
    startWidthsRef.current = getPixelWidths();

    logger.debug('🔄 Resize started for column', {
      columnIndex,
      startX: e.clientX,
      startWidths: startWidthsRef.current,
    });

    // Add mouse move and mouse up listeners
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startXRef.current;
      const newWidths = [...startWidthsRef.current];

      // Update current column width
      const currentWidth = newWidths[columnIndex] || 0;
      const nextWidth = newWidths[columnIndex + 1] || 0;

      // Ensure minimum width of 50px
      const newCurrentWidth = Math.max(50, currentWidth + deltaX);
      const newNextWidth = Math.max(50, nextWidth - deltaX);

      newWidths[columnIndex] = newCurrentWidth;
      newWidths[columnIndex + 1] = newNextWidth;

      // Convert pixel widths back to fr units (proportional)
      const totalWidth = newWidths.reduce((sum, w) => sum + w, 0);
      const newColumnWidths = newWidths.map(w => `${((w / totalWidth) * columns).toFixed(3)}fr`);

      // Update component props
      updateComponent(component.id, {
        props: {
          ...props,
          columnWidths: newColumnWidths,
        },
      });
    };

    const handleMouseUp = () => {
      setResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      logger.debug('✅ Resize ended');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Generate grid template columns based on columnWidths
  const gridTemplateColumns = columnWidths.slice(0, columns).join(' ');

  // Remove Tailwind spacing classes if custom spacing is set
  const baseClassName = 'grid p-6 border-2 border-solid rounded-lg min-h-[200px] bg-slate-50 relative';

  const wrapperClassName = mergeClassNameWithSpacing(baseClassName, style);

  return (
    <div
      ref={gridRef}
      className={wrapperClassName}
      style={{
        ...(style as React.CSSProperties),
        gridTemplateColumns,
        gap,
        ...(justifyContent && { justifyContent }),
        ...(alignItems && { alignItems }),
      }}
    >
      {Array.from({ length: columns }).map((_, columnIndex) => (
        <GridColumn
          key={columnIndex}
          gridId={component.id}
          columnIndex={columnIndex}
          columnChildren={childrenByColumn[columnIndex] || []}
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
