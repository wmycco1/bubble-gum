'use client';

// ═══════════════════════════════════════════════════════════════
// CAROUSEL ITEMS CONTROL - CRUD for Carousel Slides
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - PHASE 2: CRUD Controls for Interactive Components
// Features:
// - Add/Remove/Edit carousel slides
// - Drag & drop to reorder
// - Image, title, and description editing
// - Real-time updates
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ItemsEditor } from './ItemsEditor';
import { Image as ImageIcon } from 'lucide-react';

interface CarouselItemsControlProps {
  componentId: string;
}

interface CarouselSlide {
  id: string;
  image: string;
  title?: string;
  description?: string;
  [key: string]: unknown;
}

export function CarouselItemsControl({ componentId }: CarouselItemsControlProps) {
  const components = useCanvasStore((state) => state.components);
  const updateComponentProps = useCanvasStore((state) => state.updateComponentProps);

  // Find current component
  const findComponent = (comps: typeof components, id: string): typeof components[0] | null => {
    for (const comp of comps) {
      if (comp.id === id) return comp;
      if (comp.children) {
        const found = findComponent(comp.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const component = findComponent(components, componentId);

  // Default slides
  const defaultSlides: CarouselSlide[] = [
    {
      id: 'slide-1',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      title: 'Slide 1',
      description: 'First slide description',
    },
    {
      id: 'slide-2',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      title: 'Slide 2',
      description: 'Second slide description',
    },
    {
      id: 'slide-3',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      title: 'Slide 3',
      description: 'Third slide description',
    },
  ];

  const [slides, setSlides] = useState<CarouselSlide[]>(() => {
    if (!component) return defaultSlides;
    const currentSlides = component.props.slides as CarouselSlide[] | undefined;
    return currentSlides && currentSlides.length > 0 ? currentSlides : defaultSlides;
  });

  // Sync with component changes
  useEffect(() => {
    if (!component) return;
    const currentSlides = component.props.slides as CarouselSlide[] | undefined;
    if (currentSlides && currentSlides.length > 0) {
      setSlides(currentSlides);
    }
  }, [component]);

  // Handle slides change
  const handleSlidesChange = (newSlides: CarouselSlide[]) => {
    setSlides(newSlides);
    updateComponentProps(componentId, { slides: newSlides });
  };

  // Render slide editor
  const renderSlideEditor = (
    slide: CarouselSlide,
    onChange: (updates: Partial<CarouselSlide>) => void
  ) => {
    return (
      <div className="space-y-3">
        {/* Image URL */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            Image URL
          </label>
          <input
            type="text"
            value={slide.image}
            onChange={(e) => onChange({ image: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Unsplash, local upload, or any URL
          </p>
        </div>

        {/* Image Preview */}
        {slide.image && (
          <div className="border border-slate-200 rounded-md overflow-hidden">
            <img
              src={slide.image}
              alt={slide.title || 'Slide preview'}
              className="w-full h-32 object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        )}

        {/* Title */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">
            Title (optional)
          </label>
          <input
            type="text"
            value={slide.title || ''}
            onChange={(e) => onChange({ title: e.target.value || undefined })}
            placeholder="Enter slide title..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">
            Description (optional)
          </label>
          <textarea
            value={slide.description || ''}
            onChange={(e) => onChange({ description: e.target.value || undefined })}
            placeholder="Enter slide description..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
      </div>
    );
  };

  return (
    <ItemsEditor
      items={slides}
      onItemsChange={handleSlidesChange}
      itemTemplate={{
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        title: 'New Slide',
        description: 'Slide description...',
      }}
      renderItemEditor={renderSlideEditor}
      itemLabel="Slide"
    />
  );
}
