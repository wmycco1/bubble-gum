// ═══════════════════════════════════════════════════════════════
// TESTIMONIAL COMPONENT - M3 Extended Library
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Multiple testimonials with CRUD control
// Features:
// - Display multiple testimonials in grid/carousel
// - Quote, author, role, avatar support
// - Star rating display
// - Company logo (optional)
// - Layout modes: grid, carousel, single
// - Professional testimonial card design
// - High-conversion social proof UX
// ═══════════════════════════════════════════════════════════════

'use client';

import type { CanvasComponent } from '@/lib/editor/types';
import { Star } from 'lucide-react';

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

export function TestimonialComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;

  const testimonials = (props.testimonials as Testimonial[] | undefined) || [
    {
      id: '1',
      quote: 'This product transformed our business. The ROI was immediate and the support team is outstanding!',
      author: 'Sarah Johnson',
      role: 'CEO',
      company: 'TechCorp Inc.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: '2',
      quote: 'Absolutely game-changing. We increased our conversion rate by 3x in the first month.',
      author: 'Michael Chen',
      role: 'Marketing Director',
      company: 'Growth Co.',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: '3',
      quote: 'Best investment we made this year. The features are powerful yet easy to use.',
      author: 'Emma Williams',
      role: 'Product Manager',
      company: 'Innovate LLC',
      rating: 5,
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  ];

  const layout = (props.layout as 'grid' | 'carousel' | 'single') || 'grid';
  const showRating = (props.showRating as boolean) ?? true;
  const showAvatar = (props.showAvatar as boolean) ?? true;
  const showCompany = (props.showCompany as boolean) ?? true;

  // Empty state
  if (testimonials.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
        <div className="text-center text-slate-500">
          <div className="text-4xl mb-2">💬</div>
          <p className="text-sm font-medium">No testimonials added</p>
          <p className="text-xs mt-1">Add testimonials in the properties panel →</p>
        </div>
      </div>
    );
  }

  // Render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Render testimonial card
  const renderTestimonialCard = (testimonial: Testimonial) => (
    <div
      key={testimonial.id}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
    >
      {/* Rating */}
      {showRating && testimonial.rating && (
        <div className="mb-4">{renderStars(testimonial.rating)}</div>
      )}

      {/* Quote */}
      <blockquote className="text-slate-700 mb-6 leading-relaxed">
        "{testimonial.quote}"
      </blockquote>

      {/* Author Info */}
      <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
        {/* Avatar */}
        {showAvatar && testimonial.avatar && (
          <img
            src={testimonial.avatar}
            alt={testimonial.author}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}

        {/* Details */}
        <div className="flex-1">
          <div className="font-semibold text-slate-900">{testimonial.author}</div>
          {testimonial.role && (
            <div className="text-sm text-slate-600">{testimonial.role}</div>
          )}
          {showCompany && testimonial.company && (
            <div className="text-xs text-slate-500 mt-0.5">{testimonial.company}</div>
          )}
        </div>
      </div>
    </div>
  );

  // Single layout
  if (layout === 'single') {
    const firstTestimonial = testimonials[0];
    if (!firstTestimonial) return null;

    return (
      <div className="max-w-2xl mx-auto">
        {renderTestimonialCard(firstTestimonial)}
      </div>
    );
  }

  // Carousel layout (simplified - horizontal scroll)
  if (layout === 'carousel') {
    return (
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex-shrink-0 w-full md:w-96 snap-center">
              {renderTestimonialCard(testimonial)}
            </div>
          ))}
        </div>
        {/* Scroll indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-slate-300"
            />
          ))}
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => renderTestimonialCard(testimonial))}
    </div>
  );
}
