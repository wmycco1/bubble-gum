'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - RENDER COMPONENT V5.1.0 (NO ADAPTERS)
// ═══════════════════════════════════════════════════════════════
// Version: 5.1.0 - Margin Spacing Fix (GOD-TIER)
// Changes from 5.0.0:
// - CRITICAL FIX: Added display: inline-block to wrapper div
// - Allows child component's margin to create actual space in parent
// - Without this, wrapper shrinks to child's content box (margin has no effect)
// - Now margin overlays in SpacingHandlesV2 will show correctly!
//
// Version: 5.0.0 - Direct Atomic Component Rendering
// - REMOVED adapter layer (component-adapter.ts)
// - REMOVED component mapping (component-mapping.ts)
// - Direct rendering of atomic components from src/components/
// - Props passed directly as AtomParameters
// - Type-safe component resolution
// ═══════════════════════════════════════════════════════════════

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { cn } from '@/lib/utils/cn';
import type { CanvasComponent, Breakpoint } from '@/lib/editor/types';
import { getResponsiveStyles } from '@/lib/editor/types';
import toast from 'react-hot-toast';
import React from 'react';

// Import ALL atomic components directly
import * as Atoms from '../../src/components/atoms';
import * as Molecules from '../../src/components/molecules';
import * as Organisms from '../../src/components/organisms';
import * as Templates from '../../src/components/templates';

import { logger } from '@/lib/utils/logger';
import { ComponentToolbar } from './ComponentToolbar';
import { SpacingHandlesV2 } from './canvas/SpacingHandlesV2';
import { BorderRadiusHandles } from './canvas/BorderRadiusHandles';
import { TransformHandles } from './canvas/TransformHandles';

// Combine all components into single registry
const COMPONENT_REGISTRY = {
  ...Atoms,
  ...Molecules,
  ...Organisms,
  ...Templates,
} as const;

interface RenderComponentProps {
  component: CanvasComponent;
  isSelected: boolean;
  deviceMode?: Breakpoint;
}

