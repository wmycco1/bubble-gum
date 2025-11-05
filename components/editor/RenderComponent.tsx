'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - RENDER COMPONENT (100% NEW SYSTEM)
// ═══════════════════════════════════════════════════════════════
// Version: 3.0.0 - Full migration to NEW visual components
// Changes:
// - Now uses visual components from components/canvas/
// - Removed inline HTML rendering
// - Enterprise-grade visual components with proper styling
// ═══════════════════════════════════════════════════════════════

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { cn } from '@/lib/utils/cn';
import type { CanvasComponent } from '@/lib/editor/types';
import toast from 'react-hot-toast';

// Import NEW visual components
import { SectionComponent } from '@/components/canvas/SectionComponent';
import { TextComponent } from '@/components/canvas/TextComponent';
import { ImageComponent } from '@/components/canvas/ImageComponent';
import { ButtonComponent } from '@/components/canvas/ButtonComponent';
import { FormComponent } from '@/components/canvas/FormComponent';
import { ContainerComponent } from '@/components/canvas/ContainerComponent';
import { GridComponent } from '@/components/canvas/GridComponent';
import { CardComponent } from '@/components/canvas/CardComponent';
import { InputComponent } from '@/components/canvas/InputComponent';

interface RenderComponentProps {
  component: CanvasComponent;
  isSelected: boolean;
}

export function RenderComponent({ component, isSelected }: RenderComponentProps) {
  const { selectComponent, setHoveredComponent, hoveredComponentId, deleteComponent } =
    useCanvasStore();

  const isHovered = hoveredComponentId === component.id;
  const canHaveChildren = ['Container', 'Section', 'Grid', 'Card', 'Form'].includes(
    component.type
  );

  // Make component draggable
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({
    id: component.id,
    data: {
      type: 'existing-component',
      componentId: component.id,
    },
  });

  // Make container components droppable
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: component.id,
    disabled: !canHaveChildren,
    data: {
      accepts: ['new-component', 'existing-component'],
    },
  });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isSelected ? 10 : 1, // Selected components on top
    pointerEvents: 'auto', // CRITICAL: Ensure clickable
  };

  const handleClick = (e: React.MouseEvent) => {
    console.log('🖱️ Component clicked:', {
      id: component.id,
      type: component.type,
      currentSelectedId: useCanvasStore.getState().selectedComponentId,
      timestamp: new Date().toISOString(),
    });

    e.stopPropagation();
    selectComponent(component.id);

    // Visual feedback
    toast.success(`Selected ${component.type}`, {
      duration: 1500,
      icon: '👆',
      position: 'bottom-right',
    });

    // Verify selection happened (debug)
    setTimeout(() => {
      const store = useCanvasStore.getState();
      console.log('✅ Selection updated:', {
        selectedComponentId: store.selectedComponentId,
        success: store.selectedComponentId === component.id,
      });
    }, 50);
  };

  const handleMouseEnter = () => {
    setHoveredComponent(component.id);
  };

  const handleMouseLeave = () => {
    setHoveredComponent(null);
  };

  // Render visual component based on type
  const renderVisualComponent = () => {
    switch (component.type) {
      case 'Section':
        return <SectionComponent component={component} />;

      case 'Text':
      case 'Heading':
        return <TextComponent component={component} />;

      case 'Image':
        return <ImageComponent component={component} />;

      case 'Button':
        return <ButtonComponent component={component} />;

      case 'Input':
        return <InputComponent component={component} />;

      case 'Form':
        return <FormComponent component={component} />;

      case 'Container':
        return <ContainerComponent component={component} />;

      case 'Grid':
        return <GridComponent component={component} />;

      case 'Card':
        return <CardComponent component={component} />;

      default:
        return (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-900">
              ⚠️ Unknown component type: {component.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div
      ref={setDragRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={cn(
        'relative cursor-pointer transition-all', // cursor-pointer instead of cursor-move
        isSelected && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/10',
        isHovered && !isSelected && 'ring-1 ring-slate-300 bg-slate-50',
        isOver && 'ring-2 ring-blue-400 bg-blue-50'
      )}
    >
      {/* Selection Label & Actions */}
      {isSelected && (
        <div className="absolute -top-6 left-0 right-0 z-20 flex items-center justify-between gap-2">
          <div className="rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white shadow-sm">
            {component.type}
          </div>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteComponent(component.id);
                toast.success(`Deleted ${component.type}`, {
                  duration: 1500,
                  icon: '🗑️',
                });
              }}
              className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white shadow-sm hover:bg-red-600 transition-colors"
              title="Delete component (Del)"
            >
              🗑️
            </button>
          </div>
        </div>
      )}

      {/* Visual Component */}
      <div ref={canHaveChildren ? setDropRef : undefined}>
        {renderVisualComponent()}
      </div>
    </div>
  );
}
