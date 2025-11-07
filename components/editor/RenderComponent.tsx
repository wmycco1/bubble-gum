'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - RENDER COMPONENT (ATOMIC DESIGN SYSTEM)
// ═══════════════════════════════════════════════════════════════
// Version: 4.0.0 - Migrated to Atomic Design System
// Changes:
// - Now uses atomic components from src/components/
// - Adapter layer preserves ALL props, styles, and custom CSS
// - Context API integration for parameter cascade
// - Enterprise-grade atomic components (God-Tier 2025)
// ═══════════════════════════════════════════════════════════════

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { cn } from '@/lib/utils/cn';
import type { CanvasComponent, Breakpoint } from '@/lib/editor/types';
import { getResponsiveStyles } from '@/lib/editor/types';
import toast from 'react-hot-toast';
import React from 'react';

// Import component mapping and adapter
import { getComponentByType, isComponentMapped } from '@/lib/editor/component-mapping';
import { convertCanvasComponentFull } from '@/lib/editor/component-adapter';

import { logger } from '@/lib/utils/logger';
import { ComponentToolbar } from './ComponentToolbar';

interface RenderComponentProps {
  component: CanvasComponent;
  isSelected: boolean;
  deviceMode?: Breakpoint;
}

export function RenderComponent({ component, isSelected, deviceMode = 'desktop' }: RenderComponentProps) {
  const { selectComponent, setHoveredComponent, hoveredComponentId } = useCanvasStore();

  const isHovered = hoveredComponentId === component.id;
  const canHaveChildren = ['Container', 'Section', 'Grid', 'Card', 'Form'].includes(
    component.type
  );

  // Resolve responsive styles based on current breakpoint
  const resolvedStyles = getResponsiveStyles(component.style, deviceMode);
  const componentWithResolvedStyles = {
    ...component,
    style: resolvedStyles,
  };

  // Make component draggable (only via drag handle)
  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: component.id,
    data: {
      dragType: 'canvas-component', // Identify as canvas reorder
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

  // ═══════════════════════════════════════════════════════════════
  // Apply visibility and display props (God-Tier 2025)
  // ═══════════════════════════════════════════════════════════════
  const visibility = component.props.visibility as 'visible' | 'hidden' | undefined;
  const display = component.props.display as string | undefined;

  const style: React.CSSProperties = {
    // Ghost effect while dragging - make original semi-transparent
    opacity: isDragging ? 0.3 : 1, // Ghost during drag, full when not
    zIndex: isSelected ? 10 : 1, // Selected components on top
    pointerEvents: isDragging ? 'none' : 'auto', // Disable clicks while dragging
    willChange: isDragging ? 'opacity' : 'auto', // GPU hint
    transition: 'opacity 100ms ease-out', // Quick fade

    // NEW: Apply visibility and display from props (God-Tier 2025)
    ...(visibility && { visibility }),
    ...(display && { display }),
  };

  const handleClick = (e: React.MouseEvent) => {
    logger.debug('🖱️ Component clicked:', {
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
      logger.debug('✅ Selection updated:', {
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

  // Render atomic component based on type (with adapter layer)
  const renderVisualComponent = () => {
    const comp = componentWithResolvedStyles;

    // Check if component type is mapped to atomic component
    if (!isComponentMapped(component.type)) {
      logger.error('Unknown component type:', component.type);
      return (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-900">
            ⚠️ Unknown component type: {component.type}
          </p>
        </div>
      );
    }

    // Get atomic component from mapping
    const AtomicComponent = getComponentByType(component.type);

    if (!AtomicComponent) {
      logger.error('Component not found in mapping:', component.type);
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-900">
            🚫 Component not implemented: {component.type}
          </p>
        </div>
      );
    }

    // Convert canvas component to atomic props using adapter
    const atomicProps = convertCanvasComponentFull(comp);

    // Render children recursively if component has them
    if (comp.children && comp.children.length > 0) {
      atomicProps.children = comp.children.map((child) => (
        <RenderComponent
          key={child.id}
          component={child}
          isSelected={false}
          deviceMode={deviceMode}
        />
      ));
    }

    // Render atomic component with converted props
    return <AtomicComponent {...atomicProps} />;
  };

  return (
    <div
      ref={setDragRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={cn(
        'relative cursor-pointer transition-all',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/10',
        isHovered && !isSelected && 'ring-1 ring-slate-300 bg-slate-50',
        isOver && 'ring-2 ring-blue-400 bg-blue-50'
      )}
    >
      {/* Selection Label, Drag Handle & Quick Actions Toolbar */}
      {isSelected && (
        <>
          <div className="absolute -top-6 left-0 z-20 flex items-center gap-1">
            {/* Drag Handle */}
            <button
              {...dragListeners}
              {...dragAttributes}
              className="rounded bg-slate-500 px-2 py-1 text-xs font-medium text-white shadow-sm hover:bg-slate-600 transition-colors cursor-grab active:cursor-grabbing"
              title="Drag to reorder"
              onClick={(e) => e.stopPropagation()}
            >
              ⋮⋮
            </button>
            <div className="rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white shadow-sm">
              {component.type}
            </div>
          </div>

          {/* Quick Actions Toolbar (God-Tier 2025) */}
          <ComponentToolbar componentId={component.id} position="top-right" />
        </>
      )}

      {/* Show toolbar on hover (without selection label) */}
      {isHovered && !isSelected && (
        <ComponentToolbar componentId={component.id} position="top-right" />
      )}

      {/* Visual Component */}
      <div ref={canHaveChildren ? setDropRef : undefined}>
        {renderVisualComponent()}
      </div>
    </div>
  );
}
