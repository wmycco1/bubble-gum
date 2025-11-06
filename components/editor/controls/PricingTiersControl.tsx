'use client';

// ═══════════════════════════════════════════════════════════════
// PRICING TIERS CONTROL - CRUD for Pricing Tables
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - E-commerce Component Controls
// Features:
// - Add/Remove/Edit pricing tiers
// - Drag & drop to reorder
// - Name, price, description, features editing
// - Highlighted tier toggle
// - Real-time updates
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ItemsEditor } from './ItemsEditor';
import { logger } from '@/lib/utils/logger';

interface PricingTiersControlProps {
  componentId: string;
}

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlighted: boolean;
  [key: string]: unknown;
}

export function PricingTiersControl({ componentId }: PricingTiersControlProps) {
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

  // Default pricing tiers
  const defaultItems: PricingTier[] = [
    {
      id: 'tier-1',
      name: 'Free',
      price: '$0',
      period: 'month',
      description: 'Perfect for getting started',
      features: [
        '1 project',
        'Basic features',
        'Community support',
        '5GB storage'
      ],
      buttonText: 'Get Started',
      buttonLink: '#',
      highlighted: false
    },
    {
      id: 'tier-2',
      name: 'Pro',
      price: '$29',
      period: 'month',
      description: 'For growing businesses',
      features: [
        '10 projects',
        'Advanced features',
        'Priority support',
        '100GB storage',
        'Custom domain'
      ],
      buttonText: 'Start Trial',
      buttonLink: '#',
      highlighted: true
    },
    {
      id: 'tier-3',
      name: 'Enterprise',
      price: '$99',
      period: 'month',
      description: 'For large organizations',
      features: [
        'Unlimited projects',
        'All features',
        '24/7 dedicated support',
        'Unlimited storage',
        'SSO & SAML',
        'Advanced security'
      ],
      buttonText: 'Contact Sales',
      buttonLink: '#',
      highlighted: false
    }
  ];

  const [items, setItems] = useState<PricingTier[]>(() => {
    if (!component) return defaultItems;
    const currentItems = component.props.tiers as PricingTier[] | undefined;
    return currentItems && currentItems.length > 0 ? currentItems : defaultItems;
  });

  // Sync with component changes
  useEffect(() => {
    if (!component) return;
    const currentItems = component.props.tiers as PricingTier[] | undefined;
    if (currentItems && currentItems.length > 0) {
      setItems(currentItems);
    }
  }, [component]);

  // Handle items change
  const handleItemsChange = (newItems: PricingTier[]) => {
    logger.debug('🔄 PricingTiersControl: Updating tiers', {
      componentId,
      newItems,
      itemsCount: newItems.length
    });
    setItems(newItems);
    updateComponentProps(componentId, { tiers: newItems });
    logger.debug('✅ PricingTiersControl: updateComponentProps called');
  };

  // Render item editor
  const renderItemEditor = (
    item: PricingTier,
    onChange: (updates: Partial<PricingTier>) => void
  ) => {
    return (
      <div className="space-y-3">
        {/* Tier Name */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Tier Name</label>
          <input
            type="text"
            value={item.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g., Pro, Enterprise"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">Price</label>
            <input
              type="text"
              value={item.price}
              onChange={(e) => onChange({ price: e.target.value })}
              placeholder="$29"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">Period</label>
            <input
              type="text"
              value={item.period}
              onChange={(e) => onChange({ period: e.target.value })}
              placeholder="month"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Description</label>
          <input
            type="text"
            value={item.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Short description..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Features (one per line) */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Features (one per line)</label>
          <textarea
            value={item.features.join('\n')}
            onChange={(e) => onChange({ features: e.target.value.split('\n').filter(f => f.trim()) })}
            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            rows={5}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono"
          />
          <p className="text-xs text-slate-500 mt-1">
            {item.features.length} feature{item.features.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Button Text */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Button Text</label>
          <input
            type="text"
            value={item.buttonText}
            onChange={(e) => onChange({ buttonText: e.target.value })}
            placeholder="Get Started"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button Link */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Button Link</label>
          <input
            type="text"
            value={item.buttonLink}
            onChange={(e) => onChange({ buttonLink: e.target.value })}
            placeholder="#"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Highlighted Toggle */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id={`highlighted-${item.id}`}
            checked={item.highlighted}
            onChange={(e) => onChange({ highlighted: e.target.checked })}
            className="rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor={`highlighted-${item.id}`} className="text-xs font-medium text-slate-700">
            Mark as Popular/Featured
          </label>
        </div>
      </div>
    );
  };

  return (
    <ItemsEditor
      items={items}
      onItemsChange={handleItemsChange}
      itemTemplate={{
        name: 'New Tier',
        price: '$49',
        period: 'month',
        description: 'Description here',
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
        buttonText: 'Get Started',
        buttonLink: '#',
        highlighted: false
      }}
      renderItemEditor={renderItemEditor}
      itemLabel="Pricing Tier"
    />
  );
}
