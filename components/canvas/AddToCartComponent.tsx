// ═══════════════════════════════════════════════════════════════
// ADD TO CART COMPONENT - M3 E-commerce
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Professional add to cart button with quantity
// Features:
// - Quantity selector (+/- buttons)
// - Add to Cart button
// - Customizable button text and colors
// - Success state animation
// - Stock availability display
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';

export function AddToCartComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Props with defaults
  const buttonText = (props.buttonText as string) || 'Add to Cart';
  const showQuantity = (props.showQuantity as boolean) ?? true;
  const maxQuantity = (props.maxQuantity as number) || 99;
  const stockStatus = (props.stockStatus as 'in-stock' | 'low-stock' | 'out-of-stock') || 'in-stock';
  const buttonColor = (props.buttonColor as string) || 'blue';

  // Handle quantity change
  const increaseQuantity = () => {
    if (quantity < maxQuantity) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (stockStatus === 'out-of-stock') return;

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Stock badge
  const stockBadge = {
    'in-stock': { text: 'In Stock', color: 'bg-green-100 text-green-800' },
    'low-stock': { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' },
    'out-of-stock': { text: 'Out of Stock', color: 'bg-red-100 text-red-800' }
  }[stockStatus];

  // Button colors
  const buttonColors = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    black: 'bg-slate-900 hover:bg-slate-800',
  }[buttonColor] || 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="space-y-3">
      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium px-2 py-1 rounded ${stockBadge.color}`}>
          {stockBadge.text}
        </span>
      </div>

      {/* Quantity Selector */}
      {showQuantity && stockStatus !== 'out-of-stock' && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">Quantity:</label>
          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.max(1, Math.min(maxQuantity, val)));
              }}
              min="1"
              max={maxQuantity}
              className="w-16 text-center py-2 border-x border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={increaseQuantity}
              disabled={quantity >= maxQuantity}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={stockStatus === 'out-of-stock'}
        className={`
          w-full px-6 py-3 rounded-lg text-white font-semibold
          transition-all duration-200 flex items-center justify-center gap-2
          disabled:bg-slate-300 disabled:cursor-not-allowed
          ${stockStatus !== 'out-of-stock' ? buttonColors : ''}
          ${isAdded ? 'scale-95' : 'hover:scale-105'}
        `}
      >
        {isAdded ? (
          <>
            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Added to Cart!
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {buttonText}
          </>
        )}
      </button>

      {/* Max quantity notice */}
      {showQuantity && quantity >= maxQuantity && stockStatus !== 'out-of-stock' && (
        <p className="text-xs text-amber-600">Maximum quantity reached</p>
      )}
    </div>
  );
}
