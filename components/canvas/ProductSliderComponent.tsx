// ═══════════════════════════════════════════════════════════════
// PRODUCT SLIDER COMPONENT - M3 E-commerce
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Professional carousel slider for products
// Features:
// - Horizontal scrollable carousel
// - Navigation arrows
// - Responsive grid (1-4 columns)
// - Product cards with image, name, price, Add to Cart
// - Smooth scroll animation
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState, useRef } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export function ProductSliderComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Get products from props (default to empty array)
  const products = (props.products as ProductItem[] | undefined) || [];
  const slidesToShow = (props.slidesToShow as number) || 4;

  // Check scroll position
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  // Scroll left/right
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of visible width
    const newScrollLeft = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    // Update buttons after scroll animation
    setTimeout(checkScroll, 300);
  };

  // Empty state
  if (products.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
        <div className="text-center text-slate-500">
          <div className="text-4xl mb-2">🛒</div>
          <p className="text-sm font-medium">No products added</p>
          <p className="text-xs mt-1">Add products in the properties panel →</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Previous products"
        >
          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Products Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div
          className="grid gap-4 px-2 py-4"
          style={{
            gridTemplateColumns: `repeat(${products.length}, minmax(${100 / slidesToShow}%, 300px))`,
            gridAutoFlow: 'column'
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-slate-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="relative w-full h-48 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-green-600 mb-3">
                  ${product.price.toFixed(2)}
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next products"
        >
          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
