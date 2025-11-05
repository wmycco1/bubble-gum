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
  const { selectComponent, setHoveredComponent, hoveredComponentId } = useCanvasStore();

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
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component.id);
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
        'relative cursor-move transition-all',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        isHovered && !isSelected && 'ring-1 ring-slate-300',
        isOver && 'ring-2 ring-blue-400'
      )}
    >
      {/* Selection Label */}
      {isSelected && (
        <div className="absolute -top-6 left-0 z-10 rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white shadow-sm">
          {component.type}
        </div>
      )}

      {/* Visual Component */}
      <div ref={canHaveChildren ? setDropRef : undefined}>
        {renderVisualComponent()}
      </div>
    </div>
  );
}
