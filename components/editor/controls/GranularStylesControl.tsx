'use client';

// ═══════════════════════════════════════════════════════════════
// GRANULAR STYLES CONTROL - Element-Level Styling (God-Tier 2025)
// ═══════════════════════════════════════════════════════════════
// Allows styling individual elements within complex components
// Example: PricingTable → title, price, description, button separately
// Smart UI: Shows only relevant elements for each component type
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import type { ComponentStyles, ComponentType } from '@/lib/editor/types';
import { PropertyGroup } from './PropertyGroup';

interface GranularStylesControlProps {
  componentId: string;
  componentType: ComponentType;
}

// Define which elements are available for each component type
const ELEMENT_MAP: Record<string, Array<keyof ComponentStyles>> = {
  // Hero/Banner components
  HeroComponent: ['wrapper', 'title', 'subtitle', 'button'],
  Hero: ['wrapper', 'title', 'subtitle', 'button'],
  BannerComponent: ['wrapper', 'title', 'subtitle', 'description', 'button'],

  // Pricing components
  PricingTableComponent: ['wrapper', 'card', 'title', 'description', 'price', 'badge', 'button', 'feature'],
  PricingTable: ['wrapper', 'card', 'title', 'description', 'price', 'badge', 'button', 'feature'],

  // Features components
  FeaturesComponent: ['wrapper', 'header', 'title', 'description', 'icon', 'feature'],
  Features: ['wrapper', 'header', 'title', 'description', 'icon', 'feature'],

  // CTA components
  CTAComponent: ['wrapper', 'title', 'description', 'button'],
  CTA: ['wrapper', 'title', 'description', 'button'],

  // Card components
  CardComponent: ['wrapper', 'header', 'title', 'description', 'footer', 'image'],
  Card: ['wrapper', 'header', 'title', 'description', 'footer', 'image'],

  // Form components
  FormComponent: ['wrapper', 'label', 'input', 'textarea', 'button'],
  Form: ['wrapper', 'label', 'input', 'textarea', 'button'],
  FormBuilderComponent: ['wrapper', 'label', 'input', 'textarea', 'button'],

  // Testimonial
  TestimonialComponent: ['wrapper', 'title', 'description', 'image'],
  Testimonial: ['wrapper', 'title', 'description', 'image'],
};

// Element labels for UI
const ELEMENT_LABELS: Record<keyof ComponentStyles, string> = {
  wrapper: 'Wrapper/Container',
  title: 'Title/Heading',
  subtitle: 'Subtitle',
  description: 'Description/Body',
  label: 'Labels',
  button: 'Buttons',
  link: 'Links',
  image: 'Images',
  icon: 'Icons',
  video: 'Videos',
  price: 'Price',
  badge: 'Badges',
  feature: 'Feature Items',
  card: 'Cards',
  header: 'Header',
  footer: 'Footer',
  input: 'Input Fields',
  textarea: 'Text Areas',
  checkbox: 'Checkboxes',
};

// Common style properties with user-friendly labels
const STYLE_PROPERTIES = [
  { key: 'fontSize', label: 'Font Size', type: 'text', placeholder: '16px' },
  { key: 'fontWeight', label: 'Font Weight', type: 'select', options: ['normal', 'bold', '300', '400', '500', '600', '700', '800'] },
  { key: 'color', label: 'Text Color', type: 'color' },
  { key: 'backgroundColor', label: 'Background', type: 'color' },
  { key: 'padding', label: 'Padding', type: 'text', placeholder: '1rem' },
  { key: 'margin', label: 'Margin', type: 'text', placeholder: '0.5rem' },
  { key: 'borderRadius', label: 'Border Radius', type: 'text', placeholder: '8px' },
  { key: 'textAlign', label: 'Align', type: 'select', options: ['left', 'center', 'right', 'justify'] },
];

export function GranularStylesControl({ componentId, componentType }: GranularStylesControlProps) {
  const [selectedElement, setSelectedElement] = useState<keyof ComponentStyles | null>(null);
  const component = useCanvasStore((state) => state.getComponentById(componentId));
  const updateComponentProps = useCanvasStore((state) => state.updateComponentProps);

  if (!component) return null;

  const availableElements = ELEMENT_MAP[componentType] || [];
  if (availableElements.length === 0) return null;

  const currentStyles = (component.props.styles as ComponentStyles) || {};
  const elementStyle = selectedElement ? (currentStyles[selectedElement] || {}) : {};

  const updateElementStyle = (property: string, value: string) => {
    if (!selectedElement) return;

    const newStyles: ComponentStyles = {
      ...currentStyles,
      [selectedElement]: {
        ...(currentStyles[selectedElement] || {}),
        [property]: value,
      },
    };

    updateComponentProps(componentId, { styles: newStyles });
  };

  const clearElementStyle = () => {
    if (!selectedElement) return;

    const newStyles = { ...currentStyles };
    delete newStyles[selectedElement];

    updateComponentProps(componentId, { styles: newStyles });
    setSelectedElement(null);
  };

  return (
    <PropertyGroup title="Element Styles" storageKey="granular-styles" defaultExpanded={false}>
      <div className="space-y-4">
        {/* Element Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Select Element to Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableElements.map((element) => {
              const hasStyles = currentStyles[element] && Object.keys(currentStyles[element] as object).length > 0;
              return (
                <button
                  key={element}
                  onClick={() => setSelectedElement(element)}
                  className={`
                    px-3 py-2 text-xs font-medium rounded border transition-all relative
                    ${selectedElement === element
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }
                  `}
                >
                  {ELEMENT_LABELS[element]}
                  {hasStyles && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" title="Has custom styles" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Style Properties for Selected Element */}
        {selectedElement && (
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-800">
                {ELEMENT_LABELS[selectedElement]} Styles
              </h4>
              {Object.keys(elementStyle).length > 0 && (
                <button
                  onClick={clearElementStyle}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Clear Styles
                </button>
              )}
            </div>

            <div className="space-y-3">
              {STYLE_PROPERTIES.map((prop) => (
                <div key={prop.key}>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {prop.label}
                  </label>

                  {prop.type === 'text' && (
                    <input
                      type="text"
                      value={(elementStyle[prop.key as keyof React.CSSProperties] as string) || ''}
                      onChange={(e) => updateElementStyle(prop.key, e.target.value)}
                      placeholder={prop.placeholder}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  )}

                  {prop.type === 'color' && (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={(elementStyle[prop.key as keyof React.CSSProperties] as string) || '#000000'}
                        onChange={(e) => updateElementStyle(prop.key, e.target.value)}
                        className="w-12 h-9 border border-slate-200 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={(elementStyle[prop.key as keyof React.CSSProperties] as string) || ''}
                        onChange={(e) => updateElementStyle(prop.key, e.target.value)}
                        placeholder="#000000"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  )}

                  {prop.type === 'select' && (
                    <select
                      value={(elementStyle[prop.key as keyof React.CSSProperties] as string) || ''}
                      onChange={(e) => updateElementStyle(prop.key, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">Default</option>
                      {prop.options?.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Message */}
        {!selectedElement && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            💡 Select an element above to customize its styles independently
          </div>
        )}
      </div>
    </PropertyGroup>
  );
}
