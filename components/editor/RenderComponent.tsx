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
// M3: Extended Component Library
import { InnerSectionComponent } from '@/components/canvas/InnerSectionComponent';
import { SpacerComponent } from '@/components/canvas/SpacerComponent';
import { BannerComponent } from '@/components/canvas/BannerComponent';
import { HTMLComponent } from '@/components/canvas/HTMLComponent';
import { VideoComponent } from '@/components/canvas/VideoComponent';
import { TextEditorComponent } from '@/components/canvas/TextEditorComponent';
import { IconBoxComponent } from '@/components/canvas/IconBoxComponent';
import { ImageBoxComponent } from '@/components/canvas/ImageBoxComponent';
import { IconListComponent } from '@/components/canvas/IconListComponent';
import { GoogleMapsComponent } from '@/components/canvas/GoogleMapsComponent';
import { SoundCloudComponent } from '@/components/canvas/SoundCloudComponent';
import { SocialIconsComponent } from '@/components/canvas/SocialIconsComponent';
import { FacebookLikeComponent } from '@/components/canvas/FacebookLikeComponent';
import { FacebookContentComponent } from '@/components/canvas/FacebookContentComponent';
import { BannerSliderComponent } from '@/components/canvas/BannerSliderComponent';
import { SliderComponent } from '@/components/canvas/SliderComponent';
import { ToggleComponent } from '@/components/canvas/ToggleComponent';
import { TestimonialComponent } from '@/components/canvas/TestimonialComponent';
import { StarRatingComponent } from '@/components/canvas/StarRatingComponent';
import { MenuComponent } from '@/components/canvas/MenuComponent';
import { ProductListComponent } from '@/components/canvas/ProductListComponent';
import { ProductSliderComponent } from '@/components/canvas/ProductSliderComponent';
import { AddToCartComponent } from '@/components/canvas/AddToCartComponent';
import { PricingTableComponent } from '@/components/canvas/PricingTableComponent';
import { RecentlyViewedComponent } from '@/components/canvas/RecentlyViewedComponent';
import { RecentlyComparedComponent } from '@/components/canvas/RecentlyComparedComponent';
import { NewProductsComponent } from '@/components/canvas/NewProductsComponent';
import { FormBuilderComponent } from '@/components/canvas/FormBuilderComponent';
import { MultistepFormBuilderComponent } from '@/components/canvas/MultistepFormBuilderComponent';
import { CMSBlockComponent } from '@/components/canvas/CMSBlockComponent';
import { CMSPageComponent } from '@/components/canvas/CMSPageComponent';
import { OrdersAndReturnsComponent } from '@/components/canvas/OrdersAndReturnsComponent';
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

      // M3: Extended Component Library
      case 'InnerSection':
      case 'InnerSectionComponent':
        return <InnerSectionComponent component={comp} />;

      case 'Spacer':
      case 'SpacerComponent':
        return <SpacerComponent component={comp} />;

      case 'Banner':
      case 'BannerComponent':
        return <BannerComponent component={comp} />;

      case 'HTML':
      case 'HTMLComponent':
        return <HTMLComponent component={comp} />;

      case 'Video':
      case 'VideoComponent':
        return <VideoComponent component={comp} />;

      case 'TextEditor':
      case 'TextEditorComponent':
        return <TextEditorComponent component={comp} />;

      case 'IconBox':
      case 'IconBoxComponent':
        return <IconBoxComponent component={comp} />;

      case 'ImageBox':
      case 'ImageBoxComponent':
        return <ImageBoxComponent component={comp} />;

      case 'IconList':
      case 'IconListComponent':
        return <IconListComponent component={comp} />;

      case 'GoogleMaps':
      case 'GoogleMapsComponent':
        return <GoogleMapsComponent component={comp} />;

      case 'SoundCloud':
      case 'SoundCloudComponent':
        return <SoundCloudComponent component={comp} />;

      case 'SocialIcons':
      case 'SocialIconsComponent':
        return <SocialIconsComponent component={comp} />;

      case 'FacebookLike':
      case 'FacebookLikeComponent':
        return <FacebookLikeComponent component={comp} />;

      case 'FacebookContent':
      case 'FacebookContentComponent':
        return <FacebookContentComponent component={comp} />;

      case 'BannerSlider':
      case 'BannerSliderComponent':
        return <BannerSliderComponent component={comp} />;

      case 'Slider':
      case 'SliderComponent':
        return <SliderComponent component={comp} />;

      case 'Toggle':
      case 'ToggleComponent':
        return <ToggleComponent component={comp} />;

      case 'Testimonial':
      case 'TestimonialComponent':
        return <TestimonialComponent component={comp} />;

      case 'StarRating':
      case 'StarRatingComponent':
        return <StarRatingComponent component={comp} />;

      case 'Menu':
      case 'MenuComponent':
        return <MenuComponent component={comp} />;

      case 'ProductList':
      case 'ProductListComponent':
        return <ProductListComponent component={comp} />;

      case 'ProductSlider':
      case 'ProductSliderComponent':
        return <ProductSliderComponent component={comp} />;

      case 'AddToCart':
      case 'AddToCartComponent':
        return <AddToCartComponent component={comp} />;

      case 'PricingTable':
      case 'PricingTableComponent':
        return <PricingTableComponent component={comp} />;

      case 'RecentlyViewed':
      case 'RecentlyViewedComponent':
        return <RecentlyViewedComponent component={comp} />;

      case 'RecentlyCompared':
      case 'RecentlyComparedComponent':
        return <RecentlyComparedComponent component={comp} />;

      case 'NewProducts':
      case 'NewProductsComponent':
        return <NewProductsComponent component={comp} />;

      case 'FormBuilder':
      case 'FormBuilderComponent':
        return <FormBuilderComponent component={comp} />;

      case 'MultistepFormBuilder':
      case 'MultistepFormBuilderComponent':
        return <MultistepFormBuilderComponent component={comp} />;

      case 'CMSBlock':
      case 'CMSBlockComponent':
        return <CMSBlockComponent component={comp} />;

      case 'CMSPage':
      case 'CMSPageComponent':
        return <CMSPageComponent component={comp} />;

      case 'OrdersAndReturns':
      case 'OrdersAndReturnsComponent':
        return <OrdersAndReturnsComponent component={comp} />;

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
