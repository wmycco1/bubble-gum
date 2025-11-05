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
import type { CanvasComponent, Breakpoint } from '@/lib/editor/types';
import { getResponsiveStyles } from '@/lib/editor/types';
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
import { NavbarComponent } from '@/components/canvas/NavbarComponent';
import { HeroComponent } from '@/components/canvas/HeroComponent';
import { FooterComponent } from '@/components/canvas/FooterComponent';
import { FeaturesComponent } from '@/components/canvas/FeaturesComponent';
import { CTAComponent } from '@/components/canvas/CTAComponent';
import { HeadingComponent } from '@/components/canvas/HeadingComponent';
import { LinkComponent } from '@/components/canvas/LinkComponent';
import { IconComponent } from '@/components/canvas/IconComponent';
import { TextareaComponent } from '@/components/canvas/TextareaComponent';
import { CheckboxComponent } from '@/components/canvas/CheckboxComponent';
import { SubmitComponent } from '@/components/canvas/SubmitComponent';
// M2: New Interactive Components
import { AccordionComponent } from '@/components/canvas/AccordionComponent';
import { TabsComponent } from '@/components/canvas/TabsComponent';
import { CounterComponent } from '@/components/canvas/CounterComponent';
import { ProgressComponent } from '@/components/canvas/ProgressComponent';
import { TooltipComponent } from '@/components/canvas/TooltipComponent';
import { ModalComponent } from '@/components/canvas/ModalComponent';
import { AlertComponent } from '@/components/canvas/AlertComponent';
import { BadgeComponent } from '@/components/canvas/BadgeComponent';
import { BreadcrumbComponent } from '@/components/canvas/BreadcrumbComponent';
import { DividerComponent } from '@/components/canvas/DividerComponent';
import { CarouselComponent } from '@/components/canvas/CarouselComponent';

interface RenderComponentProps {
  component: CanvasComponent;
  isSelected: boolean;
  deviceMode?: Breakpoint;
}

export function RenderComponent({ component, isSelected, deviceMode = 'desktop' }: RenderComponentProps) {
  const { selectComponent, setHoveredComponent, hoveredComponentId, deleteComponent } =
    useCanvasStore();

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
    transform,
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

  // Render visual component based on type (with resolved responsive styles)
  const renderVisualComponent = () => {
    const comp = componentWithResolvedStyles;

    switch (component.type) {
      case 'Section':
      case 'SectionComponent':
        return <SectionComponent component={comp} />;

      case 'Text':
      case 'Heading':
      case 'TextComponent':
        return <TextComponent component={comp} />;

      case 'Image':
      case 'ImageComponent':
        return <ImageComponent component={comp} />;

      case 'Button':
      case 'ButtonComponent':
        return <ButtonComponent component={comp} />;

      case 'Input':
      case 'InputComponent':
        return <InputComponent component={comp} />;

      case 'Form':
      case 'FormComponent':
        return <FormComponent component={comp} />;

      case 'Container':
      case 'ContainerComponent':
        return <ContainerComponent component={comp} />;

      case 'Grid':
      case 'GridComponent':
        return <GridComponent component={comp} />;

      case 'Card':
      case 'CardComponent':
        return <CardComponent component={comp} />;

      case 'Navbar':
      case 'NavbarComponent':
        return <NavbarComponent component={comp} />;

      case 'Hero':
      case 'HeroComponent':
        return <HeroComponent component={comp} />;

      case 'Footer':
      case 'FooterComponent':
        return <FooterComponent component={comp} />;

      case 'Features':
      case 'FeaturesComponent':
        return <FeaturesComponent component={comp} />;

      case 'CTA':
      case 'CTAComponent':
        return <CTAComponent component={comp} />;

      case 'Heading':
      case 'HeadingComponent':
        return <HeadingComponent component={comp} />;

      case 'Link':
      case 'LinkComponent':
        return <LinkComponent component={comp} />;

      case 'Icon':
      case 'IconComponent':
        return <IconComponent component={comp} />;

      case 'Textarea':
      case 'TextareaComponent':
        return <TextareaComponent component={comp} />;

      case 'Checkbox':
      case 'CheckboxComponent':
        return <CheckboxComponent component={comp} />;

      case 'Submit':
      case 'SubmitComponent':
        return <SubmitComponent component={comp} />;

      // M2: New Interactive Components
      case 'Accordion':
      case 'AccordionComponent':
        return <AccordionComponent component={comp} />;

      case 'Tabs':
      case 'TabsComponent':
        return <TabsComponent component={comp} />;

      case 'Counter':
      case 'CounterComponent':
        return <CounterComponent component={comp} />;

      case 'Progress':
      case 'ProgressComponent':
        return <ProgressComponent component={comp} />;

      case 'Tooltip':
      case 'TooltipComponent':
        return <TooltipComponent component={comp} />;

      case 'Modal':
      case 'ModalComponent':
        return <ModalComponent component={comp} />;

      case 'Alert':
      case 'AlertComponent':
        return <AlertComponent component={comp} />;

      case 'Badge':
      case 'BadgeComponent':
        return <BadgeComponent component={comp} />;

      case 'Breadcrumb':
      case 'BreadcrumbComponent':
        return <BreadcrumbComponent component={comp} />;

      case 'Divider':
      case 'DividerComponent':
        return <DividerComponent component={comp} />;

      case 'Carousel':
      case 'CarouselComponent':
        return <CarouselComponent component={comp} />;

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
      {/* Selection Label & Actions */}
      {isSelected && (
        <div className="absolute -top-6 left-0 right-0 z-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
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
