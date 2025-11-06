'use client';

// ═══════════════════════════════════════════════════════════════
// TESTIMONIALS CONTROL - CRUD for Testimonial Component
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - Manage customer testimonials
// Features:
// - Add/Remove/Edit testimonials
// - Drag & drop to reorder
// - Quote, author, role, company, rating, avatar editing
// - Star rating selector (1-5)
// - Real-time updates
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ItemsEditor } from './ItemsEditor';
import { logger } from '@/lib/utils/logger';
import { Star } from 'lucide-react';

interface TestimonialsControlProps {
  componentId: string;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  company?: string;
  rating?: number; // 1-5 stars
  [key: string]: unknown;
}

export function TestimonialsControl({ componentId }: TestimonialsControlProps) {
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

  // Default testimonials
  const defaultItems: Testimonial[] = [
    {
      id: 'testimonial-1',
      quote: 'This product transformed our business. The ROI was immediate and the support team is outstanding!',
      author: 'Sarah Johnson',
      role: 'CEO',
      company: 'TechCorp Inc.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 'testimonial-2',
      quote: 'Absolutely game-changing. We increased our conversion rate by 3x in the first month.',
      author: 'Michael Chen',
      role: 'Marketing Director',
      company: 'Growth Co.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: 'testimonial-3',
      quote: 'Best investment we made this year. The features are powerful yet easy to use.',
      author: 'Emma Williams',
      role: 'Product Manager',
      company: 'Innovate LLC',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  ];

  const [items, setItems] = useState<Testimonial[]>(() => {
    if (!component) return defaultItems;
    const currentItems = component.props.testimonials as Testimonial[] | undefined;
    return currentItems && currentItems.length > 0 ? currentItems : defaultItems;
  });

  // Sync with component changes
  useEffect(() => {
    if (!component) return;
    const currentItems = component.props.testimonials as Testimonial[] | undefined;
    if (currentItems && currentItems.length > 0) {
      setItems(currentItems);
    }
  }, [component]);

  // Handle items change
  const handleItemsChange = (newItems: Testimonial[]) => {
    logger.debug('🔄 TestimonialsControl: Updating testimonials', {
      componentId,
      newItems,
      itemsCount: newItems.length
    });
    setItems(newItems);
    updateComponentProps(componentId, { testimonials: newItems });
    logger.debug('✅ TestimonialsControl: updateComponentProps called');
  };

  // Render star rating selector
  const renderStarRating = (currentRating: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-0.5 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-5 h-5 ${
                star <= currentRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Render item editor
  const renderItemEditor = (
    item: Testimonial,
    onChange: (updates: Partial<Testimonial>) => void
  ) => {
    return (
      <div className="space-y-4">
        {/* Quote */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">
            Quote (Testimonial Text)
          </label>
          <textarea
            value={item.quote}
            onChange={(e) => onChange({ quote: e.target.value })}
            placeholder="Share your experience with our product..."
            rows={4}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
          <p className="text-xs text-slate-500 mt-1">
            {item.quote.length} characters
          </p>
        </div>

        {/* Author */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Author Name</label>
          <input
            type="text"
            value={item.author}
            onChange={(e) => onChange({ author: e.target.value })}
            placeholder="John Doe"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Role */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Role / Title</label>
          <input
            type="text"
            value={item.role || ''}
            onChange={(e) => onChange({ role: e.target.value })}
            placeholder="CEO, Product Manager, etc."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Company */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Company</label>
          <input
            type="text"
            value={item.company || ''}
            onChange={(e) => onChange({ company: e.target.value })}
            placeholder="Company Name"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-2 block">
            Rating ({item.rating || 5}/5 stars)
          </label>
          {renderStarRating(item.rating || 5, (rating) => onChange({ rating }))}
        </div>

        {/* Avatar URL */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Avatar URL</label>
          <input
            type="url"
            value={item.avatar || ''}
            onChange={(e) => onChange({ avatar: e.target.value })}
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {item.avatar && (
            <div className="mt-2">
              <img
                src={item.avatar}
                alt="Avatar preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
              />
            </div>
          )}
          <p className="text-xs text-slate-500 mt-1">
            💡 Tip: Use <a href="https://i.pravatar.cc" target="_blank" rel="noopener" className="text-blue-600 hover:underline">pravatar.cc</a> for random avatars
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-green-50 p-3 rounded border border-green-200">
        <p className="text-xs text-green-900 font-medium">
          💬 Social Proof: Testimonials increase conversion by 34% on average
        </p>
      </div>

      <ItemsEditor
        items={items}
        onItemsChange={handleItemsChange}
        itemTemplate={{
          quote: 'Great product! Highly recommended.',
          author: 'Happy Customer',
          role: 'Customer',
          company: 'Company Name',
          rating: 5,
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
        }}
        renderItemEditor={renderItemEditor}
        itemLabel="Testimonial"
      />
    </div>
  );
}
