// ═══════════════════════════════════════════════════════════════
// CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - FIXED: Props now displayed on canvas
// TWO MODES:
// 1. Content Card (no children) - displays title, description, image from props
// 2. Container Card (has children) - wraps child components
// Features: Variants (default/bordered/elevated), optional link, image
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent, CardProps } from '@/lib/editor/types';
import { RenderComponent } from '@/components/editor/RenderComponent';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import Image from 'next/image';

interface CardComponentProps {
  component: CanvasComponent;
}

export function CardComponent({ component }: CardComponentProps) {
  const { props, style, children } = component;
  const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);

  // Cast props to CardProps for type safety
  const cardProps = props as CardProps;

  // Determine variant styles
  const variantClasses = {
    default: 'bg-white border border-slate-200 shadow-sm hover:shadow-md',
    bordered: 'bg-white border-2 border-slate-300 hover:border-slate-400',
    elevated: 'bg-white shadow-lg hover:shadow-xl border-0',
  };

  const baseClasses = 'rounded-lg transition-all duration-200';
  const variantClass = variantClasses[cardProps.variant || 'default'];

  // Check if card has content (MODE 1) or children (MODE 2)
  const hasChildren = children && children.length > 0;
  const hasContent = cardProps.title || cardProps.description || cardProps.image;

  // MODE 2: Container Card (has children)
  if (hasChildren) {
    return (
      <div
        className={`${baseClasses} ${variantClass} p-6 min-h-[150px]`}
        style={style as React.CSSProperties}
      >
        <div className="space-y-4">
          {children.map((child) => (
            <RenderComponent
              key={child.id}
              component={child}
              isSelected={child.id === selectedComponentId}
            />
          ))}
        </div>
      </div>
    );
  }

  // MODE 1: Content Card (no children, display props)
  const CardContent = (
    <div
      className={`${baseClasses} ${variantClass} overflow-hidden ${cardProps.href ? 'cursor-pointer' : ''}`}
      style={style as React.CSSProperties}
    >
      {/* Image (if provided) */}
      {cardProps.image && (
        <div className="relative w-full h-48 bg-slate-100">
          <Image
            src={cardProps.image}
            alt={cardProps.title || 'Card image'}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        {cardProps.title && (
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {cardProps.title}
          </h3>
        )}

        {/* Description */}
        {cardProps.description && (
          <p className="text-sm text-slate-600 leading-relaxed">
            {cardProps.description}
          </p>
        )}

        {/* Placeholder if no content */}
        {!hasContent && (
          <div className="flex items-center justify-center text-sm text-slate-400 py-8 min-h-[150px]">
            <div className="text-center">
              <div className="text-2xl mb-2">🃏</div>
              <p>Edit card properties →</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Wrap in link if href provided
  if (cardProps.href) {
    return (
      <a href={cardProps.href} className="block">
        {CardContent}
      </a>
    );
  }

  return CardContent;
}
