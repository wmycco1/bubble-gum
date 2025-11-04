'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - COMPONENT RENDERER
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Renders canvas components with selection and hover states
// ═══════════════════════════════════════════════════════════════

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { cn } from '@/lib/utils/cn';
import type { CanvasComponent } from '@/lib/editor/types';

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
    ...(component.style as React.CSSProperties),
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

  // Render component based on type
  const renderContent = () => {
    switch (component.type) {
      case 'Button':
        return (
          <button style={style} type="button">
            {component.props.text || 'Button'}
          </button>
        );

      case 'Text':
        return <p style={style}>{component.props.text || 'Text'}</p>;

      case 'Heading':
        const HeadingTag = (component.props.variant || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        const HeadingElement = HeadingTag;
        return <HeadingElement style={style}>{component.props.text || 'Heading'}</HeadingElement>;

      case 'Image':
        return (
          <img
            src={component.props.src || 'https://via.placeholder.com/400x300'}
            alt={component.props.alt || 'Image'}
            style={style}
          />
        );

      case 'Input':
        return (
          <input
            type={component.props.type || 'text'}
            placeholder={component.props.placeholder || 'Enter text...'}
            style={style}
          />
        );

      case 'Container':
      case 'Section':
      case 'Grid':
      case 'Card':
      case 'Form':
        return (
          <div
            ref={setDropRef}
            style={style}
            className={cn(isOver && 'bg-blue-50 ring-2 ring-blue-400')}
          >
            {component.children && component.children.length > 0 ? (
              component.children.map((child) => (
                <RenderComponent
                  key={child.id}
                  component={child}
                  isSelected={child.id === useCanvasStore.getState().selectedComponentId}
                />
              ))
            ) : (
              <div className="flex min-h-[100px] items-center justify-center text-sm text-slate-400">
                Drop components here
              </div>
            )}
          </div>
        );

      default:
        return <div style={style}>Unknown Component</div>;
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
      className={cn(
        'relative cursor-move transition-all',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        isHovered && !isSelected && 'ring-1 ring-slate-300'
      )}
    >
      {/* Selection Label */}
      {isSelected && (
        <div className="absolute -top-6 left-0 rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white">
          {component.type}
        </div>
      )}

      {renderContent()}
    </div>
  );
}