export function RenderComponent({ component, isSelected, deviceMode = 'desktop' }: RenderComponentProps) {
  const { selectComponent, setHoveredComponent, hoveredComponentId, updateComponentProps, visualEditingMode } = useCanvasStore();

  // DEBUG: Log when RenderComponent receives new props
  React.useEffect(() => {
    if (component.type === 'Badge') {
      console.log(`🔄 RenderComponent: Badge [${component.id}] received props:`, {
        fontWeight: component.props.fontWeight,
        fontSize: component.props.fontSize,
        fontFamily: component.props.fontFamily,
        allProps: component.props,
      });
    }
  }, [component.props, component.id, component.type]);

  const isHovered = hoveredComponentId === component.id;
  const canHaveChildren = ['Container', 'Section', 'Grid', 'Card', 'Form', 'Layout'].includes(
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
      dragType: 'canvas-component',
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

  // Apply visibility (but NOT display - display should be on the atomic component, not wrapper!)
  const visibility = component.props.visibility as 'visible' | 'hidden' | undefined;

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.3 : 1,
    zIndex: isSelected ? 10 : 1,
    pointerEvents: isDragging ? 'none' : 'auto',
    willChange: isDragging ? 'opacity' : 'auto',
    transition: 'opacity 100ms ease-out',
    ...(visibility && { visibility }),
    // CRITICAL FIX (V5.1.0): Add display: inline-block to allow child's margin to create space
    // Without this, wrapper shrinks to child's content box and margin has no effect
    display: 'inline-block',
    // NOTE: spacing (margin/padding) and other styling props are passed to atomic component via props, not applied to wrapper
  };

  const handleClick = (e: React.MouseEvent) => {
    logger.debug('🖱️ Component clicked:', {
      id: component.id,
      type: component.type,
      timestamp: new Date().toISOString(),
    });

    e.stopPropagation();
    selectComponent(component.id);

    toast.success(`Selected ${component.type}`, {
      duration: 1500,
      icon: '👆',
      position: 'bottom-right',
    });
  };

  const handleMouseEnter = () => {
    setHoveredComponent(component.id);
  };

  const handleMouseLeave = () => {
    setHoveredComponent(null);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    // Enable text editing for components with text content
    if (component.type === 'Badge' || component.type === 'Button' || component.type === 'Text' || component.type === 'Heading') {
      e.stopPropagation();

      // Find the actual component element
      const wrapper = document.querySelector(`[data-component-id="${component.id}"]`);
      if (wrapper) {
        // Find Badge span (or other text element)
        const textElement = wrapper.querySelector('[data-testid="badge"]') as HTMLElement;
        if (textElement) {
          // Make the element itself contentEditable
          textElement.contentEditable = 'true';
          textElement.focus();

          // Select all text
          const range = document.createRange();
          range.selectNodeContents(textElement);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);

          // Add visual indicator (outline)
          textElement.style.outline = '2px solid #3b82f6';
          textElement.style.outlineOffset = '2px';

          // Save on blur
          const handleBlur = () => {
            const newText = textElement.innerText.trim();
            if (newText && newText !== component.props.children) {
              updateComponentProps(component.id, {
                children: newText,
              });
            }
            textElement.contentEditable = 'false';
            textElement.style.outline = '';
            textElement.style.outlineOffset = '';
            textElement.removeEventListener('blur', handleBlur);
            textElement.removeEventListener('keydown', handleKeyDown);
          };

          // Save on Enter, cancel on Escape
          const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              textElement.blur();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              textElement.innerText = String(component.props.children || '');
              textElement.blur();
            }
          };

          textElement.addEventListener('blur', handleBlur);
          textElement.addEventListener('keydown', handleKeyDown);
        }
      }
    }
  };


  // ═══════════════════════════════════════════════════════════════
  // DIRECT ATOMIC COMPONENT RENDERING (NO ADAPTERS)
  // ═══════════════════════════════════════════════════════════════
  const renderVisualComponent = () => {
    const comp = componentWithResolvedStyles;

    // Get component from registry (type-safe)
    const AtomicComponent = COMPONENT_REGISTRY[component.type as keyof typeof COMPONENT_REGISTRY];

    if (!AtomicComponent) {
      logger.error('❌ Component not found:', component.type);
      return (
        <div className="p-6 bg-red-50 border-2 border-red-300 rounded-lg">
          <p className="text-sm font-semibold text-red-900">
            🚫 Component not found: <code className="bg-red-100 px-2 py-1 rounded">{component.type}</code>
          </p>
          <p className="text-xs text-red-700 mt-2">
            Available components: {Object.keys(COMPONENT_REGISTRY).slice(0, 10).join(', ')}...
          </p>
        </div>
      );
    }

    // Direct props passing - NO ADAPTER!
    const atomicProps = {
      ...comp.props, // Direct AtomParameters
      // Preserve style if exists
      ...(comp.style && { style: comp.style }),
    };

    // DEBUG: Log Badge props right before rendering
    if (component.type === 'Badge') {
      console.log(`📦 renderVisualComponent: About to render Badge with atomicProps:`, {
        fontWeight: atomicProps.fontWeight,
        fontSize: atomicProps.fontSize,
        fontFamily: atomicProps.fontFamily,
        propsKeys: Object.keys(atomicProps),
      });
    }

    // ═══════════════════════════════════════════════════════════════
    // SPECIAL HANDLING FOR MODAL IN EDITOR
    // ═══════════════════════════════════════════════════════════════
    if (component.type === 'Modal') {
      // Override onClose to actually close the modal in editor
      atomicProps.onClose = () => {
        logger.debug('🔴 Modal close clicked in editor, removing component');
        const { deleteComponent } = useCanvasStore.getState();
        deleteComponent(component.id);
        toast.success('Modal removed from canvas', {
          duration: 2000,
          icon: '✅',
          position: 'bottom-right',
        });
      };

      // Ensure modal is open in editor
      atomicProps.isOpen = true;

      // Make sure close button is visible
      atomicProps.showCloseButton = true;

      // Allow clicking overlay to close
      atomicProps.closeOnOverlayClick = true;

      logger.debug('🎭 Modal props overridden for editor:', {
        componentId: component.id,
        hasOnClose: !!atomicProps.onClose,
        isOpen: atomicProps.isOpen,
      });
    }

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

    // Render atomic component with direct props
    return <AtomicComponent {...atomicProps} />;
  };

  return (
    <div
      ref={setDragRef}
      data-component-id={component.id}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={cn(
        'relative cursor-auto transition-all',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/10',
        isHovered && !isSelected && 'ring-1 ring-slate-300 bg-slate-50',
        isOver && 'ring-2 ring-blue-400 bg-blue-50'
      )}
    >
      {/* Selection Label & Drag Handle */}
      {isSelected && (
        <>
          <div className="absolute -top-6 left-0 z-20 flex items-center gap-1">
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

          <ComponentToolbar componentId={component.id} position="top-right" />
        </>
      )}

      {/* Hover toolbar */}
      {isHovered && !isSelected && (
        <ComponentToolbar componentId={component.id} position="top-right" />
      )}

      {/* Visual Component with Contextual Editing Handles */}
      <div
        ref={canHaveChildren ? setDropRef : undefined}
        className="relative"
        style={{ pointerEvents: 'auto' }}
      >
        {/* ═══════════════════════════════════════════════════════════════
            CONTEXTUAL EDITING HANDLES (V2.0)
            ═══════════════════════════════════════════════════════════════
            Only ONE type of handles visible at a time (no overlapping)
            User toggles via ComponentToolbar buttons
            ═══════════════════════════════════════════════════════════════ */}

        {/* Spacing Handles - shown ONLY when visualEditingMode === 'spacing' */}
        {isSelected && visualEditingMode === 'spacing' && (
          <SpacingHandlesV2 componentId={component.id} />
        )}

        {/* Border Radius Handles - shown ONLY when visualEditingMode === 'borderRadius' */}
        {isSelected && visualEditingMode === 'borderRadius' && (
          <BorderRadiusHandles componentId={component.id} />
        )}

        {/* Transform Handles - shown ONLY when visualEditingMode === 'transform' */}
        {isSelected && visualEditingMode === 'transform' && (
          <TransformHandles componentId={component.id} />
        )}

        {renderVisualComponent()}
      </div>
    </div>
  );
}
