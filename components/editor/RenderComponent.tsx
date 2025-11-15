'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - RENDER COMPONENT V7.0 (GOD-TIER ARCHITECTURE)
// ═══════════════════════════════════════════════════════════════
// Version: 7.0 - NO WRAPPER ARCHITECTURE (ENTERPRISE-GRADE FIX)
// CRITICAL ARCHITECTURAL CHANGE:
// - REMOVED wrapper div completely ✅
// - Margin/Padding passed DIRECTLY to Badge props ✅
// - Badge controls its own margin/padding via CSS ✅
// - Display logic respects CSS box model (block→100%, inline-block→fit-content) ✅
// - SpacingHandlesV2 measures Badge directly (no wrapper confusion) ✅
//
// Benefits:
// - ✅ Proper separation of concerns
// - ✅ Badge is reusable outside editor
// - ✅ CSS box model compliant
// - ✅ No wrapper DOM overhead
// - ✅ Clean architecture (FAANG-level)
//
// Previous versions:
// - V6.0: Margin on wrapper (DEPRECATED - caused display issues)
// - V5.1.0: Margin spacing fix
// - V5.0.0: Direct atomic component rendering
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
import { getCanvasEnhancementClasses, getCanvasEnhancementStyles } from '@/lib/utils/canvas-enhancements';
import { parseCSS } from '@/lib/utils/css-to-tailwind';

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
  const { selectComponent, setHoveredComponent, hoveredComponentId, updateComponentProps, visualEditingMode, cssCompliantMode } = useCanvasStore();

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

  // ═══════════════════════════════════════════════════════════════
  // V7.0: GOD-TIER ARCHITECTURE - Margin directly on Badge, No Wrapper
  // ═══════════════════════════════════════════════════════════════
  // CRITICAL CHANGE: Margin/Padding now passed DIRECTLY to Badge props
  // - NO wrapper div around Badge
  // - Badge controls its own margin/padding via CSS
  // - Display logic respects CSS box model (block → 100%, inline-block → fit-content)
  // - SpacingHandlesV2 measures Badge directly (no wrapper confusion)
  // ═══════════════════════════════════════════════════════════════

  const visibility = component.props.visibility as 'visible' | 'hidden' | undefined;

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.3 : 1,
    zIndex: isSelected ? 10 : 1,
    pointerEvents: isDragging ? 'none' : 'auto',
    willChange: isDragging ? 'opacity' : 'auto',
    transition: 'opacity 100ms ease-out',
    ...(visibility && { visibility }),
    // V7.0: NO margin here - Badge controls its own margin!
    // V7.0: NO display override - Badge controls its own display mode!
    // V7.0: overflow visible for spacing overlays (if needed in future)
    overflow: 'visible',
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
      logger.error('❌ Component not found:', { type: component.type });
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

    // ═══════════════════════════════════════════════════════════════
    // V7.5: CUSTOM STYLING SUPPORT (CSS/Tailwind + ID/Class)
    // ═══════════════════════════════════════════════════════════════
    // Extract custom styling props (customCSS, customTailwind, id, className)
    // and merge them with component props for 10/10 custom styling experience
    // ═══════════════════════════════════════════════════════════════

    const {
      customCSS,
      customTailwind,
      id: customId,
      className: customClassName,
      ...restProps
    } = comp.props;

    // V7.5: Parse and merge custom CSS with component styles
    let mergedStyle = { ...comp.style } as React.CSSProperties;
    if (customCSS && typeof customCSS === 'string' && customCSS.trim()) {
      try {
        console.log('🎨 RenderComponent: Parsing customCSS:', { componentId: component.id, customCSS });
        const customStyles = parseCSS(customCSS);
        console.log('🎨 RenderComponent: Parsed CSS object:', customStyles);

        // ✨ FIX: Convert kebab-case to camelCase for React style object
        // React requires: fontSize, not font-size
        const camelCaseStyles: Record<string, any> = {};
        for (const [key, value] of Object.entries(customStyles)) {
          // Convert kebab-case to camelCase: font-size → fontSize
          const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          camelCaseStyles[camelKey] = value;
        }

        // ✨ FIX v2.0.1: Remove shorthand properties if longhand properties exist
        // React warns: "don't mix shorthand and non-shorthand properties"
        // If paddingTop/Right/Bottom/Left exist, remove padding
        const hasLonghandPadding = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].some(
          prop => prop in camelCaseStyles
        );
        if (hasLonghandPadding && 'padding' in camelCaseStyles) {
          delete camelCaseStyles.padding;
          console.log('🔧 RenderComponent: Removed shorthand padding (longhand properties exist)');
        }

        // If marginTop/Right/Bottom/Left exist, remove margin
        const hasLonghandMargin = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'].some(
          prop => prop in camelCaseStyles
        );
        if (hasLonghandMargin && 'margin' in camelCaseStyles) {
          delete camelCaseStyles.margin;
          console.log('🔧 RenderComponent: Removed shorthand margin (longhand properties exist)');
        }

        // If borderTopLeftRadius etc. exist, remove borderRadius
        const hasLonghandBorderRadius = [
          'borderTopLeftRadius',
          'borderTopRightRadius',
          'borderBottomRightRadius',
          'borderBottomLeftRadius'
        ].some(prop => prop in camelCaseStyles);
        if (hasLonghandBorderRadius && 'borderRadius' in camelCaseStyles) {
          delete camelCaseStyles.borderRadius;
          console.log('🔧 RenderComponent: Removed shorthand borderRadius (longhand properties exist)');
        }

        mergedStyle = { ...mergedStyle, ...camelCaseStyles };
        console.log('🎨 RenderComponent: Applied customCSS:', { componentId: component.id, camelCaseStyles, mergedStyle });

        // ✨ DEBUG v2.1: Log margin/padding values to verify units are preserved
        const spacingKeys = Object.keys(camelCaseStyles).filter(k => k.includes('margin') || k.includes('padding'));
        if (spacingKeys.length > 0) {
          console.log('🔍 RenderComponent: Spacing values from customCSS:', spacingKeys.reduce((acc, key) => ({ ...acc, [key]: camelCaseStyles[key] }), {}));
          console.log('🔍 RenderComponent: Final mergedStyle spacing:', spacingKeys.reduce((acc, key) => ({ ...acc, [key]: mergedStyle[key] }), {}));
        }
      } catch (error) {
        console.error('❌ RenderComponent: Failed to parse customCSS:', error);
      }
    }

    // V7.5: Merge custom Tailwind classes with existing className
    let mergedClassName = '';
    if (customClassName && typeof customClassName === 'string') {
      mergedClassName = customClassName;
    }
    if (customTailwind && typeof customTailwind === 'string' && customTailwind.trim()) {
      mergedClassName = mergedClassName
        ? `${mergedClassName} ${customTailwind}`
        : customTailwind;
      console.log('🎨 RenderComponent: Applied customTailwind:', { componentId: component.id, customTailwind });
    }

    // V7.5: Build atomic props with custom styling support
    const atomicProps: any = {
      ...restProps, // Pass ALL props (margin, padding, display, etc.)
      ...(customId && { id: customId }), // Apply custom HTML id
      ...(mergedClassName && { className: mergedClassName }), // Apply custom classes
      ...(Object.keys(mergedStyle).length > 0 && { style: mergedStyle }), // Apply merged styles
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

    // Render all components with spread props (V7.0 architecture)
    return <AtomicComponent {...atomicProps} />;
  };

  // ═══════════════════════════════════════════════════════════════
  // V8.0: RESPONSIVE VISIBILITY (Enterprise Canvas Enhancement System)
  // ═══════════════════════════════════════════════════════════════
  // CRITICAL: In EDITOR mode, we SHOW all components with visual indicator (gray)
  // Tailwind classes (max-sm:hidden, lg:hidden) are for PRODUCTION ONLY!
  //
  // Editor Mode Behavior:
  // - Component always visible (no CSS hiding)
  // - Visual indicator when hidden: gray + opacity 0.4
  // - User sees which components are hidden on current device
  //
  // Production Mode Behavior (future export):
  // - Tailwind responsive classes applied
  // - CSS-based hiding (max-sm:hidden, lg:hidden)
  // - SEO-friendly (content in DOM)
  // ═══════════════════════════════════════════════════════════════

  // Get editor visual indicator styles ONLY (no Tailwind classes in editor!)
  const editorVisibilityStyles = getCanvasEnhancementStyles(
    {
      hideOnMobile: component.props.hideOnMobile as boolean | undefined,
      hideOnTablet: component.props.hideOnTablet as boolean | undefined,
      hideOnDesktop: component.props.hideOnDesktop as boolean | undefined,
    },
    deviceMode,
    true // Always in editor mode
  );

  // NOTE: responsiveVisibilityClasses (Tailwind) will be applied during
  // React export / production build, NOT in editor mode

  return (
    <div
      ref={setDragRef}
      data-component-id={component.id}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        ...editorVisibilityStyles, // Gray + opacity when hidden on current device
      }}
      className={cn(
        'relative cursor-auto transition-all',
        isSelected && 'ring-2 ring-blue-500 bg-blue-50/10',
        isHovered && !isSelected && 'ring-1 ring-slate-300 bg-slate-50',
        isOver && 'ring-2 ring-blue-400 bg-blue-50'
        // NOTE: No responsiveVisibilityClasses here! Editor shows all components.
        // Tailwind classes will be added during React export generation.
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
        style={{
          pointerEvents: 'auto',
          // V7.0 CONDITIONAL: display:flow-root based on cssCompliantMode
          // Visual Mode (default): flow-root prevents margin collapse, keeps margin inside
          // CSS-compliant Mode: undefined allows natural CSS margin collapse
          display: cssCompliantMode ? undefined : 'flow-root',
        }}
      >
        {/* ═══════════════════════════════════════════════════════════════
            CONTEXTUAL EDITING HANDLES (V2.0)
            ═══════════════════════════════════════════════════════════════
            Only ONE type of handles visible at a time (no overlapping)
            User toggles via ComponentToolbar buttons

            V7.0 ARCHITECTURE NOTE:
            - Padding/BorderRadius/Transform handles: render INSIDE (they work within Badge)
            - Margin handles: ALSO render inside (margin is CSS property on Badge now!)
            ═══════════════════════════════════════════════════════════════ */}

        {/* Padding Handles - shown ONLY when visualEditingMode === 'padding' */}
        {isSelected && visualEditingMode === 'padding' && (
          <SpacingHandlesV2
            componentId={component.id}
            mode="padding"
            paddingTopUnit={component.props.paddingTopUnit}
            paddingRightUnit={component.props.paddingRightUnit}
            paddingBottomUnit={component.props.paddingBottomUnit}
            paddingLeftUnit={component.props.paddingLeftUnit}
          />
        )}

        {/* Border Radius Handles - shown ONLY when visualEditingMode === 'borderRadius' */}
        {isSelected && visualEditingMode === 'borderRadius' && (
          <BorderRadiusHandles
            componentId={component.id}
            borderRadiusTopLeftUnit={component.props.borderRadiusTopLeftUnit}
            borderRadiusTopRightUnit={component.props.borderRadiusTopRightUnit}
            borderRadiusBottomLeftUnit={component.props.borderRadiusBottomLeftUnit}
            borderRadiusBottomRightUnit={component.props.borderRadiusBottomRightUnit}
          />
        )}

        {/* Transform Handles - shown ONLY when visualEditingMode === 'transform' */}
        {isSelected && visualEditingMode === 'transform' && (
          <TransformHandles componentId={component.id} />
        )}

        {renderVisualComponent()}

        {/* V7.0: Margin Handles render AFTER component (so they can use negative positioning) */}
        {isSelected && visualEditingMode === 'margin' && (
          <SpacingHandlesV2
            componentId={component.id}
            mode="margin"
            marginTopUnit={component.props.marginTopUnit}
            marginRightUnit={component.props.marginRightUnit}
            marginBottomUnit={component.props.marginBottomUnit}
            marginLeftUnit={component.props.marginLeftUnit}
          />
        )}
      </div>
    </div>
  );
}
